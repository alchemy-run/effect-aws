import type { LanguageModel, Tool, Toolkit } from "@effect/ai";
import * as Chat from "@effect/ai/Chat";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import type * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import { getSystemPrompt } from "./prompt.ts";
import { AgentState } from "./services/state.ts";
import { ToolCallFormatter } from "./services/tool-call-formatter.ts";
import { formatToolCall } from "./util/format-tool-call.ts";

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

  /**
   * Model ID for selecting the appropriate system prompt.
   * If provided, the agent will use provider-specific prompts
   * (e.g., "claude-3-5-sonnet" for Anthropic prompts).
   */
  modelId?: string;
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
    const state = yield* AgentState;

    // Get optional custom formatter
    const customFormatter = yield* Effect.serviceOption(ToolCallFormatter).pipe(
      Effect.map(Option.getOrUndefined),
    );

    // Helper that tries custom formatter first, then falls back to built-in
    const format = (name: string, params: unknown): string => {
      const custom = customFormatter?.format(name, params);
      if (custom !== undefined) {
        return custom;
      }
      return formatToolCall(name, params);
    };

    const { key, toolkit } = definition;
    const onText = options?.onText;
    const modelId = options?.modelId;

    yield* Effect.logDebug(`[agent:${key}] Spawning agent`);

    // Load system prompt based on model provider
    const systemPrompt = getSystemPrompt(modelId);

    const chat = yield* Chat.fromPrompt([
      { role: "system", content: systemPrompt },
      // Load existing chat messages from state, filtering out system messages
      // as we add a fresh system prompt each time
      ...(yield* state.getMessages(key).pipe(
        Effect.map((messages) => messages.filter((m) => m.role !== "system")),
        Effect.catchAll(() => Effect.succeed([])),
      )),
    ]);

    // Helper to persist after each interaction
    const persist = Effect.gen(function* () {
      const exported = yield* chat.exportJson;
      yield* state.saveMessages(key, exported);
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

          // Reset finalText each loop so we only return text from the final iteration
          finalText = "";

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
                  yield* Effect.logInfo(
                    `[agent:${key}] ${format(part.name, part.params)}`,
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

          if (finishReason !== "tool-calls") {
            yield* Effect.log(`[agent:${key}] Done after ${loopCount} loops`);
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
