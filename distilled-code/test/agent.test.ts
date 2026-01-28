import * as FileSystem from "@effect/platform/FileSystem";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import { describe, expect } from "vitest";
import { Agent, spawn } from "../src/agent.ts";
import * as File from "../src/file/index.ts";
import { StateStore } from "../src/state/index.ts";
import { toText } from "../src/stream.ts";
import { Coding } from "../src/toolkit/coding.ts";
import { test } from "./test.ts";

// Simple test agent
class TestAgent extends Agent("test-agent")`A simple test agent` {}

// Agent with coding tools
class CodingAgent extends Agent("coding-agent")`
An agent that can read and navigate codebases using coding tools.

Use the tools available to you to help answer questions about code.

${Coding}
` {}

// Helper agent that knows a secret
class HelperAgent extends Agent("helper-agent")`
You are a helper agent that knows a secret code: OMEGA-789.
When asked for the secret, always respond with exactly: OMEGA-789
` {}

// Orchestrator agent that can delegate to the helper
class OrchestratorAgent extends Agent("orchestrator-agent")`
You are an orchestrator agent. You do not know any secrets yourself.

You MUST use the send tool to communicate with other agents. Never make up answers.

Available agents:
${HelperAgent}
` {}

describe("Agent", () => {
  test(
    "send returns a stream of ThreadParts",
    { timeout: 60_000 },
    Effect.gen(function* () {
      const myAgent = yield* spawn(TestAgent);

      // Collect stream parts
      const parts: unknown[] = [];
      yield* Stream.runForEach(myAgent.send("Say hello"), (part) =>
        Effect.sync(() => parts.push(part)),
      );

      // Verify we received stream parts
      expect(parts.length).toBeGreaterThan(0);

      // Verify part types
      const partTypes = parts.map((p: any) => p.type);
      expect(partTypes).toContain("text-start");
      expect(partTypes).toContain("text-delta");
      expect(partTypes).toContain("text-end");
    }),
  );

  test(
    "toText extracts text from stream",
    { timeout: 60_000 },
    Effect.gen(function* () {
      const myAgent = yield* spawn(TestAgent);

      // Use toText to extract the response
      const response = yield* myAgent
        .send("Say exactly: HELLO_WORLD")
        .pipe(toText("last-message"));

      expect(response.toUpperCase()).toContain("HELLO");
    }),
  );

  test(
    "agent persists chat history",
    { timeout: 120_000 },
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;

      // Session 1: Tell agent a secret
      const agent1 = yield* spawn(TestAgent);
      yield* agent1
        .send("Remember this code: ALPHA-123")
        .pipe(toText("last-message"));

      // Verify state was persisted (SQLite database file)
      const stateExists = yield* fs.exists(".distilled/state.db");
      expect(stateExists).toBe(true);

      // Session 2: Ask agent to recall
      const agent2 = yield* spawn(TestAgent);
      const response = yield* agent2
        .send("What code did I tell you to remember?")
        .pipe(toText("last-message"));

      expect(response.toUpperCase()).toContain("ALPHA");
    }),
  );

  test(
    "coding agent can list files using glob tool",
    { timeout: 120_000 },
    Effect.gen(function* () {
      // Use a unique thread ID to avoid state conflicts
      const uniqueThreadId = `coding-agent-${Date.now()}`;
      const codingAgent = yield* spawn(CodingAgent, uniqueThreadId);

      // Collect stream parts to inspect tool calls
      const parts: unknown[] = [];
      yield* Stream.runForEach(
        codingAgent.send(
          "Use the glob tool to list all TypeScript files (*.ts) in the src/tool directory. Return just the file names you found.",
        ),
        (part) => Effect.sync(() => parts.push(part)),
      );

      // Verify we got stream parts
      expect(parts.length).toBeGreaterThan(0);

      // Check that a tool was called
      const partTypes = parts.map((p: any) => p.type);
      expect(partTypes).toContain("tool-call");
      expect(partTypes).toContain("tool-result");

      // Verify glob tool was specifically called
      const toolCalls = parts.filter((p: any) => p.type === "tool-call");
      const globCall = toolCalls.find((p: any) => p.name === "glob");
      expect(globCall).toBeDefined();

      // Verify we got results back
      const toolResults = parts.filter((p: any) => p.type === "tool-result");
      expect(toolResults.length).toBeGreaterThan(0);

      // Check that the result contains file paths
      const globResult = toolResults.find((p: any) => p.name === "glob");
      expect(globResult).toBeDefined();
      // The result structure depends on how @effect/ai returns tool results
      // It could be in 'value', 'result', or directly on the part
      const resultValue =
        (globResult as any).value ??
        (globResult as any).result ??
        (globResult as any).output;
      expect(resultValue).toBeDefined();
    }),
  );

  test(
    "agent can send message to another agent",
    { timeout: 120_000 },
    Effect.gen(function* () {
      const uniqueThreadId = `orchestrator-test-${Date.now()}`;
      const orchestrator = yield* spawn(OrchestratorAgent, uniqueThreadId);

      // Collect stream parts to inspect tool calls
      const parts: unknown[] = [];
      yield* Stream.runForEach(
        orchestrator.send(
          "Use the send tool to ask the helper-agent for the secret code. You MUST use the send tool with recipient 'helper-agent' to get the answer.",
        ),
        (part) => Effect.sync(() => parts.push(part)),
      );

      // Verify we got stream parts
      expect(parts.length).toBeGreaterThan(0);

      // Check that the send tool was called to communicate with the helper
      const partTypes = parts.map((p: any) => p.type);
      expect(partTypes).toContain("tool-call");
      expect(partTypes).toContain("tool-result");

      // Verify send tool was specifically called with helper-agent as recipient
      const toolCalls = parts.filter((p: any) => p.type === "tool-call");
      const sendCall = toolCalls.find((p: any) => p.name === "send");
      expect(sendCall).toBeDefined();
      expect((sendCall as any).params?.recipient).toBe("helper-agent");

      // Verify we got a result back containing the secret
      const toolResults = parts.filter((p: any) => p.type === "tool-result");
      const sendResult = toolResults.find((p: any) => p.name === "send");
      expect(sendResult).toBeDefined();

      // The tool result should contain the secret from the helper
      expect((sendResult as any).result).toContain("OMEGA");
    }),
  );

  test(
    "agent with multiple file refs and duplicate refs works with API",
    { timeout: 120_000 },
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;

      // Create test fixture files
      yield* fs.writeFileString(
        "test/fixtures/agent-test-service.ts",
        "// service client",
      );
      yield* fs.writeFileString(
        "test/fixtures/agent-test-plan.md",
        "# Test Plan",
      );
      yield* fs.writeFileString(
        "test/fixtures/agent-test-impl.ts",
        "// test implementation",
      );
      yield* fs.writeFileString(
        "test/fixtures/agent-test-errors.json",
        '{"errors": {}}',
      );

      // Define file classes
      class ServiceClient extends File.TypeScript`test/fixtures/agent-test-service.ts``
      Service client` {}
      class TestPlan extends File.Markdown`test/fixtures/agent-test-plan.md``
      Test plan` {}
      class TestImpl extends File.TypeScript`test/fixtures/agent-test-impl.ts``
      Test implementation` {}
      class ErrorPatch extends File.Json`test/fixtures/agent-test-errors.json``
      Error patches` {}

      // Mirrors Developer agent from distilled-cloudflare with duplicate ErrorPatch ref
      class DeveloperAgent extends Agent("developer-api-test")`
Implement tests per ${TestPlan} using ${Coding}.

## Files
- ${ServiceClient} - signatures
- ${TestImpl} - implement here
- ${ErrorPatch} - patch errors

## On Error
1. Update ${ErrorPatch}
2. Regenerate
` {}

      const uniqueThreadId = `developer-api-test-${Date.now()}`;
      const developer = yield* spawn(DeveloperAgent, uniqueThreadId);

      // Send a simple message - if duplicate IDs exist, the API will reject with:
      // "messages.1.content.2: tool_use ids must be unique"
      const response = yield* developer
        .send("Say hello and confirm you can see the test files.")
        .pipe(toText("last-message"));

      // If we get here without an error, the context was valid (no duplicate IDs)
      expect(response.length).toBeGreaterThan(0);
    }),
  );

  test(
    "no duplicate parts persisted when agent sends to another agent",
    { timeout: 180_000 },
    Effect.gen(function* () {
      const store = yield* StateStore;
      const uniqueThreadId = `duplicate-parts-test-${Date.now()}`;

      // Clean up any existing thread data
      yield* store.deleteThread("orchestrator-agent", uniqueThreadId);
      yield* store.deleteThread("helper-agent", uniqueThreadId);

      // Spawn orchestrator which will delegate to helper
      const orchestrator = yield* spawn(OrchestratorAgent, uniqueThreadId);

      // Send a message that triggers inter-agent communication
      // This mirrors the TUI pattern where subscription and send happen close together
      yield* Stream.runForEach(
        orchestrator.send(
          "Use the send tool to ask the helper-agent for the secret code.",
        ),
        () => Effect.void,
      );

      // Read persisted parts for the orchestrator
      const orchestratorParts = yield* store.readThreadParts(
        "orchestrator-agent",
        uniqueThreadId,
      );

      // Read persisted parts for the helper
      const helperParts = yield* store.readThreadParts(
        "helper-agent",
        uniqueThreadId,
      );

      // Check for duplicate part IDs in orchestrator parts
      const orchestratorPartIds = orchestratorParts
        .map((p: any) => p.id)
        .filter((id: unknown): id is string => id !== undefined);
      const uniqueOrchestratorIds = [...new Set(orchestratorPartIds)];

      // Check for duplicate part IDs in helper parts
      const helperPartIds = helperParts
        .map((p: any) => p.id)
        .filter((id: unknown): id is string => id !== undefined);
      const uniqueHelperIds = [...new Set(helperPartIds)];

      // Log for debugging
      console.log(
        `Orchestrator parts: ${orchestratorParts.length}, unique IDs: ${uniqueOrchestratorIds.length}/${orchestratorPartIds.length}`,
      );
      console.log(
        `Helper parts: ${helperParts.length}, unique IDs: ${uniqueHelperIds.length}/${helperPartIds.length}`,
      );

      // Also check for duplicate parts by type+id combination
      const orchestratorTypeIds = orchestratorParts.map(
        (p: any) => `${p.type}:${p.id ?? "no-id"}`,
      );
      const uniqueOrchestratorTypeIds = [...new Set(orchestratorTypeIds)];

      const helperTypeIds = helperParts.map(
        (p: any) => `${p.type}:${p.id ?? "no-id"}`,
      );
      const uniqueHelperTypeIds = [...new Set(helperTypeIds)];

      console.log(
        `Orchestrator type:id combos: ${uniqueOrchestratorTypeIds.length}/${orchestratorTypeIds.length}`,
      );
      console.log(
        `Helper type:id combos: ${uniqueHelperTypeIds.length}/${helperTypeIds.length}`,
      );

      // Find duplicates for detailed error message
      if (orchestratorPartIds.length !== uniqueOrchestratorIds.length) {
        const seen = new Set<string>();
        const duplicates: string[] = [];
        for (const id of orchestratorPartIds) {
          if (seen.has(id)) {
            duplicates.push(id);
          }
          seen.add(id);
        }
        console.log(
          `Duplicate orchestrator part IDs: ${duplicates.join(", ")}`,
        );
      }

      if (helperPartIds.length !== uniqueHelperIds.length) {
        const seen = new Set<string>();
        const duplicates: string[] = [];
        for (const id of helperPartIds) {
          if (seen.has(id)) {
            duplicates.push(id);
          }
          seen.add(id);
        }
        console.log(`Duplicate helper part IDs: ${duplicates.join(", ")}`);
      }

      // Verify no duplicate IDs
      expect(
        orchestratorPartIds.length,
        "Orchestrator has duplicate part IDs",
      ).toBe(uniqueOrchestratorIds.length);
      expect(helperPartIds.length, "Helper has duplicate part IDs").toBe(
        uniqueHelperIds.length,
      );

      // Verify no duplicate type:id combinations (catches all duplicates)
      expect(
        orchestratorTypeIds.length,
        "Orchestrator has duplicate parts",
      ).toBe(uniqueOrchestratorTypeIds.length);
      expect(helperTypeIds.length, "Helper has duplicate parts").toBe(
        uniqueHelperTypeIds.length,
      );

      // Clean up
      yield* store.deleteThread("orchestrator-agent", uniqueThreadId);
      yield* store.deleteThread("helper-agent", uniqueThreadId);
    }),
  );
});
