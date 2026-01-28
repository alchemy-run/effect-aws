import type { MessageEncoded } from "@effect/ai/Prompt";
import * as Effect from "effect/Effect";
import { describe, expect } from "vitest";
import { Agent } from "../src/agent.ts";
import { Channel } from "../src/chat/channel.ts";
import { GroupChat } from "../src/chat/group-chat.ts";
import { StateStore } from "../src/state/index.ts";
import { collect } from "../src/stream.ts";
import {
  createThreadCoordinator,
  extractParticipants,
  parseMentions,
} from "../src/thread.ts";
import { test } from "./test.ts";

// =============================================================================
// Test Helpers
// =============================================================================

/**
 * Helper to build and write a conversation history for testing.
 * This writes proper MessageEncoded objects that the coordinator can read.
 */
const buildConversation = (
  threadId: string,
  messages: Array<{
    role: "user" | "assistant";
    speaker?: string;
    content: string;
  }>,
) =>
  Effect.gen(function* () {
    const store = yield* StateStore;

    const encoded: MessageEncoded[] = messages.map((msg) => {
      if (msg.role === "user") {
        // User messages directed at a specific agent
        const content = msg.speaker
          ? `[User to @${msg.speaker}]: ${msg.content}`
          : msg.content;
        return {
          role: "user" as const,
          content,
        };
      } else {
        // Agent responses tagged with who is speaking
        const content = msg.speaker
          ? `[@${msg.speaker}]: ${msg.content}`
          : msg.content;
        return {
          role: "assistant" as const,
          content: [{ type: "text" as const, text: content }],
        };
      }
    });

    // Write all messages at once to the thread
    // All participants share the same conversation history
    yield* store.writeThreadMessages(threadId, encoded);
  });

// =============================================================================
// Test Agents
// =============================================================================

class Dev extends Agent("dev")`A developer who writes code and reviews PRs` {}
class Tester extends Agent("tester")`A QA engineer who writes and runs tests` {}
class Designer extends Agent(
  "designer",
)`A UI/UX designer who creates mockups and designs` {}

// =============================================================================
// Test Channels/Groups
// =============================================================================

class Engineering extends Channel("engineering")`
Engineering channel for technical discussions.
Members: ${Dev}, ${Tester}, ${Designer}
` {}

class CodeReview extends GroupChat("code-review")`
Code review group for reviewing pull requests.
Participants: ${Dev}, ${Tester}
` {}

// =============================================================================
// Tests
// =============================================================================

describe("ThreadCoordinator", () => {
  // ---------------------------------------------------------------------------
  // parseMentions tests (pure unit tests, no API calls)
  // ---------------------------------------------------------------------------
  describe("parseMentions", () => {
    test("extracts single @mention", () =>
      Effect.sync(() => {
        expect(parseMentions("Hey @dev can you help?")).toEqual(["dev"]);
      }));

    test("extracts multiple @mentions", () =>
      Effect.sync(() => {
        expect(parseMentions("@dev write code and @tester test it")).toEqual([
          "dev",
          "tester",
        ]);
      }));

    test("returns empty array when no mentions", () =>
      Effect.sync(() => {
        expect(parseMentions("Hello everyone")).toEqual([]);
      }));

    test("handles hyphenated agent names", () =>
      Effect.sync(() => {
        expect(parseMentions("Ask @code-reviewer for help")).toEqual([
          "code-reviewer",
        ]);
      }));

    test("handles multiple mentions of same agent", () =>
      Effect.sync(() => {
        expect(
          parseMentions("@dev can you help? Also @dev check this"),
        ).toEqual(["dev", "dev"]);
      }));

    test("handles mentions at start, middle, and end", () =>
      Effect.sync(() => {
        expect(
          parseMentions("@dev please help @tester with this @designer"),
        ).toEqual(["dev", "tester", "designer"]);
      }));
  });

  // ---------------------------------------------------------------------------
  // extractParticipants tests (pure unit tests, no API calls)
  // ---------------------------------------------------------------------------
  describe("extractParticipants", () => {
    test("extracts agents from channel references", () =>
      Effect.sync(() => {
        const participants = extractParticipants(Engineering);
        const ids = participants.map((p) => p.id);
        expect(ids).toContain("dev");
        expect(ids).toContain("tester");
        expect(ids).toContain("designer");
        expect(ids).toHaveLength(3);
      }));

    test("extracts agents from group chat references", () =>
      Effect.sync(() => {
        const participants = extractParticipants(CodeReview);
        const ids = participants.map((p) => p.id);
        expect(ids).toContain("dev");
        expect(ids).toContain("tester");
        expect(ids).not.toContain("designer");
        expect(ids).toHaveLength(2);
      }));
  });

  // ---------------------------------------------------------------------------
  // Coordinator respond decisions (real API calls)
  // ---------------------------------------------------------------------------
  describe("respond decisions", () => {
    test(
      "invokes single agent on direct @mention",
      { timeout: 60_000 },
      Effect.gen(function* () {
        const threadId = `test-single-mention-${Date.now()}`;
        const coordinator = yield* createThreadCoordinator(
          Engineering,
          threadId,
        );

        const parts = yield* coordinator
          .process("Hey @dev can you review this PR?")
          .pipe(collect);

        // Find respond tool calls from coordinator (before agent responses)
        // The coordinator's tool calls are internal, but we can verify
        // the agent streams are tagged correctly
        const agentIds = [...new Set(parts.map((p) => p.agentId))];

        expect(agentIds).toContain("dev");
        // Should not invoke other agents for a specific @mention
        expect(agentIds).not.toContain("designer");
      }),
    );

    test(
      "invokes multiple agents when multiple @mentions",
      { timeout: 90_000 },
      Effect.gen(function* () {
        const threadId = `test-multi-mention-${Date.now()}`;
        const coordinator = yield* createThreadCoordinator(
          Engineering,
          threadId,
        );

        const parts = yield* coordinator
          .process("@dev write code and @tester test it please")
          .pipe(collect);

        const agentIds = [...new Set(parts.map((p) => p.agentId))];

        expect(agentIds).toContain("dev");
        expect(agentIds).toContain("tester");
      }),
    );

    test(
      "invokes agent based on expertise without @mention",
      { timeout: 60_000 },
      Effect.gen(function* () {
        const threadId = `test-expertise-${Date.now()}`;
        const coordinator = yield* createThreadCoordinator(
          Engineering,
          threadId,
        );

        const parts = yield* coordinator
          .process("Can someone help me debug this test failure?")
          .pipe(collect);

        const agentIds = [...new Set(parts.map((p) => p.agentId))];

        // Should invoke tester (test failure) and/or dev (debugging)
        expect(agentIds.length).toBeGreaterThan(0);
        expect(agentIds.includes("tester") || agentIds.includes("dev")).toBe(
          true,
        );
      }),
    );

    test(
      "only invokes agents in the group",
      { timeout: 60_000 },
      Effect.gen(function* () {
        const threadId = `test-group-scope-${Date.now()}`;
        // CodeReview group only has dev and tester, not designer
        const coordinator = yield* createThreadCoordinator(
          CodeReview,
          threadId,
        );

        const parts = yield* coordinator
          .process("@designer can you create a mockup?")
          .pipe(collect);

        const agentIds = [...new Set(parts.map((p) => p.agentId))];

        // Designer is not in CodeReview group, so shouldn't be invoked
        expect(agentIds).not.toContain("designer");
      }),
    );
  });

  // ---------------------------------------------------------------------------
  // Context-aware routing (multi-turn conversations testing LLM intelligence)
  // These tests build realistic conversation histories where context is crucial.
  // The final message alone does NOT clearly indicate who should respond.
  // ---------------------------------------------------------------------------
  describe("context-aware routing", () => {
    test(
      "references earlier promise to follow up - only that agent should respond",
      { timeout: 90_000 },
      Effect.gen(function* () {
        const threadId = `test-promise-followup-${Date.now()}`;

        // Tester promised to investigate something earlier
        yield* buildConversation(threadId, [
          {
            role: "user",
            speaker: "tester",
            content: "The CI pipeline is failing intermittently",
          },
          {
            role: "assistant",
            speaker: "tester",
            content:
              "I'll investigate the flaky tests and get back to you with findings.",
          },
          {
            role: "user",
            speaker: "dev",
            content: "Thanks! In the meantime I'll work on the feature code",
          },
          {
            role: "assistant",
            speaker: "dev",
            content:
              "I've pushed the initial implementation to the feature branch.",
          },
          {
            role: "user",
            speaker: "designer",
            content: "The mockups are ready for review",
          },
          {
            role: "assistant",
            speaker: "designer",
            content: "I've uploaded them to Figma.",
          },
        ]);

        const coordinator = yield* createThreadCoordinator(
          Engineering,
          threadId,
        );

        // Ambiguous message - "you" refers to tester who promised to follow up
        const parts = yield* coordinator
          .process("Any updates on what you found?")
          .pipe(collect);

        const agentIds = [...new Set(parts.map((p) => p.agentId))];

        // Only tester should respond - they promised to get back with findings
        expect(agentIds).toEqual(["tester"]);
      }),
    );

    test(
      "resolves 'that issue' to the agent who raised it",
      { timeout: 90_000 },
      Effect.gen(function* () {
        const threadId = `test-issue-reference-${Date.now()}`;

        // Designer raised an issue earlier in the conversation
        yield* buildConversation(threadId, [
          {
            role: "user",
            speaker: "dev",
            content: "I've added the new button component",
          },
          {
            role: "assistant",
            speaker: "dev",
            content: "The component is ready for styling",
          },
          {
            role: "user",
            speaker: "designer",
            content:
              "The button contrast ratio doesn't meet accessibility standards - it's only 3.2:1 and we need 4.5:1",
          },
          {
            role: "assistant",
            speaker: "designer",
            content: "This needs to be fixed before we ship",
          },
          {
            role: "user",
            speaker: "tester",
            content: "I'll add accessibility tests once the fix is in",
          },
          {
            role: "assistant",
            speaker: "tester",
            content: "I have the testing framework ready",
          },
        ]);

        const coordinator = yield* createThreadCoordinator(
          Engineering,
          threadId,
        );

        // "that issue" refers to designer's accessibility concern
        const parts = yield* coordinator
          .process("Can you give me more details on that issue?")
          .pipe(collect);

        const agentIds = [...new Set(parts.map((p) => p.agentId))];

        // Designer should respond - they raised the accessibility issue
        expect(agentIds).toEqual(["designer"]);
      }),
    );

    test(
      "routes question about testing to the testing expert",
      { timeout: 90_000 },
      Effect.gen(function* () {
        const threadId = `test-expert-routing-${Date.now()}`;

        // Dev struggled with a testing problem, tester helped before
        yield* buildConversation(threadId, [
          {
            role: "user",
            speaker: "dev",
            content: "I'm stuck on mocking the database in my tests",
          },
          {
            role: "assistant",
            speaker: "dev",
            content: "The dependency injection isn't working as expected",
          },
          {
            role: "user",
            speaker: "tester",
            content: "Try using jest.mock() at the top of your test file",
          },
          {
            role: "assistant",
            speaker: "tester",
            content:
              "You need to mock the module before importing the code under test",
          },
          {
            role: "user",
            speaker: "designer",
            content: "I finished the error state designs",
          },
          {
            role: "assistant",
            speaker: "designer",
            content: "They're in the shared folder",
          },
        ]);

        const coordinator = yield* createThreadCoordinator(
          Engineering,
          threadId,
        );

        // Follow-up on the testing topic - tester was helping
        const parts = yield* coordinator
          .process("That didn't work, the mock is still returning undefined")
          .pipe(collect);

        const agentIds = [...new Set(parts.map((p) => p.agentId))];

        // Tester should respond - they were helping with the testing problem
        expect(agentIds).toContain("tester");
        // Designer should NOT respond - this is about testing
        expect(agentIds).not.toContain("designer");
      }),
    );

    test(
      "routes continuation of technical discussion to original participants",
      { timeout: 90_000 },
      Effect.gen(function* () {
        const threadId = `test-technical-discussion-${Date.now()}`;

        // Dev and tester were having a technical discussion
        yield* buildConversation(threadId, [
          {
            role: "user",
            speaker: "dev",
            content: "Should we use Jest or Vitest for the new module?",
          },
          {
            role: "assistant",
            speaker: "dev",
            content: "I'm leaning towards Vitest for the speed improvements",
          },
          {
            role: "user",
            speaker: "tester",
            content:
              "Vitest is good but we need to check snapshot compatibility",
          },
          {
            role: "assistant",
            speaker: "tester",
            content: "Let me test the migration path",
          },
          // Designer chimes in about something unrelated
          {
            role: "user",
            speaker: "designer",
            content: "BTW the new icons are ready",
          },
          {
            role: "assistant",
            speaker: "designer",
            content: "I've exported them in SVG format",
          },
        ]);

        const coordinator = yield* createThreadCoordinator(
          Engineering,
          threadId,
        );

        // This continues the testing framework discussion
        const parts = yield* coordinator
          .process("What about the mocking capabilities?")
          .pipe(collect);

        const agentIds = [...new Set(parts.map((p) => p.agentId))];

        // Dev and/or tester should respond - they were discussing testing frameworks
        // Designer should NOT respond - this is clearly about the earlier technical discussion
        expect(agentIds).not.toContain("designer");
        expect(agentIds.some((id) => id === "dev" || id === "tester")).toBe(
          true,
        );
      }),
    );

    test(
      "routes 'as you mentioned' to the agent who made that point",
      { timeout: 90_000 },
      Effect.gen(function* () {
        const threadId = `test-as-mentioned-${Date.now()}`;

        // Each agent made different points
        yield* buildConversation(threadId, [
          {
            role: "user",
            speaker: "dev",
            content: "We should use TypeScript strict mode",
          },
          {
            role: "assistant",
            speaker: "dev",
            content: "It catches more bugs at compile time",
          },
          {
            role: "user",
            speaker: "tester",
            content: "We should add integration tests for the API",
          },
          {
            role: "assistant",
            speaker: "tester",
            content: "Unit tests alone aren't catching the edge cases",
          },
          {
            role: "user",
            speaker: "designer",
            content:
              "We should use a consistent color palette across all pages",
          },
          {
            role: "assistant",
            speaker: "designer",
            content: "Right now we have 47 different shades of blue",
          },
        ]);

        const coordinator = yield* createThreadCoordinator(
          Engineering,
          threadId,
        );

        // Reference what designer said about colors
        const parts = yield* coordinator
          .process(
            "About the color inconsistency you mentioned - how should we consolidate?",
          )
          .pipe(collect);

        const agentIds = [...new Set(parts.map((p) => p.agentId))];

        // Only designer should respond - they mentioned the color issue
        expect(agentIds).toEqual(["designer"]);
      }),
    );

    test(
      "routes back to agent who was interrupted mid-explanation",
      { timeout: 90_000 },
      Effect.gen(function* () {
        const threadId = `test-interrupted-${Date.now()}`;

        // Dev was explaining something but got interrupted
        yield* buildConversation(threadId, [
          {
            role: "user",
            speaker: "dev",
            content:
              "Let me explain the architecture. First, we have the API layer which handles...",
          },
          {
            role: "assistant",
            speaker: "dev",
            content:
              "The API layer uses Express middleware for auth, then routes to controllers",
          },
          {
            role: "user",
            speaker: "tester",
            content: "Quick question - is the staging env down?",
          },
          {
            role: "assistant",
            speaker: "tester",
            content: "Never mind, it's back up now",
          },
          {
            role: "user",
            speaker: "designer",
            content: "Sorry to interrupt - where are the API docs?",
          },
          {
            role: "assistant",
            speaker: "designer",
            content: "Found them, thanks",
          },
        ]);

        const coordinator = yield* createThreadCoordinator(
          Engineering,
          threadId,
        );

        // Continue the architecture explanation that dev started
        const parts = yield* coordinator
          .process("Ok, please continue with the architecture explanation")
          .pipe(collect);

        const agentIds = [...new Set(parts.map((p) => p.agentId))];

        // Only dev should respond - they were explaining the architecture
        expect(agentIds).toEqual(["dev"]);
      }),
    );

    test(
      "routes to agent whose work is being discussed by others",
      { timeout: 90_000 },
      Effect.gen(function* () {
        const threadId = `test-work-discussed-${Date.now()}`;

        // Others discussing tester's work without them participating recently
        yield* buildConversation(threadId, [
          {
            role: "user",
            speaker: "tester",
            content: "I've written 50 new E2E tests for the checkout flow",
          },
          {
            role: "assistant",
            speaker: "tester",
            content: "They cover all the edge cases we found in production",
          },
          {
            role: "user",
            speaker: "dev",
            content: "Those tests are failing in CI now after my refactor",
          },
          {
            role: "assistant",
            speaker: "dev",
            content: "I changed the checkout API contract",
          },
          {
            role: "user",
            speaker: "designer",
            content:
              "The checkout flow UI also changed, might affect selectors",
          },
          {
            role: "assistant",
            speaker: "designer",
            content: "I updated the button class names",
          },
        ]);

        const coordinator = yield* createThreadCoordinator(
          Engineering,
          threadId,
        );

        // Asking about the tests that tester wrote
        const parts = yield* coordinator
          .process("Can you update those tests to work with the new changes?")
          .pipe(collect);

        const agentIds = [...new Set(parts.map((p) => p.agentId))];

        // Tester should respond - they own the tests being discussed
        expect(agentIds).toContain("tester");
      }),
    );
  });

  // ---------------------------------------------------------------------------
  // Agent execution tests (real API calls)
  // ---------------------------------------------------------------------------
  describe("agent execution", () => {
    test(
      "spawned agents receive the message and produce stream parts",
      { timeout: 120_000 },
      Effect.gen(function* () {
        const threadId = `test-agent-response-${Date.now()}`;
        const coordinator = yield* createThreadCoordinator(
          Engineering,
          threadId,
        );

        const parts = yield* coordinator
          .process("@dev say hello")
          .pipe(collect);

        // Should have parts from the dev agent's response
        const devParts = parts.filter((p) => p.agentId === "dev");
        expect(devParts.length).toBeGreaterThan(0);

        // Should have some response content (text or tool calls)
        const responseParts = devParts.filter(
          (p) =>
            p.part?.type === "text-delta" ||
            p.part?.type === "text-start" ||
            p.part?.type === "tool-call" ||
            p.part?.type === "finish",
        );
        expect(responseParts.length).toBeGreaterThan(0);
      }),
    );
  });
});
