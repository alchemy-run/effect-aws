import { describe, expect } from "@effect/vitest";
import * as Effect from "effect/Effect";
import { createBucketDomainCustom } from "~/services/r2.ts";
import { getAccountId, test } from "../../test.ts";

describe("r2/createBucketDomainCustom", () => {
  describe("errors", () => {
    test("NoSuchBucket - bucket does not exist", () =>
      createBucketDomainCustom({
        accountId: getAccountId(),
        bucketName: "distilled-cf-r2-nonexistent-bucket-xyz",
        domain: "test.example.com",
        enabled: true,
        zoneId: "00000000000000000000000000000000",
      }).pipe(
        Effect.flip,
        Effect.map((e) => {
          expect(e._tag).toBe("NoSuchBucket");
        }),
      ));

    test("InvalidBucketName - malformed bucket name", () =>
      createBucketDomainCustom({
        accountId: getAccountId(),
        bucketName: "INVALID_BUCKET_NAME!!!",
        domain: "test.example.com",
        enabled: true,
        zoneId: "00000000000000000000000000000000",
      }).pipe(
        Effect.flip,
        Effect.map((e) => {
          expect(e._tag).toBe("InvalidBucketName");
        }),
      ));
  });
});
