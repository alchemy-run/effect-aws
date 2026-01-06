import { it } from "@effect/vitest";
import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { describe, expect } from "vitest";
import { UnknownAwsError, ValidationException } from "../../src/errors.ts";
import { ec2QueryProtocol } from "../../src/protocols/ec2-query.ts";
import { makeRequestBuilder } from "../../src/client/request-builder.ts";
import { makeResponseParser } from "../../src/client/response-parser.ts";
import type { Response } from "../../src/client/response.ts";
import {
  // Simple request/response operations
  AcceptVpcPeeringConnectionRequest,
  AcceptVpcPeeringConnectionResult,
  // Operations with complex nested structures
  AllocateHostsRequest,
  AllocateHostsResult,
  AssociateRouteTableResult,
  // Operations with tags (nested list of objects)
  CreateTagsRequest,
  DescribeAccountAttributesRequest,
  DescribeInstancesRequest,
  DescribeInstancesResult,
  // Operations with timestamps
  DescribeSpotFleetRequestHistoryRequest,
  DescribeSpotFleetRequestHistoryResponse,
} from "../../src/services/ec2.ts";

// Helper to build a request from an instance
const buildRequest = <A, I>(schema: S.Schema<A, I>, instance: A) => {
  const operation = { input: schema, output: schema, errors: [] };
  const builder = makeRequestBuilder(operation, { protocol: ec2QueryProtocol });
  return builder({ ...instance });
};

// Helper to parse a response
const parseResponse = <A, I>(
  schema: S.Schema<A, I>,
  response: Response,
  errors: S.Schema.AnyNoContext[] = [],
) => {
  const operation = { input: schema, output: schema, errors };
  const parser = makeResponseParser<A, I, never>(operation, {
    protocol: ec2QueryProtocol,
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

describe("ec2Query protocol", () => {
  // ==========================================================================
  // Basic Request Serialization
  // ==========================================================================

  describe("request serialization", () => {
    it.effect("should serialize Action and Version parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(
          DescribeAccountAttributesRequest,
          {},
        );

        expect(request.method).toBe("POST");
        expect(request.path).toBe("/");
        expect(request.headers["Content-Type"]).toBe(
          "application/x-www-form-urlencoded",
        );

        const params = parseFormBody(request.body as string);
        expect(params["Action"]).toBe("DescribeAccountAttributes");
        expect(params["Version"]).toBe("2016-11-15");
      }),
    );

    it.effect("should serialize simple string parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(AcceptVpcPeeringConnectionRequest, {
          VpcPeeringConnectionId: "pcx-12345678",
        });

        const params = parseFormBody(request.body as string);
        expect(params["Action"]).toBe("AcceptVpcPeeringConnection");
        expect(params["VpcPeeringConnectionId"]).toBe("pcx-12345678");
      }),
    );

    it.effect("should serialize boolean true parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(AcceptVpcPeeringConnectionRequest, {
          VpcPeeringConnectionId: "pcx-12345678",
          DryRun: true,
        });

        const params = parseFormBody(request.body as string);
        expect(params["DryRun"]).toBe("true");
      }),
    );

    it.effect("should serialize boolean false parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(AcceptVpcPeeringConnectionRequest, {
          VpcPeeringConnectionId: "pcx-12345678",
          DryRun: false,
        });

        const params = parseFormBody(request.body as string);
        expect(params["DryRun"]).toBe("false");
      }),
    );

    it.effect("should not serialize undefined parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(AcceptVpcPeeringConnectionRequest, {
          VpcPeeringConnectionId: "pcx-12345678",
        });

        const params = parseFormBody(request.body as string);
        expect(params["DryRun"]).toBeUndefined();
      }),
    );

    it.effect("should serialize integer parameters", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(DescribeInstancesRequest, {
          MaxResults: 100,
        });

        const params = parseFormBody(request.body as string);
        expect(params["MaxResults"]).toBe("100");
      }),
    );
  });

  // ==========================================================================
  // ec2QueryName Trait
  // ==========================================================================

  describe("ec2QueryName trait", () => {
    it.effect("should use ec2QueryName for query key resolution", () =>
      Effect.gen(function* () {
        // DryRun has ec2QueryName("DryRun") and xmlName("dryRun")
        // ec2QueryName should take precedence
        const request = yield* buildRequest(DescribeAccountAttributesRequest, {
          DryRun: true,
        });

        const params = parseFormBody(request.body as string);
        // Should use ec2QueryName "DryRun", not xmlName "dryRun"
        expect(params["DryRun"]).toBe("true");
        expect(params["dryRun"]).toBeUndefined();
      }),
    );

    it.effect(
      "should capitalize xmlName when ec2QueryName is not present",
      () =>
        Effect.gen(function* () {
          // InstanceIds has xmlName("InstanceId") but no ec2QueryName
          // Should capitalize to "InstanceId"
          const request = yield* buildRequest(DescribeInstancesRequest, {
            InstanceIds: ["i-12345678"],
          });

          const params = parseFormBody(request.body as string);
          // Should capitalize first letter of xmlName
          expect(params["InstanceId.1"]).toBe("i-12345678");
        }),
    );

    it.effect("should use ec2QueryName on nested structure members", () =>
      Effect.gen(function* () {
        // AllocateHostsRequest has Quantity with ec2QueryName("Quantity") and xmlName("quantity")
        const request = yield* buildRequest(AllocateHostsRequest, {
          Quantity: 5,
          AvailabilityZone: "us-east-1a",
        });

        const params = parseFormBody(request.body as string);
        expect(params["Quantity"]).toBe("5");
        expect(params["AvailabilityZone"]).toBe("us-east-1a");
        expect(params["quantity"]).toBeUndefined();
      }),
    );
  });

  // ==========================================================================
  // List Serialization
  // ==========================================================================

  describe("list serialization", () => {
    it.effect("should serialize lists with 1-based indexing", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(DescribeInstancesRequest, {
          InstanceIds: ["i-111", "i-222", "i-333"],
        });

        const params = parseFormBody(request.body as string);
        expect(params["InstanceId.1"]).toBe("i-111");
        expect(params["InstanceId.2"]).toBe("i-222");
        expect(params["InstanceId.3"]).toBe("i-333");
      }),
    );

    it.effect("should not serialize empty lists", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(DescribeInstancesRequest, {
          InstanceIds: [],
        });

        const params = parseFormBody(request.body as string);
        // Empty lists should not produce any entries
        expect(
          Object.keys(params).filter((k) => k.startsWith("InstanceId")),
        ).toHaveLength(0);
      }),
    );

    it.effect("should serialize nested structures in lists (Tags)", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(CreateTagsRequest, {
          Resources: ["i-12345678", "i-87654321"],
          Tags: [
            { Key: "Environment", Value: "Production" },
            { Key: "Team", Value: "Platform" },
          ],
        });

        const params = parseFormBody(request.body as string);
        // Resources list
        expect(params["ResourceId.1"]).toBe("i-12345678");
        expect(params["ResourceId.2"]).toBe("i-87654321");
        // Tags list with nested Key/Value
        expect(params["Tag.1.Key"]).toBe("Environment");
        expect(params["Tag.1.Value"]).toBe("Production");
        expect(params["Tag.2.Key"]).toBe("Team");
        expect(params["Tag.2.Value"]).toBe("Platform");
      }),
    );

    it.effect(
      "should serialize deeply nested structures (TagSpecifications)",
      () =>
        Effect.gen(function* () {
          const request = yield* buildRequest(AllocateHostsRequest, {
            TagSpecifications: [
              {
                ResourceType: "dedicated-host",
                Tags: [
                  { Key: "Name", Value: "MyHost" },
                  { Key: "Env", Value: "Dev" },
                ],
              },
            ],
          });

          const params = parseFormBody(request.body as string);
          expect(params["TagSpecification.1.ResourceType"]).toBe(
            "dedicated-host",
          );
          expect(params["TagSpecification.1.Tag.1.Key"]).toBe("Name");
          expect(params["TagSpecification.1.Tag.1.Value"]).toBe("MyHost");
          expect(params["TagSpecification.1.Tag.2.Key"]).toBe("Env");
          expect(params["TagSpecification.1.Tag.2.Value"]).toBe("Dev");
        }),
    );
  });

  // ==========================================================================
  // Timestamp Serialization
  // ==========================================================================

  describe("timestamp serialization", () => {
    it.effect("should serialize timestamps as ISO 8601 by default", () =>
      Effect.gen(function* () {
        const testDate = new Date("2024-01-15T12:30:00.000Z");
        const request = yield* buildRequest(
          DescribeSpotFleetRequestHistoryRequest,
          {
            SpotFleetRequestId: "sfr-12345678",
            StartTime: testDate,
          },
        );

        const params = parseFormBody(request.body as string);
        // EC2 Query uses ISO 8601 (date-time) format by default
        expect(params["StartTime"]).toBe("2024-01-15T12:30:00.000Z");
      }),
    );
  });

  // ==========================================================================
  // Response Deserialization
  // ==========================================================================

  describe("response deserialization", () => {
    it.effect("should deserialize simple response with nested object", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<AcceptVpcPeeringConnectionResponse xmlns="http://ec2.amazonaws.com/doc/2016-11-15/">
    <requestId>abc123</requestId>
    <vpcPeeringConnection>
        <vpcPeeringConnectionId>pcx-12345678</vpcPeeringConnectionId>
    </vpcPeeringConnection>
</AcceptVpcPeeringConnectionResponse>`,
        };

        const result = yield* parseResponse(
          AcceptVpcPeeringConnectionResult,
          response,
        );

        expect(result.VpcPeeringConnection).toBeDefined();
      }),
    );

    it.effect("should deserialize response with lists using item wrapper", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<DescribeInstancesResponse xmlns="http://ec2.amazonaws.com/doc/2016-11-15/">
    <requestId>abc123</requestId>
    <nextToken>token123</nextToken>
    <reservationSet>
        <item>
            <reservationId>r-12345678</reservationId>
        </item>
        <item>
            <reservationId>r-87654321</reservationId>
        </item>
    </reservationSet>
</DescribeInstancesResponse>`,
        };

        const result = yield* parseResponse(DescribeInstancesResult, response);

        expect(result.NextToken).toBe("token123");
        expect(result.Reservations).toHaveLength(2);
      }),
    );

    it.effect(
      "should deserialize response with nested object (RouteTableAssociationState)",
      () =>
        Effect.gen(function* () {
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: { "Content-Type": "text/xml;charset=UTF-8" },
            body: `<?xml version="1.0" encoding="UTF-8"?>
<AssociateRouteTableResponse xmlns="http://ec2.amazonaws.com/doc/2016-11-15/">
    <requestId>abc123</requestId>
    <associationId>rtbassoc-12345678</associationId>
    <associationState>
        <state>associated</state>
        <statusMessage>Route table associated</statusMessage>
    </associationState>
</AssociateRouteTableResponse>`,
          };

          const result = yield* parseResponse(
            AssociateRouteTableResult,
            response,
          );

          expect(result.AssociationId).toBe("rtbassoc-12345678");
          expect(result.AssociationState).toBeDefined();
          expect(result.AssociationState?.State).toBe("associated");
          expect(result.AssociationState?.StatusMessage).toBe(
            "Route table associated",
          );
        }),
    );

    it.effect("should deserialize response with timestamps", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<DescribeSpotFleetRequestHistoryResponse xmlns="http://ec2.amazonaws.com/doc/2016-11-15/">
    <requestId>abc123</requestId>
    <spotFleetRequestId>sfr-12345678</spotFleetRequestId>
    <startTime>2024-01-15T12:30:00.000Z</startTime>
    <lastEvaluatedTime>2024-01-15T14:30:00.000Z</lastEvaluatedTime>
    <historyRecordSet>
        <item>
            <timestamp>2024-01-15T13:00:00.000Z</timestamp>
            <eventType>instanceChange</eventType>
            <eventInformation>
                <instanceId>i-12345678</instanceId>
                <eventSubType>launched</eventSubType>
            </eventInformation>
        </item>
    </historyRecordSet>
</DescribeSpotFleetRequestHistoryResponse>`,
        };

        const result = yield* parseResponse(
          DescribeSpotFleetRequestHistoryResponse,
          response,
        );

        expect(result.SpotFleetRequestId).toBe("sfr-12345678");
        expect(result.StartTime).toBeInstanceOf(Date);
        expect(result.LastEvaluatedTime).toBeInstanceOf(Date);
        expect(result.HistoryRecords).toHaveLength(1);
        expect(result.HistoryRecords?.[0].Timestamp).toBeInstanceOf(Date);
        expect(result.HistoryRecords?.[0].EventType).toBe("instanceChange");
        expect(result.HistoryRecords?.[0].EventInformation?.InstanceId).toBe(
          "i-12345678",
        );
        expect(result.HistoryRecords?.[0].EventInformation?.EventSubType).toBe(
          "launched",
        );
      }),
    );

    it.effect("should deserialize response with simple list (hostIdSet)", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<AllocateHostsResponse xmlns="http://ec2.amazonaws.com/doc/2016-11-15/">
    <requestId>abc123</requestId>
    <hostIdSet>
        <item>h-12345678</item>
        <item>h-87654321</item>
    </hostIdSet>
</AllocateHostsResponse>`,
        };

        const result = yield* parseResponse(AllocateHostsResult, response);

        expect(result.HostIds).toHaveLength(2);
        expect(result.HostIds?.[0]).toBe("h-12345678");
        expect(result.HostIds?.[1]).toBe("h-87654321");
      }),
    );
  });

  // ==========================================================================
  // XML Traits in Response
  // ==========================================================================

  describe("XML trait handling in responses", () => {
    it.effect(
      "should handle xmlName for response properties (lowercase to PascalCase)",
      () =>
        Effect.gen(function* () {
          // nextToken has xmlName("nextToken") - lowercase in XML
          // But property name is NextToken - PascalCase
          const response: Response = {
            status: 200,
            statusText: "OK",
            headers: { "Content-Type": "text/xml;charset=UTF-8" },
            body: `<?xml version="1.0" encoding="UTF-8"?>
<DescribeInstancesResponse xmlns="http://ec2.amazonaws.com/doc/2016-11-15/">
    <requestId>abc123</requestId>
    <nextToken>abc-next-token</nextToken>
</DescribeInstancesResponse>`,
          };

          const result = yield* parseResponse(
            DescribeInstancesResult,
            response,
          );

          expect(result.NextToken).toBe("abc-next-token");
        }),
    );

    it.effect("should handle reservationSet xmlName mapping", () =>
      Effect.gen(function* () {
        // Reservations has xmlName("reservationSet")
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<DescribeInstancesResponse xmlns="http://ec2.amazonaws.com/doc/2016-11-15/">
    <requestId>abc123</requestId>
    <reservationSet>
        <item>
            <reservationId>r-abc</reservationId>
        </item>
    </reservationSet>
</DescribeInstancesResponse>`,
        };

        const result = yield* parseResponse(DescribeInstancesResult, response);

        expect(result.Reservations).toBeDefined();
        expect(result.Reservations).toHaveLength(1);
      }),
    );
  });

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe("edge cases", () => {
    it.effect("should handle empty response body gracefully", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: {},
          body: "",
        };

        const result = yield* parseResponse(DescribeInstancesResult, response);

        expect(result).toEqual({});
      }),
    );

    it.effect("should handle response with only requestId", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 200,
          statusText: "OK",
          headers: { "Content-Type": "text/xml;charset=UTF-8" },
          body: `<?xml version="1.0" encoding="UTF-8"?>
<DescribeInstancesResponse xmlns="http://ec2.amazonaws.com/doc/2016-11-15/">
    <requestId>abc123</requestId>
</DescribeInstancesResponse>`,
        };

        const result = yield* parseResponse(DescribeInstancesResult, response);

        expect(result.NextToken).toBeUndefined();
        expect(result.Reservations).toBeUndefined();
      }),
    );

    it.effect("should URL-encode special characters in request values", () =>
      Effect.gen(function* () {
        const request = yield* buildRequest(DescribeInstancesRequest, {
          InstanceIds: ["i-abc&123", "i-test=value"],
        });

        // The body should have properly encoded special characters
        expect(request.body).toContain("i-abc%26123");
        expect(request.body).toContain("i-test%3Dvalue");
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
<DescribeInstancesResponse xmlns="http://ec2.amazonaws.com/doc/2016-11-15/">
    <requestId>abc123</requestId>
    <reservationSet>
        <item>
            <reservationId>r-single</reservationId>
        </item>
    </reservationSet>
</DescribeInstancesResponse>`,
          };

          const result = yield* parseResponse(
            DescribeInstancesResult,
            response,
          );

          // Should still be an array with one item
          expect(Array.isArray(result.Reservations)).toBe(true);
          expect(result.Reservations).toHaveLength(1);
        }),
    );
  });

  // ==========================================================================
  // Error Deserialization
  // ==========================================================================

  describe("error deserialization", () => {
    it.effect(
      "should deserialize EC2-style error format (Response > Errors > Error)",
      () =>
        Effect.gen(function* () {
          // EC2 uses a different error format than awsQuery
          const response: Response = {
            status: 400,
            statusText: "Bad Request",
            headers: {},
            body: `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Errors>
    <Error>
      <Code>ValidationException</Code>
      <Message>Invalid parameter value</Message>
    </Error>
  </Errors>
  <RequestID>ec2-req-123</RequestID>
</Response>`,
          };

          const result = yield* parseResponse(
            DescribeInstancesRequest,
            response,
            [],
          ).pipe(Effect.flip);

          expect(result).toBeInstanceOf(ValidationException);
          expect(result._tag).toBe("ValidationException");
        }),
    );

    it.effect("should preserve RequestID in error data", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 400,
          statusText: "Bad Request",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Errors>
    <Error>
      <Code>InvalidParameterValue</Code>
      <Message>The value 'invalid' is not valid for parameter 'InstanceType'</Message>
    </Error>
  </Errors>
  <RequestID>req-abc-456</RequestID>
</Response>`,
        };

        const result = yield* parseResponse(
          DescribeInstancesRequest,
          response,
          [],
        ).pipe(Effect.flip);

        expect(result).toBeInstanceOf(UnknownAwsError);
        expect((result as UnknownAwsError).errorTag).toBe(
          "InvalidParameterValue",
        );
        expect((result as UnknownAwsError).errorData).toMatchObject({
          Message:
            "The value 'invalid' is not valid for parameter 'InstanceType'",
          RequestID: "req-abc-456",
        });
      }),
    );

    it.effect("should return UnknownAwsError for unknown error codes", () =>
      Effect.gen(function* () {
        const response: Response = {
          status: 500,
          statusText: "Internal Server Error",
          headers: {},
          body: `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Errors>
    <Error>
      <Code>SomeUnknownEC2Error</Code>
      <Message>An internal error has occurred</Message>
    </Error>
  </Errors>
  <RequestID>err-789</RequestID>
</Response>`,
        };

        const result = yield* parseResponse(
          DescribeInstancesRequest,
          response,
          [],
        ).pipe(Effect.flip);

        expect(result).toBeInstanceOf(UnknownAwsError);
        expect((result as UnknownAwsError).errorTag).toBe(
          "SomeUnknownEC2Error",
        );
      }),
    );
  });
});
