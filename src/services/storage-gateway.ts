import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://storagegateway.amazonaws.com/doc/2013-06-30");
const svc = T.AwsApiService({
  sdkId: "Storage Gateway",
  serviceShapeName: "StorageGateway_20130630",
});
const auth = T.AwsAuthSigv4({ name: "storagegateway" });
const ver = T.ServiceVersion("2013-06-30");
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
                        url: "https://storagegateway-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://storagegateway-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://storagegateway.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://storagegateway.{Region}.{PartitionResult#dnsSuffix}",
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
export const DiskIds = S.Array(S.String);
export const FileShareClientList = S.Array(S.String);
export const UserList = S.Array(S.String);
export const VolumeARNs = S.Array(S.String);
export const FileSystemAssociationARNList = S.Array(S.String);
export const FileShareARNList = S.Array(S.String);
export const TapeARNs = S.Array(S.String);
export const VTLDeviceARNs = S.Array(S.String);
export const Hosts = S.Array(S.String);
export const PoolARNs = S.Array(S.String);
export const FolderList = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class AddCacheInput extends S.Class<AddCacheInput>("AddCacheInput")(
  { GatewayARN: S.String, DiskIds: DiskIds },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const Tags = S.Array(Tag);
export class AddTagsToResourceInput extends S.Class<AddTagsToResourceInput>(
  "AddTagsToResourceInput",
)(
  { ResourceARN: S.String, Tags: Tags },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddUploadBufferInput extends S.Class<AddUploadBufferInput>(
  "AddUploadBufferInput",
)(
  { GatewayARN: S.String, DiskIds: DiskIds },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddWorkingStorageInput extends S.Class<AddWorkingStorageInput>(
  "AddWorkingStorageInput",
)(
  { GatewayARN: S.String, DiskIds: DiskIds },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AssignTapePoolInput extends S.Class<AssignTapePoolInput>(
  "AssignTapePoolInput",
)(
  {
    TapeARN: S.String,
    PoolId: S.String,
    BypassGovernanceRetention: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachVolumeInput extends S.Class<AttachVolumeInput>(
  "AttachVolumeInput",
)(
  {
    GatewayARN: S.String,
    TargetName: S.optional(S.String),
    VolumeARN: S.String,
    NetworkInterfaceId: S.String,
    DiskId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelArchivalInput extends S.Class<CancelArchivalInput>(
  "CancelArchivalInput",
)(
  { GatewayARN: S.String, TapeARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelCacheReportInput extends S.Class<CancelCacheReportInput>(
  "CancelCacheReportInput",
)(
  { CacheReportARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelRetrievalInput extends S.Class<CancelRetrievalInput>(
  "CancelRetrievalInput",
)(
  { GatewayARN: S.String, TapeARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCachediSCSIVolumeInput extends S.Class<CreateCachediSCSIVolumeInput>(
  "CreateCachediSCSIVolumeInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CacheAttributes extends S.Class<CacheAttributes>(
  "CacheAttributes",
)({ CacheStaleTimeoutInSeconds: S.optional(S.Number) }) {}
export class CreateSMBFileShareInput extends S.Class<CreateSMBFileShareInput>(
  "CreateSMBFileShareInput",
)(
  {
    ClientToken: S.String,
    GatewayARN: S.String,
    EncryptionType: S.optional(S.String),
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    Role: S.String,
    LocationARN: S.String,
    DefaultStorageClass: S.optional(S.String),
    ObjectACL: S.optional(S.String),
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
    CaseSensitivity: S.optional(S.String),
    Tags: S.optional(Tags),
    FileShareName: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
    NotificationPolicy: S.optional(S.String),
    VPCEndpointDNSName: S.optional(S.String),
    BucketRegion: S.optional(S.String),
    OplocksEnabled: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSnapshotInput extends S.Class<CreateSnapshotInput>(
  "CreateSnapshotInput",
)(
  {
    VolumeARN: S.String,
    SnapshotDescription: S.String,
    Tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSnapshotFromVolumeRecoveryPointInput extends S.Class<CreateSnapshotFromVolumeRecoveryPointInput>(
  "CreateSnapshotFromVolumeRecoveryPointInput",
)(
  {
    VolumeARN: S.String,
    SnapshotDescription: S.String,
    Tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateStorediSCSIVolumeInput extends S.Class<CreateStorediSCSIVolumeInput>(
  "CreateStorediSCSIVolumeInput",
)(
  {
    GatewayARN: S.String,
    DiskId: S.String,
    SnapshotId: S.optional(S.String),
    PreserveExistingData: S.Boolean,
    TargetName: S.String,
    NetworkInterfaceId: S.String,
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTapePoolInput extends S.Class<CreateTapePoolInput>(
  "CreateTapePoolInput",
)(
  {
    PoolName: S.String,
    StorageClass: S.String,
    RetentionLockType: S.optional(S.String),
    RetentionLockTimeInDays: S.optional(S.Number),
    Tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTapesInput extends S.Class<CreateTapesInput>(
  "CreateTapesInput",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTapeWithBarcodeInput extends S.Class<CreateTapeWithBarcodeInput>(
  "CreateTapeWithBarcodeInput",
)(
  {
    GatewayARN: S.String,
    TapeSizeInBytes: S.Number,
    TapeBarcode: S.String,
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    PoolId: S.optional(S.String),
    Worm: S.optional(S.Boolean),
    Tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAutomaticTapeCreationPolicyInput extends S.Class<DeleteAutomaticTapeCreationPolicyInput>(
  "DeleteAutomaticTapeCreationPolicyInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBandwidthRateLimitInput extends S.Class<DeleteBandwidthRateLimitInput>(
  "DeleteBandwidthRateLimitInput",
)(
  { GatewayARN: S.String, BandwidthType: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCacheReportInput extends S.Class<DeleteCacheReportInput>(
  "DeleteCacheReportInput",
)(
  { CacheReportARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteChapCredentialsInput extends S.Class<DeleteChapCredentialsInput>(
  "DeleteChapCredentialsInput",
)(
  { TargetARN: S.String, InitiatorName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteFileShareInput extends S.Class<DeleteFileShareInput>(
  "DeleteFileShareInput",
)(
  { FileShareARN: S.String, ForceDelete: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGatewayInput extends S.Class<DeleteGatewayInput>(
  "DeleteGatewayInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSnapshotScheduleInput extends S.Class<DeleteSnapshotScheduleInput>(
  "DeleteSnapshotScheduleInput",
)(
  { VolumeARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTapeInput extends S.Class<DeleteTapeInput>(
  "DeleteTapeInput",
)(
  {
    GatewayARN: S.String,
    TapeARN: S.String,
    BypassGovernanceRetention: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTapeArchiveInput extends S.Class<DeleteTapeArchiveInput>(
  "DeleteTapeArchiveInput",
)(
  { TapeARN: S.String, BypassGovernanceRetention: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTapePoolInput extends S.Class<DeleteTapePoolInput>(
  "DeleteTapePoolInput",
)(
  { PoolARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteVolumeInput extends S.Class<DeleteVolumeInput>(
  "DeleteVolumeInput",
)(
  { VolumeARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeAvailabilityMonitorTestInput extends S.Class<DescribeAvailabilityMonitorTestInput>(
  "DescribeAvailabilityMonitorTestInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBandwidthRateLimitInput extends S.Class<DescribeBandwidthRateLimitInput>(
  "DescribeBandwidthRateLimitInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBandwidthRateLimitScheduleInput extends S.Class<DescribeBandwidthRateLimitScheduleInput>(
  "DescribeBandwidthRateLimitScheduleInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCacheInput extends S.Class<DescribeCacheInput>(
  "DescribeCacheInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCachediSCSIVolumesInput extends S.Class<DescribeCachediSCSIVolumesInput>(
  "DescribeCachediSCSIVolumesInput",
)(
  { VolumeARNs: VolumeARNs },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCacheReportInput extends S.Class<DescribeCacheReportInput>(
  "DescribeCacheReportInput",
)(
  { CacheReportARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeChapCredentialsInput extends S.Class<DescribeChapCredentialsInput>(
  "DescribeChapCredentialsInput",
)(
  { TargetARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeFileSystemAssociationsInput extends S.Class<DescribeFileSystemAssociationsInput>(
  "DescribeFileSystemAssociationsInput",
)(
  { FileSystemAssociationARNList: FileSystemAssociationARNList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGatewayInformationInput extends S.Class<DescribeGatewayInformationInput>(
  "DescribeGatewayInformationInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMaintenanceStartTimeInput extends S.Class<DescribeMaintenanceStartTimeInput>(
  "DescribeMaintenanceStartTimeInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeNFSFileSharesInput extends S.Class<DescribeNFSFileSharesInput>(
  "DescribeNFSFileSharesInput",
)(
  { FileShareARNList: FileShareARNList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSMBFileSharesInput extends S.Class<DescribeSMBFileSharesInput>(
  "DescribeSMBFileSharesInput",
)(
  { FileShareARNList: FileShareARNList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSMBSettingsInput extends S.Class<DescribeSMBSettingsInput>(
  "DescribeSMBSettingsInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSnapshotScheduleInput extends S.Class<DescribeSnapshotScheduleInput>(
  "DescribeSnapshotScheduleInput",
)(
  { VolumeARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStorediSCSIVolumesInput extends S.Class<DescribeStorediSCSIVolumesInput>(
  "DescribeStorediSCSIVolumesInput",
)(
  { VolumeARNs: VolumeARNs },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTapeArchivesInput extends S.Class<DescribeTapeArchivesInput>(
  "DescribeTapeArchivesInput",
)(
  {
    TapeARNs: S.optional(TapeARNs),
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTapeRecoveryPointsInput extends S.Class<DescribeTapeRecoveryPointsInput>(
  "DescribeTapeRecoveryPointsInput",
)(
  {
    GatewayARN: S.String,
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTapesInput extends S.Class<DescribeTapesInput>(
  "DescribeTapesInput",
)(
  {
    GatewayARN: S.String,
    TapeARNs: S.optional(TapeARNs),
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeUploadBufferInput extends S.Class<DescribeUploadBufferInput>(
  "DescribeUploadBufferInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeVTLDevicesInput extends S.Class<DescribeVTLDevicesInput>(
  "DescribeVTLDevicesInput",
)(
  {
    GatewayARN: S.String,
    VTLDeviceARNs: S.optional(VTLDeviceARNs),
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeWorkingStorageInput extends S.Class<DescribeWorkingStorageInput>(
  "DescribeWorkingStorageInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DetachVolumeInput extends S.Class<DetachVolumeInput>(
  "DetachVolumeInput",
)(
  { VolumeARN: S.String, ForceDetach: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisableGatewayInput extends S.Class<DisableGatewayInput>(
  "DisableGatewayInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateFileSystemInput extends S.Class<DisassociateFileSystemInput>(
  "DisassociateFileSystemInput",
)(
  { FileSystemAssociationARN: S.String, ForceDelete: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class EvictFilesFailingUploadInput extends S.Class<EvictFilesFailingUploadInput>(
  "EvictFilesFailingUploadInput",
)(
  { FileShareARN: S.String, ForceRemove: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class JoinDomainInput extends S.Class<JoinDomainInput>(
  "JoinDomainInput",
)(
  {
    GatewayARN: S.String,
    DomainName: S.String,
    OrganizationalUnit: S.optional(S.String),
    DomainControllers: S.optional(Hosts),
    TimeoutInSeconds: S.optional(S.Number),
    UserName: S.String,
    Password: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAutomaticTapeCreationPoliciesInput extends S.Class<ListAutomaticTapeCreationPoliciesInput>(
  "ListAutomaticTapeCreationPoliciesInput",
)(
  { GatewayARN: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCacheReportsInput extends S.Class<ListCacheReportsInput>(
  "ListCacheReportsInput",
)(
  { Marker: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFileSharesInput extends S.Class<ListFileSharesInput>(
  "ListFileSharesInput",
)(
  {
    GatewayARN: S.optional(S.String),
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFileSystemAssociationsInput extends S.Class<ListFileSystemAssociationsInput>(
  "ListFileSystemAssociationsInput",
)(
  {
    GatewayARN: S.optional(S.String),
    Limit: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListGatewaysInput extends S.Class<ListGatewaysInput>(
  "ListGatewaysInput",
)(
  { Marker: S.optional(S.String), Limit: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLocalDisksInput extends S.Class<ListLocalDisksInput>(
  "ListLocalDisksInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  {
    ResourceARN: S.String,
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTapePoolsInput extends S.Class<ListTapePoolsInput>(
  "ListTapePoolsInput",
)(
  {
    PoolARNs: S.optional(PoolARNs),
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTapesInput extends S.Class<ListTapesInput>("ListTapesInput")(
  {
    TapeARNs: S.optional(TapeARNs),
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListVolumeInitiatorsInput extends S.Class<ListVolumeInitiatorsInput>(
  "ListVolumeInitiatorsInput",
)(
  { VolumeARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListVolumeRecoveryPointsInput extends S.Class<ListVolumeRecoveryPointsInput>(
  "ListVolumeRecoveryPointsInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListVolumesInput extends S.Class<ListVolumesInput>(
  "ListVolumesInput",
)(
  {
    GatewayARN: S.optional(S.String),
    Marker: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NotifyWhenUploadedInput extends S.Class<NotifyWhenUploadedInput>(
  "NotifyWhenUploadedInput",
)(
  { FileShareARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RefreshCacheInput extends S.Class<RefreshCacheInput>(
  "RefreshCacheInput",
)(
  {
    FileShareARN: S.String,
    FolderList: S.optional(FolderList),
    Recursive: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsFromResourceInput extends S.Class<RemoveTagsFromResourceInput>(
  "RemoveTagsFromResourceInput",
)(
  { ResourceARN: S.String, TagKeys: TagKeys },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResetCacheInput extends S.Class<ResetCacheInput>(
  "ResetCacheInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RetrieveTapeArchiveInput extends S.Class<RetrieveTapeArchiveInput>(
  "RetrieveTapeArchiveInput",
)(
  { TapeARN: S.String, GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RetrieveTapeRecoveryPointInput extends S.Class<RetrieveTapeRecoveryPointInput>(
  "RetrieveTapeRecoveryPointInput",
)(
  { TapeARN: S.String, GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetLocalConsolePasswordInput extends S.Class<SetLocalConsolePasswordInput>(
  "SetLocalConsolePasswordInput",
)(
  { GatewayARN: S.String, LocalConsolePassword: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SetSMBGuestPasswordInput extends S.Class<SetSMBGuestPasswordInput>(
  "SetSMBGuestPasswordInput",
)(
  { GatewayARN: S.String, Password: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ShutdownGatewayInput extends S.Class<ShutdownGatewayInput>(
  "ShutdownGatewayInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartAvailabilityMonitorTestInput extends S.Class<StartAvailabilityMonitorTestInput>(
  "StartAvailabilityMonitorTestInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartGatewayInput extends S.Class<StartGatewayInput>(
  "StartGatewayInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateBandwidthRateLimitInput extends S.Class<UpdateBandwidthRateLimitInput>(
  "UpdateBandwidthRateLimitInput",
)(
  {
    GatewayARN: S.String,
    AverageUploadRateLimitInBitsPerSec: S.optional(S.Number),
    AverageDownloadRateLimitInBitsPerSec: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateChapCredentialsInput extends S.Class<UpdateChapCredentialsInput>(
  "UpdateChapCredentialsInput",
)(
  {
    TargetARN: S.String,
    SecretToAuthenticateInitiator: S.String,
    InitiatorName: S.String,
    SecretToAuthenticateTarget: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateFileSystemAssociationInput extends S.Class<UpdateFileSystemAssociationInput>(
  "UpdateFileSystemAssociationInput",
)(
  {
    FileSystemAssociationARN: S.String,
    UserName: S.optional(S.String),
    Password: S.optional(S.String),
    AuditDestinationARN: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateGatewayInformationInput extends S.Class<UpdateGatewayInformationInput>(
  "UpdateGatewayInformationInput",
)(
  {
    GatewayARN: S.String,
    GatewayName: S.optional(S.String),
    GatewayTimezone: S.optional(S.String),
    CloudWatchLogGroupARN: S.optional(S.String),
    GatewayCapacity: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateGatewaySoftwareNowInput extends S.Class<UpdateGatewaySoftwareNowInput>(
  "UpdateGatewaySoftwareNowInput",
)(
  { GatewayARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NFSFileShareDefaults extends S.Class<NFSFileShareDefaults>(
  "NFSFileShareDefaults",
)({
  FileMode: S.optional(S.String),
  DirectoryMode: S.optional(S.String),
  GroupId: S.optional(S.Number),
  OwnerId: S.optional(S.Number),
}) {}
export class UpdateNFSFileShareInput extends S.Class<UpdateNFSFileShareInput>(
  "UpdateNFSFileShareInput",
)(
  {
    FileShareARN: S.String,
    EncryptionType: S.optional(S.String),
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    NFSFileShareDefaults: S.optional(NFSFileShareDefaults),
    DefaultStorageClass: S.optional(S.String),
    ObjectACL: S.optional(S.String),
    ClientList: S.optional(FileShareClientList),
    Squash: S.optional(S.String),
    ReadOnly: S.optional(S.Boolean),
    GuessMIMETypeEnabled: S.optional(S.Boolean),
    RequesterPays: S.optional(S.Boolean),
    FileShareName: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
    NotificationPolicy: S.optional(S.String),
    AuditDestinationARN: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSMBFileShareInput extends S.Class<UpdateSMBFileShareInput>(
  "UpdateSMBFileShareInput",
)(
  {
    FileShareARN: S.String,
    EncryptionType: S.optional(S.String),
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    DefaultStorageClass: S.optional(S.String),
    ObjectACL: S.optional(S.String),
    ReadOnly: S.optional(S.Boolean),
    GuessMIMETypeEnabled: S.optional(S.Boolean),
    RequesterPays: S.optional(S.Boolean),
    SMBACLEnabled: S.optional(S.Boolean),
    AccessBasedEnumeration: S.optional(S.Boolean),
    AdminUserList: S.optional(UserList),
    ValidUserList: S.optional(UserList),
    InvalidUserList: S.optional(UserList),
    AuditDestinationARN: S.optional(S.String),
    CaseSensitivity: S.optional(S.String),
    FileShareName: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
    NotificationPolicy: S.optional(S.String),
    OplocksEnabled: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSMBFileShareVisibilityInput extends S.Class<UpdateSMBFileShareVisibilityInput>(
  "UpdateSMBFileShareVisibilityInput",
)(
  { GatewayARN: S.String, FileSharesVisible: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSMBSecurityStrategyInput extends S.Class<UpdateSMBSecurityStrategyInput>(
  "UpdateSMBSecurityStrategyInput",
)(
  { GatewayARN: S.String, SMBSecurityStrategy: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSnapshotScheduleInput extends S.Class<UpdateSnapshotScheduleInput>(
  "UpdateSnapshotScheduleInput",
)(
  {
    VolumeARN: S.String,
    StartAt: S.Number,
    RecurrenceInHours: S.Number,
    Description: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateVTLDeviceTypeInput extends S.Class<UpdateVTLDeviceTypeInput>(
  "UpdateVTLDeviceTypeInput",
)(
  { VTLDeviceARN: S.String, DeviceType: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const IpAddressList = S.Array(S.String);
export const CacheReportFilterValues = S.Array(S.String);
export const DaysOfWeek = S.Array(S.Number);
export class EndpointNetworkConfiguration extends S.Class<EndpointNetworkConfiguration>(
  "EndpointNetworkConfiguration",
)({ IpAddresses: S.optional(IpAddressList) }) {}
export const SupportedGatewayCapacities = S.Array(S.String);
export class CacheReportFilter extends S.Class<CacheReportFilter>(
  "CacheReportFilter",
)({ Name: S.String, Values: CacheReportFilterValues }) {}
export const CacheReportFilterList = S.Array(CacheReportFilter);
export class CacheReportInfo extends S.Class<CacheReportInfo>(
  "CacheReportInfo",
)({
  CacheReportARN: S.optional(S.String),
  CacheReportStatus: S.optional(S.String),
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
}) {}
export const CacheReportList = S.Array(CacheReportInfo);
export const Initiators = S.Array(S.String);
export class AutomaticTapeCreationRule extends S.Class<AutomaticTapeCreationRule>(
  "AutomaticTapeCreationRule",
)({
  TapeBarcodePrefix: S.String,
  PoolId: S.String,
  TapeSizeInBytes: S.Number,
  MinimumNumTapes: S.Number,
  Worm: S.optional(S.Boolean),
}) {}
export const AutomaticTapeCreationRules = S.Array(AutomaticTapeCreationRule);
export class BandwidthRateLimitInterval extends S.Class<BandwidthRateLimitInterval>(
  "BandwidthRateLimitInterval",
)({
  StartHourOfDay: S.Number,
  StartMinuteOfHour: S.Number,
  EndHourOfDay: S.Number,
  EndMinuteOfHour: S.Number,
  DaysOfWeek: DaysOfWeek,
  AverageUploadRateLimitInBitsPerSec: S.optional(S.Number),
  AverageDownloadRateLimitInBitsPerSec: S.optional(S.Number),
}) {}
export const BandwidthRateLimitIntervals = S.Array(BandwidthRateLimitInterval);
export class SoftwareUpdatePreferences extends S.Class<SoftwareUpdatePreferences>(
  "SoftwareUpdatePreferences",
)({ AutomaticUpdatePolicy: S.optional(S.String) }) {}
export class SMBLocalGroups extends S.Class<SMBLocalGroups>("SMBLocalGroups")({
  GatewayAdmins: S.optional(UserList),
}) {}
export class ActivateGatewayInput extends S.Class<ActivateGatewayInput>(
  "ActivateGatewayInput",
)(
  {
    ActivationKey: S.String,
    GatewayName: S.String,
    GatewayTimezone: S.String,
    GatewayRegion: S.String,
    GatewayType: S.optional(S.String),
    TapeDriveType: S.optional(S.String),
    MediumChangerType: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddCacheOutput extends S.Class<AddCacheOutput>("AddCacheOutput")(
  { GatewayARN: S.optional(S.String) },
  ns,
) {}
export class AddTagsToResourceOutput extends S.Class<AddTagsToResourceOutput>(
  "AddTagsToResourceOutput",
)({ ResourceARN: S.optional(S.String) }, ns) {}
export class AddUploadBufferOutput extends S.Class<AddUploadBufferOutput>(
  "AddUploadBufferOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class AddWorkingStorageOutput extends S.Class<AddWorkingStorageOutput>(
  "AddWorkingStorageOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class AssignTapePoolOutput extends S.Class<AssignTapePoolOutput>(
  "AssignTapePoolOutput",
)({ TapeARN: S.optional(S.String) }, ns) {}
export class AssociateFileSystemInput extends S.Class<AssociateFileSystemInput>(
  "AssociateFileSystemInput",
)(
  {
    UserName: S.String,
    Password: S.String,
    ClientToken: S.String,
    GatewayARN: S.String,
    LocationARN: S.String,
    Tags: S.optional(Tags),
    AuditDestinationARN: S.optional(S.String),
    CacheAttributes: S.optional(CacheAttributes),
    EndpointNetworkConfiguration: S.optional(EndpointNetworkConfiguration),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttachVolumeOutput extends S.Class<AttachVolumeOutput>(
  "AttachVolumeOutput",
)({ VolumeARN: S.optional(S.String), TargetARN: S.optional(S.String) }, ns) {}
export class CancelArchivalOutput extends S.Class<CancelArchivalOutput>(
  "CancelArchivalOutput",
)({ TapeARN: S.optional(S.String) }, ns) {}
export class CancelCacheReportOutput extends S.Class<CancelCacheReportOutput>(
  "CancelCacheReportOutput",
)({ CacheReportARN: S.optional(S.String) }, ns) {}
export class CancelRetrievalOutput extends S.Class<CancelRetrievalOutput>(
  "CancelRetrievalOutput",
)({ TapeARN: S.optional(S.String) }, ns) {}
export class CreateCachediSCSIVolumeOutput extends S.Class<CreateCachediSCSIVolumeOutput>(
  "CreateCachediSCSIVolumeOutput",
)({ VolumeARN: S.optional(S.String), TargetARN: S.optional(S.String) }, ns) {}
export class CreateNFSFileShareInput extends S.Class<CreateNFSFileShareInput>(
  "CreateNFSFileShareInput",
)(
  {
    ClientToken: S.String,
    NFSFileShareDefaults: S.optional(NFSFileShareDefaults),
    GatewayARN: S.String,
    EncryptionType: S.optional(S.String),
    KMSEncrypted: S.optional(S.Boolean),
    KMSKey: S.optional(S.String),
    Role: S.String,
    LocationARN: S.String,
    DefaultStorageClass: S.optional(S.String),
    ObjectACL: S.optional(S.String),
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSMBFileShareOutput extends S.Class<CreateSMBFileShareOutput>(
  "CreateSMBFileShareOutput",
)({ FileShareARN: S.optional(S.String) }, ns) {}
export class CreateSnapshotOutput extends S.Class<CreateSnapshotOutput>(
  "CreateSnapshotOutput",
)({ VolumeARN: S.optional(S.String), SnapshotId: S.optional(S.String) }, ns) {}
export class CreateSnapshotFromVolumeRecoveryPointOutput extends S.Class<CreateSnapshotFromVolumeRecoveryPointOutput>(
  "CreateSnapshotFromVolumeRecoveryPointOutput",
)(
  {
    SnapshotId: S.optional(S.String),
    VolumeARN: S.optional(S.String),
    VolumeRecoveryPointTime: S.optional(S.String),
  },
  ns,
) {}
export class CreateStorediSCSIVolumeOutput extends S.Class<CreateStorediSCSIVolumeOutput>(
  "CreateStorediSCSIVolumeOutput",
)(
  {
    VolumeARN: S.optional(S.String),
    VolumeSizeInBytes: S.optional(S.Number),
    TargetARN: S.optional(S.String),
  },
  ns,
) {}
export class CreateTapePoolOutput extends S.Class<CreateTapePoolOutput>(
  "CreateTapePoolOutput",
)({ PoolARN: S.optional(S.String) }, ns) {}
export class CreateTapesOutput extends S.Class<CreateTapesOutput>(
  "CreateTapesOutput",
)({ TapeARNs: S.optional(TapeARNs) }, ns) {}
export class CreateTapeWithBarcodeOutput extends S.Class<CreateTapeWithBarcodeOutput>(
  "CreateTapeWithBarcodeOutput",
)({ TapeARN: S.optional(S.String) }, ns) {}
export class DeleteAutomaticTapeCreationPolicyOutput extends S.Class<DeleteAutomaticTapeCreationPolicyOutput>(
  "DeleteAutomaticTapeCreationPolicyOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class DeleteBandwidthRateLimitOutput extends S.Class<DeleteBandwidthRateLimitOutput>(
  "DeleteBandwidthRateLimitOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class DeleteCacheReportOutput extends S.Class<DeleteCacheReportOutput>(
  "DeleteCacheReportOutput",
)({ CacheReportARN: S.optional(S.String) }, ns) {}
export class DeleteChapCredentialsOutput extends S.Class<DeleteChapCredentialsOutput>(
  "DeleteChapCredentialsOutput",
)(
  { TargetARN: S.optional(S.String), InitiatorName: S.optional(S.String) },
  ns,
) {}
export class DeleteFileShareOutput extends S.Class<DeleteFileShareOutput>(
  "DeleteFileShareOutput",
)({ FileShareARN: S.optional(S.String) }, ns) {}
export class DeleteGatewayOutput extends S.Class<DeleteGatewayOutput>(
  "DeleteGatewayOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class DeleteSnapshotScheduleOutput extends S.Class<DeleteSnapshotScheduleOutput>(
  "DeleteSnapshotScheduleOutput",
)({ VolumeARN: S.optional(S.String) }, ns) {}
export class DeleteTapeOutput extends S.Class<DeleteTapeOutput>(
  "DeleteTapeOutput",
)({ TapeARN: S.optional(S.String) }, ns) {}
export class DeleteTapeArchiveOutput extends S.Class<DeleteTapeArchiveOutput>(
  "DeleteTapeArchiveOutput",
)({ TapeARN: S.optional(S.String) }, ns) {}
export class DeleteTapePoolOutput extends S.Class<DeleteTapePoolOutput>(
  "DeleteTapePoolOutput",
)({ PoolARN: S.optional(S.String) }, ns) {}
export class DeleteVolumeOutput extends S.Class<DeleteVolumeOutput>(
  "DeleteVolumeOutput",
)({ VolumeARN: S.optional(S.String) }, ns) {}
export class DescribeAvailabilityMonitorTestOutput extends S.Class<DescribeAvailabilityMonitorTestOutput>(
  "DescribeAvailabilityMonitorTestOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    Status: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export class DescribeBandwidthRateLimitOutput extends S.Class<DescribeBandwidthRateLimitOutput>(
  "DescribeBandwidthRateLimitOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    AverageUploadRateLimitInBitsPerSec: S.optional(S.Number),
    AverageDownloadRateLimitInBitsPerSec: S.optional(S.Number),
  },
  ns,
) {}
export class DescribeBandwidthRateLimitScheduleOutput extends S.Class<DescribeBandwidthRateLimitScheduleOutput>(
  "DescribeBandwidthRateLimitScheduleOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    BandwidthRateLimitIntervals: S.optional(BandwidthRateLimitIntervals),
  },
  ns,
) {}
export class DescribeCacheOutput extends S.Class<DescribeCacheOutput>(
  "DescribeCacheOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    DiskIds: S.optional(DiskIds),
    CacheAllocatedInBytes: S.optional(S.Number),
    CacheUsedPercentage: S.optional(S.Number),
    CacheDirtyPercentage: S.optional(S.Number),
    CacheHitPercentage: S.optional(S.Number),
    CacheMissPercentage: S.optional(S.Number),
  },
  ns,
) {}
export class DescribeMaintenanceStartTimeOutput extends S.Class<DescribeMaintenanceStartTimeOutput>(
  "DescribeMaintenanceStartTimeOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    HourOfDay: S.optional(S.Number),
    MinuteOfHour: S.optional(S.Number),
    DayOfWeek: S.optional(S.Number),
    DayOfMonth: S.optional(S.Number),
    Timezone: S.optional(S.String),
    SoftwareUpdatePreferences: S.optional(SoftwareUpdatePreferences),
  },
  ns,
) {}
export class DescribeSMBSettingsOutput extends S.Class<DescribeSMBSettingsOutput>(
  "DescribeSMBSettingsOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    DomainName: S.optional(S.String),
    ActiveDirectoryStatus: S.optional(S.String),
    SMBGuestPasswordSet: S.optional(S.Boolean),
    SMBSecurityStrategy: S.optional(S.String),
    FileSharesVisible: S.optional(S.Boolean),
    SMBLocalGroups: S.optional(SMBLocalGroups),
  },
  ns,
) {}
export class DescribeSnapshotScheduleOutput extends S.Class<DescribeSnapshotScheduleOutput>(
  "DescribeSnapshotScheduleOutput",
)(
  {
    VolumeARN: S.optional(S.String),
    StartAt: S.optional(S.Number),
    RecurrenceInHours: S.optional(S.Number),
    Description: S.optional(S.String),
    Timezone: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  ns,
) {}
export class DescribeUploadBufferOutput extends S.Class<DescribeUploadBufferOutput>(
  "DescribeUploadBufferOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    DiskIds: S.optional(DiskIds),
    UploadBufferUsedInBytes: S.optional(S.Number),
    UploadBufferAllocatedInBytes: S.optional(S.Number),
  },
  ns,
) {}
export class DescribeWorkingStorageOutput extends S.Class<DescribeWorkingStorageOutput>(
  "DescribeWorkingStorageOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    DiskIds: S.optional(DiskIds),
    WorkingStorageUsedInBytes: S.optional(S.Number),
    WorkingStorageAllocatedInBytes: S.optional(S.Number),
  },
  ns,
) {}
export class DetachVolumeOutput extends S.Class<DetachVolumeOutput>(
  "DetachVolumeOutput",
)({ VolumeARN: S.optional(S.String) }, ns) {}
export class DisableGatewayOutput extends S.Class<DisableGatewayOutput>(
  "DisableGatewayOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class DisassociateFileSystemOutput extends S.Class<DisassociateFileSystemOutput>(
  "DisassociateFileSystemOutput",
)({ FileSystemAssociationARN: S.optional(S.String) }, ns) {}
export class EvictFilesFailingUploadOutput extends S.Class<EvictFilesFailingUploadOutput>(
  "EvictFilesFailingUploadOutput",
)({ NotificationId: S.optional(S.String) }, ns) {}
export class JoinDomainOutput extends S.Class<JoinDomainOutput>(
  "JoinDomainOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    ActiveDirectoryStatus: S.optional(S.String),
  },
  ns,
) {}
export class ListCacheReportsOutput extends S.Class<ListCacheReportsOutput>(
  "ListCacheReportsOutput",
)(
  {
    CacheReportList: S.optional(CacheReportList),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)(
  {
    ResourceARN: S.optional(S.String),
    Marker: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  ns,
) {}
export class ListVolumeInitiatorsOutput extends S.Class<ListVolumeInitiatorsOutput>(
  "ListVolumeInitiatorsOutput",
)({ Initiators: S.optional(Initiators) }, ns) {}
export class NotifyWhenUploadedOutput extends S.Class<NotifyWhenUploadedOutput>(
  "NotifyWhenUploadedOutput",
)(
  { FileShareARN: S.optional(S.String), NotificationId: S.optional(S.String) },
  ns,
) {}
export class RefreshCacheOutput extends S.Class<RefreshCacheOutput>(
  "RefreshCacheOutput",
)(
  { FileShareARN: S.optional(S.String), NotificationId: S.optional(S.String) },
  ns,
) {}
export class RemoveTagsFromResourceOutput extends S.Class<RemoveTagsFromResourceOutput>(
  "RemoveTagsFromResourceOutput",
)({ ResourceARN: S.optional(S.String) }, ns) {}
export class ResetCacheOutput extends S.Class<ResetCacheOutput>(
  "ResetCacheOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class RetrieveTapeArchiveOutput extends S.Class<RetrieveTapeArchiveOutput>(
  "RetrieveTapeArchiveOutput",
)({ TapeARN: S.optional(S.String) }, ns) {}
export class RetrieveTapeRecoveryPointOutput extends S.Class<RetrieveTapeRecoveryPointOutput>(
  "RetrieveTapeRecoveryPointOutput",
)({ TapeARN: S.optional(S.String) }, ns) {}
export class SetLocalConsolePasswordOutput extends S.Class<SetLocalConsolePasswordOutput>(
  "SetLocalConsolePasswordOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class SetSMBGuestPasswordOutput extends S.Class<SetSMBGuestPasswordOutput>(
  "SetSMBGuestPasswordOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class ShutdownGatewayOutput extends S.Class<ShutdownGatewayOutput>(
  "ShutdownGatewayOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class StartAvailabilityMonitorTestOutput extends S.Class<StartAvailabilityMonitorTestOutput>(
  "StartAvailabilityMonitorTestOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class StartCacheReportInput extends S.Class<StartCacheReportInput>(
  "StartCacheReportInput",
)(
  {
    FileShareARN: S.String,
    Role: S.String,
    LocationARN: S.String,
    BucketRegion: S.String,
    VPCEndpointDNSName: S.optional(S.String),
    InclusionFilters: S.optional(CacheReportFilterList),
    ExclusionFilters: S.optional(CacheReportFilterList),
    ClientToken: S.String,
    Tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartGatewayOutput extends S.Class<StartGatewayOutput>(
  "StartGatewayOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class UpdateAutomaticTapeCreationPolicyInput extends S.Class<UpdateAutomaticTapeCreationPolicyInput>(
  "UpdateAutomaticTapeCreationPolicyInput",
)(
  {
    AutomaticTapeCreationRules: AutomaticTapeCreationRules,
    GatewayARN: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateBandwidthRateLimitOutput extends S.Class<UpdateBandwidthRateLimitOutput>(
  "UpdateBandwidthRateLimitOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class UpdateBandwidthRateLimitScheduleInput extends S.Class<UpdateBandwidthRateLimitScheduleInput>(
  "UpdateBandwidthRateLimitScheduleInput",
)(
  {
    GatewayARN: S.String,
    BandwidthRateLimitIntervals: BandwidthRateLimitIntervals,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateChapCredentialsOutput extends S.Class<UpdateChapCredentialsOutput>(
  "UpdateChapCredentialsOutput",
)(
  { TargetARN: S.optional(S.String), InitiatorName: S.optional(S.String) },
  ns,
) {}
export class UpdateFileSystemAssociationOutput extends S.Class<UpdateFileSystemAssociationOutput>(
  "UpdateFileSystemAssociationOutput",
)({ FileSystemAssociationARN: S.optional(S.String) }, ns) {}
export class UpdateGatewayInformationOutput extends S.Class<UpdateGatewayInformationOutput>(
  "UpdateGatewayInformationOutput",
)(
  { GatewayARN: S.optional(S.String), GatewayName: S.optional(S.String) },
  ns,
) {}
export class UpdateGatewaySoftwareNowOutput extends S.Class<UpdateGatewaySoftwareNowOutput>(
  "UpdateGatewaySoftwareNowOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class UpdateMaintenanceStartTimeInput extends S.Class<UpdateMaintenanceStartTimeInput>(
  "UpdateMaintenanceStartTimeInput",
)(
  {
    GatewayARN: S.String,
    HourOfDay: S.optional(S.Number),
    MinuteOfHour: S.optional(S.Number),
    DayOfWeek: S.optional(S.Number),
    DayOfMonth: S.optional(S.Number),
    SoftwareUpdatePreferences: S.optional(SoftwareUpdatePreferences),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateNFSFileShareOutput extends S.Class<UpdateNFSFileShareOutput>(
  "UpdateNFSFileShareOutput",
)({ FileShareARN: S.optional(S.String) }, ns) {}
export class UpdateSMBFileShareOutput extends S.Class<UpdateSMBFileShareOutput>(
  "UpdateSMBFileShareOutput",
)({ FileShareARN: S.optional(S.String) }, ns) {}
export class UpdateSMBFileShareVisibilityOutput extends S.Class<UpdateSMBFileShareVisibilityOutput>(
  "UpdateSMBFileShareVisibilityOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class UpdateSMBLocalGroupsInput extends S.Class<UpdateSMBLocalGroupsInput>(
  "UpdateSMBLocalGroupsInput",
)(
  { GatewayARN: S.String, SMBLocalGroups: SMBLocalGroups },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSMBSecurityStrategyOutput extends S.Class<UpdateSMBSecurityStrategyOutput>(
  "UpdateSMBSecurityStrategyOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class UpdateSnapshotScheduleOutput extends S.Class<UpdateSnapshotScheduleOutput>(
  "UpdateSnapshotScheduleOutput",
)({ VolumeARN: S.optional(S.String) }, ns) {}
export class UpdateVTLDeviceTypeOutput extends S.Class<UpdateVTLDeviceTypeOutput>(
  "UpdateVTLDeviceTypeOutput",
)({ VTLDeviceARN: S.optional(S.String) }, ns) {}
export const DiskAttributeList = S.Array(S.String);
export class ChapInfo extends S.Class<ChapInfo>("ChapInfo")({
  TargetARN: S.optional(S.String),
  SecretToAuthenticateInitiator: S.optional(S.String),
  InitiatorName: S.optional(S.String),
  SecretToAuthenticateTarget: S.optional(S.String),
}) {}
export const ChapCredentials = S.Array(ChapInfo);
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({
  Ipv4Address: S.optional(S.String),
  MacAddress: S.optional(S.String),
  Ipv6Address: S.optional(S.String),
}) {}
export const GatewayNetworkInterfaces = S.Array(NetworkInterface);
export class NFSFileShareInfo extends S.Class<NFSFileShareInfo>(
  "NFSFileShareInfo",
)({
  NFSFileShareDefaults: S.optional(NFSFileShareDefaults),
  FileShareARN: S.optional(S.String),
  FileShareId: S.optional(S.String),
  FileShareStatus: S.optional(S.String),
  GatewayARN: S.optional(S.String),
  EncryptionType: S.optional(S.String),
  KMSEncrypted: S.optional(S.Boolean),
  KMSKey: S.optional(S.String),
  Path: S.optional(S.String),
  Role: S.optional(S.String),
  LocationARN: S.optional(S.String),
  DefaultStorageClass: S.optional(S.String),
  ObjectACL: S.optional(S.String),
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
}) {}
export const NFSFileShareInfoList = S.Array(NFSFileShareInfo);
export class SMBFileShareInfo extends S.Class<SMBFileShareInfo>(
  "SMBFileShareInfo",
)({
  FileShareARN: S.optional(S.String),
  FileShareId: S.optional(S.String),
  FileShareStatus: S.optional(S.String),
  GatewayARN: S.optional(S.String),
  EncryptionType: S.optional(S.String),
  KMSEncrypted: S.optional(S.Boolean),
  KMSKey: S.optional(S.String),
  Path: S.optional(S.String),
  Role: S.optional(S.String),
  LocationARN: S.optional(S.String),
  DefaultStorageClass: S.optional(S.String),
  ObjectACL: S.optional(S.String),
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
  CaseSensitivity: S.optional(S.String),
  Tags: S.optional(Tags),
  FileShareName: S.optional(S.String),
  CacheAttributes: S.optional(CacheAttributes),
  NotificationPolicy: S.optional(S.String),
  VPCEndpointDNSName: S.optional(S.String),
  BucketRegion: S.optional(S.String),
  OplocksEnabled: S.optional(S.Boolean),
}) {}
export const SMBFileShareInfoList = S.Array(SMBFileShareInfo);
export class VolumeiSCSIAttributes extends S.Class<VolumeiSCSIAttributes>(
  "VolumeiSCSIAttributes",
)({
  TargetARN: S.optional(S.String),
  NetworkInterfaceId: S.optional(S.String),
  NetworkInterfacePort: S.optional(S.Number),
  LunNumber: S.optional(S.Number),
  ChapEnabled: S.optional(S.Boolean),
}) {}
export class StorediSCSIVolume extends S.Class<StorediSCSIVolume>(
  "StorediSCSIVolume",
)({
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
}) {}
export const StorediSCSIVolumes = S.Array(StorediSCSIVolume);
export class TapeArchive extends S.Class<TapeArchive>("TapeArchive")({
  TapeARN: S.optional(S.String),
  TapeBarcode: S.optional(S.String),
  TapeCreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
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
}) {}
export const TapeArchives = S.Array(TapeArchive);
export class TapeRecoveryPointInfo extends S.Class<TapeRecoveryPointInfo>(
  "TapeRecoveryPointInfo",
)({
  TapeARN: S.optional(S.String),
  TapeRecoveryPointTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TapeSizeInBytes: S.optional(S.Number),
  TapeStatus: S.optional(S.String),
}) {}
export const TapeRecoveryPointInfos = S.Array(TapeRecoveryPointInfo);
export class Tape extends S.Class<Tape>("Tape")({
  TapeARN: S.optional(S.String),
  TapeBarcode: S.optional(S.String),
  TapeCreatedDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
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
}) {}
export const Tapes = S.Array(Tape);
export class AutomaticTapeCreationPolicyInfo extends S.Class<AutomaticTapeCreationPolicyInfo>(
  "AutomaticTapeCreationPolicyInfo",
)({
  AutomaticTapeCreationRules: S.optional(AutomaticTapeCreationRules),
  GatewayARN: S.optional(S.String),
}) {}
export const AutomaticTapeCreationPolicyInfos = S.Array(
  AutomaticTapeCreationPolicyInfo,
);
export class FileShareInfo extends S.Class<FileShareInfo>("FileShareInfo")({
  FileShareType: S.optional(S.String),
  FileShareARN: S.optional(S.String),
  FileShareId: S.optional(S.String),
  FileShareStatus: S.optional(S.String),
  GatewayARN: S.optional(S.String),
}) {}
export const FileShareInfoList = S.Array(FileShareInfo);
export class FileSystemAssociationSummary extends S.Class<FileSystemAssociationSummary>(
  "FileSystemAssociationSummary",
)({
  FileSystemAssociationId: S.optional(S.String),
  FileSystemAssociationARN: S.optional(S.String),
  FileSystemAssociationStatus: S.optional(S.String),
  GatewayARN: S.optional(S.String),
}) {}
export const FileSystemAssociationSummaryList = S.Array(
  FileSystemAssociationSummary,
);
export class GatewayInfo extends S.Class<GatewayInfo>("GatewayInfo")({
  GatewayId: S.optional(S.String),
  GatewayARN: S.optional(S.String),
  GatewayType: S.optional(S.String),
  GatewayOperationalState: S.optional(S.String),
  GatewayName: S.optional(S.String),
  Ec2InstanceId: S.optional(S.String),
  Ec2InstanceRegion: S.optional(S.String),
  HostEnvironment: S.optional(S.String),
  HostEnvironmentId: S.optional(S.String),
  DeprecationDate: S.optional(S.String),
  SoftwareVersion: S.optional(S.String),
}) {}
export const Gateways = S.Array(GatewayInfo);
export class Disk extends S.Class<Disk>("Disk")({
  DiskId: S.optional(S.String),
  DiskPath: S.optional(S.String),
  DiskNode: S.optional(S.String),
  DiskStatus: S.optional(S.String),
  DiskSizeInBytes: S.optional(S.Number),
  DiskAllocationType: S.optional(S.String),
  DiskAllocationResource: S.optional(S.String),
  DiskAttributeList: S.optional(DiskAttributeList),
}) {}
export const Disks = S.Array(Disk);
export class PoolInfo extends S.Class<PoolInfo>("PoolInfo")({
  PoolARN: S.optional(S.String),
  PoolName: S.optional(S.String),
  StorageClass: S.optional(S.String),
  RetentionLockType: S.optional(S.String),
  RetentionLockTimeInDays: S.optional(S.Number),
  PoolStatus: S.optional(S.String),
}) {}
export const PoolInfos = S.Array(PoolInfo);
export class TapeInfo extends S.Class<TapeInfo>("TapeInfo")({
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
}) {}
export const TapeInfos = S.Array(TapeInfo);
export class VolumeRecoveryPointInfo extends S.Class<VolumeRecoveryPointInfo>(
  "VolumeRecoveryPointInfo",
)({
  VolumeARN: S.optional(S.String),
  VolumeSizeInBytes: S.optional(S.Number),
  VolumeUsageInBytes: S.optional(S.Number),
  VolumeRecoveryPointTime: S.optional(S.String),
}) {}
export const VolumeRecoveryPointInfos = S.Array(VolumeRecoveryPointInfo);
export class VolumeInfo extends S.Class<VolumeInfo>("VolumeInfo")({
  VolumeARN: S.optional(S.String),
  VolumeId: S.optional(S.String),
  GatewayARN: S.optional(S.String),
  GatewayId: S.optional(S.String),
  VolumeType: S.optional(S.String),
  VolumeSizeInBytes: S.optional(S.Number),
  VolumeAttachmentStatus: S.optional(S.String),
}) {}
export const VolumeInfos = S.Array(VolumeInfo);
export class ActivateGatewayOutput extends S.Class<ActivateGatewayOutput>(
  "ActivateGatewayOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class AssociateFileSystemOutput extends S.Class<AssociateFileSystemOutput>(
  "AssociateFileSystemOutput",
)({ FileSystemAssociationARN: S.optional(S.String) }, ns) {}
export class CreateNFSFileShareOutput extends S.Class<CreateNFSFileShareOutput>(
  "CreateNFSFileShareOutput",
)({ FileShareARN: S.optional(S.String) }, ns) {}
export class DescribeCacheReportOutput extends S.Class<DescribeCacheReportOutput>(
  "DescribeCacheReportOutput",
)({ CacheReportInfo: S.optional(CacheReportInfo) }, ns) {}
export class DescribeChapCredentialsOutput extends S.Class<DescribeChapCredentialsOutput>(
  "DescribeChapCredentialsOutput",
)({ ChapCredentials: S.optional(ChapCredentials) }, ns) {}
export class DescribeGatewayInformationOutput extends S.Class<DescribeGatewayInformationOutput>(
  "DescribeGatewayInformationOutput",
)(
  {
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
    HostEnvironment: S.optional(S.String),
    EndpointType: S.optional(S.String),
    SoftwareUpdatesEndDate: S.optional(S.String),
    DeprecationDate: S.optional(S.String),
    GatewayCapacity: S.optional(S.String),
    SupportedGatewayCapacities: S.optional(SupportedGatewayCapacities),
    HostEnvironmentId: S.optional(S.String),
    SoftwareVersion: S.optional(S.String),
  },
  ns,
) {}
export class DescribeNFSFileSharesOutput extends S.Class<DescribeNFSFileSharesOutput>(
  "DescribeNFSFileSharesOutput",
)({ NFSFileShareInfoList: S.optional(NFSFileShareInfoList) }, ns) {}
export class DescribeSMBFileSharesOutput extends S.Class<DescribeSMBFileSharesOutput>(
  "DescribeSMBFileSharesOutput",
)({ SMBFileShareInfoList: S.optional(SMBFileShareInfoList) }, ns) {}
export class DescribeStorediSCSIVolumesOutput extends S.Class<DescribeStorediSCSIVolumesOutput>(
  "DescribeStorediSCSIVolumesOutput",
)({ StorediSCSIVolumes: S.optional(StorediSCSIVolumes) }, ns) {}
export class DescribeTapeArchivesOutput extends S.Class<DescribeTapeArchivesOutput>(
  "DescribeTapeArchivesOutput",
)(
  { TapeArchives: S.optional(TapeArchives), Marker: S.optional(S.String) },
  ns,
) {}
export class DescribeTapeRecoveryPointsOutput extends S.Class<DescribeTapeRecoveryPointsOutput>(
  "DescribeTapeRecoveryPointsOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    TapeRecoveryPointInfos: S.optional(TapeRecoveryPointInfos),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export class DescribeTapesOutput extends S.Class<DescribeTapesOutput>(
  "DescribeTapesOutput",
)({ Tapes: S.optional(Tapes), Marker: S.optional(S.String) }, ns) {}
export class ListAutomaticTapeCreationPoliciesOutput extends S.Class<ListAutomaticTapeCreationPoliciesOutput>(
  "ListAutomaticTapeCreationPoliciesOutput",
)(
  {
    AutomaticTapeCreationPolicyInfos: S.optional(
      AutomaticTapeCreationPolicyInfos,
    ),
  },
  ns,
) {}
export class ListFileSharesOutput extends S.Class<ListFileSharesOutput>(
  "ListFileSharesOutput",
)(
  {
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    FileShareInfoList: S.optional(FileShareInfoList),
  },
  ns,
) {}
export class ListFileSystemAssociationsOutput extends S.Class<ListFileSystemAssociationsOutput>(
  "ListFileSystemAssociationsOutput",
)(
  {
    Marker: S.optional(S.String),
    NextMarker: S.optional(S.String),
    FileSystemAssociationSummaryList: S.optional(
      FileSystemAssociationSummaryList,
    ),
  },
  ns,
) {}
export class ListGatewaysOutput extends S.Class<ListGatewaysOutput>(
  "ListGatewaysOutput",
)({ Gateways: S.optional(Gateways), Marker: S.optional(S.String) }, ns) {}
export class ListLocalDisksOutput extends S.Class<ListLocalDisksOutput>(
  "ListLocalDisksOutput",
)({ GatewayARN: S.optional(S.String), Disks: S.optional(Disks) }, ns) {}
export class ListTapePoolsOutput extends S.Class<ListTapePoolsOutput>(
  "ListTapePoolsOutput",
)({ PoolInfos: S.optional(PoolInfos), Marker: S.optional(S.String) }, ns) {}
export class ListTapesOutput extends S.Class<ListTapesOutput>(
  "ListTapesOutput",
)({ TapeInfos: S.optional(TapeInfos), Marker: S.optional(S.String) }, ns) {}
export class ListVolumeRecoveryPointsOutput extends S.Class<ListVolumeRecoveryPointsOutput>(
  "ListVolumeRecoveryPointsOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    VolumeRecoveryPointInfos: S.optional(VolumeRecoveryPointInfos),
  },
  ns,
) {}
export class ListVolumesOutput extends S.Class<ListVolumesOutput>(
  "ListVolumesOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    Marker: S.optional(S.String),
    VolumeInfos: S.optional(VolumeInfos),
  },
  ns,
) {}
export class StartCacheReportOutput extends S.Class<StartCacheReportOutput>(
  "StartCacheReportOutput",
)({ CacheReportARN: S.optional(S.String) }, ns) {}
export class UpdateAutomaticTapeCreationPolicyOutput extends S.Class<UpdateAutomaticTapeCreationPolicyOutput>(
  "UpdateAutomaticTapeCreationPolicyOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class UpdateBandwidthRateLimitScheduleOutput extends S.Class<UpdateBandwidthRateLimitScheduleOutput>(
  "UpdateBandwidthRateLimitScheduleOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class UpdateMaintenanceStartTimeOutput extends S.Class<UpdateMaintenanceStartTimeOutput>(
  "UpdateMaintenanceStartTimeOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class UpdateSMBLocalGroupsOutput extends S.Class<UpdateSMBLocalGroupsOutput>(
  "UpdateSMBLocalGroupsOutput",
)({ GatewayARN: S.optional(S.String) }, ns) {}
export class FileSystemAssociationStatusDetail extends S.Class<FileSystemAssociationStatusDetail>(
  "FileSystemAssociationStatusDetail",
)({ ErrorCode: S.optional(S.String) }) {}
export const FileSystemAssociationStatusDetails = S.Array(
  FileSystemAssociationStatusDetail,
);
export class DeviceiSCSIAttributes extends S.Class<DeviceiSCSIAttributes>(
  "DeviceiSCSIAttributes",
)({
  TargetARN: S.optional(S.String),
  NetworkInterfaceId: S.optional(S.String),
  NetworkInterfacePort: S.optional(S.Number),
  ChapEnabled: S.optional(S.Boolean),
}) {}
export class CachediSCSIVolume extends S.Class<CachediSCSIVolume>(
  "CachediSCSIVolume",
)({
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
}) {}
export const CachediSCSIVolumes = S.Array(CachediSCSIVolume);
export class FileSystemAssociationInfo extends S.Class<FileSystemAssociationInfo>(
  "FileSystemAssociationInfo",
)({
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
}) {}
export const FileSystemAssociationInfoList = S.Array(FileSystemAssociationInfo);
export class VTLDevice extends S.Class<VTLDevice>("VTLDevice")({
  VTLDeviceARN: S.optional(S.String),
  VTLDeviceType: S.optional(S.String),
  VTLDeviceVendor: S.optional(S.String),
  VTLDeviceProductIdentifier: S.optional(S.String),
  DeviceiSCSIAttributes: S.optional(DeviceiSCSIAttributes),
}) {}
export const VTLDevices = S.Array(VTLDevice);
export class DescribeCachediSCSIVolumesOutput extends S.Class<DescribeCachediSCSIVolumesOutput>(
  "DescribeCachediSCSIVolumesOutput",
)({ CachediSCSIVolumes: S.optional(CachediSCSIVolumes) }, ns) {}
export class DescribeFileSystemAssociationsOutput extends S.Class<DescribeFileSystemAssociationsOutput>(
  "DescribeFileSystemAssociationsOutput",
)(
  { FileSystemAssociationInfoList: S.optional(FileSystemAssociationInfoList) },
  ns,
) {}
export class DescribeVTLDevicesOutput extends S.Class<DescribeVTLDevicesOutput>(
  "DescribeVTLDevicesOutput",
)(
  {
    GatewayARN: S.optional(S.String),
    VTLDevices: S.optional(VTLDevices),
    Marker: S.optional(S.String),
  },
  ns,
) {}
export const errorDetails = S.Record({ key: S.String, value: S.String });
export class StorageGatewayError extends S.Class<StorageGatewayError>(
  "StorageGatewayError",
)({
  errorCode: S.optional(S.String),
  errorDetails: S.optional(errorDetails),
}) {}

//# Errors
export class InternalServerError extends S.TaggedError<InternalServerError>()(
  "InternalServerError",
  {},
) {}
export class InvalidGatewayRequestException extends S.TaggedError<InvalidGatewayRequestException>()(
  "InvalidGatewayRequestException",
  {},
) {}
export class ServiceUnavailableError extends S.TaggedError<ServiceUnavailableError>()(
  "ServiceUnavailableError",
  {},
) {}

//# Operations
/**
 * Configures one or more gateway local disks as upload buffer for a specified gateway.
 * This operation is supported for the stored volume, cached volume, and tape gateway
 * types.
 *
 * In the request, you specify the gateway Amazon Resource Name (ARN) to which you want to
 * add upload buffer, and one or more disk IDs that you want to configure as upload
 * buffer.
 */
export const addUploadBuffer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addWorkingStorage = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const assignTapePool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const attachVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AttachVolumeInput,
  output: AttachVolumeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Cancels archiving of a virtual tape to the virtual tape shelf (VTS) after the archiving
 * process is initiated. This operation is only supported in the tape gateway type.
 */
export const cancelArchival = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelCacheReport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelCacheReportInput,
  output: CancelCacheReportOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Cancels retrieval of a virtual tape from the virtual tape shelf (VTS) to a gateway after
 * the retrieval process is initiated. The virtual tape is returned to the VTS. This operation
 * is only supported in the tape gateway type.
 */
export const cancelRetrieval = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCachediSCSIVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCachediSCSIVolumeInput,
    output: CreateCachediSCSIVolumeOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const createSMBFileShare = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSMBFileShareInput,
  output: CreateSMBFileShareOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
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
export const createSnapshotFromVolumeRecoveryPoint =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateSnapshotFromVolumeRecoveryPointInput,
    output: CreateSnapshotFromVolumeRecoveryPointOutput,
    errors: [
      InternalServerError,
      InvalidGatewayRequestException,
      ServiceUnavailableError,
    ],
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
export const createStorediSCSIVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateStorediSCSIVolumeInput,
    output: CreateStorediSCSIVolumeOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Creates a new custom tape pool. You can use custom tape pool to enable tape retention
 * lock on tapes that are archived in the custom pool.
 */
export const createTapePool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTapes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTapeWithBarcode = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTapeWithBarcodeInput,
    output: CreateTapeWithBarcodeOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Deletes the automatic tape creation policy of a gateway. If you delete this policy, new
 * virtual tapes must be created manually. Use the Amazon Resource Name (ARN) of the gateway
 * in your request to remove the policy.
 */
export const deleteAutomaticTapeCreationPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteBandwidthRateLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBandwidthRateLimitInput,
    output: DeleteBandwidthRateLimitOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Deletes the specified cache report and any associated tags from the Storage Gateway database. You can only delete completed reports. If the status of the
 * report you attempt to delete still IN-PROGRESS, the delete operation returns an error. You
 * can use `CancelCacheReport` to cancel an IN-PROGRESS report.
 *
 * `DeleteCacheReport` does not delete the report object from your Amazon S3 bucket.
 */
export const deleteCacheReport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCacheReportInput,
  output: DeleteCacheReportOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Deletes Challenge-Handshake Authentication Protocol (CHAP) credentials for a specified
 * iSCSI target and initiator pair. This operation is supported in volume and tape gateway
 * types.
 */
export const deleteChapCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteChapCredentialsInput,
    output: DeleteChapCredentialsOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Deletes a file share from an S3 File Gateway. This operation is only supported for S3
 * File Gateways.
 */
export const deleteFileShare = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSnapshotSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSnapshotScheduleInput,
    output: DeleteSnapshotScheduleOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Deletes the specified virtual tape. This operation is only supported in the tape gateway
 * type.
 */
export const deleteTape = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTapeInput,
  output: DeleteTapeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Deletes the specified virtual tape from the virtual tape shelf (VTS). This operation is
 * only supported in the tape gateway type.
 */
export const deleteTapeArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTapeArchiveInput,
  output: DeleteTapeArchiveOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Delete a custom tape pool. A custom tape pool can only be deleted if there are no tapes
 * in the pool and if there are no automatic tape creation policies that reference the custom
 * tape pool.
 */
export const deleteTapePool = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteVolumeInput,
  output: DeleteVolumeOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns information about the most recent high availability monitoring test that was
 * performed on the host in a cluster. If a test isn't performed, the status and start
 * time in the response would be null.
 */
export const describeAvailabilityMonitorTest =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeBandwidthRateLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeBandwidthRateLimitInput,
    output: DescribeBandwidthRateLimitOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const describeBandwidthRateLimitSchedule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCacheInput,
  output: DescribeCacheOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns your gateway's maintenance window schedule information, with values for
 * monthly or weekly cadence, specific day and time to begin maintenance, and which types of
 * updates to apply. Time values returned are for the gateway's time zone.
 */
export const describeMaintenanceStartTime =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeMaintenanceStartTimeInput,
    output: DescribeMaintenanceStartTimeOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }));
/**
 * Gets a description of a Server Message Block (SMB) file share settings from a file
 * gateway. This operation is only supported for file gateways.
 */
export const describeSMBSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeSnapshotSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSnapshotScheduleInput,
    output: DescribeSnapshotScheduleOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Returns information about the upload buffer of a gateway. This operation is supported
 * for the stored volume, cached volume, and tape gateway types.
 *
 * The response includes disk IDs that are configured as upload buffer space, and it
 * includes the amount of upload buffer space allocated and used.
 */
export const describeUploadBuffer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeUploadBufferInput,
    output: DescribeUploadBufferOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const describeWorkingStorage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeWorkingStorageInput,
    output: DescribeWorkingStorageOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Disconnects a volume from an iSCSI connection and then detaches the volume from the
 * specified gateway. Detaching and attaching a volume enables you to recover your data from
 * one gateway to a different gateway without creating a snapshot. It also makes it easier to
 * move your volumes from an on-premises gateway to a gateway hosted on an Amazon EC2
 * instance. This operation is only supported in the volume gateway type.
 */
export const detachVolume = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const disableGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableGatewayInput,
  output: DisableGatewayOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Disassociates an Amazon FSx file system from the specified gateway. After the
 * disassociation process finishes, the gateway can no longer access the Amazon FSx
 * file system. This operation is only supported in the FSx File Gateway type.
 */
export const disassociateFileSystem = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DisassociateFileSystemInput,
    output: DisassociateFileSystemOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const evictFilesFailingUpload = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: EvictFilesFailingUploadInput,
    output: EvictFilesFailingUploadOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const joinDomain = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listCacheReports = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCacheReportsInput,
  output: ListCacheReportsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Lists the tags that have been added to the specified resource. This operation is
 * supported in storage gateways of all types.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Lists iSCSI initiators that are connected to a volume. You can use this operation to
 * determine whether a volume is being used or not. This operation is only supported in the
 * cached volume and stored volume gateway types.
 */
export const listVolumeInitiators = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListVolumeInitiatorsInput,
    output: ListVolumeInitiatorsOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const notifyWhenUploaded = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const refreshCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RefreshCacheInput,
  output: RefreshCacheOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Removes one or more tags from the specified resource. This operation is supported in
 * storage gateways of all types.
 */
export const removeTagsFromResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveTagsFromResourceInput,
    output: RemoveTagsFromResourceOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const resetCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const retrieveTapeArchive = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const retrieveTapeRecoveryPoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RetrieveTapeRecoveryPointInput,
    output: RetrieveTapeRecoveryPointOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Sets the password for your VM local console. When you log in to the local console for
 * the first time, you log in to the VM with the default credentials. We recommend that you
 * set a new password. You don't need to know the default password to set a new
 * password.
 */
export const setLocalConsolePassword = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SetLocalConsolePasswordInput,
    output: SetLocalConsolePasswordOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Sets the password for the guest user `smbguest`. The `smbguest`
 * user is the user when the authentication method for the file share is set to
 * `GuestAccess`. This operation only supported for S3 File Gateways
 */
export const setSMBGuestPassword = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const shutdownGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startAvailabilityMonitorTest =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBandwidthRateLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateBandwidthRateLimitInput,
    output: UpdateBandwidthRateLimitOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Updates the Challenge-Handshake Authentication Protocol (CHAP) credentials for a
 * specified iSCSI target. By default, a gateway does not have CHAP enabled; however, for
 * added security, you might use it. This operation is supported in the volume and tape
 * gateway types.
 *
 * When you update CHAP credentials, all existing connections on the target are closed
 * and initiators must reconnect with the new credentials.
 */
export const updateChapCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateChapCredentialsInput,
    output: UpdateChapCredentialsOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Updates a file system association. This operation is only supported in the FSx File
 * Gateways.
 */
export const updateFileSystemAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateFileSystemAssociationInput,
    output: UpdateFileSystemAssociationOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Updates a gateway's metadata, which includes the gateway's name, time zone,
 * and metadata cache size. To specify which gateway to update, use the Amazon Resource Name
 * (ARN) of the gateway in your request.
 *
 * For gateways activated after September 2, 2015, the gateway's ARN contains the
 * gateway ID rather than the gateway name. However, changing the name of the gateway has
 * no effect on the gateway's ARN.
 */
export const updateGatewayInformation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateGatewayInformationInput,
    output: UpdateGatewayInformationOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const updateGatewaySoftwareNow = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateGatewaySoftwareNowInput,
    output: UpdateGatewaySoftwareNowOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const updateNFSFileShare = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSMBFileShare = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSMBFileShareInput,
  output: UpdateSMBFileShareOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Controls whether the shares on an S3 File Gateway are visible in a net view or browse
 * list. The operation is only supported for S3 File Gateways.
 */
export const updateSMBFileShareVisibility =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSMBSecurityStrategy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSMBSecurityStrategyInput,
    output: UpdateSMBSecurityStrategyOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const updateSnapshotSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSnapshotScheduleInput,
    output: UpdateSnapshotScheduleOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Updates the type of medium changer in a tape gateway. When you activate a tape gateway,
 * you select a medium changer type for the tape gateway. This operation enables you to select
 * a different type of medium changer after a tape gateway is activated. This operation is
 * only supported in the tape gateway type.
 */
export const updateVTLDeviceType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const activateGateway = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ActivateGatewayInput,
  output: ActivateGatewayOutput,
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
export const addTagsToResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToResourceInput,
  output: AddTagsToResourceOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Associate an Amazon FSx file system with the FSx File Gateway. After the
 * association process is complete, the file shares on the Amazon FSx file system are
 * available for access through the gateway. This operation only supports the FSx File Gateway
 * type.
 */
export const associateFileSystem = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createNFSFileShare = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNFSFileShareInput,
  output: CreateNFSFileShareOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
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
export const createSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotInput,
  output: CreateSnapshotOutput,
  errors: [
    InternalServerError,
    InvalidGatewayRequestException,
    ServiceUnavailableError,
  ],
}));
/**
 * Returns information about the specified cache report, including completion status and
 * generation progress.
 */
export const describeCacheReport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCacheReportInput,
  output: DescribeCacheReportOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Returns an array of Challenge-Handshake Authentication Protocol (CHAP) credentials
 * information for a specified iSCSI target, one for each target-initiator pair. This
 * operation is supported in the volume and tape gateway types.
 */
export const describeChapCredentials = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeChapCredentialsInput,
    output: DescribeChapCredentialsOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Returns metadata about a gateway such as its name, network interfaces, time zone,
 * status, and software version. To specify which gateway to describe, use the Amazon Resource
 * Name (ARN) of the gateway in your request.
 */
export const describeGatewayInformation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeGatewayInformationInput,
    output: DescribeGatewayInformationOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Gets a description for one or more Network File System (NFS) file shares from an S3 File
 * Gateway. This operation is only supported for S3 File Gateways.
 */
export const describeNFSFileShares = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeNFSFileSharesInput,
    output: DescribeNFSFileSharesOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Gets a description for one or more Server Message Block (SMB) file shares from a S3 File
 * Gateway. This operation is only supported for S3 File Gateways.
 */
export const describeSMBFileShares = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSMBFileSharesInput,
    output: DescribeSMBFileSharesOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Returns the description of the gateway volumes specified in the request. The list of
 * gateway volumes in the request must be from one gateway. In the response, Storage Gateway returns volume information sorted by volume ARNs. This operation is only
 * supported in stored volume gateway type.
 */
export const describeStorediSCSIVolumes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeStorediSCSIVolumesInput,
    output: DescribeStorediSCSIVolumesOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Returns a description of specified virtual tapes in the virtual tape shelf (VTS). This
 * operation is only supported in the tape gateway type.
 *
 * If a specific `TapeARN` is not specified, Storage Gateway returns a
 * description of all virtual tapes found in the VTS associated with your account.
 */
export const describeTapeArchives = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTapeArchivesInput,
    output: DescribeTapeArchivesOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Returns a list of virtual tape recovery points that are available for the specified tape
 * gateway.
 *
 * A recovery point is a point-in-time view of a virtual tape at which all the data on the
 * virtual tape is consistent. If your gateway crashes, virtual tapes that have recovery
 * points can be recovered to a new gateway. This operation is only supported in the tape
 * gateway type.
 */
export const describeTapeRecoveryPoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTapeRecoveryPointsInput,
    output: DescribeTapeRecoveryPointsOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const describeTapes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTapesInput,
  output: DescribeTapesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Lists the automatic tape creation policies for a gateway. If there are no automatic tape
 * creation policies for the gateway, it returns an empty list.
 *
 * This operation is only supported for tape gateways.
 */
export const listAutomaticTapeCreationPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAutomaticTapeCreationPoliciesInput,
    output: ListAutomaticTapeCreationPoliciesOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }));
/**
 * Gets a list of the file shares for a specific S3 File Gateway, or the list of file
 * shares that belong to the calling Amazon Web Services account. This operation is only
 * supported for S3 File Gateways.
 */
export const listFileShares = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFileSharesInput,
  output: ListFileSharesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Gets a list of `FileSystemAssociationSummary` objects. Each object contains a
 * summary of a file system association. This operation is only supported for FSx File
 * Gateways.
 */
export const listFileSystemAssociations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListFileSystemAssociationsInput,
    output: ListFileSystemAssociationsOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const listGateways = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListGatewaysInput,
  output: ListGatewaysOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
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
export const listLocalDisks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTapePools = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTapePoolsInput,
  output: ListTapePoolsOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
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
export const listTapes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTapesInput,
  output: ListTapesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
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
export const listVolumeRecoveryPoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListVolumeRecoveryPointsInput,
    output: ListVolumeRecoveryPointsOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
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
export const listVolumes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListVolumesInput,
  output: ListVolumesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
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
export const startCacheReport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAutomaticTapeCreationPolicy =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateBandwidthRateLimitSchedule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateMaintenanceStartTime = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateMaintenanceStartTimeInput,
    output: UpdateMaintenanceStartTimeOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Updates the list of Active Directory users and groups that have special permissions for
 * SMB file shares on the gateway.
 */
export const updateSMBLocalGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSMBLocalGroupsInput,
    output: UpdateSMBLocalGroupsOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Returns a description of the gateway volumes specified in the request. This operation is
 * only supported in the cached volume gateway types.
 *
 * The list of gateway volumes in the request must be from one gateway. In the response,
 * Storage Gateway returns volume information sorted by volume Amazon Resource Name
 * (ARN).
 */
export const describeCachediSCSIVolumes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCachediSCSIVolumesInput,
    output: DescribeCachediSCSIVolumesOutput,
    errors: [InternalServerError, InvalidGatewayRequestException],
  }),
);
/**
 * Gets the file system association information. This operation is only supported for FSx
 * File Gateways.
 */
export const describeFileSystemAssociations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeVTLDevices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeVTLDevicesInput,
  output: DescribeVTLDevicesOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
/**
 * Configures one or more gateway local disks as cache for a gateway. This operation is
 * only supported in the cached volume, tape, and file gateway type (see How Storage Gateway works (architecture).
 *
 * In the request, you specify the gateway Amazon Resource Name (ARN) to which you want to
 * add cache, and one or more disk IDs that you want to configure as cache.
 */
export const addCache = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddCacheInput,
  output: AddCacheOutput,
  errors: [InternalServerError, InvalidGatewayRequestException],
}));
