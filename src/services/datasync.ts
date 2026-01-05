import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "DataSync",
  serviceShapeName: "FmrsService",
});
const auth = T.AwsAuthSigv4({ name: "datasync" });
const ver = T.ServiceVersion("2018-11-09");
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
                        url: "https://datasync-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://datasync-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://datasync.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://datasync.{Region}.{PartitionResult#dnsSuffix}",
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
export const PLSubnetArnList = S.Array(S.String);
export const PLSecurityGroupArnList = S.Array(S.String);
export const AgentArnList = S.Array(S.String);
export const Ec2SecurityGroupArnList = S.Array(S.String);
export const DnsIpList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class CancelTaskExecutionRequest extends S.Class<CancelTaskExecutionRequest>(
  "CancelTaskExecutionRequest",
)(
  { TaskExecutionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelTaskExecutionResponse extends S.Class<CancelTaskExecutionResponse>(
  "CancelTaskExecutionResponse",
)({}) {}
export class TagListEntry extends S.Class<TagListEntry>("TagListEntry")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const InputTagList = S.Array(TagListEntry);
export class CreateLocationFsxLustreRequest extends S.Class<CreateLocationFsxLustreRequest>(
  "CreateLocationFsxLustreRequest",
)(
  {
    FsxFilesystemArn: S.String,
    SecurityGroupArns: Ec2SecurityGroupArnList,
    Subdirectory: S.optional(S.String),
    Tags: S.optional(InputTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NfsMountOptions extends S.Class<NfsMountOptions>(
  "NfsMountOptions",
)({ Version: S.optional(S.String) }) {}
export class FsxProtocolNfs extends S.Class<FsxProtocolNfs>("FsxProtocolNfs")({
  MountOptions: S.optional(NfsMountOptions),
}) {}
export class SmbMountOptions extends S.Class<SmbMountOptions>(
  "SmbMountOptions",
)({ Version: S.optional(S.String) }) {}
export class FsxProtocolSmb extends S.Class<FsxProtocolSmb>("FsxProtocolSmb")({
  Domain: S.optional(S.String),
  MountOptions: S.optional(SmbMountOptions),
  Password: S.String,
  User: S.String,
}) {}
export class FsxProtocol extends S.Class<FsxProtocol>("FsxProtocol")({
  NFS: S.optional(FsxProtocolNfs),
  SMB: S.optional(FsxProtocolSmb),
}) {}
export class CreateLocationFsxOpenZfsRequest extends S.Class<CreateLocationFsxOpenZfsRequest>(
  "CreateLocationFsxOpenZfsRequest",
)(
  {
    FsxFilesystemArn: S.String,
    Protocol: FsxProtocol,
    SecurityGroupArns: Ec2SecurityGroupArnList,
    Subdirectory: S.optional(S.String),
    Tags: S.optional(InputTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLocationFsxWindowsRequest extends S.Class<CreateLocationFsxWindowsRequest>(
  "CreateLocationFsxWindowsRequest",
)(
  {
    Subdirectory: S.optional(S.String),
    FsxFilesystemArn: S.String,
    SecurityGroupArns: Ec2SecurityGroupArnList,
    Tags: S.optional(InputTagList),
    User: S.String,
    Domain: S.optional(S.String),
    Password: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CmkSecretConfig extends S.Class<CmkSecretConfig>(
  "CmkSecretConfig",
)({ SecretArn: S.optional(S.String), KmsKeyArn: S.optional(S.String) }) {}
export class CustomSecretConfig extends S.Class<CustomSecretConfig>(
  "CustomSecretConfig",
)({
  SecretArn: S.optional(S.String),
  SecretAccessRoleArn: S.optional(S.String),
}) {}
export class CreateLocationObjectStorageRequest extends S.Class<CreateLocationObjectStorageRequest>(
  "CreateLocationObjectStorageRequest",
)(
  {
    ServerHostname: S.String,
    ServerPort: S.optional(S.Number),
    ServerProtocol: S.optional(S.String),
    Subdirectory: S.optional(S.String),
    BucketName: S.String,
    AccessKey: S.optional(S.String),
    SecretKey: S.optional(S.String),
    AgentArns: S.optional(AgentArnList),
    Tags: S.optional(InputTagList),
    ServerCertificate: S.optional(T.Blob),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAgentRequest extends S.Class<DeleteAgentRequest>(
  "DeleteAgentRequest",
)(
  { AgentArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAgentResponse extends S.Class<DeleteAgentResponse>(
  "DeleteAgentResponse",
)({}) {}
export class DeleteLocationRequest extends S.Class<DeleteLocationRequest>(
  "DeleteLocationRequest",
)(
  { LocationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteLocationResponse extends S.Class<DeleteLocationResponse>(
  "DeleteLocationResponse",
)({}) {}
export class DeleteTaskRequest extends S.Class<DeleteTaskRequest>(
  "DeleteTaskRequest",
)(
  { TaskArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTaskResponse extends S.Class<DeleteTaskResponse>(
  "DeleteTaskResponse",
)({}) {}
export class DescribeAgentRequest extends S.Class<DescribeAgentRequest>(
  "DescribeAgentRequest",
)(
  { AgentArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationAzureBlobRequest extends S.Class<DescribeLocationAzureBlobRequest>(
  "DescribeLocationAzureBlobRequest",
)(
  { LocationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationEfsRequest extends S.Class<DescribeLocationEfsRequest>(
  "DescribeLocationEfsRequest",
)(
  { LocationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationFsxLustreRequest extends S.Class<DescribeLocationFsxLustreRequest>(
  "DescribeLocationFsxLustreRequest",
)(
  { LocationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationFsxOntapRequest extends S.Class<DescribeLocationFsxOntapRequest>(
  "DescribeLocationFsxOntapRequest",
)(
  { LocationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationFsxOpenZfsRequest extends S.Class<DescribeLocationFsxOpenZfsRequest>(
  "DescribeLocationFsxOpenZfsRequest",
)(
  { LocationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationFsxWindowsRequest extends S.Class<DescribeLocationFsxWindowsRequest>(
  "DescribeLocationFsxWindowsRequest",
)(
  { LocationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationHdfsRequest extends S.Class<DescribeLocationHdfsRequest>(
  "DescribeLocationHdfsRequest",
)(
  { LocationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationNfsRequest extends S.Class<DescribeLocationNfsRequest>(
  "DescribeLocationNfsRequest",
)(
  { LocationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationObjectStorageRequest extends S.Class<DescribeLocationObjectStorageRequest>(
  "DescribeLocationObjectStorageRequest",
)(
  { LocationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationS3Request extends S.Class<DescribeLocationS3Request>(
  "DescribeLocationS3Request",
)(
  { LocationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationSmbRequest extends S.Class<DescribeLocationSmbRequest>(
  "DescribeLocationSmbRequest",
)(
  { LocationArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTaskRequest extends S.Class<DescribeTaskRequest>(
  "DescribeTaskRequest",
)(
  { TaskArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTaskExecutionRequest extends S.Class<DescribeTaskExecutionRequest>(
  "DescribeTaskExecutionRequest",
)(
  { TaskExecutionArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAgentsRequest extends S.Class<ListAgentsRequest>(
  "ListAgentsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    ResourceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTaskExecutionsRequest extends S.Class<ListTaskExecutionsRequest>(
  "ListTaskExecutionsRequest",
)(
  {
    TaskArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Options extends S.Class<Options>("Options")({
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
}) {}
export class FilterRule extends S.Class<FilterRule>("FilterRule")({
  FilterType: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const FilterList = S.Array(FilterRule);
export class S3ManifestConfig extends S.Class<S3ManifestConfig>(
  "S3ManifestConfig",
)({
  ManifestObjectPath: S.String,
  BucketAccessRoleArn: S.String,
  S3BucketArn: S.String,
  ManifestObjectVersionId: S.optional(S.String),
}) {}
export class SourceManifestConfig extends S.Class<SourceManifestConfig>(
  "SourceManifestConfig",
)({ S3: S3ManifestConfig }) {}
export class ManifestConfig extends S.Class<ManifestConfig>("ManifestConfig")({
  Action: S.optional(S.String),
  Format: S.optional(S.String),
  Source: S.optional(SourceManifestConfig),
}) {}
export class ReportDestinationS3 extends S.Class<ReportDestinationS3>(
  "ReportDestinationS3",
)({
  Subdirectory: S.optional(S.String),
  S3BucketArn: S.String,
  BucketAccessRoleArn: S.String,
}) {}
export class ReportDestination extends S.Class<ReportDestination>(
  "ReportDestination",
)({ S3: S.optional(ReportDestinationS3) }) {}
export class ReportOverride extends S.Class<ReportOverride>("ReportOverride")({
  ReportLevel: S.optional(S.String),
}) {}
export class ReportOverrides extends S.Class<ReportOverrides>(
  "ReportOverrides",
)({
  Transferred: S.optional(ReportOverride),
  Verified: S.optional(ReportOverride),
  Deleted: S.optional(ReportOverride),
  Skipped: S.optional(ReportOverride),
}) {}
export class TaskReportConfig extends S.Class<TaskReportConfig>(
  "TaskReportConfig",
)({
  Destination: S.optional(ReportDestination),
  OutputType: S.optional(S.String),
  ReportLevel: S.optional(S.String),
  ObjectVersionIds: S.optional(S.String),
  Overrides: S.optional(ReportOverrides),
}) {}
export class StartTaskExecutionRequest extends S.Class<StartTaskExecutionRequest>(
  "StartTaskExecutionRequest",
)(
  {
    TaskArn: S.String,
    OverrideOptions: S.optional(Options),
    Includes: S.optional(FilterList),
    Excludes: S.optional(FilterList),
    ManifestConfig: S.optional(ManifestConfig),
    TaskReportConfig: S.optional(TaskReportConfig),
    Tags: S.optional(InputTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: InputTagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, Keys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateAgentRequest extends S.Class<UpdateAgentRequest>(
  "UpdateAgentRequest",
)(
  { AgentArn: S.String, Name: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAgentResponse extends S.Class<UpdateAgentResponse>(
  "UpdateAgentResponse",
)({}) {}
export class AzureBlobSasConfiguration extends S.Class<AzureBlobSasConfiguration>(
  "AzureBlobSasConfiguration",
)({ Token: S.String }) {}
export class UpdateLocationAzureBlobRequest extends S.Class<UpdateLocationAzureBlobRequest>(
  "UpdateLocationAzureBlobRequest",
)(
  {
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    AuthenticationType: S.optional(S.String),
    SasConfiguration: S.optional(AzureBlobSasConfiguration),
    BlobType: S.optional(S.String),
    AccessTier: S.optional(S.String),
    AgentArns: S.optional(AgentArnList),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLocationAzureBlobResponse extends S.Class<UpdateLocationAzureBlobResponse>(
  "UpdateLocationAzureBlobResponse",
)({}) {}
export class UpdateLocationEfsRequest extends S.Class<UpdateLocationEfsRequest>(
  "UpdateLocationEfsRequest",
)(
  {
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    AccessPointArn: S.optional(S.String),
    FileSystemAccessRoleArn: S.optional(S.String),
    InTransitEncryption: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLocationEfsResponse extends S.Class<UpdateLocationEfsResponse>(
  "UpdateLocationEfsResponse",
)({}) {}
export class UpdateLocationFsxLustreRequest extends S.Class<UpdateLocationFsxLustreRequest>(
  "UpdateLocationFsxLustreRequest",
)(
  { LocationArn: S.String, Subdirectory: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLocationFsxLustreResponse extends S.Class<UpdateLocationFsxLustreResponse>(
  "UpdateLocationFsxLustreResponse",
)({}) {}
export class UpdateLocationFsxOpenZfsRequest extends S.Class<UpdateLocationFsxOpenZfsRequest>(
  "UpdateLocationFsxOpenZfsRequest",
)(
  {
    LocationArn: S.String,
    Protocol: S.optional(FsxProtocol),
    Subdirectory: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLocationFsxOpenZfsResponse extends S.Class<UpdateLocationFsxOpenZfsResponse>(
  "UpdateLocationFsxOpenZfsResponse",
)({}) {}
export class UpdateLocationFsxWindowsRequest extends S.Class<UpdateLocationFsxWindowsRequest>(
  "UpdateLocationFsxWindowsRequest",
)(
  {
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    Domain: S.optional(S.String),
    User: S.optional(S.String),
    Password: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLocationFsxWindowsResponse extends S.Class<UpdateLocationFsxWindowsResponse>(
  "UpdateLocationFsxWindowsResponse",
)({}) {}
export class HdfsNameNode extends S.Class<HdfsNameNode>("HdfsNameNode")({
  Hostname: S.String,
  Port: S.Number,
}) {}
export const HdfsNameNodeList = S.Array(HdfsNameNode);
export class QopConfiguration extends S.Class<QopConfiguration>(
  "QopConfiguration",
)({
  RpcProtection: S.optional(S.String),
  DataTransferProtection: S.optional(S.String),
}) {}
export class UpdateLocationHdfsRequest extends S.Class<UpdateLocationHdfsRequest>(
  "UpdateLocationHdfsRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLocationHdfsResponse extends S.Class<UpdateLocationHdfsResponse>(
  "UpdateLocationHdfsResponse",
)({}) {}
export class OnPremConfig extends S.Class<OnPremConfig>("OnPremConfig")({
  AgentArns: AgentArnList,
}) {}
export class UpdateLocationNfsRequest extends S.Class<UpdateLocationNfsRequest>(
  "UpdateLocationNfsRequest",
)(
  {
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    ServerHostname: S.optional(S.String),
    OnPremConfig: S.optional(OnPremConfig),
    MountOptions: S.optional(NfsMountOptions),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLocationNfsResponse extends S.Class<UpdateLocationNfsResponse>(
  "UpdateLocationNfsResponse",
)({}) {}
export class UpdateLocationObjectStorageRequest extends S.Class<UpdateLocationObjectStorageRequest>(
  "UpdateLocationObjectStorageRequest",
)(
  {
    LocationArn: S.String,
    ServerPort: S.optional(S.Number),
    ServerProtocol: S.optional(S.String),
    Subdirectory: S.optional(S.String),
    ServerHostname: S.optional(S.String),
    AccessKey: S.optional(S.String),
    SecretKey: S.optional(S.String),
    AgentArns: S.optional(AgentArnList),
    ServerCertificate: S.optional(T.Blob),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLocationObjectStorageResponse extends S.Class<UpdateLocationObjectStorageResponse>(
  "UpdateLocationObjectStorageResponse",
)({}) {}
export class S3Config extends S.Class<S3Config>("S3Config")({
  BucketAccessRoleArn: S.String,
}) {}
export class UpdateLocationS3Request extends S.Class<UpdateLocationS3Request>(
  "UpdateLocationS3Request",
)(
  {
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    S3StorageClass: S.optional(S.String),
    S3Config: S.optional(S3Config),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLocationS3Response extends S.Class<UpdateLocationS3Response>(
  "UpdateLocationS3Response",
)({}) {}
export class UpdateLocationSmbRequest extends S.Class<UpdateLocationSmbRequest>(
  "UpdateLocationSmbRequest",
)(
  {
    LocationArn: S.String,
    Subdirectory: S.optional(S.String),
    ServerHostname: S.optional(S.String),
    User: S.optional(S.String),
    Domain: S.optional(S.String),
    Password: S.optional(S.String),
    CmkSecretConfig: S.optional(CmkSecretConfig),
    CustomSecretConfig: S.optional(CustomSecretConfig),
    AgentArns: S.optional(AgentArnList),
    MountOptions: S.optional(SmbMountOptions),
    AuthenticationType: S.optional(S.String),
    DnsIpAddresses: S.optional(DnsIpList),
    KerberosPrincipal: S.optional(S.String),
    KerberosKeytab: S.optional(T.Blob),
    KerberosKrb5Conf: S.optional(T.Blob),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLocationSmbResponse extends S.Class<UpdateLocationSmbResponse>(
  "UpdateLocationSmbResponse",
)({}) {}
export class TaskSchedule extends S.Class<TaskSchedule>("TaskSchedule")({
  ScheduleExpression: S.String,
  Status: S.optional(S.String),
}) {}
export class UpdateTaskRequest extends S.Class<UpdateTaskRequest>(
  "UpdateTaskRequest",
)(
  {
    TaskArn: S.String,
    Options: S.optional(Options),
    Excludes: S.optional(FilterList),
    Schedule: S.optional(TaskSchedule),
    Name: S.optional(S.String),
    CloudWatchLogGroupArn: S.optional(S.String),
    Includes: S.optional(FilterList),
    ManifestConfig: S.optional(ManifestConfig),
    TaskReportConfig: S.optional(TaskReportConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTaskResponse extends S.Class<UpdateTaskResponse>(
  "UpdateTaskResponse",
)({}) {}
export class UpdateTaskExecutionRequest extends S.Class<UpdateTaskExecutionRequest>(
  "UpdateTaskExecutionRequest",
)(
  { TaskExecutionArn: S.String, Options: Options },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTaskExecutionResponse extends S.Class<UpdateTaskExecutionResponse>(
  "UpdateTaskExecutionResponse",
)({}) {}
export const FilterValues = S.Array(S.String);
export class Ec2Config extends S.Class<Ec2Config>("Ec2Config")({
  SubnetArn: S.String,
  SecurityGroupArns: Ec2SecurityGroupArnList,
}) {}
export const SourceNetworkInterfaceArns = S.Array(S.String);
export const DestinationNetworkInterfaceArns = S.Array(S.String);
export class LocationFilter extends S.Class<LocationFilter>("LocationFilter")({
  Name: S.String,
  Values: FilterValues,
  Operator: S.String,
}) {}
export const LocationFilters = S.Array(LocationFilter);
export const OutputTagList = S.Array(TagListEntry);
export class TaskFilter extends S.Class<TaskFilter>("TaskFilter")({
  Name: S.String,
  Values: FilterValues,
  Operator: S.String,
}) {}
export const TaskFilters = S.Array(TaskFilter);
export class CreateAgentRequest extends S.Class<CreateAgentRequest>(
  "CreateAgentRequest",
)(
  {
    ActivationKey: S.String,
    AgentName: S.optional(S.String),
    Tags: S.optional(InputTagList),
    VpcEndpointId: S.optional(S.String),
    SubnetArns: S.optional(PLSubnetArnList),
    SecurityGroupArns: S.optional(PLSecurityGroupArnList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLocationAzureBlobRequest extends S.Class<CreateLocationAzureBlobRequest>(
  "CreateLocationAzureBlobRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLocationEfsRequest extends S.Class<CreateLocationEfsRequest>(
  "CreateLocationEfsRequest",
)(
  {
    Subdirectory: S.optional(S.String),
    EfsFilesystemArn: S.String,
    Ec2Config: Ec2Config,
    Tags: S.optional(InputTagList),
    AccessPointArn: S.optional(S.String),
    FileSystemAccessRoleArn: S.optional(S.String),
    InTransitEncryption: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLocationFsxLustreResponse extends S.Class<CreateLocationFsxLustreResponse>(
  "CreateLocationFsxLustreResponse",
)({ LocationArn: S.optional(S.String) }) {}
export class CreateLocationFsxOpenZfsResponse extends S.Class<CreateLocationFsxOpenZfsResponse>(
  "CreateLocationFsxOpenZfsResponse",
)({ LocationArn: S.optional(S.String) }) {}
export class CreateLocationFsxWindowsResponse extends S.Class<CreateLocationFsxWindowsResponse>(
  "CreateLocationFsxWindowsResponse",
)({ LocationArn: S.optional(S.String) }) {}
export class CreateLocationHdfsRequest extends S.Class<CreateLocationHdfsRequest>(
  "CreateLocationHdfsRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLocationNfsRequest extends S.Class<CreateLocationNfsRequest>(
  "CreateLocationNfsRequest",
)(
  {
    Subdirectory: S.String,
    ServerHostname: S.String,
    OnPremConfig: OnPremConfig,
    MountOptions: S.optional(NfsMountOptions),
    Tags: S.optional(InputTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLocationObjectStorageResponse extends S.Class<CreateLocationObjectStorageResponse>(
  "CreateLocationObjectStorageResponse",
)({ LocationArn: S.optional(S.String) }) {}
export class CreateLocationS3Request extends S.Class<CreateLocationS3Request>(
  "CreateLocationS3Request",
)(
  {
    Subdirectory: S.optional(S.String),
    S3BucketArn: S.String,
    S3StorageClass: S.optional(S.String),
    S3Config: S3Config,
    AgentArns: S.optional(AgentArnList),
    Tags: S.optional(InputTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLocationSmbRequest extends S.Class<CreateLocationSmbRequest>(
  "CreateLocationSmbRequest",
)(
  {
    Subdirectory: S.String,
    ServerHostname: S.String,
    User: S.optional(S.String),
    Domain: S.optional(S.String),
    Password: S.optional(S.String),
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeLocationEfsResponse extends S.Class<DescribeLocationEfsResponse>(
  "DescribeLocationEfsResponse",
)({
  LocationArn: S.optional(S.String),
  LocationUri: S.optional(S.String),
  Ec2Config: S.optional(Ec2Config),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  AccessPointArn: S.optional(S.String),
  FileSystemAccessRoleArn: S.optional(S.String),
  InTransitEncryption: S.optional(S.String),
}) {}
export class DescribeLocationFsxLustreResponse extends S.Class<DescribeLocationFsxLustreResponse>(
  "DescribeLocationFsxLustreResponse",
)({
  LocationArn: S.optional(S.String),
  LocationUri: S.optional(S.String),
  SecurityGroupArns: S.optional(Ec2SecurityGroupArnList),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeLocationFsxOntapResponse extends S.Class<DescribeLocationFsxOntapResponse>(
  "DescribeLocationFsxOntapResponse",
)({
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LocationArn: S.optional(S.String),
  LocationUri: S.optional(S.String),
  Protocol: S.optional(FsxProtocol),
  SecurityGroupArns: S.optional(Ec2SecurityGroupArnList),
  StorageVirtualMachineArn: S.optional(S.String),
  FsxFilesystemArn: S.optional(S.String),
}) {}
export class DescribeLocationFsxOpenZfsResponse extends S.Class<DescribeLocationFsxOpenZfsResponse>(
  "DescribeLocationFsxOpenZfsResponse",
)({
  LocationArn: S.optional(S.String),
  LocationUri: S.optional(S.String),
  SecurityGroupArns: S.optional(Ec2SecurityGroupArnList),
  Protocol: S.optional(FsxProtocol),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeLocationFsxWindowsResponse extends S.Class<DescribeLocationFsxWindowsResponse>(
  "DescribeLocationFsxWindowsResponse",
)({
  LocationArn: S.optional(S.String),
  LocationUri: S.optional(S.String),
  SecurityGroupArns: S.optional(Ec2SecurityGroupArnList),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  User: S.optional(S.String),
  Domain: S.optional(S.String),
}) {}
export class DescribeLocationHdfsResponse extends S.Class<DescribeLocationHdfsResponse>(
  "DescribeLocationHdfsResponse",
)({
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
}) {}
export class DescribeLocationNfsResponse extends S.Class<DescribeLocationNfsResponse>(
  "DescribeLocationNfsResponse",
)({
  LocationArn: S.optional(S.String),
  LocationUri: S.optional(S.String),
  OnPremConfig: S.optional(OnPremConfig),
  MountOptions: S.optional(NfsMountOptions),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ManagedSecretConfig extends S.Class<ManagedSecretConfig>(
  "ManagedSecretConfig",
)({ SecretArn: S.optional(S.String) }) {}
export class DescribeLocationObjectStorageResponse extends S.Class<DescribeLocationObjectStorageResponse>(
  "DescribeLocationObjectStorageResponse",
)({
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
}) {}
export class DescribeLocationS3Response extends S.Class<DescribeLocationS3Response>(
  "DescribeLocationS3Response",
)({
  LocationArn: S.optional(S.String),
  LocationUri: S.optional(S.String),
  S3StorageClass: S.optional(S.String),
  S3Config: S.optional(S3Config),
  AgentArns: S.optional(AgentArnList),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeLocationSmbResponse extends S.Class<DescribeLocationSmbResponse>(
  "DescribeLocationSmbResponse",
)({
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
}) {}
export class ListLocationsRequest extends S.Class<ListLocationsRequest>(
  "ListLocationsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(LocationFilters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(OutputTagList), NextToken: S.optional(S.String) }) {}
export class ListTasksRequest extends S.Class<ListTasksRequest>(
  "ListTasksRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Filters: S.optional(TaskFilters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartTaskExecutionResponse extends S.Class<StartTaskExecutionResponse>(
  "StartTaskExecutionResponse",
)({ TaskExecutionArn: S.optional(S.String) }) {}
export class FsxUpdateProtocolSmb extends S.Class<FsxUpdateProtocolSmb>(
  "FsxUpdateProtocolSmb",
)({
  Domain: S.optional(S.String),
  MountOptions: S.optional(SmbMountOptions),
  Password: S.optional(S.String),
  User: S.optional(S.String),
}) {}
export class PrivateLinkConfig extends S.Class<PrivateLinkConfig>(
  "PrivateLinkConfig",
)({
  VpcEndpointId: S.optional(S.String),
  PrivateLinkEndpoint: S.optional(S.String),
  SubnetArns: S.optional(PLSubnetArnList),
  SecurityGroupArns: S.optional(PLSecurityGroupArnList),
}) {}
export class Platform extends S.Class<Platform>("Platform")({
  Version: S.optional(S.String),
}) {}
export class TaskScheduleDetails extends S.Class<TaskScheduleDetails>(
  "TaskScheduleDetails",
)({
  StatusUpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DisabledReason: S.optional(S.String),
  DisabledBy: S.optional(S.String),
}) {}
export class TaskExecutionResultDetail extends S.Class<TaskExecutionResultDetail>(
  "TaskExecutionResultDetail",
)({
  PrepareDuration: S.optional(S.Number),
  PrepareStatus: S.optional(S.String),
  TotalDuration: S.optional(S.Number),
  TransferDuration: S.optional(S.Number),
  TransferStatus: S.optional(S.String),
  VerifyDuration: S.optional(S.Number),
  VerifyStatus: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorDetail: S.optional(S.String),
}) {}
export class ReportResult extends S.Class<ReportResult>("ReportResult")({
  Status: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorDetail: S.optional(S.String),
}) {}
export class TaskExecutionFilesListedDetail extends S.Class<TaskExecutionFilesListedDetail>(
  "TaskExecutionFilesListedDetail",
)({
  AtSource: S.optional(S.Number),
  AtDestinationForDelete: S.optional(S.Number),
}) {}
export class TaskExecutionFilesFailedDetail extends S.Class<TaskExecutionFilesFailedDetail>(
  "TaskExecutionFilesFailedDetail",
)({
  Prepare: S.optional(S.Number),
  Transfer: S.optional(S.Number),
  Verify: S.optional(S.Number),
  Delete: S.optional(S.Number),
}) {}
export class TaskExecutionFoldersListedDetail extends S.Class<TaskExecutionFoldersListedDetail>(
  "TaskExecutionFoldersListedDetail",
)({
  AtSource: S.optional(S.Number),
  AtDestinationForDelete: S.optional(S.Number),
}) {}
export class TaskExecutionFoldersFailedDetail extends S.Class<TaskExecutionFoldersFailedDetail>(
  "TaskExecutionFoldersFailedDetail",
)({
  List: S.optional(S.Number),
  Prepare: S.optional(S.Number),
  Transfer: S.optional(S.Number),
  Verify: S.optional(S.Number),
  Delete: S.optional(S.Number),
}) {}
export class AgentListEntry extends S.Class<AgentListEntry>("AgentListEntry")({
  AgentArn: S.optional(S.String),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  Platform: S.optional(Platform),
}) {}
export const AgentList = S.Array(AgentListEntry);
export class TaskExecutionListEntry extends S.Class<TaskExecutionListEntry>(
  "TaskExecutionListEntry",
)({
  TaskExecutionArn: S.optional(S.String),
  Status: S.optional(S.String),
  TaskMode: S.optional(S.String),
}) {}
export const TaskExecutionList = S.Array(TaskExecutionListEntry);
export class FsxUpdateProtocol extends S.Class<FsxUpdateProtocol>(
  "FsxUpdateProtocol",
)({ NFS: S.optional(FsxProtocolNfs), SMB: S.optional(FsxUpdateProtocolSmb) }) {}
export class CreateAgentResponse extends S.Class<CreateAgentResponse>(
  "CreateAgentResponse",
)({ AgentArn: S.optional(S.String) }) {}
export class CreateLocationAzureBlobResponse extends S.Class<CreateLocationAzureBlobResponse>(
  "CreateLocationAzureBlobResponse",
)({ LocationArn: S.optional(S.String) }) {}
export class CreateLocationEfsResponse extends S.Class<CreateLocationEfsResponse>(
  "CreateLocationEfsResponse",
)({ LocationArn: S.optional(S.String) }) {}
export class CreateLocationFsxOntapRequest extends S.Class<CreateLocationFsxOntapRequest>(
  "CreateLocationFsxOntapRequest",
)(
  {
    Protocol: FsxProtocol,
    SecurityGroupArns: Ec2SecurityGroupArnList,
    StorageVirtualMachineArn: S.String,
    Subdirectory: S.optional(S.String),
    Tags: S.optional(InputTagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateLocationHdfsResponse extends S.Class<CreateLocationHdfsResponse>(
  "CreateLocationHdfsResponse",
)({ LocationArn: S.optional(S.String) }) {}
export class CreateLocationNfsResponse extends S.Class<CreateLocationNfsResponse>(
  "CreateLocationNfsResponse",
)({ LocationArn: S.optional(S.String) }) {}
export class CreateLocationS3Response extends S.Class<CreateLocationS3Response>(
  "CreateLocationS3Response",
)({ LocationArn: S.optional(S.String) }) {}
export class CreateLocationSmbResponse extends S.Class<CreateLocationSmbResponse>(
  "CreateLocationSmbResponse",
)({ LocationArn: S.optional(S.String) }) {}
export class DescribeAgentResponse extends S.Class<DescribeAgentResponse>(
  "DescribeAgentResponse",
)({
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
}) {}
export class DescribeLocationAzureBlobResponse extends S.Class<DescribeLocationAzureBlobResponse>(
  "DescribeLocationAzureBlobResponse",
)({
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
}) {}
export class DescribeTaskResponse extends S.Class<DescribeTaskResponse>(
  "DescribeTaskResponse",
)({
  TaskArn: S.optional(S.String),
  Status: S.optional(S.String),
  Name: S.optional(S.String),
  CurrentTaskExecutionArn: S.optional(S.String),
  SourceLocationArn: S.optional(S.String),
  DestinationLocationArn: S.optional(S.String),
  CloudWatchLogGroupArn: S.optional(S.String),
  SourceNetworkInterfaceArns: S.optional(SourceNetworkInterfaceArns),
  DestinationNetworkInterfaceArns: S.optional(DestinationNetworkInterfaceArns),
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
}) {}
export class DescribeTaskExecutionResponse extends S.Class<DescribeTaskExecutionResponse>(
  "DescribeTaskExecutionResponse",
)({
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
}) {}
export class ListAgentsResponse extends S.Class<ListAgentsResponse>(
  "ListAgentsResponse",
)({ Agents: S.optional(AgentList), NextToken: S.optional(S.String) }) {}
export class ListTaskExecutionsResponse extends S.Class<ListTaskExecutionsResponse>(
  "ListTaskExecutionsResponse",
)({
  TaskExecutions: S.optional(TaskExecutionList),
  NextToken: S.optional(S.String),
}) {}
export class UpdateLocationFsxOntapRequest extends S.Class<UpdateLocationFsxOntapRequest>(
  "UpdateLocationFsxOntapRequest",
)(
  {
    LocationArn: S.String,
    Protocol: S.optional(FsxUpdateProtocol),
    Subdirectory: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateLocationFsxOntapResponse extends S.Class<UpdateLocationFsxOntapResponse>(
  "UpdateLocationFsxOntapResponse",
)({}) {}
export class LocationListEntry extends S.Class<LocationListEntry>(
  "LocationListEntry",
)({ LocationArn: S.optional(S.String), LocationUri: S.optional(S.String) }) {}
export const LocationList = S.Array(LocationListEntry);
export class TaskListEntry extends S.Class<TaskListEntry>("TaskListEntry")({
  TaskArn: S.optional(S.String),
  Status: S.optional(S.String),
  Name: S.optional(S.String),
  TaskMode: S.optional(S.String),
}) {}
export const TaskList = S.Array(TaskListEntry);
export class CreateLocationFsxOntapResponse extends S.Class<CreateLocationFsxOntapResponse>(
  "CreateLocationFsxOntapResponse",
)({ LocationArn: S.optional(S.String) }) {}
export class CreateTaskRequest extends S.Class<CreateTaskRequest>(
  "CreateTaskRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListLocationsResponse extends S.Class<ListLocationsResponse>(
  "ListLocationsResponse",
)({ Locations: S.optional(LocationList), NextToken: S.optional(S.String) }) {}
export class ListTasksResponse extends S.Class<ListTasksResponse>(
  "ListTasksResponse",
)({ Tasks: S.optional(TaskList), NextToken: S.optional(S.String) }) {}
export class CreateTaskResponse extends S.Class<CreateTaskResponse>(
  "CreateTaskResponse",
)({ TaskArn: S.optional(S.String) }) {}

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
export const cancelTaskExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createLocationAzureBlob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLocationAzureBlobRequest,
    output: CreateLocationAzureBlobResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Creates a transfer *location* for an Amazon EFS file system.
 * DataSync can use this location as a source or destination for transferring
 * data.
 *
 * Before you begin, make sure that you understand how DataSync
 * accesses
 * Amazon EFS file systems.
 */
export const createLocationEfs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createLocationHdfs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createLocationNfs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createLocationS3 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createLocationSmb = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLocationSmbRequest,
  output: CreateLocationSmbResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Returns information about an DataSync agent, such as its name, service
 * endpoint type, and status.
 */
export const describeAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAgentRequest,
  output: DescribeAgentResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for Microsoft Azure
 * Blob Storage is configured.
 */
export const describeLocationAzureBlob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLocationAzureBlobRequest,
    output: DescribeLocationAzureBlobResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Provides information about a *task*, which defines where and how
 * DataSync transfers your data.
 */
export const describeTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeTaskExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTaskExecutionRequest,
    output: DescribeTaskExecutionResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
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
export const listAgents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listTaskExecutions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTaskExecutionsRequest,
    output: ListTaskExecutionsResponse,
    errors: [InternalException, InvalidRequestException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TaskExecutions",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Modifies the following configuration parameters of the Amazon FSx for NetApp ONTAP
 * transfer location that you're using with DataSync.
 *
 * For more information, see Configuring DataSync
 * transfers with FSx for ONTAP.
 */
export const updateLocationFsxOntap = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLocationFsxOntapRequest,
    output: UpdateLocationFsxOntapResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Creates a transfer *location* for an Amazon FSx for Lustre file
 * system. DataSync can use this location as a source or destination for
 * transferring data.
 *
 * Before you begin, make sure that you understand how DataSync
 * accesses FSx for Lustre file systems.
 */
export const createLocationFsxLustre = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLocationFsxLustreRequest,
    output: CreateLocationFsxLustreResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
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
export const createLocationFsxOpenZfs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLocationFsxOpenZfsRequest,
    output: CreateLocationFsxOpenZfsResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Creates a transfer *location* for an Amazon FSx for Windows File Server file
 * system. DataSync can use this location as a source or destination for
 * transferring data.
 *
 * Before you begin, make sure that you understand how DataSync
 * accesses
 * FSx for Windows File Server file systems.
 */
export const createLocationFsxWindows = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLocationFsxWindowsRequest,
    output: CreateLocationFsxWindowsResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Creates a transfer *location* for an object storage system. DataSync can use this location as a source or destination for transferring data. You
 * can make transfers with or without a DataSync
 * agent.
 *
 * Before you begin, make sure that you understand the prerequisites for DataSync to work with object storage systems.
 */
export const createLocationObjectStorage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLocationObjectStorageRequest,
    output: CreateLocationObjectStorageResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Provides details about how an DataSync transfer location for an Amazon EFS file system is configured.
 */
export const describeLocationEfs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationEfsRequest,
  output: DescribeLocationEfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for an Amazon FSx for Lustre file system is configured.
 */
export const describeLocationFsxLustre = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLocationFsxLustreRequest,
    output: DescribeLocationFsxLustreResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Provides details about how an DataSync transfer location for an Amazon FSx for NetApp ONTAP file system is configured.
 *
 * If your location uses SMB, the `DescribeLocationFsxOntap` operation doesn't
 * actually return a `Password`.
 */
export const describeLocationFsxOntap = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLocationFsxOntapRequest,
    output: DescribeLocationFsxOntapResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Provides details about how an DataSync transfer location for an Amazon FSx for OpenZFS file system is configured.
 *
 * Response elements related to `SMB` aren't supported with the
 * `DescribeLocationFsxOpenZfs` operation.
 */
export const describeLocationFsxOpenZfs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLocationFsxOpenZfsRequest,
    output: DescribeLocationFsxOpenZfsResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Provides details about how an DataSync transfer location for an Amazon FSx for Windows File Server file system is configured.
 */
export const describeLocationFsxWindows = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLocationFsxWindowsRequest,
    output: DescribeLocationFsxWindowsResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Provides details about how an DataSync transfer location for a Hadoop
 * Distributed File System (HDFS) is configured.
 */
export const describeLocationHdfs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeLocationHdfsRequest,
    output: DescribeLocationHdfsResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Provides details about how an DataSync transfer location for a Network
 * File System (NFS) file server is configured.
 */
export const describeLocationNfs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationNfsRequest,
  output: DescribeLocationNfsResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for an object
 * storage system is configured.
 */
export const describeLocationObjectStorage =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeLocationObjectStorageRequest,
    output: DescribeLocationObjectStorageResponse,
    errors: [InternalException, InvalidRequestException],
  }));
/**
 * Provides details about how an DataSync transfer location for an S3 bucket
 * is configured.
 */
export const describeLocationS3 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationS3Request,
  output: DescribeLocationS3Response,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Provides details about how an DataSync transfer location for a Server
 * Message Block (SMB) file server is configured.
 */
export const describeLocationSmb = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeLocationSmbRequest,
  output: DescribeLocationSmbResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Returns all the tags associated with an Amazon Web Services resource.
 */
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const startTaskExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAgentRequest,
  output: DeleteAgentResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Deletes a transfer location resource from DataSync.
 */
export const deleteLocation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLocationRequest,
  output: DeleteLocationResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Deletes a transfer task resource from DataSync.
 */
export const deleteTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Removes tags from an Amazon Web Services resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Updates the name of an DataSync agent.
 */
export const updateAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLocationAzureBlob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLocationAzureBlobRequest,
    output: UpdateLocationAzureBlobResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Modifies the following configuration parameters of the Amazon EFS transfer
 * location that you're using with DataSync.
 *
 * For more information, see Configuring DataSync
 * transfers with Amazon EFS.
 */
export const updateLocationEfs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLocationFsxLustre = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLocationFsxLustreRequest,
    output: UpdateLocationFsxLustreResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
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
export const updateLocationFsxOpenZfs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLocationFsxOpenZfsRequest,
    output: UpdateLocationFsxOpenZfsResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Modifies the following configuration parameters of the Amazon FSx for Windows File Server
 * transfer location that you're using with DataSync.
 *
 * For more information, see Configuring DataSync
 * transfers with FSx for Windows File Server.
 */
export const updateLocationFsxWindows = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLocationFsxWindowsRequest,
    output: UpdateLocationFsxWindowsResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Modifies the following configuration parameters of the Hadoop Distributed File System
 * (HDFS) transfer location that you're using with DataSync.
 *
 * For more information, see Configuring DataSync
 * transfers with an HDFS cluster.
 */
export const updateLocationHdfs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLocationNfs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLocationObjectStorage = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateLocationObjectStorageRequest,
    output: UpdateLocationObjectStorageResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
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
export const updateLocationS3 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateLocationSmb = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateLocationSmbRequest,
  output: UpdateLocationSmbResponse,
  errors: [InternalException, InvalidRequestException],
}));
/**
 * Updates the configuration of a *task*, which defines where and how
 * DataSync transfers your data.
 */
export const updateTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTaskExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createLocationFsxOntap = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateLocationFsxOntapRequest,
    output: CreateLocationFsxOntapResponse,
    errors: [InternalException, InvalidRequestException],
  }),
);
/**
 * Returns a list of source and destination locations.
 *
 * If you have more locations than are returned in a response (that is, the response
 * returns only a truncated list of your agents), the response contains a token that you can
 * specify in your next request to fetch the next page of locations.
 */
export const listLocations = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListLocationsRequest,
    output: ListLocationsResponse,
    errors: [InternalException, InvalidRequestException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Locations",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns a list of the DataSync tasks you created.
 */
export const listTasks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTaskRequest,
  output: CreateTaskResponse,
  errors: [InternalException, InvalidRequestException],
}));
