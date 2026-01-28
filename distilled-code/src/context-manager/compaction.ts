import * as LLM from "@effect/ai/LanguageModel";
import type { MessageEncoded } from "@effect/ai/Prompt";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { StateStore } from "../state/index.ts";
import { ContextManager, ContextManagerError } from "./context-manager.ts";
import { estimateTokens, estimateTotalTokens } from "./estimate.ts";

/**
 * Configuration for compaction context manager.
 */
export interface CompactionConfig {
  /** Maximum tokens before triggering compaction (e.g., 128_000) */
  readonly maxTokens: number;
  /** Token threshold to trigger compaction (e.g., 100_000) */
  readonly compactionThreshold: number;
  /** Target token count after compaction (e.g., 50_000) */
  readonly targetTokens: number;
  /** Max tokens for the summary message (e.g., 4_000) */
  readonly summaryMaxTokens: number;
}

export const defaultCompactionConfig: CompactionConfig = {
  maxTokens: 128_000,
  compactionThreshold: 100_000,
  targetTokens: 50_000,
  summaryMaxTokens: 4_000,
};

/**
 * Compaction context manager - compacts old messages when context is too long.
 * Requires LanguageModel in the environment for summarization.
 */
export const compaction = (
  config: CompactionConfig = defaultCompactionConfig,
) =>
  Layer.effect(
    ContextManager,
    Effect.gen(function* () {
      const store = yield* StateStore;
      const model = yield* LLM.LanguageModel;

      return {
        prepareContext: ({ threadId, systemPrompt }) =>
          Effect.gen(function* () {
            // Load messages from state
            const allMessages = yield* store
              .readThreadMessages(threadId)
              .pipe(
                Effect.map((msgs) => msgs.filter((m) => m.role !== "system")),
                Effect.catchAll(() => Effect.succeed([] as MessageEncoded[])),
              );

            const totalTokens = estimateTotalTokens(allMessages);

            // If under threshold, return with system prompt
            if (totalTokens <= config.compactionThreshold) {
              return [
                { role: "system" as const, content: systemPrompt },
                ...allMessages,
              ];
            }

            yield* Effect.logInfo(
              `[context] Compacting ${totalTokens} tokens (threshold: ${config.compactionThreshold})`,
            );

            // Split messages: compact old ones, keep recent ones
            const { toCompact, toKeep } = splitMessagesForCompaction(
              allMessages,
              config.targetTokens,
            );

            if (toCompact.length === 0) {
              return [
                { role: "system" as const, content: systemPrompt },
                ...allMessages,
              ];
            }

            // Generate summary of compacted messages
            const summary = yield* summarizeMessages(model, toCompact, config);

            // Create compacted message list
            const compactedMessages: MessageEncoded[] = [
              {
                role: "assistant" as const,
                content: `[Previous conversation summary]\n${summary}`,
              },
              ...toKeep,
            ];

            // Persist compacted state
            yield* store
              .writeThreadMessages(threadId, compactedMessages)
              .pipe(Effect.catchAll(() => Effect.void));

            yield* Effect.logInfo(
              `[context] Compacted ${toCompact.length} messages into summary, kept ${toKeep.length} recent`,
            );

            return [
              { role: "system" as const, content: systemPrompt },
              ...compactedMessages,
            ];
          }).pipe(
            Effect.mapError(
              (cause) =>
                new ContextManagerError({
                  message: "Failed to prepare context with compaction",
                  cause,
                }),
            ),
          ),
      } satisfies ContextManager;
    }),
  );

/**
 * Split messages into those to compact and those to keep.
 * Keeps recent messages up to targetTokens, compacts the rest.
 */
const splitMessagesForCompaction = (
  messages: readonly MessageEncoded[],
  targetTokens: number,
): { toCompact: MessageEncoded[]; toKeep: MessageEncoded[] } => {
  let keepTokens = 0;
  let splitIndex = messages.length;

  // Work backwards from end to find split point
  for (let i = messages.length - 1; i >= 0; i--) {
    const msgTokens = estimateTokens(messages[i]);
    if (keepTokens + msgTokens > targetTokens) {
      splitIndex = i + 1;
      break;
    }
    keepTokens += msgTokens;
    splitIndex = i;
  }

  return {
    toCompact: messages.slice(0, splitIndex) as MessageEncoded[],
    toKeep: messages.slice(splitIndex) as MessageEncoded[],
  };
};

/**
 * Summarize a list of messages using the language model.
 */
const summarizeMessages = Effect.fn(function* (
  model: LLM.Service,
  messages: readonly MessageEncoded[],
  config: CompactionConfig,
) {
  const conversationText = messages
    .map((m) => {
      const content =
        typeof m.content === "string" ? m.content : JSON.stringify(m.content);
      return `${m.role}: ${content}`;
    })
    .join("\n\n");

  const summaryPrompt = `Summarize the following conversation history concisely.
Focus on:
- Key decisions made
- Important context established  
- Files discussed or modified
- Current state of any ongoing tasks

Keep the summary under ${config.summaryMaxTokens} tokens.

Conversation:
${conversationText}`;

  const response = yield* model
    .generateText({
      prompt: summaryPrompt,
    })
    .pipe(
      Effect.mapError(
        (cause) =>
          new ContextManagerError({
            message: "Failed to summarize messages",
            cause,
          }),
      ),
    );
  return response.text;
});
