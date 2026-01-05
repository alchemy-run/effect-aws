import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Resource Groups Tagging API",
  serviceShapeName: "ResourceGroupsTaggingAPI_20170126",
});
const auth = T.AwsAuthSigv4({ name: "tagging" });
const ver = T.ServiceVersion("2017-01-26");
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
                        url: "https://tagging-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://tagging-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://tagging.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://tagging.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeReportCreationInput extends S.Class<DescribeReportCreationInput>(
  "DescribeReportCreationInput",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/DescribeReportCreation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TargetIdFilterList = S.Array(S.String);
export const RegionFilterList = S.Array(S.String);
export const ResourceTypeFilterList = S.Array(S.String);
export const TagKeyFilterList = S.Array(S.String);
export const GroupBy = S.Array(S.String);
export const ResourceARNListForGet = S.Array(S.String);
export const ResourceARNListForTagUntag = S.Array(S.String);
export const TagKeyListForUntag = S.Array(S.String);
export class DescribeReportCreationOutput extends S.Class<DescribeReportCreationOutput>(
  "DescribeReportCreationOutput",
)({
  Status: S.optional(S.String),
  S3Location: S.optional(S.String),
  StartDate: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export class GetComplianceSummaryInput extends S.Class<GetComplianceSummaryInput>(
  "GetComplianceSummaryInput",
)(
  {
    TargetIdFilters: S.optional(TargetIdFilterList),
    RegionFilters: S.optional(RegionFilterList),
    ResourceTypeFilters: S.optional(ResourceTypeFilterList),
    TagKeyFilters: S.optional(TagKeyFilterList),
    GroupBy: S.optional(GroupBy),
    MaxResults: S.optional(S.Number),
    PaginationToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/GetComplianceSummary" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTagKeysInput extends S.Class<GetTagKeysInput>(
  "GetTagKeysInput",
)(
  { PaginationToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/GetTagKeys" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTagValuesInput extends S.Class<GetTagValuesInput>(
  "GetTagValuesInput",
)(
  { PaginationToken: S.optional(S.String), Key: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/GetTagValues" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRequiredTagsInput extends S.Class<ListRequiredTagsInput>(
  "ListRequiredTagsInput",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(
    T.Http({ method: "POST", uri: "/ListRequiredTags" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartReportCreationInput extends S.Class<StartReportCreationInput>(
  "StartReportCreationInput",
)(
  { S3Bucket: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/StartReportCreation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartReportCreationOutput extends S.Class<StartReportCreationOutput>(
  "StartReportCreationOutput",
)({}) {}
export class UntagResourcesInput extends S.Class<UntagResourcesInput>(
  "UntagResourcesInput",
)(
  { ResourceARNList: ResourceARNListForTagUntag, TagKeys: TagKeyListForUntag },
  T.all(
    T.Http({ method: "POST", uri: "/UntagResources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const TagValueList = S.Array(S.String);
export class TagFilter extends S.Class<TagFilter>("TagFilter")({
  Key: S.optional(S.String),
  Values: S.optional(TagValueList),
}) {}
export const TagFilterList = S.Array(TagFilter);
export const TagKeyList = S.Array(S.String);
export const TagValuesOutputList = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export class GetResourcesInput extends S.Class<GetResourcesInput>(
  "GetResourcesInput",
)(
  {
    PaginationToken: S.optional(S.String),
    TagFilters: S.optional(TagFilterList),
    ResourcesPerPage: S.optional(S.Number),
    TagsPerPage: S.optional(S.Number),
    ResourceTypeFilters: S.optional(ResourceTypeFilterList),
    IncludeComplianceDetails: S.optional(S.Boolean),
    ExcludeCompliantResources: S.optional(S.Boolean),
    ResourceARNList: S.optional(ResourceARNListForGet),
  },
  T.all(
    T.Http({ method: "POST", uri: "/GetResources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetTagKeysOutput extends S.Class<GetTagKeysOutput>(
  "GetTagKeysOutput",
)({ PaginationToken: S.optional(S.String), TagKeys: S.optional(TagKeyList) }) {}
export class GetTagValuesOutput extends S.Class<GetTagValuesOutput>(
  "GetTagValuesOutput",
)({
  PaginationToken: S.optional(S.String),
  TagValues: S.optional(TagValuesOutputList),
}) {}
export class TagResourcesInput extends S.Class<TagResourcesInput>(
  "TagResourcesInput",
)(
  { ResourceARNList: ResourceARNListForTagUntag, Tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/TagResources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const CloudFormationResourceTypes = S.Array(S.String);
export const ReportingTagKeys = S.Array(S.String);
export class Summary extends S.Class<Summary>("Summary")({
  LastUpdated: S.optional(S.String),
  TargetId: S.optional(S.String),
  TargetIdType: S.optional(S.String),
  Region: S.optional(S.String),
  ResourceType: S.optional(S.String),
  NonCompliantResources: S.optional(S.Number),
}) {}
export const SummaryList = S.Array(Summary);
export class RequiredTag extends S.Class<RequiredTag>("RequiredTag")({
  ResourceType: S.optional(S.String),
  CloudFormationResourceTypes: S.optional(CloudFormationResourceTypes),
  ReportingTagKeys: S.optional(ReportingTagKeys),
}) {}
export const RequiredTagsForListRequiredTags = S.Array(RequiredTag);
export class GetComplianceSummaryOutput extends S.Class<GetComplianceSummaryOutput>(
  "GetComplianceSummaryOutput",
)({
  SummaryList: S.optional(SummaryList),
  PaginationToken: S.optional(S.String),
}) {}
export class ListRequiredTagsOutput extends S.Class<ListRequiredTagsOutput>(
  "ListRequiredTagsOutput",
)({
  RequiredTags: S.optional(RequiredTagsForListRequiredTags),
  NextToken: S.optional(S.String),
}) {}
export class FailureInfo extends S.Class<FailureInfo>("FailureInfo")({
  StatusCode: S.optional(S.Number),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const FailedResourcesMap = S.Record({
  key: S.String,
  value: FailureInfo,
});
export class TagResourcesOutput extends S.Class<TagResourcesOutput>(
  "TagResourcesOutput",
)({ FailedResourcesMap: S.optional(FailedResourcesMap) }) {}
export class UntagResourcesOutput extends S.Class<UntagResourcesOutput>(
  "UntagResourcesOutput",
)({ FailedResourcesMap: S.optional(FailedResourcesMap) }) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class ComplianceDetails extends S.Class<ComplianceDetails>(
  "ComplianceDetails",
)({
  NoncompliantKeys: S.optional(TagKeyList),
  KeysWithNoncompliantValues: S.optional(TagKeyList),
  ComplianceStatus: S.optional(S.Boolean),
}) {}
export class ResourceTagMapping extends S.Class<ResourceTagMapping>(
  "ResourceTagMapping",
)({
  ResourceARN: S.optional(S.String),
  Tags: S.optional(TagList),
  ComplianceDetails: S.optional(ComplianceDetails),
}) {}
export const ResourceTagMappingList = S.Array(ResourceTagMapping);
export class GetResourcesOutput extends S.Class<GetResourcesOutput>(
  "GetResourcesOutput",
)({
  PaginationToken: S.optional(S.String),
  ResourceTagMappingList: S.optional(ResourceTagMappingList),
}) {}

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
export const describeReportCreation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeReportCreationInput,
    output: DescribeReportCreationOutput,
    errors: [
      ConstraintViolationException,
      InternalServiceException,
      InvalidParameterException,
      ThrottledException,
    ],
  }),
);
/**
 * Lists the required tags for supported resource types in an Amazon Web Services account.
 */
export const listRequiredTags = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
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
export const untagResources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getComplianceSummary =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const tagResources = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startReportCreation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTagKeys = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getTagValues = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
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
export const getResources = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
