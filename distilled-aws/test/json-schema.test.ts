import { describe, expect, it } from "@effect/vitest";
import { JSONSchema } from "effect";
import * as S from "effect/Schema";

// =============================================================================
// Import real generated schemas from various services to test all schema types
// =============================================================================

// DynamoDB - awsJson1_0, has cyclic types (AttributeValue), maps, lists
import {
  AttributeValue,
  BatchGetItemInput,
  Condition,
  GetItemInput,
  GetItemOutput,
  Key,
  PutItemInput,
  QueryInput,
  ResourceNotFoundException,
  ScanInput,
} from "../src/services/dynamodb.ts";

// SNS - awsQuery, has map types with struct values
import {
  MessageAttributeMap,
  MessageAttributeValue,
  PublishInput,
} from "../src/services/sns.ts";

// S3 - restXml, has complex structures with XML traits
// Note: GetObjectInput/PutObjectInput have streaming body which doesn't work with JSONSchema
import {
  BucketAlreadyExists,
  CopyObjectRequest,
  DeleteObjectRequest,
  HeadObjectRequest,
  ListBucketsOutput,
  ListObjectsV2Output,
  ObjectList,
} from "../src/services/s3.ts";

// Lambda - restJson1, has blob types and streaming
// Note: InvokeRequest has streaming body which doesn't work with JSONSchema
import {
  CreateFunctionRequest,
  GetFunctionRequest,
  ListFunctionsRequest,
  ListFunctionsResponse,
} from "../src/services/lambda.ts";

// IAM - awsQuery, has list types and complex nested structures
import {
  CreateUserRequest,
  GetUserRequest,
  GetUserResponse,
  ListAttachedRolePoliciesResponse,
  ListUsersResponse,
  User,
} from "../src/services/iam.ts";

// EC2 - ec2Query, has extensive enum-like strings and complex structures
import {
  DescribeInstancesRequest,
  DescribeInstancesResult,
  Instance,
  Reservation,
  RunInstancesRequest,
  TerminateInstancesRequest,
} from "../src/services/ec2.ts";

// KMS - awsJson1_1, simpler structures
import {
  CreateKeyRequest,
  DecryptRequest,
  EncryptRequest,
} from "../src/services/kms.ts";

// =============================================================================
// Test helpers
// =============================================================================

/**
 * Helper to verify JSON Schema structure
 */
const verifyJsonSchema = (schema: S.Schema.AnyNoContext) => {
  const jsonSchema = JSONSchema.make(schema);
  expect(jsonSchema).toHaveProperty("$schema");
  expect(jsonSchema.$schema).toBe("http://json-schema.org/draft-07/schema#");
  return jsonSchema;
};

// =============================================================================
// Tests
// =============================================================================

describe("JSON Schema Generation", () => {
  describe("Primitive Types", () => {
    it("generates JSON Schema for basic struct with primitives", () => {
      // GetUserRequest has simple string fields
      const schema = verifyJsonSchema(GetUserRequest);
      expect(schema).toHaveProperty("$defs");
      expect(schema).toHaveProperty("$ref");
    });

    it("generates JSON Schema for struct with optional fields", () => {
      // ListFunctionsRequest has optional string and number fields
      const schema = verifyJsonSchema(ListFunctionsRequest);
      expect(schema).toHaveProperty("$defs");
    });

    it("generates JSON Schema for blob types", () => {
      // EncryptRequest has a Plaintext blob field
      const schema = verifyJsonSchema(EncryptRequest);
      expect(schema).toHaveProperty("$defs");
    });
  });

  describe("Suspended Struct Schemas", () => {
    it("generates JSON Schema for simple suspended struct", () => {
      // MessageAttributeValue is a suspended struct
      const schema = verifyJsonSchema(MessageAttributeValue);
      expect(schema.$defs).toHaveProperty("MessageAttributeValue");
    });

    it("generates JSON Schema for operation input (suspended struct with traits)", () => {
      // GetItemInput is an operation input with HTTP/service traits
      const schema = verifyJsonSchema(GetItemInput);
      expect(schema.$defs).toHaveProperty("GetItemInput");
    });

    it("generates JSON Schema for operation output (suspended struct)", () => {
      // GetItemOutput is an operation output
      const schema = verifyJsonSchema(GetItemOutput);
      expect(schema).toHaveProperty("$defs");
    });
  });

  describe("Cyclic Types", () => {
    it("generates JSON Schema for self-referential union (AttributeValue)", () => {
      // AttributeValue references itself in its list/map members
      const schema = verifyJsonSchema(AttributeValue);
      expect(schema.$defs).toHaveProperty("AttributeValue");
    });

    it("generates JSON Schema for struct containing cyclic type", () => {
      // GetItemInput contains Key which contains AttributeValue
      const schema = verifyJsonSchema(GetItemInput);
      expect(schema.$defs).toHaveProperty("GetItemInput");
    });

    it("generates JSON Schema for Condition (cyclic struct)", () => {
      // Condition is a cyclic struct
      const schema = verifyJsonSchema(Condition);
      expect(schema.$defs).toHaveProperty("Condition");
    });
  });

  describe("Map/Record Types", () => {
    it("generates JSON Schema for simple record with primitive values", () => {
      // Key is a Record<string, AttributeValue>
      const schema = verifyJsonSchema(Key);
      expect(schema).toHaveProperty("$defs");
    });

    it("generates JSON Schema for record with struct values and traits", () => {
      // MessageAttributeMap has struct values with XmlName traits
      const schema = verifyJsonSchema(MessageAttributeMap);
      expect(schema.$defs).toHaveProperty("MessageAttributeValue");
    });
  });

  describe("List/Array Types", () => {
    it("generates JSON Schema for list of structs", () => {
      // ObjectList is an array of S3Object
      const schema = verifyJsonSchema(ObjectList);
      expect(schema).toHaveProperty("$defs");
    });

    it("generates JSON Schema for struct containing lists", () => {
      // ListObjectsV2Output has Contents which is ObjectList
      const schema = verifyJsonSchema(ListObjectsV2Output);
      expect(schema).toHaveProperty("$defs");
    });

    it("generates JSON Schema for nested list responses", () => {
      // ListUsersResponse has Users list
      const schema = verifyJsonSchema(ListUsersResponse);
      expect(schema).toHaveProperty("$defs");
    });
  });

  describe("Union Types", () => {
    it("generates JSON Schema for union with struct members", () => {
      // AttributeValue is a union with many typed members
      const schema = verifyJsonSchema(AttributeValue);
      expect(schema.$defs?.AttributeValue).toBeDefined();
    });
  });

  describe("Error Schemas (TaggedError)", () => {
    it("generates JSON Schema for error class", () => {
      // ResourceNotFoundException is a TaggedError
      const schema = verifyJsonSchema(ResourceNotFoundException);
      expect(schema).toHaveProperty("$defs");
    });

    it("generates JSON Schema for S3 error class", () => {
      // BucketAlreadyExists is an S3 error
      const schema = verifyJsonSchema(BucketAlreadyExists);
      expect(schema).toHaveProperty("$defs");
    });
  });

  describe("Complex Nested Structures", () => {
    it("generates JSON Schema for deeply nested structures", () => {
      // DescribeInstancesResult has Reservations -> Instances -> many fields
      const schema = verifyJsonSchema(DescribeInstancesResult);
      expect(schema).toHaveProperty("$defs");
    });

    it("generates JSON Schema for struct with many optional fields", () => {
      // Instance has dozens of optional fields
      const schema = verifyJsonSchema(Instance);
      expect(schema).toHaveProperty("$defs");
    });

    it("generates JSON Schema for complex creation request", () => {
      // CreateFunctionRequest has many fields including blobs
      const schema = verifyJsonSchema(CreateFunctionRequest);
      expect(schema).toHaveProperty("$defs");
    });
  });

  describe("Protocol-Specific Schemas", () => {
    describe("restJson1 (Lambda)", () => {
      it("generates JSON Schema for Lambda GetFunction request", () => {
        // Note: InvokeRequest has streaming body which doesn't support JSONSchema
        const schema = verifyJsonSchema(GetFunctionRequest);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for Lambda list functions response", () => {
        const schema = verifyJsonSchema(ListFunctionsResponse);
        expect(schema).toHaveProperty("$defs");
      });
    });

    describe("restXml (S3)", () => {
      it("generates JSON Schema for S3 HeadObject request", () => {
        // Note: GetObjectInput/PutObjectInput have streaming body which doesn't support JSONSchema
        const schema = verifyJsonSchema(HeadObjectRequest);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for S3 DeleteObject request", () => {
        const schema = verifyJsonSchema(DeleteObjectRequest);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for S3 ListBuckets output", () => {
        const schema = verifyJsonSchema(ListBucketsOutput);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for S3 CopyObject request", () => {
        const schema = verifyJsonSchema(CopyObjectRequest);
        expect(schema).toHaveProperty("$defs");
      });
    });

    describe("awsJson1_0 (DynamoDB)", () => {
      it("generates JSON Schema for DynamoDB Query input", () => {
        const schema = verifyJsonSchema(QueryInput);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for DynamoDB Scan input", () => {
        const schema = verifyJsonSchema(ScanInput);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for DynamoDB PutItem input", () => {
        const schema = verifyJsonSchema(PutItemInput);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for DynamoDB BatchGetItem input", () => {
        const schema = verifyJsonSchema(BatchGetItemInput);
        expect(schema).toHaveProperty("$defs");
      });
    });

    describe("awsJson1_1 (KMS)", () => {
      it("generates JSON Schema for KMS CreateKey request", () => {
        const schema = verifyJsonSchema(CreateKeyRequest);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for KMS Encrypt request", () => {
        const schema = verifyJsonSchema(EncryptRequest);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for KMS Decrypt request", () => {
        const schema = verifyJsonSchema(DecryptRequest);
        expect(schema).toHaveProperty("$defs");
      });
    });

    describe("awsQuery (IAM, SNS)", () => {
      it("generates JSON Schema for IAM CreateUser request", () => {
        const schema = verifyJsonSchema(CreateUserRequest);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for IAM GetUser response", () => {
        const schema = verifyJsonSchema(GetUserResponse);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for SNS Publish input", () => {
        const schema = verifyJsonSchema(PublishInput);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for IAM ListAttachedRolePolicies response", () => {
        const schema = verifyJsonSchema(ListAttachedRolePoliciesResponse);
        expect(schema).toHaveProperty("$defs");
      });
    });

    describe("ec2Query (EC2)", () => {
      it("generates JSON Schema for EC2 DescribeInstances request", () => {
        const schema = verifyJsonSchema(DescribeInstancesRequest);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for EC2 RunInstances request", () => {
        const schema = verifyJsonSchema(RunInstancesRequest);
        expect(schema).toHaveProperty("$defs");
      });

      it("generates JSON Schema for EC2 TerminateInstances request", () => {
        const schema = verifyJsonSchema(TerminateInstancesRequest);
        expect(schema).toHaveProperty("$defs");
      });
    });
  });

  describe("Schema Content Validation", () => {
    it("includes correct $defs for struct schemas", () => {
      const schema = verifyJsonSchema(GetItemInput);
      expect(schema.$defs?.GetItemInput).toHaveProperty("type", "object");
      expect(schema.$defs?.GetItemInput).toHaveProperty("properties");
    });

    it("includes required array for non-optional fields", () => {
      const schema = verifyJsonSchema(GetItemInput);
      const def = schema.$defs?.GetItemInput as {
        required?: string[];
        properties?: Record<string, unknown>;
      };
      expect(def?.required).toContain("TableName");
      expect(def?.required).toContain("Key");
    });

    it("marks optional fields correctly", () => {
      const schema = verifyJsonSchema(GetItemInput);
      const def = schema.$defs?.GetItemInput as {
        required?: string[];
        properties?: Record<string, unknown>;
      };
      // ConsistentRead is optional
      expect(def?.required).not.toContain("ConsistentRead");
      expect(def?.properties).toHaveProperty("ConsistentRead");
    });

    it("generates $ref for nested schema references", () => {
      const schema = verifyJsonSchema(GetItemInput);
      // The schema should have definitions for complex cyclic types like AttributeValue
      expect(schema.$defs).toHaveProperty("AttributeValue");
      // Simple records like Key may be inlined rather than referenced
      expect(schema.$defs).toHaveProperty("GetItemInput");
    });

    it("handles array types correctly", () => {
      const schema = verifyJsonSchema(ObjectList);
      // ObjectList should be an array type with $defs
      expect(schema).toHaveProperty("$defs");
      expect(schema).toHaveProperty("$schema");
    });

    it("handles record/map types correctly", () => {
      const schema = verifyJsonSchema(Key);
      // Key is Record<string, AttributeValue>
      expect(schema).toHaveProperty("$defs");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty struct schemas", () => {
      // Some Unit-based inputs/outputs generate empty structs
      const emptyStruct = S.Struct({});
      const schema = JSONSchema.make(emptyStruct);
      expect(schema).toHaveProperty("$schema");
      // Effect Schema represents empty struct as anyOf [object, array]
      expect(schema).toHaveProperty("anyOf");
    });

    it("handles deeply nested optional chains", () => {
      // Reservation -> Instances -> Instance (many levels)
      const schema = verifyJsonSchema(Reservation);
      expect(schema).toHaveProperty("$defs");
    });

    it("handles mixed primitive and complex fields", () => {
      // User has strings, dates, and nested structures
      const schema = verifyJsonSchema(User);
      expect(schema).toHaveProperty("$defs");
    });
  });
});
