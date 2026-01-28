import { type MessageEncoded } from "@effect/ai/Prompt";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";

/**
 * Error that occurs during context preparation.
 */
export class ContextManagerError extends Data.TaggedError(
  "ContextManagerError",
)<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

/**
 * Parameters for preparing context.
 */
export interface PrepareContextParams {
  /** The thread ID */
  readonly threadId: string;
  /** The system prompt (will be prepended to messages) */
  readonly systemPrompt: string;
}

/**
 * ContextManager service interface.
 * Prepares chat context from agent state with pluggable strategies.
 */
export interface ContextManager {
  /**
   * Prepare context messages for a chat session.
   * Returns messages ready to be passed to Chat.fromPrompt.
   * The system prompt is included as the first message.
   */
  prepareContext(
    params: PrepareContextParams,
  ): Effect.Effect<readonly MessageEncoded[], ContextManagerError>;
}

export const ContextManager =
  Context.GenericTag<ContextManager>("ContextManager");
