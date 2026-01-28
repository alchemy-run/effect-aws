import type { LanguageModel } from "@effect/ai/LanguageModel";
import type {
  AssistantMessageEncoded,
  MessageEncoded,
  SystemMessageEncoded,
  ToolCallPartEncoded,
  ToolMessageEncoded,
  ToolResultPartEncoded,
} from "@effect/ai/Prompt";
import * as EffectTool from "@effect/ai/Tool";
import * as EffectToolkit from "@effect/ai/Toolkit";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as S from "effect/Schema";
import { isAgent, type Agent } from "./agent.ts";
import { isChannel, type Channel } from "./chat/channel.ts";
import { isGroup, type Group } from "./chat/group.ts";
import { isFile, type File } from "./file/file.ts";
import { isTool, type Tool } from "./tool/tool.ts";
import { isToolkit, type Toolkit } from "./toolkit/toolkit.ts";
import { collectReferences } from "./util/collect-references.ts";
import {
  isThunk,
  renderTemplate,
  resolveThunk,
  type Thunk,
} from "./util/render-template.ts";

// Re-export thunk utilities for backwards compatibility
export { isThunk, resolveThunk };
export type { Thunk };

export interface AgentContext {
  messages: MessageEncoded[];
  toolkit: EffectToolkit.Toolkit<Record<string, EffectTool.Any>>;
  toolkitHandlers: Layer.Layer<
    EffectTool.Handler<string> | LanguageModel,
    never,
    never
  >;
}

/**
 * Options for creating an agent context.
 */
export interface CreateContextOptions {
  /**
   * Additional toolkits to include in the context.
   * These are merged with toolkits discovered from the agent's references.
   */
  tools?: Toolkit[];

  /**
   * Model name for determining tool aliases.
   * Used to register tools with provider-specific names (e.g., "AnthropicBash" for Claude models).
   */
  model?: string;
}

interface FileEntry {
  id: string;
  language: string;
  description: string;
  content: string;
}

export const createContext: (
  agent: Agent,
  options?: CreateContextOptions,
) => Effect.Effect<AgentContext, never, FileSystem.FileSystem> = Effect.fn(
  function* (agent: Agent, options?: CreateContextOptions) {
    const additionalToolkits = options?.tools ?? [];
    const model = options?.model;
    const fs = yield* FileSystem.FileSystem;

    const visited = new Set<string>();
    const agents: Array<{ id: string; content: string }> = [];
    const channels: Array<{ id: string; content: string }> = [];
    const groups: Array<{ id: string; content: string }> = [];
    const files: Array<FileEntry> = [];
    const toolkits: Array<{ id: string; content: string }> = [];

    // Collect all references first (sync), then read files (async)
    const pendingFiles: Array<{ ref: File }> = [];

    /**
     * Collects references with depth tracking.
     * Only direct references (depth=1) are embedded in the context.
     * Transitive references (depth>1) are accessible via send/query tools.
     *
     * @param rawRef - The reference to collect
     * @param depth - Current depth level (1 = direct reference from root)
     */
    const collect = (rawRef: any, depth: number): void => {
      // Resolve thunks to get the actual reference
      const ref = resolveThunk(rawRef);

      if (!ref) return;
      // Skip primitives - only process objects and classes (functions with type/id)
      if (typeof ref !== "object" && typeof ref !== "function") return;
      const key = `${ref.type}:${ref.id}`;
      if (visited.has(key)) return;
      visited.add(key);

      if (isAgent(ref)) {
        // Only embed direct agent references (depth=1)
        if (depth <= 1) {
          agents.push({
            id: ref.id,
            content: renderTemplate(ref.template, ref.references),
          });
        }
        // Do NOT recurse into agent references - transitive agents are accessed via tools
      } else if (isChannel(ref)) {
        // Only embed direct channel references (depth=1)
        if (depth <= 1) {
          channels.push({
            id: ref.id,
            content: renderTemplate(ref.template, ref.references),
          });
          // Continue collecting from channel references (agents, files, etc.)
          ref.references.forEach((r: any) => collect(r, depth));
        }
      } else if (isGroup(ref)) {
        // Only embed direct group references (depth=1)
        if (depth <= 1) {
          groups.push({
            id: ref.id,
            content: renderTemplate(ref.template, ref.references),
          });
          // Continue collecting from group references (agents, files, etc.)
          ref.references.forEach((r: any) => collect(r, depth));
        }
      } else if (isFile(ref)) {
        // Only embed files from direct references (depth=1)
        if (depth <= 1) {
          pendingFiles.push({ ref });
          // Continue collecting from file references at same depth
          ref.references.forEach((r: any) => collect(r, depth));
        }
      } else if (isToolkit(ref)) {
        // Only embed toolkits from direct references (depth=1)
        if (depth <= 1) {
          toolkits.push({
            id: ref.id,
            content: renderTemplate(ref.template, ref.references).trim(),
          });
          // Continue collecting from toolkit references at same depth (for files, etc.)
          ref.references.forEach((r: any) => collect(r, depth));
        }
      } else if (isTool(ref)) {
        // Tools can reference files, agents, etc. in their descriptions
        // Only collect if at depth 1
        if (depth <= 1) {
          ref.references?.forEach((r: any) => collect(r, depth));
        }
      }
    };

    // Render the root agent template
    const rootContent = renderTemplate(agent.template, agent.references);

    // Collect all references from root at depth=1 (direct references)
    agent.references.forEach((r) => collect(r, 1));

    // Add additional toolkits to the system prompt
    for (const toolkit of additionalToolkits) {
      const key = `${toolkit.type}:${toolkit.id}`;
      if (!visited.has(key)) {
        visited.add(key);
        toolkits.push({
          id: toolkit.id,
          content: renderTemplate(toolkit.template, toolkit.references).trim(),
        });
      }
    }

    // Read all files in parallel
    for (const { ref } of pendingFiles) {
      const content = yield* fs
        .readFileString(ref.id)
        .pipe(Effect.catchAll(() => Effect.succeed("// File not found")));
      files.push({
        id: ref.id,
        language: ref.language,
        description: renderTemplate(ref.template, ref.references),
        content,
      });
    }

    // Local counter for generating unique tool call IDs within this context
    let toolCallIdCounter = 0;
    const createToolCallId = (prefix: string): string =>
      `ctx-${prefix}-${toolCallIdCounter++}`;

    // Build the messages array
    const messages: MessageEncoded[] = [];

    // Build system message with preamble, root content, and toolkit descriptions
    const systemParts: string[] = [preamble(agent.id), rootContent];

    if (toolkits.length > 0) {
      systemParts.push("\n\n---\n");
      systemParts.push("\n## Toolkits\n\n");
      systemParts.push(
        "You can (and should) use the following tools to accomplish your tasks. Tool definitions are provided separately.\n\n",
      );
      systemParts.push(
        toolkits.map((t) => `### ${t.id}\n\n${t.content}`).join("\n\n"),
      );
      systemParts.push("\n");
    }

    const systemMessage: SystemMessageEncoded = {
      role: "system",
      content: systemParts.join(""),
    };
    messages.push(systemMessage);

    // Collect all tool calls and results for batching
    const toolCalls: ToolCallPartEncoded[] = [];
    const toolResults: ToolResultPartEncoded[] = [];

    // Write agent context files and collect read tool parts for each agent
    if (agents.length > 0) {
      // Ensure .distilled/agents directory exists
      yield* fs
        .makeDirectory(".distilled/agents", { recursive: true })
        .pipe(Effect.catchAll(() => Effect.void));

      for (const a of agents) {
        const agentContent = `# @${a.id}\n\n${a.content}`;
        const agentFilePath = `.distilled/agents/${a.id}.md`;

        // Write the agent context file
        yield* fs
          .writeFileString(agentFilePath, agentContent)
          .pipe(Effect.catchAll(() => Effect.void));

        // Collect tool call and result parts for this agent
        const [toolCall, toolResult] = createAgentReadParts(
          createToolCallId("agent"),
          a.id,
          agentContent,
        );
        toolCalls.push(toolCall);
        toolResults.push(toolResult);
      }
    }

    // Write channel context files and collect read tool parts for each channel
    if (channels.length > 0) {
      // Ensure .distilled/channels directory exists
      yield* fs
        .makeDirectory(".distilled/channels", { recursive: true })
        .pipe(Effect.catchAll(() => Effect.void));

      for (const c of channels) {
        const channelContent = `# #${c.id}\n\n${c.content}`;
        const channelFilePath = `.distilled/channels/${c.id}.md`;

        // Write the channel context file
        yield* fs
          .writeFileString(channelFilePath, channelContent)
          .pipe(Effect.catchAll(() => Effect.void));

        // Collect tool call and result parts for this channel
        const [toolCall, toolResult] = createChannelReadParts(
          createToolCallId("channel"),
          c.id,
          channelContent,
        );
        toolCalls.push(toolCall);
        toolResults.push(toolResult);
      }
    }

    // Write group context files and collect read tool parts for each group
    if (groups.length > 0) {
      // Ensure .distilled/groups directory exists
      yield* fs
        .makeDirectory(".distilled/groups", { recursive: true })
        .pipe(Effect.catchAll(() => Effect.void));

      for (const g of groups) {
        const groupContent = `# ${g.id}\n\n${g.content}`;
        const groupFilePath = `.distilled/groups/${g.id}.md`;

        // Write the group context file
        yield* fs
          .writeFileString(groupFilePath, groupContent)
          .pipe(Effect.catchAll(() => Effect.void));

        // Collect tool call and result parts for this group
        const [toolCall, toolResult] = createGroupReadParts(
          createToolCallId("group"),
          g.id,
          groupContent,
        );
        toolCalls.push(toolCall);
        toolResults.push(toolResult);
      }
    }

    // Collect read/glob tool parts for each file/folder
    for (const f of files) {
      if (f.language === "folder") {
        // For folders, use glob to list contents
        const folderFiles = f.content
          .split("\n")
          .filter((line) => line.trim() !== "");
        const [toolCall, toolResult] = createGlobToolParts(
          createToolCallId("folder"),
          f.id,
          "**/*",
          folderFiles,
        );
        toolCalls.push(toolCall);
        toolResults.push(toolResult);
      } else {
        // For regular files, use read
        const [toolCall, toolResult] = createReadToolParts(
          createToolCallId("file"),
          f.id,
          f.content,
        );
        toolCalls.push(toolCall);
        toolResults.push(toolResult);
      }
    }

    // Add single batched message pair if there are any tool calls
    if (toolCalls.length > 0) {
      const assistantMsg: AssistantMessageEncoded = {
        role: "assistant",
        content: toolCalls,
      };
      const toolMsg: ToolMessageEncoded = {
        role: "tool",
        content: toolResults,
      };
      messages.push(assistantMsg, toolMsg);
    }

    // Build the combined Effect toolkit from all collected and additional toolkits
    const collectedToolkits = collectToolkits(agent);
    const allToolkits = [...collectedToolkits, ...additionalToolkits];
    const effectToolkit =
      allToolkits.length > 0
        ? EffectToolkit.merge(
            ...allToolkits.map((tk) => createEffectToolkit(tk, model)),
          )
        : EffectToolkit.empty;

    // Create the handler layer from all toolkits

    return {
      messages,
      toolkit: effectToolkit,
      toolkitHandlers: createHandlerLayer(allToolkits, model) as any,
    } satisfies AgentContext;
  },
);

/**
 * Creates the preamble for an agent context, including the agent identifier and symbol reference.
 */
export const preamble = (agentId: string): string =>
  `You are @${agentId}, an agent configured with the following context.

## Symbol Reference

Throughout this context, you will see the following symbols:

- \`@name\` - References an agent you can communicate with
- \`#name\` - References a channel for group communication
- \`@{member1, member2}\` - References a group chat with the listed members
- \`🧰name\` - References a toolkit containing related tools
- \`🛠️name\` - References a tool you can use
- \`[filename](path)\` - References a file in the codebase
- \`\${name}\` - References a tool input parameter
- \`^{name}\` - References a tool output field

## Agent Communication

Your context includes only your **direct collaborators** (agents you reference directly).
To gather information from other agents in the organization:

- Use \`🛠️send\` to send a message to an agent and receive a response
- Use \`🛠️query\` to request structured data from an agent

Direct collaborators can themselves communicate with their own collaborators,
forming a delegation chain. Don't hesitate to ask your collaborators for help.

---

`;

/**
 * Creates a pair of messages simulating a read tool call and its result.
 * Used for embedding file content in the agent context.
 * @deprecated Use createReadToolParts for batched tool calls
 */
export const createReadToolMessages = (
  id: string,
  filePath: string,
  content: string,
): [AssistantMessageEncoded, ToolMessageEncoded] => [
  {
    role: "assistant",
    content: [
      {
        type: "tool-call",
        id,
        name: "read",
        params: { filePath },
        providerExecuted: false,
      },
    ],
  },
  {
    role: "tool",
    content: [
      {
        type: "tool-result",
        id,
        name: "read",
        isFailure: false,
        result: { content },
        providerExecuted: false,
      },
    ],
  },
];

/**
 * Creates a pair of messages simulating a glob tool call and its result.
 * Used for embedding folder listings in the agent context.
 * @deprecated Use createGlobToolParts for batched tool calls
 */
export const createGlobToolMessages = (
  id: string,
  path: string,
  pattern: string,
  files: string[],
): [AssistantMessageEncoded, ToolMessageEncoded] => [
  {
    role: "assistant",
    content: [
      {
        type: "tool-call",
        id,
        name: "glob",
        params: { pattern, path },
        providerExecuted: false,
      },
    ],
  },
  {
    role: "tool",
    content: [
      {
        type: "tool-result",
        id,
        name: "glob",
        isFailure: false,
        result: { files: files.join("\n") },
        providerExecuted: false,
      },
    ],
  },
];

/**
 * Creates a pair of messages simulating reading an agent context file.
 * Agent context is stored in .distilled/agents/{agent-id}.md
 * @deprecated Use createAgentReadParts for batched tool calls
 */
export const createAgentReadMessages = (
  id: string,
  agentId: string,
  content: string,
): [AssistantMessageEncoded, ToolMessageEncoded] => {
  const filePath = `.distilled/agents/${agentId}.md`;
  return [
    {
      role: "assistant",
      content: [
        {
          type: "tool-call",
          id,
          name: "read",
          params: { filePath },
          providerExecuted: false,
        },
      ],
    },
    {
      role: "tool",
      content: [
        {
          type: "tool-result",
          id,
          name: "read",
          isFailure: false,
          result: { content },
          providerExecuted: false,
        },
      ],
    },
  ];
};

/**
 * Creates tool call and result parts for reading a file.
 * Used for batching multiple file reads into a single message pair.
 */
export const createReadToolParts = (
  id: string,
  filePath: string,
  content: string,
): [ToolCallPartEncoded, ToolResultPartEncoded] => [
  {
    type: "tool-call",
    id,
    name: "read",
    params: { filePath },
    providerExecuted: false,
  },
  {
    type: "tool-result",
    id,
    name: "read",
    isFailure: false,
    result: { content },
    providerExecuted: false,
  },
];

/**
 * Creates tool call and result parts for a glob operation.
 * Used for batching multiple folder listings into a single message pair.
 */
export const createGlobToolParts = (
  id: string,
  path: string,
  pattern: string,
  files: string[],
): [ToolCallPartEncoded, ToolResultPartEncoded] => [
  {
    type: "tool-call",
    id,
    name: "glob",
    params: { pattern, path },
    providerExecuted: false,
  },
  {
    type: "tool-result",
    id,
    name: "glob",
    isFailure: false,
    result: { files: files.join("\n") },
    providerExecuted: false,
  },
];

/**
 * Creates tool call and result parts for reading an agent context file.
 * Agent context is stored in .distilled/agents/{agent-id}.md
 * Used for batching multiple agent reads into a single message pair.
 */
export const createAgentReadParts = (
  id: string,
  agentId: string,
  content: string,
): [ToolCallPartEncoded, ToolResultPartEncoded] => {
  const filePath = `.distilled/agents/${agentId}.md`;
  return [
    {
      type: "tool-call",
      id,
      name: "read",
      params: { filePath },
      providerExecuted: false,
    },
    {
      type: "tool-result",
      id,
      name: "read",
      isFailure: false,
      result: { content },
      providerExecuted: false,
    },
  ];
};

/**
 * Creates tool call and result parts for reading a channel context file.
 * Channel context is stored in .distilled/channels/{channel-id}.md
 * Used for batching multiple channel reads into a single message pair.
 */
export const createChannelReadParts = (
  id: string,
  channelId: string,
  content: string,
): [ToolCallPartEncoded, ToolResultPartEncoded] => {
  const filePath = `.distilled/channels/${channelId}.md`;
  return [
    {
      type: "tool-call",
      id,
      name: "read",
      params: { filePath },
      providerExecuted: false,
    },
    {
      type: "tool-result",
      id,
      name: "read",
      isFailure: false,
      result: { content },
      providerExecuted: false,
    },
  ];
};

/**
 * Creates tool call and result parts for reading a group context file.
 * Group context is stored in .distilled/groups/{group-id}.md
 * Used for batching multiple group reads into a single message pair.
 */
export const createGroupReadParts = (
  id: string,
  groupId: string,
  content: string,
): [ToolCallPartEncoded, ToolResultPartEncoded] => {
  const filePath = `.distilled/groups/${groupId}.md`;
  return [
    {
      type: "tool-call",
      id,
      name: "read",
      params: { filePath },
      providerExecuted: false,
    },
    {
      type: "tool-result",
      id,
      name: "read",
      isFailure: false,
      result: { content },
      providerExecuted: false,
    },
  ];
};

/**
 * Collects toolkits from an agent's direct references only.
 * Recurses into files, tools, and toolkits but NOT into agents.
 * Handles arrays and plain objects in references (e.g., ${[toolkit1, toolkit2]}).
 */
export const collectToolkits = (agent: Agent): Toolkit[] =>
  collectReferences(agent.references ?? [], {
    matches: isToolkit,
    // Recurse into toolkits, files, and tools to find nested toolkits
    // Do NOT recurse into agents - transitive toolkits are not included
    shouldRecurse: (v) => isToolkit(v) || isFile(v) || isTool(v),
  });

/**
 * Converts a distilled-code Toolkit to an @effect/ai Toolkit.
 *
 * @param toolkit - The distilled-code toolkit to convert
 * @param model - Optional model name to determine tool aliases
 */
export const createEffectToolkit = <T extends Toolkit>(
  toolkit: T,
  model?: string,
): EffectToolkit.Toolkit<EffectToolkit.ToolsByName<EffectTool.Any[]>> => {
  const effectTools = toolkit.tools.map((tool) =>
    createEffectTool(tool, model),
  );
  return EffectToolkit.make(...effectTools);
};

/**
 * Creates a handler layer from distilled-code toolkits.
 * This layer provides the handler implementations for the @effect/ai toolkit.
 */
export const createHandlerLayer = (
  toolkits: Toolkit[],
  model?: string,
): Layer.Layer<EffectTool.Handler<string>, never, never> => {
  if (toolkits.length === 0) {
    return Layer.empty as any;
  }

  // Collect all tools from all toolkits
  const allTools = toolkits.flatMap((tk) => tk.tools);

  // Build handlers map from the original distilled-code tools
  // The handler name must match the tool name in the Effect toolkit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlers: any = {};
  for (const tool of allTools) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (params: any) => (tool.handler as any)(params);

    // Determine the tool name - must match what's used in createEffectTool
    const toolName =
      model && tool.alias ? (tool.alias(model) ?? tool.id) : tool.id;

    handlers[toolName] = handler;
  }

  // Create the @effect/ai toolkit from all toolkits
  const effectToolkit = EffectToolkit.merge(
    ...toolkits.map((tk) => createEffectToolkit(tk, model)),
  );

  // Use toLayer to create the handler layer
  return effectToolkit.toLayer(handlers) as any;
};

/**
 * Converts a distilled-code Tool to an @effect/ai Tool.
 * Extracts the description from the template and maps input/output schemas.
 *
 * @param tool - The distilled-code tool to convert
 * @param model - Optional model name to determine alias (e.g., "claude-3-5-sonnet")
 */
export const createEffectTool = <T extends Tool>(
  tool: T,
  model?: string,
): EffectTool.Any => {
  // Render the description from the tool's template
  const description = renderTemplate(tool.template, tool.references);

  // Get the input schema fields - tool.input is a Schema.Struct created by deriveSchema
  // We need to extract the fields from it
  const inputSchema = tool.input;
  const parameters =
    inputSchema && "fields" in inputSchema
      ? (inputSchema as any as S.Struct<S.Struct.Fields>).fields
      : {};

  // Get the output schema
  const outputSchema = tool.output ?? S.Any;

  // Determine the tool name - use alias for provider-specific naming
  const toolName =
    model && tool.alias ? (tool.alias(model) ?? tool.id) : tool.id;

  return EffectTool.make(toolName, {
    description,
    parameters,
    success: outputSchema,
  });
};
