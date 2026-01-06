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

//# Newtypes
export type HomeDirectory = string;
export type Policy = string;
export type Role = string;
export type ServerId = string;
export type ExternalId = string;
export type HostKeyId = string;
export type SshPublicKeyId = string;
export type UserName = string;
export type ExecutionId = string;
export type WorkflowId = string;
export type SecurityPolicyName = string;
export type HostKey = string | Redacted.Redacted<string>;
export type HostKeyDescription = string;
export type SshPublicKeyBody = string;
export type MaxResults = number;
export type NextToken = string;
export type ConnectorId = string;
export type TransferId = string;
export type Arn = string;
export type CallbackToken = string;
export type FilePath = string;
export type MaxItems = number;
export type SourceIp = string;
export type UserPassword = string | Redacted.Redacted<string>;
export type TagKey = string;
export type Description = string;
export type ProfileId = string;
export type AgreementId = string;
export type CertificateBodyType = string | Redacted.Redacted<string>;
export type CertificateChainType = string | Redacted.Redacted<string>;
export type PrivateKeyType = string | Redacted.Redacted<string>;
export type CertificateId = string;
export type Url = string;
export type ConnectorSecurityPolicyName = string;
export type As2Id = string;
export type Certificate = string;
export type NullableRole = string;
export type PostAuthenticationLoginBanner = string;
export type PreAuthenticationLoginBanner = string;
export type WebAppId = string;
export type WebAppTitle = string;
export type WebAppAccessEndpoint = string;
export type WorkflowDescription = string;
export type MapEntry = string;
export type MapTarget = string;
export type PosixId = number;
export type TagValue = string;
export type MessageSubject = string;
export type As2ConnectorSecretId = string;
export type SecretId = string;
export type SftpConnectorTrustedHostKey = string;
export type MaxConcurrentConnections = number;
export type AddressAllocationId = string;
export type SubnetId = string;
export type VpcEndpointId = string;
export type VpcId = string;
export type SecurityGroupId = string;
export type DirectoryId = string;
export type PassiveIp = string;
export type WebAppUnitCount = number;
export type Message = string;
export type ServiceErrorMessage = string;
export type ListingId = string;
export type OutputFileName = string;
export type DeleteId = string;
export type MoveId = string;
export type Status = string;
export type Response = string;
export type StatusCode = number;
export type VpcLatticeResourceConfigurationArn = string;
export type SftpPort = number;
export type IdentityCenterInstanceArn = string;
export type WorkflowStepName = string;
export type SourceFileLocation = string;
export type CustomStepTarget = string;
export type CustomStepTimeoutSeconds = number;
export type HostKeyFingerprint = string;
export type HostKeyType = string;
export type SecurityPolicyOption = string;
export type FailureCode = string;
export type SftpConnectorHostKey = string;
export type CertSerial = string;
export type ServiceManagedEgressIpAddress = string;
export type ConnectorErrorMessage = string;
export type UserCount = number;
export type SshPublicKeyCount = number;
export type WebAppEndpoint = string;
export type S3TagKey = string;
export type S3TagValue = string;
export type LogGroupName = string;
export type S3Bucket = string;
export type S3Key = string;
export type EfsFileSystemId = string;
export type EfsPath = string;
export type S3VersionId = string;
export type S3Etag = string;
export type SessionId = string;
export type StepResultOutputsJson = string;
export type IdentityCenterApplicationArn = string;
export type Resource = string;
export type ResourceType = string;
export type RetryAfterSeconds = string;
export type ExecutionErrorMessage = string;

//# Schemas
export type FilePaths = string[];
export const FilePaths = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type CertificateIds = string[];
export const CertificateIds = S.Array(S.String);
export type Protocols = string[];
export const Protocols = S.Array(S.String);
export type StructuredLogDestinations = string[];
export const StructuredLogDestinations = S.Array(S.String);
export interface DeleteAccessRequest {
  ServerId: string;
  ExternalId: string;
}
export const DeleteAccessRequest = S.suspend(() =>
  S.Struct({ ServerId: S.String, ExternalId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAccessRequest",
}) as any as S.Schema<DeleteAccessRequest>;
export interface DeleteAccessResponse {}
export const DeleteAccessResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteAccessResponse",
}) as any as S.Schema<DeleteAccessResponse>;
export interface DeleteHostKeyRequest {
  ServerId: string;
  HostKeyId: string;
}
export const DeleteHostKeyRequest = S.suspend(() =>
  S.Struct({ ServerId: S.String, HostKeyId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteHostKeyRequest",
}) as any as S.Schema<DeleteHostKeyRequest>;
export interface DeleteHostKeyResponse {}
export const DeleteHostKeyResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteHostKeyResponse",
}) as any as S.Schema<DeleteHostKeyResponse>;
export interface DeleteSshPublicKeyRequest {
  ServerId: string;
  SshPublicKeyId: string;
  UserName: string;
}
export const DeleteSshPublicKeyRequest = S.suspend(() =>
  S.Struct({
    ServerId: S.String,
    SshPublicKeyId: S.String,
    UserName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSshPublicKeyRequest",
}) as any as S.Schema<DeleteSshPublicKeyRequest>;
export interface DeleteSshPublicKeyResponse {}
export const DeleteSshPublicKeyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSshPublicKeyResponse",
}) as any as S.Schema<DeleteSshPublicKeyResponse>;
export interface DescribeAccessRequest {
  ServerId: string;
  ExternalId: string;
}
export const DescribeAccessRequest = S.suspend(() =>
  S.Struct({ ServerId: S.String, ExternalId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAccessRequest",
}) as any as S.Schema<DescribeAccessRequest>;
export interface DescribeExecutionRequest {
  ExecutionId: string;
  WorkflowId: string;
}
export const DescribeExecutionRequest = S.suspend(() =>
  S.Struct({ ExecutionId: S.String, WorkflowId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeExecutionRequest",
}) as any as S.Schema<DescribeExecutionRequest>;
export interface DescribeHostKeyRequest {
  ServerId: string;
  HostKeyId: string;
}
export const DescribeHostKeyRequest = S.suspend(() =>
  S.Struct({ ServerId: S.String, HostKeyId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeHostKeyRequest",
}) as any as S.Schema<DescribeHostKeyRequest>;
export interface DescribeSecurityPolicyRequest {
  SecurityPolicyName: string;
}
export const DescribeSecurityPolicyRequest = S.suspend(() =>
  S.Struct({ SecurityPolicyName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeSecurityPolicyRequest",
}) as any as S.Schema<DescribeSecurityPolicyRequest>;
export interface ImportSshPublicKeyRequest {
  ServerId: string;
  SshPublicKeyBody: string;
  UserName: string;
}
export const ImportSshPublicKeyRequest = S.suspend(() =>
  S.Struct({
    ServerId: S.String,
    SshPublicKeyBody: S.String,
    UserName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportSshPublicKeyRequest",
}) as any as S.Schema<ImportSshPublicKeyRequest>;
export interface ListAccessesRequest {
  MaxResults?: number;
  NextToken?: string;
  ServerId: string;
}
export const ListAccessesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ServerId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAccessesRequest",
}) as any as S.Schema<ListAccessesRequest>;
export interface ListExecutionsRequest {
  MaxResults?: number;
  NextToken?: string;
  WorkflowId: string;
}
export const ListExecutionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    WorkflowId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListExecutionsRequest",
}) as any as S.Schema<ListExecutionsRequest>;
export interface ListFileTransferResultsRequest {
  ConnectorId: string;
  TransferId: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListFileTransferResultsRequest = S.suspend(() =>
  S.Struct({
    ConnectorId: S.String,
    TransferId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listFileTransferResults" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListFileTransferResultsRequest",
}) as any as S.Schema<ListFileTransferResultsRequest>;
export interface ListHostKeysRequest {
  MaxResults?: number;
  NextToken?: string;
  ServerId: string;
}
export const ListHostKeysRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ServerId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListHostKeysRequest",
}) as any as S.Schema<ListHostKeysRequest>;
export interface ListSecurityPoliciesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListSecurityPoliciesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSecurityPoliciesRequest",
}) as any as S.Schema<ListSecurityPoliciesRequest>;
export interface ListTagsForResourceRequest {
  Arn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface SendWorkflowStepStateRequest {
  WorkflowId: string;
  ExecutionId: string;
  Token: string;
  Status: string;
}
export const SendWorkflowStepStateRequest = S.suspend(() =>
  S.Struct({
    WorkflowId: S.String,
    ExecutionId: S.String,
    Token: S.String,
    Status: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SendWorkflowStepStateRequest",
}) as any as S.Schema<SendWorkflowStepStateRequest>;
export interface SendWorkflowStepStateResponse {}
export const SendWorkflowStepStateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "SendWorkflowStepStateResponse",
}) as any as S.Schema<SendWorkflowStepStateResponse>;
export interface StartDirectoryListingRequest {
  ConnectorId: string;
  RemoteDirectoryPath: string;
  MaxItems?: number;
  OutputDirectoryPath: string;
}
export const StartDirectoryListingRequest = S.suspend(() =>
  S.Struct({
    ConnectorId: S.String,
    RemoteDirectoryPath: S.String,
    MaxItems: S.optional(S.Number),
    OutputDirectoryPath: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartDirectoryListingRequest",
}) as any as S.Schema<StartDirectoryListingRequest>;
export interface StartFileTransferRequest {
  ConnectorId: string;
  SendFilePaths?: FilePaths;
  RetrieveFilePaths?: FilePaths;
  LocalDirectoryPath?: string;
  RemoteDirectoryPath?: string;
}
export const StartFileTransferRequest = S.suspend(() =>
  S.Struct({
    ConnectorId: S.String,
    SendFilePaths: S.optional(FilePaths),
    RetrieveFilePaths: S.optional(FilePaths),
    LocalDirectoryPath: S.optional(S.String),
    RemoteDirectoryPath: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartFileTransferRequest",
}) as any as S.Schema<StartFileTransferRequest>;
export interface StartRemoteDeleteRequest {
  ConnectorId: string;
  DeletePath: string;
}
export const StartRemoteDeleteRequest = S.suspend(() =>
  S.Struct({ ConnectorId: S.String, DeletePath: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/startRemoteDelete" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartRemoteDeleteRequest",
}) as any as S.Schema<StartRemoteDeleteRequest>;
export interface StartRemoteMoveRequest {
  ConnectorId: string;
  SourcePath: string;
  TargetPath: string;
}
export const StartRemoteMoveRequest = S.suspend(() =>
  S.Struct({
    ConnectorId: S.String,
    SourcePath: S.String,
    TargetPath: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/startRemoteMove" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartRemoteMoveRequest",
}) as any as S.Schema<StartRemoteMoveRequest>;
export interface StartServerRequest {
  ServerId: string;
}
export const StartServerRequest = S.suspend(() =>
  S.Struct({ ServerId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartServerRequest",
}) as any as S.Schema<StartServerRequest>;
export interface StartServerResponse {}
export const StartServerResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StartServerResponse",
}) as any as S.Schema<StartServerResponse>;
export interface StopServerRequest {
  ServerId: string;
}
export const StopServerRequest = S.suspend(() =>
  S.Struct({ ServerId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopServerRequest",
}) as any as S.Schema<StopServerRequest>;
export interface StopServerResponse {}
export const StopServerResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopServerResponse",
}) as any as S.Schema<StopServerResponse>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface TagResourceRequest {
  Arn: string;
  Tags: Tags;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ Arn: S.String, Tags: Tags }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface TestConnectionRequest {
  ConnectorId: string;
}
export const TestConnectionRequest = S.suspend(() =>
  S.Struct({ ConnectorId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TestConnectionRequest",
}) as any as S.Schema<TestConnectionRequest>;
export interface TestIdentityProviderRequest {
  ServerId: string;
  ServerProtocol?: string;
  SourceIp?: string;
  UserName: string;
  UserPassword?: string | Redacted.Redacted<string>;
}
export const TestIdentityProviderRequest = S.suspend(() =>
  S.Struct({
    ServerId: S.String,
    ServerProtocol: S.optional(S.String),
    SourceIp: S.optional(S.String),
    UserName: S.String,
    UserPassword: S.optional(SensitiveString),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TestIdentityProviderRequest",
}) as any as S.Schema<TestIdentityProviderRequest>;
export interface UntagResourceRequest {
  Arn: string;
  TagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ Arn: S.String, TagKeys: TagKeys }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface HomeDirectoryMapEntry {
  Entry: string;
  Target: string;
  Type?: string;
}
export const HomeDirectoryMapEntry = S.suspend(() =>
  S.Struct({ Entry: S.String, Target: S.String, Type: S.optional(S.String) }),
).annotations({
  identifier: "HomeDirectoryMapEntry",
}) as any as S.Schema<HomeDirectoryMapEntry>;
export type HomeDirectoryMappings = HomeDirectoryMapEntry[];
export const HomeDirectoryMappings = S.Array(HomeDirectoryMapEntry);
export type SecondaryGids = number[];
export const SecondaryGids = S.Array(S.Number);
export interface PosixProfile {
  Uid: number;
  Gid: number;
  SecondaryGids?: SecondaryGids;
}
export const PosixProfile = S.suspend(() =>
  S.Struct({
    Uid: S.Number,
    Gid: S.Number,
    SecondaryGids: S.optional(SecondaryGids),
  }),
).annotations({ identifier: "PosixProfile" }) as any as S.Schema<PosixProfile>;
export interface UpdateAccessRequest {
  HomeDirectory?: string;
  HomeDirectoryType?: string;
  HomeDirectoryMappings?: HomeDirectoryMappings;
  Policy?: string;
  PosixProfile?: PosixProfile;
  Role?: string;
  ServerId: string;
  ExternalId: string;
}
export const UpdateAccessRequest = S.suspend(() =>
  S.Struct({
    HomeDirectory: S.optional(S.String),
    HomeDirectoryType: S.optional(S.String),
    HomeDirectoryMappings: S.optional(HomeDirectoryMappings),
    Policy: S.optional(S.String),
    PosixProfile: S.optional(PosixProfile),
    Role: S.optional(S.String),
    ServerId: S.String,
    ExternalId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAccessRequest",
}) as any as S.Schema<UpdateAccessRequest>;
export interface UpdateHostKeyRequest {
  ServerId: string;
  HostKeyId: string;
  Description: string;
}
export const UpdateHostKeyRequest = S.suspend(() =>
  S.Struct({
    ServerId: S.String,
    HostKeyId: S.String,
    Description: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateHostKeyRequest",
}) as any as S.Schema<UpdateHostKeyRequest>;
export interface DescribeAgreementRequest {
  AgreementId: string;
  ServerId: string;
}
export const DescribeAgreementRequest = S.suspend(() =>
  S.Struct({ AgreementId: S.String, ServerId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeAgreementRequest",
}) as any as S.Schema<DescribeAgreementRequest>;
export interface CustomDirectoriesType {
  FailedFilesDirectory: string;
  MdnFilesDirectory: string;
  PayloadFilesDirectory: string;
  StatusFilesDirectory: string;
  TemporaryFilesDirectory: string;
}
export const CustomDirectoriesType = S.suspend(() =>
  S.Struct({
    FailedFilesDirectory: S.String,
    MdnFilesDirectory: S.String,
    PayloadFilesDirectory: S.String,
    StatusFilesDirectory: S.String,
    TemporaryFilesDirectory: S.String,
  }),
).annotations({
  identifier: "CustomDirectoriesType",
}) as any as S.Schema<CustomDirectoriesType>;
export interface UpdateAgreementRequest {
  AgreementId: string;
  ServerId: string;
  Description?: string;
  Status?: string;
  LocalProfileId?: string;
  PartnerProfileId?: string;
  BaseDirectory?: string;
  AccessRole?: string;
  PreserveFilename?: string;
  EnforceMessageSigning?: string;
  CustomDirectories?: CustomDirectoriesType;
}
export const UpdateAgreementRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAgreementRequest",
}) as any as S.Schema<UpdateAgreementRequest>;
export interface DeleteAgreementRequest {
  AgreementId: string;
  ServerId: string;
}
export const DeleteAgreementRequest = S.suspend(() =>
  S.Struct({ AgreementId: S.String, ServerId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAgreementRequest",
}) as any as S.Schema<DeleteAgreementRequest>;
export interface DeleteAgreementResponse {}
export const DeleteAgreementResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAgreementResponse",
}) as any as S.Schema<DeleteAgreementResponse>;
export interface ListAgreementsRequest {
  MaxResults?: number;
  NextToken?: string;
  ServerId: string;
}
export const ListAgreementsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ServerId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListAgreementsRequest",
}) as any as S.Schema<ListAgreementsRequest>;
export interface ImportCertificateRequest {
  Usage: string;
  Certificate: string | Redacted.Redacted<string>;
  CertificateChain?: string | Redacted.Redacted<string>;
  PrivateKey?: string | Redacted.Redacted<string>;
  ActiveDate?: Date;
  InactiveDate?: Date;
  Description?: string;
  Tags?: Tags;
}
export const ImportCertificateRequest = S.suspend(() =>
  S.Struct({
    Usage: S.String,
    Certificate: SensitiveString,
    CertificateChain: S.optional(SensitiveString),
    PrivateKey: S.optional(SensitiveString),
    ActiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    InactiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportCertificateRequest",
}) as any as S.Schema<ImportCertificateRequest>;
export interface DescribeCertificateRequest {
  CertificateId: string;
}
export const DescribeCertificateRequest = S.suspend(() =>
  S.Struct({ CertificateId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCertificateRequest",
}) as any as S.Schema<DescribeCertificateRequest>;
export interface UpdateCertificateRequest {
  CertificateId: string;
  ActiveDate?: Date;
  InactiveDate?: Date;
  Description?: string;
}
export const UpdateCertificateRequest = S.suspend(() =>
  S.Struct({
    CertificateId: S.String,
    ActiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    InactiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Description: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCertificateRequest",
}) as any as S.Schema<UpdateCertificateRequest>;
export interface DeleteCertificateRequest {
  CertificateId: string;
}
export const DeleteCertificateRequest = S.suspend(() =>
  S.Struct({ CertificateId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCertificateRequest",
}) as any as S.Schema<DeleteCertificateRequest>;
export interface DeleteCertificateResponse {}
export const DeleteCertificateResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCertificateResponse",
}) as any as S.Schema<DeleteCertificateResponse>;
export interface ListCertificatesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListCertificatesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCertificatesRequest",
}) as any as S.Schema<ListCertificatesRequest>;
export interface DescribeConnectorRequest {
  ConnectorId: string;
}
export const DescribeConnectorRequest = S.suspend(() =>
  S.Struct({ ConnectorId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeConnectorRequest",
}) as any as S.Schema<DescribeConnectorRequest>;
export interface DeleteConnectorRequest {
  ConnectorId: string;
}
export const DeleteConnectorRequest = S.suspend(() =>
  S.Struct({ ConnectorId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteConnectorRequest",
}) as any as S.Schema<DeleteConnectorRequest>;
export interface DeleteConnectorResponse {}
export const DeleteConnectorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConnectorResponse",
}) as any as S.Schema<DeleteConnectorResponse>;
export interface ListConnectorsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListConnectorsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListConnectorsRequest",
}) as any as S.Schema<ListConnectorsRequest>;
export interface CreateProfileRequest {
  As2Id: string;
  ProfileType: string;
  CertificateIds?: CertificateIds;
  Tags?: Tags;
}
export const CreateProfileRequest = S.suspend(() =>
  S.Struct({
    As2Id: S.String,
    ProfileType: S.String,
    CertificateIds: S.optional(CertificateIds),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateProfileRequest",
}) as any as S.Schema<CreateProfileRequest>;
export interface DescribeProfileRequest {
  ProfileId: string;
}
export const DescribeProfileRequest = S.suspend(() =>
  S.Struct({ ProfileId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeProfileRequest",
}) as any as S.Schema<DescribeProfileRequest>;
export interface UpdateProfileRequest {
  ProfileId: string;
  CertificateIds?: CertificateIds;
}
export const UpdateProfileRequest = S.suspend(() =>
  S.Struct({
    ProfileId: S.String,
    CertificateIds: S.optional(CertificateIds),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateProfileRequest",
}) as any as S.Schema<UpdateProfileRequest>;
export interface DeleteProfileRequest {
  ProfileId: string;
}
export const DeleteProfileRequest = S.suspend(() =>
  S.Struct({ ProfileId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteProfileRequest",
}) as any as S.Schema<DeleteProfileRequest>;
export interface DeleteProfileResponse {}
export const DeleteProfileResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteProfileResponse",
}) as any as S.Schema<DeleteProfileResponse>;
export interface ListProfilesRequest {
  MaxResults?: number;
  NextToken?: string;
  ProfileType?: string;
}
export const ListProfilesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ProfileType: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListProfilesRequest",
}) as any as S.Schema<ListProfilesRequest>;
export interface DescribeServerRequest {
  ServerId: string;
}
export const DescribeServerRequest = S.suspend(() =>
  S.Struct({ ServerId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeServerRequest",
}) as any as S.Schema<DescribeServerRequest>;
export type As2Transports = string[];
export const As2Transports = S.Array(S.String);
export interface ProtocolDetails {
  PassiveIp?: string;
  TlsSessionResumptionMode?: string;
  SetStatOption?: string;
  As2Transports?: As2Transports;
}
export const ProtocolDetails = S.suspend(() =>
  S.Struct({
    PassiveIp: S.optional(S.String),
    TlsSessionResumptionMode: S.optional(S.String),
    SetStatOption: S.optional(S.String),
    As2Transports: S.optional(As2Transports),
  }),
).annotations({
  identifier: "ProtocolDetails",
}) as any as S.Schema<ProtocolDetails>;
export type AddressAllocationIds = string[];
export const AddressAllocationIds = S.Array(S.String);
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export interface EndpointDetails {
  AddressAllocationIds?: AddressAllocationIds;
  SubnetIds?: SubnetIds;
  VpcEndpointId?: string;
  VpcId?: string;
  SecurityGroupIds?: SecurityGroupIds;
}
export const EndpointDetails = S.suspend(() =>
  S.Struct({
    AddressAllocationIds: S.optional(AddressAllocationIds),
    SubnetIds: S.optional(SubnetIds),
    VpcEndpointId: S.optional(S.String),
    VpcId: S.optional(S.String),
    SecurityGroupIds: S.optional(SecurityGroupIds),
  }),
).annotations({
  identifier: "EndpointDetails",
}) as any as S.Schema<EndpointDetails>;
export interface IdentityProviderDetails {
  Url?: string;
  InvocationRole?: string;
  DirectoryId?: string;
  Function?: string;
  SftpAuthenticationMethods?: string;
}
export const IdentityProviderDetails = S.suspend(() =>
  S.Struct({
    Url: S.optional(S.String),
    InvocationRole: S.optional(S.String),
    DirectoryId: S.optional(S.String),
    Function: S.optional(S.String),
    SftpAuthenticationMethods: S.optional(S.String),
  }),
).annotations({
  identifier: "IdentityProviderDetails",
}) as any as S.Schema<IdentityProviderDetails>;
export interface WorkflowDetail {
  WorkflowId: string;
  ExecutionRole: string;
}
export const WorkflowDetail = S.suspend(() =>
  S.Struct({ WorkflowId: S.String, ExecutionRole: S.String }),
).annotations({
  identifier: "WorkflowDetail",
}) as any as S.Schema<WorkflowDetail>;
export type OnUploadWorkflowDetails = WorkflowDetail[];
export const OnUploadWorkflowDetails = S.Array(WorkflowDetail);
export type OnPartialUploadWorkflowDetails = WorkflowDetail[];
export const OnPartialUploadWorkflowDetails = S.Array(WorkflowDetail);
export interface WorkflowDetails {
  OnUpload?: OnUploadWorkflowDetails;
  OnPartialUpload?: OnPartialUploadWorkflowDetails;
}
export const WorkflowDetails = S.suspend(() =>
  S.Struct({
    OnUpload: S.optional(OnUploadWorkflowDetails),
    OnPartialUpload: S.optional(OnPartialUploadWorkflowDetails),
  }),
).annotations({
  identifier: "WorkflowDetails",
}) as any as S.Schema<WorkflowDetails>;
export interface S3StorageOptions {
  DirectoryListingOptimization?: string;
}
export const S3StorageOptions = S.suspend(() =>
  S.Struct({ DirectoryListingOptimization: S.optional(S.String) }),
).annotations({
  identifier: "S3StorageOptions",
}) as any as S.Schema<S3StorageOptions>;
export interface UpdateServerRequest {
  Certificate?: string;
  ProtocolDetails?: ProtocolDetails;
  EndpointDetails?: EndpointDetails;
  EndpointType?: string;
  HostKey?: string | Redacted.Redacted<string>;
  IdentityProviderDetails?: IdentityProviderDetails;
  LoggingRole?: string;
  PostAuthenticationLoginBanner?: string;
  PreAuthenticationLoginBanner?: string;
  Protocols?: Protocols;
  SecurityPolicyName?: string;
  ServerId: string;
  WorkflowDetails?: WorkflowDetails;
  StructuredLogDestinations?: StructuredLogDestinations;
  S3StorageOptions?: S3StorageOptions;
  IpAddressType?: string;
  IdentityProviderType?: string;
}
export const UpdateServerRequest = S.suspend(() =>
  S.Struct({
    Certificate: S.optional(S.String),
    ProtocolDetails: S.optional(ProtocolDetails),
    EndpointDetails: S.optional(EndpointDetails),
    EndpointType: S.optional(S.String),
    HostKey: S.optional(SensitiveString),
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateServerRequest",
}) as any as S.Schema<UpdateServerRequest>;
export interface DeleteServerRequest {
  ServerId: string;
}
export const DeleteServerRequest = S.suspend(() =>
  S.Struct({ ServerId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteServerRequest",
}) as any as S.Schema<DeleteServerRequest>;
export interface DeleteServerResponse {}
export const DeleteServerResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteServerResponse",
}) as any as S.Schema<DeleteServerResponse>;
export interface ListServersRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListServersRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListServersRequest",
}) as any as S.Schema<ListServersRequest>;
export interface CreateUserRequest {
  HomeDirectory?: string;
  HomeDirectoryType?: string;
  HomeDirectoryMappings?: HomeDirectoryMappings;
  Policy?: string;
  PosixProfile?: PosixProfile;
  Role: string;
  ServerId: string;
  SshPublicKeyBody?: string;
  Tags?: Tags;
  UserName: string;
}
export const CreateUserRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateUserRequest",
}) as any as S.Schema<CreateUserRequest>;
export interface DescribeUserRequest {
  ServerId: string;
  UserName: string;
}
export const DescribeUserRequest = S.suspend(() =>
  S.Struct({ ServerId: S.String, UserName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeUserRequest",
}) as any as S.Schema<DescribeUserRequest>;
export interface UpdateUserRequest {
  HomeDirectory?: string;
  HomeDirectoryType?: string;
  HomeDirectoryMappings?: HomeDirectoryMappings;
  Policy?: string;
  PosixProfile?: PosixProfile;
  Role?: string;
  ServerId: string;
  UserName: string;
}
export const UpdateUserRequest = S.suspend(() =>
  S.Struct({
    HomeDirectory: S.optional(S.String),
    HomeDirectoryType: S.optional(S.String),
    HomeDirectoryMappings: S.optional(HomeDirectoryMappings),
    Policy: S.optional(S.String),
    PosixProfile: S.optional(PosixProfile),
    Role: S.optional(S.String),
    ServerId: S.String,
    UserName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateUserRequest",
}) as any as S.Schema<UpdateUserRequest>;
export interface DeleteUserRequest {
  ServerId: string;
  UserName: string;
}
export const DeleteUserRequest = S.suspend(() =>
  S.Struct({ ServerId: S.String, UserName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteUserRequest",
}) as any as S.Schema<DeleteUserRequest>;
export interface DeleteUserResponse {}
export const DeleteUserResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteUserResponse",
}) as any as S.Schema<DeleteUserResponse>;
export interface ListUsersRequest {
  MaxResults?: number;
  NextToken?: string;
  ServerId: string;
}
export const ListUsersRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ServerId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListUsersRequest",
}) as any as S.Schema<ListUsersRequest>;
export interface DescribeWebAppCustomizationRequest {
  WebAppId: string;
}
export const DescribeWebAppCustomizationRequest = S.suspend(() =>
  S.Struct({ WebAppId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describeWebAppCustomization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeWebAppCustomizationRequest",
}) as any as S.Schema<DescribeWebAppCustomizationRequest>;
export interface UpdateWebAppCustomizationRequest {
  WebAppId: string;
  Title?: string;
  LogoFile?: Uint8Array | Redacted.Redacted<Uint8Array>;
  FaviconFile?: Uint8Array | Redacted.Redacted<Uint8Array>;
}
export const UpdateWebAppCustomizationRequest = S.suspend(() =>
  S.Struct({
    WebAppId: S.String,
    Title: S.optional(S.String),
    LogoFile: S.optional(SensitiveBlob),
    FaviconFile: S.optional(SensitiveBlob),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/updateWebAppCustomization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWebAppCustomizationRequest",
}) as any as S.Schema<UpdateWebAppCustomizationRequest>;
export interface DeleteWebAppCustomizationRequest {
  WebAppId: string;
}
export const DeleteWebAppCustomizationRequest = S.suspend(() =>
  S.Struct({ WebAppId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deleteWebAppCustomization" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWebAppCustomizationRequest",
}) as any as S.Schema<DeleteWebAppCustomizationRequest>;
export interface DeleteWebAppCustomizationResponse {}
export const DeleteWebAppCustomizationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteWebAppCustomizationResponse",
}) as any as S.Schema<DeleteWebAppCustomizationResponse>;
export interface DescribeWebAppRequest {
  WebAppId: string;
}
export const DescribeWebAppRequest = S.suspend(() =>
  S.Struct({ WebAppId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/describeWebApp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeWebAppRequest",
}) as any as S.Schema<DescribeWebAppRequest>;
export interface DeleteWebAppRequest {
  WebAppId: string;
}
export const DeleteWebAppRequest = S.suspend(() =>
  S.Struct({ WebAppId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/deleteWebApp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteWebAppRequest",
}) as any as S.Schema<DeleteWebAppRequest>;
export interface DeleteWebAppResponse {}
export const DeleteWebAppResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteWebAppResponse",
}) as any as S.Schema<DeleteWebAppResponse>;
export interface ListWebAppsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListWebAppsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/listWebApps" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListWebAppsRequest",
}) as any as S.Schema<ListWebAppsRequest>;
export interface DescribeWorkflowRequest {
  WorkflowId: string;
}
export const DescribeWorkflowRequest = S.suspend(() =>
  S.Struct({ WorkflowId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeWorkflowRequest",
}) as any as S.Schema<DescribeWorkflowRequest>;
export interface DeleteWorkflowRequest {
  WorkflowId: string;
}
export const DeleteWorkflowRequest = S.suspend(() =>
  S.Struct({ WorkflowId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteWorkflowRequest",
}) as any as S.Schema<DeleteWorkflowRequest>;
export interface DeleteWorkflowResponse {}
export const DeleteWorkflowResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteWorkflowResponse" },
) as any as S.Schema<DeleteWorkflowResponse>;
export interface ListWorkflowsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListWorkflowsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListWorkflowsRequest",
}) as any as S.Schema<ListWorkflowsRequest>;
export type SftpConnectorTrustedHostKeyList = string[];
export const SftpConnectorTrustedHostKeyList = S.Array(S.String);
export type SecurityPolicyNames = string[];
export const SecurityPolicyNames = S.Array(S.String);
export interface As2ConnectorConfig {
  LocalProfileId?: string;
  PartnerProfileId?: string;
  MessageSubject?: string;
  Compression?: string;
  EncryptionAlgorithm?: string;
  SigningAlgorithm?: string;
  MdnSigningAlgorithm?: string;
  MdnResponse?: string;
  BasicAuthSecretId?: string;
  PreserveContentType?: string;
}
export const As2ConnectorConfig = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "As2ConnectorConfig",
}) as any as S.Schema<As2ConnectorConfig>;
export interface SftpConnectorConfig {
  UserSecretId?: string;
  TrustedHostKeys?: SftpConnectorTrustedHostKeyList;
  MaxConcurrentConnections?: number;
}
export const SftpConnectorConfig = S.suspend(() =>
  S.Struct({
    UserSecretId: S.optional(S.String),
    TrustedHostKeys: S.optional(SftpConnectorTrustedHostKeyList),
    MaxConcurrentConnections: S.optional(S.Number),
  }),
).annotations({
  identifier: "SftpConnectorConfig",
}) as any as S.Schema<SftpConnectorConfig>;
export type WebAppUnits = { Provisioned: number };
export const WebAppUnits = S.Union(S.Struct({ Provisioned: S.Number }));
export interface CreateAccessRequest {
  HomeDirectory?: string;
  HomeDirectoryType?: string;
  HomeDirectoryMappings?: HomeDirectoryMappings;
  Policy?: string;
  PosixProfile?: PosixProfile;
  Role: string;
  ServerId: string;
  ExternalId: string;
}
export const CreateAccessRequest = S.suspend(() =>
  S.Struct({
    HomeDirectory: S.optional(S.String),
    HomeDirectoryType: S.optional(S.String),
    HomeDirectoryMappings: S.optional(HomeDirectoryMappings),
    Policy: S.optional(S.String),
    PosixProfile: S.optional(PosixProfile),
    Role: S.String,
    ServerId: S.String,
    ExternalId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAccessRequest",
}) as any as S.Schema<CreateAccessRequest>;
export interface ImportHostKeyRequest {
  ServerId: string;
  HostKeyBody: string | Redacted.Redacted<string>;
  Description?: string;
  Tags?: Tags;
}
export const ImportHostKeyRequest = S.suspend(() =>
  S.Struct({
    ServerId: S.String,
    HostKeyBody: SensitiveString,
    Description: S.optional(S.String),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportHostKeyRequest",
}) as any as S.Schema<ImportHostKeyRequest>;
export interface ImportSshPublicKeyResponse {
  ServerId: string;
  SshPublicKeyId: string;
  UserName: string;
}
export const ImportSshPublicKeyResponse = S.suspend(() =>
  S.Struct({
    ServerId: S.String,
    SshPublicKeyId: S.String,
    UserName: S.String,
  }),
).annotations({
  identifier: "ImportSshPublicKeyResponse",
}) as any as S.Schema<ImportSshPublicKeyResponse>;
export interface ListSecurityPoliciesResponse {
  NextToken?: string;
  SecurityPolicyNames: SecurityPolicyNames;
}
export const ListSecurityPoliciesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    SecurityPolicyNames: SecurityPolicyNames,
  }),
).annotations({
  identifier: "ListSecurityPoliciesResponse",
}) as any as S.Schema<ListSecurityPoliciesResponse>;
export interface ListTagsForResourceResponse {
  Arn?: string;
  NextToken?: string;
  Tags?: Tags;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    NextToken: S.optional(S.String),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface StartDirectoryListingResponse {
  ListingId: string;
  OutputFileName: string;
}
export const StartDirectoryListingResponse = S.suspend(() =>
  S.Struct({ ListingId: S.String, OutputFileName: S.String }),
).annotations({
  identifier: "StartDirectoryListingResponse",
}) as any as S.Schema<StartDirectoryListingResponse>;
export interface StartFileTransferResponse {
  TransferId: string;
}
export const StartFileTransferResponse = S.suspend(() =>
  S.Struct({ TransferId: S.String }),
).annotations({
  identifier: "StartFileTransferResponse",
}) as any as S.Schema<StartFileTransferResponse>;
export interface StartRemoteDeleteResponse {
  DeleteId: string;
}
export const StartRemoteDeleteResponse = S.suspend(() =>
  S.Struct({ DeleteId: S.String }),
).annotations({
  identifier: "StartRemoteDeleteResponse",
}) as any as S.Schema<StartRemoteDeleteResponse>;
export interface StartRemoteMoveResponse {
  MoveId: string;
}
export const StartRemoteMoveResponse = S.suspend(() =>
  S.Struct({ MoveId: S.String }),
).annotations({
  identifier: "StartRemoteMoveResponse",
}) as any as S.Schema<StartRemoteMoveResponse>;
export interface TestIdentityProviderResponse {
  Response?: string;
  StatusCode: number;
  Message?: string;
  Url: string;
}
export const TestIdentityProviderResponse = S.suspend(() =>
  S.Struct({
    Response: S.optional(S.String),
    StatusCode: S.Number,
    Message: S.optional(S.String),
    Url: S.String,
  }),
).annotations({
  identifier: "TestIdentityProviderResponse",
}) as any as S.Schema<TestIdentityProviderResponse>;
export interface UpdateAccessResponse {
  ServerId: string;
  ExternalId: string;
}
export const UpdateAccessResponse = S.suspend(() =>
  S.Struct({ ServerId: S.String, ExternalId: S.String }),
).annotations({
  identifier: "UpdateAccessResponse",
}) as any as S.Schema<UpdateAccessResponse>;
export interface UpdateHostKeyResponse {
  ServerId: string;
  HostKeyId: string;
}
export const UpdateHostKeyResponse = S.suspend(() =>
  S.Struct({ ServerId: S.String, HostKeyId: S.String }),
).annotations({
  identifier: "UpdateHostKeyResponse",
}) as any as S.Schema<UpdateHostKeyResponse>;
export interface CreateAgreementRequest {
  Description?: string;
  ServerId: string;
  LocalProfileId: string;
  PartnerProfileId: string;
  BaseDirectory?: string;
  AccessRole: string;
  Status?: string;
  Tags?: Tags;
  PreserveFilename?: string;
  EnforceMessageSigning?: string;
  CustomDirectories?: CustomDirectoriesType;
}
export const CreateAgreementRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAgreementRequest",
}) as any as S.Schema<CreateAgreementRequest>;
export interface UpdateAgreementResponse {
  AgreementId: string;
}
export const UpdateAgreementResponse = S.suspend(() =>
  S.Struct({ AgreementId: S.String }),
).annotations({
  identifier: "UpdateAgreementResponse",
}) as any as S.Schema<UpdateAgreementResponse>;
export interface ImportCertificateResponse {
  CertificateId: string;
}
export const ImportCertificateResponse = S.suspend(() =>
  S.Struct({ CertificateId: S.String }),
).annotations({
  identifier: "ImportCertificateResponse",
}) as any as S.Schema<ImportCertificateResponse>;
export interface UpdateCertificateResponse {
  CertificateId: string;
}
export const UpdateCertificateResponse = S.suspend(() =>
  S.Struct({ CertificateId: S.String }),
).annotations({
  identifier: "UpdateCertificateResponse",
}) as any as S.Schema<UpdateCertificateResponse>;
export interface CreateProfileResponse {
  ProfileId: string;
}
export const CreateProfileResponse = S.suspend(() =>
  S.Struct({ ProfileId: S.String }),
).annotations({
  identifier: "CreateProfileResponse",
}) as any as S.Schema<CreateProfileResponse>;
export interface UpdateProfileResponse {
  ProfileId: string;
}
export const UpdateProfileResponse = S.suspend(() =>
  S.Struct({ ProfileId: S.String }),
).annotations({
  identifier: "UpdateProfileResponse",
}) as any as S.Schema<UpdateProfileResponse>;
export interface UpdateServerResponse {
  ServerId: string;
}
export const UpdateServerResponse = S.suspend(() =>
  S.Struct({ ServerId: S.String }),
).annotations({
  identifier: "UpdateServerResponse",
}) as any as S.Schema<UpdateServerResponse>;
export interface CreateUserResponse {
  ServerId: string;
  UserName: string;
}
export const CreateUserResponse = S.suspend(() =>
  S.Struct({ ServerId: S.String, UserName: S.String }),
).annotations({
  identifier: "CreateUserResponse",
}) as any as S.Schema<CreateUserResponse>;
export interface UpdateUserResponse {
  ServerId: string;
  UserName: string;
}
export const UpdateUserResponse = S.suspend(() =>
  S.Struct({ ServerId: S.String, UserName: S.String }),
).annotations({
  identifier: "UpdateUserResponse",
}) as any as S.Schema<UpdateUserResponse>;
export interface UpdateWebAppCustomizationResponse {
  WebAppId: string;
}
export const UpdateWebAppCustomizationResponse = S.suspend(() =>
  S.Struct({ WebAppId: S.String }),
).annotations({
  identifier: "UpdateWebAppCustomizationResponse",
}) as any as S.Schema<UpdateWebAppCustomizationResponse>;
export type SecurityPolicyOptions = string[];
export const SecurityPolicyOptions = S.Array(S.String);
export type SecurityPolicyProtocols = string[];
export const SecurityPolicyProtocols = S.Array(S.String);
export interface ConnectorVpcLatticeEgressConfig {
  ResourceConfigurationArn: string;
  PortNumber?: number;
}
export const ConnectorVpcLatticeEgressConfig = S.suspend(() =>
  S.Struct({
    ResourceConfigurationArn: S.String,
    PortNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "ConnectorVpcLatticeEgressConfig",
}) as any as S.Schema<ConnectorVpcLatticeEgressConfig>;
export type ServiceManagedEgressIpAddresses = string[];
export const ServiceManagedEgressIpAddresses = S.Array(S.String);
export interface UpdateConnectorVpcLatticeEgressConfig {
  ResourceConfigurationArn?: string;
  PortNumber?: number;
}
export const UpdateConnectorVpcLatticeEgressConfig = S.suspend(() =>
  S.Struct({
    ResourceConfigurationArn: S.optional(S.String),
    PortNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "UpdateConnectorVpcLatticeEgressConfig",
}) as any as S.Schema<UpdateConnectorVpcLatticeEgressConfig>;
export interface IdentityCenterConfig {
  InstanceArn?: string;
  Role?: string;
}
export const IdentityCenterConfig = S.suspend(() =>
  S.Struct({ InstanceArn: S.optional(S.String), Role: S.optional(S.String) }),
).annotations({
  identifier: "IdentityCenterConfig",
}) as any as S.Schema<IdentityCenterConfig>;
export interface WebAppVpcConfig {
  SubnetIds?: SubnetIds;
  VpcId?: string;
  SecurityGroupIds?: SecurityGroupIds;
}
export const WebAppVpcConfig = S.suspend(() =>
  S.Struct({
    SubnetIds: S.optional(SubnetIds),
    VpcId: S.optional(S.String),
    SecurityGroupIds: S.optional(SecurityGroupIds),
  }),
).annotations({
  identifier: "WebAppVpcConfig",
}) as any as S.Schema<WebAppVpcConfig>;
export interface UpdateWebAppIdentityCenterConfig {
  Role?: string;
}
export const UpdateWebAppIdentityCenterConfig = S.suspend(() =>
  S.Struct({ Role: S.optional(S.String) }),
).annotations({
  identifier: "UpdateWebAppIdentityCenterConfig",
}) as any as S.Schema<UpdateWebAppIdentityCenterConfig>;
export interface UpdateWebAppVpcConfig {
  SubnetIds?: SubnetIds;
}
export const UpdateWebAppVpcConfig = S.suspend(() =>
  S.Struct({ SubnetIds: S.optional(SubnetIds) }),
).annotations({
  identifier: "UpdateWebAppVpcConfig",
}) as any as S.Schema<UpdateWebAppVpcConfig>;
export interface CustomStepDetails {
  Name?: string;
  Target?: string;
  TimeoutSeconds?: number;
  SourceFileLocation?: string;
}
export const CustomStepDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Target: S.optional(S.String),
    TimeoutSeconds: S.optional(S.Number),
    SourceFileLocation: S.optional(S.String),
  }),
).annotations({
  identifier: "CustomStepDetails",
}) as any as S.Schema<CustomStepDetails>;
export interface DeleteStepDetails {
  Name?: string;
  SourceFileLocation?: string;
}
export const DeleteStepDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    SourceFileLocation: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteStepDetails",
}) as any as S.Schema<DeleteStepDetails>;
export interface S3InputFileLocation {
  Bucket?: string;
  Key?: string;
}
export const S3InputFileLocation = S.suspend(() =>
  S.Struct({ Bucket: S.optional(S.String), Key: S.optional(S.String) }),
).annotations({
  identifier: "S3InputFileLocation",
}) as any as S.Schema<S3InputFileLocation>;
export interface EfsFileLocation {
  FileSystemId?: string;
  Path?: string;
}
export const EfsFileLocation = S.suspend(() =>
  S.Struct({ FileSystemId: S.optional(S.String), Path: S.optional(S.String) }),
).annotations({
  identifier: "EfsFileLocation",
}) as any as S.Schema<EfsFileLocation>;
export interface InputFileLocation {
  S3FileLocation?: S3InputFileLocation;
  EfsFileLocation?: EfsFileLocation;
}
export const InputFileLocation = S.suspend(() =>
  S.Struct({
    S3FileLocation: S.optional(S3InputFileLocation),
    EfsFileLocation: S.optional(EfsFileLocation),
  }),
).annotations({
  identifier: "InputFileLocation",
}) as any as S.Schema<InputFileLocation>;
export interface DecryptStepDetails {
  Name?: string;
  Type: string;
  SourceFileLocation?: string;
  OverwriteExisting?: string;
  DestinationFileLocation: InputFileLocation;
}
export const DecryptStepDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.String,
    SourceFileLocation: S.optional(S.String),
    OverwriteExisting: S.optional(S.String),
    DestinationFileLocation: InputFileLocation,
  }),
).annotations({
  identifier: "DecryptStepDetails",
}) as any as S.Schema<DecryptStepDetails>;
export interface DescribedAccess {
  HomeDirectory?: string;
  HomeDirectoryMappings?: HomeDirectoryMappings;
  HomeDirectoryType?: string;
  Policy?: string;
  PosixProfile?: PosixProfile;
  Role?: string;
  ExternalId?: string;
}
export const DescribedAccess = S.suspend(() =>
  S.Struct({
    HomeDirectory: S.optional(S.String),
    HomeDirectoryMappings: S.optional(HomeDirectoryMappings),
    HomeDirectoryType: S.optional(S.String),
    Policy: S.optional(S.String),
    PosixProfile: S.optional(PosixProfile),
    Role: S.optional(S.String),
    ExternalId: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribedAccess",
}) as any as S.Schema<DescribedAccess>;
export interface DescribedHostKey {
  Arn: string;
  HostKeyId?: string;
  HostKeyFingerprint?: string;
  Description?: string;
  Type?: string;
  DateImported?: Date;
  Tags?: Tags;
}
export const DescribedHostKey = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    HostKeyId: S.optional(S.String),
    HostKeyFingerprint: S.optional(S.String),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
    DateImported: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "DescribedHostKey",
}) as any as S.Schema<DescribedHostKey>;
export interface DescribedSecurityPolicy {
  Fips?: boolean;
  SecurityPolicyName: string;
  SshCiphers?: SecurityPolicyOptions;
  SshKexs?: SecurityPolicyOptions;
  SshMacs?: SecurityPolicyOptions;
  TlsCiphers?: SecurityPolicyOptions;
  SshHostKeyAlgorithms?: SecurityPolicyOptions;
  Type?: string;
  Protocols?: SecurityPolicyProtocols;
}
export const DescribedSecurityPolicy = S.suspend(() =>
  S.Struct({
    Fips: S.optional(S.Boolean),
    SecurityPolicyName: S.String,
    SshCiphers: S.optional(SecurityPolicyOptions),
    SshKexs: S.optional(SecurityPolicyOptions),
    SshMacs: S.optional(SecurityPolicyOptions),
    TlsCiphers: S.optional(SecurityPolicyOptions),
    SshHostKeyAlgorithms: S.optional(SecurityPolicyOptions),
    Type: S.optional(S.String),
    Protocols: S.optional(SecurityPolicyProtocols),
  }),
).annotations({
  identifier: "DescribedSecurityPolicy",
}) as any as S.Schema<DescribedSecurityPolicy>;
export interface ListedAccess {
  HomeDirectory?: string;
  HomeDirectoryType?: string;
  Role?: string;
  ExternalId?: string;
}
export const ListedAccess = S.suspend(() =>
  S.Struct({
    HomeDirectory: S.optional(S.String),
    HomeDirectoryType: S.optional(S.String),
    Role: S.optional(S.String),
    ExternalId: S.optional(S.String),
  }),
).annotations({ identifier: "ListedAccess" }) as any as S.Schema<ListedAccess>;
export type ListedAccesses = ListedAccess[];
export const ListedAccesses = S.Array(ListedAccess);
export interface S3FileLocation {
  Bucket?: string;
  Key?: string;
  VersionId?: string;
  Etag?: string;
}
export const S3FileLocation = S.suspend(() =>
  S.Struct({
    Bucket: S.optional(S.String),
    Key: S.optional(S.String),
    VersionId: S.optional(S.String),
    Etag: S.optional(S.String),
  }),
).annotations({
  identifier: "S3FileLocation",
}) as any as S.Schema<S3FileLocation>;
export interface FileLocation {
  S3FileLocation?: S3FileLocation;
  EfsFileLocation?: EfsFileLocation;
}
export const FileLocation = S.suspend(() =>
  S.Struct({
    S3FileLocation: S.optional(S3FileLocation),
    EfsFileLocation: S.optional(EfsFileLocation),
  }),
).annotations({ identifier: "FileLocation" }) as any as S.Schema<FileLocation>;
export interface UserDetails {
  UserName: string;
  ServerId: string;
  SessionId?: string;
}
export const UserDetails = S.suspend(() =>
  S.Struct({
    UserName: S.String,
    ServerId: S.String,
    SessionId: S.optional(S.String),
  }),
).annotations({ identifier: "UserDetails" }) as any as S.Schema<UserDetails>;
export interface ServiceMetadata {
  UserDetails: UserDetails;
}
export const ServiceMetadata = S.suspend(() =>
  S.Struct({ UserDetails: UserDetails }),
).annotations({
  identifier: "ServiceMetadata",
}) as any as S.Schema<ServiceMetadata>;
export interface ListedExecution {
  ExecutionId?: string;
  InitialFileLocation?: FileLocation;
  ServiceMetadata?: ServiceMetadata;
  Status?: string;
}
export const ListedExecution = S.suspend(() =>
  S.Struct({
    ExecutionId: S.optional(S.String),
    InitialFileLocation: S.optional(FileLocation),
    ServiceMetadata: S.optional(ServiceMetadata),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "ListedExecution",
}) as any as S.Schema<ListedExecution>;
export type ListedExecutions = ListedExecution[];
export const ListedExecutions = S.Array(ListedExecution);
export interface ConnectorFileTransferResult {
  FilePath: string;
  StatusCode: string;
  FailureCode?: string;
  FailureMessage?: string;
}
export const ConnectorFileTransferResult = S.suspend(() =>
  S.Struct({
    FilePath: S.String,
    StatusCode: S.String,
    FailureCode: S.optional(S.String),
    FailureMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectorFileTransferResult",
}) as any as S.Schema<ConnectorFileTransferResult>;
export type ConnectorFileTransferResults = ConnectorFileTransferResult[];
export const ConnectorFileTransferResults = S.Array(
  ConnectorFileTransferResult,
);
export interface ListedHostKey {
  Arn: string;
  HostKeyId?: string;
  Fingerprint?: string;
  Description?: string;
  Type?: string;
  DateImported?: Date;
}
export const ListedHostKey = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    HostKeyId: S.optional(S.String),
    Fingerprint: S.optional(S.String),
    Description: S.optional(S.String),
    Type: S.optional(S.String),
    DateImported: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ListedHostKey",
}) as any as S.Schema<ListedHostKey>;
export type ListedHostKeys = ListedHostKey[];
export const ListedHostKeys = S.Array(ListedHostKey);
export interface SftpConnectorConnectionDetails {
  HostKey?: string;
}
export const SftpConnectorConnectionDetails = S.suspend(() =>
  S.Struct({ HostKey: S.optional(S.String) }),
).annotations({
  identifier: "SftpConnectorConnectionDetails",
}) as any as S.Schema<SftpConnectorConnectionDetails>;
export interface DescribedAgreement {
  Arn: string;
  AgreementId?: string;
  Description?: string;
  Status?: string;
  ServerId?: string;
  LocalProfileId?: string;
  PartnerProfileId?: string;
  BaseDirectory?: string;
  AccessRole?: string;
  Tags?: Tags;
  PreserveFilename?: string;
  EnforceMessageSigning?: string;
  CustomDirectories?: CustomDirectoriesType;
}
export const DescribedAgreement = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DescribedAgreement",
}) as any as S.Schema<DescribedAgreement>;
export interface ListedAgreement {
  Arn?: string;
  AgreementId?: string;
  Description?: string;
  Status?: string;
  ServerId?: string;
  LocalProfileId?: string;
  PartnerProfileId?: string;
}
export const ListedAgreement = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    AgreementId: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(S.String),
    ServerId: S.optional(S.String),
    LocalProfileId: S.optional(S.String),
    PartnerProfileId: S.optional(S.String),
  }),
).annotations({
  identifier: "ListedAgreement",
}) as any as S.Schema<ListedAgreement>;
export type ListedAgreements = ListedAgreement[];
export const ListedAgreements = S.Array(ListedAgreement);
export interface DescribedCertificate {
  Arn: string;
  CertificateId?: string;
  Usage?: string;
  Status?: string;
  Certificate?: string | Redacted.Redacted<string>;
  CertificateChain?: string | Redacted.Redacted<string>;
  ActiveDate?: Date;
  InactiveDate?: Date;
  Serial?: string;
  NotBeforeDate?: Date;
  NotAfterDate?: Date;
  Type?: string;
  Description?: string;
  Tags?: Tags;
}
export const DescribedCertificate = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    CertificateId: S.optional(S.String),
    Usage: S.optional(S.String),
    Status: S.optional(S.String),
    Certificate: S.optional(SensitiveString),
    CertificateChain: S.optional(SensitiveString),
    ActiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    InactiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Serial: S.optional(S.String),
    NotBeforeDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NotAfterDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Type: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "DescribedCertificate",
}) as any as S.Schema<DescribedCertificate>;
export interface ListedCertificate {
  Arn?: string;
  CertificateId?: string;
  Usage?: string;
  Status?: string;
  ActiveDate?: Date;
  InactiveDate?: Date;
  Type?: string;
  Description?: string;
}
export const ListedCertificate = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    CertificateId: S.optional(S.String),
    Usage: S.optional(S.String),
    Status: S.optional(S.String),
    ActiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    InactiveDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Type: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "ListedCertificate",
}) as any as S.Schema<ListedCertificate>;
export type ListedCertificates = ListedCertificate[];
export const ListedCertificates = S.Array(ListedCertificate);
export type ConnectorEgressConfig = {
  VpcLattice: ConnectorVpcLatticeEgressConfig;
};
export const ConnectorEgressConfig = S.Union(
  S.Struct({ VpcLattice: ConnectorVpcLatticeEgressConfig }),
);
export type UpdateConnectorEgressConfig = {
  VpcLattice: UpdateConnectorVpcLatticeEgressConfig;
};
export const UpdateConnectorEgressConfig = S.Union(
  S.Struct({ VpcLattice: UpdateConnectorVpcLatticeEgressConfig }),
);
export interface ListedConnector {
  Arn?: string;
  ConnectorId?: string;
  Url?: string;
}
export const ListedConnector = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    ConnectorId: S.optional(S.String),
    Url: S.optional(S.String),
  }),
).annotations({
  identifier: "ListedConnector",
}) as any as S.Schema<ListedConnector>;
export type ListedConnectors = ListedConnector[];
export const ListedConnectors = S.Array(ListedConnector);
export interface DescribedProfile {
  Arn: string;
  ProfileId?: string;
  ProfileType?: string;
  As2Id?: string;
  CertificateIds?: CertificateIds;
  Tags?: Tags;
}
export const DescribedProfile = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ProfileId: S.optional(S.String),
    ProfileType: S.optional(S.String),
    As2Id: S.optional(S.String),
    CertificateIds: S.optional(CertificateIds),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "DescribedProfile",
}) as any as S.Schema<DescribedProfile>;
export interface ListedProfile {
  Arn?: string;
  ProfileId?: string;
  As2Id?: string;
  ProfileType?: string;
}
export const ListedProfile = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    ProfileId: S.optional(S.String),
    As2Id: S.optional(S.String),
    ProfileType: S.optional(S.String),
  }),
).annotations({
  identifier: "ListedProfile",
}) as any as S.Schema<ListedProfile>;
export type ListedProfiles = ListedProfile[];
export const ListedProfiles = S.Array(ListedProfile);
export interface DescribedServer {
  Arn: string;
  Certificate?: string;
  ProtocolDetails?: ProtocolDetails;
  Domain?: string;
  EndpointDetails?: EndpointDetails;
  EndpointType?: string;
  HostKeyFingerprint?: string;
  IdentityProviderDetails?: IdentityProviderDetails;
  IdentityProviderType?: string;
  LoggingRole?: string;
  PostAuthenticationLoginBanner?: string;
  PreAuthenticationLoginBanner?: string;
  Protocols?: Protocols;
  SecurityPolicyName?: string;
  ServerId?: string;
  State?: string;
  Tags?: Tags;
  UserCount?: number;
  WorkflowDetails?: WorkflowDetails;
  StructuredLogDestinations?: StructuredLogDestinations;
  S3StorageOptions?: S3StorageOptions;
  As2ServiceManagedEgressIpAddresses?: ServiceManagedEgressIpAddresses;
  IpAddressType?: string;
}
export const DescribedServer = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DescribedServer",
}) as any as S.Schema<DescribedServer>;
export interface ListedServer {
  Arn: string;
  Domain?: string;
  IdentityProviderType?: string;
  EndpointType?: string;
  LoggingRole?: string;
  ServerId?: string;
  State?: string;
  UserCount?: number;
}
export const ListedServer = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Domain: S.optional(S.String),
    IdentityProviderType: S.optional(S.String),
    EndpointType: S.optional(S.String),
    LoggingRole: S.optional(S.String),
    ServerId: S.optional(S.String),
    State: S.optional(S.String),
    UserCount: S.optional(S.Number),
  }),
).annotations({ identifier: "ListedServer" }) as any as S.Schema<ListedServer>;
export type ListedServers = ListedServer[];
export const ListedServers = S.Array(ListedServer);
export interface ListedUser {
  Arn: string;
  HomeDirectory?: string;
  HomeDirectoryType?: string;
  Role?: string;
  SshPublicKeyCount?: number;
  UserName?: string;
}
export const ListedUser = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    HomeDirectory: S.optional(S.String),
    HomeDirectoryType: S.optional(S.String),
    Role: S.optional(S.String),
    SshPublicKeyCount: S.optional(S.Number),
    UserName: S.optional(S.String),
  }),
).annotations({ identifier: "ListedUser" }) as any as S.Schema<ListedUser>;
export type ListedUsers = ListedUser[];
export const ListedUsers = S.Array(ListedUser);
export interface DescribedWebAppCustomization {
  Arn: string;
  WebAppId: string;
  Title?: string;
  LogoFile?: Uint8Array | Redacted.Redacted<Uint8Array>;
  FaviconFile?: Uint8Array | Redacted.Redacted<Uint8Array>;
}
export const DescribedWebAppCustomization = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    WebAppId: S.String,
    Title: S.optional(S.String),
    LogoFile: S.optional(SensitiveBlob),
    FaviconFile: S.optional(SensitiveBlob),
  }),
).annotations({
  identifier: "DescribedWebAppCustomization",
}) as any as S.Schema<DescribedWebAppCustomization>;
export type WebAppIdentityProviderDetails = {
  IdentityCenterConfig: IdentityCenterConfig;
};
export const WebAppIdentityProviderDetails = S.Union(
  S.Struct({ IdentityCenterConfig: IdentityCenterConfig }),
);
export type WebAppEndpointDetails = { Vpc: WebAppVpcConfig };
export const WebAppEndpointDetails = S.Union(
  S.Struct({ Vpc: WebAppVpcConfig }),
);
export type UpdateWebAppIdentityProviderDetails = {
  IdentityCenterConfig: UpdateWebAppIdentityCenterConfig;
};
export const UpdateWebAppIdentityProviderDetails = S.Union(
  S.Struct({ IdentityCenterConfig: UpdateWebAppIdentityCenterConfig }),
);
export type UpdateWebAppEndpointDetails = { Vpc: UpdateWebAppVpcConfig };
export const UpdateWebAppEndpointDetails = S.Union(
  S.Struct({ Vpc: UpdateWebAppVpcConfig }),
);
export interface ListedWebApp {
  Arn: string;
  WebAppId: string;
  AccessEndpoint?: string;
  WebAppEndpoint?: string;
  EndpointType?: string;
}
export const ListedWebApp = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    WebAppId: S.String,
    AccessEndpoint: S.optional(S.String),
    WebAppEndpoint: S.optional(S.String),
    EndpointType: S.optional(S.String),
  }),
).annotations({ identifier: "ListedWebApp" }) as any as S.Schema<ListedWebApp>;
export type ListedWebApps = ListedWebApp[];
export const ListedWebApps = S.Array(ListedWebApp);
export interface CopyStepDetails {
  Name?: string;
  DestinationFileLocation?: InputFileLocation;
  OverwriteExisting?: string;
  SourceFileLocation?: string;
}
export const CopyStepDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    DestinationFileLocation: S.optional(InputFileLocation),
    OverwriteExisting: S.optional(S.String),
    SourceFileLocation: S.optional(S.String),
  }),
).annotations({
  identifier: "CopyStepDetails",
}) as any as S.Schema<CopyStepDetails>;
export interface S3Tag {
  Key: string;
  Value: string;
}
export const S3Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "S3Tag" }) as any as S.Schema<S3Tag>;
export type S3Tags = S3Tag[];
export const S3Tags = S.Array(S3Tag);
export interface TagStepDetails {
  Name?: string;
  Tags?: S3Tags;
  SourceFileLocation?: string;
}
export const TagStepDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Tags: S.optional(S3Tags),
    SourceFileLocation: S.optional(S.String),
  }),
).annotations({
  identifier: "TagStepDetails",
}) as any as S.Schema<TagStepDetails>;
export interface WorkflowStep {
  Type?: string;
  CopyStepDetails?: CopyStepDetails;
  CustomStepDetails?: CustomStepDetails;
  DeleteStepDetails?: DeleteStepDetails;
  TagStepDetails?: TagStepDetails;
  DecryptStepDetails?: DecryptStepDetails;
}
export const WorkflowStep = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    CopyStepDetails: S.optional(CopyStepDetails),
    CustomStepDetails: S.optional(CustomStepDetails),
    DeleteStepDetails: S.optional(DeleteStepDetails),
    TagStepDetails: S.optional(TagStepDetails),
    DecryptStepDetails: S.optional(DecryptStepDetails),
  }),
).annotations({ identifier: "WorkflowStep" }) as any as S.Schema<WorkflowStep>;
export type WorkflowSteps = WorkflowStep[];
export const WorkflowSteps = S.Array(WorkflowStep);
export interface DescribedWorkflow {
  Arn: string;
  Description?: string;
  Steps?: WorkflowSteps;
  OnExceptionSteps?: WorkflowSteps;
  WorkflowId?: string;
  Tags?: Tags;
}
export const DescribedWorkflow = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    Description: S.optional(S.String),
    Steps: S.optional(WorkflowSteps),
    OnExceptionSteps: S.optional(WorkflowSteps),
    WorkflowId: S.optional(S.String),
    Tags: S.optional(Tags),
  }),
).annotations({
  identifier: "DescribedWorkflow",
}) as any as S.Schema<DescribedWorkflow>;
export interface ListedWorkflow {
  WorkflowId?: string;
  Description?: string;
  Arn?: string;
}
export const ListedWorkflow = S.suspend(() =>
  S.Struct({
    WorkflowId: S.optional(S.String),
    Description: S.optional(S.String),
    Arn: S.optional(S.String),
  }),
).annotations({
  identifier: "ListedWorkflow",
}) as any as S.Schema<ListedWorkflow>;
export type ListedWorkflows = ListedWorkflow[];
export const ListedWorkflows = S.Array(ListedWorkflow);
export interface CreateAccessResponse {
  ServerId: string;
  ExternalId: string;
}
export const CreateAccessResponse = S.suspend(() =>
  S.Struct({ ServerId: S.String, ExternalId: S.String }),
).annotations({
  identifier: "CreateAccessResponse",
}) as any as S.Schema<CreateAccessResponse>;
export interface DescribeAccessResponse {
  ServerId: string;
  Access: DescribedAccess;
}
export const DescribeAccessResponse = S.suspend(() =>
  S.Struct({ ServerId: S.String, Access: DescribedAccess }),
).annotations({
  identifier: "DescribeAccessResponse",
}) as any as S.Schema<DescribeAccessResponse>;
export interface DescribeHostKeyResponse {
  HostKey: DescribedHostKey;
}
export const DescribeHostKeyResponse = S.suspend(() =>
  S.Struct({ HostKey: DescribedHostKey }),
).annotations({
  identifier: "DescribeHostKeyResponse",
}) as any as S.Schema<DescribeHostKeyResponse>;
export interface DescribeSecurityPolicyResponse {
  SecurityPolicy: DescribedSecurityPolicy;
}
export const DescribeSecurityPolicyResponse = S.suspend(() =>
  S.Struct({ SecurityPolicy: DescribedSecurityPolicy }),
).annotations({
  identifier: "DescribeSecurityPolicyResponse",
}) as any as S.Schema<DescribeSecurityPolicyResponse>;
export interface ImportHostKeyResponse {
  ServerId: string;
  HostKeyId: string;
}
export const ImportHostKeyResponse = S.suspend(() =>
  S.Struct({ ServerId: S.String, HostKeyId: S.String }),
).annotations({
  identifier: "ImportHostKeyResponse",
}) as any as S.Schema<ImportHostKeyResponse>;
export interface ListAccessesResponse {
  NextToken?: string;
  ServerId: string;
  Accesses: ListedAccesses;
}
export const ListAccessesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ServerId: S.String,
    Accesses: ListedAccesses,
  }),
).annotations({
  identifier: "ListAccessesResponse",
}) as any as S.Schema<ListAccessesResponse>;
export interface ListExecutionsResponse {
  NextToken?: string;
  WorkflowId: string;
  Executions: ListedExecutions;
}
export const ListExecutionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    WorkflowId: S.String,
    Executions: ListedExecutions,
  }),
).annotations({
  identifier: "ListExecutionsResponse",
}) as any as S.Schema<ListExecutionsResponse>;
export interface ListFileTransferResultsResponse {
  FileTransferResults: ConnectorFileTransferResults;
  NextToken?: string;
}
export const ListFileTransferResultsResponse = S.suspend(() =>
  S.Struct({
    FileTransferResults: ConnectorFileTransferResults,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListFileTransferResultsResponse",
}) as any as S.Schema<ListFileTransferResultsResponse>;
export interface ListHostKeysResponse {
  NextToken?: string;
  ServerId: string;
  HostKeys: ListedHostKeys;
}
export const ListHostKeysResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ServerId: S.String,
    HostKeys: ListedHostKeys,
  }),
).annotations({
  identifier: "ListHostKeysResponse",
}) as any as S.Schema<ListHostKeysResponse>;
export interface TestConnectionResponse {
  ConnectorId?: string;
  Status?: string;
  StatusMessage?: string;
  SftpConnectionDetails?: SftpConnectorConnectionDetails;
}
export const TestConnectionResponse = S.suspend(() =>
  S.Struct({
    ConnectorId: S.optional(S.String),
    Status: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    SftpConnectionDetails: S.optional(SftpConnectorConnectionDetails),
  }),
).annotations({
  identifier: "TestConnectionResponse",
}) as any as S.Schema<TestConnectionResponse>;
export interface CreateAgreementResponse {
  AgreementId: string;
}
export const CreateAgreementResponse = S.suspend(() =>
  S.Struct({ AgreementId: S.String }),
).annotations({
  identifier: "CreateAgreementResponse",
}) as any as S.Schema<CreateAgreementResponse>;
export interface DescribeAgreementResponse {
  Agreement: DescribedAgreement;
}
export const DescribeAgreementResponse = S.suspend(() =>
  S.Struct({ Agreement: DescribedAgreement }),
).annotations({
  identifier: "DescribeAgreementResponse",
}) as any as S.Schema<DescribeAgreementResponse>;
export interface ListAgreementsResponse {
  NextToken?: string;
  Agreements: ListedAgreements;
}
export const ListAgreementsResponse = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Agreements: ListedAgreements }),
).annotations({
  identifier: "ListAgreementsResponse",
}) as any as S.Schema<ListAgreementsResponse>;
export interface DescribeCertificateResponse {
  Certificate: DescribedCertificate;
}
export const DescribeCertificateResponse = S.suspend(() =>
  S.Struct({ Certificate: DescribedCertificate }),
).annotations({
  identifier: "DescribeCertificateResponse",
}) as any as S.Schema<DescribeCertificateResponse>;
export interface ListCertificatesResponse {
  NextToken?: string;
  Certificates: ListedCertificates;
}
export const ListCertificatesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Certificates: ListedCertificates,
  }),
).annotations({
  identifier: "ListCertificatesResponse",
}) as any as S.Schema<ListCertificatesResponse>;
export interface CreateConnectorRequest {
  Url?: string;
  As2Config?: As2ConnectorConfig;
  AccessRole: string;
  LoggingRole?: string;
  Tags?: Tags;
  SftpConfig?: SftpConnectorConfig;
  SecurityPolicyName?: string;
  EgressConfig?: (typeof ConnectorEgressConfig)["Type"];
}
export const CreateConnectorRequest = S.suspend(() =>
  S.Struct({
    Url: S.optional(S.String),
    As2Config: S.optional(As2ConnectorConfig),
    AccessRole: S.String,
    LoggingRole: S.optional(S.String),
    Tags: S.optional(Tags),
    SftpConfig: S.optional(SftpConnectorConfig),
    SecurityPolicyName: S.optional(S.String),
    EgressConfig: S.optional(ConnectorEgressConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateConnectorRequest",
}) as any as S.Schema<CreateConnectorRequest>;
export interface UpdateConnectorRequest {
  ConnectorId: string;
  Url?: string;
  As2Config?: As2ConnectorConfig;
  AccessRole?: string;
  LoggingRole?: string;
  SftpConfig?: SftpConnectorConfig;
  SecurityPolicyName?: string;
  EgressConfig?: (typeof UpdateConnectorEgressConfig)["Type"];
}
export const UpdateConnectorRequest = S.suspend(() =>
  S.Struct({
    ConnectorId: S.String,
    Url: S.optional(S.String),
    As2Config: S.optional(As2ConnectorConfig),
    AccessRole: S.optional(S.String),
    LoggingRole: S.optional(S.String),
    SftpConfig: S.optional(SftpConnectorConfig),
    SecurityPolicyName: S.optional(S.String),
    EgressConfig: S.optional(UpdateConnectorEgressConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateConnectorRequest",
}) as any as S.Schema<UpdateConnectorRequest>;
export interface ListConnectorsResponse {
  NextToken?: string;
  Connectors: ListedConnectors;
}
export const ListConnectorsResponse = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Connectors: ListedConnectors }),
).annotations({
  identifier: "ListConnectorsResponse",
}) as any as S.Schema<ListConnectorsResponse>;
export interface DescribeProfileResponse {
  Profile: DescribedProfile;
}
export const DescribeProfileResponse = S.suspend(() =>
  S.Struct({ Profile: DescribedProfile }),
).annotations({
  identifier: "DescribeProfileResponse",
}) as any as S.Schema<DescribeProfileResponse>;
export interface ListProfilesResponse {
  NextToken?: string;
  Profiles: ListedProfiles;
}
export const ListProfilesResponse = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Profiles: ListedProfiles }),
).annotations({
  identifier: "ListProfilesResponse",
}) as any as S.Schema<ListProfilesResponse>;
export interface CreateServerRequest {
  Certificate?: string;
  Domain?: string;
  EndpointDetails?: EndpointDetails;
  EndpointType?: string;
  HostKey?: string | Redacted.Redacted<string>;
  IdentityProviderDetails?: IdentityProviderDetails;
  IdentityProviderType?: string;
  LoggingRole?: string;
  PostAuthenticationLoginBanner?: string;
  PreAuthenticationLoginBanner?: string;
  Protocols?: Protocols;
  ProtocolDetails?: ProtocolDetails;
  SecurityPolicyName?: string;
  Tags?: Tags;
  WorkflowDetails?: WorkflowDetails;
  StructuredLogDestinations?: StructuredLogDestinations;
  S3StorageOptions?: S3StorageOptions;
  IpAddressType?: string;
}
export const CreateServerRequest = S.suspend(() =>
  S.Struct({
    Certificate: S.optional(S.String),
    Domain: S.optional(S.String),
    EndpointDetails: S.optional(EndpointDetails),
    EndpointType: S.optional(S.String),
    HostKey: S.optional(SensitiveString),
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateServerRequest",
}) as any as S.Schema<CreateServerRequest>;
export interface DescribeServerResponse {
  Server: DescribedServer;
}
export const DescribeServerResponse = S.suspend(() =>
  S.Struct({ Server: DescribedServer }),
).annotations({
  identifier: "DescribeServerResponse",
}) as any as S.Schema<DescribeServerResponse>;
export interface ListServersResponse {
  NextToken?: string;
  Servers: ListedServers;
}
export const ListServersResponse = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Servers: ListedServers }),
).annotations({
  identifier: "ListServersResponse",
}) as any as S.Schema<ListServersResponse>;
export interface ListUsersResponse {
  NextToken?: string;
  ServerId: string;
  Users: ListedUsers;
}
export const ListUsersResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ServerId: S.String,
    Users: ListedUsers,
  }),
).annotations({
  identifier: "ListUsersResponse",
}) as any as S.Schema<ListUsersResponse>;
export interface DescribeWebAppCustomizationResponse {
  WebAppCustomization: DescribedWebAppCustomization;
}
export const DescribeWebAppCustomizationResponse = S.suspend(() =>
  S.Struct({ WebAppCustomization: DescribedWebAppCustomization }),
).annotations({
  identifier: "DescribeWebAppCustomizationResponse",
}) as any as S.Schema<DescribeWebAppCustomizationResponse>;
export interface CreateWebAppRequest {
  IdentityProviderDetails: (typeof WebAppIdentityProviderDetails)["Type"];
  AccessEndpoint?: string;
  WebAppUnits?: (typeof WebAppUnits)["Type"];
  Tags?: Tags;
  WebAppEndpointPolicy?: string;
  EndpointDetails?: (typeof WebAppEndpointDetails)["Type"];
}
export const CreateWebAppRequest = S.suspend(() =>
  S.Struct({
    IdentityProviderDetails: WebAppIdentityProviderDetails,
    AccessEndpoint: S.optional(S.String),
    WebAppUnits: S.optional(WebAppUnits),
    Tags: S.optional(Tags),
    WebAppEndpointPolicy: S.optional(S.String),
    EndpointDetails: S.optional(WebAppEndpointDetails),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/createWebApp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateWebAppRequest",
}) as any as S.Schema<CreateWebAppRequest>;
export interface UpdateWebAppRequest {
  WebAppId: string;
  IdentityProviderDetails?: (typeof UpdateWebAppIdentityProviderDetails)["Type"];
  AccessEndpoint?: string;
  WebAppUnits?: (typeof WebAppUnits)["Type"];
  EndpointDetails?: (typeof UpdateWebAppEndpointDetails)["Type"];
}
export const UpdateWebAppRequest = S.suspend(() =>
  S.Struct({
    WebAppId: S.String,
    IdentityProviderDetails: S.optional(UpdateWebAppIdentityProviderDetails),
    AccessEndpoint: S.optional(S.String),
    WebAppUnits: S.optional(WebAppUnits),
    EndpointDetails: S.optional(UpdateWebAppEndpointDetails),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/updateWebApp" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateWebAppRequest",
}) as any as S.Schema<UpdateWebAppRequest>;
export interface ListWebAppsResponse {
  NextToken?: string;
  WebApps: ListedWebApps;
}
export const ListWebAppsResponse = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), WebApps: ListedWebApps }),
).annotations({
  identifier: "ListWebAppsResponse",
}) as any as S.Schema<ListWebAppsResponse>;
export interface DescribeWorkflowResponse {
  Workflow: DescribedWorkflow;
}
export const DescribeWorkflowResponse = S.suspend(() =>
  S.Struct({ Workflow: DescribedWorkflow }),
).annotations({
  identifier: "DescribeWorkflowResponse",
}) as any as S.Schema<DescribeWorkflowResponse>;
export interface ListWorkflowsResponse {
  NextToken?: string;
  Workflows: ListedWorkflows;
}
export const ListWorkflowsResponse = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String), Workflows: ListedWorkflows }),
).annotations({
  identifier: "ListWorkflowsResponse",
}) as any as S.Schema<ListWorkflowsResponse>;
export interface LoggingConfiguration {
  LoggingRole?: string;
  LogGroupName?: string;
}
export const LoggingConfiguration = S.suspend(() =>
  S.Struct({
    LoggingRole: S.optional(S.String),
    LogGroupName: S.optional(S.String),
  }),
).annotations({
  identifier: "LoggingConfiguration",
}) as any as S.Schema<LoggingConfiguration>;
export interface SshPublicKey {
  DateImported: Date;
  SshPublicKeyBody: string;
  SshPublicKeyId: string;
}
export const SshPublicKey = S.suspend(() =>
  S.Struct({
    DateImported: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    SshPublicKeyBody: S.String,
    SshPublicKeyId: S.String,
  }),
).annotations({ identifier: "SshPublicKey" }) as any as S.Schema<SshPublicKey>;
export type SshPublicKeys = SshPublicKey[];
export const SshPublicKeys = S.Array(SshPublicKey);
export interface DescribedUser {
  Arn: string;
  HomeDirectory?: string;
  HomeDirectoryMappings?: HomeDirectoryMappings;
  HomeDirectoryType?: string;
  Policy?: string;
  PosixProfile?: PosixProfile;
  Role?: string;
  SshPublicKeys?: SshPublicKeys;
  Tags?: Tags;
  UserName?: string;
}
export const DescribedUser = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DescribedUser",
}) as any as S.Schema<DescribedUser>;
export interface DescribedConnectorVpcLatticeEgressConfig {
  ResourceConfigurationArn: string;
  PortNumber?: number;
}
export const DescribedConnectorVpcLatticeEgressConfig = S.suspend(() =>
  S.Struct({
    ResourceConfigurationArn: S.String,
    PortNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "DescribedConnectorVpcLatticeEgressConfig",
}) as any as S.Schema<DescribedConnectorVpcLatticeEgressConfig>;
export interface DescribedIdentityCenterConfig {
  ApplicationArn?: string;
  InstanceArn?: string;
  Role?: string;
}
export const DescribedIdentityCenterConfig = S.suspend(() =>
  S.Struct({
    ApplicationArn: S.optional(S.String),
    InstanceArn: S.optional(S.String),
    Role: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribedIdentityCenterConfig",
}) as any as S.Schema<DescribedIdentityCenterConfig>;
export interface DescribedWebAppVpcConfig {
  SubnetIds?: SubnetIds;
  VpcId?: string;
  VpcEndpointId?: string;
}
export const DescribedWebAppVpcConfig = S.suspend(() =>
  S.Struct({
    SubnetIds: S.optional(SubnetIds),
    VpcId: S.optional(S.String),
    VpcEndpointId: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribedWebAppVpcConfig",
}) as any as S.Schema<DescribedWebAppVpcConfig>;
export interface CreateConnectorResponse {
  ConnectorId: string;
}
export const CreateConnectorResponse = S.suspend(() =>
  S.Struct({ ConnectorId: S.String }),
).annotations({
  identifier: "CreateConnectorResponse",
}) as any as S.Schema<CreateConnectorResponse>;
export interface UpdateConnectorResponse {
  ConnectorId: string;
}
export const UpdateConnectorResponse = S.suspend(() =>
  S.Struct({ ConnectorId: S.String }),
).annotations({
  identifier: "UpdateConnectorResponse",
}) as any as S.Schema<UpdateConnectorResponse>;
export interface CreateServerResponse {
  ServerId: string;
}
export const CreateServerResponse = S.suspend(() =>
  S.Struct({ ServerId: S.String }),
).annotations({
  identifier: "CreateServerResponse",
}) as any as S.Schema<CreateServerResponse>;
export interface DescribeUserResponse {
  ServerId: string;
  User: DescribedUser;
}
export const DescribeUserResponse = S.suspend(() =>
  S.Struct({ ServerId: S.String, User: DescribedUser }),
).annotations({
  identifier: "DescribeUserResponse",
}) as any as S.Schema<DescribeUserResponse>;
export interface CreateWebAppResponse {
  WebAppId: string;
}
export const CreateWebAppResponse = S.suspend(() =>
  S.Struct({ WebAppId: S.String }),
).annotations({
  identifier: "CreateWebAppResponse",
}) as any as S.Schema<CreateWebAppResponse>;
export interface UpdateWebAppResponse {
  WebAppId: string;
}
export const UpdateWebAppResponse = S.suspend(() =>
  S.Struct({ WebAppId: S.String }),
).annotations({
  identifier: "UpdateWebAppResponse",
}) as any as S.Schema<UpdateWebAppResponse>;
export type DescribedConnectorEgressConfig = {
  VpcLattice: DescribedConnectorVpcLatticeEgressConfig;
};
export const DescribedConnectorEgressConfig = S.Union(
  S.Struct({ VpcLattice: DescribedConnectorVpcLatticeEgressConfig }),
);
export type DescribedWebAppIdentityProviderDetails = {
  IdentityCenterConfig: DescribedIdentityCenterConfig;
};
export const DescribedWebAppIdentityProviderDetails = S.Union(
  S.Struct({ IdentityCenterConfig: DescribedIdentityCenterConfig }),
);
export type DescribedWebAppEndpointDetails = { Vpc: DescribedWebAppVpcConfig };
export const DescribedWebAppEndpointDetails = S.Union(
  S.Struct({ Vpc: DescribedWebAppVpcConfig }),
);
export interface ExecutionError {
  Type: string;
  Message: string;
}
export const ExecutionError = S.suspend(() =>
  S.Struct({ Type: S.String, Message: S.String }),
).annotations({
  identifier: "ExecutionError",
}) as any as S.Schema<ExecutionError>;
export interface DescribedConnector {
  Arn: string;
  ConnectorId?: string;
  Url?: string;
  As2Config?: As2ConnectorConfig;
  AccessRole?: string;
  LoggingRole?: string;
  Tags?: Tags;
  SftpConfig?: SftpConnectorConfig;
  ServiceManagedEgressIpAddresses?: ServiceManagedEgressIpAddresses;
  SecurityPolicyName?: string;
  EgressConfig?: (typeof DescribedConnectorEgressConfig)["Type"];
  EgressType: string;
  ErrorMessage?: string;
  Status: string;
}
export const DescribedConnector = S.suspend(() =>
  S.Struct({
    Arn: S.String,
    ConnectorId: S.optional(S.String),
    Url: S.optional(S.String),
    As2Config: S.optional(As2ConnectorConfig),
    AccessRole: S.optional(S.String),
    LoggingRole: S.optional(S.String),
    Tags: S.optional(Tags),
    SftpConfig: S.optional(SftpConnectorConfig),
    ServiceManagedEgressIpAddresses: S.optional(
      ServiceManagedEgressIpAddresses,
    ),
    SecurityPolicyName: S.optional(S.String),
    EgressConfig: S.optional(DescribedConnectorEgressConfig),
    EgressType: S.String,
    ErrorMessage: S.optional(S.String),
    Status: S.String,
  }),
).annotations({
  identifier: "DescribedConnector",
}) as any as S.Schema<DescribedConnector>;
export interface DescribedWebApp {
  Arn: string;
  WebAppId: string;
  DescribedIdentityProviderDetails?: (typeof DescribedWebAppIdentityProviderDetails)["Type"];
  AccessEndpoint?: string;
  WebAppEndpoint?: string;
  WebAppUnits?: (typeof WebAppUnits)["Type"];
  Tags?: Tags;
  WebAppEndpointPolicy?: string;
  EndpointType?: string;
  DescribedEndpointDetails?: (typeof DescribedWebAppEndpointDetails)["Type"];
}
export const DescribedWebApp = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DescribedWebApp",
}) as any as S.Schema<DescribedWebApp>;
export interface ExecutionStepResult {
  StepType?: string;
  Outputs?: string;
  Error?: ExecutionError;
}
export const ExecutionStepResult = S.suspend(() =>
  S.Struct({
    StepType: S.optional(S.String),
    Outputs: S.optional(S.String),
    Error: S.optional(ExecutionError),
  }),
).annotations({
  identifier: "ExecutionStepResult",
}) as any as S.Schema<ExecutionStepResult>;
export type ExecutionStepResults = ExecutionStepResult[];
export const ExecutionStepResults = S.Array(ExecutionStepResult);
export interface DescribeConnectorResponse {
  Connector: DescribedConnector;
}
export const DescribeConnectorResponse = S.suspend(() =>
  S.Struct({ Connector: DescribedConnector }),
).annotations({
  identifier: "DescribeConnectorResponse",
}) as any as S.Schema<DescribeConnectorResponse>;
export interface DescribeWebAppResponse {
  WebApp: DescribedWebApp;
}
export const DescribeWebAppResponse = S.suspend(() =>
  S.Struct({ WebApp: DescribedWebApp }),
).annotations({
  identifier: "DescribeWebAppResponse",
}) as any as S.Schema<DescribeWebAppResponse>;
export interface CreateWorkflowRequest {
  Description?: string;
  Steps: WorkflowSteps;
  OnExceptionSteps?: WorkflowSteps;
  Tags?: Tags;
}
export const CreateWorkflowRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Steps: WorkflowSteps,
    OnExceptionSteps: S.optional(WorkflowSteps),
    Tags: S.optional(Tags),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateWorkflowRequest",
}) as any as S.Schema<CreateWorkflowRequest>;
export interface ExecutionResults {
  Steps?: ExecutionStepResults;
  OnExceptionSteps?: ExecutionStepResults;
}
export const ExecutionResults = S.suspend(() =>
  S.Struct({
    Steps: S.optional(ExecutionStepResults),
    OnExceptionSteps: S.optional(ExecutionStepResults),
  }),
).annotations({
  identifier: "ExecutionResults",
}) as any as S.Schema<ExecutionResults>;
export interface DescribedExecution {
  ExecutionId?: string;
  InitialFileLocation?: FileLocation;
  ServiceMetadata?: ServiceMetadata;
  ExecutionRole?: string;
  LoggingConfiguration?: LoggingConfiguration;
  PosixProfile?: PosixProfile;
  Status?: string;
  Results?: ExecutionResults;
}
export const DescribedExecution = S.suspend(() =>
  S.Struct({
    ExecutionId: S.optional(S.String),
    InitialFileLocation: S.optional(FileLocation),
    ServiceMetadata: S.optional(ServiceMetadata),
    ExecutionRole: S.optional(S.String),
    LoggingConfiguration: S.optional(LoggingConfiguration),
    PosixProfile: S.optional(PosixProfile),
    Status: S.optional(S.String),
    Results: S.optional(ExecutionResults),
  }),
).annotations({
  identifier: "DescribedExecution",
}) as any as S.Schema<DescribedExecution>;
export interface DescribeExecutionResponse {
  WorkflowId: string;
  Execution: DescribedExecution;
}
export const DescribeExecutionResponse = S.suspend(() =>
  S.Struct({ WorkflowId: S.String, Execution: DescribedExecution }),
).annotations({
  identifier: "DescribeExecutionResponse",
}) as any as S.Schema<DescribeExecutionResponse>;
export interface CreateWorkflowResponse {
  WorkflowId: string;
}
export const CreateWorkflowResponse = S.suspend(() =>
  S.Struct({ WorkflowId: S.String }),
).annotations({
  identifier: "CreateWorkflowResponse",
}) as any as S.Schema<CreateWorkflowResponse>;

//# Errors
export class InternalServiceError extends S.TaggedError<InternalServiceError>()(
  "InternalServiceError",
  { Message: S.String },
).pipe(C.withServerError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessDenied", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, Resource: S.String, ResourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ResourceExistsException extends S.TaggedError<ResourceExistsException>()(
  "ResourceExistsException",
  { Message: S.String, Resource: S.String, ResourceType: S.String },
).pipe(C.withConflictError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "ServiceUnavailable", httpResponseCode: 503 }),
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { RetryAfterSeconds: S.optional(S.String).pipe(T.HttpHeader("Retry-After")) },
).pipe(C.withThrottlingError) {}

//# Operations
/**
 * Lists the security policies that are attached to your servers and SFTP connectors. For more information about security policies, see Working with security policies for servers or Working with security policies for SFTP connectors.
 */
export const listSecurityPolicies: {
  (
    input: ListSecurityPoliciesRequest,
  ): Effect.Effect<
    ListSecurityPoliciesResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSecurityPoliciesRequest,
  ) => Stream.Stream<
    ListSecurityPoliciesResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSecurityPoliciesRequest,
  ) => Stream.Stream<
    SecurityPolicyName,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeUser: (
  input: DescribeUserRequest,
) => Effect.Effect<
  DescribeUserResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listWebApps: {
  (
    input: ListWebAppsRequest,
  ): Effect.Effect<
    ListWebAppsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWebAppsRequest,
  ) => Stream.Stream<
    ListWebAppsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWebAppsRequest,
  ) => Stream.Stream<
    ListedWebApp,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Describes the access that is assigned to the specific file transfer protocol-enabled server, as identified by its `ServerId` property and its `ExternalId`.
 *
 * The response from this call returns the properties of the access that is associated with the `ServerId` value that was specified.
 */
export const describeAccess: (
  input: DescribeAccessRequest,
) => Effect.Effect<
  DescribeAccessResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeHostKey: (
  input: DescribeHostKeyRequest,
) => Effect.Effect<
  DescribeHostKeyResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeSecurityPolicy: (
  input: DescribeSecurityPolicyRequest,
) => Effect.Effect<
  DescribeSecurityPolicyResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSecurityPolicyRequest,
  output: DescribeSecurityPolicyResponse,
  errors: [
    InternalServiceError,
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
export const listFileTransferResults: {
  (
    input: ListFileTransferResultsRequest,
  ): Effect.Effect<
    ListFileTransferResultsResponse,
    | InternalServiceError
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListFileTransferResultsRequest,
  ) => Stream.Stream<
    ListFileTransferResultsResponse,
    | InternalServiceError
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListFileTransferResultsRequest,
  ) => Stream.Stream<
    ConnectorFileTransferResult,
    | InternalServiceError
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const testConnection: (
  input: TestConnectionRequest,
) => Effect.Effect<
  TestConnectionResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeAgreement: (
  input: DescribeAgreementRequest,
) => Effect.Effect<
  DescribeAgreementResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAgreements: {
  (
    input: ListAgreementsRequest,
  ): Effect.Effect<
    ListAgreementsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAgreementsRequest,
  ) => Stream.Stream<
    ListAgreementsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAgreementsRequest,
  ) => Stream.Stream<
    ListedAgreement,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Describes the certificate that's identified by the `CertificateId`.
 *
 * Transfer Family automatically publishes a Amazon CloudWatch metric called `DaysUntilExpiry` for imported certificates. This metric tracks the number of days until the certificate expires based on the `InactiveDate`. The metric is available in the `AWS/Transfer` namespace and includes the `CertificateId` as a dimension.
 */
export const describeCertificate: (
  input: DescribeCertificateRequest,
) => Effect.Effect<
  DescribeCertificateResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listCertificates: {
  (
    input: ListCertificatesRequest,
  ): Effect.Effect<
    ListCertificatesResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCertificatesRequest,
  ) => Stream.Stream<
    ListCertificatesResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCertificatesRequest,
  ) => Stream.Stream<
    ListedCertificate,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists the connectors for the specified Region.
 */
export const listConnectors: {
  (
    input: ListConnectorsRequest,
  ): Effect.Effect<
    ListConnectorsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectorsRequest,
  ) => Stream.Stream<
    ListConnectorsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectorsRequest,
  ) => Stream.Stream<
    ListedConnector,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns the details of the profile that's specified by the `ProfileId`.
 */
export const describeProfile: (
  input: DescribeProfileRequest,
) => Effect.Effect<
  DescribeProfileResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listProfiles: {
  (
    input: ListProfilesRequest,
  ): Effect.Effect<
    ListProfilesResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListProfilesRequest,
  ) => Stream.Stream<
    ListProfilesResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListProfilesRequest,
  ) => Stream.Stream<
    ListedProfile,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Describes a file transfer protocol-enabled server that you specify by passing the `ServerId` parameter.
 *
 * The response contains a description of a server's properties. When you set `EndpointType` to VPC, the response will contain the `EndpointDetails`.
 */
export const describeServer: (
  input: DescribeServerRequest,
) => Effect.Effect<
  DescribeServerResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listUsers: {
  (
    input: ListUsersRequest,
  ): Effect.Effect<
    ListUsersResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUsersRequest,
  ) => Stream.Stream<
    ListUsersResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUsersRequest,
  ) => Stream.Stream<
    ListedUser,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeWebAppCustomization: (
  input: DescribeWebAppCustomizationRequest,
) => Effect.Effect<
  DescribeWebAppCustomizationResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeWebAppCustomizationRequest,
  output: DescribeWebAppCustomizationResponse,
  errors: [
    AccessDeniedException,
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Describes the specified workflow.
 */
export const describeWorkflow: (
  input: DescribeWorkflowRequest,
) => Effect.Effect<
  DescribeWorkflowResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const sendWorkflowStepState: (
  input: SendWorkflowStepStateRequest,
) => Effect.Effect<
  SendWorkflowStepStateResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const startDirectoryListing: (
  input: StartDirectoryListingRequest,
) => Effect.Effect<
  StartDirectoryListingResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartDirectoryListingRequest,
  output: StartDirectoryListingResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
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
export const startFileTransfer: (
  input: StartFileTransferRequest,
) => Effect.Effect<
  StartFileTransferResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startRemoteDelete: (
  input: StartRemoteDeleteRequest,
) => Effect.Effect<
  StartRemoteDeleteResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startRemoteMove: (
  input: StartRemoteMoveRequest,
) => Effect.Effect<
  StartRemoteMoveResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const testIdentityProvider: (
  input: TestIdentityProviderRequest,
) => Effect.Effect<
  TestIdentityProviderResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestIdentityProviderRequest,
  output: TestIdentityProviderResponse,
  errors: [
    InternalServiceError,
    InvalidRequestException,
    ResourceNotFoundException,
    ServiceUnavailableException,
  ],
}));
/**
 * Updates the description for the host key that's specified by the `ServerId` and `HostKeyId` parameters.
 */
export const updateHostKey: (
  input: UpdateHostKeyRequest,
) => Effect.Effect<
  UpdateHostKeyResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importCertificate: (
  input: ImportCertificateRequest,
) => Effect.Effect<
  ImportCertificateResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCertificate: (
  input: UpdateCertificateRequest,
) => Effect.Effect<
  UpdateCertificateResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createProfile: (
  input: CreateProfileRequest,
) => Effect.Effect<
  CreateProfileResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateProfile: (
  input: UpdateProfileRequest,
) => Effect.Effect<
  UpdateProfileResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateUser: (
  input: UpdateUserRequest,
) => Effect.Effect<
  UpdateUserResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteHostKey: (
  input: DeleteHostKeyRequest,
) => Effect.Effect<
  DeleteHostKeyResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSshPublicKey: (
  input: DeleteSshPublicKeyRequest,
) => Effect.Effect<
  DeleteSshPublicKeyResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startServer: (
  input: StartServerRequest,
) => Effect.Effect<
  StartServerResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopServer: (
  input: StopServerRequest,
) => Effect.Effect<
  StopServerResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteAgreement: (
  input: DeleteAgreementRequest,
) => Effect.Effect<
  DeleteAgreementResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCertificate: (
  input: DeleteCertificateRequest,
) => Effect.Effect<
  DeleteCertificateResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteConnector: (
  input: DeleteConnectorRequest,
) => Effect.Effect<
  DeleteConnectorResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteProfile: (
  input: DeleteProfileRequest,
) => Effect.Effect<
  DeleteProfileResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteUser: (
  input: DeleteUserRequest,
) => Effect.Effect<
  DeleteUserResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteServer: (
  input: DeleteServerRequest,
) => Effect.Effect<
  DeleteServerResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteWebApp: (
  input: DeleteWebAppRequest,
) => Effect.Effect<
  DeleteWebAppResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteWorkflow: (
  input: DeleteWorkflowRequest,
) => Effect.Effect<
  DeleteWorkflowResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAccesses: {
  (
    input: ListAccessesRequest,
  ): Effect.Effect<
    ListAccessesResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAccessesRequest,
  ) => Stream.Stream<
    ListAccessesResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAccessesRequest,
  ) => Stream.Stream<
    ListedAccess,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all in-progress executions for the specified workflow.
 *
 * If the specified workflow ID cannot be found, `ListExecutions` returns a `ResourceNotFound` exception.
 */
export const listExecutions: {
  (
    input: ListExecutionsRequest,
  ): Effect.Effect<
    ListExecutionsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExecutionsRequest,
  ) => Stream.Stream<
    ListExecutionsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExecutionsRequest,
  ) => Stream.Stream<
    ListedExecution,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns a list of host keys for the server that's specified by the `ServerId` parameter.
 */
export const listHostKeys: (
  input: ListHostKeysRequest,
) => Effect.Effect<
  ListHostKeysResponse,
  | InternalServiceError
  | InvalidNextTokenException
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWebAppCustomization: (
  input: UpdateWebAppCustomizationRequest,
) => Effect.Effect<
  UpdateWebAppCustomizationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes the `WebAppCustomization` object that corresponds to the web app ID specified.
 */
export const deleteWebAppCustomization: (
  input: DeleteWebAppCustomizationRequest,
) => Effect.Effect<
  DeleteWebAppCustomizationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates an agreement. An agreement is a bilateral trading partner agreement, or partnership, between an Transfer Family server and an AS2 process. The agreement defines the file and message transfer relationship between the server and the AS2 process. To define an agreement, Transfer Family combines a server, local profile, partner profile, certificate, and other attributes.
 *
 * The partner is identified with the `PartnerProfileId`, and the AS2 process is identified with the `LocalProfileId`.
 *
 * Specify *either* `BaseDirectory` or `CustomDirectories`, but not both. Specifying both causes the command to fail.
 */
export const createAgreement: (
  input: CreateAgreementRequest,
) => Effect.Effect<
  CreateAgreementResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateServer: (
  input: UpdateServerRequest,
) => Effect.Effect<
  UpdateServerResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceError
  | InvalidRequestException
  | ResourceExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importSshPublicKey: (
  input: ImportSshPublicKeyRequest,
) => Effect.Effect<
  ImportSshPublicKeyResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAccess: (
  input: UpdateAccessRequest,
) => Effect.Effect<
  UpdateAccessResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateAgreement: (
  input: UpdateAgreementRequest,
) => Effect.Effect<
  UpdateAgreementResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createUser: (
  input: CreateUserRequest,
) => Effect.Effect<
  CreateUserResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createAccess: (
  input: CreateAccessRequest,
) => Effect.Effect<
  CreateAccessResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listServers: {
  (
    input: ListServersRequest,
  ): Effect.Effect<
    ListServersResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServersRequest,
  ) => Stream.Stream<
    ListServersResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServersRequest,
  ) => Stream.Stream<
    ListedServer,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all workflows associated with your Amazon Web Services account for your current region.
 */
export const listWorkflows: {
  (
    input: ListWorkflowsRequest,
  ): Effect.Effect<
    ListWorkflowsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkflowsRequest,
  ) => Stream.Stream<
    ListWorkflowsResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkflowsRequest,
  ) => Stream.Stream<
    ListedWorkflow,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Lists all of the tags associated with the Amazon Resource Name (ARN) that you specify. The resource can be a user, server, or role.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): Effect.Effect<
    ListTagsForResourceResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    ListTagsForResourceResponse,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    Tag,
    | InternalServiceError
    | InvalidNextTokenException
    | InvalidRequestException
    | ServiceUnavailableException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteAccess: (
  input: DeleteAccessRequest,
) => Effect.Effect<
  DeleteAccessResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importHostKey: (
  input: ImportHostKeyRequest,
) => Effect.Effect<
  ImportHostKeyResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createConnector: (
  input: CreateConnectorRequest,
) => Effect.Effect<
  CreateConnectorResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateConnector: (
  input: UpdateConnectorRequest,
) => Effect.Effect<
  UpdateConnectorResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createServer: (
  input: CreateServerRequest,
) => Effect.Effect<
  CreateServerResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceExistsException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWebApp: (
  input: CreateWebAppRequest,
) => Effect.Effect<
  CreateWebAppResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateWebApp: (
  input: UpdateWebAppRequest,
) => Effect.Effect<
  UpdateWebAppResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeConnector: (
  input: DescribeConnectorRequest,
) => Effect.Effect<
  DescribeConnectorResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeWebApp: (
  input: DescribeWebAppRequest,
) => Effect.Effect<
  DescribeWebAppResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeExecution: (
  input: DescribeExecutionRequest,
) => Effect.Effect<
  DescribeExecutionResponse,
  | InternalServiceError
  | InvalidRequestException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createWorkflow: (
  input: CreateWorkflowRequest,
) => Effect.Effect<
  CreateWorkflowResponse,
  | AccessDeniedException
  | InternalServiceError
  | InvalidRequestException
  | ResourceExistsException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
