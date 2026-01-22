import type { Toolkit as EffectToolkit } from "@effect/ai";
import * as Chat from "@effect/ai/Chat";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import type * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
import { getSystemPrompt } from "./prompt.ts";
import { AgentState } from "./services/state.ts";
import { ToolCallFormatter } from "./services/tool-call-formatter.ts";
import {
  CodingToolsLayer,
  type CodingTools as CodingToolsType,
  PlanningTools,
  PlanningToolsLayer,
  type PlanningTools as PlanningToolsType,
  ReadOnlyTools,
  ReadOnlyToolsLayer,
  type ReadOnlyTools as ReadOnlyToolsType,
  type ToolLayerOptions,
} from "./tools/index.ts";
import { formatToolCall } from "./util/format-tool-call.ts";

// ============================================================================
// AgentScope - Context for nested agent keys in workflows
// ============================================================================

export interface AgentScope {
  readonly path: string;
  readonly todoScope?: string;
}

export const AgentScope = Context.GenericTag<AgentScope>("AgentScope");

// ============================================================================
// AgentError - Tagged error for agent interface
// ============================================================================

export class AgentError extends Data.TaggedError("AgentError")<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

// ============================================================================
// Toolkit Types
// ============================================================================

/**
 * Union of all available toolkit types.
 */
export type ToolkitType =
  | CodingToolsType
  | PlanningToolsType
  | ReadOnlyToolsType;

// ============================================================================
// Leaf Agent - LLM-powered agent with toolkit and chat capabilities
// ============================================================================

/**
 * Options for creating a leaf agent (LLM-powered).
 */
export interface LeafAgentOptions<
  TToolkit extends ToolkitType = CodingToolsType,
> {
  /** The toolkit this agent uses. */
  toolkit: TToolkit;
  /** Description/context added to the system prompt. */
  description: string;
  /** Optional tags for filtering agents. */
  tags?: string[];
  /** Todo scope: "parent" inherits from workflow, "agent" uses agent key, or custom string. */
  todoScope?: "parent" | "agent" | string;
  /** Callback for streaming text deltas. */
  onText?: (delta: string) => void;
  /** Override the model ID. */
  modelId?: string;
}

/**
 * A leaf agent with full LLM capabilities.
 */
export interface LeafAgent<TToolkit extends ToolkitType = CodingToolsType> {
  readonly key: string;
  readonly tags?: string[];
  readonly prompt: string;
  readonly toolkit: TToolkit;
  readonly send: (prompt: string) => Effect.Effect<string, AgentError, never>;
  readonly query: <A, I extends Record<string, unknown>, R>(
    prompt: string,
    schema: Schema.Schema<A, I, R>,
  ) => Effect.Effect<A, AgentError, R>;
}

// ============================================================================
// Workflow Agent - Pure orchestration container (no LLM)
// ============================================================================

/**
 * Options for creating a workflow agent (pure orchestration).
 */
export interface WorkflowOptions {
  /** Optional tags for filtering agents. */
  tags?: string[];
  /** Todo scope for child agents to inherit. */
  todoScope?: string;
}

/**
 * Handler function for workflow agents.
 */
export type WorkflowFn<Out = string, Err = never, Req = never> = (
  prompt: string,
) => Effect.Effect<Out, Err, Req | AgentScope>;

/**
 * A workflow agent - pure orchestration, no LLM capabilities.
 */
export interface WorkflowAgent<Out = string, Err = never, Req = never> {
  readonly key: string;
  readonly tags?: string[];
  readonly send: (prompt: string) => Effect.Effect<Out, Err | AgentError, Req>;
}

// ============================================================================
// Legacy Agent type (for backwards compatibility)
// ============================================================================

/**
 * @deprecated Use LeafAgent or WorkflowAgent instead.
 */
export type Agent<
  TReturn = string,
  TToolkit extends ToolkitType = CodingToolsType,
  SendReq = never,
  SendErr = AgentError,
> = LeafAgent<TToolkit> | WorkflowAgent<TReturn, SendErr, SendReq>;

// ============================================================================
// Toolkit resolution
// ============================================================================

const getLayerForToolkit = <T extends ToolkitType>(
  toolkit: T,
  opts: ToolLayerOptions,
) => {
  if (toolkit === PlanningTools) {
    return PlanningToolsLayer(opts);
  }
  if (toolkit === ReadOnlyTools) {
    return ReadOnlyToolsLayer(opts);
  }
  return CodingToolsLayer(opts);
};

// ============================================================================
// agent() - Create leaf or workflow agents
// ============================================================================

/**
 * Create an agent. Returns an Effect that spawns when yielded.
 *
 * @example Leaf agent (LLM-powered)
 * ```ts
 * import { agent, Toolkit } from "distilled-code";
 *
 * const myAgent = yield* agent("api/getTodo", {
 *   toolkit: Toolkit.Coding,
 *   description: "Implement GET /todos/:id",
 *   tags: ["api"],
 * });
 * yield* myAgent.send("implement it");
 * ```
 *
 * @example Workflow agent (pure orchestration)
 * ```ts
 * import { agent, Toolkit } from "distilled-code";
 *
 * const workflow = yield* agent(
 *   "feature/implement",
 *   { tags: ["feature"] },
 *   Effect.fn(function* (prompt) {
 *     const planner = yield* agent("planner", {
 *       toolkit: Toolkit.Planning,
 *       description: "Plan the implementation",
 *     });
 *     const executor = yield* agent("executor", {
 *       toolkit: Toolkit.Coding,
 *       description: "Execute the plan",
 *     });
 *     yield* planner.send(prompt);
 *     yield* executor.send("complete todos");
 *     return "done";
 *   }),
 * );
 * yield* workflow.send("add auth");
 * ```
 */

// Overload 1: Leaf agent - agent(key, options)
export function agent<TToolkit extends ToolkitType>(
  key: string,
  options: LeafAgentOptions<TToolkit>,
): Effect.Effect<LeafAgent<TToolkit>, AgentError, AgentState>;

// Overload 2: Workflow agent - agent(key, options, handler)
export function agent<Out, Err, Req>(
  key: string,
  options: WorkflowOptions,
  handler: WorkflowFn<Out, Err, Req>,
): Effect.Effect<WorkflowAgent<Out, Err, Req>, AgentError, AgentState>;

// Implementation
export function agent<TToolkit extends ToolkitType, Out, Err, Req>(
  key: string,
  options: LeafAgentOptions<TToolkit> | WorkflowOptions,
  handler?: WorkflowFn<Out, Err, Req>,
): Effect.Effect<
  LeafAgent<TToolkit> | WorkflowAgent<Out, Err, Req>,
  AgentError,
  AgentState
> {
  const isWorkflow = handler !== undefined;

  if (isWorkflow) {
    return createWorkflowAgent(key, options as WorkflowOptions, handler);
  } else {
    return createLeafAgent(key, options as LeafAgentOptions<TToolkit>);
  }
}

// ============================================================================
// Leaf Agent Implementation
// ============================================================================

function createLeafAgent<TToolkit extends ToolkitType>(
  key: string,
  options: LeafAgentOptions<TToolkit>,
): Effect.Effect<LeafAgent<TToolkit>, AgentError, AgentState> {
  return Effect.gen(function* () {
    // Check for parent scope (nested agent in workflow)
    const parentScope = yield* Effect.serviceOption(AgentScope);
    const hasParent = Option.isSome(parentScope);

    // Construct agent key
    const agentKey = hasParent ? `${parentScope.value.path}/${key}` : key;

    // Resolve todo scope
    let todoScope: string;
    if (options.todoScope === "parent" && hasParent) {
      todoScope = parentScope.value.todoScope ?? parentScope.value.path;
    } else if (
      options.todoScope === "agent" ||
      options.todoScope === undefined
    ) {
      todoScope = agentKey;
    } else {
      todoScope = options.todoScope;
    }

    // Get toolkit and layer
    const toolkit = options.toolkit;
    const layer = getLayerForToolkit(toolkit, {
      agentKey,
      todoScope,
    });

    // Get state and formatter
    const state = yield* AgentState;

    const customFormatter = yield* Effect.serviceOption(ToolCallFormatter).pipe(
      Effect.map(Option.getOrUndefined),
    );

    const format = (name: string, params: unknown): string => {
      const custom = customFormatter?.format(name, params);
      if (custom !== undefined) {
        return custom;
      }
      return formatToolCall(name, params);
    };

    // Build system prompt with description
    const modelId = options.modelId;
    const systemPrompt = getSystemPrompt(modelId);
    const contextPrompt = `${systemPrompt}\n\nContext: ${options.description}`;

    // Create chat session
    const chat = yield* Chat.fromPrompt([
      { role: "system", content: contextPrompt },
      ...(yield* state.getMessages(agentKey).pipe(
        Effect.map((messages) => messages.filter((m) => m.role !== "system")),
        Effect.catchAll(() => Effect.succeed([])),
      )),
    ]);

    const persist = Effect.gen(function* () {
      const exported = yield* chat.exportJson;
      yield* state.saveMessages(agentKey, exported);
      yield* Effect.logDebug(`[agent:${agentKey}] Session persisted`);
    });

    const onText = options.onText;

    // Send implementation - agentic loop
    const send = (prompt: string) =>
      Effect.gen(function* () {
        yield* Effect.logInfo(
          `[agent:${agentKey}] Sending prompt: ${prompt.slice(0, 100).split("\n")[0]}...`,
        );

        let finalText = "";
        let isFirst = true;
        let loopCount = 0;

        while (true) {
          loopCount++;
          let finishReason: string | undefined;

          const stream = chat.streamText({
            toolkit: toolkit as EffectToolkit.Toolkit<any>,
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
                    `[agent:${agentKey}] ${format(part.name, part.params)}`,
                  );
                  break;
                case "tool-result":
                  yield* Effect.logDebug(
                    `[agent:${agentKey}] Tool result received`,
                  );
                  break;
                case "finish":
                  finishReason = part.reason;
                  break;
              }
            }),
          );

          if (finishReason !== "tool-calls") {
            yield* Effect.log(
              `[agent:${agentKey}] Done after ${loopCount} loops`,
            );
            break;
          }
        }

        yield* persist;
        return finalText;
      }).pipe(
        Effect.provide(layer),
        Effect.scoped,
        Effect.mapError(
          (cause) => new AgentError({ message: "Agent send failed", cause }),
        ),
      );

    // Query implementation
    const query = <A, I extends Record<string, unknown>, R>(
      prompt: string,
      schema: Schema.Schema<A, I, R>,
    ) =>
      Effect.gen(function* () {
        yield* Effect.logInfo(
          `[agent:${agentKey}] Query: ${prompt.slice(0, 100)}...`,
        );
        const response = yield* chat.generateObject({
          prompt,
          schema,
          toolkit: toolkit as EffectToolkit.Toolkit<any>,
        });
        yield* persist;
        return response.value;
      }).pipe(
        Effect.provide(layer),
        Effect.scoped,
        Effect.mapError(
          (cause) => new AgentError({ message: "Agent query failed", cause }),
        ),
      );

    return {
      key: agentKey,
      tags: options.tags,
      prompt: options.description,
      toolkit,
      send,
      query,
    } as LeafAgent<TToolkit>;
  }).pipe(
    Effect.mapError(
      (cause) =>
        new AgentError({ message: "Agent initialization failed", cause }),
    ),
  );
}

// ============================================================================
// Workflow Agent Implementation
// ============================================================================

function createWorkflowAgent<Out, Err, Req>(
  key: string,
  options: WorkflowOptions,
  handler: WorkflowFn<Out, Err, Req>,
): Effect.Effect<WorkflowAgent<Out, Err, Req>, AgentError, AgentState> {
  return Effect.gen(function* () {
    // Check for parent scope (nested workflow)
    const parentScope = yield* Effect.serviceOption(AgentScope);
    const hasParent = Option.isSome(parentScope);

    // Construct workflow key
    const workflowKey = hasParent ? `${parentScope.value.path}/${key}` : key;

    // Resolve todo scope for child agents
    const todoScope = options.todoScope ?? workflowKey;

    // Send implementation - just runs the handler
    const send = (prompt: string) =>
      Effect.gen(function* () {
        yield* Effect.logInfo(`[workflow:${workflowKey}] Starting`);

        const result = yield* handler(prompt).pipe(
          Effect.provideService(AgentScope, {
            path: workflowKey,
            todoScope,
          }),
        );

        yield* Effect.logInfo(`[workflow:${workflowKey}] Complete`);
        return result;
      }).pipe(
        Effect.mapError(
          (cause) =>
            new AgentError({ message: "Workflow execution failed", cause }),
        ),
      );

    return {
      key: workflowKey,
      tags: options.tags,
      send,
    } as WorkflowAgent<Out, Err, Req>;
  }).pipe(
    Effect.mapError(
      (cause) =>
        new AgentError({ message: "Workflow initialization failed", cause }),
    ),
  );
}
