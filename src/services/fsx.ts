import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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

//# Schemas
export class DescribeSharedVpcConfigurationRequest extends S.Class<DescribeSharedVpcConfigurationRequest>(
  "DescribeSharedVpcConfigurationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const AlternateDNSNames = S.Array(S.String);
export const UpdateOpenZFSVolumeOptions = S.Array(S.String);
export const DataRepositoryTaskPaths = S.Array(S.String);
export const SubnetIds = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export const BackupIds = S.Array(S.String);
export const DataRepositoryAssociationIds = S.Array(S.String);
export const TaskIds = S.Array(S.String);
export const FileCacheIds = S.Array(S.String);
export const FileSystemIds = S.Array(S.String);
export const S3AccessPointAttachmentNames = S.Array(S.String);
export const SnapshotIds = S.Array(S.String);
export const StorageVirtualMachineIds = S.Array(S.String);
export const VolumeIds = S.Array(S.String);
export const RestoreOpenZFSVolumeOptions = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class AssociateFileSystemAliasesRequest extends S.Class<AssociateFileSystemAliasesRequest>(
  "AssociateFileSystemAliasesRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    FileSystemId: S.String,
    Aliases: AlternateDNSNames,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelDataRepositoryTaskRequest extends S.Class<CancelDataRepositoryTaskRequest>(
  "CancelDataRepositoryTaskRequest",
)(
  { TaskId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CopySnapshotAndUpdateVolumeRequest extends S.Class<CopySnapshotAndUpdateVolumeRequest>(
  "CopySnapshotAndUpdateVolumeRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    VolumeId: S.String,
    SourceSnapshotARN: S.String,
    CopyStrategy: S.optional(S.String),
    Options: S.optional(UpdateOpenZFSVolumeOptions),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const Tags = S.Array(Tag);
export class CreateBackupRequest extends S.Class<CreateBackupRequest>(
  "CreateBackupRequest",
)(
  {
    FileSystemId: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(Tags),
    VolumeId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const DnsIps = S.Array(S.String);
export class SelfManagedActiveDirectoryConfiguration extends S.Class<SelfManagedActiveDirectoryConfiguration>(
  "SelfManagedActiveDirectoryConfiguration",
)({
  DomainName: S.String,
  OrganizationalUnitDistinguishedName: S.optional(S.String),
  FileSystemAdministratorsGroup: S.optional(S.String),
  UserName: S.optional(S.String),
  Password: S.optional(S.String),
  DnsIps: DnsIps,
  DomainJoinServiceAccountSecret: S.optional(S.String),
}) {}
export class WindowsAuditLogCreateConfiguration extends S.Class<WindowsAuditLogCreateConfiguration>(
  "WindowsAuditLogCreateConfiguration",
)({
  FileAccessAuditLogLevel: S.String,
  FileShareAccessAuditLogLevel: S.String,
  AuditLogDestination: S.optional(S.String),
}) {}
export class DiskIopsConfiguration extends S.Class<DiskIopsConfiguration>(
  "DiskIopsConfiguration",
)({ Mode: S.optional(S.String), Iops: S.optional(S.Number) }) {}
export class WindowsFsrmConfiguration extends S.Class<WindowsFsrmConfiguration>(
  "WindowsFsrmConfiguration",
)({
  FsrmServiceEnabled: S.Boolean,
  EventLogDestination: S.optional(S.String),
}) {}
export class CreateFileSystemWindowsConfiguration extends S.Class<CreateFileSystemWindowsConfiguration>(
  "CreateFileSystemWindowsConfiguration",
)({
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
}) {}
export class LustreLogCreateConfiguration extends S.Class<LustreLogCreateConfiguration>(
  "LustreLogCreateConfiguration",
)({ Level: S.String, Destination: S.optional(S.String) }) {}
export const LustreNoSquashNids = S.Array(S.String);
export class LustreRootSquashConfiguration extends S.Class<LustreRootSquashConfiguration>(
  "LustreRootSquashConfiguration",
)({
  RootSquash: S.optional(S.String),
  NoSquashNids: S.optional(LustreNoSquashNids),
}) {}
export class CreateFileSystemLustreMetadataConfiguration extends S.Class<CreateFileSystemLustreMetadataConfiguration>(
  "CreateFileSystemLustreMetadataConfiguration",
)({ Iops: S.optional(S.Number), Mode: S.String }) {}
export class LustreReadCacheConfiguration extends S.Class<LustreReadCacheConfiguration>(
  "LustreReadCacheConfiguration",
)({ SizingMode: S.optional(S.String), SizeGiB: S.optional(S.Number) }) {}
export class CreateFileSystemLustreConfiguration extends S.Class<CreateFileSystemLustreConfiguration>(
  "CreateFileSystemLustreConfiguration",
)({
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
}) {}
export const OpenZFSNfsExportOptions = S.Array(S.String);
export class OpenZFSClientConfiguration extends S.Class<OpenZFSClientConfiguration>(
  "OpenZFSClientConfiguration",
)({ Clients: S.String, Options: OpenZFSNfsExportOptions }) {}
export const OpenZFSClientConfigurations = S.Array(OpenZFSClientConfiguration);
export class OpenZFSNfsExport extends S.Class<OpenZFSNfsExport>(
  "OpenZFSNfsExport",
)({ ClientConfigurations: OpenZFSClientConfigurations }) {}
export const OpenZFSNfsExports = S.Array(OpenZFSNfsExport);
export class OpenZFSUserOrGroupQuota extends S.Class<OpenZFSUserOrGroupQuota>(
  "OpenZFSUserOrGroupQuota",
)({ Type: S.String, Id: S.Number, StorageCapacityQuotaGiB: S.Number }) {}
export const OpenZFSUserAndGroupQuotas = S.Array(OpenZFSUserOrGroupQuota);
export class OpenZFSCreateRootVolumeConfiguration extends S.Class<OpenZFSCreateRootVolumeConfiguration>(
  "OpenZFSCreateRootVolumeConfiguration",
)({
  RecordSizeKiB: S.optional(S.Number),
  DataCompressionType: S.optional(S.String),
  NfsExports: S.optional(OpenZFSNfsExports),
  UserAndGroupQuotas: S.optional(OpenZFSUserAndGroupQuotas),
  CopyTagsToSnapshots: S.optional(S.Boolean),
  ReadOnly: S.optional(S.Boolean),
}) {}
export const RouteTableIds = S.Array(S.String);
export class OpenZFSReadCacheConfiguration extends S.Class<OpenZFSReadCacheConfiguration>(
  "OpenZFSReadCacheConfiguration",
)({ SizingMode: S.optional(S.String), SizeGiB: S.optional(S.Number) }) {}
export class CreateFileSystemOpenZFSConfiguration extends S.Class<CreateFileSystemOpenZFSConfiguration>(
  "CreateFileSystemOpenZFSConfiguration",
)({
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
}) {}
export class CreateFileSystemFromBackupRequest extends S.Class<CreateFileSystemFromBackupRequest>(
  "CreateFileSystemFromBackupRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSnapshotRequest extends S.Class<CreateSnapshotRequest>(
  "CreateSnapshotRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    Name: S.String,
    VolumeId: S.String,
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TieringPolicy extends S.Class<TieringPolicy>("TieringPolicy")({
  CoolingPeriod: S.optional(S.Number),
  Name: S.optional(S.String),
}) {}
export class AutocommitPeriod extends S.Class<AutocommitPeriod>(
  "AutocommitPeriod",
)({ Type: S.String, Value: S.optional(S.Number) }) {}
export class RetentionPeriod extends S.Class<RetentionPeriod>(
  "RetentionPeriod",
)({ Type: S.String, Value: S.optional(S.Number) }) {}
export class SnaplockRetentionPeriod extends S.Class<SnaplockRetentionPeriod>(
  "SnaplockRetentionPeriod",
)({
  DefaultRetention: RetentionPeriod,
  MinimumRetention: RetentionPeriod,
  MaximumRetention: RetentionPeriod,
}) {}
export class CreateSnaplockConfiguration extends S.Class<CreateSnaplockConfiguration>(
  "CreateSnaplockConfiguration",
)({
  AuditLogVolume: S.optional(S.Boolean),
  AutocommitPeriod: S.optional(AutocommitPeriod),
  PrivilegedDelete: S.optional(S.String),
  RetentionPeriod: S.optional(SnaplockRetentionPeriod),
  SnaplockType: S.String,
  VolumeAppendModeEnabled: S.optional(S.Boolean),
}) {}
export const Aggregates = S.Array(S.String);
export class CreateAggregateConfiguration extends S.Class<CreateAggregateConfiguration>(
  "CreateAggregateConfiguration",
)({
  Aggregates: S.optional(Aggregates),
  ConstituentsPerAggregate: S.optional(S.Number),
}) {}
export class CreateOntapVolumeConfiguration extends S.Class<CreateOntapVolumeConfiguration>(
  "CreateOntapVolumeConfiguration",
)({
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
}) {}
export class CreateVolumeFromBackupRequest extends S.Class<CreateVolumeFromBackupRequest>(
  "CreateVolumeFromBackupRequest",
)(
  {
    BackupId: S.String,
    ClientRequestToken: S.optional(S.String),
    Name: S.String,
    OntapConfiguration: S.optional(CreateOntapVolumeConfiguration),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBackupRequest extends S.Class<DeleteBackupRequest>(
  "DeleteBackupRequest",
)(
  { BackupId: S.String, ClientRequestToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDataRepositoryAssociationRequest extends S.Class<DeleteDataRepositoryAssociationRequest>(
  "DeleteDataRepositoryAssociationRequest",
)(
  {
    AssociationId: S.String,
    ClientRequestToken: S.optional(S.String),
    DeleteDataInFileSystem: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFileCacheRequest extends S.Class<DeleteFileCacheRequest>(
  "DeleteFileCacheRequest",
)(
  { FileCacheId: S.String, ClientRequestToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSnapshotRequest extends S.Class<DeleteSnapshotRequest>(
  "DeleteSnapshotRequest",
)(
  { ClientRequestToken: S.optional(S.String), SnapshotId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteStorageVirtualMachineRequest extends S.Class<DeleteStorageVirtualMachineRequest>(
  "DeleteStorageVirtualMachineRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    StorageVirtualMachineId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const FilterValues = S.Array(S.String);
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.optional(S.String),
  Values: S.optional(FilterValues),
}) {}
export const Filters = S.Array(Filter);
export class DescribeDataRepositoryAssociationsRequest extends S.Class<DescribeDataRepositoryAssociationsRequest>(
  "DescribeDataRepositoryAssociationsRequest",
)(
  {
    AssociationIds: S.optional(DataRepositoryAssociationIds),
    Filters: S.optional(Filters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFileCachesRequest extends S.Class<DescribeFileCachesRequest>(
  "DescribeFileCachesRequest",
)(
  {
    FileCacheIds: S.optional(FileCacheIds),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFileSystemAliasesRequest extends S.Class<DescribeFileSystemAliasesRequest>(
  "DescribeFileSystemAliasesRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    FileSystemId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFileSystemsRequest extends S.Class<DescribeFileSystemsRequest>(
  "DescribeFileSystemsRequest",
)(
  {
    FileSystemIds: S.optional(FileSystemIds),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSharedVpcConfigurationResponse extends S.Class<DescribeSharedVpcConfigurationResponse>(
  "DescribeSharedVpcConfigurationResponse",
)({
  EnableFsxRouteTableUpdatesFromParticipantAccounts: S.optional(S.String),
}) {}
export class DetachAndDeleteS3AccessPointRequest extends S.Class<DetachAndDeleteS3AccessPointRequest>(
  "DetachAndDeleteS3AccessPointRequest",
)(
  { ClientRequestToken: S.optional(S.String), Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateFileSystemAliasesRequest extends S.Class<DisassociateFileSystemAliasesRequest>(
  "DisassociateFileSystemAliasesRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    FileSystemId: S.String,
    Aliases: AlternateDNSNames,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    ResourceARN: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ReleaseFileSystemNfsV3LocksRequest extends S.Class<ReleaseFileSystemNfsV3LocksRequest>(
  "ReleaseFileSystemNfsV3LocksRequest",
)(
  { FileSystemId: S.String, ClientRequestToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreVolumeFromSnapshotRequest extends S.Class<RestoreVolumeFromSnapshotRequest>(
  "RestoreVolumeFromSnapshotRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    VolumeId: S.String,
    SnapshotId: S.String,
    Options: S.optional(RestoreOpenZFSVolumeOptions),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMisconfiguredStateRecoveryRequest extends S.Class<StartMisconfiguredStateRecoveryRequest>(
  "StartMisconfiguredStateRecoveryRequest",
)(
  { ClientRequestToken: S.optional(S.String), FileSystemId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: Tags },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const EventTypes = S.Array(S.String);
export class AutoImportPolicy extends S.Class<AutoImportPolicy>(
  "AutoImportPolicy",
)({ Events: S.optional(EventTypes) }) {}
export class AutoExportPolicy extends S.Class<AutoExportPolicy>(
  "AutoExportPolicy",
)({ Events: S.optional(EventTypes) }) {}
export class S3DataRepositoryConfiguration extends S.Class<S3DataRepositoryConfiguration>(
  "S3DataRepositoryConfiguration",
)({
  AutoImportPolicy: S.optional(AutoImportPolicy),
  AutoExportPolicy: S.optional(AutoExportPolicy),
}) {}
export class UpdateDataRepositoryAssociationRequest extends S.Class<UpdateDataRepositoryAssociationRequest>(
  "UpdateDataRepositoryAssociationRequest",
)(
  {
    AssociationId: S.String,
    ClientRequestToken: S.optional(S.String),
    ImportedFileChunkSize: S.optional(S.Number),
    S3: S.optional(S3DataRepositoryConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSharedVpcConfigurationRequest extends S.Class<UpdateSharedVpcConfigurationRequest>(
  "UpdateSharedVpcConfigurationRequest",
)(
  {
    EnableFsxRouteTableUpdatesFromParticipantAccounts: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSnapshotRequest extends S.Class<UpdateSnapshotRequest>(
  "UpdateSnapshotRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    Name: S.String,
    SnapshotId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const SubDirectoriesPaths = S.Array(S.String);
export const DeleteFileSystemOpenZFSOptions = S.Array(S.String);
export const DeleteOpenZFSVolumeOptions = S.Array(S.String);
export const DataRepositoryTaskFilterValues = S.Array(S.String);
export const S3AccessPointAttachmentsFilterValues = S.Array(S.String);
export const SnapshotFilterValues = S.Array(S.String);
export const StorageVirtualMachineFilterValues = S.Array(S.String);
export const VolumeFilterValues = S.Array(S.String);
export class CompletionReport extends S.Class<CompletionReport>(
  "CompletionReport",
)({
  Enabled: S.Boolean,
  Path: S.optional(S.String),
  Format: S.optional(S.String),
  Scope: S.optional(S.String),
}) {}
export class CreateFileSystemOntapConfiguration extends S.Class<CreateFileSystemOntapConfiguration>(
  "CreateFileSystemOntapConfiguration",
)({
  AutomaticBackupRetentionDays: S.optional(S.Number),
  DailyAutomaticBackupStartTime: S.optional(S.String),
  DeploymentType: S.String,
  EndpointIpAddressRange: S.optional(S.String),
  FsxAdminPassword: S.optional(S.String),
  DiskIopsConfiguration: S.optional(DiskIopsConfiguration),
  PreferredSubnetId: S.optional(S.String),
  RouteTableIds: S.optional(RouteTableIds),
  ThroughputCapacity: S.optional(S.Number),
  WeeklyMaintenanceStartTime: S.optional(S.String),
  HAPairs: S.optional(S.Number),
  ThroughputCapacityPerHAPair: S.optional(S.Number),
  EndpointIpv6AddressRange: S.optional(S.String),
}) {}
export class CreateSvmActiveDirectoryConfiguration extends S.Class<CreateSvmActiveDirectoryConfiguration>(
  "CreateSvmActiveDirectoryConfiguration",
)({
  NetBiosName: S.String,
  SelfManagedActiveDirectoryConfiguration: S.optional(
    SelfManagedActiveDirectoryConfiguration,
  ),
}) {}
export class DeleteFileSystemWindowsConfiguration extends S.Class<DeleteFileSystemWindowsConfiguration>(
  "DeleteFileSystemWindowsConfiguration",
)({
  SkipFinalBackup: S.optional(S.Boolean),
  FinalBackupTags: S.optional(Tags),
}) {}
export class DeleteFileSystemLustreConfiguration extends S.Class<DeleteFileSystemLustreConfiguration>(
  "DeleteFileSystemLustreConfiguration",
)({
  SkipFinalBackup: S.optional(S.Boolean),
  FinalBackupTags: S.optional(Tags),
}) {}
export class DeleteFileSystemOpenZFSConfiguration extends S.Class<DeleteFileSystemOpenZFSConfiguration>(
  "DeleteFileSystemOpenZFSConfiguration",
)({
  SkipFinalBackup: S.optional(S.Boolean),
  FinalBackupTags: S.optional(Tags),
  Options: S.optional(DeleteFileSystemOpenZFSOptions),
}) {}
export class DeleteVolumeOntapConfiguration extends S.Class<DeleteVolumeOntapConfiguration>(
  "DeleteVolumeOntapConfiguration",
)({
  SkipFinalBackup: S.optional(S.Boolean),
  FinalBackupTags: S.optional(Tags),
  BypassSnaplockEnterpriseRetention: S.optional(S.Boolean),
}) {}
export class DeleteVolumeOpenZFSConfiguration extends S.Class<DeleteVolumeOpenZFSConfiguration>(
  "DeleteVolumeOpenZFSConfiguration",
)({ Options: S.optional(DeleteOpenZFSVolumeOptions) }) {}
export class DataRepositoryTaskFilter extends S.Class<DataRepositoryTaskFilter>(
  "DataRepositoryTaskFilter",
)({
  Name: S.optional(S.String),
  Values: S.optional(DataRepositoryTaskFilterValues),
}) {}
export const DataRepositoryTaskFilters = S.Array(DataRepositoryTaskFilter);
export class FileSystemFailureDetails extends S.Class<FileSystemFailureDetails>(
  "FileSystemFailureDetails",
)({ Message: S.optional(S.String) }) {}
export const NetworkInterfaceIds = S.Array(S.String);
export class SelfManagedActiveDirectoryAttributes extends S.Class<SelfManagedActiveDirectoryAttributes>(
  "SelfManagedActiveDirectoryAttributes",
)({
  DomainName: S.optional(S.String),
  OrganizationalUnitDistinguishedName: S.optional(S.String),
  FileSystemAdministratorsGroup: S.optional(S.String),
  UserName: S.optional(S.String),
  DnsIps: S.optional(DnsIps),
  DomainJoinServiceAccountSecret: S.optional(S.String),
}) {}
export const FileSystemMaintenanceOperations = S.Array(S.String);
export class Alias extends S.Class<Alias>("Alias")({
  Name: S.optional(S.String),
  Lifecycle: S.optional(S.String),
}) {}
export const Aliases = S.Array(Alias);
export class WindowsAuditLogConfiguration extends S.Class<WindowsAuditLogConfiguration>(
  "WindowsAuditLogConfiguration",
)({
  FileAccessAuditLogLevel: S.String,
  FileShareAccessAuditLogLevel: S.String,
  AuditLogDestination: S.optional(S.String),
}) {}
export class WindowsFileSystemConfiguration extends S.Class<WindowsFileSystemConfiguration>(
  "WindowsFileSystemConfiguration",
)({
  ActiveDirectoryId: S.optional(S.String),
  SelfManagedActiveDirectoryConfiguration: S.optional(
    SelfManagedActiveDirectoryAttributes,
  ),
  DeploymentType: S.optional(S.String),
  RemoteAdministrationEndpoint: S.optional(S.String),
  PreferredSubnetId: S.optional(S.String),
  PreferredFileServerIp: S.optional(S.String),
  ThroughputCapacity: S.optional(S.Number),
  MaintenanceOperationsInProgress: S.optional(FileSystemMaintenanceOperations),
  WeeklyMaintenanceStartTime: S.optional(S.String),
  DailyAutomaticBackupStartTime: S.optional(S.String),
  AutomaticBackupRetentionDays: S.optional(S.Number),
  CopyTagsToBackups: S.optional(S.Boolean),
  Aliases: S.optional(Aliases),
  AuditLogConfiguration: S.optional(WindowsAuditLogConfiguration),
  DiskIopsConfiguration: S.optional(DiskIopsConfiguration),
  PreferredFileServerIpv6: S.optional(S.String),
  FsrmConfiguration: S.optional(WindowsFsrmConfiguration),
}) {}
export class DataRepositoryFailureDetails extends S.Class<DataRepositoryFailureDetails>(
  "DataRepositoryFailureDetails",
)({ Message: S.optional(S.String) }) {}
export class DataRepositoryConfiguration extends S.Class<DataRepositoryConfiguration>(
  "DataRepositoryConfiguration",
)({
  Lifecycle: S.optional(S.String),
  ImportPath: S.optional(S.String),
  ExportPath: S.optional(S.String),
  ImportedFileChunkSize: S.optional(S.Number),
  AutoImportPolicy: S.optional(S.String),
  FailureDetails: S.optional(DataRepositoryFailureDetails),
}) {}
export class LustreLogConfiguration extends S.Class<LustreLogConfiguration>(
  "LustreLogConfiguration",
)({ Level: S.String, Destination: S.optional(S.String) }) {}
export class FileSystemLustreMetadataConfiguration extends S.Class<FileSystemLustreMetadataConfiguration>(
  "FileSystemLustreMetadataConfiguration",
)({ Iops: S.optional(S.Number), Mode: S.String }) {}
export class LustreFileSystemConfiguration extends S.Class<LustreFileSystemConfiguration>(
  "LustreFileSystemConfiguration",
)({
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
}) {}
export const OntapEndpointIpAddresses = S.Array(S.String);
export class FileSystemEndpoint extends S.Class<FileSystemEndpoint>(
  "FileSystemEndpoint",
)({
  DNSName: S.optional(S.String),
  IpAddresses: S.optional(OntapEndpointIpAddresses),
  Ipv6Addresses: S.optional(OntapEndpointIpAddresses),
}) {}
export class FileSystemEndpoints extends S.Class<FileSystemEndpoints>(
  "FileSystemEndpoints",
)({
  Intercluster: S.optional(FileSystemEndpoint),
  Management: S.optional(FileSystemEndpoint),
}) {}
export class OntapFileSystemConfiguration extends S.Class<OntapFileSystemConfiguration>(
  "OntapFileSystemConfiguration",
)({
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
  FsxAdminPassword: S.optional(S.String),
  HAPairs: S.optional(S.Number),
  ThroughputCapacityPerHAPair: S.optional(S.Number),
  EndpointIpv6AddressRange: S.optional(S.String),
}) {}
export class OpenZFSFileSystemConfiguration extends S.Class<OpenZFSFileSystemConfiguration>(
  "OpenZFSFileSystemConfiguration",
)({
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
}) {}
export class FileSystem extends S.Class<FileSystem>("FileSystem")({
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
  AdministrativeActions: S.optional(S.suspend(() => AdministrativeActions)),
  OntapConfiguration: S.optional(OntapFileSystemConfiguration),
  FileSystemTypeVersion: S.optional(S.String),
  OpenZFSConfiguration: S.optional(OpenZFSFileSystemConfiguration),
  NetworkType: S.optional(S.String),
}) {}
export const FileSystems = S.Array(
  S.suspend((): S.Schema<FileSystem, any> => FileSystem),
);
export class S3AccessPointAttachmentsFilter extends S.Class<S3AccessPointAttachmentsFilter>(
  "S3AccessPointAttachmentsFilter",
)({
  Name: S.optional(S.String),
  Values: S.optional(S3AccessPointAttachmentsFilterValues),
}) {}
export const S3AccessPointAttachmentsFilters = S.Array(
  S3AccessPointAttachmentsFilter,
);
export class SnapshotFilter extends S.Class<SnapshotFilter>("SnapshotFilter")({
  Name: S.optional(S.String),
  Values: S.optional(SnapshotFilterValues),
}) {}
export const SnapshotFilters = S.Array(SnapshotFilter);
export class StorageVirtualMachineFilter extends S.Class<StorageVirtualMachineFilter>(
  "StorageVirtualMachineFilter",
)({
  Name: S.optional(S.String),
  Values: S.optional(StorageVirtualMachineFilterValues),
}) {}
export const StorageVirtualMachineFilters = S.Array(
  StorageVirtualMachineFilter,
);
export class VolumeFilter extends S.Class<VolumeFilter>("VolumeFilter")({
  Name: S.optional(S.String),
  Values: S.optional(VolumeFilterValues),
}) {}
export const VolumeFilters = S.Array(VolumeFilter);
export class UpdateFileCacheLustreConfiguration extends S.Class<UpdateFileCacheLustreConfiguration>(
  "UpdateFileCacheLustreConfiguration",
)({ WeeklyMaintenanceStartTime: S.optional(S.String) }) {}
export class UpdateFileSystemOntapConfiguration extends S.Class<UpdateFileSystemOntapConfiguration>(
  "UpdateFileSystemOntapConfiguration",
)({
  AutomaticBackupRetentionDays: S.optional(S.Number),
  DailyAutomaticBackupStartTime: S.optional(S.String),
  FsxAdminPassword: S.optional(S.String),
  WeeklyMaintenanceStartTime: S.optional(S.String),
  DiskIopsConfiguration: S.optional(DiskIopsConfiguration),
  ThroughputCapacity: S.optional(S.Number),
  AddRouteTableIds: S.optional(RouteTableIds),
  RemoveRouteTableIds: S.optional(RouteTableIds),
  ThroughputCapacityPerHAPair: S.optional(S.Number),
  HAPairs: S.optional(S.Number),
  EndpointIpv6AddressRange: S.optional(S.String),
}) {}
export class UpdateFileSystemOpenZFSConfiguration extends S.Class<UpdateFileSystemOpenZFSConfiguration>(
  "UpdateFileSystemOpenZFSConfiguration",
)({
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
}) {}
export class SelfManagedActiveDirectoryConfigurationUpdates extends S.Class<SelfManagedActiveDirectoryConfigurationUpdates>(
  "SelfManagedActiveDirectoryConfigurationUpdates",
)({
  UserName: S.optional(S.String),
  Password: S.optional(S.String),
  DnsIps: S.optional(DnsIps),
  DomainName: S.optional(S.String),
  OrganizationalUnitDistinguishedName: S.optional(S.String),
  FileSystemAdministratorsGroup: S.optional(S.String),
  DomainJoinServiceAccountSecret: S.optional(S.String),
}) {}
export class UpdateSvmActiveDirectoryConfiguration extends S.Class<UpdateSvmActiveDirectoryConfiguration>(
  "UpdateSvmActiveDirectoryConfiguration",
)({
  SelfManagedActiveDirectoryConfiguration: S.optional(
    SelfManagedActiveDirectoryConfigurationUpdates,
  ),
  NetBiosName: S.optional(S.String),
}) {}
export class UpdateOpenZFSVolumeConfiguration extends S.Class<UpdateOpenZFSVolumeConfiguration>(
  "UpdateOpenZFSVolumeConfiguration",
)({
  StorageCapacityReservationGiB: S.optional(S.Number),
  StorageCapacityQuotaGiB: S.optional(S.Number),
  RecordSizeKiB: S.optional(S.Number),
  DataCompressionType: S.optional(S.String),
  NfsExports: S.optional(OpenZFSNfsExports),
  UserAndGroupQuotas: S.optional(OpenZFSUserAndGroupQuotas),
  ReadOnly: S.optional(S.Boolean),
}) {}
export const RepositoryDnsIps = S.Array(S.String);
export class CancelDataRepositoryTaskResponse extends S.Class<CancelDataRepositoryTaskResponse>(
  "CancelDataRepositoryTaskResponse",
)({ Lifecycle: S.optional(S.String), TaskId: S.optional(S.String) }) {}
export class CopyBackupRequest extends S.Class<CopyBackupRequest>(
  "CopyBackupRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    SourceBackupId: S.String,
    SourceRegion: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    CopyTags: S.optional(S.Boolean),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateStorageVirtualMachineRequest extends S.Class<CreateStorageVirtualMachineRequest>(
  "CreateStorageVirtualMachineRequest",
)(
  {
    ActiveDirectoryConfiguration: S.optional(
      CreateSvmActiveDirectoryConfiguration,
    ),
    ClientRequestToken: S.optional(S.String),
    FileSystemId: S.String,
    Name: S.String,
    SvmAdminPassword: S.optional(S.String),
    Tags: S.optional(Tags),
    RootVolumeSecurityStyle: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBackupResponse extends S.Class<DeleteBackupResponse>(
  "DeleteBackupResponse",
)({ BackupId: S.optional(S.String), Lifecycle: S.optional(S.String) }) {}
export class DeleteDataRepositoryAssociationResponse extends S.Class<DeleteDataRepositoryAssociationResponse>(
  "DeleteDataRepositoryAssociationResponse",
)({
  AssociationId: S.optional(S.String),
  Lifecycle: S.optional(S.String),
  DeleteDataInFileSystem: S.optional(S.Boolean),
}) {}
export class DeleteFileCacheResponse extends S.Class<DeleteFileCacheResponse>(
  "DeleteFileCacheResponse",
)({ FileCacheId: S.optional(S.String), Lifecycle: S.optional(S.String) }) {}
export class DeleteFileSystemRequest extends S.Class<DeleteFileSystemRequest>(
  "DeleteFileSystemRequest",
)(
  {
    FileSystemId: S.String,
    ClientRequestToken: S.optional(S.String),
    WindowsConfiguration: S.optional(DeleteFileSystemWindowsConfiguration),
    LustreConfiguration: S.optional(DeleteFileSystemLustreConfiguration),
    OpenZFSConfiguration: S.optional(DeleteFileSystemOpenZFSConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSnapshotResponse extends S.Class<DeleteSnapshotResponse>(
  "DeleteSnapshotResponse",
)({ SnapshotId: S.optional(S.String), Lifecycle: S.optional(S.String) }) {}
export class DeleteStorageVirtualMachineResponse extends S.Class<DeleteStorageVirtualMachineResponse>(
  "DeleteStorageVirtualMachineResponse",
)({
  StorageVirtualMachineId: S.optional(S.String),
  Lifecycle: S.optional(S.String),
}) {}
export class DeleteVolumeRequest extends S.Class<DeleteVolumeRequest>(
  "DeleteVolumeRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    VolumeId: S.String,
    OntapConfiguration: S.optional(DeleteVolumeOntapConfiguration),
    OpenZFSConfiguration: S.optional(DeleteVolumeOpenZFSConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBackupsRequest extends S.Class<DescribeBackupsRequest>(
  "DescribeBackupsRequest",
)(
  {
    BackupIds: S.optional(BackupIds),
    Filters: S.optional(Filters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDataRepositoryTasksRequest extends S.Class<DescribeDataRepositoryTasksRequest>(
  "DescribeDataRepositoryTasksRequest",
)(
  {
    TaskIds: S.optional(TaskIds),
    Filters: S.optional(DataRepositoryTaskFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFileSystemAliasesResponse extends S.Class<DescribeFileSystemAliasesResponse>(
  "DescribeFileSystemAliasesResponse",
)({ Aliases: S.optional(Aliases), NextToken: S.optional(S.String) }) {}
export class DescribeFileSystemsResponse extends S.Class<DescribeFileSystemsResponse>(
  "DescribeFileSystemsResponse",
)({ FileSystems: S.optional(FileSystems), NextToken: S.optional(S.String) }) {}
export class DescribeS3AccessPointAttachmentsRequest extends S.Class<DescribeS3AccessPointAttachmentsRequest>(
  "DescribeS3AccessPointAttachmentsRequest",
)(
  {
    Names: S.optional(S3AccessPointAttachmentNames),
    Filters: S.optional(S3AccessPointAttachmentsFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSnapshotsRequest extends S.Class<DescribeSnapshotsRequest>(
  "DescribeSnapshotsRequest",
)(
  {
    SnapshotIds: S.optional(SnapshotIds),
    Filters: S.optional(SnapshotFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    IncludeShared: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStorageVirtualMachinesRequest extends S.Class<DescribeStorageVirtualMachinesRequest>(
  "DescribeStorageVirtualMachinesRequest",
)(
  {
    StorageVirtualMachineIds: S.optional(StorageVirtualMachineIds),
    Filters: S.optional(StorageVirtualMachineFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeVolumesRequest extends S.Class<DescribeVolumesRequest>(
  "DescribeVolumesRequest",
)(
  {
    VolumeIds: S.optional(VolumeIds),
    Filters: S.optional(VolumeFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachAndDeleteS3AccessPointResponse extends S.Class<DetachAndDeleteS3AccessPointResponse>(
  "DetachAndDeleteS3AccessPointResponse",
)({ Lifecycle: S.optional(S.String), Name: S.optional(S.String) }) {}
export class DisassociateFileSystemAliasesResponse extends S.Class<DisassociateFileSystemAliasesResponse>(
  "DisassociateFileSystemAliasesResponse",
)({ Aliases: S.optional(Aliases) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags), NextToken: S.optional(S.String) }) {}
export class ReleaseFileSystemNfsV3LocksResponse extends S.Class<ReleaseFileSystemNfsV3LocksResponse>(
  "ReleaseFileSystemNfsV3LocksResponse",
)({ FileSystem: S.optional(FileSystem) }) {}
export type AdministrativeActions = AdministrativeAction[];
export const AdministrativeActions = S.Array(
  S.suspend((): S.Schema<AdministrativeAction, any> => AdministrativeAction),
) as any as S.Schema<AdministrativeActions>;
export class RestoreVolumeFromSnapshotResponse extends S.Class<RestoreVolumeFromSnapshotResponse>(
  "RestoreVolumeFromSnapshotResponse",
)({
  VolumeId: S.optional(S.String),
  Lifecycle: S.optional(S.String),
  AdministrativeActions: S.optional(AdministrativeActions),
}) {}
export class StartMisconfiguredStateRecoveryResponse extends S.Class<StartMisconfiguredStateRecoveryResponse>(
  "StartMisconfiguredStateRecoveryResponse",
)({ FileSystem: S.optional(FileSystem) }) {}
export class NFSDataRepositoryConfiguration extends S.Class<NFSDataRepositoryConfiguration>(
  "NFSDataRepositoryConfiguration",
)({
  Version: S.String,
  DnsIps: S.optional(RepositoryDnsIps),
  AutoExportPolicy: S.optional(AutoExportPolicy),
}) {}
export class DataRepositoryAssociation extends S.Class<DataRepositoryAssociation>(
  "DataRepositoryAssociation",
)({
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
}) {}
export class UpdateDataRepositoryAssociationResponse extends S.Class<UpdateDataRepositoryAssociationResponse>(
  "UpdateDataRepositoryAssociationResponse",
)({ Association: S.optional(DataRepositoryAssociation) }) {}
export class UpdateFileCacheRequest extends S.Class<UpdateFileCacheRequest>(
  "UpdateFileCacheRequest",
)(
  {
    FileCacheId: S.String,
    ClientRequestToken: S.optional(S.String),
    LustreConfiguration: S.optional(UpdateFileCacheLustreConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSharedVpcConfigurationResponse extends S.Class<UpdateSharedVpcConfigurationResponse>(
  "UpdateSharedVpcConfigurationResponse",
)({
  EnableFsxRouteTableUpdatesFromParticipantAccounts: S.optional(S.String),
}) {}
export class LifecycleTransitionReason extends S.Class<LifecycleTransitionReason>(
  "LifecycleTransitionReason",
)({ Message: S.optional(S.String) }) {}
export class Snapshot extends S.Class<Snapshot>("Snapshot")({
  ResourceARN: S.optional(S.String),
  SnapshotId: S.optional(S.String),
  Name: S.optional(S.String),
  VolumeId: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Lifecycle: S.optional(S.String),
  LifecycleTransitionReason: S.optional(LifecycleTransitionReason),
  Tags: S.optional(Tags),
  AdministrativeActions: S.optional(S.suspend(() => AdministrativeActions)),
}) {}
export class UpdateSnapshotResponse extends S.Class<UpdateSnapshotResponse>(
  "UpdateSnapshotResponse",
)({ Snapshot: S.optional(Snapshot) }) {}
export class UpdateStorageVirtualMachineRequest extends S.Class<UpdateStorageVirtualMachineRequest>(
  "UpdateStorageVirtualMachineRequest",
)(
  {
    ActiveDirectoryConfiguration: S.optional(
      UpdateSvmActiveDirectoryConfiguration,
    ),
    ClientRequestToken: S.optional(S.String),
    StorageVirtualMachineId: S.String,
    SvmAdminPassword: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class S3AccessPointVpcConfiguration extends S.Class<S3AccessPointVpcConfiguration>(
  "S3AccessPointVpcConfiguration",
)({ VpcId: S.optional(S.String) }) {}
export class DurationSinceLastAccess extends S.Class<DurationSinceLastAccess>(
  "DurationSinceLastAccess",
)({ Unit: S.optional(S.String), Value: S.optional(S.Number) }) {}
export class FileCacheLustreMetadataConfiguration extends S.Class<FileCacheLustreMetadataConfiguration>(
  "FileCacheLustreMetadataConfiguration",
)({ StorageCapacity: S.Number }) {}
export class FileCacheNFSConfiguration extends S.Class<FileCacheNFSConfiguration>(
  "FileCacheNFSConfiguration",
)({ Version: S.String, DnsIps: S.optional(RepositoryDnsIps) }) {}
export class CreateOpenZFSOriginSnapshotConfiguration extends S.Class<CreateOpenZFSOriginSnapshotConfiguration>(
  "CreateOpenZFSOriginSnapshotConfiguration",
)({ SnapshotARN: S.String, CopyStrategy: S.String }) {}
export class UpdateFileSystemLustreMetadataConfiguration extends S.Class<UpdateFileSystemLustreMetadataConfiguration>(
  "UpdateFileSystemLustreMetadataConfiguration",
)({ Iops: S.optional(S.Number), Mode: S.optional(S.String) }) {}
export class UpdateSnaplockConfiguration extends S.Class<UpdateSnaplockConfiguration>(
  "UpdateSnaplockConfiguration",
)({
  AuditLogVolume: S.optional(S.Boolean),
  AutocommitPeriod: S.optional(AutocommitPeriod),
  PrivilegedDelete: S.optional(S.String),
  RetentionPeriod: S.optional(SnaplockRetentionPeriod),
  VolumeAppendModeEnabled: S.optional(S.Boolean),
}) {}
export const FileSystemSecondaryGIDs = S.Array(S.Number);
export class CreateAndAttachS3AccessPointS3Configuration extends S.Class<CreateAndAttachS3AccessPointS3Configuration>(
  "CreateAndAttachS3AccessPointS3Configuration",
)({
  VpcConfiguration: S.optional(S3AccessPointVpcConfiguration),
  Policy: S.optional(S.String),
}) {}
export class ReleaseConfiguration extends S.Class<ReleaseConfiguration>(
  "ReleaseConfiguration",
)({ DurationSinceLastAccess: S.optional(DurationSinceLastAccess) }) {}
export class CreateFileCacheLustreConfiguration extends S.Class<CreateFileCacheLustreConfiguration>(
  "CreateFileCacheLustreConfiguration",
)({
  PerUnitStorageThroughput: S.Number,
  DeploymentType: S.String,
  WeeklyMaintenanceStartTime: S.optional(S.String),
  MetadataConfiguration: FileCacheLustreMetadataConfiguration,
}) {}
export class FileCacheDataRepositoryAssociation extends S.Class<FileCacheDataRepositoryAssociation>(
  "FileCacheDataRepositoryAssociation",
)({
  FileCachePath: S.String,
  DataRepositoryPath: S.String,
  DataRepositorySubdirectories: S.optional(SubDirectoriesPaths),
  NFS: S.optional(FileCacheNFSConfiguration),
}) {}
export const CreateFileCacheDataRepositoryAssociations = S.Array(
  FileCacheDataRepositoryAssociation,
);
export class BackupFailureDetails extends S.Class<BackupFailureDetails>(
  "BackupFailureDetails",
)({ Message: S.optional(S.String) }) {}
export class ActiveDirectoryBackupAttributes extends S.Class<ActiveDirectoryBackupAttributes>(
  "ActiveDirectoryBackupAttributes",
)({
  DomainName: S.optional(S.String),
  ActiveDirectoryId: S.optional(S.String),
  ResourceARN: S.optional(S.String),
}) {}
export class SnaplockConfiguration extends S.Class<SnaplockConfiguration>(
  "SnaplockConfiguration",
)({
  AuditLogVolume: S.optional(S.Boolean),
  AutocommitPeriod: S.optional(AutocommitPeriod),
  PrivilegedDelete: S.optional(S.String),
  RetentionPeriod: S.optional(SnaplockRetentionPeriod),
  SnaplockType: S.optional(S.String),
  VolumeAppendModeEnabled: S.optional(S.Boolean),
}) {}
export class AggregateConfiguration extends S.Class<AggregateConfiguration>(
  "AggregateConfiguration",
)({
  Aggregates: S.optional(Aggregates),
  TotalConstituents: S.optional(S.Number),
}) {}
export class OntapVolumeConfiguration extends S.Class<OntapVolumeConfiguration>(
  "OntapVolumeConfiguration",
)({
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
}) {}
export class OpenZFSOriginSnapshotConfiguration extends S.Class<OpenZFSOriginSnapshotConfiguration>(
  "OpenZFSOriginSnapshotConfiguration",
)({ SnapshotARN: S.optional(S.String), CopyStrategy: S.optional(S.String) }) {}
export class OpenZFSVolumeConfiguration extends S.Class<OpenZFSVolumeConfiguration>(
  "OpenZFSVolumeConfiguration",
)({
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
}) {}
export class Volume extends S.Class<Volume>("Volume")({
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
  AdministrativeActions: S.optional(S.suspend(() => AdministrativeActions)),
  OpenZFSConfiguration: S.optional(OpenZFSVolumeConfiguration),
}) {}
export class Backup extends S.Class<Backup>("Backup")({
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
}) {}
export const Backups = S.Array(Backup);
export const Snapshots = S.Array(
  S.suspend((): S.Schema<Snapshot, any> => Snapshot),
);
export class SvmActiveDirectoryConfiguration extends S.Class<SvmActiveDirectoryConfiguration>(
  "SvmActiveDirectoryConfiguration",
)({
  NetBiosName: S.optional(S.String),
  SelfManagedActiveDirectoryConfiguration: S.optional(
    SelfManagedActiveDirectoryAttributes,
  ),
}) {}
export class SvmEndpoint extends S.Class<SvmEndpoint>("SvmEndpoint")({
  DNSName: S.optional(S.String),
  IpAddresses: S.optional(OntapEndpointIpAddresses),
  Ipv6Addresses: S.optional(OntapEndpointIpAddresses),
}) {}
export class SvmEndpoints extends S.Class<SvmEndpoints>("SvmEndpoints")({
  Iscsi: S.optional(SvmEndpoint),
  Management: S.optional(SvmEndpoint),
  Nfs: S.optional(SvmEndpoint),
  Smb: S.optional(SvmEndpoint),
}) {}
export class StorageVirtualMachine extends S.Class<StorageVirtualMachine>(
  "StorageVirtualMachine",
)({
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
}) {}
export const StorageVirtualMachines = S.Array(StorageVirtualMachine);
export const Volumes = S.Array(S.suspend((): S.Schema<Volume, any> => Volume));
export class UpdateFileSystemWindowsConfiguration extends S.Class<UpdateFileSystemWindowsConfiguration>(
  "UpdateFileSystemWindowsConfiguration",
)({
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
}) {}
export class UpdateFileSystemLustreConfiguration extends S.Class<UpdateFileSystemLustreConfiguration>(
  "UpdateFileSystemLustreConfiguration",
)({
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
}) {}
export class UpdateOntapVolumeConfiguration extends S.Class<UpdateOntapVolumeConfiguration>(
  "UpdateOntapVolumeConfiguration",
)({
  JunctionPath: S.optional(S.String),
  SecurityStyle: S.optional(S.String),
  SizeInMegabytes: S.optional(S.Number),
  StorageEfficiencyEnabled: S.optional(S.Boolean),
  TieringPolicy: S.optional(TieringPolicy),
  SnapshotPolicy: S.optional(S.String),
  CopyTagsToBackups: S.optional(S.Boolean),
  SnaplockConfiguration: S.optional(UpdateSnaplockConfiguration),
  SizeInBytes: S.optional(S.Number),
}) {}
export class OpenZFSPosixFileSystemUser extends S.Class<OpenZFSPosixFileSystemUser>(
  "OpenZFSPosixFileSystemUser",
)({
  Uid: S.Number,
  Gid: S.Number,
  SecondaryGids: S.optional(FileSystemSecondaryGIDs),
}) {}
export class OntapUnixFileSystemUser extends S.Class<OntapUnixFileSystemUser>(
  "OntapUnixFileSystemUser",
)({ Name: S.String }) {}
export class OntapWindowsFileSystemUser extends S.Class<OntapWindowsFileSystemUser>(
  "OntapWindowsFileSystemUser",
)({ Name: S.String }) {}
export class AssociateFileSystemAliasesResponse extends S.Class<AssociateFileSystemAliasesResponse>(
  "AssociateFileSystemAliasesResponse",
)({ Aliases: S.optional(Aliases) }) {}
export class CopyBackupResponse extends S.Class<CopyBackupResponse>(
  "CopyBackupResponse",
)({ Backup: S.optional(Backup) }) {}
export class CreateDataRepositoryAssociationRequest extends S.Class<CreateDataRepositoryAssociationRequest>(
  "CreateDataRepositoryAssociationRequest",
)(
  {
    FileSystemId: S.String,
    FileSystemPath: S.optional(S.String),
    DataRepositoryPath: S.String,
    BatchImportMetaDataOnCreate: S.optional(S.Boolean),
    ImportedFileChunkSize: S.optional(S.Number),
    S3: S.optional(S3DataRepositoryConfiguration),
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDataRepositoryTaskRequest extends S.Class<CreateDataRepositoryTaskRequest>(
  "CreateDataRepositoryTaskRequest",
)(
  {
    Type: S.String,
    Paths: S.optional(DataRepositoryTaskPaths),
    FileSystemId: S.String,
    Report: CompletionReport,
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(Tags),
    CapacityToRelease: S.optional(S.Number),
    ReleaseConfiguration: S.optional(ReleaseConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFileCacheRequest extends S.Class<CreateFileCacheRequest>(
  "CreateFileCacheRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateFileSystemRequest extends S.Class<CreateFileSystemRequest>(
  "CreateFileSystemRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBackupsResponse extends S.Class<DescribeBackupsResponse>(
  "DescribeBackupsResponse",
)({ Backups: S.optional(Backups), NextToken: S.optional(S.String) }) {}
export class DescribeSnapshotsResponse extends S.Class<DescribeSnapshotsResponse>(
  "DescribeSnapshotsResponse",
)({ Snapshots: S.optional(Snapshots), NextToken: S.optional(S.String) }) {}
export class DescribeStorageVirtualMachinesResponse extends S.Class<DescribeStorageVirtualMachinesResponse>(
  "DescribeStorageVirtualMachinesResponse",
)({
  StorageVirtualMachines: S.optional(StorageVirtualMachines),
  NextToken: S.optional(S.String),
}) {}
export class DescribeVolumesResponse extends S.Class<DescribeVolumesResponse>(
  "DescribeVolumesResponse",
)({ Volumes: S.optional(Volumes), NextToken: S.optional(S.String) }) {}
export class FileCacheFailureDetails extends S.Class<FileCacheFailureDetails>(
  "FileCacheFailureDetails",
)({ Message: S.optional(S.String) }) {}
export class FileCacheLustreConfiguration extends S.Class<FileCacheLustreConfiguration>(
  "FileCacheLustreConfiguration",
)({
  PerUnitStorageThroughput: S.optional(S.Number),
  DeploymentType: S.optional(S.String),
  MountName: S.optional(S.String),
  WeeklyMaintenanceStartTime: S.optional(S.String),
  MetadataConfiguration: S.optional(FileCacheLustreMetadataConfiguration),
  LogConfiguration: S.optional(LustreLogConfiguration),
}) {}
export class FileCache extends S.Class<FileCache>("FileCache")({
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
}) {}
export class UpdateFileCacheResponse extends S.Class<UpdateFileCacheResponse>(
  "UpdateFileCacheResponse",
)({ FileCache: S.optional(FileCache) }) {}
export class UpdateFileSystemRequest extends S.Class<UpdateFileSystemRequest>(
  "UpdateFileSystemRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateStorageVirtualMachineResponse extends S.Class<UpdateStorageVirtualMachineResponse>(
  "UpdateStorageVirtualMachineResponse",
)({ StorageVirtualMachine: S.optional(StorageVirtualMachine) }) {}
export class UpdateVolumeRequest extends S.Class<UpdateVolumeRequest>(
  "UpdateVolumeRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    VolumeId: S.String,
    OntapConfiguration: S.optional(UpdateOntapVolumeConfiguration),
    Name: S.optional(S.String),
    OpenZFSConfiguration: S.optional(UpdateOpenZFSVolumeConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AdministrativeActionFailureDetails extends S.Class<AdministrativeActionFailureDetails>(
  "AdministrativeActionFailureDetails",
)({ Message: S.optional(S.String) }) {}
export class OpenZFSFileSystemIdentity extends S.Class<OpenZFSFileSystemIdentity>(
  "OpenZFSFileSystemIdentity",
)({ Type: S.String, PosixUser: S.optional(OpenZFSPosixFileSystemUser) }) {}
export class OntapFileSystemIdentity extends S.Class<OntapFileSystemIdentity>(
  "OntapFileSystemIdentity",
)({
  Type: S.String,
  UnixUser: S.optional(OntapUnixFileSystemUser),
  WindowsUser: S.optional(OntapWindowsFileSystemUser),
}) {}
export class AdministrativeAction extends S.Class<AdministrativeAction>(
  "AdministrativeAction",
)({
  AdministrativeActionType: S.optional(S.String),
  ProgressPercent: S.optional(S.Number),
  RequestTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  TargetFileSystemValues: S.optional(
    S.suspend((): S.Schema<FileSystem, any> => FileSystem),
  ),
  FailureDetails: S.optional(AdministrativeActionFailureDetails),
  TargetVolumeValues: S.optional(
    S.suspend((): S.Schema<Volume, any> => Volume),
  ),
  TargetSnapshotValues: S.optional(
    S.suspend((): S.Schema<Snapshot, any> => Snapshot),
  ),
  TotalTransferBytes: S.optional(S.Number),
  RemainingTransferBytes: S.optional(S.Number),
  Message: S.optional(S.String),
}) {}
export class CreateAndAttachS3AccessPointOpenZFSConfiguration extends S.Class<CreateAndAttachS3AccessPointOpenZFSConfiguration>(
  "CreateAndAttachS3AccessPointOpenZFSConfiguration",
)({ VolumeId: S.String, FileSystemIdentity: OpenZFSFileSystemIdentity }) {}
export class CreateAndAttachS3AccessPointOntapConfiguration extends S.Class<CreateAndAttachS3AccessPointOntapConfiguration>(
  "CreateAndAttachS3AccessPointOntapConfiguration",
)({ VolumeId: S.String, FileSystemIdentity: OntapFileSystemIdentity }) {}
export class CreateOpenZFSVolumeConfiguration extends S.Class<CreateOpenZFSVolumeConfiguration>(
  "CreateOpenZFSVolumeConfiguration",
)({
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
}) {}
export class DeleteFileSystemWindowsResponse extends S.Class<DeleteFileSystemWindowsResponse>(
  "DeleteFileSystemWindowsResponse",
)({ FinalBackupId: S.optional(S.String), FinalBackupTags: S.optional(Tags) }) {}
export class DeleteFileSystemLustreResponse extends S.Class<DeleteFileSystemLustreResponse>(
  "DeleteFileSystemLustreResponse",
)({ FinalBackupId: S.optional(S.String), FinalBackupTags: S.optional(Tags) }) {}
export class DeleteFileSystemOpenZFSResponse extends S.Class<DeleteFileSystemOpenZFSResponse>(
  "DeleteFileSystemOpenZFSResponse",
)({ FinalBackupId: S.optional(S.String), FinalBackupTags: S.optional(Tags) }) {}
export class DeleteVolumeOntapResponse extends S.Class<DeleteVolumeOntapResponse>(
  "DeleteVolumeOntapResponse",
)({ FinalBackupId: S.optional(S.String), FinalBackupTags: S.optional(Tags) }) {}
export const DataRepositoryAssociations = S.Array(DataRepositoryAssociation);
export const FileCaches = S.Array(FileCache);
export class CopySnapshotAndUpdateVolumeResponse extends S.Class<CopySnapshotAndUpdateVolumeResponse>(
  "CopySnapshotAndUpdateVolumeResponse",
)({
  VolumeId: S.optional(S.String),
  Lifecycle: S.optional(S.String),
  AdministrativeActions: S.optional(AdministrativeActions),
}) {}
export class CreateAndAttachS3AccessPointRequest extends S.Class<CreateAndAttachS3AccessPointRequest>(
  "CreateAndAttachS3AccessPointRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateBackupResponse extends S.Class<CreateBackupResponse>(
  "CreateBackupResponse",
)({ Backup: S.optional(Backup) }) {}
export class CreateDataRepositoryAssociationResponse extends S.Class<CreateDataRepositoryAssociationResponse>(
  "CreateDataRepositoryAssociationResponse",
)({ Association: S.optional(DataRepositoryAssociation) }) {}
export class DataRepositoryTaskFailureDetails extends S.Class<DataRepositoryTaskFailureDetails>(
  "DataRepositoryTaskFailureDetails",
)({ Message: S.optional(S.String) }) {}
export class DataRepositoryTaskStatus extends S.Class<DataRepositoryTaskStatus>(
  "DataRepositoryTaskStatus",
)({
  TotalCount: S.optional(S.Number),
  SucceededCount: S.optional(S.Number),
  FailedCount: S.optional(S.Number),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ReleasedCapacity: S.optional(S.Number),
}) {}
export class DataRepositoryTask extends S.Class<DataRepositoryTask>(
  "DataRepositoryTask",
)({
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
}) {}
export class CreateDataRepositoryTaskResponse extends S.Class<CreateDataRepositoryTaskResponse>(
  "CreateDataRepositoryTaskResponse",
)({ DataRepositoryTask: S.optional(DataRepositoryTask) }) {}
export class CreateFileSystemResponse extends S.Class<CreateFileSystemResponse>(
  "CreateFileSystemResponse",
)({ FileSystem: S.optional(FileSystem) }) {}
export class CreateSnapshotResponse extends S.Class<CreateSnapshotResponse>(
  "CreateSnapshotResponse",
)({ Snapshot: S.optional(Snapshot) }) {}
export class DeleteFileSystemResponse extends S.Class<DeleteFileSystemResponse>(
  "DeleteFileSystemResponse",
)({
  FileSystemId: S.optional(S.String),
  Lifecycle: S.optional(S.String),
  WindowsResponse: S.optional(DeleteFileSystemWindowsResponse),
  LustreResponse: S.optional(DeleteFileSystemLustreResponse),
  OpenZFSResponse: S.optional(DeleteFileSystemOpenZFSResponse),
}) {}
export class DeleteVolumeResponse extends S.Class<DeleteVolumeResponse>(
  "DeleteVolumeResponse",
)({
  VolumeId: S.optional(S.String),
  Lifecycle: S.optional(S.String),
  OntapResponse: S.optional(DeleteVolumeOntapResponse),
}) {}
export class DescribeDataRepositoryAssociationsResponse extends S.Class<DescribeDataRepositoryAssociationsResponse>(
  "DescribeDataRepositoryAssociationsResponse",
)({
  Associations: S.optional(DataRepositoryAssociations),
  NextToken: S.optional(S.String),
}) {}
export class DescribeFileCachesResponse extends S.Class<DescribeFileCachesResponse>(
  "DescribeFileCachesResponse",
)({ FileCaches: S.optional(FileCaches), NextToken: S.optional(S.String) }) {}
export class UpdateFileSystemResponse extends S.Class<UpdateFileSystemResponse>(
  "UpdateFileSystemResponse",
)({ FileSystem: S.optional(FileSystem) }) {}
export class UpdateVolumeResponse extends S.Class<UpdateVolumeResponse>(
  "UpdateVolumeResponse",
)({ Volume: S.optional(Volume) }) {}
export class S3AccessPointOpenZFSConfiguration extends S.Class<S3AccessPointOpenZFSConfiguration>(
  "S3AccessPointOpenZFSConfiguration",
)({
  VolumeId: S.optional(S.String),
  FileSystemIdentity: S.optional(OpenZFSFileSystemIdentity),
}) {}
export class S3AccessPointOntapConfiguration extends S.Class<S3AccessPointOntapConfiguration>(
  "S3AccessPointOntapConfiguration",
)({
  VolumeId: S.optional(S.String),
  FileSystemIdentity: S.optional(OntapFileSystemIdentity),
}) {}
export class S3AccessPoint extends S.Class<S3AccessPoint>("S3AccessPoint")({
  ResourceARN: S.optional(S.String),
  Alias: S.optional(S.String),
  VpcConfiguration: S.optional(S3AccessPointVpcConfiguration),
}) {}
export class FileCacheCreating extends S.Class<FileCacheCreating>(
  "FileCacheCreating",
)({
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
}) {}
export const DataRepositoryTasks = S.Array(DataRepositoryTask);
export class S3AccessPointAttachment extends S.Class<S3AccessPointAttachment>(
  "S3AccessPointAttachment",
)({
  Lifecycle: S.optional(S.String),
  LifecycleTransitionReason: S.optional(LifecycleTransitionReason),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  OpenZFSConfiguration: S.optional(S3AccessPointOpenZFSConfiguration),
  OntapConfiguration: S.optional(S3AccessPointOntapConfiguration),
  S3AccessPoint: S.optional(S3AccessPoint),
}) {}
export const S3AccessPointAttachments = S.Array(S3AccessPointAttachment);
export class CreateAndAttachS3AccessPointResponse extends S.Class<CreateAndAttachS3AccessPointResponse>(
  "CreateAndAttachS3AccessPointResponse",
)({ S3AccessPointAttachment: S.optional(S3AccessPointAttachment) }) {}
export class CreateFileCacheResponse extends S.Class<CreateFileCacheResponse>(
  "CreateFileCacheResponse",
)({ FileCache: S.optional(FileCacheCreating) }) {}
export class CreateVolumeRequest extends S.Class<CreateVolumeRequest>(
  "CreateVolumeRequest",
)(
  {
    ClientRequestToken: S.optional(S.String),
    VolumeType: S.String,
    Name: S.String,
    OntapConfiguration: S.optional(CreateOntapVolumeConfiguration),
    Tags: S.optional(Tags),
    OpenZFSConfiguration: S.optional(CreateOpenZFSVolumeConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateVolumeFromBackupResponse extends S.Class<CreateVolumeFromBackupResponse>(
  "CreateVolumeFromBackupResponse",
)({ Volume: S.optional(Volume) }) {}
export class DescribeDataRepositoryTasksResponse extends S.Class<DescribeDataRepositoryTasksResponse>(
  "DescribeDataRepositoryTasksResponse",
)({
  DataRepositoryTasks: S.optional(DataRepositoryTasks),
  NextToken: S.optional(S.String),
}) {}
export class DescribeS3AccessPointAttachmentsResponse extends S.Class<DescribeS3AccessPointAttachmentsResponse>(
  "DescribeS3AccessPointAttachmentsResponse",
)({
  S3AccessPointAttachments: S.optional(S3AccessPointAttachments),
  NextToken: S.optional(S.String),
}) {}
export class CreateFileSystemFromBackupResponse extends S.Class<CreateFileSystemFromBackupResponse>(
  "CreateFileSystemFromBackupResponse",
)({ FileSystem: S.optional(FileSystem) }) {}
export class CreateStorageVirtualMachineResponse extends S.Class<CreateStorageVirtualMachineResponse>(
  "CreateStorageVirtualMachineResponse",
)({ StorageVirtualMachine: S.optional(StorageVirtualMachine) }) {}
export class CreateVolumeResponse extends S.Class<CreateVolumeResponse>(
  "CreateVolumeResponse",
)({ Volume: S.optional(Volume) }) {}

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
) {}
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
) {}
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
) {}
export class SourceBackupUnavailable extends S.TaggedError<SourceBackupUnavailable>()(
  "SourceBackupUnavailable",
  { Message: S.optional(S.String), BackupId: S.optional(S.String) },
) {}
export class TooManyAccessPoints extends S.TaggedError<TooManyAccessPoints>()(
  "TooManyAccessPoints",
  { ErrorCode: S.optional(S.String), Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Indicates whether participant accounts in your organization can create Amazon FSx for NetApp ONTAP Multi-AZ file systems in subnets that are shared by a virtual
 * private cloud (VPC) owner. For more information, see Creating FSx for ONTAP file systems in shared subnets.
 */
export const describeSharedVpcConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disassociateFileSystemAliases =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSharedVpcConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateSharedVpcConfigurationRequest,
    output: UpdateSharedVpcConfigurationResponse,
    errors: [BadRequest, IncompatibleParameterError, InternalServerError],
  }));
/**
 * After performing steps to repair the Active Directory configuration of an FSx for Windows File Server file system, use this action to
 * initiate the process of Amazon FSx attempting to reconnect to the file system.
 */
export const startMisconfiguredStateRecovery =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartMisconfiguredStateRecoveryRequest,
    output: StartMisconfiguredStateRecoveryResponse,
    errors: [BadRequest, FileSystemNotFound, InternalServerError],
  }));
/**
 * Returns the DNS aliases that are associated with the specified Amazon FSx for Windows File Server file system. A history of
 * all DNS aliases that have been associated with and disassociated from the file system is available in the list of AdministrativeAction
 * provided in the DescribeFileSystems operation response.
 */
export const describeFileSystemAliases =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeFileSystems =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const associateFileSystemAliases = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AssociateFileSystemAliasesRequest,
    output: AssociateFileSystemAliasesResponse,
    errors: [BadRequest, FileSystemNotFound, InternalServerError],
  }),
);
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
export const describeFileCaches = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeFileCachesRequest,
    output: DescribeFileCachesResponse,
    errors: [BadRequest, FileCacheNotFound, InternalServerError],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
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
export const describeSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeSnapshotsRequest,
    output: DescribeSnapshotsResponse,
    errors: [BadRequest, InternalServerError, SnapshotNotFound],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Snapshots",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Describes one or more Amazon FSx for NetApp ONTAP storage virtual machines (SVMs).
 */
export const describeStorageVirtualMachines =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeVolumes = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeVolumesRequest,
    output: DescribeVolumesResponse,
    errors: [BadRequest, InternalServerError, VolumeNotFound],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Volumes",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Updates the configuration of an existing data repository association
 * on an Amazon FSx for Lustre file system. Data repository associations
 * are supported on all FSx for Lustre 2.12 and 2.15 file systems,
 * excluding `scratch_1` deployment type.
 */
export const updateDataRepositoryAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeBackups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Updates the name of an Amazon FSx for OpenZFS snapshot.
 */
export const updateSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSnapshotRequest,
  output: DeleteSnapshotResponse,
  errors: [BadRequest, InternalServerError, SnapshotNotFound],
}));
/**
 * Deletes an existing Amazon FSx for ONTAP storage virtual machine (SVM). Prior
 * to deleting an SVM, you must delete all non-root volumes in the SVM, otherwise the operation will fail.
 */
export const deleteStorageVirtualMachine = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteStorageVirtualMachineRequest,
    output: DeleteStorageVirtualMachineResponse,
    errors: [
      BadRequest,
      IncompatibleParameterError,
      InternalServerError,
      StorageVirtualMachineNotFound,
    ],
  }),
);
/**
 * Returns an Amazon FSx for OpenZFS volume to the state saved by the specified
 * snapshot.
 */
export const restoreVolumeFromSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RestoreVolumeFromSnapshotRequest,
    output: RestoreVolumeFromSnapshotResponse,
    errors: [BadRequest, InternalServerError, VolumeNotFound],
  }),
);
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
export const deleteFileCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const releaseFileSystemNfsV3Locks = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ReleaseFileSystemNfsV3LocksRequest,
    output: ReleaseFileSystemNfsV3LocksResponse,
    errors: [
      BadRequest,
      FileSystemNotFound,
      IncompatibleParameterError,
      InternalServerError,
      ServiceLimitExceeded,
    ],
  }),
);
/**
 * Deletes a data repository association on an Amazon FSx for Lustre
 * file system. Deleting the data repository association unlinks the
 * file system from the Amazon S3 bucket. When deleting a data repository
 * association, you have the option of deleting the data in the file system
 * that corresponds to the data repository association. Data repository
 * associations are supported on all FSx for Lustre 2.12 and 2.15 file
 * systems, excluding `scratch_1` deployment type.
 */
export const deleteDataRepositoryAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const copySnapshotAndUpdateVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CopySnapshotAndUpdateVolumeRequest,
    output: CopySnapshotAndUpdateVolumeResponse,
    errors: [
      BadRequest,
      IncompatibleParameterError,
      InternalServerError,
      ServiceLimitExceeded,
    ],
  }),
);
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
export const createSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteFileSystem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBackup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeDataRepositoryAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeDataRepositoryTasks =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const detachAndDeleteS3AccessPoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBackup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelDataRepositoryTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelDataRepositoryTaskRequest,
    output: CancelDataRepositoryTaskResponse,
    errors: [
      BadRequest,
      DataRepositoryTaskEnded,
      DataRepositoryTaskNotFound,
      InternalServerError,
      UnsupportedOperation,
    ],
  }),
);
/**
 * Updates an FSx for ONTAP storage virtual machine (SVM).
 */
export const updateStorageVirtualMachine = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateStorageVirtualMachineRequest,
    output: UpdateStorageVirtualMachineResponse,
    errors: [
      BadRequest,
      IncompatibleParameterError,
      InternalServerError,
      StorageVirtualMachineNotFound,
      UnsupportedOperation,
    ],
  }),
);
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
export const createDataRepositoryAssociation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFileCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDataRepositoryTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Describes one or more S3 access points attached to Amazon FSx volumes.
 *
 * The requester requires the following permission to perform this action:
 *
 * - `fsx:DescribeS3AccessPointAttachments`
 */
export const describeS3AccessPointAttachments =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createVolumeFromBackup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates a storage virtual machine (SVM) for an Amazon FSx for ONTAP file system.
 */
export const createStorageVirtualMachine = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Creates an FSx for ONTAP or Amazon FSx for OpenZFS storage volume.
 */
export const createVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateFileSystem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createFileCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createFileSystemFromBackup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const createFileSystem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const copyBackup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAndAttachS3AccessPoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
