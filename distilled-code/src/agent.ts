import type { LanguageModel, Tool, Toolkit } from "@effect/ai";
import * as Chat from "@effect/ai/Chat";
import { FileSystem, Path } from "@effect/platform";
import * as Effect from "effect/Effect";
import type * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";

export interface AgentMetadata {
  /**
   * Tags for filtering/searching agents
   */
  tags?: string[];

  /**
   * Description of what this agent does (passed to the agent as context)
   */
  description?: string;
}

/**
 * An agent definition - defines what toolkit the agent uses.
 * Agents are spawned at runtime, not in the config.
 */
export interface AgentDefinition<Tools extends Record<string, Tool.Any> = any> {
  /**
   * Unique key for the agent (e.g., "api/listTodos", "test/unit")
   */
  key: string;

  /**
   * The toolkit the agent uses.
   */
  toolkit: Toolkit.Toolkit<Tools>;

  /**
   * Optional metadata
   */
  metadata?: AgentMetadata;
}

export interface AgentOptions<
  Tools extends Record<string, Tool.Any> = Record<string, Tool.Any>,
> extends AgentMetadata {
  toolkit: Toolkit.Toolkit<Tools>;
}

/**
 * Define an agent with a key and options.
 *
 * @example
 * ```ts
 * import { agent, Toolkit } from "distilled-code";
 *
 * const config = defineConfig({
 *   agents: [
 *     agent("api/listTodos", { toolkit: Toolkit.Coding, description: "Implements GET /todos" }),
 *     agent("api/getTodo", { toolkit: Toolkit.Coding, description: "Implements GET /todos/:id" }),
 *   ],
 * });
 * ```
 */
export const agent = <Tools extends Record<string, Tool.Any>>(
  key: string,
  options: AgentOptions<Tools>,
): AgentDefinition<Tools> => ({
  key,
  toolkit: options.toolkit,
  metadata: {
    tags: options.tags,
    description: options.description,
  },
});

/**
 * A spawned agent that can receive multiple commands.
 * State persists to .distilled/{key}.json
 */
export interface Agent<
  Tools extends Record<string, Tool.Any> = Record<string, Tool.Any>,
  SendError = never,
  QueryError = never,
> {
  readonly key: string;
  readonly definition: AgentDefinition<Tools>;
  /**
   * Send a command to the agent and get the response text.
   */
  readonly send: (prompt: string) => Effect.Effect<string, SendError, never>;
  /**
   * Query the agent for structured data matching the given schema.
   */
  readonly query: <A, I extends Record<string, unknown>, R>(
    prompt: string,
    schema: Schema.Schema<A, I, R>,
  ) => Effect.Effect<A, QueryError, never>;
}

/**
 * Options for spawning an agent.
 */
export interface SpawnOptions {
  /**
   * Optional callback for streaming text output.
   */
  onText?: (delta: string) => void;
}

/**
 * Spawn a persistent agent from its definition.
 * Session state is persisted to .distilled/{key}.json
 *
 * @example
 * ```ts
 * import { agent, Toolkit } from "distilled-code";
 *
 * const myAgent = agent("my-agent", Toolkit.Coding, { description: "..." });
 * const spawned = yield* spawn(myAgent);
 * yield* spawned.send("read src/index.ts");
 * ```
 */
export const spawn = <
  Tools extends Record<string, Tool.Any> = Record<string, Tool.Any>,
>(
  definition: AgentDefinition<Tools>,
  options?: SpawnOptions,
): Effect.Effect<
  Agent,
  any,
  | LanguageModel.LanguageModel
  | LanguageModel.ExtractContext<Toolkit.Toolkit<Tools>>
> =>
  // @ts-expect-error
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem;
    const pathService = yield* Path.Path;

    const { key, toolkit } = definition;
    const onText = options?.onText;

    yield* Effect.logDebug(`[agent:${key}] Spawning agent`);

    const sessionPath = pathService.join(".distilled", `${key}.json`);
    const sessionDir = pathService.dirname(sessionPath);

    // Load existing session or create empty chat
    const existingJson = yield* fs
      .readFileString(sessionPath)
      .pipe(Effect.catchAll(() => Effect.succeed(null)));

    const chat = existingJson
      ? yield* Chat.fromJson(existingJson)
      : yield* Chat.empty;

    yield* Effect.logDebug(
      `[agent:${key}] Session ${existingJson ? "loaded" : "created"}`,
    );

    // Helper to persist after each interaction
    const persist = Effect.gen(function* () {
      yield* fs.makeDirectory(sessionDir, { recursive: true });
      const exported = yield* chat.exportJson;
      // re-format it so we can read it
      const formatted = JSON.stringify(JSON.parse(exported), null, 2);
      yield* fs.writeFileString(sessionPath, formatted);
      yield* Effect.logDebug(`[agent:${key}] Session persisted`);
    });

    const send = (prompt: string) =>
      Effect.gen(function* () {
        yield* Effect.logInfo(
          `[agent:${key}] Sending prompt: ${prompt.slice(0, 100).split("\n")[0]}...`,
        );

        let finalText = "";
        let isFirst = true;
        let loopCount = 0;

        while (true) {
          loopCount++;
          let finishReason: string | undefined;
          let toolCallCount = 0;

          yield* Effect.logDebug(
            `[agent:${key}] Loop ${loopCount}, prompt: ${isFirst ? "initial" : "Continue"}`,
          );

          const stream = chat.streamText({
            toolkit: toolkit,
            prompt: isFirst ? prompt : "Continue",
          });
          isFirst = false;

          yield* Stream.runForEach(stream, (part) =>
            Effect.gen(function* () {
              yield* persist;
              switch (part.type) {
                case "text-delta":
                case "reasoning-delta":
                  finalText += part.delta;
                  if (onText) onText(part.delta);
                  break;
                case "tool-call":
                  toolCallCount++;
                  yield* Effect.logInfo(
                    `[agent:${key}] Tool call: ${part.name}`,
                  );
                  break;
                case "tool-result":
                  yield* Effect.logDebug(`[agent:${key}] Tool result received`);
                  break;
                case "finish":
                  finishReason = part.reason;
                  yield* Effect.logDebug(
                    `[agent:${key}] Finish reason: ${finishReason}`,
                  );
                  break;
              }
            }),
          );

          if (toolCallCount > 0) {
            yield* Effect.logInfo(
              `[agent:${key}] Executed ${toolCallCount} tool calls`,
            );
          }

          if (finishReason !== "tool-calls") {
            yield* Effect.logDebug(
              `[agent:${key}] Done after ${loopCount} loops`,
            );
            break;
          }
        }

        yield* persist;
        yield* Effect.logInfo(
          `[agent:${key}] Response: ${finalText.slice(0, 100)}...`,
        );
        return finalText;
      });

    const query = <A, I extends Record<string, unknown>, R>(
      prompt: string,
      schema: Schema.Schema<A, I, R>,
    ) =>
      Effect.gen(function* () {
        yield* Effect.logInfo(
          `[agent:${key}] Query: ${prompt.slice(0, 100)}...`,
        );

        const response = yield* chat.generateObject({
          prompt,
          schema,
          toolkit,
        });

        yield* persist;
        yield* Effect.logDebug(`[agent:${key}] Query complete`);
        return response.value;
      });

    const agent = {
      key,
      definition,
      send,
      query,
    } as Agent<Tools>;

    yield* Effect.logDebug(`[agent:${key}] Agent ready`);
    return agent;
  });
