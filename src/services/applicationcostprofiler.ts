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
  sdkId: "ApplicationCostProfiler",
  serviceShapeName: "AWSApplicationCostProfiler",
});
const auth = T.AwsAuthSigv4({ name: "application-cost-profiler" });
const ver = T.ServiceVersion("2020-09-10");
const proto = T.AwsProtocolsRestJson1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseDualStack = false, UseFIPS = false, Endpoint } = p;
  const e = (u: unknown, p = {}, h = {}): T.EndpointResolverResult => ({
    type: "endpoint" as const,
    endpoint: { url: u as string, properties: p, headers: h },
  });
  const err = (m: unknown): T.EndpointResolverResult => ({
    type: "error" as const,
    message: m as string,
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
              `https://application-cost-profiler-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://application-cost-profiler-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://application-cost-profiler.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://application-cost-profiler.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ReportId = string;
export type Token = string;
export type Integer = number;
export type ReportDescription = string;
export type S3Bucket = string;
export type S3Key = string;
export type S3Prefix = string;
export type ErrorMessage = string;
export type ImportId = string;

//# Schemas
export interface DeleteReportDefinitionRequest {
  reportId: string;
}
export const DeleteReportDefinitionRequest = S.suspend(() =>
  S.Struct({ reportId: S.String.pipe(T.HttpLabel("reportId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/reportDefinition/{reportId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteReportDefinitionRequest",
}) as any as S.Schema<DeleteReportDefinitionRequest>;
export interface GetReportDefinitionRequest {
  reportId: string;
}
export const GetReportDefinitionRequest = S.suspend(() =>
  S.Struct({ reportId: S.String.pipe(T.HttpLabel("reportId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/reportDefinition/{reportId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetReportDefinitionRequest",
}) as any as S.Schema<GetReportDefinitionRequest>;
export interface ListReportDefinitionsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListReportDefinitionsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/reportDefinition" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListReportDefinitionsRequest",
}) as any as S.Schema<ListReportDefinitionsRequest>;
export interface S3Location {
  bucket: string;
  prefix: string;
}
export const S3Location = S.suspend(() =>
  S.Struct({ bucket: S.String, prefix: S.String }),
).annotations({ identifier: "S3Location" }) as any as S.Schema<S3Location>;
export interface UpdateReportDefinitionRequest {
  reportId: string;
  reportDescription: string;
  reportFrequency: string;
  format: string;
  destinationS3Location: S3Location;
}
export const UpdateReportDefinitionRequest = S.suspend(() =>
  S.Struct({
    reportId: S.String.pipe(T.HttpLabel("reportId")),
    reportDescription: S.String,
    reportFrequency: S.String,
    format: S.String,
    destinationS3Location: S3Location,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/reportDefinition/{reportId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateReportDefinitionRequest",
}) as any as S.Schema<UpdateReportDefinitionRequest>;
export interface SourceS3Location {
  bucket: string;
  key: string;
  region?: string;
}
export const SourceS3Location = S.suspend(() =>
  S.Struct({ bucket: S.String, key: S.String, region: S.optional(S.String) }),
).annotations({
  identifier: "SourceS3Location",
}) as any as S.Schema<SourceS3Location>;
export interface DeleteReportDefinitionResult {
  reportId?: string;
}
export const DeleteReportDefinitionResult = S.suspend(() =>
  S.Struct({ reportId: S.optional(S.String) }),
).annotations({
  identifier: "DeleteReportDefinitionResult",
}) as any as S.Schema<DeleteReportDefinitionResult>;
export interface GetReportDefinitionResult {
  reportId: string;
  reportDescription: string;
  reportFrequency: string;
  format: string;
  destinationS3Location: S3Location;
  createdAt: Date;
  lastUpdated: Date;
}
export const GetReportDefinitionResult = S.suspend(() =>
  S.Struct({
    reportId: S.String,
    reportDescription: S.String,
    reportFrequency: S.String,
    format: S.String,
    destinationS3Location: S3Location,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    lastUpdated: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetReportDefinitionResult",
}) as any as S.Schema<GetReportDefinitionResult>;
export interface ImportApplicationUsageRequest {
  sourceS3Location: SourceS3Location;
}
export const ImportApplicationUsageRequest = S.suspend(() =>
  S.Struct({ sourceS3Location: SourceS3Location }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/importApplicationUsage" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ImportApplicationUsageRequest",
}) as any as S.Schema<ImportApplicationUsageRequest>;
export interface PutReportDefinitionRequest {
  reportId: string;
  reportDescription: string;
  reportFrequency: string;
  format: string;
  destinationS3Location: S3Location;
}
export const PutReportDefinitionRequest = S.suspend(() =>
  S.Struct({
    reportId: S.String,
    reportDescription: S.String,
    reportFrequency: S.String,
    format: S.String,
    destinationS3Location: S3Location,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/reportDefinition" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutReportDefinitionRequest",
}) as any as S.Schema<PutReportDefinitionRequest>;
export interface UpdateReportDefinitionResult {
  reportId?: string;
}
export const UpdateReportDefinitionResult = S.suspend(() =>
  S.Struct({ reportId: S.optional(S.String) }),
).annotations({
  identifier: "UpdateReportDefinitionResult",
}) as any as S.Schema<UpdateReportDefinitionResult>;
export interface ReportDefinition {
  reportId?: string;
  reportDescription?: string;
  reportFrequency?: string;
  format?: string;
  destinationS3Location?: S3Location;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}
export const ReportDefinition = S.suspend(() =>
  S.Struct({
    reportId: S.optional(S.String),
    reportDescription: S.optional(S.String),
    reportFrequency: S.optional(S.String),
    format: S.optional(S.String),
    destinationS3Location: S.optional(S3Location),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "ReportDefinition",
}) as any as S.Schema<ReportDefinition>;
export type ReportDefinitionList = ReportDefinition[];
export const ReportDefinitionList = S.Array(ReportDefinition);
export interface ImportApplicationUsageResult {
  importId: string;
}
export const ImportApplicationUsageResult = S.suspend(() =>
  S.Struct({ importId: S.String }),
).annotations({
  identifier: "ImportApplicationUsageResult",
}) as any as S.Schema<ImportApplicationUsageResult>;
export interface ListReportDefinitionsResult {
  reportDefinitions?: ReportDefinitionList;
  nextToken?: string;
}
export const ListReportDefinitionsResult = S.suspend(() =>
  S.Struct({
    reportDefinitions: S.optional(ReportDefinitionList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListReportDefinitionsResult",
}) as any as S.Schema<ListReportDefinitionsResult>;
export interface PutReportDefinitionResult {
  reportId?: string;
}
export const PutReportDefinitionResult = S.suspend(() =>
  S.Struct({ reportId: S.optional(S.String) }),
).annotations({
  identifier: "PutReportDefinitionResult",
}) as any as S.Schema<PutReportDefinitionResult>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes the specified report definition in AWS Application Cost Profiler. This stops the report from being
 * generated.
 */
export const deleteReportDefinition: (
  input: DeleteReportDefinitionRequest,
) => Effect.Effect<
  DeleteReportDefinitionResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReportDefinitionRequest,
  output: DeleteReportDefinitionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates the report definition for a report in Application Cost Profiler.
 */
export const putReportDefinition: (
  input: PutReportDefinitionRequest,
) => Effect.Effect<
  PutReportDefinitionResult,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutReportDefinitionRequest,
  output: PutReportDefinitionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Ingests application usage data from Amazon Simple Storage Service (Amazon S3).
 *
 * The data must already exist in the S3 location. As part of the action, AWS Application Cost Profiler
 * copies the object from your S3 bucket to an S3 bucket owned by Amazon for processing
 * asynchronously.
 */
export const importApplicationUsage: (
  input: ImportApplicationUsageRequest,
) => Effect.Effect<
  ImportApplicationUsageResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportApplicationUsageRequest,
  output: ImportApplicationUsageResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of all reports and their configurations for your AWS account.
 *
 * The maximum number of reports is one.
 */
export const listReportDefinitions: {
  (
    input: ListReportDefinitionsRequest,
  ): Effect.Effect<
    ListReportDefinitionsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListReportDefinitionsRequest,
  ) => Stream.Stream<
    ListReportDefinitionsResult,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListReportDefinitionsRequest,
  ) => Stream.Stream<
    ReportDefinition,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListReportDefinitionsRequest,
  output: ListReportDefinitionsResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "reportDefinitions",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the definition of a report already configured in AWS Application Cost Profiler.
 */
export const getReportDefinition: (
  input: GetReportDefinitionRequest,
) => Effect.Effect<
  GetReportDefinitionResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReportDefinitionRequest,
  output: GetReportDefinitionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates existing report in AWS Application Cost Profiler.
 */
export const updateReportDefinition: (
  input: UpdateReportDefinitionRequest,
) => Effect.Effect<
  UpdateReportDefinitionResult,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateReportDefinitionRequest,
  output: UpdateReportDefinitionResult,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
