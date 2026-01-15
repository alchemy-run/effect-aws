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
  sdkId: "Cost and Usage Report Service",
  serviceShapeName: "AWSOrigamiServiceGatewayService",
});
const auth = T.AwsAuthSigv4({ name: "cur" });
const ver = T.ServiceVersion("2017-01-06");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://cur-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://cur-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://cur.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://cur.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ReportName = string;
export type MaxResults = number;
export type TagKey = string;
export type S3Bucket = string;
export type S3Prefix = string;
export type RefreshClosedReports = boolean;
export type BillingViewArn = string;
export type TagValue = string;
export type DeleteResponseMessage = string;
export type ErrorMessage = string;
export type LastDelivery = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteReportDefinitionRequest {
  ReportName: string;
}
export const DeleteReportDefinitionRequest = S.suspend(() =>
  S.Struct({ ReportName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteReportDefinitionRequest",
}) as any as S.Schema<DeleteReportDefinitionRequest>;
export interface DescribeReportDefinitionsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeReportDefinitionsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeReportDefinitionsRequest",
}) as any as S.Schema<DescribeReportDefinitionsRequest>;
export interface ListTagsForResourceRequest {
  ReportName: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ReportName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ReportName: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ReportName: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface UntagResourceRequest {
  ReportName: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ReportName: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type TimeUnit = "HOURLY" | "DAILY" | "MONTHLY" | (string & {});
export const TimeUnit = S.String;
export type ReportFormat = "textORcsv" | "Parquet" | (string & {});
export const ReportFormat = S.String;
export type CompressionFormat = "ZIP" | "GZIP" | "Parquet" | (string & {});
export const CompressionFormat = S.String;
export type SchemaElement =
  | "RESOURCES"
  | "SPLIT_COST_ALLOCATION_DATA"
  | "MANUAL_DISCOUNT_COMPATIBILITY"
  | (string & {});
export const SchemaElement = S.String;
export type SchemaElementList = SchemaElement[];
export const SchemaElementList = S.Array(SchemaElement);
export type AWSRegion =
  | "af-south-1"
  | "ap-east-1"
  | "ap-south-1"
  | "ap-south-2"
  | "ap-southeast-1"
  | "ap-southeast-2"
  | "ap-southeast-3"
  | "ap-northeast-1"
  | "ap-northeast-2"
  | "ap-northeast-3"
  | "ca-central-1"
  | "eu-central-1"
  | "eu-central-2"
  | "eu-west-1"
  | "eu-west-2"
  | "eu-west-3"
  | "eu-north-1"
  | "eu-south-1"
  | "eu-south-2"
  | "me-central-1"
  | "me-south-1"
  | "sa-east-1"
  | "us-east-1"
  | "us-east-2"
  | "us-west-1"
  | "us-west-2"
  | "cn-north-1"
  | "cn-northwest-1"
  | (string & {});
export const AWSRegion = S.String;
export type AdditionalArtifact =
  | "REDSHIFT"
  | "QUICKSIGHT"
  | "ATHENA"
  | (string & {});
export const AdditionalArtifact = S.String;
export type AdditionalArtifactList = AdditionalArtifact[];
export const AdditionalArtifactList = S.Array(AdditionalArtifact);
export type ReportVersioning =
  | "CREATE_NEW_REPORT"
  | "OVERWRITE_REPORT"
  | (string & {});
export const ReportVersioning = S.String;
export type LastStatus =
  | "SUCCESS"
  | "ERROR_PERMISSIONS"
  | "ERROR_NO_BUCKET"
  | (string & {});
export const LastStatus = S.String;
export interface ReportStatus {
  lastDelivery?: string;
  lastStatus?: LastStatus;
}
export const ReportStatus = S.suspend(() =>
  S.Struct({
    lastDelivery: S.optional(S.String),
    lastStatus: S.optional(LastStatus),
  }),
).annotations({ identifier: "ReportStatus" }) as any as S.Schema<ReportStatus>;
export interface ReportDefinition {
  ReportName: string;
  TimeUnit: TimeUnit;
  Format: ReportFormat;
  Compression: CompressionFormat;
  AdditionalSchemaElements: SchemaElement[];
  S3Bucket: string;
  S3Prefix: string;
  S3Region: AWSRegion;
  AdditionalArtifacts?: AdditionalArtifact[];
  RefreshClosedReports?: boolean;
  ReportVersioning?: ReportVersioning;
  BillingViewArn?: string;
  ReportStatus?: ReportStatus;
}
export const ReportDefinition = S.suspend(() =>
  S.Struct({
    ReportName: S.String,
    TimeUnit: TimeUnit,
    Format: ReportFormat,
    Compression: CompressionFormat,
    AdditionalSchemaElements: SchemaElementList,
    S3Bucket: S.String,
    S3Prefix: S.String,
    S3Region: AWSRegion,
    AdditionalArtifacts: S.optional(AdditionalArtifactList),
    RefreshClosedReports: S.optional(S.Boolean),
    ReportVersioning: S.optional(ReportVersioning),
    BillingViewArn: S.optional(S.String),
    ReportStatus: S.optional(ReportStatus),
  }),
).annotations({
  identifier: "ReportDefinition",
}) as any as S.Schema<ReportDefinition>;
export type ReportDefinitionList = ReportDefinition[];
export const ReportDefinitionList = S.Array(ReportDefinition);
export interface DeleteReportDefinitionResponse {
  ResponseMessage?: string;
}
export const DeleteReportDefinitionResponse = S.suspend(() =>
  S.Struct({ ResponseMessage: S.optional(S.String) }),
).annotations({
  identifier: "DeleteReportDefinitionResponse",
}) as any as S.Schema<DeleteReportDefinitionResponse>;
export interface DescribeReportDefinitionsResponse {
  ReportDefinitions?: ReportDefinition[];
  NextToken?: string;
}
export const DescribeReportDefinitionsResponse = S.suspend(() =>
  S.Struct({
    ReportDefinitions: S.optional(ReportDefinitionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeReportDefinitionsResponse",
}) as any as S.Schema<DescribeReportDefinitionsResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface PutReportDefinitionRequest {
  ReportDefinition: ReportDefinition;
  Tags?: Tag[];
}
export const PutReportDefinitionRequest = S.suspend(() =>
  S.Struct({
    ReportDefinition: ReportDefinition,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutReportDefinitionRequest",
}) as any as S.Schema<PutReportDefinitionRequest>;
export interface PutReportDefinitionResponse {}
export const PutReportDefinitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutReportDefinitionResponse",
}) as any as S.Schema<PutReportDefinitionResponse>;
export interface ModifyReportDefinitionRequest {
  ReportName: string;
  ReportDefinition: ReportDefinition;
}
export const ModifyReportDefinitionRequest = S.suspend(() =>
  S.Struct({ ReportName: S.String, ReportDefinition: ReportDefinition }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ModifyReportDefinitionRequest",
}) as any as S.Schema<ModifyReportDefinitionRequest>;
export interface ModifyReportDefinitionResponse {}
export const ModifyReportDefinitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ModifyReportDefinitionResponse",
}) as any as S.Schema<ModifyReportDefinitionResponse>;

//# Errors
export class InternalErrorException extends S.TaggedError<InternalErrorException>()(
  "InternalErrorException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DuplicateReportNameException extends S.TaggedError<DuplicateReportNameException>()(
  "DuplicateReportNameException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class ReportLimitReachedException extends S.TaggedError<ReportLimitReachedException>()(
  "ReportLimitReachedException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Lists the Amazon Web Services Cost and Usage Report available to this account.
 */
export const describeReportDefinitions: {
  (
    input: DescribeReportDefinitionsRequest,
  ): effect.Effect<
    DescribeReportDefinitionsResponse,
    InternalErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReportDefinitionsRequest,
  ) => stream.Stream<
    DescribeReportDefinitionsResponse,
    InternalErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReportDefinitionsRequest,
  ) => stream.Stream<
    unknown,
    InternalErrorException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReportDefinitionsRequest,
  output: DescribeReportDefinitionsResponse,
  errors: [InternalErrorException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Deletes the specified report. Any tags associated with the report are also
 * deleted.
 */
export const deleteReportDefinition: (
  input: DeleteReportDefinitionRequest,
) => effect.Effect<
  DeleteReportDefinitionResponse,
  InternalErrorException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReportDefinitionRequest,
  output: DeleteReportDefinitionResponse,
  errors: [InternalErrorException, ValidationException],
}));
/**
 * Disassociates a set of tags from a report definition.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalErrorException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalErrorException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the tags associated with the specified report definition.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalErrorException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalErrorException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Allows you to programmatically update your report preferences.
 */
export const modifyReportDefinition: (
  input: ModifyReportDefinitionRequest,
) => effect.Effect<
  ModifyReportDefinitionResponse,
  InternalErrorException | ValidationException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyReportDefinitionRequest,
  output: ModifyReportDefinitionResponse,
  errors: [InternalErrorException, ValidationException],
}));
/**
 * Associates a set of tags with a report definition.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalErrorException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalErrorException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates a new report using the description that you provide.
 */
export const putReportDefinition: (
  input: PutReportDefinitionRequest,
) => effect.Effect<
  PutReportDefinitionResponse,
  | DuplicateReportNameException
  | InternalErrorException
  | ReportLimitReachedException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutReportDefinitionRequest,
  output: PutReportDefinitionResponse,
  errors: [
    DuplicateReportNameException,
    InternalErrorException,
    ReportLimitReachedException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
