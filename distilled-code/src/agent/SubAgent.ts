import * as Effect from "effect/Effect";
import * as Fiber from "effect/Fiber";
import * as Queue from "effect/Queue";
import * as Ref from "effect/Ref";
import * as Context from "effect/Context";
import * as Layer from "effect/Layer";
import * as LanguageModel from "@effect/ai/LanguageModel";
import { TuiEventQueue } from "../tui/services/ChatService.ts";
import type { TuiEvent } from "../tui/types.ts";

/**
 * Sub-agent task definition
 */
export interface SubAgentTask {
  id: string;
  prompt: string;
  systemPrompt?: string;
}

/**
 * Sub-agent result
 */
export interface SubAgentResult {
  id: string;
  status: "success" | "error";
  result?: string;
  error?: string;
}

/**
 * Sub-agent orchestrator service
 */
export class SubAgentOrchestrator extends Context.Tag("SubAgentOrchestrator")<
  SubAgentOrchestrator,
  {
    /**
     * Run multiple sub-agents in parallel and collect their results.
     */
    runParallel: (
      tasks: SubAgentTask[]
    ) => Effect.Effect<SubAgentResult[], unknown, LanguageModel.LanguageModel>;

    /**
     * Interrupt all running sub-agents.
     */
    interruptAll: () => Effect.Effect<void>;
  }
>() {}

export const subAgentOrchestratorLayer = Layer.effect(
  SubAgentOrchestrator,
  Effect.gen(function* () {
    // Track running fibers
    const runningFibersRef = yield* Ref.make<Map<string, Fiber.Fiber<SubAgentResult, unknown>>>(
      new Map()
    );

    // Get event queue for TUI updates (optional)
    const eventQueue = yield* Effect.serviceOption(TuiEventQueue);

    const emit = (event: TuiEvent) =>
      eventQueue._tag === "Some"
        ? Queue.offer(eventQueue.value, event)
        : Effect.void;

    /**
     * Run a single sub-agent task
     */
    const runSubAgent = (task: SubAgentTask): Effect.Effect<SubAgentResult, unknown, LanguageModel.LanguageModel> =>
      Effect.gen(function* () {
        // Emit task started
        yield* emit({
          type: "subAgent",
          data: {
            id: task.id,
            prompt: task.prompt,
            description: task.prompt.slice(0, 100),
            status: "running",
          },
        });

        // Run the AI generation with tools
        // Note: If systemPrompt is provided, prepend it to the prompt
        const fullPrompt = task.systemPrompt
          ? `${task.systemPrompt}\n\n${task.prompt}`
          : task.prompt;
        const result: SubAgentResult = yield* LanguageModel.generateText({
          prompt: fullPrompt,
        }).pipe(
          Effect.map((response): SubAgentResult => ({
            id: task.id,
            status: "success",
            result: response.text,
          })),
          Effect.catchAll((error): Effect.Effect<SubAgentResult> =>
            Effect.succeed({
              id: task.id,
              status: "error",
              error: String(error),
            })
          )
        );

        // Emit completion
        yield* emit({
          type: "subAgentUpdate",
          id: task.id,
          data: {
            status: result.status === "success" ? "completed" : "error",
            result: result.result,
            error: result.error,
          },
        });

        return result;
      });

    return {
      runParallel: (tasks: SubAgentTask[]) =>
        Effect.gen(function* () {
          yield* Effect.log(`Starting ${tasks.length} sub-agents in parallel`);

          // Fork all sub-agents
          const fibers = yield* Effect.all(
            tasks.map((task) =>
              Effect.fork(runSubAgent(task)).pipe(
                Effect.tap((fiber) =>
                  Ref.update(runningFibersRef, (map) => {
                    const newMap = new Map(map);
                    newMap.set(task.id, fiber);
                    return newMap;
                  })
                )
              )
            )
          );

          // Wait for all to complete
          const results = yield* Effect.all(
            fibers.map((fiber) =>
              Fiber.join(fiber).pipe(
                Effect.catchAllCause((): Effect.Effect<SubAgentResult> =>
                  Effect.succeed({
                    id: "unknown",
                    status: "error",
                    error: "Interrupted or failed",
                  })
                )
              )
            )
          );

          // Clear running fibers
          yield* Ref.set(runningFibersRef, new Map());

          // Emit clear sub-agents
          yield* emit({ type: "clearSubAgents" });

          yield* Effect.log(`All ${tasks.length} sub-agents completed`);

          return results;
        }),

      interruptAll: () =>
        Effect.gen(function* () {
          const fibers = yield* Ref.get(runningFibersRef);
          
          yield* Effect.log(`Interrupting ${fibers.size} sub-agents`);

          yield* Effect.all(
            Array.from(fibers.values()).map((fiber) => Fiber.interrupt(fiber)),
            { concurrency: "unbounded" }
          );

          yield* Ref.set(runningFibersRef, new Map());
          yield* emit({ type: "clearSubAgents" });
        }),
    };
  })
);
