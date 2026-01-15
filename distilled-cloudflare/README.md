# distilled-cloudflare

A fully typed Cloudflare SDK for [Effect](https://effect.website), generated from the [Cloudflare OpenAPI specification](https://github.com/cloudflare/api-schemas).

## Features

- **Generated from OpenAPI spec** — 1:1 compatibility with Cloudflare APIs
- **Typed errors** — All errors are `TaggedError` classes for pattern matching
- **Effect-native** — All operations return `Effect<A, E, R>` with typed errors
- **Automatic pagination** — Stream pages or items with `.pages()` and `.items()`

## Installation

```bash
npm install distilled-cloudflare effect @effect/platform
```

## Quick Start

```typescript
import { Effect, Layer } from "effect";
import { FetchHttpClient } from "@effect/platform";
import * as R2 from "distilled-cloudflare/r2";
import { Auth } from "distilled-cloudflare";

const program = R2.listBuckets({ account_id: "your-account-id" });

const CloudflareLive = Layer.mergeAll(FetchHttpClient.layer, Auth.fromEnv());

program.pipe(Effect.provide(CloudflareLive), Effect.runPromise);
```

## Services

```typescript
import * as R2 from "distilled-cloudflare/r2";
import * as KV from "distilled-cloudflare/kv";
import * as Workers from "distilled-cloudflare/workers";
import * as Queues from "distilled-cloudflare/queues";
import * as Workflows from "distilled-cloudflare/workflows";
import * as DNS from "distilled-cloudflare/dns";
```

## Authentication

```typescript
import { Auth } from "distilled-cloudflare";

// From environment (CLOUDFLARE_API_TOKEN or CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL)
Effect.provide(Auth.fromEnv())

// Static token
Effect.provide(Auth.fromToken("your-api-token"))

// OAuth
Effect.provide(Auth.fromOAuth({
  clientId: "...",
  clientSecret: "...",
  refreshToken: "...",
}))
```

## Error Handling

```typescript
import { Effect } from "effect";
import * as R2 from "distilled-cloudflare/r2";

R2.getBucket({ account_id: "...", bucket_name: "missing" }).pipe(
  Effect.catchTags({
    NoSuchBucket: (e) => Effect.succeed({ found: false }),
    CloudflareNetworkError: (e) => Effect.fail(new Error("Network error")),
  }),
);
```

## Pagination

```typescript
// Stream all pages
const pages = yield* R2.listBuckets.pages({ account_id: "..." });

// Stream all items
const keys = yield* KV.listKeys.items({ account_id: "...", namespace_id: "..." });
```

## Development

```bash
bun generate          # Generate from cached spec
bun generate --fetch  # Fetch latest spec and generate
bun test              # Run tests
bun tsc -b            # Type check
```

## License

MIT
