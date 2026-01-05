# Scripts

Code generation and tooling for effect-aws.

## Key Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `generate-clients.ts` | Smithy → TypeScript codegen | `bun generate [--sdk name]` |
| `service-patches.ts` | Manual error/structure patches | (used by generate) |
| `find-errors.ts` | AI agent for error discovery | `bun find:errors "prompt"` |
| `aws-clean.ts` | AWS resource cleanup | `bun aws:clean [--dry-run]` |
| `setup.ts` | Clone external repos | `bun setup` |

## Code Generation

`generate-clients.ts` (2000+ lines) transforms Smithy JSON → TypeScript:

1. Load model from `aws-models/models/{service}/service/{version}/*.json`
2. Detect cyclic dependencies (Tarjan's algorithm)
3. Convert shapes → Effect schemas with trait annotations
4. Apply patches from `spec/{service}.json`
5. Topological sort, write to `src/services/{service}.ts`

**All Smithy traits → Effect annotations (1:1):**
- `@httpHeader` → `T.HttpHeader("X-Header")`
- `@xmlName` → `T.XmlName("Element")`
- `@jsonName` → `T.JsonName("field")`
- etc.

## Error Discovery

`find-errors.ts` uses AI to probe AWS APIs for undocumented errors:
```bash
bun find:errors "create S3 buckets then delete them"
```
Discovered errors saved to `spec/{service}.json`.

## Resource Cleanup

`aws-clean.ts` handles: S3, Lambda, ECS, SQS, SNS, DynamoDB, API Gateway, IAM, VPCs.
```bash
bun aws:clean --dry-run           # Preview
bun aws:clean --prefix test-      # Delete by prefix
LOCAL=1 bun aws:clean             # LocalStack
```

## Conventions

- Use Bun APIs (`Bun.spawn`, `Bun.file`, `$` shell)
- ESM syntax always
- Effect for async operations
- No prettier - use `bun oxfmt`
