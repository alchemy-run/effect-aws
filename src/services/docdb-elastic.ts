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
const svc = T.AwsApiService({
  sdkId: "DocDB Elastic",
  serviceShapeName: "ChimeraDbLionfishServiceLambda",
});
const auth = T.AwsAuthSigv4({ name: "docdb-elastic" });
const ver = T.ServiceVersion("2022-11-28");
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
              `https://docdb-elastic-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://docdb-elastic-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://docdb-elastic.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://docdb-elastic.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type InputString = string;
export type OptInType = string;
export type Auth = string;
export type Password = string | redacted.Redacted<string>;
export type PaginationToken = string;
export type Arn = string;
export type TagKey = string;
export type TagValue = string;
export type Status = string;
export type SnapshotType = string;
export type ValidationExceptionReason = string;

//# Schemas
export type StringList = string[];
export const StringList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface ApplyPendingMaintenanceActionInput {
  resourceArn: string;
  applyAction: string;
  optInType: string;
  applyOn?: string;
}
export const ApplyPendingMaintenanceActionInput = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    applyAction: S.String,
    optInType: S.String,
    applyOn: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/pending-action" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ApplyPendingMaintenanceActionInput",
}) as any as S.Schema<ApplyPendingMaintenanceActionInput>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface CreateClusterInput {
  clusterName: string;
  authType: string;
  adminUserName: string;
  adminUserPassword: string | redacted.Redacted<string>;
  shardCapacity: number;
  shardCount: number;
  vpcSecurityGroupIds?: string[];
  subnetIds?: string[];
  kmsKeyId?: string;
  clientToken?: string;
  preferredMaintenanceWindow?: string;
  tags?: { [key: string]: string };
  backupRetentionPeriod?: number;
  preferredBackupWindow?: string;
  shardInstanceCount?: number;
}
export const CreateClusterInput = S.suspend(() =>
  S.Struct({
    clusterName: S.String,
    authType: S.String,
    adminUserName: S.String,
    adminUserPassword: SensitiveString,
    shardCapacity: S.Number,
    shardCount: S.Number,
    vpcSecurityGroupIds: S.optional(StringList),
    subnetIds: S.optional(StringList),
    kmsKeyId: S.optional(S.String),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    preferredMaintenanceWindow: S.optional(S.String),
    tags: S.optional(TagMap),
    backupRetentionPeriod: S.optional(S.Number),
    preferredBackupWindow: S.optional(S.String),
    shardInstanceCount: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cluster" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateClusterInput",
}) as any as S.Schema<CreateClusterInput>;
export interface CreateClusterSnapshotInput {
  clusterArn: string;
  snapshotName: string;
  tags?: { [key: string]: string };
}
export const CreateClusterSnapshotInput = S.suspend(() =>
  S.Struct({
    clusterArn: S.String,
    snapshotName: S.String,
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cluster-snapshot" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateClusterSnapshotInput",
}) as any as S.Schema<CreateClusterSnapshotInput>;
export interface DeleteClusterInput {
  clusterArn: string;
}
export const DeleteClusterInput = S.suspend(() =>
  S.Struct({ clusterArn: S.String.pipe(T.HttpLabel("clusterArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/cluster/{clusterArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClusterInput",
}) as any as S.Schema<DeleteClusterInput>;
export interface DeleteClusterSnapshotInput {
  snapshotArn: string;
}
export const DeleteClusterSnapshotInput = S.suspend(() =>
  S.Struct({ snapshotArn: S.String.pipe(T.HttpLabel("snapshotArn")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/cluster-snapshot/{snapshotArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteClusterSnapshotInput",
}) as any as S.Schema<DeleteClusterSnapshotInput>;
export interface GetClusterInput {
  clusterArn: string;
}
export const GetClusterInput = S.suspend(() =>
  S.Struct({ clusterArn: S.String.pipe(T.HttpLabel("clusterArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cluster/{clusterArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetClusterInput",
}) as any as S.Schema<GetClusterInput>;
export interface GetClusterSnapshotInput {
  snapshotArn: string;
}
export const GetClusterSnapshotInput = S.suspend(() =>
  S.Struct({ snapshotArn: S.String.pipe(T.HttpLabel("snapshotArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cluster-snapshot/{snapshotArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetClusterSnapshotInput",
}) as any as S.Schema<GetClusterSnapshotInput>;
export interface GetPendingMaintenanceActionInput {
  resourceArn: string;
}
export const GetPendingMaintenanceActionInput = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/pending-action/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPendingMaintenanceActionInput",
}) as any as S.Schema<GetPendingMaintenanceActionInput>;
export interface ListClustersInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListClustersInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/clusters" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClustersInput",
}) as any as S.Schema<ListClustersInput>;
export interface ListClusterSnapshotsInput {
  clusterArn?: string;
  nextToken?: string;
  maxResults?: number;
  snapshotType?: string;
}
export const ListClusterSnapshotsInput = S.suspend(() =>
  S.Struct({
    clusterArn: S.optional(S.String).pipe(T.HttpQuery("clusterArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    snapshotType: S.optional(S.String).pipe(T.HttpQuery("snapshotType")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cluster-snapshots" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListClusterSnapshotsInput",
}) as any as S.Schema<ListClusterSnapshotsInput>;
export interface ListPendingMaintenanceActionsInput {
  nextToken?: string;
  maxResults?: number;
}
export const ListPendingMaintenanceActionsInput = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/pending-actions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListPendingMaintenanceActionsInput",
}) as any as S.Schema<ListPendingMaintenanceActionsInput>;
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
export interface RestoreClusterFromSnapshotInput {
  clusterName: string;
  snapshotArn: string;
  vpcSecurityGroupIds?: string[];
  subnetIds?: string[];
  kmsKeyId?: string;
  tags?: { [key: string]: string };
  shardCapacity?: number;
  shardInstanceCount?: number;
}
export const RestoreClusterFromSnapshotInput = S.suspend(() =>
  S.Struct({
    clusterName: S.String,
    snapshotArn: S.String.pipe(T.HttpLabel("snapshotArn")),
    vpcSecurityGroupIds: S.optional(StringList),
    subnetIds: S.optional(StringList),
    kmsKeyId: S.optional(S.String),
    tags: S.optional(TagMap),
    shardCapacity: S.optional(S.Number),
    shardInstanceCount: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/cluster-snapshot/{snapshotArn}/restore",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RestoreClusterFromSnapshotInput",
}) as any as S.Schema<RestoreClusterFromSnapshotInput>;
export interface StartClusterInput {
  clusterArn: string;
}
export const StartClusterInput = S.suspend(() =>
  S.Struct({ clusterArn: S.String.pipe(T.HttpLabel("clusterArn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cluster/{clusterArn}/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartClusterInput",
}) as any as S.Schema<StartClusterInput>;
export interface StopClusterInput {
  clusterArn: string;
}
export const StopClusterInput = S.suspend(() =>
  S.Struct({ clusterArn: S.String.pipe(T.HttpLabel("clusterArn")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cluster/{clusterArn}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopClusterInput",
}) as any as S.Schema<StopClusterInput>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
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
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
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
export interface UpdateClusterInput {
  clusterArn: string;
  authType?: string;
  shardCapacity?: number;
  shardCount?: number;
  vpcSecurityGroupIds?: string[];
  subnetIds?: string[];
  adminUserPassword?: string | redacted.Redacted<string>;
  clientToken?: string;
  preferredMaintenanceWindow?: string;
  backupRetentionPeriod?: number;
  preferredBackupWindow?: string;
  shardInstanceCount?: number;
}
export const UpdateClusterInput = S.suspend(() =>
  S.Struct({
    clusterArn: S.String.pipe(T.HttpLabel("clusterArn")),
    authType: S.optional(S.String),
    shardCapacity: S.optional(S.Number),
    shardCount: S.optional(S.Number),
    vpcSecurityGroupIds: S.optional(StringList),
    subnetIds: S.optional(StringList),
    adminUserPassword: S.optional(SensitiveString),
    clientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    preferredMaintenanceWindow: S.optional(S.String),
    backupRetentionPeriod: S.optional(S.Number),
    preferredBackupWindow: S.optional(S.String),
    shardInstanceCount: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/cluster/{clusterArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateClusterInput",
}) as any as S.Schema<UpdateClusterInput>;
export interface PendingMaintenanceActionDetails {
  action: string;
  autoAppliedAfterDate?: string;
  forcedApplyDate?: string;
  optInStatus?: string;
  currentApplyDate?: string;
  description?: string;
}
export const PendingMaintenanceActionDetails = S.suspend(() =>
  S.Struct({
    action: S.String,
    autoAppliedAfterDate: S.optional(S.String),
    forcedApplyDate: S.optional(S.String),
    optInStatus: S.optional(S.String),
    currentApplyDate: S.optional(S.String),
    description: S.optional(S.String),
  }),
).annotations({
  identifier: "PendingMaintenanceActionDetails",
}) as any as S.Schema<PendingMaintenanceActionDetails>;
export type PendingMaintenanceActionDetailsList =
  PendingMaintenanceActionDetails[];
export const PendingMaintenanceActionDetailsList = S.Array(
  PendingMaintenanceActionDetails,
);
export interface ResourcePendingMaintenanceAction {
  resourceArn?: string;
  pendingMaintenanceActionDetails?: PendingMaintenanceActionDetails[];
}
export const ResourcePendingMaintenanceAction = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    pendingMaintenanceActionDetails: S.optional(
      PendingMaintenanceActionDetailsList,
    ),
  }),
).annotations({
  identifier: "ResourcePendingMaintenanceAction",
}) as any as S.Schema<ResourcePendingMaintenanceAction>;
export type ResourcePendingMaintenanceActionList =
  ResourcePendingMaintenanceAction[];
export const ResourcePendingMaintenanceActionList = S.Array(
  ResourcePendingMaintenanceAction,
);
export interface CopyClusterSnapshotInput {
  snapshotArn: string;
  targetSnapshotName: string;
  kmsKeyId?: string;
  copyTags?: boolean;
  tags?: { [key: string]: string };
}
export const CopyClusterSnapshotInput = S.suspend(() =>
  S.Struct({
    snapshotArn: S.String.pipe(T.HttpLabel("snapshotArn")),
    targetSnapshotName: S.String,
    kmsKeyId: S.optional(S.String),
    copyTags: S.optional(S.Boolean),
    tags: S.optional(TagMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/cluster-snapshot/{snapshotArn}/copy" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CopyClusterSnapshotInput",
}) as any as S.Schema<CopyClusterSnapshotInput>;
export interface Shard {
  shardId: string;
  createTime: string;
  status: string;
}
export const Shard = S.suspend(() =>
  S.Struct({ shardId: S.String, createTime: S.String, status: S.String }),
).annotations({ identifier: "Shard" }) as any as S.Schema<Shard>;
export type ShardList = Shard[];
export const ShardList = S.Array(Shard);
export interface Cluster {
  clusterName: string;
  clusterArn: string;
  status: string;
  clusterEndpoint: string;
  createTime: string;
  adminUserName: string;
  authType: string;
  shardCapacity: number;
  shardCount: number;
  vpcSecurityGroupIds: string[];
  subnetIds: string[];
  preferredMaintenanceWindow: string;
  kmsKeyId: string;
  shards?: Shard[];
  backupRetentionPeriod?: number;
  preferredBackupWindow?: string;
  shardInstanceCount?: number;
}
export const Cluster = S.suspend(() =>
  S.Struct({
    clusterName: S.String,
    clusterArn: S.String,
    status: S.String,
    clusterEndpoint: S.String,
    createTime: S.String,
    adminUserName: S.String,
    authType: S.String,
    shardCapacity: S.Number,
    shardCount: S.Number,
    vpcSecurityGroupIds: StringList,
    subnetIds: StringList,
    preferredMaintenanceWindow: S.String,
    kmsKeyId: S.String,
    shards: S.optional(ShardList),
    backupRetentionPeriod: S.optional(S.Number),
    preferredBackupWindow: S.optional(S.String),
    shardInstanceCount: S.optional(S.Number),
  }),
).annotations({ identifier: "Cluster" }) as any as S.Schema<Cluster>;
export interface DeleteClusterOutput {
  cluster: Cluster;
}
export const DeleteClusterOutput = S.suspend(() =>
  S.Struct({ cluster: Cluster }),
).annotations({
  identifier: "DeleteClusterOutput",
}) as any as S.Schema<DeleteClusterOutput>;
export interface ClusterSnapshot {
  subnetIds: string[];
  snapshotName: string;
  snapshotArn: string;
  snapshotCreationTime: string;
  clusterArn: string;
  clusterCreationTime: string;
  status: string;
  vpcSecurityGroupIds: string[];
  adminUserName: string;
  kmsKeyId: string;
  snapshotType?: string;
}
export const ClusterSnapshot = S.suspend(() =>
  S.Struct({
    subnetIds: StringList,
    snapshotName: S.String,
    snapshotArn: S.String,
    snapshotCreationTime: S.String,
    clusterArn: S.String,
    clusterCreationTime: S.String,
    status: S.String,
    vpcSecurityGroupIds: StringList,
    adminUserName: S.String,
    kmsKeyId: S.String,
    snapshotType: S.optional(S.String),
  }),
).annotations({
  identifier: "ClusterSnapshot",
}) as any as S.Schema<ClusterSnapshot>;
export interface DeleteClusterSnapshotOutput {
  snapshot: ClusterSnapshot;
}
export const DeleteClusterSnapshotOutput = S.suspend(() =>
  S.Struct({ snapshot: ClusterSnapshot }),
).annotations({
  identifier: "DeleteClusterSnapshotOutput",
}) as any as S.Schema<DeleteClusterSnapshotOutput>;
export interface GetClusterOutput {
  cluster: Cluster;
}
export const GetClusterOutput = S.suspend(() =>
  S.Struct({ cluster: Cluster }),
).annotations({
  identifier: "GetClusterOutput",
}) as any as S.Schema<GetClusterOutput>;
export interface GetClusterSnapshotOutput {
  snapshot: ClusterSnapshot;
}
export const GetClusterSnapshotOutput = S.suspend(() =>
  S.Struct({ snapshot: ClusterSnapshot }),
).annotations({
  identifier: "GetClusterSnapshotOutput",
}) as any as S.Schema<GetClusterSnapshotOutput>;
export interface GetPendingMaintenanceActionOutput {
  resourcePendingMaintenanceAction: ResourcePendingMaintenanceAction;
}
export const GetPendingMaintenanceActionOutput = S.suspend(() =>
  S.Struct({
    resourcePendingMaintenanceAction: ResourcePendingMaintenanceAction,
  }),
).annotations({
  identifier: "GetPendingMaintenanceActionOutput",
}) as any as S.Schema<GetPendingMaintenanceActionOutput>;
export interface ListPendingMaintenanceActionsOutput {
  resourcePendingMaintenanceActions: ResourcePendingMaintenanceAction[];
  nextToken?: string;
}
export const ListPendingMaintenanceActionsOutput = S.suspend(() =>
  S.Struct({
    resourcePendingMaintenanceActions: ResourcePendingMaintenanceActionList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPendingMaintenanceActionsOutput",
}) as any as S.Schema<ListPendingMaintenanceActionsOutput>;
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RestoreClusterFromSnapshotOutput {
  cluster: Cluster;
}
export const RestoreClusterFromSnapshotOutput = S.suspend(() =>
  S.Struct({ cluster: Cluster }),
).annotations({
  identifier: "RestoreClusterFromSnapshotOutput",
}) as any as S.Schema<RestoreClusterFromSnapshotOutput>;
export interface StartClusterOutput {
  cluster: Cluster;
}
export const StartClusterOutput = S.suspend(() =>
  S.Struct({ cluster: Cluster }),
).annotations({
  identifier: "StartClusterOutput",
}) as any as S.Schema<StartClusterOutput>;
export interface StopClusterOutput {
  cluster: Cluster;
}
export const StopClusterOutput = S.suspend(() =>
  S.Struct({ cluster: Cluster }),
).annotations({
  identifier: "StopClusterOutput",
}) as any as S.Schema<StopClusterOutput>;
export interface UpdateClusterOutput {
  cluster: Cluster;
}
export const UpdateClusterOutput = S.suspend(() =>
  S.Struct({ cluster: Cluster }),
).annotations({
  identifier: "UpdateClusterOutput",
}) as any as S.Schema<UpdateClusterOutput>;
export interface ClusterInList {
  clusterName: string;
  clusterArn: string;
  status: string;
}
export const ClusterInList = S.suspend(() =>
  S.Struct({ clusterName: S.String, clusterArn: S.String, status: S.String }),
).annotations({
  identifier: "ClusterInList",
}) as any as S.Schema<ClusterInList>;
export type ClusterList = ClusterInList[];
export const ClusterList = S.Array(ClusterInList);
export interface ClusterSnapshotInList {
  snapshotName: string;
  snapshotArn: string;
  clusterArn: string;
  status: string;
  snapshotCreationTime: string;
}
export const ClusterSnapshotInList = S.suspend(() =>
  S.Struct({
    snapshotName: S.String,
    snapshotArn: S.String,
    clusterArn: S.String,
    status: S.String,
    snapshotCreationTime: S.String,
  }),
).annotations({
  identifier: "ClusterSnapshotInList",
}) as any as S.Schema<ClusterSnapshotInList>;
export type ClusterSnapshotList = ClusterSnapshotInList[];
export const ClusterSnapshotList = S.Array(ClusterSnapshotInList);
export interface CopyClusterSnapshotOutput {
  snapshot: ClusterSnapshot;
}
export const CopyClusterSnapshotOutput = S.suspend(() =>
  S.Struct({ snapshot: ClusterSnapshot }),
).annotations({
  identifier: "CopyClusterSnapshotOutput",
}) as any as S.Schema<CopyClusterSnapshotOutput>;
export interface CreateClusterSnapshotOutput {
  snapshot: ClusterSnapshot;
}
export const CreateClusterSnapshotOutput = S.suspend(() =>
  S.Struct({ snapshot: ClusterSnapshot }),
).annotations({
  identifier: "CreateClusterSnapshotOutput",
}) as any as S.Schema<CreateClusterSnapshotOutput>;
export interface ListClustersOutput {
  clusters?: ClusterInList[];
  nextToken?: string;
}
export const ListClustersOutput = S.suspend(() =>
  S.Struct({
    clusters: S.optional(ClusterList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListClustersOutput",
}) as any as S.Schema<ListClustersOutput>;
export interface ListClusterSnapshotsOutput {
  snapshots?: ClusterSnapshotInList[];
  nextToken?: string;
}
export const ListClusterSnapshotsOutput = S.suspend(() =>
  S.Struct({
    snapshots: S.optional(ClusterSnapshotList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListClusterSnapshotsOutput",
}) as any as S.Schema<ListClusterSnapshotsOutput>;
export interface ApplyPendingMaintenanceActionOutput {
  resourcePendingMaintenanceAction: ResourcePendingMaintenanceAction;
}
export const ApplyPendingMaintenanceActionOutput = S.suspend(() =>
  S.Struct({
    resourcePendingMaintenanceAction: ResourcePendingMaintenanceAction,
  }),
).annotations({
  identifier: "ApplyPendingMaintenanceActionOutput",
}) as any as S.Schema<ApplyPendingMaintenanceActionOutput>;
export interface CreateClusterOutput {
  cluster: Cluster;
}
export const CreateClusterOutput = S.suspend(() =>
  S.Struct({ cluster: Cluster }),
).annotations({
  identifier: "CreateClusterOutput",
}) as any as S.Schema<CreateClusterOutput>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns information about provisioned Amazon DocumentDB elastic clusters.
 */
export const listClusters: {
  (
    input: ListClustersInput,
  ): effect.Effect<
    ListClustersOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClustersInput,
  ) => stream.Stream<
    ListClustersOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClustersInput,
  ) => stream.Stream<
    ClusterInList,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClustersInput,
  output: ListClustersOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "clusters",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Delete an elastic cluster snapshot.
 */
export const deleteClusterSnapshot: (
  input: DeleteClusterSnapshotInput,
) => effect.Effect<
  DeleteClusterSnapshotOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterSnapshotInput,
  output: DeleteClusterSnapshotOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves all maintenance actions that are pending.
 */
export const getPendingMaintenanceAction: (
  input: GetPendingMaintenanceActionInput,
) => effect.Effect<
  GetPendingMaintenanceActionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPendingMaintenanceActionInput,
  output: GetPendingMaintenanceActionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Modifies an elastic cluster. This includes updating admin-username/password,
 * upgrading the API version, and setting up a backup window and maintenance window
 */
export const updateCluster: (
  input: UpdateClusterInput,
) => effect.Effect<
  UpdateClusterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterInput,
  output: UpdateClusterOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * The type of pending maintenance action to be applied to the resource.
 */
export const applyPendingMaintenanceAction: (
  input: ApplyPendingMaintenanceActionInput,
) => effect.Effect<
  ApplyPendingMaintenanceActionOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ApplyPendingMaintenanceActionInput,
  output: ApplyPendingMaintenanceActionOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about snapshots for a specified elastic cluster.
 */
export const listClusterSnapshots: {
  (
    input: ListClusterSnapshotsInput,
  ): effect.Effect<
    ListClusterSnapshotsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClusterSnapshotsInput,
  ) => stream.Stream<
    ListClusterSnapshotsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClusterSnapshotsInput,
  ) => stream.Stream<
    ClusterSnapshotInList,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListClusterSnapshotsInput,
  output: ListClusterSnapshotsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "snapshots",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Adds metadata tags to an elastic cluster resource
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specific elastic cluster.
 */
export const getCluster: (
  input: GetClusterInput,
) => effect.Effect<
  GetClusterOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterInput,
  output: GetClusterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about a specific elastic cluster snapshot
 */
export const getClusterSnapshot: (
  input: GetClusterSnapshotInput,
) => effect.Effect<
  GetClusterSnapshotOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterSnapshotInput,
  output: GetClusterSnapshotOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of all maintenance actions that are pending.
 */
export const listPendingMaintenanceActions: {
  (
    input: ListPendingMaintenanceActionsInput,
  ): effect.Effect<
    ListPendingMaintenanceActionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPendingMaintenanceActionsInput,
  ) => stream.Stream<
    ListPendingMaintenanceActionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPendingMaintenanceActionsInput,
  ) => stream.Stream<
    ResourcePendingMaintenanceAction,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPendingMaintenanceActionsInput,
  output: ListPendingMaintenanceActionsOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "resourcePendingMaintenanceActions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Restarts the stopped elastic cluster that is specified by `clusterARN`.
 */
export const startCluster: (
  input: StartClusterInput,
) => effect.Effect<
  StartClusterOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartClusterInput,
  output: StartClusterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Stops the running elastic cluster that is specified by `clusterArn`.
 * The elastic cluster must be in the *available* state.
 */
export const stopCluster: (
  input: StopClusterInput,
) => effect.Effect<
  StopClusterOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopClusterInput,
  output: StopClusterOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes metadata tags from an elastic cluster resource
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all tags on a elastic cluster resource
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
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
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Delete an elastic cluster.
 */
export const deleteCluster: (
  input: DeleteClusterInput,
) => effect.Effect<
  DeleteClusterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterInput,
  output: DeleteClusterOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Restores an elastic cluster from a snapshot.
 */
export const restoreClusterFromSnapshot: (
  input: RestoreClusterFromSnapshotInput,
) => effect.Effect<
  RestoreClusterFromSnapshotOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreClusterFromSnapshotInput,
  output: RestoreClusterFromSnapshotOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Copies a snapshot of an elastic cluster.
 */
export const copyClusterSnapshot: (
  input: CopyClusterSnapshotInput,
) => effect.Effect<
  CopyClusterSnapshotOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyClusterSnapshotInput,
  output: CopyClusterSnapshotOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a snapshot of an elastic cluster.
 */
export const createClusterSnapshot: (
  input: CreateClusterSnapshotInput,
) => effect.Effect<
  CreateClusterSnapshotOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterSnapshotInput,
  output: CreateClusterSnapshotOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new Amazon DocumentDB elastic cluster and returns its cluster structure.
 */
export const createCluster: (
  input: CreateClusterInput,
) => effect.Effect<
  CreateClusterOutput,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterInput,
  output: CreateClusterOutput,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
