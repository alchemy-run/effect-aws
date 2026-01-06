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
const ns = T.XmlNamespace(
  "http://directoryservice.amazonaws.com/doc/2015-04-16/",
);
const svc = T.AwsApiService({
  sdkId: "Directory Service",
  serviceShapeName: "DirectoryService_20150416",
});
const auth = T.AwsAuthSigv4({ name: "ds" });
const ver = T.ServiceVersion("2015-04-16");
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
                        url: "https://ds-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://ds-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://ds.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://ds.{Region}.{PartitionResult#dnsSuffix}",
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
export type DirectoryId = string;
export type RegionName = string;
export type ResourceId = string;
export type SchemaExtensionId = string;
export type DirectoryName = string;
export type DirectoryShortName = string;
export type ConnectPassword = string | Redacted.Redacted<string>;
export type Description = string;
export type AliasName = string;
export type ComputerName = string;
export type ComputerPassword = string | Redacted.Redacted<string>;
export type OrganizationalUnitDN = string;
export type RemoteDomainName = string;
export type IpAddr = string;
export type Ipv6Addr = string;
export type Password = string | Redacted.Redacted<string>;
export type SecretArn = string;
export type AssessmentId = string;
export type LogGroupName = string;
export type SnapshotName = string;
export type TrustPassword = string | Redacted.Redacted<string>;
export type SnapshotId = string;
export type TrustId = string;
export type CertificateId = string;
export type TopicName = string;
export type NextToken = string;
export type PageLimit = number;
export type Limit = number;
export type DomainControllerId = string;
export type UserName = string;
export type PcaConnectorArn = string;
export type AssessmentLimit = number;
export type CertificateData = string;
export type CidrIp = string;
export type CidrIpv6 = string;
export type TagKey = string;
export type CustomerUserName = string;
export type UserPassword = string | Redacted.Redacted<string>;
export type Notes = string | Redacted.Redacted<string>;
export type LdifContent = string;
export type DesiredNumberOfDomainControllers = number;
export type VpcId = string;
export type SubnetId = string;
export type TagValue = string;
export type AttributeName = string;
export type AttributeValue = string;
export type Server = string;
export type PortNumber = number;
export type RadiusTimeout = number;
export type RadiusRetries = number;
export type RadiusSharedSecret = string | Redacted.Redacted<string>;
export type RadiusDisplayLabel = string;
export type OCSPUrl = string;
export type TargetId = string;
export type AssessmentInstanceId = string;
export type SecurityGroupId = string;
export type DirectoryConfigurationSettingName = string;
export type DirectoryConfigurationSettingValue = string;
export type ExceptionMessage = string;
export type RequestId = string;
export type CaEnrollmentPolicyStatusReason = string;
export type CustomerId = string;
export type AssessmentStatus = string;
export type AssessmentStatusCode = string;
export type AssessmentStatusReason = string;
export type AssessmentReportType = string;
export type AssessmentVersion = string;
export type CertificateStateReason = string;
export type CertificateCN = string;
export type AccessUrl = string;
export type StageReason = string;
export type AvailabilityZone = string;
export type DomainControllerStatusReason = string;
export type TopicArn = string;
export type LDAPSStatusReason = string;
export type DirectoryConfigurationSettingType = string;
export type DirectoryConfigurationSettingAllowedValues = string;
export type DirectoryConfigurationSettingRequestStatusMessage = string;
export type DirectoryConfigurationSettingDataType = string;
export type TrustStateReason = string;
export type UpdateStatusReason = string;
export type InitiatedBy = string;
export type IpRouteStatusReason = string;
export type SchemaExtensionStatusReason = string;
export type AssessmentValidationCategory = string;
export type AssessmentValidationName = string;
export type AssessmentValidationStatus = string;
export type AssessmentValidationStatusCode = string;
export type AssessmentValidationStatusReason = string;
export type SID = string;

//# Schemas
export interface GetDirectoryLimitsRequest {}
export const GetDirectoryLimitsRequest = S.suspend(() =>
  S.Struct({}).pipe(
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
  identifier: "GetDirectoryLimitsRequest",
}) as any as S.Schema<GetDirectoryLimitsRequest>;
export type DnsIpAddrs = string[];
export const DnsIpAddrs = S.Array(S.String);
export type DnsIpv6Addrs = string[];
export const DnsIpv6Addrs = S.Array(S.String);
export type RemoteDomainNames = string[];
export const RemoteDomainNames = S.Array(S.String);
export type DirectoryIds = string[];
export const DirectoryIds = S.Array(S.String);
export type DomainControllerIds = string[];
export const DomainControllerIds = S.Array(S.String);
export type TopicNames = string[];
export const TopicNames = S.Array(S.String);
export type SnapshotIds = string[];
export const SnapshotIds = S.Array(S.String);
export type TrustIds = string[];
export const TrustIds = S.Array(S.String);
export type CidrIps = string[];
export const CidrIps = S.Array(S.String);
export type CidrIpv6s = string[];
export const CidrIpv6s = S.Array(S.String);
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export interface AcceptSharedDirectoryRequest {
  SharedDirectoryId: string;
}
export const AcceptSharedDirectoryRequest = S.suspend(() =>
  S.Struct({ SharedDirectoryId: S.String }).pipe(
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
  identifier: "AcceptSharedDirectoryRequest",
}) as any as S.Schema<AcceptSharedDirectoryRequest>;
export interface CancelSchemaExtensionRequest {
  DirectoryId: string;
  SchemaExtensionId: string;
}
export const CancelSchemaExtensionRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, SchemaExtensionId: S.String }).pipe(
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
  identifier: "CancelSchemaExtensionRequest",
}) as any as S.Schema<CancelSchemaExtensionRequest>;
export interface CancelSchemaExtensionResult {}
export const CancelSchemaExtensionResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CancelSchemaExtensionResult",
}) as any as S.Schema<CancelSchemaExtensionResult>;
export interface CreateAliasRequest {
  DirectoryId: string;
  Alias: string;
}
export const CreateAliasRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, Alias: S.String }).pipe(
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
  identifier: "CreateAliasRequest",
}) as any as S.Schema<CreateAliasRequest>;
export interface CreateConditionalForwarderRequest {
  DirectoryId: string;
  RemoteDomainName: string;
  DnsIpAddrs?: DnsIpAddrs;
  DnsIpv6Addrs?: DnsIpv6Addrs;
}
export const CreateConditionalForwarderRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    RemoteDomainName: S.String,
    DnsIpAddrs: S.optional(DnsIpAddrs),
    DnsIpv6Addrs: S.optional(DnsIpv6Addrs),
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
  identifier: "CreateConditionalForwarderRequest",
}) as any as S.Schema<CreateConditionalForwarderRequest>;
export interface CreateConditionalForwarderResult {}
export const CreateConditionalForwarderResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateConditionalForwarderResult",
}) as any as S.Schema<CreateConditionalForwarderResult>;
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export interface DirectoryVpcSettings {
  VpcId: string;
  SubnetIds: SubnetIds;
}
export const DirectoryVpcSettings = S.suspend(() =>
  S.Struct({ VpcId: S.String, SubnetIds: SubnetIds }),
).annotations({
  identifier: "DirectoryVpcSettings",
}) as any as S.Schema<DirectoryVpcSettings>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface CreateDirectoryRequest {
  Name: string;
  ShortName?: string;
  Password: string | Redacted.Redacted<string>;
  Description?: string;
  Size: string;
  VpcSettings?: DirectoryVpcSettings;
  Tags?: Tags;
  NetworkType?: string;
}
export const CreateDirectoryRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ShortName: S.optional(S.String),
    Password: SensitiveString,
    Description: S.optional(S.String),
    Size: S.String,
    VpcSettings: S.optional(DirectoryVpcSettings),
    Tags: S.optional(Tags),
    NetworkType: S.optional(S.String),
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
  identifier: "CreateDirectoryRequest",
}) as any as S.Schema<CreateDirectoryRequest>;
export interface CreateHybridADRequest {
  SecretArn: string;
  AssessmentId: string;
  Tags?: Tags;
}
export const CreateHybridADRequest = S.suspend(() =>
  S.Struct({
    SecretArn: S.String,
    AssessmentId: S.String,
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
  identifier: "CreateHybridADRequest",
}) as any as S.Schema<CreateHybridADRequest>;
export interface CreateLogSubscriptionRequest {
  DirectoryId: string;
  LogGroupName: string;
}
export const CreateLogSubscriptionRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, LogGroupName: S.String }).pipe(
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
  identifier: "CreateLogSubscriptionRequest",
}) as any as S.Schema<CreateLogSubscriptionRequest>;
export interface CreateLogSubscriptionResult {}
export const CreateLogSubscriptionResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "CreateLogSubscriptionResult",
}) as any as S.Schema<CreateLogSubscriptionResult>;
export interface CreateMicrosoftADRequest {
  Name: string;
  ShortName?: string;
  Password: string | Redacted.Redacted<string>;
  Description?: string;
  VpcSettings: DirectoryVpcSettings;
  Edition?: string;
  Tags?: Tags;
  NetworkType?: string;
}
export const CreateMicrosoftADRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ShortName: S.optional(S.String),
    Password: SensitiveString,
    Description: S.optional(S.String),
    VpcSettings: DirectoryVpcSettings,
    Edition: S.optional(S.String),
    Tags: S.optional(Tags),
    NetworkType: S.optional(S.String),
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
  identifier: "CreateMicrosoftADRequest",
}) as any as S.Schema<CreateMicrosoftADRequest>;
export interface CreateSnapshotRequest {
  DirectoryId: string;
  Name?: string;
}
export const CreateSnapshotRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, Name: S.optional(S.String) }).pipe(
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
  identifier: "CreateSnapshotRequest",
}) as any as S.Schema<CreateSnapshotRequest>;
export interface CreateTrustRequest {
  DirectoryId: string;
  RemoteDomainName: string;
  TrustPassword: string | Redacted.Redacted<string>;
  TrustDirection: string;
  TrustType?: string;
  ConditionalForwarderIpAddrs?: DnsIpAddrs;
  ConditionalForwarderIpv6Addrs?: DnsIpv6Addrs;
  SelectiveAuth?: string;
}
export const CreateTrustRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    RemoteDomainName: S.String,
    TrustPassword: SensitiveString,
    TrustDirection: S.String,
    TrustType: S.optional(S.String),
    ConditionalForwarderIpAddrs: S.optional(DnsIpAddrs),
    ConditionalForwarderIpv6Addrs: S.optional(DnsIpv6Addrs),
    SelectiveAuth: S.optional(S.String),
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
  identifier: "CreateTrustRequest",
}) as any as S.Schema<CreateTrustRequest>;
export interface DeleteADAssessmentRequest {
  AssessmentId: string;
}
export const DeleteADAssessmentRequest = S.suspend(() =>
  S.Struct({ AssessmentId: S.String }).pipe(
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
  identifier: "DeleteADAssessmentRequest",
}) as any as S.Schema<DeleteADAssessmentRequest>;
export interface DeleteConditionalForwarderRequest {
  DirectoryId: string;
  RemoteDomainName: string;
}
export const DeleteConditionalForwarderRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, RemoteDomainName: S.String }).pipe(
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
  identifier: "DeleteConditionalForwarderRequest",
}) as any as S.Schema<DeleteConditionalForwarderRequest>;
export interface DeleteConditionalForwarderResult {}
export const DeleteConditionalForwarderResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteConditionalForwarderResult",
}) as any as S.Schema<DeleteConditionalForwarderResult>;
export interface DeleteDirectoryRequest {
  DirectoryId: string;
}
export const DeleteDirectoryRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String }).pipe(
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
  identifier: "DeleteDirectoryRequest",
}) as any as S.Schema<DeleteDirectoryRequest>;
export interface DeleteLogSubscriptionRequest {
  DirectoryId: string;
}
export const DeleteLogSubscriptionRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String }).pipe(
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
  identifier: "DeleteLogSubscriptionRequest",
}) as any as S.Schema<DeleteLogSubscriptionRequest>;
export interface DeleteLogSubscriptionResult {}
export const DeleteLogSubscriptionResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteLogSubscriptionResult",
}) as any as S.Schema<DeleteLogSubscriptionResult>;
export interface DeleteSnapshotRequest {
  SnapshotId: string;
}
export const DeleteSnapshotRequest = S.suspend(() =>
  S.Struct({ SnapshotId: S.String }).pipe(
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
  identifier: "DeleteSnapshotRequest",
}) as any as S.Schema<DeleteSnapshotRequest>;
export interface DeleteTrustRequest {
  TrustId: string;
  DeleteAssociatedConditionalForwarder?: boolean;
}
export const DeleteTrustRequest = S.suspend(() =>
  S.Struct({
    TrustId: S.String,
    DeleteAssociatedConditionalForwarder: S.optional(S.Boolean),
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
  identifier: "DeleteTrustRequest",
}) as any as S.Schema<DeleteTrustRequest>;
export interface DeregisterCertificateRequest {
  DirectoryId: string;
  CertificateId: string;
}
export const DeregisterCertificateRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, CertificateId: S.String }).pipe(
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
  identifier: "DeregisterCertificateRequest",
}) as any as S.Schema<DeregisterCertificateRequest>;
export interface DeregisterCertificateResult {}
export const DeregisterCertificateResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeregisterCertificateResult",
}) as any as S.Schema<DeregisterCertificateResult>;
export interface DeregisterEventTopicRequest {
  DirectoryId: string;
  TopicName: string;
}
export const DeregisterEventTopicRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, TopicName: S.String }).pipe(
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
  identifier: "DeregisterEventTopicRequest",
}) as any as S.Schema<DeregisterEventTopicRequest>;
export interface DeregisterEventTopicResult {}
export const DeregisterEventTopicResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeregisterEventTopicResult",
}) as any as S.Schema<DeregisterEventTopicResult>;
export interface DescribeADAssessmentRequest {
  AssessmentId: string;
}
export const DescribeADAssessmentRequest = S.suspend(() =>
  S.Struct({ AssessmentId: S.String }).pipe(
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
  identifier: "DescribeADAssessmentRequest",
}) as any as S.Schema<DescribeADAssessmentRequest>;
export interface DescribeCAEnrollmentPolicyRequest {
  DirectoryId: string;
}
export const DescribeCAEnrollmentPolicyRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String }).pipe(
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
  identifier: "DescribeCAEnrollmentPolicyRequest",
}) as any as S.Schema<DescribeCAEnrollmentPolicyRequest>;
export interface DescribeCertificateRequest {
  DirectoryId: string;
  CertificateId: string;
}
export const DescribeCertificateRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, CertificateId: S.String }).pipe(
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
  identifier: "DescribeCertificateRequest",
}) as any as S.Schema<DescribeCertificateRequest>;
export interface DescribeClientAuthenticationSettingsRequest {
  DirectoryId: string;
  Type?: string;
  NextToken?: string;
  Limit?: number;
}
export const DescribeClientAuthenticationSettingsRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    Type: S.optional(S.String),
    NextToken: S.optional(S.String),
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
  identifier: "DescribeClientAuthenticationSettingsRequest",
}) as any as S.Schema<DescribeClientAuthenticationSettingsRequest>;
export interface DescribeConditionalForwardersRequest {
  DirectoryId: string;
  RemoteDomainNames?: RemoteDomainNames;
}
export const DescribeConditionalForwardersRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    RemoteDomainNames: S.optional(RemoteDomainNames),
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
  identifier: "DescribeConditionalForwardersRequest",
}) as any as S.Schema<DescribeConditionalForwardersRequest>;
export interface DescribeDirectoriesRequest {
  DirectoryIds?: DirectoryIds;
  NextToken?: string;
  Limit?: number;
}
export const DescribeDirectoriesRequest = S.suspend(() =>
  S.Struct({
    DirectoryIds: S.optional(DirectoryIds),
    NextToken: S.optional(S.String),
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
  identifier: "DescribeDirectoriesRequest",
}) as any as S.Schema<DescribeDirectoriesRequest>;
export interface DescribeDirectoryDataAccessRequest {
  DirectoryId: string;
}
export const DescribeDirectoryDataAccessRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String }).pipe(
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
  identifier: "DescribeDirectoryDataAccessRequest",
}) as any as S.Schema<DescribeDirectoryDataAccessRequest>;
export interface DescribeDomainControllersRequest {
  DirectoryId: string;
  DomainControllerIds?: DomainControllerIds;
  NextToken?: string;
  Limit?: number;
}
export const DescribeDomainControllersRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    DomainControllerIds: S.optional(DomainControllerIds),
    NextToken: S.optional(S.String),
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
  identifier: "DescribeDomainControllersRequest",
}) as any as S.Schema<DescribeDomainControllersRequest>;
export interface DescribeEventTopicsRequest {
  DirectoryId?: string;
  TopicNames?: TopicNames;
}
export const DescribeEventTopicsRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    TopicNames: S.optional(TopicNames),
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
  identifier: "DescribeEventTopicsRequest",
}) as any as S.Schema<DescribeEventTopicsRequest>;
export interface DescribeHybridADUpdateRequest {
  DirectoryId: string;
  UpdateType?: string;
  NextToken?: string;
}
export const DescribeHybridADUpdateRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    UpdateType: S.optional(S.String),
    NextToken: S.optional(S.String),
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
  identifier: "DescribeHybridADUpdateRequest",
}) as any as S.Schema<DescribeHybridADUpdateRequest>;
export interface DescribeLDAPSSettingsRequest {
  DirectoryId: string;
  Type?: string;
  NextToken?: string;
  Limit?: number;
}
export const DescribeLDAPSSettingsRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    Type: S.optional(S.String),
    NextToken: S.optional(S.String),
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
  identifier: "DescribeLDAPSSettingsRequest",
}) as any as S.Schema<DescribeLDAPSSettingsRequest>;
export interface DescribeRegionsRequest {
  DirectoryId: string;
  RegionName?: string;
  NextToken?: string;
}
export const DescribeRegionsRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    RegionName: S.optional(S.String),
    NextToken: S.optional(S.String),
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
  identifier: "DescribeRegionsRequest",
}) as any as S.Schema<DescribeRegionsRequest>;
export interface DescribeSettingsRequest {
  DirectoryId: string;
  Status?: string;
  NextToken?: string;
}
export const DescribeSettingsRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    Status: S.optional(S.String),
    NextToken: S.optional(S.String),
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
  identifier: "DescribeSettingsRequest",
}) as any as S.Schema<DescribeSettingsRequest>;
export interface DescribeSharedDirectoriesRequest {
  OwnerDirectoryId: string;
  SharedDirectoryIds?: DirectoryIds;
  NextToken?: string;
  Limit?: number;
}
export const DescribeSharedDirectoriesRequest = S.suspend(() =>
  S.Struct({
    OwnerDirectoryId: S.String,
    SharedDirectoryIds: S.optional(DirectoryIds),
    NextToken: S.optional(S.String),
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
  identifier: "DescribeSharedDirectoriesRequest",
}) as any as S.Schema<DescribeSharedDirectoriesRequest>;
export interface DescribeSnapshotsRequest {
  DirectoryId?: string;
  SnapshotIds?: SnapshotIds;
  NextToken?: string;
  Limit?: number;
}
export const DescribeSnapshotsRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    SnapshotIds: S.optional(SnapshotIds),
    NextToken: S.optional(S.String),
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
  identifier: "DescribeSnapshotsRequest",
}) as any as S.Schema<DescribeSnapshotsRequest>;
export interface DescribeTrustsRequest {
  DirectoryId?: string;
  TrustIds?: TrustIds;
  NextToken?: string;
  Limit?: number;
}
export const DescribeTrustsRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    TrustIds: S.optional(TrustIds),
    NextToken: S.optional(S.String),
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
  identifier: "DescribeTrustsRequest",
}) as any as S.Schema<DescribeTrustsRequest>;
export interface DescribeUpdateDirectoryRequest {
  DirectoryId: string;
  UpdateType: string;
  RegionName?: string;
  NextToken?: string;
}
export const DescribeUpdateDirectoryRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    UpdateType: S.String,
    RegionName: S.optional(S.String),
    NextToken: S.optional(S.String),
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
  identifier: "DescribeUpdateDirectoryRequest",
}) as any as S.Schema<DescribeUpdateDirectoryRequest>;
export interface DisableCAEnrollmentPolicyRequest {
  DirectoryId: string;
}
export const DisableCAEnrollmentPolicyRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String }).pipe(
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
  identifier: "DisableCAEnrollmentPolicyRequest",
}) as any as S.Schema<DisableCAEnrollmentPolicyRequest>;
export interface DisableCAEnrollmentPolicyResult {}
export const DisableCAEnrollmentPolicyResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableCAEnrollmentPolicyResult",
}) as any as S.Schema<DisableCAEnrollmentPolicyResult>;
export interface DisableClientAuthenticationRequest {
  DirectoryId: string;
  Type: string;
}
export const DisableClientAuthenticationRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, Type: S.String }).pipe(
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
  identifier: "DisableClientAuthenticationRequest",
}) as any as S.Schema<DisableClientAuthenticationRequest>;
export interface DisableClientAuthenticationResult {}
export const DisableClientAuthenticationResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableClientAuthenticationResult",
}) as any as S.Schema<DisableClientAuthenticationResult>;
export interface DisableDirectoryDataAccessRequest {
  DirectoryId: string;
}
export const DisableDirectoryDataAccessRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String }).pipe(
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
  identifier: "DisableDirectoryDataAccessRequest",
}) as any as S.Schema<DisableDirectoryDataAccessRequest>;
export interface DisableDirectoryDataAccessResult {}
export const DisableDirectoryDataAccessResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableDirectoryDataAccessResult",
}) as any as S.Schema<DisableDirectoryDataAccessResult>;
export interface DisableLDAPSRequest {
  DirectoryId: string;
  Type: string;
}
export const DisableLDAPSRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, Type: S.String }).pipe(
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
  identifier: "DisableLDAPSRequest",
}) as any as S.Schema<DisableLDAPSRequest>;
export interface DisableLDAPSResult {}
export const DisableLDAPSResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableLDAPSResult",
}) as any as S.Schema<DisableLDAPSResult>;
export interface DisableRadiusRequest {
  DirectoryId: string;
}
export const DisableRadiusRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String }).pipe(
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
  identifier: "DisableRadiusRequest",
}) as any as S.Schema<DisableRadiusRequest>;
export interface DisableRadiusResult {}
export const DisableRadiusResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableRadiusResult",
}) as any as S.Schema<DisableRadiusResult>;
export interface DisableSsoRequest {
  DirectoryId: string;
  UserName?: string;
  Password?: string | Redacted.Redacted<string>;
}
export const DisableSsoRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    UserName: S.optional(S.String),
    Password: S.optional(SensitiveString),
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
  identifier: "DisableSsoRequest",
}) as any as S.Schema<DisableSsoRequest>;
export interface DisableSsoResult {}
export const DisableSsoResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DisableSsoResult",
}) as any as S.Schema<DisableSsoResult>;
export interface EnableCAEnrollmentPolicyRequest {
  DirectoryId: string;
  PcaConnectorArn: string;
}
export const EnableCAEnrollmentPolicyRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, PcaConnectorArn: S.String }).pipe(
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
  identifier: "EnableCAEnrollmentPolicyRequest",
}) as any as S.Schema<EnableCAEnrollmentPolicyRequest>;
export interface EnableCAEnrollmentPolicyResult {}
export const EnableCAEnrollmentPolicyResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableCAEnrollmentPolicyResult",
}) as any as S.Schema<EnableCAEnrollmentPolicyResult>;
export interface EnableClientAuthenticationRequest {
  DirectoryId: string;
  Type: string;
}
export const EnableClientAuthenticationRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, Type: S.String }).pipe(
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
  identifier: "EnableClientAuthenticationRequest",
}) as any as S.Schema<EnableClientAuthenticationRequest>;
export interface EnableClientAuthenticationResult {}
export const EnableClientAuthenticationResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableClientAuthenticationResult",
}) as any as S.Schema<EnableClientAuthenticationResult>;
export interface EnableDirectoryDataAccessRequest {
  DirectoryId: string;
}
export const EnableDirectoryDataAccessRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String }).pipe(
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
  identifier: "EnableDirectoryDataAccessRequest",
}) as any as S.Schema<EnableDirectoryDataAccessRequest>;
export interface EnableDirectoryDataAccessResult {}
export const EnableDirectoryDataAccessResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableDirectoryDataAccessResult",
}) as any as S.Schema<EnableDirectoryDataAccessResult>;
export interface EnableLDAPSRequest {
  DirectoryId: string;
  Type: string;
}
export const EnableLDAPSRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, Type: S.String }).pipe(
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
  identifier: "EnableLDAPSRequest",
}) as any as S.Schema<EnableLDAPSRequest>;
export interface EnableLDAPSResult {}
export const EnableLDAPSResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableLDAPSResult",
}) as any as S.Schema<EnableLDAPSResult>;
export interface EnableSsoRequest {
  DirectoryId: string;
  UserName?: string;
  Password?: string | Redacted.Redacted<string>;
}
export const EnableSsoRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    UserName: S.optional(S.String),
    Password: S.optional(SensitiveString),
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
  identifier: "EnableSsoRequest",
}) as any as S.Schema<EnableSsoRequest>;
export interface EnableSsoResult {}
export const EnableSsoResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableSsoResult",
}) as any as S.Schema<EnableSsoResult>;
export interface GetSnapshotLimitsRequest {
  DirectoryId: string;
}
export const GetSnapshotLimitsRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String }).pipe(
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
  identifier: "GetSnapshotLimitsRequest",
}) as any as S.Schema<GetSnapshotLimitsRequest>;
export interface ListADAssessmentsRequest {
  DirectoryId?: string;
  NextToken?: string;
  Limit?: number;
}
export const ListADAssessmentsRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    NextToken: S.optional(S.String),
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
  identifier: "ListADAssessmentsRequest",
}) as any as S.Schema<ListADAssessmentsRequest>;
export interface ListCertificatesRequest {
  DirectoryId: string;
  NextToken?: string;
  Limit?: number;
}
export const ListCertificatesRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    NextToken: S.optional(S.String),
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
  identifier: "ListCertificatesRequest",
}) as any as S.Schema<ListCertificatesRequest>;
export interface ListIpRoutesRequest {
  DirectoryId: string;
  NextToken?: string;
  Limit?: number;
}
export const ListIpRoutesRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    NextToken: S.optional(S.String),
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
  identifier: "ListIpRoutesRequest",
}) as any as S.Schema<ListIpRoutesRequest>;
export interface ListLogSubscriptionsRequest {
  DirectoryId?: string;
  NextToken?: string;
  Limit?: number;
}
export const ListLogSubscriptionsRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    NextToken: S.optional(S.String),
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
  identifier: "ListLogSubscriptionsRequest",
}) as any as S.Schema<ListLogSubscriptionsRequest>;
export interface ListSchemaExtensionsRequest {
  DirectoryId: string;
  NextToken?: string;
  Limit?: number;
}
export const ListSchemaExtensionsRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    NextToken: S.optional(S.String),
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
  identifier: "ListSchemaExtensionsRequest",
}) as any as S.Schema<ListSchemaExtensionsRequest>;
export interface ListTagsForResourceRequest {
  ResourceId: string;
  NextToken?: string;
  Limit?: number;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceId: S.String,
    NextToken: S.optional(S.String),
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
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface RegisterEventTopicRequest {
  DirectoryId: string;
  TopicName: string;
}
export const RegisterEventTopicRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, TopicName: S.String }).pipe(
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
  identifier: "RegisterEventTopicRequest",
}) as any as S.Schema<RegisterEventTopicRequest>;
export interface RegisterEventTopicResult {}
export const RegisterEventTopicResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RegisterEventTopicResult",
}) as any as S.Schema<RegisterEventTopicResult>;
export interface RejectSharedDirectoryRequest {
  SharedDirectoryId: string;
}
export const RejectSharedDirectoryRequest = S.suspend(() =>
  S.Struct({ SharedDirectoryId: S.String }).pipe(
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
  identifier: "RejectSharedDirectoryRequest",
}) as any as S.Schema<RejectSharedDirectoryRequest>;
export interface RemoveIpRoutesRequest {
  DirectoryId: string;
  CidrIps?: CidrIps;
  CidrIpv6s?: CidrIpv6s;
}
export const RemoveIpRoutesRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    CidrIps: S.optional(CidrIps),
    CidrIpv6s: S.optional(CidrIpv6s),
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
  identifier: "RemoveIpRoutesRequest",
}) as any as S.Schema<RemoveIpRoutesRequest>;
export interface RemoveIpRoutesResult {}
export const RemoveIpRoutesResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveIpRoutesResult",
}) as any as S.Schema<RemoveIpRoutesResult>;
export interface RemoveRegionRequest {
  DirectoryId: string;
}
export const RemoveRegionRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String }).pipe(
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
  identifier: "RemoveRegionRequest",
}) as any as S.Schema<RemoveRegionRequest>;
export interface RemoveRegionResult {}
export const RemoveRegionResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveRegionResult",
}) as any as S.Schema<RemoveRegionResult>;
export interface RemoveTagsFromResourceRequest {
  ResourceId: string;
  TagKeys: TagKeys;
}
export const RemoveTagsFromResourceRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String, TagKeys: TagKeys }).pipe(
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
  identifier: "RemoveTagsFromResourceRequest",
}) as any as S.Schema<RemoveTagsFromResourceRequest>;
export interface RemoveTagsFromResourceResult {}
export const RemoveTagsFromResourceResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RemoveTagsFromResourceResult",
}) as any as S.Schema<RemoveTagsFromResourceResult>;
export interface ResetUserPasswordRequest {
  DirectoryId: string;
  UserName: string;
  NewPassword: string | Redacted.Redacted<string>;
}
export const ResetUserPasswordRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    UserName: S.String,
    NewPassword: SensitiveString,
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
  identifier: "ResetUserPasswordRequest",
}) as any as S.Schema<ResetUserPasswordRequest>;
export interface ResetUserPasswordResult {}
export const ResetUserPasswordResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "ResetUserPasswordResult",
}) as any as S.Schema<ResetUserPasswordResult>;
export interface RestoreFromSnapshotRequest {
  SnapshotId: string;
}
export const RestoreFromSnapshotRequest = S.suspend(() =>
  S.Struct({ SnapshotId: S.String }).pipe(
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
  identifier: "RestoreFromSnapshotRequest",
}) as any as S.Schema<RestoreFromSnapshotRequest>;
export interface RestoreFromSnapshotResult {}
export const RestoreFromSnapshotResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "RestoreFromSnapshotResult",
}) as any as S.Schema<RestoreFromSnapshotResult>;
export interface StartSchemaExtensionRequest {
  DirectoryId: string;
  CreateSnapshotBeforeSchemaExtension: boolean;
  LdifContent: string;
  Description: string;
}
export const StartSchemaExtensionRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    CreateSnapshotBeforeSchemaExtension: S.Boolean,
    LdifContent: S.String,
    Description: S.String,
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
  identifier: "StartSchemaExtensionRequest",
}) as any as S.Schema<StartSchemaExtensionRequest>;
export interface UpdateConditionalForwarderRequest {
  DirectoryId: string;
  RemoteDomainName: string;
  DnsIpAddrs?: DnsIpAddrs;
  DnsIpv6Addrs?: DnsIpv6Addrs;
}
export const UpdateConditionalForwarderRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    RemoteDomainName: S.String,
    DnsIpAddrs: S.optional(DnsIpAddrs),
    DnsIpv6Addrs: S.optional(DnsIpv6Addrs),
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
  identifier: "UpdateConditionalForwarderRequest",
}) as any as S.Schema<UpdateConditionalForwarderRequest>;
export interface UpdateConditionalForwarderResult {}
export const UpdateConditionalForwarderResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateConditionalForwarderResult",
}) as any as S.Schema<UpdateConditionalForwarderResult>;
export interface UpdateNumberOfDomainControllersRequest {
  DirectoryId: string;
  DesiredNumber: number;
}
export const UpdateNumberOfDomainControllersRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, DesiredNumber: S.Number }).pipe(
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
  identifier: "UpdateNumberOfDomainControllersRequest",
}) as any as S.Schema<UpdateNumberOfDomainControllersRequest>;
export interface UpdateNumberOfDomainControllersResult {}
export const UpdateNumberOfDomainControllersResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateNumberOfDomainControllersResult",
}) as any as S.Schema<UpdateNumberOfDomainControllersResult>;
export type Servers = string[];
export const Servers = S.Array(S.String);
export interface RadiusSettings {
  RadiusServers?: Servers;
  RadiusServersIpv6?: Servers;
  RadiusPort?: number;
  RadiusTimeout?: number;
  RadiusRetries?: number;
  SharedSecret?: string | Redacted.Redacted<string>;
  AuthenticationProtocol?: string;
  DisplayLabel?: string;
  UseSameUsername?: boolean;
}
export const RadiusSettings = S.suspend(() =>
  S.Struct({
    RadiusServers: S.optional(Servers),
    RadiusServersIpv6: S.optional(Servers),
    RadiusPort: S.optional(S.Number),
    RadiusTimeout: S.optional(S.Number),
    RadiusRetries: S.optional(S.Number),
    SharedSecret: S.optional(SensitiveString),
    AuthenticationProtocol: S.optional(S.String),
    DisplayLabel: S.optional(S.String),
    UseSameUsername: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RadiusSettings",
}) as any as S.Schema<RadiusSettings>;
export interface UpdateRadiusRequest {
  DirectoryId: string;
  RadiusSettings: RadiusSettings;
}
export const UpdateRadiusRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, RadiusSettings: RadiusSettings }).pipe(
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
  identifier: "UpdateRadiusRequest",
}) as any as S.Schema<UpdateRadiusRequest>;
export interface UpdateRadiusResult {}
export const UpdateRadiusResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateRadiusResult",
}) as any as S.Schema<UpdateRadiusResult>;
export interface UpdateTrustRequest {
  TrustId: string;
  SelectiveAuth?: string;
}
export const UpdateTrustRequest = S.suspend(() =>
  S.Struct({ TrustId: S.String, SelectiveAuth: S.optional(S.String) }).pipe(
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
  identifier: "UpdateTrustRequest",
}) as any as S.Schema<UpdateTrustRequest>;
export interface VerifyTrustRequest {
  TrustId: string;
}
export const VerifyTrustRequest = S.suspend(() =>
  S.Struct({ TrustId: S.String }).pipe(
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
  identifier: "VerifyTrustRequest",
}) as any as S.Schema<VerifyTrustRequest>;
export type CustomerDnsIps = string[];
export const CustomerDnsIps = S.Array(S.String);
export type AssessmentInstanceIds = string[];
export const AssessmentInstanceIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export interface IpRoute {
  CidrIp?: string;
  CidrIpv6?: string;
  Description?: string;
}
export const IpRoute = S.suspend(() =>
  S.Struct({
    CidrIp: S.optional(S.String),
    CidrIpv6: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "IpRoute" }) as any as S.Schema<IpRoute>;
export type IpRoutes = IpRoute[];
export const IpRoutes = S.Array(IpRoute);
export interface DirectoryConnectSettings {
  VpcId: string;
  SubnetIds: SubnetIds;
  CustomerDnsIps?: DnsIpAddrs;
  CustomerDnsIpsV6?: DnsIpv6Addrs;
  CustomerUserName: string;
}
export const DirectoryConnectSettings = S.suspend(() =>
  S.Struct({
    VpcId: S.String,
    SubnetIds: SubnetIds,
    CustomerDnsIps: S.optional(DnsIpAddrs),
    CustomerDnsIpsV6: S.optional(DnsIpv6Addrs),
    CustomerUserName: S.String,
  }),
).annotations({
  identifier: "DirectoryConnectSettings",
}) as any as S.Schema<DirectoryConnectSettings>;
export interface Attribute {
  Name?: string;
  Value?: string;
}
export const Attribute = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Attribute" }) as any as S.Schema<Attribute>;
export type Attributes = Attribute[];
export const Attributes = S.Array(Attribute);
export interface SharedDirectory {
  OwnerAccountId?: string;
  OwnerDirectoryId?: string;
  ShareMethod?: string;
  SharedAccountId?: string;
  SharedDirectoryId?: string;
  ShareStatus?: string;
  ShareNotes?: string | Redacted.Redacted<string>;
  CreatedDateTime?: Date;
  LastUpdatedDateTime?: Date;
}
export const SharedDirectory = S.suspend(() =>
  S.Struct({
    OwnerAccountId: S.optional(S.String),
    OwnerDirectoryId: S.optional(S.String),
    ShareMethod: S.optional(S.String),
    SharedAccountId: S.optional(S.String),
    SharedDirectoryId: S.optional(S.String),
    ShareStatus: S.optional(S.String),
    ShareNotes: S.optional(SensitiveString),
    CreatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "SharedDirectory",
}) as any as S.Schema<SharedDirectory>;
export type SharedDirectories = SharedDirectory[];
export const SharedDirectories = S.Array(SharedDirectory);
export interface DirectoryLimits {
  CloudOnlyDirectoriesLimit?: number;
  CloudOnlyDirectoriesCurrentCount?: number;
  CloudOnlyDirectoriesLimitReached?: boolean;
  CloudOnlyMicrosoftADLimit?: number;
  CloudOnlyMicrosoftADCurrentCount?: number;
  CloudOnlyMicrosoftADLimitReached?: boolean;
  ConnectedDirectoriesLimit?: number;
  ConnectedDirectoriesCurrentCount?: number;
  ConnectedDirectoriesLimitReached?: boolean;
}
export const DirectoryLimits = S.suspend(() =>
  S.Struct({
    CloudOnlyDirectoriesLimit: S.optional(S.Number),
    CloudOnlyDirectoriesCurrentCount: S.optional(S.Number),
    CloudOnlyDirectoriesLimitReached: S.optional(S.Boolean),
    CloudOnlyMicrosoftADLimit: S.optional(S.Number),
    CloudOnlyMicrosoftADCurrentCount: S.optional(S.Number),
    CloudOnlyMicrosoftADLimitReached: S.optional(S.Boolean),
    ConnectedDirectoriesLimit: S.optional(S.Number),
    ConnectedDirectoriesCurrentCount: S.optional(S.Number),
    ConnectedDirectoriesLimitReached: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DirectoryLimits",
}) as any as S.Schema<DirectoryLimits>;
export interface ClientCertAuthSettings {
  OCSPUrl?: string;
}
export const ClientCertAuthSettings = S.suspend(() =>
  S.Struct({ OCSPUrl: S.optional(S.String) }),
).annotations({
  identifier: "ClientCertAuthSettings",
}) as any as S.Schema<ClientCertAuthSettings>;
export interface ShareTarget {
  Id: string;
  Type: string;
}
export const ShareTarget = S.suspend(() =>
  S.Struct({ Id: S.String, Type: S.String }),
).annotations({ identifier: "ShareTarget" }) as any as S.Schema<ShareTarget>;
export interface AssessmentConfiguration {
  CustomerDnsIps: CustomerDnsIps;
  DnsName: string;
  VpcSettings: DirectoryVpcSettings;
  InstanceIds: AssessmentInstanceIds;
  SecurityGroupIds?: SecurityGroupIds;
}
export const AssessmentConfiguration = S.suspend(() =>
  S.Struct({
    CustomerDnsIps: CustomerDnsIps,
    DnsName: S.String,
    VpcSettings: DirectoryVpcSettings,
    InstanceIds: AssessmentInstanceIds,
    SecurityGroupIds: S.optional(SecurityGroupIds),
  }),
).annotations({
  identifier: "AssessmentConfiguration",
}) as any as S.Schema<AssessmentConfiguration>;
export interface UnshareTarget {
  Id: string;
  Type: string;
}
export const UnshareTarget = S.suspend(() =>
  S.Struct({ Id: S.String, Type: S.String }),
).annotations({
  identifier: "UnshareTarget",
}) as any as S.Schema<UnshareTarget>;
export interface OSUpdateSettings {
  OSVersion?: string;
}
export const OSUpdateSettings = S.suspend(() =>
  S.Struct({ OSVersion: S.optional(S.String) }),
).annotations({
  identifier: "OSUpdateSettings",
}) as any as S.Schema<OSUpdateSettings>;
export interface DirectorySizeUpdateSettings {
  DirectorySize?: string;
}
export const DirectorySizeUpdateSettings = S.suspend(() =>
  S.Struct({ DirectorySize: S.optional(S.String) }),
).annotations({
  identifier: "DirectorySizeUpdateSettings",
}) as any as S.Schema<DirectorySizeUpdateSettings>;
export interface NetworkUpdateSettings {
  NetworkType?: string;
  CustomerDnsIpsV6?: DnsIpv6Addrs;
}
export const NetworkUpdateSettings = S.suspend(() =>
  S.Struct({
    NetworkType: S.optional(S.String),
    CustomerDnsIpsV6: S.optional(DnsIpv6Addrs),
  }),
).annotations({
  identifier: "NetworkUpdateSettings",
}) as any as S.Schema<NetworkUpdateSettings>;
export interface HybridAdministratorAccountUpdate {
  SecretArn: string;
}
export const HybridAdministratorAccountUpdate = S.suspend(() =>
  S.Struct({ SecretArn: S.String }),
).annotations({
  identifier: "HybridAdministratorAccountUpdate",
}) as any as S.Schema<HybridAdministratorAccountUpdate>;
export interface HybridCustomerInstancesSettings {
  CustomerDnsIps: CustomerDnsIps;
  InstanceIds: AssessmentInstanceIds;
}
export const HybridCustomerInstancesSettings = S.suspend(() =>
  S.Struct({
    CustomerDnsIps: CustomerDnsIps,
    InstanceIds: AssessmentInstanceIds,
  }),
).annotations({
  identifier: "HybridCustomerInstancesSettings",
}) as any as S.Schema<HybridCustomerInstancesSettings>;
export interface Setting {
  Name: string;
  Value: string;
}
export const Setting = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String }),
).annotations({ identifier: "Setting" }) as any as S.Schema<Setting>;
export type Settings = Setting[];
export const Settings = S.Array(Setting);
export interface AddIpRoutesRequest {
  DirectoryId: string;
  IpRoutes: IpRoutes;
  UpdateSecurityGroupForDirectoryControllers?: boolean;
}
export const AddIpRoutesRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    IpRoutes: IpRoutes,
    UpdateSecurityGroupForDirectoryControllers: S.optional(S.Boolean),
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
  identifier: "AddIpRoutesRequest",
}) as any as S.Schema<AddIpRoutesRequest>;
export interface AddIpRoutesResult {}
export const AddIpRoutesResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddIpRoutesResult",
}) as any as S.Schema<AddIpRoutesResult>;
export interface AddRegionRequest {
  DirectoryId: string;
  RegionName: string;
  VPCSettings: DirectoryVpcSettings;
}
export const AddRegionRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    RegionName: S.String,
    VPCSettings: DirectoryVpcSettings,
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
  identifier: "AddRegionRequest",
}) as any as S.Schema<AddRegionRequest>;
export interface AddRegionResult {}
export const AddRegionResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddRegionResult",
}) as any as S.Schema<AddRegionResult>;
export interface AddTagsToResourceRequest {
  ResourceId: string;
  Tags: Tags;
}
export const AddTagsToResourceRequest = S.suspend(() =>
  S.Struct({ ResourceId: S.String, Tags: Tags }).pipe(
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
  identifier: "AddTagsToResourceRequest",
}) as any as S.Schema<AddTagsToResourceRequest>;
export interface AddTagsToResourceResult {}
export const AddTagsToResourceResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "AddTagsToResourceResult",
}) as any as S.Schema<AddTagsToResourceResult>;
export interface ConnectDirectoryRequest {
  Name: string;
  ShortName?: string;
  Password: string | Redacted.Redacted<string>;
  Description?: string;
  Size: string;
  ConnectSettings: DirectoryConnectSettings;
  Tags?: Tags;
  NetworkType?: string;
}
export const ConnectDirectoryRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ShortName: S.optional(S.String),
    Password: SensitiveString,
    Description: S.optional(S.String),
    Size: S.String,
    ConnectSettings: DirectoryConnectSettings,
    Tags: S.optional(Tags),
    NetworkType: S.optional(S.String),
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
  identifier: "ConnectDirectoryRequest",
}) as any as S.Schema<ConnectDirectoryRequest>;
export interface CreateAliasResult {
  DirectoryId?: string;
  Alias?: string;
}
export const CreateAliasResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    Alias: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "CreateAliasResult",
}) as any as S.Schema<CreateAliasResult>;
export interface CreateComputerRequest {
  DirectoryId: string;
  ComputerName: string;
  Password: string | Redacted.Redacted<string>;
  OrganizationalUnitDistinguishedName?: string;
  ComputerAttributes?: Attributes;
}
export const CreateComputerRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    ComputerName: S.String,
    Password: SensitiveString,
    OrganizationalUnitDistinguishedName: S.optional(S.String),
    ComputerAttributes: S.optional(Attributes),
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
  identifier: "CreateComputerRequest",
}) as any as S.Schema<CreateComputerRequest>;
export interface CreateDirectoryResult {
  DirectoryId?: string;
}
export const CreateDirectoryResult = S.suspend(() =>
  S.Struct({ DirectoryId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateDirectoryResult",
}) as any as S.Schema<CreateDirectoryResult>;
export interface CreateHybridADResult {
  DirectoryId?: string;
}
export const CreateHybridADResult = S.suspend(() =>
  S.Struct({ DirectoryId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateHybridADResult",
}) as any as S.Schema<CreateHybridADResult>;
export interface CreateMicrosoftADResult {
  DirectoryId?: string;
}
export const CreateMicrosoftADResult = S.suspend(() =>
  S.Struct({ DirectoryId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateMicrosoftADResult",
}) as any as S.Schema<CreateMicrosoftADResult>;
export interface CreateSnapshotResult {
  SnapshotId?: string;
}
export const CreateSnapshotResult = S.suspend(() =>
  S.Struct({ SnapshotId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateSnapshotResult",
}) as any as S.Schema<CreateSnapshotResult>;
export interface CreateTrustResult {
  TrustId?: string;
}
export const CreateTrustResult = S.suspend(() =>
  S.Struct({ TrustId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CreateTrustResult",
}) as any as S.Schema<CreateTrustResult>;
export interface DeleteADAssessmentResult {
  AssessmentId?: string;
}
export const DeleteADAssessmentResult = S.suspend(() =>
  S.Struct({ AssessmentId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteADAssessmentResult",
}) as any as S.Schema<DeleteADAssessmentResult>;
export interface DeleteDirectoryResult {
  DirectoryId?: string;
}
export const DeleteDirectoryResult = S.suspend(() =>
  S.Struct({ DirectoryId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteDirectoryResult",
}) as any as S.Schema<DeleteDirectoryResult>;
export interface DeleteSnapshotResult {
  SnapshotId?: string;
}
export const DeleteSnapshotResult = S.suspend(() =>
  S.Struct({ SnapshotId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteSnapshotResult",
}) as any as S.Schema<DeleteSnapshotResult>;
export interface DeleteTrustResult {
  TrustId?: string;
}
export const DeleteTrustResult = S.suspend(() =>
  S.Struct({ TrustId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DeleteTrustResult",
}) as any as S.Schema<DeleteTrustResult>;
export interface DescribeCAEnrollmentPolicyResult {
  DirectoryId?: string;
  PcaConnectorArn?: string;
  CaEnrollmentPolicyStatus?: string;
  LastUpdatedDateTime?: Date;
  CaEnrollmentPolicyStatusReason?: string;
}
export const DescribeCAEnrollmentPolicyResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    PcaConnectorArn: S.optional(S.String),
    CaEnrollmentPolicyStatus: S.optional(S.String),
    LastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CaEnrollmentPolicyStatusReason: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeCAEnrollmentPolicyResult",
}) as any as S.Schema<DescribeCAEnrollmentPolicyResult>;
export interface DescribeDirectoryDataAccessResult {
  DataAccessStatus?: string;
}
export const DescribeDirectoryDataAccessResult = S.suspend(() =>
  S.Struct({ DataAccessStatus: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "DescribeDirectoryDataAccessResult",
}) as any as S.Schema<DescribeDirectoryDataAccessResult>;
export interface DescribeSharedDirectoriesResult {
  SharedDirectories?: SharedDirectories;
  NextToken?: string;
}
export const DescribeSharedDirectoriesResult = S.suspend(() =>
  S.Struct({
    SharedDirectories: S.optional(SharedDirectories),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSharedDirectoriesResult",
}) as any as S.Schema<DescribeSharedDirectoriesResult>;
export interface EnableRadiusRequest {
  DirectoryId: string;
  RadiusSettings: RadiusSettings;
}
export const EnableRadiusRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, RadiusSettings: RadiusSettings }).pipe(
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
  identifier: "EnableRadiusRequest",
}) as any as S.Schema<EnableRadiusRequest>;
export interface EnableRadiusResult {}
export const EnableRadiusResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "EnableRadiusResult",
}) as any as S.Schema<EnableRadiusResult>;
export interface GetDirectoryLimitsResult {
  DirectoryLimits?: DirectoryLimits;
}
export const GetDirectoryLimitsResult = S.suspend(() =>
  S.Struct({ DirectoryLimits: S.optional(DirectoryLimits) }).pipe(ns),
).annotations({
  identifier: "GetDirectoryLimitsResult",
}) as any as S.Schema<GetDirectoryLimitsResult>;
export interface ListTagsForResourceResult {
  Tags?: Tags;
  NextToken?: string;
}
export const ListTagsForResourceResult = S.suspend(() =>
  S.Struct({ Tags: S.optional(Tags), NextToken: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ListTagsForResourceResult",
}) as any as S.Schema<ListTagsForResourceResult>;
export interface RegisterCertificateRequest {
  DirectoryId: string;
  CertificateData: string;
  Type?: string;
  ClientCertAuthSettings?: ClientCertAuthSettings;
}
export const RegisterCertificateRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    CertificateData: S.String,
    Type: S.optional(S.String),
    ClientCertAuthSettings: S.optional(ClientCertAuthSettings),
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
  identifier: "RegisterCertificateRequest",
}) as any as S.Schema<RegisterCertificateRequest>;
export interface RejectSharedDirectoryResult {
  SharedDirectoryId?: string;
}
export const RejectSharedDirectoryResult = S.suspend(() =>
  S.Struct({ SharedDirectoryId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RejectSharedDirectoryResult",
}) as any as S.Schema<RejectSharedDirectoryResult>;
export interface ShareDirectoryRequest {
  DirectoryId: string;
  ShareNotes?: string | Redacted.Redacted<string>;
  ShareTarget: ShareTarget;
  ShareMethod: string;
}
export const ShareDirectoryRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    ShareNotes: S.optional(SensitiveString),
    ShareTarget: ShareTarget,
    ShareMethod: S.String,
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
  identifier: "ShareDirectoryRequest",
}) as any as S.Schema<ShareDirectoryRequest>;
export interface StartADAssessmentRequest {
  AssessmentConfiguration?: AssessmentConfiguration;
  DirectoryId?: string;
}
export const StartADAssessmentRequest = S.suspend(() =>
  S.Struct({
    AssessmentConfiguration: S.optional(AssessmentConfiguration),
    DirectoryId: S.optional(S.String),
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
  identifier: "StartADAssessmentRequest",
}) as any as S.Schema<StartADAssessmentRequest>;
export interface StartSchemaExtensionResult {
  SchemaExtensionId?: string;
}
export const StartSchemaExtensionResult = S.suspend(() =>
  S.Struct({ SchemaExtensionId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartSchemaExtensionResult",
}) as any as S.Schema<StartSchemaExtensionResult>;
export interface UnshareDirectoryRequest {
  DirectoryId: string;
  UnshareTarget: UnshareTarget;
}
export const UnshareDirectoryRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, UnshareTarget: UnshareTarget }).pipe(
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
  identifier: "UnshareDirectoryRequest",
}) as any as S.Schema<UnshareDirectoryRequest>;
export interface UpdateDirectorySetupRequest {
  DirectoryId: string;
  UpdateType: string;
  OSUpdateSettings?: OSUpdateSettings;
  DirectorySizeUpdateSettings?: DirectorySizeUpdateSettings;
  NetworkUpdateSettings?: NetworkUpdateSettings;
  CreateSnapshotBeforeUpdate?: boolean;
}
export const UpdateDirectorySetupRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    UpdateType: S.String,
    OSUpdateSettings: S.optional(OSUpdateSettings),
    DirectorySizeUpdateSettings: S.optional(DirectorySizeUpdateSettings),
    NetworkUpdateSettings: S.optional(NetworkUpdateSettings),
    CreateSnapshotBeforeUpdate: S.optional(S.Boolean),
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
  identifier: "UpdateDirectorySetupRequest",
}) as any as S.Schema<UpdateDirectorySetupRequest>;
export interface UpdateDirectorySetupResult {}
export const UpdateDirectorySetupResult = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "UpdateDirectorySetupResult",
}) as any as S.Schema<UpdateDirectorySetupResult>;
export interface UpdateHybridADRequest {
  DirectoryId: string;
  HybridAdministratorAccountUpdate?: HybridAdministratorAccountUpdate;
  SelfManagedInstancesSettings?: HybridCustomerInstancesSettings;
}
export const UpdateHybridADRequest = S.suspend(() =>
  S.Struct({
    DirectoryId: S.String,
    HybridAdministratorAccountUpdate: S.optional(
      HybridAdministratorAccountUpdate,
    ),
    SelfManagedInstancesSettings: S.optional(HybridCustomerInstancesSettings),
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
  identifier: "UpdateHybridADRequest",
}) as any as S.Schema<UpdateHybridADRequest>;
export interface UpdateSettingsRequest {
  DirectoryId: string;
  Settings: Settings;
}
export const UpdateSettingsRequest = S.suspend(() =>
  S.Struct({ DirectoryId: S.String, Settings: Settings }).pipe(
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
  identifier: "UpdateSettingsRequest",
}) as any as S.Schema<UpdateSettingsRequest>;
export interface UpdateTrustResult {
  RequestId?: string;
  TrustId?: string;
}
export const UpdateTrustResult = S.suspend(() =>
  S.Struct({
    RequestId: S.optional(S.String),
    TrustId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateTrustResult",
}) as any as S.Schema<UpdateTrustResult>;
export interface VerifyTrustResult {
  TrustId?: string;
}
export const VerifyTrustResult = S.suspend(() =>
  S.Struct({ TrustId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "VerifyTrustResult",
}) as any as S.Schema<VerifyTrustResult>;
export interface Assessment {
  AssessmentId?: string;
  DirectoryId?: string;
  DnsName?: string;
  StartTime?: Date;
  LastUpdateDateTime?: Date;
  Status?: string;
  StatusCode?: string;
  StatusReason?: string;
  CustomerDnsIps?: CustomerDnsIps;
  VpcId?: string;
  SubnetIds?: SubnetIds;
  SecurityGroupIds?: SecurityGroupIds;
  SelfManagedInstanceIds?: AssessmentInstanceIds;
  ReportType?: string;
  Version?: string;
}
export const Assessment = S.suspend(() =>
  S.Struct({
    AssessmentId: S.optional(S.String),
    DirectoryId: S.optional(S.String),
    DnsName: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdateDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Status: S.optional(S.String),
    StatusCode: S.optional(S.String),
    StatusReason: S.optional(S.String),
    CustomerDnsIps: S.optional(CustomerDnsIps),
    VpcId: S.optional(S.String),
    SubnetIds: S.optional(SubnetIds),
    SecurityGroupIds: S.optional(SecurityGroupIds),
    SelfManagedInstanceIds: S.optional(AssessmentInstanceIds),
    ReportType: S.optional(S.String),
    Version: S.optional(S.String),
  }),
).annotations({ identifier: "Assessment" }) as any as S.Schema<Assessment>;
export interface Certificate {
  CertificateId?: string;
  State?: string;
  StateReason?: string;
  CommonName?: string;
  RegisteredDateTime?: Date;
  ExpiryDateTime?: Date;
  Type?: string;
  ClientCertAuthSettings?: ClientCertAuthSettings;
}
export const Certificate = S.suspend(() =>
  S.Struct({
    CertificateId: S.optional(S.String),
    State: S.optional(S.String),
    StateReason: S.optional(S.String),
    CommonName: S.optional(S.String),
    RegisteredDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ExpiryDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Type: S.optional(S.String),
    ClientCertAuthSettings: S.optional(ClientCertAuthSettings),
  }),
).annotations({ identifier: "Certificate" }) as any as S.Schema<Certificate>;
export interface ClientAuthenticationSettingInfo {
  Type?: string;
  Status?: string;
  LastUpdatedDateTime?: Date;
}
export const ClientAuthenticationSettingInfo = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Status: S.optional(S.String),
    LastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "ClientAuthenticationSettingInfo",
}) as any as S.Schema<ClientAuthenticationSettingInfo>;
export type ClientAuthenticationSettingsInfo =
  ClientAuthenticationSettingInfo[];
export const ClientAuthenticationSettingsInfo = S.Array(
  ClientAuthenticationSettingInfo,
);
export interface ConditionalForwarder {
  RemoteDomainName?: string;
  DnsIpAddrs?: DnsIpAddrs;
  DnsIpv6Addrs?: DnsIpv6Addrs;
  ReplicationScope?: string;
}
export const ConditionalForwarder = S.suspend(() =>
  S.Struct({
    RemoteDomainName: S.optional(S.String),
    DnsIpAddrs: S.optional(DnsIpAddrs),
    DnsIpv6Addrs: S.optional(DnsIpv6Addrs),
    ReplicationScope: S.optional(S.String),
  }),
).annotations({
  identifier: "ConditionalForwarder",
}) as any as S.Schema<ConditionalForwarder>;
export type ConditionalForwarders = ConditionalForwarder[];
export const ConditionalForwarders = S.Array(ConditionalForwarder);
export interface DomainController {
  DirectoryId?: string;
  DomainControllerId?: string;
  DnsIpAddr?: string;
  DnsIpv6Addr?: string;
  VpcId?: string;
  SubnetId?: string;
  AvailabilityZone?: string;
  Status?: string;
  StatusReason?: string;
  LaunchTime?: Date;
  StatusLastUpdatedDateTime?: Date;
}
export const DomainController = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    DomainControllerId: S.optional(S.String),
    DnsIpAddr: S.optional(S.String),
    DnsIpv6Addr: S.optional(S.String),
    VpcId: S.optional(S.String),
    SubnetId: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    LaunchTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StatusLastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "DomainController",
}) as any as S.Schema<DomainController>;
export type DomainControllers = DomainController[];
export const DomainControllers = S.Array(DomainController);
export interface EventTopic {
  DirectoryId?: string;
  TopicName?: string;
  TopicArn?: string;
  CreatedDateTime?: Date;
  Status?: string;
}
export const EventTopic = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    TopicName: S.optional(S.String),
    TopicArn: S.optional(S.String),
    CreatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Status: S.optional(S.String),
  }),
).annotations({ identifier: "EventTopic" }) as any as S.Schema<EventTopic>;
export type EventTopics = EventTopic[];
export const EventTopics = S.Array(EventTopic);
export interface LDAPSSettingInfo {
  LDAPSStatus?: string;
  LDAPSStatusReason?: string;
  LastUpdatedDateTime?: Date;
}
export const LDAPSSettingInfo = S.suspend(() =>
  S.Struct({
    LDAPSStatus: S.optional(S.String),
    LDAPSStatusReason: S.optional(S.String),
    LastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "LDAPSSettingInfo",
}) as any as S.Schema<LDAPSSettingInfo>;
export type LDAPSSettingsInfo = LDAPSSettingInfo[];
export const LDAPSSettingsInfo = S.Array(LDAPSSettingInfo);
export interface RegionDescription {
  DirectoryId?: string;
  RegionName?: string;
  RegionType?: string;
  Status?: string;
  VpcSettings?: DirectoryVpcSettings;
  DesiredNumberOfDomainControllers?: number;
  LaunchTime?: Date;
  StatusLastUpdatedDateTime?: Date;
  LastUpdatedDateTime?: Date;
}
export const RegionDescription = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    RegionName: S.optional(S.String),
    RegionType: S.optional(S.String),
    Status: S.optional(S.String),
    VpcSettings: S.optional(DirectoryVpcSettings),
    DesiredNumberOfDomainControllers: S.optional(S.Number),
    LaunchTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StatusLastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "RegionDescription",
}) as any as S.Schema<RegionDescription>;
export type RegionsDescription = RegionDescription[];
export const RegionsDescription = S.Array(RegionDescription);
export interface Snapshot {
  DirectoryId?: string;
  SnapshotId?: string;
  Type?: string;
  Name?: string;
  Status?: string;
  StartTime?: Date;
}
export const Snapshot = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    SnapshotId: S.optional(S.String),
    Type: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "Snapshot" }) as any as S.Schema<Snapshot>;
export type Snapshots = Snapshot[];
export const Snapshots = S.Array(Snapshot);
export interface Trust {
  DirectoryId?: string;
  TrustId?: string;
  RemoteDomainName?: string;
  TrustType?: string;
  TrustDirection?: string;
  TrustState?: string;
  CreatedDateTime?: Date;
  LastUpdatedDateTime?: Date;
  StateLastUpdatedDateTime?: Date;
  TrustStateReason?: string;
  SelectiveAuth?: string;
}
export const Trust = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    TrustId: S.optional(S.String),
    RemoteDomainName: S.optional(S.String),
    TrustType: S.optional(S.String),
    TrustDirection: S.optional(S.String),
    TrustState: S.optional(S.String),
    CreatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    StateLastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    TrustStateReason: S.optional(S.String),
    SelectiveAuth: S.optional(S.String),
  }),
).annotations({ identifier: "Trust" }) as any as S.Schema<Trust>;
export type Trusts = Trust[];
export const Trusts = S.Array(Trust);
export interface SnapshotLimits {
  ManualSnapshotsLimit?: number;
  ManualSnapshotsCurrentCount?: number;
  ManualSnapshotsLimitReached?: boolean;
}
export const SnapshotLimits = S.suspend(() =>
  S.Struct({
    ManualSnapshotsLimit: S.optional(S.Number),
    ManualSnapshotsCurrentCount: S.optional(S.Number),
    ManualSnapshotsLimitReached: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SnapshotLimits",
}) as any as S.Schema<SnapshotLimits>;
export interface AssessmentSummary {
  AssessmentId?: string;
  DirectoryId?: string;
  DnsName?: string;
  StartTime?: Date;
  LastUpdateDateTime?: Date;
  Status?: string;
  CustomerDnsIps?: CustomerDnsIps;
  ReportType?: string;
}
export const AssessmentSummary = S.suspend(() =>
  S.Struct({
    AssessmentId: S.optional(S.String),
    DirectoryId: S.optional(S.String),
    DnsName: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdateDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Status: S.optional(S.String),
    CustomerDnsIps: S.optional(CustomerDnsIps),
    ReportType: S.optional(S.String),
  }),
).annotations({
  identifier: "AssessmentSummary",
}) as any as S.Schema<AssessmentSummary>;
export type Assessments = AssessmentSummary[];
export const Assessments = S.Array(AssessmentSummary);
export interface CertificateInfo {
  CertificateId?: string;
  CommonName?: string;
  State?: string;
  ExpiryDateTime?: Date;
  Type?: string;
}
export const CertificateInfo = S.suspend(() =>
  S.Struct({
    CertificateId: S.optional(S.String),
    CommonName: S.optional(S.String),
    State: S.optional(S.String),
    ExpiryDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Type: S.optional(S.String),
  }),
).annotations({
  identifier: "CertificateInfo",
}) as any as S.Schema<CertificateInfo>;
export type CertificatesInfo = CertificateInfo[];
export const CertificatesInfo = S.Array(CertificateInfo);
export interface IpRouteInfo {
  DirectoryId?: string;
  CidrIp?: string;
  CidrIpv6?: string;
  IpRouteStatusMsg?: string;
  AddedDateTime?: Date;
  IpRouteStatusReason?: string;
  Description?: string;
}
export const IpRouteInfo = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    CidrIp: S.optional(S.String),
    CidrIpv6: S.optional(S.String),
    IpRouteStatusMsg: S.optional(S.String),
    AddedDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    IpRouteStatusReason: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "IpRouteInfo" }) as any as S.Schema<IpRouteInfo>;
export type IpRoutesInfo = IpRouteInfo[];
export const IpRoutesInfo = S.Array(IpRouteInfo);
export interface LogSubscription {
  DirectoryId?: string;
  LogGroupName?: string;
  SubscriptionCreatedDateTime?: Date;
}
export const LogSubscription = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    LogGroupName: S.optional(S.String),
    SubscriptionCreatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "LogSubscription",
}) as any as S.Schema<LogSubscription>;
export type LogSubscriptions = LogSubscription[];
export const LogSubscriptions = S.Array(LogSubscription);
export interface SchemaExtensionInfo {
  DirectoryId?: string;
  SchemaExtensionId?: string;
  Description?: string;
  SchemaExtensionStatus?: string;
  SchemaExtensionStatusReason?: string;
  StartDateTime?: Date;
  EndDateTime?: Date;
}
export const SchemaExtensionInfo = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    SchemaExtensionId: S.optional(S.String),
    Description: S.optional(S.String),
    SchemaExtensionStatus: S.optional(S.String),
    SchemaExtensionStatusReason: S.optional(S.String),
    StartDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "SchemaExtensionInfo",
}) as any as S.Schema<SchemaExtensionInfo>;
export type SchemaExtensionsInfo = SchemaExtensionInfo[];
export const SchemaExtensionsInfo = S.Array(SchemaExtensionInfo);
export type AvailabilityZones = string[];
export const AvailabilityZones = S.Array(S.String);
export type IpAddrs = string[];
export const IpAddrs = S.Array(S.String);
export type IpV6Addrs = string[];
export const IpV6Addrs = S.Array(S.String);
export type AdditionalRegions = string[];
export const AdditionalRegions = S.Array(S.String);
export interface AcceptSharedDirectoryResult {
  SharedDirectory?: SharedDirectory;
}
export const AcceptSharedDirectoryResult = S.suspend(() =>
  S.Struct({ SharedDirectory: S.optional(SharedDirectory) }).pipe(ns),
).annotations({
  identifier: "AcceptSharedDirectoryResult",
}) as any as S.Schema<AcceptSharedDirectoryResult>;
export interface ConnectDirectoryResult {
  DirectoryId?: string;
}
export const ConnectDirectoryResult = S.suspend(() =>
  S.Struct({ DirectoryId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ConnectDirectoryResult",
}) as any as S.Schema<ConnectDirectoryResult>;
export interface DescribeCertificateResult {
  Certificate?: Certificate;
}
export const DescribeCertificateResult = S.suspend(() =>
  S.Struct({ Certificate: S.optional(Certificate) }).pipe(ns),
).annotations({
  identifier: "DescribeCertificateResult",
}) as any as S.Schema<DescribeCertificateResult>;
export interface DescribeClientAuthenticationSettingsResult {
  ClientAuthenticationSettingsInfo?: ClientAuthenticationSettingsInfo;
  NextToken?: string;
}
export const DescribeClientAuthenticationSettingsResult = S.suspend(() =>
  S.Struct({
    ClientAuthenticationSettingsInfo: S.optional(
      ClientAuthenticationSettingsInfo,
    ),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeClientAuthenticationSettingsResult",
}) as any as S.Schema<DescribeClientAuthenticationSettingsResult>;
export interface DescribeConditionalForwardersResult {
  ConditionalForwarders?: ConditionalForwarders;
}
export const DescribeConditionalForwardersResult = S.suspend(() =>
  S.Struct({ ConditionalForwarders: S.optional(ConditionalForwarders) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeConditionalForwardersResult",
}) as any as S.Schema<DescribeConditionalForwardersResult>;
export interface DescribeDomainControllersResult {
  DomainControllers?: DomainControllers;
  NextToken?: string;
}
export const DescribeDomainControllersResult = S.suspend(() =>
  S.Struct({
    DomainControllers: S.optional(DomainControllers),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDomainControllersResult",
}) as any as S.Schema<DescribeDomainControllersResult>;
export interface DescribeEventTopicsResult {
  EventTopics?: EventTopics;
}
export const DescribeEventTopicsResult = S.suspend(() =>
  S.Struct({ EventTopics: S.optional(EventTopics) }).pipe(ns),
).annotations({
  identifier: "DescribeEventTopicsResult",
}) as any as S.Schema<DescribeEventTopicsResult>;
export interface DescribeLDAPSSettingsResult {
  LDAPSSettingsInfo?: LDAPSSettingsInfo;
  NextToken?: string;
}
export const DescribeLDAPSSettingsResult = S.suspend(() =>
  S.Struct({
    LDAPSSettingsInfo: S.optional(LDAPSSettingsInfo),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeLDAPSSettingsResult",
}) as any as S.Schema<DescribeLDAPSSettingsResult>;
export interface DescribeRegionsResult {
  RegionsDescription?: RegionsDescription;
  NextToken?: string;
}
export const DescribeRegionsResult = S.suspend(() =>
  S.Struct({
    RegionsDescription: S.optional(RegionsDescription),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeRegionsResult",
}) as any as S.Schema<DescribeRegionsResult>;
export interface DescribeSnapshotsResult {
  Snapshots?: Snapshots;
  NextToken?: string;
}
export const DescribeSnapshotsResult = S.suspend(() =>
  S.Struct({
    Snapshots: S.optional(Snapshots),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSnapshotsResult",
}) as any as S.Schema<DescribeSnapshotsResult>;
export interface DescribeTrustsResult {
  Trusts?: Trusts;
  NextToken?: string;
}
export const DescribeTrustsResult = S.suspend(() =>
  S.Struct({
    Trusts: S.optional(Trusts),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeTrustsResult",
}) as any as S.Schema<DescribeTrustsResult>;
export interface GetSnapshotLimitsResult {
  SnapshotLimits?: SnapshotLimits;
}
export const GetSnapshotLimitsResult = S.suspend(() =>
  S.Struct({ SnapshotLimits: S.optional(SnapshotLimits) }).pipe(ns),
).annotations({
  identifier: "GetSnapshotLimitsResult",
}) as any as S.Schema<GetSnapshotLimitsResult>;
export interface ListADAssessmentsResult {
  Assessments?: Assessments;
  NextToken?: string;
}
export const ListADAssessmentsResult = S.suspend(() =>
  S.Struct({
    Assessments: S.optional(Assessments),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListADAssessmentsResult",
}) as any as S.Schema<ListADAssessmentsResult>;
export interface ListCertificatesResult {
  NextToken?: string;
  CertificatesInfo?: CertificatesInfo;
}
export const ListCertificatesResult = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    CertificatesInfo: S.optional(CertificatesInfo),
  }).pipe(ns),
).annotations({
  identifier: "ListCertificatesResult",
}) as any as S.Schema<ListCertificatesResult>;
export interface ListIpRoutesResult {
  IpRoutesInfo?: IpRoutesInfo;
  NextToken?: string;
}
export const ListIpRoutesResult = S.suspend(() =>
  S.Struct({
    IpRoutesInfo: S.optional(IpRoutesInfo),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListIpRoutesResult",
}) as any as S.Schema<ListIpRoutesResult>;
export interface ListLogSubscriptionsResult {
  LogSubscriptions?: LogSubscriptions;
  NextToken?: string;
}
export const ListLogSubscriptionsResult = S.suspend(() =>
  S.Struct({
    LogSubscriptions: S.optional(LogSubscriptions),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListLogSubscriptionsResult",
}) as any as S.Schema<ListLogSubscriptionsResult>;
export interface ListSchemaExtensionsResult {
  SchemaExtensionsInfo?: SchemaExtensionsInfo;
  NextToken?: string;
}
export const ListSchemaExtensionsResult = S.suspend(() =>
  S.Struct({
    SchemaExtensionsInfo: S.optional(SchemaExtensionsInfo),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "ListSchemaExtensionsResult",
}) as any as S.Schema<ListSchemaExtensionsResult>;
export interface RegisterCertificateResult {
  CertificateId?: string;
}
export const RegisterCertificateResult = S.suspend(() =>
  S.Struct({ CertificateId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "RegisterCertificateResult",
}) as any as S.Schema<RegisterCertificateResult>;
export interface ShareDirectoryResult {
  SharedDirectoryId?: string;
}
export const ShareDirectoryResult = S.suspend(() =>
  S.Struct({ SharedDirectoryId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "ShareDirectoryResult",
}) as any as S.Schema<ShareDirectoryResult>;
export interface StartADAssessmentResult {
  AssessmentId?: string;
}
export const StartADAssessmentResult = S.suspend(() =>
  S.Struct({ AssessmentId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "StartADAssessmentResult",
}) as any as S.Schema<StartADAssessmentResult>;
export interface UnshareDirectoryResult {
  SharedDirectoryId?: string;
}
export const UnshareDirectoryResult = S.suspend(() =>
  S.Struct({ SharedDirectoryId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UnshareDirectoryResult",
}) as any as S.Schema<UnshareDirectoryResult>;
export interface UpdateHybridADResult {
  DirectoryId?: string;
  AssessmentId?: string;
}
export const UpdateHybridADResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    AssessmentId: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "UpdateHybridADResult",
}) as any as S.Schema<UpdateHybridADResult>;
export interface UpdateSettingsResult {
  DirectoryId?: string;
}
export const UpdateSettingsResult = S.suspend(() =>
  S.Struct({ DirectoryId: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "UpdateSettingsResult",
}) as any as S.Schema<UpdateSettingsResult>;
export interface AssessmentValidation {
  Category?: string;
  Name?: string;
  Status?: string;
  StatusCode?: string;
  StatusReason?: string;
  StartTime?: Date;
  LastUpdateDateTime?: Date;
}
export const AssessmentValidation = S.suspend(() =>
  S.Struct({
    Category: S.optional(S.String),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    StatusCode: S.optional(S.String),
    StatusReason: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdateDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "AssessmentValidation",
}) as any as S.Schema<AssessmentValidation>;
export type AssessmentValidations = AssessmentValidation[];
export const AssessmentValidations = S.Array(AssessmentValidation);
export interface DirectoryVpcSettingsDescription {
  VpcId?: string;
  SubnetIds?: SubnetIds;
  SecurityGroupId?: string;
  AvailabilityZones?: AvailabilityZones;
}
export const DirectoryVpcSettingsDescription = S.suspend(() =>
  S.Struct({
    VpcId: S.optional(S.String),
    SubnetIds: S.optional(SubnetIds),
    SecurityGroupId: S.optional(S.String),
    AvailabilityZones: S.optional(AvailabilityZones),
  }),
).annotations({
  identifier: "DirectoryVpcSettingsDescription",
}) as any as S.Schema<DirectoryVpcSettingsDescription>;
export interface DirectoryConnectSettingsDescription {
  VpcId?: string;
  SubnetIds?: SubnetIds;
  CustomerUserName?: string;
  SecurityGroupId?: string;
  AvailabilityZones?: AvailabilityZones;
  ConnectIps?: IpAddrs;
  ConnectIpsV6?: IpV6Addrs;
}
export const DirectoryConnectSettingsDescription = S.suspend(() =>
  S.Struct({
    VpcId: S.optional(S.String),
    SubnetIds: S.optional(SubnetIds),
    CustomerUserName: S.optional(S.String),
    SecurityGroupId: S.optional(S.String),
    AvailabilityZones: S.optional(AvailabilityZones),
    ConnectIps: S.optional(IpAddrs),
    ConnectIpsV6: S.optional(IpV6Addrs),
  }),
).annotations({
  identifier: "DirectoryConnectSettingsDescription",
}) as any as S.Schema<DirectoryConnectSettingsDescription>;
export interface OwnerDirectoryDescription {
  DirectoryId?: string;
  AccountId?: string;
  DnsIpAddrs?: DnsIpAddrs;
  DnsIpv6Addrs?: DnsIpv6Addrs;
  VpcSettings?: DirectoryVpcSettingsDescription;
  RadiusSettings?: RadiusSettings;
  RadiusStatus?: string;
  NetworkType?: string;
}
export const OwnerDirectoryDescription = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    AccountId: S.optional(S.String),
    DnsIpAddrs: S.optional(DnsIpAddrs),
    DnsIpv6Addrs: S.optional(DnsIpv6Addrs),
    VpcSettings: S.optional(DirectoryVpcSettingsDescription),
    RadiusSettings: S.optional(RadiusSettings),
    RadiusStatus: S.optional(S.String),
    NetworkType: S.optional(S.String),
  }),
).annotations({
  identifier: "OwnerDirectoryDescription",
}) as any as S.Schema<OwnerDirectoryDescription>;
export interface RegionsInfo {
  PrimaryRegion?: string;
  AdditionalRegions?: AdditionalRegions;
}
export const RegionsInfo = S.suspend(() =>
  S.Struct({
    PrimaryRegion: S.optional(S.String),
    AdditionalRegions: S.optional(AdditionalRegions),
  }),
).annotations({ identifier: "RegionsInfo" }) as any as S.Schema<RegionsInfo>;
export interface HybridSettingsDescription {
  SelfManagedDnsIpAddrs?: IpAddrs;
  SelfManagedInstanceIds?: AssessmentInstanceIds;
}
export const HybridSettingsDescription = S.suspend(() =>
  S.Struct({
    SelfManagedDnsIpAddrs: S.optional(IpAddrs),
    SelfManagedInstanceIds: S.optional(AssessmentInstanceIds),
  }),
).annotations({
  identifier: "HybridSettingsDescription",
}) as any as S.Schema<HybridSettingsDescription>;
export type DirectoryConfigurationSettingRequestDetailedStatus = {
  [key: string]: string;
};
export const DirectoryConfigurationSettingRequestDetailedStatus = S.Record({
  key: S.String,
  value: S.String,
});
export interface UpdateValue {
  OSUpdateSettings?: OSUpdateSettings;
}
export const UpdateValue = S.suspend(() =>
  S.Struct({ OSUpdateSettings: S.optional(OSUpdateSettings) }),
).annotations({ identifier: "UpdateValue" }) as any as S.Schema<UpdateValue>;
export interface Computer {
  ComputerId?: string;
  ComputerName?: string;
  ComputerAttributes?: Attributes;
}
export const Computer = S.suspend(() =>
  S.Struct({
    ComputerId: S.optional(S.String),
    ComputerName: S.optional(S.String),
    ComputerAttributes: S.optional(Attributes),
  }),
).annotations({ identifier: "Computer" }) as any as S.Schema<Computer>;
export interface AssessmentReport {
  DomainControllerIp?: string;
  Validations?: AssessmentValidations;
}
export const AssessmentReport = S.suspend(() =>
  S.Struct({
    DomainControllerIp: S.optional(S.String),
    Validations: S.optional(AssessmentValidations),
  }),
).annotations({
  identifier: "AssessmentReport",
}) as any as S.Schema<AssessmentReport>;
export type AssessmentReports = AssessmentReport[];
export const AssessmentReports = S.Array(AssessmentReport);
export interface DirectoryDescription {
  DirectoryId?: string;
  Name?: string;
  ShortName?: string;
  Size?: string;
  Edition?: string;
  Alias?: string;
  AccessUrl?: string;
  Description?: string;
  DnsIpAddrs?: DnsIpAddrs;
  DnsIpv6Addrs?: DnsIpv6Addrs;
  Stage?: string;
  ShareStatus?: string;
  ShareMethod?: string;
  ShareNotes?: string | Redacted.Redacted<string>;
  LaunchTime?: Date;
  StageLastUpdatedDateTime?: Date;
  Type?: string;
  VpcSettings?: DirectoryVpcSettingsDescription;
  ConnectSettings?: DirectoryConnectSettingsDescription;
  RadiusSettings?: RadiusSettings;
  RadiusStatus?: string;
  StageReason?: string;
  SsoEnabled?: boolean;
  DesiredNumberOfDomainControllers?: number;
  OwnerDirectoryDescription?: OwnerDirectoryDescription;
  RegionsInfo?: RegionsInfo;
  OsVersion?: string;
  HybridSettings?: HybridSettingsDescription;
  NetworkType?: string;
}
export const DirectoryDescription = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    Name: S.optional(S.String),
    ShortName: S.optional(S.String),
    Size: S.optional(S.String),
    Edition: S.optional(S.String),
    Alias: S.optional(S.String),
    AccessUrl: S.optional(S.String),
    Description: S.optional(S.String),
    DnsIpAddrs: S.optional(DnsIpAddrs),
    DnsIpv6Addrs: S.optional(DnsIpv6Addrs),
    Stage: S.optional(S.String),
    ShareStatus: S.optional(S.String),
    ShareMethod: S.optional(S.String),
    ShareNotes: S.optional(SensitiveString),
    LaunchTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StageLastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Type: S.optional(S.String),
    VpcSettings: S.optional(DirectoryVpcSettingsDescription),
    ConnectSettings: S.optional(DirectoryConnectSettingsDescription),
    RadiusSettings: S.optional(RadiusSettings),
    RadiusStatus: S.optional(S.String),
    StageReason: S.optional(S.String),
    SsoEnabled: S.optional(S.Boolean),
    DesiredNumberOfDomainControllers: S.optional(S.Number),
    OwnerDirectoryDescription: S.optional(OwnerDirectoryDescription),
    RegionsInfo: S.optional(RegionsInfo),
    OsVersion: S.optional(S.String),
    HybridSettings: S.optional(HybridSettingsDescription),
    NetworkType: S.optional(S.String),
  }),
).annotations({
  identifier: "DirectoryDescription",
}) as any as S.Schema<DirectoryDescription>;
export type DirectoryDescriptions = DirectoryDescription[];
export const DirectoryDescriptions = S.Array(DirectoryDescription);
export interface SettingEntry {
  Type?: string;
  Name?: string;
  AllowedValues?: string;
  AppliedValue?: string;
  RequestedValue?: string;
  RequestStatus?: string;
  RequestDetailedStatus?: DirectoryConfigurationSettingRequestDetailedStatus;
  RequestStatusMessage?: string;
  LastUpdatedDateTime?: Date;
  LastRequestedDateTime?: Date;
  DataType?: string;
}
export const SettingEntry = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Name: S.optional(S.String),
    AllowedValues: S.optional(S.String),
    AppliedValue: S.optional(S.String),
    RequestedValue: S.optional(S.String),
    RequestStatus: S.optional(S.String),
    RequestDetailedStatus: S.optional(
      DirectoryConfigurationSettingRequestDetailedStatus,
    ),
    RequestStatusMessage: S.optional(S.String),
    LastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastRequestedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    DataType: S.optional(S.String),
  }),
).annotations({ identifier: "SettingEntry" }) as any as S.Schema<SettingEntry>;
export type SettingEntries = SettingEntry[];
export const SettingEntries = S.Array(SettingEntry);
export interface UpdateInfoEntry {
  Region?: string;
  Status?: string;
  StatusReason?: string;
  InitiatedBy?: string;
  NewValue?: UpdateValue;
  PreviousValue?: UpdateValue;
  StartTime?: Date;
  LastUpdatedDateTime?: Date;
}
export const UpdateInfoEntry = S.suspend(() =>
  S.Struct({
    Region: S.optional(S.String),
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    InitiatedBy: S.optional(S.String),
    NewValue: S.optional(UpdateValue),
    PreviousValue: S.optional(UpdateValue),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "UpdateInfoEntry",
}) as any as S.Schema<UpdateInfoEntry>;
export type UpdateActivities = UpdateInfoEntry[];
export const UpdateActivities = S.Array(UpdateInfoEntry);
export interface HybridUpdateValue {
  InstanceIds?: AssessmentInstanceIds;
  DnsIps?: CustomerDnsIps;
}
export const HybridUpdateValue = S.suspend(() =>
  S.Struct({
    InstanceIds: S.optional(AssessmentInstanceIds),
    DnsIps: S.optional(CustomerDnsIps),
  }),
).annotations({
  identifier: "HybridUpdateValue",
}) as any as S.Schema<HybridUpdateValue>;
export interface CreateComputerResult {
  Computer?: Computer;
}
export const CreateComputerResult = S.suspend(() =>
  S.Struct({ Computer: S.optional(Computer) }).pipe(ns),
).annotations({
  identifier: "CreateComputerResult",
}) as any as S.Schema<CreateComputerResult>;
export interface DescribeADAssessmentResult {
  Assessment?: Assessment;
  AssessmentReports?: AssessmentReports;
}
export const DescribeADAssessmentResult = S.suspend(() =>
  S.Struct({
    Assessment: S.optional(Assessment),
    AssessmentReports: S.optional(AssessmentReports),
  }).pipe(ns),
).annotations({
  identifier: "DescribeADAssessmentResult",
}) as any as S.Schema<DescribeADAssessmentResult>;
export interface DescribeDirectoriesResult {
  DirectoryDescriptions?: DirectoryDescriptions;
  NextToken?: string;
}
export const DescribeDirectoriesResult = S.suspend(() =>
  S.Struct({
    DirectoryDescriptions: S.optional(DirectoryDescriptions),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeDirectoriesResult",
}) as any as S.Schema<DescribeDirectoriesResult>;
export interface DescribeSettingsResult {
  DirectoryId?: string;
  SettingEntries?: SettingEntries;
  NextToken?: string;
}
export const DescribeSettingsResult = S.suspend(() =>
  S.Struct({
    DirectoryId: S.optional(S.String),
    SettingEntries: S.optional(SettingEntries),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSettingsResult",
}) as any as S.Schema<DescribeSettingsResult>;
export interface DescribeUpdateDirectoryResult {
  UpdateActivities?: UpdateActivities;
  NextToken?: string;
}
export const DescribeUpdateDirectoryResult = S.suspend(() =>
  S.Struct({
    UpdateActivities: S.optional(UpdateActivities),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeUpdateDirectoryResult",
}) as any as S.Schema<DescribeUpdateDirectoryResult>;
export interface HybridUpdateInfoEntry {
  Status?: string;
  StatusReason?: string;
  InitiatedBy?: string;
  NewValue?: HybridUpdateValue;
  PreviousValue?: HybridUpdateValue;
  StartTime?: Date;
  LastUpdatedDateTime?: Date;
  AssessmentId?: string;
}
export const HybridUpdateInfoEntry = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    StatusReason: S.optional(S.String),
    InitiatedBy: S.optional(S.String),
    NewValue: S.optional(HybridUpdateValue),
    PreviousValue: S.optional(HybridUpdateValue),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AssessmentId: S.optional(S.String),
  }),
).annotations({
  identifier: "HybridUpdateInfoEntry",
}) as any as S.Schema<HybridUpdateInfoEntry>;
export type HybridUpdateInfoEntries = HybridUpdateInfoEntry[];
export const HybridUpdateInfoEntries = S.Array(HybridUpdateInfoEntry);
export interface HybridUpdateActivities {
  SelfManagedInstances?: HybridUpdateInfoEntries;
  HybridAdministratorAccount?: HybridUpdateInfoEntries;
}
export const HybridUpdateActivities = S.suspend(() =>
  S.Struct({
    SelfManagedInstances: S.optional(HybridUpdateInfoEntries),
    HybridAdministratorAccount: S.optional(HybridUpdateInfoEntries),
  }),
).annotations({
  identifier: "HybridUpdateActivities",
}) as any as S.Schema<HybridUpdateActivities>;
export interface DescribeHybridADUpdateResult {
  UpdateActivities?: HybridUpdateActivities;
  NextToken?: string;
}
export const DescribeHybridADUpdateResult = S.suspend(() =>
  S.Struct({
    UpdateActivities: S.optional(HybridUpdateActivities),
    NextToken: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeHybridADUpdateResult",
}) as any as S.Schema<DescribeHybridADUpdateResult>;

//# Errors
export class ClientException extends S.TaggedError<ClientException>()(
  "ClientException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class CertificateDoesNotExistException extends S.TaggedError<CertificateDoesNotExistException>()(
  "CertificateDoesNotExistException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class AuthenticationFailedException extends S.TaggedError<AuthenticationFailedException>()(
  "AuthenticationFailedException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class EntityDoesNotExistException extends S.TaggedError<EntityDoesNotExistException>()(
  "EntityDoesNotExistException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class EntityAlreadyExistsException extends S.TaggedError<EntityAlreadyExistsException>()(
  "EntityAlreadyExistsException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class DirectoryLimitExceededException extends S.TaggedError<DirectoryLimitExceededException>()(
  "DirectoryLimitExceededException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class ADAssessmentLimitExceededException extends S.TaggedError<ADAssessmentLimitExceededException>()(
  "ADAssessmentLimitExceededException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class CertificateInUseException extends S.TaggedError<CertificateInUseException>()(
  "CertificateInUseException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class DirectoryDoesNotExistException extends S.TaggedError<DirectoryDoesNotExistException>()(
  "DirectoryDoesNotExistException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class DirectoryAlreadySharedException extends S.TaggedError<DirectoryAlreadySharedException>()(
  "DirectoryAlreadySharedException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class DirectoryUnavailableException extends S.TaggedError<DirectoryUnavailableException>()(
  "DirectoryUnavailableException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class DirectoryAlreadyInRegionException extends S.TaggedError<DirectoryAlreadyInRegionException>()(
  "DirectoryAlreadyInRegionException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class ServiceException extends S.TaggedError<ServiceException>()(
  "ServiceException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class CertificateAlreadyExistsException extends S.TaggedError<CertificateAlreadyExistsException>()(
  "CertificateAlreadyExistsException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class DirectoryNotSharedException extends S.TaggedError<DirectoryNotSharedException>()(
  "DirectoryNotSharedException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class IncompatibleSettingsException extends S.TaggedError<IncompatibleSettingsException>()(
  "IncompatibleSettingsException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InsufficientPermissionsException extends S.TaggedError<InsufficientPermissionsException>()(
  "InsufficientPermissionsException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class DisableAlreadyInProgressException extends S.TaggedError<DisableAlreadyInProgressException>()(
  "DisableAlreadyInProgressException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class DirectoryInDesiredStateException extends S.TaggedError<DirectoryInDesiredStateException>()(
  "DirectoryInDesiredStateException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InvalidLDAPSStatusException extends S.TaggedError<InvalidLDAPSStatusException>()(
  "InvalidLDAPSStatusException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InvalidClientAuthStatusException extends S.TaggedError<InvalidClientAuthStatusException>()(
  "InvalidClientAuthStatusException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class EnableAlreadyInProgressException extends S.TaggedError<EnableAlreadyInProgressException>()(
  "EnableAlreadyInProgressException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InvalidPasswordException extends S.TaggedError<InvalidPasswordException>()(
  "InvalidPasswordException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class DomainControllerLimitExceededException extends S.TaggedError<DomainControllerLimitExceededException>()(
  "DomainControllerLimitExceededException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class UnsupportedOperationException extends S.TaggedError<UnsupportedOperationException>()(
  "UnsupportedOperationException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class CertificateLimitExceededException extends S.TaggedError<CertificateLimitExceededException>()(
  "CertificateLimitExceededException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InvalidTargetException extends S.TaggedError<InvalidTargetException>()(
  "InvalidTargetException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class SnapshotLimitExceededException extends S.TaggedError<SnapshotLimitExceededException>()(
  "SnapshotLimitExceededException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class TagLimitExceededException extends S.TaggedError<TagLimitExceededException>()(
  "TagLimitExceededException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class RegionLimitExceededException extends S.TaggedError<RegionLimitExceededException>()(
  "RegionLimitExceededException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class IpRouteLimitExceededException extends S.TaggedError<IpRouteLimitExceededException>()(
  "IpRouteLimitExceededException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class NoAvailableCertificateException extends S.TaggedError<NoAvailableCertificateException>()(
  "NoAvailableCertificateException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class InvalidCertificateException extends S.TaggedError<InvalidCertificateException>()(
  "InvalidCertificateException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class UnsupportedSettingsException extends S.TaggedError<UnsupportedSettingsException>()(
  "UnsupportedSettingsException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class UserDoesNotExistException extends S.TaggedError<UserDoesNotExistException>()(
  "UserDoesNotExistException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class OrganizationsException extends S.TaggedError<OrganizationsException>()(
  "OrganizationsException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}
export class ShareLimitExceededException extends S.TaggedError<ShareLimitExceededException>()(
  "ShareLimitExceededException",
  { Message: S.optional(S.String), RequestId: S.optional(S.String) },
) {}

//# Operations
/**
 * Cancels an in-progress schema extension to a Microsoft AD directory. Once a schema
 * extension has started replicating to all domain controllers, the task can no longer be
 * canceled. A schema extension can be canceled during any of the following states;
 * `Initializing`, `CreatingSnapshot`, and
 * `UpdatingSchema`.
 */
export const cancelSchemaExtension: (
  input: CancelSchemaExtensionRequest,
) => Effect.Effect<
  CancelSchemaExtensionResult,
  | ClientException
  | EntityDoesNotExistException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelSchemaExtensionRequest,
  output: CancelSchemaExtensionResult,
  errors: [ClientException, EntityDoesNotExistException, ServiceException],
}));
/**
 * Creates an alias for a directory and assigns the alias to the directory. The alias is used
 * to construct the access URL for the directory, such as
 * `http://.awsapps.com`.
 *
 * After an alias has been created, it cannot be deleted or reused, so this operation should only be used when absolutely necessary.
 */
export const createAlias: (
  input: CreateAliasRequest,
) => Effect.Effect<
  CreateAliasResult,
  | ClientException
  | EntityAlreadyExistsException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAliasRequest,
  output: CreateAliasResult,
  errors: [
    ClientException,
    EntityAlreadyExistsException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Describes the updates of a directory for a particular update type.
 */
export const describeUpdateDirectory: {
  (
    input: DescribeUpdateDirectoryRequest,
  ): Effect.Effect<
    DescribeUpdateDirectoryResult,
    | AccessDeniedException
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeUpdateDirectoryRequest,
  ) => Stream.Stream<
    DescribeUpdateDirectoryResult,
    | AccessDeniedException
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeUpdateDirectoryRequest,
  ) => Stream.Stream<
    UpdateInfoEntry,
    | AccessDeniedException
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeUpdateDirectoryRequest,
  output: DescribeUpdateDirectoryResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "UpdateActivities",
  } as const,
}));
/**
 * Disables single-sign on for a directory.
 */
export const disableSso: (
  input: DisableSsoRequest,
) => Effect.Effect<
  DisableSsoResult,
  | AuthenticationFailedException
  | ClientException
  | EntityDoesNotExistException
  | InsufficientPermissionsException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableSsoRequest,
  output: DisableSsoResult,
  errors: [
    AuthenticationFailedException,
    ClientException,
    EntityDoesNotExistException,
    InsufficientPermissionsException,
    ServiceException,
  ],
}));
/**
 * Obtains the manual snapshot limits for a directory.
 */
export const getSnapshotLimits: (
  input: GetSnapshotLimitsRequest,
) => Effect.Effect<
  GetSnapshotLimitsResult,
  | ClientException
  | EntityDoesNotExistException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSnapshotLimitsRequest,
  output: GetSnapshotLimitsResult,
  errors: [ClientException, EntityDoesNotExistException, ServiceException],
}));
/**
 * Deletes an Directory Service directory.
 *
 * Before you call `DeleteDirectory`, ensure that all of the required permissions
 * have been explicitly granted through a policy. For details about what permissions are required
 * to run the `DeleteDirectory` operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
 */
export const deleteDirectory: (
  input: DeleteDirectoryRequest,
) => Effect.Effect<
  DeleteDirectoryResult,
  | ClientException
  | EntityDoesNotExistException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDirectoryRequest,
  output: DeleteDirectoryResult,
  errors: [ClientException, EntityDoesNotExistException, ServiceException],
}));
/**
 * Obtains directory limit information for the current Region.
 */
export const getDirectoryLimits: (
  input: GetDirectoryLimitsRequest,
) => Effect.Effect<
  GetDirectoryLimitsResult,
  | ClientException
  | EntityDoesNotExistException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDirectoryLimitsRequest,
  output: GetDirectoryLimitsResult,
  errors: [ClientException, EntityDoesNotExistException, ServiceException],
}));
/**
 * Disables multi-factor authentication (MFA) with the Remote Authentication Dial In User
 * Service (RADIUS) server for an AD Connector or Microsoft AD directory.
 */
export const disableRadius: (
  input: DisableRadiusRequest,
) => Effect.Effect<
  DisableRadiusResult,
  | ClientException
  | EntityDoesNotExistException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableRadiusRequest,
  output: DisableRadiusResult,
  errors: [ClientException, EntityDoesNotExistException, ServiceException],
}));
/**
 * Creates a Simple AD directory. For more information, see Simple Active Directory in the *Directory Service Admin Guide*.
 *
 * Before you call `CreateDirectory`, ensure that all of the required permissions
 * have been explicitly granted through a policy. For details about what permissions are required
 * to run the `CreateDirectory` operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
 */
export const createDirectory: (
  input: CreateDirectoryRequest,
) => Effect.Effect<
  CreateDirectoryResult,
  | ClientException
  | DirectoryLimitExceededException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDirectoryRequest,
  output: CreateDirectoryResult,
  errors: [
    ClientException,
    DirectoryLimitExceededException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Obtains information about which Amazon SNS topics receive status messages from the specified
 * directory.
 *
 * If no input parameters are provided, such as DirectoryId or TopicName, this request
 * describes all of the associations in the account.
 */
export const describeEventTopics: (
  input: DescribeEventTopicsRequest,
) => Effect.Effect<
  DescribeEventTopicsResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventTopicsRequest,
  output: DescribeEventTopicsResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Rejects a directory sharing request that was sent from the directory owner account.
 */
export const rejectSharedDirectory: (
  input: RejectSharedDirectoryRequest,
) => Effect.Effect<
  RejectSharedDirectoryResult,
  | ClientException
  | DirectoryAlreadySharedException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RejectSharedDirectoryRequest,
  output: RejectSharedDirectoryResult,
  errors: [
    ClientException,
    DirectoryAlreadySharedException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Deletes a directory snapshot.
 */
export const deleteSnapshot: (
  input: DeleteSnapshotRequest,
) => Effect.Effect<
  DeleteSnapshotResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSnapshotRequest,
  output: DeleteSnapshotResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Updates the trust that has been set up between your Managed Microsoft AD directory and an
 * self-managed Active Directory.
 */
export const updateTrust: (
  input: UpdateTrustRequest,
) => Effect.Effect<
  UpdateTrustResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTrustRequest,
  output: UpdateTrustResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Removes the specified directory as a publisher to the specified Amazon SNS topic.
 */
export const deregisterEventTopic: (
  input: DeregisterEventTopicRequest,
) => Effect.Effect<
  DeregisterEventTopicResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterEventTopicRequest,
  output: DeregisterEventTopicResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Associates a directory with an Amazon SNS topic. This establishes the directory as a
 * publisher to the specified Amazon SNS topic. You can then receive email or text (SMS) messages when
 * the status of your directory changes. You get notified if your directory goes from an Active
 * status to an Impaired or Inoperable status. You also receive a notification when the directory
 * returns to an Active status.
 */
export const registerEventTopic: (
  input: RegisterEventTopicRequest,
) => Effect.Effect<
  RegisterEventTopicResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterEventTopicRequest,
  output: RegisterEventTopicResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Removes tags from a directory.
 */
export const removeTagsFromResource: (
  input: RemoveTagsFromResourceRequest,
) => Effect.Effect<
  RemoveTagsFromResourceResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsFromResourceRequest,
  output: RemoveTagsFromResourceResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Restores a directory using an existing directory snapshot.
 *
 * When you restore a directory from a snapshot, any changes made to the directory after the snapshot date are overwritten.
 *
 * This action returns as soon as the restore operation is initiated. You can monitor the
 * progress of the restore operation by calling the DescribeDirectories operation with
 * the directory identifier. When the **DirectoryDescription.Stage** value changes to
 * `Active`, the restore operation is complete.
 */
export const restoreFromSnapshot: (
  input: RestoreFromSnapshotRequest,
) => Effect.Effect<
  RestoreFromSnapshotResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RestoreFromSnapshotRequest,
  output: RestoreFromSnapshotResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Updates the Remote Authentication Dial In User Service (RADIUS) server information for
 * an AD Connector or Microsoft AD directory.
 */
export const updateRadius: (
  input: UpdateRadiusRequest,
) => Effect.Effect<
  UpdateRadiusResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRadiusRequest,
  output: UpdateRadiusResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Enables multi-factor authentication (MFA) with the Remote Authentication Dial In User
 * Service (RADIUS) server for an AD Connector or Microsoft AD directory.
 */
export const enableRadius: (
  input: EnableRadiusRequest,
) => Effect.Effect<
  EnableRadiusResult,
  | ClientException
  | EntityAlreadyExistsException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableRadiusRequest,
  output: EnableRadiusResult,
  errors: [
    ClientException,
    EntityAlreadyExistsException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Creates an AD Connector to connect to a self-managed directory.
 *
 * Before you call `ConnectDirectory`, ensure that all of the required permissions
 * have been explicitly granted through a policy. For details about what permissions are required
 * to run the `ConnectDirectory` operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
 */
export const connectDirectory: (
  input: ConnectDirectoryRequest,
) => Effect.Effect<
  ConnectDirectoryResult,
  | ClientException
  | DirectoryLimitExceededException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ConnectDirectoryRequest,
  output: ConnectDirectoryResult,
  errors: [
    ClientException,
    DirectoryLimitExceededException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Accepts a directory sharing request that was sent from the directory owner account.
 */
export const acceptSharedDirectory: (
  input: AcceptSharedDirectoryRequest,
) => Effect.Effect<
  AcceptSharedDirectoryResult,
  | ClientException
  | DirectoryAlreadySharedException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AcceptSharedDirectoryRequest,
  output: AcceptSharedDirectoryResult,
  errors: [
    ClientException,
    DirectoryAlreadySharedException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Removes IP address blocks from a directory.
 */
export const removeIpRoutes: (
  input: RemoveIpRoutesRequest,
) => Effect.Effect<
  RemoveIpRoutesResult,
  | ClientException
  | DirectoryUnavailableException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveIpRoutesRequest,
  output: RemoveIpRoutesResult,
  errors: [
    ClientException,
    DirectoryUnavailableException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Disables the certificate authority (CA) enrollment policy for the specified directory. This stops
 * automatic certificate enrollment and management for domain-joined clients, but does not affect
 * existing certificates.
 *
 * Disabling the CA enrollment policy prevents new certificates from being automatically
 * enrolled, but existing certificates remain valid and functional until they expire.
 */
export const disableCAEnrollmentPolicy: (
  input: DisableCAEnrollmentPolicyRequest,
) => Effect.Effect<
  DisableCAEnrollmentPolicyResult,
  | AccessDeniedException
  | ClientException
  | DirectoryDoesNotExistException
  | DirectoryUnavailableException
  | DisableAlreadyInProgressException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableCAEnrollmentPolicyRequest,
  output: DisableCAEnrollmentPolicyResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryDoesNotExistException,
    DirectoryUnavailableException,
    DisableAlreadyInProgressException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Enables certificate authority (CA) enrollment policy for the specified directory. This allows
 * domain-joined clients to automatically request and receive certificates from the specified
 * Amazon Web Services Private Certificate Authority.
 *
 * Before enabling CA enrollment, ensure that the PCA connector is properly configured and
 * accessible from the directory. The connector must be in an active state and have the
 * necessary permissions.
 */
export const enableCAEnrollmentPolicy: (
  input: EnableCAEnrollmentPolicyRequest,
) => Effect.Effect<
  EnableCAEnrollmentPolicyResult,
  | AccessDeniedException
  | ClientException
  | DirectoryDoesNotExistException
  | DirectoryUnavailableException
  | EnableAlreadyInProgressException
  | EntityAlreadyExistsException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableCAEnrollmentPolicyRequest,
  output: EnableCAEnrollmentPolicyResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryDoesNotExistException,
    DirectoryUnavailableException,
    EnableAlreadyInProgressException,
    EntityAlreadyExistsException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
  ],
}));
/**
 * Obtains information about the directory snapshots that belong to this account.
 *
 * This operation supports pagination with the use of the *NextToken* request and
 * response parameters. If more results are available, the *DescribeSnapshots.NextToken*
 * member contains a token that you pass in the next call to DescribeSnapshots to
 * retrieve the next set of items.
 *
 * You can also specify a maximum number of return results with the *Limit*
 * parameter.
 */
export const describeSnapshots: {
  (
    input: DescribeSnapshotsRequest,
  ): Effect.Effect<
    DescribeSnapshotsResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSnapshotsRequest,
  ) => Stream.Stream<
    DescribeSnapshotsResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSnapshotsRequest,
  ) => Stream.Stream<
    Snapshot,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSnapshotsRequest,
  output: DescribeSnapshotsResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Snapshots",
    pageSize: "Limit",
  } as const,
}));
/**
 * Lists the address blocks that you have added to a directory.
 */
export const listIpRoutes: {
  (
    input: ListIpRoutesRequest,
  ): Effect.Effect<
    ListIpRoutesResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListIpRoutesRequest,
  ) => Stream.Stream<
    ListIpRoutesResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListIpRoutesRequest,
  ) => Stream.Stream<
    IpRouteInfo,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListIpRoutesRequest,
  output: ListIpRoutesResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "IpRoutesInfo",
    pageSize: "Limit",
  } as const,
}));
/**
 * Lists the active log subscriptions for the Amazon Web Services account.
 */
export const listLogSubscriptions: {
  (
    input: ListLogSubscriptionsRequest,
  ): Effect.Effect<
    ListLogSubscriptionsResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListLogSubscriptionsRequest,
  ) => Stream.Stream<
    ListLogSubscriptionsResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListLogSubscriptionsRequest,
  ) => Stream.Stream<
    LogSubscription,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListLogSubscriptionsRequest,
  output: ListLogSubscriptionsResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidNextTokenException,
    ServiceException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "LogSubscriptions",
    pageSize: "Limit",
  } as const,
}));
/**
 * Lists all schema extensions applied to a Microsoft AD Directory.
 */
export const listSchemaExtensions: {
  (
    input: ListSchemaExtensionsRequest,
  ): Effect.Effect<
    ListSchemaExtensionsResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchemaExtensionsRequest,
  ) => Stream.Stream<
    ListSchemaExtensionsResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchemaExtensionsRequest,
  ) => Stream.Stream<
    SchemaExtensionInfo,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSchemaExtensionsRequest,
  output: ListSchemaExtensionsResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidNextTokenException,
    ServiceException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SchemaExtensionsInfo",
    pageSize: "Limit",
  } as const,
}));
/**
 * Lists all tags on a directory.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceRequest,
  ): Effect.Effect<
    ListTagsForResourceResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    ListTagsForResourceResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceRequest,
  ) => Stream.Stream<
    Tag,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tags",
    pageSize: "Limit",
  } as const,
}));
/**
 * Obtains information about the directories that belong to this account.
 *
 * You can retrieve information about specific directories by passing the directory
 * identifiers in the `DirectoryIds` parameter. Otherwise, all directories that belong
 * to the current account are returned.
 *
 * This operation supports pagination with the use of the `NextToken` request and
 * response parameters. If more results are available, the
 * `DescribeDirectoriesResult.NextToken` member contains a token that you pass in
 * the next call to DescribeDirectories to retrieve the next set of
 * items.
 *
 * You can also specify a maximum number of return results with the `Limit`
 * parameter.
 */
export const describeDirectories: {
  (
    input: DescribeDirectoriesRequest,
  ): Effect.Effect<
    DescribeDirectoriesResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDirectoriesRequest,
  ) => Stream.Stream<
    DescribeDirectoriesResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDirectoriesRequest,
  ) => Stream.Stream<
    DirectoryDescription,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDirectoriesRequest,
  output: DescribeDirectoriesResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DirectoryDescriptions",
    pageSize: "Limit",
  } as const,
}));
/**
 * Enables single sign-on for a directory. Single sign-on allows users in your directory to
 * access certain Amazon Web Services services from a computer joined to the directory without having to enter
 * their credentials separately.
 */
export const enableSso: (
  input: EnableSsoRequest,
) => Effect.Effect<
  EnableSsoResult,
  | AuthenticationFailedException
  | ClientException
  | EntityDoesNotExistException
  | InsufficientPermissionsException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableSsoRequest,
  output: EnableSsoResult,
  errors: [
    AuthenticationFailedException,
    ClientException,
    EntityDoesNotExistException,
    InsufficientPermissionsException,
    ServiceException,
  ],
}));
/**
 * Creates an Active Directory computer object in the specified directory.
 */
export const createComputer: (
  input: CreateComputerRequest,
) => Effect.Effect<
  CreateComputerResult,
  | AuthenticationFailedException
  | ClientException
  | DirectoryUnavailableException
  | EntityAlreadyExistsException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateComputerRequest,
  output: CreateComputerResult,
  errors: [
    AuthenticationFailedException,
    ClientException,
    DirectoryUnavailableException,
    EntityAlreadyExistsException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves information about update activities for a hybrid directory. This operation
 * provides details about configuration changes, administrator account updates, and
 * self-managed instance settings (IDs and DNS IPs).
 */
export const describeHybridADUpdate: (
  input: DescribeHybridADUpdateRequest,
) => Effect.Effect<
  DescribeHybridADUpdateResult,
  | ClientException
  | DirectoryDoesNotExistException
  | InvalidNextTokenException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeHybridADUpdateRequest,
  output: DescribeHybridADUpdateResult,
  errors: [
    ClientException,
    DirectoryDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Stops the directory sharing between the directory owner and consumer accounts.
 */
export const unshareDirectory: (
  input: UnshareDirectoryRequest,
) => Effect.Effect<
  UnshareDirectoryResult,
  | ClientException
  | DirectoryNotSharedException
  | EntityDoesNotExistException
  | InvalidTargetException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UnshareDirectoryRequest,
  output: UnshareDirectoryResult,
  errors: [
    ClientException,
    DirectoryNotSharedException,
    EntityDoesNotExistException,
    InvalidTargetException,
    ServiceException,
  ],
}));
/**
 * Applies a schema extension to a Microsoft AD directory.
 */
export const startSchemaExtension: (
  input: StartSchemaExtensionRequest,
) => Effect.Effect<
  StartSchemaExtensionResult,
  | ClientException
  | DirectoryUnavailableException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | SnapshotLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSchemaExtensionRequest,
  output: StartSchemaExtensionResult,
  errors: [
    ClientException,
    DirectoryUnavailableException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    SnapshotLimitExceededException,
  ],
}));
/**
 * Adds or overwrites one or more tags for the specified directory. Each directory can
 * have a maximum of 50 tags. Each tag consists of a key and optional value. Tag keys must be
 * unique to each resource.
 */
export const addTagsToResource: (
  input: AddTagsToResourceRequest,
) => Effect.Effect<
  AddTagsToResourceResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | TagLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToResourceRequest,
  output: AddTagsToResourceResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    TagLimitExceededException,
  ],
}));
/**
 * Adds two domain controllers in the specified Region for the specified directory.
 */
export const addRegion: (
  input: AddRegionRequest,
) => Effect.Effect<
  AddRegionResult,
  | AccessDeniedException
  | ClientException
  | DirectoryAlreadyInRegionException
  | DirectoryDoesNotExistException
  | DirectoryUnavailableException
  | EntityDoesNotExistException
  | InvalidParameterException
  | RegionLimitExceededException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddRegionRequest,
  output: AddRegionResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryAlreadyInRegionException,
    DirectoryDoesNotExistException,
    DirectoryUnavailableException,
    EntityDoesNotExistException,
    InvalidParameterException,
    RegionLimitExceededException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * If the DNS server for your self-managed domain uses a publicly addressable IP address,
 * you must add a CIDR address block to correctly route traffic to and from your Microsoft AD
 * on Amazon Web Services. *AddIpRoutes* adds this address block. You can
 * also use *AddIpRoutes* to facilitate routing traffic that uses public IP
 * ranges from your Microsoft AD on Amazon Web Services to a peer VPC.
 *
 * Before you call *AddIpRoutes*, ensure that all of the required
 * permissions have been explicitly granted through a policy. For details about what
 * permissions are required to run the *AddIpRoutes* operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
 */
export const addIpRoutes: (
  input: AddIpRoutesRequest,
) => Effect.Effect<
  AddIpRoutesResult,
  | ClientException
  | DirectoryUnavailableException
  | EntityAlreadyExistsException
  | EntityDoesNotExistException
  | InvalidParameterException
  | IpRouteLimitExceededException
  | ServiceException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddIpRoutesRequest,
  output: AddIpRoutesResult,
  errors: [
    ClientException,
    DirectoryUnavailableException,
    EntityAlreadyExistsException,
    EntityDoesNotExistException,
    InvalidParameterException,
    IpRouteLimitExceededException,
    ServiceException,
  ],
}));
/**
 * Retrieves detailed information about a directory assessment, including its current
 * status, validation results, and configuration details. Use this operation to monitor
 * assessment progress and review results.
 */
export const describeADAssessment: (
  input: DescribeADAssessmentRequest,
) => Effect.Effect<
  DescribeADAssessmentResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeADAssessmentRequest,
  output: DescribeADAssessmentResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Provides information about any domain controllers in your directory.
 */
export const describeDomainControllers: {
  (
    input: DescribeDomainControllersRequest,
  ): Effect.Effect<
    DescribeDomainControllersResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeDomainControllersRequest,
  ) => Stream.Stream<
    DescribeDomainControllersResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeDomainControllersRequest,
  ) => Stream.Stream<
    unknown,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeDomainControllersRequest,
  output: DescribeDomainControllersResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "Limit",
  } as const,
}));
/**
 * Retrieves information about the configurable settings for the specified directory.
 */
export const describeSettings: (
  input: DescribeSettingsRequest,
) => Effect.Effect<
  DescribeSettingsResult,
  | ClientException
  | DirectoryDoesNotExistException
  | InvalidNextTokenException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSettingsRequest,
  output: DescribeSettingsResult,
  errors: [
    ClientException,
    DirectoryDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves detailed information about the certificate authority (CA) enrollment policy for
 * the specified directory. This policy determines how client certificates are automatically enrolled and
 * managed through Amazon Web Services Private Certificate Authority.
 */
export const describeCAEnrollmentPolicy: (
  input: DescribeCAEnrollmentPolicyRequest,
) => Effect.Effect<
  DescribeCAEnrollmentPolicyResult,
  | ClientException
  | DirectoryDoesNotExistException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCAEnrollmentPolicyRequest,
  output: DescribeCAEnrollmentPolicyResult,
  errors: [
    ClientException,
    DirectoryDoesNotExistException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes the specified log subscription.
 */
export const deleteLogSubscription: (
  input: DeleteLogSubscriptionRequest,
) => Effect.Effect<
  DeleteLogSubscriptionResult,
  | ClientException
  | EntityDoesNotExistException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteLogSubscriptionRequest,
  output: DeleteLogSubscriptionResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Stops all replication and removes the domain controllers from the specified Region. You
 * cannot remove the primary Region with this operation. Instead, use the
 * `DeleteDirectory` API.
 */
export const removeRegion: (
  input: RemoveRegionRequest,
) => Effect.Effect<
  RemoveRegionResult,
  | AccessDeniedException
  | ClientException
  | DirectoryDoesNotExistException
  | DirectoryUnavailableException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveRegionRequest,
  output: RemoveRegionResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryDoesNotExistException,
    DirectoryUnavailableException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Obtains status of directory data access enablement through the Directory Service Data API for the
 * specified directory.
 */
export const describeDirectoryDataAccess: (
  input: DescribeDirectoryDataAccessRequest,
) => Effect.Effect<
  DescribeDirectoryDataAccessResult,
  | AccessDeniedException
  | ClientException
  | DirectoryDoesNotExistException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDirectoryDataAccessRequest,
  output: DescribeDirectoryDataAccessResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryDoesNotExistException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a hybrid directory that connects your self-managed Active Directory (AD)
 * infrastructure and Amazon Web Services.
 *
 * You must have a successful directory assessment using StartADAssessment to validate your environment compatibility before you
 * use this operation.
 *
 * Updates are applied asynchronously. Use DescribeDirectories to
 * monitor the progress of directory creation.
 */
export const createHybridAD: (
  input: CreateHybridADRequest,
) => Effect.Effect<
  CreateHybridADResult,
  | ADAssessmentLimitExceededException
  | ClientException
  | DirectoryLimitExceededException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateHybridADRequest,
  output: CreateHybridADResult,
  errors: [
    ADAssessmentLimitExceededException,
    ClientException,
    DirectoryLimitExceededException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Displays information about the certificate registered for secure LDAP or client
 * certificate authentication.
 */
export const describeCertificate: (
  input: DescribeCertificateRequest,
) => Effect.Effect<
  DescribeCertificateResult,
  | CertificateDoesNotExistException
  | ClientException
  | DirectoryDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCertificateRequest,
  output: DescribeCertificateResult,
  errors: [
    CertificateDoesNotExistException,
    ClientException,
    DirectoryDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Retrieves information about the type of client authentication for the specified directory,
 * if the type is specified. If no type is specified, information about all client authentication
 * types that are supported for the specified directory is retrieved. Currently, only
 * `SmartCard` is supported.
 */
export const describeClientAuthenticationSettings: {
  (
    input: DescribeClientAuthenticationSettingsRequest,
  ): Effect.Effect<
    DescribeClientAuthenticationSettingsResult,
    | AccessDeniedException
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeClientAuthenticationSettingsRequest,
  ) => Stream.Stream<
    DescribeClientAuthenticationSettingsResult,
    | AccessDeniedException
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeClientAuthenticationSettingsRequest,
  ) => Stream.Stream<
    ClientAuthenticationSettingInfo,
    | AccessDeniedException
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeClientAuthenticationSettingsRequest,
  output: DescribeClientAuthenticationSettingsResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ClientAuthenticationSettingsInfo",
    pageSize: "Limit",
  } as const,
}));
/**
 * Retrieves a list of directory assessments for the specified directory or all
 * assessments in your account. Use this operation to monitor assessment status and manage
 * multiple assessments.
 */
export const listADAssessments: {
  (
    input: ListADAssessmentsRequest,
  ): Effect.Effect<
    ListADAssessmentsResult,
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListADAssessmentsRequest,
  ) => Stream.Stream<
    ListADAssessmentsResult,
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListADAssessmentsRequest,
  ) => Stream.Stream<
    AssessmentSummary,
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListADAssessmentsRequest,
  output: ListADAssessmentsResult,
  errors: [
    ClientException,
    DirectoryDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Assessments",
    pageSize: "Limit",
  } as const,
}));
/**
 * Initiates a directory assessment to validate your self-managed AD environment for
 * hybrid domain join. The assessment checks compatibility and connectivity of the
 * self-managed AD environment.
 *
 * A directory assessment is automatically created when you create a hybrid directory.
 * There are two types of assessments: `CUSTOMER` and `SYSTEM`. Your
 * Amazon Web Services account has a limit of 100 `CUSTOMER` directory assessments.
 *
 * The assessment process typically takes 30 minutes or more to complete. The assessment
 * process is asynchronous and you can monitor it with
 * `DescribeADAssessment`.
 *
 * The `InstanceIds` must have a one-to-one correspondence with
 * `CustomerDnsIps`, meaning that if the IP address for instance i-10243410
 * is 10.24.34.100 and the IP address for instance i-10243420 is 10.24.34.200, then the
 * input arrays must maintain the same order relationship, either [10.24.34.100,
 * 10.24.34.200] paired with [i-10243410, i-10243420] or [10.24.34.200, 10.24.34.100]
 * paired with [i-10243420, i-10243410].
 *
 * Note: You must provide exactly one `DirectoryId` or
 * `AssessmentConfiguration`.
 */
export const startADAssessment: (
  input: StartADAssessmentRequest,
) => Effect.Effect<
  StartADAssessmentResult,
  | ADAssessmentLimitExceededException
  | ClientException
  | DirectoryDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartADAssessmentRequest,
  output: StartADAssessmentResult,
  errors: [
    ADAssessmentLimitExceededException,
    ClientException,
    DirectoryDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates the configuration of an existing hybrid directory. You can recover hybrid
 * directory administrator account or modify self-managed instance settings.
 *
 * Updates are applied asynchronously. Use DescribeHybridADUpdate to
 * monitor the progress of configuration changes.
 *
 * The `InstanceIds` must have a one-to-one correspondence with
 * `CustomerDnsIps`, meaning that if the IP address for instance i-10243410
 * is 10.24.34.100 and the IP address for instance i-10243420 is 10.24.34.200, then the
 * input arrays must maintain the same order relationship, either [10.24.34.100,
 * 10.24.34.200] paired with [i-10243410, i-10243420] or [10.24.34.200, 10.24.34.100]
 * paired with [i-10243420, i-10243410].
 *
 * You must provide at least one update to UpdateHybridADRequest$HybridAdministratorAccountUpdate or UpdateHybridADRequest$SelfManagedInstancesSettings.
 */
export const updateHybridAD: (
  input: UpdateHybridADRequest,
) => Effect.Effect<
  UpdateHybridADResult,
  | ADAssessmentLimitExceededException
  | ClientException
  | DirectoryDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateHybridADRequest,
  output: UpdateHybridADResult,
  errors: [
    ADAssessmentLimitExceededException,
    ClientException,
    DirectoryDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes a directory assessment and all associated data. This operation permanently
 * removes the assessment results, validation reports, and configuration
 * information.
 *
 * You cannot delete system-initiated assessments. You can delete customer-created
 * assessments even if they are in progress.
 */
export const deleteADAssessment: (
  input: DeleteADAssessmentRequest,
) => Effect.Effect<
  DeleteADAssessmentResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteADAssessmentRequest,
  output: DeleteADAssessmentResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes an existing trust relationship between your Managed Microsoft AD directory and an external
 * domain.
 */
export const deleteTrust: (
  input: DeleteTrustRequest,
) => Effect.Effect<
  DeleteTrustResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTrustRequest,
  output: DeleteTrustResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Directory Service for Microsoft Active Directory allows you to configure and verify trust
 * relationships.
 *
 * This action verifies a trust relationship between your Managed Microsoft AD directory and an
 * external domain.
 */
export const verifyTrust: (
  input: VerifyTrustRequest,
) => Effect.Effect<
  VerifyTrustResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: VerifyTrustRequest,
  output: VerifyTrustResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Directory Service for Microsoft Active Directory allows you to configure trust relationships. For
 * example, you can establish a trust between your Managed Microsoft AD directory, and your existing
 * self-managed Microsoft Active Directory. This would allow you to provide users and groups
 * access to resources in either domain, with a single set of credentials.
 *
 * This action initiates the creation of the Amazon Web Services side of a trust relationship between an
 * Managed Microsoft AD directory and an external domain. You can create either a forest trust or an
 * external trust.
 */
export const createTrust: (
  input: CreateTrustRequest,
) => Effect.Effect<
  CreateTrustResult,
  | ClientException
  | EntityAlreadyExistsException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTrustRequest,
  output: CreateTrustResult,
  errors: [
    ClientException,
    EntityAlreadyExistsException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a Microsoft AD directory in the Amazon Web Services Cloud. For more information, see Managed Microsoft AD in the *Directory Service Admin Guide*.
 *
 * Before you call *CreateMicrosoftAD*, ensure that all of the required
 * permissions have been explicitly granted through a policy. For details about what permissions
 * are required to run the *CreateMicrosoftAD* operation, see Directory Service API Permissions: Actions, Resources, and Conditions Reference.
 */
export const createMicrosoftAD: (
  input: CreateMicrosoftADRequest,
) => Effect.Effect<
  CreateMicrosoftADResult,
  | ClientException
  | DirectoryLimitExceededException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMicrosoftADRequest,
  output: CreateMicrosoftADResult,
  errors: [
    ClientException,
    DirectoryLimitExceededException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes from the system the certificate that was registered for secure LDAP or client
 * certificate authentication.
 */
export const deregisterCertificate: (
  input: DeregisterCertificateRequest,
) => Effect.Effect<
  DeregisterCertificateResult,
  | CertificateDoesNotExistException
  | CertificateInUseException
  | ClientException
  | DirectoryDoesNotExistException
  | DirectoryUnavailableException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeregisterCertificateRequest,
  output: DeregisterCertificateResult,
  errors: [
    CertificateDoesNotExistException,
    CertificateInUseException,
    ClientException,
    DirectoryDoesNotExistException,
    DirectoryUnavailableException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a conditional forwarder associated with your Amazon Web Services directory. Conditional
 * forwarders are required in order to set up a trust relationship with another domain. The
 * conditional forwarder points to the trusted domain.
 */
export const createConditionalForwarder: (
  input: CreateConditionalForwarderRequest,
) => Effect.Effect<
  CreateConditionalForwarderResult,
  | ClientException
  | DirectoryUnavailableException
  | EntityAlreadyExistsException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConditionalForwarderRequest,
  output: CreateConditionalForwarderResult,
  errors: [
    ClientException,
    DirectoryUnavailableException,
    EntityAlreadyExistsException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deletes a conditional forwarder that has been set up for your Amazon Web Services
 * directory.
 */
export const deleteConditionalForwarder: (
  input: DeleteConditionalForwarderRequest,
) => Effect.Effect<
  DeleteConditionalForwarderResult,
  | ClientException
  | DirectoryUnavailableException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConditionalForwarderRequest,
  output: DeleteConditionalForwarderResult,
  errors: [
    ClientException,
    DirectoryUnavailableException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates a conditional forwarder that has been set up for your Amazon Web Services
 * directory.
 */
export const updateConditionalForwarder: (
  input: UpdateConditionalForwarderRequest,
) => Effect.Effect<
  UpdateConditionalForwarderResult,
  | ClientException
  | DirectoryUnavailableException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConditionalForwarderRequest,
  output: UpdateConditionalForwarderResult,
  errors: [
    ClientException,
    DirectoryUnavailableException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Obtains information about the conditional forwarders for this account.
 *
 * If no input parameters are provided for RemoteDomainNames, this request describes all
 * conditional forwarders for the specified directory ID.
 */
export const describeConditionalForwarders: (
  input: DescribeConditionalForwardersRequest,
) => Effect.Effect<
  DescribeConditionalForwardersResult,
  | ClientException
  | DirectoryUnavailableException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConditionalForwardersRequest,
  output: DescribeConditionalForwardersResult,
  errors: [
    ClientException,
    DirectoryUnavailableException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deactivates LDAP secure calls for the specified directory.
 */
export const disableLDAPS: (
  input: DisableLDAPSRequest,
) => Effect.Effect<
  DisableLDAPSResult,
  | ClientException
  | DirectoryDoesNotExistException
  | DirectoryUnavailableException
  | InvalidLDAPSStatusException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableLDAPSRequest,
  output: DisableLDAPSResult,
  errors: [
    ClientException,
    DirectoryDoesNotExistException,
    DirectoryUnavailableException,
    InvalidLDAPSStatusException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Disables alternative client authentication methods for the specified directory.
 */
export const disableClientAuthentication: (
  input: DisableClientAuthenticationRequest,
) => Effect.Effect<
  DisableClientAuthenticationResult,
  | AccessDeniedException
  | ClientException
  | DirectoryDoesNotExistException
  | InvalidClientAuthStatusException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableClientAuthenticationRequest,
  output: DisableClientAuthenticationResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryDoesNotExistException,
    InvalidClientAuthStatusException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Describes the status of LDAP security for the specified directory.
 */
export const describeLDAPSSettings: {
  (
    input: DescribeLDAPSSettingsRequest,
  ): Effect.Effect<
    DescribeLDAPSSettingsResult,
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeLDAPSSettingsRequest,
  ) => Stream.Stream<
    DescribeLDAPSSettingsResult,
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeLDAPSSettingsRequest,
  ) => Stream.Stream<
    LDAPSSettingInfo,
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeLDAPSSettingsRequest,
  output: DescribeLDAPSSettingsResult,
  errors: [
    ClientException,
    DirectoryDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "LDAPSSettingsInfo",
    pageSize: "Limit",
  } as const,
}));
/**
 * Provides information about the Regions that are configured for multi-Region
 * replication.
 */
export const describeRegions: {
  (
    input: DescribeRegionsRequest,
  ): Effect.Effect<
    DescribeRegionsResult,
    | AccessDeniedException
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRegionsRequest,
  ) => Stream.Stream<
    DescribeRegionsResult,
    | AccessDeniedException
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRegionsRequest,
  ) => Stream.Stream<
    RegionDescription,
    | AccessDeniedException
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRegionsRequest,
  output: DescribeRegionsResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RegionsDescription",
  } as const,
}));
/**
 * Obtains information about the trust relationships for this account.
 *
 * If no input parameters are provided, such as DirectoryId or TrustIds, this request
 * describes all the trust relationships belonging to the account.
 */
export const describeTrusts: {
  (
    input: DescribeTrustsRequest,
  ): Effect.Effect<
    DescribeTrustsResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTrustsRequest,
  ) => Stream.Stream<
    DescribeTrustsResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTrustsRequest,
  ) => Stream.Stream<
    Trust,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTrustsRequest,
  output: DescribeTrustsResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Trusts",
    pageSize: "Limit",
  } as const,
}));
/**
 * For the specified directory, lists all the certificates registered for a secure LDAP or
 * client certificate authentication.
 */
export const listCertificates: {
  (
    input: ListCertificatesRequest,
  ): Effect.Effect<
    ListCertificatesResult,
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCertificatesRequest,
  ) => Stream.Stream<
    ListCertificatesResult,
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCertificatesRequest,
  ) => Stream.Stream<
    CertificateInfo,
    | ClientException
    | DirectoryDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCertificatesRequest,
  output: ListCertificatesResult,
  errors: [
    ClientException,
    DirectoryDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CertificatesInfo",
    pageSize: "Limit",
  } as const,
}));
/**
 * Returns the shared directories in your account.
 */
export const describeSharedDirectories: {
  (
    input: DescribeSharedDirectoriesRequest,
  ): Effect.Effect<
    DescribeSharedDirectoriesResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSharedDirectoriesRequest,
  ) => Stream.Stream<
    DescribeSharedDirectoriesResult,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSharedDirectoriesRequest,
  ) => Stream.Stream<
    SharedDirectory,
    | ClientException
    | EntityDoesNotExistException
    | InvalidNextTokenException
    | InvalidParameterException
    | ServiceException
    | UnsupportedOperationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSharedDirectoriesRequest,
  output: DescribeSharedDirectoriesResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidNextTokenException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SharedDirectories",
    pageSize: "Limit",
  } as const,
}));
/**
 * Adds or removes domain controllers to or from the directory. Based on the difference
 * between current value and new value (provided through this API call), domain controllers will
 * be added or removed. It may take up to 45 minutes for any new domain controllers to become
 * fully active once the requested number of domain controllers is updated. During this time, you
 * cannot make another update request.
 */
export const updateNumberOfDomainControllers: (
  input: UpdateNumberOfDomainControllersRequest,
) => Effect.Effect<
  UpdateNumberOfDomainControllersResult,
  | ClientException
  | DirectoryUnavailableException
  | DomainControllerLimitExceededException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNumberOfDomainControllersRequest,
  output: UpdateNumberOfDomainControllersResult,
  errors: [
    ClientException,
    DirectoryUnavailableException,
    DomainControllerLimitExceededException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a subscription to forward real-time Directory Service domain controller security
 * logs to the specified Amazon CloudWatch log group in your Amazon Web Services account.
 */
export const createLogSubscription: (
  input: CreateLogSubscriptionRequest,
) => Effect.Effect<
  CreateLogSubscriptionResult,
  | ClientException
  | EntityAlreadyExistsException
  | EntityDoesNotExistException
  | InsufficientPermissionsException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateLogSubscriptionRequest,
  output: CreateLogSubscriptionResult,
  errors: [
    ClientException,
    EntityAlreadyExistsException,
    EntityDoesNotExistException,
    InsufficientPermissionsException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Deactivates access to directory data via the Directory Service Data API for the specified directory. For
 * more information, see Directory Service Data API Reference.
 */
export const disableDirectoryDataAccess: (
  input: DisableDirectoryDataAccessRequest,
) => Effect.Effect<
  DisableDirectoryDataAccessResult,
  | AccessDeniedException
  | ClientException
  | DirectoryDoesNotExistException
  | DirectoryInDesiredStateException
  | DirectoryUnavailableException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisableDirectoryDataAccessRequest,
  output: DisableDirectoryDataAccessResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryDoesNotExistException,
    DirectoryInDesiredStateException,
    DirectoryUnavailableException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Enables access to directory data via the Directory Service Data API for the specified directory. For
 * more information, see Directory Service Data API Reference.
 */
export const enableDirectoryDataAccess: (
  input: EnableDirectoryDataAccessRequest,
) => Effect.Effect<
  EnableDirectoryDataAccessResult,
  | AccessDeniedException
  | ClientException
  | DirectoryDoesNotExistException
  | DirectoryInDesiredStateException
  | DirectoryUnavailableException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableDirectoryDataAccessRequest,
  output: EnableDirectoryDataAccessResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryDoesNotExistException,
    DirectoryInDesiredStateException,
    DirectoryUnavailableException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Creates a snapshot of a Simple AD or Microsoft AD directory in the Amazon Web Services cloud.
 *
 * You cannot take snapshots of AD Connector directories.
 */
export const createSnapshot: (
  input: CreateSnapshotRequest,
) => Effect.Effect<
  CreateSnapshotResult,
  | ClientException
  | EntityDoesNotExistException
  | InvalidParameterException
  | ServiceException
  | SnapshotLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotRequest,
  output: CreateSnapshotResult,
  errors: [
    ClientException,
    EntityDoesNotExistException,
    InvalidParameterException,
    ServiceException,
    SnapshotLimitExceededException,
  ],
}));
/**
 * Updates directory configuration for the specified update type.
 */
export const updateDirectorySetup: (
  input: UpdateDirectorySetupRequest,
) => Effect.Effect<
  UpdateDirectorySetupResult,
  | AccessDeniedException
  | ClientException
  | DirectoryDoesNotExistException
  | DirectoryInDesiredStateException
  | DirectoryUnavailableException
  | InvalidParameterException
  | ServiceException
  | SnapshotLimitExceededException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDirectorySetupRequest,
  output: UpdateDirectorySetupResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryDoesNotExistException,
    DirectoryInDesiredStateException,
    DirectoryUnavailableException,
    InvalidParameterException,
    ServiceException,
    SnapshotLimitExceededException,
    UnsupportedOperationException,
  ],
}));
/**
 * Activates the switch for the specific directory to always use LDAP secure calls.
 */
export const enableLDAPS: (
  input: EnableLDAPSRequest,
) => Effect.Effect<
  EnableLDAPSResult,
  | ClientException
  | DirectoryDoesNotExistException
  | DirectoryUnavailableException
  | InvalidLDAPSStatusException
  | InvalidParameterException
  | NoAvailableCertificateException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableLDAPSRequest,
  output: EnableLDAPSResult,
  errors: [
    ClientException,
    DirectoryDoesNotExistException,
    DirectoryUnavailableException,
    InvalidLDAPSStatusException,
    InvalidParameterException,
    NoAvailableCertificateException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Enables alternative client authentication methods for the specified directory.
 */
export const enableClientAuthentication: (
  input: EnableClientAuthenticationRequest,
) => Effect.Effect<
  EnableClientAuthenticationResult,
  | AccessDeniedException
  | ClientException
  | DirectoryDoesNotExistException
  | InvalidClientAuthStatusException
  | NoAvailableCertificateException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: EnableClientAuthenticationRequest,
  output: EnableClientAuthenticationResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryDoesNotExistException,
    InvalidClientAuthStatusException,
    NoAvailableCertificateException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Registers a certificate for a secure LDAP or client certificate authentication.
 */
export const registerCertificate: (
  input: RegisterCertificateRequest,
) => Effect.Effect<
  RegisterCertificateResult,
  | CertificateAlreadyExistsException
  | CertificateLimitExceededException
  | ClientException
  | DirectoryDoesNotExistException
  | DirectoryUnavailableException
  | InvalidCertificateException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterCertificateRequest,
  output: RegisterCertificateResult,
  errors: [
    CertificateAlreadyExistsException,
    CertificateLimitExceededException,
    ClientException,
    DirectoryDoesNotExistException,
    DirectoryUnavailableException,
    InvalidCertificateException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
  ],
}));
/**
 * Updates the configurable settings for the specified directory.
 */
export const updateSettings: (
  input: UpdateSettingsRequest,
) => Effect.Effect<
  UpdateSettingsResult,
  | ClientException
  | DirectoryDoesNotExistException
  | DirectoryUnavailableException
  | IncompatibleSettingsException
  | InvalidParameterException
  | ServiceException
  | UnsupportedOperationException
  | UnsupportedSettingsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSettingsRequest,
  output: UpdateSettingsResult,
  errors: [
    ClientException,
    DirectoryDoesNotExistException,
    DirectoryUnavailableException,
    IncompatibleSettingsException,
    InvalidParameterException,
    ServiceException,
    UnsupportedOperationException,
    UnsupportedSettingsException,
  ],
}));
/**
 * Resets the password for any user in your Managed Microsoft AD or Simple AD directory. Disabled
 * users will become enabled and can be authenticated following the API call.
 *
 * You can reset the password for any user in your directory with the following
 * exceptions:
 *
 * - For Simple AD, you cannot reset the password for any user that is a member of either
 * the **Domain Admins** or Enterprise
 * Admins group except for the administrator user.
 *
 * - For Managed Microsoft AD, you can only reset the password for a user that is in an OU based
 * off of the NetBIOS name that you typed when you created your directory. For example, you
 * cannot reset the password for a user in the Amazon Web Services
 * Reserved OU. For more information about the OU structure for an Managed Microsoft AD
 * directory, see What Gets Created in the Directory Service Administration
 * Guide.
 */
export const resetUserPassword: (
  input: ResetUserPasswordRequest,
) => Effect.Effect<
  ResetUserPasswordResult,
  | ClientException
  | DirectoryUnavailableException
  | EntityDoesNotExistException
  | InvalidPasswordException
  | ServiceException
  | UnsupportedOperationException
  | UserDoesNotExistException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetUserPasswordRequest,
  output: ResetUserPasswordResult,
  errors: [
    ClientException,
    DirectoryUnavailableException,
    EntityDoesNotExistException,
    InvalidPasswordException,
    ServiceException,
    UnsupportedOperationException,
    UserDoesNotExistException,
  ],
}));
/**
 * Shares a specified directory (`DirectoryId`) in your Amazon Web Services account (directory
 * owner) with another Amazon Web Services account (directory consumer). With this operation you can use your
 * directory from any Amazon Web Services account and from any Amazon VPC within an Amazon Web Services Region.
 *
 * When you share your Managed Microsoft AD directory, Directory Service creates a shared directory in the
 * directory consumer account. This shared directory contains the metadata to provide access to
 * the directory within the directory owner account. The shared directory is visible in all VPCs
 * in the directory consumer account.
 *
 * The `ShareMethod` parameter determines whether the specified directory can be
 * shared between Amazon Web Services accounts inside the same Amazon Web Services organization (`ORGANIZATIONS`).
 * It also determines whether you can share the directory with any other Amazon Web Services account either
 * inside or outside of the organization (`HANDSHAKE`).
 *
 * The `ShareNotes` parameter is only used when `HANDSHAKE` is called,
 * which sends a directory sharing request to the directory consumer.
 */
export const shareDirectory: (
  input: ShareDirectoryRequest,
) => Effect.Effect<
  ShareDirectoryResult,
  | AccessDeniedException
  | ClientException
  | DirectoryAlreadySharedException
  | EntityDoesNotExistException
  | InvalidParameterException
  | InvalidTargetException
  | OrganizationsException
  | ServiceException
  | ShareLimitExceededException
  | UnsupportedOperationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ShareDirectoryRequest,
  output: ShareDirectoryResult,
  errors: [
    AccessDeniedException,
    ClientException,
    DirectoryAlreadySharedException,
    EntityDoesNotExistException,
    InvalidParameterException,
    InvalidTargetException,
    OrganizationsException,
    ServiceException,
    ShareLimitExceededException,
    UnsupportedOperationException,
  ],
}));
