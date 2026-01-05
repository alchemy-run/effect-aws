import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "MediaLive",
  serviceShapeName: "MediaLive",
});
const auth = T.AwsAuthSigv4({ name: "medialive" });
const ver = T.ServiceVersion("2017-10-14");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
      type: "string",
    },
    UseDualStack: {
      builtIn: "AWS::UseDualStack",
      required: true,
      default: false,
      documentation:
        "When true, use the dual-stack endpoint. If the configured endpoint does not support dual-stack, dispatching the request MAY return an error.",
      type: "boolean",
    },
    UseFIPS: {
      builtIn: "AWS::UseFIPS",
      required: true,
      default: false,
      documentation:
        "When true, send this request to the FIPS-compliant regional endpoint. If the configured endpoint does not have a FIPS compliant endpoint, dispatching the request will return an error.",
      type: "boolean",
    },
    Endpoint: {
      builtIn: "SDK::Endpoint",
      required: false,
      documentation: "Override the endpoint used to send this request",
      type: "string",
    },
  },
  rules: [
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }],
      rules: [
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
          ],
          error:
            "Invalid Configuration: FIPS and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [
            { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
          ],
          error:
            "Invalid Configuration: Dualstack and custom endpoint are not supported",
          type: "error",
        },
        {
          conditions: [],
          endpoint: { url: { ref: "Endpoint" }, properties: {}, headers: {} },
          type: "endpoint",
        },
      ],
      type: "tree",
    },
    {
      conditions: [{ fn: "isSet", argv: [{ ref: "Region" }] }],
      rules: [
        {
          conditions: [
            {
              fn: "aws.partition",
              argv: [{ ref: "Region" }],
              assign: "PartitionResult",
            },
          ],
          rules: [
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                      ],
                    },
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://medialive-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "FIPS and DualStack are enabled, but this partition does not support one or both",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        {
                          fn: "getAttr",
                          argv: [{ ref: "PartitionResult" }, "supportsFIPS"],
                        },
                        true,
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://medialive-fips.{Region}.{PartitionResult#dnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "FIPS is enabled but this partition does not support FIPS",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
              ],
              rules: [
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [
                        true,
                        {
                          fn: "getAttr",
                          argv: [
                            { ref: "PartitionResult" },
                            "supportsDualStack",
                          ],
                        },
                      ],
                    },
                  ],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://medialive.{Region}.{PartitionResult#dualStackDnsSuffix}",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  error:
                    "DualStack is enabled but this partition does not support DualStack",
                  type: "error",
                },
              ],
              type: "tree",
            },
            {
              conditions: [],
              endpoint: {
                url: "https://medialive.{Region}.{PartitionResult#dnsSuffix}",
                properties: {},
                headers: {},
              },
              type: "endpoint",
            },
          ],
          type: "tree",
        },
      ],
      type: "tree",
    },
    {
      conditions: [],
      error: "Invalid Configuration: Missing Region",
      type: "error",
    },
  ],
});

//# Schemas
export class DescribeAccountConfigurationRequest extends S.Class<DescribeAccountConfigurationRequest>(
  "DescribeAccountConfigurationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/prod/accountConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListVersionsRequest extends S.Class<ListVersionsRequest>(
  "ListVersionsRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/prod/versions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const __listOf__string = S.Array(S.String);
export const InputSdiSources = S.Array(S.String);
export const __listOf__stringPatternS = S.Array(S.String);
export const __listOfChannelPipelineIdToRestart = S.Array(S.String);
export class AcceptInputDeviceTransferRequest extends S.Class<AcceptInputDeviceTransferRequest>(
  "AcceptInputDeviceTransferRequest",
)(
  { InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/prod/inputDevices/{InputDeviceId}/accept",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AcceptInputDeviceTransferResponse extends S.Class<AcceptInputDeviceTransferResponse>(
  "AcceptInputDeviceTransferResponse",
)({}) {}
export class BatchDeleteRequest extends S.Class<BatchDeleteRequest>(
  "BatchDeleteRequest",
)(
  {
    ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
    InputIds: S.optional(__listOf__string).pipe(T.JsonName("inputIds")),
    InputSecurityGroupIds: S.optional(__listOf__string).pipe(
      T.JsonName("inputSecurityGroupIds"),
    ),
    MultiplexIds: S.optional(__listOf__string).pipe(T.JsonName("multiplexIds")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/batch/delete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchStartRequest extends S.Class<BatchStartRequest>(
  "BatchStartRequest",
)(
  {
    ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
    MultiplexIds: S.optional(__listOf__string).pipe(T.JsonName("multiplexIds")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/batch/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchStopRequest extends S.Class<BatchStopRequest>(
  "BatchStopRequest",
)(
  {
    ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
    MultiplexIds: S.optional(__listOf__string).pipe(T.JsonName("multiplexIds")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/batch/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelInputDeviceTransferRequest extends S.Class<CancelInputDeviceTransferRequest>(
  "CancelInputDeviceTransferRequest",
)(
  { InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/prod/inputDevices/{InputDeviceId}/cancel",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelInputDeviceTransferResponse extends S.Class<CancelInputDeviceTransferResponse>(
  "CancelInputDeviceTransferResponse",
)({}) {}
export class ClaimDeviceRequest extends S.Class<ClaimDeviceRequest>(
  "ClaimDeviceRequest",
)(
  { Id: S.optional(S.String).pipe(T.JsonName("id")) },
  T.all(
    T.Http({ method: "POST", uri: "/prod/claimDevice" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ClaimDeviceResponse extends S.Class<ClaimDeviceResponse>(
  "ClaimDeviceResponse",
)({}) {}
export const Tags = S.Record({ key: S.String, value: S.String });
export class CreateChannelPlacementGroupRequest extends S.Class<CreateChannelPlacementGroupRequest>(
  "CreateChannelPlacementGroupRequest",
)(
  {
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/prod/clusters/{ClusterId}/channelplacementgroups",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class CreateCloudWatchAlarmTemplateGroupRequest extends S.Class<CreateCloudWatchAlarmTemplateGroupRequest>(
  "CreateCloudWatchAlarmTemplateGroupRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/cloudwatch-alarm-template-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEventBridgeRuleTemplateGroupRequest extends S.Class<CreateEventBridgeRuleTemplateGroupRequest>(
  "CreateEventBridgeRuleTemplateGroupRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Name: S.String.pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/eventbridge-rule-template-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreatePartnerInputRequest extends S.Class<CreatePartnerInputRequest>(
  "CreatePartnerInputRequest",
)(
  {
    InputId: S.String.pipe(T.HttpLabel("InputId")),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/inputs/{InputId}/partners" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSdiSourceRequest extends S.Class<CreateSdiSourceRequest>(
  "CreateSdiSourceRequest",
)(
  {
    Mode: S.optional(S.String).pipe(T.JsonName("mode")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/sdiSources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSignalMapRequest extends S.Class<CreateSignalMapRequest>(
  "CreateSignalMapRequest",
)(
  {
    CloudWatchAlarmTemplateGroupIdentifiers: S.optional(
      __listOf__stringPatternS,
    ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIdentifiers")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DiscoveryEntryPointArn: S.String.pipe(T.JsonName("discoveryEntryPointArn")),
    EventBridgeRuleTemplateGroupIdentifiers: S.optional(
      __listOf__stringPatternS,
    ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIdentifiers")),
    Name: S.String.pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/signal-maps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTagsRequest extends S.Class<CreateTagsRequest>(
  "CreateTagsRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateTagsResponse extends S.Class<CreateTagsResponse>(
  "CreateTagsResponse",
)({}) {}
export class DeleteChannelRequest extends S.Class<DeleteChannelRequest>(
  "DeleteChannelRequest",
)(
  { ChannelId: S.String.pipe(T.HttpLabel("ChannelId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/prod/channels/{ChannelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChannelPlacementGroupRequest extends S.Class<DeleteChannelPlacementGroupRequest>(
  "DeleteChannelPlacementGroupRequest",
)(
  {
    ChannelPlacementGroupId: S.String.pipe(
      T.HttpLabel("ChannelPlacementGroupId"),
    ),
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/prod/clusters/{ClusterId}/channelplacementgroups/{ChannelPlacementGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCloudWatchAlarmTemplateRequest extends S.Class<DeleteCloudWatchAlarmTemplateRequest>(
  "DeleteCloudWatchAlarmTemplateRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/prod/cloudwatch-alarm-templates/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCloudWatchAlarmTemplateResponse extends S.Class<DeleteCloudWatchAlarmTemplateResponse>(
  "DeleteCloudWatchAlarmTemplateResponse",
)({}) {}
export class DeleteCloudWatchAlarmTemplateGroupRequest extends S.Class<DeleteCloudWatchAlarmTemplateGroupRequest>(
  "DeleteCloudWatchAlarmTemplateGroupRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/prod/cloudwatch-alarm-template-groups/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteCloudWatchAlarmTemplateGroupResponse extends S.Class<DeleteCloudWatchAlarmTemplateGroupResponse>(
  "DeleteCloudWatchAlarmTemplateGroupResponse",
)({}) {}
export class DeleteClusterRequest extends S.Class<DeleteClusterRequest>(
  "DeleteClusterRequest",
)(
  { ClusterId: S.String.pipe(T.HttpLabel("ClusterId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/prod/clusters/{ClusterId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventBridgeRuleTemplateRequest extends S.Class<DeleteEventBridgeRuleTemplateRequest>(
  "DeleteEventBridgeRuleTemplateRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/prod/eventbridge-rule-templates/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventBridgeRuleTemplateResponse extends S.Class<DeleteEventBridgeRuleTemplateResponse>(
  "DeleteEventBridgeRuleTemplateResponse",
)({}) {}
export class DeleteEventBridgeRuleTemplateGroupRequest extends S.Class<DeleteEventBridgeRuleTemplateGroupRequest>(
  "DeleteEventBridgeRuleTemplateGroupRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/prod/eventbridge-rule-template-groups/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteEventBridgeRuleTemplateGroupResponse extends S.Class<DeleteEventBridgeRuleTemplateGroupResponse>(
  "DeleteEventBridgeRuleTemplateGroupResponse",
)({}) {}
export class DeleteInputRequest extends S.Class<DeleteInputRequest>(
  "DeleteInputRequest",
)(
  { InputId: S.String.pipe(T.HttpLabel("InputId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/prod/inputs/{InputId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInputResponse extends S.Class<DeleteInputResponse>(
  "DeleteInputResponse",
)({}) {}
export class DeleteInputSecurityGroupRequest extends S.Class<DeleteInputSecurityGroupRequest>(
  "DeleteInputSecurityGroupRequest",
)(
  { InputSecurityGroupId: S.String.pipe(T.HttpLabel("InputSecurityGroupId")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/prod/inputSecurityGroups/{InputSecurityGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInputSecurityGroupResponse extends S.Class<DeleteInputSecurityGroupResponse>(
  "DeleteInputSecurityGroupResponse",
)({}) {}
export class DeleteMultiplexRequest extends S.Class<DeleteMultiplexRequest>(
  "DeleteMultiplexRequest",
)(
  { MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/prod/multiplexes/{MultiplexId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteMultiplexProgramRequest extends S.Class<DeleteMultiplexProgramRequest>(
  "DeleteMultiplexProgramRequest",
)(
  {
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/prod/multiplexes/{MultiplexId}/programs/{ProgramName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNetworkRequest extends S.Class<DeleteNetworkRequest>(
  "DeleteNetworkRequest",
)(
  { NetworkId: S.String.pipe(T.HttpLabel("NetworkId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/prod/networks/{NetworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteNodeRequest extends S.Class<DeleteNodeRequest>(
  "DeleteNodeRequest",
)(
  {
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    NodeId: S.String.pipe(T.HttpLabel("NodeId")),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/prod/clusters/{ClusterId}/nodes/{NodeId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteReservationRequest extends S.Class<DeleteReservationRequest>(
  "DeleteReservationRequest",
)(
  { ReservationId: S.String.pipe(T.HttpLabel("ReservationId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/prod/reservations/{ReservationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScheduleRequest extends S.Class<DeleteScheduleRequest>(
  "DeleteScheduleRequest",
)(
  { ChannelId: S.String.pipe(T.HttpLabel("ChannelId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/prod/channels/{ChannelId}/schedule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteScheduleResponse extends S.Class<DeleteScheduleResponse>(
  "DeleteScheduleResponse",
)({}) {}
export class DeleteSdiSourceRequest extends S.Class<DeleteSdiSourceRequest>(
  "DeleteSdiSourceRequest",
)(
  { SdiSourceId: S.String.pipe(T.HttpLabel("SdiSourceId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/prod/sdiSources/{SdiSourceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSignalMapRequest extends S.Class<DeleteSignalMapRequest>(
  "DeleteSignalMapRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/prod/signal-maps/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteSignalMapResponse extends S.Class<DeleteSignalMapResponse>(
  "DeleteSignalMapResponse",
)({}) {}
export class DeleteTagsRequest extends S.Class<DeleteTagsRequest>(
  "DeleteTagsRequest",
)(
  {
    ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")),
    TagKeys: __listOf__string.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/prod/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteTagsResponse extends S.Class<DeleteTagsResponse>(
  "DeleteTagsResponse",
)({}) {}
export class DescribeChannelRequest extends S.Class<DescribeChannelRequest>(
  "DescribeChannelRequest",
)(
  { ChannelId: S.String.pipe(T.HttpLabel("ChannelId")) },
  T.all(
    T.Http({ method: "GET", uri: "/prod/channels/{ChannelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeChannelPlacementGroupRequest extends S.Class<DescribeChannelPlacementGroupRequest>(
  "DescribeChannelPlacementGroupRequest",
)(
  {
    ChannelPlacementGroupId: S.String.pipe(
      T.HttpLabel("ChannelPlacementGroupId"),
    ),
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/prod/clusters/{ClusterId}/channelplacementgroups/{ChannelPlacementGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeClusterRequest extends S.Class<DescribeClusterRequest>(
  "DescribeClusterRequest",
)(
  { ClusterId: S.String.pipe(T.HttpLabel("ClusterId")) },
  T.all(
    T.Http({ method: "GET", uri: "/prod/clusters/{ClusterId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInputRequest extends S.Class<DescribeInputRequest>(
  "DescribeInputRequest",
)(
  { InputId: S.String.pipe(T.HttpLabel("InputId")) },
  T.all(
    T.Http({ method: "GET", uri: "/prod/inputs/{InputId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInputDeviceRequest extends S.Class<DescribeInputDeviceRequest>(
  "DescribeInputDeviceRequest",
)(
  { InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/prod/inputDevices/{InputDeviceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInputDeviceThumbnailRequest extends S.Class<DescribeInputDeviceThumbnailRequest>(
  "DescribeInputDeviceThumbnailRequest",
)(
  {
    InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")),
    Accept: S.String.pipe(T.HttpHeader("accept")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/prod/inputDevices/{InputDeviceId}/thumbnailData",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInputSecurityGroupRequest extends S.Class<DescribeInputSecurityGroupRequest>(
  "DescribeInputSecurityGroupRequest",
)(
  { InputSecurityGroupId: S.String.pipe(T.HttpLabel("InputSecurityGroupId")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/prod/inputSecurityGroups/{InputSecurityGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeMultiplexRequest extends S.Class<DescribeMultiplexRequest>(
  "DescribeMultiplexRequest",
)(
  { MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")) },
  T.all(
    T.Http({ method: "GET", uri: "/prod/multiplexes/{MultiplexId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeMultiplexProgramRequest extends S.Class<DescribeMultiplexProgramRequest>(
  "DescribeMultiplexProgramRequest",
)(
  {
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/prod/multiplexes/{MultiplexId}/programs/{ProgramName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeNetworkRequest extends S.Class<DescribeNetworkRequest>(
  "DescribeNetworkRequest",
)(
  { NetworkId: S.String.pipe(T.HttpLabel("NetworkId")) },
  T.all(
    T.Http({ method: "GET", uri: "/prod/networks/{NetworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeNodeRequest extends S.Class<DescribeNodeRequest>(
  "DescribeNodeRequest",
)(
  {
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    NodeId: S.String.pipe(T.HttpLabel("NodeId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/clusters/{ClusterId}/nodes/{NodeId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeOfferingRequest extends S.Class<DescribeOfferingRequest>(
  "DescribeOfferingRequest",
)(
  { OfferingId: S.String.pipe(T.HttpLabel("OfferingId")) },
  T.all(
    T.Http({ method: "GET", uri: "/prod/offerings/{OfferingId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeReservationRequest extends S.Class<DescribeReservationRequest>(
  "DescribeReservationRequest",
)(
  { ReservationId: S.String.pipe(T.HttpLabel("ReservationId")) },
  T.all(
    T.Http({ method: "GET", uri: "/prod/reservations/{ReservationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeScheduleRequest extends S.Class<DescribeScheduleRequest>(
  "DescribeScheduleRequest",
)(
  {
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/channels/{ChannelId}/schedule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeSdiSourceRequest extends S.Class<DescribeSdiSourceRequest>(
  "DescribeSdiSourceRequest",
)(
  { SdiSourceId: S.String.pipe(T.HttpLabel("SdiSourceId")) },
  T.all(
    T.Http({ method: "GET", uri: "/prod/sdiSources/{SdiSourceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeThumbnailsRequest extends S.Class<DescribeThumbnailsRequest>(
  "DescribeThumbnailsRequest",
)(
  {
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    PipelineId: S.String.pipe(T.HttpQuery("pipelineId")),
    ThumbnailType: S.String.pipe(T.HttpQuery("thumbnailType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/channels/{ChannelId}/thumbnails" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCloudWatchAlarmTemplateRequest extends S.Class<GetCloudWatchAlarmTemplateRequest>(
  "GetCloudWatchAlarmTemplateRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/prod/cloudwatch-alarm-templates/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetCloudWatchAlarmTemplateGroupRequest extends S.Class<GetCloudWatchAlarmTemplateGroupRequest>(
  "GetCloudWatchAlarmTemplateGroupRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/prod/cloudwatch-alarm-template-groups/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEventBridgeRuleTemplateRequest extends S.Class<GetEventBridgeRuleTemplateRequest>(
  "GetEventBridgeRuleTemplateRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/prod/eventbridge-rule-templates/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetEventBridgeRuleTemplateGroupRequest extends S.Class<GetEventBridgeRuleTemplateGroupRequest>(
  "GetEventBridgeRuleTemplateGroupRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/prod/eventbridge-rule-template-groups/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSignalMapRequest extends S.Class<GetSignalMapRequest>(
  "GetSignalMapRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({ method: "GET", uri: "/prod/signal-maps/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAlertsRequest extends S.Class<ListAlertsRequest>(
  "ListAlertsRequest",
)(
  {
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    StateFilter: S.optional(S.String).pipe(T.HttpQuery("stateFilter")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/channels/{ChannelId}/alerts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListChannelPlacementGroupsRequest extends S.Class<ListChannelPlacementGroupsRequest>(
  "ListChannelPlacementGroupsRequest",
)(
  {
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/prod/clusters/{ClusterId}/channelplacementgroups",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListChannelsRequest extends S.Class<ListChannelsRequest>(
  "ListChannelsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/channels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCloudWatchAlarmTemplateGroupsRequest extends S.Class<ListCloudWatchAlarmTemplateGroupsRequest>(
  "ListCloudWatchAlarmTemplateGroupsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Scope: S.optional(S.String).pipe(T.HttpQuery("scope")),
    SignalMapIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("signalMapIdentifier"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/cloudwatch-alarm-template-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCloudWatchAlarmTemplatesRequest extends S.Class<ListCloudWatchAlarmTemplatesRequest>(
  "ListCloudWatchAlarmTemplatesRequest",
)(
  {
    GroupIdentifier: S.optional(S.String).pipe(T.HttpQuery("groupIdentifier")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Scope: S.optional(S.String).pipe(T.HttpQuery("scope")),
    SignalMapIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("signalMapIdentifier"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/cloudwatch-alarm-templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClusterAlertsRequest extends S.Class<ListClusterAlertsRequest>(
  "ListClusterAlertsRequest",
)(
  {
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    StateFilter: S.optional(S.String).pipe(T.HttpQuery("stateFilter")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/clusters/{ClusterId}/alerts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListClustersRequest extends S.Class<ListClustersRequest>(
  "ListClustersRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/clusters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEventBridgeRuleTemplateGroupsRequest extends S.Class<ListEventBridgeRuleTemplateGroupsRequest>(
  "ListEventBridgeRuleTemplateGroupsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    SignalMapIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("signalMapIdentifier"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/eventbridge-rule-template-groups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListEventBridgeRuleTemplatesRequest extends S.Class<ListEventBridgeRuleTemplatesRequest>(
  "ListEventBridgeRuleTemplatesRequest",
)(
  {
    GroupIdentifier: S.optional(S.String).pipe(T.HttpQuery("groupIdentifier")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    SignalMapIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("signalMapIdentifier"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/eventbridge-rule-templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInputDevicesRequest extends S.Class<ListInputDevicesRequest>(
  "ListInputDevicesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/inputDevices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInputDeviceTransfersRequest extends S.Class<ListInputDeviceTransfersRequest>(
  "ListInputDeviceTransfersRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    TransferType: S.String.pipe(T.HttpQuery("transferType")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/inputDeviceTransfers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInputsRequest extends S.Class<ListInputsRequest>(
  "ListInputsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/inputs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInputSecurityGroupsRequest extends S.Class<ListInputSecurityGroupsRequest>(
  "ListInputSecurityGroupsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/inputSecurityGroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMultiplexAlertsRequest extends S.Class<ListMultiplexAlertsRequest>(
  "ListMultiplexAlertsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    StateFilter: S.optional(S.String).pipe(T.HttpQuery("stateFilter")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/multiplexes/{MultiplexId}/alerts" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMultiplexesRequest extends S.Class<ListMultiplexesRequest>(
  "ListMultiplexesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/multiplexes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMultiplexProgramsRequest extends S.Class<ListMultiplexProgramsRequest>(
  "ListMultiplexProgramsRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/multiplexes/{MultiplexId}/programs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNetworksRequest extends S.Class<ListNetworksRequest>(
  "ListNetworksRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/networks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNodesRequest extends S.Class<ListNodesRequest>(
  "ListNodesRequest",
)(
  {
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/clusters/{ClusterId}/nodes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOfferingsRequest extends S.Class<ListOfferingsRequest>(
  "ListOfferingsRequest",
)(
  {
    ChannelClass: S.optional(S.String).pipe(T.HttpQuery("channelClass")),
    ChannelConfiguration: S.optional(S.String).pipe(
      T.HttpQuery("channelConfiguration"),
    ),
    Codec: S.optional(S.String).pipe(T.HttpQuery("codec")),
    Duration: S.optional(S.String).pipe(T.HttpQuery("duration")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    MaximumBitrate: S.optional(S.String).pipe(T.HttpQuery("maximumBitrate")),
    MaximumFramerate: S.optional(S.String).pipe(
      T.HttpQuery("maximumFramerate"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Resolution: S.optional(S.String).pipe(T.HttpQuery("resolution")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    SpecialFeature: S.optional(S.String).pipe(T.HttpQuery("specialFeature")),
    VideoQuality: S.optional(S.String).pipe(T.HttpQuery("videoQuality")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/offerings" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReservationsRequest extends S.Class<ListReservationsRequest>(
  "ListReservationsRequest",
)(
  {
    ChannelClass: S.optional(S.String).pipe(T.HttpQuery("channelClass")),
    Codec: S.optional(S.String).pipe(T.HttpQuery("codec")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    MaximumBitrate: S.optional(S.String).pipe(T.HttpQuery("maximumBitrate")),
    MaximumFramerate: S.optional(S.String).pipe(
      T.HttpQuery("maximumFramerate"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    Resolution: S.optional(S.String).pipe(T.HttpQuery("resolution")),
    ResourceType: S.optional(S.String).pipe(T.HttpQuery("resourceType")),
    SpecialFeature: S.optional(S.String).pipe(T.HttpQuery("specialFeature")),
    VideoQuality: S.optional(S.String).pipe(T.HttpQuery("videoQuality")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/reservations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSdiSourcesRequest extends S.Class<ListSdiSourcesRequest>(
  "ListSdiSourcesRequest",
)(
  {
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/sdiSources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListSignalMapsRequest extends S.Class<ListSignalMapsRequest>(
  "ListSignalMapsRequest",
)(
  {
    CloudWatchAlarmTemplateGroupIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("cloudWatchAlarmTemplateGroupIdentifier"),
    ),
    EventBridgeRuleTemplateGroupIdentifier: S.optional(S.String).pipe(
      T.HttpQuery("eventBridgeRuleTemplateGroupIdentifier"),
    ),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/prod/signal-maps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String.pipe(T.HttpLabel("ResourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/prod/tags/{ResourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RebootInputDeviceRequest extends S.Class<RebootInputDeviceRequest>(
  "RebootInputDeviceRequest",
)(
  {
    Force: S.optional(S.String).pipe(T.JsonName("force")),
    InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/prod/inputDevices/{InputDeviceId}/reboot",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RebootInputDeviceResponse extends S.Class<RebootInputDeviceResponse>(
  "RebootInputDeviceResponse",
)({}) {}
export class RejectInputDeviceTransferRequest extends S.Class<RejectInputDeviceTransferRequest>(
  "RejectInputDeviceTransferRequest",
)(
  { InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/prod/inputDevices/{InputDeviceId}/reject",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RejectInputDeviceTransferResponse extends S.Class<RejectInputDeviceTransferResponse>(
  "RejectInputDeviceTransferResponse",
)({}) {}
export class RestartChannelPipelinesRequest extends S.Class<RestartChannelPipelinesRequest>(
  "RestartChannelPipelinesRequest",
)(
  {
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    PipelineIds: S.optional(__listOfChannelPipelineIdToRestart).pipe(
      T.JsonName("pipelineIds"),
    ),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/prod/channels/{ChannelId}/restartChannelPipelines",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartChannelRequest extends S.Class<StartChannelRequest>(
  "StartChannelRequest",
)(
  { ChannelId: S.String.pipe(T.HttpLabel("ChannelId")) },
  T.all(
    T.Http({ method: "POST", uri: "/prod/channels/{ChannelId}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartDeleteMonitorDeploymentRequest extends S.Class<StartDeleteMonitorDeploymentRequest>(
  "StartDeleteMonitorDeploymentRequest",
)(
  { Identifier: S.String.pipe(T.HttpLabel("Identifier")) },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/prod/signal-maps/{Identifier}/monitor-deployment",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartInputDeviceRequest extends S.Class<StartInputDeviceRequest>(
  "StartInputDeviceRequest",
)(
  { InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) },
  T.all(
    T.Http({ method: "POST", uri: "/prod/inputDevices/{InputDeviceId}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartInputDeviceResponse extends S.Class<StartInputDeviceResponse>(
  "StartInputDeviceResponse",
)({}) {}
export class StartInputDeviceMaintenanceWindowRequest extends S.Class<StartInputDeviceMaintenanceWindowRequest>(
  "StartInputDeviceMaintenanceWindowRequest",
)(
  { InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/prod/inputDevices/{InputDeviceId}/startInputDeviceMaintenanceWindow",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartInputDeviceMaintenanceWindowResponse extends S.Class<StartInputDeviceMaintenanceWindowResponse>(
  "StartInputDeviceMaintenanceWindowResponse",
)({}) {}
export class StartMonitorDeploymentRequest extends S.Class<StartMonitorDeploymentRequest>(
  "StartMonitorDeploymentRequest",
)(
  {
    DryRun: S.optional(S.Boolean).pipe(T.JsonName("dryRun")),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/prod/signal-maps/{Identifier}/monitor-deployment",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartMultiplexRequest extends S.Class<StartMultiplexRequest>(
  "StartMultiplexRequest",
)(
  { MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")) },
  T.all(
    T.Http({ method: "POST", uri: "/prod/multiplexes/{MultiplexId}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartUpdateSignalMapRequest extends S.Class<StartUpdateSignalMapRequest>(
  "StartUpdateSignalMapRequest",
)(
  {
    CloudWatchAlarmTemplateGroupIdentifiers: S.optional(
      __listOf__stringPatternS,
    ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIdentifiers")),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    DiscoveryEntryPointArn: S.optional(S.String).pipe(
      T.JsonName("discoveryEntryPointArn"),
    ),
    EventBridgeRuleTemplateGroupIdentifiers: S.optional(
      __listOf__stringPatternS,
    ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIdentifiers")),
    ForceRediscovery: S.optional(S.Boolean).pipe(
      T.JsonName("forceRediscovery"),
    ),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/prod/signal-maps/{Identifier}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopChannelRequest extends S.Class<StopChannelRequest>(
  "StopChannelRequest",
)(
  { ChannelId: S.String.pipe(T.HttpLabel("ChannelId")) },
  T.all(
    T.Http({ method: "POST", uri: "/prod/channels/{ChannelId}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopInputDeviceRequest extends S.Class<StopInputDeviceRequest>(
  "StopInputDeviceRequest",
)(
  { InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")) },
  T.all(
    T.Http({ method: "POST", uri: "/prod/inputDevices/{InputDeviceId}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopInputDeviceResponse extends S.Class<StopInputDeviceResponse>(
  "StopInputDeviceResponse",
)({}) {}
export class StopMultiplexRequest extends S.Class<StopMultiplexRequest>(
  "StopMultiplexRequest",
)(
  { MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")) },
  T.all(
    T.Http({ method: "POST", uri: "/prod/multiplexes/{MultiplexId}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TransferInputDeviceRequest extends S.Class<TransferInputDeviceRequest>(
  "TransferInputDeviceRequest",
)(
  {
    InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")),
    TargetCustomerId: S.optional(S.String).pipe(T.JsonName("targetCustomerId")),
    TargetRegion: S.optional(S.String).pipe(T.JsonName("targetRegion")),
    TransferMessage: S.optional(S.String).pipe(T.JsonName("transferMessage")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/prod/inputDevices/{InputDeviceId}/transfer",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TransferInputDeviceResponse extends S.Class<TransferInputDeviceResponse>(
  "TransferInputDeviceResponse",
)({}) {}
export class AccountConfiguration extends S.Class<AccountConfiguration>(
  "AccountConfiguration",
)({ KmsKeyId: S.optional(S.String).pipe(T.JsonName("kmsKeyId")) }) {}
export class UpdateAccountConfigurationRequest extends S.Class<UpdateAccountConfigurationRequest>(
  "UpdateAccountConfigurationRequest",
)(
  {
    AccountConfiguration: S.optional(AccountConfiguration).pipe(
      T.JsonName("accountConfiguration"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prod/accountConfiguration" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MediaPackageOutputDestinationSettings extends S.Class<MediaPackageOutputDestinationSettings>(
  "MediaPackageOutputDestinationSettings",
)({
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  ChannelGroup: S.optional(S.String).pipe(T.JsonName("channelGroup")),
  ChannelName: S.optional(S.String).pipe(T.JsonName("channelName")),
}) {}
export const __listOfMediaPackageOutputDestinationSettings = S.Array(
  MediaPackageOutputDestinationSettings,
);
export class MultiplexProgramChannelDestinationSettings extends S.Class<MultiplexProgramChannelDestinationSettings>(
  "MultiplexProgramChannelDestinationSettings",
)({
  MultiplexId: S.optional(S.String).pipe(T.JsonName("multiplexId")),
  ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
}) {}
export class OutputDestinationSettings extends S.Class<OutputDestinationSettings>(
  "OutputDestinationSettings",
)({
  PasswordParam: S.optional(S.String).pipe(T.JsonName("passwordParam")),
  StreamName: S.optional(S.String).pipe(T.JsonName("streamName")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
  Username: S.optional(S.String).pipe(T.JsonName("username")),
}) {}
export const __listOfOutputDestinationSettings = S.Array(
  OutputDestinationSettings,
);
export class SrtOutputDestinationSettings extends S.Class<SrtOutputDestinationSettings>(
  "SrtOutputDestinationSettings",
)({
  EncryptionPassphraseSecretArn: S.optional(S.String).pipe(
    T.JsonName("encryptionPassphraseSecretArn"),
  ),
  StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
}) {}
export const __listOfSrtOutputDestinationSettings = S.Array(
  SrtOutputDestinationSettings,
);
export class OutputDestination extends S.Class<OutputDestination>(
  "OutputDestination",
)({
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MediaPackageSettings: S.optional(
    __listOfMediaPackageOutputDestinationSettings,
  ).pipe(T.JsonName("mediaPackageSettings")),
  MultiplexSettings: S.optional(
    MultiplexProgramChannelDestinationSettings,
  ).pipe(T.JsonName("multiplexSettings")),
  Settings: S.optional(__listOfOutputDestinationSettings).pipe(
    T.JsonName("settings"),
  ),
  SrtSettings: S.optional(__listOfSrtOutputDestinationSettings).pipe(
    T.JsonName("srtSettings"),
  ),
  LogicalInterfaceNames: S.optional(__listOf__string).pipe(
    T.JsonName("logicalInterfaceNames"),
  ),
}) {}
export const __listOfOutputDestination = S.Array(OutputDestination);
export class UpdateChannelClassRequest extends S.Class<UpdateChannelClassRequest>(
  "UpdateChannelClassRequest",
)(
  {
    ChannelClass: S.String.pipe(T.JsonName("channelClass")),
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prod/channels/{ChannelId}/channelClass" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateChannelPlacementGroupRequest extends S.Class<UpdateChannelPlacementGroupRequest>(
  "UpdateChannelPlacementGroupRequest",
)(
  {
    ChannelPlacementGroupId: S.String.pipe(
      T.HttpLabel("ChannelPlacementGroupId"),
    ),
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/prod/clusters/{ClusterId}/channelplacementgroups/{ChannelPlacementGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCloudWatchAlarmTemplateRequest extends S.Class<UpdateCloudWatchAlarmTemplateRequest>(
  "UpdateCloudWatchAlarmTemplateRequest",
)(
  {
    ComparisonOperator: S.optional(S.String).pipe(
      T.JsonName("comparisonOperator"),
    ),
    DatapointsToAlarm: S.optional(S.Number).pipe(
      T.JsonName("datapointsToAlarm"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EvaluationPeriods: S.optional(S.Number).pipe(
      T.JsonName("evaluationPeriods"),
    ),
    GroupIdentifier: S.optional(S.String).pipe(T.JsonName("groupIdentifier")),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    MetricName: S.optional(S.String).pipe(T.JsonName("metricName")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    Period: S.optional(S.Number).pipe(T.JsonName("period")),
    Statistic: S.optional(S.String).pipe(T.JsonName("statistic")),
    TargetResourceType: S.optional(S.String).pipe(
      T.JsonName("targetResourceType"),
    ),
    Threshold: S.optional(S.Number).pipe(T.JsonName("threshold")),
    TreatMissingData: S.optional(S.String).pipe(T.JsonName("treatMissingData")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/prod/cloudwatch-alarm-templates/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateCloudWatchAlarmTemplateGroupRequest extends S.Class<UpdateCloudWatchAlarmTemplateGroupRequest>(
  "UpdateCloudWatchAlarmTemplateGroupRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/prod/cloudwatch-alarm-template-groups/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class EventBridgeRuleTemplateTarget extends S.Class<EventBridgeRuleTemplateTarget>(
  "EventBridgeRuleTemplateTarget",
)({ Arn: S.String.pipe(T.JsonName("arn")) }) {}
export const __listOfEventBridgeRuleTemplateTarget = S.Array(
  EventBridgeRuleTemplateTarget,
);
export class UpdateEventBridgeRuleTemplateRequest extends S.Class<UpdateEventBridgeRuleTemplateRequest>(
  "UpdateEventBridgeRuleTemplateRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EventTargets: S.optional(__listOfEventBridgeRuleTemplateTarget).pipe(
      T.JsonName("eventTargets"),
    ),
    EventType: S.optional(S.String).pipe(T.JsonName("eventType")),
    GroupIdentifier: S.optional(S.String).pipe(T.JsonName("groupIdentifier")),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/prod/eventbridge-rule-templates/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEventBridgeRuleTemplateGroupRequest extends S.Class<UpdateEventBridgeRuleTemplateGroupRequest>(
  "UpdateEventBridgeRuleTemplateGroupRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    Identifier: S.String.pipe(T.HttpLabel("Identifier")),
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/prod/eventbridge-rule-template-groups/{Identifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class InputWhitelistRuleCidr extends S.Class<InputWhitelistRuleCidr>(
  "InputWhitelistRuleCidr",
)({ Cidr: S.optional(S.String).pipe(T.JsonName("cidr")) }) {}
export const __listOfInputWhitelistRuleCidr = S.Array(InputWhitelistRuleCidr);
export class UpdateInputSecurityGroupRequest extends S.Class<UpdateInputSecurityGroupRequest>(
  "UpdateInputSecurityGroupRequest",
)(
  {
    InputSecurityGroupId: S.String.pipe(T.HttpLabel("InputSecurityGroupId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    WhitelistRules: S.optional(__listOfInputWhitelistRuleCidr).pipe(
      T.JsonName("whitelistRules"),
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/prod/inputSecurityGroups/{InputSecurityGroupId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class MultiplexProgramServiceDescriptor extends S.Class<MultiplexProgramServiceDescriptor>(
  "MultiplexProgramServiceDescriptor",
)({
  ProviderName: S.String.pipe(T.JsonName("providerName")),
  ServiceName: S.String.pipe(T.JsonName("serviceName")),
}) {}
export class MultiplexStatmuxVideoSettings extends S.Class<MultiplexStatmuxVideoSettings>(
  "MultiplexStatmuxVideoSettings",
)({
  MaximumBitrate: S.optional(S.Number).pipe(T.JsonName("maximumBitrate")),
  MinimumBitrate: S.optional(S.Number).pipe(T.JsonName("minimumBitrate")),
  Priority: S.optional(S.Number).pipe(T.JsonName("priority")),
}) {}
export class MultiplexVideoSettings extends S.Class<MultiplexVideoSettings>(
  "MultiplexVideoSettings",
)({
  ConstantBitrate: S.optional(S.Number).pipe(T.JsonName("constantBitrate")),
  StatmuxSettings: S.optional(MultiplexStatmuxVideoSettings).pipe(
    T.JsonName("statmuxSettings"),
  ),
}) {}
export class MultiplexProgramSettings extends S.Class<MultiplexProgramSettings>(
  "MultiplexProgramSettings",
)({
  PreferredChannelPipeline: S.optional(S.String).pipe(
    T.JsonName("preferredChannelPipeline"),
  ),
  ProgramNumber: S.Number.pipe(T.JsonName("programNumber")),
  ServiceDescriptor: S.optional(MultiplexProgramServiceDescriptor).pipe(
    T.JsonName("serviceDescriptor"),
  ),
  VideoSettings: S.optional(MultiplexVideoSettings).pipe(
    T.JsonName("videoSettings"),
  ),
}) {}
export class UpdateMultiplexProgramRequest extends S.Class<UpdateMultiplexProgramRequest>(
  "UpdateMultiplexProgramRequest",
)(
  {
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    MultiplexProgramSettings: S.optional(MultiplexProgramSettings).pipe(
      T.JsonName("multiplexProgramSettings"),
    ),
    ProgramName: S.String.pipe(T.HttpLabel("ProgramName")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/prod/multiplexes/{MultiplexId}/programs/{ProgramName}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNodeStateRequest extends S.Class<UpdateNodeStateRequest>(
  "UpdateNodeStateRequest",
)(
  {
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    NodeId: S.String.pipe(T.HttpLabel("NodeId")),
    State: S.optional(S.String).pipe(T.JsonName("state")),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/prod/clusters/{ClusterId}/nodes/{NodeId}/state",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RenewalSettings extends S.Class<RenewalSettings>(
  "RenewalSettings",
)({
  AutomaticRenewal: S.optional(S.String).pipe(T.JsonName("automaticRenewal")),
  RenewalCount: S.optional(S.Number).pipe(T.JsonName("renewalCount")),
}) {}
export class UpdateReservationRequest extends S.Class<UpdateReservationRequest>(
  "UpdateReservationRequest",
)(
  {
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RenewalSettings: S.optional(RenewalSettings).pipe(
      T.JsonName("renewalSettings"),
    ),
    ReservationId: S.String.pipe(T.HttpLabel("ReservationId")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prod/reservations/{ReservationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateSdiSourceRequest extends S.Class<UpdateSdiSourceRequest>(
  "UpdateSdiSourceRequest",
)(
  {
    Mode: S.optional(S.String).pipe(T.JsonName("mode")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    SdiSourceId: S.String.pipe(T.HttpLabel("SdiSourceId")),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prod/sdiSources/{SdiSourceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BatchScheduleActionDeleteRequest extends S.Class<BatchScheduleActionDeleteRequest>(
  "BatchScheduleActionDeleteRequest",
)({ ActionNames: __listOf__string.pipe(T.JsonName("actionNames")) }) {}
export class CdiInputSpecification extends S.Class<CdiInputSpecification>(
  "CdiInputSpecification",
)({ Resolution: S.optional(S.String).pipe(T.JsonName("resolution")) }) {}
export class InputSpecification extends S.Class<InputSpecification>(
  "InputSpecification",
)({
  Codec: S.optional(S.String).pipe(T.JsonName("codec")),
  MaximumBitrate: S.optional(S.String).pipe(T.JsonName("maximumBitrate")),
  Resolution: S.optional(S.String).pipe(T.JsonName("resolution")),
}) {}
export class MaintenanceCreateSettings extends S.Class<MaintenanceCreateSettings>(
  "MaintenanceCreateSettings",
)({
  MaintenanceDay: S.optional(S.String).pipe(T.JsonName("maintenanceDay")),
  MaintenanceStartTime: S.optional(S.String).pipe(
    T.JsonName("maintenanceStartTime"),
  ),
}) {}
export class VpcOutputSettings extends S.Class<VpcOutputSettings>(
  "VpcOutputSettings",
)({
  PublicAddressAllocationIds: S.optional(__listOf__string).pipe(
    T.JsonName("publicAddressAllocationIds"),
  ),
  SecurityGroupIds: S.optional(__listOf__string).pipe(
    T.JsonName("securityGroupIds"),
  ),
  SubnetIds: __listOf__string.pipe(T.JsonName("subnetIds")),
}) {}
export class AnywhereSettings extends S.Class<AnywhereSettings>(
  "AnywhereSettings",
)({
  ChannelPlacementGroupId: S.optional(S.String).pipe(
    T.JsonName("channelPlacementGroupId"),
  ),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
}) {}
export class ChannelEngineVersionRequest extends S.Class<ChannelEngineVersionRequest>(
  "ChannelEngineVersionRequest",
)({ Version: S.optional(S.String).pipe(T.JsonName("version")) }) {}
export class InputDeviceSettings extends S.Class<InputDeviceSettings>(
  "InputDeviceSettings",
)({ Id: S.optional(S.String).pipe(T.JsonName("id")) }) {}
export const __listOfInputDeviceSettings = S.Array(InputDeviceSettings);
export class MediaConnectFlowRequest extends S.Class<MediaConnectFlowRequest>(
  "MediaConnectFlowRequest",
)({ FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")) }) {}
export const __listOfMediaConnectFlowRequest = S.Array(MediaConnectFlowRequest);
export class InputSourceRequest extends S.Class<InputSourceRequest>(
  "InputSourceRequest",
)({
  PasswordParam: S.optional(S.String).pipe(T.JsonName("passwordParam")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
  Username: S.optional(S.String).pipe(T.JsonName("username")),
}) {}
export const __listOfInputSourceRequest = S.Array(InputSourceRequest);
export class InputVpcRequest extends S.Class<InputVpcRequest>(
  "InputVpcRequest",
)({
  SecurityGroupIds: S.optional(__listOf__string).pipe(
    T.JsonName("securityGroupIds"),
  ),
  SubnetIds: __listOf__string.pipe(T.JsonName("subnetIds")),
}) {}
export class MultiplexSettings extends S.Class<MultiplexSettings>(
  "MultiplexSettings",
)({
  MaximumVideoBufferDelayMilliseconds: S.optional(S.Number).pipe(
    T.JsonName("maximumVideoBufferDelayMilliseconds"),
  ),
  TransportStreamBitrate: S.Number.pipe(T.JsonName("transportStreamBitrate")),
  TransportStreamId: S.Number.pipe(T.JsonName("transportStreamId")),
  TransportStreamReservedBitrate: S.optional(S.Number).pipe(
    T.JsonName("transportStreamReservedBitrate"),
  ),
}) {}
export class IpPoolCreateRequest extends S.Class<IpPoolCreateRequest>(
  "IpPoolCreateRequest",
)({ Cidr: S.optional(S.String).pipe(T.JsonName("cidr")) }) {}
export const __listOfIpPoolCreateRequest = S.Array(IpPoolCreateRequest);
export class RouteCreateRequest extends S.Class<RouteCreateRequest>(
  "RouteCreateRequest",
)({
  Cidr: S.optional(S.String).pipe(T.JsonName("cidr")),
  Gateway: S.optional(S.String).pipe(T.JsonName("gateway")),
}) {}
export const __listOfRouteCreateRequest = S.Array(RouteCreateRequest);
export class NodeInterfaceMappingCreateRequest extends S.Class<NodeInterfaceMappingCreateRequest>(
  "NodeInterfaceMappingCreateRequest",
)({
  LogicalInterfaceName: S.optional(S.String).pipe(
    T.JsonName("logicalInterfaceName"),
  ),
  NetworkInterfaceMode: S.optional(S.String).pipe(
    T.JsonName("networkInterfaceMode"),
  ),
  PhysicalInterfaceName: S.optional(S.String).pipe(
    T.JsonName("physicalInterfaceName"),
  ),
}) {}
export const __listOfNodeInterfaceMappingCreateRequest = S.Array(
  NodeInterfaceMappingCreateRequest,
);
export class NodeInterfaceMapping extends S.Class<NodeInterfaceMapping>(
  "NodeInterfaceMapping",
)({
  LogicalInterfaceName: S.optional(S.String).pipe(
    T.JsonName("logicalInterfaceName"),
  ),
  NetworkInterfaceMode: S.optional(S.String).pipe(
    T.JsonName("networkInterfaceMode"),
  ),
  PhysicalInterfaceName: S.optional(S.String).pipe(
    T.JsonName("physicalInterfaceName"),
  ),
}) {}
export const __listOfNodeInterfaceMapping = S.Array(NodeInterfaceMapping);
export const __listOf__stringMin7Max11PatternAws097 = S.Array(S.String);
export class InputDestinationVpc extends S.Class<InputDestinationVpc>(
  "InputDestinationVpc",
)({
  AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
  NetworkInterfaceId: S.optional(S.String).pipe(
    T.JsonName("networkInterfaceId"),
  ),
}) {}
export class InputDestinationRoute extends S.Class<InputDestinationRoute>(
  "InputDestinationRoute",
)({
  Cidr: S.optional(S.String).pipe(T.JsonName("cidr")),
  Gateway: S.optional(S.String).pipe(T.JsonName("gateway")),
}) {}
export const __listOfInputDestinationRoute = S.Array(InputDestinationRoute);
export class InputDestination extends S.Class<InputDestination>(
  "InputDestination",
)({
  Ip: S.optional(S.String).pipe(T.JsonName("ip")),
  Port: S.optional(S.String).pipe(T.JsonName("port")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
  Vpc: S.optional(InputDestinationVpc).pipe(T.JsonName("vpc")),
  Network: S.optional(S.String).pipe(T.JsonName("network")),
  NetworkRoutes: S.optional(__listOfInputDestinationRoute).pipe(
    T.JsonName("networkRoutes"),
  ),
}) {}
export const __listOfInputDestination = S.Array(InputDestination);
export class MediaConnectFlow extends S.Class<MediaConnectFlow>(
  "MediaConnectFlow",
)({ FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")) }) {}
export const __listOfMediaConnectFlow = S.Array(MediaConnectFlow);
export class InputSource extends S.Class<InputSource>("InputSource")({
  PasswordParam: S.optional(S.String).pipe(T.JsonName("passwordParam")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
  Username: S.optional(S.String).pipe(T.JsonName("username")),
}) {}
export const __listOfInputSource = S.Array(InputSource);
export class SrtCallerDecryption extends S.Class<SrtCallerDecryption>(
  "SrtCallerDecryption",
)({
  Algorithm: S.optional(S.String).pipe(T.JsonName("algorithm")),
  PassphraseSecretArn: S.optional(S.String).pipe(
    T.JsonName("passphraseSecretArn"),
  ),
}) {}
export class SrtCallerSource extends S.Class<SrtCallerSource>(
  "SrtCallerSource",
)({
  Decryption: S.optional(SrtCallerDecryption).pipe(T.JsonName("decryption")),
  MinimumLatency: S.optional(S.Number).pipe(T.JsonName("minimumLatency")),
  SrtListenerAddress: S.optional(S.String).pipe(
    T.JsonName("srtListenerAddress"),
  ),
  SrtListenerPort: S.optional(S.String).pipe(T.JsonName("srtListenerPort")),
  StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
}) {}
export const __listOfSrtCallerSource = S.Array(SrtCallerSource);
export class SrtSettings extends S.Class<SrtSettings>("SrtSettings")({
  SrtCallerSources: S.optional(__listOfSrtCallerSource).pipe(
    T.JsonName("srtCallerSources"),
  ),
}) {}
export class MulticastSource extends S.Class<MulticastSource>(
  "MulticastSource",
)({
  SourceIp: S.optional(S.String).pipe(T.JsonName("sourceIp")),
  Url: S.String.pipe(T.JsonName("url")),
}) {}
export const __listOfMulticastSource = S.Array(MulticastSource);
export class MulticastSettings extends S.Class<MulticastSettings>(
  "MulticastSettings",
)({
  Sources: S.optional(__listOfMulticastSource).pipe(T.JsonName("sources")),
}) {}
export class InputSdpLocation extends S.Class<InputSdpLocation>(
  "InputSdpLocation",
)({
  MediaIndex: S.optional(S.Number).pipe(T.JsonName("mediaIndex")),
  SdpUrl: S.optional(S.String).pipe(T.JsonName("sdpUrl")),
}) {}
export const __listOfInputSdpLocation = S.Array(InputSdpLocation);
export class Smpte2110ReceiverGroupSdpSettings extends S.Class<Smpte2110ReceiverGroupSdpSettings>(
  "Smpte2110ReceiverGroupSdpSettings",
)({
  AncillarySdps: S.optional(__listOfInputSdpLocation).pipe(
    T.JsonName("ancillarySdps"),
  ),
  AudioSdps: S.optional(__listOfInputSdpLocation).pipe(T.JsonName("audioSdps")),
  VideoSdp: S.optional(InputSdpLocation).pipe(T.JsonName("videoSdp")),
}) {}
export class Smpte2110ReceiverGroup extends S.Class<Smpte2110ReceiverGroup>(
  "Smpte2110ReceiverGroup",
)({
  SdpSettings: S.optional(Smpte2110ReceiverGroupSdpSettings).pipe(
    T.JsonName("sdpSettings"),
  ),
}) {}
export const __listOfSmpte2110ReceiverGroup = S.Array(Smpte2110ReceiverGroup);
export class Smpte2110ReceiverGroupSettings extends S.Class<Smpte2110ReceiverGroupSettings>(
  "Smpte2110ReceiverGroupSettings",
)({
  Smpte2110ReceiverGroups: S.optional(__listOfSmpte2110ReceiverGroup).pipe(
    T.JsonName("smpte2110ReceiverGroups"),
  ),
}) {}
export class RouterDestination extends S.Class<RouterDestination>(
  "RouterDestination",
)({
  AvailabilityZoneName: S.optional(S.String).pipe(
    T.JsonName("availabilityZoneName"),
  ),
  RouterOutputArn: S.optional(S.String).pipe(T.JsonName("routerOutputArn")),
}) {}
export const __listOfRouterDestination = S.Array(RouterDestination);
export class RouterInputSettings extends S.Class<RouterInputSettings>(
  "RouterInputSettings",
)({
  Destinations: S.optional(__listOfRouterDestination).pipe(
    T.JsonName("destinations"),
  ),
  EncryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
  SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
}) {}
export class Input extends S.Class<Input>("Input")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AttachedChannels: S.optional(__listOf__string).pipe(
    T.JsonName("attachedChannels"),
  ),
  Destinations: S.optional(__listOfInputDestination).pipe(
    T.JsonName("destinations"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InputClass: S.optional(S.String).pipe(T.JsonName("inputClass")),
  InputDevices: S.optional(__listOfInputDeviceSettings).pipe(
    T.JsonName("inputDevices"),
  ),
  InputPartnerIds: S.optional(__listOf__string).pipe(
    T.JsonName("inputPartnerIds"),
  ),
  InputSourceType: S.optional(S.String).pipe(T.JsonName("inputSourceType")),
  MediaConnectFlows: S.optional(__listOfMediaConnectFlow).pipe(
    T.JsonName("mediaConnectFlows"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  SecurityGroups: S.optional(__listOf__string).pipe(
    T.JsonName("securityGroups"),
  ),
  Sources: S.optional(__listOfInputSource).pipe(T.JsonName("sources")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
  SrtSettings: S.optional(SrtSettings).pipe(T.JsonName("srtSettings")),
  InputNetworkLocation: S.optional(S.String).pipe(
    T.JsonName("inputNetworkLocation"),
  ),
  MulticastSettings: S.optional(MulticastSettings).pipe(
    T.JsonName("multicastSettings"),
  ),
  Smpte2110ReceiverGroupSettings: S.optional(
    Smpte2110ReceiverGroupSettings,
  ).pipe(T.JsonName("smpte2110ReceiverGroupSettings")),
  SdiSources: S.optional(InputSdiSources).pipe(T.JsonName("sdiSources")),
  RouterSettings: S.optional(RouterInputSettings).pipe(
    T.JsonName("routerSettings"),
  ),
}) {}
export const __listOfInput = S.Array(Input);
export class ChannelEngineVersionResponse extends S.Class<ChannelEngineVersionResponse>(
  "ChannelEngineVersionResponse",
)({
  ExpirationDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("expirationDate"),
  ),
  Version: S.optional(S.String).pipe(T.JsonName("version")),
}) {}
export const __listOfChannelEngineVersionResponse = S.Array(
  ChannelEngineVersionResponse,
);
export class MaintenanceUpdateSettings extends S.Class<MaintenanceUpdateSettings>(
  "MaintenanceUpdateSettings",
)({
  MaintenanceDay: S.optional(S.String).pipe(T.JsonName("maintenanceDay")),
  MaintenanceScheduledDate: S.optional(S.String).pipe(
    T.JsonName("maintenanceScheduledDate"),
  ),
  MaintenanceStartTime: S.optional(S.String).pipe(
    T.JsonName("maintenanceStartTime"),
  ),
}) {}
export class InputDeviceRequest extends S.Class<InputDeviceRequest>(
  "InputDeviceRequest",
)({ Id: S.optional(S.String).pipe(T.JsonName("id")) }) {}
export const __listOfInputDeviceRequest = S.Array(InputDeviceRequest);
export class SpecialRouterSettings extends S.Class<SpecialRouterSettings>(
  "SpecialRouterSettings",
)({ RouterArn: S.optional(S.String).pipe(T.JsonName("routerArn")) }) {}
export class IpPoolUpdateRequest extends S.Class<IpPoolUpdateRequest>(
  "IpPoolUpdateRequest",
)({ Cidr: S.optional(S.String).pipe(T.JsonName("cidr")) }) {}
export const __listOfIpPoolUpdateRequest = S.Array(IpPoolUpdateRequest);
export class RouteUpdateRequest extends S.Class<RouteUpdateRequest>(
  "RouteUpdateRequest",
)({
  Cidr: S.optional(S.String).pipe(T.JsonName("cidr")),
  Gateway: S.optional(S.String).pipe(T.JsonName("gateway")),
}) {}
export const __listOfRouteUpdateRequest = S.Array(RouteUpdateRequest);
export class SdiSourceMappingUpdateRequest extends S.Class<SdiSourceMappingUpdateRequest>(
  "SdiSourceMappingUpdateRequest",
)({
  CardNumber: S.optional(S.Number).pipe(T.JsonName("cardNumber")),
  ChannelNumber: S.optional(S.Number).pipe(T.JsonName("channelNumber")),
  SdiSource: S.optional(S.String).pipe(T.JsonName("sdiSource")),
}) {}
export const SdiSourceMappingsUpdateRequest = S.Array(
  SdiSourceMappingUpdateRequest,
);
export const __listOfDashRoleAudio = S.Array(S.String);
export const __listOfDashRoleCaption = S.Array(S.String);
export const __listOf__integer = S.Array(S.Number);
export class BatchFailedResultModel extends S.Class<BatchFailedResultModel>(
  "BatchFailedResultModel",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Code: S.optional(S.String).pipe(T.JsonName("code")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Message: S.optional(S.String).pipe(T.JsonName("message")),
}) {}
export const __listOfBatchFailedResultModel = S.Array(BatchFailedResultModel);
export class BatchSuccessfulResultModel extends S.Class<BatchSuccessfulResultModel>(
  "BatchSuccessfulResultModel",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export const __listOfBatchSuccessfulResultModel = S.Array(
  BatchSuccessfulResultModel,
);
export class BatchStartResponse extends S.Class<BatchStartResponse>(
  "BatchStartResponse",
)({
  Failed: S.optional(__listOfBatchFailedResultModel).pipe(T.JsonName("failed")),
  Successful: S.optional(__listOfBatchSuccessfulResultModel).pipe(
    T.JsonName("successful"),
  ),
}) {}
export class BatchStopResponse extends S.Class<BatchStopResponse>(
  "BatchStopResponse",
)({
  Failed: S.optional(__listOfBatchFailedResultModel).pipe(T.JsonName("failed")),
  Successful: S.optional(__listOfBatchSuccessfulResultModel).pipe(
    T.JsonName("successful"),
  ),
}) {}
export class CreateChannelPlacementGroupResponse extends S.Class<CreateChannelPlacementGroupResponse>(
  "CreateChannelPlacementGroupResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Channels: S.optional(__listOf__string).pipe(T.JsonName("channels")),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class CreateCloudWatchAlarmTemplateRequest extends S.Class<CreateCloudWatchAlarmTemplateRequest>(
  "CreateCloudWatchAlarmTemplateRequest",
)(
  {
    ComparisonOperator: S.String.pipe(T.JsonName("comparisonOperator")),
    DatapointsToAlarm: S.optional(S.Number).pipe(
      T.JsonName("datapointsToAlarm"),
    ),
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EvaluationPeriods: S.Number.pipe(T.JsonName("evaluationPeriods")),
    GroupIdentifier: S.String.pipe(T.JsonName("groupIdentifier")),
    MetricName: S.String.pipe(T.JsonName("metricName")),
    Name: S.String.pipe(T.JsonName("name")),
    Period: S.Number.pipe(T.JsonName("period")),
    Statistic: S.String.pipe(T.JsonName("statistic")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    TargetResourceType: S.String.pipe(T.JsonName("targetResourceType")),
    Threshold: S.Number.pipe(T.JsonName("threshold")),
    TreatMissingData: S.String.pipe(T.JsonName("treatMissingData")),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/cloudwatch-alarm-templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateCloudWatchAlarmTemplateGroupResponse extends S.Class<CreateCloudWatchAlarmTemplateGroupResponse>(
  "CreateCloudWatchAlarmTemplateGroupResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class CreateEventBridgeRuleTemplateRequest extends S.Class<CreateEventBridgeRuleTemplateRequest>(
  "CreateEventBridgeRuleTemplateRequest",
)(
  {
    Description: S.optional(S.String).pipe(T.JsonName("description")),
    EventTargets: S.optional(__listOfEventBridgeRuleTemplateTarget).pipe(
      T.JsonName("eventTargets"),
    ),
    EventType: S.String.pipe(T.JsonName("eventType")),
    GroupIdentifier: S.String.pipe(T.JsonName("groupIdentifier")),
    Name: S.String.pipe(T.JsonName("name")),
    Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/eventbridge-rule-templates" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEventBridgeRuleTemplateGroupResponse extends S.Class<CreateEventBridgeRuleTemplateGroupResponse>(
  "CreateEventBridgeRuleTemplateGroupResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class CreateInputSecurityGroupRequest extends S.Class<CreateInputSecurityGroupRequest>(
  "CreateInputSecurityGroupRequest",
)(
  {
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    WhitelistRules: S.optional(__listOfInputWhitelistRuleCidr).pipe(
      T.JsonName("whitelistRules"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/inputSecurityGroups" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMultiplexRequest extends S.Class<CreateMultiplexRequest>(
  "CreateMultiplexRequest",
)(
  {
    AvailabilityZones: __listOf__string.pipe(T.JsonName("availabilityZones")),
    MultiplexSettings: MultiplexSettings.pipe(T.JsonName("multiplexSettings")),
    Name: S.String.pipe(T.JsonName("name")),
    RequestId: S.String.pipe(T.JsonName("requestId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/multiplexes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNetworkRequest extends S.Class<CreateNetworkRequest>(
  "CreateNetworkRequest",
)(
  {
    IpPools: S.optional(__listOfIpPoolCreateRequest).pipe(
      T.JsonName("ipPools"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
    Routes: S.optional(__listOfRouteCreateRequest).pipe(T.JsonName("routes")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/networks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNodeRequest extends S.Class<CreateNodeRequest>(
  "CreateNodeRequest",
)(
  {
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NodeInterfaceMappings: S.optional(
      __listOfNodeInterfaceMappingCreateRequest,
    ).pipe(T.JsonName("nodeInterfaceMappings")),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
    Role: S.optional(S.String).pipe(T.JsonName("role")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/clusters/{ClusterId}/nodes" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateNodeRegistrationScriptRequest extends S.Class<CreateNodeRegistrationScriptRequest>(
  "CreateNodeRegistrationScriptRequest",
)(
  {
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    Id: S.optional(S.String).pipe(T.JsonName("id")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
      T.JsonName("nodeInterfaceMappings"),
    ),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
    Role: S.optional(S.String).pipe(T.JsonName("role")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/prod/clusters/{ClusterId}/nodeRegistrationScript",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChannelPlacementGroupResponse extends S.Class<DeleteChannelPlacementGroupResponse>(
  "DeleteChannelPlacementGroupResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Channels: S.optional(__listOf__string).pipe(T.JsonName("channels")),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class SdiSource extends S.Class<SdiSource>("SdiSource")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Inputs: S.optional(__listOf__string).pipe(T.JsonName("inputs")),
  Mode: S.optional(S.String).pipe(T.JsonName("mode")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export class DeleteSdiSourceResponse extends S.Class<DeleteSdiSourceResponse>(
  "DeleteSdiSourceResponse",
)({ SdiSource: S.optional(SdiSource).pipe(T.JsonName("sdiSource")) }) {}
export class DescribeAccountConfigurationResponse extends S.Class<DescribeAccountConfigurationResponse>(
  "DescribeAccountConfigurationResponse",
)({
  AccountConfiguration: S.optional(AccountConfiguration).pipe(
    T.JsonName("accountConfiguration"),
  ),
}) {}
export class ChannelEgressEndpoint extends S.Class<ChannelEgressEndpoint>(
  "ChannelEgressEndpoint",
)({ SourceIp: S.optional(S.String).pipe(T.JsonName("sourceIp")) }) {}
export const __listOfChannelEgressEndpoint = S.Array(ChannelEgressEndpoint);
export class AudioNormalizationSettings extends S.Class<AudioNormalizationSettings>(
  "AudioNormalizationSettings",
)({
  Algorithm: S.optional(S.String).pipe(T.JsonName("algorithm")),
  AlgorithmControl: S.optional(S.String).pipe(T.JsonName("algorithmControl")),
  TargetLkfs: S.optional(S.Number).pipe(T.JsonName("targetLkfs")),
}) {}
export class NielsenCBET extends S.Class<NielsenCBET>("NielsenCBET")({
  CbetCheckDigitString: S.String.pipe(T.JsonName("cbetCheckDigitString")),
  CbetStepaside: S.String.pipe(T.JsonName("cbetStepaside")),
  Csid: S.String.pipe(T.JsonName("csid")),
}) {}
export class NielsenNaesIiNw extends S.Class<NielsenNaesIiNw>(
  "NielsenNaesIiNw",
)({
  CheckDigitString: S.String.pipe(T.JsonName("checkDigitString")),
  Sid: S.Number.pipe(T.JsonName("sid")),
  Timezone: S.optional(S.String).pipe(T.JsonName("timezone")),
}) {}
export class NielsenWatermarksSettings extends S.Class<NielsenWatermarksSettings>(
  "NielsenWatermarksSettings",
)({
  NielsenCbetSettings: S.optional(NielsenCBET).pipe(
    T.JsonName("nielsenCbetSettings"),
  ),
  NielsenDistributionType: S.optional(S.String).pipe(
    T.JsonName("nielsenDistributionType"),
  ),
  NielsenNaesIiNwSettings: S.optional(NielsenNaesIiNw).pipe(
    T.JsonName("nielsenNaesIiNwSettings"),
  ),
}) {}
export class AudioWatermarkSettings extends S.Class<AudioWatermarkSettings>(
  "AudioWatermarkSettings",
)({
  NielsenWatermarksSettings: S.optional(NielsenWatermarksSettings).pipe(
    T.JsonName("nielsenWatermarksSettings"),
  ),
}) {}
export class AacSettings extends S.Class<AacSettings>("AacSettings")({
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  CodingMode: S.optional(S.String).pipe(T.JsonName("codingMode")),
  InputType: S.optional(S.String).pipe(T.JsonName("inputType")),
  Profile: S.optional(S.String).pipe(T.JsonName("profile")),
  RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
  RawFormat: S.optional(S.String).pipe(T.JsonName("rawFormat")),
  SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
  Spec: S.optional(S.String).pipe(T.JsonName("spec")),
  VbrQuality: S.optional(S.String).pipe(T.JsonName("vbrQuality")),
}) {}
export class Ac3Settings extends S.Class<Ac3Settings>("Ac3Settings")({
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  BitstreamMode: S.optional(S.String).pipe(T.JsonName("bitstreamMode")),
  CodingMode: S.optional(S.String).pipe(T.JsonName("codingMode")),
  Dialnorm: S.optional(S.Number).pipe(T.JsonName("dialnorm")),
  DrcProfile: S.optional(S.String).pipe(T.JsonName("drcProfile")),
  LfeFilter: S.optional(S.String).pipe(T.JsonName("lfeFilter")),
  MetadataControl: S.optional(S.String).pipe(T.JsonName("metadataControl")),
  AttenuationControl: S.optional(S.String).pipe(
    T.JsonName("attenuationControl"),
  ),
}) {}
export class Eac3AtmosSettings extends S.Class<Eac3AtmosSettings>(
  "Eac3AtmosSettings",
)({
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  CodingMode: S.optional(S.String).pipe(T.JsonName("codingMode")),
  Dialnorm: S.optional(S.Number).pipe(T.JsonName("dialnorm")),
  DrcLine: S.optional(S.String).pipe(T.JsonName("drcLine")),
  DrcRf: S.optional(S.String).pipe(T.JsonName("drcRf")),
  HeightTrim: S.optional(S.Number).pipe(T.JsonName("heightTrim")),
  SurroundTrim: S.optional(S.Number).pipe(T.JsonName("surroundTrim")),
}) {}
export class Eac3Settings extends S.Class<Eac3Settings>("Eac3Settings")({
  AttenuationControl: S.optional(S.String).pipe(
    T.JsonName("attenuationControl"),
  ),
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  BitstreamMode: S.optional(S.String).pipe(T.JsonName("bitstreamMode")),
  CodingMode: S.optional(S.String).pipe(T.JsonName("codingMode")),
  DcFilter: S.optional(S.String).pipe(T.JsonName("dcFilter")),
  Dialnorm: S.optional(S.Number).pipe(T.JsonName("dialnorm")),
  DrcLine: S.optional(S.String).pipe(T.JsonName("drcLine")),
  DrcRf: S.optional(S.String).pipe(T.JsonName("drcRf")),
  LfeControl: S.optional(S.String).pipe(T.JsonName("lfeControl")),
  LfeFilter: S.optional(S.String).pipe(T.JsonName("lfeFilter")),
  LoRoCenterMixLevel: S.optional(S.Number).pipe(
    T.JsonName("loRoCenterMixLevel"),
  ),
  LoRoSurroundMixLevel: S.optional(S.Number).pipe(
    T.JsonName("loRoSurroundMixLevel"),
  ),
  LtRtCenterMixLevel: S.optional(S.Number).pipe(
    T.JsonName("ltRtCenterMixLevel"),
  ),
  LtRtSurroundMixLevel: S.optional(S.Number).pipe(
    T.JsonName("ltRtSurroundMixLevel"),
  ),
  MetadataControl: S.optional(S.String).pipe(T.JsonName("metadataControl")),
  PassthroughControl: S.optional(S.String).pipe(
    T.JsonName("passthroughControl"),
  ),
  PhaseControl: S.optional(S.String).pipe(T.JsonName("phaseControl")),
  StereoDownmix: S.optional(S.String).pipe(T.JsonName("stereoDownmix")),
  SurroundExMode: S.optional(S.String).pipe(T.JsonName("surroundExMode")),
  SurroundMode: S.optional(S.String).pipe(T.JsonName("surroundMode")),
}) {}
export class Mp2Settings extends S.Class<Mp2Settings>("Mp2Settings")({
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  CodingMode: S.optional(S.String).pipe(T.JsonName("codingMode")),
  SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
}) {}
export class PassThroughSettings extends S.Class<PassThroughSettings>(
  "PassThroughSettings",
)({}) {}
export class WavSettings extends S.Class<WavSettings>("WavSettings")({
  BitDepth: S.optional(S.Number).pipe(T.JsonName("bitDepth")),
  CodingMode: S.optional(S.String).pipe(T.JsonName("codingMode")),
  SampleRate: S.optional(S.Number).pipe(T.JsonName("sampleRate")),
}) {}
export class AudioCodecSettings extends S.Class<AudioCodecSettings>(
  "AudioCodecSettings",
)({
  AacSettings: S.optional(AacSettings).pipe(T.JsonName("aacSettings")),
  Ac3Settings: S.optional(Ac3Settings).pipe(T.JsonName("ac3Settings")),
  Eac3AtmosSettings: S.optional(Eac3AtmosSettings).pipe(
    T.JsonName("eac3AtmosSettings"),
  ),
  Eac3Settings: S.optional(Eac3Settings).pipe(T.JsonName("eac3Settings")),
  Mp2Settings: S.optional(Mp2Settings).pipe(T.JsonName("mp2Settings")),
  PassThroughSettings: S.optional(PassThroughSettings).pipe(
    T.JsonName("passThroughSettings"),
  ),
  WavSettings: S.optional(WavSettings).pipe(T.JsonName("wavSettings")),
}) {}
export class InputChannelLevel extends S.Class<InputChannelLevel>(
  "InputChannelLevel",
)({
  Gain: S.Number.pipe(T.JsonName("gain")),
  InputChannel: S.Number.pipe(T.JsonName("inputChannel")),
}) {}
export const __listOfInputChannelLevel = S.Array(InputChannelLevel);
export class AudioChannelMapping extends S.Class<AudioChannelMapping>(
  "AudioChannelMapping",
)({
  InputChannelLevels: __listOfInputChannelLevel.pipe(
    T.JsonName("inputChannelLevels"),
  ),
  OutputChannel: S.Number.pipe(T.JsonName("outputChannel")),
}) {}
export const __listOfAudioChannelMapping = S.Array(AudioChannelMapping);
export class RemixSettings extends S.Class<RemixSettings>("RemixSettings")({
  ChannelMappings: __listOfAudioChannelMapping.pipe(
    T.JsonName("channelMappings"),
  ),
  ChannelsIn: S.optional(S.Number).pipe(T.JsonName("channelsIn")),
  ChannelsOut: S.optional(S.Number).pipe(T.JsonName("channelsOut")),
}) {}
export class AudioDescription extends S.Class<AudioDescription>(
  "AudioDescription",
)({
  AudioNormalizationSettings: S.optional(AudioNormalizationSettings).pipe(
    T.JsonName("audioNormalizationSettings"),
  ),
  AudioSelectorName: S.String.pipe(T.JsonName("audioSelectorName")),
  AudioType: S.optional(S.String).pipe(T.JsonName("audioType")),
  AudioTypeControl: S.optional(S.String).pipe(T.JsonName("audioTypeControl")),
  AudioWatermarkingSettings: S.optional(AudioWatermarkSettings).pipe(
    T.JsonName("audioWatermarkingSettings"),
  ),
  CodecSettings: S.optional(AudioCodecSettings).pipe(
    T.JsonName("codecSettings"),
  ),
  LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  LanguageCodeControl: S.optional(S.String).pipe(
    T.JsonName("languageCodeControl"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  RemixSettings: S.optional(RemixSettings).pipe(T.JsonName("remixSettings")),
  StreamName: S.optional(S.String).pipe(T.JsonName("streamName")),
  AudioDashRoles: S.optional(__listOfDashRoleAudio).pipe(
    T.JsonName("audioDashRoles"),
  ),
  DvbDashAccessibility: S.optional(S.String).pipe(
    T.JsonName("dvbDashAccessibility"),
  ),
}) {}
export const __listOfAudioDescription = S.Array(AudioDescription);
export class InputLocation extends S.Class<InputLocation>("InputLocation")({
  PasswordParam: S.optional(S.String).pipe(T.JsonName("passwordParam")),
  Uri: S.String.pipe(T.JsonName("uri")),
  Username: S.optional(S.String).pipe(T.JsonName("username")),
}) {}
export class AvailBlanking extends S.Class<AvailBlanking>("AvailBlanking")({
  AvailBlankingImage: S.optional(InputLocation).pipe(
    T.JsonName("availBlankingImage"),
  ),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class Esam extends S.Class<Esam>("Esam")({
  AcquisitionPointId: S.String.pipe(T.JsonName("acquisitionPointId")),
  AdAvailOffset: S.optional(S.Number).pipe(T.JsonName("adAvailOffset")),
  PasswordParam: S.optional(S.String).pipe(T.JsonName("passwordParam")),
  PoisEndpoint: S.String.pipe(T.JsonName("poisEndpoint")),
  Username: S.optional(S.String).pipe(T.JsonName("username")),
  ZoneIdentity: S.optional(S.String).pipe(T.JsonName("zoneIdentity")),
}) {}
export class Scte35SpliceInsert extends S.Class<Scte35SpliceInsert>(
  "Scte35SpliceInsert",
)({
  AdAvailOffset: S.optional(S.Number).pipe(T.JsonName("adAvailOffset")),
  NoRegionalBlackoutFlag: S.optional(S.String).pipe(
    T.JsonName("noRegionalBlackoutFlag"),
  ),
  WebDeliveryAllowedFlag: S.optional(S.String).pipe(
    T.JsonName("webDeliveryAllowedFlag"),
  ),
}) {}
export class Scte35TimeSignalApos extends S.Class<Scte35TimeSignalApos>(
  "Scte35TimeSignalApos",
)({
  AdAvailOffset: S.optional(S.Number).pipe(T.JsonName("adAvailOffset")),
  NoRegionalBlackoutFlag: S.optional(S.String).pipe(
    T.JsonName("noRegionalBlackoutFlag"),
  ),
  WebDeliveryAllowedFlag: S.optional(S.String).pipe(
    T.JsonName("webDeliveryAllowedFlag"),
  ),
}) {}
export class AvailSettings extends S.Class<AvailSettings>("AvailSettings")({
  Esam: S.optional(Esam).pipe(T.JsonName("esam")),
  Scte35SpliceInsert: S.optional(Scte35SpliceInsert).pipe(
    T.JsonName("scte35SpliceInsert"),
  ),
  Scte35TimeSignalApos: S.optional(Scte35TimeSignalApos).pipe(
    T.JsonName("scte35TimeSignalApos"),
  ),
}) {}
export class AvailConfiguration extends S.Class<AvailConfiguration>(
  "AvailConfiguration",
)({
  AvailSettings: S.optional(AvailSettings).pipe(T.JsonName("availSettings")),
  Scte35SegmentationScope: S.optional(S.String).pipe(
    T.JsonName("scte35SegmentationScope"),
  ),
}) {}
export class BlackoutSlate extends S.Class<BlackoutSlate>("BlackoutSlate")({
  BlackoutSlateImage: S.optional(InputLocation).pipe(
    T.JsonName("blackoutSlateImage"),
  ),
  NetworkEndBlackout: S.optional(S.String).pipe(
    T.JsonName("networkEndBlackout"),
  ),
  NetworkEndBlackoutImage: S.optional(InputLocation).pipe(
    T.JsonName("networkEndBlackoutImage"),
  ),
  NetworkId: S.optional(S.String).pipe(T.JsonName("networkId")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class AribDestinationSettings extends S.Class<AribDestinationSettings>(
  "AribDestinationSettings",
)({}) {}
export class BurnInDestinationSettings extends S.Class<BurnInDestinationSettings>(
  "BurnInDestinationSettings",
)({
  Alignment: S.optional(S.String).pipe(T.JsonName("alignment")),
  BackgroundColor: S.optional(S.String).pipe(T.JsonName("backgroundColor")),
  BackgroundOpacity: S.optional(S.Number).pipe(T.JsonName("backgroundOpacity")),
  Font: S.optional(InputLocation).pipe(T.JsonName("font")),
  FontColor: S.optional(S.String).pipe(T.JsonName("fontColor")),
  FontOpacity: S.optional(S.Number).pipe(T.JsonName("fontOpacity")),
  FontResolution: S.optional(S.Number).pipe(T.JsonName("fontResolution")),
  FontSize: S.optional(S.String).pipe(T.JsonName("fontSize")),
  OutlineColor: S.optional(S.String).pipe(T.JsonName("outlineColor")),
  OutlineSize: S.optional(S.Number).pipe(T.JsonName("outlineSize")),
  ShadowColor: S.optional(S.String).pipe(T.JsonName("shadowColor")),
  ShadowOpacity: S.optional(S.Number).pipe(T.JsonName("shadowOpacity")),
  ShadowXOffset: S.optional(S.Number).pipe(T.JsonName("shadowXOffset")),
  ShadowYOffset: S.optional(S.Number).pipe(T.JsonName("shadowYOffset")),
  TeletextGridControl: S.optional(S.String).pipe(
    T.JsonName("teletextGridControl"),
  ),
  XPosition: S.optional(S.Number).pipe(T.JsonName("xPosition")),
  YPosition: S.optional(S.Number).pipe(T.JsonName("yPosition")),
  SubtitleRows: S.optional(S.String).pipe(T.JsonName("subtitleRows")),
}) {}
export class DvbSubDestinationSettings extends S.Class<DvbSubDestinationSettings>(
  "DvbSubDestinationSettings",
)({
  Alignment: S.optional(S.String).pipe(T.JsonName("alignment")),
  BackgroundColor: S.optional(S.String).pipe(T.JsonName("backgroundColor")),
  BackgroundOpacity: S.optional(S.Number).pipe(T.JsonName("backgroundOpacity")),
  Font: S.optional(InputLocation).pipe(T.JsonName("font")),
  FontColor: S.optional(S.String).pipe(T.JsonName("fontColor")),
  FontOpacity: S.optional(S.Number).pipe(T.JsonName("fontOpacity")),
  FontResolution: S.optional(S.Number).pipe(T.JsonName("fontResolution")),
  FontSize: S.optional(S.String).pipe(T.JsonName("fontSize")),
  OutlineColor: S.optional(S.String).pipe(T.JsonName("outlineColor")),
  OutlineSize: S.optional(S.Number).pipe(T.JsonName("outlineSize")),
  ShadowColor: S.optional(S.String).pipe(T.JsonName("shadowColor")),
  ShadowOpacity: S.optional(S.Number).pipe(T.JsonName("shadowOpacity")),
  ShadowXOffset: S.optional(S.Number).pipe(T.JsonName("shadowXOffset")),
  ShadowYOffset: S.optional(S.Number).pipe(T.JsonName("shadowYOffset")),
  TeletextGridControl: S.optional(S.String).pipe(
    T.JsonName("teletextGridControl"),
  ),
  XPosition: S.optional(S.Number).pipe(T.JsonName("xPosition")),
  YPosition: S.optional(S.Number).pipe(T.JsonName("yPosition")),
  SubtitleRows: S.optional(S.String).pipe(T.JsonName("subtitleRows")),
}) {}
export class EbuTtDDestinationSettings extends S.Class<EbuTtDDestinationSettings>(
  "EbuTtDDestinationSettings",
)({
  CopyrightHolder: S.optional(S.String).pipe(T.JsonName("copyrightHolder")),
  FillLineGap: S.optional(S.String).pipe(T.JsonName("fillLineGap")),
  FontFamily: S.optional(S.String).pipe(T.JsonName("fontFamily")),
  StyleControl: S.optional(S.String).pipe(T.JsonName("styleControl")),
  DefaultFontSize: S.optional(S.Number).pipe(T.JsonName("defaultFontSize")),
  DefaultLineHeight: S.optional(S.Number).pipe(T.JsonName("defaultLineHeight")),
}) {}
export class EmbeddedDestinationSettings extends S.Class<EmbeddedDestinationSettings>(
  "EmbeddedDestinationSettings",
)({}) {}
export class EmbeddedPlusScte20DestinationSettings extends S.Class<EmbeddedPlusScte20DestinationSettings>(
  "EmbeddedPlusScte20DestinationSettings",
)({}) {}
export class RtmpCaptionInfoDestinationSettings extends S.Class<RtmpCaptionInfoDestinationSettings>(
  "RtmpCaptionInfoDestinationSettings",
)({}) {}
export class Scte20PlusEmbeddedDestinationSettings extends S.Class<Scte20PlusEmbeddedDestinationSettings>(
  "Scte20PlusEmbeddedDestinationSettings",
)({}) {}
export class Scte27DestinationSettings extends S.Class<Scte27DestinationSettings>(
  "Scte27DestinationSettings",
)({}) {}
export class SmpteTtDestinationSettings extends S.Class<SmpteTtDestinationSettings>(
  "SmpteTtDestinationSettings",
)({}) {}
export class TeletextDestinationSettings extends S.Class<TeletextDestinationSettings>(
  "TeletextDestinationSettings",
)({}) {}
export class TtmlDestinationSettings extends S.Class<TtmlDestinationSettings>(
  "TtmlDestinationSettings",
)({ StyleControl: S.optional(S.String).pipe(T.JsonName("styleControl")) }) {}
export class WebvttDestinationSettings extends S.Class<WebvttDestinationSettings>(
  "WebvttDestinationSettings",
)({ StyleControl: S.optional(S.String).pipe(T.JsonName("styleControl")) }) {}
export class CaptionDestinationSettings extends S.Class<CaptionDestinationSettings>(
  "CaptionDestinationSettings",
)({
  AribDestinationSettings: S.optional(AribDestinationSettings).pipe(
    T.JsonName("aribDestinationSettings"),
  ),
  BurnInDestinationSettings: S.optional(BurnInDestinationSettings).pipe(
    T.JsonName("burnInDestinationSettings"),
  ),
  DvbSubDestinationSettings: S.optional(DvbSubDestinationSettings).pipe(
    T.JsonName("dvbSubDestinationSettings"),
  ),
  EbuTtDDestinationSettings: S.optional(EbuTtDDestinationSettings).pipe(
    T.JsonName("ebuTtDDestinationSettings"),
  ),
  EmbeddedDestinationSettings: S.optional(EmbeddedDestinationSettings).pipe(
    T.JsonName("embeddedDestinationSettings"),
  ),
  EmbeddedPlusScte20DestinationSettings: S.optional(
    EmbeddedPlusScte20DestinationSettings,
  ).pipe(T.JsonName("embeddedPlusScte20DestinationSettings")),
  RtmpCaptionInfoDestinationSettings: S.optional(
    RtmpCaptionInfoDestinationSettings,
  ).pipe(T.JsonName("rtmpCaptionInfoDestinationSettings")),
  Scte20PlusEmbeddedDestinationSettings: S.optional(
    Scte20PlusEmbeddedDestinationSettings,
  ).pipe(T.JsonName("scte20PlusEmbeddedDestinationSettings")),
  Scte27DestinationSettings: S.optional(Scte27DestinationSettings).pipe(
    T.JsonName("scte27DestinationSettings"),
  ),
  SmpteTtDestinationSettings: S.optional(SmpteTtDestinationSettings).pipe(
    T.JsonName("smpteTtDestinationSettings"),
  ),
  TeletextDestinationSettings: S.optional(TeletextDestinationSettings).pipe(
    T.JsonName("teletextDestinationSettings"),
  ),
  TtmlDestinationSettings: S.optional(TtmlDestinationSettings).pipe(
    T.JsonName("ttmlDestinationSettings"),
  ),
  WebvttDestinationSettings: S.optional(WebvttDestinationSettings).pipe(
    T.JsonName("webvttDestinationSettings"),
  ),
}) {}
export class CaptionDescription extends S.Class<CaptionDescription>(
  "CaptionDescription",
)({
  Accessibility: S.optional(S.String).pipe(T.JsonName("accessibility")),
  CaptionSelectorName: S.String.pipe(T.JsonName("captionSelectorName")),
  DestinationSettings: S.optional(CaptionDestinationSettings).pipe(
    T.JsonName("destinationSettings"),
  ),
  LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  LanguageDescription: S.optional(S.String).pipe(
    T.JsonName("languageDescription"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  CaptionDashRoles: S.optional(__listOfDashRoleCaption).pipe(
    T.JsonName("captionDashRoles"),
  ),
  DvbDashAccessibility: S.optional(S.String).pipe(
    T.JsonName("dvbDashAccessibility"),
  ),
}) {}
export const __listOfCaptionDescription = S.Array(CaptionDescription);
export class FeatureActivations extends S.Class<FeatureActivations>(
  "FeatureActivations",
)({
  InputPrepareScheduleActions: S.optional(S.String).pipe(
    T.JsonName("inputPrepareScheduleActions"),
  ),
  OutputStaticImageOverlayScheduleActions: S.optional(S.String).pipe(
    T.JsonName("outputStaticImageOverlayScheduleActions"),
  ),
}) {}
export class InputLossBehavior extends S.Class<InputLossBehavior>(
  "InputLossBehavior",
)({
  BlackFrameMsec: S.optional(S.Number).pipe(T.JsonName("blackFrameMsec")),
  InputLossImageColor: S.optional(S.String).pipe(
    T.JsonName("inputLossImageColor"),
  ),
  InputLossImageSlate: S.optional(InputLocation).pipe(
    T.JsonName("inputLossImageSlate"),
  ),
  InputLossImageType: S.optional(S.String).pipe(
    T.JsonName("inputLossImageType"),
  ),
  RepeatFrameMsec: S.optional(S.Number).pipe(T.JsonName("repeatFrameMsec")),
}) {}
export class EpochLockingSettings extends S.Class<EpochLockingSettings>(
  "EpochLockingSettings",
)({
  CustomEpoch: S.optional(S.String).pipe(T.JsonName("customEpoch")),
  JamSyncTime: S.optional(S.String).pipe(T.JsonName("jamSyncTime")),
}) {}
export class PipelineLockingSettings extends S.Class<PipelineLockingSettings>(
  "PipelineLockingSettings",
)({
  PipelineLockingMethod: S.optional(S.String).pipe(
    T.JsonName("pipelineLockingMethod"),
  ),
}) {}
export class OutputLockingSettings extends S.Class<OutputLockingSettings>(
  "OutputLockingSettings",
)({
  EpochLockingSettings: S.optional(EpochLockingSettings).pipe(
    T.JsonName("epochLockingSettings"),
  ),
  PipelineLockingSettings: S.optional(PipelineLockingSettings).pipe(
    T.JsonName("pipelineLockingSettings"),
  ),
}) {}
export class GlobalConfiguration extends S.Class<GlobalConfiguration>(
  "GlobalConfiguration",
)({
  InitialAudioGain: S.optional(S.Number).pipe(T.JsonName("initialAudioGain")),
  InputEndAction: S.optional(S.String).pipe(T.JsonName("inputEndAction")),
  InputLossBehavior: S.optional(InputLossBehavior).pipe(
    T.JsonName("inputLossBehavior"),
  ),
  OutputLockingMode: S.optional(S.String).pipe(T.JsonName("outputLockingMode")),
  OutputTimingSource: S.optional(S.String).pipe(
    T.JsonName("outputTimingSource"),
  ),
  SupportLowFramerateInputs: S.optional(S.String).pipe(
    T.JsonName("supportLowFramerateInputs"),
  ),
  OutputLockingSettings: S.optional(OutputLockingSettings).pipe(
    T.JsonName("outputLockingSettings"),
  ),
}) {}
export class HtmlMotionGraphicsSettings extends S.Class<HtmlMotionGraphicsSettings>(
  "HtmlMotionGraphicsSettings",
)({}) {}
export class MotionGraphicsSettings extends S.Class<MotionGraphicsSettings>(
  "MotionGraphicsSettings",
)({
  HtmlMotionGraphicsSettings: S.optional(HtmlMotionGraphicsSettings).pipe(
    T.JsonName("htmlMotionGraphicsSettings"),
  ),
}) {}
export class MotionGraphicsConfiguration extends S.Class<MotionGraphicsConfiguration>(
  "MotionGraphicsConfiguration",
)({
  MotionGraphicsInsertion: S.optional(S.String).pipe(
    T.JsonName("motionGraphicsInsertion"),
  ),
  MotionGraphicsSettings: MotionGraphicsSettings.pipe(
    T.JsonName("motionGraphicsSettings"),
  ),
}) {}
export class NielsenConfiguration extends S.Class<NielsenConfiguration>(
  "NielsenConfiguration",
)({
  DistributorId: S.optional(S.String).pipe(T.JsonName("distributorId")),
  NielsenPcmToId3Tagging: S.optional(S.String).pipe(
    T.JsonName("nielsenPcmToId3Tagging"),
  ),
}) {}
export class ArchiveS3Settings extends S.Class<ArchiveS3Settings>(
  "ArchiveS3Settings",
)({ CannedAcl: S.optional(S.String).pipe(T.JsonName("cannedAcl")) }) {}
export class ArchiveCdnSettings extends S.Class<ArchiveCdnSettings>(
  "ArchiveCdnSettings",
)({
  ArchiveS3Settings: S.optional(ArchiveS3Settings).pipe(
    T.JsonName("archiveS3Settings"),
  ),
}) {}
export class OutputLocationRef extends S.Class<OutputLocationRef>(
  "OutputLocationRef",
)({
  DestinationRefId: S.optional(S.String).pipe(T.JsonName("destinationRefId")),
}) {}
export class ArchiveGroupSettings extends S.Class<ArchiveGroupSettings>(
  "ArchiveGroupSettings",
)({
  ArchiveCdnSettings: S.optional(ArchiveCdnSettings).pipe(
    T.JsonName("archiveCdnSettings"),
  ),
  Destination: OutputLocationRef.pipe(T.JsonName("destination")),
  RolloverInterval: S.optional(S.Number).pipe(T.JsonName("rolloverInterval")),
}) {}
export class FrameCaptureS3Settings extends S.Class<FrameCaptureS3Settings>(
  "FrameCaptureS3Settings",
)({ CannedAcl: S.optional(S.String).pipe(T.JsonName("cannedAcl")) }) {}
export class FrameCaptureCdnSettings extends S.Class<FrameCaptureCdnSettings>(
  "FrameCaptureCdnSettings",
)({
  FrameCaptureS3Settings: S.optional(FrameCaptureS3Settings).pipe(
    T.JsonName("frameCaptureS3Settings"),
  ),
}) {}
export class FrameCaptureGroupSettings extends S.Class<FrameCaptureGroupSettings>(
  "FrameCaptureGroupSettings",
)({
  Destination: OutputLocationRef.pipe(T.JsonName("destination")),
  FrameCaptureCdnSettings: S.optional(FrameCaptureCdnSettings).pipe(
    T.JsonName("frameCaptureCdnSettings"),
  ),
}) {}
export const __listOfHlsAdMarkers = S.Array(S.String);
export class CaptionLanguageMapping extends S.Class<CaptionLanguageMapping>(
  "CaptionLanguageMapping",
)({
  CaptionChannel: S.Number.pipe(T.JsonName("captionChannel")),
  LanguageCode: S.String.pipe(T.JsonName("languageCode")),
  LanguageDescription: S.String.pipe(T.JsonName("languageDescription")),
}) {}
export const __listOfCaptionLanguageMapping = S.Array(CaptionLanguageMapping);
export class HlsAkamaiSettings extends S.Class<HlsAkamaiSettings>(
  "HlsAkamaiSettings",
)({
  ConnectionRetryInterval: S.optional(S.Number).pipe(
    T.JsonName("connectionRetryInterval"),
  ),
  FilecacheDuration: S.optional(S.Number).pipe(T.JsonName("filecacheDuration")),
  HttpTransferMode: S.optional(S.String).pipe(T.JsonName("httpTransferMode")),
  NumRetries: S.optional(S.Number).pipe(T.JsonName("numRetries")),
  RestartDelay: S.optional(S.Number).pipe(T.JsonName("restartDelay")),
  Salt: S.optional(S.String).pipe(T.JsonName("salt")),
  Token: S.optional(S.String).pipe(T.JsonName("token")),
}) {}
export class HlsBasicPutSettings extends S.Class<HlsBasicPutSettings>(
  "HlsBasicPutSettings",
)({
  ConnectionRetryInterval: S.optional(S.Number).pipe(
    T.JsonName("connectionRetryInterval"),
  ),
  FilecacheDuration: S.optional(S.Number).pipe(T.JsonName("filecacheDuration")),
  NumRetries: S.optional(S.Number).pipe(T.JsonName("numRetries")),
  RestartDelay: S.optional(S.Number).pipe(T.JsonName("restartDelay")),
}) {}
export class HlsMediaStoreSettings extends S.Class<HlsMediaStoreSettings>(
  "HlsMediaStoreSettings",
)({
  ConnectionRetryInterval: S.optional(S.Number).pipe(
    T.JsonName("connectionRetryInterval"),
  ),
  FilecacheDuration: S.optional(S.Number).pipe(T.JsonName("filecacheDuration")),
  MediaStoreStorageClass: S.optional(S.String).pipe(
    T.JsonName("mediaStoreStorageClass"),
  ),
  NumRetries: S.optional(S.Number).pipe(T.JsonName("numRetries")),
  RestartDelay: S.optional(S.Number).pipe(T.JsonName("restartDelay")),
}) {}
export class HlsS3Settings extends S.Class<HlsS3Settings>("HlsS3Settings")({
  CannedAcl: S.optional(S.String).pipe(T.JsonName("cannedAcl")),
}) {}
export class HlsWebdavSettings extends S.Class<HlsWebdavSettings>(
  "HlsWebdavSettings",
)({
  ConnectionRetryInterval: S.optional(S.Number).pipe(
    T.JsonName("connectionRetryInterval"),
  ),
  FilecacheDuration: S.optional(S.Number).pipe(T.JsonName("filecacheDuration")),
  HttpTransferMode: S.optional(S.String).pipe(T.JsonName("httpTransferMode")),
  NumRetries: S.optional(S.Number).pipe(T.JsonName("numRetries")),
  RestartDelay: S.optional(S.Number).pipe(T.JsonName("restartDelay")),
}) {}
export class HlsCdnSettings extends S.Class<HlsCdnSettings>("HlsCdnSettings")({
  HlsAkamaiSettings: S.optional(HlsAkamaiSettings).pipe(
    T.JsonName("hlsAkamaiSettings"),
  ),
  HlsBasicPutSettings: S.optional(HlsBasicPutSettings).pipe(
    T.JsonName("hlsBasicPutSettings"),
  ),
  HlsMediaStoreSettings: S.optional(HlsMediaStoreSettings).pipe(
    T.JsonName("hlsMediaStoreSettings"),
  ),
  HlsS3Settings: S.optional(HlsS3Settings).pipe(T.JsonName("hlsS3Settings")),
  HlsWebdavSettings: S.optional(HlsWebdavSettings).pipe(
    T.JsonName("hlsWebdavSettings"),
  ),
}) {}
export class StaticKeySettings extends S.Class<StaticKeySettings>(
  "StaticKeySettings",
)({
  KeyProviderServer: S.optional(InputLocation).pipe(
    T.JsonName("keyProviderServer"),
  ),
  StaticKeyValue: S.String.pipe(T.JsonName("staticKeyValue")),
}) {}
export class KeyProviderSettings extends S.Class<KeyProviderSettings>(
  "KeyProviderSettings",
)({
  StaticKeySettings: S.optional(StaticKeySettings).pipe(
    T.JsonName("staticKeySettings"),
  ),
}) {}
export class HlsGroupSettings extends S.Class<HlsGroupSettings>(
  "HlsGroupSettings",
)({
  AdMarkers: S.optional(__listOfHlsAdMarkers).pipe(T.JsonName("adMarkers")),
  BaseUrlContent: S.optional(S.String).pipe(T.JsonName("baseUrlContent")),
  BaseUrlContent1: S.optional(S.String).pipe(T.JsonName("baseUrlContent1")),
  BaseUrlManifest: S.optional(S.String).pipe(T.JsonName("baseUrlManifest")),
  BaseUrlManifest1: S.optional(S.String).pipe(T.JsonName("baseUrlManifest1")),
  CaptionLanguageMappings: S.optional(__listOfCaptionLanguageMapping).pipe(
    T.JsonName("captionLanguageMappings"),
  ),
  CaptionLanguageSetting: S.optional(S.String).pipe(
    T.JsonName("captionLanguageSetting"),
  ),
  ClientCache: S.optional(S.String).pipe(T.JsonName("clientCache")),
  CodecSpecification: S.optional(S.String).pipe(
    T.JsonName("codecSpecification"),
  ),
  ConstantIv: S.optional(S.String).pipe(T.JsonName("constantIv")),
  Destination: OutputLocationRef.pipe(T.JsonName("destination")),
  DirectoryStructure: S.optional(S.String).pipe(
    T.JsonName("directoryStructure"),
  ),
  DiscontinuityTags: S.optional(S.String).pipe(T.JsonName("discontinuityTags")),
  EncryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
  HlsCdnSettings: S.optional(HlsCdnSettings).pipe(T.JsonName("hlsCdnSettings")),
  HlsId3SegmentTagging: S.optional(S.String).pipe(
    T.JsonName("hlsId3SegmentTagging"),
  ),
  IFrameOnlyPlaylists: S.optional(S.String).pipe(
    T.JsonName("iFrameOnlyPlaylists"),
  ),
  IncompleteSegmentBehavior: S.optional(S.String).pipe(
    T.JsonName("incompleteSegmentBehavior"),
  ),
  IndexNSegments: S.optional(S.Number).pipe(T.JsonName("indexNSegments")),
  InputLossAction: S.optional(S.String).pipe(T.JsonName("inputLossAction")),
  IvInManifest: S.optional(S.String).pipe(T.JsonName("ivInManifest")),
  IvSource: S.optional(S.String).pipe(T.JsonName("ivSource")),
  KeepSegments: S.optional(S.Number).pipe(T.JsonName("keepSegments")),
  KeyFormat: S.optional(S.String).pipe(T.JsonName("keyFormat")),
  KeyFormatVersions: S.optional(S.String).pipe(T.JsonName("keyFormatVersions")),
  KeyProviderSettings: S.optional(KeyProviderSettings).pipe(
    T.JsonName("keyProviderSettings"),
  ),
  ManifestCompression: S.optional(S.String).pipe(
    T.JsonName("manifestCompression"),
  ),
  ManifestDurationFormat: S.optional(S.String).pipe(
    T.JsonName("manifestDurationFormat"),
  ),
  MinSegmentLength: S.optional(S.Number).pipe(T.JsonName("minSegmentLength")),
  Mode: S.optional(S.String).pipe(T.JsonName("mode")),
  OutputSelection: S.optional(S.String).pipe(T.JsonName("outputSelection")),
  ProgramDateTime: S.optional(S.String).pipe(T.JsonName("programDateTime")),
  ProgramDateTimeClock: S.optional(S.String).pipe(
    T.JsonName("programDateTimeClock"),
  ),
  ProgramDateTimePeriod: S.optional(S.Number).pipe(
    T.JsonName("programDateTimePeriod"),
  ),
  RedundantManifest: S.optional(S.String).pipe(T.JsonName("redundantManifest")),
  SegmentLength: S.optional(S.Number).pipe(T.JsonName("segmentLength")),
  SegmentationMode: S.optional(S.String).pipe(T.JsonName("segmentationMode")),
  SegmentsPerSubdirectory: S.optional(S.Number).pipe(
    T.JsonName("segmentsPerSubdirectory"),
  ),
  StreamInfResolution: S.optional(S.String).pipe(
    T.JsonName("streamInfResolution"),
  ),
  TimedMetadataId3Frame: S.optional(S.String).pipe(
    T.JsonName("timedMetadataId3Frame"),
  ),
  TimedMetadataId3Period: S.optional(S.Number).pipe(
    T.JsonName("timedMetadataId3Period"),
  ),
  TimestampDeltaMilliseconds: S.optional(S.Number).pipe(
    T.JsonName("timestampDeltaMilliseconds"),
  ),
  TsFileMode: S.optional(S.String).pipe(T.JsonName("tsFileMode")),
}) {}
export class MediaPackageV2GroupSettings extends S.Class<MediaPackageV2GroupSettings>(
  "MediaPackageV2GroupSettings",
)({
  CaptionLanguageMappings: S.optional(__listOfCaptionLanguageMapping).pipe(
    T.JsonName("captionLanguageMappings"),
  ),
  Id3Behavior: S.optional(S.String).pipe(T.JsonName("id3Behavior")),
  KlvBehavior: S.optional(S.String).pipe(T.JsonName("klvBehavior")),
  NielsenId3Behavior: S.optional(S.String).pipe(
    T.JsonName("nielsenId3Behavior"),
  ),
  Scte35Type: S.optional(S.String).pipe(T.JsonName("scte35Type")),
  SegmentLength: S.optional(S.Number).pipe(T.JsonName("segmentLength")),
  SegmentLengthUnits: S.optional(S.String).pipe(
    T.JsonName("segmentLengthUnits"),
  ),
  TimedMetadataId3Frame: S.optional(S.String).pipe(
    T.JsonName("timedMetadataId3Frame"),
  ),
  TimedMetadataId3Period: S.optional(S.Number).pipe(
    T.JsonName("timedMetadataId3Period"),
  ),
  TimedMetadataPassthrough: S.optional(S.String).pipe(
    T.JsonName("timedMetadataPassthrough"),
  ),
}) {}
export class MediaPackageGroupSettings extends S.Class<MediaPackageGroupSettings>(
  "MediaPackageGroupSettings",
)({
  Destination: OutputLocationRef.pipe(T.JsonName("destination")),
  MediapackageV2GroupSettings: S.optional(MediaPackageV2GroupSettings).pipe(
    T.JsonName("mediapackageV2GroupSettings"),
  ),
}) {}
export class MsSmoothGroupSettings extends S.Class<MsSmoothGroupSettings>(
  "MsSmoothGroupSettings",
)({
  AcquisitionPointId: S.optional(S.String).pipe(
    T.JsonName("acquisitionPointId"),
  ),
  AudioOnlyTimecodeControl: S.optional(S.String).pipe(
    T.JsonName("audioOnlyTimecodeControl"),
  ),
  CertificateMode: S.optional(S.String).pipe(T.JsonName("certificateMode")),
  ConnectionRetryInterval: S.optional(S.Number).pipe(
    T.JsonName("connectionRetryInterval"),
  ),
  Destination: OutputLocationRef.pipe(T.JsonName("destination")),
  EventId: S.optional(S.String).pipe(T.JsonName("eventId")),
  EventIdMode: S.optional(S.String).pipe(T.JsonName("eventIdMode")),
  EventStopBehavior: S.optional(S.String).pipe(T.JsonName("eventStopBehavior")),
  FilecacheDuration: S.optional(S.Number).pipe(T.JsonName("filecacheDuration")),
  FragmentLength: S.optional(S.Number).pipe(T.JsonName("fragmentLength")),
  InputLossAction: S.optional(S.String).pipe(T.JsonName("inputLossAction")),
  NumRetries: S.optional(S.Number).pipe(T.JsonName("numRetries")),
  RestartDelay: S.optional(S.Number).pipe(T.JsonName("restartDelay")),
  SegmentationMode: S.optional(S.String).pipe(T.JsonName("segmentationMode")),
  SendDelayMs: S.optional(S.Number).pipe(T.JsonName("sendDelayMs")),
  SparseTrackType: S.optional(S.String).pipe(T.JsonName("sparseTrackType")),
  StreamManifestBehavior: S.optional(S.String).pipe(
    T.JsonName("streamManifestBehavior"),
  ),
  TimestampOffset: S.optional(S.String).pipe(T.JsonName("timestampOffset")),
  TimestampOffsetMode: S.optional(S.String).pipe(
    T.JsonName("timestampOffsetMode"),
  ),
}) {}
export class MultiplexGroupSettings extends S.Class<MultiplexGroupSettings>(
  "MultiplexGroupSettings",
)({}) {}
export const __listOfRtmpAdMarkers = S.Array(S.String);
export class RtmpGroupSettings extends S.Class<RtmpGroupSettings>(
  "RtmpGroupSettings",
)({
  AdMarkers: S.optional(__listOfRtmpAdMarkers).pipe(T.JsonName("adMarkers")),
  AuthenticationScheme: S.optional(S.String).pipe(
    T.JsonName("authenticationScheme"),
  ),
  CacheFullBehavior: S.optional(S.String).pipe(T.JsonName("cacheFullBehavior")),
  CacheLength: S.optional(S.Number).pipe(T.JsonName("cacheLength")),
  CaptionData: S.optional(S.String).pipe(T.JsonName("captionData")),
  InputLossAction: S.optional(S.String).pipe(T.JsonName("inputLossAction")),
  RestartDelay: S.optional(S.Number).pipe(T.JsonName("restartDelay")),
  IncludeFillerNalUnits: S.optional(S.String).pipe(
    T.JsonName("includeFillerNalUnits"),
  ),
}) {}
export class UdpGroupSettings extends S.Class<UdpGroupSettings>(
  "UdpGroupSettings",
)({
  InputLossAction: S.optional(S.String).pipe(T.JsonName("inputLossAction")),
  TimedMetadataId3Frame: S.optional(S.String).pipe(
    T.JsonName("timedMetadataId3Frame"),
  ),
  TimedMetadataId3Period: S.optional(S.Number).pipe(
    T.JsonName("timedMetadataId3Period"),
  ),
}) {}
export class CmafIngestCaptionLanguageMapping extends S.Class<CmafIngestCaptionLanguageMapping>(
  "CmafIngestCaptionLanguageMapping",
)({
  CaptionChannel: S.Number.pipe(T.JsonName("captionChannel")),
  LanguageCode: S.String.pipe(T.JsonName("languageCode")),
}) {}
export const __listOfCmafIngestCaptionLanguageMapping = S.Array(
  CmafIngestCaptionLanguageMapping,
);
export class AdditionalDestinations extends S.Class<AdditionalDestinations>(
  "AdditionalDestinations",
)({ Destination: OutputLocationRef.pipe(T.JsonName("destination")) }) {}
export const __listOfAdditionalDestinations = S.Array(AdditionalDestinations);
export class CmafIngestGroupSettings extends S.Class<CmafIngestGroupSettings>(
  "CmafIngestGroupSettings",
)({
  Destination: OutputLocationRef.pipe(T.JsonName("destination")),
  NielsenId3Behavior: S.optional(S.String).pipe(
    T.JsonName("nielsenId3Behavior"),
  ),
  Scte35Type: S.optional(S.String).pipe(T.JsonName("scte35Type")),
  SegmentLength: S.optional(S.Number).pipe(T.JsonName("segmentLength")),
  SegmentLengthUnits: S.optional(S.String).pipe(
    T.JsonName("segmentLengthUnits"),
  ),
  SendDelayMs: S.optional(S.Number).pipe(T.JsonName("sendDelayMs")),
  KlvBehavior: S.optional(S.String).pipe(T.JsonName("klvBehavior")),
  KlvNameModifier: S.optional(S.String).pipe(T.JsonName("klvNameModifier")),
  NielsenId3NameModifier: S.optional(S.String).pipe(
    T.JsonName("nielsenId3NameModifier"),
  ),
  Scte35NameModifier: S.optional(S.String).pipe(
    T.JsonName("scte35NameModifier"),
  ),
  Id3Behavior: S.optional(S.String).pipe(T.JsonName("id3Behavior")),
  Id3NameModifier: S.optional(S.String).pipe(T.JsonName("id3NameModifier")),
  CaptionLanguageMappings: S.optional(
    __listOfCmafIngestCaptionLanguageMapping,
  ).pipe(T.JsonName("captionLanguageMappings")),
  TimedMetadataId3Frame: S.optional(S.String).pipe(
    T.JsonName("timedMetadataId3Frame"),
  ),
  TimedMetadataId3Period: S.optional(S.Number).pipe(
    T.JsonName("timedMetadataId3Period"),
  ),
  TimedMetadataPassthrough: S.optional(S.String).pipe(
    T.JsonName("timedMetadataPassthrough"),
  ),
  AdditionalDestinations: S.optional(__listOfAdditionalDestinations).pipe(
    T.JsonName("additionalDestinations"),
  ),
}) {}
export class SrtGroupSettings extends S.Class<SrtGroupSettings>(
  "SrtGroupSettings",
)({
  InputLossAction: S.optional(S.String).pipe(T.JsonName("inputLossAction")),
}) {}
export class OutputGroupSettings extends S.Class<OutputGroupSettings>(
  "OutputGroupSettings",
)({
  ArchiveGroupSettings: S.optional(ArchiveGroupSettings).pipe(
    T.JsonName("archiveGroupSettings"),
  ),
  FrameCaptureGroupSettings: S.optional(FrameCaptureGroupSettings).pipe(
    T.JsonName("frameCaptureGroupSettings"),
  ),
  HlsGroupSettings: S.optional(HlsGroupSettings).pipe(
    T.JsonName("hlsGroupSettings"),
  ),
  MediaPackageGroupSettings: S.optional(MediaPackageGroupSettings).pipe(
    T.JsonName("mediaPackageGroupSettings"),
  ),
  MsSmoothGroupSettings: S.optional(MsSmoothGroupSettings).pipe(
    T.JsonName("msSmoothGroupSettings"),
  ),
  MultiplexGroupSettings: S.optional(MultiplexGroupSettings).pipe(
    T.JsonName("multiplexGroupSettings"),
  ),
  RtmpGroupSettings: S.optional(RtmpGroupSettings).pipe(
    T.JsonName("rtmpGroupSettings"),
  ),
  UdpGroupSettings: S.optional(UdpGroupSettings).pipe(
    T.JsonName("udpGroupSettings"),
  ),
  CmafIngestGroupSettings: S.optional(CmafIngestGroupSettings).pipe(
    T.JsonName("cmafIngestGroupSettings"),
  ),
  SrtGroupSettings: S.optional(SrtGroupSettings).pipe(
    T.JsonName("srtGroupSettings"),
  ),
}) {}
export class DvbNitSettings extends S.Class<DvbNitSettings>("DvbNitSettings")({
  NetworkId: S.Number.pipe(T.JsonName("networkId")),
  NetworkName: S.String.pipe(T.JsonName("networkName")),
  RepInterval: S.optional(S.Number).pipe(T.JsonName("repInterval")),
}) {}
export class DvbSdtSettings extends S.Class<DvbSdtSettings>("DvbSdtSettings")({
  OutputSdt: S.optional(S.String).pipe(T.JsonName("outputSdt")),
  RepInterval: S.optional(S.Number).pipe(T.JsonName("repInterval")),
  ServiceName: S.optional(S.String).pipe(T.JsonName("serviceName")),
  ServiceProviderName: S.optional(S.String).pipe(
    T.JsonName("serviceProviderName"),
  ),
}) {}
export class DvbTdtSettings extends S.Class<DvbTdtSettings>("DvbTdtSettings")({
  RepInterval: S.optional(S.Number).pipe(T.JsonName("repInterval")),
}) {}
export class M2tsSettings extends S.Class<M2tsSettings>("M2tsSettings")({
  AbsentInputAudioBehavior: S.optional(S.String).pipe(
    T.JsonName("absentInputAudioBehavior"),
  ),
  Arib: S.optional(S.String).pipe(T.JsonName("arib")),
  AribCaptionsPid: S.optional(S.String).pipe(T.JsonName("aribCaptionsPid")),
  AribCaptionsPidControl: S.optional(S.String).pipe(
    T.JsonName("aribCaptionsPidControl"),
  ),
  AudioBufferModel: S.optional(S.String).pipe(T.JsonName("audioBufferModel")),
  AudioFramesPerPes: S.optional(S.Number).pipe(T.JsonName("audioFramesPerPes")),
  AudioPids: S.optional(S.String).pipe(T.JsonName("audioPids")),
  AudioStreamType: S.optional(S.String).pipe(T.JsonName("audioStreamType")),
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  BufferModel: S.optional(S.String).pipe(T.JsonName("bufferModel")),
  CcDescriptor: S.optional(S.String).pipe(T.JsonName("ccDescriptor")),
  DvbNitSettings: S.optional(DvbNitSettings).pipe(T.JsonName("dvbNitSettings")),
  DvbSdtSettings: S.optional(DvbSdtSettings).pipe(T.JsonName("dvbSdtSettings")),
  DvbSubPids: S.optional(S.String).pipe(T.JsonName("dvbSubPids")),
  DvbTdtSettings: S.optional(DvbTdtSettings).pipe(T.JsonName("dvbTdtSettings")),
  DvbTeletextPid: S.optional(S.String).pipe(T.JsonName("dvbTeletextPid")),
  Ebif: S.optional(S.String).pipe(T.JsonName("ebif")),
  EbpAudioInterval: S.optional(S.String).pipe(T.JsonName("ebpAudioInterval")),
  EbpLookaheadMs: S.optional(S.Number).pipe(T.JsonName("ebpLookaheadMs")),
  EbpPlacement: S.optional(S.String).pipe(T.JsonName("ebpPlacement")),
  EcmPid: S.optional(S.String).pipe(T.JsonName("ecmPid")),
  EsRateInPes: S.optional(S.String).pipe(T.JsonName("esRateInPes")),
  EtvPlatformPid: S.optional(S.String).pipe(T.JsonName("etvPlatformPid")),
  EtvSignalPid: S.optional(S.String).pipe(T.JsonName("etvSignalPid")),
  FragmentTime: S.optional(S.Number).pipe(T.JsonName("fragmentTime")),
  Klv: S.optional(S.String).pipe(T.JsonName("klv")),
  KlvDataPids: S.optional(S.String).pipe(T.JsonName("klvDataPids")),
  NielsenId3Behavior: S.optional(S.String).pipe(
    T.JsonName("nielsenId3Behavior"),
  ),
  NullPacketBitrate: S.optional(S.Number).pipe(T.JsonName("nullPacketBitrate")),
  PatInterval: S.optional(S.Number).pipe(T.JsonName("patInterval")),
  PcrControl: S.optional(S.String).pipe(T.JsonName("pcrControl")),
  PcrPeriod: S.optional(S.Number).pipe(T.JsonName("pcrPeriod")),
  PcrPid: S.optional(S.String).pipe(T.JsonName("pcrPid")),
  PmtInterval: S.optional(S.Number).pipe(T.JsonName("pmtInterval")),
  PmtPid: S.optional(S.String).pipe(T.JsonName("pmtPid")),
  ProgramNum: S.optional(S.Number).pipe(T.JsonName("programNum")),
  RateMode: S.optional(S.String).pipe(T.JsonName("rateMode")),
  Scte27Pids: S.optional(S.String).pipe(T.JsonName("scte27Pids")),
  Scte35Control: S.optional(S.String).pipe(T.JsonName("scte35Control")),
  Scte35Pid: S.optional(S.String).pipe(T.JsonName("scte35Pid")),
  SegmentationMarkers: S.optional(S.String).pipe(
    T.JsonName("segmentationMarkers"),
  ),
  SegmentationStyle: S.optional(S.String).pipe(T.JsonName("segmentationStyle")),
  SegmentationTime: S.optional(S.Number).pipe(T.JsonName("segmentationTime")),
  TimedMetadataBehavior: S.optional(S.String).pipe(
    T.JsonName("timedMetadataBehavior"),
  ),
  TimedMetadataPid: S.optional(S.String).pipe(T.JsonName("timedMetadataPid")),
  TransportStreamId: S.optional(S.Number).pipe(T.JsonName("transportStreamId")),
  VideoPid: S.optional(S.String).pipe(T.JsonName("videoPid")),
  Scte35PrerollPullupMilliseconds: S.optional(S.Number).pipe(
    T.JsonName("scte35PrerollPullupMilliseconds"),
  ),
}) {}
export class RawSettings extends S.Class<RawSettings>("RawSettings")({}) {}
export class ArchiveContainerSettings extends S.Class<ArchiveContainerSettings>(
  "ArchiveContainerSettings",
)({
  M2tsSettings: S.optional(M2tsSettings).pipe(T.JsonName("m2tsSettings")),
  RawSettings: S.optional(RawSettings).pipe(T.JsonName("rawSettings")),
}) {}
export class ArchiveOutputSettings extends S.Class<ArchiveOutputSettings>(
  "ArchiveOutputSettings",
)({
  ContainerSettings: ArchiveContainerSettings.pipe(
    T.JsonName("containerSettings"),
  ),
  Extension: S.optional(S.String).pipe(T.JsonName("extension")),
  NameModifier: S.optional(S.String).pipe(T.JsonName("nameModifier")),
}) {}
export class FrameCaptureOutputSettings extends S.Class<FrameCaptureOutputSettings>(
  "FrameCaptureOutputSettings",
)({ NameModifier: S.optional(S.String).pipe(T.JsonName("nameModifier")) }) {}
export class AudioOnlyHlsSettings extends S.Class<AudioOnlyHlsSettings>(
  "AudioOnlyHlsSettings",
)({
  AudioGroupId: S.optional(S.String).pipe(T.JsonName("audioGroupId")),
  AudioOnlyImage: S.optional(InputLocation).pipe(T.JsonName("audioOnlyImage")),
  AudioTrackType: S.optional(S.String).pipe(T.JsonName("audioTrackType")),
  SegmentType: S.optional(S.String).pipe(T.JsonName("segmentType")),
}) {}
export class Fmp4HlsSettings extends S.Class<Fmp4HlsSettings>(
  "Fmp4HlsSettings",
)({
  AudioRenditionSets: S.optional(S.String).pipe(
    T.JsonName("audioRenditionSets"),
  ),
  NielsenId3Behavior: S.optional(S.String).pipe(
    T.JsonName("nielsenId3Behavior"),
  ),
  TimedMetadataBehavior: S.optional(S.String).pipe(
    T.JsonName("timedMetadataBehavior"),
  ),
}) {}
export class FrameCaptureHlsSettings extends S.Class<FrameCaptureHlsSettings>(
  "FrameCaptureHlsSettings",
)({}) {}
export class M3u8Settings extends S.Class<M3u8Settings>("M3u8Settings")({
  AudioFramesPerPes: S.optional(S.Number).pipe(T.JsonName("audioFramesPerPes")),
  AudioPids: S.optional(S.String).pipe(T.JsonName("audioPids")),
  EcmPid: S.optional(S.String).pipe(T.JsonName("ecmPid")),
  NielsenId3Behavior: S.optional(S.String).pipe(
    T.JsonName("nielsenId3Behavior"),
  ),
  PatInterval: S.optional(S.Number).pipe(T.JsonName("patInterval")),
  PcrControl: S.optional(S.String).pipe(T.JsonName("pcrControl")),
  PcrPeriod: S.optional(S.Number).pipe(T.JsonName("pcrPeriod")),
  PcrPid: S.optional(S.String).pipe(T.JsonName("pcrPid")),
  PmtInterval: S.optional(S.Number).pipe(T.JsonName("pmtInterval")),
  PmtPid: S.optional(S.String).pipe(T.JsonName("pmtPid")),
  ProgramNum: S.optional(S.Number).pipe(T.JsonName("programNum")),
  Scte35Behavior: S.optional(S.String).pipe(T.JsonName("scte35Behavior")),
  Scte35Pid: S.optional(S.String).pipe(T.JsonName("scte35Pid")),
  TimedMetadataBehavior: S.optional(S.String).pipe(
    T.JsonName("timedMetadataBehavior"),
  ),
  TimedMetadataPid: S.optional(S.String).pipe(T.JsonName("timedMetadataPid")),
  TransportStreamId: S.optional(S.Number).pipe(T.JsonName("transportStreamId")),
  VideoPid: S.optional(S.String).pipe(T.JsonName("videoPid")),
  KlvBehavior: S.optional(S.String).pipe(T.JsonName("klvBehavior")),
  KlvDataPids: S.optional(S.String).pipe(T.JsonName("klvDataPids")),
}) {}
export class StandardHlsSettings extends S.Class<StandardHlsSettings>(
  "StandardHlsSettings",
)({
  AudioRenditionSets: S.optional(S.String).pipe(
    T.JsonName("audioRenditionSets"),
  ),
  M3u8Settings: M3u8Settings.pipe(T.JsonName("m3u8Settings")),
}) {}
export class HlsSettings extends S.Class<HlsSettings>("HlsSettings")({
  AudioOnlyHlsSettings: S.optional(AudioOnlyHlsSettings).pipe(
    T.JsonName("audioOnlyHlsSettings"),
  ),
  Fmp4HlsSettings: S.optional(Fmp4HlsSettings).pipe(
    T.JsonName("fmp4HlsSettings"),
  ),
  FrameCaptureHlsSettings: S.optional(FrameCaptureHlsSettings).pipe(
    T.JsonName("frameCaptureHlsSettings"),
  ),
  StandardHlsSettings: S.optional(StandardHlsSettings).pipe(
    T.JsonName("standardHlsSettings"),
  ),
}) {}
export class HlsOutputSettings extends S.Class<HlsOutputSettings>(
  "HlsOutputSettings",
)({
  H265PackagingType: S.optional(S.String).pipe(T.JsonName("h265PackagingType")),
  HlsSettings: HlsSettings.pipe(T.JsonName("hlsSettings")),
  NameModifier: S.optional(S.String).pipe(T.JsonName("nameModifier")),
  SegmentModifier: S.optional(S.String).pipe(T.JsonName("segmentModifier")),
}) {}
export class MediaPackageV2DestinationSettings extends S.Class<MediaPackageV2DestinationSettings>(
  "MediaPackageV2DestinationSettings",
)({
  AudioGroupId: S.optional(S.String).pipe(T.JsonName("audioGroupId")),
  AudioRenditionSets: S.optional(S.String).pipe(
    T.JsonName("audioRenditionSets"),
  ),
  HlsAutoSelect: S.optional(S.String).pipe(T.JsonName("hlsAutoSelect")),
  HlsDefault: S.optional(S.String).pipe(T.JsonName("hlsDefault")),
}) {}
export class MediaPackageOutputSettings extends S.Class<MediaPackageOutputSettings>(
  "MediaPackageOutputSettings",
)({
  MediaPackageV2DestinationSettings: S.optional(
    MediaPackageV2DestinationSettings,
  ).pipe(T.JsonName("mediaPackageV2DestinationSettings")),
}) {}
export class MsSmoothOutputSettings extends S.Class<MsSmoothOutputSettings>(
  "MsSmoothOutputSettings",
)({
  H265PackagingType: S.optional(S.String).pipe(T.JsonName("h265PackagingType")),
  NameModifier: S.optional(S.String).pipe(T.JsonName("nameModifier")),
}) {}
export class MultiplexM2tsSettings extends S.Class<MultiplexM2tsSettings>(
  "MultiplexM2tsSettings",
)({
  AbsentInputAudioBehavior: S.optional(S.String).pipe(
    T.JsonName("absentInputAudioBehavior"),
  ),
  Arib: S.optional(S.String).pipe(T.JsonName("arib")),
  AudioBufferModel: S.optional(S.String).pipe(T.JsonName("audioBufferModel")),
  AudioFramesPerPes: S.optional(S.Number).pipe(T.JsonName("audioFramesPerPes")),
  AudioStreamType: S.optional(S.String).pipe(T.JsonName("audioStreamType")),
  CcDescriptor: S.optional(S.String).pipe(T.JsonName("ccDescriptor")),
  Ebif: S.optional(S.String).pipe(T.JsonName("ebif")),
  EsRateInPes: S.optional(S.String).pipe(T.JsonName("esRateInPes")),
  Klv: S.optional(S.String).pipe(T.JsonName("klv")),
  NielsenId3Behavior: S.optional(S.String).pipe(
    T.JsonName("nielsenId3Behavior"),
  ),
  PcrControl: S.optional(S.String).pipe(T.JsonName("pcrControl")),
  PcrPeriod: S.optional(S.Number).pipe(T.JsonName("pcrPeriod")),
  Scte35Control: S.optional(S.String).pipe(T.JsonName("scte35Control")),
  Scte35PrerollPullupMilliseconds: S.optional(S.Number).pipe(
    T.JsonName("scte35PrerollPullupMilliseconds"),
  ),
}) {}
export class MultiplexContainerSettings extends S.Class<MultiplexContainerSettings>(
  "MultiplexContainerSettings",
)({
  MultiplexM2tsSettings: S.optional(MultiplexM2tsSettings).pipe(
    T.JsonName("multiplexM2tsSettings"),
  ),
}) {}
export class MultiplexOutputSettings extends S.Class<MultiplexOutputSettings>(
  "MultiplexOutputSettings",
)({
  Destination: OutputLocationRef.pipe(T.JsonName("destination")),
  ContainerSettings: S.optional(MultiplexContainerSettings).pipe(
    T.JsonName("containerSettings"),
  ),
}) {}
export class RtmpOutputSettings extends S.Class<RtmpOutputSettings>(
  "RtmpOutputSettings",
)({
  CertificateMode: S.optional(S.String).pipe(T.JsonName("certificateMode")),
  ConnectionRetryInterval: S.optional(S.Number).pipe(
    T.JsonName("connectionRetryInterval"),
  ),
  Destination: OutputLocationRef.pipe(T.JsonName("destination")),
  NumRetries: S.optional(S.Number).pipe(T.JsonName("numRetries")),
}) {}
export class UdpContainerSettings extends S.Class<UdpContainerSettings>(
  "UdpContainerSettings",
)({
  M2tsSettings: S.optional(M2tsSettings).pipe(T.JsonName("m2tsSettings")),
}) {}
export class FecOutputSettings extends S.Class<FecOutputSettings>(
  "FecOutputSettings",
)({
  ColumnDepth: S.optional(S.Number).pipe(T.JsonName("columnDepth")),
  IncludeFec: S.optional(S.String).pipe(T.JsonName("includeFec")),
  RowLength: S.optional(S.Number).pipe(T.JsonName("rowLength")),
}) {}
export class UdpOutputSettings extends S.Class<UdpOutputSettings>(
  "UdpOutputSettings",
)({
  BufferMsec: S.optional(S.Number).pipe(T.JsonName("bufferMsec")),
  ContainerSettings: UdpContainerSettings.pipe(T.JsonName("containerSettings")),
  Destination: OutputLocationRef.pipe(T.JsonName("destination")),
  FecOutputSettings: S.optional(FecOutputSettings).pipe(
    T.JsonName("fecOutputSettings"),
  ),
}) {}
export class CmafIngestOutputSettings extends S.Class<CmafIngestOutputSettings>(
  "CmafIngestOutputSettings",
)({ NameModifier: S.optional(S.String).pipe(T.JsonName("nameModifier")) }) {}
export class SrtOutputSettings extends S.Class<SrtOutputSettings>(
  "SrtOutputSettings",
)({
  BufferMsec: S.optional(S.Number).pipe(T.JsonName("bufferMsec")),
  ContainerSettings: UdpContainerSettings.pipe(T.JsonName("containerSettings")),
  Destination: OutputLocationRef.pipe(T.JsonName("destination")),
  EncryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
  Latency: S.optional(S.Number).pipe(T.JsonName("latency")),
}) {}
export class OutputSettings extends S.Class<OutputSettings>("OutputSettings")({
  ArchiveOutputSettings: S.optional(ArchiveOutputSettings).pipe(
    T.JsonName("archiveOutputSettings"),
  ),
  FrameCaptureOutputSettings: S.optional(FrameCaptureOutputSettings).pipe(
    T.JsonName("frameCaptureOutputSettings"),
  ),
  HlsOutputSettings: S.optional(HlsOutputSettings).pipe(
    T.JsonName("hlsOutputSettings"),
  ),
  MediaPackageOutputSettings: S.optional(MediaPackageOutputSettings).pipe(
    T.JsonName("mediaPackageOutputSettings"),
  ),
  MsSmoothOutputSettings: S.optional(MsSmoothOutputSettings).pipe(
    T.JsonName("msSmoothOutputSettings"),
  ),
  MultiplexOutputSettings: S.optional(MultiplexOutputSettings).pipe(
    T.JsonName("multiplexOutputSettings"),
  ),
  RtmpOutputSettings: S.optional(RtmpOutputSettings).pipe(
    T.JsonName("rtmpOutputSettings"),
  ),
  UdpOutputSettings: S.optional(UdpOutputSettings).pipe(
    T.JsonName("udpOutputSettings"),
  ),
  CmafIngestOutputSettings: S.optional(CmafIngestOutputSettings).pipe(
    T.JsonName("cmafIngestOutputSettings"),
  ),
  SrtOutputSettings: S.optional(SrtOutputSettings).pipe(
    T.JsonName("srtOutputSettings"),
  ),
}) {}
export class Output extends S.Class<Output>("Output")({
  AudioDescriptionNames: S.optional(__listOf__string).pipe(
    T.JsonName("audioDescriptionNames"),
  ),
  CaptionDescriptionNames: S.optional(__listOf__string).pipe(
    T.JsonName("captionDescriptionNames"),
  ),
  OutputName: S.optional(S.String).pipe(T.JsonName("outputName")),
  OutputSettings: OutputSettings.pipe(T.JsonName("outputSettings")),
  VideoDescriptionName: S.optional(S.String).pipe(
    T.JsonName("videoDescriptionName"),
  ),
}) {}
export const __listOfOutput = S.Array(Output);
export class OutputGroup extends S.Class<OutputGroup>("OutputGroup")({
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  OutputGroupSettings: OutputGroupSettings.pipe(
    T.JsonName("outputGroupSettings"),
  ),
  Outputs: __listOfOutput.pipe(T.JsonName("outputs")),
}) {}
export const __listOfOutputGroup = S.Array(OutputGroup);
export class TimecodeConfig extends S.Class<TimecodeConfig>("TimecodeConfig")({
  Source: S.String.pipe(T.JsonName("source")),
  SyncThreshold: S.optional(S.Number).pipe(T.JsonName("syncThreshold")),
}) {}
export class TimecodeBurninSettings extends S.Class<TimecodeBurninSettings>(
  "TimecodeBurninSettings",
)({
  FontSize: S.String.pipe(T.JsonName("fontSize")),
  Position: S.String.pipe(T.JsonName("position")),
  Prefix: S.optional(S.String).pipe(T.JsonName("prefix")),
}) {}
export class FrameCaptureSettings extends S.Class<FrameCaptureSettings>(
  "FrameCaptureSettings",
)({
  CaptureInterval: S.optional(S.Number).pipe(T.JsonName("captureInterval")),
  CaptureIntervalUnits: S.optional(S.String).pipe(
    T.JsonName("captureIntervalUnits"),
  ),
  TimecodeBurninSettings: S.optional(TimecodeBurninSettings).pipe(
    T.JsonName("timecodeBurninSettings"),
  ),
}) {}
export class ColorSpacePassthroughSettings extends S.Class<ColorSpacePassthroughSettings>(
  "ColorSpacePassthroughSettings",
)({}) {}
export class Rec601Settings extends S.Class<Rec601Settings>("Rec601Settings")(
  {},
) {}
export class Rec709Settings extends S.Class<Rec709Settings>("Rec709Settings")(
  {},
) {}
export class H264ColorSpaceSettings extends S.Class<H264ColorSpaceSettings>(
  "H264ColorSpaceSettings",
)({
  ColorSpacePassthroughSettings: S.optional(ColorSpacePassthroughSettings).pipe(
    T.JsonName("colorSpacePassthroughSettings"),
  ),
  Rec601Settings: S.optional(Rec601Settings).pipe(T.JsonName("rec601Settings")),
  Rec709Settings: S.optional(Rec709Settings).pipe(T.JsonName("rec709Settings")),
}) {}
export class TemporalFilterSettings extends S.Class<TemporalFilterSettings>(
  "TemporalFilterSettings",
)({
  PostFilterSharpening: S.optional(S.String).pipe(
    T.JsonName("postFilterSharpening"),
  ),
  Strength: S.optional(S.String).pipe(T.JsonName("strength")),
}) {}
export class BandwidthReductionFilterSettings extends S.Class<BandwidthReductionFilterSettings>(
  "BandwidthReductionFilterSettings",
)({
  PostFilterSharpening: S.optional(S.String).pipe(
    T.JsonName("postFilterSharpening"),
  ),
  Strength: S.optional(S.String).pipe(T.JsonName("strength")),
}) {}
export class H264FilterSettings extends S.Class<H264FilterSettings>(
  "H264FilterSettings",
)({
  TemporalFilterSettings: S.optional(TemporalFilterSettings).pipe(
    T.JsonName("temporalFilterSettings"),
  ),
  BandwidthReductionFilterSettings: S.optional(
    BandwidthReductionFilterSettings,
  ).pipe(T.JsonName("bandwidthReductionFilterSettings")),
}) {}
export class H264Settings extends S.Class<H264Settings>("H264Settings")({
  AdaptiveQuantization: S.optional(S.String).pipe(
    T.JsonName("adaptiveQuantization"),
  ),
  AfdSignaling: S.optional(S.String).pipe(T.JsonName("afdSignaling")),
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  BufFillPct: S.optional(S.Number).pipe(T.JsonName("bufFillPct")),
  BufSize: S.optional(S.Number).pipe(T.JsonName("bufSize")),
  ColorMetadata: S.optional(S.String).pipe(T.JsonName("colorMetadata")),
  ColorSpaceSettings: S.optional(H264ColorSpaceSettings).pipe(
    T.JsonName("colorSpaceSettings"),
  ),
  EntropyEncoding: S.optional(S.String).pipe(T.JsonName("entropyEncoding")),
  FilterSettings: S.optional(H264FilterSettings).pipe(
    T.JsonName("filterSettings"),
  ),
  FixedAfd: S.optional(S.String).pipe(T.JsonName("fixedAfd")),
  FlickerAq: S.optional(S.String).pipe(T.JsonName("flickerAq")),
  ForceFieldPictures: S.optional(S.String).pipe(
    T.JsonName("forceFieldPictures"),
  ),
  FramerateControl: S.optional(S.String).pipe(T.JsonName("framerateControl")),
  FramerateDenominator: S.optional(S.Number).pipe(
    T.JsonName("framerateDenominator"),
  ),
  FramerateNumerator: S.optional(S.Number).pipe(
    T.JsonName("framerateNumerator"),
  ),
  GopBReference: S.optional(S.String).pipe(T.JsonName("gopBReference")),
  GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
  GopNumBFrames: S.optional(S.Number).pipe(T.JsonName("gopNumBFrames")),
  GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
  GopSizeUnits: S.optional(S.String).pipe(T.JsonName("gopSizeUnits")),
  Level: S.optional(S.String).pipe(T.JsonName("level")),
  LookAheadRateControl: S.optional(S.String).pipe(
    T.JsonName("lookAheadRateControl"),
  ),
  MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
  MinIInterval: S.optional(S.Number).pipe(T.JsonName("minIInterval")),
  NumRefFrames: S.optional(S.Number).pipe(T.JsonName("numRefFrames")),
  ParControl: S.optional(S.String).pipe(T.JsonName("parControl")),
  ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
  ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
  Profile: S.optional(S.String).pipe(T.JsonName("profile")),
  QualityLevel: S.optional(S.String).pipe(T.JsonName("qualityLevel")),
  QvbrQualityLevel: S.optional(S.Number).pipe(T.JsonName("qvbrQualityLevel")),
  RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
  ScanType: S.optional(S.String).pipe(T.JsonName("scanType")),
  SceneChangeDetect: S.optional(S.String).pipe(T.JsonName("sceneChangeDetect")),
  Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
  Softness: S.optional(S.Number).pipe(T.JsonName("softness")),
  SpatialAq: S.optional(S.String).pipe(T.JsonName("spatialAq")),
  SubgopLength: S.optional(S.String).pipe(T.JsonName("subgopLength")),
  Syntax: S.optional(S.String).pipe(T.JsonName("syntax")),
  TemporalAq: S.optional(S.String).pipe(T.JsonName("temporalAq")),
  TimecodeInsertion: S.optional(S.String).pipe(T.JsonName("timecodeInsertion")),
  TimecodeBurninSettings: S.optional(TimecodeBurninSettings).pipe(
    T.JsonName("timecodeBurninSettings"),
  ),
  MinQp: S.optional(S.Number).pipe(T.JsonName("minQp")),
  MinBitrate: S.optional(S.Number).pipe(T.JsonName("minBitrate")),
}) {}
export class DolbyVision81Settings extends S.Class<DolbyVision81Settings>(
  "DolbyVision81Settings",
)({}) {}
export class Hdr10Settings extends S.Class<Hdr10Settings>("Hdr10Settings")({
  MaxCll: S.optional(S.Number).pipe(T.JsonName("maxCll")),
  MaxFall: S.optional(S.Number).pipe(T.JsonName("maxFall")),
}) {}
export class Hlg2020Settings extends S.Class<Hlg2020Settings>(
  "Hlg2020Settings",
)({}) {}
export class H265ColorSpaceSettings extends S.Class<H265ColorSpaceSettings>(
  "H265ColorSpaceSettings",
)({
  ColorSpacePassthroughSettings: S.optional(ColorSpacePassthroughSettings).pipe(
    T.JsonName("colorSpacePassthroughSettings"),
  ),
  DolbyVision81Settings: S.optional(DolbyVision81Settings).pipe(
    T.JsonName("dolbyVision81Settings"),
  ),
  Hdr10Settings: S.optional(Hdr10Settings).pipe(T.JsonName("hdr10Settings")),
  Rec601Settings: S.optional(Rec601Settings).pipe(T.JsonName("rec601Settings")),
  Rec709Settings: S.optional(Rec709Settings).pipe(T.JsonName("rec709Settings")),
  Hlg2020Settings: S.optional(Hlg2020Settings).pipe(
    T.JsonName("hlg2020Settings"),
  ),
}) {}
export class H265FilterSettings extends S.Class<H265FilterSettings>(
  "H265FilterSettings",
)({
  TemporalFilterSettings: S.optional(TemporalFilterSettings).pipe(
    T.JsonName("temporalFilterSettings"),
  ),
  BandwidthReductionFilterSettings: S.optional(
    BandwidthReductionFilterSettings,
  ).pipe(T.JsonName("bandwidthReductionFilterSettings")),
}) {}
export class H265Settings extends S.Class<H265Settings>("H265Settings")({
  AdaptiveQuantization: S.optional(S.String).pipe(
    T.JsonName("adaptiveQuantization"),
  ),
  AfdSignaling: S.optional(S.String).pipe(T.JsonName("afdSignaling")),
  AlternativeTransferFunction: S.optional(S.String).pipe(
    T.JsonName("alternativeTransferFunction"),
  ),
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  BufSize: S.optional(S.Number).pipe(T.JsonName("bufSize")),
  ColorMetadata: S.optional(S.String).pipe(T.JsonName("colorMetadata")),
  ColorSpaceSettings: S.optional(H265ColorSpaceSettings).pipe(
    T.JsonName("colorSpaceSettings"),
  ),
  FilterSettings: S.optional(H265FilterSettings).pipe(
    T.JsonName("filterSettings"),
  ),
  FixedAfd: S.optional(S.String).pipe(T.JsonName("fixedAfd")),
  FlickerAq: S.optional(S.String).pipe(T.JsonName("flickerAq")),
  FramerateDenominator: S.Number.pipe(T.JsonName("framerateDenominator")),
  FramerateNumerator: S.Number.pipe(T.JsonName("framerateNumerator")),
  GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
  GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
  GopSizeUnits: S.optional(S.String).pipe(T.JsonName("gopSizeUnits")),
  Level: S.optional(S.String).pipe(T.JsonName("level")),
  LookAheadRateControl: S.optional(S.String).pipe(
    T.JsonName("lookAheadRateControl"),
  ),
  MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
  MinIInterval: S.optional(S.Number).pipe(T.JsonName("minIInterval")),
  ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
  ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
  Profile: S.optional(S.String).pipe(T.JsonName("profile")),
  QvbrQualityLevel: S.optional(S.Number).pipe(T.JsonName("qvbrQualityLevel")),
  RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
  ScanType: S.optional(S.String).pipe(T.JsonName("scanType")),
  SceneChangeDetect: S.optional(S.String).pipe(T.JsonName("sceneChangeDetect")),
  Slices: S.optional(S.Number).pipe(T.JsonName("slices")),
  Tier: S.optional(S.String).pipe(T.JsonName("tier")),
  TimecodeInsertion: S.optional(S.String).pipe(T.JsonName("timecodeInsertion")),
  TimecodeBurninSettings: S.optional(TimecodeBurninSettings).pipe(
    T.JsonName("timecodeBurninSettings"),
  ),
  MvOverPictureBoundaries: S.optional(S.String).pipe(
    T.JsonName("mvOverPictureBoundaries"),
  ),
  MvTemporalPredictor: S.optional(S.String).pipe(
    T.JsonName("mvTemporalPredictor"),
  ),
  TileHeight: S.optional(S.Number).pipe(T.JsonName("tileHeight")),
  TilePadding: S.optional(S.String).pipe(T.JsonName("tilePadding")),
  TileWidth: S.optional(S.Number).pipe(T.JsonName("tileWidth")),
  TreeblockSize: S.optional(S.String).pipe(T.JsonName("treeblockSize")),
  MinQp: S.optional(S.Number).pipe(T.JsonName("minQp")),
  Deblocking: S.optional(S.String).pipe(T.JsonName("deblocking")),
  GopBReference: S.optional(S.String).pipe(T.JsonName("gopBReference")),
  GopNumBFrames: S.optional(S.Number).pipe(T.JsonName("gopNumBFrames")),
  MinBitrate: S.optional(S.Number).pipe(T.JsonName("minBitrate")),
  SubgopLength: S.optional(S.String).pipe(T.JsonName("subgopLength")),
}) {}
export class Mpeg2FilterSettings extends S.Class<Mpeg2FilterSettings>(
  "Mpeg2FilterSettings",
)({
  TemporalFilterSettings: S.optional(TemporalFilterSettings).pipe(
    T.JsonName("temporalFilterSettings"),
  ),
}) {}
export class Mpeg2Settings extends S.Class<Mpeg2Settings>("Mpeg2Settings")({
  AdaptiveQuantization: S.optional(S.String).pipe(
    T.JsonName("adaptiveQuantization"),
  ),
  AfdSignaling: S.optional(S.String).pipe(T.JsonName("afdSignaling")),
  ColorMetadata: S.optional(S.String).pipe(T.JsonName("colorMetadata")),
  ColorSpace: S.optional(S.String).pipe(T.JsonName("colorSpace")),
  DisplayAspectRatio: S.optional(S.String).pipe(
    T.JsonName("displayAspectRatio"),
  ),
  FilterSettings: S.optional(Mpeg2FilterSettings).pipe(
    T.JsonName("filterSettings"),
  ),
  FixedAfd: S.optional(S.String).pipe(T.JsonName("fixedAfd")),
  FramerateDenominator: S.Number.pipe(T.JsonName("framerateDenominator")),
  FramerateNumerator: S.Number.pipe(T.JsonName("framerateNumerator")),
  GopClosedCadence: S.optional(S.Number).pipe(T.JsonName("gopClosedCadence")),
  GopNumBFrames: S.optional(S.Number).pipe(T.JsonName("gopNumBFrames")),
  GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
  GopSizeUnits: S.optional(S.String).pipe(T.JsonName("gopSizeUnits")),
  ScanType: S.optional(S.String).pipe(T.JsonName("scanType")),
  SubgopLength: S.optional(S.String).pipe(T.JsonName("subgopLength")),
  TimecodeInsertion: S.optional(S.String).pipe(T.JsonName("timecodeInsertion")),
  TimecodeBurninSettings: S.optional(TimecodeBurninSettings).pipe(
    T.JsonName("timecodeBurninSettings"),
  ),
}) {}
export class Av1ColorSpaceSettings extends S.Class<Av1ColorSpaceSettings>(
  "Av1ColorSpaceSettings",
)({
  ColorSpacePassthroughSettings: S.optional(ColorSpacePassthroughSettings).pipe(
    T.JsonName("colorSpacePassthroughSettings"),
  ),
  Hdr10Settings: S.optional(Hdr10Settings).pipe(T.JsonName("hdr10Settings")),
  Rec601Settings: S.optional(Rec601Settings).pipe(T.JsonName("rec601Settings")),
  Rec709Settings: S.optional(Rec709Settings).pipe(T.JsonName("rec709Settings")),
}) {}
export class Av1Settings extends S.Class<Av1Settings>("Av1Settings")({
  AfdSignaling: S.optional(S.String).pipe(T.JsonName("afdSignaling")),
  BufSize: S.optional(S.Number).pipe(T.JsonName("bufSize")),
  ColorSpaceSettings: S.optional(Av1ColorSpaceSettings).pipe(
    T.JsonName("colorSpaceSettings"),
  ),
  FixedAfd: S.optional(S.String).pipe(T.JsonName("fixedAfd")),
  FramerateDenominator: S.Number.pipe(T.JsonName("framerateDenominator")),
  FramerateNumerator: S.Number.pipe(T.JsonName("framerateNumerator")),
  GopSize: S.optional(S.Number).pipe(T.JsonName("gopSize")),
  GopSizeUnits: S.optional(S.String).pipe(T.JsonName("gopSizeUnits")),
  Level: S.optional(S.String).pipe(T.JsonName("level")),
  LookAheadRateControl: S.optional(S.String).pipe(
    T.JsonName("lookAheadRateControl"),
  ),
  MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
  MinIInterval: S.optional(S.Number).pipe(T.JsonName("minIInterval")),
  ParDenominator: S.optional(S.Number).pipe(T.JsonName("parDenominator")),
  ParNumerator: S.optional(S.Number).pipe(T.JsonName("parNumerator")),
  QvbrQualityLevel: S.optional(S.Number).pipe(T.JsonName("qvbrQualityLevel")),
  SceneChangeDetect: S.optional(S.String).pipe(T.JsonName("sceneChangeDetect")),
  TimecodeBurninSettings: S.optional(TimecodeBurninSettings).pipe(
    T.JsonName("timecodeBurninSettings"),
  ),
  Bitrate: S.optional(S.Number).pipe(T.JsonName("bitrate")),
  RateControlMode: S.optional(S.String).pipe(T.JsonName("rateControlMode")),
  MinBitrate: S.optional(S.Number).pipe(T.JsonName("minBitrate")),
  SpatialAq: S.optional(S.String).pipe(T.JsonName("spatialAq")),
  TemporalAq: S.optional(S.String).pipe(T.JsonName("temporalAq")),
}) {}
export class VideoCodecSettings extends S.Class<VideoCodecSettings>(
  "VideoCodecSettings",
)({
  FrameCaptureSettings: S.optional(FrameCaptureSettings).pipe(
    T.JsonName("frameCaptureSettings"),
  ),
  H264Settings: S.optional(H264Settings).pipe(T.JsonName("h264Settings")),
  H265Settings: S.optional(H265Settings).pipe(T.JsonName("h265Settings")),
  Mpeg2Settings: S.optional(Mpeg2Settings).pipe(T.JsonName("mpeg2Settings")),
  Av1Settings: S.optional(Av1Settings).pipe(T.JsonName("av1Settings")),
}) {}
export class VideoDescription extends S.Class<VideoDescription>(
  "VideoDescription",
)({
  CodecSettings: S.optional(VideoCodecSettings).pipe(
    T.JsonName("codecSettings"),
  ),
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  Name: S.String.pipe(T.JsonName("name")),
  RespondToAfd: S.optional(S.String).pipe(T.JsonName("respondToAfd")),
  ScalingBehavior: S.optional(S.String).pipe(T.JsonName("scalingBehavior")),
  Sharpness: S.optional(S.Number).pipe(T.JsonName("sharpness")),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
}) {}
export const __listOfVideoDescription = S.Array(VideoDescription);
export class ThumbnailConfiguration extends S.Class<ThumbnailConfiguration>(
  "ThumbnailConfiguration",
)({ State: S.String.pipe(T.JsonName("state")) }) {}
export class ColorCorrection extends S.Class<ColorCorrection>(
  "ColorCorrection",
)({
  InputColorSpace: S.String.pipe(T.JsonName("inputColorSpace")),
  OutputColorSpace: S.String.pipe(T.JsonName("outputColorSpace")),
  Uri: S.String.pipe(T.JsonName("uri")),
}) {}
export const __listOfColorCorrection = S.Array(ColorCorrection);
export class ColorCorrectionSettings extends S.Class<ColorCorrectionSettings>(
  "ColorCorrectionSettings",
)({
  GlobalColorCorrections: __listOfColorCorrection.pipe(
    T.JsonName("globalColorCorrections"),
  ),
}) {}
export class EncoderSettings extends S.Class<EncoderSettings>(
  "EncoderSettings",
)({
  AudioDescriptions: __listOfAudioDescription.pipe(
    T.JsonName("audioDescriptions"),
  ),
  AvailBlanking: S.optional(AvailBlanking).pipe(T.JsonName("availBlanking")),
  AvailConfiguration: S.optional(AvailConfiguration).pipe(
    T.JsonName("availConfiguration"),
  ),
  BlackoutSlate: S.optional(BlackoutSlate).pipe(T.JsonName("blackoutSlate")),
  CaptionDescriptions: S.optional(__listOfCaptionDescription).pipe(
    T.JsonName("captionDescriptions"),
  ),
  FeatureActivations: S.optional(FeatureActivations).pipe(
    T.JsonName("featureActivations"),
  ),
  GlobalConfiguration: S.optional(GlobalConfiguration).pipe(
    T.JsonName("globalConfiguration"),
  ),
  MotionGraphicsConfiguration: S.optional(MotionGraphicsConfiguration).pipe(
    T.JsonName("motionGraphicsConfiguration"),
  ),
  NielsenConfiguration: S.optional(NielsenConfiguration).pipe(
    T.JsonName("nielsenConfiguration"),
  ),
  OutputGroups: __listOfOutputGroup.pipe(T.JsonName("outputGroups")),
  TimecodeConfig: TimecodeConfig.pipe(T.JsonName("timecodeConfig")),
  VideoDescriptions: __listOfVideoDescription.pipe(
    T.JsonName("videoDescriptions"),
  ),
  ThumbnailConfiguration: S.optional(ThumbnailConfiguration).pipe(
    T.JsonName("thumbnailConfiguration"),
  ),
  ColorCorrectionSettings: S.optional(ColorCorrectionSettings).pipe(
    T.JsonName("colorCorrectionSettings"),
  ),
}) {}
export class AudioSilenceFailoverSettings extends S.Class<AudioSilenceFailoverSettings>(
  "AudioSilenceFailoverSettings",
)({
  AudioSelectorName: S.String.pipe(T.JsonName("audioSelectorName")),
  AudioSilenceThresholdMsec: S.optional(S.Number).pipe(
    T.JsonName("audioSilenceThresholdMsec"),
  ),
}) {}
export class InputLossFailoverSettings extends S.Class<InputLossFailoverSettings>(
  "InputLossFailoverSettings",
)({
  InputLossThresholdMsec: S.optional(S.Number).pipe(
    T.JsonName("inputLossThresholdMsec"),
  ),
}) {}
export class VideoBlackFailoverSettings extends S.Class<VideoBlackFailoverSettings>(
  "VideoBlackFailoverSettings",
)({
  BlackDetectThreshold: S.optional(S.Number).pipe(
    T.JsonName("blackDetectThreshold"),
  ),
  VideoBlackThresholdMsec: S.optional(S.Number).pipe(
    T.JsonName("videoBlackThresholdMsec"),
  ),
}) {}
export class FailoverConditionSettings extends S.Class<FailoverConditionSettings>(
  "FailoverConditionSettings",
)({
  AudioSilenceSettings: S.optional(AudioSilenceFailoverSettings).pipe(
    T.JsonName("audioSilenceSettings"),
  ),
  InputLossSettings: S.optional(InputLossFailoverSettings).pipe(
    T.JsonName("inputLossSettings"),
  ),
  VideoBlackSettings: S.optional(VideoBlackFailoverSettings).pipe(
    T.JsonName("videoBlackSettings"),
  ),
}) {}
export class FailoverCondition extends S.Class<FailoverCondition>(
  "FailoverCondition",
)({
  FailoverConditionSettings: S.optional(FailoverConditionSettings).pipe(
    T.JsonName("failoverConditionSettings"),
  ),
}) {}
export const __listOfFailoverCondition = S.Array(FailoverCondition);
export class AutomaticInputFailoverSettings extends S.Class<AutomaticInputFailoverSettings>(
  "AutomaticInputFailoverSettings",
)({
  ErrorClearTimeMsec: S.optional(S.Number).pipe(
    T.JsonName("errorClearTimeMsec"),
  ),
  FailoverConditions: S.optional(__listOfFailoverCondition).pipe(
    T.JsonName("failoverConditions"),
  ),
  InputPreference: S.optional(S.String).pipe(T.JsonName("inputPreference")),
  SecondaryInputId: S.String.pipe(T.JsonName("secondaryInputId")),
}) {}
export class AudioHlsRenditionSelection extends S.Class<AudioHlsRenditionSelection>(
  "AudioHlsRenditionSelection",
)({
  GroupId: S.String.pipe(T.JsonName("groupId")),
  Name: S.String.pipe(T.JsonName("name")),
}) {}
export class AudioLanguageSelection extends S.Class<AudioLanguageSelection>(
  "AudioLanguageSelection",
)({
  LanguageCode: S.String.pipe(T.JsonName("languageCode")),
  LanguageSelectionPolicy: S.optional(S.String).pipe(
    T.JsonName("languageSelectionPolicy"),
  ),
}) {}
export class AudioPidSelection extends S.Class<AudioPidSelection>(
  "AudioPidSelection",
)({ Pid: S.Number.pipe(T.JsonName("pid")) }) {}
export class AudioTrack extends S.Class<AudioTrack>("AudioTrack")({
  Track: S.Number.pipe(T.JsonName("track")),
}) {}
export const __listOfAudioTrack = S.Array(AudioTrack);
export class AudioDolbyEDecode extends S.Class<AudioDolbyEDecode>(
  "AudioDolbyEDecode",
)({ ProgramSelection: S.String.pipe(T.JsonName("programSelection")) }) {}
export class AudioTrackSelection extends S.Class<AudioTrackSelection>(
  "AudioTrackSelection",
)({
  Tracks: __listOfAudioTrack.pipe(T.JsonName("tracks")),
  DolbyEDecode: S.optional(AudioDolbyEDecode).pipe(T.JsonName("dolbyEDecode")),
}) {}
export class AudioSelectorSettings extends S.Class<AudioSelectorSettings>(
  "AudioSelectorSettings",
)({
  AudioHlsRenditionSelection: S.optional(AudioHlsRenditionSelection).pipe(
    T.JsonName("audioHlsRenditionSelection"),
  ),
  AudioLanguageSelection: S.optional(AudioLanguageSelection).pipe(
    T.JsonName("audioLanguageSelection"),
  ),
  AudioPidSelection: S.optional(AudioPidSelection).pipe(
    T.JsonName("audioPidSelection"),
  ),
  AudioTrackSelection: S.optional(AudioTrackSelection).pipe(
    T.JsonName("audioTrackSelection"),
  ),
}) {}
export class AudioSelector extends S.Class<AudioSelector>("AudioSelector")({
  Name: S.String.pipe(T.JsonName("name")),
  SelectorSettings: S.optional(AudioSelectorSettings).pipe(
    T.JsonName("selectorSettings"),
  ),
}) {}
export const __listOfAudioSelector = S.Array(AudioSelector);
export class AncillarySourceSettings extends S.Class<AncillarySourceSettings>(
  "AncillarySourceSettings",
)({
  SourceAncillaryChannelNumber: S.optional(S.Number).pipe(
    T.JsonName("sourceAncillaryChannelNumber"),
  ),
}) {}
export class AribSourceSettings extends S.Class<AribSourceSettings>(
  "AribSourceSettings",
)({}) {}
export class DvbSubSourceSettings extends S.Class<DvbSubSourceSettings>(
  "DvbSubSourceSettings",
)({
  OcrLanguage: S.optional(S.String).pipe(T.JsonName("ocrLanguage")),
  Pid: S.optional(S.Number).pipe(T.JsonName("pid")),
}) {}
export class EmbeddedSourceSettings extends S.Class<EmbeddedSourceSettings>(
  "EmbeddedSourceSettings",
)({
  Convert608To708: S.optional(S.String).pipe(T.JsonName("convert608To708")),
  Scte20Detection: S.optional(S.String).pipe(T.JsonName("scte20Detection")),
  Source608ChannelNumber: S.optional(S.Number).pipe(
    T.JsonName("source608ChannelNumber"),
  ),
  Source608TrackNumber: S.optional(S.Number).pipe(
    T.JsonName("source608TrackNumber"),
  ),
}) {}
export class Scte20SourceSettings extends S.Class<Scte20SourceSettings>(
  "Scte20SourceSettings",
)({
  Convert608To708: S.optional(S.String).pipe(T.JsonName("convert608To708")),
  Source608ChannelNumber: S.optional(S.Number).pipe(
    T.JsonName("source608ChannelNumber"),
  ),
}) {}
export class Scte27SourceSettings extends S.Class<Scte27SourceSettings>(
  "Scte27SourceSettings",
)({
  OcrLanguage: S.optional(S.String).pipe(T.JsonName("ocrLanguage")),
  Pid: S.optional(S.Number).pipe(T.JsonName("pid")),
}) {}
export class CaptionRectangle extends S.Class<CaptionRectangle>(
  "CaptionRectangle",
)({
  Height: S.Number.pipe(T.JsonName("height")),
  LeftOffset: S.Number.pipe(T.JsonName("leftOffset")),
  TopOffset: S.Number.pipe(T.JsonName("topOffset")),
  Width: S.Number.pipe(T.JsonName("width")),
}) {}
export class TeletextSourceSettings extends S.Class<TeletextSourceSettings>(
  "TeletextSourceSettings",
)({
  OutputRectangle: S.optional(CaptionRectangle).pipe(
    T.JsonName("outputRectangle"),
  ),
  PageNumber: S.optional(S.String).pipe(T.JsonName("pageNumber")),
}) {}
export class CaptionSelectorSettings extends S.Class<CaptionSelectorSettings>(
  "CaptionSelectorSettings",
)({
  AncillarySourceSettings: S.optional(AncillarySourceSettings).pipe(
    T.JsonName("ancillarySourceSettings"),
  ),
  AribSourceSettings: S.optional(AribSourceSettings).pipe(
    T.JsonName("aribSourceSettings"),
  ),
  DvbSubSourceSettings: S.optional(DvbSubSourceSettings).pipe(
    T.JsonName("dvbSubSourceSettings"),
  ),
  EmbeddedSourceSettings: S.optional(EmbeddedSourceSettings).pipe(
    T.JsonName("embeddedSourceSettings"),
  ),
  Scte20SourceSettings: S.optional(Scte20SourceSettings).pipe(
    T.JsonName("scte20SourceSettings"),
  ),
  Scte27SourceSettings: S.optional(Scte27SourceSettings).pipe(
    T.JsonName("scte27SourceSettings"),
  ),
  TeletextSourceSettings: S.optional(TeletextSourceSettings).pipe(
    T.JsonName("teletextSourceSettings"),
  ),
}) {}
export class CaptionSelector extends S.Class<CaptionSelector>(
  "CaptionSelector",
)({
  LanguageCode: S.optional(S.String).pipe(T.JsonName("languageCode")),
  Name: S.String.pipe(T.JsonName("name")),
  SelectorSettings: S.optional(CaptionSelectorSettings).pipe(
    T.JsonName("selectorSettings"),
  ),
}) {}
export const __listOfCaptionSelector = S.Array(CaptionSelector);
export class HlsInputSettings extends S.Class<HlsInputSettings>(
  "HlsInputSettings",
)({
  Bandwidth: S.optional(S.Number).pipe(T.JsonName("bandwidth")),
  BufferSegments: S.optional(S.Number).pipe(T.JsonName("bufferSegments")),
  Retries: S.optional(S.Number).pipe(T.JsonName("retries")),
  RetryInterval: S.optional(S.Number).pipe(T.JsonName("retryInterval")),
  Scte35Source: S.optional(S.String).pipe(T.JsonName("scte35Source")),
}) {}
export class MulticastInputSettings extends S.Class<MulticastInputSettings>(
  "MulticastInputSettings",
)({
  SourceIpAddress: S.optional(S.String).pipe(T.JsonName("sourceIpAddress")),
}) {}
export class NetworkInputSettings extends S.Class<NetworkInputSettings>(
  "NetworkInputSettings",
)({
  HlsInputSettings: S.optional(HlsInputSettings).pipe(
    T.JsonName("hlsInputSettings"),
  ),
  ServerValidation: S.optional(S.String).pipe(T.JsonName("serverValidation")),
  MulticastInputSettings: S.optional(MulticastInputSettings).pipe(
    T.JsonName("multicastInputSettings"),
  ),
}) {}
export class VideoSelectorColorSpaceSettings extends S.Class<VideoSelectorColorSpaceSettings>(
  "VideoSelectorColorSpaceSettings",
)({
  Hdr10Settings: S.optional(Hdr10Settings).pipe(T.JsonName("hdr10Settings")),
}) {}
export class VideoSelectorPid extends S.Class<VideoSelectorPid>(
  "VideoSelectorPid",
)({ Pid: S.optional(S.Number).pipe(T.JsonName("pid")) }) {}
export class VideoSelectorProgramId extends S.Class<VideoSelectorProgramId>(
  "VideoSelectorProgramId",
)({ ProgramId: S.optional(S.Number).pipe(T.JsonName("programId")) }) {}
export class VideoSelectorSettings extends S.Class<VideoSelectorSettings>(
  "VideoSelectorSettings",
)({
  VideoSelectorPid: S.optional(VideoSelectorPid).pipe(
    T.JsonName("videoSelectorPid"),
  ),
  VideoSelectorProgramId: S.optional(VideoSelectorProgramId).pipe(
    T.JsonName("videoSelectorProgramId"),
  ),
}) {}
export class VideoSelector extends S.Class<VideoSelector>("VideoSelector")({
  ColorSpace: S.optional(S.String).pipe(T.JsonName("colorSpace")),
  ColorSpaceSettings: S.optional(VideoSelectorColorSpaceSettings).pipe(
    T.JsonName("colorSpaceSettings"),
  ),
  ColorSpaceUsage: S.optional(S.String).pipe(T.JsonName("colorSpaceUsage")),
  SelectorSettings: S.optional(VideoSelectorSettings).pipe(
    T.JsonName("selectorSettings"),
  ),
}) {}
export class InputSettings extends S.Class<InputSettings>("InputSettings")({
  AudioSelectors: S.optional(__listOfAudioSelector).pipe(
    T.JsonName("audioSelectors"),
  ),
  CaptionSelectors: S.optional(__listOfCaptionSelector).pipe(
    T.JsonName("captionSelectors"),
  ),
  DeblockFilter: S.optional(S.String).pipe(T.JsonName("deblockFilter")),
  DenoiseFilter: S.optional(S.String).pipe(T.JsonName("denoiseFilter")),
  FilterStrength: S.optional(S.Number).pipe(T.JsonName("filterStrength")),
  InputFilter: S.optional(S.String).pipe(T.JsonName("inputFilter")),
  NetworkInputSettings: S.optional(NetworkInputSettings).pipe(
    T.JsonName("networkInputSettings"),
  ),
  Scte35Pid: S.optional(S.Number).pipe(T.JsonName("scte35Pid")),
  Smpte2038DataPreference: S.optional(S.String).pipe(
    T.JsonName("smpte2038DataPreference"),
  ),
  SourceEndBehavior: S.optional(S.String).pipe(T.JsonName("sourceEndBehavior")),
  VideoSelector: S.optional(VideoSelector).pipe(T.JsonName("videoSelector")),
}) {}
export class InputAttachment extends S.Class<InputAttachment>(
  "InputAttachment",
)({
  AutomaticInputFailoverSettings: S.optional(
    AutomaticInputFailoverSettings,
  ).pipe(T.JsonName("automaticInputFailoverSettings")),
  InputAttachmentName: S.optional(S.String).pipe(
    T.JsonName("inputAttachmentName"),
  ),
  InputId: S.optional(S.String).pipe(T.JsonName("inputId")),
  InputSettings: S.optional(InputSettings).pipe(T.JsonName("inputSettings")),
  LogicalInterfaceNames: S.optional(__listOf__string).pipe(
    T.JsonName("logicalInterfaceNames"),
  ),
}) {}
export const __listOfInputAttachment = S.Array(InputAttachment);
export class MaintenanceStatus extends S.Class<MaintenanceStatus>(
  "MaintenanceStatus",
)({
  MaintenanceDay: S.optional(S.String).pipe(T.JsonName("maintenanceDay")),
  MaintenanceDeadline: S.optional(S.String).pipe(
    T.JsonName("maintenanceDeadline"),
  ),
  MaintenanceScheduledDate: S.optional(S.String).pipe(
    T.JsonName("maintenanceScheduledDate"),
  ),
  MaintenanceStartTime: S.optional(S.String).pipe(
    T.JsonName("maintenanceStartTime"),
  ),
}) {}
export class PipelineDetail extends S.Class<PipelineDetail>("PipelineDetail")({
  ActiveInputAttachmentName: S.optional(S.String).pipe(
    T.JsonName("activeInputAttachmentName"),
  ),
  ActiveInputSwitchActionName: S.optional(S.String).pipe(
    T.JsonName("activeInputSwitchActionName"),
  ),
  ActiveMotionGraphicsActionName: S.optional(S.String).pipe(
    T.JsonName("activeMotionGraphicsActionName"),
  ),
  ActiveMotionGraphicsUri: S.optional(S.String).pipe(
    T.JsonName("activeMotionGraphicsUri"),
  ),
  PipelineId: S.optional(S.String).pipe(T.JsonName("pipelineId")),
  ChannelEngineVersion: S.optional(ChannelEngineVersionResponse).pipe(
    T.JsonName("channelEngineVersion"),
  ),
}) {}
export const __listOfPipelineDetail = S.Array(PipelineDetail);
export class VpcOutputSettingsDescription extends S.Class<VpcOutputSettingsDescription>(
  "VpcOutputSettingsDescription",
)({
  AvailabilityZones: S.optional(__listOf__string).pipe(
    T.JsonName("availabilityZones"),
  ),
  NetworkInterfaceIds: S.optional(__listOf__string).pipe(
    T.JsonName("networkInterfaceIds"),
  ),
  SecurityGroupIds: S.optional(__listOf__string).pipe(
    T.JsonName("securityGroupIds"),
  ),
  SubnetIds: S.optional(__listOf__string).pipe(T.JsonName("subnetIds")),
}) {}
export class DescribeAnywhereSettings extends S.Class<DescribeAnywhereSettings>(
  "DescribeAnywhereSettings",
)({
  ChannelPlacementGroupId: S.optional(S.String).pipe(
    T.JsonName("channelPlacementGroupId"),
  ),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
}) {}
export class DescribeFollowerChannelSettings extends S.Class<DescribeFollowerChannelSettings>(
  "DescribeFollowerChannelSettings",
)({
  LinkedChannelType: S.optional(S.String).pipe(T.JsonName("linkedChannelType")),
  PrimaryChannelArn: S.optional(S.String).pipe(T.JsonName("primaryChannelArn")),
}) {}
export class DescribePrimaryChannelSettings extends S.Class<DescribePrimaryChannelSettings>(
  "DescribePrimaryChannelSettings",
)({
  FollowingChannelArns: S.optional(__listOf__string).pipe(
    T.JsonName("followingChannelArns"),
  ),
  LinkedChannelType: S.optional(S.String).pipe(T.JsonName("linkedChannelType")),
}) {}
export class DescribeLinkedChannelSettings extends S.Class<DescribeLinkedChannelSettings>(
  "DescribeLinkedChannelSettings",
)({
  FollowerChannelSettings: S.optional(DescribeFollowerChannelSettings).pipe(
    T.JsonName("followerChannelSettings"),
  ),
  PrimaryChannelSettings: S.optional(DescribePrimaryChannelSettings).pipe(
    T.JsonName("primaryChannelSettings"),
  ),
}) {}
export class DescribeChannelResponse extends S.Class<DescribeChannelResponse>(
  "DescribeChannelResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CdiInputSpecification: S.optional(CdiInputSpecification).pipe(
    T.JsonName("cdiInputSpecification"),
  ),
  ChannelClass: S.optional(S.String).pipe(T.JsonName("channelClass")),
  Destinations: S.optional(__listOfOutputDestination).pipe(
    T.JsonName("destinations"),
  ),
  EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
    T.JsonName("egressEndpoints"),
  ),
  EncoderSettings: S.optional(EncoderSettings).pipe(
    T.JsonName("encoderSettings"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InputAttachments: S.optional(__listOfInputAttachment).pipe(
    T.JsonName("inputAttachments"),
  ),
  InputSpecification: S.optional(InputSpecification).pipe(
    T.JsonName("inputSpecification"),
  ),
  LogLevel: S.optional(S.String).pipe(T.JsonName("logLevel")),
  Maintenance: S.optional(MaintenanceStatus).pipe(T.JsonName("maintenance")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelineDetails: S.optional(__listOfPipelineDetail).pipe(
    T.JsonName("pipelineDetails"),
  ),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Vpc: S.optional(VpcOutputSettingsDescription).pipe(T.JsonName("vpc")),
  AnywhereSettings: S.optional(DescribeAnywhereSettings).pipe(
    T.JsonName("anywhereSettings"),
  ),
  ChannelEngineVersion: S.optional(ChannelEngineVersionResponse).pipe(
    T.JsonName("channelEngineVersion"),
  ),
  LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings).pipe(
    T.JsonName("linkedChannelSettings"),
  ),
}) {}
export class DescribeChannelPlacementGroupResponse extends S.Class<DescribeChannelPlacementGroupResponse>(
  "DescribeChannelPlacementGroupResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Channels: S.optional(__listOf__string).pipe(T.JsonName("channels")),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class InterfaceMapping extends S.Class<InterfaceMapping>(
  "InterfaceMapping",
)({
  LogicalInterfaceName: S.optional(S.String).pipe(
    T.JsonName("logicalInterfaceName"),
  ),
  NetworkId: S.optional(S.String).pipe(T.JsonName("networkId")),
}) {}
export const __listOfInterfaceMapping = S.Array(InterfaceMapping);
export class ClusterNetworkSettings extends S.Class<ClusterNetworkSettings>(
  "ClusterNetworkSettings",
)({
  DefaultRoute: S.optional(S.String).pipe(T.JsonName("defaultRoute")),
  InterfaceMappings: S.optional(__listOfInterfaceMapping).pipe(
    T.JsonName("interfaceMappings"),
  ),
}) {}
export class DescribeClusterResponse extends S.Class<DescribeClusterResponse>(
  "DescribeClusterResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
  ClusterType: S.optional(S.String).pipe(T.JsonName("clusterType")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InstanceRoleArn: S.optional(S.String).pipe(T.JsonName("instanceRoleArn")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NetworkSettings: S.optional(ClusterNetworkSettings).pipe(
    T.JsonName("networkSettings"),
  ),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class DescribeInputDeviceThumbnailResponse extends S.Class<DescribeInputDeviceThumbnailResponse>(
  "DescribeInputDeviceThumbnailResponse",
)({
  Body: S.optional(T.StreamingOutput).pipe(T.HttpPayload(), T.JsonName("body")),
  ContentType: S.optional(S.String).pipe(T.HttpHeader("Content-Type")),
  ContentLength: S.optional(S.Number).pipe(T.HttpHeader("Content-Length")),
  ETag: S.optional(S.String).pipe(T.HttpHeader("ETag")),
  LastModified: S.optional(S.Date.pipe(T.TimestampFormat("http-date"))).pipe(
    T.HttpHeader("Last-Modified"),
  ),
}) {}
export class MultiplexMediaConnectOutputDestinationSettings extends S.Class<MultiplexMediaConnectOutputDestinationSettings>(
  "MultiplexMediaConnectOutputDestinationSettings",
)({
  EntitlementArn: S.optional(S.String).pipe(T.JsonName("entitlementArn")),
}) {}
export class MultiplexOutputDestination extends S.Class<MultiplexOutputDestination>(
  "MultiplexOutputDestination",
)({
  MediaConnectSettings: S.optional(
    MultiplexMediaConnectOutputDestinationSettings,
  ).pipe(T.JsonName("mediaConnectSettings")),
}) {}
export const __listOfMultiplexOutputDestination = S.Array(
  MultiplexOutputDestination,
);
export class DescribeMultiplexResponse extends S.Class<DescribeMultiplexResponse>(
  "DescribeMultiplexResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AvailabilityZones: S.optional(__listOf__string).pipe(
    T.JsonName("availabilityZones"),
  ),
  Destinations: S.optional(__listOfMultiplexOutputDestination).pipe(
    T.JsonName("destinations"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MultiplexSettings: S.optional(MultiplexSettings).pipe(
    T.JsonName("multiplexSettings"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  ProgramCount: S.optional(S.Number).pipe(T.JsonName("programCount")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class MultiplexProgramPacketIdentifiersMap extends S.Class<MultiplexProgramPacketIdentifiersMap>(
  "MultiplexProgramPacketIdentifiersMap",
)({
  AudioPids: S.optional(__listOf__integer).pipe(T.JsonName("audioPids")),
  DvbSubPids: S.optional(__listOf__integer).pipe(T.JsonName("dvbSubPids")),
  DvbTeletextPid: S.optional(S.Number).pipe(T.JsonName("dvbTeletextPid")),
  EtvPlatformPid: S.optional(S.Number).pipe(T.JsonName("etvPlatformPid")),
  EtvSignalPid: S.optional(S.Number).pipe(T.JsonName("etvSignalPid")),
  KlvDataPids: S.optional(__listOf__integer).pipe(T.JsonName("klvDataPids")),
  PcrPid: S.optional(S.Number).pipe(T.JsonName("pcrPid")),
  PmtPid: S.optional(S.Number).pipe(T.JsonName("pmtPid")),
  PrivateMetadataPid: S.optional(S.Number).pipe(
    T.JsonName("privateMetadataPid"),
  ),
  Scte27Pids: S.optional(__listOf__integer).pipe(T.JsonName("scte27Pids")),
  Scte35Pid: S.optional(S.Number).pipe(T.JsonName("scte35Pid")),
  TimedMetadataPid: S.optional(S.Number).pipe(T.JsonName("timedMetadataPid")),
  VideoPid: S.optional(S.Number).pipe(T.JsonName("videoPid")),
  AribCaptionsPid: S.optional(S.Number).pipe(T.JsonName("aribCaptionsPid")),
  DvbTeletextPids: S.optional(__listOf__integer).pipe(
    T.JsonName("dvbTeletextPids"),
  ),
  EcmPid: S.optional(S.Number).pipe(T.JsonName("ecmPid")),
  Smpte2038Pid: S.optional(S.Number).pipe(T.JsonName("smpte2038Pid")),
}) {}
export class MultiplexProgramPipelineDetail extends S.Class<MultiplexProgramPipelineDetail>(
  "MultiplexProgramPipelineDetail",
)({
  ActiveChannelPipeline: S.optional(S.String).pipe(
    T.JsonName("activeChannelPipeline"),
  ),
  PipelineId: S.optional(S.String).pipe(T.JsonName("pipelineId")),
}) {}
export const __listOfMultiplexProgramPipelineDetail = S.Array(
  MultiplexProgramPipelineDetail,
);
export class DescribeMultiplexProgramResponse extends S.Class<DescribeMultiplexProgramResponse>(
  "DescribeMultiplexProgramResponse",
)({
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  MultiplexProgramSettings: S.optional(MultiplexProgramSettings).pipe(
    T.JsonName("multiplexProgramSettings"),
  ),
  PacketIdentifiersMap: S.optional(MultiplexProgramPacketIdentifiersMap).pipe(
    T.JsonName("packetIdentifiersMap"),
  ),
  PipelineDetails: S.optional(__listOfMultiplexProgramPipelineDetail).pipe(
    T.JsonName("pipelineDetails"),
  ),
  ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
}) {}
export class IpPool extends S.Class<IpPool>("IpPool")({
  Cidr: S.optional(S.String).pipe(T.JsonName("cidr")),
}) {}
export const __listOfIpPool = S.Array(IpPool);
export class Route extends S.Class<Route>("Route")({
  Cidr: S.optional(S.String).pipe(T.JsonName("cidr")),
  Gateway: S.optional(S.String).pipe(T.JsonName("gateway")),
}) {}
export const __listOfRoute = S.Array(Route);
export class DescribeNetworkResponse extends S.Class<DescribeNetworkResponse>(
  "DescribeNetworkResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AssociatedClusterIds: S.optional(__listOf__string).pipe(
    T.JsonName("associatedClusterIds"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  IpPools: S.optional(__listOfIpPool).pipe(T.JsonName("ipPools")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Routes: S.optional(__listOfRoute).pipe(T.JsonName("routes")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class SdiSourceMapping extends S.Class<SdiSourceMapping>(
  "SdiSourceMapping",
)({
  CardNumber: S.optional(S.Number).pipe(T.JsonName("cardNumber")),
  ChannelNumber: S.optional(S.Number).pipe(T.JsonName("channelNumber")),
  SdiSource: S.optional(S.String).pipe(T.JsonName("sdiSource")),
}) {}
export const SdiSourceMappings = S.Array(SdiSourceMapping);
export class DescribeNodeResponse extends S.Class<DescribeNodeResponse>(
  "DescribeNodeResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelPlacementGroups: S.optional(__listOf__string).pipe(
    T.JsonName("channelPlacementGroups"),
  ),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  ConnectionState: S.optional(S.String).pipe(T.JsonName("connectionState")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
    T.JsonName("nodeInterfaceMappings"),
  ),
  Role: S.optional(S.String).pipe(T.JsonName("role")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  SdiSourceMappings: S.optional(SdiSourceMappings).pipe(
    T.JsonName("sdiSourceMappings"),
  ),
}) {}
export class ReservationResourceSpecification extends S.Class<ReservationResourceSpecification>(
  "ReservationResourceSpecification",
)({
  ChannelClass: S.optional(S.String).pipe(T.JsonName("channelClass")),
  Codec: S.optional(S.String).pipe(T.JsonName("codec")),
  MaximumBitrate: S.optional(S.String).pipe(T.JsonName("maximumBitrate")),
  MaximumFramerate: S.optional(S.String).pipe(T.JsonName("maximumFramerate")),
  Resolution: S.optional(S.String).pipe(T.JsonName("resolution")),
  ResourceType: S.optional(S.String).pipe(T.JsonName("resourceType")),
  SpecialFeature: S.optional(S.String).pipe(T.JsonName("specialFeature")),
  VideoQuality: S.optional(S.String).pipe(T.JsonName("videoQuality")),
}) {}
export class DescribeOfferingResponse extends S.Class<DescribeOfferingResponse>(
  "DescribeOfferingResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CurrencyCode: S.optional(S.String).pipe(T.JsonName("currencyCode")),
  Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
  DurationUnits: S.optional(S.String).pipe(T.JsonName("durationUnits")),
  FixedPrice: S.optional(S.Number).pipe(T.JsonName("fixedPrice")),
  OfferingDescription: S.optional(S.String).pipe(
    T.JsonName("offeringDescription"),
  ),
  OfferingId: S.optional(S.String).pipe(T.JsonName("offeringId")),
  OfferingType: S.optional(S.String).pipe(T.JsonName("offeringType")),
  Region: S.optional(S.String).pipe(T.JsonName("region")),
  ResourceSpecification: S.optional(ReservationResourceSpecification).pipe(
    T.JsonName("resourceSpecification"),
  ),
  UsagePrice: S.optional(S.Number).pipe(T.JsonName("usagePrice")),
}) {}
export class DescribeReservationResponse extends S.Class<DescribeReservationResponse>(
  "DescribeReservationResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Count: S.optional(S.Number).pipe(T.JsonName("count")),
  CurrencyCode: S.optional(S.String).pipe(T.JsonName("currencyCode")),
  Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
  DurationUnits: S.optional(S.String).pipe(T.JsonName("durationUnits")),
  End: S.optional(S.String).pipe(T.JsonName("end")),
  FixedPrice: S.optional(S.Number).pipe(T.JsonName("fixedPrice")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  OfferingDescription: S.optional(S.String).pipe(
    T.JsonName("offeringDescription"),
  ),
  OfferingId: S.optional(S.String).pipe(T.JsonName("offeringId")),
  OfferingType: S.optional(S.String).pipe(T.JsonName("offeringType")),
  Region: S.optional(S.String).pipe(T.JsonName("region")),
  RenewalSettings: S.optional(RenewalSettings).pipe(
    T.JsonName("renewalSettings"),
  ),
  ReservationId: S.optional(S.String).pipe(T.JsonName("reservationId")),
  ResourceSpecification: S.optional(ReservationResourceSpecification).pipe(
    T.JsonName("resourceSpecification"),
  ),
  Start: S.optional(S.String).pipe(T.JsonName("start")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  UsagePrice: S.optional(S.Number).pipe(T.JsonName("usagePrice")),
}) {}
export class HlsId3SegmentTaggingScheduleActionSettings extends S.Class<HlsId3SegmentTaggingScheduleActionSettings>(
  "HlsId3SegmentTaggingScheduleActionSettings",
)({
  Tag: S.optional(S.String).pipe(T.JsonName("tag")),
  Id3: S.optional(S.String).pipe(T.JsonName("id3")),
}) {}
export class HlsTimedMetadataScheduleActionSettings extends S.Class<HlsTimedMetadataScheduleActionSettings>(
  "HlsTimedMetadataScheduleActionSettings",
)({ Id3: S.String.pipe(T.JsonName("id3")) }) {}
export class StartTimecode extends S.Class<StartTimecode>("StartTimecode")({
  Timecode: S.optional(S.String).pipe(T.JsonName("timecode")),
}) {}
export class StopTimecode extends S.Class<StopTimecode>("StopTimecode")({
  LastFrameClippingBehavior: S.optional(S.String).pipe(
    T.JsonName("lastFrameClippingBehavior"),
  ),
  Timecode: S.optional(S.String).pipe(T.JsonName("timecode")),
}) {}
export class InputClippingSettings extends S.Class<InputClippingSettings>(
  "InputClippingSettings",
)({
  InputTimecodeSource: S.String.pipe(T.JsonName("inputTimecodeSource")),
  StartTimecode: S.optional(StartTimecode).pipe(T.JsonName("startTimecode")),
  StopTimecode: S.optional(StopTimecode).pipe(T.JsonName("stopTimecode")),
}) {}
export class InputPrepareScheduleActionSettings extends S.Class<InputPrepareScheduleActionSettings>(
  "InputPrepareScheduleActionSettings",
)({
  InputAttachmentNameReference: S.optional(S.String).pipe(
    T.JsonName("inputAttachmentNameReference"),
  ),
  InputClippingSettings: S.optional(InputClippingSettings).pipe(
    T.JsonName("inputClippingSettings"),
  ),
  UrlPath: S.optional(__listOf__string).pipe(T.JsonName("urlPath")),
}) {}
export class InputSwitchScheduleActionSettings extends S.Class<InputSwitchScheduleActionSettings>(
  "InputSwitchScheduleActionSettings",
)({
  InputAttachmentNameReference: S.String.pipe(
    T.JsonName("inputAttachmentNameReference"),
  ),
  InputClippingSettings: S.optional(InputClippingSettings).pipe(
    T.JsonName("inputClippingSettings"),
  ),
  UrlPath: S.optional(__listOf__string).pipe(T.JsonName("urlPath")),
}) {}
export class MotionGraphicsActivateScheduleActionSettings extends S.Class<MotionGraphicsActivateScheduleActionSettings>(
  "MotionGraphicsActivateScheduleActionSettings",
)({
  Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
  PasswordParam: S.optional(S.String).pipe(T.JsonName("passwordParam")),
  Url: S.optional(S.String).pipe(T.JsonName("url")),
  Username: S.optional(S.String).pipe(T.JsonName("username")),
}) {}
export class MotionGraphicsDeactivateScheduleActionSettings extends S.Class<MotionGraphicsDeactivateScheduleActionSettings>(
  "MotionGraphicsDeactivateScheduleActionSettings",
)({}) {}
export class PipelinePauseStateSettings extends S.Class<PipelinePauseStateSettings>(
  "PipelinePauseStateSettings",
)({ PipelineId: S.String.pipe(T.JsonName("pipelineId")) }) {}
export const __listOfPipelinePauseStateSettings = S.Array(
  PipelinePauseStateSettings,
);
export class PauseStateScheduleActionSettings extends S.Class<PauseStateScheduleActionSettings>(
  "PauseStateScheduleActionSettings",
)({
  Pipelines: S.optional(__listOfPipelinePauseStateSettings).pipe(
    T.JsonName("pipelines"),
  ),
}) {}
export class Scte35InputScheduleActionSettings extends S.Class<Scte35InputScheduleActionSettings>(
  "Scte35InputScheduleActionSettings",
)({
  InputAttachmentNameReference: S.optional(S.String).pipe(
    T.JsonName("inputAttachmentNameReference"),
  ),
  Mode: S.String.pipe(T.JsonName("mode")),
}) {}
export class Scte35ReturnToNetworkScheduleActionSettings extends S.Class<Scte35ReturnToNetworkScheduleActionSettings>(
  "Scte35ReturnToNetworkScheduleActionSettings",
)({ SpliceEventId: S.Number.pipe(T.JsonName("spliceEventId")) }) {}
export class Scte35SpliceInsertScheduleActionSettings extends S.Class<Scte35SpliceInsertScheduleActionSettings>(
  "Scte35SpliceInsertScheduleActionSettings",
)({
  Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
  SpliceEventId: S.Number.pipe(T.JsonName("spliceEventId")),
}) {}
export class Scte35DeliveryRestrictions extends S.Class<Scte35DeliveryRestrictions>(
  "Scte35DeliveryRestrictions",
)({
  ArchiveAllowedFlag: S.String.pipe(T.JsonName("archiveAllowedFlag")),
  DeviceRestrictions: S.String.pipe(T.JsonName("deviceRestrictions")),
  NoRegionalBlackoutFlag: S.String.pipe(T.JsonName("noRegionalBlackoutFlag")),
  WebDeliveryAllowedFlag: S.String.pipe(T.JsonName("webDeliveryAllowedFlag")),
}) {}
export class Scte35SegmentationDescriptor extends S.Class<Scte35SegmentationDescriptor>(
  "Scte35SegmentationDescriptor",
)({
  DeliveryRestrictions: S.optional(Scte35DeliveryRestrictions).pipe(
    T.JsonName("deliveryRestrictions"),
  ),
  SegmentNum: S.optional(S.Number).pipe(T.JsonName("segmentNum")),
  SegmentationCancelIndicator: S.String.pipe(
    T.JsonName("segmentationCancelIndicator"),
  ),
  SegmentationDuration: S.optional(S.Number).pipe(
    T.JsonName("segmentationDuration"),
  ),
  SegmentationEventId: S.Number.pipe(T.JsonName("segmentationEventId")),
  SegmentationTypeId: S.optional(S.Number).pipe(
    T.JsonName("segmentationTypeId"),
  ),
  SegmentationUpid: S.optional(S.String).pipe(T.JsonName("segmentationUpid")),
  SegmentationUpidType: S.optional(S.Number).pipe(
    T.JsonName("segmentationUpidType"),
  ),
  SegmentsExpected: S.optional(S.Number).pipe(T.JsonName("segmentsExpected")),
  SubSegmentNum: S.optional(S.Number).pipe(T.JsonName("subSegmentNum")),
  SubSegmentsExpected: S.optional(S.Number).pipe(
    T.JsonName("subSegmentsExpected"),
  ),
}) {}
export class Scte35DescriptorSettings extends S.Class<Scte35DescriptorSettings>(
  "Scte35DescriptorSettings",
)({
  SegmentationDescriptorScte35DescriptorSettings:
    Scte35SegmentationDescriptor.pipe(
      T.JsonName("segmentationDescriptorScte35DescriptorSettings"),
    ),
}) {}
export class Scte35Descriptor extends S.Class<Scte35Descriptor>(
  "Scte35Descriptor",
)({
  Scte35DescriptorSettings: Scte35DescriptorSettings.pipe(
    T.JsonName("scte35DescriptorSettings"),
  ),
}) {}
export const __listOfScte35Descriptor = S.Array(Scte35Descriptor);
export class Scte35TimeSignalScheduleActionSettings extends S.Class<Scte35TimeSignalScheduleActionSettings>(
  "Scte35TimeSignalScheduleActionSettings",
)({
  Scte35Descriptors: __listOfScte35Descriptor.pipe(
    T.JsonName("scte35Descriptors"),
  ),
}) {}
export class StaticImageActivateScheduleActionSettings extends S.Class<StaticImageActivateScheduleActionSettings>(
  "StaticImageActivateScheduleActionSettings",
)({
  Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
  FadeIn: S.optional(S.Number).pipe(T.JsonName("fadeIn")),
  FadeOut: S.optional(S.Number).pipe(T.JsonName("fadeOut")),
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  Image: InputLocation.pipe(T.JsonName("image")),
  ImageX: S.optional(S.Number).pipe(T.JsonName("imageX")),
  ImageY: S.optional(S.Number).pipe(T.JsonName("imageY")),
  Layer: S.optional(S.Number).pipe(T.JsonName("layer")),
  Opacity: S.optional(S.Number).pipe(T.JsonName("opacity")),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
}) {}
export class StaticImageDeactivateScheduleActionSettings extends S.Class<StaticImageDeactivateScheduleActionSettings>(
  "StaticImageDeactivateScheduleActionSettings",
)({
  FadeOut: S.optional(S.Number).pipe(T.JsonName("fadeOut")),
  Layer: S.optional(S.Number).pipe(T.JsonName("layer")),
}) {}
export class StaticImageOutputActivateScheduleActionSettings extends S.Class<StaticImageOutputActivateScheduleActionSettings>(
  "StaticImageOutputActivateScheduleActionSettings",
)({
  Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
  FadeIn: S.optional(S.Number).pipe(T.JsonName("fadeIn")),
  FadeOut: S.optional(S.Number).pipe(T.JsonName("fadeOut")),
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  Image: InputLocation.pipe(T.JsonName("image")),
  ImageX: S.optional(S.Number).pipe(T.JsonName("imageX")),
  ImageY: S.optional(S.Number).pipe(T.JsonName("imageY")),
  Layer: S.optional(S.Number).pipe(T.JsonName("layer")),
  Opacity: S.optional(S.Number).pipe(T.JsonName("opacity")),
  OutputNames: __listOf__string.pipe(T.JsonName("outputNames")),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
}) {}
export class StaticImageOutputDeactivateScheduleActionSettings extends S.Class<StaticImageOutputDeactivateScheduleActionSettings>(
  "StaticImageOutputDeactivateScheduleActionSettings",
)({
  FadeOut: S.optional(S.Number).pipe(T.JsonName("fadeOut")),
  Layer: S.optional(S.Number).pipe(T.JsonName("layer")),
  OutputNames: __listOf__string.pipe(T.JsonName("outputNames")),
}) {}
export class Id3SegmentTaggingScheduleActionSettings extends S.Class<Id3SegmentTaggingScheduleActionSettings>(
  "Id3SegmentTaggingScheduleActionSettings",
)({
  Id3: S.optional(S.String).pipe(T.JsonName("id3")),
  Tag: S.optional(S.String).pipe(T.JsonName("tag")),
}) {}
export class TimedMetadataScheduleActionSettings extends S.Class<TimedMetadataScheduleActionSettings>(
  "TimedMetadataScheduleActionSettings",
)({ Id3: S.String.pipe(T.JsonName("id3")) }) {}
export class ScheduleActionSettings extends S.Class<ScheduleActionSettings>(
  "ScheduleActionSettings",
)({
  HlsId3SegmentTaggingSettings: S.optional(
    HlsId3SegmentTaggingScheduleActionSettings,
  ).pipe(T.JsonName("hlsId3SegmentTaggingSettings")),
  HlsTimedMetadataSettings: S.optional(
    HlsTimedMetadataScheduleActionSettings,
  ).pipe(T.JsonName("hlsTimedMetadataSettings")),
  InputPrepareSettings: S.optional(InputPrepareScheduleActionSettings).pipe(
    T.JsonName("inputPrepareSettings"),
  ),
  InputSwitchSettings: S.optional(InputSwitchScheduleActionSettings).pipe(
    T.JsonName("inputSwitchSettings"),
  ),
  MotionGraphicsImageActivateSettings: S.optional(
    MotionGraphicsActivateScheduleActionSettings,
  ).pipe(T.JsonName("motionGraphicsImageActivateSettings")),
  MotionGraphicsImageDeactivateSettings: S.optional(
    MotionGraphicsDeactivateScheduleActionSettings,
  ).pipe(T.JsonName("motionGraphicsImageDeactivateSettings")),
  PauseStateSettings: S.optional(PauseStateScheduleActionSettings).pipe(
    T.JsonName("pauseStateSettings"),
  ),
  Scte35InputSettings: S.optional(Scte35InputScheduleActionSettings).pipe(
    T.JsonName("scte35InputSettings"),
  ),
  Scte35ReturnToNetworkSettings: S.optional(
    Scte35ReturnToNetworkScheduleActionSettings,
  ).pipe(T.JsonName("scte35ReturnToNetworkSettings")),
  Scte35SpliceInsertSettings: S.optional(
    Scte35SpliceInsertScheduleActionSettings,
  ).pipe(T.JsonName("scte35SpliceInsertSettings")),
  Scte35TimeSignalSettings: S.optional(
    Scte35TimeSignalScheduleActionSettings,
  ).pipe(T.JsonName("scte35TimeSignalSettings")),
  StaticImageActivateSettings: S.optional(
    StaticImageActivateScheduleActionSettings,
  ).pipe(T.JsonName("staticImageActivateSettings")),
  StaticImageDeactivateSettings: S.optional(
    StaticImageDeactivateScheduleActionSettings,
  ).pipe(T.JsonName("staticImageDeactivateSettings")),
  StaticImageOutputActivateSettings: S.optional(
    StaticImageOutputActivateScheduleActionSettings,
  ).pipe(T.JsonName("staticImageOutputActivateSettings")),
  StaticImageOutputDeactivateSettings: S.optional(
    StaticImageOutputDeactivateScheduleActionSettings,
  ).pipe(T.JsonName("staticImageOutputDeactivateSettings")),
  Id3SegmentTaggingSettings: S.optional(
    Id3SegmentTaggingScheduleActionSettings,
  ).pipe(T.JsonName("id3SegmentTaggingSettings")),
  TimedMetadataSettings: S.optional(TimedMetadataScheduleActionSettings).pipe(
    T.JsonName("timedMetadataSettings"),
  ),
}) {}
export class FixedModeScheduleActionStartSettings extends S.Class<FixedModeScheduleActionStartSettings>(
  "FixedModeScheduleActionStartSettings",
)({ Time: S.String.pipe(T.JsonName("time")) }) {}
export class FollowModeScheduleActionStartSettings extends S.Class<FollowModeScheduleActionStartSettings>(
  "FollowModeScheduleActionStartSettings",
)({
  FollowPoint: S.String.pipe(T.JsonName("followPoint")),
  ReferenceActionName: S.String.pipe(T.JsonName("referenceActionName")),
}) {}
export class ImmediateModeScheduleActionStartSettings extends S.Class<ImmediateModeScheduleActionStartSettings>(
  "ImmediateModeScheduleActionStartSettings",
)({}) {}
export class ScheduleActionStartSettings extends S.Class<ScheduleActionStartSettings>(
  "ScheduleActionStartSettings",
)({
  FixedModeScheduleActionStartSettings: S.optional(
    FixedModeScheduleActionStartSettings,
  ).pipe(T.JsonName("fixedModeScheduleActionStartSettings")),
  FollowModeScheduleActionStartSettings: S.optional(
    FollowModeScheduleActionStartSettings,
  ).pipe(T.JsonName("followModeScheduleActionStartSettings")),
  ImmediateModeScheduleActionStartSettings: S.optional(
    ImmediateModeScheduleActionStartSettings,
  ).pipe(T.JsonName("immediateModeScheduleActionStartSettings")),
}) {}
export class ScheduleAction extends S.Class<ScheduleAction>("ScheduleAction")({
  ActionName: S.String.pipe(T.JsonName("actionName")),
  ScheduleActionSettings: ScheduleActionSettings.pipe(
    T.JsonName("scheduleActionSettings"),
  ),
  ScheduleActionStartSettings: ScheduleActionStartSettings.pipe(
    T.JsonName("scheduleActionStartSettings"),
  ),
}) {}
export const __listOfScheduleAction = S.Array(ScheduleAction);
export class DescribeScheduleResponse extends S.Class<DescribeScheduleResponse>(
  "DescribeScheduleResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  ScheduleActions: S.optional(__listOfScheduleAction).pipe(
    T.JsonName("scheduleActions"),
  ),
}) {}
export class DescribeSdiSourceResponse extends S.Class<DescribeSdiSourceResponse>(
  "DescribeSdiSourceResponse",
)({ SdiSource: S.optional(SdiSource).pipe(T.JsonName("sdiSource")) }) {}
export class GetCloudWatchAlarmTemplateResponse extends S.Class<GetCloudWatchAlarmTemplateResponse>(
  "GetCloudWatchAlarmTemplateResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ComparisonOperator: S.optional(S.String).pipe(
    T.JsonName("comparisonOperator"),
  ),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  DatapointsToAlarm: S.optional(S.Number).pipe(T.JsonName("datapointsToAlarm")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EvaluationPeriods: S.optional(S.Number).pipe(T.JsonName("evaluationPeriods")),
  GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MetricName: S.optional(S.String).pipe(T.JsonName("metricName")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Period: S.optional(S.Number).pipe(T.JsonName("period")),
  Statistic: S.optional(S.String).pipe(T.JsonName("statistic")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  TargetResourceType: S.optional(S.String).pipe(
    T.JsonName("targetResourceType"),
  ),
  Threshold: S.optional(S.Number).pipe(T.JsonName("threshold")),
  TreatMissingData: S.optional(S.String).pipe(T.JsonName("treatMissingData")),
}) {}
export class GetCloudWatchAlarmTemplateGroupResponse extends S.Class<GetCloudWatchAlarmTemplateGroupResponse>(
  "GetCloudWatchAlarmTemplateGroupResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class GetEventBridgeRuleTemplateResponse extends S.Class<GetEventBridgeRuleTemplateResponse>(
  "GetEventBridgeRuleTemplateResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EventTargets: S.optional(__listOfEventBridgeRuleTemplateTarget).pipe(
    T.JsonName("eventTargets"),
  ),
  EventType: S.optional(S.String).pipe(T.JsonName("eventType")),
  GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class GetEventBridgeRuleTemplateGroupResponse extends S.Class<GetEventBridgeRuleTemplateGroupResponse>(
  "GetEventBridgeRuleTemplateGroupResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class MediaResourceNeighbor extends S.Class<MediaResourceNeighbor>(
  "MediaResourceNeighbor",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
}) {}
export const __listOfMediaResourceNeighbor = S.Array(MediaResourceNeighbor);
export class MediaResource extends S.Class<MediaResource>("MediaResource")({
  Destinations: S.optional(__listOfMediaResourceNeighbor).pipe(
    T.JsonName("destinations"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Sources: S.optional(__listOfMediaResourceNeighbor).pipe(
    T.JsonName("sources"),
  ),
}) {}
export const FailedMediaResourceMap = S.Record({
  key: S.String,
  value: MediaResource,
});
export class SuccessfulMonitorDeployment extends S.Class<SuccessfulMonitorDeployment>(
  "SuccessfulMonitorDeployment",
)({
  DetailsUri: S.String.pipe(T.JsonName("detailsUri")),
  Status: S.String.pipe(T.JsonName("status")),
}) {}
export const MediaResourceMap = S.Record({
  key: S.String,
  value: MediaResource,
});
export class MonitorDeployment extends S.Class<MonitorDeployment>(
  "MonitorDeployment",
)({
  DetailsUri: S.optional(S.String).pipe(T.JsonName("detailsUri")),
  ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
  Status: S.String.pipe(T.JsonName("status")),
}) {}
export class GetSignalMapResponse extends S.Class<GetSignalMapResponse>(
  "GetSignalMapResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CloudWatchAlarmTemplateGroupIds: S.optional(
    __listOf__stringMin7Max11PatternAws097,
  ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIds")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DiscoveryEntryPointArn: S.optional(S.String).pipe(
    T.JsonName("discoveryEntryPointArn"),
  ),
  ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
  EventBridgeRuleTemplateGroupIds: S.optional(
    __listOf__stringMin7Max11PatternAws097,
  ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIds")),
  FailedMediaResourceMap: S.optional(FailedMediaResourceMap).pipe(
    T.JsonName("failedMediaResourceMap"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  LastDiscoveredAt: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("lastDiscoveredAt")),
  LastSuccessfulMonitorDeployment: S.optional(SuccessfulMonitorDeployment).pipe(
    T.JsonName("lastSuccessfulMonitorDeployment"),
  ),
  MediaResourceMap: S.optional(MediaResourceMap).pipe(
    T.JsonName("mediaResourceMap"),
  ),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  MonitorChangesPendingDeployment: S.optional(S.Boolean).pipe(
    T.JsonName("monitorChangesPendingDeployment"),
  ),
  MonitorDeployment: S.optional(MonitorDeployment).pipe(
    T.JsonName("monitorDeployment"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class ListInputsResponse extends S.Class<ListInputsResponse>(
  "ListInputsResponse",
)({
  Inputs: S.optional(__listOfInput).pipe(T.JsonName("inputs")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags).pipe(T.JsonName("tags")) }) {}
export class ListVersionsResponse extends S.Class<ListVersionsResponse>(
  "ListVersionsResponse",
)({
  Versions: S.optional(__listOfChannelEngineVersionResponse).pipe(
    T.JsonName("versions"),
  ),
}) {}
export class PurchaseOfferingRequest extends S.Class<PurchaseOfferingRequest>(
  "PurchaseOfferingRequest",
)(
  {
    Count: S.Number.pipe(T.JsonName("count")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    OfferingId: S.String.pipe(T.HttpLabel("OfferingId")),
    RenewalSettings: S.optional(RenewalSettings).pipe(
      T.JsonName("renewalSettings"),
    ),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
    Start: S.optional(S.String).pipe(T.JsonName("start")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/offerings/{OfferingId}/purchase" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RestartChannelPipelinesResponse extends S.Class<RestartChannelPipelinesResponse>(
  "RestartChannelPipelinesResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CdiInputSpecification: S.optional(CdiInputSpecification).pipe(
    T.JsonName("cdiInputSpecification"),
  ),
  ChannelClass: S.optional(S.String).pipe(T.JsonName("channelClass")),
  Destinations: S.optional(__listOfOutputDestination).pipe(
    T.JsonName("destinations"),
  ),
  EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
    T.JsonName("egressEndpoints"),
  ),
  EncoderSettings: S.optional(EncoderSettings).pipe(
    T.JsonName("encoderSettings"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InputAttachments: S.optional(__listOfInputAttachment).pipe(
    T.JsonName("inputAttachments"),
  ),
  InputSpecification: S.optional(InputSpecification).pipe(
    T.JsonName("inputSpecification"),
  ),
  LogLevel: S.optional(S.String).pipe(T.JsonName("logLevel")),
  Maintenance: S.optional(MaintenanceStatus).pipe(T.JsonName("maintenance")),
  MaintenanceStatus: S.optional(S.String).pipe(T.JsonName("maintenanceStatus")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelineDetails: S.optional(__listOfPipelineDetail).pipe(
    T.JsonName("pipelineDetails"),
  ),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Vpc: S.optional(VpcOutputSettingsDescription).pipe(T.JsonName("vpc")),
  AnywhereSettings: S.optional(DescribeAnywhereSettings).pipe(
    T.JsonName("anywhereSettings"),
  ),
  ChannelEngineVersion: S.optional(ChannelEngineVersionResponse).pipe(
    T.JsonName("channelEngineVersion"),
  ),
  LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings).pipe(
    T.JsonName("linkedChannelSettings"),
  ),
}) {}
export class StartChannelResponse extends S.Class<StartChannelResponse>(
  "StartChannelResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CdiInputSpecification: S.optional(CdiInputSpecification).pipe(
    T.JsonName("cdiInputSpecification"),
  ),
  ChannelClass: S.optional(S.String).pipe(T.JsonName("channelClass")),
  Destinations: S.optional(__listOfOutputDestination).pipe(
    T.JsonName("destinations"),
  ),
  EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
    T.JsonName("egressEndpoints"),
  ),
  EncoderSettings: S.optional(EncoderSettings).pipe(
    T.JsonName("encoderSettings"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InputAttachments: S.optional(__listOfInputAttachment).pipe(
    T.JsonName("inputAttachments"),
  ),
  InputSpecification: S.optional(InputSpecification).pipe(
    T.JsonName("inputSpecification"),
  ),
  LogLevel: S.optional(S.String).pipe(T.JsonName("logLevel")),
  Maintenance: S.optional(MaintenanceStatus).pipe(T.JsonName("maintenance")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelineDetails: S.optional(__listOfPipelineDetail).pipe(
    T.JsonName("pipelineDetails"),
  ),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Vpc: S.optional(VpcOutputSettingsDescription).pipe(T.JsonName("vpc")),
  AnywhereSettings: S.optional(DescribeAnywhereSettings).pipe(
    T.JsonName("anywhereSettings"),
  ),
  ChannelEngineVersion: S.optional(ChannelEngineVersionResponse).pipe(
    T.JsonName("channelEngineVersion"),
  ),
  LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings).pipe(
    T.JsonName("linkedChannelSettings"),
  ),
}) {}
export class StartDeleteMonitorDeploymentResponse extends S.Class<StartDeleteMonitorDeploymentResponse>(
  "StartDeleteMonitorDeploymentResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CloudWatchAlarmTemplateGroupIds: S.optional(
    __listOf__stringMin7Max11PatternAws097,
  ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIds")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DiscoveryEntryPointArn: S.optional(S.String).pipe(
    T.JsonName("discoveryEntryPointArn"),
  ),
  ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
  EventBridgeRuleTemplateGroupIds: S.optional(
    __listOf__stringMin7Max11PatternAws097,
  ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIds")),
  FailedMediaResourceMap: S.optional(FailedMediaResourceMap).pipe(
    T.JsonName("failedMediaResourceMap"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  LastDiscoveredAt: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("lastDiscoveredAt")),
  LastSuccessfulMonitorDeployment: S.optional(SuccessfulMonitorDeployment).pipe(
    T.JsonName("lastSuccessfulMonitorDeployment"),
  ),
  MediaResourceMap: S.optional(MediaResourceMap).pipe(
    T.JsonName("mediaResourceMap"),
  ),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  MonitorChangesPendingDeployment: S.optional(S.Boolean).pipe(
    T.JsonName("monitorChangesPendingDeployment"),
  ),
  MonitorDeployment: S.optional(MonitorDeployment).pipe(
    T.JsonName("monitorDeployment"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class StartMonitorDeploymentResponse extends S.Class<StartMonitorDeploymentResponse>(
  "StartMonitorDeploymentResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CloudWatchAlarmTemplateGroupIds: S.optional(
    __listOf__stringMin7Max11PatternAws097,
  ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIds")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DiscoveryEntryPointArn: S.optional(S.String).pipe(
    T.JsonName("discoveryEntryPointArn"),
  ),
  ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
  EventBridgeRuleTemplateGroupIds: S.optional(
    __listOf__stringMin7Max11PatternAws097,
  ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIds")),
  FailedMediaResourceMap: S.optional(FailedMediaResourceMap).pipe(
    T.JsonName("failedMediaResourceMap"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  LastDiscoveredAt: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("lastDiscoveredAt")),
  LastSuccessfulMonitorDeployment: S.optional(SuccessfulMonitorDeployment).pipe(
    T.JsonName("lastSuccessfulMonitorDeployment"),
  ),
  MediaResourceMap: S.optional(MediaResourceMap).pipe(
    T.JsonName("mediaResourceMap"),
  ),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  MonitorChangesPendingDeployment: S.optional(S.Boolean).pipe(
    T.JsonName("monitorChangesPendingDeployment"),
  ),
  MonitorDeployment: S.optional(MonitorDeployment).pipe(
    T.JsonName("monitorDeployment"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class StartMultiplexResponse extends S.Class<StartMultiplexResponse>(
  "StartMultiplexResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AvailabilityZones: S.optional(__listOf__string).pipe(
    T.JsonName("availabilityZones"),
  ),
  Destinations: S.optional(__listOfMultiplexOutputDestination).pipe(
    T.JsonName("destinations"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MultiplexSettings: S.optional(MultiplexSettings).pipe(
    T.JsonName("multiplexSettings"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  ProgramCount: S.optional(S.Number).pipe(T.JsonName("programCount")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class StartUpdateSignalMapResponse extends S.Class<StartUpdateSignalMapResponse>(
  "StartUpdateSignalMapResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CloudWatchAlarmTemplateGroupIds: S.optional(
    __listOf__stringMin7Max11PatternAws097,
  ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIds")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DiscoveryEntryPointArn: S.optional(S.String).pipe(
    T.JsonName("discoveryEntryPointArn"),
  ),
  ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
  EventBridgeRuleTemplateGroupIds: S.optional(
    __listOf__stringMin7Max11PatternAws097,
  ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIds")),
  FailedMediaResourceMap: S.optional(FailedMediaResourceMap).pipe(
    T.JsonName("failedMediaResourceMap"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  LastDiscoveredAt: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("lastDiscoveredAt")),
  LastSuccessfulMonitorDeployment: S.optional(SuccessfulMonitorDeployment).pipe(
    T.JsonName("lastSuccessfulMonitorDeployment"),
  ),
  MediaResourceMap: S.optional(MediaResourceMap).pipe(
    T.JsonName("mediaResourceMap"),
  ),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  MonitorChangesPendingDeployment: S.optional(S.Boolean).pipe(
    T.JsonName("monitorChangesPendingDeployment"),
  ),
  MonitorDeployment: S.optional(MonitorDeployment).pipe(
    T.JsonName("monitorDeployment"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class StopChannelResponse extends S.Class<StopChannelResponse>(
  "StopChannelResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CdiInputSpecification: S.optional(CdiInputSpecification).pipe(
    T.JsonName("cdiInputSpecification"),
  ),
  ChannelClass: S.optional(S.String).pipe(T.JsonName("channelClass")),
  Destinations: S.optional(__listOfOutputDestination).pipe(
    T.JsonName("destinations"),
  ),
  EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
    T.JsonName("egressEndpoints"),
  ),
  EncoderSettings: S.optional(EncoderSettings).pipe(
    T.JsonName("encoderSettings"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InputAttachments: S.optional(__listOfInputAttachment).pipe(
    T.JsonName("inputAttachments"),
  ),
  InputSpecification: S.optional(InputSpecification).pipe(
    T.JsonName("inputSpecification"),
  ),
  LogLevel: S.optional(S.String).pipe(T.JsonName("logLevel")),
  Maintenance: S.optional(MaintenanceStatus).pipe(T.JsonName("maintenance")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelineDetails: S.optional(__listOfPipelineDetail).pipe(
    T.JsonName("pipelineDetails"),
  ),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Vpc: S.optional(VpcOutputSettingsDescription).pipe(T.JsonName("vpc")),
  AnywhereSettings: S.optional(DescribeAnywhereSettings).pipe(
    T.JsonName("anywhereSettings"),
  ),
  ChannelEngineVersion: S.optional(ChannelEngineVersionResponse).pipe(
    T.JsonName("channelEngineVersion"),
  ),
  LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings).pipe(
    T.JsonName("linkedChannelSettings"),
  ),
}) {}
export class StopMultiplexResponse extends S.Class<StopMultiplexResponse>(
  "StopMultiplexResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AvailabilityZones: S.optional(__listOf__string).pipe(
    T.JsonName("availabilityZones"),
  ),
  Destinations: S.optional(__listOfMultiplexOutputDestination).pipe(
    T.JsonName("destinations"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MultiplexSettings: S.optional(MultiplexSettings).pipe(
    T.JsonName("multiplexSettings"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  ProgramCount: S.optional(S.Number).pipe(T.JsonName("programCount")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class UpdateAccountConfigurationResponse extends S.Class<UpdateAccountConfigurationResponse>(
  "UpdateAccountConfigurationResponse",
)({
  AccountConfiguration: S.optional(AccountConfiguration).pipe(
    T.JsonName("accountConfiguration"),
  ),
}) {}
export class FollowerChannelSettings extends S.Class<FollowerChannelSettings>(
  "FollowerChannelSettings",
)({
  LinkedChannelType: S.optional(S.String).pipe(T.JsonName("linkedChannelType")),
  PrimaryChannelArn: S.optional(S.String).pipe(T.JsonName("primaryChannelArn")),
}) {}
export class PrimaryChannelSettings extends S.Class<PrimaryChannelSettings>(
  "PrimaryChannelSettings",
)({
  LinkedChannelType: S.optional(S.String).pipe(T.JsonName("linkedChannelType")),
}) {}
export class LinkedChannelSettings extends S.Class<LinkedChannelSettings>(
  "LinkedChannelSettings",
)({
  FollowerChannelSettings: S.optional(FollowerChannelSettings).pipe(
    T.JsonName("followerChannelSettings"),
  ),
  PrimaryChannelSettings: S.optional(PrimaryChannelSettings).pipe(
    T.JsonName("primaryChannelSettings"),
  ),
}) {}
export class UpdateChannelRequest extends S.Class<UpdateChannelRequest>(
  "UpdateChannelRequest",
)(
  {
    CdiInputSpecification: S.optional(CdiInputSpecification).pipe(
      T.JsonName("cdiInputSpecification"),
    ),
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    EncoderSettings: S.optional(EncoderSettings).pipe(
      T.JsonName("encoderSettings"),
    ),
    InputAttachments: S.optional(__listOfInputAttachment).pipe(
      T.JsonName("inputAttachments"),
    ),
    InputSpecification: S.optional(InputSpecification).pipe(
      T.JsonName("inputSpecification"),
    ),
    LogLevel: S.optional(S.String).pipe(T.JsonName("logLevel")),
    Maintenance: S.optional(MaintenanceUpdateSettings).pipe(
      T.JsonName("maintenance"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    ChannelEngineVersion: S.optional(ChannelEngineVersionRequest).pipe(
      T.JsonName("channelEngineVersion"),
    ),
    DryRun: S.optional(S.Boolean).pipe(T.JsonName("dryRun")),
    AnywhereSettings: S.optional(AnywhereSettings).pipe(
      T.JsonName("anywhereSettings"),
    ),
    LinkedChannelSettings: S.optional(LinkedChannelSettings).pipe(
      T.JsonName("linkedChannelSettings"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prod/channels/{ChannelId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateChannelPlacementGroupResponse extends S.Class<UpdateChannelPlacementGroupResponse>(
  "UpdateChannelPlacementGroupResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Channels: S.optional(__listOf__string).pipe(T.JsonName("channels")),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class UpdateCloudWatchAlarmTemplateResponse extends S.Class<UpdateCloudWatchAlarmTemplateResponse>(
  "UpdateCloudWatchAlarmTemplateResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ComparisonOperator: S.optional(S.String).pipe(
    T.JsonName("comparisonOperator"),
  ),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  DatapointsToAlarm: S.optional(S.Number).pipe(T.JsonName("datapointsToAlarm")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EvaluationPeriods: S.optional(S.Number).pipe(T.JsonName("evaluationPeriods")),
  GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MetricName: S.optional(S.String).pipe(T.JsonName("metricName")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Period: S.optional(S.Number).pipe(T.JsonName("period")),
  Statistic: S.optional(S.String).pipe(T.JsonName("statistic")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  TargetResourceType: S.optional(S.String).pipe(
    T.JsonName("targetResourceType"),
  ),
  Threshold: S.optional(S.Number).pipe(T.JsonName("threshold")),
  TreatMissingData: S.optional(S.String).pipe(T.JsonName("treatMissingData")),
}) {}
export class UpdateCloudWatchAlarmTemplateGroupResponse extends S.Class<UpdateCloudWatchAlarmTemplateGroupResponse>(
  "UpdateCloudWatchAlarmTemplateGroupResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class UpdateEventBridgeRuleTemplateResponse extends S.Class<UpdateEventBridgeRuleTemplateResponse>(
  "UpdateEventBridgeRuleTemplateResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EventTargets: S.optional(__listOfEventBridgeRuleTemplateTarget).pipe(
    T.JsonName("eventTargets"),
  ),
  EventType: S.optional(S.String).pipe(T.JsonName("eventType")),
  GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class UpdateEventBridgeRuleTemplateGroupResponse extends S.Class<UpdateEventBridgeRuleTemplateGroupResponse>(
  "UpdateEventBridgeRuleTemplateGroupResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class InputWhitelistRule extends S.Class<InputWhitelistRule>(
  "InputWhitelistRule",
)({ Cidr: S.optional(S.String).pipe(T.JsonName("cidr")) }) {}
export const __listOfInputWhitelistRule = S.Array(InputWhitelistRule);
export class InputSecurityGroup extends S.Class<InputSecurityGroup>(
  "InputSecurityGroup",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Inputs: S.optional(__listOf__string).pipe(T.JsonName("inputs")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  WhitelistRules: S.optional(__listOfInputWhitelistRule).pipe(
    T.JsonName("whitelistRules"),
  ),
}) {}
export class UpdateInputSecurityGroupResponse extends S.Class<UpdateInputSecurityGroupResponse>(
  "UpdateInputSecurityGroupResponse",
)({
  SecurityGroup: S.optional(InputSecurityGroup).pipe(
    T.JsonName("securityGroup"),
  ),
}) {}
export class UpdateNetworkRequest extends S.Class<UpdateNetworkRequest>(
  "UpdateNetworkRequest",
)(
  {
    IpPools: S.optional(__listOfIpPoolUpdateRequest).pipe(
      T.JsonName("ipPools"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkId: S.String.pipe(T.HttpLabel("NetworkId")),
    Routes: S.optional(__listOfRouteUpdateRequest).pipe(T.JsonName("routes")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prod/networks/{NetworkId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNodeRequest extends S.Class<UpdateNodeRequest>(
  "UpdateNodeRequest",
)(
  {
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NodeId: S.String.pipe(T.HttpLabel("NodeId")),
    Role: S.optional(S.String).pipe(T.JsonName("role")),
    SdiSourceMappings: S.optional(SdiSourceMappingsUpdateRequest).pipe(
      T.JsonName("sdiSourceMappings"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prod/clusters/{ClusterId}/nodes/{NodeId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateNodeStateResponse extends S.Class<UpdateNodeStateResponse>(
  "UpdateNodeStateResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelPlacementGroups: S.optional(__listOf__string).pipe(
    T.JsonName("channelPlacementGroups"),
  ),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  ConnectionState: S.optional(S.String).pipe(T.JsonName("connectionState")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
    T.JsonName("nodeInterfaceMappings"),
  ),
  Role: S.optional(S.String).pipe(T.JsonName("role")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  SdiSourceMappings: S.optional(SdiSourceMappings).pipe(
    T.JsonName("sdiSourceMappings"),
  ),
}) {}
export class Reservation extends S.Class<Reservation>("Reservation")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Count: S.optional(S.Number).pipe(T.JsonName("count")),
  CurrencyCode: S.optional(S.String).pipe(T.JsonName("currencyCode")),
  Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
  DurationUnits: S.optional(S.String).pipe(T.JsonName("durationUnits")),
  End: S.optional(S.String).pipe(T.JsonName("end")),
  FixedPrice: S.optional(S.Number).pipe(T.JsonName("fixedPrice")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  OfferingDescription: S.optional(S.String).pipe(
    T.JsonName("offeringDescription"),
  ),
  OfferingId: S.optional(S.String).pipe(T.JsonName("offeringId")),
  OfferingType: S.optional(S.String).pipe(T.JsonName("offeringType")),
  Region: S.optional(S.String).pipe(T.JsonName("region")),
  RenewalSettings: S.optional(RenewalSettings).pipe(
    T.JsonName("renewalSettings"),
  ),
  ReservationId: S.optional(S.String).pipe(T.JsonName("reservationId")),
  ResourceSpecification: S.optional(ReservationResourceSpecification).pipe(
    T.JsonName("resourceSpecification"),
  ),
  Start: S.optional(S.String).pipe(T.JsonName("start")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  UsagePrice: S.optional(S.Number).pipe(T.JsonName("usagePrice")),
}) {}
export class UpdateReservationResponse extends S.Class<UpdateReservationResponse>(
  "UpdateReservationResponse",
)({ Reservation: S.optional(Reservation).pipe(T.JsonName("reservation")) }) {}
export class UpdateSdiSourceResponse extends S.Class<UpdateSdiSourceResponse>(
  "UpdateSdiSourceResponse",
)({ SdiSource: S.optional(SdiSource).pipe(T.JsonName("sdiSource")) }) {}
export class InterfaceMappingCreateRequest extends S.Class<InterfaceMappingCreateRequest>(
  "InterfaceMappingCreateRequest",
)({
  LogicalInterfaceName: S.optional(S.String).pipe(
    T.JsonName("logicalInterfaceName"),
  ),
  NetworkId: S.optional(S.String).pipe(T.JsonName("networkId")),
}) {}
export const __listOfInterfaceMappingCreateRequest = S.Array(
  InterfaceMappingCreateRequest,
);
export class InputRequestDestinationRoute extends S.Class<InputRequestDestinationRoute>(
  "InputRequestDestinationRoute",
)({
  Cidr: S.optional(S.String).pipe(T.JsonName("cidr")),
  Gateway: S.optional(S.String).pipe(T.JsonName("gateway")),
}) {}
export const __listOfInputRequestDestinationRoute = S.Array(
  InputRequestDestinationRoute,
);
export class MulticastSourceCreateRequest extends S.Class<MulticastSourceCreateRequest>(
  "MulticastSourceCreateRequest",
)({
  SourceIp: S.optional(S.String).pipe(T.JsonName("sourceIp")),
  Url: S.String.pipe(T.JsonName("url")),
}) {}
export const __listOfMulticastSourceCreateRequest = S.Array(
  MulticastSourceCreateRequest,
);
export class RouterDestinationSettings extends S.Class<RouterDestinationSettings>(
  "RouterDestinationSettings",
)({
  AvailabilityZoneName: S.String.pipe(T.JsonName("availabilityZoneName")),
}) {}
export const __listOfRouterDestinationSettings = S.Array(
  RouterDestinationSettings,
);
export class InterfaceMappingUpdateRequest extends S.Class<InterfaceMappingUpdateRequest>(
  "InterfaceMappingUpdateRequest",
)({
  LogicalInterfaceName: S.optional(S.String).pipe(
    T.JsonName("logicalInterfaceName"),
  ),
  NetworkId: S.optional(S.String).pipe(T.JsonName("networkId")),
}) {}
export const __listOfInterfaceMappingUpdateRequest = S.Array(
  InterfaceMappingUpdateRequest,
);
export class MulticastSourceUpdateRequest extends S.Class<MulticastSourceUpdateRequest>(
  "MulticastSourceUpdateRequest",
)({
  SourceIp: S.optional(S.String).pipe(T.JsonName("sourceIp")),
  Url: S.String.pipe(T.JsonName("url")),
}) {}
export const __listOfMulticastSourceUpdateRequest = S.Array(
  MulticastSourceUpdateRequest,
);
export class InputDeviceMediaConnectConfigurableSettings extends S.Class<InputDeviceMediaConnectConfigurableSettings>(
  "InputDeviceMediaConnectConfigurableSettings",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
  SourceName: S.optional(S.String).pipe(T.JsonName("sourceName")),
}) {}
export class InputDeviceConfigurableAudioChannelPairConfig extends S.Class<InputDeviceConfigurableAudioChannelPairConfig>(
  "InputDeviceConfigurableAudioChannelPairConfig",
)({
  Id: S.optional(S.Number).pipe(T.JsonName("id")),
  Profile: S.optional(S.String).pipe(T.JsonName("profile")),
}) {}
export const __listOfInputDeviceConfigurableAudioChannelPairConfig = S.Array(
  InputDeviceConfigurableAudioChannelPairConfig,
);
export class ClusterNetworkSettingsCreateRequest extends S.Class<ClusterNetworkSettingsCreateRequest>(
  "ClusterNetworkSettingsCreateRequest",
)({
  DefaultRoute: S.optional(S.String).pipe(T.JsonName("defaultRoute")),
  InterfaceMappings: S.optional(__listOfInterfaceMappingCreateRequest).pipe(
    T.JsonName("interfaceMappings"),
  ),
}) {}
export class InputDestinationRequest extends S.Class<InputDestinationRequest>(
  "InputDestinationRequest",
)({
  StreamName: S.optional(S.String).pipe(T.JsonName("streamName")),
  Network: S.optional(S.String).pipe(T.JsonName("network")),
  NetworkRoutes: S.optional(__listOfInputRequestDestinationRoute).pipe(
    T.JsonName("networkRoutes"),
  ),
  StaticIpAddress: S.optional(S.String).pipe(T.JsonName("staticIpAddress")),
}) {}
export const __listOfInputDestinationRequest = S.Array(InputDestinationRequest);
export class MulticastSettingsCreateRequest extends S.Class<MulticastSettingsCreateRequest>(
  "MulticastSettingsCreateRequest",
)({
  Sources: S.optional(__listOfMulticastSourceCreateRequest).pipe(
    T.JsonName("sources"),
  ),
}) {}
export class RouterSettings extends S.Class<RouterSettings>("RouterSettings")({
  Destinations: S.optional(__listOfRouterDestinationSettings).pipe(
    T.JsonName("destinations"),
  ),
  EncryptionType: S.optional(S.String).pipe(T.JsonName("encryptionType")),
  SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
}) {}
export class InputDeviceHdSettings extends S.Class<InputDeviceHdSettings>(
  "InputDeviceHdSettings",
)({
  ActiveInput: S.optional(S.String).pipe(T.JsonName("activeInput")),
  ConfiguredInput: S.optional(S.String).pipe(T.JsonName("configuredInput")),
  DeviceState: S.optional(S.String).pipe(T.JsonName("deviceState")),
  Framerate: S.optional(S.Number).pipe(T.JsonName("framerate")),
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
  ScanType: S.optional(S.String).pipe(T.JsonName("scanType")),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
  LatencyMs: S.optional(S.Number).pipe(T.JsonName("latencyMs")),
}) {}
export class InputDeviceNetworkSettings extends S.Class<InputDeviceNetworkSettings>(
  "InputDeviceNetworkSettings",
)({
  DnsAddresses: S.optional(__listOf__string).pipe(T.JsonName("dnsAddresses")),
  Gateway: S.optional(S.String).pipe(T.JsonName("gateway")),
  IpAddress: S.optional(S.String).pipe(T.JsonName("ipAddress")),
  IpScheme: S.optional(S.String).pipe(T.JsonName("ipScheme")),
  SubnetMask: S.optional(S.String).pipe(T.JsonName("subnetMask")),
}) {}
export class ChannelAlert extends S.Class<ChannelAlert>("ChannelAlert")({
  AlertType: S.optional(S.String).pipe(T.JsonName("alertType")),
  ClearedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("clearedTimestamp")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Message: S.optional(S.String).pipe(T.JsonName("message")),
  PipelineId: S.optional(S.String).pipe(T.JsonName("pipelineId")),
  SetTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("setTimestamp"),
  ),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export const __listOfChannelAlert = S.Array(ChannelAlert);
export class DescribeChannelPlacementGroupSummary extends S.Class<DescribeChannelPlacementGroupSummary>(
  "DescribeChannelPlacementGroupSummary",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Channels: S.optional(__listOf__string).pipe(T.JsonName("channels")),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Nodes: S.optional(__listOf__string).pipe(T.JsonName("nodes")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export const __listOfDescribeChannelPlacementGroupSummary = S.Array(
  DescribeChannelPlacementGroupSummary,
);
export class ChannelSummary extends S.Class<ChannelSummary>("ChannelSummary")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CdiInputSpecification: S.optional(CdiInputSpecification).pipe(
    T.JsonName("cdiInputSpecification"),
  ),
  ChannelClass: S.optional(S.String).pipe(T.JsonName("channelClass")),
  Destinations: S.optional(__listOfOutputDestination).pipe(
    T.JsonName("destinations"),
  ),
  EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
    T.JsonName("egressEndpoints"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InputAttachments: S.optional(__listOfInputAttachment).pipe(
    T.JsonName("inputAttachments"),
  ),
  InputSpecification: S.optional(InputSpecification).pipe(
    T.JsonName("inputSpecification"),
  ),
  LogLevel: S.optional(S.String).pipe(T.JsonName("logLevel")),
  Maintenance: S.optional(MaintenanceStatus).pipe(T.JsonName("maintenance")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Vpc: S.optional(VpcOutputSettingsDescription).pipe(T.JsonName("vpc")),
  AnywhereSettings: S.optional(DescribeAnywhereSettings).pipe(
    T.JsonName("anywhereSettings"),
  ),
  ChannelEngineVersion: S.optional(ChannelEngineVersionResponse).pipe(
    T.JsonName("channelEngineVersion"),
  ),
  UsedChannelEngineVersions: S.optional(
    __listOfChannelEngineVersionResponse,
  ).pipe(T.JsonName("usedChannelEngineVersions")),
  LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings).pipe(
    T.JsonName("linkedChannelSettings"),
  ),
}) {}
export const __listOfChannelSummary = S.Array(ChannelSummary);
export class CloudWatchAlarmTemplateGroupSummary extends S.Class<CloudWatchAlarmTemplateGroupSummary>(
  "CloudWatchAlarmTemplateGroupSummary",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Id: S.String.pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  TemplateCount: S.Number.pipe(T.JsonName("templateCount")),
}) {}
export const __listOfCloudWatchAlarmTemplateGroupSummary = S.Array(
  CloudWatchAlarmTemplateGroupSummary,
);
export class CloudWatchAlarmTemplateSummary extends S.Class<CloudWatchAlarmTemplateSummary>(
  "CloudWatchAlarmTemplateSummary",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  ComparisonOperator: S.String.pipe(T.JsonName("comparisonOperator")),
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("createdAt"),
  ),
  DatapointsToAlarm: S.optional(S.Number).pipe(T.JsonName("datapointsToAlarm")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EvaluationPeriods: S.Number.pipe(T.JsonName("evaluationPeriods")),
  GroupId: S.String.pipe(T.JsonName("groupId")),
  Id: S.String.pipe(T.JsonName("id")),
  MetricName: S.String.pipe(T.JsonName("metricName")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  Period: S.Number.pipe(T.JsonName("period")),
  Statistic: S.String.pipe(T.JsonName("statistic")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  TargetResourceType: S.String.pipe(T.JsonName("targetResourceType")),
  Threshold: S.Number.pipe(T.JsonName("threshold")),
  TreatMissingData: S.String.pipe(T.JsonName("treatMissingData")),
}) {}
export const __listOfCloudWatchAlarmTemplateSummary = S.Array(
  CloudWatchAlarmTemplateSummary,
);
export class ClusterAlert extends S.Class<ClusterAlert>("ClusterAlert")({
  AlertType: S.optional(S.String).pipe(T.JsonName("alertType")),
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  ClearedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("clearedTimestamp")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Message: S.optional(S.String).pipe(T.JsonName("message")),
  NodeId: S.optional(S.String).pipe(T.JsonName("nodeId")),
  SetTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("setTimestamp"),
  ),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export const __listOfClusterAlert = S.Array(ClusterAlert);
export class DescribeClusterSummary extends S.Class<DescribeClusterSummary>(
  "DescribeClusterSummary",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
  ClusterType: S.optional(S.String).pipe(T.JsonName("clusterType")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InstanceRoleArn: S.optional(S.String).pipe(T.JsonName("instanceRoleArn")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NetworkSettings: S.optional(ClusterNetworkSettings).pipe(
    T.JsonName("networkSettings"),
  ),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export const __listOfDescribeClusterSummary = S.Array(DescribeClusterSummary);
export class EventBridgeRuleTemplateGroupSummary extends S.Class<EventBridgeRuleTemplateGroupSummary>(
  "EventBridgeRuleTemplateGroupSummary",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Id: S.String.pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  TemplateCount: S.Number.pipe(T.JsonName("templateCount")),
}) {}
export const __listOfEventBridgeRuleTemplateGroupSummary = S.Array(
  EventBridgeRuleTemplateGroupSummary,
);
export class EventBridgeRuleTemplateSummary extends S.Class<EventBridgeRuleTemplateSummary>(
  "EventBridgeRuleTemplateSummary",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EventTargetCount: S.Number.pipe(T.JsonName("eventTargetCount")),
  EventType: S.String.pipe(T.JsonName("eventType")),
  GroupId: S.String.pipe(T.JsonName("groupId")),
  Id: S.String.pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.String.pipe(T.JsonName("name")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export const __listOfEventBridgeRuleTemplateSummary = S.Array(
  EventBridgeRuleTemplateSummary,
);
export class InputDeviceMediaConnectSettings extends S.Class<InputDeviceMediaConnectSettings>(
  "InputDeviceMediaConnectSettings",
)({
  FlowArn: S.optional(S.String).pipe(T.JsonName("flowArn")),
  RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  SecretArn: S.optional(S.String).pipe(T.JsonName("secretArn")),
  SourceName: S.optional(S.String).pipe(T.JsonName("sourceName")),
}) {}
export class InputDeviceUhdAudioChannelPairConfig extends S.Class<InputDeviceUhdAudioChannelPairConfig>(
  "InputDeviceUhdAudioChannelPairConfig",
)({
  Id: S.optional(S.Number).pipe(T.JsonName("id")),
  Profile: S.optional(S.String).pipe(T.JsonName("profile")),
}) {}
export const __listOfInputDeviceUhdAudioChannelPairConfig = S.Array(
  InputDeviceUhdAudioChannelPairConfig,
);
export class InputDeviceUhdSettings extends S.Class<InputDeviceUhdSettings>(
  "InputDeviceUhdSettings",
)({
  ActiveInput: S.optional(S.String).pipe(T.JsonName("activeInput")),
  ConfiguredInput: S.optional(S.String).pipe(T.JsonName("configuredInput")),
  DeviceState: S.optional(S.String).pipe(T.JsonName("deviceState")),
  Framerate: S.optional(S.Number).pipe(T.JsonName("framerate")),
  Height: S.optional(S.Number).pipe(T.JsonName("height")),
  MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
  ScanType: S.optional(S.String).pipe(T.JsonName("scanType")),
  Width: S.optional(S.Number).pipe(T.JsonName("width")),
  LatencyMs: S.optional(S.Number).pipe(T.JsonName("latencyMs")),
  Codec: S.optional(S.String).pipe(T.JsonName("codec")),
  MediaconnectSettings: S.optional(InputDeviceMediaConnectSettings).pipe(
    T.JsonName("mediaconnectSettings"),
  ),
  AudioChannelPairs: S.optional(
    __listOfInputDeviceUhdAudioChannelPairConfig,
  ).pipe(T.JsonName("audioChannelPairs")),
  InputResolution: S.optional(S.String).pipe(T.JsonName("inputResolution")),
}) {}
export class InputDeviceSummary extends S.Class<InputDeviceSummary>(
  "InputDeviceSummary",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ConnectionState: S.optional(S.String).pipe(T.JsonName("connectionState")),
  DeviceSettingsSyncState: S.optional(S.String).pipe(
    T.JsonName("deviceSettingsSyncState"),
  ),
  DeviceUpdateStatus: S.optional(S.String).pipe(
    T.JsonName("deviceUpdateStatus"),
  ),
  HdDeviceSettings: S.optional(InputDeviceHdSettings).pipe(
    T.JsonName("hdDeviceSettings"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MacAddress: S.optional(S.String).pipe(T.JsonName("macAddress")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NetworkSettings: S.optional(InputDeviceNetworkSettings).pipe(
    T.JsonName("networkSettings"),
  ),
  SerialNumber: S.optional(S.String).pipe(T.JsonName("serialNumber")),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
  UhdDeviceSettings: S.optional(InputDeviceUhdSettings).pipe(
    T.JsonName("uhdDeviceSettings"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
  MedialiveInputArns: S.optional(__listOf__string).pipe(
    T.JsonName("medialiveInputArns"),
  ),
  OutputType: S.optional(S.String).pipe(T.JsonName("outputType")),
}) {}
export const __listOfInputDeviceSummary = S.Array(InputDeviceSummary);
export class TransferringInputDeviceSummary extends S.Class<TransferringInputDeviceSummary>(
  "TransferringInputDeviceSummary",
)({
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Message: S.optional(S.String).pipe(T.JsonName("message")),
  TargetCustomerId: S.optional(S.String).pipe(T.JsonName("targetCustomerId")),
  TransferType: S.optional(S.String).pipe(T.JsonName("transferType")),
}) {}
export const __listOfTransferringInputDeviceSummary = S.Array(
  TransferringInputDeviceSummary,
);
export const __listOfInputSecurityGroup = S.Array(InputSecurityGroup);
export class MultiplexAlert extends S.Class<MultiplexAlert>("MultiplexAlert")({
  AlertType: S.optional(S.String).pipe(T.JsonName("alertType")),
  ClearedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("clearedTimestamp")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Message: S.optional(S.String).pipe(T.JsonName("message")),
  PipelineId: S.optional(S.String).pipe(T.JsonName("pipelineId")),
  SetTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("setTimestamp"),
  ),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export const __listOfMultiplexAlert = S.Array(MultiplexAlert);
export class MultiplexProgramSummary extends S.Class<MultiplexProgramSummary>(
  "MultiplexProgramSummary",
)({
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
}) {}
export const __listOfMultiplexProgramSummary = S.Array(MultiplexProgramSummary);
export class DescribeNetworkSummary extends S.Class<DescribeNetworkSummary>(
  "DescribeNetworkSummary",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AssociatedClusterIds: S.optional(__listOf__string).pipe(
    T.JsonName("associatedClusterIds"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  IpPools: S.optional(__listOfIpPool).pipe(T.JsonName("ipPools")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Routes: S.optional(__listOfRoute).pipe(T.JsonName("routes")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export const __listOfDescribeNetworkSummary = S.Array(DescribeNetworkSummary);
export class DescribeNodeSummary extends S.Class<DescribeNodeSummary>(
  "DescribeNodeSummary",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelPlacementGroups: S.optional(__listOf__string).pipe(
    T.JsonName("channelPlacementGroups"),
  ),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  ConnectionState: S.optional(S.String).pipe(T.JsonName("connectionState")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
  ManagedInstanceId: S.optional(S.String).pipe(T.JsonName("managedInstanceId")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
    T.JsonName("nodeInterfaceMappings"),
  ),
  Role: S.optional(S.String).pipe(T.JsonName("role")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  SdiSourceMappings: S.optional(SdiSourceMappings).pipe(
    T.JsonName("sdiSourceMappings"),
  ),
}) {}
export const __listOfDescribeNodeSummary = S.Array(DescribeNodeSummary);
export class Offering extends S.Class<Offering>("Offering")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CurrencyCode: S.optional(S.String).pipe(T.JsonName("currencyCode")),
  Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
  DurationUnits: S.optional(S.String).pipe(T.JsonName("durationUnits")),
  FixedPrice: S.optional(S.Number).pipe(T.JsonName("fixedPrice")),
  OfferingDescription: S.optional(S.String).pipe(
    T.JsonName("offeringDescription"),
  ),
  OfferingId: S.optional(S.String).pipe(T.JsonName("offeringId")),
  OfferingType: S.optional(S.String).pipe(T.JsonName("offeringType")),
  Region: S.optional(S.String).pipe(T.JsonName("region")),
  ResourceSpecification: S.optional(ReservationResourceSpecification).pipe(
    T.JsonName("resourceSpecification"),
  ),
  UsagePrice: S.optional(S.Number).pipe(T.JsonName("usagePrice")),
}) {}
export const __listOfOffering = S.Array(Offering);
export const __listOfReservation = S.Array(Reservation);
export class SdiSourceSummary extends S.Class<SdiSourceSummary>(
  "SdiSourceSummary",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Inputs: S.optional(__listOf__string).pipe(T.JsonName("inputs")),
  Mode: S.optional(S.String).pipe(T.JsonName("mode")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
}) {}
export const __listOfSdiSourceSummary = S.Array(SdiSourceSummary);
export class SignalMapSummary extends S.Class<SignalMapSummary>(
  "SignalMapSummary",
)({
  Arn: S.String.pipe(T.JsonName("arn")),
  CreatedAt: S.Date.pipe(T.TimestampFormat("date-time")).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  Id: S.String.pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  MonitorDeploymentStatus: S.String.pipe(T.JsonName("monitorDeploymentStatus")),
  Name: S.String.pipe(T.JsonName("name")),
  Status: S.String.pipe(T.JsonName("status")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export const __listOfSignalMapSummary = S.Array(SignalMapSummary);
export class Channel extends S.Class<Channel>("Channel")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CdiInputSpecification: S.optional(CdiInputSpecification).pipe(
    T.JsonName("cdiInputSpecification"),
  ),
  ChannelClass: S.optional(S.String).pipe(T.JsonName("channelClass")),
  Destinations: S.optional(__listOfOutputDestination).pipe(
    T.JsonName("destinations"),
  ),
  EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
    T.JsonName("egressEndpoints"),
  ),
  EncoderSettings: S.optional(EncoderSettings).pipe(
    T.JsonName("encoderSettings"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InputAttachments: S.optional(__listOfInputAttachment).pipe(
    T.JsonName("inputAttachments"),
  ),
  InputSpecification: S.optional(InputSpecification).pipe(
    T.JsonName("inputSpecification"),
  ),
  LogLevel: S.optional(S.String).pipe(T.JsonName("logLevel")),
  Maintenance: S.optional(MaintenanceStatus).pipe(T.JsonName("maintenance")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelineDetails: S.optional(__listOfPipelineDetail).pipe(
    T.JsonName("pipelineDetails"),
  ),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Vpc: S.optional(VpcOutputSettingsDescription).pipe(T.JsonName("vpc")),
  AnywhereSettings: S.optional(DescribeAnywhereSettings).pipe(
    T.JsonName("anywhereSettings"),
  ),
  ChannelEngineVersion: S.optional(ChannelEngineVersionResponse).pipe(
    T.JsonName("channelEngineVersion"),
  ),
  LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings).pipe(
    T.JsonName("linkedChannelSettings"),
  ),
}) {}
export class ClusterNetworkSettingsUpdateRequest extends S.Class<ClusterNetworkSettingsUpdateRequest>(
  "ClusterNetworkSettingsUpdateRequest",
)({
  DefaultRoute: S.optional(S.String).pipe(T.JsonName("defaultRoute")),
  InterfaceMappings: S.optional(__listOfInterfaceMappingUpdateRequest).pipe(
    T.JsonName("interfaceMappings"),
  ),
}) {}
export class MulticastSettingsUpdateRequest extends S.Class<MulticastSettingsUpdateRequest>(
  "MulticastSettingsUpdateRequest",
)({
  Sources: S.optional(__listOfMulticastSourceUpdateRequest).pipe(
    T.JsonName("sources"),
  ),
}) {}
export class InputDeviceConfigurableSettings extends S.Class<InputDeviceConfigurableSettings>(
  "InputDeviceConfigurableSettings",
)({
  ConfiguredInput: S.optional(S.String).pipe(T.JsonName("configuredInput")),
  MaxBitrate: S.optional(S.Number).pipe(T.JsonName("maxBitrate")),
  LatencyMs: S.optional(S.Number).pipe(T.JsonName("latencyMs")),
  Codec: S.optional(S.String).pipe(T.JsonName("codec")),
  MediaconnectSettings: S.optional(
    InputDeviceMediaConnectConfigurableSettings,
  ).pipe(T.JsonName("mediaconnectSettings")),
  AudioChannelPairs: S.optional(
    __listOfInputDeviceConfigurableAudioChannelPairConfig,
  ).pipe(T.JsonName("audioChannelPairs")),
  InputResolution: S.optional(S.String).pipe(T.JsonName("inputResolution")),
}) {}
export const MultiplexPacketIdentifiersMapping = S.Record({
  key: S.String,
  value: MultiplexProgramPacketIdentifiersMap,
});
export class MultiplexProgram extends S.Class<MultiplexProgram>(
  "MultiplexProgram",
)({
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  MultiplexProgramSettings: S.optional(MultiplexProgramSettings).pipe(
    T.JsonName("multiplexProgramSettings"),
  ),
  PacketIdentifiersMap: S.optional(MultiplexProgramPacketIdentifiersMap).pipe(
    T.JsonName("packetIdentifiersMap"),
  ),
  PipelineDetails: S.optional(__listOfMultiplexProgramPipelineDetail).pipe(
    T.JsonName("pipelineDetails"),
  ),
  ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
}) {}
export class SrtCallerDecryptionRequest extends S.Class<SrtCallerDecryptionRequest>(
  "SrtCallerDecryptionRequest",
)({
  Algorithm: S.optional(S.String).pipe(T.JsonName("algorithm")),
  PassphraseSecretArn: S.optional(S.String).pipe(
    T.JsonName("passphraseSecretArn"),
  ),
}) {}
export class BatchDeleteResponse extends S.Class<BatchDeleteResponse>(
  "BatchDeleteResponse",
)({
  Failed: S.optional(__listOfBatchFailedResultModel).pipe(T.JsonName("failed")),
  Successful: S.optional(__listOfBatchSuccessfulResultModel).pipe(
    T.JsonName("successful"),
  ),
}) {}
export class CreateCloudWatchAlarmTemplateResponse extends S.Class<CreateCloudWatchAlarmTemplateResponse>(
  "CreateCloudWatchAlarmTemplateResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ComparisonOperator: S.optional(S.String).pipe(
    T.JsonName("comparisonOperator"),
  ),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  DatapointsToAlarm: S.optional(S.Number).pipe(T.JsonName("datapointsToAlarm")),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EvaluationPeriods: S.optional(S.Number).pipe(T.JsonName("evaluationPeriods")),
  GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MetricName: S.optional(S.String).pipe(T.JsonName("metricName")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Period: S.optional(S.Number).pipe(T.JsonName("period")),
  Statistic: S.optional(S.String).pipe(T.JsonName("statistic")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
  TargetResourceType: S.optional(S.String).pipe(
    T.JsonName("targetResourceType"),
  ),
  Threshold: S.optional(S.Number).pipe(T.JsonName("threshold")),
  TreatMissingData: S.optional(S.String).pipe(T.JsonName("treatMissingData")),
}) {}
export class CreateClusterRequest extends S.Class<CreateClusterRequest>(
  "CreateClusterRequest",
)(
  {
    ClusterType: S.optional(S.String).pipe(T.JsonName("clusterType")),
    InstanceRoleArn: S.optional(S.String).pipe(T.JsonName("instanceRoleArn")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkSettings: S.optional(ClusterNetworkSettingsCreateRequest).pipe(
      T.JsonName("networkSettings"),
    ),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/clusters" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateEventBridgeRuleTemplateResponse extends S.Class<CreateEventBridgeRuleTemplateResponse>(
  "CreateEventBridgeRuleTemplateResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  EventTargets: S.optional(__listOfEventBridgeRuleTemplateTarget).pipe(
    T.JsonName("eventTargets"),
  ),
  EventType: S.optional(S.String).pipe(T.JsonName("eventType")),
  GroupId: S.optional(S.String).pipe(T.JsonName("groupId")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class CreateInputSecurityGroupResponse extends S.Class<CreateInputSecurityGroupResponse>(
  "CreateInputSecurityGroupResponse",
)({
  SecurityGroup: S.optional(InputSecurityGroup).pipe(
    T.JsonName("securityGroup"),
  ),
}) {}
export class CreateNetworkResponse extends S.Class<CreateNetworkResponse>(
  "CreateNetworkResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AssociatedClusterIds: S.optional(__listOf__string).pipe(
    T.JsonName("associatedClusterIds"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  IpPools: S.optional(__listOfIpPool).pipe(T.JsonName("ipPools")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Routes: S.optional(__listOfRoute).pipe(T.JsonName("routes")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class CreateNodeResponse extends S.Class<CreateNodeResponse>(
  "CreateNodeResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelPlacementGroups: S.optional(__listOf__string).pipe(
    T.JsonName("channelPlacementGroups"),
  ),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  ConnectionState: S.optional(S.String).pipe(T.JsonName("connectionState")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
    T.JsonName("nodeInterfaceMappings"),
  ),
  Role: S.optional(S.String).pipe(T.JsonName("role")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  SdiSourceMappings: S.optional(SdiSourceMappings).pipe(
    T.JsonName("sdiSourceMappings"),
  ),
}) {}
export class CreateNodeRegistrationScriptResponse extends S.Class<CreateNodeRegistrationScriptResponse>(
  "CreateNodeRegistrationScriptResponse",
)({
  NodeRegistrationScript: S.optional(S.String).pipe(
    T.JsonName("nodeRegistrationScript"),
  ),
}) {}
export class CreatePartnerInputResponse extends S.Class<CreatePartnerInputResponse>(
  "CreatePartnerInputResponse",
)({ Input: S.optional(Input).pipe(T.JsonName("input")) }) {}
export class CreateSdiSourceResponse extends S.Class<CreateSdiSourceResponse>(
  "CreateSdiSourceResponse",
)({ SdiSource: S.optional(SdiSource).pipe(T.JsonName("sdiSource")) }) {}
export class DeleteMultiplexProgramResponse extends S.Class<DeleteMultiplexProgramResponse>(
  "DeleteMultiplexProgramResponse",
)({
  ChannelId: S.optional(S.String).pipe(T.JsonName("channelId")),
  MultiplexProgramSettings: S.optional(MultiplexProgramSettings).pipe(
    T.JsonName("multiplexProgramSettings"),
  ),
  PacketIdentifiersMap: S.optional(MultiplexProgramPacketIdentifiersMap).pipe(
    T.JsonName("packetIdentifiersMap"),
  ),
  PipelineDetails: S.optional(__listOfMultiplexProgramPipelineDetail).pipe(
    T.JsonName("pipelineDetails"),
  ),
  ProgramName: S.optional(S.String).pipe(T.JsonName("programName")),
}) {}
export class DeleteNetworkResponse extends S.Class<DeleteNetworkResponse>(
  "DeleteNetworkResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AssociatedClusterIds: S.optional(__listOf__string).pipe(
    T.JsonName("associatedClusterIds"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  IpPools: S.optional(__listOfIpPool).pipe(T.JsonName("ipPools")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Routes: S.optional(__listOfRoute).pipe(T.JsonName("routes")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class DeleteNodeResponse extends S.Class<DeleteNodeResponse>(
  "DeleteNodeResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelPlacementGroups: S.optional(__listOf__string).pipe(
    T.JsonName("channelPlacementGroups"),
  ),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  ConnectionState: S.optional(S.String).pipe(T.JsonName("connectionState")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
    T.JsonName("nodeInterfaceMappings"),
  ),
  Role: S.optional(S.String).pipe(T.JsonName("role")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  SdiSourceMappings: S.optional(SdiSourceMappings).pipe(
    T.JsonName("sdiSourceMappings"),
  ),
}) {}
export class DeleteReservationResponse extends S.Class<DeleteReservationResponse>(
  "DeleteReservationResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Count: S.optional(S.Number).pipe(T.JsonName("count")),
  CurrencyCode: S.optional(S.String).pipe(T.JsonName("currencyCode")),
  Duration: S.optional(S.Number).pipe(T.JsonName("duration")),
  DurationUnits: S.optional(S.String).pipe(T.JsonName("durationUnits")),
  End: S.optional(S.String).pipe(T.JsonName("end")),
  FixedPrice: S.optional(S.Number).pipe(T.JsonName("fixedPrice")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  OfferingDescription: S.optional(S.String).pipe(
    T.JsonName("offeringDescription"),
  ),
  OfferingId: S.optional(S.String).pipe(T.JsonName("offeringId")),
  OfferingType: S.optional(S.String).pipe(T.JsonName("offeringType")),
  Region: S.optional(S.String).pipe(T.JsonName("region")),
  RenewalSettings: S.optional(RenewalSettings).pipe(
    T.JsonName("renewalSettings"),
  ),
  ReservationId: S.optional(S.String).pipe(T.JsonName("reservationId")),
  ResourceSpecification: S.optional(ReservationResourceSpecification).pipe(
    T.JsonName("resourceSpecification"),
  ),
  Start: S.optional(S.String).pipe(T.JsonName("start")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  UsagePrice: S.optional(S.Number).pipe(T.JsonName("usagePrice")),
}) {}
export class DescribeInputSecurityGroupResponse extends S.Class<DescribeInputSecurityGroupResponse>(
  "DescribeInputSecurityGroupResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Inputs: S.optional(__listOf__string).pipe(T.JsonName("inputs")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  WhitelistRules: S.optional(__listOfInputWhitelistRule).pipe(
    T.JsonName("whitelistRules"),
  ),
}) {}
export class ListAlertsResponse extends S.Class<ListAlertsResponse>(
  "ListAlertsResponse",
)({
  Alerts: S.optional(__listOfChannelAlert).pipe(T.JsonName("alerts")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListChannelPlacementGroupsResponse extends S.Class<ListChannelPlacementGroupsResponse>(
  "ListChannelPlacementGroupsResponse",
)({
  ChannelPlacementGroups: S.optional(
    __listOfDescribeChannelPlacementGroupSummary,
  ).pipe(T.JsonName("channelPlacementGroups")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListChannelsResponse extends S.Class<ListChannelsResponse>(
  "ListChannelsResponse",
)({
  Channels: S.optional(__listOfChannelSummary).pipe(T.JsonName("channels")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListCloudWatchAlarmTemplateGroupsResponse extends S.Class<ListCloudWatchAlarmTemplateGroupsResponse>(
  "ListCloudWatchAlarmTemplateGroupsResponse",
)({
  CloudWatchAlarmTemplateGroups: S.optional(
    __listOfCloudWatchAlarmTemplateGroupSummary,
  ).pipe(T.JsonName("cloudWatchAlarmTemplateGroups")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListCloudWatchAlarmTemplatesResponse extends S.Class<ListCloudWatchAlarmTemplatesResponse>(
  "ListCloudWatchAlarmTemplatesResponse",
)({
  CloudWatchAlarmTemplates: S.optional(
    __listOfCloudWatchAlarmTemplateSummary,
  ).pipe(T.JsonName("cloudWatchAlarmTemplates")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListClusterAlertsResponse extends S.Class<ListClusterAlertsResponse>(
  "ListClusterAlertsResponse",
)({
  Alerts: S.optional(__listOfClusterAlert).pipe(T.JsonName("alerts")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListClustersResponse extends S.Class<ListClustersResponse>(
  "ListClustersResponse",
)({
  Clusters: S.optional(__listOfDescribeClusterSummary).pipe(
    T.JsonName("clusters"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListEventBridgeRuleTemplateGroupsResponse extends S.Class<ListEventBridgeRuleTemplateGroupsResponse>(
  "ListEventBridgeRuleTemplateGroupsResponse",
)({
  EventBridgeRuleTemplateGroups: S.optional(
    __listOfEventBridgeRuleTemplateGroupSummary,
  ).pipe(T.JsonName("eventBridgeRuleTemplateGroups")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListEventBridgeRuleTemplatesResponse extends S.Class<ListEventBridgeRuleTemplatesResponse>(
  "ListEventBridgeRuleTemplatesResponse",
)({
  EventBridgeRuleTemplates: S.optional(
    __listOfEventBridgeRuleTemplateSummary,
  ).pipe(T.JsonName("eventBridgeRuleTemplates")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListInputDevicesResponse extends S.Class<ListInputDevicesResponse>(
  "ListInputDevicesResponse",
)({
  InputDevices: S.optional(__listOfInputDeviceSummary).pipe(
    T.JsonName("inputDevices"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListInputDeviceTransfersResponse extends S.Class<ListInputDeviceTransfersResponse>(
  "ListInputDeviceTransfersResponse",
)({
  InputDeviceTransfers: S.optional(__listOfTransferringInputDeviceSummary).pipe(
    T.JsonName("inputDeviceTransfers"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListInputSecurityGroupsResponse extends S.Class<ListInputSecurityGroupsResponse>(
  "ListInputSecurityGroupsResponse",
)({
  InputSecurityGroups: S.optional(__listOfInputSecurityGroup).pipe(
    T.JsonName("inputSecurityGroups"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListMultiplexAlertsResponse extends S.Class<ListMultiplexAlertsResponse>(
  "ListMultiplexAlertsResponse",
)({
  Alerts: S.optional(__listOfMultiplexAlert).pipe(T.JsonName("alerts")),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListMultiplexProgramsResponse extends S.Class<ListMultiplexProgramsResponse>(
  "ListMultiplexProgramsResponse",
)({
  MultiplexPrograms: S.optional(__listOfMultiplexProgramSummary).pipe(
    T.JsonName("multiplexPrograms"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListNetworksResponse extends S.Class<ListNetworksResponse>(
  "ListNetworksResponse",
)({
  Networks: S.optional(__listOfDescribeNetworkSummary).pipe(
    T.JsonName("networks"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class ListNodesResponse extends S.Class<ListNodesResponse>(
  "ListNodesResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Nodes: S.optional(__listOfDescribeNodeSummary).pipe(T.JsonName("nodes")),
}) {}
export class ListOfferingsResponse extends S.Class<ListOfferingsResponse>(
  "ListOfferingsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Offerings: S.optional(__listOfOffering).pipe(T.JsonName("offerings")),
}) {}
export class ListReservationsResponse extends S.Class<ListReservationsResponse>(
  "ListReservationsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  Reservations: S.optional(__listOfReservation).pipe(
    T.JsonName("reservations"),
  ),
}) {}
export class ListSdiSourcesResponse extends S.Class<ListSdiSourcesResponse>(
  "ListSdiSourcesResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  SdiSources: S.optional(__listOfSdiSourceSummary).pipe(
    T.JsonName("sdiSources"),
  ),
}) {}
export class ListSignalMapsResponse extends S.Class<ListSignalMapsResponse>(
  "ListSignalMapsResponse",
)({
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
  SignalMaps: S.optional(__listOfSignalMapSummary).pipe(
    T.JsonName("signalMaps"),
  ),
}) {}
export class PurchaseOfferingResponse extends S.Class<PurchaseOfferingResponse>(
  "PurchaseOfferingResponse",
)({ Reservation: S.optional(Reservation).pipe(T.JsonName("reservation")) }) {}
export class UpdateChannelResponse extends S.Class<UpdateChannelResponse>(
  "UpdateChannelResponse",
)({ Channel: S.optional(Channel).pipe(T.JsonName("channel")) }) {}
export class UpdateChannelClassResponse extends S.Class<UpdateChannelClassResponse>(
  "UpdateChannelClassResponse",
)({ Channel: S.optional(Channel).pipe(T.JsonName("channel")) }) {}
export class UpdateClusterRequest extends S.Class<UpdateClusterRequest>(
  "UpdateClusterRequest",
)(
  {
    ClusterId: S.String.pipe(T.HttpLabel("ClusterId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    NetworkSettings: S.optional(ClusterNetworkSettingsUpdateRequest).pipe(
      T.JsonName("networkSettings"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prod/clusters/{ClusterId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SrtCallerSourceRequest extends S.Class<SrtCallerSourceRequest>(
  "SrtCallerSourceRequest",
)({
  Decryption: S.optional(SrtCallerDecryptionRequest).pipe(
    T.JsonName("decryption"),
  ),
  MinimumLatency: S.optional(S.Number).pipe(T.JsonName("minimumLatency")),
  SrtListenerAddress: S.optional(S.String).pipe(
    T.JsonName("srtListenerAddress"),
  ),
  SrtListenerPort: S.optional(S.String).pipe(T.JsonName("srtListenerPort")),
  StreamId: S.optional(S.String).pipe(T.JsonName("streamId")),
}) {}
export const __listOfSrtCallerSourceRequest = S.Array(SrtCallerSourceRequest);
export class SrtSettingsRequest extends S.Class<SrtSettingsRequest>(
  "SrtSettingsRequest",
)({
  SrtCallerSources: S.optional(__listOfSrtCallerSourceRequest).pipe(
    T.JsonName("srtCallerSources"),
  ),
}) {}
export class UpdateInputRequest extends S.Class<UpdateInputRequest>(
  "UpdateInputRequest",
)(
  {
    Destinations: S.optional(__listOfInputDestinationRequest).pipe(
      T.JsonName("destinations"),
    ),
    InputDevices: S.optional(__listOfInputDeviceRequest).pipe(
      T.JsonName("inputDevices"),
    ),
    InputId: S.String.pipe(T.HttpLabel("InputId")),
    InputSecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("inputSecurityGroups"),
    ),
    MediaConnectFlows: S.optional(__listOfMediaConnectFlowRequest).pipe(
      T.JsonName("mediaConnectFlows"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    Sources: S.optional(__listOfInputSourceRequest).pipe(T.JsonName("sources")),
    SrtSettings: S.optional(SrtSettingsRequest).pipe(T.JsonName("srtSettings")),
    MulticastSettings: S.optional(MulticastSettingsUpdateRequest).pipe(
      T.JsonName("multicastSettings"),
    ),
    Smpte2110ReceiverGroupSettings: S.optional(
      Smpte2110ReceiverGroupSettings,
    ).pipe(T.JsonName("smpte2110ReceiverGroupSettings")),
    SdiSources: S.optional(InputSdiSources).pipe(T.JsonName("sdiSources")),
    SpecialRouterSettings: S.optional(SpecialRouterSettings).pipe(
      T.JsonName("specialRouterSettings"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prod/inputs/{InputId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateInputDeviceRequest extends S.Class<UpdateInputDeviceRequest>(
  "UpdateInputDeviceRequest",
)(
  {
    HdDeviceSettings: S.optional(InputDeviceConfigurableSettings).pipe(
      T.JsonName("hdDeviceSettings"),
    ),
    InputDeviceId: S.String.pipe(T.HttpLabel("InputDeviceId")),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    UhdDeviceSettings: S.optional(InputDeviceConfigurableSettings).pipe(
      T.JsonName("uhdDeviceSettings"),
    ),
    AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prod/inputDevices/{InputDeviceId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMultiplexRequest extends S.Class<UpdateMultiplexRequest>(
  "UpdateMultiplexRequest",
)(
  {
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    MultiplexSettings: S.optional(MultiplexSettings).pipe(
      T.JsonName("multiplexSettings"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    PacketIdentifiersMapping: S.optional(
      MultiplexPacketIdentifiersMapping,
    ).pipe(T.JsonName("packetIdentifiersMapping")),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prod/multiplexes/{MultiplexId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateMultiplexProgramResponse extends S.Class<UpdateMultiplexProgramResponse>(
  "UpdateMultiplexProgramResponse",
)({
  MultiplexProgram: S.optional(MultiplexProgram).pipe(
    T.JsonName("multiplexProgram"),
  ),
}) {}
export class UpdateNetworkResponse extends S.Class<UpdateNetworkResponse>(
  "UpdateNetworkResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AssociatedClusterIds: S.optional(__listOf__string).pipe(
    T.JsonName("associatedClusterIds"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  IpPools: S.optional(__listOfIpPool).pipe(T.JsonName("ipPools")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Routes: S.optional(__listOfRoute).pipe(T.JsonName("routes")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class UpdateNodeResponse extends S.Class<UpdateNodeResponse>(
  "UpdateNodeResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelPlacementGroups: S.optional(__listOf__string).pipe(
    T.JsonName("channelPlacementGroups"),
  ),
  ClusterId: S.optional(S.String).pipe(T.JsonName("clusterId")),
  ConnectionState: S.optional(S.String).pipe(T.JsonName("connectionState")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InstanceArn: S.optional(S.String).pipe(T.JsonName("instanceArn")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NodeInterfaceMappings: S.optional(__listOfNodeInterfaceMapping).pipe(
    T.JsonName("nodeInterfaceMappings"),
  ),
  Role: S.optional(S.String).pipe(T.JsonName("role")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  SdiSourceMappings: S.optional(SdiSourceMappings).pipe(
    T.JsonName("sdiSourceMappings"),
  ),
}) {}
export class Thumbnail extends S.Class<Thumbnail>("Thumbnail")({
  Body: S.optional(S.String).pipe(T.JsonName("body")),
  ContentType: S.optional(S.String).pipe(T.JsonName("contentType")),
  ThumbnailType: S.optional(S.String).pipe(T.JsonName("thumbnailType")),
  TimeStamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("timeStamp"),
  ),
}) {}
export const __listOfThumbnail = S.Array(Thumbnail);
export class MultiplexSettingsSummary extends S.Class<MultiplexSettingsSummary>(
  "MultiplexSettingsSummary",
)({
  TransportStreamBitrate: S.optional(S.Number).pipe(
    T.JsonName("transportStreamBitrate"),
  ),
}) {}
export class Multiplex extends S.Class<Multiplex>("Multiplex")({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AvailabilityZones: S.optional(__listOf__string).pipe(
    T.JsonName("availabilityZones"),
  ),
  Destinations: S.optional(__listOfMultiplexOutputDestination).pipe(
    T.JsonName("destinations"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MultiplexSettings: S.optional(MultiplexSettings).pipe(
    T.JsonName("multiplexSettings"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  ProgramCount: S.optional(S.Number).pipe(T.JsonName("programCount")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class ThumbnailDetail extends S.Class<ThumbnailDetail>(
  "ThumbnailDetail",
)({
  PipelineId: S.optional(S.String).pipe(T.JsonName("pipelineId")),
  Thumbnails: S.optional(__listOfThumbnail).pipe(T.JsonName("thumbnails")),
}) {}
export const __listOfThumbnailDetail = S.Array(ThumbnailDetail);
export class MultiplexSummary extends S.Class<MultiplexSummary>(
  "MultiplexSummary",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AvailabilityZones: S.optional(__listOf__string).pipe(
    T.JsonName("availabilityZones"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MultiplexSettings: S.optional(MultiplexSettingsSummary).pipe(
    T.JsonName("multiplexSettings"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  ProgramCount: S.optional(S.Number).pipe(T.JsonName("programCount")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export const __listOfMultiplexSummary = S.Array(MultiplexSummary);
export class CreateClusterResponse extends S.Class<CreateClusterResponse>(
  "CreateClusterResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
  ClusterType: S.optional(S.String).pipe(T.JsonName("clusterType")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InstanceRoleArn: S.optional(S.String).pipe(T.JsonName("instanceRoleArn")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NetworkSettings: S.optional(ClusterNetworkSettings).pipe(
    T.JsonName("networkSettings"),
  ),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class CreateMultiplexResponse extends S.Class<CreateMultiplexResponse>(
  "CreateMultiplexResponse",
)({ Multiplex: S.optional(Multiplex).pipe(T.JsonName("multiplex")) }) {}
export class CreateMultiplexProgramRequest extends S.Class<CreateMultiplexProgramRequest>(
  "CreateMultiplexProgramRequest",
)(
  {
    MultiplexId: S.String.pipe(T.HttpLabel("MultiplexId")),
    MultiplexProgramSettings: MultiplexProgramSettings.pipe(
      T.JsonName("multiplexProgramSettings"),
    ),
    ProgramName: S.String.pipe(T.JsonName("programName")),
    RequestId: S.String.pipe(T.JsonName("requestId")),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/multiplexes/{MultiplexId}/programs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteChannelResponse extends S.Class<DeleteChannelResponse>(
  "DeleteChannelResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CdiInputSpecification: S.optional(CdiInputSpecification).pipe(
    T.JsonName("cdiInputSpecification"),
  ),
  ChannelClass: S.optional(S.String).pipe(T.JsonName("channelClass")),
  Destinations: S.optional(__listOfOutputDestination).pipe(
    T.JsonName("destinations"),
  ),
  EgressEndpoints: S.optional(__listOfChannelEgressEndpoint).pipe(
    T.JsonName("egressEndpoints"),
  ),
  EncoderSettings: S.optional(EncoderSettings).pipe(
    T.JsonName("encoderSettings"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InputAttachments: S.optional(__listOfInputAttachment).pipe(
    T.JsonName("inputAttachments"),
  ),
  InputSpecification: S.optional(InputSpecification).pipe(
    T.JsonName("inputSpecification"),
  ),
  LogLevel: S.optional(S.String).pipe(T.JsonName("logLevel")),
  Maintenance: S.optional(MaintenanceStatus).pipe(T.JsonName("maintenance")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelineDetails: S.optional(__listOfPipelineDetail).pipe(
    T.JsonName("pipelineDetails"),
  ),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Vpc: S.optional(VpcOutputSettingsDescription).pipe(T.JsonName("vpc")),
  AnywhereSettings: S.optional(DescribeAnywhereSettings).pipe(
    T.JsonName("anywhereSettings"),
  ),
  ChannelEngineVersion: S.optional(ChannelEngineVersionResponse).pipe(
    T.JsonName("channelEngineVersion"),
  ),
  LinkedChannelSettings: S.optional(DescribeLinkedChannelSettings).pipe(
    T.JsonName("linkedChannelSettings"),
  ),
}) {}
export class DeleteClusterResponse extends S.Class<DeleteClusterResponse>(
  "DeleteClusterResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
  ClusterType: S.optional(S.String).pipe(T.JsonName("clusterType")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InstanceRoleArn: S.optional(S.String).pipe(T.JsonName("instanceRoleArn")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NetworkSettings: S.optional(ClusterNetworkSettings).pipe(
    T.JsonName("networkSettings"),
  ),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class DeleteMultiplexResponse extends S.Class<DeleteMultiplexResponse>(
  "DeleteMultiplexResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AvailabilityZones: S.optional(__listOf__string).pipe(
    T.JsonName("availabilityZones"),
  ),
  Destinations: S.optional(__listOfMultiplexOutputDestination).pipe(
    T.JsonName("destinations"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MultiplexSettings: S.optional(MultiplexSettings).pipe(
    T.JsonName("multiplexSettings"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  PipelinesRunningCount: S.optional(S.Number).pipe(
    T.JsonName("pipelinesRunningCount"),
  ),
  ProgramCount: S.optional(S.Number).pipe(T.JsonName("programCount")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
}) {}
export class DescribeInputDeviceResponse extends S.Class<DescribeInputDeviceResponse>(
  "DescribeInputDeviceResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ConnectionState: S.optional(S.String).pipe(T.JsonName("connectionState")),
  DeviceSettingsSyncState: S.optional(S.String).pipe(
    T.JsonName("deviceSettingsSyncState"),
  ),
  DeviceUpdateStatus: S.optional(S.String).pipe(
    T.JsonName("deviceUpdateStatus"),
  ),
  HdDeviceSettings: S.optional(InputDeviceHdSettings).pipe(
    T.JsonName("hdDeviceSettings"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MacAddress: S.optional(S.String).pipe(T.JsonName("macAddress")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NetworkSettings: S.optional(InputDeviceNetworkSettings).pipe(
    T.JsonName("networkSettings"),
  ),
  SerialNumber: S.optional(S.String).pipe(T.JsonName("serialNumber")),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
  UhdDeviceSettings: S.optional(InputDeviceUhdSettings).pipe(
    T.JsonName("uhdDeviceSettings"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
  MedialiveInputArns: S.optional(__listOf__string).pipe(
    T.JsonName("medialiveInputArns"),
  ),
  OutputType: S.optional(S.String).pipe(T.JsonName("outputType")),
}) {}
export class DescribeThumbnailsResponse extends S.Class<DescribeThumbnailsResponse>(
  "DescribeThumbnailsResponse",
)({
  ThumbnailDetails: S.optional(__listOfThumbnailDetail).pipe(
    T.JsonName("thumbnailDetails"),
  ),
}) {}
export class ListMultiplexesResponse extends S.Class<ListMultiplexesResponse>(
  "ListMultiplexesResponse",
)({
  Multiplexes: S.optional(__listOfMultiplexSummary).pipe(
    T.JsonName("multiplexes"),
  ),
  NextToken: S.optional(S.String).pipe(T.JsonName("nextToken")),
}) {}
export class UpdateClusterResponse extends S.Class<UpdateClusterResponse>(
  "UpdateClusterResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ChannelIds: S.optional(__listOf__string).pipe(T.JsonName("channelIds")),
  ClusterType: S.optional(S.String).pipe(T.JsonName("clusterType")),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NetworkSettings: S.optional(ClusterNetworkSettings).pipe(
    T.JsonName("networkSettings"),
  ),
  State: S.optional(S.String).pipe(T.JsonName("state")),
}) {}
export class UpdateInputResponse extends S.Class<UpdateInputResponse>(
  "UpdateInputResponse",
)({ Input: S.optional(Input).pipe(T.JsonName("input")) }) {}
export class UpdateInputDeviceResponse extends S.Class<UpdateInputDeviceResponse>(
  "UpdateInputDeviceResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  ConnectionState: S.optional(S.String).pipe(T.JsonName("connectionState")),
  DeviceSettingsSyncState: S.optional(S.String).pipe(
    T.JsonName("deviceSettingsSyncState"),
  ),
  DeviceUpdateStatus: S.optional(S.String).pipe(
    T.JsonName("deviceUpdateStatus"),
  ),
  HdDeviceSettings: S.optional(InputDeviceHdSettings).pipe(
    T.JsonName("hdDeviceSettings"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  MacAddress: S.optional(S.String).pipe(T.JsonName("macAddress")),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  NetworkSettings: S.optional(InputDeviceNetworkSettings).pipe(
    T.JsonName("networkSettings"),
  ),
  SerialNumber: S.optional(S.String).pipe(T.JsonName("serialNumber")),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
  UhdDeviceSettings: S.optional(InputDeviceUhdSettings).pipe(
    T.JsonName("uhdDeviceSettings"),
  ),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  AvailabilityZone: S.optional(S.String).pipe(T.JsonName("availabilityZone")),
  MedialiveInputArns: S.optional(__listOf__string).pipe(
    T.JsonName("medialiveInputArns"),
  ),
  OutputType: S.optional(S.String).pipe(T.JsonName("outputType")),
}) {}
export class UpdateMultiplexResponse extends S.Class<UpdateMultiplexResponse>(
  "UpdateMultiplexResponse",
)({ Multiplex: S.optional(Multiplex).pipe(T.JsonName("multiplex")) }) {}
export class CreateInputRequest extends S.Class<CreateInputRequest>(
  "CreateInputRequest",
)(
  {
    Destinations: S.optional(__listOfInputDestinationRequest).pipe(
      T.JsonName("destinations"),
    ),
    InputDevices: S.optional(__listOfInputDeviceSettings).pipe(
      T.JsonName("inputDevices"),
    ),
    InputSecurityGroups: S.optional(__listOf__string).pipe(
      T.JsonName("inputSecurityGroups"),
    ),
    MediaConnectFlows: S.optional(__listOfMediaConnectFlowRequest).pipe(
      T.JsonName("mediaConnectFlows"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    Sources: S.optional(__listOfInputSourceRequest).pipe(T.JsonName("sources")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Type: S.optional(S.String).pipe(T.JsonName("type")),
    Vpc: S.optional(InputVpcRequest).pipe(T.JsonName("vpc")),
    SrtSettings: S.optional(SrtSettingsRequest).pipe(T.JsonName("srtSettings")),
    InputNetworkLocation: S.optional(S.String).pipe(
      T.JsonName("inputNetworkLocation"),
    ),
    MulticastSettings: S.optional(MulticastSettingsCreateRequest).pipe(
      T.JsonName("multicastSettings"),
    ),
    Smpte2110ReceiverGroupSettings: S.optional(
      Smpte2110ReceiverGroupSettings,
    ).pipe(T.JsonName("smpte2110ReceiverGroupSettings")),
    SdiSources: S.optional(InputSdiSources).pipe(T.JsonName("sdiSources")),
    RouterSettings: S.optional(RouterSettings).pipe(
      T.JsonName("routerSettings"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/inputs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateMultiplexProgramResponse extends S.Class<CreateMultiplexProgramResponse>(
  "CreateMultiplexProgramResponse",
)({
  MultiplexProgram: S.optional(MultiplexProgram).pipe(
    T.JsonName("multiplexProgram"),
  ),
}) {}
export class CreateSignalMapResponse extends S.Class<CreateSignalMapResponse>(
  "CreateSignalMapResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  CloudWatchAlarmTemplateGroupIds: S.optional(
    __listOf__stringMin7Max11PatternAws097,
  ).pipe(T.JsonName("cloudWatchAlarmTemplateGroupIds")),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("createdAt"),
  ),
  Description: S.optional(S.String).pipe(T.JsonName("description")),
  DiscoveryEntryPointArn: S.optional(S.String).pipe(
    T.JsonName("discoveryEntryPointArn"),
  ),
  ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
  EventBridgeRuleTemplateGroupIds: S.optional(
    __listOf__stringMin7Max11PatternAws097,
  ).pipe(T.JsonName("eventBridgeRuleTemplateGroupIds")),
  FailedMediaResourceMap: S.optional(FailedMediaResourceMap).pipe(
    T.JsonName("failedMediaResourceMap"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  LastDiscoveredAt: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ).pipe(T.JsonName("lastDiscoveredAt")),
  LastSuccessfulMonitorDeployment: S.optional(SuccessfulMonitorDeployment).pipe(
    T.JsonName("lastSuccessfulMonitorDeployment"),
  ),
  MediaResourceMap: S.optional(MediaResourceMap).pipe(
    T.JsonName("mediaResourceMap"),
  ),
  ModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))).pipe(
    T.JsonName("modifiedAt"),
  ),
  MonitorChangesPendingDeployment: S.optional(S.Boolean).pipe(
    T.JsonName("monitorChangesPendingDeployment"),
  ),
  MonitorDeployment: S.optional(MonitorDeployment).pipe(
    T.JsonName("monitorDeployment"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  Status: S.optional(S.String).pipe(T.JsonName("status")),
  Tags: S.optional(TagMap).pipe(T.JsonName("tags")),
}) {}
export class DescribeInputResponse extends S.Class<DescribeInputResponse>(
  "DescribeInputResponse",
)({
  Arn: S.optional(S.String).pipe(T.JsonName("arn")),
  AttachedChannels: S.optional(__listOf__string).pipe(
    T.JsonName("attachedChannels"),
  ),
  Destinations: S.optional(__listOfInputDestination).pipe(
    T.JsonName("destinations"),
  ),
  Id: S.optional(S.String).pipe(T.JsonName("id")),
  InputClass: S.optional(S.String).pipe(T.JsonName("inputClass")),
  InputDevices: S.optional(__listOfInputDeviceSettings).pipe(
    T.JsonName("inputDevices"),
  ),
  InputPartnerIds: S.optional(__listOf__string).pipe(
    T.JsonName("inputPartnerIds"),
  ),
  InputSourceType: S.optional(S.String).pipe(T.JsonName("inputSourceType")),
  MediaConnectFlows: S.optional(__listOfMediaConnectFlow).pipe(
    T.JsonName("mediaConnectFlows"),
  ),
  Name: S.optional(S.String).pipe(T.JsonName("name")),
  RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
  SecurityGroups: S.optional(__listOf__string).pipe(
    T.JsonName("securityGroups"),
  ),
  Sources: S.optional(__listOfInputSource).pipe(T.JsonName("sources")),
  State: S.optional(S.String).pipe(T.JsonName("state")),
  Tags: S.optional(Tags).pipe(T.JsonName("tags")),
  Type: S.optional(S.String).pipe(T.JsonName("type")),
  SrtSettings: S.optional(SrtSettings).pipe(T.JsonName("srtSettings")),
  InputNetworkLocation: S.optional(S.String).pipe(
    T.JsonName("inputNetworkLocation"),
  ),
  MulticastSettings: S.optional(MulticastSettings).pipe(
    T.JsonName("multicastSettings"),
  ),
  Smpte2110ReceiverGroupSettings: S.optional(
    Smpte2110ReceiverGroupSettings,
  ).pipe(T.JsonName("smpte2110ReceiverGroupSettings")),
  SdiSources: S.optional(InputSdiSources).pipe(T.JsonName("sdiSources")),
  RouterSettings: S.optional(RouterInputSettings).pipe(
    T.JsonName("routerSettings"),
  ),
}) {}
export class ValidationError extends S.Class<ValidationError>(
  "ValidationError",
)({
  ElementPath: S.optional(S.String).pipe(T.JsonName("elementPath")),
  ErrorMessage: S.optional(S.String).pipe(T.JsonName("errorMessage")),
}) {}
export const __listOfValidationError = S.Array(ValidationError);
export class CreateInputResponse extends S.Class<CreateInputResponse>(
  "CreateInputResponse",
)({ Input: S.optional(Input).pipe(T.JsonName("input")) }) {}
export class BatchScheduleActionCreateRequest extends S.Class<BatchScheduleActionCreateRequest>(
  "BatchScheduleActionCreateRequest",
)({
  ScheduleActions: __listOfScheduleAction.pipe(T.JsonName("scheduleActions")),
}) {}
export class BatchUpdateScheduleRequest extends S.Class<BatchUpdateScheduleRequest>(
  "BatchUpdateScheduleRequest",
)(
  {
    ChannelId: S.String.pipe(T.HttpLabel("ChannelId")),
    Creates: S.optional(BatchScheduleActionCreateRequest).pipe(
      T.JsonName("creates"),
    ),
    Deletes: S.optional(BatchScheduleActionDeleteRequest).pipe(
      T.JsonName("deletes"),
    ),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/prod/channels/{ChannelId}/schedule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateChannelRequest extends S.Class<CreateChannelRequest>(
  "CreateChannelRequest",
)(
  {
    CdiInputSpecification: S.optional(CdiInputSpecification).pipe(
      T.JsonName("cdiInputSpecification"),
    ),
    ChannelClass: S.optional(S.String).pipe(T.JsonName("channelClass")),
    Destinations: S.optional(__listOfOutputDestination).pipe(
      T.JsonName("destinations"),
    ),
    EncoderSettings: S.optional(EncoderSettings).pipe(
      T.JsonName("encoderSettings"),
    ),
    InputAttachments: S.optional(__listOfInputAttachment).pipe(
      T.JsonName("inputAttachments"),
    ),
    InputSpecification: S.optional(InputSpecification).pipe(
      T.JsonName("inputSpecification"),
    ),
    LogLevel: S.optional(S.String).pipe(T.JsonName("logLevel")),
    Maintenance: S.optional(MaintenanceCreateSettings).pipe(
      T.JsonName("maintenance"),
    ),
    Name: S.optional(S.String).pipe(T.JsonName("name")),
    RequestId: S.optional(S.String).pipe(T.JsonName("requestId")),
    Reserved: S.optional(S.String).pipe(T.JsonName("reserved")),
    RoleArn: S.optional(S.String).pipe(T.JsonName("roleArn")),
    Tags: S.optional(Tags).pipe(T.JsonName("tags")),
    Vpc: S.optional(VpcOutputSettings).pipe(T.JsonName("vpc")),
    AnywhereSettings: S.optional(AnywhereSettings).pipe(
      T.JsonName("anywhereSettings"),
    ),
    ChannelEngineVersion: S.optional(ChannelEngineVersionRequest).pipe(
      T.JsonName("channelEngineVersion"),
    ),
    DryRun: S.optional(S.Boolean).pipe(T.JsonName("dryRun")),
    LinkedChannelSettings: S.optional(LinkedChannelSettings).pipe(
      T.JsonName("linkedChannelSettings"),
    ),
  },
  T.all(
    T.Http({ method: "POST", uri: "/prod/channels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateChannelResponse extends S.Class<CreateChannelResponse>(
  "CreateChannelResponse",
)({ Channel: S.optional(Channel).pipe(T.JsonName("channel")) }) {}
export class BatchScheduleActionCreateResult extends S.Class<BatchScheduleActionCreateResult>(
  "BatchScheduleActionCreateResult",
)({
  ScheduleActions: __listOfScheduleAction.pipe(T.JsonName("scheduleActions")),
}) {}
export class BatchScheduleActionDeleteResult extends S.Class<BatchScheduleActionDeleteResult>(
  "BatchScheduleActionDeleteResult",
)({
  ScheduleActions: __listOfScheduleAction.pipe(T.JsonName("scheduleActions")),
}) {}
export class BatchUpdateScheduleResponse extends S.Class<BatchUpdateScheduleResponse>(
  "BatchUpdateScheduleResponse",
)({
  Creates: S.optional(BatchScheduleActionCreateResult).pipe(
    T.JsonName("creates"),
  ),
  Deletes: S.optional(BatchScheduleActionDeleteResult).pipe(
    T.JsonName("deletes"),
  ),
}) {}

//# Errors
export class BadGatewayException extends S.TaggedError<BadGatewayException>()(
  "BadGatewayException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class GatewayTimeoutException extends S.TaggedError<GatewayTimeoutException>()(
  "GatewayTimeoutException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String).pipe(T.JsonName("message")) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  {
    Message: S.optional(S.String).pipe(T.JsonName("message")),
    ValidationErrors: S.optional(__listOfValidationError).pipe(
      T.JsonName("validationErrors"),
    ),
  },
) {}

//# Operations
/**
 * Create tags for a resource
 */
export const createTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTagsRequest,
  output: CreateTagsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Retrieve a list of the existing multiplexes.
 */
export const listMultiplexes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMultiplexesRequest,
  output: ListMultiplexesResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete the specified ChannelPlacementGroup that exists in the specified Cluster.
 */
export const deleteChannelPlacementGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteChannelPlacementGroupRequest,
    output: DeleteChannelPlacementGroupResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Delete a Cluster. The Cluster must be idle.
 */
export const deleteCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete a multiplex. The multiplex must be idle.
 */
export const deleteMultiplex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMultiplexRequest,
  output: DeleteMultiplexResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the details for the input device
 */
export const describeInputDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInputDeviceRequest,
  output: DescribeInputDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Describe the latest thumbnails data.
 */
export const describeThumbnails = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeThumbnailsRequest,
  output: DescribeThumbnailsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates an input.
 */
export const updateInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInputRequest,
  output: UpdateInputResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Lists cloudwatch alarm template groups.
 */
export const listCloudWatchAlarmTemplateGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCloudWatchAlarmTemplateGroupsRequest,
    output: ListCloudWatchAlarmTemplateGroupsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Lists cloudwatch alarm templates.
 */
export const listCloudWatchAlarmTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListCloudWatchAlarmTemplatesRequest,
    output: ListCloudWatchAlarmTemplatesResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Lists eventbridge rule template groups.
 */
export const listEventBridgeRuleTemplateGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListEventBridgeRuleTemplateGroupsRequest,
    output: ListEventBridgeRuleTemplateGroupsResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Lists eventbridge rule templates.
 */
export const listEventBridgeRuleTemplates =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListEventBridgeRuleTemplatesRequest,
    output: ListEventBridgeRuleTemplatesResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Lists signal maps.
 */
export const listSignalMaps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSignalMapsRequest,
  output: ListSignalMapsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves the specified cloudwatch alarm template.
 */
export const getCloudWatchAlarmTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCloudWatchAlarmTemplateRequest,
    output: GetCloudWatchAlarmTemplateResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves the specified cloudwatch alarm template group.
 */
export const getCloudWatchAlarmTemplateGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCloudWatchAlarmTemplateGroupRequest,
    output: GetCloudWatchAlarmTemplateGroupResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieves the specified eventbridge rule template.
 */
export const getEventBridgeRuleTemplate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetEventBridgeRuleTemplateRequest,
    output: GetEventBridgeRuleTemplateResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieves the specified eventbridge rule template group.
 */
export const getEventBridgeRuleTemplateGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetEventBridgeRuleTemplateGroupRequest,
    output: GetEventBridgeRuleTemplateGroupResponse,
    errors: [
      BadRequestException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Retrieves the specified signal map.
 */
export const getSignalMap = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSignalMapRequest,
  output: GetSignalMapResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Produces list of tags that have been created for a resource
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Removes tags for a resource
 */
export const deleteTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagsRequest,
  output: DeleteTagsResponse,
  errors: [
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
  ],
}));
/**
 * Initiates a deployment to delete the monitor of the specified signal map.
 */
export const startDeleteMonitorDeployment =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartDeleteMonitorDeploymentRequest,
    output: StartDeleteMonitorDeploymentResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Initiates a deployment to deploy the latest monitor of the specified signal map.
 */
export const startMonitorDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMonitorDeploymentRequest,
    output: StartMonitorDeploymentResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Initiates an update for the specified signal map. Will discover a new signal map if a changed discoveryEntryPointArn is provided.
 */
export const startUpdateSignalMap = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartUpdateSignalMapRequest,
    output: StartUpdateSignalMapResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Updates the specified cloudwatch alarm template.
 */
export const updateCloudWatchAlarmTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCloudWatchAlarmTemplateRequest,
    output: UpdateCloudWatchAlarmTemplateResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Updates the specified cloudwatch alarm template group.
 */
export const updateCloudWatchAlarmTemplateGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateCloudWatchAlarmTemplateGroupRequest,
    output: UpdateCloudWatchAlarmTemplateGroupResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Updates the specified eventbridge rule template.
 */
export const updateEventBridgeRuleTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateEventBridgeRuleTemplateRequest,
    output: UpdateEventBridgeRuleTemplateResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Updates the specified eventbridge rule template group.
 */
export const updateEventBridgeRuleTemplateGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateEventBridgeRuleTemplateGroupRequest,
    output: UpdateEventBridgeRuleTemplateGroupResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Deletes a cloudwatch alarm template.
 */
export const deleteCloudWatchAlarmTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCloudWatchAlarmTemplateRequest,
    output: DeleteCloudWatchAlarmTemplateResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Deletes a cloudwatch alarm template group. You must detach this group from all signal maps and ensure its existing templates are moved to another group or deleted.
 */
export const deleteCloudWatchAlarmTemplateGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteCloudWatchAlarmTemplateGroupRequest,
    output: DeleteCloudWatchAlarmTemplateGroupResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Deletes an eventbridge rule template.
 */
export const deleteEventBridgeRuleTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteEventBridgeRuleTemplateRequest,
    output: DeleteEventBridgeRuleTemplateResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Deletes an eventbridge rule template group. You must detach this group from all signal maps and ensure its existing templates are moved to another group or deleted.
 */
export const deleteEventBridgeRuleTemplateGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteEventBridgeRuleTemplateGroupRequest,
    output: DeleteEventBridgeRuleTemplateGroupResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Deletes the specified signal map.
 */
export const deleteSignalMap = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSignalMapRequest,
  output: DeleteSignalMapResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a cloudwatch alarm template group to group your cloudwatch alarm templates and to attach to signal maps for dynamically creating alarms.
 */
export const createCloudWatchAlarmTemplateGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCloudWatchAlarmTemplateGroupRequest,
    output: CreateCloudWatchAlarmTemplateGroupResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Creates an eventbridge rule template group to group your eventbridge rule templates and to attach to signal maps for dynamically creating notification rules.
 */
export const createEventBridgeRuleTemplateGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateEventBridgeRuleTemplateGroupRequest,
    output: CreateEventBridgeRuleTemplateGroupResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Creates a cloudwatch alarm template to dynamically generate cloudwatch metric alarms on targeted resource types.
 */
export const createCloudWatchAlarmTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCloudWatchAlarmTemplateRequest,
    output: CreateCloudWatchAlarmTemplateResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Creates an eventbridge rule template to monitor events and send notifications to your targeted resources.
 */
export const createEventBridgeRuleTemplate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateEventBridgeRuleTemplateRequest,
    output: CreateEventBridgeRuleTemplateResponse,
    errors: [
      BadRequestException,
      ConflictException,
      ForbiddenException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Delete a program from a multiplex.
 */
export const deleteMultiplexProgram = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteMultiplexProgramRequest,
    output: DeleteMultiplexProgramResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Delete a Network. The Network must have no resources associated with it.
 */
export const deleteNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNetworkRequest,
  output: DeleteNetworkResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete a Node. The Node must be IDLE.
 */
export const deleteNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNodeRequest,
  output: DeleteNodeResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete an expired reservation.
 */
export const deleteReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReservationRequest,
  output: DeleteReservationResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Produces a summary of an Input Security Group
 */
export const describeInputSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeInputSecurityGroupRequest,
    output: DescribeInputSecurityGroupResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * List the alerts for a channel with optional filtering based on alert state.
 */
export const listAlerts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAlertsRequest,
  output: ListAlertsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * List the alerts for a cluster with optional filtering based on alert state.
 */
export const listClusterAlerts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListClusterAlertsRequest,
  output: ListClusterAlertsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * List the alerts for a multiplex with optional filtering based on alert state.
 */
export const listMultiplexAlerts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMultiplexAlertsRequest,
  output: ListMultiplexAlertsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * List the programs that currently exist for a specific multiplex.
 */
export const listMultiplexPrograms = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMultiplexProgramsRequest,
    output: ListMultiplexProgramsResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Purchase an offering and create a reservation.
 */
export const purchaseOffering = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PurchaseOfferingRequest,
  output: PurchaseOfferingResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets details about a channel
 */
export const describeChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChannelRequest,
  output: DescribeChannelResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get details about a ChannelPlacementGroup.
 */
export const describeChannelPlacementGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeChannelPlacementGroupRequest,
    output: DescribeChannelPlacementGroupResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Get details about a Cluster.
 */
export const describeCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClusterRequest,
  output: DescribeClusterResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get the latest thumbnail data for the input device.
 */
export const describeInputDeviceThumbnail =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeInputDeviceThumbnailRequest,
    output: DescribeInputDeviceThumbnailResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }));
/**
 * Gets details about a multiplex.
 */
export const describeMultiplex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMultiplexRequest,
  output: DescribeMultiplexResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get the details for a program in a multiplex.
 */
export const describeMultiplexProgram = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeMultiplexProgramRequest,
    output: DescribeMultiplexProgramResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Get details about a Network.
 */
export const describeNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNetworkRequest,
  output: DescribeNetworkResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get details about a Node in the specified Cluster.
 */
export const describeNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNodeRequest,
  output: DescribeNodeResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get details for an offering.
 */
export const describeOffering = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeOfferingRequest,
  output: DescribeOfferingResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get details for a reservation.
 */
export const describeReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReservationRequest,
  output: DescribeReservationResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Get a channel schedule
 */
export const describeSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeScheduleRequest,
  output: DescribeScheduleResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets details about a SdiSource.
 */
export const describeSdiSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSdiSourceRequest,
  output: DescribeSdiSourceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes an Input Security Group
 */
export const deleteInputSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteInputSecurityGroupRequest,
    output: DeleteInputSecurityGroupResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Delete all schedule actions on a channel.
 */
export const deleteSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScheduleRequest,
  output: DeleteScheduleResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Delete an SdiSource. The SdiSource must not be part of any SidSourceMapping and must not be attached to any input.
 */
export const deleteSdiSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSdiSourceRequest,
  output: DeleteSdiSourceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves an array of all the encoder engine versions that are available in this AWS account.
 */
export const listVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVersionsRequest,
  output: ListVersionsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Restart pipelines in one channel that is currently running.
 */
export const restartChannelPipelines = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RestartChannelPipelinesRequest,
    output: RestartChannelPipelinesResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Starts an existing channel
 */
export const startChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartChannelRequest,
  output: StartChannelResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Start (run) the multiplex. Starting the multiplex does not start the channels. You must explicitly start each channel.
 */
export const startMultiplex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMultiplexRequest,
  output: StartMultiplexResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Stops a running channel
 */
export const stopChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopChannelRequest,
  output: StopChannelResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Stops a running multiplex. If the multiplex isn't running, this action has no effect.
 */
export const stopMultiplex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopMultiplexRequest,
  output: StopMultiplexResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Update an Input Security Group's Whilelists.
 */
export const updateInputSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateInputSecurityGroupRequest,
    output: UpdateInputSecurityGroupResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
    ],
  }),
);
/**
 * Update reservation.
 */
export const updateReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReservationRequest,
  output: UpdateReservationResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the input end point
 */
export const deleteInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInputRequest,
  output: DeleteInputResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts existing resources
 */
export const batchStart = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchStartRequest,
  output: BatchStartResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Stops running resources
 */
export const batchStop = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchStopRequest,
  output: BatchStopResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts delete of resources.
 */
export const batchDelete = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteRequest,
  output: BatchDeleteResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Starts deletion of channel. The associated outputs are also deleted.
 */
export const deleteChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChannelRequest,
  output: DeleteChannelResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Initiates the creation of a new signal map. Will discover a new mediaResourceMap based on the provided discoveryEntryPointArn.
 */
export const createSignalMap = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSignalMapRequest,
  output: CreateSignalMapResponse,
  errors: [
    BadRequestException,
    ConflictException,
    ForbiddenException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Change the settings for a Cluster.
 */
export const updateCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterRequest,
  output: UpdateClusterResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve the list of ChannelPlacementGroups in the specified Cluster.
 */
export const listChannelPlacementGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListChannelPlacementGroupsRequest,
    output: ListChannelPlacementGroupsResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Produces list of channels that have been created
 */
export const listChannels = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListChannelsRequest,
  output: ListChannelsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve the list of Clusters.
 */
export const listClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListClustersRequest,
  output: ListClustersResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * List input devices
 */
export const listInputDevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInputDevicesRequest,
  output: ListInputDevicesResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Produces a list of Input Security Groups for an account
 */
export const listInputSecurityGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListInputSecurityGroupsRequest,
    output: ListInputSecurityGroupsResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Retrieve the list of Networks.
 */
export const listNetworks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNetworksRequest,
  output: ListNetworksResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieve the list of Nodes.
 */
export const listNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNodesRequest,
  output: ListNodesResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * List offerings available for purchase.
 */
export const listOfferings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListOfferingsRequest,
  output: ListOfferingsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * List purchased reservations.
 */
export const listReservations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReservationsRequest,
  output: ListReservationsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * List all the SdiSources in the AWS account.
 */
export const listSdiSources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSdiSourcesRequest,
  output: ListSdiSourcesResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Change the settings for a Network.
 */
export const updateNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNetworkRequest,
  output: UpdateNetworkResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Change the settings for a Node.
 */
export const updateNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNodeRequest,
  output: UpdateNodeResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Describe account configuration
 */
export const describeAccountConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAccountConfigurationRequest,
    output: DescribeAccountConfigurationResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      TooManyRequestsException,
    ],
  }));
/**
 * Produces list of inputs that have been created
 */
export const listInputs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListInputsRequest,
  output: ListInputsResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates a Input Security Group
 */
export const createInputSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateInputSecurityGroupRequest,
    output: CreateInputSecurityGroupResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Create a partner input
 */
export const createPartnerInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePartnerInputRequest,
  output: CreatePartnerInputResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Change some of the settings in an SdiSource.
 */
export const updateSdiSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSdiSourceRequest,
  output: UpdateSdiSourceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Create as many Networks as you need. You will associate one or more Clusters with each Network.Each Network provides MediaLive Anywhere with required information about the network in your organization that you are using for video encoding using MediaLive.
 */
export const createNetwork = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNetworkRequest,
  output: CreateNetworkResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Create the Register Node script for all the nodes intended for a specific Cluster. You will then run the script on each hardware unit that is intended for that Cluster. The script creates a Node in the specified Cluster. It then binds the Node to this hardware unit, and activates the node hardware for use with MediaLive Anywhere.
 */
export const createNodeRegistrationScript =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateNodeRegistrationScriptRequest,
    output: CreateNodeRegistrationScriptResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      TooManyRequestsException,
    ],
  }));
/**
 * Create an SdiSource for each video source that uses the SDI protocol. You will reference the SdiSource when you create an SDI input in MediaLive. You will also reference it in an SdiSourceMapping, in order to create a connection between the logical SdiSource and the physical SDI card and port that the physical SDI source uses.
 */
export const createSdiSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSdiSourceRequest,
  output: CreateSdiSourceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Create a new Cluster.
 */
export const createCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Produces details about an input
 */
export const describeInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInputRequest,
  output: DescribeInputResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
  ],
}));
/**
 * Create an input
 */
export const createInput = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateInputRequest,
  output: CreateInputResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates a channel.
 */
export const updateChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelRequest,
  output: UpdateChannelResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    UnprocessableEntityException,
  ],
}));
/**
 * Updates the parameters for the input device.
 */
export const updateInputDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateInputDeviceRequest,
  output: UpdateInputDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Updates a multiplex.
 */
export const updateMultiplex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMultiplexRequest,
  output: UpdateMultiplexResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    UnprocessableEntityException,
  ],
}));
/**
 * Changes the class of the channel.
 */
export const updateChannelClass = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChannelClassRequest,
  output: UpdateChannelClassResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Update a program in a multiplex.
 */
export const updateMultiplexProgram = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMultiplexProgramRequest,
    output: UpdateMultiplexProgramResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * Send a request to claim an AWS Elemental device that you have purchased from a third-party vendor. After the request succeeds, you will own the device.
 */
export const claimDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ClaimDeviceRequest,
  output: ClaimDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Send a reboot command to the specified input device. The device will begin rebooting within a few seconds of sending the command. When the reboot is complete, the device’s connection status will change to connected.
 */
export const rebootInputDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootInputDeviceRequest,
  output: RebootInputDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Start an input device that is attached to a MediaConnect flow. (There is no need to start a device that is attached to a MediaLive input; MediaLive starts the device when the channel starts.)
 */
export const startInputDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartInputDeviceRequest,
  output: StartInputDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Start a maintenance window for the specified input device. Starting a maintenance window will give the device up to two hours to install software. If the device was streaming prior to the maintenance, it will resume streaming when the software is fully installed. Devices automatically install updates while they are powered on and their MediaLive channels are stopped. A maintenance window allows you to update a device without having to stop MediaLive channels that use the device. The device must remain powered on and connected to the internet for the duration of the maintenance.
 */
export const startInputDeviceMaintenanceWindow =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartInputDeviceMaintenanceWindowRequest,
    output: StartInputDeviceMaintenanceWindowResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
      UnprocessableEntityException,
    ],
  }));
/**
 * Stop an input device that is attached to a MediaConnect flow. (There is no need to stop a device that is attached to a MediaLive input; MediaLive automatically stops the device when the channel stops.)
 */
export const stopInputDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopInputDeviceRequest,
  output: StopInputDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Cancel an input device transfer that you have requested.
 */
export const cancelInputDeviceTransfer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelInputDeviceTransferRequest,
    output: CancelInputDeviceTransferResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * Reject the transfer of the specified input device to your AWS account.
 */
export const rejectInputDeviceTransfer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RejectInputDeviceTransferRequest,
    output: RejectInputDeviceTransferResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * Start an input device transfer to another AWS account. After you make the request, the other account must accept or reject the transfer.
 */
export const transferInputDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TransferInputDeviceRequest,
  output: TransferInputDeviceResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Accept an incoming input device transfer. The ownership of the device will transfer to your AWS account.
 */
export const acceptInputDeviceTransfer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AcceptInputDeviceTransferRequest,
    output: AcceptInputDeviceTransferResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      NotFoundException,
      TooManyRequestsException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * List input devices that are currently being transferred. List input devices that you are transferring from your AWS account or input devices that another AWS account is transferring to you.
 */
export const listInputDeviceTransfers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListInputDeviceTransfersRequest,
    output: ListInputDeviceTransfersResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      TooManyRequestsException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * Update account configuration
 */
export const updateAccountConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountConfigurationRequest,
    output: UpdateAccountConfigurationResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      TooManyRequestsException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * Create a ChannelPlacementGroup in the specified Cluster. As part of the create operation, you specify the Nodes to attach the group to.After you create a ChannelPlacementGroup, you add Channels to the group (you do this by modifying the Channels to add them to a specific group). You now have an association of Channels to ChannelPlacementGroup, and ChannelPlacementGroup to Nodes. This association means that all the Channels in the group are able to run on any of the Nodes associated with the group.
 */
export const createChannelPlacementGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateChannelPlacementGroupRequest,
    output: CreateChannelPlacementGroupResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      TooManyRequestsException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * Create a Node in the specified Cluster. You can also create Nodes using the CreateNodeRegistrationScript. Note that you can't move a Node to another Cluster.
 */
export const createNode = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNodeRequest,
  output: CreateNodeResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Change the settings for a ChannelPlacementGroup.
 */
export const updateChannelPlacementGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateChannelPlacementGroupRequest,
    output: UpdateChannelPlacementGroupResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      TooManyRequestsException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * Update the state of a node.
 */
export const updateNodeState = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNodeStateRequest,
  output: UpdateNodeStateResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Create a new multiplex.
 */
export const createMultiplex = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMultiplexRequest,
  output: CreateMultiplexResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Create a new program in the multiplex.
 */
export const createMultiplexProgram = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateMultiplexProgramRequest,
    output: CreateMultiplexProgramResponse,
    errors: [
      BadGatewayException,
      BadRequestException,
      ConflictException,
      ForbiddenException,
      GatewayTimeoutException,
      InternalServerErrorException,
      TooManyRequestsException,
      UnprocessableEntityException,
    ],
  }),
);
/**
 * Creates a new channel
 */
export const createChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateChannelRequest,
  output: CreateChannelResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ConflictException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
/**
 * Update a channel schedule
 */
export const batchUpdateSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdateScheduleRequest,
  output: BatchUpdateScheduleResponse,
  errors: [
    BadGatewayException,
    BadRequestException,
    ForbiddenException,
    GatewayTimeoutException,
    InternalServerErrorException,
    NotFoundException,
    TooManyRequestsException,
    UnprocessableEntityException,
  ],
}));
