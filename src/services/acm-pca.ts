import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "ACM PCA",
  serviceShapeName: "ACMPrivateCA",
});
const auth = T.AwsAuthSigv4({ name: "acm-pca" });
const ver = T.ServiceVersion("2017-08-22");
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
                        url: "https://acm-pca-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://acm-pca.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://acm-pca-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://acm-pca.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://acm-pca.{Region}.{PartitionResult#dnsSuffix}",
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
export const ActionList = S.Array(S.String);
export class CreateCertificateAuthorityAuditReportRequest extends S.Class<CreateCertificateAuthorityAuditReportRequest>(
  "CreateCertificateAuthorityAuditReportRequest",
)(
  {
    CertificateAuthorityArn: S.String,
    S3BucketName: S.String,
    AuditReportResponseFormat: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePermissionRequest extends S.Class<CreatePermissionRequest>(
  "CreatePermissionRequest",
)(
  {
    CertificateAuthorityArn: S.String,
    Principal: S.String,
    SourceAccount: S.optional(S.String),
    Actions: ActionList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePermissionResponse extends S.Class<CreatePermissionResponse>(
  "CreatePermissionResponse",
)({}) {}
export class DeleteCertificateAuthorityRequest extends S.Class<DeleteCertificateAuthorityRequest>(
  "DeleteCertificateAuthorityRequest",
)(
  {
    CertificateAuthorityArn: S.String,
    PermanentDeletionTimeInDays: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCertificateAuthorityResponse extends S.Class<DeleteCertificateAuthorityResponse>(
  "DeleteCertificateAuthorityResponse",
)({}) {}
export class DeletePermissionRequest extends S.Class<DeletePermissionRequest>(
  "DeletePermissionRequest",
)(
  {
    CertificateAuthorityArn: S.String,
    Principal: S.String,
    SourceAccount: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePermissionResponse extends S.Class<DeletePermissionResponse>(
  "DeletePermissionResponse",
)({}) {}
export class DeletePolicyRequest extends S.Class<DeletePolicyRequest>(
  "DeletePolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePolicyResponse extends S.Class<DeletePolicyResponse>(
  "DeletePolicyResponse",
)({}) {}
export class DescribeCertificateAuthorityRequest extends S.Class<DescribeCertificateAuthorityRequest>(
  "DescribeCertificateAuthorityRequest",
)(
  { CertificateAuthorityArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCertificateAuthorityAuditReportRequest extends S.Class<DescribeCertificateAuthorityAuditReportRequest>(
  "DescribeCertificateAuthorityAuditReportRequest",
)(
  { CertificateAuthorityArn: S.String, AuditReportId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCertificateRequest extends S.Class<GetCertificateRequest>(
  "GetCertificateRequest",
)(
  { CertificateAuthorityArn: S.String, CertificateArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCertificateAuthorityCertificateRequest extends S.Class<GetCertificateAuthorityCertificateRequest>(
  "GetCertificateAuthorityCertificateRequest",
)(
  { CertificateAuthorityArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCertificateAuthorityCsrRequest extends S.Class<GetCertificateAuthorityCsrRequest>(
  "GetCertificateAuthorityCsrRequest",
)(
  { CertificateAuthorityArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPolicyRequest extends S.Class<GetPolicyRequest>(
  "GetPolicyRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportCertificateAuthorityCertificateRequest extends S.Class<ImportCertificateAuthorityCertificateRequest>(
  "ImportCertificateAuthorityCertificateRequest",
)(
  {
    CertificateAuthorityArn: S.String,
    Certificate: T.Blob,
    CertificateChain: S.optional(T.Blob),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportCertificateAuthorityCertificateResponse extends S.Class<ImportCertificateAuthorityCertificateResponse>(
  "ImportCertificateAuthorityCertificateResponse",
)({}) {}
export class ListCertificateAuthoritiesRequest extends S.Class<ListCertificateAuthoritiesRequest>(
  "ListCertificateAuthoritiesRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    ResourceOwner: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPermissionsRequest extends S.Class<ListPermissionsRequest>(
  "ListPermissionsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    CertificateAuthorityArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsRequest extends S.Class<ListTagsRequest>(
  "ListTagsRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    CertificateAuthorityArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutPolicyRequest extends S.Class<PutPolicyRequest>(
  "PutPolicyRequest",
)(
  { ResourceArn: S.String, Policy: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutPolicyResponse extends S.Class<PutPolicyResponse>(
  "PutPolicyResponse",
)({}) {}
export class RestoreCertificateAuthorityRequest extends S.Class<RestoreCertificateAuthorityRequest>(
  "RestoreCertificateAuthorityRequest",
)(
  { CertificateAuthorityArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RestoreCertificateAuthorityResponse extends S.Class<RestoreCertificateAuthorityResponse>(
  "RestoreCertificateAuthorityResponse",
)({}) {}
export class RevokeCertificateRequest extends S.Class<RevokeCertificateRequest>(
  "RevokeCertificateRequest",
)(
  {
    CertificateAuthorityArn: S.String,
    CertificateSerial: S.String,
    RevocationReason: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RevokeCertificateResponse extends S.Class<RevokeCertificateResponse>(
  "RevokeCertificateResponse",
)({}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class TagCertificateAuthorityRequest extends S.Class<TagCertificateAuthorityRequest>(
  "TagCertificateAuthorityRequest",
)(
  { CertificateAuthorityArn: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagCertificateAuthorityResponse extends S.Class<TagCertificateAuthorityResponse>(
  "TagCertificateAuthorityResponse",
)({}) {}
export class UntagCertificateAuthorityRequest extends S.Class<UntagCertificateAuthorityRequest>(
  "UntagCertificateAuthorityRequest",
)(
  { CertificateAuthorityArn: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagCertificateAuthorityResponse extends S.Class<UntagCertificateAuthorityResponse>(
  "UntagCertificateAuthorityResponse",
)({}) {}
export class CrlDistributionPointExtensionConfiguration extends S.Class<CrlDistributionPointExtensionConfiguration>(
  "CrlDistributionPointExtensionConfiguration",
)({ OmitExtension: S.Boolean }) {}
export class CrlConfiguration extends S.Class<CrlConfiguration>(
  "CrlConfiguration",
)({
  Enabled: S.Boolean,
  ExpirationInDays: S.optional(S.Number),
  CustomCname: S.optional(S.String),
  S3BucketName: S.optional(S.String),
  S3ObjectAcl: S.optional(S.String),
  CrlDistributionPointExtensionConfiguration: S.optional(
    CrlDistributionPointExtensionConfiguration,
  ),
  CrlType: S.optional(S.String),
  CustomPath: S.optional(S.String),
}) {}
export class OcspConfiguration extends S.Class<OcspConfiguration>(
  "OcspConfiguration",
)({ Enabled: S.Boolean, OcspCustomCname: S.optional(S.String) }) {}
export class RevocationConfiguration extends S.Class<RevocationConfiguration>(
  "RevocationConfiguration",
)({
  CrlConfiguration: S.optional(CrlConfiguration),
  OcspConfiguration: S.optional(OcspConfiguration),
}) {}
export class UpdateCertificateAuthorityRequest extends S.Class<UpdateCertificateAuthorityRequest>(
  "UpdateCertificateAuthorityRequest",
)(
  {
    CertificateAuthorityArn: S.String,
    RevocationConfiguration: S.optional(RevocationConfiguration),
    Status: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCertificateAuthorityResponse extends S.Class<UpdateCertificateAuthorityResponse>(
  "UpdateCertificateAuthorityResponse",
)({}) {}
export class Validity extends S.Class<Validity>("Validity")({
  Value: S.Number,
  Type: S.String,
}) {}
export class CustomAttribute extends S.Class<CustomAttribute>(
  "CustomAttribute",
)({ ObjectIdentifier: S.String, Value: S.String }) {}
export const CustomAttributeList = S.Array(CustomAttribute);
export class ASN1Subject extends S.Class<ASN1Subject>("ASN1Subject")({
  Country: S.optional(S.String),
  Organization: S.optional(S.String),
  OrganizationalUnit: S.optional(S.String),
  DistinguishedNameQualifier: S.optional(S.String),
  State: S.optional(S.String),
  CommonName: S.optional(S.String),
  SerialNumber: S.optional(S.String),
  Locality: S.optional(S.String),
  Title: S.optional(S.String),
  Surname: S.optional(S.String),
  GivenName: S.optional(S.String),
  Initials: S.optional(S.String),
  Pseudonym: S.optional(S.String),
  GenerationQualifier: S.optional(S.String),
  CustomAttributes: S.optional(CustomAttributeList),
}) {}
export class KeyUsage extends S.Class<KeyUsage>("KeyUsage")({
  DigitalSignature: S.optional(S.Boolean),
  NonRepudiation: S.optional(S.Boolean),
  KeyEncipherment: S.optional(S.Boolean),
  DataEncipherment: S.optional(S.Boolean),
  KeyAgreement: S.optional(S.Boolean),
  KeyCertSign: S.optional(S.Boolean),
  CRLSign: S.optional(S.Boolean),
  EncipherOnly: S.optional(S.Boolean),
  DecipherOnly: S.optional(S.Boolean),
}) {}
export class AccessMethod extends S.Class<AccessMethod>("AccessMethod")({
  CustomObjectIdentifier: S.optional(S.String),
  AccessMethodType: S.optional(S.String),
}) {}
export class OtherName extends S.Class<OtherName>("OtherName")({
  TypeId: S.String,
  Value: S.String,
}) {}
export class EdiPartyName extends S.Class<EdiPartyName>("EdiPartyName")({
  PartyName: S.String,
  NameAssigner: S.optional(S.String),
}) {}
export class GeneralName extends S.Class<GeneralName>("GeneralName")({
  OtherName: S.optional(OtherName),
  Rfc822Name: S.optional(S.String),
  DnsName: S.optional(S.String),
  DirectoryName: S.optional(ASN1Subject),
  EdiPartyName: S.optional(EdiPartyName),
  UniformResourceIdentifier: S.optional(S.String),
  IpAddress: S.optional(S.String),
  RegisteredId: S.optional(S.String),
}) {}
export class AccessDescription extends S.Class<AccessDescription>(
  "AccessDescription",
)({ AccessMethod: AccessMethod, AccessLocation: GeneralName }) {}
export const AccessDescriptionList = S.Array(AccessDescription);
export class CsrExtensions extends S.Class<CsrExtensions>("CsrExtensions")({
  KeyUsage: S.optional(KeyUsage),
  SubjectInformationAccess: S.optional(AccessDescriptionList),
}) {}
export class CertificateAuthorityConfiguration extends S.Class<CertificateAuthorityConfiguration>(
  "CertificateAuthorityConfiguration",
)({
  KeyAlgorithm: S.String,
  SigningAlgorithm: S.String,
  Subject: ASN1Subject,
  CsrExtensions: S.optional(CsrExtensions),
}) {}
export class CertificateAuthority extends S.Class<CertificateAuthority>(
  "CertificateAuthority",
)({
  Arn: S.optional(S.String),
  OwnerAccount: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastStateChangeAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Type: S.optional(S.String),
  Serial: S.optional(S.String),
  Status: S.optional(S.String),
  NotBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NotAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureReason: S.optional(S.String),
  CertificateAuthorityConfiguration: S.optional(
    CertificateAuthorityConfiguration,
  ),
  RevocationConfiguration: S.optional(RevocationConfiguration),
  RestorableUntil: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  KeyStorageSecurityStandard: S.optional(S.String),
  UsageMode: S.optional(S.String),
}) {}
export const CertificateAuthorities = S.Array(CertificateAuthority);
export class CreateCertificateAuthorityAuditReportResponse extends S.Class<CreateCertificateAuthorityAuditReportResponse>(
  "CreateCertificateAuthorityAuditReportResponse",
)({ AuditReportId: S.optional(S.String), S3Key: S.optional(S.String) }) {}
export class DescribeCertificateAuthorityAuditReportResponse extends S.Class<DescribeCertificateAuthorityAuditReportResponse>(
  "DescribeCertificateAuthorityAuditReportResponse",
)({
  AuditReportStatus: S.optional(S.String),
  S3BucketName: S.optional(S.String),
  S3Key: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetCertificateResponse extends S.Class<GetCertificateResponse>(
  "GetCertificateResponse",
)({
  Certificate: S.optional(S.String),
  CertificateChain: S.optional(S.String),
}) {}
export class GetCertificateAuthorityCertificateResponse extends S.Class<GetCertificateAuthorityCertificateResponse>(
  "GetCertificateAuthorityCertificateResponse",
)({
  Certificate: S.optional(S.String),
  CertificateChain: S.optional(S.String),
}) {}
export class GetCertificateAuthorityCsrResponse extends S.Class<GetCertificateAuthorityCsrResponse>(
  "GetCertificateAuthorityCsrResponse",
)({ Csr: S.optional(S.String) }) {}
export class GetPolicyResponse extends S.Class<GetPolicyResponse>(
  "GetPolicyResponse",
)({ Policy: S.optional(S.String) }) {}
export class ListCertificateAuthoritiesResponse extends S.Class<ListCertificateAuthoritiesResponse>(
  "ListCertificateAuthoritiesResponse",
)({
  NextToken: S.optional(S.String),
  CertificateAuthorities: S.optional(CertificateAuthorities),
}) {}
export class ListTagsResponse extends S.Class<ListTagsResponse>(
  "ListTagsResponse",
)({ NextToken: S.optional(S.String), Tags: S.optional(TagList) }) {}
export class Permission extends S.Class<Permission>("Permission")({
  CertificateAuthorityArn: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Principal: S.optional(S.String),
  SourceAccount: S.optional(S.String),
  Actions: S.optional(ActionList),
  Policy: S.optional(S.String),
}) {}
export const PermissionList = S.Array(Permission);
export class ExtendedKeyUsage extends S.Class<ExtendedKeyUsage>(
  "ExtendedKeyUsage",
)({
  ExtendedKeyUsageType: S.optional(S.String),
  ExtendedKeyUsageObjectIdentifier: S.optional(S.String),
}) {}
export const ExtendedKeyUsageList = S.Array(ExtendedKeyUsage);
export class CustomExtension extends S.Class<CustomExtension>(
  "CustomExtension",
)({
  ObjectIdentifier: S.String,
  Value: S.String,
  Critical: S.optional(S.Boolean),
}) {}
export const CustomExtensionList = S.Array(CustomExtension);
export class DescribeCertificateAuthorityResponse extends S.Class<DescribeCertificateAuthorityResponse>(
  "DescribeCertificateAuthorityResponse",
)({ CertificateAuthority: S.optional(CertificateAuthority) }) {}
export class ListPermissionsResponse extends S.Class<ListPermissionsResponse>(
  "ListPermissionsResponse",
)({
  NextToken: S.optional(S.String),
  Permissions: S.optional(PermissionList),
}) {}
export const GeneralNameList = S.Array(GeneralName);
export class Qualifier extends S.Class<Qualifier>("Qualifier")({
  CpsUri: S.String,
}) {}
export class PolicyQualifierInfo extends S.Class<PolicyQualifierInfo>(
  "PolicyQualifierInfo",
)({ PolicyQualifierId: S.String, Qualifier: Qualifier }) {}
export const PolicyQualifierInfoList = S.Array(PolicyQualifierInfo);
export class PolicyInformation extends S.Class<PolicyInformation>(
  "PolicyInformation",
)({
  CertPolicyId: S.String,
  PolicyQualifiers: S.optional(PolicyQualifierInfoList),
}) {}
export const CertificatePolicyList = S.Array(PolicyInformation);
export class CreateCertificateAuthorityRequest extends S.Class<CreateCertificateAuthorityRequest>(
  "CreateCertificateAuthorityRequest",
)(
  {
    CertificateAuthorityConfiguration: CertificateAuthorityConfiguration,
    RevocationConfiguration: S.optional(RevocationConfiguration),
    CertificateAuthorityType: S.String,
    IdempotencyToken: S.optional(S.String),
    KeyStorageSecurityStandard: S.optional(S.String),
    Tags: S.optional(TagList),
    UsageMode: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Extensions extends S.Class<Extensions>("Extensions")({
  CertificatePolicies: S.optional(CertificatePolicyList),
  ExtendedKeyUsage: S.optional(ExtendedKeyUsageList),
  KeyUsage: S.optional(KeyUsage),
  SubjectAlternativeNames: S.optional(GeneralNameList),
  CustomExtensions: S.optional(CustomExtensionList),
}) {}
export class ApiPassthrough extends S.Class<ApiPassthrough>("ApiPassthrough")({
  Extensions: S.optional(Extensions),
  Subject: S.optional(ASN1Subject),
}) {}
export class CreateCertificateAuthorityResponse extends S.Class<CreateCertificateAuthorityResponse>(
  "CreateCertificateAuthorityResponse",
)({ CertificateAuthorityArn: S.optional(S.String) }) {}
export class IssueCertificateRequest extends S.Class<IssueCertificateRequest>(
  "IssueCertificateRequest",
)(
  {
    ApiPassthrough: S.optional(ApiPassthrough),
    CertificateAuthorityArn: S.String,
    Csr: T.Blob,
    SigningAlgorithm: S.String,
    TemplateArn: S.optional(S.String),
    Validity: Validity,
    ValidityNotBefore: S.optional(Validity),
    IdempotencyToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IssueCertificateResponse extends S.Class<IssueCertificateResponse>(
  "IssueCertificateResponse",
)({ CertificateArn: S.optional(S.String) }) {}

//# Errors
export class InvalidArnException extends S.TaggedError<InvalidArnException>()(
  "InvalidArnException",
  { message: S.optional(S.String) },
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { message: S.optional(S.String) },
) {}
export class CertificateMismatchException extends S.TaggedError<CertificateMismatchException>()(
  "CertificateMismatchException",
  { message: S.optional(S.String) },
) {}
export class InvalidArgsException extends S.TaggedError<InvalidArgsException>()(
  "InvalidArgsException",
  { message: S.optional(S.String) },
) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { message: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { message: S.optional(S.String) },
) {}
export class InvalidPolicyException extends S.TaggedError<InvalidPolicyException>()(
  "InvalidPolicyException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class MalformedCertificateException extends S.TaggedError<MalformedCertificateException>()(
  "MalformedCertificateException",
  { message: S.optional(S.String) },
) {}
export class RequestFailedException extends S.TaggedError<RequestFailedException>()(
  "RequestFailedException",
  { message: S.optional(S.String) },
) {}
export class InvalidTagException extends S.TaggedError<InvalidTagException>()(
  "InvalidTagException",
  { message: S.optional(S.String) },
) {}
export class LockoutPreventedException extends S.TaggedError<LockoutPreventedException>()(
  "LockoutPreventedException",
  { message: S.optional(S.String) },
) {}
export class PermissionAlreadyExistsException extends S.TaggedError<PermissionAlreadyExistsException>()(
  "PermissionAlreadyExistsException",
  { message: S.optional(S.String) },
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { message: S.optional(S.String) },
) {}
export class RequestAlreadyProcessedException extends S.TaggedError<RequestAlreadyProcessedException>()(
  "RequestAlreadyProcessedException",
  { message: S.optional(S.String) },
) {}
export class RequestInProgressException extends S.TaggedError<RequestInProgressException>()(
  "RequestInProgressException",
  { message: S.optional(S.String) },
) {}
export class MalformedCSRException extends S.TaggedError<MalformedCSRException>()(
  "MalformedCSRException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the private certificate authorities that you created by using the CreateCertificateAuthority action.
 */
export const listCertificateAuthorities =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCertificateAuthoritiesRequest,
    output: ListCertificateAuthoritiesResponse,
    errors: [InvalidNextTokenException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "CertificateAuthorities",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists information about your private certificate authority (CA) or one that has been shared with you. You specify the private CA on input by its ARN (Amazon Resource Name). The output contains the status of your CA. This can be any of the following:
 *
 * - `CREATING` - Amazon Web Services Private CA is creating your private certificate authority.
 *
 * - `PENDING_CERTIFICATE` - The certificate is pending. You must use your Amazon Web Services Private CA-hosted or on-premises root or subordinate CA to sign your private CA CSR and then import it into Amazon Web Services Private CA.
 *
 * - `ACTIVE` - Your private CA is active.
 *
 * - `DISABLED` - Your private CA has been disabled.
 *
 * - `EXPIRED` - Your private CA certificate has expired.
 *
 * - `FAILED` - Your private CA has failed. Your CA can fail because of problems such a network outage or back-end Amazon Web Services failure or other errors. A failed CA can never return to the pending state. You must create a new CA.
 *
 * - `DELETED` - Your private CA is within the restoration period, after which it is permanently deleted. The length of time remaining in the CA's restoration period is also included in this action's output.
 */
export const describeCertificateAuthority =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeCertificateAuthorityRequest,
    output: DescribeCertificateAuthorityResponse,
    errors: [InvalidArnException, ResourceNotFoundException],
  }));
/**
 * List all permissions on a private CA, if any, granted to the Certificate Manager (ACM) service principal (acm.amazonaws.com).
 *
 * These permissions allow ACM to issue and renew ACM certificates that reside in the same Amazon Web Services account as the CA.
 *
 * Permissions can be granted with the CreatePermission action and revoked with the DeletePermission action.
 * **About Permissions**
 *
 * - If the private CA and the certificates it issues reside in the same account, you can use `CreatePermission` to grant permissions for ACM to carry out automatic certificate renewals.
 *
 * - For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list certificates.
 *
 * - If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see Using a Resource Based Policy with Amazon Web Services Private CA.
 */
export const listPermissions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListPermissionsRequest,
    output: ListPermissionsResponse,
    errors: [
      InvalidArnException,
      InvalidNextTokenException,
      InvalidStateException,
      RequestFailedException,
      ResourceNotFoundException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Permissions",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Deletes the resource-based policy attached to a private CA. Deletion will remove any access that the policy has granted. If there is no policy attached to the private CA, this action will return successful.
 *
 * If you delete a policy that was applied through Amazon Web Services Resource Access Manager (RAM), the CA will be removed from all shares in which it was included.
 *
 * The Certificate Manager Service Linked Role that the policy supports is not affected when you delete the policy.
 *
 * The current policy can be shown with GetPolicy and updated with PutPolicy.
 * **About Policies**
 *
 * - A policy grants access on a private CA to an Amazon Web Services customer account, to Amazon Web Services Organizations, or to an Amazon Web Services Organizations unit. Policies are under the control of a CA administrator. For more information, see Using a Resource Based Policy with Amazon Web Services Private CA.
 *
 * - A policy permits a user of Certificate Manager (ACM) to issue ACM certificates signed by a CA in another account.
 *
 * - For ACM to manage automatic renewal of these certificates, the ACM user must configure a Service Linked Role (SLR). The SLR allows the ACM service to assume the identity of the user, subject to confirmation against the Amazon Web Services Private CA policy. For more information, see Using a Service Linked Role with ACM.
 *
 * - Updates made in Amazon Web Services Resource Manager (RAM) are reflected in policies. For more information, see Attach a Policy for Cross-Account Access.
 */
export const deletePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePolicyRequest,
  output: DeletePolicyResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArnException,
    InvalidStateException,
    LockoutPreventedException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists information about a specific audit report created by calling the CreateCertificateAuthorityAuditReport action. Audit information is created every time the certificate authority (CA) private key is used. The private key is used when you call the IssueCertificate action or the RevokeCertificate action.
 */
export const describeCertificateAuthorityAuditReport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeCertificateAuthorityAuditReportRequest,
    output: DescribeCertificateAuthorityAuditReportResponse,
    errors: [
      InvalidArgsException,
      InvalidArnException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Deletes a private certificate authority (CA). You must provide the Amazon Resource Name (ARN) of the private CA that you want to delete. You can find the ARN by calling the ListCertificateAuthorities action.
 *
 * Deleting a CA will invalidate other CAs and certificates below it in your CA hierarchy.
 *
 * Before you can delete a CA that you have created and activated, you must disable it. To do this, call the UpdateCertificateAuthority action and set the **CertificateAuthorityStatus** parameter to `DISABLED`.
 *
 * Additionally, you can delete a CA if you are waiting for it to be created (that is, the status of the CA is `CREATING`). You can also delete it if the CA has been created but you haven't yet imported the signed certificate into Amazon Web Services Private CA (that is, the status of the CA is `PENDING_CERTIFICATE`).
 *
 * When you successfully call DeleteCertificateAuthority, the CA's status changes to `DELETED`. However, the CA won't be permanently deleted until the restoration period has passed. By default, if you do not set the `PermanentDeletionTimeInDays` parameter, the CA remains restorable for 30 days. You can set the parameter from 7 to 30 days. The DescribeCertificateAuthority action returns the time remaining in the restoration window of a private CA in the `DELETED` state. To restore an eligible CA, call the RestoreCertificateAuthority action.
 *
 * A private CA can be deleted if it is in the `PENDING_CERTIFICATE`, `CREATING`, `EXPIRED`, `DISABLED`, or `FAILED` state. To delete a CA in the `ACTIVE` state, you must first disable it, or else the delete request results in an exception. If you are deleting a private CA in the `PENDING_CERTIFICATE` or `DISABLED` state, you can set the length of its restoration period to 7-30 days. The default is 30. During this time, the status is set to `DELETED` and the CA can be restored. A private CA deleted in the `CREATING` or `FAILED` state has no assigned restoration period and cannot be restored.
 */
export const deleteCertificateAuthority = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCertificateAuthorityRequest,
    output: DeleteCertificateAuthorityResponse,
    errors: [
      ConcurrentModificationException,
      InvalidArnException,
      InvalidStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Retrieves the certificate and certificate chain for your private certificate authority (CA) or one that has been shared with you. Both the certificate and the chain are base64 PEM-encoded. The chain does not include the CA certificate. Each certificate in the chain signs the one before it.
 */
export const getCertificateAuthorityCertificate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCertificateAuthorityCertificateRequest,
    output: GetCertificateAuthorityCertificateResponse,
    errors: [
      InvalidArnException,
      InvalidStateException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Restores a certificate authority (CA) that is in the `DELETED` state. You can restore a CA during the period that you defined in the **PermanentDeletionTimeInDays** parameter of the DeleteCertificateAuthority action. Currently, you can specify 7 to 30 days. If you did not specify a **PermanentDeletionTimeInDays** value, by default you can restore the CA at any time in a 30 day period. You can check the time remaining in the restoration period of a private CA in the `DELETED` state by calling the DescribeCertificateAuthority or ListCertificateAuthorities actions. The status of a restored CA is set to its pre-deletion status when the **RestoreCertificateAuthority** action returns. To change its status to `ACTIVE`, call the UpdateCertificateAuthority action. If the private CA was in the `PENDING_CERTIFICATE` state at deletion, you must use the ImportCertificateAuthorityCertificate action to import a certificate authority into the private CA before it can be activated. You cannot restore a CA after the restoration period has ended.
 */
export const restoreCertificateAuthority = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RestoreCertificateAuthorityRequest,
    output: RestoreCertificateAuthorityResponse,
    errors: [
      InvalidArnException,
      InvalidStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates the status or configuration of a private certificate authority (CA). Your private CA must be in the `ACTIVE` or `DISABLED` state before you can update it. You can disable a private CA that is in the `ACTIVE` state or make a CA that is in the `DISABLED` state active again.
 *
 * Both Amazon Web Services Private CA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Access policies for CRLs in Amazon S3.
 */
export const updateCertificateAuthority = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCertificateAuthorityRequest,
    output: UpdateCertificateAuthorityResponse,
    errors: [
      ConcurrentModificationException,
      InvalidArgsException,
      InvalidArnException,
      InvalidPolicyException,
      InvalidStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Retrieves the resource-based policy attached to a private CA. If either the private CA resource or the policy cannot be found, this action returns a `ResourceNotFoundException`.
 *
 * The policy can be attached or updated with PutPolicy and removed with DeletePolicy.
 * **About Policies**
 *
 * - A policy grants access on a private CA to an Amazon Web Services customer account, to Amazon Web Services Organizations, or to an Amazon Web Services Organizations unit. Policies are under the control of a CA administrator. For more information, see Using a Resource Based Policy with Amazon Web Services Private CA.
 *
 * - A policy permits a user of Certificate Manager (ACM) to issue ACM certificates signed by a CA in another account.
 *
 * - For ACM to manage automatic renewal of these certificates, the ACM user must configure a Service Linked Role (SLR). The SLR allows the ACM service to assume the identity of the user, subject to confirmation against the Amazon Web Services Private CA policy. For more information, see Using a Service Linked Role with ACM.
 *
 * - Updates made in Amazon Web Services Resource Manager (RAM) are reflected in policies. For more information, see Attach a Policy for Cross-Account Access.
 */
export const getPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPolicyRequest,
  output: GetPolicyResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the tags, if any, that are associated with your private CA or one that has been shared with you. Tags are labels that you can use to identify and organize your CAs. Each tag consists of a key and an optional value. Call the TagCertificateAuthority action to add one or more tags to your CA. Call the UntagCertificateAuthority action to remove tags.
 */
export const listTags = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsRequest,
  output: ListTagsResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tags",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Revokes permissions on a private CA granted to the Certificate Manager (ACM) service principal (acm.amazonaws.com).
 *
 * These permissions allow ACM to issue and renew ACM certificates that reside in the same Amazon Web Services account as the CA. If you revoke these permissions, ACM will no longer renew the affected certificates automatically.
 *
 * Permissions can be granted with the CreatePermission action and listed with the ListPermissions action.
 * **About Permissions**
 *
 * - If the private CA and the certificates it issues reside in the same account, you can use `CreatePermission` to grant permissions for ACM to carry out automatic certificate renewals.
 *
 * - For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list certificates.
 *
 * - If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see Using a Resource Based Policy with Amazon Web Services Private CA.
 */
export const deletePermission = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePermissionRequest,
  output: DeletePermissionResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Remove one or more tags from your private CA. A tag consists of a key-value pair. If you do not specify the value portion of the tag when calling this action, the tag will be removed regardless of value. If you specify a value, the tag is removed only if it is associated with the specified value. To add tags to a private CA, use the TagCertificateAuthority. Call the ListTags action to see what tags are associated with your CA.
 */
export const untagCertificateAuthority = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UntagCertificateAuthorityRequest,
    output: UntagCertificateAuthorityResponse,
    errors: [
      InvalidArnException,
      InvalidStateException,
      InvalidTagException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Attaches a resource-based policy to a private CA.
 *
 * A policy can also be applied by sharing a private CA through Amazon Web Services Resource Access Manager (RAM). For more information, see Attach a Policy for Cross-Account Access.
 *
 * The policy can be displayed with GetPolicy and removed with DeletePolicy.
 * **About Policies**
 *
 * - A policy grants access on a private CA to an Amazon Web Services customer account, to Amazon Web Services Organizations, or to an Amazon Web Services Organizations unit. Policies are under the control of a CA administrator. For more information, see Using a Resource Based Policy with Amazon Web Services Private CA.
 *
 * - A policy permits a user of Certificate Manager (ACM) to issue ACM certificates signed by a CA in another account.
 *
 * - For ACM to manage automatic renewal of these certificates, the ACM user must configure a Service Linked Role (SLR). The SLR allows the ACM service to assume the identity of the user, subject to confirmation against the Amazon Web Services Private CA policy. For more information, see Using a Service Linked Role with ACM.
 *
 * - Updates made in Amazon Web Services Resource Manager (RAM) are reflected in policies. For more information, see Attach a Policy for Cross-Account Access.
 */
export const putPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPolicyRequest,
  output: PutPolicyResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArnException,
    InvalidPolicyException,
    InvalidStateException,
    LockoutPreventedException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Grants one or more permissions on a private CA to the Certificate Manager (ACM) service principal (`acm.amazonaws.com`). These permissions allow ACM to issue and renew ACM certificates that reside in the same Amazon Web Services account as the CA.
 *
 * You can list current permissions with the ListPermissions action and revoke them with the DeletePermission action.
 * **About Permissions**
 *
 * - If the private CA and the certificates it issues reside in the same account, you can use `CreatePermission` to grant permissions for ACM to carry out automatic certificate renewals.
 *
 * - For automatic certificate renewal to succeed, the ACM service principal needs permissions to create, retrieve, and list certificates.
 *
 * - If the private CA and the ACM certificates reside in different accounts, then permissions cannot be used to enable automatic renewals. Instead, the ACM certificate owner must set up a resource-based policy to enable cross-account issuance and renewals. For more information, see Using a Resource Based Policy with Amazon Web Services Private CA.
 */
export const createPermission = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePermissionRequest,
  output: CreatePermissionResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    LimitExceededException,
    PermissionAlreadyExistsException,
    RequestFailedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds one or more tags to your private CA. Tags are labels that you can use to identify and organize your Amazon Web Services resources. Each tag consists of a key and an optional value. You specify the private CA on input by its Amazon Resource Name (ARN). You specify the tag by using a key-value pair. You can apply a tag to just one private CA if you want to identify a specific characteristic of that CA, or you can apply the same tag to multiple private CAs if you want to filter for a common relationship among those CAs. To remove one or more tags, use the UntagCertificateAuthority action. Call the ListTags action to see what tags are associated with your CA.
 *
 * To attach tags to a private CA during the creation procedure, a CA administrator must first associate an inline IAM policy with the `CreateCertificateAuthority` action and explicitly allow tagging. For more information, see Attaching tags to a CA at the time of creation.
 */
export const tagCertificateAuthority = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: TagCertificateAuthorityRequest,
    output: TagCertificateAuthorityResponse,
    errors: [
      InvalidArnException,
      InvalidStateException,
      InvalidTagException,
      ResourceNotFoundException,
      TooManyTagsException,
    ],
  }),
);
/**
 * Retrieves a certificate from your private CA or one that has been shared with you. The ARN of the certificate is returned when you call the IssueCertificate action. You must specify both the ARN of your private CA and the ARN of the issued certificate when calling the **GetCertificate** action. You can retrieve the certificate if it is in the **ISSUED**, **EXPIRED**, or **REVOKED** state. You can call the CreateCertificateAuthorityAuditReport action to create a report that contains information about all of the certificates issued and revoked by your private CA.
 */
export const getCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCertificateRequest,
  output: GetCertificateResponse,
  errors: [
    InvalidArnException,
    InvalidStateException,
    RequestFailedException,
    RequestInProgressException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves the certificate signing request (CSR) for your private certificate authority (CA). The CSR is created when you call the CreateCertificateAuthority action. Sign the CSR with your Amazon Web Services Private CA-hosted or on-premises root or subordinate CA. Then import the signed certificate back into Amazon Web Services Private CA by calling the ImportCertificateAuthorityCertificate action. The CSR is returned as a base64 PEM-encoded string.
 */
export const getCertificateAuthorityCsr = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCertificateAuthorityCsrRequest,
    output: GetCertificateAuthorityCsrResponse,
    errors: [
      InvalidArnException,
      InvalidStateException,
      RequestFailedException,
      RequestInProgressException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates an audit report that lists every time that your CA private key is used to issue a certificate. The IssueCertificate and RevokeCertificate actions use the private key.
 *
 * To save the audit report to your designated Amazon S3 bucket, you must create a bucket policy that grants Amazon Web Services Private CA permission to access and write to it. For an example policy, see Prepare an Amazon S3 bucket for audit reports.
 *
 * Amazon Web Services Private CA assets that are stored in Amazon S3 can be protected with encryption. For more information, see Encrypting Your Audit Reports.
 *
 * You can generate a maximum of one report every 30 minutes.
 */
export const createCertificateAuthorityAuditReport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateCertificateAuthorityAuditReportRequest,
    output: CreateCertificateAuthorityAuditReportResponse,
    errors: [
      InvalidArgsException,
      InvalidArnException,
      InvalidStateException,
      RequestFailedException,
      RequestInProgressException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Imports a signed private CA certificate into Amazon Web Services Private CA. This action is used when you are using a chain of trust whose root is located outside Amazon Web Services Private CA. Before you can call this action, the following preparations must in place:
 *
 * - In Amazon Web Services Private CA, call the CreateCertificateAuthority action to create the private CA that you plan to back with the imported certificate.
 *
 * - Call the GetCertificateAuthorityCsr action to generate a certificate signing request (CSR).
 *
 * - Sign the CSR using a root or intermediate CA hosted by either an on-premises PKI hierarchy or by a commercial CA.
 *
 * - Create a certificate chain and copy the signed certificate and the certificate chain to your working directory.
 *
 * Amazon Web Services Private CA supports three scenarios for installing a CA certificate:
 *
 * - Installing a certificate for a root CA hosted by Amazon Web Services Private CA.
 *
 * - Installing a subordinate CA certificate whose parent authority is hosted by Amazon Web Services Private CA.
 *
 * - Installing a subordinate CA certificate whose parent authority is externally hosted.
 *
 * The following additional requirements apply when you import a CA certificate.
 *
 * - Only a self-signed certificate can be imported as a root CA.
 *
 * - A self-signed certificate cannot be imported as a subordinate CA.
 *
 * - Your certificate chain must not include the private CA certificate that you are importing.
 *
 * - Your root CA must be the last certificate in your chain. The subordinate certificate, if any, that your root CA signed must be next to last. The subordinate certificate signed by the preceding subordinate CA must come next, and so on until your chain is built.
 *
 * - The chain must be PEM-encoded.
 *
 * - The maximum allowed size of a certificate is 32 KB.
 *
 * - The maximum allowed size of a certificate chain is 2 MB.
 *
 * *Enforcement of Critical Constraints*
 *
 * Amazon Web Services Private CA allows the following extensions to be marked critical in the imported CA certificate or chain.
 *
 * - Authority key identifier
 *
 * - Basic constraints (*must* be marked critical)
 *
 * - Certificate policies
 *
 * - Extended key usage
 *
 * - Inhibit anyPolicy
 *
 * - Issuer alternative name
 *
 * - Key usage
 *
 * - Name constraints
 *
 * - Policy mappings
 *
 * - Subject alternative name
 *
 * - Subject directory attributes
 *
 * - Subject key identifier
 *
 * - Subject information access
 *
 * Amazon Web Services Private CA rejects the following extensions when they are marked critical in an imported CA certificate or chain.
 *
 * - Authority information access
 *
 * - CRL distribution points
 *
 * - Freshest CRL
 *
 * - Policy constraints
 *
 * Amazon Web Services Private Certificate Authority will also reject any other extension marked as critical not contained on the preceding list of allowed extensions.
 */
export const importCertificateAuthorityCertificate =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ImportCertificateAuthorityCertificateRequest,
    output: ImportCertificateAuthorityCertificateResponse,
    errors: [
      CertificateMismatchException,
      ConcurrentModificationException,
      InvalidArnException,
      InvalidRequestException,
      InvalidStateException,
      MalformedCertificateException,
      RequestFailedException,
      RequestInProgressException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Revokes a certificate that was issued inside Amazon Web Services Private CA. If you enable a certificate revocation list (CRL) when you create or update your private CA, information about the revoked certificates will be included in the CRL. Amazon Web Services Private CA writes the CRL to an S3 bucket that you specify. A CRL is typically updated approximately 30 minutes after a certificate is revoked. If for any reason the CRL update fails, Amazon Web Services Private CA attempts makes further attempts every 15 minutes. With Amazon CloudWatch, you can create alarms for the metrics `CRLGenerated` and `MisconfiguredCRLBucket`. For more information, see Supported CloudWatch Metrics.
 *
 * Both Amazon Web Services Private CA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Access policies for CRLs in Amazon S3.
 *
 * Amazon Web Services Private CA also writes revocation information to the audit report. For more information, see CreateCertificateAuthorityAuditReport.
 *
 * You cannot revoke a root CA self-signed certificate.
 */
export const revokeCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeCertificateRequest,
  output: RevokeCertificateResponse,
  errors: [
    ConcurrentModificationException,
    InvalidArnException,
    InvalidRequestException,
    InvalidStateException,
    LimitExceededException,
    RequestAlreadyProcessedException,
    RequestFailedException,
    RequestInProgressException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a root or subordinate private certificate authority (CA). You must specify the CA configuration, an optional configuration for Online Certificate Status Protocol (OCSP) and/or a certificate revocation list (CRL), the CA type, and an optional idempotency token to avoid accidental creation of multiple CAs. The CA configuration specifies the name of the algorithm and key size to be used to create the CA private key, the type of signing algorithm that the CA uses, and X.500 subject information. The OCSP configuration can optionally specify a custom URL for the OCSP responder. The CRL configuration specifies the CRL expiration period in days (the validity period of the CRL), the Amazon S3 bucket that will contain the CRL, and a CNAME alias for the S3 bucket that is included in certificates issued by the CA. If successful, this action returns the Amazon Resource Name (ARN) of the CA.
 *
 * Both Amazon Web Services Private CA and the IAM principal must have permission to write to the S3 bucket that you specify. If the IAM principal making the call does not have permission to write to the bucket, then an exception is thrown. For more information, see Access policies for CRLs in Amazon S3.
 *
 * Amazon Web Services Private CA assets that are stored in Amazon S3 can be protected with encryption. For more information, see Encrypting Your CRLs.
 */
export const createCertificateAuthority = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCertificateAuthorityRequest,
    output: CreateCertificateAuthorityResponse,
    errors: [
      InvalidArgsException,
      InvalidPolicyException,
      InvalidTagException,
      LimitExceededException,
    ],
  }),
);
/**
 * Uses your private certificate authority (CA), or one that has been shared with you, to issue a client certificate. This action returns the Amazon Resource Name (ARN) of the certificate. You can retrieve the certificate by calling the GetCertificate action and specifying the ARN.
 *
 * You cannot use the ACM **ListCertificateAuthorities** action to retrieve the ARNs of the certificates that you issue by using Amazon Web Services Private CA.
 */
export const issueCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IssueCertificateRequest,
  output: IssueCertificateResponse,
  errors: [
    InvalidArgsException,
    InvalidArnException,
    InvalidStateException,
    LimitExceededException,
    MalformedCSRException,
    ResourceNotFoundException,
  ],
}));
