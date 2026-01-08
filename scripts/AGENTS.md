# scripts/

Build scripts and utilities. Code generation, cleanup, testing infrastructure.

→ Parent: [AGENTS.md](../AGENTS.md)

## FILES

| Script                  | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `generate-clients.ts`   | **Main codegen** — Smithy models → TypeScript clients |
| `compile-rules.ts`      | Compiles endpoint rule sets to JavaScript functions   |
| `model-schema.ts`       | Effect schemas for parsing Smithy JSON models         |
| `service-patches.ts`    | Service-specific codegen patches                      |
| `find-errors.ts`        | Runs AI agent to discover undocumented AWS errors     |
| `aws-clean.ts`          | Cleanup AWS resources (S3, Lambda, DynamoDB, etc.)    |
| `localstack.ts`         | LocalStack container management                       |
| `localstack-clean.ts`   | Cleanup LocalStack resources                          |
| `bundle-size-report.ts` | Analyze bundle sizes                                  |
| `setup.ts`              | Project setup                                         |
| `symlink.ts`            | Symlink utilities                                     |
| `test.ts`               | Test runner wrapper                                   |

## CODE GENERATOR

`generate-clients.ts` is the heart of the project. It:

1. Loads Smithy model JSON from `aws-models/models/{service}/`
2. Parses using schemas from `model-schema.ts`
3. Extracts traits and transforms to Effect Schema annotations
4. Handles cycles via `S.suspend` and explicit type aliases
5. Outputs to `src/services/{service}.ts`

**Key concepts:**

- `convertShapeToSchema` — Transforms Smithy shapes to Effect schemas
- `collectSerializationTraits` — Extracts HTTP bindings, XML names, etc.
- `topologicalSortWithCycles` — Orders schemas so dependencies come first
- `addError` — Generates `S.TaggedError` classes with categories

## COMMANDS

```bash
bun generate --sdk s3         # Generate single service
bun generate                  # Generate all services
bun aws:clean                 # Clean AWS resources
bun aws:clean --dry-run       # Preview cleanup
bun aws:clean --prefix itty   # Clean only itty-* resources
bun find:errors "explore S3"  # Discover undocumented errors
LOCAL=1 bun aws:clean         # Clean LocalStack
```

## MODEL EXPLORATION

Smithy models are too large for context. Explore with:

```bash
bun -e "
const model = await Bun.file('aws-models/models/s3/service/2006-03-01/s3-2006-03-01.json').json();
console.log(Object.keys(model.shapes).slice(0, 20));
"
```

## RELATED

- `src/services/*.ts` — Generated output (DO NOT EDIT)
- `src/patch/discover-errors.ts` — AI agent for error discovery
- `spec/*.json` — Error patches discovered by find-errors
