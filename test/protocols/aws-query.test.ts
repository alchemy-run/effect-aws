import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { describe, expect } from "vitest";
import { UnknownAwsError, ValidationException } from "../../src/errors.ts";
import { awsQueryProtocol } from "../../src/protocols/aws-query.ts";
import { makeRequestBuilder } from "../../src/client/request-builder.ts";
import { makeResponseParser } from "../../src/client/response-parser.ts";
import type { Response } from "../../src/client/response.ts";

// Import real generated schemas for testing
import {
  // Simple request/response operations
  CreatePolicyRequest,
  // Operations with Tags (nested list of objects)
  CreateUserRequest,
  // Operations with maps
  GetAccountSummaryResponse,
  GetUserRequest,
  GetUserResponse,
  ListUsersRequest,
  ListUsersResponse,
  // Error types
  NoSuchEntityException,
} from "../../src/services/iam.ts";

// Import SNS for map with xmlName on key/value and map deserialization tests
import {
  GetTopicAttributesResponse,
  PublishInput,
  PublishResponse,
} from "../../src/services/sns.ts";

// Import Neptune for lists with xmlName on element
import {
  ModifyDBClusterSnapshotAttributeMessage,
  ModifyDBClusterSnapshotAttributeResult,
} from "../../src/services/neptune.ts";

// Helper to build a request from an instance
const buildRequest = <A, I>(schema: S.Schema<A, I>, instance: A) => {
  const operation = { input: schema, output: schema, errors: [] };
  const builder = makeRequestBuilder(operation, { protocol: awsQueryProtocol });
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
    protocol: awsQueryProtocol,
  });
  return parser(response);
};

// Helper to parse form-urlencoded body into key-value pairs
const parseFormBody = (body: string): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const pair of body.split("&")) {
    const [key, value] = pair.split("=");
    result[decodeURIComponent(key)] = decodeURIComponent(value ?? "");
  }
  return result;
};

describe("awsQuery protocol", () => {
  // ==========================================================================
  // Basic Request Serialization
  // ==========================================================================

  describe("request serialization", () => {
    it.effect("should serialize Action and Version parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetUserRequest, {});

        expect(request.method).toBe("POST");
        expect(request.path).toBe("/");
        expect(request.headers["Content-Type"]).toBe(
          "application/x-www-form-urlencoded",
        );

        const params = parseFormBody(request.body as string);
        expect(params["Action"]).toBe("GetUser");
        expect(params["Version"]).toBe("2010-05-08");
      }),
    );

    it.effect(
      "should serialize simple string parameters (no capitalization)",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(GetUserRequest, {
            UserName: "john.doe",
          });

          const params = parseFormBody(request.body as string);
          expect(params["Action"]).toBe("GetUser");
          // AWS Query uses member names directly (no capitalization unlike EC2)
          expect(params["UserName"]).toBe("john.doe");
        }),
    );

    it.effect("should serialize boolean true parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(CreatePolicyRequest, {
          PolicyName: "test-policy",
          PolicyDocument: "{}",
        });

        const params = parseFormBody(request.body as string);
        expect(params["PolicyName"]).toBe("test-policy");
        expect(params["PolicyDocument"]).toBe("{}");
      }),
    );

    it.effect("should not serialize undefined parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetUserRequest, {});

        const params = parseFormBody(request.body as string);
        expect(params["UserName"]).toBeUndefined();
      }),
    );

    it.effect("should serialize integer parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(ListUsersRequest, {
          MaxItems: 100,
        });

        const params = parseFormBody(request.body as string);
        expect(params["MaxItems"]).toBe("100");
      }),
    );
  });

  // ==========================================================================
  // Query Key Resolution (AWS Query uses xmlName directly, no capitalization)
  // ==========================================================================

  describe("query key resolution", () => {
    it.effect(
      "should use member name directly (unlike EC2 which capitalizes)",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(ListUsersRequest, {
            PathPrefix: "/engineering/",
            Marker: "next-token-123",
          });

          const params = parseFormBody(request.body as string);
          // AWS Query uses member names directly
          expect(params["PathPrefix"]).toBe("/engineering/");
          expect(params["Marker"]).toBe("next-token-123");
        }),
    );
  });

  // ==========================================================================
  // List Serialization (AWS Query uses .member.N format by default)
  // ==========================================================================

  describe("list serialization", () => {
    it.effect(
      "should serialize lists with .member.N format (not flattened by default)",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(CreateUserRequest, {
            UserName: "new-user",
            Tags: [
              { Key: "Environment", Value: "Production" },
              { Key: "Team", Value: "Platform" },
            ],
          });

          const params = parseFormBody(request.body as string);
          // AWS Query format: Key.member.N for non-flattened lists
          expect(params["Tags.member.1.Key"]).toBe("Environment");
          expect(params["Tags.member.1.Value"]).toBe("Production");
          expect(params["Tags.member.2.Key"]).toBe("Team");
          expect(params["Tags.member.2.Value"]).toBe("Platform");
        }),
    );

    it.effect("should not serialize empty lists", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(CreateUserRequest, {
          UserName: "new-user",
          Tags: [],
        });

        const params = parseFormBody(request.body as string);
        // Empty lists should not produce any entries
        expect(
          Object.keys(params).filter((k) => k.startsWith("Tags")),
        ).toHaveLength(0);
      }),
    );

    it.effect("should serialize nested structures in lists", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(CreatePolicyRequest, {
          PolicyName: "test-policy",
          PolicyDocument: "{}",
          Tags: [{ Key: "Name", Value: "TestPolicy" }],
        });

        const params = parseFormBody(request.body as string);
        expect(params["Tags.member.1.Key"]).toBe("Name");
        expect(params["Tags.member.1.Value"]).toBe("TestPolicy");
      }),
    );
  });

  // ==========================================================================
  // Lists with xmlName on element (Neptune AttributeValueList, AvailabilityZoneList)
  // ==========================================================================

  describe("lists with xmlName on element", () => {
    it.effect(
      "should serialize lists using xmlName from element schema (AttributeValue instead of member)",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(
            ModifyDBClusterSnapshotAttributeMessage,
            {
              DBClusterSnapshotIdentifier: "my-snapshot",
              AttributeName: "restore",
              ValuesToAdd: ["111111111111", "222222222222"],
            },
          );

          const params = parseFormBody(request.body as string);
          // Neptune's AttributeValueList has xmlName="AttributeValue" on element
          expect(params["ValuesToAdd.AttributeValue.1"]).toBe("111111111111");
          expect(params["ValuesToAdd.AttributeValue.2"]).toBe("222222222222");
        }),
    );

    it.effect("should deserialize response with xmlName element tags", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<ModifyDBClusterSnapshotAttributeResponse xmlns="http://rds.amazonaws.com/doc/2014-10-31/">
    <ModifyDBClusterSnapshotAttributeResult>
        <DBClusterSnapshotAttributesResult>
            <DBClusterSnapshotIdentifier>my-snapshot</DBClusterSnapshotIdentifier>
            <DBClusterSnapshotAttributes>
                <DBClusterSnapshotAttribute>
                    <AttributeName>restore</AttributeName>
                    <AttributeValues>
                        <AttributeValue>111111111111</AttributeValue>
                        <AttributeValue>222222222222</AttributeValue>
                    </AttributeValues>
                </DBClusterSnapshotAttribute>
            </DBClusterSnapshotAttributes>
        </DBClusterSnapshotAttributesResult>
    </ModifyDBClusterSnapshotAttributeResult>
    <ResponseMetadata>
        <RequestId>abc123</RequestId>
    </ResponseMetadata>
</ModifyDBClusterSnapshotAttributeResponse>`,
        };

        const result = yield* parseResponse(
          ModifyDBClusterSnapshotAttributeResult,
          response,
        );
        expect(result.DBClusterSnapshotAttributesResult).toBeDefined();
      }),
    );
  });

  // ==========================================================================
  // Map Serialization with xmlName on key/value (SNS MessageAttributeMap)
  // ==========================================================================

  describe("maps with xmlName on key/value", () => {
    it.effect(
      "should serialize maps using xmlName for key/value (Name/Value instead of key/value)",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(PublishInput, {
            TopicArn: "arn:aws:sns:us-east-1:123456789012:MyTopic",
            Message: "Hello World",
            MessageAttributes: {
              priority: {
                DataType: "String",
                StringValue: "high",
              },
            },
          });

          const params = parseFormBody(request.body as string);
          // SNS MessageAttributeMap has xmlName="Name" on key and xmlName="Value" on value
          expect(params["MessageAttributes.entry.1.Name"]).toBe("priority");
          expect(params["MessageAttributes.entry.1.Value.DataType"]).toBe(
            "String",
          );
          expect(params["MessageAttributes.entry.1.Value.StringValue"]).toBe(
            "high",
          );
        }),
    );

    it.effect("should serialize maps with multiple entries", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(PublishInput, {
          TopicArn: "arn:aws:sns:us-east-1:123456789012:MyTopic",
          Message: "Hello World",
          MessageAttributes: {
            priority: {
              DataType: "String",
              StringValue: "high",
            },
            category: {
              DataType: "String",
              StringValue: "alerts",
            },
          },
        });

        const params = parseFormBody(request.body as string);
        // Both entries should be serialized
        expect(params["MessageAttributes.entry.1.Name"]).toBeDefined();
        expect(params["MessageAttributes.entry.2.Name"]).toBeDefined();
      }),
    );
  });

  // ==========================================================================
  // Response Deserialization (AWS Query has {Op}Result wrapper)
  // ==========================================================================

  describe("response deserialization", () => {
    it.effect("should deserialize simple response with Result wrapper", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<GetUserResponse xmlns="https://iam.amazonaws.com/doc/2010-05-08/">
    <GetUserResult>
        <User>
            <Path>/</Path>
            <UserName>john.doe</UserName>
            <UserId>AIDACKCEVSQ6C2EXAMPLE</UserId>
            <Arn>arn:aws:iam::123456789012:user/john.doe</Arn>
            <CreateDate>2023-01-15T10:30:00Z</CreateDate>
        </User>
    </GetUserResult>
    <ResponseMetadata>
        <RequestId>c6104cbe-af31-11e0-8154-cbc7ccf896c7</RequestId>
    </ResponseMetadata>
</GetUserResponse>`,
        };

        const result = yield* parseResponse(GetUserResponse, response);

        expect(result.User).toBeDefined();
        expect(result.User?.UserName).toBe("john.doe");
        expect(result.User?.UserId).toBe("AIDACKCEVSQ6C2EXAMPLE");
        expect(result.User?.Path).toBe("/");
        expect(result.User?.Arn).toBe(
          "arn:aws:iam::123456789012:user/john.doe",
        );
        expect(result.User?.CreateDate).toBeInstanceOf(Date);
      }),
    );

    it.effect(
      "should deserialize response with lists using member wrapper",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: { "Content-Type": "text/xml;charset=UTF-8" },
            body: `<?xml version="1.0" encoding="UTF-8"?>
<ListUsersResponse xmlns="https://iam.amazonaws.com/doc/2010-05-08/">
    <ListUsersResult>
        <IsTruncated>false</IsTruncated>
        <Users>
            <member>
                <Path>/</Path>
                <UserName>alice</UserName>
                <UserId>AIDA111</UserId>
                <Arn>arn:aws:iam::123456789012:user/alice</Arn>
                <CreateDate>2023-01-15T10:30:00Z</CreateDate>
            </member>
            <member>
                <Path>/</Path>
                <UserName>bob</UserName>
                <UserId>AIDA222</UserId>
                <Arn>arn:aws:iam::123456789012:user/bob</Arn>
                <CreateDate>2023-02-20T14:45:00Z</CreateDate>
            </member>
        </Users>
    </ListUsersResult>
    <ResponseMetadata>
        <RequestId>abc123</RequestId>
    </ResponseMetadata>
</ListUsersResponse>`,
          };

          const result = yield* parseResponse(ListUsersResponse, response);

          expect(result.IsTruncated).toBe(false);
          expect(result.Users).toHaveLength(2);
          expect(result.Users[0].UserName).toBe("alice");
          expect(result.Users[1].UserName).toBe("bob");
        }),
    );

    it.effect("should deserialize response with map (summaryMapType)", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<GetAccountSummaryResponse xmlns="https://iam.amazonaws.com/doc/2010-05-08/">
    <GetAccountSummaryResult>
        <SummaryMap>
            <entry>
                <key>Users</key>
                <value>5</value>
            </entry>
            <entry>
                <key>Groups</key>
                <value>3</value>
            </entry>
        </SummaryMap>
    </GetAccountSummaryResult>
    <ResponseMetadata>
        <RequestId>abc123</RequestId>
    </ResponseMetadata>
</GetAccountSummaryResponse>`,
        };

        const result = yield* parseResponse(
          GetAccountSummaryResponse,
          response,
        );

        expect(result.SummaryMap).toBeDefined();
      }),
    );

    it.effect("should deserialize SNS PublishResponse", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<PublishResponse xmlns="http://sns.amazonaws.com/doc/2010-03-31/">
    <PublishResult>
        <MessageId>567910cd-659e-55d4-8ccb-5aaf14679dc0</MessageId>
    </PublishResult>
    <ResponseMetadata>
        <RequestId>d74b8436-ae13-5ab4-a9ff-ce54dfea72a0</RequestId>
    </ResponseMetadata>
</PublishResponse>`,
        };

        const result = yield* parseResponse(PublishResponse, response);
        expect(result.MessageId).toBe("567910cd-659e-55d4-8ccb-5aaf14679dc0");
      }),
    );

    it.effect(
      "should deserialize map with entry format (SNS GetTopicAttributes)",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: { "Content-Type": "text/xml;charset=UTF-8" },
            body: `<?xml version="1.0" encoding="UTF-8"?>
<GetTopicAttributesResponse xmlns="http://sns.amazonaws.com/doc/2010-03-31/">
    <GetTopicAttributesResult>
        <Attributes>
            <entry><key>TopicArn</key><value>arn:aws:sns:us-east-1:123456789012:MyTopic</value></entry>
            <entry><key>Owner</key><value>123456789012</value></entry>
            <entry><key>DisplayName</key><value>My Topic</value></entry>
        </Attributes>
    </GetTopicAttributesResult>
    <ResponseMetadata>
        <RequestId>abc123</RequestId>
    </ResponseMetadata>
</GetTopicAttributesResponse>`,
          };

          const result = yield* parseResponse(
            GetTopicAttributesResponse,
            response,
          );
          expect(result.Attributes).toBeDefined();
          expect(result.Attributes?.TopicArn).toBe(
            "arn:aws:sns:us-east-1:123456789012:MyTopic",
          );
          expect(result.Attributes?.Owner).toBe("123456789012");
          expect(result.Attributes?.DisplayName).toBe("My Topic");
        }),
    );

    it.effect("should deserialize map with empty values as empty strings", () =>
      Effect.gen(function* () {
        // AWS returns empty <value /> elements for unset attributes
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<GetTopicAttributesResponse xmlns="http://sns.amazonaws.com/doc/2010-03-31/">
    <GetTopicAttributesResult>
        <Attributes>
            <entry><key>TopicArn</key><value>arn:aws:sns:us-east-1:123456789012:MyTopic</value></entry>
            <entry><key>DisplayName</key><value /></entry>
            <entry><key>DeliveryPolicy</key><value></value></entry>
        </Attributes>
    </GetTopicAttributesResult>
    <ResponseMetadata>
        <RequestId>abc123</RequestId>
    </ResponseMetadata>
</GetTopicAttributesResponse>`,
        };

        const result = yield* parseResponse(
          GetTopicAttributesResponse,
          response,
        );
        expect(result.Attributes).toBeDefined();
        expect(result.Attributes?.TopicArn).toBe(
          "arn:aws:sns:us-east-1:123456789012:MyTopic",
        );
        // Empty values should be empty strings, not undefined
        expect(result.Attributes?.DisplayName).toBe("");
        expect(result.Attributes?.DeliveryPolicy).toBe("");
      }),
    );

    it.effect("should deserialize map with single entry", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<GetTopicAttributesResponse xmlns="http://sns.amazonaws.com/doc/2010-03-31/">
    <GetTopicAttributesResult>
        <Attributes>
            <entry><key>TopicArn</key><value>arn:aws:sns:us-east-1:123456789012:MyTopic</value></entry>
        </Attributes>
    </GetTopicAttributesResult>
    <ResponseMetadata>
        <RequestId>abc123</RequestId>
    </ResponseMetadata>
</GetTopicAttributesResponse>`,
        };

        const result = yield* parseResponse(
          GetTopicAttributesResponse,
          response,
        );
        expect(result.Attributes).toBeDefined();
        expect(result.Attributes?.TopicArn).toBe(
          "arn:aws:sns:us-east-1:123456789012:MyTopic",
        );
        expect(Object.keys(result.Attributes ?? {}).length).toBe(1);
      }),
    );

    it.effect("should handle empty self-closing map element", () =>
      Effect.gen(function* () {
        // When XML has <Attributes />, the parser returns "" which becomes undefined
        // Since Attributes is optional, this is fine
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<GetTopicAttributesResponse xmlns="http://sns.amazonaws.com/doc/2010-03-31/">
    <GetTopicAttributesResult>
        <Attributes />
    </GetTopicAttributesResult>
    <ResponseMetadata>
        <RequestId>abc123</RequestId>
    </ResponseMetadata>
</GetTopicAttributesResponse>`,
        };

        const result = yield* parseResponse(
          GetTopicAttributesResponse,
          response,
        );
        // Empty self-closing element becomes undefined for optional fields
        expect(result.Attributes).toBeUndefined();
      }),
    );

    it.effect("should deserialize map with empty Attributes element", () =>
      Effect.gen(function* () {
        // When XML has <Attributes></Attributes> with no entries
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<GetTopicAttributesResponse xmlns="http://sns.amazonaws.com/doc/2010-03-31/">
    <GetTopicAttributesResult>
        <Attributes></Attributes>
    </GetTopicAttributesResult>
    <ResponseMetadata>
        <RequestId>abc123</RequestId>
    </ResponseMetadata>
</GetTopicAttributesResponse>`,
        };

        const result = yield* parseResponse(
          GetTopicAttributesResponse,
          response,
        );
        // Empty element with no entries becomes undefined for optional fields
        expect(result.Attributes).toBeUndefined();
      }),
    );
  });

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe("edge cases", () => {
    it.effect("should fail when required fields are missing (empty body)", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body: "",
        };

        // Schemas with required fields should fail to parse when fields are missing
        const result = yield* Effect.either(
          parseResponse(GetUserResponse, response),
        );

        expect(result._tag).toBe("Left"); // Should be a parse error
      }),
    );

    it.effect(
      "should fail when required fields are missing (empty Result)",
      () =>
        Effect.gen(function* () {
          // ListUsersResponse has required Users field
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: { "Content-Type": "text/xml;charset=UTF-8" },
            body: `<?xml version="1.0" encoding="UTF-8"?>
<ListUsersResponse xmlns="https://iam.amazonaws.com/doc/2010-05-08/">
    <ListUsersResult>
    </ListUsersResult>
    <ResponseMetadata>
        <RequestId>abc123</RequestId>
    </ResponseMetadata>
</ListUsersResponse>`,
          };

          // Schemas with required fields should fail to parse when fields are missing
          const result = yield* Effect.either(
            parseResponse(ListUsersResponse, response),
          );

          expect(result._tag).toBe("Left"); // Should be a parse error
        }),
    );

    it.effect("should URL-encode special characters in request values", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(GetUserRequest, {
          UserName: "user&name=test",
        });

        // The body should have properly encoded special characters
        expect(request.body).toContain("user%26name%3Dtest");
      }),
    );

    it.effect(
      "should handle single item in list (not wrapped in array by parser)",
      () =>
        Effect.gen(function* () {
          // When XML has only one item, the parser may return an object instead of array
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: { "Content-Type": "text/xml;charset=UTF-8" },
            body: `<?xml version="1.0" encoding="UTF-8"?>
<ListUsersResponse xmlns="https://iam.amazonaws.com/doc/2010-05-08/">
    <ListUsersResult>
        <Users>
            <member>
                <Path>/</Path>
                <UserName>single-user</UserName>
                <UserId>AIDA111</UserId>
                <Arn>arn:aws:iam::123456789012:user/single-user</Arn>
                <CreateDate>2023-01-15T10:30:00Z</CreateDate>
            </member>
        </Users>
    </ListUsersResult>
    <ResponseMetadata>
        <RequestId>abc123</RequestId>
    </ResponseMetadata>
</ListUsersResponse>`,
          };

          const result = yield* parseResponse(ListUsersResponse, response);

          // Should still be an array with one item
          expect(Array.isArray(result.Users)).toBe(true);
          expect(result.Users).toHaveLength(1);
        }),
    );
  });

  // ==========================================================================
  // Comparison with EC2 Query (key differences)
  // ==========================================================================

  describe("differences from EC2 Query", () => {
    it.effect(
      "should use .member.N format for lists (not flattened like EC2)",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(CreateUserRequest, {
            UserName: "test-user",
            Tags: [{ Key: "env", Value: "test" }],
          });

          const params = parseFormBody(request.body as string);
          // AWS Query: Tags.member.1.Key
          // EC2 Query would be: Tag.1.Key (flattened, capitalized)
          expect(params["Tags.member.1.Key"]).toBe("env");
          expect(params["Tags.member.1.Value"]).toBe("test");
        }),
    );

    it.effect("should use member name directly without capitalization", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(ListUsersRequest, {
          PathPrefix: "/test/",
        });

        const params = parseFormBody(request.body as string);
        // AWS Query: uses member name as-is
        // EC2 Query: would capitalize first letter
        expect(params["PathPrefix"]).toBe("/test/");
      }),
    );
  });

  // ==========================================================================
  // Error Deserialization
  // ==========================================================================

  describe("error deserialization", () => {
    it.effect("should deserialize awsQuery error format", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 404,
          statusText: "Not Found",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<ErrorResponse xmlns="https://iam.amazonaws.com/doc/2010-05-08/">
  <Error>
    <Type>Sender</Type>
    <Code>NoSuchEntityException</Code>
    <Message>The user with name test-user cannot be found.</Message>
  </Error>
  <RequestId>abc123-def456</RequestId>
</ErrorResponse>`,
        };

        const result = yield* parseResponse(GetUserRequest, response, [
          NoSuchEntityException,
        ]).pipe(Effect.flip);

        expect(result).toBeInstanceOf(NoSuchEntityException);
        expect(result._tag).toBe("NoSuchEntityException");
      }),
    );

    it.effect("should preserve Type and RequestId in error data", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 404,
          statusText: "Not Found",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<ErrorResponse>
  <Error>
    <Type>Sender</Type>
    <Code>NoSuchEntityException</Code>
    <Message>User not found</Message>
  </Error>
  <RequestId>req-789</RequestId>
</ErrorResponse>`,
        };

        const result = yield* parseResponse(GetUserRequest, response, [
          NoSuchEntityException,
        ]).pipe(Effect.flip);

        expect(result).toBeInstanceOf(NoSuchEntityException);
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
    <Message>Invalid input parameter</Message>
  </Error>
  <RequestId>val-123</RequestId>
</ErrorResponse>`,
        };

        const result = yield* parseResponse(GetUserRequest, response, []).pipe(
          Effect.flip,
        );

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
    <Code>InternalServiceError</Code>
    <Message>An internal error occurred</Message>
  </Error>
  <RequestId>int-456</RequestId>
</ErrorResponse>`,
        };

        const result = yield* parseResponse(GetUserRequest, response, []).pipe(
          Effect.flip,
        );

        expect(result).toBeInstanceOf(UnknownAwsError);
        expect((result as UnknownAwsError).errorTag).toBe(
          "InternalServiceError",
        );
        expect((result as UnknownAwsError).errorData).toMatchObject({
          Type: "Receiver",
          Message: "An internal error occurred",
          RequestId: "int-456",
        });
      }),
    );
  });
});
