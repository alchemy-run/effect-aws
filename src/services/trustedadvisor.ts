import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "TrustedAdvisor",
  serviceShapeName: "TrustedAdvisor",
});
const auth = T.AwsAuthSigv4({ name: "trustedadvisor" });
const ver = T.ServiceVersion("2022-09-15");
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://trustedadvisor-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://trustedadvisor-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://trustedadvisor.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://trustedadvisor.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetOrganizationRecommendationRequest extends S.Class<GetOrganizationRecommendationRequest>(
  "GetOrganizationRecommendationRequest",
)(
  {
    organizationRecommendationIdentifier: S.String.pipe(
      T.HttpLabel("organizationRecommendationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/organization-recommendations/{organizationRecommendationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetRecommendationRequest extends S.Class<GetRecommendationRequest>(
  "GetRecommendationRequest",
)(
  {
    recommendationIdentifier: S.String.pipe(
      T.HttpLabel("recommendationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/recommendations/{recommendationIdentifier}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListChecksRequest extends S.Class<ListChecksRequest>(
  "ListChecksRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    pillar: S.optional(S.String).pipe(T.HttpQuery("pillar")),
    awsService: S.optional(S.String).pipe(T.HttpQuery("awsService")),
    source: S.optional(S.String).pipe(T.HttpQuery("source")),
    language: S.optional(S.String).pipe(T.HttpQuery("language")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/checks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOrganizationRecommendationAccountsRequest extends S.Class<ListOrganizationRecommendationAccountsRequest>(
  "ListOrganizationRecommendationAccountsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    organizationRecommendationIdentifier: S.String.pipe(
      T.HttpLabel("organizationRecommendationIdentifier"),
    ),
    affectedAccountId: S.optional(S.String).pipe(
      T.HttpQuery("affectedAccountId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/organization-recommendations/{organizationRecommendationIdentifier}/accounts",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOrganizationRecommendationResourcesRequest extends S.Class<ListOrganizationRecommendationResourcesRequest>(
  "ListOrganizationRecommendationResourcesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    exclusionStatus: S.optional(S.String).pipe(T.HttpQuery("exclusionStatus")),
    regionCode: S.optional(S.String).pipe(T.HttpQuery("regionCode")),
    organizationRecommendationIdentifier: S.String.pipe(
      T.HttpLabel("organizationRecommendationIdentifier"),
    ),
    affectedAccountId: S.optional(S.String).pipe(
      T.HttpQuery("affectedAccountId"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/organization-recommendations/{organizationRecommendationIdentifier}/resources",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListOrganizationRecommendationsRequest extends S.Class<ListOrganizationRecommendationsRequest>(
  "ListOrganizationRecommendationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    pillar: S.optional(S.String).pipe(T.HttpQuery("pillar")),
    awsService: S.optional(S.String).pipe(T.HttpQuery("awsService")),
    source: S.optional(S.String).pipe(T.HttpQuery("source")),
    checkIdentifier: S.optional(S.String).pipe(T.HttpQuery("checkIdentifier")),
    afterLastUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("afterLastUpdatedAt")),
    beforeLastUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("beforeLastUpdatedAt")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/organization-recommendations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecommendationResourcesRequest extends S.Class<ListRecommendationResourcesRequest>(
  "ListRecommendationResourcesRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    exclusionStatus: S.optional(S.String).pipe(T.HttpQuery("exclusionStatus")),
    regionCode: S.optional(S.String).pipe(T.HttpQuery("regionCode")),
    recommendationIdentifier: S.String.pipe(
      T.HttpLabel("recommendationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/v1/recommendations/{recommendationIdentifier}/resources",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListRecommendationsRequest extends S.Class<ListRecommendationsRequest>(
  "ListRecommendationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    pillar: S.optional(S.String).pipe(T.HttpQuery("pillar")),
    awsService: S.optional(S.String).pipe(T.HttpQuery("awsService")),
    source: S.optional(S.String).pipe(T.HttpQuery("source")),
    checkIdentifier: S.optional(S.String).pipe(T.HttpQuery("checkIdentifier")),
    afterLastUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("afterLastUpdatedAt")),
    beforeLastUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("beforeLastUpdatedAt")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/v1/recommendations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateOrganizationRecommendationLifecycleRequest extends S.Class<UpdateOrganizationRecommendationLifecycleRequest>(
  "UpdateOrganizationRecommendationLifecycleRequest",
)(
  {
    lifecycleStage: S.String,
    updateReason: S.optional(S.String),
    updateReasonCode: S.optional(S.String),
    organizationRecommendationIdentifier: S.String.pipe(
      T.HttpLabel("organizationRecommendationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/organization-recommendations/{organizationRecommendationIdentifier}/lifecycle",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateOrganizationRecommendationLifecycleResponse extends S.Class<UpdateOrganizationRecommendationLifecycleResponse>(
  "UpdateOrganizationRecommendationLifecycleResponse",
)({}) {}
export class UpdateRecommendationLifecycleRequest extends S.Class<UpdateRecommendationLifecycleRequest>(
  "UpdateRecommendationLifecycleRequest",
)(
  {
    lifecycleStage: S.String,
    updateReason: S.optional(S.String),
    updateReasonCode: S.optional(S.String),
    recommendationIdentifier: S.String.pipe(
      T.HttpLabel("recommendationIdentifier"),
    ),
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/recommendations/{recommendationIdentifier}/lifecycle",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateRecommendationLifecycleResponse extends S.Class<UpdateRecommendationLifecycleResponse>(
  "UpdateRecommendationLifecycleResponse",
)({}) {}
export class RecommendationResourceExclusion extends S.Class<RecommendationResourceExclusion>(
  "RecommendationResourceExclusion",
)({ arn: S.String, isExcluded: S.Boolean }) {}
export const RecommendationResourceExclusionList = S.Array(
  RecommendationResourceExclusion,
);
export class BatchUpdateRecommendationResourceExclusionRequest extends S.Class<BatchUpdateRecommendationResourceExclusionRequest>(
  "BatchUpdateRecommendationResourceExclusionRequest",
)(
  { recommendationResourceExclusions: RecommendationResourceExclusionList },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/v1/batch-update-recommendation-resource-exclusion",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const RecommendationPillarList = S.Array(S.String);
export const RecommendationAwsServiceList = S.Array(S.String);
export class RecommendationResourcesAggregates extends S.Class<RecommendationResourcesAggregates>(
  "RecommendationResourcesAggregates",
)({ okCount: S.Number, warningCount: S.Number, errorCount: S.Number }) {}
export class RecommendationCostOptimizingAggregates extends S.Class<RecommendationCostOptimizingAggregates>(
  "RecommendationCostOptimizingAggregates",
)({
  estimatedMonthlySavings: S.Number,
  estimatedPercentMonthlySavings: S.Number,
}) {}
export class RecommendationPillarSpecificAggregates extends S.Class<RecommendationPillarSpecificAggregates>(
  "RecommendationPillarSpecificAggregates",
)({ costOptimizing: S.optional(RecommendationCostOptimizingAggregates) }) {}
export class Recommendation extends S.Class<Recommendation>("Recommendation")({
  id: S.String,
  type: S.String,
  checkArn: S.optional(S.String),
  status: S.String,
  lifecycleStage: S.optional(S.String),
  pillars: RecommendationPillarList,
  source: S.String,
  awsServices: S.optional(RecommendationAwsServiceList),
  name: S.String,
  resourcesAggregates: RecommendationResourcesAggregates,
  pillarSpecificAggregates: S.optional(RecommendationPillarSpecificAggregates),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  arn: S.String,
  description: S.String,
  createdBy: S.optional(S.String),
  updatedOnBehalfOf: S.optional(S.String),
  updatedOnBehalfOfJobTitle: S.optional(S.String),
  updateReason: S.optional(S.String),
  updateReasonCode: S.optional(S.String),
  resolvedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class AccountRecommendationLifecycleSummary extends S.Class<AccountRecommendationLifecycleSummary>(
  "AccountRecommendationLifecycleSummary",
)({
  accountId: S.optional(S.String),
  accountRecommendationArn: S.optional(S.String),
  lifecycleStage: S.optional(S.String),
  updatedOnBehalfOf: S.optional(S.String),
  updatedOnBehalfOfJobTitle: S.optional(S.String),
  updateReason: S.optional(S.String),
  updateReasonCode: S.optional(S.String),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const AccountRecommendationLifecycleSummaryList = S.Array(
  AccountRecommendationLifecycleSummary,
);
export const StringMap = S.Record({ key: S.String, value: S.String });
export class OrganizationRecommendationResourceSummary extends S.Class<OrganizationRecommendationResourceSummary>(
  "OrganizationRecommendationResourceSummary",
)({
  id: S.String,
  arn: S.String,
  awsResourceId: S.String,
  regionCode: S.String,
  status: S.String,
  metadata: StringMap,
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  exclusionStatus: S.optional(S.String),
  accountId: S.optional(S.String),
  recommendationArn: S.String,
}) {}
export const OrganizationRecommendationResourceSummaryList = S.Array(
  OrganizationRecommendationResourceSummary,
);
export class OrganizationRecommendationSummary extends S.Class<OrganizationRecommendationSummary>(
  "OrganizationRecommendationSummary",
)({
  id: S.String,
  type: S.String,
  checkArn: S.optional(S.String),
  status: S.String,
  lifecycleStage: S.optional(S.String),
  pillars: RecommendationPillarList,
  source: S.String,
  awsServices: S.optional(RecommendationAwsServiceList),
  name: S.String,
  resourcesAggregates: RecommendationResourcesAggregates,
  pillarSpecificAggregates: S.optional(RecommendationPillarSpecificAggregates),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  arn: S.String,
}) {}
export const OrganizationRecommendationSummaryList = S.Array(
  OrganizationRecommendationSummary,
);
export class RecommendationResourceSummary extends S.Class<RecommendationResourceSummary>(
  "RecommendationResourceSummary",
)({
  id: S.String,
  arn: S.String,
  awsResourceId: S.String,
  regionCode: S.String,
  status: S.String,
  metadata: StringMap,
  lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  exclusionStatus: S.optional(S.String),
  recommendationArn: S.String,
}) {}
export const RecommendationResourceSummaryList = S.Array(
  RecommendationResourceSummary,
);
export class RecommendationSummary extends S.Class<RecommendationSummary>(
  "RecommendationSummary",
)({
  id: S.String,
  type: S.String,
  checkArn: S.optional(S.String),
  status: S.String,
  lifecycleStage: S.optional(S.String),
  pillars: RecommendationPillarList,
  source: S.String,
  awsServices: S.optional(RecommendationAwsServiceList),
  name: S.String,
  resourcesAggregates: RecommendationResourcesAggregates,
  pillarSpecificAggregates: S.optional(RecommendationPillarSpecificAggregates),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  arn: S.String,
}) {}
export const RecommendationSummaryList = S.Array(RecommendationSummary);
export class GetRecommendationResponse extends S.Class<GetRecommendationResponse>(
  "GetRecommendationResponse",
)({ recommendation: S.optional(Recommendation) }) {}
export class ListOrganizationRecommendationAccountsResponse extends S.Class<ListOrganizationRecommendationAccountsResponse>(
  "ListOrganizationRecommendationAccountsResponse",
)({
  nextToken: S.optional(S.String),
  accountRecommendationLifecycleSummaries:
    AccountRecommendationLifecycleSummaryList,
}) {}
export class ListOrganizationRecommendationResourcesResponse extends S.Class<ListOrganizationRecommendationResourcesResponse>(
  "ListOrganizationRecommendationResourcesResponse",
)({
  nextToken: S.optional(S.String),
  organizationRecommendationResourceSummaries:
    OrganizationRecommendationResourceSummaryList,
}) {}
export class ListOrganizationRecommendationsResponse extends S.Class<ListOrganizationRecommendationsResponse>(
  "ListOrganizationRecommendationsResponse",
)({
  nextToken: S.optional(S.String),
  organizationRecommendationSummaries: OrganizationRecommendationSummaryList,
}) {}
export class ListRecommendationResourcesResponse extends S.Class<ListRecommendationResourcesResponse>(
  "ListRecommendationResourcesResponse",
)({
  nextToken: S.optional(S.String),
  recommendationResourceSummaries: RecommendationResourceSummaryList,
}) {}
export class ListRecommendationsResponse extends S.Class<ListRecommendationsResponse>(
  "ListRecommendationsResponse",
)({
  nextToken: S.optional(S.String),
  recommendationSummaries: RecommendationSummaryList,
}) {}
export class UpdateRecommendationResourceExclusionError extends S.Class<UpdateRecommendationResourceExclusionError>(
  "UpdateRecommendationResourceExclusionError",
)({
  arn: S.optional(S.String),
  errorCode: S.optional(S.String),
  errorMessage: S.optional(S.String),
}) {}
export const UpdateRecommendationResourceExclusionErrorList = S.Array(
  UpdateRecommendationResourceExclusionError,
);
export class CheckSummary extends S.Class<CheckSummary>("CheckSummary")({
  id: S.String,
  arn: S.String,
  name: S.String,
  description: S.String,
  pillars: RecommendationPillarList,
  awsServices: RecommendationAwsServiceList,
  source: S.String,
  metadata: StringMap,
}) {}
export const CheckSummaryList = S.Array(CheckSummary);
export class BatchUpdateRecommendationResourceExclusionResponse extends S.Class<BatchUpdateRecommendationResourceExclusionResponse>(
  "BatchUpdateRecommendationResourceExclusionResponse",
)({
  batchUpdateRecommendationResourceExclusionErrors:
    UpdateRecommendationResourceExclusionErrorList,
}) {}
export class ListChecksResponse extends S.Class<ListChecksResponse>(
  "ListChecksResponse",
)({ nextToken: S.optional(S.String), checkSummaries: CheckSummaryList }) {}
export class OrganizationRecommendation extends S.Class<OrganizationRecommendation>(
  "OrganizationRecommendation",
)({
  id: S.String,
  type: S.String,
  checkArn: S.optional(S.String),
  status: S.String,
  lifecycleStage: S.optional(S.String),
  pillars: RecommendationPillarList,
  source: S.String,
  awsServices: S.optional(RecommendationAwsServiceList),
  name: S.String,
  resourcesAggregates: RecommendationResourcesAggregates,
  pillarSpecificAggregates: S.optional(RecommendationPillarSpecificAggregates),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  arn: S.String,
  description: S.String,
  createdBy: S.optional(S.String),
  updatedOnBehalfOf: S.optional(S.String),
  updatedOnBehalfOfJobTitle: S.optional(S.String),
  updateReason: S.optional(S.String),
  updateReasonCode: S.optional(S.String),
  resolvedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class GetOrganizationRecommendationResponse extends S.Class<GetOrganizationRecommendationResponse>(
  "GetOrganizationRecommendationResponse",
)({ organizationRecommendation: S.optional(OrganizationRecommendation) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}

//# Operations
/**
 * List a filterable set of Checks
 */
export const listChecks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListChecksRequest,
  output: ListChecksResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "checkSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists the accounts that own the resources for an organization aggregate recommendation. This API only
 * supports prioritized recommendations.
 */
export const listOrganizationRecommendationAccounts =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListOrganizationRecommendationAccountsRequest,
    output: ListOrganizationRecommendationAccountsResponse,
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
      items: "accountRecommendationLifecycleSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List Resources of a Recommendation within an Organization. This API only supports prioritized
 * recommendations.
 */
export const listOrganizationRecommendationResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListOrganizationRecommendationResourcesRequest,
    output: ListOrganizationRecommendationResourcesResponse,
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
      items: "organizationRecommendationResourceSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List Resources of a Recommendation
 */
export const listRecommendationResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRecommendationResourcesRequest,
    output: ListRecommendationResourcesResponse,
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
      items: "recommendationResourceSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Update the lifecycle of a Recommendation within an Organization. This API only supports prioritized
 * recommendations.
 */
export const updateOrganizationRecommendationLifecycle =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateOrganizationRecommendationLifecycleRequest,
    output: UpdateOrganizationRecommendationLifecycleResponse,
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
 * Update the lifecyle of a Recommendation. This API only supports prioritized recommendations.
 */
export const updateRecommendationLifecycle =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateRecommendationLifecycleRequest,
    output: UpdateRecommendationLifecycleResponse,
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
 * Get a specific recommendation within an AWS Organizations organization. This API supports only prioritized
 * recommendations.
 */
export const getOrganizationRecommendation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetOrganizationRecommendationRequest,
    output: GetOrganizationRecommendationResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * List a filterable set of Recommendations within an Organization. This API only supports prioritized
 * recommendations.
 */
export const listOrganizationRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListOrganizationRecommendationsRequest,
    output: ListOrganizationRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "organizationRecommendationSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * List a filterable set of Recommendations
 */
export const listRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListRecommendationsRequest,
    output: ListRecommendationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "recommendationSummaries",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Update one or more exclusion status for a list of recommendation resources
 */
export const batchUpdateRecommendationResourceExclusion =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchUpdateRecommendationResourceExclusionRequest,
    output: BatchUpdateRecommendationResourceExclusionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Get a specific Recommendation
 */
export const getRecommendation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRecommendationRequest,
  output: GetRecommendationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
