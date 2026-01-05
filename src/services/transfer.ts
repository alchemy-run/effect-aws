import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
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
export const CertificateIds = S.Array(S.String);
export const Protocols = S.Array(S.String);
export const StructuredLogDestinations = S.Array(S.String);
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
export class DescribeAgreementRequest extends S.Class<DescribeAgreementRequest>(
  "DescribeAgreementRequest",
)(
  { AgreementId: S.String, ServerId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CustomDirectoriesType extends S.Class<CustomDirectoriesType>(
  "CustomDirectoriesType",
)({
  FailedFilesDirectory: S.String,
  MdnFilesDirectory: S.String,
  PayloadFilesDirectory: S.String,
  StatusFilesDirectory: S.String,
  TemporaryFilesDirectory: S.String,
}) {}
export class UpdateAgreementRequest extends S.Class<UpdateAgreementRequest>(
  "UpdateAgreementRequest",
)(
  {
    AgreementId: S.String,
    ServerId: S.String,
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    LocalProfileId: S.optional(S.String),
    PartnerProfileId: S.optional(S.String),
    BaseDirectory: S.optional(S.String),
    AccessRole: S.optional(S.String),
    PreserveFilename: S.optional(S.String),
    EnforceMessageSigning: S.optional(S.String),
    CustomDirectories: S.optional(CustomDirectoriesType),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAgreementRequest extends S.Class<DeleteAgreementRequest>(
  "DeleteAgreementRequest",
)(
  { AgreementId: S.String, ServerId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAgreementResponse extends S.Class<DeleteAgreementResponse>(
  "DeleteAgreementResponse",
)({}) {}
export class ListAgreementsRequest extends S.Class<ListAgreementsRequest>(
  "ListAgreementsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ServerId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportCertificateRequest extends S.Class<ImportCertificateRequest>(
  "ImportCertificateRequest",
)(
  {
    Usage: S.String,
    Certificate: S.String,
    CertificateChain: S.optional(S.String),
    PrivateKey: S.optional(S.String),
    ActiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    InactiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCertificateRequest extends S.Class<DescribeCertificateRequest>(
  "DescribeCertificateRequest",
)(
  { CertificateId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCertificateRequest extends S.Class<UpdateCertificateRequest>(
  "UpdateCertificateRequest",
)(
  {
    CertificateId: S.String,
    ActiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    InactiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCertificateRequest extends S.Class<DeleteCertificateRequest>(
  "DeleteCertificateRequest",
)(
  { CertificateId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCertificateResponse extends S.Class<DeleteCertificateResponse>(
  "DeleteCertificateResponse",
)({}) {}
export class ListCertificatesRequest extends S.Class<ListCertificatesRequest>(
  "ListCertificatesRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConnectorRequest extends S.Class<DescribeConnectorRequest>(
  "DescribeConnectorRequest",
)(
  { ConnectorId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConnectorRequest extends S.Class<DeleteConnectorRequest>(
  "DeleteConnectorRequest",
)(
  { ConnectorId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConnectorResponse extends S.Class<DeleteConnectorResponse>(
  "DeleteConnectorResponse",
)({}) {}
export class ListConnectorsRequest extends S.Class<ListConnectorsRequest>(
  "ListConnectorsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateProfileRequest extends S.Class<CreateProfileRequest>(
  "CreateProfileRequest",
)(
  {
    As2Id: S.String,
    ProfileType: S.String,
    CertificateIds: S.optional(CertificateIds),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeProfileRequest extends S.Class<DescribeProfileRequest>(
  "DescribeProfileRequest",
)(
  { ProfileId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateProfileRequest extends S.Class<UpdateProfileRequest>(
  "UpdateProfileRequest",
)(
  { ProfileId: S.String, CertificateIds: S.optional(CertificateIds) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProfileRequest extends S.Class<DeleteProfileRequest>(
  "DeleteProfileRequest",
)(
  { ProfileId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteProfileResponse extends S.Class<DeleteProfileResponse>(
  "DeleteProfileResponse",
)({}) {}
export class ListProfilesRequest extends S.Class<ListProfilesRequest>(
  "ListProfilesRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ProfileType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeServerRequest extends S.Class<DescribeServerRequest>(
  "DescribeServerRequest",
)(
  { ServerId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const As2Transports = S.Array(S.String);
export class ProtocolDetails extends S.Class<ProtocolDetails>(
  "ProtocolDetails",
)({
  PassiveIp: S.optional(S.String),
  TlsSessionResumptionMode: S.optional(S.String),
  SetStatOption: S.optional(S.String),
  As2Transports: S.optional(As2Transports),
}) {}
export const AddressAllocationIds = S.Array(S.String);
export const SubnetIds = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export class EndpointDetails extends S.Class<EndpointDetails>(
  "EndpointDetails",
)({
  AddressAllocationIds: S.optional(AddressAllocationIds),
  SubnetIds: S.optional(SubnetIds),
  VpcEndpointId: S.optional(S.String),
  VpcId: S.optional(S.String),
  SecurityGroupIds: S.optional(SecurityGroupIds),
}) {}
export class IdentityProviderDetails extends S.Class<IdentityProviderDetails>(
  "IdentityProviderDetails",
)({
  Url: S.optional(S.String),
  InvocationRole: S.optional(S.String),
  DirectoryId: S.optional(S.String),
  Function: S.optional(S.String),
  SftpAuthenticationMethods: S.optional(S.String),
}) {}
export class WorkflowDetail extends S.Class<WorkflowDetail>("WorkflowDetail")({
  WorkflowId: S.String,
  ExecutionRole: S.String,
}) {}
export const OnUploadWorkflowDetails = S.Array(WorkflowDetail);
export const OnPartialUploadWorkflowDetails = S.Array(WorkflowDetail);
export class WorkflowDetails extends S.Class<WorkflowDetails>(
  "WorkflowDetails",
)({
  OnUpload: S.optional(OnUploadWorkflowDetails),
  OnPartialUpload: S.optional(OnPartialUploadWorkflowDetails),
}) {}
export class S3StorageOptions extends S.Class<S3StorageOptions>(
  "S3StorageOptions",
)({ DirectoryListingOptimization: S.optional(S.String) }) {}
export class UpdateServerRequest extends S.Class<UpdateServerRequest>(
  "UpdateServerRequest",
)(
  {
    Certificate: S.optional(S.String),
    ProtocolDetails: S.optional(ProtocolDetails),
    EndpointDetails: S.optional(EndpointDetails),
    EndpointType: S.optional(S.String),
    HostKey: S.optional(S.String),
    IdentityProviderDetails: S.optional(IdentityProviderDetails),
    LoggingRole: S.optional(S.String),
    PostAuthenticationLoginBanner: S.optional(S.String),
    PreAuthenticationLoginBanner: S.optional(S.String),
    Protocols: S.optional(Protocols),
    SecurityPolicyName: S.optional(S.String),
    ServerId: S.String,
    WorkflowDetails: S.optional(WorkflowDetails),
    StructuredLogDestinations: S.optional(StructuredLogDestinations),
    S3StorageOptions: S.optional(S3StorageOptions),
    IpAddressType: S.optional(S.String),
    IdentityProviderType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServerRequest extends S.Class<DeleteServerRequest>(
  "DeleteServerRequest",
)(
  { ServerId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServerResponse extends S.Class<DeleteServerResponse>(
  "DeleteServerResponse",
)({}) {}
export class ListServersRequest extends S.Class<ListServersRequest>(
  "ListServersRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateUserRequest extends S.Class<CreateUserRequest>(
  "CreateUserRequest",
)(
  {
    HomeDirectory: S.optional(S.String),
    HomeDirectoryType: S.optional(S.String),
    HomeDirectoryMappings: S.optional(HomeDirectoryMappings),
    Policy: S.optional(S.String),
    PosixProfile: S.optional(PosixProfile),
    Role: S.String,
    ServerId: S.String,
    SshPublicKeyBody: S.optional(S.String),
    Tags: S.optional(Tags),
    UserName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeUserRequest extends S.Class<DescribeUserRequest>(
  "DescribeUserRequest",
)(
  { ServerId: S.String, UserName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateUserRequest extends S.Class<UpdateUserRequest>(
  "UpdateUserRequest",
)(
  {
    HomeDirectory: S.optional(S.String),
    HomeDirectoryType: S.optional(S.String),
    HomeDirectoryMappings: S.optional(HomeDirectoryMappings),
    Policy: S.optional(S.String),
    PosixProfile: S.optional(PosixProfile),
    Role: S.optional(S.String),
    ServerId: S.String,
    UserName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserRequest extends S.Class<DeleteUserRequest>(
  "DeleteUserRequest",
)(
  { ServerId: S.String, UserName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserResponse extends S.Class<DeleteUserResponse>(
  "DeleteUserResponse",
)({}) {}
export class ListUsersRequest extends S.Class<ListUsersRequest>(
  "ListUsersRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ServerId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeWebAppCustomizationRequest extends S.Class<DescribeWebAppCustomizationRequest>(
  "DescribeWebAppCustomizationRequest",
)(
  { WebAppId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/describeWebAppCustomization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWebAppCustomizationRequest extends S.Class<UpdateWebAppCustomizationRequest>(
  "UpdateWebAppCustomizationRequest",
)(
  {
    WebAppId: S.String,
    Title: S.optional(S.String),
    LogoFile: S.optional(T.Blob),
    FaviconFile: S.optional(T.Blob),
  },
  T.all(
    T.Http({ method: "POST", uri: "/updateWebAppCustomization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWebAppCustomizationRequest extends S.Class<DeleteWebAppCustomizationRequest>(
  "DeleteWebAppCustomizationRequest",
)(
  { WebAppId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/deleteWebAppCustomization" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWebAppCustomizationResponse extends S.Class<DeleteWebAppCustomizationResponse>(
  "DeleteWebAppCustomizationResponse",
)({}) {}
export class DescribeWebAppRequest extends S.Class<DescribeWebAppRequest>(
  "DescribeWebAppRequest",
)(
  { WebAppId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/describeWebApp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWebAppRequest extends S.Class<DeleteWebAppRequest>(
  "DeleteWebAppRequest",
)(
  { WebAppId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/deleteWebApp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteWebAppResponse extends S.Class<DeleteWebAppResponse>(
  "DeleteWebAppResponse",
)({}) {}
export class ListWebAppsRequest extends S.Class<ListWebAppsRequest>(
  "ListWebAppsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/listWebApps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeWorkflowRequest extends S.Class<DescribeWorkflowRequest>(
  "DescribeWorkflowRequest",
)(
  { WorkflowId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWorkflowRequest extends S.Class<DeleteWorkflowRequest>(
  "DeleteWorkflowRequest",
)(
  { WorkflowId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWorkflowResponse extends S.Class<DeleteWorkflowResponse>(
  "DeleteWorkflowResponse",
)({}) {}
export class ListWorkflowsRequest extends S.Class<ListWorkflowsRequest>(
  "ListWorkflowsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const SftpConnectorTrustedHostKeyList = S.Array(S.String);
export const SecurityPolicyNames = S.Array(S.String);
export class As2ConnectorConfig extends S.Class<As2ConnectorConfig>(
  "As2ConnectorConfig",
)({
  LocalProfileId: S.optional(S.String),
  PartnerProfileId: S.optional(S.String),
  MessageSubject: S.optional(S.String),
  Compression: S.optional(S.String),
  EncryptionAlgorithm: S.optional(S.String),
  SigningAlgorithm: S.optional(S.String),
  MdnSigningAlgorithm: S.optional(S.String),
  MdnResponse: S.optional(S.String),
  BasicAuthSecretId: S.optional(S.String),
  PreserveContentType: S.optional(S.String),
}) {}
export class SftpConnectorConfig extends S.Class<SftpConnectorConfig>(
  "SftpConnectorConfig",
)({
  UserSecretId: S.optional(S.String),
  TrustedHostKeys: S.optional(SftpConnectorTrustedHostKeyList),
  MaxConcurrentConnections: S.optional(S.Number),
}) {}
export const WebAppUnits = S.Union(S.Struct({ Provisioned: S.Number }));
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
export class CreateAgreementRequest extends S.Class<CreateAgreementRequest>(
  "CreateAgreementRequest",
)(
  {
    Description: S.optional(S.String),
    ServerId: S.String,
    LocalProfileId: S.String,
    PartnerProfileId: S.String,
    BaseDirectory: S.optional(S.String),
    AccessRole: S.String,
    Status: S.optional(S.String),
    Tags: S.optional(Tags),
    PreserveFilename: S.optional(S.String),
    EnforceMessageSigning: S.optional(S.String),
    CustomDirectories: S.optional(CustomDirectoriesType),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateAgreementResponse extends S.Class<UpdateAgreementResponse>(
  "UpdateAgreementResponse",
)({ AgreementId: S.String }) {}
export class ImportCertificateResponse extends S.Class<ImportCertificateResponse>(
  "ImportCertificateResponse",
)({ CertificateId: S.String }) {}
export class UpdateCertificateResponse extends S.Class<UpdateCertificateResponse>(
  "UpdateCertificateResponse",
)({ CertificateId: S.String }) {}
export class CreateProfileResponse extends S.Class<CreateProfileResponse>(
  "CreateProfileResponse",
)({ ProfileId: S.String }) {}
export class UpdateProfileResponse extends S.Class<UpdateProfileResponse>(
  "UpdateProfileResponse",
)({ ProfileId: S.String }) {}
export class UpdateServerResponse extends S.Class<UpdateServerResponse>(
  "UpdateServerResponse",
)({ ServerId: S.String }) {}
export class CreateUserResponse extends S.Class<CreateUserResponse>(
  "CreateUserResponse",
)({ ServerId: S.String, UserName: S.String }) {}
export class UpdateUserResponse extends S.Class<UpdateUserResponse>(
  "UpdateUserResponse",
)({ ServerId: S.String, UserName: S.String }) {}
export class UpdateWebAppCustomizationResponse extends S.Class<UpdateWebAppCustomizationResponse>(
  "UpdateWebAppCustomizationResponse",
)({ WebAppId: S.String }) {}
export const SecurityPolicyOptions = S.Array(S.String);
export const SecurityPolicyProtocols = S.Array(S.String);
export class ConnectorVpcLatticeEgressConfig extends S.Class<ConnectorVpcLatticeEgressConfig>(
  "ConnectorVpcLatticeEgressConfig",
)({ ResourceConfigurationArn: S.String, PortNumber: S.optional(S.Number) }) {}
export const ServiceManagedEgressIpAddresses = S.Array(S.String);
export class UpdateConnectorVpcLatticeEgressConfig extends S.Class<UpdateConnectorVpcLatticeEgressConfig>(
  "UpdateConnectorVpcLatticeEgressConfig",
)({
  ResourceConfigurationArn: S.optional(S.String),
  PortNumber: S.optional(S.Number),
}) {}
export class IdentityCenterConfig extends S.Class<IdentityCenterConfig>(
  "IdentityCenterConfig",
)({ InstanceArn: S.optional(S.String), Role: S.optional(S.String) }) {}
export class WebAppVpcConfig extends S.Class<WebAppVpcConfig>(
  "WebAppVpcConfig",
)({
  SubnetIds: S.optional(SubnetIds),
  VpcId: S.optional(S.String),
  SecurityGroupIds: S.optional(SecurityGroupIds),
}) {}
export class UpdateWebAppIdentityCenterConfig extends S.Class<UpdateWebAppIdentityCenterConfig>(
  "UpdateWebAppIdentityCenterConfig",
)({ Role: S.optional(S.String) }) {}
export class UpdateWebAppVpcConfig extends S.Class<UpdateWebAppVpcConfig>(
  "UpdateWebAppVpcConfig",
)({ SubnetIds: S.optional(SubnetIds) }) {}
export class CustomStepDetails extends S.Class<CustomStepDetails>(
  "CustomStepDetails",
)({
  Name: S.optional(S.String),
  Target: S.optional(S.String),
  TimeoutSeconds: S.optional(S.Number),
  SourceFileLocation: S.optional(S.String),
}) {}
export class DeleteStepDetails extends S.Class<DeleteStepDetails>(
  "DeleteStepDetails",
)({ Name: S.optional(S.String), SourceFileLocation: S.optional(S.String) }) {}
export class S3InputFileLocation extends S.Class<S3InputFileLocation>(
  "S3InputFileLocation",
)({ Bucket: S.optional(S.String), Key: S.optional(S.String) }) {}
export class EfsFileLocation extends S.Class<EfsFileLocation>(
  "EfsFileLocation",
)({ FileSystemId: S.optional(S.String), Path: S.optional(S.String) }) {}
export class InputFileLocation extends S.Class<InputFileLocation>(
  "InputFileLocation",
)({
  S3FileLocation: S.optional(S3InputFileLocation),
  EfsFileLocation: S.optional(EfsFileLocation),
}) {}
export class DecryptStepDetails extends S.Class<DecryptStepDetails>(
  "DecryptStepDetails",
)({
  Name: S.optional(S.String),
  Type: S.String,
  SourceFileLocation: S.optional(S.String),
  OverwriteExisting: S.optional(S.String),
  DestinationFileLocation: InputFileLocation,
}) {}
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
export class DescribedAgreement extends S.Class<DescribedAgreement>(
  "DescribedAgreement",
)({
  Arn: S.String,
  AgreementId: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  ServerId: S.optional(S.String),
  LocalProfileId: S.optional(S.String),
  PartnerProfileId: S.optional(S.String),
  BaseDirectory: S.optional(S.String),
  AccessRole: S.optional(S.String),
  Tags: S.optional(Tags),
  PreserveFilename: S.optional(S.String),
  EnforceMessageSigning: S.optional(S.String),
  CustomDirectories: S.optional(CustomDirectoriesType),
}) {}
export class ListedAgreement extends S.Class<ListedAgreement>(
  "ListedAgreement",
)({
  Arn: S.optional(S.String),
  AgreementId: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  ServerId: S.optional(S.String),
  LocalProfileId: S.optional(S.String),
  PartnerProfileId: S.optional(S.String),
}) {}
export const ListedAgreements = S.Array(ListedAgreement);
export class DescribedCertificate extends S.Class<DescribedCertificate>(
  "DescribedCertificate",
)({
  Arn: S.String,
  CertificateId: S.optional(S.String),
  Usage: S.optional(S.String),
  Status: S.optional(S.String),
  Certificate: S.optional(S.String),
  CertificateChain: S.optional(S.String),
  ActiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InactiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Serial: S.optional(S.String),
  NotBeforeDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NotAfterDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Type: S.optional(S.String),
  Description: S.optional(S.String),
  Tags: S.optional(Tags),
}) {}
export class ListedCertificate extends S.Class<ListedCertificate>(
  "ListedCertificate",
)({
  Arn: S.optional(S.String),
  CertificateId: S.optional(S.String),
  Usage: S.optional(S.String),
  Status: S.optional(S.String),
  ActiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InactiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Type: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const ListedCertificates = S.Array(ListedCertificate);
export const ConnectorEgressConfig = S.Union(
  S.Struct({ VpcLattice: ConnectorVpcLatticeEgressConfig }),
);
export const UpdateConnectorEgressConfig = S.Union(
  S.Struct({ VpcLattice: UpdateConnectorVpcLatticeEgressConfig }),
);
export class ListedConnector extends S.Class<ListedConnector>(
  "ListedConnector",
)({
  Arn: S.optional(S.String),
  ConnectorId: S.optional(S.String),
  Url: S.optional(S.String),
}) {}
export const ListedConnectors = S.Array(ListedConnector);
export class DescribedProfile extends S.Class<DescribedProfile>(
  "DescribedProfile",
)({
  Arn: S.String,
  ProfileId: S.optional(S.String),
  ProfileType: S.optional(S.String),
  As2Id: S.optional(S.String),
  CertificateIds: S.optional(CertificateIds),
  Tags: S.optional(Tags),
}) {}
export class ListedProfile extends S.Class<ListedProfile>("ListedProfile")({
  Arn: S.optional(S.String),
  ProfileId: S.optional(S.String),
  As2Id: S.optional(S.String),
  ProfileType: S.optional(S.String),
}) {}
export const ListedProfiles = S.Array(ListedProfile);
export class DescribedServer extends S.Class<DescribedServer>(
  "DescribedServer",
)({
  Arn: S.String,
  Certificate: S.optional(S.String),
  ProtocolDetails: S.optional(ProtocolDetails),
  Domain: S.optional(S.String),
  EndpointDetails: S.optional(EndpointDetails),
  EndpointType: S.optional(S.String),
  HostKeyFingerprint: S.optional(S.String),
  IdentityProviderDetails: S.optional(IdentityProviderDetails),
  IdentityProviderType: S.optional(S.String),
  LoggingRole: S.optional(S.String),
  PostAuthenticationLoginBanner: S.optional(S.String),
  PreAuthenticationLoginBanner: S.optional(S.String),
  Protocols: S.optional(Protocols),
  SecurityPolicyName: S.optional(S.String),
  ServerId: S.optional(S.String),
  State: S.optional(S.String),
  Tags: S.optional(Tags),
  UserCount: S.optional(S.Number),
  WorkflowDetails: S.optional(WorkflowDetails),
  StructuredLogDestinations: S.optional(StructuredLogDestinations),
  S3StorageOptions: S.optional(S3StorageOptions),
  As2ServiceManagedEgressIpAddresses: S.optional(
    ServiceManagedEgressIpAddresses,
  ),
  IpAddressType: S.optional(S.String),
}) {}
export class ListedServer extends S.Class<ListedServer>("ListedServer")({
  Arn: S.String,
  Domain: S.optional(S.String),
  IdentityProviderType: S.optional(S.String),
  EndpointType: S.optional(S.String),
  LoggingRole: S.optional(S.String),
  ServerId: S.optional(S.String),
  State: S.optional(S.String),
  UserCount: S.optional(S.Number),
}) {}
export const ListedServers = S.Array(ListedServer);
export class ListedUser extends S.Class<ListedUser>("ListedUser")({
  Arn: S.String,
  HomeDirectory: S.optional(S.String),
  HomeDirectoryType: S.optional(S.String),
  Role: S.optional(S.String),
  SshPublicKeyCount: S.optional(S.Number),
  UserName: S.optional(S.String),
}) {}
export const ListedUsers = S.Array(ListedUser);
export class DescribedWebAppCustomization extends S.Class<DescribedWebAppCustomization>(
  "DescribedWebAppCustomization",
)({
  Arn: S.String,
  WebAppId: S.String,
  Title: S.optional(S.String),
  LogoFile: S.optional(T.Blob),
  FaviconFile: S.optional(T.Blob),
}) {}
export const WebAppIdentityProviderDetails = S.Union(
  S.Struct({ IdentityCenterConfig: IdentityCenterConfig }),
);
export const WebAppEndpointDetails = S.Union(
  S.Struct({ Vpc: WebAppVpcConfig }),
);
export const UpdateWebAppIdentityProviderDetails = S.Union(
  S.Struct({ IdentityCenterConfig: UpdateWebAppIdentityCenterConfig }),
);
export const UpdateWebAppEndpointDetails = S.Union(
  S.Struct({ Vpc: UpdateWebAppVpcConfig }),
);
export class ListedWebApp extends S.Class<ListedWebApp>("ListedWebApp")({
  Arn: S.String,
  WebAppId: S.String,
  AccessEndpoint: S.optional(S.String),
  WebAppEndpoint: S.optional(S.String),
  EndpointType: S.optional(S.String),
}) {}
export const ListedWebApps = S.Array(ListedWebApp);
export class CopyStepDetails extends S.Class<CopyStepDetails>(
  "CopyStepDetails",
)({
  Name: S.optional(S.String),
  DestinationFileLocation: S.optional(InputFileLocation),
  OverwriteExisting: S.optional(S.String),
  SourceFileLocation: S.optional(S.String),
}) {}
export class S3Tag extends S.Class<S3Tag>("S3Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const S3Tags = S.Array(S3Tag);
export class TagStepDetails extends S.Class<TagStepDetails>("TagStepDetails")({
  Name: S.optional(S.String),
  Tags: S.optional(S3Tags),
  SourceFileLocation: S.optional(S.String),
}) {}
export class WorkflowStep extends S.Class<WorkflowStep>("WorkflowStep")({
  Type: S.optional(S.String),
  CopyStepDetails: S.optional(CopyStepDetails),
  CustomStepDetails: S.optional(CustomStepDetails),
  DeleteStepDetails: S.optional(DeleteStepDetails),
  TagStepDetails: S.optional(TagStepDetails),
  DecryptStepDetails: S.optional(DecryptStepDetails),
}) {}
export const WorkflowSteps = S.Array(WorkflowStep);
export class DescribedWorkflow extends S.Class<DescribedWorkflow>(
  "DescribedWorkflow",
)({
  Arn: S.String,
  Description: S.optional(S.String),
  Steps: S.optional(WorkflowSteps),
  OnExceptionSteps: S.optional(WorkflowSteps),
  WorkflowId: S.optional(S.String),
  Tags: S.optional(Tags),
}) {}
export class ListedWorkflow extends S.Class<ListedWorkflow>("ListedWorkflow")({
  WorkflowId: S.optional(S.String),
  Description: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export const ListedWorkflows = S.Array(ListedWorkflow);
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
export class CreateAgreementResponse extends S.Class<CreateAgreementResponse>(
  "CreateAgreementResponse",
)({ AgreementId: S.String }) {}
export class DescribeAgreementResponse extends S.Class<DescribeAgreementResponse>(
  "DescribeAgreementResponse",
)({ Agreement: DescribedAgreement }) {}
export class ListAgreementsResponse extends S.Class<ListAgreementsResponse>(
  "ListAgreementsResponse",
)({ NextToken: S.optional(S.String), Agreements: ListedAgreements }) {}
export class DescribeCertificateResponse extends S.Class<DescribeCertificateResponse>(
  "DescribeCertificateResponse",
)({ Certificate: DescribedCertificate }) {}
export class ListCertificatesResponse extends S.Class<ListCertificatesResponse>(
  "ListCertificatesResponse",
)({ NextToken: S.optional(S.String), Certificates: ListedCertificates }) {}
export class CreateConnectorRequest extends S.Class<CreateConnectorRequest>(
  "CreateConnectorRequest",
)(
  {
    Url: S.optional(S.String),
    As2Config: S.optional(As2ConnectorConfig),
    AccessRole: S.String,
    LoggingRole: S.optional(S.String),
    Tags: S.optional(Tags),
    SftpConfig: S.optional(SftpConnectorConfig),
    SecurityPolicyName: S.optional(S.String),
    EgressConfig: S.optional(ConnectorEgressConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateConnectorRequest extends S.Class<UpdateConnectorRequest>(
  "UpdateConnectorRequest",
)(
  {
    ConnectorId: S.String,
    Url: S.optional(S.String),
    As2Config: S.optional(As2ConnectorConfig),
    AccessRole: S.optional(S.String),
    LoggingRole: S.optional(S.String),
    SftpConfig: S.optional(SftpConnectorConfig),
    SecurityPolicyName: S.optional(S.String),
    EgressConfig: S.optional(UpdateConnectorEgressConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConnectorsResponse extends S.Class<ListConnectorsResponse>(
  "ListConnectorsResponse",
)({ NextToken: S.optional(S.String), Connectors: ListedConnectors }) {}
export class DescribeProfileResponse extends S.Class<DescribeProfileResponse>(
  "DescribeProfileResponse",
)({ Profile: DescribedProfile }) {}
export class ListProfilesResponse extends S.Class<ListProfilesResponse>(
  "ListProfilesResponse",
)({ NextToken: S.optional(S.String), Profiles: ListedProfiles }) {}
export class CreateServerRequest extends S.Class<CreateServerRequest>(
  "CreateServerRequest",
)(
  {
    Certificate: S.optional(S.String),
    Domain: S.optional(S.String),
    EndpointDetails: S.optional(EndpointDetails),
    EndpointType: S.optional(S.String),
    HostKey: S.optional(S.String),
    IdentityProviderDetails: S.optional(IdentityProviderDetails),
    IdentityProviderType: S.optional(S.String),
    LoggingRole: S.optional(S.String),
    PostAuthenticationLoginBanner: S.optional(S.String),
    PreAuthenticationLoginBanner: S.optional(S.String),
    Protocols: S.optional(Protocols),
    ProtocolDetails: S.optional(ProtocolDetails),
    SecurityPolicyName: S.optional(S.String),
    Tags: S.optional(Tags),
    WorkflowDetails: S.optional(WorkflowDetails),
    StructuredLogDestinations: S.optional(StructuredLogDestinations),
    S3StorageOptions: S.optional(S3StorageOptions),
    IpAddressType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeServerResponse extends S.Class<DescribeServerResponse>(
  "DescribeServerResponse",
)({ Server: DescribedServer }) {}
export class ListServersResponse extends S.Class<ListServersResponse>(
  "ListServersResponse",
)({ NextToken: S.optional(S.String), Servers: ListedServers }) {}
export class ListUsersResponse extends S.Class<ListUsersResponse>(
  "ListUsersResponse",
)({
  NextToken: S.optional(S.String),
  ServerId: S.String,
  Users: ListedUsers,
}) {}
export class DescribeWebAppCustomizationResponse extends S.Class<DescribeWebAppCustomizationResponse>(
  "DescribeWebAppCustomizationResponse",
)({ WebAppCustomization: DescribedWebAppCustomization }) {}
export class CreateWebAppRequest extends S.Class<CreateWebAppRequest>(
  "CreateWebAppRequest",
)(
  {
    IdentityProviderDetails: WebAppIdentityProviderDetails,
    AccessEndpoint: S.optional(S.String),
    WebAppUnits: S.optional(WebAppUnits),
    Tags: S.optional(Tags),
    WebAppEndpointPolicy: S.optional(S.String),
    EndpointDetails: S.optional(WebAppEndpointDetails),
  },
  T.all(
    T.Http({ method: "POST", uri: "/createWebApp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateWebAppRequest extends S.Class<UpdateWebAppRequest>(
  "UpdateWebAppRequest",
)(
  {
    WebAppId: S.String,
    IdentityProviderDetails: S.optional(UpdateWebAppIdentityProviderDetails),
    AccessEndpoint: S.optional(S.String),
    WebAppUnits: S.optional(WebAppUnits),
    EndpointDetails: S.optional(UpdateWebAppEndpointDetails),
  },
  T.all(
    T.Http({ method: "POST", uri: "/updateWebApp" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListWebAppsResponse extends S.Class<ListWebAppsResponse>(
  "ListWebAppsResponse",
)({ NextToken: S.optional(S.String), WebApps: ListedWebApps }) {}
export class DescribeWorkflowResponse extends S.Class<DescribeWorkflowResponse>(
  "DescribeWorkflowResponse",
)({ Workflow: DescribedWorkflow }) {}
export class ListWorkflowsResponse extends S.Class<ListWorkflowsResponse>(
  "ListWorkflowsResponse",
)({ NextToken: S.optional(S.String), Workflows: ListedWorkflows }) {}
export class LoggingConfiguration extends S.Class<LoggingConfiguration>(
  "LoggingConfiguration",
)({ LoggingRole: S.optional(S.String), LogGroupName: S.optional(S.String) }) {}
export class SshPublicKey extends S.Class<SshPublicKey>("SshPublicKey")({
  DateImported: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  SshPublicKeyBody: S.String,
  SshPublicKeyId: S.String,
}) {}
export const SshPublicKeys = S.Array(SshPublicKey);
export class DescribedUser extends S.Class<DescribedUser>("DescribedUser")({
  Arn: S.String,
  HomeDirectory: S.optional(S.String),
  HomeDirectoryMappings: S.optional(HomeDirectoryMappings),
  HomeDirectoryType: S.optional(S.String),
  Policy: S.optional(S.String),
  PosixProfile: S.optional(PosixProfile),
  Role: S.optional(S.String),
  SshPublicKeys: S.optional(SshPublicKeys),
  Tags: S.optional(Tags),
  UserName: S.optional(S.String),
}) {}
export class DescribedConnectorVpcLatticeEgressConfig extends S.Class<DescribedConnectorVpcLatticeEgressConfig>(
  "DescribedConnectorVpcLatticeEgressConfig",
)({ ResourceConfigurationArn: S.String, PortNumber: S.optional(S.Number) }) {}
export class DescribedIdentityCenterConfig extends S.Class<DescribedIdentityCenterConfig>(
  "DescribedIdentityCenterConfig",
)({
  ApplicationArn: S.optional(S.String),
  InstanceArn: S.optional(S.String),
  Role: S.optional(S.String),
}) {}
export class DescribedWebAppVpcConfig extends S.Class<DescribedWebAppVpcConfig>(
  "DescribedWebAppVpcConfig",
)({
  SubnetIds: S.optional(SubnetIds),
  VpcId: S.optional(S.String),
  VpcEndpointId: S.optional(S.String),
}) {}
export class CreateConnectorResponse extends S.Class<CreateConnectorResponse>(
  "CreateConnectorResponse",
)({ ConnectorId: S.String }) {}
export class UpdateConnectorResponse extends S.Class<UpdateConnectorResponse>(
  "UpdateConnectorResponse",
)({ ConnectorId: S.String }) {}
export class CreateServerResponse extends S.Class<CreateServerResponse>(
  "CreateServerResponse",
)({ ServerId: S.String }) {}
export class DescribeUserResponse extends S.Class<DescribeUserResponse>(
  "DescribeUserResponse",
)({ ServerId: S.String, User: DescribedUser }) {}
export class CreateWebAppResponse extends S.Class<CreateWebAppResponse>(
  "CreateWebAppResponse",
)({ WebAppId: S.String }) {}
export class UpdateWebAppResponse extends S.Class<UpdateWebAppResponse>(
  "UpdateWebAppResponse",
)({ WebAppId: S.String }) {}
export const DescribedConnectorEgressConfig = S.Union(
  S.Struct({ VpcLattice: DescribedConnectorVpcLatticeEgressConfig }),
);
export const DescribedWebAppIdentityProviderDetails = S.Union(
  S.Struct({ IdentityCenterConfig: DescribedIdentityCenterConfig }),
);
export const DescribedWebAppEndpointDetails = S.Union(
  S.Struct({ Vpc: DescribedWebAppVpcConfig }),
);
export class ExecutionError extends S.Class<ExecutionError>("ExecutionError")({
  Type: S.String,
  Message: S.String,
}) {}
export class DescribedConnector extends S.Class<DescribedConnector>(
  "DescribedConnector",
)({
  Arn: S.String,
  ConnectorId: S.optional(S.String),
  Url: S.optional(S.String),
  As2Config: S.optional(As2ConnectorConfig),
  AccessRole: S.optional(S.String),
  LoggingRole: S.optional(S.String),
  Tags: S.optional(Tags),
  SftpConfig: S.optional(SftpConnectorConfig),
  ServiceManagedEgressIpAddresses: S.optional(ServiceManagedEgressIpAddresses),
  SecurityPolicyName: S.optional(S.String),
  EgressConfig: S.optional(DescribedConnectorEgressConfig),
  EgressType: S.String,
  ErrorMessage: S.optional(S.String),
  Status: S.String,
}) {}
export class DescribedWebApp extends S.Class<DescribedWebApp>(
  "DescribedWebApp",
)({
  Arn: S.String,
  WebAppId: S.String,
  DescribedIdentityProviderDetails: S.optional(
    DescribedWebAppIdentityProviderDetails,
  ),
  AccessEndpoint: S.optional(S.String),
  WebAppEndpoint: S.optional(S.String),
  WebAppUnits: S.optional(WebAppUnits),
  Tags: S.optional(Tags),
  WebAppEndpointPolicy: S.optional(S.String),
  EndpointType: S.optional(S.String),
  DescribedEndpointDetails: S.optional(DescribedWebAppEndpointDetails),
}) {}
export class ExecutionStepResult extends S.Class<ExecutionStepResult>(
  "ExecutionStepResult",
)({
  StepType: S.optional(S.String),
  Outputs: S.optional(S.String),
  Error: S.optional(ExecutionError),
}) {}
export const ExecutionStepResults = S.Array(ExecutionStepResult);
export class DescribeConnectorResponse extends S.Class<DescribeConnectorResponse>(
  "DescribeConnectorResponse",
)({ Connector: DescribedConnector }) {}
export class DescribeWebAppResponse extends S.Class<DescribeWebAppResponse>(
  "DescribeWebAppResponse",
)({ WebApp: DescribedWebApp }) {}
export class CreateWorkflowRequest extends S.Class<CreateWorkflowRequest>(
  "CreateWorkflowRequest",
)(
  {
    Description: S.optional(S.String),
    Steps: WorkflowSteps,
    OnExceptionSteps: S.optional(WorkflowSteps),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
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
export class CreateWorkflowResponse extends S.Class<CreateWorkflowResponse>(
  "CreateWorkflowResponse",
)({ WorkflowId: S.String }) {}

//# Errors
export class InternalServiceError extends S.TaggedError<InternalServiceError>()(
  "InternalServiceError",
  { Message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessDenied", httpResponseCode: 403 }),
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.String },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, Resource: S.String, ResourceType: S.String },
) {}
export class ResourceExistsException extends S.TaggedError<ResourceExistsException>()(
  "ResourceExistsException",
  { Message: S.String, Resource: S.String, ResourceType: S.String },
) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ServiceUnavailable", httpResponseCode: 503 }),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { RetryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}

//# Operations
/**
 * Lists the security policies that are attached to your servers and SFTP connectors. For more information about security policies, see Working with security policies for servers or Working with security policies for SFTP connectors.
 */
export const listSecurityPolicies =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListSecurityPoliciesRequest,
    output: ListSecurityPoliciesResponse,
    errors: [
      InternalServiceError,
      InvalidNextTokenException,
      InvalidRequestException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "SecurityPolicyNames",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Describes the user assigned to the specific file transfer protocol-enabled server, as identified by its `ServerId` property.
 *
 * The response from this call returns the properties of the user associated with the `ServerId` value that was specified.
 */
export const describeUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserRequest,
  output: DescribeUserResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Lists all web apps associated with your Amazon Web Services account for your current region. The response includes the endpoint type for each web app, showing whether it is publicly accessible or VPC hosted.
 *
 * For more information about using VPC endpoints with Transfer Family, see Create a Transfer Family web app in a VPC.
 */
export const listWebApps = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWebAppsRequest,
    output: ListWebAppsResponse,
    errors: [
      InternalServiceError,
      InvalidNextTokenException,
      InvalidRequestException,
      ThrottlingException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "WebApps",
      pageSize: "MaxResults",
    } as const,
  }),
);
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
 * Returns real-time updates and detailed information on the status of each individual file being transferred in a specific file transfer operation. You specify the file transfer by providing its `ConnectorId` and its `TransferId`.
 *
 * File transfer results are available up to 7 days after an operation has been requested.
 */
export const listFileTransferResults =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListFileTransferResultsRequest,
    output: ListFileTransferResultsResponse,
    errors: [
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "FileTransferResults",
      pageSize: "MaxResults",
    } as const,
  }));
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
 * Describes the agreement that's identified by the `AgreementId`.
 */
export const describeAgreement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAgreementRequest,
  output: DescribeAgreementResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns a list of the agreements for the server that's identified by the `ServerId` that you supply. If you want to limit the results to a certain number, supply a value for the `MaxResults` parameter. If you ran the command previously and received a value for `NextToken`, you can supply that value to continue listing agreements from where you left off.
 */
export const listAgreements = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAgreementsRequest,
    output: ListAgreementsResponse,
    errors: [
      InternalServiceError,
      InvalidNextTokenException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Agreements",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Describes the certificate that's identified by the `CertificateId`.
 *
 * Transfer Family automatically publishes a Amazon CloudWatch metric called `DaysUntilExpiry` for imported certificates. This metric tracks the number of days until the certificate expires based on the `InactiveDate`. The metric is available in the `AWS/Transfer` namespace and includes the `CertificateId` as a dimension.
 */
export const describeCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCertificateRequest,
  output: DescribeCertificateResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns a list of the current certificates that have been imported into Transfer Family. If you want to limit the results to a certain number, supply a value for the `MaxResults` parameter. If you ran the command previously and received a value for the `NextToken` parameter, you can supply that value to continue listing certificates from where you left off.
 */
export const listCertificates = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListCertificatesRequest,
    output: ListCertificatesResponse,
    errors: [
      InternalServiceError,
      InvalidNextTokenException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Certificates",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the connectors for the specified Region.
 */
export const listConnectors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListConnectorsRequest,
    output: ListConnectorsResponse,
    errors: [
      InternalServiceError,
      InvalidNextTokenException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Connectors",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns the details of the profile that's specified by the `ProfileId`.
 */
export const describeProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeProfileRequest,
  output: DescribeProfileResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Returns a list of the profiles for your system. If you want to limit the results to a certain number, supply a value for the `MaxResults` parameter. If you ran the command previously and received a value for `NextToken`, you can supply that value to continue listing profiles from where you left off.
 */
export const listProfiles = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListProfilesRequest,
    output: ListProfilesResponse,
    errors: [
      InternalServiceError,
      InvalidNextTokenException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Profiles",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Describes a file transfer protocol-enabled server that you specify by passing the `ServerId` parameter.
 *
 * The response contains a description of a server's properties. When you set `EndpointType` to VPC, the response will contain the `EndpointDetails`.
 */
export const describeServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeServerRequest,
  output: DescribeServerResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Lists the users for a file transfer protocol-enabled server that you specify by passing the `ServerId` parameter.
 */
export const listUsers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsersRequest,
  output: ListUsersResponse,
  errors: [
    InternalServiceError,
    InvalidNextTokenException,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Users",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Describes the web app customization object that's identified by `WebAppId`.
 */
export const describeWebAppCustomization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeWebAppCustomizationRequest,
    output: DescribeWebAppCustomizationResponse,
    errors: [
      AccessDeniedException,
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Describes the specified workflow.
 */
export const describeWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWorkflowRequest,
  output: DescribeWorkflowResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
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
 * Imports the signing and encryption certificates that you need to create local (AS2) profiles and partner profiles.
 *
 * You can import both the certificate and its chain in the `Certificate` parameter.
 *
 * After importing a certificate, Transfer Family automatically creates a Amazon CloudWatch metric called `DaysUntilExpiry` that tracks the number of days until the certificate expires. The metric is based on the `InactiveDate` parameter and is published daily in the `AWS/Transfer` namespace.
 *
 * It can take up to a full day after importing a certificate for Transfer Family to emit the `DaysUntilExpiry` metric to your account.
 *
 * If you use the `Certificate` parameter to upload both the certificate and its chain, don't use the `CertificateChain` parameter.
 *
 * **CloudWatch monitoring**
 *
 * The `DaysUntilExpiry` metric includes the following specifications:
 *
 * - **Units:** Count (days)
 *
 * - **Dimensions:** `CertificateId` (always present), `Description` (if provided during certificate import)
 *
 * - **Statistics:** Minimum, Maximum, Average
 *
 * - **Frequency:** Published daily
 */
export const importCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportCertificateRequest,
  output: ImportCertificateResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Updates the active and inactive dates for a certificate.
 */
export const updateCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCertificateRequest,
  output: UpdateCertificateResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Creates the local or partner profile to use for AS2 transfers.
 */
export const createProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateProfileRequest,
  output: CreateProfileResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Updates some of the parameters for an existing profile. Provide the `ProfileId` for the profile that you want to update, along with the new values for the parameters to update.
 */
export const updateProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateProfileRequest,
  output: UpdateProfileResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Assigns new properties to a user. Parameters you pass modify any or all of the following: the home directory, role, and policy for the `UserName` and `ServerId` you specify.
 *
 * The response returns the `ServerId` and the `UserName` for the updated user.
 *
 * In the console, you can select *Restricted* when you create or update a user. This ensures that the user can't access anything outside of their home directory. The programmatic way to configure this behavior is to update the user. Set their `HomeDirectoryType` to `LOGICAL`, and specify `HomeDirectoryMappings` with `Entry` as root (`/`) and `Target` as their home directory.
 *
 * For example, if the user's home directory is `/test/admin-user`, the following command updates the user so that their configuration in the console shows the *Restricted* flag as selected.
 *
 * ` aws transfer update-user --server-id <server-id> --user-name admin-user --home-directory-type LOGICAL --home-directory-mappings "[{\"Entry\":\"/\", \"Target\":\"/test/admin-user\"}]"`
 */
export const updateUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserRequest,
  output: UpdateUserResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
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
 * Delete the agreement that's specified in the provided `AgreementId`.
 */
export const deleteAgreement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAgreementRequest,
  output: DeleteAgreementResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the certificate that's specified in the `CertificateId` parameter.
 */
export const deleteCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCertificateRequest,
  output: DeleteCertificateResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the connector that's specified in the provided `ConnectorId`.
 */
export const deleteConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectorRequest,
  output: DeleteConnectorResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the profile that's specified in the `ProfileId` parameter.
 */
export const deleteProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteProfileRequest,
  output: DeleteProfileResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the user belonging to a file transfer protocol-enabled server you specify.
 *
 * No response returns from this operation.
 *
 * When you delete a user from a server, the user's information is lost.
 */
export const deleteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserRequest,
  output: DeleteUserResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the file transfer protocol-enabled server that you specify.
 *
 * No response returns from this operation.
 */
export const deleteServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServerRequest,
  output: DeleteServerResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Deletes the specified web app.
 */
export const deleteWebApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWebAppRequest,
  output: DeleteWebAppResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes the specified workflow.
 */
export const deleteWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkflowRequest,
  output: DeleteWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Lists the details for all the accesses you have on your server.
 */
export const listAccesses = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListAccessesRequest,
    output: ListAccessesResponse,
    errors: [
      InternalServiceError,
      InvalidNextTokenException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Accesses",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all in-progress executions for the specified workflow.
 *
 * If the specified workflow ID cannot be found, `ListExecutions` returns a `ResourceNotFound` exception.
 */
export const listExecutions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListExecutionsRequest,
    output: ListExecutionsResponse,
    errors: [
      InternalServiceError,
      InvalidNextTokenException,
      InvalidRequestException,
      ResourceNotFoundException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Executions",
      pageSize: "MaxResults",
    } as const,
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
 * Assigns new customization properties to a web app. You can modify the icon file, logo file, and title.
 */
export const updateWebAppCustomization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateWebAppCustomizationRequest,
    output: UpdateWebAppCustomizationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes the `WebAppCustomization` object that corresponds to the web app ID specified.
 */
export const deleteWebAppCustomization = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWebAppCustomizationRequest,
    output: DeleteWebAppCustomizationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServiceError,
      InvalidRequestException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Creates an agreement. An agreement is a bilateral trading partner agreement, or partnership, between an Transfer Family server and an AS2 process. The agreement defines the file and message transfer relationship between the server and the AS2 process. To define an agreement, Transfer Family combines a server, local profile, partner profile, certificate, and other attributes.
 *
 * The partner is identified with the `PartnerProfileId`, and the AS2 process is identified with the `LocalProfileId`.
 *
 * Specify *either* `BaseDirectory` or `CustomDirectories`, but not both. Specifying both causes the command to fail.
 */
export const createAgreement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAgreementRequest,
  output: CreateAgreementResponse,
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
 * Updates the file transfer protocol-enabled server's properties after that server has been created.
 *
 * The `UpdateServer` call returns the `ServerId` of the server you updated.
 */
export const updateServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServerRequest,
  output: UpdateServerResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
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
 * Updates some of the parameters for an existing agreement. Provide the `AgreementId` and the `ServerId` for the agreement that you want to update, along with the new values for the parameters to update.
 *
 * Specify *either* `BaseDirectory` or `CustomDirectories`, but not both. Specifying both causes the command to fail.
 *
 * If you update an agreement from using base directory to custom directories, the base directory is no longer used. Similarly, if you change from custom directories to a base directory, the custom directories are no longer used.
 */
export const updateAgreement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAgreementRequest,
  output: UpdateAgreementResponse,
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
 * Creates a user and associates them with an existing file transfer protocol-enabled server. You can only create and associate users with servers that have the `IdentityProviderType` set to `SERVICE_MANAGED`. Using parameters for `CreateUser`, you can specify the user name, set the home directory, store the user's public key, and assign the user's Identity and Access Management (IAM) role. You can also optionally add a session policy, and assign metadata with tags that can be used to group and search for users.
 */
export const createUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserRequest,
  output: CreateUserResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
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
 * Lists the file transfer protocol-enabled servers that are associated with your Amazon Web Services account.
 */
export const listServers = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListServersRequest,
    output: ListServersResponse,
    errors: [
      InternalServiceError,
      InvalidNextTokenException,
      InvalidRequestException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Servers",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all workflows associated with your Amazon Web Services account for your current region.
 */
export const listWorkflows = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkflowsRequest,
    output: ListWorkflowsResponse,
    errors: [
      InternalServiceError,
      InvalidNextTokenException,
      InvalidRequestException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Workflows",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists all of the tags associated with the Amazon Resource Name (ARN) that you specify. The resource can be a user, server, or role.
 */
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTagsForResourceRequest,
    output: ListTagsForResourceResponse,
    errors: [
      InternalServiceError,
      InvalidNextTokenException,
      InvalidRequestException,
      ServiceUnavailableException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Tags",
      pageSize: "MaxResults",
    } as const,
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
 * Creates the connector, which captures the parameters for a connection for the AS2 or SFTP protocol. For AS2, the connector is required for sending files to an externally hosted AS2 server. For SFTP, the connector is required when sending files to an SFTP server or receiving files from an SFTP server. For more details about connectors, see Configure AS2 connectors and Create SFTP connectors.
 *
 * You must specify exactly one configuration object: either for AS2 (`As2Config`) or SFTP (`SftpConfig`).
 */
export const createConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectorRequest,
  output: CreateConnectorResponse,
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
 * Updates some of the parameters for an existing connector. Provide the `ConnectorId` for the connector that you want to update, along with the new values for the parameters to update.
 */
export const updateConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectorRequest,
  output: UpdateConnectorResponse,
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
 * Instantiates an auto-scaling virtual server based on the selected file transfer protocol in Amazon Web Services. When you make updates to your file transfer protocol-enabled server or when you work with users, use the service-generated `ServerId` property that is assigned to the newly created server.
 */
export const createServer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServerRequest,
  output: CreateServerResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceExistsException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Creates a web app based on specified parameters, and returns the ID for the new web app. You can configure the web app to be publicly accessible or hosted within a VPC.
 *
 * For more information about using VPC endpoints with Transfer Family, see Create a Transfer Family web app in a VPC.
 */
export const createWebApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWebAppRequest,
  output: CreateWebAppResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Assigns new properties to a web app. You can modify the access point, identity provider details, endpoint configuration, and the web app units.
 *
 * For more information about using VPC endpoints with Transfer Family, see Create a Transfer Family web app in a VPC.
 */
export const updateWebApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWebAppRequest,
  output: UpdateWebAppResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes the connector that's identified by the `ConnectorId.`
 */
export const describeConnector = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectorRequest,
  output: DescribeConnectorResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Describes the web app that's identified by `WebAppId`. The response includes endpoint configuration details such as whether the web app is publicly accessible or VPC hosted.
 *
 * For more information about using VPC endpoints with Transfer Family, see Create a Transfer Family web app in a VPC.
 */
export const describeWebApp = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWebAppRequest,
  output: DescribeWebAppResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
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
/**
 * Allows you to create a workflow with specified steps and step details the workflow invokes after file transfer completes. After creating a workflow, you can associate the workflow created with any transfer servers by specifying the `workflow-details` field in `CreateServer` and `UpdateServer` operations.
 */
export const createWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkflowRequest,
  output: CreateWorkflowResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceExistsException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
