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
  sdkId: "drs",
  serviceShapeName: "ElasticDisasterRecoveryService",
});
const auth = T.AwsAuthSigv4({ name: "drs" });
const ver = T.ServiceVersion("2020-02-26");
const proto = T.AwsProtocolsRestJson1();
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
              `https://drs-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://drs-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://drs.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://drs.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type SourceServerARN = string;
export type LaunchActionResourceId = string;
export type LaunchActionId = string;
export type LargeBoundedString = string;
export type AccountID = string;
export type MaxResultsReplicatingSourceServers = number;
export type PaginationToken = string;
export type MaxResultsType = number;
export type ARN = string;
export type SsmDocumentName = string;
export type LaunchActionOrder = number;
export type LaunchActionName = string;
export type LaunchActionVersion = string;
export type LaunchActionCategory = string;
export type LaunchActionDescription = string;
export type TagKey = string;
export type JobID = string;
export type StrictlyPositiveInteger = number;
export type LaunchDisposition = string;
export type TargetInstanceTypeRightSizingMethod = string;
export type LaunchConfigurationTemplateID = string;
export type RecoveryInstanceID = string;
export type BoundedString = string;
export type PositiveInteger = number;
export type SubnetID = string;
export type SecurityGroupID = string;
export type EC2InstanceType = string;
export type ReplicationConfigurationDefaultLargeStagingDiskType = string;
export type ReplicationConfigurationEbsEncryption = string;
export type ReplicationConfigurationDataPlaneRouting = string;
export type ReplicationConfigurationTemplateID = string;
export type VpcID = string;
export type AwsRegion = string;
export type SourceNetworkID = string;
export type CfnStackName = string | Redacted.Redacted<string>;
export type SourceServerID = string;
export type RecoverySnapshotsOrder = string;
export type SmallBoundedString = string;
export type TagValue = string;
export type LaunchActionParameterName = string;
export type ISO8601DatetimeString = string;
export type PITPolicyRuleUnits = string;
export type EC2InstanceID = string;
export type ReplicationConfigurationReplicatedDiskStagingDiskType = string;
export type RecoverySnapshotID = string;
export type LastLaunchResult = string;
export type ReplicationDirection = string;
export type AgentVersion = string;
export type LaunchActionParameterValue = string;
export type LaunchActionParameterType = string;
export type JobLogEvent = string;
export type JobType = string;
export type InitiatedBy = string;
export type JobStatus = string;
export type ReplicationStatus = string;
export type SensitiveBoundedString = string | Redacted.Redacted<string>;
export type ISO8601DurationString = string;
export type DataReplicationState = string;
export type AwsAvailabilityZone = string;
export type OutpostARN = string;
export type ExtensionStatus = string;
export type LaunchStatus = string;
export type RecoveryResult = string;
export type VolumeStatus = string;
export type DataReplicationErrorString = string;
export type LaunchActionType = string;
export type EC2InstanceState = string;
export type OriginEnvironment = string;
export type EbsSnapshot = string;
export type DataReplicationInitiationStepName = string;
export type DataReplicationInitiationStepStatus = string;
export type LastLaunchType = string;
export type ValidationExceptionReason = string;
export type FailbackState = string;
export type FailbackLaunchType = string;
export type RecoveryInstanceDataReplicationState = string;
export type LaunchActionRunId = string;
export type LaunchActionRunStatus = string;
export type FailureReason = string;
export type FailbackReplicationError = string;
export type EbsVolumeID = string;
export type ProductCodeId = string;
export type ProductCodeMode = string;
export type RecoveryInstanceDataReplicationInitiationStepName = string;
export type RecoveryInstanceDataReplicationInitiationStepStatus = string;

//# Schemas
export interface InitializeServiceRequest {}
export const InitializeServiceRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/InitializeService" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "InitializeServiceRequest",
}) as any as S.Schema<InitializeServiceRequest>;
export interface InitializeServiceResponse {}
export const InitializeServiceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "InitializeServiceResponse",
}) as any as S.Schema<InitializeServiceResponse>;
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type LaunchConfigurationTemplateIDs = string[];
export const LaunchConfigurationTemplateIDs = S.Array(S.String);
export type StartFailbackRequestRecoveryInstanceIDs = string[];
export const StartFailbackRequestRecoveryInstanceIDs = S.Array(S.String);
export type RecoveryInstancesForTerminationRequest = string[];
export const RecoveryInstancesForTerminationRequest = S.Array(S.String);
export type ReplicationServersSecurityGroupsIDs = string[];
export const ReplicationServersSecurityGroupsIDs = S.Array(S.String);
export type ReplicationConfigurationTemplateIDs = string[];
export const ReplicationConfigurationTemplateIDs = S.Array(S.String);
export interface DeleteLaunchActionRequest {
  resourceId: string;
  actionId: string;
}
export const DeleteLaunchActionRequest = S.suspend(() =>
  S.Struct({ resourceId: S.String, actionId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteLaunchAction" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLaunchActionRequest",
}) as any as S.Schema<DeleteLaunchActionRequest>;
export interface DeleteLaunchActionResponse {}
export const DeleteLaunchActionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLaunchActionResponse",
}) as any as S.Schema<DeleteLaunchActionResponse>;
export interface ListExtensibleSourceServersRequest {
  stagingAccountID: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListExtensibleSourceServersRequest = S.suspend(() =>
  S.Struct({
    stagingAccountID: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListExtensibleSourceServers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListExtensibleSourceServersRequest",
}) as any as S.Schema<ListExtensibleSourceServersRequest>;
export interface ListStagingAccountsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListStagingAccountsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/ListStagingAccounts" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListStagingAccountsRequest",
}) as any as S.Schema<ListStagingAccountsRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
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
export type TagsMap = { [key: string]: string };
export const TagsMap = S.Record({ key: S.String, value: S.String });
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagsMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagsMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
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
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
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
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface DeleteJobRequest {
  jobID: string;
}
export const DeleteJobRequest = S.suspend(() =>
  S.Struct({ jobID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteJob" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteJobRequest",
}) as any as S.Schema<DeleteJobRequest>;
export interface DeleteJobResponse {}
export const DeleteJobResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteJobResponse",
}) as any as S.Schema<DeleteJobResponse>;
export interface DescribeJobLogItemsRequest {
  jobID: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeJobLogItemsRequest = S.suspend(() =>
  S.Struct({
    jobID: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeJobLogItems" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobLogItemsRequest",
}) as any as S.Schema<DescribeJobLogItemsRequest>;
export interface Licensing {
  osByol?: boolean;
}
export const Licensing = S.suspend(() =>
  S.Struct({ osByol: S.optional(S.Boolean) }),
).annotations({ identifier: "Licensing" }) as any as S.Schema<Licensing>;
export interface UpdateLaunchConfigurationTemplateRequest {
  launchConfigurationTemplateID: string;
  launchDisposition?: string;
  targetInstanceTypeRightSizingMethod?: string;
  copyPrivateIp?: boolean;
  copyTags?: boolean;
  licensing?: Licensing;
  exportBucketArn?: string;
  postLaunchEnabled?: boolean;
  launchIntoSourceInstance?: boolean;
}
export const UpdateLaunchConfigurationTemplateRequest = S.suspend(() =>
  S.Struct({
    launchConfigurationTemplateID: S.String,
    launchDisposition: S.optional(S.String),
    targetInstanceTypeRightSizingMethod: S.optional(S.String),
    copyPrivateIp: S.optional(S.Boolean),
    copyTags: S.optional(S.Boolean),
    licensing: S.optional(Licensing),
    exportBucketArn: S.optional(S.String),
    postLaunchEnabled: S.optional(S.Boolean),
    launchIntoSourceInstance: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateLaunchConfigurationTemplate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLaunchConfigurationTemplateRequest",
}) as any as S.Schema<UpdateLaunchConfigurationTemplateRequest>;
export interface DeleteLaunchConfigurationTemplateRequest {
  launchConfigurationTemplateID: string;
}
export const DeleteLaunchConfigurationTemplateRequest = S.suspend(() =>
  S.Struct({ launchConfigurationTemplateID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteLaunchConfigurationTemplate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteLaunchConfigurationTemplateRequest",
}) as any as S.Schema<DeleteLaunchConfigurationTemplateRequest>;
export interface DeleteLaunchConfigurationTemplateResponse {}
export const DeleteLaunchConfigurationTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteLaunchConfigurationTemplateResponse",
}) as any as S.Schema<DeleteLaunchConfigurationTemplateResponse>;
export interface DescribeLaunchConfigurationTemplatesRequest {
  launchConfigurationTemplateIDs?: LaunchConfigurationTemplateIDs;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeLaunchConfigurationTemplatesRequest = S.suspend(() =>
  S.Struct({
    launchConfigurationTemplateIDs: S.optional(LaunchConfigurationTemplateIDs),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeLaunchConfigurationTemplates" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLaunchConfigurationTemplatesRequest",
}) as any as S.Schema<DescribeLaunchConfigurationTemplatesRequest>;
export interface DeleteRecoveryInstanceRequest {
  recoveryInstanceID: string;
}
export const DeleteRecoveryInstanceRequest = S.suspend(() =>
  S.Struct({ recoveryInstanceID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteRecoveryInstance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRecoveryInstanceRequest",
}) as any as S.Schema<DeleteRecoveryInstanceRequest>;
export interface DeleteRecoveryInstanceResponse {}
export const DeleteRecoveryInstanceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRecoveryInstanceResponse",
}) as any as S.Schema<DeleteRecoveryInstanceResponse>;
export interface DisconnectRecoveryInstanceRequest {
  recoveryInstanceID: string;
}
export const DisconnectRecoveryInstanceRequest = S.suspend(() =>
  S.Struct({ recoveryInstanceID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DisconnectRecoveryInstance" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisconnectRecoveryInstanceRequest",
}) as any as S.Schema<DisconnectRecoveryInstanceRequest>;
export interface DisconnectRecoveryInstanceResponse {}
export const DisconnectRecoveryInstanceResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DisconnectRecoveryInstanceResponse",
}) as any as S.Schema<DisconnectRecoveryInstanceResponse>;
export interface GetFailbackReplicationConfigurationRequest {
  recoveryInstanceID: string;
}
export const GetFailbackReplicationConfigurationRequest = S.suspend(() =>
  S.Struct({ recoveryInstanceID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetFailbackReplicationConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetFailbackReplicationConfigurationRequest",
}) as any as S.Schema<GetFailbackReplicationConfigurationRequest>;
export interface ReverseReplicationRequest {
  recoveryInstanceID: string;
}
export const ReverseReplicationRequest = S.suspend(() =>
  S.Struct({ recoveryInstanceID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ReverseReplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ReverseReplicationRequest",
}) as any as S.Schema<ReverseReplicationRequest>;
export interface StopFailbackRequest {
  recoveryInstanceID: string;
}
export const StopFailbackRequest = S.suspend(() =>
  S.Struct({ recoveryInstanceID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StopFailback" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopFailbackRequest",
}) as any as S.Schema<StopFailbackRequest>;
export interface StopFailbackResponse {}
export const StopFailbackResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopFailbackResponse",
}) as any as S.Schema<StopFailbackResponse>;
export interface UpdateFailbackReplicationConfigurationRequest {
  recoveryInstanceID: string;
  name?: string;
  bandwidthThrottling?: number;
  usePrivateIP?: boolean;
}
export const UpdateFailbackReplicationConfigurationRequest = S.suspend(() =>
  S.Struct({
    recoveryInstanceID: S.String,
    name: S.optional(S.String),
    bandwidthThrottling: S.optional(S.Number),
    usePrivateIP: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/UpdateFailbackReplicationConfiguration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFailbackReplicationConfigurationRequest",
}) as any as S.Schema<UpdateFailbackReplicationConfigurationRequest>;
export interface UpdateFailbackReplicationConfigurationResponse {}
export const UpdateFailbackReplicationConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateFailbackReplicationConfigurationResponse",
}) as any as S.Schema<UpdateFailbackReplicationConfigurationResponse>;
export interface StartFailbackLaunchRequest {
  recoveryInstanceIDs: StartFailbackRequestRecoveryInstanceIDs;
  tags?: TagsMap;
}
export const StartFailbackLaunchRequest = S.suspend(() =>
  S.Struct({
    recoveryInstanceIDs: StartFailbackRequestRecoveryInstanceIDs,
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartFailbackLaunch" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartFailbackLaunchRequest",
}) as any as S.Schema<StartFailbackLaunchRequest>;
export interface TerminateRecoveryInstancesRequest {
  recoveryInstanceIDs: RecoveryInstancesForTerminationRequest;
}
export const TerminateRecoveryInstancesRequest = S.suspend(() =>
  S.Struct({
    recoveryInstanceIDs: RecoveryInstancesForTerminationRequest,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TerminateRecoveryInstances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TerminateRecoveryInstancesRequest",
}) as any as S.Schema<TerminateRecoveryInstancesRequest>;
export interface PITPolicyRule {
  ruleID?: number;
  units: string;
  interval: number;
  retentionDuration: number;
  enabled?: boolean;
}
export const PITPolicyRule = S.suspend(() =>
  S.Struct({
    ruleID: S.optional(S.Number),
    units: S.String,
    interval: S.Number,
    retentionDuration: S.Number,
    enabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "PITPolicyRule",
}) as any as S.Schema<PITPolicyRule>;
export type PITPolicy = PITPolicyRule[];
export const PITPolicy = S.Array(PITPolicyRule);
export interface UpdateReplicationConfigurationTemplateRequest {
  replicationConfigurationTemplateID: string;
  arn?: string;
  stagingAreaSubnetId?: string;
  associateDefaultSecurityGroup?: boolean;
  replicationServersSecurityGroupsIDs?: ReplicationServersSecurityGroupsIDs;
  replicationServerInstanceType?: string;
  useDedicatedReplicationServer?: boolean;
  defaultLargeStagingDiskType?: string;
  ebsEncryption?: string;
  ebsEncryptionKeyArn?: string;
  bandwidthThrottling?: number;
  dataPlaneRouting?: string;
  createPublicIP?: boolean;
  stagingAreaTags?: TagsMap;
  pitPolicy?: PITPolicy;
  autoReplicateNewDisks?: boolean;
}
export const UpdateReplicationConfigurationTemplateRequest = S.suspend(() =>
  S.Struct({
    replicationConfigurationTemplateID: S.String,
    arn: S.optional(S.String),
    stagingAreaSubnetId: S.optional(S.String),
    associateDefaultSecurityGroup: S.optional(S.Boolean),
    replicationServersSecurityGroupsIDs: S.optional(
      ReplicationServersSecurityGroupsIDs,
    ),
    replicationServerInstanceType: S.optional(S.String),
    useDedicatedReplicationServer: S.optional(S.Boolean),
    defaultLargeStagingDiskType: S.optional(S.String),
    ebsEncryption: S.optional(S.String),
    ebsEncryptionKeyArn: S.optional(S.String),
    bandwidthThrottling: S.optional(S.Number),
    dataPlaneRouting: S.optional(S.String),
    createPublicIP: S.optional(S.Boolean),
    stagingAreaTags: S.optional(TagsMap),
    pitPolicy: S.optional(PITPolicy),
    autoReplicateNewDisks: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/UpdateReplicationConfigurationTemplate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateReplicationConfigurationTemplateRequest",
}) as any as S.Schema<UpdateReplicationConfigurationTemplateRequest>;
export interface DeleteReplicationConfigurationTemplateRequest {
  replicationConfigurationTemplateID: string;
}
export const DeleteReplicationConfigurationTemplateRequest = S.suspend(() =>
  S.Struct({ replicationConfigurationTemplateID: S.String }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/DeleteReplicationConfigurationTemplate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteReplicationConfigurationTemplateRequest",
}) as any as S.Schema<DeleteReplicationConfigurationTemplateRequest>;
export interface DeleteReplicationConfigurationTemplateResponse {}
export const DeleteReplicationConfigurationTemplateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteReplicationConfigurationTemplateResponse",
}) as any as S.Schema<DeleteReplicationConfigurationTemplateResponse>;
export interface DescribeReplicationConfigurationTemplatesRequest {
  replicationConfigurationTemplateIDs?: ReplicationConfigurationTemplateIDs;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeReplicationConfigurationTemplatesRequest = S.suspend(() =>
  S.Struct({
    replicationConfigurationTemplateIDs: S.optional(
      ReplicationConfigurationTemplateIDs,
    ),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/DescribeReplicationConfigurationTemplates",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReplicationConfigurationTemplatesRequest",
}) as any as S.Schema<DescribeReplicationConfigurationTemplatesRequest>;
export interface CreateSourceNetworkRequest {
  vpcID: string;
  originAccountID: string;
  originRegion: string;
  tags?: TagsMap;
}
export const CreateSourceNetworkRequest = S.suspend(() =>
  S.Struct({
    vpcID: S.String,
    originAccountID: S.String,
    originRegion: S.String,
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateSourceNetwork" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSourceNetworkRequest",
}) as any as S.Schema<CreateSourceNetworkRequest>;
export interface DeleteSourceNetworkRequest {
  sourceNetworkID: string;
}
export const DeleteSourceNetworkRequest = S.suspend(() =>
  S.Struct({ sourceNetworkID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteSourceNetwork" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSourceNetworkRequest",
}) as any as S.Schema<DeleteSourceNetworkRequest>;
export interface DeleteSourceNetworkResponse {}
export const DeleteSourceNetworkResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSourceNetworkResponse",
}) as any as S.Schema<DeleteSourceNetworkResponse>;
export interface AssociateSourceNetworkStackRequest {
  sourceNetworkID: string;
  cfnStackName: string | Redacted.Redacted<string>;
}
export const AssociateSourceNetworkStackRequest = S.suspend(() =>
  S.Struct({ sourceNetworkID: S.String, cfnStackName: SensitiveString }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/AssociateSourceNetworkStack" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AssociateSourceNetworkStackRequest",
}) as any as S.Schema<AssociateSourceNetworkStackRequest>;
export interface ExportSourceNetworkCfnTemplateRequest {
  sourceNetworkID: string;
}
export const ExportSourceNetworkCfnTemplateRequest = S.suspend(() =>
  S.Struct({ sourceNetworkID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ExportSourceNetworkCfnTemplate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExportSourceNetworkCfnTemplateRequest",
}) as any as S.Schema<ExportSourceNetworkCfnTemplateRequest>;
export interface StartSourceNetworkReplicationRequest {
  sourceNetworkID: string;
}
export const StartSourceNetworkReplicationRequest = S.suspend(() =>
  S.Struct({ sourceNetworkID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartSourceNetworkReplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartSourceNetworkReplicationRequest",
}) as any as S.Schema<StartSourceNetworkReplicationRequest>;
export interface StopSourceNetworkReplicationRequest {
  sourceNetworkID: string;
}
export const StopSourceNetworkReplicationRequest = S.suspend(() =>
  S.Struct({ sourceNetworkID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StopSourceNetworkReplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopSourceNetworkReplicationRequest",
}) as any as S.Schema<StopSourceNetworkReplicationRequest>;
export interface DeleteSourceServerRequest {
  sourceServerID: string;
}
export const DeleteSourceServerRequest = S.suspend(() =>
  S.Struct({ sourceServerID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DeleteSourceServer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSourceServerRequest",
}) as any as S.Schema<DeleteSourceServerRequest>;
export interface DeleteSourceServerResponse {}
export const DeleteSourceServerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSourceServerResponse",
}) as any as S.Schema<DeleteSourceServerResponse>;
export interface DisconnectSourceServerRequest {
  sourceServerID: string;
}
export const DisconnectSourceServerRequest = S.suspend(() =>
  S.Struct({ sourceServerID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DisconnectSourceServer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisconnectSourceServerRequest",
}) as any as S.Schema<DisconnectSourceServerRequest>;
export interface GetLaunchConfigurationRequest {
  sourceServerID: string;
}
export const GetLaunchConfigurationRequest = S.suspend(() =>
  S.Struct({ sourceServerID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetLaunchConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLaunchConfigurationRequest",
}) as any as S.Schema<GetLaunchConfigurationRequest>;
export interface GetReplicationConfigurationRequest {
  sourceServerID: string;
}
export const GetReplicationConfigurationRequest = S.suspend(() =>
  S.Struct({ sourceServerID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetReplicationConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReplicationConfigurationRequest",
}) as any as S.Schema<GetReplicationConfigurationRequest>;
export interface RetryDataReplicationRequest {
  sourceServerID: string;
}
export const RetryDataReplicationRequest = S.suspend(() =>
  S.Struct({ sourceServerID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/RetryDataReplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RetryDataReplicationRequest",
}) as any as S.Schema<RetryDataReplicationRequest>;
export interface StartReplicationRequest {
  sourceServerID: string;
}
export const StartReplicationRequest = S.suspend(() =>
  S.Struct({ sourceServerID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartReplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartReplicationRequest",
}) as any as S.Schema<StartReplicationRequest>;
export interface StopReplicationRequest {
  sourceServerID: string;
}
export const StopReplicationRequest = S.suspend(() =>
  S.Struct({ sourceServerID: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StopReplication" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopReplicationRequest",
}) as any as S.Schema<StopReplicationRequest>;
export type LaunchActionIds = string[];
export const LaunchActionIds = S.Array(S.String);
export type DescribeJobsRequestFiltersJobIDs = string[];
export const DescribeJobsRequestFiltersJobIDs = S.Array(S.String);
export type RecoveryInstanceIDs = string[];
export const RecoveryInstanceIDs = S.Array(S.String);
export type SourceServerIDs = string[];
export const SourceServerIDs = S.Array(S.String);
export type DescribeSourceNetworksRequestFiltersIDs = string[];
export const DescribeSourceNetworksRequestFiltersIDs = S.Array(S.String);
export type DescribeSourceServersRequestFiltersIDs = string[];
export const DescribeSourceServersRequestFiltersIDs = S.Array(S.String);
export type AccountIDs = string[];
export const AccountIDs = S.Array(S.String);
export interface LaunchActionsRequestFilters {
  actionIds?: LaunchActionIds;
}
export const LaunchActionsRequestFilters = S.suspend(() =>
  S.Struct({ actionIds: S.optional(LaunchActionIds) }),
).annotations({
  identifier: "LaunchActionsRequestFilters",
}) as any as S.Schema<LaunchActionsRequestFilters>;
export interface DescribeJobsRequestFilters {
  jobIDs?: DescribeJobsRequestFiltersJobIDs;
  fromDate?: string;
  toDate?: string;
}
export const DescribeJobsRequestFilters = S.suspend(() =>
  S.Struct({
    jobIDs: S.optional(DescribeJobsRequestFiltersJobIDs),
    fromDate: S.optional(S.String),
    toDate: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeJobsRequestFilters",
}) as any as S.Schema<DescribeJobsRequestFilters>;
export interface LaunchConfigurationTemplate {
  launchConfigurationTemplateID?: string;
  arn?: string;
  tags?: TagsMap;
  launchDisposition?: string;
  targetInstanceTypeRightSizingMethod?: string;
  copyPrivateIp?: boolean;
  copyTags?: boolean;
  licensing?: Licensing;
  exportBucketArn?: string;
  postLaunchEnabled?: boolean;
  launchIntoSourceInstance?: boolean;
}
export const LaunchConfigurationTemplate = S.suspend(() =>
  S.Struct({
    launchConfigurationTemplateID: S.optional(S.String),
    arn: S.optional(S.String),
    tags: S.optional(TagsMap),
    launchDisposition: S.optional(S.String),
    targetInstanceTypeRightSizingMethod: S.optional(S.String),
    copyPrivateIp: S.optional(S.Boolean),
    copyTags: S.optional(S.Boolean),
    licensing: S.optional(Licensing),
    exportBucketArn: S.optional(S.String),
    postLaunchEnabled: S.optional(S.Boolean),
    launchIntoSourceInstance: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LaunchConfigurationTemplate",
}) as any as S.Schema<LaunchConfigurationTemplate>;
export type LaunchConfigurationTemplates = LaunchConfigurationTemplate[];
export const LaunchConfigurationTemplates = S.Array(
  LaunchConfigurationTemplate,
);
export interface DescribeRecoveryInstancesRequestFilters {
  recoveryInstanceIDs?: RecoveryInstanceIDs;
  sourceServerIDs?: SourceServerIDs;
}
export const DescribeRecoveryInstancesRequestFilters = S.suspend(() =>
  S.Struct({
    recoveryInstanceIDs: S.optional(RecoveryInstanceIDs),
    sourceServerIDs: S.optional(SourceServerIDs),
  }),
).annotations({
  identifier: "DescribeRecoveryInstancesRequestFilters",
}) as any as S.Schema<DescribeRecoveryInstancesRequestFilters>;
export interface ReplicationConfigurationTemplate {
  replicationConfigurationTemplateID: string;
  arn?: string;
  stagingAreaSubnetId?: string;
  associateDefaultSecurityGroup?: boolean;
  replicationServersSecurityGroupsIDs?: ReplicationServersSecurityGroupsIDs;
  replicationServerInstanceType?: string;
  useDedicatedReplicationServer?: boolean;
  defaultLargeStagingDiskType?: string;
  ebsEncryption?: string;
  ebsEncryptionKeyArn?: string;
  bandwidthThrottling?: number;
  dataPlaneRouting?: string;
  createPublicIP?: boolean;
  stagingAreaTags?: TagsMap;
  tags?: TagsMap;
  pitPolicy?: PITPolicy;
  autoReplicateNewDisks?: boolean;
}
export const ReplicationConfigurationTemplate = S.suspend(() =>
  S.Struct({
    replicationConfigurationTemplateID: S.String,
    arn: S.optional(S.String),
    stagingAreaSubnetId: S.optional(S.String),
    associateDefaultSecurityGroup: S.optional(S.Boolean),
    replicationServersSecurityGroupsIDs: S.optional(
      ReplicationServersSecurityGroupsIDs,
    ),
    replicationServerInstanceType: S.optional(S.String),
    useDedicatedReplicationServer: S.optional(S.Boolean),
    defaultLargeStagingDiskType: S.optional(S.String),
    ebsEncryption: S.optional(S.String),
    ebsEncryptionKeyArn: S.optional(S.String),
    bandwidthThrottling: S.optional(S.Number),
    dataPlaneRouting: S.optional(S.String),
    createPublicIP: S.optional(S.Boolean),
    stagingAreaTags: S.optional(TagsMap),
    tags: S.optional(TagsMap),
    pitPolicy: S.optional(PITPolicy),
    autoReplicateNewDisks: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ReplicationConfigurationTemplate",
}) as any as S.Schema<ReplicationConfigurationTemplate>;
export type ReplicationConfigurationTemplates =
  ReplicationConfigurationTemplate[];
export const ReplicationConfigurationTemplates = S.Array(
  ReplicationConfigurationTemplate,
);
export interface DescribeSourceNetworksRequestFilters {
  sourceNetworkIDs?: DescribeSourceNetworksRequestFiltersIDs;
  originAccountID?: string;
  originRegion?: string;
}
export const DescribeSourceNetworksRequestFilters = S.suspend(() =>
  S.Struct({
    sourceNetworkIDs: S.optional(DescribeSourceNetworksRequestFiltersIDs),
    originAccountID: S.optional(S.String),
    originRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSourceNetworksRequestFilters",
}) as any as S.Schema<DescribeSourceNetworksRequestFilters>;
export interface StartSourceNetworkRecoveryRequestNetworkEntry {
  sourceNetworkID: string;
  cfnStackName?: string | Redacted.Redacted<string>;
}
export const StartSourceNetworkRecoveryRequestNetworkEntry = S.suspend(() =>
  S.Struct({
    sourceNetworkID: S.String,
    cfnStackName: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "StartSourceNetworkRecoveryRequestNetworkEntry",
}) as any as S.Schema<StartSourceNetworkRecoveryRequestNetworkEntry>;
export type StartSourceNetworkRecoveryRequestNetworkEntries =
  StartSourceNetworkRecoveryRequestNetworkEntry[];
export const StartSourceNetworkRecoveryRequestNetworkEntries = S.Array(
  StartSourceNetworkRecoveryRequestNetworkEntry,
);
export interface DescribeSourceServersRequestFilters {
  sourceServerIDs?: DescribeSourceServersRequestFiltersIDs;
  hardwareId?: string;
  stagingAccountIDs?: AccountIDs;
}
export const DescribeSourceServersRequestFilters = S.suspend(() =>
  S.Struct({
    sourceServerIDs: S.optional(DescribeSourceServersRequestFiltersIDs),
    hardwareId: S.optional(S.String),
    stagingAccountIDs: S.optional(AccountIDs),
  }),
).annotations({
  identifier: "DescribeSourceServersRequestFilters",
}) as any as S.Schema<DescribeSourceServersRequestFilters>;
export interface DescribeRecoverySnapshotsRequestFilters {
  fromDateTime?: string;
  toDateTime?: string;
}
export const DescribeRecoverySnapshotsRequestFilters = S.suspend(() =>
  S.Struct({
    fromDateTime: S.optional(S.String),
    toDateTime: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRecoverySnapshotsRequestFilters",
}) as any as S.Schema<DescribeRecoverySnapshotsRequestFilters>;
export interface LaunchIntoInstanceProperties {
  launchIntoEC2InstanceID?: string;
}
export const LaunchIntoInstanceProperties = S.suspend(() =>
  S.Struct({ launchIntoEC2InstanceID: S.optional(S.String) }),
).annotations({
  identifier: "LaunchIntoInstanceProperties",
}) as any as S.Schema<LaunchIntoInstanceProperties>;
export interface ReplicationConfigurationReplicatedDisk {
  deviceName?: string;
  isBootDisk?: boolean;
  stagingDiskType?: string;
  iops?: number;
  throughput?: number;
  optimizedStagingDiskType?: string;
}
export const ReplicationConfigurationReplicatedDisk = S.suspend(() =>
  S.Struct({
    deviceName: S.optional(S.String),
    isBootDisk: S.optional(S.Boolean),
    stagingDiskType: S.optional(S.String),
    iops: S.optional(S.Number),
    throughput: S.optional(S.Number),
    optimizedStagingDiskType: S.optional(S.String),
  }),
).annotations({
  identifier: "ReplicationConfigurationReplicatedDisk",
}) as any as S.Schema<ReplicationConfigurationReplicatedDisk>;
export type ReplicationConfigurationReplicatedDisks =
  ReplicationConfigurationReplicatedDisk[];
export const ReplicationConfigurationReplicatedDisks = S.Array(
  ReplicationConfigurationReplicatedDisk,
);
export interface StartRecoveryRequestSourceServer {
  sourceServerID: string;
  recoverySnapshotID?: string;
}
export const StartRecoveryRequestSourceServer = S.suspend(() =>
  S.Struct({
    sourceServerID: S.String,
    recoverySnapshotID: S.optional(S.String),
  }),
).annotations({
  identifier: "StartRecoveryRequestSourceServer",
}) as any as S.Schema<StartRecoveryRequestSourceServer>;
export type StartRecoveryRequestSourceServers =
  StartRecoveryRequestSourceServer[];
export const StartRecoveryRequestSourceServers = S.Array(
  StartRecoveryRequestSourceServer,
);
export interface CreateExtendedSourceServerRequest {
  sourceServerArn: string;
  tags?: TagsMap;
}
export const CreateExtendedSourceServerRequest = S.suspend(() =>
  S.Struct({ sourceServerArn: S.String, tags: S.optional(TagsMap) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateExtendedSourceServer" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateExtendedSourceServerRequest",
}) as any as S.Schema<CreateExtendedSourceServerRequest>;
export interface ListLaunchActionsRequest {
  resourceId: string;
  filters?: LaunchActionsRequestFilters;
  maxResults?: number;
  nextToken?: string;
}
export const ListLaunchActionsRequest = S.suspend(() =>
  S.Struct({
    resourceId: S.String,
    filters: S.optional(LaunchActionsRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListLaunchActions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListLaunchActionsRequest",
}) as any as S.Schema<ListLaunchActionsRequest>;
export interface ListTagsForResourceResponse {
  tags?: TagsMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagsMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface DescribeJobsRequest {
  filters?: DescribeJobsRequestFilters;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeJobsRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(DescribeJobsRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeJobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeJobsRequest",
}) as any as S.Schema<DescribeJobsRequest>;
export interface CreateLaunchConfigurationTemplateRequest {
  tags?: TagsMap;
  launchDisposition?: string;
  targetInstanceTypeRightSizingMethod?: string;
  copyPrivateIp?: boolean;
  copyTags?: boolean;
  licensing?: Licensing;
  exportBucketArn?: string;
  postLaunchEnabled?: boolean;
  launchIntoSourceInstance?: boolean;
}
export const CreateLaunchConfigurationTemplateRequest = S.suspend(() =>
  S.Struct({
    tags: S.optional(TagsMap),
    launchDisposition: S.optional(S.String),
    targetInstanceTypeRightSizingMethod: S.optional(S.String),
    copyPrivateIp: S.optional(S.Boolean),
    copyTags: S.optional(S.Boolean),
    licensing: S.optional(Licensing),
    exportBucketArn: S.optional(S.String),
    postLaunchEnabled: S.optional(S.Boolean),
    launchIntoSourceInstance: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CreateLaunchConfigurationTemplate" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateLaunchConfigurationTemplateRequest",
}) as any as S.Schema<CreateLaunchConfigurationTemplateRequest>;
export interface DescribeLaunchConfigurationTemplatesResponse {
  items?: LaunchConfigurationTemplates;
  nextToken?: string;
}
export const DescribeLaunchConfigurationTemplatesResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(LaunchConfigurationTemplates),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeLaunchConfigurationTemplatesResponse",
}) as any as S.Schema<DescribeLaunchConfigurationTemplatesResponse>;
export interface DescribeRecoveryInstancesRequest {
  filters?: DescribeRecoveryInstancesRequestFilters;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeRecoveryInstancesRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(DescribeRecoveryInstancesRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeRecoveryInstances" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRecoveryInstancesRequest",
}) as any as S.Schema<DescribeRecoveryInstancesRequest>;
export interface GetFailbackReplicationConfigurationResponse {
  recoveryInstanceID: string;
  name?: string;
  bandwidthThrottling?: number;
  usePrivateIP?: boolean;
}
export const GetFailbackReplicationConfigurationResponse = S.suspend(() =>
  S.Struct({
    recoveryInstanceID: S.String,
    name: S.optional(S.String),
    bandwidthThrottling: S.optional(S.Number),
    usePrivateIP: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetFailbackReplicationConfigurationResponse",
}) as any as S.Schema<GetFailbackReplicationConfigurationResponse>;
export interface ReverseReplicationResponse {
  reversedDirectionSourceServerArn?: string;
}
export const ReverseReplicationResponse = S.suspend(() =>
  S.Struct({ reversedDirectionSourceServerArn: S.optional(S.String) }),
).annotations({
  identifier: "ReverseReplicationResponse",
}) as any as S.Schema<ReverseReplicationResponse>;
export interface LaunchActionParameter {
  value?: string;
  type?: string;
}
export const LaunchActionParameter = S.suspend(() =>
  S.Struct({ value: S.optional(S.String), type: S.optional(S.String) }),
).annotations({
  identifier: "LaunchActionParameter",
}) as any as S.Schema<LaunchActionParameter>;
export type LaunchActionParameters = { [key: string]: LaunchActionParameter };
export const LaunchActionParameters = S.Record({
  key: S.String,
  value: LaunchActionParameter,
});
export interface LaunchAction {
  actionId?: string;
  actionCode?: string;
  type?: string;
  name?: string;
  active?: boolean;
  order?: number;
  actionVersion?: string;
  optional?: boolean;
  parameters?: LaunchActionParameters;
  description?: string;
  category?: string;
}
export const LaunchAction = S.suspend(() =>
  S.Struct({
    actionId: S.optional(S.String),
    actionCode: S.optional(S.String),
    type: S.optional(S.String),
    name: S.optional(S.String),
    active: S.optional(S.Boolean),
    order: S.optional(S.Number),
    actionVersion: S.optional(S.String),
    optional: S.optional(S.Boolean),
    parameters: S.optional(LaunchActionParameters),
    description: S.optional(S.String),
    category: S.optional(S.String),
  }),
).annotations({ identifier: "LaunchAction" }) as any as S.Schema<LaunchAction>;
export interface LaunchActionRun {
  action?: LaunchAction;
  runId?: string;
  status?: string;
  failureReason?: string;
}
export const LaunchActionRun = S.suspend(() =>
  S.Struct({
    action: S.optional(LaunchAction),
    runId: S.optional(S.String),
    status: S.optional(S.String),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "LaunchActionRun",
}) as any as S.Schema<LaunchActionRun>;
export type LaunchActionRuns = LaunchActionRun[];
export const LaunchActionRuns = S.Array(LaunchActionRun);
export interface LaunchActionsStatus {
  ssmAgentDiscoveryDatetime?: string;
  runs?: LaunchActionRuns;
}
export const LaunchActionsStatus = S.suspend(() =>
  S.Struct({
    ssmAgentDiscoveryDatetime: S.optional(S.String),
    runs: S.optional(LaunchActionRuns),
  }),
).annotations({
  identifier: "LaunchActionsStatus",
}) as any as S.Schema<LaunchActionsStatus>;
export interface ParticipatingServer {
  sourceServerID?: string;
  recoveryInstanceID?: string;
  launchStatus?: string;
  launchActionsStatus?: LaunchActionsStatus;
}
export const ParticipatingServer = S.suspend(() =>
  S.Struct({
    sourceServerID: S.optional(S.String),
    recoveryInstanceID: S.optional(S.String),
    launchStatus: S.optional(S.String),
    launchActionsStatus: S.optional(LaunchActionsStatus),
  }),
).annotations({
  identifier: "ParticipatingServer",
}) as any as S.Schema<ParticipatingServer>;
export type ParticipatingServers = ParticipatingServer[];
export const ParticipatingServers = S.Array(ParticipatingServer);
export type ParticipatingResourceID = { sourceNetworkID: string };
export const ParticipatingResourceID = S.Union(
  S.Struct({ sourceNetworkID: S.String }),
);
export interface ParticipatingResource {
  participatingResourceID?: (typeof ParticipatingResourceID)["Type"];
  launchStatus?: string;
}
export const ParticipatingResource = S.suspend(() =>
  S.Struct({
    participatingResourceID: S.optional(ParticipatingResourceID),
    launchStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "ParticipatingResource",
}) as any as S.Schema<ParticipatingResource>;
export type ParticipatingResources = ParticipatingResource[];
export const ParticipatingResources = S.Array(ParticipatingResource);
export interface Job {
  jobID: string;
  arn?: string;
  type?: string;
  initiatedBy?: string;
  creationDateTime?: string;
  endDateTime?: string;
  status?: string;
  participatingServers?: ParticipatingServers;
  tags?: TagsMap;
  participatingResources?: ParticipatingResources;
}
export const Job = S.suspend(() =>
  S.Struct({
    jobID: S.String,
    arn: S.optional(S.String),
    type: S.optional(S.String),
    initiatedBy: S.optional(S.String),
    creationDateTime: S.optional(S.String),
    endDateTime: S.optional(S.String),
    status: S.optional(S.String),
    participatingServers: S.optional(ParticipatingServers),
    tags: S.optional(TagsMap),
    participatingResources: S.optional(ParticipatingResources),
  }),
).annotations({ identifier: "Job" }) as any as S.Schema<Job>;
export interface TerminateRecoveryInstancesResponse {
  job?: Job;
}
export const TerminateRecoveryInstancesResponse = S.suspend(() =>
  S.Struct({ job: S.optional(Job) }),
).annotations({
  identifier: "TerminateRecoveryInstancesResponse",
}) as any as S.Schema<TerminateRecoveryInstancesResponse>;
export interface CreateReplicationConfigurationTemplateRequest {
  stagingAreaSubnetId: string;
  associateDefaultSecurityGroup: boolean;
  replicationServersSecurityGroupsIDs: ReplicationServersSecurityGroupsIDs;
  replicationServerInstanceType: string;
  useDedicatedReplicationServer: boolean;
  defaultLargeStagingDiskType: string;
  ebsEncryption: string;
  ebsEncryptionKeyArn?: string;
  bandwidthThrottling: number;
  dataPlaneRouting: string;
  createPublicIP: boolean;
  stagingAreaTags: TagsMap;
  pitPolicy: PITPolicy;
  tags?: TagsMap;
  autoReplicateNewDisks?: boolean;
}
export const CreateReplicationConfigurationTemplateRequest = S.suspend(() =>
  S.Struct({
    stagingAreaSubnetId: S.String,
    associateDefaultSecurityGroup: S.Boolean,
    replicationServersSecurityGroupsIDs: ReplicationServersSecurityGroupsIDs,
    replicationServerInstanceType: S.String,
    useDedicatedReplicationServer: S.Boolean,
    defaultLargeStagingDiskType: S.String,
    ebsEncryption: S.String,
    ebsEncryptionKeyArn: S.optional(S.String),
    bandwidthThrottling: S.Number,
    dataPlaneRouting: S.String,
    createPublicIP: S.Boolean,
    stagingAreaTags: TagsMap,
    pitPolicy: PITPolicy,
    tags: S.optional(TagsMap),
    autoReplicateNewDisks: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/CreateReplicationConfigurationTemplate",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateReplicationConfigurationTemplateRequest",
}) as any as S.Schema<CreateReplicationConfigurationTemplateRequest>;
export interface DescribeReplicationConfigurationTemplatesResponse {
  items?: ReplicationConfigurationTemplates;
  nextToken?: string;
}
export const DescribeReplicationConfigurationTemplatesResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(ReplicationConfigurationTemplates),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeReplicationConfigurationTemplatesResponse",
}) as any as S.Schema<DescribeReplicationConfigurationTemplatesResponse>;
export interface CreateSourceNetworkResponse {
  sourceNetworkID?: string;
}
export const CreateSourceNetworkResponse = S.suspend(() =>
  S.Struct({ sourceNetworkID: S.optional(S.String) }),
).annotations({
  identifier: "CreateSourceNetworkResponse",
}) as any as S.Schema<CreateSourceNetworkResponse>;
export interface DescribeSourceNetworksRequest {
  filters?: DescribeSourceNetworksRequestFilters;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeSourceNetworksRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(DescribeSourceNetworksRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeSourceNetworks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSourceNetworksRequest",
}) as any as S.Schema<DescribeSourceNetworksRequest>;
export interface AssociateSourceNetworkStackResponse {
  job?: Job;
}
export const AssociateSourceNetworkStackResponse = S.suspend(() =>
  S.Struct({ job: S.optional(Job) }),
).annotations({
  identifier: "AssociateSourceNetworkStackResponse",
}) as any as S.Schema<AssociateSourceNetworkStackResponse>;
export interface ExportSourceNetworkCfnTemplateResponse {
  s3DestinationUrl?: string;
}
export const ExportSourceNetworkCfnTemplateResponse = S.suspend(() =>
  S.Struct({ s3DestinationUrl: S.optional(S.String) }),
).annotations({
  identifier: "ExportSourceNetworkCfnTemplateResponse",
}) as any as S.Schema<ExportSourceNetworkCfnTemplateResponse>;
export interface RecoveryLifeCycle {
  apiCallDateTime?: Date;
  jobID?: string;
  lastRecoveryResult?: string;
}
export const RecoveryLifeCycle = S.suspend(() =>
  S.Struct({
    apiCallDateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    jobID: S.optional(S.String),
    lastRecoveryResult: S.optional(S.String),
  }),
).annotations({
  identifier: "RecoveryLifeCycle",
}) as any as S.Schema<RecoveryLifeCycle>;
export interface SourceNetwork {
  sourceNetworkID?: string;
  sourceVpcID?: string;
  arn?: string;
  tags?: TagsMap;
  replicationStatus?: string;
  replicationStatusDetails?: string | Redacted.Redacted<string>;
  cfnStackName?: string | Redacted.Redacted<string>;
  sourceRegion?: string;
  sourceAccountID?: string;
  lastRecovery?: RecoveryLifeCycle;
  launchedVpcID?: string;
}
export const SourceNetwork = S.suspend(() =>
  S.Struct({
    sourceNetworkID: S.optional(S.String),
    sourceVpcID: S.optional(S.String),
    arn: S.optional(S.String),
    tags: S.optional(TagsMap),
    replicationStatus: S.optional(S.String),
    replicationStatusDetails: S.optional(SensitiveString),
    cfnStackName: S.optional(SensitiveString),
    sourceRegion: S.optional(S.String),
    sourceAccountID: S.optional(S.String),
    lastRecovery: S.optional(RecoveryLifeCycle),
    launchedVpcID: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceNetwork",
}) as any as S.Schema<SourceNetwork>;
export interface StopSourceNetworkReplicationResponse {
  sourceNetwork?: SourceNetwork;
}
export const StopSourceNetworkReplicationResponse = S.suspend(() =>
  S.Struct({ sourceNetwork: S.optional(SourceNetwork) }),
).annotations({
  identifier: "StopSourceNetworkReplicationResponse",
}) as any as S.Schema<StopSourceNetworkReplicationResponse>;
export interface StartSourceNetworkRecoveryRequest {
  sourceNetworks: StartSourceNetworkRecoveryRequestNetworkEntries;
  deployAsNew?: boolean;
  tags?: TagsMap;
}
export const StartSourceNetworkRecoveryRequest = S.suspend(() =>
  S.Struct({
    sourceNetworks: StartSourceNetworkRecoveryRequestNetworkEntries,
    deployAsNew: S.optional(S.Boolean),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartSourceNetworkRecovery" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartSourceNetworkRecoveryRequest",
}) as any as S.Schema<StartSourceNetworkRecoveryRequest>;
export interface DescribeSourceServersRequest {
  filters?: DescribeSourceServersRequestFilters;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeSourceServersRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(DescribeSourceServersRequestFilters),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeSourceServers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSourceServersRequest",
}) as any as S.Schema<DescribeSourceServersRequest>;
export interface DescribeRecoverySnapshotsRequest {
  sourceServerID: string;
  filters?: DescribeRecoverySnapshotsRequestFilters;
  order?: string;
  maxResults?: number;
  nextToken?: string;
}
export const DescribeRecoverySnapshotsRequest = S.suspend(() =>
  S.Struct({
    sourceServerID: S.String,
    filters: S.optional(DescribeRecoverySnapshotsRequestFilters),
    order: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeRecoverySnapshots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRecoverySnapshotsRequest",
}) as any as S.Schema<DescribeRecoverySnapshotsRequest>;
export interface LaunchConfiguration {
  sourceServerID?: string;
  name?: string;
  ec2LaunchTemplateID?: string;
  launchDisposition?: string;
  targetInstanceTypeRightSizingMethod?: string;
  copyPrivateIp?: boolean;
  copyTags?: boolean;
  licensing?: Licensing;
  postLaunchEnabled?: boolean;
  launchIntoInstanceProperties?: LaunchIntoInstanceProperties;
}
export const LaunchConfiguration = S.suspend(() =>
  S.Struct({
    sourceServerID: S.optional(S.String),
    name: S.optional(S.String),
    ec2LaunchTemplateID: S.optional(S.String),
    launchDisposition: S.optional(S.String),
    targetInstanceTypeRightSizingMethod: S.optional(S.String),
    copyPrivateIp: S.optional(S.Boolean),
    copyTags: S.optional(S.Boolean),
    licensing: S.optional(Licensing),
    postLaunchEnabled: S.optional(S.Boolean),
    launchIntoInstanceProperties: S.optional(LaunchIntoInstanceProperties),
  }),
).annotations({
  identifier: "LaunchConfiguration",
}) as any as S.Schema<LaunchConfiguration>;
export interface ReplicationConfiguration {
  sourceServerID?: string;
  name?: string;
  stagingAreaSubnetId?: string;
  associateDefaultSecurityGroup?: boolean;
  replicationServersSecurityGroupsIDs?: ReplicationServersSecurityGroupsIDs;
  replicationServerInstanceType?: string;
  useDedicatedReplicationServer?: boolean;
  defaultLargeStagingDiskType?: string;
  replicatedDisks?: ReplicationConfigurationReplicatedDisks;
  ebsEncryption?: string;
  ebsEncryptionKeyArn?: string;
  bandwidthThrottling?: number;
  dataPlaneRouting?: string;
  createPublicIP?: boolean;
  stagingAreaTags?: TagsMap;
  pitPolicy?: PITPolicy;
  autoReplicateNewDisks?: boolean;
}
export const ReplicationConfiguration = S.suspend(() =>
  S.Struct({
    sourceServerID: S.optional(S.String),
    name: S.optional(S.String),
    stagingAreaSubnetId: S.optional(S.String),
    associateDefaultSecurityGroup: S.optional(S.Boolean),
    replicationServersSecurityGroupsIDs: S.optional(
      ReplicationServersSecurityGroupsIDs,
    ),
    replicationServerInstanceType: S.optional(S.String),
    useDedicatedReplicationServer: S.optional(S.Boolean),
    defaultLargeStagingDiskType: S.optional(S.String),
    replicatedDisks: S.optional(ReplicationConfigurationReplicatedDisks),
    ebsEncryption: S.optional(S.String),
    ebsEncryptionKeyArn: S.optional(S.String),
    bandwidthThrottling: S.optional(S.Number),
    dataPlaneRouting: S.optional(S.String),
    createPublicIP: S.optional(S.Boolean),
    stagingAreaTags: S.optional(TagsMap),
    pitPolicy: S.optional(PITPolicy),
    autoReplicateNewDisks: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ReplicationConfiguration",
}) as any as S.Schema<ReplicationConfiguration>;
export interface DataReplicationInfoReplicatedDisk {
  deviceName?: string;
  totalStorageBytes?: number;
  replicatedStorageBytes?: number;
  rescannedStorageBytes?: number;
  backloggedStorageBytes?: number;
  volumeStatus?: string;
}
export const DataReplicationInfoReplicatedDisk = S.suspend(() =>
  S.Struct({
    deviceName: S.optional(S.String),
    totalStorageBytes: S.optional(S.Number),
    replicatedStorageBytes: S.optional(S.Number),
    rescannedStorageBytes: S.optional(S.Number),
    backloggedStorageBytes: S.optional(S.Number),
    volumeStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "DataReplicationInfoReplicatedDisk",
}) as any as S.Schema<DataReplicationInfoReplicatedDisk>;
export type DataReplicationInfoReplicatedDisks =
  DataReplicationInfoReplicatedDisk[];
export const DataReplicationInfoReplicatedDisks = S.Array(
  DataReplicationInfoReplicatedDisk,
);
export interface DataReplicationInitiationStep {
  name?: string;
  status?: string;
}
export const DataReplicationInitiationStep = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), status: S.optional(S.String) }),
).annotations({
  identifier: "DataReplicationInitiationStep",
}) as any as S.Schema<DataReplicationInitiationStep>;
export type DataReplicationInitiationSteps = DataReplicationInitiationStep[];
export const DataReplicationInitiationSteps = S.Array(
  DataReplicationInitiationStep,
);
export interface DataReplicationInitiation {
  startDateTime?: string;
  nextAttemptDateTime?: string;
  steps?: DataReplicationInitiationSteps;
}
export const DataReplicationInitiation = S.suspend(() =>
  S.Struct({
    startDateTime: S.optional(S.String),
    nextAttemptDateTime: S.optional(S.String),
    steps: S.optional(DataReplicationInitiationSteps),
  }),
).annotations({
  identifier: "DataReplicationInitiation",
}) as any as S.Schema<DataReplicationInitiation>;
export interface DataReplicationError {
  error?: string;
  rawError?: string;
}
export const DataReplicationError = S.suspend(() =>
  S.Struct({ error: S.optional(S.String), rawError: S.optional(S.String) }),
).annotations({
  identifier: "DataReplicationError",
}) as any as S.Schema<DataReplicationError>;
export interface DataReplicationInfo {
  lagDuration?: string;
  etaDateTime?: string;
  replicatedDisks?: DataReplicationInfoReplicatedDisks;
  dataReplicationState?: string;
  dataReplicationInitiation?: DataReplicationInitiation;
  dataReplicationError?: DataReplicationError;
  stagingAvailabilityZone?: string;
  stagingOutpostArn?: string;
}
export const DataReplicationInfo = S.suspend(() =>
  S.Struct({
    lagDuration: S.optional(S.String),
    etaDateTime: S.optional(S.String),
    replicatedDisks: S.optional(DataReplicationInfoReplicatedDisks),
    dataReplicationState: S.optional(S.String),
    dataReplicationInitiation: S.optional(DataReplicationInitiation),
    dataReplicationError: S.optional(DataReplicationError),
    stagingAvailabilityZone: S.optional(S.String),
    stagingOutpostArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DataReplicationInfo",
}) as any as S.Schema<DataReplicationInfo>;
export interface LifeCycleLastLaunchInitiated {
  apiCallDateTime?: string;
  jobID?: string;
  type?: string;
}
export const LifeCycleLastLaunchInitiated = S.suspend(() =>
  S.Struct({
    apiCallDateTime: S.optional(S.String),
    jobID: S.optional(S.String),
    type: S.optional(S.String),
  }),
).annotations({
  identifier: "LifeCycleLastLaunchInitiated",
}) as any as S.Schema<LifeCycleLastLaunchInitiated>;
export interface LifeCycleLastLaunch {
  initiated?: LifeCycleLastLaunchInitiated;
  status?: string;
}
export const LifeCycleLastLaunch = S.suspend(() =>
  S.Struct({
    initiated: S.optional(LifeCycleLastLaunchInitiated),
    status: S.optional(S.String),
  }),
).annotations({
  identifier: "LifeCycleLastLaunch",
}) as any as S.Schema<LifeCycleLastLaunch>;
export interface LifeCycle {
  addedToServiceDateTime?: string;
  firstByteDateTime?: string;
  elapsedReplicationDuration?: string;
  lastSeenByServiceDateTime?: string;
  lastLaunch?: LifeCycleLastLaunch;
}
export const LifeCycle = S.suspend(() =>
  S.Struct({
    addedToServiceDateTime: S.optional(S.String),
    firstByteDateTime: S.optional(S.String),
    elapsedReplicationDuration: S.optional(S.String),
    lastSeenByServiceDateTime: S.optional(S.String),
    lastLaunch: S.optional(LifeCycleLastLaunch),
  }),
).annotations({ identifier: "LifeCycle" }) as any as S.Schema<LifeCycle>;
export interface IdentificationHints {
  fqdn?: string;
  hostname?: string;
  vmWareUuid?: string;
  awsInstanceID?: string;
}
export const IdentificationHints = S.suspend(() =>
  S.Struct({
    fqdn: S.optional(S.String),
    hostname: S.optional(S.String),
    vmWareUuid: S.optional(S.String),
    awsInstanceID: S.optional(S.String),
  }),
).annotations({
  identifier: "IdentificationHints",
}) as any as S.Schema<IdentificationHints>;
export type IPsList = string[];
export const IPsList = S.Array(S.String);
export interface NetworkInterface {
  macAddress?: string;
  ips?: IPsList;
  isPrimary?: boolean;
}
export const NetworkInterface = S.suspend(() =>
  S.Struct({
    macAddress: S.optional(S.String),
    ips: S.optional(IPsList),
    isPrimary: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "NetworkInterface",
}) as any as S.Schema<NetworkInterface>;
export type NetworkInterfaces = NetworkInterface[];
export const NetworkInterfaces = S.Array(NetworkInterface);
export interface Disk {
  deviceName?: string;
  bytes?: number;
}
export const Disk = S.suspend(() =>
  S.Struct({ deviceName: S.optional(S.String), bytes: S.optional(S.Number) }),
).annotations({ identifier: "Disk" }) as any as S.Schema<Disk>;
export type Disks = Disk[];
export const Disks = S.Array(Disk);
export interface CPU {
  cores?: number;
  modelName?: string;
}
export const CPU = S.suspend(() =>
  S.Struct({ cores: S.optional(S.Number), modelName: S.optional(S.String) }),
).annotations({ identifier: "CPU" }) as any as S.Schema<CPU>;
export type Cpus = CPU[];
export const Cpus = S.Array(CPU);
export interface OS {
  fullString?: string;
}
export const OS = S.suspend(() =>
  S.Struct({ fullString: S.optional(S.String) }),
).annotations({ identifier: "OS" }) as any as S.Schema<OS>;
export interface SourceProperties {
  lastUpdatedDateTime?: string;
  recommendedInstanceType?: string;
  identificationHints?: IdentificationHints;
  networkInterfaces?: NetworkInterfaces;
  disks?: Disks;
  cpus?: Cpus;
  ramBytes?: number;
  os?: OS;
  supportsNitroInstances?: boolean;
}
export const SourceProperties = S.suspend(() =>
  S.Struct({
    lastUpdatedDateTime: S.optional(S.String),
    recommendedInstanceType: S.optional(S.String),
    identificationHints: S.optional(IdentificationHints),
    networkInterfaces: S.optional(NetworkInterfaces),
    disks: S.optional(Disks),
    cpus: S.optional(Cpus),
    ramBytes: S.optional(S.Number),
    os: S.optional(OS),
    supportsNitroInstances: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SourceProperties",
}) as any as S.Schema<SourceProperties>;
export interface StagingArea {
  status?: string;
  stagingAccountID?: string;
  stagingSourceServerArn?: string;
  errorMessage?: string;
}
export const StagingArea = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    stagingAccountID: S.optional(S.String),
    stagingSourceServerArn: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "StagingArea" }) as any as S.Schema<StagingArea>;
export interface SourceCloudProperties {
  originAccountID?: string;
  originRegion?: string;
  originAvailabilityZone?: string;
  sourceOutpostArn?: string;
}
export const SourceCloudProperties = S.suspend(() =>
  S.Struct({
    originAccountID: S.optional(S.String),
    originRegion: S.optional(S.String),
    originAvailabilityZone: S.optional(S.String),
    sourceOutpostArn: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceCloudProperties",
}) as any as S.Schema<SourceCloudProperties>;
export interface SourceServer {
  sourceServerID?: string;
  arn?: string;
  tags?: TagsMap;
  recoveryInstanceId?: string;
  lastLaunchResult?: string;
  dataReplicationInfo?: DataReplicationInfo;
  lifeCycle?: LifeCycle;
  sourceProperties?: SourceProperties;
  stagingArea?: StagingArea;
  sourceCloudProperties?: SourceCloudProperties;
  replicationDirection?: string;
  reversedDirectionSourceServerArn?: string;
  sourceNetworkID?: string;
  agentVersion?: string;
}
export const SourceServer = S.suspend(() =>
  S.Struct({
    sourceServerID: S.optional(S.String),
    arn: S.optional(S.String),
    tags: S.optional(TagsMap),
    recoveryInstanceId: S.optional(S.String),
    lastLaunchResult: S.optional(S.String),
    dataReplicationInfo: S.optional(DataReplicationInfo),
    lifeCycle: S.optional(LifeCycle),
    sourceProperties: S.optional(SourceProperties),
    stagingArea: S.optional(StagingArea),
    sourceCloudProperties: S.optional(SourceCloudProperties),
    replicationDirection: S.optional(S.String),
    reversedDirectionSourceServerArn: S.optional(S.String),
    sourceNetworkID: S.optional(S.String),
    agentVersion: S.optional(S.String),
  }),
).annotations({ identifier: "SourceServer" }) as any as S.Schema<SourceServer>;
export interface StartReplicationResponse {
  sourceServer?: SourceServer;
}
export const StartReplicationResponse = S.suspend(() =>
  S.Struct({ sourceServer: S.optional(SourceServer) }),
).annotations({
  identifier: "StartReplicationResponse",
}) as any as S.Schema<StartReplicationResponse>;
export interface StopReplicationResponse {
  sourceServer?: SourceServer;
}
export const StopReplicationResponse = S.suspend(() =>
  S.Struct({ sourceServer: S.optional(SourceServer) }),
).annotations({
  identifier: "StopReplicationResponse",
}) as any as S.Schema<StopReplicationResponse>;
export interface UpdateLaunchConfigurationRequest {
  sourceServerID: string;
  name?: string;
  launchDisposition?: string;
  targetInstanceTypeRightSizingMethod?: string;
  copyPrivateIp?: boolean;
  copyTags?: boolean;
  licensing?: Licensing;
  postLaunchEnabled?: boolean;
  launchIntoInstanceProperties?: LaunchIntoInstanceProperties;
}
export const UpdateLaunchConfigurationRequest = S.suspend(() =>
  S.Struct({
    sourceServerID: S.String,
    name: S.optional(S.String),
    launchDisposition: S.optional(S.String),
    targetInstanceTypeRightSizingMethod: S.optional(S.String),
    copyPrivateIp: S.optional(S.Boolean),
    copyTags: S.optional(S.Boolean),
    licensing: S.optional(Licensing),
    postLaunchEnabled: S.optional(S.Boolean),
    launchIntoInstanceProperties: S.optional(LaunchIntoInstanceProperties),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateLaunchConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateLaunchConfigurationRequest",
}) as any as S.Schema<UpdateLaunchConfigurationRequest>;
export interface UpdateReplicationConfigurationRequest {
  sourceServerID: string;
  name?: string;
  stagingAreaSubnetId?: string;
  associateDefaultSecurityGroup?: boolean;
  replicationServersSecurityGroupsIDs?: ReplicationServersSecurityGroupsIDs;
  replicationServerInstanceType?: string;
  useDedicatedReplicationServer?: boolean;
  defaultLargeStagingDiskType?: string;
  replicatedDisks?: ReplicationConfigurationReplicatedDisks;
  ebsEncryption?: string;
  ebsEncryptionKeyArn?: string;
  bandwidthThrottling?: number;
  dataPlaneRouting?: string;
  createPublicIP?: boolean;
  stagingAreaTags?: TagsMap;
  pitPolicy?: PITPolicy;
  autoReplicateNewDisks?: boolean;
}
export const UpdateReplicationConfigurationRequest = S.suspend(() =>
  S.Struct({
    sourceServerID: S.String,
    name: S.optional(S.String),
    stagingAreaSubnetId: S.optional(S.String),
    associateDefaultSecurityGroup: S.optional(S.Boolean),
    replicationServersSecurityGroupsIDs: S.optional(
      ReplicationServersSecurityGroupsIDs,
    ),
    replicationServerInstanceType: S.optional(S.String),
    useDedicatedReplicationServer: S.optional(S.Boolean),
    defaultLargeStagingDiskType: S.optional(S.String),
    replicatedDisks: S.optional(ReplicationConfigurationReplicatedDisks),
    ebsEncryption: S.optional(S.String),
    ebsEncryptionKeyArn: S.optional(S.String),
    bandwidthThrottling: S.optional(S.Number),
    dataPlaneRouting: S.optional(S.String),
    createPublicIP: S.optional(S.Boolean),
    stagingAreaTags: S.optional(TagsMap),
    pitPolicy: S.optional(PITPolicy),
    autoReplicateNewDisks: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UpdateReplicationConfiguration" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateReplicationConfigurationRequest",
}) as any as S.Schema<UpdateReplicationConfigurationRequest>;
export interface StartRecoveryRequest {
  sourceServers: StartRecoveryRequestSourceServers;
  isDrill?: boolean;
  tags?: TagsMap;
}
export const StartRecoveryRequest = S.suspend(() =>
  S.Struct({
    sourceServers: StartRecoveryRequestSourceServers,
    isDrill: S.optional(S.Boolean),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartRecovery" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartRecoveryRequest",
}) as any as S.Schema<StartRecoveryRequest>;
export interface StagingSourceServer {
  hostname?: string;
  arn?: string;
  tags?: TagsMap;
}
export const StagingSourceServer = S.suspend(() =>
  S.Struct({
    hostname: S.optional(S.String),
    arn: S.optional(S.String),
    tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "StagingSourceServer",
}) as any as S.Schema<StagingSourceServer>;
export type StagingSourceServersList = StagingSourceServer[];
export const StagingSourceServersList = S.Array(StagingSourceServer);
export interface Account {
  accountID?: string;
}
export const Account = S.suspend(() =>
  S.Struct({ accountID: S.optional(S.String) }),
).annotations({ identifier: "Account" }) as any as S.Schema<Account>;
export type Accounts = Account[];
export const Accounts = S.Array(Account);
export type JobsList = Job[];
export const JobsList = S.Array(Job);
export type SourceNetworksList = SourceNetwork[];
export const SourceNetworksList = S.Array(SourceNetwork);
export type SourceServersList = SourceServer[];
export const SourceServersList = S.Array(SourceServer);
export interface CreateExtendedSourceServerResponse {
  sourceServer?: SourceServer;
}
export const CreateExtendedSourceServerResponse = S.suspend(() =>
  S.Struct({ sourceServer: S.optional(SourceServer) }),
).annotations({
  identifier: "CreateExtendedSourceServerResponse",
}) as any as S.Schema<CreateExtendedSourceServerResponse>;
export interface ListExtensibleSourceServersResponse {
  items?: StagingSourceServersList;
  nextToken?: string;
}
export const ListExtensibleSourceServersResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(StagingSourceServersList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExtensibleSourceServersResponse",
}) as any as S.Schema<ListExtensibleSourceServersResponse>;
export interface ListStagingAccountsResponse {
  accounts?: Accounts;
  nextToken?: string;
}
export const ListStagingAccountsResponse = S.suspend(() =>
  S.Struct({ accounts: S.optional(Accounts), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListStagingAccountsResponse",
}) as any as S.Schema<ListStagingAccountsResponse>;
export interface PutLaunchActionRequest {
  resourceId: string;
  actionCode: string;
  order: number;
  actionId: string;
  optional: boolean;
  active: boolean;
  name: string;
  actionVersion: string;
  category: string;
  parameters?: LaunchActionParameters;
  description: string;
}
export const PutLaunchActionRequest = S.suspend(() =>
  S.Struct({
    resourceId: S.String,
    actionCode: S.String,
    order: S.Number,
    actionId: S.String,
    optional: S.Boolean,
    active: S.Boolean,
    name: S.String,
    actionVersion: S.String,
    category: S.String,
    parameters: S.optional(LaunchActionParameters),
    description: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/PutLaunchAction" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutLaunchActionRequest",
}) as any as S.Schema<PutLaunchActionRequest>;
export interface DescribeJobsResponse {
  items?: JobsList;
  nextToken?: string;
}
export const DescribeJobsResponse = S.suspend(() =>
  S.Struct({ items: S.optional(JobsList), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeJobsResponse",
}) as any as S.Schema<DescribeJobsResponse>;
export interface CreateLaunchConfigurationTemplateResponse {
  launchConfigurationTemplate?: LaunchConfigurationTemplate;
}
export const CreateLaunchConfigurationTemplateResponse = S.suspend(() =>
  S.Struct({
    launchConfigurationTemplate: S.optional(LaunchConfigurationTemplate),
  }),
).annotations({
  identifier: "CreateLaunchConfigurationTemplateResponse",
}) as any as S.Schema<CreateLaunchConfigurationTemplateResponse>;
export interface UpdateLaunchConfigurationTemplateResponse {
  launchConfigurationTemplate?: LaunchConfigurationTemplate;
}
export const UpdateLaunchConfigurationTemplateResponse = S.suspend(() =>
  S.Struct({
    launchConfigurationTemplate: S.optional(LaunchConfigurationTemplate),
  }),
).annotations({
  identifier: "UpdateLaunchConfigurationTemplateResponse",
}) as any as S.Schema<UpdateLaunchConfigurationTemplateResponse>;
export interface DescribeSourceNetworksResponse {
  items?: SourceNetworksList;
  nextToken?: string;
}
export const DescribeSourceNetworksResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(SourceNetworksList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSourceNetworksResponse",
}) as any as S.Schema<DescribeSourceNetworksResponse>;
export interface StartSourceNetworkRecoveryResponse {
  job?: Job;
}
export const StartSourceNetworkRecoveryResponse = S.suspend(() =>
  S.Struct({ job: S.optional(Job) }),
).annotations({
  identifier: "StartSourceNetworkRecoveryResponse",
}) as any as S.Schema<StartSourceNetworkRecoveryResponse>;
export interface DescribeSourceServersResponse {
  items?: SourceServersList;
  nextToken?: string;
}
export const DescribeSourceServersResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(SourceServersList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSourceServersResponse",
}) as any as S.Schema<DescribeSourceServersResponse>;
export interface StartRecoveryResponse {
  job?: Job;
}
export const StartRecoveryResponse = S.suspend(() =>
  S.Struct({ job: S.optional(Job) }),
).annotations({
  identifier: "StartRecoveryResponse",
}) as any as S.Schema<StartRecoveryResponse>;
export type EbsSnapshotsList = string[];
export const EbsSnapshotsList = S.Array(S.String);
export type LaunchActions = LaunchAction[];
export const LaunchActions = S.Array(LaunchAction);
export interface RecoverySnapshot {
  snapshotID: string;
  sourceServerID: string;
  expectedTimestamp: string;
  timestamp?: string;
  ebsSnapshots?: EbsSnapshotsList;
}
export const RecoverySnapshot = S.suspend(() =>
  S.Struct({
    snapshotID: S.String,
    sourceServerID: S.String,
    expectedTimestamp: S.String,
    timestamp: S.optional(S.String),
    ebsSnapshots: S.optional(EbsSnapshotsList),
  }),
).annotations({
  identifier: "RecoverySnapshot",
}) as any as S.Schema<RecoverySnapshot>;
export type RecoverySnapshotsList = RecoverySnapshot[];
export const RecoverySnapshotsList = S.Array(RecoverySnapshot);
export interface ListLaunchActionsResponse {
  items?: LaunchActions;
  nextToken?: string;
}
export const ListLaunchActionsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(LaunchActions),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLaunchActionsResponse",
}) as any as S.Schema<ListLaunchActionsResponse>;
export interface PutLaunchActionResponse {
  resourceId?: string;
  actionId?: string;
  actionCode?: string;
  type?: string;
  name?: string;
  active?: boolean;
  order?: number;
  actionVersion?: string;
  optional?: boolean;
  parameters?: LaunchActionParameters;
  description?: string;
  category?: string;
}
export const PutLaunchActionResponse = S.suspend(() =>
  S.Struct({
    resourceId: S.optional(S.String),
    actionId: S.optional(S.String),
    actionCode: S.optional(S.String),
    type: S.optional(S.String),
    name: S.optional(S.String),
    active: S.optional(S.Boolean),
    order: S.optional(S.Number),
    actionVersion: S.optional(S.String),
    optional: S.optional(S.Boolean),
    parameters: S.optional(LaunchActionParameters),
    description: S.optional(S.String),
    category: S.optional(S.String),
  }),
).annotations({
  identifier: "PutLaunchActionResponse",
}) as any as S.Schema<PutLaunchActionResponse>;
export interface StartSourceNetworkReplicationResponse {
  sourceNetwork?: SourceNetwork;
}
export const StartSourceNetworkReplicationResponse = S.suspend(() =>
  S.Struct({ sourceNetwork: S.optional(SourceNetwork) }),
).annotations({
  identifier: "StartSourceNetworkReplicationResponse",
}) as any as S.Schema<StartSourceNetworkReplicationResponse>;
export interface DescribeRecoverySnapshotsResponse {
  items?: RecoverySnapshotsList;
  nextToken?: string;
}
export const DescribeRecoverySnapshotsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(RecoverySnapshotsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRecoverySnapshotsResponse",
}) as any as S.Schema<DescribeRecoverySnapshotsResponse>;
export interface RecoveryInstanceFailback {
  failbackClientID?: string;
  failbackJobID?: string;
  failbackInitiationTime?: string;
  state?: string;
  agentLastSeenByServiceDateTime?: string;
  failbackClientLastSeenByServiceDateTime?: string;
  failbackToOriginalServer?: boolean;
  firstByteDateTime?: string;
  elapsedReplicationDuration?: string;
  failbackLaunchType?: string;
}
export const RecoveryInstanceFailback = S.suspend(() =>
  S.Struct({
    failbackClientID: S.optional(S.String),
    failbackJobID: S.optional(S.String),
    failbackInitiationTime: S.optional(S.String),
    state: S.optional(S.String),
    agentLastSeenByServiceDateTime: S.optional(S.String),
    failbackClientLastSeenByServiceDateTime: S.optional(S.String),
    failbackToOriginalServer: S.optional(S.Boolean),
    firstByteDateTime: S.optional(S.String),
    elapsedReplicationDuration: S.optional(S.String),
    failbackLaunchType: S.optional(S.String),
  }),
).annotations({
  identifier: "RecoveryInstanceFailback",
}) as any as S.Schema<RecoveryInstanceFailback>;
export type VolumeToSizeMap = { [key: string]: number };
export const VolumeToSizeMap = S.Record({ key: S.String, value: S.Number });
export interface SourceNetworkData {
  sourceNetworkID?: string;
  sourceVpc?: string;
  targetVpc?: string;
  stackName?: string;
}
export const SourceNetworkData = S.suspend(() =>
  S.Struct({
    sourceNetworkID: S.optional(S.String),
    sourceVpc: S.optional(S.String),
    targetVpc: S.optional(S.String),
    stackName: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceNetworkData",
}) as any as S.Schema<SourceNetworkData>;
export interface ValidationExceptionField {
  name?: string;
  message?: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), message: S.optional(S.String) }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export type EventResourceData = { sourceNetworkData: SourceNetworkData };
export const EventResourceData = S.Union(
  S.Struct({ sourceNetworkData: SourceNetworkData }),
);
export interface RecoveryInstanceDataReplicationInfoReplicatedDisk {
  deviceName?: string;
  totalStorageBytes?: number;
  replicatedStorageBytes?: number;
  rescannedStorageBytes?: number;
  backloggedStorageBytes?: number;
}
export const RecoveryInstanceDataReplicationInfoReplicatedDisk = S.suspend(() =>
  S.Struct({
    deviceName: S.optional(S.String),
    totalStorageBytes: S.optional(S.Number),
    replicatedStorageBytes: S.optional(S.Number),
    rescannedStorageBytes: S.optional(S.Number),
    backloggedStorageBytes: S.optional(S.Number),
  }),
).annotations({
  identifier: "RecoveryInstanceDataReplicationInfoReplicatedDisk",
}) as any as S.Schema<RecoveryInstanceDataReplicationInfoReplicatedDisk>;
export type RecoveryInstanceDataReplicationInfoReplicatedDisks =
  RecoveryInstanceDataReplicationInfoReplicatedDisk[];
export const RecoveryInstanceDataReplicationInfoReplicatedDisks = S.Array(
  RecoveryInstanceDataReplicationInfoReplicatedDisk,
);
export interface RecoveryInstanceDataReplicationError {
  error?: string;
  rawError?: string;
}
export const RecoveryInstanceDataReplicationError = S.suspend(() =>
  S.Struct({ error: S.optional(S.String), rawError: S.optional(S.String) }),
).annotations({
  identifier: "RecoveryInstanceDataReplicationError",
}) as any as S.Schema<RecoveryInstanceDataReplicationError>;
export interface RecoveryInstanceDisk {
  internalDeviceName?: string;
  bytes?: number;
  ebsVolumeID?: string;
}
export const RecoveryInstanceDisk = S.suspend(() =>
  S.Struct({
    internalDeviceName: S.optional(S.String),
    bytes: S.optional(S.Number),
    ebsVolumeID: S.optional(S.String),
  }),
).annotations({
  identifier: "RecoveryInstanceDisk",
}) as any as S.Schema<RecoveryInstanceDisk>;
export type RecoveryInstanceDisks = RecoveryInstanceDisk[];
export const RecoveryInstanceDisks = S.Array(RecoveryInstanceDisk);
export type ConversionMap = { [key: string]: string };
export const ConversionMap = S.Record({ key: S.String, value: S.String });
export interface ProductCode {
  productCodeId?: string;
  productCodeMode?: string;
}
export const ProductCode = S.suspend(() =>
  S.Struct({
    productCodeId: S.optional(S.String),
    productCodeMode: S.optional(S.String),
  }),
).annotations({ identifier: "ProductCode" }) as any as S.Schema<ProductCode>;
export type ProductCodes = ProductCode[];
export const ProductCodes = S.Array(ProductCode);
export interface RecoveryInstanceProperties {
  lastUpdatedDateTime?: string;
  identificationHints?: IdentificationHints;
  networkInterfaces?: NetworkInterfaces;
  disks?: RecoveryInstanceDisks;
  cpus?: Cpus;
  ramBytes?: number;
  os?: OS;
}
export const RecoveryInstanceProperties = S.suspend(() =>
  S.Struct({
    lastUpdatedDateTime: S.optional(S.String),
    identificationHints: S.optional(IdentificationHints),
    networkInterfaces: S.optional(NetworkInterfaces),
    disks: S.optional(RecoveryInstanceDisks),
    cpus: S.optional(Cpus),
    ramBytes: S.optional(S.Number),
    os: S.optional(OS),
  }),
).annotations({
  identifier: "RecoveryInstanceProperties",
}) as any as S.Schema<RecoveryInstanceProperties>;
export type VolumeToConversionMap = { [key: string]: ConversionMap };
export const VolumeToConversionMap = S.Record({
  key: S.String,
  value: ConversionMap,
});
export type VolumeToProductCodes = { [key: string]: ProductCodes };
export const VolumeToProductCodes = S.Record({
  key: S.String,
  value: ProductCodes,
});
export interface RecoveryInstanceDataReplicationInitiationStep {
  name?: string;
  status?: string;
}
export const RecoveryInstanceDataReplicationInitiationStep = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), status: S.optional(S.String) }),
).annotations({
  identifier: "RecoveryInstanceDataReplicationInitiationStep",
}) as any as S.Schema<RecoveryInstanceDataReplicationInitiationStep>;
export type RecoveryInstanceDataReplicationInitiationSteps =
  RecoveryInstanceDataReplicationInitiationStep[];
export const RecoveryInstanceDataReplicationInitiationSteps = S.Array(
  RecoveryInstanceDataReplicationInitiationStep,
);
export interface ConversionProperties {
  volumeToConversionMap?: VolumeToConversionMap;
  rootVolumeName?: string;
  forceUefi?: boolean;
  dataTimestamp?: string;
  volumeToVolumeSize?: VolumeToSizeMap;
  volumeToProductCodes?: VolumeToProductCodes;
}
export const ConversionProperties = S.suspend(() =>
  S.Struct({
    volumeToConversionMap: S.optional(VolumeToConversionMap),
    rootVolumeName: S.optional(S.String),
    forceUefi: S.optional(S.Boolean),
    dataTimestamp: S.optional(S.String),
    volumeToVolumeSize: S.optional(VolumeToSizeMap),
    volumeToProductCodes: S.optional(VolumeToProductCodes),
  }),
).annotations({
  identifier: "ConversionProperties",
}) as any as S.Schema<ConversionProperties>;
export interface RecoveryInstanceDataReplicationInitiation {
  startDateTime?: string;
  steps?: RecoveryInstanceDataReplicationInitiationSteps;
}
export const RecoveryInstanceDataReplicationInitiation = S.suspend(() =>
  S.Struct({
    startDateTime: S.optional(S.String),
    steps: S.optional(RecoveryInstanceDataReplicationInitiationSteps),
  }),
).annotations({
  identifier: "RecoveryInstanceDataReplicationInitiation",
}) as any as S.Schema<RecoveryInstanceDataReplicationInitiation>;
export interface StartFailbackLaunchResponse {
  job?: Job;
}
export const StartFailbackLaunchResponse = S.suspend(() =>
  S.Struct({ job: S.optional(Job) }),
).annotations({
  identifier: "StartFailbackLaunchResponse",
}) as any as S.Schema<StartFailbackLaunchResponse>;
export interface JobLogEventData {
  sourceServerID?: string;
  conversionServerID?: string;
  targetInstanceID?: string;
  rawError?: string;
  conversionProperties?: ConversionProperties;
  eventResourceData?: (typeof EventResourceData)["Type"];
}
export const JobLogEventData = S.suspend(() =>
  S.Struct({
    sourceServerID: S.optional(S.String),
    conversionServerID: S.optional(S.String),
    targetInstanceID: S.optional(S.String),
    rawError: S.optional(S.String),
    conversionProperties: S.optional(ConversionProperties),
    eventResourceData: S.optional(EventResourceData),
  }),
).annotations({
  identifier: "JobLogEventData",
}) as any as S.Schema<JobLogEventData>;
export interface RecoveryInstanceDataReplicationInfo {
  lagDuration?: string;
  etaDateTime?: string;
  replicatedDisks?: RecoveryInstanceDataReplicationInfoReplicatedDisks;
  dataReplicationState?: string;
  dataReplicationInitiation?: RecoveryInstanceDataReplicationInitiation;
  dataReplicationError?: RecoveryInstanceDataReplicationError;
  stagingAvailabilityZone?: string;
  stagingOutpostArn?: string;
}
export const RecoveryInstanceDataReplicationInfo = S.suspend(() =>
  S.Struct({
    lagDuration: S.optional(S.String),
    etaDateTime: S.optional(S.String),
    replicatedDisks: S.optional(
      RecoveryInstanceDataReplicationInfoReplicatedDisks,
    ),
    dataReplicationState: S.optional(S.String),
    dataReplicationInitiation: S.optional(
      RecoveryInstanceDataReplicationInitiation,
    ),
    dataReplicationError: S.optional(RecoveryInstanceDataReplicationError),
    stagingAvailabilityZone: S.optional(S.String),
    stagingOutpostArn: S.optional(S.String),
  }),
).annotations({
  identifier: "RecoveryInstanceDataReplicationInfo",
}) as any as S.Schema<RecoveryInstanceDataReplicationInfo>;
export interface JobLog {
  logDateTime?: string;
  event?: string;
  eventData?: JobLogEventData;
}
export const JobLog = S.suspend(() =>
  S.Struct({
    logDateTime: S.optional(S.String),
    event: S.optional(S.String),
    eventData: S.optional(JobLogEventData),
  }),
).annotations({ identifier: "JobLog" }) as any as S.Schema<JobLog>;
export type JobLogs = JobLog[];
export const JobLogs = S.Array(JobLog);
export interface RecoveryInstance {
  ec2InstanceID?: string;
  ec2InstanceState?: string;
  jobID?: string;
  recoveryInstanceID?: string;
  sourceServerID?: string;
  arn?: string;
  tags?: TagsMap;
  failback?: RecoveryInstanceFailback;
  dataReplicationInfo?: RecoveryInstanceDataReplicationInfo;
  recoveryInstanceProperties?: RecoveryInstanceProperties;
  pointInTimeSnapshotDateTime?: string;
  isDrill?: boolean;
  originEnvironment?: string;
  originAvailabilityZone?: string;
  agentVersion?: string;
  sourceOutpostArn?: string;
}
export const RecoveryInstance = S.suspend(() =>
  S.Struct({
    ec2InstanceID: S.optional(S.String),
    ec2InstanceState: S.optional(S.String),
    jobID: S.optional(S.String),
    recoveryInstanceID: S.optional(S.String),
    sourceServerID: S.optional(S.String),
    arn: S.optional(S.String),
    tags: S.optional(TagsMap),
    failback: S.optional(RecoveryInstanceFailback),
    dataReplicationInfo: S.optional(RecoveryInstanceDataReplicationInfo),
    recoveryInstanceProperties: S.optional(RecoveryInstanceProperties),
    pointInTimeSnapshotDateTime: S.optional(S.String),
    isDrill: S.optional(S.Boolean),
    originEnvironment: S.optional(S.String),
    originAvailabilityZone: S.optional(S.String),
    agentVersion: S.optional(S.String),
    sourceOutpostArn: S.optional(S.String),
  }),
).annotations({
  identifier: "RecoveryInstance",
}) as any as S.Schema<RecoveryInstance>;
export type DescribeRecoveryInstancesItems = RecoveryInstance[];
export const DescribeRecoveryInstancesItems = S.Array(RecoveryInstance);
export interface DescribeJobLogItemsResponse {
  items?: JobLogs;
  nextToken?: string;
}
export const DescribeJobLogItemsResponse = S.suspend(() =>
  S.Struct({ items: S.optional(JobLogs), nextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeJobLogItemsResponse",
}) as any as S.Schema<DescribeJobLogItemsResponse>;
export interface DescribeRecoveryInstancesResponse {
  nextToken?: string;
  items?: DescribeRecoveryInstancesItems;
}
export const DescribeRecoveryInstancesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    items: S.optional(DescribeRecoveryInstancesItems),
  }),
).annotations({
  identifier: "DescribeRecoveryInstancesResponse",
}) as any as S.Schema<DescribeRecoveryInstancesResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String), code: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {
    message: S.optional(S.String),
    code: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {
    message: S.optional(S.String),
    code: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
  },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.optional(S.String),
    code: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class UninitializedAccountException extends S.TaggedError<UninitializedAccountException>()(
  "UninitializedAccountException",
  { message: S.optional(S.String), code: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    code: S.optional(S.String),
    reason: S.optional(S.String),
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes a single Job by ID.
 */
export const deleteJob: (
  input: DeleteJobRequest,
) => Effect.Effect<
  DeleteJobResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobRequest,
  output: DeleteJobResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Lists all Failback ReplicationConfigurations, filtered by Recovery Instance ID.
 */
export const getFailbackReplicationConfiguration: (
  input: GetFailbackReplicationConfigurationRequest,
) => Effect.Effect<
  GetFailbackReplicationConfigurationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFailbackReplicationConfigurationRequest,
  output: GetFailbackReplicationConfigurationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Gets a LaunchConfiguration, filtered by Source Server IDs.
 */
export const getLaunchConfiguration: (
  input: GetLaunchConfigurationRequest,
) => Effect.Effect<
  LaunchConfiguration,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLaunchConfigurationRequest,
  output: LaunchConfiguration,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Gets a ReplicationConfiguration, filtered by Source Server ID.
 */
export const getReplicationConfiguration: (
  input: GetReplicationConfigurationRequest,
) => Effect.Effect<
  ReplicationConfiguration,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReplicationConfigurationRequest,
  output: ReplicationConfiguration,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Starts replication for a stopped Source Server. This action would make the Source Server protected again and restart billing for it.
 */
export const startReplication: (
  input: StartReplicationRequest,
) => Effect.Effect<
  StartReplicationResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartReplicationRequest,
  output: StartReplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Stops replication for a Source Server. This action would make the Source Server unprotected, delete its existing snapshots and stop billing for it.
 */
export const stopReplication: (
  input: StopReplicationRequest,
) => Effect.Effect<
  StopReplicationResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopReplicationRequest,
  output: StopReplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Stops the failback process for a specified Recovery Instance. This changes the Failback State of the Recovery Instance back to FAILBACK_NOT_STARTED.
 */
export const stopFailback: (
  input: StopFailbackRequest,
) => Effect.Effect<
  StopFailbackResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopFailbackRequest,
  output: StopFailbackResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Allows you to update the failback replication configuration of a Recovery Instance by ID.
 */
export const updateFailbackReplicationConfiguration: (
  input: UpdateFailbackReplicationConfigurationRequest,
) => Effect.Effect<
  UpdateFailbackReplicationConfigurationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFailbackReplicationConfigurationRequest,
  output: UpdateFailbackReplicationConfigurationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Deletes a single Launch Configuration Template by ID.
 */
export const deleteLaunchConfigurationTemplate: (
  input: DeleteLaunchConfigurationTemplateRequest,
) => Effect.Effect<
  DeleteLaunchConfigurationTemplateResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLaunchConfigurationTemplateRequest,
  output: DeleteLaunchConfigurationTemplateResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Disconnect a Recovery Instance from Elastic Disaster Recovery. Data replication is stopped immediately. All AWS resources created by Elastic Disaster Recovery for enabling the replication of the Recovery Instance will be terminated / deleted within 90 minutes. If the agent on the Recovery Instance has not been prevented from communicating with the Elastic Disaster Recovery service, then it will receive a command to uninstall itself (within approximately 10 minutes). The following properties of the Recovery Instance will be changed immediately: dataReplicationInfo.dataReplicationState will be set to DISCONNECTED; The totalStorageBytes property for each of dataReplicationInfo.replicatedDisks will be set to zero; dataReplicationInfo.lagDuration and dataReplicationInfo.lagDuration will be nullified.
 */
export const disconnectRecoveryInstance: (
  input: DisconnectRecoveryInstanceRequest,
) => Effect.Effect<
  DisconnectRecoveryInstanceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisconnectRecoveryInstanceRequest,
  output: DisconnectRecoveryInstanceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Deletes a single Replication Configuration Template by ID
 */
export const deleteReplicationConfigurationTemplate: (
  input: DeleteReplicationConfigurationTemplateRequest,
) => Effect.Effect<
  DeleteReplicationConfigurationTemplateResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReplicationConfigurationTemplateRequest,
  output: DeleteReplicationConfigurationTemplateResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Delete Source Network resource.
 */
export const deleteSourceNetwork: (
  input: DeleteSourceNetworkRequest,
) => Effect.Effect<
  DeleteSourceNetworkResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSourceNetworkRequest,
  output: DeleteSourceNetworkResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Deletes a single Source Server by ID. The Source Server must be disconnected first.
 */
export const deleteSourceServer: (
  input: DeleteSourceServerRequest,
) => Effect.Effect<
  DeleteSourceServerResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSourceServerRequest,
  output: DeleteSourceServerResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Deletes a single Recovery Instance by ID. This deletes the Recovery Instance resource from Elastic Disaster Recovery. The Recovery Instance must be disconnected first in order to delete it.
 */
export const deleteRecoveryInstance: (
  input: DeleteRecoveryInstanceRequest,
) => Effect.Effect<
  DeleteRecoveryInstanceResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRecoveryInstanceRequest,
  output: DeleteRecoveryInstanceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Initiates a Job for terminating the EC2 resources associated with the specified Recovery Instances, and then will delete the Recovery Instances from the Elastic Disaster Recovery service.
 */
export const terminateRecoveryInstances: (
  input: TerminateRecoveryInstancesRequest,
) => Effect.Effect<
  TerminateRecoveryInstancesResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateRecoveryInstancesRequest,
  output: TerminateRecoveryInstancesResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Launches Recovery Instances for the specified Source Servers. For each Source Server you may choose a point in time snapshot to launch from, or use an on demand snapshot.
 */
export const startRecovery: (
  input: StartRecoveryRequest,
) => Effect.Effect<
  StartRecoveryResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRecoveryRequest,
  output: StartRecoveryResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Lists resource launch actions.
 */
export const listLaunchActions: {
  (
    input: ListLaunchActionsRequest,
  ): Effect.Effect<
    ListLaunchActionsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | UninitializedAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLaunchActionsRequest,
  ) => Stream.Stream<
    ListLaunchActionsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | UninitializedAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLaunchActionsRequest,
  ) => Stream.Stream<
    LaunchAction,
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | UninitializedAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLaunchActionsRequest,
  output: ListLaunchActionsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Starts replication for a Source Network. This action would make the Source Network protected.
 */
export const startSourceNetworkReplication: (
  input: StartSourceNetworkReplicationRequest,
) => Effect.Effect<
  StartSourceNetworkReplicationResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSourceNetworkReplicationRequest,
  output: StartSourceNetworkReplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Disconnects a specific Source Server from Elastic Disaster Recovery. Data replication is stopped immediately. All AWS resources created by Elastic Disaster Recovery for enabling the replication of the Source Server will be terminated / deleted within 90 minutes. You cannot disconnect a Source Server if it has a Recovery Instance. If the agent on the Source Server has not been prevented from communicating with the Elastic Disaster Recovery service, then it will receive a command to uninstall itself (within approximately 10 minutes). The following properties of the SourceServer will be changed immediately: dataReplicationInfo.dataReplicationState will be set to DISCONNECTED; The totalStorageBytes property for each of dataReplicationInfo.replicatedDisks will be set to zero; dataReplicationInfo.lagDuration and dataReplicationInfo.lagDuration will be nullified.
 */
export const disconnectSourceServer: (
  input: DisconnectSourceServerRequest,
) => Effect.Effect<
  SourceServer,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisconnectSourceServerRequest,
  output: SourceServer,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
  ],
}));
/**
 * Initialize Elastic Disaster Recovery.
 */
export const initializeService: (
  input: InitializeServiceRequest,
) => Effect.Effect<
  InitializeServiceResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: InitializeServiceRequest,
  output: InitializeServiceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List all tags for your Elastic Disaster Recovery resources.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds or overwrites only the specified tags for the specified Elastic Disaster Recovery resource or resources. When you specify an existing tag key, the value is overwritten with the new value. Each resource can have a maximum of 50 tags. Each tag consists of a key and optional value.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the specified set of tags from the specified set of Elastic Disaster Recovery resources.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all Launch Configuration Templates, filtered by Launch Configuration Template IDs
 */
export const describeLaunchConfigurationTemplates: {
  (
    input: DescribeLaunchConfigurationTemplatesRequest,
  ): Effect.Effect<
    DescribeLaunchConfigurationTemplatesResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeLaunchConfigurationTemplatesRequest,
  ) => Stream.Stream<
    DescribeLaunchConfigurationTemplatesResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeLaunchConfigurationTemplatesRequest,
  ) => Stream.Stream<
    LaunchConfigurationTemplate,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeLaunchConfigurationTemplatesRequest,
  output: DescribeLaunchConfigurationTemplatesResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Start replication to origin / target region - applies only to protected instances that originated in EC2.
 * For recovery instances on target region - starts replication back to origin region.
 * For failback instances on origin region - starts replication to target region to re-protect them.
 */
export const reverseReplication: (
  input: ReverseReplicationRequest,
) => Effect.Effect<
  ReverseReplicationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReverseReplicationRequest,
  output: ReverseReplicationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Updates a ReplicationConfigurationTemplate by ID.
 */
export const updateReplicationConfigurationTemplate: (
  input: UpdateReplicationConfigurationTemplateRequest,
) => Effect.Effect<
  ReplicationConfigurationTemplate,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReplicationConfigurationTemplateRequest,
  output: ReplicationConfigurationTemplate,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Lists all ReplicationConfigurationTemplates, filtered by Source Server IDs.
 */
export const describeReplicationConfigurationTemplates: {
  (
    input: DescribeReplicationConfigurationTemplatesRequest,
  ): Effect.Effect<
    DescribeReplicationConfigurationTemplatesResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReplicationConfigurationTemplatesRequest,
  ) => Stream.Stream<
    DescribeReplicationConfigurationTemplatesResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReplicationConfigurationTemplatesRequest,
  ) => Stream.Stream<
    ReplicationConfigurationTemplate,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReplicationConfigurationTemplatesRequest,
  output: DescribeReplicationConfigurationTemplatesResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Create a new Source Network resource for a provided VPC ID.
 */
export const createSourceNetwork: (
  input: CreateSourceNetworkRequest,
) => Effect.Effect<
  CreateSourceNetworkResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSourceNetworkRequest,
  output: CreateSourceNetworkResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Associate a Source Network to an existing CloudFormation Stack and modify launch templates to use this network. Can be used for reverting to previously deployed CloudFormation stacks.
 */
export const associateSourceNetworkStack: (
  input: AssociateSourceNetworkStackRequest,
) => Effect.Effect<
  AssociateSourceNetworkStackResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateSourceNetworkStackRequest,
  output: AssociateSourceNetworkStackResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Export the Source Network CloudFormation template to an S3 bucket.
 */
export const exportSourceNetworkCfnTemplate: (
  input: ExportSourceNetworkCfnTemplateRequest,
) => Effect.Effect<
  ExportSourceNetworkCfnTemplateResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportSourceNetworkCfnTemplateRequest,
  output: ExportSourceNetworkCfnTemplateResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Stops replication for a Source Network. This action would make the Source Network unprotected.
 */
export const stopSourceNetworkReplication: (
  input: StopSourceNetworkReplicationRequest,
) => Effect.Effect<
  StopSourceNetworkReplicationResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopSourceNetworkReplicationRequest,
  output: StopSourceNetworkReplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Updates a LaunchConfiguration by Source Server ID.
 */
export const updateLaunchConfiguration: (
  input: UpdateLaunchConfigurationRequest,
) => Effect.Effect<
  LaunchConfiguration,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLaunchConfigurationRequest,
  output: LaunchConfiguration,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Allows you to update a ReplicationConfiguration by Source Server ID.
 */
export const updateReplicationConfiguration: (
  input: UpdateReplicationConfigurationRequest,
) => Effect.Effect<
  ReplicationConfiguration,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReplicationConfigurationRequest,
  output: ReplicationConfiguration,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * WARNING: RetryDataReplication is deprecated.
 * Causes the data replication initiation sequence to begin immediately upon next Handshake for the specified Source Server ID, regardless of when the previous initiation started. This command will work only if the Source Server is stalled or is in a DISCONNECTED or STOPPED state.
 */
export const retryDataReplication: (
  input: RetryDataReplicationRequest,
) => Effect.Effect<
  SourceServer,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetryDataReplicationRequest,
  output: SourceServer,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Create an extended source server in the target Account based on the source server in staging account.
 */
export const createExtendedSourceServer: (
  input: CreateExtendedSourceServerRequest,
) => Effect.Effect<
  CreateExtendedSourceServerResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExtendedSourceServerRequest,
  output: CreateExtendedSourceServerResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Creates a new ReplicationConfigurationTemplate.
 */
export const createReplicationConfigurationTemplate: (
  input: CreateReplicationConfigurationTemplateRequest,
) => Effect.Effect<
  ReplicationConfigurationTemplate,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReplicationConfigurationTemplateRequest,
  output: ReplicationConfigurationTemplate,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Creates a new Launch Configuration Template.
 */
export const createLaunchConfigurationTemplate: (
  input: CreateLaunchConfigurationTemplateRequest,
) => Effect.Effect<
  CreateLaunchConfigurationTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLaunchConfigurationTemplateRequest,
  output: CreateLaunchConfigurationTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Deletes a resource launch action.
 */
export const deleteLaunchAction: (
  input: DeleteLaunchActionRequest,
) => Effect.Effect<
  DeleteLaunchActionResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLaunchActionRequest,
  output: DeleteLaunchActionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Returns a list of source servers on a staging account that are extensible, which means that:
 * a. The source server is not already extended into this Account.
 * b. The source server on the Account we’re reading from is not an extension of another source server.
 */
export const listExtensibleSourceServers: {
  (
    input: ListExtensibleSourceServersRequest,
  ): Effect.Effect<
    ListExtensibleSourceServersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExtensibleSourceServersRequest,
  ) => Stream.Stream<
    ListExtensibleSourceServersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExtensibleSourceServersRequest,
  ) => Stream.Stream<
    StagingSourceServer,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExtensibleSourceServersRequest,
  output: ListExtensibleSourceServersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns an array of staging accounts for existing extended source servers.
 */
export const listStagingAccounts: {
  (
    input: ListStagingAccountsRequest,
  ): Effect.Effect<
    ListStagingAccountsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStagingAccountsRequest,
  ) => Stream.Stream<
    ListStagingAccountsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStagingAccountsRequest,
  ) => Stream.Stream<
    Account,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStagingAccountsRequest,
  output: ListStagingAccountsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "accounts",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of Jobs. Use the JobsID and fromDate and toDate filters to limit which jobs are returned. The response is sorted by creationDataTime - latest date first. Jobs are created by the StartRecovery, TerminateRecoveryInstances and StartFailbackLaunch APIs. Jobs are also created by DiagnosticLaunch and TerminateDiagnosticInstances, which are APIs available only to *Support* and only used in response to relevant support tickets.
 */
export const describeJobs: {
  (
    input: DescribeJobsRequest,
  ): Effect.Effect<
    DescribeJobsResponse,
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeJobsRequest,
  ) => Stream.Stream<
    DescribeJobsResponse,
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeJobsRequest,
  ) => Stream.Stream<
    Job,
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeJobsRequest,
  output: DescribeJobsResponse,
  errors: [
    InternalServerException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates an existing Launch Configuration Template by ID.
 */
export const updateLaunchConfigurationTemplate: (
  input: UpdateLaunchConfigurationTemplateRequest,
) => Effect.Effect<
  UpdateLaunchConfigurationTemplateResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLaunchConfigurationTemplateRequest,
  output: UpdateLaunchConfigurationTemplateResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Lists all Source Networks or multiple Source Networks filtered by ID.
 */
export const describeSourceNetworks: {
  (
    input: DescribeSourceNetworksRequest,
  ): Effect.Effect<
    DescribeSourceNetworksResponse,
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSourceNetworksRequest,
  ) => Stream.Stream<
    DescribeSourceNetworksResponse,
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSourceNetworksRequest,
  ) => Stream.Stream<
    SourceNetwork,
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSourceNetworksRequest,
  output: DescribeSourceNetworksResponse,
  errors: [
    InternalServerException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deploy VPC for the specified Source Network and modify launch templates to use this network. The VPC will be deployed using a dedicated CloudFormation stack.
 */
export const startSourceNetworkRecovery: (
  input: StartSourceNetworkRecoveryRequest,
) => Effect.Effect<
  StartSourceNetworkRecoveryResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSourceNetworkRecoveryRequest,
  output: StartSourceNetworkRecoveryResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Lists all Source Servers or multiple Source Servers filtered by ID.
 */
export const describeSourceServers: {
  (
    input: DescribeSourceServersRequest,
  ): Effect.Effect<
    DescribeSourceServersResponse,
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSourceServersRequest,
  ) => Stream.Stream<
    DescribeSourceServersResponse,
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSourceServersRequest,
  ) => Stream.Stream<
    SourceServer,
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSourceServersRequest,
  output: DescribeSourceServersResponse,
  errors: [
    InternalServerException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Puts a resource launch action.
 */
export const putLaunchAction: (
  input: PutLaunchActionRequest,
) => Effect.Effect<
  PutLaunchActionResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLaunchActionRequest,
  output: PutLaunchActionResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Lists all Recovery Snapshots for a single Source Server.
 */
export const describeRecoverySnapshots: {
  (
    input: DescribeRecoverySnapshotsRequest,
  ): Effect.Effect<
    DescribeRecoverySnapshotsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRecoverySnapshotsRequest,
  ) => Stream.Stream<
    DescribeRecoverySnapshotsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRecoverySnapshotsRequest,
  ) => Stream.Stream<
    RecoverySnapshot,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRecoverySnapshotsRequest,
  output: DescribeRecoverySnapshotsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Initiates a Job for launching the machine that is being failed back to from the specified Recovery Instance. This will run conversion on the failback client and will reboot your machine, thus completing the failback process.
 */
export const startFailbackLaunch: (
  input: StartFailbackLaunchRequest,
) => Effect.Effect<
  StartFailbackLaunchResponse,
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | UninitializedAccountException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFailbackLaunchRequest,
  output: StartFailbackLaunchResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
}));
/**
 * Retrieves a detailed Job log with pagination.
 */
export const describeJobLogItems: {
  (
    input: DescribeJobLogItemsRequest,
  ): Effect.Effect<
    DescribeJobLogItemsResponse,
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeJobLogItemsRequest,
  ) => Stream.Stream<
    DescribeJobLogItemsResponse,
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeJobLogItemsRequest,
  ) => Stream.Stream<
    JobLog,
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeJobLogItemsRequest,
  output: DescribeJobLogItemsResponse,
  errors: [
    InternalServerException,
    ThrottlingException,
    UninitializedAccountException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all Recovery Instances or multiple Recovery Instances by ID.
 */
export const describeRecoveryInstances: {
  (
    input: DescribeRecoveryInstancesRequest,
  ): Effect.Effect<
    DescribeRecoveryInstancesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRecoveryInstancesRequest,
  ) => Stream.Stream<
    DescribeRecoveryInstancesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRecoveryInstancesRequest,
  ) => Stream.Stream<
    RecoveryInstance,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | UninitializedAccountException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRecoveryInstancesRequest,
  output: DescribeRecoveryInstancesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    UninitializedAccountException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
