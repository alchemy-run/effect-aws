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
const ns = T.XmlNamespace("http://autoscaling.amazonaws.com/doc/2011-01-01/");
const svc = T.AwsApiService({
  sdkId: "Auto Scaling",
  serviceShapeName: "AutoScaling_2011_01_01",
});
const auth = T.AwsAuthSigv4({ name: "autoscaling" });
const ver = T.ServiceVersion("2011-01-01");
const proto = T.AwsProtocolsAwsQuery();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://autoscaling-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://autoscaling.${Region}.amazonaws.com`);
            }
            return e(
              `https://autoscaling-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://autoscaling.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://autoscaling.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type XmlStringMaxLen19 = string;
export type XmlStringMaxLen255 = string;
export type XmlStringMaxLen511 = string;
export type AsciiStringMaxLen255 = string;
export type ResourceName = string;
export type LifecycleActionToken = string;
export type LifecycleActionResult = string;
export type AutoScalingGroupMinSize = number;
export type AutoScalingGroupMaxSize = number;
export type AutoScalingGroupDesiredCapacity = number;
export type Cooldown = number;
export type XmlStringMaxLen32 = string;
export type HealthCheckGracePeriod = number;
export type XmlStringMaxLen5000 = string;
export type XmlStringMaxLen1600 = string;
export type MaxInstanceLifetime = number;
export type Context = string;
export type DefaultInstanceWarmup = number;
export type XmlString = string;
export type XmlStringUserData = string;
export type SpotPrice = string;
export type XmlStringMaxLen64 = string;
export type MaxNumberOfAutoScalingGroups = number;
export type MaxNumberOfLaunchConfigurations = number;
export type NumberOfAutoScalingGroups = number;
export type NumberOfLaunchConfigurations = number;
export type MaxRecords = number;
export type MetricScale = number;
export type RequestedCapacity = number;
export type ClientToken = string;
export type LifecycleTransition = string;
export type NotificationTargetResourceName = string;
export type AnyPrintableAsciiStringMaxLen4000 = string;
export type HeartbeatTimeout = number;
export type MinAdjustmentStep = number;
export type MinAdjustmentMagnitude = number;
export type PolicyIncrement = number;
export type EstimatedInstanceWarmup = number;
export type MaxGroupPreparedCapacity = number;
export type WarmPoolMinSize = number;
export type UpdatePlacementGroupParam = string;
export type LaunchTemplateName = string;
export type TagKey = string;
export type TagValue = string;
export type IntPercentResettable = number;
export type IntPercent100To200Resettable = number;
export type InstanceMetadataHttpPutResponseHopLimit = number;
export type PredictiveScalingSchedulingBufferTime = number;
export type PredictiveScalingMaxCapacityBuffer = number;
export type IntPercent = number;
export type RefreshInstanceWarmup = number;
export type NonZeroIntPercent = number;
export type CheckpointDelay = number;
export type IntPercent100To200 = number;
export type BakeTime = number;
export type OnDemandBaseCapacity = number;
export type OnDemandPercentageAboveBaseCapacity = number;
export type SpotInstancePools = number;
export type MixedInstanceSpotPrice = string;
export type BlockDeviceEbsVolumeSize = number;
export type BlockDeviceEbsVolumeType = string;
export type BlockDeviceEbsIops = number;
export type BlockDeviceEbsThroughput = number;
export type XmlStringMaxLen1023 = string;
export type MetricName = string;
export type MetricNamespace = string;
export type MetricUnit = string;
export type MetricGranularityInSeconds = number;
export type InstancesToUpdate = number;
export type GlobalTimeout = number;
export type Progress = number;
export type AutoScalingGroupState = string;
export type ImageId = string;
export type MetricDimensionName = string;
export type MetricDimensionValue = string;
export type XmlStringMaxLen2047 = string;
export type XmlStringMetricLabel = string;
export type ExcludedInstance = string;
export type NullablePositiveInteger = number;
export type AllowedInstanceType = string;
export type XmlStringMetricStat = string;
export type AutoScalingGroupPredictedCapacity = number;
export type WarmPoolSize = number;
export type NullablePositiveDouble = number;

//# Schemas
export interface DescribeAccountLimitsRequest {}
export const DescribeAccountLimitsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAccountLimitsRequest",
}) as any as S.Schema<DescribeAccountLimitsRequest>;
export interface DescribeAdjustmentTypesRequest {}
export const DescribeAdjustmentTypesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAdjustmentTypesRequest",
}) as any as S.Schema<DescribeAdjustmentTypesRequest>;
export interface DescribeAutoScalingNotificationTypesRequest {}
export const DescribeAutoScalingNotificationTypesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAutoScalingNotificationTypesRequest",
}) as any as S.Schema<DescribeAutoScalingNotificationTypesRequest>;
export interface DescribeLifecycleHookTypesRequest {}
export const DescribeLifecycleHookTypesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLifecycleHookTypesRequest",
}) as any as S.Schema<DescribeLifecycleHookTypesRequest>;
export interface DescribeMetricCollectionTypesRequest {}
export const DescribeMetricCollectionTypesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMetricCollectionTypesRequest",
}) as any as S.Schema<DescribeMetricCollectionTypesRequest>;
export interface DescribeScalingProcessTypesRequest {}
export const DescribeScalingProcessTypesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeScalingProcessTypesRequest",
}) as any as S.Schema<DescribeScalingProcessTypesRequest>;
export interface DescribeTerminationPolicyTypesRequest {}
export const DescribeTerminationPolicyTypesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTerminationPolicyTypesRequest",
}) as any as S.Schema<DescribeTerminationPolicyTypesRequest>;
export interface SuspendProcessesResponse {}
export const SuspendProcessesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SuspendProcessesResponse",
}) as any as S.Schema<SuspendProcessesResponse>;
export type InstanceIds = string[];
export const InstanceIds = S.Array(S.String);
export type LoadBalancerNames = string[];
export const LoadBalancerNames = S.Array(S.String);
export type TargetGroupARNs = string[];
export const TargetGroupARNs = S.Array(S.String);
export type ScheduledActionNames = string[];
export const ScheduledActionNames = S.Array(S.String);
export type AvailabilityZones = string[];
export const AvailabilityZones = S.Array(S.String);
export type TerminationPolicies = string[];
export const TerminationPolicies = S.Array(S.String);
export type SecurityGroups = string[];
export const SecurityGroups = S.Array(S.String);
export type ClassicLinkVPCSecurityGroups = string[];
export const ClassicLinkVPCSecurityGroups = S.Array(S.String);
export type AutoScalingGroupNames = string[];
export const AutoScalingGroupNames = S.Array(S.String);
export type AutoScalingNotificationTypes = string[];
export const AutoScalingNotificationTypes = S.Array(S.String);
export type InstanceRefreshIds = string[];
export const InstanceRefreshIds = S.Array(S.String);
export type LaunchConfigurationNames = string[];
export const LaunchConfigurationNames = S.Array(S.String);
export type LifecycleHookNames = string[];
export const LifecycleHookNames = S.Array(S.String);
export type PolicyNames = string[];
export const PolicyNames = S.Array(S.String);
export type PolicyTypes = string[];
export const PolicyTypes = S.Array(S.String);
export type ActivityIds = string[];
export const ActivityIds = S.Array(S.String);
export type Metrics = string[];
export const Metrics = S.Array(S.String);
export type AvailabilityZonesLimit1 = string[];
export const AvailabilityZonesLimit1 = S.Array(S.String);
export type AvailabilityZoneIdsLimit1 = string[];
export const AvailabilityZoneIdsLimit1 = S.Array(S.String);
export type SubnetIdsLimit1 = string[];
export const SubnetIdsLimit1 = S.Array(S.String);
export type ProcessNames = string[];
export const ProcessNames = S.Array(S.String);
export interface AttachInstancesQuery {
  InstanceIds?: InstanceIds;
  AutoScalingGroupName: string;
}
export const AttachInstancesQuery = S.suspend(() =>
  S.Struct({
    InstanceIds: S.optional(InstanceIds),
    AutoScalingGroupName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachInstancesQuery",
}) as any as S.Schema<AttachInstancesQuery>;
export interface AttachInstancesResponse {}
export const AttachInstancesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AttachInstancesResponse",
}) as any as S.Schema<AttachInstancesResponse>;
export interface AttachLoadBalancersType {
  AutoScalingGroupName: string;
  LoadBalancerNames: LoadBalancerNames;
}
export const AttachLoadBalancersType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    LoadBalancerNames: LoadBalancerNames,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachLoadBalancersType",
}) as any as S.Schema<AttachLoadBalancersType>;
export interface AttachLoadBalancersResultType {}
export const AttachLoadBalancersResultType = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AttachLoadBalancersResultType",
}) as any as S.Schema<AttachLoadBalancersResultType>;
export interface AttachLoadBalancerTargetGroupsType {
  AutoScalingGroupName: string;
  TargetGroupARNs: TargetGroupARNs;
}
export const AttachLoadBalancerTargetGroupsType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    TargetGroupARNs: TargetGroupARNs,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachLoadBalancerTargetGroupsType",
}) as any as S.Schema<AttachLoadBalancerTargetGroupsType>;
export interface AttachLoadBalancerTargetGroupsResultType {}
export const AttachLoadBalancerTargetGroupsResultType = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AttachLoadBalancerTargetGroupsResultType",
}) as any as S.Schema<AttachLoadBalancerTargetGroupsResultType>;
export interface BatchDeleteScheduledActionType {
  AutoScalingGroupName: string;
  ScheduledActionNames: ScheduledActionNames;
}
export const BatchDeleteScheduledActionType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    ScheduledActionNames: ScheduledActionNames,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchDeleteScheduledActionType",
}) as any as S.Schema<BatchDeleteScheduledActionType>;
export interface CancelInstanceRefreshType {
  AutoScalingGroupName: string;
  WaitForTransitioningInstances?: boolean;
}
export const CancelInstanceRefreshType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    WaitForTransitioningInstances: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelInstanceRefreshType",
}) as any as S.Schema<CancelInstanceRefreshType>;
export interface CompleteLifecycleActionType {
  LifecycleHookName: string;
  AutoScalingGroupName: string;
  LifecycleActionToken?: string;
  LifecycleActionResult: string;
  InstanceId?: string;
}
export const CompleteLifecycleActionType = S.suspend(() =>
  S.Struct({
    LifecycleHookName: S.String,
    AutoScalingGroupName: S.String,
    LifecycleActionToken: S.optional(S.String),
    LifecycleActionResult: S.String,
    InstanceId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CompleteLifecycleActionType",
}) as any as S.Schema<CompleteLifecycleActionType>;
export interface CompleteLifecycleActionAnswer {}
export const CompleteLifecycleActionAnswer = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CompleteLifecycleActionAnswer",
}) as any as S.Schema<CompleteLifecycleActionAnswer>;
export interface Tag {
  ResourceId?: string;
  ResourceType?: string;
  Key: string;
  Value?: string;
  PropagateAtLaunch?: boolean;
}
export const Tag = S.suspend(() =>
  S.Struct({
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Key: S.String,
    Value: S.optional(S.String),
    PropagateAtLaunch: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreateOrUpdateTagsType {
  Tags: Tags;
}
export const CreateOrUpdateTagsType = S.suspend(() =>
  S.Struct({ Tags: Tags }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateOrUpdateTagsType",
}) as any as S.Schema<CreateOrUpdateTagsType>;
export interface CreateOrUpdateTagsResponse {}
export const CreateOrUpdateTagsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateOrUpdateTagsResponse",
}) as any as S.Schema<CreateOrUpdateTagsResponse>;
export interface DeleteAutoScalingGroupType {
  AutoScalingGroupName: string;
  ForceDelete?: boolean;
}
export const DeleteAutoScalingGroupType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    ForceDelete: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAutoScalingGroupType",
}) as any as S.Schema<DeleteAutoScalingGroupType>;
export interface DeleteAutoScalingGroupResponse {}
export const DeleteAutoScalingGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteAutoScalingGroupResponse",
}) as any as S.Schema<DeleteAutoScalingGroupResponse>;
export interface LaunchConfigurationNameType {
  LaunchConfigurationName: string;
}
export const LaunchConfigurationNameType = S.suspend(() =>
  S.Struct({ LaunchConfigurationName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "LaunchConfigurationNameType",
}) as any as S.Schema<LaunchConfigurationNameType>;
export interface DeleteLaunchConfigurationResponse {}
export const DeleteLaunchConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLaunchConfigurationResponse",
}) as any as S.Schema<DeleteLaunchConfigurationResponse>;
export interface DeleteLifecycleHookType {
  LifecycleHookName: string;
  AutoScalingGroupName: string;
}
export const DeleteLifecycleHookType = S.suspend(() =>
  S.Struct({
    LifecycleHookName: S.String,
    AutoScalingGroupName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLifecycleHookType",
}) as any as S.Schema<DeleteLifecycleHookType>;
export interface DeleteLifecycleHookAnswer {}
export const DeleteLifecycleHookAnswer = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLifecycleHookAnswer",
}) as any as S.Schema<DeleteLifecycleHookAnswer>;
export interface DeleteNotificationConfigurationType {
  AutoScalingGroupName: string;
  TopicARN: string;
}
export const DeleteNotificationConfigurationType = S.suspend(() =>
  S.Struct({ AutoScalingGroupName: S.String, TopicARN: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteNotificationConfigurationType",
}) as any as S.Schema<DeleteNotificationConfigurationType>;
export interface DeleteNotificationConfigurationResponse {}
export const DeleteNotificationConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteNotificationConfigurationResponse",
}) as any as S.Schema<DeleteNotificationConfigurationResponse>;
export interface DeletePolicyType {
  AutoScalingGroupName?: string;
  PolicyName: string;
}
export const DeletePolicyType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.optional(S.String),
    PolicyName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeletePolicyType",
}) as any as S.Schema<DeletePolicyType>;
export interface DeletePolicyResponse {}
export const DeletePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeletePolicyResponse",
}) as any as S.Schema<DeletePolicyResponse>;
export interface DeleteScheduledActionType {
  AutoScalingGroupName: string;
  ScheduledActionName: string;
}
export const DeleteScheduledActionType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    ScheduledActionName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteScheduledActionType",
}) as any as S.Schema<DeleteScheduledActionType>;
export interface DeleteScheduledActionResponse {}
export const DeleteScheduledActionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteScheduledActionResponse",
}) as any as S.Schema<DeleteScheduledActionResponse>;
export interface DeleteTagsType {
  Tags: Tags;
}
export const DeleteTagsType = S.suspend(() =>
  S.Struct({ Tags: Tags }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTagsType",
}) as any as S.Schema<DeleteTagsType>;
export interface DeleteTagsResponse {}
export const DeleteTagsResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteTagsResponse",
}) as any as S.Schema<DeleteTagsResponse>;
export interface DeleteWarmPoolType {
  AutoScalingGroupName: string;
  ForceDelete?: boolean;
}
export const DeleteWarmPoolType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    ForceDelete: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWarmPoolType",
}) as any as S.Schema<DeleteWarmPoolType>;
export interface DeleteWarmPoolAnswer {}
export const DeleteWarmPoolAnswer = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteWarmPoolAnswer",
}) as any as S.Schema<DeleteWarmPoolAnswer>;
export interface DescribeAccountLimitsAnswer {
  MaxNumberOfAutoScalingGroups?: number;
  MaxNumberOfLaunchConfigurations?: number;
  NumberOfAutoScalingGroups?: number;
  NumberOfLaunchConfigurations?: number;
}
export const DescribeAccountLimitsAnswer = S.suspend(() =>
  S.Struct({
    MaxNumberOfAutoScalingGroups: S.optional(S.Number),
    MaxNumberOfLaunchConfigurations: S.optional(S.Number),
    NumberOfAutoScalingGroups: S.optional(S.Number),
    NumberOfLaunchConfigurations: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAccountLimitsAnswer",
}) as any as S.Schema<DescribeAccountLimitsAnswer>;
export interface DescribeAutoScalingInstancesType {
  InstanceIds?: InstanceIds;
  MaxRecords?: number;
  NextToken?: string;
}
export const DescribeAutoScalingInstancesType = S.suspend(() =>
  S.Struct({
    InstanceIds: S.optional(InstanceIds),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAutoScalingInstancesType",
}) as any as S.Schema<DescribeAutoScalingInstancesType>;
export interface DescribeAutoScalingNotificationTypesAnswer {
  AutoScalingNotificationTypes?: AutoScalingNotificationTypes;
}
export const DescribeAutoScalingNotificationTypesAnswer = S.suspend(() =>
  S.Struct({
    AutoScalingNotificationTypes: S.optional(AutoScalingNotificationTypes),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAutoScalingNotificationTypesAnswer",
}) as any as S.Schema<DescribeAutoScalingNotificationTypesAnswer>;
export interface DescribeInstanceRefreshesType {
  AutoScalingGroupName: string;
  InstanceRefreshIds?: InstanceRefreshIds;
  NextToken?: string;
  MaxRecords?: number;
}
export const DescribeInstanceRefreshesType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    InstanceRefreshIds: S.optional(InstanceRefreshIds),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInstanceRefreshesType",
}) as any as S.Schema<DescribeInstanceRefreshesType>;
export interface LaunchConfigurationNamesType {
  LaunchConfigurationNames?: LaunchConfigurationNames;
  NextToken?: string;
  MaxRecords?: number;
}
export const LaunchConfigurationNamesType = S.suspend(() =>
  S.Struct({
    LaunchConfigurationNames: S.optional(LaunchConfigurationNames),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "LaunchConfigurationNamesType",
}) as any as S.Schema<LaunchConfigurationNamesType>;
export interface DescribeLifecycleHooksType {
  AutoScalingGroupName: string;
  LifecycleHookNames?: LifecycleHookNames;
}
export const DescribeLifecycleHooksType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    LifecycleHookNames: S.optional(LifecycleHookNames),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLifecycleHooksType",
}) as any as S.Schema<DescribeLifecycleHooksType>;
export interface DescribeLifecycleHookTypesAnswer {
  LifecycleHookTypes?: AutoScalingNotificationTypes;
}
export const DescribeLifecycleHookTypesAnswer = S.suspend(() =>
  S.Struct({
    LifecycleHookTypes: S.optional(AutoScalingNotificationTypes),
  }).pipe(ns),
).annotations({
  identifier: "DescribeLifecycleHookTypesAnswer",
}) as any as S.Schema<DescribeLifecycleHookTypesAnswer>;
export interface DescribeLoadBalancersRequest {
  AutoScalingGroupName: string;
  NextToken?: string;
  MaxRecords?: number;
}
export const DescribeLoadBalancersRequest = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLoadBalancersRequest",
}) as any as S.Schema<DescribeLoadBalancersRequest>;
export interface DescribeLoadBalancerTargetGroupsRequest {
  AutoScalingGroupName: string;
  NextToken?: string;
  MaxRecords?: number;
}
export const DescribeLoadBalancerTargetGroupsRequest = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLoadBalancerTargetGroupsRequest",
}) as any as S.Schema<DescribeLoadBalancerTargetGroupsRequest>;
export interface DescribeNotificationConfigurationsType {
  AutoScalingGroupNames?: AutoScalingGroupNames;
  NextToken?: string;
  MaxRecords?: number;
}
export const DescribeNotificationConfigurationsType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupNames: S.optional(AutoScalingGroupNames),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeNotificationConfigurationsType",
}) as any as S.Schema<DescribeNotificationConfigurationsType>;
export interface DescribePoliciesType {
  AutoScalingGroupName?: string;
  PolicyNames?: PolicyNames;
  PolicyTypes?: PolicyTypes;
  NextToken?: string;
  MaxRecords?: number;
}
export const DescribePoliciesType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.optional(S.String),
    PolicyNames: S.optional(PolicyNames),
    PolicyTypes: S.optional(PolicyTypes),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribePoliciesType",
}) as any as S.Schema<DescribePoliciesType>;
export interface DescribeScalingActivitiesType {
  ActivityIds?: ActivityIds;
  AutoScalingGroupName?: string;
  IncludeDeletedGroups?: boolean;
  MaxRecords?: number;
  NextToken?: string;
}
export const DescribeScalingActivitiesType = S.suspend(() =>
  S.Struct({
    ActivityIds: S.optional(ActivityIds),
    AutoScalingGroupName: S.optional(S.String),
    IncludeDeletedGroups: S.optional(S.Boolean),
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeScalingActivitiesType",
}) as any as S.Schema<DescribeScalingActivitiesType>;
export interface DescribeScheduledActionsType {
  AutoScalingGroupName?: string;
  ScheduledActionNames?: ScheduledActionNames;
  StartTime?: Date;
  EndTime?: Date;
  NextToken?: string;
  MaxRecords?: number;
}
export const DescribeScheduledActionsType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.optional(S.String),
    ScheduledActionNames: S.optional(ScheduledActionNames),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeScheduledActionsType",
}) as any as S.Schema<DescribeScheduledActionsType>;
export type Values = string[];
export const Values = S.Array(S.String);
export interface Filter {
  Name?: string;
  Values?: Values;
}
export const Filter = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Values: S.optional(Values) }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(Filter);
export interface DescribeTagsType {
  Filters?: Filters;
  NextToken?: string;
  MaxRecords?: number;
}
export const DescribeTagsType = S.suspend(() =>
  S.Struct({
    Filters: S.optional(Filters),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTagsType",
}) as any as S.Schema<DescribeTagsType>;
export interface DescribeTerminationPolicyTypesAnswer {
  TerminationPolicyTypes?: TerminationPolicies;
}
export const DescribeTerminationPolicyTypesAnswer = S.suspend(() =>
  S.Struct({ TerminationPolicyTypes: S.optional(TerminationPolicies) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeTerminationPolicyTypesAnswer",
}) as any as S.Schema<DescribeTerminationPolicyTypesAnswer>;
export interface DescribeTrafficSourcesRequest {
  AutoScalingGroupName: string;
  TrafficSourceType?: string;
  NextToken?: string;
  MaxRecords?: number;
}
export const DescribeTrafficSourcesRequest = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    TrafficSourceType: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTrafficSourcesRequest",
}) as any as S.Schema<DescribeTrafficSourcesRequest>;
export interface DescribeWarmPoolType {
  AutoScalingGroupName: string;
  MaxRecords?: number;
  NextToken?: string;
}
export const DescribeWarmPoolType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    MaxRecords: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeWarmPoolType",
}) as any as S.Schema<DescribeWarmPoolType>;
export interface DetachInstancesQuery {
  InstanceIds?: InstanceIds;
  AutoScalingGroupName: string;
  ShouldDecrementDesiredCapacity: boolean;
}
export const DetachInstancesQuery = S.suspend(() =>
  S.Struct({
    InstanceIds: S.optional(InstanceIds),
    AutoScalingGroupName: S.String,
    ShouldDecrementDesiredCapacity: S.Boolean,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetachInstancesQuery",
}) as any as S.Schema<DetachInstancesQuery>;
export interface DetachLoadBalancersType {
  AutoScalingGroupName: string;
  LoadBalancerNames: LoadBalancerNames;
}
export const DetachLoadBalancersType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    LoadBalancerNames: LoadBalancerNames,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetachLoadBalancersType",
}) as any as S.Schema<DetachLoadBalancersType>;
export interface DetachLoadBalancersResultType {}
export const DetachLoadBalancersResultType = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DetachLoadBalancersResultType",
}) as any as S.Schema<DetachLoadBalancersResultType>;
export interface DetachLoadBalancerTargetGroupsType {
  AutoScalingGroupName: string;
  TargetGroupARNs: TargetGroupARNs;
}
export const DetachLoadBalancerTargetGroupsType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    TargetGroupARNs: TargetGroupARNs,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetachLoadBalancerTargetGroupsType",
}) as any as S.Schema<DetachLoadBalancerTargetGroupsType>;
export interface DetachLoadBalancerTargetGroupsResultType {}
export const DetachLoadBalancerTargetGroupsResultType = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DetachLoadBalancerTargetGroupsResultType",
}) as any as S.Schema<DetachLoadBalancerTargetGroupsResultType>;
export interface TrafficSourceIdentifier {
  Identifier: string;
  Type?: string;
}
export const TrafficSourceIdentifier = S.suspend(() =>
  S.Struct({ Identifier: S.String, Type: S.optional(S.String) }),
).annotations({
  identifier: "TrafficSourceIdentifier",
}) as any as S.Schema<TrafficSourceIdentifier>;
export type TrafficSources = TrafficSourceIdentifier[];
export const TrafficSources = S.Array(TrafficSourceIdentifier);
export interface DetachTrafficSourcesType {
  AutoScalingGroupName: string;
  TrafficSources: TrafficSources;
}
export const DetachTrafficSourcesType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    TrafficSources: TrafficSources,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DetachTrafficSourcesType",
}) as any as S.Schema<DetachTrafficSourcesType>;
export interface DetachTrafficSourcesResultType {}
export const DetachTrafficSourcesResultType = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DetachTrafficSourcesResultType",
}) as any as S.Schema<DetachTrafficSourcesResultType>;
export interface DisableMetricsCollectionQuery {
  AutoScalingGroupName: string;
  Metrics?: Metrics;
}
export const DisableMetricsCollectionQuery = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    Metrics: S.optional(Metrics),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisableMetricsCollectionQuery",
}) as any as S.Schema<DisableMetricsCollectionQuery>;
export interface DisableMetricsCollectionResponse {}
export const DisableMetricsCollectionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableMetricsCollectionResponse",
}) as any as S.Schema<DisableMetricsCollectionResponse>;
export interface EnableMetricsCollectionQuery {
  AutoScalingGroupName: string;
  Metrics?: Metrics;
  Granularity: string;
}
export const EnableMetricsCollectionQuery = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    Metrics: S.optional(Metrics),
    Granularity: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnableMetricsCollectionQuery",
}) as any as S.Schema<EnableMetricsCollectionQuery>;
export interface EnableMetricsCollectionResponse {}
export const EnableMetricsCollectionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableMetricsCollectionResponse",
}) as any as S.Schema<EnableMetricsCollectionResponse>;
export interface EnterStandbyQuery {
  InstanceIds?: InstanceIds;
  AutoScalingGroupName: string;
  ShouldDecrementDesiredCapacity: boolean;
}
export const EnterStandbyQuery = S.suspend(() =>
  S.Struct({
    InstanceIds: S.optional(InstanceIds),
    AutoScalingGroupName: S.String,
    ShouldDecrementDesiredCapacity: S.Boolean,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "EnterStandbyQuery",
}) as any as S.Schema<EnterStandbyQuery>;
export interface ExecutePolicyType {
  AutoScalingGroupName?: string;
  PolicyName: string;
  HonorCooldown?: boolean;
  MetricValue?: number;
  BreachThreshold?: number;
}
export const ExecutePolicyType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.optional(S.String),
    PolicyName: S.String,
    HonorCooldown: S.optional(S.Boolean),
    MetricValue: S.optional(S.Number),
    BreachThreshold: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExecutePolicyType",
}) as any as S.Schema<ExecutePolicyType>;
export interface ExecutePolicyResponse {}
export const ExecutePolicyResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ExecutePolicyResponse",
}) as any as S.Schema<ExecutePolicyResponse>;
export interface ExitStandbyQuery {
  InstanceIds?: InstanceIds;
  AutoScalingGroupName: string;
}
export const ExitStandbyQuery = S.suspend(() =>
  S.Struct({
    InstanceIds: S.optional(InstanceIds),
    AutoScalingGroupName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExitStandbyQuery",
}) as any as S.Schema<ExitStandbyQuery>;
export interface GetPredictiveScalingForecastType {
  AutoScalingGroupName: string;
  PolicyName: string;
  StartTime: Date;
  EndTime: Date;
}
export const GetPredictiveScalingForecastType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    PolicyName: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("date-time")),
    EndTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPredictiveScalingForecastType",
}) as any as S.Schema<GetPredictiveScalingForecastType>;
export interface LaunchInstancesRequest {
  AutoScalingGroupName: string;
  RequestedCapacity: number;
  ClientToken: string;
  AvailabilityZones?: AvailabilityZonesLimit1;
  AvailabilityZoneIds?: AvailabilityZoneIdsLimit1;
  SubnetIds?: SubnetIdsLimit1;
  RetryStrategy?: string;
}
export const LaunchInstancesRequest = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    RequestedCapacity: S.Number,
    ClientToken: S.String,
    AvailabilityZones: S.optional(AvailabilityZonesLimit1),
    AvailabilityZoneIds: S.optional(AvailabilityZoneIdsLimit1),
    SubnetIds: S.optional(SubnetIdsLimit1),
    RetryStrategy: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "LaunchInstancesRequest",
}) as any as S.Schema<LaunchInstancesRequest>;
export interface PutLifecycleHookType {
  LifecycleHookName: string;
  AutoScalingGroupName: string;
  LifecycleTransition?: string;
  RoleARN?: string;
  NotificationTargetARN?: string;
  NotificationMetadata?: string;
  HeartbeatTimeout?: number;
  DefaultResult?: string;
}
export const PutLifecycleHookType = S.suspend(() =>
  S.Struct({
    LifecycleHookName: S.String,
    AutoScalingGroupName: S.String,
    LifecycleTransition: S.optional(S.String),
    RoleARN: S.optional(S.String),
    NotificationTargetARN: S.optional(S.String),
    NotificationMetadata: S.optional(S.String),
    HeartbeatTimeout: S.optional(S.Number),
    DefaultResult: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutLifecycleHookType",
}) as any as S.Schema<PutLifecycleHookType>;
export interface PutLifecycleHookAnswer {}
export const PutLifecycleHookAnswer = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutLifecycleHookAnswer",
}) as any as S.Schema<PutLifecycleHookAnswer>;
export interface PutNotificationConfigurationType {
  AutoScalingGroupName: string;
  TopicARN: string;
  NotificationTypes: AutoScalingNotificationTypes;
}
export const PutNotificationConfigurationType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    TopicARN: S.String,
    NotificationTypes: AutoScalingNotificationTypes,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutNotificationConfigurationType",
}) as any as S.Schema<PutNotificationConfigurationType>;
export interface PutNotificationConfigurationResponse {}
export const PutNotificationConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutNotificationConfigurationResponse",
}) as any as S.Schema<PutNotificationConfigurationResponse>;
export interface PutScheduledUpdateGroupActionType {
  AutoScalingGroupName: string;
  ScheduledActionName: string;
  Time?: Date;
  StartTime?: Date;
  EndTime?: Date;
  Recurrence?: string;
  MinSize?: number;
  MaxSize?: number;
  DesiredCapacity?: number;
  TimeZone?: string;
}
export const PutScheduledUpdateGroupActionType = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutScheduledUpdateGroupActionType",
}) as any as S.Schema<PutScheduledUpdateGroupActionType>;
export interface PutScheduledUpdateGroupActionResponse {}
export const PutScheduledUpdateGroupActionResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutScheduledUpdateGroupActionResponse",
}) as any as S.Schema<PutScheduledUpdateGroupActionResponse>;
export interface RecordLifecycleActionHeartbeatType {
  LifecycleHookName: string;
  AutoScalingGroupName: string;
  LifecycleActionToken?: string;
  InstanceId?: string;
}
export const RecordLifecycleActionHeartbeatType = S.suspend(() =>
  S.Struct({
    LifecycleHookName: S.String,
    AutoScalingGroupName: S.String,
    LifecycleActionToken: S.optional(S.String),
    InstanceId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RecordLifecycleActionHeartbeatType",
}) as any as S.Schema<RecordLifecycleActionHeartbeatType>;
export interface RecordLifecycleActionHeartbeatAnswer {}
export const RecordLifecycleActionHeartbeatAnswer = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RecordLifecycleActionHeartbeatAnswer",
}) as any as S.Schema<RecordLifecycleActionHeartbeatAnswer>;
export interface ScalingProcessQuery {
  AutoScalingGroupName: string;
  ScalingProcesses?: ProcessNames;
}
export const ScalingProcessQuery = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    ScalingProcesses: S.optional(ProcessNames),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ScalingProcessQuery",
}) as any as S.Schema<ScalingProcessQuery>;
export interface ResumeProcessesResponse {}
export const ResumeProcessesResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ResumeProcessesResponse",
}) as any as S.Schema<ResumeProcessesResponse>;
export interface RollbackInstanceRefreshType {
  AutoScalingGroupName: string;
}
export const RollbackInstanceRefreshType = S.suspend(() =>
  S.Struct({ AutoScalingGroupName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RollbackInstanceRefreshType",
}) as any as S.Schema<RollbackInstanceRefreshType>;
export interface SetDesiredCapacityType {
  AutoScalingGroupName: string;
  DesiredCapacity: number;
  HonorCooldown?: boolean;
}
export const SetDesiredCapacityType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    DesiredCapacity: S.Number,
    HonorCooldown: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetDesiredCapacityType",
}) as any as S.Schema<SetDesiredCapacityType>;
export interface SetDesiredCapacityResponse {}
export const SetDesiredCapacityResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetDesiredCapacityResponse",
}) as any as S.Schema<SetDesiredCapacityResponse>;
export interface SetInstanceHealthQuery {
  InstanceId: string;
  HealthStatus: string;
  ShouldRespectGracePeriod?: boolean;
}
export const SetInstanceHealthQuery = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    HealthStatus: S.String,
    ShouldRespectGracePeriod: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetInstanceHealthQuery",
}) as any as S.Schema<SetInstanceHealthQuery>;
export interface SetInstanceHealthResponse {}
export const SetInstanceHealthResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetInstanceHealthResponse",
}) as any as S.Schema<SetInstanceHealthResponse>;
export interface SetInstanceProtectionQuery {
  InstanceIds: InstanceIds;
  AutoScalingGroupName: string;
  ProtectedFromScaleIn: boolean;
}
export const SetInstanceProtectionQuery = S.suspend(() =>
  S.Struct({
    InstanceIds: InstanceIds,
    AutoScalingGroupName: S.String,
    ProtectedFromScaleIn: S.Boolean,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SetInstanceProtectionQuery",
}) as any as S.Schema<SetInstanceProtectionQuery>;
export interface SetInstanceProtectionAnswer {}
export const SetInstanceProtectionAnswer = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "SetInstanceProtectionAnswer",
}) as any as S.Schema<SetInstanceProtectionAnswer>;
export interface TerminateInstanceInAutoScalingGroupType {
  InstanceId: string;
  ShouldDecrementDesiredCapacity: boolean;
}
export const TerminateInstanceInAutoScalingGroupType = S.suspend(() =>
  S.Struct({
    InstanceId: S.String,
    ShouldDecrementDesiredCapacity: S.Boolean,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TerminateInstanceInAutoScalingGroupType",
}) as any as S.Schema<TerminateInstanceInAutoScalingGroupType>;
export interface LaunchTemplateSpecification {
  LaunchTemplateId?: string;
  LaunchTemplateName?: string;
  Version?: string;
}
export const LaunchTemplateSpecification = S.suspend(() =>
  S.Struct({
    LaunchTemplateId: S.optional(S.String),
    LaunchTemplateName: S.optional(S.String),
    Version: S.optional(S.String),
  }),
).annotations({
  identifier: "LaunchTemplateSpecification",
}) as any as S.Schema<LaunchTemplateSpecification>;
export interface VCpuCountRequest {
  Min: number;
  Max?: number;
}
export const VCpuCountRequest = S.suspend(() =>
  S.Struct({ Min: S.Number, Max: S.optional(S.Number) }),
).annotations({
  identifier: "VCpuCountRequest",
}) as any as S.Schema<VCpuCountRequest>;
export interface MemoryMiBRequest {
  Min: number;
  Max?: number;
}
export const MemoryMiBRequest = S.suspend(() =>
  S.Struct({ Min: S.Number, Max: S.optional(S.Number) }),
).annotations({
  identifier: "MemoryMiBRequest",
}) as any as S.Schema<MemoryMiBRequest>;
export type CpuManufacturers = string[];
export const CpuManufacturers = S.Array(S.String);
export interface MemoryGiBPerVCpuRequest {
  Min?: number;
  Max?: number;
}
export const MemoryGiBPerVCpuRequest = S.suspend(() =>
  S.Struct({ Min: S.optional(S.Number), Max: S.optional(S.Number) }),
).annotations({
  identifier: "MemoryGiBPerVCpuRequest",
}) as any as S.Schema<MemoryGiBPerVCpuRequest>;
export type ExcludedInstanceTypes = string[];
export const ExcludedInstanceTypes = S.Array(S.String);
export type InstanceGenerations = string[];
export const InstanceGenerations = S.Array(S.String);
export interface NetworkInterfaceCountRequest {
  Min?: number;
  Max?: number;
}
export const NetworkInterfaceCountRequest = S.suspend(() =>
  S.Struct({ Min: S.optional(S.Number), Max: S.optional(S.Number) }),
).annotations({
  identifier: "NetworkInterfaceCountRequest",
}) as any as S.Schema<NetworkInterfaceCountRequest>;
export type LocalStorageTypes = string[];
export const LocalStorageTypes = S.Array(S.String);
export interface TotalLocalStorageGBRequest {
  Min?: number;
  Max?: number;
}
export const TotalLocalStorageGBRequest = S.suspend(() =>
  S.Struct({ Min: S.optional(S.Number), Max: S.optional(S.Number) }),
).annotations({
  identifier: "TotalLocalStorageGBRequest",
}) as any as S.Schema<TotalLocalStorageGBRequest>;
export interface BaselineEbsBandwidthMbpsRequest {
  Min?: number;
  Max?: number;
}
export const BaselineEbsBandwidthMbpsRequest = S.suspend(() =>
  S.Struct({ Min: S.optional(S.Number), Max: S.optional(S.Number) }),
).annotations({
  identifier: "BaselineEbsBandwidthMbpsRequest",
}) as any as S.Schema<BaselineEbsBandwidthMbpsRequest>;
export type AcceleratorTypes = string[];
export const AcceleratorTypes = S.Array(S.String);
export interface AcceleratorCountRequest {
  Min?: number;
  Max?: number;
}
export const AcceleratorCountRequest = S.suspend(() =>
  S.Struct({ Min: S.optional(S.Number), Max: S.optional(S.Number) }),
).annotations({
  identifier: "AcceleratorCountRequest",
}) as any as S.Schema<AcceleratorCountRequest>;
export type AcceleratorManufacturers = string[];
export const AcceleratorManufacturers = S.Array(S.String);
export type AcceleratorNames = string[];
export const AcceleratorNames = S.Array(S.String);
export interface AcceleratorTotalMemoryMiBRequest {
  Min?: number;
  Max?: number;
}
export const AcceleratorTotalMemoryMiBRequest = S.suspend(() =>
  S.Struct({ Min: S.optional(S.Number), Max: S.optional(S.Number) }),
).annotations({
  identifier: "AcceleratorTotalMemoryMiBRequest",
}) as any as S.Schema<AcceleratorTotalMemoryMiBRequest>;
export interface NetworkBandwidthGbpsRequest {
  Min?: number;
  Max?: number;
}
export const NetworkBandwidthGbpsRequest = S.suspend(() =>
  S.Struct({ Min: S.optional(S.Number), Max: S.optional(S.Number) }),
).annotations({
  identifier: "NetworkBandwidthGbpsRequest",
}) as any as S.Schema<NetworkBandwidthGbpsRequest>;
export type AllowedInstanceTypes = string[];
export const AllowedInstanceTypes = S.Array(S.String);
export interface PerformanceFactorReferenceRequest {
  InstanceFamily?: string;
}
export const PerformanceFactorReferenceRequest = S.suspend(() =>
  S.Struct({ InstanceFamily: S.optional(S.String) }),
).annotations({
  identifier: "PerformanceFactorReferenceRequest",
}) as any as S.Schema<PerformanceFactorReferenceRequest>;
export type PerformanceFactorReferenceSetRequest =
  PerformanceFactorReferenceRequest[];
export const PerformanceFactorReferenceSetRequest = S.Array(
  PerformanceFactorReferenceRequest.pipe(T.XmlName("item")).annotations({
    identifier: "PerformanceFactorReferenceRequest",
  }),
);
export interface CpuPerformanceFactorRequest {
  References?: PerformanceFactorReferenceSetRequest;
}
export const CpuPerformanceFactorRequest = S.suspend(() =>
  S.Struct({
    References: S.optional(PerformanceFactorReferenceSetRequest).pipe(
      T.XmlName("Reference"),
    ),
  }),
).annotations({
  identifier: "CpuPerformanceFactorRequest",
}) as any as S.Schema<CpuPerformanceFactorRequest>;
export interface BaselinePerformanceFactorsRequest {
  Cpu?: CpuPerformanceFactorRequest;
}
export const BaselinePerformanceFactorsRequest = S.suspend(() =>
  S.Struct({ Cpu: S.optional(CpuPerformanceFactorRequest) }),
).annotations({
  identifier: "BaselinePerformanceFactorsRequest",
}) as any as S.Schema<BaselinePerformanceFactorsRequest>;
export interface InstanceRequirements {
  VCpuCount: VCpuCountRequest;
  MemoryMiB: MemoryMiBRequest;
  CpuManufacturers?: CpuManufacturers;
  MemoryGiBPerVCpu?: MemoryGiBPerVCpuRequest;
  ExcludedInstanceTypes?: ExcludedInstanceTypes;
  InstanceGenerations?: InstanceGenerations;
  SpotMaxPricePercentageOverLowestPrice?: number;
  MaxSpotPriceAsPercentageOfOptimalOnDemandPrice?: number;
  OnDemandMaxPricePercentageOverLowestPrice?: number;
  BareMetal?: string;
  BurstablePerformance?: string;
  RequireHibernateSupport?: boolean;
  NetworkInterfaceCount?: NetworkInterfaceCountRequest;
  LocalStorage?: string;
  LocalStorageTypes?: LocalStorageTypes;
  TotalLocalStorageGB?: TotalLocalStorageGBRequest;
  BaselineEbsBandwidthMbps?: BaselineEbsBandwidthMbpsRequest;
  AcceleratorTypes?: AcceleratorTypes;
  AcceleratorCount?: AcceleratorCountRequest;
  AcceleratorManufacturers?: AcceleratorManufacturers;
  AcceleratorNames?: AcceleratorNames;
  AcceleratorTotalMemoryMiB?: AcceleratorTotalMemoryMiBRequest;
  NetworkBandwidthGbps?: NetworkBandwidthGbpsRequest;
  AllowedInstanceTypes?: AllowedInstanceTypes;
  BaselinePerformanceFactors?: BaselinePerformanceFactorsRequest;
}
export const InstanceRequirements = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "InstanceRequirements",
}) as any as S.Schema<InstanceRequirements>;
export interface LaunchTemplateOverrides {
  InstanceType?: string;
  WeightedCapacity?: string;
  LaunchTemplateSpecification?: LaunchTemplateSpecification;
  InstanceRequirements?: InstanceRequirements;
  ImageId?: string;
}
export const LaunchTemplateOverrides = S.suspend(() =>
  S.Struct({
    InstanceType: S.optional(S.String),
    WeightedCapacity: S.optional(S.String),
    LaunchTemplateSpecification: S.optional(LaunchTemplateSpecification),
    InstanceRequirements: S.optional(InstanceRequirements),
    ImageId: S.optional(S.String),
  }),
).annotations({
  identifier: "LaunchTemplateOverrides",
}) as any as S.Schema<LaunchTemplateOverrides>;
export type Overrides = LaunchTemplateOverrides[];
export const Overrides = S.Array(LaunchTemplateOverrides);
export interface LaunchTemplate {
  LaunchTemplateSpecification?: LaunchTemplateSpecification;
  Overrides?: Overrides;
}
export const LaunchTemplate = S.suspend(() =>
  S.Struct({
    LaunchTemplateSpecification: S.optional(LaunchTemplateSpecification),
    Overrides: S.optional(Overrides),
  }),
).annotations({
  identifier: "LaunchTemplate",
}) as any as S.Schema<LaunchTemplate>;
export interface InstancesDistribution {
  OnDemandAllocationStrategy?: string;
  OnDemandBaseCapacity?: number;
  OnDemandPercentageAboveBaseCapacity?: number;
  SpotAllocationStrategy?: string;
  SpotInstancePools?: number;
  SpotMaxPrice?: string;
}
export const InstancesDistribution = S.suspend(() =>
  S.Struct({
    OnDemandAllocationStrategy: S.optional(S.String),
    OnDemandBaseCapacity: S.optional(S.Number),
    OnDemandPercentageAboveBaseCapacity: S.optional(S.Number),
    SpotAllocationStrategy: S.optional(S.String),
    SpotInstancePools: S.optional(S.Number),
    SpotMaxPrice: S.optional(S.String),
  }),
).annotations({
  identifier: "InstancesDistribution",
}) as any as S.Schema<InstancesDistribution>;
export interface MixedInstancesPolicy {
  LaunchTemplate?: LaunchTemplate;
  InstancesDistribution?: InstancesDistribution;
}
export const MixedInstancesPolicy = S.suspend(() =>
  S.Struct({
    LaunchTemplate: S.optional(LaunchTemplate),
    InstancesDistribution: S.optional(InstancesDistribution),
  }),
).annotations({
  identifier: "MixedInstancesPolicy",
}) as any as S.Schema<MixedInstancesPolicy>;
export interface InstanceMaintenancePolicy {
  MinHealthyPercentage?: number;
  MaxHealthyPercentage?: number;
}
export const InstanceMaintenancePolicy = S.suspend(() =>
  S.Struct({
    MinHealthyPercentage: S.optional(S.Number),
    MaxHealthyPercentage: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstanceMaintenancePolicy",
}) as any as S.Schema<InstanceMaintenancePolicy>;
export interface AvailabilityZoneDistribution {
  CapacityDistributionStrategy?: string;
}
export const AvailabilityZoneDistribution = S.suspend(() =>
  S.Struct({ CapacityDistributionStrategy: S.optional(S.String) }),
).annotations({
  identifier: "AvailabilityZoneDistribution",
}) as any as S.Schema<AvailabilityZoneDistribution>;
export interface AvailabilityZoneImpairmentPolicy {
  ZonalShiftEnabled?: boolean;
  ImpairedZoneHealthCheckBehavior?: string;
}
export const AvailabilityZoneImpairmentPolicy = S.suspend(() =>
  S.Struct({
    ZonalShiftEnabled: S.optional(S.Boolean),
    ImpairedZoneHealthCheckBehavior: S.optional(S.String),
  }),
).annotations({
  identifier: "AvailabilityZoneImpairmentPolicy",
}) as any as S.Schema<AvailabilityZoneImpairmentPolicy>;
export type CapacityReservationIds = string[];
export const CapacityReservationIds = S.Array(S.String);
export type CapacityReservationResourceGroupArns = string[];
export const CapacityReservationResourceGroupArns = S.Array(S.String);
export interface CapacityReservationTarget {
  CapacityReservationIds?: CapacityReservationIds;
  CapacityReservationResourceGroupArns?: CapacityReservationResourceGroupArns;
}
export const CapacityReservationTarget = S.suspend(() =>
  S.Struct({
    CapacityReservationIds: S.optional(CapacityReservationIds),
    CapacityReservationResourceGroupArns: S.optional(
      CapacityReservationResourceGroupArns,
    ),
  }),
).annotations({
  identifier: "CapacityReservationTarget",
}) as any as S.Schema<CapacityReservationTarget>;
export interface CapacityReservationSpecification {
  CapacityReservationPreference?: string;
  CapacityReservationTarget?: CapacityReservationTarget;
}
export const CapacityReservationSpecification = S.suspend(() =>
  S.Struct({
    CapacityReservationPreference: S.optional(S.String),
    CapacityReservationTarget: S.optional(CapacityReservationTarget),
  }),
).annotations({
  identifier: "CapacityReservationSpecification",
}) as any as S.Schema<CapacityReservationSpecification>;
export interface RetentionTriggers {
  TerminateHookAbandon?: string;
}
export const RetentionTriggers = S.suspend(() =>
  S.Struct({ TerminateHookAbandon: S.optional(S.String) }),
).annotations({
  identifier: "RetentionTriggers",
}) as any as S.Schema<RetentionTriggers>;
export interface InstanceLifecyclePolicy {
  RetentionTriggers?: RetentionTriggers;
}
export const InstanceLifecyclePolicy = S.suspend(() =>
  S.Struct({ RetentionTriggers: S.optional(RetentionTriggers) }),
).annotations({
  identifier: "InstanceLifecyclePolicy",
}) as any as S.Schema<InstanceLifecyclePolicy>;
export interface UpdateAutoScalingGroupType {
  AutoScalingGroupName: string;
  LaunchConfigurationName?: string;
  LaunchTemplate?: LaunchTemplateSpecification;
  MixedInstancesPolicy?: MixedInstancesPolicy;
  MinSize?: number;
  MaxSize?: number;
  DesiredCapacity?: number;
  DefaultCooldown?: number;
  AvailabilityZones?: AvailabilityZones;
  HealthCheckType?: string;
  HealthCheckGracePeriod?: number;
  PlacementGroup?: string;
  VPCZoneIdentifier?: string;
  TerminationPolicies?: TerminationPolicies;
  NewInstancesProtectedFromScaleIn?: boolean;
  ServiceLinkedRoleARN?: string;
  MaxInstanceLifetime?: number;
  CapacityRebalance?: boolean;
  Context?: string;
  DesiredCapacityType?: string;
  DefaultInstanceWarmup?: number;
  InstanceMaintenancePolicy?: InstanceMaintenancePolicy;
  AvailabilityZoneDistribution?: AvailabilityZoneDistribution;
  AvailabilityZoneImpairmentPolicy?: AvailabilityZoneImpairmentPolicy;
  SkipZonalShiftValidation?: boolean;
  CapacityReservationSpecification?: CapacityReservationSpecification;
  InstanceLifecyclePolicy?: InstanceLifecyclePolicy;
}
export const UpdateAutoScalingGroupType = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateAutoScalingGroupType",
}) as any as S.Schema<UpdateAutoScalingGroupType>;
export interface UpdateAutoScalingGroupResponse {}
export const UpdateAutoScalingGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateAutoScalingGroupResponse",
}) as any as S.Schema<UpdateAutoScalingGroupResponse>;
export type CheckpointPercentages = number[];
export const CheckpointPercentages = S.Array(S.Number);
export interface ScheduledUpdateGroupActionRequest {
  ScheduledActionName: string;
  StartTime?: Date;
  EndTime?: Date;
  Recurrence?: string;
  MinSize?: number;
  MaxSize?: number;
  DesiredCapacity?: number;
  TimeZone?: string;
}
export const ScheduledUpdateGroupActionRequest = S.suspend(() =>
  S.Struct({
    ScheduledActionName: S.String,
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Recurrence: S.optional(S.String),
    MinSize: S.optional(S.Number),
    MaxSize: S.optional(S.Number),
    DesiredCapacity: S.optional(S.Number),
    TimeZone: S.optional(S.String),
  }),
).annotations({
  identifier: "ScheduledUpdateGroupActionRequest",
}) as any as S.Schema<ScheduledUpdateGroupActionRequest>;
export type ScheduledUpdateGroupActionRequests =
  ScheduledUpdateGroupActionRequest[];
export const ScheduledUpdateGroupActionRequests = S.Array(
  ScheduledUpdateGroupActionRequest,
);
export interface LifecycleHookSpecification {
  LifecycleHookName: string;
  LifecycleTransition: string;
  NotificationMetadata?: string;
  HeartbeatTimeout?: number;
  DefaultResult?: string;
  NotificationTargetARN?: string;
  RoleARN?: string;
}
export const LifecycleHookSpecification = S.suspend(() =>
  S.Struct({
    LifecycleHookName: S.String,
    LifecycleTransition: S.String,
    NotificationMetadata: S.optional(S.String),
    HeartbeatTimeout: S.optional(S.Number),
    DefaultResult: S.optional(S.String),
    NotificationTargetARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
  }),
).annotations({
  identifier: "LifecycleHookSpecification",
}) as any as S.Schema<LifecycleHookSpecification>;
export type LifecycleHookSpecifications = LifecycleHookSpecification[];
export const LifecycleHookSpecifications = S.Array(LifecycleHookSpecification);
export interface InstanceMonitoring {
  Enabled?: boolean;
}
export const InstanceMonitoring = S.suspend(() =>
  S.Struct({ Enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "InstanceMonitoring",
}) as any as S.Schema<InstanceMonitoring>;
export interface InstanceMetadataOptions {
  HttpTokens?: string;
  HttpPutResponseHopLimit?: number;
  HttpEndpoint?: string;
}
export const InstanceMetadataOptions = S.suspend(() =>
  S.Struct({
    HttpTokens: S.optional(S.String),
    HttpPutResponseHopLimit: S.optional(S.Number),
    HttpEndpoint: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceMetadataOptions",
}) as any as S.Schema<InstanceMetadataOptions>;
export interface AdjustmentType {
  AdjustmentType?: string;
}
export const AdjustmentType = S.suspend(() =>
  S.Struct({ AdjustmentType: S.optional(S.String) }),
).annotations({
  identifier: "AdjustmentType",
}) as any as S.Schema<AdjustmentType>;
export type AdjustmentTypes = AdjustmentType[];
export const AdjustmentTypes = S.Array(AdjustmentType);
export interface MetricCollectionType {
  Metric?: string;
}
export const MetricCollectionType = S.suspend(() =>
  S.Struct({ Metric: S.optional(S.String) }),
).annotations({
  identifier: "MetricCollectionType",
}) as any as S.Schema<MetricCollectionType>;
export type MetricCollectionTypes = MetricCollectionType[];
export const MetricCollectionTypes = S.Array(MetricCollectionType);
export interface MetricGranularityType {
  Granularity?: string;
}
export const MetricGranularityType = S.suspend(() =>
  S.Struct({ Granularity: S.optional(S.String) }),
).annotations({
  identifier: "MetricGranularityType",
}) as any as S.Schema<MetricGranularityType>;
export type MetricGranularityTypes = MetricGranularityType[];
export const MetricGranularityTypes = S.Array(MetricGranularityType);
export interface ProcessType {
  ProcessName: string;
}
export const ProcessType = S.suspend(() =>
  S.Struct({ ProcessName: S.String }),
).annotations({ identifier: "ProcessType" }) as any as S.Schema<ProcessType>;
export type Processes = ProcessType[];
export const Processes = S.Array(ProcessType);
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
export interface InstanceReusePolicy {
  ReuseOnScaleIn?: boolean;
}
export const InstanceReusePolicy = S.suspend(() =>
  S.Struct({ ReuseOnScaleIn: S.optional(S.Boolean) }),
).annotations({
  identifier: "InstanceReusePolicy",
}) as any as S.Schema<InstanceReusePolicy>;
export interface DesiredConfiguration {
  LaunchTemplate?: LaunchTemplateSpecification;
  MixedInstancesPolicy?: MixedInstancesPolicy;
}
export const DesiredConfiguration = S.suspend(() =>
  S.Struct({
    LaunchTemplate: S.optional(LaunchTemplateSpecification),
    MixedInstancesPolicy: S.optional(MixedInstancesPolicy),
  }),
).annotations({
  identifier: "DesiredConfiguration",
}) as any as S.Schema<DesiredConfiguration>;
export type AlarmList = string[];
export const AlarmList = S.Array(S.String);
export interface AttachTrafficSourcesType {
  AutoScalingGroupName: string;
  TrafficSources: TrafficSources;
  SkipZonalShiftValidation?: boolean;
}
export const AttachTrafficSourcesType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    TrafficSources: TrafficSources,
    SkipZonalShiftValidation: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AttachTrafficSourcesType",
}) as any as S.Schema<AttachTrafficSourcesType>;
export interface AttachTrafficSourcesResultType {}
export const AttachTrafficSourcesResultType = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AttachTrafficSourcesResultType",
}) as any as S.Schema<AttachTrafficSourcesResultType>;
export interface BatchPutScheduledUpdateGroupActionType {
  AutoScalingGroupName: string;
  ScheduledUpdateGroupActions: ScheduledUpdateGroupActionRequests;
}
export const BatchPutScheduledUpdateGroupActionType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    ScheduledUpdateGroupActions: ScheduledUpdateGroupActionRequests,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchPutScheduledUpdateGroupActionType",
}) as any as S.Schema<BatchPutScheduledUpdateGroupActionType>;
export interface CancelInstanceRefreshAnswer {
  InstanceRefreshId?: string;
}
export const CancelInstanceRefreshAnswer = S.suspend(() =>
  S.Struct({ InstanceRefreshId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CancelInstanceRefreshAnswer",
}) as any as S.Schema<CancelInstanceRefreshAnswer>;
export interface DescribeAdjustmentTypesAnswer {
  AdjustmentTypes?: AdjustmentTypes;
}
export const DescribeAdjustmentTypesAnswer = S.suspend(() =>
  S.Struct({ AdjustmentTypes: S.optional(AdjustmentTypes) }).pipe(ns),
).annotations({
  identifier: "DescribeAdjustmentTypesAnswer",
}) as any as S.Schema<DescribeAdjustmentTypesAnswer>;
export interface AutoScalingGroupNamesType {
  AutoScalingGroupNames?: AutoScalingGroupNames;
  IncludeInstances?: boolean;
  NextToken?: string;
  MaxRecords?: number;
  Filters?: Filters;
}
export const AutoScalingGroupNamesType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupNames: S.optional(AutoScalingGroupNames),
    IncludeInstances: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Filters: S.optional(Filters),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AutoScalingGroupNamesType",
}) as any as S.Schema<AutoScalingGroupNamesType>;
export interface DescribeMetricCollectionTypesAnswer {
  Metrics?: MetricCollectionTypes;
  Granularities?: MetricGranularityTypes;
}
export const DescribeMetricCollectionTypesAnswer = S.suspend(() =>
  S.Struct({
    Metrics: S.optional(MetricCollectionTypes),
    Granularities: S.optional(MetricGranularityTypes),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMetricCollectionTypesAnswer",
}) as any as S.Schema<DescribeMetricCollectionTypesAnswer>;
export interface ProcessesType {
  Processes?: Processes;
}
export const ProcessesType = S.suspend(() =>
  S.Struct({ Processes: S.optional(Processes) }).pipe(ns),
).annotations({
  identifier: "ProcessesType",
}) as any as S.Schema<ProcessesType>;
export interface Activity {
  ActivityId: string;
  AutoScalingGroupName: string;
  Description?: string;
  Cause: string;
  StartTime: Date;
  EndTime?: Date;
  StatusCode: string;
  StatusMessage?: string;
  Progress?: number;
  Details?: string;
  AutoScalingGroupState?: string;
  AutoScalingGroupARN?: string;
}
export const Activity = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Activity" }) as any as S.Schema<Activity>;
export type Activities = Activity[];
export const Activities = S.Array(Activity);
export interface DetachInstancesAnswer {
  Activities?: Activities;
}
export const DetachInstancesAnswer = S.suspend(() =>
  S.Struct({ Activities: S.optional(Activities) }).pipe(ns),
).annotations({
  identifier: "DetachInstancesAnswer",
}) as any as S.Schema<DetachInstancesAnswer>;
export interface EnterStandbyAnswer {
  Activities?: Activities;
}
export const EnterStandbyAnswer = S.suspend(() =>
  S.Struct({ Activities: S.optional(Activities) }).pipe(ns),
).annotations({
  identifier: "EnterStandbyAnswer",
}) as any as S.Schema<EnterStandbyAnswer>;
export interface ExitStandbyAnswer {
  Activities?: Activities;
}
export const ExitStandbyAnswer = S.suspend(() =>
  S.Struct({ Activities: S.optional(Activities) }).pipe(ns),
).annotations({
  identifier: "ExitStandbyAnswer",
}) as any as S.Schema<ExitStandbyAnswer>;
export interface PutWarmPoolType {
  AutoScalingGroupName: string;
  MaxGroupPreparedCapacity?: number;
  MinSize?: number;
  PoolState?: string;
  InstanceReusePolicy?: InstanceReusePolicy;
}
export const PutWarmPoolType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    MaxGroupPreparedCapacity: S.optional(S.Number),
    MinSize: S.optional(S.Number),
    PoolState: S.optional(S.String),
    InstanceReusePolicy: S.optional(InstanceReusePolicy),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutWarmPoolType",
}) as any as S.Schema<PutWarmPoolType>;
export interface PutWarmPoolAnswer {}
export const PutWarmPoolAnswer = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "PutWarmPoolAnswer",
}) as any as S.Schema<PutWarmPoolAnswer>;
export interface RollbackInstanceRefreshAnswer {
  InstanceRefreshId?: string;
}
export const RollbackInstanceRefreshAnswer = S.suspend(() =>
  S.Struct({ InstanceRefreshId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RollbackInstanceRefreshAnswer",
}) as any as S.Schema<RollbackInstanceRefreshAnswer>;
export interface ActivityType {
  Activity?: Activity;
}
export const ActivityType = S.suspend(() =>
  S.Struct({ Activity: S.optional(Activity) }).pipe(ns),
).annotations({ identifier: "ActivityType" }) as any as S.Schema<ActivityType>;
export interface Ebs {
  SnapshotId?: string;
  VolumeSize?: number;
  VolumeType?: string;
  DeleteOnTermination?: boolean;
  Iops?: number;
  Encrypted?: boolean;
  Throughput?: number;
}
export const Ebs = S.suspend(() =>
  S.Struct({
    SnapshotId: S.optional(S.String),
    VolumeSize: S.optional(S.Number),
    VolumeType: S.optional(S.String),
    DeleteOnTermination: S.optional(S.Boolean),
    Iops: S.optional(S.Number),
    Encrypted: S.optional(S.Boolean),
    Throughput: S.optional(S.Number),
  }),
).annotations({ identifier: "Ebs" }) as any as S.Schema<Ebs>;
export type PredictiveScalingForecastTimestamps = Date[];
export const PredictiveScalingForecastTimestamps = S.Array(
  S.Date.pipe(T.TimestampFormat("date-time")),
);
export type PredictiveScalingForecastValues = number[];
export const PredictiveScalingForecastValues = S.Array(S.Number);
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
export interface AlarmSpecification {
  Alarms?: AlarmList;
}
export const AlarmSpecification = S.suspend(() =>
  S.Struct({ Alarms: S.optional(AlarmList) }),
).annotations({
  identifier: "AlarmSpecification",
}) as any as S.Schema<AlarmSpecification>;
export interface FailedScheduledUpdateGroupActionRequest {
  ScheduledActionName: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const FailedScheduledUpdateGroupActionRequest = S.suspend(() =>
  S.Struct({
    ScheduledActionName: S.String,
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "FailedScheduledUpdateGroupActionRequest",
}) as any as S.Schema<FailedScheduledUpdateGroupActionRequest>;
export type FailedScheduledUpdateGroupActionRequests =
  FailedScheduledUpdateGroupActionRequest[];
export const FailedScheduledUpdateGroupActionRequests = S.Array(
  FailedScheduledUpdateGroupActionRequest,
);
export interface BlockDeviceMapping {
  VirtualName?: string;
  DeviceName: string;
  Ebs?: Ebs;
  NoDevice?: boolean;
}
export const BlockDeviceMapping = S.suspend(() =>
  S.Struct({
    VirtualName: S.optional(S.String),
    DeviceName: S.String,
    Ebs: S.optional(Ebs),
    NoDevice: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "BlockDeviceMapping",
}) as any as S.Schema<BlockDeviceMapping>;
export type BlockDeviceMappings = BlockDeviceMapping[];
export const BlockDeviceMappings = S.Array(BlockDeviceMapping);
export interface AutoScalingInstanceDetails {
  InstanceId: string;
  InstanceType?: string;
  AutoScalingGroupName: string;
  AvailabilityZone: string;
  LifecycleState: string;
  HealthStatus: string;
  LaunchConfigurationName?: string;
  LaunchTemplate?: LaunchTemplateSpecification;
  ImageId?: string;
  ProtectedFromScaleIn: boolean;
  WeightedCapacity?: string;
}
export const AutoScalingInstanceDetails = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "AutoScalingInstanceDetails",
}) as any as S.Schema<AutoScalingInstanceDetails>;
export type AutoScalingInstances = AutoScalingInstanceDetails[];
export const AutoScalingInstances = S.Array(AutoScalingInstanceDetails);
export interface LaunchConfiguration {
  LaunchConfigurationName: string;
  LaunchConfigurationARN?: string;
  ImageId: string;
  KeyName?: string;
  SecurityGroups?: SecurityGroups;
  ClassicLinkVPCId?: string;
  ClassicLinkVPCSecurityGroups?: ClassicLinkVPCSecurityGroups;
  UserData?: string;
  InstanceType: string;
  KernelId?: string;
  RamdiskId?: string;
  BlockDeviceMappings?: BlockDeviceMappings;
  InstanceMonitoring?: InstanceMonitoring;
  SpotPrice?: string;
  IamInstanceProfile?: string;
  CreatedTime: Date;
  EbsOptimized?: boolean;
  AssociatePublicIpAddress?: boolean;
  PlacementTenancy?: string;
  MetadataOptions?: InstanceMetadataOptions;
}
export const LaunchConfiguration = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "LaunchConfiguration",
}) as any as S.Schema<LaunchConfiguration>;
export type LaunchConfigurations = LaunchConfiguration[];
export const LaunchConfigurations = S.Array(LaunchConfiguration);
export interface LifecycleHook {
  LifecycleHookName?: string;
  AutoScalingGroupName?: string;
  LifecycleTransition?: string;
  NotificationTargetARN?: string;
  RoleARN?: string;
  NotificationMetadata?: string;
  HeartbeatTimeout?: number;
  GlobalTimeout?: number;
  DefaultResult?: string;
}
export const LifecycleHook = S.suspend(() =>
  S.Struct({
    LifecycleHookName: S.optional(S.String),
    AutoScalingGroupName: S.optional(S.String),
    LifecycleTransition: S.optional(S.String),
    NotificationTargetARN: S.optional(S.String),
    RoleARN: S.optional(S.String),
    NotificationMetadata: S.optional(S.String),
    HeartbeatTimeout: S.optional(S.Number),
    GlobalTimeout: S.optional(S.Number),
    DefaultResult: S.optional(S.String),
  }),
).annotations({
  identifier: "LifecycleHook",
}) as any as S.Schema<LifecycleHook>;
export type LifecycleHooks = LifecycleHook[];
export const LifecycleHooks = S.Array(LifecycleHook);
export interface LoadBalancerState {
  LoadBalancerName?: string;
  State?: string;
}
export const LoadBalancerState = S.suspend(() =>
  S.Struct({
    LoadBalancerName: S.optional(S.String),
    State: S.optional(S.String),
  }),
).annotations({
  identifier: "LoadBalancerState",
}) as any as S.Schema<LoadBalancerState>;
export type LoadBalancerStates = LoadBalancerState[];
export const LoadBalancerStates = S.Array(LoadBalancerState);
export interface LoadBalancerTargetGroupState {
  LoadBalancerTargetGroupARN?: string;
  State?: string;
}
export const LoadBalancerTargetGroupState = S.suspend(() =>
  S.Struct({
    LoadBalancerTargetGroupARN: S.optional(S.String),
    State: S.optional(S.String),
  }),
).annotations({
  identifier: "LoadBalancerTargetGroupState",
}) as any as S.Schema<LoadBalancerTargetGroupState>;
export type LoadBalancerTargetGroupStates = LoadBalancerTargetGroupState[];
export const LoadBalancerTargetGroupStates = S.Array(
  LoadBalancerTargetGroupState,
);
export interface NotificationConfiguration {
  AutoScalingGroupName?: string;
  TopicARN?: string;
  NotificationType?: string;
}
export const NotificationConfiguration = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.optional(S.String),
    TopicARN: S.optional(S.String),
    NotificationType: S.optional(S.String),
  }),
).annotations({
  identifier: "NotificationConfiguration",
}) as any as S.Schema<NotificationConfiguration>;
export type NotificationConfigurations = NotificationConfiguration[];
export const NotificationConfigurations = S.Array(NotificationConfiguration);
export interface ScheduledUpdateGroupAction {
  AutoScalingGroupName?: string;
  ScheduledActionName?: string;
  ScheduledActionARN?: string;
  Time?: Date;
  StartTime?: Date;
  EndTime?: Date;
  Recurrence?: string;
  MinSize?: number;
  MaxSize?: number;
  DesiredCapacity?: number;
  TimeZone?: string;
}
export const ScheduledUpdateGroupAction = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ScheduledUpdateGroupAction",
}) as any as S.Schema<ScheduledUpdateGroupAction>;
export type ScheduledUpdateGroupActions = ScheduledUpdateGroupAction[];
export const ScheduledUpdateGroupActions = S.Array(ScheduledUpdateGroupAction);
export interface TagDescription {
  ResourceId?: string;
  ResourceType?: string;
  Key?: string;
  Value?: string;
  PropagateAtLaunch?: boolean;
}
export const TagDescription = S.suspend(() =>
  S.Struct({
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Key: S.optional(S.String),
    Value: S.optional(S.String),
    PropagateAtLaunch: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TagDescription",
}) as any as S.Schema<TagDescription>;
export type TagDescriptionList = TagDescription[];
export const TagDescriptionList = S.Array(TagDescription);
export interface TrafficSourceState {
  TrafficSource?: string;
  State?: string;
  Identifier?: string;
  Type?: string;
}
export const TrafficSourceState = S.suspend(() =>
  S.Struct({
    TrafficSource: S.optional(S.String),
    State: S.optional(S.String),
    Identifier: S.optional(S.String),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "TrafficSourceState",
}) as any as S.Schema<TrafficSourceState>;
export type TrafficSourceStates = TrafficSourceState[];
export const TrafficSourceStates = S.Array(TrafficSourceState);
export interface WarmPoolConfiguration {
  MaxGroupPreparedCapacity?: number;
  MinSize?: number;
  PoolState?: string;
  Status?: string;
  InstanceReusePolicy?: InstanceReusePolicy;
}
export const WarmPoolConfiguration = S.suspend(() =>
  S.Struct({
    MaxGroupPreparedCapacity: S.optional(S.Number),
    MinSize: S.optional(S.Number),
    PoolState: S.optional(S.String),
    Status: S.optional(S.String),
    InstanceReusePolicy: S.optional(InstanceReusePolicy),
  }),
).annotations({
  identifier: "WarmPoolConfiguration",
}) as any as S.Schema<WarmPoolConfiguration>;
export interface Instance {
  InstanceId: string;
  InstanceType?: string;
  AvailabilityZone: string;
  LifecycleState: string;
  HealthStatus: string;
  LaunchConfigurationName?: string;
  LaunchTemplate?: LaunchTemplateSpecification;
  ImageId?: string;
  ProtectedFromScaleIn: boolean;
  WeightedCapacity?: string;
}
export const Instance = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Instance" }) as any as S.Schema<Instance>;
export type Instances = Instance[];
export const Instances = S.Array(Instance);
export interface PredictiveScalingPredefinedMetricPair {
  PredefinedMetricType: string;
  ResourceLabel?: string;
}
export const PredictiveScalingPredefinedMetricPair = S.suspend(() =>
  S.Struct({
    PredefinedMetricType: S.String,
    ResourceLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "PredictiveScalingPredefinedMetricPair",
}) as any as S.Schema<PredictiveScalingPredefinedMetricPair>;
export interface PredictiveScalingPredefinedScalingMetric {
  PredefinedMetricType: string;
  ResourceLabel?: string;
}
export const PredictiveScalingPredefinedScalingMetric = S.suspend(() =>
  S.Struct({
    PredefinedMetricType: S.String,
    ResourceLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "PredictiveScalingPredefinedScalingMetric",
}) as any as S.Schema<PredictiveScalingPredefinedScalingMetric>;
export interface PredictiveScalingPredefinedLoadMetric {
  PredefinedMetricType: string;
  ResourceLabel?: string;
}
export const PredictiveScalingPredefinedLoadMetric = S.suspend(() =>
  S.Struct({
    PredefinedMetricType: S.String,
    ResourceLabel: S.optional(S.String),
  }),
).annotations({
  identifier: "PredictiveScalingPredefinedLoadMetric",
}) as any as S.Schema<PredictiveScalingPredefinedLoadMetric>;
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
export interface Metric {
  Namespace: string;
  MetricName: string;
  Dimensions?: MetricDimensions;
}
export const Metric = S.suspend(() =>
  S.Struct({
    Namespace: S.String,
    MetricName: S.String,
    Dimensions: S.optional(MetricDimensions),
  }),
).annotations({ identifier: "Metric" }) as any as S.Schema<Metric>;
export interface MetricStat {
  Metric: Metric;
  Stat: string;
  Unit?: string;
}
export const MetricStat = S.suspend(() =>
  S.Struct({ Metric: Metric, Stat: S.String, Unit: S.optional(S.String) }),
).annotations({ identifier: "MetricStat" }) as any as S.Schema<MetricStat>;
export interface MetricDataQuery {
  Id: string;
  Expression?: string;
  MetricStat?: MetricStat;
  Label?: string;
  ReturnData?: boolean;
}
export const MetricDataQuery = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Expression: S.optional(S.String),
    MetricStat: S.optional(MetricStat),
    Label: S.optional(S.String),
    ReturnData: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "MetricDataQuery",
}) as any as S.Schema<MetricDataQuery>;
export type MetricDataQueries = MetricDataQuery[];
export const MetricDataQueries = S.Array(MetricDataQuery);
export interface PredictiveScalingCustomizedScalingMetric {
  MetricDataQueries: MetricDataQueries;
}
export const PredictiveScalingCustomizedScalingMetric = S.suspend(() =>
  S.Struct({ MetricDataQueries: MetricDataQueries }),
).annotations({
  identifier: "PredictiveScalingCustomizedScalingMetric",
}) as any as S.Schema<PredictiveScalingCustomizedScalingMetric>;
export interface PredictiveScalingCustomizedLoadMetric {
  MetricDataQueries: MetricDataQueries;
}
export const PredictiveScalingCustomizedLoadMetric = S.suspend(() =>
  S.Struct({ MetricDataQueries: MetricDataQueries }),
).annotations({
  identifier: "PredictiveScalingCustomizedLoadMetric",
}) as any as S.Schema<PredictiveScalingCustomizedLoadMetric>;
export interface PredictiveScalingCustomizedCapacityMetric {
  MetricDataQueries: MetricDataQueries;
}
export const PredictiveScalingCustomizedCapacityMetric = S.suspend(() =>
  S.Struct({ MetricDataQueries: MetricDataQueries }),
).annotations({
  identifier: "PredictiveScalingCustomizedCapacityMetric",
}) as any as S.Schema<PredictiveScalingCustomizedCapacityMetric>;
export interface PredictiveScalingMetricSpecification {
  TargetValue: number;
  PredefinedMetricPairSpecification?: PredictiveScalingPredefinedMetricPair;
  PredefinedScalingMetricSpecification?: PredictiveScalingPredefinedScalingMetric;
  PredefinedLoadMetricSpecification?: PredictiveScalingPredefinedLoadMetric;
  CustomizedScalingMetricSpecification?: PredictiveScalingCustomizedScalingMetric;
  CustomizedLoadMetricSpecification?: PredictiveScalingCustomizedLoadMetric;
  CustomizedCapacityMetricSpecification?: PredictiveScalingCustomizedCapacityMetric;
}
export const PredictiveScalingMetricSpecification = S.suspend(() =>
  S.Struct({
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
export interface InstanceCollection {
  InstanceType?: string;
  MarketType?: string;
  SubnetId?: string;
  AvailabilityZone?: string;
  AvailabilityZoneId?: string;
  InstanceIds?: InstanceIds;
}
export const InstanceCollection = S.suspend(() =>
  S.Struct({
    InstanceType: S.optional(S.String),
    MarketType: S.optional(S.String),
    SubnetId: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    AvailabilityZoneId: S.optional(S.String),
    InstanceIds: S.optional(InstanceIds),
  }),
).annotations({
  identifier: "InstanceCollection",
}) as any as S.Schema<InstanceCollection>;
export type InstanceCollections = InstanceCollection[];
export const InstanceCollections = S.Array(InstanceCollection);
export interface LaunchInstancesError {
  InstanceType?: string;
  MarketType?: string;
  SubnetId?: string;
  AvailabilityZone?: string;
  AvailabilityZoneId?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const LaunchInstancesError = S.suspend(() =>
  S.Struct({
    InstanceType: S.optional(S.String),
    MarketType: S.optional(S.String),
    SubnetId: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    AvailabilityZoneId: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "LaunchInstancesError",
}) as any as S.Schema<LaunchInstancesError>;
export type LaunchInstancesErrors = LaunchInstancesError[];
export const LaunchInstancesErrors = S.Array(LaunchInstancesError);
export interface RefreshPreferences {
  MinHealthyPercentage?: number;
  InstanceWarmup?: number;
  CheckpointPercentages?: CheckpointPercentages;
  CheckpointDelay?: number;
  SkipMatching?: boolean;
  AutoRollback?: boolean;
  ScaleInProtectedInstances?: string;
  StandbyInstances?: string;
  AlarmSpecification?: AlarmSpecification;
  MaxHealthyPercentage?: number;
  BakeTime?: number;
}
export const RefreshPreferences = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "RefreshPreferences",
}) as any as S.Schema<RefreshPreferences>;
export interface BatchDeleteScheduledActionAnswer {
  FailedScheduledActions?: FailedScheduledUpdateGroupActionRequests;
}
export const BatchDeleteScheduledActionAnswer = S.suspend(() =>
  S.Struct({
    FailedScheduledActions: S.optional(
      FailedScheduledUpdateGroupActionRequests,
    ),
  }).pipe(ns),
).annotations({
  identifier: "BatchDeleteScheduledActionAnswer",
}) as any as S.Schema<BatchDeleteScheduledActionAnswer>;
export interface BatchPutScheduledUpdateGroupActionAnswer {
  FailedScheduledUpdateGroupActions?: FailedScheduledUpdateGroupActionRequests;
}
export const BatchPutScheduledUpdateGroupActionAnswer = S.suspend(() =>
  S.Struct({
    FailedScheduledUpdateGroupActions: S.optional(
      FailedScheduledUpdateGroupActionRequests,
    ),
  }).pipe(ns),
).annotations({
  identifier: "BatchPutScheduledUpdateGroupActionAnswer",
}) as any as S.Schema<BatchPutScheduledUpdateGroupActionAnswer>;
export interface CreateLaunchConfigurationType {
  LaunchConfigurationName: string;
  ImageId?: string;
  KeyName?: string;
  SecurityGroups?: SecurityGroups;
  ClassicLinkVPCId?: string;
  ClassicLinkVPCSecurityGroups?: ClassicLinkVPCSecurityGroups;
  UserData?: string;
  InstanceId?: string;
  InstanceType?: string;
  KernelId?: string;
  RamdiskId?: string;
  BlockDeviceMappings?: BlockDeviceMappings;
  InstanceMonitoring?: InstanceMonitoring;
  SpotPrice?: string;
  IamInstanceProfile?: string;
  EbsOptimized?: boolean;
  AssociatePublicIpAddress?: boolean;
  PlacementTenancy?: string;
  MetadataOptions?: InstanceMetadataOptions;
}
export const CreateLaunchConfigurationType = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLaunchConfigurationType",
}) as any as S.Schema<CreateLaunchConfigurationType>;
export interface CreateLaunchConfigurationResponse {}
export const CreateLaunchConfigurationResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateLaunchConfigurationResponse",
}) as any as S.Schema<CreateLaunchConfigurationResponse>;
export interface AutoScalingInstancesType {
  AutoScalingInstances?: AutoScalingInstances;
  NextToken?: string;
}
export const AutoScalingInstancesType = S.suspend(() =>
  S.Struct({
    AutoScalingInstances: S.optional(AutoScalingInstances),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "AutoScalingInstancesType",
}) as any as S.Schema<AutoScalingInstancesType>;
export interface LaunchConfigurationsType {
  LaunchConfigurations: LaunchConfigurations;
  NextToken?: string;
}
export const LaunchConfigurationsType = S.suspend(() =>
  S.Struct({
    LaunchConfigurations: LaunchConfigurations,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "LaunchConfigurationsType",
}) as any as S.Schema<LaunchConfigurationsType>;
export interface DescribeLifecycleHooksAnswer {
  LifecycleHooks?: LifecycleHooks;
}
export const DescribeLifecycleHooksAnswer = S.suspend(() =>
  S.Struct({ LifecycleHooks: S.optional(LifecycleHooks) }).pipe(ns),
).annotations({
  identifier: "DescribeLifecycleHooksAnswer",
}) as any as S.Schema<DescribeLifecycleHooksAnswer>;
export interface DescribeLoadBalancersResponse {
  LoadBalancers?: LoadBalancerStates;
  NextToken?: string;
}
export const DescribeLoadBalancersResponse = S.suspend(() =>
  S.Struct({
    LoadBalancers: S.optional(LoadBalancerStates),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeLoadBalancersResponse",
}) as any as S.Schema<DescribeLoadBalancersResponse>;
export interface DescribeLoadBalancerTargetGroupsResponse {
  LoadBalancerTargetGroups?: LoadBalancerTargetGroupStates;
  NextToken?: string;
}
export const DescribeLoadBalancerTargetGroupsResponse = S.suspend(() =>
  S.Struct({
    LoadBalancerTargetGroups: S.optional(LoadBalancerTargetGroupStates),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeLoadBalancerTargetGroupsResponse",
}) as any as S.Schema<DescribeLoadBalancerTargetGroupsResponse>;
export interface DescribeNotificationConfigurationsAnswer {
  NotificationConfigurations: NotificationConfigurations;
  NextToken?: string;
}
export const DescribeNotificationConfigurationsAnswer = S.suspend(() =>
  S.Struct({
    NotificationConfigurations: NotificationConfigurations,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeNotificationConfigurationsAnswer",
}) as any as S.Schema<DescribeNotificationConfigurationsAnswer>;
export interface ActivitiesType {
  Activities: Activities;
  NextToken?: string;
}
export const ActivitiesType = S.suspend(() =>
  S.Struct({ Activities: Activities, NextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ActivitiesType",
}) as any as S.Schema<ActivitiesType>;
export interface ScheduledActionsType {
  ScheduledUpdateGroupActions?: ScheduledUpdateGroupActions;
  NextToken?: string;
}
export const ScheduledActionsType = S.suspend(() =>
  S.Struct({
    ScheduledUpdateGroupActions: S.optional(ScheduledUpdateGroupActions),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ScheduledActionsType",
}) as any as S.Schema<ScheduledActionsType>;
export interface TagsType {
  Tags?: TagDescriptionList;
  NextToken?: string;
}
export const TagsType = S.suspend(() =>
  S.Struct({
    Tags: S.optional(TagDescriptionList),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({ identifier: "TagsType" }) as any as S.Schema<TagsType>;
export interface DescribeTrafficSourcesResponse {
  TrafficSources?: TrafficSourceStates;
  NextToken?: string;
}
export const DescribeTrafficSourcesResponse = S.suspend(() =>
  S.Struct({
    TrafficSources: S.optional(TrafficSourceStates),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTrafficSourcesResponse",
}) as any as S.Schema<DescribeTrafficSourcesResponse>;
export interface DescribeWarmPoolAnswer {
  WarmPoolConfiguration?: WarmPoolConfiguration;
  Instances?: Instances;
  NextToken?: string;
}
export const DescribeWarmPoolAnswer = S.suspend(() =>
  S.Struct({
    WarmPoolConfiguration: S.optional(WarmPoolConfiguration),
    Instances: S.optional(Instances),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeWarmPoolAnswer",
}) as any as S.Schema<DescribeWarmPoolAnswer>;
export interface GetPredictiveScalingForecastAnswer {
  LoadForecast: LoadForecasts;
  CapacityForecast: CapacityForecast;
  UpdateTime: Date;
}
export const GetPredictiveScalingForecastAnswer = S.suspend(() =>
  S.Struct({
    LoadForecast: LoadForecasts,
    CapacityForecast: CapacityForecast,
    UpdateTime: S.Date.pipe(T.TimestampFormat("date-time")),
  }).pipe(ns),
).annotations({
  identifier: "GetPredictiveScalingForecastAnswer",
}) as any as S.Schema<GetPredictiveScalingForecastAnswer>;
export interface LaunchInstancesResult {
  AutoScalingGroupName?: string;
  ClientToken?: string;
  Instances?: InstanceCollections;
  Errors?: LaunchInstancesErrors;
}
export const LaunchInstancesResult = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.optional(S.String),
    ClientToken: S.optional(S.String),
    Instances: S.optional(InstanceCollections),
    Errors: S.optional(LaunchInstancesErrors),
  }).pipe(ns),
).annotations({
  identifier: "LaunchInstancesResult",
}) as any as S.Schema<LaunchInstancesResult>;
export interface StartInstanceRefreshType {
  AutoScalingGroupName: string;
  Strategy?: string;
  DesiredConfiguration?: DesiredConfiguration;
  Preferences?: RefreshPreferences;
}
export const StartInstanceRefreshType = S.suspend(() =>
  S.Struct({
    AutoScalingGroupName: S.String,
    Strategy: S.optional(S.String),
    DesiredConfiguration: S.optional(DesiredConfiguration),
    Preferences: S.optional(RefreshPreferences),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartInstanceRefreshType",
}) as any as S.Schema<StartInstanceRefreshType>;
export interface InstanceRefreshLivePoolProgress {
  PercentageComplete?: number;
  InstancesToUpdate?: number;
}
export const InstanceRefreshLivePoolProgress = S.suspend(() =>
  S.Struct({
    PercentageComplete: S.optional(S.Number),
    InstancesToUpdate: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstanceRefreshLivePoolProgress",
}) as any as S.Schema<InstanceRefreshLivePoolProgress>;
export interface InstanceRefreshWarmPoolProgress {
  PercentageComplete?: number;
  InstancesToUpdate?: number;
}
export const InstanceRefreshWarmPoolProgress = S.suspend(() =>
  S.Struct({
    PercentageComplete: S.optional(S.Number),
    InstancesToUpdate: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstanceRefreshWarmPoolProgress",
}) as any as S.Schema<InstanceRefreshWarmPoolProgress>;
export interface InstanceRefreshProgressDetails {
  LivePoolProgress?: InstanceRefreshLivePoolProgress;
  WarmPoolProgress?: InstanceRefreshWarmPoolProgress;
}
export const InstanceRefreshProgressDetails = S.suspend(() =>
  S.Struct({
    LivePoolProgress: S.optional(InstanceRefreshLivePoolProgress),
    WarmPoolProgress: S.optional(InstanceRefreshWarmPoolProgress),
  }),
).annotations({
  identifier: "InstanceRefreshProgressDetails",
}) as any as S.Schema<InstanceRefreshProgressDetails>;
export interface RollbackDetails {
  RollbackReason?: string;
  RollbackStartTime?: Date;
  PercentageCompleteOnRollback?: number;
  InstancesToUpdateOnRollback?: number;
  ProgressDetailsOnRollback?: InstanceRefreshProgressDetails;
}
export const RollbackDetails = S.suspend(() =>
  S.Struct({
    RollbackReason: S.optional(S.String),
    RollbackStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    PercentageCompleteOnRollback: S.optional(S.Number),
    InstancesToUpdateOnRollback: S.optional(S.Number),
    ProgressDetailsOnRollback: S.optional(InstanceRefreshProgressDetails),
  }),
).annotations({
  identifier: "RollbackDetails",
}) as any as S.Schema<RollbackDetails>;
export interface Alarm {
  AlarmName?: string;
  AlarmARN?: string;
}
export const Alarm = S.suspend(() =>
  S.Struct({ AlarmName: S.optional(S.String), AlarmARN: S.optional(S.String) }),
).annotations({ identifier: "Alarm" }) as any as S.Schema<Alarm>;
export type Alarms = Alarm[];
export const Alarms = S.Array(Alarm);
export interface TargetTrackingMetricStat {
  Metric: Metric;
  Stat: string;
  Unit?: string;
  Period?: number;
}
export const TargetTrackingMetricStat = S.suspend(() =>
  S.Struct({
    Metric: Metric,
    Stat: S.String,
    Unit: S.optional(S.String),
    Period: S.optional(S.Number),
  }),
).annotations({
  identifier: "TargetTrackingMetricStat",
}) as any as S.Schema<TargetTrackingMetricStat>;
export interface TargetTrackingMetricDataQuery {
  Id: string;
  Expression?: string;
  MetricStat?: TargetTrackingMetricStat;
  Label?: string;
  Period?: number;
  ReturnData?: boolean;
}
export const TargetTrackingMetricDataQuery = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Expression: S.optional(S.String),
    MetricStat: S.optional(TargetTrackingMetricStat),
    Label: S.optional(S.String),
    Period: S.optional(S.Number),
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
  Period?: number;
  Metrics?: TargetTrackingMetricDataQueries;
}
export const CustomizedMetricSpecification = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    Namespace: S.optional(S.String),
    Dimensions: S.optional(MetricDimensions),
    Statistic: S.optional(S.String),
    Unit: S.optional(S.String),
    Period: S.optional(S.Number),
    Metrics: S.optional(TargetTrackingMetricDataQueries),
  }),
).annotations({
  identifier: "CustomizedMetricSpecification",
}) as any as S.Schema<CustomizedMetricSpecification>;
export interface TargetTrackingConfiguration {
  PredefinedMetricSpecification?: PredefinedMetricSpecification;
  CustomizedMetricSpecification?: CustomizedMetricSpecification;
  TargetValue: number;
  DisableScaleIn?: boolean;
}
export const TargetTrackingConfiguration = S.suspend(() =>
  S.Struct({
    PredefinedMetricSpecification: S.optional(PredefinedMetricSpecification),
    CustomizedMetricSpecification: S.optional(CustomizedMetricSpecification),
    TargetValue: S.Number,
    DisableScaleIn: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TargetTrackingConfiguration",
}) as any as S.Schema<TargetTrackingConfiguration>;
export type PredictiveScalingMetricSpecifications =
  PredictiveScalingMetricSpecification[];
export const PredictiveScalingMetricSpecifications = S.Array(
  PredictiveScalingMetricSpecification,
);
export interface PredictiveScalingConfiguration {
  MetricSpecifications: PredictiveScalingMetricSpecifications;
  Mode?: string;
  SchedulingBufferTime?: number;
  MaxCapacityBreachBehavior?: string;
  MaxCapacityBuffer?: number;
}
export const PredictiveScalingConfiguration = S.suspend(() =>
  S.Struct({
    MetricSpecifications: PredictiveScalingMetricSpecifications,
    Mode: S.optional(S.String),
    SchedulingBufferTime: S.optional(S.Number),
    MaxCapacityBreachBehavior: S.optional(S.String),
    MaxCapacityBuffer: S.optional(S.Number),
  }),
).annotations({
  identifier: "PredictiveScalingConfiguration",
}) as any as S.Schema<PredictiveScalingConfiguration>;
export interface ScalingPolicy {
  AutoScalingGroupName?: string;
  PolicyName?: string;
  PolicyARN?: string;
  PolicyType?: string;
  AdjustmentType?: string;
  MinAdjustmentStep?: number;
  MinAdjustmentMagnitude?: number;
  ScalingAdjustment?: number;
  Cooldown?: number;
  StepAdjustments?: StepAdjustments;
  MetricAggregationType?: string;
  EstimatedInstanceWarmup?: number;
  Alarms?: Alarms;
  TargetTrackingConfiguration?: TargetTrackingConfiguration;
  Enabled?: boolean;
  PredictiveScalingConfiguration?: PredictiveScalingConfiguration;
}
export const ScalingPolicy = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ScalingPolicy",
}) as any as S.Schema<ScalingPolicy>;
export type ScalingPolicies = ScalingPolicy[];
export const ScalingPolicies = S.Array(ScalingPolicy);
export interface PoliciesType {
  ScalingPolicies?: ScalingPolicies;
  NextToken?: string;
}
export const PoliciesType = S.suspend(() =>
  S.Struct({
    ScalingPolicies: S.optional(ScalingPolicies),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({ identifier: "PoliciesType" }) as any as S.Schema<PoliciesType>;
export interface StartInstanceRefreshAnswer {
  InstanceRefreshId?: string;
}
export const StartInstanceRefreshAnswer = S.suspend(() =>
  S.Struct({ InstanceRefreshId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartInstanceRefreshAnswer",
}) as any as S.Schema<StartInstanceRefreshAnswer>;
export interface SuspendedProcess {
  ProcessName?: string;
  SuspensionReason?: string;
}
export const SuspendedProcess = S.suspend(() =>
  S.Struct({
    ProcessName: S.optional(S.String),
    SuspensionReason: S.optional(S.String),
  }),
).annotations({
  identifier: "SuspendedProcess",
}) as any as S.Schema<SuspendedProcess>;
export type SuspendedProcesses = SuspendedProcess[];
export const SuspendedProcesses = S.Array(SuspendedProcess);
export interface EnabledMetric {
  Metric?: string;
  Granularity?: string;
}
export const EnabledMetric = S.suspend(() =>
  S.Struct({ Metric: S.optional(S.String), Granularity: S.optional(S.String) }),
).annotations({
  identifier: "EnabledMetric",
}) as any as S.Schema<EnabledMetric>;
export type EnabledMetrics = EnabledMetric[];
export const EnabledMetrics = S.Array(EnabledMetric);
export interface AutoScalingGroup {
  AutoScalingGroupName: string;
  AutoScalingGroupARN?: string;
  LaunchConfigurationName?: string;
  LaunchTemplate?: LaunchTemplateSpecification;
  MixedInstancesPolicy?: MixedInstancesPolicy;
  MinSize: number;
  MaxSize: number;
  DesiredCapacity: number;
  PredictedCapacity?: number;
  DefaultCooldown: number;
  AvailabilityZones: AvailabilityZones;
  LoadBalancerNames?: LoadBalancerNames;
  TargetGroupARNs?: TargetGroupARNs;
  HealthCheckType: string;
  HealthCheckGracePeriod?: number;
  Instances?: Instances;
  CreatedTime: Date;
  SuspendedProcesses?: SuspendedProcesses;
  PlacementGroup?: string;
  VPCZoneIdentifier?: string;
  EnabledMetrics?: EnabledMetrics;
  Status?: string;
  Tags?: TagDescriptionList;
  TerminationPolicies?: TerminationPolicies;
  NewInstancesProtectedFromScaleIn?: boolean;
  ServiceLinkedRoleARN?: string;
  MaxInstanceLifetime?: number;
  CapacityRebalance?: boolean;
  WarmPoolConfiguration?: WarmPoolConfiguration;
  WarmPoolSize?: number;
  Context?: string;
  DesiredCapacityType?: string;
  DefaultInstanceWarmup?: number;
  TrafficSources?: TrafficSources;
  InstanceMaintenancePolicy?: InstanceMaintenancePolicy;
  AvailabilityZoneDistribution?: AvailabilityZoneDistribution;
  AvailabilityZoneImpairmentPolicy?: AvailabilityZoneImpairmentPolicy;
  CapacityReservationSpecification?: CapacityReservationSpecification;
  InstanceLifecyclePolicy?: InstanceLifecyclePolicy;
}
export const AutoScalingGroup = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "AutoScalingGroup",
}) as any as S.Schema<AutoScalingGroup>;
export type AutoScalingGroups = AutoScalingGroup[];
export const AutoScalingGroups = S.Array(AutoScalingGroup);
export interface InstanceRefresh {
  InstanceRefreshId?: string;
  AutoScalingGroupName?: string;
  Status?: string;
  StatusReason?: string;
  StartTime?: Date;
  EndTime?: Date;
  PercentageComplete?: number;
  InstancesToUpdate?: number;
  ProgressDetails?: InstanceRefreshProgressDetails;
  Preferences?: RefreshPreferences;
  DesiredConfiguration?: DesiredConfiguration;
  RollbackDetails?: RollbackDetails;
  Strategy?: string;
}
export const InstanceRefresh = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "InstanceRefresh",
}) as any as S.Schema<InstanceRefresh>;
export type InstanceRefreshes = InstanceRefresh[];
export const InstanceRefreshes = S.Array(InstanceRefresh);
export interface AutoScalingGroupsType {
  AutoScalingGroups: AutoScalingGroups;
  NextToken?: string;
}
export const AutoScalingGroupsType = S.suspend(() =>
  S.Struct({
    AutoScalingGroups: AutoScalingGroups,
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "AutoScalingGroupsType",
}) as any as S.Schema<AutoScalingGroupsType>;
export interface DescribeInstanceRefreshesAnswer {
  InstanceRefreshes?: InstanceRefreshes;
  NextToken?: string;
}
export const DescribeInstanceRefreshesAnswer = S.suspend(() =>
  S.Struct({
    InstanceRefreshes: S.optional(InstanceRefreshes),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeInstanceRefreshesAnswer",
}) as any as S.Schema<DescribeInstanceRefreshesAnswer>;
export interface PutScalingPolicyType {
  AutoScalingGroupName: string;
  PolicyName: string;
  PolicyType?: string;
  AdjustmentType?: string;
  MinAdjustmentStep?: number;
  MinAdjustmentMagnitude?: number;
  ScalingAdjustment?: number;
  Cooldown?: number;
  MetricAggregationType?: string;
  StepAdjustments?: StepAdjustments;
  EstimatedInstanceWarmup?: number;
  TargetTrackingConfiguration?: TargetTrackingConfiguration;
  Enabled?: boolean;
  PredictiveScalingConfiguration?: PredictiveScalingConfiguration;
}
export const PutScalingPolicyType = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutScalingPolicyType",
}) as any as S.Schema<PutScalingPolicyType>;
export interface PolicyARNType {
  PolicyARN?: string;
  Alarms?: Alarms;
}
export const PolicyARNType = S.suspend(() =>
  S.Struct({
    PolicyARN: S.optional(S.String),
    Alarms: S.optional(Alarms),
  }).pipe(ns),
).annotations({
  identifier: "PolicyARNType",
}) as any as S.Schema<PolicyARNType>;
export interface CreateAutoScalingGroupType {
  AutoScalingGroupName: string;
  LaunchConfigurationName?: string;
  LaunchTemplate?: LaunchTemplateSpecification;
  MixedInstancesPolicy?: MixedInstancesPolicy;
  InstanceId?: string;
  MinSize: number;
  MaxSize: number;
  DesiredCapacity?: number;
  DefaultCooldown?: number;
  AvailabilityZones?: AvailabilityZones;
  LoadBalancerNames?: LoadBalancerNames;
  TargetGroupARNs?: TargetGroupARNs;
  HealthCheckType?: string;
  HealthCheckGracePeriod?: number;
  PlacementGroup?: string;
  VPCZoneIdentifier?: string;
  TerminationPolicies?: TerminationPolicies;
  NewInstancesProtectedFromScaleIn?: boolean;
  CapacityRebalance?: boolean;
  LifecycleHookSpecificationList?: LifecycleHookSpecifications;
  Tags?: Tags;
  ServiceLinkedRoleARN?: string;
  MaxInstanceLifetime?: number;
  Context?: string;
  DesiredCapacityType?: string;
  DefaultInstanceWarmup?: number;
  TrafficSources?: TrafficSources;
  InstanceMaintenancePolicy?: InstanceMaintenancePolicy;
  AvailabilityZoneDistribution?: AvailabilityZoneDistribution;
  AvailabilityZoneImpairmentPolicy?: AvailabilityZoneImpairmentPolicy;
  SkipZonalShiftValidation?: boolean;
  CapacityReservationSpecification?: CapacityReservationSpecification;
  InstanceLifecyclePolicy?: InstanceLifecyclePolicy;
}
export const CreateAutoScalingGroupType = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAutoScalingGroupType",
}) as any as S.Schema<CreateAutoScalingGroupType>;
export interface CreateAutoScalingGroupResponse {}
export const CreateAutoScalingGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateAutoScalingGroupResponse",
}) as any as S.Schema<CreateAutoScalingGroupResponse>;

//# Errors
export class ResourceContentionFault extends S.TaggedError<ResourceContentionFault>()(
  "ResourceContentionFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceContention", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class InstanceRefreshInProgressFault extends S.TaggedError<InstanceRefreshInProgressFault>()(
  "InstanceRefreshInProgressFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InstanceRefreshInProgress", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class AlreadyExistsFault extends S.TaggedError<AlreadyExistsFault>()(
  "AlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class LimitExceededFault extends S.TaggedError<LimitExceededFault>()(
  "LimitExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "LimitExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ResourceInUseFault extends S.TaggedError<ResourceInUseFault>()(
  "ResourceInUseFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ResourceInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ScalingActivityInProgressFault extends S.TaggedError<ScalingActivityInProgressFault>()(
  "ScalingActivityInProgressFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ScalingActivityInProgress", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ServiceLinkedRoleFailure extends S.TaggedError<ServiceLinkedRoleFailure>()(
  "ServiceLinkedRoleFailure",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ServiceLinkedRoleFailure", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class ActiveInstanceRefreshNotFoundFault extends S.TaggedError<ActiveInstanceRefreshNotFoundFault>()(
  "ActiveInstanceRefreshNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ActiveInstanceRefreshNotFound",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidNextToken extends S.TaggedError<InvalidNextToken>()(
  "InvalidNextToken",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidNextToken", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class IdempotentParameterMismatchError extends S.TaggedError<IdempotentParameterMismatchError>()(
  "IdempotentParameterMismatchError",
  { Message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IdempotentParameterMismatch",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class IrreversibleInstanceRefreshFault extends S.TaggedError<IrreversibleInstanceRefreshFault>()(
  "IrreversibleInstanceRefreshFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "IrreversibleInstanceRefresh",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}

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
export const completeLifecycleAction: (
  input: CompleteLifecycleActionType,
) => Effect.Effect<
  CompleteLifecycleActionAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CompleteLifecycleActionType,
  output: CompleteLifecycleActionAnswer,
  errors: [ResourceContentionFault],
}));
/**
 * Deletes the specified lifecycle hook.
 *
 * If there are any outstanding lifecycle actions, they are completed first
 * (`ABANDON` for launching instances, `CONTINUE` for terminating
 * instances).
 */
export const deleteLifecycleHook: (
  input: DeleteLifecycleHookType,
) => Effect.Effect<
  DeleteLifecycleHookAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLifecycleHookType,
  output: DeleteLifecycleHookAnswer,
  errors: [ResourceContentionFault],
}));
/**
 * Deletes the specified notification.
 */
export const deleteNotificationConfiguration: (
  input: DeleteNotificationConfigurationType,
) => Effect.Effect<
  DeleteNotificationConfigurationResponse,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNotificationConfigurationType,
  output: DeleteNotificationConfigurationResponse,
  errors: [ResourceContentionFault],
}));
/**
 * Deletes the specified scheduled action.
 */
export const deleteScheduledAction: (
  input: DeleteScheduledActionType,
) => Effect.Effect<
  DeleteScheduledActionResponse,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteScheduledActionType,
  output: DeleteScheduledActionResponse,
  errors: [ResourceContentionFault],
}));
/**
 * Describes the current Amazon EC2 Auto Scaling resource quotas for your account.
 *
 * When you establish an Amazon Web Services account, the account has initial quotas on the maximum
 * number of Auto Scaling groups and launch configurations that you can create in a given Region.
 * For more information, see Quotas for
 * Amazon EC2 Auto Scaling in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const describeAccountLimits: (
  input: DescribeAccountLimitsRequest,
) => Effect.Effect<
  DescribeAccountLimitsAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountLimitsRequest,
  output: DescribeAccountLimitsAnswer,
  errors: [ResourceContentionFault],
}));
/**
 * Describes the notification types that are supported by Amazon EC2 Auto Scaling.
 */
export const describeAutoScalingNotificationTypes: (
  input: DescribeAutoScalingNotificationTypesRequest,
) => Effect.Effect<
  DescribeAutoScalingNotificationTypesAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeLifecycleHookTypes: (
  input: DescribeLifecycleHookTypesRequest,
) => Effect.Effect<
  DescribeLifecycleHookTypesAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLifecycleHookTypesRequest,
  output: DescribeLifecycleHookTypesAnswer,
  errors: [ResourceContentionFault],
}));
/**
 * Describes the termination policies supported by Amazon EC2 Auto Scaling.
 *
 * For more information, see Configure
 * termination policies for Amazon EC2 Auto Scaling in the
 * *Amazon EC2 Auto Scaling User Guide*.
 */
export const describeTerminationPolicyTypes: (
  input: DescribeTerminationPolicyTypesRequest,
) => Effect.Effect<
  DescribeTerminationPolicyTypesAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const detachLoadBalancers: (
  input: DetachLoadBalancersType,
) => Effect.Effect<
  DetachLoadBalancersResultType,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const detachLoadBalancerTargetGroups: (
  input: DetachLoadBalancerTargetGroupsType,
) => Effect.Effect<
  DetachLoadBalancerTargetGroupsResultType,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const detachTrafficSources: (
  input: DetachTrafficSourcesType,
) => Effect.Effect<
  DetachTrafficSourcesResultType,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachTrafficSourcesType,
  output: DetachTrafficSourcesResultType,
  errors: [ResourceContentionFault],
}));
/**
 * Disables group metrics collection for the specified Auto Scaling group.
 */
export const disableMetricsCollection: (
  input: DisableMetricsCollectionQuery,
) => Effect.Effect<
  DisableMetricsCollectionResponse,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableMetricsCollectionQuery,
  output: DisableMetricsCollectionResponse,
  errors: [ResourceContentionFault],
}));
/**
 * Enables group metrics collection for the specified Auto Scaling group.
 *
 * You can use these metrics to track changes in an Auto Scaling group and to set alarms on
 * threshold values. You can view group metrics using the Amazon EC2 Auto Scaling console or the CloudWatch
 * console. For more information, see Monitor
 * CloudWatch metrics for your Auto Scaling groups and instances in the
 * *Amazon EC2 Auto Scaling User Guide*.
 */
export const enableMetricsCollection: (
  input: EnableMetricsCollectionQuery,
) => Effect.Effect<
  EnableMetricsCollectionResponse,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableMetricsCollectionQuery,
  output: EnableMetricsCollectionResponse,
  errors: [ResourceContentionFault],
}));
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
export const recordLifecycleActionHeartbeat: (
  input: RecordLifecycleActionHeartbeatType,
) => Effect.Effect<
  RecordLifecycleActionHeartbeatAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const setInstanceHealth: (
  input: SetInstanceHealthQuery,
) => Effect.Effect<
  SetInstanceHealthResponse,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeAdjustmentTypes: (
  input: DescribeAdjustmentTypesRequest,
) => Effect.Effect<
  DescribeAdjustmentTypesAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAdjustmentTypesRequest,
  output: DescribeAdjustmentTypesAnswer,
  errors: [ResourceContentionFault],
}));
/**
 * Describes the available CloudWatch metrics for Amazon EC2 Auto Scaling.
 */
export const describeMetricCollectionTypes: (
  input: DescribeMetricCollectionTypesRequest,
) => Effect.Effect<
  DescribeMetricCollectionTypesAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMetricCollectionTypesRequest,
  output: DescribeMetricCollectionTypesAnswer,
  errors: [ResourceContentionFault],
}));
/**
 * Describes the scaling process types for use with the ResumeProcesses
 * and SuspendProcesses APIs.
 */
export const describeScalingProcessTypes: (
  input: DescribeScalingProcessTypesRequest,
) => Effect.Effect<
  ProcessesType,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeScalingProcessTypesRequest,
  output: ProcessesType,
  errors: [ResourceContentionFault],
}));
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
export const detachInstances: (
  input: DetachInstancesQuery,
) => Effect.Effect<
  DetachInstancesAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const enterStandby: (
  input: EnterStandbyQuery,
) => Effect.Effect<
  EnterStandbyAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const exitStandby: (
  input: ExitStandbyQuery,
) => Effect.Effect<
  ExitStandbyAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putWarmPool: (
  input: PutWarmPoolType,
) => Effect.Effect<
  PutWarmPoolAnswer,
  | InstanceRefreshInProgressFault
  | LimitExceededFault
  | ResourceContentionFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const suspendProcesses: (
  input: ScalingProcessQuery,
) => Effect.Effect<
  SuspendProcessesResponse,
  ResourceContentionFault | ResourceInUseFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putScheduledUpdateGroupAction: (
  input: PutScheduledUpdateGroupActionType,
) => Effect.Effect<
  PutScheduledUpdateGroupActionResponse,
  | AlreadyExistsFault
  | LimitExceededFault
  | ResourceContentionFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putLifecycleHook: (
  input: PutLifecycleHookType,
) => Effect.Effect<
  PutLifecycleHookAnswer,
  LimitExceededFault | ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const setInstanceProtection: (
  input: SetInstanceProtectionQuery,
) => Effect.Effect<
  SetInstanceProtectionAnswer,
  LimitExceededFault | ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetInstanceProtectionQuery,
  output: SetInstanceProtectionAnswer,
  errors: [LimitExceededFault, ResourceContentionFault],
}));
/**
 * Creates or updates tags for the specified Auto Scaling group.
 *
 * When you specify a tag with a key that already exists, the operation overwrites the
 * previous tag definition, and you do not get an error message.
 *
 * For more information, see Tag Auto Scaling groups and
 * instances in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const createOrUpdateTags: (
  input: CreateOrUpdateTagsType,
) => Effect.Effect<
  CreateOrUpdateTagsResponse,
  | AlreadyExistsFault
  | LimitExceededFault
  | ResourceContentionFault
  | ResourceInUseFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const attachInstances: (
  input: AttachInstancesQuery,
) => Effect.Effect<
  AttachInstancesResponse,
  ResourceContentionFault | ServiceLinkedRoleFailure | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAutoScalingGroup: (
  input: DeleteAutoScalingGroupType,
) => Effect.Effect<
  DeleteAutoScalingGroupResponse,
  | ResourceContentionFault
  | ResourceInUseFault
  | ScalingActivityInProgressFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAutoScalingGroupType,
  output: DeleteAutoScalingGroupResponse,
  errors: [
    ResourceContentionFault,
    ResourceInUseFault,
    ScalingActivityInProgressFault,
  ],
}));
/**
 * Deletes the specified launch configuration.
 *
 * The launch configuration must not be attached to an Auto Scaling group. When this call
 * completes, the launch configuration is no longer available for use.
 */
export const deleteLaunchConfiguration: (
  input: LaunchConfigurationNameType,
) => Effect.Effect<
  DeleteLaunchConfigurationResponse,
  ResourceContentionFault | ResourceInUseFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: LaunchConfigurationNameType,
  output: DeleteLaunchConfigurationResponse,
  errors: [ResourceContentionFault, ResourceInUseFault],
}));
/**
 * Deletes the specified tags.
 */
export const deleteTags: (
  input: DeleteTagsType,
) => Effect.Effect<
  DeleteTagsResponse,
  ResourceContentionFault | ResourceInUseFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const resumeProcesses: (
  input: ScalingProcessQuery,
) => Effect.Effect<
  ResumeProcessesResponse,
  ResourceContentionFault | ResourceInUseFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteWarmPool: (
  input: DeleteWarmPoolType,
) => Effect.Effect<
  DeleteWarmPoolAnswer,
  | LimitExceededFault
  | ResourceContentionFault
  | ResourceInUseFault
  | ScalingActivityInProgressFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const executePolicy: (
  input: ExecutePolicyType,
) => Effect.Effect<
  ExecutePolicyResponse,
  ResourceContentionFault | ScalingActivityInProgressFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const setDesiredCapacity: (
  input: SetDesiredCapacityType,
) => Effect.Effect<
  SetDesiredCapacityResponse,
  ResourceContentionFault | ScalingActivityInProgressFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const terminateInstanceInAutoScalingGroup: (
  input: TerminateInstanceInAutoScalingGroupType,
) => Effect.Effect<
  ActivityType,
  ResourceContentionFault | ScalingActivityInProgressFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePolicy: (
  input: DeletePolicyType,
) => Effect.Effect<
  DeletePolicyResponse,
  ResourceContentionFault | ServiceLinkedRoleFailure | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const attachLoadBalancers: (
  input: AttachLoadBalancersType,
) => Effect.Effect<
  AttachLoadBalancersResultType,
  | InstanceRefreshInProgressFault
  | ResourceContentionFault
  | ServiceLinkedRoleFailure
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const attachTrafficSources: (
  input: AttachTrafficSourcesType,
) => Effect.Effect<
  AttachTrafficSourcesResultType,
  | InstanceRefreshInProgressFault
  | ResourceContentionFault
  | ServiceLinkedRoleFailure
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachTrafficSourcesType,
  output: AttachTrafficSourcesResultType,
  errors: [
    InstanceRefreshInProgressFault,
    ResourceContentionFault,
    ServiceLinkedRoleFailure,
  ],
}));
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
export const updateAutoScalingGroup: (
  input: UpdateAutoScalingGroupType,
) => Effect.Effect<
  UpdateAutoScalingGroupResponse,
  | ResourceContentionFault
  | ScalingActivityInProgressFault
  | ServiceLinkedRoleFailure
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAutoScalingGroupType,
  output: UpdateAutoScalingGroupResponse,
  errors: [
    ResourceContentionFault,
    ScalingActivityInProgressFault,
    ServiceLinkedRoleFailure,
  ],
}));
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
export const attachLoadBalancerTargetGroups: (
  input: AttachLoadBalancerTargetGroupsType,
) => Effect.Effect<
  AttachLoadBalancerTargetGroupsResultType,
  | InstanceRefreshInProgressFault
  | ResourceContentionFault
  | ServiceLinkedRoleFailure
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putNotificationConfiguration: (
  input: PutNotificationConfigurationType,
) => Effect.Effect<
  PutNotificationConfigurationResponse,
  | LimitExceededFault
  | ResourceContentionFault
  | ServiceLinkedRoleFailure
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDeleteScheduledAction: (
  input: BatchDeleteScheduledActionType,
) => Effect.Effect<
  BatchDeleteScheduledActionAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteScheduledActionType,
  output: BatchDeleteScheduledActionAnswer,
  errors: [ResourceContentionFault],
}));
/**
 * Creates or updates one or more scheduled scaling actions for an Auto Scaling group.
 */
export const batchPutScheduledUpdateGroupAction: (
  input: BatchPutScheduledUpdateGroupActionType,
) => Effect.Effect<
  BatchPutScheduledUpdateGroupActionAnswer,
  | AlreadyExistsFault
  | LimitExceededFault
  | ResourceContentionFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelInstanceRefresh: (
  input: CancelInstanceRefreshType,
) => Effect.Effect<
  CancelInstanceRefreshAnswer,
  | ActiveInstanceRefreshNotFoundFault
  | LimitExceededFault
  | ResourceContentionFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelInstanceRefreshType,
  output: CancelInstanceRefreshAnswer,
  errors: [
    ActiveInstanceRefreshNotFoundFault,
    LimitExceededFault,
    ResourceContentionFault,
  ],
}));
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
export const createLaunchConfiguration: (
  input: CreateLaunchConfigurationType,
) => Effect.Effect<
  CreateLaunchConfigurationResponse,
  | AlreadyExistsFault
  | LimitExceededFault
  | ResourceContentionFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLaunchConfigurationType,
  output: CreateLaunchConfigurationResponse,
  errors: [AlreadyExistsFault, LimitExceededFault, ResourceContentionFault],
}));
/**
 * Gets information about the lifecycle hooks for the specified Auto Scaling group.
 */
export const describeLifecycleHooks: (
  input: DescribeLifecycleHooksType,
) => Effect.Effect<
  DescribeLifecycleHooksAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLifecycleHooksType,
  output: DescribeLifecycleHooksAnswer,
  errors: [ResourceContentionFault],
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
 *
 * For more information, see Predictive
 * scaling for Amazon EC2 Auto Scaling in the *Amazon EC2 Auto Scaling User Guide*.
 */
export const getPredictiveScalingForecast: (
  input: GetPredictiveScalingForecastType,
) => Effect.Effect<
  GetPredictiveScalingForecastAnswer,
  ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPredictiveScalingForecastType,
  output: GetPredictiveScalingForecastAnswer,
  errors: [ResourceContentionFault],
}));
/**
 * Gets information about the Auto Scaling instances in the account and Region.
 */
export const describeAutoScalingInstances: {
  (
    input: DescribeAutoScalingInstancesType,
  ): Effect.Effect<
    AutoScalingInstancesType,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAutoScalingInstancesType,
  ) => Stream.Stream<
    AutoScalingInstancesType,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAutoScalingInstancesType,
  ) => Stream.Stream<
    AutoScalingInstanceDetails,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describePolicies: {
  (
    input: DescribePoliciesType,
  ): Effect.Effect<
    PoliciesType,
    | InvalidNextToken
    | ResourceContentionFault
    | ServiceLinkedRoleFailure
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribePoliciesType,
  ) => Stream.Stream<
    PoliciesType,
    | InvalidNextToken
    | ResourceContentionFault
    | ServiceLinkedRoleFailure
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribePoliciesType,
  ) => Stream.Stream<
    ScalingPolicy,
    | InvalidNextToken
    | ResourceContentionFault
    | ServiceLinkedRoleFailure
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribePoliciesType,
  output: PoliciesType,
  errors: [InvalidNextToken, ResourceContentionFault, ServiceLinkedRoleFailure],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ScalingPolicies",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Launches a specified number of instances in an Auto Scaling group. Returns instance IDs and
 * other details if launch is successful or error details if launch is unsuccessful.
 */
export const launchInstances: (
  input: LaunchInstancesRequest,
) => Effect.Effect<
  LaunchInstancesResult,
  IdempotentParameterMismatchError | ResourceContentionFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startInstanceRefresh: (
  input: StartInstanceRefreshType,
) => Effect.Effect<
  StartInstanceRefreshAnswer,
  | InstanceRefreshInProgressFault
  | LimitExceededFault
  | ResourceContentionFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartInstanceRefreshType,
  output: StartInstanceRefreshAnswer,
  errors: [
    InstanceRefreshInProgressFault,
    LimitExceededFault,
    ResourceContentionFault,
  ],
}));
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
export const rollbackInstanceRefresh: (
  input: RollbackInstanceRefreshType,
) => Effect.Effect<
  RollbackInstanceRefreshAnswer,
  | ActiveInstanceRefreshNotFoundFault
  | IrreversibleInstanceRefreshFault
  | LimitExceededFault
  | ResourceContentionFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RollbackInstanceRefreshType,
  output: RollbackInstanceRefreshAnswer,
  errors: [
    ActiveInstanceRefreshNotFoundFault,
    IrreversibleInstanceRefreshFault,
    LimitExceededFault,
    ResourceContentionFault,
  ],
}));
/**
 * Gets information about the launch configurations in the account and Region.
 */
export const describeLaunchConfigurations: {
  (
    input: LaunchConfigurationNamesType,
  ): Effect.Effect<
    LaunchConfigurationsType,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: LaunchConfigurationNamesType,
  ) => Stream.Stream<
    LaunchConfigurationsType,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: LaunchConfigurationNamesType,
  ) => Stream.Stream<
    LaunchConfiguration,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeLoadBalancers: {
  (
    input: DescribeLoadBalancersRequest,
  ): Effect.Effect<
    DescribeLoadBalancersResponse,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeLoadBalancersRequest,
  ) => Stream.Stream<
    DescribeLoadBalancersResponse,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeLoadBalancersRequest,
  ) => Stream.Stream<
    unknown,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeLoadBalancerTargetGroups: {
  (
    input: DescribeLoadBalancerTargetGroupsRequest,
  ): Effect.Effect<
    DescribeLoadBalancerTargetGroupsResponse,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeLoadBalancerTargetGroupsRequest,
  ) => Stream.Stream<
    DescribeLoadBalancerTargetGroupsResponse,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeLoadBalancerTargetGroupsRequest,
  ) => Stream.Stream<
    unknown,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeNotificationConfigurations: {
  (
    input: DescribeNotificationConfigurationsType,
  ): Effect.Effect<
    DescribeNotificationConfigurationsAnswer,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeNotificationConfigurationsType,
  ) => Stream.Stream<
    DescribeNotificationConfigurationsAnswer,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeNotificationConfigurationsType,
  ) => Stream.Stream<
    NotificationConfiguration,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeScalingActivities: {
  (
    input: DescribeScalingActivitiesType,
  ): Effect.Effect<
    ActivitiesType,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeScalingActivitiesType,
  ) => Stream.Stream<
    ActivitiesType,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeScalingActivitiesType,
  ) => Stream.Stream<
    Activity,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeScheduledActions: {
  (
    input: DescribeScheduledActionsType,
  ): Effect.Effect<
    ScheduledActionsType,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeScheduledActionsType,
  ) => Stream.Stream<
    ScheduledActionsType,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeScheduledActionsType,
  ) => Stream.Stream<
    ScheduledUpdateGroupAction,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeTags: {
  (
    input: DescribeTagsType,
  ): Effect.Effect<
    TagsType,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTagsType,
  ) => Stream.Stream<
    TagsType,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTagsType,
  ) => Stream.Stream<
    TagDescription,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTagsType,
  output: TagsType,
  errors: [InvalidNextToken, ResourceContentionFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tags",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Gets information about the traffic sources for the specified Auto Scaling group.
 *
 * You can optionally provide a traffic source type. If you provide a traffic source
 * type, then the results only include that traffic source type.
 *
 * If you do not provide a traffic source type, then the results include all the traffic
 * sources for the specified Auto Scaling group.
 */
export const describeTrafficSources: {
  (
    input: DescribeTrafficSourcesRequest,
  ): Effect.Effect<
    DescribeTrafficSourcesResponse,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTrafficSourcesRequest,
  ) => Stream.Stream<
    DescribeTrafficSourcesResponse,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTrafficSourcesRequest,
  ) => Stream.Stream<
    unknown,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeWarmPool: {
  (
    input: DescribeWarmPoolType,
  ): Effect.Effect<
    DescribeWarmPoolAnswer,
    | InvalidNextToken
    | LimitExceededFault
    | ResourceContentionFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeWarmPoolType,
  ) => Stream.Stream<
    DescribeWarmPoolAnswer,
    | InvalidNextToken
    | LimitExceededFault
    | ResourceContentionFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeWarmPoolType,
  ) => Stream.Stream<
    Instance,
    | InvalidNextToken
    | LimitExceededFault
    | ResourceContentionFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeWarmPoolType,
  output: DescribeWarmPoolAnswer,
  errors: [InvalidNextToken, LimitExceededFault, ResourceContentionFault],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Instances",
    pageSize: "MaxRecords",
  } as const,
}));
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
export const describeAutoScalingGroups: {
  (
    input: AutoScalingGroupNamesType,
  ): Effect.Effect<
    AutoScalingGroupsType,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: AutoScalingGroupNamesType,
  ) => Stream.Stream<
    AutoScalingGroupsType,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: AutoScalingGroupNamesType,
  ) => Stream.Stream<
    AutoScalingGroup,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeInstanceRefreshes: {
  (
    input: DescribeInstanceRefreshesType,
  ): Effect.Effect<
    DescribeInstanceRefreshesAnswer,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeInstanceRefreshesType,
  ) => Stream.Stream<
    DescribeInstanceRefreshesAnswer,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeInstanceRefreshesType,
  ) => Stream.Stream<
    unknown,
    InvalidNextToken | ResourceContentionFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putScalingPolicy: (
  input: PutScalingPolicyType,
) => Effect.Effect<
  PolicyARNType,
  | LimitExceededFault
  | ResourceContentionFault
  | ServiceLinkedRoleFailure
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAutoScalingGroup: (
  input: CreateAutoScalingGroupType,
) => Effect.Effect<
  CreateAutoScalingGroupResponse,
  | AlreadyExistsFault
  | LimitExceededFault
  | ResourceContentionFault
  | ServiceLinkedRoleFailure
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAutoScalingGroupType,
  output: CreateAutoScalingGroupResponse,
  errors: [
    AlreadyExistsFault,
    LimitExceededFault,
    ResourceContentionFault,
    ServiceLinkedRoleFailure,
  ],
}));
