/**
 * CloudFront Service Tests
 *
 * IMPORTANT: These tests require a real AWS account.
 * CloudFront is NOT available in LocalStack Community edition.
 * Tests will skip when running in LocalStack.
 */

import { expect } from "@effect/vitest";
import { Effect, Option, Redacted, Stream } from "effect";
import {
  createDistribution,
  createInvalidation,
  createOriginAccessControl,
  deleteDistribution,
  deleteOriginAccessControl,
  DistributionAlreadyExists,
  getDistribution,
  getDistributionConfig,
  getOriginAccessControl,
  listDistributions,
  listInvalidations,
  listOriginAccessControls,
  listTagsForResource,
  OriginAccessControlAlreadyExists,
  tagResource,
  untagResource,
  updateOriginAccessControl,
} from "../../src/services/cloudfront.ts";
import { test } from "../test.ts";

// Skip tests in LocalStack - CloudFront not available in Community edition
const isLocalStack = process.env.LOCAL === "true" || process.env.LOCAL === "1";

// ============================================================================
// Idempotent Resource Helpers
// ============================================================================

/**
 * Find an existing Origin Access Control by name
 */
const findOriginAccessControlByName = (name: string) =>
  Effect.gen(function* () {
    const list = yield* listOriginAccessControls({});
    const existing = list.OriginAccessControlList?.Items?.find(
      (oac) => oac.Name === name,
    );
    if (existing) {
      const result = yield* getOriginAccessControl({ Id: existing.Id! });
      return Option.some({
        id: result.OriginAccessControl!.Id!,
        etag: result.ETag!,
      });
    }
    return Option.none();
  });

/**
 * Delete an Origin Access Control by ID, fetching the latest ETag first
 */
const deleteOriginAccessControlById = (id: string) =>
  getOriginAccessControl({ Id: id }).pipe(
    Effect.flatMap((r) =>
      deleteOriginAccessControl({ Id: id, IfMatch: r.ETag! }),
    ),
    Effect.ignore,
  );

/**
 * Idempotent helper for Origin Access Control - creates or reuses existing
 */
const withOriginAccessControl = <A, E, R>(
  name: string,
  testFn: (id: string, etag: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Try to create, or find existing if already exists
    const { id, etag } = yield* createOriginAccessControl({
      OriginAccessControlConfig: {
        Name: name,
        Description: "Test OAC for distilled-aws",
        SigningProtocol: "sigv4",
        SigningBehavior: "always",
        OriginAccessControlOriginType: "s3",
      },
    }).pipe(
      Effect.map((result) => ({
        id: result.OriginAccessControl!.Id!,
        etag: result.ETag!,
      })),
      Effect.catchTag("OriginAccessControlAlreadyExists", () =>
        findOriginAccessControlByName(name).pipe(
          Effect.flatMap(
            Option.match({
              onNone: () =>
                Effect.fail(
                  new OriginAccessControlAlreadyExists({
                    Message: `OAC "${name}" exists but could not be found`,
                  }),
                ),
              onSome: Effect.succeed,
            }),
          ),
        ),
      ),
    );

    return yield* testFn(id, etag).pipe(
      Effect.ensuring(deleteOriginAccessControlById(id)),
    );
  });

/**
 * Find an existing Distribution by CallerReference
 */
const findDistributionByCallerReference = (callerReference: string) =>
  Effect.gen(function* () {
    const list = yield* listDistributions({});
    // DistributionSummary doesn't include CallerReference, so we need to check each one
    for (const dist of list.DistributionList?.Items ?? []) {
      const config = yield* getDistributionConfig({ Id: dist.Id! });
      if (config.DistributionConfig?.CallerReference === callerReference) {
        const result = yield* getDistribution({ Id: dist.Id! });
        return Option.some({
          id: result.Distribution!.Id!,
          etag: result.ETag!,
          arn: result.Distribution!.ARN!,
        });
      }
    }
    return Option.none();
  });

/**
 * Delete a Distribution by ID, fetching the latest ETag first
 */
const deleteDistributionById = (id: string) =>
  getDistribution({ Id: id }).pipe(
    Effect.flatMap((r) => deleteDistribution({ Id: id, IfMatch: r.ETag! })),
    Effect.ignore,
  );

/**
 * Idempotent helper for Distribution - creates or reuses existing
 */
const withDistribution = <A, E, R>(
  callerReference: string,
  testFn: (id: string, etag: string, arn: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Try to create, or find existing if already exists
    const { id, etag, arn } = yield* createDistribution({
      DistributionConfig: {
        CallerReference: callerReference,
        Comment: "distilled-aws test distribution",
        Enabled: false, // Disabled for testing
        Origins: {
          Quantity: 1,
          Items: [
            {
              Id: "test-origin",
              DomainName: "example.com",
              CustomOriginConfig: {
                HTTPPort: 80,
                HTTPSPort: 443,
                OriginProtocolPolicy: "https-only",
              },
            },
          ],
        },
        DefaultCacheBehavior: {
          TargetOriginId: "test-origin",
          ViewerProtocolPolicy: "redirect-to-https",
          CachePolicyId: "658327ea-f89d-4fab-a63d-7e88639e58f6", // CachingOptimized managed policy
        },
      },
    }).pipe(
      Effect.map((result) => ({
        id: result.Distribution!.Id!,
        etag: result.ETag!,
        arn: result.Distribution!.ARN!,
      })),
      Effect.catchTag("DistributionAlreadyExists", () =>
        findDistributionByCallerReference(callerReference).pipe(
          Effect.flatMap(
            Option.match({
              onNone: () =>
                Effect.fail(
                  new DistributionAlreadyExists({
                    Message: `Distribution "${callerReference}" exists but could not be found`,
                  }),
                ),
              onSome: Effect.succeed,
            }),
          ),
        ),
      ),
    );

    return yield* testFn(id, etag, arn).pipe(
      Effect.ensuring(deleteDistributionById(id)),
    );
  });

// ============================================================================
// Origin Access Control Tests
// ============================================================================

test(
  "create origin access control, get, list, and delete",
  Effect.gen(function* () {
    if (isLocalStack) {
      yield* Effect.logInfo(
        "Skipping test: CloudFront not available in LocalStack",
      );
      return;
    }

    yield* withOriginAccessControl("distilled-cf-oac-lifecycle", (id, _etag) =>
      Effect.gen(function* () {
        // Get origin access control to verify it exists
        const oac = yield* getOriginAccessControl({ Id: id });
        expect(oac.OriginAccessControl?.Id).toEqual(id);
        expect(
          oac.OriginAccessControl?.OriginAccessControlConfig?.Name,
        ).toEqual("distilled-cf-oac-lifecycle");

        // List origin access controls
        const listResult = yield* listOriginAccessControls({});
        const foundOac = listResult.OriginAccessControlList?.Items?.find(
          (o) => o.Id === id,
        );
        expect(foundOac).toBeDefined();
      }),
    );
  }),
);

test(
  "update origin access control",
  Effect.gen(function* () {
    if (isLocalStack) {
      yield* Effect.logInfo(
        "Skipping test: CloudFront not available in LocalStack",
      );
      return;
    }

    yield* withOriginAccessControl("distilled-cf-oac-update", (id, etag) =>
      Effect.gen(function* () {
        // Update the OAC - keep the same name to avoid conflicts with previous runs
        const updateResult = yield* updateOriginAccessControl({
          Id: id,
          IfMatch: etag,
          OriginAccessControlConfig: {
            Name: "distilled-cf-oac-update", // Same name - only update description
            Description: "Updated description",
            SigningProtocol: "sigv4",
            SigningBehavior: "always",
            OriginAccessControlOriginType: "s3",
          },
        });

        expect(
          updateResult.OriginAccessControl?.OriginAccessControlConfig?.Name,
        ).toEqual("distilled-cf-oac-update");
        expect(
          updateResult.OriginAccessControl?.OriginAccessControlConfig
            ?.Description,
        ).toEqual("Updated description");

        // Verify by getting it again
        const getResult = yield* getOriginAccessControl({ Id: id });
        expect(
          getResult.OriginAccessControl?.OriginAccessControlConfig?.Description,
        ).toEqual("Updated description");
      }),
    );
  }),
);

// ============================================================================
// Distribution Tests
// ============================================================================

test(
  "create distribution, get, list, and delete",
  Effect.gen(function* () {
    if (isLocalStack) {
      yield* Effect.logInfo(
        "Skipping test: CloudFront not available in LocalStack",
      );
      return;
    }

    yield* withDistribution("distilled-cf-dist-lifecycle", (id, _etag, _arn) =>
      Effect.gen(function* () {
        // Get distribution to verify it exists
        const dist = yield* getDistribution({ Id: id });
        expect(dist.Distribution?.Id).toEqual(id);
        // Comment is a sensitive field, extract from Redacted
        const comment = dist.Distribution?.DistributionConfig?.Comment;
        expect(
          Redacted.isRedacted(comment) ? Redacted.value(comment) : comment,
        ).toEqual("distilled-aws test distribution");

        // Get distribution config
        const config = yield* getDistributionConfig({ Id: id });
        expect(config.DistributionConfig?.Enabled).toBe(false);

        // List distributions
        const listResult = yield* listDistributions({});
        const foundDist = listResult.DistributionList?.Items?.find(
          (d) => d.Id === id,
        );
        expect(foundDist).toBeDefined();
      }),
    );
  }),
);

// ============================================================================
// Invalidation Tests
// ============================================================================

test(
  "create invalidation and list invalidations",
  Effect.gen(function* () {
    if (isLocalStack) {
      yield* Effect.logInfo(
        "Skipping test: CloudFront not available in LocalStack",
      );
      return;
    }

    yield* withDistribution("distilled-cf-invalidation", (id, _etag, _arn) =>
      Effect.gen(function* () {
        // Create an invalidation
        const invalidation = yield* createInvalidation({
          DistributionId: id,
          InvalidationBatch: {
            CallerReference: "distilled-cf-invalidation-batch",
            Paths: {
              Quantity: 1,
              Items: ["/*"],
            },
          },
        });

        expect(invalidation.Invalidation?.Id).toBeDefined();
        expect(invalidation.Invalidation?.Status).toBeDefined();

        // List invalidations
        const listResult = yield* listInvalidations({
          DistributionId: id,
        });

        const foundInvalidation = listResult.InvalidationList?.Items?.find(
          (i) => i.Id === invalidation.Invalidation!.Id,
        );
        expect(foundInvalidation).toBeDefined();
      }),
    );
  }),
);

// ============================================================================
// Tagging Tests
// ============================================================================

test(
  "tag and untag distribution",
  Effect.gen(function* () {
    if (isLocalStack) {
      yield* Effect.logInfo(
        "Skipping test: CloudFront not available in LocalStack",
      );
      return;
    }

    yield* withDistribution("distilled-cf-tagging", (_id, _etag, arn) =>
      Effect.gen(function* () {
        // Add tags
        yield* tagResource({
          Resource: arn,
          Tags: {
            Items: [
              { Key: "Environment", Value: "Test" },
              { Key: "Project", Value: "distilled-aws" },
            ],
          },
        });

        // List tags
        const tags = yield* listTagsForResource({ Resource: arn });
        expect(tags.Tags?.Items?.length).toBeGreaterThanOrEqual(2);

        const envTag = tags.Tags?.Items?.find((t) => t.Key === "Environment");
        expect(envTag?.Value).toEqual("Test");

        // Remove a tag
        yield* untagResource({
          Resource: arn,
          TagKeys: {
            Items: ["Environment"],
          },
        });

        // Verify tag removed
        const tagsAfter = yield* listTagsForResource({ Resource: arn });
        const envTagAfter = tagsAfter.Tags?.Items?.find(
          (t) => t.Key === "Environment",
        );
        expect(envTagAfter).toBeUndefined();

        // Project tag should still exist
        const projectTag = tagsAfter.Tags?.Items?.find(
          (t) => t.Key === "Project",
        );
        expect(projectTag?.Value).toEqual("distilled-aws");
      }),
    );
  }),
);

// ============================================================================
// Pagination Stream Tests
// ============================================================================

test(
  "listDistributions.pages() streams full response pages with nested items",
  Effect.gen(function* () {
    // CloudFront uses nested paths (DistributionList.Items) so we use .pages()
    // and extract distributions from the nested structure
    const distributions = yield* listDistributions.pages({}).pipe(
      Stream.flatMap((page) =>
        Stream.fromIterable(page.DistributionList?.Items ?? []),
      ),
      Stream.runCollect,
    );

    const distArray = Array.from(distributions);

    // Each item should be a DistributionSummary with Id and ARN
    for (const dist of distArray) {
      expect(dist.Id).toBeDefined();
      expect(dist.ARN).toBeDefined();
    }
  }),
);
