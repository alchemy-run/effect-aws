# src/client

High-level API layer that orchestrates AWS operations. Creates Effect-returning functions from Operation definitions, handling request building, signing, HTTP execution, response parsing, and retries.

→ Parent: [AGENTS.md](../../AGENTS.md)

## FILES

| File                 | Purpose                                                             |
| -------------------- | ------------------------------------------------------------------- |
| `api.ts`             | `make(op)`, `makePaginated(op)` — create Effect-based API functions |
| `operation.ts`       | `Operation` interface — input/output/errors schemas + pagination    |
| `protocol.ts`        | `Protocol`, `ProtocolHandler` interfaces — serialization contracts  |
| `request-builder.ts` | `makeRequestBuilder(op)` — protocol + middleware → Request          |
| `request.ts`         | `Request` type — protocol-agnostic HTTP request                     |
| `response-parser.ts` | `makeResponseParser(op)` — deserialize + decode + error handling    |
| `response.ts`        | `Response` type — protocol-agnostic HTTP response                   |
| `stream-parser.ts`   | `makeStreamParser(ast)` — event stream → typed Effect Stream        |

## HOW IT WORKS

```
Input Payload
    │
    ▼
┌─────────────────────┐
│  request-builder    │ ← Protocol serializes, middleware applies
└─────────────────────┘
    │ Request
    ▼
┌─────────────────────┐
│  api.ts (make)      │ ← Endpoint resolution, SigV4 signing, HttpClient
└─────────────────────┘
    │ Response
    ▼
┌─────────────────────┐
│  response-parser    │ ← Protocol deserializes, schema decodes, errors match
└─────────────────────┘
    │
    ▼
Effect<Output, Error>
```

## API FUNCTIONS

### `make(initOperation)`

Creates a single-call Effect function:

1. Builds request via `request-builder` (protocol + middleware)
2. Resolves endpoint via rules-engine or custom endpoint
3. Signs with SigV4 (`aws4fetch`)
4. Executes via `HttpClient`
5. Parses response via `response-parser`
6. Applies retry policy (throttling, transient errors)

### `makePaginated(initOperation)`

Extends `make` with pagination:

- `.pages(input)` — `Stream` of full response pages
- `.items(input)` — `Stream` of individual items from paginated field

Uses `pagination.inputToken` / `outputToken` from Operation to drive continuation.

## KEY PATTERNS

**Lazy Initialization** — Protocol handlers and middleware are created once on first call, not at import time. This keeps cold starts fast.

**Request/Response Types** — Protocol-agnostic types (`Request`, `Response`) decouple serialization from HTTP execution. Protocols produce `Request`, consume `Response`.

**Error Matching** — Response parser builds error schema map at creation time. Errors match by wire code, awsQueryError code, or short form (strips Exception/Error suffix).

**Streaming** — Event stream responses pass through `stream-parser` which converts `ReadableStream<Uint8Array>` to typed `Stream<Event>`.

## DEPENDENCIES

| External           | Purpose                             |
| ------------------ | ----------------------------------- |
| `@effect/platform` | HttpClient, HttpBody                |
| `aws4fetch`        | SigV4 request signing               |
| `effect`           | Effect, Stream, Schema, ParseResult |

| Internal                   | Purpose                              |
| -------------------------- | ------------------------------------ |
| `../credentials.ts`        | AWS Credentials service              |
| `../region.ts`             | AWS Region service                   |
| `../endpoint.ts`           | Custom endpoint override             |
| `../retry.ts`              | Retry policy (throttling, transient) |
| `../errors.ts`             | Common errors, UnknownAwsError       |
| `../traits.ts`             | Smithy trait accessors               |
| `../rules-engine/*`        | Endpoint resolution                  |
| `../middleware/*`          | Streaming body handling              |
| `../eventstream/parser.ts` | Event stream wire format             |
| `../util/ast.ts`           | Schema AST utilities                 |
