import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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

//# Schemas
export class GetPreferencesRequest extends S.Class<GetPreferencesRequest>(
  "GetPreferencesRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const SummaryMetricsList = S.Array(S.String);
export class GetRecommendationRequest extends S.Class<GetRecommendationRequest>(
  "GetRecommendationRequest",
)(
  { recommendationId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEnrollmentStatusesRequest extends S.Class<ListEnrollmentStatusesRequest>(
  "ListEnrollmentStatusesRequest",
)(
  {
    includeOrganizationInfo: S.optional(S.Boolean),
    accountId: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ImplementationEffortList = S.Array(S.String);
export const AccountIdList = S.Array(S.String);
export const RegionList = S.Array(S.String);
export const ResourceTypeList = S.Array(S.String);
export const ActionTypeList = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  key: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export const ResourceIdList = S.Array(S.String);
export const ResourceArnList = S.Array(S.String);
export const RecommendationIdList = S.Array(S.String);
export class Filter extends S.Class<Filter>("Filter")({
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
}) {}
export class ListRecommendationSummariesRequest extends S.Class<ListRecommendationSummariesRequest>(
  "ListRecommendationSummariesRequest",
)(
  {
    filter: S.optional(Filter),
    groupBy: S.String,
    maxResults: S.optional(S.Number),
    metrics: S.optional(SummaryMetricsList),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEnrollmentStatusRequest extends S.Class<UpdateEnrollmentStatusRequest>(
  "UpdateEnrollmentStatusRequest",
)(
  { status: S.String, includeMemberAccounts: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PreferredCommitment extends S.Class<PreferredCommitment>(
  "PreferredCommitment",
)({ term: S.optional(S.String), paymentOption: S.optional(S.String) }) {}
export class UpdatePreferencesRequest extends S.Class<UpdatePreferencesRequest>(
  "UpdatePreferencesRequest",
)(
  {
    savingsEstimationMode: S.optional(S.String),
    memberAccountDiscountVisibility: S.optional(S.String),
    preferredCommitment: S.optional(PreferredCommitment),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TimePeriod extends S.Class<TimePeriod>("TimePeriod")({
  start: S.String,
  end: S.String,
}) {}
export class OrderBy extends S.Class<OrderBy>("OrderBy")({
  dimension: S.optional(S.String),
  order: S.optional(S.String),
}) {}
export class GetPreferencesResponse extends S.Class<GetPreferencesResponse>(
  "GetPreferencesResponse",
)({
  savingsEstimationMode: S.optional(S.String),
  memberAccountDiscountVisibility: S.optional(S.String),
  preferredCommitment: S.optional(PreferredCommitment),
}) {}
export class ListEfficiencyMetricsRequest extends S.Class<ListEfficiencyMetricsRequest>(
  "ListEfficiencyMetricsRequest",
)(
  {
    groupBy: S.optional(S.String),
    granularity: S.String,
    timePeriod: TimePeriod,
    maxResults: S.optional(S.Number),
    orderBy: S.optional(OrderBy),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEnrollmentStatusResponse extends S.Class<UpdateEnrollmentStatusResponse>(
  "UpdateEnrollmentStatusResponse",
)({ status: S.optional(S.String) }) {}
export class UpdatePreferencesResponse extends S.Class<UpdatePreferencesResponse>(
  "UpdatePreferencesResponse",
)({
  savingsEstimationMode: S.optional(S.String),
  memberAccountDiscountVisibility: S.optional(S.String),
  preferredCommitment: S.optional(PreferredCommitment),
}) {}
export class AccountEnrollmentStatus extends S.Class<AccountEnrollmentStatus>(
  "AccountEnrollmentStatus",
)({
  accountId: S.optional(S.String),
  status: S.optional(S.String),
  lastUpdatedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  createdTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const AccountEnrollmentStatuses = S.Array(AccountEnrollmentStatus);
export class RecommendationSummary extends S.Class<RecommendationSummary>(
  "RecommendationSummary",
)({
  group: S.optional(S.String),
  estimatedMonthlySavings: S.optional(S.Number),
  recommendationCount: S.optional(S.Number),
}) {}
export const RecommendationSummariesList = S.Array(RecommendationSummary);
export class SummaryMetricsResult extends S.Class<SummaryMetricsResult>(
  "SummaryMetricsResult",
)({ savingsPercentage: S.optional(S.String) }) {}
export class ListEnrollmentStatusesResponse extends S.Class<ListEnrollmentStatusesResponse>(
  "ListEnrollmentStatusesResponse",
)({
  items: S.optional(AccountEnrollmentStatuses),
  includeMemberAccounts: S.optional(S.Boolean),
  nextToken: S.optional(S.String),
}) {}
export class ListRecommendationsRequest extends S.Class<ListRecommendationsRequest>(
  "ListRecommendationsRequest",
)(
  {
    filter: S.optional(Filter),
    orderBy: S.optional(OrderBy),
    includeAllRecommendations: S.optional(S.Boolean),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRecommendationSummariesResponse extends S.Class<ListRecommendationSummariesResponse>(
  "ListRecommendationSummariesResponse",
)({
  estimatedTotalDedupedSavings: S.optional(S.Number),
  items: S.optional(RecommendationSummariesList),
  groupBy: S.optional(S.String),
  currencyCode: S.optional(S.String),
  metrics: S.optional(SummaryMetricsResult),
  nextToken: S.optional(S.String),
}) {}
export class ComputeConfiguration extends S.Class<ComputeConfiguration>(
  "ComputeConfiguration",
)({
  vCpu: S.optional(S.Number),
  memorySizeInMB: S.optional(S.Number),
  architecture: S.optional(S.String),
  platform: S.optional(S.String),
}) {}
export class EcsServiceConfiguration extends S.Class<EcsServiceConfiguration>(
  "EcsServiceConfiguration",
)({ compute: S.optional(ComputeConfiguration) }) {}
export class Ec2ReservedInstancesConfiguration extends S.Class<Ec2ReservedInstancesConfiguration>(
  "Ec2ReservedInstancesConfiguration",
)({
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
}) {}
export class RdsReservedInstancesConfiguration extends S.Class<RdsReservedInstancesConfiguration>(
  "RdsReservedInstancesConfiguration",
)({
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
}) {}
export class ElastiCacheReservedInstancesConfiguration extends S.Class<ElastiCacheReservedInstancesConfiguration>(
  "ElastiCacheReservedInstancesConfiguration",
)({
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
}) {}
export class OpenSearchReservedInstancesConfiguration extends S.Class<OpenSearchReservedInstancesConfiguration>(
  "OpenSearchReservedInstancesConfiguration",
)({
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
}) {}
export class RedshiftReservedInstancesConfiguration extends S.Class<RedshiftReservedInstancesConfiguration>(
  "RedshiftReservedInstancesConfiguration",
)({
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
}) {}
export class Ec2InstanceSavingsPlansConfiguration extends S.Class<Ec2InstanceSavingsPlansConfiguration>(
  "Ec2InstanceSavingsPlansConfiguration",
)({
  accountScope: S.optional(S.String),
  term: S.optional(S.String),
  paymentOption: S.optional(S.String),
  hourlyCommitment: S.optional(S.String),
  instanceFamily: S.optional(S.String),
  savingsPlansRegion: S.optional(S.String),
}) {}
export class ComputeSavingsPlansConfiguration extends S.Class<ComputeSavingsPlansConfiguration>(
  "ComputeSavingsPlansConfiguration",
)({
  accountScope: S.optional(S.String),
  term: S.optional(S.String),
  paymentOption: S.optional(S.String),
  hourlyCommitment: S.optional(S.String),
}) {}
export class SageMakerSavingsPlansConfiguration extends S.Class<SageMakerSavingsPlansConfiguration>(
  "SageMakerSavingsPlansConfiguration",
)({
  accountScope: S.optional(S.String),
  term: S.optional(S.String),
  paymentOption: S.optional(S.String),
  hourlyCommitment: S.optional(S.String),
}) {}
export class RdsDbInstanceStorageConfiguration extends S.Class<RdsDbInstanceStorageConfiguration>(
  "RdsDbInstanceStorageConfiguration",
)({
  storageType: S.optional(S.String),
  allocatedStorageInGb: S.optional(S.Number),
  iops: S.optional(S.Number),
  storageThroughput: S.optional(S.Number),
}) {}
export class AuroraDbClusterStorageConfiguration extends S.Class<AuroraDbClusterStorageConfiguration>(
  "AuroraDbClusterStorageConfiguration",
)({ storageType: S.optional(S.String) }) {}
export class DynamoDbReservedCapacityConfiguration extends S.Class<DynamoDbReservedCapacityConfiguration>(
  "DynamoDbReservedCapacityConfiguration",
)({
  accountScope: S.optional(S.String),
  service: S.optional(S.String),
  term: S.optional(S.String),
  paymentOption: S.optional(S.String),
  reservedInstancesRegion: S.optional(S.String),
  upfrontCost: S.optional(S.String),
  monthlyRecurringCost: S.optional(S.String),
  numberOfCapacityUnitsToPurchase: S.optional(S.String),
  capacityUnits: S.optional(S.String),
}) {}
export class MemoryDbReservedInstancesConfiguration extends S.Class<MemoryDbReservedInstancesConfiguration>(
  "MemoryDbReservedInstancesConfiguration",
)({
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
}) {}
export class NatGatewayConfiguration extends S.Class<NatGatewayConfiguration>(
  "NatGatewayConfiguration",
)({
  activeConnectionCount: S.optional(S.Number),
  packetsInFromSource: S.optional(S.Number),
  packetsInFromDestination: S.optional(S.Number),
}) {}
export class Usage extends S.Class<Usage>("Usage")({
  usageType: S.optional(S.String),
  usageAmount: S.optional(S.Number),
  operation: S.optional(S.String),
  productCode: S.optional(S.String),
  unit: S.optional(S.String),
}) {}
export const UsageList = S.Array(Usage);
export class EstimatedDiscounts extends S.Class<EstimatedDiscounts>(
  "EstimatedDiscounts",
)({
  savingsPlansDiscount: S.optional(S.Number),
  reservedInstancesDiscount: S.optional(S.Number),
  otherDiscount: S.optional(S.Number),
}) {}
export class ResourcePricing extends S.Class<ResourcePricing>(
  "ResourcePricing",
)({
  estimatedCostBeforeDiscounts: S.optional(S.Number),
  estimatedNetUnusedAmortizedCommitments: S.optional(S.Number),
  estimatedDiscounts: S.optional(EstimatedDiscounts),
  estimatedCostAfterDiscounts: S.optional(S.Number),
}) {}
export class ResourceCostCalculation extends S.Class<ResourceCostCalculation>(
  "ResourceCostCalculation",
)({ usages: S.optional(UsageList), pricing: S.optional(ResourcePricing) }) {}
export class EcsService extends S.Class<EcsService>("EcsService")({
  configuration: S.optional(EcsServiceConfiguration),
  costCalculation: S.optional(ResourceCostCalculation),
}) {}
export class ReservedInstancesPricing extends S.Class<ReservedInstancesPricing>(
  "ReservedInstancesPricing",
)({
  estimatedOnDemandCost: S.optional(S.Number),
  monthlyReservationEligibleCost: S.optional(S.Number),
  savingsPercentage: S.optional(S.Number),
  estimatedMonthlyAmortizedReservationCost: S.optional(S.Number),
}) {}
export class ReservedInstancesCostCalculation extends S.Class<ReservedInstancesCostCalculation>(
  "ReservedInstancesCostCalculation",
)({ pricing: S.optional(ReservedInstancesPricing) }) {}
export class RdsReservedInstances extends S.Class<RdsReservedInstances>(
  "RdsReservedInstances",
)({
  configuration: S.optional(RdsReservedInstancesConfiguration),
  costCalculation: S.optional(ReservedInstancesCostCalculation),
}) {}
export class ElastiCacheReservedInstances extends S.Class<ElastiCacheReservedInstances>(
  "ElastiCacheReservedInstances",
)({
  configuration: S.optional(ElastiCacheReservedInstancesConfiguration),
  costCalculation: S.optional(ReservedInstancesCostCalculation),
}) {}
export class OpenSearchReservedInstances extends S.Class<OpenSearchReservedInstances>(
  "OpenSearchReservedInstances",
)({
  configuration: S.optional(OpenSearchReservedInstancesConfiguration),
  costCalculation: S.optional(ReservedInstancesCostCalculation),
}) {}
export class RedshiftReservedInstances extends S.Class<RedshiftReservedInstances>(
  "RedshiftReservedInstances",
)({
  configuration: S.optional(RedshiftReservedInstancesConfiguration),
  costCalculation: S.optional(ReservedInstancesCostCalculation),
}) {}
export class SavingsPlansPricing extends S.Class<SavingsPlansPricing>(
  "SavingsPlansPricing",
)({
  monthlySavingsPlansEligibleCost: S.optional(S.Number),
  estimatedMonthlyCommitment: S.optional(S.Number),
  savingsPercentage: S.optional(S.Number),
  estimatedOnDemandCost: S.optional(S.Number),
}) {}
export class SavingsPlansCostCalculation extends S.Class<SavingsPlansCostCalculation>(
  "SavingsPlansCostCalculation",
)({ pricing: S.optional(SavingsPlansPricing) }) {}
export class ComputeSavingsPlans extends S.Class<ComputeSavingsPlans>(
  "ComputeSavingsPlans",
)({
  configuration: S.optional(ComputeSavingsPlansConfiguration),
  costCalculation: S.optional(SavingsPlansCostCalculation),
}) {}
export class SageMakerSavingsPlans extends S.Class<SageMakerSavingsPlans>(
  "SageMakerSavingsPlans",
)({
  configuration: S.optional(SageMakerSavingsPlansConfiguration),
  costCalculation: S.optional(SavingsPlansCostCalculation),
}) {}
export class RdsDbInstanceStorage extends S.Class<RdsDbInstanceStorage>(
  "RdsDbInstanceStorage",
)({
  configuration: S.optional(RdsDbInstanceStorageConfiguration),
  costCalculation: S.optional(ResourceCostCalculation),
}) {}
export class AuroraDbClusterStorage extends S.Class<AuroraDbClusterStorage>(
  "AuroraDbClusterStorage",
)({
  configuration: S.optional(AuroraDbClusterStorageConfiguration),
  costCalculation: S.optional(ResourceCostCalculation),
}) {}
export class DynamoDbReservedCapacity extends S.Class<DynamoDbReservedCapacity>(
  "DynamoDbReservedCapacity",
)({
  configuration: S.optional(DynamoDbReservedCapacityConfiguration),
  costCalculation: S.optional(ReservedInstancesCostCalculation),
}) {}
export class MemoryDbReservedInstances extends S.Class<MemoryDbReservedInstances>(
  "MemoryDbReservedInstances",
)({
  configuration: S.optional(MemoryDbReservedInstancesConfiguration),
  costCalculation: S.optional(ReservedInstancesCostCalculation),
}) {}
export class NatGateway extends S.Class<NatGateway>("NatGateway")({
  configuration: S.optional(NatGatewayConfiguration),
  costCalculation: S.optional(ResourceCostCalculation),
}) {}
export class MetricsByTime extends S.Class<MetricsByTime>("MetricsByTime")({
  score: S.optional(S.Number),
  savings: S.optional(S.Number),
  spend: S.optional(S.Number),
  timestamp: S.optional(S.String),
}) {}
export const MetricsByTimeList = S.Array(MetricsByTime);
export class InstanceConfiguration extends S.Class<InstanceConfiguration>(
  "InstanceConfiguration",
)({ type: S.optional(S.String) }) {}
export class StorageConfiguration extends S.Class<StorageConfiguration>(
  "StorageConfiguration",
)({ type: S.optional(S.String), sizeInGb: S.optional(S.Number) }) {}
export class BlockStoragePerformanceConfiguration extends S.Class<BlockStoragePerformanceConfiguration>(
  "BlockStoragePerformanceConfiguration",
)({ iops: S.optional(S.Number), throughput: S.optional(S.Number) }) {}
export class MixedInstanceConfiguration extends S.Class<MixedInstanceConfiguration>(
  "MixedInstanceConfiguration",
)({ type: S.optional(S.String) }) {}
export const MixedInstanceConfigurationList = S.Array(
  MixedInstanceConfiguration,
);
export class DbInstanceConfiguration extends S.Class<DbInstanceConfiguration>(
  "DbInstanceConfiguration",
)({ dbInstanceClass: S.optional(S.String) }) {}
export class ValidationExceptionDetail extends S.Class<ValidationExceptionDetail>(
  "ValidationExceptionDetail",
)({ fieldName: S.String, message: S.String }) {}
export const ValidationExceptionDetails = S.Array(ValidationExceptionDetail);
export class EfficiencyMetricsByGroup extends S.Class<EfficiencyMetricsByGroup>(
  "EfficiencyMetricsByGroup",
)({
  metricsByTime: S.optional(MetricsByTimeList),
  group: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const EfficiencyMetricsByGroupList = S.Array(EfficiencyMetricsByGroup);
export class Recommendation extends S.Class<Recommendation>("Recommendation")({
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
}) {}
export const RecommendationList = S.Array(Recommendation);
export class LambdaFunctionConfiguration extends S.Class<LambdaFunctionConfiguration>(
  "LambdaFunctionConfiguration",
)({ compute: S.optional(ComputeConfiguration) }) {}
export class Ec2InstanceConfiguration extends S.Class<Ec2InstanceConfiguration>(
  "Ec2InstanceConfiguration",
)({ instance: S.optional(InstanceConfiguration) }) {}
export class EbsVolumeConfiguration extends S.Class<EbsVolumeConfiguration>(
  "EbsVolumeConfiguration",
)({
  storage: S.optional(StorageConfiguration),
  performance: S.optional(BlockStoragePerformanceConfiguration),
  attachmentState: S.optional(S.String),
}) {}
export class Ec2AutoScalingGroupConfiguration extends S.Class<Ec2AutoScalingGroupConfiguration>(
  "Ec2AutoScalingGroupConfiguration",
)({
  instance: S.optional(InstanceConfiguration),
  mixedInstances: S.optional(MixedInstanceConfigurationList),
  type: S.optional(S.String),
  allocationStrategy: S.optional(S.String),
}) {}
export class RdsDbInstanceConfiguration extends S.Class<RdsDbInstanceConfiguration>(
  "RdsDbInstanceConfiguration",
)({ instance: S.optional(DbInstanceConfiguration) }) {}
export class ListEfficiencyMetricsResponse extends S.Class<ListEfficiencyMetricsResponse>(
  "ListEfficiencyMetricsResponse",
)({
  efficiencyMetricsByGroup: S.optional(EfficiencyMetricsByGroupList),
  nextToken: S.optional(S.String),
}) {}
export class ListRecommendationsResponse extends S.Class<ListRecommendationsResponse>(
  "ListRecommendationsResponse",
)({ items: S.optional(RecommendationList), nextToken: S.optional(S.String) }) {}
export class Ec2Instance extends S.Class<Ec2Instance>("Ec2Instance")({
  configuration: S.optional(Ec2InstanceConfiguration),
  costCalculation: S.optional(ResourceCostCalculation),
}) {}
export class EbsVolume extends S.Class<EbsVolume>("EbsVolume")({
  configuration: S.optional(EbsVolumeConfiguration),
  costCalculation: S.optional(ResourceCostCalculation),
}) {}
export class Ec2AutoScalingGroup extends S.Class<Ec2AutoScalingGroup>(
  "Ec2AutoScalingGroup",
)({
  configuration: S.optional(Ec2AutoScalingGroupConfiguration),
  costCalculation: S.optional(ResourceCostCalculation),
}) {}
export class Ec2ReservedInstances extends S.Class<Ec2ReservedInstances>(
  "Ec2ReservedInstances",
)({
  configuration: S.optional(Ec2ReservedInstancesConfiguration),
  costCalculation: S.optional(ReservedInstancesCostCalculation),
}) {}
export class Ec2InstanceSavingsPlans extends S.Class<Ec2InstanceSavingsPlans>(
  "Ec2InstanceSavingsPlans",
)({
  configuration: S.optional(Ec2InstanceSavingsPlansConfiguration),
  costCalculation: S.optional(SavingsPlansCostCalculation),
}) {}
export class RdsDbInstance extends S.Class<RdsDbInstance>("RdsDbInstance")({
  configuration: S.optional(RdsDbInstanceConfiguration),
  costCalculation: S.optional(ResourceCostCalculation),
}) {}
export class LambdaFunction extends S.Class<LambdaFunction>("LambdaFunction")({
  configuration: S.optional(LambdaFunctionConfiguration),
  costCalculation: S.optional(ResourceCostCalculation),
}) {}
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
export class GetRecommendationResponse extends S.Class<GetRecommendationResponse>(
  "GetRecommendationResponse",
)({
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
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
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
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String },
) {}

//# Operations
/**
 * Retrieves the enrollment status for an account. It can also return the list of accounts that are enrolled under the organization.
 */
export const listEnrollmentStatuses = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListEnrollmentStatusesRequest,
    output: ListEnrollmentStatusesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a concise representation of savings estimates for resources. Also returns de-duped savings across different types of recommendations.
 *
 * The following filters are not supported for this API: `recommendationIds`, `resourceArns`, and `resourceIds`.
 */
export const listRecommendationSummaries = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListRecommendationSummariesRequest,
    output: ListRecommendationSummariesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates the enrollment (opt in and opt out) status of an account to the Cost Optimization Hub service.
 *
 * If the account is a management account of an organization, this action can also be used to enroll member accounts of the organization.
 *
 * You must have the appropriate permissions to opt in to Cost Optimization Hub and to view its recommendations. When you opt in, Cost Optimization Hub automatically creates a service-linked role in your account to access its data.
 */
export const updateEnrollmentStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEnrollmentStatusRequest,
    output: UpdateEnrollmentStatusResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a set of preferences for an account in order to add account-specific preferences into the service. These preferences impact how the savings associated with recommendations are presented.
 */
export const updatePreferences = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a set of preferences for an account in order to add account-specific preferences into the service. These preferences impact how the savings associated with recommendations are presented—estimated savings after discounts or estimated savings before discounts, for example.
 */
export const getPreferences = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listEfficiencyMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListEfficiencyMetricsRequest,
    output: ListEfficiencyMetricsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of recommendations.
 */
export const listRecommendations = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRecommendationsRequest,
  output: ListRecommendationsResponse,
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
