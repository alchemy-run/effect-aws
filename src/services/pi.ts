import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace("http://pi.amazonaws.com/doc/2018-02-27/");
const svc = T.AwsApiService({
  sdkId: "PI",
  serviceShapeName: "PerformanceInsightsv20180227",
});
const auth = T.AwsAuthSigv4({ name: "pi" });
const ver = T.ServiceVersion("2018-02-27");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://pi-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://pi-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://pi.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://pi.{Region}.{PartitionResult#dnsSuffix}",
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
export const AdditionalMetricsList = S.Array(S.String);
export const RequestedDimensionList = S.Array(S.String);
export const DimensionsMetricList = S.Array(S.String);
export const AuthorizedActionsList = S.Array(S.String);
export const MetricTypeList = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class DeletePerformanceAnalysisReportRequest extends S.Class<DeletePerformanceAnalysisReportRequest>(
  "DeletePerformanceAnalysisReportRequest",
)(
  { ServiceType: S.String, Identifier: S.String, AnalysisReportId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePerformanceAnalysisReportResponse extends S.Class<DeletePerformanceAnalysisReportResponse>(
  "DeletePerformanceAnalysisReportResponse",
)({}, ns) {}
export class GetDimensionKeyDetailsRequest extends S.Class<GetDimensionKeyDetailsRequest>(
  "GetDimensionKeyDetailsRequest",
)(
  {
    ServiceType: S.String,
    Identifier: S.String,
    Group: S.String,
    GroupIdentifier: S.String,
    RequestedDimensions: S.optional(RequestedDimensionList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPerformanceAnalysisReportRequest extends S.Class<GetPerformanceAnalysisReportRequest>(
  "GetPerformanceAnalysisReportRequest",
)(
  {
    ServiceType: S.String,
    Identifier: S.String,
    AnalysisReportId: S.String,
    TextFormat: S.optional(S.String),
    AcceptLanguage: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourceMetadataRequest extends S.Class<GetResourceMetadataRequest>(
  "GetResourceMetadataRequest",
)(
  { ServiceType: S.String, Identifier: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAvailableResourceDimensionsRequest extends S.Class<ListAvailableResourceDimensionsRequest>(
  "ListAvailableResourceDimensionsRequest",
)(
  {
    ServiceType: S.String,
    Identifier: S.String,
    Metrics: DimensionsMetricList,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    AuthorizedActions: S.optional(AuthorizedActionsList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAvailableResourceMetricsRequest extends S.Class<ListAvailableResourceMetricsRequest>(
  "ListAvailableResourceMetricsRequest",
)(
  {
    ServiceType: S.String,
    Identifier: S.String,
    MetricTypes: MetricTypeList,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPerformanceAnalysisReportsRequest extends S.Class<ListPerformanceAnalysisReportsRequest>(
  "ListPerformanceAnalysisReportsRequest",
)(
  {
    ServiceType: S.String,
    Identifier: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ListTags: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ServiceType: S.String, ResourceARN: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ServiceType: S.String, ResourceARN: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ServiceType: S.String, ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export const SanitizedStringList = S.Array(S.String);
export class DimensionGroup extends S.Class<DimensionGroup>("DimensionGroup")({
  Group: S.String,
  Dimensions: S.optional(SanitizedStringList),
  Limit: S.optional(S.Number),
}) {}
export const MetricQueryFilterMap = S.Record({
  key: S.String,
  value: S.String,
});
export class MetricQuery extends S.Class<MetricQuery>("MetricQuery")({
  Metric: S.String,
  GroupBy: S.optional(DimensionGroup),
  Filter: S.optional(MetricQueryFilterMap),
}) {}
export const MetricQueryList = S.Array(MetricQuery);
export class CreatePerformanceAnalysisReportRequest extends S.Class<CreatePerformanceAnalysisReportRequest>(
  "CreatePerformanceAnalysisReportRequest",
)(
  {
    ServiceType: S.String,
    Identifier: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDimensionKeysRequest extends S.Class<DescribeDimensionKeysRequest>(
  "DescribeDimensionKeysRequest",
)(
  {
    ServiceType: S.String,
    Identifier: S.String,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Metric: S.String,
    PeriodInSeconds: S.optional(S.Number),
    GroupBy: DimensionGroup,
    AdditionalMetrics: S.optional(AdditionalMetricsList),
    PartitionBy: S.optional(DimensionGroup),
    Filter: S.optional(MetricQueryFilterMap),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourceMetricsRequest extends S.Class<GetResourceMetricsRequest>(
  "GetResourceMetricsRequest",
)(
  {
    ServiceType: S.String,
    Identifier: S.String,
    MetricQueries: MetricQueryList,
    StartTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    EndTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    PeriodInSeconds: S.optional(S.Number),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    PeriodAlignment: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }, ns) {}
export class DimensionKeyDetail extends S.Class<DimensionKeyDetail>(
  "DimensionKeyDetail",
)({
  Value: S.optional(S.String),
  Dimension: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const DimensionKeyDetailList = S.Array(DimensionKeyDetail);
export class ResponseResourceMetric extends S.Class<ResponseResourceMetric>(
  "ResponseResourceMetric",
)({
  Metric: S.optional(S.String),
  Description: S.optional(S.String),
  Unit: S.optional(S.String),
}) {}
export const ResponseResourceMetricList = S.Array(ResponseResourceMetric);
export class AnalysisReportSummary extends S.Class<AnalysisReportSummary>(
  "AnalysisReportSummary",
)({
  AnalysisReportId: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  Tags: S.optional(TagList),
}) {}
export const AnalysisReportSummaryList = S.Array(AnalysisReportSummary);
export class CreatePerformanceAnalysisReportResponse extends S.Class<CreatePerformanceAnalysisReportResponse>(
  "CreatePerformanceAnalysisReportResponse",
)({ AnalysisReportId: S.optional(S.String) }, ns) {}
export class GetDimensionKeyDetailsResponse extends S.Class<GetDimensionKeyDetailsResponse>(
  "GetDimensionKeyDetailsResponse",
)({ Dimensions: S.optional(DimensionKeyDetailList) }, ns) {}
export class ListAvailableResourceMetricsResponse extends S.Class<ListAvailableResourceMetricsResponse>(
  "ListAvailableResourceMetricsResponse",
)(
  {
    Metrics: S.optional(ResponseResourceMetricList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListPerformanceAnalysisReportsResponse extends S.Class<ListPerformanceAnalysisReportsResponse>(
  "ListPerformanceAnalysisReportsResponse",
)(
  {
    AnalysisReports: S.optional(AnalysisReportSummaryList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export const MetricValuesList = S.Array(S.Number);
export class FeatureMetadata extends S.Class<FeatureMetadata>(
  "FeatureMetadata",
)({ Status: S.optional(S.String) }) {}
export const FeatureMetadataMap = S.Record({
  key: S.String,
  value: FeatureMetadata,
});
export class Recommendation extends S.Class<Recommendation>("Recommendation")({
  RecommendationId: S.optional(S.String),
  RecommendationDescription: S.optional(S.String),
}) {}
export const RecommendationList = S.Array(Recommendation);
export class DimensionDetail extends S.Class<DimensionDetail>(
  "DimensionDetail",
)({ Identifier: S.optional(S.String) }) {}
export const DimensionDetailList = S.Array(DimensionDetail);
export class GetResourceMetadataResponse extends S.Class<GetResourceMetadataResponse>(
  "GetResourceMetadataResponse",
)(
  {
    Identifier: S.optional(S.String),
    Features: S.optional(FeatureMetadataMap),
  },
  ns,
) {}
export const DimensionMap = S.Record({ key: S.String, value: S.String });
export const AdditionalMetricsMap = S.Record({
  key: S.String,
  value: S.Number,
});
export class ResponseResourceMetricKey extends S.Class<ResponseResourceMetricKey>(
  "ResponseResourceMetricKey",
)({ Metric: S.String, Dimensions: S.optional(DimensionMap) }) {}
export class DataPoint extends S.Class<DataPoint>("DataPoint")({
  Timestamp: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Value: S.Number,
}) {}
export const DataPointsList = S.Array(DataPoint);
export class DimensionGroupDetail extends S.Class<DimensionGroupDetail>(
  "DimensionGroupDetail",
)({
  Group: S.optional(S.String),
  Dimensions: S.optional(DimensionDetailList),
}) {}
export const DimensionGroupDetailList = S.Array(DimensionGroupDetail);
export class ResponsePartitionKey extends S.Class<ResponsePartitionKey>(
  "ResponsePartitionKey",
)({ Dimensions: DimensionMap }) {}
export const ResponsePartitionKeyList = S.Array(ResponsePartitionKey);
export class DimensionKeyDescription extends S.Class<DimensionKeyDescription>(
  "DimensionKeyDescription",
)({
  Dimensions: S.optional(DimensionMap),
  Total: S.optional(S.Number),
  AdditionalMetrics: S.optional(AdditionalMetricsMap),
  Partitions: S.optional(MetricValuesList),
}) {}
export const DimensionKeyDescriptionList = S.Array(DimensionKeyDescription);
export class MetricKeyDataPoints extends S.Class<MetricKeyDataPoints>(
  "MetricKeyDataPoints",
)({
  Key: S.optional(ResponseResourceMetricKey),
  DataPoints: S.optional(DataPointsList),
}) {}
export const MetricKeyDataPointsList = S.Array(MetricKeyDataPoints);
export class MetricDimensionGroups extends S.Class<MetricDimensionGroups>(
  "MetricDimensionGroups",
)({
  Metric: S.optional(S.String),
  Groups: S.optional(DimensionGroupDetailList),
}) {}
export const MetricDimensionsList = S.Array(MetricDimensionGroups);
export class DescribeDimensionKeysResponse extends S.Class<DescribeDimensionKeysResponse>(
  "DescribeDimensionKeysResponse",
)(
  {
    AlignedStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AlignedEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    PartitionKeys: S.optional(ResponsePartitionKeyList),
    Keys: S.optional(DimensionKeyDescriptionList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export const DescriptiveMap = S.Record({ key: S.String, value: S.String });
export class GetResourceMetricsResponse extends S.Class<GetResourceMetricsResponse>(
  "GetResourceMetricsResponse",
)(
  {
    AlignedStartTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AlignedEndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Identifier: S.optional(S.String),
    MetricList: S.optional(MetricKeyDataPointsList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListAvailableResourceDimensionsResponse extends S.Class<ListAvailableResourceDimensionsResponse>(
  "ListAvailableResourceDimensionsResponse",
)(
  {
    MetricDimensions: S.optional(MetricDimensionsList),
    NextToken: S.optional(S.String),
  },
  ns,
) {}
export class PerformanceInsightsMetric extends S.Class<PerformanceInsightsMetric>(
  "PerformanceInsightsMetric",
)({
  Metric: S.optional(S.String),
  DisplayName: S.optional(S.String),
  Dimensions: S.optional(DescriptiveMap),
  Filter: S.optional(DescriptiveMap),
  Value: S.optional(S.Number),
}) {}
export class Data extends S.Class<Data>("Data")({
  PerformanceInsightsMetric: S.optional(PerformanceInsightsMetric),
}) {}
export const DataList = S.Array(Data);
export class Insight extends S.Class<Insight>("Insight")({
  InsightId: S.String,
  InsightType: S.optional(S.String),
  Context: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Severity: S.optional(S.String),
  SupportingInsights: S.optional(S.suspend(() => InsightList)),
  Description: S.optional(S.String),
  Recommendations: S.optional(RecommendationList),
  InsightData: S.optional(DataList),
  BaselineData: S.optional(DataList),
}) {}
export type InsightList = Insight[];
export const InsightList = S.Array(
  S.suspend((): S.Schema<Insight, any> => Insight),
) as any as S.Schema<InsightList>;
export class AnalysisReport extends S.Class<AnalysisReport>("AnalysisReport")({
  AnalysisReportId: S.String,
  Identifier: S.optional(S.String),
  ServiceType: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  Insights: S.optional(InsightList),
}) {}
export class GetPerformanceAnalysisReportResponse extends S.Class<GetPerformanceAnalysisReportResponse>(
  "GetPerformanceAnalysisReportResponse",
)({ AnalysisReport: S.optional(AnalysisReport) }, ns) {}

//# Errors
export class InternalServiceError extends S.TaggedError<InternalServiceError>()(
  "InternalServiceError",
  { Message: S.optional(S.String) },
) {}
export class InvalidArgumentException extends S.TaggedError<InvalidArgumentException>()(
  "InvalidArgumentException",
  { Message: S.optional(S.String) },
) {}
export class NotAuthorizedException extends S.TaggedError<NotAuthorizedException>()(
  "NotAuthorizedException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Deletes a performance analysis report.
 */
export const deletePerformanceAnalysisReport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeletePerformanceAnalysisReportRequest,
    output: DeletePerformanceAnalysisReportResponse,
    errors: [
      InternalServiceError,
      InvalidArgumentException,
      NotAuthorizedException,
    ],
  }));
/**
 * Retrieve the metadata for different features. For example, the metadata might indicate
 * that a feature is turned on or off on a specific DB instance.
 */
export const getResourceMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceMetadataRequest,
  output: GetResourceMetadataResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
}));
/**
 * Get the attributes of the specified dimension group for a DB instance or data source. For example, if you specify a SQL ID,
 * `GetDimensionKeyDetails` retrieves the full text of the dimension `db.sql.statement` associated with this ID.
 * This operation is useful because `GetResourceMetrics` and `DescribeDimensionKeys` don't support retrieval of large
 * SQL statement text, lock snapshots, and execution plans.
 */
export const getDimensionKeyDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDimensionKeyDetailsRequest,
    output: GetDimensionKeyDetailsResponse,
    errors: [
      InternalServiceError,
      InvalidArgumentException,
      NotAuthorizedException,
    ],
  }),
);
/**
 * Retrieve metrics of the specified types that can be queried for a specified DB instance.
 */
export const listAvailableResourceMetrics =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAvailableResourceMetricsRequest,
    output: ListAvailableResourceMetricsResponse,
    errors: [
      InternalServiceError,
      InvalidArgumentException,
      NotAuthorizedException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Lists all the analysis reports created for the DB instance. The reports are sorted based on the start time of each report.
 */
export const listPerformanceAnalysisReports =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListPerformanceAnalysisReportsRequest,
    output: ListPerformanceAnalysisReportsResponse,
    errors: [
      InternalServiceError,
      InvalidArgumentException,
      NotAuthorizedException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves all the metadata tags associated with Amazon RDS Performance Insights resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
}));
/**
 * Adds metadata tags to the Amazon RDS Performance Insights resource.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
}));
/**
 * Deletes the metadata tags from the Amazon RDS Performance Insights resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceError,
    InvalidArgumentException,
    NotAuthorizedException,
  ],
}));
/**
 * Creates a new performance analysis report for a specific time period for the
 * DB instance.
 */
export const createPerformanceAnalysisReport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreatePerformanceAnalysisReportRequest,
    output: CreatePerformanceAnalysisReportResponse,
    errors: [
      InternalServiceError,
      InvalidArgumentException,
      NotAuthorizedException,
    ],
  }));
/**
 * For a specific time period, retrieve the top `N` dimension keys for a metric.
 *
 * Each response element returns a maximum of 500 bytes. For larger elements, such as SQL statements,
 * only the first 500 bytes are returned.
 */
export const describeDimensionKeys =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDimensionKeysRequest,
    output: DescribeDimensionKeysResponse,
    errors: [
      InternalServiceError,
      InvalidArgumentException,
      NotAuthorizedException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieve Performance Insights metrics for a set of data sources over a time period. You can provide
 * specific dimension groups and dimensions, and provide filtering criteria for each group. You must specify an aggregate function for
 * each metric.
 *
 * Each response element returns a maximum of 500 bytes. For larger elements, such as SQL statements,
 * only the first 500 bytes are returned.
 */
export const getResourceMetrics = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: GetResourceMetricsRequest,
    output: GetResourceMetricsResponse,
    errors: [
      InternalServiceError,
      InvalidArgumentException,
      NotAuthorizedException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Retrieve the dimensions that can be queried for each specified metric type on a specified DB instance.
 */
export const listAvailableResourceDimensions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListAvailableResourceDimensionsRequest,
    output: ListAvailableResourceDimensionsResponse,
    errors: [
      InternalServiceError,
      InvalidArgumentException,
      NotAuthorizedException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Retrieves the report including the report ID, status, time details, and the insights
 * with recommendations. The report status can be `RUNNING`,
 * `SUCCEEDED`, or `FAILED`. The insights include the
 * `description` and `recommendation` fields.
 */
export const getPerformanceAnalysisReport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetPerformanceAnalysisReportRequest,
    output: GetPerformanceAnalysisReportResponse,
    errors: [
      InternalServiceError,
      InvalidArgumentException,
      NotAuthorizedException,
    ],
  }));
