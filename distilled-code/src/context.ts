import type {
  AssistantMessageEncoded,
  MessageEncoded,
  SystemMessageEncoded,
  ToolMessageEncoded,
} from "@effect/ai/Prompt";
import * as EffectTool from "@effect/ai/Tool";
import * as EffectToolkit from "@effect/ai/Toolkit";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import * as yaml from "yaml";
import { isAgent, type Agent } from "./agent.ts";
import { isFile, type File } from "./file/file.ts";
import { isInput } from "./input.ts";
import { isOutput } from "./output.ts";
import { isTool, type Tool } from "./tool/tool.ts";
import { isToolkit, type Toolkit } from "./toolkit/toolkit.ts";
export type { MessageEncoded } from "@effect/ai/Prompt";
export type { Toolkit } from "./toolkit/toolkit.ts";

/**
 * A thunk is a function that returns a reference, enabling forward references.
 * This allows agents to reference other agents that are declared later in the code.
 */
export type Thunk<T = unknown> = () => T;

/**
 * Checks if a value is a thunk (a function that returns a reference).
 * Thunks are zero-argument arrow functions that return references.
 * They are distinguished from other function-like constructs by:
 * - Not being agents, files, toolkits, tools, inputs, outputs, or Effect Schemas
 * - Having no arguments (length === 0)
 */
export const isThunk = (value: unknown): value is Thunk =>
  typeof value === "function" &&
  (value as Function).length === 0 &&
  !isAgent(value) &&
  !isFile(value) &&
  !isToolkit(value) &&
  !isTool(value) &&
  !isInput(value) &&
  !isOutput(value) &&
  !S.isSchema(value);

/**
 * Resolves a value that may be a thunk to its actual value.
 * If the value is a thunk, calls it to get the resolved value.
 * Otherwise, returns the value as-is.
 */
export const resolveThunk = <T>(value: T | Thunk<T>): T =>
  isThunk(value) ? value() : value;

export interface AgentContext {
  messages: MessageEncoded[];
  toolkit: EffectToolkit.Toolkit<Record<string, EffectTool.Any>>;
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
) => Effect.Effect<
  {
    messages: MessageEncoded[];
    toolkit: EffectToolkit.Toolkit<{
      readonly [x: string]: EffectTool.Any;
    }>;
  },
  never,
  FileSystem.FileSystem
> = Effect.fn(function* (agent: Agent, options?: CreateContextOptions) {
  const additionalToolkits = options?.tools ?? [];
  const fs = yield* FileSystem.FileSystem;

  const visited = new Set<string>();
  const agents: Array<{ id: string; content: string }> = [];
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
  const systemParts: string[] = [createPreamble(agent.id), rootContent];

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

  // Write agent context files and add read tool messages for each agent
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

      // Add read tool messages for this agent
      const [assistantMsg, toolMsg] = createAgentReadMessages(
        createToolCallId("agent"),
        a.id,
        agentContent,
      );
      messages.push(assistantMsg, toolMsg);
    }
  }

  // Add read/glob tool messages for each file/folder
  for (const f of files) {
    if (f.language === "folder") {
      // For folders, use glob to list contents
      const folderFiles = f.content
        .split("\n")
        .filter((line) => line.trim() !== "");
      const [assistantMsg, toolMsg] = createGlobToolMessages(
        createToolCallId("folder"),
        f.id,
        "**/*",
        folderFiles,
      );
      messages.push(assistantMsg, toolMsg);
    } else {
      // For regular files, use read
      const [assistantMsg, toolMsg] = createReadToolMessages(
        createToolCallId("file"),
        f.id,
        f.content,
      );
      messages.push(assistantMsg, toolMsg);
    }
  }

  // Build the combined Effect toolkit from all collected and additional toolkits
  const collectedToolkits = collectToolkits(agent);
  const allToolkits = [...collectedToolkits, ...additionalToolkits];
  const effectToolkit =
    allToolkits.length > 0
      ? EffectToolkit.merge(...allToolkits.map(createEffectToolkit))
      : EffectToolkit.empty;

  return {
    messages,
    toolkit: effectToolkit,
  } satisfies AgentContext;
});

/**
 * Creates the preamble for an agent context, including the agent identifier and symbol reference.
 */
export const createPreamble = (agentId: string): string =>
  `You are @${agentId}, an agent configured with the following context.

## Symbol Reference

Throughout this context, you will see the following symbols:

- \`@name\` - References an agent you can communicate with
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
 * Recursively serialize a value, replacing references with their string representations.
 * This produces a plain JSON-serializable object that can be passed to yaml.stringify.
 */
function serialize(rawValue: unknown): unknown {
  // Resolve thunks first to get the actual value
  const value = resolveThunk(rawValue);

  // Handle Agent, File, Toolkit, Tool, Input, Output references
  // These can be classes (functions) so check before typeof checks
  if (isAgent(value)) return `@${value.id}`;
  if (isFile(value)) {
    const filename = value.id.split("/").pop() || value.id;
    return `[${filename}](${value.id})`;
  }
  if (isToolkit(value)) return `🧰${value.id}`;
  if (isTool(value)) return `🛠️${value.id}`;
  if (isInput(value)) return `\${${value.id}}`;
  if (isOutput(value)) return `^{${value.id}}`;

  // Handle primitives and functions
  if (value === null || value === undefined) return value;
  if (typeof value === "function") return String(value);
  if (typeof value !== "object") return value;

  // Handle Set - convert to array
  if (value instanceof Set) return Array.from(value).map(serialize);

  // Handle Array
  if (Array.isArray(value)) return value.map(serialize);

  // Handle plain objects only - for other object types (classes, Schemas, etc.),
  // fall back to string representation to avoid YAML serialization issues
  const proto = Object.getPrototypeOf(value);
  if (proto !== null && proto !== Object.prototype) {
    return String(value);
  }

  // Handle plain Object
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, serialize(v)]),
  );
}

/**
 * Stringifies a value for use in agent context.
 * - Primitives: converted to string
 * - Arrays/Sets/Objects: serialized to YAML
 * - Agent: @{id} reference link
 * - File: [filename](path) markdown link
 * - Toolkit: 🧰{id}
 * - Tool: 🛠️{id}
 * - Input: ${id}
 * - Output: ^{id}
 * - Thunk: resolved to its actual value first
 */
function stringify(rawValue: unknown): string {
  // Resolve thunks first to get the actual value
  const value = resolveThunk(rawValue);

  // Handle Agent, File, Toolkit, Tool, Input, Output references
  if (isAgent(value)) return `@${value.id}`;
  if (isFile(value)) {
    const filename = value.id.split("/").pop() || value.id;
    return `[${filename}](${value.id})`;
  }
  if (isToolkit(value)) return `🧰${value.id}`;
  if (isTool(value)) return `🛠️${value.id}`;
  if (isInput(value)) return `\${${value.id}}`;
  if (isOutput(value)) return `^{${value.id}}`;

  // Handle primitives
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);

  // Handle complex types with YAML
  const serialized = serialize(value);
  return "\n" + yaml.stringify(serialized).trimEnd();
}

/**
 * Renders a template string array with its references, replacing references with stringified values.
 */
function renderTemplate(
  template: TemplateStringsArray,
  references: any[],
): string {
  let result = template[0];
  for (let i = 0; i < references.length; i++) {
    const ref = references[i];
    result += stringify(ref) + template[i + 1];
  }
  return result;
}

/**
 * Collects toolkits from an agent's direct references only.
 * Only collects from depth=1 references - transitive toolkits are not included.
 */
export const collectToolkits = (agent: Agent): Toolkit[] => {
  const toolkits: Toolkit[] = [];
  const visited = new Set<string>();

  /**
   * Collects toolkit references with depth tracking.
   * @param rawRef - The reference to check
   * @param depth - Current depth level (1 = direct reference from root)
   */
  const collect = (rawRef: any, depth: number): void => {
    // Resolve thunks to get the actual reference
    const ref = resolveThunk(rawRef);

    if (!ref) return;
    // Check for both objects and classes (functions with type/id properties)
    if (typeof ref !== "object" && typeof ref !== "function") return;
    const key = `${ref.type}:${ref.id}`;
    if (visited.has(key)) return;
    visited.add(key);

    if (isToolkit(ref)) {
      // Only collect toolkits at depth=1
      if (depth <= 1) {
        toolkits.push(ref);
        // Continue at same depth for nested toolkit references (files, etc.)
        ref.references?.forEach((r: any) => collect(r, depth));
      }
    } else if (isAgent(ref)) {
      // Do NOT recurse into agent references - transitive toolkits are not included
    } else if (isFile(ref)) {
      // Only process at depth=1
      if (depth <= 1) {
        ref.references?.forEach((r: any) => collect(r, depth));
      }
    } else if (isTool(ref)) {
      // Only process at depth=1
      if (depth <= 1) {
        ref.references?.forEach((r: any) => collect(r, depth));
      }
    }
  };

  agent.references?.forEach((r) => collect(r, 1));
  return toolkits;
};

/**
 * Converts a distilled-code Toolkit to an @effect/ai Toolkit.
 */
export const createEffectToolkit = <T extends Toolkit>(
  toolkit: T,
): EffectToolkit.Toolkit<EffectToolkit.ToolsByName<EffectTool.Any[]>> => {
  const effectTools = toolkit.tools.map(createEffectTool);
  return EffectToolkit.make(...effectTools);
};

/**
 * Converts a distilled-code Tool to an @effect/ai Tool.
 * Extracts the description from the template and maps input/output schemas.
 */
export const createEffectTool = <T extends Tool>(tool: T): EffectTool.Any => {
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

  return EffectTool.make(tool.id, {
    description,
    parameters,
    success: outputSchema,
  });
};
