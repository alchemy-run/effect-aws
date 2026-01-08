# src/eventstream

Bi-directional event stream encoding/decoding for streaming APIs (Transcribe, Lex, Bedrock).

→ Parent: [AGENTS.md](../../AGENTS.md)

## FILES

| File            | Purpose                                             |
| --------------- | --------------------------------------------------- |
| `codec.ts`      | Binary wire format — encode/decode messages         |
| `parser.ts`     | `parseEventStreamToUnion` — stream → typed events   |
| `serializer.ts` | `serializeInputEventStream` — typed events → stream |

## MESSAGE FORMAT

```
┌─────────────────────────────────────────────────────┐
│ Prelude (12 bytes)                                  │
│   total_length + headers_length + prelude_crc      │
├─────────────────────────────────────────────────────┤
│ Headers (variable)                                  │
│   :message-type, :event-type, :content-type        │
├─────────────────────────────────────────────────────┤
│ Payload (variable) — JSON or binary                │
├─────────────────────────────────────────────────────┤
│ Message CRC (4 bytes)                              │
└─────────────────────────────────────────────────────┘
```

## MESSAGE TYPES

| `:message-type` | Meaning                        |
| --------------- | ------------------------------ |
| `event`         | Normal event data              |
| `exception`     | Schema-defined error (modeled) |
| `error`         | Unexpected error (unmodeled)   |

## USAGE

Event streams appear as `Effect.Stream` in operation schemas. The protocol layer handles serialization/parsing automatically via `rest-json.ts`.

## SMITHY REFERENCE

- `smithy/docs/source-2.0/spec/streaming.rst`
- `smithy/docs/source-2.0/aws/amazon-eventstream.rst`
