/**
 * Distilled-code configuration for generating Cloudflare API tests.
 *
 * This config:
 * 1. Uses parseCode() to extract operations from the Cloudflare TypeScript SDK
 * 2. Generates skeleton test files with TODOs before spawning agents
 * 3. Provides detailed coding conventions in agent descriptions
 */

import { agent, defineConfig, Toolkit } from "distilled-code";
import { Effect } from "effect";
import type { ParsedOperation, ServiceInfo } from "./scripts/model.ts";
import { parseCode } from "./scripts/parse.ts";

const SDK_PATH = "../../cloudflare-typescript/src/resources";

export default defineConfig({
  name: "distilled-cloudflare-tests",
  model: "claude-opus-4-5",
  agents: Effect.gen(function* () {
    const services: ServiceInfo[] = yield* parseCode({ basePath: SDK_PATH });

    return services.flatMap((service) =>
      service.operations.map((op) =>
        agent(`${service.name}/${op.operationName}`, {
          toolkit: Toolkit.Coding,
          tags: [service.name, op.httpMethod.toLowerCase()],
          description: generateAgentDescription(
            service.name,
            op,
            op.operationName,
          ),
        }),
      ),
    );
  }),
});

function generateAgentDescription(
  service: string,
  op: ParsedOperation,
  opName: string,
): string {
  const resources = op.resources;
  const pathParams = op.pathParams
    .map((p) => `  - ${p.name}: ${p.type.kind}`)
    .join("\n");
  const queryParams = op.queryParams
    .map((p) => `  - ${p.name}${p.required ? "" : "?"}: ${p.type.kind}`)
    .join("\n");

  return `Complete the test file for ${opName}.

## Operation
- Method: ${op.httpMethod} ${op.urlTemplate}
- Path params:
${pathParams || "  (none)"}
- Query params:
${queryParams || "  (none)"}

## File Location
test/services/${service}/${opName}.test.ts (skeleton already generated)

## Coding Conventions

### Test Structure
- Use \`test()\` from "../../test.ts" (NOT vitest's \`it\`)
- Wrap test body in \`Effect.gen(function* () { ... })\`
- Use \`yield*\` to call operations (not \`await\`)

### Resource Names
- Always use deterministic names: \`itty-cf-${service}-${opName.toLowerCase()}\`
- Never use Date.now(), Math.random(), or UUIDs

### Happy Path Tests
- Remove \`.skip\` from skeleton tests
- Use with${resources[0] || "Resource"} helper for setup/teardown
- Assert on specific response properties

### Error Discovery Workflow
1. Write a test that should trigger an error
2. Run: \`bun vitest run test/services/${service}/${opName}.test.ts\`
3. When you see \`UnknownCloudflareError\`, note the code
4. Update \`patch/${service}/${opName}.json\`:
   \`\`\`json
   { "errors": { "ErrorName": [{ "code": XXXX }] } }
   \`\`\`
5. Regenerate: \`bun generate --service ${service}\`
6. Import the new error class and update the test

### Error Test Pattern
\`\`\`typescript
describe("NoSuchBucket", () => {
  test("non-existent bucket", () =>
    ${opName}({ accountId: getAccountId(), ... }).pipe(
      Effect.flip,
      Effect.map((e) => expect(e._tag).toBe("NoSuchBucket"))
    )
  );
});
\`\`\`

### Helpers Pattern
- Each helper: cleanup first, create, run test, cleanup in finally
- Use \`Effect.ensuring()\` for cleanup
- Cleanup should never throw: \`Effect.catchAll(() => Effect.void)\`
`;
}
