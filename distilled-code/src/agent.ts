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
import * as Schedule from "effect/Schedule";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import { createContext, resolveThunk } from "./context.ts";
import { defineFragment, type Fragment } from "./fragment.ts";
import { input } from "./input.ts";
import { output } from "./output.ts";
import {
  StateStore,
  StateStoreError,
  type MessagePart,
  type MessageWithSender,
} from "./state/index.ts";
import { toText } from "./stream.ts";
import { tool } from "./tool/tool.ts";
import { Toolkit } from "./toolkit/toolkit.ts";
import {
  schemaFromJsonSchema,
  type JsonSchema7Root,
} from "./util/json-schema.ts";
import { log } from "./util/log.ts";
import type { MessageEncoded } from "@effect/ai/Prompt";

/**
 * Extracts all tool_use IDs from a message's content.
 * Tool calls have type "tool-call" and an "id" property.
 */
function extractToolUseIds(message: MessageEncoded): string[] {
  const ids: string[] = [];
  if (Array.isArray(message.content)) {
    for (const block of message.content) {
      if (
        typeof block === "object" &&
        block !== null &&
        "type" in block &&
        block.type === "tool-call" &&
        "id" in block &&
        typeof block.id === "string"
      ) {
        ids.push(block.id);
      }
    }
  }
  return ids;
}

/**
 * Validates and repairs messages to ensure all tool_use IDs are unique.
 * Returns the repaired messages and logs a warning if duplicates were found.
 */
function validateAndRepairMessages(
  messages: readonly MessageEncoded[],
  agentId: string,
  threadId: string,
): readonly MessageEncoded[] {
  const seenIds = new Set<string>();
  const duplicateIds = new Set<string>();

  // First pass: identify duplicates
  for (const message of messages) {
    const ids = extractToolUseIds(message);
    for (const id of ids) {
      if (seenIds.has(id)) {
        duplicateIds.add(id);
      } else {
        seenIds.add(id);
      }
    }
  }

  // If no duplicates, return original messages
  if (duplicateIds.size === 0) {
    return messages;
  }

  // Log warning about duplicates
  log(
    "spawn",
    "WARNING: Found duplicate tool_use IDs in persisted messages, repairing",
    {
      agentId,
      threadId,
      duplicateIds: Array.from(duplicateIds),
    },
  );

  // Second pass: repair by removing duplicate tool-call blocks
  const repairedSeenIds = new Set<string>();
  const repairedMessages: MessageEncoded[] = [];

  for (const message of messages) {
    if (!Array.isArray(message.content)) {
      repairedMessages.push(message);
      continue;
    }

    // Filter out duplicate tool-call blocks
    const repairedContent = message.content.filter((block) => {
      if (
        typeof block === "object" &&
        block !== null &&
        "type" in block &&
        block.type === "tool-call" &&
        "id" in block &&
        typeof block.id === "string"
      ) {
        if (repairedSeenIds.has(block.id)) {
          return false; // Remove duplicate
        }
        repairedSeenIds.add(block.id);
      }
      return true;
    });

    // Only include message if it still has content
    if (repairedContent.length > 0) {
      repairedMessages.push({
        ...message,
        content: repairedContent as any,
      });
    }
  }

  log("spawn", "Repaired messages", {
    originalCount: messages.length,
    repairedCount: repairedMessages.length,
    removedDuplicates: duplicateIds.size,
  });

  return repairedMessages;
}

/**
 * Agent type - an AI agent defined via template.
 * Extends Fragment for template support.
 */
export interface Agent<
  Name extends string = string,
  References extends any[] = any[],
> extends Fragment<"agent", Name, References> {}

/**
 * Create an Agent - an AI agent that can be spawned and communicate with other agents.
 */
export const Agent = defineFragment("agent")();

/**
 * Type guard for Agent entities
 */
export const isAgent = Agent.is<Agent>;

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

  /**
   * If true, skip appending user input to the thread.
   * Used when the user input was already stored by the coordinator.
   * @default false
   */
  skipUserInput?: boolean;
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
  // Use agentId to only flush this agent's parts
  yield* flush(store, threadId, agentId);

  // Get messages to hydrate chat
  const rawStoredMessages = yield* store.readThreadMessages(threadId);
  log("spawn", "loaded chat history", JSON.stringify(rawStoredMessages, null, 2));

  // Validate and repair messages to ensure unique tool_use IDs
  const storedMessages = validateAndRepairMessages(rawStoredMessages, agentId, threadId);

  // If messages were repaired, persist the fixed version
  if (storedMessages !== rawStoredMessages) {
    yield* store.writeThreadMessages(threadId, storedMessages);
    log("spawn", "persisted repaired messages");
  }

  // Track whether context messages have been sent
  // They should only be sent once at the start of a conversation
  let contextSent = storedMessages.length > 0;

  const chat = yield* Chat.fromPrompt(storedMessages);

  // Semaphore for exclusive access to send/query operations
  const sem = yield* Effect.makeSemaphore(1);
  const locked = <A, E, R>(fn: Effect.Effect<A, E, R>) =>
    sem.withPermits(1)(fn);

  // Dedicated semaphore for flush operations to prevent race conditions
  // The main semaphore doesn't protect Stream.tap operations after Stream.unwrap
  const flushSem = yield* Effect.makeSemaphore(1);
  const lockedFlush = (fn: Effect.Effect<void, StateStoreError>) =>
    flushSem.withPermits(1)(fn);

  const self = agent;

  // Build a map of agent ID -> Agent for O(1) lookups
  // Uses a queue-based approach to properly resolve thunks before checking isAgent
  const agents = new Map<string, Agent>();
  const visited = new Set<unknown>();
  const queue: unknown[] = [...agent.references];

  while (queue.length > 0) {
    const item = queue.shift()!;
    const resolved = resolveThunk(item);

    if (resolved === undefined || resolved === null || visited.has(resolved)) {
      continue;
    }
    visited.add(resolved);

    if (isAgent(resolved) && resolved.id !== self.id) {
      if (!agents.has(resolved.id)) {
        agents.set(resolved.id, resolved);
        // Queue its references for processing
        queue.push(...resolved.references);
      }
    }
  }

  // Map of spawned agent instances (lazy - spawned on first use)
  const spawned = new Map<string, AgentInstance<any>>();

  // Error type for agent lookup failures
  type AgentLookupError = { error: true; message: string };

  // Get or spawn a child agent by ID
  // Returns an error object instead of failing, allowing the AI to adapt
  const lookupAgent = Effect.fn(function* (
    recipient: string,
  ): Generator<any, AgentInstance<any> | AgentLookupError, any> {
    if (!spawned.has(recipient)) {
      const childAgent = agents.get(recipient);
      if (!childAgent) {
        // Return error as a result so the AI can see it and adapt
        return {
          error: true as const,
          message: `Agent "${recipient}" not found. Available agents: ${[...agents.keys()].join(", ")}`,
        };
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
      const result = yield* lookupAgent(recipient);
      if ("error" in result) {
        // Return error message to AI so it can adapt
        return result.message;
      }
      return yield* result.send(message).pipe(toText("last-message"));
    },
  );

  const schema = input("schema")`The expected schema of the query response`;
  const object = output("object", S.Any);
  const query = tool(
    "query",
  )`Send a query ${message} to the ${recipient} agent and receive back a structured ${object} with the expected schema ${schema}`(
    function* ({ recipient, message, schema: jsonSchema }) {
      const result = yield* lookupAgent(recipient);
      if ("error" in result) {
        // Return error message to AI so it can adapt
        return { object: { error: result.message } };
      }
      return {
        object: (yield* result.query(
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
            // NOTE: User input is now stored by MessagingService before calling send()
            // This ensures user input goes directly to messages table, not parts buffer,
            // which fixes agent isolation issues in multi-agent channels.

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
                // Retry on transient AI errors (rate limits, server errors)
                Stream.retry(
                  Schedule.recurWhile(isRetryableAiError).pipe(
                    Schedule.intersect(aiRetrySchedule),
                  ),
                ),
                Stream.tapError((error) =>
                  Effect.sync(() => log("send", "error", error)),
                ),
                // Forward parts to store with sender attribution
                Stream.tap((part) => {
                  // Add sender (agentId) to the part for attribution
                  const threadPart = { ...part, sender: agentId } as MessagePart;
                  return Effect.gen(function* () {
                    yield* store.appendThreadPart(threadId, threadPart);
                    // Check if message boundary reached
                    // Use lockedFlush to prevent race conditions in concurrent streams
                    if (isMessageBoundary(threadPart)) {
                      yield* lockedFlush(flush(store, threadId, agentId));
                    }
                  });
                }),
                Stream.map((part) => ({ ...part, sender: agentId }) as MessagePart),
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
              // Retry on transient AI errors (rate limits, server errors)
              Effect.retry(
                Schedule.recurWhile(isRetryableAiError).pipe(
                  Schedule.intersect(aiRetrySchedule),
                ),
              ),
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
 * Check if an AI error is retryable (transient failures like rate limits, server errors).
 */
const isRetryableAiError = (error: unknown): boolean => {
  if (error && typeof error === "object") {
    const err = error as Record<string, unknown>;
    // Rate limit errors (429)
    if (err.status === 429) return true;
    // Server errors (5xx)
    if (typeof err.status === "number" && err.status >= 500 && err.status < 600)
      return true;
    // Timeout errors
    if (
      typeof err.message === "string" &&
      (err.message.includes("timeout") || err.message.includes("Timeout"))
    )
      return true;
  }
  return false;
};

/**
 * Retry schedule for transient AI errors.
 * Uses exponential backoff starting at 1 second, with max 3 retries.
 */
const aiRetrySchedule = Schedule.intersect(
  Schedule.exponential("1 second"),
  Schedule.recurs(3),
);

/**
 * Flush parts to messages: reads accumulated parts, converts them to messages
 * using Prompt.fromResponseParts, writes messages, and truncates parts.
 *
 * This is now always agent-scoped. User input is handled by MessagingService
 * and goes directly to messages, bypassing the parts buffer entirely.
 *
 * @param store - The state store to use
 * @param threadId - The thread to flush
 * @param agentId - Agent ID for scoped flush (required)
 */
const flush = (
  store: StateStore,
  threadId: string,
  agentId: string,
): Effect.Effect<void, StateStoreError> =>
  Effect.gen(function* () {
    // Read only this agent's parts
    const parts = yield* store.readAgentParts(threadId, agentId);

    log(
      "flush",
      "parts",
      JSON.stringify(
        parts.map((p) => ({
          type: p.type,
          id: (p as any).id,
          sender: (p as any).sender,
        })),
        null,
        2,
      ),
    );
    if (parts.length === 0) return;

    // Filter out any non-AI parts (user-input, coordinator events)
    // These shouldn't be in agent parts, but filter defensively
    const aiParts = parts.filter(
      (p) =>
        p.type !== "user-input" &&
        p.type !== "coordinator-thinking" &&
        p.type !== "coordinator-invoke" &&
        p.type !== "coordinator-invoke-complete",
    );

    if (aiParts.length === 0) {
      // Only non-AI parts, just truncate
      yield* store.truncateAgentParts(threadId, agentId);
      return;
    }

    // Use @effect/ai's Prompt.fromResponseParts for all AI response parts
    // It handles all the streaming accumulation logic properly
    const prompt = Prompt.fromResponseParts(aiParts as any[]);

    const encode = S.encode(Prompt.Message);

    // Extract messages from the Prompt
    const messages = yield* Effect.all(
      prompt.content.map((msg) => encode(msg).pipe(Effect.orDie)),
    );

    // Use agentId as sender (always agent-scoped now)
    const sender = agentId;

    if (messages.length > 0) {
      log(
        "flush",
        "writing messages",
        JSON.stringify(
          messages.map((m: any) => ({
            role: m.role,
            sender,
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
      const currentMessages =
        yield* store.readThreadMessagesWithSender(threadId);

      // Collect existing tool_use IDs to prevent duplicates
      const existingToolIds = new Set<string>();
      for (const msg of currentMessages) {
        for (const id of extractToolUseIds(msg)) {
          existingToolIds.add(id);
        }
      }

      // Deduplicate new messages - remove any tool-call blocks with existing IDs
      // Also add sender attribution to each message
      const deduplicatedMessages = messages
        .map((msg: MessageEncoded) => {
          if (!Array.isArray(msg.content)) {
            return { ...msg, sender } as MessageWithSender;
          }

          const filteredContent = msg.content.filter((block: any) => {
            if (
              typeof block === "object" &&
              block !== null &&
              "type" in block &&
              block.type === "tool-call" &&
              "id" in block &&
              typeof block.id === "string"
            ) {
              if (existingToolIds.has(block.id)) {
                log("flush", "WARNING: Skipping duplicate tool_use ID", {
                  id: block.id,
                  threadId,
                });
                return false;
              }
              // Track this ID so we don't duplicate within the new messages either
              existingToolIds.add(block.id);
            }
            return true;
          });

          // Skip messages that are now empty
          if (filteredContent.length === 0) {
            return null;
          }

          return {
            ...msg,
            content: filteredContent,
            sender,
          } as MessageWithSender;
        })
        .filter((msg): msg is MessageWithSender => msg !== null);

      if (deduplicatedMessages.length > 0) {
        log(
          "flush",
          `Writing ${deduplicatedMessages.length} new messages. Total will be ${currentMessages.length + deduplicatedMessages.length}`,
        );
        yield* store.writeThreadMessagesWithSender(threadId, [
          ...currentMessages,
          ...deduplicatedMessages,
        ]);
        log("flush", `Messages written successfully`);
      } else {
        log("flush", `No new messages to write`);
      }
    }

    // Truncate this agent's parts
    log("flush", `Truncating parts for agent ${agentId}`);
    yield* store.truncateAgentParts(threadId, agentId);
  });
