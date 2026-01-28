import type { MessageEncoded } from "@effect/ai/Prompt";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { StateStore } from "../state/index.ts";
import { ContextManager, ContextManagerError } from "./context-manager.ts";
/**
 * Naive context manager - passes through messages unmodified.
 * Filters out system messages from history (system prompt is added fresh).
 */
export const passthrough = Layer.effect(
  ContextManager,
  Effect.gen(function* () {
    const store = yield* StateStore;

    return {
      prepareContext: ({ threadId, systemPrompt }) =>
        Effect.gen(function* () {
          // Load messages from state, filter out old system messages
          const messages = yield* store
            .readThreadMessages(threadId)
            .pipe(
              Effect.map((msgs) => msgs.filter((m) => m.role !== "system")),
              Effect.catchAll(() => Effect.succeed([] as MessageEncoded[])),
            );

          // Prepend fresh system prompt
          return [
            { role: "system" as const, content: systemPrompt },
            ...messages,
          ];
        }).pipe(
          Effect.mapError(
            (cause) =>
              new ContextManagerError({
                message: "Failed to prepare context",
                cause,
              }),
          ),
        ),
    } satisfies ContextManager;
  }),
);
