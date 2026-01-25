import { type MessageEncoded, Message } from "@effect/ai/Prompt";
import * as FileSystem from "@effect/platform/FileSystem";
import * as Path from "@effect/platform/Path";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as S from "effect/Schema";

export type { MessageEncoded };

/**
 * Schema for the persisted agent state data.
 * All agent state is consolidated into a single file.
 */
export const AgentStateData = S.Struct({
  /** Chat messages for this agent */
  messages: S.Array(Message),
  /** Last updated timestamp */
  updatedAt: S.Number,
});
export type AgentStateData = S.Schema.Type<typeof AgentStateData>;

/**
 * Default empty state for a new agent.
 */
const emptyState = (): AgentStateData => ({
  messages: [],
  updatedAt: Date.now(),
});

/**
 * Error that occurs when reading or writing agent state fails.
 */
export class AgentStateError extends Data.TaggedError("AgentStateError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

/**
 * AgentState service interface for managing all agent state.
 * Consolidates todos, file tracking, chat history, and other agent metadata.
 */
export interface AgentState {
  /** Get full state for an agent */
  get(agentKey: string): Effect.Effect<AgentStateData, AgentStateError>;

  // Chat history operations
  getMessages(
    agentKey: string,
  ): Effect.Effect<readonly MessageEncoded[], AgentStateError>;
  saveMessages(
    agentKey: string,
    messages: string,
  ): Effect.Effect<void, AgentStateError>;

  // Management operations
  listAgents(): Effect.Effect<readonly string[], AgentStateError>;
  /** Delete all state and files created by an agent */
  delete(agentKey: string): Effect.Effect<void, AgentStateError>;
}

export const AgentState = Context.GenericTag<AgentState>("AgentState");

/**
 * FileSystem implementation of AgentState.
 * State is stored in .distilled/state/{agent-key}.state.json files.
 * Uses semaphores to ensure exclusive write access per agent.
 */
export const FileSystemAgentState = Layer.effect(
  AgentState,
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const path = yield* Path.Path;

    // Map of semaphores per agent key to ensure exclusive write access
    const locks = new Map<string, Effect.Semaphore>();

    // Get or create a semaphore for an agent
    const getLock = (agentKey: string) =>
      Effect.gen(function* () {
        let lock = locks.get(agentKey);
        if (!lock) {
          lock = yield* Effect.makeSemaphore(1);
          locks.set(agentKey, lock);
        }
        return lock;
      });

    // Helper to run an effect with exclusive lock
    const withLock = <A, E, R>(
      agentKey: string,
      effect: Effect.Effect<A, E, R>,
    ): Effect.Effect<A, E, R> =>
      Effect.gen(function* () {
        const lock = yield* getLock(agentKey);
        return yield* lock.withPermits(1)(effect);
      });

    const getPath = (agentKey: string) =>
      path.join(".distilled", "state", `${agentKey}.state.json`);

    const readState = (
      agentKey: string,
    ): Effect.Effect<AgentStateData, AgentStateError> =>
      Effect.gen(function* () {
        const filePath = getPath(agentKey);
        const content = yield* fs
          .readFileString(filePath)
          .pipe(Effect.catchAll(() => Effect.succeed("")));

        if (!content) {
          return emptyState();
        }

        try {
          const parsed = JSON.parse(content);
          // Validate and provide defaults for missing fields
          return {
            messages: Array.isArray(parsed.messages) ? parsed.messages : [],
            todos: Array.isArray(parsed.todos) ? parsed.todos : [],
            filesCreated: Array.isArray(parsed.filesCreated)
              ? parsed.filesCreated
              : [],
            filesEdited: Array.isArray(parsed.filesEdited)
              ? parsed.filesEdited
              : [],
            updatedAt:
              typeof parsed.updatedAt === "number"
                ? parsed.updatedAt
                : Date.now(),
          };
        } catch (e) {
          return yield* new AgentStateError({
            message: `Failed to parse agent state: ${e}`,
            cause: e,
          });
        }
      });

    const writeState = (
      agentKey: string,
      state: AgentStateData,
    ): Effect.Effect<void, AgentStateError> =>
      Effect.gen(function* () {
        const filePath = getPath(agentKey);
        const dir = path.dirname(filePath);

        yield* fs.makeDirectory(dir, { recursive: true }).pipe(
          Effect.catchAll(
            (e) =>
              new AgentStateError({
                message: `Failed to create directory: ${e.message}`,
                cause: e,
              }),
          ),
        );

        const stateWithTimestamp = {
          ...state,
          updatedAt: Date.now(),
        };

        yield* fs
          .writeFileString(
            filePath,
            JSON.stringify(stateWithTimestamp, null, 2),
          )
          .pipe(
            Effect.catchAll(
              (e) =>
                new AgentStateError({
                  message: `Failed to write agent state: ${e.message}`,
                  cause: e,
                }),
            ),
          );
      });

    // Update state with exclusive write access via semaphore
    const updateState = (
      agentKey: string,
      updater: (state: AgentStateData) => AgentStateData,
    ): Effect.Effect<void, AgentStateError> =>
      withLock(
        agentKey,
        Effect.gen(function* () {
          const current = yield* readState(agentKey);
          const updated = updater(current);
          yield* writeState(agentKey, updated);
        }),
      );

    return {
      get: readState,

      getMessages: (agentKey) =>
        readState(agentKey).pipe(
          Effect.map((state) => state.messages as readonly MessageEncoded[]),
        ),

      saveMessages: (agentKey, messages) =>
        Effect.gen(function* () {
          // Parse the JSON string to extract the content array
          const parsed = JSON.parse(messages);
          const messageArray = parsed.content ?? [];
          yield* updateState(agentKey, (state) => ({
            ...state,
            messages: messageArray,
          }));
        }).pipe(
          Effect.catchAll(
            (e) =>
              new AgentStateError({
                message: `Failed to save messages: ${e}`,
                cause: e,
              }),
          ),
        ),

      listAgents: () =>
        Effect.gen(function* () {
          const stateDir = path.join(".distilled", "state");
          const exists = yield* fs
            .exists(stateDir)
            .pipe(Effect.catchAll(() => Effect.succeed(false)));
          if (!exists) {
            return [];
          }

          // Recursively find all .state.json files in .distilled/state/
          const agents: string[] = [];
          const scanDir = (dir: string, prefix: string): Effect.Effect<void> =>
            Effect.gen(function* () {
              const entries = yield* fs
                .readDirectory(dir)
                .pipe(Effect.catchAll(() => Effect.succeed([] as string[])));

              for (const entry of entries) {
                const entryPath = path.join(dir, entry);
                const stat = yield* fs
                  .stat(entryPath)
                  .pipe(Effect.catchAll(() => Effect.succeed(null)));

                if (stat?.type === "Directory") {
                  // Recurse into subdirectory
                  const newPrefix = prefix ? `${prefix}/${entry}` : entry;
                  yield* scanDir(entryPath, newPrefix);
                } else if (entry.endsWith(".state.json")) {
                  const baseName = entry.slice(0, -".state.json".length);
                  const agentKey = prefix ? `${prefix}/${baseName}` : baseName;
                  agents.push(agentKey);
                }
              }
            });

          yield* scanDir(stateDir, "");
          return agents;
        }).pipe(Effect.catchAll(() => Effect.succeed([]))),

      delete: (agentKey) =>
        withLock(
          agentKey,
          Effect.gen(function* () {
            // Delete the state file
            yield* fs
              .remove(getPath(agentKey))
              .pipe(Effect.catchAll(() => Effect.void));

            // Remove the lock from the map after deleting
            locks.delete(agentKey);
          }),
        ).pipe(Effect.catchAll(() => Effect.void)),
    } satisfies AgentState;
  }),
);
