import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://autoscaling.amazonaws.com/doc/2011-01-01/");
const svc = T.AwsApiService({
  sdkId: "Auto Scaling",
  serviceShapeName: "AutoScaling_2011_01_01",
});
const auth = T.AwsAuthSigv4({ name: "autoscaling" });
const ver = T.ServiceVersion("2011-01-01");
const proto = T.AwsProtocolsAwsQuery();
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
                        url: "https://autoscaling-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://autoscaling.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://autoscaling-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://autoscaling.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://autoscaling.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeAccountLimitsRequest extends S.Class<DescribeAccountLimitsRequest>(
  "DescribeAccountLimitsRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAdjustmentTypesRequest extends S.Class<DescribeAdjustmentTypesRequest>(
  "DescribeAdjustmentTypesRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAutoScalingNotificationTypesRequest extends S.Class<DescribeAutoScalingNotificationTypesRequest>(
  "DescribeAutoScalingNotificationTypesRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLifecycleHookTypesRequest extends S.Class<DescribeLifecycleHookTypesRequest>(
  "DescribeLifecycleHookTypesRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMetricCollectionTypesRequest extends S.Class<DescribeMetricCollectionTypesRequest>(
  "DescribeMetricCollectionTypesRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeScalingProcessTypesRequest extends S.Class<DescribeScalingProcessTypesRequest>(
  "DescribeScalingProcessTypesRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTerminationPolicyTypesRequest extends S.Class<DescribeTerminationPolicyTypesRequest>(
  "DescribeTerminationPolicyTypesRequest",
)(
  {},
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SuspendProcessesResponse extends S.Class<SuspendProcessesResponse>(
  "SuspendProcessesResponse",
)({}, ns) {}
export const InstanceIds = S.Array(S.String);
export const LoadBalancerNames = S.Array(S.String);
export const TargetGroupARNs = S.Array(S.String);
export const ScheduledActionNames = S.Array(S.String);
export const AvailabilityZones = S.Array(S.String);
export const TerminationPolicies = S.Array(S.String);
export const SecurityGroups = S.Array(S.String);
export const ClassicLinkVPCSecurityGroups = S.Array(S.String);
export const AutoScalingGroupNames = S.Array(S.String);
export const AutoScalingNotificationTypes = S.Array(S.String);
export const InstanceRefreshIds = S.Array(S.String);
export const LaunchConfigurationNames = S.Array(S.String);
export const LifecycleHookNames = S.Array(S.String);
export const PolicyNames = S.Array(S.String);
export const PolicyTypes = S.Array(S.String);
export const ActivityIds = S.Array(S.String);
export const Metrics = S.Array(S.String);
export const AvailabilityZonesLimit1 = S.Array(S.String);
export const AvailabilityZoneIdsLimit1 = S.Array(S.String);
export const SubnetIdsLimit1 = S.Array(S.String);
export const ProcessNames = S.Array(S.String);
export class AttachInstancesQuery extends S.Class<AttachInstancesQuery>(
  "AttachInstancesQuery",
)(
  { InstanceIds: S.optional(InstanceIds), AutoScalingGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachInstancesResponse extends S.Class<AttachInstancesResponse>(
  "AttachInstancesResponse",
)({}, ns) {}
export class AttachLoadBalancersType extends S.Class<AttachLoadBalancersType>(
  "AttachLoadBalancersType",
)(
  { AutoScalingGroupName: S.String, LoadBalancerNames: LoadBalancerNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachLoadBalancersResultType extends S.Class<AttachLoadBalancersResultType>(
  "AttachLoadBalancersResultType",
)({}, ns) {}
export class AttachLoadBalancerTargetGroupsType extends S.Class<AttachLoadBalancerTargetGroupsType>(
  "AttachLoadBalancerTargetGroupsType",
)(
  { AutoScalingGroupName: S.String, TargetGroupARNs: TargetGroupARNs },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachLoadBalancerTargetGroupsResultType extends S.Class<AttachLoadBalancerTargetGroupsResultType>(
  "AttachLoadBalancerTargetGroupsResultType",
)({}, ns) {}
export class BatchDeleteScheduledActionType extends S.Class<BatchDeleteScheduledActionType>(
  "BatchDeleteScheduledActionType",
)(
  {
    AutoScalingGroupName: S.String,
    ScheduledActionNames: ScheduledActionNames,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelInstanceRefreshType extends S.Class<CancelInstanceRefreshType>(
  "CancelInstanceRefreshType",
)(
  {
    AutoScalingGroupName: S.String,
    WaitForTransitioningInstances: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CompleteLifecycleActionType extends S.Class<CompleteLifecycleActionType>(
  "CompleteLifecycleActionType",
)(
  {
    LifecycleHookName: S.String,
    AutoScalingGroupName: S.String,
    LifecycleActionToken: S.optional(S.String),
    LifecycleActionResult: S.String,
    InstanceId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CompleteLifecycleActionAnswer extends S.Class<CompleteLifecycleActionAnswer>(
  "CompleteLifecycleActionAnswer",
)({}, ns) {}
export class Tag extends S.Class<Tag>("Tag")({
  ResourceId: S.optional(S.String),
  ResourceType: S.optional(S.String),
  Key: S.String,
  Value: S.optional(S.String),
  PropagateAtLaunch: S.optional(S.Boolean),
}) {}
export const Tags = S.Array(Tag);
export class CreateOrUpdateTagsType extends S.Class<CreateOrUpdateTagsType>(
  "CreateOrUpdateTagsType",
)(
  { Tags: Tags },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateOrUpdateTagsResponse extends S.Class<CreateOrUpdateTagsResponse>(
  "CreateOrUpdateTagsResponse",
)({}, ns) {}
export class DeleteAutoScalingGroupType extends S.Class<DeleteAutoScalingGroupType>(
  "DeleteAutoScalingGroupType",
)(
  { AutoScalingGroupName: S.String, ForceDelete: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAutoScalingGroupResponse extends S.Class<DeleteAutoScalingGroupResponse>(
  "DeleteAutoScalingGroupResponse",
)({}, ns) {}
export class LaunchConfigurationNameType extends S.Class<LaunchConfigurationNameType>(
  "LaunchConfigurationNameType",
)(
  { LaunchConfigurationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLaunchConfigurationResponse extends S.Class<DeleteLaunchConfigurationResponse>(
  "DeleteLaunchConfigurationResponse",
)({}, ns) {}
export class DeleteLifecycleHookType extends S.Class<DeleteLifecycleHookType>(
  "DeleteLifecycleHookType",
)(
  { LifecycleHookName: S.String, AutoScalingGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLifecycleHookAnswer extends S.Class<DeleteLifecycleHookAnswer>(
  "DeleteLifecycleHookAnswer",
)({}, ns) {}
export class DeleteNotificationConfigurationType extends S.Class<DeleteNotificationConfigurationType>(
  "DeleteNotificationConfigurationType",
)(
  { AutoScalingGroupName: S.String, TopicARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNotificationConfigurationResponse extends S.Class<DeleteNotificationConfigurationResponse>(
  "DeleteNotificationConfigurationResponse",
)({}, ns) {}
export class DeletePolicyType extends S.Class<DeletePolicyType>(
  "DeletePolicyType",
)(
  { AutoScalingGroupName: S.optional(S.String), PolicyName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePolicyResponse extends S.Class<DeletePolicyResponse>(
  "DeletePolicyResponse",
)({}, ns) {}
export class DeleteScheduledActionType extends S.Class<DeleteScheduledActionType>(
  "DeleteScheduledActionType",
)(
  { AutoScalingGroupName: S.String, ScheduledActionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteScheduledActionResponse extends S.Class<DeleteScheduledActionResponse>(
  "DeleteScheduledActionResponse",
)({}, ns) {}
export class DeleteTagsType extends S.Class<DeleteTagsType>("DeleteTagsType")(
  { Tags: Tags },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTagsResponse extends S.Class<DeleteTagsResponse>(
  "DeleteTagsResponse",
)({}, ns) {}
export class DeleteWarmPoolType extends S.Class<DeleteWarmPoolType>(
  "DeleteWarmPoolType",
)(
  { AutoScalingGroupName: S.String, ForceDelete: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWarmPoolAnswer extends S.Class<DeleteWarmPoolAnswer>(
  "DeleteWarmPoolAnswer",
)({}, ns) {}
export class DescribeAccountLimitsAnswer extends S.Class<DescribeAccountLimitsAnswer>(
  "DescribeAccountLimitsAnswer",
)(
  {
    MaxNumberOfAutoScalingGroups: S.optional(S.Number),
    MaxNumberOfLaunchConfigurations: S.optional(S.Number),
    NumberOfAutoScalingGroups: S.optional(S.Number),
    NumberOfLaunchConfigurations: S.optional(S.Number),
  },
  ns,
) {}
export class DescribeAutoScalingInstancesType extends S.Class<DescribeAutoScalingInstancesType>(
  "DescribeAutoScalingInstancesType",
)(
  {
    InstanceIds: S.optional(InstanceIds),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAutoScalingNotificationTypesAnswer extends S.Class<DescribeAutoScalingNotificationTypesAnswer>(
  "DescribeAutoScalingNotificationTypesAnswer",
)(
  { AutoScalingNotificationTypes: S.optional(AutoScalingNotificationTypes) },
  ns,
) {}
export class DescribeInstanceRefreshesType extends S.Class<DescribeInstanceRefreshesType>(
  "DescribeInstanceRefreshesType",
)(
  {
    AutoScalingGroupName: S.String,
    InstanceRefreshIds: S.optional(InstanceRefreshIds),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class LaunchConfigurationNamesType extends S.Class<LaunchConfigurationNamesType>(
  "LaunchConfigurationNamesType",
)(
  {
    LaunchConfigurationNames: S.optional(LaunchConfigurationNames),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLifecycleHooksType extends S.Class<DescribeLifecycleHooksType>(
  "DescribeLifecycleHooksType",
)(
  {
    AutoScalingGroupName: S.String,
    LifecycleHookNames: S.optional(LifecycleHookNames),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLifecycleHookTypesAnswer extends S.Class<DescribeLifecycleHookTypesAnswer>(
  "DescribeLifecycleHookTypesAnswer",
)({ LifecycleHookTypes: S.optional(AutoScalingNotificationTypes) }, ns) {}
export class DescribeLoadBalancersRequest extends S.Class<DescribeLoadBalancersRequest>(
  "DescribeLoadBalancersRequest",
)(
  {
    AutoScalingGroupName: S.String,
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLoadBalancerTargetGroupsRequest extends S.Class<DescribeLoadBalancerTargetGroupsRequest>(
  "DescribeLoadBalancerTargetGroupsRequest",
)(
  {
    AutoScalingGroupName: S.String,
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeNotificationConfigurationsType extends S.Class<DescribeNotificationConfigurationsType>(
  "DescribeNotificationConfigurationsType",
)(
  {
    AutoScalingGroupNames: S.optional(AutoScalingGroupNames),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePoliciesType extends S.Class<DescribePoliciesType>(
  "DescribePoliciesType",
)(
  {
    AutoScalingGroupName: S.optional(S.String),
    PolicyNames: S.optional(PolicyNames),
    PolicyTypes: S.optional(PolicyTypes),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeScalingActivitiesType extends S.Class<DescribeScalingActivitiesType>(
  "DescribeScalingActivitiesType",
)(
  {
    ActivityIds: S.optional(ActivityIds),
    AutoScalingGroupName: S.optional(S.String),
    IncludeDeletedGroups: S.optional(S.Boolean),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeScheduledActionsType extends S.Class<DescribeScheduledActionsType>(
  "DescribeScheduledActionsType",
)(
  {
    AutoScalingGroupName: S.optional(S.String),
    ScheduledActionNames: S.optional(ScheduledActionNames),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const Values = S.Array(S.String);
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.optional(S.String),
  Values: S.optional(Values),
}) {}
export const Filters = S.Array(Filter);
export class DescribeTagsType extends S.Class<DescribeTagsType>(
  "DescribeTagsType",
)(
  {
    Filters: S.optional(Filters),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTerminationPolicyTypesAnswer extends S.Class<DescribeTerminationPolicyTypesAnswer>(
  "DescribeTerminationPolicyTypesAnswer",
)({ TerminationPolicyTypes: S.optional(TerminationPolicies) }, ns) {}
export class DescribeTrafficSourcesRequest extends S.Class<DescribeTrafficSourcesRequest>(
  "DescribeTrafficSourcesRequest",
)(
  {
    AutoScalingGroupName: S.String,
    TrafficSourceType: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeWarmPoolType extends S.Class<DescribeWarmPoolType>(
  "DescribeWarmPoolType",
)(
  {
    AutoScalingGroupName: S.String,
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachInstancesQuery extends S.Class<DetachInstancesQuery>(
  "DetachInstancesQuery",
)(
  {
    InstanceIds: S.optional(InstanceIds),
    AutoScalingGroupName: S.String,
    ShouldDecrementDesiredCapacity: S.Boolean,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachLoadBalancersType extends S.Class<DetachLoadBalancersType>(
  "DetachLoadBalancersType",
)(
  { AutoScalingGroupName: S.String, LoadBalancerNames: LoadBalancerNames },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachLoadBalancersResultType extends S.Class<DetachLoadBalancersResultType>(
  "DetachLoadBalancersResultType",
)({}, ns) {}
export class DetachLoadBalancerTargetGroupsType extends S.Class<DetachLoadBalancerTargetGroupsType>(
  "DetachLoadBalancerTargetGroupsType",
)(
  { AutoScalingGroupName: S.String, TargetGroupARNs: TargetGroupARNs },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachLoadBalancerTargetGroupsResultType extends S.Class<DetachLoadBalancerTargetGroupsResultType>(
  "DetachLoadBalancerTargetGroupsResultType",
)({}, ns) {}
export class TrafficSourceIdentifier extends S.Class<TrafficSourceIdentifier>(
  "TrafficSourceIdentifier",
)({ Identifier: S.String, Type: S.optional(S.String) }) {}
export const TrafficSources = S.Array(TrafficSourceIdentifier);
export class DetachTrafficSourcesType extends S.Class<DetachTrafficSourcesType>(
  "DetachTrafficSourcesType",
)(
  { AutoScalingGroupName: S.String, TrafficSources: TrafficSources },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachTrafficSourcesResultType extends S.Class<DetachTrafficSourcesResultType>(
  "DetachTrafficSourcesResultType",
)({}, ns) {}
export class DisableMetricsCollectionQuery extends S.Class<DisableMetricsCollectionQuery>(
  "DisableMetricsCollectionQuery",
)(
  { AutoScalingGroupName: S.String, Metrics: S.optional(Metrics) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableMetricsCollectionResponse extends S.Class<DisableMetricsCollectionResponse>(
  "DisableMetricsCollectionResponse",
)({}, ns) {}
export class EnableMetricsCollectionQuery extends S.Class<EnableMetricsCollectionQuery>(
  "EnableMetricsCollectionQuery",
)(
  {
    AutoScalingGroupName: S.String,
    Metrics: S.optional(Metrics),
    Granularity: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EnableMetricsCollectionResponse extends S.Class<EnableMetricsCollectionResponse>(
  "EnableMetricsCollectionResponse",
)({}, ns) {}
export class EnterStandbyQuery extends S.Class<EnterStandbyQuery>(
  "EnterStandbyQuery",
)(
  {
    InstanceIds: S.optional(InstanceIds),
    AutoScalingGroupName: S.String,
    ShouldDecrementDesiredCapacity: S.Boolean,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExecutePolicyType extends S.Class<ExecutePolicyType>(
  "ExecutePolicyType",
)(
  {
    AutoScalingGroupName: S.optional(S.String),
    PolicyName: S.String,
    HonorCooldown: S.optional(S.Boolean),
    MetricValue: S.optional(S.Number),
    BreachThreshold: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExecutePolicyResponse extends S.Class<ExecutePolicyResponse>(
  "ExecutePolicyResponse",
)({}, ns) {}
export class ExitStandbyQuery extends S.Class<ExitStandbyQuery>(
  "ExitStandbyQuery",
)(
  { InstanceIds: S.optional(InstanceIds), AutoScalingGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPredictiveScalingForecastType extends S.Class<GetPredictiveScalingForecastType>(
  "GetPredictiveScalingForecastType",
)(
  {
    AutoScalingGroupName: S.String,
    PolicyName: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("date-time")),
    EndTime: S.Date.pipe(T.TimestampFormat("date-time")),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class LaunchInstancesRequest extends S.Class<LaunchInstancesRequest>(
  "LaunchInstancesRequest",
)(
  {
    AutoScalingGroupName: S.String,
    RequestedCapacity: S.Number,
    ClientToken: S.String,
    AvailabilityZones: S.optional(AvailabilityZonesLimit1),
    AvailabilityZoneIds: S.optional(AvailabilityZoneIdsLimit1),
    SubnetIds: S.optional(SubnetIdsLimit1),
    RetryStrategy: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutLifecycleHookType extends S.Class<PutLifecycleHookType>(
  "PutLifecycleHookType",
)(
  {
    LifecycleHookName: S.String,
    AutoScalingGroupName: S.String,
    LifecycleTransition: S.optional(S.String),
    RoleARN: S.optional(S.String),
    NotificationTargetARN: S.optional(S.String),
    NotificationMetadata: S.optional(S.String),
    HeartbeatTimeout: S.optional(S.Number),
    DefaultResult: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutLifecycleHookAnswer extends S.Class<PutLifecycleHookAnswer>(
  "PutLifecycleHookAnswer",
)({}, ns) {}
export class PutNotificationConfigurationType extends S.Class<PutNotificationConfigurationType>(
  "PutNotificationConfigurationType",
)(
  {
    AutoScalingGroupName: S.String,
    TopicARN: S.String,
    NotificationTypes: AutoScalingNotificationTypes,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutNotificationConfigurationResponse extends S.Class<PutNotificationConfigurationResponse>(
  "PutNotificationConfigurationResponse",
)({}, ns) {}
export class PutScheduledUpdateGroupActionType extends S.Class<PutScheduledUpdateGroupActionType>(
  "PutScheduledUpdateGroupActionType",
)(
  {
    AutoScalingGroupName: S.String,
    ScheduledActionName: S.String,
    Time: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Recurrence: S.optional(S.String),
    MinSize: S.optional(S.Number),
    MaxSize: S.optional(S.Number),
    DesiredCapacity: S.optional(S.Number),
    TimeZone: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutScheduledUpdateGroupActionResponse extends S.Class<PutScheduledUpdateGroupActionResponse>(
  "PutScheduledUpdateGroupActionResponse",
)({}, ns) {}
export class RecordLifecycleActionHeartbeatType extends S.Class<RecordLifecycleActionHeartbeatType>(
  "RecordLifecycleActionHeartbeatType",
)(
  {
    LifecycleHookName: S.String,
    AutoScalingGroupName: S.String,
    LifecycleActionToken: S.optional(S.String),
    InstanceId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RecordLifecycleActionHeartbeatAnswer extends S.Class<RecordLifecycleActionHeartbeatAnswer>(
  "RecordLifecycleActionHeartbeatAnswer",
)({}, ns) {}
export class ScalingProcessQuery extends S.Class<ScalingProcessQuery>(
  "ScalingProcessQuery",
)(
  {
    AutoScalingGroupName: S.String,
    ScalingProcesses: S.optional(ProcessNames),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResumeProcessesResponse extends S.Class<ResumeProcessesResponse>(
  "ResumeProcessesResponse",
)({}, ns) {}
export class RollbackInstanceRefreshType extends S.Class<RollbackInstanceRefreshType>(
  "RollbackInstanceRefreshType",
)(
  { AutoScalingGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetDesiredCapacityType extends S.Class<SetDesiredCapacityType>(
  "SetDesiredCapacityType",
)(
  {
    AutoScalingGroupName: S.String,
    DesiredCapacity: S.Number,
    HonorCooldown: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetDesiredCapacityResponse extends S.Class<SetDesiredCapacityResponse>(
  "SetDesiredCapacityResponse",
)({}, ns) {}
export class SetInstanceHealthQuery extends S.Class<SetInstanceHealthQuery>(
  "SetInstanceHealthQuery",
)(
  {
    InstanceId: S.String,
    HealthStatus: S.String,
    ShouldRespectGracePeriod: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetInstanceHealthResponse extends S.Class<SetInstanceHealthResponse>(
  "SetInstanceHealthResponse",
)({}, ns) {}
export class SetInstanceProtectionQuery extends S.Class<SetInstanceProtectionQuery>(
  "SetInstanceProtectionQuery",
)(
  {
    InstanceIds: InstanceIds,
    AutoScalingGroupName: S.String,
    ProtectedFromScaleIn: S.Boolean,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetInstanceProtectionAnswer extends S.Class<SetInstanceProtectionAnswer>(
  "SetInstanceProtectionAnswer",
)({}, ns) {}
export class TerminateInstanceInAutoScalingGroupType extends S.Class<TerminateInstanceInAutoScalingGroupType>(
  "TerminateInstanceInAutoScalingGroupType",
)(
  { InstanceId: S.String, ShouldDecrementDesiredCapacity: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class LaunchTemplateSpecification extends S.Class<LaunchTemplateSpecification>(
  "LaunchTemplateSpecification",
)({
  LaunchTemplateId: S.optional(S.String),
  LaunchTemplateName: S.optional(S.String),
  Version: S.optional(S.String),
}) {}
export class VCpuCountRequest extends S.Class<VCpuCountRequest>(
  "VCpuCountRequest",
)({ Min: S.Number, Max: S.optional(S.Number) }) {}
export class MemoryMiBRequest extends S.Class<MemoryMiBRequest>(
  "MemoryMiBRequest",
)({ Min: S.Number, Max: S.optional(S.Number) }) {}
export const CpuManufacturers = S.Array(S.String);
export class MemoryGiBPerVCpuRequest extends S.Class<MemoryGiBPerVCpuRequest>(
  "MemoryGiBPerVCpuRequest",
)({ Min: S.optional(S.Number), Max: S.optional(S.Number) }) {}
export const ExcludedInstanceTypes = S.Array(S.String);
export const InstanceGenerations = S.Array(S.String);
export class NetworkInterfaceCountRequest extends S.Class<NetworkInterfaceCountRequest>(
  "NetworkInterfaceCountRequest",
)({ Min: S.optional(S.Number), Max: S.optional(S.Number) }) {}
export const LocalStorageTypes = S.Array(S.String);
export class TotalLocalStorageGBRequest extends S.Class<TotalLocalStorageGBRequest>(
  "TotalLocalStorageGBRequest",
)({ Min: S.optional(S.Number), Max: S.optional(S.Number) }) {}
export class BaselineEbsBandwidthMbpsRequest extends S.Class<BaselineEbsBandwidthMbpsRequest>(
  "BaselineEbsBandwidthMbpsRequest",
)({ Min: S.optional(S.Number), Max: S.optional(S.Number) }) {}
export const AcceleratorTypes = S.Array(S.String);
export class AcceleratorCountRequest extends S.Class<AcceleratorCountRequest>(
  "AcceleratorCountRequest",
)({ Min: S.optional(S.Number), Max: S.optional(S.Number) }) {}
export const AcceleratorManufacturers = S.Array(S.String);
export const AcceleratorNames = S.Array(S.String);
export class AcceleratorTotalMemoryMiBRequest extends S.Class<AcceleratorTotalMemoryMiBRequest>(
  "AcceleratorTotalMemoryMiBRequest",
)({ Min: S.optional(S.Number), Max: S.optional(S.Number) }) {}
export class NetworkBandwidthGbpsRequest extends S.Class<NetworkBandwidthGbpsRequest>(
  "NetworkBandwidthGbpsRequest",
)({ Min: S.optional(S.Number), Max: S.optional(S.Number) }) {}
export const AllowedInstanceTypes = S.Array(S.String);
export class PerformanceFactorReferenceRequest extends S.Class<PerformanceFactorReferenceRequest>(
  "PerformanceFactorReferenceRequest",
)({ InstanceFamily: S.optional(S.String) }) {}
export const PerformanceFactorReferenceSetRequest = S.Array(
  PerformanceFactorReferenceRequest.pipe(T.XmlName("item")),
);
export class CpuPerformanceFactorRequest extends S.Class<CpuPerformanceFactorRequest>(
  "CpuPerformanceFactorRequest",
)({
  References: S.optional(PerformanceFactorReferenceSetRequest).pipe(
    T.XmlName("Reference"),
  ),
}) {}
export class BaselinePerformanceFactorsRequest extends S.Class<BaselinePerformanceFactorsRequest>(
  "BaselinePerformanceFactorsRequest",
)({ Cpu: S.optional(CpuPerformanceFactorRequest) }) {}
export class InstanceRequirements extends S.Class<InstanceRequirements>(
  "InstanceRequirements",
)({
  VCpuCount: VCpuCountRequest,
  MemoryMiB: MemoryMiBRequest,
  CpuManufacturers: S.optional(CpuManufacturers),
  MemoryGiBPerVCpu: S.optional(MemoryGiBPerVCpuRequest),
  ExcludedInstanceTypes: S.optional(ExcludedInstanceTypes),
  InstanceGenerations: S.optional(InstanceGenerations),
  SpotMaxPricePercentageOverLowestPrice: S.optional(S.Number),
  MaxSpotPriceAsPercentageOfOptimalOnDemandPrice: S.optional(S.Number),
  OnDemandMaxPricePercentageOverLowestPrice: S.optional(S.Number),
  BareMetal: S.optional(S.String),
  BurstablePerformance: S.optional(S.String),
  RequireHibernateSupport: S.optional(S.Boolean),
  NetworkInterfaceCount: S.optional(NetworkInterfaceCountRequest),
  LocalStorage: S.optional(S.String),
  LocalStorageTypes: S.optional(LocalStorageTypes),
  TotalLocalStorageGB: S.optional(TotalLocalStorageGBRequest),
  BaselineEbsBandwidthMbps: S.optional(BaselineEbsBandwidthMbpsRequest),
  AcceleratorTypes: S.optional(AcceleratorTypes),
  AcceleratorCount: S.optional(AcceleratorCountRequest),
  AcceleratorManufacturers: S.optional(AcceleratorManufacturers),
  AcceleratorNames: S.optional(AcceleratorNames),
  AcceleratorTotalMemoryMiB: S.optional(AcceleratorTotalMemoryMiBRequest),
  NetworkBandwidthGbps: S.optional(NetworkBandwidthGbpsRequest),
  AllowedInstanceTypes: S.optional(AllowedInstanceTypes),
  BaselinePerformanceFactors: S.optional(BaselinePerformanceFactorsRequest),
}) {}
export class LaunchTemplateOverrides extends S.Class<LaunchTemplateOverrides>(
  "LaunchTemplateOverrides",
)({
  InstanceType: S.optional(S.String),
  WeightedCapacity: S.optional(S.String),
  LaunchTemplateSpecification: S.optional(LaunchTemplateSpecification),
  InstanceRequirements: S.optional(InstanceRequirements),
  ImageId: S.optional(S.String),
}) {}
export const Overrides = S.Array(LaunchTemplateOverrides);
export class LaunchTemplate extends S.Class<LaunchTemplate>("LaunchTemplate")({
  LaunchTemplateSpecification: S.optional(LaunchTemplateSpecification),
  Overrides: S.optional(Overrides),
}) {}
export class InstancesDistribution extends S.Class<InstancesDistribution>(
  "InstancesDistribution",
)({
  OnDemandAllocationStrategy: S.optional(S.String),
  OnDemandBaseCapacity: S.optional(S.Number),
  OnDemandPercentageAboveBaseCapacity: S.optional(S.Number),
  SpotAllocationStrategy: S.optional(S.String),
  SpotInstancePools: S.optional(S.Number),
  SpotMaxPrice: S.optional(S.String),
}) {}
export class MixedInstancesPolicy extends S.Class<MixedInstancesPolicy>(
  "MixedInstancesPolicy",
)({
  LaunchTemplate: S.optional(LaunchTemplate),
  InstancesDistribution: S.optional(InstancesDistribution),
}) {}
export class InstanceMaintenancePolicy extends S.Class<InstanceMaintenancePolicy>(
  "InstanceMaintenancePolicy",
)({
  MinHealthyPercentage: S.optional(S.Number),
  MaxHealthyPercentage: S.optional(S.Number),
}) {}
export class AvailabilityZoneDistribution extends S.Class<AvailabilityZoneDistribution>(
  "AvailabilityZoneDistribution",
)({ CapacityDistributionStrategy: S.optional(S.String) }) {}
export class AvailabilityZoneImpairmentPolicy extends S.Class<AvailabilityZoneImpairmentPolicy>(
  "AvailabilityZoneImpairmentPolicy",
)({
  ZonalShiftEnabled: S.optional(S.Boolean),
  ImpairedZoneHealthCheckBehavior: S.optional(S.String),
}) {}
export const CapacityReservationIds = S.Array(S.String);
export const CapacityReservationResourceGroupArns = S.Array(S.String);
export class CapacityReservationTarget extends S.Class<CapacityReservationTarget>(
  "CapacityReservationTarget",
)({
  CapacityReservationIds: S.optional(CapacityReservationIds),
  CapacityReservationResourceGroupArns: S.optional(
    CapacityReservationResourceGroupArns,
  ),
}) {}
export class CapacityReservationSpecification extends S.Class<CapacityReservationSpecification>(
  "CapacityReservationSpecification",
)({
  CapacityReservationPreference: S.optional(S.String),
  CapacityReservationTarget: S.optional(CapacityReservationTarget),
}) {}
export class RetentionTriggers extends S.Class<RetentionTriggers>(
  "RetentionTriggers",
)({ TerminateHookAbandon: S.optional(S.String) }) {}
export class InstanceLifecyclePolicy extends S.Class<InstanceLifecyclePolicy>(
  "InstanceLifecyclePolicy",
)({ RetentionTriggers: S.optional(RetentionTriggers) }) {}
export class UpdateAutoScalingGroupType extends S.Class<UpdateAutoScalingGroupType>(
  "UpdateAutoScalingGroupType",
)(
  {
    AutoScalingGroupName: S.String,
    LaunchConfigurationName: S.optional(S.String),
    LaunchTemplate: S.optional(LaunchTemplateSpecification),
    MixedInstancesPolicy: S.optional(MixedInstancesPolicy),
    MinSize: S.optional(S.Number),
    MaxSize: S.optional(S.Number),
    DesiredCapacity: S.optional(S.Number),
    DefaultCooldown: S.optional(S.Number),
    AvailabilityZones: S.optional(AvailabilityZones),
    HealthCheckType: S.optional(S.String),
    HealthCheckGracePeriod: S.optional(S.Number),
    PlacementGroup: S.optional(S.String),
    VPCZoneIdentifier: S.optional(S.String),
    TerminationPolicies: S.optional(TerminationPolicies),
    NewInstancesProtectedFromScaleIn: S.optional(S.Boolean),
    ServiceLinkedRoleARN: S.optional(S.String),
    MaxInstanceLifetime: S.optional(S.Number),
    CapacityRebalance: S.optional(S.Boolean),
    Context: S.optional(S.String),
    DesiredCapacityType: S.optional(S.String),
    DefaultInstanceWarmup: S.optional(S.Number),
    InstanceMaintenancePolicy: S.optional(InstanceMaintenancePolicy),
    AvailabilityZoneDistribution: S.optional(AvailabilityZoneDistribution),
    AvailabilityZoneImpairmentPolicy: S.optional(
      AvailabilityZoneImpairmentPolicy,
    ),
    SkipZonalShiftValidation: S.optional(S.Boolean),
    CapacityReservationSpecification: S.optional(
      CapacityReservationSpecification,
    ),
    InstanceLifecyclePolicy: S.optional(InstanceLifecyclePolicy),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAutoScalingGroupResponse extends S.Class<UpdateAutoScalingGroupResponse>(
  "UpdateAutoScalingGroupResponse",
)({}, ns) {}
export const CheckpointPercentages = S.Array(S.Number);
export class ScheduledUpdateGroupActionRequest extends S.Class<ScheduledUpdateGroupActionRequest>(
  "ScheduledUpdateGroupActionRequest",
)({
  ScheduledActionName: S.String,
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Recurrence: S.optional(S.String),
  MinSize: S.optional(S.Number),
  MaxSize: S.optional(S.Number),
  DesiredCapacity: S.optional(S.Number),
  TimeZone: S.optional(S.String),
}) {}
export const ScheduledUpdateGroupActionRequests = S.Array(
  ScheduledUpdateGroupActionRequest,
);
export class LifecycleHookSpecification extends S.Class<LifecycleHookSpecification>(
  "LifecycleHookSpecification",
)({
  LifecycleHookName: S.String,
  LifecycleTransition: S.String,
  NotificationMetadata: S.optional(S.String),
  HeartbeatTimeout: S.optional(S.Number),
  DefaultResult: S.optional(S.String),
  NotificationTargetARN: S.optional(S.String),
  RoleARN: S.optional(S.String),
}) {}
export const LifecycleHookSpecifications = S.Array(LifecycleHookSpecification);
export class InstanceMonitoring extends S.Class<InstanceMonitoring>(
  "InstanceMonitoring",
)({ Enabled: S.optional(S.Boolean) }) {}
export class InstanceMetadataOptions extends S.Class<InstanceMetadataOptions>(
  "InstanceMetadataOptions",
)({
  HttpTokens: S.optional(S.String),
  HttpPutResponseHopLimit: S.optional(S.Number),
  HttpEndpoint: S.optional(S.String),
}) {}
export class AdjustmentType extends S.Class<AdjustmentType>("AdjustmentType")({
  AdjustmentType: S.optional(S.String),
}) {}
export const AdjustmentTypes = S.Array(AdjustmentType);
export class MetricCollectionType extends S.Class<MetricCollectionType>(
  "MetricCollectionType",
)({ Metric: S.optional(S.String) }) {}
export const MetricCollectionTypes = S.Array(MetricCollectionType);
export class MetricGranularityType extends S.Class<MetricGranularityType>(
  "MetricGranularityType",
)({ Granularity: S.optional(S.String) }) {}
export const MetricGranularityTypes = S.Array(MetricGranularityType);
export class ProcessType extends S.Class<ProcessType>("ProcessType")({
  ProcessName: S.String,
}) {}
export const Processes = S.Array(ProcessType);
export class StepAdjustment extends S.Class<StepAdjustment>("StepAdjustment")({
  MetricIntervalLowerBound: S.optional(S.Number),
  MetricIntervalUpperBound: S.optional(S.Number),
  ScalingAdjustment: S.Number,
}) {}
export const StepAdjustments = S.Array(StepAdjustment);
export class InstanceReusePolicy extends S.Class<InstanceReusePolicy>(
  "InstanceReusePolicy",
)({ ReuseOnScaleIn: S.optional(S.Boolean) }) {}
export class DesiredConfiguration extends S.Class<DesiredConfiguration>(
  "DesiredConfiguration",
)({
  LaunchTemplate: S.optional(LaunchTemplateSpecification),
  MixedInstancesPolicy: S.optional(MixedInstancesPolicy),
}) {}
export const AlarmList = S.Array(S.String);
export class AttachTrafficSourcesType extends S.Class<AttachTrafficSourcesType>(
  "AttachTrafficSourcesType",
)(
  {
    AutoScalingGroupName: S.String,
    TrafficSources: TrafficSources,
    SkipZonalShiftValidation: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachTrafficSourcesResultType extends S.Class<AttachTrafficSourcesResultType>(
  "AttachTrafficSourcesResultType",
)({}, ns) {}
export class BatchPutScheduledUpdateGroupActionType extends S.Class<BatchPutScheduledUpdateGroupActionType>(
  "BatchPutScheduledUpdateGroupActionType",
)(
  {
    AutoScalingGroupName: S.String,
    ScheduledUpdateGroupActions: ScheduledUpdateGroupActionRequests,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelInstanceRefreshAnswer extends S.Class<CancelInstanceRefreshAnswer>(
  "CancelInstanceRefreshAnswer",
)({ InstanceRefreshId: S.optional(S.String) }, ns) {}
export class DescribeAdjustmentTypesAnswer extends S.Class<DescribeAdjustmentTypesAnswer>(
  "DescribeAdjustmentTypesAnswer",
)({ AdjustmentTypes: S.optional(AdjustmentTypes) }, ns) {}
export class AutoScalingGroupNamesType extends S.Class<AutoScalingGroupNamesType>(
  "AutoScalingGroupNamesType",
)(
  {
    AutoScalingGroupNames: S.optional(AutoScalingGroupNames),
    IncludeInstances: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMetricCollectionTypesAnswer extends S.Class<DescribeMetricCollectionTypesAnswer>(
  "DescribeMetricCollectionTypesAnswer",
)(
  {
    Metrics: S.optional(MetricCollectionTypes),
    Granularities: S.optional(MetricGranularityTypes),
  },
  ns,
) {}
export class ProcessesType extends S.Class<ProcessesType>("ProcessesType")(
  { Processes: S.optional(Processes) },
  ns,
) {}
export class Activity extends S.Class<Activity>("Activity")({
  ActivityId: S.String,
  AutoScalingGroupName: S.String,
  Description: S.optional(S.String),
  Cause: S.String,
  StartTime: S.Date.pipe(T.TimestampFormat("date-time")),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StatusCode: S.String,
  StatusMessage: S.optional(S.String),
  Progress: S.optional(S.Number),
  Details: S.optional(S.String),
  AutoScalingGroupState: S.optional(S.String),
  AutoScalingGroupARN: S.optional(S.String),
}) {}
export const Activities = S.Array(Activity);
export class DetachInstancesAnswer extends S.Class<DetachInstancesAnswer>(
  "DetachInstancesAnswer",
)({ Activities: S.optional(Activities) }, ns) {}
export class EnterStandbyAnswer extends S.Class<EnterStandbyAnswer>(
  "EnterStandbyAnswer",
)({ Activities: S.optional(Activities) }, ns) {}
export class ExitStandbyAnswer extends S.Class<ExitStandbyAnswer>(
  "ExitStandbyAnswer",
)({ Activities: S.optional(Activities) }, ns) {}
export class PutWarmPoolType extends S.Class<PutWarmPoolType>(
  "PutWarmPoolType",
)(
  {
    AutoScalingGroupName: S.String,
    MaxGroupPreparedCapacity: S.optional(S.Number),
    MinSize: S.optional(S.Number),
    PoolState: S.optional(S.String),
    InstanceReusePolicy: S.optional(InstanceReusePolicy),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutWarmPoolAnswer extends S.Class<PutWarmPoolAnswer>(
  "PutWarmPoolAnswer",
)({}, ns) {}
export class RollbackInstanceRefreshAnswer extends S.Class<RollbackInstanceRefreshAnswer>(
  "RollbackInstanceRefreshAnswer",
)({ InstanceRefreshId: S.optional(S.String) }, ns) {}
export class ActivityType extends S.Class<ActivityType>("ActivityType")(
  { Activity: S.optional(Activity) },
  ns,
) {}
export class Ebs extends S.Class<Ebs>("Ebs")({
  SnapshotId: S.optional(S.String),
  VolumeSize: S.optional(S.Number),
  VolumeType: S.optional(S.String),
  DeleteOnTermination: S.optional(S.Boolean),
  Iops: S.optional(S.Number),
  Encrypted: S.optional(S.Boolean),
  Throughput: S.optional(S.Number),
}) {}
export const PredictiveScalingForecastTimestamps = S.Array(
  S.Date.pipe(T.TimestampFormat("date-time")),
);
export const PredictiveScalingForecastValues = S.Array(S.Number);
export class PredefinedMetricSpecification extends S.Class<PredefinedMetricSpecification>(
  "PredefinedMetricSpecification",
)({ PredefinedMetricType: S.String, ResourceLabel: S.optional(S.String) }) {}
export class AlarmSpecification extends S.Class<AlarmSpecification>(
  "AlarmSpecification",
)({ Alarms: S.optional(AlarmList) }) {}
export class FailedScheduledUpdateGroupActionRequest extends S.Class<FailedScheduledUpdateGroupActionRequest>(
  "FailedScheduledUpdateGroupActionRequest",
)({
  ScheduledActionName: S.String,
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const FailedScheduledUpdateGroupActionRequests = S.Array(
  FailedScheduledUpdateGroupActionRequest,
);
export class BlockDeviceMapping extends S.Class<BlockDeviceMapping>(
  "BlockDeviceMapping",
)({
  VirtualName: S.optional(S.String),
  DeviceName: S.String,
  Ebs: S.optional(Ebs),
  NoDevice: S.optional(S.Boolean),
}) {}
export const BlockDeviceMappings = S.Array(BlockDeviceMapping);
export class AutoScalingInstanceDetails extends S.Class<AutoScalingInstanceDetails>(
  "AutoScalingInstanceDetails",
)({
  InstanceId: S.String,
  InstanceType: S.optional(S.String),
  AutoScalingGroupName: S.String,
  AvailabilityZone: S.String,
  LifecycleState: S.String,
  HealthStatus: S.String,
  LaunchConfigurationName: S.optional(S.String),
  LaunchTemplate: S.optional(LaunchTemplateSpecification),
  ImageId: S.optional(S.String),
  ProtectedFromScaleIn: S.Boolean,
  WeightedCapacity: S.optional(S.String),
}) {}
export const AutoScalingInstances = S.Array(AutoScalingInstanceDetails);
export class LaunchConfiguration extends S.Class<LaunchConfiguration>(
  "LaunchConfiguration",
)({
  LaunchConfigurationName: S.String,
  LaunchConfigurationARN: S.optional(S.String),
  ImageId: S.String,
  KeyName: S.optional(S.String),
  SecurityGroups: S.optional(SecurityGroups),
  ClassicLinkVPCId: S.optional(S.String),
  ClassicLinkVPCSecurityGroups: S.optional(ClassicLinkVPCSecurityGroups),
  UserData: S.optional(S.String),
  InstanceType: S.String,
  KernelId: S.optional(S.String),
  RamdiskId: S.optional(S.String),
  BlockDeviceMappings: S.optional(BlockDeviceMappings),
  InstanceMonitoring: S.optional(InstanceMonitoring),
  SpotPrice: S.optional(S.String),
  IamInstanceProfile: S.optional(S.String),
  CreatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  EbsOptimized: S.optional(S.Boolean),
  AssociatePublicIpAddress: S.optional(S.Boolean),
  PlacementTenancy: S.optional(S.String),
  MetadataOptions: S.optional(InstanceMetadataOptions),
}) {}
export const LaunchConfigurations = S.Array(LaunchConfiguration);
export class LifecycleHook extends S.Class<LifecycleHook>("LifecycleHook")({
  LifecycleHookName: S.optional(S.String),
  AutoScalingGroupName: S.optional(S.String),
  LifecycleTransition: S.optional(S.String),
  NotificationTargetARN: S.optional(S.String),
  RoleARN: S.optional(S.String),
  NotificationMetadata: S.optional(S.String),
  HeartbeatTimeout: S.optional(S.Number),
  GlobalTimeout: S.optional(S.Number),
  DefaultResult: S.optional(S.String),
}) {}
export const LifecycleHooks = S.Array(LifecycleHook);
export class LoadBalancerState extends S.Class<LoadBalancerState>(
  "LoadBalancerState",
)({ LoadBalancerName: S.optional(S.String), State: S.optional(S.String) }) {}
export const LoadBalancerStates = S.Array(LoadBalancerState);
export class LoadBalancerTargetGroupState extends S.Class<LoadBalancerTargetGroupState>(
  "LoadBalancerTargetGroupState",
)({
  LoadBalancerTargetGroupARN: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export const LoadBalancerTargetGroupStates = S.Array(
  LoadBalancerTargetGroupState,
);
export class NotificationConfiguration extends S.Class<NotificationConfiguration>(
  "NotificationConfiguration",
)({
  AutoScalingGroupName: S.optional(S.String),
  TopicARN: S.optional(S.String),
  NotificationType: S.optional(S.String),
}) {}
export const NotificationConfigurations = S.Array(NotificationConfiguration);
export class ScheduledUpdateGroupAction extends S.Class<ScheduledUpdateGroupAction>(
  "ScheduledUpdateGroupAction",
)({
  AutoScalingGroupName: S.optional(S.String),
  ScheduledActionName: S.optional(S.String),
  ScheduledActionARN: S.optional(S.String),
  Time: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Recurrence: S.optional(S.String),
  MinSize: S.optional(S.Number),
  MaxSize: S.optional(S.Number),
  DesiredCapacity: S.optional(S.Number),
  TimeZone: S.optional(S.String),
}) {}
export const ScheduledUpdateGroupActions = S.Array(ScheduledUpdateGroupAction);
export class TagDescription extends S.Class<TagDescription>("TagDescription")({
  ResourceId: S.optional(S.String),
  ResourceType: S.optional(S.String),
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  PropagateAtLaunch: S.optional(S.Boolean),
}) {}
export const TagDescriptionList = S.Array(TagDescription);
export class TrafficSourceState extends S.Class<TrafficSourceState>(
  "TrafficSourceState",
)({
  TrafficSource: S.optional(S.String),
  State: S.optional(S.String),
  Identifier: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export const TrafficSourceStates = S.Array(TrafficSourceState);
export class WarmPoolConfiguration extends S.Class<WarmPoolConfiguration>(
  "WarmPoolConfiguration",
)({
  MaxGroupPreparedCapacity: S.optional(S.Number),
  MinSize: S.optional(S.Number),
  PoolState: S.optional(S.String),
  Status: S.optional(S.String),
  InstanceReusePolicy: S.optional(InstanceReusePolicy),
}) {}
export class Instance extends S.Class<Instance>("Instance")({
  InstanceId: S.String,
  InstanceType: S.optional(S.String),
  AvailabilityZone: S.String,
  LifecycleState: S.String,
  HealthStatus: S.String,
  LaunchConfigurationName: S.optional(S.String),
  LaunchTemplate: S.optional(LaunchTemplateSpecification),
  ImageId: S.optional(S.String),
  ProtectedFromScaleIn: S.Boolean,
  WeightedCapacity: S.optional(S.String),
}) {}
export const Instances = S.Array(Instance);
export class PredictiveScalingPredefinedMetricPair extends S.Class<PredictiveScalingPredefinedMetricPair>(
  "PredictiveScalingPredefinedMetricPair",
)({ PredefinedMetricType: S.String, ResourceLabel: S.optional(S.String) }) {}
export class PredictiveScalingPredefinedScalingMetric extends S.Class<PredictiveScalingPredefinedScalingMetric>(
  "PredictiveScalingPredefinedScalingMetric",
)({ PredefinedMetricType: S.String, ResourceLabel: S.optional(S.String) }) {}
export class PredictiveScalingPredefinedLoadMetric extends S.Class<PredictiveScalingPredefinedLoadMetric>(
  "PredictiveScalingPredefinedLoadMetric",
)({ PredefinedMetricType: S.String, ResourceLabel: S.optional(S.String) }) {}
export class MetricDimension extends S.Class<MetricDimension>(
  "MetricDimension",
)({ Name: S.String, Value: S.String }) {}
export const MetricDimensions = S.Array(MetricDimension);
export class Metric extends S.Class<Metric>("Metric")({
  Namespace: S.String,
  MetricName: S.String,
  Dimensions: S.optional(MetricDimensions),
}) {}
export class MetricStat extends S.Class<MetricStat>("MetricStat")({
  Metric: Metric,
  Stat: S.String,
  Unit: S.optional(S.String),
}) {}
export class MetricDataQuery extends S.Class<MetricDataQuery>(
  "MetricDataQuery",
)({
  Id: S.String,
  Expression: S.optional(S.String),
  MetricStat: S.optional(MetricStat),
  Label: S.optional(S.String),
  ReturnData: S.optional(S.Boolean),
}) {}
export const MetricDataQueries = S.Array(MetricDataQuery);
export class PredictiveScalingCustomizedScalingMetric extends S.Class<PredictiveScalingCustomizedScalingMetric>(
  "PredictiveScalingCustomizedScalingMetric",
)({ MetricDataQueries: MetricDataQueries }) {}
export class PredictiveScalingCustomizedLoadMetric extends S.Class<PredictiveScalingCustomizedLoadMetric>(
  "PredictiveScalingCustomizedLoadMetric",
)({ MetricDataQueries: MetricDataQueries }) {}
export class PredictiveScalingCustomizedCapacityMetric extends S.Class<PredictiveScalingCustomizedCapacityMetric>(
  "PredictiveScalingCustomizedCapacityMetric",
)({ MetricDataQueries: MetricDataQueries }) {}
export class PredictiveScalingMetricSpecification extends S.Class<PredictiveScalingMetricSpecification>(
  "PredictiveScalingMetricSpecification",
)({
  TargetValue: S.Number,
  PredefinedMetricPairSpecification: S.optional(
    PredictiveScalingPredefinedMetricPair,
  ),
  PredefinedScalingMetricSpecification: S.optional(
    PredictiveScalingPredefinedScalingMetric,
  ),
  PredefinedLoadMetricSpecification: S.optional(
    PredictiveScalingPredefinedLoadMetric,
  ),
  CustomizedScalingMetricSpecification: S.optional(
    PredictiveScalingCustomizedScalingMetric,
  ),
  CustomizedLoadMetricSpecification: S.optional(
    PredictiveScalingCustomizedLoadMetric,
  ),
  CustomizedCapacityMetricSpecification: S.optional(
    PredictiveScalingCustomizedCapacityMetric,
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
export class InstanceCollection extends S.Class<InstanceCollection>(
  "InstanceCollection",
)({
  InstanceType: S.optional(S.String),
  MarketType: S.optional(S.String),
  SubnetId: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  AvailabilityZoneId: S.optional(S.String),
  InstanceIds: S.optional(InstanceIds),
}) {}
export const InstanceCollections = S.Array(InstanceCollection);
export class LaunchInstancesError extends S.Class<LaunchInstancesError>(
  "LaunchInstancesError",
)({
  InstanceType: S.optional(S.String),
  MarketType: S.optional(S.String),
  SubnetId: S.optional(S.String),
  AvailabilityZone: S.optional(S.String),
  AvailabilityZoneId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const LaunchInstancesErrors = S.Array(LaunchInstancesError);
export class RefreshPreferences extends S.Class<RefreshPreferences>(
  "RefreshPreferences",
)({
  MinHealthyPercentage: S.optional(S.Number),
  InstanceWarmup: S.optional(S.Number),
  CheckpointPercentages: S.optional(CheckpointPercentages),
  CheckpointDelay: S.optional(S.Number),
  SkipMatching: S.optional(S.Boolean),
  AutoRollback: S.optional(S.Boolean),
  ScaleInProtectedInstances: S.optional(S.String),
  StandbyInstances: S.optional(S.String),
  AlarmSpecification: S.optional(AlarmSpecification),
  MaxHealthyPercentage: S.optional(S.Number),
  BakeTime: S.optional(S.Number),
}) {}
export class BatchDeleteScheduledActionAnswer extends S.Class<BatchDeleteScheduledActionAnswer>(
  "BatchDeleteScheduledActionAnswer",
)(
  {
    FailedScheduledActions: S.optional(
      FailedScheduledUpdateGroupActionRequests,
    ),
  },
  ns,
) {}
export class BatchPutScheduledUpdateGroupActionAnswer extends S.Class<BatchPutScheduledUpdateGroupActionAnswer>(
  "BatchPutScheduledUpdateGroupActionAnswer",
)(
  {
    FailedScheduledUpdateGroupActions: S.optional(
      FailedScheduledUpdateGroupActionRequests,
    ),
  },
  ns,
) {}
export class CreateLaunchConfigurationType extends S.Class<CreateLaunchConfigurationType>(
  "CreateLaunchConfigurationType",
)(
  {
    LaunchConfigurationName: S.String,
    ImageId: S.optional(S.String),
    KeyName: S.optional(S.String),
    SecurityGroups: S.optional(SecurityGroups),
    ClassicLinkVPCId: S.optional(S.String),
    ClassicLinkVPCSecurityGroups: S.optional(ClassicLinkVPCSecurityGroups),
    UserData: S.optional(S.String),
    InstanceId: S.optional(S.String),
    InstanceType: S.optional(S.String),
    KernelId: S.optional(S.String),
    RamdiskId: S.optional(S.String),
    BlockDeviceMappings: S.optional(BlockDeviceMappings),
    InstanceMonitoring: S.optional(InstanceMonitoring),
    SpotPrice: S.optional(S.String),
    IamInstanceProfile: S.optional(S.String),
    EbsOptimized: S.optional(S.Boolean),
    AssociatePublicIpAddress: S.optional(S.Boolean),
    PlacementTenancy: S.optional(S.String),
    MetadataOptions: S.optional(InstanceMetadataOptions),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLaunchConfigurationResponse extends S.Class<CreateLaunchConfigurationResponse>(
  "CreateLaunchConfigurationResponse",
)({}, ns) {}
export class AutoScalingInstancesType extends S.Class<AutoScalingInstancesType>(
  "AutoScalingInstancesType",
)(
  {
    AutoScalingInstances: S.optional(AutoScalingInstances),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class LaunchConfigurationsType extends S.Class<LaunchConfigurationsType>(
  "LaunchConfigurationsType",
)(
  {
    LaunchConfigurations: LaunchConfigurations,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeLifecycleHooksAnswer extends S.Class<DescribeLifecycleHooksAnswer>(
  "DescribeLifecycleHooksAnswer",
)({ LifecycleHooks: S.optional(LifecycleHooks) }, ns) {}
export class DescribeLoadBalancersResponse extends S.Class<DescribeLoadBalancersResponse>(
  "DescribeLoadBalancersResponse",
)(
  {
    LoadBalancers: S.optional(LoadBalancerStates),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeLoadBalancerTargetGroupsResponse extends S.Class<DescribeLoadBalancerTargetGroupsResponse>(
  "DescribeLoadBalancerTargetGroupsResponse",
)(
  {
    LoadBalancerTargetGroups: S.optional(LoadBalancerTargetGroupStates),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeNotificationConfigurationsAnswer extends S.Class<DescribeNotificationConfigurationsAnswer>(
  "DescribeNotificationConfigurationsAnswer",
)(
  {
    NotificationConfigurations: NotificationConfigurations,
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ActivitiesType extends S.Class<ActivitiesType>("ActivitiesType")(
  { Activities: Activities, NextToken: S.optional(S.String) },
  ns,
) {}
export class ScheduledActionsType extends S.Class<ScheduledActionsType>(
  "ScheduledActionsType",
)(
  {
    ScheduledUpdateGroupActions: S.optional(ScheduledUpdateGroupActions),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class TagsType extends S.Class<TagsType>("TagsType")(
  { Tags: S.optional(TagDescriptionList), NextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeTrafficSourcesResponse extends S.Class<DescribeTrafficSourcesResponse>(
  "DescribeTrafficSourcesResponse",
)(
  {
    TrafficSources: S.optional(TrafficSourceStates),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeWarmPoolAnswer extends S.Class<DescribeWarmPoolAnswer>(
  "DescribeWarmPoolAnswer",
)(
  {
    WarmPoolConfiguration: S.optional(WarmPoolConfiguration),
    Instances: S.optional(Instances),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class GetPredictiveScalingForecastAnswer extends S.Class<GetPredictiveScalingForecastAnswer>(
  "GetPredictiveScalingForecastAnswer",
)(
  {
    LoadForecast: LoadForecasts,
    CapacityForecast: CapacityForecast,
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  },
  ns,
) {}
export class LaunchInstancesResult extends S.Class<LaunchInstancesResult>(
  "LaunchInstancesResult",
)(
  {
    AutoScalingGroupName: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Instances: S.optional(InstanceCollections),
    Errors: S.optional(LaunchInstancesErrors),
  },
  ns,
) {}
export class StartInstanceRefreshType extends S.Class<StartInstanceRefreshType>(
  "StartInstanceRefreshType",
)(
  {
    AutoScalingGroupName: S.String,
    Strategy: S.optional(S.String),
    DesiredConfiguration: S.optional(DesiredConfiguration),
    Preferences: S.optional(RefreshPreferences),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class InstanceRefreshLivePoolProgress extends S.Class<InstanceRefreshLivePoolProgress>(
  "InstanceRefreshLivePoolProgress",
)({
  PercentageComplete: S.optional(S.Number),
  InstancesToUpdate: S.optional(S.Number),
}) {}
export class InstanceRefreshWarmPoolProgress extends S.Class<InstanceRefreshWarmPoolProgress>(
  "InstanceRefreshWarmPoolProgress",
)({
  PercentageComplete: S.optional(S.Number),
  InstancesToUpdate: S.optional(S.Number),
}) {}
export class InstanceRefreshProgressDetails extends S.Class<InstanceRefreshProgressDetails>(
  "InstanceRefreshProgressDetails",
)({
  LivePoolProgress: S.optional(InstanceRefreshLivePoolProgress),
  WarmPoolProgress: S.optional(InstanceRefreshWarmPoolProgress),
}) {}
export class RollbackDetails extends S.Class<RollbackDetails>(
  "RollbackDetails",
)({
  RollbackReason: S.optional(S.String),
  RollbackStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  PercentageCompleteOnRollback: S.optional(S.Number),
  InstancesToUpdateOnRollback: S.optional(S.Number),
  ProgressDetailsOnRollback: S.optional(InstanceRefreshProgressDetails),
}) {}
export class Alarm extends S.Class<Alarm>("Alarm")({
  AlarmName: S.optional(S.String),
  AlarmARN: S.optional(S.String),
}) {}
export const Alarms = S.Array(Alarm);
export class TargetTrackingMetricStat extends S.Class<TargetTrackingMetricStat>(
  "TargetTrackingMetricStat",
)({
  Metric: Metric,
  Stat: S.String,
  Unit: S.optional(S.String),
  Period: S.optional(S.Number),
}) {}
export class TargetTrackingMetricDataQuery extends S.Class<TargetTrackingMetricDataQuery>(
  "TargetTrackingMetricDataQuery",
)({
  Id: S.String,
  Expression: S.optional(S.String),
  MetricStat: S.optional(TargetTrackingMetricStat),
  Label: S.optional(S.String),
  Period: S.optional(S.Number),
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
  Period: S.optional(S.Number),
  Metrics: S.optional(TargetTrackingMetricDataQueries),
}) {}
export class TargetTrackingConfiguration extends S.Class<TargetTrackingConfiguration>(
  "TargetTrackingConfiguration",
)({
  PredefinedMetricSpecification: S.optional(PredefinedMetricSpecification),
  CustomizedMetricSpecification: S.optional(CustomizedMetricSpecification),
  TargetValue: S.Number,
  DisableScaleIn: S.optional(S.Boolean),
}) {}
export const PredictiveScalingMetricSpecifications = S.Array(
  PredictiveScalingMetricSpecification,
);
export class PredictiveScalingConfiguration extends S.Class<PredictiveScalingConfiguration>(
  "PredictiveScalingConfiguration",
)({
  MetricSpecifications: PredictiveScalingMetricSpecifications,
  Mode: S.optional(S.String),
  SchedulingBufferTime: S.optional(S.Number),
  MaxCapacityBreachBehavior: S.optional(S.String),
  MaxCapacityBuffer: S.optional(S.Number),
}) {}
export class ScalingPolicy extends S.Class<ScalingPolicy>("ScalingPolicy")({
  AutoScalingGroupName: S.optional(S.String),
  PolicyName: S.optional(S.String),
  PolicyARN: S.optional(S.String),
  PolicyType: S.optional(S.String),
  AdjustmentType: S.optional(S.String),
  MinAdjustmentStep: S.optional(S.Number),
  MinAdjustmentMagnitude: S.optional(S.Number),
  ScalingAdjustment: S.optional(S.Number),
  Cooldown: S.optional(S.Number),
  StepAdjustments: S.optional(StepAdjustments),
  MetricAggregationType: S.optional(S.String),
  EstimatedInstanceWarmup: S.optional(S.Number),
  Alarms: S.optional(Alarms),
  TargetTrackingConfiguration: S.optional(TargetTrackingConfiguration),
  Enabled: S.optional(S.Boolean),
  PredictiveScalingConfiguration: S.optional(PredictiveScalingConfiguration),
}) {}
export const ScalingPolicies = S.Array(ScalingPolicy);
export class PoliciesType extends S.Class<PoliciesType>("PoliciesType")(
  {
    ScalingPolicies: S.optional(ScalingPolicies),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class StartInstanceRefreshAnswer extends S.Class<StartInstanceRefreshAnswer>(
  "StartInstanceRefreshAnswer",
)({ InstanceRefreshId: S.optional(S.String) }, ns) {}
export class SuspendedProcess extends S.Class<SuspendedProcess>(
  "SuspendedProcess",
)({
  ProcessName: S.optional(S.String),
  SuspensionReason: S.optional(S.String),
}) {}
export const SuspendedProcesses = S.Array(SuspendedProcess);
export class EnabledMetric extends S.Class<EnabledMetric>("EnabledMetric")({
  Metric: S.optional(S.String),
  Granularity: S.optional(S.String),
}) {}
export const EnabledMetrics = S.Array(EnabledMetric);
export class AutoScalingGroup extends S.Class<AutoScalingGroup>(
  "AutoScalingGroup",
)({
  AutoScalingGroupName: S.String,
  AutoScalingGroupARN: S.optional(S.String),
  LaunchConfigurationName: S.optional(S.String),
  LaunchTemplate: S.optional(LaunchTemplateSpecification),
  MixedInstancesPolicy: S.optional(MixedInstancesPolicy),
  MinSize: S.Number,
  MaxSize: S.Number,
  DesiredCapacity: S.Number,
  PredictedCapacity: S.optional(S.Number),
  DefaultCooldown: S.Number,
  AvailabilityZones: AvailabilityZones,
  LoadBalancerNames: S.optional(LoadBalancerNames),
  TargetGroupARNs: S.optional(TargetGroupARNs),
  HealthCheckType: S.String,
  HealthCheckGracePeriod: S.optional(S.Number),
  Instances: S.optional(Instances),
  CreatedTime: S.Date.pipe(T.TimestampFormat("date-time")),
  SuspendedProcesses: S.optional(SuspendedProcesses),
  PlacementGroup: S.optional(S.String),
  VPCZoneIdentifier: S.optional(S.String),
  EnabledMetrics: S.optional(EnabledMetrics),
  Status: S.optional(S.String),
  Tags: S.optional(TagDescriptionList),
  TerminationPolicies: S.optional(TerminationPolicies),
  NewInstancesProtectedFromScaleIn: S.optional(S.Boolean),
  ServiceLinkedRoleARN: S.optional(S.String),
  MaxInstanceLifetime: S.optional(S.Number),
  CapacityRebalance: S.optional(S.Boolean),
  WarmPoolConfiguration: S.optional(WarmPoolConfiguration),
  WarmPoolSize: S.optional(S.Number),
  Context: S.optional(S.String),
  DesiredCapacityType: S.optional(S.String),
  DefaultInstanceWarmup: S.optional(S.Number),
  TrafficSources: S.optional(TrafficSources),
  InstanceMaintenancePolicy: S.optional(InstanceMaintenancePolicy),
  AvailabilityZoneDistribution: S.optional(AvailabilityZoneDistribution),
  AvailabilityZoneImpairmentPolicy: S.optional(
    AvailabilityZoneImpairmentPolicy,
  ),
  CapacityReservationSpecification: S.optional(
    CapacityReservationSpecification,
  ),
  InstanceLifecyclePolicy: S.optional(InstanceLifecyclePolicy),
}) {}
export const AutoScalingGroups = S.Array(AutoScalingGroup);
export class InstanceRefresh extends S.Class<InstanceRefresh>(
  "InstanceRefresh",
)({
  InstanceRefreshId: S.optional(S.String),
  AutoScalingGroupName: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  PercentageComplete: S.optional(S.Number),
  InstancesToUpdate: S.optional(S.Number),
  ProgressDetails: S.optional(InstanceRefreshProgressDetails),
  Preferences: S.optional(RefreshPreferences),
  DesiredConfiguration: S.optional(DesiredConfiguration),
  RollbackDetails: S.optional(RollbackDetails),
  Strategy: S.optional(S.String),
}) {}
export const InstanceRefreshes = S.Array(InstanceRefresh);
export class AutoScalingGroupsType extends S.Class<AutoScalingGroupsType>(
  "AutoScalingGroupsType",
)(
  { AutoScalingGroups: AutoScalingGroups, NextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeInstanceRefreshesAnswer extends S.Class<DescribeInstanceRefreshesAnswer>(
  "DescribeInstanceRefreshesAnswer",
)(
  {
    InstanceRefreshes: S.optional(InstanceRefreshes),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class PutScalingPolicyType extends S.Class<PutScalingPolicyType>(
  "PutScalingPolicyType",
)(
  {
    AutoScalingGroupName: S.String,
    PolicyName: S.String,
    PolicyType: S.optional(S.String),
    AdjustmentType: S.optional(S.String),
    MinAdjustmentStep: S.optional(S.Number),
    MinAdjustmentMagnitude: S.optional(S.Number),
    ScalingAdjustment: S.optional(S.Number),
    Cooldown: S.optional(S.Number),
    MetricAggregationType: S.optional(S.String),
    StepAdjustments: S.optional(StepAdjustments),
    EstimatedInstanceWarmup: S.optional(S.Number),
    TargetTrackingConfiguration: S.optional(TargetTrackingConfiguration),
    Enabled: S.optional(S.Boolean),
    PredictiveScalingConfiguration: S.optional(PredictiveScalingConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PolicyARNType extends S.Class<PolicyARNType>("PolicyARNType")(
  { PolicyARN: S.optional(S.String), Alarms: S.optional(Alarms) },
  ns,
) {}
export class CreateAutoScalingGroupType extends S.Class<CreateAutoScalingGroupType>(
  "CreateAutoScalingGroupType",
)(
  {
    AutoScalingGroupName: S.String,
    LaunchConfigurationName: S.optional(S.String),
    LaunchTemplate: S.optional(LaunchTemplateSpecification),
    MixedInstancesPolicy: S.optional(MixedInstancesPolicy),
    InstanceId: S.optional(S.String),
    MinSize: S.Number,
    MaxSize: S.Number,
    DesiredCapacity: S.optional(S.Number),
    DefaultCooldown: S.optional(S.Number),
    AvailabilityZones: S.optional(AvailabilityZones),
    LoadBalancerNames: S.optional(LoadBalancerNames),
    TargetGroupARNs: S.optional(TargetGroupARNs),
    HealthCheckType: S.optional(S.String),
    HealthCheckGracePeriod: S.optional(S.Number),
    PlacementGroup: S.optional(S.String),
    VPCZoneIdentifier: S.optional(S.String),
    TerminationPolicies: S.optional(TerminationPolicies),
    NewInstancesProtectedFromScaleIn: S.optional(S.Boolean),
    CapacityRebalance: S.optional(S.Boolean),
    LifecycleHookSpecificationList: S.optional(LifecycleHookSpecifications),
    Tags: S.optional(Tags),
    ServiceLinkedRoleARN: S.optional(S.String),
    MaxInstanceLifetime: S.optional(S.Number),
    Context: S.optional(S.String),
    DesiredCapacityType: S.optional(S.String),
    DefaultInstanceWarmup: S.optional(S.Number),
    TrafficSources: S.optional(TrafficSources),
    InstanceMaintenancePolicy: S.optional(InstanceMaintenancePolicy),
    AvailabilityZoneDistribution: S.optional(AvailabilityZoneDistribution),
    AvailabilityZoneImpairmentPolicy: S.optional(
      AvailabilityZoneImpairmentPolicy,
    ),
    SkipZonalShiftValidation: S.optional(S.Boolean),
    CapacityReservationSpecification: S.optional(
      CapacityReservationSpecification,
    ),
    InstanceLifecyclePolicy: S.optional(InstanceLifecyclePolicy),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateAutoScalingGroupResponse extends S.Class<CreateAutoScalingGroupResponse>(
  "CreateAutoScalingGroupResponse",
)({}, ns) {}

//# Errors
export class ResourceContentionFault extends S.TaggedError<ResourceContentionFault>()(
  "ResourceContentionFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceContention", httpResponseCode: 500 }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InstanceRefreshInProgressFault extends S.TaggedError<InstanceRefreshInProgressFault>()(
  "InstanceRefreshInProgressFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InstanceRefreshInProgress", httpResponseCode: 400 }),
) {}
export class AlreadyExistsFault extends S.TaggedError<AlreadyExistsFault>()(
  "AlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AlreadyExists", httpResponseCode: 400 }),
) {}
export class LimitExceededFault extends S.TaggedError<LimitExceededFault>()(
  "LimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceeded", httpResponseCode: 400 }),
) {}
export class ResourceInUseFault extends S.TaggedError<ResourceInUseFault>()(
  "ResourceInUseFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceInUse", httpResponseCode: 400 }),
) {}
export class ScalingActivityInProgressFault extends S.TaggedError<ScalingActivityInProgressFault>()(
  "ScalingActivityInProgressFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ScalingActivityInProgress", httpResponseCode: 400 }),
) {}
export class ServiceLinkedRoleFailure extends S.TaggedError<ServiceLinkedRoleFailure>()(
  "ServiceLinkedRoleFailure",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ServiceLinkedRoleFailure", httpResponseCode: 500 }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ActiveInstanceRefreshNotFoundFault extends S.TaggedError<ActiveInstanceRefreshNotFoundFault>()(
  "ActiveInstanceRefreshNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ActiveInstanceRefreshNotFound",
    httpResponseCode: 400,
  }),
) {}
export class InvalidNextToken extends S.TaggedError<InvalidNextToken>()(
  "InvalidNextToken",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidNextToken", httpResponseCode: 400 }),
) {}
export class IdempotentParameterMismatchError extends S.TaggedError<IdempotentParameterMismatchError>()(
  "IdempotentParameterMismatchError",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IdempotentParameterMismatch",
    httpResponseCode: 400,
  }),
) {}
export class IrreversibleInstanceRefreshFault extends S.TaggedError<IrreversibleInstanceRefreshFault>()(
  "IrreversibleInstanceRefreshFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IrreversibleInstanceRefresh",
    httpResponseCode: 400,
  }),
) {}

//# Operations
/**
 * Completes the lifecycle action for the specified token or instance with the specified
 * result.
 *
 * This step is a part of the procedure for adding a lifecycle hook to an Auto Scaling
 * group:
 *
 * - (Optional) Create a launch template or launch configuration with a user data
 * script that runs while an instance is in a wait state due to a lifecycle
 * hook.
 *
 * - (Optional) Create a Lambda function and a rule that allows Amazon EventBridge to invoke
 * your Lambda function when an instance is put into a wait state due to a
 * lifecycle hook.
 *
 * - (Optional) Create a notification target and an IAM role. The target can be
 * either an Amazon SQS queue or an Amazon SNS topic. The role allows Amazon EC2 Auto Scaling to publish
 * lifecycle notifications to the target.
 *
 * - Create the lifecycle hook. Specify whether the hook is used when the instances
 * launch or terminate.
 *
 * - If you need more time, record the lifecycle action heartbeat to keep the
 * instance in a wait state.
 *
 * - If you finish before the timeout period ends, send a
 * callback by using the CompleteLifecycleAction API
 * call.
 *
 * For more information, see Complete a lifecycle
 * action in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const completeLifecycleAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CompleteLifecycleActionType,
    output: CompleteLifecycleActionAnswer,
    errors: [ResourceContentionFault],
  }),
);
/**
 * Deletes the specified lifecycle hook.
 *
 * If there are any outstanding lifecycle actions, they are completed first
 * (`ABANDON` for launching instances, `CONTINUE` for terminating
 * instances).
 */
export const deleteLifecycleHook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLifecycleHookType,
  output: DeleteLifecycleHookAnswer,
  errors: [ResourceContentionFault],
}));
/**
 * Deletes the specified notification.
 */
export const deleteNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteNotificationConfigurationType,
    output: DeleteNotificationConfigurationResponse,
    errors: [ResourceContentionFault],
  }));
/**
 * Deletes the specified scheduled action.
 */
export const deleteScheduledAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteScheduledActionType,
    output: DeleteScheduledActionResponse,
    errors: [ResourceContentionFault],
  }),
);
/**
 * Describes the current Amazon EC2 Auto Scaling resource quotas for your account.
 *
 * When you establish an Amazon Web Services account, the account has initial quotas on the maximum
 * number of Auto Scaling groups and launch configurations that you can create in a given Region.
 * For more information, see Quotas for
 * Amazon EC2 Auto Scaling in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const describeAccountLimits = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountLimitsRequest,
    output: DescribeAccountLimitsAnswer,
    errors: [ResourceContentionFault],
  }),
);
/**
 * Describes the notification types that are supported by Amazon EC2 Auto Scaling.
 */
export const describeAutoScalingNotificationTypes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeAutoScalingNotificationTypesRequest,
    output: DescribeAutoScalingNotificationTypesAnswer,
    errors: [ResourceContentionFault],
  }));
/**
 * Describes the available types of lifecycle hooks.
 *
 * The following hook types are supported:
 *
 * - `autoscaling:EC2_INSTANCE_LAUNCHING`
 *
 * - `autoscaling:EC2_INSTANCE_TERMINATING`
 */
export const describeLifecycleHookTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLifecycleHookTypesRequest,
    output: DescribeLifecycleHookTypesAnswer,
    errors: [ResourceContentionFault],
  }),
);
/**
 * Describes the termination policies supported by Amazon EC2 Auto Scaling.
 *
 * For more information, see Configure
 * termination policies for Amazon EC2 Auto Scaling in the
 * *Amazon EC2 Auto Scaling User Guide*.
 */
export const describeTerminationPolicyTypes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeTerminationPolicyTypesRequest,
    output: DescribeTerminationPolicyTypesAnswer,
    errors: [ResourceContentionFault],
  }));
/**
 * This API operation is superseded by DetachTrafficSources, which
 * can detach multiple traffic sources types. We recommend using
 * `DetachTrafficSources` to simplify how you manage traffic sources.
 * However, we continue to support `DetachLoadBalancers`. You can use both
 * the original `DetachLoadBalancers` API operation and
 * `DetachTrafficSources` on the same Auto Scaling group.
 *
 * Detaches one or more Classic Load Balancers from the specified Auto Scaling group.
 *
 * This operation detaches only Classic Load Balancers. If you have Application Load Balancers, Network Load Balancers, or
 * Gateway Load Balancers, use the DetachLoadBalancerTargetGroups API instead.
 *
 * When you detach a load balancer, it enters the `Removing` state while
 * deregistering the instances in the group. When all instances are deregistered, then you
 * can no longer describe the load balancer using the DescribeLoadBalancers
 * API call. The instances remain running.
 */
export const detachLoadBalancers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachLoadBalancersType,
  output: DetachLoadBalancersResultType,
  errors: [ResourceContentionFault],
}));
/**
 * This API operation is superseded by DetachTrafficSources, which
 * can detach multiple traffic sources types. We recommend using
 * `DetachTrafficSources` to simplify how you manage traffic sources.
 * However, we continue to support `DetachLoadBalancerTargetGroups`. You can
 * use both the original `DetachLoadBalancerTargetGroups` API operation and
 * `DetachTrafficSources` on the same Auto Scaling group.
 *
 * Detaches one or more target groups from the specified Auto Scaling group.
 *
 * When you detach a target group, it enters the `Removing` state while
 * deregistering the instances in the group. When all instances are deregistered, then you
 * can no longer describe the target group using the
 * DescribeLoadBalancerTargetGroups
 * API call. The instances remain running.
 *
 * You can use this operation to detach target groups that were attached by using
 * AttachLoadBalancerTargetGroups, but not for target groups that
 * were attached by using AttachTrafficSources.
 */
export const detachLoadBalancerTargetGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DetachLoadBalancerTargetGroupsType,
    output: DetachLoadBalancerTargetGroupsResultType,
    errors: [ResourceContentionFault],
  }));
/**
 * Detaches one or more traffic sources from the specified Auto Scaling group.
 *
 * When you detach a traffic source, it enters the `Removing` state while
 * deregistering the instances in the group. When all instances are deregistered, then you
 * can no longer describe the traffic source using the
 * DescribeTrafficSources
 * API call. The instances continue to run.
 */
export const detachTrafficSources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DetachTrafficSourcesType,
    output: DetachTrafficSourcesResultType,
    errors: [ResourceContentionFault],
  }),
);
/**
 * Disables group metrics collection for the specified Auto Scaling group.
 */
export const disableMetricsCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisableMetricsCollectionQuery,
    output: DisableMetricsCollectionResponse,
    errors: [ResourceContentionFault],
  }),
);
/**
 * Enables group metrics collection for the specified Auto Scaling group.
 *
 * You can use these metrics to track changes in an Auto Scaling group and to set alarms on
 * threshold values. You can view group metrics using the Amazon EC2 Auto Scaling console or the CloudWatch
 * console. For more information, see Monitor
 * CloudWatch metrics for your Auto Scaling groups and instances in the
 * *Amazon EC2 Auto Scaling User Guide*.
 */
export const enableMetricsCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: EnableMetricsCollectionQuery,
    output: EnableMetricsCollectionResponse,
    errors: [ResourceContentionFault],
  }),
);
/**
 * Records a heartbeat for the lifecycle action associated with the specified token or
 * instance. This extends the timeout by the length of time defined using the
 * PutLifecycleHook API call.
 *
 * This step is a part of the procedure for adding a lifecycle hook to an Auto Scaling
 * group:
 *
 * - (Optional) Create a launch template or launch configuration with a user data
 * script that runs while an instance is in a wait state due to a lifecycle
 * hook.
 *
 * - (Optional) Create a Lambda function and a rule that allows Amazon EventBridge to invoke
 * your Lambda function when an instance is put into a wait state due to a
 * lifecycle hook.
 *
 * - (Optional) Create a notification target and an IAM role. The target can be
 * either an Amazon SQS queue or an Amazon SNS topic. The role allows Amazon EC2 Auto Scaling to publish
 * lifecycle notifications to the target.
 *
 * - Create the lifecycle hook. Specify whether the hook is used when the instances
 * launch or terminate.
 *
 * - If you need more time, record the lifecycle action
 * heartbeat to keep the instance in a wait state.
 *
 * - If you finish before the timeout period ends, send a callback by using the
 * CompleteLifecycleAction API call.
 *
 * For more information, see Amazon EC2 Auto Scaling lifecycle
 * hooks in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const recordLifecycleActionHeartbeat =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RecordLifecycleActionHeartbeatType,
    output: RecordLifecycleActionHeartbeatAnswer,
    errors: [ResourceContentionFault],
  }));
/**
 * Sets the health status of the specified instance.
 *
 * For more information, see Set up a custom
 * health check for your Auto Scaling group in the
 * *Amazon EC2 Auto Scaling User Guide*.
 */
export const setInstanceHealth = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetInstanceHealthQuery,
  output: SetInstanceHealthResponse,
  errors: [ResourceContentionFault],
}));
/**
 * Describes the available adjustment types for step scaling and simple scaling
 * policies.
 *
 * The following adjustment types are supported:
 *
 * - `ChangeInCapacity`
 *
 * - `ExactCapacity`
 *
 * - `PercentChangeInCapacity`
 */
export const describeAdjustmentTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAdjustmentTypesRequest,
    output: DescribeAdjustmentTypesAnswer,
    errors: [ResourceContentionFault],
  }),
);
/**
 * Describes the available CloudWatch metrics for Amazon EC2 Auto Scaling.
 */
export const describeMetricCollectionTypes =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeMetricCollectionTypesRequest,
    output: DescribeMetricCollectionTypesAnswer,
    errors: [ResourceContentionFault],
  }));
/**
 * Describes the scaling process types for use with the ResumeProcesses
 * and SuspendProcesses APIs.
 */
export const describeScalingProcessTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeScalingProcessTypesRequest,
    output: ProcessesType,
    errors: [ResourceContentionFault],
  }),
);
/**
 * Removes one or more instances from the specified Auto Scaling group.
 *
 * After the instances are detached, you can manage them independent of the Auto Scaling
 * group.
 *
 * If you do not specify the option to decrement the desired capacity, Amazon EC2 Auto Scaling launches
 * instances to replace the ones that are detached.
 *
 * If there is a Classic Load Balancer attached to the Auto Scaling group, the instances are
 * deregistered from the load balancer. If there are target groups attached to the Auto Scaling
 * group, the instances are deregistered from the target groups.
 *
 * For more information, see Detach
 * or attach instances in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const detachInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachInstancesQuery,
  output: DetachInstancesAnswer,
  errors: [ResourceContentionFault],
}));
/**
 * Moves the specified instances into the standby state.
 *
 * If you choose to decrement the desired capacity of the Auto Scaling group, the instances can
 * enter standby as long as the desired capacity of the Auto Scaling group after the instances are
 * placed into standby is equal to or greater than the minimum capacity of the
 * group.
 *
 * If you choose not to decrement the desired capacity of the Auto Scaling group, the Auto Scaling group
 * launches new instances to replace the instances on standby.
 *
 * For more information, see Temporarily removing
 * instances from your Auto Scaling group in the
 * *Amazon EC2 Auto Scaling User Guide*.
 */
export const enterStandby = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnterStandbyQuery,
  output: EnterStandbyAnswer,
  errors: [ResourceContentionFault],
}));
/**
 * Moves the specified instances out of the standby state.
 *
 * After you put the instances back in service, the desired capacity is
 * incremented.
 *
 * For more information, see Temporarily removing
 * instances from your Auto Scaling group in the
 * *Amazon EC2 Auto Scaling User Guide*.
 */
export const exitStandby = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExitStandbyQuery,
  output: ExitStandbyAnswer,
  errors: [ResourceContentionFault],
}));
/**
 * Creates or updates a warm pool for the specified Auto Scaling group. A warm pool is a pool of
 * pre-initialized EC2 instances that sits alongside the Auto Scaling group. Whenever your
 * application needs to scale out, the Auto Scaling group can draw on the warm pool to meet its new
 * desired capacity.
 *
 * This operation must be called from the Region in which the Auto Scaling group was
 * created.
 *
 * You can view the instances in the warm pool using the DescribeWarmPool API call.
 * If you are no longer using a warm pool, you can delete it by calling the DeleteWarmPool API.
 *
 * For more information, see Warm pools for
 * Amazon EC2 Auto Scaling in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const putWarmPool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutWarmPoolType,
  output: PutWarmPoolAnswer,
  errors: [
    InstanceRefreshInProgressFault,
    LimitExceededFault,
    ResourceContentionFault,
  ],
}));
/**
 * Suspends the specified auto scaling processes, or all processes, for the specified
 * Auto Scaling group.
 *
 * If you suspend either the `Launch` or `Terminate` process types,
 * it can prevent other process types from functioning properly. For more information, see
 * Suspend and resume
 * Amazon EC2 Auto Scaling processes in the *Amazon EC2 Auto Scaling User Guide*.
 *
 * To resume processes that have been suspended, call the ResumeProcesses API.
 */
export const suspendProcesses = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalingProcessQuery,
  output: SuspendProcessesResponse,
  errors: [ResourceContentionFault, ResourceInUseFault],
}));
/**
 * Creates or updates a scheduled scaling action for an Auto Scaling group.
 *
 * For more information, see Scheduled scaling in the
 * *Amazon EC2 Auto Scaling User Guide*.
 *
 * You can view the scheduled actions for an Auto Scaling group using the
 * DescribeScheduledActions
 * API call. If you are no longer using a scheduled action, you can delete it by calling the
 * DeleteScheduledAction API.
 *
 * If you try to schedule your action in the past, Amazon EC2 Auto Scaling returns an error
 * message.
 */
export const putScheduledUpdateGroupAction =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutScheduledUpdateGroupActionType,
    output: PutScheduledUpdateGroupActionResponse,
    errors: [AlreadyExistsFault, LimitExceededFault, ResourceContentionFault],
  }));
/**
 * Creates or updates a lifecycle hook for the specified Auto Scaling group.
 *
 * Lifecycle hooks let you create solutions that are aware of events in the Auto Scaling instance
 * lifecycle, and then perform a custom action on instances when the corresponding
 * lifecycle event occurs.
 *
 * This step is a part of the procedure for adding a lifecycle hook to an Auto Scaling
 * group:
 *
 * - (Optional) Create a launch template or launch configuration with a user data
 * script that runs while an instance is in a wait state due to a lifecycle
 * hook.
 *
 * - (Optional) Create a Lambda function and a rule that allows Amazon EventBridge to invoke
 * your Lambda function when an instance is put into a wait state due to a
 * lifecycle hook.
 *
 * - (Optional) Create a notification target and an IAM role. The target can be
 * either an Amazon SQS queue or an Amazon SNS topic. The role allows Amazon EC2 Auto Scaling to publish
 * lifecycle notifications to the target.
 *
 * - Create the lifecycle hook. Specify whether the hook is
 * used when the instances launch or terminate.
 *
 * - If you need more time, record the lifecycle action heartbeat to keep the
 * instance in a wait state using the RecordLifecycleActionHeartbeat API call.
 *
 * - If you finish before the timeout period ends, send a callback by using the
 * CompleteLifecycleAction API call.
 *
 * For more information, see Amazon EC2 Auto Scaling lifecycle
 * hooks in the *Amazon EC2 Auto Scaling User Guide*.
 *
 * If you exceed your maximum limit of lifecycle hooks, which by default is 50 per Auto Scaling
 * group, the call fails.
 *
 * You can view the lifecycle hooks for an Auto Scaling group using the
 * DescribeLifecycleHooks API call. If you are no longer using a lifecycle
 * hook, you can delete it by calling the DeleteLifecycleHook API.
 */
export const putLifecycleHook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLifecycleHookType,
  output: PutLifecycleHookAnswer,
  errors: [LimitExceededFault, ResourceContentionFault],
}));
/**
 * Updates the instance protection settings of the specified instances. This operation
 * cannot be called on instances in a warm pool.
 *
 * For more information, see Use
 * instance scale-in protection in the
 * *Amazon EC2 Auto Scaling User Guide*.
 *
 * If you exceed your maximum limit of instance IDs, which is 50 per Auto Scaling group, the call
 * fails.
 */
export const setInstanceProtection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetInstanceProtectionQuery,
    output: SetInstanceProtectionAnswer,
    errors: [LimitExceededFault, ResourceContentionFault],
  }),
);
/**
 * Creates or updates tags for the specified Auto Scaling group.
 *
 * When you specify a tag with a key that already exists, the operation overwrites the
 * previous tag definition, and you do not get an error message.
 *
 * For more information, see Tag Auto Scaling groups and
 * instances in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const createOrUpdateTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateOrUpdateTagsType,
  output: CreateOrUpdateTagsResponse,
  errors: [
    AlreadyExistsFault,
    LimitExceededFault,
    ResourceContentionFault,
    ResourceInUseFault,
  ],
}));
/**
 * Attaches one or more EC2 instances to the specified Auto Scaling group.
 *
 * When you attach instances, Amazon EC2 Auto Scaling increases the desired capacity of the group by the
 * number of instances being attached. If the number of instances being attached plus the
 * desired capacity of the group exceeds the maximum size of the group, the operation
 * fails.
 *
 * If there is a Classic Load Balancer attached to your Auto Scaling group, the instances are
 * also registered with the load balancer. If there are target groups attached to your Auto Scaling
 * group, the instances are also registered with the target groups.
 *
 * For more information, see Detach
 * or attach instances in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const attachInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachInstancesQuery,
  output: AttachInstancesResponse,
  errors: [ResourceContentionFault, ServiceLinkedRoleFailure],
}));
/**
 * Deletes the specified Auto Scaling group.
 *
 * If the group has instances or scaling activities in progress, you must specify the
 * option to force the deletion in order for it to succeed. The force delete operation will
 * also terminate the EC2 instances. If the group has a warm pool, the force delete option
 * also deletes the warm pool.
 *
 * To remove instances from the Auto Scaling group before deleting it, call the
 * DetachInstances API with the list of instances and the option to
 * decrement the desired capacity. This ensures that Amazon EC2 Auto Scaling does not launch replacement
 * instances.
 *
 * To terminate all instances before deleting the Auto Scaling group, call the
 * UpdateAutoScalingGroup API and set the minimum size and desired capacity
 * of the Auto Scaling group to
 * zero.
 *
 * If the group has scaling policies, deleting the group deletes the policies, the
 * underlying alarm actions, and any alarm that no longer has an associated action.
 *
 * For more information, see Delete your Auto Scaling
 * infrastructure in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const deleteAutoScalingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAutoScalingGroupType,
    output: DeleteAutoScalingGroupResponse,
    errors: [
      ResourceContentionFault,
      ResourceInUseFault,
      ScalingActivityInProgressFault,
    ],
  }),
);
/**
 * Deletes the specified launch configuration.
 *
 * The launch configuration must not be attached to an Auto Scaling group. When this call
 * completes, the launch configuration is no longer available for use.
 */
export const deleteLaunchConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: LaunchConfigurationNameType,
    output: DeleteLaunchConfigurationResponse,
    errors: [ResourceContentionFault, ResourceInUseFault],
  }),
);
/**
 * Deletes the specified tags.
 */
export const deleteTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagsType,
  output: DeleteTagsResponse,
  errors: [ResourceContentionFault, ResourceInUseFault],
}));
/**
 * Resumes the specified suspended auto scaling processes, or all suspended process, for
 * the specified Auto Scaling group.
 *
 * For more information, see Suspend and resume
 * Amazon EC2 Auto Scaling processes in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const resumeProcesses = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ScalingProcessQuery,
  output: ResumeProcessesResponse,
  errors: [ResourceContentionFault, ResourceInUseFault],
}));
/**
 * Deletes the warm pool for the specified Auto Scaling group.
 *
 * For more information, see Warm pools for
 * Amazon EC2 Auto Scaling in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const deleteWarmPool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWarmPoolType,
  output: DeleteWarmPoolAnswer,
  errors: [
    LimitExceededFault,
    ResourceContentionFault,
    ResourceInUseFault,
    ScalingActivityInProgressFault,
  ],
}));
/**
 * Executes the specified policy. This can be useful for testing the design of your
 * scaling policy.
 */
export const executePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecutePolicyType,
  output: ExecutePolicyResponse,
  errors: [ResourceContentionFault, ScalingActivityInProgressFault],
}));
/**
 * Sets the size of the specified Auto Scaling group.
 *
 * If a scale-in activity occurs as a result of a new `DesiredCapacity` value
 * that is lower than the current size of the group, the Auto Scaling group uses its termination
 * policy to determine which instances to terminate.
 *
 * For more information, see Manual
 * scaling in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const setDesiredCapacity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetDesiredCapacityType,
  output: SetDesiredCapacityResponse,
  errors: [ResourceContentionFault, ScalingActivityInProgressFault],
}));
/**
 * Terminates the specified instance and optionally adjusts the desired group size. This
 * operation cannot be called on instances in a warm pool.
 *
 * This call simply makes a termination request. The instance is not terminated
 * immediately. When an instance is terminated, the instance status changes to
 * `terminated`. You can't connect to or start an instance after you've
 * terminated it.
 *
 * If you do not specify the option to decrement the desired capacity, Amazon EC2 Auto Scaling launches
 * instances to replace the ones that are terminated.
 *
 * By default, Amazon EC2 Auto Scaling balances instances across all Availability Zones. If you
 * decrement the desired capacity, your Auto Scaling group can become unbalanced between
 * Availability Zones. Amazon EC2 Auto Scaling tries to rebalance the group, and rebalancing might
 * terminate instances in other zones. For more information, see Manual
 * scaling in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const terminateInstanceInAutoScalingGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: TerminateInstanceInAutoScalingGroupType,
    output: ActivityType,
    errors: [ResourceContentionFault, ScalingActivityInProgressFault],
  }));
/**
 * Deletes the specified scaling policy.
 *
 * Deleting either a step scaling policy or a simple scaling policy deletes the
 * underlying alarm action, but does not delete the alarm, even if it no longer has an
 * associated action.
 *
 * For more information, see Delete a scaling
 * policy in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const deletePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyType,
  output: DeletePolicyResponse,
  errors: [ResourceContentionFault, ServiceLinkedRoleFailure],
}));
/**
 * This API operation is superseded by https://docs.aws.amazon.com/autoscaling/ec2/APIReference/API_AttachTrafficSources.html, which
 * can attach multiple traffic sources types. We recommend using
 * `AttachTrafficSources` to simplify how you manage traffic sources.
 * However, we continue to support `AttachLoadBalancers`. You can use both
 * the original `AttachLoadBalancers` API operation and
 * `AttachTrafficSources` on the same Auto Scaling group.
 *
 * Attaches one or more Classic Load Balancers to the specified Auto Scaling group. Amazon EC2 Auto Scaling registers the
 * running instances with these Classic Load Balancers.
 *
 * To describe the load balancers for an Auto Scaling group, call the DescribeLoadBalancers API.
 * To detach a load balancer from the Auto Scaling group, call the DetachLoadBalancers
 * API.
 *
 * This operation is additive and does not detach existing Classic Load Balancers or
 * target groups from the Auto Scaling group.
 *
 * For more information, see Use Elastic Load Balancing to
 * distribute traffic across the instances in your Auto Scaling group in the
 * *Amazon EC2 Auto Scaling User Guide*.
 */
export const attachLoadBalancers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachLoadBalancersType,
  output: AttachLoadBalancersResultType,
  errors: [
    InstanceRefreshInProgressFault,
    ResourceContentionFault,
    ServiceLinkedRoleFailure,
  ],
}));
/**
 * Attaches one or more traffic sources to the specified Auto Scaling group.
 *
 * You can use any of the following as traffic sources for an Auto Scaling group:
 *
 * - Application Load Balancer
 *
 * - Classic Load Balancer
 *
 * - Gateway Load Balancer
 *
 * - Network Load Balancer
 *
 * - VPC Lattice
 *
 * This operation is additive and does not detach existing traffic sources from the Auto Scaling
 * group.
 *
 * After the operation completes, use the DescribeTrafficSources API to
 * return details about the state of the attachments between traffic sources and your Auto Scaling
 * group. To detach a traffic source from the Auto Scaling group, call the
 * DetachTrafficSources API.
 */
export const attachTrafficSources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AttachTrafficSourcesType,
    output: AttachTrafficSourcesResultType,
    errors: [
      InstanceRefreshInProgressFault,
      ResourceContentionFault,
      ServiceLinkedRoleFailure,
    ],
  }),
);
/**
 * **We strongly recommend that all Auto Scaling groups use launch templates to ensure full functionality for Amazon EC2 Auto Scaling and Amazon EC2.**
 *
 * Updates the configuration for the specified Auto Scaling group.
 *
 * To update an Auto Scaling group, specify the name of the group and the property that you want
 * to change. Any properties that you don't specify are not changed by this update request.
 * The new settings take effect on any scaling activities after this call returns.
 *
 * If you associate a new launch configuration or template with an Auto Scaling group, all new
 * instances will get the updated configuration. Existing instances continue to run with
 * the configuration that they were originally launched with. When you update a group to
 * specify a mixed instances policy instead of a launch configuration or template, existing
 * instances may be replaced to match the new purchasing options that you specified in the
 * policy. For example, if the group currently has 100% On-Demand capacity and the policy
 * specifies 50% Spot capacity, this means that half of your instances will be gradually
 * terminated and relaunched as Spot Instances. When replacing instances, Amazon EC2 Auto Scaling launches
 * new instances before terminating the old ones, so that updating your group does not
 * compromise the performance or availability of your application.
 *
 * Note the following about changing `DesiredCapacity`, `MaxSize`,
 * or `MinSize`:
 *
 * - If a scale-in activity occurs as a result of a new
 * `DesiredCapacity` value that is lower than the current size of
 * the group, the Auto Scaling group uses its termination policy to determine which
 * instances to terminate.
 *
 * - If you specify a new value for `MinSize` without specifying a value
 * for `DesiredCapacity`, and the new `MinSize` is larger
 * than the current size of the group, this sets the group's
 * `DesiredCapacity` to the new `MinSize` value.
 *
 * - If you specify a new value for `MaxSize` without specifying a value
 * for `DesiredCapacity`, and the new `MaxSize` is smaller
 * than the current size of the group, this sets the group's
 * `DesiredCapacity` to the new `MaxSize` value.
 *
 * To see which properties have been set, call the DescribeAutoScalingGroups API.
 * To view the scaling policies for an Auto Scaling
 * group, call the DescribePolicies API. If the group has scaling
 * policies, you can update them by calling the PutScalingPolicy API.
 */
export const updateAutoScalingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAutoScalingGroupType,
    output: UpdateAutoScalingGroupResponse,
    errors: [
      ResourceContentionFault,
      ScalingActivityInProgressFault,
      ServiceLinkedRoleFailure,
    ],
  }),
);
/**
 * This API operation is superseded by AttachTrafficSources, which
 * can attach multiple traffic sources types. We recommend using
 * `AttachTrafficSources` to simplify how you manage traffic sources.
 * However, we continue to support `AttachLoadBalancerTargetGroups`. You can
 * use both the original `AttachLoadBalancerTargetGroups` API operation and
 * `AttachTrafficSources` on the same Auto Scaling group.
 *
 * Attaches one or more target groups to the specified Auto Scaling group.
 *
 * This operation is used with the following load balancer types:
 *
 * - Application Load Balancer - Operates at the application layer (layer 7) and supports HTTP and
 * HTTPS.
 *
 * - Network Load Balancer - Operates at the transport layer (layer 4) and supports TCP, TLS, and
 * UDP.
 *
 * - Gateway Load Balancer - Operates at the network layer (layer 3).
 *
 * To describe the target groups for an Auto Scaling group, call the DescribeLoadBalancerTargetGroups
 * API. To detach the target group from
 * the Auto Scaling group, call the DetachLoadBalancerTargetGroups API.
 *
 * This operation is additive and does not detach existing target groups or Classic Load
 * Balancers from the Auto Scaling group.
 *
 * For more information, see Use Elastic Load Balancing to
 * distribute traffic across the instances in your Auto Scaling group in the
 * *Amazon EC2 Auto Scaling User Guide*.
 */
export const attachLoadBalancerTargetGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: AttachLoadBalancerTargetGroupsType,
    output: AttachLoadBalancerTargetGroupsResultType,
    errors: [
      InstanceRefreshInProgressFault,
      ResourceContentionFault,
      ServiceLinkedRoleFailure,
    ],
  }));
/**
 * Configures an Auto Scaling group to send notifications when specified events take place.
 * Subscribers to the specified topic can have messages delivered to an endpoint such as a
 * web server or an email address.
 *
 * This configuration overwrites any existing configuration.
 *
 * For more information, see Amazon SNS
 * notification options for Amazon EC2 Auto Scaling in the
 * *Amazon EC2 Auto Scaling User Guide*.
 *
 * If you exceed your maximum limit of SNS topics, which is 10 per Auto Scaling group, the call
 * fails.
 */
export const putNotificationConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutNotificationConfigurationType,
    output: PutNotificationConfigurationResponse,
    errors: [
      LimitExceededFault,
      ResourceContentionFault,
      ServiceLinkedRoleFailure,
    ],
  }));
/**
 * Deletes one or more scheduled actions for the specified Auto Scaling group.
 */
export const batchDeleteScheduledAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteScheduledActionType,
    output: BatchDeleteScheduledActionAnswer,
    errors: [ResourceContentionFault],
  }),
);
/**
 * Creates or updates one or more scheduled scaling actions for an Auto Scaling group.
 */
export const batchPutScheduledUpdateGroupAction =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchPutScheduledUpdateGroupActionType,
    output: BatchPutScheduledUpdateGroupActionAnswer,
    errors: [AlreadyExistsFault, LimitExceededFault, ResourceContentionFault],
  }));
/**
 * Cancels an instance refresh or rollback that is in progress. If an instance refresh or
 * rollback is not in progress, an `ActiveInstanceRefreshNotFound` error
 * occurs.
 *
 * This operation is part of the instance refresh
 * feature in Amazon EC2 Auto Scaling, which helps you update instances in your Auto Scaling group
 * after you make configuration changes.
 *
 * When you cancel an instance refresh, this does not roll back any changes that it made.
 * Use the RollbackInstanceRefresh API to roll back instead.
 */
export const cancelInstanceRefresh = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelInstanceRefreshType,
    output: CancelInstanceRefreshAnswer,
    errors: [
      ActiveInstanceRefreshNotFoundFault,
      LimitExceededFault,
      ResourceContentionFault,
    ],
  }),
);
/**
 * Creates a launch configuration.
 *
 * If you exceed your maximum limit of launch configurations, the call fails. To query
 * this limit, call the DescribeAccountLimits API.
 * For information about updating this limit, see Quotas for
 * Amazon EC2 Auto Scaling in the *Amazon EC2 Auto Scaling User Guide*.
 *
 * For more information, see Launch
 * configurations in the *Amazon EC2 Auto Scaling User Guide*.
 *
 * Amazon EC2 Auto Scaling configures instances launched as part of an Auto Scaling group using either a
 * launch template or a launch configuration. We strongly recommend that you do not use
 * launch configurations. They do not provide full functionality for Amazon EC2 Auto Scaling or Amazon EC2.
 * For information about using launch templates, see Launch templates in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const createLaunchConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLaunchConfigurationType,
    output: CreateLaunchConfigurationResponse,
    errors: [AlreadyExistsFault, LimitExceededFault, ResourceContentionFault],
  }),
);
/**
 * Gets information about the lifecycle hooks for the specified Auto Scaling group.
 */
export const describeLifecycleHooks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLifecycleHooksType,
    output: DescribeLifecycleHooksAnswer,
    errors: [ResourceContentionFault],
  }),
);
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
 *
 * For more information, see Predictive
 * scaling for Amazon EC2 Auto Scaling in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const getPredictiveScalingForecast =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetPredictiveScalingForecastType,
    output: GetPredictiveScalingForecastAnswer,
    errors: [ResourceContentionFault],
  }));
/**
 * Gets information about the Auto Scaling instances in the account and Region.
 */
export const describeAutoScalingInstances =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeAutoScalingInstancesType,
    output: AutoScalingInstancesType,
    errors: [InvalidNextToken, ResourceContentionFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AutoScalingInstances",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Gets information about the scaling policies in the account and Region.
 */
export const describePolicies = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribePoliciesType,
    output: PoliciesType,
    errors: [
      InvalidNextToken,
      ResourceContentionFault,
      ServiceLinkedRoleFailure,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ScalingPolicies",
      pageSize: "MaxRecords",
    } as const,
  }),
);
/**
 * Launches a specified number of instances in an Auto Scaling group. Returns instance IDs and
 * other details if launch is successful or error details if launch is unsuccessful.
 */
export const launchInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: LaunchInstancesRequest,
  output: LaunchInstancesResult,
  errors: [IdempotentParameterMismatchError, ResourceContentionFault],
}));
/**
 * Starts an instance refresh.
 *
 * This operation is part of the instance refresh
 * feature in Amazon EC2 Auto Scaling, which helps you update instances in your Auto Scaling group.
 * This feature is helpful, for example, when you have a new AMI or a new user data script.
 * You just need to create a new launch template that specifies the new AMI or user data
 * script. Then start an instance refresh to immediately begin the process of updating
 * instances in the group.
 *
 * If successful, the request's response contains a unique ID that you can use to track
 * the progress of the instance refresh. To query its status, call the DescribeInstanceRefreshes API.
 * To describe the instance refreshes that
 * have already run, call the DescribeInstanceRefreshes API. To cancel an
 * instance refresh that is in progress, use the CancelInstanceRefresh
 * API.
 *
 * An instance refresh might fail for several reasons, such as EC2 launch failures,
 * misconfigured health checks, or not ignoring or allowing the termination of instances
 * that are in `Standby` state or protected from scale in. You can monitor for
 * failed EC2 launches using the scaling activities. To find the scaling activities, call
 * the DescribeScalingActivities API.
 *
 * If you enable auto rollback, your Auto Scaling group will be rolled back automatically when
 * the instance refresh fails. You can enable this feature before starting an instance
 * refresh by specifying the `AutoRollback` property in the instance refresh
 * preferences. Otherwise, to roll back an instance refresh before it finishes, use the
 * RollbackInstanceRefresh API.
 */
export const startInstanceRefresh = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartInstanceRefreshType,
    output: StartInstanceRefreshAnswer,
    errors: [
      InstanceRefreshInProgressFault,
      LimitExceededFault,
      ResourceContentionFault,
    ],
  }),
);
/**
 * Cancels an instance refresh that is in progress and rolls back any changes that it
 * made. Amazon EC2 Auto Scaling replaces any instances that were replaced during the instance refresh.
 * This restores your Auto Scaling group to the configuration that it was using before the start of
 * the instance refresh.
 *
 * This operation is part of the instance refresh
 * feature in Amazon EC2 Auto Scaling, which helps you update instances in your Auto Scaling group
 * after you make configuration changes.
 *
 * A rollback is not supported in the following situations:
 *
 * - There is no desired configuration specified for the instance refresh.
 *
 * - The Auto Scaling group has a launch template that uses an Amazon Web Services Systems Manager parameter instead
 * of an AMI ID for the `ImageId` property.
 *
 * - The Auto Scaling group uses the launch template's `$Latest` or
 * `$Default` version.
 *
 * When you receive a successful response from this operation, Amazon EC2 Auto Scaling immediately
 * begins replacing instances. You can check the status of this operation through the
 * DescribeInstanceRefreshes API operation.
 */
export const rollbackInstanceRefresh = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RollbackInstanceRefreshType,
    output: RollbackInstanceRefreshAnswer,
    errors: [
      ActiveInstanceRefreshNotFoundFault,
      IrreversibleInstanceRefreshFault,
      LimitExceededFault,
      ResourceContentionFault,
    ],
  }),
);
/**
 * Gets information about the launch configurations in the account and Region.
 */
export const describeLaunchConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: LaunchConfigurationNamesType,
    output: LaunchConfigurationsType,
    errors: [InvalidNextToken, ResourceContentionFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "LaunchConfigurations",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * This API operation is superseded by DescribeTrafficSources,
 * which can describe multiple traffic sources types. We recommend using
 * `DescribeTrafficSources` to simplify how you manage traffic sources.
 * However, we continue to support `DescribeLoadBalancers`. You can use both
 * the original `DescribeLoadBalancers` API operation and
 * `DescribeTrafficSources` on the same Auto Scaling group.
 *
 * Gets information about the load balancers for the specified Auto Scaling group.
 *
 * This operation describes only Classic Load Balancers. If you have Application Load Balancers, Network Load Balancers, or Gateway Load Balancers, use the
 * DescribeLoadBalancerTargetGroups API instead.
 *
 * To determine the attachment status of the load balancer, use the `State`
 * element in the response. When you attach a load balancer to an Auto Scaling group, the initial
 * `State` value is `Adding`. The state transitions to
 * `Added` after all Auto Scaling instances are registered with the load balancer.
 * If Elastic Load Balancing health checks are enabled for the Auto Scaling group, the state transitions to
 * `InService` after at least one Auto Scaling instance passes the health check.
 * When the load balancer is in the `InService` state, Amazon EC2 Auto Scaling can terminate
 * and replace any instances that are reported as unhealthy. If no registered instances
 * pass the health checks, the load balancer doesn't enter the `InService`
 * state.
 *
 * Load balancers also have an `InService` state if you attach them in the
 * CreateAutoScalingGroup API call. If your load balancer state is
 * `InService`, but it is not working properly, check the scaling activities
 * by calling DescribeScalingActivities and take any corrective actions
 * necessary.
 *
 * For help with failed health checks, see Troubleshooting Amazon EC2 Auto Scaling:
 * Health checks in the *Amazon EC2 Auto Scaling User Guide*. For more
 * information, see Use Elastic Load Balancing to
 * distribute traffic across the instances in your Auto Scaling group in the
 * *Amazon EC2 Auto Scaling User Guide*.
 */
export const describeLoadBalancers =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeLoadBalancersRequest,
    output: DescribeLoadBalancersResponse,
    errors: [InvalidNextToken, ResourceContentionFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * This API operation is superseded by DescribeTrafficSources,
 * which can describe multiple traffic sources types. We recommend using
 * `DetachTrafficSources` to simplify how you manage traffic sources.
 * However, we continue to support `DescribeLoadBalancerTargetGroups`. You
 * can use both the original `DescribeLoadBalancerTargetGroups` API
 * operation and `DescribeTrafficSources` on the same Auto Scaling group.
 *
 * Gets information about the Elastic Load Balancing target groups for the specified Auto Scaling group.
 *
 * To determine the attachment status of the target group, use the `State`
 * element in the response. When you attach a target group to an Auto Scaling group, the initial
 * `State` value is `Adding`. The state transitions to
 * `Added` after all Auto Scaling instances are registered with the target group. If
 * Elastic Load Balancing health checks are enabled for the Auto Scaling group, the state transitions to
 * `InService` after at least one Auto Scaling instance passes the health check.
 * When the target group is in the `InService` state, Amazon EC2 Auto Scaling can terminate and
 * replace any instances that are reported as unhealthy. If no registered instances pass
 * the health checks, the target group doesn't enter the `InService` state.
 *
 * Target groups also have an `InService` state if you attach them in the
 * CreateAutoScalingGroup API call. If your target group state is
 * `InService`, but it is not working properly, check the scaling activities
 * by calling DescribeScalingActivities and take any corrective actions
 * necessary.
 *
 * For help with failed health checks, see Troubleshooting Amazon EC2 Auto Scaling:
 * Health checks in the *Amazon EC2 Auto Scaling User Guide*. For more
 * information, see Use Elastic Load Balancing to
 * distribute traffic across the instances in your Auto Scaling group in the
 * *Amazon EC2 Auto Scaling User Guide*.
 *
 * You can use this operation to describe target groups that were attached by using
 * AttachLoadBalancerTargetGroups, but not for target groups that
 * were attached by using AttachTrafficSources.
 */
export const describeLoadBalancerTargetGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeLoadBalancerTargetGroupsRequest,
    output: DescribeLoadBalancerTargetGroupsResponse,
    errors: [InvalidNextToken, ResourceContentionFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Gets information about the Amazon SNS notifications that are configured for one or more
 * Auto Scaling groups.
 */
export const describeNotificationConfigurations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeNotificationConfigurationsType,
    output: DescribeNotificationConfigurationsAnswer,
    errors: [InvalidNextToken, ResourceContentionFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "NotificationConfigurations",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Gets information about the scaling activities in the account and Region.
 *
 * When scaling events occur, you see a record of the scaling activity in the scaling
 * activities. For more information, see Verify a scaling
 * activity for an Auto Scaling group in the *Amazon EC2 Auto Scaling User Guide*.
 *
 * If the scaling event succeeds, the value of the `StatusCode` element in the
 * response is `Successful`. If an attempt to launch instances failed, the
 * `StatusCode` value is `Failed` or `Cancelled` and
 * the `StatusMessage` element in the response indicates the cause of the
 * failure. For help interpreting the `StatusMessage`, see Troubleshooting Amazon EC2 Auto Scaling in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const describeScalingActivities =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeScalingActivitiesType,
    output: ActivitiesType,
    errors: [InvalidNextToken, ResourceContentionFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Activities",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Gets information about the scheduled actions that haven't run or that have not reached
 * their end time.
 *
 * To describe the scaling activities for scheduled actions that have already run, call
 * the DescribeScalingActivities API.
 */
export const describeScheduledActions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeScheduledActionsType,
    output: ScheduledActionsType,
    errors: [InvalidNextToken, ResourceContentionFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ScheduledUpdateGroupActions",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Describes the specified tags.
 *
 * You can use filters to limit the results. For example, you can query for the tags for
 * a specific Auto Scaling group. You can specify multiple values for a filter. A tag must match at
 * least one of the specified values for it to be included in the results.
 *
 * You can also specify multiple filters. The result includes information for a
 * particular tag only if it matches all the filters. If there's no match, no special
 * message is returned.
 *
 * For more information, see Tag Auto Scaling groups and
 * instances in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const describeTags = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeTagsType,
    output: TagsType,
    errors: [InvalidNextToken, ResourceContentionFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Tags",
      pageSize: "MaxRecords",
    } as const,
  }),
);
/**
 * Gets information about the traffic sources for the specified Auto Scaling group.
 *
 * You can optionally provide a traffic source type. If you provide a traffic source
 * type, then the results only include that traffic source type.
 *
 * If you do not provide a traffic source type, then the results include all the traffic
 * sources for the specified Auto Scaling group.
 */
export const describeTrafficSources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeTrafficSourcesRequest,
    output: DescribeTrafficSourcesResponse,
    errors: [InvalidNextToken, ResourceContentionFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Gets information about a warm pool and its instances.
 *
 * For more information, see Warm pools for
 * Amazon EC2 Auto Scaling in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const describeWarmPool = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeWarmPoolType,
    output: DescribeWarmPoolAnswer,
    errors: [InvalidNextToken, LimitExceededFault, ResourceContentionFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Instances",
      pageSize: "MaxRecords",
    } as const,
  }),
);
/**
 * Gets information about the Auto Scaling groups in the account and Region.
 *
 * If you specify Auto Scaling group names, the output includes information for only the
 * specified Auto Scaling groups. If you specify filters, the output includes information for only
 * those Auto Scaling groups that meet the filter criteria. If you do not specify group names or
 * filters, the output includes information for all Auto Scaling groups.
 *
 * This operation also returns information about instances in Auto Scaling groups. To retrieve
 * information about the instances in a warm pool, you must call the
 * DescribeWarmPool API.
 */
export const describeAutoScalingGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: AutoScalingGroupNamesType,
    output: AutoScalingGroupsType,
    errors: [InvalidNextToken, ResourceContentionFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "AutoScalingGroups",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Gets information about the instance refreshes for the specified Auto Scaling group from the
 * previous six weeks.
 *
 * This operation is part of the instance refresh
 * feature in Amazon EC2 Auto Scaling, which helps you update instances in your Auto Scaling group
 * after you make configuration changes.
 *
 * To help you determine the status of an instance refresh, Amazon EC2 Auto Scaling returns information
 * about the instance refreshes you previously initiated, including their status, start
 * time, end time, the percentage of the instance refresh that is complete, and the number
 * of instances remaining to update before the instance refresh is complete. If a rollback
 * is initiated while an instance refresh is in progress, Amazon EC2 Auto Scaling also returns information
 * about the rollback of the instance refresh.
 */
export const describeInstanceRefreshes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeInstanceRefreshesType,
    output: DescribeInstanceRefreshesAnswer,
    errors: [InvalidNextToken, ResourceContentionFault],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxRecords",
    } as const,
  }));
/**
 * Creates or updates a scaling policy for an Auto Scaling group. Scaling policies are used to
 * scale an Auto Scaling group based on configurable metrics. If no policies are defined, the
 * dynamic scaling and predictive scaling features are not used.
 *
 * For more information about using dynamic scaling, see Target tracking
 * scaling policies and Step and simple scaling
 * policies in the *Amazon EC2 Auto Scaling User Guide*.
 *
 * For more information about using predictive scaling, see Predictive
 * scaling for Amazon EC2 Auto Scaling in the *Amazon EC2 Auto Scaling User Guide*.
 *
 * You can view the scaling policies for an Auto Scaling group using the
 * DescribePolicies API call. If you are no longer using a scaling policy,
 * you can delete it by calling the DeletePolicy API.
 */
export const putScalingPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutScalingPolicyType,
  output: PolicyARNType,
  errors: [
    LimitExceededFault,
    ResourceContentionFault,
    ServiceLinkedRoleFailure,
  ],
}));
/**
 * **We strongly recommend using a launch template when calling this operation to ensure full functionality for Amazon EC2 Auto Scaling and Amazon EC2.**
 *
 * Creates an Auto Scaling group with the specified name and attributes.
 *
 * If you exceed your maximum limit of Auto Scaling groups, the call fails. To query this limit,
 * call the DescribeAccountLimits API. For information about updating
 * this limit, see Quotas for
 * Amazon EC2 Auto Scaling in the *Amazon EC2 Auto Scaling User Guide*.
 *
 * If you're new to Amazon EC2 Auto Scaling, see the introductory tutorials in Get started
 * with Amazon EC2 Auto Scaling in the *Amazon EC2 Auto Scaling User Guide*.
 *
 * Every Auto Scaling group has three size properties (`DesiredCapacity`,
 * `MaxSize`, and `MinSize`). Usually, you set these sizes based
 * on a specific number of instances. However, if you configure a mixed instances policy
 * that defines weights for the instance types, you must specify these sizes with the same
 * units that you use for weighting instances.
 */
export const createAutoScalingGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateAutoScalingGroupType,
    output: CreateAutoScalingGroupResponse,
    errors: [
      AlreadyExistsFault,
      LimitExceededFault,
      ResourceContentionFault,
      ServiceLinkedRoleFailure,
    ],
  }),
);
