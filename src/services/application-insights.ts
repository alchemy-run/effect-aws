import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Application Insights",
  serviceShapeName: "EC2WindowsBarleyService",
});
const auth = T.AwsAuthSigv4({ name: "applicationinsights" });
const ver = T.ServiceVersion("2018-11-25");
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
                        url: "https://applicationinsights-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://applicationinsights-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://applicationinsights.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://applicationinsights.{Region}.{PartitionResult#dnsSuffix}",
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

//# Newtypes
export type ResourceGroupName = string;
export type ComponentName = string;
export type OpsItemSNSTopicArn = string;
export type SNSNotificationArn = string;
export type CustomComponentName = string;
export type ResourceARN = string;
export type LogPatternSetName = string;
export type LogPatternName = string;
export type LogPatternRegex = string;
export type LogPatternRank = number;
export type AccountId = string;
export type WorkloadName = string;
export type ObservationId = string;
export type ProblemId = string;
export type WorkloadId = string;
export type MaxEntities = number;
export type PaginationToken = string;
export type AmazonResourceName = string;
export type TagKey = string;
export type ComponentConfiguration = string;
export type TagValue = string;
export type ErrorMsg = string;
export type Remarks = string;
export type LifeCycle = string;
export type ResourceType = string;
export type SourceType = string;
export type SourceARN = string;
export type LogGroup = string;
export type LogText = string;
export type MetricNamespace = string;
export type MetricName = string;
export type Unit = string;
export type Value = number;
export type CloudWatchEventId = string;
export type CloudWatchEventDetailType = string;
export type HealthEventArn = string;
export type HealthService = string;
export type HealthEventTypeCode = string;
export type HealthEventTypeCategory = string;
export type HealthEventDescription = string;
export type CodeDeployDeploymentId = string;
export type CodeDeployDeploymentGroup = string;
export type CodeDeployState = string;
export type CodeDeployApplication = string;
export type CodeDeployInstanceGroupId = string;
export type Ec2State = string;
export type RdsEventCategories = string;
export type RdsEventMessage = string;
export type S3EventName = string;
export type StatesExecutionArn = string;
export type StatesArn = string;
export type StatesStatus = string;
export type StatesInput = string;
export type EbsEvent = string;
export type EbsResult = string;
export type EbsCause = string;
export type EbsRequestId = string;
export type XRayFaultPercent = number;
export type XRayThrottlePercent = number;
export type XRayErrorPercent = number;
export type XRayRequestCount = number;
export type XRayRequestAverageLatency = number;
export type XRayNodeName = string;
export type XRayNodeType = string;
export type Title = string;
export type ShortName = string;
export type Insights = string;
export type AffectedResource = string;
export type RecurringCount = number;
export type ConfigurationEventMonitoredResourceARN = string;
export type ConfigurationEventDetail = string;
export type ConfigurationEventResourceName = string;
export type ExceptionMessage = string;
export type MetaDataKey = string;
export type MetaDataValue = string;

//# Schemas
export type ResourceList = string[];
export const ResourceList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CreateComponentRequest {
  ResourceGroupName: string;
  ComponentName: string;
  ResourceList: ResourceList;
}
export const CreateComponentRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    ResourceList: ResourceList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateComponentRequest",
}) as any as S.Schema<CreateComponentRequest>;
export interface CreateComponentResponse {}
export const CreateComponentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateComponentResponse",
}) as any as S.Schema<CreateComponentResponse>;
export interface CreateLogPatternRequest {
  ResourceGroupName: string;
  PatternSetName: string;
  PatternName: string;
  Pattern: string;
  Rank: number;
}
export const CreateLogPatternRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    PatternSetName: S.String,
    PatternName: S.String,
    Pattern: S.String,
    Rank: S.Number,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLogPatternRequest",
}) as any as S.Schema<CreateLogPatternRequest>;
export interface DeleteApplicationRequest {
  ResourceGroupName: string;
}
export const DeleteApplicationRequest = S.suspend(() =>
  S.Struct({ ResourceGroupName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteApplicationRequest",
}) as any as S.Schema<DeleteApplicationRequest>;
export interface DeleteApplicationResponse {}
export const DeleteApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteApplicationResponse",
}) as any as S.Schema<DeleteApplicationResponse>;
export interface DeleteComponentRequest {
  ResourceGroupName: string;
  ComponentName: string;
}
export const DeleteComponentRequest = S.suspend(() =>
  S.Struct({ ResourceGroupName: S.String, ComponentName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteComponentRequest",
}) as any as S.Schema<DeleteComponentRequest>;
export interface DeleteComponentResponse {}
export const DeleteComponentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteComponentResponse",
}) as any as S.Schema<DeleteComponentResponse>;
export interface DeleteLogPatternRequest {
  ResourceGroupName: string;
  PatternSetName: string;
  PatternName: string;
}
export const DeleteLogPatternRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    PatternSetName: S.String,
    PatternName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteLogPatternRequest",
}) as any as S.Schema<DeleteLogPatternRequest>;
export interface DeleteLogPatternResponse {}
export const DeleteLogPatternResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLogPatternResponse",
}) as any as S.Schema<DeleteLogPatternResponse>;
export interface DescribeApplicationRequest {
  ResourceGroupName: string;
  AccountId?: string;
}
export const DescribeApplicationRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeApplicationRequest",
}) as any as S.Schema<DescribeApplicationRequest>;
export interface DescribeComponentRequest {
  ResourceGroupName: string;
  ComponentName: string;
  AccountId?: string;
}
export const DescribeComponentRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeComponentRequest",
}) as any as S.Schema<DescribeComponentRequest>;
export interface DescribeComponentConfigurationRequest {
  ResourceGroupName: string;
  ComponentName: string;
  AccountId?: string;
}
export const DescribeComponentConfigurationRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeComponentConfigurationRequest",
}) as any as S.Schema<DescribeComponentConfigurationRequest>;
export interface DescribeComponentConfigurationRecommendationRequest {
  ResourceGroupName: string;
  ComponentName: string;
  Tier: string;
  WorkloadName?: string;
  RecommendationType?: string;
}
export const DescribeComponentConfigurationRecommendationRequest = S.suspend(
  () =>
    S.Struct({
      ResourceGroupName: S.String,
      ComponentName: S.String,
      Tier: S.String,
      WorkloadName: S.optional(S.String),
      RecommendationType: S.optional(S.String),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "DescribeComponentConfigurationRecommendationRequest",
}) as any as S.Schema<DescribeComponentConfigurationRecommendationRequest>;
export interface DescribeLogPatternRequest {
  ResourceGroupName: string;
  PatternSetName: string;
  PatternName: string;
  AccountId?: string;
}
export const DescribeLogPatternRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    PatternSetName: S.String,
    PatternName: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLogPatternRequest",
}) as any as S.Schema<DescribeLogPatternRequest>;
export interface DescribeObservationRequest {
  ObservationId: string;
  AccountId?: string;
}
export const DescribeObservationRequest = S.suspend(() =>
  S.Struct({ ObservationId: S.String, AccountId: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeObservationRequest",
}) as any as S.Schema<DescribeObservationRequest>;
export interface DescribeProblemRequest {
  ProblemId: string;
  AccountId?: string;
}
export const DescribeProblemRequest = S.suspend(() =>
  S.Struct({ ProblemId: S.String, AccountId: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProblemRequest",
}) as any as S.Schema<DescribeProblemRequest>;
export interface DescribeProblemObservationsRequest {
  ProblemId: string;
  AccountId?: string;
}
export const DescribeProblemObservationsRequest = S.suspend(() =>
  S.Struct({ ProblemId: S.String, AccountId: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProblemObservationsRequest",
}) as any as S.Schema<DescribeProblemObservationsRequest>;
export interface DescribeWorkloadRequest {
  ResourceGroupName: string;
  ComponentName: string;
  WorkloadId: string;
  AccountId?: string;
}
export const DescribeWorkloadRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    WorkloadId: S.String,
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeWorkloadRequest",
}) as any as S.Schema<DescribeWorkloadRequest>;
export interface ListApplicationsRequest {
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListApplicationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListApplicationsRequest",
}) as any as S.Schema<ListApplicationsRequest>;
export interface ListComponentsRequest {
  ResourceGroupName: string;
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListComponentsRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListComponentsRequest",
}) as any as S.Schema<ListComponentsRequest>;
export interface ListConfigurationHistoryRequest {
  ResourceGroupName?: string;
  StartTime?: Date;
  EndTime?: Date;
  EventStatus?: string;
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListConfigurationHistoryRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventStatus: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListConfigurationHistoryRequest",
}) as any as S.Schema<ListConfigurationHistoryRequest>;
export interface ListLogPatternsRequest {
  ResourceGroupName: string;
  PatternSetName?: string;
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListLogPatternsRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    PatternSetName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListLogPatternsRequest",
}) as any as S.Schema<ListLogPatternsRequest>;
export interface ListLogPatternSetsRequest {
  ResourceGroupName: string;
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListLogPatternSetsRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListLogPatternSetsRequest",
}) as any as S.Schema<ListLogPatternSetsRequest>;
export interface ListProblemsRequest {
  AccountId?: string;
  ResourceGroupName?: string;
  StartTime?: Date;
  EndTime?: Date;
  MaxResults?: number;
  NextToken?: string;
  ComponentName?: string;
  Visibility?: string;
}
export const ListProblemsRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    ResourceGroupName: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ComponentName: S.optional(S.String),
    Visibility: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProblemsRequest",
}) as any as S.Schema<ListProblemsRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListWorkloadsRequest {
  ResourceGroupName: string;
  ComponentName: string;
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListWorkloadsRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListWorkloadsRequest",
}) as any as S.Schema<ListWorkloadsRequest>;
export interface RemoveWorkloadRequest {
  ResourceGroupName: string;
  ComponentName: string;
  WorkloadId: string;
}
export const RemoveWorkloadRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    WorkloadId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RemoveWorkloadRequest",
}) as any as S.Schema<RemoveWorkloadRequest>;
export interface RemoveWorkloadResponse {}
export const RemoveWorkloadResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "RemoveWorkloadResponse" },
) as any as S.Schema<RemoveWorkloadResponse>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: TagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ResourceARN: string;
  TagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateApplicationRequest {
  ResourceGroupName: string;
  OpsCenterEnabled?: boolean;
  CWEMonitorEnabled?: boolean;
  OpsItemSNSTopicArn?: string;
  SNSNotificationArn?: string;
  RemoveSNSTopic?: boolean;
  AutoConfigEnabled?: boolean;
  AttachMissingPermission?: boolean;
}
export const UpdateApplicationRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    OpsCenterEnabled: S.optional(S.Boolean),
    CWEMonitorEnabled: S.optional(S.Boolean),
    OpsItemSNSTopicArn: S.optional(S.String),
    SNSNotificationArn: S.optional(S.String),
    RemoveSNSTopic: S.optional(S.Boolean),
    AutoConfigEnabled: S.optional(S.Boolean),
    AttachMissingPermission: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateApplicationRequest",
}) as any as S.Schema<UpdateApplicationRequest>;
export interface UpdateComponentRequest {
  ResourceGroupName: string;
  ComponentName: string;
  NewComponentName?: string;
  ResourceList?: ResourceList;
}
export const UpdateComponentRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    NewComponentName: S.optional(S.String),
    ResourceList: S.optional(ResourceList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateComponentRequest",
}) as any as S.Schema<UpdateComponentRequest>;
export interface UpdateComponentResponse {}
export const UpdateComponentResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateComponentResponse",
}) as any as S.Schema<UpdateComponentResponse>;
export interface UpdateComponentConfigurationRequest {
  ResourceGroupName: string;
  ComponentName: string;
  Monitor?: boolean;
  Tier?: string;
  ComponentConfiguration?: string;
  AutoConfigEnabled?: boolean;
}
export const UpdateComponentConfigurationRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    Monitor: S.optional(S.Boolean),
    Tier: S.optional(S.String),
    ComponentConfiguration: S.optional(S.String),
    AutoConfigEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateComponentConfigurationRequest",
}) as any as S.Schema<UpdateComponentConfigurationRequest>;
export interface UpdateComponentConfigurationResponse {}
export const UpdateComponentConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateComponentConfigurationResponse",
}) as any as S.Schema<UpdateComponentConfigurationResponse>;
export interface UpdateLogPatternRequest {
  ResourceGroupName: string;
  PatternSetName: string;
  PatternName: string;
  Pattern?: string;
  Rank?: number;
}
export const UpdateLogPatternRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    PatternSetName: S.String,
    PatternName: S.String,
    Pattern: S.optional(S.String),
    Rank: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLogPatternRequest",
}) as any as S.Schema<UpdateLogPatternRequest>;
export interface UpdateProblemRequest {
  ProblemId: string;
  UpdateStatus?: string;
  Visibility?: string;
}
export const UpdateProblemRequest = S.suspend(() =>
  S.Struct({
    ProblemId: S.String,
    UpdateStatus: S.optional(S.String),
    Visibility: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProblemRequest",
}) as any as S.Schema<UpdateProblemRequest>;
export interface UpdateProblemResponse {}
export const UpdateProblemResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateProblemResponse",
}) as any as S.Schema<UpdateProblemResponse>;
export interface WorkloadConfiguration {
  WorkloadName?: string;
  Tier?: string;
  Configuration?: string;
}
export const WorkloadConfiguration = S.suspend(() =>
  S.Struct({
    WorkloadName: S.optional(S.String),
    Tier: S.optional(S.String),
    Configuration: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkloadConfiguration",
}) as any as S.Schema<WorkloadConfiguration>;
export interface UpdateWorkloadRequest {
  ResourceGroupName: string;
  ComponentName: string;
  WorkloadId?: string;
  WorkloadConfiguration: WorkloadConfiguration;
}
export const UpdateWorkloadRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    WorkloadId: S.optional(S.String),
    WorkloadConfiguration: WorkloadConfiguration,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateWorkloadRequest",
}) as any as S.Schema<UpdateWorkloadRequest>;
export interface ApplicationInfo {
  AccountId?: string;
  ResourceGroupName?: string;
  LifeCycle?: string;
  OpsItemSNSTopicArn?: string;
  SNSNotificationArn?: string;
  OpsCenterEnabled?: boolean;
  CWEMonitorEnabled?: boolean;
  Remarks?: string;
  AutoConfigEnabled?: boolean;
  DiscoveryType?: string;
  AttachMissingPermission?: boolean;
}
export const ApplicationInfo = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    ResourceGroupName: S.optional(S.String),
    LifeCycle: S.optional(S.String),
    OpsItemSNSTopicArn: S.optional(S.String),
    SNSNotificationArn: S.optional(S.String),
    OpsCenterEnabled: S.optional(S.Boolean),
    CWEMonitorEnabled: S.optional(S.Boolean),
    Remarks: S.optional(S.String),
    AutoConfigEnabled: S.optional(S.Boolean),
    DiscoveryType: S.optional(S.String),
    AttachMissingPermission: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ApplicationInfo",
}) as any as S.Schema<ApplicationInfo>;
export type ApplicationInfoList = ApplicationInfo[];
export const ApplicationInfoList = S.Array(ApplicationInfo);
export type WorkloadMetaData = { [key: string]: string };
export const WorkloadMetaData = S.Record({ key: S.String, value: S.String });
export type DetectedWorkload = { [key: string]: WorkloadMetaData };
export const DetectedWorkload = S.Record({
  key: S.String,
  value: WorkloadMetaData,
});
export interface ApplicationComponent {
  ComponentName?: string;
  ComponentRemarks?: string;
  ResourceType?: string;
  OsType?: string;
  Tier?: string;
  Monitor?: boolean;
  DetectedWorkload?: DetectedWorkload;
}
export const ApplicationComponent = S.suspend(() =>
  S.Struct({
    ComponentName: S.optional(S.String),
    ComponentRemarks: S.optional(S.String),
    ResourceType: S.optional(S.String),
    OsType: S.optional(S.String),
    Tier: S.optional(S.String),
    Monitor: S.optional(S.Boolean),
    DetectedWorkload: S.optional(DetectedWorkload),
  }),
).annotations({
  identifier: "ApplicationComponent",
}) as any as S.Schema<ApplicationComponent>;
export type ApplicationComponentList = ApplicationComponent[];
export const ApplicationComponentList = S.Array(ApplicationComponent);
export interface LogPattern {
  PatternSetName?: string;
  PatternName?: string;
  Pattern?: string;
  Rank?: number;
}
export const LogPattern = S.suspend(() =>
  S.Struct({
    PatternSetName: S.optional(S.String),
    PatternName: S.optional(S.String),
    Pattern: S.optional(S.String),
    Rank: S.optional(S.Number),
  }),
).annotations({ identifier: "LogPattern" }) as any as S.Schema<LogPattern>;
export type LogPatternList = LogPattern[];
export const LogPatternList = S.Array(LogPattern);
export type LogPatternSetList = string[];
export const LogPatternSetList = S.Array(S.String);
export type Feedback = { [key: string]: string };
export const Feedback = S.Record({ key: S.String, value: S.String });
export interface Problem {
  Id?: string;
  Title?: string;
  ShortName?: string;
  Insights?: string;
  Status?: string;
  AffectedResource?: string;
  StartTime?: Date;
  EndTime?: Date;
  SeverityLevel?: string;
  AccountId?: string;
  ResourceGroupName?: string;
  Feedback?: Feedback;
  RecurringCount?: number;
  LastRecurrenceTime?: Date;
  Visibility?: string;
  ResolutionMethod?: string;
}
export const Problem = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Title: S.optional(S.String),
    ShortName: S.optional(S.String),
    Insights: S.optional(S.String),
    Status: S.optional(S.String),
    AffectedResource: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SeverityLevel: S.optional(S.String),
    AccountId: S.optional(S.String),
    ResourceGroupName: S.optional(S.String),
    Feedback: S.optional(Feedback),
    RecurringCount: S.optional(S.Number),
    LastRecurrenceTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Visibility: S.optional(S.String),
    ResolutionMethod: S.optional(S.String),
  }),
).annotations({ identifier: "Problem" }) as any as S.Schema<Problem>;
export type ProblemList = Problem[];
export const ProblemList = S.Array(Problem);
export interface AddWorkloadRequest {
  ResourceGroupName: string;
  ComponentName: string;
  WorkloadConfiguration: WorkloadConfiguration;
}
export const AddWorkloadRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.String,
    ComponentName: S.String,
    WorkloadConfiguration: WorkloadConfiguration,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AddWorkloadRequest",
}) as any as S.Schema<AddWorkloadRequest>;
export interface CreateApplicationRequest {
  ResourceGroupName?: string;
  OpsCenterEnabled?: boolean;
  CWEMonitorEnabled?: boolean;
  OpsItemSNSTopicArn?: string;
  SNSNotificationArn?: string;
  Tags?: TagList;
  AutoConfigEnabled?: boolean;
  AutoCreate?: boolean;
  GroupingType?: string;
  AttachMissingPermission?: boolean;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    OpsCenterEnabled: S.optional(S.Boolean),
    CWEMonitorEnabled: S.optional(S.Boolean),
    OpsItemSNSTopicArn: S.optional(S.String),
    SNSNotificationArn: S.optional(S.String),
    Tags: S.optional(TagList),
    AutoConfigEnabled: S.optional(S.Boolean),
    AutoCreate: S.optional(S.Boolean),
    GroupingType: S.optional(S.String),
    AttachMissingPermission: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface DescribeComponentConfigurationResponse {
  Monitor?: boolean;
  Tier?: string;
  ComponentConfiguration?: string;
}
export const DescribeComponentConfigurationResponse = S.suspend(() =>
  S.Struct({
    Monitor: S.optional(S.Boolean),
    Tier: S.optional(S.String),
    ComponentConfiguration: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeComponentConfigurationResponse",
}) as any as S.Schema<DescribeComponentConfigurationResponse>;
export interface DescribeComponentConfigurationRecommendationResponse {
  ComponentConfiguration?: string;
}
export const DescribeComponentConfigurationRecommendationResponse = S.suspend(
  () => S.Struct({ ComponentConfiguration: S.optional(S.String) }),
).annotations({
  identifier: "DescribeComponentConfigurationRecommendationResponse",
}) as any as S.Schema<DescribeComponentConfigurationRecommendationResponse>;
export interface DescribeLogPatternResponse {
  ResourceGroupName?: string;
  AccountId?: string;
  LogPattern?: LogPattern;
}
export const DescribeLogPatternResponse = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    AccountId: S.optional(S.String),
    LogPattern: S.optional(LogPattern),
  }),
).annotations({
  identifier: "DescribeLogPatternResponse",
}) as any as S.Schema<DescribeLogPatternResponse>;
export interface DescribeWorkloadResponse {
  WorkloadId?: string;
  WorkloadRemarks?: string;
  WorkloadConfiguration?: WorkloadConfiguration;
}
export const DescribeWorkloadResponse = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    WorkloadRemarks: S.optional(S.String),
    WorkloadConfiguration: S.optional(WorkloadConfiguration),
  }),
).annotations({
  identifier: "DescribeWorkloadResponse",
}) as any as S.Schema<DescribeWorkloadResponse>;
export interface ListApplicationsResponse {
  ApplicationInfoList?: ApplicationInfoList;
  NextToken?: string;
}
export const ListApplicationsResponse = S.suspend(() =>
  S.Struct({
    ApplicationInfoList: S.optional(ApplicationInfoList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationsResponse",
}) as any as S.Schema<ListApplicationsResponse>;
export interface ListComponentsResponse {
  ApplicationComponentList?: ApplicationComponentList;
  NextToken?: string;
}
export const ListComponentsResponse = S.suspend(() =>
  S.Struct({
    ApplicationComponentList: S.optional(ApplicationComponentList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListComponentsResponse",
}) as any as S.Schema<ListComponentsResponse>;
export interface ListLogPatternsResponse {
  ResourceGroupName?: string;
  AccountId?: string;
  LogPatterns?: LogPatternList;
  NextToken?: string;
}
export const ListLogPatternsResponse = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    AccountId: S.optional(S.String),
    LogPatterns: S.optional(LogPatternList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLogPatternsResponse",
}) as any as S.Schema<ListLogPatternsResponse>;
export interface ListLogPatternSetsResponse {
  ResourceGroupName?: string;
  AccountId?: string;
  LogPatternSets?: LogPatternSetList;
  NextToken?: string;
}
export const ListLogPatternSetsResponse = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    AccountId: S.optional(S.String),
    LogPatternSets: S.optional(LogPatternSetList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLogPatternSetsResponse",
}) as any as S.Schema<ListLogPatternSetsResponse>;
export interface ListProblemsResponse {
  ProblemList?: ProblemList;
  NextToken?: string;
  ResourceGroupName?: string;
  AccountId?: string;
}
export const ListProblemsResponse = S.suspend(() =>
  S.Struct({
    ProblemList: S.optional(ProblemList),
    NextToken: S.optional(S.String),
    ResourceGroupName: S.optional(S.String),
    AccountId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListProblemsResponse",
}) as any as S.Schema<ListProblemsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: TagList;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateApplicationResponse {
  ApplicationInfo?: ApplicationInfo;
}
export const UpdateApplicationResponse = S.suspend(() =>
  S.Struct({ ApplicationInfo: S.optional(ApplicationInfo) }),
).annotations({
  identifier: "UpdateApplicationResponse",
}) as any as S.Schema<UpdateApplicationResponse>;
export interface UpdateLogPatternResponse {
  ResourceGroupName?: string;
  LogPattern?: LogPattern;
}
export const UpdateLogPatternResponse = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    LogPattern: S.optional(LogPattern),
  }),
).annotations({
  identifier: "UpdateLogPatternResponse",
}) as any as S.Schema<UpdateLogPatternResponse>;
export interface UpdateWorkloadResponse {
  WorkloadId?: string;
  WorkloadConfiguration?: WorkloadConfiguration;
}
export const UpdateWorkloadResponse = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    WorkloadConfiguration: S.optional(WorkloadConfiguration),
  }),
).annotations({
  identifier: "UpdateWorkloadResponse",
}) as any as S.Schema<UpdateWorkloadResponse>;
export interface Observation {
  Id?: string;
  StartTime?: Date;
  EndTime?: Date;
  SourceType?: string;
  SourceARN?: string;
  LogGroup?: string;
  LineTime?: Date;
  LogText?: string;
  LogFilter?: string;
  MetricNamespace?: string;
  MetricName?: string;
  Unit?: string;
  Value?: number;
  CloudWatchEventId?: string;
  CloudWatchEventSource?: string;
  CloudWatchEventDetailType?: string;
  HealthEventArn?: string;
  HealthService?: string;
  HealthEventTypeCode?: string;
  HealthEventTypeCategory?: string;
  HealthEventDescription?: string;
  CodeDeployDeploymentId?: string;
  CodeDeployDeploymentGroup?: string;
  CodeDeployState?: string;
  CodeDeployApplication?: string;
  CodeDeployInstanceGroupId?: string;
  Ec2State?: string;
  RdsEventCategories?: string;
  RdsEventMessage?: string;
  S3EventName?: string;
  StatesExecutionArn?: string;
  StatesArn?: string;
  StatesStatus?: string;
  StatesInput?: string;
  EbsEvent?: string;
  EbsResult?: string;
  EbsCause?: string;
  EbsRequestId?: string;
  XRayFaultPercent?: number;
  XRayThrottlePercent?: number;
  XRayErrorPercent?: number;
  XRayRequestCount?: number;
  XRayRequestAverageLatency?: number;
  XRayNodeName?: string;
  XRayNodeType?: string;
}
export const Observation = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    SourceType: S.optional(S.String),
    SourceARN: S.optional(S.String),
    LogGroup: S.optional(S.String),
    LineTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LogText: S.optional(S.String),
    LogFilter: S.optional(S.String),
    MetricNamespace: S.optional(S.String),
    MetricName: S.optional(S.String),
    Unit: S.optional(S.String),
    Value: S.optional(S.Number),
    CloudWatchEventId: S.optional(S.String),
    CloudWatchEventSource: S.optional(S.String),
    CloudWatchEventDetailType: S.optional(S.String),
    HealthEventArn: S.optional(S.String),
    HealthService: S.optional(S.String),
    HealthEventTypeCode: S.optional(S.String),
    HealthEventTypeCategory: S.optional(S.String),
    HealthEventDescription: S.optional(S.String),
    CodeDeployDeploymentId: S.optional(S.String),
    CodeDeployDeploymentGroup: S.optional(S.String),
    CodeDeployState: S.optional(S.String),
    CodeDeployApplication: S.optional(S.String),
    CodeDeployInstanceGroupId: S.optional(S.String),
    Ec2State: S.optional(S.String),
    RdsEventCategories: S.optional(S.String),
    RdsEventMessage: S.optional(S.String),
    S3EventName: S.optional(S.String),
    StatesExecutionArn: S.optional(S.String),
    StatesArn: S.optional(S.String),
    StatesStatus: S.optional(S.String),
    StatesInput: S.optional(S.String),
    EbsEvent: S.optional(S.String),
    EbsResult: S.optional(S.String),
    EbsCause: S.optional(S.String),
    EbsRequestId: S.optional(S.String),
    XRayFaultPercent: S.optional(S.Number),
    XRayThrottlePercent: S.optional(S.Number),
    XRayErrorPercent: S.optional(S.Number),
    XRayRequestCount: S.optional(S.Number),
    XRayRequestAverageLatency: S.optional(S.Number),
    XRayNodeName: S.optional(S.String),
    XRayNodeType: S.optional(S.String),
  }),
).annotations({ identifier: "Observation" }) as any as S.Schema<Observation>;
export type ObservationList = Observation[];
export const ObservationList = S.Array(Observation);
export interface RelatedObservations {
  ObservationList?: ObservationList;
}
export const RelatedObservations = S.suspend(() =>
  S.Struct({ ObservationList: S.optional(ObservationList) }),
).annotations({
  identifier: "RelatedObservations",
}) as any as S.Schema<RelatedObservations>;
export interface ConfigurationEvent {
  ResourceGroupName?: string;
  AccountId?: string;
  MonitoredResourceARN?: string;
  EventStatus?: string;
  EventResourceType?: string;
  EventTime?: Date;
  EventDetail?: string;
  EventResourceName?: string;
}
export const ConfigurationEvent = S.suspend(() =>
  S.Struct({
    ResourceGroupName: S.optional(S.String),
    AccountId: S.optional(S.String),
    MonitoredResourceARN: S.optional(S.String),
    EventStatus: S.optional(S.String),
    EventResourceType: S.optional(S.String),
    EventTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventDetail: S.optional(S.String),
    EventResourceName: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigurationEvent",
}) as any as S.Schema<ConfigurationEvent>;
export type ConfigurationEventList = ConfigurationEvent[];
export const ConfigurationEventList = S.Array(ConfigurationEvent);
export interface Workload {
  WorkloadId?: string;
  ComponentName?: string;
  WorkloadName?: string;
  Tier?: string;
  WorkloadRemarks?: string;
  MissingWorkloadConfig?: boolean;
}
export const Workload = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    ComponentName: S.optional(S.String),
    WorkloadName: S.optional(S.String),
    Tier: S.optional(S.String),
    WorkloadRemarks: S.optional(S.String),
    MissingWorkloadConfig: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Workload" }) as any as S.Schema<Workload>;
export type WorkloadList = Workload[];
export const WorkloadList = S.Array(Workload);
export interface AddWorkloadResponse {
  WorkloadId?: string;
  WorkloadConfiguration?: WorkloadConfiguration;
}
export const AddWorkloadResponse = S.suspend(() =>
  S.Struct({
    WorkloadId: S.optional(S.String),
    WorkloadConfiguration: S.optional(WorkloadConfiguration),
  }),
).annotations({
  identifier: "AddWorkloadResponse",
}) as any as S.Schema<AddWorkloadResponse>;
export interface CreateApplicationResponse {
  ApplicationInfo?: ApplicationInfo;
}
export const CreateApplicationResponse = S.suspend(() =>
  S.Struct({ ApplicationInfo: S.optional(ApplicationInfo) }),
).annotations({
  identifier: "CreateApplicationResponse",
}) as any as S.Schema<CreateApplicationResponse>;
export interface CreateLogPatternResponse {
  LogPattern?: LogPattern;
  ResourceGroupName?: string;
}
export const CreateLogPatternResponse = S.suspend(() =>
  S.Struct({
    LogPattern: S.optional(LogPattern),
    ResourceGroupName: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateLogPatternResponse",
}) as any as S.Schema<CreateLogPatternResponse>;
export interface DescribeApplicationResponse {
  ApplicationInfo?: ApplicationInfo;
}
export const DescribeApplicationResponse = S.suspend(() =>
  S.Struct({ ApplicationInfo: S.optional(ApplicationInfo) }),
).annotations({
  identifier: "DescribeApplicationResponse",
}) as any as S.Schema<DescribeApplicationResponse>;
export interface DescribeObservationResponse {
  Observation?: Observation;
}
export const DescribeObservationResponse = S.suspend(() =>
  S.Struct({ Observation: S.optional(Observation) }),
).annotations({
  identifier: "DescribeObservationResponse",
}) as any as S.Schema<DescribeObservationResponse>;
export interface DescribeProblemObservationsResponse {
  RelatedObservations?: RelatedObservations;
}
export const DescribeProblemObservationsResponse = S.suspend(() =>
  S.Struct({ RelatedObservations: S.optional(RelatedObservations) }),
).annotations({
  identifier: "DescribeProblemObservationsResponse",
}) as any as S.Schema<DescribeProblemObservationsResponse>;
export interface ListConfigurationHistoryResponse {
  EventList?: ConfigurationEventList;
  NextToken?: string;
}
export const ListConfigurationHistoryResponse = S.suspend(() =>
  S.Struct({
    EventList: S.optional(ConfigurationEventList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConfigurationHistoryResponse",
}) as any as S.Schema<ListConfigurationHistoryResponse>;
export interface ListWorkloadsResponse {
  WorkloadList?: WorkloadList;
  NextToken?: string;
}
export const ListWorkloadsResponse = S.suspend(() =>
  S.Struct({
    WorkloadList: S.optional(WorkloadList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkloadsResponse",
}) as any as S.Schema<ListWorkloadsResponse>;
export interface DescribeProblemResponse {
  Problem?: Problem;
  SNSNotificationArn?: string;
}
export const DescribeProblemResponse = S.suspend(() =>
  S.Struct({
    Problem: S.optional(Problem),
    SNSNotificationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeProblemResponse",
}) as any as S.Schema<DescribeProblemResponse>;
export interface DescribeComponentResponse {
  ApplicationComponent?: ApplicationComponent;
  ResourceList?: ResourceList;
}
export const DescribeComponentResponse = S.suspend(() =>
  S.Struct({
    ApplicationComponent: S.optional(ApplicationComponent),
    ResourceList: S.optional(ResourceList),
  }),
).annotations({
  identifier: "DescribeComponentResponse",
}) as any as S.Schema<DescribeComponentResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServerException", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "BadRequestException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceNotFoundException", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceInUseException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessDeniedException", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class TagsAlreadyExistException extends S.TaggedError<TagsAlreadyExistException>()(
  "TagsAlreadyExistException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists the IDs of the applications that you are monitoring.
 */
export const listApplications: {
  (
    input: ListApplicationsRequest,
  ): Effect.Effect<
    ListApplicationsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationsRequest,
  ) => Stream.Stream<
    ListApplicationsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationsRequest,
  ) => Stream.Stream<
    unknown,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the INFO, WARN, and ERROR events for periodic configuration updates performed by
 * Application Insights. Examples of events represented are:
 *
 * - INFO: creating a new alarm or updating an alarm threshold.
 *
 * - WARN: alarm not created due to insufficient data points used to predict
 * thresholds.
 *
 * - ERROR: alarm not created due to permission errors or exceeding quotas.
 */
export const listConfigurationHistory: {
  (
    input: ListConfigurationHistoryRequest,
  ): Effect.Effect<
    ListConfigurationHistoryResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConfigurationHistoryRequest,
  ) => Stream.Stream<
    ListConfigurationHistoryResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConfigurationHistoryRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConfigurationHistoryRequest,
  output: ListConfigurationHistoryResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the workloads that are configured on a given component.
 */
export const listWorkloads: {
  (
    input: ListWorkloadsRequest,
  ): Effect.Effect<
    ListWorkloadsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkloadsRequest,
  ) => Stream.Stream<
    ListWorkloadsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkloadsRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkloadsRequest,
  output: ListWorkloadsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Add one or more tags (keys and values) to a specified application. A
 * *tag* is a label that you optionally define and associate with an
 * application. Tags can help you categorize and manage application in different ways, such as
 * by purpose, owner, environment, or other criteria.
 *
 * Each tag consists of a required *tag key* and an associated
 * *tag value*, both of which you define. A tag key is a general label
 * that acts as a category for more specific tag values. A tag value acts as a descriptor
 * within a tag key.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | ResourceNotFoundException
  | TooManyTagsException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ResourceNotFoundException,
    TooManyTagsException,
    ValidationException,
  ],
}));
/**
 * Adds a log pattern to a `LogPatternSet`.
 */
export const updateLogPattern: (
  input: UpdateLogPatternRequest,
) => Effect.Effect<
  UpdateLogPatternResponse,
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLogPatternRequest,
  output: UpdateLogPatternResponse,
  errors: [
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the custom component name and/or the list of resources that make up the
 * component.
 */
export const updateComponent: (
  input: UpdateComponentRequest,
) => Effect.Effect<
  UpdateComponentResponse,
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateComponentRequest,
  output: UpdateComponentResponse,
  errors: [
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the monitoring configurations for the component. The configuration input
 * parameter is an escaped JSON of the configuration and should match the schema of what is
 * returned by `DescribeComponentConfigurationRecommendation`.
 */
export const updateComponentConfiguration: (
  input: UpdateComponentConfigurationRequest,
) => Effect.Effect<
  UpdateComponentConfigurationResponse,
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateComponentConfigurationRequest,
  output: UpdateComponentConfigurationResponse,
  errors: [
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds a workload to a component. Each component can have at most five workloads.
 */
export const addWorkload: (
  input: AddWorkloadRequest,
) => Effect.Effect<
  AddWorkloadResponse,
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddWorkloadRequest,
  output: AddWorkloadResponse,
  errors: [
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the application.
 */
export const updateApplication: (
  input: UpdateApplicationRequest,
) => Effect.Effect<
  UpdateApplicationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds a workload to a component. Each component can have at most five workloads.
 */
export const updateWorkload: (
  input: UpdateWorkloadRequest,
) => Effect.Effect<
  UpdateWorkloadResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkloadRequest,
  output: UpdateWorkloadResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Ungroups a custom component. When you ungroup custom components, all applicable monitors
 * that are set up for the component are removed and the instances revert to their standalone
 * status.
 */
export const deleteComponent: (
  input: DeleteComponentRequest,
) => Effect.Effect<
  DeleteComponentResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteComponentRequest,
  output: DeleteComponentResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Remove workload from a component.
 */
export const removeWorkload: (
  input: RemoveWorkloadRequest,
) => Effect.Effect<
  RemoveWorkloadResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveWorkloadRequest,
  output: RemoveWorkloadResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Updates the visibility of the problem or specifies the problem as
 * `RESOLVED`.
 */
export const updateProblem: (
  input: UpdateProblemRequest,
) => Effect.Effect<
  UpdateProblemResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProblemRequest,
  output: UpdateProblemResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Removes the specified log pattern from a `LogPatternSet`.
 */
export const deleteLogPattern: (
  input: DeleteLogPatternRequest,
) => Effect.Effect<
  DeleteLogPatternResponse,
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLogPatternRequest,
  output: DeleteLogPatternResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Remove one or more tags (keys and values) from a specified application.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Removes the specified application from monitoring. Does not delete the
 * application.
 */
export const deleteApplication: (
  input: DeleteApplicationRequest,
) => Effect.Effect<
  DeleteApplicationResponse,
  | BadRequestException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    BadRequestException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the monitoring configuration of the component.
 */
export const describeComponentConfiguration: (
  input: DescribeComponentConfigurationRequest,
) => Effect.Effect<
  DescribeComponentConfigurationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeComponentConfigurationRequest,
  output: DescribeComponentConfigurationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the recommended monitoring configuration of the component.
 */
export const describeComponentConfigurationRecommendation: (
  input: DescribeComponentConfigurationRecommendationRequest,
) => Effect.Effect<
  DescribeComponentConfigurationRecommendationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeComponentConfigurationRecommendationRequest,
  output: DescribeComponentConfigurationRecommendationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describe a specific log pattern from a `LogPatternSet`.
 */
export const describeLogPattern: (
  input: DescribeLogPatternRequest,
) => Effect.Effect<
  DescribeLogPatternResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLogPatternRequest,
  output: DescribeLogPatternResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes a workload and its configuration.
 */
export const describeWorkload: (
  input: DescribeWorkloadRequest,
) => Effect.Effect<
  DescribeWorkloadResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWorkloadRequest,
  output: DescribeWorkloadResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the auto-grouped, standalone, and custom components of the application.
 */
export const listComponents: {
  (
    input: ListComponentsRequest,
  ): Effect.Effect<
    ListComponentsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComponentsRequest,
  ) => Stream.Stream<
    ListComponentsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComponentsRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListComponentsRequest,
  output: ListComponentsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the log patterns in the specific log `LogPatternSet`.
 */
export const listLogPatterns: {
  (
    input: ListLogPatternsRequest,
  ): Effect.Effect<
    ListLogPatternsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLogPatternsRequest,
  ) => Stream.Stream<
    ListLogPatternsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLogPatternsRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLogPatternsRequest,
  output: ListLogPatternsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the log pattern sets in the specific application.
 */
export const listLogPatternSets: {
  (
    input: ListLogPatternSetsRequest,
  ): Effect.Effect<
    ListLogPatternSetsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLogPatternSetsRequest,
  ) => Stream.Stream<
    ListLogPatternSetsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLogPatternSetsRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLogPatternSetsRequest,
  output: ListLogPatternSetsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the problems with your application.
 */
export const listProblems: {
  (
    input: ListProblemsRequest,
  ): Effect.Effect<
    ListProblemsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProblemsRequest,
  ) => Stream.Stream<
    ListProblemsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProblemsRequest,
  ) => Stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListProblemsRequest,
  output: ListProblemsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve a list of the tags (keys and values) that are associated with a specified
 * application. A *tag* is a label that you optionally define and associate
 * with an application. Each tag consists of a required *tag key* and an
 * optional associated *tag value*. A tag key is a general label that acts
 * as a category for more specific tag values. A tag value acts as a descriptor within a tag
 * key.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException, ValidationException],
}));
/**
 * Creates a custom component by grouping similar standalone instances to monitor.
 */
export const createComponent: (
  input: CreateComponentRequest,
) => Effect.Effect<
  CreateComponentResponse,
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateComponentRequest,
  output: CreateComponentResponse,
  errors: [
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds an log pattern to a `LogPatternSet`.
 */
export const createLogPattern: (
  input: CreateLogPatternRequest,
) => Effect.Effect<
  CreateLogPatternResponse,
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLogPatternRequest,
  output: CreateLogPatternResponse,
  errors: [
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the application.
 */
export const describeApplication: (
  input: DescribeApplicationRequest,
) => Effect.Effect<
  DescribeApplicationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeApplicationRequest,
  output: DescribeApplicationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes an anomaly or error with the application.
 */
export const describeObservation: (
  input: DescribeObservationRequest,
) => Effect.Effect<
  DescribeObservationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeObservationRequest,
  output: DescribeObservationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the anomalies or errors associated with the problem.
 */
export const describeProblemObservations: (
  input: DescribeProblemObservationsRequest,
) => Effect.Effect<
  DescribeProblemObservationsResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProblemObservationsRequest,
  output: DescribeProblemObservationsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes an application problem.
 */
export const describeProblem: (
  input: DescribeProblemRequest,
) => Effect.Effect<
  DescribeProblemResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProblemRequest,
  output: DescribeProblemResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds an application that is created from a resource group.
 */
export const createApplication: (
  input: CreateApplicationRequest,
) => Effect.Effect<
  CreateApplicationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceInUseException
  | ResourceNotFoundException
  | TagsAlreadyExistException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceInUseException,
    ResourceNotFoundException,
    TagsAlreadyExistException,
    ValidationException,
  ],
}));
/**
 * Describes a component and lists the resources that are grouped together in a
 * component.
 */
export const describeComponent: (
  input: DescribeComponentRequest,
) => Effect.Effect<
  DescribeComponentResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeComponentRequest,
  output: DescribeComponentResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
