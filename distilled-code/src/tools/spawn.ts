import { Tool, Toolkit } from "@effect/ai";
import * as S from "effect/Schema";
import * as Effect from "effect/Effect";
import * as LanguageModel from "@effect/ai/LanguageModel";

/**
 * Schema for individual sub-agent task
 */
const SubAgentTaskInput = S.Struct({
  id: S.String.annotations({
    description: "Unique identifier for this task",
  }),
  prompt: S.String.annotations({
    description: "The task prompt for the sub-agent",
  }),
});

/**
 * Schema for sub-agent result
 */
const SubAgentResultSchema = S.Struct({
  id: S.String,
  status: S.Literal("success", "error"),
  result: S.optional(S.String),
  error: S.optional(S.String),
});

type SubAgentResult = {
  id: string;
  status: "success" | "error";
  result?: string;
  error?: string;
};

/**
 * The spawn tool allows the main agent to create parallel sub-agents
 * that work on independent tasks concurrently.
 */
export const spawn = Tool.make("spawn", {
  description: `Spawn parallel sub-agents to work on independent tasks concurrently.

Use this tool when you need to:
- Analyze multiple files simultaneously
- Gather information from several sources in parallel
- Perform independent operations that don't depend on each other

Each sub-agent runs in its own context and reports back with results.
The tool waits for all sub-agents to complete before returning.

Example use cases:
- "Read and analyze 5 different files" - spawn 5 sub-agents
- "Search for patterns in multiple directories" - spawn agents per directory
- "Gather context from related modules" - spawn agents to explore each module
`,
  dependencies: [LanguageModel.LanguageModel],
  parameters: {
    tasks: S.Array(SubAgentTaskInput).annotations({
      description: "Array of tasks to run in parallel. Each task gets its own sub-agent.",
    }),
  },
  success: S.Array(SubAgentResultSchema),
  failure: S.Any,
});

export const spawnToolkit = Toolkit.make(spawn);

export const spawnToolkitLayer = spawnToolkit.toLayer(
  Effect.gen(function* () {
    return {
      spawn: ({ tasks }: { tasks: readonly { id: string; prompt: string }[] }) =>
        Effect.gen(function* () {
          // Run all tasks in parallel
          const results: SubAgentResult[] = yield* Effect.all(
            tasks.map((task) =>
              Effect.gen(function* () {
                const result: SubAgentResult = yield* LanguageModel.generateText({
                  prompt: task.prompt,
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

                return result;
              })
            ),
            { concurrency: "unbounded" }
          );

          return results;
        }),
    };
  })
);
