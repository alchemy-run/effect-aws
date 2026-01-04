import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Transfer",
  serviceShapeName: "TransferService",
});
const auth = T.AwsAuthSigv4({ name: "transfer" });
const ver = T.ServiceVersion("2018-11-05");
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
                        url: "https://transfer-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://transfer-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://transfer.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://transfer.{Region}.{PartitionResult#dnsSuffix}",
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
export const FilePaths = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class DeleteAccessRequest extends S.Class<DeleteAccessRequest>(
  "DeleteAccessRequest",
)(
  { ServerId: S.String, ExternalId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAccessResponse extends S.Class<DeleteAccessResponse>(
  "DeleteAccessResponse",
)({}) {}
export class DeleteHostKeyRequest extends S.Class<DeleteHostKeyRequest>(
  "DeleteHostKeyRequest",
)(
  { ServerId: S.String, HostKeyId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteHostKeyResponse extends S.Class<DeleteHostKeyResponse>(
  "DeleteHostKeyResponse",
)({}) {}
export class DeleteSshPublicKeyRequest extends S.Class<DeleteSshPublicKeyRequest>(
  "DeleteSshPublicKeyRequest",
)(
  { ServerId: S.String, SshPublicKeyId: S.String, UserName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSshPublicKeyResponse extends S.Class<DeleteSshPublicKeyResponse>(
  "DeleteSshPublicKeyResponse",
)({}) {}
export class DescribeAccessRequest extends S.Class<DescribeAccessRequest>(
  "DescribeAccessRequest",
)(
  { ServerId: S.String, ExternalId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExecutionRequest extends S.Class<DescribeExecutionRequest>(
  "DescribeExecutionRequest",
)(
  { ExecutionId: S.String, WorkflowId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeHostKeyRequest extends S.Class<DescribeHostKeyRequest>(
  "DescribeHostKeyRequest",
)(
  { ServerId: S.String, HostKeyId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSecurityPolicyRequest extends S.Class<DescribeSecurityPolicyRequest>(
  "DescribeSecurityPolicyRequest",
)(
  { SecurityPolicyName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportSshPublicKeyRequest extends S.Class<ImportSshPublicKeyRequest>(
  "ImportSshPublicKeyRequest",
)(
  { ServerId: S.String, SshPublicKeyBody: S.String, UserName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAccessesRequest extends S.Class<ListAccessesRequest>(
  "ListAccessesRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ServerId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListExecutionsRequest extends S.Class<ListExecutionsRequest>(
  "ListExecutionsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    WorkflowId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListFileTransferResultsRequest extends S.Class<ListFileTransferResultsRequest>(
  "ListFileTransferResultsRequest",
)(
  {
    ConnectorId: S.String,
    TransferId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/listFileTransferResults" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListHostKeysRequest extends S.Class<ListHostKeysRequest>(
  "ListHostKeysRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ServerId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSecurityPoliciesRequest extends S.Class<ListSecurityPoliciesRequest>(
  "ListSecurityPoliciesRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    Arn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendWorkflowStepStateRequest extends S.Class<SendWorkflowStepStateRequest>(
  "SendWorkflowStepStateRequest",
)(
  {
    WorkflowId: S.String,
    ExecutionId: S.String,
    Token: S.String,
    Status: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SendWorkflowStepStateResponse extends S.Class<SendWorkflowStepStateResponse>(
  "SendWorkflowStepStateResponse",
)({}) {}
export class StartDirectoryListingRequest extends S.Class<StartDirectoryListingRequest>(
  "StartDirectoryListingRequest",
)(
  {
    ConnectorId: S.String,
    RemoteDirectoryPath: S.String,
    MaxItems: S.optional(S.Number),
    OutputDirectoryPath: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartFileTransferRequest extends S.Class<StartFileTransferRequest>(
  "StartFileTransferRequest",
)(
  {
    ConnectorId: S.String,
    SendFilePaths: S.optional(FilePaths),
    RetrieveFilePaths: S.optional(FilePaths),
    LocalDirectoryPath: S.optional(S.String),
    RemoteDirectoryPath: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartRemoteDeleteRequest extends S.Class<StartRemoteDeleteRequest>(
  "StartRemoteDeleteRequest",
)(
  { ConnectorId: S.String, DeletePath: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/startRemoteDelete" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartRemoteMoveRequest extends S.Class<StartRemoteMoveRequest>(
  "StartRemoteMoveRequest",
)(
  { ConnectorId: S.String, SourcePath: S.String, TargetPath: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/startRemoteMove" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartServerRequest extends S.Class<StartServerRequest>(
  "StartServerRequest",
)(
  { ServerId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartServerResponse extends S.Class<StartServerResponse>(
  "StartServerResponse",
)({}) {}
export class StopServerRequest extends S.Class<StopServerRequest>(
  "StopServerRequest",
)(
  { ServerId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopServerResponse extends S.Class<StopServerResponse>(
  "StopServerResponse",
)({}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const Tags = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { Arn: S.String, Tags: Tags },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class TestConnectionRequest extends S.Class<TestConnectionRequest>(
  "TestConnectionRequest",
)(
  { ConnectorId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TestIdentityProviderRequest extends S.Class<TestIdentityProviderRequest>(
  "TestIdentityProviderRequest",
)(
  {
    ServerId: S.String,
    ServerProtocol: S.optional(S.String),
    SourceIp: S.optional(S.String),
    UserName: S.String,
    UserPassword: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { Arn: S.String, TagKeys: TagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class HomeDirectoryMapEntry extends S.Class<HomeDirectoryMapEntry>(
  "HomeDirectoryMapEntry",
)({ Entry: S.String, Target: S.String, Type: S.optional(S.String) }) {}
export const HomeDirectoryMappings = S.Array(HomeDirectoryMapEntry);
export const SecondaryGids = S.Array(S.Number);
export class PosixProfile extends S.Class<PosixProfile>("PosixProfile")({
  Uid: S.Number,
  Gid: S.Number,
  SecondaryGids: S.optional(SecondaryGids),
}) {}
export class UpdateAccessRequest extends S.Class<UpdateAccessRequest>(
  "UpdateAccessRequest",
)(
  {
    HomeDirectory: S.optional(S.String),
    HomeDirectoryType: S.optional(S.String),
    HomeDirectoryMappings: S.optional(HomeDirectoryMappings),
    Policy: S.optional(S.String),
    PosixProfile: S.optional(PosixProfile),
    Role: S.optional(S.String),
    ServerId: S.String,
    ExternalId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateHostKeyRequest extends S.Class<UpdateHostKeyRequest>(
  "UpdateHostKeyRequest",
)(
  { ServerId: S.String, HostKeyId: S.String, Description: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const SecurityPolicyNames = S.Array(S.String);
export class CreateAccessRequest extends S.Class<CreateAccessRequest>(
  "CreateAccessRequest",
)(
  {
    HomeDirectory: S.optional(S.String),
    HomeDirectoryType: S.optional(S.String),
    HomeDirectoryMappings: S.optional(HomeDirectoryMappings),
    Policy: S.optional(S.String),
    PosixProfile: S.optional(PosixProfile),
    Role: S.String,
    ServerId: S.String,
    ExternalId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportHostKeyRequest extends S.Class<ImportHostKeyRequest>(
  "ImportHostKeyRequest",
)(
  {
    ServerId: S.String,
    HostKeyBody: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportSshPublicKeyResponse extends S.Class<ImportSshPublicKeyResponse>(
  "ImportSshPublicKeyResponse",
)({ ServerId: S.String, SshPublicKeyId: S.String, UserName: S.String }) {}
export class ListSecurityPoliciesResponse extends S.Class<ListSecurityPoliciesResponse>(
  "ListSecurityPoliciesResponse",
)({
  NextToken: S.optional(S.String),
  SecurityPolicyNames: SecurityPolicyNames,
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({
  Arn: S.optional(S.String),
  NextToken: S.optional(S.String),
  Tags: S.optional(Tags),
}) {}
export class StartDirectoryListingResponse extends S.Class<StartDirectoryListingResponse>(
  "StartDirectoryListingResponse",
)({ ListingId: S.String, OutputFileName: S.String }) {}
export class StartFileTransferResponse extends S.Class<StartFileTransferResponse>(
  "StartFileTransferResponse",
)({ TransferId: S.String }) {}
export class StartRemoteDeleteResponse extends S.Class<StartRemoteDeleteResponse>(
  "StartRemoteDeleteResponse",
)({ DeleteId: S.String }) {}
export class StartRemoteMoveResponse extends S.Class<StartRemoteMoveResponse>(
  "StartRemoteMoveResponse",
)({ MoveId: S.String }) {}
export class TestIdentityProviderResponse extends S.Class<TestIdentityProviderResponse>(
  "TestIdentityProviderResponse",
)({
  Response: S.optional(S.String),
  StatusCode: S.Number,
  Message: S.optional(S.String),
  Url: S.String,
}) {}
export class UpdateAccessResponse extends S.Class<UpdateAccessResponse>(
  "UpdateAccessResponse",
)({ ServerId: S.String, ExternalId: S.String }) {}
export class UpdateHostKeyResponse extends S.Class<UpdateHostKeyResponse>(
  "UpdateHostKeyResponse",
)({ ServerId: S.String, HostKeyId: S.String }) {}
export const SecurityPolicyOptions = S.Array(S.String);
export const SecurityPolicyProtocols = S.Array(S.String);
export class DescribedAccess extends S.Class<DescribedAccess>(
  "DescribedAccess",
)({
  HomeDirectory: S.optional(S.String),
  HomeDirectoryMappings: S.optional(HomeDirectoryMappings),
  HomeDirectoryType: S.optional(S.String),
  Policy: S.optional(S.String),
  PosixProfile: S.optional(PosixProfile),
  Role: S.optional(S.String),
  ExternalId: S.optional(S.String),
}) {}
export class DescribedHostKey extends S.Class<DescribedHostKey>(
  "DescribedHostKey",
)({
  Arn: S.String,
  HostKeyId: S.optional(S.String),
  HostKeyFingerprint: S.optional(S.String),
  Description: S.optional(S.String),
  Type: S.optional(S.String),
  DateImported: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Tags: S.optional(Tags),
}) {}
export class DescribedSecurityPolicy extends S.Class<DescribedSecurityPolicy>(
  "DescribedSecurityPolicy",
)({
  Fips: S.optional(S.Boolean),
  SecurityPolicyName: S.String,
  SshCiphers: S.optional(SecurityPolicyOptions),
  SshKexs: S.optional(SecurityPolicyOptions),
  SshMacs: S.optional(SecurityPolicyOptions),
  TlsCiphers: S.optional(SecurityPolicyOptions),
  SshHostKeyAlgorithms: S.optional(SecurityPolicyOptions),
  Type: S.optional(S.String),
  Protocols: S.optional(SecurityPolicyProtocols),
}) {}
export class ListedAccess extends S.Class<ListedAccess>("ListedAccess")({
  HomeDirectory: S.optional(S.String),
  HomeDirectoryType: S.optional(S.String),
  Role: S.optional(S.String),
  ExternalId: S.optional(S.String),
}) {}
export const ListedAccesses = S.Array(ListedAccess);
export class S3FileLocation extends S.Class<S3FileLocation>("S3FileLocation")({
  Bucket: S.optional(S.String),
  Key: S.optional(S.String),
  VersionId: S.optional(S.String),
  Etag: S.optional(S.String),
}) {}
export class EfsFileLocation extends S.Class<EfsFileLocation>(
  "EfsFileLocation",
)({ FileSystemId: S.optional(S.String), Path: S.optional(S.String) }) {}
export class FileLocation extends S.Class<FileLocation>("FileLocation")({
  S3FileLocation: S.optional(S3FileLocation),
  EfsFileLocation: S.optional(EfsFileLocation),
}) {}
export class UserDetails extends S.Class<UserDetails>("UserDetails")({
  UserName: S.String,
  ServerId: S.String,
  SessionId: S.optional(S.String),
}) {}
export class ServiceMetadata extends S.Class<ServiceMetadata>(
  "ServiceMetadata",
)({ UserDetails: UserDetails }) {}
export class ListedExecution extends S.Class<ListedExecution>(
  "ListedExecution",
)({
  ExecutionId: S.optional(S.String),
  InitialFileLocation: S.optional(FileLocation),
  ServiceMetadata: S.optional(ServiceMetadata),
  Status: S.optional(S.String),
}) {}
export const ListedExecutions = S.Array(ListedExecution);
export class ConnectorFileTransferResult extends S.Class<ConnectorFileTransferResult>(
  "ConnectorFileTransferResult",
)({
  FilePath: S.String,
  StatusCode: S.String,
  FailureCode: S.optional(S.String),
  FailureMessage: S.optional(S.String),
}) {}
export const ConnectorFileTransferResults = S.Array(
  ConnectorFileTransferResult,
);
export class ListedHostKey extends S.Class<ListedHostKey>("ListedHostKey")({
  Arn: S.String,
  HostKeyId: S.optional(S.String),
  Fingerprint: S.optional(S.String),
  Description: S.optional(S.String),
  Type: S.optional(S.String),
  DateImported: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ListedHostKeys = S.Array(ListedHostKey);
export class SftpConnectorConnectionDetails extends S.Class<SftpConnectorConnectionDetails>(
  "SftpConnectorConnectionDetails",
)({ HostKey: S.optional(S.String) }) {}
export class CreateAccessResponse extends S.Class<CreateAccessResponse>(
  "CreateAccessResponse",
)({ ServerId: S.String, ExternalId: S.String }) {}
export class DescribeAccessResponse extends S.Class<DescribeAccessResponse>(
  "DescribeAccessResponse",
)({ ServerId: S.String, Access: DescribedAccess }) {}
export class DescribeHostKeyResponse extends S.Class<DescribeHostKeyResponse>(
  "DescribeHostKeyResponse",
)({ HostKey: DescribedHostKey }) {}
export class DescribeSecurityPolicyResponse extends S.Class<DescribeSecurityPolicyResponse>(
  "DescribeSecurityPolicyResponse",
)({ SecurityPolicy: DescribedSecurityPolicy }) {}
export class ImportHostKeyResponse extends S.Class<ImportHostKeyResponse>(
  "ImportHostKeyResponse",
)({ ServerId: S.String, HostKeyId: S.String }) {}
export class ListAccessesResponse extends S.Class<ListAccessesResponse>(
  "ListAccessesResponse",
)({
  NextToken: S.optional(S.String),
  ServerId: S.String,
  Accesses: ListedAccesses,
}) {}
export class ListExecutionsResponse extends S.Class<ListExecutionsResponse>(
  "ListExecutionsResponse",
)({
  NextToken: S.optional(S.String),
  WorkflowId: S.String,
  Executions: ListedExecutions,
}) {}
export class ListFileTransferResultsResponse extends S.Class<ListFileTransferResultsResponse>(
  "ListFileTransferResultsResponse",
)({
  FileTransferResults: ConnectorFileTransferResults,
  NextToken: S.optional(S.String),
}) {}
export class ListHostKeysResponse extends S.Class<ListHostKeysResponse>(
  "ListHostKeysResponse",
)({
  NextToken: S.optional(S.String),
  ServerId: S.String,
  HostKeys: ListedHostKeys,
}) {}
export class TestConnectionResponse extends S.Class<TestConnectionResponse>(
  "TestConnectionResponse",
)({
  ConnectorId: S.optional(S.String),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  SftpConnectionDetails: S.optional(SftpConnectorConnectionDetails),
}) {}
export class LoggingConfiguration extends S.Class<LoggingConfiguration>(
  "LoggingConfiguration",
)({ LoggingRole: S.optional(S.String), LogGroupName: S.optional(S.String) }) {}
export class ExecutionError extends S.Class<ExecutionError>("ExecutionError")({
  Type: S.String,
  Message: S.String,
}) {}
export class ExecutionStepResult extends S.Class<ExecutionStepResult>(
  "ExecutionStepResult",
)({
  StepType: S.optional(S.String),
  Outputs: S.optional(S.String),
  Error: S.optional(ExecutionError),
}) {}
export const ExecutionStepResults = S.Array(ExecutionStepResult);
export class ExecutionResults extends S.Class<ExecutionResults>(
  "ExecutionResults",
)({
  Steps: S.optional(ExecutionStepResults),
  OnExceptionSteps: S.optional(ExecutionStepResults),
}) {}
export class DescribedExecution extends S.Class<DescribedExecution>(
  "DescribedExecution",
)({
  ExecutionId: S.optional(S.String),
  InitialFileLocation: S.optional(FileLocation),
  ServiceMetadata: S.optional(ServiceMetadata),
  ExecutionRole: S.optional(S.String),
  LoggingConfiguration: S.optional(LoggingConfiguration),
  PosixProfile: S.optional(PosixProfile),
  Status: S.optional(S.String),
  Results: S.optional(ExecutionResults),
}) {}
export class DescribeExecutionResponse extends S.Class<DescribeExecutionResponse>(
  "DescribeExecutionResponse",
)({ WorkflowId: S.String, Execution: DescribedExecution }) {}

//# Errors
export class InternalServiceError extends S.TaggedError<InternalServiceError>()(
  "InternalServiceError",
  {},
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  {},
  T.AwsQueryError({ code: "ServiceUnavailable", httpResponseCode: 503 }),
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  {},
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessDenied", httpResponseCode: 403 }),
) {}
export class ResourceExistsException extends S.TaggedError<ResourceExistsException>()(
  "ResourceExistsException",
  {},
) {}

//# Operations
/**
 * Attaches a key-value pair to a resource, as identified by its Amazon Resource Name (ARN). Resources are users, servers, roles, and other entities.
 *
 * There is no response returned from this call.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Detaches a key-value pair from a resource, as identified by its Amazon Resource Name (ARN). Resources are users, servers, roles, and other entities.
 *
 * No response is returned from this call.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Allows you to delete the access specified in the `ServerID` and `ExternalID` parameters.
 */
export const deleteAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAccessRequest,
  output: DeleteAccessResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the host key that's specified in the `HostKeyId` parameter.
 */
export const deleteHostKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteHostKeyRequest,
  output: DeleteHostKeyResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a user's Secure Shell (SSH) public key.
 */
export const deleteSshPublicKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSshPublicKeyRequest,
  output: DeleteSshPublicKeyResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists all of the tags associated with the Amazon Resource Name (ARN) that you specify. The resource can be a user, server, or role.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServiceError,
    InvalidNextTokenException,
    InvalidRequestException,
    ServiceUnavailableException,
  ],
}));
/**
 * Sends a callback for asynchronous custom steps.
 *
 * The `ExecutionId`, `WorkflowId`, and `Token` are passed to the target resource during execution of a custom step of a workflow. You must include those with their callback as well as providing a status.
 */
export const sendWorkflowStepState = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SendWorkflowStepStateRequest,
    output: SendWorkflowStepStateResponse,
    errors: [
      AccessDeniedException,
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves a list of the contents of a directory from a remote SFTP server. You specify the connector ID, the output path, and the remote directory path. You can also specify the optional `MaxItems` value to control the maximum number of items that are listed from the remote directory. This API returns a list of all files and directories in the remote directory (up to the maximum value), but does not return files or folders in sub-directories. That is, it only returns a list of files and directories one-level deep.
 *
 * After you receive the listing file, you can provide the files that you want to transfer to the `RetrieveFilePaths` parameter of the `StartFileTransfer` API call.
 *
 * The naming convention for the output file is ` *connector-ID*-*listing-ID*.json`. The output file contains the following information:
 *
 * - `filePath`: the complete path of a remote file, relative to the directory of the listing request for your SFTP connector on the remote server.
 *
 * - `modifiedTimestamp`: the last time the file was modified, in UTC time format. This field is optional. If the remote file attributes don't contain a timestamp, it is omitted from the file listing.
 *
 * - `size`: the size of the file, in bytes. This field is optional. If the remote file attributes don't contain a file size, it is omitted from the file listing.
 *
 * - `path`: the complete path of a remote directory, relative to the directory of the listing request for your SFTP connector on the remote server.
 *
 * - `truncated`: a flag indicating whether the list output contains all of the items contained in the remote directory or not. If your `Truncated` output value is true, you can increase the value provided in the optional `max-items` input attribute to be able to list more items (up to the maximum allowed list size of 10,000 items).
 */
export const startDirectoryListing = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartDirectoryListingRequest,
    output: StartDirectoryListingResponse,
    errors: [
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
      ThrottlingException,
    ],
  }),
);
/**
 * Begins a file transfer between local Amazon Web Services storage and a remote AS2 or SFTP server.
 *
 * - For an AS2 connector, you specify the `ConnectorId` and one or more `SendFilePaths` to identify the files you want to transfer.
 *
 * - For an SFTP connector, the file transfer can be either outbound or inbound. In both cases, you specify the `ConnectorId`. Depending on the direction of the transfer, you also specify the following items:
 *
 * - If you are transferring file from a partner's SFTP server to Amazon Web Services storage, you specify one or more `RetrieveFilePaths` to identify the files you want to transfer, and a `LocalDirectoryPath` to specify the destination folder.
 *
 * - If you are transferring file to a partner's SFTP server from Amazon Web Services storage, you specify one or more `SendFilePaths` to identify the files you want to transfer, and a `RemoteDirectoryPath` to specify the destination folder.
 */
export const startFileTransfer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartFileTransferRequest,
  output: StartFileTransferResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a file or directory on the remote SFTP server.
 */
export const startRemoteDelete = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRemoteDeleteRequest,
  output: StartRemoteDeleteResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Moves or renames a file or directory on the remote SFTP server.
 */
export const startRemoteMove = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartRemoteMoveRequest,
  output: StartRemoteMoveResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Changes the state of a file transfer protocol-enabled server from `OFFLINE` to `ONLINE`. It has no impact on a server that is already `ONLINE`. An `ONLINE` server can accept and process file transfer jobs.
 *
 * The state of `STARTING` indicates that the server is in an intermediate state, either not fully able to respond, or not fully online. The values of `START_FAILED` can indicate an error condition.
 *
 * No response is returned from this call.
 */
export const startServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartServerRequest,
  output: StartServerResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Changes the state of a file transfer protocol-enabled server from `ONLINE` to `OFFLINE`. An `OFFLINE` server cannot accept and process file transfer jobs. Information tied to your server, such as server and user properties, are not affected by stopping your server.
 *
 * Stopping the server does not reduce or impact your file transfer protocol endpoint billing; you must delete the server to stop being billed.
 *
 * The state of `STOPPING` indicates that the server is in an intermediate state, either not fully able to respond, or not fully offline. The values of `STOP_FAILED` can indicate an error condition.
 *
 * No response is returned from this call.
 */
export const stopServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopServerRequest,
  output: StopServerResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * If the `IdentityProviderType` of a file transfer protocol-enabled server is `AWS_DIRECTORY_SERVICE` or `API_Gateway`, tests whether your identity provider is set up successfully. We highly recommend that you call this operation to test your authentication method as soon as you create your server. By doing so, you can troubleshoot issues with the identity provider integration to ensure that your users can successfully use the service.
 *
 * The `ServerId` and `UserName` parameters are required. The `ServerProtocol`, `SourceIp`, and `UserPassword` are all optional.
 *
 * Note the following:
 *
 * - You cannot use `TestIdentityProvider` if the `IdentityProviderType` of your server is `SERVICE_MANAGED`.
 *
 * - `TestIdentityProvider` does not work with keys: it only accepts passwords.
 *
 * - `TestIdentityProvider` can test the password operation for a custom Identity Provider that handles keys and passwords.
 *
 * - If you provide any incorrect values for any parameters, the `Response` field is empty.
 *
 * - If you provide a server ID for a server that uses service-managed users, you get an error:
 *
 * ` An error occurred (InvalidRequestException) when calling the TestIdentityProvider operation: s-*server-ID* not configured for external auth `
 *
 * - If you enter a Server ID for the `--server-id` parameter that does not identify an actual Transfer server, you receive the following error:
 *
 * `An error occurred (ResourceNotFoundException) when calling the TestIdentityProvider operation: Unknown server`.
 *
 * It is possible your sever is in a different region. You can specify a region by adding the following: `--region region-code`, such as `--region us-east-2` to specify a server in **US East (Ohio)**.
 */
export const testIdentityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TestIdentityProviderRequest,
    output: TestIdentityProviderResponse,
    errors: [
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Allows you to update parameters for the access specified in the `ServerID` and `ExternalID` parameters.
 */
export const updateAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAccessRequest,
  output: UpdateAccessResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates the description for the host key that's specified by the `ServerId` and `HostKeyId` parameters.
 */
export const updateHostKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHostKeyRequest,
  output: UpdateHostKeyResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Used by administrators to choose which groups in the directory should have access to upload and download files over the enabled protocols using Transfer Family. For example, a Microsoft Active Directory might contain 50,000 users, but only a small fraction might need the ability to transfer files to the server. An administrator can use `CreateAccess` to limit the access to the correct set of users who need this ability.
 */
export const createAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessRequest,
  output: CreateAccessResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Describes the access that is assigned to the specific file transfer protocol-enabled server, as identified by its `ServerId` property and its `ExternalId`.
 *
 * The response from this call returns the properties of the access that is associated with the `ServerId` value that was specified.
 */
export const describeAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccessRequest,
  output: DescribeAccessResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns the details of the host key that's specified by the `HostKeyId` and `ServerId`.
 */
export const describeHostKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHostKeyRequest,
  output: DescribeHostKeyResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Describes the security policy that is attached to your server or SFTP connector. The response contains a description of the security policy's properties. For more information about security policies, see Working with security policies for servers or Working with security policies for SFTP connectors.
 */
export const describeSecurityPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeSecurityPolicyRequest,
    output: DescribeSecurityPolicyResponse,
    errors: [
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Adds a host key to the server that's specified by the `ServerId` parameter.
 */
export const importHostKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportHostKeyRequest,
  output: ImportHostKeyResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Adds a Secure Shell (SSH) public key to a Transfer Family user identified by a `UserName` value assigned to the specific file transfer protocol-enabled server, identified by `ServerId`.
 *
 * The response returns the `UserName` value, the `ServerId` value, and the name of the `SshPublicKeyId`.
 */
export const importSshPublicKey = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportSshPublicKeyRequest,
  output: ImportSshPublicKeyResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Lists the details for all the accesses you have on your server.
 */
export const listAccesses = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAccessesRequest,
  output: ListAccessesResponse,
  errors: [
    InternalServiceError,
    InvalidNextTokenException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Lists all in-progress executions for the specified workflow.
 *
 * If the specified workflow ID cannot be found, `ListExecutions` returns a `ResourceNotFound` exception.
 */
export const listExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExecutionsRequest,
  output: ListExecutionsResponse,
  errors: [
    InternalServiceError,
    InvalidNextTokenException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns real-time updates and detailed information on the status of each individual file being transferred in a specific file transfer operation. You specify the file transfer by providing its `ConnectorId` and its `TransferId`.
 *
 * File transfer results are available up to 7 days after an operation has been requested.
 */
export const listFileTransferResults = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListFileTransferResultsRequest,
    output: ListFileTransferResultsResponse,
    errors: [
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Returns a list of host keys for the server that's specified by the `ServerId` parameter.
 */
export const listHostKeys = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListHostKeysRequest,
  output: ListHostKeysResponse,
  errors: [
    InternalServiceError,
    InvalidNextTokenException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Lists the security policies that are attached to your servers and SFTP connectors. For more information about security policies, see Working with security policies for servers or Working with security policies for SFTP connectors.
 */
export const listSecurityPolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListSecurityPoliciesRequest,
    output: ListSecurityPoliciesResponse,
    errors: [
      InternalServiceError,
      InvalidNextTokenException,
      InvalidRequestException,
      ServiceUnavailableException,
    ],
  }),
);
/**
 * Tests whether your SFTP connector is set up successfully. We highly recommend that you call this operation to test your ability to transfer files between local Amazon Web Services storage and a trading partner's SFTP server.
 */
export const testConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestConnectionRequest,
  output: TestConnectionResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * You can use `DescribeExecution` to check the details of the execution of the specified workflow.
 *
 * This API call only returns details for in-progress workflows.
 *
 * If you provide an ID for an execution that is not in progress, or if the execution doesn't match the specified workflow ID, you receive a `ResourceNotFound` exception.
 */
export const describeExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExecutionRequest,
  output: DescribeExecutionResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
