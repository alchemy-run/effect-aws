import { expect } from "@effect/vitest";
import { Effect, Stream } from "effect";
import {
  // Multipart upload operations
  abortMultipartUpload,
  completeMultipartUpload,
  // Bucket lifecycle operations
  createBucket,
  createMultipartUpload,
  deleteBucket,
  deleteBucketCors,
  deleteBucketEncryption,
  deleteBucketLifecycle,
  deleteBucketOwnershipControls,
  deleteBucketPolicy,
  deleteBucketTagging,
  deleteBucketWebsite,
  deleteObject,
  deletePublicAccessBlock,
  getBucketAccelerateConfiguration,
  // ACL
  getBucketAcl,
  getBucketCors,
  getBucketEncryption,
  getBucketLifecycleConfiguration,
  getBucketLocation,
  getBucketOwnershipControls,
  getBucketPolicy,
  getBucketRequestPayment,
  getBucketTagging,
  getBucketVersioning,
  getBucketWebsite,
  // Object operations
  getObject,
  getPublicAccessBlock,
  headBucket,
  listBuckets,
  // Accelerate Configuration
  putBucketAccelerateConfiguration,
  // CORS
  putBucketCors,
  // Encryption
  putBucketEncryption,
  // Lifecycle
  putBucketLifecycleConfiguration,
  // Ownership Controls
  putBucketOwnershipControls,
  // Policy
  putBucketPolicy,
  // Request Payment
  putBucketRequestPayment,
  // Tagging
  putBucketTagging,
  // Versioning
  putBucketVersioning,
  // Website
  putBucketWebsite,
  putObject,
  // Public Access Block
  putPublicAccessBlock,
  uploadPart,
} from "../../src/services/s3.ts";
import { test } from "../test.ts";

// Helper to ensure cleanup happens even on failure
function withBucket<A, E, R>(
  bucket: string,
  testFn: (bucket: string) => Effect.Effect<A, E, R>,
) {
  return Effect.gen(function* () {
    yield* createBucket({ Bucket: bucket });
    return yield* testFn(bucket).pipe(
      Effect.ensuring(deleteBucket({ Bucket: bucket }).pipe(Effect.ignore)),
    );
  });
}

// ============================================================================
// Bucket Lifecycle Tests
// ============================================================================

test(
  "create bucket, head bucket, get location, list buckets, and delete",
  withBucket("itty-s3-lifecycle", (bucket) =>
    Effect.gen(function* () {
      // Head bucket to verify it exists
      const headResult = yield* headBucket({ Bucket: bucket });
      // Should not throw - bucket exists

      // Get bucket location
      const locationResult = yield* getBucketLocation({ Bucket: bucket });
      // Location will be null for us-east-1, or the region name otherwise

      // List buckets and verify our bucket is in the list
      const listResult = yield* listBuckets({});
      const foundBucket = listResult.Buckets?.find((b) => b.Name === bucket);
      if (!foundBucket) {
        return yield* Effect.fail(new Error("Bucket not found in list"));
      }
    }),
  ),
);

// ============================================================================
// Tagging Tests
// ============================================================================

test(
  "bucket tagging: put, get, and delete tags",
  withBucket("itty-s3-tagging", (bucket) =>
    Effect.gen(function* () {
      // Put tags
      yield* putBucketTagging({
        Bucket: bucket,
        Tagging: {
          TagSet: [
            { Key: "Environment", Value: "Test" },
            { Key: "Project", Value: "itty-aws" },
            { Key: "Team", Value: "Platform" },
          ],
        },
      });

      // Get and verify tags
      const tags = yield* getBucketTagging({ Bucket: bucket });
      if (tags.TagSet?.length !== 3) {
        return yield* Effect.fail(
          new Error(`Expected 3 tags, got ${tags.TagSet?.length}`),
        );
      }

      const envTag = tags.TagSet?.find((t) => t.Key === "Environment");
      if (envTag?.Value !== "Test") {
        return yield* Effect.fail(
          new Error(`Expected Environment=Test, got ${envTag?.Value}`),
        );
      }

      // Update tags (replace all)
      yield* putBucketTagging({
        Bucket: bucket,
        Tagging: {
          TagSet: [{ Key: "UpdatedTag", Value: "NewValue" }],
        },
      });

      // Verify update
      const updatedTags = yield* getBucketTagging({ Bucket: bucket });
      if (updatedTags.TagSet?.length !== 1) {
        return yield* Effect.fail(
          new Error(
            `Expected 1 tag after update, got ${updatedTags.TagSet?.length}`,
          ),
        );
      }

      // Delete tags
      yield* deleteBucketTagging({ Bucket: bucket });

      // Verify deletion - should throw NoSuchTagSet error
      const result = yield* getBucketTagging({ Bucket: bucket }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      if (result !== "error") {
        return yield* Effect.fail(
          new Error("Expected error after deleting tags"),
        );
      }
    }),
  ),
);

// ============================================================================
// Bucket Policy Tests
// ============================================================================

test(
  "bucket policy: put, get, and delete policy",
  withBucket("itty-s3-policy", (bucket) =>
    Effect.gen(function* () {
      // First we need to get the bucket owner account ID
      // We'll construct a simple policy
      const policy = JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "TestStatement",
            Effect: "Deny",
            Principal: "*",
            Action: "s3:DeleteBucket",
            Resource: `arn:aws:s3:::${bucket}`,
            Condition: {
              StringNotEquals: {
                "aws:PrincipalAccount": "000000000000", // Dummy account that won't match
              },
            },
          },
        ],
      });

      // Put policy
      yield* putBucketPolicy({
        Bucket: bucket,
        Policy: policy,
      });

      // Get and verify policy
      const policyResult = yield* getBucketPolicy({ Bucket: bucket });
      if (!policyResult.Policy) {
        return yield* Effect.fail(new Error("Expected policy to be returned"));
      }

      const parsedPolicy = JSON.parse(policyResult.Policy!);
      if (parsedPolicy.Statement[0].Sid !== "TestStatement") {
        return yield* Effect.fail(new Error("Policy Sid mismatch"));
      }

      // Delete policy
      yield* deleteBucketPolicy({ Bucket: bucket });

      // Verify deletion
      const result = yield* getBucketPolicy({ Bucket: bucket }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      if (result !== "error") {
        return yield* Effect.fail(
          new Error("Expected error after deleting policy"),
        );
      }
    }),
  ),
);

// ============================================================================
// CORS Tests
// ============================================================================

test(
  "bucket CORS: put, get, and delete CORS configuration",
  withBucket("itty-s3-cors", (bucket) =>
    Effect.gen(function* () {
      // Put CORS configuration
      yield* putBucketCors({
        Bucket: bucket,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedMethods: ["GET", "PUT", "POST"],
              AllowedOrigins: [
                "https://example.com",
                "https://app.example.com",
              ],
              AllowedHeaders: ["*"],
              ExposeHeaders: ["ETag", "x-amz-meta-custom"],
              MaxAgeSeconds: 3600,
            },
            {
              AllowedMethods: ["GET"],
              AllowedOrigins: ["*"],
              MaxAgeSeconds: 86400,
            },
          ],
        },
      });

      // Get and verify CORS
      const corsResult = yield* getBucketCors({ Bucket: bucket });
      if (corsResult.CORSRules?.length !== 2) {
        return yield* Effect.fail(
          new Error(
            `Expected 2 CORS rules, got ${corsResult.CORSRules?.length}`,
          ),
        );
      }

      const firstRule = corsResult.CORSRules?.[0];
      if (!firstRule?.AllowedMethods?.includes("PUT")) {
        return yield* Effect.fail(new Error("Expected PUT in allowed methods"));
      }
      if (firstRule?.MaxAgeSeconds !== 3600) {
        return yield* Effect.fail(
          new Error(
            `Expected MaxAgeSeconds=3600, got ${firstRule?.MaxAgeSeconds}`,
          ),
        );
      }

      // Delete CORS
      yield* deleteBucketCors({ Bucket: bucket });

      // Verify deletion
      const result = yield* getBucketCors({ Bucket: bucket }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      if (result !== "error") {
        return yield* Effect.fail(
          new Error("Expected error after deleting CORS"),
        );
      }
    }),
  ),
);

// ============================================================================
// Versioning Tests
// ============================================================================

test(
  "bucket versioning: enable and suspend versioning",
  withBucket("itty-s3-versioning", (bucket) =>
    Effect.gen(function* () {
      // Initially, versioning is not enabled
      const initialVersioning = yield* getBucketVersioning({
        Bucket: bucket,
      });

      // Enable versioning
      yield* putBucketVersioning({
        Bucket: bucket,
        VersioningConfiguration: {
          Status: "Enabled",
        },
      });

      // Verify enabled
      const enabledVersioning = yield* getBucketVersioning({
        Bucket: bucket,
      });
      if (enabledVersioning.Status !== "Enabled") {
        return yield* Effect.fail(
          new Error(`Expected Status=Enabled, got ${enabledVersioning.Status}`),
        );
      }

      // Suspend versioning (can't disable once enabled, only suspend)
      yield* putBucketVersioning({
        Bucket: bucket,
        VersioningConfiguration: {
          Status: "Suspended",
        },
      });

      // Verify suspended
      const suspendedVersioning = yield* getBucketVersioning({
        Bucket: bucket,
      });
      if (suspendedVersioning.Status !== "Suspended") {
        return yield* Effect.fail(
          new Error(
            `Expected Status=Suspended, got ${suspendedVersioning.Status}`,
          ),
        );
      }
    }),
  ),
);

// ============================================================================
// Website Configuration Tests
// ============================================================================

test(
  "bucket website: put, get, and delete website configuration",
  withBucket("itty-s3-website", (bucket) =>
    Effect.gen(function* () {
      // Put website configuration
      yield* putBucketWebsite({
        Bucket: bucket,
        WebsiteConfiguration: {
          IndexDocument: {
            Suffix: "index.html",
          },
          ErrorDocument: {
            Key: "error.html",
          },
        },
      });

      // Get and verify website config
      const websiteResult = yield* getBucketWebsite({ Bucket: bucket });
      if (websiteResult.IndexDocument?.Suffix !== "index.html") {
        return yield* Effect.fail(
          new Error(
            `Expected IndexDocument.Suffix=index.html, got ${websiteResult.IndexDocument?.Suffix}`,
          ),
        );
      }
      if (websiteResult.ErrorDocument?.Key !== "error.html") {
        return yield* Effect.fail(
          new Error(
            `Expected ErrorDocument.Key=error.html, got ${websiteResult.ErrorDocument?.Key}`,
          ),
        );
      }

      // Update with routing rules
      yield* putBucketWebsite({
        Bucket: bucket,
        WebsiteConfiguration: {
          IndexDocument: {
            Suffix: "index.html",
          },
          RoutingRules: [
            {
              Condition: {
                KeyPrefixEquals: "docs/",
              },
              Redirect: {
                ReplaceKeyPrefixWith: "documents/",
              },
            },
          ],
        },
      });

      // Verify routing rules
      const updatedWebsite = yield* getBucketWebsite({ Bucket: bucket });
      if (updatedWebsite.RoutingRules?.length !== 1) {
        return yield* Effect.fail(
          new Error(
            `Expected 1 routing rule, got ${updatedWebsite.RoutingRules?.length}`,
          ),
        );
      }

      // Delete website config
      yield* deleteBucketWebsite({ Bucket: bucket });

      // Verify deletion
      const result = yield* getBucketWebsite({ Bucket: bucket }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      if (result !== "error") {
        return yield* Effect.fail(
          new Error("Expected error after deleting website config"),
        );
      }
    }),
  ),
);

// ============================================================================
// Encryption Tests
// ============================================================================

test(
  "bucket encryption: put, get, and delete encryption configuration",
  withBucket("itty-s3-encryption", (bucket) =>
    Effect.gen(function* () {
      // Put encryption configuration (SSE-S3)
      yield* putBucketEncryption({
        Bucket: bucket,
        ServerSideEncryptionConfiguration: {
          Rules: [
            {
              ApplyServerSideEncryptionByDefault: {
                SSEAlgorithm: "AES256",
              },
              BucketKeyEnabled: true,
            },
          ],
        },
      });

      // Get and verify encryption
      const encryptionResult = yield* getBucketEncryption({
        Bucket: bucket,
      });
      const rule =
        encryptionResult.ServerSideEncryptionConfiguration?.Rules?.[0];
      if (rule?.ApplyServerSideEncryptionByDefault?.SSEAlgorithm !== "AES256") {
        return yield* Effect.fail(
          new Error(
            `Expected SSEAlgorithm=AES256, got ${rule?.ApplyServerSideEncryptionByDefault?.SSEAlgorithm}`,
          ),
        );
      }

      // Delete encryption
      yield* deleteBucketEncryption({ Bucket: bucket });

      // Note: After deleting, S3 may return default encryption settings
      // so we don't check for error here
    }),
  ),
);

// ============================================================================
// Lifecycle Configuration Tests
// ============================================================================

test(
  "bucket lifecycle: put, get, and delete lifecycle configuration",
  withBucket("itty-s3-lifecycle-cfg", (bucket) =>
    Effect.gen(function* () {
      // Put lifecycle configuration
      yield* putBucketLifecycleConfiguration({
        Bucket: bucket,
        LifecycleConfiguration: {
          Rules: [
            {
              ID: "ExpireOldObjects",
              Status: "Enabled",
              Filter: {
                Prefix: "logs/",
              },
              Expiration: {
                Days: 90,
              },
            },
            {
              ID: "TransitionToGlacier",
              Status: "Enabled",
              Filter: {
                Prefix: "archive/",
              },
              Transitions: [
                {
                  Days: 30,
                  StorageClass: "GLACIER",
                },
              ],
            },
            {
              ID: "AbortIncompleteUploads",
              Status: "Enabled",
              Filter: {
                Prefix: "",
              },
              AbortIncompleteMultipartUpload: {
                DaysAfterInitiation: 7,
              },
            },
          ],
        },
      });

      // Get and verify lifecycle
      const lifecycleResult = yield* getBucketLifecycleConfiguration({
        Bucket: bucket,
      });
      if (lifecycleResult.Rules?.length !== 3) {
        return yield* Effect.fail(
          new Error(
            `Expected 3 lifecycle rules, got ${lifecycleResult.Rules?.length}`,
          ),
        );
      }

      const expireRule = lifecycleResult.Rules?.find(
        (r) => r.ID === "ExpireOldObjects",
      );
      if (expireRule?.Expiration?.Days !== 90) {
        return yield* Effect.fail(
          new Error(
            `Expected Expiration.Days=90, got ${expireRule?.Expiration?.Days}`,
          ),
        );
      }

      const transitionRule = lifecycleResult.Rules?.find(
        (r) => r.ID === "TransitionToGlacier",
      );
      if (transitionRule?.Transitions?.[0]?.StorageClass !== "GLACIER") {
        return yield* Effect.fail(new Error("Expected transition to GLACIER"));
      }

      // Delete lifecycle
      yield* deleteBucketLifecycle({ Bucket: bucket });

      // Verify deletion
      const result = yield* getBucketLifecycleConfiguration({
        Bucket: bucket,
      }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      if (result !== "error") {
        return yield* Effect.fail(
          new Error("Expected error after deleting lifecycle config"),
        );
      }
    }),
  ),
);

// Test various lifecycle configurations that have been reported to produce MalformedXML
test(
  "bucket lifecycle: test various rule configurations",
  withBucket("itty-s3-lifecycle-rules", (bucket) =>
    Effect.gen(function* () {
      // Test 1: Simple rule with Filter and Transitions (like AWS example)
      yield* putBucketLifecycleConfiguration({
        Bucket: bucket,
        LifecycleConfiguration: {
          Rules: [
            {
              ID: "TestFilterTransition",
              Filter: {
                Prefix: "documents/",
              },
              Status: "Enabled",
              Transitions: [
                {
                  Days: 30,
                  StorageClass: "GLACIER",
                },
              ],
            },
          ],
        },
      });

      // Verify it was set correctly
      let lifecycleResult = yield* getBucketLifecycleConfiguration({
        Bucket: bucket,
      });
      if (lifecycleResult.Rules?.length !== 1) {
        return yield* Effect.fail(
          new Error(
            `Test 1: Expected 1 rule, got ${lifecycleResult.Rules?.length}`,
          ),
        );
      }

      // Test 2: Rule with Expiration and Filter
      yield* putBucketLifecycleConfiguration({
        Bucket: bucket,
        LifecycleConfiguration: {
          Rules: [
            {
              ID: "TestExpirationFilter",
              Filter: {
                Prefix: "temp/",
              },
              Status: "Enabled",
              Expiration: {
                Days: 7,
              },
            },
          ],
        },
      });

      lifecycleResult = yield* getBucketLifecycleConfiguration({
        Bucket: bucket,
      });
      if (lifecycleResult.Rules?.[0]?.Expiration?.Days !== 7) {
        return yield* Effect.fail(
          new Error(
            `Test 2: Expected Days=7, got ${lifecycleResult.Rules?.[0]?.Expiration?.Days}`,
          ),
        );
      }

      // Test 3: Complete rule with ID, Filter, Expiration, and Transitions (like AWS smithy example)
      yield* putBucketLifecycleConfiguration({
        Bucket: bucket,
        LifecycleConfiguration: {
          Rules: [
            {
              ID: "TestComplete",
              Filter: {
                Prefix: "data/",
              },
              Status: "Enabled",
              Expiration: {
                Days: 3650,
              },
              Transitions: [
                {
                  Days: 365,
                  StorageClass: "GLACIER",
                },
              ],
            },
          ],
        },
      });

      lifecycleResult = yield* getBucketLifecycleConfiguration({
        Bucket: bucket,
      });
      if (lifecycleResult.Rules?.[0]?.ID !== "TestComplete") {
        return yield* Effect.fail(
          new Error(
            `Test 3: Expected ID=TestComplete, got ${lifecycleResult.Rules?.[0]?.ID}`,
          ),
        );
      }

      // Test 4: Empty Filter prefix (applies to all objects)
      yield* putBucketLifecycleConfiguration({
        Bucket: bucket,
        LifecycleConfiguration: {
          Rules: [
            {
              ID: "TestEmptyPrefix",
              Filter: {
                Prefix: "",
              },
              Status: "Enabled",
              AbortIncompleteMultipartUpload: {
                DaysAfterInitiation: 1,
              },
            },
          ],
        },
      });

      lifecycleResult = yield* getBucketLifecycleConfiguration({
        Bucket: bucket,
      });
      if (
        lifecycleResult.Rules?.[0]?.AbortIncompleteMultipartUpload
          ?.DaysAfterInitiation !== 1
      ) {
        return yield* Effect.fail(
          new Error(`Test 4: Expected DaysAfterInitiation=1`),
        );
      }

      // Cleanup
      yield* deleteBucketLifecycle({ Bucket: bucket });
    }),
  ),
);

// ============================================================================
// Public Access Block Tests
// ============================================================================

test(
  "bucket public access block: put, get, and delete",
  withBucket("itty-s3-public-access", (bucket) =>
    Effect.gen(function* () {
      // Put public access block
      yield* putPublicAccessBlock({
        Bucket: bucket,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          IgnorePublicAcls: true,
          BlockPublicPolicy: true,
          RestrictPublicBuckets: true,
        },
      });

      // Get and verify
      const pabResult = yield* getPublicAccessBlock({ Bucket: bucket });
      const config = pabResult.PublicAccessBlockConfiguration;
      if (config?.BlockPublicAcls !== true) {
        return yield* Effect.fail(new Error("Expected BlockPublicAcls=true"));
      }
      if (config?.IgnorePublicAcls !== true) {
        return yield* Effect.fail(new Error("Expected IgnorePublicAcls=true"));
      }
      if (config?.BlockPublicPolicy !== true) {
        return yield* Effect.fail(new Error("Expected BlockPublicPolicy=true"));
      }
      if (config?.RestrictPublicBuckets !== true) {
        return yield* Effect.fail(
          new Error("Expected RestrictPublicBuckets=true"),
        );
      }

      // Update with partial block
      yield* putPublicAccessBlock({
        Bucket: bucket,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          IgnorePublicAcls: false,
          BlockPublicPolicy: false,
          RestrictPublicBuckets: false,
        },
      });

      // Verify update
      const updatedPab = yield* getPublicAccessBlock({ Bucket: bucket });
      if (
        updatedPab.PublicAccessBlockConfiguration?.IgnorePublicAcls !== false
      ) {
        return yield* Effect.fail(
          new Error("Expected IgnorePublicAcls=false after update"),
        );
      }

      // Delete public access block
      yield* deletePublicAccessBlock({ Bucket: bucket });

      // Verify deletion
      const result = yield* getPublicAccessBlock({ Bucket: bucket }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      if (result !== "error") {
        return yield* Effect.fail(
          new Error("Expected error after deleting public access block"),
        );
      }
    }),
  ),
);

// ============================================================================
// Ownership Controls Tests
// ============================================================================

test(
  "bucket ownership controls: put, get, and delete",
  withBucket("itty-s3-ownership", (bucket) =>
    Effect.gen(function* () {
      // Put ownership controls - BucketOwnerEnforced disables ACLs
      yield* putBucketOwnershipControls({
        Bucket: bucket,
        OwnershipControls: {
          Rules: [
            {
              ObjectOwnership: "BucketOwnerEnforced",
            },
          ],
        },
      });

      // Get and verify
      const ownershipResult = yield* getBucketOwnershipControls({
        Bucket: bucket,
      });
      const rule = ownershipResult.OwnershipControls?.Rules?.[0];
      if (rule?.ObjectOwnership !== "BucketOwnerEnforced") {
        return yield* Effect.fail(
          new Error(
            `Expected ObjectOwnership=BucketOwnerEnforced, got ${rule?.ObjectOwnership}`,
          ),
        );
      }

      // Update to ObjectWriter (allows ACLs)
      yield* putBucketOwnershipControls({
        Bucket: bucket,
        OwnershipControls: {
          Rules: [
            {
              ObjectOwnership: "ObjectWriter",
            },
          ],
        },
      });

      // Verify update
      const updatedOwnership = yield* getBucketOwnershipControls({
        Bucket: bucket,
      });
      if (
        updatedOwnership.OwnershipControls?.Rules?.[0]?.ObjectOwnership !==
        "ObjectWriter"
      ) {
        return yield* Effect.fail(
          new Error("Expected ObjectOwnership=ObjectWriter after update"),
        );
      }

      // Delete ownership controls
      yield* deleteBucketOwnershipControls({ Bucket: bucket });

      // Verify deletion
      const result = yield* getBucketOwnershipControls({
        Bucket: bucket,
      }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      if (result !== "error") {
        return yield* Effect.fail(
          new Error("Expected error after deleting ownership controls"),
        );
      }
    }),
  ),
);

// ============================================================================
// ACL Tests
// ============================================================================

test(
  "bucket ACL: get bucket ACL",
  withBucket("itty-s3-acl", (bucket) =>
    Effect.gen(function* () {
      // First set ownership to allow ACLs
      yield* putBucketOwnershipControls({
        Bucket: bucket,
        OwnershipControls: {
          Rules: [
            {
              ObjectOwnership: "ObjectWriter",
            },
          ],
        },
      });

      // Get bucket ACL
      const aclResult = yield* getBucketAcl({ Bucket: bucket });

      // Should have an owner
      if (!aclResult.Owner?.ID) {
        return yield* Effect.fail(new Error("Expected Owner.ID to be present"));
      }

      // Should have grants
      if (!aclResult.Grants || aclResult.Grants.length === 0) {
        return yield* Effect.fail(new Error("Expected at least one grant"));
      }

      // The owner should have FULL_CONTROL by default
      const fullControlGrant = aclResult.Grants?.find(
        (g) => g.Permission === "FULL_CONTROL",
      );
      if (!fullControlGrant) {
        return yield* Effect.fail(
          new Error("Expected FULL_CONTROL grant for bucket owner"),
        );
      }
    }),
  ),
);

// ============================================================================
// Accelerate Configuration Tests
// ============================================================================

test(
  "bucket accelerate: put and get accelerate configuration",
  withBucket("itty-s3-accelerate", (bucket) =>
    Effect.gen(function* () {
      // Get initial state (should be Suspended or undefined)
      const initialAccelerate = yield* getBucketAccelerateConfiguration({
        Bucket: bucket,
      });
      // New buckets have no accelerate config

      // Enable accelerate (note: bucket name must not contain dots)
      yield* putBucketAccelerateConfiguration({
        Bucket: bucket,
        AccelerateConfiguration: {
          Status: "Enabled",
        },
      });

      // Get and verify
      const enabledAccelerate = yield* getBucketAccelerateConfiguration({
        Bucket: bucket,
      });
      if (enabledAccelerate.Status !== "Enabled") {
        return yield* Effect.fail(
          new Error(`Expected Status=Enabled, got ${enabledAccelerate.Status}`),
        );
      }

      // Disable accelerate
      yield* putBucketAccelerateConfiguration({
        Bucket: bucket,
        AccelerateConfiguration: {
          Status: "Suspended",
        },
      });

      // Verify suspended
      const suspendedAccelerate = yield* getBucketAccelerateConfiguration({
        Bucket: bucket,
      });
      if (suspendedAccelerate.Status !== "Suspended") {
        return yield* Effect.fail(
          new Error(
            `Expected Status=Suspended, got ${suspendedAccelerate.Status}`,
          ),
        );
      }
    }),
  ),
);

// ============================================================================
// Request Payment Tests
// ============================================================================

test(
  "bucket request payment: put and get request payment configuration",
  withBucket("itty-s3-payment", (bucket) =>
    Effect.gen(function* () {
      // Get initial state (should be BucketOwner)
      const initialPayment = yield* getBucketRequestPayment({
        Bucket: bucket,
      });
      if (initialPayment.Payer !== "BucketOwner") {
        return yield* Effect.fail(
          new Error(
            `Expected initial Payer=BucketOwner, got ${initialPayment.Payer}`,
          ),
        );
      }

      // Set to Requester pays
      yield* putBucketRequestPayment({
        Bucket: bucket,
        RequestPaymentConfiguration: {
          Payer: "Requester",
        },
      });

      // Get and verify
      const requesterPayment = yield* getBucketRequestPayment({
        Bucket: bucket,
      });
      if (requesterPayment.Payer !== "Requester") {
        return yield* Effect.fail(
          new Error(`Expected Payer=Requester, got ${requesterPayment.Payer}`),
        );
      }

      // Set back to BucketOwner
      yield* putBucketRequestPayment({
        Bucket: bucket,
        RequestPaymentConfiguration: {
          Payer: "BucketOwner",
        },
      });

      // Verify
      const ownerPayment = yield* getBucketRequestPayment({
        Bucket: bucket,
      });
      if (ownerPayment.Payer !== "BucketOwner") {
        return yield* Effect.fail(
          new Error(`Expected Payer=BucketOwner, got ${ownerPayment.Payer}`),
        );
      }
    }),
  ),
);

// ============================================================================
// Object Streaming Tests
// ============================================================================

test(
  "putObject and getObject with string body",
  withBucket("itty-s3-string-obj", (bucket) =>
    Effect.gen(function* () {
      const testKey = "test-string.txt";
      const testContent = "Hello, itty-aws! This is a test string.";

      // Put object with string body
      yield* putObject({
        Bucket: bucket,
        Key: testKey,
        Body: testContent,
        ContentType: "text/plain",
      });

      // Get object and verify
      const result = yield* getObject({
        Bucket: bucket,
        Key: testKey,
      });

      if (!result.Body) {
        return yield* Effect.fail(new Error("Expected Body in response"));
      }

      // Body should be an Effect Stream - consume it
      const actualContent = yield* result.Body.pipe(
        Stream.decodeText(),
        Stream.mkString,
      );

      expect(actualContent).toBe(testContent);

      // Cleanup
      yield* deleteObject({ Bucket: bucket, Key: testKey });
    }),
  ),
);

test(
  "putObject with Uint8Array body",
  withBucket("itty-s3-binary-obj", (bucket) =>
    Effect.gen(function* () {
      const testKey = "test-binary.bin";
      const testContent = new Uint8Array([
        0x00, 0x01, 0x02, 0x03, 0xff, 0xfe, 0xfd,
      ]);

      // Put object with Uint8Array body
      yield* putObject({
        Bucket: bucket,
        Key: testKey,
        Body: testContent,
        ContentType: "application/octet-stream",
      });

      // Get object and verify
      const result = yield* getObject({
        Bucket: bucket,
        Key: testKey,
      });

      if (!result.Body) {
        return yield* Effect.fail(new Error("Expected Body in response"));
      }

      // Consume the stream
      const chunks: Uint8Array[] = [];
      yield* Stream.runForEach(result.Body, (chunk) =>
        Effect.sync(() => {
          chunks.push(chunk);
        }),
      );

      let offset = 0;
      const fullBuffer = new Uint8Array(
        chunks.reduce((acc, c) => acc + c.length, 0),
      );
      for (const chunk of chunks) {
        fullBuffer.set(chunk, offset);
        offset += chunk.length;
      }

      if (fullBuffer.length !== testContent.length) {
        return yield* Effect.fail(
          new Error(
            `Length mismatch: expected ${testContent.length}, got ${fullBuffer.length}`,
          ),
        );
      }

      for (let i = 0; i < testContent.length; i++) {
        if (fullBuffer[i] !== testContent[i]) {
          return yield* Effect.fail(new Error(`Byte mismatch at index ${i}`));
        }
      }

      // Cleanup
      yield* deleteObject({ Bucket: bucket, Key: testKey });
    }),
  ),
);

test(
  "putObject with Effect Stream body and explicit ContentLength",
  withBucket("itty-s3-stream-obj", (bucket) =>
    Effect.gen(function* () {
      const testKey = "test-stream.txt";
      const testChunks = ["Hello, ", "Effect ", "Stream!"];

      // Create an Effect Stream from chunks
      const encoder = new TextEncoder();
      const inputStream = Stream.fromIterable(
        testChunks.map((s) => encoder.encode(s)),
      );

      // Put object with Effect Stream body and explicit ContentLength
      yield* putObject({
        Bucket: bucket,
        Key: testKey,
        Body: inputStream,
        ContentLength: testChunks.reduce(
          (acc, s) => acc + encoder.encode(s).length,
          0,
        ),
        ContentType: "text/plain",
      });

      // Get object and verify
      const result = yield* getObject({
        Bucket: bucket,
        Key: testKey,
      });

      if (!result.Body) {
        return yield* Effect.fail(new Error("Expected Body in response"));
      }

      // Consume the stream
      const actualContent = yield* result.Body.pipe(
        Stream.decodeText(),
        Stream.mkString,
      );

      expect(actualContent).toBe(testChunks.join(""));

      // Cleanup
      yield* deleteObject({ Bucket: bucket, Key: testKey });
    }),
  ),
);

test(
  "putObject with Effect Stream body without ContentLength buffers and computes length",
  withBucket("itty-s3-stream-buffered", (bucket) =>
    Effect.gen(function* () {
      const testKey = "test-stream-buffered.txt";
      const testChunks = ["Buffered ", "stream ", "upload!"];
      const expectedContent = testChunks.join("");

      // Create an Effect Stream from chunks
      const encoder = new TextEncoder();
      const inputStream = Stream.fromIterable(
        testChunks.map((s) => encoder.encode(s)),
      );

      // Put object with Effect Stream body WITHOUT ContentLength
      // The middleware will buffer the stream and compute Content-Length
      yield* putObject({
        Bucket: bucket,
        Key: testKey,
        Body: inputStream,
        ContentType: "text/plain",
      });

      const result = yield* getObject({
        Bucket: bucket,
        Key: testKey,
      });

      const actualContent = yield* result.Body!.pipe(
        Stream.decodeText(),
        Stream.mkString,
      );

      expect(actualContent).toBe(expectedContent);

      yield* deleteObject({ Bucket: bucket, Key: testKey });
    }),
  ),
);

test(
  "getObject returns headers (ContentType, ContentLength, ETag)",
  withBucket("itty-s3-headers", (bucket) =>
    Effect.gen(function* () {
      const testKey = "test-headers.json";
      const testContent = JSON.stringify({ message: "hello" });

      // Put object
      yield* putObject({
        Bucket: bucket,
        Key: testKey,
        Body: testContent,
        ContentType: "application/json",
      });

      // Get object and check headers
      const result = yield* getObject({
        Bucket: bucket,
        Key: testKey,
      });

      if (result.ContentType !== "application/json") {
        return yield* Effect.fail(
          new Error(
            `Expected ContentType=application/json, got ${result.ContentType}`,
          ),
        );
      }

      if (result.ContentLength !== testContent.length) {
        return yield* Effect.fail(
          new Error(
            `Expected ContentLength=${testContent.length}, got ${result.ContentLength}`,
          ),
        );
      }

      if (!result.ETag) {
        return yield* Effect.fail(new Error("Expected ETag to be present"));
      }

      // Also verify body content matches what we wrote
      const actualContent = yield* result.Body!.pipe(
        Stream.decodeText(),
        Stream.mkString,
      );

      expect(actualContent).toBe(testContent);

      yield* deleteObject({ Bucket: bucket, Key: testKey });
    }),
  ),
);

// ============================================================================
// Multiple Configurations Combined Test
// ============================================================================

test(
  "apply multiple control plane configurations to a single bucket",
  withBucket("itty-s3-multi-config", (bucket) =>
    Effect.gen(function* () {
      // Apply multiple configurations in sequence

      // 1. Tagging
      yield* putBucketTagging({
        Bucket: bucket,
        Tagging: {
          TagSet: [
            { Key: "Environment", Value: "Integration" },
            { Key: "CostCenter", Value: "12345" },
          ],
        },
      });

      // 2. Versioning
      yield* putBucketVersioning({
        Bucket: bucket,
        VersioningConfiguration: {
          Status: "Enabled",
        },
      });

      // 3. Encryption
      yield* putBucketEncryption({
        Bucket: bucket,
        ServerSideEncryptionConfiguration: {
          Rules: [
            {
              ApplyServerSideEncryptionByDefault: {
                SSEAlgorithm: "AES256",
              },
            },
          ],
        },
      });

      // 4. Public Access Block
      yield* putPublicAccessBlock({
        Bucket: bucket,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          IgnorePublicAcls: true,
          BlockPublicPolicy: true,
          RestrictPublicBuckets: true,
        },
      });

      // 5. Lifecycle
      yield* putBucketLifecycleConfiguration({
        Bucket: bucket,
        LifecycleConfiguration: {
          Rules: [
            {
              ID: "CleanupIncompleteUploads",
              Status: "Enabled",
              Filter: { Prefix: "" },
              AbortIncompleteMultipartUpload: {
                DaysAfterInitiation: 7,
              },
            },
          ],
        },
      });

      // Verify all configurations are in place
      const [tags, versioning, encryption, pab, lifecycle] = yield* Effect.all([
        getBucketTagging({ Bucket: bucket }),
        getBucketVersioning({ Bucket: bucket }),
        getBucketEncryption({ Bucket: bucket }),
        getPublicAccessBlock({ Bucket: bucket }),
        getBucketLifecycleConfiguration({ Bucket: bucket }),
      ]);

      // Verify each config
      if (tags.TagSet?.length !== 2) {
        return yield* Effect.fail(new Error("Tags not applied correctly"));
      }
      if (versioning.Status !== "Enabled") {
        return yield* Effect.fail(new Error("Versioning not enabled"));
      }
      if (
        encryption.ServerSideEncryptionConfiguration?.Rules?.[0]
          ?.ApplyServerSideEncryptionByDefault?.SSEAlgorithm !== "AES256"
      ) {
        return yield* Effect.fail(
          new Error("Encryption not configured correctly"),
        );
      }
      if (pab.PublicAccessBlockConfiguration?.BlockPublicAcls !== true) {
        return yield* Effect.fail(
          new Error("Public access block not configured correctly"),
        );
      }
      if (lifecycle.Rules?.length !== 1) {
        return yield* Effect.fail(
          new Error("Lifecycle not configured correctly"),
        );
      }
    }),
  ),
);

// ============================================================================
// Streaming Checksum Tests (aws-chunked encoding with trailing checksum)
// ============================================================================

test(
  "putObject with streaming body and ChecksumAlgorithm triggers aws-chunked encoding",
  withBucket("itty-s3-checksum", (bucket) =>
    Effect.gen(function* () {
      const testKey = "test-streaming-checksum.txt";
      const testChunks = ["Hello, ", "streaming ", "checksum ", "test!"];
      const expectedContent = testChunks.join("");

      // Create an Effect Stream from chunks
      const encoder = new TextEncoder();
      const inputStream = Stream.fromIterable(
        testChunks.map((s) => encoder.encode(s)),
      );

      // Calculate content length for the x-amz-decoded-content-length header
      const contentLength = testChunks.reduce(
        (acc, s) => acc + encoder.encode(s).length,
        0,
      );

      // Put object with Effect Stream body AND ChecksumAlgorithm
      // This triggers the aws-chunked encoding path in checksum.ts
      yield* putObject({
        Bucket: bucket,
        Key: testKey,
        Body: inputStream,
        // S3 requires Content-Length for streaming uploads (use multipart for unknown-length)
        ContentLength: contentLength,
        ChecksumAlgorithm: "CRC32",
      });

      // Get object and verify content was uploaded correctly
      const result = yield* getObject({
        Bucket: bucket,
        Key: testKey,
      });

      const actualContent = yield* result.Body!.pipe(
        Stream.decodeText(),
        Stream.mkString,
      );

      expect(actualContent).toBe(expectedContent);

      // Cleanup
      yield* deleteObject({ Bucket: bucket, Key: testKey });
    }),
  ),
);

test(
  "multipart upload with uploadPart streaming body and ChecksumAlgorithm",
  withBucket("itty-s3-multipart", (bucket) =>
    Effect.gen(function* () {
      const testKey = "test-multipart-streaming-checksum.txt";

      // S3 requires minimum 5MB per part (except last part)
      const part1Content = "A".repeat(5 * 1024 * 1024); // 5MB
      const part2Content = "B".repeat(1024); // 1KB - last part can be any size

      // 1. Initiate multipart upload
      const initResult = yield* createMultipartUpload({
        Bucket: bucket,
        Key: testKey,
        ContentType: "text/plain",
      });

      if (!initResult.UploadId) {
        return yield* Effect.fail(
          new Error("Expected UploadId from createMultipartUpload"),
        );
      }

      const uploadId = initResult.UploadId;

      try {
        // 2. Upload part 1 with streaming body and checksum
        const encoder = new TextEncoder();
        const part1Bytes = encoder.encode(part1Content);
        const part1Stream = Stream.fromIterable([part1Bytes]);

        const part1Result = yield* uploadPart({
          Bucket: bucket,
          Key: testKey,
          UploadId: uploadId,
          PartNumber: 1,
          Body: part1Stream,
          ContentLength: part1Bytes.length,
          ChecksumAlgorithm: "CRC32",
        });

        if (!part1Result.ETag) {
          return yield* Effect.fail(
            new Error("Expected ETag from uploadPart 1"),
          );
        }

        // 3. Upload part 2 with streaming body and checksum
        const part2Bytes = encoder.encode(part2Content);
        const part2Stream = Stream.fromIterable([part2Bytes]);

        const part2Result = yield* uploadPart({
          Bucket: bucket,
          Key: testKey,
          UploadId: uploadId,
          PartNumber: 2,
          Body: part2Stream,
          ContentLength: part2Bytes.length,
          ChecksumAlgorithm: "CRC32",
        });

        if (!part2Result.ETag) {
          return yield* Effect.fail(
            new Error("Expected ETag from uploadPart 2"),
          );
        }

        // 4. Complete multipart upload
        yield* completeMultipartUpload({
          Bucket: bucket,
          Key: testKey,
          UploadId: uploadId,
          MultipartUpload: {
            Parts: [
              { PartNumber: 1, ETag: part1Result.ETag },
              { PartNumber: 2, ETag: part2Result.ETag },
            ],
          },
        });

        // 5. Verify the content
        const result = yield* getObject({
          Bucket: bucket,
          Key: testKey,
        });

        if (!result.Body) {
          return yield* Effect.fail(new Error("Expected Body in response"));
        }

        // Consume the stream
        const chunks: Uint8Array[] = [];
        yield* Stream.runForEach(result.Body, (chunk) =>
          Effect.sync(() => {
            chunks.push(chunk);
          }),
        );

        let offset = 0;
        const fullBuffer = new Uint8Array(
          chunks.reduce((acc, c) => acc + c.length, 0),
        );
        for (const chunk of chunks) {
          fullBuffer.set(chunk, offset);
          offset += chunk.length;
        }

        const expectedLength = part1Content.length + part2Content.length;
        if (fullBuffer.length !== expectedLength) {
          return yield* Effect.fail(
            new Error(
              `Length mismatch: expected ${expectedLength}, got ${fullBuffer.length}`,
            ),
          );
        }

        // Check first few bytes of part 1 (should be 'A' = 65)
        for (let i = 0; i < 100; i++) {
          if (fullBuffer[i] !== 65) {
            return yield* Effect.fail(
              new Error(
                `Part 1 content mismatch at byte ${i}: expected 65 ('A'), got ${fullBuffer[i]}`,
              ),
            );
          }
        }

        // Check last few bytes of part 1 (should be 'A' = 65)
        const part1End = part1Content.length - 1;
        for (let i = part1End - 100; i <= part1End; i++) {
          if (fullBuffer[i] !== 65) {
            return yield* Effect.fail(
              new Error(
                `Part 1 content mismatch at byte ${i}: expected 65 ('A'), got ${fullBuffer[i]}`,
              ),
            );
          }
        }

        // Check part 2 content (should be 'B' = 66)
        const part2Start = part1Content.length;
        for (let i = part2Start; i < fullBuffer.length; i++) {
          if (fullBuffer[i] !== 66) {
            return yield* Effect.fail(
              new Error(
                `Part 2 content mismatch at byte ${i}: expected 66 ('B'), got ${fullBuffer[i]}`,
              ),
            );
          }
        }

        // Cleanup
        yield* deleteObject({ Bucket: bucket, Key: testKey });
      } catch (e) {
        // Abort multipart upload on failure
        yield* abortMultipartUpload({
          Bucket: bucket,
          Key: testKey,
          UploadId: uploadId,
        }).pipe(Effect.ignore);
        throw e;
      }
    }),
  ),
);

// ============================================================================
// Interruption Tests
// ============================================================================

test(
  "streaming upload can be interrupted",
  withBucket("itty-s3-interrupt", (bucket) =>
    Effect.gen(function* () {
      const testKey = "test-interruption.txt";

      // Track chunks read
      let chunksRead = 0;

      // Create a slow stream that emits chunks with delays
      const slowStream = new ReadableStream<Uint8Array>({
        async pull(controller) {
          // Emit chunks slowly
          if (chunksRead < 100) {
            await new Promise((resolve) => setTimeout(resolve, 50)); // 50ms per chunk
            const chunk = new Uint8Array(1024).fill(65); // 1KB of 'A'
            controller.enqueue(chunk);
            chunksRead++;
          } else {
            controller.close();
          }
        },
      });

      // Try to upload but interrupt after 100ms
      const uploadEffect = putObject({
        Bucket: bucket,
        Key: testKey,
        Body: slowStream,
        ContentType: "text/plain",
        ContentLength: 100 * 1024, // 100KB total
        ChecksumAlgorithm: "CRC32",
      });

      // Use Effect.timeout which properly interrupts when timeout fires
      const result = yield* uploadEffect.pipe(
        Effect.timeout("100 millis"),
        Effect.option, // Convert TimeoutException to None
      );

      // The timeout should have triggered (result is None)
      if (result._tag !== "None") {
        return yield* Effect.fail(
          new Error("Expected upload to be interrupted by timeout"),
        );
      }

      // Verify we didn't read all chunks (interrupted early)
      // The fact that we got here with timeout means the effect was interrupted
      if (chunksRead >= 100) {
        return yield* Effect.fail(
          new Error(`Expected fewer than 100 chunks, got ${chunksRead}`),
        );
      }

      // If we got here, the timeout worked - the upload was interrupted
      // Note: Stream cancel() propagation depends on fetch implementation
      // The key is that the Effect was interrupted and didn't complete all chunks

      // Cleanup - object may or may not exist
      yield* deleteObject({ Bucket: bucket, Key: testKey }).pipe(Effect.ignore);
    }),
  ),
);

test(
  "streaming upload interruption via Effect.raceFirst with Effect.interrupt",
  withBucket("itty-s3-race-interrupt", (bucket) =>
    Effect.gen(function* () {
      const testKey = "test-interruption-explicit.txt";
      let chunksRead = 0;

      // Create a slow stream
      const slowStream = new ReadableStream<Uint8Array>({
        async pull(controller) {
          if (chunksRead < 50) {
            await new Promise((resolve) => setTimeout(resolve, 20));
            controller.enqueue(new Uint8Array(1024).fill(66)); // 1KB of 'B'
            chunksRead++;
          } else {
            controller.close();
          }
        },
      });

      const uploadEffect = putObject({
        Bucket: bucket,
        Key: testKey,
        Body: slowStream,
        ContentType: "text/plain",
        ContentLength: 50 * 1024,
        ChecksumAlgorithm: "CRC32",
      });

      // Use raceFirst which returns the first to complete AND interrupts the other
      const result = yield* Effect.raceFirst(
        uploadEffect.pipe(Effect.as("completed" as const)),
        Effect.sleep("50 millis").pipe(Effect.as("timeout" as const)),
      );

      // The timeout should win
      if (result !== "timeout") {
        return yield* Effect.fail(
          new Error("Expected timeout to win the race"),
        );
      }

      // Verify partial upload (not all chunks)
      if (chunksRead >= 50) {
        return yield* Effect.fail(
          new Error(`Expected fewer than 50 chunks, got ${chunksRead}`),
        );
      }

      // Cleanup
      yield* deleteObject({ Bucket: bucket, Key: testKey }).pipe(Effect.ignore);
    }),
  ),
);
