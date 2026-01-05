# effect-aws

A fully typed AWS SDK for [Effect](https://effect.website), generated from [Smithy](https://smithy.io) specifications.

## Features

- **Generated from Smithy specs** — 1:1 compatibility with AWS APIs
- **Typed errors** — All service errors are `TaggedError` classes for pattern matching
- **Streaming support** — Upload and download large files via Effect Streams
- **All AWS protocols** — REST-XML, REST-JSON, AWS JSON 1.0/1.1, AWS Query, EC2 Query

## Installation

```bash
npm install effect-aws effect @effect/platform
# or
bun add effect-aws effect @effect/platform
```

## Quick Start

```typescript
import { Effect } from "effect";
import { FetchHttpClient } from "@effect/platform";
import * as s3 from "effect-aws/s3";
import { Credentials, Region } from "effect-aws";

const program = Effect.gen(function* () {
  // Upload a file
  yield* s3.putObject({
    Bucket: "my-bucket",
    Key: "hello.txt",
    Body: "Hello, World!",
    ContentType: "text/plain",
  });

  // Download a file
  const result = yield* s3.getObject({
    Bucket: "my-bucket",
    Key: "hello.txt",
  });

  return result.ContentType; // "text/plain"
});

// Run with required services
program.pipe(
  Effect.provide(FetchHttpClient.layer),
  Effect.provideService(Region, "us-east-1"),
  Effect.provide(Credentials.fromChain()),
  Effect.runPromise,
);
```

## Importing Services

Import service modules as namespaces:

```typescript
import * as s3 from "effect-aws/s3";
import * as dynamodb from "effect-aws/dynamodb";
import * as lambda from "effect-aws/lambda";
import * as kms from "effect-aws/kms";
import * as sfn from "effect-aws/sfn";

// Then use operations via the namespace
s3.getObject({ Bucket: "my-bucket", Key: "file.txt" });
dynamodb.getItem({ TableName: "users", Key: { ... } });
lambda.invoke({ FunctionName: "my-function" });
```

## Configuration

All operations require three context services: `Region`, `Credentials`, and `HttpClient`.

### Region

The AWS region to use for API calls:

```typescript
import { Region } from "effect-aws";

Effect.provideService(Region, "us-east-1")
```

### Credentials

AWS credentials for signing requests. Multiple providers are available:

```typescript
import { Credentials } from "effect-aws";

// AWS credential provider chain (recommended for production)
// Checks: env vars → SSO → shared credentials → EC2/ECS metadata
Effect.provide(Credentials.fromChain())

// Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
Effect.provide(Credentials.fromEnv())

// SSO profile from ~/.aws/config
Effect.provide(Credentials.fromSSO("my-profile"))

// Shared credentials file (~/.aws/credentials)
Effect.provide(Credentials.fromIni())

// EC2 instance metadata
Effect.provide(Credentials.fromInstanceMetadata())

// ECS container credentials
Effect.provide(Credentials.fromContainerMetadata())

// Web identity token (for EKS)
Effect.provide(Credentials.fromWebToken({ roleArn: "...", webIdentityToken: "..." }))

// Mock credentials (for testing with LocalStack)
Effect.provide(Credentials.mock)
```

### HTTP Client

Requires an HTTP client from `@effect/platform`:

```typescript
import { FetchHttpClient } from "@effect/platform";
// or for Node.js
import { NodeHttpClient } from "@effect/platform-node";

Effect.provide(FetchHttpClient.layer)
// or
Effect.provide(NodeHttpClient.layer)
```

### Custom Endpoint

For LocalStack or other custom endpoints:

```typescript
import { Endpoint } from "effect-aws";

Effect.provideService(Endpoint, "http://localhost:4566")
```

## Complete Examples

### S3 with streaming

```typescript
import { Console, Effect, Stream } from "effect";
import { FetchHttpClient } from "@effect/platform";
import * as s3 from "effect-aws/s3";
import { Credentials, Region } from "effect-aws";

const program = Effect.gen(function* () {
  const bucket = "my-test-bucket";

  // Create bucket
  yield* s3.createBucket({ Bucket: bucket });

  // Upload with string body
  yield* s3.putObject({
    Bucket: bucket,
    Key: "message.txt",
    Body: "Hello from effect-aws!",
    ContentType: "text/plain",
  });

  // Download and stream response
  const result = yield* s3.getObject({ Bucket: bucket, Key: "message.txt" });

  // Body is a Stream<Uint8Array> - collect and decode
  const content = yield* result.Body!.pipe(
    Stream.decodeText(),
    Stream.mkString,
  );
  yield* Console.log(content); // "Hello from effect-aws!"

  // Cleanup
  yield* s3.deleteBucket({ Bucket: bucket });
});

program.pipe(
  Effect.provide(FetchHttpClient.layer),
  Effect.provideService(Region, "us-east-1"),
  Effect.provide(Credentials.fromChain()),
  Effect.runPromise,
);
```

### DynamoDB

DynamoDB uses `AttributeValue` tagged unions for item data:

```typescript
import { Console, Effect } from "effect";
import { FetchHttpClient } from "@effect/platform";
import * as dynamodb from "effect-aws/dynamodb";
import { Credentials, Region } from "effect-aws";

const program = Effect.gen(function* () {
  // Put item - values use AttributeValue format: { S: string }, { N: string }, { BOOL: boolean }
  yield* dynamodb.putItem({
    TableName: "users",
    Item: {
      pk: { S: "user#123" },
      sk: { S: "profile" },
      name: { S: "John Doe" },
      age: { N: "30" },
      active: { BOOL: true },
    },
  });

  // Get item
  const result = yield* dynamodb.getItem({
    TableName: "users",
    Key: {
      pk: { S: "user#123" },
      sk: { S: "profile" },
    },
  });

  const name = (result.Item?.name as { S: string })?.S;
  yield* Console.log(name); // "John Doe"

  // Query by partition key
  const queryResult = yield* dynamodb.query({
    TableName: "users",
    KeyConditionExpression: "pk = :pk",
    ExpressionAttributeValues: {
      ":pk": { S: "user#123" },
    },
  });

  yield* Console.log(queryResult.Count); // 1
});

program.pipe(
  Effect.provide(FetchHttpClient.layer),
  Effect.provideService(Region, "us-east-1"),
  Effect.provide(Credentials.fromChain()),
  Effect.runPromise,
);
```

### Lambda

```typescript
import { Console, Effect, Stream } from "effect";
import { FetchHttpClient } from "@effect/platform";
import * as lambda from "effect-aws/lambda";
import { Credentials, Region } from "effect-aws";

const program = Effect.gen(function* () {
  const functionName = "my-hello-function";

  // Create a Lambda function (requires a ZIP file with your handler code)
  yield* lambda.createFunction({
    FunctionName: functionName,
    Runtime: "nodejs20.x",
    Role: "arn:aws:iam::123456789012:role/lambda-execution-role",
    Handler: "index.handler",
    Code: { ZipFile: myZipFileAsUint8Array },
  });

  // Invoke the function
  const response = yield* lambda.invoke({
    FunctionName: functionName,
    InvocationType: "RequestResponse",
    Payload: new TextEncoder().encode(JSON.stringify({ name: "World" })),
  });

  yield* Console.log(`Status: ${response.StatusCode}`); // 200

  // Read the response payload (it's a stream)
  const payload = yield* response.Payload!.pipe(
    Stream.decodeText(),
    Stream.mkString,
  );
  yield* Console.log(JSON.parse(payload)); // { statusCode: 200, body: "..." }

  // Update function configuration
  yield* lambda.updateFunctionConfiguration({
    FunctionName: functionName,
    MemorySize: 256,
    Timeout: 60,
  });

  // Tag the function
  const funcInfo = yield* lambda.getFunction({ FunctionName: functionName });
  yield* lambda.tagResource({
    Resource: funcInfo.Configuration!.FunctionArn!,
    Tags: { Environment: "production", Team: "platform" },
  });

  // List all functions
  const functions = yield* lambda.listFunctions({});
  yield* Console.log(`Total functions: ${functions.Functions?.length}`);

  // Cleanup
  yield* lambda.deleteFunction({ FunctionName: functionName });
});

program.pipe(
  Effect.provide(FetchHttpClient.layer),
  Effect.provideService(Region, "us-east-1"),
  Effect.provide(Credentials.fromChain()),
  Effect.runPromise,
);
```

### LocalStack Testing

```typescript
import { Effect } from "effect";
import { FetchHttpClient } from "@effect/platform";
import * as s3 from "effect-aws/s3";
import { Credentials, Endpoint, Region } from "effect-aws";

const program = s3.listBuckets({});

program.pipe(
  Effect.provide(FetchHttpClient.layer),
  Effect.provideService(Region, "us-east-1"),
  Effect.provideService(Endpoint, "http://localhost:4566"),
  Effect.provide(Credentials.mock),
  Effect.runPromise,
);
```

### Retry Policy

By default, effect-aws automatically retries transient errors, throttling errors, and errors with the `@retryable` trait using exponential backoff with jitter (up to 5 attempts).

You can customize or disable this behavior using the `Retry` module:

```typescript
import { Retry } from "effect-aws";
// or
import * as Retry from "effect-aws/Retry";
```

#### Disable Retries

```typescript
import { Retry } from "effect-aws";

myEffect.pipe(Retry.none)
```

#### Retry Throttling Errors Indefinitely

```typescript
import { Retry } from "effect-aws";

// Retries all throttling errors with exponential backoff (capped at 5s)
myEffect.pipe(Retry.throttling)
```

#### Retry All Transient Errors Indefinitely

```typescript
import { Retry } from "effect-aws";

// Retries throttling, server errors, and @retryable errors indefinitely
myEffect.pipe(Retry.transient)
```

#### Custom Retry Policy

```typescript
import { Retry } from "effect-aws";
import * as Schedule from "effect/Schedule";

myEffect.pipe(
  Retry.policy({
    while: (error) => isThrottlingError(error),
    schedule: Schedule.exponential(1000),
  })
)
```

#### Dynamic Retry Policy with Error Inspection

For advanced use cases like respecting `Retry-After` headers, you can access the last error via a `Ref`:

```typescript
import { Retry } from "effect-aws";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Schedule from "effect/Schedule";

myEffect.pipe(
  Retry.policy((lastError) => ({
    while: (error) => isThrottlingError(error),
    schedule: Schedule.exponential(1000).pipe(
      Schedule.modifyDelayEffect(
        Effect.gen(function* (duration) {
          const error = yield* lastError;
          // Respect retry-after header if present
          if (error?.retryAfterSeconds) {
            return Duration.seconds(error.retryAfterSeconds);
          }
          return duration;
        })
      )
    ),
  }))
)
```

## Error Handling

All operations return typed errors that can be pattern-matched:

```typescript
import { Effect } from "effect";
import * as s3 from "effect-aws/s3";

const program = s3.getObject({
  Bucket: "my-bucket",
  Key: "missing-file.txt",
}).pipe(
  Effect.catchTags({
    NoSuchKey: (error) =>
      Effect.succeed({ found: false, message: "File not found" }),
    InvalidObjectState: (error) =>
      Effect.fail(new Error(`Object in ${error.StorageClass} storage`)),
  }),
);
```

Lambda error handling:

```typescript
import { Effect } from "effect";
import * as lambda from "effect-aws/lambda";

const program = lambda.invoke({
  FunctionName: "my-function",
  Payload: new TextEncoder().encode("{}"),
}).pipe(
  Effect.catchTags({
    ResourceNotFoundException: () =>
      Effect.succeed({ error: "Function not found" }),
    InvalidRequestContentException: (error) =>
      Effect.fail(new Error(`Bad request: ${error.message}`)),
    ServiceException: () =>
      Effect.succeed({ error: "Lambda service unavailable" }),
  }),
);
```

## Streaming

### Streaming Uploads

```typescript
import { Effect, Stream } from "effect";
import * as s3 from "effect-aws/s3";

// Create a stream from chunks
const chunks = ["Hello, ", "streaming ", "world!"];
const encoder = new TextEncoder();
const stream = Stream.fromIterable(chunks.map((s) => encoder.encode(s)));

const upload = s3.putObject({
  Bucket: "my-bucket",
  Key: "streamed.txt",
  Body: stream,
  ContentLength: chunks.reduce((acc, s) => acc + encoder.encode(s).length, 0),
  ContentType: "text/plain",
});
```

### Streaming Downloads

```typescript
import { Effect, Stream, Console } from "effect";
import * as s3 from "effect-aws/s3";

const download = Effect.gen(function* () {
  const result = yield* s3.getObject({
    Bucket: "my-bucket",
    Key: "document.txt",
  });

  // Body is Stream<Uint8Array> - decode and collect as string
  const content = yield* result.Body!.pipe(
    Stream.decodeText(),
    Stream.mkString,
  );
  yield* Console.log(content);
});
```

---

## Architecture

### Code Generation

Services are generated by [`scripts/generate-clients.ts`](./scripts/generate-clients.ts) from the [Smithy JSON AST models](./aws-models/models/). The generator:

1. Parses Smithy service shapes (structures, operations, errors)
2. Resolves cyclic dependencies using `S.suspend()`
3. Translates Smithy traits to Effect Schema annotations
4. Outputs TypeScript files to [`src/services/`](./src/services/)

```bash
# Generate a single service
bun generate --sdk s3

# Generate all services
bun generate
```

### Smithy Traits as Annotations

Smithy traits are modeled 1:1 with Effect Schema annotations in [`src/traits.ts`](./src/traits.ts). This allows protocol implementations to introspect schemas and serialize/deserialize correctly.

| Smithy Trait | Effect Annotation | Purpose |
|--------------|-------------------|---------|
| `@httpLabel` | `T.HttpLabel()` | Bind member to URI path parameter |
| `@httpHeader` | `T.HttpHeader("X-Custom")` | Bind member to HTTP header |
| `@httpQuery` | `T.HttpQuery("param")` | Bind member to query string |
| `@httpPayload` | `T.HttpPayload()` | Bind member to request/response body |
| `@httpPrefixHeaders` | `T.HttpPrefixHeaders("x-amz-meta-")` | Bind map to prefixed headers |
| `@xmlName` | `T.XmlName("CustomName")` | Custom XML element name |
| `@xmlFlattened` | `T.XmlFlattened()` | Flatten list/map (no wrapper) |
| `@xmlAttribute` | `T.XmlAttribute()` | Serialize as XML attribute |
| `@xmlNamespace` | `T.XmlNamespace("http://...")` | XML namespace URI |
| `@jsonName` | `T.JsonName("custom_name")` | Custom JSON key (uses `S.fromKey`) |
| `@timestampFormat` | `T.TimestampFormat("http-date")` | Timestamp wire format |
| `@streaming` | `T.Streaming()` | Streaming blob type |
| `@contextParam` | `T.ContextParam("Bucket")` | Endpoint resolution parameter |

### Generated Code Examples

#### Request Schema

Request schemas are Effect `S.Class` definitions with HTTP binding annotations:

```typescript
export class GetObjectRequest extends S.Class<GetObjectRequest>(
  "GetObjectRequest",
)(
  {
    // Path parameters
    Bucket: S.String.pipe(T.HttpLabel(), T.ContextParam("Bucket")),
    Key: S.String.pipe(T.HttpLabel(), T.ContextParam("Key")),

    // HTTP headers with timestamp formatting
    IfModifiedSince: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date")),
    ).pipe(T.HttpHeader("If-Modified-Since")),
    IfMatch: S.optional(S.String).pipe(T.HttpHeader("If-Match")),
    Range: S.optional(S.String).pipe(T.HttpHeader("Range")),

    // Query parameters
    VersionId: S.optional(S.String).pipe(T.HttpQuery("versionId")),
    PartNumber: S.optional(S.Number).pipe(T.HttpQuery("partNumber")),
  },
  T.all(
    T.XmlNamespace("http://s3.amazonaws.com/doc/2006-03-01/"),
    T.Http({ method: "GET", uri: "/{Bucket}/{Key+}?x-id=GetObject" }),
    T.AwsApiService({ sdkId: "S3" }),
    T.AwsAuthSigv4({ name: "s3" }),
    T.AwsProtocolsRestXml(),
    T.ServiceVersion("2006-03-01"),
    T.EndpointRuleSet({ /* ... */ }),
  ),
) {}
```

#### Output Schema

Response schemas extract data from headers and body:

```typescript
export class GetObjectOutput extends S.Class<GetObjectOutput>(
  "GetObjectOutput",
)(
  {
    // Streaming body payload
    Body: S.optional(T.StreamingOutput).pipe(T.HttpPayload()),

    // Response headers
    ContentLength: S.optional(S.Number).pipe(T.HttpHeader("Content-Length")),
    ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
    ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
    LastModified: S.optional(
      S.Date.pipe(T.TimestampFormat("http-date"))
    ).pipe(T.HttpHeader("Last-Modified")),
    VersionId: S.optional(S.String).pipe(T.HttpHeader("x-amz-version-id")),
    DeleteMarker: S.optional(S.Boolean).pipe(T.HttpHeader("x-amz-delete-marker")),
  },
) {}
```

#### Error Schema

Errors are `S.TaggedError` classes for typed error handling:

```typescript
export class NoSuchKey extends S.TaggedError<NoSuchKey>()("NoSuchKey", {}) {}

export class InvalidObjectState extends S.TaggedError<InvalidObjectState>()(
  "InvalidObjectState",
  {
    StorageClass: S.optional(S.String),
    AccessTier: S.optional(S.String),
  },
) {}
```

#### Operation Definition

Operations tie input, output, and errors together:

```typescript
export const getObject = /*@__PURE__*/ API.make(() => ({
  input: GetObjectRequest,
  output: GetObjectOutput,
  errors: [InvalidObjectState, NoSuchKey],
}));
```

The `API.make()` function ([`src/api.ts`](./src/api.ts)) creates an Effect-returning function that:

1. Extracts the protocol from input schema annotations
2. Serializes the request using the protocol
3. Applies middleware (checksums, etc.)
4. Signs the request with AWS SigV4
5. Resolves the endpoint using the rules engine
6. Makes the HTTP request
7. Deserializes the response or error

### Protocols

All AWS protocols are implemented in [`src/protocols/`](./src/protocols/):

#### REST-XML (`aws.protocols#restXml`)

Used by: **S3**, **CloudFront**, **Route 53**

- HTTP methods: GET, PUT, POST, DELETE based on `@http` trait
- Request/response bodies serialized as XML
- Supports `@xmlName`, `@xmlFlattened`, `@xmlAttribute`, `@xmlNamespace` traits
- HTTP binding traits for headers, query params, and path labels

#### REST-JSON (`aws.protocols#restJson1`)

Used by: **Lambda**, **API Gateway**, **DynamoDB Streams**, **Glacier**

- HTTP methods based on `@http` trait
- Request/response bodies serialized as JSON
- `@jsonName` trait for custom property keys
- Default timestamp format: `epoch-seconds`

#### AWS JSON 1.0 & 1.1 (`aws.protocols#awsJson1_0`, `aws.protocols#awsJson1_1`)

Used by: **DynamoDB** (1.0), **SQS** (1.0), **SNS** (1.0), **STS** (1.1), **KMS** (1.1)

- All requests: `POST /`
- Target operation via `X-Amz-Target` header
- Request/response bodies always JSON
- Content-Type: `application/x-amz-json-1.0` or `application/x-amz-json-1.1`

#### AWS Query (`aws.protocols#awsQuery`)

Used by: **IAM**, **STS**, **SES**, **CloudWatch**, **Auto Scaling**, **Elastic Load Balancing**

- All requests: `POST /` with `application/x-www-form-urlencoded` body
- `Action` and `Version` parameters identify the operation

#### EC2 Query (`aws.protocols#ec2Query`)

Used by: **EC2**

- Similar to AWS Query but with EC2-specific conventions
- Uses `@ec2QueryName` trait for custom query key names

## Testing

```bash
# Run protocol tests
bun test:protocols

# Run a single protocol test suite
bun vitest run ./test/protocols/rest-xml.test.ts

# Run S3 service tests (requires LocalStack)
bun test:local ./test/services/s3.test.ts

# Run all service tests
bun test:local ./test/services/
```

## License

MIT
