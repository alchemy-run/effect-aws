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
import type { Region as Rgn } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "Resource Groups Tagging API",
  serviceShapeName: "ResourceGroupsTaggingAPI_20170126",
});
const auth = T.AwsAuthSigv4({ name: "tagging" });
const ver = T.ServiceVersion("2017-01-26");
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
              `https://tagging-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://tagging-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://tagging.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://tagging.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Status = string;
export type S3Location = string;
export type StartDate = string;
export type ErrorMessage = string;
export type TargetId = string;
export type Region = string;
export type AmazonResourceType = string;
export type TagKey = string;
export type MaxResultsGetComplianceSummary = number;
export type PaginationToken = string;
export type ResourcesPerPage = number;
export type TagsPerPage = number;
export type ResourceARN = string;
export type MaxResultsForListRequiredTags = number;
export type S3Bucket = string;
export type TagValue = string;
export type ExceptionMessage = string;
export type LastUpdated = string;
export type NonCompliantResources = number;
export type ResourceType = string;
export type CloudFormationResourceType = string;
export type StatusCode = number;

//# Schemas
export interface DescribeReportCreationInput {}
export const DescribeReportCreationInput = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/DescribeReportCreation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReportCreationInput",
}) as any as S.Schema<DescribeReportCreationInput>;
export type TargetIdFilterList = string[];
export const TargetIdFilterList = S.Array(S.String);
export type RegionFilterList = string[];
export const RegionFilterList = S.Array(S.String);
export type ResourceTypeFilterList = string[];
export const ResourceTypeFilterList = S.Array(S.String);
export type TagKeyFilterList = string[];
export const TagKeyFilterList = S.Array(S.String);
export type GroupBy = string[];
export const GroupBy = S.Array(S.String);
export type ResourceARNListForGet = string[];
export const ResourceARNListForGet = S.Array(S.String);
export type ResourceARNListForTagUntag = string[];
export const ResourceARNListForTagUntag = S.Array(S.String);
export type TagKeyListForUntag = string[];
export const TagKeyListForUntag = S.Array(S.String);
export interface DescribeReportCreationOutput {
  Status?: string;
  S3Location?: string;
  StartDate?: string;
  ErrorMessage?: string;
}
export const DescribeReportCreationOutput = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    S3Location: S.optional(S.String),
    StartDate: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeReportCreationOutput",
}) as any as S.Schema<DescribeReportCreationOutput>;
export interface GetComplianceSummaryInput {
  TargetIdFilters?: TargetIdFilterList;
  RegionFilters?: RegionFilterList;
  ResourceTypeFilters?: ResourceTypeFilterList;
  TagKeyFilters?: TagKeyFilterList;
  GroupBy?: GroupBy;
  MaxResults?: number;
  PaginationToken?: string;
}
export const GetComplianceSummaryInput = S.suspend(() =>
  S.Struct({
    TargetIdFilters: S.optional(TargetIdFilterList),
    RegionFilters: S.optional(RegionFilterList),
    ResourceTypeFilters: S.optional(ResourceTypeFilterList),
    TagKeyFilters: S.optional(TagKeyFilterList),
    GroupBy: S.optional(GroupBy),
    MaxResults: S.optional(S.Number),
    PaginationToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetComplianceSummary" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetComplianceSummaryInput",
}) as any as S.Schema<GetComplianceSummaryInput>;
export interface GetTagKeysInput {
  PaginationToken?: string;
}
export const GetTagKeysInput = S.suspend(() =>
  S.Struct({ PaginationToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTagKeys" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTagKeysInput",
}) as any as S.Schema<GetTagKeysInput>;
export interface GetTagValuesInput {
  PaginationToken?: string;
  Key: string;
}
export const GetTagValuesInput = S.suspend(() =>
  S.Struct({ PaginationToken: S.optional(S.String), Key: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetTagValues" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetTagValuesInput",
}) as any as S.Schema<GetTagValuesInput>;
export interface ListRequiredTagsInput {
  NextToken?: string;
  MaxResults?: number;
}
export const ListRequiredTagsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ListRequiredTags" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRequiredTagsInput",
}) as any as S.Schema<ListRequiredTagsInput>;
export interface StartReportCreationInput {
  S3Bucket: string;
}
export const StartReportCreationInput = S.suspend(() =>
  S.Struct({ S3Bucket: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/StartReportCreation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartReportCreationInput",
}) as any as S.Schema<StartReportCreationInput>;
export interface StartReportCreationOutput {}
export const StartReportCreationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartReportCreationOutput",
}) as any as S.Schema<StartReportCreationOutput>;
export interface UntagResourcesInput {
  ResourceARNList: ResourceARNListForTagUntag;
  TagKeys: TagKeyListForUntag;
}
export const UntagResourcesInput = S.suspend(() =>
  S.Struct({
    ResourceARNList: ResourceARNListForTagUntag,
    TagKeys: TagKeyListForUntag,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/UntagResources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourcesInput",
}) as any as S.Schema<UntagResourcesInput>;
export type TagValueList = string[];
export const TagValueList = S.Array(S.String);
export interface TagFilter {
  Key?: string;
  Values?: TagValueList;
}
export const TagFilter = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Values: S.optional(TagValueList) }),
).annotations({ identifier: "TagFilter" }) as any as S.Schema<TagFilter>;
export type TagFilterList = TagFilter[];
export const TagFilterList = S.Array(TagFilter);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type TagValuesOutputList = string[];
export const TagValuesOutputList = S.Array(S.String);
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface GetResourcesInput {
  PaginationToken?: string;
  TagFilters?: TagFilterList;
  ResourcesPerPage?: number;
  TagsPerPage?: number;
  ResourceTypeFilters?: ResourceTypeFilterList;
  IncludeComplianceDetails?: boolean;
  ExcludeCompliantResources?: boolean;
  ResourceARNList?: ResourceARNListForGet;
}
export const GetResourcesInput = S.suspend(() =>
  S.Struct({
    PaginationToken: S.optional(S.String),
    TagFilters: S.optional(TagFilterList),
    ResourcesPerPage: S.optional(S.Number),
    TagsPerPage: S.optional(S.Number),
    ResourceTypeFilters: S.optional(ResourceTypeFilterList),
    IncludeComplianceDetails: S.optional(S.Boolean),
    ExcludeCompliantResources: S.optional(S.Boolean),
    ResourceARNList: S.optional(ResourceARNListForGet),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/GetResources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourcesInput",
}) as any as S.Schema<GetResourcesInput>;
export interface GetTagKeysOutput {
  PaginationToken?: string;
  TagKeys?: TagKeyList;
}
export const GetTagKeysOutput = S.suspend(() =>
  S.Struct({
    PaginationToken: S.optional(S.String),
    TagKeys: S.optional(TagKeyList),
  }),
).annotations({
  identifier: "GetTagKeysOutput",
}) as any as S.Schema<GetTagKeysOutput>;
export interface GetTagValuesOutput {
  PaginationToken?: string;
  TagValues?: TagValuesOutputList;
}
export const GetTagValuesOutput = S.suspend(() =>
  S.Struct({
    PaginationToken: S.optional(S.String),
    TagValues: S.optional(TagValuesOutputList),
  }),
).annotations({
  identifier: "GetTagValuesOutput",
}) as any as S.Schema<GetTagValuesOutput>;
export interface TagResourcesInput {
  ResourceARNList: ResourceARNListForTagUntag;
  Tags: TagMap;
}
export const TagResourcesInput = S.suspend(() =>
  S.Struct({ ResourceARNList: ResourceARNListForTagUntag, Tags: TagMap }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/TagResources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourcesInput",
}) as any as S.Schema<TagResourcesInput>;
export type CloudFormationResourceTypes = string[];
export const CloudFormationResourceTypes = S.Array(S.String);
export type ReportingTagKeys = string[];
export const ReportingTagKeys = S.Array(S.String);
export interface Summary {
  LastUpdated?: string;
  TargetId?: string;
  TargetIdType?: string;
  Region?: string;
  ResourceType?: string;
  NonCompliantResources?: number;
}
export const Summary = S.suspend(() =>
  S.Struct({
    LastUpdated: S.optional(S.String),
    TargetId: S.optional(S.String),
    TargetIdType: S.optional(S.String),
    Region: S.optional(S.String),
    ResourceType: S.optional(S.String),
    NonCompliantResources: S.optional(S.Number),
  }),
).annotations({ identifier: "Summary" }) as any as S.Schema<Summary>;
export type SummaryList = Summary[];
export const SummaryList = S.Array(Summary);
export interface RequiredTag {
  ResourceType?: string;
  CloudFormationResourceTypes?: CloudFormationResourceTypes;
  ReportingTagKeys?: ReportingTagKeys;
}
export const RequiredTag = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(S.String),
    CloudFormationResourceTypes: S.optional(CloudFormationResourceTypes),
    ReportingTagKeys: S.optional(ReportingTagKeys),
  }),
).annotations({ identifier: "RequiredTag" }) as any as S.Schema<RequiredTag>;
export type RequiredTagsForListRequiredTags = RequiredTag[];
export const RequiredTagsForListRequiredTags = S.Array(RequiredTag);
export interface GetComplianceSummaryOutput {
  SummaryList?: SummaryList;
  PaginationToken?: string;
}
export const GetComplianceSummaryOutput = S.suspend(() =>
  S.Struct({
    SummaryList: S.optional(SummaryList),
    PaginationToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetComplianceSummaryOutput",
}) as any as S.Schema<GetComplianceSummaryOutput>;
export interface ListRequiredTagsOutput {
  RequiredTags?: RequiredTagsForListRequiredTags;
  NextToken?: string;
}
export const ListRequiredTagsOutput = S.suspend(() =>
  S.Struct({
    RequiredTags: S.optional(RequiredTagsForListRequiredTags),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRequiredTagsOutput",
}) as any as S.Schema<ListRequiredTagsOutput>;
export interface FailureInfo {
  StatusCode?: number;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const FailureInfo = S.suspend(() =>
  S.Struct({
    StatusCode: S.optional(S.Number),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "FailureInfo" }) as any as S.Schema<FailureInfo>;
export type FailedResourcesMap = { [key: string]: FailureInfo };
export const FailedResourcesMap = S.Record({
  key: S.String,
  value: FailureInfo,
});
export interface TagResourcesOutput {
  FailedResourcesMap?: FailedResourcesMap;
}
export const TagResourcesOutput = S.suspend(() =>
  S.Struct({ FailedResourcesMap: S.optional(FailedResourcesMap) }),
).annotations({
  identifier: "TagResourcesOutput",
}) as any as S.Schema<TagResourcesOutput>;
export interface UntagResourcesOutput {
  FailedResourcesMap?: FailedResourcesMap;
}
export const UntagResourcesOutput = S.suspend(() =>
  S.Struct({ FailedResourcesMap: S.optional(FailedResourcesMap) }),
).annotations({
  identifier: "UntagResourcesOutput",
}) as any as S.Schema<UntagResourcesOutput>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface ComplianceDetails {
  NoncompliantKeys?: TagKeyList;
  KeysWithNoncompliantValues?: TagKeyList;
  ComplianceStatus?: boolean;
}
export const ComplianceDetails = S.suspend(() =>
  S.Struct({
    NoncompliantKeys: S.optional(TagKeyList),
    KeysWithNoncompliantValues: S.optional(TagKeyList),
    ComplianceStatus: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ComplianceDetails",
}) as any as S.Schema<ComplianceDetails>;
export interface ResourceTagMapping {
  ResourceARN?: string;
  Tags?: TagList;
  ComplianceDetails?: ComplianceDetails;
}
export const ResourceTagMapping = S.suspend(() =>
  S.Struct({
    ResourceARN: S.optional(S.String),
    Tags: S.optional(TagList),
    ComplianceDetails: S.optional(ComplianceDetails),
  }),
).annotations({
  identifier: "ResourceTagMapping",
}) as any as S.Schema<ResourceTagMapping>;
export type ResourceTagMappingList = ResourceTagMapping[];
export const ResourceTagMappingList = S.Array(ResourceTagMapping);
export interface GetResourcesOutput {
  PaginationToken?: string;
  ResourceTagMappingList?: ResourceTagMappingList;
}
export const GetResourcesOutput = S.suspend(() =>
  S.Struct({
    PaginationToken: S.optional(S.String),
    ResourceTagMappingList: S.optional(ResourceTagMappingList),
  }),
).annotations({
  identifier: "GetResourcesOutput",
}) as any as S.Schema<GetResourcesOutput>;

//# Errors
export class ConstraintViolationException extends S.TaggedError<ConstraintViolationException>()(
  "ConstraintViolationException",
  { Message: S.optional(S.String) },
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  { Message: S.optional(S.String) },
) {}
export class ThrottledException extends S.TaggedError<ThrottledException>()(
  "ThrottledException",
  { Message: S.optional(S.String) },
) {}
export class PaginationTokenExpiredException extends S.TaggedError<PaginationTokenExpiredException>()(
  "PaginationTokenExpiredException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Describes the status of the `StartReportCreation` operation.
 *
 * You can call this operation only from the organization's
 * management account and from the us-east-1 Region.
 */
export const describeReportCreation: (
  input: DescribeReportCreationInput,
) => Effect.Effect<
  DescribeReportCreationOutput,
  | ConstraintViolationException
  | InternalServiceException
  | InvalidParameterException
  | ThrottledException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeReportCreationInput,
  output: DescribeReportCreationOutput,
  errors: [
    ConstraintViolationException,
    InternalServiceException,
    InvalidParameterException,
    ThrottledException,
  ],
}));
/**
 * Lists the required tags for supported resource types in an Amazon Web Services account.
 */
export const listRequiredTags: {
  (
    input: ListRequiredTagsInput,
  ): Effect.Effect<
    ListRequiredTagsOutput,
    | InternalServiceException
    | InvalidParameterException
    | PaginationTokenExpiredException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: ListRequiredTagsInput,
  ) => Stream.Stream<
    ListRequiredTagsOutput,
    | InternalServiceException
    | InvalidParameterException
    | PaginationTokenExpiredException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: ListRequiredTagsInput,
  ) => Stream.Stream<
    RequiredTag,
    | InternalServiceException
    | InvalidParameterException
    | PaginationTokenExpiredException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRequiredTagsInput,
  output: ListRequiredTagsOutput,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    PaginationTokenExpiredException,
    ThrottledException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "RequiredTags",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Removes the specified tags from the specified resources. When you specify a tag key,
 * the action removes both that key and its associated value. The operation succeeds even
 * if you attempt to remove tags from a resource that were already removed. Note the
 * following:
 *
 * - To remove tags from a resource, you need the necessary permissions for the
 * service that the resource belongs to as well as permissions for removing tags.
 * For more information, see the documentation for the service whose resource you
 * want to untag.
 *
 * - You can only tag resources that are located in the specified Amazon Web Services Region for
 * the calling Amazon Web Services account.
 *
 * **Minimum permissions**
 *
 * In addition to the `tag:UntagResources` permission required by this
 * operation, you must also have the remove tags permission defined by the service that
 * created the resource. For example, to remove the tags from an Amazon EC2 instance using the
 * `UntagResources` operation, you must have both of the following
 * permissions:
 *
 * - `tag:UntagResources`
 *
 * - `ec2:DeleteTags`
 *
 * In addition, some services might have specific requirements for untagging some
 * types of resources. For example, to untag Amazon Web Services Glue Connection, you must also have the
 * `glue:GetConnection` permission. If the expected minimum permissions
 * don't work, check the documentation for that service's tagging APIs for more
 * information.
 */
export const untagResources: (
  input: UntagResourcesInput,
) => Effect.Effect<
  UntagResourcesOutput,
  | InternalServiceException
  | InvalidParameterException
  | ThrottledException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourcesInput,
  output: UntagResourcesOutput,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    ThrottledException,
  ],
}));
/**
 * Returns a table that shows counts of resources that are noncompliant with their tag
 * policies.
 *
 * For more information on tag policies, see Tag Policies in
 * the *Organizations User Guide.*
 *
 * You can call this operation only from the organization's
 * management account and from the us-east-1 Region.
 *
 * This operation supports pagination, where the response can be sent in
 * multiple pages. You should check the `PaginationToken` response parameter to determine
 * if there are additional results available to return. Repeat the query, passing the
 * `PaginationToken` response parameter value as an input to the next request until you
 * recieve a `null` value. A null value for `PaginationToken` indicates that
 * there are no more results waiting to be returned.
 */
export const getComplianceSummary: {
  (
    input: GetComplianceSummaryInput,
  ): Effect.Effect<
    GetComplianceSummaryOutput,
    | ConstraintViolationException
    | InternalServiceException
    | InvalidParameterException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetComplianceSummaryInput,
  ) => Stream.Stream<
    GetComplianceSummaryOutput,
    | ConstraintViolationException
    | InternalServiceException
    | InvalidParameterException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetComplianceSummaryInput,
  ) => Stream.Stream<
    Summary,
    | ConstraintViolationException
    | InternalServiceException
    | InvalidParameterException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetComplianceSummaryInput,
  output: GetComplianceSummaryOutput,
  errors: [
    ConstraintViolationException,
    InternalServiceException,
    InvalidParameterException,
    ThrottledException,
  ],
  pagination: {
    inputToken: "PaginationToken",
    outputToken: "PaginationToken",
    items: "SummaryList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Applies one or more tags to the specified resources. Note the following:
 *
 * - Not all resources can have tags. For a list of services with resources that
 * support tagging using this operation, see Services that support the
 * Resource Groups Tagging API. If the resource doesn't yet support
 * this operation, the resource's service might support tagging using its own API
 * operations. For more information, refer to the documentation for that
 * service.
 *
 * - Each resource can have up to 50 tags. For other limits, see Tag Naming and Usage Conventions in the Amazon Web Services General
 * Reference.
 *
 * - You can only tag resources that are located in the specified Amazon Web Services Region for
 * the Amazon Web Services account.
 *
 * - To add tags to a resource, you need the necessary permissions for the service
 * that the resource belongs to as well as permissions for adding tags. For more
 * information, see the documentation for each service.
 *
 * - When you use the Amazon Web Services Resource
 * Groups Tagging API to update tags for Amazon Web Services CloudFormation stack
 * sets, Amazon Web Services calls the Amazon Web Services
 * CloudFormation `UpdateStack`
 * operation. This operation
 * may initiate additional resource property updates in addition to the desired tag
 * updates. To avoid unexpected resource updates, Amazon Web Services recommends that you only
 * apply or update tags to your CloudFormation stack sets using Amazon Web Services
 * CloudFormation.
 *
 * Do not store personally identifiable information (PII) or other confidential or
 * sensitive information in tags. We use tags to provide you with billing and
 * administration services. Tags are not intended to be used for private or sensitive
 * data.
 *
 * **Minimum permissions**
 *
 * In addition to the `tag:TagResources` permission required by this
 * operation, you must also have the tagging permission defined by the service that created
 * the resource. For example, to tag an Amazon EC2 instance using the `TagResources`
 * operation, you must have both of the following permissions:
 *
 * - `tag:TagResources`
 *
 * - `ec2:CreateTags`
 *
 * In addition, some services might have specific requirements for tagging some types
 * of resources. For example, to tag an Amazon S3 bucket, you must also have the
 * `s3:GetBucketTagging` permission. If the expected minimum permissions
 * don't work, check the documentation for that service's tagging APIs for more
 * information.
 */
export const tagResources: (
  input: TagResourcesInput,
) => Effect.Effect<
  TagResourcesOutput,
  | InternalServiceException
  | InvalidParameterException
  | ThrottledException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourcesInput,
  output: TagResourcesOutput,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    ThrottledException,
  ],
}));
/**
 * Generates a report that lists all tagged resources in the accounts across your
 * organization and tells whether each resource is compliant with the effective tag policy.
 * Compliance data is refreshed daily. The report is generated asynchronously.
 *
 * The generated report is saved to the following location:
 *
 * `s3://amzn-s3-demo-bucket/AwsTagPolicies/o-exampleorgid/YYYY-MM-ddTHH:mm:ssZ/report.csv`
 *
 * For more information about evaluating resource compliance with tag policies, including
 * the required permissions, review Permissions for evaluating organization-wide compliance in the
 * *Tagging Amazon Web Services Resources and Tag Editor* user guide.
 *
 * You can call this operation only from the organization's
 * management account and from the us-east-1 Region.
 *
 * If the account associated with the identity used to call
 * `StartReportCreation` is different from the account that owns the Amazon S3
 * bucket, there must be a bucket policy attached to the bucket to provide access. For more
 * information, review Amazon S3 bucket
 * policy for report storage in the Tagging Amazon Web Services Resources and Tag
 * Editor user guide.
 */
export const startReportCreation: (
  input: StartReportCreationInput,
) => Effect.Effect<
  StartReportCreationOutput,
  | ConcurrentModificationException
  | ConstraintViolationException
  | InternalServiceException
  | InvalidParameterException
  | ThrottledException
  | CommonErrors,
  Credentials | Rgn | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartReportCreationInput,
  output: StartReportCreationOutput,
  errors: [
    ConcurrentModificationException,
    ConstraintViolationException,
    InternalServiceException,
    InvalidParameterException,
    ThrottledException,
  ],
}));
/**
 * Returns all tag keys currently in use in the specified Amazon Web Services Region for the calling
 * account.
 *
 * This operation supports pagination, where the response can be sent in
 * multiple pages. You should check the `PaginationToken` response parameter to determine
 * if there are additional results available to return. Repeat the query, passing the
 * `PaginationToken` response parameter value as an input to the next request until you
 * recieve a `null` value. A null value for `PaginationToken` indicates that
 * there are no more results waiting to be returned.
 */
export const getTagKeys: {
  (
    input: GetTagKeysInput,
  ): Effect.Effect<
    GetTagKeysOutput,
    | InternalServiceException
    | InvalidParameterException
    | PaginationTokenExpiredException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetTagKeysInput,
  ) => Stream.Stream<
    GetTagKeysOutput,
    | InternalServiceException
    | InvalidParameterException
    | PaginationTokenExpiredException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetTagKeysInput,
  ) => Stream.Stream<
    TagKey,
    | InternalServiceException
    | InvalidParameterException
    | PaginationTokenExpiredException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetTagKeysInput,
  output: GetTagKeysOutput,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    PaginationTokenExpiredException,
    ThrottledException,
  ],
  pagination: {
    inputToken: "PaginationToken",
    outputToken: "PaginationToken",
    items: "TagKeys",
  } as const,
}));
/**
 * Returns all tag values for the specified key that are used in the specified Amazon Web Services
 * Region for the calling account.
 *
 * This operation supports pagination, where the response can be sent in
 * multiple pages. You should check the `PaginationToken` response parameter to determine
 * if there are additional results available to return. Repeat the query, passing the
 * `PaginationToken` response parameter value as an input to the next request until you
 * recieve a `null` value. A null value for `PaginationToken` indicates that
 * there are no more results waiting to be returned.
 */
export const getTagValues: {
  (
    input: GetTagValuesInput,
  ): Effect.Effect<
    GetTagValuesOutput,
    | InternalServiceException
    | InvalidParameterException
    | PaginationTokenExpiredException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetTagValuesInput,
  ) => Stream.Stream<
    GetTagValuesOutput,
    | InternalServiceException
    | InvalidParameterException
    | PaginationTokenExpiredException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetTagValuesInput,
  ) => Stream.Stream<
    TagValue,
    | InternalServiceException
    | InvalidParameterException
    | PaginationTokenExpiredException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetTagValuesInput,
  output: GetTagValuesOutput,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    PaginationTokenExpiredException,
    ThrottledException,
  ],
  pagination: {
    inputToken: "PaginationToken",
    outputToken: "PaginationToken",
    items: "TagValues",
  } as const,
}));
/**
 * Returns all the tagged or previously tagged resources that are located in the
 * specified Amazon Web Services Region for the account.
 *
 * Depending on what information you want returned, you can also specify the
 * following:
 *
 * - *Filters* that specify what tags and resource types you
 * want returned. The response includes all tags that are associated with the
 * requested resources.
 *
 * - Information about compliance with the account's effective tag policy. For more
 * information on tag policies, see Tag
 * Policies in the *Organizations User Guide.*
 *
 * This operation supports pagination, where the response can be sent in
 * multiple pages. You should check the `PaginationToken` response parameter to determine
 * if there are additional results available to return. Repeat the query, passing the
 * `PaginationToken` response parameter value as an input to the next request until you
 * recieve a `null` value. A null value for `PaginationToken` indicates that
 * there are no more results waiting to be returned.
 *
 * `GetResources` does not return untagged resources.
 *
 * To find untagged resources in your account, use Amazon Web Services Resource Explorer with a
 * query that uses `tag:none`. For more information, see Search query syntax reference for Resource Explorer.
 */
export const getResources: {
  (
    input: GetResourcesInput,
  ): Effect.Effect<
    GetResourcesOutput,
    | InternalServiceException
    | InvalidParameterException
    | PaginationTokenExpiredException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourcesInput,
  ) => Stream.Stream<
    GetResourcesOutput,
    | InternalServiceException
    | InvalidParameterException
    | PaginationTokenExpiredException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
  items: (
    input: GetResourcesInput,
  ) => Stream.Stream<
    ResourceTagMapping,
    | InternalServiceException
    | InvalidParameterException
    | PaginationTokenExpiredException
    | ThrottledException
    | CommonErrors,
    Credentials | Rgn | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourcesInput,
  output: GetResourcesOutput,
  errors: [
    InternalServiceException,
    InvalidParameterException,
    PaginationTokenExpiredException,
    ThrottledException,
  ],
  pagination: {
    inputToken: "PaginationToken",
    outputToken: "PaginationToken",
    items: "ResourceTagMappingList",
    pageSize: "ResourcesPerPage",
  } as const,
}));
