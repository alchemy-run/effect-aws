import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "DevOps Guru",
  serviceShapeName: "CapstoneControlPlaneService",
});
const auth = T.AwsAuthSigv4({ name: "devops-guru" });
const ver = T.ServiceVersion("2020-12-01");
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
                        url: "https://devops-guru-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://devops-guru-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://devops-guru.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://devops-guru.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeAccountHealthRequest extends S.Class<DescribeAccountHealthRequest>(
  "DescribeAccountHealthRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/accounts/health" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeEventSourcesConfigRequest extends S.Class<DescribeEventSourcesConfigRequest>(
  "DescribeEventSourcesConfigRequest",
)(
  {},
  T.all(
    T.Http({ method: "POST", uri: "/event-sources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeServiceIntegrationRequest extends S.Class<DescribeServiceIntegrationRequest>(
  "DescribeServiceIntegrationRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/service-integrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export const AccountIdList = S.Array(S.String);
export const OrganizationalUnitIdList = S.Array(S.String);
export const ListInsightsAccountIdList = S.Array(S.String);
export const ListInsightsOrganizationalUnitIdList = S.Array(S.String);
export const SearchInsightsAccountIdList = S.Array(S.String);
export class DeleteInsightRequest extends S.Class<DeleteInsightRequest>(
  "DeleteInsightRequest",
)(
  { Id: S.String.pipe(T.HttpLabel("Id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/insights/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteInsightResponse extends S.Class<DeleteInsightResponse>(
  "DeleteInsightResponse",
)({}) {}
export class DescribeAccountHealthResponse extends S.Class<DescribeAccountHealthResponse>(
  "DescribeAccountHealthResponse",
)({
  OpenReactiveInsights: S.Number,
  OpenProactiveInsights: S.Number,
  MetricsAnalyzed: S.Number,
  ResourceHours: S.Number,
  AnalyzedResourceCount: S.optional(S.Number),
}) {}
export class DescribeAccountOverviewRequest extends S.Class<DescribeAccountOverviewRequest>(
  "DescribeAccountOverviewRequest",
)(
  {
    FromTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ToTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(
    T.Http({ method: "POST", uri: "/accounts/overview" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeAnomalyRequest extends S.Class<DescribeAnomalyRequest>(
  "DescribeAnomalyRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel("Id")),
    AccountId: S.optional(S.String).pipe(T.HttpQuery("AccountId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/anomalies/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeFeedbackRequest extends S.Class<DescribeFeedbackRequest>(
  "DescribeFeedbackRequest",
)(
  { InsightId: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/feedback" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeInsightRequest extends S.Class<DescribeInsightRequest>(
  "DescribeInsightRequest",
)(
  {
    Id: S.String.pipe(T.HttpLabel("Id")),
    AccountId: S.optional(S.String).pipe(T.HttpQuery("AccountId")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/insights/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeOrganizationHealthRequest extends S.Class<DescribeOrganizationHealthRequest>(
  "DescribeOrganizationHealthRequest",
)(
  {
    AccountIds: S.optional(AccountIdList),
    OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/organization/health" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeOrganizationOverviewRequest extends S.Class<DescribeOrganizationOverviewRequest>(
  "DescribeOrganizationOverviewRequest",
)(
  {
    FromTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ToTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AccountIds: S.optional(AccountIdList),
    OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/organization/overview" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeOrganizationResourceCollectionHealthRequest extends S.Class<DescribeOrganizationResourceCollectionHealthRequest>(
  "DescribeOrganizationResourceCollectionHealthRequest",
)(
  {
    OrganizationResourceCollectionType: S.String,
    AccountIds: S.optional(AccountIdList),
    OrganizationalUnitIds: S.optional(OrganizationalUnitIdList),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/organization/health/resource-collection" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeResourceCollectionHealthRequest extends S.Class<DescribeResourceCollectionHealthRequest>(
  "DescribeResourceCollectionHealthRequest",
)(
  {
    ResourceCollectionType: S.String.pipe(
      T.HttpLabel("ResourceCollectionType"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
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
) {}
export class GetCostEstimationRequest extends S.Class<GetCostEstimationRequest>(
  "GetCostEstimationRequest",
)(
  { NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")) },
  T.all(
    T.Http({ method: "GET", uri: "/cost-estimation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetResourceCollectionRequest extends S.Class<GetResourceCollectionRequest>(
  "GetResourceCollectionRequest",
)(
  {
    ResourceCollectionType: S.String.pipe(
      T.HttpLabel("ResourceCollectionType"),
    ),
    NextToken: S.optional(S.String).pipe(T.HttpQuery("NextToken")),
  },
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
) {}
export class ListAnomalousLogGroupsRequest extends S.Class<ListAnomalousLogGroupsRequest>(
  "ListAnomalousLogGroupsRequest",
)(
  {
    InsightId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-log-anomalies" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNotificationChannelsRequest extends S.Class<ListNotificationChannelsRequest>(
  "ListNotificationChannelsRequest",
)(
  { NextToken: S.optional(S.String) },
  T.all(
    T.Http({ method: "POST", uri: "/channels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInsightsOngoingStatusFilter extends S.Class<ListInsightsOngoingStatusFilter>(
  "ListInsightsOngoingStatusFilter",
)({ Type: S.String }) {}
export class EndTimeRange extends S.Class<EndTimeRange>("EndTimeRange")({
  FromTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ToTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListInsightsClosedStatusFilter extends S.Class<ListInsightsClosedStatusFilter>(
  "ListInsightsClosedStatusFilter",
)({ Type: S.String, EndTimeRange: EndTimeRange }) {}
export class StartTimeRange extends S.Class<StartTimeRange>("StartTimeRange")({
  FromTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ToTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListInsightsAnyStatusFilter extends S.Class<ListInsightsAnyStatusFilter>(
  "ListInsightsAnyStatusFilter",
)({ Type: S.String, StartTimeRange: StartTimeRange }) {}
export class ListInsightsStatusFilter extends S.Class<ListInsightsStatusFilter>(
  "ListInsightsStatusFilter",
)({
  Ongoing: S.optional(ListInsightsOngoingStatusFilter),
  Closed: S.optional(ListInsightsClosedStatusFilter),
  Any: S.optional(ListInsightsAnyStatusFilter),
}) {}
export class ListOrganizationInsightsRequest extends S.Class<ListOrganizationInsightsRequest>(
  "ListOrganizationInsightsRequest",
)(
  {
    StatusFilter: ListInsightsStatusFilter,
    MaxResults: S.optional(S.Number),
    AccountIds: S.optional(ListInsightsAccountIdList),
    OrganizationalUnitIds: S.optional(ListInsightsOrganizationalUnitIdList),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/organization/insights" }),
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
    InsightId: S.String,
    NextToken: S.optional(S.String),
    Locale: S.optional(S.String),
    AccountId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/recommendations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveNotificationChannelRequest extends S.Class<RemoveNotificationChannelRequest>(
  "RemoveNotificationChannelRequest",
)(
  { Id: S.String.pipe(T.HttpLabel("Id")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/channels/{Id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RemoveNotificationChannelResponse extends S.Class<RemoveNotificationChannelResponse>(
  "RemoveNotificationChannelResponse",
)({}) {}
export class AmazonCodeGuruProfilerIntegration extends S.Class<AmazonCodeGuruProfilerIntegration>(
  "AmazonCodeGuruProfilerIntegration",
)({ Status: S.optional(S.String) }) {}
export class EventSourcesConfig extends S.Class<EventSourcesConfig>(
  "EventSourcesConfig",
)({ AmazonCodeGuruProfiler: S.optional(AmazonCodeGuruProfilerIntegration) }) {}
export class UpdateEventSourcesConfigRequest extends S.Class<UpdateEventSourcesConfigRequest>(
  "UpdateEventSourcesConfigRequest",
)(
  { EventSources: S.optional(EventSourcesConfig) },
  T.all(
    T.Http({ method: "PUT", uri: "/event-sources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateEventSourcesConfigResponse extends S.Class<UpdateEventSourcesConfigResponse>(
  "UpdateEventSourcesConfigResponse",
)({}) {}
export const ResourceTypeFilters = S.Array(S.String);
export const InsightSeverities = S.Array(S.String);
export const InsightStatuses = S.Array(S.String);
export class ListMonitoredResourcesFilters extends S.Class<ListMonitoredResourcesFilters>(
  "ListMonitoredResourcesFilters",
)({ ResourcePermission: S.String, ResourceTypeFilters: ResourceTypeFilters }) {}
export class InsightFeedback extends S.Class<InsightFeedback>(
  "InsightFeedback",
)({ Id: S.optional(S.String), Feedback: S.optional(S.String) }) {}
export const StackNames = S.Array(S.String);
export class CloudFormationCollection extends S.Class<CloudFormationCollection>(
  "CloudFormationCollection",
)({ StackNames: S.optional(StackNames) }) {}
export const TagValues = S.Array(S.String);
export class TagCollection extends S.Class<TagCollection>("TagCollection")({
  AppBoundaryKey: S.String,
  TagValues: TagValues,
}) {}
export const TagCollections = S.Array(TagCollection);
export class ResourceCollection extends S.Class<ResourceCollection>(
  "ResourceCollection",
)({
  CloudFormation: S.optional(CloudFormationCollection),
  Tags: S.optional(TagCollections),
}) {}
export const ServiceNames = S.Array(S.String);
export class ServiceCollection extends S.Class<ServiceCollection>(
  "ServiceCollection",
)({ ServiceNames: S.optional(ServiceNames) }) {}
export class SearchInsightsFilters extends S.Class<SearchInsightsFilters>(
  "SearchInsightsFilters",
)({
  Severities: S.optional(InsightSeverities),
  Statuses: S.optional(InsightStatuses),
  ResourceCollection: S.optional(ResourceCollection),
  ServiceCollection: S.optional(ServiceCollection),
}) {}
export class SearchOrganizationInsightsFilters extends S.Class<SearchOrganizationInsightsFilters>(
  "SearchOrganizationInsightsFilters",
)({
  Severities: S.optional(InsightSeverities),
  Statuses: S.optional(InsightStatuses),
  ResourceCollection: S.optional(ResourceCollection),
  ServiceCollection: S.optional(ServiceCollection),
}) {}
export const NotificationMessageTypes = S.Array(S.String);
export const CostEstimationStackNames = S.Array(S.String);
export const CostEstimationTagValues = S.Array(S.String);
export const UpdateStackNames = S.Array(S.String);
export const UpdateTagValues = S.Array(S.String);
export class DescribeAccountOverviewResponse extends S.Class<DescribeAccountOverviewResponse>(
  "DescribeAccountOverviewResponse",
)({
  ReactiveInsights: S.Number,
  ProactiveInsights: S.Number,
  MeanTimeToRecoverInMilliseconds: S.Number,
}) {}
export class DescribeFeedbackResponse extends S.Class<DescribeFeedbackResponse>(
  "DescribeFeedbackResponse",
)({ InsightFeedback: S.optional(InsightFeedback) }) {}
export class DescribeOrganizationHealthResponse extends S.Class<DescribeOrganizationHealthResponse>(
  "DescribeOrganizationHealthResponse",
)({
  OpenReactiveInsights: S.Number,
  OpenProactiveInsights: S.Number,
  MetricsAnalyzed: S.Number,
  ResourceHours: S.Number,
}) {}
export class DescribeOrganizationOverviewResponse extends S.Class<DescribeOrganizationOverviewResponse>(
  "DescribeOrganizationOverviewResponse",
)({ ReactiveInsights: S.Number, ProactiveInsights: S.Number }) {}
export class InsightHealth extends S.Class<InsightHealth>("InsightHealth")({
  OpenProactiveInsights: S.optional(S.Number),
  OpenReactiveInsights: S.optional(S.Number),
  MeanTimeToRecoverInMilliseconds: S.optional(S.Number),
}) {}
export class CloudFormationHealth extends S.Class<CloudFormationHealth>(
  "CloudFormationHealth",
)({
  StackName: S.optional(S.String),
  Insight: S.optional(InsightHealth),
  AnalyzedResourceCount: S.optional(S.Number),
}) {}
export const CloudFormationHealths = S.Array(CloudFormationHealth);
export class ServiceInsightHealth extends S.Class<ServiceInsightHealth>(
  "ServiceInsightHealth",
)({
  OpenProactiveInsights: S.optional(S.Number),
  OpenReactiveInsights: S.optional(S.Number),
}) {}
export class ServiceHealth extends S.Class<ServiceHealth>("ServiceHealth")({
  ServiceName: S.optional(S.String),
  Insight: S.optional(ServiceInsightHealth),
  AnalyzedResourceCount: S.optional(S.Number),
}) {}
export const ServiceHealths = S.Array(ServiceHealth);
export class TagHealth extends S.Class<TagHealth>("TagHealth")({
  AppBoundaryKey: S.optional(S.String),
  TagValue: S.optional(S.String),
  Insight: S.optional(InsightHealth),
  AnalyzedResourceCount: S.optional(S.Number),
}) {}
export const TagHealths = S.Array(TagHealth);
export class DescribeResourceCollectionHealthResponse extends S.Class<DescribeResourceCollectionHealthResponse>(
  "DescribeResourceCollectionHealthResponse",
)({
  CloudFormation: S.optional(CloudFormationHealths),
  Service: S.optional(ServiceHealths),
  NextToken: S.optional(S.String),
  Tags: S.optional(TagHealths),
}) {}
export class ListMonitoredResourcesRequest extends S.Class<ListMonitoredResourcesRequest>(
  "ListMonitoredResourcesRequest",
)(
  {
    Filters: S.optional(ListMonitoredResourcesFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/monitoredResources" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutFeedbackRequest extends S.Class<PutFeedbackRequest>(
  "PutFeedbackRequest",
)(
  { InsightFeedback: S.optional(InsightFeedback) },
  T.all(
    T.Http({ method: "PUT", uri: "/feedback" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutFeedbackResponse extends S.Class<PutFeedbackResponse>(
  "PutFeedbackResponse",
)({}) {}
export class SearchInsightsRequest extends S.Class<SearchInsightsRequest>(
  "SearchInsightsRequest",
)(
  {
    StartTimeRange: StartTimeRange,
    Filters: S.optional(SearchInsightsFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Type: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/insights/search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchOrganizationInsightsRequest extends S.Class<SearchOrganizationInsightsRequest>(
  "SearchOrganizationInsightsRequest",
)(
  {
    AccountIds: SearchInsightsAccountIdList,
    StartTimeRange: StartTimeRange,
    Filters: S.optional(SearchOrganizationInsightsFilters),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Type: S.String,
  },
  T.all(
    T.Http({ method: "POST", uri: "/organization/insights/search" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SnsChannelConfig extends S.Class<SnsChannelConfig>(
  "SnsChannelConfig",
)({ TopicArn: S.optional(S.String) }) {}
export class NotificationFilterConfig extends S.Class<NotificationFilterConfig>(
  "NotificationFilterConfig",
)({
  Severities: S.optional(InsightSeverities),
  MessageTypes: S.optional(NotificationMessageTypes),
}) {}
export class OpsCenterIntegration extends S.Class<OpsCenterIntegration>(
  "OpsCenterIntegration",
)({ OptInStatus: S.optional(S.String) }) {}
export class LogsAnomalyDetectionIntegration extends S.Class<LogsAnomalyDetectionIntegration>(
  "LogsAnomalyDetectionIntegration",
)({ OptInStatus: S.optional(S.String) }) {}
export class KMSServerSideEncryptionIntegration extends S.Class<KMSServerSideEncryptionIntegration>(
  "KMSServerSideEncryptionIntegration",
)({
  KMSKeyId: S.optional(S.String),
  OptInStatus: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export class EventTimeRange extends S.Class<EventTimeRange>("EventTimeRange")({
  FromTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ToTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class CloudFormationCostEstimationResourceCollectionFilter extends S.Class<CloudFormationCostEstimationResourceCollectionFilter>(
  "CloudFormationCostEstimationResourceCollectionFilter",
)({ StackNames: S.optional(CostEstimationStackNames) }) {}
export class TagCostEstimationResourceCollectionFilter extends S.Class<TagCostEstimationResourceCollectionFilter>(
  "TagCostEstimationResourceCollectionFilter",
)({ AppBoundaryKey: S.String, TagValues: CostEstimationTagValues }) {}
export const TagCostEstimationResourceCollectionFilters = S.Array(
  TagCostEstimationResourceCollectionFilter,
);
export class UpdateCloudFormationCollectionFilter extends S.Class<UpdateCloudFormationCollectionFilter>(
  "UpdateCloudFormationCollectionFilter",
)({ StackNames: S.optional(UpdateStackNames) }) {}
export class UpdateTagCollectionFilter extends S.Class<UpdateTagCollectionFilter>(
  "UpdateTagCollectionFilter",
)({ AppBoundaryKey: S.String, TagValues: UpdateTagValues }) {}
export const UpdateTagCollectionFilters = S.Array(UpdateTagCollectionFilter);
export class OpsCenterIntegrationConfig extends S.Class<OpsCenterIntegrationConfig>(
  "OpsCenterIntegrationConfig",
)({ OptInStatus: S.optional(S.String) }) {}
export class LogsAnomalyDetectionIntegrationConfig extends S.Class<LogsAnomalyDetectionIntegrationConfig>(
  "LogsAnomalyDetectionIntegrationConfig",
)({ OptInStatus: S.optional(S.String) }) {}
export class KMSServerSideEncryptionIntegrationConfig extends S.Class<KMSServerSideEncryptionIntegrationConfig>(
  "KMSServerSideEncryptionIntegrationConfig",
)({
  KMSKeyId: S.optional(S.String),
  OptInStatus: S.optional(S.String),
  Type: S.optional(S.String),
}) {}
export class NotificationChannelConfig extends S.Class<NotificationChannelConfig>(
  "NotificationChannelConfig",
)({ Sns: SnsChannelConfig, Filters: S.optional(NotificationFilterConfig) }) {}
export class AnomalyTimeRange extends S.Class<AnomalyTimeRange>(
  "AnomalyTimeRange",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class AnomalyReportedTimeRange extends S.Class<AnomalyReportedTimeRange>(
  "AnomalyReportedTimeRange",
)({
  OpenTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  CloseTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CloudWatchMetricsDimension extends S.Class<CloudWatchMetricsDimension>(
  "CloudWatchMetricsDimension",
)({ Name: S.optional(S.String), Value: S.optional(S.String) }) {}
export const CloudWatchMetricsDimensions = S.Array(CloudWatchMetricsDimension);
export class TimestampMetricValuePair extends S.Class<TimestampMetricValuePair>(
  "TimestampMetricValuePair",
)({
  Timestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MetricValue: S.optional(S.Number),
}) {}
export const TimestampMetricValuePairList = S.Array(TimestampMetricValuePair);
export class CloudWatchMetricsDataSummary extends S.Class<CloudWatchMetricsDataSummary>(
  "CloudWatchMetricsDataSummary",
)({
  TimestampMetricValuePairList: S.optional(TimestampMetricValuePairList),
  StatusCode: S.optional(S.String),
}) {}
export class CloudWatchMetricsDetail extends S.Class<CloudWatchMetricsDetail>(
  "CloudWatchMetricsDetail",
)({
  MetricName: S.optional(S.String),
  Namespace: S.optional(S.String),
  Dimensions: S.optional(CloudWatchMetricsDimensions),
  Stat: S.optional(S.String),
  Unit: S.optional(S.String),
  Period: S.optional(S.Number),
  MetricDataSummary: S.optional(CloudWatchMetricsDataSummary),
}) {}
export const CloudWatchMetricsDetails = S.Array(CloudWatchMetricsDetail);
export const PerformanceInsightsMetricDimensions = S.Array(S.String);
export class PerformanceInsightsMetricDimensionGroup extends S.Class<PerformanceInsightsMetricDimensionGroup>(
  "PerformanceInsightsMetricDimensionGroup",
)({
  Group: S.optional(S.String),
  Dimensions: S.optional(PerformanceInsightsMetricDimensions),
  Limit: S.optional(S.Number),
}) {}
export const PerformanceInsightsMetricFilterMap = S.Record({
  key: S.String,
  value: S.String,
});
export class PerformanceInsightsMetricQuery extends S.Class<PerformanceInsightsMetricQuery>(
  "PerformanceInsightsMetricQuery",
)({
  Metric: S.optional(S.String),
  GroupBy: S.optional(PerformanceInsightsMetricDimensionGroup),
  Filter: S.optional(PerformanceInsightsMetricFilterMap),
}) {}
export class PerformanceInsightsReferenceScalar extends S.Class<PerformanceInsightsReferenceScalar>(
  "PerformanceInsightsReferenceScalar",
)({ Value: S.optional(S.Number) }) {}
export class PerformanceInsightsReferenceMetric extends S.Class<PerformanceInsightsReferenceMetric>(
  "PerformanceInsightsReferenceMetric",
)({ MetricQuery: S.optional(PerformanceInsightsMetricQuery) }) {}
export class PerformanceInsightsReferenceComparisonValues extends S.Class<PerformanceInsightsReferenceComparisonValues>(
  "PerformanceInsightsReferenceComparisonValues",
)({
  ReferenceScalar: S.optional(PerformanceInsightsReferenceScalar),
  ReferenceMetric: S.optional(PerformanceInsightsReferenceMetric),
}) {}
export class PerformanceInsightsReferenceData extends S.Class<PerformanceInsightsReferenceData>(
  "PerformanceInsightsReferenceData",
)({
  Name: S.optional(S.String),
  ComparisonValues: S.optional(PerformanceInsightsReferenceComparisonValues),
}) {}
export const PerformanceInsightsReferenceDataList = S.Array(
  PerformanceInsightsReferenceData,
);
export class PerformanceInsightsStat extends S.Class<PerformanceInsightsStat>(
  "PerformanceInsightsStat",
)({ Type: S.optional(S.String), Value: S.optional(S.Number) }) {}
export const PerformanceInsightsStats = S.Array(PerformanceInsightsStat);
export class PerformanceInsightsMetricsDetail extends S.Class<PerformanceInsightsMetricsDetail>(
  "PerformanceInsightsMetricsDetail",
)({
  MetricDisplayName: S.optional(S.String),
  Unit: S.optional(S.String),
  MetricQuery: S.optional(PerformanceInsightsMetricQuery),
  ReferenceData: S.optional(PerformanceInsightsReferenceDataList),
  StatsAtAnomaly: S.optional(PerformanceInsightsStats),
  StatsAtBaseline: S.optional(PerformanceInsightsStats),
}) {}
export const PerformanceInsightsMetricsDetails = S.Array(
  PerformanceInsightsMetricsDetail,
);
export class AnomalySourceDetails extends S.Class<AnomalySourceDetails>(
  "AnomalySourceDetails",
)({
  CloudWatchMetrics: S.optional(CloudWatchMetricsDetails),
  PerformanceInsightsMetrics: S.optional(PerformanceInsightsMetricsDetails),
}) {}
export class AnomalyResource extends S.Class<AnomalyResource>(
  "AnomalyResource",
)({ Name: S.optional(S.String), Type: S.optional(S.String) }) {}
export const AnomalyResources = S.Array(AnomalyResource);
export class ReactiveAnomaly extends S.Class<ReactiveAnomaly>(
  "ReactiveAnomaly",
)({
  Id: S.optional(S.String),
  Severity: S.optional(S.String),
  Status: S.optional(S.String),
  AnomalyTimeRange: S.optional(AnomalyTimeRange),
  AnomalyReportedTimeRange: S.optional(AnomalyReportedTimeRange),
  SourceDetails: S.optional(AnomalySourceDetails),
  AssociatedInsightId: S.optional(S.String),
  ResourceCollection: S.optional(ResourceCollection),
  Type: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CausalAnomalyId: S.optional(S.String),
  AnomalyResources: S.optional(AnomalyResources),
}) {}
export class InsightTimeRange extends S.Class<InsightTimeRange>(
  "InsightTimeRange",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ReactiveInsight extends S.Class<ReactiveInsight>(
  "ReactiveInsight",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Severity: S.optional(S.String),
  Status: S.optional(S.String),
  InsightTimeRange: S.optional(InsightTimeRange),
  ResourceCollection: S.optional(ResourceCollection),
  SsmOpsItemId: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export class ServiceIntegrationConfig extends S.Class<ServiceIntegrationConfig>(
  "ServiceIntegrationConfig",
)({
  OpsCenter: S.optional(OpsCenterIntegration),
  LogsAnomalyDetection: S.optional(LogsAnomalyDetectionIntegration),
  KMSServerSideEncryption: S.optional(KMSServerSideEncryptionIntegration),
}) {}
export class ServiceResourceCost extends S.Class<ServiceResourceCost>(
  "ServiceResourceCost",
)({
  Type: S.optional(S.String),
  State: S.optional(S.String),
  Count: S.optional(S.Number),
  UnitCost: S.optional(S.Number),
  Cost: S.optional(S.Number),
}) {}
export const ServiceResourceCosts = S.Array(ServiceResourceCost);
export class CostEstimationTimeRange extends S.Class<CostEstimationTimeRange>(
  "CostEstimationTimeRange",
)({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListAnomaliesForInsightFilters extends S.Class<ListAnomaliesForInsightFilters>(
  "ListAnomaliesForInsightFilters",
)({ ServiceCollection: S.optional(ServiceCollection) }) {}
export class NotificationChannel extends S.Class<NotificationChannel>(
  "NotificationChannel",
)({
  Id: S.optional(S.String),
  Config: S.optional(NotificationChannelConfig),
}) {}
export const Channels = S.Array(NotificationChannel);
export class PredictionTimeRange extends S.Class<PredictionTimeRange>(
  "PredictionTimeRange",
)({
  StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ProactiveOrganizationInsightSummary extends S.Class<ProactiveOrganizationInsightSummary>(
  "ProactiveOrganizationInsightSummary",
)({
  Id: S.optional(S.String),
  AccountId: S.optional(S.String),
  OrganizationalUnitId: S.optional(S.String),
  Name: S.optional(S.String),
  Severity: S.optional(S.String),
  Status: S.optional(S.String),
  InsightTimeRange: S.optional(InsightTimeRange),
  PredictionTimeRange: S.optional(PredictionTimeRange),
  ResourceCollection: S.optional(ResourceCollection),
  ServiceCollection: S.optional(ServiceCollection),
}) {}
export const ProactiveOrganizationInsights = S.Array(
  ProactiveOrganizationInsightSummary,
);
export class ReactiveOrganizationInsightSummary extends S.Class<ReactiveOrganizationInsightSummary>(
  "ReactiveOrganizationInsightSummary",
)({
  Id: S.optional(S.String),
  AccountId: S.optional(S.String),
  OrganizationalUnitId: S.optional(S.String),
  Name: S.optional(S.String),
  Severity: S.optional(S.String),
  Status: S.optional(S.String),
  InsightTimeRange: S.optional(InsightTimeRange),
  ResourceCollection: S.optional(ResourceCollection),
  ServiceCollection: S.optional(ServiceCollection),
}) {}
export const ReactiveOrganizationInsights = S.Array(
  ReactiveOrganizationInsightSummary,
);
export class CostEstimationResourceCollectionFilter extends S.Class<CostEstimationResourceCollectionFilter>(
  "CostEstimationResourceCollectionFilter",
)({
  CloudFormation: S.optional(
    CloudFormationCostEstimationResourceCollectionFilter,
  ),
  Tags: S.optional(TagCostEstimationResourceCollectionFilters),
}) {}
export class UpdateResourceCollectionFilter extends S.Class<UpdateResourceCollectionFilter>(
  "UpdateResourceCollectionFilter",
)({
  CloudFormation: S.optional(UpdateCloudFormationCollectionFilter),
  Tags: S.optional(UpdateTagCollectionFilters),
}) {}
export class UpdateServiceIntegrationConfig extends S.Class<UpdateServiceIntegrationConfig>(
  "UpdateServiceIntegrationConfig",
)({
  OpsCenter: S.optional(OpsCenterIntegrationConfig),
  LogsAnomalyDetection: S.optional(LogsAnomalyDetectionIntegrationConfig),
  KMSServerSideEncryption: S.optional(KMSServerSideEncryptionIntegrationConfig),
}) {}
export class AddNotificationChannelRequest extends S.Class<AddNotificationChannelRequest>(
  "AddNotificationChannelRequest",
)(
  { Config: NotificationChannelConfig },
  T.all(
    T.Http({ method: "PUT", uri: "/channels" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeEventSourcesConfigResponse extends S.Class<DescribeEventSourcesConfigResponse>(
  "DescribeEventSourcesConfigResponse",
)({ EventSources: S.optional(EventSourcesConfig) }) {}
export class DescribeServiceIntegrationResponse extends S.Class<DescribeServiceIntegrationResponse>(
  "DescribeServiceIntegrationResponse",
)({ ServiceIntegration: S.optional(ServiceIntegrationConfig) }) {}
export class GetCostEstimationResponse extends S.Class<GetCostEstimationResponse>(
  "GetCostEstimationResponse",
)({
  ResourceCollection: S.optional(CostEstimationResourceCollectionFilter),
  Status: S.optional(S.String),
  Costs: S.optional(ServiceResourceCosts),
  TimeRange: S.optional(CostEstimationTimeRange),
  TotalCost: S.optional(S.Number),
  NextToken: S.optional(S.String),
}) {}
export class ListAnomaliesForInsightRequest extends S.Class<ListAnomaliesForInsightRequest>(
  "ListAnomaliesForInsightRequest",
)(
  {
    InsightId: S.String.pipe(T.HttpLabel("InsightId")),
    StartTimeRange: S.optional(StartTimeRange),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
    Filters: S.optional(ListAnomaliesForInsightFilters),
  },
  T.all(
    T.Http({ method: "POST", uri: "/anomalies/insight/{InsightId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListNotificationChannelsResponse extends S.Class<ListNotificationChannelsResponse>(
  "ListNotificationChannelsResponse",
)({ Channels: S.optional(Channels), NextToken: S.optional(S.String) }) {}
export class ListOrganizationInsightsResponse extends S.Class<ListOrganizationInsightsResponse>(
  "ListOrganizationInsightsResponse",
)({
  ProactiveInsights: S.optional(ProactiveOrganizationInsights),
  ReactiveInsights: S.optional(ReactiveOrganizationInsights),
  NextToken: S.optional(S.String),
}) {}
export const AssociatedResourceArns = S.Array(S.String);
export class ProactiveInsightSummary extends S.Class<ProactiveInsightSummary>(
  "ProactiveInsightSummary",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Severity: S.optional(S.String),
  Status: S.optional(S.String),
  InsightTimeRange: S.optional(InsightTimeRange),
  PredictionTimeRange: S.optional(PredictionTimeRange),
  ResourceCollection: S.optional(ResourceCollection),
  ServiceCollection: S.optional(ServiceCollection),
  AssociatedResourceArns: S.optional(AssociatedResourceArns),
}) {}
export const ProactiveInsights = S.Array(ProactiveInsightSummary);
export class ReactiveInsightSummary extends S.Class<ReactiveInsightSummary>(
  "ReactiveInsightSummary",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Severity: S.optional(S.String),
  Status: S.optional(S.String),
  InsightTimeRange: S.optional(InsightTimeRange),
  ResourceCollection: S.optional(ResourceCollection),
  ServiceCollection: S.optional(ServiceCollection),
  AssociatedResourceArns: S.optional(AssociatedResourceArns),
}) {}
export const ReactiveInsights = S.Array(ReactiveInsightSummary);
export class SearchOrganizationInsightsResponse extends S.Class<SearchOrganizationInsightsResponse>(
  "SearchOrganizationInsightsResponse",
)({
  ProactiveInsights: S.optional(ProactiveInsights),
  ReactiveInsights: S.optional(ReactiveInsights),
  NextToken: S.optional(S.String),
}) {}
export class StartCostEstimationRequest extends S.Class<StartCostEstimationRequest>(
  "StartCostEstimationRequest",
)(
  {
    ResourceCollection: CostEstimationResourceCollectionFilter,
    ClientToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "PUT", uri: "/cost-estimation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartCostEstimationResponse extends S.Class<StartCostEstimationResponse>(
  "StartCostEstimationResponse",
)({}) {}
export class UpdateResourceCollectionRequest extends S.Class<UpdateResourceCollectionRequest>(
  "UpdateResourceCollectionRequest",
)(
  { Action: S.String, ResourceCollection: UpdateResourceCollectionFilter },
  T.all(
    T.Http({ method: "PUT", uri: "/resource-collections" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateResourceCollectionResponse extends S.Class<UpdateResourceCollectionResponse>(
  "UpdateResourceCollectionResponse",
)({}) {}
export class UpdateServiceIntegrationRequest extends S.Class<UpdateServiceIntegrationRequest>(
  "UpdateServiceIntegrationRequest",
)(
  { ServiceIntegration: UpdateServiceIntegrationConfig },
  T.all(
    T.Http({ method: "PUT", uri: "/service-integrations" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateServiceIntegrationResponse extends S.Class<UpdateServiceIntegrationResponse>(
  "UpdateServiceIntegrationResponse",
)({}) {}
export class AnomalySourceMetadata extends S.Class<AnomalySourceMetadata>(
  "AnomalySourceMetadata",
)({
  Source: S.optional(S.String),
  SourceResourceName: S.optional(S.String),
  SourceResourceType: S.optional(S.String),
}) {}
export class AccountInsightHealth extends S.Class<AccountInsightHealth>(
  "AccountInsightHealth",
)({
  OpenProactiveInsights: S.optional(S.Number),
  OpenReactiveInsights: S.optional(S.Number),
}) {}
export class CloudFormationCollectionFilter extends S.Class<CloudFormationCollectionFilter>(
  "CloudFormationCollectionFilter",
)({ StackNames: S.optional(StackNames) }) {}
export class TagCollectionFilter extends S.Class<TagCollectionFilter>(
  "TagCollectionFilter",
)({ AppBoundaryKey: S.String, TagValues: TagValues }) {}
export const TagCollectionFilters = S.Array(TagCollectionFilter);
export class ProactiveInsight extends S.Class<ProactiveInsight>(
  "ProactiveInsight",
)({
  Id: S.optional(S.String),
  Name: S.optional(S.String),
  Severity: S.optional(S.String),
  Status: S.optional(S.String),
  InsightTimeRange: S.optional(InsightTimeRange),
  PredictionTimeRange: S.optional(PredictionTimeRange),
  ResourceCollection: S.optional(ResourceCollection),
  SsmOpsItemId: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export class AccountHealth extends S.Class<AccountHealth>("AccountHealth")({
  AccountId: S.optional(S.String),
  Insight: S.optional(AccountInsightHealth),
}) {}
export const AccountHealths = S.Array(AccountHealth);
export class ResourceCollectionFilter extends S.Class<ResourceCollectionFilter>(
  "ResourceCollectionFilter",
)({
  CloudFormation: S.optional(CloudFormationCollectionFilter),
  Tags: S.optional(TagCollectionFilters),
}) {}
export class ListEventsFilters extends S.Class<ListEventsFilters>(
  "ListEventsFilters",
)({
  InsightId: S.optional(S.String),
  EventTimeRange: S.optional(EventTimeRange),
  EventClass: S.optional(S.String),
  EventSource: S.optional(S.String),
  DataSource: S.optional(S.String),
  ResourceCollection: S.optional(ResourceCollection),
}) {}
export class MonitoredResourceIdentifier extends S.Class<MonitoredResourceIdentifier>(
  "MonitoredResourceIdentifier",
)({
  MonitoredResourceName: S.optional(S.String),
  Type: S.optional(S.String),
  ResourcePermission: S.optional(S.String),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceCollection: S.optional(ResourceCollection),
}) {}
export const MonitoredResourceIdentifiers = S.Array(
  MonitoredResourceIdentifier,
);
export class LogAnomalyClass extends S.Class<LogAnomalyClass>(
  "LogAnomalyClass",
)({
  LogStreamName: S.optional(S.String),
  LogAnomalyType: S.optional(S.String),
  LogAnomalyToken: S.optional(S.String),
  LogEventId: S.optional(S.String),
  Explanation: S.optional(S.String),
  NumberOfLogLinesOccurrences: S.optional(S.Number),
  LogEventTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const LogAnomalyClasses = S.Array(LogAnomalyClass);
export class RecommendationRelatedEventResource extends S.Class<RecommendationRelatedEventResource>(
  "RecommendationRelatedEventResource",
)({ Name: S.optional(S.String), Type: S.optional(S.String) }) {}
export const RecommendationRelatedEventResources = S.Array(
  RecommendationRelatedEventResource,
);
export class RecommendationRelatedAnomalyResource extends S.Class<RecommendationRelatedAnomalyResource>(
  "RecommendationRelatedAnomalyResource",
)({ Name: S.optional(S.String), Type: S.optional(S.String) }) {}
export const RecommendationRelatedAnomalyResources = S.Array(
  RecommendationRelatedAnomalyResource,
);
export class AddNotificationChannelResponse extends S.Class<AddNotificationChannelResponse>(
  "AddNotificationChannelResponse",
)({ Id: S.String }) {}
export class DescribeInsightResponse extends S.Class<DescribeInsightResponse>(
  "DescribeInsightResponse",
)({
  ProactiveInsight: S.optional(ProactiveInsight),
  ReactiveInsight: S.optional(ReactiveInsight),
}) {}
export class DescribeOrganizationResourceCollectionHealthResponse extends S.Class<DescribeOrganizationResourceCollectionHealthResponse>(
  "DescribeOrganizationResourceCollectionHealthResponse",
)({
  CloudFormation: S.optional(CloudFormationHealths),
  Service: S.optional(ServiceHealths),
  Account: S.optional(AccountHealths),
  NextToken: S.optional(S.String),
  Tags: S.optional(TagHealths),
}) {}
export class GetResourceCollectionResponse extends S.Class<GetResourceCollectionResponse>(
  "GetResourceCollectionResponse",
)({
  ResourceCollection: S.optional(ResourceCollectionFilter),
  NextToken: S.optional(S.String),
}) {}
export class ListEventsRequest extends S.Class<ListEventsRequest>(
  "ListEventsRequest",
)(
  {
    Filters: ListEventsFilters,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AccountId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/events" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListInsightsRequest extends S.Class<ListInsightsRequest>(
  "ListInsightsRequest",
)(
  {
    StatusFilter: ListInsightsStatusFilter,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/insights" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListMonitoredResourcesResponse extends S.Class<ListMonitoredResourcesResponse>(
  "ListMonitoredResourcesResponse",
)({
  MonitoredResourceIdentifiers: MonitoredResourceIdentifiers,
  NextToken: S.optional(S.String),
}) {}
export class SearchInsightsResponse extends S.Class<SearchInsightsResponse>(
  "SearchInsightsResponse",
)({
  ProactiveInsights: S.optional(ProactiveInsights),
  ReactiveInsights: S.optional(ReactiveInsights),
  NextToken: S.optional(S.String),
}) {}
export class LogAnomalyShowcase extends S.Class<LogAnomalyShowcase>(
  "LogAnomalyShowcase",
)({ LogAnomalyClasses: S.optional(LogAnomalyClasses) }) {}
export const LogAnomalyShowcases = S.Array(LogAnomalyShowcase);
export class RecommendationRelatedEvent extends S.Class<RecommendationRelatedEvent>(
  "RecommendationRelatedEvent",
)({
  Name: S.optional(S.String),
  Resources: S.optional(RecommendationRelatedEventResources),
}) {}
export const RecommendationRelatedEvents = S.Array(RecommendationRelatedEvent);
export class RecommendationRelatedCloudWatchMetricsSourceDetail extends S.Class<RecommendationRelatedCloudWatchMetricsSourceDetail>(
  "RecommendationRelatedCloudWatchMetricsSourceDetail",
)({ MetricName: S.optional(S.String), Namespace: S.optional(S.String) }) {}
export const RecommendationRelatedCloudWatchMetricsSourceDetails = S.Array(
  RecommendationRelatedCloudWatchMetricsSourceDetail,
);
export class ProactiveAnomalySummary extends S.Class<ProactiveAnomalySummary>(
  "ProactiveAnomalySummary",
)({
  Id: S.optional(S.String),
  Severity: S.optional(S.String),
  Status: S.optional(S.String),
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
}) {}
export const ProactiveAnomalies = S.Array(ProactiveAnomalySummary);
export class ReactiveAnomalySummary extends S.Class<ReactiveAnomalySummary>(
  "ReactiveAnomalySummary",
)({
  Id: S.optional(S.String),
  Severity: S.optional(S.String),
  Status: S.optional(S.String),
  AnomalyTimeRange: S.optional(AnomalyTimeRange),
  AnomalyReportedTimeRange: S.optional(AnomalyReportedTimeRange),
  SourceDetails: S.optional(AnomalySourceDetails),
  AssociatedInsightId: S.optional(S.String),
  ResourceCollection: S.optional(ResourceCollection),
  Type: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CausalAnomalyId: S.optional(S.String),
  AnomalyResources: S.optional(AnomalyResources),
}) {}
export const ReactiveAnomalies = S.Array(ReactiveAnomalySummary);
export class AnomalousLogGroup extends S.Class<AnomalousLogGroup>(
  "AnomalousLogGroup",
)({
  LogGroupName: S.optional(S.String),
  ImpactStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ImpactEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NumberOfLogLinesScanned: S.optional(S.Number),
  LogAnomalyShowcases: S.optional(LogAnomalyShowcases),
}) {}
export const AnomalousLogGroups = S.Array(AnomalousLogGroup);
export class RecommendationRelatedAnomalySourceDetail extends S.Class<RecommendationRelatedAnomalySourceDetail>(
  "RecommendationRelatedAnomalySourceDetail",
)({
  CloudWatchMetrics: S.optional(
    RecommendationRelatedCloudWatchMetricsSourceDetails,
  ),
}) {}
export const RelatedAnomalySourceDetails = S.Array(
  RecommendationRelatedAnomalySourceDetail,
);
export class ListAnomaliesForInsightResponse extends S.Class<ListAnomaliesForInsightResponse>(
  "ListAnomaliesForInsightResponse",
)({
  ProactiveAnomalies: S.optional(ProactiveAnomalies),
  ReactiveAnomalies: S.optional(ReactiveAnomalies),
  NextToken: S.optional(S.String),
}) {}
export class ListAnomalousLogGroupsResponse extends S.Class<ListAnomalousLogGroupsResponse>(
  "ListAnomalousLogGroupsResponse",
)({
  InsightId: S.String,
  AnomalousLogGroups: AnomalousLogGroups,
  NextToken: S.optional(S.String),
}) {}
export class ListInsightsResponse extends S.Class<ListInsightsResponse>(
  "ListInsightsResponse",
)({
  ProactiveInsights: S.optional(ProactiveInsights),
  ReactiveInsights: S.optional(ReactiveInsights),
  NextToken: S.optional(S.String),
}) {}
export class RecommendationRelatedAnomaly extends S.Class<RecommendationRelatedAnomaly>(
  "RecommendationRelatedAnomaly",
)({
  Resources: S.optional(RecommendationRelatedAnomalyResources),
  SourceDetails: S.optional(RelatedAnomalySourceDetails),
  AnomalyId: S.optional(S.String),
}) {}
export const RecommendationRelatedAnomalies = S.Array(
  RecommendationRelatedAnomaly,
);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ Name: S.String, Message: S.String }) {}
export const ValidationExceptionFields = S.Array(ValidationExceptionField);
export class Recommendation extends S.Class<Recommendation>("Recommendation")({
  Description: S.optional(S.String),
  Link: S.optional(S.String),
  Name: S.optional(S.String),
  Reason: S.optional(S.String),
  RelatedEvents: S.optional(RecommendationRelatedEvents),
  RelatedAnomalies: S.optional(RecommendationRelatedAnomalies),
  Category: S.optional(S.String),
}) {}
export const Recommendations = S.Array(Recommendation);
export class ListRecommendationsResponse extends S.Class<ListRecommendationsResponse>(
  "ListRecommendationsResponse",
)({
  Recommendations: S.optional(Recommendations),
  NextToken: S.optional(S.String),
}) {}
export class EventResource extends S.Class<EventResource>("EventResource")({
  Type: S.optional(S.String),
  Name: S.optional(S.String),
  Arn: S.optional(S.String),
}) {}
export const EventResources = S.Array(EventResource);
export class Event extends S.Class<Event>("Event")({
  ResourceCollection: S.optional(ResourceCollection),
  Id: S.optional(S.String),
  Time: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EventSource: S.optional(S.String),
  Name: S.optional(S.String),
  DataSource: S.optional(S.String),
  EventClass: S.optional(S.String),
  Resources: S.optional(EventResources),
}) {}
export const Events = S.Array(Event);
export class ListEventsResponse extends S.Class<ListEventsResponse>(
  "ListEventsResponse",
)({ Events: Events, NextToken: S.optional(S.String) }) {}
export class ProactiveAnomaly extends S.Class<ProactiveAnomaly>(
  "ProactiveAnomaly",
)({
  Id: S.optional(S.String),
  Severity: S.optional(S.String),
  Status: S.optional(S.String),
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
}) {}
export class DescribeAnomalyResponse extends S.Class<DescribeAnomalyResponse>(
  "DescribeAnomalyResponse",
)({
  ProactiveAnomaly: S.optional(ProactiveAnomaly),
  ReactiveAnomaly: S.optional(ReactiveAnomaly),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {
    Message: S.String,
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
    RetryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.optional(S.String),
    Fields: S.optional(ValidationExceptionFields),
  },
) {}

//# Operations
/**
 * For the time range passed in, returns the number of open reactive insight that were
 * created, the number of open proactive insights that were created, and the Mean Time to Recover (MTTR) for all
 * closed reactive insights.
 */
export const describeAccountOverview = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountOverviewRequest,
    output: DescribeAccountOverviewResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of a specified insight's recommendations. Each recommendation includes
 * a list of related metrics and a list of related events.
 */
export const listRecommendations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeOrganizationResourceCollectionHealth =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeServiceIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeServiceIntegrationRequest,
    output: DescribeServiceIntegrationResponse,
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
 * Returns lists Amazon Web Services resources that are of the specified resource collection type.
 * The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and
 * Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze
 * the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag *key*. You can specify up to 500 Amazon Web Services CloudFormation stacks.
 */
export const getResourceCollection =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listMonitoredResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const searchInsights = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Returns the integration status of services that are integrated with DevOps Guru as Consumer
 * via EventBridge. The one service that can be integrated with DevOps Guru is Amazon CodeGuru
 * Profiler, which can produce proactive recommendations which can be stored and viewed in
 * DevOps Guru.
 */
export const describeEventSourcesConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeEventSourcesConfigRequest,
    output: DescribeEventSourcesConfigResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of notification channels configured for DevOps Guru. Each notification
 * channel is used to notify you when DevOps Guru generates an insight that contains information
 * about how to improve your operations. The one
 * supported notification channel is Amazon Simple Notification Service (Amazon SNS).
 */
export const listNotificationChannels =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listOrganizationInsights =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const searchOrganizationInsights =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateResourceCollection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateResourceCollectionRequest,
    output: UpdateResourceCollectionResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Enables or disables integration with a service that can be integrated with DevOps Guru. The
 * one service that can be integrated with DevOps Guru is Amazon Web Services Systems Manager, which can be used to create
 * an OpsItem for each generated insight.
 */
export const updateServiceIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServiceIntegrationRequest,
    output: UpdateServiceIntegrationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns active insights, predictive insights, and resource hours analyzed in last
 * hour.
 */
export const describeOrganizationHealth = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeOrganizationHealthRequest,
    output: DescribeOrganizationHealthResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns an overview of your organization's history based on the specified time range.
 * The overview includes the total reactive and proactive insights.
 */
export const describeOrganizationOverview =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeResourceCollectionHealth =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeAccountHealth = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountHealthRequest,
    output: DescribeAccountHealthResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Enables or disables integration with a service that can be integrated with DevOps Guru. The
 * one service that can be integrated with DevOps Guru is Amazon CodeGuru Profiler, which
 * can produce proactive recommendations which can be stored and viewed in DevOps Guru.
 */
export const updateEventSourcesConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateEventSourcesConfigRequest,
    output: UpdateEventSourcesConfigResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns an estimate of the monthly cost for DevOps Guru to analyze your Amazon Web Services resources.
 * For more information,
 * see Estimate your
 * Amazon DevOps Guru costs and
 * Amazon DevOps Guru pricing.
 */
export const getCostEstimation = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Starts the creation of an estimate of the monthly cost to analyze your Amazon Web Services
 * resources.
 */
export const startCostEstimation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const putFeedback = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const removeNotificationChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns the most recent feedback submitted in the current Amazon Web Services account and Region.
 */
export const describeFeedback = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteInsight = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeInsight = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listAnomaliesForInsight =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listAnomalousLogGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listInsights = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
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
export const addNotificationChannel = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns a list of the events emitted by the resources that are evaluated by DevOps Guru.
 * You can use filters to specify which events are returned.
 */
export const listEvents = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeAnomaly = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
