# effect-aws

Effect-TS SDK for AWS services. Generated from Smithy models with 1:1 trait mapping.

## Structure

```
src/
├── api.ts              # API.make/makePaginated - operation factory
├── traits.ts           # Smithy trait → Effect annotation system
├── protocols/          # Protocol implementations (5 protocols)
├── services/           # Generated service clients (416 services)
├── aws/                # Credentials, Region, Endpoint, Errors
├── rules-engine/       # Smithy endpoint resolution
├── util/               # Shared serialization utilities
└── middleware/         # Checksum, streaming body handling

scripts/
├── generate-clients.ts # Main codegen: Smithy → TypeScript
├── service-patches.ts  # Manual error/structure corrections
└── find-errors.ts      # AI agent for error discovery

test/
├── protocols/          # Protocol serialization tests
└── services/           # Live AWS integration tests

spec/                   # Manual error patches (JSON)
```

## Commands

```bash
bun generate --sdk s3       # Generate single service
bun generate                # Generate all 416 services
bun build                   # generate + format + compile

bun vitest run ./test/protocols/              # Protocol tests
bun vitest run ./test/services/s3.test.ts     # Service test (live AWS)
DEBUG=1 bun vitest run ./test/services/...    # With debug logs

bun find:errors "explore S3 errors"           # Discover undocumented errors
bun aws:clean --dry-run                       # Preview resource cleanup
```

## Code Map

| File | Purpose |
|------|---------|
| `src/api.ts` | Operation factory - builds request, signs, fetches, parses |
| `src/traits.ts` | 40+ Smithy trait annotations (HttpHeader, XmlName, etc.) |
| `src/request-builder.ts` | Input → HTTP request via protocol |
| `src/response-parser.ts` | HTTP response → typed output |
| `src/protocol.ts` | Protocol handler interface |
| `src/retry-policy.ts` | Retry configuration (throttling, transient) |
| `src/error-category.ts` | Error classification (CLIENT, SERVER, THROTTLING) |

## Conventions

**Style:**
- Const arrow functions, not function declarations
- Inline with `Effect.gen`/`pipe`, avoid explicit returns
- `Effect.retry` + `Schedule`, not while loops

**Testing:**
- Use `expect` from `@effect/vitest` for assertions
- Deterministic resource names (no random suffixes)
- Default to live AWS tests (not LOCAL=1)
- Import test helper: `import { test } from "../test.ts"`

**Generated code:**
- 1:1 Smithy → Effect Schema mapping
- All traits become `.pipe(T.TraitName(...))` annotations
- Protocol tests import from `./src/services/*.ts`, don't redefine schemas

## Anti-Patterns

- `Effect.fail(new Error(...))` for assertions → use `expect`
- Random test resource names → deterministic names
- `LOCAL=1` by default → live tests unless explicitly asked
- `any`, `as Type`, non-null `!` → strict type safety
- Function declarations → const arrow functions

## Smithy Model Exploration

Models too large for context. Use inline JS:
```bash
bun -e "
import { readFile } from 'fs/promises';
const model = JSON.parse(await readFile('aws-models/models/s3/service/2006-03-01/s3-2006-03-01.json', 'utf8'));
console.log(Object.keys(model.shapes).slice(0, 20));
"
```

## External References

- `./smithy/docs/source-2.0/` - Smithy spec (cloned via `bun setup`)
- `./aws-models/models/` - AWS Smithy models
- `./aws-sdk-js-v3/` - Reference implementation
