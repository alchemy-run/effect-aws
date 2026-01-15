import { HttpClient } from "@effect/platform";
import * as effect from "effect/Effect";
import * as redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Artifact",
  serviceShapeName: "Artifact",
});
const auth = T.AwsAuthSigv4({ name: "artifact" });
const ver = T.ServiceVersion("2018-05-10");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { UseDualStack = false, UseFIPS = false, Endpoint, Region } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
  });
  const _p0 = (_0: unknown) => ({
    authSchemes: [
      {
        name: "sigv4",
        signingRegion: `${_.getAttr(_0, "implicitGlobalRegion")}`,
      },
    ],
  });
  if (Endpoint != null) {
    if (UseFIPS === true) {
      return err(
        "Invalid Configuration: FIPS and custom endpoint are not supported",
      );
    }
    if (UseDualStack === true) {
      return err(
        "Invalid Configuration: Dualstack and custom endpoint are not supported",
      );
    }
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://artifact-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p0(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true && UseDualStack === false) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://artifact-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
              _p0(PartitionResult),
              {},
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseFIPS === false && UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://artifact.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p0(PartitionResult),
              {},
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://artifact.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          _p0(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type MaxResultsAttribute = number;
export type NextTokenAttribute = string;
export type ReportId = string;
export type VersionAttribute = number;
export type ShortStringAttribute = string;
export type LongStringAttribute = string;
export type CustomerAgreementIdAttribute = string;
export type TimestampAttribute = Date;
export type SequenceNumberAttribute = number;
export type StatusMessage = string;
export type ValidationExceptionReason = string;

//# Schemas
export interface GetAccountSettingsRequest {}
export const GetAccountSettingsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/account-settings/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAccountSettingsRequest",
}) as any as S.Schema<GetAccountSettingsRequest>;
export type NotificationSubscriptionStatus =
  | "SUBSCRIBED"
  | "NOT_SUBSCRIBED"
  | (string & {});
export const NotificationSubscriptionStatus = S.String;
export interface PutAccountSettingsRequest {
  notificationSubscriptionStatus?: NotificationSubscriptionStatus;
}
export const PutAccountSettingsRequest = S.suspend(() =>
  S.Struct({
    notificationSubscriptionStatus: S.optional(NotificationSubscriptionStatus),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/v1/account-settings/put" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutAccountSettingsRequest",
}) as any as S.Schema<PutAccountSettingsRequest>;
export interface ListCustomerAgreementsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListCustomerAgreementsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/customer-agreement/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCustomerAgreementsRequest",
}) as any as S.Schema<ListCustomerAgreementsRequest>;
export interface GetReportMetadataRequest {
  reportId: string;
  reportVersion?: number;
}
export const GetReportMetadataRequest = S.suspend(() =>
  S.Struct({
    reportId: S.String.pipe(T.HttpQuery("reportId")),
    reportVersion: S.optional(S.Number).pipe(T.HttpQuery("reportVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/report/getMetadata" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReportMetadataRequest",
}) as any as S.Schema<GetReportMetadataRequest>;
export interface ListReportsRequest {
  maxResults?: number;
  nextToken?: string;
}
export const ListReportsRequest = S.suspend(() =>
  S.Struct({
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/report/list" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReportsRequest",
}) as any as S.Schema<ListReportsRequest>;
export interface GetReportRequest {
  reportId: string;
  reportVersion?: number;
  termToken: string;
}
export const GetReportRequest = S.suspend(() =>
  S.Struct({
    reportId: S.String.pipe(T.HttpQuery("reportId")),
    reportVersion: S.optional(S.Number).pipe(T.HttpQuery("reportVersion")),
    termToken: S.String.pipe(T.HttpQuery("termToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/report/get" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReportRequest",
}) as any as S.Schema<GetReportRequest>;
export interface GetTermForReportRequest {
  reportId: string;
  reportVersion?: number;
}
export const GetTermForReportRequest = S.suspend(() =>
  S.Struct({
    reportId: S.String.pipe(T.HttpQuery("reportId")),
    reportVersion: S.optional(S.Number).pipe(T.HttpQuery("reportVersion")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/report/getTermForReport" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTermForReportRequest",
}) as any as S.Schema<GetTermForReportRequest>;
export interface ListReportVersionsRequest {
  reportId: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListReportVersionsRequest = S.suspend(() =>
  S.Struct({
    reportId: S.String.pipe(T.HttpQuery("reportId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/report/listVersions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReportVersionsRequest",
}) as any as S.Schema<ListReportVersionsRequest>;
export interface AccountSettings {
  notificationSubscriptionStatus?: NotificationSubscriptionStatus;
}
export const AccountSettings = S.suspend(() =>
  S.Struct({
    notificationSubscriptionStatus: S.optional(NotificationSubscriptionStatus),
  }),
).annotations({
  identifier: "AccountSettings",
}) as any as S.Schema<AccountSettings>;
export interface GetAccountSettingsResponse {
  accountSettings?: AccountSettings;
}
export const GetAccountSettingsResponse = S.suspend(() =>
  S.Struct({ accountSettings: S.optional(AccountSettings) }),
).annotations({
  identifier: "GetAccountSettingsResponse",
}) as any as S.Schema<GetAccountSettingsResponse>;
export interface PutAccountSettingsResponse {
  accountSettings?: AccountSettings;
}
export const PutAccountSettingsResponse = S.suspend(() =>
  S.Struct({ accountSettings: S.optional(AccountSettings) }),
).annotations({
  identifier: "PutAccountSettingsResponse",
}) as any as S.Schema<PutAccountSettingsResponse>;
export interface GetReportResponse {
  documentPresignedUrl?: string;
}
export const GetReportResponse = S.suspend(() =>
  S.Struct({ documentPresignedUrl: S.optional(S.String) }),
).annotations({
  identifier: "GetReportResponse",
}) as any as S.Schema<GetReportResponse>;
export interface GetTermForReportResponse {
  documentPresignedUrl?: string;
  termToken?: string;
}
export const GetTermForReportResponse = S.suspend(() =>
  S.Struct({
    documentPresignedUrl: S.optional(S.String),
    termToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTermForReportResponse",
}) as any as S.Schema<GetTermForReportResponse>;
export type PublishedState = "PUBLISHED" | "UNPUBLISHED" | (string & {});
export const PublishedState = S.String;
export type UploadState =
  | "PROCESSING"
  | "COMPLETE"
  | "FAILED"
  | "FAULT"
  | (string & {});
export const UploadState = S.String;
export type AcceptanceType = "PASSTHROUGH" | "EXPLICIT" | (string & {});
export const AcceptanceType = S.String;
export interface ReportSummary {
  id?: string;
  name?: string;
  state?: PublishedState;
  arn?: string;
  version?: number;
  uploadState?: UploadState;
  description?: string;
  periodStart?: Date;
  periodEnd?: Date;
  series?: string;
  category?: string;
  companyName?: string;
  productName?: string;
  statusMessage?: string;
  acceptanceType?: AcceptanceType;
}
export const ReportSummary = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    state: S.optional(PublishedState),
    arn: S.optional(S.String),
    version: S.optional(S.Number),
    uploadState: S.optional(UploadState),
    description: S.optional(S.String),
    periodStart: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    periodEnd: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    series: S.optional(S.String),
    category: S.optional(S.String),
    companyName: S.optional(S.String),
    productName: S.optional(S.String),
    statusMessage: S.optional(S.String),
    acceptanceType: S.optional(AcceptanceType),
  }),
).annotations({
  identifier: "ReportSummary",
}) as any as S.Schema<ReportSummary>;
export type ReportsList = ReportSummary[];
export const ReportsList = S.Array(ReportSummary);
export interface ListReportVersionsResponse {
  reports: ReportSummary[];
  nextToken?: string;
}
export const ListReportVersionsResponse = S.suspend(() =>
  S.Struct({ reports: ReportsList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListReportVersionsResponse",
}) as any as S.Schema<ListReportVersionsResponse>;
export type CustomerAgreementState =
  | "ACTIVE"
  | "CUSTOMER_TERMINATED"
  | "AWS_TERMINATED"
  | (string & {});
export const CustomerAgreementState = S.String;
export type AgreementTerms = string[];
export const AgreementTerms = S.Array(S.String);
export type AgreementType = "CUSTOM" | "DEFAULT" | "MODIFIED" | (string & {});
export const AgreementType = S.String;
export interface CustomerAgreementSummary {
  name?: string;
  arn?: string;
  id?: string;
  agreementArn?: string;
  awsAccountId?: string;
  organizationArn?: string;
  effectiveStart?: Date;
  effectiveEnd?: Date;
  state?: CustomerAgreementState;
  description?: string;
  acceptanceTerms?: string[];
  terminateTerms?: string[];
  type?: AgreementType;
}
export const CustomerAgreementSummary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    arn: S.optional(S.String),
    id: S.optional(S.String),
    agreementArn: S.optional(S.String),
    awsAccountId: S.optional(S.String),
    organizationArn: S.optional(S.String),
    effectiveStart: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    effectiveEnd: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    state: S.optional(CustomerAgreementState),
    description: S.optional(S.String),
    acceptanceTerms: S.optional(AgreementTerms),
    terminateTerms: S.optional(AgreementTerms),
    type: S.optional(AgreementType),
  }),
).annotations({
  identifier: "CustomerAgreementSummary",
}) as any as S.Schema<CustomerAgreementSummary>;
export type CustomerAgreementList = CustomerAgreementSummary[];
export const CustomerAgreementList = S.Array(CustomerAgreementSummary);
export interface ReportDetail {
  id?: string;
  name?: string;
  description?: string;
  periodStart?: Date;
  periodEnd?: Date;
  createdAt?: Date;
  lastModifiedAt?: Date;
  deletedAt?: Date;
  state?: PublishedState;
  arn?: string;
  series?: string;
  category?: string;
  companyName?: string;
  productName?: string;
  termArn?: string;
  version?: number;
  acceptanceType?: AcceptanceType;
  sequenceNumber?: number;
  uploadState?: UploadState;
  statusMessage?: string;
}
export const ReportDetail = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    name: S.optional(S.String),
    description: S.optional(S.String),
    periodStart: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    periodEnd: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastModifiedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    deletedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    state: S.optional(PublishedState),
    arn: S.optional(S.String),
    series: S.optional(S.String),
    category: S.optional(S.String),
    companyName: S.optional(S.String),
    productName: S.optional(S.String),
    termArn: S.optional(S.String),
    version: S.optional(S.Number),
    acceptanceType: S.optional(AcceptanceType),
    sequenceNumber: S.optional(S.Number),
    uploadState: S.optional(UploadState),
    statusMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ReportDetail" }) as any as S.Schema<ReportDetail>;
export interface ListCustomerAgreementsResponse {
  customerAgreements: CustomerAgreementSummary[];
  nextToken?: string;
}
export const ListCustomerAgreementsResponse = S.suspend(() =>
  S.Struct({
    customerAgreements: CustomerAgreementList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCustomerAgreementsResponse",
}) as any as S.Schema<ListCustomerAgreementsResponse>;
export interface GetReportMetadataResponse {
  reportDetails?: ReportDetail;
}
export const GetReportMetadataResponse = S.suspend(() =>
  S.Struct({ reportDetails: S.optional(ReportDetail) }),
).annotations({
  identifier: "GetReportMetadataResponse",
}) as any as S.Schema<GetReportMetadataResponse>;
export interface ListReportsResponse {
  reports?: ReportSummary[];
  nextToken?: string;
}
export const ListReportsResponse = S.suspend(() =>
  S.Struct({
    reports: S.optional(ReportsList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListReportsResponse",
}) as any as S.Schema<ListReportsResponse>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    serviceCode: S.optional(S.String),
    quotaCode: S.optional(S.String),
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * List active customer-agreements applicable to calling identity.
 */
export const listCustomerAgreements: {
  (
    input: ListCustomerAgreementsRequest,
  ): effect.Effect<
    ListCustomerAgreementsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomerAgreementsRequest,
  ) => stream.Stream<
    ListCustomerAgreementsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomerAgreementsRequest,
  ) => stream.Stream<
    CustomerAgreementSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putAccountSettings: (
  input: PutAccountSettingsRequest,
) => effect.Effect<
  PutAccountSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getReport: (
  input: GetReportRequest,
) => effect.Effect<
  GetReportResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTermForReport: (
  input: GetTermForReportRequest,
) => effect.Effect<
  GetTermForReportResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getReportMetadata: (
  input: GetReportMetadataRequest,
) => effect.Effect<
  GetReportMetadataResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listReports: {
  (
    input: ListReportsRequest,
  ): effect.Effect<
    ListReportsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReportsRequest,
  ) => stream.Stream<
    ListReportsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReportsRequest,
  ) => stream.Stream<
    ReportSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * List available report versions for a given report.
 */
export const listReportVersions: {
  (
    input: ListReportVersionsRequest,
  ): effect.Effect<
    ListReportVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReportVersionsRequest,
  ) => stream.Stream<
    ListReportVersionsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReportVersionsRequest,
  ) => stream.Stream<
    ReportSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ServiceQuotaExceededException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Get the account settings for Artifact.
 */
export const getAccountSettings: (
  input: GetAccountSettingsRequest,
) => effect.Effect<
  GetAccountSettingsResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
