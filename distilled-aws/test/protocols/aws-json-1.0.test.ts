import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { describe, expect } from "vitest";
import { UnknownAwsError, ValidationException } from "../../src/errors.ts";
import { awsJson1_0Protocol } from "../../src/protocols/aws-json.ts";
import { makeRequestBuilder } from "../../src/client/request-builder.ts";
import { makeResponseParser } from "../../src/client/response-parser.ts";
import type { Response } from "../../src/client/response.ts";

// Import real generated schemas from DynamoDB (uses awsJson1_0 protocol)
import {
  DescribeLimitsInput,
  DescribeLimitsOutput,
  DescribeTableInput,
  GetItemInput,
  GetItemOutput,
  ListBackupsInput,
  PutItemInput,
  QueryInput,
  QueryOutput,
  ResourceNotFoundException,
  ScanInput,
  TagResourceInput,
  TagResourceResponse,
} from "../../src/services/dynamodb.ts";

// Import SFN schemas for timestamp testing
import {
  CreateActivityInput,
  CreateActivityOutput,
  ListExecutionsOutput,
} from "../../src/services/sfn.ts";

// Helper to build a request from an instance
const buildRequest = <A, I>(schema: S.Schema<A, I>, instance: A) => {
  const operation = { input: schema, output: schema, errors: [] };
  const builder = makeRequestBuilder(operation, {
    protocol: awsJson1_0Protocol,
  });
  return builder({ ...instance });
};

// Helper to parse a response
const parseResponse = <A, I>(
  schema: S.Schema<A, I>,
  response: Response,
  errors: S.Schema.AnyNoContext[] = [],
) => {
  const operation = { input: schema, output: schema, errors };
  const parser = makeResponseParser<A>(operation, {
    protocol: awsJson1_0Protocol,
  });
  return parser(response);
};

describe("awsJson1_0 protocol", () => {
  // ==========================================================================
  // Basic Request Serialization
  // ==========================================================================

  describe("request serialization", () => {
    it.effect("should serialize empty input correctly", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(DescribeLimitsInput, {});

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.DescribeLimits",
          },
          body: "{}",
        });
      }),
    );

    it.effect("should serialize simple string parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(DescribeTableInput, {
          TableName: "my-table",
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.DescribeTable",
          },
          body: JSON.stringify({ TableName: "my-table" }),
        });
      }),
    );

    it.effect("should serialize with boolean true", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetItemInput, {
          TableName: "my-table",
          Key: { id: { S: "123" } },
          ConsistentRead: true,
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.GetItem",
          },
          body: JSON.stringify({
            TableName: "my-table",
            Key: { id: { S: "123" } },
            ConsistentRead: true,
          }),
        });
      }),
    );

    it.effect("should serialize with boolean false", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetItemInput, {
          TableName: "my-table",
          Key: { id: { S: "123" } },
          ConsistentRead: false,
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.GetItem",
          },
          body: JSON.stringify({
            TableName: "my-table",
            Key: { id: { S: "123" } },
            ConsistentRead: false,
          }),
        });
      }),
    );

    it.effect("should omit undefined parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetItemInput, {
          TableName: "my-table",
          Key: { id: { S: "123" } },
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.GetItem",
          },
          body: JSON.stringify({
            TableName: "my-table",
            Key: { id: { S: "123" } },
          }),
        });
      }),
    );
  });

  // ==========================================================================
  // Map Serialization
  // ==========================================================================

  describe("map serialization", () => {
    it.effect("should serialize ExpressionAttributeNames map", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetItemInput, {
          TableName: "my-table",
          Key: { id: { S: "123" } },
          ExpressionAttributeNames: {
            "#name": "userName",
            "#status": "userStatus",
          },
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.GetItem",
          },
          body: JSON.stringify({
            TableName: "my-table",
            Key: { id: { S: "123" } },
            ExpressionAttributeNames: {
              "#name": "userName",
              "#status": "userStatus",
            },
          }),
        });
      }),
    );

    it.effect("should drop undefined values in maps during serialization", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetItemInput, {
          TableName: "my-table",
          Key: { id: { S: "123" } },
          ExpressionAttributeNames: {
            "#name": "userName",
            "#absent": undefined,
          } as { [key: string]: string | undefined },
        });

        const body = JSON.parse(request.body as string);
        expect(body.ExpressionAttributeNames["#name"]).toBe("userName");
        expect("#absent" in body.ExpressionAttributeNames).toBe(false);
      }),
    );

    it.effect("should serialize Key with multiple string values", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetItemInput, {
          TableName: "my-table",
          Key: {
            pk: { S: "user#123" },
            sk: { S: "profile" },
          },
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.GetItem",
          },
          body: JSON.stringify({
            TableName: "my-table",
            Key: {
              pk: { S: "user#123" },
              sk: { S: "profile" },
            },
          }),
        });
      }),
    );
  });

  // ==========================================================================
  // List Serialization
  // ==========================================================================

  describe("list serialization", () => {
    it.effect("should serialize string lists", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetItemInput, {
          TableName: "my-table",
          Key: { id: { S: "123" } },
          AttributesToGet: ["name", "email", "age"],
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.GetItem",
          },
          body: JSON.stringify({
            TableName: "my-table",
            Key: { id: { S: "123" } },
            AttributesToGet: ["name", "email", "age"],
          }),
        });
      }),
    );

    it.effect("should serialize lists of objects (Tags)", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(TagResourceInput, {
          ResourceArn: "arn:aws:dynamodb:us-east-1:123456789012:table/my-table",
          Tags: [
            { Key: "Environment", Value: "Production" },
            { Key: "Team", Value: "Platform" },
          ],
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.TagResource",
          },
          body: JSON.stringify({
            ResourceArn:
              "arn:aws:dynamodb:us-east-1:123456789012:table/my-table",
            Tags: [
              { Key: "Environment", Value: "Production" },
              { Key: "Team", Value: "Platform" },
            ],
          }),
        });
      }),
    );

    it.effect("should serialize empty lists", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetItemInput, {
          TableName: "my-table",
          Key: { id: { S: "123" } },
          AttributesToGet: [],
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.GetItem",
          },
          body: JSON.stringify({
            TableName: "my-table",
            Key: { id: { S: "123" } },
            AttributesToGet: [],
          }),
        });
      }),
    );
  });

  // ==========================================================================
  // Nested Structure Serialization
  // ==========================================================================

  describe("nested structure serialization", () => {
    it.effect("should serialize ScanInput with all parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(ScanInput, {
          TableName: "my-table",
          FilterExpression: "#status = :status",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":status": { S: "active" },
          },
          Limit: 100,
          ConsistentRead: true,
        });

        expect(request.method).toBe("POST");
        expect(request.path).toBe("/");
        expect(request.query).toEqual({});
        expect(request.headers).toMatchObject({
          "Content-Type": "application/x-amz-json-1.0",
          "X-Amz-Target": "DynamoDB_20120810.Scan",
        });
        expect(JSON.parse(request.body as string)).toEqual({
          TableName: "my-table",
          FilterExpression: "#status = :status",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":status": { S: "active" },
          },
          Limit: 100,
          ConsistentRead: true,
        });
      }),
    );

    it.effect("should serialize QueryInput with ScanIndexForward false", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(QueryInput, {
          TableName: "my-table",
          KeyConditionExpression: "pk = :pk",
          ExpressionAttributeValues: {
            ":pk": { S: "user#123" },
          },
          ScanIndexForward: false,
          Limit: 50,
        });

        expect(request.method).toBe("POST");
        expect(request.path).toBe("/");
        expect(request.query).toEqual({});
        expect(request.headers).toMatchObject({
          "Content-Type": "application/x-amz-json-1.0",
          "X-Amz-Target": "DynamoDB_20120810.Query",
        });
        expect(JSON.parse(request.body as string)).toEqual({
          TableName: "my-table",
          KeyConditionExpression: "pk = :pk",
          ExpressionAttributeValues: {
            ":pk": { S: "user#123" },
          },
          ScanIndexForward: false,
          Limit: 50,
        });
      }),
    );
  });

  // ==========================================================================
  // Timestamp Serialization (epoch-seconds)
  // ==========================================================================

  describe("timestamp serialization", () => {
    it.effect("should serialize timestamps as epoch-seconds", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(ListBackupsInput, {
          TimeRangeLowerBound: new Date("2024-01-15T12:30:00.000Z"),
          TimeRangeUpperBound: new Date("2024-01-16T12:30:00.000Z"),
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.ListBackups",
          },
          body: JSON.stringify({
            TimeRangeLowerBound: 1705321800,
            TimeRangeUpperBound: 1705408200,
          }),
        });
      }),
    );

    it.effect("should serialize SFN CreateActivityInput", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(CreateActivityInput, {
          name: "my-activity",
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "AWSStepFunctions.CreateActivity",
          },
          body: JSON.stringify({
            name: "my-activity",
          }),
        });
      }),
    );
  });

  // ==========================================================================
  // Response Deserialization
  // ==========================================================================

  describe("response deserialization", () => {
    it.effect("should deserialize DescribeLimitsOutput", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/x-amz-json-1.0" },
          body: JSON.stringify({
            AccountMaxReadCapacityUnits: 80000,
            AccountMaxWriteCapacityUnits: 80000,
            TableMaxReadCapacityUnits: 40000,
            TableMaxWriteCapacityUnits: 40000,
          }),
        };

        const result = yield* parseResponse(DescribeLimitsOutput, response);

        expect(result).toMatchObject({
          AccountMaxReadCapacityUnits: 80000,
          AccountMaxWriteCapacityUnits: 80000,
          TableMaxReadCapacityUnits: 40000,
          TableMaxWriteCapacityUnits: 40000,
        });
      }),
    );

    it.effect(
      "should deserialize GetItemOutput with string AttributeValues",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: { "Content-Type": "application/x-amz-json-1.0" },
            body: JSON.stringify({
              Item: {
                pk: { S: "user#123" },
                sk: { S: "profile" },
                name: { S: "John Doe" },
                active: { BOOL: true },
              },
            }),
          };

          const result = yield* parseResponse(GetItemOutput, response);

          expect(result).toMatchObject({
            Item: {
              pk: { S: "user#123" },
              sk: { S: "profile" },
              name: { S: "John Doe" },
              active: { BOOL: true },
            },
          });
        }),
    );

    it.effect("should deserialize QueryOutput with Items list", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/x-amz-json-1.0" },
          body: JSON.stringify({
            Items: [
              { pk: { S: "user#1" }, name: { S: "Alice" } },
              { pk: { S: "user#2" }, name: { S: "Bob" } },
            ],
            Count: 2,
            ScannedCount: 2,
          }),
        };

        const result = yield* parseResponse(QueryOutput, response);

        expect(result).toMatchObject({
          Items: [
            { pk: { S: "user#1" }, name: { S: "Alice" } },
            { pk: { S: "user#2" }, name: { S: "Bob" } },
          ],
          Count: 2,
          ScannedCount: 2,
        });
      }),
    );

    it.effect("should deserialize CreateActivityOutput with timestamp", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/x-amz-json-1.0" },
          body: JSON.stringify({
            activityArn:
              "arn:aws:states:us-east-1:123456789012:activity:my-activity",
            creationDate: 1705321800,
          }),
        };

        const result = yield* parseResponse(CreateActivityOutput, response);

        expect(result).toMatchObject({
          activityArn:
            "arn:aws:states:us-east-1:123456789012:activity:my-activity",
          creationDate: new Date("2024-01-15T12:30:00.000Z"),
        });
      }),
    );

    it.effect(
      "should deserialize ListExecutionsOutput with timestamp array",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: { "Content-Type": "application/x-amz-json-1.0" },
            body: JSON.stringify({
              executions: [
                {
                  executionArn:
                    "arn:aws:states:us-east-1:123:execution:my-sm:exec-1",
                  stateMachineArn:
                    "arn:aws:states:us-east-1:123:stateMachine:my-sm",
                  name: "exec-1",
                  status: "SUCCEEDED",
                  startDate: 1705321800,
                  stopDate: 1705325400,
                },
              ],
            }),
          };

          const result = yield* parseResponse(ListExecutionsOutput, response);

          expect(result).toMatchObject({
            executions: [
              {
                executionArn:
                  "arn:aws:states:us-east-1:123:execution:my-sm:exec-1",
                stateMachineArn:
                  "arn:aws:states:us-east-1:123:stateMachine:my-sm",
                name: "exec-1",
                status: "SUCCEEDED",
                startDate: new Date("2024-01-15T12:30:00.000Z"),
                stopDate: new Date("2024-01-15T13:30:00.000Z"),
              },
            ],
          });
        }),
    );

    it.effect("should deserialize empty response body", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body: "",
        };

        const result = yield* parseResponse(TagResourceResponse, response);

        expect(result).toMatchObject({});
      }),
    );

    it.effect("should deserialize empty JSON object response", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "application/x-amz-json-1.0" },
          body: "{}",
        };

        const result = yield* parseResponse(TagResourceResponse, response);

        expect(result).toMatchObject({});
      }),
    );
  });

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe("edge cases", () => {
    it.effect("should serialize zero value correctly", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(ScanInput, {
          TableName: "table",
          Limit: 0,
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.Scan",
          },
          body: JSON.stringify({
            TableName: "table",
            Limit: 0,
          }),
        });
      }),
    );

    it.effect("should serialize empty string values", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(ScanInput, {
          TableName: "",
          FilterExpression: "",
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.Scan",
          },
          body: JSON.stringify({
            TableName: "",
            FilterExpression: "",
          }),
        });
      }),
    );

    it.effect("should serialize special characters in strings", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(ScanInput, {
          TableName: 'table-with-"quotes"',
          FilterExpression: "contains(#name, :value)",
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.Scan",
          },
          body: JSON.stringify({
            TableName: 'table-with-"quotes"',
            FilterExpression: "contains(#name, :value)",
          }),
        });
      }),
    );

    it.effect("should serialize deeply nested structures", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(PutItemInput, {
          TableName: "table",
          Item: {
            pk: { S: "user#123" },
            data: {
              M: {
                nested: {
                  M: {
                    deep: { S: "value" },
                  },
                },
              },
            },
          },
        });

        expect(request).toMatchObject({
          method: "POST",
          path: "/",
          query: {},
          headers: {
            "Content-Type": "application/x-amz-json-1.0",
            "X-Amz-Target": "DynamoDB_20120810.PutItem",
          },
          body: JSON.stringify({
            TableName: "table",
            Item: {
              pk: { S: "user#123" },
              data: {
                M: {
                  nested: {
                    M: {
                      deep: { S: "value" },
                    },
                  },
                },
              },
            },
          }),
        });
      }),
    );
  });

  // ==========================================================================
  // Error Deserialization
  // ==========================================================================

  describe("error deserialization", () => {
    it.effect("should deserialize error from __type body field", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 400,
          statusText: "Bad Request",
          headers: {},
          body: JSON.stringify({
            __type: "ResourceNotFoundException",
            message: "Requested resource not found",
          }),
        };

        const result = yield* parseResponse(DescribeTableInput, response, [
          ResourceNotFoundException,
        ]).pipe(Effect.flip);

        expect(result).toBeInstanceOf(ResourceNotFoundException);
        expect(result._tag).toBe("ResourceNotFoundException");
      }),
    );

    it.effect("should deserialize error from code body field", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 400,
          statusText: "Bad Request",
          headers: {},
          body: JSON.stringify({
            code: "ResourceNotFoundException",
            message: "Table not found",
          }),
        };

        const result = yield* parseResponse(DescribeTableInput, response, [
          ResourceNotFoundException,
        ]).pipe(Effect.flip);

        expect(result).toBeInstanceOf(ResourceNotFoundException);
      }),
    );

    it.effect("should deserialize error from X-Amzn-Errortype header", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 400,
          statusText: "Bad Request",
          headers: {
            "x-amzn-errortype": "ResourceNotFoundException",
          },
          body: JSON.stringify({
            message: "Resource not found",
          }),
        };

        const result = yield* parseResponse(DescribeTableInput, response, [
          ResourceNotFoundException,
        ]).pipe(Effect.flip);

        expect(result).toBeInstanceOf(ResourceNotFoundException);
      }),
    );

    it.effect("should sanitize error code with namespace prefix", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 400,
          statusText: "Bad Request",
          headers: {},
          body: JSON.stringify({
            __type: "com.amazonaws.dynamodb#ResourceNotFoundException",
            message: "Not found",
          }),
        };

        const result = yield* parseResponse(DescribeTableInput, response, [
          ResourceNotFoundException,
        ]).pipe(Effect.flip);

        expect(result).toBeInstanceOf(ResourceNotFoundException);
        expect(result._tag).toBe("ResourceNotFoundException");
      }),
    );

    it.effect("should sanitize error code with colon suffix", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 400,
          statusText: "Bad Request",
          headers: {},
          body: JSON.stringify({
            __type:
              "ResourceNotFoundException:http://internal.amazon.com/coral/validate/",
            message: "Not found",
          }),
        };

        const result = yield* parseResponse(DescribeTableInput, response, [
          ResourceNotFoundException,
        ]).pipe(Effect.flip);

        expect(result).toBeInstanceOf(ResourceNotFoundException);
      }),
    );

    it.effect("should sanitize error code with both # and :", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 400,
          statusText: "Bad Request",
          headers: {},
          body: JSON.stringify({
            __type:
              "com.amazonaws.dynamodb#ResourceNotFoundException:http://extra",
            message: "Not found",
          }),
        };

        const result = yield* parseResponse(DescribeTableInput, response, [
          ResourceNotFoundException,
        ]).pipe(Effect.flip);

        expect(result).toBeInstanceOf(ResourceNotFoundException);
      }),
    );

    it.effect("should match common AWS errors", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 400,
          statusText: "Bad Request",
          headers: {},
          body: JSON.stringify({
            __type: "ValidationException",
            message: "Invalid input",
          }),
        };

        // ValidationException is in COMMON_ERRORS, so it should match even without being in operation.errors
        const result = yield* parseResponse(
          DescribeTableInput,
          response,
          [],
        ).pipe(Effect.flip);

        expect(result).toBeInstanceOf(ValidationException);
        expect(result._tag).toBe("ValidationException");
      }),
    );

    it.effect("should return UnknownAwsError for unknown error codes", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 400,
          statusText: "Bad Request",
          headers: {},
          body: JSON.stringify({
            __type: "SomeUnknownError",
            message: "Something went wrong",
            customField: "extra data",
          }),
        };

        const result = yield* parseResponse(
          DescribeTableInput,
          response,
          [],
        ).pipe(Effect.flip);

        expect(result).toBeInstanceOf(UnknownAwsError);
        expect((result as UnknownAwsError).errorTag).toBe("SomeUnknownError");
        expect((result as UnknownAwsError).errorData).toEqual({
          message: "Something went wrong",
          customField: "extra data",
        });
      }),
    );

    it.effect("should prefer X-Amzn-Errortype header over body fields", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 400,
          statusText: "Bad Request",
          headers: {
            "x-amzn-errortype": "ResourceNotFoundException",
          },
          body: JSON.stringify({
            __type: "SomeOtherError",
            code: "AnotherError",
            message: "This should be ignored for type resolution",
          }),
        };

        const result = yield* parseResponse(DescribeTableInput, response, [
          ResourceNotFoundException,
        ]).pipe(Effect.flip);

        expect(result).toBeInstanceOf(ResourceNotFoundException);
      }),
    );
  });
});
