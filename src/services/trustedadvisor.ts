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

//# Newtypes
export type OrganizationRecommendationIdentifier = string;
export type AccountRecommendationIdentifier = string;
export type RecommendationAwsService = string;
export type AccountId = string;
export type CheckIdentifier = string;
export type RecommendationUpdateReason = string | Redacted.Redacted<string>;
export type RecommendationResourceArn = string;
export type OrganizationRecommendationArn = string;
export type AccountRecommendationArn = string;
export type CheckArn = string;
export type RecommendationRegionCode = string;

//# Schemas
export interface GetOrganizationRecommendationRequest {
  organizationRecommendationIdentifier: string;
}
export const GetOrganizationRecommendationRequest = S.suspend(() =>
  S.Struct({
    organizationRecommendationIdentifier: S.String.pipe(
      T.HttpLabel("organizationRecommendationIdentifier"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetOrganizationRecommendationRequest",
}) as any as S.Schema<GetOrganizationRecommendationRequest>;
export interface GetRecommendationRequest {
  recommendationIdentifier: string;
}
export const GetRecommendationRequest = S.suspend(() =>
  S.Struct({
    recommendationIdentifier: S.String.pipe(
      T.HttpLabel("recommendationIdentifier"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetRecommendationRequest",
}) as any as S.Schema<GetRecommendationRequest>;
export interface ListChecksRequest {
  nextToken?: string;
  maxResults?: number;
  pillar?: string;
  awsService?: string;
  source?: string;
  language?: string;
}
export const ListChecksRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    pillar: S.optional(S.String).pipe(T.HttpQuery("pillar")),
    awsService: S.optional(S.String).pipe(T.HttpQuery("awsService")),
    source: S.optional(S.String).pipe(T.HttpQuery("source")),
    language: S.optional(S.String).pipe(T.HttpQuery("language")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/checks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListChecksRequest",
}) as any as S.Schema<ListChecksRequest>;
export interface ListOrganizationRecommendationAccountsRequest {
  nextToken?: string;
  maxResults?: number;
  organizationRecommendationIdentifier: string;
  affectedAccountId?: string;
}
export const ListOrganizationRecommendationAccountsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    organizationRecommendationIdentifier: S.String.pipe(
      T.HttpLabel("organizationRecommendationIdentifier"),
    ),
    affectedAccountId: S.optional(S.String).pipe(
      T.HttpQuery("affectedAccountId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListOrganizationRecommendationAccountsRequest",
}) as any as S.Schema<ListOrganizationRecommendationAccountsRequest>;
export interface ListOrganizationRecommendationResourcesRequest {
  nextToken?: string;
  maxResults?: number;
  status?: string;
  exclusionStatus?: string;
  regionCode?: string;
  organizationRecommendationIdentifier: string;
  affectedAccountId?: string;
}
export const ListOrganizationRecommendationResourcesRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
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
  ),
).annotations({
  identifier: "ListOrganizationRecommendationResourcesRequest",
}) as any as S.Schema<ListOrganizationRecommendationResourcesRequest>;
export interface ListOrganizationRecommendationsRequest {
  nextToken?: string;
  maxResults?: number;
  type?: string;
  status?: string;
  pillar?: string;
  awsService?: string;
  source?: string;
  checkIdentifier?: string;
  afterLastUpdatedAt?: Date;
  beforeLastUpdatedAt?: Date;
}
export const ListOrganizationRecommendationsRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/organization-recommendations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOrganizationRecommendationsRequest",
}) as any as S.Schema<ListOrganizationRecommendationsRequest>;
export interface ListRecommendationResourcesRequest {
  nextToken?: string;
  maxResults?: number;
  status?: string;
  exclusionStatus?: string;
  regionCode?: string;
  recommendationIdentifier: string;
}
export const ListRecommendationResourcesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(S.String).pipe(T.HttpQuery("status")),
    exclusionStatus: S.optional(S.String).pipe(T.HttpQuery("exclusionStatus")),
    regionCode: S.optional(S.String).pipe(T.HttpQuery("regionCode")),
    recommendationIdentifier: S.String.pipe(
      T.HttpLabel("recommendationIdentifier"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListRecommendationResourcesRequest",
}) as any as S.Schema<ListRecommendationResourcesRequest>;
export interface ListRecommendationsRequest {
  nextToken?: string;
  maxResults?: number;
  type?: string;
  status?: string;
  pillar?: string;
  awsService?: string;
  source?: string;
  checkIdentifier?: string;
  afterLastUpdatedAt?: Date;
  beforeLastUpdatedAt?: Date;
}
export const ListRecommendationsRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/v1/recommendations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListRecommendationsRequest",
}) as any as S.Schema<ListRecommendationsRequest>;
export interface UpdateOrganizationRecommendationLifecycleRequest {
  lifecycleStage: string;
  updateReason?: string | Redacted.Redacted<string>;
  updateReasonCode?: string;
  organizationRecommendationIdentifier: string;
}
export const UpdateOrganizationRecommendationLifecycleRequest = S.suspend(() =>
  S.Struct({
    lifecycleStage: S.String,
    updateReason: S.optional(SensitiveString),
    updateReasonCode: S.optional(S.String),
    organizationRecommendationIdentifier: S.String.pipe(
      T.HttpLabel("organizationRecommendationIdentifier"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateOrganizationRecommendationLifecycleRequest",
}) as any as S.Schema<UpdateOrganizationRecommendationLifecycleRequest>;
export interface UpdateOrganizationRecommendationLifecycleResponse {}
export const UpdateOrganizationRecommendationLifecycleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateOrganizationRecommendationLifecycleResponse",
}) as any as S.Schema<UpdateOrganizationRecommendationLifecycleResponse>;
export interface UpdateRecommendationLifecycleRequest {
  lifecycleStage: string;
  updateReason?: string | Redacted.Redacted<string>;
  updateReasonCode?: string;
  recommendationIdentifier: string;
}
export const UpdateRecommendationLifecycleRequest = S.suspend(() =>
  S.Struct({
    lifecycleStage: S.String,
    updateReason: S.optional(SensitiveString),
    updateReasonCode: S.optional(S.String),
    recommendationIdentifier: S.String.pipe(
      T.HttpLabel("recommendationIdentifier"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "UpdateRecommendationLifecycleRequest",
}) as any as S.Schema<UpdateRecommendationLifecycleRequest>;
export interface UpdateRecommendationLifecycleResponse {}
export const UpdateRecommendationLifecycleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateRecommendationLifecycleResponse",
}) as any as S.Schema<UpdateRecommendationLifecycleResponse>;
export interface RecommendationResourceExclusion {
  arn: string;
  isExcluded: boolean;
}
export const RecommendationResourceExclusion = S.suspend(() =>
  S.Struct({ arn: S.String, isExcluded: S.Boolean }),
).annotations({
  identifier: "RecommendationResourceExclusion",
}) as any as S.Schema<RecommendationResourceExclusion>;
export type RecommendationResourceExclusionList =
  RecommendationResourceExclusion[];
export const RecommendationResourceExclusionList = S.Array(
  RecommendationResourceExclusion,
);
export interface BatchUpdateRecommendationResourceExclusionRequest {
  recommendationResourceExclusions: RecommendationResourceExclusionList;
}
export const BatchUpdateRecommendationResourceExclusionRequest = S.suspend(() =>
  S.Struct({
    recommendationResourceExclusions: RecommendationResourceExclusionList,
  }).pipe(
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
  ),
).annotations({
  identifier: "BatchUpdateRecommendationResourceExclusionRequest",
}) as any as S.Schema<BatchUpdateRecommendationResourceExclusionRequest>;
export type RecommendationPillarList = string[];
export const RecommendationPillarList = S.Array(S.String);
export type RecommendationAwsServiceList = string[];
export const RecommendationAwsServiceList = S.Array(S.String);
export interface RecommendationResourcesAggregates {
  okCount: number;
  warningCount: number;
  errorCount: number;
}
export const RecommendationResourcesAggregates = S.suspend(() =>
  S.Struct({ okCount: S.Number, warningCount: S.Number, errorCount: S.Number }),
).annotations({
  identifier: "RecommendationResourcesAggregates",
}) as any as S.Schema<RecommendationResourcesAggregates>;
export interface RecommendationCostOptimizingAggregates {
  estimatedMonthlySavings: number;
  estimatedPercentMonthlySavings: number;
}
export const RecommendationCostOptimizingAggregates = S.suspend(() =>
  S.Struct({
    estimatedMonthlySavings: S.Number,
    estimatedPercentMonthlySavings: S.Number,
  }),
).annotations({
  identifier: "RecommendationCostOptimizingAggregates",
}) as any as S.Schema<RecommendationCostOptimizingAggregates>;
export interface RecommendationPillarSpecificAggregates {
  costOptimizing?: RecommendationCostOptimizingAggregates;
}
export const RecommendationPillarSpecificAggregates = S.suspend(() =>
  S.Struct({
    costOptimizing: S.optional(RecommendationCostOptimizingAggregates),
  }),
).annotations({
  identifier: "RecommendationPillarSpecificAggregates",
}) as any as S.Schema<RecommendationPillarSpecificAggregates>;
export interface Recommendation {
  id: string;
  type: string;
  checkArn?: string;
  status: string;
  lifecycleStage?: string;
  pillars: RecommendationPillarList;
  source: string;
  awsServices?: RecommendationAwsServiceList;
  name: string;
  resourcesAggregates: RecommendationResourcesAggregates;
  pillarSpecificAggregates?: RecommendationPillarSpecificAggregates;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  arn: string;
  description: string;
  createdBy?: string;
  updatedOnBehalfOf?: string;
  updatedOnBehalfOfJobTitle?: string;
  updateReason?: string | Redacted.Redacted<string>;
  updateReasonCode?: string;
  resolvedAt?: Date;
}
export const Recommendation = S.suspend(() =>
  S.Struct({
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
    pillarSpecificAggregates: S.optional(
      RecommendationPillarSpecificAggregates,
    ),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    arn: S.String,
    description: S.String,
    createdBy: S.optional(S.String),
    updatedOnBehalfOf: S.optional(S.String),
    updatedOnBehalfOfJobTitle: S.optional(S.String),
    updateReason: S.optional(SensitiveString),
    updateReasonCode: S.optional(S.String),
    resolvedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "Recommendation",
}) as any as S.Schema<Recommendation>;
export interface AccountRecommendationLifecycleSummary {
  accountId?: string;
  accountRecommendationArn?: string;
  lifecycleStage?: string;
  updatedOnBehalfOf?: string;
  updatedOnBehalfOfJobTitle?: string;
  updateReason?: string | Redacted.Redacted<string>;
  updateReasonCode?: string;
  lastUpdatedAt?: Date;
}
export const AccountRecommendationLifecycleSummary = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    accountRecommendationArn: S.optional(S.String),
    lifecycleStage: S.optional(S.String),
    updatedOnBehalfOf: S.optional(S.String),
    updatedOnBehalfOfJobTitle: S.optional(S.String),
    updateReason: S.optional(SensitiveString),
    updateReasonCode: S.optional(S.String),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "AccountRecommendationLifecycleSummary",
}) as any as S.Schema<AccountRecommendationLifecycleSummary>;
export type AccountRecommendationLifecycleSummaryList =
  AccountRecommendationLifecycleSummary[];
export const AccountRecommendationLifecycleSummaryList = S.Array(
  AccountRecommendationLifecycleSummary,
);
export type StringMap = { [key: string]: string };
export const StringMap = S.Record({ key: S.String, value: S.String });
export interface OrganizationRecommendationResourceSummary {
  id: string;
  arn: string;
  awsResourceId: string;
  regionCode: string;
  status: string;
  metadata: StringMap;
  lastUpdatedAt: Date;
  exclusionStatus?: string;
  accountId?: string;
  recommendationArn: string;
}
export const OrganizationRecommendationResourceSummary = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "OrganizationRecommendationResourceSummary",
}) as any as S.Schema<OrganizationRecommendationResourceSummary>;
export type OrganizationRecommendationResourceSummaryList =
  OrganizationRecommendationResourceSummary[];
export const OrganizationRecommendationResourceSummaryList = S.Array(
  OrganizationRecommendationResourceSummary,
);
export interface OrganizationRecommendationSummary {
  id: string;
  type: string;
  checkArn?: string;
  status: string;
  lifecycleStage?: string;
  pillars: RecommendationPillarList;
  source: string;
  awsServices?: RecommendationAwsServiceList;
  name: string;
  resourcesAggregates: RecommendationResourcesAggregates;
  pillarSpecificAggregates?: RecommendationPillarSpecificAggregates;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  arn: string;
}
export const OrganizationRecommendationSummary = S.suspend(() =>
  S.Struct({
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
    pillarSpecificAggregates: S.optional(
      RecommendationPillarSpecificAggregates,
    ),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    arn: S.String,
  }),
).annotations({
  identifier: "OrganizationRecommendationSummary",
}) as any as S.Schema<OrganizationRecommendationSummary>;
export type OrganizationRecommendationSummaryList =
  OrganizationRecommendationSummary[];
export const OrganizationRecommendationSummaryList = S.Array(
  OrganizationRecommendationSummary,
);
export interface RecommendationResourceSummary {
  id: string;
  arn: string;
  awsResourceId: string;
  regionCode: string;
  status: string;
  metadata: StringMap;
  lastUpdatedAt: Date;
  exclusionStatus?: string;
  recommendationArn: string;
}
export const RecommendationResourceSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    awsResourceId: S.String,
    regionCode: S.String,
    status: S.String,
    metadata: StringMap,
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    exclusionStatus: S.optional(S.String),
    recommendationArn: S.String,
  }),
).annotations({
  identifier: "RecommendationResourceSummary",
}) as any as S.Schema<RecommendationResourceSummary>;
export type RecommendationResourceSummaryList = RecommendationResourceSummary[];
export const RecommendationResourceSummaryList = S.Array(
  RecommendationResourceSummary,
);
export interface RecommendationSummary {
  id: string;
  type: string;
  checkArn?: string;
  status: string;
  lifecycleStage?: string;
  pillars: RecommendationPillarList;
  source: string;
  awsServices?: RecommendationAwsServiceList;
  name: string;
  resourcesAggregates: RecommendationResourcesAggregates;
  pillarSpecificAggregates?: RecommendationPillarSpecificAggregates;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  arn: string;
}
export const RecommendationSummary = S.suspend(() =>
  S.Struct({
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
    pillarSpecificAggregates: S.optional(
      RecommendationPillarSpecificAggregates,
    ),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    arn: S.String,
  }),
).annotations({
  identifier: "RecommendationSummary",
}) as any as S.Schema<RecommendationSummary>;
export type RecommendationSummaryList = RecommendationSummary[];
export const RecommendationSummaryList = S.Array(RecommendationSummary);
export interface GetRecommendationResponse {
  recommendation?: Recommendation;
}
export const GetRecommendationResponse = S.suspend(() =>
  S.Struct({ recommendation: S.optional(Recommendation) }),
).annotations({
  identifier: "GetRecommendationResponse",
}) as any as S.Schema<GetRecommendationResponse>;
export interface ListOrganizationRecommendationAccountsResponse {
  nextToken?: string;
  accountRecommendationLifecycleSummaries: AccountRecommendationLifecycleSummaryList;
}
export const ListOrganizationRecommendationAccountsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    accountRecommendationLifecycleSummaries:
      AccountRecommendationLifecycleSummaryList,
  }),
).annotations({
  identifier: "ListOrganizationRecommendationAccountsResponse",
}) as any as S.Schema<ListOrganizationRecommendationAccountsResponse>;
export interface ListOrganizationRecommendationResourcesResponse {
  nextToken?: string;
  organizationRecommendationResourceSummaries: OrganizationRecommendationResourceSummaryList;
}
export const ListOrganizationRecommendationResourcesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    organizationRecommendationResourceSummaries:
      OrganizationRecommendationResourceSummaryList,
  }),
).annotations({
  identifier: "ListOrganizationRecommendationResourcesResponse",
}) as any as S.Schema<ListOrganizationRecommendationResourcesResponse>;
export interface ListOrganizationRecommendationsResponse {
  nextToken?: string;
  organizationRecommendationSummaries: OrganizationRecommendationSummaryList;
}
export const ListOrganizationRecommendationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    organizationRecommendationSummaries: OrganizationRecommendationSummaryList,
  }),
).annotations({
  identifier: "ListOrganizationRecommendationsResponse",
}) as any as S.Schema<ListOrganizationRecommendationsResponse>;
export interface ListRecommendationResourcesResponse {
  nextToken?: string;
  recommendationResourceSummaries: RecommendationResourceSummaryList;
}
export const ListRecommendationResourcesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    recommendationResourceSummaries: RecommendationResourceSummaryList,
  }),
).annotations({
  identifier: "ListRecommendationResourcesResponse",
}) as any as S.Schema<ListRecommendationResourcesResponse>;
export interface ListRecommendationsResponse {
  nextToken?: string;
  recommendationSummaries: RecommendationSummaryList;
}
export const ListRecommendationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    recommendationSummaries: RecommendationSummaryList,
  }),
).annotations({
  identifier: "ListRecommendationsResponse",
}) as any as S.Schema<ListRecommendationsResponse>;
export interface UpdateRecommendationResourceExclusionError {
  arn?: string;
  errorCode?: string;
  errorMessage?: string;
}
export const UpdateRecommendationResourceExclusionError = S.suspend(() =>
  S.Struct({
    arn: S.optional(S.String),
    errorCode: S.optional(S.String),
    errorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateRecommendationResourceExclusionError",
}) as any as S.Schema<UpdateRecommendationResourceExclusionError>;
export type UpdateRecommendationResourceExclusionErrorList =
  UpdateRecommendationResourceExclusionError[];
export const UpdateRecommendationResourceExclusionErrorList = S.Array(
  UpdateRecommendationResourceExclusionError,
);
export interface CheckSummary {
  id: string;
  arn: string;
  name: string;
  description: string;
  pillars: RecommendationPillarList;
  awsServices: RecommendationAwsServiceList;
  source: string;
  metadata: StringMap;
}
export const CheckSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    name: S.String,
    description: S.String,
    pillars: RecommendationPillarList,
    awsServices: RecommendationAwsServiceList,
    source: S.String,
    metadata: StringMap,
  }),
).annotations({ identifier: "CheckSummary" }) as any as S.Schema<CheckSummary>;
export type CheckSummaryList = CheckSummary[];
export const CheckSummaryList = S.Array(CheckSummary);
export interface BatchUpdateRecommendationResourceExclusionResponse {
  batchUpdateRecommendationResourceExclusionErrors: UpdateRecommendationResourceExclusionErrorList;
}
export const BatchUpdateRecommendationResourceExclusionResponse = S.suspend(
  () =>
    S.Struct({
      batchUpdateRecommendationResourceExclusionErrors:
        UpdateRecommendationResourceExclusionErrorList,
    }),
).annotations({
  identifier: "BatchUpdateRecommendationResourceExclusionResponse",
}) as any as S.Schema<BatchUpdateRecommendationResourceExclusionResponse>;
export interface ListChecksResponse {
  nextToken?: string;
  checkSummaries: CheckSummaryList;
}
export const ListChecksResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    checkSummaries: CheckSummaryList,
  }),
).annotations({
  identifier: "ListChecksResponse",
}) as any as S.Schema<ListChecksResponse>;
export interface OrganizationRecommendation {
  id: string;
  type: string;
  checkArn?: string;
  status: string;
  lifecycleStage?: string;
  pillars: RecommendationPillarList;
  source: string;
  awsServices?: RecommendationAwsServiceList;
  name: string;
  resourcesAggregates: RecommendationResourcesAggregates;
  pillarSpecificAggregates?: RecommendationPillarSpecificAggregates;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  arn: string;
  description: string;
  createdBy?: string;
  updatedOnBehalfOf?: string;
  updatedOnBehalfOfJobTitle?: string;
  updateReason?: string | Redacted.Redacted<string>;
  updateReasonCode?: string;
  resolvedAt?: Date;
}
export const OrganizationRecommendation = S.suspend(() =>
  S.Struct({
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
    pillarSpecificAggregates: S.optional(
      RecommendationPillarSpecificAggregates,
    ),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    arn: S.String,
    description: S.String,
    createdBy: S.optional(S.String),
    updatedOnBehalfOf: S.optional(S.String),
    updatedOnBehalfOfJobTitle: S.optional(S.String),
    updateReason: S.optional(SensitiveString),
    updateReasonCode: S.optional(S.String),
    resolvedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "OrganizationRecommendation",
}) as any as S.Schema<OrganizationRecommendation>;
export interface GetOrganizationRecommendationResponse {
  organizationRecommendation?: OrganizationRecommendation;
}
export const GetOrganizationRecommendationResponse = S.suspend(() =>
  S.Struct({
    organizationRecommendation: S.optional(OrganizationRecommendation),
  }),
).annotations({
  identifier: "GetOrganizationRecommendationResponse",
}) as any as S.Schema<GetOrganizationRecommendationResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * List a filterable set of Checks
 */
export const listChecks: {
  (
    input: ListChecksRequest,
  ): Effect.Effect<
    ListChecksResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListChecksRequest,
  ) => Stream.Stream<
    ListChecksResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListChecksRequest,
  ) => Stream.Stream<
    CheckSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listOrganizationRecommendationAccounts: {
  (
    input: ListOrganizationRecommendationAccountsRequest,
  ): Effect.Effect<
    ListOrganizationRecommendationAccountsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOrganizationRecommendationAccountsRequest,
  ) => Stream.Stream<
    ListOrganizationRecommendationAccountsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOrganizationRecommendationAccountsRequest,
  ) => Stream.Stream<
    AccountRecommendationLifecycleSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listOrganizationRecommendationResources: {
  (
    input: ListOrganizationRecommendationResourcesRequest,
  ): Effect.Effect<
    ListOrganizationRecommendationResourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOrganizationRecommendationResourcesRequest,
  ) => Stream.Stream<
    ListOrganizationRecommendationResourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOrganizationRecommendationResourcesRequest,
  ) => Stream.Stream<
    OrganizationRecommendationResourceSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listRecommendationResources: {
  (
    input: ListRecommendationResourcesRequest,
  ): Effect.Effect<
    ListRecommendationResourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendationResourcesRequest,
  ) => Stream.Stream<
    ListRecommendationResourcesResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendationResourcesRequest,
  ) => Stream.Stream<
    RecommendationResourceSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateOrganizationRecommendationLifecycle: (
  input: UpdateOrganizationRecommendationLifecycleRequest,
) => Effect.Effect<
  UpdateOrganizationRecommendationLifecycleResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateRecommendationLifecycle: (
  input: UpdateRecommendationLifecycleRequest,
) => Effect.Effect<
  UpdateRecommendationLifecycleResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getOrganizationRecommendation: (
  input: GetOrganizationRecommendationRequest,
) => Effect.Effect<
  GetOrganizationRecommendationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listOrganizationRecommendations: {
  (
    input: ListOrganizationRecommendationsRequest,
  ): Effect.Effect<
    ListOrganizationRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOrganizationRecommendationsRequest,
  ) => Stream.Stream<
    ListOrganizationRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOrganizationRecommendationsRequest,
  ) => Stream.Stream<
    OrganizationRecommendationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listRecommendations: {
  (
    input: ListRecommendationsRequest,
  ): Effect.Effect<
    ListRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendationsRequest,
  ) => Stream.Stream<
    ListRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendationsRequest,
  ) => Stream.Stream<
    RecommendationSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const batchUpdateRecommendationResourceExclusion: (
  input: BatchUpdateRecommendationResourceExclusionRequest,
) => Effect.Effect<
  BatchUpdateRecommendationResourceExclusionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getRecommendation: (
  input: GetRecommendationRequest,
) => Effect.Effect<
  GetRecommendationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
