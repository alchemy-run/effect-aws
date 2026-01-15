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
  sdkId: "TrustedAdvisor",
  serviceShapeName: "TrustedAdvisor",
});
const auth = T.AwsAuthSigv4({ name: "trustedadvisor" });
const ver = T.ServiceVersion("2022-09-15");
const proto = T.AwsProtocolsRestJson1();
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
              `https://trustedadvisor-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://trustedadvisor-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://trustedadvisor.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://trustedadvisor.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type OrganizationRecommendationIdentifier = string;
export type AccountRecommendationIdentifier = string;
export type RecommendationAwsService = string;
export type AccountId = string;
export type CheckIdentifier = string;
export type RecommendationUpdateReason = string | redacted.Redacted<string>;
export type RecommendationResourceArn = string;
export type OrganizationRecommendationArn = string;
export type AccountRecommendationArn = string;
export type CheckArn = string;
export type RecommendationRegionCode = string;

//# Schemas
export type RecommendationPillar =
  | "cost_optimizing"
  | "performance"
  | "security"
  | "service_limits"
  | "fault_tolerance"
  | "operational_excellence"
  | (string & {});
export const RecommendationPillar = S.String;
export type RecommendationSource =
  | "aws_config"
  | "compute_optimizer"
  | "cost_explorer"
  | "lse"
  | "manual"
  | "pse"
  | "rds"
  | "resilience"
  | "resilience_hub"
  | "security_hub"
  | "stir"
  | "ta_check"
  | "well_architected"
  | (string & {});
export const RecommendationSource = S.String;
export type RecommendationLanguage =
  | "en"
  | "ja"
  | "zh"
  | "fr"
  | "de"
  | "ko"
  | "zh_TW"
  | "it"
  | "es"
  | "pt_BR"
  | "id"
  | (string & {});
export const RecommendationLanguage = S.String;
export type ResourceStatus = "ok" | "warning" | "error" | (string & {});
export const ResourceStatus = S.String;
export type ExclusionStatus = "excluded" | "included" | (string & {});
export const ExclusionStatus = S.String;
export type RecommendationType = "standard" | "priority" | (string & {});
export const RecommendationType = S.String;
export type RecommendationStatus = "ok" | "warning" | "error" | (string & {});
export const RecommendationStatus = S.String;
export type UpdateRecommendationLifecycleStage =
  | "pending_response"
  | "in_progress"
  | "dismissed"
  | "resolved"
  | (string & {});
export const UpdateRecommendationLifecycleStage = S.String;
export type UpdateRecommendationLifecycleStageReasonCode =
  | "non_critical_account"
  | "temporary_account"
  | "valid_business_case"
  | "other_methods_available"
  | "low_priority"
  | "not_applicable"
  | "other"
  | (string & {});
export const UpdateRecommendationLifecycleStageReasonCode = S.String;
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
  pillar?: RecommendationPillar;
  awsService?: string;
  source?: RecommendationSource;
  language?: RecommendationLanguage;
}
export const ListChecksRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    pillar: S.optional(RecommendationPillar).pipe(T.HttpQuery("pillar")),
    awsService: S.optional(S.String).pipe(T.HttpQuery("awsService")),
    source: S.optional(RecommendationSource).pipe(T.HttpQuery("source")),
    language: S.optional(RecommendationLanguage).pipe(T.HttpQuery("language")),
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
  status?: ResourceStatus;
  exclusionStatus?: ExclusionStatus;
  regionCode?: string;
  organizationRecommendationIdentifier: string;
  affectedAccountId?: string;
}
export const ListOrganizationRecommendationResourcesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(ResourceStatus).pipe(T.HttpQuery("status")),
    exclusionStatus: S.optional(ExclusionStatus).pipe(
      T.HttpQuery("exclusionStatus"),
    ),
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
  type?: RecommendationType;
  status?: RecommendationStatus;
  pillar?: RecommendationPillar;
  awsService?: string;
  source?: RecommendationSource;
  checkIdentifier?: string;
  afterLastUpdatedAt?: Date;
  beforeLastUpdatedAt?: Date;
}
export const ListOrganizationRecommendationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    type: S.optional(RecommendationType).pipe(T.HttpQuery("type")),
    status: S.optional(RecommendationStatus).pipe(T.HttpQuery("status")),
    pillar: S.optional(RecommendationPillar).pipe(T.HttpQuery("pillar")),
    awsService: S.optional(S.String).pipe(T.HttpQuery("awsService")),
    source: S.optional(RecommendationSource).pipe(T.HttpQuery("source")),
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
  status?: ResourceStatus;
  exclusionStatus?: ExclusionStatus;
  regionCode?: string;
  recommendationIdentifier: string;
}
export const ListRecommendationResourcesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    status: S.optional(ResourceStatus).pipe(T.HttpQuery("status")),
    exclusionStatus: S.optional(ExclusionStatus).pipe(
      T.HttpQuery("exclusionStatus"),
    ),
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
  type?: RecommendationType;
  status?: RecommendationStatus;
  pillar?: RecommendationPillar;
  awsService?: string;
  source?: RecommendationSource;
  checkIdentifier?: string;
  afterLastUpdatedAt?: Date;
  beforeLastUpdatedAt?: Date;
}
export const ListRecommendationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    type: S.optional(RecommendationType).pipe(T.HttpQuery("type")),
    status: S.optional(RecommendationStatus).pipe(T.HttpQuery("status")),
    pillar: S.optional(RecommendationPillar).pipe(T.HttpQuery("pillar")),
    awsService: S.optional(S.String).pipe(T.HttpQuery("awsService")),
    source: S.optional(RecommendationSource).pipe(T.HttpQuery("source")),
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
  lifecycleStage: UpdateRecommendationLifecycleStage;
  updateReason?: string | redacted.Redacted<string>;
  updateReasonCode?: UpdateRecommendationLifecycleStageReasonCode;
  organizationRecommendationIdentifier: string;
}
export const UpdateOrganizationRecommendationLifecycleRequest = S.suspend(() =>
  S.Struct({
    lifecycleStage: UpdateRecommendationLifecycleStage,
    updateReason: S.optional(SensitiveString),
    updateReasonCode: S.optional(UpdateRecommendationLifecycleStageReasonCode),
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
  lifecycleStage: UpdateRecommendationLifecycleStage;
  updateReason?: string | redacted.Redacted<string>;
  updateReasonCode?: UpdateRecommendationLifecycleStageReasonCode;
  recommendationIdentifier: string;
}
export const UpdateRecommendationLifecycleRequest = S.suspend(() =>
  S.Struct({
    lifecycleStage: UpdateRecommendationLifecycleStage,
    updateReason: S.optional(SensitiveString),
    updateReasonCode: S.optional(UpdateRecommendationLifecycleStageReasonCode),
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
  recommendationResourceExclusions: RecommendationResourceExclusion[];
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
export type RecommendationLifecycleStage =
  | "in_progress"
  | "pending_response"
  | "dismissed"
  | "resolved"
  | (string & {});
export const RecommendationLifecycleStage = S.String;
export type RecommendationPillarList = RecommendationPillar[];
export const RecommendationPillarList = S.Array(RecommendationPillar);
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
  type: RecommendationType;
  checkArn?: string;
  status: RecommendationStatus;
  lifecycleStage?: RecommendationLifecycleStage;
  pillars: RecommendationPillar[];
  source: RecommendationSource;
  awsServices?: string[];
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
  updateReason?: string | redacted.Redacted<string>;
  updateReasonCode?: UpdateRecommendationLifecycleStageReasonCode;
  resolvedAt?: Date;
}
export const Recommendation = S.suspend(() =>
  S.Struct({
    id: S.String,
    type: RecommendationType,
    checkArn: S.optional(S.String),
    status: RecommendationStatus,
    lifecycleStage: S.optional(RecommendationLifecycleStage),
    pillars: RecommendationPillarList,
    source: RecommendationSource,
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
    updateReasonCode: S.optional(UpdateRecommendationLifecycleStageReasonCode),
    resolvedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "Recommendation",
}) as any as S.Schema<Recommendation>;
export interface AccountRecommendationLifecycleSummary {
  accountId?: string;
  accountRecommendationArn?: string;
  lifecycleStage?: RecommendationLifecycleStage;
  updatedOnBehalfOf?: string;
  updatedOnBehalfOfJobTitle?: string;
  updateReason?: string | redacted.Redacted<string>;
  updateReasonCode?: UpdateRecommendationLifecycleStageReasonCode;
  lastUpdatedAt?: Date;
}
export const AccountRecommendationLifecycleSummary = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    accountRecommendationArn: S.optional(S.String),
    lifecycleStage: S.optional(RecommendationLifecycleStage),
    updatedOnBehalfOf: S.optional(S.String),
    updatedOnBehalfOfJobTitle: S.optional(S.String),
    updateReason: S.optional(SensitiveString),
    updateReasonCode: S.optional(UpdateRecommendationLifecycleStageReasonCode),
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
export type StringMap = { [key: string]: string | undefined };
export const StringMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface OrganizationRecommendationResourceSummary {
  id: string;
  arn: string;
  awsResourceId: string;
  regionCode: string;
  status: ResourceStatus;
  metadata: { [key: string]: string | undefined };
  lastUpdatedAt: Date;
  exclusionStatus?: ExclusionStatus;
  accountId?: string;
  recommendationArn: string;
}
export const OrganizationRecommendationResourceSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    awsResourceId: S.String,
    regionCode: S.String,
    status: ResourceStatus,
    metadata: StringMap,
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    exclusionStatus: S.optional(ExclusionStatus),
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
  type: RecommendationType;
  checkArn?: string;
  status: RecommendationStatus;
  lifecycleStage?: RecommendationLifecycleStage;
  pillars: RecommendationPillar[];
  source: RecommendationSource;
  awsServices?: string[];
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
    type: RecommendationType,
    checkArn: S.optional(S.String),
    status: RecommendationStatus,
    lifecycleStage: S.optional(RecommendationLifecycleStage),
    pillars: RecommendationPillarList,
    source: RecommendationSource,
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
  status: ResourceStatus;
  metadata: { [key: string]: string | undefined };
  lastUpdatedAt: Date;
  exclusionStatus?: ExclusionStatus;
  recommendationArn: string;
}
export const RecommendationResourceSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    awsResourceId: S.String,
    regionCode: S.String,
    status: ResourceStatus,
    metadata: StringMap,
    lastUpdatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    exclusionStatus: S.optional(ExclusionStatus),
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
  type: RecommendationType;
  checkArn?: string;
  status: RecommendationStatus;
  lifecycleStage?: RecommendationLifecycleStage;
  pillars: RecommendationPillar[];
  source: RecommendationSource;
  awsServices?: string[];
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
    type: RecommendationType,
    checkArn: S.optional(S.String),
    status: RecommendationStatus,
    lifecycleStage: S.optional(RecommendationLifecycleStage),
    pillars: RecommendationPillarList,
    source: RecommendationSource,
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
  accountRecommendationLifecycleSummaries: AccountRecommendationLifecycleSummary[];
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
  organizationRecommendationResourceSummaries: OrganizationRecommendationResourceSummary[];
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
  organizationRecommendationSummaries: OrganizationRecommendationSummary[];
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
  recommendationResourceSummaries: RecommendationResourceSummary[];
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
  recommendationSummaries: RecommendationSummary[];
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
  pillars: RecommendationPillar[];
  awsServices: string[];
  source: RecommendationSource;
  metadata: { [key: string]: string | undefined };
}
export const CheckSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    arn: S.String,
    name: S.String,
    description: S.String,
    pillars: RecommendationPillarList,
    awsServices: RecommendationAwsServiceList,
    source: RecommendationSource,
    metadata: StringMap,
  }),
).annotations({ identifier: "CheckSummary" }) as any as S.Schema<CheckSummary>;
export type CheckSummaryList = CheckSummary[];
export const CheckSummaryList = S.Array(CheckSummary);
export interface BatchUpdateRecommendationResourceExclusionResponse {
  batchUpdateRecommendationResourceExclusionErrors: UpdateRecommendationResourceExclusionError[];
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
  checkSummaries: CheckSummary[];
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
  type: RecommendationType;
  checkArn?: string;
  status: RecommendationStatus;
  lifecycleStage?: RecommendationLifecycleStage;
  pillars: RecommendationPillar[];
  source: RecommendationSource;
  awsServices?: string[];
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
  updateReason?: string | redacted.Redacted<string>;
  updateReasonCode?: UpdateRecommendationLifecycleStageReasonCode;
  resolvedAt?: Date;
}
export const OrganizationRecommendation = S.suspend(() =>
  S.Struct({
    id: S.String,
    type: RecommendationType,
    checkArn: S.optional(S.String),
    status: RecommendationStatus,
    lifecycleStage: S.optional(RecommendationLifecycleStage),
    pillars: RecommendationPillarList,
    source: RecommendationSource,
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
    updateReasonCode: S.optional(UpdateRecommendationLifecycleStageReasonCode),
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
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
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
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
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
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
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
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
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
) => effect.Effect<
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
) => effect.Effect<
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
) => effect.Effect<
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
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
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
  ): effect.Effect<
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
  ) => stream.Stream<
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
  ) => stream.Stream<
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
) => effect.Effect<
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
) => effect.Effect<
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
