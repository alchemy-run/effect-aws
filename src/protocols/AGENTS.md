# src/protocols

AWS protocol implementations. Each handles request serialization and response parsing.

→ Parent: [AGENTS.md](../../AGENTS.md)

## PROTOCOLS

| File           | Content-Type                        | Services                      |
| -------------- | ----------------------------------- | ----------------------------- |
| `rest-json.ts` | `application/json`                  | Lambda, API Gateway, Glacier  |
| `rest-xml.ts`  | `application/xml`                   | S3, CloudFront, Route53       |
| `aws-json.ts`  | `application/x-amz-json-1.x`        | DynamoDB, KMS, Step Functions |
| `aws-query.ts` | `application/x-www-form-urlencoded` | IAM, SNS, STS                 |
| `ec2-query.ts` | `application/x-www-form-urlencoded` | EC2                           |

## CONTRACT

Every protocol exports: `(Operation) => { buildRequest, parseResponse }`

```typescript
buildRequest: (input: unknown) => Effect<Request>
parseResponse: (response: Response) => Effect<unknown>
```

## REQUEST FLOW

1. Encode input via `Schema.encode(inputSchema)`
2. Apply HTTP bindings (`applyHttpTrait`) — method, path, query
3. Serialize body (JSON, XML, or form-urlencoded)
4. Add headers (`Content-Type`, `X-Amz-Target` for JSON protocols)

## RESPONSE FLOW

1. Check status code for errors
2. Parse body based on `Content-Type`
3. Extract HTTP header bindings
4. Decode to output schema

## ERROR HANDLING

1. Extract error code (JSON: `__type`/`code`, XML: `<Code>`)
2. Match against operation's error schemas
3. Return typed `TaggedError` or `UnknownAwsError`

## DEPENDENCIES

- `../traits.ts` — `getHttpHeader`, `hasHttpPayload`, etc.
- `../util/ast.ts` — Schema AST introspection
- `../util/serialize-input.ts` — HTTP binding serialization
- `../util/xml.ts` — XML serialization/parsing

## SMITHY REFERENCE

| Topic         | Path                                                              |
| ------------- | ----------------------------------------------------------------- |
| HTTP bindings | `smithy/docs/source-2.0/spec/http-bindings.rst`                   |
| restJson1     | `smithy/docs/source-2.0/aws/protocols/aws-restjson1-protocol.rst` |
| restXml       | `smithy/docs/source-2.0/aws/protocols/aws-restxml-protocol.rst`   |
| awsQuery      | `smithy/docs/source-2.0/aws/protocols/aws-query-protocol.rst`     |
