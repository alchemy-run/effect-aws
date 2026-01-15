import { Tool, Toolkit } from "@effect/ai";
import * as Chat from "@effect/ai/Chat";
import { Args, Command } from "@effect/cli";
import { FileSystem, Path } from "@effect/platform";
import {
  NodeContext,
  NodeHttpClient,
  NodeRuntime,
} from "@effect/platform-node";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";
import * as S from "effect/Schema";
import type { Operation } from "../client/operation.ts";
import * as Credentials from "../credentials.ts";
import { Endpoint } from "../endpoint.ts";
import { COMMON_ERRORS, UnknownAwsError } from "../errors.ts";
import type { RegionName } from "../region.ts";
import { Region } from "../region.ts";
// import * as AWS from "../services/index.ts";
const AWS = (await import("../services/index.ts")) as any;
// import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai";
import { AnthropicClient, AnthropicLanguageModel } from "@effect/ai-anthropic";
import * as Persistence from "@effect/experimental/Persistence";
import * as PlatformConfigProvider from "@effect/platform/PlatformConfigProvider";
import { Console, Either, JSONSchema, Layer, LogLevel, Stream } from "effect";
import { locks, Locks } from "./locks.ts";
import { ServiceSpec } from "./spec-schema.ts";

// Open AI performed terribly, so we're using Anthropic instead
// const OpenAi = OpenAiClient.layerConfig({
//   apiKey: Config.redacted("OPENAI_API_KEY"),
// });
// const gpt5Nano = OpenAiLanguageModel.model("gpt-5-nano");
const Anthropic = AnthropicClient.layerConfig({
  apiKey: Config.redacted("ANTHROPIC_API_KEY"),
});
const claudeHaiku45 = AnthropicLanguageModel.model("claude-haiku-4-5");

const model = Layer.provideMerge(claudeHaiku45, Anthropic);
// process.env.MODEL === "openai"
//   ? Layer.provideMerge(gpt5Nano, OpenAi)
//   : Layer.provideMerge(claudeHaiku45, Anthropic);

const listServices = Tool.make("ListServices", {
  description: "List all available AWS services",
  success: S.Array(S.String),
  parameters: {},
});

const listOperations = Tool.make("ListOperations", {
  description: "List all operations for a given AWS service",
  success: S.Array(S.String),
  failure: S.String,
  parameters: {
    service: S.String.annotations({
      description: "The AWS service to list operations for",
    }),
  },
});

export const describeOperation = Tool.make("DescribeOperation", {
  description:
    "Describe a given AWS operation's schema (input, output and known errors)",
  success: S.String,
  failure: S.String,
  parameters: {
    service: S.String.annotations({
      description: "The AWS service to describe the operation for",
    }),
    operation: S.String.annotations({
      description: "The AWS operation to describe",
    }),
  },
});

export const done = Tool.make("Done", {
  description:
    "Call this when you have finished discovering errors for the operation. Provide a summary of what you found.",
  success: S.String,
  parameters: {
    summary: S.String.annotations({
      description:
        "A summary of what errors were discovered (both new and already-known)",
    }),
  },
});

export const callApi = Tool.make("CallApi", {
  description:
    "Call a given AWS API. You can optionally specify a region to test region-specific behavior.",
  success: S.String,
  failure: S.Any,
  dependencies: [
    Credentials.Credentials,
    FileSystem.FileSystem,
    Path.Path,
    Locks,
  ],
  parameters: {
    service: S.String.annotations({
      description: "The AWS service to call the API for",
    }),
    operation: S.String.annotations({
      description: "The AWS operation to call",
    }),
    input: S.String.annotations({
      description:
        "The JSON input to the AWS operation. Must match the operation's input schema.",
    }),
    region: S.String.annotations({
      description:
        "AWS region to use for this call (e.g., 'us-east-1', 'eu-west-1'). Use different regions to discover region-specific errors.",
    }),
  },
});

const toolkit = Toolkit.make(
  listServices,
  listOperations,
  describeOperation,
  // done,
  callApi,
);

const tools = toolkit.toLayer(
  Effect.gen(function* () {
    return {
      ListServices: Effect.fn(function* () {
        yield* Console.log("\x1b[90mListServices\x1b[0m");
        return Object.keys(AWS);
      }),
      ListOperations: Effect.fn(function* ({ service }) {
        yield* Console.log(`\x1b[90mListOperations ${service}\x1b[0m`);
        return yield* getService(service).pipe(Effect.map(Object.keys));
      }),
      DescribeOperation: Effect.fn(function* ({ service, operation }) {
        const api = yield* getOperation(service, operation);
        if (!api) {
          return `Operation '${operation}' not found in service '${service}'`;
        }
        const spec = {
          inputSchema: JSONSchema.make(api.input),
          knownErrors: api.errors.map((err) => err._tag),
        };
        yield* Console.log(
          `\x1b[90mDescribeOperation ${service} ${operation}\x1b[0m`,
        );
        return JSON.stringify(spec);
      }),
      // Done: Effect.fn(function* ({ summary }) {
      //   yield* Console.log("=== Discovery Complete ===");
      //   yield* Console.log(summary);
      //   return "Discovery session complete.";
      // }),
      CallApi: Effect.fn(function* ({ service, operation, input, region }) {
        return yield* Effect.gen(function* () {
          // Resolve to the canonical operation name used in generated code
          const operationName = (yield* resolveOperationName(
            service,
            operation,
          ))!;
          const api = yield* getOperation(service, operation);
          if (!api) {
            return `Operation '${operation}' not found in service '${service}'`;
          }
          const effectiveRegion = region ?? "us-west-2";

          // Load spec patches to include discovered errors
          const specPatches = yield* loadSpec(service);
          const opPatches = specPatches.operations[operationName];
          const patchedErrors = opPatches?.errors ?? [];

          // Get defined error names to check if discovered error is known
          const definedErrorNames = new Set([
            ...api.errors.map((err) => err._tag),
            ...COMMON_ERRORS.map((err) => err._tag),
            ...patchedErrors,
          ]);

          let json;
          try {
            json = JSON.parse(input);
          } catch (error) {
            yield* Console.log("Invalid JSON input", input, error);
            return `Invalid JSON input: ${input}. Error: ${error}`;
          }

          return yield* S.decodeUnknown(api.input)(json).pipe(
            Effect.either,
            Effect.flatMap(
              Either.match({
                onLeft: (error) =>
                  Effect.succeed(
                    `Input does not match the operation's input schema: ${error.toString()}`,
                  ),
                onRight: (decodedInput) =>
                  Effect.gen(function* () {
                    // Log the API call with decoded input and region
                    yield* Console.log(
                      `\x1b[34m[${effectiveRegion}] ${service}.${operationName}(${JSON.stringify(decodedInput, null, 2)})\x1b[0m`,
                    );

                    const result = yield* api(decodedInput).pipe(
                      Effect.provideService(
                        Region,
                        effectiveRegion as RegionName,
                      ),
                      Effect.map((response) => {
                        const responseStr = `Success: Operation completed successfully.`;
                        return {
                          success: true as const,
                          response,
                          responseStr,
                        };
                      }),
                      Effect.catchAll((err: any) => {
                        if (err instanceof UnknownAwsError) {
                          return Effect.succeed({
                            success: false as const,
                            errorTag: err.errorTag,
                            isKnown: false,
                            message: err.message,
                          });
                        }
                        const errorTag = err._tag || err.errorTag || "Unknown";
                        const isKnown = definedErrorNames.has(errorTag);
                        const message =
                          err.message || err.errorData?.Message || "";
                        return Effect.succeed({
                          success: false as const,
                          errorTag,
                          isKnown,
                          message,
                        });
                      }),
                    );

                    if (result.success) {
                      return result.responseStr;
                    } else {
                      if (
                        result.isKnown ||
                        // it may have been added recently
                        definedErrorNames.has(result.errorTag)
                      ) {
                        yield* Console.log(
                          `\x1b[32mEncountered known error: ${result.errorTag}\x1b[0m`,
                        );
                        return `Error "${result.errorTag}" (already defined): ${result.message}`;
                      } else {
                        // Record as a new error
                        const locks = yield* Locks;
                        const lock = yield* locks.getLock(
                          `spec/${service.toLowerCase()}.json`,
                        );

                        definedErrorNames.add(result.errorTag);
                        yield* lock.withPermits(1)(
                          recordError(service, operationName, result.errorTag),
                        );
                        yield* Console.log(
                          `\x1b[31mDiscovered error tag: ${result.errorTag} (saved to spec/${service.toLowerCase()}.json)\x1b[0m`,
                        );
                        return `⚠️ NEW ERROR DISCOVERED: "${result.errorTag}" - This error is NOT in the defined errors list! Message: ${result.message}`;
                      }
                    }
                  }),
              }),
            ),
          );
        }).pipe(
          // Catch any defects (synchronous throws like invalid base64) and return as error message
          Effect.catchAllDefect((defect) => {
            const message =
              defect instanceof Error ? defect.message : String(defect);
            const name = defect instanceof Error ? defect.name : "Error";
            return Effect.succeed(
              `Input validation error (${name}): ${message}. Please check your input values - for binary/blob fields, ensure you provide valid base64-encoded data.`,
            );
          }),
        );
      }),
    };
  }),
);

/**
 * Get the spec file path for a service.
 */
const getSpecPath = (service: string) => `spec/${service.toLowerCase()}.json`;

/**
 * Load the spec file for a service.
 */
const loadSpec = Effect.fn(function* (service: string) {
  const fs = yield* FileSystem.FileSystem;
  const specPath = getSpecPath(service);
  return yield* fs.readFileString(specPath).pipe(
    Effect.flatMap(S.decodeUnknown(S.parseJson(ServiceSpec))),
    Effect.catchAll(() => Effect.succeed({ operations: {} } as ServiceSpec)),
  );
});

/**
 * Save the spec file for a service.
 */
const saveSpec = Effect.fn(function* (service: string, spec: ServiceSpec) {
  const fs = yield* FileSystem.FileSystem;
  const specPath = getSpecPath(service);
  yield* fs.makeDirectory("spec", { recursive: true });
  yield* fs.writeFileString(specPath, JSON.stringify(spec, null, 2) + "\n");
});

/**
 * Record a discovered error to the spec file for a service.
 */
const recordError = Effect.fn(function* (
  service: string,
  operation: string,
  errorTag: string,
) {
  const existingSpec = yield* loadSpec(service);
  const opErrors = existingSpec.operations[operation]?.errors ?? [];

  if (!opErrors.includes(errorTag)) {
    yield* saveSpec(service, {
      ...existingSpec,
      operations: {
        ...existingSpec.operations,
        [operation]: {
          ...existingSpec.operations[operation],
          errors: [...opErrors, errorTag].sort(),
        },
      },
    });
  }
});

const getService = Effect.fn(function* (service: string) {
  if (service in AWS) {
    return AWS[service as keyof typeof AWS];
  }
  for (const svc in AWS) {
    if (svc.toLowerCase() === service.toLowerCase()) {
      return AWS[svc as keyof typeof AWS];
    }
  }
  return yield* Effect.fail(`Service ${service} not found in AWS`);
});

/**
 * Resolve an operation name to the canonical name used in the generated service.
 * Performs case-insensitive matching and returns the actual exported name.
 */
const resolveOperationName = Effect.fn(function* (
  service: string,
  operation: string,
) {
  const svc = yield* getService(service);
  if (operation in svc) {
    return operation;
  }
  for (const op in svc) {
    if (op.toLowerCase() === operation.toLowerCase()) {
      return op;
    }
  }
  return undefined;
});

const getOperation = Effect.fn(function* (service: string, operation: string) {
  type Op = Operation & {
    (input: any): Effect.Effect<any, any, Region | Credentials.Credentials>;
  };
  const svc = yield* getService(service);
  if (!svc) {
    return undefined;
  }
  const resolvedName = yield* resolveOperationName(service, operation);
  return svc[resolvedName as keyof typeof svc] as Op;
});

const SYSTEM_PROMPT = `You are an AWS API error discovery agent. Your mission is to discover undocumented or incorrectly named error codes in AWS API operations by systematically probing them with various inputs AND by setting up real resources to trigger state-based errors.

## Background
AWS's Smithy specifications often have incomplete or incorrect error definitions:
- Some errors are missing entirely (e.g., NoSuchBucket may not be listed for an S3 operation)
- Some error names are wrong (e.g., "NotFound" instead of "NoSuchBucket")

We need to discover the ACTUAL error codes returned by AWS APIs and compare them to what's documented.

## Your Tools
- **ListOperations**: List all operations for a service - use this to find helper operations (CreateBucket, PutObject, etc.)
- **DescribeOperation**: Get the JSON schema for an operation's input and see its currently defined errors
- **CallApi**: Call the AWS API with specific inputs and optionally a specific region. Returns either:
  - Success message
  - Known error (already in the spec)
  - ⚠️ NEW ERROR DISCOVERED (automatically recorded - this is what we're looking for!)
  - 🔄 ERROR ALIAS DETECTED (when an error like "FooException" is a variant of known error "Foo")
  - You can pass a "region" parameter to test region-specific behavior!

## Strategy
1. First, use DescribeOperation to understand:
   - What input fields are required (look at the "required" array in the JSON schema)
   - What errors are already defined for this operation

2. **CRITICAL: Set up resources to trigger state-based errors!**
   Don't just test with non-existent resources. Many errors only occur when resources EXIST:
   
   **Create-then-conflict pattern:**
   - Call CreateBucket to make a bucket exist
   - Then call CreateBucket again with the same name → triggers BucketAlreadyExists/BucketAlreadyOwnedByYou
   
   **Resource-exists-but-wrong-state pattern:**
   - Create a bucket, put objects in it
   - Try to delete the bucket → triggers BucketNotEmpty
   
   **Create-then-use pattern:**
   - Create a bucket
   - Try the target operation with that existing bucket but non-existent sub-resources

3. Also probe for errors with invalid inputs:

   **For operations with resource identifiers (Bucket, Key, etc.):**
   - Use non-existent resource names to trigger "NoSuch*" errors
   - For S3 buckets: use valid DNS names like "nonexistent-bucket-abc123"
   - For object keys: use paths like "nonexistent/key/path.txt"

   **For operations with validation requirements:**
   - Try invalid bucket names (uppercase, special chars, too short/long)
   - Try empty strings for required fields
   - Try invalid formats where applicable

4. When CallApi returns "⚠️ NEW ERROR DISCOVERED", that error has been automatically recorded. Keep probing to find more!

5. **Explore region-specific behavior!**
   Some operations behave differently based on region. Use the "region" parameter in CallApi to test:
   
   **S3 CreateBucket with LocationConstraint:**
   - In us-east-1: CreateBucket works WITHOUT LocationConstraint
   - In other regions: CreateBucket REQUIRES LocationConstraint matching the region
   - Try creating a bucket in eu-west-1 without LocationConstraint → may trigger error
   - Try creating a bucket with LocationConstraint mismatching the API region
   
   **Cross-region access:**
   - Create a bucket in one region, try to access it from another region
   - May trigger IllegalLocationConstraintException or similar

6. Common AWS error patterns to discover (try to trigger ALL relevant ones):
   
   **Missing resource errors:**
   - NoSuchBucket, NoSuchKey, NoSuchUpload, NoSuchVersion, NoSuchTagSet
   
   **Already-exists errors (requires creating resources first!):**
   - BucketAlreadyExists, BucketAlreadyOwnedByYou
   
   **State conflict errors (requires setting up specific state!):**
   - BucketNotEmpty (put objects in bucket, then try to delete)
   - InvalidBucketState, OperationAborted
   
   **Region/Location errors:**
   - IllegalLocationConstraintException
   - InvalidLocationConstraint
   
   **Validation errors:**
   - InvalidBucketName, InvalidArgument, InvalidRequest
   - MalformedXML, MalformedPolicy
   
   **Permission errors:**
   - AccessDenied, NotAuthorized

7. **CLEANUP: Before summarizing, DELETE all resources you created!**
   - Delete any buckets you created (first delete all objects in them)
   - Delete any other resources (queues, tables, etc.)
   - Use ListOperations to find the appropriate delete operations (DeleteObject, DeleteBucket, etc.)
   - This keeps the test environment clean for future runs

8. When you're satisfied you've found all discoverable errors and cleaned up, provide a summary of what you found.

## Important Notes
- This is a SANDBOX AWS account - ALL RESOURCES CAN BE SAFELY DELETED!
- You're running against LocalStack, so you can safely make any API calls - CREATE RESOURCES FREELY!
- Use ListOperations to find helper operations (CreateBucket, PutObject, DeleteBucket) for setting up test scenarios
- Focus on discovering UNIQUE errors - don't repeat the same error condition
- ALWAYS set up resources when testing state-dependent errors
- Keep going until you've exhausted reasonable input variations AND state-based scenarios
- Always provide ALL required fields, even if with dummy values

## Handling Limit Errors
If you encounter errors indicating a limit has been exceeded (e.g., "LimitExceeded", "TooManyBuckets", "QuotaExceeded", "ResourceLimitExceeded", or similar), **DO NOT HESITATE TO DELETE EXISTING RESOURCES** to make room for your tests:
- List existing resources using appropriate List* operations
- Delete old/unused resources to free up quota
- Then retry your operation
- This is a sandbox environment - treat ALL resources as expendable and safe to remove
- Never let limit errors block your exploration - just clean up and continue
`;

const discover = Command.make(
  "discover",
  {
    prompt: Args.text({ name: "prompt" }).pipe(
      Args.withDescription(
        "What to explore (e.g., 'discover S3 errors' or 'explore DynamoDB GetItem')",
      ),
    ),
  },
  ({ prompt: userPrompt }) =>
    Effect.gen(function* () {
      const chat = yield* Chat.fromPrompt([
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Discover missing or incorrectly named errors for AWS APIs.

## How to proceed:

1. Use ListServices to see available services, then ListOperations to find operations.
2. Use DescribeOperation to see the input schema and currently defined errors for operations you want to explore.
3. Use ListOperations to find helper operations you can use to SET UP RESOURCES (e.g., CreateBucket, PutObject).
4. **Create resources first** to trigger state-based errors:
   - Create a bucket/resource, then try to create it again (AlreadyExists errors)
   - Create a bucket, add objects, try to delete (BucketNotEmpty)
   - Create resources so you can test the target operation with real state
5. **Test region-specific behavior** using the "region" parameter in CallApi:
   - Try operations in different regions (us-east-1, eu-west-1, ap-southeast-1)
   - For S3 CreateBucket: test with/without LocationConstraint in different regions
   - Test mismatched regions (e.g., create in one region, access from another)
6. Also test with non-existent resources and invalid inputs for validation errors.
7. When you see "⚠️ NEW ERROR DISCOVERED", that error has been recorded automatically.
8. Keep probing until you've discovered errors from ALL categories:
   - Invalid/missing input scenarios
   - State-based scenarios (resources that already exist, wrong state, etc.)
   - Region-specific scenarios
9. **CLEANUP before summarizing**: Delete all resources you created during testing:
   - Delete objects from buckets first, then delete the buckets
   - Delete any other resources (queues, tables, etc.)
   - This keeps the environment clean for future runs
10. When done cleaning up, provide a summary of what you found.

Begin by understanding what the user wants to explore, then use the appropriate tools.`,
        },
        {
          role: "assistant",
          content:
            "Got it, I can do that for you. Any specifics you can provide me?",
        },
      ]);

      let isFirstIteration = true;

      while (true) {
        let finishReason: string | undefined;

        const stream = chat.streamText({
          toolkit,
          // Only send the full prompt on the first iteration
          prompt: isFirstIteration ? userPrompt : "Continue",
        });
        isFirstIteration = false;

        yield* Stream.runForEach(stream, (part) =>
          Effect.sync(() => {
            switch (part.type) {
              case "text-delta":
              case "reasoning-delta":
                // Stream text as it comes in
                process.stdout.write(part.delta);
                break;
              case "text-end":
              case "reasoning-end":
                process.stdout.write("\n");
                break;
              case "tool-call":
              case "tool-params-start":
              case "tool-params-delta":
              case "tool-params-end":
                // TODO: print these nicely
                break;
              case "finish":
                finishReason = part.reason;
                break;
            }
          }),
        );

        if (finishReason !== "tool-calls") {
          break;
        }
      }
    }).pipe(
      Effect.provide(
        Chat.layerPersisted({
          storeId: "chat",
        }),
      ),
    ),
);

// Set up the CLI application
const cli = Command.run(discover, {
  name: "Alchemy Effect Code",
  version: "1.0.0",
});

const eff = Effect.gen(function* () {
  yield* cli(process.argv).pipe(
    Effect.withConfigProvider(yield* PlatformConfigProvider.fromDotEnv(".env")),
    Effect.provide(tools),
    Effect.provide(model),
  );
}).pipe(
  Logger.withMinimumLogLevel(
    process.env.DEBUG ? LogLevel.Debug : LogLevel.Info,
  ),
  Effect.scoped,
  Effect.provide(locks),
  Effect.provide(process.env.LIVE ? Credentials.fromSSO() : Credentials.mock),
  Effect.provideService(Region, "us-west-2"),
  Effect.provide(Persistence.layerMemory),
);

const nodePlatform = Layer.mergeAll(NodeContext.layer, NodeHttpClient.layer);

if (!process.env.LIVE) {
  eff.pipe(
    Effect.provideService(Endpoint, "http://localhost:4566"),
    Effect.provide(nodePlatform),
    NodeRuntime.runMain,
  );
} else {
  eff.pipe(Effect.provide(nodePlatform), NodeRuntime.runMain);
}
