import { describe, expect } from "@effect/vitest";
import * as Effect from "effect/Effect";
import {
  createBucket,
  deleteBucket,
  putBucketDomainManaged,
  NoSuchBucket,
  InvalidBucketName,
} from "~/services/r2.ts";
import { getAccountId, test } from "../../test.ts";

const BUCKET_NAME = "distilled-cf-r2-putbucketdomainmanaged";

/**
 * Helper to cleanup a bucket, ignoring any errors
 */
const cleanup = (name: string) =>
  deleteBucket({
    accountId: getAccountId(),
    bucketName: name,
  }).pipe(Effect.catchAll(() => Effect.void));

/**
 * Helper to run a test with a bucket, ensuring cleanup before and after
 */
const withBucket = <A, E, R>(
  name: string,
  fn: (bucketName: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Cleanup first (idempotent)
    yield* cleanup(name);
    // Create bucket - ignore result as schema may not match exactly
    yield* createBucket({ accountId: getAccountId(), name }).pipe(
      Effect.catchAll(() => Effect.void),
    );
    // Run the test
    return yield* fn(name);
  }).pipe(Effect.ensuring(cleanup(name)));

describe("r2/putBucketDomainManaged", () => {
  describe("success", () => {
    test("enables managed domain on bucket", () =>
      withBucket(BUCKET_NAME, (bucketName) =>
        Effect.gen(function* () {
          const result = yield* putBucketDomainManaged({
            accountId: getAccountId(),
            bucketName,
            enabled: true,
          });

          expect(result.bucketId).toBeDefined();
          expect(typeof result.bucketId).toBe("string");
          expect(result.domain).toContain(".r2.dev");
          expect(result.enabled).toBe(true);
        }),
      ));

    test("disables managed domain on bucket", () =>
      withBucket(BUCKET_NAME, (bucketName) =>
        Effect.gen(function* () {
          // First enable
          yield* putBucketDomainManaged({
            accountId: getAccountId(),
            bucketName,
            enabled: true,
          });

          // Then disable
          const result = yield* putBucketDomainManaged({
            accountId: getAccountId(),
            bucketName,
            enabled: false,
          });

          expect(result.enabled).toBe(false);
        }),
      ));

    test("returns correct domain format", () =>
      withBucket(BUCKET_NAME, (bucketName) =>
        Effect.gen(function* () {
          const result = yield* putBucketDomainManaged({
            accountId: getAccountId(),
            bucketName,
            enabled: true,
          });

          expect(result.domain).toContain(".r2.dev");
          expect(typeof result.domain).toBe("string");
          expect(result.domain.length).toBeGreaterThan(0);
        }),
      ));
  });

  describe("errors", () => {
    test("NoSuchBucket - bucket does not exist", () =>
      putBucketDomainManaged({
        accountId: getAccountId(),
        bucketName: "distilled-cf-r2-nonexistent-bucket-xyz",
        enabled: true,
      }).pipe(
        Effect.flip,
        Effect.map((e) => {
          expect(e._tag).toBe("NoSuchBucket");
          expect(e).toBeInstanceOf(NoSuchBucket);
        }),
      ));

    test("InvalidBucketName - malformed bucket name", () =>
      putBucketDomainManaged({
        accountId: getAccountId(),
        bucketName: "INVALID_BUCKET_NAME!!!",
        enabled: true,
      }).pipe(
        Effect.flip,
        Effect.map((e) => {
          expect(e._tag).toBe("InvalidBucketName");
          expect(e).toBeInstanceOf(InvalidBucketName);
        }),
      ));
  });
});
