/**
 * Distilled-code configuration for generating Cloudflare API tests.
 *
 * This config dynamically generates agents from the Cloudflare TypeScript SDK:
 * 1. Uses parseCode() to extract operations from the SDK
 * 2. Creates one workflow agent per operation (e.g., "r2/getBucket", "workers/createScript")
 * 3. Each workflow orchestrates designer -> coder -> reviewer loop
 */

import { FileSystem } from "@effect/platform";
import { agent, defineConfig, Toolkit } from "distilled-code";
import { Effect, Schema } from "effect";
import { parseCode } from "./scripts/parse.ts";

const SDK_PATH = "../../cloudflare-typescript/src/resources";

// ============================================================================
// Review Result Schema - structured response from reviewer
// ============================================================================

const ReviewResult = Schema.Struct({
  complete: Schema.Boolean.annotations({
    description: "Whether the implementation is complete",
  }),
  feedback: Schema.optional(Schema.String).annotations({
    description: "Feedback for the coder if not complete",
  }),
  missingTests: Schema.optional(Schema.Array(Schema.String)).annotations({
    description: "List of missing test cases",
  }),
  issues: Schema.optional(Schema.Array(Schema.String)).annotations({
    description: "Issues found in the implementation",
  }),
});

// ============================================================================
// Config Export
// ============================================================================

export default defineConfig({
  name: "distilled-cloudflare-tests",
  model: "claude-opus-4-5",
  agents: Effect.gen(function* () {
    const services = yield* parseCode({ basePath: SDK_PATH });

    return yield* Effect.all(
      services.flatMap((service) =>
        service.operations.map((op) => {
          const pathParams = op.pathParams
            .map((p) => `  - ${p.name}: ${p.type.kind}`)
            .join("\n");
          const queryParams = op.queryParams
            .map((p) => `  - ${p.name}${p.required ? "" : "?"}: ${p.type.kind}`)
            .join("\n");
          const resources = op.resources;

          return agent(
            `${service.name}/${op.operationName}`,
            { tags: [service.name, op.httpMethod.toLowerCase()] },
            Effect.fn(function* (prompt) {
              // 1. Designer phase - creates test plan and returns it as a message
              const designer = yield* agent("designer", {
                toolkit: Toolkit.Planning,
                todoScope: "parent",
                description: `You are a test plan designer for the Cloudflare ${op.operationName} operation.

## IMPORTANT: Do NOT search or glob for files
All file paths are provided below. Read them directly - do not use glob or grep to find files.

## Relevant Files (read these directly)
- \`src/services/${service.name}.ts\` - Generated service with operation signatures and error types
- \`test/services/${service.name}/${op.operationName}.test.ts\` - Test file (may not exist yet)
- \`test/test.ts\` - Test utilities (getAccountId, test helper)
- \`patch/${service.name}/${op.operationName}.json\` - Error patches (may not exist yet)

## Operation Details
- **Method:** ${op.httpMethod} ${op.urlTemplate}
- **Path params:**
${pathParams || "  (none)"}
- **Query params:**
${queryParams || "  (none)"}

## Your Task
Design a comprehensive test plan. First read \`src/services/${service.name}.ts\` to understand the operation signature and any existing error types.

### 1. Happy Path Tests
Design tests that verify the operation works correctly:
- What inputs should we test?
- What response properties should we assert on?
- Are there optional parameters that change behavior?

### 2. Error Cases
Identify errors this operation might return:
- What happens with invalid input (bad IDs, malformed data)?
- What happens when resources don't exist?
- What happens with permission issues?
- What happens with conflicts (e.g., deleting a resource that another depends on)?
- Name each error case with a descriptive tag (e.g., \`NoSuchBucket\`, \`InvalidBucketName\`, \`BucketNotEmpty\`)

### 3. Helper Design
Design \`with${resources[0] || "Resource"}\` helper functions:
- **Pattern:** cleanup first → create resource → run test → cleanup in finally
- Use \`Effect.ensuring()\` for guaranteed cleanup
- Cleanup should never throw: \`Effect.catchAll(() => Effect.void)\`
- Use deterministic names: \`distilled-cf-${service.name}-${op.operationName.toLowerCase()}\`

### 4. Create Todo List
Use the \`todowrite\` tool to create specific, actionable todos:
- One todo per test case or helper function
- Be specific about what each todo should accomplish
- Order todos logically (helpers first, then happy path, then errors)

## Output Format
Return your test plan as a structured response with these sections:

### Overview
Brief description of what will be tested.

### Happy Path Tests
List each test case with:
- Test name
- Description of what it tests
- Expected assertions

### Error Cases
List each error case with:
- Error tag name (e.g., \`NoSuchBucket\`)
- Condition that triggers it
- How to test it

### Helpers
For each helper function:
- Function name and signature
- What it does
- Cleanup strategy

### Notes
Any additional considerations or edge cases.

Do NOT write any files. Return the plan directly in your response.`,
              });

              // Coder executes the plan and returns a summary
              const coder = yield* agent("coder", {
                toolkit: Toolkit.Coding,
                todoScope: "parent",
                description: `You are a test implementer for the Cloudflare ${op.operationName} operation.

## Input
You will receive a test plan as your input message. This plan contains:
- Happy path tests to implement
- Error cases to test
- Helper functions to create
- A todo list to work through

## IMPORTANT: Do NOT search or glob for files
All file paths are provided below. Read them directly - do not use glob or grep to find files.

## Relevant Files (read these directly)
- \`src/services/${service.name}.ts\` - Generated service with operation signatures and error types
- \`test/services/${service.name}/${op.operationName}.test.ts\` - Test file to create/edit
- \`test/test.ts\` - Test utilities (getAccountId, test helper)
- \`patch/${service.name}/${op.operationName}.json\` - Error patches to create/edit

## Your Task
Execute the test plan by implementing each pending todo item.

## Step-by-Step Process

### 1. Read Your Todos
Use \`todoread\` to see your current task list.

### 2. Implement Each Todo
For each pending todo:

#### Test Structure
\`\`\`typescript
import { describe, expect } from "@effect/vitest";
import * as Effect from "effect/Effect";
import { ${op.operationName} } from "~/services/${service.name}.ts";
import { getAccountId, test } from "../../test.ts";

describe("${service.name}/${op.operationName}", () => {
describe("success", () => {
  test("descriptive test name", () =>
    Effect.gen(function* () {
      const result = yield* ${op.operationName}({
        accountId: getAccountId(),
        // ... other params
      });
      expect(result.someProperty).toBeDefined();
    }));
});

describe("ErrorTagName", () => {
  test("condition that triggers error", () =>
    ${op.operationName}({
      accountId: getAccountId(),
      // ... params that trigger error
    }).pipe(
      Effect.flip,
      Effect.map((e) => expect(e._tag).toBe("ErrorTagName")),
    ));
});
});
\`\`\`

#### Helper Pattern
\`\`\`typescript
const RESOURCE_NAME = "distilled-cf-${service.name}-${op.operationName.toLowerCase()}";

const cleanup = (name: string) =>
deleteResource({
  accountId: getAccountId(),
  name,
}).pipe(Effect.catchAll(() => Effect.void));

const withResource = <A, E, R>(
name: string,
effect: Effect.Effect<A, E, R>,
) =>
Effect.gen(function* () {
  yield* cleanup(name);  // Cleanup first (idempotent)
  yield* createResource({ accountId: getAccountId(), name });
  return yield* effect;
}).pipe(Effect.ensuring(cleanup(name)));
\`\`\`

### 3. Run Tests
\`\`\`bash
bun vitest run test/services/${service.name}/${op.operationName}.test.ts
\`\`\`

### 4. Handle UnknownCloudflareError
When you see \`UnknownCloudflareError\` in test output:

1. **Extract the error code** from the failure message
2. **Create/update patch file** at \`patch/${service.name}/${op.operationName}.json\`:
 \`\`\`json
 {
   "errors": {
     "ErrorTagName": [{ "code": XXXX }]
   }
 }
 \`\`\`
3. **Regenerate the service:**
 \`\`\`bash
 bun generate --service ${service.name}
 \`\`\`
4. **Import the new error class** and update your test

### 5. Mark Todos Complete
After implementing each todo, update its status to \`completed\` using \`todowrite\`.

## Important Conventions
- **Resource names:** Always use \`distilled-cf-${service.name}-{testname}\` (deterministic, no random values)
- **Never use:** \`Date.now()\`, \`Math.random()\`, UUIDs
- **Use \`yield*\`** to call operations (not \`await\`)
- **Use \`Effect.gen(function* () { ... })\`** for test bodies

## Output Format
When you are done (or blocked), return a summary of your work:

### Files Changed
List each file you created or modified.

### Tests Added
List each test case you implemented with a brief description.

### Patches Created
List any error patches you added to \`patch/${service.name}/${op.operationName}.json\`.

### Blockers
If you encountered any blockers, describe them here.

### Status
Either "complete" (all todos done) or "in_progress" (more work needed).`,
              });

              // Reviewer evaluates the coder's work against the plan
              const reviewer = yield* agent("reviewer", {
                toolkit: Toolkit.ReadOnly,
                description: `You are a code reviewer for the Cloudflare ${op.operationName} test implementation.

## Input
You will receive a message containing:
1. **The Test Plan** - What the coder was supposed to implement
2. **The Coder's Summary** - What the coder claims to have done

Your job is to verify the coder's work matches the plan by reading the actual files.

## IMPORTANT: Do NOT search or glob for files
All file paths are provided below. Read them directly - do not use glob or grep to find files.

## Files to Review (read these directly)
- \`test/services/${service.name}/${op.operationName}.test.ts\` - Main test file
- \`patch/${service.name}/${op.operationName}.json\` - Error patches (if any)
- \`src/services/${service.name}.ts\` - Reference for operation signature

## Review Checklist

### 1. Todo Completion
Use \`todoread\` to check the todo list:
- Are all todos marked as \`completed\`?
- If any are \`pending\` or \`in_progress\`, the implementation is NOT complete

### 2. Test Structure
Verify the test file follows conventions:
- Uses \`test()\` from \`"../../test.ts"\` (not vitest's \`it\`)
- Test bodies use \`Effect.gen(function* () { ... })\`
- Uses \`yield*\` to call operations

### 3. Happy Path Coverage
Check that success cases are tested:
- Basic operation with minimal required params
- Variations with optional params (if applicable)
- Assertions on response properties

### 4. Error Coverage
Check that error cases are handled:
- Each \`UnknownCloudflareError\` should be patched and tested
- Error tests use \`Effect.flip\` pattern
- Error assertions check \`e._tag\`

### 5. Helper Quality
If helpers exist, verify:
- Cleanup-first pattern (idempotent)
- Uses \`Effect.ensuring()\` for guaranteed cleanup
- Cleanup catches all errors: \`Effect.catchAll(() => Effect.void)\`
- Uses deterministic names: \`distilled-cf-${service.name}-*\`

### 6. Resource Naming
Verify no random values:
- No \`Date.now()\`
- No \`Math.random()\`
- No UUIDs
- All names follow \`distilled-cf-${service.name}-{testname}\` pattern

## Your Response
Return a structured response indicating:
- \`complete: true\` if all checks pass
- \`complete: false\` with \`feedback\` explaining what's missing
- Include \`missingTests\` array if test cases are missing
- Include \`issues\` array if there are problems to fix`,
              });

              // Get the initial plan from designer
              let plan = yield* designer.send(prompt);

              // Write the plan to a file for reference
              const fs = yield* FileSystem.FileSystem;
              const planPath = `plan/${service.name}/${op.operationName}.md`;
              yield* fs.makeDirectory(`plan/${service.name}`, {
                recursive: true,
              });
              yield* fs.writeFileString(planPath, plan);

              // 2. Coder/Reviewer loop
              let isComplete = false;
              let iteration = 0;
              const maxIterations = 5;

              while (!isComplete && iteration < maxIterations) {
                iteration++;

                // Coder receives the plan and returns a summary
                const coderSummary = yield* coder.send(plan);

                // Reviewer receives both the plan and coder's summary
                const reviewerInput = `## Test Plan\n\n${plan}\n\n---\n\n## Coder's Summary\n\n${coderSummary}`;
                const review = yield* reviewer.query(
                  reviewerInput,
                  ReviewResult,
                );

                isComplete = review.complete;
                if (!isComplete) {
                  // Designer receives coder's summary + reviewer feedback to create updated plan
                  const designerInput = `## Previous Plan\n\n${plan}\n\n---\n\n## Coder's Work Summary\n\n${coderSummary}\n\n---\n\n## Reviewer Feedback\n\n${review.feedback}\n\nPlease provide an updated plan addressing the reviewer's feedback. The coder has already completed the work described in their summary - focus on what still needs to be done.`;
                  plan = yield* designer.send(designerInput);

                  // Update the plan file
                  yield* fs.writeFileString(planPath, plan);
                }
              }

              return `Workflow complete after ${iteration} iteration(s)`;
            }),
          );
        }),
      ),
    );
  }),
});
