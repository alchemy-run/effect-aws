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
  sdkId: "DevOps Guru",
  serviceShapeName: "CapstoneControlPlaneService",
});
const auth = T.AwsAuthSigv4({ name: "devops-guru" });
const ver = T.ServiceVersion("2020-12-01");
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
              `https://devops-guru-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://devops-guru-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://devops-guru.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://devops-guru.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type InsightId = string;
export type NumOpenReactiveInsights = number;
export type NumOpenProactiveInsights = number;
export type NumMetricsAnalyzed = number;
export type ResourceHours = number;
export type AnalyzedResourceCount = number;
export type AnomalyId = string;
export type AwsAccountId = string;
export type OrganizationalUnitId = string;
export type UuidNextToken = string;
export type OrganizationResourceCollectionMaxResults = number;
export type ListAnomaliesForInsightMaxResults = number;
export type ListAnomalousLogGroupsMaxResults = number;
export type ListEventsMaxResults = number;
export type ListInsightsMaxResults = number;
export type ListMonitoredResourcesMaxResults = number;
export type NotificationChannelId = string;
export type SearchInsightsMaxResults = number;
export type SearchOrganizationInsightsMaxResults = number;
export type ClientToken = string;
export type EventSource = string;
export type ErrorMessageString = string;
export type NumReactiveInsights = number;
export type NumProactiveInsights = number;
export type MeanTimeToRecoverInMilliseconds = number;
export type Cost = number;
export type TopicArn = string;
export type KMSKeyId = string;
export type StackName = string;
export type AppBoundaryKey = string;
export type TagValue = string;
export type AnomalyLimit = number;
export type AnomalyDescription = string;
export type AnomalyName = string;
export type InsightName = string;
export type SsmOpsItemId = string;
export type InsightDescription = string;
export type ResourceType = string;
export type CostEstimationServiceResourceCount = number;
export type LogGroupName = string;
export type NumberOfLogLinesScanned = number;
export type RecommendationDescription = string;
export type RecommendationLink = string;
export type RecommendationName = string;
export type RecommendationReason = string;
export type RecommendationCategory = string;
export type ResourceIdString = string;
export type ResourceIdType = string;
export type RetryAfterSeconds = number;
export type AnomalySource = string;
export type ResourceName = string;
export type RecommendationRelatedEventName = string;
export type MonitoredResourceName = string;
export type ResourceArn = string;
export type CloudWatchMetricsMetricName = string;
export type CloudWatchMetricsNamespace = string;
export type CloudWatchMetricsUnit = string;
export type CloudWatchMetricsPeriod = number;
export type PerformanceInsightsMetricDisplayName = string;
export type PerformanceInsightsMetricUnit = string;
export type LogStreamName = string;
export type LogAnomalyToken = string;
export type LogEventId = string;
export type Explanation = string;
export type NumberOfLogLinesOccurrences = number;
export type RecommendationRelatedEventResourceName = string;
export type RecommendationRelatedEventResourceType = string;
export type RecommendationRelatedAnomalyResourceName = string;
export type RecommendationRelatedAnomalyResourceType = string;
export type ErrorQuotaCodeString = string;
export type ErrorServiceCodeString = string;
export type CloudWatchMetricsDimensionName = string;
export type CloudWatchMetricsDimensionValue = string;
export type PerformanceInsightsMetricName = string;
export type PerformanceInsightsReferenceName = string;
export type PerformanceInsightsStatType = string;
export type PerformanceInsightsValueDouble = number;
export type RecommendationRelatedCloudWatchMetricsSourceMetricName = string;
export type RecommendationRelatedCloudWatchMetricsSourceNamespace = string;
export type MetricValue = number;
export type PerformanceInsightsMetricGroup = string;
export type PerformanceInsightsMetricDimension = string;
export type PerformanceInsightsMetricLimitInteger = number;
export type PerformanceInsightsMetricFilterKey = string;
export type PerformanceInsightsMetricFilterValue = string;
export type ErrorNameString = string;
export type EventId = string;
export type EventName = string;
export type EventResourceType = string;
export type EventResourceName = string;
export type EventResourceArn = string;

//# Schemas
export interface DescribeAccountHealthRequest {}
export const DescribeAccountHealthRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/accounts/health" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAccountHealthRequest",
}) as any as S.Schema<DescribeAccountHealthRequest>;
export interface DescribeEventSourcesConfigRequest {}
export const DescribeEventSourcesConfigRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/event-sources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEventSourcesConfigRequest",
}) as any as S.Schema<DescribeEventSourcesConfigRequest>;
export interface DescribeServiceIntegrationRequest {}
export const DescribeServiceIntegrationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/service-integrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeServiceIntegrationRequest",
}) as any as S.Schema<DescribeServiceIntegrationRequest>;
export type AccountIdList = string[];
export const AccountIdList = S.Array(S.String);
export type OrganizationalUnitIdList = string[];
export const OrganizationalUnitIdList = S.Array(S.String);
export type OrganizationResourceCollectionType =
  | "AWS_CLOUD_FORMATION"
  | "AWS_SERVICE"
  | "AWS_ACCOUNT"
  | "AWS_TAGS"
  | (string & {});
export const OrganizationResourceCollectionType = S.String;
export type ResourceCollectionType =
  | "AWS_CLOUD_FORMATION"
  | "AWS_SERVICE"
  | "AWS_TAGS"
  | (string & {});
export const ResourceCollectionType = S.String;
export type ListInsightsAccountIdList = string[];
export const ListInsightsAccountIdList = S.Array(S.String);
export type ListInsightsOrganizationalUnitIdList = string[];
export const ListInsightsOrganizationalUnitIdList = S.Array(S.String);
export type Locale =
  | "DE_DE"
  | "EN_US"
  | "EN_GB"
  | "ES_ES"
  | "FR_FR"
  | "IT_IT"
  | "JA_JP"
  | "KO_KR"
  | "PT_BR"
  | "ZH_CN"
  | "ZH_TW"
  | (string & {});
export const Locale = S.String;
export type InsightType = "REACTIVE" | "PROACTIVE" | (string & {});
export const InsightType = S.String;
export type SearchInsightsAccountIdList = string[];
export const SearchInsightsAccountIdList = S.Array(S.String);
export type UpdateResourceCollectionAction = "ADD" | "REMOVE" | (string & {});
export const UpdateResourceCollectionAction = S.String;
export interface DeleteInsightRequest {
  Id: string;
}
export const DeleteInsightRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/insights/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteInsightRequest",
}) as any as S.Schema<DeleteInsightRequest>;
export interface DeleteInsightResponse {}
export const DeleteInsightResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteInsightResponse",
}) as any as S.Schema<DeleteInsightResponse>;
export interface DescribeAccountHealthResponse {
  OpenReactiveInsights: number;
  OpenProactiveInsights: number;
  MetricsAnalyzed: number;
  ResourceHours: number;
  AnalyzedResourceCount?: number;
}
export const DescribeAccountHealthResponse = S.suspend(() =>
  S.Struct({
    OpenReactiveInsights: S.Number,
    OpenProactiveInsights: S.Number,
    MetricsAnalyzed: S.Number,
    ResourceHours: S.Number,
    AnalyzedResourceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "DescribeAccountHealthResponse",
}) as any as S.Schema<DescribeAccountHealthResponse>;
export interface DescribeAccountOverviewRequest {
  FromTime: Date;
  ToTime?: Date;
}
export const DescribeAccountOverviewRequest = S.suspend(() =>
  S.Struct({
    FromTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ToTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/accounts/overview" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAccountOverviewRequest",
}) as any as S.Schema<DescribeAccountOverviewRequest>;
export interface DescribeAnomalyRequest {
  Id: string;
  AccountId?: string;
}
export const DescribeAnomalyRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    AccountId: S.optional(S.String).pipe(T.HttpQuery("AccountId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/anomalies/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeAnomalyRequest",
}) as any as S.Schema<DescribeAnomalyRequest>;
export interface DescribeFeedbackRequest {
  InsightId?: string;
}
export const DescribeFeedbackRequest = S.suspend(() =>
  S.Struct({ InsightId: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/feedback" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeFeedbackRequest",
}) as any as S.Schema<DescribeFeedbackRequest>;
export interface DescribeInsightRequest {
  Id: string;
  AccountId?: string;
}
export const DescribeInsightRequest = S.suspend(() =>
  S.Struct({
    Id: S.String.pipe(T.HttpLabel("Id")),
    AccountId: S.optional(S.String).pipe(T.HttpQuery("AccountId")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/insights/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeInsightRequest",
}) as any as S.Schema<DescribeInsightRequest>;
export interface DescribeOrganizationHealthRequest {
  AccountIds?: string[];
  OrganizationalUnitIds?: string[];
}
export const DescribeOrganizationHealthRequest = S.suspend(() =>
  S.Struct({
    AccountIds: S.optional(AccountIdList),
    OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/organization/health" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeOrganizationHealthRequest",
}) as any as S.Schema<DescribeOrganizationHealthRequest>;
export interface DescribeOrganizationOverviewRequest {
  FromTime: Date;
  ToTime?: Date;
  AccountIds?: string[];
  OrganizationalUnitIds?: string[];
}
export const DescribeOrganizationOverviewRequest = S.suspend(() =>
  S.Struct({
    FromTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ToTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AccountIds: S.optional(AccountIdList),
    OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/organization/overview" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeOrganizationOverviewRequest",
}) as any as S.Schema<DescribeOrganizationOverviewRequest>;
export interface DescribeOrganizationResourceCollectionHealthRequest {
  OrganizationResourceCollectionType: OrganizationResourceCollectionType;
  AccountIds?: string[];
  OrganizationalUnitIds?: string[];
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeOrganizationResourceCollectionHealthRequest = S.suspend(
  () =>
    S.Struct({
      OrganizationResourceCollectionType: OrganizationResourceCollectionType,
      AccountIds: S.optional(AccountIdList),
      OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
      NextToken: S.optional(S.String),
      MaxResults: S.optional(S.Number),
    }).pipe(
      T.all(
        T.Http({
          method: "POST",
          uri: "/organization/health/resource-collection",
        }),
        svc,
        auth,
        proto,
        ver,
        rules,
      ),
    ),
).annotations({
  identifier: "DescribeOrganizationResourceCollectionHealthRequest",
}) as any as S.Schema<DescribeOrganizationResourceCollectionHealthRequest>;
export interface DescribeResourceCollectionHealthRequest {
  ResourceCollectionType: ResourceCollectionType;
  NextToken?: string;
}
export const DescribeResourceCollectionHealthRequest = S.suspend(() =>
  S.Struct({
    ResourceCollectionType: ResourceCollectionType.pipe(
      T.HttpLabel("ResourceCollectionType"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/accounts/health/resource-collection/{ResourceCollectionType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeResourceCollectionHealthRequest",
}) as any as S.Schema<DescribeResourceCollectionHealthRequest>;
export interface GetCostEstimationRequest {
  NextToken?: string;
}
export const GetCostEstimationRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/cost-estimation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetCostEstimationRequest",
}) as any as S.Schema<GetCostEstimationRequest>;
export interface GetResourceCollectionRequest {
  ResourceCollectionType: ResourceCollectionType;
  NextToken?: string;
}
export const GetResourceCollectionRequest = S.suspend(() =>
  S.Struct({
    ResourceCollectionType: ResourceCollectionType.pipe(
      T.HttpLabel("ResourceCollectionType"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/resource-collections/{ResourceCollectionType}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetResourceCollectionRequest",
}) as any as S.Schema<GetResourceCollectionRequest>;
export interface ListAnomalousLogGroupsRequest {
  InsightId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListAnomalousLogGroupsRequest = S.suspend(() =>
  S.Struct({
    InsightId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-log-anomalies" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAnomalousLogGroupsRequest",
}) as any as S.Schema<ListAnomalousLogGroupsRequest>;
export interface ListNotificationChannelsRequest {
  NextToken?: string;
}
export const ListNotificationChannelsRequest = S.suspend(() =>
  S.Struct({ NextToken: S.optional(S.String) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/channels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListNotificationChannelsRequest",
}) as any as S.Schema<ListNotificationChannelsRequest>;
export interface ListInsightsOngoingStatusFilter {
  Type: InsightType;
}
export const ListInsightsOngoingStatusFilter = S.suspend(() =>
  S.Struct({ Type: InsightType }),
).annotations({
  identifier: "ListInsightsOngoingStatusFilter",
}) as any as S.Schema<ListInsightsOngoingStatusFilter>;
export interface EndTimeRange {
  FromTime?: Date;
  ToTime?: Date;
}
export const EndTimeRange = S.suspend(() =>
  S.Struct({
    FromTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ToTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "EndTimeRange" }) as any as S.Schema<EndTimeRange>;
export interface ListInsightsClosedStatusFilter {
  Type: InsightType;
  EndTimeRange: EndTimeRange;
}
export const ListInsightsClosedStatusFilter = S.suspend(() =>
  S.Struct({ Type: InsightType, EndTimeRange: EndTimeRange }),
).annotations({
  identifier: "ListInsightsClosedStatusFilter",
}) as any as S.Schema<ListInsightsClosedStatusFilter>;
export interface StartTimeRange {
  FromTime?: Date;
  ToTime?: Date;
}
export const StartTimeRange = S.suspend(() =>
  S.Struct({
    FromTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ToTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "StartTimeRange",
}) as any as S.Schema<StartTimeRange>;
export interface ListInsightsAnyStatusFilter {
  Type: InsightType;
  StartTimeRange: StartTimeRange;
}
export const ListInsightsAnyStatusFilter = S.suspend(() =>
  S.Struct({ Type: InsightType, StartTimeRange: StartTimeRange }),
).annotations({
  identifier: "ListInsightsAnyStatusFilter",
}) as any as S.Schema<ListInsightsAnyStatusFilter>;
export interface ListInsightsStatusFilter {
  Ongoing?: ListInsightsOngoingStatusFilter;
  Closed?: ListInsightsClosedStatusFilter;
  Any?: ListInsightsAnyStatusFilter;
}
export const ListInsightsStatusFilter = S.suspend(() =>
  S.Struct({
    Ongoing: S.optional(ListInsightsOngoingStatusFilter),
    Closed: S.optional(ListInsightsClosedStatusFilter),
    Any: S.optional(ListInsightsAnyStatusFilter),
  }),
).annotations({
  identifier: "ListInsightsStatusFilter",
}) as any as S.Schema<ListInsightsStatusFilter>;
export interface ListOrganizationInsightsRequest {
  StatusFilter: ListInsightsStatusFilter;
  MaxResults?: number;
  AccountIds?: string[];
  OrganizationalUnitIds?: string[];
  NextToken?: string;
}
export const ListOrganizationInsightsRequest = S.suspend(() =>
  S.Struct({
    StatusFilter: ListInsightsStatusFilter,
    MaxResults: S.optional(S.Number),
    AccountIds: S.optional(ListInsightsAccountIdList),
    OrganizationalUnitIds: S.optional(ListInsightsOrganizationalUnitIdList),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/organization/insights" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListOrganizationInsightsRequest",
}) as any as S.Schema<ListOrganizationInsightsRequest>;
export interface ListRecommendationsRequest {
  InsightId: string;
  NextToken?: string;
  Locale?: Locale;
  AccountId?: string;
}
export const ListRecommendationsRequest = S.suspend(() =>
  S.Struct({
    InsightId: S.String,
    NextToken: S.optional(S.String),
    Locale: S.optional(Locale),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/recommendations" }),
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
export interface RemoveNotificationChannelRequest {
  Id: string;
}
export const RemoveNotificationChannelRequest = S.suspend(() =>
  S.Struct({ Id: S.String.pipe(T.HttpLabel("Id")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/channels/{Id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveNotificationChannelRequest",
}) as any as S.Schema<RemoveNotificationChannelRequest>;
export interface RemoveNotificationChannelResponse {}
export const RemoveNotificationChannelResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "RemoveNotificationChannelResponse",
}) as any as S.Schema<RemoveNotificationChannelResponse>;
export type EventSourceOptInStatus = "ENABLED" | "DISABLED" | (string & {});
export const EventSourceOptInStatus = S.String;
export interface AmazonCodeGuruProfilerIntegration {
  Status?: EventSourceOptInStatus;
}
export const AmazonCodeGuruProfilerIntegration = S.suspend(() =>
  S.Struct({ Status: S.optional(EventSourceOptInStatus) }),
).annotations({
  identifier: "AmazonCodeGuruProfilerIntegration",
}) as any as S.Schema<AmazonCodeGuruProfilerIntegration>;
export interface EventSourcesConfig {
  AmazonCodeGuruProfiler?: AmazonCodeGuruProfilerIntegration;
}
export const EventSourcesConfig = S.suspend(() =>
  S.Struct({
    AmazonCodeGuruProfiler: S.optional(AmazonCodeGuruProfilerIntegration),
  }),
).annotations({
  identifier: "EventSourcesConfig",
}) as any as S.Schema<EventSourcesConfig>;
export interface UpdateEventSourcesConfigRequest {
  EventSources?: EventSourcesConfig;
}
export const UpdateEventSourcesConfigRequest = S.suspend(() =>
  S.Struct({ EventSources: S.optional(EventSourcesConfig) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/event-sources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateEventSourcesConfigRequest",
}) as any as S.Schema<UpdateEventSourcesConfigRequest>;
export interface UpdateEventSourcesConfigResponse {}
export const UpdateEventSourcesConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateEventSourcesConfigResponse",
}) as any as S.Schema<UpdateEventSourcesConfigResponse>;
export type EventClass =
  | "INFRASTRUCTURE"
  | "DEPLOYMENT"
  | "SECURITY_CHANGE"
  | "CONFIG_CHANGE"
  | "SCHEMA_CHANGE"
  | (string & {});
export const EventClass = S.String;
export type EventDataSource =
  | "AWS_CLOUD_TRAIL"
  | "AWS_CODE_DEPLOY"
  | (string & {});
export const EventDataSource = S.String;
export type ResourcePermission =
  | "FULL_PERMISSION"
  | "MISSING_PERMISSION"
  | (string & {});
export const ResourcePermission = S.String;
export type ResourceTypeFilter =
  | "LOG_GROUPS"
  | "CLOUDFRONT_DISTRIBUTION"
  | "DYNAMODB_TABLE"
  | "EC2_NAT_GATEWAY"
  | "ECS_CLUSTER"
  | "ECS_SERVICE"
  | "EKS_CLUSTER"
  | "ELASTIC_BEANSTALK_ENVIRONMENT"
  | "ELASTIC_LOAD_BALANCER_LOAD_BALANCER"
  | "ELASTIC_LOAD_BALANCING_V2_LOAD_BALANCER"
  | "ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP"
  | "ELASTICACHE_CACHE_CLUSTER"
  | "ELASTICSEARCH_DOMAIN"
  | "KINESIS_STREAM"
  | "LAMBDA_FUNCTION"
  | "OPEN_SEARCH_SERVICE_DOMAIN"
  | "RDS_DB_INSTANCE"
  | "RDS_DB_CLUSTER"
  | "REDSHIFT_CLUSTER"
  | "ROUTE53_HOSTED_ZONE"
  | "ROUTE53_HEALTH_CHECK"
  | "S3_BUCKET"
  | "SAGEMAKER_ENDPOINT"
  | "SNS_TOPIC"
  | "SQS_QUEUE"
  | "STEP_FUNCTIONS_ACTIVITY"
  | "STEP_FUNCTIONS_STATE_MACHINE"
  | (string & {});
export const ResourceTypeFilter = S.String;
export type ResourceTypeFilters = ResourceTypeFilter[];
export const ResourceTypeFilters = S.Array(ResourceTypeFilter);
export type InsightFeedbackOption =
  | "VALID_COLLECTION"
  | "RECOMMENDATION_USEFUL"
  | "ALERT_TOO_SENSITIVE"
  | "DATA_NOISY_ANOMALY"
  | "DATA_INCORRECT"
  | (string & {});
export const InsightFeedbackOption = S.String;
export type InsightSeverity = "LOW" | "MEDIUM" | "HIGH" | (string & {});
export const InsightSeverity = S.String;
export type InsightSeverities = InsightSeverity[];
export const InsightSeverities = S.Array(InsightSeverity);
export type InsightStatus = "ONGOING" | "CLOSED" | (string & {});
export const InsightStatus = S.String;
export type InsightStatuses = InsightStatus[];
export const InsightStatuses = S.Array(InsightStatus);
export type CostEstimationStatus = "ONGOING" | "COMPLETED" | (string & {});
export const CostEstimationStatus = S.String;
export interface ListMonitoredResourcesFilters {
  ResourcePermission: ResourcePermission;
  ResourceTypeFilters: ResourceTypeFilter[];
}
export const ListMonitoredResourcesFilters = S.suspend(() =>
  S.Struct({
    ResourcePermission: ResourcePermission,
    ResourceTypeFilters: ResourceTypeFilters,
  }),
).annotations({
  identifier: "ListMonitoredResourcesFilters",
}) as any as S.Schema<ListMonitoredResourcesFilters>;
export interface InsightFeedback {
  Id?: string;
  Feedback?: InsightFeedbackOption;
}
export const InsightFeedback = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Feedback: S.optional(InsightFeedbackOption),
  }),
).annotations({
  identifier: "InsightFeedback",
}) as any as S.Schema<InsightFeedback>;
export type StackNames = string[];
export const StackNames = S.Array(S.String);
export interface CloudFormationCollection {
  StackNames?: string[];
}
export const CloudFormationCollection = S.suspend(() =>
  S.Struct({ StackNames: S.optional(StackNames) }),
).annotations({
  identifier: "CloudFormationCollection",
}) as any as S.Schema<CloudFormationCollection>;
export type TagValues = string[];
export const TagValues = S.Array(S.String);
export interface TagCollection {
  AppBoundaryKey: string;
  TagValues: string[];
}
export const TagCollection = S.suspend(() =>
  S.Struct({ AppBoundaryKey: S.String, TagValues: TagValues }),
).annotations({
  identifier: "TagCollection",
}) as any as S.Schema<TagCollection>;
export type TagCollections = TagCollection[];
export const TagCollections = S.Array(TagCollection);
export interface ResourceCollection {
  CloudFormation?: CloudFormationCollection;
  Tags?: TagCollection[];
}
export const ResourceCollection = S.suspend(() =>
  S.Struct({
    CloudFormation: S.optional(CloudFormationCollection),
    Tags: S.optional(TagCollections),
  }),
).annotations({
  identifier: "ResourceCollection",
}) as any as S.Schema<ResourceCollection>;
export type ServiceName =
  | "API_GATEWAY"
  | "APPLICATION_ELB"
  | "AUTO_SCALING_GROUP"
  | "CLOUD_FRONT"
  | "DYNAMO_DB"
  | "EC2"
  | "ECS"
  | "EKS"
  | "ELASTIC_BEANSTALK"
  | "ELASTI_CACHE"
  | "ELB"
  | "ES"
  | "KINESIS"
  | "LAMBDA"
  | "NAT_GATEWAY"
  | "NETWORK_ELB"
  | "RDS"
  | "REDSHIFT"
  | "ROUTE_53"
  | "S3"
  | "SAGE_MAKER"
  | "SNS"
  | "SQS"
  | "STEP_FUNCTIONS"
  | "SWF"
  | (string & {});
export const ServiceName = S.String;
export type ServiceNames = ServiceName[];
export const ServiceNames = S.Array(ServiceName);
export interface ServiceCollection {
  ServiceNames?: ServiceName[];
}
export const ServiceCollection = S.suspend(() =>
  S.Struct({ ServiceNames: S.optional(ServiceNames) }),
).annotations({
  identifier: "ServiceCollection",
}) as any as S.Schema<ServiceCollection>;
export interface SearchInsightsFilters {
  Severities?: InsightSeverity[];
  Statuses?: InsightStatus[];
  ResourceCollection?: ResourceCollection;
  ServiceCollection?: ServiceCollection;
}
export const SearchInsightsFilters = S.suspend(() =>
  S.Struct({
    Severities: S.optional(InsightSeverities),
    Statuses: S.optional(InsightStatuses),
    ResourceCollection: S.optional(ResourceCollection),
    ServiceCollection: S.optional(ServiceCollection),
  }),
).annotations({
  identifier: "SearchInsightsFilters",
}) as any as S.Schema<SearchInsightsFilters>;
export interface SearchOrganizationInsightsFilters {
  Severities?: InsightSeverity[];
  Statuses?: InsightStatus[];
  ResourceCollection?: ResourceCollection;
  ServiceCollection?: ServiceCollection;
}
export const SearchOrganizationInsightsFilters = S.suspend(() =>
  S.Struct({
    Severities: S.optional(InsightSeverities),
    Statuses: S.optional(InsightStatuses),
    ResourceCollection: S.optional(ResourceCollection),
    ServiceCollection: S.optional(ServiceCollection),
  }),
).annotations({
  identifier: "SearchOrganizationInsightsFilters",
}) as any as S.Schema<SearchOrganizationInsightsFilters>;
export type NotificationMessageType =
  | "NEW_INSIGHT"
  | "CLOSED_INSIGHT"
  | "NEW_ASSOCIATION"
  | "SEVERITY_UPGRADED"
  | "NEW_RECOMMENDATION"
  | (string & {});
export const NotificationMessageType = S.String;
export type NotificationMessageTypes = NotificationMessageType[];
export const NotificationMessageTypes = S.Array(NotificationMessageType);
export type OptInStatus = "ENABLED" | "DISABLED" | (string & {});
export const OptInStatus = S.String;
export type ServerSideEncryptionType =
  | "CUSTOMER_MANAGED_KEY"
  | "AWS_OWNED_KMS_KEY"
  | (string & {});
export const ServerSideEncryptionType = S.String;
export type CostEstimationStackNames = string[];
export const CostEstimationStackNames = S.Array(S.String);
export type CostEstimationTagValues = string[];
export const CostEstimationTagValues = S.Array(S.String);
export type UpdateStackNames = string[];
export const UpdateStackNames = S.Array(S.String);
export type UpdateTagValues = string[];
export const UpdateTagValues = S.Array(S.String);
export interface DescribeAccountOverviewResponse {
  ReactiveInsights: number;
  ProactiveInsights: number;
  MeanTimeToRecoverInMilliseconds: number;
}
export const DescribeAccountOverviewResponse = S.suspend(() =>
  S.Struct({
    ReactiveInsights: S.Number,
    ProactiveInsights: S.Number,
    MeanTimeToRecoverInMilliseconds: S.Number,
  }),
).annotations({
  identifier: "DescribeAccountOverviewResponse",
}) as any as S.Schema<DescribeAccountOverviewResponse>;
export interface DescribeFeedbackResponse {
  InsightFeedback?: InsightFeedback;
}
export const DescribeFeedbackResponse = S.suspend(() =>
  S.Struct({ InsightFeedback: S.optional(InsightFeedback) }),
).annotations({
  identifier: "DescribeFeedbackResponse",
}) as any as S.Schema<DescribeFeedbackResponse>;
export interface DescribeOrganizationHealthResponse {
  OpenReactiveInsights: number;
  OpenProactiveInsights: number;
  MetricsAnalyzed: number;
  ResourceHours: number;
}
export const DescribeOrganizationHealthResponse = S.suspend(() =>
  S.Struct({
    OpenReactiveInsights: S.Number,
    OpenProactiveInsights: S.Number,
    MetricsAnalyzed: S.Number,
    ResourceHours: S.Number,
  }),
).annotations({
  identifier: "DescribeOrganizationHealthResponse",
}) as any as S.Schema<DescribeOrganizationHealthResponse>;
export interface DescribeOrganizationOverviewResponse {
  ReactiveInsights: number;
  ProactiveInsights: number;
}
export const DescribeOrganizationOverviewResponse = S.suspend(() =>
  S.Struct({ ReactiveInsights: S.Number, ProactiveInsights: S.Number }),
).annotations({
  identifier: "DescribeOrganizationOverviewResponse",
}) as any as S.Schema<DescribeOrganizationOverviewResponse>;
export interface InsightHealth {
  OpenProactiveInsights?: number;
  OpenReactiveInsights?: number;
  MeanTimeToRecoverInMilliseconds?: number;
}
export const InsightHealth = S.suspend(() =>
  S.Struct({
    OpenProactiveInsights: S.optional(S.Number),
    OpenReactiveInsights: S.optional(S.Number),
    MeanTimeToRecoverInMilliseconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "InsightHealth",
}) as any as S.Schema<InsightHealth>;
export interface CloudFormationHealth {
  StackName?: string;
  Insight?: InsightHealth;
  AnalyzedResourceCount?: number;
}
export const CloudFormationHealth = S.suspend(() =>
  S.Struct({
    StackName: S.optional(S.String),
    Insight: S.optional(InsightHealth),
    AnalyzedResourceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "CloudFormationHealth",
}) as any as S.Schema<CloudFormationHealth>;
export type CloudFormationHealths = CloudFormationHealth[];
export const CloudFormationHealths = S.Array(CloudFormationHealth);
export interface ServiceInsightHealth {
  OpenProactiveInsights?: number;
  OpenReactiveInsights?: number;
}
export const ServiceInsightHealth = S.suspend(() =>
  S.Struct({
    OpenProactiveInsights: S.optional(S.Number),
    OpenReactiveInsights: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServiceInsightHealth",
}) as any as S.Schema<ServiceInsightHealth>;
export interface ServiceHealth {
  ServiceName?: ServiceName;
  Insight?: ServiceInsightHealth;
  AnalyzedResourceCount?: number;
}
export const ServiceHealth = S.suspend(() =>
  S.Struct({
    ServiceName: S.optional(ServiceName),
    Insight: S.optional(ServiceInsightHealth),
    AnalyzedResourceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServiceHealth",
}) as any as S.Schema<ServiceHealth>;
export type ServiceHealths = ServiceHealth[];
export const ServiceHealths = S.Array(ServiceHealth);
export interface TagHealth {
  AppBoundaryKey?: string;
  TagValue?: string;
  Insight?: InsightHealth;
  AnalyzedResourceCount?: number;
}
export const TagHealth = S.suspend(() =>
  S.Struct({
    AppBoundaryKey: S.optional(S.String),
    TagValue: S.optional(S.String),
    Insight: S.optional(InsightHealth),
    AnalyzedResourceCount: S.optional(S.Number),
  }),
).annotations({ identifier: "TagHealth" }) as any as S.Schema<TagHealth>;
export type TagHealths = TagHealth[];
export const TagHealths = S.Array(TagHealth);
export interface DescribeResourceCollectionHealthResponse {
  CloudFormation?: CloudFormationHealth[];
  Service?: ServiceHealth[];
  NextToken?: string;
  Tags?: TagHealth[];
}
export const DescribeResourceCollectionHealthResponse = S.suspend(() =>
  S.Struct({
    CloudFormation: S.optional(CloudFormationHealths),
    Service: S.optional(ServiceHealths),
    NextToken: S.optional(S.String),
    Tags: S.optional(TagHealths),
  }),
).annotations({
  identifier: "DescribeResourceCollectionHealthResponse",
}) as any as S.Schema<DescribeResourceCollectionHealthResponse>;
export interface ListMonitoredResourcesRequest {
  Filters?: ListMonitoredResourcesFilters;
  MaxResults?: number;
  NextToken?: string;
}
export const ListMonitoredResourcesRequest = S.suspend(() =>
  S.Struct({
    Filters: S.optional(ListMonitoredResourcesFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/monitoredResources" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListMonitoredResourcesRequest",
}) as any as S.Schema<ListMonitoredResourcesRequest>;
export interface PutFeedbackRequest {
  InsightFeedback?: InsightFeedback;
}
export const PutFeedbackRequest = S.suspend(() =>
  S.Struct({ InsightFeedback: S.optional(InsightFeedback) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/feedback" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutFeedbackRequest",
}) as any as S.Schema<PutFeedbackRequest>;
export interface PutFeedbackResponse {}
export const PutFeedbackResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "PutFeedbackResponse",
}) as any as S.Schema<PutFeedbackResponse>;
export interface SearchInsightsRequest {
  StartTimeRange: StartTimeRange;
  Filters?: SearchInsightsFilters;
  MaxResults?: number;
  NextToken?: string;
  Type: InsightType;
}
export const SearchInsightsRequest = S.suspend(() =>
  S.Struct({
    StartTimeRange: StartTimeRange,
    Filters: S.optional(SearchInsightsFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Type: InsightType,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/insights/search" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchInsightsRequest",
}) as any as S.Schema<SearchInsightsRequest>;
export interface SearchOrganizationInsightsRequest {
  AccountIds: string[];
  StartTimeRange: StartTimeRange;
  Filters?: SearchOrganizationInsightsFilters;
  MaxResults?: number;
  NextToken?: string;
  Type: InsightType;
}
export const SearchOrganizationInsightsRequest = S.suspend(() =>
  S.Struct({
    AccountIds: SearchInsightsAccountIdList,
    StartTimeRange: StartTimeRange,
    Filters: S.optional(SearchOrganizationInsightsFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Type: InsightType,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/organization/insights/search" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchOrganizationInsightsRequest",
}) as any as S.Schema<SearchOrganizationInsightsRequest>;
export interface SnsChannelConfig {
  TopicArn?: string;
}
export const SnsChannelConfig = S.suspend(() =>
  S.Struct({ TopicArn: S.optional(S.String) }),
).annotations({
  identifier: "SnsChannelConfig",
}) as any as S.Schema<SnsChannelConfig>;
export interface NotificationFilterConfig {
  Severities?: InsightSeverity[];
  MessageTypes?: NotificationMessageType[];
}
export const NotificationFilterConfig = S.suspend(() =>
  S.Struct({
    Severities: S.optional(InsightSeverities),
    MessageTypes: S.optional(NotificationMessageTypes),
  }),
).annotations({
  identifier: "NotificationFilterConfig",
}) as any as S.Schema<NotificationFilterConfig>;
export type AnomalySeverity = "LOW" | "MEDIUM" | "HIGH" | (string & {});
export const AnomalySeverity = S.String;
export type AnomalyStatus = "ONGOING" | "CLOSED" | (string & {});
export const AnomalyStatus = S.String;
export type AnomalyType = "CAUSAL" | "CONTEXTUAL" | (string & {});
export const AnomalyType = S.String;
export interface OpsCenterIntegration {
  OptInStatus?: OptInStatus;
}
export const OpsCenterIntegration = S.suspend(() =>
  S.Struct({ OptInStatus: S.optional(OptInStatus) }),
).annotations({
  identifier: "OpsCenterIntegration",
}) as any as S.Schema<OpsCenterIntegration>;
export interface LogsAnomalyDetectionIntegration {
  OptInStatus?: OptInStatus;
}
export const LogsAnomalyDetectionIntegration = S.suspend(() =>
  S.Struct({ OptInStatus: S.optional(OptInStatus) }),
).annotations({
  identifier: "LogsAnomalyDetectionIntegration",
}) as any as S.Schema<LogsAnomalyDetectionIntegration>;
export interface KMSServerSideEncryptionIntegration {
  KMSKeyId?: string;
  OptInStatus?: OptInStatus;
  Type?: ServerSideEncryptionType;
}
export const KMSServerSideEncryptionIntegration = S.suspend(() =>
  S.Struct({
    KMSKeyId: S.optional(S.String),
    OptInStatus: S.optional(OptInStatus),
    Type: S.optional(ServerSideEncryptionType),
  }),
).annotations({
  identifier: "KMSServerSideEncryptionIntegration",
}) as any as S.Schema<KMSServerSideEncryptionIntegration>;
export type CostEstimationServiceResourceState =
  | "ACTIVE"
  | "INACTIVE"
  | (string & {});
export const CostEstimationServiceResourceState = S.String;
export interface EventTimeRange {
  FromTime: Date;
  ToTime: Date;
}
export const EventTimeRange = S.suspend(() =>
  S.Struct({
    FromTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ToTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "EventTimeRange",
}) as any as S.Schema<EventTimeRange>;
export interface CloudFormationCostEstimationResourceCollectionFilter {
  StackNames?: string[];
}
export const CloudFormationCostEstimationResourceCollectionFilter = S.suspend(
  () => S.Struct({ StackNames: S.optional(CostEstimationStackNames) }),
).annotations({
  identifier: "CloudFormationCostEstimationResourceCollectionFilter",
}) as any as S.Schema<CloudFormationCostEstimationResourceCollectionFilter>;
export interface TagCostEstimationResourceCollectionFilter {
  AppBoundaryKey: string;
  TagValues: string[];
}
export const TagCostEstimationResourceCollectionFilter = S.suspend(() =>
  S.Struct({ AppBoundaryKey: S.String, TagValues: CostEstimationTagValues }),
).annotations({
  identifier: "TagCostEstimationResourceCollectionFilter",
}) as any as S.Schema<TagCostEstimationResourceCollectionFilter>;
export type TagCostEstimationResourceCollectionFilters =
  TagCostEstimationResourceCollectionFilter[];
export const TagCostEstimationResourceCollectionFilters = S.Array(
  TagCostEstimationResourceCollectionFilter,
);
export interface UpdateCloudFormationCollectionFilter {
  StackNames?: string[];
}
export const UpdateCloudFormationCollectionFilter = S.suspend(() =>
  S.Struct({ StackNames: S.optional(UpdateStackNames) }),
).annotations({
  identifier: "UpdateCloudFormationCollectionFilter",
}) as any as S.Schema<UpdateCloudFormationCollectionFilter>;
export interface UpdateTagCollectionFilter {
  AppBoundaryKey: string;
  TagValues: string[];
}
export const UpdateTagCollectionFilter = S.suspend(() =>
  S.Struct({ AppBoundaryKey: S.String, TagValues: UpdateTagValues }),
).annotations({
  identifier: "UpdateTagCollectionFilter",
}) as any as S.Schema<UpdateTagCollectionFilter>;
export type UpdateTagCollectionFilters = UpdateTagCollectionFilter[];
export const UpdateTagCollectionFilters = S.Array(UpdateTagCollectionFilter);
export interface OpsCenterIntegrationConfig {
  OptInStatus?: OptInStatus;
}
export const OpsCenterIntegrationConfig = S.suspend(() =>
  S.Struct({ OptInStatus: S.optional(OptInStatus) }),
).annotations({
  identifier: "OpsCenterIntegrationConfig",
}) as any as S.Schema<OpsCenterIntegrationConfig>;
export interface LogsAnomalyDetectionIntegrationConfig {
  OptInStatus?: OptInStatus;
}
export const LogsAnomalyDetectionIntegrationConfig = S.suspend(() =>
  S.Struct({ OptInStatus: S.optional(OptInStatus) }),
).annotations({
  identifier: "LogsAnomalyDetectionIntegrationConfig",
}) as any as S.Schema<LogsAnomalyDetectionIntegrationConfig>;
export interface KMSServerSideEncryptionIntegrationConfig {
  KMSKeyId?: string;
  OptInStatus?: OptInStatus;
  Type?: ServerSideEncryptionType;
}
export const KMSServerSideEncryptionIntegrationConfig = S.suspend(() =>
  S.Struct({
    KMSKeyId: S.optional(S.String),
    OptInStatus: S.optional(OptInStatus),
    Type: S.optional(ServerSideEncryptionType),
  }),
).annotations({
  identifier: "KMSServerSideEncryptionIntegrationConfig",
}) as any as S.Schema<KMSServerSideEncryptionIntegrationConfig>;
export interface NotificationChannelConfig {
  Sns: SnsChannelConfig;
  Filters?: NotificationFilterConfig;
}
export const NotificationChannelConfig = S.suspend(() =>
  S.Struct({
    Sns: SnsChannelConfig,
    Filters: S.optional(NotificationFilterConfig),
  }),
).annotations({
  identifier: "NotificationChannelConfig",
}) as any as S.Schema<NotificationChannelConfig>;
export interface AnomalyTimeRange {
  StartTime: Date;
  EndTime?: Date;
}
export const AnomalyTimeRange = S.suspend(() =>
  S.Struct({
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AnomalyTimeRange",
}) as any as S.Schema<AnomalyTimeRange>;
export interface AnomalyReportedTimeRange {
  OpenTime: Date;
  CloseTime?: Date;
}
export const AnomalyReportedTimeRange = S.suspend(() =>
  S.Struct({
    OpenTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    CloseTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "AnomalyReportedTimeRange",
}) as any as S.Schema<AnomalyReportedTimeRange>;
export interface CloudWatchMetricsDimension {
  Name?: string;
  Value?: string;
}
export const CloudWatchMetricsDimension = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "CloudWatchMetricsDimension",
}) as any as S.Schema<CloudWatchMetricsDimension>;
export type CloudWatchMetricsDimensions = CloudWatchMetricsDimension[];
export const CloudWatchMetricsDimensions = S.Array(CloudWatchMetricsDimension);
export type CloudWatchMetricsStat =
  | "Sum"
  | "Average"
  | "SampleCount"
  | "Minimum"
  | "Maximum"
  | "p99"
  | "p90"
  | "p50"
  | (string & {});
export const CloudWatchMetricsStat = S.String;
export interface TimestampMetricValuePair {
  Timestamp?: Date;
  MetricValue?: number;
}
export const TimestampMetricValuePair = S.suspend(() =>
  S.Struct({
    Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MetricValue: S.optional(S.Number),
  }),
).annotations({
  identifier: "TimestampMetricValuePair",
}) as any as S.Schema<TimestampMetricValuePair>;
export type TimestampMetricValuePairList = TimestampMetricValuePair[];
export const TimestampMetricValuePairList = S.Array(TimestampMetricValuePair);
export type CloudWatchMetricDataStatusCode =
  | "Complete"
  | "InternalError"
  | "PartialData"
  | (string & {});
export const CloudWatchMetricDataStatusCode = S.String;
export interface CloudWatchMetricsDataSummary {
  TimestampMetricValuePairList?: TimestampMetricValuePair[];
  StatusCode?: CloudWatchMetricDataStatusCode;
}
export const CloudWatchMetricsDataSummary = S.suspend(() =>
  S.Struct({
    TimestampMetricValuePairList: S.optional(TimestampMetricValuePairList),
    StatusCode: S.optional(CloudWatchMetricDataStatusCode),
  }),
).annotations({
  identifier: "CloudWatchMetricsDataSummary",
}) as any as S.Schema<CloudWatchMetricsDataSummary>;
export interface CloudWatchMetricsDetail {
  MetricName?: string;
  Namespace?: string;
  Dimensions?: CloudWatchMetricsDimension[];
  Stat?: CloudWatchMetricsStat;
  Unit?: string;
  Period?: number;
  MetricDataSummary?: CloudWatchMetricsDataSummary;
}
export const CloudWatchMetricsDetail = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    Namespace: S.optional(S.String),
    Dimensions: S.optional(CloudWatchMetricsDimensions),
    Stat: S.optional(CloudWatchMetricsStat),
    Unit: S.optional(S.String),
    Period: S.optional(S.Number),
    MetricDataSummary: S.optional(CloudWatchMetricsDataSummary),
  }),
).annotations({
  identifier: "CloudWatchMetricsDetail",
}) as any as S.Schema<CloudWatchMetricsDetail>;
export type CloudWatchMetricsDetails = CloudWatchMetricsDetail[];
export const CloudWatchMetricsDetails = S.Array(CloudWatchMetricsDetail);
export type PerformanceInsightsMetricDimensions = string[];
export const PerformanceInsightsMetricDimensions = S.Array(S.String);
export interface PerformanceInsightsMetricDimensionGroup {
  Group?: string;
  Dimensions?: string[];
  Limit?: number;
}
export const PerformanceInsightsMetricDimensionGroup = S.suspend(() =>
  S.Struct({
    Group: S.optional(S.String),
    Dimensions: S.optional(PerformanceInsightsMetricDimensions),
    Limit: S.optional(S.Number),
  }),
).annotations({
  identifier: "PerformanceInsightsMetricDimensionGroup",
}) as any as S.Schema<PerformanceInsightsMetricDimensionGroup>;
export type PerformanceInsightsMetricFilterMap = {
  [key: string]: string | undefined;
};
export const PerformanceInsightsMetricFilterMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface PerformanceInsightsMetricQuery {
  Metric?: string;
  GroupBy?: PerformanceInsightsMetricDimensionGroup;
  Filter?: { [key: string]: string | undefined };
}
export const PerformanceInsightsMetricQuery = S.suspend(() =>
  S.Struct({
    Metric: S.optional(S.String),
    GroupBy: S.optional(PerformanceInsightsMetricDimensionGroup),
    Filter: S.optional(PerformanceInsightsMetricFilterMap),
  }),
).annotations({
  identifier: "PerformanceInsightsMetricQuery",
}) as any as S.Schema<PerformanceInsightsMetricQuery>;
export interface PerformanceInsightsReferenceScalar {
  Value?: number;
}
export const PerformanceInsightsReferenceScalar = S.suspend(() =>
  S.Struct({ Value: S.optional(S.Number) }),
).annotations({
  identifier: "PerformanceInsightsReferenceScalar",
}) as any as S.Schema<PerformanceInsightsReferenceScalar>;
export interface PerformanceInsightsReferenceMetric {
  MetricQuery?: PerformanceInsightsMetricQuery;
}
export const PerformanceInsightsReferenceMetric = S.suspend(() =>
  S.Struct({ MetricQuery: S.optional(PerformanceInsightsMetricQuery) }),
).annotations({
  identifier: "PerformanceInsightsReferenceMetric",
}) as any as S.Schema<PerformanceInsightsReferenceMetric>;
export interface PerformanceInsightsReferenceComparisonValues {
  ReferenceScalar?: PerformanceInsightsReferenceScalar;
  ReferenceMetric?: PerformanceInsightsReferenceMetric;
}
export const PerformanceInsightsReferenceComparisonValues = S.suspend(() =>
  S.Struct({
    ReferenceScalar: S.optional(PerformanceInsightsReferenceScalar),
    ReferenceMetric: S.optional(PerformanceInsightsReferenceMetric),
  }),
).annotations({
  identifier: "PerformanceInsightsReferenceComparisonValues",
}) as any as S.Schema<PerformanceInsightsReferenceComparisonValues>;
export interface PerformanceInsightsReferenceData {
  Name?: string;
  ComparisonValues?: PerformanceInsightsReferenceComparisonValues;
}
export const PerformanceInsightsReferenceData = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    ComparisonValues: S.optional(PerformanceInsightsReferenceComparisonValues),
  }),
).annotations({
  identifier: "PerformanceInsightsReferenceData",
}) as any as S.Schema<PerformanceInsightsReferenceData>;
export type PerformanceInsightsReferenceDataList =
  PerformanceInsightsReferenceData[];
export const PerformanceInsightsReferenceDataList = S.Array(
  PerformanceInsightsReferenceData,
);
export interface PerformanceInsightsStat {
  Type?: string;
  Value?: number;
}
export const PerformanceInsightsStat = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), Value: S.optional(S.Number) }),
).annotations({
  identifier: "PerformanceInsightsStat",
}) as any as S.Schema<PerformanceInsightsStat>;
export type PerformanceInsightsStats = PerformanceInsightsStat[];
export const PerformanceInsightsStats = S.Array(PerformanceInsightsStat);
export interface PerformanceInsightsMetricsDetail {
  MetricDisplayName?: string;
  Unit?: string;
  MetricQuery?: PerformanceInsightsMetricQuery;
  ReferenceData?: PerformanceInsightsReferenceData[];
  StatsAtAnomaly?: PerformanceInsightsStat[];
  StatsAtBaseline?: PerformanceInsightsStat[];
}
export const PerformanceInsightsMetricsDetail = S.suspend(() =>
  S.Struct({
    MetricDisplayName: S.optional(S.String),
    Unit: S.optional(S.String),
    MetricQuery: S.optional(PerformanceInsightsMetricQuery),
    ReferenceData: S.optional(PerformanceInsightsReferenceDataList),
    StatsAtAnomaly: S.optional(PerformanceInsightsStats),
    StatsAtBaseline: S.optional(PerformanceInsightsStats),
  }),
).annotations({
  identifier: "PerformanceInsightsMetricsDetail",
}) as any as S.Schema<PerformanceInsightsMetricsDetail>;
export type PerformanceInsightsMetricsDetails =
  PerformanceInsightsMetricsDetail[];
export const PerformanceInsightsMetricsDetails = S.Array(
  PerformanceInsightsMetricsDetail,
);
export interface AnomalySourceDetails {
  CloudWatchMetrics?: CloudWatchMetricsDetail[];
  PerformanceInsightsMetrics?: PerformanceInsightsMetricsDetail[];
}
export const AnomalySourceDetails = S.suspend(() =>
  S.Struct({
    CloudWatchMetrics: S.optional(CloudWatchMetricsDetails),
    PerformanceInsightsMetrics: S.optional(PerformanceInsightsMetricsDetails),
  }),
).annotations({
  identifier: "AnomalySourceDetails",
}) as any as S.Schema<AnomalySourceDetails>;
export interface AnomalyResource {
  Name?: string;
  Type?: string;
}
export const AnomalyResource = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({
  identifier: "AnomalyResource",
}) as any as S.Schema<AnomalyResource>;
export type AnomalyResources = AnomalyResource[];
export const AnomalyResources = S.Array(AnomalyResource);
export interface ReactiveAnomaly {
  Id?: string;
  Severity?: AnomalySeverity;
  Status?: AnomalyStatus;
  AnomalyTimeRange?: AnomalyTimeRange;
  AnomalyReportedTimeRange?: AnomalyReportedTimeRange;
  SourceDetails?: AnomalySourceDetails;
  AssociatedInsightId?: string;
  ResourceCollection?: ResourceCollection;
  Type?: AnomalyType;
  Name?: string;
  Description?: string;
  CausalAnomalyId?: string;
  AnomalyResources?: AnomalyResource[];
}
export const ReactiveAnomaly = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Severity: S.optional(AnomalySeverity),
    Status: S.optional(AnomalyStatus),
    AnomalyTimeRange: S.optional(AnomalyTimeRange),
    AnomalyReportedTimeRange: S.optional(AnomalyReportedTimeRange),
    SourceDetails: S.optional(AnomalySourceDetails),
    AssociatedInsightId: S.optional(S.String),
    ResourceCollection: S.optional(ResourceCollection),
    Type: S.optional(AnomalyType),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CausalAnomalyId: S.optional(S.String),
    AnomalyResources: S.optional(AnomalyResources),
  }),
).annotations({
  identifier: "ReactiveAnomaly",
}) as any as S.Schema<ReactiveAnomaly>;
export interface InsightTimeRange {
  StartTime: Date;
  EndTime?: Date;
}
export const InsightTimeRange = S.suspend(() =>
  S.Struct({
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "InsightTimeRange",
}) as any as S.Schema<InsightTimeRange>;
export interface ReactiveInsight {
  Id?: string;
  Name?: string;
  Severity?: InsightSeverity;
  Status?: InsightStatus;
  InsightTimeRange?: InsightTimeRange;
  ResourceCollection?: ResourceCollection;
  SsmOpsItemId?: string;
  Description?: string;
}
export const ReactiveInsight = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Severity: S.optional(InsightSeverity),
    Status: S.optional(InsightStatus),
    InsightTimeRange: S.optional(InsightTimeRange),
    ResourceCollection: S.optional(ResourceCollection),
    SsmOpsItemId: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "ReactiveInsight",
}) as any as S.Schema<ReactiveInsight>;
export interface ServiceIntegrationConfig {
  OpsCenter?: OpsCenterIntegration;
  LogsAnomalyDetection?: LogsAnomalyDetectionIntegration;
  KMSServerSideEncryption?: KMSServerSideEncryptionIntegration;
}
export const ServiceIntegrationConfig = S.suspend(() =>
  S.Struct({
    OpsCenter: S.optional(OpsCenterIntegration),
    LogsAnomalyDetection: S.optional(LogsAnomalyDetectionIntegration),
    KMSServerSideEncryption: S.optional(KMSServerSideEncryptionIntegration),
  }),
).annotations({
  identifier: "ServiceIntegrationConfig",
}) as any as S.Schema<ServiceIntegrationConfig>;
export interface ServiceResourceCost {
  Type?: string;
  State?: CostEstimationServiceResourceState;
  Count?: number;
  UnitCost?: number;
  Cost?: number;
}
export const ServiceResourceCost = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    State: S.optional(CostEstimationServiceResourceState),
    Count: S.optional(S.Number),
    UnitCost: S.optional(S.Number),
    Cost: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServiceResourceCost",
}) as any as S.Schema<ServiceResourceCost>;
export type ServiceResourceCosts = ServiceResourceCost[];
export const ServiceResourceCosts = S.Array(ServiceResourceCost);
export interface CostEstimationTimeRange {
  StartTime?: Date;
  EndTime?: Date;
}
export const CostEstimationTimeRange = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "CostEstimationTimeRange",
}) as any as S.Schema<CostEstimationTimeRange>;
export interface ListAnomaliesForInsightFilters {
  ServiceCollection?: ServiceCollection;
}
export const ListAnomaliesForInsightFilters = S.suspend(() =>
  S.Struct({ ServiceCollection: S.optional(ServiceCollection) }),
).annotations({
  identifier: "ListAnomaliesForInsightFilters",
}) as any as S.Schema<ListAnomaliesForInsightFilters>;
export interface NotificationChannel {
  Id?: string;
  Config?: NotificationChannelConfig;
}
export const NotificationChannel = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Config: S.optional(NotificationChannelConfig),
  }),
).annotations({
  identifier: "NotificationChannel",
}) as any as S.Schema<NotificationChannel>;
export type Channels = NotificationChannel[];
export const Channels = S.Array(NotificationChannel);
export interface PredictionTimeRange {
  StartTime: Date;
  EndTime?: Date;
}
export const PredictionTimeRange = S.suspend(() =>
  S.Struct({
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "PredictionTimeRange",
}) as any as S.Schema<PredictionTimeRange>;
export interface ProactiveOrganizationInsightSummary {
  Id?: string;
  AccountId?: string;
  OrganizationalUnitId?: string;
  Name?: string;
  Severity?: InsightSeverity;
  Status?: InsightStatus;
  InsightTimeRange?: InsightTimeRange;
  PredictionTimeRange?: PredictionTimeRange;
  ResourceCollection?: ResourceCollection;
  ServiceCollection?: ServiceCollection;
}
export const ProactiveOrganizationInsightSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    AccountId: S.optional(S.String),
    OrganizationalUnitId: S.optional(S.String),
    Name: S.optional(S.String),
    Severity: S.optional(InsightSeverity),
    Status: S.optional(InsightStatus),
    InsightTimeRange: S.optional(InsightTimeRange),
    PredictionTimeRange: S.optional(PredictionTimeRange),
    ResourceCollection: S.optional(ResourceCollection),
    ServiceCollection: S.optional(ServiceCollection),
  }),
).annotations({
  identifier: "ProactiveOrganizationInsightSummary",
}) as any as S.Schema<ProactiveOrganizationInsightSummary>;
export type ProactiveOrganizationInsights =
  ProactiveOrganizationInsightSummary[];
export const ProactiveOrganizationInsights = S.Array(
  ProactiveOrganizationInsightSummary,
);
export interface ReactiveOrganizationInsightSummary {
  Id?: string;
  AccountId?: string;
  OrganizationalUnitId?: string;
  Name?: string;
  Severity?: InsightSeverity;
  Status?: InsightStatus;
  InsightTimeRange?: InsightTimeRange;
  ResourceCollection?: ResourceCollection;
  ServiceCollection?: ServiceCollection;
}
export const ReactiveOrganizationInsightSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    AccountId: S.optional(S.String),
    OrganizationalUnitId: S.optional(S.String),
    Name: S.optional(S.String),
    Severity: S.optional(InsightSeverity),
    Status: S.optional(InsightStatus),
    InsightTimeRange: S.optional(InsightTimeRange),
    ResourceCollection: S.optional(ResourceCollection),
    ServiceCollection: S.optional(ServiceCollection),
  }),
).annotations({
  identifier: "ReactiveOrganizationInsightSummary",
}) as any as S.Schema<ReactiveOrganizationInsightSummary>;
export type ReactiveOrganizationInsights = ReactiveOrganizationInsightSummary[];
export const ReactiveOrganizationInsights = S.Array(
  ReactiveOrganizationInsightSummary,
);
export interface CostEstimationResourceCollectionFilter {
  CloudFormation?: CloudFormationCostEstimationResourceCollectionFilter;
  Tags?: TagCostEstimationResourceCollectionFilter[];
}
export const CostEstimationResourceCollectionFilter = S.suspend(() =>
  S.Struct({
    CloudFormation: S.optional(
      CloudFormationCostEstimationResourceCollectionFilter,
    ),
    Tags: S.optional(TagCostEstimationResourceCollectionFilters),
  }),
).annotations({
  identifier: "CostEstimationResourceCollectionFilter",
}) as any as S.Schema<CostEstimationResourceCollectionFilter>;
export interface UpdateResourceCollectionFilter {
  CloudFormation?: UpdateCloudFormationCollectionFilter;
  Tags?: UpdateTagCollectionFilter[];
}
export const UpdateResourceCollectionFilter = S.suspend(() =>
  S.Struct({
    CloudFormation: S.optional(UpdateCloudFormationCollectionFilter),
    Tags: S.optional(UpdateTagCollectionFilters),
  }),
).annotations({
  identifier: "UpdateResourceCollectionFilter",
}) as any as S.Schema<UpdateResourceCollectionFilter>;
export interface UpdateServiceIntegrationConfig {
  OpsCenter?: OpsCenterIntegrationConfig;
  LogsAnomalyDetection?: LogsAnomalyDetectionIntegrationConfig;
  KMSServerSideEncryption?: KMSServerSideEncryptionIntegrationConfig;
}
export const UpdateServiceIntegrationConfig = S.suspend(() =>
  S.Struct({
    OpsCenter: S.optional(OpsCenterIntegrationConfig),
    LogsAnomalyDetection: S.optional(LogsAnomalyDetectionIntegrationConfig),
    KMSServerSideEncryption: S.optional(
      KMSServerSideEncryptionIntegrationConfig,
    ),
  }),
).annotations({
  identifier: "UpdateServiceIntegrationConfig",
}) as any as S.Schema<UpdateServiceIntegrationConfig>;
export interface AddNotificationChannelRequest {
  Config: NotificationChannelConfig;
}
export const AddNotificationChannelRequest = S.suspend(() =>
  S.Struct({ Config: NotificationChannelConfig }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/channels" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddNotificationChannelRequest",
}) as any as S.Schema<AddNotificationChannelRequest>;
export interface DescribeEventSourcesConfigResponse {
  EventSources?: EventSourcesConfig;
}
export const DescribeEventSourcesConfigResponse = S.suspend(() =>
  S.Struct({ EventSources: S.optional(EventSourcesConfig) }),
).annotations({
  identifier: "DescribeEventSourcesConfigResponse",
}) as any as S.Schema<DescribeEventSourcesConfigResponse>;
export interface DescribeServiceIntegrationResponse {
  ServiceIntegration?: ServiceIntegrationConfig;
}
export const DescribeServiceIntegrationResponse = S.suspend(() =>
  S.Struct({ ServiceIntegration: S.optional(ServiceIntegrationConfig) }),
).annotations({
  identifier: "DescribeServiceIntegrationResponse",
}) as any as S.Schema<DescribeServiceIntegrationResponse>;
export interface GetCostEstimationResponse {
  ResourceCollection?: CostEstimationResourceCollectionFilter;
  Status?: CostEstimationStatus;
  Costs?: ServiceResourceCost[];
  TimeRange?: CostEstimationTimeRange;
  TotalCost?: number;
  NextToken?: string;
}
export const GetCostEstimationResponse = S.suspend(() =>
  S.Struct({
    ResourceCollection: S.optional(CostEstimationResourceCollectionFilter),
    Status: S.optional(CostEstimationStatus),
    Costs: S.optional(ServiceResourceCosts),
    TimeRange: S.optional(CostEstimationTimeRange),
    TotalCost: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCostEstimationResponse",
}) as any as S.Schema<GetCostEstimationResponse>;
export interface ListAnomaliesForInsightRequest {
  InsightId: string;
  StartTimeRange?: StartTimeRange;
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
  Filters?: ListAnomaliesForInsightFilters;
}
export const ListAnomaliesForInsightRequest = S.suspend(() =>
  S.Struct({
    InsightId: S.String.pipe(T.HttpLabel("InsightId")),
    StartTimeRange: S.optional(StartTimeRange),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
    Filters: S.optional(ListAnomaliesForInsightFilters),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/anomalies/insight/{InsightId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAnomaliesForInsightRequest",
}) as any as S.Schema<ListAnomaliesForInsightRequest>;
export interface ListNotificationChannelsResponse {
  Channels?: NotificationChannel[];
  NextToken?: string;
}
export const ListNotificationChannelsResponse = S.suspend(() =>
  S.Struct({ Channels: S.optional(Channels), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListNotificationChannelsResponse",
}) as any as S.Schema<ListNotificationChannelsResponse>;
export interface ListOrganizationInsightsResponse {
  ProactiveInsights?: ProactiveOrganizationInsightSummary[];
  ReactiveInsights?: ReactiveOrganizationInsightSummary[];
  NextToken?: string;
}
export const ListOrganizationInsightsResponse = S.suspend(() =>
  S.Struct({
    ProactiveInsights: S.optional(ProactiveOrganizationInsights),
    ReactiveInsights: S.optional(ReactiveOrganizationInsights),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListOrganizationInsightsResponse",
}) as any as S.Schema<ListOrganizationInsightsResponse>;
export type AssociatedResourceArns = string[];
export const AssociatedResourceArns = S.Array(S.String);
export interface ProactiveInsightSummary {
  Id?: string;
  Name?: string;
  Severity?: InsightSeverity;
  Status?: InsightStatus;
  InsightTimeRange?: InsightTimeRange;
  PredictionTimeRange?: PredictionTimeRange;
  ResourceCollection?: ResourceCollection;
  ServiceCollection?: ServiceCollection;
  AssociatedResourceArns?: string[];
}
export const ProactiveInsightSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Severity: S.optional(InsightSeverity),
    Status: S.optional(InsightStatus),
    InsightTimeRange: S.optional(InsightTimeRange),
    PredictionTimeRange: S.optional(PredictionTimeRange),
    ResourceCollection: S.optional(ResourceCollection),
    ServiceCollection: S.optional(ServiceCollection),
    AssociatedResourceArns: S.optional(AssociatedResourceArns),
  }),
).annotations({
  identifier: "ProactiveInsightSummary",
}) as any as S.Schema<ProactiveInsightSummary>;
export type ProactiveInsights = ProactiveInsightSummary[];
export const ProactiveInsights = S.Array(ProactiveInsightSummary);
export interface ReactiveInsightSummary {
  Id?: string;
  Name?: string;
  Severity?: InsightSeverity;
  Status?: InsightStatus;
  InsightTimeRange?: InsightTimeRange;
  ResourceCollection?: ResourceCollection;
  ServiceCollection?: ServiceCollection;
  AssociatedResourceArns?: string[];
}
export const ReactiveInsightSummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Severity: S.optional(InsightSeverity),
    Status: S.optional(InsightStatus),
    InsightTimeRange: S.optional(InsightTimeRange),
    ResourceCollection: S.optional(ResourceCollection),
    ServiceCollection: S.optional(ServiceCollection),
    AssociatedResourceArns: S.optional(AssociatedResourceArns),
  }),
).annotations({
  identifier: "ReactiveInsightSummary",
}) as any as S.Schema<ReactiveInsightSummary>;
export type ReactiveInsights = ReactiveInsightSummary[];
export const ReactiveInsights = S.Array(ReactiveInsightSummary);
export interface SearchOrganizationInsightsResponse {
  ProactiveInsights?: ProactiveInsightSummary[];
  ReactiveInsights?: ReactiveInsightSummary[];
  NextToken?: string;
}
export const SearchOrganizationInsightsResponse = S.suspend(() =>
  S.Struct({
    ProactiveInsights: S.optional(ProactiveInsights),
    ReactiveInsights: S.optional(ReactiveInsights),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchOrganizationInsightsResponse",
}) as any as S.Schema<SearchOrganizationInsightsResponse>;
export interface StartCostEstimationRequest {
  ResourceCollection: CostEstimationResourceCollectionFilter;
  ClientToken?: string;
}
export const StartCostEstimationRequest = S.suspend(() =>
  S.Struct({
    ResourceCollection: CostEstimationResourceCollectionFilter,
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/cost-estimation" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartCostEstimationRequest",
}) as any as S.Schema<StartCostEstimationRequest>;
export interface StartCostEstimationResponse {}
export const StartCostEstimationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartCostEstimationResponse",
}) as any as S.Schema<StartCostEstimationResponse>;
export interface UpdateResourceCollectionRequest {
  Action: UpdateResourceCollectionAction;
  ResourceCollection: UpdateResourceCollectionFilter;
}
export const UpdateResourceCollectionRequest = S.suspend(() =>
  S.Struct({
    Action: UpdateResourceCollectionAction,
    ResourceCollection: UpdateResourceCollectionFilter,
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/resource-collections" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateResourceCollectionRequest",
}) as any as S.Schema<UpdateResourceCollectionRequest>;
export interface UpdateResourceCollectionResponse {}
export const UpdateResourceCollectionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateResourceCollectionResponse",
}) as any as S.Schema<UpdateResourceCollectionResponse>;
export interface UpdateServiceIntegrationRequest {
  ServiceIntegration: UpdateServiceIntegrationConfig;
}
export const UpdateServiceIntegrationRequest = S.suspend(() =>
  S.Struct({ ServiceIntegration: UpdateServiceIntegrationConfig }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/service-integrations" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateServiceIntegrationRequest",
}) as any as S.Schema<UpdateServiceIntegrationRequest>;
export interface UpdateServiceIntegrationResponse {}
export const UpdateServiceIntegrationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateServiceIntegrationResponse",
}) as any as S.Schema<UpdateServiceIntegrationResponse>;
export interface AnomalySourceMetadata {
  Source?: string;
  SourceResourceName?: string;
  SourceResourceType?: string;
}
export const AnomalySourceMetadata = S.suspend(() =>
  S.Struct({
    Source: S.optional(S.String),
    SourceResourceName: S.optional(S.String),
    SourceResourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "AnomalySourceMetadata",
}) as any as S.Schema<AnomalySourceMetadata>;
export interface AccountInsightHealth {
  OpenProactiveInsights?: number;
  OpenReactiveInsights?: number;
}
export const AccountInsightHealth = S.suspend(() =>
  S.Struct({
    OpenProactiveInsights: S.optional(S.Number),
    OpenReactiveInsights: S.optional(S.Number),
  }),
).annotations({
  identifier: "AccountInsightHealth",
}) as any as S.Schema<AccountInsightHealth>;
export interface CloudFormationCollectionFilter {
  StackNames?: string[];
}
export const CloudFormationCollectionFilter = S.suspend(() =>
  S.Struct({ StackNames: S.optional(StackNames) }),
).annotations({
  identifier: "CloudFormationCollectionFilter",
}) as any as S.Schema<CloudFormationCollectionFilter>;
export interface TagCollectionFilter {
  AppBoundaryKey: string;
  TagValues: string[];
}
export const TagCollectionFilter = S.suspend(() =>
  S.Struct({ AppBoundaryKey: S.String, TagValues: TagValues }),
).annotations({
  identifier: "TagCollectionFilter",
}) as any as S.Schema<TagCollectionFilter>;
export type TagCollectionFilters = TagCollectionFilter[];
export const TagCollectionFilters = S.Array(TagCollectionFilter);
export type LogAnomalyType =
  | "KEYWORD"
  | "KEYWORD_TOKEN"
  | "FORMAT"
  | "HTTP_CODE"
  | "BLOCK_FORMAT"
  | "NUMERICAL_POINT"
  | "NUMERICAL_NAN"
  | "NEW_FIELD_NAME"
  | (string & {});
export const LogAnomalyType = S.String;
export interface ProactiveInsight {
  Id?: string;
  Name?: string;
  Severity?: InsightSeverity;
  Status?: InsightStatus;
  InsightTimeRange?: InsightTimeRange;
  PredictionTimeRange?: PredictionTimeRange;
  ResourceCollection?: ResourceCollection;
  SsmOpsItemId?: string;
  Description?: string;
}
export const ProactiveInsight = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Name: S.optional(S.String),
    Severity: S.optional(InsightSeverity),
    Status: S.optional(InsightStatus),
    InsightTimeRange: S.optional(InsightTimeRange),
    PredictionTimeRange: S.optional(PredictionTimeRange),
    ResourceCollection: S.optional(ResourceCollection),
    SsmOpsItemId: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "ProactiveInsight",
}) as any as S.Schema<ProactiveInsight>;
export interface AccountHealth {
  AccountId?: string;
  Insight?: AccountInsightHealth;
}
export const AccountHealth = S.suspend(() =>
  S.Struct({
    AccountId: S.optional(S.String),
    Insight: S.optional(AccountInsightHealth),
  }),
).annotations({
  identifier: "AccountHealth",
}) as any as S.Schema<AccountHealth>;
export type AccountHealths = AccountHealth[];
export const AccountHealths = S.Array(AccountHealth);
export interface ResourceCollectionFilter {
  CloudFormation?: CloudFormationCollectionFilter;
  Tags?: TagCollectionFilter[];
}
export const ResourceCollectionFilter = S.suspend(() =>
  S.Struct({
    CloudFormation: S.optional(CloudFormationCollectionFilter),
    Tags: S.optional(TagCollectionFilters),
  }),
).annotations({
  identifier: "ResourceCollectionFilter",
}) as any as S.Schema<ResourceCollectionFilter>;
export interface ListEventsFilters {
  InsightId?: string;
  EventTimeRange?: EventTimeRange;
  EventClass?: EventClass;
  EventSource?: string;
  DataSource?: EventDataSource;
  ResourceCollection?: ResourceCollection;
}
export const ListEventsFilters = S.suspend(() =>
  S.Struct({
    InsightId: S.optional(S.String),
    EventTimeRange: S.optional(EventTimeRange),
    EventClass: S.optional(EventClass),
    EventSource: S.optional(S.String),
    DataSource: S.optional(EventDataSource),
    ResourceCollection: S.optional(ResourceCollection),
  }),
).annotations({
  identifier: "ListEventsFilters",
}) as any as S.Schema<ListEventsFilters>;
export interface MonitoredResourceIdentifier {
  MonitoredResourceName?: string;
  Type?: string;
  ResourcePermission?: ResourcePermission;
  LastUpdated?: Date;
  ResourceCollection?: ResourceCollection;
}
export const MonitoredResourceIdentifier = S.suspend(() =>
  S.Struct({
    MonitoredResourceName: S.optional(S.String),
    Type: S.optional(S.String),
    ResourcePermission: S.optional(ResourcePermission),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ResourceCollection: S.optional(ResourceCollection),
  }),
).annotations({
  identifier: "MonitoredResourceIdentifier",
}) as any as S.Schema<MonitoredResourceIdentifier>;
export type MonitoredResourceIdentifiers = MonitoredResourceIdentifier[];
export const MonitoredResourceIdentifiers = S.Array(
  MonitoredResourceIdentifier,
);
export interface LogAnomalyClass {
  LogStreamName?: string;
  LogAnomalyType?: LogAnomalyType;
  LogAnomalyToken?: string;
  LogEventId?: string;
  Explanation?: string;
  NumberOfLogLinesOccurrences?: number;
  LogEventTimestamp?: Date;
}
export const LogAnomalyClass = S.suspend(() =>
  S.Struct({
    LogStreamName: S.optional(S.String),
    LogAnomalyType: S.optional(LogAnomalyType),
    LogAnomalyToken: S.optional(S.String),
    LogEventId: S.optional(S.String),
    Explanation: S.optional(S.String),
    NumberOfLogLinesOccurrences: S.optional(S.Number),
    LogEventTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "LogAnomalyClass",
}) as any as S.Schema<LogAnomalyClass>;
export type LogAnomalyClasses = LogAnomalyClass[];
export const LogAnomalyClasses = S.Array(LogAnomalyClass);
export interface RecommendationRelatedEventResource {
  Name?: string;
  Type?: string;
}
export const RecommendationRelatedEventResource = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({
  identifier: "RecommendationRelatedEventResource",
}) as any as S.Schema<RecommendationRelatedEventResource>;
export type RecommendationRelatedEventResources =
  RecommendationRelatedEventResource[];
export const RecommendationRelatedEventResources = S.Array(
  RecommendationRelatedEventResource,
);
export interface RecommendationRelatedAnomalyResource {
  Name?: string;
  Type?: string;
}
export const RecommendationRelatedAnomalyResource = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), Type: S.optional(S.String) }),
).annotations({
  identifier: "RecommendationRelatedAnomalyResource",
}) as any as S.Schema<RecommendationRelatedAnomalyResource>;
export type RecommendationRelatedAnomalyResources =
  RecommendationRelatedAnomalyResource[];
export const RecommendationRelatedAnomalyResources = S.Array(
  RecommendationRelatedAnomalyResource,
);
export interface AddNotificationChannelResponse {
  Id: string;
}
export const AddNotificationChannelResponse = S.suspend(() =>
  S.Struct({ Id: S.String }),
).annotations({
  identifier: "AddNotificationChannelResponse",
}) as any as S.Schema<AddNotificationChannelResponse>;
export interface DescribeInsightResponse {
  ProactiveInsight?: ProactiveInsight;
  ReactiveInsight?: ReactiveInsight;
}
export const DescribeInsightResponse = S.suspend(() =>
  S.Struct({
    ProactiveInsight: S.optional(ProactiveInsight),
    ReactiveInsight: S.optional(ReactiveInsight),
  }),
).annotations({
  identifier: "DescribeInsightResponse",
}) as any as S.Schema<DescribeInsightResponse>;
export interface DescribeOrganizationResourceCollectionHealthResponse {
  CloudFormation?: CloudFormationHealth[];
  Service?: ServiceHealth[];
  Account?: AccountHealth[];
  NextToken?: string;
  Tags?: TagHealth[];
}
export const DescribeOrganizationResourceCollectionHealthResponse = S.suspend(
  () =>
    S.Struct({
      CloudFormation: S.optional(CloudFormationHealths),
      Service: S.optional(ServiceHealths),
      Account: S.optional(AccountHealths),
      NextToken: S.optional(S.String),
      Tags: S.optional(TagHealths),
    }),
).annotations({
  identifier: "DescribeOrganizationResourceCollectionHealthResponse",
}) as any as S.Schema<DescribeOrganizationResourceCollectionHealthResponse>;
export interface GetResourceCollectionResponse {
  ResourceCollection?: ResourceCollectionFilter;
  NextToken?: string;
}
export const GetResourceCollectionResponse = S.suspend(() =>
  S.Struct({
    ResourceCollection: S.optional(ResourceCollectionFilter),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourceCollectionResponse",
}) as any as S.Schema<GetResourceCollectionResponse>;
export interface ListEventsRequest {
  Filters: ListEventsFilters;
  MaxResults?: number;
  NextToken?: string;
  AccountId?: string;
}
export const ListEventsRequest = S.suspend(() =>
  S.Struct({
    Filters: ListEventsFilters,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/events" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListEventsRequest",
}) as any as S.Schema<ListEventsRequest>;
export interface ListInsightsRequest {
  StatusFilter: ListInsightsStatusFilter;
  MaxResults?: number;
  NextToken?: string;
}
export const ListInsightsRequest = S.suspend(() =>
  S.Struct({
    StatusFilter: ListInsightsStatusFilter,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/insights" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListInsightsRequest",
}) as any as S.Schema<ListInsightsRequest>;
export interface ListMonitoredResourcesResponse {
  MonitoredResourceIdentifiers: MonitoredResourceIdentifier[];
  NextToken?: string;
}
export const ListMonitoredResourcesResponse = S.suspend(() =>
  S.Struct({
    MonitoredResourceIdentifiers: MonitoredResourceIdentifiers,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMonitoredResourcesResponse",
}) as any as S.Schema<ListMonitoredResourcesResponse>;
export interface SearchInsightsResponse {
  ProactiveInsights?: ProactiveInsightSummary[];
  ReactiveInsights?: ReactiveInsightSummary[];
  NextToken?: string;
}
export const SearchInsightsResponse = S.suspend(() =>
  S.Struct({
    ProactiveInsights: S.optional(ProactiveInsights),
    ReactiveInsights: S.optional(ReactiveInsights),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchInsightsResponse",
}) as any as S.Schema<SearchInsightsResponse>;
export interface LogAnomalyShowcase {
  LogAnomalyClasses?: LogAnomalyClass[];
}
export const LogAnomalyShowcase = S.suspend(() =>
  S.Struct({ LogAnomalyClasses: S.optional(LogAnomalyClasses) }),
).annotations({
  identifier: "LogAnomalyShowcase",
}) as any as S.Schema<LogAnomalyShowcase>;
export type LogAnomalyShowcases = LogAnomalyShowcase[];
export const LogAnomalyShowcases = S.Array(LogAnomalyShowcase);
export interface RecommendationRelatedEvent {
  Name?: string;
  Resources?: RecommendationRelatedEventResource[];
}
export const RecommendationRelatedEvent = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Resources: S.optional(RecommendationRelatedEventResources),
  }),
).annotations({
  identifier: "RecommendationRelatedEvent",
}) as any as S.Schema<RecommendationRelatedEvent>;
export type RecommendationRelatedEvents = RecommendationRelatedEvent[];
export const RecommendationRelatedEvents = S.Array(RecommendationRelatedEvent);
export interface RecommendationRelatedCloudWatchMetricsSourceDetail {
  MetricName?: string;
  Namespace?: string;
}
export const RecommendationRelatedCloudWatchMetricsSourceDetail = S.suspend(
  () =>
    S.Struct({
      MetricName: S.optional(S.String),
      Namespace: S.optional(S.String),
    }),
).annotations({
  identifier: "RecommendationRelatedCloudWatchMetricsSourceDetail",
}) as any as S.Schema<RecommendationRelatedCloudWatchMetricsSourceDetail>;
export type RecommendationRelatedCloudWatchMetricsSourceDetails =
  RecommendationRelatedCloudWatchMetricsSourceDetail[];
export const RecommendationRelatedCloudWatchMetricsSourceDetails = S.Array(
  RecommendationRelatedCloudWatchMetricsSourceDetail,
);
export type ValidationExceptionReason =
  | "UNKNOWN_OPERATION"
  | "CANNOT_PARSE"
  | "FIELD_VALIDATION_FAILED"
  | "OTHER"
  | "INVALID_PARAMETER_COMBINATION"
  | "PARAMETER_INCONSISTENT_WITH_SERVICE_STATE"
  | (string & {});
export const ValidationExceptionReason = S.String;
export interface ProactiveAnomalySummary {
  Id?: string;
  Severity?: AnomalySeverity;
  Status?: AnomalyStatus;
  UpdateTime?: Date;
  AnomalyTimeRange?: AnomalyTimeRange;
  AnomalyReportedTimeRange?: AnomalyReportedTimeRange;
  PredictionTimeRange?: PredictionTimeRange;
  SourceDetails?: AnomalySourceDetails;
  AssociatedInsightId?: string;
  ResourceCollection?: ResourceCollection;
  Limit?: number;
  SourceMetadata?: AnomalySourceMetadata;
  AnomalyResources?: AnomalyResource[];
  Description?: string;
}
export const ProactiveAnomalySummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Severity: S.optional(AnomalySeverity),
    Status: S.optional(AnomalyStatus),
    UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AnomalyTimeRange: S.optional(AnomalyTimeRange),
    AnomalyReportedTimeRange: S.optional(AnomalyReportedTimeRange),
    PredictionTimeRange: S.optional(PredictionTimeRange),
    SourceDetails: S.optional(AnomalySourceDetails),
    AssociatedInsightId: S.optional(S.String),
    ResourceCollection: S.optional(ResourceCollection),
    Limit: S.optional(S.Number),
    SourceMetadata: S.optional(AnomalySourceMetadata),
    AnomalyResources: S.optional(AnomalyResources),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "ProactiveAnomalySummary",
}) as any as S.Schema<ProactiveAnomalySummary>;
export type ProactiveAnomalies = ProactiveAnomalySummary[];
export const ProactiveAnomalies = S.Array(ProactiveAnomalySummary);
export interface ReactiveAnomalySummary {
  Id?: string;
  Severity?: AnomalySeverity;
  Status?: AnomalyStatus;
  AnomalyTimeRange?: AnomalyTimeRange;
  AnomalyReportedTimeRange?: AnomalyReportedTimeRange;
  SourceDetails?: AnomalySourceDetails;
  AssociatedInsightId?: string;
  ResourceCollection?: ResourceCollection;
  Type?: AnomalyType;
  Name?: string;
  Description?: string;
  CausalAnomalyId?: string;
  AnomalyResources?: AnomalyResource[];
}
export const ReactiveAnomalySummary = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Severity: S.optional(AnomalySeverity),
    Status: S.optional(AnomalyStatus),
    AnomalyTimeRange: S.optional(AnomalyTimeRange),
    AnomalyReportedTimeRange: S.optional(AnomalyReportedTimeRange),
    SourceDetails: S.optional(AnomalySourceDetails),
    AssociatedInsightId: S.optional(S.String),
    ResourceCollection: S.optional(ResourceCollection),
    Type: S.optional(AnomalyType),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CausalAnomalyId: S.optional(S.String),
    AnomalyResources: S.optional(AnomalyResources),
  }),
).annotations({
  identifier: "ReactiveAnomalySummary",
}) as any as S.Schema<ReactiveAnomalySummary>;
export type ReactiveAnomalies = ReactiveAnomalySummary[];
export const ReactiveAnomalies = S.Array(ReactiveAnomalySummary);
export interface AnomalousLogGroup {
  LogGroupName?: string;
  ImpactStartTime?: Date;
  ImpactEndTime?: Date;
  NumberOfLogLinesScanned?: number;
  LogAnomalyShowcases?: LogAnomalyShowcase[];
}
export const AnomalousLogGroup = S.suspend(() =>
  S.Struct({
    LogGroupName: S.optional(S.String),
    ImpactStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ImpactEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NumberOfLogLinesScanned: S.optional(S.Number),
    LogAnomalyShowcases: S.optional(LogAnomalyShowcases),
  }),
).annotations({
  identifier: "AnomalousLogGroup",
}) as any as S.Schema<AnomalousLogGroup>;
export type AnomalousLogGroups = AnomalousLogGroup[];
export const AnomalousLogGroups = S.Array(AnomalousLogGroup);
export interface RecommendationRelatedAnomalySourceDetail {
  CloudWatchMetrics?: RecommendationRelatedCloudWatchMetricsSourceDetail[];
}
export const RecommendationRelatedAnomalySourceDetail = S.suspend(() =>
  S.Struct({
    CloudWatchMetrics: S.optional(
      RecommendationRelatedCloudWatchMetricsSourceDetails,
    ),
  }),
).annotations({
  identifier: "RecommendationRelatedAnomalySourceDetail",
}) as any as S.Schema<RecommendationRelatedAnomalySourceDetail>;
export type RelatedAnomalySourceDetails =
  RecommendationRelatedAnomalySourceDetail[];
export const RelatedAnomalySourceDetails = S.Array(
  RecommendationRelatedAnomalySourceDetail,
);
export interface ListAnomaliesForInsightResponse {
  ProactiveAnomalies?: ProactiveAnomalySummary[];
  ReactiveAnomalies?: ReactiveAnomalySummary[];
  NextToken?: string;
}
export const ListAnomaliesForInsightResponse = S.suspend(() =>
  S.Struct({
    ProactiveAnomalies: S.optional(ProactiveAnomalies),
    ReactiveAnomalies: S.optional(ReactiveAnomalies),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAnomaliesForInsightResponse",
}) as any as S.Schema<ListAnomaliesForInsightResponse>;
export interface ListAnomalousLogGroupsResponse {
  InsightId: string;
  AnomalousLogGroups: AnomalousLogGroup[];
  NextToken?: string;
}
export const ListAnomalousLogGroupsResponse = S.suspend(() =>
  S.Struct({
    InsightId: S.String,
    AnomalousLogGroups: AnomalousLogGroups,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAnomalousLogGroupsResponse",
}) as any as S.Schema<ListAnomalousLogGroupsResponse>;
export interface ListInsightsResponse {
  ProactiveInsights?: ProactiveInsightSummary[];
  ReactiveInsights?: ReactiveInsightSummary[];
  NextToken?: string;
}
export const ListInsightsResponse = S.suspend(() =>
  S.Struct({
    ProactiveInsights: S.optional(ProactiveInsights),
    ReactiveInsights: S.optional(ReactiveInsights),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListInsightsResponse",
}) as any as S.Schema<ListInsightsResponse>;
export interface RecommendationRelatedAnomaly {
  Resources?: RecommendationRelatedAnomalyResource[];
  SourceDetails?: RecommendationRelatedAnomalySourceDetail[];
  AnomalyId?: string;
}
export const RecommendationRelatedAnomaly = S.suspend(() =>
  S.Struct({
    Resources: S.optional(RecommendationRelatedAnomalyResources),
    SourceDetails: S.optional(RelatedAnomalySourceDetails),
    AnomalyId: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommendationRelatedAnomaly",
}) as any as S.Schema<RecommendationRelatedAnomaly>;
export type RecommendationRelatedAnomalies = RecommendationRelatedAnomaly[];
export const RecommendationRelatedAnomalies = S.Array(
  RecommendationRelatedAnomaly,
);
export interface ValidationExceptionField {
  Name: string;
  Message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ Name: S.String, Message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFields = ValidationExceptionField[];
export const ValidationExceptionFields = S.Array(ValidationExceptionField);
export interface Recommendation {
  Description?: string;
  Link?: string;
  Name?: string;
  Reason?: string;
  RelatedEvents?: RecommendationRelatedEvent[];
  RelatedAnomalies?: RecommendationRelatedAnomaly[];
  Category?: string;
}
export const Recommendation = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    Link: S.optional(S.String),
    Name: S.optional(S.String),
    Reason: S.optional(S.String),
    RelatedEvents: S.optional(RecommendationRelatedEvents),
    RelatedAnomalies: S.optional(RecommendationRelatedAnomalies),
    Category: S.optional(S.String),
  }),
).annotations({
  identifier: "Recommendation",
}) as any as S.Schema<Recommendation>;
export type Recommendations = Recommendation[];
export const Recommendations = S.Array(Recommendation);
export interface ListRecommendationsResponse {
  Recommendations?: Recommendation[];
  NextToken?: string;
}
export const ListRecommendationsResponse = S.suspend(() =>
  S.Struct({
    Recommendations: S.optional(Recommendations),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRecommendationsResponse",
}) as any as S.Schema<ListRecommendationsResponse>;
export interface EventResource {
  Type?: string;
  Name?: string;
  Arn?: string;
}
export const EventResource = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Name: S.optional(S.String),
    Arn: S.optional(S.String),
  }),
).annotations({
  identifier: "EventResource",
}) as any as S.Schema<EventResource>;
export type EventResources = EventResource[];
export const EventResources = S.Array(EventResource);
export interface Event {
  ResourceCollection?: ResourceCollection;
  Id?: string;
  Time?: Date;
  EventSource?: string;
  Name?: string;
  DataSource?: EventDataSource;
  EventClass?: EventClass;
  Resources?: EventResource[];
}
export const Event = S.suspend(() =>
  S.Struct({
    ResourceCollection: S.optional(ResourceCollection),
    Id: S.optional(S.String),
    Time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EventSource: S.optional(S.String),
    Name: S.optional(S.String),
    DataSource: S.optional(EventDataSource),
    EventClass: S.optional(EventClass),
    Resources: S.optional(EventResources),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export type Events = Event[];
export const Events = S.Array(Event);
export interface ListEventsResponse {
  Events: Event[];
  NextToken?: string;
}
export const ListEventsResponse = S.suspend(() =>
  S.Struct({ Events: Events, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListEventsResponse",
}) as any as S.Schema<ListEventsResponse>;
export interface ProactiveAnomaly {
  Id?: string;
  Severity?: AnomalySeverity;
  Status?: AnomalyStatus;
  UpdateTime?: Date;
  AnomalyTimeRange?: AnomalyTimeRange;
  AnomalyReportedTimeRange?: AnomalyReportedTimeRange;
  PredictionTimeRange?: PredictionTimeRange;
  SourceDetails?: AnomalySourceDetails;
  AssociatedInsightId?: string;
  ResourceCollection?: ResourceCollection;
  Limit?: number;
  SourceMetadata?: AnomalySourceMetadata;
  AnomalyResources?: AnomalyResource[];
  Description?: string;
}
export const ProactiveAnomaly = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Severity: S.optional(AnomalySeverity),
    Status: S.optional(AnomalyStatus),
    UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AnomalyTimeRange: S.optional(AnomalyTimeRange),
    AnomalyReportedTimeRange: S.optional(AnomalyReportedTimeRange),
    PredictionTimeRange: S.optional(PredictionTimeRange),
    SourceDetails: S.optional(AnomalySourceDetails),
    AssociatedInsightId: S.optional(S.String),
    ResourceCollection: S.optional(ResourceCollection),
    Limit: S.optional(S.Number),
    SourceMetadata: S.optional(AnomalySourceMetadata),
    AnomalyResources: S.optional(AnomalyResources),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "ProactiveAnomaly",
}) as any as S.Schema<ProactiveAnomaly>;
export interface DescribeAnomalyResponse {
  ProactiveAnomaly?: ProactiveAnomaly;
  ReactiveAnomaly?: ReactiveAnomaly;
}
export const DescribeAnomalyResponse = S.suspend(() =>
  S.Struct({
    ProactiveAnomaly: S.optional(ProactiveAnomaly),
    ReactiveAnomaly: S.optional(ReactiveAnomaly),
  }),
).annotations({
  identifier: "DescribeAnomalyResponse",
}) as any as S.Schema<DescribeAnomalyResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withConflictError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withServerError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.optional(ValidationExceptionReason),
    Fields: S.optional(ValidationExceptionFields),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * For the time range passed in, returns the number of open reactive insight that were
 * created, the number of open proactive insights that were created, and the Mean Time to Recover (MTTR) for all
 * closed reactive insights.
 */
export const describeAccountOverview: (
  input: DescribeAccountOverviewRequest,
) => effect.Effect<
  DescribeAccountOverviewResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountOverviewRequest,
  output: DescribeAccountOverviewResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of a specified insight's recommendations. Each recommendation includes
 * a list of related metrics and a list of related events.
 */
export const listRecommendations: {
  (
    input: ListRecommendationsRequest,
  ): effect.Effect<
    ListRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
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
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRecommendationsRequest,
  ) => stream.Stream<
    Recommendation,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
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
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Recommendations",
  } as const,
}));
/**
 * Provides an overview of your system's health. If additional member accounts are part
 * of your organization, you can filter those accounts using the `AccountIds`
 * field.
 */
export const describeOrganizationResourceCollectionHealth: {
  (
    input: DescribeOrganizationResourceCollectionHealthRequest,
  ): effect.Effect<
    DescribeOrganizationResourceCollectionHealthResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeOrganizationResourceCollectionHealthRequest,
  ) => stream.Stream<
    DescribeOrganizationResourceCollectionHealthResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeOrganizationResourceCollectionHealthRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeOrganizationResourceCollectionHealthRequest,
  output: DescribeOrganizationResourceCollectionHealthResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: { inputToken: "NextToken", outputToken: "NextToken" } as const,
}));
/**
 * Returns the integration status of services that are integrated with DevOps Guru.
 * The one service that can be integrated with DevOps Guru
 * is Amazon Web Services Systems Manager, which can be used to create an OpsItem for each generated insight.
 */
export const describeServiceIntegration: (
  input: DescribeServiceIntegrationRequest,
) => effect.Effect<
  DescribeServiceIntegrationResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeServiceIntegrationRequest,
  output: DescribeServiceIntegrationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns lists Amazon Web Services resources that are of the specified resource collection type.
 * The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and
 * Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze
 * the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag *key*. You can specify up to 500 Amazon Web Services CloudFormation stacks.
 */
export const getResourceCollection: {
  (
    input: GetResourceCollectionRequest,
  ): effect.Effect<
    GetResourceCollectionResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourceCollectionRequest,
  ) => stream.Stream<
    GetResourceCollectionResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourceCollectionRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourceCollectionRequest,
  output: GetResourceCollectionResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: { inputToken: "NextToken", outputToken: "NextToken" } as const,
}));
/**
 * Returns the list of all log groups that are being monitored and tagged by DevOps Guru.
 */
export const listMonitoredResources: {
  (
    input: ListMonitoredResourcesRequest,
  ): effect.Effect<
    ListMonitoredResourcesResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMonitoredResourcesRequest,
  ) => stream.Stream<
    ListMonitoredResourcesResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMonitoredResourcesRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMonitoredResourcesRequest,
  output: ListMonitoredResourcesResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of insights in your Amazon Web Services account. You can specify which insights are
 * returned by their start time, one or more statuses (`ONGOING` or `CLOSED`), one or more severities
 * (`LOW`, `MEDIUM`, and `HIGH`), and type
 * (`REACTIVE` or `PROACTIVE`).
 *
 * Use the `Filters` parameter to specify status and severity search
 * parameters. Use the `Type` parameter to specify `REACTIVE` or
 * `PROACTIVE` in your search.
 */
export const searchInsights: {
  (
    input: SearchInsightsRequest,
  ): effect.Effect<
    SearchInsightsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchInsightsRequest,
  ) => stream.Stream<
    SearchInsightsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchInsightsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchInsightsRequest,
  output: SearchInsightsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the integration status of services that are integrated with DevOps Guru as Consumer
 * via EventBridge. The one service that can be integrated with DevOps Guru is Amazon CodeGuru
 * Profiler, which can produce proactive recommendations which can be stored and viewed in
 * DevOps Guru.
 */
export const describeEventSourcesConfig: (
  input: DescribeEventSourcesConfigRequest,
) => effect.Effect<
  DescribeEventSourcesConfigResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventSourcesConfigRequest,
  output: DescribeEventSourcesConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of notification channels configured for DevOps Guru. Each notification
 * channel is used to notify you when DevOps Guru generates an insight that contains information
 * about how to improve your operations. The one
 * supported notification channel is Amazon Simple Notification Service (Amazon SNS).
 */
export const listNotificationChannels: {
  (
    input: ListNotificationChannelsRequest,
  ): effect.Effect<
    ListNotificationChannelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNotificationChannelsRequest,
  ) => stream.Stream<
    ListNotificationChannelsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNotificationChannelsRequest,
  ) => stream.Stream<
    NotificationChannel,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNotificationChannelsRequest,
  output: ListNotificationChannelsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Channels",
  } as const,
}));
/**
 * Returns a list of insights associated with the account or OU Id.
 */
export const listOrganizationInsights: {
  (
    input: ListOrganizationInsightsRequest,
  ): effect.Effect<
    ListOrganizationInsightsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListOrganizationInsightsRequest,
  ) => stream.Stream<
    ListOrganizationInsightsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListOrganizationInsightsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListOrganizationInsightsRequest,
  output: ListOrganizationInsightsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of insights in your organization. You can specify which insights are
 * returned by their start time, one or more statuses (`ONGOING`,
 * `CLOSED`, and `CLOSED`), one or more severities
 * (`LOW`, `MEDIUM`, and `HIGH`), and type
 * (`REACTIVE` or `PROACTIVE`).
 *
 * Use the `Filters` parameter to specify status and severity search
 * parameters. Use the `Type` parameter to specify `REACTIVE` or
 * `PROACTIVE` in your search.
 */
export const searchOrganizationInsights: {
  (
    input: SearchOrganizationInsightsRequest,
  ): effect.Effect<
    SearchOrganizationInsightsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchOrganizationInsightsRequest,
  ) => stream.Stream<
    SearchOrganizationInsightsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchOrganizationInsightsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchOrganizationInsightsRequest,
  output: SearchOrganizationInsightsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the collection of resources that DevOps Guru analyzes.
 * The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and
 * Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze
 * the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag *key*. You can specify up to 500 Amazon Web Services CloudFormation stacks. This method also creates the IAM role required for
 * you to use DevOps Guru.
 */
export const updateResourceCollection: (
  input: UpdateResourceCollectionRequest,
) => effect.Effect<
  UpdateResourceCollectionResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateResourceCollectionRequest,
  output: UpdateResourceCollectionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables or disables integration with a service that can be integrated with DevOps Guru. The
 * one service that can be integrated with DevOps Guru is Amazon Web Services Systems Manager, which can be used to create
 * an OpsItem for each generated insight.
 */
export const updateServiceIntegration: (
  input: UpdateServiceIntegrationRequest,
) => effect.Effect<
  UpdateServiceIntegrationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceIntegrationRequest,
  output: UpdateServiceIntegrationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns active insights, predictive insights, and resource hours analyzed in last
 * hour.
 */
export const describeOrganizationHealth: (
  input: DescribeOrganizationHealthRequest,
) => effect.Effect<
  DescribeOrganizationHealthResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeOrganizationHealthRequest,
  output: DescribeOrganizationHealthResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns an overview of your organization's history based on the specified time range.
 * The overview includes the total reactive and proactive insights.
 */
export const describeOrganizationOverview: (
  input: DescribeOrganizationOverviewRequest,
) => effect.Effect<
  DescribeOrganizationOverviewResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeOrganizationOverviewRequest,
  output: DescribeOrganizationOverviewResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the number of open proactive insights, open reactive insights, and the Mean Time to Recover (MTTR)
 * for all closed insights in resource collections in your account. You specify the type of
 * Amazon Web Services resources collection. The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and
 * Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze
 * the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag *key*. You can specify up to 500 Amazon Web Services CloudFormation stacks.
 */
export const describeResourceCollectionHealth: {
  (
    input: DescribeResourceCollectionHealthRequest,
  ): effect.Effect<
    DescribeResourceCollectionHealthResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeResourceCollectionHealthRequest,
  ) => stream.Stream<
    DescribeResourceCollectionHealthResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeResourceCollectionHealthRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeResourceCollectionHealthRequest,
  output: DescribeResourceCollectionHealthResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: { inputToken: "NextToken", outputToken: "NextToken" } as const,
}));
/**
 * Returns the number of open reactive insights, the number of open proactive insights,
 * and the number of metrics analyzed in your Amazon Web Services account. Use these numbers to gauge the
 * health of operations in your Amazon Web Services account.
 */
export const describeAccountHealth: (
  input: DescribeAccountHealthRequest,
) => effect.Effect<
  DescribeAccountHealthResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAccountHealthRequest,
  output: DescribeAccountHealthResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables or disables integration with a service that can be integrated with DevOps Guru. The
 * one service that can be integrated with DevOps Guru is Amazon CodeGuru Profiler, which
 * can produce proactive recommendations which can be stored and viewed in DevOps Guru.
 */
export const updateEventSourcesConfig: (
  input: UpdateEventSourcesConfigRequest,
) => effect.Effect<
  UpdateEventSourcesConfigResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEventSourcesConfigRequest,
  output: UpdateEventSourcesConfigResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns an estimate of the monthly cost for DevOps Guru to analyze your Amazon Web Services resources.
 * For more information,
 * see Estimate your
 * Amazon DevOps Guru costs and
 * Amazon DevOps Guru pricing.
 */
export const getCostEstimation: {
  (
    input: GetCostEstimationRequest,
  ): effect.Effect<
    GetCostEstimationResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCostEstimationRequest,
  ) => stream.Stream<
    GetCostEstimationResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCostEstimationRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetCostEstimationRequest,
  output: GetCostEstimationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: { inputToken: "NextToken", outputToken: "NextToken" } as const,
}));
/**
 * Starts the creation of an estimate of the monthly cost to analyze your Amazon Web Services
 * resources.
 */
export const startCostEstimation: (
  input: StartCostEstimationRequest,
) => effect.Effect<
  StartCostEstimationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCostEstimationRequest,
  output: StartCostEstimationResponse,
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
 * Collects customer feedback about the specified insight.
 */
export const putFeedback: (
  input: PutFeedbackRequest,
) => effect.Effect<
  PutFeedbackResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutFeedbackRequest,
  output: PutFeedbackResponse,
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
 * Removes a notification channel from DevOps Guru. A notification channel is used to notify
 * you when DevOps Guru generates an insight that contains information about how to improve your
 * operations.
 */
export const removeNotificationChannel: (
  input: RemoveNotificationChannelRequest,
) => effect.Effect<
  RemoveNotificationChannelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveNotificationChannelRequest,
  output: RemoveNotificationChannelResponse,
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
 * Returns the most recent feedback submitted in the current Amazon Web Services account and Region.
 */
export const describeFeedback: (
  input: DescribeFeedbackRequest,
) => effect.Effect<
  DescribeFeedbackResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeFeedbackRequest,
  output: DescribeFeedbackResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes the insight along with the associated anomalies, events and recommendations.
 */
export const deleteInsight: (
  input: DeleteInsightRequest,
) => effect.Effect<
  DeleteInsightResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteInsightRequest,
  output: DeleteInsightResponse,
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
 * Returns details about an insight that you specify using its ID.
 */
export const describeInsight: (
  input: DescribeInsightRequest,
) => effect.Effect<
  DescribeInsightResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeInsightRequest,
  output: DescribeInsightResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of the anomalies that belong to an insight that you specify using its
 * ID.
 */
export const listAnomaliesForInsight: {
  (
    input: ListAnomaliesForInsightRequest,
  ): effect.Effect<
    ListAnomaliesForInsightResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAnomaliesForInsightRequest,
  ) => stream.Stream<
    ListAnomaliesForInsightResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAnomaliesForInsightRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAnomaliesForInsightRequest,
  output: ListAnomaliesForInsightResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the list of log groups that contain log anomalies.
 */
export const listAnomalousLogGroups: {
  (
    input: ListAnomalousLogGroupsRequest,
  ): effect.Effect<
    ListAnomalousLogGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAnomalousLogGroupsRequest,
  ) => stream.Stream<
    ListAnomalousLogGroupsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAnomalousLogGroupsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAnomalousLogGroupsRequest,
  output: ListAnomalousLogGroupsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of insights in your Amazon Web Services account. You can specify which insights are
 * returned by their start time and status (`ONGOING`, `CLOSED`, or
 * `ANY`).
 */
export const listInsights: {
  (
    input: ListInsightsRequest,
  ): effect.Effect<
    ListInsightsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListInsightsRequest,
  ) => stream.Stream<
    ListInsightsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListInsightsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListInsightsRequest,
  output: ListInsightsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Adds a notification channel to DevOps Guru. A notification channel is used to notify you
 * about important DevOps Guru events, such as when an insight is generated.
 *
 * If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission
 * to send it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. DevOps Guru only supports standard SNS topics.
 * For more information, see Permissions
 * for Amazon SNS topics.
 *
 * If you use an Amazon SNS topic that is encrypted by an Amazon Web Services Key Management Service customer-managed key (CMK), then you must add permissions
 * to the CMK. For more information, see Permissions for
 * Amazon Web Services KMS–encrypted Amazon SNS topics.
 */
export const addNotificationChannel: (
  input: AddNotificationChannelRequest,
) => effect.Effect<
  AddNotificationChannelResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddNotificationChannelRequest,
  output: AddNotificationChannelResponse,
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
/**
 * Returns a list of the events emitted by the resources that are evaluated by DevOps Guru.
 * You can use filters to specify which events are returned.
 */
export const listEvents: {
  (
    input: ListEventsRequest,
  ): effect.Effect<
    ListEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEventsRequest,
  ) => stream.Stream<
    ListEventsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEventsRequest,
  ) => stream.Stream<
    Event,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEventsRequest,
  output: ListEventsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Events",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns details about an anomaly that you specify using its ID.
 */
export const describeAnomaly: (
  input: DescribeAnomalyRequest,
) => effect.Effect<
  DescribeAnomalyResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeAnomalyRequest,
  output: DescribeAnomalyResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
