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
  sdkId: "Application Auto Scaling",
  serviceShapeName: "AnyScaleFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "application-autoscaling" });
const ver = T.ServiceVersion("2016-02-06");
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
                        url: "https://application-autoscaling-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://application-autoscaling.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://application-autoscaling-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://application-autoscaling.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://application-autoscaling.{Region}.{PartitionResult#dnsSuffix}",
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
export type ResourceIdMaxLen1600 = string;
export type MaxResults = number;
export type XmlString = string;
export type PolicyName = string;
export type AmazonResourceName = string;
export type ScheduledActionName = string;
export type ResourceCapacity = number;
export type TagKey = string;
export type MinAdjustmentMagnitude = number;
export type Cooldown = number;
export type MetricScale = number;
export type PredictiveScalingSchedulingBufferTime = number;
export type PredictiveScalingMaxCapacityBuffer = number;
export type TagValue = string;
export type ErrorMessage = string;
export type ExceptionMessage = string;
export type ScalingAdjustment = number;
export type ResourceLabel = string;
export type MetricName = string;
export type MetricNamespace = string;
export type MetricUnit = string;
export type ResourceId = string;
export type MetricDimensionName = string;
export type MetricDimensionValue = string;
export type Expression = string;
export type Id = string;
export type PredictiveScalingMetricType = string;
export type TargetTrackingMetricUnit = string;
export type TargetTrackingMetricName = string;
export type TargetTrackingMetricNamespace = string;
export type PredictiveScalingMetricUnit = string;
export type TargetTrackingMetricDimensionName = string;
export type TargetTrackingMetricDimensionValue = string;
export type PredictiveScalingMetricName = string;
export type PredictiveScalingMetricNamespace = string;
export type PredictiveScalingMetricDimensionName = string;
export type PredictiveScalingMetricDimensionValue = string;

//# Schemas
export type ResourceIdsMaxLen1600 = string[];
export const ResourceIdsMaxLen1600 = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteScalingPolicyRequest {
  PolicyName: string;
  ServiceNamespace: string;
  ResourceId: string;
  ScalableDimension: string;
}
export const DeleteScalingPolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyName: S.String,
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteScalingPolicyRequest",
}) as any as S.Schema<DeleteScalingPolicyRequest>;
export interface DeleteScalingPolicyResponse {}
export const DeleteScalingPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteScalingPolicyResponse",
}) as any as S.Schema<DeleteScalingPolicyResponse>;
export interface DeleteScheduledActionRequest {
  ServiceNamespace: string;
  ScheduledActionName: string;
  ResourceId: string;
  ScalableDimension: string;
}
export const DeleteScheduledActionRequest = S.suspend(() =>
  S.Struct({
    ServiceNamespace: S.String,
    ScheduledActionName: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteScheduledActionRequest",
}) as any as S.Schema<DeleteScheduledActionRequest>;
export interface DeleteScheduledActionResponse {}
export const DeleteScheduledActionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteScheduledActionResponse",
}) as any as S.Schema<DeleteScheduledActionResponse>;
export interface DeregisterScalableTargetRequest {
  ServiceNamespace: string;
  ResourceId: string;
  ScalableDimension: string;
}
export const DeregisterScalableTargetRequest = S.suspend(() =>
  S.Struct({
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeregisterScalableTargetRequest",
}) as any as S.Schema<DeregisterScalableTargetRequest>;
export interface DeregisterScalableTargetResponse {}
export const DeregisterScalableTargetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeregisterScalableTargetResponse",
}) as any as S.Schema<DeregisterScalableTargetResponse>;
export interface DescribeScalableTargetsRequest {
  ServiceNamespace: string;
  ResourceIds?: ResourceIdsMaxLen1600;
  ScalableDimension?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeScalableTargetsRequest = S.suspend(() =>
  S.Struct({
    ServiceNamespace: S.String,
    ResourceIds: S.optional(ResourceIdsMaxLen1600),
    ScalableDimension: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeScalableTargetsRequest",
}) as any as S.Schema<DescribeScalableTargetsRequest>;
export interface DescribeScalingActivitiesRequest {
  ServiceNamespace: string;
  ResourceId?: string;
  ScalableDimension?: string;
  MaxResults?: number;
  NextToken?: string;
  IncludeNotScaledActivities?: boolean;
}
export const DescribeScalingActivitiesRequest = S.suspend(() =>
  S.Struct({
    ServiceNamespace: S.String,
    ResourceId: S.optional(S.String),
    ScalableDimension: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    IncludeNotScaledActivities: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeScalingActivitiesRequest",
}) as any as S.Schema<DescribeScalingActivitiesRequest>;
export interface DescribeScalingPoliciesRequest {
  PolicyNames?: ResourceIdsMaxLen1600;
  ServiceNamespace: string;
  ResourceId?: string;
  ScalableDimension?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeScalingPoliciesRequest = S.suspend(() =>
  S.Struct({
    PolicyNames: S.optional(ResourceIdsMaxLen1600),
    ServiceNamespace: S.String,
    ResourceId: S.optional(S.String),
    ScalableDimension: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeScalingPoliciesRequest",
}) as any as S.Schema<DescribeScalingPoliciesRequest>;
export interface DescribeScheduledActionsRequest {
  ScheduledActionNames?: ResourceIdsMaxLen1600;
  ServiceNamespace: string;
  ResourceId?: string;
  ScalableDimension?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeScheduledActionsRequest = S.suspend(() =>
  S.Struct({
    ScheduledActionNames: S.optional(ResourceIdsMaxLen1600),
    ServiceNamespace: S.String,
    ResourceId: S.optional(S.String),
    ScalableDimension: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeScheduledActionsRequest",
}) as any as S.Schema<DescribeScheduledActionsRequest>;
export interface GetPredictiveScalingForecastRequest {
  ServiceNamespace: string;
  ResourceId: string;
  ScalableDimension: string;
  PolicyName: string;
  StartTime: Date;
  EndTime: Date;
}
export const GetPredictiveScalingForecastRequest = S.suspend(() =>
  S.Struct({
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    PolicyName: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPredictiveScalingForecastRequest",
}) as any as S.Schema<GetPredictiveScalingForecastRequest>;
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
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagMap }).pipe(
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
export interface ScalableTargetAction {
  MinCapacity?: number;
  MaxCapacity?: number;
}
export const ScalableTargetAction = S.suspend(() =>
  S.Struct({
    MinCapacity: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
  }),
).annotations({
  identifier: "ScalableTargetAction",
}) as any as S.Schema<ScalableTargetAction>;
export interface SuspendedState {
  DynamicScalingInSuspended?: boolean;
  DynamicScalingOutSuspended?: boolean;
  ScheduledScalingSuspended?: boolean;
}
export const SuspendedState = S.suspend(() =>
  S.Struct({
    DynamicScalingInSuspended: S.optional(S.Boolean),
    DynamicScalingOutSuspended: S.optional(S.Boolean),
    ScheduledScalingSuspended: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SuspendedState",
}) as any as S.Schema<SuspendedState>;
export interface ListTagsForResourceResponse {
  Tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutScheduledActionRequest {
  ServiceNamespace: string;
  Schedule?: string;
  Timezone?: string;
  ScheduledActionName: string;
  ResourceId: string;
  ScalableDimension: string;
  StartTime?: Date;
  EndTime?: Date;
  ScalableTargetAction?: ScalableTargetAction;
}
export const PutScheduledActionRequest = S.suspend(() =>
  S.Struct({
    ServiceNamespace: S.String,
    Schedule: S.optional(S.String),
    Timezone: S.optional(S.String),
    ScheduledActionName: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ScalableTargetAction: S.optional(ScalableTargetAction),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutScheduledActionRequest",
}) as any as S.Schema<PutScheduledActionRequest>;
export interface PutScheduledActionResponse {}
export const PutScheduledActionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutScheduledActionResponse",
}) as any as S.Schema<PutScheduledActionResponse>;
export interface RegisterScalableTargetRequest {
  ServiceNamespace: string;
  ResourceId: string;
  ScalableDimension: string;
  MinCapacity?: number;
  MaxCapacity?: number;
  RoleARN?: string;
  SuspendedState?: SuspendedState;
  Tags?: TagMap;
}
export const RegisterScalableTargetRequest = S.suspend(() =>
  S.Struct({
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    MinCapacity: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
    RoleARN: S.optional(S.String),
    SuspendedState: S.optional(SuspendedState),
    Tags: S.optional(TagMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RegisterScalableTargetRequest",
}) as any as S.Schema<RegisterScalableTargetRequest>;
export type PredictiveScalingForecastTimestamps = Date[];
export const PredictiveScalingForecastTimestamps = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export type PredictiveScalingForecastValues = number[];
export const PredictiveScalingForecastValues = S.Array(S.Number);
export interface StepAdjustment {
  MetricIntervalLowerBound?: number;
  MetricIntervalUpperBound?: number;
  ScalingAdjustment: number;
}
export const StepAdjustment = S.suspend(() =>
  S.Struct({
    MetricIntervalLowerBound: S.optional(S.Number),
    MetricIntervalUpperBound: S.optional(S.Number),
    ScalingAdjustment: S.Number,
  }),
).annotations({
  identifier: "StepAdjustment",
}) as any as S.Schema<StepAdjustment>;
export type StepAdjustments = StepAdjustment[];
export const StepAdjustments = S.Array(StepAdjustment);
export interface PredefinedMetricSpecification {
  PredefinedMetricType: string;
  ResourceLabel?: string;
}
export const PredefinedMetricSpecification = S.suspend(() =>
  S.Struct({
    PredefinedMetricType: S.String,
    ResourceLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "PredefinedMetricSpecification",
}) as any as S.Schema<PredefinedMetricSpecification>;
export interface ScalableTarget {
  ServiceNamespace: string;
  ResourceId: string;
  ScalableDimension: string;
  MinCapacity: number;
  MaxCapacity: number;
  PredictedCapacity?: number;
  RoleARN: string;
  CreationTime: Date;
  SuspendedState?: SuspendedState;
  ScalableTargetARN?: string;
}
export const ScalableTarget = S.suspend(() =>
  S.Struct({
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    MinCapacity: S.Number,
    MaxCapacity: S.Number,
    PredictedCapacity: S.optional(S.Number),
    RoleARN: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    SuspendedState: S.optional(SuspendedState),
    ScalableTargetARN: S.optional(S.String),
  }),
).annotations({
  identifier: "ScalableTarget",
}) as any as S.Schema<ScalableTarget>;
export type ScalableTargets = ScalableTarget[];
export const ScalableTargets = S.Array(ScalableTarget);
export interface ScheduledAction {
  ScheduledActionName: string;
  ScheduledActionARN: string;
  ServiceNamespace: string;
  Schedule: string;
  Timezone?: string;
  ResourceId: string;
  ScalableDimension?: string;
  StartTime?: Date;
  EndTime?: Date;
  ScalableTargetAction?: ScalableTargetAction;
  CreationTime: Date;
}
export const ScheduledAction = S.suspend(() =>
  S.Struct({
    ScheduledActionName: S.String,
    ScheduledActionARN: S.String,
    ServiceNamespace: S.String,
    Schedule: S.String,
    Timezone: S.optional(S.String),
    ResourceId: S.String,
    ScalableDimension: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ScalableTargetAction: S.optional(ScalableTargetAction),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ScheduledAction",
}) as any as S.Schema<ScheduledAction>;
export type ScheduledActions = ScheduledAction[];
export const ScheduledActions = S.Array(ScheduledAction);
export interface PredictiveScalingPredefinedMetricPairSpecification {
  PredefinedMetricType: string;
  ResourceLabel?: string;
}
export const PredictiveScalingPredefinedMetricPairSpecification = S.suspend(
  () =>
    S.Struct({
      PredefinedMetricType: S.String,
      ResourceLabel: S.optional(S.String),
    }),
).annotations({
  identifier: "PredictiveScalingPredefinedMetricPairSpecification",
}) as any as S.Schema<PredictiveScalingPredefinedMetricPairSpecification>;
export interface PredictiveScalingPredefinedScalingMetricSpecification {
  PredefinedMetricType: string;
  ResourceLabel?: string;
}
export const PredictiveScalingPredefinedScalingMetricSpecification = S.suspend(
  () =>
    S.Struct({
      PredefinedMetricType: S.String,
      ResourceLabel: S.optional(S.String),
    }),
).annotations({
  identifier: "PredictiveScalingPredefinedScalingMetricSpecification",
}) as any as S.Schema<PredictiveScalingPredefinedScalingMetricSpecification>;
export interface PredictiveScalingPredefinedLoadMetricSpecification {
  PredefinedMetricType: string;
  ResourceLabel?: string;
}
export const PredictiveScalingPredefinedLoadMetricSpecification = S.suspend(
  () =>
    S.Struct({
      PredefinedMetricType: S.String,
      ResourceLabel: S.optional(S.String),
    }),
).annotations({
  identifier: "PredictiveScalingPredefinedLoadMetricSpecification",
}) as any as S.Schema<PredictiveScalingPredefinedLoadMetricSpecification>;
export interface PredictiveScalingMetricDimension {
  Name: string;
  Value: string;
}
export const PredictiveScalingMetricDimension = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "PredictiveScalingMetricDimension",
}) as any as S.Schema<PredictiveScalingMetricDimension>;
export type PredictiveScalingMetricDimensions =
  PredictiveScalingMetricDimension[];
export const PredictiveScalingMetricDimensions = S.Array(
  PredictiveScalingMetricDimension,
);
export interface PredictiveScalingMetric {
  Dimensions?: PredictiveScalingMetricDimensions;
  MetricName?: string;
  Namespace?: string;
}
export const PredictiveScalingMetric = S.suspend(() =>
  S.Struct({
    Dimensions: S.optional(PredictiveScalingMetricDimensions),
    MetricName: S.optional(S.String),
    Namespace: S.optional(S.String),
  }),
).annotations({
  identifier: "PredictiveScalingMetric",
}) as any as S.Schema<PredictiveScalingMetric>;
export interface PredictiveScalingMetricStat {
  Metric: PredictiveScalingMetric;
  Stat: string;
  Unit?: string;
}
export const PredictiveScalingMetricStat = S.suspend(() =>
  S.Struct({
    Metric: PredictiveScalingMetric,
    Stat: S.String,
    Unit: S.optional(S.String),
  }),
).annotations({
  identifier: "PredictiveScalingMetricStat",
}) as any as S.Schema<PredictiveScalingMetricStat>;
export interface PredictiveScalingMetricDataQuery {
  Id: string;
  Expression?: string;
  MetricStat?: PredictiveScalingMetricStat;
  Label?: string;
  ReturnData?: boolean;
}
export const PredictiveScalingMetricDataQuery = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Expression: S.optional(S.String),
    MetricStat: S.optional(PredictiveScalingMetricStat),
    Label: S.optional(S.String),
    ReturnData: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PredictiveScalingMetricDataQuery",
}) as any as S.Schema<PredictiveScalingMetricDataQuery>;
export type PredictiveScalingMetricDataQueries =
  PredictiveScalingMetricDataQuery[];
export const PredictiveScalingMetricDataQueries = S.Array(
  PredictiveScalingMetricDataQuery,
);
export interface PredictiveScalingCustomizedMetricSpecification {
  MetricDataQueries: PredictiveScalingMetricDataQueries;
}
export const PredictiveScalingCustomizedMetricSpecification = S.suspend(() =>
  S.Struct({ MetricDataQueries: PredictiveScalingMetricDataQueries }),
).annotations({
  identifier: "PredictiveScalingCustomizedMetricSpecification",
}) as any as S.Schema<PredictiveScalingCustomizedMetricSpecification>;
export interface PredictiveScalingMetricSpecification {
  TargetValue: number;
  PredefinedMetricPairSpecification?: PredictiveScalingPredefinedMetricPairSpecification;
  PredefinedScalingMetricSpecification?: PredictiveScalingPredefinedScalingMetricSpecification;
  PredefinedLoadMetricSpecification?: PredictiveScalingPredefinedLoadMetricSpecification;
  CustomizedScalingMetricSpecification?: PredictiveScalingCustomizedMetricSpecification;
  CustomizedLoadMetricSpecification?: PredictiveScalingCustomizedMetricSpecification;
  CustomizedCapacityMetricSpecification?: PredictiveScalingCustomizedMetricSpecification;
}
export const PredictiveScalingMetricSpecification = S.suspend(() =>
  S.Struct({
    TargetValue: S.Number,
    PredefinedMetricPairSpecification: S.optional(
      PredictiveScalingPredefinedMetricPairSpecification,
    ),
    PredefinedScalingMetricSpecification: S.optional(
      PredictiveScalingPredefinedScalingMetricSpecification,
    ),
    PredefinedLoadMetricSpecification: S.optional(
      PredictiveScalingPredefinedLoadMetricSpecification,
    ),
    CustomizedScalingMetricSpecification: S.optional(
      PredictiveScalingCustomizedMetricSpecification,
    ),
    CustomizedLoadMetricSpecification: S.optional(
      PredictiveScalingCustomizedMetricSpecification,
    ),
    CustomizedCapacityMetricSpecification: S.optional(
      PredictiveScalingCustomizedMetricSpecification,
    ),
  }),
).annotations({
  identifier: "PredictiveScalingMetricSpecification",
}) as any as S.Schema<PredictiveScalingMetricSpecification>;
export interface LoadForecast {
  Timestamps: PredictiveScalingForecastTimestamps;
  Values: PredictiveScalingForecastValues;
  MetricSpecification: PredictiveScalingMetricSpecification;
}
export const LoadForecast = S.suspend(() =>
  S.Struct({
    Timestamps: PredictiveScalingForecastTimestamps,
    Values: PredictiveScalingForecastValues,
    MetricSpecification: PredictiveScalingMetricSpecification,
  }),
).annotations({ identifier: "LoadForecast" }) as any as S.Schema<LoadForecast>;
export type LoadForecasts = LoadForecast[];
export const LoadForecasts = S.Array(LoadForecast);
export interface CapacityForecast {
  Timestamps: PredictiveScalingForecastTimestamps;
  Values: PredictiveScalingForecastValues;
}
export const CapacityForecast = S.suspend(() =>
  S.Struct({
    Timestamps: PredictiveScalingForecastTimestamps,
    Values: PredictiveScalingForecastValues,
  }),
).annotations({
  identifier: "CapacityForecast",
}) as any as S.Schema<CapacityForecast>;
export interface StepScalingPolicyConfiguration {
  AdjustmentType?: string;
  StepAdjustments?: StepAdjustments;
  MinAdjustmentMagnitude?: number;
  Cooldown?: number;
  MetricAggregationType?: string;
}
export const StepScalingPolicyConfiguration = S.suspend(() =>
  S.Struct({
    AdjustmentType: S.optional(S.String),
    StepAdjustments: S.optional(StepAdjustments),
    MinAdjustmentMagnitude: S.optional(S.Number),
    Cooldown: S.optional(S.Number),
    MetricAggregationType: S.optional(S.String),
  }),
).annotations({
  identifier: "StepScalingPolicyConfiguration",
}) as any as S.Schema<StepScalingPolicyConfiguration>;
export interface MetricDimension {
  Name: string;
  Value: string;
}
export const MetricDimension = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "MetricDimension",
}) as any as S.Schema<MetricDimension>;
export type MetricDimensions = MetricDimension[];
export const MetricDimensions = S.Array(MetricDimension);
export interface DescribeScalableTargetsResponse {
  ScalableTargets?: ScalableTargets;
  NextToken?: string;
}
export const DescribeScalableTargetsResponse = S.suspend(() =>
  S.Struct({
    ScalableTargets: S.optional(ScalableTargets),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeScalableTargetsResponse",
}) as any as S.Schema<DescribeScalableTargetsResponse>;
export interface DescribeScheduledActionsResponse {
  ScheduledActions?: ScheduledActions;
  NextToken?: string;
}
export const DescribeScheduledActionsResponse = S.suspend(() =>
  S.Struct({
    ScheduledActions: S.optional(ScheduledActions),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeScheduledActionsResponse",
}) as any as S.Schema<DescribeScheduledActionsResponse>;
export interface GetPredictiveScalingForecastResponse {
  LoadForecast?: LoadForecasts;
  CapacityForecast?: CapacityForecast;
  UpdateTime?: Date;
}
export const GetPredictiveScalingForecastResponse = S.suspend(() =>
  S.Struct({
    LoadForecast: S.optional(LoadForecasts),
    CapacityForecast: S.optional(CapacityForecast),
    UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetPredictiveScalingForecastResponse",
}) as any as S.Schema<GetPredictiveScalingForecastResponse>;
export interface RegisterScalableTargetResponse {
  ScalableTargetARN?: string;
}
export const RegisterScalableTargetResponse = S.suspend(() =>
  S.Struct({ ScalableTargetARN: S.optional(S.String) }),
).annotations({
  identifier: "RegisterScalableTargetResponse",
}) as any as S.Schema<RegisterScalableTargetResponse>;
export interface NotScaledReason {
  Code: string;
  MaxCapacity?: number;
  MinCapacity?: number;
  CurrentCapacity?: number;
}
export const NotScaledReason = S.suspend(() =>
  S.Struct({
    Code: S.String,
    MaxCapacity: S.optional(S.Number),
    MinCapacity: S.optional(S.Number),
    CurrentCapacity: S.optional(S.Number),
  }),
).annotations({
  identifier: "NotScaledReason",
}) as any as S.Schema<NotScaledReason>;
export type NotScaledReasons = NotScaledReason[];
export const NotScaledReasons = S.Array(NotScaledReason);
export interface Alarm {
  AlarmName: string;
  AlarmARN: string;
}
export const Alarm = S.suspend(() =>
  S.Struct({ AlarmName: S.String, AlarmARN: S.String }),
).annotations({ identifier: "Alarm" }) as any as S.Schema<Alarm>;
export type Alarms = Alarm[];
export const Alarms = S.Array(Alarm);
export interface ScalingActivity {
  ActivityId: string;
  ServiceNamespace: string;
  ResourceId: string;
  ScalableDimension: string;
  Description: string;
  Cause: string;
  StartTime: Date;
  EndTime?: Date;
  StatusCode: string;
  StatusMessage?: string;
  Details?: string;
  NotScaledReasons?: NotScaledReasons;
}
export const ScalingActivity = S.suspend(() =>
  S.Struct({
    ActivityId: S.String,
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    Description: S.String,
    Cause: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StatusCode: S.String,
    StatusMessage: S.optional(S.String),
    Details: S.optional(S.String),
    NotScaledReasons: S.optional(NotScaledReasons),
  }),
).annotations({
  identifier: "ScalingActivity",
}) as any as S.Schema<ScalingActivity>;
export type ScalingActivities = ScalingActivity[];
export const ScalingActivities = S.Array(ScalingActivity);
export interface TargetTrackingMetricDimension {
  Name: string;
  Value: string;
}
export const TargetTrackingMetricDimension = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({
  identifier: "TargetTrackingMetricDimension",
}) as any as S.Schema<TargetTrackingMetricDimension>;
export type TargetTrackingMetricDimensions = TargetTrackingMetricDimension[];
export const TargetTrackingMetricDimensions = S.Array(
  TargetTrackingMetricDimension,
);
export interface TargetTrackingMetric {
  Dimensions?: TargetTrackingMetricDimensions;
  MetricName?: string;
  Namespace?: string;
}
export const TargetTrackingMetric = S.suspend(() =>
  S.Struct({
    Dimensions: S.optional(TargetTrackingMetricDimensions),
    MetricName: S.optional(S.String),
    Namespace: S.optional(S.String),
  }),
).annotations({
  identifier: "TargetTrackingMetric",
}) as any as S.Schema<TargetTrackingMetric>;
export interface TargetTrackingMetricStat {
  Metric: TargetTrackingMetric;
  Stat: string;
  Unit?: string;
}
export const TargetTrackingMetricStat = S.suspend(() =>
  S.Struct({
    Metric: TargetTrackingMetric,
    Stat: S.String,
    Unit: S.optional(S.String),
  }),
).annotations({
  identifier: "TargetTrackingMetricStat",
}) as any as S.Schema<TargetTrackingMetricStat>;
export interface TargetTrackingMetricDataQuery {
  Expression?: string;
  Id: string;
  Label?: string;
  MetricStat?: TargetTrackingMetricStat;
  ReturnData?: boolean;
}
export const TargetTrackingMetricDataQuery = S.suspend(() =>
  S.Struct({
    Expression: S.optional(S.String),
    Id: S.String,
    Label: S.optional(S.String),
    MetricStat: S.optional(TargetTrackingMetricStat),
    ReturnData: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TargetTrackingMetricDataQuery",
}) as any as S.Schema<TargetTrackingMetricDataQuery>;
export type TargetTrackingMetricDataQueries = TargetTrackingMetricDataQuery[];
export const TargetTrackingMetricDataQueries = S.Array(
  TargetTrackingMetricDataQuery,
);
export interface CustomizedMetricSpecification {
  MetricName?: string;
  Namespace?: string;
  Dimensions?: MetricDimensions;
  Statistic?: string;
  Unit?: string;
  Metrics?: TargetTrackingMetricDataQueries;
}
export const CustomizedMetricSpecification = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    Namespace: S.optional(S.String),
    Dimensions: S.optional(MetricDimensions),
    Statistic: S.optional(S.String),
    Unit: S.optional(S.String),
    Metrics: S.optional(TargetTrackingMetricDataQueries),
  }),
).annotations({
  identifier: "CustomizedMetricSpecification",
}) as any as S.Schema<CustomizedMetricSpecification>;
export interface TargetTrackingScalingPolicyConfiguration {
  TargetValue: number;
  PredefinedMetricSpecification?: PredefinedMetricSpecification;
  CustomizedMetricSpecification?: CustomizedMetricSpecification;
  ScaleOutCooldown?: number;
  ScaleInCooldown?: number;
  DisableScaleIn?: boolean;
}
export const TargetTrackingScalingPolicyConfiguration = S.suspend(() =>
  S.Struct({
    TargetValue: S.Number,
    PredefinedMetricSpecification: S.optional(PredefinedMetricSpecification),
    CustomizedMetricSpecification: S.optional(CustomizedMetricSpecification),
    ScaleOutCooldown: S.optional(S.Number),
    ScaleInCooldown: S.optional(S.Number),
    DisableScaleIn: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TargetTrackingScalingPolicyConfiguration",
}) as any as S.Schema<TargetTrackingScalingPolicyConfiguration>;
export type PredictiveScalingMetricSpecifications =
  PredictiveScalingMetricSpecification[];
export const PredictiveScalingMetricSpecifications = S.Array(
  PredictiveScalingMetricSpecification,
);
export interface PredictiveScalingPolicyConfiguration {
  MetricSpecifications: PredictiveScalingMetricSpecifications;
  Mode?: string;
  SchedulingBufferTime?: number;
  MaxCapacityBreachBehavior?: string;
  MaxCapacityBuffer?: number;
}
export const PredictiveScalingPolicyConfiguration = S.suspend(() =>
  S.Struct({
    MetricSpecifications: PredictiveScalingMetricSpecifications,
    Mode: S.optional(S.String),
    SchedulingBufferTime: S.optional(S.Number),
    MaxCapacityBreachBehavior: S.optional(S.String),
    MaxCapacityBuffer: S.optional(S.Number),
  }),
).annotations({
  identifier: "PredictiveScalingPolicyConfiguration",
}) as any as S.Schema<PredictiveScalingPolicyConfiguration>;
export interface ScalingPolicy {
  PolicyARN: string;
  PolicyName: string;
  ServiceNamespace: string;
  ResourceId: string;
  ScalableDimension: string;
  PolicyType: string;
  StepScalingPolicyConfiguration?: StepScalingPolicyConfiguration;
  TargetTrackingScalingPolicyConfiguration?: TargetTrackingScalingPolicyConfiguration;
  PredictiveScalingPolicyConfiguration?: PredictiveScalingPolicyConfiguration;
  Alarms?: Alarms;
  CreationTime: Date;
}
export const ScalingPolicy = S.suspend(() =>
  S.Struct({
    PolicyARN: S.String,
    PolicyName: S.String,
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    PolicyType: S.String,
    StepScalingPolicyConfiguration: S.optional(StepScalingPolicyConfiguration),
    TargetTrackingScalingPolicyConfiguration: S.optional(
      TargetTrackingScalingPolicyConfiguration,
    ),
    PredictiveScalingPolicyConfiguration: S.optional(
      PredictiveScalingPolicyConfiguration,
    ),
    Alarms: S.optional(Alarms),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ScalingPolicy",
}) as any as S.Schema<ScalingPolicy>;
export type ScalingPolicies = ScalingPolicy[];
export const ScalingPolicies = S.Array(ScalingPolicy);
export interface DescribeScalingActivitiesResponse {
  ScalingActivities?: ScalingActivities;
  NextToken?: string;
}
export const DescribeScalingActivitiesResponse = S.suspend(() =>
  S.Struct({
    ScalingActivities: S.optional(ScalingActivities),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeScalingActivitiesResponse",
}) as any as S.Schema<DescribeScalingActivitiesResponse>;
export interface DescribeScalingPoliciesResponse {
  ScalingPolicies?: ScalingPolicies;
  NextToken?: string;
}
export const DescribeScalingPoliciesResponse = S.suspend(() =>
  S.Struct({
    ScalingPolicies: S.optional(ScalingPolicies),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeScalingPoliciesResponse",
}) as any as S.Schema<DescribeScalingPoliciesResponse>;
export interface PutScalingPolicyRequest {
  PolicyName: string;
  ServiceNamespace: string;
  ResourceId: string;
  ScalableDimension: string;
  PolicyType?: string;
  StepScalingPolicyConfiguration?: StepScalingPolicyConfiguration;
  TargetTrackingScalingPolicyConfiguration?: TargetTrackingScalingPolicyConfiguration;
  PredictiveScalingPolicyConfiguration?: PredictiveScalingPolicyConfiguration;
}
export const PutScalingPolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyName: S.String,
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    PolicyType: S.optional(S.String),
    StepScalingPolicyConfiguration: S.optional(StepScalingPolicyConfiguration),
    TargetTrackingScalingPolicyConfiguration: S.optional(
      TargetTrackingScalingPolicyConfiguration,
    ),
    PredictiveScalingPolicyConfiguration: S.optional(
      PredictiveScalingPolicyConfiguration,
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutScalingPolicyRequest",
}) as any as S.Schema<PutScalingPolicyRequest>;
export interface PutScalingPolicyResponse {
  PolicyARN: string;
  Alarms?: Alarms;
}
export const PutScalingPolicyResponse = S.suspend(() =>
  S.Struct({ PolicyARN: S.String, Alarms: S.optional(Alarms) }),
).annotations({
  identifier: "PutScalingPolicyResponse",
}) as any as S.Schema<PutScalingPolicyResponse>;

//# Errors
export class ConcurrentUpdateException extends S.TaggedError<ConcurrentUpdateException>()(
  "ConcurrentUpdateException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConcurrentUpdateException", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServiceException", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ObjectNotFoundException extends S.TaggedError<ObjectNotFoundException>()(
  "ObjectNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ObjectNotFoundException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidNextTokenException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceededException", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class FailedResourceAccessException extends S.TaggedError<FailedResourceAccessException>()(
  "FailedResourceAccessException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "FailedResourceAccessException",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns all the tags on the specified Application Auto Scaling scalable target.
 *
 * For general information about tags, including the format and syntax, see Tagging your Amazon Web Services
 * resources in the *Amazon Web Services General Reference*.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes tags from an Application Auto Scaling scalable target. To delete a tag, specify the tag key and
 * the Application Auto Scaling scalable target.
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
 * Retrieves the forecast data for a predictive scaling policy.
 *
 * Load forecasts are predictions of the hourly load values using historical load data
 * from CloudWatch and an analysis of historical trends. Capacity forecasts are represented as
 * predicted values for the minimum capacity that is needed on an hourly basis, based on
 * the hourly load forecast.
 *
 * A minimum of 24 hours of data is required to create the initial forecasts. However,
 * having a full 14 days of historical data results in more accurate forecasts.
 */
export const getPredictiveScalingForecast: (
  input: GetPredictiveScalingForecastRequest,
) => Effect.Effect<
  GetPredictiveScalingForecastResponse,
  InternalServiceException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPredictiveScalingForecastRequest,
  output: GetPredictiveScalingForecastResponse,
  errors: [InternalServiceException, ValidationException],
}));
/**
 * Adds or edits tags on an Application Auto Scaling scalable target.
 *
 * Each tag consists of a tag key and a tag value, which are both case-sensitive strings.
 * To add a tag, specify a new tag key and a tag value. To edit a tag, specify an existing tag
 * key and a new tag value.
 *
 * You can use this operation to tag an Application Auto Scaling scalable target, but you cannot tag a
 * scaling policy or scheduled action.
 *
 * You can also add tags to an Application Auto Scaling scalable target while creating it
 * (`RegisterScalableTarget`).
 *
 * For general information about tags, including the format and syntax, see Tagging your Amazon Web Services
 * resources in the *Amazon Web Services General Reference*.
 *
 * Use tags to control access to a scalable target. For more information, see Tagging support
 * for Application Auto Scaling in the *Application Auto Scaling User Guide*.
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
 * Deletes the specified scaling policy for an Application Auto Scaling scalable target.
 *
 * Deleting a step scaling policy deletes the underlying alarm action, but does not delete
 * the CloudWatch alarm associated with the scaling policy, even if it no longer has an associated
 * action.
 *
 * For more information, see Delete a step scaling policy and Delete a target tracking scaling policy in the
 * *Application Auto Scaling User Guide*.
 */
export const deleteScalingPolicy: (
  input: DeleteScalingPolicyRequest,
) => Effect.Effect<
  DeleteScalingPolicyResponse,
  | ConcurrentUpdateException
  | InternalServiceException
  | ObjectNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScalingPolicyRequest,
  output: DeleteScalingPolicyResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    ObjectNotFoundException,
    ValidationException,
  ],
}));
/**
 * Gets information about the scalable targets in the specified namespace.
 *
 * You can filter the results using `ResourceIds` and
 * `ScalableDimension`.
 */
export const describeScalableTargets: {
  (
    input: DescribeScalableTargetsRequest,
  ): Effect.Effect<
    DescribeScalableTargetsResponse,
    | ConcurrentUpdateException
    | InternalServiceException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeScalableTargetsRequest,
  ) => Stream.Stream<
    DescribeScalableTargetsResponse,
    | ConcurrentUpdateException
    | InternalServiceException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeScalableTargetsRequest,
  ) => Stream.Stream<
    ScalableTarget,
    | ConcurrentUpdateException
    | InternalServiceException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeScalableTargetsRequest,
  output: DescribeScalableTargetsResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    InvalidNextTokenException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ScalableTargets",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides descriptive information about the scaling activities in the specified namespace
 * from the previous six weeks.
 *
 * You can filter the results using `ResourceId` and
 * `ScalableDimension`.
 *
 * For information about viewing scaling activities using the Amazon Web Services CLI, see Scaling activities for Application Auto Scaling.
 */
export const describeScalingActivities: {
  (
    input: DescribeScalingActivitiesRequest,
  ): Effect.Effect<
    DescribeScalingActivitiesResponse,
    | ConcurrentUpdateException
    | InternalServiceException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeScalingActivitiesRequest,
  ) => Stream.Stream<
    DescribeScalingActivitiesResponse,
    | ConcurrentUpdateException
    | InternalServiceException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeScalingActivitiesRequest,
  ) => Stream.Stream<
    ScalingActivity,
    | ConcurrentUpdateException
    | InternalServiceException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeScalingActivitiesRequest,
  output: DescribeScalingActivitiesResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    InvalidNextTokenException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ScalingActivities",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Registers or updates a scalable target, which is the resource that you want to
 * scale.
 *
 * Scalable targets are uniquely identified by the combination of resource ID, scalable
 * dimension, and namespace, which represents some capacity dimension of the underlying
 * service.
 *
 * When you register a new scalable target, you must specify values for the minimum and
 * maximum capacity. If the specified resource is not active in the target service, this
 * operation does not change the resource's current capacity. Otherwise, it changes the
 * resource's current capacity to a value that is inside of this range.
 *
 * If you add a scaling policy, current capacity is adjustable within the specified range
 * when scaling starts. Application Auto Scaling scaling policies will not scale capacity to values that are
 * outside of the minimum and maximum range.
 *
 * After you register a scalable target, you do not need to register it again to use other
 * Application Auto Scaling operations. To see which resources have been registered, use DescribeScalableTargets. You can also view the scaling policies for a service
 * namespace by using DescribeScalableTargets. If you no longer need a scalable target, you can
 * deregister it by using DeregisterScalableTarget.
 *
 * To update a scalable target, specify the parameters that you want to change. Include the
 * parameters that identify the scalable target: resource ID, scalable dimension, and
 * namespace. Any parameters that you don't specify are not changed by this update request.
 *
 * If you call the `RegisterScalableTarget` API operation to create a
 * scalable target, there might be a brief delay until the operation achieves eventual
 * consistency. You might become aware of this brief delay if you get unexpected
 * errors when performing sequential operations. The typical strategy is to retry the
 * request, and some Amazon Web Services SDKs include automatic backoff and retry logic.
 *
 * If you call the `RegisterScalableTarget` API operation to update an
 * existing scalable target, Application Auto Scaling retrieves the current capacity of the resource. If
 * it's below the minimum capacity or above the maximum capacity, Application Auto Scaling adjusts the
 * capacity of the scalable target to place it within these bounds, even if you don't
 * include the `MinCapacity` or `MaxCapacity` request
 * parameters.
 */
export const registerScalableTarget: (
  input: RegisterScalableTargetRequest,
) => Effect.Effect<
  RegisterScalableTargetResponse,
  | ConcurrentUpdateException
  | InternalServiceException
  | LimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterScalableTargetRequest,
  output: RegisterScalableTargetResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    LimitExceededException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified scheduled action for an Application Auto Scaling scalable target.
 *
 * For more information, see Delete a scheduled action in the *Application Auto Scaling User Guide*.
 */
export const deleteScheduledAction: (
  input: DeleteScheduledActionRequest,
) => Effect.Effect<
  DeleteScheduledActionResponse,
  | ConcurrentUpdateException
  | InternalServiceException
  | ObjectNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScheduledActionRequest,
  output: DeleteScheduledActionResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    ObjectNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deregisters an Application Auto Scaling scalable target when you have finished using it. To see which
 * resources have been registered, use DescribeScalableTargets.
 *
 * Deregistering a scalable target deletes the scaling policies and the scheduled
 * actions that are associated with it.
 */
export const deregisterScalableTarget: (
  input: DeregisterScalableTargetRequest,
) => Effect.Effect<
  DeregisterScalableTargetResponse,
  | ConcurrentUpdateException
  | InternalServiceException
  | ObjectNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterScalableTargetRequest,
  output: DeregisterScalableTargetResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    ObjectNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the Application Auto Scaling scheduled actions for the specified service namespace.
 *
 * You can filter the results using the `ResourceId`,
 * `ScalableDimension`, and `ScheduledActionNames` parameters.
 *
 * For more information, see Scheduled scaling in the *Application Auto Scaling User Guide*.
 */
export const describeScheduledActions: {
  (
    input: DescribeScheduledActionsRequest,
  ): Effect.Effect<
    DescribeScheduledActionsResponse,
    | ConcurrentUpdateException
    | InternalServiceException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeScheduledActionsRequest,
  ) => Stream.Stream<
    DescribeScheduledActionsResponse,
    | ConcurrentUpdateException
    | InternalServiceException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeScheduledActionsRequest,
  ) => Stream.Stream<
    ScheduledAction,
    | ConcurrentUpdateException
    | InternalServiceException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeScheduledActionsRequest,
  output: DescribeScheduledActionsResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    InvalidNextTokenException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ScheduledActions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates or updates a scheduled action for an Application Auto Scaling scalable target.
 *
 * Each scalable target is identified by a service namespace, resource ID, and scalable
 * dimension. A scheduled action applies to the scalable target identified by those three
 * attributes. You cannot create a scheduled action until you have registered the resource as
 * a scalable target.
 *
 * When you specify start and end times with a recurring schedule using a cron expression
 * or rates, they form the boundaries for when the recurring action starts and stops.
 *
 * To update a scheduled action, specify the parameters that you want to change. If you
 * don't specify start and end times, the old values are deleted.
 *
 * For more information, see Scheduled scaling in the *Application Auto Scaling User Guide*.
 *
 * If a scalable target is deregistered, the scalable target is no longer available to
 * run scheduled actions. Any scheduled actions that were specified for the scalable target
 * are deleted.
 */
export const putScheduledAction: (
  input: PutScheduledActionRequest,
) => Effect.Effect<
  PutScheduledActionResponse,
  | ConcurrentUpdateException
  | InternalServiceException
  | LimitExceededException
  | ObjectNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutScheduledActionRequest,
  output: PutScheduledActionResponse,
  errors: [
    ConcurrentUpdateException,
    InternalServiceException,
    LimitExceededException,
    ObjectNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the Application Auto Scaling scaling policies for the specified service namespace.
 *
 * You can filter the results using `ResourceId`,
 * `ScalableDimension`, and `PolicyNames`.
 *
 * For more information, see Target tracking scaling policies and Step scaling policies in the *Application Auto Scaling User Guide*.
 */
export const describeScalingPolicies: {
  (
    input: DescribeScalingPoliciesRequest,
  ): Effect.Effect<
    DescribeScalingPoliciesResponse,
    | ConcurrentUpdateException
    | FailedResourceAccessException
    | InternalServiceException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeScalingPoliciesRequest,
  ) => Stream.Stream<
    DescribeScalingPoliciesResponse,
    | ConcurrentUpdateException
    | FailedResourceAccessException
    | InternalServiceException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeScalingPoliciesRequest,
  ) => Stream.Stream<
    ScalingPolicy,
    | ConcurrentUpdateException
    | FailedResourceAccessException
    | InternalServiceException
    | InvalidNextTokenException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeScalingPoliciesRequest,
  output: DescribeScalingPoliciesResponse,
  errors: [
    ConcurrentUpdateException,
    FailedResourceAccessException,
    InternalServiceException,
    InvalidNextTokenException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ScalingPolicies",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates or updates a scaling policy for an Application Auto Scaling scalable target.
 *
 * Each scalable target is identified by a service namespace, resource ID, and scalable
 * dimension. A scaling policy applies to the scalable target identified by those three
 * attributes. You cannot create a scaling policy until you have registered the resource as a
 * scalable target.
 *
 * Multiple scaling policies can be in force at the same time for the same scalable target.
 * You can have one or more target tracking scaling policies, one or more step scaling
 * policies, or both. However, there is a chance that multiple policies could conflict,
 * instructing the scalable target to scale out or in at the same time. Application Auto Scaling gives
 * precedence to the policy that provides the largest capacity for both scale out and scale
 * in. For example, if one policy increases capacity by 3, another policy increases capacity
 * by 200 percent, and the current capacity is 10, Application Auto Scaling uses the policy with the highest
 * calculated capacity (200% of 10 = 20) and scales out to 30.
 *
 * We recommend caution, however, when using target tracking scaling policies with step
 * scaling policies because conflicts between these policies can cause undesirable behavior.
 * For example, if the step scaling policy initiates a scale-in activity before the target
 * tracking policy is ready to scale in, the scale-in activity will not be blocked. After the
 * scale-in activity completes, the target tracking policy could instruct the scalable target
 * to scale out again.
 *
 * For more information, see Target tracking scaling policies, Step scaling policies, and Predictive scaling policies
 * in the *Application Auto Scaling User Guide*.
 *
 * If a scalable target is deregistered, the scalable target is no longer available to
 * use scaling policies. Any scaling policies that were specified for the scalable target
 * are deleted.
 */
export const putScalingPolicy: (
  input: PutScalingPolicyRequest,
) => Effect.Effect<
  PutScalingPolicyResponse,
  | ConcurrentUpdateException
  | FailedResourceAccessException
  | InternalServiceException
  | LimitExceededException
  | ObjectNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutScalingPolicyRequest,
  output: PutScalingPolicyResponse,
  errors: [
    ConcurrentUpdateException,
    FailedResourceAccessException,
    InternalServiceException,
    LimitExceededException,
    ObjectNotFoundException,
    ValidationException,
  ],
}));
