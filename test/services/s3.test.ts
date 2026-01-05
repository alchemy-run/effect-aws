import { expect } from "@effect/vitest";
import { Effect, Schedule, Stream } from "effect";
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
  deleteObjects,
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
  listObjectsV2,
  listObjectVersions,
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

// ============================================================================
// Idempotent Cleanup Helpers
// ============================================================================

// Delete all objects (including versions) from a bucket
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

// Clean up bucket completely - empty it first, then delete
const cleanupBucket = (bucket: string) =>
  Effect.gen(function* () {
    // Check if bucket exists
    const exists = yield* headBucket({ Bucket: bucket }).pipe(
      Effect.map(() => true),
      Effect.catchAll(() => Effect.succeed(false)),
    );

    if (!exists) return;

    // Empty the bucket first
    yield* emptyBucket(bucket);

    // Delete the bucket
    yield* deleteBucket({ Bucket: bucket }).pipe(Effect.ignore);
  });

// Helper to ensure cleanup happens even on failure - cleans up before AND after
const withBucket = <A, E, R>(
  bucket: string,
  testFn: (bucket: string) => Effect.Effect<A, E, R>,
) =>
  Effect.gen(function* () {
    // Clean up any leftover from previous runs
    yield* cleanupBucket(bucket);

    yield* createBucket({ Bucket: bucket });
    return yield* testFn(bucket).pipe(Effect.ensuring(cleanupBucket(bucket)));
  });

// ============================================================================
// Bucket Lifecycle Tests
// ============================================================================

test(
  "create bucket, head bucket, get location, list buckets, and delete",
  withBucket("itty-s3-lifecycle", (bucket) =>
    Effect.gen(function* () {
      // Head bucket to verify it exists
      yield* headBucket({ Bucket: bucket });
      // Should not throw - bucket exists

      // Get bucket location
      yield* getBucketLocation({ Bucket: bucket });
      // Location will be null for us-east-1, or the region name otherwise

      // List buckets and verify our bucket is in the list
      const listResult = yield* listBuckets({});
      const foundBucket = listResult.Buckets?.find((b) => b.Name === bucket);
      expect(foundBucket).toBeDefined();
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
      expect(tags.TagSet?.length).toEqual(3);

      const envTag = tags.TagSet?.find((t) => t.Key === "Environment");
      expect(envTag?.Value).toEqual("Test");

      // Update tags (replace all)
      yield* putBucketTagging({
        Bucket: bucket,
        Tagging: {
          TagSet: [{ Key: "UpdatedTag", Value: "NewValue" }],
        },
      });

      // Verify update
      const updatedTags = yield* getBucketTagging({ Bucket: bucket });
      expect(updatedTags.TagSet?.length).toEqual(1);

      // Delete tags
      yield* deleteBucketTagging({ Bucket: bucket });

      // Verify deletion - should throw NoSuchTagSet error
      const result = yield* getBucketTagging({ Bucket: bucket }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      expect(result).toEqual("error");
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
      expect(policyResult.Policy).toBeDefined();

      const parsedPolicy = JSON.parse(policyResult.Policy!);
      expect(parsedPolicy.Statement[0].Sid).toEqual("TestStatement");

      // Delete policy
      yield* deleteBucketPolicy({ Bucket: bucket });

      // Verify deletion
      const result = yield* getBucketPolicy({ Bucket: bucket }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      expect(result).toEqual("error");
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
      expect(corsResult.CORSRules?.length).toEqual(2);

      const firstRule = corsResult.CORSRules?.[0];
      expect(firstRule?.AllowedMethods?.includes("PUT")).toBe(true);
      expect(firstRule?.MaxAgeSeconds).toEqual(3600);

      // Delete CORS
      yield* deleteBucketCors({ Bucket: bucket });

      // Verify deletion
      const result = yield* getBucketCors({ Bucket: bucket }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      expect(result).toEqual("error");
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
      yield* getBucketVersioning({
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
      expect(enabledVersioning.Status).toEqual("Enabled");

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
      expect(suspendedVersioning.Status).toEqual("Suspended");
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
      expect(websiteResult.IndexDocument?.Suffix).toEqual("index.html");
      expect(websiteResult.ErrorDocument?.Key).toEqual("error.html");

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
      expect(updatedWebsite.RoutingRules?.length).toEqual(1);

      // Delete website config
      yield* deleteBucketWebsite({ Bucket: bucket });

      // Verify deletion
      const result = yield* getBucketWebsite({ Bucket: bucket }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      expect(result).toEqual("error");
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
      expect(rule?.ApplyServerSideEncryptionByDefault?.SSEAlgorithm).toEqual(
        "AES256",
      );

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
      expect(lifecycleResult.Rules?.length).toEqual(3);

      const expireRule = lifecycleResult.Rules?.find(
        (r) => r.ID === "ExpireOldObjects",
      );
      expect(expireRule?.Expiration?.Days).toEqual(90);

      const transitionRule = lifecycleResult.Rules?.find(
        (r) => r.ID === "TransitionToGlacier",
      );
      expect(transitionRule?.Transitions?.[0]?.StorageClass).toEqual("GLACIER");

      // Delete lifecycle
      yield* deleteBucketLifecycle({ Bucket: bucket });

      // Verify deletion
      const result = yield* getBucketLifecycleConfiguration({
        Bucket: bucket,
      }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      expect(result).toEqual("error");
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
      expect(lifecycleResult.Rules?.length).toEqual(1);

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
      expect(lifecycleResult.Rules?.[0]?.Expiration?.Days).toEqual(7);

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
      expect(lifecycleResult.Rules?.[0]?.ID).toEqual("TestComplete");

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

      // Retry to handle eventual consistency - use conditional check, not assertion
      yield* Effect.gen(function* () {
        const result = yield* getBucketLifecycleConfiguration({
          Bucket: bucket,
        });
        const rule = result.Rules?.[0];
        const days = rule?.AbortIncompleteMultipartUpload?.DaysAfterInitiation;
        if (days !== 1) {
          return yield* Effect.fail("not ready yet" as const);
        }
      }).pipe(
        Effect.retry({
          while: (err) => err === "not ready yet",
          schedule: Schedule.spaced("1 second").pipe(
            Schedule.intersect(Schedule.recurs(10)),
          ),
        }),
      );

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
      expect(config?.BlockPublicAcls).toBe(true);
      expect(config?.IgnorePublicAcls).toBe(true);
      expect(config?.BlockPublicPolicy).toBe(true);
      expect(config?.RestrictPublicBuckets).toBe(true);

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
      expect(updatedPab.PublicAccessBlockConfiguration?.IgnorePublicAcls).toBe(
        false,
      );

      // Delete public access block
      yield* deletePublicAccessBlock({ Bucket: bucket });

      // Verify deletion
      const result = yield* getPublicAccessBlock({ Bucket: bucket }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      expect(result).toEqual("error");
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
      expect(rule?.ObjectOwnership).toEqual("BucketOwnerEnforced");

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
      expect(
        updatedOwnership.OwnershipControls?.Rules?.[0]?.ObjectOwnership,
      ).toEqual("ObjectWriter");

      // Delete ownership controls
      yield* deleteBucketOwnershipControls({ Bucket: bucket });

      // Verify deletion
      const result = yield* getBucketOwnershipControls({
        Bucket: bucket,
      }).pipe(
        Effect.map(() => "success" as const),
        Effect.catchAll(() => Effect.succeed("error" as const)),
      );
      expect(result).toEqual("error");
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
      expect(aclResult.Owner?.ID).toBeDefined();

      // Should have grants
      expect(aclResult.Grants).toBeDefined();
      expect(aclResult.Grants!.length).toBeGreaterThan(0);

      // The owner should have FULL_CONTROL by default
      const fullControlGrant = aclResult.Grants?.find(
        (g) => g.Permission === "FULL_CONTROL",
      );
      expect(fullControlGrant).toBeDefined();
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
      yield* getBucketAccelerateConfiguration({
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
      expect(enabledAccelerate.Status).toEqual("Enabled");

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
      expect(suspendedAccelerate.Status).toEqual("Suspended");
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
      expect(initialPayment.Payer).toEqual("BucketOwner");

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
      expect(requesterPayment.Payer).toEqual("Requester");

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
      expect(ownerPayment.Payer).toEqual("BucketOwner");
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

      expect(result.Body).toBeDefined();

      // Body should be an Effect Stream - consume it
      const actualContent = yield* result.Body!.pipe(
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

      expect(result.Body).toBeDefined();

      // Consume the stream
      const chunks: Uint8Array[] = [];
      yield* Stream.runForEach(result.Body!, (chunk) =>
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

      expect(fullBuffer.length).toEqual(testContent.length);

      for (let i = 0; i < testContent.length; i++) {
        expect(fullBuffer[i]).toEqual(testContent[i]);
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

      expect(result.Body).toBeDefined();

      // Consume the stream
      const actualContent = yield* result.Body!.pipe(
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

      expect(result.ContentType).toEqual("application/json");
      expect(result.ContentLength).toEqual(testContent.length);
      expect(result.ETag).toBeDefined();

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
      expect(tags.TagSet?.length).toEqual(2);
      expect(versioning.Status).toEqual("Enabled");
      expect(
        encryption.ServerSideEncryptionConfiguration?.Rules?.[0]
          ?.ApplyServerSideEncryptionByDefault?.SSEAlgorithm,
      ).toEqual("AES256");
      expect(pab.PublicAccessBlockConfiguration?.BlockPublicAcls).toBe(true);
      expect(lifecycle.Rules?.length).toEqual(1);
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

      expect(initResult.UploadId).toBeDefined();

      const uploadId = initResult.UploadId!;

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

        expect(part1Result.ETag).toBeDefined();

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

        expect(part2Result.ETag).toBeDefined();

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

        expect(result.Body).toBeDefined();

        // Consume the stream
        const chunks: Uint8Array[] = [];
        yield* Stream.runForEach(result.Body!, (chunk) =>
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
        expect(fullBuffer.length).toEqual(expectedLength);

        // Check first few bytes of part 1 (should be 'A' = 65)
        for (let i = 0; i < 100; i++) {
          expect(fullBuffer[i]).toEqual(65);
        }

        // Check last few bytes of part 1 (should be 'A' = 65)
        const part1End = part1Content.length - 1;
        for (let i = part1End - 100; i <= part1End; i++) {
          expect(fullBuffer[i]).toEqual(65);
        }

        // Check part 2 content (should be 'B' = 66)
        const part2Start = part1Content.length;
        for (let i = part2Start; i < fullBuffer.length; i++) {
          expect(fullBuffer[i]).toEqual(66);
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
      expect(result._tag).toEqual("None");

      // Verify we didn't read all chunks (interrupted early)
      // The fact that we got here with timeout means the effect was interrupted
      expect(chunksRead < 100).toBe(true);

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
      expect(result).toEqual("timeout");

      // Verify partial upload (not all chunks)
      expect(chunksRead < 50).toBe(true);

      // Cleanup
      yield* deleteObject({ Bucket: bucket, Key: testKey }).pipe(Effect.ignore);
    }),
  ),
);

// ============================================================================
// Pagination Stream Tests
// ============================================================================

test(
  "listObjectsV2.pages() streams full response pages",
  withBucket("itty-s3-pagination-pages", (bucket) =>
    Effect.gen(function* () {
      // Create multiple test objects
      const objectCount = 5;
      const objectKeys = Array.from(
        { length: objectCount },
        (_, i) => `pagination-test-${i.toString().padStart(3, "0")}.txt`,
      );

      // Upload all test objects
      yield* Effect.all(
        objectKeys.map((key) =>
          putObject({
            Bucket: bucket,
            Key: key,
            Body: `Content for ${key}`,
            ContentType: "text/plain",
          }),
        ),
        { concurrency: 5 },
      );

      // Use .pages() to get full response objects
      const collectedKeys = yield* listObjectsV2
        .pages({ Bucket: bucket, MaxKeys: 2 })
        .pipe(
          // Each emission is a full page (ListObjectsV2Output)
          Stream.flatMap((page) => Stream.fromIterable(page.Contents ?? [])),
          Stream.map((obj) => obj.Key),
          Stream.filter((key): key is string => key !== undefined),
          Stream.runCollect,
        );

      // Verify we got all objects
      const keysArray = Array.from(collectedKeys);
      expect(keysArray.length).toEqual(objectCount);
      expect(keysArray.sort()).toEqual(objectKeys.sort());

      // Cleanup
      yield* Effect.all(
        objectKeys.map((key) => deleteObject({ Bucket: bucket, Key: key })),
        { concurrency: 5 },
      );
    }),
  ),
);

test(
  "listObjectsV2.items() returns empty stream when paginated trait has no items field",
  withBucket("itty-s3-pagination-items", (bucket) =>
    Effect.gen(function* () {
      // Create test objects
      const objectKeys = ["item-test-001.txt", "item-test-002.txt"];

      yield* Effect.all(
        objectKeys.map((key) =>
          putObject({
            Bucket: bucket,
            Key: key,
            Body: `Content for ${key}`,
            ContentType: "text/plain",
          }),
        ),
        { concurrency: 2 },
      );

      // Use .items() - since S3's listObjectsV2 paginated trait doesn't have an items field,
      // it returns an empty stream. Users should use .pages() instead.
      const items = yield* listObjectsV2
        .items({ Bucket: bucket })
        .pipe(Stream.runCollect);

      // Should return empty stream (no items field in pagination trait)
      expect(Array.from(items).length).toEqual(0);

      // Cleanup
      yield* Effect.all(
        objectKeys.map((key) => deleteObject({ Bucket: bucket, Key: key })),
        { concurrency: 2 },
      );
    }),
  ),
);

test(
  "listObjectsV2.pages() handles empty bucket",
  withBucket("itty-s3-pagination-empty", (bucket) =>
    Effect.gen(function* () {
      // Use .pages() on empty bucket
      const pages = yield* listObjectsV2
        .pages({ Bucket: bucket })
        .pipe(Stream.runCollect);

      // Should have exactly one page (even if empty)
      const pagesArray = Array.from(pages);
      expect(pagesArray.length).toEqual(1);
      expect(pagesArray[0].Contents).toBeUndefined();
    }),
  ),
);

test(
  "listObjectsV2.pages() respects Prefix filter",
  withBucket("itty-s3-pagination-prefix", (bucket) =>
    Effect.gen(function* () {
      // Create objects with different prefixes
      const objectKeys = [
        "images/photo-001.jpg",
        "images/photo-002.jpg",
        "documents/file-001.pdf",
        "documents/file-002.pdf",
        "documents/file-003.pdf",
      ];

      yield* Effect.all(
        objectKeys.map((key) =>
          putObject({
            Bucket: bucket,
            Key: key,
            Body: `Content for ${key}`,
            ContentType: "text/plain",
          }),
        ),
        { concurrency: 5 },
      );

      // Use .pages() with Prefix filter for images
      const imageKeys = yield* listObjectsV2
        .pages({ Bucket: bucket, Prefix: "images/", MaxKeys: 1 })
        .pipe(
          Stream.flatMap((page) => Stream.fromIterable(page.Contents ?? [])),
          Stream.map((obj) => obj.Key!),
          Stream.runCollect,
        );

      expect(Array.from(imageKeys).length).toEqual(2);

      // Use .pages() with Prefix filter for documents
      const docKeys = yield* listObjectsV2
        .pages({ Bucket: bucket, Prefix: "documents/", MaxKeys: 1 })
        .pipe(
          Stream.flatMap((page) => Stream.fromIterable(page.Contents ?? [])),
          Stream.map((obj) => obj.Key!),
          Stream.runCollect,
        );

      expect(Array.from(docKeys).length).toEqual(3);

      // Cleanup
      yield* Effect.all(
        objectKeys.map((key) => deleteObject({ Bucket: bucket, Key: key })),
        { concurrency: 5 },
      );
    }),
  ),
);
