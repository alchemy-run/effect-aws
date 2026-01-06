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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "FSx",
  serviceShapeName: "AWSSimbaAPIService_v20180301",
});
const auth = T.AwsAuthSigv4({ name: "fsx" });
const ver = T.ServiceVersion("2018-03-01");
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
                        url: "https://fsx-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [],
                      endpoint: {
                        url: "https://fsx-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://fsx.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://fsx.{Region}.{PartitionResult#dnsSuffix}",
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
export type ClientRequestToken = string;
export type FileSystemId = string;
export type AlternateDNSName = string;
export type TaskId = string;
export type SourceBackupId = string;
export type Region = string;
export type KmsKeyId = string;
export type VolumeId = string;
export type ResourceARN = string;
export type S3AccessPointAttachmentName = string;
export type Namespace = string;
export type ArchivePath = string;
export type Megabytes = number;
export type DataRepositoryTaskPath = string;
export type CapacityToRelease = number;
export type FileSystemTypeVersion = string;
export type StorageCapacity = number;
export type SubnetId = string;
export type SecurityGroupId = string;
export type BackupId = string;
export type SnapshotName = string;
export type StorageVirtualMachineName = string;
export type AdminPassword = string | Redacted.Redacted<string>;
export type VolumeName = string;
export type DataRepositoryAssociationId = string;
export type FileCacheId = string;
export type SnapshotId = string;
export type StorageVirtualMachineId = string;
export type MaxResults = number;
export type NextToken = string;
export type LimitedMaxResults = number;
export type VerboseFlag = string;
export type TagKey = string;
export type TagValue = string;
export type AccessPointPolicy = string;
export type PerUnitStorageThroughput = number;
export type WeeklyTime = string;
export type DirectoryId = string;
export type MegabytesPerSecond = number;
export type DailyTime = string;
export type AutomaticBackupRetentionDays = number;
export type ThroughputCapacityMbps = number;
export type IpAddressRange = string;
export type RouteTableId = string;
export type HAPairs = number;
export type ThroughputCapacityPerHAPair = number;
export type Ipv6AddressRange = string;
export type NetBiosAlias = string;
export type JunctionPath = string;
export type VolumeCapacity = number;
export type SnapshotPolicy = string;
export type VolumeCapacityBytes = number;
export type IntegerNoMaxFromNegativeOne = number;
export type IntegerRecordSizeKiB = number;
export type FilterValue = string;
export type DataRepositoryTaskFilterValue = string;
export type S3AccessPointAttachmentsFilterValue = string;
export type SnapshotFilterValue = string;
export type StorageVirtualMachineFilterValue = string;
export type VolumeFilterValue = string;
export type ErrorMessage = string;
export type VpcId = string;
export type Value = number;
export type MetadataStorageCapacity = number;
export type IpAddress = string;
export type ActiveDirectoryFullyQualifiedName = string;
export type OrganizationalUnitDistinguishedName = string;
export type FileSystemAdministratorsGroupName = string;
export type DirectoryUserName = string;
export type DirectoryPassword = string | Redacted.Redacted<string>;
export type CustomerSecretsManagerARN = string;
export type GeneralARN = string;
export type Iops = number;
export type LustreRootSquash = string;
export type LustreNoSquashNid = string;
export type MetadataIops = number;
export type CoolingPeriod = number;
export type Aggregate = string;
export type AggregateListMultiplier = number;
export type IntegerNoMax = number;
export type ProgressPercent = number;
export type TotalTransferBytes = number;
export type RemainingTransferBytes = number;
export type AWSAccountId = string;
export type SizeInBytes = number;
export type NetworkInterfaceId = string;
export type DNSName = string;
export type FileSystemUID = number;
export type FileSystemGID = number;
export type OntapFileSystemUserName = string;
export type AutocommitPeriodValue = number;
export type OpenZFSClients = string;
export type OpenZFSNfsExportOption = string;
export type Parameter = string;
export type LustreFileSystemMountName = string;
export type UUID = string;
export type VolumePath = string;
export type RetentionPeriodValue = number;
export type TotalConstituents = number;
export type TotalCount = number;
export type SucceededCount = number;
export type FailedCount = number;
export type ReleasedCapacity = number;
export type S3AccessPointAlias = string;
export type ErrorCode = string;

//# Schemas
export interface DescribeSharedVpcConfigurationRequest {}
export const DescribeSharedVpcConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSharedVpcConfigurationRequest",
}) as any as S.Schema<DescribeSharedVpcConfigurationRequest>;
export type AlternateDNSNames = string[];
export const AlternateDNSNames = S.Array(S.String);
export type UpdateOpenZFSVolumeOptions = string[];
export const UpdateOpenZFSVolumeOptions = S.Array(S.String);
export type DataRepositoryTaskPaths = string[];
export const DataRepositoryTaskPaths = S.Array(S.String);
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export type BackupIds = string[];
export const BackupIds = S.Array(S.String);
export type DataRepositoryAssociationIds = string[];
export const DataRepositoryAssociationIds = S.Array(S.String);
export type TaskIds = string[];
export const TaskIds = S.Array(S.String);
export type FileCacheIds = string[];
export const FileCacheIds = S.Array(S.String);
export type FileSystemIds = string[];
export const FileSystemIds = S.Array(S.String);
export type S3AccessPointAttachmentNames = string[];
export const S3AccessPointAttachmentNames = S.Array(S.String);
export type SnapshotIds = string[];
export const SnapshotIds = S.Array(S.String);
export type StorageVirtualMachineIds = string[];
export const StorageVirtualMachineIds = S.Array(S.String);
export type VolumeIds = string[];
export const VolumeIds = S.Array(S.String);
export type RestoreOpenZFSVolumeOptions = string[];
export const RestoreOpenZFSVolumeOptions = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface AssociateFileSystemAliasesRequest {
  ClientRequestToken?: string;
  FileSystemId: string;
  Aliases: AlternateDNSNames;
}
export const AssociateFileSystemAliasesRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    FileSystemId: S.String,
    Aliases: AlternateDNSNames,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateFileSystemAliasesRequest",
}) as any as S.Schema<AssociateFileSystemAliasesRequest>;
export interface CancelDataRepositoryTaskRequest {
  TaskId: string;
}
export const CancelDataRepositoryTaskRequest = S.suspend(() =>
  S.Struct({ TaskId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelDataRepositoryTaskRequest",
}) as any as S.Schema<CancelDataRepositoryTaskRequest>;
export interface CopySnapshotAndUpdateVolumeRequest {
  ClientRequestToken?: string;
  VolumeId: string;
  SourceSnapshotARN: string;
  CopyStrategy?: string;
  Options?: UpdateOpenZFSVolumeOptions;
}
export const CopySnapshotAndUpdateVolumeRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    VolumeId: S.String,
    SourceSnapshotARN: S.String,
    CopyStrategy: S.optional(S.String),
    Options: S.optional(UpdateOpenZFSVolumeOptions),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CopySnapshotAndUpdateVolumeRequest",
}) as any as S.Schema<CopySnapshotAndUpdateVolumeRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreateBackupRequest {
  FileSystemId?: string;
  ClientRequestToken?: string;
  Tags?: Tags;
  VolumeId?: string;
}
export const CreateBackupRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(Tags),
    VolumeId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateBackupRequest",
}) as any as S.Schema<CreateBackupRequest>;
export type DnsIps = string[];
export const DnsIps = S.Array(S.String);
export interface SelfManagedActiveDirectoryConfiguration {
  DomainName: string;
  OrganizationalUnitDistinguishedName?: string;
  FileSystemAdministratorsGroup?: string;
  UserName?: string;
  Password?: string | Redacted.Redacted<string>;
  DnsIps: DnsIps;
  DomainJoinServiceAccountSecret?: string;
}
export const SelfManagedActiveDirectoryConfiguration = S.suspend(() =>
  S.Struct({
    DomainName: S.String,
    OrganizationalUnitDistinguishedName: S.optional(S.String),
    FileSystemAdministratorsGroup: S.optional(S.String),
    UserName: S.optional(S.String),
    Password: S.optional(SensitiveString),
    DnsIps: DnsIps,
    DomainJoinServiceAccountSecret: S.optional(S.String),
  }),
).annotations({
  identifier: "SelfManagedActiveDirectoryConfiguration",
}) as any as S.Schema<SelfManagedActiveDirectoryConfiguration>;
export interface WindowsAuditLogCreateConfiguration {
  FileAccessAuditLogLevel: string;
  FileShareAccessAuditLogLevel: string;
  AuditLogDestination?: string;
}
export const WindowsAuditLogCreateConfiguration = S.suspend(() =>
  S.Struct({
    FileAccessAuditLogLevel: S.String,
    FileShareAccessAuditLogLevel: S.String,
    AuditLogDestination: S.optional(S.String),
  }),
).annotations({
  identifier: "WindowsAuditLogCreateConfiguration",
}) as any as S.Schema<WindowsAuditLogCreateConfiguration>;
export interface DiskIopsConfiguration {
  Mode?: string;
  Iops?: number;
}
export const DiskIopsConfiguration = S.suspend(() =>
  S.Struct({ Mode: S.optional(S.String), Iops: S.optional(S.Number) }),
).annotations({
  identifier: "DiskIopsConfiguration",
}) as any as S.Schema<DiskIopsConfiguration>;
export interface WindowsFsrmConfiguration {
  FsrmServiceEnabled: boolean;
  EventLogDestination?: string;
}
export const WindowsFsrmConfiguration = S.suspend(() =>
  S.Struct({
    FsrmServiceEnabled: S.Boolean,
    EventLogDestination: S.optional(S.String),
  }),
).annotations({
  identifier: "WindowsFsrmConfiguration",
}) as any as S.Schema<WindowsFsrmConfiguration>;
export interface CreateFileSystemWindowsConfiguration {
  ActiveDirectoryId?: string;
  SelfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryConfiguration;
  DeploymentType?: string;
  PreferredSubnetId?: string;
  ThroughputCapacity: number;
  WeeklyMaintenanceStartTime?: string;
  DailyAutomaticBackupStartTime?: string;
  AutomaticBackupRetentionDays?: number;
  CopyTagsToBackups?: boolean;
  Aliases?: AlternateDNSNames;
  AuditLogConfiguration?: WindowsAuditLogCreateConfiguration;
  DiskIopsConfiguration?: DiskIopsConfiguration;
  FsrmConfiguration?: WindowsFsrmConfiguration;
}
export const CreateFileSystemWindowsConfiguration = S.suspend(() =>
  S.Struct({
    ActiveDirectoryId: S.optional(S.String),
    SelfManagedActiveDirectoryConfiguration: S.optional(
      SelfManagedActiveDirectoryConfiguration,
    ),
    DeploymentType: S.optional(S.String),
    PreferredSubnetId: S.optional(S.String),
    ThroughputCapacity: S.Number,
    WeeklyMaintenanceStartTime: S.optional(S.String),
    DailyAutomaticBackupStartTime: S.optional(S.String),
    AutomaticBackupRetentionDays: S.optional(S.Number),
    CopyTagsToBackups: S.optional(S.Boolean),
    Aliases: S.optional(AlternateDNSNames),
    AuditLogConfiguration: S.optional(WindowsAuditLogCreateConfiguration),
    DiskIopsConfiguration: S.optional(DiskIopsConfiguration),
    FsrmConfiguration: S.optional(WindowsFsrmConfiguration),
  }),
).annotations({
  identifier: "CreateFileSystemWindowsConfiguration",
}) as any as S.Schema<CreateFileSystemWindowsConfiguration>;
export interface LustreLogCreateConfiguration {
  Level: string;
  Destination?: string;
}
export const LustreLogCreateConfiguration = S.suspend(() =>
  S.Struct({ Level: S.String, Destination: S.optional(S.String) }),
).annotations({
  identifier: "LustreLogCreateConfiguration",
}) as any as S.Schema<LustreLogCreateConfiguration>;
export type LustreNoSquashNids = string[];
export const LustreNoSquashNids = S.Array(S.String);
export interface LustreRootSquashConfiguration {
  RootSquash?: string;
  NoSquashNids?: LustreNoSquashNids;
}
export const LustreRootSquashConfiguration = S.suspend(() =>
  S.Struct({
    RootSquash: S.optional(S.String),
    NoSquashNids: S.optional(LustreNoSquashNids),
  }),
).annotations({
  identifier: "LustreRootSquashConfiguration",
}) as any as S.Schema<LustreRootSquashConfiguration>;
export interface CreateFileSystemLustreMetadataConfiguration {
  Iops?: number;
  Mode: string;
}
export const CreateFileSystemLustreMetadataConfiguration = S.suspend(() =>
  S.Struct({ Iops: S.optional(S.Number), Mode: S.String }),
).annotations({
  identifier: "CreateFileSystemLustreMetadataConfiguration",
}) as any as S.Schema<CreateFileSystemLustreMetadataConfiguration>;
export interface LustreReadCacheConfiguration {
  SizingMode?: string;
  SizeGiB?: number;
}
export const LustreReadCacheConfiguration = S.suspend(() =>
  S.Struct({ SizingMode: S.optional(S.String), SizeGiB: S.optional(S.Number) }),
).annotations({
  identifier: "LustreReadCacheConfiguration",
}) as any as S.Schema<LustreReadCacheConfiguration>;
export interface CreateFileSystemLustreConfiguration {
  WeeklyMaintenanceStartTime?: string;
  ImportPath?: string;
  ExportPath?: string;
  ImportedFileChunkSize?: number;
  DeploymentType?: string;
  AutoImportPolicy?: string;
  PerUnitStorageThroughput?: number;
  DailyAutomaticBackupStartTime?: string;
  AutomaticBackupRetentionDays?: number;
  CopyTagsToBackups?: boolean;
  DriveCacheType?: string;
  DataCompressionType?: string;
  EfaEnabled?: boolean;
  LogConfiguration?: LustreLogCreateConfiguration;
  RootSquashConfiguration?: LustreRootSquashConfiguration;
  MetadataConfiguration?: CreateFileSystemLustreMetadataConfiguration;
  ThroughputCapacity?: number;
  DataReadCacheConfiguration?: LustreReadCacheConfiguration;
}
export const CreateFileSystemLustreConfiguration = S.suspend(() =>
  S.Struct({
    WeeklyMaintenanceStartTime: S.optional(S.String),
    ImportPath: S.optional(S.String),
    ExportPath: S.optional(S.String),
    ImportedFileChunkSize: S.optional(S.Number),
    DeploymentType: S.optional(S.String),
    AutoImportPolicy: S.optional(S.String),
    PerUnitStorageThroughput: S.optional(S.Number),
    DailyAutomaticBackupStartTime: S.optional(S.String),
    AutomaticBackupRetentionDays: S.optional(S.Number),
    CopyTagsToBackups: S.optional(S.Boolean),
    DriveCacheType: S.optional(S.String),
    DataCompressionType: S.optional(S.String),
    EfaEnabled: S.optional(S.Boolean),
    LogConfiguration: S.optional(LustreLogCreateConfiguration),
    RootSquashConfiguration: S.optional(LustreRootSquashConfiguration),
    MetadataConfiguration: S.optional(
      CreateFileSystemLustreMetadataConfiguration,
    ),
    ThroughputCapacity: S.optional(S.Number),
    DataReadCacheConfiguration: S.optional(LustreReadCacheConfiguration),
  }),
).annotations({
  identifier: "CreateFileSystemLustreConfiguration",
}) as any as S.Schema<CreateFileSystemLustreConfiguration>;
export type OpenZFSNfsExportOptions = string[];
export const OpenZFSNfsExportOptions = S.Array(S.String);
export interface OpenZFSClientConfiguration {
  Clients: string;
  Options: OpenZFSNfsExportOptions;
}
export const OpenZFSClientConfiguration = S.suspend(() =>
  S.Struct({ Clients: S.String, Options: OpenZFSNfsExportOptions }),
).annotations({
  identifier: "OpenZFSClientConfiguration",
}) as any as S.Schema<OpenZFSClientConfiguration>;
export type OpenZFSClientConfigurations = OpenZFSClientConfiguration[];
export const OpenZFSClientConfigurations = S.Array(OpenZFSClientConfiguration);
export interface OpenZFSNfsExport {
  ClientConfigurations: OpenZFSClientConfigurations;
}
export const OpenZFSNfsExport = S.suspend(() =>
  S.Struct({ ClientConfigurations: OpenZFSClientConfigurations }),
).annotations({
  identifier: "OpenZFSNfsExport",
}) as any as S.Schema<OpenZFSNfsExport>;
export type OpenZFSNfsExports = OpenZFSNfsExport[];
export const OpenZFSNfsExports = S.Array(OpenZFSNfsExport);
export interface OpenZFSUserOrGroupQuota {
  Type: string;
  Id: number;
  StorageCapacityQuotaGiB: number;
}
export const OpenZFSUserOrGroupQuota = S.suspend(() =>
  S.Struct({ Type: S.String, Id: S.Number, StorageCapacityQuotaGiB: S.Number }),
).annotations({
  identifier: "OpenZFSUserOrGroupQuota",
}) as any as S.Schema<OpenZFSUserOrGroupQuota>;
export type OpenZFSUserAndGroupQuotas = OpenZFSUserOrGroupQuota[];
export const OpenZFSUserAndGroupQuotas = S.Array(OpenZFSUserOrGroupQuota);
export interface OpenZFSCreateRootVolumeConfiguration {
  RecordSizeKiB?: number;
  DataCompressionType?: string;
  NfsExports?: OpenZFSNfsExports;
  UserAndGroupQuotas?: OpenZFSUserAndGroupQuotas;
  CopyTagsToSnapshots?: boolean;
  ReadOnly?: boolean;
}
export const OpenZFSCreateRootVolumeConfiguration = S.suspend(() =>
  S.Struct({
    RecordSizeKiB: S.optional(S.Number),
    DataCompressionType: S.optional(S.String),
    NfsExports: S.optional(OpenZFSNfsExports),
    UserAndGroupQuotas: S.optional(OpenZFSUserAndGroupQuotas),
    CopyTagsToSnapshots: S.optional(S.Boolean),
    ReadOnly: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "OpenZFSCreateRootVolumeConfiguration",
}) as any as S.Schema<OpenZFSCreateRootVolumeConfiguration>;
export type RouteTableIds = string[];
export const RouteTableIds = S.Array(S.String);
export interface OpenZFSReadCacheConfiguration {
  SizingMode?: string;
  SizeGiB?: number;
}
export const OpenZFSReadCacheConfiguration = S.suspend(() =>
  S.Struct({ SizingMode: S.optional(S.String), SizeGiB: S.optional(S.Number) }),
).annotations({
  identifier: "OpenZFSReadCacheConfiguration",
}) as any as S.Schema<OpenZFSReadCacheConfiguration>;
export interface CreateFileSystemOpenZFSConfiguration {
  AutomaticBackupRetentionDays?: number;
  CopyTagsToBackups?: boolean;
  CopyTagsToVolumes?: boolean;
  DailyAutomaticBackupStartTime?: string;
  DeploymentType: string;
  ThroughputCapacity: number;
  WeeklyMaintenanceStartTime?: string;
  DiskIopsConfiguration?: DiskIopsConfiguration;
  RootVolumeConfiguration?: OpenZFSCreateRootVolumeConfiguration;
  PreferredSubnetId?: string;
  EndpointIpAddressRange?: string;
  EndpointIpv6AddressRange?: string;
  RouteTableIds?: RouteTableIds;
  ReadCacheConfiguration?: OpenZFSReadCacheConfiguration;
}
export const CreateFileSystemOpenZFSConfiguration = S.suspend(() =>
  S.Struct({
    AutomaticBackupRetentionDays: S.optional(S.Number),
    CopyTagsToBackups: S.optional(S.Boolean),
    CopyTagsToVolumes: S.optional(S.Boolean),
    DailyAutomaticBackupStartTime: S.optional(S.String),
    DeploymentType: S.String,
    ThroughputCapacity: S.Number,
    WeeklyMaintenanceStartTime: S.optional(S.String),
    DiskIopsConfiguration: S.optional(DiskIopsConfiguration),
    RootVolumeConfiguration: S.optional(OpenZFSCreateRootVolumeConfiguration),
    PreferredSubnetId: S.optional(S.String),
    EndpointIpAddressRange: S.optional(S.String),
    EndpointIpv6AddressRange: S.optional(S.String),
    RouteTableIds: S.optional(RouteTableIds),
    ReadCacheConfiguration: S.optional(OpenZFSReadCacheConfiguration),
  }),
).annotations({
  identifier: "CreateFileSystemOpenZFSConfiguration",
}) as any as S.Schema<CreateFileSystemOpenZFSConfiguration>;
export interface CreateFileSystemFromBackupRequest {
  BackupId: string;
  ClientRequestToken?: string;
  SubnetIds: SubnetIds;
  SecurityGroupIds?: SecurityGroupIds;
  Tags?: Tags;
  WindowsConfiguration?: CreateFileSystemWindowsConfiguration;
  LustreConfiguration?: CreateFileSystemLustreConfiguration;
  StorageType?: string;
  KmsKeyId?: string;
  FileSystemTypeVersion?: string;
  OpenZFSConfiguration?: CreateFileSystemOpenZFSConfiguration;
  StorageCapacity?: number;
  NetworkType?: string;
}
export const CreateFileSystemFromBackupRequest = S.suspend(() =>
  S.Struct({
    BackupId: S.String,
    ClientRequestToken: S.optional(S.String),
    SubnetIds: SubnetIds,
    SecurityGroupIds: S.optional(SecurityGroupIds),
    Tags: S.optional(Tags),
    WindowsConfiguration: S.optional(CreateFileSystemWindowsConfiguration),
    LustreConfiguration: S.optional(CreateFileSystemLustreConfiguration),
    StorageType: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    FileSystemTypeVersion: S.optional(S.String),
    OpenZFSConfiguration: S.optional(CreateFileSystemOpenZFSConfiguration),
    StorageCapacity: S.optional(S.Number),
    NetworkType: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFileSystemFromBackupRequest",
}) as any as S.Schema<CreateFileSystemFromBackupRequest>;
export interface CreateSnapshotRequest {
  ClientRequestToken?: string;
  Name: string;
  VolumeId: string;
  Tags?: Tags;
}
export const CreateSnapshotRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    Name: S.String,
    VolumeId: S.String,
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSnapshotRequest",
}) as any as S.Schema<CreateSnapshotRequest>;
export interface TieringPolicy {
  CoolingPeriod?: number;
  Name?: string;
}
export const TieringPolicy = S.suspend(() =>
  S.Struct({ CoolingPeriod: S.optional(S.Number), Name: S.optional(S.String) }),
).annotations({
  identifier: "TieringPolicy",
}) as any as S.Schema<TieringPolicy>;
export interface AutocommitPeriod {
  Type: string;
  Value?: number;
}
export const AutocommitPeriod = S.suspend(() =>
  S.Struct({ Type: S.String, Value: S.optional(S.Number) }),
).annotations({
  identifier: "AutocommitPeriod",
}) as any as S.Schema<AutocommitPeriod>;
export interface RetentionPeriod {
  Type: string;
  Value?: number;
}
export const RetentionPeriod = S.suspend(() =>
  S.Struct({ Type: S.String, Value: S.optional(S.Number) }),
).annotations({
  identifier: "RetentionPeriod",
}) as any as S.Schema<RetentionPeriod>;
export interface SnaplockRetentionPeriod {
  DefaultRetention: RetentionPeriod;
  MinimumRetention: RetentionPeriod;
  MaximumRetention: RetentionPeriod;
}
export const SnaplockRetentionPeriod = S.suspend(() =>
  S.Struct({
    DefaultRetention: RetentionPeriod,
    MinimumRetention: RetentionPeriod,
    MaximumRetention: RetentionPeriod,
  }),
).annotations({
  identifier: "SnaplockRetentionPeriod",
}) as any as S.Schema<SnaplockRetentionPeriod>;
export interface CreateSnaplockConfiguration {
  AuditLogVolume?: boolean;
  AutocommitPeriod?: AutocommitPeriod;
  PrivilegedDelete?: string;
  RetentionPeriod?: SnaplockRetentionPeriod;
  SnaplockType: string;
  VolumeAppendModeEnabled?: boolean;
}
export const CreateSnaplockConfiguration = S.suspend(() =>
  S.Struct({
    AuditLogVolume: S.optional(S.Boolean),
    AutocommitPeriod: S.optional(AutocommitPeriod),
    PrivilegedDelete: S.optional(S.String),
    RetentionPeriod: S.optional(SnaplockRetentionPeriod),
    SnaplockType: S.String,
    VolumeAppendModeEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CreateSnaplockConfiguration",
}) as any as S.Schema<CreateSnaplockConfiguration>;
export type Aggregates = string[];
export const Aggregates = S.Array(S.String);
export interface CreateAggregateConfiguration {
  Aggregates?: Aggregates;
  ConstituentsPerAggregate?: number;
}
export const CreateAggregateConfiguration = S.suspend(() =>
  S.Struct({
    Aggregates: S.optional(Aggregates),
    ConstituentsPerAggregate: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateAggregateConfiguration",
}) as any as S.Schema<CreateAggregateConfiguration>;
export interface CreateOntapVolumeConfiguration {
  JunctionPath?: string;
  SecurityStyle?: string;
  SizeInMegabytes?: number;
  StorageEfficiencyEnabled?: boolean;
  StorageVirtualMachineId: string;
  TieringPolicy?: TieringPolicy;
  OntapVolumeType?: string;
  SnapshotPolicy?: string;
  CopyTagsToBackups?: boolean;
  SnaplockConfiguration?: CreateSnaplockConfiguration;
  VolumeStyle?: string;
  AggregateConfiguration?: CreateAggregateConfiguration;
  SizeInBytes?: number;
}
export const CreateOntapVolumeConfiguration = S.suspend(() =>
  S.Struct({
    JunctionPath: S.optional(S.String),
    SecurityStyle: S.optional(S.String),
    SizeInMegabytes: S.optional(S.Number),
    StorageEfficiencyEnabled: S.optional(S.Boolean),
    StorageVirtualMachineId: S.String,
    TieringPolicy: S.optional(TieringPolicy),
    OntapVolumeType: S.optional(S.String),
    SnapshotPolicy: S.optional(S.String),
    CopyTagsToBackups: S.optional(S.Boolean),
    SnaplockConfiguration: S.optional(CreateSnaplockConfiguration),
    VolumeStyle: S.optional(S.String),
    AggregateConfiguration: S.optional(CreateAggregateConfiguration),
    SizeInBytes: S.optional(S.Number),
  }),
).annotations({
  identifier: "CreateOntapVolumeConfiguration",
}) as any as S.Schema<CreateOntapVolumeConfiguration>;
export interface CreateVolumeFromBackupRequest {
  BackupId: string;
  ClientRequestToken?: string;
  Name: string;
  OntapConfiguration?: CreateOntapVolumeConfiguration;
  Tags?: Tags;
}
export const CreateVolumeFromBackupRequest = S.suspend(() =>
  S.Struct({
    BackupId: S.String,
    ClientRequestToken: S.optional(S.String),
    Name: S.String,
    OntapConfiguration: S.optional(CreateOntapVolumeConfiguration),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateVolumeFromBackupRequest",
}) as any as S.Schema<CreateVolumeFromBackupRequest>;
export interface DeleteBackupRequest {
  BackupId: string;
  ClientRequestToken?: string;
}
export const DeleteBackupRequest = S.suspend(() =>
  S.Struct({
    BackupId: S.String,
    ClientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteBackupRequest",
}) as any as S.Schema<DeleteBackupRequest>;
export interface DeleteDataRepositoryAssociationRequest {
  AssociationId: string;
  ClientRequestToken?: string;
  DeleteDataInFileSystem?: boolean;
}
export const DeleteDataRepositoryAssociationRequest = S.suspend(() =>
  S.Struct({
    AssociationId: S.String,
    ClientRequestToken: S.optional(S.String),
    DeleteDataInFileSystem: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDataRepositoryAssociationRequest",
}) as any as S.Schema<DeleteDataRepositoryAssociationRequest>;
export interface DeleteFileCacheRequest {
  FileCacheId: string;
  ClientRequestToken?: string;
}
export const DeleteFileCacheRequest = S.suspend(() =>
  S.Struct({
    FileCacheId: S.String,
    ClientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFileCacheRequest",
}) as any as S.Schema<DeleteFileCacheRequest>;
export interface DeleteSnapshotRequest {
  ClientRequestToken?: string;
  SnapshotId: string;
}
export const DeleteSnapshotRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    SnapshotId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSnapshotRequest",
}) as any as S.Schema<DeleteSnapshotRequest>;
export interface DeleteStorageVirtualMachineRequest {
  ClientRequestToken?: string;
  StorageVirtualMachineId: string;
}
export const DeleteStorageVirtualMachineRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    StorageVirtualMachineId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteStorageVirtualMachineRequest",
}) as any as S.Schema<DeleteStorageVirtualMachineRequest>;
export type FilterValues = string[];
export const FilterValues = S.Array(S.String);
export interface Filter {
  Name?: string;
  Values?: FilterValues;
}
export const Filter = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Values: S.optional(FilterValues) }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(Filter);
export interface DescribeDataRepositoryAssociationsRequest {
  AssociationIds?: DataRepositoryAssociationIds;
  Filters?: Filters;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeDataRepositoryAssociationsRequest = S.suspend(() =>
  S.Struct({
    AssociationIds: S.optional(DataRepositoryAssociationIds),
    Filters: S.optional(Filters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDataRepositoryAssociationsRequest",
}) as any as S.Schema<DescribeDataRepositoryAssociationsRequest>;
export interface DescribeFileCachesRequest {
  FileCacheIds?: FileCacheIds;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeFileCachesRequest = S.suspend(() =>
  S.Struct({
    FileCacheIds: S.optional(FileCacheIds),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFileCachesRequest",
}) as any as S.Schema<DescribeFileCachesRequest>;
export interface DescribeFileSystemAliasesRequest {
  ClientRequestToken?: string;
  FileSystemId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeFileSystemAliasesRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    FileSystemId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFileSystemAliasesRequest",
}) as any as S.Schema<DescribeFileSystemAliasesRequest>;
export interface DescribeFileSystemsRequest {
  FileSystemIds?: FileSystemIds;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeFileSystemsRequest = S.suspend(() =>
  S.Struct({
    FileSystemIds: S.optional(FileSystemIds),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeFileSystemsRequest",
}) as any as S.Schema<DescribeFileSystemsRequest>;
export interface DescribeSharedVpcConfigurationResponse {
  EnableFsxRouteTableUpdatesFromParticipantAccounts?: string;
}
export const DescribeSharedVpcConfigurationResponse = S.suspend(() =>
  S.Struct({
    EnableFsxRouteTableUpdatesFromParticipantAccounts: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSharedVpcConfigurationResponse",
}) as any as S.Schema<DescribeSharedVpcConfigurationResponse>;
export interface DetachAndDeleteS3AccessPointRequest {
  ClientRequestToken?: string;
  Name: string;
}
export const DetachAndDeleteS3AccessPointRequest = S.suspend(() =>
  S.Struct({ ClientRequestToken: S.optional(S.String), Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DetachAndDeleteS3AccessPointRequest",
}) as any as S.Schema<DetachAndDeleteS3AccessPointRequest>;
export interface DisassociateFileSystemAliasesRequest {
  ClientRequestToken?: string;
  FileSystemId: string;
  Aliases: AlternateDNSNames;
}
export const DisassociateFileSystemAliasesRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    FileSystemId: S.String,
    Aliases: AlternateDNSNames,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateFileSystemAliasesRequest",
}) as any as S.Schema<DisassociateFileSystemAliasesRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceARN: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ReleaseFileSystemNfsV3LocksRequest {
  FileSystemId: string;
  ClientRequestToken?: string;
}
export const ReleaseFileSystemNfsV3LocksRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String,
    ClientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ReleaseFileSystemNfsV3LocksRequest",
}) as any as S.Schema<ReleaseFileSystemNfsV3LocksRequest>;
export interface RestoreVolumeFromSnapshotRequest {
  ClientRequestToken?: string;
  VolumeId: string;
  SnapshotId: string;
  Options?: RestoreOpenZFSVolumeOptions;
}
export const RestoreVolumeFromSnapshotRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    VolumeId: S.String,
    SnapshotId: S.String,
    Options: S.optional(RestoreOpenZFSVolumeOptions),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RestoreVolumeFromSnapshotRequest",
}) as any as S.Schema<RestoreVolumeFromSnapshotRequest>;
export interface StartMisconfiguredStateRecoveryRequest {
  ClientRequestToken?: string;
  FileSystemId: string;
}
export const StartMisconfiguredStateRecoveryRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    FileSystemId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartMisconfiguredStateRecoveryRequest",
}) as any as S.Schema<StartMisconfiguredStateRecoveryRequest>;
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: Tags }).pipe(
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
  TagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeys }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type EventTypes = string[];
export const EventTypes = S.Array(S.String);
export interface AutoImportPolicy {
  Events?: EventTypes;
}
export const AutoImportPolicy = S.suspend(() =>
  S.Struct({ Events: S.optional(EventTypes) }),
).annotations({
  identifier: "AutoImportPolicy",
}) as any as S.Schema<AutoImportPolicy>;
export interface AutoExportPolicy {
  Events?: EventTypes;
}
export const AutoExportPolicy = S.suspend(() =>
  S.Struct({ Events: S.optional(EventTypes) }),
).annotations({
  identifier: "AutoExportPolicy",
}) as any as S.Schema<AutoExportPolicy>;
export interface S3DataRepositoryConfiguration {
  AutoImportPolicy?: AutoImportPolicy;
  AutoExportPolicy?: AutoExportPolicy;
}
export const S3DataRepositoryConfiguration = S.suspend(() =>
  S.Struct({
    AutoImportPolicy: S.optional(AutoImportPolicy),
    AutoExportPolicy: S.optional(AutoExportPolicy),
  }),
).annotations({
  identifier: "S3DataRepositoryConfiguration",
}) as any as S.Schema<S3DataRepositoryConfiguration>;
export interface UpdateDataRepositoryAssociationRequest {
  AssociationId: string;
  ClientRequestToken?: string;
  ImportedFileChunkSize?: number;
  S3?: S3DataRepositoryConfiguration;
}
export const UpdateDataRepositoryAssociationRequest = S.suspend(() =>
  S.Struct({
    AssociationId: S.String,
    ClientRequestToken: S.optional(S.String),
    ImportedFileChunkSize: S.optional(S.Number),
    S3: S.optional(S3DataRepositoryConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDataRepositoryAssociationRequest",
}) as any as S.Schema<UpdateDataRepositoryAssociationRequest>;
export interface UpdateSharedVpcConfigurationRequest {
  EnableFsxRouteTableUpdatesFromParticipantAccounts?: string;
  ClientRequestToken?: string;
}
export const UpdateSharedVpcConfigurationRequest = S.suspend(() =>
  S.Struct({
    EnableFsxRouteTableUpdatesFromParticipantAccounts: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSharedVpcConfigurationRequest",
}) as any as S.Schema<UpdateSharedVpcConfigurationRequest>;
export interface UpdateSnapshotRequest {
  ClientRequestToken?: string;
  Name: string;
  SnapshotId: string;
}
export const UpdateSnapshotRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    Name: S.String,
    SnapshotId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSnapshotRequest",
}) as any as S.Schema<UpdateSnapshotRequest>;
export type SubDirectoriesPaths = string[];
export const SubDirectoriesPaths = S.Array(S.String);
export type DeleteFileSystemOpenZFSOptions = string[];
export const DeleteFileSystemOpenZFSOptions = S.Array(S.String);
export type DeleteOpenZFSVolumeOptions = string[];
export const DeleteOpenZFSVolumeOptions = S.Array(S.String);
export type DataRepositoryTaskFilterValues = string[];
export const DataRepositoryTaskFilterValues = S.Array(S.String);
export type S3AccessPointAttachmentsFilterValues = string[];
export const S3AccessPointAttachmentsFilterValues = S.Array(S.String);
export type SnapshotFilterValues = string[];
export const SnapshotFilterValues = S.Array(S.String);
export type StorageVirtualMachineFilterValues = string[];
export const StorageVirtualMachineFilterValues = S.Array(S.String);
export type VolumeFilterValues = string[];
export const VolumeFilterValues = S.Array(S.String);
export interface CompletionReport {
  Enabled: boolean;
  Path?: string;
  Format?: string;
  Scope?: string;
}
export const CompletionReport = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    Path: S.optional(S.String),
    Format: S.optional(S.String),
    Scope: S.optional(S.String),
  }),
).annotations({
  identifier: "CompletionReport",
}) as any as S.Schema<CompletionReport>;
export interface CreateFileSystemOntapConfiguration {
  AutomaticBackupRetentionDays?: number;
  DailyAutomaticBackupStartTime?: string;
  DeploymentType: string;
  EndpointIpAddressRange?: string;
  FsxAdminPassword?: string | Redacted.Redacted<string>;
  DiskIopsConfiguration?: DiskIopsConfiguration;
  PreferredSubnetId?: string;
  RouteTableIds?: RouteTableIds;
  ThroughputCapacity?: number;
  WeeklyMaintenanceStartTime?: string;
  HAPairs?: number;
  ThroughputCapacityPerHAPair?: number;
  EndpointIpv6AddressRange?: string;
}
export const CreateFileSystemOntapConfiguration = S.suspend(() =>
  S.Struct({
    AutomaticBackupRetentionDays: S.optional(S.Number),
    DailyAutomaticBackupStartTime: S.optional(S.String),
    DeploymentType: S.String,
    EndpointIpAddressRange: S.optional(S.String),
    FsxAdminPassword: S.optional(SensitiveString),
    DiskIopsConfiguration: S.optional(DiskIopsConfiguration),
    PreferredSubnetId: S.optional(S.String),
    RouteTableIds: S.optional(RouteTableIds),
    ThroughputCapacity: S.optional(S.Number),
    WeeklyMaintenanceStartTime: S.optional(S.String),
    HAPairs: S.optional(S.Number),
    ThroughputCapacityPerHAPair: S.optional(S.Number),
    EndpointIpv6AddressRange: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateFileSystemOntapConfiguration",
}) as any as S.Schema<CreateFileSystemOntapConfiguration>;
export interface CreateSvmActiveDirectoryConfiguration {
  NetBiosName: string;
  SelfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryConfiguration;
}
export const CreateSvmActiveDirectoryConfiguration = S.suspend(() =>
  S.Struct({
    NetBiosName: S.String,
    SelfManagedActiveDirectoryConfiguration: S.optional(
      SelfManagedActiveDirectoryConfiguration,
    ),
  }),
).annotations({
  identifier: "CreateSvmActiveDirectoryConfiguration",
}) as any as S.Schema<CreateSvmActiveDirectoryConfiguration>;
export interface DeleteFileSystemWindowsConfiguration {
  SkipFinalBackup?: boolean;
  FinalBackupTags?: Tags;
}
export const DeleteFileSystemWindowsConfiguration = S.suspend(() =>
  S.Struct({
    SkipFinalBackup: S.optional(S.Boolean),
    FinalBackupTags: S.optional(Tags),
  }),
).annotations({
  identifier: "DeleteFileSystemWindowsConfiguration",
}) as any as S.Schema<DeleteFileSystemWindowsConfiguration>;
export interface DeleteFileSystemLustreConfiguration {
  SkipFinalBackup?: boolean;
  FinalBackupTags?: Tags;
}
export const DeleteFileSystemLustreConfiguration = S.suspend(() =>
  S.Struct({
    SkipFinalBackup: S.optional(S.Boolean),
    FinalBackupTags: S.optional(Tags),
  }),
).annotations({
  identifier: "DeleteFileSystemLustreConfiguration",
}) as any as S.Schema<DeleteFileSystemLustreConfiguration>;
export interface DeleteFileSystemOpenZFSConfiguration {
  SkipFinalBackup?: boolean;
  FinalBackupTags?: Tags;
  Options?: DeleteFileSystemOpenZFSOptions;
}
export const DeleteFileSystemOpenZFSConfiguration = S.suspend(() =>
  S.Struct({
    SkipFinalBackup: S.optional(S.Boolean),
    FinalBackupTags: S.optional(Tags),
    Options: S.optional(DeleteFileSystemOpenZFSOptions),
  }),
).annotations({
  identifier: "DeleteFileSystemOpenZFSConfiguration",
}) as any as S.Schema<DeleteFileSystemOpenZFSConfiguration>;
export interface DeleteVolumeOntapConfiguration {
  SkipFinalBackup?: boolean;
  FinalBackupTags?: Tags;
  BypassSnaplockEnterpriseRetention?: boolean;
}
export const DeleteVolumeOntapConfiguration = S.suspend(() =>
  S.Struct({
    SkipFinalBackup: S.optional(S.Boolean),
    FinalBackupTags: S.optional(Tags),
    BypassSnaplockEnterpriseRetention: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DeleteVolumeOntapConfiguration",
}) as any as S.Schema<DeleteVolumeOntapConfiguration>;
export interface DeleteVolumeOpenZFSConfiguration {
  Options?: DeleteOpenZFSVolumeOptions;
}
export const DeleteVolumeOpenZFSConfiguration = S.suspend(() =>
  S.Struct({ Options: S.optional(DeleteOpenZFSVolumeOptions) }),
).annotations({
  identifier: "DeleteVolumeOpenZFSConfiguration",
}) as any as S.Schema<DeleteVolumeOpenZFSConfiguration>;
export interface DataRepositoryTaskFilter {
  Name?: string;
  Values?: DataRepositoryTaskFilterValues;
}
export const DataRepositoryTaskFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Values: S.optional(DataRepositoryTaskFilterValues),
  }),
).annotations({
  identifier: "DataRepositoryTaskFilter",
}) as any as S.Schema<DataRepositoryTaskFilter>;
export type DataRepositoryTaskFilters = DataRepositoryTaskFilter[];
export const DataRepositoryTaskFilters = S.Array(DataRepositoryTaskFilter);
export interface FileSystemFailureDetails {
  Message?: string;
}
export const FileSystemFailureDetails = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "FileSystemFailureDetails",
}) as any as S.Schema<FileSystemFailureDetails>;
export type NetworkInterfaceIds = string[];
export const NetworkInterfaceIds = S.Array(S.String);
export interface SelfManagedActiveDirectoryAttributes {
  DomainName?: string;
  OrganizationalUnitDistinguishedName?: string;
  FileSystemAdministratorsGroup?: string;
  UserName?: string;
  DnsIps?: DnsIps;
  DomainJoinServiceAccountSecret?: string;
}
export const SelfManagedActiveDirectoryAttributes = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    OrganizationalUnitDistinguishedName: S.optional(S.String),
    FileSystemAdministratorsGroup: S.optional(S.String),
    UserName: S.optional(S.String),
    DnsIps: S.optional(DnsIps),
    DomainJoinServiceAccountSecret: S.optional(S.String),
  }),
).annotations({
  identifier: "SelfManagedActiveDirectoryAttributes",
}) as any as S.Schema<SelfManagedActiveDirectoryAttributes>;
export type FileSystemMaintenanceOperations = string[];
export const FileSystemMaintenanceOperations = S.Array(S.String);
export interface Alias {
  Name?: string;
  Lifecycle?: string;
}
export const Alias = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Lifecycle: S.optional(S.String) }),
).annotations({ identifier: "Alias" }) as any as S.Schema<Alias>;
export type Aliases = Alias[];
export const Aliases = S.Array(Alias);
export interface WindowsAuditLogConfiguration {
  FileAccessAuditLogLevel: string;
  FileShareAccessAuditLogLevel: string;
  AuditLogDestination?: string;
}
export const WindowsAuditLogConfiguration = S.suspend(() =>
  S.Struct({
    FileAccessAuditLogLevel: S.String,
    FileShareAccessAuditLogLevel: S.String,
    AuditLogDestination: S.optional(S.String),
  }),
).annotations({
  identifier: "WindowsAuditLogConfiguration",
}) as any as S.Schema<WindowsAuditLogConfiguration>;
export interface WindowsFileSystemConfiguration {
  ActiveDirectoryId?: string;
  SelfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryAttributes;
  DeploymentType?: string;
  RemoteAdministrationEndpoint?: string;
  PreferredSubnetId?: string;
  PreferredFileServerIp?: string;
  ThroughputCapacity?: number;
  MaintenanceOperationsInProgress?: FileSystemMaintenanceOperations;
  WeeklyMaintenanceStartTime?: string;
  DailyAutomaticBackupStartTime?: string;
  AutomaticBackupRetentionDays?: number;
  CopyTagsToBackups?: boolean;
  Aliases?: Aliases;
  AuditLogConfiguration?: WindowsAuditLogConfiguration;
  DiskIopsConfiguration?: DiskIopsConfiguration;
  PreferredFileServerIpv6?: string;
  FsrmConfiguration?: WindowsFsrmConfiguration;
}
export const WindowsFileSystemConfiguration = S.suspend(() =>
  S.Struct({
    ActiveDirectoryId: S.optional(S.String),
    SelfManagedActiveDirectoryConfiguration: S.optional(
      SelfManagedActiveDirectoryAttributes,
    ),
    DeploymentType: S.optional(S.String),
    RemoteAdministrationEndpoint: S.optional(S.String),
    PreferredSubnetId: S.optional(S.String),
    PreferredFileServerIp: S.optional(S.String),
    ThroughputCapacity: S.optional(S.Number),
    MaintenanceOperationsInProgress: S.optional(
      FileSystemMaintenanceOperations,
    ),
    WeeklyMaintenanceStartTime: S.optional(S.String),
    DailyAutomaticBackupStartTime: S.optional(S.String),
    AutomaticBackupRetentionDays: S.optional(S.Number),
    CopyTagsToBackups: S.optional(S.Boolean),
    Aliases: S.optional(Aliases),
    AuditLogConfiguration: S.optional(WindowsAuditLogConfiguration),
    DiskIopsConfiguration: S.optional(DiskIopsConfiguration),
    PreferredFileServerIpv6: S.optional(S.String),
    FsrmConfiguration: S.optional(WindowsFsrmConfiguration),
  }),
).annotations({
  identifier: "WindowsFileSystemConfiguration",
}) as any as S.Schema<WindowsFileSystemConfiguration>;
export interface DataRepositoryFailureDetails {
  Message?: string;
}
export const DataRepositoryFailureDetails = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "DataRepositoryFailureDetails",
}) as any as S.Schema<DataRepositoryFailureDetails>;
export interface DataRepositoryConfiguration {
  Lifecycle?: string;
  ImportPath?: string;
  ExportPath?: string;
  ImportedFileChunkSize?: number;
  AutoImportPolicy?: string;
  FailureDetails?: DataRepositoryFailureDetails;
}
export const DataRepositoryConfiguration = S.suspend(() =>
  S.Struct({
    Lifecycle: S.optional(S.String),
    ImportPath: S.optional(S.String),
    ExportPath: S.optional(S.String),
    ImportedFileChunkSize: S.optional(S.Number),
    AutoImportPolicy: S.optional(S.String),
    FailureDetails: S.optional(DataRepositoryFailureDetails),
  }),
).annotations({
  identifier: "DataRepositoryConfiguration",
}) as any as S.Schema<DataRepositoryConfiguration>;
export interface LustreLogConfiguration {
  Level: string;
  Destination?: string;
}
export const LustreLogConfiguration = S.suspend(() =>
  S.Struct({ Level: S.String, Destination: S.optional(S.String) }),
).annotations({
  identifier: "LustreLogConfiguration",
}) as any as S.Schema<LustreLogConfiguration>;
export interface FileSystemLustreMetadataConfiguration {
  Iops?: number;
  Mode: string;
}
export const FileSystemLustreMetadataConfiguration = S.suspend(() =>
  S.Struct({ Iops: S.optional(S.Number), Mode: S.String }),
).annotations({
  identifier: "FileSystemLustreMetadataConfiguration",
}) as any as S.Schema<FileSystemLustreMetadataConfiguration>;
export interface LustreFileSystemConfiguration {
  WeeklyMaintenanceStartTime?: string;
  DataRepositoryConfiguration?: DataRepositoryConfiguration;
  DeploymentType?: string;
  PerUnitStorageThroughput?: number;
  MountName?: string;
  DailyAutomaticBackupStartTime?: string;
  AutomaticBackupRetentionDays?: number;
  CopyTagsToBackups?: boolean;
  DriveCacheType?: string;
  DataCompressionType?: string;
  LogConfiguration?: LustreLogConfiguration;
  RootSquashConfiguration?: LustreRootSquashConfiguration;
  MetadataConfiguration?: FileSystemLustreMetadataConfiguration;
  EfaEnabled?: boolean;
  ThroughputCapacity?: number;
  DataReadCacheConfiguration?: LustreReadCacheConfiguration;
}
export const LustreFileSystemConfiguration = S.suspend(() =>
  S.Struct({
    WeeklyMaintenanceStartTime: S.optional(S.String),
    DataRepositoryConfiguration: S.optional(DataRepositoryConfiguration),
    DeploymentType: S.optional(S.String),
    PerUnitStorageThroughput: S.optional(S.Number),
    MountName: S.optional(S.String),
    DailyAutomaticBackupStartTime: S.optional(S.String),
    AutomaticBackupRetentionDays: S.optional(S.Number),
    CopyTagsToBackups: S.optional(S.Boolean),
    DriveCacheType: S.optional(S.String),
    DataCompressionType: S.optional(S.String),
    LogConfiguration: S.optional(LustreLogConfiguration),
    RootSquashConfiguration: S.optional(LustreRootSquashConfiguration),
    MetadataConfiguration: S.optional(FileSystemLustreMetadataConfiguration),
    EfaEnabled: S.optional(S.Boolean),
    ThroughputCapacity: S.optional(S.Number),
    DataReadCacheConfiguration: S.optional(LustreReadCacheConfiguration),
  }),
).annotations({
  identifier: "LustreFileSystemConfiguration",
}) as any as S.Schema<LustreFileSystemConfiguration>;
export type OntapEndpointIpAddresses = string[];
export const OntapEndpointIpAddresses = S.Array(S.String);
export interface FileSystemEndpoint {
  DNSName?: string;
  IpAddresses?: OntapEndpointIpAddresses;
  Ipv6Addresses?: OntapEndpointIpAddresses;
}
export const FileSystemEndpoint = S.suspend(() =>
  S.Struct({
    DNSName: S.optional(S.String),
    IpAddresses: S.optional(OntapEndpointIpAddresses),
    Ipv6Addresses: S.optional(OntapEndpointIpAddresses),
  }),
).annotations({
  identifier: "FileSystemEndpoint",
}) as any as S.Schema<FileSystemEndpoint>;
export interface FileSystemEndpoints {
  Intercluster?: FileSystemEndpoint;
  Management?: FileSystemEndpoint;
}
export const FileSystemEndpoints = S.suspend(() =>
  S.Struct({
    Intercluster: S.optional(FileSystemEndpoint),
    Management: S.optional(FileSystemEndpoint),
  }),
).annotations({
  identifier: "FileSystemEndpoints",
}) as any as S.Schema<FileSystemEndpoints>;
export interface OntapFileSystemConfiguration {
  AutomaticBackupRetentionDays?: number;
  DailyAutomaticBackupStartTime?: string;
  DeploymentType?: string;
  EndpointIpAddressRange?: string;
  Endpoints?: FileSystemEndpoints;
  DiskIopsConfiguration?: DiskIopsConfiguration;
  PreferredSubnetId?: string;
  RouteTableIds?: RouteTableIds;
  ThroughputCapacity?: number;
  WeeklyMaintenanceStartTime?: string;
  FsxAdminPassword?: string | Redacted.Redacted<string>;
  HAPairs?: number;
  ThroughputCapacityPerHAPair?: number;
  EndpointIpv6AddressRange?: string;
}
export const OntapFileSystemConfiguration = S.suspend(() =>
  S.Struct({
    AutomaticBackupRetentionDays: S.optional(S.Number),
    DailyAutomaticBackupStartTime: S.optional(S.String),
    DeploymentType: S.optional(S.String),
    EndpointIpAddressRange: S.optional(S.String),
    Endpoints: S.optional(FileSystemEndpoints),
    DiskIopsConfiguration: S.optional(DiskIopsConfiguration),
    PreferredSubnetId: S.optional(S.String),
    RouteTableIds: S.optional(RouteTableIds),
    ThroughputCapacity: S.optional(S.Number),
    WeeklyMaintenanceStartTime: S.optional(S.String),
    FsxAdminPassword: S.optional(SensitiveString),
    HAPairs: S.optional(S.Number),
    ThroughputCapacityPerHAPair: S.optional(S.Number),
    EndpointIpv6AddressRange: S.optional(S.String),
  }),
).annotations({
  identifier: "OntapFileSystemConfiguration",
}) as any as S.Schema<OntapFileSystemConfiguration>;
export interface OpenZFSFileSystemConfiguration {
  AutomaticBackupRetentionDays?: number;
  CopyTagsToBackups?: boolean;
  CopyTagsToVolumes?: boolean;
  DailyAutomaticBackupStartTime?: string;
  DeploymentType?: string;
  ThroughputCapacity?: number;
  WeeklyMaintenanceStartTime?: string;
  DiskIopsConfiguration?: DiskIopsConfiguration;
  RootVolumeId?: string;
  PreferredSubnetId?: string;
  EndpointIpAddressRange?: string;
  EndpointIpv6AddressRange?: string;
  RouteTableIds?: RouteTableIds;
  EndpointIpAddress?: string;
  EndpointIpv6Address?: string;
  ReadCacheConfiguration?: OpenZFSReadCacheConfiguration;
}
export const OpenZFSFileSystemConfiguration = S.suspend(() =>
  S.Struct({
    AutomaticBackupRetentionDays: S.optional(S.Number),
    CopyTagsToBackups: S.optional(S.Boolean),
    CopyTagsToVolumes: S.optional(S.Boolean),
    DailyAutomaticBackupStartTime: S.optional(S.String),
    DeploymentType: S.optional(S.String),
    ThroughputCapacity: S.optional(S.Number),
    WeeklyMaintenanceStartTime: S.optional(S.String),
    DiskIopsConfiguration: S.optional(DiskIopsConfiguration),
    RootVolumeId: S.optional(S.String),
    PreferredSubnetId: S.optional(S.String),
    EndpointIpAddressRange: S.optional(S.String),
    EndpointIpv6AddressRange: S.optional(S.String),
    RouteTableIds: S.optional(RouteTableIds),
    EndpointIpAddress: S.optional(S.String),
    EndpointIpv6Address: S.optional(S.String),
    ReadCacheConfiguration: S.optional(OpenZFSReadCacheConfiguration),
  }),
).annotations({
  identifier: "OpenZFSFileSystemConfiguration",
}) as any as S.Schema<OpenZFSFileSystemConfiguration>;
export interface FileSystem {
  OwnerId?: string;
  CreationTime?: Date;
  FileSystemId?: string;
  FileSystemType?: string;
  Lifecycle?: string;
  FailureDetails?: FileSystemFailureDetails;
  StorageCapacity?: number;
  StorageType?: string;
  VpcId?: string;
  SubnetIds?: SubnetIds;
  NetworkInterfaceIds?: NetworkInterfaceIds;
  DNSName?: string;
  KmsKeyId?: string;
  ResourceARN?: string;
  Tags?: Tags;
  WindowsConfiguration?: WindowsFileSystemConfiguration;
  LustreConfiguration?: LustreFileSystemConfiguration;
  AdministrativeActions?: AdministrativeActions;
  OntapConfiguration?: OntapFileSystemConfiguration;
  FileSystemTypeVersion?: string;
  OpenZFSConfiguration?: OpenZFSFileSystemConfiguration;
  NetworkType?: string;
}
export const FileSystem = S.suspend(() =>
  S.Struct({
    OwnerId: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FileSystemId: S.optional(S.String),
    FileSystemType: S.optional(S.String),
    Lifecycle: S.optional(S.String),
    FailureDetails: S.optional(FileSystemFailureDetails),
    StorageCapacity: S.optional(S.Number),
    StorageType: S.optional(S.String),
    VpcId: S.optional(S.String),
    SubnetIds: S.optional(SubnetIds),
    NetworkInterfaceIds: S.optional(NetworkInterfaceIds),
    DNSName: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    ResourceARN: S.optional(S.String),
    Tags: S.optional(Tags),
    WindowsConfiguration: S.optional(WindowsFileSystemConfiguration),
    LustreConfiguration: S.optional(LustreFileSystemConfiguration),
    AdministrativeActions: S.optional(
      S.suspend(() => AdministrativeActions).annotations({
        identifier: "AdministrativeActions",
      }),
    ),
    OntapConfiguration: S.optional(OntapFileSystemConfiguration),
    FileSystemTypeVersion: S.optional(S.String),
    OpenZFSConfiguration: S.optional(OpenZFSFileSystemConfiguration),
    NetworkType: S.optional(S.String),
  }),
).annotations({ identifier: "FileSystem" }) as any as S.Schema<FileSystem>;
export type FileSystems = FileSystem[];
export const FileSystems = S.Array(
  S.suspend((): S.Schema<FileSystem, any> => FileSystem).annotations({
    identifier: "FileSystem",
  }),
);
export interface S3AccessPointAttachmentsFilter {
  Name?: string;
  Values?: S3AccessPointAttachmentsFilterValues;
}
export const S3AccessPointAttachmentsFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Values: S.optional(S3AccessPointAttachmentsFilterValues),
  }),
).annotations({
  identifier: "S3AccessPointAttachmentsFilter",
}) as any as S.Schema<S3AccessPointAttachmentsFilter>;
export type S3AccessPointAttachmentsFilters = S3AccessPointAttachmentsFilter[];
export const S3AccessPointAttachmentsFilters = S.Array(
  S3AccessPointAttachmentsFilter,
);
export interface SnapshotFilter {
  Name?: string;
  Values?: SnapshotFilterValues;
}
export const SnapshotFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Values: S.optional(SnapshotFilterValues),
  }),
).annotations({
  identifier: "SnapshotFilter",
}) as any as S.Schema<SnapshotFilter>;
export type SnapshotFilters = SnapshotFilter[];
export const SnapshotFilters = S.Array(SnapshotFilter);
export interface StorageVirtualMachineFilter {
  Name?: string;
  Values?: StorageVirtualMachineFilterValues;
}
export const StorageVirtualMachineFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Values: S.optional(StorageVirtualMachineFilterValues),
  }),
).annotations({
  identifier: "StorageVirtualMachineFilter",
}) as any as S.Schema<StorageVirtualMachineFilter>;
export type StorageVirtualMachineFilters = StorageVirtualMachineFilter[];
export const StorageVirtualMachineFilters = S.Array(
  StorageVirtualMachineFilter,
);
export interface VolumeFilter {
  Name?: string;
  Values?: VolumeFilterValues;
}
export const VolumeFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Values: S.optional(VolumeFilterValues),
  }),
).annotations({ identifier: "VolumeFilter" }) as any as S.Schema<VolumeFilter>;
export type VolumeFilters = VolumeFilter[];
export const VolumeFilters = S.Array(VolumeFilter);
export interface UpdateFileCacheLustreConfiguration {
  WeeklyMaintenanceStartTime?: string;
}
export const UpdateFileCacheLustreConfiguration = S.suspend(() =>
  S.Struct({ WeeklyMaintenanceStartTime: S.optional(S.String) }),
).annotations({
  identifier: "UpdateFileCacheLustreConfiguration",
}) as any as S.Schema<UpdateFileCacheLustreConfiguration>;
export interface UpdateFileSystemOntapConfiguration {
  AutomaticBackupRetentionDays?: number;
  DailyAutomaticBackupStartTime?: string;
  FsxAdminPassword?: string | Redacted.Redacted<string>;
  WeeklyMaintenanceStartTime?: string;
  DiskIopsConfiguration?: DiskIopsConfiguration;
  ThroughputCapacity?: number;
  AddRouteTableIds?: RouteTableIds;
  RemoveRouteTableIds?: RouteTableIds;
  ThroughputCapacityPerHAPair?: number;
  HAPairs?: number;
  EndpointIpv6AddressRange?: string;
}
export const UpdateFileSystemOntapConfiguration = S.suspend(() =>
  S.Struct({
    AutomaticBackupRetentionDays: S.optional(S.Number),
    DailyAutomaticBackupStartTime: S.optional(S.String),
    FsxAdminPassword: S.optional(SensitiveString),
    WeeklyMaintenanceStartTime: S.optional(S.String),
    DiskIopsConfiguration: S.optional(DiskIopsConfiguration),
    ThroughputCapacity: S.optional(S.Number),
    AddRouteTableIds: S.optional(RouteTableIds),
    RemoveRouteTableIds: S.optional(RouteTableIds),
    ThroughputCapacityPerHAPair: S.optional(S.Number),
    HAPairs: S.optional(S.Number),
    EndpointIpv6AddressRange: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateFileSystemOntapConfiguration",
}) as any as S.Schema<UpdateFileSystemOntapConfiguration>;
export interface UpdateFileSystemOpenZFSConfiguration {
  AutomaticBackupRetentionDays?: number;
  CopyTagsToBackups?: boolean;
  CopyTagsToVolumes?: boolean;
  DailyAutomaticBackupStartTime?: string;
  ThroughputCapacity?: number;
  WeeklyMaintenanceStartTime?: string;
  DiskIopsConfiguration?: DiskIopsConfiguration;
  AddRouteTableIds?: RouteTableIds;
  RemoveRouteTableIds?: RouteTableIds;
  ReadCacheConfiguration?: OpenZFSReadCacheConfiguration;
  EndpointIpv6AddressRange?: string;
}
export const UpdateFileSystemOpenZFSConfiguration = S.suspend(() =>
  S.Struct({
    AutomaticBackupRetentionDays: S.optional(S.Number),
    CopyTagsToBackups: S.optional(S.Boolean),
    CopyTagsToVolumes: S.optional(S.Boolean),
    DailyAutomaticBackupStartTime: S.optional(S.String),
    ThroughputCapacity: S.optional(S.Number),
    WeeklyMaintenanceStartTime: S.optional(S.String),
    DiskIopsConfiguration: S.optional(DiskIopsConfiguration),
    AddRouteTableIds: S.optional(RouteTableIds),
    RemoveRouteTableIds: S.optional(RouteTableIds),
    ReadCacheConfiguration: S.optional(OpenZFSReadCacheConfiguration),
    EndpointIpv6AddressRange: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateFileSystemOpenZFSConfiguration",
}) as any as S.Schema<UpdateFileSystemOpenZFSConfiguration>;
export interface SelfManagedActiveDirectoryConfigurationUpdates {
  UserName?: string;
  Password?: string | Redacted.Redacted<string>;
  DnsIps?: DnsIps;
  DomainName?: string;
  OrganizationalUnitDistinguishedName?: string;
  FileSystemAdministratorsGroup?: string;
  DomainJoinServiceAccountSecret?: string;
}
export const SelfManagedActiveDirectoryConfigurationUpdates = S.suspend(() =>
  S.Struct({
    UserName: S.optional(S.String),
    Password: S.optional(SensitiveString),
    DnsIps: S.optional(DnsIps),
    DomainName: S.optional(S.String),
    OrganizationalUnitDistinguishedName: S.optional(S.String),
    FileSystemAdministratorsGroup: S.optional(S.String),
    DomainJoinServiceAccountSecret: S.optional(S.String),
  }),
).annotations({
  identifier: "SelfManagedActiveDirectoryConfigurationUpdates",
}) as any as S.Schema<SelfManagedActiveDirectoryConfigurationUpdates>;
export interface UpdateSvmActiveDirectoryConfiguration {
  SelfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryConfigurationUpdates;
  NetBiosName?: string;
}
export const UpdateSvmActiveDirectoryConfiguration = S.suspend(() =>
  S.Struct({
    SelfManagedActiveDirectoryConfiguration: S.optional(
      SelfManagedActiveDirectoryConfigurationUpdates,
    ),
    NetBiosName: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateSvmActiveDirectoryConfiguration",
}) as any as S.Schema<UpdateSvmActiveDirectoryConfiguration>;
export interface UpdateOpenZFSVolumeConfiguration {
  StorageCapacityReservationGiB?: number;
  StorageCapacityQuotaGiB?: number;
  RecordSizeKiB?: number;
  DataCompressionType?: string;
  NfsExports?: OpenZFSNfsExports;
  UserAndGroupQuotas?: OpenZFSUserAndGroupQuotas;
  ReadOnly?: boolean;
}
export const UpdateOpenZFSVolumeConfiguration = S.suspend(() =>
  S.Struct({
    StorageCapacityReservationGiB: S.optional(S.Number),
    StorageCapacityQuotaGiB: S.optional(S.Number),
    RecordSizeKiB: S.optional(S.Number),
    DataCompressionType: S.optional(S.String),
    NfsExports: S.optional(OpenZFSNfsExports),
    UserAndGroupQuotas: S.optional(OpenZFSUserAndGroupQuotas),
    ReadOnly: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UpdateOpenZFSVolumeConfiguration",
}) as any as S.Schema<UpdateOpenZFSVolumeConfiguration>;
export type RepositoryDnsIps = string[];
export const RepositoryDnsIps = S.Array(S.String);
export interface CancelDataRepositoryTaskResponse {
  Lifecycle?: string;
  TaskId?: string;
}
export const CancelDataRepositoryTaskResponse = S.suspend(() =>
  S.Struct({ Lifecycle: S.optional(S.String), TaskId: S.optional(S.String) }),
).annotations({
  identifier: "CancelDataRepositoryTaskResponse",
}) as any as S.Schema<CancelDataRepositoryTaskResponse>;
export interface CopyBackupRequest {
  ClientRequestToken?: string;
  SourceBackupId: string;
  SourceRegion?: string;
  KmsKeyId?: string;
  CopyTags?: boolean;
  Tags?: Tags;
}
export const CopyBackupRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    SourceBackupId: S.String,
    SourceRegion: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    CopyTags: S.optional(S.Boolean),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CopyBackupRequest",
}) as any as S.Schema<CopyBackupRequest>;
export interface CreateStorageVirtualMachineRequest {
  ActiveDirectoryConfiguration?: CreateSvmActiveDirectoryConfiguration;
  ClientRequestToken?: string;
  FileSystemId: string;
  Name: string;
  SvmAdminPassword?: string | Redacted.Redacted<string>;
  Tags?: Tags;
  RootVolumeSecurityStyle?: string;
}
export const CreateStorageVirtualMachineRequest = S.suspend(() =>
  S.Struct({
    ActiveDirectoryConfiguration: S.optional(
      CreateSvmActiveDirectoryConfiguration,
    ),
    ClientRequestToken: S.optional(S.String),
    FileSystemId: S.String,
    Name: S.String,
    SvmAdminPassword: S.optional(SensitiveString),
    Tags: S.optional(Tags),
    RootVolumeSecurityStyle: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateStorageVirtualMachineRequest",
}) as any as S.Schema<CreateStorageVirtualMachineRequest>;
export interface DeleteBackupResponse {
  BackupId?: string;
  Lifecycle?: string;
}
export const DeleteBackupResponse = S.suspend(() =>
  S.Struct({ BackupId: S.optional(S.String), Lifecycle: S.optional(S.String) }),
).annotations({
  identifier: "DeleteBackupResponse",
}) as any as S.Schema<DeleteBackupResponse>;
export interface DeleteDataRepositoryAssociationResponse {
  AssociationId?: string;
  Lifecycle?: string;
  DeleteDataInFileSystem?: boolean;
}
export const DeleteDataRepositoryAssociationResponse = S.suspend(() =>
  S.Struct({
    AssociationId: S.optional(S.String),
    Lifecycle: S.optional(S.String),
    DeleteDataInFileSystem: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DeleteDataRepositoryAssociationResponse",
}) as any as S.Schema<DeleteDataRepositoryAssociationResponse>;
export interface DeleteFileCacheResponse {
  FileCacheId?: string;
  Lifecycle?: string;
}
export const DeleteFileCacheResponse = S.suspend(() =>
  S.Struct({
    FileCacheId: S.optional(S.String),
    Lifecycle: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteFileCacheResponse",
}) as any as S.Schema<DeleteFileCacheResponse>;
export interface DeleteFileSystemRequest {
  FileSystemId: string;
  ClientRequestToken?: string;
  WindowsConfiguration?: DeleteFileSystemWindowsConfiguration;
  LustreConfiguration?: DeleteFileSystemLustreConfiguration;
  OpenZFSConfiguration?: DeleteFileSystemOpenZFSConfiguration;
}
export const DeleteFileSystemRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String,
    ClientRequestToken: S.optional(S.String),
    WindowsConfiguration: S.optional(DeleteFileSystemWindowsConfiguration),
    LustreConfiguration: S.optional(DeleteFileSystemLustreConfiguration),
    OpenZFSConfiguration: S.optional(DeleteFileSystemOpenZFSConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteFileSystemRequest",
}) as any as S.Schema<DeleteFileSystemRequest>;
export interface DeleteSnapshotResponse {
  SnapshotId?: string;
  Lifecycle?: string;
}
export const DeleteSnapshotResponse = S.suspend(() =>
  S.Struct({
    SnapshotId: S.optional(S.String),
    Lifecycle: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteSnapshotResponse",
}) as any as S.Schema<DeleteSnapshotResponse>;
export interface DeleteStorageVirtualMachineResponse {
  StorageVirtualMachineId?: string;
  Lifecycle?: string;
}
export const DeleteStorageVirtualMachineResponse = S.suspend(() =>
  S.Struct({
    StorageVirtualMachineId: S.optional(S.String),
    Lifecycle: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteStorageVirtualMachineResponse",
}) as any as S.Schema<DeleteStorageVirtualMachineResponse>;
export interface DeleteVolumeRequest {
  ClientRequestToken?: string;
  VolumeId: string;
  OntapConfiguration?: DeleteVolumeOntapConfiguration;
  OpenZFSConfiguration?: DeleteVolumeOpenZFSConfiguration;
}
export const DeleteVolumeRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    VolumeId: S.String,
    OntapConfiguration: S.optional(DeleteVolumeOntapConfiguration),
    OpenZFSConfiguration: S.optional(DeleteVolumeOpenZFSConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteVolumeRequest",
}) as any as S.Schema<DeleteVolumeRequest>;
export interface DescribeBackupsRequest {
  BackupIds?: BackupIds;
  Filters?: Filters;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeBackupsRequest = S.suspend(() =>
  S.Struct({
    BackupIds: S.optional(BackupIds),
    Filters: S.optional(Filters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeBackupsRequest",
}) as any as S.Schema<DescribeBackupsRequest>;
export interface DescribeDataRepositoryTasksRequest {
  TaskIds?: TaskIds;
  Filters?: DataRepositoryTaskFilters;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeDataRepositoryTasksRequest = S.suspend(() =>
  S.Struct({
    TaskIds: S.optional(TaskIds),
    Filters: S.optional(DataRepositoryTaskFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDataRepositoryTasksRequest",
}) as any as S.Schema<DescribeDataRepositoryTasksRequest>;
export interface DescribeFileSystemAliasesResponse {
  Aliases?: Aliases;
  NextToken?: string;
}
export const DescribeFileSystemAliasesResponse = S.suspend(() =>
  S.Struct({ Aliases: S.optional(Aliases), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeFileSystemAliasesResponse",
}) as any as S.Schema<DescribeFileSystemAliasesResponse>;
export interface DescribeFileSystemsResponse {
  FileSystems?: FileSystems;
  NextToken?: string;
}
export const DescribeFileSystemsResponse = S.suspend(() =>
  S.Struct({
    FileSystems: S.optional(FileSystems),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeFileSystemsResponse",
}) as any as S.Schema<DescribeFileSystemsResponse>;
export interface DescribeS3AccessPointAttachmentsRequest {
  Names?: S3AccessPointAttachmentNames;
  Filters?: S3AccessPointAttachmentsFilters;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeS3AccessPointAttachmentsRequest = S.suspend(() =>
  S.Struct({
    Names: S.optional(S3AccessPointAttachmentNames),
    Filters: S.optional(S3AccessPointAttachmentsFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeS3AccessPointAttachmentsRequest",
}) as any as S.Schema<DescribeS3AccessPointAttachmentsRequest>;
export interface DescribeSnapshotsRequest {
  SnapshotIds?: SnapshotIds;
  Filters?: SnapshotFilters;
  MaxResults?: number;
  NextToken?: string;
  IncludeShared?: boolean;
}
export const DescribeSnapshotsRequest = S.suspend(() =>
  S.Struct({
    SnapshotIds: S.optional(SnapshotIds),
    Filters: S.optional(SnapshotFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    IncludeShared: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSnapshotsRequest",
}) as any as S.Schema<DescribeSnapshotsRequest>;
export interface DescribeStorageVirtualMachinesRequest {
  StorageVirtualMachineIds?: StorageVirtualMachineIds;
  Filters?: StorageVirtualMachineFilters;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeStorageVirtualMachinesRequest = S.suspend(() =>
  S.Struct({
    StorageVirtualMachineIds: S.optional(StorageVirtualMachineIds),
    Filters: S.optional(StorageVirtualMachineFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeStorageVirtualMachinesRequest",
}) as any as S.Schema<DescribeStorageVirtualMachinesRequest>;
export interface DescribeVolumesRequest {
  VolumeIds?: VolumeIds;
  Filters?: VolumeFilters;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeVolumesRequest = S.suspend(() =>
  S.Struct({
    VolumeIds: S.optional(VolumeIds),
    Filters: S.optional(VolumeFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeVolumesRequest",
}) as any as S.Schema<DescribeVolumesRequest>;
export interface DetachAndDeleteS3AccessPointResponse {
  Lifecycle?: string;
  Name?: string;
}
export const DetachAndDeleteS3AccessPointResponse = S.suspend(() =>
  S.Struct({ Lifecycle: S.optional(S.String), Name: S.optional(S.String) }),
).annotations({
  identifier: "DetachAndDeleteS3AccessPointResponse",
}) as any as S.Schema<DetachAndDeleteS3AccessPointResponse>;
export interface DisassociateFileSystemAliasesResponse {
  Aliases?: Aliases;
}
export const DisassociateFileSystemAliasesResponse = S.suspend(() =>
  S.Struct({ Aliases: S.optional(Aliases) }),
).annotations({
  identifier: "DisassociateFileSystemAliasesResponse",
}) as any as S.Schema<DisassociateFileSystemAliasesResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tags;
  NextToken?: string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ReleaseFileSystemNfsV3LocksResponse {
  FileSystem?: FileSystem;
}
export const ReleaseFileSystemNfsV3LocksResponse = S.suspend(() =>
  S.Struct({ FileSystem: S.optional(FileSystem) }),
).annotations({
  identifier: "ReleaseFileSystemNfsV3LocksResponse",
}) as any as S.Schema<ReleaseFileSystemNfsV3LocksResponse>;
export type AdministrativeActions = AdministrativeAction[];
export const AdministrativeActions = S.Array(
  S.suspend(
    (): S.Schema<AdministrativeAction, any> => AdministrativeAction,
  ).annotations({ identifier: "AdministrativeAction" }),
) as any as S.Schema<AdministrativeActions>;
export interface RestoreVolumeFromSnapshotResponse {
  VolumeId?: string;
  Lifecycle?: string;
  AdministrativeActions?: AdministrativeActions;
}
export const RestoreVolumeFromSnapshotResponse = S.suspend(() =>
  S.Struct({
    VolumeId: S.optional(S.String),
    Lifecycle: S.optional(S.String),
    AdministrativeActions: S.optional(AdministrativeActions),
  }),
).annotations({
  identifier: "RestoreVolumeFromSnapshotResponse",
}) as any as S.Schema<RestoreVolumeFromSnapshotResponse>;
export interface StartMisconfiguredStateRecoveryResponse {
  FileSystem?: FileSystem;
}
export const StartMisconfiguredStateRecoveryResponse = S.suspend(() =>
  S.Struct({ FileSystem: S.optional(FileSystem) }),
).annotations({
  identifier: "StartMisconfiguredStateRecoveryResponse",
}) as any as S.Schema<StartMisconfiguredStateRecoveryResponse>;
export interface NFSDataRepositoryConfiguration {
  Version: string;
  DnsIps?: RepositoryDnsIps;
  AutoExportPolicy?: AutoExportPolicy;
}
export const NFSDataRepositoryConfiguration = S.suspend(() =>
  S.Struct({
    Version: S.String,
    DnsIps: S.optional(RepositoryDnsIps),
    AutoExportPolicy: S.optional(AutoExportPolicy),
  }),
).annotations({
  identifier: "NFSDataRepositoryConfiguration",
}) as any as S.Schema<NFSDataRepositoryConfiguration>;
export interface DataRepositoryAssociation {
  AssociationId?: string;
  ResourceARN?: string;
  FileSystemId?: string;
  Lifecycle?: string;
  FailureDetails?: DataRepositoryFailureDetails;
  FileSystemPath?: string;
  DataRepositoryPath?: string;
  BatchImportMetaDataOnCreate?: boolean;
  ImportedFileChunkSize?: number;
  S3?: S3DataRepositoryConfiguration;
  Tags?: Tags;
  CreationTime?: Date;
  FileCacheId?: string;
  FileCachePath?: string;
  DataRepositorySubdirectories?: SubDirectoriesPaths;
  NFS?: NFSDataRepositoryConfiguration;
}
export const DataRepositoryAssociation = S.suspend(() =>
  S.Struct({
    AssociationId: S.optional(S.String),
    ResourceARN: S.optional(S.String),
    FileSystemId: S.optional(S.String),
    Lifecycle: S.optional(S.String),
    FailureDetails: S.optional(DataRepositoryFailureDetails),
    FileSystemPath: S.optional(S.String),
    DataRepositoryPath: S.optional(S.String),
    BatchImportMetaDataOnCreate: S.optional(S.Boolean),
    ImportedFileChunkSize: S.optional(S.Number),
    S3: S.optional(S3DataRepositoryConfiguration),
    Tags: S.optional(Tags),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FileCacheId: S.optional(S.String),
    FileCachePath: S.optional(S.String),
    DataRepositorySubdirectories: S.optional(SubDirectoriesPaths),
    NFS: S.optional(NFSDataRepositoryConfiguration),
  }),
).annotations({
  identifier: "DataRepositoryAssociation",
}) as any as S.Schema<DataRepositoryAssociation>;
export interface UpdateDataRepositoryAssociationResponse {
  Association?: DataRepositoryAssociation;
}
export const UpdateDataRepositoryAssociationResponse = S.suspend(() =>
  S.Struct({ Association: S.optional(DataRepositoryAssociation) }),
).annotations({
  identifier: "UpdateDataRepositoryAssociationResponse",
}) as any as S.Schema<UpdateDataRepositoryAssociationResponse>;
export interface UpdateFileCacheRequest {
  FileCacheId: string;
  ClientRequestToken?: string;
  LustreConfiguration?: UpdateFileCacheLustreConfiguration;
}
export const UpdateFileCacheRequest = S.suspend(() =>
  S.Struct({
    FileCacheId: S.String,
    ClientRequestToken: S.optional(S.String),
    LustreConfiguration: S.optional(UpdateFileCacheLustreConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFileCacheRequest",
}) as any as S.Schema<UpdateFileCacheRequest>;
export interface UpdateSharedVpcConfigurationResponse {
  EnableFsxRouteTableUpdatesFromParticipantAccounts?: string;
}
export const UpdateSharedVpcConfigurationResponse = S.suspend(() =>
  S.Struct({
    EnableFsxRouteTableUpdatesFromParticipantAccounts: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateSharedVpcConfigurationResponse",
}) as any as S.Schema<UpdateSharedVpcConfigurationResponse>;
export interface LifecycleTransitionReason {
  Message?: string;
}
export const LifecycleTransitionReason = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "LifecycleTransitionReason",
}) as any as S.Schema<LifecycleTransitionReason>;
export interface Snapshot {
  ResourceARN?: string;
  SnapshotId?: string;
  Name?: string;
  VolumeId?: string;
  CreationTime?: Date;
  Lifecycle?: string;
  LifecycleTransitionReason?: LifecycleTransitionReason;
  Tags?: Tags;
  AdministrativeActions?: AdministrativeActions;
}
export const Snapshot = S.suspend(() =>
  S.Struct({
    ResourceARN: S.optional(S.String),
    SnapshotId: S.optional(S.String),
    Name: S.optional(S.String),
    VolumeId: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Lifecycle: S.optional(S.String),
    LifecycleTransitionReason: S.optional(LifecycleTransitionReason),
    Tags: S.optional(Tags),
    AdministrativeActions: S.optional(
      S.suspend(() => AdministrativeActions).annotations({
        identifier: "AdministrativeActions",
      }),
    ),
  }),
).annotations({ identifier: "Snapshot" }) as any as S.Schema<Snapshot>;
export interface UpdateSnapshotResponse {
  Snapshot?: Snapshot;
}
export const UpdateSnapshotResponse = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }),
).annotations({
  identifier: "UpdateSnapshotResponse",
}) as any as S.Schema<UpdateSnapshotResponse>;
export interface UpdateStorageVirtualMachineRequest {
  ActiveDirectoryConfiguration?: UpdateSvmActiveDirectoryConfiguration;
  ClientRequestToken?: string;
  StorageVirtualMachineId: string;
  SvmAdminPassword?: string | Redacted.Redacted<string>;
}
export const UpdateStorageVirtualMachineRequest = S.suspend(() =>
  S.Struct({
    ActiveDirectoryConfiguration: S.optional(
      UpdateSvmActiveDirectoryConfiguration,
    ),
    ClientRequestToken: S.optional(S.String),
    StorageVirtualMachineId: S.String,
    SvmAdminPassword: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateStorageVirtualMachineRequest",
}) as any as S.Schema<UpdateStorageVirtualMachineRequest>;
export interface S3AccessPointVpcConfiguration {
  VpcId?: string;
}
export const S3AccessPointVpcConfiguration = S.suspend(() =>
  S.Struct({ VpcId: S.optional(S.String) }),
).annotations({
  identifier: "S3AccessPointVpcConfiguration",
}) as any as S.Schema<S3AccessPointVpcConfiguration>;
export interface DurationSinceLastAccess {
  Unit?: string;
  Value?: number;
}
export const DurationSinceLastAccess = S.suspend(() =>
  S.Struct({ Unit: S.optional(S.String), Value: S.optional(S.Number) }),
).annotations({
  identifier: "DurationSinceLastAccess",
}) as any as S.Schema<DurationSinceLastAccess>;
export interface FileCacheLustreMetadataConfiguration {
  StorageCapacity: number;
}
export const FileCacheLustreMetadataConfiguration = S.suspend(() =>
  S.Struct({ StorageCapacity: S.Number }),
).annotations({
  identifier: "FileCacheLustreMetadataConfiguration",
}) as any as S.Schema<FileCacheLustreMetadataConfiguration>;
export interface FileCacheNFSConfiguration {
  Version: string;
  DnsIps?: RepositoryDnsIps;
}
export const FileCacheNFSConfiguration = S.suspend(() =>
  S.Struct({ Version: S.String, DnsIps: S.optional(RepositoryDnsIps) }),
).annotations({
  identifier: "FileCacheNFSConfiguration",
}) as any as S.Schema<FileCacheNFSConfiguration>;
export interface CreateOpenZFSOriginSnapshotConfiguration {
  SnapshotARN: string;
  CopyStrategy: string;
}
export const CreateOpenZFSOriginSnapshotConfiguration = S.suspend(() =>
  S.Struct({ SnapshotARN: S.String, CopyStrategy: S.String }),
).annotations({
  identifier: "CreateOpenZFSOriginSnapshotConfiguration",
}) as any as S.Schema<CreateOpenZFSOriginSnapshotConfiguration>;
export interface UpdateFileSystemLustreMetadataConfiguration {
  Iops?: number;
  Mode?: string;
}
export const UpdateFileSystemLustreMetadataConfiguration = S.suspend(() =>
  S.Struct({ Iops: S.optional(S.Number), Mode: S.optional(S.String) }),
).annotations({
  identifier: "UpdateFileSystemLustreMetadataConfiguration",
}) as any as S.Schema<UpdateFileSystemLustreMetadataConfiguration>;
export interface UpdateSnaplockConfiguration {
  AuditLogVolume?: boolean;
  AutocommitPeriod?: AutocommitPeriod;
  PrivilegedDelete?: string;
  RetentionPeriod?: SnaplockRetentionPeriod;
  VolumeAppendModeEnabled?: boolean;
}
export const UpdateSnaplockConfiguration = S.suspend(() =>
  S.Struct({
    AuditLogVolume: S.optional(S.Boolean),
    AutocommitPeriod: S.optional(AutocommitPeriod),
    PrivilegedDelete: S.optional(S.String),
    RetentionPeriod: S.optional(SnaplockRetentionPeriod),
    VolumeAppendModeEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UpdateSnaplockConfiguration",
}) as any as S.Schema<UpdateSnaplockConfiguration>;
export type FileSystemSecondaryGIDs = number[];
export const FileSystemSecondaryGIDs = S.Array(S.Number);
export interface CreateAndAttachS3AccessPointS3Configuration {
  VpcConfiguration?: S3AccessPointVpcConfiguration;
  Policy?: string;
}
export const CreateAndAttachS3AccessPointS3Configuration = S.suspend(() =>
  S.Struct({
    VpcConfiguration: S.optional(S3AccessPointVpcConfiguration),
    Policy: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateAndAttachS3AccessPointS3Configuration",
}) as any as S.Schema<CreateAndAttachS3AccessPointS3Configuration>;
export interface ReleaseConfiguration {
  DurationSinceLastAccess?: DurationSinceLastAccess;
}
export const ReleaseConfiguration = S.suspend(() =>
  S.Struct({ DurationSinceLastAccess: S.optional(DurationSinceLastAccess) }),
).annotations({
  identifier: "ReleaseConfiguration",
}) as any as S.Schema<ReleaseConfiguration>;
export interface CreateFileCacheLustreConfiguration {
  PerUnitStorageThroughput: number;
  DeploymentType: string;
  WeeklyMaintenanceStartTime?: string;
  MetadataConfiguration: FileCacheLustreMetadataConfiguration;
}
export const CreateFileCacheLustreConfiguration = S.suspend(() =>
  S.Struct({
    PerUnitStorageThroughput: S.Number,
    DeploymentType: S.String,
    WeeklyMaintenanceStartTime: S.optional(S.String),
    MetadataConfiguration: FileCacheLustreMetadataConfiguration,
  }),
).annotations({
  identifier: "CreateFileCacheLustreConfiguration",
}) as any as S.Schema<CreateFileCacheLustreConfiguration>;
export interface FileCacheDataRepositoryAssociation {
  FileCachePath: string;
  DataRepositoryPath: string;
  DataRepositorySubdirectories?: SubDirectoriesPaths;
  NFS?: FileCacheNFSConfiguration;
}
export const FileCacheDataRepositoryAssociation = S.suspend(() =>
  S.Struct({
    FileCachePath: S.String,
    DataRepositoryPath: S.String,
    DataRepositorySubdirectories: S.optional(SubDirectoriesPaths),
    NFS: S.optional(FileCacheNFSConfiguration),
  }),
).annotations({
  identifier: "FileCacheDataRepositoryAssociation",
}) as any as S.Schema<FileCacheDataRepositoryAssociation>;
export type CreateFileCacheDataRepositoryAssociations =
  FileCacheDataRepositoryAssociation[];
export const CreateFileCacheDataRepositoryAssociations = S.Array(
  FileCacheDataRepositoryAssociation,
);
export interface BackupFailureDetails {
  Message?: string;
}
export const BackupFailureDetails = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "BackupFailureDetails",
}) as any as S.Schema<BackupFailureDetails>;
export interface ActiveDirectoryBackupAttributes {
  DomainName?: string;
  ActiveDirectoryId?: string;
  ResourceARN?: string;
}
export const ActiveDirectoryBackupAttributes = S.suspend(() =>
  S.Struct({
    DomainName: S.optional(S.String),
    ActiveDirectoryId: S.optional(S.String),
    ResourceARN: S.optional(S.String),
  }),
).annotations({
  identifier: "ActiveDirectoryBackupAttributes",
}) as any as S.Schema<ActiveDirectoryBackupAttributes>;
export interface SnaplockConfiguration {
  AuditLogVolume?: boolean;
  AutocommitPeriod?: AutocommitPeriod;
  PrivilegedDelete?: string;
  RetentionPeriod?: SnaplockRetentionPeriod;
  SnaplockType?: string;
  VolumeAppendModeEnabled?: boolean;
}
export const SnaplockConfiguration = S.suspend(() =>
  S.Struct({
    AuditLogVolume: S.optional(S.Boolean),
    AutocommitPeriod: S.optional(AutocommitPeriod),
    PrivilegedDelete: S.optional(S.String),
    RetentionPeriod: S.optional(SnaplockRetentionPeriod),
    SnaplockType: S.optional(S.String),
    VolumeAppendModeEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SnaplockConfiguration",
}) as any as S.Schema<SnaplockConfiguration>;
export interface AggregateConfiguration {
  Aggregates?: Aggregates;
  TotalConstituents?: number;
}
export const AggregateConfiguration = S.suspend(() =>
  S.Struct({
    Aggregates: S.optional(Aggregates),
    TotalConstituents: S.optional(S.Number),
  }),
).annotations({
  identifier: "AggregateConfiguration",
}) as any as S.Schema<AggregateConfiguration>;
export interface OntapVolumeConfiguration {
  FlexCacheEndpointType?: string;
  JunctionPath?: string;
  SecurityStyle?: string;
  SizeInMegabytes?: number;
  StorageEfficiencyEnabled?: boolean;
  StorageVirtualMachineId?: string;
  StorageVirtualMachineRoot?: boolean;
  TieringPolicy?: TieringPolicy;
  UUID?: string;
  OntapVolumeType?: string;
  SnapshotPolicy?: string;
  CopyTagsToBackups?: boolean;
  SnaplockConfiguration?: SnaplockConfiguration;
  VolumeStyle?: string;
  AggregateConfiguration?: AggregateConfiguration;
  SizeInBytes?: number;
}
export const OntapVolumeConfiguration = S.suspend(() =>
  S.Struct({
    FlexCacheEndpointType: S.optional(S.String),
    JunctionPath: S.optional(S.String),
    SecurityStyle: S.optional(S.String),
    SizeInMegabytes: S.optional(S.Number),
    StorageEfficiencyEnabled: S.optional(S.Boolean),
    StorageVirtualMachineId: S.optional(S.String),
    StorageVirtualMachineRoot: S.optional(S.Boolean),
    TieringPolicy: S.optional(TieringPolicy),
    UUID: S.optional(S.String),
    OntapVolumeType: S.optional(S.String),
    SnapshotPolicy: S.optional(S.String),
    CopyTagsToBackups: S.optional(S.Boolean),
    SnaplockConfiguration: S.optional(SnaplockConfiguration),
    VolumeStyle: S.optional(S.String),
    AggregateConfiguration: S.optional(AggregateConfiguration),
    SizeInBytes: S.optional(S.Number),
  }),
).annotations({
  identifier: "OntapVolumeConfiguration",
}) as any as S.Schema<OntapVolumeConfiguration>;
export interface OpenZFSOriginSnapshotConfiguration {
  SnapshotARN?: string;
  CopyStrategy?: string;
}
export const OpenZFSOriginSnapshotConfiguration = S.suspend(() =>
  S.Struct({
    SnapshotARN: S.optional(S.String),
    CopyStrategy: S.optional(S.String),
  }),
).annotations({
  identifier: "OpenZFSOriginSnapshotConfiguration",
}) as any as S.Schema<OpenZFSOriginSnapshotConfiguration>;
export interface OpenZFSVolumeConfiguration {
  ParentVolumeId?: string;
  VolumePath?: string;
  StorageCapacityReservationGiB?: number;
  StorageCapacityQuotaGiB?: number;
  RecordSizeKiB?: number;
  DataCompressionType?: string;
  CopyTagsToSnapshots?: boolean;
  OriginSnapshot?: OpenZFSOriginSnapshotConfiguration;
  ReadOnly?: boolean;
  NfsExports?: OpenZFSNfsExports;
  UserAndGroupQuotas?: OpenZFSUserAndGroupQuotas;
  RestoreToSnapshot?: string;
  DeleteIntermediateSnaphots?: boolean;
  DeleteClonedVolumes?: boolean;
  DeleteIntermediateData?: boolean;
  SourceSnapshotARN?: string;
  DestinationSnapshot?: string;
  CopyStrategy?: string;
}
export const OpenZFSVolumeConfiguration = S.suspend(() =>
  S.Struct({
    ParentVolumeId: S.optional(S.String),
    VolumePath: S.optional(S.String),
    StorageCapacityReservationGiB: S.optional(S.Number),
    StorageCapacityQuotaGiB: S.optional(S.Number),
    RecordSizeKiB: S.optional(S.Number),
    DataCompressionType: S.optional(S.String),
    CopyTagsToSnapshots: S.optional(S.Boolean),
    OriginSnapshot: S.optional(OpenZFSOriginSnapshotConfiguration),
    ReadOnly: S.optional(S.Boolean),
    NfsExports: S.optional(OpenZFSNfsExports),
    UserAndGroupQuotas: S.optional(OpenZFSUserAndGroupQuotas),
    RestoreToSnapshot: S.optional(S.String),
    DeleteIntermediateSnaphots: S.optional(S.Boolean),
    DeleteClonedVolumes: S.optional(S.Boolean),
    DeleteIntermediateData: S.optional(S.Boolean),
    SourceSnapshotARN: S.optional(S.String),
    DestinationSnapshot: S.optional(S.String),
    CopyStrategy: S.optional(S.String),
  }),
).annotations({
  identifier: "OpenZFSVolumeConfiguration",
}) as any as S.Schema<OpenZFSVolumeConfiguration>;
export interface Volume {
  CreationTime?: Date;
  FileSystemId?: string;
  Lifecycle?: string;
  Name?: string;
  OntapConfiguration?: OntapVolumeConfiguration;
  ResourceARN?: string;
  Tags?: Tags;
  VolumeId?: string;
  VolumeType?: string;
  LifecycleTransitionReason?: LifecycleTransitionReason;
  AdministrativeActions?: AdministrativeActions;
  OpenZFSConfiguration?: OpenZFSVolumeConfiguration;
}
export const Volume = S.suspend(() =>
  S.Struct({
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FileSystemId: S.optional(S.String),
    Lifecycle: S.optional(S.String),
    Name: S.optional(S.String),
    OntapConfiguration: S.optional(OntapVolumeConfiguration),
    ResourceARN: S.optional(S.String),
    Tags: S.optional(Tags),
    VolumeId: S.optional(S.String),
    VolumeType: S.optional(S.String),
    LifecycleTransitionReason: S.optional(LifecycleTransitionReason),
    AdministrativeActions: S.optional(
      S.suspend(() => AdministrativeActions).annotations({
        identifier: "AdministrativeActions",
      }),
    ),
    OpenZFSConfiguration: S.optional(OpenZFSVolumeConfiguration),
  }),
).annotations({ identifier: "Volume" }) as any as S.Schema<Volume>;
export interface Backup {
  BackupId: string;
  Lifecycle: string;
  FailureDetails?: BackupFailureDetails;
  Type: string;
  ProgressPercent?: number;
  CreationTime: Date;
  KmsKeyId?: string;
  ResourceARN?: string;
  Tags?: Tags;
  FileSystem: FileSystem;
  DirectoryInformation?: ActiveDirectoryBackupAttributes;
  OwnerId?: string;
  SourceBackupId?: string;
  SourceBackupRegion?: string;
  ResourceType?: string;
  Volume?: Volume;
  SizeInBytes?: number;
}
export const Backup = S.suspend(() =>
  S.Struct({
    BackupId: S.String,
    Lifecycle: S.String,
    FailureDetails: S.optional(BackupFailureDetails),
    Type: S.String,
    ProgressPercent: S.optional(S.Number),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    KmsKeyId: S.optional(S.String),
    ResourceARN: S.optional(S.String),
    Tags: S.optional(Tags),
    FileSystem: FileSystem,
    DirectoryInformation: S.optional(ActiveDirectoryBackupAttributes),
    OwnerId: S.optional(S.String),
    SourceBackupId: S.optional(S.String),
    SourceBackupRegion: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Volume: S.optional(Volume),
    SizeInBytes: S.optional(S.Number),
  }),
).annotations({ identifier: "Backup" }) as any as S.Schema<Backup>;
export type Backups = Backup[];
export const Backups = S.Array(Backup);
export type Snapshots = Snapshot[];
export const Snapshots = S.Array(
  S.suspend((): S.Schema<Snapshot, any> => Snapshot).annotations({
    identifier: "Snapshot",
  }),
);
export interface SvmActiveDirectoryConfiguration {
  NetBiosName?: string;
  SelfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryAttributes;
}
export const SvmActiveDirectoryConfiguration = S.suspend(() =>
  S.Struct({
    NetBiosName: S.optional(S.String),
    SelfManagedActiveDirectoryConfiguration: S.optional(
      SelfManagedActiveDirectoryAttributes,
    ),
  }),
).annotations({
  identifier: "SvmActiveDirectoryConfiguration",
}) as any as S.Schema<SvmActiveDirectoryConfiguration>;
export interface SvmEndpoint {
  DNSName?: string;
  IpAddresses?: OntapEndpointIpAddresses;
  Ipv6Addresses?: OntapEndpointIpAddresses;
}
export const SvmEndpoint = S.suspend(() =>
  S.Struct({
    DNSName: S.optional(S.String),
    IpAddresses: S.optional(OntapEndpointIpAddresses),
    Ipv6Addresses: S.optional(OntapEndpointIpAddresses),
  }),
).annotations({ identifier: "SvmEndpoint" }) as any as S.Schema<SvmEndpoint>;
export interface SvmEndpoints {
  Iscsi?: SvmEndpoint;
  Management?: SvmEndpoint;
  Nfs?: SvmEndpoint;
  Smb?: SvmEndpoint;
}
export const SvmEndpoints = S.suspend(() =>
  S.Struct({
    Iscsi: S.optional(SvmEndpoint),
    Management: S.optional(SvmEndpoint),
    Nfs: S.optional(SvmEndpoint),
    Smb: S.optional(SvmEndpoint),
  }),
).annotations({ identifier: "SvmEndpoints" }) as any as S.Schema<SvmEndpoints>;
export interface StorageVirtualMachine {
  ActiveDirectoryConfiguration?: SvmActiveDirectoryConfiguration;
  CreationTime?: Date;
  Endpoints?: SvmEndpoints;
  FileSystemId?: string;
  Lifecycle?: string;
  Name?: string;
  ResourceARN?: string;
  StorageVirtualMachineId?: string;
  Subtype?: string;
  UUID?: string;
  Tags?: Tags;
  LifecycleTransitionReason?: LifecycleTransitionReason;
  RootVolumeSecurityStyle?: string;
}
export const StorageVirtualMachine = S.suspend(() =>
  S.Struct({
    ActiveDirectoryConfiguration: S.optional(SvmActiveDirectoryConfiguration),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Endpoints: S.optional(SvmEndpoints),
    FileSystemId: S.optional(S.String),
    Lifecycle: S.optional(S.String),
    Name: S.optional(S.String),
    ResourceARN: S.optional(S.String),
    StorageVirtualMachineId: S.optional(S.String),
    Subtype: S.optional(S.String),
    UUID: S.optional(S.String),
    Tags: S.optional(Tags),
    LifecycleTransitionReason: S.optional(LifecycleTransitionReason),
    RootVolumeSecurityStyle: S.optional(S.String),
  }),
).annotations({
  identifier: "StorageVirtualMachine",
}) as any as S.Schema<StorageVirtualMachine>;
export type StorageVirtualMachines = StorageVirtualMachine[];
export const StorageVirtualMachines = S.Array(StorageVirtualMachine);
export type Volumes = Volume[];
export const Volumes = S.Array(
  S.suspend((): S.Schema<Volume, any> => Volume).annotations({
    identifier: "Volume",
  }),
);
export interface UpdateFileSystemWindowsConfiguration {
  WeeklyMaintenanceStartTime?: string;
  DailyAutomaticBackupStartTime?: string;
  AutomaticBackupRetentionDays?: number;
  ThroughputCapacity?: number;
  SelfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryConfigurationUpdates;
  AuditLogConfiguration?: WindowsAuditLogCreateConfiguration;
  DiskIopsConfiguration?: DiskIopsConfiguration;
  FsrmConfiguration?: WindowsFsrmConfiguration;
}
export const UpdateFileSystemWindowsConfiguration = S.suspend(() =>
  S.Struct({
    WeeklyMaintenanceStartTime: S.optional(S.String),
    DailyAutomaticBackupStartTime: S.optional(S.String),
    AutomaticBackupRetentionDays: S.optional(S.Number),
    ThroughputCapacity: S.optional(S.Number),
    SelfManagedActiveDirectoryConfiguration: S.optional(
      SelfManagedActiveDirectoryConfigurationUpdates,
    ),
    AuditLogConfiguration: S.optional(WindowsAuditLogCreateConfiguration),
    DiskIopsConfiguration: S.optional(DiskIopsConfiguration),
    FsrmConfiguration: S.optional(WindowsFsrmConfiguration),
  }),
).annotations({
  identifier: "UpdateFileSystemWindowsConfiguration",
}) as any as S.Schema<UpdateFileSystemWindowsConfiguration>;
export interface UpdateFileSystemLustreConfiguration {
  WeeklyMaintenanceStartTime?: string;
  DailyAutomaticBackupStartTime?: string;
  AutomaticBackupRetentionDays?: number;
  AutoImportPolicy?: string;
  DataCompressionType?: string;
  LogConfiguration?: LustreLogCreateConfiguration;
  RootSquashConfiguration?: LustreRootSquashConfiguration;
  PerUnitStorageThroughput?: number;
  MetadataConfiguration?: UpdateFileSystemLustreMetadataConfiguration;
  ThroughputCapacity?: number;
  DataReadCacheConfiguration?: LustreReadCacheConfiguration;
}
export const UpdateFileSystemLustreConfiguration = S.suspend(() =>
  S.Struct({
    WeeklyMaintenanceStartTime: S.optional(S.String),
    DailyAutomaticBackupStartTime: S.optional(S.String),
    AutomaticBackupRetentionDays: S.optional(S.Number),
    AutoImportPolicy: S.optional(S.String),
    DataCompressionType: S.optional(S.String),
    LogConfiguration: S.optional(LustreLogCreateConfiguration),
    RootSquashConfiguration: S.optional(LustreRootSquashConfiguration),
    PerUnitStorageThroughput: S.optional(S.Number),
    MetadataConfiguration: S.optional(
      UpdateFileSystemLustreMetadataConfiguration,
    ),
    ThroughputCapacity: S.optional(S.Number),
    DataReadCacheConfiguration: S.optional(LustreReadCacheConfiguration),
  }),
).annotations({
  identifier: "UpdateFileSystemLustreConfiguration",
}) as any as S.Schema<UpdateFileSystemLustreConfiguration>;
export interface UpdateOntapVolumeConfiguration {
  JunctionPath?: string;
  SecurityStyle?: string;
  SizeInMegabytes?: number;
  StorageEfficiencyEnabled?: boolean;
  TieringPolicy?: TieringPolicy;
  SnapshotPolicy?: string;
  CopyTagsToBackups?: boolean;
  SnaplockConfiguration?: UpdateSnaplockConfiguration;
  SizeInBytes?: number;
}
export const UpdateOntapVolumeConfiguration = S.suspend(() =>
  S.Struct({
    JunctionPath: S.optional(S.String),
    SecurityStyle: S.optional(S.String),
    SizeInMegabytes: S.optional(S.Number),
    StorageEfficiencyEnabled: S.optional(S.Boolean),
    TieringPolicy: S.optional(TieringPolicy),
    SnapshotPolicy: S.optional(S.String),
    CopyTagsToBackups: S.optional(S.Boolean),
    SnaplockConfiguration: S.optional(UpdateSnaplockConfiguration),
    SizeInBytes: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdateOntapVolumeConfiguration",
}) as any as S.Schema<UpdateOntapVolumeConfiguration>;
export interface OpenZFSPosixFileSystemUser {
  Uid: number;
  Gid: number;
  SecondaryGids?: FileSystemSecondaryGIDs;
}
export const OpenZFSPosixFileSystemUser = S.suspend(() =>
  S.Struct({
    Uid: S.Number,
    Gid: S.Number,
    SecondaryGids: S.optional(FileSystemSecondaryGIDs),
  }),
).annotations({
  identifier: "OpenZFSPosixFileSystemUser",
}) as any as S.Schema<OpenZFSPosixFileSystemUser>;
export interface OntapUnixFileSystemUser {
  Name: string;
}
export const OntapUnixFileSystemUser = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "OntapUnixFileSystemUser",
}) as any as S.Schema<OntapUnixFileSystemUser>;
export interface OntapWindowsFileSystemUser {
  Name: string;
}
export const OntapWindowsFileSystemUser = S.suspend(() =>
  S.Struct({ Name: S.String }),
).annotations({
  identifier: "OntapWindowsFileSystemUser",
}) as any as S.Schema<OntapWindowsFileSystemUser>;
export interface AssociateFileSystemAliasesResponse {
  Aliases?: Aliases;
}
export const AssociateFileSystemAliasesResponse = S.suspend(() =>
  S.Struct({ Aliases: S.optional(Aliases) }),
).annotations({
  identifier: "AssociateFileSystemAliasesResponse",
}) as any as S.Schema<AssociateFileSystemAliasesResponse>;
export interface CopyBackupResponse {
  Backup?: Backup;
}
export const CopyBackupResponse = S.suspend(() =>
  S.Struct({ Backup: S.optional(Backup) }),
).annotations({
  identifier: "CopyBackupResponse",
}) as any as S.Schema<CopyBackupResponse>;
export interface CreateDataRepositoryAssociationRequest {
  FileSystemId: string;
  FileSystemPath?: string;
  DataRepositoryPath: string;
  BatchImportMetaDataOnCreate?: boolean;
  ImportedFileChunkSize?: number;
  S3?: S3DataRepositoryConfiguration;
  ClientRequestToken?: string;
  Tags?: Tags;
}
export const CreateDataRepositoryAssociationRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String,
    FileSystemPath: S.optional(S.String),
    DataRepositoryPath: S.String,
    BatchImportMetaDataOnCreate: S.optional(S.Boolean),
    ImportedFileChunkSize: S.optional(S.Number),
    S3: S.optional(S3DataRepositoryConfiguration),
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDataRepositoryAssociationRequest",
}) as any as S.Schema<CreateDataRepositoryAssociationRequest>;
export interface CreateDataRepositoryTaskRequest {
  Type: string;
  Paths?: DataRepositoryTaskPaths;
  FileSystemId: string;
  Report: CompletionReport;
  ClientRequestToken?: string;
  Tags?: Tags;
  CapacityToRelease?: number;
  ReleaseConfiguration?: ReleaseConfiguration;
}
export const CreateDataRepositoryTaskRequest = S.suspend(() =>
  S.Struct({
    Type: S.String,
    Paths: S.optional(DataRepositoryTaskPaths),
    FileSystemId: S.String,
    Report: CompletionReport,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(Tags),
    CapacityToRelease: S.optional(S.Number),
    ReleaseConfiguration: S.optional(ReleaseConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDataRepositoryTaskRequest",
}) as any as S.Schema<CreateDataRepositoryTaskRequest>;
export interface CreateFileCacheRequest {
  ClientRequestToken?: string;
  FileCacheType: string;
  FileCacheTypeVersion: string;
  StorageCapacity: number;
  SubnetIds: SubnetIds;
  SecurityGroupIds?: SecurityGroupIds;
  Tags?: Tags;
  CopyTagsToDataRepositoryAssociations?: boolean;
  KmsKeyId?: string;
  LustreConfiguration?: CreateFileCacheLustreConfiguration;
  DataRepositoryAssociations?: CreateFileCacheDataRepositoryAssociations;
}
export const CreateFileCacheRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    FileCacheType: S.String,
    FileCacheTypeVersion: S.String,
    StorageCapacity: S.Number,
    SubnetIds: SubnetIds,
    SecurityGroupIds: S.optional(SecurityGroupIds),
    Tags: S.optional(Tags),
    CopyTagsToDataRepositoryAssociations: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    LustreConfiguration: S.optional(CreateFileCacheLustreConfiguration),
    DataRepositoryAssociations: S.optional(
      CreateFileCacheDataRepositoryAssociations,
    ),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFileCacheRequest",
}) as any as S.Schema<CreateFileCacheRequest>;
export interface CreateFileSystemRequest {
  ClientRequestToken?: string;
  FileSystemType: string;
  StorageCapacity?: number;
  StorageType?: string;
  SubnetIds: SubnetIds;
  SecurityGroupIds?: SecurityGroupIds;
  Tags?: Tags;
  KmsKeyId?: string;
  WindowsConfiguration?: CreateFileSystemWindowsConfiguration;
  LustreConfiguration?: CreateFileSystemLustreConfiguration;
  OntapConfiguration?: CreateFileSystemOntapConfiguration;
  FileSystemTypeVersion?: string;
  OpenZFSConfiguration?: CreateFileSystemOpenZFSConfiguration;
  NetworkType?: string;
}
export const CreateFileSystemRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    FileSystemType: S.String,
    StorageCapacity: S.optional(S.Number),
    StorageType: S.optional(S.String),
    SubnetIds: SubnetIds,
    SecurityGroupIds: S.optional(SecurityGroupIds),
    Tags: S.optional(Tags),
    KmsKeyId: S.optional(S.String),
    WindowsConfiguration: S.optional(CreateFileSystemWindowsConfiguration),
    LustreConfiguration: S.optional(CreateFileSystemLustreConfiguration),
    OntapConfiguration: S.optional(CreateFileSystemOntapConfiguration),
    FileSystemTypeVersion: S.optional(S.String),
    OpenZFSConfiguration: S.optional(CreateFileSystemOpenZFSConfiguration),
    NetworkType: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateFileSystemRequest",
}) as any as S.Schema<CreateFileSystemRequest>;
export interface DescribeBackupsResponse {
  Backups?: Backups;
  NextToken?: string;
}
export const DescribeBackupsResponse = S.suspend(() =>
  S.Struct({ Backups: S.optional(Backups), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeBackupsResponse",
}) as any as S.Schema<DescribeBackupsResponse>;
export interface DescribeSnapshotsResponse {
  Snapshots?: Snapshots;
  NextToken?: string;
}
export const DescribeSnapshotsResponse = S.suspend(() =>
  S.Struct({
    Snapshots: S.optional(Snapshots),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeSnapshotsResponse",
}) as any as S.Schema<DescribeSnapshotsResponse>;
export interface DescribeStorageVirtualMachinesResponse {
  StorageVirtualMachines?: StorageVirtualMachines;
  NextToken?: string;
}
export const DescribeStorageVirtualMachinesResponse = S.suspend(() =>
  S.Struct({
    StorageVirtualMachines: S.optional(StorageVirtualMachines),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeStorageVirtualMachinesResponse",
}) as any as S.Schema<DescribeStorageVirtualMachinesResponse>;
export interface DescribeVolumesResponse {
  Volumes?: Volumes;
  NextToken?: string;
}
export const DescribeVolumesResponse = S.suspend(() =>
  S.Struct({ Volumes: S.optional(Volumes), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeVolumesResponse",
}) as any as S.Schema<DescribeVolumesResponse>;
export interface FileCacheFailureDetails {
  Message?: string;
}
export const FileCacheFailureDetails = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "FileCacheFailureDetails",
}) as any as S.Schema<FileCacheFailureDetails>;
export interface FileCacheLustreConfiguration {
  PerUnitStorageThroughput?: number;
  DeploymentType?: string;
  MountName?: string;
  WeeklyMaintenanceStartTime?: string;
  MetadataConfiguration?: FileCacheLustreMetadataConfiguration;
  LogConfiguration?: LustreLogConfiguration;
}
export const FileCacheLustreConfiguration = S.suspend(() =>
  S.Struct({
    PerUnitStorageThroughput: S.optional(S.Number),
    DeploymentType: S.optional(S.String),
    MountName: S.optional(S.String),
    WeeklyMaintenanceStartTime: S.optional(S.String),
    MetadataConfiguration: S.optional(FileCacheLustreMetadataConfiguration),
    LogConfiguration: S.optional(LustreLogConfiguration),
  }),
).annotations({
  identifier: "FileCacheLustreConfiguration",
}) as any as S.Schema<FileCacheLustreConfiguration>;
export interface FileCache {
  OwnerId?: string;
  CreationTime?: Date;
  FileCacheId?: string;
  FileCacheType?: string;
  FileCacheTypeVersion?: string;
  Lifecycle?: string;
  FailureDetails?: FileCacheFailureDetails;
  StorageCapacity?: number;
  VpcId?: string;
  SubnetIds?: SubnetIds;
  NetworkInterfaceIds?: NetworkInterfaceIds;
  DNSName?: string;
  KmsKeyId?: string;
  ResourceARN?: string;
  LustreConfiguration?: FileCacheLustreConfiguration;
  DataRepositoryAssociationIds?: DataRepositoryAssociationIds;
}
export const FileCache = S.suspend(() =>
  S.Struct({
    OwnerId: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FileCacheId: S.optional(S.String),
    FileCacheType: S.optional(S.String),
    FileCacheTypeVersion: S.optional(S.String),
    Lifecycle: S.optional(S.String),
    FailureDetails: S.optional(FileCacheFailureDetails),
    StorageCapacity: S.optional(S.Number),
    VpcId: S.optional(S.String),
    SubnetIds: S.optional(SubnetIds),
    NetworkInterfaceIds: S.optional(NetworkInterfaceIds),
    DNSName: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    ResourceARN: S.optional(S.String),
    LustreConfiguration: S.optional(FileCacheLustreConfiguration),
    DataRepositoryAssociationIds: S.optional(DataRepositoryAssociationIds),
  }),
).annotations({ identifier: "FileCache" }) as any as S.Schema<FileCache>;
export interface UpdateFileCacheResponse {
  FileCache?: FileCache;
}
export const UpdateFileCacheResponse = S.suspend(() =>
  S.Struct({ FileCache: S.optional(FileCache) }),
).annotations({
  identifier: "UpdateFileCacheResponse",
}) as any as S.Schema<UpdateFileCacheResponse>;
export interface UpdateFileSystemRequest {
  FileSystemId: string;
  ClientRequestToken?: string;
  StorageCapacity?: number;
  WindowsConfiguration?: UpdateFileSystemWindowsConfiguration;
  LustreConfiguration?: UpdateFileSystemLustreConfiguration;
  OntapConfiguration?: UpdateFileSystemOntapConfiguration;
  OpenZFSConfiguration?: UpdateFileSystemOpenZFSConfiguration;
  StorageType?: string;
  FileSystemTypeVersion?: string;
  NetworkType?: string;
}
export const UpdateFileSystemRequest = S.suspend(() =>
  S.Struct({
    FileSystemId: S.String,
    ClientRequestToken: S.optional(S.String),
    StorageCapacity: S.optional(S.Number),
    WindowsConfiguration: S.optional(UpdateFileSystemWindowsConfiguration),
    LustreConfiguration: S.optional(UpdateFileSystemLustreConfiguration),
    OntapConfiguration: S.optional(UpdateFileSystemOntapConfiguration),
    OpenZFSConfiguration: S.optional(UpdateFileSystemOpenZFSConfiguration),
    StorageType: S.optional(S.String),
    FileSystemTypeVersion: S.optional(S.String),
    NetworkType: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateFileSystemRequest",
}) as any as S.Schema<UpdateFileSystemRequest>;
export interface UpdateStorageVirtualMachineResponse {
  StorageVirtualMachine?: StorageVirtualMachine;
}
export const UpdateStorageVirtualMachineResponse = S.suspend(() =>
  S.Struct({ StorageVirtualMachine: S.optional(StorageVirtualMachine) }),
).annotations({
  identifier: "UpdateStorageVirtualMachineResponse",
}) as any as S.Schema<UpdateStorageVirtualMachineResponse>;
export interface UpdateVolumeRequest {
  ClientRequestToken?: string;
  VolumeId: string;
  OntapConfiguration?: UpdateOntapVolumeConfiguration;
  Name?: string;
  OpenZFSConfiguration?: UpdateOpenZFSVolumeConfiguration;
}
export const UpdateVolumeRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    VolumeId: S.String,
    OntapConfiguration: S.optional(UpdateOntapVolumeConfiguration),
    Name: S.optional(S.String),
    OpenZFSConfiguration: S.optional(UpdateOpenZFSVolumeConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateVolumeRequest",
}) as any as S.Schema<UpdateVolumeRequest>;
export interface AdministrativeActionFailureDetails {
  Message?: string;
}
export const AdministrativeActionFailureDetails = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "AdministrativeActionFailureDetails",
}) as any as S.Schema<AdministrativeActionFailureDetails>;
export interface OpenZFSFileSystemIdentity {
  Type: string;
  PosixUser?: OpenZFSPosixFileSystemUser;
}
export const OpenZFSFileSystemIdentity = S.suspend(() =>
  S.Struct({
    Type: S.String,
    PosixUser: S.optional(OpenZFSPosixFileSystemUser),
  }),
).annotations({
  identifier: "OpenZFSFileSystemIdentity",
}) as any as S.Schema<OpenZFSFileSystemIdentity>;
export interface OntapFileSystemIdentity {
  Type: string;
  UnixUser?: OntapUnixFileSystemUser;
  WindowsUser?: OntapWindowsFileSystemUser;
}
export const OntapFileSystemIdentity = S.suspend(() =>
  S.Struct({
    Type: S.String,
    UnixUser: S.optional(OntapUnixFileSystemUser),
    WindowsUser: S.optional(OntapWindowsFileSystemUser),
  }),
).annotations({
  identifier: "OntapFileSystemIdentity",
}) as any as S.Schema<OntapFileSystemIdentity>;
export interface AdministrativeAction {
  AdministrativeActionType?: string;
  ProgressPercent?: number;
  RequestTime?: Date;
  Status?: string;
  TargetFileSystemValues?: FileSystem;
  FailureDetails?: AdministrativeActionFailureDetails;
  TargetVolumeValues?: Volume;
  TargetSnapshotValues?: Snapshot;
  TotalTransferBytes?: number;
  RemainingTransferBytes?: number;
  Message?: string;
}
export const AdministrativeAction = S.suspend(() =>
  S.Struct({
    AdministrativeActionType: S.optional(S.String),
    ProgressPercent: S.optional(S.Number),
    RequestTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(S.String),
    TargetFileSystemValues: S.optional(
      S.suspend((): S.Schema<FileSystem, any> => FileSystem).annotations({
        identifier: "FileSystem",
      }),
    ),
    FailureDetails: S.optional(AdministrativeActionFailureDetails),
    TargetVolumeValues: S.optional(
      S.suspend((): S.Schema<Volume, any> => Volume).annotations({
        identifier: "Volume",
      }),
    ),
    TargetSnapshotValues: S.optional(
      S.suspend((): S.Schema<Snapshot, any> => Snapshot).annotations({
        identifier: "Snapshot",
      }),
    ),
    TotalTransferBytes: S.optional(S.Number),
    RemainingTransferBytes: S.optional(S.Number),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "AdministrativeAction",
}) as any as S.Schema<AdministrativeAction>;
export interface CreateAndAttachS3AccessPointOpenZFSConfiguration {
  VolumeId: string;
  FileSystemIdentity: OpenZFSFileSystemIdentity;
}
export const CreateAndAttachS3AccessPointOpenZFSConfiguration = S.suspend(() =>
  S.Struct({
    VolumeId: S.String,
    FileSystemIdentity: OpenZFSFileSystemIdentity,
  }),
).annotations({
  identifier: "CreateAndAttachS3AccessPointOpenZFSConfiguration",
}) as any as S.Schema<CreateAndAttachS3AccessPointOpenZFSConfiguration>;
export interface CreateAndAttachS3AccessPointOntapConfiguration {
  VolumeId: string;
  FileSystemIdentity: OntapFileSystemIdentity;
}
export const CreateAndAttachS3AccessPointOntapConfiguration = S.suspend(() =>
  S.Struct({ VolumeId: S.String, FileSystemIdentity: OntapFileSystemIdentity }),
).annotations({
  identifier: "CreateAndAttachS3AccessPointOntapConfiguration",
}) as any as S.Schema<CreateAndAttachS3AccessPointOntapConfiguration>;
export interface CreateOpenZFSVolumeConfiguration {
  ParentVolumeId: string;
  StorageCapacityReservationGiB?: number;
  StorageCapacityQuotaGiB?: number;
  RecordSizeKiB?: number;
  DataCompressionType?: string;
  CopyTagsToSnapshots?: boolean;
  OriginSnapshot?: CreateOpenZFSOriginSnapshotConfiguration;
  ReadOnly?: boolean;
  NfsExports?: OpenZFSNfsExports;
  UserAndGroupQuotas?: OpenZFSUserAndGroupQuotas;
}
export const CreateOpenZFSVolumeConfiguration = S.suspend(() =>
  S.Struct({
    ParentVolumeId: S.String,
    StorageCapacityReservationGiB: S.optional(S.Number),
    StorageCapacityQuotaGiB: S.optional(S.Number),
    RecordSizeKiB: S.optional(S.Number),
    DataCompressionType: S.optional(S.String),
    CopyTagsToSnapshots: S.optional(S.Boolean),
    OriginSnapshot: S.optional(CreateOpenZFSOriginSnapshotConfiguration),
    ReadOnly: S.optional(S.Boolean),
    NfsExports: S.optional(OpenZFSNfsExports),
    UserAndGroupQuotas: S.optional(OpenZFSUserAndGroupQuotas),
  }),
).annotations({
  identifier: "CreateOpenZFSVolumeConfiguration",
}) as any as S.Schema<CreateOpenZFSVolumeConfiguration>;
export interface DeleteFileSystemWindowsResponse {
  FinalBackupId?: string;
  FinalBackupTags?: Tags;
}
export const DeleteFileSystemWindowsResponse = S.suspend(() =>
  S.Struct({
    FinalBackupId: S.optional(S.String),
    FinalBackupTags: S.optional(Tags),
  }),
).annotations({
  identifier: "DeleteFileSystemWindowsResponse",
}) as any as S.Schema<DeleteFileSystemWindowsResponse>;
export interface DeleteFileSystemLustreResponse {
  FinalBackupId?: string;
  FinalBackupTags?: Tags;
}
export const DeleteFileSystemLustreResponse = S.suspend(() =>
  S.Struct({
    FinalBackupId: S.optional(S.String),
    FinalBackupTags: S.optional(Tags),
  }),
).annotations({
  identifier: "DeleteFileSystemLustreResponse",
}) as any as S.Schema<DeleteFileSystemLustreResponse>;
export interface DeleteFileSystemOpenZFSResponse {
  FinalBackupId?: string;
  FinalBackupTags?: Tags;
}
export const DeleteFileSystemOpenZFSResponse = S.suspend(() =>
  S.Struct({
    FinalBackupId: S.optional(S.String),
    FinalBackupTags: S.optional(Tags),
  }),
).annotations({
  identifier: "DeleteFileSystemOpenZFSResponse",
}) as any as S.Schema<DeleteFileSystemOpenZFSResponse>;
export interface DeleteVolumeOntapResponse {
  FinalBackupId?: string;
  FinalBackupTags?: Tags;
}
export const DeleteVolumeOntapResponse = S.suspend(() =>
  S.Struct({
    FinalBackupId: S.optional(S.String),
    FinalBackupTags: S.optional(Tags),
  }),
).annotations({
  identifier: "DeleteVolumeOntapResponse",
}) as any as S.Schema<DeleteVolumeOntapResponse>;
export type DataRepositoryAssociations = DataRepositoryAssociation[];
export const DataRepositoryAssociations = S.Array(DataRepositoryAssociation);
export type FileCaches = FileCache[];
export const FileCaches = S.Array(FileCache);
export interface CopySnapshotAndUpdateVolumeResponse {
  VolumeId?: string;
  Lifecycle?: string;
  AdministrativeActions?: AdministrativeActions;
}
export const CopySnapshotAndUpdateVolumeResponse = S.suspend(() =>
  S.Struct({
    VolumeId: S.optional(S.String),
    Lifecycle: S.optional(S.String),
    AdministrativeActions: S.optional(AdministrativeActions),
  }),
).annotations({
  identifier: "CopySnapshotAndUpdateVolumeResponse",
}) as any as S.Schema<CopySnapshotAndUpdateVolumeResponse>;
export interface CreateAndAttachS3AccessPointRequest {
  ClientRequestToken?: string;
  Name: string;
  Type: string;
  OpenZFSConfiguration?: CreateAndAttachS3AccessPointOpenZFSConfiguration;
  OntapConfiguration?: CreateAndAttachS3AccessPointOntapConfiguration;
  S3AccessPoint?: CreateAndAttachS3AccessPointS3Configuration;
}
export const CreateAndAttachS3AccessPointRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    Name: S.String,
    Type: S.String,
    OpenZFSConfiguration: S.optional(
      CreateAndAttachS3AccessPointOpenZFSConfiguration,
    ),
    OntapConfiguration: S.optional(
      CreateAndAttachS3AccessPointOntapConfiguration,
    ),
    S3AccessPoint: S.optional(CreateAndAttachS3AccessPointS3Configuration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAndAttachS3AccessPointRequest",
}) as any as S.Schema<CreateAndAttachS3AccessPointRequest>;
export interface CreateBackupResponse {
  Backup?: Backup;
}
export const CreateBackupResponse = S.suspend(() =>
  S.Struct({ Backup: S.optional(Backup) }),
).annotations({
  identifier: "CreateBackupResponse",
}) as any as S.Schema<CreateBackupResponse>;
export interface CreateDataRepositoryAssociationResponse {
  Association?: DataRepositoryAssociation;
}
export const CreateDataRepositoryAssociationResponse = S.suspend(() =>
  S.Struct({ Association: S.optional(DataRepositoryAssociation) }),
).annotations({
  identifier: "CreateDataRepositoryAssociationResponse",
}) as any as S.Schema<CreateDataRepositoryAssociationResponse>;
export interface DataRepositoryTaskFailureDetails {
  Message?: string;
}
export const DataRepositoryTaskFailureDetails = S.suspend(() =>
  S.Struct({ Message: S.optional(S.String) }),
).annotations({
  identifier: "DataRepositoryTaskFailureDetails",
}) as any as S.Schema<DataRepositoryTaskFailureDetails>;
export interface DataRepositoryTaskStatus {
  TotalCount?: number;
  SucceededCount?: number;
  FailedCount?: number;
  LastUpdatedTime?: Date;
  ReleasedCapacity?: number;
}
export const DataRepositoryTaskStatus = S.suspend(() =>
  S.Struct({
    TotalCount: S.optional(S.Number),
    SucceededCount: S.optional(S.Number),
    FailedCount: S.optional(S.Number),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ReleasedCapacity: S.optional(S.Number),
  }),
).annotations({
  identifier: "DataRepositoryTaskStatus",
}) as any as S.Schema<DataRepositoryTaskStatus>;
export interface DataRepositoryTask {
  TaskId: string;
  Lifecycle: string;
  Type: string;
  CreationTime: Date;
  StartTime?: Date;
  EndTime?: Date;
  ResourceARN?: string;
  Tags?: Tags;
  FileSystemId?: string;
  Paths?: DataRepositoryTaskPaths;
  FailureDetails?: DataRepositoryTaskFailureDetails;
  Status?: DataRepositoryTaskStatus;
  Report?: CompletionReport;
  CapacityToRelease?: number;
  FileCacheId?: string;
  ReleaseConfiguration?: ReleaseConfiguration;
}
export const DataRepositoryTask = S.suspend(() =>
  S.Struct({
    TaskId: S.String,
    Lifecycle: S.String,
    Type: S.String,
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ResourceARN: S.optional(S.String),
    Tags: S.optional(Tags),
    FileSystemId: S.optional(S.String),
    Paths: S.optional(DataRepositoryTaskPaths),
    FailureDetails: S.optional(DataRepositoryTaskFailureDetails),
    Status: S.optional(DataRepositoryTaskStatus),
    Report: S.optional(CompletionReport),
    CapacityToRelease: S.optional(S.Number),
    FileCacheId: S.optional(S.String),
    ReleaseConfiguration: S.optional(ReleaseConfiguration),
  }),
).annotations({
  identifier: "DataRepositoryTask",
}) as any as S.Schema<DataRepositoryTask>;
export interface CreateDataRepositoryTaskResponse {
  DataRepositoryTask?: DataRepositoryTask;
}
export const CreateDataRepositoryTaskResponse = S.suspend(() =>
  S.Struct({ DataRepositoryTask: S.optional(DataRepositoryTask) }),
).annotations({
  identifier: "CreateDataRepositoryTaskResponse",
}) as any as S.Schema<CreateDataRepositoryTaskResponse>;
export interface CreateFileSystemResponse {
  FileSystem?: FileSystem;
}
export const CreateFileSystemResponse = S.suspend(() =>
  S.Struct({ FileSystem: S.optional(FileSystem) }),
).annotations({
  identifier: "CreateFileSystemResponse",
}) as any as S.Schema<CreateFileSystemResponse>;
export interface CreateSnapshotResponse {
  Snapshot?: Snapshot;
}
export const CreateSnapshotResponse = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }),
).annotations({
  identifier: "CreateSnapshotResponse",
}) as any as S.Schema<CreateSnapshotResponse>;
export interface DeleteFileSystemResponse {
  FileSystemId?: string;
  Lifecycle?: string;
  WindowsResponse?: DeleteFileSystemWindowsResponse;
  LustreResponse?: DeleteFileSystemLustreResponse;
  OpenZFSResponse?: DeleteFileSystemOpenZFSResponse;
}
export const DeleteFileSystemResponse = S.suspend(() =>
  S.Struct({
    FileSystemId: S.optional(S.String),
    Lifecycle: S.optional(S.String),
    WindowsResponse: S.optional(DeleteFileSystemWindowsResponse),
    LustreResponse: S.optional(DeleteFileSystemLustreResponse),
    OpenZFSResponse: S.optional(DeleteFileSystemOpenZFSResponse),
  }),
).annotations({
  identifier: "DeleteFileSystemResponse",
}) as any as S.Schema<DeleteFileSystemResponse>;
export interface DeleteVolumeResponse {
  VolumeId?: string;
  Lifecycle?: string;
  OntapResponse?: DeleteVolumeOntapResponse;
}
export const DeleteVolumeResponse = S.suspend(() =>
  S.Struct({
    VolumeId: S.optional(S.String),
    Lifecycle: S.optional(S.String),
    OntapResponse: S.optional(DeleteVolumeOntapResponse),
  }),
).annotations({
  identifier: "DeleteVolumeResponse",
}) as any as S.Schema<DeleteVolumeResponse>;
export interface DescribeDataRepositoryAssociationsResponse {
  Associations?: DataRepositoryAssociations;
  NextToken?: string;
}
export const DescribeDataRepositoryAssociationsResponse = S.suspend(() =>
  S.Struct({
    Associations: S.optional(DataRepositoryAssociations),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeDataRepositoryAssociationsResponse",
}) as any as S.Schema<DescribeDataRepositoryAssociationsResponse>;
export interface DescribeFileCachesResponse {
  FileCaches?: FileCaches;
  NextToken?: string;
}
export const DescribeFileCachesResponse = S.suspend(() =>
  S.Struct({
    FileCaches: S.optional(FileCaches),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeFileCachesResponse",
}) as any as S.Schema<DescribeFileCachesResponse>;
export interface UpdateFileSystemResponse {
  FileSystem?: FileSystem;
}
export const UpdateFileSystemResponse = S.suspend(() =>
  S.Struct({ FileSystem: S.optional(FileSystem) }),
).annotations({
  identifier: "UpdateFileSystemResponse",
}) as any as S.Schema<UpdateFileSystemResponse>;
export interface UpdateVolumeResponse {
  Volume?: Volume;
}
export const UpdateVolumeResponse = S.suspend(() =>
  S.Struct({ Volume: S.optional(Volume) }),
).annotations({
  identifier: "UpdateVolumeResponse",
}) as any as S.Schema<UpdateVolumeResponse>;
export interface S3AccessPointOpenZFSConfiguration {
  VolumeId?: string;
  FileSystemIdentity?: OpenZFSFileSystemIdentity;
}
export const S3AccessPointOpenZFSConfiguration = S.suspend(() =>
  S.Struct({
    VolumeId: S.optional(S.String),
    FileSystemIdentity: S.optional(OpenZFSFileSystemIdentity),
  }),
).annotations({
  identifier: "S3AccessPointOpenZFSConfiguration",
}) as any as S.Schema<S3AccessPointOpenZFSConfiguration>;
export interface S3AccessPointOntapConfiguration {
  VolumeId?: string;
  FileSystemIdentity?: OntapFileSystemIdentity;
}
export const S3AccessPointOntapConfiguration = S.suspend(() =>
  S.Struct({
    VolumeId: S.optional(S.String),
    FileSystemIdentity: S.optional(OntapFileSystemIdentity),
  }),
).annotations({
  identifier: "S3AccessPointOntapConfiguration",
}) as any as S.Schema<S3AccessPointOntapConfiguration>;
export interface S3AccessPoint {
  ResourceARN?: string;
  Alias?: string;
  VpcConfiguration?: S3AccessPointVpcConfiguration;
}
export const S3AccessPoint = S.suspend(() =>
  S.Struct({
    ResourceARN: S.optional(S.String),
    Alias: S.optional(S.String),
    VpcConfiguration: S.optional(S3AccessPointVpcConfiguration),
  }),
).annotations({
  identifier: "S3AccessPoint",
}) as any as S.Schema<S3AccessPoint>;
export interface FileCacheCreating {
  OwnerId?: string;
  CreationTime?: Date;
  FileCacheId?: string;
  FileCacheType?: string;
  FileCacheTypeVersion?: string;
  Lifecycle?: string;
  FailureDetails?: FileCacheFailureDetails;
  StorageCapacity?: number;
  VpcId?: string;
  SubnetIds?: SubnetIds;
  NetworkInterfaceIds?: NetworkInterfaceIds;
  DNSName?: string;
  KmsKeyId?: string;
  ResourceARN?: string;
  Tags?: Tags;
  CopyTagsToDataRepositoryAssociations?: boolean;
  LustreConfiguration?: FileCacheLustreConfiguration;
  DataRepositoryAssociationIds?: DataRepositoryAssociationIds;
}
export const FileCacheCreating = S.suspend(() =>
  S.Struct({
    OwnerId: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FileCacheId: S.optional(S.String),
    FileCacheType: S.optional(S.String),
    FileCacheTypeVersion: S.optional(S.String),
    Lifecycle: S.optional(S.String),
    FailureDetails: S.optional(FileCacheFailureDetails),
    StorageCapacity: S.optional(S.Number),
    VpcId: S.optional(S.String),
    SubnetIds: S.optional(SubnetIds),
    NetworkInterfaceIds: S.optional(NetworkInterfaceIds),
    DNSName: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    ResourceARN: S.optional(S.String),
    Tags: S.optional(Tags),
    CopyTagsToDataRepositoryAssociations: S.optional(S.Boolean),
    LustreConfiguration: S.optional(FileCacheLustreConfiguration),
    DataRepositoryAssociationIds: S.optional(DataRepositoryAssociationIds),
  }),
).annotations({
  identifier: "FileCacheCreating",
}) as any as S.Schema<FileCacheCreating>;
export type DataRepositoryTasks = DataRepositoryTask[];
export const DataRepositoryTasks = S.Array(DataRepositoryTask);
export interface S3AccessPointAttachment {
  Lifecycle?: string;
  LifecycleTransitionReason?: LifecycleTransitionReason;
  CreationTime?: Date;
  Name?: string;
  Type?: string;
  OpenZFSConfiguration?: S3AccessPointOpenZFSConfiguration;
  OntapConfiguration?: S3AccessPointOntapConfiguration;
  S3AccessPoint?: S3AccessPoint;
}
export const S3AccessPointAttachment = S.suspend(() =>
  S.Struct({
    Lifecycle: S.optional(S.String),
    LifecycleTransitionReason: S.optional(LifecycleTransitionReason),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    OpenZFSConfiguration: S.optional(S3AccessPointOpenZFSConfiguration),
    OntapConfiguration: S.optional(S3AccessPointOntapConfiguration),
    S3AccessPoint: S.optional(S3AccessPoint),
  }),
).annotations({
  identifier: "S3AccessPointAttachment",
}) as any as S.Schema<S3AccessPointAttachment>;
export type S3AccessPointAttachments = S3AccessPointAttachment[];
export const S3AccessPointAttachments = S.Array(S3AccessPointAttachment);
export interface CreateAndAttachS3AccessPointResponse {
  S3AccessPointAttachment?: S3AccessPointAttachment;
}
export const CreateAndAttachS3AccessPointResponse = S.suspend(() =>
  S.Struct({ S3AccessPointAttachment: S.optional(S3AccessPointAttachment) }),
).annotations({
  identifier: "CreateAndAttachS3AccessPointResponse",
}) as any as S.Schema<CreateAndAttachS3AccessPointResponse>;
export interface CreateFileCacheResponse {
  FileCache?: FileCacheCreating;
}
export const CreateFileCacheResponse = S.suspend(() =>
  S.Struct({ FileCache: S.optional(FileCacheCreating) }),
).annotations({
  identifier: "CreateFileCacheResponse",
}) as any as S.Schema<CreateFileCacheResponse>;
export interface CreateVolumeRequest {
  ClientRequestToken?: string;
  VolumeType: string;
  Name: string;
  OntapConfiguration?: CreateOntapVolumeConfiguration;
  Tags?: Tags;
  OpenZFSConfiguration?: CreateOpenZFSVolumeConfiguration;
}
export const CreateVolumeRequest = S.suspend(() =>
  S.Struct({
    ClientRequestToken: S.optional(S.String),
    VolumeType: S.String,
    Name: S.String,
    OntapConfiguration: S.optional(CreateOntapVolumeConfiguration),
    Tags: S.optional(Tags),
    OpenZFSConfiguration: S.optional(CreateOpenZFSVolumeConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateVolumeRequest",
}) as any as S.Schema<CreateVolumeRequest>;
export interface CreateVolumeFromBackupResponse {
  Volume?: Volume;
}
export const CreateVolumeFromBackupResponse = S.suspend(() =>
  S.Struct({ Volume: S.optional(Volume) }),
).annotations({
  identifier: "CreateVolumeFromBackupResponse",
}) as any as S.Schema<CreateVolumeFromBackupResponse>;
export interface DescribeDataRepositoryTasksResponse {
  DataRepositoryTasks?: DataRepositoryTasks;
  NextToken?: string;
}
export const DescribeDataRepositoryTasksResponse = S.suspend(() =>
  S.Struct({
    DataRepositoryTasks: S.optional(DataRepositoryTasks),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeDataRepositoryTasksResponse",
}) as any as S.Schema<DescribeDataRepositoryTasksResponse>;
export interface DescribeS3AccessPointAttachmentsResponse {
  S3AccessPointAttachments?: S3AccessPointAttachments;
  NextToken?: string;
}
export const DescribeS3AccessPointAttachmentsResponse = S.suspend(() =>
  S.Struct({
    S3AccessPointAttachments: S.optional(S3AccessPointAttachments),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeS3AccessPointAttachmentsResponse",
}) as any as S.Schema<DescribeS3AccessPointAttachmentsResponse>;
export interface CreateFileSystemFromBackupResponse {
  FileSystem?: FileSystem;
}
export const CreateFileSystemFromBackupResponse = S.suspend(() =>
  S.Struct({ FileSystem: S.optional(FileSystem) }),
).annotations({
  identifier: "CreateFileSystemFromBackupResponse",
}) as any as S.Schema<CreateFileSystemFromBackupResponse>;
export interface CreateStorageVirtualMachineResponse {
  StorageVirtualMachine?: StorageVirtualMachine;
}
export const CreateStorageVirtualMachineResponse = S.suspend(() =>
  S.Struct({ StorageVirtualMachine: S.optional(StorageVirtualMachine) }),
).annotations({
  identifier: "CreateStorageVirtualMachineResponse",
}) as any as S.Schema<CreateStorageVirtualMachineResponse>;
export interface CreateVolumeResponse {
  Volume?: Volume;
}
export const CreateVolumeResponse = S.suspend(() =>
  S.Struct({ Volume: S.optional(Volume) }),
).annotations({
  identifier: "CreateVolumeResponse",
}) as any as S.Schema<CreateVolumeResponse>;

//# Errors
export class BadRequest extends S.TaggedError<BadRequest>()("BadRequest", {
  Message: S.optional(S.String),
}) {}
export class BackupBeingCopied extends S.TaggedError<BackupBeingCopied>()(
  "BackupBeingCopied",
  { Message: S.optional(S.String), BackupId: S.optional(S.String) },
) {}
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  { Message: S.optional(S.String) },
) {}
export class IncompatibleParameterError extends S.TaggedError<IncompatibleParameterError>()(
  "IncompatibleParameterError",
  { Parameter: S.String, Message: S.optional(S.String) },
) {}
export class FileSystemNotFound extends S.TaggedError<FileSystemNotFound>()(
  "FileSystemNotFound",
  { Message: S.optional(S.String) },
) {}
export class DataRepositoryAssociationNotFound extends S.TaggedError<DataRepositoryAssociationNotFound>()(
  "DataRepositoryAssociationNotFound",
  { Message: S.optional(S.String) },
) {}
export class DataRepositoryTaskEnded extends S.TaggedError<DataRepositoryTaskEnded>()(
  "DataRepositoryTaskEnded",
  { Message: S.optional(S.String) },
) {}
export class FileCacheNotFound extends S.TaggedError<FileCacheNotFound>()(
  "FileCacheNotFound",
  { Message: S.optional(S.String) },
) {}
export class BackupNotFound extends S.TaggedError<BackupNotFound>()(
  "BackupNotFound",
  { Message: S.optional(S.String) },
) {}
export class BackupInProgress extends S.TaggedError<BackupInProgress>()(
  "BackupInProgress",
  { Message: S.optional(S.String) },
) {}
export class SnapshotNotFound extends S.TaggedError<SnapshotNotFound>()(
  "SnapshotNotFound",
  { Message: S.optional(S.String) },
) {}
export class StorageVirtualMachineNotFound extends S.TaggedError<StorageVirtualMachineNotFound>()(
  "StorageVirtualMachineNotFound",
  { Message: S.optional(S.String) },
) {}
export class VolumeNotFound extends S.TaggedError<VolumeNotFound>()(
  "VolumeNotFound",
  { Message: S.optional(S.String) },
) {}
export class S3AccessPointAttachmentNotFound extends S.TaggedError<S3AccessPointAttachmentNotFound>()(
  "S3AccessPointAttachmentNotFound",
  { Message: S.optional(S.String) },
) {}
export class ServiceLimitExceeded extends S.TaggedError<ServiceLimitExceeded>()(
  "ServiceLimitExceeded",
  { Limit: S.String, Message: S.optional(S.String) },
) {}
export class DataRepositoryTaskNotFound extends S.TaggedError<DataRepositoryTaskNotFound>()(
  "DataRepositoryTaskNotFound",
  { Message: S.optional(S.String) },
) {}
export class NotServiceResourceError extends S.TaggedError<NotServiceResourceError>()(
  "NotServiceResourceError",
  { ResourceARN: S.String, Message: S.optional(S.String) },
) {}
export class MissingFileCacheConfiguration extends S.TaggedError<MissingFileCacheConfiguration>()(
  "MissingFileCacheConfiguration",
  { Message: S.optional(S.String) },
) {}
export class IncompatibleRegionForMultiAZ extends S.TaggedError<IncompatibleRegionForMultiAZ>()(
  "IncompatibleRegionForMultiAZ",
  { Message: S.optional(S.String) },
) {}
export class DataRepositoryTaskExecuting extends S.TaggedError<DataRepositoryTaskExecuting>()(
  "DataRepositoryTaskExecuting",
  { Message: S.optional(S.String) },
) {}
export class ActiveDirectoryError extends S.TaggedError<ActiveDirectoryError>()(
  "ActiveDirectoryError",
  {
    ActiveDirectoryId: S.String,
    Type: S.optional(S.String),
    Message: S.optional(S.String),
  },
) {}
export class BackupRestoring extends S.TaggedError<BackupRestoring>()(
  "BackupRestoring",
  { Message: S.optional(S.String), FileSystemId: S.optional(S.String) },
) {}
export class InvalidDataRepositoryType extends S.TaggedError<InvalidDataRepositoryType>()(
  "InvalidDataRepositoryType",
  { Message: S.optional(S.String) },
) {}
export class UnsupportedOperation extends S.TaggedError<UnsupportedOperation>()(
  "UnsupportedOperation",
  { Message: S.optional(S.String) },
) {}
export class InvalidNetworkSettings extends S.TaggedError<InvalidNetworkSettings>()(
  "InvalidNetworkSettings",
  {
    Message: S.optional(S.String),
    InvalidSubnetId: S.optional(S.String),
    InvalidSecurityGroupId: S.optional(S.String),
    InvalidRouteTableId: S.optional(S.String),
  },
) {}
export class MissingVolumeConfiguration extends S.TaggedError<MissingVolumeConfiguration>()(
  "MissingVolumeConfiguration",
  { Message: S.optional(S.String) },
) {}
export class ResourceDoesNotSupportTagging extends S.TaggedError<ResourceDoesNotSupportTagging>()(
  "ResourceDoesNotSupportTagging",
  { ResourceARN: S.String, Message: S.optional(S.String) },
) {}
export class InvalidDestinationKmsKey extends S.TaggedError<InvalidDestinationKmsKey>()(
  "InvalidDestinationKmsKey",
  { Message: S.optional(S.String) },
) {}
export class AccessPointAlreadyOwnedByYou extends S.TaggedError<AccessPointAlreadyOwnedByYou>()(
  "AccessPointAlreadyOwnedByYou",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InvalidExportPath extends S.TaggedError<InvalidExportPath>()(
  "InvalidExportPath",
  { Message: S.optional(S.String) },
) {}
export class MissingFileSystemConfiguration extends S.TaggedError<MissingFileSystemConfiguration>()(
  "MissingFileSystemConfiguration",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFound extends S.TaggedError<ResourceNotFound>()(
  "ResourceNotFound",
  { ResourceARN: S.String, Message: S.optional(S.String) },
) {}
export class InvalidPerUnitStorageThroughput extends S.TaggedError<InvalidPerUnitStorageThroughput>()(
  "InvalidPerUnitStorageThroughput",
  { Message: S.optional(S.String) },
) {}
export class InvalidRegion extends S.TaggedError<InvalidRegion>()(
  "InvalidRegion",
  { Message: S.optional(S.String) },
) {}
export class InvalidAccessPoint extends S.TaggedError<InvalidAccessPoint>()(
  "InvalidAccessPoint",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidImportPath extends S.TaggedError<InvalidImportPath>()(
  "InvalidImportPath",
  { Message: S.optional(S.String) },
) {}
export class InvalidSourceKmsKey extends S.TaggedError<InvalidSourceKmsKey>()(
  "InvalidSourceKmsKey",
  { Message: S.optional(S.String) },
) {}
export class InvalidRequest extends S.TaggedError<InvalidRequest>()(
  "InvalidRequest",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SourceBackupUnavailable extends S.TaggedError<SourceBackupUnavailable>()(
  "SourceBackupUnavailable",
  { Message: S.optional(S.String), BackupId: S.optional(S.String) },
) {}
export class TooManyAccessPoints extends S.TaggedError<TooManyAccessPoints>()(
  "TooManyAccessPoints",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Indicates whether participant accounts in your organization can create Amazon FSx for NetApp ONTAP Multi-AZ file systems in subnets that are shared by a virtual
 * private cloud (VPC) owner. For more information, see Creating FSx for ONTAP file systems in shared subnets.
 */
export const describeSharedVpcConfiguration: (
  input: DescribeSharedVpcConfigurationRequest,
) => Effect.Effect<
  DescribeSharedVpcConfigurationResponse,
  BadRequest | InternalServerError | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSharedVpcConfigurationRequest,
  output: DescribeSharedVpcConfigurationResponse,
  errors: [BadRequest, InternalServerError],
}));
/**
 * Use this action to disassociate, or remove, one or more Domain Name Service (DNS) aliases
 * from an Amazon FSx for Windows File Server file system. If you attempt to disassociate a DNS alias that is not
 * associated with the file system, Amazon FSx responds with an HTTP status code 400 (Bad Request). For more information, see
 * Working with DNS Aliases.
 *
 * The system generated response showing the DNS aliases that
 * Amazon FSx is attempting to disassociate from the file system.
 * Use the API
 * operation to monitor the status of the aliases Amazon FSx is
 * disassociating with the file system.
 */
export const disassociateFileSystemAliases: (
  input: DisassociateFileSystemAliasesRequest,
) => Effect.Effect<
  DisassociateFileSystemAliasesResponse,
  BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateFileSystemAliasesRequest,
  output: DisassociateFileSystemAliasesResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
}));
/**
 * Configures whether participant accounts in your organization can create Amazon FSx for NetApp ONTAP Multi-AZ file systems in subnets that are shared by a virtual
 * private cloud (VPC) owner. For more information, see the Amazon FSx for NetApp ONTAP User
 * Guide.
 *
 * We strongly recommend that participant-created Multi-AZ file systems in the shared
 * VPC are deleted before you disable this feature. Once the feature is disabled, these
 * file systems will enter a `MISCONFIGURED` state and behave like Single-AZ
 * file systems. For more information, see Important considerations before disabling shared VPC support for Multi-AZ file
 * systems.
 */
export const updateSharedVpcConfiguration: (
  input: UpdateSharedVpcConfigurationRequest,
) => Effect.Effect<
  UpdateSharedVpcConfigurationResponse,
  BadRequest | IncompatibleParameterError | InternalServerError | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSharedVpcConfigurationRequest,
  output: UpdateSharedVpcConfigurationResponse,
  errors: [BadRequest, IncompatibleParameterError, InternalServerError],
}));
/**
 * After performing steps to repair the Active Directory configuration of an FSx for Windows File Server file system, use this action to
 * initiate the process of Amazon FSx attempting to reconnect to the file system.
 */
export const startMisconfiguredStateRecovery: (
  input: StartMisconfiguredStateRecoveryRequest,
) => Effect.Effect<
  StartMisconfiguredStateRecoveryResponse,
  BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMisconfiguredStateRecoveryRequest,
  output: StartMisconfiguredStateRecoveryResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
}));
/**
 * Returns the DNS aliases that are associated with the specified Amazon FSx for Windows File Server file system. A history of
 * all DNS aliases that have been associated with and disassociated from the file system is available in the list of AdministrativeAction
 * provided in the DescribeFileSystems operation response.
 */
export const describeFileSystemAliases: {
  (
    input: DescribeFileSystemAliasesRequest,
  ): Effect.Effect<
    DescribeFileSystemAliasesResponse,
    BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeFileSystemAliasesRequest,
  ) => Stream.Stream<
    DescribeFileSystemAliasesResponse,
    BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeFileSystemAliasesRequest,
  ) => Stream.Stream<
    unknown,
    BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeFileSystemAliasesRequest,
  output: DescribeFileSystemAliasesResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the description of specific Amazon FSx file systems, if a
 * `FileSystemIds` value is provided for that file system. Otherwise, it
 * returns descriptions of all file systems owned by your Amazon Web Services account in the
 * Amazon Web Services Region of the endpoint that you're calling.
 *
 * When retrieving all file system descriptions, you can optionally specify the
 * `MaxResults` parameter to limit the number of descriptions in a response.
 * If more file system descriptions remain, Amazon FSx returns a
 * `NextToken` value in the response. In this case, send a later request
 * with the `NextToken` request parameter set to the value of
 * `NextToken` from the last response.
 *
 * This operation is used in an iterative process to retrieve a list of your file system
 * descriptions. `DescribeFileSystems` is called first without a
 * `NextToken`value. Then the operation continues to be called with the
 * `NextToken` parameter set to the value of the last `NextToken`
 * value until a response has no `NextToken`.
 *
 * When using this operation, keep the following in mind:
 *
 * - The implementation might return fewer than `MaxResults` file
 * system descriptions while still including a `NextToken`
 * value.
 *
 * - The order of file systems returned in the response of one
 * `DescribeFileSystems` call and the order of file systems returned
 * across the responses of a multicall iteration is unspecified.
 */
export const describeFileSystems: {
  (
    input: DescribeFileSystemsRequest,
  ): Effect.Effect<
    DescribeFileSystemsResponse,
    BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeFileSystemsRequest,
  ) => Stream.Stream<
    DescribeFileSystemsResponse,
    BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeFileSystemsRequest,
  ) => Stream.Stream<
    unknown,
    BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeFileSystemsRequest,
  output: DescribeFileSystemsResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Use this action to associate one or more Domain Name Server (DNS) aliases with an existing Amazon FSx for Windows File Server file system.
 * A file system can have a maximum of 50 DNS aliases associated with it at any one time. If you try to
 * associate a DNS alias that is already associated with the file system, FSx takes no action on that alias in the request.
 * For more information, see Working with DNS Aliases and
 * Walkthrough 5: Using DNS aliases to access your file system, including
 * additional steps you must take to be able to access your file system using a DNS alias.
 *
 * The system response shows the DNS aliases that
 * Amazon FSx is attempting to associate with the file system.
 * Use the API
 * operation to monitor the status of the aliases Amazon FSx is
 * associating with the file system.
 */
export const associateFileSystemAliases: (
  input: AssociateFileSystemAliasesRequest,
) => Effect.Effect<
  AssociateFileSystemAliasesResponse,
  BadRequest | FileSystemNotFound | InternalServerError | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateFileSystemAliasesRequest,
  output: AssociateFileSystemAliasesResponse,
  errors: [BadRequest, FileSystemNotFound, InternalServerError],
}));
/**
 * Returns the description of a specific Amazon File Cache resource, if a
 * `FileCacheIds` value is provided for that cache. Otherwise, it
 * returns descriptions of all caches owned by your Amazon Web Services account in the
 * Amazon Web Services Region of the endpoint that you're calling.
 *
 * When retrieving all cache descriptions, you can optionally specify the
 * `MaxResults` parameter to limit the number of descriptions in a response.
 * If more cache descriptions remain, the operation returns a
 * `NextToken` value in the response. In this case, send a later request
 * with the `NextToken` request parameter set to the value of
 * `NextToken` from the last response.
 *
 * This operation is used in an iterative process to retrieve a list of your cache
 * descriptions. `DescribeFileCaches` is called first without a
 * `NextToken`value. Then the operation continues to be called with the
 * `NextToken` parameter set to the value of the last `NextToken`
 * value until a response has no `NextToken`.
 *
 * When using this operation, keep the following in mind:
 *
 * - The implementation might return fewer than `MaxResults`
 * cache descriptions while still including a `NextToken`
 * value.
 *
 * - The order of caches returned in the response of one
 * `DescribeFileCaches` call and the order of caches returned
 * across the responses of a multicall iteration is unspecified.
 */
export const describeFileCaches: {
  (
    input: DescribeFileCachesRequest,
  ): Effect.Effect<
    DescribeFileCachesResponse,
    BadRequest | FileCacheNotFound | InternalServerError | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeFileCachesRequest,
  ) => Stream.Stream<
    DescribeFileCachesResponse,
    BadRequest | FileCacheNotFound | InternalServerError | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeFileCachesRequest,
  ) => Stream.Stream<
    unknown,
    BadRequest | FileCacheNotFound | InternalServerError | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeFileCachesRequest,
  output: DescribeFileCachesResponse,
  errors: [BadRequest, FileCacheNotFound, InternalServerError],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the description of specific Amazon FSx for OpenZFS snapshots, if a
 * `SnapshotIds` value is provided. Otherwise, this operation returns all
 * snapshots owned by your Amazon Web Services account in the Amazon Web Services Region of
 * the endpoint that you're calling.
 *
 * When retrieving all snapshots, you can optionally specify the `MaxResults`
 * parameter to limit the number of snapshots in a response. If more backups remain,
 * Amazon FSx returns a `NextToken` value in the response. In this
 * case, send a later request with the `NextToken` request parameter set to the
 * value of `NextToken` from the last response.
 *
 * Use this operation in an iterative process to retrieve a list of your snapshots.
 * `DescribeSnapshots` is called first without a `NextToken`
 * value. Then the operation continues to be called with the `NextToken`
 * parameter set to the value of the last `NextToken` value until a response has
 * no `NextToken` value.
 *
 * When using this operation, keep the following in mind:
 *
 * - The operation might return fewer than the `MaxResults` value of
 * snapshot descriptions while still including a `NextToken`
 * value.
 *
 * - The order of snapshots returned in the response of one
 * `DescribeSnapshots` call and the order of backups returned across
 * the responses of a multi-call iteration is unspecified.
 */
export const describeSnapshots: {
  (
    input: DescribeSnapshotsRequest,
  ): Effect.Effect<
    DescribeSnapshotsResponse,
    BadRequest | InternalServerError | SnapshotNotFound | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSnapshotsRequest,
  ) => Stream.Stream<
    DescribeSnapshotsResponse,
    BadRequest | InternalServerError | SnapshotNotFound | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSnapshotsRequest,
  ) => Stream.Stream<
    Snapshot,
    BadRequest | InternalServerError | SnapshotNotFound | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSnapshotsRequest,
  output: DescribeSnapshotsResponse,
  errors: [BadRequest, InternalServerError, SnapshotNotFound],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Snapshots",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes one or more Amazon FSx for NetApp ONTAP storage virtual machines (SVMs).
 */
export const describeStorageVirtualMachines: {
  (
    input: DescribeStorageVirtualMachinesRequest,
  ): Effect.Effect<
    DescribeStorageVirtualMachinesResponse,
    | BadRequest
    | InternalServerError
    | StorageVirtualMachineNotFound
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeStorageVirtualMachinesRequest,
  ) => Stream.Stream<
    DescribeStorageVirtualMachinesResponse,
    | BadRequest
    | InternalServerError
    | StorageVirtualMachineNotFound
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeStorageVirtualMachinesRequest,
  ) => Stream.Stream<
    StorageVirtualMachine,
    | BadRequest
    | InternalServerError
    | StorageVirtualMachineNotFound
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeStorageVirtualMachinesRequest,
  output: DescribeStorageVirtualMachinesResponse,
  errors: [BadRequest, InternalServerError, StorageVirtualMachineNotFound],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "StorageVirtualMachines",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes one or more Amazon FSx for NetApp ONTAP or Amazon FSx for
 * OpenZFS volumes.
 */
export const describeVolumes: {
  (
    input: DescribeVolumesRequest,
  ): Effect.Effect<
    DescribeVolumesResponse,
    BadRequest | InternalServerError | VolumeNotFound | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeVolumesRequest,
  ) => Stream.Stream<
    DescribeVolumesResponse,
    BadRequest | InternalServerError | VolumeNotFound | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeVolumesRequest,
  ) => Stream.Stream<
    Volume,
    BadRequest | InternalServerError | VolumeNotFound | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeVolumesRequest,
  output: DescribeVolumesResponse,
  errors: [BadRequest, InternalServerError, VolumeNotFound],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Volumes",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the configuration of an existing data repository association
 * on an Amazon FSx for Lustre file system. Data repository associations
 * are supported on all FSx for Lustre 2.12 and 2.15 file systems,
 * excluding `scratch_1` deployment type.
 */
export const updateDataRepositoryAssociation: (
  input: UpdateDataRepositoryAssociationRequest,
) => Effect.Effect<
  UpdateDataRepositoryAssociationResponse,
  | BadRequest
  | DataRepositoryAssociationNotFound
  | IncompatibleParameterError
  | InternalServerError
  | ServiceLimitExceeded
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataRepositoryAssociationRequest,
  output: UpdateDataRepositoryAssociationResponse,
  errors: [
    BadRequest,
    DataRepositoryAssociationNotFound,
    IncompatibleParameterError,
    InternalServerError,
    ServiceLimitExceeded,
  ],
}));
/**
 * Returns the description of a specific Amazon FSx backup, if a
 * `BackupIds` value is provided for that backup. Otherwise, it returns all
 * backups owned by your Amazon Web Services account in the Amazon Web Services Region of the
 * endpoint that you're calling.
 *
 * When retrieving all backups, you can optionally specify the `MaxResults`
 * parameter to limit the number of backups in a response. If more backups remain, Amazon FSx returns a `NextToken` value in the response. In this case,
 * send a later request with the `NextToken` request parameter set to the value
 * of the `NextToken` value from the last response.
 *
 * This operation is used in an iterative process to retrieve a list of your backups.
 * `DescribeBackups` is called first without a `NextToken` value.
 * Then the operation continues to be called with the `NextToken` parameter set
 * to the value of the last `NextToken` value until a response has no
 * `NextToken` value.
 *
 * When using this operation, keep the following in mind:
 *
 * - The operation might return fewer than the `MaxResults` value of
 * backup descriptions while still including a `NextToken`
 * value.
 *
 * - The order of the backups returned in the response of one
 * `DescribeBackups` call and the order of the backups returned
 * across the responses of a multi-call iteration is unspecified.
 */
export const describeBackups: {
  (
    input: DescribeBackupsRequest,
  ): Effect.Effect<
    DescribeBackupsResponse,
    | BackupNotFound
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | VolumeNotFound
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeBackupsRequest,
  ) => Stream.Stream<
    DescribeBackupsResponse,
    | BackupNotFound
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | VolumeNotFound
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeBackupsRequest,
  ) => Stream.Stream<
    unknown,
    | BackupNotFound
    | BadRequest
    | FileSystemNotFound
    | InternalServerError
    | VolumeNotFound
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeBackupsRequest,
  output: DescribeBackupsResponse,
  errors: [
    BackupNotFound,
    BadRequest,
    FileSystemNotFound,
    InternalServerError,
    VolumeNotFound,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the name of an Amazon FSx for OpenZFS snapshot.
 */
export const updateSnapshot: (
  input: UpdateSnapshotRequest,
) => Effect.Effect<
  UpdateSnapshotResponse,
  BadRequest | InternalServerError | SnapshotNotFound | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSnapshotRequest,
  output: UpdateSnapshotResponse,
  errors: [BadRequest, InternalServerError, SnapshotNotFound],
}));
/**
 * Deletes an Amazon FSx for OpenZFS snapshot. After deletion, the snapshot no longer
 * exists, and its data is gone. Deleting a snapshot doesn't affect snapshots stored in a
 * file system backup.
 *
 * The `DeleteSnapshot` operation returns instantly. The snapshot appears with
 * the lifecycle status of `DELETING` until the deletion is complete.
 */
export const deleteSnapshot: (
  input: DeleteSnapshotRequest,
) => Effect.Effect<
  DeleteSnapshotResponse,
  BadRequest | InternalServerError | SnapshotNotFound | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSnapshotRequest,
  output: DeleteSnapshotResponse,
  errors: [BadRequest, InternalServerError, SnapshotNotFound],
}));
/**
 * Deletes an existing Amazon FSx for ONTAP storage virtual machine (SVM). Prior
 * to deleting an SVM, you must delete all non-root volumes in the SVM, otherwise the operation will fail.
 */
export const deleteStorageVirtualMachine: (
  input: DeleteStorageVirtualMachineRequest,
) => Effect.Effect<
  DeleteStorageVirtualMachineResponse,
  | BadRequest
  | IncompatibleParameterError
  | InternalServerError
  | StorageVirtualMachineNotFound
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteStorageVirtualMachineRequest,
  output: DeleteStorageVirtualMachineResponse,
  errors: [
    BadRequest,
    IncompatibleParameterError,
    InternalServerError,
    StorageVirtualMachineNotFound,
  ],
}));
/**
 * Returns an Amazon FSx for OpenZFS volume to the state saved by the specified
 * snapshot.
 */
export const restoreVolumeFromSnapshot: (
  input: RestoreVolumeFromSnapshotRequest,
) => Effect.Effect<
  RestoreVolumeFromSnapshotResponse,
  BadRequest | InternalServerError | VolumeNotFound | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreVolumeFromSnapshotRequest,
  output: RestoreVolumeFromSnapshotResponse,
  errors: [BadRequest, InternalServerError, VolumeNotFound],
}));
/**
 * Deletes an Amazon File Cache resource. After deletion, the cache no longer exists, and its data
 * is gone.
 *
 * The `DeleteFileCache` operation returns while the cache has the
 * `DELETING` status. You can check the cache deletion status by
 * calling the DescribeFileCaches operation, which returns a list of caches in your
 * account. If you pass the cache ID for a deleted cache, the
 * `DescribeFileCaches` operation returns a `FileCacheNotFound`
 * error.
 *
 * The data in a deleted cache is also deleted and can't be recovered by
 * any means.
 */
export const deleteFileCache: (
  input: DeleteFileCacheRequest,
) => Effect.Effect<
  DeleteFileCacheResponse,
  | BadRequest
  | FileCacheNotFound
  | IncompatibleParameterError
  | InternalServerError
  | ServiceLimitExceeded
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFileCacheRequest,
  output: DeleteFileCacheResponse,
  errors: [
    BadRequest,
    FileCacheNotFound,
    IncompatibleParameterError,
    InternalServerError,
    ServiceLimitExceeded,
  ],
}));
/**
 * Releases the file system lock from an Amazon FSx for OpenZFS file
 * system.
 */
export const releaseFileSystemNfsV3Locks: (
  input: ReleaseFileSystemNfsV3LocksRequest,
) => Effect.Effect<
  ReleaseFileSystemNfsV3LocksResponse,
  | BadRequest
  | FileSystemNotFound
  | IncompatibleParameterError
  | InternalServerError
  | ServiceLimitExceeded
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ReleaseFileSystemNfsV3LocksRequest,
  output: ReleaseFileSystemNfsV3LocksResponse,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncompatibleParameterError,
    InternalServerError,
    ServiceLimitExceeded,
  ],
}));
/**
 * Deletes a data repository association on an Amazon FSx for Lustre
 * file system. Deleting the data repository association unlinks the
 * file system from the Amazon S3 bucket. When deleting a data repository
 * association, you have the option of deleting the data in the file system
 * that corresponds to the data repository association. Data repository
 * associations are supported on all FSx for Lustre 2.12 and 2.15 file
 * systems, excluding `scratch_1` deployment type.
 */
export const deleteDataRepositoryAssociation: (
  input: DeleteDataRepositoryAssociationRequest,
) => Effect.Effect<
  DeleteDataRepositoryAssociationResponse,
  | BadRequest
  | DataRepositoryAssociationNotFound
  | IncompatibleParameterError
  | InternalServerError
  | ServiceLimitExceeded
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataRepositoryAssociationRequest,
  output: DeleteDataRepositoryAssociationResponse,
  errors: [
    BadRequest,
    DataRepositoryAssociationNotFound,
    IncompatibleParameterError,
    InternalServerError,
    ServiceLimitExceeded,
  ],
}));
/**
 * Updates an existing volume by using a snapshot from another Amazon FSx for OpenZFS file system. For more information, see on-demand data replication in the Amazon FSx for OpenZFS User
 * Guide.
 */
export const copySnapshotAndUpdateVolume: (
  input: CopySnapshotAndUpdateVolumeRequest,
) => Effect.Effect<
  CopySnapshotAndUpdateVolumeResponse,
  | BadRequest
  | IncompatibleParameterError
  | InternalServerError
  | ServiceLimitExceeded
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopySnapshotAndUpdateVolumeRequest,
  output: CopySnapshotAndUpdateVolumeResponse,
  errors: [
    BadRequest,
    IncompatibleParameterError,
    InternalServerError,
    ServiceLimitExceeded,
  ],
}));
/**
 * Creates a snapshot of an existing Amazon FSx for OpenZFS volume. With
 * snapshots, you can easily undo file changes and compare file versions by restoring the
 * volume to a previous version.
 *
 * If a snapshot with the specified client request token exists, and the parameters
 * match, this operation returns the description of the existing snapshot. If a snapshot
 * with the specified client request token exists, and the parameters don't match, this
 * operation returns `IncompatibleParameterError`. If a snapshot with the
 * specified client request token doesn't exist, `CreateSnapshot` does the
 * following:
 *
 * - Creates a new OpenZFS snapshot with an assigned ID, and an initial lifecycle
 * state of `CREATING`.
 *
 * - Returns the description of the snapshot.
 *
 * By using the idempotent operation, you can retry a `CreateSnapshot`
 * operation without the risk of creating an extra snapshot. This approach can be useful
 * when an initial call fails in a way that makes it unclear whether a snapshot was
 * created. If you use the same client request token and the initial call created a
 * snapshot, the operation returns a successful result because all the parameters are the
 * same.
 *
 * The `CreateSnapshot` operation returns while the snapshot's lifecycle state
 * is still `CREATING`. You can check the snapshot creation status by calling
 * the DescribeSnapshots operation, which returns the snapshot state along with
 * other information.
 */
export const createSnapshot: (
  input: CreateSnapshotRequest,
) => Effect.Effect<
  CreateSnapshotResponse,
  | BadRequest
  | InternalServerError
  | ServiceLimitExceeded
  | VolumeNotFound
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotRequest,
  output: CreateSnapshotResponse,
  errors: [
    BadRequest,
    InternalServerError,
    ServiceLimitExceeded,
    VolumeNotFound,
  ],
}));
/**
 * Deletes a file system. After deletion, the file system no longer exists, and its data
 * is gone. Any existing automatic backups and snapshots are also deleted.
 *
 * To delete an Amazon FSx for NetApp ONTAP file system, first delete all the
 * volumes and storage virtual machines (SVMs) on the file system. Then provide a
 * `FileSystemId` value to the `DeleteFileSystem` operation.
 *
 * Before deleting an Amazon FSx for OpenZFS file system, make sure that there aren't
 * any Amazon S3 access points attached to any volume. For more information on how to list S3
 * access points that are attached to volumes, see
 * Listing S3 access point attachments.
 * For more information on how to delete S3 access points, see
 * Deleting an S3 access point attachment.
 *
 * By default, when you delete an Amazon FSx for Windows File Server file system,
 * a final backup is created upon deletion. This final backup isn't subject to the file
 * system's retention policy, and must be manually deleted.
 *
 * To delete an Amazon FSx for Lustre file system, first
 * unmount
 * it from every connected Amazon EC2 instance, then provide a `FileSystemId`
 * value to the `DeleteFileSystem` operation. By default, Amazon FSx will not
 * take a final backup when the `DeleteFileSystem` operation is invoked. On file systems
 * not linked to an Amazon S3 bucket, set `SkipFinalBackup` to `false`
 * to take a final backup of the file system you are deleting. Backups cannot be enabled on S3-linked
 * file systems. To ensure all of your data is written back to S3 before deleting your file system,
 * you can either monitor for the
 * AgeOfOldestQueuedMessage
 * metric to be zero (if using automatic export) or you can run an
 * export data repository task.
 * If you have automatic export enabled and want to use an export data repository task, you have
 * to disable automatic export before executing the export data repository task.
 *
 * The `DeleteFileSystem` operation returns while the file system has the
 * `DELETING` status. You can check the file system deletion status by
 * calling the DescribeFileSystems operation, which returns a list of file systems in your
 * account. If you pass the file system ID for a deleted file system, the
 * `DescribeFileSystems` operation returns a `FileSystemNotFound`
 * error.
 *
 * If a data repository task is in a `PENDING` or `EXECUTING` state,
 * deleting an Amazon FSx for Lustre file system will fail with an HTTP status
 * code 400 (Bad Request).
 *
 * The data in a deleted file system is also deleted and can't be recovered by
 * any means.
 */
export const deleteFileSystem: (
  input: DeleteFileSystemRequest,
) => Effect.Effect<
  DeleteFileSystemResponse,
  | BadRequest
  | FileSystemNotFound
  | IncompatibleParameterError
  | InternalServerError
  | ServiceLimitExceeded
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteFileSystemRequest,
  output: DeleteFileSystemResponse,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncompatibleParameterError,
    InternalServerError,
    ServiceLimitExceeded,
  ],
}));
/**
 * Deletes an Amazon FSx for NetApp ONTAP or Amazon FSx for OpenZFS
 * volume.
 */
export const deleteVolume: (
  input: DeleteVolumeRequest,
) => Effect.Effect<
  DeleteVolumeResponse,
  | BadRequest
  | IncompatibleParameterError
  | InternalServerError
  | ServiceLimitExceeded
  | VolumeNotFound
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVolumeRequest,
  output: DeleteVolumeResponse,
  errors: [
    BadRequest,
    IncompatibleParameterError,
    InternalServerError,
    ServiceLimitExceeded,
    VolumeNotFound,
  ],
}));
/**
 * Deletes an Amazon FSx backup. After deletion, the backup no longer exists, and
 * its data is gone.
 *
 * The `DeleteBackup` call returns instantly. The backup won't show up in
 * later `DescribeBackups` calls.
 *
 * The data in a deleted backup is also deleted and can't be recovered by any
 * means.
 */
export const deleteBackup: (
  input: DeleteBackupRequest,
) => Effect.Effect<
  DeleteBackupResponse,
  | BackupBeingCopied
  | BackupInProgress
  | BackupNotFound
  | BackupRestoring
  | BadRequest
  | IncompatibleParameterError
  | InternalServerError
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBackupRequest,
  output: DeleteBackupResponse,
  errors: [
    BackupBeingCopied,
    BackupInProgress,
    BackupNotFound,
    BackupRestoring,
    BadRequest,
    IncompatibleParameterError,
    InternalServerError,
  ],
}));
/**
 * Returns the description of specific Amazon FSx for Lustre or Amazon File Cache
 * data repository associations, if one or more `AssociationIds` values
 * are provided in the request, or if filters are used in the request. Data repository
 * associations are supported on Amazon File Cache resources and all FSx for Lustre
 * 2.12 and 2,15 file systems, excluding `scratch_1` deployment type.
 *
 * You can use filters to narrow the response to include just data repository
 * associations for specific file systems (use the `file-system-id` filter with
 * the ID of the file system) or caches (use the `file-cache-id` filter with
 * the ID of the cache), or data repository associations for a specific repository type
 * (use the `data-repository-type` filter with a value of `S3`
 * or `NFS`). If you don't use filters, the response returns all data
 * repository associations owned by your Amazon Web Services account in the Amazon Web Services Region
 * of the endpoint that you're calling.
 *
 * When retrieving all data repository associations, you can paginate the response by using
 * the optional `MaxResults` parameter to limit the number of data repository associations
 * returned in a response. If more data repository associations remain, a
 * `NextToken` value is returned in the response. In this case, send a later
 * request with the `NextToken` request parameter set to the value of
 * `NextToken` from the last response.
 */
export const describeDataRepositoryAssociations: {
  (
    input: DescribeDataRepositoryAssociationsRequest,
  ): Effect.Effect<
    DescribeDataRepositoryAssociationsResponse,
    | BadRequest
    | DataRepositoryAssociationNotFound
    | FileSystemNotFound
    | InternalServerError
    | InvalidDataRepositoryType
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDataRepositoryAssociationsRequest,
  ) => Stream.Stream<
    DescribeDataRepositoryAssociationsResponse,
    | BadRequest
    | DataRepositoryAssociationNotFound
    | FileSystemNotFound
    | InternalServerError
    | InvalidDataRepositoryType
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDataRepositoryAssociationsRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequest
    | DataRepositoryAssociationNotFound
    | FileSystemNotFound
    | InternalServerError
    | InvalidDataRepositoryType
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDataRepositoryAssociationsRequest,
  output: DescribeDataRepositoryAssociationsResponse,
  errors: [
    BadRequest,
    DataRepositoryAssociationNotFound,
    FileSystemNotFound,
    InternalServerError,
    InvalidDataRepositoryType,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the description of specific Amazon FSx for Lustre or Amazon File Cache data repository tasks, if
 * one or more `TaskIds` values are provided in the request, or if filters are used in the request.
 * You can use filters to narrow the response to include just tasks for specific file systems or caches,
 * or tasks in a specific lifecycle state. Otherwise, it returns all data repository tasks owned
 * by your Amazon Web Services account in the Amazon Web Services Region of the endpoint that you're calling.
 *
 * When retrieving all tasks, you can paginate the response by using the optional `MaxResults`
 * parameter to limit the number of tasks returned in a response. If more tasks remain,
 * a `NextToken` value is returned in the response. In this case, send a later
 * request with the `NextToken` request parameter set to the value of
 * `NextToken` from the last response.
 */
export const describeDataRepositoryTasks: {
  (
    input: DescribeDataRepositoryTasksRequest,
  ): Effect.Effect<
    DescribeDataRepositoryTasksResponse,
    | BadRequest
    | DataRepositoryTaskNotFound
    | FileSystemNotFound
    | InternalServerError
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDataRepositoryTasksRequest,
  ) => Stream.Stream<
    DescribeDataRepositoryTasksResponse,
    | BadRequest
    | DataRepositoryTaskNotFound
    | FileSystemNotFound
    | InternalServerError
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDataRepositoryTasksRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequest
    | DataRepositoryTaskNotFound
    | FileSystemNotFound
    | InternalServerError
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDataRepositoryTasksRequest,
  output: DescribeDataRepositoryTasksResponse,
  errors: [
    BadRequest,
    DataRepositoryTaskNotFound,
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
 * Detaches an S3 access point from an Amazon FSx volume and deletes the S3 access point.
 *
 * The requester requires the following permission to perform this action:
 *
 * - `fsx:DetachAndDeleteS3AccessPoint`
 *
 * - `s3:DeleteAccessPoint`
 */
export const detachAndDeleteS3AccessPoint: (
  input: DetachAndDeleteS3AccessPointRequest,
) => Effect.Effect<
  DetachAndDeleteS3AccessPointResponse,
  | BadRequest
  | IncompatibleParameterError
  | InternalServerError
  | S3AccessPointAttachmentNotFound
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DetachAndDeleteS3AccessPointRequest,
  output: DetachAndDeleteS3AccessPointResponse,
  errors: [
    BadRequest,
    IncompatibleParameterError,
    InternalServerError,
    S3AccessPointAttachmentNotFound,
    UnsupportedOperation,
  ],
}));
/**
 * Updates the configuration of an Amazon FSx for NetApp ONTAP or Amazon FSx for OpenZFS volume.
 */
export const updateVolume: (
  input: UpdateVolumeRequest,
) => Effect.Effect<
  UpdateVolumeResponse,
  | BadRequest
  | IncompatibleParameterError
  | InternalServerError
  | MissingVolumeConfiguration
  | VolumeNotFound
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateVolumeRequest,
  output: UpdateVolumeResponse,
  errors: [
    BadRequest,
    IncompatibleParameterError,
    InternalServerError,
    MissingVolumeConfiguration,
    VolumeNotFound,
  ],
}));
/**
 * Creates a backup of an existing Amazon FSx for Windows File Server file
 * system, Amazon FSx for Lustre file system, Amazon FSx for NetApp ONTAP
 * volume, or Amazon FSx for OpenZFS file system. We recommend creating regular
 * backups so that you can restore a file system or volume from a backup if an issue arises
 * with the original file system or volume.
 *
 * For Amazon FSx for Lustre file systems, you can create a backup only for file
 * systems that have the following configuration:
 *
 * - A Persistent deployment type
 *
 * - Are *not* linked to a data repository
 *
 * For more information about backups, see the following:
 *
 * - For Amazon FSx for Lustre, see Working with FSx for
 * Lustre backups.
 *
 * - For Amazon FSx for Windows, see Working with FSx for
 * Windows backups.
 *
 * - For Amazon FSx for NetApp ONTAP, see Working with FSx for NetApp
 * ONTAP backups.
 *
 * - For Amazon FSx for OpenZFS, see Working with FSx for OpenZFS backups.
 *
 * If a backup with the specified client request token exists and the parameters match,
 * this operation returns the description of the existing backup. If a backup with the
 * specified client request token exists and the parameters don't match, this operation
 * returns `IncompatibleParameterError`. If a backup with the specified client
 * request token doesn't exist, `CreateBackup` does the following:
 *
 * - Creates a new Amazon FSx backup with an assigned ID, and an initial
 * lifecycle state of `CREATING`.
 *
 * - Returns the description of the backup.
 *
 * By using the idempotent operation, you can retry a `CreateBackup`
 * operation without the risk of creating an extra backup. This approach can be useful when
 * an initial call fails in a way that makes it unclear whether a backup was created. If
 * you use the same client request token and the initial call created a backup, the
 * operation returns a successful result because all the parameters are the same.
 *
 * The `CreateBackup` operation returns while the backup's lifecycle state is
 * still `CREATING`. You can check the backup creation status by calling the
 * DescribeBackups operation, which returns the backup state along with other
 * information.
 */
export const createBackup: (
  input: CreateBackupRequest,
) => Effect.Effect<
  CreateBackupResponse,
  | BackupInProgress
  | BadRequest
  | FileSystemNotFound
  | IncompatibleParameterError
  | InternalServerError
  | ServiceLimitExceeded
  | UnsupportedOperation
  | VolumeNotFound
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBackupRequest,
  output: CreateBackupResponse,
  errors: [
    BackupInProgress,
    BadRequest,
    FileSystemNotFound,
    IncompatibleParameterError,
    InternalServerError,
    ServiceLimitExceeded,
    UnsupportedOperation,
    VolumeNotFound,
  ],
}));
/**
 * Cancels an existing Amazon FSx for Lustre data repository task if that task is in either the
 * `PENDING` or `EXECUTING` state. When you cancel an export task, Amazon FSx
 * does the following.
 *
 * - Any files that FSx has already exported are not reverted.
 *
 * - FSx continues to export any files that are in-flight when the cancel operation is received.
 *
 * - FSx does not export any files that have not yet been exported.
 *
 * For a release task, Amazon FSx will stop releasing files upon cancellation. Any files that
 * have already been released will remain in the released state.
 */
export const cancelDataRepositoryTask: (
  input: CancelDataRepositoryTaskRequest,
) => Effect.Effect<
  CancelDataRepositoryTaskResponse,
  | BadRequest
  | DataRepositoryTaskEnded
  | DataRepositoryTaskNotFound
  | InternalServerError
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelDataRepositoryTaskRequest,
  output: CancelDataRepositoryTaskResponse,
  errors: [
    BadRequest,
    DataRepositoryTaskEnded,
    DataRepositoryTaskNotFound,
    InternalServerError,
    UnsupportedOperation,
  ],
}));
/**
 * Updates an FSx for ONTAP storage virtual machine (SVM).
 */
export const updateStorageVirtualMachine: (
  input: UpdateStorageVirtualMachineRequest,
) => Effect.Effect<
  UpdateStorageVirtualMachineResponse,
  | BadRequest
  | IncompatibleParameterError
  | InternalServerError
  | StorageVirtualMachineNotFound
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateStorageVirtualMachineRequest,
  output: UpdateStorageVirtualMachineResponse,
  errors: [
    BadRequest,
    IncompatibleParameterError,
    InternalServerError,
    StorageVirtualMachineNotFound,
    UnsupportedOperation,
  ],
}));
/**
 * Creates an Amazon FSx for Lustre data repository association (DRA). A data
 * repository association is a link between a directory on the file system and
 * an Amazon S3 bucket or prefix. You can have a maximum of 8 data repository
 * associations on a file system. Data repository associations are supported
 * on all FSx for Lustre 2.12 and 2.15 file systems, excluding
 * `scratch_1` deployment type.
 *
 * Each data repository association must have a unique Amazon FSx file
 * system directory and a unique S3 bucket or prefix associated with it. You
 * can configure a data repository association for automatic import only,
 * for automatic export only, or for both. To learn more about linking a
 * data repository to your file system, see
 * Linking your file system to an S3 bucket.
 *
 * `CreateDataRepositoryAssociation` isn't supported
 * on Amazon File Cache resources. To create a DRA on Amazon File Cache,
 * use the `CreateFileCache` operation.
 */
export const createDataRepositoryAssociation: (
  input: CreateDataRepositoryAssociationRequest,
) => Effect.Effect<
  CreateDataRepositoryAssociationResponse,
  | BadRequest
  | FileSystemNotFound
  | IncompatibleParameterError
  | InternalServerError
  | ServiceLimitExceeded
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataRepositoryAssociationRequest,
  output: CreateDataRepositoryAssociationResponse,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncompatibleParameterError,
    InternalServerError,
    ServiceLimitExceeded,
    UnsupportedOperation,
  ],
}));
/**
 * Updates the configuration of an existing Amazon File Cache resource.
 * You can update multiple properties in a single request.
 */
export const updateFileCache: (
  input: UpdateFileCacheRequest,
) => Effect.Effect<
  UpdateFileCacheResponse,
  | BadRequest
  | FileCacheNotFound
  | IncompatibleParameterError
  | InternalServerError
  | MissingFileCacheConfiguration
  | ServiceLimitExceeded
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFileCacheRequest,
  output: UpdateFileCacheResponse,
  errors: [
    BadRequest,
    FileCacheNotFound,
    IncompatibleParameterError,
    InternalServerError,
    MissingFileCacheConfiguration,
    ServiceLimitExceeded,
    UnsupportedOperation,
  ],
}));
/**
 * Creates an Amazon FSx for Lustre data repository task.
 * A `CreateDataRepositoryTask` operation will fail if a data
 * repository is not linked to the FSx file system.
 *
 * You use import and export data repository tasks to perform bulk operations between your
 * FSx for Lustre file system and its linked data repositories. An example of a data repository
 * task is exporting any data and metadata changes, including POSIX metadata, to files, directories,
 * and symbolic links (symlinks) from your FSx file system to a linked data repository.
 *
 * You use release data repository tasks to release data from your file system for files that
 * are exported to S3. The metadata of released files remains on the file system so users or applications
 * can still access released files by reading the files again, which will restore data from
 * Amazon S3 to the FSx for Lustre file system.
 *
 * To learn more about data repository tasks, see
 * Data Repository Tasks.
 * To learn more about linking a data repository to your file system, see
 * Linking your file system to an S3 bucket.
 */
export const createDataRepositoryTask: (
  input: CreateDataRepositoryTaskRequest,
) => Effect.Effect<
  CreateDataRepositoryTaskResponse,
  | BadRequest
  | DataRepositoryTaskExecuting
  | FileSystemNotFound
  | IncompatibleParameterError
  | InternalServerError
  | ServiceLimitExceeded
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataRepositoryTaskRequest,
  output: CreateDataRepositoryTaskResponse,
  errors: [
    BadRequest,
    DataRepositoryTaskExecuting,
    FileSystemNotFound,
    IncompatibleParameterError,
    InternalServerError,
    ServiceLimitExceeded,
    UnsupportedOperation,
  ],
}));
/**
 * Describes one or more S3 access points attached to Amazon FSx volumes.
 *
 * The requester requires the following permission to perform this action:
 *
 * - `fsx:DescribeS3AccessPointAttachments`
 */
export const describeS3AccessPointAttachments: {
  (
    input: DescribeS3AccessPointAttachmentsRequest,
  ): Effect.Effect<
    DescribeS3AccessPointAttachmentsResponse,
    | BadRequest
    | InternalServerError
    | S3AccessPointAttachmentNotFound
    | UnsupportedOperation
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeS3AccessPointAttachmentsRequest,
  ) => Stream.Stream<
    DescribeS3AccessPointAttachmentsResponse,
    | BadRequest
    | InternalServerError
    | S3AccessPointAttachmentNotFound
    | UnsupportedOperation
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: DescribeS3AccessPointAttachmentsRequest,
  ) => Stream.Stream<
    S3AccessPointAttachment,
    | BadRequest
    | InternalServerError
    | S3AccessPointAttachmentNotFound
    | UnsupportedOperation
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeS3AccessPointAttachmentsRequest,
  output: DescribeS3AccessPointAttachmentsResponse,
  errors: [
    BadRequest,
    InternalServerError,
    S3AccessPointAttachmentNotFound,
    UnsupportedOperation,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "S3AccessPointAttachments",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a new Amazon FSx for NetApp ONTAP volume from an
 * existing Amazon FSx volume backup.
 */
export const createVolumeFromBackup: (
  input: CreateVolumeFromBackupRequest,
) => Effect.Effect<
  CreateVolumeFromBackupResponse,
  | BackupNotFound
  | BadRequest
  | FileSystemNotFound
  | IncompatibleParameterError
  | InternalServerError
  | MissingVolumeConfiguration
  | ServiceLimitExceeded
  | StorageVirtualMachineNotFound
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVolumeFromBackupRequest,
  output: CreateVolumeFromBackupResponse,
  errors: [
    BackupNotFound,
    BadRequest,
    FileSystemNotFound,
    IncompatibleParameterError,
    InternalServerError,
    MissingVolumeConfiguration,
    ServiceLimitExceeded,
    StorageVirtualMachineNotFound,
  ],
}));
/**
 * Creates a storage virtual machine (SVM) for an Amazon FSx for ONTAP file system.
 */
export const createStorageVirtualMachine: (
  input: CreateStorageVirtualMachineRequest,
) => Effect.Effect<
  CreateStorageVirtualMachineResponse,
  | ActiveDirectoryError
  | BadRequest
  | FileSystemNotFound
  | IncompatibleParameterError
  | InternalServerError
  | ServiceLimitExceeded
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateStorageVirtualMachineRequest,
  output: CreateStorageVirtualMachineResponse,
  errors: [
    ActiveDirectoryError,
    BadRequest,
    FileSystemNotFound,
    IncompatibleParameterError,
    InternalServerError,
    ServiceLimitExceeded,
    UnsupportedOperation,
  ],
}));
/**
 * Creates an FSx for ONTAP or Amazon FSx for OpenZFS storage volume.
 */
export const createVolume: (
  input: CreateVolumeRequest,
) => Effect.Effect<
  CreateVolumeResponse,
  | BadRequest
  | FileSystemNotFound
  | IncompatibleParameterError
  | InternalServerError
  | MissingVolumeConfiguration
  | ServiceLimitExceeded
  | StorageVirtualMachineNotFound
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateVolumeRequest,
  output: CreateVolumeResponse,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncompatibleParameterError,
    InternalServerError,
    MissingVolumeConfiguration,
    ServiceLimitExceeded,
    StorageVirtualMachineNotFound,
    UnsupportedOperation,
  ],
}));
/**
 * Use this operation to update the configuration of an existing Amazon FSx file
 * system. You can update multiple properties in a single request.
 *
 * For FSx for Windows File Server file systems, you can update the following
 * properties:
 *
 * - `AuditLogConfiguration`
 *
 * - `AutomaticBackupRetentionDays`
 *
 * - `DailyAutomaticBackupStartTime`
 *
 * - `DiskIopsConfiguration`
 *
 * - `SelfManagedActiveDirectoryConfiguration`
 *
 * - `StorageCapacity`
 *
 * - `StorageType`
 *
 * - `ThroughputCapacity`
 *
 * - `WeeklyMaintenanceStartTime`
 *
 * For FSx for Lustre file systems, you can update the following
 * properties:
 *
 * - `AutoImportPolicy`
 *
 * - `AutomaticBackupRetentionDays`
 *
 * - `DailyAutomaticBackupStartTime`
 *
 * - `DataCompressionType`
 *
 * - `FileSystemTypeVersion`
 *
 * - `LogConfiguration`
 *
 * - `LustreReadCacheConfiguration`
 *
 * - `LustreRootSquashConfiguration`
 *
 * - `MetadataConfiguration`
 *
 * - `PerUnitStorageThroughput`
 *
 * - `StorageCapacity`
 *
 * - `ThroughputCapacity`
 *
 * - `WeeklyMaintenanceStartTime`
 *
 * For FSx for ONTAP file systems, you can update the following
 * properties:
 *
 * - `AddRouteTableIds`
 *
 * - `AutomaticBackupRetentionDays`
 *
 * - `DailyAutomaticBackupStartTime`
 *
 * - `DiskIopsConfiguration`
 *
 * - `EndpointIpv6AddressRange`
 *
 * - `FsxAdminPassword`
 *
 * - `HAPairs`
 *
 * - `RemoveRouteTableIds`
 *
 * - `StorageCapacity`
 *
 * - `ThroughputCapacity`
 *
 * - `ThroughputCapacityPerHAPair`
 *
 * - `WeeklyMaintenanceStartTime`
 *
 * For FSx for OpenZFS file systems, you can update the following
 * properties:
 *
 * - `AddRouteTableIds`
 *
 * - `AutomaticBackupRetentionDays`
 *
 * - `CopyTagsToBackups`
 *
 * - `CopyTagsToVolumes`
 *
 * - `DailyAutomaticBackupStartTime`
 *
 * - `DiskIopsConfiguration`
 *
 * - `EndpointIpv6AddressRange`
 *
 * - `ReadCacheConfiguration`
 *
 * - `RemoveRouteTableIds`
 *
 * - `StorageCapacity`
 *
 * - `ThroughputCapacity`
 *
 * - `WeeklyMaintenanceStartTime`
 */
export const updateFileSystem: (
  input: UpdateFileSystemRequest,
) => Effect.Effect<
  UpdateFileSystemResponse,
  | BadRequest
  | FileSystemNotFound
  | IncompatibleParameterError
  | InternalServerError
  | InvalidNetworkSettings
  | MissingFileSystemConfiguration
  | ServiceLimitExceeded
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFileSystemRequest,
  output: UpdateFileSystemResponse,
  errors: [
    BadRequest,
    FileSystemNotFound,
    IncompatibleParameterError,
    InternalServerError,
    InvalidNetworkSettings,
    MissingFileSystemConfiguration,
    ServiceLimitExceeded,
    UnsupportedOperation,
  ],
}));
/**
 * Lists tags for Amazon FSx resources.
 *
 * When retrieving all tags, you can optionally specify the `MaxResults`
 * parameter to limit the number of tags in a response. If more tags remain, Amazon FSx
 * returns a `NextToken` value in the response. In this case, send a later
 * request with the `NextToken` request parameter set to the value of
 * `NextToken` from the last response.
 *
 * This action is used in an iterative process to retrieve a list of your tags.
 * `ListTagsForResource` is called first without a
 * `NextToken`value. Then the action continues to be called with the
 * `NextToken` parameter set to the value of the last `NextToken`
 * value until a response has no `NextToken`.
 *
 * When using this action, keep the following in mind:
 *
 * - The implementation might return fewer than `MaxResults` file
 * system descriptions while still including a `NextToken`
 * value.
 *
 * - The order of tags returned in the response of one
 * `ListTagsForResource` call and the order of tags returned across
 * the responses of a multi-call iteration is unspecified.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): Effect.Effect<
    ListTagsForResourceResponse,
    | BadRequest
    | InternalServerError
    | NotServiceResourceError
    | ResourceDoesNotSupportTagging
    | ResourceNotFound
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    ListTagsForResourceResponse,
    | BadRequest
    | InternalServerError
    | NotServiceResourceError
    | ResourceDoesNotSupportTagging
    | ResourceNotFound
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    unknown,
    | BadRequest
    | InternalServerError
    | NotServiceResourceError
    | ResourceDoesNotSupportTagging
    | ResourceNotFound
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    BadRequest,
    InternalServerError,
    NotServiceResourceError,
    ResourceDoesNotSupportTagging,
    ResourceNotFound,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates a new Amazon File Cache resource.
 *
 * You can use this operation with a client request token in the request that
 * Amazon File Cache uses to ensure idempotent creation.
 * If a cache with the specified client request token exists and the parameters
 * match, `CreateFileCache` returns the description of the existing
 * cache. If a cache with the specified client request token exists and the
 * parameters don't match, this call returns `IncompatibleParameterError`.
 * If a file cache with the specified client request token doesn't exist,
 * `CreateFileCache` does the following:
 *
 * - Creates a new, empty Amazon File Cache resource with an assigned ID, and
 * an initial lifecycle state of `CREATING`.
 *
 * - Returns the description of the cache in JSON format.
 *
 * The `CreateFileCache` call returns while the cache's lifecycle
 * state is still `CREATING`. You can check the cache creation status
 * by calling the DescribeFileCaches operation, which returns the cache state
 * along with other information.
 */
export const createFileCache: (
  input: CreateFileCacheRequest,
) => Effect.Effect<
  CreateFileCacheResponse,
  | BadRequest
  | IncompatibleParameterError
  | InternalServerError
  | InvalidNetworkSettings
  | InvalidPerUnitStorageThroughput
  | MissingFileCacheConfiguration
  | ServiceLimitExceeded
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFileCacheRequest,
  output: CreateFileCacheResponse,
  errors: [
    BadRequest,
    IncompatibleParameterError,
    InternalServerError,
    InvalidNetworkSettings,
    InvalidPerUnitStorageThroughput,
    MissingFileCacheConfiguration,
    ServiceLimitExceeded,
  ],
}));
/**
 * Tags an Amazon FSx resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | BadRequest
  | InternalServerError
  | NotServiceResourceError
  | ResourceDoesNotSupportTagging
  | ResourceNotFound
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    BadRequest,
    InternalServerError,
    NotServiceResourceError,
    ResourceDoesNotSupportTagging,
    ResourceNotFound,
  ],
}));
/**
 * This action removes a tag from an Amazon FSx resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | BadRequest
  | InternalServerError
  | NotServiceResourceError
  | ResourceDoesNotSupportTagging
  | ResourceNotFound
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    BadRequest,
    InternalServerError,
    NotServiceResourceError,
    ResourceDoesNotSupportTagging,
    ResourceNotFound,
  ],
}));
/**
 * Creates a new Amazon FSx for Lustre, Amazon FSx for Windows File
 * Server, or Amazon FSx for OpenZFS file system from an existing Amazon FSx backup.
 *
 * If a file system with the specified client request token exists and the parameters
 * match, this operation returns the description of the file system. If a file system
 * with the specified client request token exists but the parameters don't match, this
 * call returns `IncompatibleParameterError`. If a file system with the
 * specified client request token doesn't exist, this operation does the following:
 *
 * - Creates a new Amazon FSx file system from backup with an assigned ID,
 * and an initial lifecycle state of `CREATING`.
 *
 * - Returns the description of the file system.
 *
 * Parameters like the Active Directory, default share name, automatic backup, and backup
 * settings default to the parameters of the file system that was backed up, unless
 * overridden. You can explicitly supply other settings.
 *
 * By using the idempotent operation, you can retry a
 * `CreateFileSystemFromBackup` call without the risk of creating an extra
 * file system. This approach can be useful when an initial call fails in a way that makes
 * it unclear whether a file system was created. Examples are if a transport level timeout
 * occurred, or your connection was reset. If you use the same client request token and the
 * initial call created a file system, the client receives a success message as long as the
 * parameters are the same.
 *
 * The `CreateFileSystemFromBackup` call returns while the file system's
 * lifecycle state is still `CREATING`. You can check the file-system
 * creation status by calling the
 * DescribeFileSystems operation, which returns the file system state along
 * with other information.
 */
export const createFileSystemFromBackup: (
  input: CreateFileSystemFromBackupRequest,
) => Effect.Effect<
  CreateFileSystemFromBackupResponse,
  | ActiveDirectoryError
  | BackupNotFound
  | BadRequest
  | IncompatibleParameterError
  | InternalServerError
  | InvalidNetworkSettings
  | InvalidPerUnitStorageThroughput
  | MissingFileSystemConfiguration
  | ServiceLimitExceeded
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFileSystemFromBackupRequest,
  output: CreateFileSystemFromBackupResponse,
  errors: [
    ActiveDirectoryError,
    BackupNotFound,
    BadRequest,
    IncompatibleParameterError,
    InternalServerError,
    InvalidNetworkSettings,
    InvalidPerUnitStorageThroughput,
    MissingFileSystemConfiguration,
    ServiceLimitExceeded,
  ],
}));
/**
 * Creates a new, empty Amazon FSx file system. You can create the following supported
 * Amazon FSx file systems using the `CreateFileSystem` API operation:
 *
 * - Amazon FSx for Lustre
 *
 * - Amazon FSx for NetApp ONTAP
 *
 * - Amazon FSx for OpenZFS
 *
 * - Amazon FSx for Windows File Server
 *
 * This operation requires a client request token in the request that Amazon FSx uses
 * to ensure idempotent creation. This means that calling the operation multiple times with
 * the same client request token has no effect. By using the idempotent operation, you can
 * retry a `CreateFileSystem` operation without the risk of creating an extra
 * file system. This approach can be useful when an initial call fails in a way that makes
 * it unclear whether a file system was created. Examples are if a transport level timeout
 * occurred, or your connection was reset. If you use the same client request token and the
 * initial call created a file system, the client receives success as long as the
 * parameters are the same.
 *
 * If a file system with the specified client request token exists and the parameters
 * match, `CreateFileSystem` returns the description of the existing file
 * system. If a file system with the specified client request token exists and the
 * parameters don't match, this call returns `IncompatibleParameterError`. If a
 * file system with the specified client request token doesn't exist,
 * `CreateFileSystem` does the following:
 *
 * - Creates a new, empty Amazon FSx file system with an assigned ID, and
 * an initial lifecycle state of `CREATING`.
 *
 * - Returns the description of the file system in JSON format.
 *
 * The `CreateFileSystem` call returns while the file system's lifecycle
 * state is still `CREATING`. You can check the file-system creation status
 * by calling the DescribeFileSystems operation, which returns the file system state
 * along with other information.
 */
export const createFileSystem: (
  input: CreateFileSystemRequest,
) => Effect.Effect<
  CreateFileSystemResponse,
  | ActiveDirectoryError
  | BadRequest
  | IncompatibleParameterError
  | InternalServerError
  | InvalidExportPath
  | InvalidImportPath
  | InvalidNetworkSettings
  | InvalidPerUnitStorageThroughput
  | MissingFileSystemConfiguration
  | ServiceLimitExceeded
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateFileSystemRequest,
  output: CreateFileSystemResponse,
  errors: [
    ActiveDirectoryError,
    BadRequest,
    IncompatibleParameterError,
    InternalServerError,
    InvalidExportPath,
    InvalidImportPath,
    InvalidNetworkSettings,
    InvalidPerUnitStorageThroughput,
    MissingFileSystemConfiguration,
    ServiceLimitExceeded,
  ],
}));
/**
 * Copies an existing backup within the same Amazon Web Services account to another Amazon Web Services Region
 * (cross-Region copy) or within the same Amazon Web Services Region (in-Region copy). You can have up to five
 * backup copy requests in progress to a single destination Region per account.
 *
 * You can use cross-Region backup copies for cross-Region disaster recovery. You can
 * periodically take backups and copy them to another Region so that in the event of a
 * disaster in the primary Region, you can restore from backup and recover availability
 * quickly in the other Region. You can make cross-Region copies only within your Amazon Web Services partition. A partition is a grouping of Regions. Amazon Web Services currently
 * has three partitions: `aws` (Standard Regions), `aws-cn` (China
 * Regions), and `aws-us-gov` (Amazon Web Services GovCloud [US] Regions).
 *
 * You can also use backup copies to clone your file dataset to another Region or within
 * the same Region.
 *
 * You can use the `SourceRegion` parameter to specify the Amazon Web Services Region
 * from which the backup will be copied. For example, if you make the call from the
 * `us-west-1` Region and want to copy a backup from the `us-east-2`
 * Region, you specify `us-east-2` in the `SourceRegion` parameter
 * to make a cross-Region copy. If you don't specify a Region, the backup copy is
 * created in the same Region where the request is sent from (in-Region copy).
 *
 * For more information about creating backup copies, see Copying backups
 * in the *Amazon FSx for Windows User Guide*, Copying backups in the Amazon FSx for Lustre User
 * Guide, and Copying backups in the Amazon FSx for OpenZFS User
 * Guide.
 */
export const copyBackup: (
  input: CopyBackupRequest,
) => Effect.Effect<
  CopyBackupResponse,
  | BackupNotFound
  | BadRequest
  | IncompatibleParameterError
  | IncompatibleRegionForMultiAZ
  | InternalServerError
  | InvalidDestinationKmsKey
  | InvalidRegion
  | InvalidSourceKmsKey
  | ServiceLimitExceeded
  | SourceBackupUnavailable
  | UnsupportedOperation
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyBackupRequest,
  output: CopyBackupResponse,
  errors: [
    BackupNotFound,
    BadRequest,
    IncompatibleParameterError,
    IncompatibleRegionForMultiAZ,
    InternalServerError,
    InvalidDestinationKmsKey,
    InvalidRegion,
    InvalidSourceKmsKey,
    ServiceLimitExceeded,
    SourceBackupUnavailable,
    UnsupportedOperation,
  ],
}));
/**
 * Creates an S3 access point and attaches it to an Amazon FSx volume. For FSx for OpenZFS file systems, the
 * volume must be hosted on a high-availability file system, either Single-AZ or Multi-AZ. For more information,
 * see Accessing your data using Amazon S3 access points.
 * in the Amazon FSx for OpenZFS User Guide.
 *
 * The requester requires the following permissions to perform these actions:
 *
 * - `fsx:CreateAndAttachS3AccessPoint`
 *
 * - `s3:CreateAccessPoint`
 *
 * - `s3:GetAccessPoint`
 *
 * - `s3:PutAccessPointPolicy`
 *
 * - `s3:DeleteAccessPoint`
 *
 * The following actions are related to `CreateAndAttachS3AccessPoint`:
 *
 * - DescribeS3AccessPointAttachments
 *
 * - DetachAndDeleteS3AccessPoint
 */
export const createAndAttachS3AccessPoint: (
  input: CreateAndAttachS3AccessPointRequest,
) => Effect.Effect<
  CreateAndAttachS3AccessPointResponse,
  | AccessPointAlreadyOwnedByYou
  | BadRequest
  | IncompatibleParameterError
  | InternalServerError
  | InvalidAccessPoint
  | InvalidRequest
  | TooManyAccessPoints
  | UnsupportedOperation
  | VolumeNotFound
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAndAttachS3AccessPointRequest,
  output: CreateAndAttachS3AccessPointResponse,
  errors: [
    AccessPointAlreadyOwnedByYou,
    BadRequest,
    IncompatibleParameterError,
    InternalServerError,
    InvalidAccessPoint,
    InvalidRequest,
    TooManyAccessPoints,
    UnsupportedOperation,
    VolumeNotFound,
  ],
}));
