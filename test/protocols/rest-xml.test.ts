import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { describe, expect } from "vitest";
import { UnknownAwsError, ValidationException } from "../../src/errors.ts";
import { restXmlProtocol } from "../../src/protocols/rest-xml.ts";
import { makeRequestBuilder } from "../../src/client/request-builder.ts";
import { makeResponseParser } from "../../src/client/response-parser.ts";
import type { Response } from "../../src/client/response.ts";
import {
  CustomOriginConfig,
  DistributionList,
  GetDistributionResult,
  InvalidationList,
  ListDistributionsResult,
  ListInvalidationsResult,
  OriginSslProtocols,
} from "../../src/services/cloudfront.ts";
import {
  // Object operations (from original tests)
  AbortMultipartUploadRequest,
  // Basic bucket operations
  CreateBucketRequest,
  DeleteBucketCorsRequest,
  DeleteBucketEncryptionRequest,
  DeleteBucketPolicyRequest,
  DeleteBucketRequest,
  DeleteBucketTaggingRequest,
  DeletePublicAccessBlockRequest,
  GetBucketAccelerateConfigurationOutput,
  GetBucketAccelerateConfigurationRequest,
  GetBucketAclOutput,
  // ACL
  GetBucketAclRequest,
  GetBucketCorsOutput,
  GetBucketCorsRequest,
  GetBucketEncryptionRequest,
  GetBucketLocationOutput,
  GetBucketLocationRequest,
  GetBucketPolicyOutput,
  GetBucketPolicyRequest,
  GetBucketRequestPaymentOutput,
  GetBucketRequestPaymentRequest,
  GetBucketTaggingOutput,
  GetBucketTaggingRequest,
  GetBucketVersioningOutput,
  GetBucketVersioningRequest,
  GetObjectOutput,
  GetObjectRequest,
  GetPublicAccessBlockOutput,
  GetPublicAccessBlockRequest,
  HeadBucketOutput,
  HeadBucketRequest,
  ListBucketsOutput,
  ListBucketsRequest,
  // Error types
  NoSuchBucket,
  NoSuchKey,
  // Accelerate
  PutBucketAccelerateConfigurationRequest,
  // XML trait tests
  PutBucketAclRequest,
  // CORS
  PutBucketCorsRequest,
  // Encryption
  PutBucketEncryptionRequest,
  // Lifecycle configuration test
  PutBucketLifecycleConfigurationRequest,
  // Policy
  PutBucketPolicyRequest,
  // Request Payment
  PutBucketRequestPaymentRequest,
  // Tagging
  PutBucketTaggingRequest,
  // Versioning
  PutBucketVersioningRequest,
  PutObjectRequest,
  PutObjectRetentionRequest,
  // Public Access Block
  PutPublicAccessBlockRequest,
  // Timestamp format tests
  RenameObjectRequest,
  // Host label tests
  WriteGetObjectResponseRequest,
} from "../../src/services/s3.ts";
import * as T from "../../src/traits.ts";
import { getAwsProtocolsHttpChecksum } from "../../src/traits.ts";
import { readEffectStreamAsText } from "../../src/util/stream.ts";

// Helper to build a request from an instance - gets schema from instance.constructor
const buildRequest = <A, I>(schema: S.Schema<A, I>, instance: A) => {
  const operation = { input: schema, output: schema, errors: [] };
  const builder = makeRequestBuilder(operation, { protocol: restXmlProtocol });
  return builder({ ...instance });
};

// Helper to parse a response using the response parser with restXml protocol
const parseResponse = <A, I>(
  schema: S.Schema<A, I>,
  response: Response,
  errors: S.Schema.AnyNoContext[] = [],
) => {
  const operation = { input: schema, output: schema, errors };
  const parser = makeResponseParser<A, I, never>(operation, {
    protocol: restXmlProtocol,
  });
  return parser(response);
};

describe("restXml protocol", () => {
  // ==========================================================================
  // Basic Bucket Operations
  // ==========================================================================

  describe("bucket lifecycle operations", () => {
    it.effect(
      "CreateBucketRequest - should serialize PUT with bucket path",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(CreateBucketRequest, {
            Bucket: "my-new-bucket",
          });

          expect(request.method).toBe("PUT");
          expect(request.path).toBe("/my-new-bucket");
        }),
    );

    it.effect(
      "DeleteBucketRequest - should serialize DELETE with bucket path",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(DeleteBucketRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("DELETE");
          expect(request.path).toBe("/my-bucket");
        }),
    );

    it.effect(
      "HeadBucketRequest - should serialize HEAD with bucket path",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(HeadBucketRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("HEAD");
          expect(request.path).toBe("/my-bucket");
        }),
    );

    it.effect("HeadBucketOutput - should deserialize response headers", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {
            "x-amz-bucket-region": "us-west-2",
            "x-amz-access-point-alias": "false",
          },
          body: "",
        };

        const result = (yield* parseResponse(
          HeadBucketOutput,
          response,
        )) as Record<string, unknown>;

        expect(result.BucketRegion).toBe("us-west-2");
      }),
    );

    it.effect("ListBucketsRequest - should serialize GET to root", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(ListBucketsRequest, {});

        expect(request.method).toBe("GET");
        expect(request.path).toBe("/");
      }),
    );

    it.effect("ListBucketsOutput - should deserialize bucket list XML", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<ListAllMyBucketsResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <Owner>
    <ID>owner-id-123</ID>
    <DisplayName>owner-name</DisplayName>
  </Owner>
  <Buckets>
    <Bucket>
      <Name>bucket-1</Name>
      <CreationDate>2023-01-01T00:00:00.000Z</CreationDate>
    </Bucket>
    <Bucket>
      <Name>bucket-2</Name>
      <CreationDate>2023-06-15T12:30:00.000Z</CreationDate>
    </Bucket>
  </Buckets>
</ListAllMyBucketsResult>`,
        };

        const result = (yield* parseResponse(
          ListBucketsOutput,
          response,
        )) as Record<string, unknown>;

        expect(result.Owner).toEqual({
          ID: "owner-id-123",
          DisplayName: "owner-name",
        });
        expect(result.Buckets).toHaveLength(2);
        expect((result.Buckets as Array<{ Name: string }>)[0].Name).toBe(
          "bucket-1",
        );
      }),
    );

    it.effect(
      "GetBucketLocationRequest - should serialize with location query param",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(GetBucketLocationRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("GET");
          expect(request.path).toBe("/my-bucket");
          expect(request.query["location"]).toBe("");
        }),
    );

    it.effect(
      "GetBucketLocationOutput - should deserialize unwrapped S3 XML (s3UnwrappedXmlOutput trait)",
      () =>
        Effect.gen(function* () {
          // GetBucketLocationOutput uses s3UnwrappedXmlOutput trait - the response is NOT wrapped
          // in an operation-level XML node. The root element IS the content directly.
          // Standard rest-xml would expect: <LocationConstraint><LocationConstraint>value</LocationConstraint></LocationConstraint>
          // With s3UnwrappedXmlOutput: <LocationConstraint>value</LocationConstraint>
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {},
            body: `<?xml version="1.0" encoding="UTF-8"?>
<LocationConstraint xmlns="http://s3.amazonaws.com/doc/2006-03-01/">us-west-2</LocationConstraint>`,
          };

          const result = (yield* parseResponse(
            GetBucketLocationOutput,
            response,
          )) as {
            LocationConstraint?: string;
          };

          // The s3UnwrappedXmlOutput trait means the text content "us-west-2" is parsed
          // directly into the LocationConstraint field
          expect(result.LocationConstraint).toBe("us-west-2");
        }),
    );

    it.effect(
      "GetBucketLocationOutput - should handle empty location (us-east-1)",
      () =>
        Effect.gen(function* () {
          // Buckets in us-east-1 return an empty LocationConstraint element
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {},
            body: `<?xml version="1.0" encoding="UTF-8"?>
<LocationConstraint xmlns="http://s3.amazonaws.com/doc/2006-03-01/"></LocationConstraint>`,
          };

          const result = (yield* parseResponse(
            GetBucketLocationOutput,
            response,
          )) as {
            LocationConstraint?: string;
          };

          // Empty content should result in undefined LocationConstraint
          expect(result.LocationConstraint).toBeUndefined();
        }),
    );

    it.effect("GetBucketLocationOutput - should handle EU location", () =>
      Effect.gen(function* () {
        // Some old buckets use "EU" which maps to eu-west-1
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<LocationConstraint xmlns="http://s3.amazonaws.com/doc/2006-03-01/">EU</LocationConstraint>`,
        };

        const result = (yield* parseResponse(
          GetBucketLocationOutput,
          response,
        )) as {
          LocationConstraint?: string;
        };

        expect(result.LocationConstraint).toBe("EU");
      }),
    );
  });

  // ==========================================================================
  // Tagging Operations
  // ==========================================================================

  describe("tagging operations", () => {
    it.effect(
      "PutBucketTaggingRequest - should serialize with tagging query and XML body",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(PutBucketTaggingRequest, {
            Bucket: "my-bucket",
            Tagging: {
              TagSet: [
                { Key: "Environment", Value: "Test" },
                { Key: "Project", Value: "Demo" },
              ],
            },
          });

          expect(request.method).toBe("PUT");
          expect(request.path).toBe("/my-bucket");
          expect(request.query["tagging"]).toBe("");
          expect(request.body).toBe(
            '<Tagging xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<TagSet>" +
              "<Tag><Key>Environment</Key><Value>Test</Value></Tag>" +
              "<Tag><Key>Project</Key><Value>Demo</Value></Tag>" +
              "</TagSet>" +
              "</Tagging>",
          );
        }),
    );

    it.effect(
      "GetBucketTaggingRequest - should serialize GET with tagging query",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(GetBucketTaggingRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("GET");
          expect(request.path).toBe("/my-bucket");
          expect(request.query["tagging"]).toBe("");
        }),
    );

    it.effect("GetBucketTaggingOutput - should deserialize tagging XML", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<Tagging xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <TagSet>
    <Tag>
      <Key>Environment</Key>
      <Value>Production</Value>
    </Tag>
    <Tag>
      <Key>Team</Key>
      <Value>Platform</Value>
    </Tag>
  </TagSet>
</Tagging>`,
        };

        const result = yield* parseResponse(GetBucketTaggingOutput, response);

        expect(result.TagSet).toEqual([
          { Key: "Environment", Value: "Production" },
          { Key: "Team", Value: "Platform" },
        ]);
      }),
    );

    it.effect(
      "DeleteBucketTaggingRequest - should serialize DELETE with tagging query",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(DeleteBucketTaggingRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("DELETE");
          expect(request.path).toBe("/my-bucket");
          expect(request.query["tagging"]).toBe("");
        }),
    );
  });

  // ==========================================================================
  // Policy Operations
  // ==========================================================================

  describe("policy operations", () => {
    it.effect(
      "PutBucketPolicyRequest - should serialize with policy in body",
      () =>
        Effect.gen(function* () {
          const policyJson = JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              { Effect: "Deny", Principal: "*", Action: "s3:*", Resource: "*" },
            ],
          });

          const request = yield* buildRequest(PutBucketPolicyRequest, {
            Bucket: "my-bucket",
            Policy: policyJson,
          });

          expect(request.method).toBe("PUT");
          expect(request.path).toBe("/my-bucket");
          expect(request.query["policy"]).toBe("");
          expect(request.body).toBe(policyJson);
        }),
    );

    it.effect(
      "GetBucketPolicyRequest - should serialize GET with policy query",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(GetBucketPolicyRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("GET");
          expect(request.query["policy"]).toBe("");
        }),
    );

    it.effect(
      "GetBucketPolicyOutput - should deserialize policy from body",
      () =>
        Effect.gen(function* () {
          const policyJson = '{"Version":"2012-10-17","Statement":[]}';
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {},
            body: policyJson,
          };

          const result = yield* parseResponse(GetBucketPolicyOutput, response);

          expect(result.Policy).toBe(policyJson);
        }),
    );

    it.effect(
      "DeleteBucketPolicyRequest - should serialize DELETE with policy query",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(DeleteBucketPolicyRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("DELETE");
          expect(request.query["policy"]).toBe("");
        }),
    );
  });

  // ==========================================================================
  // CORS Operations
  // ==========================================================================

  describe("CORS operations", () => {
    it.effect(
      "PutBucketCorsRequest - should serialize CORS configuration",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(PutBucketCorsRequest, {
            Bucket: "my-bucket",
            CORSConfiguration: {
              CORSRules: [
                {
                  AllowedMethods: ["GET", "PUT"],
                  AllowedOrigins: ["https://example.com"],
                  AllowedHeaders: ["*"],
                  MaxAgeSeconds: 3600,
                },
              ],
            },
          });

          expect(request.method).toBe("PUT");
          expect(request.query["cors"]).toBe("");
          expect(request.body).toBe(
            '<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<CORSRule>" +
              "<AllowedHeader>*</AllowedHeader>" +
              "<AllowedMethod>GET</AllowedMethod>" +
              "<AllowedMethod>PUT</AllowedMethod>" +
              "<AllowedOrigin>https://example.com</AllowedOrigin>" +
              "<MaxAgeSeconds>3600</MaxAgeSeconds>" +
              "</CORSRule>" +
              "</CORSConfiguration>",
          );
        }),
    );

    it.effect(
      "GetBucketCorsRequest - should serialize GET with cors query",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(GetBucketCorsRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("GET");
          expect(request.query["cors"]).toBe("");
        }),
    );

    it.effect("GetBucketCorsOutput - should deserialize CORS rules", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <CORSRule>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedOrigin>*</AllowedOrigin>
  </CORSRule>
  <CORSRule>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedOrigin>https://example.com</AllowedOrigin>
  </CORSRule>
</CORSConfiguration>`,
        };

        const result = yield* parseResponse(GetBucketCorsOutput, response);

        expect(result.CORSRules).toEqual([
          { AllowedMethods: ["GET"], AllowedOrigins: ["*"] },
          { AllowedMethods: ["PUT"], AllowedOrigins: ["https://example.com"] },
        ]);
      }),
    );

    it.effect(
      "DeleteBucketCorsRequest - should serialize DELETE with cors query",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(DeleteBucketCorsRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("DELETE");
          expect(request.query["cors"]).toBe("");
        }),
    );
  });

  // ==========================================================================
  // Versioning Operations
  // ==========================================================================

  describe("versioning operations", () => {
    it.effect(
      "PutBucketVersioningRequest - should serialize versioning configuration",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(PutBucketVersioningRequest, {
            Bucket: "my-bucket",
            VersioningConfiguration: {
              Status: "Enabled",
            },
          });

          expect(request.method).toBe("PUT");
          expect(request.query["versioning"]).toBe("");
          expect(request.body).toBe(
            '<VersioningConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<Status>Enabled</Status>" +
              "</VersioningConfiguration>",
          );
        }),
    );

    it.effect(
      "GetBucketVersioningRequest - should serialize GET with versioning query",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(GetBucketVersioningRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("GET");
          expect(request.query["versioning"]).toBe("");
        }),
    );

    it.effect(
      "GetBucketVersioningOutput - should deserialize versioning status",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {},
            body: `<?xml version="1.0" encoding="UTF-8"?>
<VersioningConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <Status>Enabled</Status>
</VersioningConfiguration>`,
          };

          const result = yield* parseResponse(
            GetBucketVersioningOutput,
            response,
          );

          expect(result.Status).toBe("Enabled");
        }),
    );
  });

  // ==========================================================================
  // Encryption Operations
  // ==========================================================================

  describe("encryption operations", () => {
    it.effect(
      "PutBucketEncryptionRequest - should serialize encryption configuration",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(PutBucketEncryptionRequest, {
            Bucket: "my-bucket",
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

          expect(request.method).toBe("PUT");
          expect(request.query["encryption"]).toBe("");
          expect(request.body).toBe(
            '<ServerSideEncryptionConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<Rule>" +
              "<ApplyServerSideEncryptionByDefault>" +
              "<SSEAlgorithm>AES256</SSEAlgorithm>" +
              "</ApplyServerSideEncryptionByDefault>" +
              "<BucketKeyEnabled>true</BucketKeyEnabled>" +
              "</Rule>" +
              "</ServerSideEncryptionConfiguration>",
          );
        }),
    );

    it.effect(
      "GetBucketEncryptionRequest - should serialize GET with encryption query",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(GetBucketEncryptionRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("GET");
          expect(request.query["encryption"]).toBe("");
        }),
    );

    it.effect(
      "DeleteBucketEncryptionRequest - should serialize DELETE with encryption query",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(DeleteBucketEncryptionRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("DELETE");
          expect(request.query["encryption"]).toBe("");
        }),
    );
  });

  // ==========================================================================
  // Public Access Block Operations
  // ==========================================================================

  describe("public access block operations", () => {
    it.effect(
      "PutPublicAccessBlockRequest - should serialize public access block config",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(PutPublicAccessBlockRequest, {
            Bucket: "my-bucket",
            PublicAccessBlockConfiguration: {
              BlockPublicAcls: true,
              IgnorePublicAcls: true,
              BlockPublicPolicy: true,
              RestrictPublicBuckets: true,
            },
          });

          expect(request.method).toBe("PUT");
          expect(request.query["publicAccessBlock"]).toBe("");
          expect(request.body).toBe(
            '<PublicAccessBlockConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<BlockPublicAcls>true</BlockPublicAcls>" +
              "<IgnorePublicAcls>true</IgnorePublicAcls>" +
              "<BlockPublicPolicy>true</BlockPublicPolicy>" +
              "<RestrictPublicBuckets>true</RestrictPublicBuckets>" +
              "</PublicAccessBlockConfiguration>",
          );
        }),
    );

    it.effect(
      "GetPublicAccessBlockRequest - should serialize GET with publicAccessBlock query",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(GetPublicAccessBlockRequest, {
            Bucket: "my-bucket",
          });

          expect(request.method).toBe("GET");
          expect(request.query["publicAccessBlock"]).toBe("");
        }),
    );

    it.effect(
      "GetPublicAccessBlockOutput - should deserialize public access block config",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {},
            body: `<?xml version="1.0" encoding="UTF-8"?>
<PublicAccessBlockConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <BlockPublicAcls>true</BlockPublicAcls>
  <IgnorePublicAcls>true</IgnorePublicAcls>
  <BlockPublicPolicy>false</BlockPublicPolicy>
  <RestrictPublicBuckets>false</RestrictPublicBuckets>
</PublicAccessBlockConfiguration>`,
          };

          const result = yield* parseResponse(
            GetPublicAccessBlockOutput,
            response,
          );

          expect(result.PublicAccessBlockConfiguration).toEqual({
            BlockPublicAcls: true,
            IgnorePublicAcls: true,
            BlockPublicPolicy: false,
            RestrictPublicBuckets: false,
          });
        }),
    );

    it.effect("DeletePublicAccessBlockRequest - should serialize DELETE", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(DeletePublicAccessBlockRequest, {
          Bucket: "my-bucket",
        });

        expect(request.method).toBe("DELETE");
        expect(request.query["publicAccessBlock"]).toBe("");
      }),
    );
  });

  // ==========================================================================
  // ACL Operations
  // ==========================================================================

  describe("ACL operations", () => {
    it.effect("GetBucketAclRequest - should serialize GET with acl query", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetBucketAclRequest, {
          Bucket: "my-bucket",
        });

        expect(request.method).toBe("GET");
        expect(request.query["acl"]).toBe("");
      }),
    );

    it.effect("GetBucketAclOutput - should deserialize ACL XML", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<AccessControlPolicy xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <Owner>
    <ID>owner-id-123</ID>
    <DisplayName>owner-name</DisplayName>
  </Owner>
  <AccessControlList>
    <Grant>
      <Permission>FULL_CONTROL</Permission>
    </Grant>
  </AccessControlList>
</AccessControlPolicy>`,
        };

        const result = yield* parseResponse(GetBucketAclOutput, response);

        expect(result.Owner).toEqual({
          ID: "owner-id-123",
          DisplayName: "owner-name",
        });
        expect(result.Grants).toEqual([{ Permission: "FULL_CONTROL" }]);
      }),
    );
  });

  // ==========================================================================
  // Accelerate Configuration Operations
  // ==========================================================================

  describe("accelerate configuration operations", () => {
    it.effect(
      "PutBucketAccelerateConfigurationRequest - should serialize",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(
            PutBucketAccelerateConfigurationRequest,
            {
              Bucket: "my-bucket",
              AccelerateConfiguration: {
                Status: "Enabled",
              },
            },
          );

          expect(request.method).toBe("PUT");
          expect(request.query["accelerate"]).toBe("");
          expect(request.body).toBe(
            '<AccelerateConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<Status>Enabled</Status>" +
              "</AccelerateConfiguration>",
          );
        }),
    );

    it.effect(
      "GetBucketAccelerateConfigurationRequest - should serialize GET",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(
            GetBucketAccelerateConfigurationRequest,
            {
              Bucket: "my-bucket",
            },
          );

          expect(request.method).toBe("GET");
          expect(request.query["accelerate"]).toBe("");
        }),
    );

    it.effect(
      "GetBucketAccelerateConfigurationOutput - should deserialize",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {},
            body: `<?xml version="1.0" encoding="UTF-8"?>
<AccelerateConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <Status>Enabled</Status>
</AccelerateConfiguration>`,
          };

          const result = yield* parseResponse(
            GetBucketAccelerateConfigurationOutput,
            response,
          );

          expect(result.Status).toBe("Enabled");
        }),
    );
  });

  // ==========================================================================
  // Request Payment Operations
  // ==========================================================================

  describe("request payment operations", () => {
    it.effect("PutBucketRequestPaymentRequest - should serialize", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(PutBucketRequestPaymentRequest, {
          Bucket: "my-bucket",
          RequestPaymentConfiguration: {
            Payer: "Requester",
          },
        });

        expect(request.method).toBe("PUT");
        expect(request.query["requestPayment"]).toBe("");
        expect(request.body).toBe(
          '<RequestPaymentConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
            "<Payer>Requester</Payer>" +
            "</RequestPaymentConfiguration>",
        );
      }),
    );

    it.effect("GetBucketRequestPaymentRequest - should serialize GET", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetBucketRequestPaymentRequest, {
          Bucket: "my-bucket",
        });

        expect(request.method).toBe("GET");
        expect(request.query["requestPayment"]).toBe("");
      }),
    );

    it.effect("GetBucketRequestPaymentOutput - should deserialize", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<RequestPaymentConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <Payer>BucketOwner</Payer>
</RequestPaymentConfiguration>`,
        };

        const result = yield* parseResponse(
          GetBucketRequestPaymentOutput,
          response,
        );

        expect(result.Payer).toBe("BucketOwner");
      }),
    );
  });

  // ==========================================================================
  // Lifecycle Configuration Operations
  // ==========================================================================

  describe("lifecycle configuration operations", () => {
    it.effect(
      "PutBucketLifecycleConfigurationRequest - should serialize with correct xmlName on payload",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(
            PutBucketLifecycleConfigurationRequest,
            {
              Bucket: "test-lifecycle-bucket",
              LifecycleConfiguration: {
                Rules: [
                  {
                    Expiration: {
                      Days: 30,
                    },
                    ID: "rule1",
                    Prefix: "logs/",
                    Status: "Enabled",
                  },
                ],
              },
            },
          );

          expect(request.method).toBe("PUT");
          expect(request.path).toBe("/test-lifecycle-bucket");
          expect(request.query["lifecycle"]).toBe("");
          // The root element should be LifecycleConfiguration (from xmlName trait),
          // NOT BucketLifecycleConfiguration (the class name)
          expect(request.body).toBe(
            '<LifecycleConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<Rule>" +
              "<Expiration><Days>30</Days></Expiration>" +
              "<ID>rule1</ID>" +
              "<Prefix>logs/</Prefix>" +
              "<Status>Enabled</Status>" +
              "</Rule>" +
              "</LifecycleConfiguration>",
          );
        }),
    );

    it.effect(
      "PutBucketLifecycleConfigurationRequest - should serialize rule with Filter and Transitions",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(
            PutBucketLifecycleConfigurationRequest,
            {
              Bucket: "test-lifecycle-bucket-001",
              LifecycleConfiguration: {
                Rules: [
                  {
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
            },
          );

          expect(request.method).toBe("PUT");
          expect(request.path).toBe("/test-lifecycle-bucket-001");
          expect(request.query["lifecycle"]).toBe("");
          expect(request.body).toEqual(
            '<LifecycleConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<Rule>" +
              "<Filter><Prefix>documents/</Prefix></Filter>" +
              "<Status>Enabled</Status>" +
              "<Transition><Days>30</Days><StorageClass>GLACIER</StorageClass></Transition>" +
              "</Rule>" +
              "</LifecycleConfiguration>",
          );
          // Checksum should be added since requestChecksumRequired: true
          expect(request.headers["Content-MD5"]).toBeDefined();
        }),
    );

    it.effect(
      "PutBucketLifecycleConfigurationRequest - should serialize rule with Expiration and deprecated Prefix",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(
            PutBucketLifecycleConfigurationRequest,
            {
              Bucket: "test-lifecycle-bucket-001",
              LifecycleConfiguration: {
                Rules: [
                  {
                    Expiration: {
                      Days: 30,
                    },
                    Prefix: "documents/",
                    Status: "Enabled",
                  },
                ],
              },
            },
          );

          expect(request.method).toBe("PUT");
          expect(request.body).toEqual(
            '<LifecycleConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<Rule>" +
              "<Expiration><Days>30</Days></Expiration>" +
              "<Prefix>documents/</Prefix>" +
              "<Status>Enabled</Status>" +
              "</Rule>" +
              "</LifecycleConfiguration>",
          );
        }),
    );

    it.effect(
      "PutBucketLifecycleConfigurationRequest - should serialize minimal rule with just ID and Status",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(
            PutBucketLifecycleConfigurationRequest,
            {
              Bucket: "test-lifecycle-bucket-001",
              LifecycleConfiguration: {
                Rules: [
                  {
                    ID: "rule1",
                    Status: "Enabled",
                  },
                ],
              },
            },
          );

          expect(request.method).toBe("PUT");
          expect(request.body).toEqual(
            '<LifecycleConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<Rule>" +
              "<ID>rule1</ID>" +
              "<Status>Enabled</Status>" +
              "</Rule>" +
              "</LifecycleConfiguration>",
          );
        }),
    );

    it.effect(
      "PutBucketLifecycleConfigurationRequest - should serialize complete rule with ID, Filter, Expiration, and Transitions",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(
            PutBucketLifecycleConfigurationRequest,
            {
              Bucket: "test-lifecycle-bucket-001",
              LifecycleConfiguration: {
                Rules: [
                  {
                    ID: "TestOnly",
                    Filter: {
                      Prefix: "documents/",
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
            },
          );

          expect(request.method).toBe("PUT");
          // Order should match smithy model: Expiration, ID, Prefix, Filter, Status, Transitions
          expect(request.body).toEqual(
            '<LifecycleConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<Rule>" +
              "<Expiration><Days>3650</Days></Expiration>" +
              "<ID>TestOnly</ID>" +
              "<Filter><Prefix>documents/</Prefix></Filter>" +
              "<Status>Enabled</Status>" +
              "<Transition><Days>365</Days><StorageClass>GLACIER</StorageClass></Transition>" +
              "</Rule>" +
              "</LifecycleConfiguration>",
          );
        }),
    );
  });

  // ==========================================================================
  // Object Operations (from original tests)
  // ==========================================================================

  describe("object operations", () => {
    it.effect(
      "AbortMultipartUploadRequest - should serialize with multiple path labels",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(AbortMultipartUploadRequest, {
            Bucket: "my-bucket",
            Key: "my-key/with/slashes",
            UploadId: "upload-123",
          });

          expect(request.method).toBe("DELETE");
          expect(request.path).toBe("/my-bucket/my-key%2Fwith%2Fslashes");
          expect(request.query["uploadId"]).toBe("upload-123");
          expect(request.query["x-id"]).toBe("AbortMultipartUpload");
        }),
    );

    it.effect("GetObjectRequest - should serialize with headers", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetObjectRequest, {
          Bucket: "my-bucket",
          Key: "my-key",
          IfNoneMatch: '"etag123"',
          Range: "bytes=0-100",
        });

        expect(request.method).toBe("GET");
        expect(request.path).toBe("/my-bucket/my-key");
        expect(request.headers["If-None-Match"]).toBe('"etag123"');
        expect(request.headers["Range"]).toBe("bytes=0-100");
      }),
    );

    it.effect("GetObjectRequest - should serialize with query params", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetObjectRequest, {
          Bucket: "my-bucket",
          Key: "my-key",
          VersionId: "v1",
          PartNumber: 1,
        });

        expect(request.query["versionId"]).toBe("v1");
        expect(request.query["partNumber"]).toBe("1");
      }),
    );

    it.effect(
      "PutObjectRequest - should serialize with prefix headers (metadata)",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(PutObjectRequest, {
            Bucket: "my-bucket",
            Key: "my-key",
            Metadata: {
              "custom-header": "custom-value",
              author: "test",
            },
          });

          expect(request.headers["x-amz-meta-custom-header"]).toBe(
            "custom-value",
          );
          expect(request.headers["x-amz-meta-author"]).toBe("test");
        }),
    );

    it.effect("GetObjectOutput - should deserialize response headers", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {
            etag: '"abc123"',
            "content-length": "1024",
            "content-type": "application/octet-stream",
            "x-amz-version-id": "v1",
          },
          body: "file content",
        };

        const result = yield* parseResponse(GetObjectOutput, response);

        expect(result.ETag).toBe('"abc123"');
        expect(result.ContentLength).toBe(1024);
        expect(result.ContentType).toBe("application/octet-stream");
        expect(result.VersionId).toBe("v1");
      }),
    );

    it.effect(
      "GetObjectOutput - should deserialize httpPrefixHeaders (Metadata)",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {
              etag: '"abc123"',
              "content-type": "application/octet-stream",
              "x-amz-meta-author": "john",
              "x-amz-meta-custom-key": "custom-value",
            },
            body: "file content",
          };

          const result = yield* parseResponse(GetObjectOutput, response);

          expect(result.Metadata).toEqual({
            author: "john",
            "custom-key": "custom-value",
          });
        }),
    );

    it.effect("GetObjectOutput - should deserialize streaming body", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {
            "content-type": "application/octet-stream",
          },
          body: "raw file content here",
        };

        const result = yield* parseResponse(GetObjectOutput, response);

        expect(yield* readEffectStreamAsText(result.Body!)).toBe(
          "raw file content here",
        );
      }),
    );
  });

  // ==========================================================================
  // Timestamp Format Tests
  // ==========================================================================

  describe("timestamp format serialization", () => {
    it.effect(
      "should serialize header timestamps with http-date format when annotated",
      () =>
        Effect.gen(function* () {
          const testDate = new Date("2024-01-15T12:30:00.000Z");
          const request = yield* buildRequest(RenameObjectRequest, {
            Bucket: "my-bucket",
            Key: "my-key",
            RenameSource: "/source-bucket/source-key",
            SourceIfModifiedSince: testDate,
          });

          expect(request.headers["x-amz-rename-source-if-modified-since"]).toBe(
            "Mon, 15 Jan 2024 12:30:00 GMT",
          );
        }),
    );

    it.effect(
      "should serialize header timestamps with http-date by default",
      () =>
        Effect.gen(function* () {
          const testDate = new Date("2024-06-20T08:15:30.000Z");
          const request = yield* buildRequest(RenameObjectRequest, {
            Bucket: "my-bucket",
            Key: "my-key",
            RenameSource: "/source-bucket/source-key",
            DestinationIfModifiedSince: testDate,
          });

          expect(request.headers["If-Modified-Since"]).toBe(
            "Thu, 20 Jun 2024 08:15:30 GMT",
          );
        }),
    );

    it.effect(
      "should serialize XML body timestamps with date-time (ISO 8601) format",
      () =>
        Effect.gen(function* () {
          const testDate = new Date("2025-12-31T23:59:59.000Z");
          const request = yield* buildRequest(PutObjectRetentionRequest, {
            Bucket: "my-bucket",
            Key: "my-key",
            Retention: {
              Mode: "GOVERNANCE",
              RetainUntilDate: testDate,
            },
          });

          // The root element is "Retention" because the member has xmlName="Retention"
          // (not ObjectLockRetention which is the type name)
          expect(request.body).toBe(
            '<Retention xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<Mode>GOVERNANCE</Mode>" +
              "<RetainUntilDate>2025-12-31T23:59:59.000Z</RetainUntilDate>" +
              "</Retention>",
          );
        }),
    );
  });

  // ==========================================================================
  // XML Trait Tests (xmlName, xmlFlattened, xmlAttribute)
  // ==========================================================================

  describe("XML trait serialization", () => {
    it.effect(
      "should serialize xmlName on array property (Grants -> AccessControlList)",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(PutBucketAclRequest, {
            Bucket: "my-bucket",
            AccessControlPolicy: {
              Owner: {
                ID: "owner-id",
                DisplayName: "owner-name",
              },
              Grants: [
                {
                  Grantee: {
                    Type: "CanonicalUser",
                    ID: "grantee-id",
                    DisplayName: "grantee-name",
                  },
                  Permission: "FULL_CONTROL",
                },
              ],
            },
          });

          expect(request.body).toBe(
            '<AccessControlPolicy xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<AccessControlList>" +
              "<Grant>" +
              '<Grantee xsi:type="CanonicalUser">' +
              "<DisplayName>grantee-name</DisplayName>" +
              "<ID>grantee-id</ID>" +
              "</Grantee>" +
              "<Permission>FULL_CONTROL</Permission>" +
              "</Grant>" +
              "</AccessControlList>" +
              "<Owner>" +
              "<DisplayName>owner-name</DisplayName>" +
              "<ID>owner-id</ID>" +
              "</Owner>" +
              "</AccessControlPolicy>",
          );
        }),
    );

    it.effect(
      "should serialize xmlFlattened + xmlName (CORSRules -> CORSRule)",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(PutBucketCorsRequest, {
            Bucket: "my-bucket",
            CORSConfiguration: {
              CORSRules: [
                {
                  AllowedMethods: ["GET", "PUT"],
                  AllowedOrigins: ["https://example.com"],
                },
              ],
            },
          });

          expect(request.body).toBe(
            '<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
              "<CORSRule>" +
              "<AllowedMethod>GET</AllowedMethod>" +
              "<AllowedMethod>PUT</AllowedMethod>" +
              "<AllowedOrigin>https://example.com</AllowedOrigin>" +
              "</CORSRule>" +
              "</CORSConfiguration>",
          );
        }),
    );

    it.effect("should serialize multiple flattened items correctly", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(PutBucketCorsRequest, {
          Bucket: "my-bucket",
          CORSConfiguration: {
            CORSRules: [
              {
                AllowedMethods: ["GET"],
                AllowedOrigins: ["https://example.com"],
              },
              {
                AllowedMethods: ["PUT"],
                AllowedOrigins: ["https://other.com"],
              },
            ],
          },
        });

        expect(request.body).toBe(
          '<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">' +
            "<CORSRule>" +
            "<AllowedMethod>GET</AllowedMethod>" +
            "<AllowedOrigin>https://example.com</AllowedOrigin>" +
            "</CORSRule>" +
            "<CORSRule>" +
            "<AllowedMethod>PUT</AllowedMethod>" +
            "<AllowedOrigin>https://other.com</AllowedOrigin>" +
            "</CORSRule>" +
            "</CORSConfiguration>",
        );
      }),
    );
  });

  describe("XML trait deserialization", () => {
    it.effect(
      "should deserialize xmlName on response root (CORSConfiguration)",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {},
            body:
              "<CORSConfiguration>" +
              "<CORSRule>" +
              "<AllowedMethod>GET</AllowedMethod>" +
              "<AllowedOrigin>*</AllowedOrigin>" +
              "</CORSRule>" +
              "</CORSConfiguration>",
          };

          const result = yield* parseResponse(GetBucketCorsOutput, response);

          expect(result.CORSRules).toEqual([
            { AllowedMethods: ["GET"], AllowedOrigins: ["*"] },
          ]);
        }),
    );

    it.effect("should deserialize multiple flattened items", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body:
            "<CORSConfiguration>" +
            "<CORSRule>" +
            "<AllowedMethod>GET</AllowedMethod>" +
            "<AllowedOrigin>https://a.com</AllowedOrigin>" +
            "</CORSRule>" +
            "<CORSRule>" +
            "<AllowedMethod>PUT</AllowedMethod>" +
            "<AllowedOrigin>https://b.com</AllowedOrigin>" +
            "</CORSRule>" +
            "</CORSConfiguration>",
        };

        const result = yield* parseResponse(GetBucketCorsOutput, response);

        expect(result.CORSRules).toEqual([
          { AllowedMethods: ["GET"], AllowedOrigins: ["https://a.com"] },
          { AllowedMethods: ["PUT"], AllowedOrigins: ["https://b.com"] },
        ]);
      }),
    );

    it.effect(
      "should deserialize xmlName on nested property (Grants -> AccessControlList)",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {},
            body:
              "<AccessControlPolicy>" +
              "<Owner><ID>owner-id</ID></Owner>" +
              "<AccessControlList>" +
              "<Grant>" +
              '<Grantee xsi:type="CanonicalUser"><ID>grantee-id</ID></Grantee>' +
              "<Permission>FULL_CONTROL</Permission>" +
              "</Grant>" +
              "</AccessControlList>" +
              "</AccessControlPolicy>",
          };

          const result = yield* parseResponse(GetBucketAclOutput, response);

          expect(result.Owner).toEqual({ ID: "owner-id" });
          expect(result.Grants).toEqual([
            {
              Grantee: { Type: "CanonicalUser", ID: "grantee-id" },
              Permission: "FULL_CONTROL",
            },
          ]);
        }),
    );

    it.effect("should deserialize xmlAttribute (xsi:type on Grantee)", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body:
            "<AccessControlPolicy>" +
            "<Owner><ID>owner-id</ID><DisplayName>owner-name</DisplayName></Owner>" +
            "<AccessControlList>" +
            "<Grant>" +
            '<Grantee xsi:type="CanonicalUser">' +
            "<ID>grantee-id</ID>" +
            "<DisplayName>grantee-name</DisplayName>" +
            "</Grantee>" +
            "<Permission>FULL_CONTROL</Permission>" +
            "</Grant>" +
            "</AccessControlList>" +
            "</AccessControlPolicy>",
        };

        const result = yield* parseResponse(GetBucketAclOutput, response);

        expect(result.Owner).toEqual({
          ID: "owner-id",
          DisplayName: "owner-name",
        });
        expect(result.Grants).toEqual([
          {
            Grantee: {
              Type: "CanonicalUser",
              ID: "grantee-id",
              DisplayName: "grantee-name",
            },
            Permission: "FULL_CONTROL",
          },
        ]);
      }),
    );
  });

  // ==========================================================================
  // Host Label Tests
  // ==========================================================================

  describe("host label annotation", () => {
    it.effect("should serialize hostLabel-annotated fields as headers", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(WriteGetObjectResponseRequest, {
          RequestRoute: "my-route-token",
          RequestToken: "my-request-token",
        });

        expect(request.method).toBe("POST");
        expect(request.path).toBe("/WriteGetObjectResponse");
        expect(request.headers["x-amz-request-route"]).toBe("my-route-token");
        expect(request.headers["x-amz-request-token"]).toBe("my-request-token");
      }),
    );
  });

  // ==========================================================================
  // HTTP Checksum Trait Tests
  // ==========================================================================

  describe("httpChecksum middleware", () => {
    it.effect(
      "should compute MD5 checksum when requestChecksumRequired is true",
      () =>
        Effect.gen(function* () {
          // PutBucketTagging has requestChecksumRequired: true
          // buildRequest applies middleware automatically
          const request = yield* buildRequest(PutBucketTaggingRequest, {
            Bucket: "my-bucket",
            Tagging: {
              TagSet: [{ Key: "env", Value: "test" }],
            },
          });

          // MD5 checksum should be added by middleware
          expect(request.headers["Content-MD5"]).toBe(
            "mkTVbGfHQAC6s8ppa7bemQ==",
          );
        }),
    );

    it.effect("should compute CRC32 checksum when algorithm is specified", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(PutBucketTaggingRequest, {
          Bucket: "my-bucket",
          ChecksumAlgorithm: "CRC32",
          Tagging: {
            TagSet: [{ Key: "env", Value: "test" }],
          },
        });

        // CRC32 checksum should be added by middleware
        expect(request.headers["x-amz-checksum-crc32"]).toBe("DNRZQQ==");
      }),
    );

    it.effect("should not add checksum if Content-MD5 already provided", () =>
      Effect.gen(function* () {
        const existingMd5 = "rL0Y20zC+Fzt72VPzMSk2A==";
        const request = yield* buildRequest(PutBucketTaggingRequest, {
          Bucket: "my-bucket",
          ContentMD5: existingMd5,
          Tagging: {
            TagSet: [{ Key: "env", Value: "test" }],
          },
        });

        // Should keep the existing MD5
        expect(request.headers["Content-MD5"]).toBe(existingMd5);
      }),
    );

    it.effect(
      "should not add checksum when not required and no algorithm specified",
      () =>
        Effect.gen(function* () {
          // PutObject has httpChecksum but NOT requestChecksumRequired
          const request = yield* buildRequest(PutObjectRequest, {
            Bucket: "my-bucket",
            Key: "my-key",
            Body: "test content",
          });

          // Should NOT have Content-MD5 header (not required)
          expect(request.headers["Content-MD5"]).toBeUndefined();
        }),
    );

    it.effect(
      "should add CRC32 checksum to PutObject when algorithm specified",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(PutObjectRequest, {
            Bucket: "my-bucket",
            Key: "my-key",
            Body: "test content",
            ChecksumAlgorithm: "CRC32",
          });

          // CRC32 checksum should be added by middleware
          expect(request.headers["x-amz-checksum-crc32"]).toBe("V/RnXQ==");
        }),
    );

    it("should detect responseAlgorithms on GetObjectRequest", () => {
      // GetObject has aws.protocols#httpChecksum with responseAlgorithms
      const checksum = getAwsProtocolsHttpChecksum(GetObjectRequest.ast);

      expect(checksum).toBeDefined();
      expect(checksum?.responseAlgorithms).toEqual([
        "CRC64NVME",
        "CRC32",
        "CRC32C",
        "SHA256",
        "SHA1",
      ]);
    });
  });

  // ==========================================================================
  // Error Deserialization
  // ==========================================================================

  describe("error deserialization", () => {
    it.effect("should deserialize wrapped error (ErrorResponse > Error)", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 404,
          statusText: "Not Found",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<ErrorResponse>
  <Error>
    <Type>Sender</Type>
    <Code>NoSuchBucket</Code>
    <Message>The specified bucket does not exist</Message>
    <BucketName>my-bucket</BucketName>
  </Error>
  <RequestId>abc123</RequestId>
</ErrorResponse>`,
        };

        const result = yield* parseResponse(GetBucketAclRequest, response, [
          NoSuchBucket,
        ]).pipe(Effect.flip);

        expect(result).toBeInstanceOf(NoSuchBucket);
        expect(result._tag).toBe("NoSuchBucket");
      }),
    );

    it.effect("should deserialize unwrapped error (just Error element)", () =>
      Effect.gen(function* () {
        // Some S3 errors use unwrapped format
        const response: Response = {
          status: 404,
          statusText: "Not Found",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<Error>
  <Code>NoSuchKey</Code>
  <Message>The specified key does not exist.</Message>
  <Key>my-object.txt</Key>
  <RequestId>xyz789</RequestId>
</Error>`,
        };

        const result = yield* parseResponse(GetObjectRequest, response, [
          NoSuchKey,
        ]).pipe(Effect.flip);

        expect(result).toBeInstanceOf(NoSuchKey);
        expect(result._tag).toBe("NoSuchKey");
      }),
    );

    it.effect(
      "should preserve error data fields (Message, Type, RequestId)",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 404,
            statusText: "Not Found",
            headers: {},
            body: `<?xml version="1.0" encoding="UTF-8"?>
<ErrorResponse>
  <Error>
    <Type>Sender</Type>
    <Code>NoSuchBucket</Code>
    <Message>Bucket not found</Message>
  </Error>
  <RequestId>req-123</RequestId>
</ErrorResponse>`,
          };

          const result = yield* parseResponse(GetBucketAclRequest, response, [
            NoSuchBucket,
          ]).pipe(Effect.flip);

          expect(result).toBeInstanceOf(NoSuchBucket);
        }),
    );

    it.effect("should match common AWS errors", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 400,
          statusText: "Bad Request",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<ErrorResponse>
  <Error>
    <Type>Sender</Type>
    <Code>ValidationException</Code>
    <Message>Invalid parameter</Message>
  </Error>
</ErrorResponse>`,
        };

        const result = yield* parseResponse(
          GetBucketAclRequest,
          response,
          [],
        ).pipe(Effect.flip);

        expect(result).toBeInstanceOf(ValidationException);
      }),
    );

    it.effect("should return UnknownAwsError for unknown error codes", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 500,
          statusText: "Internal Server Error",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<ErrorResponse>
  <Error>
    <Type>Receiver</Type>
    <Code>SomeFutureError</Code>
    <Message>Something unexpected happened</Message>
  </Error>
  <RequestId>err-456</RequestId>
</ErrorResponse>`,
        };

        const result = yield* parseResponse(
          GetBucketAclRequest,
          response,
          [],
        ).pipe(Effect.flip);

        expect(result).toBeInstanceOf(UnknownAwsError);
        expect((result as UnknownAwsError).errorTag).toBe("SomeFutureError");
        expect((result as UnknownAwsError).errorData).toMatchObject({
          Type: "Receiver",
          Message: "Something unexpected happened",
        });
      }),
    );

    it.effect(
      "should parse HTML error response (S3 503 Slow Down rate limiting)",
      () =>
        Effect.gen(function* () {
          // S3 sometimes returns HTML error pages instead of XML for rate limiting
          const response: Response = {
            status: 503,
            statusText: "Slow Down",
            headers: {},
            body: `<html><head><title>503 Slow Down</title></head><body><h1>503 Slow Down</h1><ul><li>Code: SlowDown</li><li>Message: Please reduce your request rate.</li><li>RequestId: 5DE775E75ED42248</li><li>HostId: 0cUpx5CTQ/FCM/BeLYxATn1Vt0hPrZF9b/OZ6dN2+YLipYzX6oYyizTxcPyHyKhdbZ7Jevc9KsxBppUYLyEQR5tH8J4mVUb5enUJ/NN1GwOsPeqKBU1+epIwkq4Jh4YS</li></ul><hr/></body></html>`,
          };

          const result = yield* parseResponse(
            GetBucketAclRequest,
            response,
            [],
          ).pipe(Effect.flip);

          expect(result).toBeInstanceOf(UnknownAwsError);
          expect((result as UnknownAwsError).errorTag).toBe("SlowDown");
          expect((result as UnknownAwsError).errorData).toMatchObject({
            Message: "Please reduce your request rate.",
          });
        }),
    );

    it.effect("should parse HTML error response with minimal content", () =>
      Effect.gen(function* () {
        // Minimal HTML error with just Code (no Message)
        const response: Response = {
          status: 503,
          statusText: "Service Unavailable",
          headers: {},
          body: `<html><body><ul><li>Code: BandwidthLimitExceeded</li></ul></body></html>`,
        };

        const result = yield* parseResponse(
          GetBucketAclRequest,
          response,
          [],
        ).pipe(Effect.flip);

        expect(result).toBeInstanceOf(UnknownAwsError);
        expect((result as UnknownAwsError).errorTag).toBe(
          "BandwidthLimitExceeded",
        );
      }),
    );

    it.effect("should parse HTML error response case-insensitively", () =>
      Effect.gen(function* () {
        // HTML tag in uppercase
        const response: Response = {
          status: 503,
          statusText: "Slow Down",
          headers: {},
          body: `<HTML><head><title>503 Slow Down</title></head><body><ul><li>Code: SlowDown</li><li>Message: Rate limited</li></ul></body></HTML>`,
        };

        const result = yield* parseResponse(
          GetBucketAclRequest,
          response,
          [],
        ).pipe(Effect.flip);

        expect(result).toBeInstanceOf(UnknownAwsError);
        expect((result as UnknownAwsError).errorTag).toBe("SlowDown");
      }),
    );
  });

  // ==========================================================================
  // HTTP Response Code Trait Tests
  // ==========================================================================

  describe("httpResponseCode trait", () => {
    // Synthetic schema to test httpResponseCode support in rest-xml
    // (No real AWS rest-xml API uses this, but the Smithy spec requires support)
    class TestResponseCodeOutput extends S.Class<TestResponseCodeOutput>(
      "TestResponseCodeOutput",
    )({
      StatusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
      Message: S.optional(S.String),
    }) {}

    it.effect(
      "should deserialize HTTP response status code into annotated field",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 201,
            statusText: "Created",
            headers: {},
            body: `<?xml version="1.0" encoding="UTF-8"?>
<TestResponseCodeOutput>
  <Message>Resource created successfully</Message>
</TestResponseCodeOutput>`,
          };

          const result = yield* parseResponse(TestResponseCodeOutput, response);

          expect(result.StatusCode).toBe(201);
          expect(result.Message).toBe("Resource created successfully");
        }),
    );

    it.effect("should handle 200 status code", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body: "",
        };

        const result = yield* parseResponse(TestResponseCodeOutput, response);

        expect(result.StatusCode).toBe(200);
      }),
    );

    it.effect("should handle 204 No Content status code", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 204,
          statusText: "No Content",
          headers: {},
          body: "",
        };

        const result = yield* parseResponse(TestResponseCodeOutput, response);

        expect(result.StatusCode).toBe(204);
      }),
    );

    it.effect("should work alongside header-bound properties", () =>
      Effect.gen(function* () {
        // Schema with both responseCode and header bindings
        class TestMixedOutput extends S.Class<TestMixedOutput>(
          "TestMixedOutput",
        )({
          StatusCode: S.optional(S.Number).pipe(T.HttpResponseCode()),
          ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
          ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
        }) {}

        const response: Response = {
          status: 202,
          statusText: "Accepted",
          headers: {
            "content-type": "application/xml",
            etag: '"abc123"',
          },
          body: "",
        };

        const result = yield* parseResponse(TestMixedOutput, response);

        expect(result.StatusCode).toBe(202);
        expect(result.ContentType).toBe("application/xml");
        expect(result.ETag).toBe('"abc123"');
      }),
    );
  });

  // ==========================================================================
  // CloudFront Edge Cases - Real Schemas from Generated Service
  // ==========================================================================

  describe("CloudFront edge cases", () => {
    it.effect(
      "should deserialize OriginSslProtocols with XmlName-annotated string array elements",
      () =>
        Effect.gen(function* () {
          // This tests the fix for arrays where element type has XmlName annotation
          // CloudFront's SslProtocolsList = S.Array(S.String.pipe(T.XmlName("SslProtocol")))
          // The Items field is wrapped (not flattened), so XML has <Items><SslProtocol>...</SslProtocol></Items>
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {},
            body: `<?xml version="1.0" encoding="UTF-8"?>
<CustomOriginConfig>
  <HTTPPort>80</HTTPPort>
  <HTTPSPort>443</HTTPSPort>
  <OriginProtocolPolicy>https-only</OriginProtocolPolicy>
  <OriginSslProtocols>
    <Quantity>2</Quantity>
    <Items>
      <SslProtocol>TLSv1.2</SslProtocol>
      <SslProtocol>TLSv1.1</SslProtocol>
    </Items>
  </OriginSslProtocols>
</CustomOriginConfig>`,
          };

          const result = yield* parseResponse(CustomOriginConfig, response);

          expect(result.HTTPPort).toBe(80);
          expect(result.HTTPSPort).toBe(443);
          expect(result.OriginProtocolPolicy).toBe("https-only");
          expect(result.OriginSslProtocols).toEqual({
            Quantity: 2,
            Items: ["TLSv1.2", "TLSv1.1"],
          });
        }),
    );

    it.effect("should deserialize OriginSslProtocols with single element", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<OriginSslProtocols>
  <Quantity>1</Quantity>
  <Items>
    <SslProtocol>TLSv1.2</SslProtocol>
  </Items>
</OriginSslProtocols>`,
        };

        const result = yield* parseResponse(OriginSslProtocols, response);

        expect(result.Quantity).toBe(1);
        expect(result.Items).toEqual(["TLSv1.2"]);
      }),
    );

    it.effect(
      "should deserialize DistributionList with optional Marker field (patched schema)",
      () =>
        Effect.gen(function* () {
          // AWS returns Marker as empty when not paginating, but Smithy marks it required
          // This tests our patch that makes Marker optional
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {},
            body: `<?xml version="1.0" encoding="UTF-8"?>
<DistributionList>
  <MaxItems>100</MaxItems>
  <IsTruncated>false</IsTruncated>
  <Quantity>0</Quantity>
</DistributionList>`,
          };

          const result = yield* parseResponse(DistributionList, response);

          expect(result.MaxItems).toBe(100);
          expect(result.IsTruncated).toBe(false);
          expect(result.Quantity).toBe(0);
          expect(result.Marker).toBeUndefined();
        }),
    );

    it.effect(
      "should deserialize InvalidationList with optional Marker field",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {},
            body: `<?xml version="1.0" encoding="UTF-8"?>
<InvalidationList>
  <MaxItems>100</MaxItems>
  <IsTruncated>false</IsTruncated>
  <Quantity>1</Quantity>
  <Items>
    <InvalidationSummary>
      <Id>ABCD1234</Id>
      <CreateTime>2024-01-15T12:00:00Z</CreateTime>
      <Status>Completed</Status>
    </InvalidationSummary>
  </Items>
</InvalidationList>`,
          };

          const result = yield* parseResponse(InvalidationList, response);

          expect(result.MaxItems).toBe(100);
          expect(result.IsTruncated).toBe(false);
          expect(result.Quantity).toBe(1);
          expect(result.Marker).toBeUndefined();
          expect(result.Items?.[0]?.Id).toBe("ABCD1234");
        }),
    );

    it.effect(
      "should deserialize ListDistributionsResult with header-bound ETag and payload",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {
              etag: '"abc123"',
            },
            body: `<?xml version="1.0" encoding="UTF-8"?>
<DistributionList>
  <MaxItems>100</MaxItems>
  <IsTruncated>false</IsTruncated>
  <Quantity>0</Quantity>
</DistributionList>`,
          };

          const result = yield* parseResponse(
            ListDistributionsResult,
            response,
          );

          expect(result.DistributionList?.MaxItems).toBe(100);
          expect(result.DistributionList?.Quantity).toBe(0);
        }),
    );

    it.effect(
      "should deserialize ListInvalidationsResult with header-bound ETag",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {},
            body: `<?xml version="1.0" encoding="UTF-8"?>
<InvalidationList>
  <MaxItems>100</MaxItems>
  <IsTruncated>false</IsTruncated>
  <Quantity>0</Quantity>
</InvalidationList>`,
          };

          const result = yield* parseResponse(
            ListInvalidationsResult,
            response,
          );

          expect(result.InvalidationList?.MaxItems).toBe(100);
          expect(result.InvalidationList?.Quantity).toBe(0);
        }),
    );

    it.effect(
      "should deserialize GetDistributionResult with nested CustomOriginConfig containing OriginSslProtocols",
      () =>
        Effect.gen(function* () {
          // This is the full integration test - Distribution contains Origins
          // which contains CustomOriginConfig which contains OriginSslProtocols
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: {
              etag: '"dist-etag"',
            },
            body: `<?xml version="1.0" encoding="UTF-8"?>
<Distribution>
  <Id>EDFDVBD6EXAMPLE</Id>
  <ARN>arn:aws:cloudfront::123456789012:distribution/EDFDVBD6EXAMPLE</ARN>
  <Status>Deployed</Status>
  <LastModifiedTime>2024-01-15T12:00:00Z</LastModifiedTime>
  <InProgressInvalidationBatches>0</InProgressInvalidationBatches>
  <DomainName>d111111abcdef8.cloudfront.net</DomainName>
  <DistributionConfig>
    <CallerReference>my-distribution-2024</CallerReference>
    <Comment>Test distribution</Comment>
    <Enabled>true</Enabled>
    <Origins>
      <Quantity>1</Quantity>
      <Items>
        <Origin>
          <Id>my-origin</Id>
          <DomainName>example.com</DomainName>
          <OriginPath></OriginPath>
          <CustomHeaders>
            <Quantity>0</Quantity>
          </CustomHeaders>
          <CustomOriginConfig>
            <HTTPPort>80</HTTPPort>
            <HTTPSPort>443</HTTPSPort>
            <OriginProtocolPolicy>https-only</OriginProtocolPolicy>
            <OriginSslProtocols>
              <Quantity>2</Quantity>
              <Items>
                <SslProtocol>TLSv1.2</SslProtocol>
                <SslProtocol>TLSv1.1</SslProtocol>
              </Items>
            </OriginSslProtocols>
          </CustomOriginConfig>
          <ConnectionAttempts>3</ConnectionAttempts>
          <ConnectionTimeout>10</ConnectionTimeout>
        </Origin>
      </Items>
    </Origins>
    <DefaultCacheBehavior>
      <TargetOriginId>my-origin</TargetOriginId>
      <ViewerProtocolPolicy>redirect-to-https</ViewerProtocolPolicy>
      <Compress>true</Compress>
      <CachePolicyId>658327ea-f89d-4fab-a63d-7e88639e58f6</CachePolicyId>
    </DefaultCacheBehavior>
    <PriceClass>PriceClass_All</PriceClass>
    <HttpVersion>http2</HttpVersion>
    <IsIPV6Enabled>true</IsIPV6Enabled>
    <Staging>false</Staging>
  </DistributionConfig>
</Distribution>`,
          };

          const result = yield* parseResponse(GetDistributionResult, response);

          expect(result.ETag).toBe('"dist-etag"');
          expect(result.Distribution?.Id).toBe("EDFDVBD6EXAMPLE");
          expect(result.Distribution?.Status).toBe("Deployed");

          const origin =
            result.Distribution?.DistributionConfig?.Origins?.Items?.[0];
          expect(origin?.Id).toBe("my-origin");
          expect(origin?.CustomOriginConfig?.HTTPPort).toBe(80);
          expect(origin?.CustomOriginConfig?.OriginSslProtocols).toEqual({
            Quantity: 2,
            Items: ["TLSv1.2", "TLSv1.1"],
          });
        }),
    );
  });
});
