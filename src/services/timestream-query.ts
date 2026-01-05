import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Timestream Query",
  serviceShapeName: "Timestream_20181101",
});
const auth = T.AwsAuthSigv4({ name: "timestream" });
const ver = T.ServiceVersion("2018-11-01");
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            "aws",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://timestream-query-fips.{Region}.api.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            "aws-us-gov",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://timestream-query.{Region}.api.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://query.timestream-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://query.timestream.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://query.timestream-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            "aws",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://timestream-query.{Region}.api.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            "aws-us-gov",
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://timestream-query.{Region}.api.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://query.timestream.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://query.timestream.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeAccountSettingsRequest extends S.Class<DescribeAccountSettingsRequest>(
  "DescribeAccountSettingsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEndpointsRequest extends S.Class<DescribeEndpointsRequest>(
  "DescribeEndpointsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagKeyList = S.Array(S.String);
export class CancelQueryRequest extends S.Class<CancelQueryRequest>(
  "CancelQueryRequest",
)(
  { QueryId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteScheduledQueryRequest extends S.Class<DeleteScheduledQueryRequest>(
  "DeleteScheduledQueryRequest",
)(
  { ScheduledQueryArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteScheduledQueryResponse extends S.Class<DeleteScheduledQueryResponse>(
  "DeleteScheduledQueryResponse",
)({}) {}
export class DescribeScheduledQueryRequest extends S.Class<DescribeScheduledQueryRequest>(
  "DescribeScheduledQueryRequest",
)(
  { ScheduledQueryArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListScheduledQueriesRequest extends S.Class<ListScheduledQueriesRequest>(
  "ListScheduledQueriesRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    ResourceARN: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PrepareQueryRequest extends S.Class<PrepareQueryRequest>(
  "PrepareQueryRequest",
)(
  { QueryString: S.String, ValidateOnly: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const TagList = S.Array(Tag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateScheduledQueryRequest extends S.Class<UpdateScheduledQueryRequest>(
  "UpdateScheduledQueryRequest",
)(
  { ScheduledQueryArn: S.String, State: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateScheduledQueryResponse extends S.Class<UpdateScheduledQueryResponse>(
  "UpdateScheduledQueryResponse",
)({}) {}
export class ScheduleConfiguration extends S.Class<ScheduleConfiguration>(
  "ScheduleConfiguration",
)({ ScheduleExpression: S.String }) {}
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  Address: S.String,
  CachePeriodInMinutes: S.Number,
}) {}
export const Endpoints = S.Array(Endpoint);
export class ScheduledQueryInsights extends S.Class<ScheduledQueryInsights>(
  "ScheduledQueryInsights",
)({ Mode: S.String }) {}
export class QueryInsights extends S.Class<QueryInsights>("QueryInsights")({
  Mode: S.String,
}) {}
export class CancelQueryResponse extends S.Class<CancelQueryResponse>(
  "CancelQueryResponse",
)({ CancellationMessage: S.optional(S.String) }) {}
export class DescribeEndpointsResponse extends S.Class<DescribeEndpointsResponse>(
  "DescribeEndpointsResponse",
)({ Endpoints: Endpoints }) {}
export class ExecuteScheduledQueryRequest extends S.Class<ExecuteScheduledQueryRequest>(
  "ExecuteScheduledQueryRequest",
)(
  {
    ScheduledQueryArn: S.String,
    InvocationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ClientToken: S.optional(S.String),
    QueryInsights: S.optional(ScheduledQueryInsights),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExecuteScheduledQueryResponse extends S.Class<ExecuteScheduledQueryResponse>(
  "ExecuteScheduledQueryResponse",
)({}) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: TagList, NextToken: S.optional(S.String) }) {}
export class QueryRequest extends S.Class<QueryRequest>("QueryRequest")(
  {
    QueryString: S.String,
    ClientToken: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxRows: S.optional(S.Number),
    QueryInsights: S.optional(QueryInsights),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SnsConfiguration extends S.Class<SnsConfiguration>(
  "SnsConfiguration",
)({ TopicArn: S.String }) {}
export class S3Configuration extends S.Class<S3Configuration>(
  "S3Configuration",
)({
  BucketName: S.String,
  ObjectKeyPrefix: S.optional(S.String),
  EncryptionOption: S.optional(S.String),
}) {}
export class ExecutionStats extends S.Class<ExecutionStats>("ExecutionStats")({
  ExecutionTimeInMillis: S.optional(S.Number),
  DataWrites: S.optional(S.Number),
  BytesMetered: S.optional(S.Number),
  CumulativeBytesScanned: S.optional(S.Number),
  RecordsIngested: S.optional(S.Number),
  QueryResultRows: S.optional(S.Number),
}) {}
export const PartitionKeyList = S.Array(S.String);
export class QuerySpatialCoverageMax extends S.Class<QuerySpatialCoverageMax>(
  "QuerySpatialCoverageMax",
)({
  Value: S.optional(S.Number),
  TableArn: S.optional(S.String),
  PartitionKey: S.optional(PartitionKeyList),
}) {}
export class QuerySpatialCoverage extends S.Class<QuerySpatialCoverage>(
  "QuerySpatialCoverage",
)({ Max: S.optional(QuerySpatialCoverageMax) }) {}
export class QueryTemporalRangeMax extends S.Class<QueryTemporalRangeMax>(
  "QueryTemporalRangeMax",
)({ Value: S.optional(S.Number), TableArn: S.optional(S.String) }) {}
export class QueryTemporalRange extends S.Class<QueryTemporalRange>(
  "QueryTemporalRange",
)({ Max: S.optional(QueryTemporalRangeMax) }) {}
export class ScheduledQueryInsightsResponse extends S.Class<ScheduledQueryInsightsResponse>(
  "ScheduledQueryInsightsResponse",
)({
  QuerySpatialCoverage: S.optional(QuerySpatialCoverage),
  QueryTemporalRange: S.optional(QueryTemporalRange),
  QueryTableCount: S.optional(S.Number),
  OutputRows: S.optional(S.Number),
  OutputBytes: S.optional(S.Number),
}) {}
export class S3ReportLocation extends S.Class<S3ReportLocation>(
  "S3ReportLocation",
)({ BucketName: S.optional(S.String), ObjectKey: S.optional(S.String) }) {}
export class ErrorReportLocation extends S.Class<ErrorReportLocation>(
  "ErrorReportLocation",
)({ S3ReportLocation: S.optional(S3ReportLocation) }) {}
export class ScheduledQueryRunSummary extends S.Class<ScheduledQueryRunSummary>(
  "ScheduledQueryRunSummary",
)({
  InvocationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TriggerTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RunStatus: S.optional(S.String),
  ExecutionStats: S.optional(ExecutionStats),
  QueryInsightsResponse: S.optional(ScheduledQueryInsightsResponse),
  ErrorReportLocation: S.optional(ErrorReportLocation),
  FailureReason: S.optional(S.String),
}) {}
export const ScheduledQueryRunSummaryList = S.Array(ScheduledQueryRunSummary);
export class AccountSettingsNotificationConfiguration extends S.Class<AccountSettingsNotificationConfiguration>(
  "AccountSettingsNotificationConfiguration",
)({ SnsConfiguration: S.optional(SnsConfiguration), RoleArn: S.String }) {}
export class ProvisionedCapacityRequest extends S.Class<ProvisionedCapacityRequest>(
  "ProvisionedCapacityRequest",
)({
  TargetQueryTCU: S.Number,
  NotificationConfiguration: S.optional(
    AccountSettingsNotificationConfiguration,
  ),
}) {}
export class NotificationConfiguration extends S.Class<NotificationConfiguration>(
  "NotificationConfiguration",
)({ SnsConfiguration: SnsConfiguration }) {}
export class ErrorReportConfiguration extends S.Class<ErrorReportConfiguration>(
  "ErrorReportConfiguration",
)({ S3Configuration: S3Configuration }) {}
export class Type extends S.Class<Type>("Type")({
  ScalarType: S.optional(S.String),
  ArrayColumnInfo: S.optional(
    S.suspend((): S.Schema<ColumnInfo, any> => ColumnInfo),
  ),
  TimeSeriesMeasureValueColumnInfo: S.optional(
    S.suspend((): S.Schema<ColumnInfo, any> => ColumnInfo),
  ),
  RowColumnInfo: S.optional(S.suspend(() => ColumnInfoList)),
}) {}
export class ParameterMapping extends S.Class<ParameterMapping>(
  "ParameterMapping",
)({ Name: S.String, Type: Type }) {}
export const ParameterMappingList = S.Array(ParameterMapping);
export class QueryComputeRequest extends S.Class<QueryComputeRequest>(
  "QueryComputeRequest",
)({
  ComputeMode: S.optional(S.String),
  ProvisionedCapacity: S.optional(ProvisionedCapacityRequest),
}) {}
export class DimensionMapping extends S.Class<DimensionMapping>(
  "DimensionMapping",
)({ Name: S.String, DimensionValueType: S.String }) {}
export const DimensionMappingList = S.Array(DimensionMapping);
export class MultiMeasureAttributeMapping extends S.Class<MultiMeasureAttributeMapping>(
  "MultiMeasureAttributeMapping",
)({
  SourceColumn: S.String,
  TargetMultiMeasureAttributeName: S.optional(S.String),
  MeasureValueType: S.String,
}) {}
export const MultiMeasureAttributeMappingList = S.Array(
  MultiMeasureAttributeMapping,
);
export class MixedMeasureMapping extends S.Class<MixedMeasureMapping>(
  "MixedMeasureMapping",
)({
  MeasureName: S.optional(S.String),
  SourceColumn: S.optional(S.String),
  TargetMeasureName: S.optional(S.String),
  MeasureValueType: S.String,
  MultiMeasureAttributeMappings: S.optional(MultiMeasureAttributeMappingList),
}) {}
export const MixedMeasureMappingList = S.Array(MixedMeasureMapping);
export class LastUpdate extends S.Class<LastUpdate>("LastUpdate")({
  TargetQueryTCU: S.optional(S.Number),
  Status: S.optional(S.String),
  StatusMessage: S.optional(S.String),
}) {}
export class UpdateAccountSettingsRequest extends S.Class<UpdateAccountSettingsRequest>(
  "UpdateAccountSettingsRequest",
)(
  {
    MaxQueryTCU: S.optional(S.Number),
    QueryPricingModel: S.optional(S.String),
    QueryCompute: S.optional(QueryComputeRequest),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ProvisionedCapacityResponse extends S.Class<ProvisionedCapacityResponse>(
  "ProvisionedCapacityResponse",
)({
  ActiveQueryTCU: S.optional(S.Number),
  NotificationConfiguration: S.optional(
    AccountSettingsNotificationConfiguration,
  ),
  LastUpdate: S.optional(LastUpdate),
}) {}
export class QueryComputeResponse extends S.Class<QueryComputeResponse>(
  "QueryComputeResponse",
)({
  ComputeMode: S.optional(S.String),
  ProvisionedCapacity: S.optional(ProvisionedCapacityResponse),
}) {}
export class SelectColumn extends S.Class<SelectColumn>("SelectColumn")({
  Name: S.optional(S.String),
  Type: S.optional(Type),
  DatabaseName: S.optional(S.String),
  TableName: S.optional(S.String),
  Aliased: S.optional(S.Boolean),
}) {}
export const SelectColumnList = S.Array(SelectColumn);
export class ColumnInfo extends S.Class<ColumnInfo>("ColumnInfo")({
  Name: S.optional(S.String),
  Type: S.suspend((): S.Schema<Type, any> => Type),
}) {}
export type ColumnInfoList = ColumnInfo[];
export const ColumnInfoList = S.Array(
  S.suspend((): S.Schema<ColumnInfo, any> => ColumnInfo),
) as any as S.Schema<ColumnInfoList>;
export class QueryStatus extends S.Class<QueryStatus>("QueryStatus")({
  ProgressPercentage: S.optional(S.Number),
  CumulativeBytesScanned: S.optional(S.Number),
  CumulativeBytesMetered: S.optional(S.Number),
}) {}
export class MultiMeasureMappings extends S.Class<MultiMeasureMappings>(
  "MultiMeasureMappings",
)({
  TargetMultiMeasureName: S.optional(S.String),
  MultiMeasureAttributeMappings: MultiMeasureAttributeMappingList,
}) {}
export class TimestreamDestination extends S.Class<TimestreamDestination>(
  "TimestreamDestination",
)({ DatabaseName: S.optional(S.String), TableName: S.optional(S.String) }) {}
export class DescribeAccountSettingsResponse extends S.Class<DescribeAccountSettingsResponse>(
  "DescribeAccountSettingsResponse",
)({
  MaxQueryTCU: S.optional(S.Number),
  QueryPricingModel: S.optional(S.String),
  QueryCompute: S.optional(QueryComputeResponse),
}) {}
export class PrepareQueryResponse extends S.Class<PrepareQueryResponse>(
  "PrepareQueryResponse",
)({
  QueryString: S.String,
  Columns: SelectColumnList,
  Parameters: ParameterMappingList,
}) {}
export class UpdateAccountSettingsResponse extends S.Class<UpdateAccountSettingsResponse>(
  "UpdateAccountSettingsResponse",
)({
  MaxQueryTCU: S.optional(S.Number),
  QueryPricingModel: S.optional(S.String),
  QueryCompute: S.optional(QueryComputeResponse),
}) {}
export class TimestreamConfiguration extends S.Class<TimestreamConfiguration>(
  "TimestreamConfiguration",
)({
  DatabaseName: S.String,
  TableName: S.String,
  TimeColumn: S.String,
  DimensionMappings: DimensionMappingList,
  MultiMeasureMappings: S.optional(MultiMeasureMappings),
  MixedMeasureMappings: S.optional(MixedMeasureMappingList),
  MeasureNameColumn: S.optional(S.String),
}) {}
export class TargetDestination extends S.Class<TargetDestination>(
  "TargetDestination",
)({ TimestreamDestination: S.optional(TimestreamDestination) }) {}
export class TargetConfiguration extends S.Class<TargetConfiguration>(
  "TargetConfiguration",
)({ TimestreamConfiguration: TimestreamConfiguration }) {}
export class ScheduledQuery extends S.Class<ScheduledQuery>("ScheduledQuery")({
  Arn: S.String,
  Name: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.String,
  PreviousInvocationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  NextInvocationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ErrorReportConfiguration: S.optional(ErrorReportConfiguration),
  TargetDestination: S.optional(TargetDestination),
  LastRunStatus: S.optional(S.String),
}) {}
export const ScheduledQueryList = S.Array(ScheduledQuery);
export class TimeSeriesDataPoint extends S.Class<TimeSeriesDataPoint>(
  "TimeSeriesDataPoint",
)({ Time: S.String, Value: S.suspend((): S.Schema<Datum, any> => Datum) }) {}
export type TimeSeriesDataPointList = TimeSeriesDataPoint[];
export const TimeSeriesDataPointList = S.Array(
  S.suspend((): S.Schema<TimeSeriesDataPoint, any> => TimeSeriesDataPoint),
) as any as S.Schema<TimeSeriesDataPointList>;
export class CreateScheduledQueryRequest extends S.Class<CreateScheduledQueryRequest>(
  "CreateScheduledQueryRequest",
)(
  {
    Name: S.String,
    QueryString: S.String,
    ScheduleConfiguration: ScheduleConfiguration,
    NotificationConfiguration: NotificationConfiguration,
    TargetConfiguration: S.optional(TargetConfiguration),
    ClientToken: S.optional(S.String),
    ScheduledQueryExecutionRoleArn: S.String,
    Tags: S.optional(TagList),
    KmsKeyId: S.optional(S.String),
    ErrorReportConfiguration: ErrorReportConfiguration,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListScheduledQueriesResponse extends S.Class<ListScheduledQueriesResponse>(
  "ListScheduledQueriesResponse",
)({ ScheduledQueries: ScheduledQueryList, NextToken: S.optional(S.String) }) {}
export class Datum extends S.Class<Datum>("Datum")({
  ScalarValue: S.optional(S.String),
  TimeSeriesValue: S.optional(S.suspend(() => TimeSeriesDataPointList)),
  ArrayValue: S.optional(S.suspend(() => DatumList)),
  RowValue: S.optional(S.suspend((): S.Schema<Row, any> => Row)),
  NullValue: S.optional(S.Boolean),
}) {}
export type DatumList = Datum[];
export const DatumList = S.Array(
  S.suspend((): S.Schema<Datum, any> => Datum),
) as any as S.Schema<DatumList>;
export class ScheduledQueryDescription extends S.Class<ScheduledQueryDescription>(
  "ScheduledQueryDescription",
)({
  Arn: S.String,
  Name: S.String,
  QueryString: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.String,
  PreviousInvocationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  NextInvocationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ScheduleConfiguration: ScheduleConfiguration,
  NotificationConfiguration: NotificationConfiguration,
  TargetConfiguration: S.optional(TargetConfiguration),
  ScheduledQueryExecutionRoleArn: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  ErrorReportConfiguration: S.optional(ErrorReportConfiguration),
  LastRunSummary: S.optional(ScheduledQueryRunSummary),
  RecentlyFailedRuns: S.optional(ScheduledQueryRunSummaryList),
}) {}
export class Row extends S.Class<Row>("Row")({
  Data: S.suspend(() => DatumList),
}) {}
export const RowList = S.Array(S.suspend((): S.Schema<Row, any> => Row));
export class QueryInsightsResponse extends S.Class<QueryInsightsResponse>(
  "QueryInsightsResponse",
)({
  QuerySpatialCoverage: S.optional(QuerySpatialCoverage),
  QueryTemporalRange: S.optional(QueryTemporalRange),
  QueryTableCount: S.optional(S.Number),
  OutputRows: S.optional(S.Number),
  OutputBytes: S.optional(S.Number),
  UnloadPartitionCount: S.optional(S.Number),
  UnloadWrittenRows: S.optional(S.Number),
  UnloadWrittenBytes: S.optional(S.Number),
}) {}
export class CreateScheduledQueryResponse extends S.Class<CreateScheduledQueryResponse>(
  "CreateScheduledQueryResponse",
)({ Arn: S.String }) {}
export class DescribeScheduledQueryResponse extends S.Class<DescribeScheduledQueryResponse>(
  "DescribeScheduledQueryResponse",
)({ ScheduledQuery: ScheduledQueryDescription }) {}
export class QueryResponse extends S.Class<QueryResponse>("QueryResponse")({
  QueryId: S.String,
  NextToken: S.optional(S.String),
  Rows: RowList,
  ColumnInfo: ColumnInfoList,
  QueryStatus: S.optional(QueryStatus),
  QueryInsightsResponse: S.optional(QueryInsightsResponse),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
  T.AwsQueryError({ code: "AccessDenied", httpResponseCode: 403 }),
) {}
export class InvalidEndpointException extends S.TaggedError<InvalidEndpointException>()(
  "InvalidEndpointException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ScheduledQueryArn: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class QueryExecutionException extends S.TaggedError<QueryExecutionException>()(
  "QueryExecutionException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Describes the settings for your account that include the query pricing model and the configured maximum TCUs the service can use for your query workload.
 *
 * You're charged only for the duration of compute units used for your workloads.
 */
export const describeAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAccountSettingsRequest,
    output: DescribeAccountSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidEndpointException,
      ThrottlingException,
    ],
  }),
);
/**
 * DescribeEndpoints returns a list of available endpoints to make Timestream
 * API calls against. This API is available through both Write and Query.
 *
 * Because the Timestream SDKs are designed to transparently work with the
 * service’s architecture, including the management and mapping of the service endpoints,
 * *it is not recommended that you use this API unless*:
 *
 * - You are using VPC endpoints (Amazon Web Services PrivateLink) with Timestream
 *
 * - Your application uses a programming language that does not yet have SDK
 * support
 *
 * - You require better control over the client-side implementation
 *
 * For detailed information on how and when to use and implement DescribeEndpoints, see
 * The Endpoint Discovery Pattern.
 */
export const describeEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEndpointsRequest,
  output: DescribeEndpointsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * You can use this API to run a scheduled query manually.
 *
 * If you enabled `QueryInsights`, this API also returns insights and metrics related to the query that you executed as part of an Amazon SNS notification. `QueryInsights` helps with performance tuning of your query. For more information about `QueryInsights`, see Using query insights to optimize queries in Amazon Timestream.
 */
export const executeScheduledQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ExecuteScheduledQueryRequest,
    output: ExecuteScheduledQueryResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidEndpointException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Update a scheduled query.
 */
export const updateScheduledQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateScheduledQueryRequest,
    output: UpdateScheduledQueryResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidEndpointException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Cancels a query that has been issued. Cancellation is provided only if the query has
 * not completed running before the cancellation request was issued. Because cancellation
 * is an idempotent operation, subsequent cancellation requests will return a
 * `CancellationMessage`, indicating that the query has already been
 * canceled. See code
 * sample for details.
 */
export const cancelQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelQueryRequest,
  output: CancelQueryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidEndpointException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the association of tags from a Timestream query resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidEndpointException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List all tags on a Timestream query resource.
 */
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListTagsForResourceRequest,
    output: ListTagsForResourceResponse,
    errors: [
      InvalidEndpointException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Tags",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Deletes a given scheduled query. This is an irreversible operation.
 */
export const deleteScheduledQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteScheduledQueryRequest,
    output: DeleteScheduledQueryResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidEndpointException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * A synchronous operation that allows you to submit a query with parameters to be stored
 * by Timestream for later running. Timestream only supports using this operation with
 * `ValidateOnly` set to `true`.
 */
export const prepareQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PrepareQueryRequest,
  output: PrepareQueryResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidEndpointException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Associate a set of tags with a Timestream resource. You can then activate these
 * user-defined tags so that they appear on the Billing and Cost Management console for
 * cost allocation tracking.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidEndpointException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Transitions your account to use TCUs for query pricing and modifies the maximum query compute units that you've configured. If you reduce the value of `MaxQueryTCU` to a desired configuration, the new value can take up to 24 hours to be effective.
 *
 * After you've transitioned your account to use TCUs for query pricing, you can't transition to using bytes scanned for query pricing.
 */
export const updateAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateAccountSettingsRequest,
    output: UpdateAccountSettingsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidEndpointException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Gets a list of all scheduled queries in the caller's Amazon account and Region.
 * `ListScheduledQueries` is eventually consistent.
 */
export const listScheduledQueries =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListScheduledQueriesRequest,
    output: ListScheduledQueriesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidEndpointException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "ScheduledQueries",
      pageSize: "MaxResults",
    } as const,
  }));
/**
 * Provides detailed information about a scheduled query.
 */
export const describeScheduledQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeScheduledQueryRequest,
    output: DescribeScheduledQueryResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidEndpointException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Create a scheduled query that will be run on your behalf at the configured schedule.
 * Timestream assumes the execution role provided as part of the
 * `ScheduledQueryExecutionRoleArn` parameter to run the query. You can use
 * the `NotificationConfiguration` parameter to configure notification for your
 * scheduled query operations.
 */
export const createScheduledQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateScheduledQueryRequest,
    output: CreateScheduledQueryResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      InvalidEndpointException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * `Query` is a synchronous operation that enables you to run a query against
 * your Amazon Timestream data.
 *
 * If you enabled `QueryInsights`, this API also returns insights and metrics related to the query that you executed. `QueryInsights` helps with performance tuning of your query. For more information about `QueryInsights`, see Using query insights to optimize queries in Amazon Timestream.
 *
 * The maximum number of `Query` API requests you're allowed to make with `QueryInsights` enabled is 1 query per second (QPS). If you exceed this query rate, it might result in throttling.
 *
 * `Query` will time out after 60 seconds.
 * You must update the default timeout in the SDK to support a timeout of 60 seconds. See
 * the code
 * sample for details.
 *
 * Your query request will fail in the following cases:
 *
 * - If you submit a `Query` request with the same client token outside
 * of the 5-minute idempotency window.
 *
 * - If you submit a `Query` request with the same client token, but
 * change other parameters, within the 5-minute idempotency window.
 *
 * - If the size of the row (including the query metadata) exceeds 1 MB, then the
 * query will fail with the following error message:
 *
 * Query aborted as max page response size has been exceeded by the output
 * result row
 *
 * - If the IAM principal of the query initiator and the result reader are not the
 * same and/or the query initiator and the result reader do not have the same query
 * string in the query requests, the query will fail with an Invalid
 * pagination token error.
 */
export const query = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: QueryRequest,
  output: QueryResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidEndpointException,
    QueryExecutionException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Rows",
    pageSize: "MaxRows",
  } as const,
}));
