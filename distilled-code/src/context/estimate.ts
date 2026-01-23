import type { MessageEncoded } from "../state.ts";

// TODO(sam): use a tokenizer to estimate tokens?

/**
 * Estimate token count for a message.
 * Uses simple heuristic: ~4 characters per token.
 */
export const estimateTokens = (message: MessageEncoded): number => {
  const content =
    typeof message.content === "string"
      ? message.content
      : JSON.stringify(message.content);
  return Math.ceil(content.length / 4);
};

/**
 * Estimate total token count for all messages.
 */
export const estimateTotalTokens = (
  messages: readonly MessageEncoded[],
): number => messages.reduce((sum, msg) => sum + estimateTokens(msg), 0);
