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
  sdkId: "DataSync",
  serviceShapeName: "FmrsService",
});
const auth = T.AwsAuthSigv4({ name: "datasync" });
const ver = T.ServiceVersion("2018-11-09");
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
              `https://datasync-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://datasync-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://datasync.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://datasync.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type TaskExecutionArn = string;
export type ActivationKey = string;
export type TagValue = string;
export type VpcEndpointId = string;
export type Ec2SubnetArn = string;
export type Ec2SecurityGroupArn = string;
export type AzureBlobContainerUrl = string;
export type AzureBlobSubdirectory = string;
export type AgentArn = string;
export type EfsSubdirectory = string;
export type EfsFilesystemArn = string;
export type EfsAccessPointArn = string;
export type IamRoleArn = string;
export type FsxFilesystemArn = string;
export type FsxLustreSubdirectory = string;
export type StorageVirtualMachineArn = string;
export type FsxOntapSubdirectory = string;
export type FsxOpenZfsSubdirectory = string;
export type FsxWindowsSubdirectory = string;
export type SmbUser = string;
export type SmbDomain = string;
export type SmbPassword = string | Redacted.Redacted<string>;
export type HdfsSubdirectory = string;
export type HdfsBlockSize = number;
export type HdfsReplicationFactor = number;
export type KmsKeyProviderUri = string;
export type HdfsUser = string;
export type KerberosPrincipal = string;
export type NfsSubdirectory = string;
export type ServerHostname = string;
export type ObjectStorageServerPort = number;
export type S3Subdirectory = string;
export type ObjectStorageBucketName = string;
export type ObjectStorageAccessKey = string;
export type ObjectStorageSecretKey = string | Redacted.Redacted<string>;
export type S3BucketArn = string;
export type SmbSubdirectory = string;
export type ServerIpAddress = string;
export type LocationArn = string;
export type LogGroupArn = string;
export type TaskArn = string;
export type MaxResults = number;
export type NextToken = string;
export type TaggableResourceArn = string;
export type TagKey = string;
export type UpdatedEfsAccessPointArn = string;
export type UpdatedEfsIamRoleArn = string;
export type UpdateSmbDomain = string;
export type AzureBlobSasToken = string | Redacted.Redacted<string>;
export type SecretArn = string;
export type KmsKeyArn = string;
export type IamRoleArnOrEmptyString = string;
export type HdfsServerHostname = string;
export type HdfsServerPort = number;
export type BytesPerSecond = number;
export type FilterValue = string;
export type ScheduleExpressionCron = string;
export type FilterAttributeValue = string;
export type LocationUri = string;
export type NetworkInterfaceArn = string;
export type long = number;
export type ItemCount = number;
export type Endpoint = string;
export type AgentVersion = string;
export type ScheduleDisabledReason = string;
export type Duration = number;
export type S3ObjectVersionId = string;

//# Schemas
export type PLSubnetArnList = string[];
export const PLSubnetArnList = S.Array(S.String);
export type PLSecurityGroupArnList = string[];
export const PLSecurityGroupArnList = S.Array(S.String);
export type AgentArnList = string[];
export const AgentArnList = S.Array(S.String);
export type Ec2SecurityGroupArnList = string[];
export const Ec2SecurityGroupArnList = S.Array(S.String);
export type DnsIpList = string[];
export const DnsIpList = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface CancelTaskExecutionRequest {
  TaskExecutionArn: string;
}
export const CancelTaskExecutionRequest = S.suspend(() =>
  S.Struct({ TaskExecutionArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelTaskExecutionRequest",
}) as any as S.Schema<CancelTaskExecutionRequest>;
export interface CancelTaskExecutionResponse {}
export const CancelTaskExecutionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelTaskExecutionResponse",
}) as any as S.Schema<CancelTaskExecutionResponse>;
export interface TagListEntry {
  Key: string;
  Value?: string;
}
export const TagListEntry = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.optional(S.String) }),
).annotations({ identifier: "TagListEntry" }) as any as S.Schema<TagListEntry>;
export type InputTagList = TagListEntry[];
export const InputTagList = S.Array(TagListEntry);
export interface CreateLocationFsxLustreRequest {
  FsxFilesystemArn: string;
  SecurityGroupArns: Ec2SecurityGroupArnList;
  Subdirectory?: string;
  Tags?: InputTagList;
}
export const CreateLocationFsxLustreRequest = S.suspend(() =>
  S.Struct({
    FsxFilesystemArn: S.String,
    SecurityGroupArns: Ec2SecurityGroupArnList,
    Subdirectory: S.optional(S.String),
    Tags: S.optional(InputTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLocationFsxLustreRequest",
}) as any as S.Schema<CreateLocationFsxLustreRequest>;
export interface NfsMountOptions {
  Version?: string;
}
export const NfsMountOptions = S.suspend(() =>
  S.Struct({ Version: S.optional(S.String) }),
).annotations({
  identifier: "NfsMountOptions",
}) as any as S.Schema<NfsMountOptions>;
export interface FsxProtocolNfs {
  MountOptions?: NfsMountOptions;
}
export const FsxProtocolNfs = S.suspend(() =>
  S.Struct({ MountOptions: S.optional(NfsMountOptions) }),
).annotations({
  identifier: "FsxProtocolNfs",
}) as any as S.Schema<FsxProtocolNfs>;
export interface SmbMountOptions {
  Version?: string;
}
export const SmbMountOptions = S.suspend(() =>
  S.Struct({ Version: S.optional(S.String) }),
).annotations({
  identifier: "SmbMountOptions",
}) as any as S.Schema<SmbMountOptions>;
export interface FsxProtocolSmb {
  Domain?: string;
  MountOptions?: SmbMountOptions;
  Password: string | Redacted.Redacted<string>;
  User: string;
}
export const FsxProtocolSmb = S.suspend(() =>
  S.Struct({
    Domain: S.optional(S.String),
    MountOptions: S.optional(SmbMountOptions),
    Password: SensitiveString,
    User: S.String,
  }),
).annotations({
  identifier: "FsxProtocolSmb",
}) as any as S.Schema<FsxProtocolSmb>;
export interface FsxProtocol {
  NFS?: FsxProtocolNfs;
  SMB?: FsxProtocolSmb;
}
export const FsxProtocol = S.suspend(() =>
  S.Struct({
    NFS: S.optional(FsxProtocolNfs),
    SMB: S.optional(FsxProtocolSmb),
  }),
).annotations({ identifier: "FsxProtocol" }) as any as S.Schema<FsxProtocol>;
export interface CreateLocationFsxOpenZfsRequest {
  FsxFilesystemArn: string;
  Protocol: FsxProtocol;
  SecurityGroupArns: Ec2SecurityGroupArnList;
  Subdirectory?: string;
  Tags?: InputTagList;
}
export const CreateLocationFsxOpenZfsRequest = S.suspend(() =>
  S.Struct({
    FsxFilesystemArn: S.String,
    Protocol: FsxProtocol,
    SecurityGroupArns: Ec2SecurityGroupArnList,
    Subdirectory: S.optional(S.String),
    Tags: S.optional(InputTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLocationFsxOpenZfsRequest",
}) as any as S.Schema<CreateLocationFsxOpenZfsRequest>;
export interface CreateLocationFsxWindowsRequest {
  Subdirectory?: string;
  FsxFilesystemArn: string;
  SecurityGroupArns: Ec2SecurityGroupArnList;
  Tags?: InputTagList;
  User: string;
  Domain?: string;
  Password: string | Redacted.Redacted<string>;
}
export const CreateLocationFsxWindowsRequest = S.suspend(() =>
  S.Struct({
    Subdirectory: S.optional(S.String),
    FsxFilesystemArn: S.String,
    SecurityGroupArns: Ec2SecurityGroupArnList,
    Tags: S.optional(InputTagList),
    User: S.String,
    Domain: S.optional(S.String),
    Password: SensitiveString,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLocationFsxWindowsRequest",
}) as any as S.Schema<CreateLocationFsxWindowsRequest>;
export interface CmkSecretConfig {
  SecretArn?: string;
  KmsKeyArn?: string;
}
export const CmkSecretConfig = S.suspend(() =>
  S.Struct({
    SecretArn: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CmkSecretConfig",
}) as any as S.Schema<CmkSecretConfig>;
export interface CustomSecretConfig {
  SecretArn?: string;
  SecretAccessRoleArn?: string;
}
export const CustomSecretConfig = S.suspend(() =>
  S.Struct({
    SecretArn: S.optional(S.String),
    SecretAccessRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomSecretConfig",
}) as any as S.Schema<CustomSecretConfig>;
export interface CreateLocationObjectStorageRequest {
  ServerHostname: string;
  ServerPort?: number;
  ServerProtocol?: string;
  Subdirectory?: string;
  BucketName: string;
  AccessKey?: string;
  SecretKey?: string | Redacted.Redacted<string>;
  AgentArns?: AgentArnList;
  Tags?: InputTagList;
  ServerCertificate?: Uint8Array;
  CmkSecretConfig?: CmkSecretConfig;
  CustomSecretConfig?: CustomSecretConfig;
}
export const CreateLocationObjectStorageRequest = S.suspend(() =>
  S.Struct({
    ServerHostname: S.String,
    ServerPort: S.optional(S.Number),
    ServerProtocol: S.optional(S.String),
    Subdirectory: S.optional(S.String),
    BucketName: S.String,
    AccessKey: S.optional(S.String),
    SecretKey: S.optional(SensitiveString),
    AgentArns: S.optional(AgentArnList),
    Tags: S.optional(InputTagList),
    ServerCertificate: S.optional(T.Blob),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLocationObjectStorageRequest",
}) as any as S.Schema<CreateLocationObjectStorageRequest>;
export interface DeleteAgentRequest {
  AgentArn: string;
}
export const DeleteAgentRequest = S.suspend(() =>
  S.Struct({ AgentArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAgentRequest",
}) as any as S.Schema<DeleteAgentRequest>;
export interface DeleteAgentResponse {}
export const DeleteAgentResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAgentResponse",
}) as any as S.Schema<DeleteAgentResponse>;
export interface DeleteLocationRequest {
  LocationArn: string;
}
export const DeleteLocationRequest = S.suspend(() =>
  S.Struct({ LocationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteLocationRequest",
}) as any as S.Schema<DeleteLocationRequest>;
export interface DeleteLocationResponse {}
export const DeleteLocationResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteLocationResponse" },
) as any as S.Schema<DeleteLocationResponse>;
export interface DeleteTaskRequest {
  TaskArn: string;
}
export const DeleteTaskRequest = S.suspend(() =>
  S.Struct({ TaskArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteTaskRequest",
}) as any as S.Schema<DeleteTaskRequest>;
export interface DeleteTaskResponse {}
export const DeleteTaskResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteTaskResponse",
}) as any as S.Schema<DeleteTaskResponse>;
export interface DescribeAgentRequest {
  AgentArn: string;
}
export const DescribeAgentRequest = S.suspend(() =>
  S.Struct({ AgentArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAgentRequest",
}) as any as S.Schema<DescribeAgentRequest>;
export interface DescribeLocationAzureBlobRequest {
  LocationArn: string;
}
export const DescribeLocationAzureBlobRequest = S.suspend(() =>
  S.Struct({ LocationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLocationAzureBlobRequest",
}) as any as S.Schema<DescribeLocationAzureBlobRequest>;
export interface DescribeLocationEfsRequest {
  LocationArn: string;
}
export const DescribeLocationEfsRequest = S.suspend(() =>
  S.Struct({ LocationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLocationEfsRequest",
}) as any as S.Schema<DescribeLocationEfsRequest>;
export interface DescribeLocationFsxLustreRequest {
  LocationArn: string;
}
export const DescribeLocationFsxLustreRequest = S.suspend(() =>
  S.Struct({ LocationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLocationFsxLustreRequest",
}) as any as S.Schema<DescribeLocationFsxLustreRequest>;
export interface DescribeLocationFsxOntapRequest {
  LocationArn: string;
}
export const DescribeLocationFsxOntapRequest = S.suspend(() =>
  S.Struct({ LocationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLocationFsxOntapRequest",
}) as any as S.Schema<DescribeLocationFsxOntapRequest>;
export interface DescribeLocationFsxOpenZfsRequest {
  LocationArn: string;
}
export const DescribeLocationFsxOpenZfsRequest = S.suspend(() =>
  S.Struct({ LocationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLocationFsxOpenZfsRequest",
}) as any as S.Schema<DescribeLocationFsxOpenZfsRequest>;
export interface DescribeLocationFsxWindowsRequest {
  LocationArn: string;
}
export const DescribeLocationFsxWindowsRequest = S.suspend(() =>
  S.Struct({ LocationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLocationFsxWindowsRequest",
}) as any as S.Schema<DescribeLocationFsxWindowsRequest>;
export interface DescribeLocationHdfsRequest {
  LocationArn: string;
}
export const DescribeLocationHdfsRequest = S.suspend(() =>
  S.Struct({ LocationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLocationHdfsRequest",
}) as any as S.Schema<DescribeLocationHdfsRequest>;
export interface DescribeLocationNfsRequest {
  LocationArn: string;
}
export const DescribeLocationNfsRequest = S.suspend(() =>
  S.Struct({ LocationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLocationNfsRequest",
}) as any as S.Schema<DescribeLocationNfsRequest>;
export interface DescribeLocationObjectStorageRequest {
  LocationArn: string;
}
export const DescribeLocationObjectStorageRequest = S.suspend(() =>
  S.Struct({ LocationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLocationObjectStorageRequest",
}) as any as S.Schema<DescribeLocationObjectStorageRequest>;
export interface DescribeLocationS3Request {
  LocationArn: string;
}
export const DescribeLocationS3Request = S.suspend(() =>
  S.Struct({ LocationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLocationS3Request",
}) as any as S.Schema<DescribeLocationS3Request>;
export interface DescribeLocationSmbRequest {
  LocationArn: string;
}
export const DescribeLocationSmbRequest = S.suspend(() =>
  S.Struct({ LocationArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeLocationSmbRequest",
}) as any as S.Schema<DescribeLocationSmbRequest>;
export interface DescribeTaskRequest {
  TaskArn: string;
}
export const DescribeTaskRequest = S.suspend(() =>
  S.Struct({ TaskArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeTaskRequest",
}) as any as S.Schema<DescribeTaskRequest>;
export interface DescribeTaskExecutionRequest {
  TaskExecutionArn: string;
}
export const DescribeTaskExecutionRequest = S.suspend(() =>
  S.Struct({ TaskExecutionArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeTaskExecutionRequest",
}) as any as S.Schema<DescribeTaskExecutionRequest>;
export interface ListAgentsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListAgentsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAgentsRequest",
}) as any as S.Schema<ListAgentsRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ListTaskExecutionsRequest {
  TaskArn?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTaskExecutionsRequest = S.suspend(() =>
  S.Struct({
    TaskArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTaskExecutionsRequest",
}) as any as S.Schema<ListTaskExecutionsRequest>;
export interface Options {
  VerifyMode?: string;
  OverwriteMode?: string;
  Atime?: string;
  Mtime?: string;
  Uid?: string;
  Gid?: string;
  PreserveDeletedFiles?: string;
  PreserveDevices?: string;
  PosixPermissions?: string;
  BytesPerSecond?: number;
  TaskQueueing?: string;
  LogLevel?: string;
  TransferMode?: string;
  SecurityDescriptorCopyFlags?: string;
  ObjectTags?: string;
}
export const Options = S.suspend(() =>
  S.Struct({
    VerifyMode: S.optional(S.String),
    OverwriteMode: S.optional(S.String),
    Atime: S.optional(S.String),
    Mtime: S.optional(S.String),
    Uid: S.optional(S.String),
    Gid: S.optional(S.String),
    PreserveDeletedFiles: S.optional(S.String),
    PreserveDevices: S.optional(S.String),
    PosixPermissions: S.optional(S.String),
    BytesPerSecond: S.optional(S.Number),
    TaskQueueing: S.optional(S.String),
    LogLevel: S.optional(S.String),
    TransferMode: S.optional(S.String),
    SecurityDescriptorCopyFlags: S.optional(S.String),
    ObjectTags: S.optional(S.String),
  }),
).annotations({ identifier: "Options" }) as any as S.Schema<Options>;
export interface FilterRule {
  FilterType?: string;
  Value?: string;
}
export const FilterRule = S.suspend(() =>
  S.Struct({ FilterType: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "FilterRule" }) as any as S.Schema<FilterRule>;
export type FilterList = FilterRule[];
export const FilterList = S.Array(FilterRule);
export interface S3ManifestConfig {
  ManifestObjectPath: string;
  BucketAccessRoleArn: string;
  S3BucketArn: string;
  ManifestObjectVersionId?: string;
}
export const S3ManifestConfig = S.suspend(() =>
  S.Struct({
    ManifestObjectPath: S.String,
    BucketAccessRoleArn: S.String,
    S3BucketArn: S.String,
    ManifestObjectVersionId: S.optional(S.String),
  }),
).annotations({
  identifier: "S3ManifestConfig",
}) as any as S.Schema<S3ManifestConfig>;
export interface SourceManifestConfig {
  S3: S3ManifestConfig;
}
export const SourceManifestConfig = S.suspend(() =>
  S.Struct({ S3: S3ManifestConfig }),
).annotations({
  identifier: "SourceManifestConfig",
}) as any as S.Schema<SourceManifestConfig>;
export interface ManifestConfig {
  Action?: string;
  Format?: string;
  Source?: SourceManifestConfig;
}
export const ManifestConfig = S.suspend(() =>
  S.Struct({
    Action: S.optional(S.String),
    Format: S.optional(S.String),
    Source: S.optional(SourceManifestConfig),
  }),
).annotations({
  identifier: "ManifestConfig",
}) as any as S.Schema<ManifestConfig>;
export interface ReportDestinationS3 {
  Subdirectory?: string;
  S3BucketArn: string;
  BucketAccessRoleArn: string;
}
export const ReportDestinationS3 = S.suspend(() =>
  S.Struct({
    Subdirectory: S.optional(S.String),
    S3BucketArn: S.String,
    BucketAccessRoleArn: S.String,
  }),
).annotations({
  identifier: "ReportDestinationS3",
}) as any as S.Schema<ReportDestinationS3>;
export interface ReportDestination {
  S3?: ReportDestinationS3;
}
export const ReportDestination = S.suspend(() =>
  S.Struct({ S3: S.optional(ReportDestinationS3) }),
).annotations({
  identifier: "ReportDestination",
}) as any as S.Schema<ReportDestination>;
export interface ReportOverride {
  ReportLevel?: string;
}
export const ReportOverride = S.suspend(() =>
  S.Struct({ ReportLevel: S.optional(S.String) }),
).annotations({
  identifier: "ReportOverride",
}) as any as S.Schema<ReportOverride>;
export interface ReportOverrides {
  Transferred?: ReportOverride;
  Verified?: ReportOverride;
  Deleted?: ReportOverride;
  Skipped?: ReportOverride;
}
export const ReportOverrides = S.suspend(() =>
  S.Struct({
    Transferred: S.optional(ReportOverride),
    Verified: S.optional(ReportOverride),
    Deleted: S.optional(ReportOverride),
    Skipped: S.optional(ReportOverride),
  }),
).annotations({
  identifier: "ReportOverrides",
}) as any as S.Schema<ReportOverrides>;
export interface TaskReportConfig {
  Destination?: ReportDestination;
  OutputType?: string;
  ReportLevel?: string;
  ObjectVersionIds?: string;
  Overrides?: ReportOverrides;
}
export const TaskReportConfig = S.suspend(() =>
  S.Struct({
    Destination: S.optional(ReportDestination),
    OutputType: S.optional(S.String),
    ReportLevel: S.optional(S.String),
    ObjectVersionIds: S.optional(S.String),
    Overrides: S.optional(ReportOverrides),
  }),
).annotations({
  identifier: "TaskReportConfig",
}) as any as S.Schema<TaskReportConfig>;
export interface StartTaskExecutionRequest {
  TaskArn: string;
  OverrideOptions?: Options;
  Includes?: FilterList;
  Excludes?: FilterList;
  ManifestConfig?: ManifestConfig;
  TaskReportConfig?: TaskReportConfig;
  Tags?: InputTagList;
}
export const StartTaskExecutionRequest = S.suspend(() =>
  S.Struct({
    TaskArn: S.String,
    OverrideOptions: S.optional(Options),
    Includes: S.optional(FilterList),
    Excludes: S.optional(FilterList),
    ManifestConfig: S.optional(ManifestConfig),
    TaskReportConfig: S.optional(TaskReportConfig),
    Tags: S.optional(InputTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartTaskExecutionRequest",
}) as any as S.Schema<StartTaskExecutionRequest>;
export interface TagResourceRequest {
  ResourceArn: string;
  Tags: InputTagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Tags: InputTagList }).pipe(
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
  ResourceArn: string;
  Keys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, Keys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateAgentRequest {
  AgentArn: string;
  Name?: string;
}
export const UpdateAgentRequest = S.suspend(() =>
  S.Struct({ AgentArn: S.String, Name: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAgentRequest",
}) as any as S.Schema<UpdateAgentRequest>;
export interface UpdateAgentResponse {}
export const UpdateAgentResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateAgentResponse",
}) as any as S.Schema<UpdateAgentResponse>;
export interface AzureBlobSasConfiguration {
  Token: string | Redacted.Redacted<string>;
}
export const AzureBlobSasConfiguration = S.suspend(() =>
  S.Struct({ Token: SensitiveString }),
).annotations({
  identifier: "AzureBlobSasConfiguration",
}) as any as S.Schema<AzureBlobSasConfiguration>;
export interface UpdateLocationAzureBlobRequest {
  LocationArn: string;
  Subdirectory?: string;
  AuthenticationType?: string;
  SasConfiguration?: AzureBlobSasConfiguration;
  BlobType?: string;
  AccessTier?: string;
  AgentArns?: AgentArnList;
  CmkSecretConfig?: CmkSecretConfig;
  CustomSecretConfig?: CustomSecretConfig;
}
export const UpdateLocationAzureBlobRequest = S.suspend(() =>
  S.Struct({
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    AuthenticationType: S.optional(S.String),
    SasConfiguration: S.optional(AzureBlobSasConfiguration),
    BlobType: S.optional(S.String),
    AccessTier: S.optional(S.String),
    AgentArns: S.optional(AgentArnList),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLocationAzureBlobRequest",
}) as any as S.Schema<UpdateLocationAzureBlobRequest>;
export interface UpdateLocationAzureBlobResponse {}
export const UpdateLocationAzureBlobResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLocationAzureBlobResponse",
}) as any as S.Schema<UpdateLocationAzureBlobResponse>;
export interface UpdateLocationEfsRequest {
  LocationArn: string;
  Subdirectory?: string;
  AccessPointArn?: string;
  FileSystemAccessRoleArn?: string;
  InTransitEncryption?: string;
}
export const UpdateLocationEfsRequest = S.suspend(() =>
  S.Struct({
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    AccessPointArn: S.optional(S.String),
    FileSystemAccessRoleArn: S.optional(S.String),
    InTransitEncryption: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLocationEfsRequest",
}) as any as S.Schema<UpdateLocationEfsRequest>;
export interface UpdateLocationEfsResponse {}
export const UpdateLocationEfsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLocationEfsResponse",
}) as any as S.Schema<UpdateLocationEfsResponse>;
export interface UpdateLocationFsxLustreRequest {
  LocationArn: string;
  Subdirectory?: string;
}
export const UpdateLocationFsxLustreRequest = S.suspend(() =>
  S.Struct({ LocationArn: S.String, Subdirectory: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLocationFsxLustreRequest",
}) as any as S.Schema<UpdateLocationFsxLustreRequest>;
export interface UpdateLocationFsxLustreResponse {}
export const UpdateLocationFsxLustreResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLocationFsxLustreResponse",
}) as any as S.Schema<UpdateLocationFsxLustreResponse>;
export interface UpdateLocationFsxOpenZfsRequest {
  LocationArn: string;
  Protocol?: FsxProtocol;
  Subdirectory?: string;
}
export const UpdateLocationFsxOpenZfsRequest = S.suspend(() =>
  S.Struct({
    LocationArn: S.String,
    Protocol: S.optional(FsxProtocol),
    Subdirectory: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLocationFsxOpenZfsRequest",
}) as any as S.Schema<UpdateLocationFsxOpenZfsRequest>;
export interface UpdateLocationFsxOpenZfsResponse {}
export const UpdateLocationFsxOpenZfsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLocationFsxOpenZfsResponse",
}) as any as S.Schema<UpdateLocationFsxOpenZfsResponse>;
export interface UpdateLocationFsxWindowsRequest {
  LocationArn: string;
  Subdirectory?: string;
  Domain?: string;
  User?: string;
  Password?: string | Redacted.Redacted<string>;
}
export const UpdateLocationFsxWindowsRequest = S.suspend(() =>
  S.Struct({
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    Domain: S.optional(S.String),
    User: S.optional(S.String),
    Password: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLocationFsxWindowsRequest",
}) as any as S.Schema<UpdateLocationFsxWindowsRequest>;
export interface UpdateLocationFsxWindowsResponse {}
export const UpdateLocationFsxWindowsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLocationFsxWindowsResponse",
}) as any as S.Schema<UpdateLocationFsxWindowsResponse>;
export interface HdfsNameNode {
  Hostname: string;
  Port: number;
}
export const HdfsNameNode = S.suspend(() =>
  S.Struct({ Hostname: S.String, Port: S.Number }),
).annotations({ identifier: "HdfsNameNode" }) as any as S.Schema<HdfsNameNode>;
export type HdfsNameNodeList = HdfsNameNode[];
export const HdfsNameNodeList = S.Array(HdfsNameNode);
export interface QopConfiguration {
  RpcProtection?: string;
  DataTransferProtection?: string;
}
export const QopConfiguration = S.suspend(() =>
  S.Struct({
    RpcProtection: S.optional(S.String),
    DataTransferProtection: S.optional(S.String),
  }),
).annotations({
  identifier: "QopConfiguration",
}) as any as S.Schema<QopConfiguration>;
export interface UpdateLocationHdfsRequest {
  LocationArn: string;
  Subdirectory?: string;
  NameNodes?: HdfsNameNodeList;
  BlockSize?: number;
  ReplicationFactor?: number;
  KmsKeyProviderUri?: string;
  QopConfiguration?: QopConfiguration;
  AuthenticationType?: string;
  SimpleUser?: string;
  KerberosPrincipal?: string;
  KerberosKeytab?: Uint8Array;
  KerberosKrb5Conf?: Uint8Array;
  AgentArns?: AgentArnList;
}
export const UpdateLocationHdfsRequest = S.suspend(() =>
  S.Struct({
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    NameNodes: S.optional(HdfsNameNodeList),
    BlockSize: S.optional(S.Number),
    ReplicationFactor: S.optional(S.Number),
    KmsKeyProviderUri: S.optional(S.String),
    QopConfiguration: S.optional(QopConfiguration),
    AuthenticationType: S.optional(S.String),
    SimpleUser: S.optional(S.String),
    KerberosPrincipal: S.optional(S.String),
    KerberosKeytab: S.optional(T.Blob),
    KerberosKrb5Conf: S.optional(T.Blob),
    AgentArns: S.optional(AgentArnList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLocationHdfsRequest",
}) as any as S.Schema<UpdateLocationHdfsRequest>;
export interface UpdateLocationHdfsResponse {}
export const UpdateLocationHdfsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLocationHdfsResponse",
}) as any as S.Schema<UpdateLocationHdfsResponse>;
export interface OnPremConfig {
  AgentArns: AgentArnList;
}
export const OnPremConfig = S.suspend(() =>
  S.Struct({ AgentArns: AgentArnList }),
).annotations({ identifier: "OnPremConfig" }) as any as S.Schema<OnPremConfig>;
export interface UpdateLocationNfsRequest {
  LocationArn: string;
  Subdirectory?: string;
  ServerHostname?: string;
  OnPremConfig?: OnPremConfig;
  MountOptions?: NfsMountOptions;
}
export const UpdateLocationNfsRequest = S.suspend(() =>
  S.Struct({
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    ServerHostname: S.optional(S.String),
    OnPremConfig: S.optional(OnPremConfig),
    MountOptions: S.optional(NfsMountOptions),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLocationNfsRequest",
}) as any as S.Schema<UpdateLocationNfsRequest>;
export interface UpdateLocationNfsResponse {}
export const UpdateLocationNfsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLocationNfsResponse",
}) as any as S.Schema<UpdateLocationNfsResponse>;
export interface UpdateLocationObjectStorageRequest {
  LocationArn: string;
  ServerPort?: number;
  ServerProtocol?: string;
  Subdirectory?: string;
  ServerHostname?: string;
  AccessKey?: string;
  SecretKey?: string | Redacted.Redacted<string>;
  AgentArns?: AgentArnList;
  ServerCertificate?: Uint8Array;
  CmkSecretConfig?: CmkSecretConfig;
  CustomSecretConfig?: CustomSecretConfig;
}
export const UpdateLocationObjectStorageRequest = S.suspend(() =>
  S.Struct({
    LocationArn: S.String,
    ServerPort: S.optional(S.Number),
    ServerProtocol: S.optional(S.String),
    Subdirectory: S.optional(S.String),
    ServerHostname: S.optional(S.String),
    AccessKey: S.optional(S.String),
    SecretKey: S.optional(SensitiveString),
    AgentArns: S.optional(AgentArnList),
    ServerCertificate: S.optional(T.Blob),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLocationObjectStorageRequest",
}) as any as S.Schema<UpdateLocationObjectStorageRequest>;
export interface UpdateLocationObjectStorageResponse {}
export const UpdateLocationObjectStorageResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLocationObjectStorageResponse",
}) as any as S.Schema<UpdateLocationObjectStorageResponse>;
export interface S3Config {
  BucketAccessRoleArn: string;
}
export const S3Config = S.suspend(() =>
  S.Struct({ BucketAccessRoleArn: S.String }),
).annotations({ identifier: "S3Config" }) as any as S.Schema<S3Config>;
export interface UpdateLocationS3Request {
  LocationArn: string;
  Subdirectory?: string;
  S3StorageClass?: string;
  S3Config?: S3Config;
}
export const UpdateLocationS3Request = S.suspend(() =>
  S.Struct({
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    S3StorageClass: S.optional(S.String),
    S3Config: S.optional(S3Config),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLocationS3Request",
}) as any as S.Schema<UpdateLocationS3Request>;
export interface UpdateLocationS3Response {}
export const UpdateLocationS3Response = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLocationS3Response",
}) as any as S.Schema<UpdateLocationS3Response>;
export interface UpdateLocationSmbRequest {
  LocationArn: string;
  Subdirectory?: string;
  ServerHostname?: string;
  User?: string;
  Domain?: string;
  Password?: string | Redacted.Redacted<string>;
  CmkSecretConfig?: CmkSecretConfig;
  CustomSecretConfig?: CustomSecretConfig;
  AgentArns?: AgentArnList;
  MountOptions?: SmbMountOptions;
  AuthenticationType?: string;
  DnsIpAddresses?: DnsIpList;
  KerberosPrincipal?: string;
  KerberosKeytab?: Uint8Array;
  KerberosKrb5Conf?: Uint8Array;
}
export const UpdateLocationSmbRequest = S.suspend(() =>
  S.Struct({
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    ServerHostname: S.optional(S.String),
    User: S.optional(S.String),
    Domain: S.optional(S.String),
    Password: S.optional(SensitiveString),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
    AgentArns: S.optional(AgentArnList),
    MountOptions: S.optional(SmbMountOptions),
    AuthenticationType: S.optional(S.String),
    DnsIpAddresses: S.optional(DnsIpList),
    KerberosPrincipal: S.optional(S.String),
    KerberosKeytab: S.optional(T.Blob),
    KerberosKrb5Conf: S.optional(T.Blob),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLocationSmbRequest",
}) as any as S.Schema<UpdateLocationSmbRequest>;
export interface UpdateLocationSmbResponse {}
export const UpdateLocationSmbResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLocationSmbResponse",
}) as any as S.Schema<UpdateLocationSmbResponse>;
export interface TaskSchedule {
  ScheduleExpression: string;
  Status?: string;
}
export const TaskSchedule = S.suspend(() =>
  S.Struct({ ScheduleExpression: S.String, Status: S.optional(S.String) }),
).annotations({ identifier: "TaskSchedule" }) as any as S.Schema<TaskSchedule>;
export interface UpdateTaskRequest {
  TaskArn: string;
  Options?: Options;
  Excludes?: FilterList;
  Schedule?: TaskSchedule;
  Name?: string;
  CloudWatchLogGroupArn?: string;
  Includes?: FilterList;
  ManifestConfig?: ManifestConfig;
  TaskReportConfig?: TaskReportConfig;
}
export const UpdateTaskRequest = S.suspend(() =>
  S.Struct({
    TaskArn: S.String,
    Options: S.optional(Options),
    Excludes: S.optional(FilterList),
    Schedule: S.optional(TaskSchedule),
    Name: S.optional(S.String),
    CloudWatchLogGroupArn: S.optional(S.String),
    Includes: S.optional(FilterList),
    ManifestConfig: S.optional(ManifestConfig),
    TaskReportConfig: S.optional(TaskReportConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateTaskRequest",
}) as any as S.Schema<UpdateTaskRequest>;
export interface UpdateTaskResponse {}
export const UpdateTaskResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateTaskResponse",
}) as any as S.Schema<UpdateTaskResponse>;
export interface UpdateTaskExecutionRequest {
  TaskExecutionArn: string;
  Options: Options;
}
export const UpdateTaskExecutionRequest = S.suspend(() =>
  S.Struct({ TaskExecutionArn: S.String, Options: Options }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateTaskExecutionRequest",
}) as any as S.Schema<UpdateTaskExecutionRequest>;
export interface UpdateTaskExecutionResponse {}
export const UpdateTaskExecutionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateTaskExecutionResponse",
}) as any as S.Schema<UpdateTaskExecutionResponse>;
export type FilterValues = string[];
export const FilterValues = S.Array(S.String);
export interface Ec2Config {
  SubnetArn: string;
  SecurityGroupArns: Ec2SecurityGroupArnList;
}
export const Ec2Config = S.suspend(() =>
  S.Struct({ SubnetArn: S.String, SecurityGroupArns: Ec2SecurityGroupArnList }),
).annotations({ identifier: "Ec2Config" }) as any as S.Schema<Ec2Config>;
export type SourceNetworkInterfaceArns = string[];
export const SourceNetworkInterfaceArns = S.Array(S.String);
export type DestinationNetworkInterfaceArns = string[];
export const DestinationNetworkInterfaceArns = S.Array(S.String);
export interface LocationFilter {
  Name: string;
  Values: FilterValues;
  Operator: string;
}
export const LocationFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValues, Operator: S.String }),
).annotations({
  identifier: "LocationFilter",
}) as any as S.Schema<LocationFilter>;
export type LocationFilters = LocationFilter[];
export const LocationFilters = S.Array(LocationFilter);
export type OutputTagList = TagListEntry[];
export const OutputTagList = S.Array(TagListEntry);
export interface TaskFilter {
  Name: string;
  Values: FilterValues;
  Operator: string;
}
export const TaskFilter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValues, Operator: S.String }),
).annotations({ identifier: "TaskFilter" }) as any as S.Schema<TaskFilter>;
export type TaskFilters = TaskFilter[];
export const TaskFilters = S.Array(TaskFilter);
export interface CreateAgentRequest {
  ActivationKey: string;
  AgentName?: string;
  Tags?: InputTagList;
  VpcEndpointId?: string;
  SubnetArns?: PLSubnetArnList;
  SecurityGroupArns?: PLSecurityGroupArnList;
}
export const CreateAgentRequest = S.suspend(() =>
  S.Struct({
    ActivationKey: S.String,
    AgentName: S.optional(S.String),
    Tags: S.optional(InputTagList),
    VpcEndpointId: S.optional(S.String),
    SubnetArns: S.optional(PLSubnetArnList),
    SecurityGroupArns: S.optional(PLSecurityGroupArnList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAgentRequest",
}) as any as S.Schema<CreateAgentRequest>;
export interface CreateLocationAzureBlobRequest {
  ContainerUrl: string;
  AuthenticationType: string;
  SasConfiguration?: AzureBlobSasConfiguration;
  BlobType?: string;
  AccessTier?: string;
  Subdirectory?: string;
  AgentArns?: AgentArnList;
  Tags?: InputTagList;
  CmkSecretConfig?: CmkSecretConfig;
  CustomSecretConfig?: CustomSecretConfig;
}
export const CreateLocationAzureBlobRequest = S.suspend(() =>
  S.Struct({
    ContainerUrl: S.String,
    AuthenticationType: S.String,
    SasConfiguration: S.optional(AzureBlobSasConfiguration),
    BlobType: S.optional(S.String),
    AccessTier: S.optional(S.String),
    Subdirectory: S.optional(S.String),
    AgentArns: S.optional(AgentArnList),
    Tags: S.optional(InputTagList),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLocationAzureBlobRequest",
}) as any as S.Schema<CreateLocationAzureBlobRequest>;
export interface CreateLocationEfsRequest {
  Subdirectory?: string;
  EfsFilesystemArn: string;
  Ec2Config: Ec2Config;
  Tags?: InputTagList;
  AccessPointArn?: string;
  FileSystemAccessRoleArn?: string;
  InTransitEncryption?: string;
}
export const CreateLocationEfsRequest = S.suspend(() =>
  S.Struct({
    Subdirectory: S.optional(S.String),
    EfsFilesystemArn: S.String,
    Ec2Config: Ec2Config,
    Tags: S.optional(InputTagList),
    AccessPointArn: S.optional(S.String),
    FileSystemAccessRoleArn: S.optional(S.String),
    InTransitEncryption: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLocationEfsRequest",
}) as any as S.Schema<CreateLocationEfsRequest>;
export interface CreateLocationFsxLustreResponse {
  LocationArn?: string;
}
export const CreateLocationFsxLustreResponse = S.suspend(() =>
  S.Struct({ LocationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLocationFsxLustreResponse",
}) as any as S.Schema<CreateLocationFsxLustreResponse>;
export interface CreateLocationFsxOpenZfsResponse {
  LocationArn?: string;
}
export const CreateLocationFsxOpenZfsResponse = S.suspend(() =>
  S.Struct({ LocationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLocationFsxOpenZfsResponse",
}) as any as S.Schema<CreateLocationFsxOpenZfsResponse>;
export interface CreateLocationFsxWindowsResponse {
  LocationArn?: string;
}
export const CreateLocationFsxWindowsResponse = S.suspend(() =>
  S.Struct({ LocationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLocationFsxWindowsResponse",
}) as any as S.Schema<CreateLocationFsxWindowsResponse>;
export interface CreateLocationHdfsRequest {
  Subdirectory?: string;
  NameNodes: HdfsNameNodeList;
  BlockSize?: number;
  ReplicationFactor?: number;
  KmsKeyProviderUri?: string;
  QopConfiguration?: QopConfiguration;
  AuthenticationType: string;
  SimpleUser?: string;
  KerberosPrincipal?: string;
  KerberosKeytab?: Uint8Array;
  KerberosKrb5Conf?: Uint8Array;
  AgentArns: AgentArnList;
  Tags?: InputTagList;
}
export const CreateLocationHdfsRequest = S.suspend(() =>
  S.Struct({
    Subdirectory: S.optional(S.String),
    NameNodes: HdfsNameNodeList,
    BlockSize: S.optional(S.Number),
    ReplicationFactor: S.optional(S.Number),
    KmsKeyProviderUri: S.optional(S.String),
    QopConfiguration: S.optional(QopConfiguration),
    AuthenticationType: S.String,
    SimpleUser: S.optional(S.String),
    KerberosPrincipal: S.optional(S.String),
    KerberosKeytab: S.optional(T.Blob),
    KerberosKrb5Conf: S.optional(T.Blob),
    AgentArns: AgentArnList,
    Tags: S.optional(InputTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLocationHdfsRequest",
}) as any as S.Schema<CreateLocationHdfsRequest>;
export interface CreateLocationNfsRequest {
  Subdirectory: string;
  ServerHostname: string;
  OnPremConfig: OnPremConfig;
  MountOptions?: NfsMountOptions;
  Tags?: InputTagList;
}
export const CreateLocationNfsRequest = S.suspend(() =>
  S.Struct({
    Subdirectory: S.String,
    ServerHostname: S.String,
    OnPremConfig: OnPremConfig,
    MountOptions: S.optional(NfsMountOptions),
    Tags: S.optional(InputTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLocationNfsRequest",
}) as any as S.Schema<CreateLocationNfsRequest>;
export interface CreateLocationObjectStorageResponse {
  LocationArn?: string;
}
export const CreateLocationObjectStorageResponse = S.suspend(() =>
  S.Struct({ LocationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLocationObjectStorageResponse",
}) as any as S.Schema<CreateLocationObjectStorageResponse>;
export interface CreateLocationS3Request {
  Subdirectory?: string;
  S3BucketArn: string;
  S3StorageClass?: string;
  S3Config: S3Config;
  AgentArns?: AgentArnList;
  Tags?: InputTagList;
}
export const CreateLocationS3Request = S.suspend(() =>
  S.Struct({
    Subdirectory: S.optional(S.String),
    S3BucketArn: S.String,
    S3StorageClass: S.optional(S.String),
    S3Config: S3Config,
    AgentArns: S.optional(AgentArnList),
    Tags: S.optional(InputTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLocationS3Request",
}) as any as S.Schema<CreateLocationS3Request>;
export interface CreateLocationSmbRequest {
  Subdirectory: string;
  ServerHostname: string;
  User?: string;
  Domain?: string;
  Password?: string | Redacted.Redacted<string>;
  CmkSecretConfig?: CmkSecretConfig;
  CustomSecretConfig?: CustomSecretConfig;
  AgentArns: AgentArnList;
  MountOptions?: SmbMountOptions;
  Tags?: InputTagList;
  AuthenticationType?: string;
  DnsIpAddresses?: DnsIpList;
  KerberosPrincipal?: string;
  KerberosKeytab?: Uint8Array;
  KerberosKrb5Conf?: Uint8Array;
}
export const CreateLocationSmbRequest = S.suspend(() =>
  S.Struct({
    Subdirectory: S.String,
    ServerHostname: S.String,
    User: S.optional(S.String),
    Domain: S.optional(S.String),
    Password: S.optional(SensitiveString),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
    AgentArns: AgentArnList,
    MountOptions: S.optional(SmbMountOptions),
    Tags: S.optional(InputTagList),
    AuthenticationType: S.optional(S.String),
    DnsIpAddresses: S.optional(DnsIpList),
    KerberosPrincipal: S.optional(S.String),
    KerberosKeytab: S.optional(T.Blob),
    KerberosKrb5Conf: S.optional(T.Blob),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLocationSmbRequest",
}) as any as S.Schema<CreateLocationSmbRequest>;
export interface DescribeLocationEfsResponse {
  LocationArn?: string;
  LocationUri?: string;
  Ec2Config?: Ec2Config;
  CreationTime?: Date;
  AccessPointArn?: string;
  FileSystemAccessRoleArn?: string;
  InTransitEncryption?: string;
}
export const DescribeLocationEfsResponse = S.suspend(() =>
  S.Struct({
    LocationArn: S.optional(S.String),
    LocationUri: S.optional(S.String),
    Ec2Config: S.optional(Ec2Config),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AccessPointArn: S.optional(S.String),
    FileSystemAccessRoleArn: S.optional(S.String),
    InTransitEncryption: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeLocationEfsResponse",
}) as any as S.Schema<DescribeLocationEfsResponse>;
export interface DescribeLocationFsxLustreResponse {
  LocationArn?: string;
  LocationUri?: string;
  SecurityGroupArns?: Ec2SecurityGroupArnList;
  CreationTime?: Date;
}
export const DescribeLocationFsxLustreResponse = S.suspend(() =>
  S.Struct({
    LocationArn: S.optional(S.String),
    LocationUri: S.optional(S.String),
    SecurityGroupArns: S.optional(Ec2SecurityGroupArnList),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeLocationFsxLustreResponse",
}) as any as S.Schema<DescribeLocationFsxLustreResponse>;
export interface DescribeLocationFsxOntapResponse {
  CreationTime?: Date;
  LocationArn?: string;
  LocationUri?: string;
  Protocol?: FsxProtocol;
  SecurityGroupArns?: Ec2SecurityGroupArnList;
  StorageVirtualMachineArn?: string;
  FsxFilesystemArn?: string;
}
export const DescribeLocationFsxOntapResponse = S.suspend(() =>
  S.Struct({
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LocationArn: S.optional(S.String),
    LocationUri: S.optional(S.String),
    Protocol: S.optional(FsxProtocol),
    SecurityGroupArns: S.optional(Ec2SecurityGroupArnList),
    StorageVirtualMachineArn: S.optional(S.String),
    FsxFilesystemArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeLocationFsxOntapResponse",
}) as any as S.Schema<DescribeLocationFsxOntapResponse>;
export interface DescribeLocationFsxOpenZfsResponse {
  LocationArn?: string;
  LocationUri?: string;
  SecurityGroupArns?: Ec2SecurityGroupArnList;
  Protocol?: FsxProtocol;
  CreationTime?: Date;
}
export const DescribeLocationFsxOpenZfsResponse = S.suspend(() =>
  S.Struct({
    LocationArn: S.optional(S.String),
    LocationUri: S.optional(S.String),
    SecurityGroupArns: S.optional(Ec2SecurityGroupArnList),
    Protocol: S.optional(FsxProtocol),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeLocationFsxOpenZfsResponse",
}) as any as S.Schema<DescribeLocationFsxOpenZfsResponse>;
export interface DescribeLocationFsxWindowsResponse {
  LocationArn?: string;
  LocationUri?: string;
  SecurityGroupArns?: Ec2SecurityGroupArnList;
  CreationTime?: Date;
  User?: string;
  Domain?: string;
}
export const DescribeLocationFsxWindowsResponse = S.suspend(() =>
  S.Struct({
    LocationArn: S.optional(S.String),
    LocationUri: S.optional(S.String),
    SecurityGroupArns: S.optional(Ec2SecurityGroupArnList),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    User: S.optional(S.String),
    Domain: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeLocationFsxWindowsResponse",
}) as any as S.Schema<DescribeLocationFsxWindowsResponse>;
export interface DescribeLocationHdfsResponse {
  LocationArn?: string;
  LocationUri?: string;
  NameNodes?: HdfsNameNodeList;
  BlockSize?: number;
  ReplicationFactor?: number;
  KmsKeyProviderUri?: string;
  QopConfiguration?: QopConfiguration;
  AuthenticationType?: string;
  SimpleUser?: string;
  KerberosPrincipal?: string;
  AgentArns?: AgentArnList;
  CreationTime?: Date;
}
export const DescribeLocationHdfsResponse = S.suspend(() =>
  S.Struct({
    LocationArn: S.optional(S.String),
    LocationUri: S.optional(S.String),
    NameNodes: S.optional(HdfsNameNodeList),
    BlockSize: S.optional(S.Number),
    ReplicationFactor: S.optional(S.Number),
    KmsKeyProviderUri: S.optional(S.String),
    QopConfiguration: S.optional(QopConfiguration),
    AuthenticationType: S.optional(S.String),
    SimpleUser: S.optional(S.String),
    KerberosPrincipal: S.optional(S.String),
    AgentArns: S.optional(AgentArnList),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeLocationHdfsResponse",
}) as any as S.Schema<DescribeLocationHdfsResponse>;
export interface DescribeLocationNfsResponse {
  LocationArn?: string;
  LocationUri?: string;
  OnPremConfig?: OnPremConfig;
  MountOptions?: NfsMountOptions;
  CreationTime?: Date;
}
export const DescribeLocationNfsResponse = S.suspend(() =>
  S.Struct({
    LocationArn: S.optional(S.String),
    LocationUri: S.optional(S.String),
    OnPremConfig: S.optional(OnPremConfig),
    MountOptions: S.optional(NfsMountOptions),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeLocationNfsResponse",
}) as any as S.Schema<DescribeLocationNfsResponse>;
export interface ManagedSecretConfig {
  SecretArn?: string;
}
export const ManagedSecretConfig = S.suspend(() =>
  S.Struct({ SecretArn: S.optional(S.String) }),
).annotations({
  identifier: "ManagedSecretConfig",
}) as any as S.Schema<ManagedSecretConfig>;
export interface DescribeLocationObjectStorageResponse {
  LocationArn?: string;
  LocationUri?: string;
  AccessKey?: string;
  ServerPort?: number;
  ServerProtocol?: string;
  AgentArns?: AgentArnList;
  CreationTime?: Date;
  ServerCertificate?: Uint8Array;
  ManagedSecretConfig?: ManagedSecretConfig;
  CmkSecretConfig?: CmkSecretConfig;
  CustomSecretConfig?: CustomSecretConfig;
}
export const DescribeLocationObjectStorageResponse = S.suspend(() =>
  S.Struct({
    LocationArn: S.optional(S.String),
    LocationUri: S.optional(S.String),
    AccessKey: S.optional(S.String),
    ServerPort: S.optional(S.Number),
    ServerProtocol: S.optional(S.String),
    AgentArns: S.optional(AgentArnList),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ServerCertificate: S.optional(T.Blob),
    ManagedSecretConfig: S.optional(ManagedSecretConfig),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
  }),
).annotations({
  identifier: "DescribeLocationObjectStorageResponse",
}) as any as S.Schema<DescribeLocationObjectStorageResponse>;
export interface DescribeLocationS3Response {
  LocationArn?: string;
  LocationUri?: string;
  S3StorageClass?: string;
  S3Config?: S3Config;
  AgentArns?: AgentArnList;
  CreationTime?: Date;
}
export const DescribeLocationS3Response = S.suspend(() =>
  S.Struct({
    LocationArn: S.optional(S.String),
    LocationUri: S.optional(S.String),
    S3StorageClass: S.optional(S.String),
    S3Config: S.optional(S3Config),
    AgentArns: S.optional(AgentArnList),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeLocationS3Response",
}) as any as S.Schema<DescribeLocationS3Response>;
export interface DescribeLocationSmbResponse {
  LocationArn?: string;
  LocationUri?: string;
  AgentArns?: AgentArnList;
  User?: string;
  Domain?: string;
  MountOptions?: SmbMountOptions;
  CreationTime?: Date;
  DnsIpAddresses?: DnsIpList;
  KerberosPrincipal?: string;
  AuthenticationType?: string;
  ManagedSecretConfig?: ManagedSecretConfig;
  CmkSecretConfig?: CmkSecretConfig;
  CustomSecretConfig?: CustomSecretConfig;
}
export const DescribeLocationSmbResponse = S.suspend(() =>
  S.Struct({
    LocationArn: S.optional(S.String),
    LocationUri: S.optional(S.String),
    AgentArns: S.optional(AgentArnList),
    User: S.optional(S.String),
    Domain: S.optional(S.String),
    MountOptions: S.optional(SmbMountOptions),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DnsIpAddresses: S.optional(DnsIpList),
    KerberosPrincipal: S.optional(S.String),
    AuthenticationType: S.optional(S.String),
    ManagedSecretConfig: S.optional(ManagedSecretConfig),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
  }),
).annotations({
  identifier: "DescribeLocationSmbResponse",
}) as any as S.Schema<DescribeLocationSmbResponse>;
export interface ListLocationsRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: LocationFilters;
}
export const ListLocationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(LocationFilters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListLocationsRequest",
}) as any as S.Schema<ListLocationsRequest>;
export interface ListTagsForResourceResponse {
  Tags?: OutputTagList;
  NextToken?: string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({
    Tags: S.optional(OutputTagList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ListTasksRequest {
  MaxResults?: number;
  NextToken?: string;
  Filters?: TaskFilters;
}
export const ListTasksRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(TaskFilters),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTasksRequest",
}) as any as S.Schema<ListTasksRequest>;
export interface StartTaskExecutionResponse {
  TaskExecutionArn?: string;
}
export const StartTaskExecutionResponse = S.suspend(() =>
  S.Struct({ TaskExecutionArn: S.optional(S.String) }),
).annotations({
  identifier: "StartTaskExecutionResponse",
}) as any as S.Schema<StartTaskExecutionResponse>;
export interface FsxUpdateProtocolSmb {
  Domain?: string;
  MountOptions?: SmbMountOptions;
  Password?: string | Redacted.Redacted<string>;
  User?: string;
}
export const FsxUpdateProtocolSmb = S.suspend(() =>
  S.Struct({
    Domain: S.optional(S.String),
    MountOptions: S.optional(SmbMountOptions),
    Password: S.optional(SensitiveString),
    User: S.optional(S.String),
  }),
).annotations({
  identifier: "FsxUpdateProtocolSmb",
}) as any as S.Schema<FsxUpdateProtocolSmb>;
export interface PrivateLinkConfig {
  VpcEndpointId?: string;
  PrivateLinkEndpoint?: string;
  SubnetArns?: PLSubnetArnList;
  SecurityGroupArns?: PLSecurityGroupArnList;
}
export const PrivateLinkConfig = S.suspend(() =>
  S.Struct({
    VpcEndpointId: S.optional(S.String),
    PrivateLinkEndpoint: S.optional(S.String),
    SubnetArns: S.optional(PLSubnetArnList),
    SecurityGroupArns: S.optional(PLSecurityGroupArnList),
  }),
).annotations({
  identifier: "PrivateLinkConfig",
}) as any as S.Schema<PrivateLinkConfig>;
export interface Platform {
  Version?: string;
}
export const Platform = S.suspend(() =>
  S.Struct({ Version: S.optional(S.String) }),
).annotations({ identifier: "Platform" }) as any as S.Schema<Platform>;
export interface TaskScheduleDetails {
  StatusUpdateTime?: Date;
  DisabledReason?: string;
  DisabledBy?: string;
}
export const TaskScheduleDetails = S.suspend(() =>
  S.Struct({
    StatusUpdateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DisabledReason: S.optional(S.String),
    DisabledBy: S.optional(S.String),
  }),
).annotations({
  identifier: "TaskScheduleDetails",
}) as any as S.Schema<TaskScheduleDetails>;
export interface TaskExecutionResultDetail {
  PrepareDuration?: number;
  PrepareStatus?: string;
  TotalDuration?: number;
  TransferDuration?: number;
  TransferStatus?: string;
  VerifyDuration?: number;
  VerifyStatus?: string;
  ErrorCode?: string;
  ErrorDetail?: string;
}
export const TaskExecutionResultDetail = S.suspend(() =>
  S.Struct({
    PrepareDuration: S.optional(S.Number),
    PrepareStatus: S.optional(S.String),
    TotalDuration: S.optional(S.Number),
    TransferDuration: S.optional(S.Number),
    TransferStatus: S.optional(S.String),
    VerifyDuration: S.optional(S.Number),
    VerifyStatus: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorDetail: S.optional(S.String),
  }),
).annotations({
  identifier: "TaskExecutionResultDetail",
}) as any as S.Schema<TaskExecutionResultDetail>;
export interface ReportResult {
  Status?: string;
  ErrorCode?: string;
  ErrorDetail?: string;
}
export const ReportResult = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorDetail: S.optional(S.String),
  }),
).annotations({ identifier: "ReportResult" }) as any as S.Schema<ReportResult>;
export interface TaskExecutionFilesListedDetail {
  AtSource?: number;
  AtDestinationForDelete?: number;
}
export const TaskExecutionFilesListedDetail = S.suspend(() =>
  S.Struct({
    AtSource: S.optional(S.Number),
    AtDestinationForDelete: S.optional(S.Number),
  }),
).annotations({
  identifier: "TaskExecutionFilesListedDetail",
}) as any as S.Schema<TaskExecutionFilesListedDetail>;
export interface TaskExecutionFilesFailedDetail {
  Prepare?: number;
  Transfer?: number;
  Verify?: number;
  Delete?: number;
}
export const TaskExecutionFilesFailedDetail = S.suspend(() =>
  S.Struct({
    Prepare: S.optional(S.Number),
    Transfer: S.optional(S.Number),
    Verify: S.optional(S.Number),
    Delete: S.optional(S.Number),
  }),
).annotations({
  identifier: "TaskExecutionFilesFailedDetail",
}) as any as S.Schema<TaskExecutionFilesFailedDetail>;
export interface TaskExecutionFoldersListedDetail {
  AtSource?: number;
  AtDestinationForDelete?: number;
}
export const TaskExecutionFoldersListedDetail = S.suspend(() =>
  S.Struct({
    AtSource: S.optional(S.Number),
    AtDestinationForDelete: S.optional(S.Number),
  }),
).annotations({
  identifier: "TaskExecutionFoldersListedDetail",
}) as any as S.Schema<TaskExecutionFoldersListedDetail>;
export interface TaskExecutionFoldersFailedDetail {
  List?: number;
  Prepare?: number;
  Transfer?: number;
  Verify?: number;
  Delete?: number;
}
export const TaskExecutionFoldersFailedDetail = S.suspend(() =>
  S.Struct({
    List: S.optional(S.Number),
    Prepare: S.optional(S.Number),
    Transfer: S.optional(S.Number),
    Verify: S.optional(S.Number),
    Delete: S.optional(S.Number),
  }),
).annotations({
  identifier: "TaskExecutionFoldersFailedDetail",
}) as any as S.Schema<TaskExecutionFoldersFailedDetail>;
export interface AgentListEntry {
  AgentArn?: string;
  Name?: string;
  Status?: string;
  Platform?: Platform;
}
export const AgentListEntry = S.suspend(() =>
  S.Struct({
    AgentArn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    Platform: S.optional(Platform),
  }),
).annotations({
  identifier: "AgentListEntry",
}) as any as S.Schema<AgentListEntry>;
export type AgentList = AgentListEntry[];
export const AgentList = S.Array(AgentListEntry);
export interface TaskExecutionListEntry {
  TaskExecutionArn?: string;
  Status?: string;
  TaskMode?: string;
}
export const TaskExecutionListEntry = S.suspend(() =>
  S.Struct({
    TaskExecutionArn: S.optional(S.String),
    Status: S.optional(S.String),
    TaskMode: S.optional(S.String),
  }),
).annotations({
  identifier: "TaskExecutionListEntry",
}) as any as S.Schema<TaskExecutionListEntry>;
export type TaskExecutionList = TaskExecutionListEntry[];
export const TaskExecutionList = S.Array(TaskExecutionListEntry);
export interface FsxUpdateProtocol {
  NFS?: FsxProtocolNfs;
  SMB?: FsxUpdateProtocolSmb;
}
export const FsxUpdateProtocol = S.suspend(() =>
  S.Struct({
    NFS: S.optional(FsxProtocolNfs),
    SMB: S.optional(FsxUpdateProtocolSmb),
  }),
).annotations({
  identifier: "FsxUpdateProtocol",
}) as any as S.Schema<FsxUpdateProtocol>;
export interface CreateAgentResponse {
  AgentArn?: string;
}
export const CreateAgentResponse = S.suspend(() =>
  S.Struct({ AgentArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateAgentResponse",
}) as any as S.Schema<CreateAgentResponse>;
export interface CreateLocationAzureBlobResponse {
  LocationArn?: string;
}
export const CreateLocationAzureBlobResponse = S.suspend(() =>
  S.Struct({ LocationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLocationAzureBlobResponse",
}) as any as S.Schema<CreateLocationAzureBlobResponse>;
export interface CreateLocationEfsResponse {
  LocationArn?: string;
}
export const CreateLocationEfsResponse = S.suspend(() =>
  S.Struct({ LocationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLocationEfsResponse",
}) as any as S.Schema<CreateLocationEfsResponse>;
export interface CreateLocationFsxOntapRequest {
  Protocol: FsxProtocol;
  SecurityGroupArns: Ec2SecurityGroupArnList;
  StorageVirtualMachineArn: string;
  Subdirectory?: string;
  Tags?: InputTagList;
}
export const CreateLocationFsxOntapRequest = S.suspend(() =>
  S.Struct({
    Protocol: FsxProtocol,
    SecurityGroupArns: Ec2SecurityGroupArnList,
    StorageVirtualMachineArn: S.String,
    Subdirectory: S.optional(S.String),
    Tags: S.optional(InputTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateLocationFsxOntapRequest",
}) as any as S.Schema<CreateLocationFsxOntapRequest>;
export interface CreateLocationHdfsResponse {
  LocationArn?: string;
}
export const CreateLocationHdfsResponse = S.suspend(() =>
  S.Struct({ LocationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLocationHdfsResponse",
}) as any as S.Schema<CreateLocationHdfsResponse>;
export interface CreateLocationNfsResponse {
  LocationArn?: string;
}
export const CreateLocationNfsResponse = S.suspend(() =>
  S.Struct({ LocationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLocationNfsResponse",
}) as any as S.Schema<CreateLocationNfsResponse>;
export interface CreateLocationS3Response {
  LocationArn?: string;
}
export const CreateLocationS3Response = S.suspend(() =>
  S.Struct({ LocationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLocationS3Response",
}) as any as S.Schema<CreateLocationS3Response>;
export interface CreateLocationSmbResponse {
  LocationArn?: string;
}
export const CreateLocationSmbResponse = S.suspend(() =>
  S.Struct({ LocationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLocationSmbResponse",
}) as any as S.Schema<CreateLocationSmbResponse>;
export interface DescribeAgentResponse {
  AgentArn?: string;
  Name?: string;
  Status?: string;
  LastConnectionTime?: Date;
  CreationTime?: Date;
  EndpointType?: string;
  PrivateLinkConfig?: PrivateLinkConfig;
  Platform?: Platform;
}
export const DescribeAgentResponse = S.suspend(() =>
  S.Struct({
    AgentArn: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    LastConnectionTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndpointType: S.optional(S.String),
    PrivateLinkConfig: S.optional(PrivateLinkConfig),
    Platform: S.optional(Platform),
  }),
).annotations({
  identifier: "DescribeAgentResponse",
}) as any as S.Schema<DescribeAgentResponse>;
export interface DescribeLocationAzureBlobResponse {
  LocationArn?: string;
  LocationUri?: string;
  AuthenticationType?: string;
  BlobType?: string;
  AccessTier?: string;
  AgentArns?: AgentArnList;
  CreationTime?: Date;
  ManagedSecretConfig?: ManagedSecretConfig;
  CmkSecretConfig?: CmkSecretConfig;
  CustomSecretConfig?: CustomSecretConfig;
}
export const DescribeLocationAzureBlobResponse = S.suspend(() =>
  S.Struct({
    LocationArn: S.optional(S.String),
    LocationUri: S.optional(S.String),
    AuthenticationType: S.optional(S.String),
    BlobType: S.optional(S.String),
    AccessTier: S.optional(S.String),
    AgentArns: S.optional(AgentArnList),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ManagedSecretConfig: S.optional(ManagedSecretConfig),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
  }),
).annotations({
  identifier: "DescribeLocationAzureBlobResponse",
}) as any as S.Schema<DescribeLocationAzureBlobResponse>;
export interface DescribeTaskResponse {
  TaskArn?: string;
  Status?: string;
  Name?: string;
  CurrentTaskExecutionArn?: string;
  SourceLocationArn?: string;
  DestinationLocationArn?: string;
  CloudWatchLogGroupArn?: string;
  SourceNetworkInterfaceArns?: SourceNetworkInterfaceArns;
  DestinationNetworkInterfaceArns?: DestinationNetworkInterfaceArns;
  Options?: Options;
  Excludes?: FilterList;
  Schedule?: TaskSchedule;
  ErrorCode?: string;
  ErrorDetail?: string;
  CreationTime?: Date;
  Includes?: FilterList;
  ManifestConfig?: ManifestConfig;
  TaskReportConfig?: TaskReportConfig;
  ScheduleDetails?: TaskScheduleDetails;
  TaskMode?: string;
}
export const DescribeTaskResponse = S.suspend(() =>
  S.Struct({
    TaskArn: S.optional(S.String),
    Status: S.optional(S.String),
    Name: S.optional(S.String),
    CurrentTaskExecutionArn: S.optional(S.String),
    SourceLocationArn: S.optional(S.String),
    DestinationLocationArn: S.optional(S.String),
    CloudWatchLogGroupArn: S.optional(S.String),
    SourceNetworkInterfaceArns: S.optional(SourceNetworkInterfaceArns),
    DestinationNetworkInterfaceArns: S.optional(
      DestinationNetworkInterfaceArns,
    ),
    Options: S.optional(Options),
    Excludes: S.optional(FilterList),
    Schedule: S.optional(TaskSchedule),
    ErrorCode: S.optional(S.String),
    ErrorDetail: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Includes: S.optional(FilterList),
    ManifestConfig: S.optional(ManifestConfig),
    TaskReportConfig: S.optional(TaskReportConfig),
    ScheduleDetails: S.optional(TaskScheduleDetails),
    TaskMode: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeTaskResponse",
}) as any as S.Schema<DescribeTaskResponse>;
export interface DescribeTaskExecutionResponse {
  TaskExecutionArn?: string;
  Status?: string;
  Options?: Options;
  Excludes?: FilterList;
  Includes?: FilterList;
  ManifestConfig?: ManifestConfig;
  StartTime?: Date;
  EstimatedFilesToTransfer?: number;
  EstimatedBytesToTransfer?: number;
  FilesTransferred?: number;
  BytesWritten?: number;
  BytesTransferred?: number;
  BytesCompressed?: number;
  Result?: TaskExecutionResultDetail;
  TaskReportConfig?: TaskReportConfig;
  FilesDeleted?: number;
  FilesSkipped?: number;
  FilesVerified?: number;
  ReportResult?: ReportResult;
  EstimatedFilesToDelete?: number;
  TaskMode?: string;
  FilesPrepared?: number;
  FilesListed?: TaskExecutionFilesListedDetail;
  FilesFailed?: TaskExecutionFilesFailedDetail;
  EstimatedFoldersToDelete?: number;
  EstimatedFoldersToTransfer?: number;
  FoldersSkipped?: number;
  FoldersPrepared?: number;
  FoldersTransferred?: number;
  FoldersVerified?: number;
  FoldersDeleted?: number;
  FoldersListed?: TaskExecutionFoldersListedDetail;
  FoldersFailed?: TaskExecutionFoldersFailedDetail;
  LaunchTime?: Date;
  EndTime?: Date;
}
export const DescribeTaskExecutionResponse = S.suspend(() =>
  S.Struct({
    TaskExecutionArn: S.optional(S.String),
    Status: S.optional(S.String),
    Options: S.optional(Options),
    Excludes: S.optional(FilterList),
    Includes: S.optional(FilterList),
    ManifestConfig: S.optional(ManifestConfig),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EstimatedFilesToTransfer: S.optional(S.Number),
    EstimatedBytesToTransfer: S.optional(S.Number),
    FilesTransferred: S.optional(S.Number),
    BytesWritten: S.optional(S.Number),
    BytesTransferred: S.optional(S.Number),
    BytesCompressed: S.optional(S.Number),
    Result: S.optional(TaskExecutionResultDetail),
    TaskReportConfig: S.optional(TaskReportConfig),
    FilesDeleted: S.optional(S.Number),
    FilesSkipped: S.optional(S.Number),
    FilesVerified: S.optional(S.Number),
    ReportResult: S.optional(ReportResult),
    EstimatedFilesToDelete: S.optional(S.Number),
    TaskMode: S.optional(S.String),
    FilesPrepared: S.optional(S.Number),
    FilesListed: S.optional(TaskExecutionFilesListedDetail),
    FilesFailed: S.optional(TaskExecutionFilesFailedDetail),
    EstimatedFoldersToDelete: S.optional(S.Number),
    EstimatedFoldersToTransfer: S.optional(S.Number),
    FoldersSkipped: S.optional(S.Number),
    FoldersPrepared: S.optional(S.Number),
    FoldersTransferred: S.optional(S.Number),
    FoldersVerified: S.optional(S.Number),
    FoldersDeleted: S.optional(S.Number),
    FoldersListed: S.optional(TaskExecutionFoldersListedDetail),
    FoldersFailed: S.optional(TaskExecutionFoldersFailedDetail),
    LaunchTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeTaskExecutionResponse",
}) as any as S.Schema<DescribeTaskExecutionResponse>;
export interface ListAgentsResponse {
  Agents?: AgentList;
  NextToken?: string;
}
export const ListAgentsResponse = S.suspend(() =>
  S.Struct({ Agents: S.optional(AgentList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListAgentsResponse",
}) as any as S.Schema<ListAgentsResponse>;
export interface ListTaskExecutionsResponse {
  TaskExecutions?: TaskExecutionList;
  NextToken?: string;
}
export const ListTaskExecutionsResponse = S.suspend(() =>
  S.Struct({
    TaskExecutions: S.optional(TaskExecutionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTaskExecutionsResponse",
}) as any as S.Schema<ListTaskExecutionsResponse>;
export interface UpdateLocationFsxOntapRequest {
  LocationArn: string;
  Protocol?: FsxUpdateProtocol;
  Subdirectory?: string;
}
export const UpdateLocationFsxOntapRequest = S.suspend(() =>
  S.Struct({
    LocationArn: S.String,
    Protocol: S.optional(FsxUpdateProtocol),
    Subdirectory: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateLocationFsxOntapRequest",
}) as any as S.Schema<UpdateLocationFsxOntapRequest>;
export interface UpdateLocationFsxOntapResponse {}
export const UpdateLocationFsxOntapResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateLocationFsxOntapResponse",
}) as any as S.Schema<UpdateLocationFsxOntapResponse>;
export interface LocationListEntry {
  LocationArn?: string;
  LocationUri?: string;
}
export const LocationListEntry = S.suspend(() =>
  S.Struct({
    LocationArn: S.optional(S.String),
    LocationUri: S.optional(S.String),
  }),
).annotations({
  identifier: "LocationListEntry",
}) as any as S.Schema<LocationListEntry>;
export type LocationList = LocationListEntry[];
export const LocationList = S.Array(LocationListEntry);
export interface TaskListEntry {
  TaskArn?: string;
  Status?: string;
  Name?: string;
  TaskMode?: string;
}
export const TaskListEntry = S.suspend(() =>
  S.Struct({
    TaskArn: S.optional(S.String),
    Status: S.optional(S.String),
    Name: S.optional(S.String),
    TaskMode: S.optional(S.String),
  }),
).annotations({
  identifier: "TaskListEntry",
}) as any as S.Schema<TaskListEntry>;
export type TaskList = TaskListEntry[];
export const TaskList = S.Array(TaskListEntry);
export interface CreateLocationFsxOntapResponse {
  LocationArn?: string;
}
export const CreateLocationFsxOntapResponse = S.suspend(() =>
  S.Struct({ LocationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateLocationFsxOntapResponse",
}) as any as S.Schema<CreateLocationFsxOntapResponse>;
export interface CreateTaskRequest {
  SourceLocationArn: string;
  DestinationLocationArn: string;
  CloudWatchLogGroupArn?: string;
  Name?: string;
  Options?: Options;
  Excludes?: FilterList;
  Schedule?: TaskSchedule;
  Tags?: InputTagList;
  Includes?: FilterList;
  ManifestConfig?: ManifestConfig;
  TaskReportConfig?: TaskReportConfig;
  TaskMode?: string;
}
export const CreateTaskRequest = S.suspend(() =>
  S.Struct({
    SourceLocationArn: S.String,
    DestinationLocationArn: S.String,
    CloudWatchLogGroupArn: S.optional(S.String),
    Name: S.optional(S.String),
    Options: S.optional(Options),
    Excludes: S.optional(FilterList),
    Schedule: S.optional(TaskSchedule),
    Tags: S.optional(InputTagList),
    Includes: S.optional(FilterList),
    ManifestConfig: S.optional(ManifestConfig),
    TaskReportConfig: S.optional(TaskReportConfig),
    TaskMode: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateTaskRequest",
}) as any as S.Schema<CreateTaskRequest>;
export interface ListLocationsResponse {
  Locations?: LocationList;
  NextToken?: string;
}
export const ListLocationsResponse = S.suspend(() =>
  S.Struct({
    Locations: S.optional(LocationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListLocationsResponse",
}) as any as S.Schema<ListLocationsResponse>;
export interface ListTasksResponse {
  Tasks?: TaskList;
  NextToken?: string;
}
export const ListTasksResponse = S.suspend(() =>
  S.Struct({ Tasks: S.optional(TaskList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTasksResponse",
}) as any as S.Schema<ListTasksResponse>;
export interface CreateTaskResponse {
  TaskArn?: string;
}
export const CreateTaskResponse = S.suspend(() =>
  S.Struct({ TaskArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateTaskResponse",
}) as any as S.Schema<CreateTaskResponse>;

//# Errors
export class InternalException extends S.TaggedError<InternalException>()(
  "InternalException",
  { message: S.optional(S.String), errorCode: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {
    message: S.optional(S.String),
    errorCode: S.optional(S.String),
    datasyncErrorCode: S.optional(S.String),
  },
) {}

//# Operations
/**
 * Stops an DataSync task execution that's in progress. The transfer of some
 * files are abruptly interrupted. File contents that're transferred to the destination might be
 * incomplete or inconsistent with the source files.
 *
 * However, if you start a new task execution using the same task and allow it to finish,
 * file content on the destination will be complete and consistent. This applies to other
 * unexpected failures that interrupt a task execution. In all of these cases, DataSync
 * successfully completes the transfer when you start the next task execution.
 */
export const cancelTaskExecution: (
  input: CancelTaskExecutionRequest,
) => Effect.Effect<
  CancelTaskExecutionResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelTaskExecutionRequest,
  output: CancelTaskExecutionResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Activates an DataSync agent that you deploy in your storage environment.
 * The activation process associates the agent with your Amazon Web Services account.
 *
 * If you haven't deployed an agent yet, see Do I need a DataSync
 * agent?
 */
export const createAgent: (
  input: CreateAgentRequest,
) => Effect.Effect<
  CreateAgentResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAgentRequest,
  output: CreateAgentResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Creates a transfer *location* for a Microsoft Azure Blob Storage
 * container. DataSync can use this location as a transfer source or destination.
 * You can make transfers with or without a DataSync agent that connects to your
 * container.
 *
 * Before you begin, make sure you know how DataSync accesses Azure Blob Storage and works with access tiers and blob types.
 */
export const createLocationAzureBlob: (
  input: CreateLocationAzureBlobRequest,
) => Effect.Effect<
  CreateLocationAzureBlobResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationAzureBlobRequest,
  output: CreateLocationAzureBlobResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Creates a transfer *location* for an Amazon EFS file system.
 * DataSync can use this location as a source or destination for transferring
 * data.
 *
 * Before you begin, make sure that you understand how DataSync
 * accesses
 * Amazon EFS file systems.
 */
export const createLocationEfs: (
  input: CreateLocationEfsRequest,
) => Effect.Effect<
  CreateLocationEfsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationEfsRequest,
  output: CreateLocationEfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Creates a transfer *location* for a Hadoop Distributed File System
 * (HDFS). DataSync can use this location as a source or destination for
 * transferring data.
 *
 * Before you begin, make sure that you understand how DataSync
 * accesses HDFS
 * clusters.
 */
export const createLocationHdfs: (
  input: CreateLocationHdfsRequest,
) => Effect.Effect<
  CreateLocationHdfsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationHdfsRequest,
  output: CreateLocationHdfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Creates a transfer *location* for a Network File System (NFS) file
 * server. DataSync can use this location as a source or destination for
 * transferring data.
 *
 * Before you begin, make sure that you understand how DataSync
 * accesses NFS file
 * servers.
 */
export const createLocationNfs: (
  input: CreateLocationNfsRequest,
) => Effect.Effect<
  CreateLocationNfsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationNfsRequest,
  output: CreateLocationNfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Creates a transfer *location* for an Amazon S3 bucket.
 * DataSync can use this location as a source or destination for transferring
 * data.
 *
 * Before you begin, make sure that you read the following topics:
 *
 * - Storage
 * class considerations with Amazon S3 locations
 *
 * - Evaluating S3 request costs when using DataSync
 *
 * For more information, see Configuring
 * transfers with Amazon S3.
 */
export const createLocationS3: (
  input: CreateLocationS3Request,
) => Effect.Effect<
  CreateLocationS3Response,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationS3Request,
  output: CreateLocationS3Response,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Creates a transfer *location* for a Server Message Block (SMB) file
 * server. DataSync can use this location as a source or destination for
 * transferring data.
 *
 * Before you begin, make sure that you understand how DataSync accesses SMB
 * file servers. For more information, see Providing DataSync access to SMB file servers.
 */
export const createLocationSmb: (
  input: CreateLocationSmbRequest,
) => Effect.Effect<
  CreateLocationSmbResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationSmbRequest,
  output: CreateLocationSmbResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Returns information about an DataSync agent, such as its name, service
 * endpoint type, and status.
 */
export const describeAgent: (
  input: DescribeAgentRequest,
) => Effect.Effect<
  DescribeAgentResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAgentRequest,
  output: DescribeAgentResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for Microsoft Azure
 * Blob Storage is configured.
 */
export const describeLocationAzureBlob: (
  input: DescribeLocationAzureBlobRequest,
) => Effect.Effect<
  DescribeLocationAzureBlobResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationAzureBlobRequest,
  output: DescribeLocationAzureBlobResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides information about a *task*, which defines where and how
 * DataSync transfers your data.
 */
export const describeTask: (
  input: DescribeTaskRequest,
) => Effect.Effect<
  DescribeTaskResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTaskRequest,
  output: DescribeTaskResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides information about an execution of your DataSync task. You can
 * use this operation to help monitor the progress of an ongoing data transfer or check the
 * results of the transfer.
 *
 * Some `DescribeTaskExecution` response elements are only relevant to a
 * specific task mode. For information, see Understanding task mode differences and Understanding data
 * transfer performance counters.
 */
export const describeTaskExecution: (
  input: DescribeTaskExecutionRequest,
) => Effect.Effect<
  DescribeTaskExecutionResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTaskExecutionRequest,
  output: DescribeTaskExecutionResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Returns a list of DataSync agents that belong to an Amazon Web Services account in the Amazon Web Services Region specified in the request.
 *
 * With pagination, you can reduce the number of agents returned in a response. If you get
 * a truncated list of agents in a response, the response contains a marker that you can specify
 * in your next request to fetch the next page of agents.
 *
 * `ListAgents` is eventually consistent. This means the result of running the
 * operation might not reflect that you just created or deleted an agent. For example, if you
 * create an agent with CreateAgent and then
 * immediately run `ListAgents`, that agent might not show up in the list right away.
 * In situations like this, you can always confirm whether an agent has been created (or deleted)
 * by using DescribeAgent.
 */
export const listAgents: {
  (
    input: ListAgentsRequest,
  ): Effect.Effect<
    ListAgentsResponse,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAgentsRequest,
  ) => Stream.Stream<
    ListAgentsResponse,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAgentsRequest,
  ) => Stream.Stream<
    AgentListEntry,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAgentsRequest,
  output: ListAgentsResponse,
  errors: [InternalException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Agents",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of executions for an DataSync transfer task.
 */
export const listTaskExecutions: {
  (
    input: ListTaskExecutionsRequest,
  ): Effect.Effect<
    ListTaskExecutionsResponse,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTaskExecutionsRequest,
  ) => Stream.Stream<
    ListTaskExecutionsResponse,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTaskExecutionsRequest,
  ) => Stream.Stream<
    TaskExecutionListEntry,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTaskExecutionsRequest,
  output: ListTaskExecutionsResponse,
  errors: [InternalException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TaskExecutions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Modifies the following configuration parameters of the Amazon FSx for NetApp ONTAP
 * transfer location that you're using with DataSync.
 *
 * For more information, see Configuring DataSync
 * transfers with FSx for ONTAP.
 */
export const updateLocationFsxOntap: (
  input: UpdateLocationFsxOntapRequest,
) => Effect.Effect<
  UpdateLocationFsxOntapResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLocationFsxOntapRequest,
  output: UpdateLocationFsxOntapResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Creates a transfer *location* for an Amazon FSx for Lustre file
 * system. DataSync can use this location as a source or destination for
 * transferring data.
 *
 * Before you begin, make sure that you understand how DataSync
 * accesses FSx for Lustre file systems.
 */
export const createLocationFsxLustre: (
  input: CreateLocationFsxLustreRequest,
) => Effect.Effect<
  CreateLocationFsxLustreResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationFsxLustreRequest,
  output: CreateLocationFsxLustreResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Creates a transfer *location* for an Amazon FSx for OpenZFS file
 * system. DataSync can use this location as a source or destination for
 * transferring data.
 *
 * Before you begin, make sure that you understand how DataSync
 * accesses
 * FSx for OpenZFS file systems.
 *
 * Request parameters related to `SMB` aren't supported with the
 * `CreateLocationFsxOpenZfs` operation.
 */
export const createLocationFsxOpenZfs: (
  input: CreateLocationFsxOpenZfsRequest,
) => Effect.Effect<
  CreateLocationFsxOpenZfsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationFsxOpenZfsRequest,
  output: CreateLocationFsxOpenZfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Creates a transfer *location* for an Amazon FSx for Windows File Server file
 * system. DataSync can use this location as a source or destination for
 * transferring data.
 *
 * Before you begin, make sure that you understand how DataSync
 * accesses
 * FSx for Windows File Server file systems.
 */
export const createLocationFsxWindows: (
  input: CreateLocationFsxWindowsRequest,
) => Effect.Effect<
  CreateLocationFsxWindowsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationFsxWindowsRequest,
  output: CreateLocationFsxWindowsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Creates a transfer *location* for an object storage system. DataSync can use this location as a source or destination for transferring data. You
 * can make transfers with or without a DataSync
 * agent.
 *
 * Before you begin, make sure that you understand the prerequisites for DataSync to work with object storage systems.
 */
export const createLocationObjectStorage: (
  input: CreateLocationObjectStorageRequest,
) => Effect.Effect<
  CreateLocationObjectStorageResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationObjectStorageRequest,
  output: CreateLocationObjectStorageResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for an Amazon EFS file system is configured.
 */
export const describeLocationEfs: (
  input: DescribeLocationEfsRequest,
) => Effect.Effect<
  DescribeLocationEfsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationEfsRequest,
  output: DescribeLocationEfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for an Amazon FSx for Lustre file system is configured.
 */
export const describeLocationFsxLustre: (
  input: DescribeLocationFsxLustreRequest,
) => Effect.Effect<
  DescribeLocationFsxLustreResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationFsxLustreRequest,
  output: DescribeLocationFsxLustreResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for an Amazon FSx for NetApp ONTAP file system is configured.
 *
 * If your location uses SMB, the `DescribeLocationFsxOntap` operation doesn't
 * actually return a `Password`.
 */
export const describeLocationFsxOntap: (
  input: DescribeLocationFsxOntapRequest,
) => Effect.Effect<
  DescribeLocationFsxOntapResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationFsxOntapRequest,
  output: DescribeLocationFsxOntapResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for an Amazon FSx for OpenZFS file system is configured.
 *
 * Response elements related to `SMB` aren't supported with the
 * `DescribeLocationFsxOpenZfs` operation.
 */
export const describeLocationFsxOpenZfs: (
  input: DescribeLocationFsxOpenZfsRequest,
) => Effect.Effect<
  DescribeLocationFsxOpenZfsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationFsxOpenZfsRequest,
  output: DescribeLocationFsxOpenZfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for an Amazon FSx for Windows File Server file system is configured.
 */
export const describeLocationFsxWindows: (
  input: DescribeLocationFsxWindowsRequest,
) => Effect.Effect<
  DescribeLocationFsxWindowsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationFsxWindowsRequest,
  output: DescribeLocationFsxWindowsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for a Hadoop
 * Distributed File System (HDFS) is configured.
 */
export const describeLocationHdfs: (
  input: DescribeLocationHdfsRequest,
) => Effect.Effect<
  DescribeLocationHdfsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationHdfsRequest,
  output: DescribeLocationHdfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for a Network
 * File System (NFS) file server is configured.
 */
export const describeLocationNfs: (
  input: DescribeLocationNfsRequest,
) => Effect.Effect<
  DescribeLocationNfsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationNfsRequest,
  output: DescribeLocationNfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for an object
 * storage system is configured.
 */
export const describeLocationObjectStorage: (
  input: DescribeLocationObjectStorageRequest,
) => Effect.Effect<
  DescribeLocationObjectStorageResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationObjectStorageRequest,
  output: DescribeLocationObjectStorageResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for an S3 bucket
 * is configured.
 */
export const describeLocationS3: (
  input: DescribeLocationS3Request,
) => Effect.Effect<
  DescribeLocationS3Response,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationS3Request,
  output: DescribeLocationS3Response,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for a Server
 * Message Block (SMB) file server is configured.
 */
export const describeLocationSmb: (
  input: DescribeLocationSmbRequest,
) => Effect.Effect<
  DescribeLocationSmbResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationSmbRequest,
  output: DescribeLocationSmbResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Returns all the tags associated with an Amazon Web Services resource.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): Effect.Effect<
    ListTagsForResourceResponse,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    ListTagsForResourceResponse,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    TagListEntry,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InternalException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tags",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Starts an DataSync transfer task. For each task, you can only run one task
 * execution at a time.
 *
 * There are several steps to a task execution. For more information, see Task execution statuses.
 *
 * If you're planning to transfer data to or from an Amazon S3 location, review
 * how
 * DataSync can affect your S3 request charges and the DataSync pricing page before
 * you begin.
 */
export const startTaskExecution: (
  input: StartTaskExecutionRequest,
) => Effect.Effect<
  StartTaskExecutionResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTaskExecutionRequest,
  output: StartTaskExecutionResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Removes an DataSync agent resource from your Amazon Web Services account.
 *
 * Keep in mind that this operation (which can't be undone) doesn't remove the agent's
 * virtual machine (VM) or Amazon EC2 instance from your storage environment. For next
 * steps, you can delete the VM or instance from your storage environment or reuse it to activate a new
 * agent.
 */
export const deleteAgent: (
  input: DeleteAgentRequest,
) => Effect.Effect<
  DeleteAgentResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAgentRequest,
  output: DeleteAgentResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Deletes a transfer location resource from DataSync.
 */
export const deleteLocation: (
  input: DeleteLocationRequest,
) => Effect.Effect<
  DeleteLocationResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLocationRequest,
  output: DeleteLocationResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Deletes a transfer task resource from DataSync.
 */
export const deleteTask: (
  input: DeleteTaskRequest,
) => Effect.Effect<
  DeleteTaskResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTaskRequest,
  output: DeleteTaskResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Applies a *tag* to an Amazon Web Services resource. Tags are
 * key-value pairs that can help you manage, filter, and search for your resources.
 *
 * These include DataSync resources, such as locations, tasks, and task
 * executions.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Removes tags from an Amazon Web Services resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Updates the name of an DataSync agent.
 */
export const updateAgent: (
  input: UpdateAgentRequest,
) => Effect.Effect<
  UpdateAgentResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAgentRequest,
  output: UpdateAgentResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Modifies the following configurations of the Microsoft Azure Blob Storage transfer
 * location that you're using with DataSync.
 *
 * For more information, see Configuring DataSync transfers with Azure Blob Storage.
 */
export const updateLocationAzureBlob: (
  input: UpdateLocationAzureBlobRequest,
) => Effect.Effect<
  UpdateLocationAzureBlobResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLocationAzureBlobRequest,
  output: UpdateLocationAzureBlobResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Modifies the following configuration parameters of the Amazon EFS transfer
 * location that you're using with DataSync.
 *
 * For more information, see Configuring DataSync
 * transfers with Amazon EFS.
 */
export const updateLocationEfs: (
  input: UpdateLocationEfsRequest,
) => Effect.Effect<
  UpdateLocationEfsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLocationEfsRequest,
  output: UpdateLocationEfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Modifies the following configuration parameters of the Amazon FSx for Lustre
 * transfer location that you're using with DataSync.
 *
 * For more information, see Configuring DataSync
 * transfers with FSx for Lustre.
 */
export const updateLocationFsxLustre: (
  input: UpdateLocationFsxLustreRequest,
) => Effect.Effect<
  UpdateLocationFsxLustreResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLocationFsxLustreRequest,
  output: UpdateLocationFsxLustreResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Modifies the following configuration parameters of the Amazon FSx for OpenZFS
 * transfer location that you're using with DataSync.
 *
 * For more information, see Configuring DataSync
 * transfers with FSx for OpenZFS.
 *
 * Request parameters related to `SMB` aren't supported with the
 * `UpdateLocationFsxOpenZfs` operation.
 */
export const updateLocationFsxOpenZfs: (
  input: UpdateLocationFsxOpenZfsRequest,
) => Effect.Effect<
  UpdateLocationFsxOpenZfsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLocationFsxOpenZfsRequest,
  output: UpdateLocationFsxOpenZfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Modifies the following configuration parameters of the Amazon FSx for Windows File Server
 * transfer location that you're using with DataSync.
 *
 * For more information, see Configuring DataSync
 * transfers with FSx for Windows File Server.
 */
export const updateLocationFsxWindows: (
  input: UpdateLocationFsxWindowsRequest,
) => Effect.Effect<
  UpdateLocationFsxWindowsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLocationFsxWindowsRequest,
  output: UpdateLocationFsxWindowsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Modifies the following configuration parameters of the Hadoop Distributed File System
 * (HDFS) transfer location that you're using with DataSync.
 *
 * For more information, see Configuring DataSync
 * transfers with an HDFS cluster.
 */
export const updateLocationHdfs: (
  input: UpdateLocationHdfsRequest,
) => Effect.Effect<
  UpdateLocationHdfsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLocationHdfsRequest,
  output: UpdateLocationHdfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Modifies the following configuration parameters of the Network File System (NFS) transfer
 * location that you're using with DataSync.
 *
 * For more information, see Configuring transfers with an NFS
 * file server.
 */
export const updateLocationNfs: (
  input: UpdateLocationNfsRequest,
) => Effect.Effect<
  UpdateLocationNfsResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLocationNfsRequest,
  output: UpdateLocationNfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Modifies the following configuration parameters of the object storage transfer location
 * that you're using with DataSync.
 *
 * For more information, see Configuring DataSync
 * transfers with an object storage system.
 */
export const updateLocationObjectStorage: (
  input: UpdateLocationObjectStorageRequest,
) => Effect.Effect<
  UpdateLocationObjectStorageResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLocationObjectStorageRequest,
  output: UpdateLocationObjectStorageResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Modifies the following configuration parameters of the Amazon S3 transfer location
 * that you're using with DataSync.
 *
 * Before you begin, make sure that you read the following topics:
 *
 * - Storage
 * class considerations with Amazon S3 locations
 *
 * - Evaluating S3 request costs when using DataSync
 */
export const updateLocationS3: (
  input: UpdateLocationS3Request,
) => Effect.Effect<
  UpdateLocationS3Response,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLocationS3Request,
  output: UpdateLocationS3Response,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Modifies the following configuration parameters of the Server Message Block (SMB) transfer
 * location that you're using with DataSync.
 *
 * For more information, see Configuring DataSync
 * transfers with an SMB file server.
 */
export const updateLocationSmb: (
  input: UpdateLocationSmbRequest,
) => Effect.Effect<
  UpdateLocationSmbResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLocationSmbRequest,
  output: UpdateLocationSmbResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Updates the configuration of a *task*, which defines where and how
 * DataSync transfers your data.
 */
export const updateTask: (
  input: UpdateTaskRequest,
) => Effect.Effect<
  UpdateTaskResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTaskRequest,
  output: UpdateTaskResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Updates the configuration of a running DataSync task execution.
 *
 * Currently, the only `Option` that you can modify with
 * `UpdateTaskExecution` is
 * BytesPerSecond
 * , which throttles bandwidth for a running or queued task
 * execution.
 */
export const updateTaskExecution: (
  input: UpdateTaskExecutionRequest,
) => Effect.Effect<
  UpdateTaskExecutionResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTaskExecutionRequest,
  output: UpdateTaskExecutionResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Creates a transfer *location* for an Amazon FSx for NetApp ONTAP file
 * system. DataSync can use this location as a source or destination for
 * transferring data.
 *
 * Before you begin, make sure that you understand how DataSync
 * accesses FSx for ONTAP file systems.
 */
export const createLocationFsxOntap: (
  input: CreateLocationFsxOntapRequest,
) => Effect.Effect<
  CreateLocationFsxOntapResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationFsxOntapRequest,
  output: CreateLocationFsxOntapResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Returns a list of source and destination locations.
 *
 * If you have more locations than are returned in a response (that is, the response
 * returns only a truncated list of your agents), the response contains a token that you can
 * specify in your next request to fetch the next page of locations.
 */
export const listLocations: {
  (
    input: ListLocationsRequest,
  ): Effect.Effect<
    ListLocationsResponse,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLocationsRequest,
  ) => Stream.Stream<
    ListLocationsResponse,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLocationsRequest,
  ) => Stream.Stream<
    LocationListEntry,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLocationsRequest,
  output: ListLocationsResponse,
  errors: [InternalException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Locations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of the DataSync tasks you created.
 */
export const listTasks: {
  (
    input: ListTasksRequest,
  ): Effect.Effect<
    ListTasksResponse,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTasksRequest,
  ) => Stream.Stream<
    ListTasksResponse,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTasksRequest,
  ) => Stream.Stream<
    TaskListEntry,
    InternalException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTasksRequest,
  output: ListTasksResponse,
  errors: [InternalException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tasks",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Configures a *task*, which defines where and how DataSync
 * transfers your data.
 *
 * A task includes a source location, destination location, and transfer options (such as
 * bandwidth limits, scheduling, and more).
 *
 * If you're planning to transfer data to or from an Amazon S3 location, review
 * how
 * DataSync can affect your S3 request charges and the DataSync pricing page before
 * you begin.
 */
export const createTask: (
  input: CreateTaskRequest,
) => Effect.Effect<
  CreateTaskResponse,
  InternalException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTaskRequest,
  output: CreateTaskResponse,
  errors: [InternalException, InvalidRequestException],
}));
