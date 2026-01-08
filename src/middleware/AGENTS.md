# src/middleware

Request/response middleware for checksums and streaming body handling.

→ Parent: [AGENTS.md](../../AGENTS.md)

## FILES

| File                | Smithy Trait                 | Purpose                                   |
| ------------------- | ---------------------------- | ----------------------------------------- |
| `checksum.ts`       | `aws.protocols#httpChecksum` | CRC32/MD5 checksums, aws-chunked encoding |
| `streaming-body.ts` | `smithy.api#requiresLength`  | Buffer streams to compute Content-Length  |
| `middleware.ts`     | —                            | `Middleware` interface definition         |
| `index.ts`          | —                            | Re-exports                                |

## CHECKSUM MIDDLEWARE

`applyHttpChecksum` — main entry point:

1. Read `aws.protocols#httpChecksum` trait from schema
2. For streaming: create aws-chunked encoded stream with trailing checksum
3. For non-streaming: compute checksum inline, add header

**aws-chunked format:**

```
<chunk-size-hex>\r\n<chunk-data>\r\n...0\r\n<trailer>\r\n\r\n
```

## STREAMING BODY MIDDLEWARE

`makeStreamingBodyMiddleware` — buffers streams without Content-Length:

1. Pre-analyze schema for streaming payload info
2. If stream lacks Content-Length, buffer and compute it
3. Skip for event streams (they handle their own framing)

## RELATED

- `../traits.ts` — `getAwsProtocolsHttpChecksum`, `hasRequiresLength`
- `../hash/` — CRC32, MD5 implementations
- `../customizations/glacier.ts` — Glacier tree hash (SHA256)
