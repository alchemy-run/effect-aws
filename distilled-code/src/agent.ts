import type { AiError } from "@effect/ai/AiError";
import * as Chat from "@effect/ai/Chat";
import type {
  GenerateObjectResponse,
  LanguageModel,
} from "@effect/ai/LanguageModel";
import * as Prompt from "@effect/ai/Prompt";
import type { Handler } from "@effect/ai/Tool";
import type { FileSystem } from "@effect/platform/FileSystem";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import { createContext } from "./context.ts";
import type { Fragment } from "./fragment.ts";
import { input } from "./input.ts";
import { output } from "./output.ts";
import {
  StateStore,
  StateStoreError,
  type MessagePart,
} from "./state/index.ts";
import { toText } from "./stream.ts";
import { tool } from "./tool/tool.ts";
import { Toolkit } from "./toolkit/toolkit.ts";
import {
  schemaFromJsonSchema,
  type JsonSchema7Root,
} from "./util/json-schema.ts";
import { log } from "./util/log.ts";

export const isAgent = (x: any): x is Agent => x?.type === "agent";

export interface IAgent<
  Name extends string,
  References extends any[],
> extends Fragment<"agent", Name, References> {}

export type Agent<
  Name extends string = string,
  References extends any[] = any[],
> = IAgent<Name, References> & {
  new (_: never): IAgent<Name, References>;
};

export const Agent =
  <ID extends string>(id: ID) =>
  <References extends any[]>(
    template: TemplateStringsArray,
    ...references: References
  ) =>
    class {
      static readonly type = "agent";
      static readonly id = id;
      static readonly references = references;
      static readonly template = template;
      constructor(_: never) {}
    } as Agent<ID, References>;

export interface AgentInstance<A extends Agent<string, any[]>> {
  agent: A;
  send: (
    prompt: string,
  ) => Stream.Stream<
    MessagePart,
    AiError | StateStoreError,
    LanguageModel | Handler<string> | StateStore
  >;
  query: <A>(
    prompt: string,
    schema: S.Schema<A, any>,
  ) => Effect.Effect<
    GenerateObjectResponse<{}, A>,
    AiError | StateStoreError,
    LanguageModel | Handler<string> | StateStore
  >;
}

/**
 * Options for spawning an agent instance.
 */
export interface SpawnOptions {
  /**
   * Optional thread ID for the agent. Defaults to the agent's ID.
   */
  threadId?: string;

  /**
   * Optional model name for tool aliasing.
   * Used to register tools with provider-specific names (e.g., "AnthropicBash" for Claude).
   * If not provided, attempts to read from ANTHROPIC_MODEL_ID environment variable.
   */
  model?: string;
}

export const spawn: <A extends Agent<string, any[]>>(
  agent: A,
  threadIdOrOptions?: string | SpawnOptions,
) => Effect.Effect<
  AgentInstance<A>,
  AiError | StateStoreError,
  LanguageModel | Handler<string> | StateStore | FileSystem
> = Effect.fn(function* <A extends Agent<string, any[]>>(
  agent: A,
  threadIdOrOptions?: string | SpawnOptions,
) {
  // Handle both old signature (threadId?: string) and new signature (options?: SpawnOptions)
  const options: SpawnOptions =
    typeof threadIdOrOptions === "string"
      ? { threadId: threadIdOrOptions }
      : (threadIdOrOptions ?? {});
  const threadId = options.threadId ?? agent.id;
  const model =
    options.model ?? process.env.ANTHROPIC_MODEL_ID ?? "claude-sonnet-4-5";
  const store = yield* StateStore;

  // Agent ID is the agent's unique identifier
  const agentId = agent.id;

  // Recover from crash: flush any partial parts from previous session
  yield* flush(store, agentId, threadId);

  // Get messages to hydrate chat
  const storedMessages = yield* store.readThreadMessages(agentId, threadId);
  log("spawn", "loaded chat history", JSON.stringify(storedMessages, null, 2));

  // Track whether context messages have been sent
  // They should only be sent once at the start of a conversation
  let contextSent = storedMessages.length > 0;

  const chat = yield* Chat.fromPrompt(storedMessages);

  // Semaphore for exclusive access
  const sem = yield* Effect.makeSemaphore(1);
  const locked = <A, E, R>(fn: Effect.Effect<A, E, R>) =>
    sem.withPermits(1)(fn);
  const self = agent;

  // Build a map of agent ID -> Agent for O(1) lookups
  const agents = new Map<string, Agent>();
  const collectAgents = (ref: Agent): void => {
    if (agents.has(ref.id) || ref.id === self.id) return;
    agents.set(ref.id, ref);
    ref.references.filter(isAgent).forEach(collectAgents);
  };
  // Start by collecting from the root agent's references (not the root itself)
  agent.references.filter(isAgent).forEach(collectAgents);

  // Map of spawned agent instances (lazy - spawned on first use)
  const spawned = new Map<string, AgentInstance<any>>();

  // Get or spawn a child agent by ID
  const lookupAgent = Effect.fn(function* (recipient: string) {
    if (!spawned.has(recipient)) {
      const childAgent = agents.get(recipient);
      if (!childAgent) {
        return yield* Effect.fail(
          `Agent "${recipient}" not found. Available agents: ${[...agents.keys()].join(", ")}`,
        );
      }
      spawned.set(recipient, yield* spawn(childAgent, threadId));
    }
    return spawned.get(recipient)!;
  });

  const message = input("message")`The message to send`;
  const recipient = input(
    "recipient",
    // we shouldn't do this because more agents can be discovered later
    // S.Literal(...children.map((a) => a.agent.id)),
  )`The absolute path/ID of the recipient agent, e.g. a/b/c for agent @a/b/c`;
  const send = tool(
    "send",
  )`Send a ${message} to ${recipient}, receive a response as a ${S.String}`(
    function* ({ message, recipient }) {
      return yield* (yield* lookupAgent(recipient))
        .send(message)
        .pipe(toText("last-message"));
    },
  );

  const schema = input("schema")`The expected schema of the query response`;
  const object = output("object", S.Any);
  const query = tool(
    "query",
  )`Send a query ${message} to the ${recipient} agent and receive back a structured ${object} with the expected schema ${schema}`(
    function* ({ recipient, message, schema: jsonSchema }) {
      return {
        object: (yield* (yield* lookupAgent(recipient)).query(
          message,
          schemaFromJsonSchema(
            JSON.parse(jsonSchema) as JsonSchema7Root,
          ) as any,
        )).value,
      };
    },
  );

  class Comms extends Toolkit(
    "Comms",
  )`Tools for communicating with other agents. Use these tools to coordinate work with other agents.

- ${send}
- ${query}` {}

  const context = yield* createContext(agent, {
    tools: [Comms],
    model,
  });

  return {
    agent,
    send: (prompt: string) =>
      Stream.unwrap(
        locked(
          Effect.gen(function* () {
            // Append user input part
            yield* store.appendThreadPart(agentId, threadId, {
              type: "user-input",
              content: prompt,
              timestamp: Date.now(),
            });

            // Flush user input immediately
            yield* flush(store, agentId, threadId);

            // Only include context messages on first call (when history is empty)
            // Otherwise the context messages are already in the chat history
            // and including them again would create duplicate tool_use IDs
            const includeContext = !contextSent;
            const fullPrompt = includeContext
              ? [
                  ...context.messages,
                  {
                    role: "user" as const,
                    content: prompt,
                  },
                ]
              : [
                  {
                    role: "user" as const,
                    content: prompt,
                  },
                ];

            // Mark context as sent for subsequent calls
            contextSent = true;

            log(
              "send",
              "prompt",
              JSON.stringify(
                { includeContext, messageCount: fullPrompt.length },
                null,
                2,
              ),
            );

            return chat
              .streamText({
                toolkit: context.toolkit,
                prompt: fullPrompt,
              })
              .pipe(
                // Provide the handler layer for tool execution
                Stream.provideLayer(context.toolkitHandlers),
                Stream.tapError((error) =>
                  Effect.sync(() => log("send", "error", error)),
                ),
                // Forward parts to store
                Stream.tap((part) => {
                  const threadPart = part as MessagePart;
                  return Effect.gen(function* () {
                    yield* store.appendThreadPart(
                      agentId,
                      threadId,
                      threadPart,
                    );
                    // Check if message boundary reached
                    if (isMessageBoundary(threadPart)) {
                      yield* flush(store, agentId, threadId);
                    }
                  });
                }),
                Stream.map((part) => part as MessagePart),
              );
          }),
        ),
      ),
    query: <A>(prompt: string, schema: S.Schema<A, any>) =>
      locked(
        Effect.provide(
          chat
            .generateObject({
              toolkit: context.toolkit,
              schema,
              prompt: [
                ...context.messages,
                {
                  role: "user" as const,
                  content: prompt,
                },
              ],
            })
            .pipe(
              Effect.tapError((error) =>
                Effect.sync(() => log("query", "error", error)),
              ),
            ),
          context.toolkitHandlers,
        ),
      ),
  } satisfies AgentInstance<A>;
});

/**
 * Check if a part completes a message boundary.
 */
const isMessageBoundary = (part: MessagePart): boolean =>
  part.type === "user-input" ||
  part.type === "text-end" ||
  part.type === "reasoning-end" ||
  part.type === "tool-call" ||
  part.type === "tool-result";

/**
 * Flush parts to messages: reads accumulated parts, converts them to messages
 * using Prompt.fromResponseParts, writes messages, and truncates parts.
 */
const flush = (
  store: StateStore,
  agentId: string,
  threadId: string,
): Effect.Effect<void, StateStoreError> =>
  Effect.gen(function* () {
    const parts = yield* store.readThreadParts(agentId, threadId);
    log(
      "flush",
      "parts",
      JSON.stringify(
        parts.map((p) => ({ type: p.type, id: (p as any).id })),
        null,
        2,
      ),
    );
    if (parts.length === 0) return;

    // Check for user-input first (not a Response part)
    const firstPart = parts[0];
    if (firstPart.type === "user-input") {
      // User input becomes a user message
      const currentMessages = yield* store.readThreadMessages(
        agentId,
        threadId,
      );
      yield* store.writeThreadMessages(agentId, threadId, [
        ...currentMessages,
        {
          role: "user" as const,
          content: firstPart.content,
        },
      ]);
      yield* store.truncateThreadParts(agentId, threadId);
      return;
    }

    // Use @effect/ai's Prompt.fromResponseParts for all AI response parts
    // It handles all the streaming accumulation logic properly
    const prompt = Prompt.fromResponseParts(
      parts.filter((p) => p.type !== "user-input") as any[],
    );

    const encode = S.encode(Prompt.Message);

    // Extract messages from the Prompt
    const messages = yield* Effect.all(
      prompt.content.map((msg) => encode(msg).pipe(Effect.orDie)),
    );

    if (messages.length > 0) {
      log(
        "flush",
        "writing messages",
        JSON.stringify(
          messages.map((m: any) => ({
            role: m.role,
            contentLength: Array.isArray(m.content) ? m.content.length : 1,
            toolCallIds: Array.isArray(m.content)
              ? m.content
                  .filter((c: any) => c.type === "tool-call")
                  .map((c: any) => c.id)
              : [],
          })),
          null,
          2,
        ),
      );
      const currentMessages = yield* store.readThreadMessages(
        agentId,
        threadId,
      );
      yield* store.writeThreadMessages(agentId, threadId, [
        ...currentMessages,
        ...messages,
      ]);
    }

    yield* store.truncateThreadParts(agentId, threadId);
  });
