/**
 * Distilled-code configuration for generating Cloudflare API tests.
 *
 * This config parses the Cloudflare TypeScript SDK and builds a network of
 * agents for each service and operation. Each operation gets its own
 * Designer, Developer, and Reviewer agents working on specific files.
 */

import { Agent, File, Toolkit } from "distilled-code";
import { loadModel } from "./scripts/parse.ts";

const SDK_PATH = "../../cloudflare-typescript/src/resources";

const services = await loadModel({ basePath: SDK_PATH });

export default class DistilledCloudflare extends Agent("distilled-cloudflare")`
Cloudflare API test suite coordinator.

## Services (${services.length} services, ${services.reduce((n, s) => n + s.operations.length, 0)} operations)

${services.map(
  (s) => `
### ${s.name} (${s.operations.length})
${s.operations.map((o) => `- ${o.operationName}`)}`,
)}

## Commands
- Parse: \`bun scripts/parse.ts\`
- Generate: \`bun generate --service {service}\`
- Test: \`bun vitest run test/services/{service}/\`

## Workflow
- Given a service: delegate to service agent
- Given an operation (e.g., r2/createBucket): delegate to operation agent
- Finding work: prioritize operations without tests, core CRUD first

## Service Agents
${services.map(
  (service) =>
    class Service extends Agent(`${service.name}`)`
Coordinate development of ${service.name}'s ${service.operations.length} operations.

## Operations
${service.operations.map((op) => `- ${op.operationName} (${op.httpMethod})`)}

## Sub-Agents

Delegate tasks to the corresponding sub-agents (each operation has its own dedicated team).
${service.operations.map((op) => {
  // Files for this operation
  class ServiceClient extends File.TypeScript(
    `src/services/${service.name}.ts`,
  )`
Generated Effect-based service client for the ${service.name} Cloudflare service.
Contains operation functions, schemas, and error classes.
Regenerate with: \`bun generate --service ${service.name}\`
` {}

  class TestPlan extends File.Markdown(
    `plan/${service.name}/${op.operationName}.md`,
  )`
Test plan for ${service.name}/${op.operationName}.

## Operation
- **Method:** ${op.httpMethod} ${op.urlTemplate}
- **Resource:** ${op.resourceName}
- **Path params:**
${op.pathParams}
- **Query params:**
${op.queryParams}

## Coverage
1. Happy path with minimal params
2. Optional parameter variations
3. Error scenarios
4. Helper functions with cleanup-first pattern
` {}

  class TestFile extends File.TypeScript(
    `test/services/${service.name}/${op.operationName}.test.ts`,
  )`
Test implementation for ${service.name}/${op.operationName}.
Uses \`test()\` from \`../../test.ts\`, \`Effect.gen\`, \`yield*\`, and \`Effect.flip\` for errors.
` {}

  class ErrorPatch extends File.Json(
    `patch/${service.name}/${op.operationName}.json`,
  )`
Error patch mapping discovered error codes to typed classes.
Format: \`{ "errors": { "ErrorTag": [{ "code": XXXX }] } }\`
After updating: \`bun generate --service ${service.name}\`
` {}

  // Agents for this operation
  class Designer extends Agent(`${service.name}/${op.operationName}/Designer`)`
Design tests for ${op.operationName}. Read ${ServiceClient} for signatures.

## Operation
- ${op.httpMethod} ${op.urlTemplate}
- Path: ${op.pathParams}
- Query: ${op.queryParams}

## Design
1. **Happy Path:** inputs, assertions, optional params
2. **Errors:** NotFound, BadRequest, Forbidden, Conflict with descriptive tags
3. **Helpers:** \`with${op.resources[0] || "Resource"}\` using cleanup-first pattern
 - \`Effect.ensuring()\` for cleanup
 - Names: \`distilled-cf-${service.name}-${op.operationName.toLowerCase()}\`

Write plan to ${TestPlan}.
` {}

  class Developer extends Agent(
    `${service.name}/${op.operationName}/Developer`,
  )`
Implement tests per ${TestPlan} using ${Toolkit.Coding}.

## Files
- ${ServiceClient} - signatures
- ${TestFile} - implement here
- ${ErrorPatch} - patch errors

## Template
\`\`\`typescript
import { describe, expect } from "@effect/vitest";
import * as Effect from "effect/Effect";
import { ${op.operationName} } from "~/services/${service.name}.ts";
import { getAccountId, test } from "../../test.ts";

describe("${service.name}/${op.operationName}", () => {
describe("success", () => {
  test("works", () => Effect.gen(function* () {
    const result = yield* ${op.operationName}({ accountId: getAccountId() });
    expect(result).toBeDefined();
  }));
});
describe("ErrorTag", () => {
  test("returns error", () =>
    ${op.operationName}({ accountId: getAccountId() }).pipe(
      Effect.flip,
      Effect.map((e) => expect(e._tag).toBe("ErrorTag")),
    ));
});
});
\`\`\`

## On UnknownCloudflareError
1. Extract code from failure
2. Update ${ErrorPatch}
3. Run \`bun generate --service ${service.name}\`
4. Import new error, update test

Run: \`bun vitest run test/services/${service.name}/${op.operationName}.test.ts\`
Names: \`distilled-cf-${service.name}-${op.operationName.toLowerCase()}\`
` {}

  class Reviewer extends Agent(`${service.name}/${op.operationName}/Reviewer`)`
Review ${TestFile} against ${TestPlan}.

## Checklist
- [ ] Uses \`test()\` from \`../../test.ts\`
- [ ] Uses \`Effect.gen(function* () { ... })\`
- [ ] Uses \`yield*\` not await
- [ ] Error tests use \`Effect.flip\`
- [ ] Helpers use cleanup-first + \`Effect.ensuring()\`
- [ ] Names: \`distilled-cf-${service.name}-*\`
- [ ] No Date.now/Math.random/UUIDs

Check ${ErrorPatch} for any patches.
Cross-reference with other ${ErrorPatch} files from other services and operations to ensure consistent names.
` {}

  // Operation coordinator
  return class Operation extends Agent(`${service.name}/${op.operationName}`)`
Coordinate ${service.name}/${op.operationName} test implementation.

## Operation
- ${op.httpMethod} ${op.urlTemplate}
- Resource: ${op.resourceName}

## Team
- ${Designer} → ${TestPlan}
- ${Developer} → ${TestFile}, ${ErrorPatch}
- ${Reviewer} verifies

## Artifacts
- ${ServiceClient}
- ${TestPlan}
- ${TestFile}
- ${ErrorPatch}

## Workflow
1. ${Designer} creates ${TestPlan}
2. ${Developer} implements ${TestFile}
3. Run: \`bun vitest run test/services/${service.name}/${op.operationName}.test.ts\`
4. On UnknownCloudflareError: update ${ErrorPatch}, regenerate, retry
5. ${Reviewer} approves or requests changes
6. Loop until approved, then commit
` {};
})}` {},
)}` {}
