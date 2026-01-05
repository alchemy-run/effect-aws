import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Artifact",
  serviceShapeName: "Artifact",
});
const auth = T.AwsAuthSigv4({ name: "artifact" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointRuleSet({
  version: "1.0",
  parameters: {
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
    Region: {
      builtIn: "AWS::Region",
      required: false,
      documentation: "The AWS region used to dispatch the request.",
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                            url: "https://artifact-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, false],
                    },
                  ],
                  rules: [
                    {
                      conditions: [
                        {
                          fn: "booleanEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://artifact-fips.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    { fn: "booleanEquals", argv: [{ ref: "UseFIPS" }, false] },
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                            url: "https://artifact.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dualStackDnsSuffix}",
                            properties: {
                              authSchemes: [
                                {
                                  name: "sigv4",
                                  signingRegion:
                                    "{PartitionResult#implicitGlobalRegion}",
                                },
                              ],
                            },
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
                    url: "https://artifact.{PartitionResult#implicitGlobalRegion}.{PartitionResult#dnsSuffix}",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingRegion:
                            "{PartitionResult#implicitGlobalRegion}",
                        },
                      ],
                    },
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
      type: "tree",
    },
  ],
});

//# Schemas
export class GetAccountSettingsRequest extends S.Class<GetAccountSettingsRequest>(
  "GetAccountSettingsRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/v1/account-settings/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutAccountSettingsRequest extends S.Class<PutAccountSettingsRequest>(
  "PutAccountSettingsRequest",
)(
  { notificationSubscriptionStatus: S.optional(S.String) },
  T.all(
    T.Http({ method: "PUT", uri: "/v1/account-settings/put" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCustomerAgreementsRequest extends S.Class<ListCustomerAgreementsRequest>(
  "ListCustomerAgreementsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/customer-agreement/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReportMetadataRequest extends S.Class<GetReportMetadataRequest>(
  "GetReportMetadataRequest",
)(
  {
    reportId: S.String.pipe(T.HttpQuery("reportId")),
    reportVersion: S.optional(S.Number).pipe(T.HttpQuery("reportVersion")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/report/getMetadata" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReportsRequest extends S.Class<ListReportsRequest>(
  "ListReportsRequest",
)(
  {
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/report/list" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetReportRequest extends S.Class<GetReportRequest>(
  "GetReportRequest",
)(
  {
    reportId: S.String.pipe(T.HttpQuery("reportId")),
    reportVersion: S.optional(S.Number).pipe(T.HttpQuery("reportVersion")),
    termToken: S.String.pipe(T.HttpQuery("termToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/report/get" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTermForReportRequest extends S.Class<GetTermForReportRequest>(
  "GetTermForReportRequest",
)(
  {
    reportId: S.String.pipe(T.HttpQuery("reportId")),
    reportVersion: S.optional(S.Number).pipe(T.HttpQuery("reportVersion")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/report/getTermForReport" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListReportVersionsRequest extends S.Class<ListReportVersionsRequest>(
  "ListReportVersionsRequest",
)(
  {
    reportId: S.String.pipe(T.HttpQuery("reportId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/report/listVersions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class AccountSettings extends S.Class<AccountSettings>(
  "AccountSettings",
)({ notificationSubscriptionStatus: S.optional(S.String) }) {}
export class GetAccountSettingsResponse extends S.Class<GetAccountSettingsResponse>(
  "GetAccountSettingsResponse",
)({ accountSettings: S.optional(AccountSettings) }) {}
export class PutAccountSettingsResponse extends S.Class<PutAccountSettingsResponse>(
  "PutAccountSettingsResponse",
)({ accountSettings: S.optional(AccountSettings) }) {}
export class GetReportResponse extends S.Class<GetReportResponse>(
  "GetReportResponse",
)({ documentPresignedUrl: S.optional(S.String) }) {}
export class GetTermForReportResponse extends S.Class<GetTermForReportResponse>(
  "GetTermForReportResponse",
)({
  documentPresignedUrl: S.optional(S.String),
  termToken: S.optional(S.String),
}) {}
export class ReportSummary extends S.Class<ReportSummary>("ReportSummary")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  state: S.optional(S.String),
  arn: S.optional(S.String),
  version: S.optional(S.Number),
  uploadState: S.optional(S.String),
  description: S.optional(S.String),
  periodStart: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  periodEnd: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  series: S.optional(S.String),
  category: S.optional(S.String),
  companyName: S.optional(S.String),
  productName: S.optional(S.String),
  statusMessage: S.optional(S.String),
  acceptanceType: S.optional(S.String),
}) {}
export const ReportsList = S.Array(ReportSummary);
export class ListReportVersionsResponse extends S.Class<ListReportVersionsResponse>(
  "ListReportVersionsResponse",
)({ reports: ReportsList, nextToken: S.optional(S.String) }) {}
export const AgreementTerms = S.Array(S.String);
export class CustomerAgreementSummary extends S.Class<CustomerAgreementSummary>(
  "CustomerAgreementSummary",
)({
  name: S.optional(S.String),
  arn: S.optional(S.String),
  id: S.optional(S.String),
  agreementArn: S.optional(S.String),
  awsAccountId: S.optional(S.String),
  organizationArn: S.optional(S.String),
  effectiveStart: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  effectiveEnd: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  state: S.optional(S.String),
  description: S.optional(S.String),
  acceptanceTerms: S.optional(AgreementTerms),
  terminateTerms: S.optional(AgreementTerms),
  type: S.optional(S.String),
}) {}
export const CustomerAgreementList = S.Array(CustomerAgreementSummary);
export class ReportDetail extends S.Class<ReportDetail>("ReportDetail")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  description: S.optional(S.String),
  periodStart: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  periodEnd: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  deletedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  state: S.optional(S.String),
  arn: S.optional(S.String),
  series: S.optional(S.String),
  category: S.optional(S.String),
  companyName: S.optional(S.String),
  productName: S.optional(S.String),
  termArn: S.optional(S.String),
  version: S.optional(S.Number),
  acceptanceType: S.optional(S.String),
  sequenceNumber: S.optional(S.Number),
  uploadState: S.optional(S.String),
  statusMessage: S.optional(S.String),
}) {}
export class ListCustomerAgreementsResponse extends S.Class<ListCustomerAgreementsResponse>(
  "ListCustomerAgreementsResponse",
)({
  customerAgreements: CustomerAgreementList,
  nextToken: S.optional(S.String),
}) {}
export class GetReportMetadataResponse extends S.Class<GetReportMetadataResponse>(
  "GetReportMetadataResponse",
)({ reportDetails: S.optional(ReportDetail) }) {}
export class ListReportsResponse extends S.Class<ListReportsResponse>(
  "ListReportsResponse",
)({ reports: S.optional(ReportsList), nextToken: S.optional(S.String) }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * List active customer-agreements applicable to calling identity.
 */
export const listCustomerAgreements =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListCustomerAgreementsRequest,
    output: ListCustomerAgreementsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "customerAgreements",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Put the account settings for Artifact.
 */
export const putAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountSettingsRequest,
  output: PutAccountSettingsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the content for a single report.
 */
export const getReport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReportRequest,
  output: GetReportResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the Term content associated with a single report.
 */
export const getTermForReport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTermForReportRequest,
  output: GetTermForReportResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Get the metadata for a single report.
 */
export const getReportMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReportMetadataRequest,
  output: GetReportMetadataResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List available reports.
 */
export const listReports = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListReportsRequest,
    output: ListReportsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "reports",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * List available report versions for a given report.
 */
export const listReportVersions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListReportVersionsRequest,
    output: ListReportVersionsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "reports",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Get the account settings for Artifact.
 */
export const getAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccountSettingsRequest,
  output: GetAccountSettingsResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
