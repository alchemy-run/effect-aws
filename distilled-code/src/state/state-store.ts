import type { MessageEncoded } from "@effect/ai/Prompt";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as PubSub from "effect/PubSub";
import * as Stream from "effect/Stream";
import type { MessagePart, MessageWithSender, Thread } from "./thread.ts";

/**
 * Error that occurs when a StateStore operation fails.
 */
export class StateStoreError extends Data.TaggedError("StateStoreError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

export const StateStore = Context.GenericTag<StateStore>("StateStore");

/**
 * StateStore provides storage operations for thread state.
 * All methods are keyed by threadId only - all participants in a thread
 * share the same conversation history.
 *
 * This interface includes streaming/PubSub functionality for real-time updates.
 */
export interface StateStore {
  /**
   * Read messages for a thread (without sender info, for backwards compatibility).
   */
  readThreadMessages(
    threadId: string,
  ): Effect.Effect<readonly MessageEncoded[], StateStoreError>;

  /**
   * Read messages for a thread with sender attribution.
   */
  readThreadMessagesWithSender(
    threadId: string,
  ): Effect.Effect<readonly MessageWithSender[], StateStoreError>;

  /**
   * Write messages for a thread (without sender info, for backwards compatibility).
   */
  writeThreadMessages(
    threadId: string,
    messages: readonly MessageEncoded[],
  ): Effect.Effect<void, StateStoreError>;

  /**
   * Write messages for a thread with sender attribution.
   */
  writeThreadMessagesWithSender(
    threadId: string,
    messages: readonly MessageWithSender[],
  ): Effect.Effect<void, StateStoreError>;

  /**
   * Read all parts for a thread.
   */
  readThreadParts(
    threadId: string,
  ): Effect.Effect<MessagePart[], StateStoreError>;

  /**
   * Read parts for a specific agent in a thread.
   * Used for agent-scoped flush operations.
   */
  readAgentParts(
    threadId: string,
    sender: string,
  ): Effect.Effect<MessagePart[], StateStoreError>;

  /**
   * Append a part to a thread (persists to parts table AND publishes to PubSub).
   */
  appendThreadPart(
    threadId: string,
    part: MessagePart,
  ): Effect.Effect<void, StateStoreError>;

  /**
   * Publish a part to the thread's PubSub stream WITHOUT persisting to parts table.
   * Use this for user-input parts that are already stored in the messages table.
   * This prevents duplicate storage that leads to duplicate display on reload.
   */
  publishThreadPart(
    threadId: string,
    part: MessagePart,
  ): Effect.Effect<void, StateStoreError>;

  /**
   * Clear all parts for a thread.
   */
  truncateThreadParts(
    threadId: string,
  ): Effect.Effect<void, StateStoreError>;

  /**
   * Clear parts for a specific agent in a thread.
   * Used for agent-scoped flush operations.
   */
  truncateAgentParts(
    threadId: string,
    sender: string,
  ): Effect.Effect<void, StateStoreError>;

  /**
   * Get agents that have pending (incomplete) parts in a thread.
   * Used to display "typing" indicators for channels/groups.
   */
  getTypingAgents(
    threadId: string,
  ): Effect.Effect<readonly string[], StateStoreError>;

  /**
   * List all threads.
   */
  listThreads(): Effect.Effect<readonly { threadId: string }[], StateStoreError>;

  /**
   * Delete all data for a thread.
   */
  deleteThread(threadId: string): Effect.Effect<void, StateStoreError>;

  /**
   * Subscribe to thread stream (replays history + live updates).
   */
  subscribeThread(
    threadId: string,
  ): Effect.Effect<Stream.Stream<MessagePart, never, never>, StateStoreError>;
}

/**
 * Create a StateStore that wraps persistence with PubSub for streaming.
 */
export const createStateStore = (
  persistence: Omit<StateStore, "subscribeThread">,
) => {
  // Map of PubSubs per thread for streaming
  const threads = new Map<string, Thread>();

  const getThread = Effect.fnUntraced(function* (threadId: string) {
    const existing = threads.get(threadId);
    if (existing) {
      return existing;
    }

    // Use replay: 0 - ChatView reads existing parts from persistence,
    // then subscribes for new parts only. Using replay: Infinity caused duplicates.
    const pubsub = yield* PubSub.unbounded<MessagePart>({ replay: 0 });

    // Daemon keeps the PubSub alive for streaming to UI subscribers.
    // NOTE: The daemon does NOT persist parts - persistence happens directly in
    // appendThreadPart. Removing the persistence call here fixes the
    // "duplicate tool_use ids" bug that occurred when both appendThreadPart
    // AND the daemon were persisting the same parts.
    const daemon = yield* Stream.fromPubSub(pubsub).pipe(
      Stream.runDrain,
      Effect.forkDaemon,
    );

    const thread = { pubsub, daemon } satisfies Thread;
    threads.set(threadId, thread);
    return thread;
  });

  const getPubSub = Effect.fnUntraced(function* (threadId: string) {
    return (yield* getThread(threadId)).pubsub;
  });

  return {
    // Delegate to persistence
    ...persistence,

    // Override appendThreadPart: persist directly AND publish to PubSub for UI streaming.
    // The daemon should NOT persist - it's only for providing the PubSub subscription.
    appendThreadPart: Effect.fnUntraced(function* (threadId, part) {
      const pubsub = yield* getPubSub(threadId);
      yield* Effect.all(
        [
          persistence.appendThreadPart(threadId, part),
          PubSub.publish(pubsub, part),
        ],
        { concurrency: "unbounded" },
      );
    }),

    // Publish to PubSub WITHOUT persisting - for user-input that's already in messages table.
    // This fixes duplicate display: user input goes to messages (persist) + PubSub (stream),
    // never to parts table (which would cause duplicates on reload).
    publishThreadPart: Effect.fnUntraced(function* (threadId, part) {
      const pubsub = yield* getPubSub(threadId);
      yield* PubSub.publish(pubsub, part);
    }),

    // Override deleteThread to also clean up thread
    deleteThread: Effect.fnUntraced(function* (threadId) {
      yield* persistence.deleteThread(threadId);
      threads.delete(threadId);
    }),

    // Streaming is handled here, not in persistence
    subscribeThread: Effect.fnUntraced(function* (threadId) {
      const pubsub = yield* getPubSub(threadId);
      return Stream.fromPubSub(pubsub);
    }),
  } satisfies StateStore;
};
