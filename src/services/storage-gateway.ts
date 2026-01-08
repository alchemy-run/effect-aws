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
const ns = T.XmlNamespace("http://storagegateway.amazonaws.com/doc/2013-06-30");
const svc = T.AwsApiService({
  sdkId: "Storage Gateway",
  serviceShapeName: "StorageGateway_20130630",
});
const auth = T.AwsAuthSigv4({ name: "storagegateway" });
const ver = T.ServiceVersion("2013-06-30");
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
              `https://storagegateway-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://storagegateway-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://storagegateway.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://storagegateway.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ActivationKey = string;
export type GatewayName = string;
export type GatewayTimezone = string;
export type RegionId = string;
export type GatewayType = string;
export type TapeDriveType = string;
export type MediumChangerType = string;
export type GatewayARN = string;
export type DiskId = string;
export type ResourceARN = string;
export type TapeARN = string;
export type PoolId = string;
export type DomainUserName = string;
export type DomainUserPassword = string | redacted.Redacted<string>;
export type ClientToken = string;
export type FileSystemLocationARN = string;
export type AuditDestinationARN = string;
export type TargetName = string;
export type VolumeARN = string;
export type NetworkInterfaceId = string;
export type CacheReportARN = string;
export type SnapshotId = string;
export type KMSKey = string;
export type Role = string;
export type LocationARN = string;
export type StorageClass = string;
export type Ipv4OrIpv6AddressCIDR = string;
export type Squash = string;
export type FileShareName = string;
export type NotificationPolicy = string;
export type DNSHostName = string;
export type UserListUser = string;
export type Authentication = string;
export type SnapshotDescription = string;
export type PoolName = string;
export type RetentionLockTimeInDays = number;
export type TapeSize = number;
export type NumTapesToCreate = number;
export type TapeBarcodePrefix = string;
export type TapeBarcode = string;
export type BandwidthType = string;
export type TargetARN = string;
export type IqnName = string;
export type FileShareARN = string;
export type PoolARN = string;
export type FileSystemAssociationARN = string;
export type Marker = string;
export type PositiveIntObject = number;
export type VTLDeviceARN = string;
export type DomainName = string;
export type OrganizationalUnit = string;
export type Host = string;
export type TimeoutInSeconds = number;
export type Folder = string;
export type TagKey = string;
export type LocalConsolePassword = string | redacted.Redacted<string>;
export type SMBGuestPassword = string | redacted.Redacted<string>;
export type BandwidthUploadRateLimit = number;
export type BandwidthDownloadRateLimit = number;
export type ChapSecret = string | redacted.Redacted<string>;
export type CloudWatchLogGroupARN = string;
export type HourOfDay = number;
export type MinuteOfHour = number;
export type DayOfWeek = number;
export type DayOfMonth = number;
export type RecurrenceInHours = number;
export type Description = string;
export type DeviceType = string;
export type TagValue = string;
export type CacheStaleTimeoutInSeconds = number;
export type IPV4Address = string;
export type PermissionMode = string;
export type PermissionId = number;
export type CacheReportFilterValue = string;
export type MinimumNumTapes = number;
export type GatewayId = string;
export type GatewayState = string;
export type NextUpdateAvailabilityDate = string;
export type LastSoftwareUpdate = string;
export type Ec2InstanceId = string;
export type Ec2InstanceRegion = string;
export type EndpointType = string;
export type SoftwareUpdatesEndDate = string;
export type DeprecationDate = string;
export type HostEnvironmentId = string;
export type SoftwareVersion = string;
export type Initiator = string;
export type NotificationId = string;
export type VolumeId = string;
export type VolumeType = string;
export type VolumeStatus = string;
export type VolumeAttachmentStatus = string;
export type DoubleObject = number;
export type CreatedDate = Date;
export type VolumeUsedInBytes = number;
export type ReportCompletionPercent = number;
export type CacheReportName = string;
export type FileSystemAssociationStatus = string;
export type FileShareId = string;
export type FileShareStatus = string;
export type Path = string;
export type TapeArchiveStatus = string;
export type TapeUsage = number;
export type TapeRecoveryPointStatus = string;
export type TapeStatus = string;
export type VTLDeviceType = string;
export type VTLDeviceVendor = string;
export type VTLDeviceProductIdentifier = string;
export type FileSystemAssociationId = string;
export type GatewayOperationalState = string;
export type DiskAllocationType = string;
export type DiskAttribute = string;
export type FileSystemAssociationSyncErrorCode = string;

//# Schemas
export type DiskIds = string[];
export const DiskIds = S.Array(S.String);
export type EncryptionType = "SseS3" | "SseKms" | "DsseKms";
export const EncryptionType = S.Literal("SseS3", "SseKms", "DsseKms");
export type ObjectACL =
  | "private"
  | "public-read"
  | "public-read-write"
  | "authenticated-read"
  | "bucket-owner-read"
  | "bucket-owner-full-control"
  | "aws-exec-read";
export const ObjectACL = S.Literal(
  "private",
  "public-read",
  "public-read-write",
  "authenticated-read",
  "bucket-owner-read",
  "bucket-owner-full-control",
  "aws-exec-read",
);
export type FileShareClientList = string[];
export const FileShareClientList = S.Array(S.String);
export type UserList = string[];
export const UserList = S.Array(S.String);
export type CaseSensitivity = "ClientSpecified" | "CaseSensitive";
export const CaseSensitivity = S.Literal("ClientSpecified", "CaseSensitive");
export type TapeStorageClass = "DEEP_ARCHIVE" | "GLACIER";
export const TapeStorageClass = S.Literal("DEEP_ARCHIVE", "GLACIER");
export type RetentionLockType = "COMPLIANCE" | "GOVERNANCE" | "NONE";
export const RetentionLockType = S.Literal("COMPLIANCE", "GOVERNANCE", "NONE");
export type VolumeARNs = string[];
export const VolumeARNs = S.Array(S.String);
export type FileSystemAssociationARNList = string[];
export const FileSystemAssociationARNList = S.Array(S.String);
export type FileShareARNList = string[];
export const FileShareARNList = S.Array(S.String);
export type TapeARNs = string[];
export const TapeARNs = S.Array(S.String);
export type VTLDeviceARNs = string[];
export const VTLDeviceARNs = S.Array(S.String);
export type Hosts = string[];
export const Hosts = S.Array(S.String);
export type PoolARNs = string[];
export const PoolARNs = S.Array(S.String);
export type FolderList = string[];
export const FolderList = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type GatewayCapacity = "Small" | "Medium" | "Large";
export const GatewayCapacity = S.Literal("Small", "Medium", "Large");
export type SMBSecurityStrategy =
  | "ClientSpecified"
  | "MandatorySigning"
  | "MandatoryEncryption"
  | "MandatoryEncryptionNoAes128";
export const SMBSecurityStrategy = S.Literal(
  "ClientSpecified",
  "MandatorySigning",
  "MandatoryEncryption",
  "MandatoryEncryptionNoAes128",
);
export interface AddCacheInput {
  GatewayARN: string;
  DiskIds: string[];
}
export const AddCacheInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String, DiskIds: DiskIds }).pipe(
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
  identifier: "AddCacheInput",
}) as any as S.Schema<AddCacheInput>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface AddTagsToResourceInput {
  ResourceARN: string;
  Tags: Tag[];
}
export const AddTagsToResourceInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: Tags }).pipe(
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
  identifier: "AddTagsToResourceInput",
}) as any as S.Schema<AddTagsToResourceInput>;
export interface AddUploadBufferInput {
  GatewayARN: string;
  DiskIds: string[];
}
export const AddUploadBufferInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String, DiskIds: DiskIds }).pipe(
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
  identifier: "AddUploadBufferInput",
}) as any as S.Schema<AddUploadBufferInput>;
export interface AddWorkingStorageInput {
  GatewayARN: string;
  DiskIds: string[];
}
export const AddWorkingStorageInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String, DiskIds: DiskIds }).pipe(
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
  identifier: "AddWorkingStorageInput",
}) as any as S.Schema<AddWorkingStorageInput>;
export interface AssignTapePoolInput {
  TapeARN: string;
  PoolId: string;
  BypassGovernanceRetention?: boolean;
}
export const AssignTapePoolInput = S.suspend(() =>
  S.Struct({
    TapeARN: S.String,
    PoolId: S.String,
    BypassGovernanceRetention: S.optional(S.Boolean),
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
  identifier: "AssignTapePoolInput",
}) as any as S.Schema<AssignTapePoolInput>;
export interface AttachVolumeInput {
  GatewayARN: string;
  TargetName?: string;
  VolumeARN: string;
  NetworkInterfaceId: string;
  DiskId?: string;
}
export const AttachVolumeInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    TargetName: S.optional(S.String),
    VolumeARN: S.String,
    NetworkInterfaceId: S.String,
    DiskId: S.optional(S.String),
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
  identifier: "AttachVolumeInput",
}) as any as S.Schema<AttachVolumeInput>;
export interface CancelArchivalInput {
  GatewayARN: string;
  TapeARN: string;
}
export const CancelArchivalInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String, TapeARN: S.String }).pipe(
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
  identifier: "CancelArchivalInput",
}) as any as S.Schema<CancelArchivalInput>;
export interface CancelCacheReportInput {
  CacheReportARN: string;
}
export const CancelCacheReportInput = S.suspend(() =>
  S.Struct({ CacheReportARN: S.String }).pipe(
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
  identifier: "CancelCacheReportInput",
}) as any as S.Schema<CancelCacheReportInput>;
export interface CancelRetrievalInput {
  GatewayARN: string;
  TapeARN: string;
}
export const CancelRetrievalInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String, TapeARN: S.String }).pipe(
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
  identifier: "CancelRetrievalInput",
}) as any as S.Schema<CancelRetrievalInput>;
export interface CreateCachediSCSIVolumeInput {
  GatewayARN: string;
  VolumeSizeInBytes: number;
  SnapshotId?: string;
  TargetName: string;
  SourceVolumeARN?: string;
  NetworkInterfaceId: string;
  ClientToken: string;
  KMSEncrypted?: boolean;
  KMSKey?: string;
  Tags?: Tag[];
}
export const CreateCachediSCSIVolumeInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    VolumeSizeInBytes: S.Number,
    SnapshotId: S.optional(S.String),
    TargetName: S.String,
    SourceVolumeARN: S.optional(S.String),
    NetworkInterfaceId: S.String,
    ClientToken: S.String,
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    Tags: S.optional(Tags),
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
  identifier: "CreateCachediSCSIVolumeInput",
}) as any as S.Schema<CreateCachediSCSIVolumeInput>;
export interface CacheAttributes {
  CacheStaleTimeoutInSeconds?: number;
}
export const CacheAttributes = S.suspend(() =>
  S.Struct({ CacheStaleTimeoutInSeconds: S.optional(S.Number) }),
).annotations({
  identifier: "CacheAttributes",
}) as any as S.Schema<CacheAttributes>;
export interface CreateSMBFileShareInput {
  ClientToken: string;
  GatewayARN: string;
  EncryptionType?: EncryptionType;
  KMSEncrypted?: boolean;
  KMSKey?: string;
  Role: string;
  LocationARN: string;
  DefaultStorageClass?: string;
  ObjectACL?: ObjectACL;
  ReadOnly?: boolean;
  GuessMIMETypeEnabled?: boolean;
  RequesterPays?: boolean;
  SMBACLEnabled?: boolean;
  AccessBasedEnumeration?: boolean;
  AdminUserList?: string[];
  ValidUserList?: string[];
  InvalidUserList?: string[];
  AuditDestinationARN?: string;
  Authentication?: string;
  CaseSensitivity?: CaseSensitivity;
  Tags?: Tag[];
  FileShareName?: string;
  CacheAttributes?: CacheAttributes;
  NotificationPolicy?: string;
  VPCEndpointDNSName?: string;
  BucketRegion?: string;
  OplocksEnabled?: boolean;
}
export const CreateSMBFileShareInput = S.suspend(() =>
  S.Struct({
    ClientToken: S.String,
    GatewayARN: S.String,
    EncryptionType: S.optional(EncryptionType),
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    Role: S.String,
    LocationARN: S.String,
    DefaultStorageClass: S.optional(S.String),
    ObjectACL: S.optional(ObjectACL),
    ReadOnly: S.optional(S.Boolean),
    GuessMIMETypeEnabled: S.optional(S.Boolean),
    RequesterPays: S.optional(S.Boolean),
    SMBACLEnabled: S.optional(S.Boolean),
    AccessBasedEnumeration: S.optional(S.Boolean),
    AdminUserList: S.optional(UserList),
    ValidUserList: S.optional(UserList),
    InvalidUserList: S.optional(UserList),
    AuditDestinationARN: S.optional(S.String),
    Authentication: S.optional(S.String),
    CaseSensitivity: S.optional(CaseSensitivity),
    Tags: S.optional(Tags),
    FileShareName: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
    NotificationPolicy: S.optional(S.String),
    VPCEndpointDNSName: S.optional(S.String),
    BucketRegion: S.optional(S.String),
    OplocksEnabled: S.optional(S.Boolean),
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
  identifier: "CreateSMBFileShareInput",
}) as any as S.Schema<CreateSMBFileShareInput>;
export interface CreateSnapshotInput {
  VolumeARN: string;
  SnapshotDescription: string;
  Tags?: Tag[];
}
export const CreateSnapshotInput = S.suspend(() =>
  S.Struct({
    VolumeARN: S.String,
    SnapshotDescription: S.String,
    Tags: S.optional(Tags),
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
  identifier: "CreateSnapshotInput",
}) as any as S.Schema<CreateSnapshotInput>;
export interface CreateSnapshotFromVolumeRecoveryPointInput {
  VolumeARN: string;
  SnapshotDescription: string;
  Tags?: Tag[];
}
export const CreateSnapshotFromVolumeRecoveryPointInput = S.suspend(() =>
  S.Struct({
    VolumeARN: S.String,
    SnapshotDescription: S.String,
    Tags: S.optional(Tags),
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
  identifier: "CreateSnapshotFromVolumeRecoveryPointInput",
}) as any as S.Schema<CreateSnapshotFromVolumeRecoveryPointInput>;
export interface CreateStorediSCSIVolumeInput {
  GatewayARN: string;
  DiskId: string;
  SnapshotId?: string;
  PreserveExistingData: boolean;
  TargetName: string;
  NetworkInterfaceId: string;
  KMSEncrypted?: boolean;
  KMSKey?: string;
  Tags?: Tag[];
}
export const CreateStorediSCSIVolumeInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    DiskId: S.String,
    SnapshotId: S.optional(S.String),
    PreserveExistingData: S.Boolean,
    TargetName: S.String,
    NetworkInterfaceId: S.String,
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    Tags: S.optional(Tags),
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
  identifier: "CreateStorediSCSIVolumeInput",
}) as any as S.Schema<CreateStorediSCSIVolumeInput>;
export interface CreateTapePoolInput {
  PoolName: string;
  StorageClass: TapeStorageClass;
  RetentionLockType?: RetentionLockType;
  RetentionLockTimeInDays?: number;
  Tags?: Tag[];
}
export const CreateTapePoolInput = S.suspend(() =>
  S.Struct({
    PoolName: S.String,
    StorageClass: TapeStorageClass,
    RetentionLockType: S.optional(RetentionLockType),
    RetentionLockTimeInDays: S.optional(S.Number),
    Tags: S.optional(Tags),
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
  identifier: "CreateTapePoolInput",
}) as any as S.Schema<CreateTapePoolInput>;
export interface CreateTapesInput {
  GatewayARN: string;
  TapeSizeInBytes: number;
  ClientToken: string;
  NumTapesToCreate: number;
  TapeBarcodePrefix: string;
  KMSEncrypted?: boolean;
  KMSKey?: string;
  PoolId?: string;
  Worm?: boolean;
  Tags?: Tag[];
}
export const CreateTapesInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    TapeSizeInBytes: S.Number,
    ClientToken: S.String,
    NumTapesToCreate: S.Number,
    TapeBarcodePrefix: S.String,
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    PoolId: S.optional(S.String),
    Worm: S.optional(S.Boolean),
    Tags: S.optional(Tags),
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
  identifier: "CreateTapesInput",
}) as any as S.Schema<CreateTapesInput>;
export interface CreateTapeWithBarcodeInput {
  GatewayARN: string;
  TapeSizeInBytes: number;
  TapeBarcode: string;
  KMSEncrypted?: boolean;
  KMSKey?: string;
  PoolId?: string;
  Worm?: boolean;
  Tags?: Tag[];
}
export const CreateTapeWithBarcodeInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    TapeSizeInBytes: S.Number,
    TapeBarcode: S.String,
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    PoolId: S.optional(S.String),
    Worm: S.optional(S.Boolean),
    Tags: S.optional(Tags),
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
  identifier: "CreateTapeWithBarcodeInput",
}) as any as S.Schema<CreateTapeWithBarcodeInput>;
export interface DeleteAutomaticTapeCreationPolicyInput {
  GatewayARN: string;
}
export const DeleteAutomaticTapeCreationPolicyInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "DeleteAutomaticTapeCreationPolicyInput",
}) as any as S.Schema<DeleteAutomaticTapeCreationPolicyInput>;
export interface DeleteBandwidthRateLimitInput {
  GatewayARN: string;
  BandwidthType: string;
}
export const DeleteBandwidthRateLimitInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String, BandwidthType: S.String }).pipe(
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
  identifier: "DeleteBandwidthRateLimitInput",
}) as any as S.Schema<DeleteBandwidthRateLimitInput>;
export interface DeleteCacheReportInput {
  CacheReportARN: string;
}
export const DeleteCacheReportInput = S.suspend(() =>
  S.Struct({ CacheReportARN: S.String }).pipe(
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
  identifier: "DeleteCacheReportInput",
}) as any as S.Schema<DeleteCacheReportInput>;
export interface DeleteChapCredentialsInput {
  TargetARN: string;
  InitiatorName: string;
}
export const DeleteChapCredentialsInput = S.suspend(() =>
  S.Struct({ TargetARN: S.String, InitiatorName: S.String }).pipe(
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
  identifier: "DeleteChapCredentialsInput",
}) as any as S.Schema<DeleteChapCredentialsInput>;
export interface DeleteFileShareInput {
  FileShareARN: string;
  ForceDelete?: boolean;
}
export const DeleteFileShareInput = S.suspend(() =>
  S.Struct({ FileShareARN: S.String, ForceDelete: S.optional(S.Boolean) }).pipe(
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
  identifier: "DeleteFileShareInput",
}) as any as S.Schema<DeleteFileShareInput>;
export interface DeleteGatewayInput {
  GatewayARN: string;
}
export const DeleteGatewayInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "DeleteGatewayInput",
}) as any as S.Schema<DeleteGatewayInput>;
export interface DeleteSnapshotScheduleInput {
  VolumeARN: string;
}
export const DeleteSnapshotScheduleInput = S.suspend(() =>
  S.Struct({ VolumeARN: S.String }).pipe(
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
  identifier: "DeleteSnapshotScheduleInput",
}) as any as S.Schema<DeleteSnapshotScheduleInput>;
export interface DeleteTapeInput {
  GatewayARN: string;
  TapeARN: string;
  BypassGovernanceRetention?: boolean;
}
export const DeleteTapeInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    TapeARN: S.String,
    BypassGovernanceRetention: S.optional(S.Boolean),
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
  identifier: "DeleteTapeInput",
}) as any as S.Schema<DeleteTapeInput>;
export interface DeleteTapeArchiveInput {
  TapeARN: string;
  BypassGovernanceRetention?: boolean;
}
export const DeleteTapeArchiveInput = S.suspend(() =>
  S.Struct({
    TapeARN: S.String,
    BypassGovernanceRetention: S.optional(S.Boolean),
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
  identifier: "DeleteTapeArchiveInput",
}) as any as S.Schema<DeleteTapeArchiveInput>;
export interface DeleteTapePoolInput {
  PoolARN: string;
}
export const DeleteTapePoolInput = S.suspend(() =>
  S.Struct({ PoolARN: S.String }).pipe(
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
  identifier: "DeleteTapePoolInput",
}) as any as S.Schema<DeleteTapePoolInput>;
export interface DeleteVolumeInput {
  VolumeARN: string;
}
export const DeleteVolumeInput = S.suspend(() =>
  S.Struct({ VolumeARN: S.String }).pipe(
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
  identifier: "DeleteVolumeInput",
}) as any as S.Schema<DeleteVolumeInput>;
export interface DescribeAvailabilityMonitorTestInput {
  GatewayARN: string;
}
export const DescribeAvailabilityMonitorTestInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "DescribeAvailabilityMonitorTestInput",
}) as any as S.Schema<DescribeAvailabilityMonitorTestInput>;
export interface DescribeBandwidthRateLimitInput {
  GatewayARN: string;
}
export const DescribeBandwidthRateLimitInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "DescribeBandwidthRateLimitInput",
}) as any as S.Schema<DescribeBandwidthRateLimitInput>;
export interface DescribeBandwidthRateLimitScheduleInput {
  GatewayARN: string;
}
export const DescribeBandwidthRateLimitScheduleInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "DescribeBandwidthRateLimitScheduleInput",
}) as any as S.Schema<DescribeBandwidthRateLimitScheduleInput>;
export interface DescribeCacheInput {
  GatewayARN: string;
}
export const DescribeCacheInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "DescribeCacheInput",
}) as any as S.Schema<DescribeCacheInput>;
export interface DescribeCachediSCSIVolumesInput {
  VolumeARNs: string[];
}
export const DescribeCachediSCSIVolumesInput = S.suspend(() =>
  S.Struct({ VolumeARNs: VolumeARNs }).pipe(
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
  identifier: "DescribeCachediSCSIVolumesInput",
}) as any as S.Schema<DescribeCachediSCSIVolumesInput>;
export interface DescribeCacheReportInput {
  CacheReportARN: string;
}
export const DescribeCacheReportInput = S.suspend(() =>
  S.Struct({ CacheReportARN: S.String }).pipe(
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
  identifier: "DescribeCacheReportInput",
}) as any as S.Schema<DescribeCacheReportInput>;
export interface DescribeChapCredentialsInput {
  TargetARN: string;
}
export const DescribeChapCredentialsInput = S.suspend(() =>
  S.Struct({ TargetARN: S.String }).pipe(
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
  identifier: "DescribeChapCredentialsInput",
}) as any as S.Schema<DescribeChapCredentialsInput>;
export interface DescribeFileSystemAssociationsInput {
  FileSystemAssociationARNList: string[];
}
export const DescribeFileSystemAssociationsInput = S.suspend(() =>
  S.Struct({ FileSystemAssociationARNList: FileSystemAssociationARNList }).pipe(
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
  identifier: "DescribeFileSystemAssociationsInput",
}) as any as S.Schema<DescribeFileSystemAssociationsInput>;
export interface DescribeGatewayInformationInput {
  GatewayARN: string;
}
export const DescribeGatewayInformationInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "DescribeGatewayInformationInput",
}) as any as S.Schema<DescribeGatewayInformationInput>;
export interface DescribeMaintenanceStartTimeInput {
  GatewayARN: string;
}
export const DescribeMaintenanceStartTimeInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "DescribeMaintenanceStartTimeInput",
}) as any as S.Schema<DescribeMaintenanceStartTimeInput>;
export interface DescribeNFSFileSharesInput {
  FileShareARNList: string[];
}
export const DescribeNFSFileSharesInput = S.suspend(() =>
  S.Struct({ FileShareARNList: FileShareARNList }).pipe(
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
  identifier: "DescribeNFSFileSharesInput",
}) as any as S.Schema<DescribeNFSFileSharesInput>;
export interface DescribeSMBFileSharesInput {
  FileShareARNList: string[];
}
export const DescribeSMBFileSharesInput = S.suspend(() =>
  S.Struct({ FileShareARNList: FileShareARNList }).pipe(
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
  identifier: "DescribeSMBFileSharesInput",
}) as any as S.Schema<DescribeSMBFileSharesInput>;
export interface DescribeSMBSettingsInput {
  GatewayARN: string;
}
export const DescribeSMBSettingsInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "DescribeSMBSettingsInput",
}) as any as S.Schema<DescribeSMBSettingsInput>;
export interface DescribeSnapshotScheduleInput {
  VolumeARN: string;
}
export const DescribeSnapshotScheduleInput = S.suspend(() =>
  S.Struct({ VolumeARN: S.String }).pipe(
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
  identifier: "DescribeSnapshotScheduleInput",
}) as any as S.Schema<DescribeSnapshotScheduleInput>;
export interface DescribeStorediSCSIVolumesInput {
  VolumeARNs: string[];
}
export const DescribeStorediSCSIVolumesInput = S.suspend(() =>
  S.Struct({ VolumeARNs: VolumeARNs }).pipe(
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
  identifier: "DescribeStorediSCSIVolumesInput",
}) as any as S.Schema<DescribeStorediSCSIVolumesInput>;
export interface DescribeTapeArchivesInput {
  TapeARNs?: string[];
  Marker?: string;
  Limit?: number;
}
export const DescribeTapeArchivesInput = S.suspend(() =>
  S.Struct({
    TapeARNs: S.optional(TapeARNs),
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "DescribeTapeArchivesInput",
}) as any as S.Schema<DescribeTapeArchivesInput>;
export interface DescribeTapeRecoveryPointsInput {
  GatewayARN: string;
  Marker?: string;
  Limit?: number;
}
export const DescribeTapeRecoveryPointsInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "DescribeTapeRecoveryPointsInput",
}) as any as S.Schema<DescribeTapeRecoveryPointsInput>;
export interface DescribeTapesInput {
  GatewayARN: string;
  TapeARNs?: string[];
  Marker?: string;
  Limit?: number;
}
export const DescribeTapesInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    TapeARNs: S.optional(TapeARNs),
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "DescribeTapesInput",
}) as any as S.Schema<DescribeTapesInput>;
export interface DescribeUploadBufferInput {
  GatewayARN: string;
}
export const DescribeUploadBufferInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "DescribeUploadBufferInput",
}) as any as S.Schema<DescribeUploadBufferInput>;
export interface DescribeVTLDevicesInput {
  GatewayARN: string;
  VTLDeviceARNs?: string[];
  Marker?: string;
  Limit?: number;
}
export const DescribeVTLDevicesInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    VTLDeviceARNs: S.optional(VTLDeviceARNs),
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "DescribeVTLDevicesInput",
}) as any as S.Schema<DescribeVTLDevicesInput>;
export interface DescribeWorkingStorageInput {
  GatewayARN: string;
}
export const DescribeWorkingStorageInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "DescribeWorkingStorageInput",
}) as any as S.Schema<DescribeWorkingStorageInput>;
export interface DetachVolumeInput {
  VolumeARN: string;
  ForceDetach?: boolean;
}
export const DetachVolumeInput = S.suspend(() =>
  S.Struct({ VolumeARN: S.String, ForceDetach: S.optional(S.Boolean) }).pipe(
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
  identifier: "DetachVolumeInput",
}) as any as S.Schema<DetachVolumeInput>;
export interface DisableGatewayInput {
  GatewayARN: string;
}
export const DisableGatewayInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "DisableGatewayInput",
}) as any as S.Schema<DisableGatewayInput>;
export interface DisassociateFileSystemInput {
  FileSystemAssociationARN: string;
  ForceDelete?: boolean;
}
export const DisassociateFileSystemInput = S.suspend(() =>
  S.Struct({
    FileSystemAssociationARN: S.String,
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
  identifier: "DisassociateFileSystemInput",
}) as any as S.Schema<DisassociateFileSystemInput>;
export interface EvictFilesFailingUploadInput {
  FileShareARN: string;
  ForceRemove?: boolean;
}
export const EvictFilesFailingUploadInput = S.suspend(() =>
  S.Struct({ FileShareARN: S.String, ForceRemove: S.optional(S.Boolean) }).pipe(
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
  identifier: "EvictFilesFailingUploadInput",
}) as any as S.Schema<EvictFilesFailingUploadInput>;
export interface JoinDomainInput {
  GatewayARN: string;
  DomainName: string;
  OrganizationalUnit?: string;
  DomainControllers?: string[];
  TimeoutInSeconds?: number;
  UserName: string;
  Password: string | redacted.Redacted<string>;
}
export const JoinDomainInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    DomainName: S.String,
    OrganizationalUnit: S.optional(S.String),
    DomainControllers: S.optional(Hosts),
    TimeoutInSeconds: S.optional(S.Number),
    UserName: S.String,
    Password: SensitiveString,
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
  identifier: "JoinDomainInput",
}) as any as S.Schema<JoinDomainInput>;
export interface ListAutomaticTapeCreationPoliciesInput {
  GatewayARN?: string;
}
export const ListAutomaticTapeCreationPoliciesInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(
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
  identifier: "ListAutomaticTapeCreationPoliciesInput",
}) as any as S.Schema<ListAutomaticTapeCreationPoliciesInput>;
export interface ListCacheReportsInput {
  Marker?: string;
}
export const ListCacheReportsInput = S.suspend(() =>
  S.Struct({ Marker: S.optional(S.String) }).pipe(
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
  identifier: "ListCacheReportsInput",
}) as any as S.Schema<ListCacheReportsInput>;
export interface ListFileSharesInput {
  GatewayARN?: string;
  Limit?: number;
  Marker?: string;
}
export const ListFileSharesInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "ListFileSharesInput",
}) as any as S.Schema<ListFileSharesInput>;
export interface ListFileSystemAssociationsInput {
  GatewayARN?: string;
  Limit?: number;
  Marker?: string;
}
export const ListFileSystemAssociationsInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
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
  identifier: "ListFileSystemAssociationsInput",
}) as any as S.Schema<ListFileSystemAssociationsInput>;
export interface ListGatewaysInput {
  Marker?: string;
  Limit?: number;
}
export const ListGatewaysInput = S.suspend(() =>
  S.Struct({ Marker: S.optional(S.String), Limit: S.optional(S.Number) }).pipe(
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
  identifier: "ListGatewaysInput",
}) as any as S.Schema<ListGatewaysInput>;
export interface ListLocalDisksInput {
  GatewayARN: string;
}
export const ListLocalDisksInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "ListLocalDisksInput",
}) as any as S.Schema<ListLocalDisksInput>;
export interface ListTagsForResourceInput {
  ResourceARN: string;
  Marker?: string;
  Limit?: number;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({
    ResourceARN: S.String,
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface ListTapePoolsInput {
  PoolARNs?: string[];
  Marker?: string;
  Limit?: number;
}
export const ListTapePoolsInput = S.suspend(() =>
  S.Struct({
    PoolARNs: S.optional(PoolARNs),
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListTapePoolsInput",
}) as any as S.Schema<ListTapePoolsInput>;
export interface ListTapesInput {
  TapeARNs?: string[];
  Marker?: string;
  Limit?: number;
}
export const ListTapesInput = S.suspend(() =>
  S.Struct({
    TapeARNs: S.optional(TapeARNs),
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListTapesInput",
}) as any as S.Schema<ListTapesInput>;
export interface ListVolumeInitiatorsInput {
  VolumeARN: string;
}
export const ListVolumeInitiatorsInput = S.suspend(() =>
  S.Struct({ VolumeARN: S.String }).pipe(
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
  identifier: "ListVolumeInitiatorsInput",
}) as any as S.Schema<ListVolumeInitiatorsInput>;
export interface ListVolumeRecoveryPointsInput {
  GatewayARN: string;
}
export const ListVolumeRecoveryPointsInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "ListVolumeRecoveryPointsInput",
}) as any as S.Schema<ListVolumeRecoveryPointsInput>;
export interface ListVolumesInput {
  GatewayARN?: string;
  Marker?: string;
  Limit?: number;
}
export const ListVolumesInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
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
  identifier: "ListVolumesInput",
}) as any as S.Schema<ListVolumesInput>;
export interface NotifyWhenUploadedInput {
  FileShareARN: string;
}
export const NotifyWhenUploadedInput = S.suspend(() =>
  S.Struct({ FileShareARN: S.String }).pipe(
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
  identifier: "NotifyWhenUploadedInput",
}) as any as S.Schema<NotifyWhenUploadedInput>;
export interface RefreshCacheInput {
  FileShareARN: string;
  FolderList?: string[];
  Recursive?: boolean;
}
export const RefreshCacheInput = S.suspend(() =>
  S.Struct({
    FileShareARN: S.String,
    FolderList: S.optional(FolderList),
    Recursive: S.optional(S.Boolean),
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
  identifier: "RefreshCacheInput",
}) as any as S.Schema<RefreshCacheInput>;
export interface RemoveTagsFromResourceInput {
  ResourceARN: string;
  TagKeys: string[];
}
export const RemoveTagsFromResourceInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeys }).pipe(
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
  identifier: "RemoveTagsFromResourceInput",
}) as any as S.Schema<RemoveTagsFromResourceInput>;
export interface ResetCacheInput {
  GatewayARN: string;
}
export const ResetCacheInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "ResetCacheInput",
}) as any as S.Schema<ResetCacheInput>;
export interface RetrieveTapeArchiveInput {
  TapeARN: string;
  GatewayARN: string;
}
export const RetrieveTapeArchiveInput = S.suspend(() =>
  S.Struct({ TapeARN: S.String, GatewayARN: S.String }).pipe(
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
  identifier: "RetrieveTapeArchiveInput",
}) as any as S.Schema<RetrieveTapeArchiveInput>;
export interface RetrieveTapeRecoveryPointInput {
  TapeARN: string;
  GatewayARN: string;
}
export const RetrieveTapeRecoveryPointInput = S.suspend(() =>
  S.Struct({ TapeARN: S.String, GatewayARN: S.String }).pipe(
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
  identifier: "RetrieveTapeRecoveryPointInput",
}) as any as S.Schema<RetrieveTapeRecoveryPointInput>;
export interface SetLocalConsolePasswordInput {
  GatewayARN: string;
  LocalConsolePassword: string | redacted.Redacted<string>;
}
export const SetLocalConsolePasswordInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    LocalConsolePassword: SensitiveString,
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
  identifier: "SetLocalConsolePasswordInput",
}) as any as S.Schema<SetLocalConsolePasswordInput>;
export interface SetSMBGuestPasswordInput {
  GatewayARN: string;
  Password: string | redacted.Redacted<string>;
}
export const SetSMBGuestPasswordInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String, Password: SensitiveString }).pipe(
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
  identifier: "SetSMBGuestPasswordInput",
}) as any as S.Schema<SetSMBGuestPasswordInput>;
export interface ShutdownGatewayInput {
  GatewayARN: string;
}
export const ShutdownGatewayInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "ShutdownGatewayInput",
}) as any as S.Schema<ShutdownGatewayInput>;
export interface StartAvailabilityMonitorTestInput {
  GatewayARN: string;
}
export const StartAvailabilityMonitorTestInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "StartAvailabilityMonitorTestInput",
}) as any as S.Schema<StartAvailabilityMonitorTestInput>;
export interface StartGatewayInput {
  GatewayARN: string;
}
export const StartGatewayInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "StartGatewayInput",
}) as any as S.Schema<StartGatewayInput>;
export interface UpdateBandwidthRateLimitInput {
  GatewayARN: string;
  AverageUploadRateLimitInBitsPerSec?: number;
  AverageDownloadRateLimitInBitsPerSec?: number;
}
export const UpdateBandwidthRateLimitInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    AverageUploadRateLimitInBitsPerSec: S.optional(S.Number),
    AverageDownloadRateLimitInBitsPerSec: S.optional(S.Number),
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
  identifier: "UpdateBandwidthRateLimitInput",
}) as any as S.Schema<UpdateBandwidthRateLimitInput>;
export interface UpdateChapCredentialsInput {
  TargetARN: string;
  SecretToAuthenticateInitiator: string | redacted.Redacted<string>;
  InitiatorName: string;
  SecretToAuthenticateTarget?: string | redacted.Redacted<string>;
}
export const UpdateChapCredentialsInput = S.suspend(() =>
  S.Struct({
    TargetARN: S.String,
    SecretToAuthenticateInitiator: SensitiveString,
    InitiatorName: S.String,
    SecretToAuthenticateTarget: S.optional(SensitiveString),
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
  identifier: "UpdateChapCredentialsInput",
}) as any as S.Schema<UpdateChapCredentialsInput>;
export interface UpdateFileSystemAssociationInput {
  FileSystemAssociationARN: string;
  UserName?: string;
  Password?: string | redacted.Redacted<string>;
  AuditDestinationARN?: string;
  CacheAttributes?: CacheAttributes;
}
export const UpdateFileSystemAssociationInput = S.suspend(() =>
  S.Struct({
    FileSystemAssociationARN: S.String,
    UserName: S.optional(S.String),
    Password: S.optional(SensitiveString),
    AuditDestinationARN: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
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
  identifier: "UpdateFileSystemAssociationInput",
}) as any as S.Schema<UpdateFileSystemAssociationInput>;
export interface UpdateGatewayInformationInput {
  GatewayARN: string;
  GatewayName?: string;
  GatewayTimezone?: string;
  CloudWatchLogGroupARN?: string;
  GatewayCapacity?: GatewayCapacity;
}
export const UpdateGatewayInformationInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    GatewayName: S.optional(S.String),
    GatewayTimezone: S.optional(S.String),
    CloudWatchLogGroupARN: S.optional(S.String),
    GatewayCapacity: S.optional(GatewayCapacity),
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
  identifier: "UpdateGatewayInformationInput",
}) as any as S.Schema<UpdateGatewayInformationInput>;
export interface UpdateGatewaySoftwareNowInput {
  GatewayARN: string;
}
export const UpdateGatewaySoftwareNowInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String }).pipe(
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
  identifier: "UpdateGatewaySoftwareNowInput",
}) as any as S.Schema<UpdateGatewaySoftwareNowInput>;
export interface NFSFileShareDefaults {
  FileMode?: string;
  DirectoryMode?: string;
  GroupId?: number;
  OwnerId?: number;
}
export const NFSFileShareDefaults = S.suspend(() =>
  S.Struct({
    FileMode: S.optional(S.String),
    DirectoryMode: S.optional(S.String),
    GroupId: S.optional(S.Number),
    OwnerId: S.optional(S.Number),
  }),
).annotations({
  identifier: "NFSFileShareDefaults",
}) as any as S.Schema<NFSFileShareDefaults>;
export interface UpdateNFSFileShareInput {
  FileShareARN: string;
  EncryptionType?: EncryptionType;
  KMSEncrypted?: boolean;
  KMSKey?: string;
  NFSFileShareDefaults?: NFSFileShareDefaults;
  DefaultStorageClass?: string;
  ObjectACL?: ObjectACL;
  ClientList?: string[];
  Squash?: string;
  ReadOnly?: boolean;
  GuessMIMETypeEnabled?: boolean;
  RequesterPays?: boolean;
  FileShareName?: string;
  CacheAttributes?: CacheAttributes;
  NotificationPolicy?: string;
  AuditDestinationARN?: string;
}
export const UpdateNFSFileShareInput = S.suspend(() =>
  S.Struct({
    FileShareARN: S.String,
    EncryptionType: S.optional(EncryptionType),
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    NFSFileShareDefaults: S.optional(NFSFileShareDefaults),
    DefaultStorageClass: S.optional(S.String),
    ObjectACL: S.optional(ObjectACL),
    ClientList: S.optional(FileShareClientList),
    Squash: S.optional(S.String),
    ReadOnly: S.optional(S.Boolean),
    GuessMIMETypeEnabled: S.optional(S.Boolean),
    RequesterPays: S.optional(S.Boolean),
    FileShareName: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
    NotificationPolicy: S.optional(S.String),
    AuditDestinationARN: S.optional(S.String),
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
  identifier: "UpdateNFSFileShareInput",
}) as any as S.Schema<UpdateNFSFileShareInput>;
export interface UpdateSMBFileShareInput {
  FileShareARN: string;
  EncryptionType?: EncryptionType;
  KMSEncrypted?: boolean;
  KMSKey?: string;
  DefaultStorageClass?: string;
  ObjectACL?: ObjectACL;
  ReadOnly?: boolean;
  GuessMIMETypeEnabled?: boolean;
  RequesterPays?: boolean;
  SMBACLEnabled?: boolean;
  AccessBasedEnumeration?: boolean;
  AdminUserList?: string[];
  ValidUserList?: string[];
  InvalidUserList?: string[];
  AuditDestinationARN?: string;
  CaseSensitivity?: CaseSensitivity;
  FileShareName?: string;
  CacheAttributes?: CacheAttributes;
  NotificationPolicy?: string;
  OplocksEnabled?: boolean;
}
export const UpdateSMBFileShareInput = S.suspend(() =>
  S.Struct({
    FileShareARN: S.String,
    EncryptionType: S.optional(EncryptionType),
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    DefaultStorageClass: S.optional(S.String),
    ObjectACL: S.optional(ObjectACL),
    ReadOnly: S.optional(S.Boolean),
    GuessMIMETypeEnabled: S.optional(S.Boolean),
    RequesterPays: S.optional(S.Boolean),
    SMBACLEnabled: S.optional(S.Boolean),
    AccessBasedEnumeration: S.optional(S.Boolean),
    AdminUserList: S.optional(UserList),
    ValidUserList: S.optional(UserList),
    InvalidUserList: S.optional(UserList),
    AuditDestinationARN: S.optional(S.String),
    CaseSensitivity: S.optional(CaseSensitivity),
    FileShareName: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
    NotificationPolicy: S.optional(S.String),
    OplocksEnabled: S.optional(S.Boolean),
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
  identifier: "UpdateSMBFileShareInput",
}) as any as S.Schema<UpdateSMBFileShareInput>;
export interface UpdateSMBFileShareVisibilityInput {
  GatewayARN: string;
  FileSharesVisible: boolean;
}
export const UpdateSMBFileShareVisibilityInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String, FileSharesVisible: S.Boolean }).pipe(
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
  identifier: "UpdateSMBFileShareVisibilityInput",
}) as any as S.Schema<UpdateSMBFileShareVisibilityInput>;
export interface UpdateSMBSecurityStrategyInput {
  GatewayARN: string;
  SMBSecurityStrategy: SMBSecurityStrategy;
}
export const UpdateSMBSecurityStrategyInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    SMBSecurityStrategy: SMBSecurityStrategy,
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
  identifier: "UpdateSMBSecurityStrategyInput",
}) as any as S.Schema<UpdateSMBSecurityStrategyInput>;
export interface UpdateSnapshotScheduleInput {
  VolumeARN: string;
  StartAt: number;
  RecurrenceInHours: number;
  Description?: string;
  Tags?: Tag[];
}
export const UpdateSnapshotScheduleInput = S.suspend(() =>
  S.Struct({
    VolumeARN: S.String,
    StartAt: S.Number,
    RecurrenceInHours: S.Number,
    Description: S.optional(S.String),
    Tags: S.optional(Tags),
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
  identifier: "UpdateSnapshotScheduleInput",
}) as any as S.Schema<UpdateSnapshotScheduleInput>;
export interface UpdateVTLDeviceTypeInput {
  VTLDeviceARN: string;
  DeviceType: string;
}
export const UpdateVTLDeviceTypeInput = S.suspend(() =>
  S.Struct({ VTLDeviceARN: S.String, DeviceType: S.String }).pipe(
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
  identifier: "UpdateVTLDeviceTypeInput",
}) as any as S.Schema<UpdateVTLDeviceTypeInput>;
export type IpAddressList = string[];
export const IpAddressList = S.Array(S.String);
export type CacheReportFilterName = "UploadState" | "UploadFailureReason";
export const CacheReportFilterName = S.Literal(
  "UploadState",
  "UploadFailureReason",
);
export type CacheReportFilterValues = string[];
export const CacheReportFilterValues = S.Array(S.String);
export type DaysOfWeek = number[];
export const DaysOfWeek = S.Array(S.Number);
export type AutomaticUpdatePolicy = "ALL_VERSIONS" | "EMERGENCY_VERSIONS_ONLY";
export const AutomaticUpdatePolicy = S.Literal(
  "ALL_VERSIONS",
  "EMERGENCY_VERSIONS_ONLY",
);
export interface EndpointNetworkConfiguration {
  IpAddresses?: string[];
}
export const EndpointNetworkConfiguration = S.suspend(() =>
  S.Struct({ IpAddresses: S.optional(IpAddressList) }),
).annotations({
  identifier: "EndpointNetworkConfiguration",
}) as any as S.Schema<EndpointNetworkConfiguration>;
export type AvailabilityMonitorTestStatus = "COMPLETE" | "FAILED" | "PENDING";
export const AvailabilityMonitorTestStatus = S.Literal(
  "COMPLETE",
  "FAILED",
  "PENDING",
);
export type HostEnvironment =
  | "VMWARE"
  | "HYPER-V"
  | "EC2"
  | "KVM"
  | "OTHER"
  | "SNOWBALL";
export const HostEnvironment = S.Literal(
  "VMWARE",
  "HYPER-V",
  "EC2",
  "KVM",
  "OTHER",
  "SNOWBALL",
);
export type SupportedGatewayCapacities = GatewayCapacity[];
export const SupportedGatewayCapacities = S.Array(GatewayCapacity);
export type ActiveDirectoryStatus =
  | "ACCESS_DENIED"
  | "DETACHED"
  | "JOINED"
  | "JOINING"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNKNOWN_ERROR"
  | "INSUFFICIENT_PERMISSIONS";
export const ActiveDirectoryStatus = S.Literal(
  "ACCESS_DENIED",
  "DETACHED",
  "JOINED",
  "JOINING",
  "NETWORK_ERROR",
  "TIMEOUT",
  "UNKNOWN_ERROR",
  "INSUFFICIENT_PERMISSIONS",
);
export type CacheReportStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED"
  | "FAILED"
  | "ERROR";
export const CacheReportStatus = S.Literal(
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELED",
  "FAILED",
  "ERROR",
);
export interface CacheReportFilter {
  Name: CacheReportFilterName;
  Values: string[];
}
export const CacheReportFilter = S.suspend(() =>
  S.Struct({ Name: CacheReportFilterName, Values: CacheReportFilterValues }),
).annotations({
  identifier: "CacheReportFilter",
}) as any as S.Schema<CacheReportFilter>;
export type CacheReportFilterList = CacheReportFilter[];
export const CacheReportFilterList = S.Array(CacheReportFilter);
export interface CacheReportInfo {
  CacheReportARN?: string;
  CacheReportStatus?: CacheReportStatus;
  ReportCompletionPercent?: number;
  EndTime?: Date;
  Role?: string;
  FileShareARN?: string;
  LocationARN?: string;
  StartTime?: Date;
  InclusionFilters?: CacheReportFilter[];
  ExclusionFilters?: CacheReportFilter[];
  ReportName?: string;
  Tags?: Tag[];
}
export const CacheReportInfo = S.suspend(() =>
  S.Struct({
    CacheReportARN: S.optional(S.String),
    CacheReportStatus: S.optional(CacheReportStatus),
    ReportCompletionPercent: S.optional(S.Number),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Role: S.optional(S.String),
    FileShareARN: S.optional(S.String),
    LocationARN: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    InclusionFilters: S.optional(CacheReportFilterList),
    ExclusionFilters: S.optional(CacheReportFilterList),
    ReportName: S.optional(S.String),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "CacheReportInfo",
}) as any as S.Schema<CacheReportInfo>;
export type CacheReportList = CacheReportInfo[];
export const CacheReportList = S.Array(CacheReportInfo);
export type Initiators = string[];
export const Initiators = S.Array(S.String);
export interface AutomaticTapeCreationRule {
  TapeBarcodePrefix: string;
  PoolId: string;
  TapeSizeInBytes: number;
  MinimumNumTapes: number;
  Worm?: boolean;
}
export const AutomaticTapeCreationRule = S.suspend(() =>
  S.Struct({
    TapeBarcodePrefix: S.String,
    PoolId: S.String,
    TapeSizeInBytes: S.Number,
    MinimumNumTapes: S.Number,
    Worm: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "AutomaticTapeCreationRule",
}) as any as S.Schema<AutomaticTapeCreationRule>;
export type AutomaticTapeCreationRules = AutomaticTapeCreationRule[];
export const AutomaticTapeCreationRules = S.Array(AutomaticTapeCreationRule);
export interface BandwidthRateLimitInterval {
  StartHourOfDay: number;
  StartMinuteOfHour: number;
  EndHourOfDay: number;
  EndMinuteOfHour: number;
  DaysOfWeek: number[];
  AverageUploadRateLimitInBitsPerSec?: number;
  AverageDownloadRateLimitInBitsPerSec?: number;
}
export const BandwidthRateLimitInterval = S.suspend(() =>
  S.Struct({
    StartHourOfDay: S.Number,
    StartMinuteOfHour: S.Number,
    EndHourOfDay: S.Number,
    EndMinuteOfHour: S.Number,
    DaysOfWeek: DaysOfWeek,
    AverageUploadRateLimitInBitsPerSec: S.optional(S.Number),
    AverageDownloadRateLimitInBitsPerSec: S.optional(S.Number),
  }),
).annotations({
  identifier: "BandwidthRateLimitInterval",
}) as any as S.Schema<BandwidthRateLimitInterval>;
export type BandwidthRateLimitIntervals = BandwidthRateLimitInterval[];
export const BandwidthRateLimitIntervals = S.Array(BandwidthRateLimitInterval);
export interface SoftwareUpdatePreferences {
  AutomaticUpdatePolicy?: AutomaticUpdatePolicy;
}
export const SoftwareUpdatePreferences = S.suspend(() =>
  S.Struct({ AutomaticUpdatePolicy: S.optional(AutomaticUpdatePolicy) }),
).annotations({
  identifier: "SoftwareUpdatePreferences",
}) as any as S.Schema<SoftwareUpdatePreferences>;
export interface SMBLocalGroups {
  GatewayAdmins?: string[];
}
export const SMBLocalGroups = S.suspend(() =>
  S.Struct({ GatewayAdmins: S.optional(UserList) }),
).annotations({
  identifier: "SMBLocalGroups",
}) as any as S.Schema<SMBLocalGroups>;
export interface ActivateGatewayInput {
  ActivationKey: string;
  GatewayName: string;
  GatewayTimezone: string;
  GatewayRegion: string;
  GatewayType?: string;
  TapeDriveType?: string;
  MediumChangerType?: string;
  Tags?: Tag[];
}
export const ActivateGatewayInput = S.suspend(() =>
  S.Struct({
    ActivationKey: S.String,
    GatewayName: S.String,
    GatewayTimezone: S.String,
    GatewayRegion: S.String,
    GatewayType: S.optional(S.String),
    TapeDriveType: S.optional(S.String),
    MediumChangerType: S.optional(S.String),
    Tags: S.optional(Tags),
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
  identifier: "ActivateGatewayInput",
}) as any as S.Schema<ActivateGatewayInput>;
export interface AddCacheOutput {
  GatewayARN?: string;
}
export const AddCacheOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "AddCacheOutput",
}) as any as S.Schema<AddCacheOutput>;
export interface AddTagsToResourceOutput {
  ResourceARN?: string;
}
export const AddTagsToResourceOutput = S.suspend(() =>
  S.Struct({ ResourceARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "AddTagsToResourceOutput",
}) as any as S.Schema<AddTagsToResourceOutput>;
export interface AddUploadBufferOutput {
  GatewayARN?: string;
}
export const AddUploadBufferOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "AddUploadBufferOutput",
}) as any as S.Schema<AddUploadBufferOutput>;
export interface AddWorkingStorageOutput {
  GatewayARN?: string;
}
export const AddWorkingStorageOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "AddWorkingStorageOutput",
}) as any as S.Schema<AddWorkingStorageOutput>;
export interface AssignTapePoolOutput {
  TapeARN?: string;
}
export const AssignTapePoolOutput = S.suspend(() =>
  S.Struct({ TapeARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "AssignTapePoolOutput",
}) as any as S.Schema<AssignTapePoolOutput>;
export interface AssociateFileSystemInput {
  UserName: string;
  Password: string | redacted.Redacted<string>;
  ClientToken: string;
  GatewayARN: string;
  LocationARN: string;
  Tags?: Tag[];
  AuditDestinationARN?: string;
  CacheAttributes?: CacheAttributes;
  EndpointNetworkConfiguration?: EndpointNetworkConfiguration;
}
export const AssociateFileSystemInput = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    Password: SensitiveString,
    ClientToken: S.String,
    GatewayARN: S.String,
    LocationARN: S.String,
    Tags: S.optional(Tags),
    AuditDestinationARN: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
    EndpointNetworkConfiguration: S.optional(EndpointNetworkConfiguration),
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
  identifier: "AssociateFileSystemInput",
}) as any as S.Schema<AssociateFileSystemInput>;
export interface AttachVolumeOutput {
  VolumeARN?: string;
  TargetARN?: string;
}
export const AttachVolumeOutput = S.suspend(() =>
  S.Struct({
    VolumeARN: S.optional(S.String),
    TargetARN: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "AttachVolumeOutput",
}) as any as S.Schema<AttachVolumeOutput>;
export interface CancelArchivalOutput {
  TapeARN?: string;
}
export const CancelArchivalOutput = S.suspend(() =>
  S.Struct({ TapeARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CancelArchivalOutput",
}) as any as S.Schema<CancelArchivalOutput>;
export interface CancelCacheReportOutput {
  CacheReportARN?: string;
}
export const CancelCacheReportOutput = S.suspend(() =>
  S.Struct({ CacheReportARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CancelCacheReportOutput",
}) as any as S.Schema<CancelCacheReportOutput>;
export interface CancelRetrievalOutput {
  TapeARN?: string;
}
export const CancelRetrievalOutput = S.suspend(() =>
  S.Struct({ TapeARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CancelRetrievalOutput",
}) as any as S.Schema<CancelRetrievalOutput>;
export interface CreateCachediSCSIVolumeOutput {
  VolumeARN?: string;
  TargetARN?: string;
}
export const CreateCachediSCSIVolumeOutput = S.suspend(() =>
  S.Struct({
    VolumeARN: S.optional(S.String),
    TargetARN: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateCachediSCSIVolumeOutput",
}) as any as S.Schema<CreateCachediSCSIVolumeOutput>;
export interface CreateNFSFileShareInput {
  ClientToken: string;
  NFSFileShareDefaults?: NFSFileShareDefaults;
  GatewayARN: string;
  EncryptionType?: EncryptionType;
  KMSEncrypted?: boolean;
  KMSKey?: string;
  Role: string;
  LocationARN: string;
  DefaultStorageClass?: string;
  ObjectACL?: ObjectACL;
  ClientList?: string[];
  Squash?: string;
  ReadOnly?: boolean;
  GuessMIMETypeEnabled?: boolean;
  RequesterPays?: boolean;
  Tags?: Tag[];
  FileShareName?: string;
  CacheAttributes?: CacheAttributes;
  NotificationPolicy?: string;
  VPCEndpointDNSName?: string;
  BucketRegion?: string;
  AuditDestinationARN?: string;
}
export const CreateNFSFileShareInput = S.suspend(() =>
  S.Struct({
    ClientToken: S.String,
    NFSFileShareDefaults: S.optional(NFSFileShareDefaults),
    GatewayARN: S.String,
    EncryptionType: S.optional(EncryptionType),
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    Role: S.String,
    LocationARN: S.String,
    DefaultStorageClass: S.optional(S.String),
    ObjectACL: S.optional(ObjectACL),
    ClientList: S.optional(FileShareClientList),
    Squash: S.optional(S.String),
    ReadOnly: S.optional(S.Boolean),
    GuessMIMETypeEnabled: S.optional(S.Boolean),
    RequesterPays: S.optional(S.Boolean),
    Tags: S.optional(Tags),
    FileShareName: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
    NotificationPolicy: S.optional(S.String),
    VPCEndpointDNSName: S.optional(S.String),
    BucketRegion: S.optional(S.String),
    AuditDestinationARN: S.optional(S.String),
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
  identifier: "CreateNFSFileShareInput",
}) as any as S.Schema<CreateNFSFileShareInput>;
export interface CreateSMBFileShareOutput {
  FileShareARN?: string;
}
export const CreateSMBFileShareOutput = S.suspend(() =>
  S.Struct({ FileShareARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateSMBFileShareOutput",
}) as any as S.Schema<CreateSMBFileShareOutput>;
export interface CreateSnapshotOutput {
  VolumeARN?: string;
  SnapshotId?: string;
}
export const CreateSnapshotOutput = S.suspend(() =>
  S.Struct({
    VolumeARN: S.optional(S.String),
    SnapshotId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateSnapshotOutput",
}) as any as S.Schema<CreateSnapshotOutput>;
export interface CreateSnapshotFromVolumeRecoveryPointOutput {
  SnapshotId?: string;
  VolumeARN?: string;
  VolumeRecoveryPointTime?: string;
}
export const CreateSnapshotFromVolumeRecoveryPointOutput = S.suspend(() =>
  S.Struct({
    SnapshotId: S.optional(S.String),
    VolumeARN: S.optional(S.String),
    VolumeRecoveryPointTime: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateSnapshotFromVolumeRecoveryPointOutput",
}) as any as S.Schema<CreateSnapshotFromVolumeRecoveryPointOutput>;
export interface CreateStorediSCSIVolumeOutput {
  VolumeARN?: string;
  VolumeSizeInBytes?: number;
  TargetARN?: string;
}
export const CreateStorediSCSIVolumeOutput = S.suspend(() =>
  S.Struct({
    VolumeARN: S.optional(S.String),
    VolumeSizeInBytes: S.optional(S.Number),
    TargetARN: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateStorediSCSIVolumeOutput",
}) as any as S.Schema<CreateStorediSCSIVolumeOutput>;
export interface CreateTapePoolOutput {
  PoolARN?: string;
}
export const CreateTapePoolOutput = S.suspend(() =>
  S.Struct({ PoolARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateTapePoolOutput",
}) as any as S.Schema<CreateTapePoolOutput>;
export interface CreateTapesOutput {
  TapeARNs?: string[];
}
export const CreateTapesOutput = S.suspend(() =>
  S.Struct({ TapeARNs: S.optional(TapeARNs) }).pipe(ns),
).annotations({
  identifier: "CreateTapesOutput",
}) as any as S.Schema<CreateTapesOutput>;
export interface CreateTapeWithBarcodeOutput {
  TapeARN?: string;
}
export const CreateTapeWithBarcodeOutput = S.suspend(() =>
  S.Struct({ TapeARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateTapeWithBarcodeOutput",
}) as any as S.Schema<CreateTapeWithBarcodeOutput>;
export interface DeleteAutomaticTapeCreationPolicyOutput {
  GatewayARN?: string;
}
export const DeleteAutomaticTapeCreationPolicyOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteAutomaticTapeCreationPolicyOutput",
}) as any as S.Schema<DeleteAutomaticTapeCreationPolicyOutput>;
export interface DeleteBandwidthRateLimitOutput {
  GatewayARN?: string;
}
export const DeleteBandwidthRateLimitOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteBandwidthRateLimitOutput",
}) as any as S.Schema<DeleteBandwidthRateLimitOutput>;
export interface DeleteCacheReportOutput {
  CacheReportARN?: string;
}
export const DeleteCacheReportOutput = S.suspend(() =>
  S.Struct({ CacheReportARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteCacheReportOutput",
}) as any as S.Schema<DeleteCacheReportOutput>;
export interface DeleteChapCredentialsOutput {
  TargetARN?: string;
  InitiatorName?: string;
}
export const DeleteChapCredentialsOutput = S.suspend(() =>
  S.Struct({
    TargetARN: S.optional(S.String),
    InitiatorName: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DeleteChapCredentialsOutput",
}) as any as S.Schema<DeleteChapCredentialsOutput>;
export interface DeleteFileShareOutput {
  FileShareARN?: string;
}
export const DeleteFileShareOutput = S.suspend(() =>
  S.Struct({ FileShareARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteFileShareOutput",
}) as any as S.Schema<DeleteFileShareOutput>;
export interface DeleteGatewayOutput {
  GatewayARN?: string;
}
export const DeleteGatewayOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteGatewayOutput",
}) as any as S.Schema<DeleteGatewayOutput>;
export interface DeleteSnapshotScheduleOutput {
  VolumeARN?: string;
}
export const DeleteSnapshotScheduleOutput = S.suspend(() =>
  S.Struct({ VolumeARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteSnapshotScheduleOutput",
}) as any as S.Schema<DeleteSnapshotScheduleOutput>;
export interface DeleteTapeOutput {
  TapeARN?: string;
}
export const DeleteTapeOutput = S.suspend(() =>
  S.Struct({ TapeARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteTapeOutput",
}) as any as S.Schema<DeleteTapeOutput>;
export interface DeleteTapeArchiveOutput {
  TapeARN?: string;
}
export const DeleteTapeArchiveOutput = S.suspend(() =>
  S.Struct({ TapeARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteTapeArchiveOutput",
}) as any as S.Schema<DeleteTapeArchiveOutput>;
export interface DeleteTapePoolOutput {
  PoolARN?: string;
}
export const DeleteTapePoolOutput = S.suspend(() =>
  S.Struct({ PoolARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteTapePoolOutput",
}) as any as S.Schema<DeleteTapePoolOutput>;
export interface DeleteVolumeOutput {
  VolumeARN?: string;
}
export const DeleteVolumeOutput = S.suspend(() =>
  S.Struct({ VolumeARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteVolumeOutput",
}) as any as S.Schema<DeleteVolumeOutput>;
export interface DescribeAvailabilityMonitorTestOutput {
  GatewayARN?: string;
  Status?: AvailabilityMonitorTestStatus;
  StartTime?: Date;
}
export const DescribeAvailabilityMonitorTestOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    Status: S.optional(AvailabilityMonitorTestStatus),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(ns),
).annotations({
  identifier: "DescribeAvailabilityMonitorTestOutput",
}) as any as S.Schema<DescribeAvailabilityMonitorTestOutput>;
export interface DescribeBandwidthRateLimitOutput {
  GatewayARN?: string;
  AverageUploadRateLimitInBitsPerSec?: number;
  AverageDownloadRateLimitInBitsPerSec?: number;
}
export const DescribeBandwidthRateLimitOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    AverageUploadRateLimitInBitsPerSec: S.optional(S.Number),
    AverageDownloadRateLimitInBitsPerSec: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "DescribeBandwidthRateLimitOutput",
}) as any as S.Schema<DescribeBandwidthRateLimitOutput>;
export interface DescribeBandwidthRateLimitScheduleOutput {
  GatewayARN?: string;
  BandwidthRateLimitIntervals?: BandwidthRateLimitInterval[];
}
export const DescribeBandwidthRateLimitScheduleOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    BandwidthRateLimitIntervals: S.optional(BandwidthRateLimitIntervals),
  }).pipe(ns),
).annotations({
  identifier: "DescribeBandwidthRateLimitScheduleOutput",
}) as any as S.Schema<DescribeBandwidthRateLimitScheduleOutput>;
export interface DescribeCacheOutput {
  GatewayARN?: string;
  DiskIds?: string[];
  CacheAllocatedInBytes?: number;
  CacheUsedPercentage?: number;
  CacheDirtyPercentage?: number;
  CacheHitPercentage?: number;
  CacheMissPercentage?: number;
}
export const DescribeCacheOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    DiskIds: S.optional(DiskIds),
    CacheAllocatedInBytes: S.optional(S.Number),
    CacheUsedPercentage: S.optional(S.Number),
    CacheDirtyPercentage: S.optional(S.Number),
    CacheHitPercentage: S.optional(S.Number),
    CacheMissPercentage: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "DescribeCacheOutput",
}) as any as S.Schema<DescribeCacheOutput>;
export interface DescribeMaintenanceStartTimeOutput {
  GatewayARN?: string;
  HourOfDay?: number;
  MinuteOfHour?: number;
  DayOfWeek?: number;
  DayOfMonth?: number;
  Timezone?: string;
  SoftwareUpdatePreferences?: SoftwareUpdatePreferences;
}
export const DescribeMaintenanceStartTimeOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    HourOfDay: S.optional(S.Number),
    MinuteOfHour: S.optional(S.Number),
    DayOfWeek: S.optional(S.Number),
    DayOfMonth: S.optional(S.Number),
    Timezone: S.optional(S.String),
    SoftwareUpdatePreferences: S.optional(SoftwareUpdatePreferences),
  }).pipe(ns),
).annotations({
  identifier: "DescribeMaintenanceStartTimeOutput",
}) as any as S.Schema<DescribeMaintenanceStartTimeOutput>;
export interface DescribeSMBSettingsOutput {
  GatewayARN?: string;
  DomainName?: string;
  ActiveDirectoryStatus?: ActiveDirectoryStatus;
  SMBGuestPasswordSet?: boolean;
  SMBSecurityStrategy?: SMBSecurityStrategy;
  FileSharesVisible?: boolean;
  SMBLocalGroups?: SMBLocalGroups;
}
export const DescribeSMBSettingsOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    DomainName: S.optional(S.String),
    ActiveDirectoryStatus: S.optional(ActiveDirectoryStatus),
    SMBGuestPasswordSet: S.optional(S.Boolean),
    SMBSecurityStrategy: S.optional(SMBSecurityStrategy),
    FileSharesVisible: S.optional(S.Boolean),
    SMBLocalGroups: S.optional(SMBLocalGroups),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSMBSettingsOutput",
}) as any as S.Schema<DescribeSMBSettingsOutput>;
export interface DescribeSnapshotScheduleOutput {
  VolumeARN?: string;
  StartAt?: number;
  RecurrenceInHours?: number;
  Description?: string;
  Timezone?: string;
  Tags?: Tag[];
}
export const DescribeSnapshotScheduleOutput = S.suspend(() =>
  S.Struct({
    VolumeARN: S.optional(S.String),
    StartAt: S.optional(S.Number),
    RecurrenceInHours: S.optional(S.Number),
    Description: S.optional(S.String),
    Timezone: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSnapshotScheduleOutput",
}) as any as S.Schema<DescribeSnapshotScheduleOutput>;
export interface DescribeUploadBufferOutput {
  GatewayARN?: string;
  DiskIds?: string[];
  UploadBufferUsedInBytes?: number;
  UploadBufferAllocatedInBytes?: number;
}
export const DescribeUploadBufferOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    DiskIds: S.optional(DiskIds),
    UploadBufferUsedInBytes: S.optional(S.Number),
    UploadBufferAllocatedInBytes: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "DescribeUploadBufferOutput",
}) as any as S.Schema<DescribeUploadBufferOutput>;
export interface DescribeWorkingStorageOutput {
  GatewayARN?: string;
  DiskIds?: string[];
  WorkingStorageUsedInBytes?: number;
  WorkingStorageAllocatedInBytes?: number;
}
export const DescribeWorkingStorageOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    DiskIds: S.optional(DiskIds),
    WorkingStorageUsedInBytes: S.optional(S.Number),
    WorkingStorageAllocatedInBytes: S.optional(S.Number),
  }).pipe(ns),
).annotations({
  identifier: "DescribeWorkingStorageOutput",
}) as any as S.Schema<DescribeWorkingStorageOutput>;
export interface DetachVolumeOutput {
  VolumeARN?: string;
}
export const DetachVolumeOutput = S.suspend(() =>
  S.Struct({ VolumeARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DetachVolumeOutput",
}) as any as S.Schema<DetachVolumeOutput>;
export interface DisableGatewayOutput {
  GatewayARN?: string;
}
export const DisableGatewayOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DisableGatewayOutput",
}) as any as S.Schema<DisableGatewayOutput>;
export interface DisassociateFileSystemOutput {
  FileSystemAssociationARN?: string;
}
export const DisassociateFileSystemOutput = S.suspend(() =>
  S.Struct({ FileSystemAssociationARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DisassociateFileSystemOutput",
}) as any as S.Schema<DisassociateFileSystemOutput>;
export interface EvictFilesFailingUploadOutput {
  NotificationId?: string;
}
export const EvictFilesFailingUploadOutput = S.suspend(() =>
  S.Struct({ NotificationId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "EvictFilesFailingUploadOutput",
}) as any as S.Schema<EvictFilesFailingUploadOutput>;
export interface JoinDomainOutput {
  GatewayARN?: string;
  ActiveDirectoryStatus?: ActiveDirectoryStatus;
}
export const JoinDomainOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    ActiveDirectoryStatus: S.optional(ActiveDirectoryStatus),
  }).pipe(ns),
).annotations({
  identifier: "JoinDomainOutput",
}) as any as S.Schema<JoinDomainOutput>;
export interface ListCacheReportsOutput {
  CacheReportList?: CacheReportInfo[];
  Marker?: string;
}
export const ListCacheReportsOutput = S.suspend(() =>
  S.Struct({
    CacheReportList: S.optional(CacheReportList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListCacheReportsOutput",
}) as any as S.Schema<ListCacheReportsOutput>;
export interface ListTagsForResourceOutput {
  ResourceARN?: string;
  Marker?: string;
  Tags?: Tag[];
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({
    ResourceARN: S.optional(S.String),
    Marker: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(ns),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface ListVolumeInitiatorsOutput {
  Initiators?: string[];
}
export const ListVolumeInitiatorsOutput = S.suspend(() =>
  S.Struct({ Initiators: S.optional(Initiators) }).pipe(ns),
).annotations({
  identifier: "ListVolumeInitiatorsOutput",
}) as any as S.Schema<ListVolumeInitiatorsOutput>;
export interface NotifyWhenUploadedOutput {
  FileShareARN?: string;
  NotificationId?: string;
}
export const NotifyWhenUploadedOutput = S.suspend(() =>
  S.Struct({
    FileShareARN: S.optional(S.String),
    NotificationId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "NotifyWhenUploadedOutput",
}) as any as S.Schema<NotifyWhenUploadedOutput>;
export interface RefreshCacheOutput {
  FileShareARN?: string;
  NotificationId?: string;
}
export const RefreshCacheOutput = S.suspend(() =>
  S.Struct({
    FileShareARN: S.optional(S.String),
    NotificationId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "RefreshCacheOutput",
}) as any as S.Schema<RefreshCacheOutput>;
export interface RemoveTagsFromResourceOutput {
  ResourceARN?: string;
}
export const RemoveTagsFromResourceOutput = S.suspend(() =>
  S.Struct({ ResourceARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RemoveTagsFromResourceOutput",
}) as any as S.Schema<RemoveTagsFromResourceOutput>;
export interface ResetCacheOutput {
  GatewayARN?: string;
}
export const ResetCacheOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ResetCacheOutput",
}) as any as S.Schema<ResetCacheOutput>;
export interface RetrieveTapeArchiveOutput {
  TapeARN?: string;
}
export const RetrieveTapeArchiveOutput = S.suspend(() =>
  S.Struct({ TapeARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RetrieveTapeArchiveOutput",
}) as any as S.Schema<RetrieveTapeArchiveOutput>;
export interface RetrieveTapeRecoveryPointOutput {
  TapeARN?: string;
}
export const RetrieveTapeRecoveryPointOutput = S.suspend(() =>
  S.Struct({ TapeARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RetrieveTapeRecoveryPointOutput",
}) as any as S.Schema<RetrieveTapeRecoveryPointOutput>;
export interface SetLocalConsolePasswordOutput {
  GatewayARN?: string;
}
export const SetLocalConsolePasswordOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "SetLocalConsolePasswordOutput",
}) as any as S.Schema<SetLocalConsolePasswordOutput>;
export interface SetSMBGuestPasswordOutput {
  GatewayARN?: string;
}
export const SetSMBGuestPasswordOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "SetSMBGuestPasswordOutput",
}) as any as S.Schema<SetSMBGuestPasswordOutput>;
export interface ShutdownGatewayOutput {
  GatewayARN?: string;
}
export const ShutdownGatewayOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ShutdownGatewayOutput",
}) as any as S.Schema<ShutdownGatewayOutput>;
export interface StartAvailabilityMonitorTestOutput {
  GatewayARN?: string;
}
export const StartAvailabilityMonitorTestOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartAvailabilityMonitorTestOutput",
}) as any as S.Schema<StartAvailabilityMonitorTestOutput>;
export interface StartCacheReportInput {
  FileShareARN: string;
  Role: string;
  LocationARN: string;
  BucketRegion: string;
  VPCEndpointDNSName?: string;
  InclusionFilters?: CacheReportFilter[];
  ExclusionFilters?: CacheReportFilter[];
  ClientToken: string;
  Tags?: Tag[];
}
export const StartCacheReportInput = S.suspend(() =>
  S.Struct({
    FileShareARN: S.String,
    Role: S.String,
    LocationARN: S.String,
    BucketRegion: S.String,
    VPCEndpointDNSName: S.optional(S.String),
    InclusionFilters: S.optional(CacheReportFilterList),
    ExclusionFilters: S.optional(CacheReportFilterList),
    ClientToken: S.String,
    Tags: S.optional(Tags),
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
  identifier: "StartCacheReportInput",
}) as any as S.Schema<StartCacheReportInput>;
export interface StartGatewayOutput {
  GatewayARN?: string;
}
export const StartGatewayOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartGatewayOutput",
}) as any as S.Schema<StartGatewayOutput>;
export interface UpdateAutomaticTapeCreationPolicyInput {
  AutomaticTapeCreationRules: AutomaticTapeCreationRule[];
  GatewayARN: string;
}
export const UpdateAutomaticTapeCreationPolicyInput = S.suspend(() =>
  S.Struct({
    AutomaticTapeCreationRules: AutomaticTapeCreationRules,
    GatewayARN: S.String,
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
  identifier: "UpdateAutomaticTapeCreationPolicyInput",
}) as any as S.Schema<UpdateAutomaticTapeCreationPolicyInput>;
export interface UpdateBandwidthRateLimitOutput {
  GatewayARN?: string;
}
export const UpdateBandwidthRateLimitOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateBandwidthRateLimitOutput",
}) as any as S.Schema<UpdateBandwidthRateLimitOutput>;
export interface UpdateBandwidthRateLimitScheduleInput {
  GatewayARN: string;
  BandwidthRateLimitIntervals: BandwidthRateLimitInterval[];
}
export const UpdateBandwidthRateLimitScheduleInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    BandwidthRateLimitIntervals: BandwidthRateLimitIntervals,
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
  identifier: "UpdateBandwidthRateLimitScheduleInput",
}) as any as S.Schema<UpdateBandwidthRateLimitScheduleInput>;
export interface UpdateChapCredentialsOutput {
  TargetARN?: string;
  InitiatorName?: string;
}
export const UpdateChapCredentialsOutput = S.suspend(() =>
  S.Struct({
    TargetARN: S.optional(S.String),
    InitiatorName: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateChapCredentialsOutput",
}) as any as S.Schema<UpdateChapCredentialsOutput>;
export interface UpdateFileSystemAssociationOutput {
  FileSystemAssociationARN?: string;
}
export const UpdateFileSystemAssociationOutput = S.suspend(() =>
  S.Struct({ FileSystemAssociationARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateFileSystemAssociationOutput",
}) as any as S.Schema<UpdateFileSystemAssociationOutput>;
export interface UpdateGatewayInformationOutput {
  GatewayARN?: string;
  GatewayName?: string;
}
export const UpdateGatewayInformationOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    GatewayName: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateGatewayInformationOutput",
}) as any as S.Schema<UpdateGatewayInformationOutput>;
export interface UpdateGatewaySoftwareNowOutput {
  GatewayARN?: string;
}
export const UpdateGatewaySoftwareNowOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateGatewaySoftwareNowOutput",
}) as any as S.Schema<UpdateGatewaySoftwareNowOutput>;
export interface UpdateMaintenanceStartTimeInput {
  GatewayARN: string;
  HourOfDay?: number;
  MinuteOfHour?: number;
  DayOfWeek?: number;
  DayOfMonth?: number;
  SoftwareUpdatePreferences?: SoftwareUpdatePreferences;
}
export const UpdateMaintenanceStartTimeInput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.String,
    HourOfDay: S.optional(S.Number),
    MinuteOfHour: S.optional(S.Number),
    DayOfWeek: S.optional(S.Number),
    DayOfMonth: S.optional(S.Number),
    SoftwareUpdatePreferences: S.optional(SoftwareUpdatePreferences),
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
  identifier: "UpdateMaintenanceStartTimeInput",
}) as any as S.Schema<UpdateMaintenanceStartTimeInput>;
export interface UpdateNFSFileShareOutput {
  FileShareARN?: string;
}
export const UpdateNFSFileShareOutput = S.suspend(() =>
  S.Struct({ FileShareARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateNFSFileShareOutput",
}) as any as S.Schema<UpdateNFSFileShareOutput>;
export interface UpdateSMBFileShareOutput {
  FileShareARN?: string;
}
export const UpdateSMBFileShareOutput = S.suspend(() =>
  S.Struct({ FileShareARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateSMBFileShareOutput",
}) as any as S.Schema<UpdateSMBFileShareOutput>;
export interface UpdateSMBFileShareVisibilityOutput {
  GatewayARN?: string;
}
export const UpdateSMBFileShareVisibilityOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateSMBFileShareVisibilityOutput",
}) as any as S.Schema<UpdateSMBFileShareVisibilityOutput>;
export interface UpdateSMBLocalGroupsInput {
  GatewayARN: string;
  SMBLocalGroups: SMBLocalGroups;
}
export const UpdateSMBLocalGroupsInput = S.suspend(() =>
  S.Struct({ GatewayARN: S.String, SMBLocalGroups: SMBLocalGroups }).pipe(
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
  identifier: "UpdateSMBLocalGroupsInput",
}) as any as S.Schema<UpdateSMBLocalGroupsInput>;
export interface UpdateSMBSecurityStrategyOutput {
  GatewayARN?: string;
}
export const UpdateSMBSecurityStrategyOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateSMBSecurityStrategyOutput",
}) as any as S.Schema<UpdateSMBSecurityStrategyOutput>;
export interface UpdateSnapshotScheduleOutput {
  VolumeARN?: string;
}
export const UpdateSnapshotScheduleOutput = S.suspend(() =>
  S.Struct({ VolumeARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateSnapshotScheduleOutput",
}) as any as S.Schema<UpdateSnapshotScheduleOutput>;
export interface UpdateVTLDeviceTypeOutput {
  VTLDeviceARN?: string;
}
export const UpdateVTLDeviceTypeOutput = S.suspend(() =>
  S.Struct({ VTLDeviceARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateVTLDeviceTypeOutput",
}) as any as S.Schema<UpdateVTLDeviceTypeOutput>;
export type FileShareType = "NFS" | "SMB";
export const FileShareType = S.Literal("NFS", "SMB");
export type DiskAttributeList = string[];
export const DiskAttributeList = S.Array(S.String);
export type PoolStatus = "ACTIVE" | "DELETED";
export const PoolStatus = S.Literal("ACTIVE", "DELETED");
export interface ChapInfo {
  TargetARN?: string;
  SecretToAuthenticateInitiator?: string | redacted.Redacted<string>;
  InitiatorName?: string;
  SecretToAuthenticateTarget?: string | redacted.Redacted<string>;
}
export const ChapInfo = S.suspend(() =>
  S.Struct({
    TargetARN: S.optional(S.String),
    SecretToAuthenticateInitiator: S.optional(SensitiveString),
    InitiatorName: S.optional(S.String),
    SecretToAuthenticateTarget: S.optional(SensitiveString),
  }),
).annotations({ identifier: "ChapInfo" }) as any as S.Schema<ChapInfo>;
export type ChapCredentials = ChapInfo[];
export const ChapCredentials = S.Array(ChapInfo);
export interface NetworkInterface {
  Ipv4Address?: string;
  MacAddress?: string;
  Ipv6Address?: string;
}
export const NetworkInterface = S.suspend(() =>
  S.Struct({
    Ipv4Address: S.optional(S.String),
    MacAddress: S.optional(S.String),
    Ipv6Address: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkInterface",
}) as any as S.Schema<NetworkInterface>;
export type GatewayNetworkInterfaces = NetworkInterface[];
export const GatewayNetworkInterfaces = S.Array(NetworkInterface);
export interface NFSFileShareInfo {
  NFSFileShareDefaults?: NFSFileShareDefaults;
  FileShareARN?: string;
  FileShareId?: string;
  FileShareStatus?: string;
  GatewayARN?: string;
  EncryptionType?: EncryptionType;
  KMSEncrypted?: boolean;
  KMSKey?: string;
  Path?: string;
  Role?: string;
  LocationARN?: string;
  DefaultStorageClass?: string;
  ObjectACL?: ObjectACL;
  ClientList?: string[];
  Squash?: string;
  ReadOnly?: boolean;
  GuessMIMETypeEnabled?: boolean;
  RequesterPays?: boolean;
  Tags?: Tag[];
  FileShareName?: string;
  CacheAttributes?: CacheAttributes;
  NotificationPolicy?: string;
  VPCEndpointDNSName?: string;
  BucketRegion?: string;
  AuditDestinationARN?: string;
}
export const NFSFileShareInfo = S.suspend(() =>
  S.Struct({
    NFSFileShareDefaults: S.optional(NFSFileShareDefaults),
    FileShareARN: S.optional(S.String),
    FileShareId: S.optional(S.String),
    FileShareStatus: S.optional(S.String),
    GatewayARN: S.optional(S.String),
    EncryptionType: S.optional(EncryptionType),
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    Path: S.optional(S.String),
    Role: S.optional(S.String),
    LocationARN: S.optional(S.String),
    DefaultStorageClass: S.optional(S.String),
    ObjectACL: S.optional(ObjectACL),
    ClientList: S.optional(FileShareClientList),
    Squash: S.optional(S.String),
    ReadOnly: S.optional(S.Boolean),
    GuessMIMETypeEnabled: S.optional(S.Boolean),
    RequesterPays: S.optional(S.Boolean),
    Tags: S.optional(Tags),
    FileShareName: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
    NotificationPolicy: S.optional(S.String),
    VPCEndpointDNSName: S.optional(S.String),
    BucketRegion: S.optional(S.String),
    AuditDestinationARN: S.optional(S.String),
  }),
).annotations({
  identifier: "NFSFileShareInfo",
}) as any as S.Schema<NFSFileShareInfo>;
export type NFSFileShareInfoList = NFSFileShareInfo[];
export const NFSFileShareInfoList = S.Array(NFSFileShareInfo);
export interface SMBFileShareInfo {
  FileShareARN?: string;
  FileShareId?: string;
  FileShareStatus?: string;
  GatewayARN?: string;
  EncryptionType?: EncryptionType;
  KMSEncrypted?: boolean;
  KMSKey?: string;
  Path?: string;
  Role?: string;
  LocationARN?: string;
  DefaultStorageClass?: string;
  ObjectACL?: ObjectACL;
  ReadOnly?: boolean;
  GuessMIMETypeEnabled?: boolean;
  RequesterPays?: boolean;
  SMBACLEnabled?: boolean;
  AccessBasedEnumeration?: boolean;
  AdminUserList?: string[];
  ValidUserList?: string[];
  InvalidUserList?: string[];
  AuditDestinationARN?: string;
  Authentication?: string;
  CaseSensitivity?: CaseSensitivity;
  Tags?: Tag[];
  FileShareName?: string;
  CacheAttributes?: CacheAttributes;
  NotificationPolicy?: string;
  VPCEndpointDNSName?: string;
  BucketRegion?: string;
  OplocksEnabled?: boolean;
}
export const SMBFileShareInfo = S.suspend(() =>
  S.Struct({
    FileShareARN: S.optional(S.String),
    FileShareId: S.optional(S.String),
    FileShareStatus: S.optional(S.String),
    GatewayARN: S.optional(S.String),
    EncryptionType: S.optional(EncryptionType),
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    Path: S.optional(S.String),
    Role: S.optional(S.String),
    LocationARN: S.optional(S.String),
    DefaultStorageClass: S.optional(S.String),
    ObjectACL: S.optional(ObjectACL),
    ReadOnly: S.optional(S.Boolean),
    GuessMIMETypeEnabled: S.optional(S.Boolean),
    RequesterPays: S.optional(S.Boolean),
    SMBACLEnabled: S.optional(S.Boolean),
    AccessBasedEnumeration: S.optional(S.Boolean),
    AdminUserList: S.optional(UserList),
    ValidUserList: S.optional(UserList),
    InvalidUserList: S.optional(UserList),
    AuditDestinationARN: S.optional(S.String),
    Authentication: S.optional(S.String),
    CaseSensitivity: S.optional(CaseSensitivity),
    Tags: S.optional(Tags),
    FileShareName: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
    NotificationPolicy: S.optional(S.String),
    VPCEndpointDNSName: S.optional(S.String),
    BucketRegion: S.optional(S.String),
    OplocksEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SMBFileShareInfo",
}) as any as S.Schema<SMBFileShareInfo>;
export type SMBFileShareInfoList = SMBFileShareInfo[];
export const SMBFileShareInfoList = S.Array(SMBFileShareInfo);
export interface VolumeiSCSIAttributes {
  TargetARN?: string;
  NetworkInterfaceId?: string;
  NetworkInterfacePort?: number;
  LunNumber?: number;
  ChapEnabled?: boolean;
}
export const VolumeiSCSIAttributes = S.suspend(() =>
  S.Struct({
    TargetARN: S.optional(S.String),
    NetworkInterfaceId: S.optional(S.String),
    NetworkInterfacePort: S.optional(S.Number),
    LunNumber: S.optional(S.Number),
    ChapEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "VolumeiSCSIAttributes",
}) as any as S.Schema<VolumeiSCSIAttributes>;
export interface StorediSCSIVolume {
  VolumeARN?: string;
  VolumeId?: string;
  VolumeType?: string;
  VolumeStatus?: string;
  VolumeAttachmentStatus?: string;
  VolumeSizeInBytes?: number;
  VolumeProgress?: number;
  VolumeDiskId?: string;
  SourceSnapshotId?: string;
  PreservedExistingData?: boolean;
  VolumeiSCSIAttributes?: VolumeiSCSIAttributes;
  CreatedDate?: Date;
  VolumeUsedInBytes?: number;
  KMSKey?: string;
  TargetName?: string;
}
export const StorediSCSIVolume = S.suspend(() =>
  S.Struct({
    VolumeARN: S.optional(S.String),
    VolumeId: S.optional(S.String),
    VolumeType: S.optional(S.String),
    VolumeStatus: S.optional(S.String),
    VolumeAttachmentStatus: S.optional(S.String),
    VolumeSizeInBytes: S.optional(S.Number),
    VolumeProgress: S.optional(S.Number),
    VolumeDiskId: S.optional(S.String),
    SourceSnapshotId: S.optional(S.String),
    PreservedExistingData: S.optional(S.Boolean),
    VolumeiSCSIAttributes: S.optional(VolumeiSCSIAttributes),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    VolumeUsedInBytes: S.optional(S.Number),
    KMSKey: S.optional(S.String),
    TargetName: S.optional(S.String),
  }),
).annotations({
  identifier: "StorediSCSIVolume",
}) as any as S.Schema<StorediSCSIVolume>;
export type StorediSCSIVolumes = StorediSCSIVolume[];
export const StorediSCSIVolumes = S.Array(StorediSCSIVolume);
export interface TapeArchive {
  TapeARN?: string;
  TapeBarcode?: string;
  TapeCreatedDate?: Date;
  TapeSizeInBytes?: number;
  CompletionTime?: Date;
  RetrievedTo?: string;
  TapeStatus?: string;
  TapeUsedInBytes?: number;
  KMSKey?: string;
  PoolId?: string;
  Worm?: boolean;
  RetentionStartDate?: Date;
  PoolEntryDate?: Date;
}
export const TapeArchive = S.suspend(() =>
  S.Struct({
    TapeARN: S.optional(S.String),
    TapeBarcode: S.optional(S.String),
    TapeCreatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TapeSizeInBytes: S.optional(S.Number),
    CompletionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RetrievedTo: S.optional(S.String),
    TapeStatus: S.optional(S.String),
    TapeUsedInBytes: S.optional(S.Number),
    KMSKey: S.optional(S.String),
    PoolId: S.optional(S.String),
    Worm: S.optional(S.Boolean),
    RetentionStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    PoolEntryDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "TapeArchive" }) as any as S.Schema<TapeArchive>;
export type TapeArchives = TapeArchive[];
export const TapeArchives = S.Array(TapeArchive);
export interface TapeRecoveryPointInfo {
  TapeARN?: string;
  TapeRecoveryPointTime?: Date;
  TapeSizeInBytes?: number;
  TapeStatus?: string;
}
export const TapeRecoveryPointInfo = S.suspend(() =>
  S.Struct({
    TapeARN: S.optional(S.String),
    TapeRecoveryPointTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TapeSizeInBytes: S.optional(S.Number),
    TapeStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "TapeRecoveryPointInfo",
}) as any as S.Schema<TapeRecoveryPointInfo>;
export type TapeRecoveryPointInfos = TapeRecoveryPointInfo[];
export const TapeRecoveryPointInfos = S.Array(TapeRecoveryPointInfo);
export interface Tape {
  TapeARN?: string;
  TapeBarcode?: string;
  TapeCreatedDate?: Date;
  TapeSizeInBytes?: number;
  TapeStatus?: string;
  VTLDevice?: string;
  Progress?: number;
  TapeUsedInBytes?: number;
  KMSKey?: string;
  PoolId?: string;
  Worm?: boolean;
  RetentionStartDate?: Date;
  PoolEntryDate?: Date;
}
export const Tape = S.suspend(() =>
  S.Struct({
    TapeARN: S.optional(S.String),
    TapeBarcode: S.optional(S.String),
    TapeCreatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TapeSizeInBytes: S.optional(S.Number),
    TapeStatus: S.optional(S.String),
    VTLDevice: S.optional(S.String),
    Progress: S.optional(S.Number),
    TapeUsedInBytes: S.optional(S.Number),
    KMSKey: S.optional(S.String),
    PoolId: S.optional(S.String),
    Worm: S.optional(S.Boolean),
    RetentionStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    PoolEntryDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Tape" }) as any as S.Schema<Tape>;
export type Tapes = Tape[];
export const Tapes = S.Array(Tape);
export interface AutomaticTapeCreationPolicyInfo {
  AutomaticTapeCreationRules?: AutomaticTapeCreationRule[];
  GatewayARN?: string;
}
export const AutomaticTapeCreationPolicyInfo = S.suspend(() =>
  S.Struct({
    AutomaticTapeCreationRules: S.optional(AutomaticTapeCreationRules),
    GatewayARN: S.optional(S.String),
  }),
).annotations({
  identifier: "AutomaticTapeCreationPolicyInfo",
}) as any as S.Schema<AutomaticTapeCreationPolicyInfo>;
export type AutomaticTapeCreationPolicyInfos =
  AutomaticTapeCreationPolicyInfo[];
export const AutomaticTapeCreationPolicyInfos = S.Array(
  AutomaticTapeCreationPolicyInfo,
);
export interface FileShareInfo {
  FileShareType?: FileShareType;
  FileShareARN?: string;
  FileShareId?: string;
  FileShareStatus?: string;
  GatewayARN?: string;
}
export const FileShareInfo = S.suspend(() =>
  S.Struct({
    FileShareType: S.optional(FileShareType),
    FileShareARN: S.optional(S.String),
    FileShareId: S.optional(S.String),
    FileShareStatus: S.optional(S.String),
    GatewayARN: S.optional(S.String),
  }),
).annotations({
  identifier: "FileShareInfo",
}) as any as S.Schema<FileShareInfo>;
export type FileShareInfoList = FileShareInfo[];
export const FileShareInfoList = S.Array(FileShareInfo);
export interface FileSystemAssociationSummary {
  FileSystemAssociationId?: string;
  FileSystemAssociationARN?: string;
  FileSystemAssociationStatus?: string;
  GatewayARN?: string;
}
export const FileSystemAssociationSummary = S.suspend(() =>
  S.Struct({
    FileSystemAssociationId: S.optional(S.String),
    FileSystemAssociationARN: S.optional(S.String),
    FileSystemAssociationStatus: S.optional(S.String),
    GatewayARN: S.optional(S.String),
  }),
).annotations({
  identifier: "FileSystemAssociationSummary",
}) as any as S.Schema<FileSystemAssociationSummary>;
export type FileSystemAssociationSummaryList = FileSystemAssociationSummary[];
export const FileSystemAssociationSummaryList = S.Array(
  FileSystemAssociationSummary,
);
export interface GatewayInfo {
  GatewayId?: string;
  GatewayARN?: string;
  GatewayType?: string;
  GatewayOperationalState?: string;
  GatewayName?: string;
  Ec2InstanceId?: string;
  Ec2InstanceRegion?: string;
  HostEnvironment?: HostEnvironment;
  HostEnvironmentId?: string;
  DeprecationDate?: string;
  SoftwareVersion?: string;
}
export const GatewayInfo = S.suspend(() =>
  S.Struct({
    GatewayId: S.optional(S.String),
    GatewayARN: S.optional(S.String),
    GatewayType: S.optional(S.String),
    GatewayOperationalState: S.optional(S.String),
    GatewayName: S.optional(S.String),
    Ec2InstanceId: S.optional(S.String),
    Ec2InstanceRegion: S.optional(S.String),
    HostEnvironment: S.optional(HostEnvironment),
    HostEnvironmentId: S.optional(S.String),
    DeprecationDate: S.optional(S.String),
    SoftwareVersion: S.optional(S.String),
  }),
).annotations({ identifier: "GatewayInfo" }) as any as S.Schema<GatewayInfo>;
export type Gateways = GatewayInfo[];
export const Gateways = S.Array(GatewayInfo);
export interface Disk {
  DiskId?: string;
  DiskPath?: string;
  DiskNode?: string;
  DiskStatus?: string;
  DiskSizeInBytes?: number;
  DiskAllocationType?: string;
  DiskAllocationResource?: string;
  DiskAttributeList?: string[];
}
export const Disk = S.suspend(() =>
  S.Struct({
    DiskId: S.optional(S.String),
    DiskPath: S.optional(S.String),
    DiskNode: S.optional(S.String),
    DiskStatus: S.optional(S.String),
    DiskSizeInBytes: S.optional(S.Number),
    DiskAllocationType: S.optional(S.String),
    DiskAllocationResource: S.optional(S.String),
    DiskAttributeList: S.optional(DiskAttributeList),
  }),
).annotations({ identifier: "Disk" }) as any as S.Schema<Disk>;
export type Disks = Disk[];
export const Disks = S.Array(Disk);
export interface PoolInfo {
  PoolARN?: string;
  PoolName?: string;
  StorageClass?: TapeStorageClass;
  RetentionLockType?: RetentionLockType;
  RetentionLockTimeInDays?: number;
  PoolStatus?: PoolStatus;
}
export const PoolInfo = S.suspend(() =>
  S.Struct({
    PoolARN: S.optional(S.String),
    PoolName: S.optional(S.String),
    StorageClass: S.optional(TapeStorageClass),
    RetentionLockType: S.optional(RetentionLockType),
    RetentionLockTimeInDays: S.optional(S.Number),
    PoolStatus: S.optional(PoolStatus),
  }),
).annotations({ identifier: "PoolInfo" }) as any as S.Schema<PoolInfo>;
export type PoolInfos = PoolInfo[];
export const PoolInfos = S.Array(PoolInfo);
export interface TapeInfo {
  TapeARN?: string;
  TapeBarcode?: string;
  TapeSizeInBytes?: number;
  TapeStatus?: string;
  GatewayARN?: string;
  PoolId?: string;
  RetentionStartDate?: Date;
  PoolEntryDate?: Date;
}
export const TapeInfo = S.suspend(() =>
  S.Struct({
    TapeARN: S.optional(S.String),
    TapeBarcode: S.optional(S.String),
    TapeSizeInBytes: S.optional(S.Number),
    TapeStatus: S.optional(S.String),
    GatewayARN: S.optional(S.String),
    PoolId: S.optional(S.String),
    RetentionStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    PoolEntryDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "TapeInfo" }) as any as S.Schema<TapeInfo>;
export type TapeInfos = TapeInfo[];
export const TapeInfos = S.Array(TapeInfo);
export interface VolumeRecoveryPointInfo {
  VolumeARN?: string;
  VolumeSizeInBytes?: number;
  VolumeUsageInBytes?: number;
  VolumeRecoveryPointTime?: string;
}
export const VolumeRecoveryPointInfo = S.suspend(() =>
  S.Struct({
    VolumeARN: S.optional(S.String),
    VolumeSizeInBytes: S.optional(S.Number),
    VolumeUsageInBytes: S.optional(S.Number),
    VolumeRecoveryPointTime: S.optional(S.String),
  }),
).annotations({
  identifier: "VolumeRecoveryPointInfo",
}) as any as S.Schema<VolumeRecoveryPointInfo>;
export type VolumeRecoveryPointInfos = VolumeRecoveryPointInfo[];
export const VolumeRecoveryPointInfos = S.Array(VolumeRecoveryPointInfo);
export interface VolumeInfo {
  VolumeARN?: string;
  VolumeId?: string;
  GatewayARN?: string;
  GatewayId?: string;
  VolumeType?: string;
  VolumeSizeInBytes?: number;
  VolumeAttachmentStatus?: string;
}
export const VolumeInfo = S.suspend(() =>
  S.Struct({
    VolumeARN: S.optional(S.String),
    VolumeId: S.optional(S.String),
    GatewayARN: S.optional(S.String),
    GatewayId: S.optional(S.String),
    VolumeType: S.optional(S.String),
    VolumeSizeInBytes: S.optional(S.Number),
    VolumeAttachmentStatus: S.optional(S.String),
  }),
).annotations({ identifier: "VolumeInfo" }) as any as S.Schema<VolumeInfo>;
export type VolumeInfos = VolumeInfo[];
export const VolumeInfos = S.Array(VolumeInfo);
export interface ActivateGatewayOutput {
  GatewayARN?: string;
}
export const ActivateGatewayOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ActivateGatewayOutput",
}) as any as S.Schema<ActivateGatewayOutput>;
export interface AssociateFileSystemOutput {
  FileSystemAssociationARN?: string;
}
export const AssociateFileSystemOutput = S.suspend(() =>
  S.Struct({ FileSystemAssociationARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "AssociateFileSystemOutput",
}) as any as S.Schema<AssociateFileSystemOutput>;
export interface CreateNFSFileShareOutput {
  FileShareARN?: string;
}
export const CreateNFSFileShareOutput = S.suspend(() =>
  S.Struct({ FileShareARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateNFSFileShareOutput",
}) as any as S.Schema<CreateNFSFileShareOutput>;
export interface DescribeCacheReportOutput {
  CacheReportInfo?: CacheReportInfo;
}
export const DescribeCacheReportOutput = S.suspend(() =>
  S.Struct({ CacheReportInfo: S.optional(CacheReportInfo) }).pipe(ns),
).annotations({
  identifier: "DescribeCacheReportOutput",
}) as any as S.Schema<DescribeCacheReportOutput>;
export interface DescribeChapCredentialsOutput {
  ChapCredentials?: ChapInfo[];
}
export const DescribeChapCredentialsOutput = S.suspend(() =>
  S.Struct({ ChapCredentials: S.optional(ChapCredentials) }).pipe(ns),
).annotations({
  identifier: "DescribeChapCredentialsOutput",
}) as any as S.Schema<DescribeChapCredentialsOutput>;
export interface DescribeGatewayInformationOutput {
  GatewayARN?: string;
  GatewayId?: string;
  GatewayName?: string;
  GatewayTimezone?: string;
  GatewayState?: string;
  GatewayNetworkInterfaces?: NetworkInterface[];
  GatewayType?: string;
  NextUpdateAvailabilityDate?: string;
  LastSoftwareUpdate?: string;
  Ec2InstanceId?: string;
  Ec2InstanceRegion?: string;
  Tags?: Tag[];
  VPCEndpoint?: string;
  CloudWatchLogGroupARN?: string;
  HostEnvironment?: HostEnvironment;
  EndpointType?: string;
  SoftwareUpdatesEndDate?: string;
  DeprecationDate?: string;
  GatewayCapacity?: GatewayCapacity;
  SupportedGatewayCapacities?: GatewayCapacity[];
  HostEnvironmentId?: string;
  SoftwareVersion?: string;
}
export const DescribeGatewayInformationOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    GatewayId: S.optional(S.String),
    GatewayName: S.optional(S.String),
    GatewayTimezone: S.optional(S.String),
    GatewayState: S.optional(S.String),
    GatewayNetworkInterfaces: S.optional(GatewayNetworkInterfaces),
    GatewayType: S.optional(S.String),
    NextUpdateAvailabilityDate: S.optional(S.String),
    LastSoftwareUpdate: S.optional(S.String),
    Ec2InstanceId: S.optional(S.String),
    Ec2InstanceRegion: S.optional(S.String),
    Tags: S.optional(Tags),
    VPCEndpoint: S.optional(S.String),
    CloudWatchLogGroupARN: S.optional(S.String),
    HostEnvironment: S.optional(HostEnvironment),
    EndpointType: S.optional(S.String),
    SoftwareUpdatesEndDate: S.optional(S.String),
    DeprecationDate: S.optional(S.String),
    GatewayCapacity: S.optional(GatewayCapacity),
    SupportedGatewayCapacities: S.optional(SupportedGatewayCapacities),
    HostEnvironmentId: S.optional(S.String),
    SoftwareVersion: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeGatewayInformationOutput",
}) as any as S.Schema<DescribeGatewayInformationOutput>;
export interface DescribeNFSFileSharesOutput {
  NFSFileShareInfoList?: NFSFileShareInfo[];
}
export const DescribeNFSFileSharesOutput = S.suspend(() =>
  S.Struct({ NFSFileShareInfoList: S.optional(NFSFileShareInfoList) }).pipe(ns),
).annotations({
  identifier: "DescribeNFSFileSharesOutput",
}) as any as S.Schema<DescribeNFSFileSharesOutput>;
export interface DescribeSMBFileSharesOutput {
  SMBFileShareInfoList?: SMBFileShareInfo[];
}
export const DescribeSMBFileSharesOutput = S.suspend(() =>
  S.Struct({ SMBFileShareInfoList: S.optional(SMBFileShareInfoList) }).pipe(ns),
).annotations({
  identifier: "DescribeSMBFileSharesOutput",
}) as any as S.Schema<DescribeSMBFileSharesOutput>;
export interface DescribeStorediSCSIVolumesOutput {
  StorediSCSIVolumes?: StorediSCSIVolume[];
}
export const DescribeStorediSCSIVolumesOutput = S.suspend(() =>
  S.Struct({ StorediSCSIVolumes: S.optional(StorediSCSIVolumes) }).pipe(ns),
).annotations({
  identifier: "DescribeStorediSCSIVolumesOutput",
}) as any as S.Schema<DescribeStorediSCSIVolumesOutput>;
export interface DescribeTapeArchivesOutput {
  TapeArchives?: TapeArchive[];
  Marker?: string;
}
export const DescribeTapeArchivesOutput = S.suspend(() =>
  S.Struct({
    TapeArchives: S.optional(TapeArchives),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTapeArchivesOutput",
}) as any as S.Schema<DescribeTapeArchivesOutput>;
export interface DescribeTapeRecoveryPointsOutput {
  GatewayARN?: string;
  TapeRecoveryPointInfos?: TapeRecoveryPointInfo[];
  Marker?: string;
}
export const DescribeTapeRecoveryPointsOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    TapeRecoveryPointInfos: S.optional(TapeRecoveryPointInfos),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTapeRecoveryPointsOutput",
}) as any as S.Schema<DescribeTapeRecoveryPointsOutput>;
export interface DescribeTapesOutput {
  Tapes?: Tape[];
  Marker?: string;
}
export const DescribeTapesOutput = S.suspend(() =>
  S.Struct({ Tapes: S.optional(Tapes), Marker: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DescribeTapesOutput",
}) as any as S.Schema<DescribeTapesOutput>;
export interface ListAutomaticTapeCreationPoliciesOutput {
  AutomaticTapeCreationPolicyInfos?: AutomaticTapeCreationPolicyInfo[];
}
export const ListAutomaticTapeCreationPoliciesOutput = S.suspend(() =>
  S.Struct({
    AutomaticTapeCreationPolicyInfos: S.optional(
      AutomaticTapeCreationPolicyInfos,
    ),
  }).pipe(ns),
).annotations({
  identifier: "ListAutomaticTapeCreationPoliciesOutput",
}) as any as S.Schema<ListAutomaticTapeCreationPoliciesOutput>;
export interface ListFileSharesOutput {
  Marker?: string;
  NextMarker?: string;
  FileShareInfoList?: FileShareInfo[];
}
export const ListFileSharesOutput = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    FileShareInfoList: S.optional(FileShareInfoList),
  }).pipe(ns),
).annotations({
  identifier: "ListFileSharesOutput",
}) as any as S.Schema<ListFileSharesOutput>;
export interface ListFileSystemAssociationsOutput {
  Marker?: string;
  NextMarker?: string;
  FileSystemAssociationSummaryList?: FileSystemAssociationSummary[];
}
export const ListFileSystemAssociationsOutput = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    FileSystemAssociationSummaryList: S.optional(
      FileSystemAssociationSummaryList,
    ),
  }).pipe(ns),
).annotations({
  identifier: "ListFileSystemAssociationsOutput",
}) as any as S.Schema<ListFileSystemAssociationsOutput>;
export interface ListGatewaysOutput {
  Gateways?: GatewayInfo[];
  Marker?: string;
}
export const ListGatewaysOutput = S.suspend(() =>
  S.Struct({
    Gateways: S.optional(Gateways),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListGatewaysOutput",
}) as any as S.Schema<ListGatewaysOutput>;
export interface ListLocalDisksOutput {
  GatewayARN?: string;
  Disks?: Disk[];
}
export const ListLocalDisksOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String), Disks: S.optional(Disks) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListLocalDisksOutput",
}) as any as S.Schema<ListLocalDisksOutput>;
export interface ListTapePoolsOutput {
  PoolInfos?: PoolInfo[];
  Marker?: string;
}
export const ListTapePoolsOutput = S.suspend(() =>
  S.Struct({
    PoolInfos: S.optional(PoolInfos),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTapePoolsOutput",
}) as any as S.Schema<ListTapePoolsOutput>;
export interface ListTapesOutput {
  TapeInfos?: TapeInfo[];
  Marker?: string;
}
export const ListTapesOutput = S.suspend(() =>
  S.Struct({
    TapeInfos: S.optional(TapeInfos),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListTapesOutput",
}) as any as S.Schema<ListTapesOutput>;
export interface ListVolumeRecoveryPointsOutput {
  GatewayARN?: string;
  VolumeRecoveryPointInfos?: VolumeRecoveryPointInfo[];
}
export const ListVolumeRecoveryPointsOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    VolumeRecoveryPointInfos: S.optional(VolumeRecoveryPointInfos),
  }).pipe(ns),
).annotations({
  identifier: "ListVolumeRecoveryPointsOutput",
}) as any as S.Schema<ListVolumeRecoveryPointsOutput>;
export interface ListVolumesOutput {
  GatewayARN?: string;
  Marker?: string;
  VolumeInfos?: VolumeInfo[];
}
export const ListVolumesOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    Marker: S.optional(S.String),
    VolumeInfos: S.optional(VolumeInfos),
  }).pipe(ns),
).annotations({
  identifier: "ListVolumesOutput",
}) as any as S.Schema<ListVolumesOutput>;
export interface StartCacheReportOutput {
  CacheReportARN?: string;
}
export const StartCacheReportOutput = S.suspend(() =>
  S.Struct({ CacheReportARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartCacheReportOutput",
}) as any as S.Schema<StartCacheReportOutput>;
export interface UpdateAutomaticTapeCreationPolicyOutput {
  GatewayARN?: string;
}
export const UpdateAutomaticTapeCreationPolicyOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateAutomaticTapeCreationPolicyOutput",
}) as any as S.Schema<UpdateAutomaticTapeCreationPolicyOutput>;
export interface UpdateBandwidthRateLimitScheduleOutput {
  GatewayARN?: string;
}
export const UpdateBandwidthRateLimitScheduleOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateBandwidthRateLimitScheduleOutput",
}) as any as S.Schema<UpdateBandwidthRateLimitScheduleOutput>;
export interface UpdateMaintenanceStartTimeOutput {
  GatewayARN?: string;
}
export const UpdateMaintenanceStartTimeOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateMaintenanceStartTimeOutput",
}) as any as S.Schema<UpdateMaintenanceStartTimeOutput>;
export interface UpdateSMBLocalGroupsOutput {
  GatewayARN?: string;
}
export const UpdateSMBLocalGroupsOutput = S.suspend(() =>
  S.Struct({ GatewayARN: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateSMBLocalGroupsOutput",
}) as any as S.Schema<UpdateSMBLocalGroupsOutput>;
export type ErrorCode =
  | "ActivationKeyExpired"
  | "ActivationKeyInvalid"
  | "ActivationKeyNotFound"
  | "GatewayInternalError"
  | "GatewayNotConnected"
  | "GatewayNotFound"
  | "GatewayProxyNetworkConnectionBusy"
  | "AuthenticationFailure"
  | "BandwidthThrottleScheduleNotFound"
  | "Blocked"
  | "CannotExportSnapshot"
  | "ChapCredentialNotFound"
  | "DiskAlreadyAllocated"
  | "DiskDoesNotExist"
  | "DiskSizeGreaterThanVolumeMaxSize"
  | "DiskSizeLessThanVolumeSize"
  | "DiskSizeNotGigAligned"
  | "DuplicateCertificateInfo"
  | "DuplicateSchedule"
  | "EndpointNotFound"
  | "IAMNotSupported"
  | "InitiatorInvalid"
  | "InitiatorNotFound"
  | "InternalError"
  | "InvalidGateway"
  | "InvalidEndpoint"
  | "InvalidParameters"
  | "InvalidSchedule"
  | "LocalStorageLimitExceeded"
  | "LunAlreadyAllocated "
  | "LunInvalid"
  | "JoinDomainInProgress"
  | "MaximumContentLengthExceeded"
  | "MaximumTapeCartridgeCountExceeded"
  | "MaximumVolumeCountExceeded"
  | "NetworkConfigurationChanged"
  | "NoDisksAvailable"
  | "NotImplemented"
  | "NotSupported"
  | "OperationAborted"
  | "OutdatedGateway"
  | "ParametersNotImplemented"
  | "RegionInvalid"
  | "RequestTimeout"
  | "ServiceUnavailable"
  | "SnapshotDeleted"
  | "SnapshotIdInvalid"
  | "SnapshotInProgress"
  | "SnapshotNotFound"
  | "SnapshotScheduleNotFound"
  | "StagingAreaFull"
  | "StorageFailure"
  | "TapeCartridgeNotFound"
  | "TargetAlreadyExists"
  | "TargetInvalid"
  | "TargetNotFound"
  | "UnauthorizedOperation"
  | "VolumeAlreadyExists"
  | "VolumeIdInvalid"
  | "VolumeInUse"
  | "VolumeNotFound"
  | "VolumeNotReady";
export const ErrorCode = S.Literal(
  "ActivationKeyExpired",
  "ActivationKeyInvalid",
  "ActivationKeyNotFound",
  "GatewayInternalError",
  "GatewayNotConnected",
  "GatewayNotFound",
  "GatewayProxyNetworkConnectionBusy",
  "AuthenticationFailure",
  "BandwidthThrottleScheduleNotFound",
  "Blocked",
  "CannotExportSnapshot",
  "ChapCredentialNotFound",
  "DiskAlreadyAllocated",
  "DiskDoesNotExist",
  "DiskSizeGreaterThanVolumeMaxSize",
  "DiskSizeLessThanVolumeSize",
  "DiskSizeNotGigAligned",
  "DuplicateCertificateInfo",
  "DuplicateSchedule",
  "EndpointNotFound",
  "IAMNotSupported",
  "InitiatorInvalid",
  "InitiatorNotFound",
  "InternalError",
  "InvalidGateway",
  "InvalidEndpoint",
  "InvalidParameters",
  "InvalidSchedule",
  "LocalStorageLimitExceeded",
  "LunAlreadyAllocated ",
  "LunInvalid",
  "JoinDomainInProgress",
  "MaximumContentLengthExceeded",
  "MaximumTapeCartridgeCountExceeded",
  "MaximumVolumeCountExceeded",
  "NetworkConfigurationChanged",
  "NoDisksAvailable",
  "NotImplemented",
  "NotSupported",
  "OperationAborted",
  "OutdatedGateway",
  "ParametersNotImplemented",
  "RegionInvalid",
  "RequestTimeout",
  "ServiceUnavailable",
  "SnapshotDeleted",
  "SnapshotIdInvalid",
  "SnapshotInProgress",
  "SnapshotNotFound",
  "SnapshotScheduleNotFound",
  "StagingAreaFull",
  "StorageFailure",
  "TapeCartridgeNotFound",
  "TargetAlreadyExists",
  "TargetInvalid",
  "TargetNotFound",
  "UnauthorizedOperation",
  "VolumeAlreadyExists",
  "VolumeIdInvalid",
  "VolumeInUse",
  "VolumeNotFound",
  "VolumeNotReady",
);
export interface FileSystemAssociationStatusDetail {
  ErrorCode?: string;
}
export const FileSystemAssociationStatusDetail = S.suspend(() =>
  S.Struct({ ErrorCode: S.optional(S.String) }),
).annotations({
  identifier: "FileSystemAssociationStatusDetail",
}) as any as S.Schema<FileSystemAssociationStatusDetail>;
export type FileSystemAssociationStatusDetails =
  FileSystemAssociationStatusDetail[];
export const FileSystemAssociationStatusDetails = S.Array(
  FileSystemAssociationStatusDetail,
);
export interface DeviceiSCSIAttributes {
  TargetARN?: string;
  NetworkInterfaceId?: string;
  NetworkInterfacePort?: number;
  ChapEnabled?: boolean;
}
export const DeviceiSCSIAttributes = S.suspend(() =>
  S.Struct({
    TargetARN: S.optional(S.String),
    NetworkInterfaceId: S.optional(S.String),
    NetworkInterfacePort: S.optional(S.Number),
    ChapEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DeviceiSCSIAttributes",
}) as any as S.Schema<DeviceiSCSIAttributes>;
export interface CachediSCSIVolume {
  VolumeARN?: string;
  VolumeId?: string;
  VolumeType?: string;
  VolumeStatus?: string;
  VolumeAttachmentStatus?: string;
  VolumeSizeInBytes?: number;
  VolumeProgress?: number;
  SourceSnapshotId?: string;
  VolumeiSCSIAttributes?: VolumeiSCSIAttributes;
  CreatedDate?: Date;
  VolumeUsedInBytes?: number;
  KMSKey?: string;
  TargetName?: string;
}
export const CachediSCSIVolume = S.suspend(() =>
  S.Struct({
    VolumeARN: S.optional(S.String),
    VolumeId: S.optional(S.String),
    VolumeType: S.optional(S.String),
    VolumeStatus: S.optional(S.String),
    VolumeAttachmentStatus: S.optional(S.String),
    VolumeSizeInBytes: S.optional(S.Number),
    VolumeProgress: S.optional(S.Number),
    SourceSnapshotId: S.optional(S.String),
    VolumeiSCSIAttributes: S.optional(VolumeiSCSIAttributes),
    CreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    VolumeUsedInBytes: S.optional(S.Number),
    KMSKey: S.optional(S.String),
    TargetName: S.optional(S.String),
  }),
).annotations({
  identifier: "CachediSCSIVolume",
}) as any as S.Schema<CachediSCSIVolume>;
export type CachediSCSIVolumes = CachediSCSIVolume[];
export const CachediSCSIVolumes = S.Array(CachediSCSIVolume);
export interface FileSystemAssociationInfo {
  FileSystemAssociationARN?: string;
  LocationARN?: string;
  FileSystemAssociationStatus?: string;
  AuditDestinationARN?: string;
  GatewayARN?: string;
  Tags?: Tag[];
  CacheAttributes?: CacheAttributes;
  EndpointNetworkConfiguration?: EndpointNetworkConfiguration;
  FileSystemAssociationStatusDetails?: FileSystemAssociationStatusDetail[];
}
export const FileSystemAssociationInfo = S.suspend(() =>
  S.Struct({
    FileSystemAssociationARN: S.optional(S.String),
    LocationARN: S.optional(S.String),
    FileSystemAssociationStatus: S.optional(S.String),
    AuditDestinationARN: S.optional(S.String),
    GatewayARN: S.optional(S.String),
    Tags: S.optional(Tags),
    CacheAttributes: S.optional(CacheAttributes),
    EndpointNetworkConfiguration: S.optional(EndpointNetworkConfiguration),
    FileSystemAssociationStatusDetails: S.optional(
      FileSystemAssociationStatusDetails,
    ),
  }),
).annotations({
  identifier: "FileSystemAssociationInfo",
}) as any as S.Schema<FileSystemAssociationInfo>;
export type FileSystemAssociationInfoList = FileSystemAssociationInfo[];
export const FileSystemAssociationInfoList = S.Array(FileSystemAssociationInfo);
export interface VTLDevice {
  VTLDeviceARN?: string;
  VTLDeviceType?: string;
  VTLDeviceVendor?: string;
  VTLDeviceProductIdentifier?: string;
  DeviceiSCSIAttributes?: DeviceiSCSIAttributes;
}
export const VTLDevice = S.suspend(() =>
  S.Struct({
    VTLDeviceARN: S.optional(S.String),
    VTLDeviceType: S.optional(S.String),
    VTLDeviceVendor: S.optional(S.String),
    VTLDeviceProductIdentifier: S.optional(S.String),
    DeviceiSCSIAttributes: S.optional(DeviceiSCSIAttributes),
  }),
).annotations({ identifier: "VTLDevice" }) as any as S.Schema<VTLDevice>;
export type VTLDevices = VTLDevice[];
export const VTLDevices = S.Array(VTLDevice);
export interface DescribeCachediSCSIVolumesOutput {
  CachediSCSIVolumes?: CachediSCSIVolume[];
}
export const DescribeCachediSCSIVolumesOutput = S.suspend(() =>
  S.Struct({ CachediSCSIVolumes: S.optional(CachediSCSIVolumes) }).pipe(ns),
).annotations({
  identifier: "DescribeCachediSCSIVolumesOutput",
}) as any as S.Schema<DescribeCachediSCSIVolumesOutput>;
export interface DescribeFileSystemAssociationsOutput {
  FileSystemAssociationInfoList?: FileSystemAssociationInfo[];
}
export const DescribeFileSystemAssociationsOutput = S.suspend(() =>
  S.Struct({
    FileSystemAssociationInfoList: S.optional(FileSystemAssociationInfoList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeFileSystemAssociationsOutput",
}) as any as S.Schema<DescribeFileSystemAssociationsOutput>;
export interface DescribeVTLDevicesOutput {
  GatewayARN?: string;
  VTLDevices?: VTLDevice[];
  Marker?: string;
}
export const DescribeVTLDevicesOutput = S.suspend(() =>
  S.Struct({
    GatewayARN: S.optional(S.String),
    VTLDevices: S.optional(VTLDevices),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeVTLDevicesOutput",
}) as any as S.Schema<DescribeVTLDevicesOutput>;
export type ErrorDetails = { [key: string]: string };
export const ErrorDetails = S.Record({ key: S.String, value: S.String });
export interface StorageGatewayError {
  errorCode?: ErrorCode;
  errorDetails?: { [key: string]: string };
}
export const StorageGatewayError = S.suspend(() =>
  S.Struct({
    errorCode: S.optional(ErrorCode),
    errorDetails: S.optional(ErrorDetails),
  }),
).annotations({
  identifier: "StorageGatewayError",
}) as any as S.Schema<StorageGatewayError>;

//# Errors
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { message: S.optional(S.String), error: S.optional(StorageGatewayError) },
).pipe(C.withServerError) {}
export class InvalidGatewayRequestException extends S.TaggedError<InvalidGatewayRequestException>()(
  "InvalidGatewayRequestException",
  { message: S.optional(S.String), error: S.optional(StorageGatewayError) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableError extends S.TaggedError<ServiceUnavailableError>()(
  "ServiceUnavailableError",
  { message: S.optional(S.String), error: S.optional(StorageGatewayError) },
).pipe(C.withServerError) {}

//# Operations
/**
 * Configures one or more gateway local disks as cache for a gateway. This operation is
 * only supported in the cached volume, tape, and file gateway type (see How Storage Gateway works (architecture).
 *
 * In the request, you specify the gateway Amazon Resource Name (ARN) to which you want to
 * add cache, and one or more disk IDs that you want to configure as cache.
 */
export const addCache: (
  input: AddCacheInput,
) => effect.Effect<
  AddCacheOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddCacheInput,
  output: AddCacheOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Adds one or more tags to the specified resource. You use tags to add metadata to
 * resources, which you can use to categorize these resources. For example, you can categorize
 * resources by purpose, owner, environment, or team. Each tag consists of a key and a value,
 * which you define. You can add tags to the following Storage Gateway resources:
 *
 * - Storage gateways of all types
 *
 * - Storage volumes
 *
 * - Virtual tapes
 *
 * - NFS and SMB file shares
 *
 * - File System associations
 *
 * You can create a maximum of 50 tags for each resource. Virtual tapes and storage volumes
 * that are recovered to a new gateway maintain their tags.
 */
export const addTagsToResource: (
  input: AddTagsToResourceInput,
) => effect.Effect<
  AddTagsToResourceOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToResourceInput,
  output: AddTagsToResourceOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Configures one or more gateway local disks as upload buffer for a specified gateway.
 * This operation is supported for the stored volume, cached volume, and tape gateway
 * types.
 *
 * In the request, you specify the gateway Amazon Resource Name (ARN) to which you want to
 * add upload buffer, and one or more disk IDs that you want to configure as upload
 * buffer.
 */
export const addUploadBuffer: (
  input: AddUploadBufferInput,
) => effect.Effect<
  AddUploadBufferOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddUploadBufferInput,
  output: AddUploadBufferOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Configures one or more gateway local disks as working storage for a gateway. This
 * operation is only supported in the stored volume gateway type. This operation is deprecated
 * in cached volume API version 20120630. Use AddUploadBuffer
 * instead.
 *
 * Working storage is also referred to as upload buffer. You can also use the AddUploadBuffer operation to add upload buffer to a stored volume
 * gateway.
 *
 * In the request, you specify the gateway Amazon Resource Name (ARN) to which you want to
 * add working storage, and one or more disk IDs that you want to configure as working
 * storage.
 */
export const addWorkingStorage: (
  input: AddWorkingStorageInput,
) => effect.Effect<
  AddWorkingStorageOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddWorkingStorageInput,
  output: AddWorkingStorageOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Assigns a tape to a tape pool for archiving. The tape assigned to a pool is archived in
 * the S3 storage class that is associated with the pool. When you use your backup application
 * to eject the tape, the tape is archived directly into the S3 storage class (S3 Glacier or
 * S3 Glacier Deep Archive) that corresponds to the pool.
 */
export const assignTapePool: (
  input: AssignTapePoolInput,
) => effect.Effect<
  AssignTapePoolOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssignTapePoolInput,
  output: AssignTapePoolOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Connects a volume to an iSCSI connection and then attaches the volume to the specified
 * gateway. Detaching and attaching a volume enables you to recover your data from one gateway
 * to a different gateway without creating a snapshot. It also makes it easier to move your
 * volumes from an on-premises gateway to a gateway hosted on an Amazon EC2 instance.
 */
export const attachVolume: (
  input: AttachVolumeInput,
) => effect.Effect<
  AttachVolumeOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachVolumeInput,
  output: AttachVolumeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Cancels archiving of a virtual tape to the virtual tape shelf (VTS) after the archiving
 * process is initiated. This operation is only supported in the tape gateway type.
 */
export const cancelArchival: (
  input: CancelArchivalInput,
) => effect.Effect<
  CancelArchivalOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelArchivalInput,
  output: CancelArchivalOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Cancels generation of a specified cache report. You can use this operation to manually
 * cancel an IN-PROGRESS report for any reason. This action changes the report status from
 * IN-PROGRESS to CANCELLED. You can only cancel in-progress reports. If the the report you
 * attempt to cancel is in FAILED, ERROR, or COMPLETED state, the cancel operation returns an
 * error.
 */
export const cancelCacheReport: (
  input: CancelCacheReportInput,
) => effect.Effect<
  CancelCacheReportOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelCacheReportInput,
  output: CancelCacheReportOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Cancels retrieval of a virtual tape from the virtual tape shelf (VTS) to a gateway after
 * the retrieval process is initiated. The virtual tape is returned to the VTS. This operation
 * is only supported in the tape gateway type.
 */
export const cancelRetrieval: (
  input: CancelRetrievalInput,
) => effect.Effect<
  CancelRetrievalOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelRetrievalInput,
  output: CancelRetrievalOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Creates a cached volume on a specified cached volume gateway. This operation is only
 * supported in the cached volume gateway type.
 *
 * Cache storage must be allocated to the gateway before you can create a cached volume.
 * Use the AddCache operation to add cache storage to a gateway.
 *
 * In the request, you must specify the gateway, size of the volume in bytes, the iSCSI
 * target name, an IP address on which to expose the target, and a unique client token. In
 * response, the gateway creates the volume and returns information about it. This information
 * includes the volume Amazon Resource Name (ARN), its size, and the iSCSI target ARN that
 * initiators can use to connect to the volume target.
 *
 * Optionally, you can provide the ARN for an existing volume as the
 * `SourceVolumeARN` for this cached volume, which creates an exact copy of the
 * existing volume’s latest recovery point. The `VolumeSizeInBytes` value must be
 * equal to or larger than the size of the copied volume, in bytes.
 */
export const createCachediSCSIVolume: (
  input: CreateCachediSCSIVolumeInput,
) => effect.Effect<
  CreateCachediSCSIVolumeOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCachediSCSIVolumeInput,
  output: CreateCachediSCSIVolumeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Creates a Server Message Block (SMB) file share on an existing S3 File Gateway. In
 * Storage Gateway, a file share is a file system mount point backed by Amazon S3
 * cloud storage. Storage Gateway exposes file shares using an SMB interface. This operation
 * is only supported for S3 File Gateways.
 *
 * S3 File Gateways require Security Token Service (Amazon Web Services STS) to be
 * activated to enable you to create a file share. Make sure that Amazon Web Services STS
 * is activated in the Amazon Web Services Region you are creating your S3 File Gateway in.
 * If Amazon Web Services STS is not activated in this Amazon Web Services Region, activate
 * it. For information about how to activate Amazon Web Services STS, see Activating and
 * deactivating Amazon Web Services STS in an Amazon Web Services Region in the
 * *Identity and Access Management User Guide*.
 *
 * File gateways don't support creating hard or symbolic links on a file
 * share.
 */
export const createSMBFileShare: (
  input: CreateSMBFileShareInput,
) => effect.Effect<
  CreateSMBFileShareOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSMBFileShareInput,
  output: CreateSMBFileShareOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Creates a volume on a specified gateway. This operation is only supported in the stored
 * volume gateway type.
 *
 * The size of the volume to create is inferred from the disk size. You can choose to
 * preserve existing data on the disk, create volume from an existing snapshot, or create an
 * empty volume. If you choose to create an empty gateway volume, then any existing data on
 * the disk is erased.
 *
 * In the request, you must specify the gateway and the disk information on which you are
 * creating the volume. In response, the gateway creates the volume and returns volume
 * information such as the volume Amazon Resource Name (ARN), its size, and the iSCSI target
 * ARN that initiators can use to connect to the volume target.
 */
export const createStorediSCSIVolume: (
  input: CreateStorediSCSIVolumeInput,
) => effect.Effect<
  CreateStorediSCSIVolumeOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStorediSCSIVolumeInput,
  output: CreateStorediSCSIVolumeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Creates a new custom tape pool. You can use custom tape pool to enable tape retention
 * lock on tapes that are archived in the custom pool.
 */
export const createTapePool: (
  input: CreateTapePoolInput,
) => effect.Effect<
  CreateTapePoolOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTapePoolInput,
  output: CreateTapePoolOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Creates one or more virtual tapes. You write data to the virtual tapes and then archive
 * the tapes. This operation is only supported in the tape gateway type.
 *
 * Cache storage must be allocated to the gateway before you can create virtual tapes.
 * Use the AddCache operation to add cache storage to a gateway.
 */
export const createTapes: (
  input: CreateTapesInput,
) => effect.Effect<
  CreateTapesOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTapesInput,
  output: CreateTapesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Creates a virtual tape by using your own barcode. You write data to the virtual tape and
 * then archive the tape. A barcode is unique and cannot be reused if it has already been used
 * on a tape. This applies to barcodes used on deleted tapes. This operation is only supported
 * in the tape gateway type.
 *
 * Cache storage must be allocated to the gateway before you can create a virtual tape.
 * Use the AddCache operation to add cache storage to a gateway.
 */
export const createTapeWithBarcode: (
  input: CreateTapeWithBarcodeInput,
) => effect.Effect<
  CreateTapeWithBarcodeOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTapeWithBarcodeInput,
  output: CreateTapeWithBarcodeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Deletes the automatic tape creation policy of a gateway. If you delete this policy, new
 * virtual tapes must be created manually. Use the Amazon Resource Name (ARN) of the gateway
 * in your request to remove the policy.
 */
export const deleteAutomaticTapeCreationPolicy: (
  input: DeleteAutomaticTapeCreationPolicyInput,
) => effect.Effect<
  DeleteAutomaticTapeCreationPolicyOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAutomaticTapeCreationPolicyInput,
  output: DeleteAutomaticTapeCreationPolicyOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Deletes the bandwidth rate limits of a gateway. You can delete either the upload and
 * download bandwidth rate limit, or you can delete both. If you delete only one of the
 * limits, the other limit remains unchanged. To specify which gateway to work with, use the
 * Amazon Resource Name (ARN) of the gateway in your request. This operation is supported only
 * for the stored volume, cached volume, and tape gateway types.
 */
export const deleteBandwidthRateLimit: (
  input: DeleteBandwidthRateLimitInput,
) => effect.Effect<
  DeleteBandwidthRateLimitOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBandwidthRateLimitInput,
  output: DeleteBandwidthRateLimitOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Deletes the specified cache report and any associated tags from the Storage Gateway database. You can only delete completed reports. If the status of the
 * report you attempt to delete still IN-PROGRESS, the delete operation returns an error. You
 * can use `CancelCacheReport` to cancel an IN-PROGRESS report.
 *
 * `DeleteCacheReport` does not delete the report object from your Amazon S3 bucket.
 */
export const deleteCacheReport: (
  input: DeleteCacheReportInput,
) => effect.Effect<
  DeleteCacheReportOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCacheReportInput,
  output: DeleteCacheReportOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Deletes Challenge-Handshake Authentication Protocol (CHAP) credentials for a specified
 * iSCSI target and initiator pair. This operation is supported in volume and tape gateway
 * types.
 */
export const deleteChapCredentials: (
  input: DeleteChapCredentialsInput,
) => effect.Effect<
  DeleteChapCredentialsOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteChapCredentialsInput,
  output: DeleteChapCredentialsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Deletes a file share from an S3 File Gateway. This operation is only supported for S3
 * File Gateways.
 */
export const deleteFileShare: (
  input: DeleteFileShareInput,
) => effect.Effect<
  DeleteFileShareOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFileShareInput,
  output: DeleteFileShareOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Deletes a gateway. To specify which gateway to delete, use the Amazon Resource Name
 * (ARN) of the gateway in your request. The operation deletes the gateway; however, it does
 * not delete the gateway virtual machine (VM) from your host computer.
 *
 * After you delete a gateway, you cannot reactivate it. Completed snapshots of the gateway
 * volumes are not deleted upon deleting the gateway, however, pending snapshots will not
 * complete. After you delete a gateway, your next step is to remove it from your
 * environment.
 *
 * You no longer pay software charges after the gateway is deleted; however, your
 * existing Amazon EBS snapshots persist and you will continue to be billed for these
 * snapshots. You can choose to remove all remaining Amazon EBS snapshots by canceling your
 * Amazon EC2 subscription.  If you prefer not to cancel your Amazon EC2 subscription, you
 * can delete your snapshots using the Amazon EC2 console. For more information, see the
 * Storage Gateway detail
 * page.
 */
export const deleteGateway: (
  input: DeleteGatewayInput,
) => effect.Effect<
  DeleteGatewayOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGatewayInput,
  output: DeleteGatewayOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Deletes a snapshot of a volume.
 *
 * You can take snapshots of your gateway volumes on a scheduled or ad hoc basis. This API
 * action enables you to delete a snapshot schedule for a volume. For more information, see
 * Backing up your
 * volumes. In the `DeleteSnapshotSchedule` request, you identify the
 * volume by providing its Amazon Resource Name (ARN). This operation is only supported for
 * cached volume gateway types.
 *
 * To list or delete a snapshot, you must use the Amazon EC2 API. For more information,
 * go to DescribeSnapshots
 * in the *Amazon Elastic Compute Cloud API Reference*.
 */
export const deleteSnapshotSchedule: (
  input: DeleteSnapshotScheduleInput,
) => effect.Effect<
  DeleteSnapshotScheduleOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSnapshotScheduleInput,
  output: DeleteSnapshotScheduleOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Deletes the specified virtual tape. This operation is only supported in the tape gateway
 * type.
 */
export const deleteTape: (
  input: DeleteTapeInput,
) => effect.Effect<
  DeleteTapeOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTapeInput,
  output: DeleteTapeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Deletes the specified virtual tape from the virtual tape shelf (VTS). This operation is
 * only supported in the tape gateway type.
 */
export const deleteTapeArchive: (
  input: DeleteTapeArchiveInput,
) => effect.Effect<
  DeleteTapeArchiveOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTapeArchiveInput,
  output: DeleteTapeArchiveOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Delete a custom tape pool. A custom tape pool can only be deleted if there are no tapes
 * in the pool and if there are no automatic tape creation policies that reference the custom
 * tape pool.
 */
export const deleteTapePool: (
  input: DeleteTapePoolInput,
) => effect.Effect<
  DeleteTapePoolOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTapePoolInput,
  output: DeleteTapePoolOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Deletes the specified storage volume that you previously created using the CreateCachediSCSIVolume or CreateStorediSCSIVolume API.
 * This operation is only supported in the cached volume and stored volume types. For stored
 * volume gateways, the local disk that was configured as the storage volume is not deleted.
 * You can reuse the local disk to create another storage volume.
 *
 * Before you delete a volume, make sure there are no iSCSI connections to the volume you
 * are deleting. You should also make sure there is no snapshot in progress. You can use the
 * Amazon Elastic Compute Cloud (Amazon EC2) API to query snapshots on the volume you are
 * deleting and check the snapshot status. For more information, go to DescribeSnapshots in the Amazon Elastic Compute Cloud API
 * Reference.
 *
 * In the request, you must provide the Amazon Resource Name (ARN) of the storage volume
 * you want to delete.
 */
export const deleteVolume: (
  input: DeleteVolumeInput,
) => effect.Effect<
  DeleteVolumeOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVolumeInput,
  output: DeleteVolumeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns information about the most recent high availability monitoring test that was
 * performed on the host in a cluster. If a test isn't performed, the status and start
 * time in the response would be null.
 */
export const describeAvailabilityMonitorTest: (
  input: DescribeAvailabilityMonitorTestInput,
) => effect.Effect<
  DescribeAvailabilityMonitorTestOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAvailabilityMonitorTestInput,
  output: DescribeAvailabilityMonitorTestOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns the bandwidth rate limits of a gateway. By default, these limits are not set,
 * which means no bandwidth rate limiting is in effect. This operation is supported only for
 * the stored volume, cached volume, and tape gateway types. To describe bandwidth rate limits
 * for S3 file gateways, use DescribeBandwidthRateLimitSchedule.
 *
 * This operation returns a value for a bandwidth rate limit only if the limit is set. If
 * no limits are set for the gateway, then this operation returns only the gateway ARN in the
 * response body. To specify which gateway to describe, use the Amazon Resource Name (ARN) of
 * the gateway in your request.
 */
export const describeBandwidthRateLimit: (
  input: DescribeBandwidthRateLimitInput,
) => effect.Effect<
  DescribeBandwidthRateLimitOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBandwidthRateLimitInput,
  output: DescribeBandwidthRateLimitOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns information about the bandwidth rate limit schedule of a gateway. By default,
 * gateways do not have bandwidth rate limit schedules, which means no bandwidth rate limiting
 * is in effect. This operation is supported only for volume, tape and S3 file gateways. FSx
 * file gateways do not support bandwidth rate limits.
 *
 * This operation returns information about a gateway's bandwidth rate limit schedule. A
 * bandwidth rate limit schedule consists of one or more bandwidth rate limit intervals. A
 * bandwidth rate limit interval defines a period of time on one or more days of the week,
 * during which bandwidth rate limits are specified for uploading, downloading, or both.
 *
 * A bandwidth rate limit interval consists of one or more days of the week, a start hour
 * and minute, an ending hour and minute, and bandwidth rate limits for uploading and
 * downloading
 *
 * If no bandwidth rate limit schedule intervals are set for the gateway, this operation
 * returns an empty response. To specify which gateway to describe, use the Amazon Resource
 * Name (ARN) of the gateway in your request.
 */
export const describeBandwidthRateLimitSchedule: (
  input: DescribeBandwidthRateLimitScheduleInput,
) => effect.Effect<
  DescribeBandwidthRateLimitScheduleOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBandwidthRateLimitScheduleInput,
  output: DescribeBandwidthRateLimitScheduleOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns information about the cache of a gateway. This operation is only supported in
 * the cached volume, tape, and file gateway types.
 *
 * The response includes disk IDs that are configured as cache, and it includes the amount
 * of cache allocated and used.
 */
export const describeCache: (
  input: DescribeCacheInput,
) => effect.Effect<
  DescribeCacheOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCacheInput,
  output: DescribeCacheOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns your gateway's maintenance window schedule information, with values for
 * monthly or weekly cadence, specific day and time to begin maintenance, and which types of
 * updates to apply. Time values returned are for the gateway's time zone.
 */
export const describeMaintenanceStartTime: (
  input: DescribeMaintenanceStartTimeInput,
) => effect.Effect<
  DescribeMaintenanceStartTimeOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMaintenanceStartTimeInput,
  output: DescribeMaintenanceStartTimeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Gets a description of a Server Message Block (SMB) file share settings from a file
 * gateway. This operation is only supported for file gateways.
 */
export const describeSMBSettings: (
  input: DescribeSMBSettingsInput,
) => effect.Effect<
  DescribeSMBSettingsOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSMBSettingsInput,
  output: DescribeSMBSettingsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Describes the snapshot schedule for the specified gateway volume. The snapshot schedule
 * information includes intervals at which snapshots are automatically initiated on the
 * volume. This operation is only supported in the cached volume and stored volume
 * types.
 */
export const describeSnapshotSchedule: (
  input: DescribeSnapshotScheduleInput,
) => effect.Effect<
  DescribeSnapshotScheduleOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSnapshotScheduleInput,
  output: DescribeSnapshotScheduleOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns information about the upload buffer of a gateway. This operation is supported
 * for the stored volume, cached volume, and tape gateway types.
 *
 * The response includes disk IDs that are configured as upload buffer space, and it
 * includes the amount of upload buffer space allocated and used.
 */
export const describeUploadBuffer: (
  input: DescribeUploadBufferInput,
) => effect.Effect<
  DescribeUploadBufferOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUploadBufferInput,
  output: DescribeUploadBufferOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns information about the working storage of a gateway. This operation is only
 * supported in the stored volumes gateway type. This operation is deprecated in cached
 * volumes API version (20120630). Use DescribeUploadBuffer instead.
 *
 * Working storage is also referred to as upload buffer. You can also use the
 * DescribeUploadBuffer operation to add upload buffer to a stored volume gateway.
 *
 * The response includes disk IDs that are configured as working storage, and it includes
 * the amount of working storage allocated and used.
 */
export const describeWorkingStorage: (
  input: DescribeWorkingStorageInput,
) => effect.Effect<
  DescribeWorkingStorageOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWorkingStorageInput,
  output: DescribeWorkingStorageOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Disconnects a volume from an iSCSI connection and then detaches the volume from the
 * specified gateway. Detaching and attaching a volume enables you to recover your data from
 * one gateway to a different gateway without creating a snapshot. It also makes it easier to
 * move your volumes from an on-premises gateway to a gateway hosted on an Amazon EC2
 * instance. This operation is only supported in the volume gateway type.
 */
export const detachVolume: (
  input: DetachVolumeInput,
) => effect.Effect<
  DetachVolumeOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachVolumeInput,
  output: DetachVolumeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Disables a tape gateway when the gateway is no longer functioning. For example, if your
 * gateway VM is damaged, you can disable the gateway so you can recover virtual tapes.
 *
 * Use this operation for a tape gateway that is not reachable or not functioning. This
 * operation is only supported in the tape gateway type.
 *
 * After a gateway is disabled, it cannot be enabled.
 */
export const disableGateway: (
  input: DisableGatewayInput,
) => effect.Effect<
  DisableGatewayOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableGatewayInput,
  output: DisableGatewayOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Disassociates an Amazon FSx file system from the specified gateway. After the
 * disassociation process finishes, the gateway can no longer access the Amazon FSx
 * file system. This operation is only supported in the FSx File Gateway type.
 */
export const disassociateFileSystem: (
  input: DisassociateFileSystemInput,
) => effect.Effect<
  DisassociateFileSystemOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateFileSystemInput,
  output: DisassociateFileSystemOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Starts a process that cleans the specified file share's cache of file entries that are
 * failing upload to Amazon S3. This API operation reports success if the request is
 * received with valid arguments, and there are no other cache clean operations currently
 * in-progress for the specified file share. After a successful request, the cache clean
 * operation occurs asynchronously and reports progress using CloudWatch logs and
 * notifications.
 *
 * If `ForceRemove` is set to `True`, the cache clean operation
 * will delete file data from the gateway which might otherwise be recoverable. We
 * recommend using this operation only after all other methods to clear files failing
 * upload have been exhausted, and if your business need outweighs the potential data
 * loss.
 */
export const evictFilesFailingUpload: (
  input: EvictFilesFailingUploadInput,
) => effect.Effect<
  EvictFilesFailingUploadOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EvictFilesFailingUploadInput,
  output: EvictFilesFailingUploadOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Adds a file gateway to an Active Directory domain. This operation is only supported for
 * file gateways that support the SMB file protocol.
 *
 * Joining a domain creates an Active Directory computer account in the default
 * organizational unit, using the gateway's **Gateway ID** as
 * the account name (for example, SGW-1234ADE). If your Active Directory environment
 * requires that you pre-stage accounts to facilitate the join domain process, you will
 * need to create this account ahead of time.
 *
 * To create the gateway's computer account in an organizational unit other than the
 * default, you must specify the organizational unit when joining the domain.
 */
export const joinDomain: (
  input: JoinDomainInput,
) => effect.Effect<
  JoinDomainOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: JoinDomainInput,
  output: JoinDomainOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns a list of existing cache reports for all file shares associated with your
 * Amazon Web Services account. This list includes all information provided by the
 * `DescribeCacheReport` action, such as report name, status, completion
 * progress, start time, end time, filters, and tags.
 */
export const listCacheReports: {
  (
    input: ListCacheReportsInput,
  ): effect.Effect<
    ListCacheReportsOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCacheReportsInput,
  ) => stream.Stream<
    ListCacheReportsOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCacheReportsInput,
  ) => stream.Stream<
    CacheReportInfo,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCacheReportsInput,
  output: ListCacheReportsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "CacheReportList",
  } as const,
}));
/**
 * Lists the tags that have been added to the specified resource. This operation is
 * supported in storage gateways of all types.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceInput,
  ): effect.Effect<
    ListTagsForResourceOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceInput,
  ) => stream.Stream<
    ListTagsForResourceOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceInput,
  ) => stream.Stream<
    Tag,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Tags",
    pageSize: "Limit",
  } as const,
}));
/**
 * Lists iSCSI initiators that are connected to a volume. You can use this operation to
 * determine whether a volume is being used or not. This operation is only supported in the
 * cached volume and stored volume gateway types.
 */
export const listVolumeInitiators: (
  input: ListVolumeInitiatorsInput,
) => effect.Effect<
  ListVolumeInitiatorsOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVolumeInitiatorsInput,
  output: ListVolumeInitiatorsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Sends you notification through Amazon EventBridge when all files written to your file
 * share have been uploaded to Amazon S3.
 *
 * Storage Gateway can send a notification through Amazon EventBridge when all
 * files written to your file share up to that point in time have been uploaded to Amazon S3. These files include files written to the file share up to the time that you
 * make a request for notification. When the upload is done, Storage Gateway sends you
 * notification through EventBridge. You can configure EventBridge to send the
 * notification through event targets such as Amazon SNS or Lambda
 * function. This operation is only supported for S3 File Gateways.
 *
 * For more information, see Getting
 * file upload notification in the Amazon S3 File Gateway User
 * Guide.
 */
export const notifyWhenUploaded: (
  input: NotifyWhenUploadedInput,
) => effect.Effect<
  NotifyWhenUploadedOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: NotifyWhenUploadedInput,
  output: NotifyWhenUploadedOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Refreshes the cached inventory of objects for the specified file share. This operation
 * finds objects in the Amazon S3 bucket that were added, removed, or replaced since
 * the gateway last listed the bucket's contents and cached the results. This operation
 * does not import files into the S3 File Gateway cache storage. It only updates the cached
 * inventory to reflect changes in the inventory of the objects in the S3 bucket. This
 * operation is only supported in the S3 File Gateway types.
 *
 * You can subscribe to be notified through an Amazon CloudWatch event when your
 * `RefreshCache` operation completes. For more information, see Getting
 * notified about file operations in the Amazon S3 File Gateway User
 * Guide. This operation is Only supported for S3 File Gateways.
 *
 * When this API is called, it only initiates the refresh operation. When the API call
 * completes and returns a success code, it doesn't necessarily mean that the file
 * refresh has completed. You should use the refresh-complete notification to determine that
 * the operation has completed before you check for new files on the gateway file share. You
 * can subscribe to be notified through a CloudWatch event when your `RefreshCache`
 * operation completes.
 *
 * Throttle limit: This API is asynchronous, so the gateway will accept no more than two
 * refreshes at any time. We recommend using the refresh-complete CloudWatch event
 * notification before issuing additional requests. For more information, see Getting
 * notified about file operations in the Amazon S3 File Gateway User
 * Guide.
 *
 * - Wait at least 60 seconds between consecutive RefreshCache API requests.
 *
 * - If you invoke the RefreshCache API when two requests are already being
 * processed, any new request will cause an
 * `InvalidGatewayRequestException` error because too many requests
 * were sent to the server.
 *
 * The S3 bucket name does not need to be included when entering the list of folders in
 * the FolderList parameter.
 *
 * For more information, see Getting
 * notified about file operations in the Amazon S3 File Gateway User
 * Guide.
 */
export const refreshCache: (
  input: RefreshCacheInput,
) => effect.Effect<
  RefreshCacheOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RefreshCacheInput,
  output: RefreshCacheOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Removes one or more tags from the specified resource. This operation is supported in
 * storage gateways of all types.
 */
export const removeTagsFromResource: (
  input: RemoveTagsFromResourceInput,
) => effect.Effect<
  RemoveTagsFromResourceOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsFromResourceInput,
  output: RemoveTagsFromResourceOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Resets all cache disks that have encountered an error and makes the disks available for
 * reconfiguration as cache storage. If your cache disk encounters an error, the gateway
 * prevents read and write operations on virtual tapes in the gateway. For example, an error
 * can occur when a disk is corrupted or removed from the gateway. When a cache is reset, the
 * gateway loses its cache storage. At this point, you can reconfigure the disks as cache
 * disks. This operation is only supported in the cached volume and tape types.
 *
 * If the cache disk you are resetting contains data that has not been uploaded to
 * Amazon S3 yet, that data can be lost. After you reset cache disks, there will
 * be no configured cache disks left in the gateway, so you must configure at least one new
 * cache disk for your gateway to function properly.
 */
export const resetCache: (
  input: ResetCacheInput,
) => effect.Effect<
  ResetCacheOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetCacheInput,
  output: ResetCacheOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Retrieves an archived virtual tape from the virtual tape shelf (VTS) to a tape gateway.
 * Virtual tapes archived in the VTS are not associated with any gateway. However after a tape
 * is retrieved, it is associated with a gateway, even though it is also listed in the VTS,
 * that is, archive. This operation is only supported in the tape gateway type.
 *
 * Once a tape is successfully retrieved to a gateway, it cannot be retrieved again to
 * another gateway. You must archive the tape again before you can retrieve it to another
 * gateway. This operation is only supported in the tape gateway type.
 */
export const retrieveTapeArchive: (
  input: RetrieveTapeArchiveInput,
) => effect.Effect<
  RetrieveTapeArchiveOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetrieveTapeArchiveInput,
  output: RetrieveTapeArchiveOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Retrieves the recovery point for the specified virtual tape. This operation is only
 * supported in the tape gateway type.
 *
 * A recovery point is a point in time view of a virtual tape at which all the data on the
 * tape is consistent. If your gateway crashes, virtual tapes that have recovery points can be
 * recovered to a new gateway.
 *
 * The virtual tape can be retrieved to only one gateway. The retrieved tape is
 * read-only. The virtual tape can be retrieved to only a tape gateway. There is no charge
 * for retrieving recovery points.
 */
export const retrieveTapeRecoveryPoint: (
  input: RetrieveTapeRecoveryPointInput,
) => effect.Effect<
  RetrieveTapeRecoveryPointOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RetrieveTapeRecoveryPointInput,
  output: RetrieveTapeRecoveryPointOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Sets the password for your VM local console. When you log in to the local console for
 * the first time, you log in to the VM with the default credentials. We recommend that you
 * set a new password. You don't need to know the default password to set a new
 * password.
 */
export const setLocalConsolePassword: (
  input: SetLocalConsolePasswordInput,
) => effect.Effect<
  SetLocalConsolePasswordOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetLocalConsolePasswordInput,
  output: SetLocalConsolePasswordOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Sets the password for the guest user `smbguest`. The `smbguest`
 * user is the user when the authentication method for the file share is set to
 * `GuestAccess`. This operation only supported for S3 File Gateways
 */
export const setSMBGuestPassword: (
  input: SetSMBGuestPasswordInput,
) => effect.Effect<
  SetSMBGuestPasswordOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SetSMBGuestPasswordInput,
  output: SetSMBGuestPasswordOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Shuts down a Tape Gateway or Volume Gateway. To specify which gateway to shut down, use
 * the Amazon Resource Name (ARN) of the gateway in the body of your request.
 *
 * This API action cannot be used to shut down S3 File Gateway or FSx File
 * Gateway.
 *
 * The operation shuts down the gateway service component running in the gateway's
 * virtual machine (VM) and not the host VM.
 *
 * If you want to shut down the VM, it is recommended that you first shut down the
 * gateway component in the VM to avoid unpredictable conditions.
 *
 * After the gateway is shutdown, you cannot call any other API except StartGateway, DescribeGatewayInformation, and ListGateways. For more information, see ActivateGateway.
 * Your applications cannot read from or write to the gateway's storage volumes, and
 * there are no snapshots taken.
 *
 * When you make a shutdown request, you will get a `200 OK` success response
 * immediately. However, it might take some time for the gateway to shut down. You can call
 * the DescribeGatewayInformation API to check the status. For more
 * information, see ActivateGateway.
 *
 * If do not intend to use the gateway again, you must delete the gateway (using DeleteGateway) to no longer pay software charges associated with the
 * gateway.
 */
export const shutdownGateway: (
  input: ShutdownGatewayInput,
) => effect.Effect<
  ShutdownGatewayOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ShutdownGatewayInput,
  output: ShutdownGatewayOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Start a test that verifies that the specified gateway is configured for High
 * Availability monitoring in your host environment. This request only initiates the test and
 * that a successful response only indicates that the test was started. It doesn't
 * indicate that the test passed. For the status of the test, invoke the
 * `DescribeAvailabilityMonitorTest` API.
 *
 * Starting this test will cause your gateway to go offline for a brief period.
 */
export const startAvailabilityMonitorTest: (
  input: StartAvailabilityMonitorTestInput,
) => effect.Effect<
  StartAvailabilityMonitorTestOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAvailabilityMonitorTestInput,
  output: StartAvailabilityMonitorTestOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Starts a gateway that you previously shut down (see ShutdownGateway).
 * After the gateway starts, you can then make other API calls, your applications can read
 * from or write to the gateway's storage volumes and you will be able to take snapshot
 * backups.
 *
 * When you make a request, you will get a 200 OK success response immediately. However,
 * it might take some time for the gateway to be ready. You should call DescribeGatewayInformation and check the status before making any
 * additional API calls. For more information, see ActivateGateway.
 *
 * To specify which gateway to start, use the Amazon Resource Name (ARN) of the gateway in
 * your request.
 */
export const startGateway: (
  input: StartGatewayInput,
) => effect.Effect<
  StartGatewayOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartGatewayInput,
  output: StartGatewayOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates the bandwidth rate limits of a gateway. You can update both the upload and
 * download bandwidth rate limit or specify only one of the two. If you don't set a
 * bandwidth rate limit, the existing rate limit remains. This operation is supported only for
 * the stored volume, cached volume, and tape gateway types. To update bandwidth rate limits
 * for S3 file gateways, use UpdateBandwidthRateLimitSchedule.
 *
 * By default, a gateway's bandwidth rate limits are not set. If you don't set
 * any limit, the gateway does not have any limitations on its bandwidth usage and could
 * potentially use the maximum available bandwidth.
 *
 * To specify which gateway to update, use the Amazon Resource Name (ARN) of the gateway in
 * your request.
 */
export const updateBandwidthRateLimit: (
  input: UpdateBandwidthRateLimitInput,
) => effect.Effect<
  UpdateBandwidthRateLimitOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBandwidthRateLimitInput,
  output: UpdateBandwidthRateLimitOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates the Challenge-Handshake Authentication Protocol (CHAP) credentials for a
 * specified iSCSI target. By default, a gateway does not have CHAP enabled; however, for
 * added security, you might use it. This operation is supported in the volume and tape
 * gateway types.
 *
 * When you update CHAP credentials, all existing connections on the target are closed
 * and initiators must reconnect with the new credentials.
 */
export const updateChapCredentials: (
  input: UpdateChapCredentialsInput,
) => effect.Effect<
  UpdateChapCredentialsOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateChapCredentialsInput,
  output: UpdateChapCredentialsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates a file system association. This operation is only supported in the FSx File
 * Gateways.
 */
export const updateFileSystemAssociation: (
  input: UpdateFileSystemAssociationInput,
) => effect.Effect<
  UpdateFileSystemAssociationOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFileSystemAssociationInput,
  output: UpdateFileSystemAssociationOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates a gateway's metadata, which includes the gateway's name, time zone,
 * and metadata cache size. To specify which gateway to update, use the Amazon Resource Name
 * (ARN) of the gateway in your request.
 *
 * For gateways activated after September 2, 2015, the gateway's ARN contains the
 * gateway ID rather than the gateway name. However, changing the name of the gateway has
 * no effect on the gateway's ARN.
 */
export const updateGatewayInformation: (
  input: UpdateGatewayInformationInput,
) => effect.Effect<
  UpdateGatewayInformationOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGatewayInformationInput,
  output: UpdateGatewayInformationOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates the gateway virtual machine (VM) software. The request immediately triggers the
 * software update.
 *
 * When you make this request, you get a `200 OK` success response
 * immediately. However, it might take some time for the update to complete. You can call
 * DescribeGatewayInformation to verify the gateway is in the
 * `STATE_RUNNING` state.
 *
 * A software update forces a system restart of your gateway. You can minimize the
 * chance of any disruption to your applications by increasing your iSCSI Initiators'
 * timeouts. For more information about increasing iSCSI Initiator timeouts for Windows and
 * Linux, see Customizing your Windows iSCSI settings and Customizing your Linux iSCSI settings, respectively.
 */
export const updateGatewaySoftwareNow: (
  input: UpdateGatewaySoftwareNowInput,
) => effect.Effect<
  UpdateGatewaySoftwareNowOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateGatewaySoftwareNowInput,
  output: UpdateGatewaySoftwareNowOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates a Network File System (NFS) file share. This operation is only supported in S3
 * File Gateways.
 *
 * To leave a file share field unchanged, set the corresponding input field to
 * null.
 *
 * Updates the following file share settings:
 *
 * - Default storage class for your S3 bucket
 *
 * - Metadata defaults for your S3 bucket
 *
 * - Allowed NFS clients for your file share
 *
 * - Squash settings
 *
 * - Write status of your file share
 */
export const updateNFSFileShare: (
  input: UpdateNFSFileShareInput,
) => effect.Effect<
  UpdateNFSFileShareOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNFSFileShareInput,
  output: UpdateNFSFileShareOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates a Server Message Block (SMB) file share. This operation is only supported for S3
 * File Gateways.
 *
 * To leave a file share field unchanged, set the corresponding input field to
 * null.
 *
 * File gateways require Security Token Service (Amazon Web Services STS) to be
 * activated to enable you to create a file share. Make sure that Amazon Web Services STS
 * is activated in the Amazon Web Services Region you are creating your file gateway in. If
 * Amazon Web Services STS is not activated in this Amazon Web Services Region, activate
 * it. For information about how to activate Amazon Web Services STS, see Activating and
 * deactivating Amazon Web Services STS in an Amazon Web Services Region in the
 * *Identity and Access Management User Guide*.
 *
 * File gateways don't support creating hard or symbolic links on a file
 * share.
 */
export const updateSMBFileShare: (
  input: UpdateSMBFileShareInput,
) => effect.Effect<
  UpdateSMBFileShareOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSMBFileShareInput,
  output: UpdateSMBFileShareOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Controls whether the shares on an S3 File Gateway are visible in a net view or browse
 * list. The operation is only supported for S3 File Gateways.
 */
export const updateSMBFileShareVisibility: (
  input: UpdateSMBFileShareVisibilityInput,
) => effect.Effect<
  UpdateSMBFileShareVisibilityOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSMBFileShareVisibilityInput,
  output: UpdateSMBFileShareVisibilityOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates the SMB security strategy level for an Amazon S3 file gateway. This
 * action is only supported for Amazon S3 file gateways.
 *
 * For information about configuring this setting using the Amazon Web Services console,
 * see Setting a security level for your gateway in the Amazon S3
 * File Gateway User Guide.
 *
 * A higher security strategy level can affect performance of the gateway.
 */
export const updateSMBSecurityStrategy: (
  input: UpdateSMBSecurityStrategyInput,
) => effect.Effect<
  UpdateSMBSecurityStrategyOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSMBSecurityStrategyInput,
  output: UpdateSMBSecurityStrategyOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates a snapshot schedule configured for a gateway volume. This operation is only
 * supported in the cached volume and stored volume gateway types.
 *
 * The default snapshot schedule for volume is once every 24 hours, starting at the
 * creation time of the volume. You can use this API to change the snapshot schedule
 * configured for the volume.
 *
 * In the request you must identify the gateway volume whose snapshot schedule you want to
 * update, and the schedule information, including when you want the snapshot to begin on a
 * day and the frequency (in hours) of snapshots.
 */
export const updateSnapshotSchedule: (
  input: UpdateSnapshotScheduleInput,
) => effect.Effect<
  UpdateSnapshotScheduleOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSnapshotScheduleInput,
  output: UpdateSnapshotScheduleOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates the type of medium changer in a tape gateway. When you activate a tape gateway,
 * you select a medium changer type for the tape gateway. This operation enables you to select
 * a different type of medium changer after a tape gateway is activated. This operation is
 * only supported in the tape gateway type.
 */
export const updateVTLDeviceType: (
  input: UpdateVTLDeviceTypeInput,
) => effect.Effect<
  UpdateVTLDeviceTypeOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVTLDeviceTypeInput,
  output: UpdateVTLDeviceTypeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Activates the gateway you previously deployed on your host. In the activation process,
 * you specify information such as the Amazon Web Services Region that you want to use for
 * storing snapshots or tapes, the time zone for scheduled snapshots the gateway snapshot
 * schedule window, an activation key, and a name for your gateway. The activation process
 * also associates your gateway with your account. For more information, see UpdateGatewayInformation.
 *
 * You must turn on the gateway VM before you can activate your gateway.
 */
export const activateGateway: (
  input: ActivateGatewayInput,
) => effect.Effect<
  ActivateGatewayOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ActivateGatewayInput,
  output: ActivateGatewayOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Associate an Amazon FSx file system with the FSx File Gateway. After the
 * association process is complete, the file shares on the Amazon FSx file system are
 * available for access through the gateway. This operation only supports the FSx File Gateway
 * type.
 */
export const associateFileSystem: (
  input: AssociateFileSystemInput,
) => effect.Effect<
  AssociateFileSystemOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateFileSystemInput,
  output: AssociateFileSystemOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Creates a Network File System (NFS) file share on an existing S3 File Gateway. In
 * Storage Gateway, a file share is a file system mount point backed by Amazon S3
 * cloud storage. Storage Gateway exposes file shares using an NFS interface. This operation
 * is only supported for S3 File Gateways.
 *
 * S3 File gateway requires Security Token Service (Amazon Web Services STS) to be
 * activated to enable you to create a file share. Make sure Amazon Web Services STS is
 * activated in the Amazon Web Services Region you are creating your S3 File Gateway in. If
 * Amazon Web Services STS is not activated in the Amazon Web Services Region, activate
 * it. For information about how to activate Amazon Web Services STS, see Activating and
 * deactivating Amazon Web Services STS in an Amazon Web Services Region in the
 * *Identity and Access Management User Guide*.
 *
 * S3 File Gateways do not support creating hard or symbolic links on a file
 * share.
 */
export const createNFSFileShare: (
  input: CreateNFSFileShareInput,
) => effect.Effect<
  CreateNFSFileShareOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNFSFileShareInput,
  output: CreateNFSFileShareOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns information about the specified cache report, including completion status and
 * generation progress.
 */
export const describeCacheReport: (
  input: DescribeCacheReportInput,
) => effect.Effect<
  DescribeCacheReportOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCacheReportInput,
  output: DescribeCacheReportOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns an array of Challenge-Handshake Authentication Protocol (CHAP) credentials
 * information for a specified iSCSI target, one for each target-initiator pair. This
 * operation is supported in the volume and tape gateway types.
 */
export const describeChapCredentials: (
  input: DescribeChapCredentialsInput,
) => effect.Effect<
  DescribeChapCredentialsOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeChapCredentialsInput,
  output: DescribeChapCredentialsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns metadata about a gateway such as its name, network interfaces, time zone,
 * status, and software version. To specify which gateway to describe, use the Amazon Resource
 * Name (ARN) of the gateway in your request.
 */
export const describeGatewayInformation: (
  input: DescribeGatewayInformationInput,
) => effect.Effect<
  DescribeGatewayInformationOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeGatewayInformationInput,
  output: DescribeGatewayInformationOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Gets a description for one or more Network File System (NFS) file shares from an S3 File
 * Gateway. This operation is only supported for S3 File Gateways.
 */
export const describeNFSFileShares: (
  input: DescribeNFSFileSharesInput,
) => effect.Effect<
  DescribeNFSFileSharesOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeNFSFileSharesInput,
  output: DescribeNFSFileSharesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Gets a description for one or more Server Message Block (SMB) file shares from a S3 File
 * Gateway. This operation is only supported for S3 File Gateways.
 */
export const describeSMBFileShares: (
  input: DescribeSMBFileSharesInput,
) => effect.Effect<
  DescribeSMBFileSharesOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSMBFileSharesInput,
  output: DescribeSMBFileSharesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns the description of the gateway volumes specified in the request. The list of
 * gateway volumes in the request must be from one gateway. In the response, Storage Gateway returns volume information sorted by volume ARNs. This operation is only
 * supported in stored volume gateway type.
 */
export const describeStorediSCSIVolumes: (
  input: DescribeStorediSCSIVolumesInput,
) => effect.Effect<
  DescribeStorediSCSIVolumesOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStorediSCSIVolumesInput,
  output: DescribeStorediSCSIVolumesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns a description of specified virtual tapes in the virtual tape shelf (VTS). This
 * operation is only supported in the tape gateway type.
 *
 * If a specific `TapeARN` is not specified, Storage Gateway returns a
 * description of all virtual tapes found in the VTS associated with your account.
 */
export const describeTapeArchives: {
  (
    input: DescribeTapeArchivesInput,
  ): effect.Effect<
    DescribeTapeArchivesOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTapeArchivesInput,
  ) => stream.Stream<
    DescribeTapeArchivesOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTapeArchivesInput,
  ) => stream.Stream<
    TapeArchive,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTapeArchivesInput,
  output: DescribeTapeArchivesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "TapeArchives",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns a list of virtual tape recovery points that are available for the specified tape
 * gateway.
 *
 * A recovery point is a point-in-time view of a virtual tape at which all the data on the
 * virtual tape is consistent. If your gateway crashes, virtual tapes that have recovery
 * points can be recovered to a new gateway. This operation is only supported in the tape
 * gateway type.
 */
export const describeTapeRecoveryPoints: {
  (
    input: DescribeTapeRecoveryPointsInput,
  ): effect.Effect<
    DescribeTapeRecoveryPointsOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTapeRecoveryPointsInput,
  ) => stream.Stream<
    DescribeTapeRecoveryPointsOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTapeRecoveryPointsInput,
  ) => stream.Stream<
    TapeRecoveryPointInfo,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTapeRecoveryPointsInput,
  output: DescribeTapeRecoveryPointsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "TapeRecoveryPointInfos",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns a description of virtual tapes that correspond to the specified Amazon Resource
 * Names (ARNs). If `TapeARN` is not specified, returns a description of the
 * virtual tapes associated with the specified gateway. This operation is only supported for
 * the tape gateway type.
 *
 * The operation supports pagination. By default, the operation returns a maximum of up to
 * 100 tapes. You can optionally specify the `Limit` field in the body to limit the
 * number of tapes in the response. If the number of tapes returned in the response is
 * truncated, the response includes a `Marker` field. You can use this
 * `Marker` value in your subsequent request to retrieve the next set of
 * tapes.
 */
export const describeTapes: {
  (
    input: DescribeTapesInput,
  ): effect.Effect<
    DescribeTapesOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTapesInput,
  ) => stream.Stream<
    DescribeTapesOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTapesInput,
  ) => stream.Stream<
    Tape,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTapesInput,
  output: DescribeTapesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Tapes",
    pageSize: "Limit",
  } as const,
}));
/**
 * Lists the automatic tape creation policies for a gateway. If there are no automatic tape
 * creation policies for the gateway, it returns an empty list.
 *
 * This operation is only supported for tape gateways.
 */
export const listAutomaticTapeCreationPolicies: (
  input: ListAutomaticTapeCreationPoliciesInput,
) => effect.Effect<
  ListAutomaticTapeCreationPoliciesOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAutomaticTapeCreationPoliciesInput,
  output: ListAutomaticTapeCreationPoliciesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Gets a list of the file shares for a specific S3 File Gateway, or the list of file
 * shares that belong to the calling Amazon Web Services account. This operation is only
 * supported for S3 File Gateways.
 */
export const listFileShares: {
  (
    input: ListFileSharesInput,
  ): effect.Effect<
    ListFileSharesOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFileSharesInput,
  ) => stream.Stream<
    ListFileSharesOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFileSharesInput,
  ) => stream.Stream<
    FileShareInfo,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFileSharesInput,
  output: ListFileSharesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "FileShareInfoList",
    pageSize: "Limit",
  } as const,
}));
/**
 * Gets a list of `FileSystemAssociationSummary` objects. Each object contains a
 * summary of a file system association. This operation is only supported for FSx File
 * Gateways.
 */
export const listFileSystemAssociations: {
  (
    input: ListFileSystemAssociationsInput,
  ): effect.Effect<
    ListFileSystemAssociationsOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFileSystemAssociationsInput,
  ) => stream.Stream<
    ListFileSystemAssociationsOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFileSystemAssociationsInput,
  ) => stream.Stream<
    FileSystemAssociationSummary,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListFileSystemAssociationsInput,
  output: ListFileSystemAssociationsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "NextMarker",
    items: "FileSystemAssociationSummaryList",
    pageSize: "Limit",
  } as const,
}));
/**
 * Lists gateways owned by an Amazon Web Services account in an Amazon Web Services Region
 * specified in the request. The returned list is ordered by gateway Amazon Resource Name
 * (ARN).
 *
 * By default, the operation returns a maximum of 100 gateways. This operation supports
 * pagination that allows you to optionally reduce the number of gateways returned in a
 * response.
 *
 * If you have more gateways than are returned in a response (that is, the response returns
 * only a truncated list of your gateways), the response contains a marker that you can
 * specify in your next request to fetch the next page of gateways.
 */
export const listGateways: {
  (
    input: ListGatewaysInput,
  ): effect.Effect<
    ListGatewaysOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListGatewaysInput,
  ) => stream.Stream<
    ListGatewaysOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListGatewaysInput,
  ) => stream.Stream<
    GatewayInfo,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListGatewaysInput,
  output: ListGatewaysOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Gateways",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns a list of the gateway's local disks. To specify which gateway to describe,
 * you use the Amazon Resource Name (ARN) of the gateway in the body of the request.
 *
 * The request returns a list of all disks, specifying which are configured as working
 * storage, cache storage, or stored volume or not configured at all. The response includes a
 * `DiskStatus` field. This field can have a value of present (the disk is
 * available to use), missing (the disk is no longer connected to the gateway), or mismatch
 * (the disk node is occupied by a disk that has incorrect metadata or the disk content is
 * corrupted).
 */
export const listLocalDisks: (
  input: ListLocalDisksInput,
) => effect.Effect<
  ListLocalDisksOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListLocalDisksInput,
  output: ListLocalDisksOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Lists custom tape pools. You specify custom tape pools to list by specifying one or more
 * custom tape pool Amazon Resource Names (ARNs). If you don't specify a custom tape pool ARN,
 * the operation lists all custom tape pools.
 *
 * This operation supports pagination. You can optionally specify the `Limit`
 * parameter in the body to limit the number of tape pools in the response. If the number of
 * tape pools returned in the response is truncated, the response includes a
 * `Marker` element that you can use in your subsequent request to retrieve the
 * next set of tape pools.
 */
export const listTapePools: {
  (
    input: ListTapePoolsInput,
  ): effect.Effect<
    ListTapePoolsOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTapePoolsInput,
  ) => stream.Stream<
    ListTapePoolsOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTapePoolsInput,
  ) => stream.Stream<
    PoolInfo,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTapePoolsInput,
  output: ListTapePoolsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "PoolInfos",
    pageSize: "Limit",
  } as const,
}));
/**
 * Lists virtual tapes in your virtual tape library (VTL) and your virtual tape shelf
 * (VTS). You specify the tapes to list by specifying one or more tape Amazon Resource Names
 * (ARNs). If you don't specify a tape ARN, the operation lists all virtual tapes in both
 * your VTL and VTS.
 *
 * This operation supports pagination. By default, the operation returns a maximum of up to
 * 100 tapes. You can optionally specify the `Limit` parameter in the body to limit
 * the number of tapes in the response. If the number of tapes returned in the response is
 * truncated, the response includes a `Marker` element that you can use in your
 * subsequent request to retrieve the next set of tapes. This operation is only supported in
 * the tape gateway type.
 */
export const listTapes: {
  (
    input: ListTapesInput,
  ): effect.Effect<
    ListTapesOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTapesInput,
  ) => stream.Stream<
    ListTapesOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTapesInput,
  ) => stream.Stream<
    TapeInfo,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTapesInput,
  output: ListTapesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "TapeInfos",
    pageSize: "Limit",
  } as const,
}));
/**
 * Lists the recovery points for a specified gateway. This operation is only supported in
 * the cached volume gateway type.
 *
 * Each cache volume has one recovery point. A volume recovery point is a point in time at
 * which all data of the volume is consistent and from which you can create a snapshot or
 * clone a new cached volume from a source volume. To create a snapshot from a volume recovery
 * point use the CreateSnapshotFromVolumeRecoveryPoint operation.
 */
export const listVolumeRecoveryPoints: (
  input: ListVolumeRecoveryPointsInput,
) => effect.Effect<
  ListVolumeRecoveryPointsOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVolumeRecoveryPointsInput,
  output: ListVolumeRecoveryPointsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Lists the iSCSI stored volumes of a gateway. Results are sorted by volume ARN. The
 * response includes only the volume ARNs. If you want additional volume information, use the
 * DescribeStorediSCSIVolumes or the DescribeCachediSCSIVolumes API.
 *
 * The operation supports pagination. By default, the operation returns a maximum of up to
 * 100 volumes. You can optionally specify the `Limit` field in the body to limit
 * the number of volumes in the response. If the number of volumes returned in the response is
 * truncated, the response includes a Marker field. You can use this Marker value in your
 * subsequent request to retrieve the next set of volumes. This operation is only supported in
 * the cached volume and stored volume gateway types.
 */
export const listVolumes: {
  (
    input: ListVolumesInput,
  ): effect.Effect<
    ListVolumesOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListVolumesInput,
  ) => stream.Stream<
    ListVolumesOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListVolumesInput,
  ) => stream.Stream<
    VolumeInfo,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListVolumesInput,
  output: ListVolumesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "VolumeInfos",
    pageSize: "Limit",
  } as const,
}));
/**
 * Starts generating a report of the file metadata currently cached by an S3 File Gateway for a specific file share. You can use this report to identify and resolve
 * issues if you have files failing upload from your gateway to Amazon S3. The report
 * is a CSV file containing a list of files which match the set of filter parameters you
 * specify in the request.
 *
 * The **Files Failing Upload** flag is reset every 24
 * hours and during gateway reboot. If this report captures the files after the reset, but
 * before they become flagged again, they will not be reported as **Files Failing Upload**.
 *
 * The following requirements must be met to successfully generate a cache report:
 *
 * - You must have `s3:PutObject` and `s3:AbortMultipartUpload`
 * permissions for the Amazon S3 bucket where you want to store the cache
 * report.
 *
 * - No other cache reports can currently be in-progress for the specified file
 * share.
 *
 * - There must be fewer than 10 existing cache reports for the specified file
 * share.
 *
 * - The gateway must be online and connected to Amazon Web Services.
 *
 * - The root disk must have at least 20GB of free space when report generation
 * starts.
 *
 * - You must specify at least one value for `InclusionFilters` or
 * `ExclusionFilters` in the request.
 */
export const startCacheReport: (
  input: StartCacheReportInput,
) => effect.Effect<
  StartCacheReportOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCacheReportInput,
  output: StartCacheReportOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates the automatic tape creation policy of a gateway. Use this to update the policy
 * with a new set of automatic tape creation rules. This is only supported for tape
 * gateways.
 *
 * By default, there is no automatic tape creation policy.
 *
 * A gateway can have only one automatic tape creation policy.
 */
export const updateAutomaticTapeCreationPolicy: (
  input: UpdateAutomaticTapeCreationPolicyInput,
) => effect.Effect<
  UpdateAutomaticTapeCreationPolicyOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAutomaticTapeCreationPolicyInput,
  output: UpdateAutomaticTapeCreationPolicyOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates the bandwidth rate limit schedule for a specified gateway. By default, gateways
 * do not have bandwidth rate limit schedules, which means no bandwidth rate limiting is in
 * effect. Use this to initiate or update a gateway's bandwidth rate limit schedule. This
 * operation is supported for volume, tape, and S3 file gateways. S3 file gateways support
 * bandwidth rate limits for upload only. FSx file gateways do not support bandwidth rate
 * limits.
 */
export const updateBandwidthRateLimitSchedule: (
  input: UpdateBandwidthRateLimitScheduleInput,
) => effect.Effect<
  UpdateBandwidthRateLimitScheduleOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBandwidthRateLimitScheduleInput,
  output: UpdateBandwidthRateLimitScheduleOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates a gateway's maintenance window schedule, with settings for monthly or
 * weekly cadence, specific day and time to begin maintenance, and which types of updates to
 * apply. Time configuration uses the gateway's time zone. You can pass values for a complete
 * maintenance schedule, or update policy, or both. Previous values will persist for whichever
 * setting you choose not to modify. If an incomplete or invalid maintenance schedule is
 * passed, the entire request will be rejected with an error and no changes will occur.
 *
 * A complete maintenance schedule must include values for *both*
 * `MinuteOfHour` and `HourOfDay`, and *either*
 * `DayOfMonth`
 * *or*
 * `DayOfWeek`.
 *
 * We recommend keeping maintenance updates turned on, except in specific use cases
 * where the brief disruptions caused by updating the gateway could critically impact your
 * deployment.
 */
export const updateMaintenanceStartTime: (
  input: UpdateMaintenanceStartTimeInput,
) => effect.Effect<
  UpdateMaintenanceStartTimeOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMaintenanceStartTimeInput,
  output: UpdateMaintenanceStartTimeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Updates the list of Active Directory users and groups that have special permissions for
 * SMB file shares on the gateway.
 */
export const updateSMBLocalGroups: (
  input: UpdateSMBLocalGroupsInput,
) => effect.Effect<
  UpdateSMBLocalGroupsOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSMBLocalGroupsInput,
  output: UpdateSMBLocalGroupsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns a description of the gateway volumes specified in the request. This operation is
 * only supported in the cached volume gateway types.
 *
 * The list of gateway volumes in the request must be from one gateway. In the response,
 * Storage Gateway returns volume information sorted by volume Amazon Resource Name
 * (ARN).
 */
export const describeCachediSCSIVolumes: (
  input: DescribeCachediSCSIVolumesInput,
) => effect.Effect<
  DescribeCachediSCSIVolumesOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCachediSCSIVolumesInput,
  output: DescribeCachediSCSIVolumesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Gets the file system association information. This operation is only supported for FSx
 * File Gateways.
 */
export const describeFileSystemAssociations: (
  input: DescribeFileSystemAssociationsInput,
) => effect.Effect<
  DescribeFileSystemAssociationsOutput,
  InternalServerError | InvalidGatewayRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFileSystemAssociationsInput,
  output: DescribeFileSystemAssociationsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns a description of virtual tape library (VTL) devices for the specified tape
 * gateway. In the response, Storage Gateway returns VTL device information.
 *
 * This operation is only supported in the tape gateway type.
 */
export const describeVTLDevices: {
  (
    input: DescribeVTLDevicesInput,
  ): effect.Effect<
    DescribeVTLDevicesOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeVTLDevicesInput,
  ) => stream.Stream<
    DescribeVTLDevicesOutput,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeVTLDevicesInput,
  ) => stream.Stream<
    VTLDevice,
    InternalServerError | InvalidGatewayRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeVTLDevicesInput,
  output: DescribeVTLDevicesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "VTLDevices",
    pageSize: "Limit",
  } as const,
}));
/**
 * Initiates a snapshot of a volume.
 *
 * Storage Gateway provides the ability to back up point-in-time snapshots of your
 * data to Amazon Simple Storage (Amazon S3) for durable off-site recovery, and also
 * import the data to an Amazon Elastic Block Store (EBS) volume in Amazon Elastic Compute
 * Cloud (EC2). You can take snapshots of your gateway volume on a scheduled or ad hoc basis.
 * This API enables you to take an ad hoc snapshot. For more information, see Editing a
 * snapshot schedule.
 *
 * In the `CreateSnapshot` request, you identify the volume by providing its
 * Amazon Resource Name (ARN). You must also provide description for the snapshot. When
 * Storage Gateway takes the snapshot of specified volume, the snapshot and
 * description appears in the Storage Gateway console. In response, Storage Gateway
 * returns you a snapshot ID. You can use this snapshot ID to check the snapshot progress or
 * later use it when you want to create a volume from a snapshot. This operation is only
 * supported in stored and cached volume gateway type.
 *
 * To list or delete a snapshot, you must use the Amazon EC2 API. For more information,
 * see DescribeSnapshots
 * or DeleteSnapshot in the Amazon Elastic Compute Cloud API
 * Reference.
 *
 * Volume and snapshot IDs are changing to a longer length ID format. For more
 * information, see the important note on the Welcome page.
 */
export const createSnapshot: (
  input: CreateSnapshotInput,
) => effect.Effect<
  CreateSnapshotOutput,
  | InternalServerError
  | InvalidGatewayRequestException
  | ServiceUnavailableError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotInput,
  output: CreateSnapshotOutput,
  errors: [
    InternalServerError,
    InvalidGatewayRequestException,
    ServiceUnavailableError,
  ],
}));
/**
 * Initiates a snapshot of a gateway from a volume recovery point. This operation is only
 * supported in the cached volume gateway type.
 *
 * A volume recovery point is a point in time at which all data of the volume is consistent
 * and from which you can create a snapshot. To get a list of volume recovery point for cached
 * volume gateway, use ListVolumeRecoveryPoints.
 *
 * In the `CreateSnapshotFromVolumeRecoveryPoint` request, you identify the
 * volume by providing its Amazon Resource Name (ARN). You must also provide a description for
 * the snapshot. When the gateway takes a snapshot of the specified volume, the snapshot and
 * its description appear in the Storage Gateway console.
 * In response, the gateway returns
 * you a snapshot ID. You can use this snapshot ID to check the snapshot progress or later use
 * it when you want to create a volume from a snapshot.
 *
 * To list or delete a snapshot, you must use the Amazon EC2 API. For more information,
 * see DescribeSnapshots
 * or DeleteSnapshot in the Amazon Elastic Compute Cloud API
 * Reference.
 */
export const createSnapshotFromVolumeRecoveryPoint: (
  input: CreateSnapshotFromVolumeRecoveryPointInput,
) => effect.Effect<
  CreateSnapshotFromVolumeRecoveryPointOutput,
  | InternalServerError
  | InvalidGatewayRequestException
  | ServiceUnavailableError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotFromVolumeRecoveryPointInput,
  output: CreateSnapshotFromVolumeRecoveryPointOutput,
  errors: [
    InternalServerError,
    InvalidGatewayRequestException,
    ServiceUnavailableError,
  ],
}));
