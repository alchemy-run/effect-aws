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
  sdkId: "Billing",
  serviceShapeName: "AWSBilling",
});
const auth = T.AwsAuthSigv4({ name: "billing" });
const ver = T.ServiceVersion("2023-09-07");
const proto = T.AwsProtocolsAwsJson1_0();
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
  const _p0 = () => ({
    authSchemes: [{ name: "sigv4", signingRegion: "us-east-1" }],
  });
  const _p1 = (_0: unknown) => ({
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
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e("https://billing.us-east-1.api.aws", _p0(), {});
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e("https://billing.us-east-1.api.aws", _p0(), {});
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://billing-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p1(PartitionResult),
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
              `https://billing-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
              _p1(PartitionResult),
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
              `https://billing.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p1(PartitionResult),
              {},
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://billing.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          _p1(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type BillingViewArn = string;
export type BillingViewName = string | redacted.Redacted<string>;
export type BillingViewDescription = string | redacted.Redacted<string>;
export type ClientToken = string;
export type ResourceArn = string;
export type AccountId = string;
export type BillingViewsMaxResults = number;
export type PageToken = string;
export type ResourceTagKey = string;
export type ResourceTagValue = string;
export type SearchValue = string;
export type PolicyDocument = string;
export type ErrorMessage = string;
export type Value = string;
export type TagKey = string;
export type ResourceId = string;
export type ResourceType = string;
export type ServiceCode = string;
export type QuotaCode = string;
export type FieldName = string;

//# Schemas
export type BillingViewSourceViewsList = string[];
export const BillingViewSourceViewsList = S.Array(S.String);
export type BillingViewArnList = string[];
export const BillingViewArnList = S.Array(S.String);
export type BillingViewType =
  | "PRIMARY"
  | "BILLING_GROUP"
  | "CUSTOM"
  | "BILLING_TRANSFER"
  | "BILLING_TRANSFER_SHOWBACK"
  | (string & {});
export const BillingViewType = S.String;
export type BillingViewTypeList = BillingViewType[];
export const BillingViewTypeList = S.Array(BillingViewType);
export type ResourceTagKeyList = string[];
export const ResourceTagKeyList = S.Array(S.String);
export interface AssociateSourceViewsRequest {
  arn: string;
  sourceViews: string[];
}
export const AssociateSourceViewsRequest = S.suspend(() =>
  S.Struct({ arn: S.String, sourceViews: BillingViewSourceViewsList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "AssociateSourceViewsRequest",
}) as any as S.Schema<AssociateSourceViewsRequest>;
export interface DeleteBillingViewRequest {
  arn: string;
  force?: boolean;
}
export const DeleteBillingViewRequest = S.suspend(() =>
  S.Struct({ arn: S.String, force: S.optional(S.Boolean) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteBillingViewRequest",
}) as any as S.Schema<DeleteBillingViewRequest>;
export interface DisassociateSourceViewsRequest {
  arn: string;
  sourceViews: string[];
}
export const DisassociateSourceViewsRequest = S.suspend(() =>
  S.Struct({ arn: S.String, sourceViews: BillingViewSourceViewsList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DisassociateSourceViewsRequest",
}) as any as S.Schema<DisassociateSourceViewsRequest>;
export interface GetBillingViewRequest {
  arn: string;
}
export const GetBillingViewRequest = S.suspend(() =>
  S.Struct({ arn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetBillingViewRequest",
}) as any as S.Schema<GetBillingViewRequest>;
export interface GetResourcePolicyRequest {
  resourceArn: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface ListSourceViewsForBillingViewRequest {
  arn: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListSourceViewsForBillingViewRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSourceViewsForBillingViewRequest",
}) as any as S.Schema<ListSourceViewsForBillingViewRequest>;
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ResourceTag {
  key: string;
  value?: string;
}
export const ResourceTag = S.suspend(() =>
  S.Struct({ key: S.String, value: S.optional(S.String) }),
).annotations({ identifier: "ResourceTag" }) as any as S.Schema<ResourceTag>;
export type ResourceTagList = ResourceTag[];
export const ResourceTagList = S.Array(ResourceTag);
export interface TagResourceRequest {
  resourceArn: string;
  resourceTags: ResourceTag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, resourceTags: ResourceTagList }).pipe(
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
  resourceArn: string;
  resourceTagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, resourceTagKeys: ResourceTagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type Dimension = "LINKED_ACCOUNT" | (string & {});
export const Dimension = S.String;
export type Values = string[];
export const Values = S.Array(S.String);
export interface DimensionValues {
  key: Dimension;
  values: string[];
}
export const DimensionValues = S.suspend(() =>
  S.Struct({ key: Dimension, values: Values }),
).annotations({
  identifier: "DimensionValues",
}) as any as S.Schema<DimensionValues>;
export interface TagValues {
  key: string;
  values: string[];
}
export const TagValues = S.suspend(() =>
  S.Struct({ key: S.String, values: Values }),
).annotations({ identifier: "TagValues" }) as any as S.Schema<TagValues>;
export interface TimeRange {
  beginDateInclusive?: Date;
  endDateInclusive?: Date;
}
export const TimeRange = S.suspend(() =>
  S.Struct({
    beginDateInclusive: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    endDateInclusive: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "TimeRange" }) as any as S.Schema<TimeRange>;
export interface Expression {
  dimensions?: DimensionValues;
  tags?: TagValues;
  timeRange?: TimeRange;
}
export const Expression = S.suspend(() =>
  S.Struct({
    dimensions: S.optional(DimensionValues),
    tags: S.optional(TagValues),
    timeRange: S.optional(TimeRange),
  }),
).annotations({ identifier: "Expression" }) as any as S.Schema<Expression>;
export interface UpdateBillingViewRequest {
  arn: string;
  name?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  dataFilterExpression?: Expression;
}
export const UpdateBillingViewRequest = S.suspend(() =>
  S.Struct({
    arn: S.String,
    name: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    dataFilterExpression: S.optional(Expression),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateBillingViewRequest",
}) as any as S.Schema<UpdateBillingViewRequest>;
export type SearchOption = "STARTS_WITH" | (string & {});
export const SearchOption = S.String;
export interface ActiveTimeRange {
  activeAfterInclusive: Date;
  activeBeforeInclusive: Date;
}
export const ActiveTimeRange = S.suspend(() =>
  S.Struct({
    activeAfterInclusive: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    activeBeforeInclusive: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "ActiveTimeRange",
}) as any as S.Schema<ActiveTimeRange>;
export interface StringSearch {
  searchOption: SearchOption;
  searchValue: string;
}
export const StringSearch = S.suspend(() =>
  S.Struct({ searchOption: SearchOption, searchValue: S.String }),
).annotations({ identifier: "StringSearch" }) as any as S.Schema<StringSearch>;
export type StringSearches = StringSearch[];
export const StringSearches = S.Array(StringSearch);
export interface AssociateSourceViewsResponse {
  arn: string;
}
export const AssociateSourceViewsResponse = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "AssociateSourceViewsResponse",
}) as any as S.Schema<AssociateSourceViewsResponse>;
export interface DeleteBillingViewResponse {
  arn: string;
}
export const DeleteBillingViewResponse = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "DeleteBillingViewResponse",
}) as any as S.Schema<DeleteBillingViewResponse>;
export interface DisassociateSourceViewsResponse {
  arn: string;
}
export const DisassociateSourceViewsResponse = S.suspend(() =>
  S.Struct({ arn: S.String }),
).annotations({
  identifier: "DisassociateSourceViewsResponse",
}) as any as S.Schema<DisassociateSourceViewsResponse>;
export interface GetResourcePolicyResponse {
  resourceArn: string;
  policy?: string;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({ resourceArn: S.String, policy: S.optional(S.String) }),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface ListBillingViewsRequest {
  activeTimeRange?: ActiveTimeRange;
  arns?: string[];
  billingViewTypes?: BillingViewType[];
  names?: StringSearch[];
  ownerAccountId?: string;
  sourceAccountId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListBillingViewsRequest = S.suspend(() =>
  S.Struct({
    activeTimeRange: S.optional(ActiveTimeRange),
    arns: S.optional(BillingViewArnList),
    billingViewTypes: S.optional(BillingViewTypeList),
    names: S.optional(StringSearches),
    ownerAccountId: S.optional(S.String),
    sourceAccountId: S.optional(S.String),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBillingViewsRequest",
}) as any as S.Schema<ListBillingViewsRequest>;
export interface ListSourceViewsForBillingViewResponse {
  sourceViews: string[];
  nextToken?: string;
}
export const ListSourceViewsForBillingViewResponse = S.suspend(() =>
  S.Struct({
    sourceViews: BillingViewSourceViewsList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSourceViewsForBillingViewResponse",
}) as any as S.Schema<ListSourceViewsForBillingViewResponse>;
export interface ListTagsForResourceResponse {
  resourceTags?: ResourceTag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ resourceTags: S.optional(ResourceTagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateBillingViewResponse {
  arn: string;
  updatedAt?: Date;
}
export const UpdateBillingViewResponse = S.suspend(() =>
  S.Struct({
    arn: S.String,
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "UpdateBillingViewResponse",
}) as any as S.Schema<UpdateBillingViewResponse>;
export type BillingViewStatus =
  | "HEALTHY"
  | "UNHEALTHY"
  | "CREATING"
  | "UPDATING"
  | (string & {});
export const BillingViewStatus = S.String;
export type BillingViewStatusReason =
  | "SOURCE_VIEW_UNHEALTHY"
  | "SOURCE_VIEW_UPDATING"
  | "SOURCE_VIEW_ACCESS_DENIED"
  | "SOURCE_VIEW_NOT_FOUND"
  | "CYCLIC_DEPENDENCY"
  | "SOURCE_VIEW_DEPTH_EXCEEDED"
  | "AGGREGATE_SOURCE"
  | "VIEW_OWNER_NOT_MANAGEMENT_ACCOUNT"
  | (string & {});
export const BillingViewStatusReason = S.String;
export type BillingViewStatusReasons = BillingViewStatusReason[];
export const BillingViewStatusReasons = S.Array(BillingViewStatusReason);
export interface CreateBillingViewRequest {
  name: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  sourceViews: string[];
  dataFilterExpression?: Expression;
  clientToken?: string;
  resourceTags?: ResourceTag[];
}
export const CreateBillingViewRequest = S.suspend(() =>
  S.Struct({
    name: SensitiveString,
    description: S.optional(SensitiveString),
    sourceViews: BillingViewSourceViewsList,
    dataFilterExpression: S.optional(Expression),
    clientToken: S.optional(S.String).pipe(
      T.HttpHeader("X-Amzn-Client-Token"),
      T.IdempotencyToken(),
    ),
    resourceTags: S.optional(ResourceTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateBillingViewRequest",
}) as any as S.Schema<CreateBillingViewRequest>;
export interface BillingViewHealthStatus {
  statusCode?: BillingViewStatus;
  statusReasons?: BillingViewStatusReason[];
}
export const BillingViewHealthStatus = S.suspend(() =>
  S.Struct({
    statusCode: S.optional(BillingViewStatus),
    statusReasons: S.optional(BillingViewStatusReasons),
  }),
).annotations({
  identifier: "BillingViewHealthStatus",
}) as any as S.Schema<BillingViewHealthStatus>;
export interface BillingViewElement {
  arn?: string;
  name?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  billingViewType?: BillingViewType;
  ownerAccountId?: string;
  sourceAccountId?: string;
  dataFilterExpression?: Expression;
  createdAt?: Date;
  updatedAt?: Date;
  derivedViewCount?: number;
  sourceViewCount?: number;
  viewDefinitionLastUpdatedAt?: Date;
  healthStatus?: BillingViewHealthStatus;
}
export const BillingViewElement = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    billingViewType: S.optional(BillingViewType),
    ownerAccountId: S.optional(S.String),
    sourceAccountId: S.optional(S.String),
    dataFilterExpression: S.optional(Expression),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    derivedViewCount: S.optional(S.Number),
    sourceViewCount: S.optional(S.Number),
    viewDefinitionLastUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    healthStatus: S.optional(BillingViewHealthStatus),
  }),
).annotations({
  identifier: "BillingViewElement",
}) as any as S.Schema<BillingViewElement>;
export interface BillingViewListElement {
  arn?: string;
  name?: string | redacted.Redacted<string>;
  description?: string | redacted.Redacted<string>;
  ownerAccountId?: string;
  sourceAccountId?: string;
  billingViewType?: BillingViewType;
  healthStatus?: BillingViewHealthStatus;
}
export const BillingViewListElement = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    name: S.optional(SensitiveString),
    description: S.optional(SensitiveString),
    ownerAccountId: S.optional(S.String),
    sourceAccountId: S.optional(S.String),
    billingViewType: S.optional(BillingViewType),
    healthStatus: S.optional(BillingViewHealthStatus),
  }),
).annotations({
  identifier: "BillingViewListElement",
}) as any as S.Schema<BillingViewListElement>;
export type BillingViewList = BillingViewListElement[];
export const BillingViewList = S.Array(BillingViewListElement);
export interface CreateBillingViewResponse {
  arn: string;
  createdAt?: Date;
}
export const CreateBillingViewResponse = S.suspend(() =>
  S.Struct({
    arn: S.String,
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CreateBillingViewResponse",
}) as any as S.Schema<CreateBillingViewResponse>;
export interface GetBillingViewResponse {
  billingView: BillingViewElement;
}
export const GetBillingViewResponse = S.suspend(() =>
  S.Struct({ billingView: BillingViewElement }),
).annotations({
  identifier: "GetBillingViewResponse",
}) as any as S.Schema<GetBillingViewResponse>;
export interface ListBillingViewsResponse {
  billingViews: BillingViewListElement[];
  nextToken?: string;
}
export const ListBillingViewsResponse = S.suspend(() =>
  S.Struct({ billingViews: BillingViewList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListBillingViewsResponse",
}) as any as S.Schema<ListBillingViewsResponse>;
export type ValidationExceptionReason =
  | "unknownOperation"
  | "cannotParse"
  | "fieldValidationFailed"
  | "other"
  | (string & {});
export const ValidationExceptionReason = S.String;
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
  T.AwsQueryError({ code: "BillingAccessDenied", httpResponseCode: 403 }),
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.AwsQueryError({ code: "BillingInternalServer", httpResponseCode: 500 }),
).pipe(C.withServerError) {}
export class BillingViewHealthStatusException extends S.TaggedError<BillingViewHealthStatusException>()(
  "BillingViewHealthStatusException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
  T.AwsQueryError({ code: "BillingConflict", httpResponseCode: 409 }),
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
  T.AwsQueryError({ code: "BillingResourceNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.AwsQueryError({ code: "BillingThrottling", httpResponseCode: 429 }),
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    resourceId: S.String,
    resourceType: S.String,
    serviceCode: S.String,
    quotaCode: S.String,
  },
  T.AwsQueryError({
    code: "BillingServiceQuotaExceeded",
    httpResponseCode: 402,
  }),
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: ValidationExceptionReason,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
  T.AwsQueryError({ code: "BillingValidation", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes the specified billing view.
 */
export const deleteBillingView: (
  input: DeleteBillingViewRequest,
) => effect.Effect<
  DeleteBillingViewResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBillingViewRequest,
  output: DeleteBillingViewResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes one or more tags from a resource. Specify only tag keys in your request. Don't specify the value.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
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
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the resource-based policy document attached to the resource in `JSON` format.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => effect.Effect<
  GetResourcePolicyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the source views (managed Amazon Web Services billing views) associated with the billing view.
 */
export const listSourceViewsForBillingView: {
  (
    input: ListSourceViewsForBillingViewRequest,
  ): effect.Effect<
    ListSourceViewsForBillingViewResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSourceViewsForBillingViewRequest,
  ) => stream.Stream<
    ListSourceViewsForBillingViewResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSourceViewsForBillingViewRequest,
  ) => stream.Stream<
    BillingViewArn,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSourceViewsForBillingViewRequest,
  output: ListSourceViewsForBillingViewResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "sourceViews",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists tags associated with the billing view resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
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
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the association between one or more source billing views and an existing billing view. This allows modifying the composition of aggregate billing views.
 */
export const disassociateSourceViews: (
  input: DisassociateSourceViewsRequest,
) => effect.Effect<
  DisassociateSourceViewsResponse,
  | AccessDeniedException
  | BillingViewHealthStatusException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateSourceViewsRequest,
  output: DisassociateSourceViewsResponse,
  errors: [
    AccessDeniedException,
    BillingViewHealthStatusException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the metadata associated to the specified billing view ARN.
 */
export const getBillingView: (
  input: GetBillingViewRequest,
) => effect.Effect<
  GetBillingViewResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBillingViewRequest,
  output: GetBillingViewResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the billing views available for a given time period.
 *
 * Every Amazon Web Services account has a unique `PRIMARY` billing view that represents the billing data available by default. Accounts that use Billing Conductor also have `BILLING_GROUP` billing views representing pro forma costs associated with each created billing group.
 */
export const listBillingViews: {
  (
    input: ListBillingViewsRequest,
  ): effect.Effect<
    ListBillingViewsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBillingViewsRequest,
  ) => stream.Stream<
    ListBillingViewsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBillingViewsRequest,
  ) => stream.Stream<
    BillingViewListElement,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBillingViewsRequest,
  output: ListBillingViewsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "billingViews",
    pageSize: "maxResults",
  } as const,
}));
/**
 * An API operation for adding one or more tags (key-value pairs) to a resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
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
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associates one or more source billing views with an existing billing view. This allows creating aggregate billing views that combine data from multiple sources.
 */
export const associateSourceViews: (
  input: AssociateSourceViewsRequest,
) => effect.Effect<
  AssociateSourceViewsResponse,
  | AccessDeniedException
  | BillingViewHealthStatusException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AssociateSourceViewsRequest,
  output: AssociateSourceViewsResponse,
  errors: [
    AccessDeniedException,
    BillingViewHealthStatusException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * An API to update the attributes of the billing view.
 */
export const updateBillingView: (
  input: UpdateBillingViewRequest,
) => effect.Effect<
  UpdateBillingViewResponse,
  | AccessDeniedException
  | BillingViewHealthStatusException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBillingViewRequest,
  output: UpdateBillingViewResponse,
  errors: [
    AccessDeniedException,
    BillingViewHealthStatusException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a billing view with the specified billing view attributes.
 */
export const createBillingView: (
  input: CreateBillingViewRequest,
) => effect.Effect<
  CreateBillingViewResponse,
  | AccessDeniedException
  | BillingViewHealthStatusException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBillingViewRequest,
  output: CreateBillingViewResponse,
  errors: [
    AccessDeniedException,
    BillingViewHealthStatusException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
