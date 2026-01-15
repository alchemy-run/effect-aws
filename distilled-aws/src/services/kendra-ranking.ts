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
  sdkId: "Kendra Ranking",
  serviceShapeName: "AWSKendraRerankingFrontendService",
});
const auth = T.AwsAuthSigv4({ name: "kendra-ranking" });
const ver = T.ServiceVersion("2022-10-19");
const proto = T.AwsProtocolsAwsJson1_0();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseFIPS = false, Endpoint } = p;
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
          if (UseFIPS === true) {
            if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
              return e(
                `https://kendra-ranking-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              );
            }
            return err(
              "FIPS is enabled but this partition does not support FIPS",
            );
          }
          return e(
            `https://kendra-ranking.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://kendra-ranking-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        return e(
          `https://kendra-ranking.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type RescoreExecutionPlanName = string;
export type Description = string;
export type ClientTokenName = string;
export type RescoreExecutionPlanId = string;
export type NextToken = string;
export type MaxResultsIntegerForListRescoreExecutionPlansRequest = number;
export type AmazonResourceName = string;
export type SearchQuery = string;
export type TagKey = string;
export type RescoreCapacityUnit = number;
export type TagValue = string;
export type DocumentId = string;
export type GroupId = string;
export type DocumentTitle = string;
export type DocumentBody = string;
export type Tokens = string;
export type ErrorMessage = string;
export type RescoreExecutionPlanArn = string;
export type RescoreId = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export interface DeleteRescoreExecutionPlanRequest {
  Id: string;
}
export const DeleteRescoreExecutionPlanRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/rescore-execution-plans/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteRescoreExecutionPlanRequest",
}) as any as S.Schema<DeleteRescoreExecutionPlanRequest>;
export interface DeleteRescoreExecutionPlanResponse {}
export const DeleteRescoreExecutionPlanResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRescoreExecutionPlanResponse",
}) as any as S.Schema<DeleteRescoreExecutionPlanResponse>;
export interface DescribeRescoreExecutionPlanRequest {
  Id: string;
}
export const DescribeRescoreExecutionPlanRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/rescore-execution-plans/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeRescoreExecutionPlanRequest",
}) as any as S.Schema<DescribeRescoreExecutionPlanRequest>;
export interface ListRescoreExecutionPlansRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListRescoreExecutionPlansRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    MaxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/rescore-execution-plans" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRescoreExecutionPlansRequest",
}) as any as S.Schema<ListRescoreExecutionPlansRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
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
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
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
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface CapacityUnitsConfiguration {
  RescoreCapacityUnits: number;
}
export const CapacityUnitsConfiguration = S.suspend(() =>
  S.Struct({ RescoreCapacityUnits: S.Number }),
).annotations({
  identifier: "CapacityUnitsConfiguration",
}) as any as S.Schema<CapacityUnitsConfiguration>;
export interface UpdateRescoreExecutionPlanRequest {
  Id: string;
  Name?: string;
  Description?: string;
  CapacityUnits?: CapacityUnitsConfiguration;
}
export const UpdateRescoreExecutionPlanRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CapacityUnits: S.optional(CapacityUnitsConfiguration),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/rescore-execution-plans/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateRescoreExecutionPlanRequest",
}) as any as S.Schema<UpdateRescoreExecutionPlanRequest>;
export interface UpdateRescoreExecutionPlanResponse {}
export const UpdateRescoreExecutionPlanResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateRescoreExecutionPlanResponse",
}) as any as S.Schema<UpdateRescoreExecutionPlanResponse>;
export type TitleTokensList = string[];
export const TitleTokensList = S.Array(S.String);
export type BodyTokensList = string[];
export const BodyTokensList = S.Array(S.String);
export type RescoreExecutionPlanStatus =
  | "CREATING"
  | "UPDATING"
  | "ACTIVE"
  | "DELETING"
  | "FAILED"
  | (string & {});
export const RescoreExecutionPlanStatus = S.String;
export interface Document {
  Id: string;
  GroupId?: string;
  Title?: string;
  Body?: string;
  TokenizedTitle?: string[];
  TokenizedBody?: string[];
  OriginalScore: number;
}
export const Document = S.suspend(() =>
  S.Struct({
    Id: S.String,
    GroupId: S.optional(S.String),
    Title: S.optional(S.String),
    Body: S.optional(S.String),
    TokenizedTitle: S.optional(TitleTokensList),
    TokenizedBody: S.optional(BodyTokensList),
    OriginalScore: S.Number,
  }),
).annotations({ identifier: "Document" }) as any as S.Schema<Document>;
export type DocumentList = Document[];
export const DocumentList = S.Array(Document);
export interface CreateRescoreExecutionPlanRequest {
  Name: string;
  Description?: string;
  CapacityUnits?: CapacityUnitsConfiguration;
  Tags?: Tag[];
  ClientToken?: string;
}
export const CreateRescoreExecutionPlanRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    CapacityUnits: S.optional(CapacityUnitsConfiguration),
    Tags: S.optional(TagList),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/rescore-execution-plans" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateRescoreExecutionPlanRequest",
}) as any as S.Schema<CreateRescoreExecutionPlanRequest>;
export interface DescribeRescoreExecutionPlanResponse {
  Id?: string;
  Arn?: string;
  Name?: string;
  Description?: string;
  CapacityUnits?: CapacityUnitsConfiguration;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Status?: RescoreExecutionPlanStatus;
  ErrorMessage?: string;
}
export const DescribeRescoreExecutionPlanResponse = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Arn: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CapacityUnits: S.optional(CapacityUnitsConfiguration),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(RescoreExecutionPlanStatus),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRescoreExecutionPlanResponse",
}) as any as S.Schema<DescribeRescoreExecutionPlanResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface RescoreRequest {
  RescoreExecutionPlanId: string;
  SearchQuery: string;
  Documents: Document[];
}
export const RescoreRequest = S.suspend(() =>
  S.Struct({
    RescoreExecutionPlanId: S.String.pipe(
      T.HttpLabel("RescoreExecutionPlanId"),
    ),
    SearchQuery: S.String,
    Documents: DocumentList,
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/rescore-execution-plans/{RescoreExecutionPlanId}/rescore",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RescoreRequest",
}) as any as S.Schema<RescoreRequest>;
export interface RescoreExecutionPlanSummary {
  Name?: string;
  Id?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  Status?: RescoreExecutionPlanStatus;
}
export const RescoreExecutionPlanSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Id: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(RescoreExecutionPlanStatus),
  }),
).annotations({
  identifier: "RescoreExecutionPlanSummary",
}) as any as S.Schema<RescoreExecutionPlanSummary>;
export type RescoreExecutionPlanSummaryList = RescoreExecutionPlanSummary[];
export const RescoreExecutionPlanSummaryList = S.Array(
  RescoreExecutionPlanSummary,
);
export interface CreateRescoreExecutionPlanResponse {
  Id: string;
  Arn: string;
}
export const CreateRescoreExecutionPlanResponse = S.suspend(() =>
  S.Struct({ Id: S.String, Arn: S.String }),
).annotations({
  identifier: "CreateRescoreExecutionPlanResponse",
}) as any as S.Schema<CreateRescoreExecutionPlanResponse>;
export interface ListRescoreExecutionPlansResponse {
  SummaryItems?: RescoreExecutionPlanSummary[];
  NextToken?: string;
}
export const ListRescoreExecutionPlansResponse = S.suspend(() =>
  S.Struct({
    SummaryItems: S.optional(RescoreExecutionPlanSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRescoreExecutionPlansResponse",
}) as any as S.Schema<ListRescoreExecutionPlansResponse>;
export interface RescoreResultItem {
  DocumentId?: string;
  Score?: number;
}
export const RescoreResultItem = S.suspend(() =>
  S.Struct({ DocumentId: S.optional(S.String), Score: S.optional(S.Number) }),
).annotations({
  identifier: "RescoreResultItem",
}) as any as S.Schema<RescoreResultItem>;
export type RescoreResultItemList = RescoreResultItem[];
export const RescoreResultItemList = S.Array(RescoreResultItem);
export interface RescoreResult {
  RescoreId?: string;
  ResultItems?: RescoreResultItem[];
}
export const RescoreResult = S.suspend(() =>
  S.Struct({
    RescoreId: S.optional(S.String),
    ResultItems: S.optional(RescoreResultItemList),
  }),
).annotations({
  identifier: "RescoreResult",
}) as any as S.Schema<RescoreResult>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ResourceUnavailableException extends S.TaggedError<ResourceUnavailableException>()(
  "ResourceUnavailableException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Lists your rescore execution plans. A rescore execution plan
 * is an Amazon Kendra Intelligent Ranking resource used for
 * provisioning the `Rescore` API.
 */
export const listRescoreExecutionPlans: {
  (
    input: ListRescoreExecutionPlansRequest,
  ): effect.Effect<
    ListRescoreExecutionPlansResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRescoreExecutionPlansRequest,
  ) => stream.Stream<
    ListRescoreExecutionPlansResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRescoreExecutionPlansRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRescoreExecutionPlansRequest,
  output: ListRescoreExecutionPlansResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Rescores or re-ranks search results from a search service
 * such as OpenSearch (self managed). You use the semantic search
 * capabilities of Amazon Kendra Intelligent Ranking to
 * improve the search service's results.
 */
export const rescore: (
  input: RescoreRequest,
) => effect.Effect<
  RescoreResult,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RescoreRequest,
  output: RescoreResult,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a rescore execution plan. A rescore execution
 * plan is an Amazon Kendra Intelligent Ranking resource
 * used for provisioning the `Rescore` API. You set
 * the number of capacity units that you require for
 * Amazon Kendra Intelligent Ranking to rescore or re-rank
 * a search service's results.
 *
 * For an example of using the
 * `CreateRescoreExecutionPlan` API, including using
 * the Python and Java SDKs, see Semantically
 * ranking a search service's results.
 */
export const createRescoreExecutionPlan: (
  input: CreateRescoreExecutionPlanRequest,
) => effect.Effect<
  CreateRescoreExecutionPlanResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRescoreExecutionPlanRequest,
  output: CreateRescoreExecutionPlanResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets a list of tags associated with a specified resource.
 * A rescore execution plan is an example of a resource that
 * can have tags associated with it.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a rescore execution plan. A rescore execution plan
 * is an Amazon Kendra Intelligent Ranking resource used for
 * provisioning the `Rescore` API. You can update the
 * number of capacity units you require for Amazon Kendra
 * Intelligent Ranking to rescore or re-rank a search service's
 * results.
 */
export const updateRescoreExecutionPlan: (
  input: UpdateRescoreExecutionPlanRequest,
) => effect.Effect<
  UpdateRescoreExecutionPlanResponse,
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
  input: UpdateRescoreExecutionPlanRequest,
  output: UpdateRescoreExecutionPlanResponse,
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
 * Deletes a rescore execution plan. A rescore execution
 * plan is an Amazon Kendra Intelligent Ranking resource
 * used for provisioning the `Rescore` API.
 */
export const deleteRescoreExecutionPlan: (
  input: DeleteRescoreExecutionPlanRequest,
) => effect.Effect<
  DeleteRescoreExecutionPlanResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRescoreExecutionPlanRequest,
  output: DeleteRescoreExecutionPlanResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Gets information about a rescore execution plan. A rescore
 * execution plan is an Amazon Kendra Intelligent Ranking
 * resource used for provisioning the `Rescore` API.
 */
export const describeRescoreExecutionPlan: (
  input: DescribeRescoreExecutionPlanRequest,
) => effect.Effect<
  DescribeRescoreExecutionPlanResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeRescoreExecutionPlanRequest,
  output: DescribeRescoreExecutionPlanResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds a specified tag to a specified rescore execution
 * plan. A rescore execution plan is an Amazon Kendra
 * Intelligent Ranking resource used for provisioning the
 * `Rescore` API. If the tag already exists,
 * the existing value is replaced with the new value.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from a rescore execution plan. A rescore
 * execution plan is an Amazon Kendra Intelligent
 * Ranking resource used for provisioning the
 * `Rescore` operation.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceUnavailableException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceUnavailableException,
    ThrottlingException,
    ValidationException,
  ],
}));
