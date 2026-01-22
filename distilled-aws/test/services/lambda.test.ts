import { expect } from "@effect/vitest";
import archiver from "archiver";
import { Effect, Schedule, Stream } from "effect";
import { createWriteStream, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import {
  attachRolePolicy,
  createRole,
  getRole,
} from "../../src/services/iam.ts";
import {
  createEventSourceMapping,
  createFunction,
  deleteEventSourceMapping,
  deleteFunction,
  getEventSourceMapping,
  getFunction,
  getFunctionConfiguration,
  invoke,
  listEventSourceMappings,
  listFunctions,
  listTags,
  tagResource,
  untagResource,
  updateFunctionConfiguration,
  type Runtime,
} from "../../src/services/lambda.ts";
import {
  createQueue,
  deleteQueue,
  getQueueAttributes,
  sendMessage,
} from "../../src/services/sqs.ts";
import { beforeAll, test } from "../test.ts";

const retrySchedule = Schedule.intersect(
  Schedule.recurs(10),
  Schedule.spaced("1 second"),
);

const TEST_ROLE_NAME = "distilled-aws-test-lambda-role";

// Trust policy that allows Lambda to assume the role
const LAMBDA_TRUST_POLICY = JSON.stringify({
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: {
        Service: "lambda.amazonaws.com",
      },
      Action: "sts:AssumeRole",
    },
  ],
});

// Role ARN will be set by beforeAll (or use fake for LocalStack)
let TEST_ROLE_ARN = "arn:aws:iam::000000000000:role/lambda-execution-role";

/**
 * Create a ZIP file from ./lambda-handler/index.js using archiver
 */
const createHandlerZip = async (): Promise<Uint8Array> => {
  const zipPath = join(tmpdir(), `lambda-handler-${Date.now()}.zip`);
  const handlerDir = join(import.meta.dirname, "lambda-handler");

  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      const buffer = readFileSync(zipPath);
      resolve(new Uint8Array(buffer));
    });

    archive.on("error", reject);
    archive.pipe(output);

    archive.directory(handlerDir, false);
    archive.finalize();
  });
};

// Cached zip file to avoid recreating for each test
let cachedZipFile: Uint8Array | null = null;

const getZipFile = async (): Promise<Uint8Array> => {
  if (!cachedZipFile) {
    cachedZipFile = await createHandlerZip();
  }
  return cachedZipFile;
};

// Helper to wait for function to be in Active state
const waitForFunctionActive = (functionName: string) =>
  getFunctionConfiguration({ FunctionName: functionName }).pipe(
    Effect.flatMap((config) => {
      const state = config.State;
      if (state === undefined || state === "Active") {
        return Effect.succeed(config);
      }
      if (state === "Pending" || state === "ActiveNonInvocable") {
        return Effect.fail(new Error(`Function state is ${state}`));
      }
      return Effect.succeed(config);
    }),
    Effect.retry(retrySchedule),
    Effect.mapError(() => new Error("Function did not become active")),
  );

/**
 * Helper to create a Lambda function, run a test, and ensure cleanup.
 */
const withFunction = <A, E, R>(
  config: {
    FunctionName: string;
    Runtime?: Runtime;
    Handler?: string;
    Description?: string;
    Timeout?: number;
    MemorySize?: number;
  },
  use: (func: {
    FunctionName: string;
    FunctionArn: string;
  }) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    const zipFile = yield* Effect.promise(() => getZipFile());

    // Delete existing function if it exists (idempotent setup)
    yield* deleteFunction({ FunctionName: config.FunctionName }).pipe(
      Effect.ignore,
    );

    // Create the function with retry for IAM propagation
    const created = yield* createFunction({
      FunctionName: config.FunctionName,
      Runtime: config.Runtime ?? "nodejs18.x",
      Role: TEST_ROLE_ARN,
      Handler: config.Handler ?? "index.handler",
      Code: { ZipFile: zipFile },
      Description: config.Description ?? "Test function",
      Timeout: config.Timeout ?? 30,
      MemorySize: config.MemorySize ?? 128,
    }).pipe(
      Effect.retry({
        while: (err) =>
          "_tag" in err && err._tag === "InvalidParameterValueException",
        schedule: Schedule.intersect(
          Schedule.recurs(20),
          Schedule.spaced("3 seconds"),
        ),
      }),
    );

    // Wait for function to be active
    yield* waitForFunctionActive(config.FunctionName);

    return yield* use({
      FunctionName: created.FunctionName!,
      FunctionArn: created.FunctionArn!,
    });
  }).pipe(
    Effect.ensuring(
      deleteFunction({ FunctionName: config.FunctionName }).pipe(Effect.ignore),
    ),
  );

/**
 * Helper to create an SQS queue and ensure cleanup.
 */
const withQueue = <A, E, R>(
  queueName: string,
  use: (queue: {
    QueueUrl: string;
    QueueArn: string;
  }) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Delete existing queue if it exists
    yield* deleteQueue({
      QueueUrl: `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID ?? "000000000000"}/${queueName}`,
    }).pipe(Effect.ignore);

    // Create the queue with retry for QueueDeletedRecently
    const queueResult = yield* createQueue({ QueueName: queueName }).pipe(
      Effect.retry({
        while: (err) => "_tag" in err && err._tag === "QueueDeletedRecently",
        schedule: Schedule.intersect(
          Schedule.recurs(30),
          Schedule.spaced("2 seconds"),
        ),
      }),
    );
    const queueUrl = queueResult.QueueUrl!;

    // Get the queue ARN
    const queueAttrs = yield* getQueueAttributes({
      QueueUrl: queueUrl,
      AttributeNames: ["QueueArn"],
    });
    const queueArn = queueAttrs.Attributes?.QueueArn!;

    return yield* use({ QueueUrl: queueUrl, QueueArn: queueArn });
  }).pipe(
    Effect.ensuring(
      deleteQueue({
        QueueUrl: `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID ?? "000000000000"}/${queueName}`,
      }).pipe(Effect.ignore),
    ),
  );

/**
 * Helper to create an event source mapping and ensure cleanup.
 */
const withEventSourceMapping = <A, E, R>(
  config: {
    FunctionName: string;
    EventSourceArn: string;
    BatchSize?: number;
  },
  use: (mapping: { UUID: string }) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Create event source mapping with retry for IAM propagation
    const mapping = yield* createEventSourceMapping({
      FunctionName: config.FunctionName,
      EventSourceArn: config.EventSourceArn,
      BatchSize: config.BatchSize ?? 10,
      Enabled: true,
    }).pipe(
      Effect.retry({
        while: (err) =>
          "_tag" in err &&
          (err._tag === "InvalidParameterValueException" ||
            err._tag === "ResourceConflictException" ||
            err._tag === "ResourceInUseException"),
        schedule: Schedule.intersect(
          Schedule.recurs(10),
          Schedule.spaced("3 seconds"),
        ),
      }),
    );

    return yield* use({ UUID: mapping.UUID! });
  }).pipe(
    Effect.ensuring(
      // Clean up any mappings for this function/source (best effort)
      listEventSourceMappings({ FunctionName: config.FunctionName }).pipe(
        Effect.flatMap((result) =>
          Effect.forEach(
            result.EventSourceMappings ?? [],
            (m) =>
              m.UUID
                ? deleteEventSourceMapping({ UUID: m.UUID }).pipe(
                    Effect.retry({
                      while: (err) =>
                        "_tag" in err && err._tag === "ResourceInUseException",
                      schedule: Schedule.intersect(
                        Schedule.recurs(10),
                        Schedule.spaced("2 seconds"),
                      ),
                    }),
                    Effect.ignore,
                  )
                : Effect.void,
            { concurrency: 1 },
          ),
        ),
        Effect.ignore,
      ),
    ),
  );

// Create the IAM role before all tests (shared across tests)
beforeAll(
  Effect.gen(function* () {
    // For real AWS (not LocalStack), create an actual IAM role
    if (!process.env.LOCAL) {
      // Try to create the role, or get existing role ARN if it already exists
      const roleResult = yield* createRole({
        RoleName: TEST_ROLE_NAME,
        AssumeRolePolicyDocument: LAMBDA_TRUST_POLICY,
        Description: "Test role for distilled-aws Lambda tests",
      }).pipe(
        Effect.map((result) => result.Role.Arn),
        Effect.catchTag("EntityAlreadyExistsException", () =>
          getRole({ RoleName: TEST_ROLE_NAME }).pipe(
            Effect.map((result) => result.Role.Arn),
          ),
        ),
      );

      TEST_ROLE_ARN = roleResult;

      // Attach policies for Lambda execution and SQS access (idempotent)
      yield* attachRolePolicy({
        RoleName: TEST_ROLE_NAME,
        PolicyArn:
          "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
      }).pipe(Effect.ignore);
      yield* attachRolePolicy({
        RoleName: TEST_ROLE_NAME,
        PolicyArn:
          "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole",
      }).pipe(Effect.ignore);
    }
  }),
);

// ============================================================================
// Function Management Tests
// ============================================================================

test(
  "getFunction returns function details",
  withFunction({ FunctionName: "lambda-test-getfunction" }, (func) =>
    Effect.gen(function* () {
      const result = yield* getFunction({
        FunctionName: func.FunctionName,
      });

      expect(result.Configuration).toBeDefined();
      expect(result.Configuration?.FunctionName).toEqual(func.FunctionName);
      expect(result.Configuration?.Runtime).toEqual("nodejs18.x");
      expect(result.Configuration?.Handler).toEqual("index.handler");
    }),
  ),
);

test(
  "getFunctionConfiguration returns configuration",
  withFunction(
    { FunctionName: "lambda-test-getconfig", MemorySize: 128, Timeout: 30 },
    (func) =>
      Effect.gen(function* () {
        const config = yield* getFunctionConfiguration({
          FunctionName: func.FunctionName,
        });

        expect(config.FunctionName).toEqual(func.FunctionName);
        expect(config.MemorySize).toEqual(128);
        expect(config.Timeout).toEqual(30);
      }),
  ),
);

test(
  "listFunctions includes our test function",
  withFunction({ FunctionName: "lambda-test-listfunctions" }, (func) =>
    Effect.gen(function* () {
      const result = yield* listFunctions({});

      expect(result.Functions).toBeDefined();

      const found = result.Functions?.find(
        (f) => f.FunctionName === func.FunctionName,
      );
      expect(found).toBeDefined();
      expect(found?.FunctionName).toEqual(func.FunctionName);
    }),
  ),
);

// ============================================================================
// Function Invocation Tests
// ============================================================================

test(
  "invoke function with RequestResponse",
  withFunction({ FunctionName: "lambda-test-invoke-sync" }, (func) =>
    Effect.gen(function* () {
      const payload = JSON.stringify({ name: "World" });

      const result = yield* invoke({
        FunctionName: func.FunctionName,
        InvocationType: "RequestResponse",
        Payload: new TextEncoder().encode(payload),
      }).pipe(Effect.retry(retrySchedule));

      expect(result.StatusCode).toEqual(200);
      expect(result.Payload).toBeDefined();

      const responsePayload = yield* result.Payload!.pipe(
        Stream.decodeText(),
        Stream.mkString,
      );

      const parsed = JSON.parse(responsePayload);
      expect(parsed.statusCode).toEqual(200);

      const body = JSON.parse(parsed.body);
      expect(body.message).toEqual("Hello from Lambda!");
      expect(body.input.name).toEqual("World");
    }),
  ),
);

test(
  "invoke function with Event (async)",
  withFunction({ FunctionName: "lambda-test-invoke-async" }, (func) =>
    Effect.gen(function* () {
      const payload = JSON.stringify({ async: true });

      const result = yield* invoke({
        FunctionName: func.FunctionName,
        InvocationType: "Event",
        Payload: new TextEncoder().encode(payload),
      }).pipe(Effect.retry(retrySchedule));

      expect(result.StatusCode).toEqual(202);
    }),
  ),
);

test(
  "invoke function with DryRun",
  withFunction({ FunctionName: "lambda-test-invoke-dryrun" }, (func) =>
    Effect.gen(function* () {
      const result = yield* invoke({
        FunctionName: func.FunctionName,
        InvocationType: "DryRun",
      }).pipe(Effect.retry(retrySchedule));

      expect(result.StatusCode).toEqual(204);
    }),
  ),
);

// ============================================================================
// Function Configuration Update Tests
// ============================================================================

test(
  "updateFunctionConfiguration changes settings",
  withFunction(
    {
      FunctionName: "lambda-test-updateconfig",
      Description: "Original description",
      Timeout: 30,
      MemorySize: 128,
    },
    (func) =>
      Effect.gen(function* () {
        // Update the function configuration
        const updated = yield* updateFunctionConfiguration({
          FunctionName: func.FunctionName,
          Description: "Updated description",
          Timeout: 60,
          MemorySize: 256,
        }).pipe(Effect.retry(retrySchedule));

        expect(updated.Description).toEqual("Updated description");
        expect(updated.Timeout).toEqual(60);
        expect(updated.MemorySize).toEqual(256);

        // Wait for update to take effect
        yield* waitForFunctionActive(func.FunctionName);

        // Verify with getFunction
        const config = yield* getFunctionConfiguration({
          FunctionName: func.FunctionName,
        });

        expect(config.MemorySize).toEqual(256);
      }),
  ),
);

// ============================================================================
// Tagging Tests
// ============================================================================

test(
  "tag and untag function",
  withFunction({ FunctionName: "lambda-test-tagging" }, (func) =>
    Effect.gen(function* () {
      // Tag the function
      yield* tagResource({
        Resource: func.FunctionArn,
        Tags: {
          Environment: "test",
          Project: "distilled-aws",
          Team: "Platform",
        },
      });

      // List tags
      const tags = yield* listTags({
        Resource: func.FunctionArn,
      });

      expect(tags.Tags).toBeDefined();
      expect(tags.Tags?.["Environment"]).toEqual("test");
      expect(tags.Tags?.["Project"]).toEqual("distilled-aws");
      expect(tags.Tags?.["Team"]).toEqual("Platform");

      // Remove one tag
      yield* untagResource({
        Resource: func.FunctionArn,
        TagKeys: ["Team"],
      });

      // Verify tag was removed
      const updatedTags = yield* listTags({
        Resource: func.FunctionArn,
      });

      expect(updatedTags.Tags?.["Team"]).toBeUndefined();
      expect(updatedTags.Tags?.["Environment"]).toEqual("test");
      expect(updatedTags.Tags?.["Project"]).toEqual("distilled-aws");
    }),
  ),
);

test(
  "tagResource drops undefined values in Tags map",
  withFunction({ FunctionName: "lambda-test-undefined-tags" }, (func) =>
    Effect.gen(function* () {
      // Tag with an undefined value - should not fail
      yield* tagResource({
        Resource: func.FunctionArn,
        Tags: {
          Present: "value",
          Absent: undefined,
        } as { [key: string]: string | undefined },
      });

      // Verify only non-undefined tags are applied
      const tags = yield* listTags({ Resource: func.FunctionArn });
      expect(tags.Tags?.["Present"]).toEqual("value");
      expect("Absent" in (tags.Tags ?? {})).toBe(false);
    }),
  ),
);

// ============================================================================
// Create and Delete Function Test
// ============================================================================

test(
  "create and delete a function",
  withFunction({ FunctionName: "lambda-test-createdelete" }, (func) =>
    Effect.gen(function* () {
      expect(func.FunctionName).toEqual("lambda-test-createdelete");

      // Verify it exists
      const getResult = yield* getFunction({
        FunctionName: func.FunctionName,
      });
      expect(getResult.Configuration?.FunctionName).toEqual(func.FunctionName);

      // Delete the function explicitly to test deletion
      yield* deleteFunction({ FunctionName: func.FunctionName });

      // Verify it's gone
      const exists = yield* getFunction({
        FunctionName: func.FunctionName,
      }).pipe(
        Effect.map(() => true),
        Effect.catchAll(() => Effect.succeed(false)),
      );
      expect(exists).toEqual(false);
    }),
  ),
);

// ============================================================================
// Event Source Mapping Tests (SQS -> Lambda)
// ============================================================================

test(
  "create, get, list, and delete SQS event source mapping",
  withFunction({ FunctionName: "lambda-test-esm" }, (func) =>
    withQueue("lambda-test-esm-queue", (queue) =>
      withEventSourceMapping(
        {
          FunctionName: func.FunctionName,
          EventSourceArn: queue.QueueArn,
          BatchSize: 10,
        },
        (mapping) =>
          Effect.gen(function* () {
            expect(mapping.UUID).toBeDefined();

            // Get the event source mapping
            const getResult = yield* getEventSourceMapping({
              UUID: mapping.UUID,
            });

            expect(getResult.UUID).toEqual(mapping.UUID);
            expect(getResult.EventSourceArn).toEqual(queue.QueueArn);

            // List event source mappings for the function
            const listResult = yield* listEventSourceMappings({
              FunctionName: func.FunctionName,
            });

            expect(listResult.EventSourceMappings).toBeDefined();
            const found = listResult.EventSourceMappings?.find(
              (m) => m.UUID === mapping.UUID,
            );
            expect(found).toBeDefined();

            // Delete the event source mapping
            yield* deleteEventSourceMapping({ UUID: mapping.UUID }).pipe(
              Effect.retry({
                while: (err) =>
                  "_tag" in err && err._tag === "ResourceInUseException",
                schedule: Schedule.intersect(
                  Schedule.recurs(10),
                  Schedule.spaced("2 seconds"),
                ),
              }),
            );

            // Verify it's deleted
            yield* Effect.gen(function* () {
              const stillExists = yield* getEventSourceMapping({
                UUID: mapping.UUID,
              }).pipe(
                Effect.map(() => true),
                Effect.catchAll(() => Effect.succeed(false)),
              );
              if (stillExists) {
                return yield* Effect.fail("still exists" as const);
              }
            }).pipe(
              Effect.retry({
                while: (err) => err === "still exists",
                schedule: Schedule.intersect(
                  Schedule.recurs(10),
                  Schedule.spaced("2 seconds"),
                ),
              }),
            );
          }),
      ),
    ),
  ),
);

test(
  "send message to SQS queue with Lambda event source",
  withFunction({ FunctionName: "lambda-test-trigger" }, (func) =>
    withQueue("lambda-test-trigger-queue", (queue) =>
      withEventSourceMapping(
        {
          FunctionName: func.FunctionName,
          EventSourceArn: queue.QueueArn,
          BatchSize: 1,
        },
        () =>
          Effect.gen(function* () {
            // Send a message to the queue
            const sendResult = yield* sendMessage({
              QueueUrl: queue.QueueUrl,
              MessageBody: JSON.stringify({ test: "event-source-trigger" }),
            });

            expect(sendResult.MessageId).toBeDefined();

            // Give a moment to process
            yield* Effect.sleep("1 second");
          }),
      ),
    ),
  ),
);

// ============================================================================
// Pagination Stream Tests
// ============================================================================

test(
  "listFunctions.pages() streams full response pages",
  Effect.gen(function* () {
    // Stream all pages of functions
    const pages = yield* listFunctions.pages({}).pipe(Stream.runCollect);

    const pagesArray = Array.from(pages);
    expect(pagesArray.length).toBeGreaterThanOrEqual(1);

    // Each page should have Functions property (may be empty)
    for (const page of pagesArray) {
      expect(page.Functions).toBeDefined();
    }
  }),
);

test(
  "listFunctions.items() streams individual functions",
  Effect.gen(function* () {
    // Stream all functions using .items()
    const functions = yield* listFunctions.items({}).pipe(Stream.runCollect);

    const functionsArray = Array.from(functions);

    // Should have at least the test function we created in beforeAll
    expect(functionsArray.length).toBeGreaterThanOrEqual(1);

    // Each item should be a FunctionConfiguration with FunctionName
    for (const fn of functionsArray) {
      expect(fn.FunctionName).toBeDefined();
    }
  }),
);
