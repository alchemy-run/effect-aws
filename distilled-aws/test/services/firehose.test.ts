import { expect } from "@effect/vitest";
import { Data, Effect, Schedule } from "effect";
import {
  createDeliveryStream,
  deleteDeliveryStream,
  describeDeliveryStream,
  listDeliveryStreams,
  listTagsForDeliveryStream,
  putRecord,
  putRecordBatch,
  tagDeliveryStream,
  untagDeliveryStream,
} from "../../src/services/firehose.ts";
import {
  createRole,
  deleteRole,
  deleteRolePolicy,
  listRolePolicies,
  putRolePolicy,
} from "../../src/services/iam.ts";
import {
  createBucket,
  deleteBucket,
  deleteObjects,
  headBucket,
  listObjectsV2,
  listObjectVersions,
} from "../../src/services/s3.ts";
import { getCallerIdentity } from "../../src/services/sts.ts";
import { test } from "../test.ts";

// ============================================================================
// Error Classes for State Management
// ============================================================================

class NotReady extends Data.TaggedError("NotReady")<{
  status: string | undefined;
}> {}
class StreamNotActive extends Data.TaggedError("StreamNotActive")<{}> {}
class StreamNotDeleted extends Data.TaggedError("StreamNotDeleted")<{}> {}
class StillExists extends Data.TaggedError("StillExists")<{}> {}

// ============================================================================
// IAM Role Helpers for Firehose
// ============================================================================

// Trust policy allowing Firehose to assume the role
const firehoseTrustPolicy = JSON.stringify({
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: {
        Service: "firehose.amazonaws.com",
      },
      Action: "sts:AssumeRole",
    },
  ],
});

// Policy document allowing Firehose to write to S3
const makeS3WritePolicy = (bucketArn: string) =>
  JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "s3:AbortMultipartUpload",
          "s3:GetBucketLocation",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:ListBucketMultipartUploads",
          "s3:PutObject",
        ],
        Resource: [bucketArn, `${bucketArn}/*`],
      },
    ],
  });

// Clean up an IAM role used for Firehose
const cleanupRole = (roleName: string) =>
  Effect.gen(function* () {
    // Delete inline policies
    const inlinePolicies = yield* listRolePolicies({ RoleName: roleName }).pipe(
      Effect.orElseSucceed(() => ({ PolicyNames: [] })),
    );
    for (const policyName of inlinePolicies.PolicyNames ?? []) {
      yield* deleteRolePolicy({
        RoleName: roleName,
        PolicyName: policyName,
      }).pipe(Effect.ignore);
    }

    // Delete the role
    yield* deleteRole({ RoleName: roleName }).pipe(Effect.ignore);
  });

// Create an IAM role for Firehose with S3 write permissions
const createFirehoseRole = (roleName: string, bucketArn: string) =>
  Effect.gen(function* () {
    // Clean up any leftover from previous runs
    yield* cleanupRole(roleName);

    // Create the role
    const roleResult = yield* createRole({
      RoleName: roleName,
      AssumeRolePolicyDocument: firehoseTrustPolicy,
    });

    const roleArn = roleResult.Role!.Arn!;

    // Add the S3 write policy
    yield* putRolePolicy({
      RoleName: roleName,
      PolicyName: "S3WritePolicy",
      PolicyDocument: makeS3WritePolicy(bucketArn),
    });

    // IAM roles take time to propagate - wait a bit
    yield* Effect.sleep("10 seconds");

    return roleArn;
  });

// ============================================================================
// S3 Bucket Helpers
// ============================================================================

// Delete all objects from a bucket
const emptyBucket = (bucket: string) =>
  Effect.gen(function* () {
    // Delete all object versions (for versioned buckets)
    let versionToken: string | undefined;
    do {
      const versions = yield* listObjectVersions({
        Bucket: bucket,
        KeyMarker: versionToken,
      }).pipe(
        Effect.orElseSucceed(
          () =>
            ({
              Versions: [],
              DeleteMarkers: [],
              NextKeyMarker: undefined,
            }) as const,
        ),
      );

      const objectsToDelete = [
        ...(versions.Versions ?? []).map((v) => ({
          Key: v.Key!,
          VersionId: v.VersionId,
        })),
        ...(versions.DeleteMarkers ?? []).map((d) => ({
          Key: d.Key!,
          VersionId: d.VersionId,
        })),
      ];

      if (objectsToDelete.length > 0) {
        yield* deleteObjects({
          Bucket: bucket,
          Delete: { Objects: objectsToDelete },
        }).pipe(Effect.ignore);
      }

      versionToken = versions.NextKeyMarker;
    } while (versionToken);

    // Also delete any non-versioned objects
    let token: string | undefined;
    do {
      const objects = yield* listObjectsV2({
        Bucket: bucket,
        ContinuationToken: token,
      }).pipe(
        Effect.orElseSucceed(
          () => ({ Contents: [], NextContinuationToken: undefined }) as const,
        ),
      );

      if (objects.Contents && objects.Contents.length > 0) {
        yield* deleteObjects({
          Bucket: bucket,
          Delete: {
            Objects: objects.Contents.map((o) => ({ Key: o.Key! })),
          },
        }).pipe(Effect.ignore);
      }

      token = objects.NextContinuationToken;
    } while (token);
  });

// Clean up bucket completely
const cleanupBucket = (bucket: string) =>
  Effect.gen(function* () {
    const exists = yield* headBucket({ Bucket: bucket }).pipe(
      Effect.map(() => true),
      Effect.catchAll(() => Effect.succeed(false)),
    );

    if (!exists) return;

    yield* emptyBucket(bucket);
    yield* deleteBucket({ Bucket: bucket }).pipe(Effect.ignore);
  });

// ============================================================================
// Firehose Delivery Stream Helpers
// ============================================================================

// Wait for delivery stream to become active
const waitForStreamActive = (streamName: string) =>
  describeDeliveryStream({ DeliveryStreamName: streamName }).pipe(
    Effect.tapError(Effect.logDebug),
    Effect.catchTag("ResourceNotFoundException", () =>
      Effect.fail(new NotReady({ status: undefined })),
    ),
    Effect.flatMap((result) => {
      const status = result.DeliveryStreamDescription?.DeliveryStreamStatus;
      if (status === "ACTIVE") {
        return Effect.succeed(result);
      }
      return Effect.fail(new NotReady({ status }));
    }),
    Effect.retry({
      while: (err) =>
        err instanceof NotReady && err.status !== "DELETING_FAILED",
      schedule: Schedule.exponential("1 second", 1.5).pipe(
        Schedule.union(Schedule.spaced("10 seconds")),
        Schedule.intersect(Schedule.recurs(60)),
      ),
    }),
    Effect.mapError(() => new StreamNotActive()),
  );

// Wait for delivery stream to be deleted
const waitForStreamDeleted = (streamName: string) =>
  describeDeliveryStream({ DeliveryStreamName: streamName }).pipe(
    Effect.flatMap((result) => {
      const status = result.DeliveryStreamDescription?.DeliveryStreamStatus;
      return Effect.logDebug(`Stream still exists with status: ${status}`).pipe(
        Effect.flatMap(() => Effect.fail(new StillExists())),
      );
    }),
    Effect.catchTag("ResourceNotFoundException", () => Effect.void),
    Effect.retry({
      while: (err) => err instanceof StillExists,
      schedule: Schedule.exponential("1 second", 1.5).pipe(
        Schedule.union(Schedule.spaced("10 seconds")),
        Schedule.intersect(Schedule.recurs(60)),
      ),
    }),
    Effect.mapError(() => new StreamNotDeleted()),
  );

// Clean up a delivery stream
const cleanupDeliveryStream = (streamName: string) =>
  Effect.gen(function* () {
    yield* deleteDeliveryStream({
      DeliveryStreamName: streamName,
      AllowForceDelete: true,
    }).pipe(Effect.ignore);
    yield* waitForStreamDeleted(streamName).pipe(Effect.ignore);
  });

// ============================================================================
// Main Test Helper - withDeliveryStream
// ============================================================================

interface DeliveryStreamContext {
  streamName: string;
  streamArn: string;
  bucketName: string;
  bucketArn: string;
  roleName: string;
  roleArn: string;
}

// Create a delivery stream with all dependencies and ensure cleanup
const withDeliveryStream = <A, E, R>(
  testName: string,
  testFn: (ctx: DeliveryStreamContext) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    const streamName = `distilled-firehose-${testName}`;
    const bucketName = `distilled-firehose-${testName}`;
    const roleName = `distilled-firehose-${testName}-role`;

    // Verify we have valid credentials before proceeding
    yield* getCallerIdentity({});
    const bucketArn = `arn:aws:s3:::${bucketName}`;

    // 1. Clean up any leftover resources from previous runs
    yield* cleanupDeliveryStream(streamName);
    yield* cleanupBucket(bucketName);
    yield* cleanupRole(roleName);

    // 2. Create S3 bucket
    yield* createBucket({ Bucket: bucketName });

    // 3. Create IAM role with S3 permissions
    const roleArn = yield* createFirehoseRole(roleName, bucketArn);

    // 4. Create delivery stream
    yield* createDeliveryStream({
      DeliveryStreamName: streamName,
      ExtendedS3DestinationConfiguration: {
        RoleARN: roleArn,
        BucketARN: bucketArn,
        BufferingHints: {
          IntervalInSeconds: 60,
          SizeInMBs: 1,
        },
      },
    }).pipe(
      // Retry if role hasn't propagated yet
      Effect.retry({
        while: (err) =>
          err._tag === "InvalidArgumentException" &&
          err.message?.includes("role"),
        schedule: Schedule.spaced("5 seconds").pipe(
          Schedule.intersect(Schedule.recurs(6)),
        ),
      }),
    );

    // 5. Wait for stream to become active
    const describeResult = yield* waitForStreamActive(streamName);
    const streamArn =
      describeResult.DeliveryStreamDescription?.DeliveryStreamARN!;

    const ctx: DeliveryStreamContext = {
      streamName,
      streamArn,
      bucketName,
      bucketArn,
      roleName,
      roleArn,
    };

    // 6. Run the test with cleanup on completion or failure
    return yield* testFn(ctx).pipe(
      Effect.ensuring(
        Effect.gen(function* () {
          yield* cleanupDeliveryStream(streamName);
          yield* cleanupBucket(bucketName);
          yield* cleanupRole(roleName);
        }),
      ),
    );
  });

// ============================================================================
// Basic Lifecycle Tests
// ============================================================================

test(
  "create stream, describe, list, and delete",
  { timeout: 300_000 },
  withDeliveryStream("lifecycle", (ctx) =>
    Effect.gen(function* () {
      // Describe stream
      const describeResult = yield* describeDeliveryStream({
        DeliveryStreamName: ctx.streamName,
      });
      expect(
        describeResult.DeliveryStreamDescription?.DeliveryStreamName,
      ).toEqual(ctx.streamName);
      expect(
        describeResult.DeliveryStreamDescription?.DeliveryStreamStatus,
      ).toEqual("ACTIVE");
      expect(
        describeResult.DeliveryStreamDescription?.DeliveryStreamARN,
      ).toBeDefined();

      // List streams and verify our stream is in the list
      const listResult = yield* listDeliveryStreams({});
      const foundStream = listResult.DeliveryStreamNames?.find(
        (name) => name === ctx.streamName,
      );
      expect(foundStream).toBeDefined();
    }),
  ),
);

// ============================================================================
// Put Record Tests
// ============================================================================

test(
  "putRecord sends data to stream",
  { timeout: 300_000 },
  withDeliveryStream("putrecord", (ctx) =>
    Effect.gen(function* () {
      const testData = JSON.stringify({ message: "Hello, Firehose!", id: 1 });

      // Put a record
      const putResult = yield* putRecord({
        DeliveryStreamName: ctx.streamName,
        Record: {
          Data: new TextEncoder().encode(testData),
        },
      });

      // Verify we got a record ID back
      expect(putResult.RecordId).toBeDefined();
    }),
  ),
);

test(
  "putRecordBatch sends multiple records to stream",
  { timeout: 300_000 },
  withDeliveryStream("putrecordbatch", (ctx) =>
    Effect.gen(function* () {
      const records = [
        { message: "Record 1", id: 1 },
        { message: "Record 2", id: 2 },
        { message: "Record 3", id: 3 },
      ];

      // Put multiple records in a batch
      const putResult = yield* putRecordBatch({
        DeliveryStreamName: ctx.streamName,
        Records: records.map((r) => ({
          Data: new TextEncoder().encode(JSON.stringify(r)),
        })),
      });

      // Verify all records were accepted
      expect(putResult.FailedPutCount).toEqual(0);
      expect(putResult.RequestResponses?.length).toEqual(records.length);

      // Each response should have a RecordId
      for (const response of putResult.RequestResponses ?? []) {
        expect(response.RecordId).toBeDefined();
      }
    }),
  ),
);

// ============================================================================
// Tagging Tests
// ============================================================================

test(
  "tag stream, list tags, and untag stream",
  { timeout: 300_000 },
  withDeliveryStream("tagging", (ctx) =>
    Effect.gen(function* () {
      // Add tags to stream
      yield* tagDeliveryStream({
        DeliveryStreamName: ctx.streamName,
        Tags: [
          { Key: "Environment", Value: "Test" },
          { Key: "Project", Value: "distilled-aws" },
          { Key: "Team", Value: "Platform" },
        ],
      });

      // List tags and verify
      const tagsResult = yield* listTagsForDeliveryStream({
        DeliveryStreamName: ctx.streamName,
      });
      expect(tagsResult.Tags?.length).toEqual(3);

      const envTag = tagsResult.Tags?.find((t) => t.Key === "Environment");
      expect(envTag?.Value).toEqual("Test");

      const projectTag = tagsResult.Tags?.find((t) => t.Key === "Project");
      expect(projectTag?.Value).toEqual("distilled-aws");

      // Update a tag
      yield* tagDeliveryStream({
        DeliveryStreamName: ctx.streamName,
        Tags: [{ Key: "Environment", Value: "Production" }],
      });

      // Verify update
      const updatedTags = yield* listTagsForDeliveryStream({
        DeliveryStreamName: ctx.streamName,
      });
      const updatedEnvTag = updatedTags.Tags?.find(
        (t) => t.Key === "Environment",
      );
      expect(updatedEnvTag?.Value).toEqual("Production");

      // Remove a tag
      yield* untagDeliveryStream({
        DeliveryStreamName: ctx.streamName,
        TagKeys: ["Project"],
      });

      // Verify tag removal
      const finalTags = yield* listTagsForDeliveryStream({
        DeliveryStreamName: ctx.streamName,
      });
      const projectTagRemoved = finalTags.Tags?.find(
        (t) => t.Key === "Project",
      );
      expect(projectTagRemoved).toBeUndefined();

      // Environment and Team should still exist
      const remainingEnvTag = finalTags.Tags?.find(
        (t) => t.Key === "Environment",
      );
      expect(remainingEnvTag?.Value).toEqual("Production");
    }),
  ),
);

// ============================================================================
// List Delivery Streams Tests
// ============================================================================

test(
  "listDeliveryStreams returns stream names",
  Effect.gen(function* () {
    // List delivery streams
    const result = yield* listDeliveryStreams({ Limit: 10 });

    // Should return a result with DeliveryStreamNames array
    expect(result.DeliveryStreamNames).toBeDefined();
    expect(Array.isArray(result.DeliveryStreamNames)).toBe(true);

    // HasMoreDeliveryStreams should be a boolean
    expect(typeof result.HasMoreDeliveryStreams).toBe("boolean");
  }),
);
