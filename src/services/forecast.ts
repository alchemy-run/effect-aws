import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "forecast",
  serviceShapeName: "AmazonForecast",
});
const auth = T.AwsAuthSigv4({ name: "forecast" });
const ver = T.ServiceVersion("2018-06-26");
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
                        url: "https://forecast-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://forecast-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://forecast.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://forecast.{Region}.{PartitionResult#dnsSuffix}",
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
export const ForecastTypes = S.Array(S.String);
export const ForecastDimensions = S.Array(S.String);
export const ArnList = S.Array(S.String);
export const WhatIfForecastArnListForExport = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.String,
  Value: S.String,
}) {}
export const Tags = S.Array(Tag);
export class CreateDatasetGroupRequest extends S.Class<CreateDatasetGroupRequest>(
  "CreateDatasetGroupRequest",
)(
  {
    DatasetGroupName: S.String,
    Domain: S.String,
    DatasetArns: S.optional(ArnList),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class S3Config extends S.Class<S3Config>("S3Config")({
  Path: S.String,
  RoleArn: S.String,
  KMSKeyArn: S.optional(S.String),
}) {}
export class DataDestination extends S.Class<DataDestination>(
  "DataDestination",
)({ S3Config: S3Config }) {}
export class CreateForecastExportJobRequest extends S.Class<CreateForecastExportJobRequest>(
  "CreateForecastExportJobRequest",
)(
  {
    ForecastExportJobName: S.String,
    ForecastArn: S.String,
    Destination: DataDestination,
    Tags: S.optional(Tags),
    Format: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateMonitorRequest extends S.Class<CreateMonitorRequest>(
  "CreateMonitorRequest",
)(
  { MonitorName: S.String, ResourceArn: S.String, Tags: S.optional(Tags) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePredictorBacktestExportJobRequest extends S.Class<CreatePredictorBacktestExportJobRequest>(
  "CreatePredictorBacktestExportJobRequest",
)(
  {
    PredictorBacktestExportJobName: S.String,
    PredictorArn: S.String,
    Destination: DataDestination,
    Tags: S.optional(Tags),
    Format: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DataSource extends S.Class<DataSource>("DataSource")({
  S3Config: S3Config,
}) {}
export class SchemaAttribute extends S.Class<SchemaAttribute>(
  "SchemaAttribute",
)({
  AttributeName: S.optional(S.String),
  AttributeType: S.optional(S.String),
}) {}
export const SchemaAttributes = S.Array(SchemaAttribute);
export class Schema extends S.Class<Schema>("Schema")({
  Attributes: S.optional(SchemaAttributes),
}) {}
export class TimeSeriesIdentifiers extends S.Class<TimeSeriesIdentifiers>(
  "TimeSeriesIdentifiers",
)({
  DataSource: S.optional(DataSource),
  Schema: S.optional(Schema),
  Format: S.optional(S.String),
}) {}
export class TimeSeriesSelector extends S.Class<TimeSeriesSelector>(
  "TimeSeriesSelector",
)({ TimeSeriesIdentifiers: S.optional(TimeSeriesIdentifiers) }) {}
export class CreateWhatIfAnalysisRequest extends S.Class<CreateWhatIfAnalysisRequest>(
  "CreateWhatIfAnalysisRequest",
)(
  {
    WhatIfAnalysisName: S.String,
    ForecastArn: S.String,
    TimeSeriesSelector: S.optional(TimeSeriesSelector),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateWhatIfForecastExportRequest extends S.Class<CreateWhatIfForecastExportRequest>(
  "CreateWhatIfForecastExportRequest",
)(
  {
    WhatIfForecastExportName: S.String,
    WhatIfForecastArns: WhatIfForecastArnListForExport,
    Destination: DataDestination,
    Tags: S.optional(Tags),
    Format: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDatasetRequest extends S.Class<DeleteDatasetRequest>(
  "DeleteDatasetRequest",
)(
  { DatasetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDatasetResponse extends S.Class<DeleteDatasetResponse>(
  "DeleteDatasetResponse",
)({}) {}
export class DeleteDatasetGroupRequest extends S.Class<DeleteDatasetGroupRequest>(
  "DeleteDatasetGroupRequest",
)(
  { DatasetGroupArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDatasetGroupResponse extends S.Class<DeleteDatasetGroupResponse>(
  "DeleteDatasetGroupResponse",
)({}) {}
export class DeleteDatasetImportJobRequest extends S.Class<DeleteDatasetImportJobRequest>(
  "DeleteDatasetImportJobRequest",
)(
  { DatasetImportJobArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDatasetImportJobResponse extends S.Class<DeleteDatasetImportJobResponse>(
  "DeleteDatasetImportJobResponse",
)({}) {}
export class DeleteExplainabilityRequest extends S.Class<DeleteExplainabilityRequest>(
  "DeleteExplainabilityRequest",
)(
  { ExplainabilityArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteExplainabilityResponse extends S.Class<DeleteExplainabilityResponse>(
  "DeleteExplainabilityResponse",
)({}) {}
export class DeleteExplainabilityExportRequest extends S.Class<DeleteExplainabilityExportRequest>(
  "DeleteExplainabilityExportRequest",
)(
  { ExplainabilityExportArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteExplainabilityExportResponse extends S.Class<DeleteExplainabilityExportResponse>(
  "DeleteExplainabilityExportResponse",
)({}) {}
export class DeleteForecastRequest extends S.Class<DeleteForecastRequest>(
  "DeleteForecastRequest",
)(
  { ForecastArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteForecastResponse extends S.Class<DeleteForecastResponse>(
  "DeleteForecastResponse",
)({}) {}
export class DeleteForecastExportJobRequest extends S.Class<DeleteForecastExportJobRequest>(
  "DeleteForecastExportJobRequest",
)(
  { ForecastExportJobArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteForecastExportJobResponse extends S.Class<DeleteForecastExportJobResponse>(
  "DeleteForecastExportJobResponse",
)({}) {}
export class DeleteMonitorRequest extends S.Class<DeleteMonitorRequest>(
  "DeleteMonitorRequest",
)(
  { MonitorArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMonitorResponse extends S.Class<DeleteMonitorResponse>(
  "DeleteMonitorResponse",
)({}) {}
export class DeletePredictorRequest extends S.Class<DeletePredictorRequest>(
  "DeletePredictorRequest",
)(
  { PredictorArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePredictorResponse extends S.Class<DeletePredictorResponse>(
  "DeletePredictorResponse",
)({}) {}
export class DeletePredictorBacktestExportJobRequest extends S.Class<DeletePredictorBacktestExportJobRequest>(
  "DeletePredictorBacktestExportJobRequest",
)(
  { PredictorBacktestExportJobArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePredictorBacktestExportJobResponse extends S.Class<DeletePredictorBacktestExportJobResponse>(
  "DeletePredictorBacktestExportJobResponse",
)({}) {}
export class DeleteResourceTreeRequest extends S.Class<DeleteResourceTreeRequest>(
  "DeleteResourceTreeRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourceTreeResponse extends S.Class<DeleteResourceTreeResponse>(
  "DeleteResourceTreeResponse",
)({}) {}
export class DeleteWhatIfAnalysisRequest extends S.Class<DeleteWhatIfAnalysisRequest>(
  "DeleteWhatIfAnalysisRequest",
)(
  { WhatIfAnalysisArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWhatIfAnalysisResponse extends S.Class<DeleteWhatIfAnalysisResponse>(
  "DeleteWhatIfAnalysisResponse",
)({}) {}
export class DeleteWhatIfForecastRequest extends S.Class<DeleteWhatIfForecastRequest>(
  "DeleteWhatIfForecastRequest",
)(
  { WhatIfForecastArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWhatIfForecastResponse extends S.Class<DeleteWhatIfForecastResponse>(
  "DeleteWhatIfForecastResponse",
)({}) {}
export class DeleteWhatIfForecastExportRequest extends S.Class<DeleteWhatIfForecastExportRequest>(
  "DeleteWhatIfForecastExportRequest",
)(
  { WhatIfForecastExportArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWhatIfForecastExportResponse extends S.Class<DeleteWhatIfForecastExportResponse>(
  "DeleteWhatIfForecastExportResponse",
)({}) {}
export class DescribeAutoPredictorRequest extends S.Class<DescribeAutoPredictorRequest>(
  "DescribeAutoPredictorRequest",
)(
  { PredictorArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDatasetRequest extends S.Class<DescribeDatasetRequest>(
  "DescribeDatasetRequest",
)(
  { DatasetArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDatasetGroupRequest extends S.Class<DescribeDatasetGroupRequest>(
  "DescribeDatasetGroupRequest",
)(
  { DatasetGroupArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDatasetImportJobRequest extends S.Class<DescribeDatasetImportJobRequest>(
  "DescribeDatasetImportJobRequest",
)(
  { DatasetImportJobArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExplainabilityRequest extends S.Class<DescribeExplainabilityRequest>(
  "DescribeExplainabilityRequest",
)(
  { ExplainabilityArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExplainabilityExportRequest extends S.Class<DescribeExplainabilityExportRequest>(
  "DescribeExplainabilityExportRequest",
)(
  { ExplainabilityExportArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeForecastRequest extends S.Class<DescribeForecastRequest>(
  "DescribeForecastRequest",
)(
  { ForecastArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeForecastExportJobRequest extends S.Class<DescribeForecastExportJobRequest>(
  "DescribeForecastExportJobRequest",
)(
  { ForecastExportJobArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMonitorRequest extends S.Class<DescribeMonitorRequest>(
  "DescribeMonitorRequest",
)(
  { MonitorArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePredictorRequest extends S.Class<DescribePredictorRequest>(
  "DescribePredictorRequest",
)(
  { PredictorArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribePredictorBacktestExportJobRequest extends S.Class<DescribePredictorBacktestExportJobRequest>(
  "DescribePredictorBacktestExportJobRequest",
)(
  { PredictorBacktestExportJobArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeWhatIfAnalysisRequest extends S.Class<DescribeWhatIfAnalysisRequest>(
  "DescribeWhatIfAnalysisRequest",
)(
  { WhatIfAnalysisArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeWhatIfForecastRequest extends S.Class<DescribeWhatIfForecastRequest>(
  "DescribeWhatIfForecastRequest",
)(
  { WhatIfForecastArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeWhatIfForecastExportRequest extends S.Class<DescribeWhatIfForecastExportRequest>(
  "DescribeWhatIfForecastExportRequest",
)(
  { WhatIfForecastExportArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetAccuracyMetricsRequest extends S.Class<GetAccuracyMetricsRequest>(
  "GetAccuracyMetricsRequest",
)(
  { PredictorArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDatasetGroupsRequest extends S.Class<ListDatasetGroupsRequest>(
  "ListDatasetGroupsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDatasetsRequest extends S.Class<ListDatasetsRequest>(
  "ListDatasetsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Filter extends S.Class<Filter>("Filter")({
  Key: S.String,
  Value: S.String,
  Condition: S.String,
}) {}
export const Filters = S.Array(Filter);
export class ListExplainabilitiesRequest extends S.Class<ListExplainabilitiesRequest>(
  "ListExplainabilitiesRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListExplainabilityExportsRequest extends S.Class<ListExplainabilityExportsRequest>(
  "ListExplainabilityExportsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListForecastExportJobsRequest extends S.Class<ListForecastExportJobsRequest>(
  "ListForecastExportJobsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListForecastsRequest extends S.Class<ListForecastsRequest>(
  "ListForecastsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMonitorEvaluationsRequest extends S.Class<ListMonitorEvaluationsRequest>(
  "ListMonitorEvaluationsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    MonitorArn: S.String,
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListMonitorsRequest extends S.Class<ListMonitorsRequest>(
  "ListMonitorsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPredictorBacktestExportJobsRequest extends S.Class<ListPredictorBacktestExportJobsRequest>(
  "ListPredictorBacktestExportJobsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPredictorsRequest extends S.Class<ListPredictorsRequest>(
  "ListPredictorsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWhatIfAnalysesRequest extends S.Class<ListWhatIfAnalysesRequest>(
  "ListWhatIfAnalysesRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWhatIfForecastExportsRequest extends S.Class<ListWhatIfForecastExportsRequest>(
  "ListWhatIfForecastExportsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWhatIfForecastsRequest extends S.Class<ListWhatIfForecastsRequest>(
  "ListWhatIfForecastsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResumeResourceRequest extends S.Class<ResumeResourceRequest>(
  "ResumeResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResumeResourceResponse extends S.Class<ResumeResourceResponse>(
  "ResumeResourceResponse",
)({}) {}
export class StopResourceRequest extends S.Class<StopResourceRequest>(
  "StopResourceRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopResourceResponse extends S.Class<StopResourceResponse>(
  "StopResourceResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, Tags: Tags },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagKeys: TagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateDatasetGroupRequest extends S.Class<UpdateDatasetGroupRequest>(
  "UpdateDatasetGroupRequest",
)(
  { DatasetGroupArn: S.String, DatasetArns: ArnList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDatasetGroupResponse extends S.Class<UpdateDatasetGroupResponse>(
  "UpdateDatasetGroupResponse",
)({}) {}
export class EncryptionConfig extends S.Class<EncryptionConfig>(
  "EncryptionConfig",
)({ RoleArn: S.String, KMSKeyArn: S.String }) {}
export class MonitorConfig extends S.Class<MonitorConfig>("MonitorConfig")({
  MonitorName: S.String,
}) {}
export class TimeAlignmentBoundary extends S.Class<TimeAlignmentBoundary>(
  "TimeAlignmentBoundary",
)({
  Month: S.optional(S.String),
  DayOfMonth: S.optional(S.Number),
  DayOfWeek: S.optional(S.String),
  Hour: S.optional(S.Number),
}) {}
export class ExplainabilityConfig extends S.Class<ExplainabilityConfig>(
  "ExplainabilityConfig",
)({ TimeSeriesGranularity: S.String, TimePointGranularity: S.String }) {}
export const TrainingParameters = S.Record({ key: S.String, value: S.String });
export class EvaluationParameters extends S.Class<EvaluationParameters>(
  "EvaluationParameters",
)({
  NumberOfBacktestWindows: S.optional(S.Number),
  BackTestWindowOffset: S.optional(S.Number),
}) {}
export class TimeSeriesReplacementsDataSource extends S.Class<TimeSeriesReplacementsDataSource>(
  "TimeSeriesReplacementsDataSource",
)({
  S3Config: S3Config,
  Schema: Schema,
  Format: S.optional(S.String),
  TimestampFormat: S.optional(S.String),
}) {}
export const LongArnList = S.Array(S.String);
export class CreateDatasetGroupResponse extends S.Class<CreateDatasetGroupResponse>(
  "CreateDatasetGroupResponse",
)({ DatasetGroupArn: S.optional(S.String) }) {}
export class CreateExplainabilityRequest extends S.Class<CreateExplainabilityRequest>(
  "CreateExplainabilityRequest",
)(
  {
    ExplainabilityName: S.String,
    ResourceArn: S.String,
    ExplainabilityConfig: ExplainabilityConfig,
    DataSource: S.optional(DataSource),
    Schema: S.optional(Schema),
    EnableVisualization: S.optional(S.Boolean),
    StartDateTime: S.optional(S.String),
    EndDateTime: S.optional(S.String),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateExplainabilityExportRequest extends S.Class<CreateExplainabilityExportRequest>(
  "CreateExplainabilityExportRequest",
)(
  {
    ExplainabilityExportName: S.String,
    ExplainabilityArn: S.String,
    Destination: DataDestination,
    Tags: S.optional(Tags),
    Format: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateForecastExportJobResponse extends S.Class<CreateForecastExportJobResponse>(
  "CreateForecastExportJobResponse",
)({ ForecastExportJobArn: S.optional(S.String) }) {}
export class CreateMonitorResponse extends S.Class<CreateMonitorResponse>(
  "CreateMonitorResponse",
)({ MonitorArn: S.optional(S.String) }) {}
export class CreatePredictorBacktestExportJobResponse extends S.Class<CreatePredictorBacktestExportJobResponse>(
  "CreatePredictorBacktestExportJobResponse",
)({ PredictorBacktestExportJobArn: S.optional(S.String) }) {}
export class CreateWhatIfAnalysisResponse extends S.Class<CreateWhatIfAnalysisResponse>(
  "CreateWhatIfAnalysisResponse",
)({ WhatIfAnalysisArn: S.optional(S.String) }) {}
export class CreateWhatIfForecastExportResponse extends S.Class<CreateWhatIfForecastExportResponse>(
  "CreateWhatIfForecastExportResponse",
)({ WhatIfForecastExportArn: S.optional(S.String) }) {}
export class DescribeDatasetResponse extends S.Class<DescribeDatasetResponse>(
  "DescribeDatasetResponse",
)({
  DatasetArn: S.optional(S.String),
  DatasetName: S.optional(S.String),
  Domain: S.optional(S.String),
  DatasetType: S.optional(S.String),
  DataFrequency: S.optional(S.String),
  Schema: S.optional(Schema),
  EncryptionConfig: S.optional(EncryptionConfig),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class DescribeDatasetGroupResponse extends S.Class<DescribeDatasetGroupResponse>(
  "DescribeDatasetGroupResponse",
)({
  DatasetGroupName: S.optional(S.String),
  DatasetGroupArn: S.optional(S.String),
  DatasetArns: S.optional(ArnList),
  Domain: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class DescribeExplainabilityResponse extends S.Class<DescribeExplainabilityResponse>(
  "DescribeExplainabilityResponse",
)({
  ExplainabilityArn: S.optional(S.String),
  ExplainabilityName: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  ExplainabilityConfig: S.optional(ExplainabilityConfig),
  EnableVisualization: S.optional(S.Boolean),
  DataSource: S.optional(DataSource),
  Schema: S.optional(Schema),
  StartDateTime: S.optional(S.String),
  EndDateTime: S.optional(S.String),
  EstimatedTimeRemainingInMinutes: S.optional(S.Number),
  Message: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class DescribeExplainabilityExportResponse extends S.Class<DescribeExplainabilityExportResponse>(
  "DescribeExplainabilityExportResponse",
)({
  ExplainabilityExportArn: S.optional(S.String),
  ExplainabilityExportName: S.optional(S.String),
  ExplainabilityArn: S.optional(S.String),
  Destination: S.optional(DataDestination),
  Message: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Format: S.optional(S.String),
}) {}
export class DescribeForecastResponse extends S.Class<DescribeForecastResponse>(
  "DescribeForecastResponse",
)({
  ForecastArn: S.optional(S.String),
  ForecastName: S.optional(S.String),
  ForecastTypes: S.optional(ForecastTypes),
  PredictorArn: S.optional(S.String),
  DatasetGroupArn: S.optional(S.String),
  EstimatedTimeRemainingInMinutes: S.optional(S.Number),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TimeSeriesSelector: S.optional(TimeSeriesSelector),
}) {}
export class DescribeForecastExportJobResponse extends S.Class<DescribeForecastExportJobResponse>(
  "DescribeForecastExportJobResponse",
)({
  ForecastExportJobArn: S.optional(S.String),
  ForecastExportJobName: S.optional(S.String),
  ForecastArn: S.optional(S.String),
  Destination: S.optional(DataDestination),
  Message: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Format: S.optional(S.String),
}) {}
export class DescribePredictorBacktestExportJobResponse extends S.Class<DescribePredictorBacktestExportJobResponse>(
  "DescribePredictorBacktestExportJobResponse",
)({
  PredictorBacktestExportJobArn: S.optional(S.String),
  PredictorBacktestExportJobName: S.optional(S.String),
  PredictorArn: S.optional(S.String),
  Destination: S.optional(DataDestination),
  Message: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Format: S.optional(S.String),
}) {}
export class DescribeWhatIfAnalysisResponse extends S.Class<DescribeWhatIfAnalysisResponse>(
  "DescribeWhatIfAnalysisResponse",
)({
  WhatIfAnalysisName: S.optional(S.String),
  WhatIfAnalysisArn: S.optional(S.String),
  ForecastArn: S.optional(S.String),
  EstimatedTimeRemainingInMinutes: S.optional(S.Number),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TimeSeriesSelector: S.optional(TimeSeriesSelector),
}) {}
export class Action extends S.Class<Action>("Action")({
  AttributeName: S.String,
  Operation: S.String,
  Value: S.Number,
}) {}
export class TimeSeriesCondition extends S.Class<TimeSeriesCondition>(
  "TimeSeriesCondition",
)({ AttributeName: S.String, AttributeValue: S.String, Condition: S.String }) {}
export const TimeSeriesConditions = S.Array(TimeSeriesCondition);
export class TimeSeriesTransformation extends S.Class<TimeSeriesTransformation>(
  "TimeSeriesTransformation",
)({
  Action: S.optional(Action),
  TimeSeriesConditions: S.optional(TimeSeriesConditions),
}) {}
export const TimeSeriesTransformations = S.Array(TimeSeriesTransformation);
export class DescribeWhatIfForecastResponse extends S.Class<DescribeWhatIfForecastResponse>(
  "DescribeWhatIfForecastResponse",
)({
  WhatIfForecastName: S.optional(S.String),
  WhatIfForecastArn: S.optional(S.String),
  WhatIfAnalysisArn: S.optional(S.String),
  EstimatedTimeRemainingInMinutes: S.optional(S.Number),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TimeSeriesTransformations: S.optional(TimeSeriesTransformations),
  TimeSeriesReplacementsDataSource: S.optional(
    TimeSeriesReplacementsDataSource,
  ),
  ForecastTypes: S.optional(ForecastTypes),
}) {}
export class DescribeWhatIfForecastExportResponse extends S.Class<DescribeWhatIfForecastExportResponse>(
  "DescribeWhatIfForecastExportResponse",
)({
  WhatIfForecastExportArn: S.optional(S.String),
  WhatIfForecastExportName: S.optional(S.String),
  WhatIfForecastArns: S.optional(LongArnList),
  Destination: S.optional(DataDestination),
  Message: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EstimatedTimeRemainingInMinutes: S.optional(S.Number),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Format: S.optional(S.String),
}) {}
export class ListDatasetImportJobsRequest extends S.Class<ListDatasetImportJobsRequest>(
  "ListDatasetImportJobsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filters: S.optional(Filters),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(Tags) }) {}
export class SupplementaryFeature extends S.Class<SupplementaryFeature>(
  "SupplementaryFeature",
)({ Name: S.String, Value: S.String }) {}
export const SupplementaryFeatures = S.Array(SupplementaryFeature);
export const Values = S.Array(S.String);
export class InputDataConfig extends S.Class<InputDataConfig>(
  "InputDataConfig",
)({
  DatasetGroupArn: S.String,
  SupplementaryFeatures: S.optional(SupplementaryFeatures),
}) {}
export class ReferencePredictorSummary extends S.Class<ReferencePredictorSummary>(
  "ReferencePredictorSummary",
)({ Arn: S.optional(S.String), State: S.optional(S.String) }) {}
export class ExplainabilityInfo extends S.Class<ExplainabilityInfo>(
  "ExplainabilityInfo",
)({ ExplainabilityArn: S.optional(S.String), Status: S.optional(S.String) }) {}
export class MonitorInfo extends S.Class<MonitorInfo>("MonitorInfo")({
  MonitorArn: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class DatasetGroupSummary extends S.Class<DatasetGroupSummary>(
  "DatasetGroupSummary",
)({
  DatasetGroupArn: S.optional(S.String),
  DatasetGroupName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const DatasetGroups = S.Array(DatasetGroupSummary);
export class DatasetSummary extends S.Class<DatasetSummary>("DatasetSummary")({
  DatasetArn: S.optional(S.String),
  DatasetName: S.optional(S.String),
  DatasetType: S.optional(S.String),
  Domain: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const Datasets = S.Array(DatasetSummary);
export class ExplainabilitySummary extends S.Class<ExplainabilitySummary>(
  "ExplainabilitySummary",
)({
  ExplainabilityArn: S.optional(S.String),
  ExplainabilityName: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  ExplainabilityConfig: S.optional(ExplainabilityConfig),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const Explainabilities = S.Array(ExplainabilitySummary);
export class ExplainabilityExportSummary extends S.Class<ExplainabilityExportSummary>(
  "ExplainabilityExportSummary",
)({
  ExplainabilityExportArn: S.optional(S.String),
  ExplainabilityExportName: S.optional(S.String),
  Destination: S.optional(DataDestination),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ExplainabilityExports = S.Array(ExplainabilityExportSummary);
export class ForecastExportJobSummary extends S.Class<ForecastExportJobSummary>(
  "ForecastExportJobSummary",
)({
  ForecastExportJobArn: S.optional(S.String),
  ForecastExportJobName: S.optional(S.String),
  Destination: S.optional(DataDestination),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const ForecastExportJobs = S.Array(ForecastExportJobSummary);
export class ForecastSummary extends S.Class<ForecastSummary>(
  "ForecastSummary",
)({
  ForecastArn: S.optional(S.String),
  ForecastName: S.optional(S.String),
  PredictorArn: S.optional(S.String),
  CreatedUsingAutoPredictor: S.optional(S.Boolean),
  DatasetGroupArn: S.optional(S.String),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const Forecasts = S.Array(ForecastSummary);
export class MonitorSummary extends S.Class<MonitorSummary>("MonitorSummary")({
  MonitorArn: S.optional(S.String),
  MonitorName: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const Monitors = S.Array(MonitorSummary);
export class PredictorBacktestExportJobSummary extends S.Class<PredictorBacktestExportJobSummary>(
  "PredictorBacktestExportJobSummary",
)({
  PredictorBacktestExportJobArn: S.optional(S.String),
  PredictorBacktestExportJobName: S.optional(S.String),
  Destination: S.optional(DataDestination),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const PredictorBacktestExportJobs = S.Array(
  PredictorBacktestExportJobSummary,
);
export class PredictorSummary extends S.Class<PredictorSummary>(
  "PredictorSummary",
)({
  PredictorArn: S.optional(S.String),
  PredictorName: S.optional(S.String),
  DatasetGroupArn: S.optional(S.String),
  IsAutoPredictor: S.optional(S.Boolean),
  ReferencePredictorSummary: S.optional(ReferencePredictorSummary),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const Predictors = S.Array(PredictorSummary);
export class WhatIfAnalysisSummary extends S.Class<WhatIfAnalysisSummary>(
  "WhatIfAnalysisSummary",
)({
  WhatIfAnalysisArn: S.optional(S.String),
  WhatIfAnalysisName: S.optional(S.String),
  ForecastArn: S.optional(S.String),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const WhatIfAnalyses = S.Array(WhatIfAnalysisSummary);
export class WhatIfForecastExportSummary extends S.Class<WhatIfForecastExportSummary>(
  "WhatIfForecastExportSummary",
)({
  WhatIfForecastExportArn: S.optional(S.String),
  WhatIfForecastArns: S.optional(WhatIfForecastArnListForExport),
  WhatIfForecastExportName: S.optional(S.String),
  Destination: S.optional(DataDestination),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const WhatIfForecastExports = S.Array(WhatIfForecastExportSummary);
export class WhatIfForecastSummary extends S.Class<WhatIfForecastSummary>(
  "WhatIfForecastSummary",
)({
  WhatIfForecastArn: S.optional(S.String),
  WhatIfForecastName: S.optional(S.String),
  WhatIfAnalysisArn: S.optional(S.String),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export const WhatIfForecasts = S.Array(WhatIfForecastSummary);
export const Transformations = S.Record({ key: S.String, value: S.String });
export const Configuration = S.Record({ key: S.String, value: Values });
export class CategoricalParameterRange extends S.Class<CategoricalParameterRange>(
  "CategoricalParameterRange",
)({ Name: S.String, Values: Values }) {}
export const CategoricalParameterRanges = S.Array(CategoricalParameterRange);
export class ContinuousParameterRange extends S.Class<ContinuousParameterRange>(
  "ContinuousParameterRange",
)({
  Name: S.String,
  MaxValue: S.Number,
  MinValue: S.Number,
  ScalingType: S.optional(S.String),
}) {}
export const ContinuousParameterRanges = S.Array(ContinuousParameterRange);
export class IntegerParameterRange extends S.Class<IntegerParameterRange>(
  "IntegerParameterRange",
)({
  Name: S.String,
  MaxValue: S.Number,
  MinValue: S.Number,
  ScalingType: S.optional(S.String),
}) {}
export const IntegerParameterRanges = S.Array(IntegerParameterRange);
export class CreateDatasetRequest extends S.Class<CreateDatasetRequest>(
  "CreateDatasetRequest",
)(
  {
    DatasetName: S.String,
    Domain: S.String,
    DatasetType: S.String,
    DataFrequency: S.optional(S.String),
    Schema: Schema,
    EncryptionConfig: S.optional(EncryptionConfig),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDatasetImportJobRequest extends S.Class<CreateDatasetImportJobRequest>(
  "CreateDatasetImportJobRequest",
)(
  {
    DatasetImportJobName: S.String,
    DatasetArn: S.String,
    DataSource: DataSource,
    TimestampFormat: S.optional(S.String),
    TimeZone: S.optional(S.String),
    UseGeolocationForTimeZone: S.optional(S.Boolean),
    GeolocationFormat: S.optional(S.String),
    Tags: S.optional(Tags),
    Format: S.optional(S.String),
    ImportMode: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateExplainabilityResponse extends S.Class<CreateExplainabilityResponse>(
  "CreateExplainabilityResponse",
)({ ExplainabilityArn: S.optional(S.String) }) {}
export class CreateExplainabilityExportResponse extends S.Class<CreateExplainabilityExportResponse>(
  "CreateExplainabilityExportResponse",
)({ ExplainabilityExportArn: S.optional(S.String) }) {}
export class CreateForecastRequest extends S.Class<CreateForecastRequest>(
  "CreateForecastRequest",
)(
  {
    ForecastName: S.String,
    PredictorArn: S.String,
    ForecastTypes: S.optional(ForecastTypes),
    Tags: S.optional(Tags),
    TimeSeriesSelector: S.optional(TimeSeriesSelector),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateWhatIfForecastRequest extends S.Class<CreateWhatIfForecastRequest>(
  "CreateWhatIfForecastRequest",
)(
  {
    WhatIfForecastName: S.String,
    WhatIfAnalysisArn: S.String,
    TimeSeriesTransformations: S.optional(TimeSeriesTransformations),
    TimeSeriesReplacementsDataSource: S.optional(
      TimeSeriesReplacementsDataSource,
    ),
    Tags: S.optional(Tags),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AttributeConfig extends S.Class<AttributeConfig>(
  "AttributeConfig",
)({ AttributeName: S.String, Transformations: Transformations }) {}
export const AttributeConfigs = S.Array(AttributeConfig);
export class AdditionalDataset extends S.Class<AdditionalDataset>(
  "AdditionalDataset",
)({ Name: S.String, Configuration: S.optional(Configuration) }) {}
export const AdditionalDatasets = S.Array(AdditionalDataset);
export class DataConfig extends S.Class<DataConfig>("DataConfig")({
  DatasetGroupArn: S.String,
  AttributeConfigs: S.optional(AttributeConfigs),
  AdditionalDatasets: S.optional(AdditionalDatasets),
}) {}
export class DescribeAutoPredictorResponse extends S.Class<DescribeAutoPredictorResponse>(
  "DescribeAutoPredictorResponse",
)({
  PredictorArn: S.optional(S.String),
  PredictorName: S.optional(S.String),
  ForecastHorizon: S.optional(S.Number),
  ForecastTypes: S.optional(ForecastTypes),
  ForecastFrequency: S.optional(S.String),
  ForecastDimensions: S.optional(ForecastDimensions),
  DatasetImportJobArns: S.optional(ArnList),
  DataConfig: S.optional(DataConfig),
  EncryptionConfig: S.optional(EncryptionConfig),
  ReferencePredictorSummary: S.optional(ReferencePredictorSummary),
  EstimatedTimeRemainingInMinutes: S.optional(S.Number),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  OptimizationMetric: S.optional(S.String),
  ExplainabilityInfo: S.optional(ExplainabilityInfo),
  MonitorInfo: S.optional(MonitorInfo),
  TimeAlignmentBoundary: S.optional(TimeAlignmentBoundary),
}) {}
export class ListDatasetGroupsResponse extends S.Class<ListDatasetGroupsResponse>(
  "ListDatasetGroupsResponse",
)({
  DatasetGroups: S.optional(DatasetGroups),
  NextToken: S.optional(S.String),
}) {}
export class ListDatasetsResponse extends S.Class<ListDatasetsResponse>(
  "ListDatasetsResponse",
)({ Datasets: S.optional(Datasets), NextToken: S.optional(S.String) }) {}
export class ListExplainabilitiesResponse extends S.Class<ListExplainabilitiesResponse>(
  "ListExplainabilitiesResponse",
)({
  Explainabilities: S.optional(Explainabilities),
  NextToken: S.optional(S.String),
}) {}
export class ListExplainabilityExportsResponse extends S.Class<ListExplainabilityExportsResponse>(
  "ListExplainabilityExportsResponse",
)({
  ExplainabilityExports: S.optional(ExplainabilityExports),
  NextToken: S.optional(S.String),
}) {}
export class ListForecastExportJobsResponse extends S.Class<ListForecastExportJobsResponse>(
  "ListForecastExportJobsResponse",
)({
  ForecastExportJobs: S.optional(ForecastExportJobs),
  NextToken: S.optional(S.String),
}) {}
export class ListForecastsResponse extends S.Class<ListForecastsResponse>(
  "ListForecastsResponse",
)({ Forecasts: S.optional(Forecasts), NextToken: S.optional(S.String) }) {}
export class ListMonitorsResponse extends S.Class<ListMonitorsResponse>(
  "ListMonitorsResponse",
)({ Monitors: S.optional(Monitors), NextToken: S.optional(S.String) }) {}
export class ListPredictorBacktestExportJobsResponse extends S.Class<ListPredictorBacktestExportJobsResponse>(
  "ListPredictorBacktestExportJobsResponse",
)({
  PredictorBacktestExportJobs: S.optional(PredictorBacktestExportJobs),
  NextToken: S.optional(S.String),
}) {}
export class ListPredictorsResponse extends S.Class<ListPredictorsResponse>(
  "ListPredictorsResponse",
)({ Predictors: S.optional(Predictors), NextToken: S.optional(S.String) }) {}
export class ListWhatIfAnalysesResponse extends S.Class<ListWhatIfAnalysesResponse>(
  "ListWhatIfAnalysesResponse",
)({
  WhatIfAnalyses: S.optional(WhatIfAnalyses),
  NextToken: S.optional(S.String),
}) {}
export class ListWhatIfForecastExportsResponse extends S.Class<ListWhatIfForecastExportsResponse>(
  "ListWhatIfForecastExportsResponse",
)({
  WhatIfForecastExports: S.optional(WhatIfForecastExports),
  NextToken: S.optional(S.String),
}) {}
export class ListWhatIfForecastsResponse extends S.Class<ListWhatIfForecastsResponse>(
  "ListWhatIfForecastsResponse",
)({
  WhatIfForecasts: S.optional(WhatIfForecasts),
  NextToken: S.optional(S.String),
}) {}
export class ParameterRanges extends S.Class<ParameterRanges>(
  "ParameterRanges",
)({
  CategoricalParameterRanges: S.optional(CategoricalParameterRanges),
  ContinuousParameterRanges: S.optional(ContinuousParameterRanges),
  IntegerParameterRanges: S.optional(IntegerParameterRanges),
}) {}
export class Statistics extends S.Class<Statistics>("Statistics")({
  Count: S.optional(S.Number),
  CountDistinct: S.optional(S.Number),
  CountNull: S.optional(S.Number),
  CountNan: S.optional(S.Number),
  Min: S.optional(S.String),
  Max: S.optional(S.String),
  Avg: S.optional(S.Number),
  Stddev: S.optional(S.Number),
  CountLong: S.optional(S.Number),
  CountDistinctLong: S.optional(S.Number),
  CountNullLong: S.optional(S.Number),
  CountNanLong: S.optional(S.Number),
}) {}
export class PredictorEvent extends S.Class<PredictorEvent>("PredictorEvent")({
  Detail: S.optional(S.String),
  Datetime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class MonitorDataSource extends S.Class<MonitorDataSource>(
  "MonitorDataSource",
)({
  DatasetImportJobArn: S.optional(S.String),
  ForecastArn: S.optional(S.String),
  PredictorArn: S.optional(S.String),
}) {}
export class MetricResult extends S.Class<MetricResult>("MetricResult")({
  MetricName: S.optional(S.String),
  MetricValue: S.optional(S.Number),
}) {}
export const MetricResults = S.Array(MetricResult);
export const FeaturizationMethodParameters = S.Record({
  key: S.String,
  value: S.String,
});
export class HyperParameterTuningJobConfig extends S.Class<HyperParameterTuningJobConfig>(
  "HyperParameterTuningJobConfig",
)({ ParameterRanges: S.optional(ParameterRanges) }) {}
export const FieldStatistics = S.Record({ key: S.String, value: Statistics });
export class DatasetImportJobSummary extends S.Class<DatasetImportJobSummary>(
  "DatasetImportJobSummary",
)({
  DatasetImportJobArn: S.optional(S.String),
  DatasetImportJobName: S.optional(S.String),
  DataSource: S.optional(DataSource),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ImportMode: S.optional(S.String),
}) {}
export const DatasetImportJobs = S.Array(DatasetImportJobSummary);
export class PredictorMonitorEvaluation extends S.Class<PredictorMonitorEvaluation>(
  "PredictorMonitorEvaluation",
)({
  ResourceArn: S.optional(S.String),
  MonitorArn: S.optional(S.String),
  EvaluationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EvaluationState: S.optional(S.String),
  WindowStartDatetime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  WindowEndDatetime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  PredictorEvent: S.optional(PredictorEvent),
  MonitorDataSource: S.optional(MonitorDataSource),
  MetricResults: S.optional(MetricResults),
  NumItemsEvaluated: S.optional(S.Number),
  Message: S.optional(S.String),
}) {}
export const PredictorMonitorEvaluations = S.Array(PredictorMonitorEvaluation);
export class FeaturizationMethod extends S.Class<FeaturizationMethod>(
  "FeaturizationMethod",
)({
  FeaturizationMethodName: S.String,
  FeaturizationMethodParameters: S.optional(FeaturizationMethodParameters),
}) {}
export const FeaturizationPipeline = S.Array(FeaturizationMethod);
export class BaselineMetric extends S.Class<BaselineMetric>("BaselineMetric")({
  Name: S.optional(S.String),
  Value: S.optional(S.Number),
}) {}
export const BaselineMetrics = S.Array(BaselineMetric);
export class TestWindowSummary extends S.Class<TestWindowSummary>(
  "TestWindowSummary",
)({
  TestWindowStart: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TestWindowEnd: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const TestWindowDetails = S.Array(TestWindowSummary);
export class CreateAutoPredictorRequest extends S.Class<CreateAutoPredictorRequest>(
  "CreateAutoPredictorRequest",
)(
  {
    PredictorName: S.String,
    ForecastHorizon: S.optional(S.Number),
    ForecastTypes: S.optional(ForecastTypes),
    ForecastDimensions: S.optional(ForecastDimensions),
    ForecastFrequency: S.optional(S.String),
    DataConfig: S.optional(DataConfig),
    EncryptionConfig: S.optional(EncryptionConfig),
    ReferencePredictorArn: S.optional(S.String),
    OptimizationMetric: S.optional(S.String),
    ExplainPredictor: S.optional(S.Boolean),
    Tags: S.optional(Tags),
    MonitorConfig: S.optional(MonitorConfig),
    TimeAlignmentBoundary: S.optional(TimeAlignmentBoundary),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDatasetResponse extends S.Class<CreateDatasetResponse>(
  "CreateDatasetResponse",
)({ DatasetArn: S.optional(S.String) }) {}
export class CreateDatasetImportJobResponse extends S.Class<CreateDatasetImportJobResponse>(
  "CreateDatasetImportJobResponse",
)({ DatasetImportJobArn: S.optional(S.String) }) {}
export class CreateForecastResponse extends S.Class<CreateForecastResponse>(
  "CreateForecastResponse",
)({ ForecastArn: S.optional(S.String) }) {}
export class CreateWhatIfForecastResponse extends S.Class<CreateWhatIfForecastResponse>(
  "CreateWhatIfForecastResponse",
)({ WhatIfForecastArn: S.optional(S.String) }) {}
export class DescribeDatasetImportJobResponse extends S.Class<DescribeDatasetImportJobResponse>(
  "DescribeDatasetImportJobResponse",
)({
  DatasetImportJobName: S.optional(S.String),
  DatasetImportJobArn: S.optional(S.String),
  DatasetArn: S.optional(S.String),
  TimestampFormat: S.optional(S.String),
  TimeZone: S.optional(S.String),
  UseGeolocationForTimeZone: S.optional(S.Boolean),
  GeolocationFormat: S.optional(S.String),
  DataSource: S.optional(DataSource),
  EstimatedTimeRemainingInMinutes: S.optional(S.Number),
  FieldStatistics: S.optional(FieldStatistics),
  DataSize: S.optional(S.Number),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Format: S.optional(S.String),
  ImportMode: S.optional(S.String),
}) {}
export class ListDatasetImportJobsResponse extends S.Class<ListDatasetImportJobsResponse>(
  "ListDatasetImportJobsResponse",
)({
  DatasetImportJobs: S.optional(DatasetImportJobs),
  NextToken: S.optional(S.String),
}) {}
export class ListMonitorEvaluationsResponse extends S.Class<ListMonitorEvaluationsResponse>(
  "ListMonitorEvaluationsResponse",
)({
  NextToken: S.optional(S.String),
  PredictorMonitorEvaluations: S.optional(PredictorMonitorEvaluations),
}) {}
export class Featurization extends S.Class<Featurization>("Featurization")({
  AttributeName: S.String,
  FeaturizationPipeline: S.optional(FeaturizationPipeline),
}) {}
export const Featurizations = S.Array(Featurization);
export class PredictorBaseline extends S.Class<PredictorBaseline>(
  "PredictorBaseline",
)({ BaselineMetrics: S.optional(BaselineMetrics) }) {}
export class PredictorExecution extends S.Class<PredictorExecution>(
  "PredictorExecution",
)({
  AlgorithmArn: S.optional(S.String),
  TestWindows: S.optional(TestWindowDetails),
}) {}
export const PredictorExecutions = S.Array(PredictorExecution);
export class WeightedQuantileLoss extends S.Class<WeightedQuantileLoss>(
  "WeightedQuantileLoss",
)({ Quantile: S.optional(S.Number), LossValue: S.optional(S.Number) }) {}
export const WeightedQuantileLosses = S.Array(WeightedQuantileLoss);
export class ErrorMetric extends S.Class<ErrorMetric>("ErrorMetric")({
  ForecastType: S.optional(S.String),
  WAPE: S.optional(S.Number),
  RMSE: S.optional(S.Number),
  MASE: S.optional(S.Number),
  MAPE: S.optional(S.Number),
}) {}
export const ErrorMetrics = S.Array(ErrorMetric);
export class FeaturizationConfig extends S.Class<FeaturizationConfig>(
  "FeaturizationConfig",
)({
  ForecastFrequency: S.String,
  ForecastDimensions: S.optional(ForecastDimensions),
  Featurizations: S.optional(Featurizations),
}) {}
export class Baseline extends S.Class<Baseline>("Baseline")({
  PredictorBaseline: S.optional(PredictorBaseline),
}) {}
export class PredictorExecutionDetails extends S.Class<PredictorExecutionDetails>(
  "PredictorExecutionDetails",
)({ PredictorExecutions: S.optional(PredictorExecutions) }) {}
export class Metrics extends S.Class<Metrics>("Metrics")({
  RMSE: S.optional(S.Number),
  WeightedQuantileLosses: S.optional(WeightedQuantileLosses),
  ErrorMetrics: S.optional(ErrorMetrics),
  AverageWeightedQuantileLoss: S.optional(S.Number),
}) {}
export class CreateAutoPredictorResponse extends S.Class<CreateAutoPredictorResponse>(
  "CreateAutoPredictorResponse",
)({ PredictorArn: S.optional(S.String) }) {}
export class CreatePredictorRequest extends S.Class<CreatePredictorRequest>(
  "CreatePredictorRequest",
)(
  {
    PredictorName: S.String,
    AlgorithmArn: S.optional(S.String),
    ForecastHorizon: S.Number,
    ForecastTypes: S.optional(ForecastTypes),
    PerformAutoML: S.optional(S.Boolean),
    AutoMLOverrideStrategy: S.optional(S.String),
    PerformHPO: S.optional(S.Boolean),
    TrainingParameters: S.optional(TrainingParameters),
    EvaluationParameters: S.optional(EvaluationParameters),
    HPOConfig: S.optional(HyperParameterTuningJobConfig),
    InputDataConfig: InputDataConfig,
    FeaturizationConfig: FeaturizationConfig,
    EncryptionConfig: S.optional(EncryptionConfig),
    Tags: S.optional(Tags),
    OptimizationMetric: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMonitorResponse extends S.Class<DescribeMonitorResponse>(
  "DescribeMonitorResponse",
)({
  MonitorName: S.optional(S.String),
  MonitorArn: S.optional(S.String),
  ResourceArn: S.optional(S.String),
  Status: S.optional(S.String),
  LastEvaluationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastEvaluationState: S.optional(S.String),
  Baseline: S.optional(Baseline),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  EstimatedEvaluationTimeRemainingInMinutes: S.optional(S.Number),
}) {}
export class DescribePredictorResponse extends S.Class<DescribePredictorResponse>(
  "DescribePredictorResponse",
)({
  PredictorArn: S.optional(S.String),
  PredictorName: S.optional(S.String),
  AlgorithmArn: S.optional(S.String),
  AutoMLAlgorithmArns: S.optional(ArnList),
  ForecastHorizon: S.optional(S.Number),
  ForecastTypes: S.optional(ForecastTypes),
  PerformAutoML: S.optional(S.Boolean),
  AutoMLOverrideStrategy: S.optional(S.String),
  PerformHPO: S.optional(S.Boolean),
  TrainingParameters: S.optional(TrainingParameters),
  EvaluationParameters: S.optional(EvaluationParameters),
  HPOConfig: S.optional(HyperParameterTuningJobConfig),
  InputDataConfig: S.optional(InputDataConfig),
  FeaturizationConfig: S.optional(FeaturizationConfig),
  EncryptionConfig: S.optional(EncryptionConfig),
  PredictorExecutionDetails: S.optional(PredictorExecutionDetails),
  EstimatedTimeRemainingInMinutes: S.optional(S.Number),
  IsAutoPredictor: S.optional(S.Boolean),
  DatasetImportJobArns: S.optional(ArnList),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModificationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  OptimizationMetric: S.optional(S.String),
}) {}
export class WindowSummary extends S.Class<WindowSummary>("WindowSummary")({
  TestWindowStart: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TestWindowEnd: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ItemCount: S.optional(S.Number),
  EvaluationType: S.optional(S.String),
  Metrics: S.optional(Metrics),
}) {}
export const TestWindows = S.Array(WindowSummary);
export class EvaluationResult extends S.Class<EvaluationResult>(
  "EvaluationResult",
)({
  AlgorithmArn: S.optional(S.String),
  TestWindows: S.optional(TestWindows),
}) {}
export const PredictorEvaluationResults = S.Array(EvaluationResult);
export class CreatePredictorResponse extends S.Class<CreatePredictorResponse>(
  "CreatePredictorResponse",
)({ PredictorArn: S.optional(S.String) }) {}
export class GetAccuracyMetricsResponse extends S.Class<GetAccuracyMetricsResponse>(
  "GetAccuracyMetricsResponse",
)({
  PredictorEvaluationResults: S.optional(PredictorEvaluationResults),
  IsAutoPredictor: S.optional(S.Boolean),
  AutoMLOverrideStrategy: S.optional(S.String),
  OptimizationMetric: S.optional(S.String),
}) {}

//# Errors
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { Message: S.optional(S.String) },
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class InvalidNextTokenException extends S.TaggedError<InvalidNextTokenException>()(
  "InvalidNextTokenException",
  { Message: S.optional(S.String) },
) {}
export class ResourceAlreadyExistsException extends S.TaggedError<ResourceAlreadyExistsException>()(
  "ResourceAlreadyExistsException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Describes an Amazon Forecast dataset created using the CreateDataset operation.
 *
 * In addition to listing the parameters specified in the `CreateDataset` request,
 * this operation includes the following dataset properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Status`
 */
export const describeDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatasetRequest,
  output: DescribeDatasetResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Resumes a stopped monitor resource.
 */
export const resumeResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResumeResourceRequest,
  output: ResumeResourceResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a dataset group created using the CreateDatasetGroup operation.
 * You can only delete dataset groups that have a status of `ACTIVE`,
 * `CREATE_FAILED`, or `UPDATE_FAILED`. To get the status, use the DescribeDatasetGroup operation.
 *
 * This operation deletes only the dataset group, not the datasets in the group.
 */
export const deleteDatasetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetGroupRequest,
  output: DeleteDatasetGroupResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a dataset import job created using the CreateDatasetImportJob
 * operation. You can delete only dataset import jobs that have a status of `ACTIVE`
 * or `CREATE_FAILED`. To get the status, use the DescribeDatasetImportJob
 * operation.
 */
export const deleteDatasetImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDatasetImportJobRequest,
    output: DeleteDatasetImportJobResponse,
    errors: [
      InvalidInputException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes an Explainability resource.
 *
 * You can delete only predictor that have a status of `ACTIVE` or
 * `CREATE_FAILED`. To get the status, use the DescribeExplainability operation.
 */
export const deleteExplainability = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteExplainabilityRequest,
    output: DeleteExplainabilityResponse,
    errors: [
      InvalidInputException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes an Explainability export.
 */
export const deleteExplainabilityExport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteExplainabilityExportRequest,
    output: DeleteExplainabilityExportResponse,
    errors: [
      InvalidInputException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes a forecast created using the CreateForecast operation. You can
 * delete only forecasts that have a status of `ACTIVE` or `CREATE_FAILED`.
 * To get the status, use the DescribeForecast operation.
 *
 * You can't delete a forecast while it is being exported. After a forecast is deleted, you
 * can no longer query the forecast.
 */
export const deleteForecast = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteForecastRequest,
  output: DeleteForecastResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a forecast export job created using the CreateForecastExportJob
 * operation. You can delete only export jobs that have a status of `ACTIVE` or
 * `CREATE_FAILED`. To get the status, use the DescribeForecastExportJob operation.
 */
export const deleteForecastExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteForecastExportJobRequest,
    output: DeleteForecastExportJobResponse,
    errors: [
      InvalidInputException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes a monitor resource. You can only delete a monitor resource with a status of `ACTIVE`, `ACTIVE_STOPPED`, `CREATE_FAILED`, or `CREATE_STOPPED`.
 */
export const deleteMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMonitorRequest,
  output: DeleteMonitorResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a predictor created using the DescribePredictor or CreatePredictor operations. You can delete only predictor that have a status of
 * `ACTIVE` or `CREATE_FAILED`. To get the status, use the DescribePredictor operation.
 */
export const deletePredictor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePredictorRequest,
  output: DeletePredictorResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a predictor backtest export job.
 */
export const deletePredictorBacktestExportJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeletePredictorBacktestExportJobRequest,
    output: DeletePredictorBacktestExportJobResponse,
    errors: [
      InvalidInputException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }));
/**
 * Deletes an entire resource tree. This operation will delete the parent resource and
 * its child resources.
 *
 * Child resources are resources that were created from another resource. For example,
 * when a forecast is generated from a predictor, the forecast is the child resource and
 * the predictor is the parent resource.
 *
 * Amazon Forecast resources possess the following parent-child resource hierarchies:
 *
 * - **Dataset**: dataset import jobs
 *
 * - **Dataset Group**: predictors, predictor backtest
 * export jobs, forecasts, forecast export jobs
 *
 * - **Predictor**: predictor backtest export jobs,
 * forecasts, forecast export jobs
 *
 * - **Forecast**: forecast export jobs
 *
 * `DeleteResourceTree` will only delete Amazon Forecast resources, and will not
 * delete datasets or exported files stored in Amazon S3.
 */
export const deleteResourceTree = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourceTreeRequest,
  output: DeleteResourceTreeResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a what-if analysis created using the CreateWhatIfAnalysis
 * operation. You can delete only what-if analyses that have a status of `ACTIVE` or `CREATE_FAILED`. To get the status, use the DescribeWhatIfAnalysis operation.
 *
 * You can't delete a what-if analysis while any of its forecasts are being exported.
 */
export const deleteWhatIfAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWhatIfAnalysisRequest,
    output: DeleteWhatIfAnalysisResponse,
    errors: [
      InvalidInputException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes a what-if forecast created using the CreateWhatIfForecast
 * operation. You can delete only what-if forecasts that have a status of `ACTIVE` or `CREATE_FAILED`. To get the status, use the DescribeWhatIfForecast operation.
 *
 * You can't delete a what-if forecast while it is being exported. After a what-if forecast is deleted, you can no longer query the what-if analysis.
 */
export const deleteWhatIfForecast = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWhatIfForecastRequest,
    output: DeleteWhatIfForecastResponse,
    errors: [
      InvalidInputException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes a what-if forecast export created using the CreateWhatIfForecastExport
 * operation. You can delete only what-if forecast exports that have a status of `ACTIVE` or `CREATE_FAILED`. To get the status, use the DescribeWhatIfForecastExport operation.
 */
export const deleteWhatIfForecastExport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteWhatIfForecastExportRequest,
    output: DeleteWhatIfForecastExportResponse,
    errors: [
      InvalidInputException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Replaces the datasets in a dataset group with the specified datasets.
 *
 * The `Status` of the dataset group must be `ACTIVE` before you can
 * use the dataset group to create a predictor. Use the DescribeDatasetGroup
 * operation to get the status.
 */
export const updateDatasetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatasetGroupRequest,
  output: UpdateDatasetGroupResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes a dataset group created using the CreateDatasetGroup
 * operation.
 *
 * In addition to listing the parameters provided in the `CreateDatasetGroup`
 * request, this operation includes the following properties:
 *
 * - `DatasetArns` - The datasets belonging to the group.
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Status`
 */
export const describeDatasetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDatasetGroupRequest,
    output: DescribeDatasetGroupResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Describes an Explainability resource created using the CreateExplainability operation.
 */
export const describeExplainability = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeExplainabilityRequest,
    output: DescribeExplainabilityResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Describes an Explainability export created using the CreateExplainabilityExport operation.
 */
export const describeExplainabilityExport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeExplainabilityExportRequest,
    output: DescribeExplainabilityExportResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }));
/**
 * Describes a forecast created using the CreateForecast operation.
 *
 * In addition to listing the properties provided in the `CreateForecast` request,
 * this operation lists the following properties:
 *
 * - `DatasetGroupArn` - The dataset group that provided the training
 * data.
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Status`
 *
 * - `Message` - If an error occurred, information about the error.
 */
export const describeForecast = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeForecastRequest,
  output: DescribeForecastResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Describes a forecast export job created using the CreateForecastExportJob operation.
 *
 * In addition to listing the properties provided by the user in the
 * `CreateForecastExportJob` request, this operation lists the following
 * properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Status`
 *
 * - `Message` - If an error occurred, information about the error.
 */
export const describeForecastExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeForecastExportJobRequest,
    output: DescribeForecastExportJobResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Describes a predictor backtest export job created using the CreatePredictorBacktestExportJob operation.
 *
 * In addition to listing the properties provided by the user in the
 * `CreatePredictorBacktestExportJob` request, this operation lists the
 * following properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Status`
 *
 * - `Message` (if an error occurred)
 */
export const describePredictorBacktestExportJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribePredictorBacktestExportJobRequest,
    output: DescribePredictorBacktestExportJobResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }));
/**
 * Describes the what-if analysis created using the CreateWhatIfAnalysis operation.
 *
 * In addition to listing the properties provided in the `CreateWhatIfAnalysis` request, this operation lists the following properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Message` - If an error occurred, information about the error.
 *
 * - `Status`
 */
export const describeWhatIfAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeWhatIfAnalysisRequest,
    output: DescribeWhatIfAnalysisResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Describes the what-if forecast created using the CreateWhatIfForecast operation.
 *
 * In addition to listing the properties provided in the `CreateWhatIfForecast` request, this operation lists the following properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Message` - If an error occurred, information about the error.
 *
 * - `Status`
 */
export const describeWhatIfForecast = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeWhatIfForecastRequest,
    output: DescribeWhatIfForecastResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Describes the what-if forecast export created using the CreateWhatIfForecastExport operation.
 *
 * In addition to listing the properties provided in the `CreateWhatIfForecastExport` request, this operation lists the following properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Message` - If an error occurred, information about the error.
 *
 * - `Status`
 */
export const describeWhatIfForecastExport =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeWhatIfForecastExportRequest,
    output: DescribeWhatIfForecastExportResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }));
/**
 * Lists the tags for an Amazon Forecast resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Deletes the specified tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * Deletes an Amazon Forecast dataset that was created using the CreateDataset operation. You can
 * only delete datasets that have a status of `ACTIVE` or `CREATE_FAILED`.
 * To get the status use the DescribeDataset operation.
 *
 * Forecast does not automatically update any dataset groups that contain the deleted dataset.
 * In order to update the dataset group, use the UpdateDatasetGroup operation,
 * omitting the deleted dataset's ARN.
 */
export const deleteDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatasetRequest,
  output: DeleteDatasetResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes a predictor created using the CreateAutoPredictor operation.
 */
export const describeAutoPredictor = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeAutoPredictorRequest,
    output: DescribeAutoPredictorResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Stops a resource.
 *
 * The resource undergoes the following states: `CREATE_STOPPING` and
 * `CREATE_STOPPED`. You cannot resume a resource once it has been
 * stopped.
 *
 * This operation can be applied to the following resources (and their corresponding child
 * resources):
 *
 * - Dataset Import Job
 *
 * - Predictor Job
 *
 * - Forecast Job
 *
 * - Forecast Export Job
 *
 * - Predictor Backtest Export Job
 *
 * - Explainability Job
 *
 * - Explainability Export Job
 */
export const stopResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopResourceRequest,
  output: StopResourceResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Associates the specified tags to a resource with the specified `resourceArn`.
 * If existing tags on a resource are not specified in the request parameters, they are not
 * changed. When a resource is deleted, the tags associated with that resource are also
 * deleted.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes a dataset import job created using the CreateDatasetImportJob
 * operation.
 *
 * In addition to listing the parameters provided in the `CreateDatasetImportJob`
 * request, this operation includes the following properties:
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `DataSize`
 *
 * - `FieldStatistics`
 *
 * - `Status`
 *
 * - `Message` - If an error occurred, information about the error.
 */
export const describeDatasetImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDatasetImportJobRequest,
    output: DescribeDatasetImportJobResponse,
    errors: [InvalidInputException, ResourceNotFoundException],
  }),
);
/**
 * Returns a list of dataset groups created using the CreateDatasetGroup operation.
 * For each dataset group, this operation returns a summary of its properties, including its
 * Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the
 * dataset group ARN with the DescribeDatasetGroup
 * operation.
 */
export const listDatasetGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDatasetGroupsRequest,
  output: ListDatasetGroupsResponse,
  errors: [InvalidNextTokenException],
}));
/**
 * Returns a list of dataset import jobs created using the CreateDatasetImportJob
 * operation. For each import job, this operation returns a summary of its properties, including
 * its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the
 * ARN with the DescribeDatasetImportJob
 * operation. You can filter the list by providing an array of Filter objects.
 */
export const listDatasetImportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDatasetImportJobsRequest,
    output: ListDatasetImportJobsResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }),
);
/**
 * Returns a list of the monitoring evaluation results and predictor events collected by
 * the monitor resource during different windows of time.
 *
 * For information about monitoring see predictor-monitoring. For
 * more information about retrieving monitoring results see Viewing Monitoring Results.
 */
export const listMonitorEvaluations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListMonitorEvaluationsRequest,
    output: ListMonitorEvaluationsResponse,
    errors: [
      InvalidInputException,
      InvalidNextTokenException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns a list of datasets created using the CreateDataset operation. For each
 * dataset, a summary of its properties, including its Amazon Resource Name (ARN), is returned.
 * To retrieve the complete set of properties, use the ARN with the DescribeDataset operation.
 */
export const listDatasets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDatasetsRequest,
  output: ListDatasetsResponse,
  errors: [InvalidNextTokenException],
}));
/**
 * Returns a list of Explainability resources created using the CreateExplainability operation. This operation returns a summary for
 * each Explainability. You can filter the list using an array of Filter
 * objects.
 *
 * To retrieve the complete set of properties for a particular Explainability resource,
 * use the ARN with the DescribeExplainability operation.
 */
export const listExplainabilities = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListExplainabilitiesRequest,
    output: ListExplainabilitiesResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }),
);
/**
 * Returns a list of Explainability exports created using the CreateExplainabilityExport operation. This operation returns a summary
 * for each Explainability export. You can filter the list using an array of Filter objects.
 *
 * To retrieve the complete set of properties for a particular Explainability export, use
 * the ARN with the DescribeExplainability operation.
 */
export const listExplainabilityExports = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListExplainabilityExportsRequest,
    output: ListExplainabilityExportsResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }),
);
/**
 * Returns a list of forecast export jobs created using the CreateForecastExportJob operation. For each forecast export job, this operation
 * returns a summary of its properties, including its Amazon Resource Name (ARN). To retrieve the
 * complete set of properties, use the ARN with the DescribeForecastExportJob
 * operation. You can filter the list using an array of Filter objects.
 */
export const listForecastExportJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListForecastExportJobsRequest,
    output: ListForecastExportJobsResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }),
);
/**
 * Returns a list of forecasts created using the CreateForecast operation.
 * For each forecast, this operation returns a summary of its properties, including its Amazon
 * Resource Name (ARN). To retrieve the complete set of properties, specify the ARN with the
 * DescribeForecast operation. You can filter the list using an array of
 * Filter objects.
 */
export const listForecasts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListForecastsRequest,
  output: ListForecastsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
}));
/**
 * Returns a list of monitors created with the CreateMonitor operation and CreateAutoPredictor operation. For each monitor resource, this operation returns of a summary of its properties, including its Amazon Resource Name (ARN). You
 * can retrieve a complete set of properties of a monitor resource by specify the monitor's ARN in the DescribeMonitor operation.
 */
export const listMonitors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMonitorsRequest,
  output: ListMonitorsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
}));
/**
 * Returns a list of predictor backtest export jobs created using the CreatePredictorBacktestExportJob operation. This operation returns a
 * summary for each backtest export job. You can filter the list using an array of Filter objects.
 *
 * To retrieve the complete set of properties for a particular backtest export job, use
 * the ARN with the DescribePredictorBacktestExportJob operation.
 */
export const listPredictorBacktestExportJobs =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListPredictorBacktestExportJobsRequest,
    output: ListPredictorBacktestExportJobsResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }));
/**
 * Returns a list of predictors created using the CreateAutoPredictor or
 * CreatePredictor operations. For each predictor, this operation returns a
 * summary of its properties, including its Amazon Resource Name (ARN).
 *
 * You can retrieve the complete set of properties by using the ARN with the DescribeAutoPredictor and DescribePredictor operations. You
 * can filter the list using an array of Filter objects.
 */
export const listPredictors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListPredictorsRequest,
  output: ListPredictorsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
}));
/**
 * Returns a list of what-if analyses created using the CreateWhatIfAnalysis operation. For each what-if analysis, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the what-if analysis ARN with the DescribeWhatIfAnalysis operation.
 */
export const listWhatIfAnalyses = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWhatIfAnalysesRequest,
  output: ListWhatIfAnalysesResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
}));
/**
 * Returns a list of what-if forecast exports created using the CreateWhatIfForecastExport operation. For each what-if forecast export, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the what-if forecast export ARN with the DescribeWhatIfForecastExport operation.
 */
export const listWhatIfForecastExports = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListWhatIfForecastExportsRequest,
    output: ListWhatIfForecastExportsResponse,
    errors: [InvalidInputException, InvalidNextTokenException],
  }),
);
/**
 * Returns a list of what-if forecasts created using the CreateWhatIfForecast operation. For each what-if forecast, this operation returns a summary of its properties, including its Amazon Resource Name (ARN). You can retrieve the complete set of properties by using the what-if forecast ARN with the DescribeWhatIfForecast operation.
 */
export const listWhatIfForecasts = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWhatIfForecastsRequest,
  output: ListWhatIfForecastsResponse,
  errors: [InvalidInputException, InvalidNextTokenException],
}));
/**
 * Creates a dataset group, which holds a collection of related datasets. You can add
 * datasets to the dataset group when you create the dataset group, or later by using the UpdateDatasetGroup operation.
 *
 * After creating a dataset group and adding datasets, you use the dataset group when you
 * create a predictor. For more information, see Dataset groups.
 *
 * To get a list of all your datasets groups, use the ListDatasetGroups
 * operation.
 *
 * The `Status` of a dataset group must be `ACTIVE` before you can
 * use the dataset group to create a predictor. To get the status, use the DescribeDatasetGroup operation.
 */
export const createDatasetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetGroupRequest,
  output: CreateDatasetGroupResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Exports a forecast created by the CreateForecast operation to your
 * Amazon Simple Storage Service (Amazon S3) bucket. The forecast file name will match the following conventions:
 *
 * __
 *
 * where the component is in Java SimpleDateFormat
 * (yyyy-MM-ddTHH-mm-ssZ).
 *
 * You must specify a DataDestination object that includes an Identity and Access Management
 * (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see
 * aws-forecast-iam-roles.
 *
 * For more information, see howitworks-forecast.
 *
 * To get a list of all your forecast export jobs, use the ListForecastExportJobs operation.
 *
 * The `Status` of the forecast export job must be `ACTIVE` before
 * you can access the forecast in your Amazon S3 bucket. To get the status, use the DescribeForecastExportJob operation.
 */
export const createForecastExportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateForecastExportJobRequest,
    output: CreateForecastExportJobResponse,
    errors: [
      InvalidInputException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates a predictor monitor resource for an existing auto predictor. Predictor monitoring allows you to see how your predictor's performance changes over time.
 * For more information, see Predictor Monitoring.
 */
export const createMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMonitorRequest,
  output: CreateMonitorResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Exports backtest forecasts and accuracy metrics generated by the CreateAutoPredictor or CreatePredictor operations. Two
 * folders containing CSV or Parquet files are exported to your specified S3 bucket.
 *
 * The export file names will match the following conventions:
 *
 * `__.csv`
 *
 * The component is in Java SimpleDate format
 * (yyyy-MM-ddTHH-mm-ssZ).
 *
 * You must specify a DataDestination object that includes an Amazon S3
 * bucket and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3
 * bucket. For more information, see aws-forecast-iam-roles.
 *
 * The `Status` of the export job must be `ACTIVE` before you
 * can access the export in your Amazon S3 bucket. To get the status, use the DescribePredictorBacktestExportJob operation.
 */
export const createPredictorBacktestExportJob =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreatePredictorBacktestExportJobRequest,
    output: CreatePredictorBacktestExportJobResponse,
    errors: [
      InvalidInputException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }));
/**
 * What-if analysis is a scenario modeling technique where you make a hypothetical change to a time series and
 * compare the forecasts generated by these changes against the baseline, unchanged time series. It is important to
 * remember that the purpose of a what-if analysis is to understand how a forecast can change given different
 * modifications to the baseline time series.
 *
 * For example, imagine you are a clothing retailer who is considering an end of season sale
 * to clear space for new styles. After creating a baseline forecast, you can use a what-if
 * analysis to investigate how different sales tactics might affect your goals.
 *
 * You could create a scenario where everything is given a 25% markdown, and another where
 * everything is given a fixed dollar markdown. You could create a scenario where the sale lasts for one week and
 * another where the sale lasts for one month.
 * With a what-if analysis, you can compare many different scenarios against each other.
 *
 * Note that a what-if analysis is meant to display what the forecasting model has learned and how it will behave in the scenarios that you are evaluating. Do not blindly use the results of the what-if analysis to make business decisions. For instance, forecasts might not be accurate for novel scenarios where there is no reference available to determine whether a forecast is good.
 *
 * The TimeSeriesSelector object defines the items that you want in the what-if analysis.
 */
export const createWhatIfAnalysis = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWhatIfAnalysisRequest,
    output: CreateWhatIfAnalysisResponse,
    errors: [
      InvalidInputException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Exports a forecast created by the CreateWhatIfForecast operation to your
 * Amazon Simple Storage Service (Amazon S3) bucket. The forecast file name will match the following conventions:
 *
 * `≈__`
 *
 * The component is in Java SimpleDateFormat
 * (yyyy-MM-ddTHH-mm-ssZ).
 *
 * You must specify a DataDestination object that includes an Identity and Access Management
 * (IAM) role that Amazon Forecast can assume to access the Amazon S3 bucket. For more information, see
 * aws-forecast-iam-roles.
 *
 * For more information, see howitworks-forecast.
 *
 * To get a list of all your what-if forecast export jobs, use the ListWhatIfForecastExports
 * operation.
 *
 * The `Status` of the forecast export job must be `ACTIVE` before
 * you can access the forecast in your Amazon S3 bucket. To get the status, use the DescribeWhatIfForecastExport operation.
 */
export const createWhatIfForecastExport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWhatIfForecastExportRequest,
    output: CreateWhatIfForecastExportResponse,
    errors: [
      InvalidInputException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Explainability is only available for Forecasts and Predictors generated from an
 * AutoPredictor (CreateAutoPredictor)
 *
 * Creates an Amazon Forecast Explainability.
 *
 * Explainability helps you better understand how the attributes in your datasets impact
 * forecast. Amazon Forecast uses a metric called Impact scores to quantify the relative
 * impact of each attribute and determine whether they increase or decrease forecast
 * values.
 *
 * To enable Forecast Explainability, your predictor must include at least one of the
 * following: related time series, item metadata, or additional datasets like Holidays and
 * the Weather Index.
 *
 * CreateExplainability accepts either a Predictor ARN or Forecast ARN. To receive
 * aggregated Impact scores for all time series and time points in your datasets, provide a
 * Predictor ARN. To receive Impact scores for specific time series and time points,
 * provide a Forecast ARN.
 *
 * **CreateExplainability with a Predictor ARN**
 *
 * You can only have one Explainability resource per predictor. If you already
 * enabled `ExplainPredictor` in CreateAutoPredictor, that
 * predictor already has an Explainability resource.
 *
 * The following parameters are required when providing a Predictor ARN:
 *
 * - `ExplainabilityName` - A unique name for the Explainability.
 *
 * - `ResourceArn` - The Arn of the predictor.
 *
 * - `TimePointGranularity` - Must be set to “ALL”.
 *
 * - `TimeSeriesGranularity` - Must be set to “ALL”.
 *
 * Do not specify a value for the following parameters:
 *
 * - `DataSource` - Only valid when TimeSeriesGranularity is
 * “SPECIFIC”.
 *
 * - `Schema` - Only valid when TimeSeriesGranularity is
 * “SPECIFIC”.
 *
 * - `StartDateTime` - Only valid when TimePointGranularity is
 * “SPECIFIC”.
 *
 * - `EndDateTime` - Only valid when TimePointGranularity is
 * “SPECIFIC”.
 *
 * **CreateExplainability with a Forecast ARN**
 *
 * You can specify a maximum of 50 time series and 500 time points.
 *
 * The following parameters are required when providing a Predictor ARN:
 *
 * - `ExplainabilityName` - A unique name for the Explainability.
 *
 * - `ResourceArn` - The Arn of the forecast.
 *
 * - `TimePointGranularity` - Either “ALL” or “SPECIFIC”.
 *
 * - `TimeSeriesGranularity` - Either “ALL” or “SPECIFIC”.
 *
 * If you set TimeSeriesGranularity to “SPECIFIC”, you must also provide the
 * following:
 *
 * - `DataSource` - The S3 location of the CSV file specifying your time
 * series.
 *
 * - `Schema` - The Schema defines the attributes and attribute types
 * listed in the Data Source.
 *
 * If you set TimePointGranularity to “SPECIFIC”, you must also provide the
 * following:
 *
 * - `StartDateTime` - The first timestamp in the range of time
 * points.
 *
 * - `EndDateTime` - The last timestamp in the range of time
 * points.
 */
export const createExplainability = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateExplainabilityRequest,
    output: CreateExplainabilityResponse,
    errors: [
      InvalidInputException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Exports an Explainability resource created by the CreateExplainability operation. Exported files are exported to an Amazon Simple Storage Service (Amazon
 * S3) bucket.
 *
 * You must specify a DataDestination object that includes an Amazon S3
 * bucket and an Identity and Access Management (IAM) role that Amazon Forecast can assume to access the Amazon S3
 * bucket. For more information, see aws-forecast-iam-roles.
 *
 * The `Status` of the export job must be `ACTIVE` before you
 * can access the export in your Amazon S3 bucket. To get the status, use the DescribeExplainabilityExport operation.
 */
export const createExplainabilityExport = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateExplainabilityExportRequest,
    output: CreateExplainabilityExportResponse,
    errors: [
      InvalidInputException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates an Amazon Forecast dataset. The information about the dataset that you provide helps
 * Forecast understand how to consume the data for model training. This includes the
 * following:
 *
 * -
 * `DataFrequency`
 * - How frequently your historical
 * time-series data is collected.
 *
 * -
 * `Domain`
 * and
 *
 * `DatasetType`
 * - Each dataset has an associated dataset
 * domain and a type within the domain. Amazon Forecast provides a list of predefined domains and
 * types within each domain. For each unique dataset domain and type within the domain,
 * Amazon Forecast requires your data to include a minimum set of predefined fields.
 *
 * -
 * `Schema`
 * - A schema specifies the fields in the dataset,
 * including the field name and data type.
 *
 * After creating a dataset, you import your training data into it and add the dataset to a
 * dataset group. You use the dataset group to create a predictor. For more information, see
 * Importing datasets.
 *
 * To get a list of all your datasets, use the ListDatasets operation.
 *
 * For example Forecast datasets, see the Amazon Forecast Sample GitHub
 * repository.
 *
 * The `Status` of a dataset must be `ACTIVE` before you can import
 * training data. Use the DescribeDataset operation to get
 * the status.
 */
export const createDataset = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatasetRequest,
  output: CreateDatasetResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
  ],
}));
/**
 * Imports your training data to an Amazon Forecast dataset. You provide the location of your
 * training data in an Amazon Simple Storage Service (Amazon S3) bucket and the Amazon Resource Name (ARN) of the dataset
 * that you want to import the data to.
 *
 * You must specify a DataSource object that includes an
 * Identity and Access Management (IAM) role that Amazon Forecast can assume to access the data, as Amazon Forecast makes a copy
 * of your data and processes it in an internal Amazon Web Services system. For more information, see Set up
 * permissions.
 *
 * The training data must be in CSV or Parquet format. The delimiter must be a comma (,).
 *
 * You can specify the path to a specific file, the S3 bucket, or to a folder in the S3
 * bucket. For the latter two cases, Amazon Forecast imports all files up to the limit of 10,000
 * files.
 *
 * Because dataset imports are not aggregated, your most recent dataset import is the one
 * that is used when training a predictor or generating a forecast. Make sure that your most
 * recent dataset import contains all of the data you want to model off of, and not just the new
 * data collected since the previous import.
 *
 * To get a list of all your dataset import jobs, filtered by specified criteria, use the
 * ListDatasetImportJobs operation.
 */
export const createDatasetImportJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDatasetImportJobRequest,
    output: CreateDatasetImportJobResponse,
    errors: [
      InvalidInputException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates a forecast for each item in the `TARGET_TIME_SERIES` dataset that was
 * used to train the predictor. This is known as inference. To retrieve the forecast for a single
 * item at low latency, use the operation. To
 * export the complete forecast into your Amazon Simple Storage Service (Amazon S3) bucket, use the CreateForecastExportJob operation.
 *
 * The range of the forecast is determined by the `ForecastHorizon` value, which
 * you specify in the CreatePredictor request. When you query a forecast, you
 * can request a specific date range within the forecast.
 *
 * To get a list of all your forecasts, use the ListForecasts
 * operation.
 *
 * The forecasts generated by Amazon Forecast are in the same time zone as the dataset that was
 * used to create the predictor.
 *
 * For more information, see howitworks-forecast.
 *
 * The `Status` of the forecast must be `ACTIVE` before you can query
 * or export the forecast. Use the DescribeForecast operation to get the
 * status.
 *
 * By default, a forecast includes predictions for every item (`item_id`) in the dataset group that was used to train the predictor.
 * However, you can use the `TimeSeriesSelector` object to generate a forecast on a subset of time series. Forecast creation is skipped for any time series that you specify that are not in the input dataset. The forecast export file will not contain these time series or their forecasted values.
 */
export const createForecast = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateForecastRequest,
  output: CreateForecastResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * A what-if forecast is a forecast that is created from a modified version of the baseline forecast. Each
 * what-if forecast incorporates either a replacement dataset or a set of transformations to the original dataset.
 */
export const createWhatIfForecast = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateWhatIfForecastRequest,
    output: CreateWhatIfForecastResponse,
    errors: [
      InvalidInputException,
      LimitExceededException,
      ResourceAlreadyExistsException,
      ResourceInUseException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Creates an Amazon Forecast predictor.
 *
 * Amazon Forecast creates predictors with AutoPredictor, which involves applying the
 * optimal combination of algorithms to each time series in your datasets. You can use
 * CreateAutoPredictor to create new predictors or upgrade/retrain
 * existing predictors.
 *
 * **Creating new predictors**
 *
 * The following parameters are required when creating a new predictor:
 *
 * - `PredictorName` - A unique name for the predictor.
 *
 * - `DatasetGroupArn` - The ARN of the dataset group used to train the
 * predictor.
 *
 * - `ForecastFrequency` - The granularity of your forecasts (hourly,
 * daily, weekly, etc).
 *
 * - `ForecastHorizon` - The number of time-steps that the model
 * predicts. The forecast horizon is also called the prediction length.
 *
 * When creating a new predictor, do not specify a value for
 * `ReferencePredictorArn`.
 *
 * **Upgrading and retraining predictors**
 *
 * The following parameters are required when retraining or upgrading a predictor:
 *
 * - `PredictorName` - A unique name for the predictor.
 *
 * - `ReferencePredictorArn` - The ARN of the predictor to retrain or
 * upgrade.
 *
 * When upgrading or retraining a predictor, only specify values for the
 * `ReferencePredictorArn` and `PredictorName`.
 */
export const createAutoPredictor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateAutoPredictorRequest,
  output: CreateAutoPredictorResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Describes a monitor resource. In addition to listing the properties provided in the CreateMonitor request, this operation lists the following properties:
 *
 * - `Baseline`
 *
 * - `CreationTime`
 *
 * - `LastEvaluationTime`
 *
 * - `LastEvaluationState`
 *
 * - `LastModificationTime`
 *
 * - `Message`
 *
 * - `Status`
 */
export const describeMonitor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeMonitorRequest,
  output: DescribeMonitorResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * This operation is only valid for legacy predictors created with CreatePredictor. If you
 * are not using a legacy predictor, use DescribeAutoPredictor.
 *
 * Describes a predictor created using the CreatePredictor
 * operation.
 *
 * In addition to listing the properties provided in the `CreatePredictor`
 * request, this operation lists the following properties:
 *
 * - `DatasetImportJobArns` - The dataset import jobs used to import training
 * data.
 *
 * - `AutoMLAlgorithmArns` - If AutoML is performed, the algorithms that were
 * evaluated.
 *
 * - `CreationTime`
 *
 * - `LastModificationTime`
 *
 * - `Status`
 *
 * - `Message` - If an error occurred, information about the error.
 */
export const describePredictor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribePredictorRequest,
  output: DescribePredictorResponse,
  errors: [InvalidInputException, ResourceNotFoundException],
}));
/**
 * This operation creates a legacy predictor that does not include all the predictor
 * functionalities provided by Amazon Forecast. To create a predictor that is compatible with all
 * aspects of Forecast, use CreateAutoPredictor.
 *
 * Creates an Amazon Forecast predictor.
 *
 * In the request, provide a dataset group and either specify an algorithm or let Amazon Forecast
 * choose an algorithm for you using AutoML. If you specify an algorithm, you also can override
 * algorithm-specific hyperparameters.
 *
 * Amazon Forecast uses the algorithm to train a predictor using the latest version of the datasets
 * in the specified dataset group. You can then generate a forecast using the CreateForecast operation.
 *
 * To see the evaluation metrics, use the GetAccuracyMetrics operation.
 *
 * You can specify a featurization configuration to fill and aggregate the data fields in the
 * `TARGET_TIME_SERIES` dataset to improve model training. For more information, see
 * FeaturizationConfig.
 *
 * For RELATED_TIME_SERIES datasets, `CreatePredictor` verifies that the
 * `DataFrequency` specified when the dataset was created matches the
 * `ForecastFrequency`. TARGET_TIME_SERIES datasets don't have this restriction.
 * Amazon Forecast also verifies the delimiter and timestamp format. For more information, see howitworks-datasets-groups.
 *
 * By default, predictors are trained and evaluated at the 0.1 (P10), 0.5 (P50), and 0.9
 * (P90) quantiles. You can choose custom forecast types to train and evaluate your predictor by
 * setting the `ForecastTypes`.
 *
 * **AutoML**
 *
 * If you want Amazon Forecast to evaluate each algorithm and choose the one that minimizes the
 * `objective function`, set `PerformAutoML` to `true`. The
 * `objective function` is defined as the mean of the weighted losses over the
 * forecast types. By default, these are the p10, p50, and p90 quantile losses. For more
 * information, see EvaluationResult.
 *
 * When AutoML is enabled, the following properties are disallowed:
 *
 * - `AlgorithmArn`
 *
 * - `HPOConfig`
 *
 * - `PerformHPO`
 *
 * - `TrainingParameters`
 *
 * To get a list of all of your predictors, use the ListPredictors
 * operation.
 *
 * Before you can use the predictor to create a forecast, the `Status` of the
 * predictor must be `ACTIVE`, signifying that training has completed. To get the
 * status, use the DescribePredictor operation.
 */
export const createPredictor = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePredictorRequest,
  output: CreatePredictorResponse,
  errors: [
    InvalidInputException,
    LimitExceededException,
    ResourceAlreadyExistsException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
/**
 * Provides metrics on the accuracy of the models that were trained by the CreatePredictor operation. Use metrics to see how well the model performed and
 * to decide whether to use the predictor to generate a forecast. For more information, see
 * Predictor
 * Metrics.
 *
 * This operation generates metrics for each backtest window that was evaluated. The number
 * of backtest windows (`NumberOfBacktestWindows`) is specified using the EvaluationParameters object, which is optionally included in the
 * `CreatePredictor` request. If `NumberOfBacktestWindows` isn't
 * specified, the number defaults to one.
 *
 * The parameters of the `filling` method determine which items contribute to the
 * metrics. If you want all items to contribute, specify `zero`. If you want only
 * those items that have complete data in the range being evaluated to contribute, specify
 * `nan`. For more information, see FeaturizationMethod.
 *
 * Before you can get accuracy metrics, the `Status` of the predictor must be
 * `ACTIVE`, signifying that training has completed. To get the status, use the
 * DescribePredictor operation.
 */
export const getAccuracyMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAccuracyMetricsRequest,
  output: GetAccuracyMetricsResponse,
  errors: [
    InvalidInputException,
    ResourceInUseException,
    ResourceNotFoundException,
  ],
}));
