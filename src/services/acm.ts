import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "ACM",
  serviceShapeName: "CertificateManager",
});
const auth = T.AwsAuthSigv4({ name: "acm" });
const ver = T.ServiceVersion("2015-12-08");
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
                        url: "https://acm-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://acm.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://acm-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://acm.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://acm.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetAccountConfigurationRequest extends S.Class<GetAccountConfigurationRequest>(
  "GetAccountConfigurationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const CertificateStatuses = S.Array(S.String);
export const DomainList = S.Array(S.String);
export class DeleteCertificateRequest extends S.Class<DeleteCertificateRequest>(
  "DeleteCertificateRequest",
)(
  { CertificateArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCertificateResponse extends S.Class<DeleteCertificateResponse>(
  "DeleteCertificateResponse",
)({}) {}
export class DescribeCertificateRequest extends S.Class<DescribeCertificateRequest>(
  "DescribeCertificateRequest",
)(
  { CertificateArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExportCertificateRequest extends S.Class<ExportCertificateRequest>(
  "ExportCertificateRequest",
)(
  { CertificateArn: S.String, Passphrase: T.Blob },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCertificateRequest extends S.Class<GetCertificateRequest>(
  "GetCertificateRequest",
)(
  { CertificateArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class ImportCertificateRequest extends S.Class<ImportCertificateRequest>(
  "ImportCertificateRequest",
)(
  {
    CertificateArn: S.optional(S.String),
    Certificate: T.Blob,
    PrivateKey: T.Blob,
    CertificateChain: S.optional(T.Blob),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForCertificateRequest extends S.Class<ListTagsForCertificateRequest>(
  "ListTagsForCertificateRequest",
)(
  { CertificateArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExpiryEventsConfiguration extends S.Class<ExpiryEventsConfiguration>(
  "ExpiryEventsConfiguration",
)({ DaysBeforeExpiry: S.optional(S.Number) }) {}
export class PutAccountConfigurationRequest extends S.Class<PutAccountConfigurationRequest>(
  "PutAccountConfigurationRequest",
)(
  {
    ExpiryEvents: S.optional(ExpiryEventsConfiguration),
    IdempotencyToken: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutAccountConfigurationResponse extends S.Class<PutAccountConfigurationResponse>(
  "PutAccountConfigurationResponse",
)({}) {}
export class RemoveTagsFromCertificateRequest extends S.Class<RemoveTagsFromCertificateRequest>(
  "RemoveTagsFromCertificateRequest",
)(
  { CertificateArn: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsFromCertificateResponse extends S.Class<RemoveTagsFromCertificateResponse>(
  "RemoveTagsFromCertificateResponse",
)({}) {}
export class RenewCertificateRequest extends S.Class<RenewCertificateRequest>(
  "RenewCertificateRequest",
)(
  { CertificateArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RenewCertificateResponse extends S.Class<RenewCertificateResponse>(
  "RenewCertificateResponse",
)({}) {}
export class ResendValidationEmailRequest extends S.Class<ResendValidationEmailRequest>(
  "ResendValidationEmailRequest",
)(
  { CertificateArn: S.String, Domain: S.String, ValidationDomain: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResendValidationEmailResponse extends S.Class<ResendValidationEmailResponse>(
  "ResendValidationEmailResponse",
)({}) {}
export class RevokeCertificateRequest extends S.Class<RevokeCertificateRequest>(
  "RevokeCertificateRequest",
)(
  { CertificateArn: S.String, RevocationReason: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CertificateOptions extends S.Class<CertificateOptions>(
  "CertificateOptions",
)({
  CertificateTransparencyLoggingPreference: S.optional(S.String),
  Export: S.optional(S.String),
}) {}
export class UpdateCertificateOptionsRequest extends S.Class<UpdateCertificateOptionsRequest>(
  "UpdateCertificateOptionsRequest",
)(
  { CertificateArn: S.String, Options: CertificateOptions },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCertificateOptionsResponse extends S.Class<UpdateCertificateOptionsResponse>(
  "UpdateCertificateOptionsResponse",
)({}) {}
export const ExtendedKeyUsageFilterList = S.Array(S.String);
export const KeyUsageFilterList = S.Array(S.String);
export const KeyAlgorithmList = S.Array(S.String);
export class Filters extends S.Class<Filters>("Filters")({
  extendedKeyUsage: S.optional(ExtendedKeyUsageFilterList),
  keyUsage: S.optional(KeyUsageFilterList),
  keyTypes: S.optional(KeyAlgorithmList),
  exportOption: S.optional(S.String),
  managedBy: S.optional(S.String),
}) {}
export class DomainValidationOption extends S.Class<DomainValidationOption>(
  "DomainValidationOption",
)({ DomainName: S.String, ValidationDomain: S.String }) {}
export const DomainValidationOptionList = S.Array(DomainValidationOption);
export class AddTagsToCertificateRequest extends S.Class<AddTagsToCertificateRequest>(
  "AddTagsToCertificateRequest",
)(
  { CertificateArn: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AddTagsToCertificateResponse extends S.Class<AddTagsToCertificateResponse>(
  "AddTagsToCertificateResponse",
)({}) {}
export class ExportCertificateResponse extends S.Class<ExportCertificateResponse>(
  "ExportCertificateResponse",
)({
  Certificate: S.optional(S.String),
  CertificateChain: S.optional(S.String),
  PrivateKey: S.optional(S.String),
}) {}
export class GetAccountConfigurationResponse extends S.Class<GetAccountConfigurationResponse>(
  "GetAccountConfigurationResponse",
)({ ExpiryEvents: S.optional(ExpiryEventsConfiguration) }) {}
export class GetCertificateResponse extends S.Class<GetCertificateResponse>(
  "GetCertificateResponse",
)({
  Certificate: S.optional(S.String),
  CertificateChain: S.optional(S.String),
}) {}
export class ImportCertificateResponse extends S.Class<ImportCertificateResponse>(
  "ImportCertificateResponse",
)({ CertificateArn: S.optional(S.String) }) {}
export class ListCertificatesRequest extends S.Class<ListCertificatesRequest>(
  "ListCertificatesRequest",
)(
  {
    CertificateStatuses: S.optional(CertificateStatuses),
    Includes: S.optional(Filters),
    NextToken: S.optional(S.String),
    MaxItems: S.optional(S.Number),
    SortBy: S.optional(S.String),
    SortOrder: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForCertificateResponse extends S.Class<ListTagsForCertificateResponse>(
  "ListTagsForCertificateResponse",
)({ Tags: S.optional(TagList) }) {}
export class RequestCertificateRequest extends S.Class<RequestCertificateRequest>(
  "RequestCertificateRequest",
)(
  {
    DomainName: S.String,
    ValidationMethod: S.optional(S.String),
    SubjectAlternativeNames: S.optional(DomainList),
    IdempotencyToken: S.optional(S.String),
    DomainValidationOptions: S.optional(DomainValidationOptionList),
    Options: S.optional(CertificateOptions),
    CertificateAuthorityArn: S.optional(S.String),
    Tags: S.optional(TagList),
    KeyAlgorithm: S.optional(S.String),
    ManagedBy: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RevokeCertificateResponse extends S.Class<RevokeCertificateResponse>(
  "RevokeCertificateResponse",
)({ CertificateArn: S.optional(S.String) }) {}
export const InUseList = S.Array(S.String);
export const ValidationEmailList = S.Array(S.String);
export class RequestCertificateResponse extends S.Class<RequestCertificateResponse>(
  "RequestCertificateResponse",
)({ CertificateArn: S.optional(S.String) }) {}
export class ResourceRecord extends S.Class<ResourceRecord>("ResourceRecord")({
  Name: S.String,
  Type: S.String,
  Value: S.String,
}) {}
export class HttpRedirect extends S.Class<HttpRedirect>("HttpRedirect")({
  RedirectFrom: S.optional(S.String),
  RedirectTo: S.optional(S.String),
}) {}
export class DomainValidation extends S.Class<DomainValidation>(
  "DomainValidation",
)({
  DomainName: S.String,
  ValidationEmails: S.optional(ValidationEmailList),
  ValidationDomain: S.optional(S.String),
  ValidationStatus: S.optional(S.String),
  ResourceRecord: S.optional(ResourceRecord),
  HttpRedirect: S.optional(HttpRedirect),
  ValidationMethod: S.optional(S.String),
}) {}
export const DomainValidationList = S.Array(DomainValidation);
export class RenewalSummary extends S.Class<RenewalSummary>("RenewalSummary")({
  RenewalStatus: S.String,
  DomainValidationOptions: DomainValidationList,
  RenewalStatusReason: S.optional(S.String),
  UpdatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class KeyUsage extends S.Class<KeyUsage>("KeyUsage")({
  Name: S.optional(S.String),
}) {}
export const KeyUsageList = S.Array(KeyUsage);
export class ExtendedKeyUsage extends S.Class<ExtendedKeyUsage>(
  "ExtendedKeyUsage",
)({ Name: S.optional(S.String), OID: S.optional(S.String) }) {}
export const ExtendedKeyUsageList = S.Array(ExtendedKeyUsage);
export const KeyUsageNames = S.Array(S.String);
export const ExtendedKeyUsageNames = S.Array(S.String);
export class CertificateSummary extends S.Class<CertificateSummary>(
  "CertificateSummary",
)({
  CertificateArn: S.optional(S.String),
  DomainName: S.optional(S.String),
  SubjectAlternativeNameSummaries: S.optional(DomainList),
  HasAdditionalSubjectAlternativeNames: S.optional(S.Boolean),
  Status: S.optional(S.String),
  Type: S.optional(S.String),
  KeyAlgorithm: S.optional(S.String),
  KeyUsages: S.optional(KeyUsageNames),
  ExtendedKeyUsages: S.optional(ExtendedKeyUsageNames),
  ExportOption: S.optional(S.String),
  InUse: S.optional(S.Boolean),
  Exported: S.optional(S.Boolean),
  RenewalEligibility: S.optional(S.String),
  NotBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NotAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IssuedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ImportedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RevokedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ManagedBy: S.optional(S.String),
}) {}
export const CertificateSummaryList = S.Array(CertificateSummary);
export class ListCertificatesResponse extends S.Class<ListCertificatesResponse>(
  "ListCertificatesResponse",
)({
  NextToken: S.optional(S.String),
  CertificateSummaryList: S.optional(CertificateSummaryList),
}) {}
export class CertificateDetail extends S.Class<CertificateDetail>(
  "CertificateDetail",
)({
  CertificateArn: S.optional(S.String),
  DomainName: S.optional(S.String),
  SubjectAlternativeNames: S.optional(DomainList),
  ManagedBy: S.optional(S.String),
  DomainValidationOptions: S.optional(DomainValidationList),
  Serial: S.optional(S.String),
  Subject: S.optional(S.String),
  Issuer: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IssuedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ImportedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  RevokedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RevocationReason: S.optional(S.String),
  NotBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NotAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  KeyAlgorithm: S.optional(S.String),
  SignatureAlgorithm: S.optional(S.String),
  InUseBy: S.optional(InUseList),
  FailureReason: S.optional(S.String),
  Type: S.optional(S.String),
  RenewalSummary: S.optional(RenewalSummary),
  KeyUsages: S.optional(KeyUsageList),
  ExtendedKeyUsages: S.optional(ExtendedKeyUsageList),
  CertificateAuthorityArn: S.optional(S.String),
  RenewalEligibility: S.optional(S.String),
  Options: S.optional(CertificateOptions),
}) {}
export class DescribeCertificateResponse extends S.Class<DescribeCertificateResponse>(
  "DescribeCertificateResponse",
)({ Certificate: S.optional(CertificateDetail) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
  T.AwsQueryError({ code: "AccessDenied", httpResponseCode: 403 }),
) {}
export class InvalidArnException extends S.TaggedError<InvalidArnException>()(
  "InvalidArnException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class RequestInProgressException extends S.TaggedError<RequestInProgressException>()(
  "RequestInProgressException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
  T.AwsQueryError({ code: "Throttling", httpResponseCode: 400 }),
) {}
export class InvalidTagException extends S.TaggedError<InvalidTagException>()(
  "InvalidTagException",
  {},
) {}
export class InvalidDomainValidationOptionsException extends S.TaggedError<InvalidDomainValidationOptionsException>()(
  "InvalidDomainValidationOptionsException",
  { message: S.optional(S.String) },
) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  {},
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  {},
) {}
export class TagPolicyException extends S.TaggedError<TagPolicyException>()(
  "TagPolicyException",
  {},
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  {},
) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ValidationError", httpResponseCode: 400 }),
) {}
export class InvalidArgsException extends S.TaggedError<InvalidArgsException>()(
  "InvalidArgsException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves a certificate and its certificate chain. The certificate may be either a public or private certificate issued using the ACM `RequestCertificate` action, or a certificate imported into ACM using the `ImportCertificate` action. The chain consists of the certificate of the issuing CA and the intermediate certificates of any other subordinate CAs. All of the certificates are base64 encoded. You can use OpenSSL to decode the certificates and inspect individual fields.
 */
export const getCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCertificateRequest,
  output: GetCertificateResponse,
  errors: [
    InvalidArnException,
    RequestInProgressException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the tags that have been applied to the ACM certificate. Use the certificate's Amazon Resource Name (ARN) to specify the certificate. To add a tag to an ACM certificate, use the AddTagsToCertificate action. To delete a tag, use the RemoveTagsFromCertificate action.
 */
export const listTagsForCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTagsForCertificateRequest,
    output: ListTagsForCertificateResponse,
    errors: [InvalidArnException, ResourceNotFoundException],
  }),
);
/**
 * Renews an eligible ACM certificate. In order to renew your Amazon Web Services Private CA certificates with ACM, you must first grant the ACM service principal permission to do so. For more information, see Testing Managed Renewal in the ACM User Guide.
 */
export const renewCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RenewCertificateRequest,
  output: RenewCertificateResponse,
  errors: [
    InvalidArnException,
    RequestInProgressException,
    ResourceNotFoundException,
  ],
}));
/**
 * Resends the email that requests domain ownership validation. The domain owner or an authorized representative must approve the ACM certificate before it can be issued. The certificate can be approved by clicking a link in the mail to navigate to the Amazon certificate approval website and then clicking **I Approve**. However, the validation email can be blocked by spam filters. Therefore, if you do not receive the original mail, you can request that the mail be resent within 72 hours of requesting the ACM certificate. If more than 72 hours have elapsed since your original request or since your last attempt to resend validation mail, you must request a new certificate. For more information about setting up your contact email addresses, see Configure Email for your Domain.
 */
export const resendValidationEmail = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResendValidationEmailRequest,
    output: ResendValidationEmailResponse,
    errors: [
      InvalidArnException,
      InvalidDomainValidationOptionsException,
      InvalidStateException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Revokes a public ACM certificate. You can only revoke certificates that have been previously exported.
 */
export const revokeCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeCertificateRequest,
  output: RevokeCertificateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InvalidArnException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a certificate and its associated private key. If this action succeeds, the certificate no longer appears in the list that can be displayed by calling the ListCertificates action or be retrieved by calling the GetCertificate action. The certificate will not be available for use by Amazon Web Services services integrated with ACM.
 *
 * You cannot delete an ACM certificate that is being used by another Amazon Web Services service. To delete a certificate that is in use, the certificate association must first be removed.
 */
export const deleteCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCertificateRequest,
  output: DeleteCertificateResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InvalidArnException,
    ResourceInUseException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Exports a private certificate issued by a private certificate authority (CA) or public certificate for use anywhere. The exported file contains the certificate, the certificate chain, and the encrypted private key associated with the public key that is embedded in the certificate. For security, you must assign a passphrase for the private key when exporting it.
 *
 * For information about exporting and formatting a certificate using the ACM console or CLI, see Export a private certificate and Export a public certificate.
 */
export const exportCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportCertificateRequest,
  output: ExportCertificateResponse,
  errors: [
    InvalidArnException,
    RequestInProgressException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns the account configuration options associated with an Amazon Web Services account.
 */
export const getAccountConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetAccountConfigurationRequest,
    output: GetAccountConfigurationResponse,
    errors: [AccessDeniedException, ThrottlingException],
  }),
);
/**
 * Imports a certificate into Certificate Manager (ACM) to use with services that are integrated with ACM. Note that integrated services allow only certificate types and keys they support to be associated with their resources. Further, their support differs depending on whether the certificate is imported into IAM or into ACM. For more information, see the documentation for each service. For more information about importing certificates into ACM, see Importing Certificates in the *Certificate Manager User Guide*.
 *
 * ACM does not provide managed renewal for certificates that you import.
 *
 * Note the following guidelines when importing third party certificates:
 *
 * - You must enter the private key that matches the certificate you are importing.
 *
 * - The private key must be unencrypted. You cannot import a private key that is protected by a password or a passphrase.
 *
 * - The private key must be no larger than 5 KB (5,120 bytes).
 *
 * - The certificate, private key, and certificate chain must be PEM-encoded.
 *
 * - The current time must be between the `Not Before` and `Not After` certificate fields.
 *
 * - The `Issuer` field must not be empty.
 *
 * - The OCSP authority URL, if present, must not exceed 1000 characters.
 *
 * - To import a new certificate, omit the `CertificateArn` argument. Include this argument only when you want to replace a previously imported certificate.
 *
 * - When you import a certificate by using the CLI, you must specify the certificate, the certificate chain, and the private key by their file names preceded by `fileb://`. For example, you can specify a certificate saved in the `C:\temp` folder as `fileb://C:\temp\certificate_to_import.pem`. If you are making an HTTP or HTTPS Query request, include these arguments as BLOBs.
 *
 * - When you import a certificate by using an SDK, you must specify the certificate, the certificate chain, and the private key files in the manner required by the programming language you're using.
 *
 * - The cryptographic algorithm of an imported certificate must match the algorithm of the signing CA. For example, if the signing CA key type is RSA, then the certificate key type must also be RSA.
 *
 * This operation returns the Amazon Resource Name (ARN) of the imported certificate.
 */
export const importCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportCertificateRequest,
  output: ImportCertificateResponse,
  errors: [
    InvalidArnException,
    InvalidParameterException,
    InvalidTagException,
    LimitExceededException,
    ResourceNotFoundException,
    TagPolicyException,
    TooManyTagsException,
  ],
}));
/**
 * Adds or modifies account-level configurations in ACM.
 *
 * The supported configuration option is `DaysBeforeExpiry`. This option specifies the number of days prior to certificate expiration when ACM starts generating `EventBridge` events. ACM sends one event per day per certificate until the certificate expires. By default, accounts receive events starting 45 days before certificate expiration.
 */
export const putAccountConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutAccountConfigurationRequest,
    output: PutAccountConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Remove one or more tags from an ACM certificate. A tag consists of a key-value pair. If you do not specify the value portion of the tag when calling this function, the tag will be removed regardless of value. If you specify a value, the tag is removed only if it is associated with the specified value.
 *
 * To add tags to a certificate, use the AddTagsToCertificate action. To view all of the tags that have been applied to a specific ACM certificate, use the ListTagsForCertificate action.
 */
export const removeTagsFromCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveTagsFromCertificateRequest,
    output: RemoveTagsFromCertificateResponse,
    errors: [
      InvalidArnException,
      InvalidParameterException,
      InvalidTagException,
      ResourceNotFoundException,
      TagPolicyException,
      ThrottlingException,
    ],
  }),
);
/**
 * Requests an ACM certificate for use with other Amazon Web Services services. To request an ACM certificate, you must specify a fully qualified domain name (FQDN) in the `DomainName` parameter. You can also specify additional FQDNs in the `SubjectAlternativeNames` parameter.
 *
 * If you are requesting a private certificate, domain validation is not required. If you are requesting a public certificate, each domain name that you specify must be validated to verify that you own or control the domain. You can use DNS validation or email validation. We recommend that you use DNS validation.
 *
 * ACM behavior differs from the RFC 6125 specification of the certificate validation process. ACM first checks for a Subject Alternative Name, and, if it finds one, ignores the common name (CN).
 *
 * After successful completion of the `RequestCertificate` action, there is a delay of several seconds before you can retrieve information about the new certificate.
 */
export const requestCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RequestCertificateRequest,
  output: RequestCertificateResponse,
  errors: [
    InvalidArnException,
    InvalidDomainValidationOptionsException,
    InvalidParameterException,
    InvalidTagException,
    LimitExceededException,
    TagPolicyException,
    TooManyTagsException,
  ],
}));
/**
 * Updates a certificate. You can use this function to specify whether to opt in to or out of recording your certificate in a certificate transparency log and exporting. For more information, see Opting Out of Certificate Transparency Logging and Certificate Manager Exportable Managed Certificates.
 */
export const updateCertificateOptions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCertificateOptionsRequest,
    output: UpdateCertificateOptionsResponse,
    errors: [
      InvalidArnException,
      InvalidStateException,
      LimitExceededException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Adds one or more tags to an ACM certificate. Tags are labels that you can use to identify and organize your Amazon Web Services resources. Each tag consists of a `key` and an optional `value`. You specify the certificate on input by its Amazon Resource Name (ARN). You specify the tag by using a key-value pair.
 *
 * You can apply a tag to just one certificate if you want to identify a specific characteristic of that certificate, or you can apply the same tag to multiple certificates if you want to filter for a common relationship among those certificates. Similarly, you can apply the same tag to multiple resources if you want to specify a relationship among those resources. For example, you can add the same tag to an ACM certificate and an Elastic Load Balancing load balancer to indicate that they are both used by the same website. For more information, see Tagging ACM certificates.
 *
 * To remove one or more tags, use the RemoveTagsFromCertificate action. To view all of the tags that have been applied to the certificate, use the ListTagsForCertificate action.
 */
export const addTagsToCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: AddTagsToCertificateRequest,
    output: AddTagsToCertificateResponse,
    errors: [
      InvalidArnException,
      InvalidParameterException,
      InvalidTagException,
      ResourceNotFoundException,
      TagPolicyException,
      ThrottlingException,
      TooManyTagsException,
    ],
  }),
);
/**
 * Returns detailed metadata about the specified ACM certificate.
 *
 * If you have just created a certificate using the `RequestCertificate` action, there is a delay of several seconds before you can retrieve information about it.
 */
export const describeCertificate = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCertificateRequest,
  output: DescribeCertificateResponse,
  errors: [InvalidArnException, ResourceNotFoundException],
}));
/**
 * Retrieves a list of certificate ARNs and domain names. You can request that only certificates that match a specific status be listed. You can also filter by specific attributes of the certificate. Default filtering returns only `RSA_2048` certificates. For more information, see Filters.
 */
export const listCertificates = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCertificatesRequest,
  output: ListCertificatesResponse,
  errors: [InvalidArgsException, ValidationException],
}));
