# Protocols

5 AWS protocol implementations: RestXml, RestJson, AwsJson 1.0/1.1, AwsQuery, Ec2Query.

## Architecture

```
Protocol = (operation: Operation) => ProtocolHandler

ProtocolHandler:
  serializeRequest(input)   → Request
  deserializeResponse(resp) → output
  deserializeError(resp)    → { errorCode, data }
```

Protocols pre-compute metadata at init (property signatures, HTTP bindings) for per-request perf.

## Files

| File | Protocol | Services |
|------|----------|----------|
| `rest-xml.ts` | RestXml | S3, CloudFront |
| `rest-json.ts` | RestJson | Lambda, API Gateway |
| `aws-json.ts` | AwsJson 1.0/1.1 | DynamoDB, Step Functions |
| `aws-query.ts` | AwsQuery | IAM, SNS, STS |
| `ec2-query.ts` | Ec2Query | EC2 |

## Key Patterns

**Request serialization:**
- HTTP binding traits drive path/query/header extraction
- Body: JSON or XML based on protocol
- `@httpPayload` = single member as body

**Response deserialization:**
- Headers → properties via trait inspection
- Body: Protocol-specific parser (fast-xml-parser for XML)
- Error code extraction varies by protocol

**Error code locations:**
- RestJson: `X-Amzn-Errortype` header or `__type`/`code` in body
- AwsQuery/Ec2Query: XML `<Code>` element
- AwsJson: `X-Amzn-Errortype` header or `__type` field

## Testing

Protocol tests in `test/protocols/*.test.ts` use generated schemas from services:
```typescript
import { GetObjectRequest } from "../src/services/s3.ts";
const request = yield* buildRequest(GetObjectRequest, input);
```

## Dependencies

Uses utilities from `../util/`:
- `xml.ts` - XML serialization/parsing
- `ast.ts` - Schema AST traversal
- `timestamp.ts` - Date formatting
- `stream.ts` - Event stream handling
