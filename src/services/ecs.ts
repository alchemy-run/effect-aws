import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const ns = T.XmlNamespace("http://ecs.amazonaws.com/doc/2014-11-13/");
const svc = T.AwsApiService({
  sdkId: "ECS",
  serviceShapeName: "AmazonEC2ContainerServiceV20141113",
});
const auth = T.AwsAuthSigv4({ name: "ecs" });
const ver = T.ServiceVersion("2014-11-13");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://ecs-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://ecs-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://ecs.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ecs.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type BoxedInteger = number;
export type BoxedBoolean = boolean;
export type TagKey = string;
export type TagValue = string;
export type CapacityProviderStrategyItemWeight = number;
export type CapacityProviderStrategyItemBase = number;
export type ECSVolumeName = string;
export type IAMRoleArn = string;
export type ManagedScalingTargetCapacity = number;
export type ManagedScalingStepSize = number;
export type ManagedScalingInstanceWarmupPeriod = number;
export type HookDetails = unknown;
export type PortNumber = number;
export type EBSKMSKeyId = string;
export type EBSVolumeType = string;
export type EBSSnapshotId = string;
export type SensitiveString = string | redacted.Redacted<string>;
export type TaskVolumeStorageGiB = number;
export type ExcludedInstanceType = string;
export type AllowedInstanceType = string;
export type Duration = number;
export type BoxedDouble = number;

//# Schemas
export type StringList = string[];
export const StringList = S.Array(S.String);
export type AvailabilityZoneRebalancing =
  | "ENABLED"
  | "DISABLED"
  | (string & {});
export const AvailabilityZoneRebalancing = S.String;
export type LaunchType =
  | "EC2"
  | "FARGATE"
  | "EXTERNAL"
  | "MANAGED_INSTANCES"
  | (string & {});
export const LaunchType = S.String;
export type SchedulingStrategy = "REPLICA" | "DAEMON" | (string & {});
export const SchedulingStrategy = S.String;
export type PropagateTags =
  | "TASK_DEFINITION"
  | "SERVICE"
  | "NONE"
  | (string & {});
export const PropagateTags = S.String;
export type SettingName =
  | "serviceLongArnFormat"
  | "taskLongArnFormat"
  | "containerInstanceLongArnFormat"
  | "awsvpcTrunking"
  | "containerInsights"
  | "fargateFIPSMode"
  | "tagResourceAuthorization"
  | "fargateTaskRetirementWaitPeriod"
  | "guardDutyActivate"
  | "defaultLogDriverMode"
  | "fargateEventWindows"
  | (string & {});
export const SettingName = S.String;
export type CapacityProviderField = "TAGS" | (string & {});
export const CapacityProviderField = S.String;
export type CapacityProviderFieldList = CapacityProviderField[];
export const CapacityProviderFieldList = S.Array(CapacityProviderField);
export type ClusterField =
  | "ATTACHMENTS"
  | "CONFIGURATIONS"
  | "SETTINGS"
  | "STATISTICS"
  | "TAGS"
  | (string & {});
export const ClusterField = S.String;
export type ClusterFieldList = ClusterField[];
export const ClusterFieldList = S.Array(ClusterField);
export type ContainerInstanceField =
  | "TAGS"
  | "CONTAINER_INSTANCE_HEALTH"
  | (string & {});
export const ContainerInstanceField = S.String;
export type ContainerInstanceFieldList = ContainerInstanceField[];
export const ContainerInstanceFieldList = S.Array(ContainerInstanceField);
export type ExpressGatewayServiceInclude = "TAGS" | (string & {});
export const ExpressGatewayServiceInclude = S.String;
export type ExpressGatewayServiceIncludeList = ExpressGatewayServiceInclude[];
export const ExpressGatewayServiceIncludeList = S.Array(
  ExpressGatewayServiceInclude,
);
export type ServiceField = "TAGS" | (string & {});
export const ServiceField = S.String;
export type ServiceFieldList = ServiceField[];
export const ServiceFieldList = S.Array(ServiceField);
export type TaskDefinitionField = "TAGS" | (string & {});
export const TaskDefinitionField = S.String;
export type TaskDefinitionFieldList = TaskDefinitionField[];
export const TaskDefinitionFieldList = S.Array(TaskDefinitionField);
export type TaskField = "TAGS" | (string & {});
export const TaskField = S.String;
export type TaskFieldList = TaskField[];
export const TaskFieldList = S.Array(TaskField);
export type TaskSetField = "TAGS" | (string & {});
export const TaskSetField = S.String;
export type TaskSetFieldList = TaskSetField[];
export const TaskSetFieldList = S.Array(TaskSetField);
export type TargetType = "container-instance" | (string & {});
export const TargetType = S.String;
export type ContainerInstanceStatus =
  | "ACTIVE"
  | "DRAINING"
  | "REGISTERING"
  | "DEREGISTERING"
  | "REGISTRATION_FAILED"
  | (string & {});
export const ContainerInstanceStatus = S.String;
export type ServiceDeploymentStatus =
  | "PENDING"
  | "SUCCESSFUL"
  | "STOPPED"
  | "STOP_REQUESTED"
  | "IN_PROGRESS"
  | "ROLLBACK_REQUESTED"
  | "ROLLBACK_IN_PROGRESS"
  | "ROLLBACK_SUCCESSFUL"
  | "ROLLBACK_FAILED"
  | (string & {});
export const ServiceDeploymentStatus = S.String;
export type ServiceDeploymentStatusList = ServiceDeploymentStatus[];
export const ServiceDeploymentStatusList = S.Array(ServiceDeploymentStatus);
export type ResourceManagementType = "CUSTOMER" | "ECS" | (string & {});
export const ResourceManagementType = S.String;
export type TaskDefinitionFamilyStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "ALL"
  | (string & {});
export const TaskDefinitionFamilyStatus = S.String;
export type TaskDefinitionStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "DELETE_IN_PROGRESS"
  | (string & {});
export const TaskDefinitionStatus = S.String;
export type SortOrder = "ASC" | "DESC" | (string & {});
export const SortOrder = S.String;
export type DesiredStatus = "RUNNING" | "PENDING" | "STOPPED" | (string & {});
export const DesiredStatus = S.String;
export type NetworkMode = "bridge" | "host" | "awsvpc" | "none" | (string & {});
export const NetworkMode = S.String;
export type Compatibility =
  | "EC2"
  | "FARGATE"
  | "EXTERNAL"
  | "MANAGED_INSTANCES"
  | (string & {});
export const Compatibility = S.String;
export type CompatibilityList = Compatibility[];
export const CompatibilityList = S.Array(Compatibility);
export type PidMode = "host" | "task" | (string & {});
export const PidMode = S.String;
export type IpcMode = "host" | "task" | "none" | (string & {});
export const IpcMode = S.String;
export type StopServiceDeploymentStopType =
  | "ABORT"
  | "ROLLBACK"
  | (string & {});
export const StopServiceDeploymentStopType = S.String;
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface DeleteAccountSettingRequest {
  name: SettingName;
  principalArn?: string;
}
export const DeleteAccountSettingRequest = S.suspend(() =>
  S.Struct({ name: SettingName, principalArn: S.optional(S.String) }).pipe(
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
  identifier: "DeleteAccountSettingRequest",
}) as any as S.Schema<DeleteAccountSettingRequest>;
export interface DeleteCapacityProviderRequest {
  capacityProvider: string;
  cluster?: string;
}
export const DeleteCapacityProviderRequest = S.suspend(() =>
  S.Struct({ capacityProvider: S.String, cluster: S.optional(S.String) }).pipe(
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
  identifier: "DeleteCapacityProviderRequest",
}) as any as S.Schema<DeleteCapacityProviderRequest>;
export interface DeleteClusterRequest {
  cluster: string;
}
export const DeleteClusterRequest = S.suspend(() =>
  S.Struct({ cluster: S.String }).pipe(
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
  identifier: "DeleteClusterRequest",
}) as any as S.Schema<DeleteClusterRequest>;
export interface DeleteExpressGatewayServiceRequest {
  serviceArn: string;
}
export const DeleteExpressGatewayServiceRequest = S.suspend(() =>
  S.Struct({ serviceArn: S.String }).pipe(
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
  identifier: "DeleteExpressGatewayServiceRequest",
}) as any as S.Schema<DeleteExpressGatewayServiceRequest>;
export interface DeleteServiceRequest {
  cluster?: string;
  service: string;
  force?: boolean;
}
export const DeleteServiceRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    service: S.String,
    force: S.optional(S.Boolean),
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
  identifier: "DeleteServiceRequest",
}) as any as S.Schema<DeleteServiceRequest>;
export interface DeleteTaskDefinitionsRequest {
  taskDefinitions: string[];
}
export const DeleteTaskDefinitionsRequest = S.suspend(() =>
  S.Struct({ taskDefinitions: StringList }).pipe(
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
  identifier: "DeleteTaskDefinitionsRequest",
}) as any as S.Schema<DeleteTaskDefinitionsRequest>;
export interface DeleteTaskSetRequest {
  cluster: string;
  service: string;
  taskSet: string;
  force?: boolean;
}
export const DeleteTaskSetRequest = S.suspend(() =>
  S.Struct({
    cluster: S.String,
    service: S.String,
    taskSet: S.String,
    force: S.optional(S.Boolean),
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
  identifier: "DeleteTaskSetRequest",
}) as any as S.Schema<DeleteTaskSetRequest>;
export interface DeregisterContainerInstanceRequest {
  cluster?: string;
  containerInstance: string;
  force?: boolean;
}
export const DeregisterContainerInstanceRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    containerInstance: S.String,
    force: S.optional(S.Boolean),
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
  identifier: "DeregisterContainerInstanceRequest",
}) as any as S.Schema<DeregisterContainerInstanceRequest>;
export interface DeregisterTaskDefinitionRequest {
  taskDefinition: string;
}
export const DeregisterTaskDefinitionRequest = S.suspend(() =>
  S.Struct({ taskDefinition: S.String }).pipe(
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
  identifier: "DeregisterTaskDefinitionRequest",
}) as any as S.Schema<DeregisterTaskDefinitionRequest>;
export interface DescribeCapacityProvidersRequest {
  capacityProviders?: string[];
  cluster?: string;
  include?: CapacityProviderField[];
  maxResults?: number;
  nextToken?: string;
}
export const DescribeCapacityProvidersRequest = S.suspend(() =>
  S.Struct({
    capacityProviders: S.optional(StringList),
    cluster: S.optional(S.String),
    include: S.optional(CapacityProviderFieldList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
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
  identifier: "DescribeCapacityProvidersRequest",
}) as any as S.Schema<DescribeCapacityProvidersRequest>;
export interface DescribeClustersRequest {
  clusters?: string[];
  include?: ClusterField[];
}
export const DescribeClustersRequest = S.suspend(() =>
  S.Struct({
    clusters: S.optional(StringList),
    include: S.optional(ClusterFieldList),
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
  identifier: "DescribeClustersRequest",
}) as any as S.Schema<DescribeClustersRequest>;
export interface DescribeContainerInstancesRequest {
  cluster?: string;
  containerInstances: string[];
  include?: ContainerInstanceField[];
}
export const DescribeContainerInstancesRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    containerInstances: StringList,
    include: S.optional(ContainerInstanceFieldList),
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
  identifier: "DescribeContainerInstancesRequest",
}) as any as S.Schema<DescribeContainerInstancesRequest>;
export interface DescribeExpressGatewayServiceRequest {
  serviceArn: string;
  include?: ExpressGatewayServiceInclude[];
}
export const DescribeExpressGatewayServiceRequest = S.suspend(() =>
  S.Struct({
    serviceArn: S.String,
    include: S.optional(ExpressGatewayServiceIncludeList),
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
  identifier: "DescribeExpressGatewayServiceRequest",
}) as any as S.Schema<DescribeExpressGatewayServiceRequest>;
export interface DescribeServiceDeploymentsRequest {
  serviceDeploymentArns: string[];
}
export const DescribeServiceDeploymentsRequest = S.suspend(() =>
  S.Struct({ serviceDeploymentArns: StringList }).pipe(
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
  identifier: "DescribeServiceDeploymentsRequest",
}) as any as S.Schema<DescribeServiceDeploymentsRequest>;
export interface DescribeServiceRevisionsRequest {
  serviceRevisionArns: string[];
}
export const DescribeServiceRevisionsRequest = S.suspend(() =>
  S.Struct({ serviceRevisionArns: StringList }).pipe(
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
  identifier: "DescribeServiceRevisionsRequest",
}) as any as S.Schema<DescribeServiceRevisionsRequest>;
export interface DescribeServicesRequest {
  cluster?: string;
  services: string[];
  include?: ServiceField[];
}
export const DescribeServicesRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    services: StringList,
    include: S.optional(ServiceFieldList),
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
  identifier: "DescribeServicesRequest",
}) as any as S.Schema<DescribeServicesRequest>;
export interface DescribeTaskDefinitionRequest {
  taskDefinition: string;
  include?: TaskDefinitionField[];
}
export const DescribeTaskDefinitionRequest = S.suspend(() =>
  S.Struct({
    taskDefinition: S.String,
    include: S.optional(TaskDefinitionFieldList),
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
  identifier: "DescribeTaskDefinitionRequest",
}) as any as S.Schema<DescribeTaskDefinitionRequest>;
export interface DescribeTasksRequest {
  cluster?: string;
  tasks: string[];
  include?: TaskField[];
}
export const DescribeTasksRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    tasks: StringList,
    include: S.optional(TaskFieldList),
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
  identifier: "DescribeTasksRequest",
}) as any as S.Schema<DescribeTasksRequest>;
export interface DescribeTaskSetsRequest {
  cluster: string;
  service: string;
  taskSets?: string[];
  include?: TaskSetField[];
}
export const DescribeTaskSetsRequest = S.suspend(() =>
  S.Struct({
    cluster: S.String,
    service: S.String,
    taskSets: S.optional(StringList),
    include: S.optional(TaskSetFieldList),
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
  identifier: "DescribeTaskSetsRequest",
}) as any as S.Schema<DescribeTaskSetsRequest>;
export interface DiscoverPollEndpointRequest {
  containerInstance?: string;
  cluster?: string;
}
export const DiscoverPollEndpointRequest = S.suspend(() =>
  S.Struct({
    containerInstance: S.optional(S.String),
    cluster: S.optional(S.String),
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
  identifier: "DiscoverPollEndpointRequest",
}) as any as S.Schema<DiscoverPollEndpointRequest>;
export interface ExecuteCommandRequest {
  cluster?: string;
  container?: string;
  command: string;
  interactive: boolean;
  task: string;
}
export const ExecuteCommandRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    container: S.optional(S.String),
    command: S.String,
    interactive: S.Boolean,
    task: S.String,
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
  identifier: "ExecuteCommandRequest",
}) as any as S.Schema<ExecuteCommandRequest>;
export interface GetTaskProtectionRequest {
  cluster: string;
  tasks?: string[];
}
export const GetTaskProtectionRequest = S.suspend(() =>
  S.Struct({ cluster: S.String, tasks: S.optional(StringList) }).pipe(
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
  identifier: "GetTaskProtectionRequest",
}) as any as S.Schema<GetTaskProtectionRequest>;
export interface ListAccountSettingsRequest {
  name?: SettingName;
  value?: string;
  principalArn?: string;
  effectiveSettings?: boolean;
  nextToken?: string;
  maxResults?: number;
}
export const ListAccountSettingsRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(SettingName),
    value: S.optional(S.String),
    principalArn: S.optional(S.String),
    effectiveSettings: S.optional(S.Boolean),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
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
  identifier: "ListAccountSettingsRequest",
}) as any as S.Schema<ListAccountSettingsRequest>;
export interface ListAttributesRequest {
  cluster?: string;
  targetType: TargetType;
  attributeName?: string;
  attributeValue?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAttributesRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    targetType: TargetType,
    attributeName: S.optional(S.String),
    attributeValue: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
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
  identifier: "ListAttributesRequest",
}) as any as S.Schema<ListAttributesRequest>;
export interface ListClustersRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListClustersRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
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
  identifier: "ListClustersRequest",
}) as any as S.Schema<ListClustersRequest>;
export interface ListContainerInstancesRequest {
  cluster?: string;
  filter?: string;
  nextToken?: string;
  maxResults?: number;
  status?: ContainerInstanceStatus;
}
export const ListContainerInstancesRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    filter: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    status: S.optional(ContainerInstanceStatus),
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
  identifier: "ListContainerInstancesRequest",
}) as any as S.Schema<ListContainerInstancesRequest>;
export interface ListServicesRequest {
  cluster?: string;
  nextToken?: string;
  maxResults?: number;
  launchType?: LaunchType;
  schedulingStrategy?: SchedulingStrategy;
  resourceManagementType?: ResourceManagementType;
}
export const ListServicesRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    launchType: S.optional(LaunchType),
    schedulingStrategy: S.optional(SchedulingStrategy),
    resourceManagementType: S.optional(ResourceManagementType),
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
  identifier: "ListServicesRequest",
}) as any as S.Schema<ListServicesRequest>;
export interface ListServicesByNamespaceRequest {
  namespace: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListServicesByNamespaceRequest = S.suspend(() =>
  S.Struct({
    namespace: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
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
  identifier: "ListServicesByNamespaceRequest",
}) as any as S.Schema<ListServicesByNamespaceRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListTaskDefinitionFamiliesRequest {
  familyPrefix?: string;
  status?: TaskDefinitionFamilyStatus;
  nextToken?: string;
  maxResults?: number;
}
export const ListTaskDefinitionFamiliesRequest = S.suspend(() =>
  S.Struct({
    familyPrefix: S.optional(S.String),
    status: S.optional(TaskDefinitionFamilyStatus),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
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
  identifier: "ListTaskDefinitionFamiliesRequest",
}) as any as S.Schema<ListTaskDefinitionFamiliesRequest>;
export interface ListTaskDefinitionsRequest {
  familyPrefix?: string;
  status?: TaskDefinitionStatus;
  sort?: SortOrder;
  nextToken?: string;
  maxResults?: number;
}
export const ListTaskDefinitionsRequest = S.suspend(() =>
  S.Struct({
    familyPrefix: S.optional(S.String),
    status: S.optional(TaskDefinitionStatus),
    sort: S.optional(SortOrder),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
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
  identifier: "ListTaskDefinitionsRequest",
}) as any as S.Schema<ListTaskDefinitionsRequest>;
export interface ListTasksRequest {
  cluster?: string;
  containerInstance?: string;
  family?: string;
  nextToken?: string;
  maxResults?: number;
  startedBy?: string;
  serviceName?: string;
  desiredStatus?: DesiredStatus;
  launchType?: LaunchType;
}
export const ListTasksRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    containerInstance: S.optional(S.String),
    family: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    startedBy: S.optional(S.String),
    serviceName: S.optional(S.String),
    desiredStatus: S.optional(DesiredStatus),
    launchType: S.optional(LaunchType),
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
  identifier: "ListTasksRequest",
}) as any as S.Schema<ListTasksRequest>;
export interface PutAccountSettingRequest {
  name: SettingName;
  value: string;
  principalArn?: string;
}
export const PutAccountSettingRequest = S.suspend(() =>
  S.Struct({
    name: SettingName,
    value: S.String,
    principalArn: S.optional(S.String),
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
  identifier: "PutAccountSettingRequest",
}) as any as S.Schema<PutAccountSettingRequest>;
export interface PutAccountSettingDefaultRequest {
  name: SettingName;
  value: string;
}
export const PutAccountSettingDefaultRequest = S.suspend(() =>
  S.Struct({ name: SettingName, value: S.String }).pipe(
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
  identifier: "PutAccountSettingDefaultRequest",
}) as any as S.Schema<PutAccountSettingDefaultRequest>;
export interface Attribute {
  name: string;
  value?: string;
  targetType?: TargetType;
  targetId?: string;
}
export const Attribute = S.suspend(() =>
  S.Struct({
    name: S.String,
    value: S.optional(S.String),
    targetType: S.optional(TargetType),
    targetId: S.optional(S.String),
  }),
).annotations({ identifier: "Attribute" }) as any as S.Schema<Attribute>;
export type Attributes = Attribute[];
export const Attributes = S.Array(Attribute);
export interface PutAttributesRequest {
  cluster?: string;
  attributes: Attribute[];
}
export const PutAttributesRequest = S.suspend(() =>
  S.Struct({ cluster: S.optional(S.String), attributes: Attributes }).pipe(
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
  identifier: "PutAttributesRequest",
}) as any as S.Schema<PutAttributesRequest>;
export interface CapacityProviderStrategyItem {
  capacityProvider: string;
  weight?: number;
  base?: number;
}
export const CapacityProviderStrategyItem = S.suspend(() =>
  S.Struct({
    capacityProvider: S.String,
    weight: S.optional(S.Number),
    base: S.optional(S.Number),
  }),
).annotations({
  identifier: "CapacityProviderStrategyItem",
}) as any as S.Schema<CapacityProviderStrategyItem>;
export type CapacityProviderStrategy = CapacityProviderStrategyItem[];
export const CapacityProviderStrategy = S.Array(CapacityProviderStrategyItem);
export interface PutClusterCapacityProvidersRequest {
  cluster: string;
  capacityProviders: string[];
  defaultCapacityProviderStrategy: CapacityProviderStrategyItem[];
}
export const PutClusterCapacityProvidersRequest = S.suspend(() =>
  S.Struct({
    cluster: S.String,
    capacityProviders: StringList,
    defaultCapacityProviderStrategy: CapacityProviderStrategy,
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
  identifier: "PutClusterCapacityProvidersRequest",
}) as any as S.Schema<PutClusterCapacityProvidersRequest>;
export type AssignPublicIp = "ENABLED" | "DISABLED" | (string & {});
export const AssignPublicIp = S.String;
export interface AwsVpcConfiguration {
  subnets: string[];
  securityGroups?: string[];
  assignPublicIp?: AssignPublicIp;
}
export const AwsVpcConfiguration = S.suspend(() =>
  S.Struct({
    subnets: StringList,
    securityGroups: S.optional(StringList),
    assignPublicIp: S.optional(AssignPublicIp),
  }),
).annotations({
  identifier: "AwsVpcConfiguration",
}) as any as S.Schema<AwsVpcConfiguration>;
export interface NetworkConfiguration {
  awsvpcConfiguration?: AwsVpcConfiguration;
}
export const NetworkConfiguration = S.suspend(() =>
  S.Struct({ awsvpcConfiguration: S.optional(AwsVpcConfiguration) }),
).annotations({
  identifier: "NetworkConfiguration",
}) as any as S.Schema<NetworkConfiguration>;
export interface KeyValuePair {
  name?: string;
  value?: string;
}
export const KeyValuePair = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "KeyValuePair" }) as any as S.Schema<KeyValuePair>;
export type EnvironmentVariables = KeyValuePair[];
export const EnvironmentVariables = S.Array(KeyValuePair);
export type EnvironmentFileType = "s3" | (string & {});
export const EnvironmentFileType = S.String;
export interface EnvironmentFile {
  value: string;
  type: EnvironmentFileType;
}
export const EnvironmentFile = S.suspend(() =>
  S.Struct({ value: S.String, type: EnvironmentFileType }),
).annotations({
  identifier: "EnvironmentFile",
}) as any as S.Schema<EnvironmentFile>;
export type EnvironmentFiles = EnvironmentFile[];
export const EnvironmentFiles = S.Array(EnvironmentFile);
export type ResourceType = "GPU" | "InferenceAccelerator" | (string & {});
export const ResourceType = S.String;
export interface ResourceRequirement {
  value: string;
  type: ResourceType;
}
export const ResourceRequirement = S.suspend(() =>
  S.Struct({ value: S.String, type: ResourceType }),
).annotations({
  identifier: "ResourceRequirement",
}) as any as S.Schema<ResourceRequirement>;
export type ResourceRequirements = ResourceRequirement[];
export const ResourceRequirements = S.Array(ResourceRequirement);
export interface ContainerOverride {
  name?: string;
  command?: string[];
  environment?: KeyValuePair[];
  environmentFiles?: EnvironmentFile[];
  cpu?: number;
  memory?: number;
  memoryReservation?: number;
  resourceRequirements?: ResourceRequirement[];
}
export const ContainerOverride = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    command: S.optional(StringList),
    environment: S.optional(EnvironmentVariables),
    environmentFiles: S.optional(EnvironmentFiles),
    cpu: S.optional(S.Number),
    memory: S.optional(S.Number),
    memoryReservation: S.optional(S.Number),
    resourceRequirements: S.optional(ResourceRequirements),
  }),
).annotations({
  identifier: "ContainerOverride",
}) as any as S.Schema<ContainerOverride>;
export type ContainerOverrides = ContainerOverride[];
export const ContainerOverrides = S.Array(ContainerOverride);
export interface InferenceAcceleratorOverride {
  deviceName?: string;
  deviceType?: string;
}
export const InferenceAcceleratorOverride = S.suspend(() =>
  S.Struct({
    deviceName: S.optional(S.String),
    deviceType: S.optional(S.String),
  }),
).annotations({
  identifier: "InferenceAcceleratorOverride",
}) as any as S.Schema<InferenceAcceleratorOverride>;
export type InferenceAcceleratorOverrides = InferenceAcceleratorOverride[];
export const InferenceAcceleratorOverrides = S.Array(
  InferenceAcceleratorOverride,
);
export interface EphemeralStorage {
  sizeInGiB: number;
}
export const EphemeralStorage = S.suspend(() =>
  S.Struct({ sizeInGiB: S.Number }),
).annotations({
  identifier: "EphemeralStorage",
}) as any as S.Schema<EphemeralStorage>;
export interface TaskOverride {
  containerOverrides?: ContainerOverride[];
  cpu?: string;
  inferenceAcceleratorOverrides?: InferenceAcceleratorOverride[];
  executionRoleArn?: string;
  memory?: string;
  taskRoleArn?: string;
  ephemeralStorage?: EphemeralStorage;
}
export const TaskOverride = S.suspend(() =>
  S.Struct({
    containerOverrides: S.optional(ContainerOverrides),
    cpu: S.optional(S.String),
    inferenceAcceleratorOverrides: S.optional(InferenceAcceleratorOverrides),
    executionRoleArn: S.optional(S.String),
    memory: S.optional(S.String),
    taskRoleArn: S.optional(S.String),
    ephemeralStorage: S.optional(EphemeralStorage),
  }),
).annotations({ identifier: "TaskOverride" }) as any as S.Schema<TaskOverride>;
export interface Tag {
  key?: string;
  value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export type EBSResourceType = "volume" | (string & {});
export const EBSResourceType = S.String;
export interface EBSTagSpecification {
  resourceType: EBSResourceType;
  tags?: Tag[];
  propagateTags?: PropagateTags;
}
export const EBSTagSpecification = S.suspend(() =>
  S.Struct({
    resourceType: EBSResourceType,
    tags: S.optional(Tags),
    propagateTags: S.optional(PropagateTags),
  }),
).annotations({
  identifier: "EBSTagSpecification",
}) as any as S.Schema<EBSTagSpecification>;
export type EBSTagSpecifications = EBSTagSpecification[];
export const EBSTagSpecifications = S.Array(EBSTagSpecification);
export interface TaskManagedEBSVolumeTerminationPolicy {
  deleteOnTermination: boolean;
}
export const TaskManagedEBSVolumeTerminationPolicy = S.suspend(() =>
  S.Struct({ deleteOnTermination: S.Boolean }),
).annotations({
  identifier: "TaskManagedEBSVolumeTerminationPolicy",
}) as any as S.Schema<TaskManagedEBSVolumeTerminationPolicy>;
export type TaskFilesystemType =
  | "ext3"
  | "ext4"
  | "xfs"
  | "ntfs"
  | (string & {});
export const TaskFilesystemType = S.String;
export interface TaskManagedEBSVolumeConfiguration {
  encrypted?: boolean;
  kmsKeyId?: string;
  volumeType?: string;
  sizeInGiB?: number;
  snapshotId?: string;
  volumeInitializationRate?: number;
  iops?: number;
  throughput?: number;
  tagSpecifications?: EBSTagSpecification[];
  roleArn: string;
  terminationPolicy?: TaskManagedEBSVolumeTerminationPolicy;
  filesystemType?: TaskFilesystemType;
}
export const TaskManagedEBSVolumeConfiguration = S.suspend(() =>
  S.Struct({
    encrypted: S.optional(S.Boolean),
    kmsKeyId: S.optional(S.String),
    volumeType: S.optional(S.String),
    sizeInGiB: S.optional(S.Number),
    snapshotId: S.optional(S.String),
    volumeInitializationRate: S.optional(S.Number),
    iops: S.optional(S.Number),
    throughput: S.optional(S.Number),
    tagSpecifications: S.optional(EBSTagSpecifications),
    roleArn: S.String,
    terminationPolicy: S.optional(TaskManagedEBSVolumeTerminationPolicy),
    filesystemType: S.optional(TaskFilesystemType),
  }),
).annotations({
  identifier: "TaskManagedEBSVolumeConfiguration",
}) as any as S.Schema<TaskManagedEBSVolumeConfiguration>;
export interface TaskVolumeConfiguration {
  name: string;
  managedEBSVolume?: TaskManagedEBSVolumeConfiguration;
}
export const TaskVolumeConfiguration = S.suspend(() =>
  S.Struct({
    name: S.String,
    managedEBSVolume: S.optional(TaskManagedEBSVolumeConfiguration),
  }),
).annotations({
  identifier: "TaskVolumeConfiguration",
}) as any as S.Schema<TaskVolumeConfiguration>;
export type TaskVolumeConfigurations = TaskVolumeConfiguration[];
export const TaskVolumeConfigurations = S.Array(TaskVolumeConfiguration);
export interface StartTaskRequest {
  cluster?: string;
  containerInstances: string[];
  enableECSManagedTags?: boolean;
  enableExecuteCommand?: boolean;
  group?: string;
  networkConfiguration?: NetworkConfiguration;
  overrides?: TaskOverride;
  propagateTags?: PropagateTags;
  referenceId?: string;
  startedBy?: string;
  tags?: Tag[];
  taskDefinition: string;
  volumeConfigurations?: TaskVolumeConfiguration[];
}
export const StartTaskRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    containerInstances: StringList,
    enableECSManagedTags: S.optional(S.Boolean),
    enableExecuteCommand: S.optional(S.Boolean),
    group: S.optional(S.String),
    networkConfiguration: S.optional(NetworkConfiguration),
    overrides: S.optional(TaskOverride),
    propagateTags: S.optional(PropagateTags),
    referenceId: S.optional(S.String),
    startedBy: S.optional(S.String),
    tags: S.optional(Tags),
    taskDefinition: S.String,
    volumeConfigurations: S.optional(TaskVolumeConfigurations),
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
  identifier: "StartTaskRequest",
}) as any as S.Schema<StartTaskRequest>;
export interface StopServiceDeploymentRequest {
  serviceDeploymentArn: string;
  stopType?: StopServiceDeploymentStopType;
}
export const StopServiceDeploymentRequest = S.suspend(() =>
  S.Struct({
    serviceDeploymentArn: S.String,
    stopType: S.optional(StopServiceDeploymentStopType),
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
  identifier: "StopServiceDeploymentRequest",
}) as any as S.Schema<StopServiceDeploymentRequest>;
export interface StopTaskRequest {
  cluster?: string;
  task: string;
  reason?: string;
}
export const StopTaskRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    task: S.String,
    reason: S.optional(S.String),
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
  identifier: "StopTaskRequest",
}) as any as S.Schema<StopTaskRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: Tags }).pipe(
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
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tagKeys: TagKeys }).pipe(
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
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type ClusterSettingName = "containerInsights" | (string & {});
export const ClusterSettingName = S.String;
export interface ClusterSetting {
  name?: ClusterSettingName;
  value?: string;
}
export const ClusterSetting = S.suspend(() =>
  S.Struct({
    name: S.optional(ClusterSettingName),
    value: S.optional(S.String),
  }),
).annotations({
  identifier: "ClusterSetting",
}) as any as S.Schema<ClusterSetting>;
export type ClusterSettings = ClusterSetting[];
export const ClusterSettings = S.Array(ClusterSetting);
export type ExecuteCommandLogging =
  | "NONE"
  | "DEFAULT"
  | "OVERRIDE"
  | (string & {});
export const ExecuteCommandLogging = S.String;
export interface ExecuteCommandLogConfiguration {
  cloudWatchLogGroupName?: string;
  cloudWatchEncryptionEnabled?: boolean;
  s3BucketName?: string;
  s3EncryptionEnabled?: boolean;
  s3KeyPrefix?: string;
}
export const ExecuteCommandLogConfiguration = S.suspend(() =>
  S.Struct({
    cloudWatchLogGroupName: S.optional(S.String),
    cloudWatchEncryptionEnabled: S.optional(S.Boolean),
    s3BucketName: S.optional(S.String),
    s3EncryptionEnabled: S.optional(S.Boolean),
    s3KeyPrefix: S.optional(S.String),
  }),
).annotations({
  identifier: "ExecuteCommandLogConfiguration",
}) as any as S.Schema<ExecuteCommandLogConfiguration>;
export interface ExecuteCommandConfiguration {
  kmsKeyId?: string;
  logging?: ExecuteCommandLogging;
  logConfiguration?: ExecuteCommandLogConfiguration;
}
export const ExecuteCommandConfiguration = S.suspend(() =>
  S.Struct({
    kmsKeyId: S.optional(S.String),
    logging: S.optional(ExecuteCommandLogging),
    logConfiguration: S.optional(ExecuteCommandLogConfiguration),
  }),
).annotations({
  identifier: "ExecuteCommandConfiguration",
}) as any as S.Schema<ExecuteCommandConfiguration>;
export interface ManagedStorageConfiguration {
  kmsKeyId?: string;
  fargateEphemeralStorageKmsKeyId?: string;
}
export const ManagedStorageConfiguration = S.suspend(() =>
  S.Struct({
    kmsKeyId: S.optional(S.String),
    fargateEphemeralStorageKmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "ManagedStorageConfiguration",
}) as any as S.Schema<ManagedStorageConfiguration>;
export interface ClusterConfiguration {
  executeCommandConfiguration?: ExecuteCommandConfiguration;
  managedStorageConfiguration?: ManagedStorageConfiguration;
}
export const ClusterConfiguration = S.suspend(() =>
  S.Struct({
    executeCommandConfiguration: S.optional(ExecuteCommandConfiguration),
    managedStorageConfiguration: S.optional(ManagedStorageConfiguration),
  }),
).annotations({
  identifier: "ClusterConfiguration",
}) as any as S.Schema<ClusterConfiguration>;
export interface ClusterServiceConnectDefaultsRequest {
  namespace: string;
}
export const ClusterServiceConnectDefaultsRequest = S.suspend(() =>
  S.Struct({ namespace: S.String }),
).annotations({
  identifier: "ClusterServiceConnectDefaultsRequest",
}) as any as S.Schema<ClusterServiceConnectDefaultsRequest>;
export interface UpdateClusterRequest {
  cluster: string;
  settings?: ClusterSetting[];
  configuration?: ClusterConfiguration;
  serviceConnectDefaults?: ClusterServiceConnectDefaultsRequest;
}
export const UpdateClusterRequest = S.suspend(() =>
  S.Struct({
    cluster: S.String,
    settings: S.optional(ClusterSettings),
    configuration: S.optional(ClusterConfiguration),
    serviceConnectDefaults: S.optional(ClusterServiceConnectDefaultsRequest),
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
  identifier: "UpdateClusterRequest",
}) as any as S.Schema<UpdateClusterRequest>;
export interface UpdateClusterSettingsRequest {
  cluster: string;
  settings: ClusterSetting[];
}
export const UpdateClusterSettingsRequest = S.suspend(() =>
  S.Struct({ cluster: S.String, settings: ClusterSettings }).pipe(
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
  identifier: "UpdateClusterSettingsRequest",
}) as any as S.Schema<UpdateClusterSettingsRequest>;
export interface UpdateContainerAgentRequest {
  cluster?: string;
  containerInstance: string;
}
export const UpdateContainerAgentRequest = S.suspend(() =>
  S.Struct({ cluster: S.optional(S.String), containerInstance: S.String }).pipe(
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
  identifier: "UpdateContainerAgentRequest",
}) as any as S.Schema<UpdateContainerAgentRequest>;
export interface UpdateContainerInstancesStateRequest {
  cluster?: string;
  containerInstances: string[];
  status: ContainerInstanceStatus;
}
export const UpdateContainerInstancesStateRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    containerInstances: StringList,
    status: ContainerInstanceStatus,
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
  identifier: "UpdateContainerInstancesStateRequest",
}) as any as S.Schema<UpdateContainerInstancesStateRequest>;
export interface ExpressGatewayServiceAwsLogsConfiguration {
  logGroup: string;
  logStreamPrefix: string;
}
export const ExpressGatewayServiceAwsLogsConfiguration = S.suspend(() =>
  S.Struct({ logGroup: S.String, logStreamPrefix: S.String }),
).annotations({
  identifier: "ExpressGatewayServiceAwsLogsConfiguration",
}) as any as S.Schema<ExpressGatewayServiceAwsLogsConfiguration>;
export interface ExpressGatewayRepositoryCredentials {
  credentialsParameter?: string;
}
export const ExpressGatewayRepositoryCredentials = S.suspend(() =>
  S.Struct({ credentialsParameter: S.optional(S.String) }),
).annotations({
  identifier: "ExpressGatewayRepositoryCredentials",
}) as any as S.Schema<ExpressGatewayRepositoryCredentials>;
export interface Secret {
  name: string;
  valueFrom: string;
}
export const Secret = S.suspend(() =>
  S.Struct({ name: S.String, valueFrom: S.String }),
).annotations({ identifier: "Secret" }) as any as S.Schema<Secret>;
export type SecretList = Secret[];
export const SecretList = S.Array(Secret);
export interface ExpressGatewayContainer {
  image: string;
  containerPort?: number;
  awsLogsConfiguration?: ExpressGatewayServiceAwsLogsConfiguration;
  repositoryCredentials?: ExpressGatewayRepositoryCredentials;
  command?: string[];
  environment?: KeyValuePair[];
  secrets?: Secret[];
}
export const ExpressGatewayContainer = S.suspend(() =>
  S.Struct({
    image: S.String,
    containerPort: S.optional(S.Number),
    awsLogsConfiguration: S.optional(ExpressGatewayServiceAwsLogsConfiguration),
    repositoryCredentials: S.optional(ExpressGatewayRepositoryCredentials),
    command: S.optional(StringList),
    environment: S.optional(EnvironmentVariables),
    secrets: S.optional(SecretList),
  }),
).annotations({
  identifier: "ExpressGatewayContainer",
}) as any as S.Schema<ExpressGatewayContainer>;
export interface ExpressGatewayServiceNetworkConfiguration {
  securityGroups?: string[];
  subnets?: string[];
}
export const ExpressGatewayServiceNetworkConfiguration = S.suspend(() =>
  S.Struct({
    securityGroups: S.optional(StringList),
    subnets: S.optional(StringList),
  }),
).annotations({
  identifier: "ExpressGatewayServiceNetworkConfiguration",
}) as any as S.Schema<ExpressGatewayServiceNetworkConfiguration>;
export type ExpressGatewayServiceScalingMetric =
  | "AVERAGE_CPU"
  | "AVERAGE_MEMORY"
  | "REQUEST_COUNT_PER_TARGET"
  | (string & {});
export const ExpressGatewayServiceScalingMetric = S.String;
export interface ExpressGatewayScalingTarget {
  minTaskCount?: number;
  maxTaskCount?: number;
  autoScalingMetric?: ExpressGatewayServiceScalingMetric;
  autoScalingTargetValue?: number;
}
export const ExpressGatewayScalingTarget = S.suspend(() =>
  S.Struct({
    minTaskCount: S.optional(S.Number),
    maxTaskCount: S.optional(S.Number),
    autoScalingMetric: S.optional(ExpressGatewayServiceScalingMetric),
    autoScalingTargetValue: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExpressGatewayScalingTarget",
}) as any as S.Schema<ExpressGatewayScalingTarget>;
export interface UpdateExpressGatewayServiceRequest {
  serviceArn: string;
  executionRoleArn?: string;
  healthCheckPath?: string;
  primaryContainer?: ExpressGatewayContainer;
  taskRoleArn?: string;
  networkConfiguration?: ExpressGatewayServiceNetworkConfiguration;
  cpu?: string;
  memory?: string;
  scalingTarget?: ExpressGatewayScalingTarget;
}
export const UpdateExpressGatewayServiceRequest = S.suspend(() =>
  S.Struct({
    serviceArn: S.String,
    executionRoleArn: S.optional(S.String),
    healthCheckPath: S.optional(S.String),
    primaryContainer: S.optional(ExpressGatewayContainer),
    taskRoleArn: S.optional(S.String),
    networkConfiguration: S.optional(ExpressGatewayServiceNetworkConfiguration),
    cpu: S.optional(S.String),
    memory: S.optional(S.String),
    scalingTarget: S.optional(ExpressGatewayScalingTarget),
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
  identifier: "UpdateExpressGatewayServiceRequest",
}) as any as S.Schema<UpdateExpressGatewayServiceRequest>;
export interface DeploymentCircuitBreaker {
  enable: boolean;
  rollback: boolean;
}
export const DeploymentCircuitBreaker = S.suspend(() =>
  S.Struct({ enable: S.Boolean, rollback: S.Boolean }),
).annotations({
  identifier: "DeploymentCircuitBreaker",
}) as any as S.Schema<DeploymentCircuitBreaker>;
export interface DeploymentAlarms {
  alarmNames: string[];
  rollback: boolean;
  enable: boolean;
}
export const DeploymentAlarms = S.suspend(() =>
  S.Struct({ alarmNames: StringList, rollback: S.Boolean, enable: S.Boolean }),
).annotations({
  identifier: "DeploymentAlarms",
}) as any as S.Schema<DeploymentAlarms>;
export type DeploymentStrategy =
  | "ROLLING"
  | "BLUE_GREEN"
  | "LINEAR"
  | "CANARY"
  | (string & {});
export const DeploymentStrategy = S.String;
export type DeploymentLifecycleHookStage =
  | "RECONCILE_SERVICE"
  | "PRE_SCALE_UP"
  | "POST_SCALE_UP"
  | "TEST_TRAFFIC_SHIFT"
  | "POST_TEST_TRAFFIC_SHIFT"
  | "PRODUCTION_TRAFFIC_SHIFT"
  | "POST_PRODUCTION_TRAFFIC_SHIFT"
  | (string & {});
export const DeploymentLifecycleHookStage = S.String;
export type DeploymentLifecycleHookStageList = DeploymentLifecycleHookStage[];
export const DeploymentLifecycleHookStageList = S.Array(
  DeploymentLifecycleHookStage,
);
export interface DeploymentLifecycleHook {
  hookTargetArn?: string;
  roleArn?: string;
  lifecycleStages?: DeploymentLifecycleHookStage[];
  hookDetails?: any;
}
export const DeploymentLifecycleHook = S.suspend(() =>
  S.Struct({
    hookTargetArn: S.optional(S.String),
    roleArn: S.optional(S.String),
    lifecycleStages: S.optional(DeploymentLifecycleHookStageList),
    hookDetails: S.optional(S.Any),
  }),
).annotations({
  identifier: "DeploymentLifecycleHook",
}) as any as S.Schema<DeploymentLifecycleHook>;
export type DeploymentLifecycleHookList = DeploymentLifecycleHook[];
export const DeploymentLifecycleHookList = S.Array(DeploymentLifecycleHook);
export interface LinearConfiguration {
  stepPercent?: number;
  stepBakeTimeInMinutes?: number;
}
export const LinearConfiguration = S.suspend(() =>
  S.Struct({
    stepPercent: S.optional(S.Number),
    stepBakeTimeInMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "LinearConfiguration",
}) as any as S.Schema<LinearConfiguration>;
export interface CanaryConfiguration {
  canaryPercent?: number;
  canaryBakeTimeInMinutes?: number;
}
export const CanaryConfiguration = S.suspend(() =>
  S.Struct({
    canaryPercent: S.optional(S.Number),
    canaryBakeTimeInMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "CanaryConfiguration",
}) as any as S.Schema<CanaryConfiguration>;
export interface DeploymentConfiguration {
  deploymentCircuitBreaker?: DeploymentCircuitBreaker;
  maximumPercent?: number;
  minimumHealthyPercent?: number;
  alarms?: DeploymentAlarms;
  strategy?: DeploymentStrategy;
  bakeTimeInMinutes?: number;
  lifecycleHooks?: DeploymentLifecycleHook[];
  linearConfiguration?: LinearConfiguration;
  canaryConfiguration?: CanaryConfiguration;
}
export const DeploymentConfiguration = S.suspend(() =>
  S.Struct({
    deploymentCircuitBreaker: S.optional(DeploymentCircuitBreaker),
    maximumPercent: S.optional(S.Number),
    minimumHealthyPercent: S.optional(S.Number),
    alarms: S.optional(DeploymentAlarms),
    strategy: S.optional(DeploymentStrategy),
    bakeTimeInMinutes: S.optional(S.Number),
    lifecycleHooks: S.optional(DeploymentLifecycleHookList),
    linearConfiguration: S.optional(LinearConfiguration),
    canaryConfiguration: S.optional(CanaryConfiguration),
  }),
).annotations({
  identifier: "DeploymentConfiguration",
}) as any as S.Schema<DeploymentConfiguration>;
export type PlacementConstraintType =
  | "distinctInstance"
  | "memberOf"
  | (string & {});
export const PlacementConstraintType = S.String;
export interface PlacementConstraint {
  type?: PlacementConstraintType;
  expression?: string;
}
export const PlacementConstraint = S.suspend(() =>
  S.Struct({
    type: S.optional(PlacementConstraintType),
    expression: S.optional(S.String),
  }),
).annotations({
  identifier: "PlacementConstraint",
}) as any as S.Schema<PlacementConstraint>;
export type PlacementConstraints = PlacementConstraint[];
export const PlacementConstraints = S.Array(PlacementConstraint);
export type PlacementStrategyType =
  | "random"
  | "spread"
  | "binpack"
  | (string & {});
export const PlacementStrategyType = S.String;
export interface PlacementStrategy {
  type?: PlacementStrategyType;
  field?: string;
}
export const PlacementStrategy = S.suspend(() =>
  S.Struct({
    type: S.optional(PlacementStrategyType),
    field: S.optional(S.String),
  }),
).annotations({
  identifier: "PlacementStrategy",
}) as any as S.Schema<PlacementStrategy>;
export type PlacementStrategies = PlacementStrategy[];
export const PlacementStrategies = S.Array(PlacementStrategy);
export type DeploymentControllerType =
  | "ECS"
  | "CODE_DEPLOY"
  | "EXTERNAL"
  | (string & {});
export const DeploymentControllerType = S.String;
export interface DeploymentController {
  type: DeploymentControllerType;
}
export const DeploymentController = S.suspend(() =>
  S.Struct({ type: DeploymentControllerType }),
).annotations({
  identifier: "DeploymentController",
}) as any as S.Schema<DeploymentController>;
export interface AdvancedConfiguration {
  alternateTargetGroupArn?: string;
  productionListenerRule?: string;
  testListenerRule?: string;
  roleArn?: string;
}
export const AdvancedConfiguration = S.suspend(() =>
  S.Struct({
    alternateTargetGroupArn: S.optional(S.String),
    productionListenerRule: S.optional(S.String),
    testListenerRule: S.optional(S.String),
    roleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "AdvancedConfiguration",
}) as any as S.Schema<AdvancedConfiguration>;
export interface LoadBalancer {
  targetGroupArn?: string;
  loadBalancerName?: string;
  containerName?: string;
  containerPort?: number;
  advancedConfiguration?: AdvancedConfiguration;
}
export const LoadBalancer = S.suspend(() =>
  S.Struct({
    targetGroupArn: S.optional(S.String),
    loadBalancerName: S.optional(S.String),
    containerName: S.optional(S.String),
    containerPort: S.optional(S.Number),
    advancedConfiguration: S.optional(AdvancedConfiguration),
  }),
).annotations({ identifier: "LoadBalancer" }) as any as S.Schema<LoadBalancer>;
export type LoadBalancers = LoadBalancer[];
export const LoadBalancers = S.Array(LoadBalancer);
export interface ServiceRegistry {
  registryArn?: string;
  port?: number;
  containerName?: string;
  containerPort?: number;
}
export const ServiceRegistry = S.suspend(() =>
  S.Struct({
    registryArn: S.optional(S.String),
    port: S.optional(S.Number),
    containerName: S.optional(S.String),
    containerPort: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServiceRegistry",
}) as any as S.Schema<ServiceRegistry>;
export type ServiceRegistries = ServiceRegistry[];
export const ServiceRegistries = S.Array(ServiceRegistry);
export interface ServiceConnectTestTrafficHeaderMatchRules {
  exact: string;
}
export const ServiceConnectTestTrafficHeaderMatchRules = S.suspend(() =>
  S.Struct({ exact: S.String }),
).annotations({
  identifier: "ServiceConnectTestTrafficHeaderMatchRules",
}) as any as S.Schema<ServiceConnectTestTrafficHeaderMatchRules>;
export interface ServiceConnectTestTrafficHeaderRules {
  name: string;
  value?: ServiceConnectTestTrafficHeaderMatchRules;
}
export const ServiceConnectTestTrafficHeaderRules = S.suspend(() =>
  S.Struct({
    name: S.String,
    value: S.optional(ServiceConnectTestTrafficHeaderMatchRules),
  }),
).annotations({
  identifier: "ServiceConnectTestTrafficHeaderRules",
}) as any as S.Schema<ServiceConnectTestTrafficHeaderRules>;
export interface ServiceConnectTestTrafficRules {
  header: ServiceConnectTestTrafficHeaderRules;
}
export const ServiceConnectTestTrafficRules = S.suspend(() =>
  S.Struct({ header: ServiceConnectTestTrafficHeaderRules }),
).annotations({
  identifier: "ServiceConnectTestTrafficRules",
}) as any as S.Schema<ServiceConnectTestTrafficRules>;
export interface ServiceConnectClientAlias {
  port: number;
  dnsName?: string;
  testTrafficRules?: ServiceConnectTestTrafficRules;
}
export const ServiceConnectClientAlias = S.suspend(() =>
  S.Struct({
    port: S.Number,
    dnsName: S.optional(S.String),
    testTrafficRules: S.optional(ServiceConnectTestTrafficRules),
  }),
).annotations({
  identifier: "ServiceConnectClientAlias",
}) as any as S.Schema<ServiceConnectClientAlias>;
export type ServiceConnectClientAliasList = ServiceConnectClientAlias[];
export const ServiceConnectClientAliasList = S.Array(ServiceConnectClientAlias);
export interface TimeoutConfiguration {
  idleTimeoutSeconds?: number;
  perRequestTimeoutSeconds?: number;
}
export const TimeoutConfiguration = S.suspend(() =>
  S.Struct({
    idleTimeoutSeconds: S.optional(S.Number),
    perRequestTimeoutSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "TimeoutConfiguration",
}) as any as S.Schema<TimeoutConfiguration>;
export interface ServiceConnectTlsCertificateAuthority {
  awsPcaAuthorityArn?: string;
}
export const ServiceConnectTlsCertificateAuthority = S.suspend(() =>
  S.Struct({ awsPcaAuthorityArn: S.optional(S.String) }),
).annotations({
  identifier: "ServiceConnectTlsCertificateAuthority",
}) as any as S.Schema<ServiceConnectTlsCertificateAuthority>;
export interface ServiceConnectTlsConfiguration {
  issuerCertificateAuthority: ServiceConnectTlsCertificateAuthority;
  kmsKey?: string;
  roleArn?: string;
}
export const ServiceConnectTlsConfiguration = S.suspend(() =>
  S.Struct({
    issuerCertificateAuthority: ServiceConnectTlsCertificateAuthority,
    kmsKey: S.optional(S.String),
    roleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceConnectTlsConfiguration",
}) as any as S.Schema<ServiceConnectTlsConfiguration>;
export interface ServiceConnectService {
  portName: string;
  discoveryName?: string;
  clientAliases?: ServiceConnectClientAlias[];
  ingressPortOverride?: number;
  timeout?: TimeoutConfiguration;
  tls?: ServiceConnectTlsConfiguration;
}
export const ServiceConnectService = S.suspend(() =>
  S.Struct({
    portName: S.String,
    discoveryName: S.optional(S.String),
    clientAliases: S.optional(ServiceConnectClientAliasList),
    ingressPortOverride: S.optional(S.Number),
    timeout: S.optional(TimeoutConfiguration),
    tls: S.optional(ServiceConnectTlsConfiguration),
  }),
).annotations({
  identifier: "ServiceConnectService",
}) as any as S.Schema<ServiceConnectService>;
export type ServiceConnectServiceList = ServiceConnectService[];
export const ServiceConnectServiceList = S.Array(ServiceConnectService);
export type LogDriver =
  | "json-file"
  | "syslog"
  | "journald"
  | "gelf"
  | "fluentd"
  | "awslogs"
  | "splunk"
  | "awsfirelens"
  | (string & {});
export const LogDriver = S.String;
export type LogConfigurationOptionsMap = { [key: string]: string | undefined };
export const LogConfigurationOptionsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface LogConfiguration {
  logDriver: LogDriver;
  options?: { [key: string]: string | undefined };
  secretOptions?: Secret[];
}
export const LogConfiguration = S.suspend(() =>
  S.Struct({
    logDriver: LogDriver,
    options: S.optional(LogConfigurationOptionsMap),
    secretOptions: S.optional(SecretList),
  }),
).annotations({
  identifier: "LogConfiguration",
}) as any as S.Schema<LogConfiguration>;
export type ServiceConnectAccessLoggingFormat = "TEXT" | "JSON" | (string & {});
export const ServiceConnectAccessLoggingFormat = S.String;
export type ServiceConnectIncludeQueryParameters =
  | "DISABLED"
  | "ENABLED"
  | (string & {});
export const ServiceConnectIncludeQueryParameters = S.String;
export interface ServiceConnectAccessLogConfiguration {
  format: ServiceConnectAccessLoggingFormat;
  includeQueryParameters?: ServiceConnectIncludeQueryParameters;
}
export const ServiceConnectAccessLogConfiguration = S.suspend(() =>
  S.Struct({
    format: ServiceConnectAccessLoggingFormat,
    includeQueryParameters: S.optional(ServiceConnectIncludeQueryParameters),
  }),
).annotations({
  identifier: "ServiceConnectAccessLogConfiguration",
}) as any as S.Schema<ServiceConnectAccessLogConfiguration>;
export interface ServiceConnectConfiguration {
  enabled: boolean;
  namespace?: string;
  services?: ServiceConnectService[];
  logConfiguration?: LogConfiguration;
  accessLogConfiguration?: ServiceConnectAccessLogConfiguration;
}
export const ServiceConnectConfiguration = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    namespace: S.optional(S.String),
    services: S.optional(ServiceConnectServiceList),
    logConfiguration: S.optional(LogConfiguration),
    accessLogConfiguration: S.optional(ServiceConnectAccessLogConfiguration),
  }),
).annotations({
  identifier: "ServiceConnectConfiguration",
}) as any as S.Schema<ServiceConnectConfiguration>;
export interface ServiceManagedEBSVolumeConfiguration {
  encrypted?: boolean;
  kmsKeyId?: string;
  volumeType?: string;
  sizeInGiB?: number;
  snapshotId?: string;
  volumeInitializationRate?: number;
  iops?: number;
  throughput?: number;
  tagSpecifications?: EBSTagSpecification[];
  roleArn: string;
  filesystemType?: TaskFilesystemType;
}
export const ServiceManagedEBSVolumeConfiguration = S.suspend(() =>
  S.Struct({
    encrypted: S.optional(S.Boolean),
    kmsKeyId: S.optional(S.String),
    volumeType: S.optional(S.String),
    sizeInGiB: S.optional(S.Number),
    snapshotId: S.optional(S.String),
    volumeInitializationRate: S.optional(S.Number),
    iops: S.optional(S.Number),
    throughput: S.optional(S.Number),
    tagSpecifications: S.optional(EBSTagSpecifications),
    roleArn: S.String,
    filesystemType: S.optional(TaskFilesystemType),
  }),
).annotations({
  identifier: "ServiceManagedEBSVolumeConfiguration",
}) as any as S.Schema<ServiceManagedEBSVolumeConfiguration>;
export interface ServiceVolumeConfiguration {
  name: string;
  managedEBSVolume?: ServiceManagedEBSVolumeConfiguration;
}
export const ServiceVolumeConfiguration = S.suspend(() =>
  S.Struct({
    name: S.String,
    managedEBSVolume: S.optional(ServiceManagedEBSVolumeConfiguration),
  }),
).annotations({
  identifier: "ServiceVolumeConfiguration",
}) as any as S.Schema<ServiceVolumeConfiguration>;
export type ServiceVolumeConfigurations = ServiceVolumeConfiguration[];
export const ServiceVolumeConfigurations = S.Array(ServiceVolumeConfiguration);
export interface VpcLatticeConfiguration {
  roleArn: string;
  targetGroupArn: string;
  portName: string;
}
export const VpcLatticeConfiguration = S.suspend(() =>
  S.Struct({ roleArn: S.String, targetGroupArn: S.String, portName: S.String }),
).annotations({
  identifier: "VpcLatticeConfiguration",
}) as any as S.Schema<VpcLatticeConfiguration>;
export type VpcLatticeConfigurations = VpcLatticeConfiguration[];
export const VpcLatticeConfigurations = S.Array(VpcLatticeConfiguration);
export interface UpdateServiceRequest {
  cluster?: string;
  service: string;
  desiredCount?: number;
  taskDefinition?: string;
  capacityProviderStrategy?: CapacityProviderStrategyItem[];
  deploymentConfiguration?: DeploymentConfiguration;
  availabilityZoneRebalancing?: AvailabilityZoneRebalancing;
  networkConfiguration?: NetworkConfiguration;
  placementConstraints?: PlacementConstraint[];
  placementStrategy?: PlacementStrategy[];
  platformVersion?: string;
  forceNewDeployment?: boolean;
  healthCheckGracePeriodSeconds?: number;
  deploymentController?: DeploymentController;
  enableExecuteCommand?: boolean;
  enableECSManagedTags?: boolean;
  loadBalancers?: LoadBalancer[];
  propagateTags?: PropagateTags;
  serviceRegistries?: ServiceRegistry[];
  serviceConnectConfiguration?: ServiceConnectConfiguration;
  volumeConfigurations?: ServiceVolumeConfiguration[];
  vpcLatticeConfigurations?: VpcLatticeConfiguration[];
}
export const UpdateServiceRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    service: S.String,
    desiredCount: S.optional(S.Number),
    taskDefinition: S.optional(S.String),
    capacityProviderStrategy: S.optional(CapacityProviderStrategy),
    deploymentConfiguration: S.optional(DeploymentConfiguration),
    availabilityZoneRebalancing: S.optional(AvailabilityZoneRebalancing),
    networkConfiguration: S.optional(NetworkConfiguration),
    placementConstraints: S.optional(PlacementConstraints),
    placementStrategy: S.optional(PlacementStrategies),
    platformVersion: S.optional(S.String),
    forceNewDeployment: S.optional(S.Boolean),
    healthCheckGracePeriodSeconds: S.optional(S.Number),
    deploymentController: S.optional(DeploymentController),
    enableExecuteCommand: S.optional(S.Boolean),
    enableECSManagedTags: S.optional(S.Boolean),
    loadBalancers: S.optional(LoadBalancers),
    propagateTags: S.optional(PropagateTags),
    serviceRegistries: S.optional(ServiceRegistries),
    serviceConnectConfiguration: S.optional(ServiceConnectConfiguration),
    volumeConfigurations: S.optional(ServiceVolumeConfigurations),
    vpcLatticeConfigurations: S.optional(VpcLatticeConfigurations),
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
  identifier: "UpdateServiceRequest",
}) as any as S.Schema<UpdateServiceRequest>;
export interface UpdateServicePrimaryTaskSetRequest {
  cluster: string;
  service: string;
  primaryTaskSet: string;
}
export const UpdateServicePrimaryTaskSetRequest = S.suspend(() =>
  S.Struct({
    cluster: S.String,
    service: S.String,
    primaryTaskSet: S.String,
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
  identifier: "UpdateServicePrimaryTaskSetRequest",
}) as any as S.Schema<UpdateServicePrimaryTaskSetRequest>;
export interface UpdateTaskProtectionRequest {
  cluster: string;
  tasks: string[];
  protectionEnabled: boolean;
  expiresInMinutes?: number;
}
export const UpdateTaskProtectionRequest = S.suspend(() =>
  S.Struct({
    cluster: S.String,
    tasks: StringList,
    protectionEnabled: S.Boolean,
    expiresInMinutes: S.optional(S.Number),
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
  identifier: "UpdateTaskProtectionRequest",
}) as any as S.Schema<UpdateTaskProtectionRequest>;
export type ScaleUnit = "PERCENT" | (string & {});
export const ScaleUnit = S.String;
export interface Scale {
  value?: number;
  unit?: ScaleUnit;
}
export const Scale = S.suspend(() =>
  S.Struct({ value: S.optional(S.Number), unit: S.optional(ScaleUnit) }),
).annotations({ identifier: "Scale" }) as any as S.Schema<Scale>;
export interface UpdateTaskSetRequest {
  cluster: string;
  service: string;
  taskSet: string;
  scale: Scale;
}
export const UpdateTaskSetRequest = S.suspend(() =>
  S.Struct({
    cluster: S.String,
    service: S.String,
    taskSet: S.String,
    scale: Scale,
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
  identifier: "UpdateTaskSetRequest",
}) as any as S.Schema<UpdateTaskSetRequest>;
export type ManagedTerminationProtection =
  | "ENABLED"
  | "DISABLED"
  | (string & {});
export const ManagedTerminationProtection = S.String;
export type ManagedDraining = "ENABLED" | "DISABLED" | (string & {});
export const ManagedDraining = S.String;
export type PropagateMITags = "CAPACITY_PROVIDER" | "NONE" | (string & {});
export const PropagateMITags = S.String;
export type PlatformDeviceType = "GPU" | (string & {});
export const PlatformDeviceType = S.String;
export type VersionConsistency = "enabled" | "disabled" | (string & {});
export const VersionConsistency = S.String;
export type TaskDefinitionPlacementConstraintType = "memberOf" | (string & {});
export const TaskDefinitionPlacementConstraintType = S.String;
export type ProxyConfigurationType = "APPMESH" | (string & {});
export const ProxyConfigurationType = S.String;
export type ProxyConfigurationProperties = KeyValuePair[];
export const ProxyConfigurationProperties = S.Array(KeyValuePair);
export type CPUArchitecture = "X86_64" | "ARM64" | (string & {});
export const CPUArchitecture = S.String;
export type OSFamily =
  | "WINDOWS_SERVER_2019_FULL"
  | "WINDOWS_SERVER_2019_CORE"
  | "WINDOWS_SERVER_2016_FULL"
  | "WINDOWS_SERVER_2004_CORE"
  | "WINDOWS_SERVER_2022_CORE"
  | "WINDOWS_SERVER_2022_FULL"
  | "WINDOWS_SERVER_2025_CORE"
  | "WINDOWS_SERVER_2025_FULL"
  | "WINDOWS_SERVER_20H2_CORE"
  | "LINUX"
  | (string & {});
export const OSFamily = S.String;
export type TransportProtocol = "tcp" | "udp" | (string & {});
export const TransportProtocol = S.String;
export type ManagedAgentName = "ExecuteCommandAgent" | (string & {});
export const ManagedAgentName = S.String;
export type CapacityProviderStatus =
  | "PROVISIONING"
  | "ACTIVE"
  | "DEPROVISIONING"
  | "INACTIVE"
  | (string & {});
export const CapacityProviderStatus = S.String;
export type ManagedScalingStatus = "ENABLED" | "DISABLED" | (string & {});
export const ManagedScalingStatus = S.String;
export interface ManagedScaling {
  status?: ManagedScalingStatus;
  targetCapacity?: number;
  minimumScalingStepSize?: number;
  maximumScalingStepSize?: number;
  instanceWarmupPeriod?: number;
}
export const ManagedScaling = S.suspend(() =>
  S.Struct({
    status: S.optional(ManagedScalingStatus),
    targetCapacity: S.optional(S.Number),
    minimumScalingStepSize: S.optional(S.Number),
    maximumScalingStepSize: S.optional(S.Number),
    instanceWarmupPeriod: S.optional(S.Number),
  }),
).annotations({
  identifier: "ManagedScaling",
}) as any as S.Schema<ManagedScaling>;
export interface AutoScalingGroupProvider {
  autoScalingGroupArn: string;
  managedScaling?: ManagedScaling;
  managedTerminationProtection?: ManagedTerminationProtection;
  managedDraining?: ManagedDraining;
}
export const AutoScalingGroupProvider = S.suspend(() =>
  S.Struct({
    autoScalingGroupArn: S.String,
    managedScaling: S.optional(ManagedScaling),
    managedTerminationProtection: S.optional(ManagedTerminationProtection),
    managedDraining: S.optional(ManagedDraining),
  }),
).annotations({
  identifier: "AutoScalingGroupProvider",
}) as any as S.Schema<AutoScalingGroupProvider>;
export interface ManagedInstancesNetworkConfiguration {
  subnets?: string[];
  securityGroups?: string[];
}
export const ManagedInstancesNetworkConfiguration = S.suspend(() =>
  S.Struct({
    subnets: S.optional(StringList),
    securityGroups: S.optional(StringList),
  }),
).annotations({
  identifier: "ManagedInstancesNetworkConfiguration",
}) as any as S.Schema<ManagedInstancesNetworkConfiguration>;
export interface ManagedInstancesStorageConfiguration {
  storageSizeGiB?: number;
}
export const ManagedInstancesStorageConfiguration = S.suspend(() =>
  S.Struct({ storageSizeGiB: S.optional(S.Number) }),
).annotations({
  identifier: "ManagedInstancesStorageConfiguration",
}) as any as S.Schema<ManagedInstancesStorageConfiguration>;
export type ManagedInstancesMonitoringOptions =
  | "BASIC"
  | "DETAILED"
  | (string & {});
export const ManagedInstancesMonitoringOptions = S.String;
export type CapacityOptionType = "ON_DEMAND" | "SPOT" | (string & {});
export const CapacityOptionType = S.String;
export interface VCpuCountRangeRequest {
  min: number;
  max?: number;
}
export const VCpuCountRangeRequest = S.suspend(() =>
  S.Struct({ min: S.Number, max: S.optional(S.Number) }),
).annotations({
  identifier: "VCpuCountRangeRequest",
}) as any as S.Schema<VCpuCountRangeRequest>;
export interface MemoryMiBRequest {
  min: number;
  max?: number;
}
export const MemoryMiBRequest = S.suspend(() =>
  S.Struct({ min: S.Number, max: S.optional(S.Number) }),
).annotations({
  identifier: "MemoryMiBRequest",
}) as any as S.Schema<MemoryMiBRequest>;
export type CpuManufacturer =
  | "intel"
  | "amd"
  | "amazon-web-services"
  | (string & {});
export const CpuManufacturer = S.String;
export type CpuManufacturerSet = CpuManufacturer[];
export const CpuManufacturerSet = S.Array(
  CpuManufacturer.pipe(T.XmlName("item")),
);
export interface MemoryGiBPerVCpuRequest {
  min?: number;
  max?: number;
}
export const MemoryGiBPerVCpuRequest = S.suspend(() =>
  S.Struct({ min: S.optional(S.Number), max: S.optional(S.Number) }),
).annotations({
  identifier: "MemoryGiBPerVCpuRequest",
}) as any as S.Schema<MemoryGiBPerVCpuRequest>;
export type ExcludedInstanceTypeSet = string[];
export const ExcludedInstanceTypeSet = S.Array(
  S.String.pipe(T.XmlName("item")),
);
export type InstanceGeneration = "current" | "previous" | (string & {});
export const InstanceGeneration = S.String;
export type InstanceGenerationSet = InstanceGeneration[];
export const InstanceGenerationSet = S.Array(
  InstanceGeneration.pipe(T.XmlName("item")),
);
export type BareMetal = "included" | "required" | "excluded" | (string & {});
export const BareMetal = S.String;
export type BurstablePerformance =
  | "included"
  | "required"
  | "excluded"
  | (string & {});
export const BurstablePerformance = S.String;
export interface NetworkInterfaceCountRequest {
  min?: number;
  max?: number;
}
export const NetworkInterfaceCountRequest = S.suspend(() =>
  S.Struct({ min: S.optional(S.Number), max: S.optional(S.Number) }),
).annotations({
  identifier: "NetworkInterfaceCountRequest",
}) as any as S.Schema<NetworkInterfaceCountRequest>;
export type LocalStorage = "included" | "required" | "excluded" | (string & {});
export const LocalStorage = S.String;
export type LocalStorageType = "hdd" | "ssd" | (string & {});
export const LocalStorageType = S.String;
export type LocalStorageTypeSet = LocalStorageType[];
export const LocalStorageTypeSet = S.Array(
  LocalStorageType.pipe(T.XmlName("item")),
);
export interface TotalLocalStorageGBRequest {
  min?: number;
  max?: number;
}
export const TotalLocalStorageGBRequest = S.suspend(() =>
  S.Struct({ min: S.optional(S.Number), max: S.optional(S.Number) }),
).annotations({
  identifier: "TotalLocalStorageGBRequest",
}) as any as S.Schema<TotalLocalStorageGBRequest>;
export interface BaselineEbsBandwidthMbpsRequest {
  min?: number;
  max?: number;
}
export const BaselineEbsBandwidthMbpsRequest = S.suspend(() =>
  S.Struct({ min: S.optional(S.Number), max: S.optional(S.Number) }),
).annotations({
  identifier: "BaselineEbsBandwidthMbpsRequest",
}) as any as S.Schema<BaselineEbsBandwidthMbpsRequest>;
export type AcceleratorType = "gpu" | "fpga" | "inference" | (string & {});
export const AcceleratorType = S.String;
export type AcceleratorTypeSet = AcceleratorType[];
export const AcceleratorTypeSet = S.Array(
  AcceleratorType.pipe(T.XmlName("item")),
);
export interface AcceleratorCountRequest {
  min?: number;
  max?: number;
}
export const AcceleratorCountRequest = S.suspend(() =>
  S.Struct({ min: S.optional(S.Number), max: S.optional(S.Number) }),
).annotations({
  identifier: "AcceleratorCountRequest",
}) as any as S.Schema<AcceleratorCountRequest>;
export type AcceleratorManufacturer =
  | "amazon-web-services"
  | "amd"
  | "nvidia"
  | "xilinx"
  | "habana"
  | (string & {});
export const AcceleratorManufacturer = S.String;
export type AcceleratorManufacturerSet = AcceleratorManufacturer[];
export const AcceleratorManufacturerSet = S.Array(
  AcceleratorManufacturer.pipe(T.XmlName("item")),
);
export type AcceleratorName =
  | "a100"
  | "inferentia"
  | "k520"
  | "k80"
  | "m60"
  | "radeon-pro-v520"
  | "t4"
  | "vu9p"
  | "v100"
  | "a10g"
  | "h100"
  | "t4g"
  | (string & {});
export const AcceleratorName = S.String;
export type AcceleratorNameSet = AcceleratorName[];
export const AcceleratorNameSet = S.Array(
  AcceleratorName.pipe(T.XmlName("item")),
);
export interface AcceleratorTotalMemoryMiBRequest {
  min?: number;
  max?: number;
}
export const AcceleratorTotalMemoryMiBRequest = S.suspend(() =>
  S.Struct({ min: S.optional(S.Number), max: S.optional(S.Number) }),
).annotations({
  identifier: "AcceleratorTotalMemoryMiBRequest",
}) as any as S.Schema<AcceleratorTotalMemoryMiBRequest>;
export interface NetworkBandwidthGbpsRequest {
  min?: number;
  max?: number;
}
export const NetworkBandwidthGbpsRequest = S.suspend(() =>
  S.Struct({ min: S.optional(S.Number), max: S.optional(S.Number) }),
).annotations({
  identifier: "NetworkBandwidthGbpsRequest",
}) as any as S.Schema<NetworkBandwidthGbpsRequest>;
export type AllowedInstanceTypeSet = string[];
export const AllowedInstanceTypeSet = S.Array(S.String.pipe(T.XmlName("item")));
export interface InstanceRequirementsRequest {
  vCpuCount: VCpuCountRangeRequest;
  memoryMiB: MemoryMiBRequest;
  cpuManufacturers?: CpuManufacturer[];
  memoryGiBPerVCpu?: MemoryGiBPerVCpuRequest;
  excludedInstanceTypes?: string[];
  instanceGenerations?: InstanceGeneration[];
  spotMaxPricePercentageOverLowestPrice?: number;
  onDemandMaxPricePercentageOverLowestPrice?: number;
  bareMetal?: BareMetal;
  burstablePerformance?: BurstablePerformance;
  requireHibernateSupport?: boolean;
  networkInterfaceCount?: NetworkInterfaceCountRequest;
  localStorage?: LocalStorage;
  localStorageTypes?: LocalStorageType[];
  totalLocalStorageGB?: TotalLocalStorageGBRequest;
  baselineEbsBandwidthMbps?: BaselineEbsBandwidthMbpsRequest;
  acceleratorTypes?: AcceleratorType[];
  acceleratorCount?: AcceleratorCountRequest;
  acceleratorManufacturers?: AcceleratorManufacturer[];
  acceleratorNames?: AcceleratorName[];
  acceleratorTotalMemoryMiB?: AcceleratorTotalMemoryMiBRequest;
  networkBandwidthGbps?: NetworkBandwidthGbpsRequest;
  allowedInstanceTypes?: string[];
  maxSpotPriceAsPercentageOfOptimalOnDemandPrice?: number;
}
export const InstanceRequirementsRequest = S.suspend(() =>
  S.Struct({
    vCpuCount: VCpuCountRangeRequest,
    memoryMiB: MemoryMiBRequest,
    cpuManufacturers: S.optional(CpuManufacturerSet).pipe(
      T.XmlName("CpuManufacturer"),
    ),
    memoryGiBPerVCpu: S.optional(MemoryGiBPerVCpuRequest),
    excludedInstanceTypes: S.optional(ExcludedInstanceTypeSet).pipe(
      T.XmlName("ExcludedInstanceType"),
    ),
    instanceGenerations: S.optional(InstanceGenerationSet).pipe(
      T.XmlName("InstanceGeneration"),
    ),
    spotMaxPricePercentageOverLowestPrice: S.optional(S.Number),
    onDemandMaxPricePercentageOverLowestPrice: S.optional(S.Number),
    bareMetal: S.optional(BareMetal),
    burstablePerformance: S.optional(BurstablePerformance),
    requireHibernateSupport: S.optional(S.Boolean),
    networkInterfaceCount: S.optional(NetworkInterfaceCountRequest),
    localStorage: S.optional(LocalStorage),
    localStorageTypes: S.optional(LocalStorageTypeSet).pipe(
      T.XmlName("LocalStorageType"),
    ),
    totalLocalStorageGB: S.optional(TotalLocalStorageGBRequest),
    baselineEbsBandwidthMbps: S.optional(BaselineEbsBandwidthMbpsRequest),
    acceleratorTypes: S.optional(AcceleratorTypeSet).pipe(
      T.XmlName("AcceleratorType"),
    ),
    acceleratorCount: S.optional(AcceleratorCountRequest),
    acceleratorManufacturers: S.optional(AcceleratorManufacturerSet).pipe(
      T.XmlName("AcceleratorManufacturer"),
    ),
    acceleratorNames: S.optional(AcceleratorNameSet).pipe(
      T.XmlName("AcceleratorName"),
    ),
    acceleratorTotalMemoryMiB: S.optional(AcceleratorTotalMemoryMiBRequest),
    networkBandwidthGbps: S.optional(NetworkBandwidthGbpsRequest),
    allowedInstanceTypes: S.optional(AllowedInstanceTypeSet).pipe(
      T.XmlName("AllowedInstanceType"),
    ),
    maxSpotPriceAsPercentageOfOptimalOnDemandPrice: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstanceRequirementsRequest",
}) as any as S.Schema<InstanceRequirementsRequest>;
export interface InstanceLaunchTemplate {
  ec2InstanceProfileArn: string;
  networkConfiguration: ManagedInstancesNetworkConfiguration;
  storageConfiguration?: ManagedInstancesStorageConfiguration;
  monitoring?: ManagedInstancesMonitoringOptions;
  capacityOptionType?: CapacityOptionType;
  instanceRequirements?: InstanceRequirementsRequest;
}
export const InstanceLaunchTemplate = S.suspend(() =>
  S.Struct({
    ec2InstanceProfileArn: S.String,
    networkConfiguration: ManagedInstancesNetworkConfiguration,
    storageConfiguration: S.optional(ManagedInstancesStorageConfiguration),
    monitoring: S.optional(ManagedInstancesMonitoringOptions),
    capacityOptionType: S.optional(CapacityOptionType),
    instanceRequirements: S.optional(InstanceRequirementsRequest),
  }),
).annotations({
  identifier: "InstanceLaunchTemplate",
}) as any as S.Schema<InstanceLaunchTemplate>;
export interface InfrastructureOptimization {
  scaleInAfter?: number;
}
export const InfrastructureOptimization = S.suspend(() =>
  S.Struct({ scaleInAfter: S.optional(S.Number) }),
).annotations({
  identifier: "InfrastructureOptimization",
}) as any as S.Schema<InfrastructureOptimization>;
export interface ManagedInstancesProvider {
  infrastructureRoleArn?: string;
  instanceLaunchTemplate?: InstanceLaunchTemplate;
  propagateTags?: PropagateMITags;
  infrastructureOptimization?: InfrastructureOptimization;
}
export const ManagedInstancesProvider = S.suspend(() =>
  S.Struct({
    infrastructureRoleArn: S.optional(S.String),
    instanceLaunchTemplate: S.optional(InstanceLaunchTemplate),
    propagateTags: S.optional(PropagateMITags),
    infrastructureOptimization: S.optional(InfrastructureOptimization),
  }),
).annotations({
  identifier: "ManagedInstancesProvider",
}) as any as S.Schema<ManagedInstancesProvider>;
export type CapacityProviderUpdateStatus =
  | "CREATE_IN_PROGRESS"
  | "CREATE_COMPLETE"
  | "CREATE_FAILED"
  | "DELETE_IN_PROGRESS"
  | "DELETE_COMPLETE"
  | "DELETE_FAILED"
  | "UPDATE_IN_PROGRESS"
  | "UPDATE_COMPLETE"
  | "UPDATE_FAILED"
  | (string & {});
export const CapacityProviderUpdateStatus = S.String;
export type CapacityProviderType =
  | "EC2_AUTOSCALING"
  | "MANAGED_INSTANCES"
  | "FARGATE"
  | "FARGATE_SPOT"
  | (string & {});
export const CapacityProviderType = S.String;
export interface CapacityProvider {
  capacityProviderArn?: string;
  name?: string;
  cluster?: string;
  status?: CapacityProviderStatus;
  autoScalingGroupProvider?: AutoScalingGroupProvider;
  managedInstancesProvider?: ManagedInstancesProvider;
  updateStatus?: CapacityProviderUpdateStatus;
  updateStatusReason?: string;
  tags?: Tag[];
  type?: CapacityProviderType;
}
export const CapacityProvider = S.suspend(() =>
  S.Struct({
    capacityProviderArn: S.optional(S.String),
    name: S.optional(S.String),
    cluster: S.optional(S.String),
    status: S.optional(CapacityProviderStatus),
    autoScalingGroupProvider: S.optional(AutoScalingGroupProvider),
    managedInstancesProvider: S.optional(ManagedInstancesProvider),
    updateStatus: S.optional(CapacityProviderUpdateStatus),
    updateStatusReason: S.optional(S.String),
    tags: S.optional(Tags),
    type: S.optional(CapacityProviderType),
  }),
).annotations({
  identifier: "CapacityProvider",
}) as any as S.Schema<CapacityProvider>;
export type CapacityProviders = CapacityProvider[];
export const CapacityProviders = S.Array(CapacityProvider);
export type Statistics = KeyValuePair[];
export const Statistics = S.Array(KeyValuePair);
export type AttachmentDetails = KeyValuePair[];
export const AttachmentDetails = S.Array(KeyValuePair);
export interface Attachment {
  id?: string;
  type?: string;
  status?: string;
  details?: KeyValuePair[];
}
export const Attachment = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    type: S.optional(S.String),
    status: S.optional(S.String),
    details: S.optional(AttachmentDetails),
  }),
).annotations({ identifier: "Attachment" }) as any as S.Schema<Attachment>;
export type Attachments = Attachment[];
export const Attachments = S.Array(Attachment);
export interface ClusterServiceConnectDefaults {
  namespace?: string;
}
export const ClusterServiceConnectDefaults = S.suspend(() =>
  S.Struct({ namespace: S.optional(S.String) }),
).annotations({
  identifier: "ClusterServiceConnectDefaults",
}) as any as S.Schema<ClusterServiceConnectDefaults>;
export interface Cluster {
  clusterArn?: string;
  clusterName?: string;
  configuration?: ClusterConfiguration;
  status?: string;
  registeredContainerInstancesCount?: number;
  runningTasksCount?: number;
  pendingTasksCount?: number;
  activeServicesCount?: number;
  statistics?: KeyValuePair[];
  tags?: Tag[];
  settings?: ClusterSetting[];
  capacityProviders?: string[];
  defaultCapacityProviderStrategy?: CapacityProviderStrategyItem[];
  attachments?: Attachment[];
  attachmentsStatus?: string;
  serviceConnectDefaults?: ClusterServiceConnectDefaults;
}
export const Cluster = S.suspend(() =>
  S.Struct({
    clusterArn: S.optional(S.String),
    clusterName: S.optional(S.String),
    configuration: S.optional(ClusterConfiguration),
    status: S.optional(S.String),
    registeredContainerInstancesCount: S.optional(S.Number),
    runningTasksCount: S.optional(S.Number),
    pendingTasksCount: S.optional(S.Number),
    activeServicesCount: S.optional(S.Number),
    statistics: S.optional(Statistics),
    tags: S.optional(Tags),
    settings: S.optional(ClusterSettings),
    capacityProviders: S.optional(StringList),
    defaultCapacityProviderStrategy: S.optional(CapacityProviderStrategy),
    attachments: S.optional(Attachments),
    attachmentsStatus: S.optional(S.String),
    serviceConnectDefaults: S.optional(ClusterServiceConnectDefaults),
  }),
).annotations({ identifier: "Cluster" }) as any as S.Schema<Cluster>;
export type Clusters = Cluster[];
export const Clusters = S.Array(Cluster);
export interface VersionInfo {
  agentVersion?: string;
  agentHash?: string;
  dockerVersion?: string;
}
export const VersionInfo = S.suspend(() =>
  S.Struct({
    agentVersion: S.optional(S.String),
    agentHash: S.optional(S.String),
    dockerVersion: S.optional(S.String),
  }),
).annotations({ identifier: "VersionInfo" }) as any as S.Schema<VersionInfo>;
export interface Resource {
  name?: string;
  type?: string;
  doubleValue?: number;
  longValue?: number;
  integerValue?: number;
  stringSetValue?: string[];
}
export const Resource = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    type: S.optional(S.String),
    doubleValue: S.optional(S.Number),
    longValue: S.optional(S.Number),
    integerValue: S.optional(S.Number),
    stringSetValue: S.optional(StringList),
  }),
).annotations({ identifier: "Resource" }) as any as S.Schema<Resource>;
export type Resources = Resource[];
export const Resources = S.Array(Resource);
export type AgentUpdateStatus =
  | "PENDING"
  | "STAGING"
  | "STAGED"
  | "UPDATING"
  | "UPDATED"
  | "FAILED"
  | (string & {});
export const AgentUpdateStatus = S.String;
export type InstanceHealthCheckState =
  | "OK"
  | "IMPAIRED"
  | "INSUFFICIENT_DATA"
  | "INITIALIZING"
  | (string & {});
export const InstanceHealthCheckState = S.String;
export type InstanceHealthCheckType = "CONTAINER_RUNTIME" | (string & {});
export const InstanceHealthCheckType = S.String;
export interface InstanceHealthCheckResult {
  type?: InstanceHealthCheckType;
  status?: InstanceHealthCheckState;
  lastUpdated?: Date;
  lastStatusChange?: Date;
}
export const InstanceHealthCheckResult = S.suspend(() =>
  S.Struct({
    type: S.optional(InstanceHealthCheckType),
    status: S.optional(InstanceHealthCheckState),
    lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastStatusChange: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "InstanceHealthCheckResult",
}) as any as S.Schema<InstanceHealthCheckResult>;
export type InstanceHealthCheckResultList = InstanceHealthCheckResult[];
export const InstanceHealthCheckResultList = S.Array(InstanceHealthCheckResult);
export interface ContainerInstanceHealthStatus {
  overallStatus?: InstanceHealthCheckState;
  details?: InstanceHealthCheckResult[];
}
export const ContainerInstanceHealthStatus = S.suspend(() =>
  S.Struct({
    overallStatus: S.optional(InstanceHealthCheckState),
    details: S.optional(InstanceHealthCheckResultList),
  }),
).annotations({
  identifier: "ContainerInstanceHealthStatus",
}) as any as S.Schema<ContainerInstanceHealthStatus>;
export interface ContainerInstance {
  containerInstanceArn?: string;
  ec2InstanceId?: string;
  capacityProviderName?: string;
  version?: number;
  versionInfo?: VersionInfo;
  remainingResources?: Resource[];
  registeredResources?: Resource[];
  status?: string;
  statusReason?: string;
  agentConnected?: boolean;
  runningTasksCount?: number;
  pendingTasksCount?: number;
  agentUpdateStatus?: AgentUpdateStatus;
  attributes?: Attribute[];
  registeredAt?: Date;
  attachments?: Attachment[];
  tags?: Tag[];
  healthStatus?: ContainerInstanceHealthStatus;
}
export const ContainerInstance = S.suspend(() =>
  S.Struct({
    containerInstanceArn: S.optional(S.String),
    ec2InstanceId: S.optional(S.String),
    capacityProviderName: S.optional(S.String),
    version: S.optional(S.Number),
    versionInfo: S.optional(VersionInfo),
    remainingResources: S.optional(Resources),
    registeredResources: S.optional(Resources),
    status: S.optional(S.String),
    statusReason: S.optional(S.String),
    agentConnected: S.optional(S.Boolean),
    runningTasksCount: S.optional(S.Number),
    pendingTasksCount: S.optional(S.Number),
    agentUpdateStatus: S.optional(AgentUpdateStatus),
    attributes: S.optional(Attributes),
    registeredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    attachments: S.optional(Attachments),
    tags: S.optional(Tags),
    healthStatus: S.optional(ContainerInstanceHealthStatus),
  }),
).annotations({
  identifier: "ContainerInstance",
}) as any as S.Schema<ContainerInstance>;
export type ContainerInstances = ContainerInstance[];
export const ContainerInstances = S.Array(ContainerInstance);
export type StabilityStatus = "STEADY_STATE" | "STABILIZING" | (string & {});
export const StabilityStatus = S.String;
export interface DeploymentEphemeralStorage {
  kmsKeyId?: string;
}
export const DeploymentEphemeralStorage = S.suspend(() =>
  S.Struct({ kmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "DeploymentEphemeralStorage",
}) as any as S.Schema<DeploymentEphemeralStorage>;
export interface TaskSet {
  id?: string;
  taskSetArn?: string;
  serviceArn?: string;
  clusterArn?: string;
  startedBy?: string;
  externalId?: string;
  status?: string;
  taskDefinition?: string;
  computedDesiredCount?: number;
  pendingCount?: number;
  runningCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  launchType?: LaunchType;
  capacityProviderStrategy?: CapacityProviderStrategyItem[];
  platformVersion?: string;
  platformFamily?: string;
  networkConfiguration?: NetworkConfiguration;
  loadBalancers?: LoadBalancer[];
  serviceRegistries?: ServiceRegistry[];
  scale?: Scale;
  stabilityStatus?: StabilityStatus;
  stabilityStatusAt?: Date;
  tags?: Tag[];
  fargateEphemeralStorage?: DeploymentEphemeralStorage;
}
export const TaskSet = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    taskSetArn: S.optional(S.String),
    serviceArn: S.optional(S.String),
    clusterArn: S.optional(S.String),
    startedBy: S.optional(S.String),
    externalId: S.optional(S.String),
    status: S.optional(S.String),
    taskDefinition: S.optional(S.String),
    computedDesiredCount: S.optional(S.Number),
    pendingCount: S.optional(S.Number),
    runningCount: S.optional(S.Number),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    launchType: S.optional(LaunchType),
    capacityProviderStrategy: S.optional(CapacityProviderStrategy),
    platformVersion: S.optional(S.String),
    platformFamily: S.optional(S.String),
    networkConfiguration: S.optional(NetworkConfiguration),
    loadBalancers: S.optional(LoadBalancers),
    serviceRegistries: S.optional(ServiceRegistries),
    scale: S.optional(Scale),
    stabilityStatus: S.optional(StabilityStatus),
    stabilityStatusAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    tags: S.optional(Tags),
    fargateEphemeralStorage: S.optional(DeploymentEphemeralStorage),
  }),
).annotations({ identifier: "TaskSet" }) as any as S.Schema<TaskSet>;
export type TaskSets = TaskSet[];
export const TaskSets = S.Array(TaskSet);
export type DeploymentRolloutState =
  | "COMPLETED"
  | "FAILED"
  | "IN_PROGRESS"
  | (string & {});
export const DeploymentRolloutState = S.String;
export interface ServiceConnectServiceResource {
  discoveryName?: string;
  discoveryArn?: string;
}
export const ServiceConnectServiceResource = S.suspend(() =>
  S.Struct({
    discoveryName: S.optional(S.String),
    discoveryArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceConnectServiceResource",
}) as any as S.Schema<ServiceConnectServiceResource>;
export type ServiceConnectServiceResourceList = ServiceConnectServiceResource[];
export const ServiceConnectServiceResourceList = S.Array(
  ServiceConnectServiceResource,
);
export interface Deployment {
  id?: string;
  status?: string;
  taskDefinition?: string;
  desiredCount?: number;
  pendingCount?: number;
  runningCount?: number;
  failedTasks?: number;
  createdAt?: Date;
  updatedAt?: Date;
  capacityProviderStrategy?: CapacityProviderStrategyItem[];
  launchType?: LaunchType;
  platformVersion?: string;
  platformFamily?: string;
  networkConfiguration?: NetworkConfiguration;
  rolloutState?: DeploymentRolloutState;
  rolloutStateReason?: string;
  serviceConnectConfiguration?: ServiceConnectConfiguration;
  serviceConnectResources?: ServiceConnectServiceResource[];
  volumeConfigurations?: ServiceVolumeConfiguration[];
  fargateEphemeralStorage?: DeploymentEphemeralStorage;
  vpcLatticeConfigurations?: VpcLatticeConfiguration[];
}
export const Deployment = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    status: S.optional(S.String),
    taskDefinition: S.optional(S.String),
    desiredCount: S.optional(S.Number),
    pendingCount: S.optional(S.Number),
    runningCount: S.optional(S.Number),
    failedTasks: S.optional(S.Number),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    capacityProviderStrategy: S.optional(CapacityProviderStrategy),
    launchType: S.optional(LaunchType),
    platformVersion: S.optional(S.String),
    platformFamily: S.optional(S.String),
    networkConfiguration: S.optional(NetworkConfiguration),
    rolloutState: S.optional(DeploymentRolloutState),
    rolloutStateReason: S.optional(S.String),
    serviceConnectConfiguration: S.optional(ServiceConnectConfiguration),
    serviceConnectResources: S.optional(ServiceConnectServiceResourceList),
    volumeConfigurations: S.optional(ServiceVolumeConfigurations),
    fargateEphemeralStorage: S.optional(DeploymentEphemeralStorage),
    vpcLatticeConfigurations: S.optional(VpcLatticeConfigurations),
  }),
).annotations({ identifier: "Deployment" }) as any as S.Schema<Deployment>;
export type Deployments = Deployment[];
export const Deployments = S.Array(Deployment);
export interface ServiceEvent {
  id?: string;
  createdAt?: Date;
  message?: string;
}
export const ServiceEvent = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    message: S.optional(S.String),
  }),
).annotations({ identifier: "ServiceEvent" }) as any as S.Schema<ServiceEvent>;
export type ServiceEvents = ServiceEvent[];
export const ServiceEvents = S.Array(ServiceEvent);
export interface ServiceCurrentRevisionSummary {
  arn?: string;
  requestedTaskCount?: number;
  runningTaskCount?: number;
  pendingTaskCount?: number;
}
export const ServiceCurrentRevisionSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    requestedTaskCount: S.optional(S.Number),
    runningTaskCount: S.optional(S.Number),
    pendingTaskCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServiceCurrentRevisionSummary",
}) as any as S.Schema<ServiceCurrentRevisionSummary>;
export type ServiceCurrentRevisionSummaryList = ServiceCurrentRevisionSummary[];
export const ServiceCurrentRevisionSummaryList = S.Array(
  ServiceCurrentRevisionSummary,
);
export interface Service {
  serviceArn?: string;
  serviceName?: string;
  clusterArn?: string;
  loadBalancers?: LoadBalancer[];
  serviceRegistries?: ServiceRegistry[];
  status?: string;
  desiredCount?: number;
  runningCount?: number;
  pendingCount?: number;
  launchType?: LaunchType;
  capacityProviderStrategy?: CapacityProviderStrategyItem[];
  platformVersion?: string;
  platformFamily?: string;
  taskDefinition?: string;
  deploymentConfiguration?: DeploymentConfiguration;
  taskSets?: TaskSet[];
  deployments?: Deployment[];
  roleArn?: string;
  events?: ServiceEvent[];
  createdAt?: Date;
  currentServiceDeployment?: string;
  currentServiceRevisions?: ServiceCurrentRevisionSummary[];
  placementConstraints?: PlacementConstraint[];
  placementStrategy?: PlacementStrategy[];
  networkConfiguration?: NetworkConfiguration;
  healthCheckGracePeriodSeconds?: number;
  schedulingStrategy?: SchedulingStrategy;
  deploymentController?: DeploymentController;
  tags?: Tag[];
  createdBy?: string;
  enableECSManagedTags?: boolean;
  propagateTags?: PropagateTags;
  enableExecuteCommand?: boolean;
  availabilityZoneRebalancing?: AvailabilityZoneRebalancing;
  resourceManagementType?: ResourceManagementType;
}
export const Service = S.suspend(() =>
  S.Struct({
    serviceArn: S.optional(S.String),
    serviceName: S.optional(S.String),
    clusterArn: S.optional(S.String),
    loadBalancers: S.optional(LoadBalancers),
    serviceRegistries: S.optional(ServiceRegistries),
    status: S.optional(S.String),
    desiredCount: S.optional(S.Number),
    runningCount: S.optional(S.Number),
    pendingCount: S.optional(S.Number),
    launchType: S.optional(LaunchType),
    capacityProviderStrategy: S.optional(CapacityProviderStrategy),
    platformVersion: S.optional(S.String),
    platformFamily: S.optional(S.String),
    taskDefinition: S.optional(S.String),
    deploymentConfiguration: S.optional(DeploymentConfiguration),
    taskSets: S.optional(TaskSets),
    deployments: S.optional(Deployments),
    roleArn: S.optional(S.String),
    events: S.optional(ServiceEvents),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    currentServiceDeployment: S.optional(S.String),
    currentServiceRevisions: S.optional(ServiceCurrentRevisionSummaryList),
    placementConstraints: S.optional(PlacementConstraints),
    placementStrategy: S.optional(PlacementStrategies),
    networkConfiguration: S.optional(NetworkConfiguration),
    healthCheckGracePeriodSeconds: S.optional(S.Number),
    schedulingStrategy: S.optional(SchedulingStrategy),
    deploymentController: S.optional(DeploymentController),
    tags: S.optional(Tags),
    createdBy: S.optional(S.String),
    enableECSManagedTags: S.optional(S.Boolean),
    propagateTags: S.optional(PropagateTags),
    enableExecuteCommand: S.optional(S.Boolean),
    availabilityZoneRebalancing: S.optional(AvailabilityZoneRebalancing),
    resourceManagementType: S.optional(ResourceManagementType),
  }),
).annotations({ identifier: "Service" }) as any as S.Schema<Service>;
export type Services = Service[];
export const Services = S.Array(Service);
export type SettingType = "user" | "aws_managed" | (string & {});
export const SettingType = S.String;
export interface Setting {
  name?: SettingName;
  value?: string;
  principalArn?: string;
  type?: SettingType;
}
export const Setting = S.suspend(() =>
  S.Struct({
    name: S.optional(SettingName),
    value: S.optional(S.String),
    principalArn: S.optional(S.String),
    type: S.optional(SettingType),
  }),
).annotations({ identifier: "Setting" }) as any as S.Schema<Setting>;
export type Settings = Setting[];
export const Settings = S.Array(Setting);
export interface CreatedAt {
  before?: Date;
  after?: Date;
}
export const CreatedAt = S.suspend(() =>
  S.Struct({
    before: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    after: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "CreatedAt" }) as any as S.Schema<CreatedAt>;
export interface PlatformDevice {
  id: string;
  type: PlatformDeviceType;
}
export const PlatformDevice = S.suspend(() =>
  S.Struct({ id: S.String, type: PlatformDeviceType }),
).annotations({
  identifier: "PlatformDevice",
}) as any as S.Schema<PlatformDevice>;
export type PlatformDevices = PlatformDevice[];
export const PlatformDevices = S.Array(PlatformDevice);
export interface TaskDefinitionPlacementConstraint {
  type?: TaskDefinitionPlacementConstraintType;
  expression?: string;
}
export const TaskDefinitionPlacementConstraint = S.suspend(() =>
  S.Struct({
    type: S.optional(TaskDefinitionPlacementConstraintType),
    expression: S.optional(S.String),
  }),
).annotations({
  identifier: "TaskDefinitionPlacementConstraint",
}) as any as S.Schema<TaskDefinitionPlacementConstraint>;
export type TaskDefinitionPlacementConstraints =
  TaskDefinitionPlacementConstraint[];
export const TaskDefinitionPlacementConstraints = S.Array(
  TaskDefinitionPlacementConstraint,
);
export interface ProxyConfiguration {
  type?: ProxyConfigurationType;
  containerName: string;
  properties?: KeyValuePair[];
}
export const ProxyConfiguration = S.suspend(() =>
  S.Struct({
    type: S.optional(ProxyConfigurationType),
    containerName: S.String,
    properties: S.optional(ProxyConfigurationProperties),
  }),
).annotations({
  identifier: "ProxyConfiguration",
}) as any as S.Schema<ProxyConfiguration>;
export interface InferenceAccelerator {
  deviceName: string;
  deviceType: string;
}
export const InferenceAccelerator = S.suspend(() =>
  S.Struct({ deviceName: S.String, deviceType: S.String }),
).annotations({
  identifier: "InferenceAccelerator",
}) as any as S.Schema<InferenceAccelerator>;
export type InferenceAccelerators = InferenceAccelerator[];
export const InferenceAccelerators = S.Array(InferenceAccelerator);
export interface RuntimePlatform {
  cpuArchitecture?: CPUArchitecture;
  operatingSystemFamily?: OSFamily;
}
export const RuntimePlatform = S.suspend(() =>
  S.Struct({
    cpuArchitecture: S.optional(CPUArchitecture),
    operatingSystemFamily: S.optional(OSFamily),
  }),
).annotations({
  identifier: "RuntimePlatform",
}) as any as S.Schema<RuntimePlatform>;
export interface AttachmentStateChange {
  attachmentArn: string;
  status: string;
}
export const AttachmentStateChange = S.suspend(() =>
  S.Struct({ attachmentArn: S.String, status: S.String }),
).annotations({
  identifier: "AttachmentStateChange",
}) as any as S.Schema<AttachmentStateChange>;
export type AttachmentStateChanges = AttachmentStateChange[];
export const AttachmentStateChanges = S.Array(AttachmentStateChange);
export interface NetworkBinding {
  bindIP?: string;
  containerPort?: number;
  hostPort?: number;
  protocol?: TransportProtocol;
  containerPortRange?: string;
  hostPortRange?: string;
}
export const NetworkBinding = S.suspend(() =>
  S.Struct({
    bindIP: S.optional(S.String),
    containerPort: S.optional(S.Number),
    hostPort: S.optional(S.Number),
    protocol: S.optional(TransportProtocol),
    containerPortRange: S.optional(S.String),
    hostPortRange: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkBinding",
}) as any as S.Schema<NetworkBinding>;
export type NetworkBindings = NetworkBinding[];
export const NetworkBindings = S.Array(NetworkBinding);
export interface ContainerStateChange {
  containerName?: string;
  imageDigest?: string;
  runtimeId?: string;
  exitCode?: number;
  networkBindings?: NetworkBinding[];
  reason?: string;
  status?: string;
}
export const ContainerStateChange = S.suspend(() =>
  S.Struct({
    containerName: S.optional(S.String),
    imageDigest: S.optional(S.String),
    runtimeId: S.optional(S.String),
    exitCode: S.optional(S.Number),
    networkBindings: S.optional(NetworkBindings),
    reason: S.optional(S.String),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "ContainerStateChange",
}) as any as S.Schema<ContainerStateChange>;
export type ContainerStateChanges = ContainerStateChange[];
export const ContainerStateChanges = S.Array(ContainerStateChange);
export interface ManagedAgentStateChange {
  containerName: string;
  managedAgentName: ManagedAgentName;
  status: string;
  reason?: string;
}
export const ManagedAgentStateChange = S.suspend(() =>
  S.Struct({
    containerName: S.String,
    managedAgentName: ManagedAgentName,
    status: S.String,
    reason: S.optional(S.String),
  }),
).annotations({
  identifier: "ManagedAgentStateChange",
}) as any as S.Schema<ManagedAgentStateChange>;
export type ManagedAgentStateChanges = ManagedAgentStateChange[];
export const ManagedAgentStateChanges = S.Array(ManagedAgentStateChange);
export interface AutoScalingGroupProviderUpdate {
  managedScaling?: ManagedScaling;
  managedTerminationProtection?: ManagedTerminationProtection;
  managedDraining?: ManagedDraining;
}
export const AutoScalingGroupProviderUpdate = S.suspend(() =>
  S.Struct({
    managedScaling: S.optional(ManagedScaling),
    managedTerminationProtection: S.optional(ManagedTerminationProtection),
    managedDraining: S.optional(ManagedDraining),
  }),
).annotations({
  identifier: "AutoScalingGroupProviderUpdate",
}) as any as S.Schema<AutoScalingGroupProviderUpdate>;
export type ApplicationProtocol = "http" | "http2" | "grpc" | (string & {});
export const ApplicationProtocol = S.String;
export type IntegerList = number[];
export const IntegerList = S.Array(S.Number);
export type ContainerCondition =
  | "START"
  | "COMPLETE"
  | "SUCCESS"
  | "HEALTHY"
  | (string & {});
export const ContainerCondition = S.String;
export type UlimitName =
  | "core"
  | "cpu"
  | "data"
  | "fsize"
  | "locks"
  | "memlock"
  | "msgqueue"
  | "nice"
  | "nofile"
  | "nproc"
  | "rss"
  | "rtprio"
  | "rttime"
  | "sigpending"
  | "stack"
  | (string & {});
export const UlimitName = S.String;
export type FirelensConfigurationType = "fluentd" | "fluentbit" | (string & {});
export const FirelensConfigurationType = S.String;
export type Scope = "task" | "shared" | (string & {});
export const Scope = S.String;
export type EFSTransitEncryption = "ENABLED" | "DISABLED" | (string & {});
export const EFSTransitEncryption = S.String;
export interface CreateTaskSetRequest {
  service: string;
  cluster: string;
  externalId?: string;
  taskDefinition: string;
  networkConfiguration?: NetworkConfiguration;
  loadBalancers?: LoadBalancer[];
  serviceRegistries?: ServiceRegistry[];
  launchType?: LaunchType;
  capacityProviderStrategy?: CapacityProviderStrategyItem[];
  platformVersion?: string;
  scale?: Scale;
  clientToken?: string;
  tags?: Tag[];
}
export const CreateTaskSetRequest = S.suspend(() =>
  S.Struct({
    service: S.String,
    cluster: S.String,
    externalId: S.optional(S.String),
    taskDefinition: S.String,
    networkConfiguration: S.optional(NetworkConfiguration),
    loadBalancers: S.optional(LoadBalancers),
    serviceRegistries: S.optional(ServiceRegistries),
    launchType: S.optional(LaunchType),
    capacityProviderStrategy: S.optional(CapacityProviderStrategy),
    platformVersion: S.optional(S.String),
    scale: S.optional(Scale),
    clientToken: S.optional(S.String),
    tags: S.optional(Tags),
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
  identifier: "CreateTaskSetRequest",
}) as any as S.Schema<CreateTaskSetRequest>;
export interface DeleteAttributesRequest {
  cluster?: string;
  attributes: Attribute[];
}
export const DeleteAttributesRequest = S.suspend(() =>
  S.Struct({ cluster: S.optional(S.String), attributes: Attributes }).pipe(
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
  identifier: "DeleteAttributesRequest",
}) as any as S.Schema<DeleteAttributesRequest>;
export interface RepositoryCredentials {
  credentialsParameter: string;
}
export const RepositoryCredentials = S.suspend(() =>
  S.Struct({ credentialsParameter: S.String }),
).annotations({
  identifier: "RepositoryCredentials",
}) as any as S.Schema<RepositoryCredentials>;
export interface PortMapping {
  containerPort?: number;
  hostPort?: number;
  protocol?: TransportProtocol;
  name?: string;
  appProtocol?: ApplicationProtocol;
  containerPortRange?: string;
}
export const PortMapping = S.suspend(() =>
  S.Struct({
    containerPort: S.optional(S.Number),
    hostPort: S.optional(S.Number),
    protocol: S.optional(TransportProtocol),
    name: S.optional(S.String),
    appProtocol: S.optional(ApplicationProtocol),
    containerPortRange: S.optional(S.String),
  }),
).annotations({ identifier: "PortMapping" }) as any as S.Schema<PortMapping>;
export type PortMappingList = PortMapping[];
export const PortMappingList = S.Array(PortMapping);
export interface ContainerRestartPolicy {
  enabled: boolean;
  ignoredExitCodes?: number[];
  restartAttemptPeriod?: number;
}
export const ContainerRestartPolicy = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    ignoredExitCodes: S.optional(IntegerList),
    restartAttemptPeriod: S.optional(S.Number),
  }),
).annotations({
  identifier: "ContainerRestartPolicy",
}) as any as S.Schema<ContainerRestartPolicy>;
export interface MountPoint {
  sourceVolume?: string;
  containerPath?: string;
  readOnly?: boolean;
}
export const MountPoint = S.suspend(() =>
  S.Struct({
    sourceVolume: S.optional(S.String),
    containerPath: S.optional(S.String),
    readOnly: S.optional(S.Boolean),
  }),
).annotations({ identifier: "MountPoint" }) as any as S.Schema<MountPoint>;
export type MountPointList = MountPoint[];
export const MountPointList = S.Array(MountPoint);
export interface VolumeFrom {
  sourceContainer?: string;
  readOnly?: boolean;
}
export const VolumeFrom = S.suspend(() =>
  S.Struct({
    sourceContainer: S.optional(S.String),
    readOnly: S.optional(S.Boolean),
  }),
).annotations({ identifier: "VolumeFrom" }) as any as S.Schema<VolumeFrom>;
export type VolumeFromList = VolumeFrom[];
export const VolumeFromList = S.Array(VolumeFrom);
export interface KernelCapabilities {
  add?: string[];
  drop?: string[];
}
export const KernelCapabilities = S.suspend(() =>
  S.Struct({ add: S.optional(StringList), drop: S.optional(StringList) }),
).annotations({
  identifier: "KernelCapabilities",
}) as any as S.Schema<KernelCapabilities>;
export type DeviceCgroupPermission = "read" | "write" | "mknod" | (string & {});
export const DeviceCgroupPermission = S.String;
export type DeviceCgroupPermissions = DeviceCgroupPermission[];
export const DeviceCgroupPermissions = S.Array(DeviceCgroupPermission);
export interface Device {
  hostPath: string;
  containerPath?: string;
  permissions?: DeviceCgroupPermission[];
}
export const Device = S.suspend(() =>
  S.Struct({
    hostPath: S.String,
    containerPath: S.optional(S.String),
    permissions: S.optional(DeviceCgroupPermissions),
  }),
).annotations({ identifier: "Device" }) as any as S.Schema<Device>;
export type DevicesList = Device[];
export const DevicesList = S.Array(Device);
export interface Tmpfs {
  containerPath: string;
  size: number;
  mountOptions?: string[];
}
export const Tmpfs = S.suspend(() =>
  S.Struct({
    containerPath: S.String,
    size: S.Number,
    mountOptions: S.optional(StringList),
  }),
).annotations({ identifier: "Tmpfs" }) as any as S.Schema<Tmpfs>;
export type TmpfsList = Tmpfs[];
export const TmpfsList = S.Array(Tmpfs);
export interface LinuxParameters {
  capabilities?: KernelCapabilities;
  devices?: Device[];
  initProcessEnabled?: boolean;
  sharedMemorySize?: number;
  tmpfs?: Tmpfs[];
  maxSwap?: number;
  swappiness?: number;
}
export const LinuxParameters = S.suspend(() =>
  S.Struct({
    capabilities: S.optional(KernelCapabilities),
    devices: S.optional(DevicesList),
    initProcessEnabled: S.optional(S.Boolean),
    sharedMemorySize: S.optional(S.Number),
    tmpfs: S.optional(TmpfsList),
    maxSwap: S.optional(S.Number),
    swappiness: S.optional(S.Number),
  }),
).annotations({
  identifier: "LinuxParameters",
}) as any as S.Schema<LinuxParameters>;
export interface ContainerDependency {
  containerName: string;
  condition: ContainerCondition;
}
export const ContainerDependency = S.suspend(() =>
  S.Struct({ containerName: S.String, condition: ContainerCondition }),
).annotations({
  identifier: "ContainerDependency",
}) as any as S.Schema<ContainerDependency>;
export type ContainerDependencies = ContainerDependency[];
export const ContainerDependencies = S.Array(ContainerDependency);
export interface HostEntry {
  hostname: string;
  ipAddress: string;
}
export const HostEntry = S.suspend(() =>
  S.Struct({ hostname: S.String, ipAddress: S.String }),
).annotations({ identifier: "HostEntry" }) as any as S.Schema<HostEntry>;
export type HostEntryList = HostEntry[];
export const HostEntryList = S.Array(HostEntry);
export type DockerLabelsMap = { [key: string]: string | undefined };
export const DockerLabelsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface Ulimit {
  name: UlimitName;
  softLimit: number;
  hardLimit: number;
}
export const Ulimit = S.suspend(() =>
  S.Struct({ name: UlimitName, softLimit: S.Number, hardLimit: S.Number }),
).annotations({ identifier: "Ulimit" }) as any as S.Schema<Ulimit>;
export type UlimitList = Ulimit[];
export const UlimitList = S.Array(Ulimit);
export interface HealthCheck {
  command: string[];
  interval?: number;
  timeout?: number;
  retries?: number;
  startPeriod?: number;
}
export const HealthCheck = S.suspend(() =>
  S.Struct({
    command: StringList,
    interval: S.optional(S.Number),
    timeout: S.optional(S.Number),
    retries: S.optional(S.Number),
    startPeriod: S.optional(S.Number),
  }),
).annotations({ identifier: "HealthCheck" }) as any as S.Schema<HealthCheck>;
export interface SystemControl {
  namespace?: string;
  value?: string;
}
export const SystemControl = S.suspend(() =>
  S.Struct({ namespace: S.optional(S.String), value: S.optional(S.String) }),
).annotations({
  identifier: "SystemControl",
}) as any as S.Schema<SystemControl>;
export type SystemControls = SystemControl[];
export const SystemControls = S.Array(SystemControl);
export type FirelensConfigurationOptionsMap = {
  [key: string]: string | undefined;
};
export const FirelensConfigurationOptionsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface FirelensConfiguration {
  type: FirelensConfigurationType;
  options?: { [key: string]: string | undefined };
}
export const FirelensConfiguration = S.suspend(() =>
  S.Struct({
    type: FirelensConfigurationType,
    options: S.optional(FirelensConfigurationOptionsMap),
  }),
).annotations({
  identifier: "FirelensConfiguration",
}) as any as S.Schema<FirelensConfiguration>;
export interface ContainerDefinition {
  name?: string;
  image?: string;
  repositoryCredentials?: RepositoryCredentials;
  cpu?: number;
  memory?: number;
  memoryReservation?: number;
  links?: string[];
  portMappings?: PortMapping[];
  essential?: boolean;
  restartPolicy?: ContainerRestartPolicy;
  entryPoint?: string[];
  command?: string[];
  environment?: KeyValuePair[];
  environmentFiles?: EnvironmentFile[];
  mountPoints?: MountPoint[];
  volumesFrom?: VolumeFrom[];
  linuxParameters?: LinuxParameters;
  secrets?: Secret[];
  dependsOn?: ContainerDependency[];
  startTimeout?: number;
  stopTimeout?: number;
  versionConsistency?: VersionConsistency;
  hostname?: string;
  user?: string;
  workingDirectory?: string;
  disableNetworking?: boolean;
  privileged?: boolean;
  readonlyRootFilesystem?: boolean;
  dnsServers?: string[];
  dnsSearchDomains?: string[];
  extraHosts?: HostEntry[];
  dockerSecurityOptions?: string[];
  interactive?: boolean;
  pseudoTerminal?: boolean;
  dockerLabels?: { [key: string]: string | undefined };
  ulimits?: Ulimit[];
  logConfiguration?: LogConfiguration;
  healthCheck?: HealthCheck;
  systemControls?: SystemControl[];
  resourceRequirements?: ResourceRequirement[];
  firelensConfiguration?: FirelensConfiguration;
  credentialSpecs?: string[];
}
export const ContainerDefinition = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    image: S.optional(S.String),
    repositoryCredentials: S.optional(RepositoryCredentials),
    cpu: S.optional(S.Number),
    memory: S.optional(S.Number),
    memoryReservation: S.optional(S.Number),
    links: S.optional(StringList),
    portMappings: S.optional(PortMappingList),
    essential: S.optional(S.Boolean),
    restartPolicy: S.optional(ContainerRestartPolicy),
    entryPoint: S.optional(StringList),
    command: S.optional(StringList),
    environment: S.optional(EnvironmentVariables),
    environmentFiles: S.optional(EnvironmentFiles),
    mountPoints: S.optional(MountPointList),
    volumesFrom: S.optional(VolumeFromList),
    linuxParameters: S.optional(LinuxParameters),
    secrets: S.optional(SecretList),
    dependsOn: S.optional(ContainerDependencies),
    startTimeout: S.optional(S.Number),
    stopTimeout: S.optional(S.Number),
    versionConsistency: S.optional(VersionConsistency),
    hostname: S.optional(S.String),
    user: S.optional(S.String),
    workingDirectory: S.optional(S.String),
    disableNetworking: S.optional(S.Boolean),
    privileged: S.optional(S.Boolean),
    readonlyRootFilesystem: S.optional(S.Boolean),
    dnsServers: S.optional(StringList),
    dnsSearchDomains: S.optional(StringList),
    extraHosts: S.optional(HostEntryList),
    dockerSecurityOptions: S.optional(StringList),
    interactive: S.optional(S.Boolean),
    pseudoTerminal: S.optional(S.Boolean),
    dockerLabels: S.optional(DockerLabelsMap),
    ulimits: S.optional(UlimitList),
    logConfiguration: S.optional(LogConfiguration),
    healthCheck: S.optional(HealthCheck),
    systemControls: S.optional(SystemControls),
    resourceRequirements: S.optional(ResourceRequirements),
    firelensConfiguration: S.optional(FirelensConfiguration),
    credentialSpecs: S.optional(StringList),
  }),
).annotations({
  identifier: "ContainerDefinition",
}) as any as S.Schema<ContainerDefinition>;
export type ContainerDefinitions = ContainerDefinition[];
export const ContainerDefinitions = S.Array(ContainerDefinition);
export interface HostVolumeProperties {
  sourcePath?: string;
}
export const HostVolumeProperties = S.suspend(() =>
  S.Struct({ sourcePath: S.optional(S.String) }),
).annotations({
  identifier: "HostVolumeProperties",
}) as any as S.Schema<HostVolumeProperties>;
export type StringMap = { [key: string]: string | undefined };
export const StringMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface DockerVolumeConfiguration {
  scope?: Scope;
  autoprovision?: boolean;
  driver?: string;
  driverOpts?: { [key: string]: string | undefined };
  labels?: { [key: string]: string | undefined };
}
export const DockerVolumeConfiguration = S.suspend(() =>
  S.Struct({
    scope: S.optional(Scope),
    autoprovision: S.optional(S.Boolean),
    driver: S.optional(S.String),
    driverOpts: S.optional(StringMap),
    labels: S.optional(StringMap),
  }),
).annotations({
  identifier: "DockerVolumeConfiguration",
}) as any as S.Schema<DockerVolumeConfiguration>;
export type EFSAuthorizationConfigIAM = "ENABLED" | "DISABLED" | (string & {});
export const EFSAuthorizationConfigIAM = S.String;
export interface EFSAuthorizationConfig {
  accessPointId?: string;
  iam?: EFSAuthorizationConfigIAM;
}
export const EFSAuthorizationConfig = S.suspend(() =>
  S.Struct({
    accessPointId: S.optional(S.String),
    iam: S.optional(EFSAuthorizationConfigIAM),
  }),
).annotations({
  identifier: "EFSAuthorizationConfig",
}) as any as S.Schema<EFSAuthorizationConfig>;
export interface EFSVolumeConfiguration {
  fileSystemId: string;
  rootDirectory?: string;
  transitEncryption?: EFSTransitEncryption;
  transitEncryptionPort?: number;
  authorizationConfig?: EFSAuthorizationConfig;
}
export const EFSVolumeConfiguration = S.suspend(() =>
  S.Struct({
    fileSystemId: S.String,
    rootDirectory: S.optional(S.String),
    transitEncryption: S.optional(EFSTransitEncryption),
    transitEncryptionPort: S.optional(S.Number),
    authorizationConfig: S.optional(EFSAuthorizationConfig),
  }),
).annotations({
  identifier: "EFSVolumeConfiguration",
}) as any as S.Schema<EFSVolumeConfiguration>;
export interface FSxWindowsFileServerAuthorizationConfig {
  credentialsParameter: string;
  domain: string;
}
export const FSxWindowsFileServerAuthorizationConfig = S.suspend(() =>
  S.Struct({ credentialsParameter: S.String, domain: S.String }),
).annotations({
  identifier: "FSxWindowsFileServerAuthorizationConfig",
}) as any as S.Schema<FSxWindowsFileServerAuthorizationConfig>;
export interface FSxWindowsFileServerVolumeConfiguration {
  fileSystemId: string;
  rootDirectory: string;
  authorizationConfig: FSxWindowsFileServerAuthorizationConfig;
}
export const FSxWindowsFileServerVolumeConfiguration = S.suspend(() =>
  S.Struct({
    fileSystemId: S.String,
    rootDirectory: S.String,
    authorizationConfig: FSxWindowsFileServerAuthorizationConfig,
  }),
).annotations({
  identifier: "FSxWindowsFileServerVolumeConfiguration",
}) as any as S.Schema<FSxWindowsFileServerVolumeConfiguration>;
export interface Volume {
  name?: string;
  host?: HostVolumeProperties;
  dockerVolumeConfiguration?: DockerVolumeConfiguration;
  efsVolumeConfiguration?: EFSVolumeConfiguration;
  fsxWindowsFileServerVolumeConfiguration?: FSxWindowsFileServerVolumeConfiguration;
  configuredAtLaunch?: boolean;
}
export const Volume = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    host: S.optional(HostVolumeProperties),
    dockerVolumeConfiguration: S.optional(DockerVolumeConfiguration),
    efsVolumeConfiguration: S.optional(EFSVolumeConfiguration),
    fsxWindowsFileServerVolumeConfiguration: S.optional(
      FSxWindowsFileServerVolumeConfiguration,
    ),
    configuredAtLaunch: S.optional(S.Boolean),
  }),
).annotations({ identifier: "Volume" }) as any as S.Schema<Volume>;
export type VolumeList = Volume[];
export const VolumeList = S.Array(Volume);
export type RequiresAttributes = Attribute[];
export const RequiresAttributes = S.Array(Attribute);
export interface TaskDefinition {
  taskDefinitionArn?: string;
  containerDefinitions?: ContainerDefinition[];
  family?: string;
  taskRoleArn?: string;
  executionRoleArn?: string;
  networkMode?: NetworkMode;
  revision?: number;
  volumes?: Volume[];
  status?: TaskDefinitionStatus;
  requiresAttributes?: Attribute[];
  placementConstraints?: TaskDefinitionPlacementConstraint[];
  compatibilities?: Compatibility[];
  runtimePlatform?: RuntimePlatform;
  requiresCompatibilities?: Compatibility[];
  cpu?: string;
  memory?: string;
  inferenceAccelerators?: InferenceAccelerator[];
  pidMode?: PidMode;
  ipcMode?: IpcMode;
  proxyConfiguration?: ProxyConfiguration;
  registeredAt?: Date;
  deregisteredAt?: Date;
  registeredBy?: string;
  ephemeralStorage?: EphemeralStorage;
  enableFaultInjection?: boolean;
}
export const TaskDefinition = S.suspend(() =>
  S.Struct({
    taskDefinitionArn: S.optional(S.String),
    containerDefinitions: S.optional(ContainerDefinitions),
    family: S.optional(S.String),
    taskRoleArn: S.optional(S.String),
    executionRoleArn: S.optional(S.String),
    networkMode: S.optional(NetworkMode),
    revision: S.optional(S.Number),
    volumes: S.optional(VolumeList),
    status: S.optional(TaskDefinitionStatus),
    requiresAttributes: S.optional(RequiresAttributes),
    placementConstraints: S.optional(TaskDefinitionPlacementConstraints),
    compatibilities: S.optional(CompatibilityList),
    runtimePlatform: S.optional(RuntimePlatform),
    requiresCompatibilities: S.optional(CompatibilityList),
    cpu: S.optional(S.String),
    memory: S.optional(S.String),
    inferenceAccelerators: S.optional(InferenceAccelerators),
    pidMode: S.optional(PidMode),
    ipcMode: S.optional(IpcMode),
    proxyConfiguration: S.optional(ProxyConfiguration),
    registeredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    deregisteredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    registeredBy: S.optional(S.String),
    ephemeralStorage: S.optional(EphemeralStorage),
    enableFaultInjection: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TaskDefinition",
}) as any as S.Schema<TaskDefinition>;
export interface DeregisterTaskDefinitionResponse {
  taskDefinition?: TaskDefinition;
}
export const DeregisterTaskDefinitionResponse = S.suspend(() =>
  S.Struct({ taskDefinition: S.optional(TaskDefinition) }).pipe(ns),
).annotations({
  identifier: "DeregisterTaskDefinitionResponse",
}) as any as S.Schema<DeregisterTaskDefinitionResponse>;
export interface Failure {
  arn?: string;
  reason?: string;
  detail?: string;
}
export const Failure = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    reason: S.optional(S.String),
    detail: S.optional(S.String),
  }),
).annotations({ identifier: "Failure" }) as any as S.Schema<Failure>;
export type Failures = Failure[];
export const Failures = S.Array(Failure);
export interface DescribeCapacityProvidersResponse {
  capacityProviders?: CapacityProvider[];
  failures?: Failure[];
  nextToken?: string;
}
export const DescribeCapacityProvidersResponse = S.suspend(() =>
  S.Struct({
    capacityProviders: S.optional(CapacityProviders),
    failures: S.optional(Failures),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeCapacityProvidersResponse",
}) as any as S.Schema<DescribeCapacityProvidersResponse>;
export interface DescribeClustersResponse {
  clusters?: Cluster[];
  failures?: Failure[];
}
export const DescribeClustersResponse = S.suspend(() =>
  S.Struct({
    clusters: S.optional(Clusters),
    failures: S.optional(Failures),
  }).pipe(ns),
).annotations({
  identifier: "DescribeClustersResponse",
}) as any as S.Schema<DescribeClustersResponse>;
export interface DescribeContainerInstancesResponse {
  containerInstances?: ContainerInstance[];
  failures?: Failure[];
}
export const DescribeContainerInstancesResponse = S.suspend(() =>
  S.Struct({
    containerInstances: S.optional(ContainerInstances),
    failures: S.optional(Failures),
  }).pipe(ns),
).annotations({
  identifier: "DescribeContainerInstancesResponse",
}) as any as S.Schema<DescribeContainerInstancesResponse>;
export type ExpressGatewayServiceStatusCode =
  | "ACTIVE"
  | "DRAINING"
  | "INACTIVE"
  | (string & {});
export const ExpressGatewayServiceStatusCode = S.String;
export interface ExpressGatewayServiceStatus {
  statusCode?: ExpressGatewayServiceStatusCode;
  statusReason?: string;
}
export const ExpressGatewayServiceStatus = S.suspend(() =>
  S.Struct({
    statusCode: S.optional(ExpressGatewayServiceStatusCode),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ExpressGatewayServiceStatus",
}) as any as S.Schema<ExpressGatewayServiceStatus>;
export type AccessType = "PUBLIC" | "PRIVATE" | (string & {});
export const AccessType = S.String;
export interface IngressPathSummary {
  accessType: AccessType;
  endpoint: string;
}
export const IngressPathSummary = S.suspend(() =>
  S.Struct({ accessType: AccessType, endpoint: S.String }),
).annotations({
  identifier: "IngressPathSummary",
}) as any as S.Schema<IngressPathSummary>;
export type IngressPathSummaries = IngressPathSummary[];
export const IngressPathSummaries = S.Array(IngressPathSummary);
export interface ExpressGatewayServiceConfiguration {
  serviceRevisionArn?: string;
  executionRoleArn?: string;
  taskRoleArn?: string;
  cpu?: string;
  memory?: string;
  networkConfiguration?: ExpressGatewayServiceNetworkConfiguration;
  healthCheckPath?: string;
  primaryContainer?: ExpressGatewayContainer;
  scalingTarget?: ExpressGatewayScalingTarget;
  ingressPaths?: IngressPathSummary[];
  createdAt?: Date;
}
export const ExpressGatewayServiceConfiguration = S.suspend(() =>
  S.Struct({
    serviceRevisionArn: S.optional(S.String),
    executionRoleArn: S.optional(S.String),
    taskRoleArn: S.optional(S.String),
    cpu: S.optional(S.String),
    memory: S.optional(S.String),
    networkConfiguration: S.optional(ExpressGatewayServiceNetworkConfiguration),
    healthCheckPath: S.optional(S.String),
    primaryContainer: S.optional(ExpressGatewayContainer),
    scalingTarget: S.optional(ExpressGatewayScalingTarget),
    ingressPaths: S.optional(IngressPathSummaries),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ExpressGatewayServiceConfiguration",
}) as any as S.Schema<ExpressGatewayServiceConfiguration>;
export type ExpressGatewayServiceConfigurations =
  ExpressGatewayServiceConfiguration[];
export const ExpressGatewayServiceConfigurations = S.Array(
  ExpressGatewayServiceConfiguration,
);
export interface ECSExpressGatewayService {
  cluster?: string;
  serviceName?: string;
  serviceArn?: string;
  infrastructureRoleArn?: string;
  status?: ExpressGatewayServiceStatus;
  currentDeployment?: string;
  activeConfigurations?: ExpressGatewayServiceConfiguration[];
  tags?: Tag[];
  createdAt?: Date;
  updatedAt?: Date;
}
export const ECSExpressGatewayService = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    serviceName: S.optional(S.String),
    serviceArn: S.optional(S.String),
    infrastructureRoleArn: S.optional(S.String),
    status: S.optional(ExpressGatewayServiceStatus),
    currentDeployment: S.optional(S.String),
    activeConfigurations: S.optional(ExpressGatewayServiceConfigurations),
    tags: S.optional(Tags),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ECSExpressGatewayService",
}) as any as S.Schema<ECSExpressGatewayService>;
export interface DescribeExpressGatewayServiceResponse {
  service?: ECSExpressGatewayService;
}
export const DescribeExpressGatewayServiceResponse = S.suspend(() =>
  S.Struct({ service: S.optional(ECSExpressGatewayService) }).pipe(ns),
).annotations({
  identifier: "DescribeExpressGatewayServiceResponse",
}) as any as S.Schema<DescribeExpressGatewayServiceResponse>;
export interface DescribeServicesResponse {
  services?: Service[];
  failures?: Failure[];
}
export const DescribeServicesResponse = S.suspend(() =>
  S.Struct({
    services: S.optional(Services),
    failures: S.optional(Failures),
  }).pipe(ns),
).annotations({
  identifier: "DescribeServicesResponse",
}) as any as S.Schema<DescribeServicesResponse>;
export interface DescribeTaskDefinitionResponse {
  taskDefinition?: TaskDefinition;
  tags?: Tag[];
}
export const DescribeTaskDefinitionResponse = S.suspend(() =>
  S.Struct({
    taskDefinition: S.optional(TaskDefinition),
    tags: S.optional(Tags),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTaskDefinitionResponse",
}) as any as S.Schema<DescribeTaskDefinitionResponse>;
export interface DescribeTaskSetsResponse {
  taskSets?: TaskSet[];
  failures?: Failure[];
}
export const DescribeTaskSetsResponse = S.suspend(() =>
  S.Struct({
    taskSets: S.optional(TaskSets),
    failures: S.optional(Failures),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTaskSetsResponse",
}) as any as S.Schema<DescribeTaskSetsResponse>;
export interface DiscoverPollEndpointResponse {
  endpoint?: string;
  telemetryEndpoint?: string;
  serviceConnectEndpoint?: string;
}
export const DiscoverPollEndpointResponse = S.suspend(() =>
  S.Struct({
    endpoint: S.optional(S.String),
    telemetryEndpoint: S.optional(S.String),
    serviceConnectEndpoint: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DiscoverPollEndpointResponse",
}) as any as S.Schema<DiscoverPollEndpointResponse>;
export interface ListAccountSettingsResponse {
  settings?: Setting[];
  nextToken?: string;
}
export const ListAccountSettingsResponse = S.suspend(() =>
  S.Struct({
    settings: S.optional(Settings),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAccountSettingsResponse",
}) as any as S.Schema<ListAccountSettingsResponse>;
export interface ListAttributesResponse {
  attributes?: Attribute[];
  nextToken?: string;
}
export const ListAttributesResponse = S.suspend(() =>
  S.Struct({
    attributes: S.optional(Attributes),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListAttributesResponse",
}) as any as S.Schema<ListAttributesResponse>;
export interface ListClustersResponse {
  clusterArns?: string[];
  nextToken?: string;
}
export const ListClustersResponse = S.suspend(() =>
  S.Struct({
    clusterArns: S.optional(StringList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListClustersResponse",
}) as any as S.Schema<ListClustersResponse>;
export interface ListContainerInstancesResponse {
  containerInstanceArns?: string[];
  nextToken?: string;
}
export const ListContainerInstancesResponse = S.suspend(() =>
  S.Struct({
    containerInstanceArns: S.optional(StringList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListContainerInstancesResponse",
}) as any as S.Schema<ListContainerInstancesResponse>;
export interface ListServiceDeploymentsRequest {
  service: string;
  cluster?: string;
  status?: ServiceDeploymentStatus[];
  createdAt?: CreatedAt;
  nextToken?: string;
  maxResults?: number;
}
export const ListServiceDeploymentsRequest = S.suspend(() =>
  S.Struct({
    service: S.String,
    cluster: S.optional(S.String),
    status: S.optional(ServiceDeploymentStatusList),
    createdAt: S.optional(CreatedAt),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
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
  identifier: "ListServiceDeploymentsRequest",
}) as any as S.Schema<ListServiceDeploymentsRequest>;
export interface ListServicesResponse {
  serviceArns?: string[];
  nextToken?: string;
}
export const ListServicesResponse = S.suspend(() =>
  S.Struct({
    serviceArns: S.optional(StringList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListServicesResponse",
}) as any as S.Schema<ListServicesResponse>;
export interface ListServicesByNamespaceResponse {
  serviceArns?: string[];
  nextToken?: string;
}
export const ListServicesByNamespaceResponse = S.suspend(() =>
  S.Struct({
    serviceArns: S.optional(StringList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListServicesByNamespaceResponse",
}) as any as S.Schema<ListServicesByNamespaceResponse>;
export interface ListTagsForResourceResponse {
  tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(Tags) }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListTaskDefinitionFamiliesResponse {
  families?: string[];
  nextToken?: string;
}
export const ListTaskDefinitionFamiliesResponse = S.suspend(() =>
  S.Struct({
    families: S.optional(StringList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTaskDefinitionFamiliesResponse",
}) as any as S.Schema<ListTaskDefinitionFamiliesResponse>;
export interface ListTaskDefinitionsResponse {
  taskDefinitionArns?: string[];
  nextToken?: string;
}
export const ListTaskDefinitionsResponse = S.suspend(() =>
  S.Struct({
    taskDefinitionArns: S.optional(StringList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTaskDefinitionsResponse",
}) as any as S.Schema<ListTaskDefinitionsResponse>;
export interface ListTasksResponse {
  taskArns?: string[];
  nextToken?: string;
}
export const ListTasksResponse = S.suspend(() =>
  S.Struct({
    taskArns: S.optional(StringList),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTasksResponse",
}) as any as S.Schema<ListTasksResponse>;
export interface PutAccountSettingResponse {
  setting?: Setting;
}
export const PutAccountSettingResponse = S.suspend(() =>
  S.Struct({ setting: S.optional(Setting) }).pipe(ns),
).annotations({
  identifier: "PutAccountSettingResponse",
}) as any as S.Schema<PutAccountSettingResponse>;
export interface PutAccountSettingDefaultResponse {
  setting?: Setting;
}
export const PutAccountSettingDefaultResponse = S.suspend(() =>
  S.Struct({ setting: S.optional(Setting) }).pipe(ns),
).annotations({
  identifier: "PutAccountSettingDefaultResponse",
}) as any as S.Schema<PutAccountSettingDefaultResponse>;
export interface PutAttributesResponse {
  attributes?: Attribute[];
}
export const PutAttributesResponse = S.suspend(() =>
  S.Struct({ attributes: S.optional(Attributes) }).pipe(ns),
).annotations({
  identifier: "PutAttributesResponse",
}) as any as S.Schema<PutAttributesResponse>;
export interface PutClusterCapacityProvidersResponse {
  cluster?: Cluster;
}
export const PutClusterCapacityProvidersResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "PutClusterCapacityProvidersResponse",
}) as any as S.Schema<PutClusterCapacityProvidersResponse>;
export interface RegisterContainerInstanceRequest {
  cluster?: string;
  instanceIdentityDocument?: string;
  instanceIdentityDocumentSignature?: string;
  totalResources?: Resource[];
  versionInfo?: VersionInfo;
  containerInstanceArn?: string;
  attributes?: Attribute[];
  platformDevices?: PlatformDevice[];
  tags?: Tag[];
}
export const RegisterContainerInstanceRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    instanceIdentityDocument: S.optional(S.String),
    instanceIdentityDocumentSignature: S.optional(S.String),
    totalResources: S.optional(Resources),
    versionInfo: S.optional(VersionInfo),
    containerInstanceArn: S.optional(S.String),
    attributes: S.optional(Attributes),
    platformDevices: S.optional(PlatformDevices),
    tags: S.optional(Tags),
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
  identifier: "RegisterContainerInstanceRequest",
}) as any as S.Schema<RegisterContainerInstanceRequest>;
export type Connectivity = "CONNECTED" | "DISCONNECTED" | (string & {});
export const Connectivity = S.String;
export interface NetworkInterface {
  attachmentId?: string;
  privateIpv4Address?: string;
  ipv6Address?: string;
}
export const NetworkInterface = S.suspend(() =>
  S.Struct({
    attachmentId: S.optional(S.String),
    privateIpv4Address: S.optional(S.String),
    ipv6Address: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkInterface",
}) as any as S.Schema<NetworkInterface>;
export type NetworkInterfaces = NetworkInterface[];
export const NetworkInterfaces = S.Array(NetworkInterface);
export type HealthStatus = "HEALTHY" | "UNHEALTHY" | "UNKNOWN" | (string & {});
export const HealthStatus = S.String;
export interface ManagedAgent {
  lastStartedAt?: Date;
  name?: ManagedAgentName;
  reason?: string;
  lastStatus?: string;
}
export const ManagedAgent = S.suspend(() =>
  S.Struct({
    lastStartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    name: S.optional(ManagedAgentName),
    reason: S.optional(S.String),
    lastStatus: S.optional(S.String),
  }),
).annotations({ identifier: "ManagedAgent" }) as any as S.Schema<ManagedAgent>;
export type ManagedAgents = ManagedAgent[];
export const ManagedAgents = S.Array(ManagedAgent);
export type GpuIds = string[];
export const GpuIds = S.Array(S.String);
export interface Container {
  containerArn?: string;
  taskArn?: string;
  name?: string;
  image?: string;
  imageDigest?: string;
  runtimeId?: string;
  lastStatus?: string;
  exitCode?: number;
  reason?: string;
  networkBindings?: NetworkBinding[];
  networkInterfaces?: NetworkInterface[];
  healthStatus?: HealthStatus;
  managedAgents?: ManagedAgent[];
  cpu?: string;
  memory?: string;
  memoryReservation?: string;
  gpuIds?: string[];
}
export const Container = S.suspend(() =>
  S.Struct({
    containerArn: S.optional(S.String),
    taskArn: S.optional(S.String),
    name: S.optional(S.String),
    image: S.optional(S.String),
    imageDigest: S.optional(S.String),
    runtimeId: S.optional(S.String),
    lastStatus: S.optional(S.String),
    exitCode: S.optional(S.Number),
    reason: S.optional(S.String),
    networkBindings: S.optional(NetworkBindings),
    networkInterfaces: S.optional(NetworkInterfaces),
    healthStatus: S.optional(HealthStatus),
    managedAgents: S.optional(ManagedAgents),
    cpu: S.optional(S.String),
    memory: S.optional(S.String),
    memoryReservation: S.optional(S.String),
    gpuIds: S.optional(GpuIds),
  }),
).annotations({ identifier: "Container" }) as any as S.Schema<Container>;
export type Containers = Container[];
export const Containers = S.Array(Container);
export type TaskStopCode =
  | "TaskFailedToStart"
  | "EssentialContainerExited"
  | "UserInitiated"
  | "ServiceSchedulerInitiated"
  | "SpotInterruption"
  | "TerminationNotice"
  | (string & {});
export const TaskStopCode = S.String;
export interface TaskEphemeralStorage {
  sizeInGiB?: number;
  kmsKeyId?: string;
}
export const TaskEphemeralStorage = S.suspend(() =>
  S.Struct({ sizeInGiB: S.optional(S.Number), kmsKeyId: S.optional(S.String) }),
).annotations({
  identifier: "TaskEphemeralStorage",
}) as any as S.Schema<TaskEphemeralStorage>;
export interface Task {
  attachments?: Attachment[];
  attributes?: Attribute[];
  availabilityZone?: string;
  capacityProviderName?: string;
  clusterArn?: string;
  connectivity?: Connectivity;
  connectivityAt?: Date;
  containerInstanceArn?: string;
  containers?: Container[];
  cpu?: string;
  createdAt?: Date;
  desiredStatus?: string;
  enableExecuteCommand?: boolean;
  executionStoppedAt?: Date;
  group?: string;
  healthStatus?: HealthStatus;
  inferenceAccelerators?: InferenceAccelerator[];
  lastStatus?: string;
  launchType?: LaunchType;
  memory?: string;
  overrides?: TaskOverride;
  platformVersion?: string;
  platformFamily?: string;
  pullStartedAt?: Date;
  pullStoppedAt?: Date;
  startedAt?: Date;
  startedBy?: string;
  stopCode?: TaskStopCode;
  stoppedAt?: Date;
  stoppedReason?: string;
  stoppingAt?: Date;
  tags?: Tag[];
  taskArn?: string;
  taskDefinitionArn?: string;
  version?: number;
  ephemeralStorage?: EphemeralStorage;
  fargateEphemeralStorage?: TaskEphemeralStorage;
}
export const Task = S.suspend(() =>
  S.Struct({
    attachments: S.optional(Attachments),
    attributes: S.optional(Attributes),
    availabilityZone: S.optional(S.String),
    capacityProviderName: S.optional(S.String),
    clusterArn: S.optional(S.String),
    connectivity: S.optional(Connectivity),
    connectivityAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    containerInstanceArn: S.optional(S.String),
    containers: S.optional(Containers),
    cpu: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    desiredStatus: S.optional(S.String),
    enableExecuteCommand: S.optional(S.Boolean),
    executionStoppedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    group: S.optional(S.String),
    healthStatus: S.optional(HealthStatus),
    inferenceAccelerators: S.optional(InferenceAccelerators),
    lastStatus: S.optional(S.String),
    launchType: S.optional(LaunchType),
    memory: S.optional(S.String),
    overrides: S.optional(TaskOverride),
    platformVersion: S.optional(S.String),
    platformFamily: S.optional(S.String),
    pullStartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    pullStoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startedBy: S.optional(S.String),
    stopCode: S.optional(TaskStopCode),
    stoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stoppedReason: S.optional(S.String),
    stoppingAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    tags: S.optional(Tags),
    taskArn: S.optional(S.String),
    taskDefinitionArn: S.optional(S.String),
    version: S.optional(S.Number),
    ephemeralStorage: S.optional(EphemeralStorage),
    fargateEphemeralStorage: S.optional(TaskEphemeralStorage),
  }),
).annotations({ identifier: "Task" }) as any as S.Schema<Task>;
export type Tasks = Task[];
export const Tasks = S.Array(Task);
export interface StartTaskResponse {
  tasks?: Task[];
  failures?: Failure[];
}
export const StartTaskResponse = S.suspend(() =>
  S.Struct({ tasks: S.optional(Tasks), failures: S.optional(Failures) }).pipe(
    ns,
  ),
).annotations({
  identifier: "StartTaskResponse",
}) as any as S.Schema<StartTaskResponse>;
export interface StopServiceDeploymentResponse {
  serviceDeploymentArn?: string;
}
export const StopServiceDeploymentResponse = S.suspend(() =>
  S.Struct({ serviceDeploymentArn: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StopServiceDeploymentResponse",
}) as any as S.Schema<StopServiceDeploymentResponse>;
export interface StopTaskResponse {
  task?: Task;
}
export const StopTaskResponse = S.suspend(() =>
  S.Struct({ task: S.optional(Task) }).pipe(ns),
).annotations({
  identifier: "StopTaskResponse",
}) as any as S.Schema<StopTaskResponse>;
export interface SubmitAttachmentStateChangesRequest {
  cluster?: string;
  attachments: AttachmentStateChange[];
}
export const SubmitAttachmentStateChangesRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    attachments: AttachmentStateChanges,
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
  identifier: "SubmitAttachmentStateChangesRequest",
}) as any as S.Schema<SubmitAttachmentStateChangesRequest>;
export interface SubmitContainerStateChangeRequest {
  cluster?: string;
  task?: string;
  containerName?: string;
  runtimeId?: string;
  status?: string;
  exitCode?: number;
  reason?: string;
  networkBindings?: NetworkBinding[];
}
export const SubmitContainerStateChangeRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    task: S.optional(S.String),
    containerName: S.optional(S.String),
    runtimeId: S.optional(S.String),
    status: S.optional(S.String),
    exitCode: S.optional(S.Number),
    reason: S.optional(S.String),
    networkBindings: S.optional(NetworkBindings),
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
  identifier: "SubmitContainerStateChangeRequest",
}) as any as S.Schema<SubmitContainerStateChangeRequest>;
export interface SubmitTaskStateChangeRequest {
  cluster?: string;
  task?: string;
  status?: string;
  reason?: string;
  containers?: ContainerStateChange[];
  attachments?: AttachmentStateChange[];
  managedAgents?: ManagedAgentStateChange[];
  pullStartedAt?: Date;
  pullStoppedAt?: Date;
  executionStoppedAt?: Date;
}
export const SubmitTaskStateChangeRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    task: S.optional(S.String),
    status: S.optional(S.String),
    reason: S.optional(S.String),
    containers: S.optional(ContainerStateChanges),
    attachments: S.optional(AttachmentStateChanges),
    managedAgents: S.optional(ManagedAgentStateChanges),
    pullStartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    pullStoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    executionStoppedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
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
  identifier: "SubmitTaskStateChangeRequest",
}) as any as S.Schema<SubmitTaskStateChangeRequest>;
export interface UpdateClusterResponse {
  cluster?: Cluster;
}
export const UpdateClusterResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "UpdateClusterResponse",
}) as any as S.Schema<UpdateClusterResponse>;
export interface UpdateClusterSettingsResponse {
  cluster?: Cluster;
}
export const UpdateClusterSettingsResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "UpdateClusterSettingsResponse",
}) as any as S.Schema<UpdateClusterSettingsResponse>;
export interface UpdateContainerAgentResponse {
  containerInstance?: ContainerInstance;
}
export const UpdateContainerAgentResponse = S.suspend(() =>
  S.Struct({ containerInstance: S.optional(ContainerInstance) }).pipe(ns),
).annotations({
  identifier: "UpdateContainerAgentResponse",
}) as any as S.Schema<UpdateContainerAgentResponse>;
export interface UpdateContainerInstancesStateResponse {
  containerInstances?: ContainerInstance[];
  failures?: Failure[];
}
export const UpdateContainerInstancesStateResponse = S.suspend(() =>
  S.Struct({
    containerInstances: S.optional(ContainerInstances),
    failures: S.optional(Failures),
  }).pipe(ns),
).annotations({
  identifier: "UpdateContainerInstancesStateResponse",
}) as any as S.Schema<UpdateContainerInstancesStateResponse>;
export interface UpdateServiceResponse {
  service?: Service;
}
export const UpdateServiceResponse = S.suspend(() =>
  S.Struct({ service: S.optional(Service) }).pipe(ns),
).annotations({
  identifier: "UpdateServiceResponse",
}) as any as S.Schema<UpdateServiceResponse>;
export interface UpdateServicePrimaryTaskSetResponse {
  taskSet?: TaskSet;
}
export const UpdateServicePrimaryTaskSetResponse = S.suspend(() =>
  S.Struct({ taskSet: S.optional(TaskSet) }).pipe(ns),
).annotations({
  identifier: "UpdateServicePrimaryTaskSetResponse",
}) as any as S.Schema<UpdateServicePrimaryTaskSetResponse>;
export interface ProtectedTask {
  taskArn?: string;
  protectionEnabled?: boolean;
  expirationDate?: Date;
}
export const ProtectedTask = S.suspend(() =>
  S.Struct({
    taskArn: S.optional(S.String),
    protectionEnabled: S.optional(S.Boolean),
    expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ProtectedTask",
}) as any as S.Schema<ProtectedTask>;
export type ProtectedTasks = ProtectedTask[];
export const ProtectedTasks = S.Array(ProtectedTask);
export interface UpdateTaskProtectionResponse {
  protectedTasks?: ProtectedTask[];
  failures?: Failure[];
}
export const UpdateTaskProtectionResponse = S.suspend(() =>
  S.Struct({
    protectedTasks: S.optional(ProtectedTasks),
    failures: S.optional(Failures),
  }).pipe(ns),
).annotations({
  identifier: "UpdateTaskProtectionResponse",
}) as any as S.Schema<UpdateTaskProtectionResponse>;
export interface UpdateTaskSetResponse {
  taskSet?: TaskSet;
}
export const UpdateTaskSetResponse = S.suspend(() =>
  S.Struct({ taskSet: S.optional(TaskSet) }).pipe(ns),
).annotations({
  identifier: "UpdateTaskSetResponse",
}) as any as S.Schema<UpdateTaskSetResponse>;
export type ServiceDeploymentLifecycleStage =
  | "RECONCILE_SERVICE"
  | "PRE_SCALE_UP"
  | "SCALE_UP"
  | "POST_SCALE_UP"
  | "TEST_TRAFFIC_SHIFT"
  | "POST_TEST_TRAFFIC_SHIFT"
  | "PRODUCTION_TRAFFIC_SHIFT"
  | "POST_PRODUCTION_TRAFFIC_SHIFT"
  | "BAKE_TIME"
  | "CLEAN_UP"
  | (string & {});
export const ServiceDeploymentLifecycleStage = S.String;
export interface InstanceLaunchTemplateUpdate {
  ec2InstanceProfileArn?: string;
  networkConfiguration?: ManagedInstancesNetworkConfiguration;
  storageConfiguration?: ManagedInstancesStorageConfiguration;
  monitoring?: ManagedInstancesMonitoringOptions;
  instanceRequirements?: InstanceRequirementsRequest;
}
export const InstanceLaunchTemplateUpdate = S.suspend(() =>
  S.Struct({
    ec2InstanceProfileArn: S.optional(S.String),
    networkConfiguration: S.optional(ManagedInstancesNetworkConfiguration),
    storageConfiguration: S.optional(ManagedInstancesStorageConfiguration),
    monitoring: S.optional(ManagedInstancesMonitoringOptions),
    instanceRequirements: S.optional(InstanceRequirementsRequest),
  }),
).annotations({
  identifier: "InstanceLaunchTemplateUpdate",
}) as any as S.Schema<InstanceLaunchTemplateUpdate>;
export type TaskDefinitionList = TaskDefinition[];
export const TaskDefinitionList = S.Array(TaskDefinition);
export interface Session {
  sessionId?: string;
  streamUrl?: string;
  tokenValue?: string | redacted.Redacted<string>;
}
export const Session = S.suspend(() =>
  S.Struct({
    sessionId: S.optional(S.String),
    streamUrl: S.optional(S.String),
    tokenValue: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Session" }) as any as S.Schema<Session>;
export interface UpdateManagedInstancesProviderConfiguration {
  infrastructureRoleArn: string;
  instanceLaunchTemplate: InstanceLaunchTemplateUpdate;
  propagateTags?: PropagateMITags;
  infrastructureOptimization?: InfrastructureOptimization;
}
export const UpdateManagedInstancesProviderConfiguration = S.suspend(() =>
  S.Struct({
    infrastructureRoleArn: S.String,
    instanceLaunchTemplate: InstanceLaunchTemplateUpdate,
    propagateTags: S.optional(PropagateMITags),
    infrastructureOptimization: S.optional(InfrastructureOptimization),
  }),
).annotations({
  identifier: "UpdateManagedInstancesProviderConfiguration",
}) as any as S.Schema<UpdateManagedInstancesProviderConfiguration>;
export interface UpdatedExpressGatewayService {
  serviceArn?: string;
  cluster?: string;
  serviceName?: string;
  status?: ExpressGatewayServiceStatus;
  targetConfiguration?: ExpressGatewayServiceConfiguration;
  createdAt?: Date;
  updatedAt?: Date;
}
export const UpdatedExpressGatewayService = S.suspend(() =>
  S.Struct({
    serviceArn: S.optional(S.String),
    cluster: S.optional(S.String),
    serviceName: S.optional(S.String),
    status: S.optional(ExpressGatewayServiceStatus),
    targetConfiguration: S.optional(ExpressGatewayServiceConfiguration),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "UpdatedExpressGatewayService",
}) as any as S.Schema<UpdatedExpressGatewayService>;
export type ServiceDeploymentRollbackMonitorsStatus =
  | "TRIGGERED"
  | "MONITORING"
  | "MONITORING_COMPLETE"
  | "DISABLED"
  | (string & {});
export const ServiceDeploymentRollbackMonitorsStatus = S.String;
export interface CreateExpressGatewayServiceRequest {
  executionRoleArn: string;
  infrastructureRoleArn: string;
  serviceName?: string;
  cluster?: string;
  healthCheckPath?: string;
  primaryContainer: ExpressGatewayContainer;
  taskRoleArn?: string;
  networkConfiguration?: ExpressGatewayServiceNetworkConfiguration;
  cpu?: string;
  memory?: string;
  scalingTarget?: ExpressGatewayScalingTarget;
  tags?: Tag[];
}
export const CreateExpressGatewayServiceRequest = S.suspend(() =>
  S.Struct({
    executionRoleArn: S.String,
    infrastructureRoleArn: S.String,
    serviceName: S.optional(S.String),
    cluster: S.optional(S.String),
    healthCheckPath: S.optional(S.String),
    primaryContainer: ExpressGatewayContainer,
    taskRoleArn: S.optional(S.String),
    networkConfiguration: S.optional(ExpressGatewayServiceNetworkConfiguration),
    cpu: S.optional(S.String),
    memory: S.optional(S.String),
    scalingTarget: S.optional(ExpressGatewayScalingTarget),
    tags: S.optional(Tags),
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
  identifier: "CreateExpressGatewayServiceRequest",
}) as any as S.Schema<CreateExpressGatewayServiceRequest>;
export interface CreateTaskSetResponse {
  taskSet?: TaskSet;
}
export const CreateTaskSetResponse = S.suspend(() =>
  S.Struct({ taskSet: S.optional(TaskSet) }).pipe(ns),
).annotations({
  identifier: "CreateTaskSetResponse",
}) as any as S.Schema<CreateTaskSetResponse>;
export interface DeleteAccountSettingResponse {
  setting?: Setting;
}
export const DeleteAccountSettingResponse = S.suspend(() =>
  S.Struct({ setting: S.optional(Setting) }).pipe(ns),
).annotations({
  identifier: "DeleteAccountSettingResponse",
}) as any as S.Schema<DeleteAccountSettingResponse>;
export interface DeleteAttributesResponse {
  attributes?: Attribute[];
}
export const DeleteAttributesResponse = S.suspend(() =>
  S.Struct({ attributes: S.optional(Attributes) }).pipe(ns),
).annotations({
  identifier: "DeleteAttributesResponse",
}) as any as S.Schema<DeleteAttributesResponse>;
export interface DeleteTaskDefinitionsResponse {
  taskDefinitions?: TaskDefinition[];
  failures?: Failure[];
}
export const DeleteTaskDefinitionsResponse = S.suspend(() =>
  S.Struct({
    taskDefinitions: S.optional(TaskDefinitionList),
    failures: S.optional(Failures),
  }).pipe(ns),
).annotations({
  identifier: "DeleteTaskDefinitionsResponse",
}) as any as S.Schema<DeleteTaskDefinitionsResponse>;
export interface ExecuteCommandResponse {
  clusterArn?: string;
  containerArn?: string;
  containerName?: string;
  interactive?: boolean;
  session?: Session;
  taskArn?: string;
}
export const ExecuteCommandResponse = S.suspend(() =>
  S.Struct({
    clusterArn: S.optional(S.String),
    containerArn: S.optional(S.String),
    containerName: S.optional(S.String),
    interactive: S.optional(S.Boolean),
    session: S.optional(Session),
    taskArn: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ExecuteCommandResponse",
}) as any as S.Schema<ExecuteCommandResponse>;
export interface GetTaskProtectionResponse {
  protectedTasks?: ProtectedTask[];
  failures?: Failure[];
}
export const GetTaskProtectionResponse = S.suspend(() =>
  S.Struct({
    protectedTasks: S.optional(ProtectedTasks),
    failures: S.optional(Failures),
  }).pipe(ns),
).annotations({
  identifier: "GetTaskProtectionResponse",
}) as any as S.Schema<GetTaskProtectionResponse>;
export interface RegisterContainerInstanceResponse {
  containerInstance?: ContainerInstance;
}
export const RegisterContainerInstanceResponse = S.suspend(() =>
  S.Struct({ containerInstance: S.optional(ContainerInstance) }).pipe(ns),
).annotations({
  identifier: "RegisterContainerInstanceResponse",
}) as any as S.Schema<RegisterContainerInstanceResponse>;
export interface SubmitAttachmentStateChangesResponse {
  acknowledgment?: string;
}
export const SubmitAttachmentStateChangesResponse = S.suspend(() =>
  S.Struct({ acknowledgment: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "SubmitAttachmentStateChangesResponse",
}) as any as S.Schema<SubmitAttachmentStateChangesResponse>;
export interface SubmitContainerStateChangeResponse {
  acknowledgment?: string;
}
export const SubmitContainerStateChangeResponse = S.suspend(() =>
  S.Struct({ acknowledgment: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "SubmitContainerStateChangeResponse",
}) as any as S.Schema<SubmitContainerStateChangeResponse>;
export interface SubmitTaskStateChangeResponse {
  acknowledgment?: string;
}
export const SubmitTaskStateChangeResponse = S.suspend(() =>
  S.Struct({ acknowledgment: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "SubmitTaskStateChangeResponse",
}) as any as S.Schema<SubmitTaskStateChangeResponse>;
export interface UpdateCapacityProviderRequest {
  name: string;
  cluster?: string;
  autoScalingGroupProvider?: AutoScalingGroupProviderUpdate;
  managedInstancesProvider?: UpdateManagedInstancesProviderConfiguration;
}
export const UpdateCapacityProviderRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    cluster: S.optional(S.String),
    autoScalingGroupProvider: S.optional(AutoScalingGroupProviderUpdate),
    managedInstancesProvider: S.optional(
      UpdateManagedInstancesProviderConfiguration,
    ),
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
  identifier: "UpdateCapacityProviderRequest",
}) as any as S.Schema<UpdateCapacityProviderRequest>;
export interface UpdateExpressGatewayServiceResponse {
  service?: UpdatedExpressGatewayService;
}
export const UpdateExpressGatewayServiceResponse = S.suspend(() =>
  S.Struct({ service: S.optional(UpdatedExpressGatewayService) }).pipe(ns),
).annotations({
  identifier: "UpdateExpressGatewayServiceResponse",
}) as any as S.Schema<UpdateExpressGatewayServiceResponse>;
export interface ServiceRevisionSummary {
  arn?: string;
  requestedTaskCount?: number;
  runningTaskCount?: number;
  pendingTaskCount?: number;
  requestedTestTrafficWeight?: number;
  requestedProductionTrafficWeight?: number;
}
export const ServiceRevisionSummary = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    requestedTaskCount: S.optional(S.Number),
    runningTaskCount: S.optional(S.Number),
    pendingTaskCount: S.optional(S.Number),
    requestedTestTrafficWeight: S.optional(S.Number),
    requestedProductionTrafficWeight: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServiceRevisionSummary",
}) as any as S.Schema<ServiceRevisionSummary>;
export type ServiceRevisionsSummaryList = ServiceRevisionSummary[];
export const ServiceRevisionsSummaryList = S.Array(ServiceRevisionSummary);
export interface Rollback {
  reason?: string;
  startedAt?: Date;
  serviceRevisionArn?: string;
}
export const Rollback = S.suspend(() =>
  S.Struct({
    reason: S.optional(S.String),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    serviceRevisionArn: S.optional(S.String),
  }),
).annotations({ identifier: "Rollback" }) as any as S.Schema<Rollback>;
export interface ServiceDeploymentCircuitBreaker {
  status?: ServiceDeploymentRollbackMonitorsStatus;
  failureCount?: number;
  threshold?: number;
}
export const ServiceDeploymentCircuitBreaker = S.suspend(() =>
  S.Struct({
    status: S.optional(ServiceDeploymentRollbackMonitorsStatus),
    failureCount: S.optional(S.Number),
    threshold: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServiceDeploymentCircuitBreaker",
}) as any as S.Schema<ServiceDeploymentCircuitBreaker>;
export interface ServiceDeploymentAlarms {
  status?: ServiceDeploymentRollbackMonitorsStatus;
  alarmNames?: string[];
  triggeredAlarmNames?: string[];
}
export const ServiceDeploymentAlarms = S.suspend(() =>
  S.Struct({
    status: S.optional(ServiceDeploymentRollbackMonitorsStatus),
    alarmNames: S.optional(StringList),
    triggeredAlarmNames: S.optional(StringList),
  }),
).annotations({
  identifier: "ServiceDeploymentAlarms",
}) as any as S.Schema<ServiceDeploymentAlarms>;
export interface ContainerImage {
  containerName?: string;
  imageDigest?: string;
  image?: string;
}
export const ContainerImage = S.suspend(() =>
  S.Struct({
    containerName: S.optional(S.String),
    imageDigest: S.optional(S.String),
    image: S.optional(S.String),
  }),
).annotations({
  identifier: "ContainerImage",
}) as any as S.Schema<ContainerImage>;
export type ContainerImages = ContainerImage[];
export const ContainerImages = S.Array(ContainerImage);
export type ManagedResourceStatus =
  | "PROVISIONING"
  | "ACTIVE"
  | "DEPROVISIONING"
  | "DELETED"
  | "FAILED"
  | (string & {});
export const ManagedResourceStatus = S.String;
export interface ServiceDeployment {
  serviceDeploymentArn?: string;
  serviceArn?: string;
  clusterArn?: string;
  createdAt?: Date;
  startedAt?: Date;
  finishedAt?: Date;
  stoppedAt?: Date;
  updatedAt?: Date;
  sourceServiceRevisions?: ServiceRevisionSummary[];
  targetServiceRevision?: ServiceRevisionSummary;
  status?: ServiceDeploymentStatus;
  statusReason?: string;
  lifecycleStage?: ServiceDeploymentLifecycleStage;
  deploymentConfiguration?: DeploymentConfiguration;
  rollback?: Rollback;
  deploymentCircuitBreaker?: ServiceDeploymentCircuitBreaker;
  alarms?: ServiceDeploymentAlarms;
}
export const ServiceDeployment = S.suspend(() =>
  S.Struct({
    serviceDeploymentArn: S.optional(S.String),
    serviceArn: S.optional(S.String),
    clusterArn: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    finishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    stoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    sourceServiceRevisions: S.optional(ServiceRevisionsSummaryList),
    targetServiceRevision: S.optional(ServiceRevisionSummary),
    status: S.optional(ServiceDeploymentStatus),
    statusReason: S.optional(S.String),
    lifecycleStage: S.optional(ServiceDeploymentLifecycleStage),
    deploymentConfiguration: S.optional(DeploymentConfiguration),
    rollback: S.optional(Rollback),
    deploymentCircuitBreaker: S.optional(ServiceDeploymentCircuitBreaker),
    alarms: S.optional(ServiceDeploymentAlarms),
  }),
).annotations({
  identifier: "ServiceDeployment",
}) as any as S.Schema<ServiceDeployment>;
export type ServiceDeployments = ServiceDeployment[];
export const ServiceDeployments = S.Array(ServiceDeployment);
export interface ServiceDeploymentBrief {
  serviceDeploymentArn?: string;
  serviceArn?: string;
  clusterArn?: string;
  startedAt?: Date;
  createdAt?: Date;
  finishedAt?: Date;
  targetServiceRevisionArn?: string;
  status?: ServiceDeploymentStatus;
  statusReason?: string;
}
export const ServiceDeploymentBrief = S.suspend(() =>
  S.Struct({
    serviceDeploymentArn: S.optional(S.String),
    serviceArn: S.optional(S.String),
    clusterArn: S.optional(S.String),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    finishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    targetServiceRevisionArn: S.optional(S.String),
    status: S.optional(ServiceDeploymentStatus),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceDeploymentBrief",
}) as any as S.Schema<ServiceDeploymentBrief>;
export type ServiceDeploymentsBrief = ServiceDeploymentBrief[];
export const ServiceDeploymentsBrief = S.Array(ServiceDeploymentBrief);
export type ResourceIds = string[];
export const ResourceIds = S.Array(S.String);
export interface ServiceRevisionLoadBalancer {
  targetGroupArn?: string;
  productionListenerRule?: string;
}
export const ServiceRevisionLoadBalancer = S.suspend(() =>
  S.Struct({
    targetGroupArn: S.optional(S.String),
    productionListenerRule: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceRevisionLoadBalancer",
}) as any as S.Schema<ServiceRevisionLoadBalancer>;
export type ServiceRevisionLoadBalancers = ServiceRevisionLoadBalancer[];
export const ServiceRevisionLoadBalancers = S.Array(
  ServiceRevisionLoadBalancer,
);
export interface ManagedMetricAlarm {
  arn?: string;
  status: ManagedResourceStatus;
  statusReason?: string;
  updatedAt: Date;
}
export const ManagedMetricAlarm = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: ManagedResourceStatus,
    statusReason: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ManagedMetricAlarm",
}) as any as S.Schema<ManagedMetricAlarm>;
export type ManagedMetricAlarms = ManagedMetricAlarm[];
export const ManagedMetricAlarms = S.Array(ManagedMetricAlarm);
export interface ManagedSecurityGroup {
  arn?: string;
  status: ManagedResourceStatus;
  statusReason?: string;
  updatedAt: Date;
}
export const ManagedSecurityGroup = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: ManagedResourceStatus,
    statusReason: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ManagedSecurityGroup",
}) as any as S.Schema<ManagedSecurityGroup>;
export type ManagedSecurityGroups = ManagedSecurityGroup[];
export const ManagedSecurityGroups = S.Array(ManagedSecurityGroup);
export interface ManagedLogGroup {
  arn?: string;
  status: ManagedResourceStatus;
  statusReason?: string;
  updatedAt: Date;
  logGroupName: string;
}
export const ManagedLogGroup = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: ManagedResourceStatus,
    statusReason: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    logGroupName: S.String,
  }),
).annotations({
  identifier: "ManagedLogGroup",
}) as any as S.Schema<ManagedLogGroup>;
export type ManagedLogGroups = ManagedLogGroup[];
export const ManagedLogGroups = S.Array(ManagedLogGroup);
export interface CreateClusterRequest {
  clusterName?: string;
  tags?: Tag[];
  settings?: ClusterSetting[];
  configuration?: ClusterConfiguration;
  capacityProviders?: string[];
  defaultCapacityProviderStrategy?: CapacityProviderStrategyItem[];
  serviceConnectDefaults?: ClusterServiceConnectDefaultsRequest;
}
export const CreateClusterRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.optional(S.String),
    tags: S.optional(Tags),
    settings: S.optional(ClusterSettings),
    configuration: S.optional(ClusterConfiguration),
    capacityProviders: S.optional(StringList),
    defaultCapacityProviderStrategy: S.optional(CapacityProviderStrategy),
    serviceConnectDefaults: S.optional(ClusterServiceConnectDefaultsRequest),
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
  identifier: "CreateClusterRequest",
}) as any as S.Schema<CreateClusterRequest>;
export interface CreateExpressGatewayServiceResponse {
  service?: ECSExpressGatewayService;
}
export const CreateExpressGatewayServiceResponse = S.suspend(() =>
  S.Struct({ service: S.optional(ECSExpressGatewayService) }).pipe(ns),
).annotations({
  identifier: "CreateExpressGatewayServiceResponse",
}) as any as S.Schema<CreateExpressGatewayServiceResponse>;
export interface DeleteCapacityProviderResponse {
  capacityProvider?: CapacityProvider;
}
export const DeleteCapacityProviderResponse = S.suspend(() =>
  S.Struct({ capacityProvider: S.optional(CapacityProvider) }).pipe(ns),
).annotations({
  identifier: "DeleteCapacityProviderResponse",
}) as any as S.Schema<DeleteCapacityProviderResponse>;
export interface DeleteClusterResponse {
  cluster?: Cluster;
}
export const DeleteClusterResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "DeleteClusterResponse",
}) as any as S.Schema<DeleteClusterResponse>;
export interface DeleteTaskSetResponse {
  taskSet?: TaskSet;
}
export const DeleteTaskSetResponse = S.suspend(() =>
  S.Struct({ taskSet: S.optional(TaskSet) }).pipe(ns),
).annotations({
  identifier: "DeleteTaskSetResponse",
}) as any as S.Schema<DeleteTaskSetResponse>;
export interface DescribeServiceDeploymentsResponse {
  serviceDeployments?: ServiceDeployment[];
  failures?: Failure[];
}
export const DescribeServiceDeploymentsResponse = S.suspend(() =>
  S.Struct({
    serviceDeployments: S.optional(ServiceDeployments),
    failures: S.optional(Failures),
  }).pipe(ns),
).annotations({
  identifier: "DescribeServiceDeploymentsResponse",
}) as any as S.Schema<DescribeServiceDeploymentsResponse>;
export interface ListServiceDeploymentsResponse {
  serviceDeployments?: ServiceDeploymentBrief[];
  nextToken?: string;
}
export const ListServiceDeploymentsResponse = S.suspend(() =>
  S.Struct({
    serviceDeployments: S.optional(ServiceDeploymentsBrief),
    nextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListServiceDeploymentsResponse",
}) as any as S.Schema<ListServiceDeploymentsResponse>;
export interface RegisterTaskDefinitionRequest {
  family: string;
  taskRoleArn?: string;
  executionRoleArn?: string;
  networkMode?: NetworkMode;
  containerDefinitions: ContainerDefinition[];
  volumes?: Volume[];
  placementConstraints?: TaskDefinitionPlacementConstraint[];
  requiresCompatibilities?: Compatibility[];
  cpu?: string;
  memory?: string;
  tags?: Tag[];
  pidMode?: PidMode;
  ipcMode?: IpcMode;
  proxyConfiguration?: ProxyConfiguration;
  inferenceAccelerators?: InferenceAccelerator[];
  ephemeralStorage?: EphemeralStorage;
  runtimePlatform?: RuntimePlatform;
  enableFaultInjection?: boolean;
}
export const RegisterTaskDefinitionRequest = S.suspend(() =>
  S.Struct({
    family: S.String,
    taskRoleArn: S.optional(S.String),
    executionRoleArn: S.optional(S.String),
    networkMode: S.optional(NetworkMode),
    containerDefinitions: ContainerDefinitions,
    volumes: S.optional(VolumeList),
    placementConstraints: S.optional(TaskDefinitionPlacementConstraints),
    requiresCompatibilities: S.optional(CompatibilityList),
    cpu: S.optional(S.String),
    memory: S.optional(S.String),
    tags: S.optional(Tags),
    pidMode: S.optional(PidMode),
    ipcMode: S.optional(IpcMode),
    proxyConfiguration: S.optional(ProxyConfiguration),
    inferenceAccelerators: S.optional(InferenceAccelerators),
    ephemeralStorage: S.optional(EphemeralStorage),
    runtimePlatform: S.optional(RuntimePlatform),
    enableFaultInjection: S.optional(S.Boolean),
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
  identifier: "RegisterTaskDefinitionRequest",
}) as any as S.Schema<RegisterTaskDefinitionRequest>;
export interface RunTaskRequest {
  capacityProviderStrategy?: CapacityProviderStrategyItem[];
  cluster?: string;
  count?: number;
  enableECSManagedTags?: boolean;
  enableExecuteCommand?: boolean;
  group?: string;
  launchType?: LaunchType;
  networkConfiguration?: NetworkConfiguration;
  overrides?: TaskOverride;
  placementConstraints?: PlacementConstraint[];
  placementStrategy?: PlacementStrategy[];
  platformVersion?: string;
  propagateTags?: PropagateTags;
  referenceId?: string;
  startedBy?: string;
  tags?: Tag[];
  taskDefinition: string;
  clientToken?: string;
  volumeConfigurations?: TaskVolumeConfiguration[];
}
export const RunTaskRequest = S.suspend(() =>
  S.Struct({
    capacityProviderStrategy: S.optional(CapacityProviderStrategy),
    cluster: S.optional(S.String),
    count: S.optional(S.Number),
    enableECSManagedTags: S.optional(S.Boolean),
    enableExecuteCommand: S.optional(S.Boolean),
    group: S.optional(S.String),
    launchType: S.optional(LaunchType),
    networkConfiguration: S.optional(NetworkConfiguration),
    overrides: S.optional(TaskOverride),
    placementConstraints: S.optional(PlacementConstraints),
    placementStrategy: S.optional(PlacementStrategies),
    platformVersion: S.optional(S.String),
    propagateTags: S.optional(PropagateTags),
    referenceId: S.optional(S.String),
    startedBy: S.optional(S.String),
    tags: S.optional(Tags),
    taskDefinition: S.String,
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    volumeConfigurations: S.optional(TaskVolumeConfigurations),
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
  identifier: "RunTaskRequest",
}) as any as S.Schema<RunTaskRequest>;
export interface UpdateCapacityProviderResponse {
  capacityProvider?: CapacityProvider;
}
export const UpdateCapacityProviderResponse = S.suspend(() =>
  S.Struct({ capacityProvider: S.optional(CapacityProvider) }).pipe(ns),
).annotations({
  identifier: "UpdateCapacityProviderResponse",
}) as any as S.Schema<UpdateCapacityProviderResponse>;
export interface ResolvedConfiguration {
  loadBalancers?: ServiceRevisionLoadBalancer[];
}
export const ResolvedConfiguration = S.suspend(() =>
  S.Struct({ loadBalancers: S.optional(ServiceRevisionLoadBalancers) }),
).annotations({
  identifier: "ResolvedConfiguration",
}) as any as S.Schema<ResolvedConfiguration>;
export interface ManagedLoadBalancer {
  arn?: string;
  status: ManagedResourceStatus;
  statusReason?: string;
  updatedAt: Date;
  scheme: string;
  subnetIds?: string[];
  securityGroupIds?: string[];
}
export const ManagedLoadBalancer = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: ManagedResourceStatus,
    statusReason: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    scheme: S.String,
    subnetIds: S.optional(StringList),
    securityGroupIds: S.optional(StringList),
  }),
).annotations({
  identifier: "ManagedLoadBalancer",
}) as any as S.Schema<ManagedLoadBalancer>;
export interface ManagedCertificate {
  arn?: string;
  status: ManagedResourceStatus;
  statusReason?: string;
  updatedAt: Date;
  domainName: string;
}
export const ManagedCertificate = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: ManagedResourceStatus,
    statusReason: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    domainName: S.String,
  }),
).annotations({
  identifier: "ManagedCertificate",
}) as any as S.Schema<ManagedCertificate>;
export interface ManagedListener {
  arn?: string;
  status: ManagedResourceStatus;
  statusReason?: string;
  updatedAt: Date;
}
export const ManagedListener = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: ManagedResourceStatus,
    statusReason: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ManagedListener",
}) as any as S.Schema<ManagedListener>;
export interface ManagedListenerRule {
  arn?: string;
  status: ManagedResourceStatus;
  statusReason?: string;
  updatedAt: Date;
}
export const ManagedListenerRule = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: ManagedResourceStatus,
    statusReason: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ManagedListenerRule",
}) as any as S.Schema<ManagedListenerRule>;
export interface ManagedTargetGroup {
  arn?: string;
  status: ManagedResourceStatus;
  statusReason?: string;
  updatedAt: Date;
  healthCheckPath: string;
  healthCheckPort: number;
  port: number;
}
export const ManagedTargetGroup = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: ManagedResourceStatus,
    statusReason: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    healthCheckPath: S.String,
    healthCheckPort: S.Number,
    port: S.Number,
  }),
).annotations({
  identifier: "ManagedTargetGroup",
}) as any as S.Schema<ManagedTargetGroup>;
export type ManagedTargetGroups = ManagedTargetGroup[];
export const ManagedTargetGroups = S.Array(ManagedTargetGroup);
export interface ManagedScalableTarget {
  arn?: string;
  status: ManagedResourceStatus;
  statusReason?: string;
  updatedAt: Date;
  minCapacity: number;
  maxCapacity: number;
}
export const ManagedScalableTarget = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: ManagedResourceStatus,
    statusReason: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    minCapacity: S.Number,
    maxCapacity: S.Number,
  }),
).annotations({
  identifier: "ManagedScalableTarget",
}) as any as S.Schema<ManagedScalableTarget>;
export interface ManagedApplicationAutoScalingPolicy {
  arn?: string;
  status: ManagedResourceStatus;
  statusReason?: string;
  updatedAt: Date;
  policyType: string;
  targetValue: number;
  metric: string;
}
export const ManagedApplicationAutoScalingPolicy = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    status: ManagedResourceStatus,
    statusReason: S.optional(S.String),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    policyType: S.String,
    targetValue: S.Number,
    metric: S.String,
  }),
).annotations({
  identifier: "ManagedApplicationAutoScalingPolicy",
}) as any as S.Schema<ManagedApplicationAutoScalingPolicy>;
export type ManagedApplicationAutoScalingPolicies =
  ManagedApplicationAutoScalingPolicy[];
export const ManagedApplicationAutoScalingPolicies = S.Array(
  ManagedApplicationAutoScalingPolicy,
);
export interface CreateManagedInstancesProviderConfiguration {
  infrastructureRoleArn: string;
  instanceLaunchTemplate: InstanceLaunchTemplate;
  propagateTags?: PropagateMITags;
  infrastructureOptimization?: InfrastructureOptimization;
}
export const CreateManagedInstancesProviderConfiguration = S.suspend(() =>
  S.Struct({
    infrastructureRoleArn: S.String,
    instanceLaunchTemplate: InstanceLaunchTemplate,
    propagateTags: S.optional(PropagateMITags),
    infrastructureOptimization: S.optional(InfrastructureOptimization),
  }),
).annotations({
  identifier: "CreateManagedInstancesProviderConfiguration",
}) as any as S.Schema<CreateManagedInstancesProviderConfiguration>;
export interface ManagedIngressPath {
  accessType: AccessType;
  endpoint: string;
  loadBalancer?: ManagedLoadBalancer;
  loadBalancerSecurityGroups?: ManagedSecurityGroup[];
  certificate?: ManagedCertificate;
  listener?: ManagedListener;
  rule?: ManagedListenerRule;
  targetGroups?: ManagedTargetGroup[];
}
export const ManagedIngressPath = S.suspend(() =>
  S.Struct({
    accessType: AccessType,
    endpoint: S.String,
    loadBalancer: S.optional(ManagedLoadBalancer),
    loadBalancerSecurityGroups: S.optional(ManagedSecurityGroups),
    certificate: S.optional(ManagedCertificate),
    listener: S.optional(ManagedListener),
    rule: S.optional(ManagedListenerRule),
    targetGroups: S.optional(ManagedTargetGroups),
  }),
).annotations({
  identifier: "ManagedIngressPath",
}) as any as S.Schema<ManagedIngressPath>;
export type ManagedIngressPaths = ManagedIngressPath[];
export const ManagedIngressPaths = S.Array(ManagedIngressPath);
export interface ManagedAutoScaling {
  scalableTarget?: ManagedScalableTarget;
  applicationAutoScalingPolicies?: ManagedApplicationAutoScalingPolicy[];
}
export const ManagedAutoScaling = S.suspend(() =>
  S.Struct({
    scalableTarget: S.optional(ManagedScalableTarget),
    applicationAutoScalingPolicies: S.optional(
      ManagedApplicationAutoScalingPolicies,
    ),
  }),
).annotations({
  identifier: "ManagedAutoScaling",
}) as any as S.Schema<ManagedAutoScaling>;
export interface CreateCapacityProviderRequest {
  name: string;
  cluster?: string;
  autoScalingGroupProvider?: AutoScalingGroupProvider;
  managedInstancesProvider?: CreateManagedInstancesProviderConfiguration;
  tags?: Tag[];
}
export const CreateCapacityProviderRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    cluster: S.optional(S.String),
    autoScalingGroupProvider: S.optional(AutoScalingGroupProvider),
    managedInstancesProvider: S.optional(
      CreateManagedInstancesProviderConfiguration,
    ),
    tags: S.optional(Tags),
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
  identifier: "CreateCapacityProviderRequest",
}) as any as S.Schema<CreateCapacityProviderRequest>;
export interface CreateClusterResponse {
  cluster?: Cluster;
}
export const CreateClusterResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }).pipe(ns),
).annotations({
  identifier: "CreateClusterResponse",
}) as any as S.Schema<CreateClusterResponse>;
export interface DeleteExpressGatewayServiceResponse {
  service?: ECSExpressGatewayService;
}
export const DeleteExpressGatewayServiceResponse = S.suspend(() =>
  S.Struct({ service: S.optional(ECSExpressGatewayService) }).pipe(ns),
).annotations({
  identifier: "DeleteExpressGatewayServiceResponse",
}) as any as S.Schema<DeleteExpressGatewayServiceResponse>;
export interface DeleteServiceResponse {
  service?: Service;
}
export const DeleteServiceResponse = S.suspend(() =>
  S.Struct({ service: S.optional(Service) }).pipe(ns),
).annotations({
  identifier: "DeleteServiceResponse",
}) as any as S.Schema<DeleteServiceResponse>;
export interface DeregisterContainerInstanceResponse {
  containerInstance?: ContainerInstance;
}
export const DeregisterContainerInstanceResponse = S.suspend(() =>
  S.Struct({ containerInstance: S.optional(ContainerInstance) }).pipe(ns),
).annotations({
  identifier: "DeregisterContainerInstanceResponse",
}) as any as S.Schema<DeregisterContainerInstanceResponse>;
export interface DescribeTasksResponse {
  tasks?: Task[];
  failures?: Failure[];
}
export const DescribeTasksResponse = S.suspend(() =>
  S.Struct({ tasks: S.optional(Tasks), failures: S.optional(Failures) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeTasksResponse",
}) as any as S.Schema<DescribeTasksResponse>;
export interface RegisterTaskDefinitionResponse {
  taskDefinition?: TaskDefinition;
  tags?: Tag[];
}
export const RegisterTaskDefinitionResponse = S.suspend(() =>
  S.Struct({
    taskDefinition: S.optional(TaskDefinition),
    tags: S.optional(Tags),
  }).pipe(ns),
).annotations({
  identifier: "RegisterTaskDefinitionResponse",
}) as any as S.Schema<RegisterTaskDefinitionResponse>;
export interface RunTaskResponse {
  tasks?: Task[];
  failures?: Failure[];
}
export const RunTaskResponse = S.suspend(() =>
  S.Struct({ tasks: S.optional(Tasks), failures: S.optional(Failures) }).pipe(
    ns,
  ),
).annotations({
  identifier: "RunTaskResponse",
}) as any as S.Schema<RunTaskResponse>;
export interface ECSManagedResources {
  ingressPaths?: ManagedIngressPath[];
  autoScaling?: ManagedAutoScaling;
  metricAlarms?: ManagedMetricAlarm[];
  serviceSecurityGroups?: ManagedSecurityGroup[];
  logGroups?: ManagedLogGroup[];
}
export const ECSManagedResources = S.suspend(() =>
  S.Struct({
    ingressPaths: S.optional(ManagedIngressPaths),
    autoScaling: S.optional(ManagedAutoScaling),
    metricAlarms: S.optional(ManagedMetricAlarms),
    serviceSecurityGroups: S.optional(ManagedSecurityGroups),
    logGroups: S.optional(ManagedLogGroups),
  }),
).annotations({
  identifier: "ECSManagedResources",
}) as any as S.Schema<ECSManagedResources>;
export interface ServiceRevision {
  serviceRevisionArn?: string;
  serviceArn?: string;
  clusterArn?: string;
  taskDefinition?: string;
  capacityProviderStrategy?: CapacityProviderStrategyItem[];
  launchType?: LaunchType;
  platformVersion?: string;
  platformFamily?: string;
  loadBalancers?: LoadBalancer[];
  serviceRegistries?: ServiceRegistry[];
  networkConfiguration?: NetworkConfiguration;
  containerImages?: ContainerImage[];
  guardDutyEnabled?: boolean;
  serviceConnectConfiguration?: ServiceConnectConfiguration;
  volumeConfigurations?: ServiceVolumeConfiguration[];
  fargateEphemeralStorage?: DeploymentEphemeralStorage;
  createdAt?: Date;
  vpcLatticeConfigurations?: VpcLatticeConfiguration[];
  resolvedConfiguration?: ResolvedConfiguration;
  ecsManagedResources?: ECSManagedResources;
}
export const ServiceRevision = S.suspend(() =>
  S.Struct({
    serviceRevisionArn: S.optional(S.String),
    serviceArn: S.optional(S.String),
    clusterArn: S.optional(S.String),
    taskDefinition: S.optional(S.String),
    capacityProviderStrategy: S.optional(CapacityProviderStrategy),
    launchType: S.optional(LaunchType),
    platformVersion: S.optional(S.String),
    platformFamily: S.optional(S.String),
    loadBalancers: S.optional(LoadBalancers),
    serviceRegistries: S.optional(ServiceRegistries),
    networkConfiguration: S.optional(NetworkConfiguration),
    containerImages: S.optional(ContainerImages),
    guardDutyEnabled: S.optional(S.Boolean),
    serviceConnectConfiguration: S.optional(ServiceConnectConfiguration),
    volumeConfigurations: S.optional(ServiceVolumeConfigurations),
    fargateEphemeralStorage: S.optional(DeploymentEphemeralStorage),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    vpcLatticeConfigurations: S.optional(VpcLatticeConfigurations),
    resolvedConfiguration: S.optional(ResolvedConfiguration),
    ecsManagedResources: S.optional(ECSManagedResources),
  }),
).annotations({
  identifier: "ServiceRevision",
}) as any as S.Schema<ServiceRevision>;
export type ServiceRevisions = ServiceRevision[];
export const ServiceRevisions = S.Array(ServiceRevision);
export interface CreateCapacityProviderResponse {
  capacityProvider?: CapacityProvider;
}
export const CreateCapacityProviderResponse = S.suspend(() =>
  S.Struct({ capacityProvider: S.optional(CapacityProvider) }).pipe(ns),
).annotations({
  identifier: "CreateCapacityProviderResponse",
}) as any as S.Schema<CreateCapacityProviderResponse>;
export interface DescribeServiceRevisionsResponse {
  serviceRevisions?: ServiceRevision[];
  failures?: Failure[];
}
export const DescribeServiceRevisionsResponse = S.suspend(() =>
  S.Struct({
    serviceRevisions: S.optional(ServiceRevisions),
    failures: S.optional(Failures),
  }).pipe(ns),
).annotations({
  identifier: "DescribeServiceRevisionsResponse",
}) as any as S.Schema<DescribeServiceRevisionsResponse>;
export interface CreateServiceRequest {
  cluster?: string;
  serviceName: string;
  taskDefinition?: string;
  availabilityZoneRebalancing?: AvailabilityZoneRebalancing;
  loadBalancers?: LoadBalancer[];
  serviceRegistries?: ServiceRegistry[];
  desiredCount?: number;
  clientToken?: string;
  launchType?: LaunchType;
  capacityProviderStrategy?: CapacityProviderStrategyItem[];
  platformVersion?: string;
  role?: string;
  deploymentConfiguration?: DeploymentConfiguration;
  placementConstraints?: PlacementConstraint[];
  placementStrategy?: PlacementStrategy[];
  networkConfiguration?: NetworkConfiguration;
  healthCheckGracePeriodSeconds?: number;
  schedulingStrategy?: SchedulingStrategy;
  deploymentController?: DeploymentController;
  tags?: Tag[];
  enableECSManagedTags?: boolean;
  propagateTags?: PropagateTags;
  enableExecuteCommand?: boolean;
  serviceConnectConfiguration?: ServiceConnectConfiguration;
  volumeConfigurations?: ServiceVolumeConfiguration[];
  vpcLatticeConfigurations?: VpcLatticeConfiguration[];
}
export const CreateServiceRequest = S.suspend(() =>
  S.Struct({
    cluster: S.optional(S.String),
    serviceName: S.String,
    taskDefinition: S.optional(S.String),
    availabilityZoneRebalancing: S.optional(AvailabilityZoneRebalancing),
    loadBalancers: S.optional(LoadBalancers),
    serviceRegistries: S.optional(ServiceRegistries),
    desiredCount: S.optional(S.Number),
    clientToken: S.optional(S.String),
    launchType: S.optional(LaunchType),
    capacityProviderStrategy: S.optional(CapacityProviderStrategy),
    platformVersion: S.optional(S.String),
    role: S.optional(S.String),
    deploymentConfiguration: S.optional(DeploymentConfiguration),
    placementConstraints: S.optional(PlacementConstraints),
    placementStrategy: S.optional(PlacementStrategies),
    networkConfiguration: S.optional(NetworkConfiguration),
    healthCheckGracePeriodSeconds: S.optional(S.Number),
    schedulingStrategy: S.optional(SchedulingStrategy),
    deploymentController: S.optional(DeploymentController),
    tags: S.optional(Tags),
    enableECSManagedTags: S.optional(S.Boolean),
    propagateTags: S.optional(PropagateTags),
    enableExecuteCommand: S.optional(S.Boolean),
    serviceConnectConfiguration: S.optional(ServiceConnectConfiguration),
    volumeConfigurations: S.optional(ServiceVolumeConfigurations),
    vpcLatticeConfigurations: S.optional(VpcLatticeConfigurations),
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
  identifier: "CreateServiceRequest",
}) as any as S.Schema<CreateServiceRequest>;
export interface CreateServiceResponse {
  service?: Service;
}
export const CreateServiceResponse = S.suspend(() =>
  S.Struct({ service: S.optional(Service) }).pipe(ns),
).annotations({
  identifier: "CreateServiceResponse",
}) as any as S.Schema<CreateServiceResponse>;

//# Errors
export class ClientException extends S.TaggedError<ClientException>()(
  "ClientException",
  { message: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ClusterNotFoundException extends S.TaggedError<ClusterNotFoundException>()(
  "ClusterNotFoundException",
  { message: S.optional(S.String) },
) {}
export class AttributeLimitExceededException extends S.TaggedError<AttributeLimitExceededException>()(
  "AttributeLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { message: S.optional(S.String) },
) {}
export class ServerException extends S.TaggedError<ServerException>()(
  "ServerException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { resourceIds: S.optional(ResourceIds), message: S.optional(S.String) },
) {}
export class NamespaceNotFoundException extends S.TaggedError<NamespaceNotFoundException>()(
  "NamespaceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class TargetNotFoundException extends S.TaggedError<TargetNotFoundException>()(
  "TargetNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ServiceNotActiveException extends S.TaggedError<ServiceNotActiveException>()(
  "ServiceNotActiveException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class MissingVersionException extends S.TaggedError<MissingVersionException>()(
  "MissingVersionException",
  { message: S.optional(S.String) },
) {}
export class UnsupportedFeatureException extends S.TaggedError<UnsupportedFeatureException>()(
  "UnsupportedFeatureException",
  { message: S.optional(S.String) },
) {}
export class ServiceNotFoundException extends S.TaggedError<ServiceNotFoundException>()(
  "ServiceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class TargetNotConnectedException extends S.TaggedError<TargetNotConnectedException>()(
  "TargetNotConnectedException",
  { message: S.optional(S.String) },
) {}
export class PlatformTaskDefinitionIncompatibilityException extends S.TaggedError<PlatformTaskDefinitionIncompatibilityException>()(
  "PlatformTaskDefinitionIncompatibilityException",
  { message: S.optional(S.String) },
) {}
export class ClusterContainsCapacityProviderException extends S.TaggedError<ClusterContainsCapacityProviderException>()(
  "ClusterContainsCapacityProviderException",
  { message: S.optional(S.String) },
) {}
export class ServiceDeploymentNotFoundException extends S.TaggedError<ServiceDeploymentNotFoundException>()(
  "ServiceDeploymentNotFoundException",
  { message: S.optional(S.String) },
) {}
export class NoUpdateAvailableException extends S.TaggedError<NoUpdateAvailableException>()(
  "NoUpdateAvailableException",
  { message: S.optional(S.String) },
) {}
export class UpdateInProgressException extends S.TaggedError<UpdateInProgressException>()(
  "UpdateInProgressException",
  { message: S.optional(S.String) },
) {}
export class TaskSetNotFoundException extends S.TaggedError<TaskSetNotFoundException>()(
  "TaskSetNotFoundException",
  { message: S.optional(S.String) },
) {}
export class PlatformUnknownException extends S.TaggedError<PlatformUnknownException>()(
  "PlatformUnknownException",
  { message: S.optional(S.String) },
) {}
export class ClusterContainsContainerInstancesException extends S.TaggedError<ClusterContainsContainerInstancesException>()(
  "ClusterContainsContainerInstancesException",
  { message: S.optional(S.String) },
) {}
export class BlockedException extends S.TaggedError<BlockedException>()(
  "BlockedException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ClusterContainsServicesException extends S.TaggedError<ClusterContainsServicesException>()(
  "ClusterContainsServicesException",
  { message: S.optional(S.String) },
) {}
export class ClusterContainsTasksException extends S.TaggedError<ClusterContainsTasksException>()(
  "ClusterContainsTasksException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * This action is only used by the Amazon ECS agent, and it is not intended for use
 * outside of the agent.
 *
 * Returns an endpoint for the Amazon ECS agent to poll for updates.
 */
export const discoverPollEndpoint: (
  input: DiscoverPollEndpointRequest,
) => effect.Effect<
  DiscoverPollEndpointResponse,
  ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DiscoverPollEndpointRequest,
  output: DiscoverPollEndpointResponse,
  errors: [ClientException, ServerException],
}));
/**
 * Describes one or more of your clusters.
 *
 * For CLI
 * examples, see describe-clusters.rst on GitHub.
 */
export const describeClusters: (
  input: DescribeClustersRequest,
) => effect.Effect<
  DescribeClustersResponse,
  ClientException | InvalidParameterException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClustersRequest,
  output: DescribeClustersResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * Describes a task definition. You can specify a `family` and
 * `revision` to find information about a specific task definition, or you
 * can simply specify the family to find the latest `ACTIVE` revision in that
 * family.
 *
 * You can only describe `INACTIVE` task definitions while an active task
 * or service references them.
 */
export const describeTaskDefinition: (
  input: DescribeTaskDefinitionRequest,
) => effect.Effect<
  DescribeTaskDefinitionResponse,
  ClientException | InvalidParameterException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTaskDefinitionRequest,
  output: DescribeTaskDefinitionResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * Lists the account settings for a specified principal.
 */
export const listAccountSettings: {
  (
    input: ListAccountSettingsRequest,
  ): effect.Effect<
    ListAccountSettingsResponse,
    | ClientException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccountSettingsRequest,
  ) => stream.Stream<
    ListAccountSettingsResponse,
    | ClientException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccountSettingsRequest,
  ) => stream.Stream<
    Setting,
    | ClientException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAccountSettingsRequest,
  output: ListAccountSettingsResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "settings",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of existing clusters.
 */
export const listClusters: {
  (
    input: ListClustersRequest,
  ): effect.Effect<
    ListClustersResponse,
    | ClientException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClustersRequest,
  ) => stream.Stream<
    ListClustersResponse,
    | ClientException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClustersRequest,
  ) => stream.Stream<
    string,
    | ClientException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClustersRequest,
  output: ListClustersResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "clusterArns",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of task definition families that are registered to your account. This
 * list includes task definition families that no longer have any `ACTIVE` task
 * definition revisions.
 *
 * You can filter out task definition families that don't contain any `ACTIVE`
 * task definition revisions by setting the `status` parameter to
 * `ACTIVE`. You can also filter the results with the
 * `familyPrefix` parameter.
 */
export const listTaskDefinitionFamilies: {
  (
    input: ListTaskDefinitionFamiliesRequest,
  ): effect.Effect<
    ListTaskDefinitionFamiliesResponse,
    | ClientException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTaskDefinitionFamiliesRequest,
  ) => stream.Stream<
    ListTaskDefinitionFamiliesResponse,
    | ClientException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTaskDefinitionFamiliesRequest,
  ) => stream.Stream<
    string,
    | ClientException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTaskDefinitionFamiliesRequest,
  output: ListTaskDefinitionFamiliesResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "families",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of task definitions that are registered to your account. You can filter
 * the results by family name with the `familyPrefix` parameter or by status
 * with the `status` parameter.
 */
export const listTaskDefinitions: {
  (
    input: ListTaskDefinitionsRequest,
  ): effect.Effect<
    ListTaskDefinitionsResponse,
    | ClientException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTaskDefinitionsRequest,
  ) => stream.Stream<
    ListTaskDefinitionsResponse,
    | ClientException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTaskDefinitionsRequest,
  ) => stream.Stream<
    string,
    | ClientException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTaskDefinitionsRequest,
  output: ListTaskDefinitionsResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "taskDefinitionArns",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Modifies an account setting. Account settings are set on a per-Region basis.
 *
 * If you change the root user account setting, the default settings are reset for users
 * and roles that do not have specified individual account settings. For more information,
 * see Account
 * Settings in the Amazon Elastic Container Service Developer
 * Guide.
 */
export const putAccountSetting: (
  input: PutAccountSettingRequest,
) => effect.Effect<
  PutAccountSettingResponse,
  ClientException | InvalidParameterException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountSettingRequest,
  output: PutAccountSettingResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * Modifies an account setting for all users on an account for whom no individual account
 * setting has been specified. Account settings are set on a per-Region basis.
 */
export const putAccountSettingDefault: (
  input: PutAccountSettingDefaultRequest,
) => effect.Effect<
  PutAccountSettingDefaultResponse,
  ClientException | InvalidParameterException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountSettingDefaultRequest,
  output: PutAccountSettingDefaultResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * Disables an account setting for a specified user, role, or the root user for an
 * account.
 */
export const deleteAccountSetting: (
  input: DeleteAccountSettingRequest,
) => effect.Effect<
  DeleteAccountSettingResponse,
  ClientException | InvalidParameterException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccountSettingRequest,
  output: DeleteAccountSettingResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * Lists the attributes for Amazon ECS resources within a specified target type and
 * cluster. When you specify a target type and cluster, `ListAttributes` returns
 * a list of attribute objects, one for each attribute on each resource. You can filter the
 * list of results to a single attribute name to only return results that have that name.
 * You can also filter the results by attribute name and value. You can do this, for
 * example, to see which container instances in a cluster are running a Linux AMI
 * (`ecs.os-type=linux`).
 */
export const listAttributes: {
  (
    input: ListAttributesRequest,
  ): effect.Effect<
    ListAttributesResponse,
    ClusterNotFoundException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAttributesRequest,
  ) => stream.Stream<
    ListAttributesResponse,
    ClusterNotFoundException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAttributesRequest,
  ) => stream.Stream<
    Attribute,
    ClusterNotFoundException | InvalidParameterException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAttributesRequest,
  output: ListAttributesResponse,
  errors: [ClusterNotFoundException, InvalidParameterException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "attributes",
    pageSize: "maxResults",
  } as const,
}));
/**
 * This action is only used by the Amazon ECS agent, and it is not intended for use
 * outside of the agent.
 *
 * Registers an EC2 instance into the specified cluster. This instance becomes available
 * to place containers on.
 */
export const registerContainerInstance: (
  input: RegisterContainerInstanceRequest,
) => effect.Effect<
  RegisterContainerInstanceResponse,
  ClientException | InvalidParameterException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterContainerInstanceRequest,
  output: RegisterContainerInstanceResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * This action is only used by the Amazon ECS agent, and it is not intended for use
 * outside of the agent.
 *
 * Sent to acknowledge that an attachment changed states.
 */
export const submitAttachmentStateChanges: (
  input: SubmitAttachmentStateChangesRequest,
) => effect.Effect<
  SubmitAttachmentStateChangesResponse,
  | AccessDeniedException
  | ClientException
  | InvalidParameterException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubmitAttachmentStateChangesRequest,
  output: SubmitAttachmentStateChangesResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * This action is only used by the Amazon ECS agent, and it is not intended for use
 * outside of the agent.
 *
 * Sent to acknowledge that a task changed states.
 */
export const submitTaskStateChange: (
  input: SubmitTaskStateChangeRequest,
) => effect.Effect<
  SubmitTaskStateChangeResponse,
  | AccessDeniedException
  | ClientException
  | InvalidParameterException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubmitTaskStateChangeRequest,
  output: SubmitTaskStateChangeResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Deletes one or more task definitions.
 *
 * You must deregister a task definition revision before you delete it. For more
 * information, see DeregisterTaskDefinition.
 *
 * When you delete a task definition revision, it is immediately transitions from the
 * `INACTIVE` to `DELETE_IN_PROGRESS`. Existing tasks and
 * services that reference a `DELETE_IN_PROGRESS` task definition revision
 * continue to run without disruption. Existing services that reference a
 * `DELETE_IN_PROGRESS` task definition revision can still scale up or down
 * by modifying the service's desired count.
 *
 * You can't use a `DELETE_IN_PROGRESS` task definition revision to run new
 * tasks or create new services. You also can't update an existing service to reference a
 * `DELETE_IN_PROGRESS` task definition revision.
 *
 * A task definition revision will stay in `DELETE_IN_PROGRESS` status until
 * all the associated tasks and services have been terminated.
 *
 * When you delete all `INACTIVE` task definition revisions, the task
 * definition name is not displayed in the console and not returned in the API. If a task
 * definition revisions are in the `DELETE_IN_PROGRESS` state, the task
 * definition name is displayed in the console and returned in the API. The task definition
 * name is retained by Amazon ECS and the revision is incremented the next time you create
 * a task definition with that name.
 */
export const deleteTaskDefinitions: (
  input: DeleteTaskDefinitionsRequest,
) => effect.Effect<
  DeleteTaskDefinitionsResponse,
  | AccessDeniedException
  | ClientException
  | InvalidParameterException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTaskDefinitionsRequest,
  output: DeleteTaskDefinitionsResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Modifies the settings to use for a cluster.
 */
export const updateClusterSettings: (
  input: UpdateClusterSettingsRequest,
) => effect.Effect<
  UpdateClusterSettingsResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterSettingsRequest,
  output: UpdateClusterSettingsResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Modifies the status of an Amazon ECS container instance.
 *
 * Once a container instance has reached an `ACTIVE` state, you can change the
 * status of a container instance to `DRAINING` to manually remove an instance
 * from a cluster, for example to perform system updates, update the Docker daemon, or
 * scale down the cluster size.
 *
 * A container instance can't be changed to `DRAINING` until it has
 * reached an `ACTIVE` status. If the instance is in any other status, an
 * error will be received.
 *
 * When you set a container instance to `DRAINING`, Amazon ECS prevents new
 * tasks from being scheduled for placement on the container instance and replacement
 * service tasks are started on other container instances in the cluster if the resources
 * are available. Service tasks on the container instance that are in the
 * `PENDING` state are stopped immediately.
 *
 * Service tasks on the container instance that are in the `RUNNING` state are
 * stopped and replaced according to the service's deployment configuration parameters,
 * `minimumHealthyPercent` and `maximumPercent`. You can change
 * the deployment configuration of your service using UpdateService.
 *
 * - If `minimumHealthyPercent` is below 100%, the scheduler can ignore
 * `desiredCount` temporarily during task replacement. For example,
 * `desiredCount` is four tasks, a minimum of 50% allows the
 * scheduler to stop two existing tasks before starting two new tasks. If the
 * minimum is 100%, the service scheduler can't remove existing tasks until the
 * replacement tasks are considered healthy. Tasks for services that do not use a
 * load balancer are considered healthy if they're in the `RUNNING`
 * state. Tasks for services that use a load balancer are considered healthy if
 * they're in the `RUNNING` state and are reported as healthy by the
 * load balancer.
 *
 * - The `maximumPercent` parameter represents an upper limit on the
 * number of running tasks during task replacement. You can use this to define the
 * replacement batch size. For example, if `desiredCount` is four tasks,
 * a maximum of 200% starts four new tasks before stopping the four tasks to be
 * drained, provided that the cluster resources required to do this are available.
 * If the maximum is 100%, then replacement tasks can't start until the draining
 * tasks have stopped.
 *
 * Any `PENDING` or `RUNNING` tasks that do not belong to a service
 * aren't affected. You must wait for them to finish or stop them manually.
 *
 * A container instance has completed draining when it has no more `RUNNING`
 * tasks. You can verify this using ListTasks.
 *
 * When a container instance has been drained, you can set a container instance to
 * `ACTIVE` status and once it has reached that status the Amazon ECS
 * scheduler can begin scheduling tasks on the instance again.
 */
export const updateContainerInstancesState: (
  input: UpdateContainerInstancesStateRequest,
) => effect.Effect<
  UpdateContainerInstancesStateResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateContainerInstancesStateRequest,
  output: UpdateContainerInstancesStateResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Describes one or more container instances. Returns metadata about each container
 * instance requested.
 */
export const describeContainerInstances: (
  input: DescribeContainerInstancesRequest,
) => effect.Effect<
  DescribeContainerInstancesResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeContainerInstancesRequest,
  output: DescribeContainerInstancesResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Describes the specified services running in your cluster.
 */
export const describeServices: (
  input: DescribeServicesRequest,
) => effect.Effect<
  DescribeServicesResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeServicesRequest,
  output: DescribeServicesResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Returns a list of container instances in a specified cluster. You can filter the
 * results of a `ListContainerInstances` operation with cluster query language
 * statements inside the `filter` parameter. For more information, see Cluster Query Language in the Amazon Elastic
 * Container Service Developer Guide.
 */
export const listContainerInstances: {
  (
    input: ListContainerInstancesRequest,
  ): effect.Effect<
    ListContainerInstancesResponse,
    | ClientException
    | ClusterNotFoundException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListContainerInstancesRequest,
  ) => stream.Stream<
    ListContainerInstancesResponse,
    | ClientException
    | ClusterNotFoundException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListContainerInstancesRequest,
  ) => stream.Stream<
    string,
    | ClientException
    | ClusterNotFoundException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListContainerInstancesRequest,
  output: ListContainerInstancesResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "containerInstanceArns",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of services. You can filter the results by cluster, launch type, and
 * scheduling strategy.
 */
export const listServices: {
  (
    input: ListServicesRequest,
  ): effect.Effect<
    ListServicesResponse,
    | ClientException
    | ClusterNotFoundException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServicesRequest,
  ) => stream.Stream<
    ListServicesResponse,
    | ClientException
    | ClusterNotFoundException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServicesRequest,
  ) => stream.Stream<
    string,
    | ClientException
    | ClusterNotFoundException
    | InvalidParameterException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServicesRequest,
  output: ListServicesResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "serviceArns",
    pageSize: "maxResults",
  } as const,
}));
/**
 * List the tags for an Amazon ECS resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Stops a running task. Any tags associated with the task will be deleted.
 *
 * When you call `StopTask` on a task, the equivalent of docker
 * stop is issued to the containers running in the task. This results in a
 * stop signal value and a default 30-second timeout, after which the
 * `SIGKILL` value is sent and the containers are forcibly stopped. This
 * signal can be defined in your container image with the `STOPSIGNAL` instruction
 * and will default to `SIGTERM`. If the container handles the `SIGTERM`
 * value gracefully and exits within 30 seconds from receiving it, no `SIGKILL` value
 * is sent.
 *
 * For Windows containers, POSIX signals do not work and runtime stops the container by
 * sending a `CTRL_SHUTDOWN_EVENT`. For more information, see Unable to react to graceful shutdown
 * of (Windows) container #25982 on GitHub.
 *
 * The default 30-second timeout can be configured on the Amazon ECS container agent
 * with the `ECS_CONTAINER_STOP_TIMEOUT` variable. For more information, see
 * Amazon ECS Container Agent Configuration in the
 * *Amazon Elastic Container Service Developer Guide*.
 */
export const stopTask: (
  input: StopTaskRequest,
) => effect.Effect<
  StopTaskResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopTaskRequest,
  output: StopTaskResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * This action is only used by the Amazon ECS agent, and it is not intended for use
 * outside of the agent.
 *
 * Sent to acknowledge that a container changed states.
 */
export const submitContainerStateChange: (
  input: SubmitContainerStateChangeRequest,
) => effect.Effect<
  SubmitContainerStateChangeResponse,
  AccessDeniedException | ClientException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SubmitContainerStateChangeRequest,
  output: SubmitContainerStateChangeResponse,
  errors: [AccessDeniedException, ClientException, ServerException],
}));
/**
 * Deregisters the specified task definition by family and revision. Upon deregistration,
 * the task definition is marked as `INACTIVE`. Existing tasks and services that
 * reference an `INACTIVE` task definition continue to run without disruption.
 * Existing services that reference an `INACTIVE` task definition can still
 * scale up or down by modifying the service's desired count. If you want to delete a task
 * definition revision, you must first deregister the task definition revision.
 *
 * You can't use an `INACTIVE` task definition to run new tasks or create new
 * services, and you can't update an existing service to reference an `INACTIVE`
 * task definition. However, there may be up to a 10-minute window following deregistration
 * where these restrictions have not yet taken effect.
 *
 * At this time, `INACTIVE` task definitions remain discoverable in your
 * account indefinitely. However, this behavior is subject to change in the future. We
 * don't recommend that you rely on `INACTIVE` task definitions persisting
 * beyond the lifecycle of any associated tasks and services.
 *
 * You must deregister a task definition revision before you delete it. For more
 * information, see DeleteTaskDefinitions.
 */
export const deregisterTaskDefinition: (
  input: DeregisterTaskDefinitionRequest,
) => effect.Effect<
  DeregisterTaskDefinitionResponse,
  ClientException | InvalidParameterException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterTaskDefinitionRequest,
  output: DeregisterTaskDefinitionResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * This operation lists all of the services that are associated with a Cloud Map namespace.
 * This list might include services in different clusters. In contrast,
 * `ListServices` can only list services in one cluster at a time. If you
 * need to filter the list of services in a single cluster by various parameters, use
 * `ListServices`. For more information, see Service Connect
 * in the *Amazon Elastic Container Service Developer Guide*.
 */
export const listServicesByNamespace: {
  (
    input: ListServicesByNamespaceRequest,
  ): effect.Effect<
    ListServicesByNamespaceResponse,
    | ClientException
    | InvalidParameterException
    | NamespaceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServicesByNamespaceRequest,
  ) => stream.Stream<
    ListServicesByNamespaceResponse,
    | ClientException
    | InvalidParameterException
    | NamespaceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServicesByNamespaceRequest,
  ) => stream.Stream<
    string,
    | ClientException
    | InvalidParameterException
    | NamespaceNotFoundException
    | ServerException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServicesByNamespaceRequest,
  output: ListServicesByNamespaceResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    NamespaceNotFoundException,
    ServerException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "serviceArns",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Create or update an attribute on an Amazon ECS resource. If the attribute doesn't
 * exist, it's created. If the attribute exists, its value is replaced with the specified
 * value. To delete an attribute, use DeleteAttributes. For more information, see Attributes in the Amazon Elastic Container
 * Service Developer Guide.
 */
export const putAttributes: (
  input: PutAttributesRequest,
) => effect.Effect<
  PutAttributesResponse,
  | AttributeLimitExceededException
  | ClusterNotFoundException
  | InvalidParameterException
  | TargetNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAttributesRequest,
  output: PutAttributesResponse,
  errors: [
    AttributeLimitExceededException,
    ClusterNotFoundException,
    InvalidParameterException,
    TargetNotFoundException,
  ],
}));
/**
 * Describes one or more of your capacity providers.
 */
export const describeCapacityProviders: (
  input: DescribeCapacityProvidersRequest,
) => effect.Effect<
  DescribeCapacityProvidersResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCapacityProvidersRequest,
  output: DescribeCapacityProvidersResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Returns a list of tasks. You can filter the results by cluster, task definition
 * family, container instance, launch type, what IAM principal started the task, or by the
 * desired status of the task.
 *
 * Recently stopped tasks might appear in the returned results.
 */
export const listTasks: {
  (
    input: ListTasksRequest,
  ): effect.Effect<
    ListTasksResponse,
    | ClientException
    | ClusterNotFoundException
    | InvalidParameterException
    | ServerException
    | ServiceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTasksRequest,
  ) => stream.Stream<
    ListTasksResponse,
    | ClientException
    | ClusterNotFoundException
    | InvalidParameterException
    | ServerException
    | ServiceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTasksRequest,
  ) => stream.Stream<
    string,
    | ClientException
    | ClusterNotFoundException
    | InvalidParameterException
    | ServerException
    | ServiceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTasksRequest,
  output: ListTasksResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotFoundException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "taskArns",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Runs a command remotely on a container within a task.
 *
 * If you use a condition key in your IAM policy to refine the conditions for the policy
 * statement, for example limit the actions to a specific cluster, you receive an
 * `AccessDeniedException` when there is a mismatch between the condition
 * key value and the corresponding parameter value.
 *
 * For information about required permissions and considerations, see Using
 * Amazon ECS Exec for debugging in the Amazon ECS Developer
 * Guide.
 */
export const executeCommand: (
  input: ExecuteCommandRequest,
) => effect.Effect<
  ExecuteCommandResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | TargetNotConnectedException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteCommandRequest,
  output: ExecuteCommandResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    TargetNotConnectedException,
  ],
}));
/**
 * Updates the cluster.
 */
export const updateCluster: (
  input: UpdateClusterRequest,
) => effect.Effect<
  UpdateClusterResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | NamespaceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterRequest,
  output: UpdateClusterResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    NamespaceNotFoundException,
    ServerException,
  ],
}));
/**
 * Deletes one or more custom attributes from an Amazon ECS resource.
 */
export const deleteAttributes: (
  input: DeleteAttributesRequest,
) => effect.Effect<
  DeleteAttributesResponse,
  | ClusterNotFoundException
  | InvalidParameterException
  | TargetNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAttributesRequest,
  output: DeleteAttributesResponse,
  errors: [
    ClusterNotFoundException,
    InvalidParameterException,
    TargetNotFoundException,
  ],
}));
/**
 * Describes the task sets in the specified cluster and service. This is used when a
 * service uses the `EXTERNAL` deployment controller type. For more information,
 * see Amazon ECS Deployment
 * Types in the Amazon Elastic Container Service Developer
 * Guide.
 */
export const describeTaskSets: (
  input: DescribeTaskSetsRequest,
) => effect.Effect<
  DescribeTaskSetsResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | ServiceNotActiveException
  | ServiceNotFoundException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTaskSetsRequest,
  output: DescribeTaskSetsResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Associates the specified tags to a resource with the specified
 * `resourceArn`. If existing tags on a resource aren't specified in the
 * request parameters, they aren't changed. When a resource is deleted, the tags that are
 * associated with that resource are deleted as well.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Deletes specified tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Retrieves detailed information about an Express service, including current status,
 * configuration, managed infrastructure, and service revisions.
 *
 * Returns comprehensive service details, active service revisions, ingress paths with
 * endpoints, and managed Amazon Web Services resource status including load balancers and auto-scaling
 * policies.
 *
 * Use the `include` parameter to retrieve additional information such as
 * resource tags.
 */
export const describeExpressGatewayService: (
  input: DescribeExpressGatewayServiceRequest,
) => effect.Effect<
  DescribeExpressGatewayServiceResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServerException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExpressGatewayServiceRequest,
  output: DescribeExpressGatewayServiceResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Retrieves the protection status of tasks in an Amazon ECS service.
 */
export const getTaskProtection: (
  input: GetTaskProtectionRequest,
) => effect.Effect<
  GetTaskProtectionResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServerException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTaskProtectionRequest,
  output: GetTaskProtectionResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Starts a new task from the specified task definition on the specified container
 * instance or instances.
 *
 * On March 21, 2024, a change was made to resolve the task definition revision
 * before authorization. When a task definition revision is not specified,
 * authorization will occur using the latest revision of a task definition.
 *
 * Amazon Elastic Inference (EI) is no longer available to customers.
 *
 * Alternatively, you can use`RunTask` to place tasks for you. For more
 * information, see Scheduling Tasks in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * You can attach Amazon EBS volumes to Amazon ECS tasks by configuring the volume when
 * creating or updating a service. For more information, see Amazon EBS volumes in the Amazon Elastic
 * Container Service Developer Guide.
 */
export const startTask: (
  input: StartTaskRequest,
) => effect.Effect<
  StartTaskResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTaskRequest,
  output: StartTaskResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Deletes the specified capacity provider.
 *
 * The `FARGATE` and `FARGATE_SPOT` capacity providers are
 * reserved and can't be deleted. You can disassociate them from a cluster using either
 * PutClusterCapacityProviders or by deleting the cluster.
 *
 * Prior to a capacity provider being deleted, the capacity provider must be removed from
 * the capacity provider strategy from all services. The UpdateService API
 * can be used to remove a capacity provider from a service's capacity provider strategy.
 * When updating a service, the `forceNewDeployment` option can be used to
 * ensure that any tasks using the Amazon EC2 instance capacity provided by the capacity
 * provider are transitioned to use the capacity from the remaining capacity providers.
 * Only capacity providers that aren't associated with a cluster can be deleted. To remove
 * a capacity provider from a cluster, you can either use PutClusterCapacityProviders or delete the cluster.
 */
export const deleteCapacityProvider: (
  input: DeleteCapacityProviderRequest,
) => effect.Effect<
  DeleteCapacityProviderResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCapacityProviderRequest,
  output: DeleteCapacityProviderResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Modifies the parameters for a capacity provider.
 *
 * These changes only apply to new Amazon ECS Managed Instances, or EC2 instances, not
 * existing ones.
 */
export const updateCapacityProvider: (
  input: UpdateCapacityProviderRequest,
) => effect.Effect<
  UpdateCapacityProviderResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCapacityProviderRequest,
  output: UpdateCapacityProviderResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Updates the protection status of a task. You can set `protectionEnabled` to
 * `true` to protect your task from termination during scale-in events from
 * Service
 * Autoscaling or deployments.
 *
 * Task-protection, by default, expires after 2 hours at which point Amazon ECS clears
 * the `protectionEnabled` property making the task eligible for termination by
 * a subsequent scale-in event.
 *
 * You can specify a custom expiration period for task protection from 1 minute to up to
 * 2,880 minutes (48 hours). To specify the custom expiration period, set the
 * `expiresInMinutes` property. The `expiresInMinutes` property
 * is always reset when you invoke this operation for a task that already has
 * `protectionEnabled` set to `true`. You can keep extending the
 * protection expiration period of a task by invoking this operation repeatedly.
 *
 * To learn more about Amazon ECS task protection, see Task scale-in
 * protection in the
 * Amazon Elastic Container Service
 * Developer Guide
 * .
 *
 * This operation is only supported for tasks belonging to an Amazon ECS service.
 * Invoking this operation for a standalone task will result in an
 * `TASK_NOT_VALID` failure. For more information, see API failure
 * reasons.
 *
 * If you prefer to set task protection from within the container, we recommend using
 * the Task scale-in protection endpoint.
 */
export const updateTaskProtection: (
  input: UpdateTaskProtectionRequest,
) => effect.Effect<
  UpdateTaskProtectionResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ResourceNotFoundException
  | ServerException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTaskProtectionRequest,
  output: UpdateTaskProtectionResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Describes one or more of your service deployments.
 *
 * A service deployment happens when you release a software update for the service. For
 * more information, see View service history
 * using Amazon ECS service deployments.
 */
export const describeServiceDeployments: (
  input: DescribeServiceDeploymentsRequest,
) => effect.Effect<
  DescribeServiceDeploymentsResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | ServiceNotFoundException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeServiceDeploymentsRequest,
  output: DescribeServiceDeploymentsResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * This operation lists all the service deployments that meet the specified filter
 * criteria.
 *
 * A service deployment happens when you release a software update for the service. You
 * route traffic from the running service revisions to the new service revison and control
 * the number of running tasks.
 *
 * This API returns the values that you use for the request parameters in DescribeServiceRevisions.
 */
export const listServiceDeployments: (
  input: ListServiceDeploymentsRequest,
) => effect.Effect<
  ListServiceDeploymentsResponse,
  | AccessDeniedException
  | ClientException
  | InvalidParameterException
  | ServerException
  | ServiceNotFoundException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServiceDeploymentsRequest,
  output: ListServiceDeploymentsResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    InvalidParameterException,
    ServerException,
    ServiceNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Updates an existing Express service configuration. Modifies container settings, resource
 * allocation, auto-scaling configuration, and other service parameters without recreating the
 * service.
 *
 * Amazon ECS creates a new service revision with updated configuration and performs a rolling
 * deployment to replace existing tasks. The service remains available during updates,
 * ensuring zero-downtime deployments.
 *
 * Some parameters like the infrastructure role cannot be modified after service creation
 * and require creating a new service.
 */
export const updateExpressGatewayService: (
  input: UpdateExpressGatewayServiceRequest,
) => effect.Effect<
  UpdateExpressGatewayServiceResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | ServiceNotActiveException
  | ServiceNotFoundException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateExpressGatewayServiceRequest,
  output: UpdateExpressGatewayServiceResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Creates a new Amazon ECS cluster. By default, your account receives a
 * `default` cluster when you launch your first container instance. However,
 * you can create your own cluster with a unique name.
 *
 * When you call the CreateCluster
 * API operation, Amazon ECS attempts to create the Amazon ECS service-linked role for
 * your account. This is so that it can manage required resources in other Amazon Web
 * Services services on your behalf. However, if the user that makes the
 * call doesn't have permissions to create the service-linked role, it isn't created.
 * For more information, see Using
 * service-linked roles for Amazon ECS in the Amazon Elastic
 * Container Service Developer Guide.
 */
export const createCluster: (
  input: CreateClusterRequest,
) => effect.Effect<
  CreateClusterResponse,
  | ClientException
  | InvalidParameterException
  | NamespaceNotFoundException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    NamespaceNotFoundException,
    ServerException,
  ],
}));
/**
 * Deletes an Express service and removes all associated Amazon Web Services resources. This operation
 * stops service tasks, removes the Application Load Balancer, target groups, security groups,
 * auto-scaling policies, and other managed infrastructure components.
 *
 * The service enters a `DRAINING` state where existing tasks complete current
 * requests without starting new tasks. After all tasks stop, the service and infrastructure
 * are permanently removed.
 *
 * This operation cannot be reversed. Back up important data and verify the service is no
 * longer needed before deletion.
 */
export const deleteExpressGatewayService: (
  input: DeleteExpressGatewayServiceRequest,
) => effect.Effect<
  DeleteExpressGatewayServiceResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | ServiceNotActiveException
  | ServiceNotFoundException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExpressGatewayServiceRequest,
  output: DeleteExpressGatewayServiceResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Deletes a specified service within a cluster. You can delete a service if you have no
 * running tasks in it and the desired task count is zero. If the service is actively
 * maintaining tasks, you can't delete it, and you must update the service to a desired
 * task count of zero. For more information, see UpdateService.
 *
 * When you delete a service, if there are still running tasks that require cleanup,
 * the service status moves from `ACTIVE` to `DRAINING`, and the
 * service is no longer visible in the console or in the ListServices
 * API operation. After all tasks have transitioned to either `STOPPING` or
 * `STOPPED` status, the service status moves from `DRAINING`
 * to `INACTIVE`. Services in the `DRAINING` or
 * `INACTIVE` status can still be viewed with the DescribeServices API operation. However, in the future,
 * `INACTIVE` services may be cleaned up and purged from Amazon ECS
 * record keeping, and DescribeServices calls on those services return a
 * `ServiceNotFoundException` error.
 *
 * If you attempt to create a new service with the same name as an existing service
 * in either `ACTIVE` or `DRAINING` status, you receive an
 * error.
 */
export const deleteService: (
  input: DeleteServiceRequest,
) => effect.Effect<
  DeleteServiceResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | ServiceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceRequest,
  output: DeleteServiceResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotFoundException,
  ],
}));
/**
 * Deregisters an Amazon ECS container instance from the specified cluster. This instance
 * is no longer available to run tasks.
 *
 * If you intend to use the container instance for some other purpose after
 * deregistration, we recommend that you stop all of the tasks running on the container
 * instance before deregistration. That prevents any orphaned tasks from consuming
 * resources.
 *
 * Deregistering a container instance removes the instance from a cluster, but it doesn't
 * terminate the EC2 instance. If you are finished using the instance, be sure to terminate
 * it in the Amazon EC2 console to stop billing.
 *
 * If you terminate a running container instance, Amazon ECS automatically
 * deregisters the instance from your cluster (stopped container instances or instances
 * with disconnected agents aren't automatically deregistered when terminated).
 */
export const deregisterContainerInstance: (
  input: DeregisterContainerInstanceRequest,
) => effect.Effect<
  DeregisterContainerInstanceResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterContainerInstanceRequest,
  output: DeregisterContainerInstanceResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Describes a specified task or tasks.
 *
 * Currently, stopped tasks appear in the returned results for at least one hour.
 *
 * If you have tasks with tags, and then delete the cluster, the tagged tasks are
 * returned in the response. If you create a new cluster with the same name as the deleted
 * cluster, the tagged tasks are not included in the response.
 */
export const describeTasks: (
  input: DescribeTasksRequest,
) => effect.Effect<
  DescribeTasksResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTasksRequest,
  output: DescribeTasksResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Registers a new task definition from the supplied `family` and
 * `containerDefinitions`. Optionally, you can add data volumes to your
 * containers with the `volumes` parameter. For more information about task
 * definition parameters and defaults, see Amazon ECS Task
 * Definitions in the Amazon Elastic Container Service Developer
 * Guide.
 *
 * You can specify a role for your task with the `taskRoleArn` parameter. When
 * you specify a role for a task, its containers can then use the latest versions of the
 * CLI or SDKs
 * to make API requests to the Amazon Web Services services that are specified in the policy
 * that's associated with the role. For more information, see IAM Roles for
 * Tasks in the Amazon Elastic Container Service Developer
 * Guide.
 *
 * You can specify a Docker networking mode for the containers in your task definition
 * with the `networkMode` parameter. If you specify the `awsvpc`
 * network mode, the task is allocated an elastic network interface, and you must specify a
 * NetworkConfiguration when you create a service or run a task with the task
 * definition. For more information, see Task Networking
 * in the *Amazon Elastic Container Service Developer Guide*.
 */
export const registerTaskDefinition: (
  input: RegisterTaskDefinitionRequest,
) => effect.Effect<
  RegisterTaskDefinitionResponse,
  ClientException | InvalidParameterException | ServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterTaskDefinitionRequest,
  output: RegisterTaskDefinitionResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * Stops an ongoing service deployment.
 *
 * The following stop types are avaiable:
 *
 * - ROLLBACK - This option rolls back the service deployment to the previous
 * service revision.
 *
 * You can use this option even if you didn't configure the service deployment
 * for the rollback option.
 *
 * For more information, see Stopping Amazon
 * ECS service deployments in the Amazon Elastic Container Service
 * Developer Guide.
 */
export const stopServiceDeployment: (
  input: StopServiceDeploymentRequest,
) => effect.Effect<
  StopServiceDeploymentResponse,
  | AccessDeniedException
  | ClientException
  | ConflictException
  | InvalidParameterException
  | ServerException
  | ServiceDeploymentNotFoundException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopServiceDeploymentRequest,
  output: StopServiceDeploymentResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ConflictException,
    InvalidParameterException,
    ServerException,
    ServiceDeploymentNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Modifies the available capacity providers and the default capacity provider strategy
 * for a cluster.
 *
 * You must specify both the available capacity providers and a default capacity provider
 * strategy for the cluster. If the specified cluster has existing capacity providers
 * associated with it, you must specify all existing capacity providers in addition to any
 * new ones you want to add. Any existing capacity providers that are associated with a
 * cluster that are omitted from a PutClusterCapacityProviders API call will be disassociated with the
 * cluster. You can only disassociate an existing capacity provider from a cluster if it's
 * not being used by any existing tasks.
 *
 * When creating a service or running a task on a cluster, if no capacity provider or
 * launch type is specified, then the cluster's default capacity provider strategy is used.
 * We recommend that you define a default capacity provider strategy for your cluster.
 * However, you must specify an empty array (`[]`) to bypass defining a default
 * strategy.
 *
 * Amazon ECS Managed Instances doesn't support this, because when you create a capacity
 * provider with Amazon ECS Managed Instances, it becomes available only within the
 * specified cluster.
 */
export const putClusterCapacityProviders: (
  input: PutClusterCapacityProvidersRequest,
) => effect.Effect<
  PutClusterCapacityProvidersResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ResourceInUseException
  | ServerException
  | UpdateInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutClusterCapacityProvidersRequest,
  output: PutClusterCapacityProvidersResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ResourceInUseException,
    ServerException,
    UpdateInProgressException,
  ],
}));
/**
 * Modifies which task set in a service is the primary task set. Any parameters that are
 * updated on the primary task set in a service will transition to the service. This is
 * used when a service uses the `EXTERNAL` deployment controller type. For more
 * information, see Amazon ECS Deployment
 * Types in the Amazon Elastic Container Service Developer
 * Guide.
 */
export const updateServicePrimaryTaskSet: (
  input: UpdateServicePrimaryTaskSetRequest,
) => effect.Effect<
  UpdateServicePrimaryTaskSetResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | ServiceNotActiveException
  | ServiceNotFoundException
  | TaskSetNotFoundException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServicePrimaryTaskSetRequest,
  output: UpdateServicePrimaryTaskSetResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    TaskSetNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Updates the Amazon ECS container agent on a specified container instance. Updating the
 * Amazon ECS container agent doesn't interrupt running tasks or services on the container
 * instance. The process for updating the agent differs depending on whether your container
 * instance was launched with the Amazon ECS-optimized AMI or another operating
 * system.
 *
 * The `UpdateContainerAgent` API isn't supported for container instances
 * using the Amazon ECS-optimized Amazon Linux 2 (arm64) AMI. To update the container
 * agent, you can update the `ecs-init` package. This updates the agent. For
 * more information, see Updating the
 * Amazon ECS container agent in the Amazon Elastic Container
 * Service Developer Guide.
 *
 * Agent updates with the `UpdateContainerAgent` API operation do not
 * apply to Windows container instances. We recommend that you launch new container
 * instances to update the agent version in your Windows clusters.
 *
 * The `UpdateContainerAgent` API requires an Amazon ECS-optimized AMI or
 * Amazon Linux AMI with the `ecs-init` service installed and running. For help
 * updating the Amazon ECS container agent on other operating systems, see Manually updating the Amazon ECS container agent in the Amazon
 * Elastic Container Service Developer Guide.
 */
export const updateContainerAgent: (
  input: UpdateContainerAgentRequest,
) => effect.Effect<
  UpdateContainerAgentResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | MissingVersionException
  | NoUpdateAvailableException
  | ServerException
  | UpdateInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateContainerAgentRequest,
  output: UpdateContainerAgentResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    MissingVersionException,
    NoUpdateAvailableException,
    ServerException,
    UpdateInProgressException,
  ],
}));
/**
 * Modifies a task set. This is used when a service uses the `EXTERNAL`
 * deployment controller type. For more information, see Amazon ECS Deployment
 * Types in the Amazon Elastic Container Service Developer
 * Guide.
 */
export const updateTaskSet: (
  input: UpdateTaskSetRequest,
) => effect.Effect<
  UpdateTaskSetResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | ServiceNotActiveException
  | ServiceNotFoundException
  | TaskSetNotFoundException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTaskSetRequest,
  output: UpdateTaskSetResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    TaskSetNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Deletes a specified task set within a service. This is used when a service uses the
 * `EXTERNAL` deployment controller type. For more information, see Amazon ECS deployment types in the Amazon Elastic Container
 * Service Developer Guide.
 */
export const deleteTaskSet: (
  input: DeleteTaskSetRequest,
) => effect.Effect<
  DeleteTaskSetResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | ServiceNotActiveException
  | ServiceNotFoundException
  | TaskSetNotFoundException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTaskSetRequest,
  output: DeleteTaskSetResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    TaskSetNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Creates an Express service that simplifies deploying containerized web applications on
 * Amazon ECS with managed Amazon Web Services infrastructure. This operation provisions and configures
 * Application Load Balancers, target groups, security groups, and auto-scaling policies
 * automatically.
 *
 * Specify a primary container configuration with your application image and basic
 * settings. Amazon ECS creates the necessary Amazon Web Services resources for traffic distribution, health
 * monitoring, network access control, and capacity management.
 *
 * Provide an execution role for task operations and an infrastructure role for managing
 * Amazon Web Services resources on your behalf.
 */
export const createExpressGatewayService: (
  input: CreateExpressGatewayServiceRequest,
) => effect.Effect<
  CreateExpressGatewayServiceResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | PlatformTaskDefinitionIncompatibilityException
  | PlatformUnknownException
  | ServerException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExpressGatewayServiceRequest,
  output: CreateExpressGatewayServiceResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    PlatformTaskDefinitionIncompatibilityException,
    PlatformUnknownException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Describes one or more service revisions.
 *
 * A service revision is a version of the service that includes the values for the Amazon
 * ECS resources (for example, task definition) and the environment resources (for example,
 * load balancers, subnets, and security groups). For more information, see Amazon ECS service revisions.
 *
 * You can't describe a service revision that was created before October 25, 2024.
 */
export const describeServiceRevisions: (
  input: DescribeServiceRevisionsRequest,
) => effect.Effect<
  DescribeServiceRevisionsResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | ServiceNotFoundException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeServiceRevisionsRequest,
  output: DescribeServiceRevisionsResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Starts a new task using the specified task definition.
 *
 * On March 21, 2024, a change was made to resolve the task definition revision
 * before authorization. When a task definition revision is not specified,
 * authorization will occur using the latest revision of a task definition.
 *
 * Amazon Elastic Inference (EI) is no longer available to customers.
 *
 * You can allow Amazon ECS to place tasks for you, or you can customize how Amazon ECS
 * places tasks using placement constraints and placement strategies. For more information,
 * see Scheduling Tasks in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * Alternatively, you can use `StartTask` to use your own scheduler or place
 * tasks manually on specific container instances.
 *
 * You can attach Amazon EBS volumes to Amazon ECS tasks by configuring the volume when
 * creating or updating a service. For more information, see Amazon EBS volumes in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * The Amazon ECS API follows an eventual consistency model. This is because of the
 * distributed nature of the system supporting the API. This means that the result of an
 * API command you run that affects your Amazon ECS resources might not be immediately
 * visible to all subsequent commands you run. Keep this in mind when you carry out an API
 * command that immediately follows a previous API command.
 *
 * To manage eventual consistency, you can do the following:
 *
 * - Confirm the state of the resource before you run a command to modify it. Run
 * the DescribeTasks command using an exponential backoff algorithm to ensure that
 * you allow enough time for the previous command to propagate through the system.
 * To do this, run the DescribeTasks command repeatedly, starting with a couple of
 * seconds of wait time and increasing gradually up to five minutes of wait
 * time.
 *
 * - Add wait time between subsequent commands, even if the DescribeTasks command
 * returns an accurate response. Apply an exponential backoff algorithm starting
 * with a couple of seconds of wait time, and increase gradually up to about five
 * minutes of wait time.
 *
 * If you get a `ConflictException` error, the `RunTask` request
 * could not be processed due to conflicts. The provided `clientToken` is
 * already in use with a different `RunTask` request. The
 * `resourceIds` are the existing task ARNs which are already associated
 * with the `clientToken`.
 *
 * To fix this issue:
 *
 * - Run `RunTask` with a unique `clientToken`.
 *
 * - Run `RunTask` with the `clientToken` and the original
 * set of parameters
 *
 * If you get a `ClientException`error, the `RunTask` could not be
 * processed because you use managed scaling and there is a capacity error because the
 * quota of tasks in the `PROVISIONING` per cluster has been reached. For
 * information about the service quotas, see Amazon ECS service
 * quotas.
 */
export const runTask: (
  input: RunTaskRequest,
) => effect.Effect<
  RunTaskResponse,
  | AccessDeniedException
  | BlockedException
  | ClientException
  | ClusterNotFoundException
  | ConflictException
  | InvalidParameterException
  | PlatformTaskDefinitionIncompatibilityException
  | PlatformUnknownException
  | ServerException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RunTaskRequest,
  output: RunTaskResponse,
  errors: [
    AccessDeniedException,
    BlockedException,
    ClientException,
    ClusterNotFoundException,
    ConflictException,
    InvalidParameterException,
    PlatformTaskDefinitionIncompatibilityException,
    PlatformUnknownException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Modifies the parameters of a service.
 *
 * On March 21, 2024, a change was made to resolve the task definition revision
 * before authorization. When a task definition revision is not specified,
 * authorization will occur using the latest revision of a task definition.
 *
 * For services using the rolling update (`ECS`) you can update the desired
 * count, deployment configuration, network configuration, load balancers, service
 * registries, enable ECS managed tags option, propagate tags option, task placement
 * constraints and strategies, and task definition. When you update any of these
 * parameters, Amazon ECS starts new tasks with the new configuration.
 *
 * You can attach Amazon EBS volumes to Amazon ECS tasks by configuring the volume when
 * starting or running a task, or when creating or updating a service. For more
 * information, see Amazon EBS volumes in the Amazon Elastic
 * Container Service Developer Guide. You can update your volume
 * configurations and trigger a new deployment. `volumeConfigurations` is only
 * supported for REPLICA service and not DAEMON service. If you leave
 * `volumeConfigurations`
 * `null`, it doesn't trigger a new deployment. For more information on volumes,
 * see Amazon EBS volumes in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * For services using the blue/green (`CODE_DEPLOY`) deployment controller,
 * only the desired count, deployment configuration, health check grace period, task
 * placement constraints and strategies, enable ECS managed tags option, and propagate tags
 * can be updated using this API. If the network configuration, platform version, task
 * definition, or load balancer need to be updated, create a new CodeDeploy deployment. For
 * more information, see CreateDeployment in the CodeDeploy API
 * Reference.
 *
 * For services using an external deployment controller, you can update only the desired
 * count, task placement constraints and strategies, health check grace period, enable ECS
 * managed tags option, and propagate tags option, using this API. If the launch type, load
 * balancer, network configuration, platform version, or task definition need to be
 * updated, create a new task set For more information, see CreateTaskSet.
 *
 * You can add to or subtract from the number of instantiations of a task definition in a
 * service by specifying the cluster that the service is running in and a new
 * `desiredCount` parameter.
 *
 * You can attach Amazon EBS volumes to Amazon ECS tasks by configuring the volume when
 * starting or running a task, or when creating or updating a service. For more
 * information, see Amazon EBS volumes in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * If you have updated the container image of your application, you can create a new task
 * definition with that image and deploy it to your service. The service scheduler uses the
 * minimum healthy percent and maximum percent parameters (in the service's deployment
 * configuration) to determine the deployment strategy.
 *
 * If your updated Docker image uses the same tag as what is in the existing task
 * definition for your service (for example, `my_image:latest`), you don't
 * need to create a new revision of your task definition. You can update the service
 * using the `forceNewDeployment` option. The new tasks launched by the
 * deployment pull the current image/tag combination from your repository when they
 * start.
 *
 * You can also update the deployment configuration of a service. When a deployment is
 * triggered by updating the task definition of a service, the service scheduler uses the
 * deployment configuration parameters, `minimumHealthyPercent` and
 * `maximumPercent`, to determine the deployment strategy.
 *
 * - If `minimumHealthyPercent` is below 100%, the scheduler can ignore
 * `desiredCount` temporarily during a deployment. For example, if
 * `desiredCount` is four tasks, a minimum of 50% allows the
 * scheduler to stop two existing tasks before starting two new tasks. Tasks for
 * services that don't use a load balancer are considered healthy if they're in the
 * `RUNNING` state. Tasks for services that use a load balancer are
 * considered healthy if they're in the `RUNNING` state and are reported
 * as healthy by the load balancer.
 *
 * - The `maximumPercent` parameter represents an upper limit on the
 * number of running tasks during a deployment. You can use it to define the
 * deployment batch size. For example, if `desiredCount` is four tasks,
 * a maximum of 200% starts four new tasks before stopping the four older tasks
 * (provided that the cluster resources required to do this are available).
 *
 * When UpdateService
 * stops a task during a deployment, the equivalent of `docker stop` is issued
 * to the containers running in the task. This results in a `SIGTERM` and a
 * 30-second timeout. After this, `SIGKILL` is sent and the containers are
 * forcibly stopped. If the container handles the `SIGTERM` gracefully and exits
 * within 30 seconds from receiving it, no `SIGKILL` is sent.
 *
 * When the service scheduler launches new tasks, it determines task placement in your
 * cluster with the following logic.
 *
 * - Determine which of the container instances in your cluster can support your
 * service's task definition. For example, they have the required CPU, memory,
 * ports, and container instance attributes.
 *
 * - By default, the service scheduler attempts to balance tasks across
 * Availability Zones in this manner even though you can choose a different
 * placement strategy.
 *
 * - Sort the valid container instances by the fewest number of running
 * tasks for this service in the same Availability Zone as the instance.
 * For example, if zone A has one running service task and zones B and C
 * each have zero, valid container instances in either zone B or C are
 * considered optimal for placement.
 *
 * - Place the new service task on a valid container instance in an optimal
 * Availability Zone (based on the previous steps), favoring container
 * instances with the fewest number of running tasks for this
 * service.
 *
 * When the service scheduler stops running tasks, it attempts to maintain balance across
 * the Availability Zones in your cluster using the following logic:
 *
 * - Sort the container instances by the largest number of running tasks for this
 * service in the same Availability Zone as the instance. For example, if zone A
 * has one running service task and zones B and C each have two, container
 * instances in either zone B or C are considered optimal for termination.
 *
 * - Stop the task on a container instance in an optimal Availability Zone (based
 * on the previous steps), favoring container instances with the largest number of
 * running tasks for this service.
 */
export const updateService: (
  input: UpdateServiceRequest,
) => effect.Effect<
  UpdateServiceResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | NamespaceNotFoundException
  | PlatformTaskDefinitionIncompatibilityException
  | PlatformUnknownException
  | ServerException
  | ServiceNotActiveException
  | ServiceNotFoundException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceRequest,
  output: UpdateServiceResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    NamespaceNotFoundException,
    PlatformTaskDefinitionIncompatibilityException,
    PlatformUnknownException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Create a task set in the specified cluster and service. This is used when a service
 * uses the `EXTERNAL` deployment controller type. For more information, see
 * Amazon ECS deployment
 * types in the Amazon Elastic Container Service Developer
 * Guide.
 *
 * On March 21, 2024, a change was made to resolve the task definition revision
 * before authorization. When a task definition revision is not specified,
 * authorization will occur using the latest revision of a task definition.
 *
 * For information about the maximum number of task sets and other quotas, see Amazon ECS service quotas in the Amazon Elastic Container Service
 * Developer Guide.
 */
export const createTaskSet: (
  input: CreateTaskSetRequest,
) => effect.Effect<
  CreateTaskSetResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | NamespaceNotFoundException
  | PlatformTaskDefinitionIncompatibilityException
  | PlatformUnknownException
  | ServerException
  | ServiceNotActiveException
  | ServiceNotFoundException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTaskSetRequest,
  output: CreateTaskSetResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    NamespaceNotFoundException,
    PlatformTaskDefinitionIncompatibilityException,
    PlatformUnknownException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Creates a capacity provider. Capacity providers are associated with a cluster and are
 * used in capacity provider strategies to facilitate cluster auto scaling. You can create
 * capacity providers for Amazon ECS Managed Instances and EC2 instances. Fargate has the
 * predefined `FARGATE` and `FARGATE_SPOT` capacity providers.
 */
export const createCapacityProvider: (
  input: CreateCapacityProviderRequest,
) => effect.Effect<
  CreateCapacityProviderResponse,
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | LimitExceededException
  | ServerException
  | UnsupportedFeatureException
  | UpdateInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCapacityProviderRequest,
  output: CreateCapacityProviderResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    LimitExceededException,
    ServerException,
    UnsupportedFeatureException,
    UpdateInProgressException,
  ],
}));
/**
 * Runs and maintains your desired number of tasks from a specified task definition. If
 * the number of tasks running in a service drops below the `desiredCount`,
 * Amazon ECS runs another copy of the task in the specified cluster. To update an existing
 * service, use UpdateService.
 *
 * On March 21, 2024, a change was made to resolve the task definition revision
 * before authorization. When a task definition revision is not specified,
 * authorization will occur using the latest revision of a task definition.
 *
 * Amazon Elastic Inference (EI) is no longer available to customers.
 *
 * In addition to maintaining the desired count of tasks in your service, you can
 * optionally run your service behind one or more load balancers. The load balancers
 * distribute traffic across the tasks that are associated with the service. For more
 * information, see Service load balancing in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * You can attach Amazon EBS volumes to Amazon ECS tasks by configuring the volume when
 * creating or updating a service. `volumeConfigurations` is only supported for
 * REPLICA service and not DAEMON service. For more information, see Amazon EBS volumes in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * Tasks for services that don't use a load balancer are considered healthy if they're in
 * the `RUNNING` state. Tasks for services that use a load balancer are
 * considered healthy if they're in the `RUNNING` state and are reported as
 * healthy by the load balancer.
 *
 * There are two service scheduler strategies available:
 *
 * - `REPLICA` - The replica scheduling strategy places and maintains
 * your desired number of tasks across your cluster. By default, the service
 * scheduler spreads tasks across Availability Zones. You can use task placement
 * strategies and constraints to customize task placement decisions. For more
 * information, see Service scheduler concepts in the
 * Amazon Elastic Container Service Developer
 * Guide.
 *
 * - `DAEMON` - The daemon scheduling strategy deploys exactly one task
 * on each active container instance that meets all of the task placement
 * constraints that you specify in your cluster. The service scheduler also
 * evaluates the task placement constraints for running tasks. It also stops tasks
 * that don't meet the placement constraints. When using this strategy, you don't
 * need to specify a desired number of tasks, a task placement strategy, or use
 * Service Auto Scaling policies. For more information, see Amazon ECS services in the Amazon Elastic Container
 * Service Developer Guide.
 *
 * The deployment controller is the mechanism that determines how tasks are deployed for
 * your service. The valid options are:
 *
 * - ECS
 *
 * When you create a service which uses the `ECS` deployment
 * controller, you can choose between the following deployment strategies (which
 * you can set in the “`strategy`” field in
 * “`deploymentConfiguration`”): :
 *
 * - `ROLLING`: When you create a service which uses the
 * *rolling update* (`ROLLING`)
 * deployment strategy, the Amazon ECS service scheduler replaces the
 * currently running tasks with new tasks. The number of tasks that Amazon
 * ECS adds or removes from the service during a rolling update is
 * controlled by the service deployment configuration. For more
 * information, see Deploy Amazon ECS services by replacing
 * tasks in the Amazon Elastic Container Service
 * Developer Guide.
 *
 * Rolling update deployments are best suited for the following
 * scenarios:
 *
 * - Gradual service updates: You need to update your service
 * incrementally without taking the entire service offline at
 * once.
 *
 * - Limited resource requirements: You want to avoid the
 * additional resource costs of running two complete environments
 * simultaneously (as required by blue/green deployments).
 *
 * - Acceptable deployment time: Your application can tolerate a
 * longer deployment process, as rolling updates replace tasks one
 * by one.
 *
 * - No need for instant roll back: Your service can tolerate a
 * rollback process that takes minutes rather than seconds.
 *
 * - Simple deployment process: You prefer a straightforward
 * deployment approach without the complexity of managing multiple
 * environments, target groups, and listeners.
 *
 * - No load balancer requirement: Your service doesn't use or
 * require a load balancer, Application Load Balancer, Network Load
 * Balancer, or Service Connect (which are required for blue/green
 * deployments).
 *
 * - Stateful applications: Your application maintains state that
 * makes it difficult to run two parallel environments.
 *
 * - Cost sensitivity: You want to minimize deployment costs by not
 * running duplicate environments during deployment.
 *
 * Rolling updates are the default deployment strategy for services and
 * provide a balance between deployment safety and resource efficiency for
 * many common application scenarios.
 *
 * - `BLUE_GREEN`: A *blue/green* deployment
 * strategy (`BLUE_GREEN`) is a release methodology that reduces
 * downtime and risk by running two identical production environments
 * called blue and green. With Amazon ECS blue/green deployments, you can
 * validate new service revisions before directing production traffic to
 * them. This approach provides a safer way to deploy changes with the
 * ability to quickly roll back if needed. For more information, see Amazon ECS blue/green deployments in
 * the Amazon Elastic Container Service Developer
 * Guide.
 *
 * Amazon ECS blue/green deployments are best suited for the following
 * scenarios:
 *
 * - Service validation: When you need to validate new service
 * revisions before directing production traffic to them
 *
 * - Zero downtime: When your service requires zero-downtime
 * deployments
 *
 * - Instant roll back: When you need the ability to quickly roll
 * back if issues are detected
 *
 * - Load balancer requirement: When your service uses Application
 * Load Balancer, Network Load Balancer, or Service Connect
 *
 * - `LINEAR`: A *linear* deployment strategy
 * (`LINEAR`) gradually shifts traffic from the current
 * production environment to a new environment in equal percentage
 * increments. With Amazon ECS linear deployments, you can control the pace
 * of traffic shifting and validate new service revisions with increasing
 * amounts of production traffic.
 *
 * Linear deployments are best suited for the following scenarios:
 *
 * - Gradual validation: When you want to gradually validate your
 * new service version with increasing traffic
 *
 * - Performance monitoring: When you need time to monitor metrics
 * and performance during the deployment
 *
 * - Risk minimization: When you want to minimize risk by exposing
 * the new version to production traffic incrementally
 *
 * - Load balancer requirement: When your service uses Application
 * Load Balancer or Service Connect
 *
 * - `CANARY`: A *canary* deployment strategy
 * (`CANARY`) shifts a small percentage of traffic to the
 * new service revision first, then shifts the remaining traffic all at
 * once after a specified time period. This allows you to test the new
 * version with a subset of users before full deployment.
 *
 * Canary deployments are best suited for the following scenarios:
 *
 * - Feature testing: When you want to test new features with a
 * small subset of users before full rollout
 *
 * - Production validation: When you need to validate performance
 * and functionality with real production traffic
 *
 * - Blast radius control: When you want to minimize blast radius
 * if issues are discovered in the new version
 *
 * - Load balancer requirement: When your service uses Application
 * Load Balancer or Service Connect
 *
 * - External
 *
 * Use a third-party deployment controller.
 *
 * - Blue/green deployment (powered by CodeDeploy)
 *
 * CodeDeploy installs an updated version of the application as a new
 * replacement task set and reroutes production traffic from the original
 * application task set to the replacement task set. The original task set is
 * terminated after a successful deployment. Use this deployment controller to
 * verify a new deployment of a service before sending production traffic to
 * it.
 *
 * When creating a service that uses the `EXTERNAL` deployment controller, you
 * can specify only parameters that aren't controlled at the task set level. The only
 * required parameter is the service name. You control your services using the CreateTaskSet. For more information, see Amazon ECS deployment types in the Amazon Elastic Container
 * Service Developer Guide.
 *
 * When the service scheduler launches new tasks, it determines task placement. For
 * information about task placement and task placement strategies, see Amazon ECS task placement in the Amazon Elastic Container Service
 * Developer Guide
 */
export const createService: (
  input: CreateServiceRequest,
) => effect.Effect<
  CreateServiceResponse,
  | AccessDeniedException
  | ClientException
  | ClusterNotFoundException
  | InvalidParameterException
  | NamespaceNotFoundException
  | PlatformTaskDefinitionIncompatibilityException
  | PlatformUnknownException
  | ServerException
  | UnsupportedFeatureException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceRequest,
  output: CreateServiceResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    NamespaceNotFoundException,
    PlatformTaskDefinitionIncompatibilityException,
    PlatformUnknownException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Deletes the specified cluster. The cluster transitions to the `INACTIVE`
 * state. Clusters with an `INACTIVE` status might remain discoverable in your
 * account for a period of time. However, this behavior is subject to change in the future.
 * We don't recommend that you rely on `INACTIVE` clusters persisting.
 *
 * You must deregister all container instances from this cluster before you may delete
 * it. You can list the container instances in a cluster with ListContainerInstances and deregister them with DeregisterContainerInstance.
 */
export const deleteCluster: (
  input: DeleteClusterRequest,
) => effect.Effect<
  DeleteClusterResponse,
  | ClientException
  | ClusterContainsCapacityProviderException
  | ClusterContainsContainerInstancesException
  | ClusterContainsServicesException
  | ClusterContainsTasksException
  | ClusterNotFoundException
  | InvalidParameterException
  | ServerException
  | UpdateInProgressException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [
    ClientException,
    ClusterContainsCapacityProviderException,
    ClusterContainsContainerInstancesException,
    ClusterContainsServicesException,
    ClusterContainsTasksException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    UpdateInProgressException,
  ],
}));
