import type { MessageEncoded } from "@effect/ai/Prompt";
import { NodeContext } from "@effect/platform-node";
import { describe, expect, it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import {
  ContextManager,
  ContextManagerError,
  defaultCompactionConfig,
  estimateTokens,
  estimateTotalTokens,
  NaiveContextManager,
} from "../../src/services/context.ts";
import { AgentState, FileSystemAgentState } from "../../src/services/state.ts";

// Test layer that provides AgentState
const testStateLayer = Layer.provideMerge(
  FileSystemAgentState,
  NodeContext.layer,
);

describe("ContextManager", () => {
  describe("estimateTokens", () => {
    it("estimates tokens for string content", () => {
      const message: MessageEncoded = {
        role: "user",
        content: "Hello, world!", // 13 chars -> ~4 tokens
      };
      const tokens = estimateTokens(message);
      expect(tokens).toBe(4); // ceil(13/4) = 4
    });

    it("estimates tokens for object content", () => {
      const message: MessageEncoded = {
        role: "assistant",
        content: [{ type: "text", text: "Hello" }],
      };
      const tokens = estimateTokens(message);
      expect(tokens).toBeGreaterThan(0);
    });
  });

  describe("estimateTotalTokens", () => {
    it("sums tokens across messages", () => {
      const messages: MessageEncoded[] = [
        { role: "user", content: "Hello" }, // 5 chars -> 2 tokens
        { role: "assistant", content: "Hi there" }, // 8 chars -> 2 tokens
      ];
      const total = estimateTotalTokens(messages);
      expect(total).toBe(4);
    });

    it("returns 0 for empty array", () => {
      const total = estimateTotalTokens([]);
      expect(total).toBe(0);
    });
  });

  describe("NaiveContextManager", () => {
    it.effect("prepares context with system prompt first", () =>
      Effect.gen(function* () {
        const manager = yield* ContextManager;

        const result = yield* manager.prepareContext({
          agentKey: "test-naive-1",
          systemPrompt: "You are a helpful assistant.",
        });

        expect(result.length).toBe(1);
        expect(result[0].role).toBe("system");
        expect(result[0].content).toBe("You are a helpful assistant.");
      }).pipe(
        Effect.provide(NaiveContextManager),
        Effect.provide(testStateLayer),
      ),
    );

    it.effect("filters out existing system messages from history", () =>
      Effect.gen(function* () {
        const state = yield* AgentState;
        const agentKey = "test-naive-filter";

        // Save some messages including a system message
        const messages: MessageEncoded[] = [
          { role: "system", content: "Old system prompt" },
          { role: "user", content: "Hello" },
          { role: "assistant", content: "Hi there!" },
        ];
        yield* state.saveMessages(
          agentKey,
          JSON.stringify({ content: messages }),
        );

        const manager = yield* ContextManager;
        const result = yield* manager.prepareContext({
          agentKey,
          systemPrompt: "New system prompt",
        });

        // Should have new system prompt + user + assistant (no old system)
        expect(result.length).toBe(3);
        expect(result[0].role).toBe("system");
        expect(result[0].content).toBe("New system prompt");
        expect(result[1].role).toBe("user");
        expect(result[2].role).toBe("assistant");

        // Clean up
        yield* state.delete(agentKey);
      }).pipe(
        Effect.provide(NaiveContextManager),
        Effect.provide(testStateLayer),
      ),
    );

    it.effect("handles missing state gracefully", () =>
      Effect.gen(function* () {
        const manager = yield* ContextManager;

        const result = yield* manager.prepareContext({
          agentKey: "nonexistent-agent-key",
          systemPrompt: "Test prompt",
        });

        expect(result.length).toBe(1);
        expect(result[0].role).toBe("system");
      }).pipe(
        Effect.provide(NaiveContextManager),
        Effect.provide(testStateLayer),
      ),
    );
  });

  describe("CompactionConfig", () => {
    it("has reasonable defaults", () => {
      expect(defaultCompactionConfig.maxTokens).toBe(128_000);
      expect(defaultCompactionConfig.compactionThreshold).toBe(100_000);
      expect(defaultCompactionConfig.targetTokens).toBe(50_000);
      expect(defaultCompactionConfig.summaryMaxTokens).toBe(4_000);
    });
  });

  describe("ContextManagerError", () => {
    it("is tagged correctly", () => {
      const error = new ContextManagerError({ message: "Test error" });
      expect(error._tag).toBe("ContextManagerError");
      expect(error.message).toBe("Test error");
    });

    it("includes cause when provided", () => {
      const cause = new Error("Original error");
      const error = new ContextManagerError({
        message: "Wrapped error",
        cause,
      });
      expect(error.cause).toBe(cause);
    });
  });
});
