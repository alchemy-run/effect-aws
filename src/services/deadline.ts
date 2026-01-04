import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "deadline",
  serviceShapeName: "Deadline",
});
const auth = T.AwsAuthSigv4({ name: "deadline" });
const ver = T.ServiceVersion("2023-10-12");
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
                                url: "https://deadline-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                                url: "https://deadline-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                                url: "https://deadline.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://deadline.{Region}.{PartitionResult#dnsSuffix}",
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
export const QueueIds = S.Array(S.String);
export const FleetIds = S.Array(S.String);
export const UsageGroupBy = S.Array(S.String);
export const UsageStatistics = S.Array(S.String);
export const StringList = S.Array(S.String);
export class CreateQueueFleetAssociationRequest extends S.Class<CreateQueueFleetAssociationRequest>(
  "CreateQueueFleetAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueId: S.String,
    fleetId: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2023-10-12/farms/{farmId}/queue-fleet-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateQueueFleetAssociationResponse extends S.Class<CreateQueueFleetAssociationResponse>(
  "CreateQueueFleetAssociationResponse",
)({}) {}
export class CreateQueueLimitAssociationRequest extends S.Class<CreateQueueLimitAssociationRequest>(
  "CreateQueueLimitAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueId: S.String,
    limitId: S.String,
  },
  T.all(
    T.Http({
      method: "PUT",
      uri: "/2023-10-12/farms/{farmId}/queue-limit-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateQueueLimitAssociationResponse extends S.Class<CreateQueueLimitAssociationResponse>(
  "CreateQueueLimitAssociationResponse",
)({}) {}
export class DeleteQueueFleetAssociationRequest extends S.Class<DeleteQueueFleetAssociationRequest>(
  "DeleteQueueFleetAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueId: S.String.pipe(T.HttpLabel()),
    fleetId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/queue-fleet-associations/{queueId}/{fleetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueueFleetAssociationResponse extends S.Class<DeleteQueueFleetAssociationResponse>(
  "DeleteQueueFleetAssociationResponse",
)({}) {}
export class DeleteQueueLimitAssociationRequest extends S.Class<DeleteQueueLimitAssociationRequest>(
  "DeleteQueueLimitAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueId: S.String.pipe(T.HttpLabel()),
    limitId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "DELETE",
      uri: "/2023-10-12/farms/{farmId}/queue-limit-associations/{queueId}/{limitId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteQueueLimitAssociationResponse extends S.Class<DeleteQueueLimitAssociationResponse>(
  "DeleteQueueLimitAssociationResponse",
)({}) {}
export class GetQueueFleetAssociationRequest extends S.Class<GetQueueFleetAssociationRequest>(
  "GetQueueFleetAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueId: S.String.pipe(T.HttpLabel()),
    fleetId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queue-fleet-associations/{queueId}/{fleetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQueueLimitAssociationRequest extends S.Class<GetQueueLimitAssociationRequest>(
  "GetQueueLimitAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueId: S.String.pipe(T.HttpLabel()),
    limitId: S.String.pipe(T.HttpLabel()),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queue-limit-associations/{queueId}/{limitId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetSessionsStatisticsAggregationRequest extends S.Class<GetSessionsStatisticsAggregationRequest>(
  "GetSessionsStatisticsAggregationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    aggregationId: S.String.pipe(T.HttpQuery("aggregationId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/sessions-statistics-aggregation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAvailableMeteredProductsRequest extends S.Class<ListAvailableMeteredProductsRequest>(
  "ListAvailableMeteredProductsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/2023-10-12/metered-products" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQueueFleetAssociationsRequest extends S.Class<ListQueueFleetAssociationsRequest>(
  "ListQueueFleetAssociationsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueId: S.optional(S.String).pipe(T.HttpQuery("queueId")),
    fleetId: S.optional(S.String).pipe(T.HttpQuery("fleetId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queue-fleet-associations",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListQueueLimitAssociationsRequest extends S.Class<ListQueueLimitAssociationsRequest>(
  "ListQueueLimitAssociationsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueId: S.optional(S.String).pipe(T.HttpQuery("queueId")),
    limitId: S.optional(S.String).pipe(T.HttpQuery("limitId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/2023-10-12/farms/{farmId}/queue-limit-associations",
    }),
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
    T.Http({ method: "GET", uri: "/2023-10-12/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchGroupedFilterExpressions extends S.Class<SearchGroupedFilterExpressions>(
  "SearchGroupedFilterExpressions",
)({ filters: S.suspend(() => SearchFilterExpressions), operator: S.String }) {}
export class UserJobsFirst extends S.Class<UserJobsFirst>("UserJobsFirst")({
  userIdentityId: S.String,
}) {}
export class FieldSortExpression extends S.Class<FieldSortExpression>(
  "FieldSortExpression",
)({ sortOrder: S.String, name: S.String }) {}
export class ParameterSortExpression extends S.Class<ParameterSortExpression>(
  "ParameterSortExpression",
)({ sortOrder: S.String, name: S.String }) {}
export const SearchSortExpression = S.Union(
  S.Struct({ userJobsFirst: UserJobsFirst }),
  S.Struct({ fieldSort: FieldSortExpression }),
  S.Struct({ parameterSort: ParameterSortExpression }),
);
export const SearchSortExpressions = S.Array(SearchSortExpression);
export class SearchStepsRequest extends S.Class<SearchStepsRequest>(
  "SearchStepsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueIds: QueueIds,
    jobId: S.optional(S.String),
    filterExpressions: S.optional(SearchGroupedFilterExpressions),
    sortExpressions: S.optional(SearchSortExpressions),
    itemOffset: S.Number,
    pageSize: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/search/steps" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchTasksRequest extends S.Class<SearchTasksRequest>(
  "SearchTasksRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueIds: QueueIds,
    jobId: S.optional(S.String),
    filterExpressions: S.optional(SearchGroupedFilterExpressions),
    sortExpressions: S.optional(SearchSortExpressions),
    itemOffset: S.Number,
    pageSize: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/search/tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchWorkersRequest extends S.Class<SearchWorkersRequest>(
  "SearchWorkersRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    fleetIds: FleetIds,
    filterExpressions: S.optional(SearchGroupedFilterExpressions),
    sortExpressions: S.optional(SearchSortExpressions),
    itemOffset: S.Number,
    pageSize: S.optional(S.Number),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/2023-10-12/farms/{farmId}/search/workers",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel()),
    tagKeys: StringList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/2023-10-12/tags/{resourceArn}" }),
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
export class UpdateQueueFleetAssociationRequest extends S.Class<UpdateQueueFleetAssociationRequest>(
  "UpdateQueueFleetAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueId: S.String.pipe(T.HttpLabel()),
    fleetId: S.String.pipe(T.HttpLabel()),
    status: S.String,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/queue-fleet-associations/{queueId}/{fleetId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueFleetAssociationResponse extends S.Class<UpdateQueueFleetAssociationResponse>(
  "UpdateQueueFleetAssociationResponse",
)({}) {}
export class UpdateQueueLimitAssociationRequest extends S.Class<UpdateQueueLimitAssociationRequest>(
  "UpdateQueueLimitAssociationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueId: S.String.pipe(T.HttpLabel()),
    limitId: S.String.pipe(T.HttpLabel()),
    status: S.String,
  },
  T.all(
    T.Http({
      method: "PATCH",
      uri: "/2023-10-12/farms/{farmId}/queue-limit-associations/{queueId}/{limitId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateQueueLimitAssociationResponse extends S.Class<UpdateQueueLimitAssociationResponse>(
  "UpdateQueueLimitAssociationResponse",
)({}) {}
export const SessionsStatisticsResources = S.Union(
  S.Struct({ queueIds: QueueIds }),
  S.Struct({ fleetIds: FleetIds }),
);
export const Tags = S.Record({ key: S.String, value: S.String });
export class GetQueueFleetAssociationResponse extends S.Class<GetQueueFleetAssociationResponse>(
  "GetQueueFleetAssociationResponse",
)({
  queueId: S.String,
  fleetId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export class GetQueueLimitAssociationResponse extends S.Class<GetQueueLimitAssociationResponse>(
  "GetQueueLimitAssociationResponse",
)({
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  queueId: S.String,
  limitId: S.String,
  status: S.String,
}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }) {}
export class StartSessionsStatisticsAggregationRequest extends S.Class<StartSessionsStatisticsAggregationRequest>(
  "StartSessionsStatisticsAggregationRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    resourceIds: SessionsStatisticsResources,
    startTime: S.Date.pipe(T.TimestampFormat("date-time")),
    endTime: S.Date.pipe(T.TimestampFormat("date-time")),
    timezone: S.optional(S.String),
    period: S.optional(S.String),
    groupBy: UsageGroupBy,
    statistics: UsageStatistics,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/2023-10-12/farms/{farmId}/sessions-statistics-aggregation",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel()), tags: S.optional(Tags) },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/tags/{resourceArn}" }),
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
export const ExceptionContext = S.Record({ key: S.String, value: S.String });
export class MeteredProductSummary extends S.Class<MeteredProductSummary>(
  "MeteredProductSummary",
)({
  productId: S.String,
  family: S.String,
  vendor: S.String,
  port: S.Number,
}) {}
export const MeteredProductSummaryList = S.Array(MeteredProductSummary);
export class QueueFleetAssociationSummary extends S.Class<QueueFleetAssociationSummary>(
  "QueueFleetAssociationSummary",
)({
  queueId: S.String,
  fleetId: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export const QueueFleetAssociationSummaries = S.Array(
  QueueFleetAssociationSummary,
);
export class QueueLimitAssociationSummary extends S.Class<QueueLimitAssociationSummary>(
  "QueueLimitAssociationSummary",
)({
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  createdBy: S.String,
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  queueId: S.String,
  limitId: S.String,
  status: S.String,
}) {}
export const QueueLimitAssociationSummaries = S.Array(
  QueueLimitAssociationSummary,
);
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class DateTimeFilterExpression extends S.Class<DateTimeFilterExpression>(
  "DateTimeFilterExpression",
)({
  name: S.String,
  operator: S.String,
  dateTime: S.Date.pipe(T.TimestampFormat("date-time")),
}) {}
export class ParameterFilterExpression extends S.Class<ParameterFilterExpression>(
  "ParameterFilterExpression",
)({ name: S.String, operator: S.String, value: S.String }) {}
export class SearchTermFilterExpression extends S.Class<SearchTermFilterExpression>(
  "SearchTermFilterExpression",
)({ searchTerm: S.String, matchType: S.optional(S.String) }) {}
export class StringFilterExpression extends S.Class<StringFilterExpression>(
  "StringFilterExpression",
)({ name: S.String, operator: S.String, value: S.String }) {}
export class ListAvailableMeteredProductsResponse extends S.Class<ListAvailableMeteredProductsResponse>(
  "ListAvailableMeteredProductsResponse",
)({
  meteredProducts: MeteredProductSummaryList,
  nextToken: S.optional(S.String),
}) {}
export class ListQueueFleetAssociationsResponse extends S.Class<ListQueueFleetAssociationsResponse>(
  "ListQueueFleetAssociationsResponse",
)({
  queueFleetAssociations: QueueFleetAssociationSummaries,
  nextToken: S.optional(S.String),
}) {}
export class ListQueueLimitAssociationsResponse extends S.Class<ListQueueLimitAssociationsResponse>(
  "ListQueueLimitAssociationsResponse",
)({
  queueLimitAssociations: QueueLimitAssociationSummaries,
  nextToken: S.optional(S.String),
}) {}
export class StartSessionsStatisticsAggregationResponse extends S.Class<StartSessionsStatisticsAggregationResponse>(
  "StartSessionsStatisticsAggregationResponse",
)({ aggregationId: S.String }) {}
export class Stats extends S.Class<Stats>("Stats")({
  min: S.optional(S.Number),
  max: S.optional(S.Number),
  avg: S.optional(S.Number),
  sum: S.optional(S.Number),
}) {}
export type SearchFilterExpression =
  | { dateTimeFilter: DateTimeFilterExpression }
  | { parameterFilter: ParameterFilterExpression }
  | { searchTermFilter: SearchTermFilterExpression }
  | { stringFilter: StringFilterExpression }
  | { groupFilter: SearchGroupedFilterExpressions };
export const SearchFilterExpression = S.Union(
  S.Struct({ dateTimeFilter: DateTimeFilterExpression }),
  S.Struct({ parameterFilter: ParameterFilterExpression }),
  S.Struct({ searchTermFilter: SearchTermFilterExpression }),
  S.Struct({ stringFilter: StringFilterExpression }),
  S.Struct({
    groupFilter: S.suspend(
      (): S.Schema<SearchGroupedFilterExpressions, any> =>
        SearchGroupedFilterExpressions,
    ),
  }),
) as any as S.Schema<SearchFilterExpression>;
export type SearchFilterExpressions = SearchFilterExpression[];
export const SearchFilterExpressions = S.Array(
  S.suspend(() => SearchFilterExpression),
) as any as S.Schema<SearchFilterExpressions>;
export const TaskRunStatusCounts = S.Record({ key: S.String, value: S.Number });
export const IpV4Addresses = S.Array(S.String);
export const IpV6Addresses = S.Array(S.String);
export class Statistics extends S.Class<Statistics>("Statistics")({
  queueId: S.optional(S.String),
  fleetId: S.optional(S.String),
  jobId: S.optional(S.String),
  jobName: S.optional(S.String),
  userId: S.optional(S.String),
  usageType: S.optional(S.String),
  licenseProduct: S.optional(S.String),
  instanceType: S.optional(S.String),
  count: S.Number,
  costInUsd: Stats,
  runtimeInSeconds: Stats,
  aggregationStartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  aggregationEndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const StatisticsList = S.Array(Statistics);
export class StepParameter extends S.Class<StepParameter>("StepParameter")({
  name: S.String,
  type: S.String,
}) {}
export const StepParameterList = S.Array(StepParameter);
export const TaskParameterValue = S.Union(
  S.Struct({ int: S.String }),
  S.Struct({ float: S.String }),
  S.Struct({ string: S.String }),
  S.Struct({ path: S.String }),
  S.Struct({ chunkInt: S.String }),
);
export class IpAddresses extends S.Class<IpAddresses>("IpAddresses")({
  ipV4Addresses: S.optional(IpV4Addresses),
  ipV6Addresses: S.optional(IpV6Addresses),
}) {}
export class GetSessionsStatisticsAggregationResponse extends S.Class<GetSessionsStatisticsAggregationResponse>(
  "GetSessionsStatisticsAggregationResponse",
)({
  statistics: S.optional(StatisticsList),
  nextToken: S.optional(S.String),
  status: S.String,
  statusMessage: S.optional(S.String),
}) {}
export class SearchJobsRequest extends S.Class<SearchJobsRequest>(
  "SearchJobsRequest",
)(
  {
    farmId: S.String.pipe(T.HttpLabel()),
    queueIds: QueueIds,
    filterExpressions: S.optional(SearchGroupedFilterExpressions),
    sortExpressions: S.optional(SearchSortExpressions),
    itemOffset: S.Number,
    pageSize: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/2023-10-12/farms/{farmId}/search/jobs" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ParameterSpace extends S.Class<ParameterSpace>("ParameterSpace")({
  parameters: StepParameterList,
  combination: S.optional(S.String),
}) {}
export const TaskParameters = S.Record({
  key: S.String,
  value: TaskParameterValue,
});
export class HostPropertiesResponse extends S.Class<HostPropertiesResponse>(
  "HostPropertiesResponse",
)({
  ipAddresses: S.optional(IpAddresses),
  hostName: S.optional(S.String),
  ec2InstanceArn: S.optional(S.String),
  ec2InstanceType: S.optional(S.String),
}) {}
export class StepSearchSummary extends S.Class<StepSearchSummary>(
  "StepSearchSummary",
)({
  stepId: S.optional(S.String),
  jobId: S.optional(S.String),
  queueId: S.optional(S.String),
  name: S.optional(S.String),
  lifecycleStatus: S.optional(S.String),
  lifecycleStatusMessage: S.optional(S.String),
  taskRunStatus: S.optional(S.String),
  targetTaskRunStatus: S.optional(S.String),
  taskRunStatusCounts: S.optional(TaskRunStatusCounts),
  taskFailureRetryCount: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  createdBy: S.optional(S.String),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  parameterSpace: S.optional(ParameterSpace),
}) {}
export const StepSearchSummaries = S.Array(StepSearchSummary);
export class TaskSearchSummary extends S.Class<TaskSearchSummary>(
  "TaskSearchSummary",
)({
  taskId: S.optional(S.String),
  stepId: S.optional(S.String),
  jobId: S.optional(S.String),
  queueId: S.optional(S.String),
  runStatus: S.optional(S.String),
  targetRunStatus: S.optional(S.String),
  parameters: S.optional(TaskParameters),
  failureRetryCount: S.optional(S.Number),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
}) {}
export const TaskSearchSummaries = S.Array(TaskSearchSummary);
export class WorkerSearchSummary extends S.Class<WorkerSearchSummary>(
  "WorkerSearchSummary",
)({
  fleetId: S.optional(S.String),
  workerId: S.optional(S.String),
  status: S.optional(S.String),
  hostProperties: S.optional(HostPropertiesResponse),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const WorkerSearchSummaries = S.Array(WorkerSearchSummary);
export class SearchStepsResponse extends S.Class<SearchStepsResponse>(
  "SearchStepsResponse",
)({
  steps: StepSearchSummaries,
  nextItemOffset: S.optional(S.Number),
  totalResults: S.Number,
}) {}
export class SearchTasksResponse extends S.Class<SearchTasksResponse>(
  "SearchTasksResponse",
)({
  tasks: TaskSearchSummaries,
  nextItemOffset: S.optional(S.Number),
  totalResults: S.Number,
}) {}
export class SearchWorkersResponse extends S.Class<SearchWorkersResponse>(
  "SearchWorkersResponse",
)({
  workers: WorkerSearchSummaries,
  nextItemOffset: S.optional(S.Number),
  totalResults: S.Number,
}) {}
export const JobParameter = S.Union(
  S.Struct({ int: S.String }),
  S.Struct({ float: S.String }),
  S.Struct({ string: S.String }),
  S.Struct({ path: S.String }),
);
export const JobParameters = S.Record({ key: S.String, value: JobParameter });
export class JobSearchSummary extends S.Class<JobSearchSummary>(
  "JobSearchSummary",
)({
  jobId: S.optional(S.String),
  queueId: S.optional(S.String),
  name: S.optional(S.String),
  lifecycleStatus: S.optional(S.String),
  lifecycleStatusMessage: S.optional(S.String),
  taskRunStatus: S.optional(S.String),
  targetTaskRunStatus: S.optional(S.String),
  taskRunStatusCounts: S.optional(TaskRunStatusCounts),
  taskFailureRetryCount: S.optional(S.Number),
  priority: S.optional(S.Number),
  maxFailedTasksCount: S.optional(S.Number),
  maxRetriesPerTask: S.optional(S.Number),
  createdBy: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  updatedBy: S.optional(S.String),
  jobParameters: S.optional(JobParameters),
  maxWorkerCount: S.optional(S.Number),
  sourceJobId: S.optional(S.String),
}) {}
export const JobSearchSummaries = S.Array(JobSearchSummary);
export class SearchJobsResponse extends S.Class<SearchJobsResponse>(
  "SearchJobsResponse",
)({
  jobs: JobSearchSummaries,
  nextItemOffset: S.optional(S.Number),
  totalResults: S.Number,
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  {},
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
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

//# Operations
/**
 * Updates the status of the queue. If you set the status to one of the
 * `STOP_LIMIT_USAGE*` values, there will be a delay before the status
 * transitions to the `STOPPED` state.
 */
export const updateQueueLimitAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateQueueLimitAssociationRequest,
    output: UpdateQueueLimitAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Associates a limit with a particular queue. After the limit is associated, all workers
 * for jobs that specify the limit associated with the queue are subject to the limit. You
 * can't associate two limits with the same `amountRequirementName` to the same
 * queue.
 */
export const createQueueLimitAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateQueueLimitAssociationRequest,
    output: CreateQueueLimitAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a queue-fleet association.
 */
export const deleteQueueFleetAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteQueueFleetAssociationRequest,
    output: DeleteQueueFleetAssociationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Removes the association between a queue and a limit. You must use the
 * `UpdateQueueLimitAssociation` operation to set the status to
 * `STOP_LIMIT_USAGE_AND_COMPLETE_TASKS` or
 * `STOP_LIMIT_USAGE_AND_CANCEL_TASKS`. The status does not change immediately.
 * Use the `GetQueueLimitAssociation` operation to see if the status changed to
 * `STOPPED` before deleting the association.
 */
export const deleteQueueLimitAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteQueueLimitAssociationRequest,
    output: DeleteQueueLimitAssociationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a queue-fleet association.
 */
export const getQueueFleetAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetQueueFleetAssociationRequest,
    output: GetQueueFleetAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets information about a specific association between a queue and a limit.
 */
export const getQueueLimitAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetQueueLimitAssociationRequest,
    output: GetQueueLimitAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Lists tags for a resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Tags a resource using the resource's ARN and desired tags.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes a tag from a resource using the resource's ARN and tag to remove.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an association between a queue and a fleet.
 */
export const createQueueFleetAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateQueueFleetAssociationRequest,
    output: CreateQueueFleetAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * A list of the available metered products.
 */
export const listAvailableMeteredProducts =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListAvailableMeteredProductsRequest,
    output: ListAvailableMeteredProductsResponse,
    errors: [InternalServerErrorException, ThrottlingException],
  }));
/**
 * Lists queue-fleet associations.
 */
export const listQueueFleetAssociations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListQueueFleetAssociationsRequest,
    output: ListQueueFleetAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Gets a list of the associations between queues and limits defined in a farm.
 */
export const listQueueLimitAssociations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListQueueLimitAssociationsRequest,
    output: ListQueueLimitAssociationsResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Starts an asynchronous request for getting aggregated statistics about queues and farms.
 * Get the statistics using the `GetSessionsStatisticsAggregation` operation. You
 * can only have one running aggregation for your Deadline Cloud farm. Call the
 * `GetSessionsStatisticsAggregation` operation and check the
 * `status` field to see if an aggregation is running. Statistics are available
 * for 1 hour after you call the `StartSessionsStatisticsAggregation`
 * operation.
 */
export const startSessionsStatisticsAggregation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartSessionsStatisticsAggregationRequest,
    output: StartSessionsStatisticsAggregationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates a queue-fleet association.
 */
export const updateQueueFleetAssociation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateQueueFleetAssociationRequest,
    output: UpdateQueueFleetAssociationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a set of statistics for queues or farms. Before you can call the
 * `GetSessionStatisticsAggregation` operation, you must first call the
 * `StartSessionsStatisticsAggregation` operation. Statistics are available for
 * 1 hour after you call the `StartSessionsStatisticsAggregation` operation.
 */
export const getSessionsStatisticsAggregation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetSessionsStatisticsAggregationRequest,
    output: GetSessionsStatisticsAggregationResponse,
    errors: [
      AccessDeniedException,
      InternalServerErrorException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Searches for steps.
 */
export const searchSteps = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchStepsRequest,
  output: SearchStepsResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Searches for tasks.
 */
export const searchTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchTasksRequest,
  output: SearchTasksResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Searches for workers.
 */
export const searchWorkers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchWorkersRequest,
  output: SearchWorkersResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Searches for jobs.
 */
export const searchJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchJobsRequest,
  output: SearchJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerErrorException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
