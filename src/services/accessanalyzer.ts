import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "AccessAnalyzer",
  serviceShapeName: "AccessAnalyzer",
});
const auth = T.AwsAuthSigv4({ name: "access-analyzer" });
const ver = T.ServiceVersion("2019-11-01");
const proto = T.AwsProtocolsRestJson1();
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
                        url: "https://access-analyzer-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://access-analyzer.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://access-analyzer-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://access-analyzer.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://access-analyzer.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export const FindingIdList = S.Array(S.String);
export class ApplyArchiveRuleRequest extends S.Class<ApplyArchiveRuleRequest>(
  "ApplyArchiveRuleRequest",
)(
  {
    analyzerArn: S.String,
    ruleName: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/archive-rule" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ApplyArchiveRuleResponse extends S.Class<ApplyArchiveRuleResponse>(
  "ApplyArchiveRuleResponse",
)({}) {}
export class CancelPolicyGenerationRequest extends S.Class<CancelPolicyGenerationRequest>(
  "CancelPolicyGenerationRequest",
)(
  { jobId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "PUT", uri: "/policy/generation/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelPolicyGenerationResponse extends S.Class<CancelPolicyGenerationResponse>(
  "CancelPolicyGenerationResponse",
)({}) {}
export class CheckNoNewAccessRequest extends S.Class<CheckNoNewAccessRequest>(
  "CheckNoNewAccessRequest",
)(
  {
    newPolicyDocument: S.String,
    existingPolicyDocument: S.String,
    policyType: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/policy/check-no-new-access" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CheckNoPublicAccessRequest extends S.Class<CheckNoPublicAccessRequest>(
  "CheckNoPublicAccessRequest",
)(
  { policyDocument: S.String, resourceType: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/policy/check-no-public-access" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GenerateFindingRecommendationRequest extends S.Class<GenerateFindingRecommendationRequest>(
  "GenerateFindingRecommendationRequest",
)(
  {
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
    id: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "POST", uri: "/recommendation/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GenerateFindingRecommendationResponse extends S.Class<GenerateFindingRecommendationResponse>(
  "GenerateFindingRecommendationResponse",
)({}) {}
export class GetAccessPreviewRequest extends S.Class<GetAccessPreviewRequest>(
  "GetAccessPreviewRequest",
)(
  {
    accessPreviewId: S.String.pipe(T.HttpLabel()),
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/access-preview/{accessPreviewId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAnalyzedResourceRequest extends S.Class<GetAnalyzedResourceRequest>(
  "GetAnalyzedResourceRequest",
)(
  {
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
    resourceArn: S.String.pipe(T.HttpQuery("resourceArn")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/analyzed-resource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingRequest extends S.Class<GetFindingRequest>(
  "GetFindingRequest",
)(
  {
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
    id: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({ method: "GET", uri: "/finding/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingRecommendationRequest extends S.Class<GetFindingRecommendationRequest>(
  "GetFindingRecommendationRequest",
)(
  {
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
    id: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/recommendation/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingsStatisticsRequest extends S.Class<GetFindingsStatisticsRequest>(
  "GetFindingsStatisticsRequest",
)(
  { analyzerArn: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/analyzer/findings/statistics" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetFindingV2Request extends S.Class<GetFindingV2Request>(
  "GetFindingV2Request",
)(
  {
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
    id: S.String.pipe(T.HttpLabel()),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/findingv2/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetGeneratedPolicyRequest extends S.Class<GetGeneratedPolicyRequest>(
  "GetGeneratedPolicyRequest",
)(
  {
    jobId: S.String.pipe(T.HttpLabel()),
    includeResourcePlaceholders: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeResourcePlaceholders"),
    ),
    includeServiceLevelTemplate: S.optional(S.Boolean).pipe(
      T.HttpQuery("includeServiceLevelTemplate"),
    ),
  },
  T.all(
    T.Http({ method: "GET", uri: "/policy/generation/{jobId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAccessPreviewsRequest extends S.Class<ListAccessPreviewsRequest>(
  "ListAccessPreviewsRequest",
)(
  {
    analyzerArn: S.String.pipe(T.HttpQuery("analyzerArn")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/access-preview" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAnalyzedResourcesRequest extends S.Class<ListAnalyzedResourcesRequest>(
  "ListAnalyzedResourcesRequest",
)(
  {
    analyzerArn: S.String,
    resourceType: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/analyzed-resource" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ValueList = S.Array(S.String);
export class Criterion extends S.Class<Criterion>("Criterion")({
  eq: S.optional(ValueList),
  neq: S.optional(ValueList),
  contains: S.optional(ValueList),
  exists: S.optional(S.Boolean),
}) {}
export const FilterCriteriaMap = S.Record({ key: S.String, value: Criterion });
export class SortCriteria extends S.Class<SortCriteria>("SortCriteria")({
  attributeName: S.optional(S.String),
  orderBy: S.optional(S.String),
}) {}
export class ListFindingsV2Request extends S.Class<ListFindingsV2Request>(
  "ListFindingsV2Request",
)(
  {
    analyzerArn: S.String,
    filter: S.optional(FilterCriteriaMap),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
    sort: S.optional(SortCriteria),
  },
  T.all(
    T.Http({ method: "POST", uri: "/findingv2" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListPolicyGenerationsRequest extends S.Class<ListPolicyGenerationsRequest>(
  "ListPolicyGenerationsRequest",
)(
  {
    principalArn: S.optional(S.String).pipe(T.HttpQuery("principalArn")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/policy/generation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartResourceScanRequest extends S.Class<StartResourceScanRequest>(
  "StartResourceScanRequest",
)(
  {
    analyzerArn: S.String,
    resourceArn: S.String,
    resourceOwnerAccount: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/resource/scan" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartResourceScanResponse extends S.Class<StartResourceScanResponse>(
  "StartResourceScanResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateFindingsRequest extends S.Class<UpdateFindingsRequest>(
  "UpdateFindingsRequest",
)(
  {
    analyzerArn: S.String,
    status: S.String,
    ids: S.optional(FindingIdList),
    resourceArn: S.optional(S.String),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/finding" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateFindingsResponse extends S.Class<UpdateFindingsResponse>(
  "UpdateFindingsResponse",
)({}) {}
export class ValidatePolicyRequest extends S.Class<ValidatePolicyRequest>(
  "ValidatePolicyRequest",
)(
  {
    locale: S.optional(S.String),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    policyDocument: S.String,
    policyType: S.String,
    validatePolicyResourceType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/policy/validation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const ActionsList = S.Array(S.String);
export const ResourcesList = S.Array(S.String);
export class Access extends S.Class<Access>("Access")({
  actions: S.optional(ActionsList),
  resources: S.optional(ResourcesList),
}) {}
export const AccessList = S.Array(Access);
export class PolicyGenerationDetails extends S.Class<PolicyGenerationDetails>(
  "PolicyGenerationDetails",
)({ principalArn: S.String }) {}
export const TagsMap = S.Record({ key: S.String, value: S.String });
export const RegionList = S.Array(S.String);
export class CheckAccessNotGrantedRequest extends S.Class<CheckAccessNotGrantedRequest>(
  "CheckAccessNotGrantedRequest",
)(
  { policyDocument: S.String, access: AccessList, policyType: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/policy/check-access-not-granted" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ReasonSummary extends S.Class<ReasonSummary>("ReasonSummary")({
  description: S.optional(S.String),
  statementIndex: S.optional(S.Number),
  statementId: S.optional(S.String),
}) {}
export const ReasonSummaryList = S.Array(ReasonSummary);
export class CheckNoPublicAccessResponse extends S.Class<CheckNoPublicAccessResponse>(
  "CheckNoPublicAccessResponse",
)({
  result: S.optional(S.String),
  message: S.optional(S.String),
  reasons: S.optional(ReasonSummaryList),
}) {}
export class ListFindingsRequest extends S.Class<ListFindingsRequest>(
  "ListFindingsRequest",
)(
  {
    analyzerArn: S.String,
    filter: S.optional(FilterCriteriaMap),
    sort: S.optional(SortCriteria),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/finding" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: TagsMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export const ActionList = S.Array(S.String);
export const SharedViaList = S.Array(S.String);
export class Trail extends S.Class<Trail>("Trail")({
  cloudTrailArn: S.String,
  regions: S.optional(RegionList),
  allRegions: S.optional(S.Boolean),
}) {}
export const TrailList = S.Array(Trail);
export const EbsUserIdList = S.Array(S.String);
export const EbsGroupList = S.Array(S.String);
export class AnalyzedResource extends S.Class<AnalyzedResource>(
  "AnalyzedResource",
)({
  resourceArn: S.String,
  resourceType: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  analyzedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  isPublic: S.Boolean,
  actions: S.optional(ActionList),
  sharedVia: S.optional(SharedViaList),
  status: S.optional(S.String),
  resourceOwnerAccount: S.String,
  error: S.optional(S.String),
}) {}
export class RecommendationError extends S.Class<RecommendationError>(
  "RecommendationError",
)({ code: S.String, message: S.String }) {}
export class AccessPreviewStatusReason extends S.Class<AccessPreviewStatusReason>(
  "AccessPreviewStatusReason",
)({ code: S.String }) {}
export class AccessPreviewSummary extends S.Class<AccessPreviewSummary>(
  "AccessPreviewSummary",
)({
  id: S.String,
  analyzerArn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  statusReason: S.optional(AccessPreviewStatusReason),
}) {}
export const AccessPreviewsList = S.Array(AccessPreviewSummary);
export class AnalyzedResourceSummary extends S.Class<AnalyzedResourceSummary>(
  "AnalyzedResourceSummary",
)({
  resourceArn: S.String,
  resourceOwnerAccount: S.String,
  resourceType: S.String,
}) {}
export const AnalyzedResourcesList = S.Array(AnalyzedResourceSummary);
export class FindingSummaryV2 extends S.Class<FindingSummaryV2>(
  "FindingSummaryV2",
)({
  analyzedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  error: S.optional(S.String),
  id: S.String,
  resource: S.optional(S.String),
  resourceType: S.String,
  resourceOwnerAccount: S.String,
  status: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  findingType: S.optional(S.String),
}) {}
export const FindingsListV2 = S.Array(FindingSummaryV2);
export class PolicyGeneration extends S.Class<PolicyGeneration>(
  "PolicyGeneration",
)({
  jobId: S.String,
  principalArn: S.String,
  status: S.String,
  startedOn: S.Date.pipe(T.TimestampFormat("date-time")),
  completedOn: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const PolicyGenerationList = S.Array(PolicyGeneration);
export class CloudTrailDetails extends S.Class<CloudTrailDetails>(
  "CloudTrailDetails",
)({
  trails: TrailList,
  accessRole: S.String,
  startTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class EbsSnapshotConfiguration extends S.Class<EbsSnapshotConfiguration>(
  "EbsSnapshotConfiguration",
)({
  userIds: S.optional(EbsUserIdList),
  groups: S.optional(EbsGroupList),
  kmsKeyId: S.optional(S.String),
}) {}
export class EcrRepositoryConfiguration extends S.Class<EcrRepositoryConfiguration>(
  "EcrRepositoryConfiguration",
)({ repositoryPolicy: S.optional(S.String) }) {}
export class IamRoleConfiguration extends S.Class<IamRoleConfiguration>(
  "IamRoleConfiguration",
)({ trustPolicy: S.optional(S.String) }) {}
export class EfsFileSystemConfiguration extends S.Class<EfsFileSystemConfiguration>(
  "EfsFileSystemConfiguration",
)({ fileSystemPolicy: S.optional(S.String) }) {}
export class SecretsManagerSecretConfiguration extends S.Class<SecretsManagerSecretConfiguration>(
  "SecretsManagerSecretConfiguration",
)({ kmsKeyId: S.optional(S.String), secretPolicy: S.optional(S.String) }) {}
export class SnsTopicConfiguration extends S.Class<SnsTopicConfiguration>(
  "SnsTopicConfiguration",
)({ topicPolicy: S.optional(S.String) }) {}
export class SqsQueueConfiguration extends S.Class<SqsQueueConfiguration>(
  "SqsQueueConfiguration",
)({ queuePolicy: S.optional(S.String) }) {}
export class DynamodbStreamConfiguration extends S.Class<DynamodbStreamConfiguration>(
  "DynamodbStreamConfiguration",
)({ streamPolicy: S.optional(S.String) }) {}
export class DynamodbTableConfiguration extends S.Class<DynamodbTableConfiguration>(
  "DynamodbTableConfiguration",
)({ tablePolicy: S.optional(S.String) }) {}
export class CheckAccessNotGrantedResponse extends S.Class<CheckAccessNotGrantedResponse>(
  "CheckAccessNotGrantedResponse",
)({
  result: S.optional(S.String),
  message: S.optional(S.String),
  reasons: S.optional(ReasonSummaryList),
}) {}
export class CheckNoNewAccessResponse extends S.Class<CheckNoNewAccessResponse>(
  "CheckNoNewAccessResponse",
)({
  result: S.optional(S.String),
  message: S.optional(S.String),
  reasons: S.optional(ReasonSummaryList),
}) {}
export const KmsGrantOperationsList = S.Array(S.String);
export class GetAnalyzedResourceResponse extends S.Class<GetAnalyzedResourceResponse>(
  "GetAnalyzedResourceResponse",
)({ resource: S.optional(AnalyzedResource) }) {}
export class ListAccessPreviewFindingsRequest extends S.Class<ListAccessPreviewFindingsRequest>(
  "ListAccessPreviewFindingsRequest",
)(
  {
    accessPreviewId: S.String.pipe(T.HttpLabel()),
    analyzerArn: S.String,
    filter: S.optional(FilterCriteriaMap),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/access-preview/{accessPreviewId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAccessPreviewsResponse extends S.Class<ListAccessPreviewsResponse>(
  "ListAccessPreviewsResponse",
)({ accessPreviews: AccessPreviewsList, nextToken: S.optional(S.String) }) {}
export class ListAnalyzedResourcesResponse extends S.Class<ListAnalyzedResourcesResponse>(
  "ListAnalyzedResourcesResponse",
)({
  analyzedResources: AnalyzedResourcesList,
  nextToken: S.optional(S.String),
}) {}
export class ListFindingsV2Response extends S.Class<ListFindingsV2Response>(
  "ListFindingsV2Response",
)({ findings: FindingsListV2, nextToken: S.optional(S.String) }) {}
export class ListPolicyGenerationsResponse extends S.Class<ListPolicyGenerationsResponse>(
  "ListPolicyGenerationsResponse",
)({
  policyGenerations: PolicyGenerationList,
  nextToken: S.optional(S.String),
}) {}
export class StartPolicyGenerationRequest extends S.Class<StartPolicyGenerationRequest>(
  "StartPolicyGenerationRequest",
)(
  {
    policyGenerationDetails: PolicyGenerationDetails,
    cloudTrailDetails: S.optional(CloudTrailDetails),
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/policy/generation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const PrincipalMap = S.Record({ key: S.String, value: S.String });
export const ConditionKeyMap = S.Record({ key: S.String, value: S.String });
export class UnusedPermissionsRecommendedStep extends S.Class<UnusedPermissionsRecommendedStep>(
  "UnusedPermissionsRecommendedStep",
)({
  policyUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  recommendedAction: S.String,
  recommendedPolicy: S.optional(S.String),
  existingPolicyId: S.optional(S.String),
}) {}
export class FindingSourceDetail extends S.Class<FindingSourceDetail>(
  "FindingSourceDetail",
)({
  accessPointArn: S.optional(S.String),
  accessPointAccount: S.optional(S.String),
}) {}
export class FindingSource extends S.Class<FindingSource>("FindingSource")({
  type: S.String,
  detail: S.optional(FindingSourceDetail),
}) {}
export const FindingSourceList = S.Array(FindingSource);
export class InternalAccessDetails extends S.Class<InternalAccessDetails>(
  "InternalAccessDetails",
)({
  action: S.optional(ActionList),
  condition: S.optional(ConditionKeyMap),
  principal: S.optional(PrincipalMap),
  principalOwnerAccount: S.optional(S.String),
  accessType: S.optional(S.String),
  principalType: S.optional(S.String),
  sources: S.optional(FindingSourceList),
  resourceControlPolicyRestriction: S.optional(S.String),
  serviceControlPolicyRestriction: S.optional(S.String),
}) {}
export class ExternalAccessDetails extends S.Class<ExternalAccessDetails>(
  "ExternalAccessDetails",
)({
  action: S.optional(ActionList),
  condition: ConditionKeyMap,
  isPublic: S.optional(S.Boolean),
  principal: S.optional(PrincipalMap),
  sources: S.optional(FindingSourceList),
  resourceControlPolicyRestriction: S.optional(S.String),
}) {}
export class UnusedIamUserAccessKeyDetails extends S.Class<UnusedIamUserAccessKeyDetails>(
  "UnusedIamUserAccessKeyDetails",
)({
  accessKeyId: S.String,
  lastAccessed: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UnusedIamRoleDetails extends S.Class<UnusedIamRoleDetails>(
  "UnusedIamRoleDetails",
)({ lastAccessed: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))) }) {}
export class UnusedIamUserPasswordDetails extends S.Class<UnusedIamUserPasswordDetails>(
  "UnusedIamUserPasswordDetails",
)({ lastAccessed: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))) }) {}
export class JobError extends S.Class<JobError>("JobError")({
  code: S.String,
  message: S.String,
}) {}
export class GeneratedPolicy extends S.Class<GeneratedPolicy>(
  "GeneratedPolicy",
)({ policy: S.String }) {}
export const GeneratedPolicyList = S.Array(GeneratedPolicy);
export const KmsKeyPoliciesMap = S.Record({ key: S.String, value: S.String });
export class S3PublicAccessBlockConfiguration extends S.Class<S3PublicAccessBlockConfiguration>(
  "S3PublicAccessBlockConfiguration",
)({ ignorePublicAcls: S.Boolean, restrictPublicBuckets: S.Boolean }) {}
export const RdsDbClusterSnapshotAccountIdsList = S.Array(S.String);
export const RdsDbSnapshotAccountIdsList = S.Array(S.String);
export const KmsConstraintsMap = S.Record({ key: S.String, value: S.String });
export class KmsGrantConstraints extends S.Class<KmsGrantConstraints>(
  "KmsGrantConstraints",
)({
  encryptionContextEquals: S.optional(KmsConstraintsMap),
  encryptionContextSubset: S.optional(KmsConstraintsMap),
}) {}
export class KmsGrantConfiguration extends S.Class<KmsGrantConfiguration>(
  "KmsGrantConfiguration",
)({
  operations: KmsGrantOperationsList,
  granteePrincipal: S.String,
  retiringPrincipal: S.optional(S.String),
  constraints: S.optional(KmsGrantConstraints),
  issuingAccount: S.String,
}) {}
export const KmsGrantConfigurationsList = S.Array(KmsGrantConfiguration);
export class KmsKeyConfiguration extends S.Class<KmsKeyConfiguration>(
  "KmsKeyConfiguration",
)({
  keyPolicies: S.optional(KmsKeyPoliciesMap),
  grants: S.optional(KmsGrantConfigurationsList),
}) {}
export const RdsDbClusterSnapshotAttributeValue = S.Union(
  S.Struct({ accountIds: RdsDbClusterSnapshotAccountIdsList }),
);
export const RdsDbClusterSnapshotAttributesMap = S.Record({
  key: S.String,
  value: RdsDbClusterSnapshotAttributeValue,
});
export class RdsDbClusterSnapshotConfiguration extends S.Class<RdsDbClusterSnapshotConfiguration>(
  "RdsDbClusterSnapshotConfiguration",
)({
  attributes: S.optional(RdsDbClusterSnapshotAttributesMap),
  kmsKeyId: S.optional(S.String),
}) {}
export const RdsDbSnapshotAttributeValue = S.Union(
  S.Struct({ accountIds: RdsDbSnapshotAccountIdsList }),
);
export const RdsDbSnapshotAttributesMap = S.Record({
  key: S.String,
  value: RdsDbSnapshotAttributeValue,
});
export class RdsDbSnapshotConfiguration extends S.Class<RdsDbSnapshotConfiguration>(
  "RdsDbSnapshotConfiguration",
)({
  attributes: S.optional(RdsDbSnapshotAttributesMap),
  kmsKeyId: S.optional(S.String),
}) {}
export const AclGrantee = S.Union(
  S.Struct({ id: S.String }),
  S.Struct({ uri: S.String }),
);
export class S3BucketAclGrantConfiguration extends S.Class<S3BucketAclGrantConfiguration>(
  "S3BucketAclGrantConfiguration",
)({ permission: S.String, grantee: AclGrantee }) {}
export const S3BucketAclGrantConfigurationsList = S.Array(
  S3BucketAclGrantConfiguration,
);
export class VpcConfiguration extends S.Class<VpcConfiguration>(
  "VpcConfiguration",
)({ vpcId: S.String }) {}
export class InternetConfiguration extends S.Class<InternetConfiguration>(
  "InternetConfiguration",
)({}) {}
export const NetworkOriginConfiguration = S.Union(
  S.Struct({ vpcConfiguration: VpcConfiguration }),
  S.Struct({ internetConfiguration: InternetConfiguration }),
);
export class S3AccessPointConfiguration extends S.Class<S3AccessPointConfiguration>(
  "S3AccessPointConfiguration",
)({
  accessPointPolicy: S.optional(S.String),
  publicAccessBlock: S.optional(S3PublicAccessBlockConfiguration),
  networkOrigin: S.optional(NetworkOriginConfiguration),
}) {}
export const S3AccessPointConfigurationsMap = S.Record({
  key: S.String,
  value: S3AccessPointConfiguration,
});
export class S3BucketConfiguration extends S.Class<S3BucketConfiguration>(
  "S3BucketConfiguration",
)({
  bucketPolicy: S.optional(S.String),
  bucketAclGrants: S.optional(S3BucketAclGrantConfigurationsList),
  bucketPublicAccessBlock: S.optional(S3PublicAccessBlockConfiguration),
  accessPoints: S.optional(S3AccessPointConfigurationsMap),
}) {}
export class S3ExpressDirectoryAccessPointConfiguration extends S.Class<S3ExpressDirectoryAccessPointConfiguration>(
  "S3ExpressDirectoryAccessPointConfiguration",
)({
  accessPointPolicy: S.optional(S.String),
  networkOrigin: S.optional(NetworkOriginConfiguration),
}) {}
export const S3ExpressDirectoryAccessPointConfigurationsMap = S.Record({
  key: S.String,
  value: S3ExpressDirectoryAccessPointConfiguration,
});
export class S3ExpressDirectoryBucketConfiguration extends S.Class<S3ExpressDirectoryBucketConfiguration>(
  "S3ExpressDirectoryBucketConfiguration",
)({
  bucketPolicy: S.optional(S.String),
  accessPoints: S.optional(S3ExpressDirectoryAccessPointConfigurationsMap),
}) {}
export const Configuration = S.Union(
  S.Struct({ ebsSnapshot: EbsSnapshotConfiguration }),
  S.Struct({ ecrRepository: EcrRepositoryConfiguration }),
  S.Struct({ iamRole: IamRoleConfiguration }),
  S.Struct({ efsFileSystem: EfsFileSystemConfiguration }),
  S.Struct({ kmsKey: KmsKeyConfiguration }),
  S.Struct({ rdsDbClusterSnapshot: RdsDbClusterSnapshotConfiguration }),
  S.Struct({ rdsDbSnapshot: RdsDbSnapshotConfiguration }),
  S.Struct({ secretsManagerSecret: SecretsManagerSecretConfiguration }),
  S.Struct({ s3Bucket: S3BucketConfiguration }),
  S.Struct({ snsTopic: SnsTopicConfiguration }),
  S.Struct({ sqsQueue: SqsQueueConfiguration }),
  S.Struct({ s3ExpressDirectoryBucket: S3ExpressDirectoryBucketConfiguration }),
  S.Struct({ dynamodbStream: DynamodbStreamConfiguration }),
  S.Struct({ dynamodbTable: DynamodbTableConfiguration }),
);
export const ConfigurationsMap = S.Record({
  key: S.String,
  value: Configuration,
});
export class AccessPreview extends S.Class<AccessPreview>("AccessPreview")({
  id: S.String,
  analyzerArn: S.String,
  configurations: ConfigurationsMap,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  statusReason: S.optional(AccessPreviewStatusReason),
}) {}
export const RecommendedStep = S.Union(
  S.Struct({
    unusedPermissionsRecommendedStep: UnusedPermissionsRecommendedStep,
  }),
);
export const RecommendedStepList = S.Array(RecommendedStep);
export class JobDetails extends S.Class<JobDetails>("JobDetails")({
  jobId: S.String,
  status: S.String,
  startedOn: S.Date.pipe(T.TimestampFormat("date-time")),
  completedOn: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  jobError: S.optional(JobError),
}) {}
export class FindingSummary extends S.Class<FindingSummary>("FindingSummary")({
  id: S.String,
  principal: S.optional(PrincipalMap),
  action: S.optional(ActionList),
  resource: S.optional(S.String),
  isPublic: S.optional(S.Boolean),
  resourceType: S.String,
  condition: ConditionKeyMap,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  analyzedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  resourceOwnerAccount: S.String,
  error: S.optional(S.String),
  sources: S.optional(FindingSourceList),
  resourceControlPolicyRestriction: S.optional(S.String),
}) {}
export const FindingsList = S.Array(FindingSummary);
export class UnusedAccessTypeStatistics extends S.Class<UnusedAccessTypeStatistics>(
  "UnusedAccessTypeStatistics",
)({ unusedAccessType: S.optional(S.String), total: S.optional(S.Number) }) {}
export const UnusedAccessTypeStatisticsList = S.Array(
  UnusedAccessTypeStatistics,
);
export class UnusedAction extends S.Class<UnusedAction>("UnusedAction")({
  action: S.String,
  lastAccessed: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const UnusedActionList = S.Array(UnusedAction);
export class GetAccessPreviewResponse extends S.Class<GetAccessPreviewResponse>(
  "GetAccessPreviewResponse",
)({ accessPreview: AccessPreview }) {}
export class GetFindingRecommendationResponse extends S.Class<GetFindingRecommendationResponse>(
  "GetFindingRecommendationResponse",
)({
  startedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  completedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  nextToken: S.optional(S.String),
  error: S.optional(RecommendationError),
  resourceArn: S.String,
  recommendedSteps: S.optional(RecommendedStepList),
  recommendationType: S.String,
  status: S.String,
}) {}
export class ListFindingsResponse extends S.Class<ListFindingsResponse>(
  "ListFindingsResponse",
)({ findings: FindingsList, nextToken: S.optional(S.String) }) {}
export class StartPolicyGenerationResponse extends S.Class<StartPolicyGenerationResponse>(
  "StartPolicyGenerationResponse",
)({ jobId: S.String }) {}
export class UnusedPermissionDetails extends S.Class<UnusedPermissionDetails>(
  "UnusedPermissionDetails",
)({
  actions: S.optional(UnusedActionList),
  serviceNamespace: S.String,
  lastAccessed: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ResourceTypeDetails extends S.Class<ResourceTypeDetails>(
  "ResourceTypeDetails",
)({
  totalActivePublic: S.optional(S.Number),
  totalActiveCrossAccount: S.optional(S.Number),
  totalActiveErrors: S.optional(S.Number),
}) {}
export class InternalAccessResourceTypeDetails extends S.Class<InternalAccessResourceTypeDetails>(
  "InternalAccessResourceTypeDetails",
)({
  totalActiveFindings: S.optional(S.Number),
  totalResolvedFindings: S.optional(S.Number),
  totalArchivedFindings: S.optional(S.Number),
}) {}
export const FindingAggregationAccountDetailsMap = S.Record({
  key: S.String,
  value: S.Number,
});
export class TrailProperties extends S.Class<TrailProperties>(
  "TrailProperties",
)({
  cloudTrailArn: S.String,
  regions: S.optional(RegionList),
  allRegions: S.optional(S.Boolean),
}) {}
export const TrailPropertiesList = S.Array(TrailProperties);
export class Substring extends S.Class<Substring>("Substring")({
  start: S.Number,
  length: S.Number,
}) {}
export class Position extends S.Class<Position>("Position")({
  line: S.Number,
  column: S.Number,
  offset: S.Number,
}) {}
export class Finding extends S.Class<Finding>("Finding")({
  id: S.String,
  principal: S.optional(PrincipalMap),
  action: S.optional(ActionList),
  resource: S.optional(S.String),
  isPublic: S.optional(S.Boolean),
  resourceType: S.String,
  condition: ConditionKeyMap,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  analyzedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  resourceOwnerAccount: S.String,
  error: S.optional(S.String),
  sources: S.optional(FindingSourceList),
  resourceControlPolicyRestriction: S.optional(S.String),
}) {}
export const FindingDetails = S.Union(
  S.Struct({ internalAccessDetails: InternalAccessDetails }),
  S.Struct({ externalAccessDetails: ExternalAccessDetails }),
  S.Struct({ unusedPermissionDetails: UnusedPermissionDetails }),
  S.Struct({ unusedIamUserAccessKeyDetails: UnusedIamUserAccessKeyDetails }),
  S.Struct({ unusedIamRoleDetails: UnusedIamRoleDetails }),
  S.Struct({ unusedIamUserPasswordDetails: UnusedIamUserPasswordDetails }),
);
export const FindingDetailsList = S.Array(FindingDetails);
export class AccessPreviewFinding extends S.Class<AccessPreviewFinding>(
  "AccessPreviewFinding",
)({
  id: S.String,
  existingFindingId: S.optional(S.String),
  existingFindingStatus: S.optional(S.String),
  principal: S.optional(PrincipalMap),
  action: S.optional(ActionList),
  condition: S.optional(ConditionKeyMap),
  resource: S.optional(S.String),
  isPublic: S.optional(S.Boolean),
  resourceType: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  changeType: S.String,
  status: S.String,
  resourceOwnerAccount: S.String,
  error: S.optional(S.String),
  sources: S.optional(FindingSourceList),
  resourceControlPolicyRestriction: S.optional(S.String),
}) {}
export const AccessPreviewFindingsList = S.Array(AccessPreviewFinding);
export const ResourceTypeStatisticsMap = S.Record({
  key: S.String,
  value: ResourceTypeDetails,
});
export const InternalAccessResourceTypeStatisticsMap = S.Record({
  key: S.String,
  value: InternalAccessResourceTypeDetails,
});
export class FindingAggregationAccountDetails extends S.Class<FindingAggregationAccountDetails>(
  "FindingAggregationAccountDetails",
)({
  account: S.optional(S.String),
  numberOfActiveFindings: S.optional(S.Number),
  details: S.optional(FindingAggregationAccountDetailsMap),
}) {}
export const AccountAggregations = S.Array(FindingAggregationAccountDetails);
export class CloudTrailProperties extends S.Class<CloudTrailProperties>(
  "CloudTrailProperties",
)({
  trailProperties: TrailPropertiesList,
  startTime: S.Date.pipe(T.TimestampFormat("date-time")),
  endTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export const PathElement = S.Union(
  S.Struct({ index: S.Number }),
  S.Struct({ key: S.String }),
  S.Struct({ substring: Substring }),
  S.Struct({ value: S.String }),
);
export const PathElementList = S.Array(PathElement);
export class Span extends S.Class<Span>("Span")({
  start: Position,
  end: Position,
}) {}
export class GetFindingResponse extends S.Class<GetFindingResponse>(
  "GetFindingResponse",
)({ finding: S.optional(Finding) }) {}
export class GetFindingV2Response extends S.Class<GetFindingV2Response>(
  "GetFindingV2Response",
)({
  analyzedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  error: S.optional(S.String),
  id: S.String,
  nextToken: S.optional(S.String),
  resource: S.optional(S.String),
  resourceType: S.String,
  resourceOwnerAccount: S.String,
  status: S.String,
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  findingDetails: FindingDetailsList,
  findingType: S.optional(S.String),
}) {}
export class ListAccessPreviewFindingsResponse extends S.Class<ListAccessPreviewFindingsResponse>(
  "ListAccessPreviewFindingsResponse",
)({ findings: AccessPreviewFindingsList, nextToken: S.optional(S.String) }) {}
export class ExternalAccessFindingsStatistics extends S.Class<ExternalAccessFindingsStatistics>(
  "ExternalAccessFindingsStatistics",
)({
  resourceTypeStatistics: S.optional(ResourceTypeStatisticsMap),
  totalActiveFindings: S.optional(S.Number),
  totalArchivedFindings: S.optional(S.Number),
  totalResolvedFindings: S.optional(S.Number),
}) {}
export class InternalAccessFindingsStatistics extends S.Class<InternalAccessFindingsStatistics>(
  "InternalAccessFindingsStatistics",
)({
  resourceTypeStatistics: S.optional(InternalAccessResourceTypeStatisticsMap),
  totalActiveFindings: S.optional(S.Number),
  totalArchivedFindings: S.optional(S.Number),
  totalResolvedFindings: S.optional(S.Number),
}) {}
export class UnusedAccessFindingsStatistics extends S.Class<UnusedAccessFindingsStatistics>(
  "UnusedAccessFindingsStatistics",
)({
  unusedAccessTypeStatistics: S.optional(UnusedAccessTypeStatisticsList),
  topAccounts: S.optional(AccountAggregations),
  totalActiveFindings: S.optional(S.Number),
  totalArchivedFindings: S.optional(S.Number),
  totalResolvedFindings: S.optional(S.Number),
}) {}
export class GeneratedPolicyProperties extends S.Class<GeneratedPolicyProperties>(
  "GeneratedPolicyProperties",
)({
  isComplete: S.optional(S.Boolean),
  principalArn: S.String,
  cloudTrailProperties: S.optional(CloudTrailProperties),
}) {}
export class Location extends S.Class<Location>("Location")({
  path: PathElementList,
  span: Span,
}) {}
export const LocationList = S.Array(Location);
export const FindingsStatistics = S.Union(
  S.Struct({
    externalAccessFindingsStatistics: ExternalAccessFindingsStatistics,
  }),
  S.Struct({
    internalAccessFindingsStatistics: InternalAccessFindingsStatistics,
  }),
  S.Struct({ unusedAccessFindingsStatistics: UnusedAccessFindingsStatistics }),
);
export const FindingsStatisticsList = S.Array(FindingsStatistics);
export class GeneratedPolicyResult extends S.Class<GeneratedPolicyResult>(
  "GeneratedPolicyResult",
)({
  properties: GeneratedPolicyProperties,
  generatedPolicies: S.optional(GeneratedPolicyList),
}) {}
export class ValidatePolicyFinding extends S.Class<ValidatePolicyFinding>(
  "ValidatePolicyFinding",
)({
  findingDetails: S.String,
  findingType: S.String,
  issueCode: S.String,
  learnMoreLink: S.String,
  locations: LocationList,
}) {}
export const ValidatePolicyFindingList = S.Array(ValidatePolicyFinding);
export class GetFindingsStatisticsResponse extends S.Class<GetFindingsStatisticsResponse>(
  "GetFindingsStatisticsResponse",
)({
  findingsStatistics: S.optional(FindingsStatisticsList),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetGeneratedPolicyResponse extends S.Class<GetGeneratedPolicyResponse>(
  "GetGeneratedPolicyResponse",
)({ jobDetails: JobDetails, generatedPolicyResult: GeneratedPolicyResult }) {}
export class ValidatePolicyResponse extends S.Class<ValidatePolicyResponse>(
  "ValidatePolicyResponse",
)({ findings: ValidatePolicyFindingList, nextToken: S.optional(S.String) }) {}
export class CreateAccessPreviewRequest extends S.Class<CreateAccessPreviewRequest>(
  "CreateAccessPreviewRequest",
)(
  {
    analyzerArn: S.String,
    configurations: ConfigurationsMap,
    clientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/access-preview" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateAccessPreviewResponse extends S.Class<CreateAccessPreviewResponse>(
  "CreateAccessPreviewResponse",
)({ id: S.String }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {},
) {}
export class UnprocessableEntityException extends S.TaggedError<UnprocessableEntityException>()(
  "UnprocessableEntityException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}

//# Operations
/**
 * Updates the status for the specified findings.
 */
export const updateFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateFindingsRequest,
  output: UpdateFindingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retroactively applies the archive rule to existing findings that meet the archive rule criteria.
 */
export const applyArchiveRule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ApplyArchiveRuleRequest,
  output: ApplyArchiveRuleResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels the requested policy generation.
 */
export const cancelPolicyGeneration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelPolicyGenerationRequest,
    output: CancelPolicyGenerationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a recommendation for an unused permissions finding.
 */
export const generateFindingRecommendation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GenerateFindingRecommendationRequest,
    output: GenerateFindingRecommendationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves a list of tags applied to the specified resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Immediately starts a scan of the policies applied to the specified resource.
 *
 * This action is supported only for external access analyzers.
 */
export const startResourceScan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartResourceScanRequest,
  output: StartResourceScanResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds a tag to the specified resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Checks whether new access is allowed for an updated policy when compared to the existing policy.
 *
 * You can find examples for reference policies and learn how to set up and run a custom policy check for new access in the IAM Access Analyzer custom policy checks samples repository on GitHub. The reference policies in this repository are meant to be passed to the `existingPolicyDocument` request parameter.
 */
export const checkNoNewAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckNoNewAccessRequest,
  output: CheckNoNewAccessResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterException,
    ThrottlingException,
    UnprocessableEntityException,
    ValidationException,
  ],
}));
/**
 * Checks whether a resource policy can grant public access to the specified resource type.
 */
export const checkNoPublicAccess = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckNoPublicAccessRequest,
  output: CheckNoPublicAccessResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterException,
    ThrottlingException,
    UnprocessableEntityException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a resource that was analyzed.
 *
 * This action is supported only for external access analyzers.
 */
export const getAnalyzedResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAnalyzedResourceRequest,
  output: GetAnalyzedResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of access previews for the specified analyzer.
 */
export const listAccessPreviews = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAccessPreviewsRequest,
  output: ListAccessPreviewsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of resources of the specified type that have been analyzed by the specified analyzer.
 */
export const listAnalyzedResources = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAnalyzedResourcesRequest,
    output: ListAnalyzedResourcesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a list of findings generated by the specified analyzer. ListFindings and ListFindingsV2 both use `access-analyzer:ListFindings` in the `Action` element of an IAM policy statement. You must have permission to perform the `access-analyzer:ListFindings` action.
 *
 * To learn about filter keys that you can use to retrieve a list of findings, see IAM Access Analyzer filter keys in the **IAM User Guide**.
 */
export const listFindingsV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFindingsV2Request,
  output: ListFindingsV2Response,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all of the policy generations requested in the last seven days.
 */
export const listPolicyGenerations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListPolicyGenerationsRequest,
    output: ListPolicyGenerationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Removes a tag from the specified resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Checks whether the specified access isn't allowed by a policy.
 */
export const checkAccessNotGranted = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CheckAccessNotGrantedRequest,
    output: CheckAccessNotGrantedResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidParameterException,
      ThrottlingException,
      UnprocessableEntityException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves information about an access preview for the specified analyzer.
 */
export const getAccessPreview = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccessPreviewRequest,
  output: GetAccessPreviewResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about a finding recommendation for the specified analyzer.
 */
export const getFindingRecommendation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFindingRecommendationRequest,
    output: GetFindingRecommendationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a list of findings generated by the specified analyzer. ListFindings and ListFindingsV2 both use `access-analyzer:ListFindings` in the `Action` element of an IAM policy statement. You must have permission to perform the `access-analyzer:ListFindings` action.
 *
 * To learn about filter keys that you can use to retrieve a list of findings, see IAM Access Analyzer filter keys in the **IAM User Guide**.
 *
 * ListFindings is supported only for external access analyzers. You must use ListFindingsV2 for internal and unused access analyzers.
 */
export const listFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListFindingsRequest,
  output: ListFindingsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified finding. GetFinding and GetFindingV2 both use `access-analyzer:GetFinding` in the `Action` element of an IAM policy statement. You must have permission to perform the `access-analyzer:GetFinding` action.
 *
 * GetFinding is supported only for external access analyzers. You must use GetFindingV2 for internal and unused access analyzers.
 */
export const getFinding = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingRequest,
  output: GetFindingResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves information about the specified finding. GetFinding and GetFindingV2 both use `access-analyzer:GetFinding` in the `Action` element of an IAM policy statement. You must have permission to perform the `access-analyzer:GetFinding` action.
 */
export const getFindingV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetFindingV2Request,
  output: GetFindingV2Response,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of access preview findings generated by the specified access preview.
 */
export const listAccessPreviewFindings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAccessPreviewFindingsRequest,
    output: ListAccessPreviewFindingsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a list of aggregated finding statistics for an external access or unused access analyzer.
 */
export const getFindingsStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetFindingsStatisticsRequest,
    output: GetFindingsStatisticsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves the policy that was generated using `StartPolicyGeneration`.
 */
export const getGeneratedPolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetGeneratedPolicyRequest,
  output: GetGeneratedPolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts the policy generation request.
 */
export const startPolicyGeneration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartPolicyGenerationRequest,
    output: StartPolicyGenerationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Requests the validation of a policy and returns a list of findings. The findings help you identify issues and provide actionable recommendations to resolve the issue and enable you to author functional policies that meet security best practices.
 */
export const validatePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ValidatePolicyRequest,
  output: ValidatePolicyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an access preview that allows you to preview IAM Access Analyzer findings for your resource before deploying resource permissions.
 */
export const createAccessPreview = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAccessPreviewRequest,
  output: CreateAccessPreviewResponse,
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
