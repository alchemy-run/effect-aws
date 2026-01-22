import { describe, expect } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as R2 from "~/services/r2.ts";
import { getAccountId, test } from "../../test.ts";

const BUCKET_NAME = "distilled-cf-r2-listbucketdomainmanageds";

/**
 * Helper to run a test with a bucket.
 * - Cleans up first (deletes bucket if exists)
 * - Creates the bucket
 * - Runs the test function
 * - Cleans up in finally block using Effect.ensuring()
 */
const withBucket = <A, E, R>(
  name: string,
  fn: (bucketName: string) => Effect.Effect<A, E, R>,
): Effect.Effect<A, E | R2.InvalidBucketName | R2.BucketAlreadyExists, R> =>
  Effect.gen(function* () {
    const accountId = getAccountId();

    // Cleanup first (ignore errors)
    yield* R2.deleteBucket({ accountId, bucketName: name }).pipe(
      Effect.catchAll(() => Effect.void),
    );

    // Create bucket
    yield* R2.createBucket({ accountId, name });

    // Run test with cleanup in finally
    return yield* fn(name).pipe(
      Effect.ensuring(
        R2.deleteBucket({ accountId, bucketName: name }).pipe(
          Effect.catchAll(() => Effect.void),
        ),
      ),
    );
  });

describe("r2/listBucketDomainManageds", () => {
  describe("success", () => {
    test("returns managed domain info for existing bucket", () =>
      withBucket(BUCKET_NAME, (bucketName) =>
        Effect.gen(function* () {
          const accountId = getAccountId();

          const result = yield* R2.listBucketDomainManageds({
            accountId,
            bucketName,
          });

          expect(result.bucketId).toBeDefined();
          expect(typeof result.bucketId).toBe("string");
          expect(result.bucketId.length).toBeGreaterThan(0);
          expect(result.domain).toBeDefined();
          expect(result.domain).toContain(".r2.dev");
          expect(typeof result.enabled).toBe("boolean");
        }),
      ));

    test("works with explicit jurisdiction header", () =>
      withBucket(BUCKET_NAME, (bucketName) =>
        Effect.gen(function* () {
          const accountId = getAccountId();

          const result = yield* R2.listBucketDomainManageds({
            accountId,
            bucketName,
            jurisdiction: "default",
          });

          expect(result.bucketId).toBeDefined();
          expect(result.domain).toContain(".r2.dev");
          expect(typeof result.enabled).toBe("boolean");
        }),
      ));
  });

  describe("errors", () => {
    test("NoSuchBucket - bucket does not exist", () =>
      Effect.gen(function* () {
        const accountId = getAccountId();
        const nonExistentBucket = "distilled-cf-r2-nonexistent-bucket-xyz";

        // Ensure bucket doesn't exist
        yield* R2.deleteBucket({
          accountId,
          bucketName: nonExistentBucket,
        }).pipe(Effect.catchAll(() => Effect.void));

        const result = yield* R2.listBucketDomainManageds({
          accountId,
          bucketName: nonExistentBucket,
        }).pipe(Effect.flip);

        expect(result._tag).toBe("NoSuchBucket");
      }));

    test("InvalidBucketName - malformed bucket name", () =>
      Effect.gen(function* () {
        const accountId = getAccountId();
        const invalidBucketName = "INVALID_BUCKET_NAME!!!";

        const result = yield* R2.listBucketDomainManageds({
          accountId,
          bucketName: invalidBucketName,
        }).pipe(Effect.flip);

        expect(result._tag).toBe("InvalidBucketName");
      }));
  });
});
