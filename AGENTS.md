# distilled-aws

Effect-native AWS SDK. Generates typed clients from Smithy models with full protocol support.

## CORE CONCEPTS

```mermaid
flowchart LR
    subgraph Smithy["aws-models/"]
        Model["PutObjectRequest<br/>Bucket: string<br/>@httpLabel"]
    end
    subgraph Codegen["scripts/"]
        Gen[generate-clients.ts]
    end
    subgraph Generated["services/*.ts"]
        Schema["S.Struct({<br/>Bucket: S.String<br/>.pipe(T.HttpLabel)<br/>})"]
    end
    subgraph Runtime["protocols/*.ts"]
        Proto[reads annotations<br/>builds requests]
    end
    Model --> Gen --> Schema --> Proto
```

**Trait System:** Smithy traits become Schema annotations at codegen. At runtime, protocols read these annotations to serialize requests and parse responses.

**Effect-Native:** All operations return `Effect<A, E, R>` with typed errors. Error categories (throttling, transient, server) drive automatic retry policies.

**Protocol Support:** Five AWS protocols, each with its own serialization:
- `restJson1` — JSON body, HTTP binding traits (Lambda, API Gateway)
- `restXml` — XML body, HTTP bindings (S3, CloudFront)
- `awsJson1_0/1_1` — JSON body, `X-Amz-Target` header (DynamoDB, KMS)
- `awsQuery` — Form-urlencoded body (IAM, SNS, STS)
- `ec2Query` — EC2-specific query protocol

## INTENT LAYER

```
AGENTS.md (you are here)
├── src/
│   ├── client/AGENTS.md ────── API orchestration, signing, retries
│   ├── protocols/AGENTS.md ─── Request/response serialization
│   ├── rules-engine/AGENTS.md  Endpoint resolution
│   ├── eventstream/AGENTS.md ─ Bi-directional streaming
│   └── middleware/AGENTS.md ── Checksum, streaming body
├── scripts/AGENTS.md ───────── Code generator, cleanup utilities
└── test/
    └── services/AGENTS.md ──── Live AWS integration tests
```

**Read the node for where you're working.** Follow downlinks for detail.

## COMMANDS

```bash
bun generate --sdk s3                    # Generate service client
bun vitest run ./test/services/s3.test.ts # Run live AWS test
bun vitest run ./test/protocols/         # Run protocol unit tests
bun find:errors "explore S3 errors"      # AI-powered error discovery
bun tsgo -b                              # Check the typescript types
bun find ec2                             # Find missing errors for EC2
bun find ec2 --type delete               # Only test delete operations
bun find ec2 --resource Vpc --limit 10   # Filter by resource, limit count
```

## ERROR DISCOVERY

The `find` command discovers undocumented AWS errors by calling APIs with fake inputs:

```bash
bun find ec2                    # Find errors for EC2
bun find ec2 --type delete      # Only test delete operations
bun find ec2 --resource Vpc     # Only test Vpc-related operations
bun find ec2 --filter "describe*" # Only test operations matching pattern
bun find ec2 --limit 50         # Limit to 50 operations
bun find ec2 --dry-run          # Show what would be tested
```

**How it works:**
1. **Builds a dependency graph** from the Smithy model (`scripts/find-errors/topology.ts`)
2. **Generates fake inputs** for each operation (fake IDs, names, etc.)
3. **Calls AWS APIs** to trigger errors
4. **Records new errors** to `spec/{service}.json`

**Iterative workflow:**
```bash
bun generate --sdk ec2       # Regenerate SDK first
bun find ec2                 # Discover new errors
bun generate --sdk ec2       # Regenerate with new errors
bun find ec2                 # Run again (should find fewer/no new errors)
```

**Key files:**
- `scripts/find-errors/` — Error discovery tool (see `scripts/find-errors/AGENTS.md`)
- `scripts/find-errors/cleaner.ts` — Resource cleanup utilities

## KEY FILES

| What | Where |
|------|-------|
| API client (`API.make`, `API.makePaginated`) | `src/client/api.ts` |
| Smithy traits (`T.HttpHeader`, `T.XmlName`) | `src/traits.ts` |
| Request/response flow | `src/client/request-builder.ts`, `src/client/response-parser.ts` |
| Code generator | `scripts/generate-clients.ts` |
| Generated clients | `src/services/*.ts` (DO NOT EDIT) |
| Error patches | `spec/*.json` |

## CONVENTIONS

**Code:**
- `const` arrow functions, `Effect.gen` + `pipe`, avoid explicit `return`
- `Effect.retry` + `Schedule` instead of loops/sleeps
- Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`

**Testing:**
- Use `expect` from `@effect/vitest` — NOT `Effect.fail`
- Deterministic names: `itty-{service}-{test}` — NO random suffixes
- Live AWS by default — `LOCAL=1` only when explicitly requested

**Smithy:**
- 1:1 with Smithy traits — all traits flow into generated code
- Protocol tests use real schemas from `src/services/*.ts`

## ERROR PATCHING

AWS Smithy models often omit errors that operations can actually throw. When you encounter an unknown/untyped error at runtime:

1. **Identify the error** — Note the error tag (e.g., `InvalidVpnGatewayID.NotFound`)
2. **Update the spec file** — Add the error to `spec/{service}.json`:
   ```json
   {
     "operations": {
       "detachVpnGateway": {
         "errors": ["RequestLimitExceeded","IncorrectState", "InvalidVpnGatewayID.NotFound", "DependencyViolation"]
       }
     }
   }
   ```
3. **Regenerate the client** — Run `bun generate --sdk {service}`
4. **Use typed error handling** — Now you can use `Effect.catchTag("ErrorName", ...)`

**Spec schema:** See `src/patch/spec-schema.ts` for the full schema. Supports:
- `operations.{name}.errors` — Add errors to operation error unions
- `operations.{name}.aliases` — Map error names (e.g., "Error" → "ErrorException")
- `structures.{name}.members` — Override member optionality
- `enums.{name}.add/replace` — Fix enum values AWS returns but doesn't document
- `errors.{name}` — Add members to error schemas (e.g., httpHeader extraction)

**Error naming:** Use the exact AWS error code with dots (e.g., `InvalidVpcID.NotFound`). The generator converts dots appropriately for TypeScript identifiers.

## EXPLORING SMITHY MODELS

Models are too large for context. Explore with:

```bash
bun -e "
const model = await Bun.file('aws-models/models/s3/service/2006-03-01/s3-2006-03-01.json').json();
console.log(Object.entries(model.shapes).filter(([_,s]) => s.type === 'operation').map(([id]) => id.split('#')[1]).join('\n'));
"
```

## EXTERNAL REFERENCES

- `smithy/docs/source-2.0/` — Smithy specification
- `aws-models/models/` — AWS Smithy model definitions
- `aws-sdk-js-v3/` — Reference implementation
- `smithy-typescript/` — TypeScript code generator for Smithy (trait handling reference)
