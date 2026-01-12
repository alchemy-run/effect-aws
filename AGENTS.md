# distilled-aws

Effect-native AWS SDK. Generates typed clients from Smithy models with full protocol support.

## ARCHITECTURE

```
Smithy Model → scripts/generate-clients.ts → src/services/*.ts → Runtime
     ↓                    ↓                        ↓                ↓
  Traits            Code Generator            Effect Schemas    Protocols
  (@httpLabel)      (topological sort,        (T.HttpHeader,    (serialize,
                    cycle handling)            T.XmlName)        parse)
```

**Trait System:** Smithy traits become Schema annotations at codegen. At runtime, protocols read annotations to serialize requests/parse responses.

**Effect-Native:** All operations return `Effect<A, E, R>` with typed errors. Error categories (throttling, transient, server) drive automatic retries.

## PROTOCOLS

| Protocol | Content-Type | Services | File |
|----------|--------------|----------|------|
| `restJson1` | `application/json` | Lambda, API Gateway | `src/protocols/rest-json.ts` |
| `restXml` | `application/xml` | S3, CloudFront | `src/protocols/rest-xml.ts` |
| `awsJson1_0/1_1` | `application/x-amz-json-1.x` | DynamoDB, KMS | `src/protocols/aws-json.ts` |
| `awsQuery` | `application/x-www-form-urlencoded` | IAM, SNS, STS | `src/protocols/aws-query.ts` |
| `ec2Query` | `application/x-www-form-urlencoded` | EC2 | `src/protocols/ec2-query.ts` |

**Protocol contract:** `(Operation) => { buildRequest, parseResponse }`

## REQUEST FLOW

```
Input → request-builder.ts → Protocol serializes → Middleware (checksum, streaming)
     → api.ts → Endpoint resolution → SigV4 signing → HttpClient
     → response-parser.ts → Protocol deserializes → Schema decodes → Effect<Output, Error>
```

**Key files:**
- `src/client/api.ts` — `make(op)`, `makePaginated(op)` create Effect functions
- `src/client/request-builder.ts` — Protocol + middleware → Request
- `src/client/response-parser.ts` — Deserialize + decode + error matching
- `src/rules-engine/` — Endpoint resolution from compiled Smithy rule sets
- `src/middleware/checksum.ts` — CRC32/MD5 checksums, aws-chunked encoding
- `src/eventstream/` — Bi-directional streaming (Transcribe, Bedrock)

## COMMANDS

```bash
bun generate --sdk s3              # Generate single service
bun generate                       # Generate all services
bun vitest run ./test/services/    # Run live AWS tests
bun vitest run ./test/protocols/   # Run protocol unit tests
bun tsgo -b                        # Type check

# Error discovery
bun find ec2                       # Find missing errors
bun find ec2 --type delete         # Only delete operations
bun find ec2 --resource Vpc        # Only Vpc-related
bun find ec2 --limit 50            # Limit count
bun find ec2 --dry-run             # Preview
```

## KEY FILES

| What | Where |
|------|-------|
| API client | `src/client/api.ts` |
| Smithy traits | `src/traits.ts` |
| Code generator | `scripts/generate-clients.ts` |
| Model schemas | `scripts/model-schema.ts` |
| Generated clients | `src/services/*.ts` (DO NOT EDIT) |
| Error patches | `spec/*.json` |

## CODE GENERATOR

`scripts/generate-clients.ts`:
1. Loads Smithy model JSON from `aws-models/models/{service}/`
2. Parses using `scripts/model-schema.ts`
3. Transforms traits to Effect Schema annotations
4. Handles cycles via `S.suspend` and explicit type aliases
5. Outputs to `src/services/{service}.ts`

**Key functions:** `convertShapeToSchema`, `collectSerializationTraits`, `topologicalSortWithCycles`, `addError`

## ERROR PATCHING

AWS Smithy models omit many errors. When you encounter untyped errors:

1. Add to `spec/{service}.json`:
   ```json
   {
     "operations": {
       "deleteVpc": { "errors": ["InvalidVpcID.NotFound", "DependencyViolation"] }
     }
   }
   ```
2. Regenerate: `bun generate --sdk {service}`
3. Use typed handling: `Effect.catchTag("InvalidVpcID.NotFound", ...)`

**Spec schema** (`src/patch/spec-schema.ts`):
- `operations.{name}.errors` — Add errors to operation unions
- `operations.{name}.aliases` — Map error names
- `structures.{name}.members` — Override member optionality
- `enums.{name}.add/replace` — Fix enum values
- `errors.{name}` — Add members to error schemas

## ERROR DISCOVERY

The `find` command discovers undocumented errors by calling APIs with fake inputs:

```bash
bun find ec2                 # Discover errors
bun generate --sdk ec2       # Regenerate with new errors
bun find ec2                 # Run again (should find fewer)
```

**Key files:**
- `scripts/find-errors/topology.ts` — Builds dependency graph from Smithy
- `scripts/find-errors/id-generator.ts` — Generates fake IDs/names
- `scripts/find-errors/runner.ts` — Calls APIs, records errors
- `scripts/find-errors/cleaner.ts` — Resource cleanup

## TESTING

**File naming:** `test/services/{service}.test.ts`
**Resource naming:** `itty-{service}-{test}` — NO random suffixes (enables cleanup)

**Patterns:**
```typescript
// Resource lifecycle wrapper
const withBucket = <R, E, A>(name: string, fn: (bucket: string) => Effect<A, E, R>) =>
  cleanup(name).pipe(
    Effect.andThen(createBucket({ Bucket: name })),
    Effect.andThen(fn(name)),
    Effect.ensuring(cleanup(name))
  );

// Cleanup removes dependencies first, ignores errors
const cleanupUser = (name: string) =>
  deleteAccessKeys(name).pipe(
    Effect.andThen(detachPolicies(name)),
    Effect.andThen(deleteUser({ UserName: name })),
    Effect.ignore
  );
```

**Gotchas:**
- SQS: 60s cooldown after delete
- IAM: Role changes take ~10s to propagate
- S3: Cannot disable versioning; must delete all versions
- Lambda: Wait for `Active` state before invoking

```bash
bun vitest run ./test/services/s3.test.ts        # Single test
DEBUG=1 bun vitest run ./test/services/s3.test.ts # With logs
LOCAL=1 bun vitest run ./test/services/s3.test.ts # LocalStack
```

## CONVENTIONS

**Code:**
- `const` arrow functions, `Effect.gen` + `pipe`, avoid explicit `return`
- `Effect.retry` + `Schedule` instead of loops/sleeps
- Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`

**Testing:**
- Use `expect` from `@effect/vitest` — NOT `Effect.fail`
- Deterministic names: `itty-{service}-{test}`
- Live AWS by default — `LOCAL=1` only when explicitly requested

## EXPLORING SMITHY

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
