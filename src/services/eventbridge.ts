import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://events.amazonaws.com/doc/2015-10-07");
const svc = T.AwsApiService({
  sdkId: "EventBridge",
  serviceShapeName: "AWSEvents",
});
const auth = T.AwsAuthSigv4({ name: "events" });
const ver = T.ServiceVersion("2015-10-07");
const proto = T.AwsProtocolsAwsJson1_1();
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
    EndpointId: {
      required: false,
      documentation: "Operation parameter for EndpointId",
      type: "string",
    },
  },
  rules: [
    {
      conditions: [
        { fn: "not", argv: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }] },
        { fn: "isSet", argv: [{ ref: "Region" }] },
        {
          fn: "aws.partition",
          argv: [{ ref: "Region" }],
          assign: "PartitionResult",
        },
        {
          fn: "stringEquals",
          argv: [
            { fn: "getAttr", argv: [{ ref: "PartitionResult" }, "name"] },
            "aws-us-gov",
          ],
        },
        { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, true] },
        { fn: "booleanEquals", argv: [{ ref: "UseDualStack" }, true] },
      ],
      endpoint: {
        url: "https://events.{Region}.{PartitionResult#dualStackDnsSuffix}",
        properties: {},
        headers: {},
      },
      type: "endpoint",
    },
    {
      conditions: [
        { fn: "isSet", argv: [{ ref: "EndpointId" }] },
        { fn: "isSet", argv: [{ ref: "Region" }] },
        {
          fn: "aws.partition",
          argv: [{ ref: "Region" }],
          assign: "PartitionResult",
        },
      ],
      rules: [
        {
          conditions: [
            { fn: "isValidHostLabel", argv: [{ ref: "EndpointId" }, true] },
          ],
          rules: [
            {
              conditions: [
                { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
              ],
              rules: [
                {
                  conditions: [{ fn: "isSet", argv: [{ ref: "Endpoint" }] }],
                  endpoint: {
                    url: { ref: "Endpoint" },
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4a",
                          signingName: "events",
                          signingRegionSet: ["*"],
                        },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                            url: "https://{EndpointId}.endpoint.events.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4a",
                                  signingName: "events",
                                  signingRegionSet: ["*"],
                                },
                              ],
                            },
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
                    url: "https://{EndpointId}.endpoint.events.{PartitionResult#dnsSuffix}",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4a",
                          signingName: "events",
                          signingRegionSet: ["*"],
                        },
                      ],
                    },
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
                "Invalid Configuration: FIPS is not supported with EventBridge multi-region endpoints.",
              type: "error",
            },
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "EndpointId must be a valid host label.",
          type: "error",
        },
      ],
      type: "tree",
    },
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
                        url: "https://events-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-east-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://events.us-gov-east-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [{ ref: "Region" }, "us-gov-west-1"],
                        },
                      ],
                      endpoint: {
                        url: "https://events.us-gov-west-1.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://events-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://events.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://events.{Region}.{PartitionResult#dnsSuffix}",
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
export const TargetIdList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class ActivateEventSourceRequest extends S.Class<ActivateEventSourceRequest>(
  "ActivateEventSourceRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ActivateEventSourceResponse extends S.Class<ActivateEventSourceResponse>(
  "ActivateEventSourceResponse",
)({}, ns) {}
export class CancelReplayRequest extends S.Class<CancelReplayRequest>(
  "CancelReplayRequest",
)(
  { ReplayName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateApiDestinationRequest extends S.Class<CreateApiDestinationRequest>(
  "CreateApiDestinationRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    ConnectionArn: S.String,
    InvocationEndpoint: S.String,
    HttpMethod: S.String,
    InvocationRateLimitPerSecond: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateArchiveRequest extends S.Class<CreateArchiveRequest>(
  "CreateArchiveRequest",
)(
  {
    ArchiveName: S.String,
    EventSourceArn: S.String,
    Description: S.optional(S.String),
    EventPattern: S.optional(S.String),
    RetentionDays: S.optional(S.Number),
    KmsKeyIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePartnerEventSourceRequest extends S.Class<CreatePartnerEventSourceRequest>(
  "CreatePartnerEventSourceRequest",
)(
  { Name: S.String, Account: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeactivateEventSourceRequest extends S.Class<DeactivateEventSourceRequest>(
  "DeactivateEventSourceRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeactivateEventSourceResponse extends S.Class<DeactivateEventSourceResponse>(
  "DeactivateEventSourceResponse",
)({}, ns) {}
export class DeauthorizeConnectionRequest extends S.Class<DeauthorizeConnectionRequest>(
  "DeauthorizeConnectionRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApiDestinationRequest extends S.Class<DeleteApiDestinationRequest>(
  "DeleteApiDestinationRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteApiDestinationResponse extends S.Class<DeleteApiDestinationResponse>(
  "DeleteApiDestinationResponse",
)({}, ns) {}
export class DeleteArchiveRequest extends S.Class<DeleteArchiveRequest>(
  "DeleteArchiveRequest",
)(
  { ArchiveName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteArchiveResponse extends S.Class<DeleteArchiveResponse>(
  "DeleteArchiveResponse",
)({}, ns) {}
export class DeleteConnectionRequest extends S.Class<DeleteConnectionRequest>(
  "DeleteConnectionRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEndpointRequest extends S.Class<DeleteEndpointRequest>(
  "DeleteEndpointRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEndpointResponse extends S.Class<DeleteEndpointResponse>(
  "DeleteEndpointResponse",
)({}, ns) {}
export class DeleteEventBusRequest extends S.Class<DeleteEventBusRequest>(
  "DeleteEventBusRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEventBusResponse extends S.Class<DeleteEventBusResponse>(
  "DeleteEventBusResponse",
)({}, ns) {}
export class DeletePartnerEventSourceRequest extends S.Class<DeletePartnerEventSourceRequest>(
  "DeletePartnerEventSourceRequest",
)(
  { Name: S.String, Account: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePartnerEventSourceResponse extends S.Class<DeletePartnerEventSourceResponse>(
  "DeletePartnerEventSourceResponse",
)({}, ns) {}
export class DeleteRuleRequest extends S.Class<DeleteRuleRequest>(
  "DeleteRuleRequest",
)(
  {
    Name: S.String,
    EventBusName: S.optional(S.String),
    Force: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRuleResponse extends S.Class<DeleteRuleResponse>(
  "DeleteRuleResponse",
)({}, ns) {}
export class DescribeApiDestinationRequest extends S.Class<DescribeApiDestinationRequest>(
  "DescribeApiDestinationRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeArchiveRequest extends S.Class<DescribeArchiveRequest>(
  "DescribeArchiveRequest",
)(
  { ArchiveName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConnectionRequest extends S.Class<DescribeConnectionRequest>(
  "DescribeConnectionRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEndpointRequest extends S.Class<DescribeEndpointRequest>(
  "DescribeEndpointRequest",
)(
  { Name: S.String, HomeRegion: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventBusRequest extends S.Class<DescribeEventBusRequest>(
  "DescribeEventBusRequest",
)(
  { Name: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventSourceRequest extends S.Class<DescribeEventSourceRequest>(
  "DescribeEventSourceRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePartnerEventSourceRequest extends S.Class<DescribePartnerEventSourceRequest>(
  "DescribePartnerEventSourceRequest",
)(
  { Name: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReplayRequest extends S.Class<DescribeReplayRequest>(
  "DescribeReplayRequest",
)(
  { ReplayName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeRuleRequest extends S.Class<DescribeRuleRequest>(
  "DescribeRuleRequest",
)(
  { Name: S.String, EventBusName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableRuleRequest extends S.Class<DisableRuleRequest>(
  "DisableRuleRequest",
)(
  { Name: S.String, EventBusName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableRuleResponse extends S.Class<DisableRuleResponse>(
  "DisableRuleResponse",
)({}, ns) {}
export class EnableRuleRequest extends S.Class<EnableRuleRequest>(
  "EnableRuleRequest",
)(
  { Name: S.String, EventBusName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableRuleResponse extends S.Class<EnableRuleResponse>(
  "EnableRuleResponse",
)({}, ns) {}
export class ListApiDestinationsRequest extends S.Class<ListApiDestinationsRequest>(
  "ListApiDestinationsRequest",
)(
  {
    NamePrefix: S.optional(S.String),
    ConnectionArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListArchivesRequest extends S.Class<ListArchivesRequest>(
  "ListArchivesRequest",
)(
  {
    NamePrefix: S.optional(S.String),
    EventSourceArn: S.optional(S.String),
    State: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConnectionsRequest extends S.Class<ListConnectionsRequest>(
  "ListConnectionsRequest",
)(
  {
    NamePrefix: S.optional(S.String),
    ConnectionState: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEndpointsRequest extends S.Class<ListEndpointsRequest>(
  "ListEndpointsRequest",
)(
  {
    NamePrefix: S.optional(S.String),
    HomeRegion: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEventBusesRequest extends S.Class<ListEventBusesRequest>(
  "ListEventBusesRequest",
)(
  {
    NamePrefix: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEventSourcesRequest extends S.Class<ListEventSourcesRequest>(
  "ListEventSourcesRequest",
)(
  {
    NamePrefix: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPartnerEventSourceAccountsRequest extends S.Class<ListPartnerEventSourceAccountsRequest>(
  "ListPartnerEventSourceAccountsRequest",
)(
  {
    EventSourceName: S.String,
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPartnerEventSourcesRequest extends S.Class<ListPartnerEventSourcesRequest>(
  "ListPartnerEventSourcesRequest",
)(
  {
    NamePrefix: S.String,
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListReplaysRequest extends S.Class<ListReplaysRequest>(
  "ListReplaysRequest",
)(
  {
    NamePrefix: S.optional(S.String),
    State: S.optional(S.String),
    EventSourceArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRuleNamesByTargetRequest extends S.Class<ListRuleNamesByTargetRequest>(
  "ListRuleNamesByTargetRequest",
)(
  {
    TargetArn: S.String,
    EventBusName: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRulesRequest extends S.Class<ListRulesRequest>(
  "ListRulesRequest",
)(
  {
    NamePrefix: S.optional(S.String),
    EventBusName: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTargetsByRuleRequest extends S.Class<ListTargetsByRuleRequest>(
  "ListTargetsByRuleRequest",
)(
  {
    Rule: S.String,
    EventBusName: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class PutRuleRequest extends S.Class<PutRuleRequest>("PutRuleRequest")(
  {
    Name: S.String,
    ScheduleExpression: S.optional(S.String),
    EventPattern: S.optional(S.String),
    State: S.optional(S.String),
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
    Tags: S.optional(TagList),
    EventBusName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemovePermissionRequest extends S.Class<RemovePermissionRequest>(
  "RemovePermissionRequest",
)(
  {
    StatementId: S.optional(S.String),
    RemoveAllPermissions: S.optional(S.Boolean),
    EventBusName: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemovePermissionResponse extends S.Class<RemovePermissionResponse>(
  "RemovePermissionResponse",
)({}, ns) {}
export class RemoveTargetsRequest extends S.Class<RemoveTargetsRequest>(
  "RemoveTargetsRequest",
)(
  {
    Rule: S.String,
    EventBusName: S.optional(S.String),
    Ids: TargetIdList,
    Force: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class TestEventPatternRequest extends S.Class<TestEventPatternRequest>(
  "TestEventPatternRequest",
)(
  { EventPattern: S.String, Event: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class UpdateApiDestinationRequest extends S.Class<UpdateApiDestinationRequest>(
  "UpdateApiDestinationRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    ConnectionArn: S.optional(S.String),
    InvocationEndpoint: S.optional(S.String),
    HttpMethod: S.optional(S.String),
    InvocationRateLimitPerSecond: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateArchiveRequest extends S.Class<UpdateArchiveRequest>(
  "UpdateArchiveRequest",
)(
  {
    ArchiveName: S.String,
    Description: S.optional(S.String),
    EventPattern: S.optional(S.String),
    RetentionDays: S.optional(S.Number),
    KmsKeyIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Primary extends S.Class<Primary>("Primary")({
  HealthCheck: S.String,
}) {}
export class Secondary extends S.Class<Secondary>("Secondary")({
  Route: S.String,
}) {}
export class FailoverConfig extends S.Class<FailoverConfig>("FailoverConfig")({
  Primary: Primary,
  Secondary: Secondary,
}) {}
export class RoutingConfig extends S.Class<RoutingConfig>("RoutingConfig")({
  FailoverConfig: FailoverConfig,
}) {}
export class ReplicationConfig extends S.Class<ReplicationConfig>(
  "ReplicationConfig",
)({ State: S.optional(S.String) }) {}
export class EndpointEventBus extends S.Class<EndpointEventBus>(
  "EndpointEventBus",
)({ EventBusArn: S.String }) {}
export const EndpointEventBusList = S.Array(EndpointEventBus);
export class UpdateEndpointRequest extends S.Class<UpdateEndpointRequest>(
  "UpdateEndpointRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    RoutingConfig: S.optional(RoutingConfig),
    ReplicationConfig: S.optional(ReplicationConfig),
    EventBuses: S.optional(EndpointEventBusList),
    RoleArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeadLetterConfig extends S.Class<DeadLetterConfig>(
  "DeadLetterConfig",
)({ Arn: S.optional(S.String) }) {}
export class LogConfig extends S.Class<LogConfig>("LogConfig")({
  IncludeDetail: S.optional(S.String),
  Level: S.optional(S.String),
}) {}
export class UpdateEventBusRequest extends S.Class<UpdateEventBusRequest>(
  "UpdateEventBusRequest",
)(
  {
    Name: S.optional(S.String),
    KmsKeyIdentifier: S.optional(S.String),
    Description: S.optional(S.String),
    DeadLetterConfig: S.optional(DeadLetterConfig),
    LogConfig: S.optional(LogConfig),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const EventResourceList = S.Array(S.String);
export const ReplayDestinationFilters = S.Array(S.String);
export const RuleNameList = S.Array(S.String);
export class PutEventsRequestEntry extends S.Class<PutEventsRequestEntry>(
  "PutEventsRequestEntry",
)({
  Time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Source: S.optional(S.String),
  Resources: S.optional(EventResourceList),
  DetailType: S.optional(S.String),
  Detail: S.optional(S.String),
  EventBusName: S.optional(S.String),
  TraceHeader: S.optional(S.String),
}) {}
export const PutEventsRequestEntryList = S.Array(PutEventsRequestEntry);
export class PutPartnerEventsRequestEntry extends S.Class<PutPartnerEventsRequestEntry>(
  "PutPartnerEventsRequestEntry",
)({
  Time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Source: S.optional(S.String),
  Resources: S.optional(EventResourceList),
  DetailType: S.optional(S.String),
  Detail: S.optional(S.String),
}) {}
export const PutPartnerEventsRequestEntryList = S.Array(
  PutPartnerEventsRequestEntry,
);
export class Condition extends S.Class<Condition>("Condition")({
  Type: S.String,
  Key: S.String,
  Value: S.String,
}) {}
export class ReplayDestination extends S.Class<ReplayDestination>(
  "ReplayDestination",
)({ Arn: S.String, FilterArns: S.optional(ReplayDestinationFilters) }) {}
export const PathParameterList = S.Array(S.String);
export const Sqls = S.Array(S.String);
export class CancelReplayResponse extends S.Class<CancelReplayResponse>(
  "CancelReplayResponse",
)(
  {
    ReplayArn: S.optional(S.String),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
  },
  ns,
) {}
export class CreateApiDestinationResponse extends S.Class<CreateApiDestinationResponse>(
  "CreateApiDestinationResponse",
)(
  {
    ApiDestinationArn: S.optional(S.String),
    ApiDestinationState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class CreateArchiveResponse extends S.Class<CreateArchiveResponse>(
  "CreateArchiveResponse",
)(
  {
    ArchiveArn: S.optional(S.String),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class CreateEventBusRequest extends S.Class<CreateEventBusRequest>(
  "CreateEventBusRequest",
)(
  {
    Name: S.String,
    EventSourceName: S.optional(S.String),
    Description: S.optional(S.String),
    KmsKeyIdentifier: S.optional(S.String),
    DeadLetterConfig: S.optional(DeadLetterConfig),
    LogConfig: S.optional(LogConfig),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePartnerEventSourceResponse extends S.Class<CreatePartnerEventSourceResponse>(
  "CreatePartnerEventSourceResponse",
)({ EventSourceArn: S.optional(S.String) }, ns) {}
export class DeauthorizeConnectionResponse extends S.Class<DeauthorizeConnectionResponse>(
  "DeauthorizeConnectionResponse",
)(
  {
    ConnectionArn: S.optional(S.String),
    ConnectionState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastAuthorizedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class DeleteConnectionResponse extends S.Class<DeleteConnectionResponse>(
  "DeleteConnectionResponse",
)(
  {
    ConnectionArn: S.optional(S.String),
    ConnectionState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastAuthorizedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class DescribeApiDestinationResponse extends S.Class<DescribeApiDestinationResponse>(
  "DescribeApiDestinationResponse",
)(
  {
    ApiDestinationArn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ApiDestinationState: S.optional(S.String),
    ConnectionArn: S.optional(S.String),
    InvocationEndpoint: S.optional(S.String),
    HttpMethod: S.optional(S.String),
    InvocationRateLimitPerSecond: S.optional(S.Number),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class DescribeArchiveResponse extends S.Class<DescribeArchiveResponse>(
  "DescribeArchiveResponse",
)(
  {
    ArchiveArn: S.optional(S.String),
    ArchiveName: S.optional(S.String),
    EventSourceArn: S.optional(S.String),
    Description: S.optional(S.String),
    EventPattern: S.optional(S.String),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
    KmsKeyIdentifier: S.optional(S.String),
    RetentionDays: S.optional(S.Number),
    SizeBytes: S.optional(S.Number),
    EventCount: S.optional(S.Number),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class DescribeEndpointResponse extends S.Class<DescribeEndpointResponse>(
  "DescribeEndpointResponse",
)(
  {
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Arn: S.optional(S.String),
    RoutingConfig: S.optional(RoutingConfig),
    ReplicationConfig: S.optional(ReplicationConfig),
    EventBuses: S.optional(EndpointEventBusList),
    RoleArn: S.optional(S.String),
    EndpointId: S.optional(S.String),
    EndpointUrl: S.optional(S.String),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class DescribeEventBusResponse extends S.Class<DescribeEventBusResponse>(
  "DescribeEventBusResponse",
)(
  {
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    Description: S.optional(S.String),
    KmsKeyIdentifier: S.optional(S.String),
    DeadLetterConfig: S.optional(DeadLetterConfig),
    Policy: S.optional(S.String),
    LogConfig: S.optional(LogConfig),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class DescribeEventSourceResponse extends S.Class<DescribeEventSourceResponse>(
  "DescribeEventSourceResponse",
)(
  {
    Arn: S.optional(S.String),
    CreatedBy: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Name: S.optional(S.String),
    State: S.optional(S.String),
  },
  ns,
) {}
export class DescribePartnerEventSourceResponse extends S.Class<DescribePartnerEventSourceResponse>(
  "DescribePartnerEventSourceResponse",
)({ Arn: S.optional(S.String), Name: S.optional(S.String) }, ns) {}
export class DescribeReplayResponse extends S.Class<DescribeReplayResponse>(
  "DescribeReplayResponse",
)(
  {
    ReplayName: S.optional(S.String),
    ReplayArn: S.optional(S.String),
    Description: S.optional(S.String),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
    EventSourceArn: S.optional(S.String),
    Destination: S.optional(ReplayDestination),
    EventStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventLastReplayedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ReplayStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ReplayEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class DescribeRuleResponse extends S.Class<DescribeRuleResponse>(
  "DescribeRuleResponse",
)(
  {
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    EventPattern: S.optional(S.String),
    ScheduleExpression: S.optional(S.String),
    State: S.optional(S.String),
    Description: S.optional(S.String),
    RoleArn: S.optional(S.String),
    ManagedBy: S.optional(S.String),
    EventBusName: S.optional(S.String),
    CreatedBy: S.optional(S.String),
  },
  ns,
) {}
export class ListRuleNamesByTargetResponse extends S.Class<ListRuleNamesByTargetResponse>(
  "ListRuleNamesByTargetResponse",
)(
  { RuleNames: S.optional(RuleNameList), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }, ns) {}
export const TransformerPaths = S.Record({ key: S.String, value: S.String });
export class InputTransformer extends S.Class<InputTransformer>(
  "InputTransformer",
)({ InputPathsMap: S.optional(TransformerPaths), InputTemplate: S.String }) {}
export class KinesisParameters extends S.Class<KinesisParameters>(
  "KinesisParameters",
)({ PartitionKeyPath: S.String }) {}
export const RunCommandTargetValues = S.Array(S.String);
export class RunCommandTarget extends S.Class<RunCommandTarget>(
  "RunCommandTarget",
)({ Key: S.String, Values: RunCommandTargetValues }) {}
export const RunCommandTargets = S.Array(RunCommandTarget);
export class RunCommandParameters extends S.Class<RunCommandParameters>(
  "RunCommandParameters",
)({ RunCommandTargets: RunCommandTargets }) {}
export const StringList = S.Array(S.String);
export class AwsVpcConfiguration extends S.Class<AwsVpcConfiguration>(
  "AwsVpcConfiguration",
)({
  Subnets: StringList,
  SecurityGroups: S.optional(StringList),
  AssignPublicIp: S.optional(S.String),
}) {}
export class NetworkConfiguration extends S.Class<NetworkConfiguration>(
  "NetworkConfiguration",
)({ awsvpcConfiguration: S.optional(AwsVpcConfiguration) }) {}
export class CapacityProviderStrategyItem extends S.Class<CapacityProviderStrategyItem>(
  "CapacityProviderStrategyItem",
)({
  capacityProvider: S.String,
  weight: S.optional(S.Number),
  base: S.optional(S.Number),
}) {}
export const CapacityProviderStrategy = S.Array(CapacityProviderStrategyItem);
export class PlacementConstraint extends S.Class<PlacementConstraint>(
  "PlacementConstraint",
)({ type: S.optional(S.String), expression: S.optional(S.String) }) {}
export const PlacementConstraints = S.Array(PlacementConstraint);
export class PlacementStrategy extends S.Class<PlacementStrategy>(
  "PlacementStrategy",
)({ type: S.optional(S.String), field: S.optional(S.String) }) {}
export const PlacementStrategies = S.Array(PlacementStrategy);
export class EcsParameters extends S.Class<EcsParameters>("EcsParameters")({
  TaskDefinitionArn: S.String,
  TaskCount: S.optional(S.Number),
  LaunchType: S.optional(S.String),
  NetworkConfiguration: S.optional(NetworkConfiguration),
  PlatformVersion: S.optional(S.String),
  Group: S.optional(S.String),
  CapacityProviderStrategy: S.optional(CapacityProviderStrategy),
  EnableECSManagedTags: S.optional(S.Boolean),
  EnableExecuteCommand: S.optional(S.Boolean),
  PlacementConstraints: S.optional(PlacementConstraints),
  PlacementStrategy: S.optional(PlacementStrategies),
  PropagateTags: S.optional(S.String),
  ReferenceId: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export class BatchArrayProperties extends S.Class<BatchArrayProperties>(
  "BatchArrayProperties",
)({ Size: S.optional(S.Number) }) {}
export class BatchRetryStrategy extends S.Class<BatchRetryStrategy>(
  "BatchRetryStrategy",
)({ Attempts: S.optional(S.Number) }) {}
export class BatchParameters extends S.Class<BatchParameters>(
  "BatchParameters",
)({
  JobDefinition: S.String,
  JobName: S.String,
  ArrayProperties: S.optional(BatchArrayProperties),
  RetryStrategy: S.optional(BatchRetryStrategy),
}) {}
export class SqsParameters extends S.Class<SqsParameters>("SqsParameters")({
  MessageGroupId: S.optional(S.String),
}) {}
export const HeaderParametersMap = S.Record({ key: S.String, value: S.String });
export const QueryStringParametersMap = S.Record({
  key: S.String,
  value: S.String,
});
export class HttpParameters extends S.Class<HttpParameters>("HttpParameters")({
  PathParameterValues: S.optional(PathParameterList),
  HeaderParameters: S.optional(HeaderParametersMap),
  QueryStringParameters: S.optional(QueryStringParametersMap),
}) {}
export class RedshiftDataParameters extends S.Class<RedshiftDataParameters>(
  "RedshiftDataParameters",
)({
  SecretManagerArn: S.optional(S.String),
  Database: S.String,
  DbUser: S.optional(S.String),
  Sql: S.optional(S.String),
  StatementName: S.optional(S.String),
  WithEvent: S.optional(S.Boolean),
  Sqls: S.optional(Sqls),
}) {}
export class SageMakerPipelineParameter extends S.Class<SageMakerPipelineParameter>(
  "SageMakerPipelineParameter",
)({ Name: S.String, Value: S.String }) {}
export const SageMakerPipelineParameterList = S.Array(
  SageMakerPipelineParameter,
);
export class SageMakerPipelineParameters extends S.Class<SageMakerPipelineParameters>(
  "SageMakerPipelineParameters",
)({ PipelineParameterList: S.optional(SageMakerPipelineParameterList) }) {}
export class RetryPolicy extends S.Class<RetryPolicy>("RetryPolicy")({
  MaximumRetryAttempts: S.optional(S.Number),
  MaximumEventAgeInSeconds: S.optional(S.Number),
}) {}
export class AppSyncParameters extends S.Class<AppSyncParameters>(
  "AppSyncParameters",
)({ GraphQLOperation: S.optional(S.String) }) {}
export class Target extends S.Class<Target>("Target")({
  Id: S.String,
  Arn: S.String,
  RoleArn: S.optional(S.String),
  Input: S.optional(S.String),
  InputPath: S.optional(S.String),
  InputTransformer: S.optional(InputTransformer),
  KinesisParameters: S.optional(KinesisParameters),
  RunCommandParameters: S.optional(RunCommandParameters),
  EcsParameters: S.optional(EcsParameters),
  BatchParameters: S.optional(BatchParameters),
  SqsParameters: S.optional(SqsParameters),
  HttpParameters: S.optional(HttpParameters),
  RedshiftDataParameters: S.optional(RedshiftDataParameters),
  SageMakerPipelineParameters: S.optional(SageMakerPipelineParameters),
  DeadLetterConfig: S.optional(DeadLetterConfig),
  RetryPolicy: S.optional(RetryPolicy),
  AppSyncParameters: S.optional(AppSyncParameters),
}) {}
export const TargetList = S.Array(Target);
export class ListTargetsByRuleResponse extends S.Class<ListTargetsByRuleResponse>(
  "ListTargetsByRuleResponse",
)({ Targets: S.optional(TargetList), NextToken: S.optional(S.String) }, ns) {}
export class PutEventsRequest extends S.Class<PutEventsRequest>(
  "PutEventsRequest",
)(
  {
    Entries: PutEventsRequestEntryList,
    EndpointId: S.optional(S.String).pipe(T.ContextParam("EndpointId")),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutPartnerEventsRequest extends S.Class<PutPartnerEventsRequest>(
  "PutPartnerEventsRequest",
)(
  { Entries: PutPartnerEventsRequestEntryList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutPermissionRequest extends S.Class<PutPermissionRequest>(
  "PutPermissionRequest",
)(
  {
    EventBusName: S.optional(S.String),
    Action: S.optional(S.String),
    Principal: S.optional(S.String),
    StatementId: S.optional(S.String),
    Condition: S.optional(Condition),
    Policy: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutPermissionResponse extends S.Class<PutPermissionResponse>(
  "PutPermissionResponse",
)({}, ns) {}
export class PutRuleResponse extends S.Class<PutRuleResponse>(
  "PutRuleResponse",
)({ RuleArn: S.optional(S.String) }, ns) {}
export class StartReplayRequest extends S.Class<StartReplayRequest>(
  "StartReplayRequest",
)(
  {
    ReplayName: S.String,
    Description: S.optional(S.String),
    EventSourceArn: S.String,
    EventStartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EventEndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Destination: ReplayDestination,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TestEventPatternResponse extends S.Class<TestEventPatternResponse>(
  "TestEventPatternResponse",
)({ Result: S.optional(S.Boolean) }, ns) {}
export class UpdateApiDestinationResponse extends S.Class<UpdateApiDestinationResponse>(
  "UpdateApiDestinationResponse",
)(
  {
    ApiDestinationArn: S.optional(S.String),
    ApiDestinationState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class UpdateArchiveResponse extends S.Class<UpdateArchiveResponse>(
  "UpdateArchiveResponse",
)(
  {
    ArchiveArn: S.optional(S.String),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class UpdateEndpointResponse extends S.Class<UpdateEndpointResponse>(
  "UpdateEndpointResponse",
)(
  {
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    RoutingConfig: S.optional(RoutingConfig),
    ReplicationConfig: S.optional(ReplicationConfig),
    EventBuses: S.optional(EndpointEventBusList),
    RoleArn: S.optional(S.String),
    EndpointId: S.optional(S.String),
    EndpointUrl: S.optional(S.String),
    State: S.optional(S.String),
  },
  ns,
) {}
export class UpdateEventBusResponse extends S.Class<UpdateEventBusResponse>(
  "UpdateEventBusResponse",
)(
  {
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    KmsKeyIdentifier: S.optional(S.String),
    Description: S.optional(S.String),
    DeadLetterConfig: S.optional(DeadLetterConfig),
    LogConfig: S.optional(LogConfig),
  },
  ns,
) {}
export class CreateConnectionBasicAuthRequestParameters extends S.Class<CreateConnectionBasicAuthRequestParameters>(
  "CreateConnectionBasicAuthRequestParameters",
)({ Username: S.String, Password: S.String }) {}
export class CreateConnectionApiKeyAuthRequestParameters extends S.Class<CreateConnectionApiKeyAuthRequestParameters>(
  "CreateConnectionApiKeyAuthRequestParameters",
)({ ApiKeyName: S.String, ApiKeyValue: S.String }) {}
export class ConnectivityResourceConfigurationArn extends S.Class<ConnectivityResourceConfigurationArn>(
  "ConnectivityResourceConfigurationArn",
)({ ResourceConfigurationArn: S.String }) {}
export class UpdateConnectionBasicAuthRequestParameters extends S.Class<UpdateConnectionBasicAuthRequestParameters>(
  "UpdateConnectionBasicAuthRequestParameters",
)({ Username: S.optional(S.String), Password: S.optional(S.String) }) {}
export class UpdateConnectionApiKeyAuthRequestParameters extends S.Class<UpdateConnectionApiKeyAuthRequestParameters>(
  "UpdateConnectionApiKeyAuthRequestParameters",
)({ ApiKeyName: S.optional(S.String), ApiKeyValue: S.optional(S.String) }) {}
export class ConnectivityResourceParameters extends S.Class<ConnectivityResourceParameters>(
  "ConnectivityResourceParameters",
)({ ResourceParameters: ConnectivityResourceConfigurationArn }) {}
export class ApiDestination extends S.Class<ApiDestination>("ApiDestination")({
  ApiDestinationArn: S.optional(S.String),
  Name: S.optional(S.String),
  ApiDestinationState: S.optional(S.String),
  ConnectionArn: S.optional(S.String),
  InvocationEndpoint: S.optional(S.String),
  HttpMethod: S.optional(S.String),
  InvocationRateLimitPerSecond: S.optional(S.Number),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ApiDestinationResponseList = S.Array(ApiDestination);
export class Archive extends S.Class<Archive>("Archive")({
  ArchiveName: S.optional(S.String),
  EventSourceArn: S.optional(S.String),
  State: S.optional(S.String),
  StateReason: S.optional(S.String),
  RetentionDays: S.optional(S.Number),
  SizeBytes: S.optional(S.Number),
  EventCount: S.optional(S.Number),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ArchiveResponseList = S.Array(Archive);
export class Connection extends S.Class<Connection>("Connection")({
  ConnectionArn: S.optional(S.String),
  Name: S.optional(S.String),
  ConnectionState: S.optional(S.String),
  StateReason: S.optional(S.String),
  AuthorizationType: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastAuthorizedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ConnectionResponseList = S.Array(Connection);
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Arn: S.optional(S.String),
  RoutingConfig: S.optional(RoutingConfig),
  ReplicationConfig: S.optional(ReplicationConfig),
  EventBuses: S.optional(EndpointEventBusList),
  RoleArn: S.optional(S.String),
  EndpointId: S.optional(S.String),
  EndpointUrl: S.optional(S.String),
  State: S.optional(S.String),
  StateReason: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EndpointList = S.Array(Endpoint);
export class EventBus extends S.Class<EventBus>("EventBus")({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  Description: S.optional(S.String),
  Policy: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const EventBusList = S.Array(EventBus);
export class EventSource extends S.Class<EventSource>("EventSource")({
  Arn: S.optional(S.String),
  CreatedBy: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Name: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export const EventSourceList = S.Array(EventSource);
export class PartnerEventSourceAccount extends S.Class<PartnerEventSourceAccount>(
  "PartnerEventSourceAccount",
)({
  Account: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExpirationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.optional(S.String),
}) {}
export const PartnerEventSourceAccountList = S.Array(PartnerEventSourceAccount);
export class PartnerEventSource extends S.Class<PartnerEventSource>(
  "PartnerEventSource",
)({ Arn: S.optional(S.String), Name: S.optional(S.String) }) {}
export const PartnerEventSourceList = S.Array(PartnerEventSource);
export class Replay extends S.Class<Replay>("Replay")({
  ReplayName: S.optional(S.String),
  EventSourceArn: S.optional(S.String),
  State: S.optional(S.String),
  StateReason: S.optional(S.String),
  EventStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EventEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EventLastReplayedTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ReplayStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReplayEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ReplayList = S.Array(Replay);
export class Rule extends S.Class<Rule>("Rule")({
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
  EventPattern: S.optional(S.String),
  State: S.optional(S.String),
  Description: S.optional(S.String),
  ScheduleExpression: S.optional(S.String),
  RoleArn: S.optional(S.String),
  ManagedBy: S.optional(S.String),
  EventBusName: S.optional(S.String),
}) {}
export const RuleResponseList = S.Array(Rule);
export class RemoveTargetsResultEntry extends S.Class<RemoveTargetsResultEntry>(
  "RemoveTargetsResultEntry",
)({
  TargetId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const RemoveTargetsResultEntryList = S.Array(RemoveTargetsResultEntry);
export class CreateConnectionOAuthClientRequestParameters extends S.Class<CreateConnectionOAuthClientRequestParameters>(
  "CreateConnectionOAuthClientRequestParameters",
)({ ClientID: S.String, ClientSecret: S.String }) {}
export class ConnectionHeaderParameter extends S.Class<ConnectionHeaderParameter>(
  "ConnectionHeaderParameter",
)({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  IsValueSecret: S.optional(S.Boolean),
}) {}
export const ConnectionHeaderParametersList = S.Array(
  ConnectionHeaderParameter,
);
export class ConnectionQueryStringParameter extends S.Class<ConnectionQueryStringParameter>(
  "ConnectionQueryStringParameter",
)({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  IsValueSecret: S.optional(S.Boolean),
}) {}
export const ConnectionQueryStringParametersList = S.Array(
  ConnectionQueryStringParameter,
);
export class ConnectionBodyParameter extends S.Class<ConnectionBodyParameter>(
  "ConnectionBodyParameter",
)({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  IsValueSecret: S.optional(S.Boolean),
}) {}
export const ConnectionBodyParametersList = S.Array(ConnectionBodyParameter);
export class UpdateConnectionOAuthClientRequestParameters extends S.Class<UpdateConnectionOAuthClientRequestParameters>(
  "UpdateConnectionOAuthClientRequestParameters",
)({ ClientID: S.optional(S.String), ClientSecret: S.optional(S.String) }) {}
export class CreateEventBusResponse extends S.Class<CreateEventBusResponse>(
  "CreateEventBusResponse",
)(
  {
    EventBusArn: S.optional(S.String),
    Description: S.optional(S.String),
    KmsKeyIdentifier: S.optional(S.String),
    DeadLetterConfig: S.optional(DeadLetterConfig),
    LogConfig: S.optional(LogConfig),
  },
  ns,
) {}
export class ListApiDestinationsResponse extends S.Class<ListApiDestinationsResponse>(
  "ListApiDestinationsResponse",
)(
  {
    ApiDestinations: S.optional(ApiDestinationResponseList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListArchivesResponse extends S.Class<ListArchivesResponse>(
  "ListArchivesResponse",
)(
  {
    Archives: S.optional(ArchiveResponseList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListConnectionsResponse extends S.Class<ListConnectionsResponse>(
  "ListConnectionsResponse",
)(
  {
    Connections: S.optional(ConnectionResponseList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListEndpointsResponse extends S.Class<ListEndpointsResponse>(
  "ListEndpointsResponse",
)(
  { Endpoints: S.optional(EndpointList), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListEventBusesResponse extends S.Class<ListEventBusesResponse>(
  "ListEventBusesResponse",
)(
  { EventBuses: S.optional(EventBusList), NextToken: S.optional(S.String) },
  ns,
) {}
export class ListEventSourcesResponse extends S.Class<ListEventSourcesResponse>(
  "ListEventSourcesResponse",
)(
  {
    EventSources: S.optional(EventSourceList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListPartnerEventSourceAccountsResponse extends S.Class<ListPartnerEventSourceAccountsResponse>(
  "ListPartnerEventSourceAccountsResponse",
)(
  {
    PartnerEventSourceAccounts: S.optional(PartnerEventSourceAccountList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListPartnerEventSourcesResponse extends S.Class<ListPartnerEventSourcesResponse>(
  "ListPartnerEventSourcesResponse",
)(
  {
    PartnerEventSources: S.optional(PartnerEventSourceList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListReplaysResponse extends S.Class<ListReplaysResponse>(
  "ListReplaysResponse",
)({ Replays: S.optional(ReplayList), NextToken: S.optional(S.String) }, ns) {}
export class ListRulesResponse extends S.Class<ListRulesResponse>(
  "ListRulesResponse",
)(
  { Rules: S.optional(RuleResponseList), NextToken: S.optional(S.String) },
  ns,
) {}
export class RemoveTargetsResponse extends S.Class<RemoveTargetsResponse>(
  "RemoveTargetsResponse",
)(
  {
    FailedEntryCount: S.optional(S.Number),
    FailedEntries: S.optional(RemoveTargetsResultEntryList),
  },
  ns,
) {}
export class StartReplayResponse extends S.Class<StartReplayResponse>(
  "StartReplayResponse",
)(
  {
    ReplayArn: S.optional(S.String),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
    ReplayStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class ConnectionHttpParameters extends S.Class<ConnectionHttpParameters>(
  "ConnectionHttpParameters",
)({
  HeaderParameters: S.optional(ConnectionHeaderParametersList),
  QueryStringParameters: S.optional(ConnectionQueryStringParametersList),
  BodyParameters: S.optional(ConnectionBodyParametersList),
}) {}
export class CreateConnectionOAuthRequestParameters extends S.Class<CreateConnectionOAuthRequestParameters>(
  "CreateConnectionOAuthRequestParameters",
)({
  ClientParameters: CreateConnectionOAuthClientRequestParameters,
  AuthorizationEndpoint: S.String,
  HttpMethod: S.String,
  OAuthHttpParameters: S.optional(ConnectionHttpParameters),
}) {}
export class DescribeConnectionResourceParameters extends S.Class<DescribeConnectionResourceParameters>(
  "DescribeConnectionResourceParameters",
)({ ResourceConfigurationArn: S.String, ResourceAssociationArn: S.String }) {}
export class ConnectionBasicAuthResponseParameters extends S.Class<ConnectionBasicAuthResponseParameters>(
  "ConnectionBasicAuthResponseParameters",
)({ Username: S.optional(S.String) }) {}
export class ConnectionApiKeyAuthResponseParameters extends S.Class<ConnectionApiKeyAuthResponseParameters>(
  "ConnectionApiKeyAuthResponseParameters",
)({ ApiKeyName: S.optional(S.String) }) {}
export class UpdateConnectionOAuthRequestParameters extends S.Class<UpdateConnectionOAuthRequestParameters>(
  "UpdateConnectionOAuthRequestParameters",
)({
  ClientParameters: S.optional(UpdateConnectionOAuthClientRequestParameters),
  AuthorizationEndpoint: S.optional(S.String),
  HttpMethod: S.optional(S.String),
  OAuthHttpParameters: S.optional(ConnectionHttpParameters),
}) {}
export class CreateConnectionAuthRequestParameters extends S.Class<CreateConnectionAuthRequestParameters>(
  "CreateConnectionAuthRequestParameters",
)({
  BasicAuthParameters: S.optional(CreateConnectionBasicAuthRequestParameters),
  OAuthParameters: S.optional(CreateConnectionOAuthRequestParameters),
  ApiKeyAuthParameters: S.optional(CreateConnectionApiKeyAuthRequestParameters),
  InvocationHttpParameters: S.optional(ConnectionHttpParameters),
  ConnectivityParameters: S.optional(ConnectivityResourceParameters),
}) {}
export class DescribeConnectionConnectivityParameters extends S.Class<DescribeConnectionConnectivityParameters>(
  "DescribeConnectionConnectivityParameters",
)({ ResourceParameters: DescribeConnectionResourceParameters }) {}
export class PutEventsResultEntry extends S.Class<PutEventsResultEntry>(
  "PutEventsResultEntry",
)({
  EventId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const PutEventsResultEntryList = S.Array(PutEventsResultEntry);
export class PutPartnerEventsResultEntry extends S.Class<PutPartnerEventsResultEntry>(
  "PutPartnerEventsResultEntry",
)({
  EventId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const PutPartnerEventsResultEntryList = S.Array(
  PutPartnerEventsResultEntry,
);
export class UpdateConnectionAuthRequestParameters extends S.Class<UpdateConnectionAuthRequestParameters>(
  "UpdateConnectionAuthRequestParameters",
)({
  BasicAuthParameters: S.optional(UpdateConnectionBasicAuthRequestParameters),
  OAuthParameters: S.optional(UpdateConnectionOAuthRequestParameters),
  ApiKeyAuthParameters: S.optional(UpdateConnectionApiKeyAuthRequestParameters),
  InvocationHttpParameters: S.optional(ConnectionHttpParameters),
  ConnectivityParameters: S.optional(ConnectivityResourceParameters),
}) {}
export class ConnectionOAuthClientResponseParameters extends S.Class<ConnectionOAuthClientResponseParameters>(
  "ConnectionOAuthClientResponseParameters",
)({ ClientID: S.optional(S.String) }) {}
export class CreateConnectionRequest extends S.Class<CreateConnectionRequest>(
  "CreateConnectionRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    AuthorizationType: S.String,
    AuthParameters: CreateConnectionAuthRequestParameters,
    InvocationConnectivityParameters: S.optional(
      ConnectivityResourceParameters,
    ),
    KmsKeyIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEndpointRequest extends S.Class<CreateEndpointRequest>(
  "CreateEndpointRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    RoutingConfig: RoutingConfig,
    ReplicationConfig: S.optional(ReplicationConfig),
    EventBuses: EndpointEventBusList,
    RoleArn: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutEventsResponse extends S.Class<PutEventsResponse>(
  "PutEventsResponse",
)(
  {
    FailedEntryCount: S.optional(S.Number),
    Entries: S.optional(PutEventsResultEntryList),
  },
  ns,
) {}
export class PutPartnerEventsResponse extends S.Class<PutPartnerEventsResponse>(
  "PutPartnerEventsResponse",
)(
  {
    FailedEntryCount: S.optional(S.Number),
    Entries: S.optional(PutPartnerEventsResultEntryList),
  },
  ns,
) {}
export class UpdateConnectionRequest extends S.Class<UpdateConnectionRequest>(
  "UpdateConnectionRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    AuthorizationType: S.optional(S.String),
    AuthParameters: S.optional(UpdateConnectionAuthRequestParameters),
    InvocationConnectivityParameters: S.optional(
      ConnectivityResourceParameters,
    ),
    KmsKeyIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ConnectionOAuthResponseParameters extends S.Class<ConnectionOAuthResponseParameters>(
  "ConnectionOAuthResponseParameters",
)({
  ClientParameters: S.optional(ConnectionOAuthClientResponseParameters),
  AuthorizationEndpoint: S.optional(S.String),
  HttpMethod: S.optional(S.String),
  OAuthHttpParameters: S.optional(ConnectionHttpParameters),
}) {}
export class ConnectionAuthResponseParameters extends S.Class<ConnectionAuthResponseParameters>(
  "ConnectionAuthResponseParameters",
)({
  BasicAuthParameters: S.optional(ConnectionBasicAuthResponseParameters),
  OAuthParameters: S.optional(ConnectionOAuthResponseParameters),
  ApiKeyAuthParameters: S.optional(ConnectionApiKeyAuthResponseParameters),
  InvocationHttpParameters: S.optional(ConnectionHttpParameters),
  ConnectivityParameters: S.optional(DescribeConnectionConnectivityParameters),
}) {}
export class CreateConnectionResponse extends S.Class<CreateConnectionResponse>(
  "CreateConnectionResponse",
)(
  {
    ConnectionArn: S.optional(S.String),
    ConnectionState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class CreateEndpointResponse extends S.Class<CreateEndpointResponse>(
  "CreateEndpointResponse",
)(
  {
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
    RoutingConfig: S.optional(RoutingConfig),
    ReplicationConfig: S.optional(ReplicationConfig),
    EventBuses: S.optional(EndpointEventBusList),
    RoleArn: S.optional(S.String),
    State: S.optional(S.String),
  },
  ns,
) {}
export class DescribeConnectionResponse extends S.Class<DescribeConnectionResponse>(
  "DescribeConnectionResponse",
)(
  {
    ConnectionArn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    InvocationConnectivityParameters: S.optional(
      DescribeConnectionConnectivityParameters,
    ),
    ConnectionState: S.optional(S.String),
    StateReason: S.optional(S.String),
    AuthorizationType: S.optional(S.String),
    SecretArn: S.optional(S.String),
    KmsKeyIdentifier: S.optional(S.String),
    AuthParameters: S.optional(ConnectionAuthResponseParameters),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastAuthorizedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class PutTargetsRequest extends S.Class<PutTargetsRequest>(
  "PutTargetsRequest",
)(
  { Rule: S.String, EventBusName: S.optional(S.String), Targets: TargetList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateConnectionResponse extends S.Class<UpdateConnectionResponse>(
  "UpdateConnectionResponse",
)(
  {
    ConnectionArn: S.optional(S.String),
    ConnectionState: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastAuthorizedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  ns,
) {}
export class PutTargetsResultEntry extends S.Class<PutTargetsResultEntry>(
  "PutTargetsResultEntry",
)({
  TargetId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const PutTargetsResultEntryList = S.Array(PutTargetsResultEntry);
export class PutTargetsResponse extends S.Class<PutTargetsResponse>(
  "PutTargetsResponse",
)(
  {
    FailedEntryCount: S.optional(S.Number),
    FailedEntries: S.optional(PutTargetsResultEntryList),
  },
  ns,
) {}

//# Errors
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
) {}
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  { message: S.optional(S.String) },
) {}
export class IllegalStatusException extends S.TaggedError<IllegalStatusException>()(
  "IllegalStatusException",
  { message: S.optional(S.String) },
) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class OperationDisabledException extends S.TaggedError<OperationDisabledException>()(
  "OperationDisabledException",
  { message: S.optional(S.String) },
) {}
export class ManagedRuleException extends S.TaggedError<ManagedRuleException>()(
  "ManagedRuleException",
  { message: S.optional(S.String) },
) {}
export class InvalidEventPatternException extends S.TaggedError<InvalidEventPatternException>()(
  "InvalidEventPatternException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class PolicyLengthExceededException extends S.TaggedError<PolicyLengthExceededException>()(
  "PolicyLengthExceededException",
  { message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves a list of API destination in the account in the current Region.
 */
export const listApiDestinations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListApiDestinationsRequest,
  output: ListApiDestinationsResponse,
  errors: [InternalException],
}));
/**
 * Retrieves a list of connections from the account.
 */
export const listConnections = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConnectionsRequest,
  output: ListConnectionsResponse,
  errors: [InternalException],
}));
/**
 * List the global endpoints associated with this account. For more information about global
 * endpoints, see Making applications
 * Regional-fault tolerant with global endpoints and event replication in the
 *
 * *Amazon EventBridge User Guide*
 * .
 */
export const listEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEndpointsRequest,
  output: ListEndpointsResponse,
  errors: [InternalException],
}));
/**
 * Lists all the event buses in your account, including the default event bus, custom event
 * buses, and partner event buses.
 */
export const listEventBuses = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEventBusesRequest,
  output: ListEventBusesResponse,
  errors: [InternalException],
}));
/**
 * Lists your replays. You can either list all the replays or you can provide a prefix to
 * match to the replay names. Filter parameters are exclusive.
 */
export const listReplays = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListReplaysRequest,
  output: ListReplaysResponse,
  errors: [InternalException],
}));
/**
 * Deletes the specified custom event bus or partner event bus. All rules associated with
 * this event bus need to be deleted. You can't delete your account's default event bus.
 */
export const deleteEventBus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEventBusRequest,
  output: DeleteEventBusResponse,
  errors: [ConcurrentModificationException, InternalException],
}));
/**
 * Cancels the specified replay.
 */
export const cancelReplay = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelReplayRequest,
  output: CancelReplayResponse,
  errors: [
    ConcurrentModificationException,
    IllegalStatusException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * You can use this to see all the partner event sources that have been shared with your
 * Amazon Web Services account. For more information about partner event sources, see CreateEventBus.
 */
export const listEventSources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEventSourcesRequest,
  output: ListEventSourcesResponse,
  errors: [InternalException, OperationDisabledException],
}));
/**
 * Sends custom events to Amazon EventBridge so that they can be matched to rules.
 *
 * You can batch multiple event entries into one request for efficiency.
 * However, the total entry size must be less than 256KB. You can calculate the entry size before you send the events.
 * For more information, see Calculating PutEvents event entry
 * size in the
 * *Amazon EventBridge User Guide*
 * .
 *
 * PutEvents accepts the data in JSON format. For the JSON number (integer) data type, the
 * constraints are: a minimum value of -9,223,372,036,854,775,808 and a maximum value of
 * 9,223,372,036,854,775,807.
 *
 * PutEvents will only process nested JSON up to 1000 levels deep.
 */
export const putEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutEventsRequest,
  output: PutEventsResponse,
  errors: [InternalException],
}));
/**
 * This is used by SaaS partners to write events to a customer's partner event bus. Amazon Web Services customers do not use this operation.
 *
 * For information on calculating event batch size, see Calculating EventBridge PutEvents event
 * entry size in the *EventBridge User Guide*.
 */
export const putPartnerEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPartnerEventsRequest,
  output: PutPartnerEventsResponse,
  errors: [InternalException, OperationDisabledException],
}));
/**
 * Removes the specified targets from the specified rule. When the rule is triggered, those
 * targets are no longer be invoked.
 *
 * A successful execution of `RemoveTargets` doesn't guarantee all targets are
 * removed from the rule, it means that the target(s) listed in the request are removed.
 *
 * When you remove a target, when the associated rule triggers, removed targets might
 * continue to be invoked. Allow a short period of time for changes to take effect.
 *
 * This action can partially fail if too many requests are made at the same time. If that
 * happens, `FailedEntryCount` is non-zero in the response and each entry in
 * `FailedEntries` provides the ID of the failed target and the error code.
 *
 * The maximum number of entries per request is 10.
 */
export const removeTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTargetsRequest,
  output: RemoveTargetsResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves details about an archive.
 */
export const describeArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeArchiveRequest,
  output: DescribeArchiveResponse,
  errors: [
    InternalException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a new event bus within your account. This can be a custom event bus which you can
 * use to receive events from your custom applications and services, or it can be a partner event
 * bus which can be matched to a partner event source.
 */
export const createEventBus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEventBusRequest,
  output: CreateEventBusResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    InvalidStateException,
    LimitExceededException,
    OperationDisabledException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * You can use this operation to temporarily stop receiving events from the specified partner
 * event source. The matching event bus is not deleted.
 *
 * When you deactivate a partner event source, the source goes into PENDING state. If it
 * remains in PENDING state for more than two weeks, it is deleted.
 *
 * To activate a deactivated partner event source, use ActivateEventSource.
 */
export const deactivateEventSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeactivateEventSourceRequest,
    output: DeactivateEventSourceResponse,
    errors: [
      ConcurrentModificationException,
      InternalException,
      InvalidStateException,
      OperationDisabledException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Lists your archives. You can either list all the archives or you can provide a prefix to
 * match to the archive names. Filter parameters are exclusive.
 */
export const listArchives = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListArchivesRequest,
  output: ListArchivesResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Lists your Amazon EventBridge rules. You can either list all the rules or you can
 * provide a prefix to match to the rule names.
 *
 * The maximum number of results per page for requests is 100.
 *
 * ListRules does not list the targets of a rule. To see the targets associated with a rule,
 * use ListTargetsByRule.
 */
export const listRules = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRulesRequest,
  output: ListRulesResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Removes all authorization parameters from the connection. This lets you remove the secret
 * from the connection so you can reuse it without having to create a new connection.
 */
export const deauthorizeConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeauthorizeConnectionRequest,
    output: DeauthorizeConnectionResponse,
    errors: [
      ConcurrentModificationException,
      InternalException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes a connection.
 */
export const deleteConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRequest,
  output: DeleteConnectionResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves details about an API destination.
 */
export const describeApiDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeApiDestinationRequest,
    output: DescribeApiDestinationResponse,
    errors: [InternalException, ResourceNotFoundException],
  }),
);
/**
 * Get the information about an existing global endpoint. For more information about global
 * endpoints, see Making applications
 * Regional-fault tolerant with global endpoints and event replication in the
 *
 * *Amazon EventBridge User Guide*
 * .
 */
export const describeEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEndpointRequest,
  output: DescribeEndpointResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Displays details about an event bus in your account. This can include the external Amazon Web Services accounts that are permitted to write events to your default event bus, and the
 * associated policy. For custom event buses and partner event buses, it displays the name, ARN,
 * policy, state, and creation time.
 *
 * To enable your account to receive events from other accounts on its default event bus,
 * use PutPermission.
 *
 * For more information about partner event buses, see CreateEventBus.
 */
export const describeEventBus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventBusRequest,
  output: DescribeEventBusResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Retrieves details about a replay. Use `DescribeReplay` to determine the
 * progress of a running replay. A replay processes events to replay based on the time in the
 * event, and replays them using 1 minute intervals. If you use `StartReplay` and
 * specify an `EventStartTime` and an `EventEndTime` that covers a 20
 * minute time range, the events are replayed from the first minute of that 20 minute range
 * first. Then the events from the second minute are replayed. You can use
 * `DescribeReplay` to determine the progress of a replay. The value returned for
 * `EventLastReplayedTime` indicates the time within the specified time range
 * associated with the last event replayed.
 */
export const describeReplay = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReplayRequest,
  output: DescribeReplayResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Describes the specified rule.
 *
 * DescribeRule does not list the targets of a rule. To see the targets associated with a
 * rule, use ListTargetsByRule.
 */
export const describeRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRuleRequest,
  output: DescribeRuleResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Lists the rules for the specified target. You can see which of the rules in Amazon
 * EventBridge can invoke a specific target in your account.
 *
 * The maximum number of results per page for requests is 100.
 */
export const listRuleNamesByTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRuleNamesByTargetRequest,
    output: ListRuleNamesByTargetResponse,
    errors: [InternalException, ResourceNotFoundException],
  }),
);
/**
 * Displays the tags associated with an EventBridge resource. In EventBridge, rules and event
 * buses can be tagged.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Lists the targets assigned to the specified rule.
 *
 * The maximum number of results per page for requests is 100.
 */
export const listTargetsByRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTargetsByRuleRequest,
  output: ListTargetsByRuleResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Update an existing endpoint. For more information about global endpoints, see Making
 * applications Regional-fault tolerant with global endpoints and event replication in
 * the
 * *Amazon EventBridge User Guide*
 * .
 */
export const updateEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEndpointRequest,
  output: UpdateEndpointResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified API destination.
 */
export const deleteApiDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteApiDestinationRequest,
    output: DeleteApiDestinationResponse,
    errors: [
      ConcurrentModificationException,
      InternalException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes the specified archive.
 */
export const deleteArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteArchiveRequest,
  output: DeleteArchiveResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * Delete an existing global endpoint. For more information about global endpoints, see
 * Making applications Regional-fault tolerant with global endpoints and event
 * replication in the
 * *Amazon EventBridge User Guide*
 * .
 */
export const deleteEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEndpointRequest,
  output: DeleteEndpointResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ResourceNotFoundException,
  ],
}));
/**
 * An SaaS partner can use this operation to display the Amazon Web Services account ID that a
 * particular partner event source name is associated with. This operation is not used by Amazon Web Services customers.
 */
export const listPartnerEventSourceAccounts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListPartnerEventSourceAccountsRequest,
    output: ListPartnerEventSourceAccountsResponse,
    errors: [
      InternalException,
      OperationDisabledException,
      ResourceNotFoundException,
    ],
  }));
/**
 * An SaaS partner can use this operation to list all the partner event source names that
 * they have created. This operation is not used by Amazon Web Services customers.
 */
export const listPartnerEventSources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPartnerEventSourcesRequest,
    output: ListPartnerEventSourcesResponse,
    errors: [InternalException, OperationDisabledException],
  }),
);
/**
 * This operation lists details about a partner event source that is shared with your
 * account.
 */
export const describeEventSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventSourceRequest,
  output: DescribeEventSourceResponse,
  errors: [
    InternalException,
    OperationDisabledException,
    ResourceNotFoundException,
  ],
}));
/**
 * An SaaS partner can use this operation to list details about a partner event source that
 * they have created. Amazon Web Services customers do not use this operation. Instead, Amazon Web Services customers can use DescribeEventSource to see details about a partner event source that is shared with
 * them.
 */
export const describePartnerEventSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribePartnerEventSourceRequest,
    output: DescribePartnerEventSourceResponse,
    errors: [
      InternalException,
      OperationDisabledException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates the specified event bus.
 */
export const updateEventBus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventBusRequest,
  output: UpdateEventBusResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    OperationDisabledException,
    ResourceNotFoundException,
  ],
}));
/**
 * This operation is used by SaaS partners to delete a partner event source. This operation
 * is not used by Amazon Web Services customers.
 *
 * When you delete an event source, the status of the corresponding partner event bus in the
 * Amazon Web Services customer account becomes DELETED.
 */
export const deletePartnerEventSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePartnerEventSourceRequest,
    output: DeletePartnerEventSourceResponse,
    errors: [
      ConcurrentModificationException,
      InternalException,
      OperationDisabledException,
    ],
  }),
);
/**
 * Revokes the permission of another Amazon Web Services account to be able to put events to
 * the specified event bus. Specify the account to revoke by the `StatementId` value
 * that you associated with the account when you granted it permission with
 * `PutPermission`. You can find the `StatementId` by using DescribeEventBus.
 */
export const removePermission = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemovePermissionRequest,
  output: RemovePermissionResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    OperationDisabledException,
    ResourceNotFoundException,
  ],
}));
/**
 * Activates a partner event source that has been deactivated. Once activated, your matching
 * event bus will start receiving events from the event source.
 */
export const activateEventSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ActivateEventSourceRequest,
  output: ActivateEventSourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    InvalidStateException,
    OperationDisabledException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the specified rule.
 *
 * Before you can delete the rule, you must remove all targets, using RemoveTargets.
 *
 * When you delete a rule, incoming events might continue to match to the deleted rule. Allow
 * a short period of time for changes to take effect.
 *
 * If you call delete rule multiple times for the same rule, all calls will succeed. When you
 * call delete rule for a non-existent custom eventbus, `ResourceNotFoundException` is
 * returned.
 *
 * Managed rules are rules created and managed by another Amazon Web Services service on your
 * behalf. These rules are created by those other Amazon Web Services services to support
 * functionality in those services. You can delete these rules using the `Force`
 * option, but you should do so only if you are sure the other service is not still using that
 * rule.
 */
export const deleteRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRuleRequest,
  output: DeleteRuleResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Disables the specified rule. A disabled rule won't match any events, and won't
 * self-trigger if it has a schedule expression.
 *
 * When you disable a rule, incoming events might continue to match to the disabled rule.
 * Allow a short period of time for changes to take effect.
 */
export const disableRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableRuleRequest,
  output: DisableRuleResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Enables the specified rule. If the rule does not exist, the operation fails.
 *
 * When you enable a rule, incoming events might not immediately start matching to a newly
 * enabled rule. Allow a short period of time for changes to take effect.
 */
export const enableRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableRuleRequest,
  output: EnableRuleResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Assigns one or more tags (key-value pairs) to the specified EventBridge resource. Tags can
 * help you organize and categorize your resources. You can also use them to scope user
 * permissions by granting a user permission to access or change only resources with certain tag
 * values. In EventBridge, rules and event buses can be tagged.
 *
 * Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as
 * strings of characters.
 *
 * You can use the `TagResource` action with a resource that already has tags. If
 * you specify a new tag key, this tag is appended to the list of tags associated with the
 * resource. If you specify a tag key that is already associated with the resource, the new tag
 * value that you specify replaces the previous value for that tag.
 *
 * You can associate as many as 50 tags with a resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes one or more tags from the specified EventBridge resource. In Amazon EventBridge, rules and event buses can be tagged.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an archive of events with the specified settings. When you create an archive,
 * incoming events might not immediately start being sent to the archive. Allow a short period of
 * time for changes to take effect. If you do not specify a pattern to filter events sent to the
 * archive, all events are sent to the archive except replayed events. Replayed events are not
 * sent to an archive.
 *
 * If you have specified that EventBridge use a customer managed key for encrypting the source event bus, we strongly recommend you also specify a
 * customer managed key for any archives for the event bus as well.
 *
 * For more information, see Encrypting archives in the *Amazon EventBridge User Guide*.
 */
export const createArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateArchiveRequest,
  output: CreateArchiveResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    InvalidEventPatternException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates or updates the specified rule. Rules are enabled by default, or based on value of
 * the state. You can disable a rule using DisableRule.
 *
 * A single rule watches for events from a single event bus. Events generated by Amazon Web Services services go to your account's default event bus. Events generated by SaaS partner
 * services or applications go to the matching partner event bus. If you have custom applications
 * or services, you can specify whether their events go to your default event bus or a custom
 * event bus that you have created. For more information, see CreateEventBus.
 *
 * If you are updating an existing rule, the rule is replaced with what you specify in this
 * `PutRule` command. If you omit arguments in `PutRule`, the old values
 * for those arguments are not kept. Instead, they are replaced with null values.
 *
 * When you create or update a rule, incoming events might not immediately start matching to
 * new or updated rules. Allow a short period of time for changes to take effect.
 *
 * A rule must contain at least an EventPattern or ScheduleExpression. Rules with
 * EventPatterns are triggered when a matching event is observed. Rules with ScheduleExpressions
 * self-trigger based on the given schedule. A rule can have both an EventPattern and a
 * ScheduleExpression, in which case the rule triggers on matching events as well as on a
 * schedule.
 *
 * When you initially create a rule, you can optionally assign one or more tags to the rule.
 * Tags can help you organize and categorize your resources. You can also use them to scope user
 * permissions, by granting a user permission to access or change only rules with certain tag
 * values. To use the `PutRule` operation and assign tags, you must have both the
 * `events:PutRule` and `events:TagResource` permissions.
 *
 * If you are updating an existing rule, any tags you specify in the `PutRule`
 * operation are ignored. To update the tags of an existing rule, use TagResource and UntagResource.
 *
 * Most services in Amazon Web Services treat : or / as the same character in Amazon Resource
 * Names (ARNs). However, EventBridge uses an exact match in event patterns and rules. Be sure to
 * use the correct ARN characters when creating event patterns so that they match the ARN syntax
 * in the event you want to match.
 *
 * In EventBridge, it is possible to create rules that lead to infinite loops, where a rule
 * is fired repeatedly. For example, a rule might detect that ACLs have changed on an S3 bucket,
 * and trigger software to change them to the desired state. If the rule is not written
 * carefully, the subsequent change to the ACLs fires the rule again, creating an infinite
 * loop.
 *
 * To prevent this, write the rules so that the triggered actions do not re-fire the same
 * rule. For example, your rule could fire only if ACLs are found to be in a bad state, instead
 * of after any change.
 *
 * An infinite loop can quickly cause higher than expected charges. We recommend that you use
 * budgeting, which alerts you when charges exceed your specified limit. For more information,
 * see Managing Your Costs with
 * Budgets.
 *
 * To create a rule that filters for management events from Amazon Web Services services, see
 * Receiving read-only management events from Amazon Web Services services in the
 * *EventBridge User Guide*.
 */
export const putRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRuleRequest,
  output: PutRuleResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    InvalidEventPatternException,
    LimitExceededException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Tests whether the specified event pattern matches the provided event.
 *
 * Most services in Amazon Web Services treat : or / as the same character in Amazon Resource
 * Names (ARNs). However, EventBridge uses an exact match in event patterns and rules. Be
 * sure to use the correct ARN characters when creating event patterns so that they match the ARN
 * syntax in the event you want to match.
 */
export const testEventPattern = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestEventPatternRequest,
  output: TestEventPatternResponse,
  errors: [InternalException, InvalidEventPatternException],
}));
/**
 * Updates the specified archive.
 */
export const updateArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateArchiveRequest,
  output: UpdateArchiveResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    InvalidEventPatternException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Called by an SaaS partner to create a partner event source. This operation is not used by
 * Amazon Web Services customers.
 *
 * Each partner event source can be used by one Amazon Web Services account to create a
 * matching partner event bus in that Amazon Web Services account. A SaaS partner must create one
 * partner event source for each Amazon Web Services account that wants to receive those event
 * types.
 *
 * A partner event source creates events based on resources within the SaaS partner's service
 * or application.
 *
 * An Amazon Web Services account that creates a partner event bus that matches the partner
 * event source can use that event bus to receive events from the partner, and then process them
 * using Amazon Web Services Events rules and targets.
 *
 * Partner event source names follow this format:
 *
 * *partner_name*\/*event_namespace*\/*event_name*
 *
 * - *partner_name* is determined during partner registration, and
 * identifies the partner to Amazon Web Services customers.
 *
 * - *event_namespace* is determined by the partner, and is a way for
 * the partner to categorize their events.
 *
 * - *event_name* is determined by the partner, and should uniquely
 * identify an event-generating resource within the partner system.
 *
 * The *event_name* must be unique across all Amazon Web Services
 * customers. This is because the event source is a shared resource between the partner and
 * customer accounts, and each partner event source unique in the partner account.
 *
 * The combination of *event_namespace* and
 * *event_name* should help Amazon Web Services customers decide whether to
 * create an event bus to receive these events.
 */
export const createPartnerEventSource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePartnerEventSourceRequest,
    output: CreatePartnerEventSourceResponse,
    errors: [
      ConcurrentModificationException,
      InternalException,
      LimitExceededException,
      OperationDisabledException,
      ResourceAlreadyExistsException,
    ],
  }),
);
/**
 * Updates an API destination.
 */
export const updateApiDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateApiDestinationRequest,
    output: UpdateApiDestinationResponse,
    errors: [
      ConcurrentModificationException,
      InternalException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Starts the specified replay. Events are not necessarily replayed in the exact same order
 * that they were added to the archive. A replay processes events to replay based on the time in
 * the event, and replays them using 1 minute intervals. If you specify an
 * `EventStartTime` and an `EventEndTime` that covers a 20 minute time
 * range, the events are replayed from the first minute of that 20 minute range first. Then the
 * events from the second minute are replayed. You can use `DescribeReplay` to
 * determine the progress of a replay. The value returned for `EventLastReplayedTime`
 * indicates the time within the specified time range associated with the last event
 * replayed.
 */
export const startReplay = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartReplayRequest,
  output: StartReplayResponse,
  errors: [
    InternalException,
    InvalidEventPatternException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates an API destination, which is an HTTP invocation endpoint configured as a target
 * for events.
 *
 * API destinations do not support private destinations, such as interface VPC
 * endpoints.
 *
 * For more information, see API destinations in the
 * *EventBridge User Guide*.
 */
export const createApiDestination = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateApiDestinationRequest,
    output: CreateApiDestinationResponse,
    errors: [
      InternalException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates a global endpoint. Global endpoints improve your application's availability by
 * making it regional-fault tolerant. To do this, you define a primary and secondary Region with
 * event buses in each Region. You also create a Amazon Route 53 health check that will
 * tell EventBridge to route events to the secondary Region when an "unhealthy" state is
 * encountered and events will be routed back to the primary Region when the health check reports
 * a "healthy" state.
 */
export const createEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEndpointRequest,
  output: CreateEndpointResponse,
  errors: [
    InternalException,
    LimitExceededException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Retrieves details about a connection.
 */
export const describeConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectionRequest,
  output: DescribeConnectionResponse,
  errors: [InternalException, ResourceNotFoundException],
}));
/**
 * Running `PutPermission` permits the specified Amazon Web Services account or Amazon Web Services organization
 * to put events to the specified *event bus*. Amazon EventBridge rules in your account are triggered by these events arriving to an event bus in your
 * account.
 *
 * For another account to send events to your account, that external account must have an
 * EventBridge rule with your account's event bus as a target.
 *
 * To enable multiple Amazon Web Services accounts to put events to your event bus, run
 * `PutPermission` once for each of these accounts. Or, if all the accounts are
 * members of the same Amazon Web Services organization, you can run `PutPermission`
 * once specifying `Principal` as "*" and specifying the Amazon Web Services
 * organization ID in `Condition`, to grant permissions to all accounts in that
 * organization.
 *
 * If you grant permissions using an organization, then accounts in that organization must
 * specify a `RoleArn` with proper permissions when they use `PutTarget` to
 * add your account's event bus as a target. For more information, see Sending and
 * Receiving Events Between Amazon Web Services Accounts in the *Amazon EventBridge User Guide*.
 *
 * The permission policy on the event bus cannot exceed 10 KB in size.
 */
export const putPermission = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPermissionRequest,
  output: PutPermissionResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    OperationDisabledException,
    PolicyLengthExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a connection. A connection defines the authorization type and credentials to use
 * for authorization with an API destination HTTP endpoint.
 *
 * For more information, see Connections for endpoint targets in the *Amazon EventBridge User Guide*.
 */
export const createConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectionRequest,
  output: CreateConnectionResponse,
  errors: [
    AccessDeniedException,
    InternalException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Adds the specified targets to the specified rule, or updates the targets if they are
 * already associated with the rule.
 *
 * Targets are the resources that are invoked when a rule is triggered.
 *
 * The maximum number of entries per request is 10.
 *
 * Each rule can have up to five (5) targets associated with it at one time.
 *
 * For a list of services you can configure as targets for events, see EventBridge targets
 * in the
 * *Amazon EventBridge User Guide*
 * .
 *
 * Creating rules with built-in targets is supported only in the Amazon Web Services Management Console. The
 * built-in targets are:
 *
 * - `Amazon EBS CreateSnapshot API call`
 *
 * - `Amazon EC2 RebootInstances API call`
 *
 * - `Amazon EC2 StopInstances API call`
 *
 * - `Amazon EC2 TerminateInstances API call`
 *
 * For some target types, `PutTargets` provides target-specific parameters. If the
 * target is a Kinesis data stream, you can optionally specify which shard the event
 * goes to by using the `KinesisParameters` argument. To invoke a command on multiple
 * EC2 instances with one rule, you can use the `RunCommandParameters` field.
 *
 * To be able to make API calls against the resources that you own, Amazon EventBridge
 * needs the appropriate permissions:
 *
 * - For Lambda and Amazon SNS resources, EventBridge relies
 * on resource-based policies.
 *
 * - For EC2 instances, Kinesis Data Streams, Step Functions state machines and
 * API Gateway APIs, EventBridge relies on IAM roles that you specify in the
 * `RoleARN` argument in `PutTargets`.
 *
 * For more information, see Authentication
 * and Access Control in the
 * *Amazon EventBridge User Guide*
 * .
 *
 * If another Amazon Web Services account is in the same region and has granted you permission
 * (using `PutPermission`), you can send events to that account. Set that account's
 * event bus as a target of the rules in your account. To send the matched events to the other
 * account, specify that account's event bus as the `Arn` value when you run
 * `PutTargets`. If your account sends events to another account, your account is
 * charged for each sent event. Each event sent to another account is charged as a custom event.
 * The account receiving the event is not charged. For more information, see Amazon EventBridge Pricing.
 *
 * `Input`, `InputPath`, and `InputTransformer` are not
 * available with `PutTarget` if the target is an event bus of a different Amazon Web Services account.
 *
 * If you are setting the event bus of another account as the target, and that account
 * granted permission to your account through an organization instead of directly by the account
 * ID, then you must specify a `RoleArn` with proper permissions in the
 * `Target` structure. For more information, see Sending and
 * Receiving Events Between Amazon Web Services Accounts in the *Amazon EventBridge User Guide*.
 *
 * If you have an IAM role on a cross-account event bus target, a `PutTargets`
 * call without a role on the same target (same `Id` and `Arn`) will not
 * remove the role.
 *
 * For more information about enabling cross-account events, see PutPermission.
 *
 * **Input**, **InputPath**, and
 * **InputTransformer** are mutually exclusive and optional
 * parameters of a target. When a rule is triggered due to a matched event:
 *
 * - If none of the following arguments are specified for a target, then the entire event
 * is passed to the target in JSON format (unless the target is Amazon EC2 Run Command or
 * Amazon ECS task, in which case nothing from the event is passed to the target).
 *
 * - If **Input** is specified in the form of valid JSON, then
 * the matched event is overridden with this constant.
 *
 * - If **InputPath** is specified in the form of JSONPath
 * (for example, `$.detail`), then only the part of the event specified in the
 * path is passed to the target (for example, only the detail part of the event is
 * passed).
 *
 * - If **InputTransformer** is specified, then one or more
 * specified JSONPaths are extracted from the event and used as values in a template that you
 * specify as the input to the target.
 *
 * When you specify `InputPath` or `InputTransformer`, you must use
 * JSON dot notation, not bracket notation.
 *
 * When you add targets to a rule and the associated rule triggers soon after, new or updated
 * targets might not be immediately invoked. Allow a short period of time for changes to take
 * effect.
 *
 * This action can partially fail if too many requests are made at the same time. If that
 * happens, `FailedEntryCount` is non-zero in the response and each entry in
 * `FailedEntries` provides the ID of the failed target and the error code.
 */
export const putTargets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutTargetsRequest,
  output: PutTargetsResponse,
  errors: [
    ConcurrentModificationException,
    InternalException,
    LimitExceededException,
    ManagedRuleException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates settings for a connection.
 */
export const updateConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectionRequest,
  output: UpdateConnectionResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    InternalException,
    LimitExceededException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
