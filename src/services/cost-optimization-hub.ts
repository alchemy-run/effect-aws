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
  sdkId: "Cost Optimization Hub",
  serviceShapeName: "CostOptimizationHubService",
});
const auth = T.AwsAuthSigv4({ name: "cost-optimization-hub" });
const ver = T.ServiceVersion("2022-07-26");
const proto = T.AwsProtocolsAwsJson1_0();
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
                                url: "https://cost-optimization-hub-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://cost-optimization-hub-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://cost-optimization-hub.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://cost-optimization-hub.{Region}.{PartitionResult#dnsSuffix}",
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
export type MaxResults = number;
export type AccountId = string;

//# Schemas
export interface GetPreferencesRequest {}
export const GetPreferencesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPreferencesRequest",
}) as any as S.Schema<GetPreferencesRequest>;
export type SummaryMetricsList = string[];
export const SummaryMetricsList = S.Array(S.String);
export interface GetRecommendationRequest {
  recommendationId: string;
}
export const GetRecommendationRequest = S.suspend(() =>
  S.Struct({ recommendationId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRecommendationRequest",
}) as any as S.Schema<GetRecommendationRequest>;
export interface ListEnrollmentStatusesRequest {
  includeOrganizationInfo?: boolean;
  accountId?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListEnrollmentStatusesRequest = S.suspend(() =>
  S.Struct({
    includeOrganizationInfo: S.optional(S.Boolean),
    accountId: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEnrollmentStatusesRequest",
}) as any as S.Schema<ListEnrollmentStatusesRequest>;
export type ImplementationEffortList = string[];
export const ImplementationEffortList = S.Array(S.String);
export type AccountIdList = string[];
export const AccountIdList = S.Array(S.String);
export type RegionList = string[];
export const RegionList = S.Array(S.String);
export type ResourceTypeList = string[];
export const ResourceTypeList = S.Array(S.String);
export type ActionTypeList = string[];
export const ActionTypeList = S.Array(S.String);
export interface Tag {
  key?: string;
  value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export type ResourceIdList = string[];
export const ResourceIdList = S.Array(S.String);
export type ResourceArnList = string[];
export const ResourceArnList = S.Array(S.String);
export type RecommendationIdList = string[];
export const RecommendationIdList = S.Array(S.String);
export interface Filter {
  restartNeeded?: boolean;
  rollbackPossible?: boolean;
  implementationEfforts?: ImplementationEffortList;
  accountIds?: AccountIdList;
  regions?: RegionList;
  resourceTypes?: ResourceTypeList;
  actionTypes?: ActionTypeList;
  tags?: TagList;
  resourceIds?: ResourceIdList;
  resourceArns?: ResourceArnList;
  recommendationIds?: RecommendationIdList;
}
export const Filter = S.suspend(() =>
  S.Struct({
    restartNeeded: S.optional(S.Boolean),
    rollbackPossible: S.optional(S.Boolean),
    implementationEfforts: S.optional(ImplementationEffortList),
    accountIds: S.optional(AccountIdList),
    regions: S.optional(RegionList),
    resourceTypes: S.optional(ResourceTypeList),
    actionTypes: S.optional(ActionTypeList),
    tags: S.optional(TagList),
    resourceIds: S.optional(ResourceIdList),
    resourceArns: S.optional(ResourceArnList),
    recommendationIds: S.optional(RecommendationIdList),
  }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export interface ListRecommendationSummariesRequest {
  filter?: Filter;
  groupBy: string;
  maxResults?: number;
  metrics?: SummaryMetricsList;
  nextToken?: string;
}
export const ListRecommendationSummariesRequest = S.suspend(() =>
  S.Struct({
    filter: S.optional(Filter),
    groupBy: S.String,
    maxResults: S.optional(S.Number),
    metrics: S.optional(SummaryMetricsList),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRecommendationSummariesRequest",
}) as any as S.Schema<ListRecommendationSummariesRequest>;
export interface UpdateEnrollmentStatusRequest {
  status: string;
  includeMemberAccounts?: boolean;
}
export const UpdateEnrollmentStatusRequest = S.suspend(() =>
  S.Struct({
    status: S.String,
    includeMemberAccounts: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEnrollmentStatusRequest",
}) as any as S.Schema<UpdateEnrollmentStatusRequest>;
export interface PreferredCommitment {
  term?: string;
  paymentOption?: string;
}
export const PreferredCommitment = S.suspend(() =>
  S.Struct({ term: S.optional(S.String), paymentOption: S.optional(S.String) }),
).annotations({
  identifier: "PreferredCommitment",
}) as any as S.Schema<PreferredCommitment>;
export interface UpdatePreferencesRequest {
  savingsEstimationMode?: string;
  memberAccountDiscountVisibility?: string;
  preferredCommitment?: PreferredCommitment;
}
export const UpdatePreferencesRequest = S.suspend(() =>
  S.Struct({
    savingsEstimationMode: S.optional(S.String),
    memberAccountDiscountVisibility: S.optional(S.String),
    preferredCommitment: S.optional(PreferredCommitment),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePreferencesRequest",
}) as any as S.Schema<UpdatePreferencesRequest>;
export interface TimePeriod {
  start: string;
  end: string;
}
export const TimePeriod = S.suspend(() =>
  S.Struct({ start: S.String, end: S.String }),
).annotations({ identifier: "TimePeriod" }) as any as S.Schema<TimePeriod>;
export interface OrderBy {
  dimension?: string;
  order?: string;
}
export const OrderBy = S.suspend(() =>
  S.Struct({ dimension: S.optional(S.String), order: S.optional(S.String) }),
).annotations({ identifier: "OrderBy" }) as any as S.Schema<OrderBy>;
export interface GetPreferencesResponse {
  savingsEstimationMode?: string;
  memberAccountDiscountVisibility?: string;
  preferredCommitment?: PreferredCommitment;
}
export const GetPreferencesResponse = S.suspend(() =>
  S.Struct({
    savingsEstimationMode: S.optional(S.String),
    memberAccountDiscountVisibility: S.optional(S.String),
    preferredCommitment: S.optional(PreferredCommitment),
  }),
).annotations({
  identifier: "GetPreferencesResponse",
}) as any as S.Schema<GetPreferencesResponse>;
export interface ListEfficiencyMetricsRequest {
  groupBy?: string;
  granularity: string;
  timePeriod: TimePeriod;
  maxResults?: number;
  orderBy?: OrderBy;
  nextToken?: string;
}
export const ListEfficiencyMetricsRequest = S.suspend(() =>
  S.Struct({
    groupBy: S.optional(S.String),
    granularity: S.String,
    timePeriod: TimePeriod,
    maxResults: S.optional(S.Number),
    orderBy: S.optional(OrderBy),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEfficiencyMetricsRequest",
}) as any as S.Schema<ListEfficiencyMetricsRequest>;
export interface UpdateEnrollmentStatusResponse {
  status?: string;
}
export const UpdateEnrollmentStatusResponse = S.suspend(() =>
  S.Struct({ status: S.optional(S.String) }),
).annotations({
  identifier: "UpdateEnrollmentStatusResponse",
}) as any as S.Schema<UpdateEnrollmentStatusResponse>;
export interface UpdatePreferencesResponse {
  savingsEstimationMode?: string;
  memberAccountDiscountVisibility?: string;
  preferredCommitment?: PreferredCommitment;
}
export const UpdatePreferencesResponse = S.suspend(() =>
  S.Struct({
    savingsEstimationMode: S.optional(S.String),
    memberAccountDiscountVisibility: S.optional(S.String),
    preferredCommitment: S.optional(PreferredCommitment),
  }),
).annotations({
  identifier: "UpdatePreferencesResponse",
}) as any as S.Schema<UpdatePreferencesResponse>;
export interface AccountEnrollmentStatus {
  accountId?: string;
  status?: string;
  lastUpdatedTimestamp?: Date;
  createdTimestamp?: Date;
}
export const AccountEnrollmentStatus = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    status: S.optional(S.String),
    lastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    createdTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "AccountEnrollmentStatus",
}) as any as S.Schema<AccountEnrollmentStatus>;
export type AccountEnrollmentStatuses = AccountEnrollmentStatus[];
export const AccountEnrollmentStatuses = S.Array(AccountEnrollmentStatus);
export interface RecommendationSummary {
  group?: string;
  estimatedMonthlySavings?: number;
  recommendationCount?: number;
}
export const RecommendationSummary = S.suspend(() =>
  S.Struct({
    group: S.optional(S.String),
    estimatedMonthlySavings: S.optional(S.Number),
    recommendationCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "RecommendationSummary",
}) as any as S.Schema<RecommendationSummary>;
export type RecommendationSummariesList = RecommendationSummary[];
export const RecommendationSummariesList = S.Array(RecommendationSummary);
export interface SummaryMetricsResult {
  savingsPercentage?: string;
}
export const SummaryMetricsResult = S.suspend(() =>
  S.Struct({ savingsPercentage: S.optional(S.String) }),
).annotations({
  identifier: "SummaryMetricsResult",
}) as any as S.Schema<SummaryMetricsResult>;
export interface ListEnrollmentStatusesResponse {
  items?: AccountEnrollmentStatuses;
  includeMemberAccounts?: boolean;
  nextToken?: string;
}
export const ListEnrollmentStatusesResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(AccountEnrollmentStatuses),
    includeMemberAccounts: S.optional(S.Boolean),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEnrollmentStatusesResponse",
}) as any as S.Schema<ListEnrollmentStatusesResponse>;
export interface ListRecommendationsRequest {
  filter?: Filter;
  orderBy?: OrderBy;
  includeAllRecommendations?: boolean;
  maxResults?: number;
  nextToken?: string;
}
export const ListRecommendationsRequest = S.suspend(() =>
  S.Struct({
    filter: S.optional(Filter),
    orderBy: S.optional(OrderBy),
    includeAllRecommendations: S.optional(S.Boolean),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRecommendationsRequest",
}) as any as S.Schema<ListRecommendationsRequest>;
export interface ListRecommendationSummariesResponse {
  estimatedTotalDedupedSavings?: number;
  items?: RecommendationSummariesList;
  groupBy?: string;
  currencyCode?: string;
  metrics?: SummaryMetricsResult;
  nextToken?: string;
}
export const ListRecommendationSummariesResponse = S.suspend(() =>
  S.Struct({
    estimatedTotalDedupedSavings: S.optional(S.Number),
    items: S.optional(RecommendationSummariesList),
    groupBy: S.optional(S.String),
    currencyCode: S.optional(S.String),
    metrics: S.optional(SummaryMetricsResult),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecommendationSummariesResponse",
}) as any as S.Schema<ListRecommendationSummariesResponse>;
export interface ComputeConfiguration {
  vCpu?: number;
  memorySizeInMB?: number;
  architecture?: string;
  platform?: string;
}
export const ComputeConfiguration = S.suspend(() =>
  S.Struct({
    vCpu: S.optional(S.Number),
    memorySizeInMB: S.optional(S.Number),
    architecture: S.optional(S.String),
    platform: S.optional(S.String),
  }),
).annotations({
  identifier: "ComputeConfiguration",
}) as any as S.Schema<ComputeConfiguration>;
export interface EcsServiceConfiguration {
  compute?: ComputeConfiguration;
}
export const EcsServiceConfiguration = S.suspend(() =>
  S.Struct({ compute: S.optional(ComputeConfiguration) }),
).annotations({
  identifier: "EcsServiceConfiguration",
}) as any as S.Schema<EcsServiceConfiguration>;
export interface Ec2ReservedInstancesConfiguration {
  accountScope?: string;
  service?: string;
  term?: string;
  paymentOption?: string;
  reservedInstancesRegion?: string;
  upfrontCost?: string;
  monthlyRecurringCost?: string;
  normalizedUnitsToPurchase?: string;
  numberOfInstancesToPurchase?: string;
  offeringClass?: string;
  instanceFamily?: string;
  instanceType?: string;
  currentGeneration?: string;
  platform?: string;
  tenancy?: string;
  sizeFlexEligible?: boolean;
}
export const Ec2ReservedInstancesConfiguration = S.suspend(() =>
  S.Struct({
    accountScope: S.optional(S.String),
    service: S.optional(S.String),
    term: S.optional(S.String),
    paymentOption: S.optional(S.String),
    reservedInstancesRegion: S.optional(S.String),
    upfrontCost: S.optional(S.String),
    monthlyRecurringCost: S.optional(S.String),
    normalizedUnitsToPurchase: S.optional(S.String),
    numberOfInstancesToPurchase: S.optional(S.String),
    offeringClass: S.optional(S.String),
    instanceFamily: S.optional(S.String),
    instanceType: S.optional(S.String),
    currentGeneration: S.optional(S.String),
    platform: S.optional(S.String),
    tenancy: S.optional(S.String),
    sizeFlexEligible: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "Ec2ReservedInstancesConfiguration",
}) as any as S.Schema<Ec2ReservedInstancesConfiguration>;
export interface RdsReservedInstancesConfiguration {
  accountScope?: string;
  service?: string;
  term?: string;
  paymentOption?: string;
  reservedInstancesRegion?: string;
  upfrontCost?: string;
  monthlyRecurringCost?: string;
  normalizedUnitsToPurchase?: string;
  numberOfInstancesToPurchase?: string;
  instanceFamily?: string;
  instanceType?: string;
  sizeFlexEligible?: boolean;
  currentGeneration?: string;
  licenseModel?: string;
  databaseEdition?: string;
  databaseEngine?: string;
  deploymentOption?: string;
}
export const RdsReservedInstancesConfiguration = S.suspend(() =>
  S.Struct({
    accountScope: S.optional(S.String),
    service: S.optional(S.String),
    term: S.optional(S.String),
    paymentOption: S.optional(S.String),
    reservedInstancesRegion: S.optional(S.String),
    upfrontCost: S.optional(S.String),
    monthlyRecurringCost: S.optional(S.String),
    normalizedUnitsToPurchase: S.optional(S.String),
    numberOfInstancesToPurchase: S.optional(S.String),
    instanceFamily: S.optional(S.String),
    instanceType: S.optional(S.String),
    sizeFlexEligible: S.optional(S.Boolean),
    currentGeneration: S.optional(S.String),
    licenseModel: S.optional(S.String),
    databaseEdition: S.optional(S.String),
    databaseEngine: S.optional(S.String),
    deploymentOption: S.optional(S.String),
  }),
).annotations({
  identifier: "RdsReservedInstancesConfiguration",
}) as any as S.Schema<RdsReservedInstancesConfiguration>;
export interface ElastiCacheReservedInstancesConfiguration {
  accountScope?: string;
  service?: string;
  term?: string;
  paymentOption?: string;
  reservedInstancesRegion?: string;
  upfrontCost?: string;
  monthlyRecurringCost?: string;
  normalizedUnitsToPurchase?: string;
  numberOfInstancesToPurchase?: string;
  instanceFamily?: string;
  instanceType?: string;
  currentGeneration?: string;
  sizeFlexEligible?: boolean;
}
export const ElastiCacheReservedInstancesConfiguration = S.suspend(() =>
  S.Struct({
    accountScope: S.optional(S.String),
    service: S.optional(S.String),
    term: S.optional(S.String),
    paymentOption: S.optional(S.String),
    reservedInstancesRegion: S.optional(S.String),
    upfrontCost: S.optional(S.String),
    monthlyRecurringCost: S.optional(S.String),
    normalizedUnitsToPurchase: S.optional(S.String),
    numberOfInstancesToPurchase: S.optional(S.String),
    instanceFamily: S.optional(S.String),
    instanceType: S.optional(S.String),
    currentGeneration: S.optional(S.String),
    sizeFlexEligible: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ElastiCacheReservedInstancesConfiguration",
}) as any as S.Schema<ElastiCacheReservedInstancesConfiguration>;
export interface OpenSearchReservedInstancesConfiguration {
  accountScope?: string;
  service?: string;
  term?: string;
  paymentOption?: string;
  reservedInstancesRegion?: string;
  upfrontCost?: string;
  monthlyRecurringCost?: string;
  normalizedUnitsToPurchase?: string;
  numberOfInstancesToPurchase?: string;
  instanceType?: string;
  currentGeneration?: string;
  sizeFlexEligible?: boolean;
}
export const OpenSearchReservedInstancesConfiguration = S.suspend(() =>
  S.Struct({
    accountScope: S.optional(S.String),
    service: S.optional(S.String),
    term: S.optional(S.String),
    paymentOption: S.optional(S.String),
    reservedInstancesRegion: S.optional(S.String),
    upfrontCost: S.optional(S.String),
    monthlyRecurringCost: S.optional(S.String),
    normalizedUnitsToPurchase: S.optional(S.String),
    numberOfInstancesToPurchase: S.optional(S.String),
    instanceType: S.optional(S.String),
    currentGeneration: S.optional(S.String),
    sizeFlexEligible: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "OpenSearchReservedInstancesConfiguration",
}) as any as S.Schema<OpenSearchReservedInstancesConfiguration>;
export interface RedshiftReservedInstancesConfiguration {
  accountScope?: string;
  service?: string;
  term?: string;
  paymentOption?: string;
  reservedInstancesRegion?: string;
  upfrontCost?: string;
  monthlyRecurringCost?: string;
  normalizedUnitsToPurchase?: string;
  numberOfInstancesToPurchase?: string;
  instanceFamily?: string;
  instanceType?: string;
  sizeFlexEligible?: boolean;
  currentGeneration?: string;
}
export const RedshiftReservedInstancesConfiguration = S.suspend(() =>
  S.Struct({
    accountScope: S.optional(S.String),
    service: S.optional(S.String),
    term: S.optional(S.String),
    paymentOption: S.optional(S.String),
    reservedInstancesRegion: S.optional(S.String),
    upfrontCost: S.optional(S.String),
    monthlyRecurringCost: S.optional(S.String),
    normalizedUnitsToPurchase: S.optional(S.String),
    numberOfInstancesToPurchase: S.optional(S.String),
    instanceFamily: S.optional(S.String),
    instanceType: S.optional(S.String),
    sizeFlexEligible: S.optional(S.Boolean),
    currentGeneration: S.optional(S.String),
  }),
).annotations({
  identifier: "RedshiftReservedInstancesConfiguration",
}) as any as S.Schema<RedshiftReservedInstancesConfiguration>;
export interface Ec2InstanceSavingsPlansConfiguration {
  accountScope?: string;
  term?: string;
  paymentOption?: string;
  hourlyCommitment?: string;
  instanceFamily?: string;
  savingsPlansRegion?: string;
}
export const Ec2InstanceSavingsPlansConfiguration = S.suspend(() =>
  S.Struct({
    accountScope: S.optional(S.String),
    term: S.optional(S.String),
    paymentOption: S.optional(S.String),
    hourlyCommitment: S.optional(S.String),
    instanceFamily: S.optional(S.String),
    savingsPlansRegion: S.optional(S.String),
  }),
).annotations({
  identifier: "Ec2InstanceSavingsPlansConfiguration",
}) as any as S.Schema<Ec2InstanceSavingsPlansConfiguration>;
export interface ComputeSavingsPlansConfiguration {
  accountScope?: string;
  term?: string;
  paymentOption?: string;
  hourlyCommitment?: string;
}
export const ComputeSavingsPlansConfiguration = S.suspend(() =>
  S.Struct({
    accountScope: S.optional(S.String),
    term: S.optional(S.String),
    paymentOption: S.optional(S.String),
    hourlyCommitment: S.optional(S.String),
  }),
).annotations({
  identifier: "ComputeSavingsPlansConfiguration",
}) as any as S.Schema<ComputeSavingsPlansConfiguration>;
export interface SageMakerSavingsPlansConfiguration {
  accountScope?: string;
  term?: string;
  paymentOption?: string;
  hourlyCommitment?: string;
}
export const SageMakerSavingsPlansConfiguration = S.suspend(() =>
  S.Struct({
    accountScope: S.optional(S.String),
    term: S.optional(S.String),
    paymentOption: S.optional(S.String),
    hourlyCommitment: S.optional(S.String),
  }),
).annotations({
  identifier: "SageMakerSavingsPlansConfiguration",
}) as any as S.Schema<SageMakerSavingsPlansConfiguration>;
export interface RdsDbInstanceStorageConfiguration {
  storageType?: string;
  allocatedStorageInGb?: number;
  iops?: number;
  storageThroughput?: number;
}
export const RdsDbInstanceStorageConfiguration = S.suspend(() =>
  S.Struct({
    storageType: S.optional(S.String),
    allocatedStorageInGb: S.optional(S.Number),
    iops: S.optional(S.Number),
    storageThroughput: S.optional(S.Number),
  }),
).annotations({
  identifier: "RdsDbInstanceStorageConfiguration",
}) as any as S.Schema<RdsDbInstanceStorageConfiguration>;
export interface AuroraDbClusterStorageConfiguration {
  storageType?: string;
}
export const AuroraDbClusterStorageConfiguration = S.suspend(() =>
  S.Struct({ storageType: S.optional(S.String) }),
).annotations({
  identifier: "AuroraDbClusterStorageConfiguration",
}) as any as S.Schema<AuroraDbClusterStorageConfiguration>;
export interface DynamoDbReservedCapacityConfiguration {
  accountScope?: string;
  service?: string;
  term?: string;
  paymentOption?: string;
  reservedInstancesRegion?: string;
  upfrontCost?: string;
  monthlyRecurringCost?: string;
  numberOfCapacityUnitsToPurchase?: string;
  capacityUnits?: string;
}
export const DynamoDbReservedCapacityConfiguration = S.suspend(() =>
  S.Struct({
    accountScope: S.optional(S.String),
    service: S.optional(S.String),
    term: S.optional(S.String),
    paymentOption: S.optional(S.String),
    reservedInstancesRegion: S.optional(S.String),
    upfrontCost: S.optional(S.String),
    monthlyRecurringCost: S.optional(S.String),
    numberOfCapacityUnitsToPurchase: S.optional(S.String),
    capacityUnits: S.optional(S.String),
  }),
).annotations({
  identifier: "DynamoDbReservedCapacityConfiguration",
}) as any as S.Schema<DynamoDbReservedCapacityConfiguration>;
export interface MemoryDbReservedInstancesConfiguration {
  accountScope?: string;
  service?: string;
  term?: string;
  paymentOption?: string;
  reservedInstancesRegion?: string;
  upfrontCost?: string;
  monthlyRecurringCost?: string;
  normalizedUnitsToPurchase?: string;
  numberOfInstancesToPurchase?: string;
  instanceType?: string;
  instanceFamily?: string;
  sizeFlexEligible?: boolean;
  currentGeneration?: string;
}
export const MemoryDbReservedInstancesConfiguration = S.suspend(() =>
  S.Struct({
    accountScope: S.optional(S.String),
    service: S.optional(S.String),
    term: S.optional(S.String),
    paymentOption: S.optional(S.String),
    reservedInstancesRegion: S.optional(S.String),
    upfrontCost: S.optional(S.String),
    monthlyRecurringCost: S.optional(S.String),
    normalizedUnitsToPurchase: S.optional(S.String),
    numberOfInstancesToPurchase: S.optional(S.String),
    instanceType: S.optional(S.String),
    instanceFamily: S.optional(S.String),
    sizeFlexEligible: S.optional(S.Boolean),
    currentGeneration: S.optional(S.String),
  }),
).annotations({
  identifier: "MemoryDbReservedInstancesConfiguration",
}) as any as S.Schema<MemoryDbReservedInstancesConfiguration>;
export interface NatGatewayConfiguration {
  activeConnectionCount?: number;
  packetsInFromSource?: number;
  packetsInFromDestination?: number;
}
export const NatGatewayConfiguration = S.suspend(() =>
  S.Struct({
    activeConnectionCount: S.optional(S.Number),
    packetsInFromSource: S.optional(S.Number),
    packetsInFromDestination: S.optional(S.Number),
  }),
).annotations({
  identifier: "NatGatewayConfiguration",
}) as any as S.Schema<NatGatewayConfiguration>;
export interface Usage {
  usageType?: string;
  usageAmount?: number;
  operation?: string;
  productCode?: string;
  unit?: string;
}
export const Usage = S.suspend(() =>
  S.Struct({
    usageType: S.optional(S.String),
    usageAmount: S.optional(S.Number),
    operation: S.optional(S.String),
    productCode: S.optional(S.String),
    unit: S.optional(S.String),
  }),
).annotations({ identifier: "Usage" }) as any as S.Schema<Usage>;
export type UsageList = Usage[];
export const UsageList = S.Array(Usage);
export interface EstimatedDiscounts {
  savingsPlansDiscount?: number;
  reservedInstancesDiscount?: number;
  otherDiscount?: number;
}
export const EstimatedDiscounts = S.suspend(() =>
  S.Struct({
    savingsPlansDiscount: S.optional(S.Number),
    reservedInstancesDiscount: S.optional(S.Number),
    otherDiscount: S.optional(S.Number),
  }),
).annotations({
  identifier: "EstimatedDiscounts",
}) as any as S.Schema<EstimatedDiscounts>;
export interface ResourcePricing {
  estimatedCostBeforeDiscounts?: number;
  estimatedNetUnusedAmortizedCommitments?: number;
  estimatedDiscounts?: EstimatedDiscounts;
  estimatedCostAfterDiscounts?: number;
}
export const ResourcePricing = S.suspend(() =>
  S.Struct({
    estimatedCostBeforeDiscounts: S.optional(S.Number),
    estimatedNetUnusedAmortizedCommitments: S.optional(S.Number),
    estimatedDiscounts: S.optional(EstimatedDiscounts),
    estimatedCostAfterDiscounts: S.optional(S.Number),
  }),
).annotations({
  identifier: "ResourcePricing",
}) as any as S.Schema<ResourcePricing>;
export interface ResourceCostCalculation {
  usages?: UsageList;
  pricing?: ResourcePricing;
}
export const ResourceCostCalculation = S.suspend(() =>
  S.Struct({
    usages: S.optional(UsageList),
    pricing: S.optional(ResourcePricing),
  }),
).annotations({
  identifier: "ResourceCostCalculation",
}) as any as S.Schema<ResourceCostCalculation>;
export interface EcsService {
  configuration?: EcsServiceConfiguration;
  costCalculation?: ResourceCostCalculation;
}
export const EcsService = S.suspend(() =>
  S.Struct({
    configuration: S.optional(EcsServiceConfiguration),
    costCalculation: S.optional(ResourceCostCalculation),
  }),
).annotations({ identifier: "EcsService" }) as any as S.Schema<EcsService>;
export interface ReservedInstancesPricing {
  estimatedOnDemandCost?: number;
  monthlyReservationEligibleCost?: number;
  savingsPercentage?: number;
  estimatedMonthlyAmortizedReservationCost?: number;
}
export const ReservedInstancesPricing = S.suspend(() =>
  S.Struct({
    estimatedOnDemandCost: S.optional(S.Number),
    monthlyReservationEligibleCost: S.optional(S.Number),
    savingsPercentage: S.optional(S.Number),
    estimatedMonthlyAmortizedReservationCost: S.optional(S.Number),
  }),
).annotations({
  identifier: "ReservedInstancesPricing",
}) as any as S.Schema<ReservedInstancesPricing>;
export interface ReservedInstancesCostCalculation {
  pricing?: ReservedInstancesPricing;
}
export const ReservedInstancesCostCalculation = S.suspend(() =>
  S.Struct({ pricing: S.optional(ReservedInstancesPricing) }),
).annotations({
  identifier: "ReservedInstancesCostCalculation",
}) as any as S.Schema<ReservedInstancesCostCalculation>;
export interface RdsReservedInstances {
  configuration?: RdsReservedInstancesConfiguration;
  costCalculation?: ReservedInstancesCostCalculation;
}
export const RdsReservedInstances = S.suspend(() =>
  S.Struct({
    configuration: S.optional(RdsReservedInstancesConfiguration),
    costCalculation: S.optional(ReservedInstancesCostCalculation),
  }),
).annotations({
  identifier: "RdsReservedInstances",
}) as any as S.Schema<RdsReservedInstances>;
export interface ElastiCacheReservedInstances {
  configuration?: ElastiCacheReservedInstancesConfiguration;
  costCalculation?: ReservedInstancesCostCalculation;
}
export const ElastiCacheReservedInstances = S.suspend(() =>
  S.Struct({
    configuration: S.optional(ElastiCacheReservedInstancesConfiguration),
    costCalculation: S.optional(ReservedInstancesCostCalculation),
  }),
).annotations({
  identifier: "ElastiCacheReservedInstances",
}) as any as S.Schema<ElastiCacheReservedInstances>;
export interface OpenSearchReservedInstances {
  configuration?: OpenSearchReservedInstancesConfiguration;
  costCalculation?: ReservedInstancesCostCalculation;
}
export const OpenSearchReservedInstances = S.suspend(() =>
  S.Struct({
    configuration: S.optional(OpenSearchReservedInstancesConfiguration),
    costCalculation: S.optional(ReservedInstancesCostCalculation),
  }),
).annotations({
  identifier: "OpenSearchReservedInstances",
}) as any as S.Schema<OpenSearchReservedInstances>;
export interface RedshiftReservedInstances {
  configuration?: RedshiftReservedInstancesConfiguration;
  costCalculation?: ReservedInstancesCostCalculation;
}
export const RedshiftReservedInstances = S.suspend(() =>
  S.Struct({
    configuration: S.optional(RedshiftReservedInstancesConfiguration),
    costCalculation: S.optional(ReservedInstancesCostCalculation),
  }),
).annotations({
  identifier: "RedshiftReservedInstances",
}) as any as S.Schema<RedshiftReservedInstances>;
export interface SavingsPlansPricing {
  monthlySavingsPlansEligibleCost?: number;
  estimatedMonthlyCommitment?: number;
  savingsPercentage?: number;
  estimatedOnDemandCost?: number;
}
export const SavingsPlansPricing = S.suspend(() =>
  S.Struct({
    monthlySavingsPlansEligibleCost: S.optional(S.Number),
    estimatedMonthlyCommitment: S.optional(S.Number),
    savingsPercentage: S.optional(S.Number),
    estimatedOnDemandCost: S.optional(S.Number),
  }),
).annotations({
  identifier: "SavingsPlansPricing",
}) as any as S.Schema<SavingsPlansPricing>;
export interface SavingsPlansCostCalculation {
  pricing?: SavingsPlansPricing;
}
export const SavingsPlansCostCalculation = S.suspend(() =>
  S.Struct({ pricing: S.optional(SavingsPlansPricing) }),
).annotations({
  identifier: "SavingsPlansCostCalculation",
}) as any as S.Schema<SavingsPlansCostCalculation>;
export interface ComputeSavingsPlans {
  configuration?: ComputeSavingsPlansConfiguration;
  costCalculation?: SavingsPlansCostCalculation;
}
export const ComputeSavingsPlans = S.suspend(() =>
  S.Struct({
    configuration: S.optional(ComputeSavingsPlansConfiguration),
    costCalculation: S.optional(SavingsPlansCostCalculation),
  }),
).annotations({
  identifier: "ComputeSavingsPlans",
}) as any as S.Schema<ComputeSavingsPlans>;
export interface SageMakerSavingsPlans {
  configuration?: SageMakerSavingsPlansConfiguration;
  costCalculation?: SavingsPlansCostCalculation;
}
export const SageMakerSavingsPlans = S.suspend(() =>
  S.Struct({
    configuration: S.optional(SageMakerSavingsPlansConfiguration),
    costCalculation: S.optional(SavingsPlansCostCalculation),
  }),
).annotations({
  identifier: "SageMakerSavingsPlans",
}) as any as S.Schema<SageMakerSavingsPlans>;
export interface RdsDbInstanceStorage {
  configuration?: RdsDbInstanceStorageConfiguration;
  costCalculation?: ResourceCostCalculation;
}
export const RdsDbInstanceStorage = S.suspend(() =>
  S.Struct({
    configuration: S.optional(RdsDbInstanceStorageConfiguration),
    costCalculation: S.optional(ResourceCostCalculation),
  }),
).annotations({
  identifier: "RdsDbInstanceStorage",
}) as any as S.Schema<RdsDbInstanceStorage>;
export interface AuroraDbClusterStorage {
  configuration?: AuroraDbClusterStorageConfiguration;
  costCalculation?: ResourceCostCalculation;
}
export const AuroraDbClusterStorage = S.suspend(() =>
  S.Struct({
    configuration: S.optional(AuroraDbClusterStorageConfiguration),
    costCalculation: S.optional(ResourceCostCalculation),
  }),
).annotations({
  identifier: "AuroraDbClusterStorage",
}) as any as S.Schema<AuroraDbClusterStorage>;
export interface DynamoDbReservedCapacity {
  configuration?: DynamoDbReservedCapacityConfiguration;
  costCalculation?: ReservedInstancesCostCalculation;
}
export const DynamoDbReservedCapacity = S.suspend(() =>
  S.Struct({
    configuration: S.optional(DynamoDbReservedCapacityConfiguration),
    costCalculation: S.optional(ReservedInstancesCostCalculation),
  }),
).annotations({
  identifier: "DynamoDbReservedCapacity",
}) as any as S.Schema<DynamoDbReservedCapacity>;
export interface MemoryDbReservedInstances {
  configuration?: MemoryDbReservedInstancesConfiguration;
  costCalculation?: ReservedInstancesCostCalculation;
}
export const MemoryDbReservedInstances = S.suspend(() =>
  S.Struct({
    configuration: S.optional(MemoryDbReservedInstancesConfiguration),
    costCalculation: S.optional(ReservedInstancesCostCalculation),
  }),
).annotations({
  identifier: "MemoryDbReservedInstances",
}) as any as S.Schema<MemoryDbReservedInstances>;
export interface NatGateway {
  configuration?: NatGatewayConfiguration;
  costCalculation?: ResourceCostCalculation;
}
export const NatGateway = S.suspend(() =>
  S.Struct({
    configuration: S.optional(NatGatewayConfiguration),
    costCalculation: S.optional(ResourceCostCalculation),
  }),
).annotations({ identifier: "NatGateway" }) as any as S.Schema<NatGateway>;
export interface MetricsByTime {
  score?: number;
  savings?: number;
  spend?: number;
  timestamp?: string;
}
export const MetricsByTime = S.suspend(() =>
  S.Struct({
    score: S.optional(S.Number),
    savings: S.optional(S.Number),
    spend: S.optional(S.Number),
    timestamp: S.optional(S.String),
  }),
).annotations({
  identifier: "MetricsByTime",
}) as any as S.Schema<MetricsByTime>;
export type MetricsByTimeList = MetricsByTime[];
export const MetricsByTimeList = S.Array(MetricsByTime);
export interface InstanceConfiguration {
  type?: string;
}
export const InstanceConfiguration = S.suspend(() =>
  S.Struct({ type: S.optional(S.String) }),
).annotations({
  identifier: "InstanceConfiguration",
}) as any as S.Schema<InstanceConfiguration>;
export interface StorageConfiguration {
  type?: string;
  sizeInGb?: number;
}
export const StorageConfiguration = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), sizeInGb: S.optional(S.Number) }),
).annotations({
  identifier: "StorageConfiguration",
}) as any as S.Schema<StorageConfiguration>;
export interface BlockStoragePerformanceConfiguration {
  iops?: number;
  throughput?: number;
}
export const BlockStoragePerformanceConfiguration = S.suspend(() =>
  S.Struct({ iops: S.optional(S.Number), throughput: S.optional(S.Number) }),
).annotations({
  identifier: "BlockStoragePerformanceConfiguration",
}) as any as S.Schema<BlockStoragePerformanceConfiguration>;
export interface MixedInstanceConfiguration {
  type?: string;
}
export const MixedInstanceConfiguration = S.suspend(() =>
  S.Struct({ type: S.optional(S.String) }),
).annotations({
  identifier: "MixedInstanceConfiguration",
}) as any as S.Schema<MixedInstanceConfiguration>;
export type MixedInstanceConfigurationList = MixedInstanceConfiguration[];
export const MixedInstanceConfigurationList = S.Array(
  MixedInstanceConfiguration,
);
export interface DbInstanceConfiguration {
  dbInstanceClass?: string;
}
export const DbInstanceConfiguration = S.suspend(() =>
  S.Struct({ dbInstanceClass: S.optional(S.String) }),
).annotations({
  identifier: "DbInstanceConfiguration",
}) as any as S.Schema<DbInstanceConfiguration>;
export interface EfficiencyMetricsByGroup {
  metricsByTime?: MetricsByTimeList;
  group?: string;
  message?: string;
}
export const EfficiencyMetricsByGroup = S.suspend(() =>
  S.Struct({
    metricsByTime: S.optional(MetricsByTimeList),
    group: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "EfficiencyMetricsByGroup",
}) as any as S.Schema<EfficiencyMetricsByGroup>;
export type EfficiencyMetricsByGroupList = EfficiencyMetricsByGroup[];
export const EfficiencyMetricsByGroupList = S.Array(EfficiencyMetricsByGroup);
export interface Recommendation {
  recommendationId?: string;
  accountId?: string;
  region?: string;
  resourceId?: string;
  resourceArn?: string;
  currentResourceType?: string;
  recommendedResourceType?: string;
  estimatedMonthlySavings?: number;
  estimatedSavingsPercentage?: number;
  estimatedMonthlyCost?: number;
  currencyCode?: string;
  implementationEffort?: string;
  restartNeeded?: boolean;
  actionType?: string;
  rollbackPossible?: boolean;
  currentResourceSummary?: string;
  recommendedResourceSummary?: string;
  lastRefreshTimestamp?: Date;
  recommendationLookbackPeriodInDays?: number;
  source?: string;
  tags?: TagList;
}
export const Recommendation = S.suspend(() =>
  S.Struct({
    recommendationId: S.optional(S.String),
    accountId: S.optional(S.String),
    region: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceArn: S.optional(S.String),
    currentResourceType: S.optional(S.String),
    recommendedResourceType: S.optional(S.String),
    estimatedMonthlySavings: S.optional(S.Number),
    estimatedSavingsPercentage: S.optional(S.Number),
    estimatedMonthlyCost: S.optional(S.Number),
    currencyCode: S.optional(S.String),
    implementationEffort: S.optional(S.String),
    restartNeeded: S.optional(S.Boolean),
    actionType: S.optional(S.String),
    rollbackPossible: S.optional(S.Boolean),
    currentResourceSummary: S.optional(S.String),
    recommendedResourceSummary: S.optional(S.String),
    lastRefreshTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    recommendationLookbackPeriodInDays: S.optional(S.Number),
    source: S.optional(S.String),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "Recommendation",
}) as any as S.Schema<Recommendation>;
export type RecommendationList = Recommendation[];
export const RecommendationList = S.Array(Recommendation);
export interface LambdaFunctionConfiguration {
  compute?: ComputeConfiguration;
}
export const LambdaFunctionConfiguration = S.suspend(() =>
  S.Struct({ compute: S.optional(ComputeConfiguration) }),
).annotations({
  identifier: "LambdaFunctionConfiguration",
}) as any as S.Schema<LambdaFunctionConfiguration>;
export interface Ec2InstanceConfiguration {
  instance?: InstanceConfiguration;
}
export const Ec2InstanceConfiguration = S.suspend(() =>
  S.Struct({ instance: S.optional(InstanceConfiguration) }),
).annotations({
  identifier: "Ec2InstanceConfiguration",
}) as any as S.Schema<Ec2InstanceConfiguration>;
export interface EbsVolumeConfiguration {
  storage?: StorageConfiguration;
  performance?: BlockStoragePerformanceConfiguration;
  attachmentState?: string;
}
export const EbsVolumeConfiguration = S.suspend(() =>
  S.Struct({
    storage: S.optional(StorageConfiguration),
    performance: S.optional(BlockStoragePerformanceConfiguration),
    attachmentState: S.optional(S.String),
  }),
).annotations({
  identifier: "EbsVolumeConfiguration",
}) as any as S.Schema<EbsVolumeConfiguration>;
export interface Ec2AutoScalingGroupConfiguration {
  instance?: InstanceConfiguration;
  mixedInstances?: MixedInstanceConfigurationList;
  type?: string;
  allocationStrategy?: string;
}
export const Ec2AutoScalingGroupConfiguration = S.suspend(() =>
  S.Struct({
    instance: S.optional(InstanceConfiguration),
    mixedInstances: S.optional(MixedInstanceConfigurationList),
    type: S.optional(S.String),
    allocationStrategy: S.optional(S.String),
  }),
).annotations({
  identifier: "Ec2AutoScalingGroupConfiguration",
}) as any as S.Schema<Ec2AutoScalingGroupConfiguration>;
export interface RdsDbInstanceConfiguration {
  instance?: DbInstanceConfiguration;
}
export const RdsDbInstanceConfiguration = S.suspend(() =>
  S.Struct({ instance: S.optional(DbInstanceConfiguration) }),
).annotations({
  identifier: "RdsDbInstanceConfiguration",
}) as any as S.Schema<RdsDbInstanceConfiguration>;
export interface ListEfficiencyMetricsResponse {
  efficiencyMetricsByGroup?: EfficiencyMetricsByGroupList;
  nextToken?: string;
}
export const ListEfficiencyMetricsResponse = S.suspend(() =>
  S.Struct({
    efficiencyMetricsByGroup: S.optional(EfficiencyMetricsByGroupList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEfficiencyMetricsResponse",
}) as any as S.Schema<ListEfficiencyMetricsResponse>;
export interface ListRecommendationsResponse {
  items?: RecommendationList;
  nextToken?: string;
}
export const ListRecommendationsResponse = S.suspend(() =>
  S.Struct({
    items: S.optional(RecommendationList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecommendationsResponse",
}) as any as S.Schema<ListRecommendationsResponse>;
export interface Ec2Instance {
  configuration?: Ec2InstanceConfiguration;
  costCalculation?: ResourceCostCalculation;
}
export const Ec2Instance = S.suspend(() =>
  S.Struct({
    configuration: S.optional(Ec2InstanceConfiguration),
    costCalculation: S.optional(ResourceCostCalculation),
  }),
).annotations({ identifier: "Ec2Instance" }) as any as S.Schema<Ec2Instance>;
export interface EbsVolume {
  configuration?: EbsVolumeConfiguration;
  costCalculation?: ResourceCostCalculation;
}
export const EbsVolume = S.suspend(() =>
  S.Struct({
    configuration: S.optional(EbsVolumeConfiguration),
    costCalculation: S.optional(ResourceCostCalculation),
  }),
).annotations({ identifier: "EbsVolume" }) as any as S.Schema<EbsVolume>;
export interface Ec2AutoScalingGroup {
  configuration?: Ec2AutoScalingGroupConfiguration;
  costCalculation?: ResourceCostCalculation;
}
export const Ec2AutoScalingGroup = S.suspend(() =>
  S.Struct({
    configuration: S.optional(Ec2AutoScalingGroupConfiguration),
    costCalculation: S.optional(ResourceCostCalculation),
  }),
).annotations({
  identifier: "Ec2AutoScalingGroup",
}) as any as S.Schema<Ec2AutoScalingGroup>;
export interface Ec2ReservedInstances {
  configuration?: Ec2ReservedInstancesConfiguration;
  costCalculation?: ReservedInstancesCostCalculation;
}
export const Ec2ReservedInstances = S.suspend(() =>
  S.Struct({
    configuration: S.optional(Ec2ReservedInstancesConfiguration),
    costCalculation: S.optional(ReservedInstancesCostCalculation),
  }),
).annotations({
  identifier: "Ec2ReservedInstances",
}) as any as S.Schema<Ec2ReservedInstances>;
export interface Ec2InstanceSavingsPlans {
  configuration?: Ec2InstanceSavingsPlansConfiguration;
  costCalculation?: SavingsPlansCostCalculation;
}
export const Ec2InstanceSavingsPlans = S.suspend(() =>
  S.Struct({
    configuration: S.optional(Ec2InstanceSavingsPlansConfiguration),
    costCalculation: S.optional(SavingsPlansCostCalculation),
  }),
).annotations({
  identifier: "Ec2InstanceSavingsPlans",
}) as any as S.Schema<Ec2InstanceSavingsPlans>;
export interface RdsDbInstance {
  configuration?: RdsDbInstanceConfiguration;
  costCalculation?: ResourceCostCalculation;
}
export const RdsDbInstance = S.suspend(() =>
  S.Struct({
    configuration: S.optional(RdsDbInstanceConfiguration),
    costCalculation: S.optional(ResourceCostCalculation),
  }),
).annotations({
  identifier: "RdsDbInstance",
}) as any as S.Schema<RdsDbInstance>;
export interface LambdaFunction {
  configuration?: LambdaFunctionConfiguration;
  costCalculation?: ResourceCostCalculation;
}
export const LambdaFunction = S.suspend(() =>
  S.Struct({
    configuration: S.optional(LambdaFunctionConfiguration),
    costCalculation: S.optional(ResourceCostCalculation),
  }),
).annotations({
  identifier: "LambdaFunction",
}) as any as S.Schema<LambdaFunction>;
export interface ValidationExceptionDetail {
  fieldName: string;
  message: string;
}
export const ValidationExceptionDetail = S.suspend(() =>
  S.Struct({ fieldName: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionDetail",
}) as any as S.Schema<ValidationExceptionDetail>;
export type ValidationExceptionDetails = ValidationExceptionDetail[];
export const ValidationExceptionDetails = S.Array(ValidationExceptionDetail);
export type ResourceDetails =
  | { lambdaFunction: LambdaFunction }
  | { ecsService: EcsService }
  | { ec2Instance: Ec2Instance }
  | { ebsVolume: EbsVolume }
  | { ec2AutoScalingGroup: Ec2AutoScalingGroup }
  | { ec2ReservedInstances: Ec2ReservedInstances }
  | { rdsReservedInstances: RdsReservedInstances }
  | { elastiCacheReservedInstances: ElastiCacheReservedInstances }
  | { openSearchReservedInstances: OpenSearchReservedInstances }
  | { redshiftReservedInstances: RedshiftReservedInstances }
  | { ec2InstanceSavingsPlans: Ec2InstanceSavingsPlans }
  | { computeSavingsPlans: ComputeSavingsPlans }
  | { sageMakerSavingsPlans: SageMakerSavingsPlans }
  | { rdsDbInstance: RdsDbInstance }
  | { rdsDbInstanceStorage: RdsDbInstanceStorage }
  | { auroraDbClusterStorage: AuroraDbClusterStorage }
  | { dynamoDbReservedCapacity: DynamoDbReservedCapacity }
  | { memoryDbReservedInstances: MemoryDbReservedInstances }
  | { natGateway: NatGateway };
export const ResourceDetails = S.Union(
  S.Struct({ lambdaFunction: LambdaFunction }),
  S.Struct({ ecsService: EcsService }),
  S.Struct({ ec2Instance: Ec2Instance }),
  S.Struct({ ebsVolume: EbsVolume }),
  S.Struct({ ec2AutoScalingGroup: Ec2AutoScalingGroup }),
  S.Struct({ ec2ReservedInstances: Ec2ReservedInstances }),
  S.Struct({ rdsReservedInstances: RdsReservedInstances }),
  S.Struct({ elastiCacheReservedInstances: ElastiCacheReservedInstances }),
  S.Struct({ openSearchReservedInstances: OpenSearchReservedInstances }),
  S.Struct({ redshiftReservedInstances: RedshiftReservedInstances }),
  S.Struct({ ec2InstanceSavingsPlans: Ec2InstanceSavingsPlans }),
  S.Struct({ computeSavingsPlans: ComputeSavingsPlans }),
  S.Struct({ sageMakerSavingsPlans: SageMakerSavingsPlans }),
  S.Struct({ rdsDbInstance: RdsDbInstance }),
  S.Struct({ rdsDbInstanceStorage: RdsDbInstanceStorage }),
  S.Struct({ auroraDbClusterStorage: AuroraDbClusterStorage }),
  S.Struct({ dynamoDbReservedCapacity: DynamoDbReservedCapacity }),
  S.Struct({ memoryDbReservedInstances: MemoryDbReservedInstances }),
  S.Struct({ natGateway: NatGateway }),
);
export interface GetRecommendationResponse {
  recommendationId?: string;
  resourceId?: string;
  resourceArn?: string;
  accountId?: string;
  currencyCode?: string;
  recommendationLookbackPeriodInDays?: number;
  costCalculationLookbackPeriodInDays?: number;
  estimatedSavingsPercentage?: number;
  estimatedSavingsOverCostCalculationLookbackPeriod?: number;
  currentResourceType?: string;
  recommendedResourceType?: string;
  region?: string;
  source?: string;
  lastRefreshTimestamp?: Date;
  estimatedMonthlySavings?: number;
  estimatedMonthlyCost?: number;
  implementationEffort?: string;
  restartNeeded?: boolean;
  actionType?: string;
  rollbackPossible?: boolean;
  currentResourceDetails?: (typeof ResourceDetails)["Type"];
  recommendedResourceDetails?: (typeof ResourceDetails)["Type"];
  tags?: TagList;
}
export const GetRecommendationResponse = S.suspend(() =>
  S.Struct({
    recommendationId: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceArn: S.optional(S.String),
    accountId: S.optional(S.String),
    currencyCode: S.optional(S.String),
    recommendationLookbackPeriodInDays: S.optional(S.Number),
    costCalculationLookbackPeriodInDays: S.optional(S.Number),
    estimatedSavingsPercentage: S.optional(S.Number),
    estimatedSavingsOverCostCalculationLookbackPeriod: S.optional(S.Number),
    currentResourceType: S.optional(S.String),
    recommendedResourceType: S.optional(S.String),
    region: S.optional(S.String),
    source: S.optional(S.String),
    lastRefreshTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    estimatedMonthlySavings: S.optional(S.Number),
    estimatedMonthlyCost: S.optional(S.Number),
    implementationEffort: S.optional(S.String),
    restartNeeded: S.optional(S.Boolean),
    actionType: S.optional(S.String),
    rollbackPossible: S.optional(S.Boolean),
    currentResourceDetails: S.optional(ResourceDetails),
    recommendedResourceDetails: S.optional(ResourceDetails),
    tags: S.optional(TagList),
  }),
).annotations({
  identifier: "GetRecommendationResponse",
}) as any as S.Schema<GetRecommendationResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.optional(S.String),
    fields: S.optional(ValidationExceptionDetails),
  },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a set of preferences for an account in order to add account-specific preferences into the service. These preferences impact how the savings associated with recommendations are presented—estimated savings after discounts or estimated savings before discounts, for example.
 */
export const getPreferences: (
  input: GetPreferencesRequest,
) => Effect.Effect<
  GetPreferencesResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPreferencesRequest,
  output: GetPreferencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns cost efficiency metrics aggregated over time and optionally grouped by a specified dimension. The metrics provide insights into your cost optimization progress by tracking estimated savings, spending, and measures how effectively you're optimizing your Cloud resources.
 *
 * The operation supports both daily and monthly time granularities and allows grouping results by account ID, Amazon Web Services Region. Results are returned as time-series data, enabling you to analyze trends in your cost optimization performance over the specified time period.
 */
export const listEfficiencyMetrics: {
  (
    input: ListEfficiencyMetricsRequest,
  ): Effect.Effect<
    ListEfficiencyMetricsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEfficiencyMetricsRequest,
  ) => Stream.Stream<
    ListEfficiencyMetricsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEfficiencyMetricsRequest,
  ) => Stream.Stream<
    EfficiencyMetricsByGroup,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEfficiencyMetricsRequest,
  output: ListEfficiencyMetricsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "efficiencyMetricsByGroup",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a list of recommendations.
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
    Recommendation,
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
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the enrollment status for an account. It can also return the list of accounts that are enrolled under the organization.
 */
export const listEnrollmentStatuses: {
  (
    input: ListEnrollmentStatusesRequest,
  ): Effect.Effect<
    ListEnrollmentStatusesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEnrollmentStatusesRequest,
  ) => Stream.Stream<
    ListEnrollmentStatusesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEnrollmentStatusesRequest,
  ) => Stream.Stream<
    AccountEnrollmentStatus,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEnrollmentStatusesRequest,
  output: ListEnrollmentStatusesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns a concise representation of savings estimates for resources. Also returns de-duped savings across different types of recommendations.
 *
 * The following filters are not supported for this API: `recommendationIds`, `resourceArns`, and `resourceIds`.
 */
export const listRecommendationSummaries: {
  (
    input: ListRecommendationSummariesRequest,
  ): Effect.Effect<
    ListRecommendationSummariesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRecommendationSummariesRequest,
  ) => Stream.Stream<
    ListRecommendationSummariesResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendationSummariesRequest,
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
  input: ListRecommendationSummariesRequest,
  output: ListRecommendationSummariesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "items",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the enrollment (opt in and opt out) status of an account to the Cost Optimization Hub service.
 *
 * If the account is a management account of an organization, this action can also be used to enroll member accounts of the organization.
 *
 * You must have the appropriate permissions to opt in to Cost Optimization Hub and to view its recommendations. When you opt in, Cost Optimization Hub automatically creates a service-linked role in your account to access its data.
 */
export const updateEnrollmentStatus: (
  input: UpdateEnrollmentStatusRequest,
) => Effect.Effect<
  UpdateEnrollmentStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnrollmentStatusRequest,
  output: UpdateEnrollmentStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a set of preferences for an account in order to add account-specific preferences into the service. These preferences impact how the savings associated with recommendations are presented.
 */
export const updatePreferences: (
  input: UpdatePreferencesRequest,
) => Effect.Effect<
  UpdatePreferencesResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePreferencesRequest,
  output: UpdatePreferencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns both the current and recommended resource configuration and the estimated cost impact for a recommendation.
 *
 * The `recommendationId` is only valid for up to a maximum of 24 hours as recommendations are refreshed daily. To retrieve the `recommendationId`, use the `ListRecommendations` API.
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
