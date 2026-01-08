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
  sdkId: "Cost Explorer",
  serviceShapeName: "AWSInsightsIndexService",
});
const auth = T.AwsAuthSigv4({ name: "ce" });
const ver = T.ServiceVersion("2017-10-25");
const proto = T.AwsProtocolsAwsJson1_1();
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
    authSchemes: [{ name: "sigv4", signingRegion: "eusc-de-east-1" }],
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
          return e(
            "https://ce.us-east-1.api.aws",
            { authSchemes: [{ name: "sigv4", signingRegion: "us-east-1" }] },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-cn" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            "https://ce.cn-northwest-1.api.amazonwebservices.com.cn",
            {
              authSchemes: [{ name: "sigv4", signingRegion: "cn-northwest-1" }],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://ce.us-iso-east-1.c2s.ic.gov",
            {
              authSchemes: [{ name: "sigv4", signingRegion: "us-iso-east-1" }],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-b" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://ce.us-isob-east-1.sc2s.sgov.gov",
            {
              authSchemes: [{ name: "sigv4", signingRegion: "us-isob-east-1" }],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-e" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://ce.eu-isoe-west-1.cloud.adc-e.uk",
            {
              authSchemes: [{ name: "sigv4", signingRegion: "eu-isoe-west-1" }],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-iso-f" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://ce.us-isof-south-1.csp.hci.ic.gov",
            {
              authSchemes: [
                { name: "sigv4", signingRegion: "us-isof-south-1" },
              ],
            },
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === false &&
          UseDualStack === true
        ) {
          return e(
            "https://ce.eusc-de-east-1.api.amazonwebservices.eu",
            _p0(),
            {},
          );
        }
        if (
          _.getAttr(PartitionResult, "name") === "aws-eusc" &&
          UseFIPS === false &&
          UseDualStack === false
        ) {
          return e(
            "https://ce.eusc-de-east-1.api.amazonwebservices.eu",
            _p0(),
            {},
          );
        }
        if (UseFIPS === true && UseDualStack === true) {
          if (
            true === _.getAttr(PartitionResult, "supportsFIPS") &&
            true === _.getAttr(PartitionResult, "supportsDualStack")
          ) {
            return e(
              `https://ce-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
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
              `https://ce-fips.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
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
              `https://ce.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              _p1(PartitionResult),
              {},
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ce.${_.getAttr(PartitionResult, "implicitGlobalRegion")}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
          _p1(PartitionResult),
          {},
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CostCategoryName = string;
export type ZonedDateTime = string;
export type CostCategoryValue = string;
export type Arn = string;
export type NextPageToken = string;
export type PageSize = number;
export type Value = string;
export type AnalysisId = string;
export type MetricName = string;
export type BillingViewArn = string;
export type CostAndUsageComparisonsMaxResults = number;
export type SearchString = string;
export type MaxResults = number;
export type CostComparisonDriversMaxResults = number;
export type PredictionIntervalLevel = number;
export type RecommendationsPageSize = number;
export type RecommendationDetailId = string;
export type TagKey = string;
export type AnalysesPageSize = number;
export type CostAllocationTagsMaxResults = number;
export type CostCategoryMaxResults = number;
export type ResourceType = string;
export type RecommendationId = string;
export type ResourceTagKey = string;
export type NullableNonNegativeDouble = number;
export type YearMonthDay = string;
export type NonNegativeInteger = number;
export type ResourceTagValue = string;
export type GroupDefinitionKey = string;
export type SortDefinitionKey = string;
export type SubscriberAddress = string;
export type ErrorMessage = string;
export type NonNegativeLong = number;
export type Entity = string;
export type AccountId = string;
export type SavingsPlansId = string;
export type Estimated = boolean;
export type MetricAmount = string;
export type MetricUnit = string;
export type UtilizationPercentage = string;
export type UtilizationPercentageInUnits = string;
export type PurchasedHours = string;
export type PurchasedUnits = string;
export type TotalActualHours = string;
export type TotalActualUnits = string;
export type UnusedHours = string;
export type UnusedUnits = string;
export type OnDemandCostOfRIHoursUsed = string;
export type NetRISavings = string;
export type TotalPotentialRISavings = string;
export type AmortizedUpfrontFee = string;
export type AmortizedRecurringFee = string;
export type TotalAmortizedFee = string;
export type RICostForUnusedHours = string;
export type RealizedSavings = string;
export type UnrealizedSavings = string;
export type SavingsPlanArn = string;
export type GenericArn = string;
export type SavingsPlansCommitment = number;
export type Key = string;
export type AttributeType = string;
export type AttributeValue = string;
export type OnDemandHours = string;
export type ReservedHours = string;
export type TotalRunningHours = string;
export type CoverageHoursPercentage = string;
export type OnDemandNormalizedUnits = string;
export type ReservedNormalizedUnits = string;
export type TotalRunningNormalizedUnits = string;
export type CoverageNormalizedUnitsPercentage = string;
export type OnDemandCost = string;
export type ReservationGroupKey = string;
export type ReservationGroupValue = string;

//# Schemas
export interface StartSavingsPlansPurchaseRecommendationGenerationRequest {}
export const StartSavingsPlansPurchaseRecommendationGenerationRequest =
  S.suspend(() =>
    S.Struct({}).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
  ).annotations({
    identifier: "StartSavingsPlansPurchaseRecommendationGenerationRequest",
  }) as any as S.Schema<StartSavingsPlansPurchaseRecommendationGenerationRequest>;
export type CostCategoryRuleVersion = "CostCategoryExpression.v1";
export const CostCategoryRuleVersion = S.Literal("CostCategoryExpression.v1");
export type AnomalyFeedbackType = "YES" | "NO" | "PLANNED_ACTIVITY";
export const AnomalyFeedbackType = S.Literal("YES", "NO", "PLANNED_ACTIVITY");
export type Values = string[];
export const Values = S.Array(S.String);
export type Granularity = "DAILY" | "MONTHLY" | "HOURLY";
export const Granularity = S.Literal("DAILY", "MONTHLY", "HOURLY");
export type UsageServices = string[];
export const UsageServices = S.Array(S.String);
export type ApproximationDimension = "SERVICE" | "RESOURCE";
export const ApproximationDimension = S.Literal("SERVICE", "RESOURCE");
export type MetricNames = string[];
export const MetricNames = S.Array(S.String);
export type Metric =
  | "BLENDED_COST"
  | "UNBLENDED_COST"
  | "AMORTIZED_COST"
  | "NET_UNBLENDED_COST"
  | "NET_AMORTIZED_COST"
  | "USAGE_QUANTITY"
  | "NORMALIZED_USAGE_AMOUNT";
export const Metric = S.Literal(
  "BLENDED_COST",
  "UNBLENDED_COST",
  "AMORTIZED_COST",
  "NET_UNBLENDED_COST",
  "NET_AMORTIZED_COST",
  "USAGE_QUANTITY",
  "NORMALIZED_USAGE_AMOUNT",
);
export type Dimension =
  | "AZ"
  | "INSTANCE_TYPE"
  | "LINKED_ACCOUNT"
  | "PAYER_ACCOUNT"
  | "LINKED_ACCOUNT_NAME"
  | "OPERATION"
  | "PURCHASE_TYPE"
  | "REGION"
  | "SERVICE"
  | "SERVICE_CODE"
  | "USAGE_TYPE"
  | "USAGE_TYPE_GROUP"
  | "RECORD_TYPE"
  | "OPERATING_SYSTEM"
  | "TENANCY"
  | "SCOPE"
  | "PLATFORM"
  | "SUBSCRIPTION_ID"
  | "LEGAL_ENTITY_NAME"
  | "DEPLOYMENT_OPTION"
  | "DATABASE_ENGINE"
  | "CACHE_ENGINE"
  | "INSTANCE_TYPE_FAMILY"
  | "BILLING_ENTITY"
  | "RESERVATION_ID"
  | "RESOURCE_ID"
  | "RIGHTSIZING_TYPE"
  | "SAVINGS_PLANS_TYPE"
  | "SAVINGS_PLAN_ARN"
  | "PAYMENT_OPTION"
  | "AGREEMENT_END_DATE_TIME_AFTER"
  | "AGREEMENT_END_DATE_TIME_BEFORE"
  | "INVOICING_ENTITY"
  | "ANOMALY_TOTAL_IMPACT_ABSOLUTE"
  | "ANOMALY_TOTAL_IMPACT_PERCENTAGE";
export const Dimension = S.Literal(
  "AZ",
  "INSTANCE_TYPE",
  "LINKED_ACCOUNT",
  "PAYER_ACCOUNT",
  "LINKED_ACCOUNT_NAME",
  "OPERATION",
  "PURCHASE_TYPE",
  "REGION",
  "SERVICE",
  "SERVICE_CODE",
  "USAGE_TYPE",
  "USAGE_TYPE_GROUP",
  "RECORD_TYPE",
  "OPERATING_SYSTEM",
  "TENANCY",
  "SCOPE",
  "PLATFORM",
  "SUBSCRIPTION_ID",
  "LEGAL_ENTITY_NAME",
  "DEPLOYMENT_OPTION",
  "DATABASE_ENGINE",
  "CACHE_ENGINE",
  "INSTANCE_TYPE_FAMILY",
  "BILLING_ENTITY",
  "RESERVATION_ID",
  "RESOURCE_ID",
  "RIGHTSIZING_TYPE",
  "SAVINGS_PLANS_TYPE",
  "SAVINGS_PLAN_ARN",
  "PAYMENT_OPTION",
  "AGREEMENT_END_DATE_TIME_AFTER",
  "AGREEMENT_END_DATE_TIME_BEFORE",
  "INVOICING_ENTITY",
  "ANOMALY_TOTAL_IMPACT_ABSOLUTE",
  "ANOMALY_TOTAL_IMPACT_PERCENTAGE",
);
export type Context = "COST_AND_USAGE" | "RESERVATIONS" | "SAVINGS_PLANS";
export const Context = S.Literal(
  "COST_AND_USAGE",
  "RESERVATIONS",
  "SAVINGS_PLANS",
);
export type AccountScope = "PAYER" | "LINKED";
export const AccountScope = S.Literal("PAYER", "LINKED");
export type LookbackPeriodInDays = "SEVEN_DAYS" | "THIRTY_DAYS" | "SIXTY_DAYS";
export const LookbackPeriodInDays = S.Literal(
  "SEVEN_DAYS",
  "THIRTY_DAYS",
  "SIXTY_DAYS",
);
export type TermInYears = "ONE_YEAR" | "THREE_YEARS";
export const TermInYears = S.Literal("ONE_YEAR", "THREE_YEARS");
export type PaymentOption =
  | "NO_UPFRONT"
  | "PARTIAL_UPFRONT"
  | "ALL_UPFRONT"
  | "LIGHT_UTILIZATION"
  | "MEDIUM_UTILIZATION"
  | "HEAVY_UTILIZATION";
export const PaymentOption = S.Literal(
  "NO_UPFRONT",
  "PARTIAL_UPFRONT",
  "ALL_UPFRONT",
  "LIGHT_UTILIZATION",
  "MEDIUM_UTILIZATION",
  "HEAVY_UTILIZATION",
);
export type SupportedSavingsPlansType =
  | "COMPUTE_SP"
  | "EC2_INSTANCE_SP"
  | "SAGEMAKER_SP"
  | "DATABASE_SP";
export const SupportedSavingsPlansType = S.Literal(
  "COMPUTE_SP",
  "EC2_INSTANCE_SP",
  "SAGEMAKER_SP",
  "DATABASE_SP",
);
export type SavingsPlansDataType =
  | "ATTRIBUTES"
  | "UTILIZATION"
  | "AMORTIZED_COMMITMENT"
  | "SAVINGS";
export const SavingsPlansDataType = S.Literal(
  "ATTRIBUTES",
  "UTILIZATION",
  "AMORTIZED_COMMITMENT",
  "SAVINGS",
);
export type SavingsPlansDataTypes = SavingsPlansDataType[];
export const SavingsPlansDataTypes = S.Array(SavingsPlansDataType);
export type AnalysisStatus = "SUCCEEDED" | "PROCESSING" | "FAILED";
export const AnalysisStatus = S.Literal("SUCCEEDED", "PROCESSING", "FAILED");
export type AnalysisIds = string[];
export const AnalysisIds = S.Array(S.String);
export type CostAllocationTagStatus = "Active" | "Inactive";
export const CostAllocationTagStatus = S.Literal("Active", "Inactive");
export type CostAllocationTagKeyList = string[];
export const CostAllocationTagKeyList = S.Array(S.String);
export type CostAllocationTagType = "AWSGenerated" | "UserDefined";
export const CostAllocationTagType = S.Literal("AWSGenerated", "UserDefined");
export type ResourceTypesFilterInput = string[];
export const ResourceTypesFilterInput = S.Array(S.String);
export type GenerationStatus = "SUCCEEDED" | "PROCESSING" | "FAILED";
export const GenerationStatus = S.Literal("SUCCEEDED", "PROCESSING", "FAILED");
export type RecommendationIdList = string[];
export const RecommendationIdList = S.Array(S.String);
export type ResourceTagKeyList = string[];
export const ResourceTagKeyList = S.Array(S.String);
export type AnomalySubscriptionFrequency = "DAILY" | "IMMEDIATE" | "WEEKLY";
export const AnomalySubscriptionFrequency = S.Literal(
  "DAILY",
  "IMMEDIATE",
  "WEEKLY",
);
export type MonitorArnList = string[];
export const MonitorArnList = S.Array(S.String);
export interface DeleteAnomalyMonitorRequest {
  MonitorArn: string;
}
export const DeleteAnomalyMonitorRequest = S.suspend(() =>
  S.Struct({ MonitorArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAnomalyMonitorRequest",
}) as any as S.Schema<DeleteAnomalyMonitorRequest>;
export interface DeleteAnomalyMonitorResponse {}
export const DeleteAnomalyMonitorResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAnomalyMonitorResponse",
}) as any as S.Schema<DeleteAnomalyMonitorResponse>;
export interface DeleteAnomalySubscriptionRequest {
  SubscriptionArn: string;
}
export const DeleteAnomalySubscriptionRequest = S.suspend(() =>
  S.Struct({ SubscriptionArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteAnomalySubscriptionRequest",
}) as any as S.Schema<DeleteAnomalySubscriptionRequest>;
export interface DeleteAnomalySubscriptionResponse {}
export const DeleteAnomalySubscriptionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteAnomalySubscriptionResponse",
}) as any as S.Schema<DeleteAnomalySubscriptionResponse>;
export interface DeleteCostCategoryDefinitionRequest {
  CostCategoryArn: string;
}
export const DeleteCostCategoryDefinitionRequest = S.suspend(() =>
  S.Struct({ CostCategoryArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCostCategoryDefinitionRequest",
}) as any as S.Schema<DeleteCostCategoryDefinitionRequest>;
export interface DescribeCostCategoryDefinitionRequest {
  CostCategoryArn: string;
  EffectiveOn?: string;
}
export const DescribeCostCategoryDefinitionRequest = S.suspend(() =>
  S.Struct({
    CostCategoryArn: S.String,
    EffectiveOn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeCostCategoryDefinitionRequest",
}) as any as S.Schema<DescribeCostCategoryDefinitionRequest>;
export interface GetAnomalyMonitorsRequest {
  MonitorArnList?: string[];
  NextPageToken?: string;
  MaxResults?: number;
}
export const GetAnomalyMonitorsRequest = S.suspend(() =>
  S.Struct({
    MonitorArnList: S.optional(Values),
    NextPageToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAnomalyMonitorsRequest",
}) as any as S.Schema<GetAnomalyMonitorsRequest>;
export interface GetAnomalySubscriptionsRequest {
  SubscriptionArnList?: string[];
  MonitorArn?: string;
  NextPageToken?: string;
  MaxResults?: number;
}
export const GetAnomalySubscriptionsRequest = S.suspend(() =>
  S.Struct({
    SubscriptionArnList: S.optional(Values),
    MonitorArn: S.optional(S.String),
    NextPageToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAnomalySubscriptionsRequest",
}) as any as S.Schema<GetAnomalySubscriptionsRequest>;
export interface GetApproximateUsageRecordsRequest {
  Granularity: Granularity;
  Services?: string[];
  ApproximationDimension: ApproximationDimension;
}
export const GetApproximateUsageRecordsRequest = S.suspend(() =>
  S.Struct({
    Granularity: Granularity,
    Services: S.optional(UsageServices),
    ApproximationDimension: ApproximationDimension,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetApproximateUsageRecordsRequest",
}) as any as S.Schema<GetApproximateUsageRecordsRequest>;
export interface GetCommitmentPurchaseAnalysisRequest {
  AnalysisId: string;
}
export const GetCommitmentPurchaseAnalysisRequest = S.suspend(() =>
  S.Struct({ AnalysisId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCommitmentPurchaseAnalysisRequest",
}) as any as S.Schema<GetCommitmentPurchaseAnalysisRequest>;
export interface DateInterval {
  Start: string;
  End: string;
}
export const DateInterval = S.suspend(() =>
  S.Struct({ Start: S.String, End: S.String }),
).annotations({ identifier: "DateInterval" }) as any as S.Schema<DateInterval>;
export type MatchOption =
  | "EQUALS"
  | "ABSENT"
  | "STARTS_WITH"
  | "ENDS_WITH"
  | "CONTAINS"
  | "CASE_SENSITIVE"
  | "CASE_INSENSITIVE"
  | "GREATER_THAN_OR_EQUAL";
export const MatchOption = S.Literal(
  "EQUALS",
  "ABSENT",
  "STARTS_WITH",
  "ENDS_WITH",
  "CONTAINS",
  "CASE_SENSITIVE",
  "CASE_INSENSITIVE",
  "GREATER_THAN_OR_EQUAL",
);
export type MatchOptions = MatchOption[];
export const MatchOptions = S.Array(MatchOption);
export interface DimensionValues {
  Key?: Dimension;
  Values?: string[];
  MatchOptions?: MatchOption[];
}
export const DimensionValues = S.suspend(() =>
  S.Struct({
    Key: S.optional(Dimension),
    Values: S.optional(Values),
    MatchOptions: S.optional(MatchOptions),
  }),
).annotations({
  identifier: "DimensionValues",
}) as any as S.Schema<DimensionValues>;
export interface TagValues {
  Key?: string;
  Values?: string[];
  MatchOptions?: MatchOption[];
}
export const TagValues = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Values: S.optional(Values),
    MatchOptions: S.optional(MatchOptions),
  }),
).annotations({ identifier: "TagValues" }) as any as S.Schema<TagValues>;
export interface CostCategoryValues {
  Key?: string;
  Values?: string[];
  MatchOptions?: MatchOption[];
}
export const CostCategoryValues = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Values: S.optional(Values),
    MatchOptions: S.optional(MatchOptions),
  }),
).annotations({
  identifier: "CostCategoryValues",
}) as any as S.Schema<CostCategoryValues>;
export interface Expression {
  Or?: Expression[];
  And?: Expression[];
  Not?: Expression;
  Dimensions?: DimensionValues;
  Tags?: TagValues;
  CostCategories?: CostCategoryValues;
}
export const Expression = S.suspend(() =>
  S.Struct({
    Or: S.optional(
      S.suspend(() => Expressions).annotations({ identifier: "Expressions" }),
    ),
    And: S.optional(
      S.suspend(() => Expressions).annotations({ identifier: "Expressions" }),
    ),
    Not: S.optional(
      S.suspend((): S.Schema<Expression, any> => Expression).annotations({
        identifier: "Expression",
      }),
    ),
    Dimensions: S.optional(DimensionValues),
    Tags: S.optional(TagValues),
    CostCategories: S.optional(CostCategoryValues),
  }),
).annotations({ identifier: "Expression" }) as any as S.Schema<Expression>;
export type GroupDefinitionType = "DIMENSION" | "TAG" | "COST_CATEGORY";
export const GroupDefinitionType = S.Literal(
  "DIMENSION",
  "TAG",
  "COST_CATEGORY",
);
export interface GroupDefinition {
  Type?: GroupDefinitionType;
  Key?: string;
}
export const GroupDefinition = S.suspend(() =>
  S.Struct({
    Type: S.optional(GroupDefinitionType),
    Key: S.optional(S.String),
  }),
).annotations({
  identifier: "GroupDefinition",
}) as any as S.Schema<GroupDefinition>;
export type GroupDefinitions = GroupDefinition[];
export const GroupDefinitions = S.Array(GroupDefinition);
export interface GetCostAndUsageComparisonsRequest {
  BillingViewArn?: string;
  BaselineTimePeriod: DateInterval;
  ComparisonTimePeriod: DateInterval;
  MetricForComparison: string;
  Filter?: Expression;
  GroupBy?: GroupDefinition[];
  MaxResults?: number;
  NextPageToken?: string;
}
export const GetCostAndUsageComparisonsRequest = S.suspend(() =>
  S.Struct({
    BillingViewArn: S.optional(S.String),
    BaselineTimePeriod: DateInterval,
    ComparisonTimePeriod: DateInterval,
    MetricForComparison: S.String,
    Filter: S.optional(Expression),
    GroupBy: S.optional(GroupDefinitions),
    MaxResults: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCostAndUsageComparisonsRequest",
}) as any as S.Schema<GetCostAndUsageComparisonsRequest>;
export interface GetCostAndUsageWithResourcesRequest {
  TimePeriod: DateInterval;
  Granularity: Granularity;
  Filter: Expression;
  Metrics?: string[];
  GroupBy?: GroupDefinition[];
  BillingViewArn?: string;
  NextPageToken?: string;
}
export const GetCostAndUsageWithResourcesRequest = S.suspend(() =>
  S.Struct({
    TimePeriod: DateInterval,
    Granularity: Granularity,
    Filter: Expression,
    Metrics: S.optional(MetricNames),
    GroupBy: S.optional(GroupDefinitions),
    BillingViewArn: S.optional(S.String),
    NextPageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCostAndUsageWithResourcesRequest",
}) as any as S.Schema<GetCostAndUsageWithResourcesRequest>;
export interface GetCostComparisonDriversRequest {
  BillingViewArn?: string;
  BaselineTimePeriod: DateInterval;
  ComparisonTimePeriod: DateInterval;
  MetricForComparison: string;
  Filter?: Expression;
  GroupBy?: GroupDefinition[];
  MaxResults?: number;
  NextPageToken?: string;
}
export const GetCostComparisonDriversRequest = S.suspend(() =>
  S.Struct({
    BillingViewArn: S.optional(S.String),
    BaselineTimePeriod: DateInterval,
    ComparisonTimePeriod: DateInterval,
    MetricForComparison: S.String,
    Filter: S.optional(Expression),
    GroupBy: S.optional(GroupDefinitions),
    MaxResults: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCostComparisonDriversRequest",
}) as any as S.Schema<GetCostComparisonDriversRequest>;
export interface GetCostForecastRequest {
  TimePeriod: DateInterval;
  Metric: Metric;
  Granularity: Granularity;
  Filter?: Expression;
  BillingViewArn?: string;
  PredictionIntervalLevel?: number;
}
export const GetCostForecastRequest = S.suspend(() =>
  S.Struct({
    TimePeriod: DateInterval,
    Metric: Metric,
    Granularity: Granularity,
    Filter: S.optional(Expression),
    BillingViewArn: S.optional(S.String),
    PredictionIntervalLevel: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCostForecastRequest",
}) as any as S.Schema<GetCostForecastRequest>;
export type SortOrder = "ASCENDING" | "DESCENDING";
export const SortOrder = S.Literal("ASCENDING", "DESCENDING");
export interface SortDefinition {
  Key: string;
  SortOrder?: SortOrder;
}
export const SortDefinition = S.suspend(() =>
  S.Struct({ Key: S.String, SortOrder: S.optional(SortOrder) }),
).annotations({
  identifier: "SortDefinition",
}) as any as S.Schema<SortDefinition>;
export type SortDefinitions = SortDefinition[];
export const SortDefinitions = S.Array(SortDefinition);
export interface GetDimensionValuesRequest {
  SearchString?: string;
  TimePeriod: DateInterval;
  Dimension: Dimension;
  Context?: Context;
  Filter?: Expression;
  SortBy?: SortDefinition[];
  BillingViewArn?: string;
  MaxResults?: number;
  NextPageToken?: string;
}
export const GetDimensionValuesRequest = S.suspend(() =>
  S.Struct({
    SearchString: S.optional(S.String),
    TimePeriod: DateInterval,
    Dimension: Dimension,
    Context: S.optional(Context),
    Filter: S.optional(Expression),
    SortBy: S.optional(SortDefinitions),
    BillingViewArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDimensionValuesRequest",
}) as any as S.Schema<GetDimensionValuesRequest>;
export interface GetReservationCoverageRequest {
  TimePeriod: DateInterval;
  GroupBy?: GroupDefinition[];
  Granularity?: Granularity;
  Filter?: Expression;
  Metrics?: string[];
  NextPageToken?: string;
  SortBy?: SortDefinition;
  MaxResults?: number;
}
export const GetReservationCoverageRequest = S.suspend(() =>
  S.Struct({
    TimePeriod: DateInterval,
    GroupBy: S.optional(GroupDefinitions),
    Granularity: S.optional(Granularity),
    Filter: S.optional(Expression),
    Metrics: S.optional(MetricNames),
    NextPageToken: S.optional(S.String),
    SortBy: S.optional(SortDefinition),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetReservationCoverageRequest",
}) as any as S.Schema<GetReservationCoverageRequest>;
export interface GetReservationUtilizationRequest {
  TimePeriod: DateInterval;
  GroupBy?: GroupDefinition[];
  Granularity?: Granularity;
  Filter?: Expression;
  SortBy?: SortDefinition;
  NextPageToken?: string;
  MaxResults?: number;
}
export const GetReservationUtilizationRequest = S.suspend(() =>
  S.Struct({
    TimePeriod: DateInterval,
    GroupBy: S.optional(GroupDefinitions),
    Granularity: S.optional(Granularity),
    Filter: S.optional(Expression),
    SortBy: S.optional(SortDefinition),
    NextPageToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetReservationUtilizationRequest",
}) as any as S.Schema<GetReservationUtilizationRequest>;
export interface GetSavingsPlanPurchaseRecommendationDetailsRequest {
  RecommendationDetailId: string;
}
export const GetSavingsPlanPurchaseRecommendationDetailsRequest = S.suspend(
  () =>
    S.Struct({ RecommendationDetailId: S.String }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "GetSavingsPlanPurchaseRecommendationDetailsRequest",
}) as any as S.Schema<GetSavingsPlanPurchaseRecommendationDetailsRequest>;
export interface GetSavingsPlansCoverageRequest {
  TimePeriod: DateInterval;
  GroupBy?: GroupDefinition[];
  Granularity?: Granularity;
  Filter?: Expression;
  Metrics?: string[];
  NextToken?: string;
  MaxResults?: number;
  SortBy?: SortDefinition;
}
export const GetSavingsPlansCoverageRequest = S.suspend(() =>
  S.Struct({
    TimePeriod: DateInterval,
    GroupBy: S.optional(GroupDefinitions),
    Granularity: S.optional(Granularity),
    Filter: S.optional(Expression),
    Metrics: S.optional(MetricNames),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SortBy: S.optional(SortDefinition),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSavingsPlansCoverageRequest",
}) as any as S.Schema<GetSavingsPlansCoverageRequest>;
export interface GetSavingsPlansPurchaseRecommendationRequest {
  SavingsPlansType: SupportedSavingsPlansType;
  TermInYears: TermInYears;
  PaymentOption: PaymentOption;
  AccountScope?: AccountScope;
  NextPageToken?: string;
  PageSize?: number;
  LookbackPeriodInDays: LookbackPeriodInDays;
  Filter?: Expression;
}
export const GetSavingsPlansPurchaseRecommendationRequest = S.suspend(() =>
  S.Struct({
    SavingsPlansType: SupportedSavingsPlansType,
    TermInYears: TermInYears,
    PaymentOption: PaymentOption,
    AccountScope: S.optional(AccountScope),
    NextPageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
    LookbackPeriodInDays: LookbackPeriodInDays,
    Filter: S.optional(Expression),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSavingsPlansPurchaseRecommendationRequest",
}) as any as S.Schema<GetSavingsPlansPurchaseRecommendationRequest>;
export interface GetSavingsPlansUtilizationRequest {
  TimePeriod: DateInterval;
  Granularity?: Granularity;
  Filter?: Expression;
  SortBy?: SortDefinition;
}
export const GetSavingsPlansUtilizationRequest = S.suspend(() =>
  S.Struct({
    TimePeriod: DateInterval,
    Granularity: S.optional(Granularity),
    Filter: S.optional(Expression),
    SortBy: S.optional(SortDefinition),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSavingsPlansUtilizationRequest",
}) as any as S.Schema<GetSavingsPlansUtilizationRequest>;
export interface GetSavingsPlansUtilizationDetailsRequest {
  TimePeriod: DateInterval;
  Filter?: Expression;
  DataType?: SavingsPlansDataType[];
  NextToken?: string;
  MaxResults?: number;
  SortBy?: SortDefinition;
}
export const GetSavingsPlansUtilizationDetailsRequest = S.suspend(() =>
  S.Struct({
    TimePeriod: DateInterval,
    Filter: S.optional(Expression),
    DataType: S.optional(SavingsPlansDataTypes),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SortBy: S.optional(SortDefinition),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSavingsPlansUtilizationDetailsRequest",
}) as any as S.Schema<GetSavingsPlansUtilizationDetailsRequest>;
export interface GetTagsRequest {
  SearchString?: string;
  TimePeriod: DateInterval;
  TagKey?: string;
  Filter?: Expression;
  SortBy?: SortDefinition[];
  BillingViewArn?: string;
  MaxResults?: number;
  NextPageToken?: string;
}
export const GetTagsRequest = S.suspend(() =>
  S.Struct({
    SearchString: S.optional(S.String),
    TimePeriod: DateInterval,
    TagKey: S.optional(S.String),
    Filter: S.optional(Expression),
    SortBy: S.optional(SortDefinitions),
    BillingViewArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTagsRequest",
}) as any as S.Schema<GetTagsRequest>;
export interface GetUsageForecastRequest {
  TimePeriod: DateInterval;
  Metric: Metric;
  Granularity: Granularity;
  Filter?: Expression;
  BillingViewArn?: string;
  PredictionIntervalLevel?: number;
}
export const GetUsageForecastRequest = S.suspend(() =>
  S.Struct({
    TimePeriod: DateInterval,
    Metric: Metric,
    Granularity: Granularity,
    Filter: S.optional(Expression),
    BillingViewArn: S.optional(S.String),
    PredictionIntervalLevel: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetUsageForecastRequest",
}) as any as S.Schema<GetUsageForecastRequest>;
export interface ListCommitmentPurchaseAnalysesRequest {
  AnalysisStatus?: AnalysisStatus;
  NextPageToken?: string;
  PageSize?: number;
  AnalysisIds?: string[];
}
export const ListCommitmentPurchaseAnalysesRequest = S.suspend(() =>
  S.Struct({
    AnalysisStatus: S.optional(AnalysisStatus),
    NextPageToken: S.optional(S.String),
    PageSize: S.optional(S.Number),
    AnalysisIds: S.optional(AnalysisIds),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCommitmentPurchaseAnalysesRequest",
}) as any as S.Schema<ListCommitmentPurchaseAnalysesRequest>;
export interface ListCostAllocationTagBackfillHistoryRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListCostAllocationTagBackfillHistoryRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCostAllocationTagBackfillHistoryRequest",
}) as any as S.Schema<ListCostAllocationTagBackfillHistoryRequest>;
export interface ListCostAllocationTagsRequest {
  Status?: CostAllocationTagStatus;
  TagKeys?: string[];
  Type?: CostAllocationTagType;
  NextToken?: string;
  MaxResults?: number;
}
export const ListCostAllocationTagsRequest = S.suspend(() =>
  S.Struct({
    Status: S.optional(CostAllocationTagStatus),
    TagKeys: S.optional(CostAllocationTagKeyList),
    Type: S.optional(CostAllocationTagType),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCostAllocationTagsRequest",
}) as any as S.Schema<ListCostAllocationTagsRequest>;
export interface ListCostCategoryDefinitionsRequest {
  EffectiveOn?: string;
  NextToken?: string;
  MaxResults?: number;
  SupportedResourceTypes?: string[];
}
export const ListCostCategoryDefinitionsRequest = S.suspend(() =>
  S.Struct({
    EffectiveOn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    SupportedResourceTypes: S.optional(ResourceTypesFilterInput),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCostCategoryDefinitionsRequest",
}) as any as S.Schema<ListCostCategoryDefinitionsRequest>;
export interface ListCostCategoryResourceAssociationsRequest {
  CostCategoryArn?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListCostCategoryResourceAssociationsRequest = S.suspend(() =>
  S.Struct({
    CostCategoryArn: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCostCategoryResourceAssociationsRequest",
}) as any as S.Schema<ListCostCategoryResourceAssociationsRequest>;
export interface ListSavingsPlansPurchaseRecommendationGenerationRequest {
  GenerationStatus?: GenerationStatus;
  RecommendationIds?: string[];
  PageSize?: number;
  NextPageToken?: string;
}
export const ListSavingsPlansPurchaseRecommendationGenerationRequest =
  S.suspend(() =>
    S.Struct({
      GenerationStatus: S.optional(GenerationStatus),
      RecommendationIds: S.optional(RecommendationIdList),
      PageSize: S.optional(S.Number),
      NextPageToken: S.optional(S.String),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
  ).annotations({
    identifier: "ListSavingsPlansPurchaseRecommendationGenerationRequest",
  }) as any as S.Schema<ListSavingsPlansPurchaseRecommendationGenerationRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ProvideAnomalyFeedbackRequest {
  AnomalyId: string;
  Feedback: AnomalyFeedbackType;
}
export const ProvideAnomalyFeedbackRequest = S.suspend(() =>
  S.Struct({ AnomalyId: S.String, Feedback: AnomalyFeedbackType }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ProvideAnomalyFeedbackRequest",
}) as any as S.Schema<ProvideAnomalyFeedbackRequest>;
export interface StartCostAllocationTagBackfillRequest {
  BackfillFrom: string;
}
export const StartCostAllocationTagBackfillRequest = S.suspend(() =>
  S.Struct({ BackfillFrom: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartCostAllocationTagBackfillRequest",
}) as any as S.Schema<StartCostAllocationTagBackfillRequest>;
export interface StartSavingsPlansPurchaseRecommendationGenerationResponse {
  RecommendationId?: string;
  GenerationStartedTime?: string;
  EstimatedCompletionTime?: string;
}
export const StartSavingsPlansPurchaseRecommendationGenerationResponse =
  S.suspend(() =>
    S.Struct({
      RecommendationId: S.optional(S.String),
      GenerationStartedTime: S.optional(S.String),
      EstimatedCompletionTime: S.optional(S.String),
    }),
  ).annotations({
    identifier: "StartSavingsPlansPurchaseRecommendationGenerationResponse",
  }) as any as S.Schema<StartSavingsPlansPurchaseRecommendationGenerationResponse>;
export interface ResourceTag {
  Key: string;
  Value: string;
}
export const ResourceTag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "ResourceTag" }) as any as S.Schema<ResourceTag>;
export type ResourceTagList = ResourceTag[];
export const ResourceTagList = S.Array(ResourceTag);
export interface TagResourceRequest {
  ResourceArn: string;
  ResourceTags: ResourceTag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, ResourceTags: ResourceTagList }).pipe(
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
  ResourceArn: string;
  ResourceTagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, ResourceTagKeys: ResourceTagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateAnomalyMonitorRequest {
  MonitorArn: string;
  MonitorName?: string;
}
export const UpdateAnomalyMonitorRequest = S.suspend(() =>
  S.Struct({ MonitorArn: S.String, MonitorName: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAnomalyMonitorRequest",
}) as any as S.Schema<UpdateAnomalyMonitorRequest>;
export type CostCategoryInheritedValueDimensionName =
  | "LINKED_ACCOUNT_NAME"
  | "TAG";
export const CostCategoryInheritedValueDimensionName = S.Literal(
  "LINKED_ACCOUNT_NAME",
  "TAG",
);
export interface CostCategoryInheritedValueDimension {
  DimensionName?: CostCategoryInheritedValueDimensionName;
  DimensionKey?: string;
}
export const CostCategoryInheritedValueDimension = S.suspend(() =>
  S.Struct({
    DimensionName: S.optional(CostCategoryInheritedValueDimensionName),
    DimensionKey: S.optional(S.String),
  }),
).annotations({
  identifier: "CostCategoryInheritedValueDimension",
}) as any as S.Schema<CostCategoryInheritedValueDimension>;
export type CostCategoryRuleType = "REGULAR" | "INHERITED_VALUE";
export const CostCategoryRuleType = S.Literal("REGULAR", "INHERITED_VALUE");
export interface CostCategoryRule {
  Value?: string;
  Rule?: Expression;
  InheritedValue?: CostCategoryInheritedValueDimension;
  Type?: CostCategoryRuleType;
}
export const CostCategoryRule = S.suspend(() =>
  S.Struct({
    Value: S.optional(S.String),
    Rule: S.optional(Expression),
    InheritedValue: S.optional(CostCategoryInheritedValueDimension),
    Type: S.optional(CostCategoryRuleType),
  }),
).annotations({
  identifier: "CostCategoryRule",
}) as any as S.Schema<CostCategoryRule>;
export type CostCategoryRulesList = CostCategoryRule[];
export const CostCategoryRulesList = S.Array(CostCategoryRule);
export type CostCategorySplitChargeRuleTargetsList = string[];
export const CostCategorySplitChargeRuleTargetsList = S.Array(S.String);
export type CostCategorySplitChargeMethod = "FIXED" | "PROPORTIONAL" | "EVEN";
export const CostCategorySplitChargeMethod = S.Literal(
  "FIXED",
  "PROPORTIONAL",
  "EVEN",
);
export type CostCategorySplitChargeRuleParameterType = "ALLOCATION_PERCENTAGES";
export const CostCategorySplitChargeRuleParameterType = S.Literal(
  "ALLOCATION_PERCENTAGES",
);
export type CostCategorySplitChargeRuleParameterValuesList = string[];
export const CostCategorySplitChargeRuleParameterValuesList = S.Array(S.String);
export interface CostCategorySplitChargeRuleParameter {
  Type: CostCategorySplitChargeRuleParameterType;
  Values: string[];
}
export const CostCategorySplitChargeRuleParameter = S.suspend(() =>
  S.Struct({
    Type: CostCategorySplitChargeRuleParameterType,
    Values: CostCategorySplitChargeRuleParameterValuesList,
  }),
).annotations({
  identifier: "CostCategorySplitChargeRuleParameter",
}) as any as S.Schema<CostCategorySplitChargeRuleParameter>;
export type CostCategorySplitChargeRuleParametersList =
  CostCategorySplitChargeRuleParameter[];
export const CostCategorySplitChargeRuleParametersList = S.Array(
  CostCategorySplitChargeRuleParameter,
);
export interface CostCategorySplitChargeRule {
  Source: string;
  Targets: string[];
  Method: CostCategorySplitChargeMethod;
  Parameters?: CostCategorySplitChargeRuleParameter[];
}
export const CostCategorySplitChargeRule = S.suspend(() =>
  S.Struct({
    Source: S.String,
    Targets: CostCategorySplitChargeRuleTargetsList,
    Method: CostCategorySplitChargeMethod,
    Parameters: S.optional(CostCategorySplitChargeRuleParametersList),
  }),
).annotations({
  identifier: "CostCategorySplitChargeRule",
}) as any as S.Schema<CostCategorySplitChargeRule>;
export type CostCategorySplitChargeRulesList = CostCategorySplitChargeRule[];
export const CostCategorySplitChargeRulesList = S.Array(
  CostCategorySplitChargeRule,
);
export interface UpdateCostCategoryDefinitionRequest {
  CostCategoryArn: string;
  EffectiveStart?: string;
  RuleVersion: CostCategoryRuleVersion;
  Rules: CostCategoryRule[];
  DefaultValue?: string;
  SplitChargeRules?: CostCategorySplitChargeRule[];
}
export const UpdateCostCategoryDefinitionRequest = S.suspend(() =>
  S.Struct({
    CostCategoryArn: S.String,
    EffectiveStart: S.optional(S.String),
    RuleVersion: CostCategoryRuleVersion,
    Rules: CostCategoryRulesList,
    DefaultValue: S.optional(S.String),
    SplitChargeRules: S.optional(CostCategorySplitChargeRulesList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCostCategoryDefinitionRequest",
}) as any as S.Schema<UpdateCostCategoryDefinitionRequest>;
export type MonitorType = "DIMENSIONAL" | "CUSTOM";
export const MonitorType = S.Literal("DIMENSIONAL", "CUSTOM");
export type MonitorDimension =
  | "SERVICE"
  | "LINKED_ACCOUNT"
  | "TAG"
  | "COST_CATEGORY";
export const MonitorDimension = S.Literal(
  "SERVICE",
  "LINKED_ACCOUNT",
  "TAG",
  "COST_CATEGORY",
);
export type NumericOperator =
  | "EQUAL"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN_OR_EQUAL"
  | "GREATER_THAN"
  | "LESS_THAN"
  | "BETWEEN";
export const NumericOperator = S.Literal(
  "EQUAL",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN_OR_EQUAL",
  "GREATER_THAN",
  "LESS_THAN",
  "BETWEEN",
);
export type Expressions = Expression[];
export const Expressions = S.Array(
  S.suspend((): S.Schema<Expression, any> => Expression).annotations({
    identifier: "Expression",
  }),
) as any as S.Schema<Expressions>;
export type RecommendationTarget =
  | "SAME_INSTANCE_FAMILY"
  | "CROSS_INSTANCE_FAMILY";
export const RecommendationTarget = S.Literal(
  "SAME_INSTANCE_FAMILY",
  "CROSS_INSTANCE_FAMILY",
);
export type SubscriberType = "EMAIL" | "SNS";
export const SubscriberType = S.Literal("EMAIL", "SNS");
export type SubscriberStatus = "CONFIRMED" | "DECLINED";
export const SubscriberStatus = S.Literal("CONFIRMED", "DECLINED");
export interface AnomalyMonitor {
  MonitorArn?: string;
  MonitorName: string;
  CreationDate?: string;
  LastUpdatedDate?: string;
  LastEvaluatedDate?: string;
  MonitorType: MonitorType;
  MonitorDimension?: MonitorDimension;
  MonitorSpecification?: Expression;
  DimensionalValueCount?: number;
}
export const AnomalyMonitor = S.suspend(() =>
  S.Struct({
    MonitorArn: S.optional(S.String),
    MonitorName: S.String,
    CreationDate: S.optional(S.String),
    LastUpdatedDate: S.optional(S.String),
    LastEvaluatedDate: S.optional(S.String),
    MonitorType: MonitorType,
    MonitorDimension: S.optional(MonitorDimension),
    MonitorSpecification: S.optional(Expression),
    DimensionalValueCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "AnomalyMonitor",
}) as any as S.Schema<AnomalyMonitor>;
export interface Subscriber {
  Address?: string;
  Type?: SubscriberType;
  Status?: SubscriberStatus;
}
export const Subscriber = S.suspend(() =>
  S.Struct({
    Address: S.optional(S.String),
    Type: S.optional(SubscriberType),
    Status: S.optional(SubscriberStatus),
  }),
).annotations({ identifier: "Subscriber" }) as any as S.Schema<Subscriber>;
export type Subscribers = Subscriber[];
export const Subscribers = S.Array(Subscriber);
export interface AnomalySubscription {
  SubscriptionArn?: string;
  AccountId?: string;
  MonitorArnList: string[];
  Subscribers: Subscriber[];
  Threshold?: number;
  Frequency: AnomalySubscriptionFrequency;
  SubscriptionName: string;
  ThresholdExpression?: Expression;
}
export const AnomalySubscription = S.suspend(() =>
  S.Struct({
    SubscriptionArn: S.optional(S.String),
    AccountId: S.optional(S.String),
    MonitorArnList: MonitorArnList,
    Subscribers: Subscribers,
    Threshold: S.optional(S.Number),
    Frequency: AnomalySubscriptionFrequency,
    SubscriptionName: S.String,
    ThresholdExpression: S.optional(Expression),
  }),
).annotations({
  identifier: "AnomalySubscription",
}) as any as S.Schema<AnomalySubscription>;
export interface AnomalyDateInterval {
  StartDate: string;
  EndDate?: string;
}
export const AnomalyDateInterval = S.suspend(() =>
  S.Struct({ StartDate: S.String, EndDate: S.optional(S.String) }),
).annotations({
  identifier: "AnomalyDateInterval",
}) as any as S.Schema<AnomalyDateInterval>;
export interface TotalImpactFilter {
  NumericOperator: NumericOperator;
  StartValue: number;
  EndValue?: number;
}
export const TotalImpactFilter = S.suspend(() =>
  S.Struct({
    NumericOperator: NumericOperator,
    StartValue: S.Number,
    EndValue: S.optional(S.Number),
  }),
).annotations({
  identifier: "TotalImpactFilter",
}) as any as S.Schema<TotalImpactFilter>;
export type AnomalyMonitors = AnomalyMonitor[];
export const AnomalyMonitors = S.Array(AnomalyMonitor);
export type AnomalySubscriptions = AnomalySubscription[];
export const AnomalySubscriptions = S.Array(AnomalySubscription);
export type ErrorCode =
  | "NO_USAGE_FOUND"
  | "INTERNAL_FAILURE"
  | "INVALID_SAVINGS_PLANS_TO_ADD"
  | "INVALID_SAVINGS_PLANS_TO_EXCLUDE"
  | "INVALID_ACCOUNT_ID";
export const ErrorCode = S.Literal(
  "NO_USAGE_FOUND",
  "INTERNAL_FAILURE",
  "INVALID_SAVINGS_PLANS_TO_ADD",
  "INVALID_SAVINGS_PLANS_TO_EXCLUDE",
  "INVALID_ACCOUNT_ID",
);
export interface RightsizingRecommendationConfiguration {
  RecommendationTarget: RecommendationTarget;
  BenefitsConsidered: boolean;
}
export const RightsizingRecommendationConfiguration = S.suspend(() =>
  S.Struct({
    RecommendationTarget: RecommendationTarget,
    BenefitsConsidered: S.Boolean,
  }),
).annotations({
  identifier: "RightsizingRecommendationConfiguration",
}) as any as S.Schema<RightsizingRecommendationConfiguration>;
export type TagList = string[];
export const TagList = S.Array(S.String);
export interface CostAllocationTagStatusEntry {
  TagKey: string;
  Status: CostAllocationTagStatus;
}
export const CostAllocationTagStatusEntry = S.suspend(() =>
  S.Struct({ TagKey: S.String, Status: CostAllocationTagStatus }),
).annotations({
  identifier: "CostAllocationTagStatusEntry",
}) as any as S.Schema<CostAllocationTagStatusEntry>;
export type CostAllocationTagStatusList = CostAllocationTagStatusEntry[];
export const CostAllocationTagStatusList = S.Array(
  CostAllocationTagStatusEntry,
);
export type OfferingClass = "STANDARD" | "CONVERTIBLE";
export const OfferingClass = S.Literal("STANDARD", "CONVERTIBLE");
export type AnalysisType = "MAX_SAVINGS" | "CUSTOM_COMMITMENT";
export const AnalysisType = S.Literal("MAX_SAVINGS", "CUSTOM_COMMITMENT");
export type SavingsPlansToExclude = string[];
export const SavingsPlansToExclude = S.Array(S.String);
export interface CreateAnomalyMonitorRequest {
  AnomalyMonitor: AnomalyMonitor;
  ResourceTags?: ResourceTag[];
}
export const CreateAnomalyMonitorRequest = S.suspend(() =>
  S.Struct({
    AnomalyMonitor: AnomalyMonitor,
    ResourceTags: S.optional(ResourceTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAnomalyMonitorRequest",
}) as any as S.Schema<CreateAnomalyMonitorRequest>;
export interface CreateAnomalySubscriptionRequest {
  AnomalySubscription: AnomalySubscription;
  ResourceTags?: ResourceTag[];
}
export const CreateAnomalySubscriptionRequest = S.suspend(() =>
  S.Struct({
    AnomalySubscription: AnomalySubscription,
    ResourceTags: S.optional(ResourceTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateAnomalySubscriptionRequest",
}) as any as S.Schema<CreateAnomalySubscriptionRequest>;
export interface DeleteCostCategoryDefinitionResponse {
  CostCategoryArn?: string;
  EffectiveEnd?: string;
}
export const DeleteCostCategoryDefinitionResponse = S.suspend(() =>
  S.Struct({
    CostCategoryArn: S.optional(S.String),
    EffectiveEnd: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteCostCategoryDefinitionResponse",
}) as any as S.Schema<DeleteCostCategoryDefinitionResponse>;
export interface GetAnomaliesRequest {
  MonitorArn?: string;
  DateInterval: AnomalyDateInterval;
  Feedback?: AnomalyFeedbackType;
  TotalImpact?: TotalImpactFilter;
  NextPageToken?: string;
  MaxResults?: number;
}
export const GetAnomaliesRequest = S.suspend(() =>
  S.Struct({
    MonitorArn: S.optional(S.String),
    DateInterval: AnomalyDateInterval,
    Feedback: S.optional(AnomalyFeedbackType),
    TotalImpact: S.optional(TotalImpactFilter),
    NextPageToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAnomaliesRequest",
}) as any as S.Schema<GetAnomaliesRequest>;
export interface GetAnomalyMonitorsResponse {
  AnomalyMonitors: AnomalyMonitor[];
  NextPageToken?: string;
}
export const GetAnomalyMonitorsResponse = S.suspend(() =>
  S.Struct({
    AnomalyMonitors: AnomalyMonitors,
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAnomalyMonitorsResponse",
}) as any as S.Schema<GetAnomalyMonitorsResponse>;
export interface GetAnomalySubscriptionsResponse {
  AnomalySubscriptions: AnomalySubscription[];
  NextPageToken?: string;
}
export const GetAnomalySubscriptionsResponse = S.suspend(() =>
  S.Struct({
    AnomalySubscriptions: AnomalySubscriptions,
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetAnomalySubscriptionsResponse",
}) as any as S.Schema<GetAnomalySubscriptionsResponse>;
export interface GetCostCategoriesRequest {
  SearchString?: string;
  TimePeriod: DateInterval;
  CostCategoryName?: string;
  Filter?: Expression;
  SortBy?: SortDefinition[];
  BillingViewArn?: string;
  MaxResults?: number;
  NextPageToken?: string;
}
export const GetCostCategoriesRequest = S.suspend(() =>
  S.Struct({
    SearchString: S.optional(S.String),
    TimePeriod: DateInterval,
    CostCategoryName: S.optional(S.String),
    Filter: S.optional(Expression),
    SortBy: S.optional(SortDefinitions),
    BillingViewArn: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCostCategoriesRequest",
}) as any as S.Schema<GetCostCategoriesRequest>;
export type Attributes = { [key: string]: string };
export const Attributes = S.Record({ key: S.String, value: S.String });
export interface DimensionValuesWithAttributes {
  Value?: string;
  Attributes?: { [key: string]: string };
}
export const DimensionValuesWithAttributes = S.suspend(() =>
  S.Struct({ Value: S.optional(S.String), Attributes: S.optional(Attributes) }),
).annotations({
  identifier: "DimensionValuesWithAttributes",
}) as any as S.Schema<DimensionValuesWithAttributes>;
export type DimensionValuesWithAttributesList = DimensionValuesWithAttributes[];
export const DimensionValuesWithAttributesList = S.Array(
  DimensionValuesWithAttributes,
);
export interface GetDimensionValuesResponse {
  DimensionValues: DimensionValuesWithAttributes[];
  ReturnSize: number;
  TotalSize: number;
  NextPageToken?: string;
}
export const GetDimensionValuesResponse = S.suspend(() =>
  S.Struct({
    DimensionValues: DimensionValuesWithAttributesList,
    ReturnSize: S.Number,
    TotalSize: S.Number,
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDimensionValuesResponse",
}) as any as S.Schema<GetDimensionValuesResponse>;
export interface GetRightsizingRecommendationRequest {
  Filter?: Expression;
  Configuration?: RightsizingRecommendationConfiguration;
  Service: string;
  PageSize?: number;
  NextPageToken?: string;
}
export const GetRightsizingRecommendationRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(Expression),
    Configuration: S.optional(RightsizingRecommendationConfiguration),
    Service: S.String,
    PageSize: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRightsizingRecommendationRequest",
}) as any as S.Schema<GetRightsizingRecommendationRequest>;
export interface GetTagsResponse {
  NextPageToken?: string;
  Tags: string[];
  ReturnSize: number;
  TotalSize: number;
}
export const GetTagsResponse = S.suspend(() =>
  S.Struct({
    NextPageToken: S.optional(S.String),
    Tags: TagList,
    ReturnSize: S.Number,
    TotalSize: S.Number,
  }),
).annotations({
  identifier: "GetTagsResponse",
}) as any as S.Schema<GetTagsResponse>;
export interface MetricValue {
  Amount?: string;
  Unit?: string;
}
export const MetricValue = S.suspend(() =>
  S.Struct({ Amount: S.optional(S.String), Unit: S.optional(S.String) }),
).annotations({ identifier: "MetricValue" }) as any as S.Schema<MetricValue>;
export interface ForecastResult {
  TimePeriod?: DateInterval;
  MeanValue?: string;
  PredictionIntervalLowerBound?: string;
  PredictionIntervalUpperBound?: string;
}
export const ForecastResult = S.suspend(() =>
  S.Struct({
    TimePeriod: S.optional(DateInterval),
    MeanValue: S.optional(S.String),
    PredictionIntervalLowerBound: S.optional(S.String),
    PredictionIntervalUpperBound: S.optional(S.String),
  }),
).annotations({
  identifier: "ForecastResult",
}) as any as S.Schema<ForecastResult>;
export type ForecastResultsByTime = ForecastResult[];
export const ForecastResultsByTime = S.Array(ForecastResult);
export interface GetUsageForecastResponse {
  Total?: MetricValue;
  ForecastResultsByTime?: ForecastResult[];
}
export const GetUsageForecastResponse = S.suspend(() =>
  S.Struct({
    Total: S.optional(MetricValue),
    ForecastResultsByTime: S.optional(ForecastResultsByTime),
  }),
).annotations({
  identifier: "GetUsageForecastResponse",
}) as any as S.Schema<GetUsageForecastResponse>;
export interface ListTagsForResourceResponse {
  ResourceTags?: ResourceTag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ ResourceTags: S.optional(ResourceTagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface ProvideAnomalyFeedbackResponse {
  AnomalyId: string;
}
export const ProvideAnomalyFeedbackResponse = S.suspend(() =>
  S.Struct({ AnomalyId: S.String }),
).annotations({
  identifier: "ProvideAnomalyFeedbackResponse",
}) as any as S.Schema<ProvideAnomalyFeedbackResponse>;
export type CostAllocationTagBackfillStatus =
  | "SUCCEEDED"
  | "PROCESSING"
  | "FAILED";
export const CostAllocationTagBackfillStatus = S.Literal(
  "SUCCEEDED",
  "PROCESSING",
  "FAILED",
);
export interface CostAllocationTagBackfillRequest {
  BackfillFrom?: string;
  RequestedAt?: string;
  CompletedAt?: string;
  BackfillStatus?: CostAllocationTagBackfillStatus;
  LastUpdatedAt?: string;
}
export const CostAllocationTagBackfillRequest = S.suspend(() =>
  S.Struct({
    BackfillFrom: S.optional(S.String),
    RequestedAt: S.optional(S.String),
    CompletedAt: S.optional(S.String),
    BackfillStatus: S.optional(CostAllocationTagBackfillStatus),
    LastUpdatedAt: S.optional(S.String),
  }),
).annotations({
  identifier: "CostAllocationTagBackfillRequest",
}) as any as S.Schema<CostAllocationTagBackfillRequest>;
export interface StartCostAllocationTagBackfillResponse {
  BackfillRequest?: CostAllocationTagBackfillRequest;
}
export const StartCostAllocationTagBackfillResponse = S.suspend(() =>
  S.Struct({ BackfillRequest: S.optional(CostAllocationTagBackfillRequest) }),
).annotations({
  identifier: "StartCostAllocationTagBackfillResponse",
}) as any as S.Schema<StartCostAllocationTagBackfillResponse>;
export interface UpdateAnomalyMonitorResponse {
  MonitorArn: string;
}
export const UpdateAnomalyMonitorResponse = S.suspend(() =>
  S.Struct({ MonitorArn: S.String }),
).annotations({
  identifier: "UpdateAnomalyMonitorResponse",
}) as any as S.Schema<UpdateAnomalyMonitorResponse>;
export interface UpdateAnomalySubscriptionRequest {
  SubscriptionArn: string;
  Threshold?: number;
  Frequency?: AnomalySubscriptionFrequency;
  MonitorArnList?: string[];
  Subscribers?: Subscriber[];
  SubscriptionName?: string;
  ThresholdExpression?: Expression;
}
export const UpdateAnomalySubscriptionRequest = S.suspend(() =>
  S.Struct({
    SubscriptionArn: S.String,
    Threshold: S.optional(S.Number),
    Frequency: S.optional(AnomalySubscriptionFrequency),
    MonitorArnList: S.optional(MonitorArnList),
    Subscribers: S.optional(Subscribers),
    SubscriptionName: S.optional(S.String),
    ThresholdExpression: S.optional(Expression),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateAnomalySubscriptionRequest",
}) as any as S.Schema<UpdateAnomalySubscriptionRequest>;
export interface UpdateCostAllocationTagsStatusRequest {
  CostAllocationTagsStatus: CostAllocationTagStatusEntry[];
}
export const UpdateCostAllocationTagsStatusRequest = S.suspend(() =>
  S.Struct({ CostAllocationTagsStatus: CostAllocationTagStatusList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCostAllocationTagsStatusRequest",
}) as any as S.Schema<UpdateCostAllocationTagsStatusRequest>;
export interface UpdateCostCategoryDefinitionResponse {
  CostCategoryArn?: string;
  EffectiveStart?: string;
}
export const UpdateCostCategoryDefinitionResponse = S.suspend(() =>
  S.Struct({
    CostCategoryArn: S.optional(S.String),
    EffectiveStart: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateCostCategoryDefinitionResponse",
}) as any as S.Schema<UpdateCostCategoryDefinitionResponse>;
export interface EC2Specification {
  OfferingClass?: OfferingClass;
}
export const EC2Specification = S.suspend(() =>
  S.Struct({ OfferingClass: S.optional(OfferingClass) }),
).annotations({
  identifier: "EC2Specification",
}) as any as S.Schema<EC2Specification>;
export type CostCategoryValuesList = string[];
export const CostCategoryValuesList = S.Array(S.String);
export type ResourceTypes = string[];
export const ResourceTypes = S.Array(S.String);
export type ApproximateUsageRecordsPerService = { [key: string]: number };
export const ApproximateUsageRecordsPerService = S.Record({
  key: S.String,
  value: S.Number,
});
export interface ComparisonMetricValue {
  BaselineTimePeriodAmount?: string;
  ComparisonTimePeriodAmount?: string;
  Difference?: string;
  Unit?: string;
}
export const ComparisonMetricValue = S.suspend(() =>
  S.Struct({
    BaselineTimePeriodAmount: S.optional(S.String),
    ComparisonTimePeriodAmount: S.optional(S.String),
    Difference: S.optional(S.String),
    Unit: S.optional(S.String),
  }),
).annotations({
  identifier: "ComparisonMetricValue",
}) as any as S.Schema<ComparisonMetricValue>;
export type ComparisonMetrics = { [key: string]: ComparisonMetricValue };
export const ComparisonMetrics = S.Record({
  key: S.String,
  value: ComparisonMetricValue,
});
export interface CostAndUsageComparison {
  CostAndUsageSelector?: Expression;
  Metrics?: { [key: string]: ComparisonMetricValue };
}
export const CostAndUsageComparison = S.suspend(() =>
  S.Struct({
    CostAndUsageSelector: S.optional(Expression),
    Metrics: S.optional(ComparisonMetrics),
  }),
).annotations({
  identifier: "CostAndUsageComparison",
}) as any as S.Schema<CostAndUsageComparison>;
export type CostAndUsageComparisons = CostAndUsageComparison[];
export const CostAndUsageComparisons = S.Array(CostAndUsageComparison);
export type CostCategoryNamesList = string[];
export const CostCategoryNamesList = S.Array(S.String);
export interface ServiceSpecification {
  EC2Specification?: EC2Specification;
}
export const ServiceSpecification = S.suspend(() =>
  S.Struct({ EC2Specification: S.optional(EC2Specification) }),
).annotations({
  identifier: "ServiceSpecification",
}) as any as S.Schema<ServiceSpecification>;
export interface ReservationAggregates {
  UtilizationPercentage?: string;
  UtilizationPercentageInUnits?: string;
  PurchasedHours?: string;
  PurchasedUnits?: string;
  TotalActualHours?: string;
  TotalActualUnits?: string;
  UnusedHours?: string;
  UnusedUnits?: string;
  OnDemandCostOfRIHoursUsed?: string;
  NetRISavings?: string;
  TotalPotentialRISavings?: string;
  AmortizedUpfrontFee?: string;
  AmortizedRecurringFee?: string;
  TotalAmortizedFee?: string;
  RICostForUnusedHours?: string;
  RealizedSavings?: string;
  UnrealizedSavings?: string;
}
export const ReservationAggregates = S.suspend(() =>
  S.Struct({
    UtilizationPercentage: S.optional(S.String),
    UtilizationPercentageInUnits: S.optional(S.String),
    PurchasedHours: S.optional(S.String),
    PurchasedUnits: S.optional(S.String),
    TotalActualHours: S.optional(S.String),
    TotalActualUnits: S.optional(S.String),
    UnusedHours: S.optional(S.String),
    UnusedUnits: S.optional(S.String),
    OnDemandCostOfRIHoursUsed: S.optional(S.String),
    NetRISavings: S.optional(S.String),
    TotalPotentialRISavings: S.optional(S.String),
    AmortizedUpfrontFee: S.optional(S.String),
    AmortizedRecurringFee: S.optional(S.String),
    TotalAmortizedFee: S.optional(S.String),
    RICostForUnusedHours: S.optional(S.String),
    RealizedSavings: S.optional(S.String),
    UnrealizedSavings: S.optional(S.String),
  }),
).annotations({
  identifier: "ReservationAggregates",
}) as any as S.Schema<ReservationAggregates>;
export interface SavingsPlansPurchaseRecommendationMetadata {
  RecommendationId?: string;
  GenerationTimestamp?: string;
  AdditionalMetadata?: string;
}
export const SavingsPlansPurchaseRecommendationMetadata = S.suspend(() =>
  S.Struct({
    RecommendationId: S.optional(S.String),
    GenerationTimestamp: S.optional(S.String),
    AdditionalMetadata: S.optional(S.String),
  }),
).annotations({
  identifier: "SavingsPlansPurchaseRecommendationMetadata",
}) as any as S.Schema<SavingsPlansPurchaseRecommendationMetadata>;
export interface SavingsPlansUtilization {
  TotalCommitment?: string;
  UsedCommitment?: string;
  UnusedCommitment?: string;
  UtilizationPercentage?: string;
}
export const SavingsPlansUtilization = S.suspend(() =>
  S.Struct({
    TotalCommitment: S.optional(S.String),
    UsedCommitment: S.optional(S.String),
    UnusedCommitment: S.optional(S.String),
    UtilizationPercentage: S.optional(S.String),
  }),
).annotations({
  identifier: "SavingsPlansUtilization",
}) as any as S.Schema<SavingsPlansUtilization>;
export interface SavingsPlansSavings {
  NetSavings?: string;
  OnDemandCostEquivalent?: string;
}
export const SavingsPlansSavings = S.suspend(() =>
  S.Struct({
    NetSavings: S.optional(S.String),
    OnDemandCostEquivalent: S.optional(S.String),
  }),
).annotations({
  identifier: "SavingsPlansSavings",
}) as any as S.Schema<SavingsPlansSavings>;
export interface SavingsPlansAmortizedCommitment {
  AmortizedRecurringCommitment?: string;
  AmortizedUpfrontCommitment?: string;
  TotalAmortizedCommitment?: string;
}
export const SavingsPlansAmortizedCommitment = S.suspend(() =>
  S.Struct({
    AmortizedRecurringCommitment: S.optional(S.String),
    AmortizedUpfrontCommitment: S.optional(S.String),
    TotalAmortizedCommitment: S.optional(S.String),
  }),
).annotations({
  identifier: "SavingsPlansAmortizedCommitment",
}) as any as S.Schema<SavingsPlansAmortizedCommitment>;
export interface SavingsPlansUtilizationAggregates {
  Utilization: SavingsPlansUtilization;
  Savings?: SavingsPlansSavings;
  AmortizedCommitment?: SavingsPlansAmortizedCommitment;
}
export const SavingsPlansUtilizationAggregates = S.suspend(() =>
  S.Struct({
    Utilization: SavingsPlansUtilization,
    Savings: S.optional(SavingsPlansSavings),
    AmortizedCommitment: S.optional(SavingsPlansAmortizedCommitment),
  }),
).annotations({
  identifier: "SavingsPlansUtilizationAggregates",
}) as any as S.Schema<SavingsPlansUtilizationAggregates>;
export interface SavingsPlansUtilizationDetail {
  SavingsPlanArn?: string;
  Attributes?: { [key: string]: string };
  Utilization?: SavingsPlansUtilization;
  Savings?: SavingsPlansSavings;
  AmortizedCommitment?: SavingsPlansAmortizedCommitment;
}
export const SavingsPlansUtilizationDetail = S.suspend(() =>
  S.Struct({
    SavingsPlanArn: S.optional(S.String),
    Attributes: S.optional(Attributes),
    Utilization: S.optional(SavingsPlansUtilization),
    Savings: S.optional(SavingsPlansSavings),
    AmortizedCommitment: S.optional(SavingsPlansAmortizedCommitment),
  }),
).annotations({
  identifier: "SavingsPlansUtilizationDetail",
}) as any as S.Schema<SavingsPlansUtilizationDetail>;
export type SavingsPlansUtilizationDetails = SavingsPlansUtilizationDetail[];
export const SavingsPlansUtilizationDetails = S.Array(
  SavingsPlansUtilizationDetail,
);
export interface SavingsPlans {
  PaymentOption?: PaymentOption;
  SavingsPlansType?: SupportedSavingsPlansType;
  Region?: string;
  InstanceFamily?: string;
  TermInYears?: TermInYears;
  SavingsPlansCommitment?: number;
  OfferingId?: string;
}
export const SavingsPlans = S.suspend(() =>
  S.Struct({
    PaymentOption: S.optional(PaymentOption),
    SavingsPlansType: S.optional(SupportedSavingsPlansType),
    Region: S.optional(S.String),
    InstanceFamily: S.optional(S.String),
    TermInYears: S.optional(TermInYears),
    SavingsPlansCommitment: S.optional(S.Number),
    OfferingId: S.optional(S.String),
  }),
).annotations({ identifier: "SavingsPlans" }) as any as S.Schema<SavingsPlans>;
export type SavingsPlansToAdd = SavingsPlans[];
export const SavingsPlansToAdd = S.Array(SavingsPlans);
export interface SavingsPlansPurchaseAnalysisConfiguration {
  AccountScope?: AccountScope;
  AccountId?: string;
  AnalysisType: AnalysisType;
  SavingsPlansToAdd: SavingsPlans[];
  SavingsPlansToExclude?: string[];
  LookBackTimePeriod: DateInterval;
}
export const SavingsPlansPurchaseAnalysisConfiguration = S.suspend(() =>
  S.Struct({
    AccountScope: S.optional(AccountScope),
    AccountId: S.optional(S.String),
    AnalysisType: AnalysisType,
    SavingsPlansToAdd: SavingsPlansToAdd,
    SavingsPlansToExclude: S.optional(SavingsPlansToExclude),
    LookBackTimePeriod: DateInterval,
  }),
).annotations({
  identifier: "SavingsPlansPurchaseAnalysisConfiguration",
}) as any as S.Schema<SavingsPlansPurchaseAnalysisConfiguration>;
export interface CommitmentPurchaseAnalysisConfiguration {
  SavingsPlansPurchaseAnalysisConfiguration?: SavingsPlansPurchaseAnalysisConfiguration;
}
export const CommitmentPurchaseAnalysisConfiguration = S.suspend(() =>
  S.Struct({
    SavingsPlansPurchaseAnalysisConfiguration: S.optional(
      SavingsPlansPurchaseAnalysisConfiguration,
    ),
  }),
).annotations({
  identifier: "CommitmentPurchaseAnalysisConfiguration",
}) as any as S.Schema<CommitmentPurchaseAnalysisConfiguration>;
export interface AnalysisSummary {
  EstimatedCompletionTime?: string;
  AnalysisCompletionTime?: string;
  AnalysisStartedTime?: string;
  AnalysisStatus?: AnalysisStatus;
  ErrorCode?: ErrorCode;
  AnalysisId?: string;
  CommitmentPurchaseAnalysisConfiguration?: CommitmentPurchaseAnalysisConfiguration;
}
export const AnalysisSummary = S.suspend(() =>
  S.Struct({
    EstimatedCompletionTime: S.optional(S.String),
    AnalysisCompletionTime: S.optional(S.String),
    AnalysisStartedTime: S.optional(S.String),
    AnalysisStatus: S.optional(AnalysisStatus),
    ErrorCode: S.optional(ErrorCode),
    AnalysisId: S.optional(S.String),
    CommitmentPurchaseAnalysisConfiguration: S.optional(
      CommitmentPurchaseAnalysisConfiguration,
    ),
  }),
).annotations({
  identifier: "AnalysisSummary",
}) as any as S.Schema<AnalysisSummary>;
export type AnalysisSummaryList = AnalysisSummary[];
export const AnalysisSummaryList = S.Array(AnalysisSummary);
export type CostAllocationTagBackfillRequestList =
  CostAllocationTagBackfillRequest[];
export const CostAllocationTagBackfillRequestList = S.Array(
  CostAllocationTagBackfillRequest,
);
export interface CostAllocationTag {
  TagKey: string;
  Type: CostAllocationTagType;
  Status: CostAllocationTagStatus;
  LastUpdatedDate?: string;
  LastUsedDate?: string;
}
export const CostAllocationTag = S.suspend(() =>
  S.Struct({
    TagKey: S.String,
    Type: CostAllocationTagType,
    Status: CostAllocationTagStatus,
    LastUpdatedDate: S.optional(S.String),
    LastUsedDate: S.optional(S.String),
  }),
).annotations({
  identifier: "CostAllocationTag",
}) as any as S.Schema<CostAllocationTag>;
export type CostAllocationTagList = CostAllocationTag[];
export const CostAllocationTagList = S.Array(CostAllocationTag);
export type CostCategoryStatusComponent = "COST_EXPLORER";
export const CostCategoryStatusComponent = S.Literal("COST_EXPLORER");
export type CostCategoryStatus = "PROCESSING" | "APPLIED";
export const CostCategoryStatus = S.Literal("PROCESSING", "APPLIED");
export interface CostCategoryProcessingStatus {
  Component?: CostCategoryStatusComponent;
  Status?: CostCategoryStatus;
}
export const CostCategoryProcessingStatus = S.suspend(() =>
  S.Struct({
    Component: S.optional(CostCategoryStatusComponent),
    Status: S.optional(CostCategoryStatus),
  }),
).annotations({
  identifier: "CostCategoryProcessingStatus",
}) as any as S.Schema<CostCategoryProcessingStatus>;
export type CostCategoryProcessingStatusList = CostCategoryProcessingStatus[];
export const CostCategoryProcessingStatusList = S.Array(
  CostCategoryProcessingStatus,
);
export interface CostCategoryReference {
  CostCategoryArn?: string;
  Name?: string;
  EffectiveStart?: string;
  EffectiveEnd?: string;
  NumberOfRules?: number;
  ProcessingStatus?: CostCategoryProcessingStatus[];
  Values?: string[];
  DefaultValue?: string;
  SupportedResourceTypes?: string[];
}
export const CostCategoryReference = S.suspend(() =>
  S.Struct({
    CostCategoryArn: S.optional(S.String),
    Name: S.optional(S.String),
    EffectiveStart: S.optional(S.String),
    EffectiveEnd: S.optional(S.String),
    NumberOfRules: S.optional(S.Number),
    ProcessingStatus: S.optional(CostCategoryProcessingStatusList),
    Values: S.optional(CostCategoryValuesList),
    DefaultValue: S.optional(S.String),
    SupportedResourceTypes: S.optional(ResourceTypes),
  }),
).annotations({
  identifier: "CostCategoryReference",
}) as any as S.Schema<CostCategoryReference>;
export type CostCategoryReferencesList = CostCategoryReference[];
export const CostCategoryReferencesList = S.Array(CostCategoryReference);
export interface CostCategoryResourceAssociation {
  ResourceArn?: string;
  CostCategoryName?: string;
  CostCategoryArn?: string;
}
export const CostCategoryResourceAssociation = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    CostCategoryName: S.optional(S.String),
    CostCategoryArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CostCategoryResourceAssociation",
}) as any as S.Schema<CostCategoryResourceAssociation>;
export type CostCategoryResourceAssociations =
  CostCategoryResourceAssociation[];
export const CostCategoryResourceAssociations = S.Array(
  CostCategoryResourceAssociation,
);
export interface GenerationSummary {
  RecommendationId?: string;
  GenerationStatus?: GenerationStatus;
  GenerationStartedTime?: string;
  GenerationCompletionTime?: string;
  EstimatedCompletionTime?: string;
}
export const GenerationSummary = S.suspend(() =>
  S.Struct({
    RecommendationId: S.optional(S.String),
    GenerationStatus: S.optional(GenerationStatus),
    GenerationStartedTime: S.optional(S.String),
    GenerationCompletionTime: S.optional(S.String),
    EstimatedCompletionTime: S.optional(S.String),
  }),
).annotations({
  identifier: "GenerationSummary",
}) as any as S.Schema<GenerationSummary>;
export type GenerationSummaryList = GenerationSummary[];
export const GenerationSummaryList = S.Array(GenerationSummary);
export type Keys = string[];
export const Keys = S.Array(S.String);
export interface CreateAnomalyMonitorResponse {
  MonitorArn: string;
}
export const CreateAnomalyMonitorResponse = S.suspend(() =>
  S.Struct({ MonitorArn: S.String }),
).annotations({
  identifier: "CreateAnomalyMonitorResponse",
}) as any as S.Schema<CreateAnomalyMonitorResponse>;
export interface CreateAnomalySubscriptionResponse {
  SubscriptionArn: string;
}
export const CreateAnomalySubscriptionResponse = S.suspend(() =>
  S.Struct({ SubscriptionArn: S.String }),
).annotations({
  identifier: "CreateAnomalySubscriptionResponse",
}) as any as S.Schema<CreateAnomalySubscriptionResponse>;
export interface CreateCostCategoryDefinitionRequest {
  Name: string;
  EffectiveStart?: string;
  RuleVersion: CostCategoryRuleVersion;
  Rules: CostCategoryRule[];
  DefaultValue?: string;
  SplitChargeRules?: CostCategorySplitChargeRule[];
  ResourceTags?: ResourceTag[];
}
export const CreateCostCategoryDefinitionRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    EffectiveStart: S.optional(S.String),
    RuleVersion: CostCategoryRuleVersion,
    Rules: CostCategoryRulesList,
    DefaultValue: S.optional(S.String),
    SplitChargeRules: S.optional(CostCategorySplitChargeRulesList),
    ResourceTags: S.optional(ResourceTagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCostCategoryDefinitionRequest",
}) as any as S.Schema<CreateCostCategoryDefinitionRequest>;
export interface GetApproximateUsageRecordsResponse {
  Services?: { [key: string]: number };
  TotalRecords?: number;
  LookbackPeriod?: DateInterval;
}
export const GetApproximateUsageRecordsResponse = S.suspend(() =>
  S.Struct({
    Services: S.optional(ApproximateUsageRecordsPerService),
    TotalRecords: S.optional(S.Number),
    LookbackPeriod: S.optional(DateInterval),
  }),
).annotations({
  identifier: "GetApproximateUsageRecordsResponse",
}) as any as S.Schema<GetApproximateUsageRecordsResponse>;
export interface GetCostAndUsageRequest {
  TimePeriod: DateInterval;
  Granularity: Granularity;
  Filter?: Expression;
  Metrics: string[];
  GroupBy?: GroupDefinition[];
  BillingViewArn?: string;
  NextPageToken?: string;
}
export const GetCostAndUsageRequest = S.suspend(() =>
  S.Struct({
    TimePeriod: DateInterval,
    Granularity: Granularity,
    Filter: S.optional(Expression),
    Metrics: MetricNames,
    GroupBy: S.optional(GroupDefinitions),
    BillingViewArn: S.optional(S.String),
    NextPageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCostAndUsageRequest",
}) as any as S.Schema<GetCostAndUsageRequest>;
export interface GetCostCategoriesResponse {
  NextPageToken?: string;
  CostCategoryNames?: string[];
  CostCategoryValues?: string[];
  ReturnSize: number;
  TotalSize: number;
}
export const GetCostCategoriesResponse = S.suspend(() =>
  S.Struct({
    NextPageToken: S.optional(S.String),
    CostCategoryNames: S.optional(CostCategoryNamesList),
    CostCategoryValues: S.optional(CostCategoryValuesList),
    ReturnSize: S.Number,
    TotalSize: S.Number,
  }),
).annotations({
  identifier: "GetCostCategoriesResponse",
}) as any as S.Schema<GetCostCategoriesResponse>;
export interface GetCostForecastResponse {
  Total?: MetricValue;
  ForecastResultsByTime?: ForecastResult[];
}
export const GetCostForecastResponse = S.suspend(() =>
  S.Struct({
    Total: S.optional(MetricValue),
    ForecastResultsByTime: S.optional(ForecastResultsByTime),
  }),
).annotations({
  identifier: "GetCostForecastResponse",
}) as any as S.Schema<GetCostForecastResponse>;
export interface GetReservationPurchaseRecommendationRequest {
  AccountId?: string;
  Service: string;
  Filter?: Expression;
  AccountScope?: AccountScope;
  LookbackPeriodInDays?: LookbackPeriodInDays;
  TermInYears?: TermInYears;
  PaymentOption?: PaymentOption;
  ServiceSpecification?: ServiceSpecification;
  PageSize?: number;
  NextPageToken?: string;
}
export const GetReservationPurchaseRecommendationRequest = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    Service: S.String,
    Filter: S.optional(Expression),
    AccountScope: S.optional(AccountScope),
    LookbackPeriodInDays: S.optional(LookbackPeriodInDays),
    TermInYears: S.optional(TermInYears),
    PaymentOption: S.optional(PaymentOption),
    ServiceSpecification: S.optional(ServiceSpecification),
    PageSize: S.optional(S.Number),
    NextPageToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetReservationPurchaseRecommendationRequest",
}) as any as S.Schema<GetReservationPurchaseRecommendationRequest>;
export interface GetSavingsPlansUtilizationDetailsResponse {
  SavingsPlansUtilizationDetails: SavingsPlansUtilizationDetail[];
  Total?: SavingsPlansUtilizationAggregates;
  TimePeriod: DateInterval;
  NextToken?: string;
}
export const GetSavingsPlansUtilizationDetailsResponse = S.suspend(() =>
  S.Struct({
    SavingsPlansUtilizationDetails: SavingsPlansUtilizationDetails,
    Total: S.optional(SavingsPlansUtilizationAggregates),
    TimePeriod: DateInterval,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSavingsPlansUtilizationDetailsResponse",
}) as any as S.Schema<GetSavingsPlansUtilizationDetailsResponse>;
export interface ListCommitmentPurchaseAnalysesResponse {
  AnalysisSummaryList?: AnalysisSummary[];
  NextPageToken?: string;
}
export const ListCommitmentPurchaseAnalysesResponse = S.suspend(() =>
  S.Struct({
    AnalysisSummaryList: S.optional(AnalysisSummaryList),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCommitmentPurchaseAnalysesResponse",
}) as any as S.Schema<ListCommitmentPurchaseAnalysesResponse>;
export interface ListCostAllocationTagBackfillHistoryResponse {
  BackfillRequests?: CostAllocationTagBackfillRequest[];
  NextToken?: string;
}
export const ListCostAllocationTagBackfillHistoryResponse = S.suspend(() =>
  S.Struct({
    BackfillRequests: S.optional(CostAllocationTagBackfillRequestList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCostAllocationTagBackfillHistoryResponse",
}) as any as S.Schema<ListCostAllocationTagBackfillHistoryResponse>;
export interface ListCostAllocationTagsResponse {
  CostAllocationTags?: CostAllocationTag[];
  NextToken?: string;
}
export const ListCostAllocationTagsResponse = S.suspend(() =>
  S.Struct({
    CostAllocationTags: S.optional(CostAllocationTagList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCostAllocationTagsResponse",
}) as any as S.Schema<ListCostAllocationTagsResponse>;
export interface ListCostCategoryDefinitionsResponse {
  CostCategoryReferences?: CostCategoryReference[];
  NextToken?: string;
}
export const ListCostCategoryDefinitionsResponse = S.suspend(() =>
  S.Struct({
    CostCategoryReferences: S.optional(CostCategoryReferencesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCostCategoryDefinitionsResponse",
}) as any as S.Schema<ListCostCategoryDefinitionsResponse>;
export interface ListCostCategoryResourceAssociationsResponse {
  CostCategoryResourceAssociations?: CostCategoryResourceAssociation[];
  NextToken?: string;
}
export const ListCostCategoryResourceAssociationsResponse = S.suspend(() =>
  S.Struct({
    CostCategoryResourceAssociations: S.optional(
      CostCategoryResourceAssociations,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCostCategoryResourceAssociationsResponse",
}) as any as S.Schema<ListCostCategoryResourceAssociationsResponse>;
export interface ListSavingsPlansPurchaseRecommendationGenerationResponse {
  GenerationSummaryList?: GenerationSummary[];
  NextPageToken?: string;
}
export const ListSavingsPlansPurchaseRecommendationGenerationResponse =
  S.suspend(() =>
    S.Struct({
      GenerationSummaryList: S.optional(GenerationSummaryList),
      NextPageToken: S.optional(S.String),
    }),
  ).annotations({
    identifier: "ListSavingsPlansPurchaseRecommendationGenerationResponse",
  }) as any as S.Schema<ListSavingsPlansPurchaseRecommendationGenerationResponse>;
export interface UpdateAnomalySubscriptionResponse {
  SubscriptionArn: string;
}
export const UpdateAnomalySubscriptionResponse = S.suspend(() =>
  S.Struct({ SubscriptionArn: S.String }),
).annotations({
  identifier: "UpdateAnomalySubscriptionResponse",
}) as any as S.Schema<UpdateAnomalySubscriptionResponse>;
export interface RecommendationDetailHourlyMetrics {
  StartTime?: string;
  EstimatedOnDemandCost?: string;
  CurrentCoverage?: string;
  EstimatedCoverage?: string;
  EstimatedNewCommitmentUtilization?: string;
}
export const RecommendationDetailHourlyMetrics = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.String),
    EstimatedOnDemandCost: S.optional(S.String),
    CurrentCoverage: S.optional(S.String),
    EstimatedCoverage: S.optional(S.String),
    EstimatedNewCommitmentUtilization: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommendationDetailHourlyMetrics",
}) as any as S.Schema<RecommendationDetailHourlyMetrics>;
export type MetricsOverLookbackPeriod = RecommendationDetailHourlyMetrics[];
export const MetricsOverLookbackPeriod = S.Array(
  RecommendationDetailHourlyMetrics,
);
export interface SavingsPlansPurchaseAnalysisDetails {
  CurrencyCode?: string;
  LookbackPeriodInHours?: string;
  CurrentAverageCoverage?: string;
  CurrentAverageHourlyOnDemandSpend?: string;
  CurrentMaximumHourlyOnDemandSpend?: string;
  CurrentMinimumHourlyOnDemandSpend?: string;
  CurrentOnDemandSpend?: string;
  ExistingHourlyCommitment?: string;
  HourlyCommitmentToPurchase?: string;
  EstimatedAverageCoverage?: string;
  EstimatedAverageUtilization?: string;
  EstimatedMonthlySavingsAmount?: string;
  EstimatedOnDemandCost?: string;
  EstimatedOnDemandCostWithCurrentCommitment?: string;
  EstimatedROI?: string;
  EstimatedSavingsAmount?: string;
  EstimatedSavingsPercentage?: string;
  EstimatedCommitmentCost?: string;
  LatestUsageTimestamp?: string;
  UpfrontCost?: string;
  AdditionalMetadata?: string;
  MetricsOverLookbackPeriod?: RecommendationDetailHourlyMetrics[];
}
export const SavingsPlansPurchaseAnalysisDetails = S.suspend(() =>
  S.Struct({
    CurrencyCode: S.optional(S.String),
    LookbackPeriodInHours: S.optional(S.String),
    CurrentAverageCoverage: S.optional(S.String),
    CurrentAverageHourlyOnDemandSpend: S.optional(S.String),
    CurrentMaximumHourlyOnDemandSpend: S.optional(S.String),
    CurrentMinimumHourlyOnDemandSpend: S.optional(S.String),
    CurrentOnDemandSpend: S.optional(S.String),
    ExistingHourlyCommitment: S.optional(S.String),
    HourlyCommitmentToPurchase: S.optional(S.String),
    EstimatedAverageCoverage: S.optional(S.String),
    EstimatedAverageUtilization: S.optional(S.String),
    EstimatedMonthlySavingsAmount: S.optional(S.String),
    EstimatedOnDemandCost: S.optional(S.String),
    EstimatedOnDemandCostWithCurrentCommitment: S.optional(S.String),
    EstimatedROI: S.optional(S.String),
    EstimatedSavingsAmount: S.optional(S.String),
    EstimatedSavingsPercentage: S.optional(S.String),
    EstimatedCommitmentCost: S.optional(S.String),
    LatestUsageTimestamp: S.optional(S.String),
    UpfrontCost: S.optional(S.String),
    AdditionalMetadata: S.optional(S.String),
    MetricsOverLookbackPeriod: S.optional(MetricsOverLookbackPeriod),
  }),
).annotations({
  identifier: "SavingsPlansPurchaseAnalysisDetails",
}) as any as S.Schema<SavingsPlansPurchaseAnalysisDetails>;
export type Metrics = { [key: string]: MetricValue };
export const Metrics = S.Record({ key: S.String, value: MetricValue });
export interface Group {
  Keys?: string[];
  Metrics?: { [key: string]: MetricValue };
}
export const Group = S.suspend(() =>
  S.Struct({ Keys: S.optional(Keys), Metrics: S.optional(Metrics) }),
).annotations({ identifier: "Group" }) as any as S.Schema<Group>;
export type Groups = Group[];
export const Groups = S.Array(Group);
export interface CostDriver {
  Type?: string;
  Name?: string;
  Metrics?: { [key: string]: ComparisonMetricValue };
}
export const CostDriver = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Name: S.optional(S.String),
    Metrics: S.optional(ComparisonMetrics),
  }),
).annotations({ identifier: "CostDriver" }) as any as S.Schema<CostDriver>;
export type CostDrivers = CostDriver[];
export const CostDrivers = S.Array(CostDriver);
export interface CoverageHours {
  OnDemandHours?: string;
  ReservedHours?: string;
  TotalRunningHours?: string;
  CoverageHoursPercentage?: string;
}
export const CoverageHours = S.suspend(() =>
  S.Struct({
    OnDemandHours: S.optional(S.String),
    ReservedHours: S.optional(S.String),
    TotalRunningHours: S.optional(S.String),
    CoverageHoursPercentage: S.optional(S.String),
  }),
).annotations({
  identifier: "CoverageHours",
}) as any as S.Schema<CoverageHours>;
export interface CoverageNormalizedUnits {
  OnDemandNormalizedUnits?: string;
  ReservedNormalizedUnits?: string;
  TotalRunningNormalizedUnits?: string;
  CoverageNormalizedUnitsPercentage?: string;
}
export const CoverageNormalizedUnits = S.suspend(() =>
  S.Struct({
    OnDemandNormalizedUnits: S.optional(S.String),
    ReservedNormalizedUnits: S.optional(S.String),
    TotalRunningNormalizedUnits: S.optional(S.String),
    CoverageNormalizedUnitsPercentage: S.optional(S.String),
  }),
).annotations({
  identifier: "CoverageNormalizedUnits",
}) as any as S.Schema<CoverageNormalizedUnits>;
export interface CoverageCost {
  OnDemandCost?: string;
}
export const CoverageCost = S.suspend(() =>
  S.Struct({ OnDemandCost: S.optional(S.String) }),
).annotations({ identifier: "CoverageCost" }) as any as S.Schema<CoverageCost>;
export interface Coverage {
  CoverageHours?: CoverageHours;
  CoverageNormalizedUnits?: CoverageNormalizedUnits;
  CoverageCost?: CoverageCost;
}
export const Coverage = S.suspend(() =>
  S.Struct({
    CoverageHours: S.optional(CoverageHours),
    CoverageNormalizedUnits: S.optional(CoverageNormalizedUnits),
    CoverageCost: S.optional(CoverageCost),
  }),
).annotations({ identifier: "Coverage" }) as any as S.Schema<Coverage>;
export interface ReservationCoverageGroup {
  Attributes?: { [key: string]: string };
  Coverage?: Coverage;
}
export const ReservationCoverageGroup = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(Attributes),
    Coverage: S.optional(Coverage),
  }),
).annotations({
  identifier: "ReservationCoverageGroup",
}) as any as S.Schema<ReservationCoverageGroup>;
export type ReservationCoverageGroups = ReservationCoverageGroup[];
export const ReservationCoverageGroups = S.Array(ReservationCoverageGroup);
export interface ReservationUtilizationGroup {
  Key?: string;
  Value?: string;
  Attributes?: { [key: string]: string };
  Utilization?: ReservationAggregates;
}
export const ReservationUtilizationGroup = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Value: S.optional(S.String),
    Attributes: S.optional(Attributes),
    Utilization: S.optional(ReservationAggregates),
  }),
).annotations({
  identifier: "ReservationUtilizationGroup",
}) as any as S.Schema<ReservationUtilizationGroup>;
export type ReservationUtilizationGroups = ReservationUtilizationGroup[];
export const ReservationUtilizationGroups = S.Array(
  ReservationUtilizationGroup,
);
export type RightsizingType = "TERMINATE" | "MODIFY";
export const RightsizingType = S.Literal("TERMINATE", "MODIFY");
export type FindingReasonCode =
  | "CPU_OVER_PROVISIONED"
  | "CPU_UNDER_PROVISIONED"
  | "MEMORY_OVER_PROVISIONED"
  | "MEMORY_UNDER_PROVISIONED"
  | "EBS_THROUGHPUT_OVER_PROVISIONED"
  | "EBS_THROUGHPUT_UNDER_PROVISIONED"
  | "EBS_IOPS_OVER_PROVISIONED"
  | "EBS_IOPS_UNDER_PROVISIONED"
  | "NETWORK_BANDWIDTH_OVER_PROVISIONED"
  | "NETWORK_BANDWIDTH_UNDER_PROVISIONED"
  | "NETWORK_PPS_OVER_PROVISIONED"
  | "NETWORK_PPS_UNDER_PROVISIONED"
  | "DISK_IOPS_OVER_PROVISIONED"
  | "DISK_IOPS_UNDER_PROVISIONED"
  | "DISK_THROUGHPUT_OVER_PROVISIONED"
  | "DISK_THROUGHPUT_UNDER_PROVISIONED";
export const FindingReasonCode = S.Literal(
  "CPU_OVER_PROVISIONED",
  "CPU_UNDER_PROVISIONED",
  "MEMORY_OVER_PROVISIONED",
  "MEMORY_UNDER_PROVISIONED",
  "EBS_THROUGHPUT_OVER_PROVISIONED",
  "EBS_THROUGHPUT_UNDER_PROVISIONED",
  "EBS_IOPS_OVER_PROVISIONED",
  "EBS_IOPS_UNDER_PROVISIONED",
  "NETWORK_BANDWIDTH_OVER_PROVISIONED",
  "NETWORK_BANDWIDTH_UNDER_PROVISIONED",
  "NETWORK_PPS_OVER_PROVISIONED",
  "NETWORK_PPS_UNDER_PROVISIONED",
  "DISK_IOPS_OVER_PROVISIONED",
  "DISK_IOPS_UNDER_PROVISIONED",
  "DISK_THROUGHPUT_OVER_PROVISIONED",
  "DISK_THROUGHPUT_UNDER_PROVISIONED",
);
export type FindingReasonCodes = FindingReasonCode[];
export const FindingReasonCodes = S.Array(FindingReasonCode);
export interface SavingsPlansCoverageData {
  SpendCoveredBySavingsPlans?: string;
  OnDemandCost?: string;
  TotalCost?: string;
  CoveragePercentage?: string;
}
export const SavingsPlansCoverageData = S.suspend(() =>
  S.Struct({
    SpendCoveredBySavingsPlans: S.optional(S.String),
    OnDemandCost: S.optional(S.String),
    TotalCost: S.optional(S.String),
    CoveragePercentage: S.optional(S.String),
  }),
).annotations({
  identifier: "SavingsPlansCoverageData",
}) as any as S.Schema<SavingsPlansCoverageData>;
export interface SavingsPlansPurchaseRecommendationSummary {
  EstimatedROI?: string;
  CurrencyCode?: string;
  EstimatedTotalCost?: string;
  CurrentOnDemandSpend?: string;
  EstimatedSavingsAmount?: string;
  TotalRecommendationCount?: string;
  DailyCommitmentToPurchase?: string;
  HourlyCommitmentToPurchase?: string;
  EstimatedSavingsPercentage?: string;
  EstimatedMonthlySavingsAmount?: string;
  EstimatedOnDemandCostWithCurrentCommitment?: string;
}
export const SavingsPlansPurchaseRecommendationSummary = S.suspend(() =>
  S.Struct({
    EstimatedROI: S.optional(S.String),
    CurrencyCode: S.optional(S.String),
    EstimatedTotalCost: S.optional(S.String),
    CurrentOnDemandSpend: S.optional(S.String),
    EstimatedSavingsAmount: S.optional(S.String),
    TotalRecommendationCount: S.optional(S.String),
    DailyCommitmentToPurchase: S.optional(S.String),
    HourlyCommitmentToPurchase: S.optional(S.String),
    EstimatedSavingsPercentage: S.optional(S.String),
    EstimatedMonthlySavingsAmount: S.optional(S.String),
    EstimatedOnDemandCostWithCurrentCommitment: S.optional(S.String),
  }),
).annotations({
  identifier: "SavingsPlansPurchaseRecommendationSummary",
}) as any as S.Schema<SavingsPlansPurchaseRecommendationSummary>;
export interface CostCategory {
  CostCategoryArn: string;
  EffectiveStart: string;
  EffectiveEnd?: string;
  Name: string;
  RuleVersion: CostCategoryRuleVersion;
  Rules: CostCategoryRule[];
  SplitChargeRules?: CostCategorySplitChargeRule[];
  ProcessingStatus?: CostCategoryProcessingStatus[];
  DefaultValue?: string;
}
export const CostCategory = S.suspend(() =>
  S.Struct({
    CostCategoryArn: S.String,
    EffectiveStart: S.String,
    EffectiveEnd: S.optional(S.String),
    Name: S.String,
    RuleVersion: CostCategoryRuleVersion,
    Rules: CostCategoryRulesList,
    SplitChargeRules: S.optional(CostCategorySplitChargeRulesList),
    ProcessingStatus: S.optional(CostCategoryProcessingStatusList),
    DefaultValue: S.optional(S.String),
  }),
).annotations({ identifier: "CostCategory" }) as any as S.Schema<CostCategory>;
export interface AnalysisDetails {
  SavingsPlansPurchaseAnalysisDetails?: SavingsPlansPurchaseAnalysisDetails;
}
export const AnalysisDetails = S.suspend(() =>
  S.Struct({
    SavingsPlansPurchaseAnalysisDetails: S.optional(
      SavingsPlansPurchaseAnalysisDetails,
    ),
  }),
).annotations({
  identifier: "AnalysisDetails",
}) as any as S.Schema<AnalysisDetails>;
export interface ResultByTime {
  TimePeriod?: DateInterval;
  Total?: { [key: string]: MetricValue };
  Groups?: Group[];
  Estimated?: boolean;
}
export const ResultByTime = S.suspend(() =>
  S.Struct({
    TimePeriod: S.optional(DateInterval),
    Total: S.optional(Metrics),
    Groups: S.optional(Groups),
    Estimated: S.optional(S.Boolean),
  }),
).annotations({ identifier: "ResultByTime" }) as any as S.Schema<ResultByTime>;
export type ResultsByTime = ResultByTime[];
export const ResultsByTime = S.Array(ResultByTime);
export interface CostComparisonDriver {
  CostSelector?: Expression;
  Metrics?: { [key: string]: ComparisonMetricValue };
  CostDrivers?: CostDriver[];
}
export const CostComparisonDriver = S.suspend(() =>
  S.Struct({
    CostSelector: S.optional(Expression),
    Metrics: S.optional(ComparisonMetrics),
    CostDrivers: S.optional(CostDrivers),
  }),
).annotations({
  identifier: "CostComparisonDriver",
}) as any as S.Schema<CostComparisonDriver>;
export type CostComparisonDrivers = CostComparisonDriver[];
export const CostComparisonDrivers = S.Array(CostComparisonDriver);
export interface CoverageByTime {
  TimePeriod?: DateInterval;
  Groups?: ReservationCoverageGroup[];
  Total?: Coverage;
}
export const CoverageByTime = S.suspend(() =>
  S.Struct({
    TimePeriod: S.optional(DateInterval),
    Groups: S.optional(ReservationCoverageGroups),
    Total: S.optional(Coverage),
  }),
).annotations({
  identifier: "CoverageByTime",
}) as any as S.Schema<CoverageByTime>;
export type CoveragesByTime = CoverageByTime[];
export const CoveragesByTime = S.Array(CoverageByTime);
export interface UtilizationByTime {
  TimePeriod?: DateInterval;
  Groups?: ReservationUtilizationGroup[];
  Total?: ReservationAggregates;
}
export const UtilizationByTime = S.suspend(() =>
  S.Struct({
    TimePeriod: S.optional(DateInterval),
    Groups: S.optional(ReservationUtilizationGroups),
    Total: S.optional(ReservationAggregates),
  }),
).annotations({
  identifier: "UtilizationByTime",
}) as any as S.Schema<UtilizationByTime>;
export type UtilizationsByTime = UtilizationByTime[];
export const UtilizationsByTime = S.Array(UtilizationByTime);
export interface RightsizingRecommendationMetadata {
  RecommendationId?: string;
  GenerationTimestamp?: string;
  LookbackPeriodInDays?: LookbackPeriodInDays;
  AdditionalMetadata?: string;
}
export const RightsizingRecommendationMetadata = S.suspend(() =>
  S.Struct({
    RecommendationId: S.optional(S.String),
    GenerationTimestamp: S.optional(S.String),
    LookbackPeriodInDays: S.optional(LookbackPeriodInDays),
    AdditionalMetadata: S.optional(S.String),
  }),
).annotations({
  identifier: "RightsizingRecommendationMetadata",
}) as any as S.Schema<RightsizingRecommendationMetadata>;
export interface RightsizingRecommendationSummary {
  TotalRecommendationCount?: string;
  EstimatedTotalMonthlySavingsAmount?: string;
  SavingsCurrencyCode?: string;
  SavingsPercentage?: string;
}
export const RightsizingRecommendationSummary = S.suspend(() =>
  S.Struct({
    TotalRecommendationCount: S.optional(S.String),
    EstimatedTotalMonthlySavingsAmount: S.optional(S.String),
    SavingsCurrencyCode: S.optional(S.String),
    SavingsPercentage: S.optional(S.String),
  }),
).annotations({
  identifier: "RightsizingRecommendationSummary",
}) as any as S.Schema<RightsizingRecommendationSummary>;
export interface RecommendationDetailData {
  AccountScope?: AccountScope;
  LookbackPeriodInDays?: LookbackPeriodInDays;
  SavingsPlansType?: SupportedSavingsPlansType;
  TermInYears?: TermInYears;
  PaymentOption?: PaymentOption;
  AccountId?: string;
  CurrencyCode?: string;
  InstanceFamily?: string;
  Region?: string;
  OfferingId?: string;
  GenerationTimestamp?: string;
  LatestUsageTimestamp?: string;
  CurrentAverageHourlyOnDemandSpend?: string;
  CurrentMaximumHourlyOnDemandSpend?: string;
  CurrentMinimumHourlyOnDemandSpend?: string;
  EstimatedAverageUtilization?: string;
  EstimatedMonthlySavingsAmount?: string;
  EstimatedOnDemandCost?: string;
  EstimatedOnDemandCostWithCurrentCommitment?: string;
  EstimatedROI?: string;
  EstimatedSPCost?: string;
  EstimatedSavingsAmount?: string;
  EstimatedSavingsPercentage?: string;
  ExistingHourlyCommitment?: string;
  HourlyCommitmentToPurchase?: string;
  UpfrontCost?: string;
  CurrentAverageCoverage?: string;
  EstimatedAverageCoverage?: string;
  MetricsOverLookbackPeriod?: RecommendationDetailHourlyMetrics[];
}
export const RecommendationDetailData = S.suspend(() =>
  S.Struct({
    AccountScope: S.optional(AccountScope),
    LookbackPeriodInDays: S.optional(LookbackPeriodInDays),
    SavingsPlansType: S.optional(SupportedSavingsPlansType),
    TermInYears: S.optional(TermInYears),
    PaymentOption: S.optional(PaymentOption),
    AccountId: S.optional(S.String),
    CurrencyCode: S.optional(S.String),
    InstanceFamily: S.optional(S.String),
    Region: S.optional(S.String),
    OfferingId: S.optional(S.String),
    GenerationTimestamp: S.optional(S.String),
    LatestUsageTimestamp: S.optional(S.String),
    CurrentAverageHourlyOnDemandSpend: S.optional(S.String),
    CurrentMaximumHourlyOnDemandSpend: S.optional(S.String),
    CurrentMinimumHourlyOnDemandSpend: S.optional(S.String),
    EstimatedAverageUtilization: S.optional(S.String),
    EstimatedMonthlySavingsAmount: S.optional(S.String),
    EstimatedOnDemandCost: S.optional(S.String),
    EstimatedOnDemandCostWithCurrentCommitment: S.optional(S.String),
    EstimatedROI: S.optional(S.String),
    EstimatedSPCost: S.optional(S.String),
    EstimatedSavingsAmount: S.optional(S.String),
    EstimatedSavingsPercentage: S.optional(S.String),
    ExistingHourlyCommitment: S.optional(S.String),
    HourlyCommitmentToPurchase: S.optional(S.String),
    UpfrontCost: S.optional(S.String),
    CurrentAverageCoverage: S.optional(S.String),
    EstimatedAverageCoverage: S.optional(S.String),
    MetricsOverLookbackPeriod: S.optional(MetricsOverLookbackPeriod),
  }),
).annotations({
  identifier: "RecommendationDetailData",
}) as any as S.Schema<RecommendationDetailData>;
export interface SavingsPlansCoverage {
  Attributes?: { [key: string]: string };
  Coverage?: SavingsPlansCoverageData;
  TimePeriod?: DateInterval;
}
export const SavingsPlansCoverage = S.suspend(() =>
  S.Struct({
    Attributes: S.optional(Attributes),
    Coverage: S.optional(SavingsPlansCoverageData),
    TimePeriod: S.optional(DateInterval),
  }),
).annotations({
  identifier: "SavingsPlansCoverage",
}) as any as S.Schema<SavingsPlansCoverage>;
export type SavingsPlansCoverages = SavingsPlansCoverage[];
export const SavingsPlansCoverages = S.Array(SavingsPlansCoverage);
export interface SavingsPlansUtilizationByTime {
  TimePeriod: DateInterval;
  Utilization: SavingsPlansUtilization;
  Savings?: SavingsPlansSavings;
  AmortizedCommitment?: SavingsPlansAmortizedCommitment;
}
export const SavingsPlansUtilizationByTime = S.suspend(() =>
  S.Struct({
    TimePeriod: DateInterval,
    Utilization: SavingsPlansUtilization,
    Savings: S.optional(SavingsPlansSavings),
    AmortizedCommitment: S.optional(SavingsPlansAmortizedCommitment),
  }),
).annotations({
  identifier: "SavingsPlansUtilizationByTime",
}) as any as S.Schema<SavingsPlansUtilizationByTime>;
export type SavingsPlansUtilizationsByTime = SavingsPlansUtilizationByTime[];
export const SavingsPlansUtilizationsByTime = S.Array(
  SavingsPlansUtilizationByTime,
);
export interface UpdateCostAllocationTagsStatusError {
  TagKey?: string;
  Code?: string;
  Message?: string;
}
export const UpdateCostAllocationTagsStatusError = S.suspend(() =>
  S.Struct({
    TagKey: S.optional(S.String),
    Code: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateCostAllocationTagsStatusError",
}) as any as S.Schema<UpdateCostAllocationTagsStatusError>;
export type UpdateCostAllocationTagsStatusErrors =
  UpdateCostAllocationTagsStatusError[];
export const UpdateCostAllocationTagsStatusErrors = S.Array(
  UpdateCostAllocationTagsStatusError,
);
export type TagValuesList = TagValues[];
export const TagValuesList = S.Array(TagValues);
export interface SavingsPlansDetails {
  Region?: string;
  InstanceFamily?: string;
  OfferingId?: string;
}
export const SavingsPlansDetails = S.suspend(() =>
  S.Struct({
    Region: S.optional(S.String),
    InstanceFamily: S.optional(S.String),
    OfferingId: S.optional(S.String),
  }),
).annotations({
  identifier: "SavingsPlansDetails",
}) as any as S.Schema<SavingsPlansDetails>;
export interface CreateCostCategoryDefinitionResponse {
  CostCategoryArn?: string;
  EffectiveStart?: string;
}
export const CreateCostCategoryDefinitionResponse = S.suspend(() =>
  S.Struct({
    CostCategoryArn: S.optional(S.String),
    EffectiveStart: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateCostCategoryDefinitionResponse",
}) as any as S.Schema<CreateCostCategoryDefinitionResponse>;
export interface DescribeCostCategoryDefinitionResponse {
  CostCategory?: CostCategory;
}
export const DescribeCostCategoryDefinitionResponse = S.suspend(() =>
  S.Struct({ CostCategory: S.optional(CostCategory) }),
).annotations({
  identifier: "DescribeCostCategoryDefinitionResponse",
}) as any as S.Schema<DescribeCostCategoryDefinitionResponse>;
export interface GetCommitmentPurchaseAnalysisResponse {
  EstimatedCompletionTime: string;
  AnalysisCompletionTime?: string;
  AnalysisStartedTime: string;
  AnalysisId: string;
  AnalysisStatus: AnalysisStatus;
  ErrorCode?: ErrorCode;
  AnalysisDetails?: AnalysisDetails;
  CommitmentPurchaseAnalysisConfiguration: CommitmentPurchaseAnalysisConfiguration;
}
export const GetCommitmentPurchaseAnalysisResponse = S.suspend(() =>
  S.Struct({
    EstimatedCompletionTime: S.String,
    AnalysisCompletionTime: S.optional(S.String),
    AnalysisStartedTime: S.String,
    AnalysisId: S.String,
    AnalysisStatus: AnalysisStatus,
    ErrorCode: S.optional(ErrorCode),
    AnalysisDetails: S.optional(AnalysisDetails),
    CommitmentPurchaseAnalysisConfiguration:
      CommitmentPurchaseAnalysisConfiguration,
  }),
).annotations({
  identifier: "GetCommitmentPurchaseAnalysisResponse",
}) as any as S.Schema<GetCommitmentPurchaseAnalysisResponse>;
export interface GetCostAndUsageResponse {
  NextPageToken?: string;
  GroupDefinitions?: GroupDefinition[];
  ResultsByTime?: ResultByTime[];
  DimensionValueAttributes?: DimensionValuesWithAttributes[];
}
export const GetCostAndUsageResponse = S.suspend(() =>
  S.Struct({
    NextPageToken: S.optional(S.String),
    GroupDefinitions: S.optional(GroupDefinitions),
    ResultsByTime: S.optional(ResultsByTime),
    DimensionValueAttributes: S.optional(DimensionValuesWithAttributesList),
  }),
).annotations({
  identifier: "GetCostAndUsageResponse",
}) as any as S.Schema<GetCostAndUsageResponse>;
export interface GetCostAndUsageComparisonsResponse {
  CostAndUsageComparisons?: CostAndUsageComparison[];
  TotalCostAndUsage?: { [key: string]: ComparisonMetricValue };
  NextPageToken?: string;
}
export const GetCostAndUsageComparisonsResponse = S.suspend(() =>
  S.Struct({
    CostAndUsageComparisons: S.optional(CostAndUsageComparisons),
    TotalCostAndUsage: S.optional(ComparisonMetrics),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCostAndUsageComparisonsResponse",
}) as any as S.Schema<GetCostAndUsageComparisonsResponse>;
export interface GetCostAndUsageWithResourcesResponse {
  NextPageToken?: string;
  GroupDefinitions?: GroupDefinition[];
  ResultsByTime?: ResultByTime[];
  DimensionValueAttributes?: DimensionValuesWithAttributes[];
}
export const GetCostAndUsageWithResourcesResponse = S.suspend(() =>
  S.Struct({
    NextPageToken: S.optional(S.String),
    GroupDefinitions: S.optional(GroupDefinitions),
    ResultsByTime: S.optional(ResultsByTime),
    DimensionValueAttributes: S.optional(DimensionValuesWithAttributesList),
  }),
).annotations({
  identifier: "GetCostAndUsageWithResourcesResponse",
}) as any as S.Schema<GetCostAndUsageWithResourcesResponse>;
export interface GetCostComparisonDriversResponse {
  CostComparisonDrivers?: CostComparisonDriver[];
  NextPageToken?: string;
}
export const GetCostComparisonDriversResponse = S.suspend(() =>
  S.Struct({
    CostComparisonDrivers: S.optional(CostComparisonDrivers),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCostComparisonDriversResponse",
}) as any as S.Schema<GetCostComparisonDriversResponse>;
export interface GetReservationCoverageResponse {
  CoveragesByTime: CoverageByTime[];
  Total?: Coverage;
  NextPageToken?: string;
}
export const GetReservationCoverageResponse = S.suspend(() =>
  S.Struct({
    CoveragesByTime: CoveragesByTime,
    Total: S.optional(Coverage),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetReservationCoverageResponse",
}) as any as S.Schema<GetReservationCoverageResponse>;
export interface GetReservationUtilizationResponse {
  UtilizationsByTime: UtilizationByTime[];
  Total?: ReservationAggregates;
  NextPageToken?: string;
}
export const GetReservationUtilizationResponse = S.suspend(() =>
  S.Struct({
    UtilizationsByTime: UtilizationsByTime,
    Total: S.optional(ReservationAggregates),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetReservationUtilizationResponse",
}) as any as S.Schema<GetReservationUtilizationResponse>;
export interface GetSavingsPlanPurchaseRecommendationDetailsResponse {
  RecommendationDetailId?: string;
  RecommendationDetailData?: RecommendationDetailData;
}
export const GetSavingsPlanPurchaseRecommendationDetailsResponse = S.suspend(
  () =>
    S.Struct({
      RecommendationDetailId: S.optional(S.String),
      RecommendationDetailData: S.optional(RecommendationDetailData),
    }),
).annotations({
  identifier: "GetSavingsPlanPurchaseRecommendationDetailsResponse",
}) as any as S.Schema<GetSavingsPlanPurchaseRecommendationDetailsResponse>;
export interface GetSavingsPlansCoverageResponse {
  SavingsPlansCoverages: SavingsPlansCoverage[];
  NextToken?: string;
}
export const GetSavingsPlansCoverageResponse = S.suspend(() =>
  S.Struct({
    SavingsPlansCoverages: SavingsPlansCoverages,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSavingsPlansCoverageResponse",
}) as any as S.Schema<GetSavingsPlansCoverageResponse>;
export interface GetSavingsPlansUtilizationResponse {
  SavingsPlansUtilizationsByTime?: SavingsPlansUtilizationByTime[];
  Total: SavingsPlansUtilizationAggregates;
}
export const GetSavingsPlansUtilizationResponse = S.suspend(() =>
  S.Struct({
    SavingsPlansUtilizationsByTime: S.optional(SavingsPlansUtilizationsByTime),
    Total: SavingsPlansUtilizationAggregates,
  }),
).annotations({
  identifier: "GetSavingsPlansUtilizationResponse",
}) as any as S.Schema<GetSavingsPlansUtilizationResponse>;
export interface StartCommitmentPurchaseAnalysisRequest {
  CommitmentPurchaseAnalysisConfiguration: CommitmentPurchaseAnalysisConfiguration;
}
export const StartCommitmentPurchaseAnalysisRequest = S.suspend(() =>
  S.Struct({
    CommitmentPurchaseAnalysisConfiguration:
      CommitmentPurchaseAnalysisConfiguration,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartCommitmentPurchaseAnalysisRequest",
}) as any as S.Schema<StartCommitmentPurchaseAnalysisRequest>;
export interface UpdateCostAllocationTagsStatusResponse {
  Errors?: UpdateCostAllocationTagsStatusError[];
}
export const UpdateCostAllocationTagsStatusResponse = S.suspend(() =>
  S.Struct({ Errors: S.optional(UpdateCostAllocationTagsStatusErrors) }),
).annotations({
  identifier: "UpdateCostAllocationTagsStatusResponse",
}) as any as S.Schema<UpdateCostAllocationTagsStatusResponse>;
export interface AnomalyScore {
  MaxScore: number;
  CurrentScore: number;
}
export const AnomalyScore = S.suspend(() =>
  S.Struct({ MaxScore: S.Number, CurrentScore: S.Number }),
).annotations({ identifier: "AnomalyScore" }) as any as S.Schema<AnomalyScore>;
export interface Impact {
  MaxImpact: number;
  TotalImpact?: number;
  TotalActualSpend?: number;
  TotalExpectedSpend?: number;
  TotalImpactPercentage?: number;
}
export const Impact = S.suspend(() =>
  S.Struct({
    MaxImpact: S.Number,
    TotalImpact: S.optional(S.Number),
    TotalActualSpend: S.optional(S.Number),
    TotalExpectedSpend: S.optional(S.Number),
    TotalImpactPercentage: S.optional(S.Number),
  }),
).annotations({ identifier: "Impact" }) as any as S.Schema<Impact>;
export interface TerminateRecommendationDetail {
  EstimatedMonthlySavings?: string;
  CurrencyCode?: string;
}
export const TerminateRecommendationDetail = S.suspend(() =>
  S.Struct({
    EstimatedMonthlySavings: S.optional(S.String),
    CurrencyCode: S.optional(S.String),
  }),
).annotations({
  identifier: "TerminateRecommendationDetail",
}) as any as S.Schema<TerminateRecommendationDetail>;
export interface SavingsPlansPurchaseRecommendationDetail {
  SavingsPlansDetails?: SavingsPlansDetails;
  AccountId?: string;
  UpfrontCost?: string;
  EstimatedROI?: string;
  CurrencyCode?: string;
  EstimatedSPCost?: string;
  EstimatedOnDemandCost?: string;
  EstimatedOnDemandCostWithCurrentCommitment?: string;
  EstimatedSavingsAmount?: string;
  EstimatedSavingsPercentage?: string;
  HourlyCommitmentToPurchase?: string;
  EstimatedAverageUtilization?: string;
  EstimatedMonthlySavingsAmount?: string;
  CurrentMinimumHourlyOnDemandSpend?: string;
  CurrentMaximumHourlyOnDemandSpend?: string;
  CurrentAverageHourlyOnDemandSpend?: string;
  RecommendationDetailId?: string;
}
export const SavingsPlansPurchaseRecommendationDetail = S.suspend(() =>
  S.Struct({
    SavingsPlansDetails: S.optional(SavingsPlansDetails),
    AccountId: S.optional(S.String),
    UpfrontCost: S.optional(S.String),
    EstimatedROI: S.optional(S.String),
    CurrencyCode: S.optional(S.String),
    EstimatedSPCost: S.optional(S.String),
    EstimatedOnDemandCost: S.optional(S.String),
    EstimatedOnDemandCostWithCurrentCommitment: S.optional(S.String),
    EstimatedSavingsAmount: S.optional(S.String),
    EstimatedSavingsPercentage: S.optional(S.String),
    HourlyCommitmentToPurchase: S.optional(S.String),
    EstimatedAverageUtilization: S.optional(S.String),
    EstimatedMonthlySavingsAmount: S.optional(S.String),
    CurrentMinimumHourlyOnDemandSpend: S.optional(S.String),
    CurrentMaximumHourlyOnDemandSpend: S.optional(S.String),
    CurrentAverageHourlyOnDemandSpend: S.optional(S.String),
    RecommendationDetailId: S.optional(S.String),
  }),
).annotations({
  identifier: "SavingsPlansPurchaseRecommendationDetail",
}) as any as S.Schema<SavingsPlansPurchaseRecommendationDetail>;
export type SavingsPlansPurchaseRecommendationDetailList =
  SavingsPlansPurchaseRecommendationDetail[];
export const SavingsPlansPurchaseRecommendationDetailList = S.Array(
  SavingsPlansPurchaseRecommendationDetail,
);
export type PlatformDifference =
  | "HYPERVISOR"
  | "NETWORK_INTERFACE"
  | "STORAGE_INTERFACE"
  | "INSTANCE_STORE_AVAILABILITY"
  | "VIRTUALIZATION_TYPE";
export const PlatformDifference = S.Literal(
  "HYPERVISOR",
  "NETWORK_INTERFACE",
  "STORAGE_INTERFACE",
  "INSTANCE_STORE_AVAILABILITY",
  "VIRTUALIZATION_TYPE",
);
export type PlatformDifferences = PlatformDifference[];
export const PlatformDifferences = S.Array(PlatformDifference);
export interface ReservationPurchaseRecommendationMetadata {
  RecommendationId?: string;
  GenerationTimestamp?: string;
  AdditionalMetadata?: string;
}
export const ReservationPurchaseRecommendationMetadata = S.suspend(() =>
  S.Struct({
    RecommendationId: S.optional(S.String),
    GenerationTimestamp: S.optional(S.String),
    AdditionalMetadata: S.optional(S.String),
  }),
).annotations({
  identifier: "ReservationPurchaseRecommendationMetadata",
}) as any as S.Schema<ReservationPurchaseRecommendationMetadata>;
export interface SavingsPlansPurchaseRecommendation {
  AccountScope?: AccountScope;
  SavingsPlansType?: SupportedSavingsPlansType;
  TermInYears?: TermInYears;
  PaymentOption?: PaymentOption;
  LookbackPeriodInDays?: LookbackPeriodInDays;
  SavingsPlansPurchaseRecommendationDetails?: SavingsPlansPurchaseRecommendationDetail[];
  SavingsPlansPurchaseRecommendationSummary?: SavingsPlansPurchaseRecommendationSummary;
}
export const SavingsPlansPurchaseRecommendation = S.suspend(() =>
  S.Struct({
    AccountScope: S.optional(AccountScope),
    SavingsPlansType: S.optional(SupportedSavingsPlansType),
    TermInYears: S.optional(TermInYears),
    PaymentOption: S.optional(PaymentOption),
    LookbackPeriodInDays: S.optional(LookbackPeriodInDays),
    SavingsPlansPurchaseRecommendationDetails: S.optional(
      SavingsPlansPurchaseRecommendationDetailList,
    ),
    SavingsPlansPurchaseRecommendationSummary: S.optional(
      SavingsPlansPurchaseRecommendationSummary,
    ),
  }),
).annotations({
  identifier: "SavingsPlansPurchaseRecommendation",
}) as any as S.Schema<SavingsPlansPurchaseRecommendation>;
export interface RootCauseImpact {
  Contribution: number;
}
export const RootCauseImpact = S.suspend(() =>
  S.Struct({ Contribution: S.Number }),
).annotations({
  identifier: "RootCauseImpact",
}) as any as S.Schema<RootCauseImpact>;
export interface EC2ResourceDetails {
  HourlyOnDemandRate?: string;
  InstanceType?: string;
  Platform?: string;
  Region?: string;
  Sku?: string;
  Memory?: string;
  NetworkPerformance?: string;
  Storage?: string;
  Vcpu?: string;
}
export const EC2ResourceDetails = S.suspend(() =>
  S.Struct({
    HourlyOnDemandRate: S.optional(S.String),
    InstanceType: S.optional(S.String),
    Platform: S.optional(S.String),
    Region: S.optional(S.String),
    Sku: S.optional(S.String),
    Memory: S.optional(S.String),
    NetworkPerformance: S.optional(S.String),
    Storage: S.optional(S.String),
    Vcpu: S.optional(S.String),
  }),
).annotations({
  identifier: "EC2ResourceDetails",
}) as any as S.Schema<EC2ResourceDetails>;
export interface ResourceDetails {
  EC2ResourceDetails?: EC2ResourceDetails;
}
export const ResourceDetails = S.suspend(() =>
  S.Struct({ EC2ResourceDetails: S.optional(EC2ResourceDetails) }),
).annotations({
  identifier: "ResourceDetails",
}) as any as S.Schema<ResourceDetails>;
export interface EBSResourceUtilization {
  EbsReadOpsPerSecond?: string;
  EbsWriteOpsPerSecond?: string;
  EbsReadBytesPerSecond?: string;
  EbsWriteBytesPerSecond?: string;
}
export const EBSResourceUtilization = S.suspend(() =>
  S.Struct({
    EbsReadOpsPerSecond: S.optional(S.String),
    EbsWriteOpsPerSecond: S.optional(S.String),
    EbsReadBytesPerSecond: S.optional(S.String),
    EbsWriteBytesPerSecond: S.optional(S.String),
  }),
).annotations({
  identifier: "EBSResourceUtilization",
}) as any as S.Schema<EBSResourceUtilization>;
export interface DiskResourceUtilization {
  DiskReadOpsPerSecond?: string;
  DiskWriteOpsPerSecond?: string;
  DiskReadBytesPerSecond?: string;
  DiskWriteBytesPerSecond?: string;
}
export const DiskResourceUtilization = S.suspend(() =>
  S.Struct({
    DiskReadOpsPerSecond: S.optional(S.String),
    DiskWriteOpsPerSecond: S.optional(S.String),
    DiskReadBytesPerSecond: S.optional(S.String),
    DiskWriteBytesPerSecond: S.optional(S.String),
  }),
).annotations({
  identifier: "DiskResourceUtilization",
}) as any as S.Schema<DiskResourceUtilization>;
export interface NetworkResourceUtilization {
  NetworkInBytesPerSecond?: string;
  NetworkOutBytesPerSecond?: string;
  NetworkPacketsInPerSecond?: string;
  NetworkPacketsOutPerSecond?: string;
}
export const NetworkResourceUtilization = S.suspend(() =>
  S.Struct({
    NetworkInBytesPerSecond: S.optional(S.String),
    NetworkOutBytesPerSecond: S.optional(S.String),
    NetworkPacketsInPerSecond: S.optional(S.String),
    NetworkPacketsOutPerSecond: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkResourceUtilization",
}) as any as S.Schema<NetworkResourceUtilization>;
export interface EC2ResourceUtilization {
  MaxCpuUtilizationPercentage?: string;
  MaxMemoryUtilizationPercentage?: string;
  MaxStorageUtilizationPercentage?: string;
  EBSResourceUtilization?: EBSResourceUtilization;
  DiskResourceUtilization?: DiskResourceUtilization;
  NetworkResourceUtilization?: NetworkResourceUtilization;
}
export const EC2ResourceUtilization = S.suspend(() =>
  S.Struct({
    MaxCpuUtilizationPercentage: S.optional(S.String),
    MaxMemoryUtilizationPercentage: S.optional(S.String),
    MaxStorageUtilizationPercentage: S.optional(S.String),
    EBSResourceUtilization: S.optional(EBSResourceUtilization),
    DiskResourceUtilization: S.optional(DiskResourceUtilization),
    NetworkResourceUtilization: S.optional(NetworkResourceUtilization),
  }),
).annotations({
  identifier: "EC2ResourceUtilization",
}) as any as S.Schema<EC2ResourceUtilization>;
export interface ResourceUtilization {
  EC2ResourceUtilization?: EC2ResourceUtilization;
}
export const ResourceUtilization = S.suspend(() =>
  S.Struct({ EC2ResourceUtilization: S.optional(EC2ResourceUtilization) }),
).annotations({
  identifier: "ResourceUtilization",
}) as any as S.Schema<ResourceUtilization>;
export interface TargetInstance {
  EstimatedMonthlyCost?: string;
  EstimatedMonthlySavings?: string;
  CurrencyCode?: string;
  DefaultTargetInstance?: boolean;
  ResourceDetails?: ResourceDetails;
  ExpectedResourceUtilization?: ResourceUtilization;
  PlatformDifferences?: PlatformDifference[];
}
export const TargetInstance = S.suspend(() =>
  S.Struct({
    EstimatedMonthlyCost: S.optional(S.String),
    EstimatedMonthlySavings: S.optional(S.String),
    CurrencyCode: S.optional(S.String),
    DefaultTargetInstance: S.optional(S.Boolean),
    ResourceDetails: S.optional(ResourceDetails),
    ExpectedResourceUtilization: S.optional(ResourceUtilization),
    PlatformDifferences: S.optional(PlatformDifferences),
  }),
).annotations({
  identifier: "TargetInstance",
}) as any as S.Schema<TargetInstance>;
export type TargetInstancesList = TargetInstance[];
export const TargetInstancesList = S.Array(TargetInstance);
export interface GetSavingsPlansPurchaseRecommendationResponse {
  Metadata?: SavingsPlansPurchaseRecommendationMetadata;
  SavingsPlansPurchaseRecommendation?: SavingsPlansPurchaseRecommendation;
  NextPageToken?: string;
}
export const GetSavingsPlansPurchaseRecommendationResponse = S.suspend(() =>
  S.Struct({
    Metadata: S.optional(SavingsPlansPurchaseRecommendationMetadata),
    SavingsPlansPurchaseRecommendation: S.optional(
      SavingsPlansPurchaseRecommendation,
    ),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSavingsPlansPurchaseRecommendationResponse",
}) as any as S.Schema<GetSavingsPlansPurchaseRecommendationResponse>;
export interface StartCommitmentPurchaseAnalysisResponse {
  AnalysisId: string;
  AnalysisStartedTime: string;
  EstimatedCompletionTime: string;
}
export const StartCommitmentPurchaseAnalysisResponse = S.suspend(() =>
  S.Struct({
    AnalysisId: S.String,
    AnalysisStartedTime: S.String,
    EstimatedCompletionTime: S.String,
  }),
).annotations({
  identifier: "StartCommitmentPurchaseAnalysisResponse",
}) as any as S.Schema<StartCommitmentPurchaseAnalysisResponse>;
export interface RootCause {
  Service?: string;
  Region?: string;
  LinkedAccount?: string;
  LinkedAccountName?: string;
  UsageType?: string;
  Impact?: RootCauseImpact;
}
export const RootCause = S.suspend(() =>
  S.Struct({
    Service: S.optional(S.String),
    Region: S.optional(S.String),
    LinkedAccount: S.optional(S.String),
    LinkedAccountName: S.optional(S.String),
    UsageType: S.optional(S.String),
    Impact: S.optional(RootCauseImpact),
  }),
).annotations({ identifier: "RootCause" }) as any as S.Schema<RootCause>;
export type RootCauses = RootCause[];
export const RootCauses = S.Array(RootCause);
export interface ReservationPurchaseRecommendationSummary {
  TotalEstimatedMonthlySavingsAmount?: string;
  TotalEstimatedMonthlySavingsPercentage?: string;
  CurrencyCode?: string;
}
export const ReservationPurchaseRecommendationSummary = S.suspend(() =>
  S.Struct({
    TotalEstimatedMonthlySavingsAmount: S.optional(S.String),
    TotalEstimatedMonthlySavingsPercentage: S.optional(S.String),
    CurrencyCode: S.optional(S.String),
  }),
).annotations({
  identifier: "ReservationPurchaseRecommendationSummary",
}) as any as S.Schema<ReservationPurchaseRecommendationSummary>;
export interface ModifyRecommendationDetail {
  TargetInstances?: TargetInstance[];
}
export const ModifyRecommendationDetail = S.suspend(() =>
  S.Struct({ TargetInstances: S.optional(TargetInstancesList) }),
).annotations({
  identifier: "ModifyRecommendationDetail",
}) as any as S.Schema<ModifyRecommendationDetail>;
export interface Anomaly {
  AnomalyId: string;
  AnomalyStartDate?: string;
  AnomalyEndDate?: string;
  DimensionValue?: string;
  RootCauses?: RootCause[];
  AnomalyScore: AnomalyScore;
  Impact: Impact;
  MonitorArn: string;
  Feedback?: AnomalyFeedbackType;
}
export const Anomaly = S.suspend(() =>
  S.Struct({
    AnomalyId: S.String,
    AnomalyStartDate: S.optional(S.String),
    AnomalyEndDate: S.optional(S.String),
    DimensionValue: S.optional(S.String),
    RootCauses: S.optional(RootCauses),
    AnomalyScore: AnomalyScore,
    Impact: Impact,
    MonitorArn: S.String,
    Feedback: S.optional(AnomalyFeedbackType),
  }),
).annotations({ identifier: "Anomaly" }) as any as S.Schema<Anomaly>;
export type Anomalies = Anomaly[];
export const Anomalies = S.Array(Anomaly);
export interface GetAnomaliesResponse {
  Anomalies: Anomaly[];
  NextPageToken?: string;
}
export const GetAnomaliesResponse = S.suspend(() =>
  S.Struct({ Anomalies: Anomalies, NextPageToken: S.optional(S.String) }),
).annotations({
  identifier: "GetAnomaliesResponse",
}) as any as S.Schema<GetAnomaliesResponse>;
export interface EC2InstanceDetails {
  Family?: string;
  InstanceType?: string;
  Region?: string;
  AvailabilityZone?: string;
  Platform?: string;
  Tenancy?: string;
  CurrentGeneration?: boolean;
  SizeFlexEligible?: boolean;
}
export const EC2InstanceDetails = S.suspend(() =>
  S.Struct({
    Family: S.optional(S.String),
    InstanceType: S.optional(S.String),
    Region: S.optional(S.String),
    AvailabilityZone: S.optional(S.String),
    Platform: S.optional(S.String),
    Tenancy: S.optional(S.String),
    CurrentGeneration: S.optional(S.Boolean),
    SizeFlexEligible: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "EC2InstanceDetails",
}) as any as S.Schema<EC2InstanceDetails>;
export interface RDSInstanceDetails {
  Family?: string;
  InstanceType?: string;
  Region?: string;
  DatabaseEngine?: string;
  DatabaseEdition?: string;
  DeploymentOption?: string;
  LicenseModel?: string;
  CurrentGeneration?: boolean;
  SizeFlexEligible?: boolean;
  DeploymentModel?: string;
}
export const RDSInstanceDetails = S.suspend(() =>
  S.Struct({
    Family: S.optional(S.String),
    InstanceType: S.optional(S.String),
    Region: S.optional(S.String),
    DatabaseEngine: S.optional(S.String),
    DatabaseEdition: S.optional(S.String),
    DeploymentOption: S.optional(S.String),
    LicenseModel: S.optional(S.String),
    CurrentGeneration: S.optional(S.Boolean),
    SizeFlexEligible: S.optional(S.Boolean),
    DeploymentModel: S.optional(S.String),
  }),
).annotations({
  identifier: "RDSInstanceDetails",
}) as any as S.Schema<RDSInstanceDetails>;
export interface RedshiftInstanceDetails {
  Family?: string;
  NodeType?: string;
  Region?: string;
  CurrentGeneration?: boolean;
  SizeFlexEligible?: boolean;
}
export const RedshiftInstanceDetails = S.suspend(() =>
  S.Struct({
    Family: S.optional(S.String),
    NodeType: S.optional(S.String),
    Region: S.optional(S.String),
    CurrentGeneration: S.optional(S.Boolean),
    SizeFlexEligible: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "RedshiftInstanceDetails",
}) as any as S.Schema<RedshiftInstanceDetails>;
export interface ElastiCacheInstanceDetails {
  Family?: string;
  NodeType?: string;
  Region?: string;
  ProductDescription?: string;
  CurrentGeneration?: boolean;
  SizeFlexEligible?: boolean;
}
export const ElastiCacheInstanceDetails = S.suspend(() =>
  S.Struct({
    Family: S.optional(S.String),
    NodeType: S.optional(S.String),
    Region: S.optional(S.String),
    ProductDescription: S.optional(S.String),
    CurrentGeneration: S.optional(S.Boolean),
    SizeFlexEligible: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ElastiCacheInstanceDetails",
}) as any as S.Schema<ElastiCacheInstanceDetails>;
export interface ESInstanceDetails {
  InstanceClass?: string;
  InstanceSize?: string;
  Region?: string;
  CurrentGeneration?: boolean;
  SizeFlexEligible?: boolean;
}
export const ESInstanceDetails = S.suspend(() =>
  S.Struct({
    InstanceClass: S.optional(S.String),
    InstanceSize: S.optional(S.String),
    Region: S.optional(S.String),
    CurrentGeneration: S.optional(S.Boolean),
    SizeFlexEligible: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ESInstanceDetails",
}) as any as S.Schema<ESInstanceDetails>;
export interface MemoryDBInstanceDetails {
  Family?: string;
  NodeType?: string;
  Region?: string;
  CurrentGeneration?: boolean;
  SizeFlexEligible?: boolean;
}
export const MemoryDBInstanceDetails = S.suspend(() =>
  S.Struct({
    Family: S.optional(S.String),
    NodeType: S.optional(S.String),
    Region: S.optional(S.String),
    CurrentGeneration: S.optional(S.Boolean),
    SizeFlexEligible: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "MemoryDBInstanceDetails",
}) as any as S.Schema<MemoryDBInstanceDetails>;
export interface DynamoDBCapacityDetails {
  CapacityUnits?: string;
  Region?: string;
}
export const DynamoDBCapacityDetails = S.suspend(() =>
  S.Struct({
    CapacityUnits: S.optional(S.String),
    Region: S.optional(S.String),
  }),
).annotations({
  identifier: "DynamoDBCapacityDetails",
}) as any as S.Schema<DynamoDBCapacityDetails>;
export interface InstanceDetails {
  EC2InstanceDetails?: EC2InstanceDetails;
  RDSInstanceDetails?: RDSInstanceDetails;
  RedshiftInstanceDetails?: RedshiftInstanceDetails;
  ElastiCacheInstanceDetails?: ElastiCacheInstanceDetails;
  ESInstanceDetails?: ESInstanceDetails;
  MemoryDBInstanceDetails?: MemoryDBInstanceDetails;
}
export const InstanceDetails = S.suspend(() =>
  S.Struct({
    EC2InstanceDetails: S.optional(EC2InstanceDetails),
    RDSInstanceDetails: S.optional(RDSInstanceDetails),
    RedshiftInstanceDetails: S.optional(RedshiftInstanceDetails),
    ElastiCacheInstanceDetails: S.optional(ElastiCacheInstanceDetails),
    ESInstanceDetails: S.optional(ESInstanceDetails),
    MemoryDBInstanceDetails: S.optional(MemoryDBInstanceDetails),
  }),
).annotations({
  identifier: "InstanceDetails",
}) as any as S.Schema<InstanceDetails>;
export interface ReservedCapacityDetails {
  DynamoDBCapacityDetails?: DynamoDBCapacityDetails;
}
export const ReservedCapacityDetails = S.suspend(() =>
  S.Struct({ DynamoDBCapacityDetails: S.optional(DynamoDBCapacityDetails) }),
).annotations({
  identifier: "ReservedCapacityDetails",
}) as any as S.Schema<ReservedCapacityDetails>;
export interface ReservationPurchaseRecommendationDetail {
  AccountId?: string;
  InstanceDetails?: InstanceDetails;
  RecommendedNumberOfInstancesToPurchase?: string;
  RecommendedNormalizedUnitsToPurchase?: string;
  MinimumNumberOfInstancesUsedPerHour?: string;
  MinimumNormalizedUnitsUsedPerHour?: string;
  MaximumNumberOfInstancesUsedPerHour?: string;
  MaximumNormalizedUnitsUsedPerHour?: string;
  AverageNumberOfInstancesUsedPerHour?: string;
  AverageNormalizedUnitsUsedPerHour?: string;
  AverageUtilization?: string;
  EstimatedBreakEvenInMonths?: string;
  CurrencyCode?: string;
  EstimatedMonthlySavingsAmount?: string;
  EstimatedMonthlySavingsPercentage?: string;
  EstimatedMonthlyOnDemandCost?: string;
  EstimatedReservationCostForLookbackPeriod?: string;
  UpfrontCost?: string;
  RecurringStandardMonthlyCost?: string;
  ReservedCapacityDetails?: ReservedCapacityDetails;
  RecommendedNumberOfCapacityUnitsToPurchase?: string;
  MinimumNumberOfCapacityUnitsUsedPerHour?: string;
  MaximumNumberOfCapacityUnitsUsedPerHour?: string;
  AverageNumberOfCapacityUnitsUsedPerHour?: string;
}
export const ReservationPurchaseRecommendationDetail = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    InstanceDetails: S.optional(InstanceDetails),
    RecommendedNumberOfInstancesToPurchase: S.optional(S.String),
    RecommendedNormalizedUnitsToPurchase: S.optional(S.String),
    MinimumNumberOfInstancesUsedPerHour: S.optional(S.String),
    MinimumNormalizedUnitsUsedPerHour: S.optional(S.String),
    MaximumNumberOfInstancesUsedPerHour: S.optional(S.String),
    MaximumNormalizedUnitsUsedPerHour: S.optional(S.String),
    AverageNumberOfInstancesUsedPerHour: S.optional(S.String),
    AverageNormalizedUnitsUsedPerHour: S.optional(S.String),
    AverageUtilization: S.optional(S.String),
    EstimatedBreakEvenInMonths: S.optional(S.String),
    CurrencyCode: S.optional(S.String),
    EstimatedMonthlySavingsAmount: S.optional(S.String),
    EstimatedMonthlySavingsPercentage: S.optional(S.String),
    EstimatedMonthlyOnDemandCost: S.optional(S.String),
    EstimatedReservationCostForLookbackPeriod: S.optional(S.String),
    UpfrontCost: S.optional(S.String),
    RecurringStandardMonthlyCost: S.optional(S.String),
    ReservedCapacityDetails: S.optional(ReservedCapacityDetails),
    RecommendedNumberOfCapacityUnitsToPurchase: S.optional(S.String),
    MinimumNumberOfCapacityUnitsUsedPerHour: S.optional(S.String),
    MaximumNumberOfCapacityUnitsUsedPerHour: S.optional(S.String),
    AverageNumberOfCapacityUnitsUsedPerHour: S.optional(S.String),
  }),
).annotations({
  identifier: "ReservationPurchaseRecommendationDetail",
}) as any as S.Schema<ReservationPurchaseRecommendationDetail>;
export type ReservationPurchaseRecommendationDetails =
  ReservationPurchaseRecommendationDetail[];
export const ReservationPurchaseRecommendationDetails = S.Array(
  ReservationPurchaseRecommendationDetail,
);
export interface CurrentInstance {
  ResourceId?: string;
  InstanceName?: string;
  Tags?: TagValues[];
  ResourceDetails?: ResourceDetails;
  ResourceUtilization?: ResourceUtilization;
  ReservationCoveredHoursInLookbackPeriod?: string;
  SavingsPlansCoveredHoursInLookbackPeriod?: string;
  OnDemandHoursInLookbackPeriod?: string;
  TotalRunningHoursInLookbackPeriod?: string;
  MonthlyCost?: string;
  CurrencyCode?: string;
}
export const CurrentInstance = S.suspend(() =>
  S.Struct({
    ResourceId: S.optional(S.String),
    InstanceName: S.optional(S.String),
    Tags: S.optional(TagValuesList),
    ResourceDetails: S.optional(ResourceDetails),
    ResourceUtilization: S.optional(ResourceUtilization),
    ReservationCoveredHoursInLookbackPeriod: S.optional(S.String),
    SavingsPlansCoveredHoursInLookbackPeriod: S.optional(S.String),
    OnDemandHoursInLookbackPeriod: S.optional(S.String),
    TotalRunningHoursInLookbackPeriod: S.optional(S.String),
    MonthlyCost: S.optional(S.String),
    CurrencyCode: S.optional(S.String),
  }),
).annotations({
  identifier: "CurrentInstance",
}) as any as S.Schema<CurrentInstance>;
export interface ReservationPurchaseRecommendation {
  AccountScope?: AccountScope;
  LookbackPeriodInDays?: LookbackPeriodInDays;
  TermInYears?: TermInYears;
  PaymentOption?: PaymentOption;
  ServiceSpecification?: ServiceSpecification;
  RecommendationDetails?: ReservationPurchaseRecommendationDetail[];
  RecommendationSummary?: ReservationPurchaseRecommendationSummary;
}
export const ReservationPurchaseRecommendation = S.suspend(() =>
  S.Struct({
    AccountScope: S.optional(AccountScope),
    LookbackPeriodInDays: S.optional(LookbackPeriodInDays),
    TermInYears: S.optional(TermInYears),
    PaymentOption: S.optional(PaymentOption),
    ServiceSpecification: S.optional(ServiceSpecification),
    RecommendationDetails: S.optional(ReservationPurchaseRecommendationDetails),
    RecommendationSummary: S.optional(ReservationPurchaseRecommendationSummary),
  }),
).annotations({
  identifier: "ReservationPurchaseRecommendation",
}) as any as S.Schema<ReservationPurchaseRecommendation>;
export type ReservationPurchaseRecommendations =
  ReservationPurchaseRecommendation[];
export const ReservationPurchaseRecommendations = S.Array(
  ReservationPurchaseRecommendation,
);
export interface RightsizingRecommendation {
  AccountId?: string;
  CurrentInstance?: CurrentInstance;
  RightsizingType?: RightsizingType;
  ModifyRecommendationDetail?: ModifyRecommendationDetail;
  TerminateRecommendationDetail?: TerminateRecommendationDetail;
  FindingReasonCodes?: FindingReasonCode[];
}
export const RightsizingRecommendation = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    CurrentInstance: S.optional(CurrentInstance),
    RightsizingType: S.optional(RightsizingType),
    ModifyRecommendationDetail: S.optional(ModifyRecommendationDetail),
    TerminateRecommendationDetail: S.optional(TerminateRecommendationDetail),
    FindingReasonCodes: S.optional(FindingReasonCodes),
  }),
).annotations({
  identifier: "RightsizingRecommendation",
}) as any as S.Schema<RightsizingRecommendation>;
export type RightsizingRecommendationList = RightsizingRecommendation[];
export const RightsizingRecommendationList = S.Array(RightsizingRecommendation);
export interface GetReservationPurchaseRecommendationResponse {
  Metadata?: ReservationPurchaseRecommendationMetadata;
  Recommendations?: ReservationPurchaseRecommendation[];
  NextPageToken?: string;
}
export const GetReservationPurchaseRecommendationResponse = S.suspend(() =>
  S.Struct({
    Metadata: S.optional(ReservationPurchaseRecommendationMetadata),
    Recommendations: S.optional(ReservationPurchaseRecommendations),
    NextPageToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetReservationPurchaseRecommendationResponse",
}) as any as S.Schema<GetReservationPurchaseRecommendationResponse>;
export interface GetRightsizingRecommendationResponse {
  Metadata?: RightsizingRecommendationMetadata;
  Summary?: RightsizingRecommendationSummary;
  RightsizingRecommendations?: RightsizingRecommendation[];
  NextPageToken?: string;
  Configuration?: RightsizingRecommendationConfiguration;
}
export const GetRightsizingRecommendationResponse = S.suspend(() =>
  S.Struct({
    Metadata: S.optional(RightsizingRecommendationMetadata),
    Summary: S.optional(RightsizingRecommendationSummary),
    RightsizingRecommendations: S.optional(RightsizingRecommendationList),
    NextPageToken: S.optional(S.String),
    Configuration: S.optional(RightsizingRecommendationConfiguration),
  }),
).annotations({
  identifier: "GetRightsizingRecommendationResponse",
}) as any as S.Schema<GetRightsizingRecommendationResponse>;

//# Errors
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class DataUnavailableException extends S.TaggedError<DataUnavailableException>()(
  "DataUnavailableException",
  { Message: S.optional(S.String) },
) {}
export class UnknownMonitorException extends S.TaggedError<UnknownMonitorException>()(
  "UnknownMonitorException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class BillExpirationException extends S.TaggedError<BillExpirationException>()(
  "BillExpirationException",
  { Message: S.optional(S.String) },
) {}
export class BillingViewHealthStatusException extends S.TaggedError<BillingViewHealthStatusException>()(
  "BillingViewHealthStatusException",
  { Message: S.optional(S.String) },
) {}
export class BackfillLimitExceededException extends S.TaggedError<BackfillLimitExceededException>()(
  "BackfillLimitExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class GenerationExistsException extends S.TaggedError<GenerationExistsException>()(
  "GenerationExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnknownSubscriptionException extends S.TaggedError<UnknownSubscriptionException>()(
  "UnknownSubscriptionException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnresolvableUsageUnitException extends S.TaggedError<UnresolvableUsageUnitException>()(
  "UnresolvableUsageUnitException",
  { Message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class TooManyTagsException extends S.TaggedError<TooManyTagsException>()(
  "TooManyTagsException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class RequestChangedException extends S.TaggedError<RequestChangedException>()(
  "RequestChangedException",
  { Message: S.optional(S.String) },
) {}
export class AnalysisNotFoundException extends S.TaggedError<AnalysisNotFoundException>()(
  "AnalysisNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Modifies the feedback property of a given cost anomaly.
 */
export const provideAnomalyFeedback: (
  input: ProvideAnomalyFeedbackRequest,
) => effect.Effect<
  ProvideAnomalyFeedbackResponse,
  LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ProvideAnomalyFeedbackRequest,
  output: ProvideAnomalyFeedbackResponse,
  errors: [LimitExceededException],
}));
/**
 * Creates a new cost anomaly detection monitor with the requested type and monitor
 * specification.
 */
export const createAnomalyMonitor: (
  input: CreateAnomalyMonitorRequest,
) => effect.Effect<
  CreateAnomalyMonitorResponse,
  LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAnomalyMonitorRequest,
  output: CreateAnomalyMonitorResponse,
  errors: [LimitExceededException],
}));
/**
 * Deletes a cost anomaly monitor.
 */
export const deleteAnomalyMonitor: (
  input: DeleteAnomalyMonitorRequest,
) => effect.Effect<
  DeleteAnomalyMonitorResponse,
  LimitExceededException | UnknownMonitorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAnomalyMonitorRequest,
  output: DeleteAnomalyMonitorResponse,
  errors: [LimitExceededException, UnknownMonitorException],
}));
/**
 * Deletes a cost category. Expenses from this month going forward will no longer be
 * categorized with this cost category.
 */
export const deleteCostCategoryDefinition: (
  input: DeleteCostCategoryDefinitionRequest,
) => effect.Effect<
  DeleteCostCategoryDefinitionResponse,
  LimitExceededException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCostCategoryDefinitionRequest,
  output: DeleteCostCategoryDefinitionResponse,
  errors: [LimitExceededException, ResourceNotFoundException],
}));
/**
 * Retrieves the cost anomaly monitor definitions for your account. You can filter using a
 * list of cost anomaly monitor Amazon Resource Names (ARNs).
 */
export const getAnomalyMonitors: {
  (
    input: GetAnomalyMonitorsRequest,
  ): effect.Effect<
    GetAnomalyMonitorsResponse,
    | InvalidNextTokenException
    | LimitExceededException
    | UnknownMonitorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAnomalyMonitorsRequest,
  ) => stream.Stream<
    GetAnomalyMonitorsResponse,
    | InvalidNextTokenException
    | LimitExceededException
    | UnknownMonitorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAnomalyMonitorsRequest,
  ) => stream.Stream<
    AnomalyMonitor,
    | InvalidNextTokenException
    | LimitExceededException
    | UnknownMonitorException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetAnomalyMonitorsRequest,
  output: GetAnomalyMonitorsResponse,
  errors: [
    InvalidNextTokenException,
    LimitExceededException,
    UnknownMonitorException,
  ],
  pagination: {
    inputToken: "NextPageToken",
    outputToken: "NextPageToken",
    items: "AnomalyMonitors",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves estimated usage records for hourly granularity or resource-level data at daily
 * granularity.
 */
export const getApproximateUsageRecords: (
  input: GetApproximateUsageRecordsRequest,
) => effect.Effect<
  GetApproximateUsageRecordsResponse,
  DataUnavailableException | LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApproximateUsageRecordsRequest,
  output: GetApproximateUsageRecordsResponse,
  errors: [DataUnavailableException, LimitExceededException],
}));
/**
 * Retrieves attribute data along with aggregate utilization and savings data for a given
 * time period. This doesn't support granular or grouped data (daily/monthly) in response. You
 * can't retrieve data by dates in a single response similar to
 * `GetSavingsPlanUtilization`, but you have the option to make multiple calls to
 * `GetSavingsPlanUtilizationDetails` by providing individual dates. You can use
 * `GetDimensionValues` in `SAVINGS_PLANS` to determine the possible
 * dimension values.
 *
 * `GetSavingsPlanUtilizationDetails` internally groups data by
 * `SavingsPlansArn`.
 */
export const getSavingsPlansUtilizationDetails: {
  (
    input: GetSavingsPlansUtilizationDetailsRequest,
  ): effect.Effect<
    GetSavingsPlansUtilizationDetailsResponse,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetSavingsPlansUtilizationDetailsRequest,
  ) => stream.Stream<
    GetSavingsPlansUtilizationDetailsResponse,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetSavingsPlansUtilizationDetailsRequest,
  ) => stream.Stream<
    unknown,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetSavingsPlansUtilizationDetailsRequest,
  output: GetSavingsPlansUtilizationDetailsResponse,
  errors: [
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the commitment purchase analyses for your account.
 */
export const listCommitmentPurchaseAnalyses: {
  (
    input: ListCommitmentPurchaseAnalysesRequest,
  ): effect.Effect<
    ListCommitmentPurchaseAnalysesResponse,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCommitmentPurchaseAnalysesRequest,
  ) => stream.Stream<
    ListCommitmentPurchaseAnalysesResponse,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCommitmentPurchaseAnalysesRequest,
  ) => stream.Stream<
    AnalysisSummary,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCommitmentPurchaseAnalysesRequest,
  output: ListCommitmentPurchaseAnalysesResponse,
  errors: [
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextPageToken",
    outputToken: "NextPageToken",
    items: "AnalysisSummaryList",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Retrieves a list of your historical cost allocation tag backfill requests.
 */
export const listCostAllocationTagBackfillHistory: {
  (
    input: ListCostAllocationTagBackfillHistoryRequest,
  ): effect.Effect<
    ListCostAllocationTagBackfillHistoryResponse,
    InvalidNextTokenException | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCostAllocationTagBackfillHistoryRequest,
  ) => stream.Stream<
    ListCostAllocationTagBackfillHistoryResponse,
    InvalidNextTokenException | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCostAllocationTagBackfillHistoryRequest,
  ) => stream.Stream<
    CostAllocationTagBackfillRequest,
    InvalidNextTokenException | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCostAllocationTagBackfillHistoryRequest,
  output: ListCostAllocationTagBackfillHistoryResponse,
  errors: [InvalidNextTokenException, LimitExceededException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "BackfillRequests",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Get a list of cost allocation tags. All inputs in the API are optional and serve as
 * filters. By default, all cost allocation tags are returned.
 */
export const listCostAllocationTags: {
  (
    input: ListCostAllocationTagsRequest,
  ): effect.Effect<
    ListCostAllocationTagsResponse,
    InvalidNextTokenException | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCostAllocationTagsRequest,
  ) => stream.Stream<
    ListCostAllocationTagsResponse,
    InvalidNextTokenException | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCostAllocationTagsRequest,
  ) => stream.Stream<
    CostAllocationTag,
    InvalidNextTokenException | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCostAllocationTagsRequest,
  output: ListCostAllocationTagsResponse,
  errors: [InvalidNextTokenException, LimitExceededException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CostAllocationTags",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the name, Amazon Resource Name (ARN), `NumberOfRules` and effective
 * dates of all cost categories defined in the account. You have the option to use
 * `EffectiveOn` and `SupportedResourceTypes` to return a list of cost categories that were active on a specific
 * date. If there is no `EffectiveOn` specified, you’ll see cost categories that are
 * effective on the current date. If cost category is still effective, `EffectiveEnd`
 * is omitted in the response. `ListCostCategoryDefinitions` supports pagination. The
 * request can have a `MaxResults` range up to 100.
 */
export const listCostCategoryDefinitions: {
  (
    input: ListCostCategoryDefinitionsRequest,
  ): effect.Effect<
    ListCostCategoryDefinitionsResponse,
    LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCostCategoryDefinitionsRequest,
  ) => stream.Stream<
    ListCostCategoryDefinitionsResponse,
    LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCostCategoryDefinitionsRequest,
  ) => stream.Stream<
    CostCategoryReference,
    LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCostCategoryDefinitionsRequest,
  output: ListCostCategoryDefinitionsResponse,
  errors: [LimitExceededException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CostCategoryReferences",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns resource associations of all cost categories defined in the account. You have the option to use `CostCategoryArn` to get the association for a specific cost category. `ListCostCategoryResourceAssociations` supports pagination. The request can have a `MaxResults` range up to 100.
 */
export const listCostCategoryResourceAssociations: {
  (
    input: ListCostCategoryResourceAssociationsRequest,
  ): effect.Effect<
    ListCostCategoryResourceAssociationsResponse,
    LimitExceededException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCostCategoryResourceAssociationsRequest,
  ) => stream.Stream<
    ListCostCategoryResourceAssociationsResponse,
    LimitExceededException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCostCategoryResourceAssociationsRequest,
  ) => stream.Stream<
    CostCategoryResourceAssociation,
    LimitExceededException | ResourceNotFoundException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCostCategoryResourceAssociationsRequest,
  output: ListCostCategoryResourceAssociationsResponse,
  errors: [LimitExceededException, ResourceNotFoundException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "CostCategoryResourceAssociations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of your historical recommendation generations within the past 30
 * days.
 */
export const listSavingsPlansPurchaseRecommendationGeneration: {
  (
    input: ListSavingsPlansPurchaseRecommendationGenerationRequest,
  ): effect.Effect<
    ListSavingsPlansPurchaseRecommendationGenerationResponse,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSavingsPlansPurchaseRecommendationGenerationRequest,
  ) => stream.Stream<
    ListSavingsPlansPurchaseRecommendationGenerationResponse,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSavingsPlansPurchaseRecommendationGenerationRequest,
  ) => stream.Stream<
    GenerationSummary,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSavingsPlansPurchaseRecommendationGenerationRequest,
  output: ListSavingsPlansPurchaseRecommendationGenerationResponse,
  errors: [
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextPageToken",
    outputToken: "NextPageToken",
    items: "GenerationSummaryList",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Request a cost allocation tag backfill. This will backfill the activation status (either `active` or `inactive`) for all tag keys from `para:BackfillFrom` up to the time this request is made.
 *
 * You can request a backfill once every 24 hours.
 */
export const startCostAllocationTagBackfill: (
  input: StartCostAllocationTagBackfillRequest,
) => effect.Effect<
  StartCostAllocationTagBackfillResponse,
  BackfillLimitExceededException | LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCostAllocationTagBackfillRequest,
  output: StartCostAllocationTagBackfillResponse,
  errors: [BackfillLimitExceededException, LimitExceededException],
}));
/**
 * Deletes a cost anomaly subscription.
 */
export const deleteAnomalySubscription: (
  input: DeleteAnomalySubscriptionRequest,
) => effect.Effect<
  DeleteAnomalySubscriptionResponse,
  LimitExceededException | UnknownSubscriptionException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAnomalySubscriptionRequest,
  output: DeleteAnomalySubscriptionResponse,
  errors: [LimitExceededException, UnknownSubscriptionException],
}));
/**
 * Updates an existing cost anomaly monitor. The changes made are applied going forward, and
 * doesn't change anomalies detected in the past.
 */
export const updateAnomalyMonitor: (
  input: UpdateAnomalyMonitorRequest,
) => effect.Effect<
  UpdateAnomalyMonitorResponse,
  LimitExceededException | UnknownMonitorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAnomalyMonitorRequest,
  output: UpdateAnomalyMonitorResponse,
  errors: [LimitExceededException, UnknownMonitorException],
}));
/**
 * Adds an alert subscription to a cost anomaly detection monitor. You can use each
 * subscription to define subscribers with email or SNS notifications. Email subscribers can set
 * an absolute or percentage threshold and a time frequency for receiving notifications.
 */
export const createAnomalySubscription: (
  input: CreateAnomalySubscriptionRequest,
) => effect.Effect<
  CreateAnomalySubscriptionResponse,
  LimitExceededException | UnknownMonitorException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAnomalySubscriptionRequest,
  output: CreateAnomalySubscriptionResponse,
  errors: [LimitExceededException, UnknownMonitorException],
}));
/**
 * Returns a list of resource tags associated with the resource specified by the Amazon
 * Resource Name (ARN).
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  LimitExceededException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [LimitExceededException, ResourceNotFoundException],
}));
/**
 * Removes one or more tags from a resource. Specify only tag keys in your request. Don't
 * specify the value.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  LimitExceededException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [LimitExceededException, ResourceNotFoundException],
}));
/**
 * Retrieves the cost anomaly subscription objects for your account. You can filter using a
 * list of cost anomaly monitor Amazon Resource Names (ARNs).
 */
export const getAnomalySubscriptions: {
  (
    input: GetAnomalySubscriptionsRequest,
  ): effect.Effect<
    GetAnomalySubscriptionsResponse,
    | InvalidNextTokenException
    | LimitExceededException
    | UnknownSubscriptionException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAnomalySubscriptionsRequest,
  ) => stream.Stream<
    GetAnomalySubscriptionsResponse,
    | InvalidNextTokenException
    | LimitExceededException
    | UnknownSubscriptionException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAnomalySubscriptionsRequest,
  ) => stream.Stream<
    AnomalySubscription,
    | InvalidNextTokenException
    | LimitExceededException
    | UnknownSubscriptionException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetAnomalySubscriptionsRequest,
  output: GetAnomalySubscriptionsResponse,
  errors: [
    InvalidNextTokenException,
    LimitExceededException,
    UnknownSubscriptionException,
  ],
  pagination: {
    inputToken: "NextPageToken",
    outputToken: "NextPageToken",
    items: "AnomalySubscriptions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a forecast for how much Amazon Web Services predicts that you will spend over
 * the forecast time period that you select, based on your past costs.
 */
export const getCostForecast: (
  input: GetCostForecastRequest,
) => effect.Effect<
  GetCostForecastResponse,
  | BillingViewHealthStatusException
  | DataUnavailableException
  | LimitExceededException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCostForecastRequest,
  output: GetCostForecastResponse,
  errors: [
    BillingViewHealthStatusException,
    DataUnavailableException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an existing cost anomaly subscription. Specify the fields that you want to update.
 * Omitted fields are unchanged.
 *
 * The JSON below describes the generic construct for each type. See Request Parameters for possible values as they apply to
 * `AnomalySubscription`.
 */
export const updateAnomalySubscription: (
  input: UpdateAnomalySubscriptionRequest,
) => effect.Effect<
  UpdateAnomalySubscriptionResponse,
  | LimitExceededException
  | UnknownMonitorException
  | UnknownSubscriptionException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateAnomalySubscriptionRequest,
  output: UpdateAnomalySubscriptionResponse,
  errors: [
    LimitExceededException,
    UnknownMonitorException,
    UnknownSubscriptionException,
  ],
}));
/**
 * Returns the name, Amazon Resource Name (ARN), rules, definition, and effective dates of a
 * cost category that's defined in the account.
 *
 * You have the option to use `EffectiveOn` to return a cost category that's
 * active on a specific date. If there's no `EffectiveOn` specified, you see a Cost
 * Category that's effective on the current date. If cost category is still effective,
 * `EffectiveEnd` is omitted in the response.
 */
export const describeCostCategoryDefinition: (
  input: DescribeCostCategoryDefinitionRequest,
) => effect.Effect<
  DescribeCostCategoryDefinitionResponse,
  LimitExceededException | ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeCostCategoryDefinitionRequest,
  output: DescribeCostCategoryDefinitionResponse,
  errors: [LimitExceededException, ResourceNotFoundException],
}));
/**
 * Retrieves cost and usage comparisons for your account between two periods within the last
 * 13 months. If you have enabled multi-year data at monthly granularity, you can go back up to
 * 38 months.
 */
export const getCostAndUsageComparisons: {
  (
    input: GetCostAndUsageComparisonsRequest,
  ): effect.Effect<
    GetCostAndUsageComparisonsResponse,
    | BillingViewHealthStatusException
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCostAndUsageComparisonsRequest,
  ) => stream.Stream<
    GetCostAndUsageComparisonsResponse,
    | BillingViewHealthStatusException
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCostAndUsageComparisonsRequest,
  ) => stream.Stream<
    CostAndUsageComparison,
    | BillingViewHealthStatusException
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetCostAndUsageComparisonsRequest,
  output: GetCostAndUsageComparisonsResponse,
  errors: [
    BillingViewHealthStatusException,
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextPageToken",
    outputToken: "NextPageToken",
    items: "CostAndUsageComparisons",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves key factors driving cost changes between two time periods within the last 13
 * months, such as usage changes, discount changes, and commitment-based savings. If you have
 * enabled multi-year data at monthly granularity, you can go back up to 38 months.
 */
export const getCostComparisonDrivers: {
  (
    input: GetCostComparisonDriversRequest,
  ): effect.Effect<
    GetCostComparisonDriversResponse,
    | BillingViewHealthStatusException
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCostComparisonDriversRequest,
  ) => stream.Stream<
    GetCostComparisonDriversResponse,
    | BillingViewHealthStatusException
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCostComparisonDriversRequest,
  ) => stream.Stream<
    CostComparisonDriver,
    | BillingViewHealthStatusException
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetCostComparisonDriversRequest,
  output: GetCostComparisonDriversResponse,
  errors: [
    BillingViewHealthStatusException,
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextPageToken",
    outputToken: "NextPageToken",
    items: "CostComparisonDrivers",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the reservation coverage for your account, which you can use to see how much
 * of your Amazon Elastic Compute Cloud, Amazon ElastiCache, Amazon Relational Database Service,
 * or Amazon Redshift usage is covered by a reservation. An organization's management account can
 * see the coverage of the associated member accounts. This supports dimensions, cost categories,
 * and nested expressions. For any time period, you can filter data about reservation usage by
 * the following dimensions:
 *
 * - AZ
 *
 * - CACHE_ENGINE
 *
 * - DATABASE_ENGINE
 *
 * - DEPLOYMENT_OPTION
 *
 * - INSTANCE_TYPE
 *
 * - LINKED_ACCOUNT
 *
 * - OPERATING_SYSTEM
 *
 * - PLATFORM
 *
 * - REGION
 *
 * - SERVICE
 *
 * - TAG
 *
 * - TENANCY
 *
 * To determine valid values for a dimension, use the `GetDimensionValues`
 * operation.
 */
export const getReservationCoverage: (
  input: GetReservationCoverageRequest,
) => effect.Effect<
  GetReservationCoverageResponse,
  | DataUnavailableException
  | InvalidNextTokenException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReservationCoverageRequest,
  output: GetReservationCoverageResponse,
  errors: [
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
  ],
}));
/**
 * Retrieves the reservation utilization for your account. Management account in an
 * organization have access to member accounts. You can filter data by dimensions in a time
 * period. You can use `GetDimensionValues` to determine the possible dimension
 * values. Currently, you can group only by `SUBSCRIPTION_ID`.
 */
export const getReservationUtilization: (
  input: GetReservationUtilizationRequest,
) => effect.Effect<
  GetReservationUtilizationResponse,
  | DataUnavailableException
  | InvalidNextTokenException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetReservationUtilizationRequest,
  output: GetReservationUtilizationResponse,
  errors: [
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
  ],
}));
/**
 * Retrieves the details for a Savings Plan recommendation. These details include the hourly
 * data-points that construct the cost, coverage, and utilization charts.
 */
export const getSavingsPlanPurchaseRecommendationDetails: (
  input: GetSavingsPlanPurchaseRecommendationDetailsRequest,
) => effect.Effect<
  GetSavingsPlanPurchaseRecommendationDetailsResponse,
  DataUnavailableException | LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSavingsPlanPurchaseRecommendationDetailsRequest,
  output: GetSavingsPlanPurchaseRecommendationDetailsResponse,
  errors: [DataUnavailableException, LimitExceededException],
}));
/**
 * Retrieves the Savings Plans covered for your account. This enables you to see how much of
 * your cost is covered by a Savings Plan. An organization’s management account can see the
 * coverage of the associated member accounts. This supports dimensions, cost categories, and
 * nested expressions. For any time period, you can filter data for Savings Plans usage with the
 * following dimensions:
 *
 * - `LINKED_ACCOUNT`
 *
 * - `REGION`
 *
 * - `SERVICE`
 *
 * - `INSTANCE_FAMILY`
 *
 * To determine valid values for a dimension, use the `GetDimensionValues`
 * operation.
 */
export const getSavingsPlansCoverage: {
  (
    input: GetSavingsPlansCoverageRequest,
  ): effect.Effect<
    GetSavingsPlansCoverageResponse,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetSavingsPlansCoverageRequest,
  ) => stream.Stream<
    GetSavingsPlansCoverageResponse,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetSavingsPlansCoverageRequest,
  ) => stream.Stream<
    unknown,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetSavingsPlansCoverageRequest,
  output: GetSavingsPlansCoverageResponse,
  errors: [
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the Savings Plans utilization for your account across date ranges with daily or
 * monthly granularity. Management account in an organization have access to member accounts. You
 * can use `GetDimensionValues` in `SAVINGS_PLANS` to determine the
 * possible dimension values.
 *
 * You can't group by any dimension values for
 * `GetSavingsPlansUtilization`.
 */
export const getSavingsPlansUtilization: (
  input: GetSavingsPlansUtilizationRequest,
) => effect.Effect<
  GetSavingsPlansUtilizationResponse,
  DataUnavailableException | LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSavingsPlansUtilizationRequest,
  output: GetSavingsPlansUtilizationResponse,
  errors: [DataUnavailableException, LimitExceededException],
}));
/**
 * Retrieves a forecast for how much Amazon Web Services predicts that you will use
 * over the forecast time period that you select, based on your past usage.
 */
export const getUsageForecast: (
  input: GetUsageForecastRequest,
) => effect.Effect<
  GetUsageForecastResponse,
  | BillingViewHealthStatusException
  | DataUnavailableException
  | LimitExceededException
  | ResourceNotFoundException
  | UnresolvableUsageUnitException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUsageForecastRequest,
  output: GetUsageForecastResponse,
  errors: [
    BillingViewHealthStatusException,
    DataUnavailableException,
    LimitExceededException,
    ResourceNotFoundException,
    UnresolvableUsageUnitException,
  ],
}));
/**
 * Requests a Savings Plans recommendation generation. This enables you to calculate a fresh
 * set of Savings Plans recommendations that takes your latest usage data and current Savings
 * Plans inventory into account. You can refresh Savings Plans recommendations up to three times
 * daily for a consolidated billing family.
 *
 * `StartSavingsPlansPurchaseRecommendationGeneration` has no request syntax
 * because no input parameters are needed to support this operation.
 */
export const startSavingsPlansPurchaseRecommendationGeneration: (
  input: StartSavingsPlansPurchaseRecommendationGenerationRequest,
) => effect.Effect<
  StartSavingsPlansPurchaseRecommendationGenerationResponse,
  | DataUnavailableException
  | GenerationExistsException
  | LimitExceededException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSavingsPlansPurchaseRecommendationGenerationRequest,
  output: StartSavingsPlansPurchaseRecommendationGenerationResponse,
  errors: [
    DataUnavailableException,
    GenerationExistsException,
    LimitExceededException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Updates status for cost allocation tags in bulk, with maximum batch size of 20. If the tag
 * status that's updated is the same as the existing tag status, the request doesn't fail.
 * Instead, it doesn't have any effect on the tag status (for example, activating the active
 * tag).
 */
export const updateCostAllocationTagsStatus: (
  input: UpdateCostAllocationTagsStatusRequest,
) => effect.Effect<
  UpdateCostAllocationTagsStatusResponse,
  LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCostAllocationTagsStatusRequest,
  output: UpdateCostAllocationTagsStatusResponse,
  errors: [LimitExceededException],
}));
/**
 * An API operation for adding one or more tags (key-value pairs) to a resource.
 *
 * You can use the `TagResource` operation with a resource that already has tags.
 * If you specify a new tag key for the resource, this tag is appended to the list of tags
 * associated with the resource. If you specify a tag key that is already associated with the
 * resource, the new tag value you specify replaces the previous value for that tag.
 *
 * Although the maximum number of array members is 200, user-tag maximum is 50. The remaining
 * are reserved for Amazon Web Services use.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | LimitExceededException
  | ResourceNotFoundException
  | TooManyTagsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    LimitExceededException,
    ResourceNotFoundException,
    TooManyTagsException,
  ],
}));
/**
 * Queries for available tag keys and tag values for a specified period. You can search
 * the tag values for an arbitrary string.
 */
export const getTags: (
  input: GetTagsRequest,
) => effect.Effect<
  GetTagsResponse,
  | BillExpirationException
  | BillingViewHealthStatusException
  | DataUnavailableException
  | InvalidNextTokenException
  | LimitExceededException
  | RequestChangedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTagsRequest,
  output: GetTagsResponse,
  errors: [
    BillExpirationException,
    BillingViewHealthStatusException,
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
    RequestChangedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates an existing cost category. Changes made to the cost category rules will be used to
 * categorize the current month’s expenses and future expenses. This won’t change categorization
 * for the previous months.
 */
export const updateCostCategoryDefinition: (
  input: UpdateCostCategoryDefinitionRequest,
) => effect.Effect<
  UpdateCostCategoryDefinitionResponse,
  | LimitExceededException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCostCategoryDefinitionRequest,
  output: UpdateCostCategoryDefinitionResponse,
  errors: [
    LimitExceededException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Creates a new cost category with the requested name and rules.
 */
export const createCostCategoryDefinition: (
  input: CreateCostCategoryDefinitionRequest,
) => effect.Effect<
  CreateCostCategoryDefinitionResponse,
  LimitExceededException | ServiceQuotaExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCostCategoryDefinitionRequest,
  output: CreateCostCategoryDefinitionResponse,
  errors: [LimitExceededException, ServiceQuotaExceededException],
}));
/**
 * Retrieves an array of cost category names and values incurred cost.
 *
 * If some cost category names and values are not associated with any cost, they will not
 * be returned by this API.
 */
export const getCostCategories: (
  input: GetCostCategoriesRequest,
) => effect.Effect<
  GetCostCategoriesResponse,
  | BillExpirationException
  | BillingViewHealthStatusException
  | DataUnavailableException
  | InvalidNextTokenException
  | LimitExceededException
  | RequestChangedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCostCategoriesRequest,
  output: GetCostCategoriesResponse,
  errors: [
    BillExpirationException,
    BillingViewHealthStatusException,
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
    RequestChangedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves all available filter values for a specified filter over a period of time. You
 * can search the dimension values for an arbitrary string.
 */
export const getDimensionValues: (
  input: GetDimensionValuesRequest,
) => effect.Effect<
  GetDimensionValuesResponse,
  | BillExpirationException
  | BillingViewHealthStatusException
  | DataUnavailableException
  | InvalidNextTokenException
  | LimitExceededException
  | RequestChangedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDimensionValuesRequest,
  output: GetDimensionValuesResponse,
  errors: [
    BillExpirationException,
    BillingViewHealthStatusException,
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
    RequestChangedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves cost and usage metrics for your account. You can specify which cost and
 * usage-related metric that you want the request to return. For example, you can specify
 * `BlendedCosts` or `UsageQuantity`. You can also filter and group your
 * data by various dimensions, such as `SERVICE` or `AZ`, in a specific
 * time range. For a complete list of valid dimensions, see the GetDimensionValues operation. Management account in an organization in Organizations have access to all member accounts.
 *
 * For information about filter limitations, see Quotas and restrictions
 * in the *Billing and Cost Management User Guide*.
 */
export const getCostAndUsage: (
  input: GetCostAndUsageRequest,
) => effect.Effect<
  GetCostAndUsageResponse,
  | BillExpirationException
  | BillingViewHealthStatusException
  | DataUnavailableException
  | InvalidNextTokenException
  | LimitExceededException
  | RequestChangedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCostAndUsageRequest,
  output: GetCostAndUsageResponse,
  errors: [
    BillExpirationException,
    BillingViewHealthStatusException,
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
    RequestChangedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves cost and usage metrics with resources for your account. You can specify which
 * cost and usage-related metric, such as `BlendedCosts` or
 * `UsageQuantity`, that you want the request to return. You can also filter and group
 * your data by various dimensions, such as `SERVICE` or `AZ`, in a
 * specific time range. For a complete list of valid dimensions, see the GetDimensionValues operation. Management account in an organization in Organizations have access to all member accounts.
 *
 * Hourly granularity is only available for EC2-Instances (Elastic Compute Cloud)
 * resource-level data. All other resource-level data is available at daily
 * granularity.
 *
 * This is an opt-in only feature. You can enable this feature from the Cost Explorer
 * Settings page. For information about how to access the Settings page, see Controlling
 * Access for Cost Explorer in the Billing and Cost Management User
 * Guide.
 */
export const getCostAndUsageWithResources: (
  input: GetCostAndUsageWithResourcesRequest,
) => effect.Effect<
  GetCostAndUsageWithResourcesResponse,
  | BillExpirationException
  | BillingViewHealthStatusException
  | DataUnavailableException
  | InvalidNextTokenException
  | LimitExceededException
  | RequestChangedException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCostAndUsageWithResourcesRequest,
  output: GetCostAndUsageWithResourcesResponse,
  errors: [
    BillExpirationException,
    BillingViewHealthStatusException,
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
    RequestChangedException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves a commitment purchase analysis result based on the
 * `AnalysisId`.
 */
export const getCommitmentPurchaseAnalysis: (
  input: GetCommitmentPurchaseAnalysisRequest,
) => effect.Effect<
  GetCommitmentPurchaseAnalysisResponse,
  | AnalysisNotFoundException
  | DataUnavailableException
  | LimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCommitmentPurchaseAnalysisRequest,
  output: GetCommitmentPurchaseAnalysisResponse,
  errors: [
    AnalysisNotFoundException,
    DataUnavailableException,
    LimitExceededException,
  ],
}));
/**
 * Retrieves the Savings Plans recommendations for your account. First use
 * `StartSavingsPlansPurchaseRecommendationGeneration` to generate a new set of
 * recommendations, and then use `GetSavingsPlansPurchaseRecommendation` to retrieve
 * them.
 */
export const getSavingsPlansPurchaseRecommendation: (
  input: GetSavingsPlansPurchaseRecommendationRequest,
) => effect.Effect<
  GetSavingsPlansPurchaseRecommendationResponse,
  InvalidNextTokenException | LimitExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSavingsPlansPurchaseRecommendationRequest,
  output: GetSavingsPlansPurchaseRecommendationResponse,
  errors: [InvalidNextTokenException, LimitExceededException],
}));
/**
 * Specifies the parameters of a planned commitment purchase and starts the generation of the
 * analysis. This enables you to estimate the cost, coverage, and utilization impact of your
 * planned commitment purchases.
 */
export const startCommitmentPurchaseAnalysis: (
  input: StartCommitmentPurchaseAnalysisRequest,
) => effect.Effect<
  StartCommitmentPurchaseAnalysisResponse,
  | DataUnavailableException
  | GenerationExistsException
  | LimitExceededException
  | ServiceQuotaExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCommitmentPurchaseAnalysisRequest,
  output: StartCommitmentPurchaseAnalysisResponse,
  errors: [
    DataUnavailableException,
    GenerationExistsException,
    LimitExceededException,
    ServiceQuotaExceededException,
  ],
}));
/**
 * Retrieves all of the cost anomalies detected on your account during the time period that's
 * specified by the `DateInterval` object. Anomalies are available for up to 90
 * days.
 */
export const getAnomalies: {
  (
    input: GetAnomaliesRequest,
  ): effect.Effect<
    GetAnomaliesResponse,
    InvalidNextTokenException | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetAnomaliesRequest,
  ) => stream.Stream<
    GetAnomaliesResponse,
    InvalidNextTokenException | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetAnomaliesRequest,
  ) => stream.Stream<
    Anomaly,
    InvalidNextTokenException | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetAnomaliesRequest,
  output: GetAnomaliesResponse,
  errors: [InvalidNextTokenException, LimitExceededException],
  pagination: {
    inputToken: "NextPageToken",
    outputToken: "NextPageToken",
    items: "Anomalies",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Gets recommendations for reservation purchases. These recommendations might help you to
 * reduce your costs. Reservations provide a discounted hourly rate (up to 75%) compared to
 * On-Demand pricing.
 *
 * Amazon Web Services generates your recommendations by identifying your On-Demand usage
 * during a specific time period and collecting your usage into categories that are eligible for
 * a reservation. After Amazon Web Services has these categories, it simulates every combination
 * of reservations in each category of usage to identify the best number of each type of Reserved
 * Instance (RI) to purchase to maximize your estimated savings.
 *
 * For example, Amazon Web Services automatically aggregates your Amazon EC2 Linux, shared
 * tenancy, and c4 family usage in the US West (Oregon) Region and recommends that you buy
 * size-flexible regional reservations to apply to the c4 family usage. Amazon Web Services
 * recommends the smallest size instance in an instance family. This makes it easier to purchase
 * a size-flexible Reserved Instance (RI). Amazon Web Services also shows the equal number of
 * normalized units. This way, you can purchase any instance size that you want. For this
 * example, your RI recommendation is for `c4.large` because that is the smallest size
 * instance in the c4 instance family.
 */
export const getReservationPurchaseRecommendation: {
  (
    input: GetReservationPurchaseRecommendationRequest,
  ): effect.Effect<
    GetReservationPurchaseRecommendationResponse,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetReservationPurchaseRecommendationRequest,
  ) => stream.Stream<
    GetReservationPurchaseRecommendationResponse,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetReservationPurchaseRecommendationRequest,
  ) => stream.Stream<
    ReservationPurchaseRecommendation,
    | DataUnavailableException
    | InvalidNextTokenException
    | LimitExceededException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetReservationPurchaseRecommendationRequest,
  output: GetReservationPurchaseRecommendationResponse,
  errors: [
    DataUnavailableException,
    InvalidNextTokenException,
    LimitExceededException,
  ],
  pagination: {
    inputToken: "NextPageToken",
    outputToken: "NextPageToken",
    items: "Recommendations",
    pageSize: "PageSize",
  } as const,
}));
/**
 * Creates recommendations that help you save cost by identifying idle and underutilized
 * Amazon EC2 instances.
 *
 * Recommendations are generated to either downsize or terminate instances, along with
 * providing savings detail and metrics. For more information about calculation and function, see
 * Optimizing Your Cost with Rightsizing Recommendations in the *Billing and Cost Management User Guide*.
 */
export const getRightsizingRecommendation: {
  (
    input: GetRightsizingRecommendationRequest,
  ): effect.Effect<
    GetRightsizingRecommendationResponse,
    InvalidNextTokenException | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetRightsizingRecommendationRequest,
  ) => stream.Stream<
    GetRightsizingRecommendationResponse,
    InvalidNextTokenException | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetRightsizingRecommendationRequest,
  ) => stream.Stream<
    RightsizingRecommendation,
    InvalidNextTokenException | LimitExceededException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetRightsizingRecommendationRequest,
  output: GetRightsizingRecommendationResponse,
  errors: [InvalidNextTokenException, LimitExceededException],
  pagination: {
    inputToken: "NextPageToken",
    outputToken: "NextPageToken",
    items: "RightsizingRecommendations",
    pageSize: "PageSize",
  } as const,
}));
