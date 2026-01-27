import type { MessageEncoded } from "@effect/ai/Prompt";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as PubSub from "effect/PubSub";
import * as Stream from "effect/Stream";
import type { MessagePart, Thread } from "./thread.ts";

/**
 * Error that occurs when a StateStore operation fails.
 */
export class StateStoreError extends Data.TaggedError("StateStoreError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

export const StateStore = Context.GenericTag<StateStore>("StateStore");

/**
 * StateStore provides storage operations for agent thread state.
 * Uses explicit agentId and threadId parameters instead of concatenated keys.
 *
 * This interface includes streaming/PubSub functionality for real-time updates.
 */
export interface StateStore {
  /**
   * Read messages for an agent's thread.
   */
  readThreadMessages(
    agentId: string,
    threadId: string,
  ): Effect.Effect<readonly MessageEncoded[], StateStoreError>;

  /**
   * Write messages for an agent's thread.
   */
  writeThreadMessages(
    agentId: string,
    threadId: string,
    messages: readonly MessageEncoded[],
  ): Effect.Effect<void, StateStoreError>;

  /**
   * Read all parts for an agent's thread.
   */
  readThreadParts(
    agentId: string,
    threadId: string,
  ): Effect.Effect<MessagePart[], StateStoreError>;

  /**
   * Append a part to an agent's thread.
   */
  appendThreadPart(
    agentId: string,
    threadId: string,
    part: MessagePart,
  ): Effect.Effect<void, StateStoreError>;

  /**
   * Clear all parts for an agent's thread.
   */
  truncateThreadParts(
    agentId: string,
    threadId: string,
  ): Effect.Effect<void, StateStoreError>;

  /**
   * List all threads, optionally filtered by agentId.
   */
  listThreads(
    agentId?: string,
  ): Effect.Effect<
    readonly { agentId: string; threadId: string }[],
    StateStoreError
  >;

  /**
   * Delete all data for an agent's thread.
   */
  deleteThread(
    agentId: string,
    threadId: string,
  ): Effect.Effect<void, StateStoreError>;

  /**
   * Subscribe to thread stream (replays history + live updates).
   */
  subscribeThread(
    agentId: string,
    threadId: string,
  ): Effect.Effect<Stream.Stream<MessagePart, never, never>, StateStoreError>;
}

/**
 * Create a StateStore that wraps persistence with PubSub for streaming.
 */
export const createStateStore = (
  persistence: Omit<StateStore, "subscribeThread">,
) => {
  // Map of PubSubs per thread key for streaming
  const threads = new Map<string, Thread>();

  const getThreadKey = (agentId: string, threadId: string) =>
    `${agentId}:${threadId}`;

  const getThread = Effect.fnUntraced(function* (
    agentId: string,
    threadId: string,
  ) {
    const key = getThreadKey(agentId, threadId);
    const existing = threads.get(key);
    if (existing) {
      return existing;
    }

    const pubsub = yield* PubSub.unbounded<MessagePart>({ replay: Infinity });

    // Daemon that persists parts as they are published
    const daemon = yield* Stream.fromPubSub(pubsub).pipe(
      Stream.mapEffect((part) =>
        persistence.appendThreadPart(agentId, threadId, part),
      ),
      Stream.runDrain,
      Effect.forkDaemon,
    );

    const thread = { pubsub, daemon } satisfies Thread;
    threads.set(key, thread);
    return thread;
  });

  const getPubSub = Effect.fnUntraced(function* (
    agentId: string,
    threadId: string,
  ) {
    return (yield* getThread(agentId, threadId)).pubsub;
  });

  return {
    // Delegate to persistence
    ...persistence,

    // Override appendThreadPart to publish to PubSub (daemon persists)
    appendThreadPart: Effect.fnUntraced(function* (agentId, threadId, part) {
      const pubsub = yield* getPubSub(agentId, threadId);
      yield* Effect.all(
        [
          persistence.appendThreadPart(agentId, threadId, part),
          PubSub.publish(pubsub, part),
        ],
        { concurrency: "unbounded" },
      );
    }),

    // Override deleteThread to also clean up thread
    deleteThread: Effect.fnUntraced(function* (agentId, threadId) {
      yield* persistence.deleteThread(agentId, threadId);
      threads.delete(getThreadKey(agentId, threadId));
    }),

    // Streaming is handled here, not in persistence
    subscribeThread: Effect.fnUntraced(function* (agentId, threadId) {
      const pubsub = yield* getPubSub(agentId, threadId);
      return Stream.fromPubSub(pubsub);
    }),
  } satisfies StateStore;
};
