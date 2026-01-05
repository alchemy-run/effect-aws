import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export const ResourceIdsMaxLen1600 = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeleteScalingPolicyRequest extends S.Class<DeleteScalingPolicyRequest>(
  "DeleteScalingPolicyRequest",
)(
  {
    PolicyName: S.String,
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteScalingPolicyResponse extends S.Class<DeleteScalingPolicyResponse>(
  "DeleteScalingPolicyResponse",
)({}) {}
export class DeleteScheduledActionRequest extends S.Class<DeleteScheduledActionRequest>(
  "DeleteScheduledActionRequest",
)(
  {
    ServiceNamespace: S.String,
    ScheduledActionName: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteScheduledActionResponse extends S.Class<DeleteScheduledActionResponse>(
  "DeleteScheduledActionResponse",
)({}) {}
export class DeregisterScalableTargetRequest extends S.Class<DeregisterScalableTargetRequest>(
  "DeregisterScalableTargetRequest",
)(
  {
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterScalableTargetResponse extends S.Class<DeregisterScalableTargetResponse>(
  "DeregisterScalableTargetResponse",
)({}) {}
export class DescribeScalableTargetsRequest extends S.Class<DescribeScalableTargetsRequest>(
  "DescribeScalableTargetsRequest",
)(
  {
    ServiceNamespace: S.String,
    ResourceIds: S.optional(ResourceIdsMaxLen1600),
    ScalableDimension: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeScalingActivitiesRequest extends S.Class<DescribeScalingActivitiesRequest>(
  "DescribeScalingActivitiesRequest",
)(
  {
    ServiceNamespace: S.String,
    ResourceId: S.optional(S.String),
    ScalableDimension: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    IncludeNotScaledActivities: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeScalingPoliciesRequest extends S.Class<DescribeScalingPoliciesRequest>(
  "DescribeScalingPoliciesRequest",
)(
  {
    PolicyNames: S.optional(ResourceIdsMaxLen1600),
    ServiceNamespace: S.String,
    ResourceId: S.optional(S.String),
    ScalableDimension: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeScheduledActionsRequest extends S.Class<DescribeScheduledActionsRequest>(
  "DescribeScheduledActionsRequest",
)(
  {
    ScheduledActionNames: S.optional(ResourceIdsMaxLen1600),
    ServiceNamespace: S.String,
    ResourceId: S.optional(S.String),
    ScalableDimension: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPredictiveScalingForecastRequest extends S.Class<GetPredictiveScalingForecastRequest>(
  "GetPredictiveScalingForecastRequest",
)(
  {
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    PolicyName: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagMap },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class ScalableTargetAction extends S.Class<ScalableTargetAction>(
  "ScalableTargetAction",
)({ MinCapacity: S.optional(S.Number), MaxCapacity: S.optional(S.Number) }) {}
export class SuspendedState extends S.Class<SuspendedState>("SuspendedState")({
  DynamicScalingInSuspended: S.optional(S.Boolean),
  DynamicScalingOutSuspended: S.optional(S.Boolean),
  ScheduledScalingSuspended: S.optional(S.Boolean),
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagMap) }) {}
export class PutScheduledActionRequest extends S.Class<PutScheduledActionRequest>(
  "PutScheduledActionRequest",
)(
  {
    ServiceNamespace: S.String,
    Schedule: S.optional(S.String),
    Timezone: S.optional(S.String),
    ScheduledActionName: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ScalableTargetAction: S.optional(ScalableTargetAction),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutScheduledActionResponse extends S.Class<PutScheduledActionResponse>(
  "PutScheduledActionResponse",
)({}) {}
export class RegisterScalableTargetRequest extends S.Class<RegisterScalableTargetRequest>(
  "RegisterScalableTargetRequest",
)(
  {
    ServiceNamespace: S.String,
    ResourceId: S.String,
    ScalableDimension: S.String,
    MinCapacity: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
    RoleARN: S.optional(S.String),
    SuspendedState: S.optional(SuspendedState),
    Tags: S.optional(TagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const PredictiveScalingForecastTimestamps = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export const PredictiveScalingForecastValues = S.Array(S.Number);
export class StepAdjustment extends S.Class<StepAdjustment>("StepAdjustment")({
  MetricIntervalLowerBound: S.optional(S.Number),
  MetricIntervalUpperBound: S.optional(S.Number),
  ScalingAdjustment: S.Number,
}) {}
export const StepAdjustments = S.Array(StepAdjustment);
export class PredefinedMetricSpecification extends S.Class<PredefinedMetricSpecification>(
  "PredefinedMetricSpecification",
)({ PredefinedMetricType: S.String, ResourceLabel: S.optional(S.String) }) {}
export class ScalableTarget extends S.Class<ScalableTarget>("ScalableTarget")({
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
}) {}
export const ScalableTargets = S.Array(ScalableTarget);
export class ScheduledAction extends S.Class<ScheduledAction>(
  "ScheduledAction",
)({
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
}) {}
export const ScheduledActions = S.Array(ScheduledAction);
export class PredictiveScalingPredefinedMetricPairSpecification extends S.Class<PredictiveScalingPredefinedMetricPairSpecification>(
  "PredictiveScalingPredefinedMetricPairSpecification",
)({ PredefinedMetricType: S.String, ResourceLabel: S.optional(S.String) }) {}
export class PredictiveScalingPredefinedScalingMetricSpecification extends S.Class<PredictiveScalingPredefinedScalingMetricSpecification>(
  "PredictiveScalingPredefinedScalingMetricSpecification",
)({ PredefinedMetricType: S.String, ResourceLabel: S.optional(S.String) }) {}
export class PredictiveScalingPredefinedLoadMetricSpecification extends S.Class<PredictiveScalingPredefinedLoadMetricSpecification>(
  "PredictiveScalingPredefinedLoadMetricSpecification",
)({ PredefinedMetricType: S.String, ResourceLabel: S.optional(S.String) }) {}
export class PredictiveScalingMetricDimension extends S.Class<PredictiveScalingMetricDimension>(
  "PredictiveScalingMetricDimension",
)({ Name: S.String, Value: S.String }) {}
export const PredictiveScalingMetricDimensions = S.Array(
  PredictiveScalingMetricDimension,
);
export class PredictiveScalingMetric extends S.Class<PredictiveScalingMetric>(
  "PredictiveScalingMetric",
)({
  Dimensions: S.optional(PredictiveScalingMetricDimensions),
  MetricName: S.optional(S.String),
  Namespace: S.optional(S.String),
}) {}
export class PredictiveScalingMetricStat extends S.Class<PredictiveScalingMetricStat>(
  "PredictiveScalingMetricStat",
)({
  Metric: PredictiveScalingMetric,
  Stat: S.String,
  Unit: S.optional(S.String),
}) {}
export class PredictiveScalingMetricDataQuery extends S.Class<PredictiveScalingMetricDataQuery>(
  "PredictiveScalingMetricDataQuery",
)({
  Id: S.String,
  Expression: S.optional(S.String),
  MetricStat: S.optional(PredictiveScalingMetricStat),
  Label: S.optional(S.String),
  ReturnData: S.optional(S.Boolean),
}) {}
export const PredictiveScalingMetricDataQueries = S.Array(
  PredictiveScalingMetricDataQuery,
);
export class PredictiveScalingCustomizedMetricSpecification extends S.Class<PredictiveScalingCustomizedMetricSpecification>(
  "PredictiveScalingCustomizedMetricSpecification",
)({ MetricDataQueries: PredictiveScalingMetricDataQueries }) {}
export class PredictiveScalingMetricSpecification extends S.Class<PredictiveScalingMetricSpecification>(
  "PredictiveScalingMetricSpecification",
)({
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
}) {}
export class LoadForecast extends S.Class<LoadForecast>("LoadForecast")({
  Timestamps: PredictiveScalingForecastTimestamps,
  Values: PredictiveScalingForecastValues,
  MetricSpecification: PredictiveScalingMetricSpecification,
}) {}
export const LoadForecasts = S.Array(LoadForecast);
export class CapacityForecast extends S.Class<CapacityForecast>(
  "CapacityForecast",
)({
  Timestamps: PredictiveScalingForecastTimestamps,
  Values: PredictiveScalingForecastValues,
}) {}
export class StepScalingPolicyConfiguration extends S.Class<StepScalingPolicyConfiguration>(
  "StepScalingPolicyConfiguration",
)({
  AdjustmentType: S.optional(S.String),
  StepAdjustments: S.optional(StepAdjustments),
  MinAdjustmentMagnitude: S.optional(S.Number),
  Cooldown: S.optional(S.Number),
  MetricAggregationType: S.optional(S.String),
}) {}
export class MetricDimension extends S.Class<MetricDimension>(
  "MetricDimension",
)({ Name: S.String, Value: S.String }) {}
export const MetricDimensions = S.Array(MetricDimension);
export class DescribeScalableTargetsResponse extends S.Class<DescribeScalableTargetsResponse>(
  "DescribeScalableTargetsResponse",
)({
  ScalableTargets: S.optional(ScalableTargets),
  NextToken: S.optional(S.String),
}) {}
export class DescribeScheduledActionsResponse extends S.Class<DescribeScheduledActionsResponse>(
  "DescribeScheduledActionsResponse",
)({
  ScheduledActions: S.optional(ScheduledActions),
  NextToken: S.optional(S.String),
}) {}
export class GetPredictiveScalingForecastResponse extends S.Class<GetPredictiveScalingForecastResponse>(
  "GetPredictiveScalingForecastResponse",
)({
  LoadForecast: S.optional(LoadForecasts),
  CapacityForecast: S.optional(CapacityForecast),
  UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class RegisterScalableTargetResponse extends S.Class<RegisterScalableTargetResponse>(
  "RegisterScalableTargetResponse",
)({ ScalableTargetARN: S.optional(S.String) }) {}
export class NotScaledReason extends S.Class<NotScaledReason>(
  "NotScaledReason",
)({
  Code: S.String,
  MaxCapacity: S.optional(S.Number),
  MinCapacity: S.optional(S.Number),
  CurrentCapacity: S.optional(S.Number),
}) {}
export const NotScaledReasons = S.Array(NotScaledReason);
export class Alarm extends S.Class<Alarm>("Alarm")({
  AlarmName: S.String,
  AlarmARN: S.String,
}) {}
export const Alarms = S.Array(Alarm);
export class ScalingActivity extends S.Class<ScalingActivity>(
  "ScalingActivity",
)({
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
}) {}
export const ScalingActivities = S.Array(ScalingActivity);
export class TargetTrackingMetricDimension extends S.Class<TargetTrackingMetricDimension>(
  "TargetTrackingMetricDimension",
)({ Name: S.String, Value: S.String }) {}
export const TargetTrackingMetricDimensions = S.Array(
  TargetTrackingMetricDimension,
);
export class TargetTrackingMetric extends S.Class<TargetTrackingMetric>(
  "TargetTrackingMetric",
)({
  Dimensions: S.optional(TargetTrackingMetricDimensions),
  MetricName: S.optional(S.String),
  Namespace: S.optional(S.String),
}) {}
export class TargetTrackingMetricStat extends S.Class<TargetTrackingMetricStat>(
  "TargetTrackingMetricStat",
)({
  Metric: TargetTrackingMetric,
  Stat: S.String,
  Unit: S.optional(S.String),
}) {}
export class TargetTrackingMetricDataQuery extends S.Class<TargetTrackingMetricDataQuery>(
  "TargetTrackingMetricDataQuery",
)({
  Expression: S.optional(S.String),
  Id: S.String,
  Label: S.optional(S.String),
  MetricStat: S.optional(TargetTrackingMetricStat),
  ReturnData: S.optional(S.Boolean),
}) {}
export const TargetTrackingMetricDataQueries = S.Array(
  TargetTrackingMetricDataQuery,
);
export class CustomizedMetricSpecification extends S.Class<CustomizedMetricSpecification>(
  "CustomizedMetricSpecification",
)({
  MetricName: S.optional(S.String),
  Namespace: S.optional(S.String),
  Dimensions: S.optional(MetricDimensions),
  Statistic: S.optional(S.String),
  Unit: S.optional(S.String),
  Metrics: S.optional(TargetTrackingMetricDataQueries),
}) {}
export class TargetTrackingScalingPolicyConfiguration extends S.Class<TargetTrackingScalingPolicyConfiguration>(
  "TargetTrackingScalingPolicyConfiguration",
)({
  TargetValue: S.Number,
  PredefinedMetricSpecification: S.optional(PredefinedMetricSpecification),
  CustomizedMetricSpecification: S.optional(CustomizedMetricSpecification),
  ScaleOutCooldown: S.optional(S.Number),
  ScaleInCooldown: S.optional(S.Number),
  DisableScaleIn: S.optional(S.Boolean),
}) {}
export const PredictiveScalingMetricSpecifications = S.Array(
  PredictiveScalingMetricSpecification,
);
export class PredictiveScalingPolicyConfiguration extends S.Class<PredictiveScalingPolicyConfiguration>(
  "PredictiveScalingPolicyConfiguration",
)({
  MetricSpecifications: PredictiveScalingMetricSpecifications,
  Mode: S.optional(S.String),
  SchedulingBufferTime: S.optional(S.Number),
  MaxCapacityBreachBehavior: S.optional(S.String),
  MaxCapacityBuffer: S.optional(S.Number),
}) {}
export class ScalingPolicy extends S.Class<ScalingPolicy>("ScalingPolicy")({
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
}) {}
export const ScalingPolicies = S.Array(ScalingPolicy);
export class DescribeScalingActivitiesResponse extends S.Class<DescribeScalingActivitiesResponse>(
  "DescribeScalingActivitiesResponse",
)({
  ScalingActivities: S.optional(ScalingActivities),
  NextToken: S.optional(S.String),
}) {}
export class DescribeScalingPoliciesResponse extends S.Class<DescribeScalingPoliciesResponse>(
  "DescribeScalingPoliciesResponse",
)({
  ScalingPolicies: S.optional(ScalingPolicies),
  NextToken: S.optional(S.String),
}) {}
export class PutScalingPolicyRequest extends S.Class<PutScalingPolicyRequest>(
  "PutScalingPolicyRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutScalingPolicyResponse extends S.Class<PutScalingPolicyResponse>(
  "PutScalingPolicyResponse",
)({ PolicyARN: S.String, Alarms: S.optional(Alarms) }) {}

//# Errors
export class ConcurrentUpdateException extends S.TaggedError<ConcurrentUpdateException>()(
  "ConcurrentUpdateException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ConcurrentUpdateException", httpResponseCode: 500 }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InternalServiceException", httpResponseCode: 500 }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ValidationException", httpResponseCode: 400 }),
) {}
export class ObjectNotFoundException extends S.TaggedError<ObjectNotFoundException>()(
  "ObjectNotFoundException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ObjectNotFoundException", httpResponseCode: 400 }),
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidNextTokenException", httpResponseCode: 400 }),
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceededException", httpResponseCode: 400 }),
) {}
export class FailedResourceAccessException extends S.TaggedError<FailedResourceAccessException>()(
  "FailedResourceAccessException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "FailedResourceAccessException",
    httpResponseCode: 400,
  }),
) {}

//# Operations
/**
 * Returns all the tags on the specified Application Auto Scaling scalable target.
 *
 * For general information about tags, including the format and syntax, see Tagging your Amazon Web Services
 * resources in the *Amazon Web Services General Reference*.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Deletes tags from an Application Auto Scaling scalable target. To delete a tag, specify the tag key and
 * the Application Auto Scaling scalable target.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPredictiveScalingForecast =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteScalingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeScalableTargets =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeScalingActivities =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const registerScalableTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterScalableTargetRequest,
    output: RegisterScalableTargetResponse,
    errors: [
      ConcurrentUpdateException,
      InternalServiceException,
      LimitExceededException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes the specified scheduled action for an Application Auto Scaling scalable target.
 *
 * For more information, see Delete a scheduled action in the *Application Auto Scaling User Guide*.
 */
export const deleteScheduledAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteScheduledActionRequest,
    output: DeleteScheduledActionResponse,
    errors: [
      ConcurrentUpdateException,
      InternalServiceException,
      ObjectNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deregisters an Application Auto Scaling scalable target when you have finished using it. To see which
 * resources have been registered, use DescribeScalableTargets.
 *
 * Deregistering a scalable target deletes the scaling policies and the scheduled
 * actions that are associated with it.
 */
export const deregisterScalableTarget = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterScalableTargetRequest,
    output: DeregisterScalableTargetResponse,
    errors: [
      ConcurrentUpdateException,
      InternalServiceException,
      ObjectNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Describes the Application Auto Scaling scheduled actions for the specified service namespace.
 *
 * You can filter the results using the `ResourceId`,
 * `ScalableDimension`, and `ScheduledActionNames` parameters.
 *
 * For more information, see Scheduled scaling in the *Application Auto Scaling User Guide*.
 */
export const describeScheduledActions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putScheduledAction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeScalingPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putScalingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
