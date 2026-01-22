import { describe, expect } from "@effect/vitest";
import * as Effect from "effect/Effect";
import {
  createBucket,
  deleteBucket,
  BucketAlreadyExists,
  InvalidBucketName,
} from "~/services/r2.ts";
import { getAccountId, test } from "../../test.ts";

const BUCKET_NAME = "itty-cf-r2-createbucket";

/**
 * Cleanup helper - deletes a bucket, ignoring errors if it doesn't exist
 */
const cleanup = (bucketName: string) =>
  deleteBucket({
    accountId: getAccountId(),
    bucketName,
  }).pipe(Effect.catchAll(() => Effect.void));

/**
 * Helper to run a test with a bucket, ensuring cleanup before and after
 */
const withBucket = <A, E, R>(
  bucketName: string,
  fn: (bucketName: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Cleanup any leftover from previous runs
    yield* cleanup(bucketName);
    // Create the bucket
    yield* createBucket({ accountId: getAccountId(), name: bucketName });
    // Run test
    return yield* fn(bucketName);
  }).pipe(Effect.ensuring(cleanup(bucketName)));

describe("r2/createBucket", () => {
  describe("success", () => {
    test("creates a bucket with minimal parameters", () =>
      Effect.gen(function* () {
        yield* cleanup(BUCKET_NAME);
        const result = yield* createBucket({
          accountId: getAccountId(),
          name: BUCKET_NAME,
        });
        expect(result.name).toBe(BUCKET_NAME);
        expect(result.creationDate).toBeDefined();
        expect(result.storageClass).toBe("Standard");
      }).pipe(Effect.ensuring(cleanup(BUCKET_NAME))));

    test("creates a bucket with locationHint parameter", () =>
      Effect.gen(function* () {
        const bucketName = `${BUCKET_NAME}-loc`;
        yield* cleanup(bucketName);
        const result = yield* createBucket({
          accountId: getAccountId(),
          name: bucketName,
          locationHint: "wnam",
        });
        expect(result.name).toBe(bucketName);
        expect(result.location).toBeDefined();
      }).pipe(Effect.ensuring(cleanup(`${BUCKET_NAME}-loc`))));

    test("creates a bucket with InfrequentAccess storageClass", () =>
      Effect.gen(function* () {
        const bucketName = `${BUCKET_NAME}-ia`;
        yield* cleanup(bucketName);
        const result = yield* createBucket({
          accountId: getAccountId(),
          name: bucketName,
          storageClass: "InfrequentAccess",
        });
        expect(result.name).toBe(bucketName);
        expect(result.storageClass).toBe("InfrequentAccess");
      }).pipe(Effect.ensuring(cleanup(`${BUCKET_NAME}-ia`))));

    test("creates a bucket with EU jurisdiction", () =>
      Effect.gen(function* () {
        const bucketName = `${BUCKET_NAME}-eu`;
        yield* cleanup(bucketName);
        yield* deleteBucket({
          accountId: getAccountId(),
          bucketName,
          jurisdiction: "eu",
        }).pipe(Effect.catchAll(() => Effect.void));
        const result = yield* createBucket({
          accountId: getAccountId(),
          name: bucketName,
          jurisdiction: "eu",
        });
        expect(result.name).toBe(bucketName);
        expect(result.jurisdiction).toBe("eu");
      }).pipe(
        Effect.ensuring(
          deleteBucket({
            accountId: getAccountId(),
            bucketName: `${BUCKET_NAME}-eu`,
            jurisdiction: "eu",
          }).pipe(Effect.catchAll(() => Effect.void)),
        ),
      ));
  });

  describe("BucketAlreadyExists", () => {
    test("fails when creating a bucket that already exists", () =>
      withBucket(`${BUCKET_NAME}-dup`, (bucketName) =>
        createBucket({
          accountId: getAccountId(),
          name: bucketName,
        }).pipe(
          Effect.flip,
          Effect.map((e) => {
            expect(e._tag).toBe("BucketAlreadyExists");
          }),
        ),
      ));
  });

  describe("InvalidBucketName", () => {
    test("fails with uppercase letters in bucket name", () =>
      createBucket({
        accountId: getAccountId(),
        name: "INVALID-BUCKET-NAME",
      }).pipe(
        Effect.flip,
        Effect.map((e) => {
          expect(e._tag).toBe("InvalidBucketName");
        }),
      ));

    test("fails with bucket name too short", () =>
      createBucket({
        accountId: getAccountId(),
        name: "ab",
      }).pipe(
        Effect.flip,
        Effect.map((e) => {
          expect(e._tag).toBe("InvalidBucketName");
        }),
      ));
  });
});
