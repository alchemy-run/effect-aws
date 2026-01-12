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
  sdkId: "EFS",
  serviceShapeName: "MagnolioAPIService_v20150201",
});
const auth = T.AwsAuthSigv4({ name: "elasticfilesystem" });
const ver = T.ServiceVersion("2015-02-01");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://efs.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://efs-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://efs.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://efs-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            `https://efs.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-us-gov" &&
          UseFIPS === true &&
          UseDualStack === true
        ) {
          return e(
            `https://efs-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://elasticfilesystem-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://elasticfilesystem-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://elasticfilesystem.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://elasticfilesystem.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ClientToken = string;
export type FileSystemId = string;
export type CreationToken = string;
export type Encrypted = boolean;
export type KmsKeyId = string;
export type ProvisionedThroughputInMibps = number;
export type AvailabilityZoneName = string;
export type Backup = boolean;
export type SubnetId = string;
export type IpAddress = string;
export type Ipv6Address = string;
export type SecurityGroup = string;
export type AccessPointId = string;
export type MountTargetId = string;
export type TagKey = string;
export type MaxResults = number;
export type Token = string;
export type MaxItems = number;
export type Marker = string;
export type ResourceId = string;
export type Policy = string;
export type BypassPolicyLockoutSafetyCheck = boolean;
export type TagValue = string;
export type Uid = number;
export type Gid = number;
export type Path = string;
export type RegionName = string;
export type RoleArn = string;
export type AwsAccountId = string;
export type FileSystemArn = string;
export type MountTargetCount = number;
export type AvailabilityZoneId = string;
export type NetworkInterfaceId = string;
export type VpcId = string;
export type ErrorCode = string;
export type ErrorMessage = string;
export type OwnerUid = number;
export type OwnerGid = number;
export type Permissions = string;
export type FileSystemSizeValue = number;
export type FileSystemNullableSizeValue = number;
export type Name = string;
export type AccessPointArn = string;
export type StatusMessage = string;

//# Schemas
export type PerformanceMode = "generalPurpose" | "maxIO" | (string & {});
export const PerformanceMode = S.String;
export type ThroughputMode =
  | "bursting"
  | "provisioned"
  | "elastic"
  | (string & {});
export const ThroughputMode = S.String;
export type IpAddressType =
  | "IPV4_ONLY"
  | "IPV6_ONLY"
  | "DUAL_STACK"
  | (string & {});
export const IpAddressType = S.String;
export type SecurityGroups = string[];
export const SecurityGroups = S.Array(S.String);
export type DeletionMode =
  | "ALL_CONFIGURATIONS"
  | "LOCAL_CONFIGURATION_ONLY"
  | (string & {});
export const DeletionMode = S.String;
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type ResourceIdType = "LONG_ID" | "SHORT_ID" | (string & {});
export const ResourceIdType = S.String;
export type ReplicationOverwriteProtection =
  | "ENABLED"
  | "DISABLED"
  | "REPLICATING"
  | (string & {});
export const ReplicationOverwriteProtection = S.String;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreateFileSystemRequest {
  CreationToken: string;
  PerformanceMode?: PerformanceMode;
  Encrypted?: boolean;
  KmsKeyId?: string;
  ThroughputMode?: ThroughputMode;
  ProvisionedThroughputInMibps?: number;
  AvailabilityZoneName?: string;
  Backup?: boolean;
  Tags?: Tag[];
}
export const CreateFileSystemRequest = S.suspend(() =>
  S.Struct({
    CreationToken: S.String.pipe(T.IdempotencyToken()),
    PerformanceMode: S.optional(PerformanceMode),
    Encrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    ThroughputMode: S.optional(ThroughputMode),
    ProvisionedThroughputInMibps: S.optional(S.Number),
    AvailabilityZoneName: S.optional(S.String),
    Backup: S.optional(S.Boolean),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2015-02-01/file-systems" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateFileSystemRequest",
}) as any as S.Schema<CreateFileSystemRequest>;
export interface CreateMountTargetRequest {
  FileSystemId: string;
  SubnetId: string;
  IpAddress?: string;
  Ipv6Address?: string;
  IpAddressType?: IpAddressType;
  SecurityGroups?: string[];
}
export const CreateMountTargetRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String,
    SubnetId: S.String,
    IpAddress: S.optional(S.String),
    Ipv6Address: S.optional(S.String),
    IpAddressType: S.optional(IpAddressType),
    SecurityGroups: S.optional(SecurityGroups),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2015-02-01/mount-targets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateMountTargetRequest",
}) as any as S.Schema<CreateMountTargetRequest>;
export interface CreateTagsRequest {
  FileSystemId: string;
  Tags: Tag[];
}
export const CreateTagsRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")),
    Tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2015-02-01/create-tags/{FileSystemId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTagsRequest",
}) as any as S.Schema<CreateTagsRequest>;
export interface CreateTagsResponse {}
export const CreateTagsResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateTagsResponse",
}) as any as S.Schema<CreateTagsResponse>;
export interface DeleteAccessPointRequest {
  AccessPointId: string;
}
export const DeleteAccessPointRequest = S.suspend(() =>
  S.Struct({ AccessPointId: S.String.pipe(T.HttpLabel("AccessPointId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2015-02-01/access-points/{AccessPointId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteAccessPointRequest",
}) as any as S.Schema<DeleteAccessPointRequest>;
export interface DeleteAccessPointResponse {}
export const DeleteAccessPointResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAccessPointResponse",
}) as any as S.Schema<DeleteAccessPointResponse>;
export interface DeleteFileSystemRequest {
  FileSystemId: string;
}
export const DeleteFileSystemRequest = S.suspend(() =>
  S.Struct({ FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2015-02-01/file-systems/{FileSystemId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFileSystemRequest",
}) as any as S.Schema<DeleteFileSystemRequest>;
export interface DeleteFileSystemResponse {}
export const DeleteFileSystemResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFileSystemResponse",
}) as any as S.Schema<DeleteFileSystemResponse>;
export interface DeleteFileSystemPolicyRequest {
  FileSystemId: string;
}
export const DeleteFileSystemPolicyRequest = S.suspend(() =>
  S.Struct({ FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2015-02-01/file-systems/{FileSystemId}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteFileSystemPolicyRequest",
}) as any as S.Schema<DeleteFileSystemPolicyRequest>;
export interface DeleteFileSystemPolicyResponse {}
export const DeleteFileSystemPolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteFileSystemPolicyResponse",
}) as any as S.Schema<DeleteFileSystemPolicyResponse>;
export interface DeleteMountTargetRequest {
  MountTargetId: string;
}
export const DeleteMountTargetRequest = S.suspend(() =>
  S.Struct({ MountTargetId: S.String.pipe(T.HttpLabel("MountTargetId")) }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2015-02-01/mount-targets/{MountTargetId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteMountTargetRequest",
}) as any as S.Schema<DeleteMountTargetRequest>;
export interface DeleteMountTargetResponse {}
export const DeleteMountTargetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteMountTargetResponse",
}) as any as S.Schema<DeleteMountTargetResponse>;
export interface DeleteReplicationConfigurationRequest {
  SourceFileSystemId: string;
  DeletionMode?: DeletionMode;
}
export const DeleteReplicationConfigurationRequest = S.suspend(() =>
  S.Struct({
    SourceFileSystemId: S.String.pipe(T.HttpLabel("SourceFileSystemId")),
    DeletionMode: S.optional(DeletionMode).pipe(T.HttpQuery("deletionMode")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2015-02-01/file-systems/{SourceFileSystemId}/replication-configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteReplicationConfigurationRequest",
}) as any as S.Schema<DeleteReplicationConfigurationRequest>;
export interface DeleteReplicationConfigurationResponse {}
export const DeleteReplicationConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteReplicationConfigurationResponse",
}) as any as S.Schema<DeleteReplicationConfigurationResponse>;
export interface DeleteTagsRequest {
  FileSystemId: string;
  TagKeys: string[];
}
export const DeleteTagsRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")),
    TagKeys: TagKeys,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2015-02-01/delete-tags/{FileSystemId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteTagsRequest",
}) as any as S.Schema<DeleteTagsRequest>;
export interface DeleteTagsResponse {}
export const DeleteTagsResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteTagsResponse",
}) as any as S.Schema<DeleteTagsResponse>;
export interface DescribeAccessPointsRequest {
  MaxResults?: number;
  NextToken?: string;
  AccessPointId?: string;
  FileSystemId?: string;
}
export const DescribeAccessPointsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    AccessPointId: S.optional(S.String).pipe(T.HttpQuery("AccessPointId")),
    FileSystemId: S.optional(S.String).pipe(T.HttpQuery("FileSystemId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2015-02-01/access-points" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAccessPointsRequest",
}) as any as S.Schema<DescribeAccessPointsRequest>;
export interface DescribeAccountPreferencesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeAccountPreferencesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2015-02-01/account-preferences" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAccountPreferencesRequest",
}) as any as S.Schema<DescribeAccountPreferencesRequest>;
export interface DescribeBackupPolicyRequest {
  FileSystemId: string;
}
export const DescribeBackupPolicyRequest = S.suspend(() =>
  S.Struct({ FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2015-02-01/file-systems/{FileSystemId}/backup-policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeBackupPolicyRequest",
}) as any as S.Schema<DescribeBackupPolicyRequest>;
export interface DescribeFileSystemPolicyRequest {
  FileSystemId: string;
}
export const DescribeFileSystemPolicyRequest = S.suspend(() =>
  S.Struct({ FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2015-02-01/file-systems/{FileSystemId}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeFileSystemPolicyRequest",
}) as any as S.Schema<DescribeFileSystemPolicyRequest>;
export interface DescribeFileSystemsRequest {
  MaxItems?: number;
  Marker?: string;
  CreationToken?: string;
  FileSystemId?: string;
}
export const DescribeFileSystemsRequest = S.suspend(() =>
  S.Struct({
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    CreationToken: S.optional(S.String).pipe(T.HttpQuery("CreationToken")),
    FileSystemId: S.optional(S.String).pipe(T.HttpQuery("FileSystemId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2015-02-01/file-systems" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeFileSystemsRequest",
}) as any as S.Schema<DescribeFileSystemsRequest>;
export interface DescribeLifecycleConfigurationRequest {
  FileSystemId: string;
}
export const DescribeLifecycleConfigurationRequest = S.suspend(() =>
  S.Struct({ FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2015-02-01/file-systems/{FileSystemId}/lifecycle-configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeLifecycleConfigurationRequest",
}) as any as S.Schema<DescribeLifecycleConfigurationRequest>;
export interface DescribeMountTargetsRequest {
  MaxItems?: number;
  Marker?: string;
  FileSystemId?: string;
  MountTargetId?: string;
  AccessPointId?: string;
}
export const DescribeMountTargetsRequest = S.suspend(() =>
  S.Struct({
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    FileSystemId: S.optional(S.String).pipe(T.HttpQuery("FileSystemId")),
    MountTargetId: S.optional(S.String).pipe(T.HttpQuery("MountTargetId")),
    AccessPointId: S.optional(S.String).pipe(T.HttpQuery("AccessPointId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2015-02-01/mount-targets" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMountTargetsRequest",
}) as any as S.Schema<DescribeMountTargetsRequest>;
export interface DescribeMountTargetSecurityGroupsRequest {
  MountTargetId: string;
}
export const DescribeMountTargetSecurityGroupsRequest = S.suspend(() =>
  S.Struct({ MountTargetId: S.String.pipe(T.HttpLabel("MountTargetId")) }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2015-02-01/mount-targets/{MountTargetId}/security-groups",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeMountTargetSecurityGroupsRequest",
}) as any as S.Schema<DescribeMountTargetSecurityGroupsRequest>;
export interface DescribeReplicationConfigurationsRequest {
  FileSystemId?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeReplicationConfigurationsRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.optional(S.String).pipe(T.HttpQuery("FileSystemId")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/2015-02-01/file-systems/replication-configurations",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReplicationConfigurationsRequest",
}) as any as S.Schema<DescribeReplicationConfigurationsRequest>;
export interface DescribeTagsRequest {
  MaxItems?: number;
  Marker?: string;
  FileSystemId: string;
}
export const DescribeTagsRequest = S.suspend(() =>
  S.Struct({
    MaxItems: S.optional(S.Number).pipe(T.HttpQuery("MaxItems")),
    Marker: S.optional(S.String).pipe(T.HttpQuery("Marker")),
    FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2015-02-01/tags/{FileSystemId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTagsRequest",
}) as any as S.Schema<DescribeTagsRequest>;
export interface ListTagsForResourceRequest {
  ResourceId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("MaxResults")),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/2015-02-01/resource-tags/{ResourceId}" }),
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
export interface ModifyMountTargetSecurityGroupsRequest {
  MountTargetId: string;
  SecurityGroups?: string[];
}
export const ModifyMountTargetSecurityGroupsRequest = S.suspend(() =>
  S.Struct({
    MountTargetId: S.String.pipe(T.HttpLabel("MountTargetId")),
    SecurityGroups: S.optional(SecurityGroups),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2015-02-01/mount-targets/{MountTargetId}/security-groups",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyMountTargetSecurityGroupsRequest",
}) as any as S.Schema<ModifyMountTargetSecurityGroupsRequest>;
export interface ModifyMountTargetSecurityGroupsResponse {}
export const ModifyMountTargetSecurityGroupsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ModifyMountTargetSecurityGroupsResponse",
}) as any as S.Schema<ModifyMountTargetSecurityGroupsResponse>;
export interface PutAccountPreferencesRequest {
  ResourceIdType: ResourceIdType;
}
export const PutAccountPreferencesRequest = S.suspend(() =>
  S.Struct({ ResourceIdType: ResourceIdType }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/2015-02-01/account-preferences" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAccountPreferencesRequest",
}) as any as S.Schema<PutAccountPreferencesRequest>;
export interface PutFileSystemPolicyRequest {
  FileSystemId: string;
  Policy: string;
  BypassPolicyLockoutSafetyCheck?: boolean;
}
export const PutFileSystemPolicyRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")),
    Policy: S.String,
    BypassPolicyLockoutSafetyCheck: S.optional(S.Boolean),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2015-02-01/file-systems/{FileSystemId}/policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutFileSystemPolicyRequest",
}) as any as S.Schema<PutFileSystemPolicyRequest>;
export interface TagResourceRequest {
  ResourceId: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    Tags: Tags,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2015-02-01/resource-tags/{ResourceId}" }),
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
  ResourceId: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceId: S.String.pipe(T.HttpLabel("ResourceId")),
    TagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/2015-02-01/resource-tags/{ResourceId}",
      }),
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
export interface UpdateFileSystemRequest {
  FileSystemId: string;
  ThroughputMode?: ThroughputMode;
  ProvisionedThroughputInMibps?: number;
}
export const UpdateFileSystemRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")),
    ThroughputMode: S.optional(ThroughputMode),
    ProvisionedThroughputInMibps: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/2015-02-01/file-systems/{FileSystemId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFileSystemRequest",
}) as any as S.Schema<UpdateFileSystemRequest>;
export interface UpdateFileSystemProtectionRequest {
  FileSystemId: string;
  ReplicationOverwriteProtection?: ReplicationOverwriteProtection;
}
export const UpdateFileSystemProtectionRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")),
    ReplicationOverwriteProtection: S.optional(ReplicationOverwriteProtection),
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2015-02-01/file-systems/{FileSystemId}/protection",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateFileSystemProtectionRequest",
}) as any as S.Schema<UpdateFileSystemProtectionRequest>;
export type SecondaryGids = number[];
export const SecondaryGids = S.Array(S.Number);
export type Status =
  | "ENABLED"
  | "ENABLING"
  | "DISABLED"
  | "DISABLING"
  | (string & {});
export const Status = S.String;
export type TransitionToIARules =
  | "AFTER_7_DAYS"
  | "AFTER_14_DAYS"
  | "AFTER_30_DAYS"
  | "AFTER_60_DAYS"
  | "AFTER_90_DAYS"
  | "AFTER_1_DAY"
  | "AFTER_180_DAYS"
  | "AFTER_270_DAYS"
  | "AFTER_365_DAYS"
  | (string & {});
export const TransitionToIARules = S.String;
export type TransitionToPrimaryStorageClassRules =
  | "AFTER_1_ACCESS"
  | (string & {});
export const TransitionToPrimaryStorageClassRules = S.String;
export type TransitionToArchiveRules =
  | "AFTER_1_DAY"
  | "AFTER_7_DAYS"
  | "AFTER_14_DAYS"
  | "AFTER_30_DAYS"
  | "AFTER_60_DAYS"
  | "AFTER_90_DAYS"
  | "AFTER_180_DAYS"
  | "AFTER_270_DAYS"
  | "AFTER_365_DAYS"
  | (string & {});
export const TransitionToArchiveRules = S.String;
export interface PosixUser {
  Uid: number;
  Gid: number;
  SecondaryGids?: number[];
}
export const PosixUser = S.suspend(() =>
  S.Struct({
    Uid: S.Number,
    Gid: S.Number,
    SecondaryGids: S.optional(SecondaryGids),
  }),
).annotations({ identifier: "PosixUser" }) as any as S.Schema<PosixUser>;
export type LifeCycleState =
  | "creating"
  | "available"
  | "updating"
  | "deleting"
  | "deleted"
  | "error"
  | (string & {});
export const LifeCycleState = S.String;
export interface DestinationToCreate {
  Region?: string;
  AvailabilityZoneName?: string;
  KmsKeyId?: string;
  FileSystemId?: string;
  RoleArn?: string;
}
export const DestinationToCreate = S.suspend(() =>
  S.Struct({
    Region: S.optional(S.String),
    AvailabilityZoneName: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    FileSystemId: S.optional(S.String),
    RoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DestinationToCreate",
}) as any as S.Schema<DestinationToCreate>;
export type DestinationsToCreate = DestinationToCreate[];
export const DestinationsToCreate = S.Array(DestinationToCreate);
export interface FileSystemSize {
  Value: number;
  Timestamp?: Date;
  ValueInIA?: number;
  ValueInStandard?: number;
  ValueInArchive?: number;
}
export const FileSystemSize = S.suspend(() =>
  S.Struct({
    Value: S.Number,
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ValueInIA: S.optional(S.Number),
    ValueInStandard: S.optional(S.Number),
    ValueInArchive: S.optional(S.Number),
  }),
).annotations({
  identifier: "FileSystemSize",
}) as any as S.Schema<FileSystemSize>;
export interface FileSystemProtectionDescription {
  ReplicationOverwriteProtection?: ReplicationOverwriteProtection;
}
export const FileSystemProtectionDescription = S.suspend(() =>
  S.Struct({
    ReplicationOverwriteProtection: S.optional(ReplicationOverwriteProtection),
  }),
).annotations({
  identifier: "FileSystemProtectionDescription",
}) as any as S.Schema<FileSystemProtectionDescription>;
export interface FileSystemDescription {
  OwnerId: string;
  CreationToken: string;
  FileSystemId: string;
  FileSystemArn?: string;
  CreationTime: Date;
  LifeCycleState: LifeCycleState;
  Name?: string;
  NumberOfMountTargets: number;
  SizeInBytes: FileSystemSize;
  PerformanceMode: PerformanceMode;
  Encrypted?: boolean;
  KmsKeyId?: string;
  ThroughputMode?: ThroughputMode;
  ProvisionedThroughputInMibps?: number;
  AvailabilityZoneName?: string;
  AvailabilityZoneId?: string;
  Tags: Tag[];
  FileSystemProtection?: FileSystemProtectionDescription;
}
export const FileSystemDescription = S.suspend(() =>
  S.Struct({
    OwnerId: S.String,
    CreationToken: S.String,
    FileSystemId: S.String,
    FileSystemArn: S.optional(S.String),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    LifeCycleState: LifeCycleState,
    Name: S.optional(S.String),
    NumberOfMountTargets: S.Number,
    SizeInBytes: FileSystemSize,
    PerformanceMode: PerformanceMode,
    Encrypted: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    ThroughputMode: S.optional(ThroughputMode),
    ProvisionedThroughputInMibps: S.optional(S.Number),
    AvailabilityZoneName: S.optional(S.String),
    AvailabilityZoneId: S.optional(S.String),
    Tags: Tags,
    FileSystemProtection: S.optional(FileSystemProtectionDescription),
  }),
).annotations({
  identifier: "FileSystemDescription",
}) as any as S.Schema<FileSystemDescription>;
export type FileSystemDescriptions = FileSystemDescription[];
export const FileSystemDescriptions = S.Array(FileSystemDescription);
export interface MountTargetDescription {
  OwnerId?: string;
  MountTargetId: string;
  FileSystemId: string;
  SubnetId: string;
  LifeCycleState: LifeCycleState;
  IpAddress?: string;
  Ipv6Address?: string;
  NetworkInterfaceId?: string;
  AvailabilityZoneId?: string;
  AvailabilityZoneName?: string;
  VpcId?: string;
}
export const MountTargetDescription = S.suspend(() =>
  S.Struct({
    OwnerId: S.optional(S.String),
    MountTargetId: S.String,
    FileSystemId: S.String,
    SubnetId: S.String,
    LifeCycleState: LifeCycleState,
    IpAddress: S.optional(S.String),
    Ipv6Address: S.optional(S.String),
    NetworkInterfaceId: S.optional(S.String),
    AvailabilityZoneId: S.optional(S.String),
    AvailabilityZoneName: S.optional(S.String),
    VpcId: S.optional(S.String),
  }),
).annotations({
  identifier: "MountTargetDescription",
}) as any as S.Schema<MountTargetDescription>;
export type MountTargetDescriptions = MountTargetDescription[];
export const MountTargetDescriptions = S.Array(MountTargetDescription);
export interface BackupPolicy {
  Status: Status;
}
export const BackupPolicy = S.suspend(() =>
  S.Struct({ Status: Status }),
).annotations({ identifier: "BackupPolicy" }) as any as S.Schema<BackupPolicy>;
export interface LifecyclePolicy {
  TransitionToIA?: TransitionToIARules;
  TransitionToPrimaryStorageClass?: TransitionToPrimaryStorageClassRules;
  TransitionToArchive?: TransitionToArchiveRules;
}
export const LifecyclePolicy = S.suspend(() =>
  S.Struct({
    TransitionToIA: S.optional(TransitionToIARules),
    TransitionToPrimaryStorageClass: S.optional(
      TransitionToPrimaryStorageClassRules,
    ),
    TransitionToArchive: S.optional(TransitionToArchiveRules),
  }),
).annotations({
  identifier: "LifecyclePolicy",
}) as any as S.Schema<LifecyclePolicy>;
export type LifecyclePolicies = LifecyclePolicy[];
export const LifecyclePolicies = S.Array(LifecyclePolicy);
export interface CreateReplicationConfigurationRequest {
  SourceFileSystemId: string;
  Destinations: DestinationToCreate[];
}
export const CreateReplicationConfigurationRequest = S.suspend(() =>
  S.Struct({
    SourceFileSystemId: S.String.pipe(T.HttpLabel("SourceFileSystemId")),
    Destinations: DestinationsToCreate,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/2015-02-01/file-systems/{SourceFileSystemId}/replication-configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateReplicationConfigurationRequest",
}) as any as S.Schema<CreateReplicationConfigurationRequest>;
export interface BackupPolicyDescription {
  BackupPolicy?: BackupPolicy;
}
export const BackupPolicyDescription = S.suspend(() =>
  S.Struct({ BackupPolicy: S.optional(BackupPolicy) }),
).annotations({
  identifier: "BackupPolicyDescription",
}) as any as S.Schema<BackupPolicyDescription>;
export interface FileSystemPolicyDescription {
  FileSystemId?: string;
  Policy?: string;
}
export const FileSystemPolicyDescription = S.suspend(() =>
  S.Struct({
    FileSystemId: S.optional(S.String),
    Policy: S.optional(S.String),
  }),
).annotations({
  identifier: "FileSystemPolicyDescription",
}) as any as S.Schema<FileSystemPolicyDescription>;
export interface DescribeFileSystemsResponse {
  Marker?: string;
  FileSystems?: FileSystemDescription[];
  NextMarker?: string;
}
export const DescribeFileSystemsResponse = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    FileSystems: S.optional(FileSystemDescriptions),
    NextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeFileSystemsResponse",
}) as any as S.Schema<DescribeFileSystemsResponse>;
export interface LifecycleConfigurationDescription {
  LifecyclePolicies?: LifecyclePolicy[];
}
export const LifecycleConfigurationDescription = S.suspend(() =>
  S.Struct({ LifecyclePolicies: S.optional(LifecyclePolicies) }),
).annotations({
  identifier: "LifecycleConfigurationDescription",
}) as any as S.Schema<LifecycleConfigurationDescription>;
export interface DescribeMountTargetsResponse {
  Marker?: string;
  MountTargets?: MountTargetDescription[];
  NextMarker?: string;
}
export const DescribeMountTargetsResponse = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    MountTargets: S.optional(MountTargetDescriptions),
    NextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeMountTargetsResponse",
}) as any as S.Schema<DescribeMountTargetsResponse>;
export interface DescribeMountTargetSecurityGroupsResponse {
  SecurityGroups: string[];
}
export const DescribeMountTargetSecurityGroupsResponse = S.suspend(() =>
  S.Struct({ SecurityGroups: SecurityGroups }),
).annotations({
  identifier: "DescribeMountTargetSecurityGroupsResponse",
}) as any as S.Schema<DescribeMountTargetSecurityGroupsResponse>;
export interface DescribeTagsResponse {
  Marker?: string;
  Tags: Tag[];
  NextMarker?: string;
}
export const DescribeTagsResponse = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    Tags: Tags,
    NextMarker: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeTagsResponse",
}) as any as S.Schema<DescribeTagsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
  NextToken?: string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export type Resource = "FILE_SYSTEM" | "MOUNT_TARGET" | (string & {});
export const Resource = S.String;
export type Resources = Resource[];
export const Resources = S.Array(Resource);
export interface ResourceIdPreference {
  ResourceIdType?: ResourceIdType;
  Resources?: Resource[];
}
export const ResourceIdPreference = S.suspend(() =>
  S.Struct({
    ResourceIdType: S.optional(ResourceIdType),
    Resources: S.optional(Resources),
  }),
).annotations({
  identifier: "ResourceIdPreference",
}) as any as S.Schema<ResourceIdPreference>;
export interface PutAccountPreferencesResponse {
  ResourceIdPreference?: ResourceIdPreference;
}
export const PutAccountPreferencesResponse = S.suspend(() =>
  S.Struct({ ResourceIdPreference: S.optional(ResourceIdPreference) }),
).annotations({
  identifier: "PutAccountPreferencesResponse",
}) as any as S.Schema<PutAccountPreferencesResponse>;
export interface PutBackupPolicyRequest {
  FileSystemId: string;
  BackupPolicy: BackupPolicy;
}
export const PutBackupPolicyRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")),
    BackupPolicy: BackupPolicy,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2015-02-01/file-systems/{FileSystemId}/backup-policy",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutBackupPolicyRequest",
}) as any as S.Schema<PutBackupPolicyRequest>;
export interface PutLifecycleConfigurationRequest {
  FileSystemId: string;
  LifecyclePolicies: LifecyclePolicy[];
}
export const PutLifecycleConfigurationRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String.pipe(T.HttpLabel("FileSystemId")),
    LifecyclePolicies: LifecyclePolicies,
  }).pipe(
    T.all(
      T.Http({
        method: "PUT",
        uri: "/2015-02-01/file-systems/{FileSystemId}/lifecycle-configuration",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutLifecycleConfigurationRequest",
}) as any as S.Schema<PutLifecycleConfigurationRequest>;
export interface CreationInfo {
  OwnerUid: number;
  OwnerGid: number;
  Permissions: string;
}
export const CreationInfo = S.suspend(() =>
  S.Struct({ OwnerUid: S.Number, OwnerGid: S.Number, Permissions: S.String }),
).annotations({ identifier: "CreationInfo" }) as any as S.Schema<CreationInfo>;
export interface RootDirectory {
  Path?: string;
  CreationInfo?: CreationInfo;
}
export const RootDirectory = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    CreationInfo: S.optional(CreationInfo),
  }),
).annotations({
  identifier: "RootDirectory",
}) as any as S.Schema<RootDirectory>;
export interface AccessPointDescription {
  ClientToken?: string;
  Name?: string;
  Tags?: Tag[];
  AccessPointId?: string;
  AccessPointArn?: string;
  FileSystemId?: string;
  PosixUser?: PosixUser;
  RootDirectory?: RootDirectory;
  OwnerId?: string;
  LifeCycleState?: LifeCycleState;
}
export const AccessPointDescription = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(S.String),
    Name: S.optional(S.String),
    Tags: S.optional(Tags),
    AccessPointId: S.optional(S.String),
    AccessPointArn: S.optional(S.String),
    FileSystemId: S.optional(S.String),
    PosixUser: S.optional(PosixUser),
    RootDirectory: S.optional(RootDirectory),
    OwnerId: S.optional(S.String),
    LifeCycleState: S.optional(LifeCycleState),
  }),
).annotations({
  identifier: "AccessPointDescription",
}) as any as S.Schema<AccessPointDescription>;
export type AccessPointDescriptions = AccessPointDescription[];
export const AccessPointDescriptions = S.Array(AccessPointDescription);
export type ReplicationStatus =
  | "ENABLED"
  | "ENABLING"
  | "DELETING"
  | "ERROR"
  | "PAUSED"
  | "PAUSING"
  | (string & {});
export const ReplicationStatus = S.String;
export interface CreateAccessPointRequest {
  ClientToken: string;
  Tags?: Tag[];
  FileSystemId: string;
  PosixUser?: PosixUser;
  RootDirectory?: RootDirectory;
}
export const CreateAccessPointRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.String.pipe(T.IdempotencyToken()),
    Tags: S.optional(Tags),
    FileSystemId: S.String,
    PosixUser: S.optional(PosixUser),
    RootDirectory: S.optional(RootDirectory),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/2015-02-01/access-points" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateAccessPointRequest",
}) as any as S.Schema<CreateAccessPointRequest>;
export interface DescribeAccessPointsResponse {
  AccessPoints?: AccessPointDescription[];
  NextToken?: string;
}
export const DescribeAccessPointsResponse = S.suspend(() =>
  S.Struct({
    AccessPoints: S.optional(AccessPointDescriptions),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAccessPointsResponse",
}) as any as S.Schema<DescribeAccessPointsResponse>;
export interface DescribeAccountPreferencesResponse {
  ResourceIdPreference?: ResourceIdPreference;
  NextToken?: string;
}
export const DescribeAccountPreferencesResponse = S.suspend(() =>
  S.Struct({
    ResourceIdPreference: S.optional(ResourceIdPreference),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeAccountPreferencesResponse",
}) as any as S.Schema<DescribeAccountPreferencesResponse>;
export interface Destination {
  Status: ReplicationStatus;
  FileSystemId: string;
  Region: string;
  LastReplicatedTimestamp?: Date;
  OwnerId?: string;
  StatusMessage?: string;
  RoleArn?: string;
}
export const Destination = S.suspend(() =>
  S.Struct({
    Status: ReplicationStatus,
    FileSystemId: S.String,
    Region: S.String,
    LastReplicatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    OwnerId: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    RoleArn: S.optional(S.String),
  }),
).annotations({ identifier: "Destination" }) as any as S.Schema<Destination>;
export type Destinations = Destination[];
export const Destinations = S.Array(Destination);
export interface ReplicationConfigurationDescription {
  SourceFileSystemId: string;
  SourceFileSystemRegion: string;
  SourceFileSystemArn: string;
  OriginalSourceFileSystemArn: string;
  CreationTime: Date;
  Destinations: Destination[];
  SourceFileSystemOwnerId?: string;
}
export const ReplicationConfigurationDescription = S.suspend(() =>
  S.Struct({
    SourceFileSystemId: S.String,
    SourceFileSystemRegion: S.String,
    SourceFileSystemArn: S.String,
    OriginalSourceFileSystemArn: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Destinations: Destinations,
    SourceFileSystemOwnerId: S.optional(S.String),
  }),
).annotations({
  identifier: "ReplicationConfigurationDescription",
}) as any as S.Schema<ReplicationConfigurationDescription>;
export type ReplicationConfigurationDescriptions =
  ReplicationConfigurationDescription[];
export const ReplicationConfigurationDescriptions = S.Array(
  ReplicationConfigurationDescription,
);
export interface DescribeReplicationConfigurationsResponse {
  Replications?: ReplicationConfigurationDescription[];
  NextToken?: string;
}
export const DescribeReplicationConfigurationsResponse = S.suspend(() =>
  S.Struct({
    Replications: S.optional(ReplicationConfigurationDescriptions),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeReplicationConfigurationsResponse",
}) as any as S.Schema<DescribeReplicationConfigurationsResponse>;

//# Errors
export class BadRequest extends S.TaggedError<BadRequest>()("BadRequest", {
  ErrorCode: S.String,
  Message: S.optional(S.String),
}).pipe(C.withBadRequestError) {}
export class AccessPointNotFound extends S.TaggedError<AccessPointNotFound>()(
  "AccessPointNotFound",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AvailabilityZonesMismatch extends S.TaggedError<AvailabilityZonesMismatch>()(
  "AvailabilityZonesMismatch",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class FileSystemNotFound extends S.TaggedError<FileSystemNotFound>()(
  "FileSystemNotFound",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class IncorrectMountTargetState extends S.TaggedError<IncorrectMountTargetState>()(
  "IncorrectMountTargetState",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class FileSystemInUse extends S.TaggedError<FileSystemInUse>()(
  "FileSystemInUse",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class DependencyTimeout extends S.TaggedError<DependencyTimeout>()(
  "DependencyTimeout",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withTimeoutError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class AccessPointAlreadyExists extends S.TaggedError<AccessPointAlreadyExists>()(
  "AccessPointAlreadyExists",
  {
    ErrorCode: S.String,
    Message: S.optional(S.String),
    AccessPointId: S.String,
  },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class FileSystemAlreadyExists extends S.TaggedError<FileSystemAlreadyExists>()(
  "FileSystemAlreadyExists",
  {
    ErrorCode: S.String,
    Message: S.optional(S.String),
    FileSystemId: S.String,
  },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class MountTargetNotFound extends S.TaggedError<MountTargetNotFound>()(
  "MountTargetNotFound",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class FileSystemLimitExceeded extends S.TaggedError<FileSystemLimitExceeded>()(
  "FileSystemLimitExceeded",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withAuthError, C.withThrottlingError) {}
export class PolicyNotFound extends S.TaggedError<PolicyNotFound>()(
  "PolicyNotFound",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class IncorrectFileSystemLifeCycleState extends S.TaggedError<IncorrectFileSystemLifeCycleState>()(
  "IncorrectFileSystemLifeCycleState",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ReplicationNotFound extends S.TaggedError<ReplicationNotFound>()(
  "ReplicationNotFound",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class AccessPointLimitExceeded extends S.TaggedError<AccessPointLimitExceeded>()(
  "AccessPointLimitExceeded",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withAuthError, C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SecurityGroupLimitExceeded extends S.TaggedError<SecurityGroupLimitExceeded>()(
  "SecurityGroupLimitExceeded",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withBadRequestError, C.withThrottlingError) {}
export class InsufficientThroughputCapacity extends S.TaggedError<InsufficientThroughputCapacity>()(
  "InsufficientThroughputCapacity",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidPolicyException extends S.TaggedError<InvalidPolicyException>()(
  "InvalidPolicyException",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class IpAddressInUse extends S.TaggedError<IpAddressInUse>()(
  "IpAddressInUse",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withDependencyViolationError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class SecurityGroupNotFound extends S.TaggedError<SecurityGroupNotFound>()(
  "SecurityGroupNotFound",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThroughputLimitExceeded extends S.TaggedError<ThroughputLimitExceeded>()(
  "ThroughputLimitExceeded",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withBadRequestError, C.withThrottlingError) {}
export class MountTargetConflict extends S.TaggedError<MountTargetConflict>()(
  "MountTargetConflict",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ReplicationAlreadyExists extends S.TaggedError<ReplicationAlreadyExists>()(
  "ReplicationAlreadyExists",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withAlreadyExistsError) {}
export class UnsupportedAvailabilityZone extends S.TaggedError<UnsupportedAvailabilityZone>()(
  "UnsupportedAvailabilityZone",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NetworkInterfaceLimitExceeded extends S.TaggedError<NetworkInterfaceLimitExceeded>()(
  "NetworkInterfaceLimitExceeded",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withConflictError, C.withThrottlingError) {}
export class TooManyRequests extends S.TaggedError<TooManyRequests>()(
  "TooManyRequests",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class NoFreeAddressesInSubnet extends S.TaggedError<NoFreeAddressesInSubnet>()(
  "NoFreeAddressesInSubnet",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class SubnetNotFound extends S.TaggedError<SubnetNotFound>()(
  "SubnetNotFound",
  { ErrorCode: S.String, Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes the specified access point. After deletion is complete, new clients can no
 * longer connect to the access points. Clients connected to the access point at the time of
 * deletion will continue to function until they terminate their connection.
 *
 * This operation requires permissions for the `elasticfilesystem:DeleteAccessPoint` action.
 */
export const deleteAccessPoint: (
  input: DeleteAccessPointRequest,
) => effect.Effect<
  DeleteAccessPointResponse,
  AccessPointNotFound | BadRequest | InternalServerError | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessPointRequest,
  output: DeleteAccessPointResponse,
  errors: [AccessPointNotFound, BadRequest, InternalServerError],
}));
/**
 * Returns the description of a specific Amazon EFS access point if the
 * `AccessPointId` is provided. If you provide an EFS
 * `FileSystemId`, it returns descriptions of all access points for that file
 * system. You can provide either an `AccessPointId` or a `FileSystemId` in
 * the request, but not both.
 *
 * This operation requires permissions for the `elasticfilesystem:DescribeAccessPoints` action.
 */
export const describeAccessPoints: {
  (
    input: DescribeAccessPointsRequest,
  ): effect.Effect<
    DescribeAccessPointsResponse,
    | AccessPointNotFound
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeAccessPointsRequest,
  ) => stream.Stream<
    DescribeAccessPointsResponse,
    | AccessPointNotFound
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeAccessPointsRequest,
  ) => stream.Stream<
    AccessPointDescription,
    | AccessPointNotFound
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeAccessPointsRequest,
  output: DescribeAccessPointsResponse,
  errors: [
    AccessPointNotFound,
    BadRequest,
    FileSystemNotFound,
    InternalServerError,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "AccessPoints",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the account preferences settings for the Amazon Web Services account associated with the user making the request, in the current Amazon Web Services Region.
 */
export const describeAccountPreferences: (
  input: DescribeAccountPreferencesRequest,
) => effect.Effect<
  DescribeAccountPreferencesResponse,
  InternalServerError | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountPreferencesRequest,
  output: DescribeAccountPreferencesResponse,
  errors: [InternalServerError],
}));
/**
 * Deletes a file system, permanently severing access to its contents. Upon return, the
 * file system no longer exists and you can't access any contents of the deleted file
 * system.
 *
 * You need to manually delete mount targets attached to a file system before you can delete
 * an EFS file system. This step is performed for you when you use the Amazon Web Services console
 * to delete a file system.
 *
 * You cannot delete a file system that is part of an EFS replication configuration.
 * You need to delete the replication configuration first.
 *
 * You can't delete a file system that is in use. That is, if the file system has
 * any mount targets, you must first delete them. For more information, see DescribeMountTargets and DeleteMountTarget.
 *
 * The `DeleteFileSystem` call returns while the file system state is still
 * `deleting`. You can check the file system deletion status by calling the DescribeFileSystems operation, which returns a list of file systems in your
 * account. If you pass file system ID or creation token for the deleted file system, the DescribeFileSystems returns a `404 FileSystemNotFound`
 * error.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:DeleteFileSystem` action.
 */
export const deleteFileSystem: (
  input: DeleteFileSystemRequest,
) => effect.Effect<
  DeleteFileSystemResponse,
  | BadRequest
  | FileSystemInUse
  | FileSystemNotFound
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFileSystemRequest,
  output: DeleteFileSystemResponse,
  errors: [
    BadRequest,
    FileSystemInUse,
    FileSystemNotFound,
    InternalServerError,
  ],
}));
/**
 * Returns the description of a specific Amazon EFS file system if either the file system
 * `CreationToken` or the `FileSystemId` is provided. Otherwise, it
 * returns descriptions of all file systems owned by the caller's Amazon Web Services account in the
 * Amazon Web Services Region of the endpoint that you're calling.
 *
 * When retrieving all file system descriptions, you can optionally specify the
 * `MaxItems` parameter to limit the number of descriptions in a response.
 * This number is automatically set to 100. If more file system descriptions remain,
 * Amazon EFS returns a `NextMarker`, an opaque token, in the response. In this case,
 * you should send a subsequent request with the `Marker` request parameter set to the
 * value of `NextMarker`.
 *
 * To retrieve a list of your file system descriptions, this operation is used in an
 * iterative process, where `DescribeFileSystems` is called first without the
 * `Marker` and then the operation continues to call it with the `Marker`
 * parameter set to the value of the `NextMarker` from the previous response until the
 * response has no `NextMarker`.
 *
 * The order of file systems returned in the response of one
 * `DescribeFileSystems` call and the order of file systems returned across the
 * responses of a multi-call iteration is unspecified.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:DescribeFileSystems` action.
 */
export const describeFileSystems: {
  (
    input: DescribeFileSystemsRequest,
  ): effect.Effect<
    DescribeFileSystemsResponse,
    BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeFileSystemsRequest,
  ) => stream.Stream<
    DescribeFileSystemsResponse,
    BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeFileSystemsRequest,
  ) => stream.Stream<
    FileSystemDescription,
    BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeFileSystemsRequest,
  output: DescribeFileSystemsResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "FileSystems",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Returns the current `LifecycleConfiguration` object for the specified
 * EFS file system. Lifecycle management uses the `LifecycleConfiguration`
 * object to identify when to move files between storage classes. For a file system without a
 * `LifecycleConfiguration` object, the call returns an empty array in the
 * response.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:DescribeLifecycleConfiguration` operation.
 */
export const describeLifecycleConfiguration: (
  input: DescribeLifecycleConfigurationRequest,
) => effect.Effect<
  LifecycleConfigurationDescription,
  BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLifecycleConfigurationRequest,
  output: LifecycleConfigurationDescription,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
}));
/**
 * DEPRECATED - The `DescribeTags` action is deprecated and not maintained. To view
 * tags associated with EFS resources, use the `ListTagsForResource` API
 * action.
 *
 * Returns the tags associated with a file system. The order of tags returned in the
 * response of one `DescribeTags` call and the order of tags returned across the
 * responses of a multiple-call iteration (when using pagination) is unspecified.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:DescribeTags` action.
 */
export const describeTags: {
  (
    input: DescribeTagsRequest,
  ): effect.Effect<
    DescribeTagsResponse,
    BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTagsRequest,
  ) => stream.Stream<
    DescribeTagsResponse,
    BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTagsRequest,
  ) => stream.Stream<
    Tag,
    BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTagsRequest,
  output: DescribeTagsResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "Tags",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Lists all tags for a top-level EFS resource. You must provide the ID of the
 * resource that you want to retrieve the tags for.
 *
 * This operation requires permissions for the `elasticfilesystem:DescribeAccessPoints` action.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): effect.Effect<
    ListTagsForResourceResponse,
    | AccessPointNotFound
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    ListTagsForResourceResponse,
    | AccessPointNotFound
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => stream.Stream<
    unknown,
    | AccessPointNotFound
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessPointNotFound,
    BadRequest,
    FileSystemNotFound,
    InternalServerError,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * DEPRECATED - `DeleteTags` is deprecated and not maintained. To remove tags from EFS
 * resources, use the API action.
 *
 * Deletes the specified tags from a file system. If the `DeleteTags` request
 * includes a tag key that doesn't exist, Amazon EFS ignores it and doesn't cause an
 * error. For more information about tags and related restrictions, see Tag restrictions in the
 * *Billing and Cost Management User Guide*.
 *
 * This operation requires permissions for the `elasticfilesystem:DeleteTags`
 * action.
 */
export const deleteTags: (
  input: DeleteTagsRequest,
) => effect.Effect<
  DeleteTagsResponse,
  BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagsRequest,
  output: DeleteTagsResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
}));
/**
 * Creates a tag for an EFS resource. You can create tags for EFS file
 * systems and access points using this API operation.
 *
 * This operation requires permissions for the `elasticfilesystem:TagResource` action.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessPointNotFound
  | BadRequest
  | FileSystemNotFound
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessPointNotFound,
    BadRequest,
    FileSystemNotFound,
    InternalServerError,
  ],
}));
/**
 * Removes tags from an EFS resource. You can remove tags from EFS file
 * systems and access points using this API operation.
 *
 * This operation requires permissions for the `elasticfilesystem:UntagResource` action.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessPointNotFound
  | BadRequest
  | FileSystemNotFound
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessPointNotFound,
    BadRequest,
    FileSystemNotFound,
    InternalServerError,
  ],
}));
/**
 * Use this operation to set the account preference in the current Amazon Web Services Region
 * to use long 17 character (63 bit) or short 8 character (32 bit) resource IDs for new
 * EFS file system and mount target resources. All existing resource IDs are not
 * affected by any changes you make. You can set the ID preference during the opt-in period as
 * EFS transitions to long resource IDs. For more information, see Managing Amazon EFS resource IDs.
 *
 * Starting in October, 2021, you will receive an error if you try to set the account preference
 * to use the short 8 character format resource ID. Contact Amazon Web Services support if you
 * receive an error and must use short IDs for file system and mount target resources.
 */
export const putAccountPreferences: (
  input: PutAccountPreferencesRequest,
) => effect.Effect<
  PutAccountPreferencesResponse,
  BadRequest | InternalServerError | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountPreferencesRequest,
  output: PutAccountPreferencesResponse,
  errors: [BadRequest, InternalServerError],
}));
/**
 * DEPRECATED - `CreateTags` is deprecated and not maintained. To create tags for EFS
 * resources, use the API action.
 *
 * Creates or overwrites tags associated with a file system. Each tag is a key-value pair. If
 * a tag key specified in the request already exists on the file system, this operation
 * overwrites its value with the value provided in the request. If you add the `Name`
 * tag to your file system, Amazon EFS returns it in the response to the DescribeFileSystems operation.
 *
 * This operation requires permission for the `elasticfilesystem:CreateTags`
 * action.
 */
export const createTags: (
  input: CreateTagsRequest,
) => effect.Effect<
  CreateTagsResponse,
  BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTagsRequest,
  output: CreateTagsResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
}));
/**
 * Returns the security groups currently in effect for a mount target. This operation
 * requires that the network interface of the mount target has been created and the lifecycle
 * state of the mount target is not `deleted`.
 *
 * This operation requires permissions for the following actions:
 *
 * - `elasticfilesystem:DescribeMountTargetSecurityGroups` action on the mount
 * target's file system.
 *
 * - `ec2:DescribeNetworkInterfaceAttribute` action on the mount target's
 * network interface.
 */
export const describeMountTargetSecurityGroups: (
  input: DescribeMountTargetSecurityGroupsRequest,
) => effect.Effect<
  DescribeMountTargetSecurityGroupsResponse,
  | BadRequest
  | IncorrectMountTargetState
  | InternalServerError
  | MountTargetNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMountTargetSecurityGroupsRequest,
  output: DescribeMountTargetSecurityGroupsResponse,
  errors: [
    BadRequest,
    IncorrectMountTargetState,
    InternalServerError,
    MountTargetNotFound,
  ],
}));
/**
 * Deletes a replication configuration. Deleting a replication configuration ends the
 * replication process. After a replication configuration is deleted, the destination file system
 * becomes `Writeable` and its replication overwrite protection is re-enabled. For
 * more information, see Delete a replication configuration.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:DeleteReplicationConfiguration` action.
 */
export const deleteReplicationConfiguration: (
  input: DeleteReplicationConfigurationRequest,
) => effect.Effect<
  DeleteReplicationConfigurationResponse,
  | BadRequest
  | FileSystemNotFound
  | InternalServerError
  | ReplicationNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReplicationConfigurationRequest,
  output: DeleteReplicationConfigurationResponse,
  errors: [
    BadRequest,
    FileSystemNotFound,
    InternalServerError,
    ReplicationNotFound,
  ],
}));
/**
 * Deletes the specified mount target.
 *
 * This operation forcibly breaks any mounts of the file system by using the mount target
 * that is being deleted, which might disrupt instances or applications using those mounts. To
 * avoid applications getting cut off abruptly, you might consider unmounting any mounts of the
 * mount target, if feasible. The operation also deletes the associated network interface.
 * Uncommitted writes might be lost, but breaking a mount target using this operation does not
 * corrupt the file system itself. The file system you created remains. You can mount an
 * EC2 instance in your VPC by using another mount target.
 *
 * This operation requires permissions for the following action on the file
 * system:
 *
 * - `elasticfilesystem:DeleteMountTarget`
 *
 * The `DeleteMountTarget` call returns while the mount target state is still
 * `deleting`. You can check the mount target deletion by calling the DescribeMountTargets operation, which returns a list of mount target
 * descriptions for the given file system.
 *
 * The operation also requires permissions for the following Amazon EC2 action on the
 * mount target's network interface:
 *
 * - `ec2:DeleteNetworkInterface`
 */
export const deleteMountTarget: (
  input: DeleteMountTargetRequest,
) => effect.Effect<
  DeleteMountTargetResponse,
  | BadRequest
  | DependencyTimeout
  | InternalServerError
  | MountTargetNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMountTargetRequest,
  output: DeleteMountTargetResponse,
  errors: [
    BadRequest,
    DependencyTimeout,
    InternalServerError,
    MountTargetNotFound,
  ],
}));
/**
 * Returns the descriptions of all the current mount targets, or a specific mount target,
 * for a file system. When requesting all of the current mount targets, the order of mount
 * targets returned in the response is unspecified.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:DescribeMountTargets` action, on either the file system ID
 * that you specify in `FileSystemId`, or on the file system of the mount target that
 * you specify in `MountTargetId`.
 */
export const describeMountTargets: {
  (
    input: DescribeMountTargetsRequest,
  ): effect.Effect<
    DescribeMountTargetsResponse,
    | AccessPointNotFound
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | MountTargetNotFound
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeMountTargetsRequest,
  ) => stream.Stream<
    DescribeMountTargetsResponse,
    | AccessPointNotFound
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | MountTargetNotFound
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeMountTargetsRequest,
  ) => stream.Stream<
    MountTargetDescription,
    | AccessPointNotFound
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | MountTargetNotFound
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeMountTargetsRequest,
  output: DescribeMountTargetsResponse,
  errors: [
    AccessPointNotFound,
    BadRequest,
    FileSystemNotFound,
    InternalServerError,
    MountTargetNotFound,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "MountTargets",
    pageSize: "MaxItems",
  } as const,
}));
/**
 * Returns the `FileSystemPolicy` for the specified EFS file
 * system.
 *
 * This operation requires permissions for the `elasticfilesystem:DescribeFileSystemPolicy` action.
 */
export const describeFileSystemPolicy: (
  input: DescribeFileSystemPolicyRequest,
) => effect.Effect<
  FileSystemPolicyDescription,
  | BadRequest
  | FileSystemNotFound
  | InternalServerError
  | PolicyNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFileSystemPolicyRequest,
  output: FileSystemPolicyDescription,
  errors: [BadRequest, FileSystemNotFound, InternalServerError, PolicyNotFound],
}));
/**
 * Use this action to manage storage for your file system. A
 * `LifecycleConfiguration` consists of one or more `LifecyclePolicy`
 * objects that define the following:
 *
 * -
 * `TransitionToIA`
 * –
 * When to move files in the file system from primary storage (Standard storage class) into the Infrequent Access
 * (IA) storage.
 *
 * -
 * `TransitionToArchive`
 * –
 * When to move files in the file system from their current storage class (either IA or Standard storage) into the
 * Archive storage.
 *
 * File systems cannot transition into Archive storage before transitioning into IA storage. Therefore,
 * TransitionToArchive must either not be set or must be later than TransitionToIA.
 *
 * The Archive storage class is available only for file systems that use the Elastic throughput mode
 * and the General Purpose performance mode.
 *
 * -
 * `TransitionToPrimaryStorageClass`
 * –
 * Whether to move files in the file system back to primary storage (Standard storage class) after they are accessed in IA
 * or Archive storage.
 *
 * For more information, see Managing file system
 * storage.
 *
 * Each Amazon EFS file system supports one lifecycle configuration, which applies to
 * all files in the file system. If a `LifecycleConfiguration` object already exists
 * for the specified file system, a `PutLifecycleConfiguration` call modifies the
 * existing configuration. A `PutLifecycleConfiguration` call with an empty
 * `LifecyclePolicies` array in the request body deletes any existing
 * `LifecycleConfiguration`. In the request, specify the following:
 *
 * - The ID for the file system for which you are enabling, disabling, or modifying
 * lifecycle management.
 *
 * - A `LifecyclePolicies` array of `LifecyclePolicy` objects that
 * define when to move files to IA storage, to Archive storage,
 * and back to primary storage.
 *
 * Amazon EFS requires that each `LifecyclePolicy`
 * object have only have a single transition, so the `LifecyclePolicies` array needs to be structured with separate
 * `LifecyclePolicy` objects. See the example requests in the following section for more information.
 *
 * This operation requires permissions for the `elasticfilesystem:PutLifecycleConfiguration` operation.
 *
 * To apply a `LifecycleConfiguration` object to an encrypted file system, you
 * need the same Key Management Service permissions as when you created the encrypted file system.
 */
export const putLifecycleConfiguration: (
  input: PutLifecycleConfigurationRequest,
) => effect.Effect<
  LifecycleConfigurationDescription,
  | BadRequest
  | FileSystemNotFound
  | IncorrectFileSystemLifeCycleState
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutLifecycleConfigurationRequest,
  output: LifecycleConfigurationDescription,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InternalServerError,
  ],
}));
/**
 * Deletes the `FileSystemPolicy` for the specified file system.
 * The default `FileSystemPolicy` goes into effect once the existing policy is deleted.
 * For more information about the default file system policy, see Using Resource-based Policies with EFS.
 *
 * This operation requires permissions for the `elasticfilesystem:DeleteFileSystemPolicy` action.
 */
export const deleteFileSystemPolicy: (
  input: DeleteFileSystemPolicyRequest,
) => effect.Effect<
  DeleteFileSystemPolicyResponse,
  | BadRequest
  | FileSystemNotFound
  | IncorrectFileSystemLifeCycleState
  | InternalServerError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFileSystemPolicyRequest,
  output: DeleteFileSystemPolicyResponse,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InternalServerError,
  ],
}));
/**
 * Returns the backup policy for the specified EFS file system.
 */
export const describeBackupPolicy: (
  input: DescribeBackupPolicyRequest,
) => effect.Effect<
  BackupPolicyDescription,
  | BadRequest
  | FileSystemNotFound
  | InternalServerError
  | PolicyNotFound
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBackupPolicyRequest,
  output: BackupPolicyDescription,
  errors: [
    BadRequest,
    FileSystemNotFound,
    InternalServerError,
    PolicyNotFound,
    ValidationException,
  ],
}));
/**
 * Updates the file system's backup policy. Use this action to start or stop automatic backups of the file system.
 */
export const putBackupPolicy: (
  input: PutBackupPolicyRequest,
) => effect.Effect<
  BackupPolicyDescription,
  | BadRequest
  | FileSystemNotFound
  | IncorrectFileSystemLifeCycleState
  | InternalServerError
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutBackupPolicyRequest,
  output: BackupPolicyDescription,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InternalServerError,
    ValidationException,
  ],
}));
/**
 * Retrieves the replication configuration for a specific file system. If a file system is
 * not specified, all of the replication configurations for the Amazon Web Services account in an
 * Amazon Web Services Region are retrieved.
 */
export const describeReplicationConfigurations: {
  (
    input: DescribeReplicationConfigurationsRequest,
  ): effect.Effect<
    DescribeReplicationConfigurationsResponse,
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | ReplicationNotFound
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReplicationConfigurationsRequest,
  ) => stream.Stream<
    DescribeReplicationConfigurationsResponse,
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | ReplicationNotFound
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReplicationConfigurationsRequest,
  ) => stream.Stream<
    ReplicationConfigurationDescription,
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | ReplicationNotFound
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReplicationConfigurationsRequest,
  output: DescribeReplicationConfigurationsResponse,
  errors: [
    BadRequest,
    FileSystemNotFound,
    InternalServerError,
    ReplicationNotFound,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Replications",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Applies an Amazon EFS
 * `FileSystemPolicy` to an Amazon EFS file system. A file system policy is an
 * IAM resource-based policy and can contain multiple policy statements. A file system always has
 * exactly one file system policy, which can be the default policy or an explicit policy set or
 * updated using this API operation. EFS file system policies have a 20,000 character
 * limit. When an explicit policy is set, it overrides the default policy. For more information
 * about the default file system policy, see
 * Default EFS file system policy.
 *
 * EFS file system policies have a 20,000 character limit.
 *
 * This operation requires permissions for the `elasticfilesystem:PutFileSystemPolicy` action.
 */
export const putFileSystemPolicy: (
  input: PutFileSystemPolicyRequest,
) => effect.Effect<
  FileSystemPolicyDescription,
  | BadRequest
  | FileSystemNotFound
  | IncorrectFileSystemLifeCycleState
  | InternalServerError
  | InvalidPolicyException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutFileSystemPolicyRequest,
  output: FileSystemPolicyDescription,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InternalServerError,
    InvalidPolicyException,
  ],
}));
/**
 * Creates an EFS access point. An access point is an application-specific view
 * into an EFS file system that applies an operating system user and group, and a file
 * system path, to any file system request made through the access point. The operating system
 * user and group override any identity information provided by the NFS client. The file system
 * path is exposed as the access point's root directory. Applications using the access point can
 * only access data in the application's own directory and any subdirectories. A file system can
 * have a maximum of 10,000 access points unless you request an increase. To learn more, see
 * Mounting a file
 * system using EFS access points.
 *
 * If multiple requests to create access points on the same file system are sent in quick
 * succession, and the file system is near the limit of access points, you may experience a
 * throttling response for these requests. This is to ensure that the file system does not
 * exceed the stated access point limit.
 *
 * This operation requires permissions for the `elasticfilesystem:CreateAccessPoint` action.
 *
 * Access points can be tagged on creation. If tags are specified in the creation action, IAM
 * performs additional authorization on the `elasticfilesystem:TagResource` action to
 * verify if users have permissions to create tags. Therefore, you must grant explicit
 * permissions to use the `elasticfilesystem:TagResource` action. For more
 * information, see Granting
 * permissions to tag resources during creation.
 */
export const createAccessPoint: (
  input: CreateAccessPointRequest,
) => effect.Effect<
  AccessPointDescription,
  | AccessPointAlreadyExists
  | AccessPointLimitExceeded
  | BadRequest
  | FileSystemNotFound
  | IncorrectFileSystemLifeCycleState
  | InternalServerError
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessPointRequest,
  output: AccessPointDescription,
  errors: [
    AccessPointAlreadyExists,
    AccessPointLimitExceeded,
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InternalServerError,
    ThrottlingException,
  ],
}));
/**
 * Modifies the set of security groups in effect for a mount target.
 *
 * When you create a mount target, Amazon EFS also creates a new network interface. For
 * more information, see CreateMountTarget. This operation replaces the security groups in effect for the
 * network interface associated with a mount target, with the `SecurityGroups`
 * provided in the request. This operation requires that the network interface of the mount
 * target has been created and the lifecycle state of the mount target is not
 * `deleted`.
 *
 * The operation requires permissions for the following actions:
 *
 * - `elasticfilesystem:ModifyMountTargetSecurityGroups` action on the mount
 * target's file system.
 *
 * - `ec2:ModifyNetworkInterfaceAttribute` action on the mount target's network
 * interface.
 */
export const modifyMountTargetSecurityGroups: (
  input: ModifyMountTargetSecurityGroupsRequest,
) => effect.Effect<
  ModifyMountTargetSecurityGroupsResponse,
  | BadRequest
  | IncorrectMountTargetState
  | InternalServerError
  | MountTargetNotFound
  | SecurityGroupLimitExceeded
  | SecurityGroupNotFound
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyMountTargetSecurityGroupsRequest,
  output: ModifyMountTargetSecurityGroupsResponse,
  errors: [
    BadRequest,
    IncorrectMountTargetState,
    InternalServerError,
    MountTargetNotFound,
    SecurityGroupLimitExceeded,
    SecurityGroupNotFound,
  ],
}));
/**
 * Creates a new, empty file system. The operation requires a creation token in the
 * request that Amazon EFS uses to ensure idempotent creation (calling the operation with same
 * creation token has no effect). If a file system does not currently exist that is owned by the
 * caller's Amazon Web Services account with the specified creation token, this operation does the
 * following:
 *
 * - Creates a new, empty file system. The file system will have an Amazon EFS assigned
 * ID, and an initial lifecycle state `creating`.
 *
 * - Returns with the description of the created file system.
 *
 * Otherwise, this operation returns a `FileSystemAlreadyExists` error with the
 * ID of the existing file system.
 *
 * For basic use cases, you can use a randomly generated UUID for the creation
 * token.
 *
 * The idempotent operation allows you to retry a `CreateFileSystem` call without
 * risk of creating an extra file system. This can happen when an initial call fails in a way
 * that leaves it uncertain whether or not a file system was actually created. An example might
 * be that a transport level timeout occurred or your connection was reset. As long as you use
 * the same creation token, if the initial call had succeeded in creating a file system, the
 * client can learn of its existence from the `FileSystemAlreadyExists` error.
 *
 * For more information, see
 * Creating a file system
 * in the *Amazon EFS User Guide*.
 *
 * The `CreateFileSystem` call returns while the file system's lifecycle
 * state is still `creating`. You can check the file system creation status by
 * calling the DescribeFileSystems operation, which among other things returns the file
 * system state.
 *
 * This operation accepts an optional `PerformanceMode` parameter that you choose
 * for your file system. We recommend `generalPurpose`
 * `PerformanceMode` for all file
 * systems. The `maxIO` mode is a previous generation performance type that is designed for highly parallelized workloads that can tolerate higher latencies
 * than the `generalPurpose` mode. `MaxIO` mode is not supported for One Zone file systems or
 * file systems that use Elastic throughput.
 *
 * The `PerformanceMode` can't be changed after the file system has been
 * created. For more information, see Amazon EFS performance
 * modes.
 *
 * You can set the throughput mode for the file system using the `ThroughputMode`
 * parameter.
 *
 * After the file system is fully created, Amazon EFS sets its lifecycle state to
 * `available`, at which point you can create one or more mount targets for the file
 * system in your VPC. For more information, see CreateMountTarget. You mount
 * your Amazon EFS file system on an EC2 instances in your VPC by using the mount
 * target. For more information, see Amazon EFS: How it Works.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:CreateFileSystem` action.
 *
 * File systems can be tagged on creation. If tags are specified in the creation action, IAM
 * performs additional authorization on the `elasticfilesystem:TagResource` action to
 * verify if users have permissions to create tags. Therefore, you must grant explicit
 * permissions to use the `elasticfilesystem:TagResource` action. For more
 * information, see Granting permissions to tag resources during creation.
 */
export const createFileSystem: (
  input: CreateFileSystemRequest,
) => effect.Effect<
  FileSystemDescription,
  | BadRequest
  | FileSystemAlreadyExists
  | FileSystemLimitExceeded
  | InsufficientThroughputCapacity
  | InternalServerError
  | ThroughputLimitExceeded
  | UnsupportedAvailabilityZone
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFileSystemRequest,
  output: FileSystemDescription,
  errors: [
    BadRequest,
    FileSystemAlreadyExists,
    FileSystemLimitExceeded,
    InsufficientThroughputCapacity,
    InternalServerError,
    ThroughputLimitExceeded,
    UnsupportedAvailabilityZone,
  ],
}));
/**
 * Updates protection on the file system.
 *
 * This operation requires permissions for the
 * `elasticfilesystem:UpdateFileSystemProtection` action.
 */
export const updateFileSystemProtection: (
  input: UpdateFileSystemProtectionRequest,
) => effect.Effect<
  FileSystemProtectionDescription,
  | BadRequest
  | FileSystemNotFound
  | IncorrectFileSystemLifeCycleState
  | InsufficientThroughputCapacity
  | InternalServerError
  | ReplicationAlreadyExists
  | ThroughputLimitExceeded
  | TooManyRequests
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFileSystemProtectionRequest,
  output: FileSystemProtectionDescription,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InsufficientThroughputCapacity,
    InternalServerError,
    ReplicationAlreadyExists,
    ThroughputLimitExceeded,
    TooManyRequests,
  ],
}));
/**
 * Creates a replication conﬁguration to either a new or existing EFS file system.
 * For more information, see Amazon EFS replication in the Amazon EFS User
 * Guide. The replication configuration specifies the following:
 *
 * - **Source file system** – The EFS file
 * system that you want to replicate.
 *
 * - **Destination file system** – The destination file
 * system to which the source file system is replicated. There can only be one destination
 * file system in a replication configuration.
 *
 * A file system can be part of only one replication configuration.
 *
 * The destination parameters for the replication configuration depend on
 * whether you are replicating to a new file system or to an existing file system, and if you
 * are replicating across Amazon Web Services accounts. See DestinationToCreate for more information.
 *
 * This operation requires permissions for the `elasticfilesystem:CreateReplicationConfiguration`
 * action. Additionally, other permissions are required depending on how you are replicating file systems.
 * For more information, see Required permissions for replication
 * in the Amazon EFS User
 * Guide.
 */
export const createReplicationConfiguration: (
  input: CreateReplicationConfigurationRequest,
) => effect.Effect<
  ReplicationConfigurationDescription,
  | BadRequest
  | ConflictException
  | FileSystemLimitExceeded
  | FileSystemNotFound
  | IncorrectFileSystemLifeCycleState
  | InsufficientThroughputCapacity
  | InternalServerError
  | ReplicationNotFound
  | ThroughputLimitExceeded
  | UnsupportedAvailabilityZone
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReplicationConfigurationRequest,
  output: ReplicationConfigurationDescription,
  errors: [
    BadRequest,
    ConflictException,
    FileSystemLimitExceeded,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InsufficientThroughputCapacity,
    InternalServerError,
    ReplicationNotFound,
    ThroughputLimitExceeded,
    UnsupportedAvailabilityZone,
    ValidationException,
  ],
}));
/**
 * Updates the throughput mode or the amount of provisioned throughput of an existing file
 * system.
 */
export const updateFileSystem: (
  input: UpdateFileSystemRequest,
) => effect.Effect<
  FileSystemDescription,
  | BadRequest
  | FileSystemNotFound
  | IncorrectFileSystemLifeCycleState
  | InsufficientThroughputCapacity
  | InternalServerError
  | ThroughputLimitExceeded
  | TooManyRequests
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFileSystemRequest,
  output: FileSystemDescription,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InsufficientThroughputCapacity,
    InternalServerError,
    ThroughputLimitExceeded,
    TooManyRequests,
  ],
}));
/**
 * Creates a mount target for a file system. You can then mount the file system on EC2
 * instances by using the mount target.
 *
 * You can create one mount target in each Availability Zone in your VPC. All EC2 instances
 * in a VPC within a given Availability Zone share a single mount target for a given file system. If
 * you have multiple subnets in an Availability Zone, you create a mount target in one of the subnets.
 * EC2 instances do not need to be in the same subnet as the mount target in order to
 * access their file system.
 *
 * You can create only one mount target for a One Zone file system. You must
 * create that mount target in the same Availability Zone in which the file system is located. Use the
 * `AvailabilityZoneName` and `AvailabiltyZoneId` properties in the DescribeFileSystems response object to get this information. Use the
 * `subnetId` associated with the file system's Availability Zone when creating the mount
 * target.
 *
 * For more information, see Amazon EFS: How it Works.
 *
 * To create a mount target for a file system, the file system's lifecycle state must be
 * `available`. For more information, see DescribeFileSystems.
 *
 * In the request, provide the following:
 *
 * - The file system ID for which you are creating the mount
 * target.
 *
 * - A subnet ID, which determines the following:
 *
 * - The VPC in which Amazon EFS creates the mount target
 *
 * - The Availability Zone in which Amazon EFS creates the mount target
 *
 * - The IP address range from which Amazon EFS selects the IP address of the mount target
 * (if you don't specify an IP address in the request)
 *
 * After creating the mount target, Amazon EFS returns a response that includes, a
 * `MountTargetId` and an `IpAddress`. You use this IP address when
 * mounting the file system in an EC2 instance. You can also use the mount target's
 * DNS name when mounting the file system. The EC2 instance on which you mount the file
 * system by using the mount target can resolve the mount target's DNS name to its IP
 * address. For more information, see How it Works:
 * Implementation Overview.
 *
 * Note that you can create mount targets for a file system in only one VPC, and there can be
 * only one mount target per Availability Zone. That is, if the file system already has one or more
 * mount targets created for it, the subnet specified in the request to add another mount target
 * must meet the following requirements:
 *
 * - Must belong to the same VPC as the subnets of the existing mount targets
 *
 * - Must not be in the same Availability Zone as any of the subnets of the existing mount
 * targets
 *
 * If the request satisfies the requirements, Amazon EFS does the following:
 *
 * - Creates a new mount target in the specified subnet.
 *
 * - Also creates a new network interface in the subnet as follows:
 *
 * - If the request provides an `IpAddress`, Amazon EFS assigns that
 * IP address to the network interface. Otherwise, Amazon EFS assigns a free
 * address in the subnet (in the same way that the Amazon EC2
 * `CreateNetworkInterface` call does when a request does not specify a
 * primary private IP address).
 *
 * - If the request provides `SecurityGroups`, this network interface is
 * associated with those security groups. Otherwise, it belongs to the default security
 * group for the subnet's VPC.
 *
 * - Assigns the description Mount target *fsmt-id* for
 * file system *fs-id*
 * where
 * *fsmt-id*
 * is the mount target ID, and
 * *fs-id*
 * is the `FileSystemId`.
 *
 * - Sets the `requesterManaged` property of the network interface to
 * `true`, and the `requesterId` value to
 * `EFS`.
 *
 * Each Amazon EFS mount target has one corresponding requester-managed
 * EC2 network interface. After the network interface is created, Amazon EFS
 * sets the `NetworkInterfaceId` field in the mount target's description to
 * the network interface ID, and the `IpAddress` field to its address. If network
 * interface creation fails, the entire `CreateMountTarget` operation
 * fails.
 *
 * The `CreateMountTarget` call returns only after creating the network
 * interface, but while the mount target state is still `creating`, you can check
 * the mount target creation status by calling the DescribeMountTargets operation, which among other things returns the mount
 * target state.
 *
 * We recommend that you create a mount target in each of the Availability Zones. There are cost
 * considerations for using a file system in an Availability Zone through a mount target created in
 * another Availability Zone. For more information, see Amazon EFS pricing. In addition, by always using a mount target local to the
 * instance's Availability Zone, you eliminate a partial failure scenario. If the Availability Zone in
 * which your mount target is created goes down, then you can't access your file system
 * through that mount target.
 *
 * This operation requires permissions for the following action on the file
 * system:
 *
 * - `elasticfilesystem:CreateMountTarget`
 *
 * This operation also requires permissions for the following Amazon EC2
 * actions:
 *
 * - `ec2:DescribeSubnets`
 *
 * - `ec2:DescribeNetworkInterfaces`
 *
 * - `ec2:CreateNetworkInterface`
 */
export const createMountTarget: (
  input: CreateMountTargetRequest,
) => effect.Effect<
  MountTargetDescription,
  | AvailabilityZonesMismatch
  | BadRequest
  | FileSystemNotFound
  | IncorrectFileSystemLifeCycleState
  | InternalServerError
  | IpAddressInUse
  | MountTargetConflict
  | NetworkInterfaceLimitExceeded
  | NoFreeAddressesInSubnet
  | SecurityGroupLimitExceeded
  | SecurityGroupNotFound
  | SubnetNotFound
  | UnsupportedAvailabilityZone
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMountTargetRequest,
  output: MountTargetDescription,
  errors: [
    AvailabilityZonesMismatch,
    BadRequest,
    FileSystemNotFound,
    IncorrectFileSystemLifeCycleState,
    InternalServerError,
    IpAddressInUse,
    MountTargetConflict,
    NetworkInterfaceLimitExceeded,
    NoFreeAddressesInSubnet,
    SecurityGroupLimitExceeded,
    SecurityGroupNotFound,
    SubnetNotFound,
    UnsupportedAvailabilityZone,
  ],
}));
