import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const ns = T.XmlNamespace(
  "http://machinelearning.amazonaws.com/doc/2014-12-12/",
);
const svc = T.AwsApiService({
  sdkId: "Machine Learning",
  serviceShapeName: "AmazonML_20141212",
});
const auth = T.AwsAuthSigv4({ name: "machinelearning" });
const ver = T.ServiceVersion("2014-12-12");
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
                        url: "https://machinelearning-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://machinelearning-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://machinelearning.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://machinelearning.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export class CreateBatchPredictionInput extends S.Class<CreateBatchPredictionInput>(
  "CreateBatchPredictionInput",
)(
  {
    BatchPredictionId: S.String,
    BatchPredictionName: S.optional(S.String),
    MLModelId: S.String,
    BatchPredictionDataSourceId: S.String,
    OutputUri: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEvaluationInput extends S.Class<CreateEvaluationInput>(
  "CreateEvaluationInput",
)(
  {
    EvaluationId: S.String,
    EvaluationName: S.optional(S.String),
    MLModelId: S.String,
    EvaluationDataSourceId: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateRealtimeEndpointInput extends S.Class<CreateRealtimeEndpointInput>(
  "CreateRealtimeEndpointInput",
)(
  { MLModelId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBatchPredictionInput extends S.Class<DeleteBatchPredictionInput>(
  "DeleteBatchPredictionInput",
)(
  { BatchPredictionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDataSourceInput extends S.Class<DeleteDataSourceInput>(
  "DeleteDataSourceInput",
)(
  { DataSourceId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteEvaluationInput extends S.Class<DeleteEvaluationInput>(
  "DeleteEvaluationInput",
)(
  { EvaluationId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMLModelInput extends S.Class<DeleteMLModelInput>(
  "DeleteMLModelInput",
)(
  { MLModelId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteRealtimeEndpointInput extends S.Class<DeleteRealtimeEndpointInput>(
  "DeleteRealtimeEndpointInput",
)(
  { MLModelId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTagsInput extends S.Class<DeleteTagsInput>(
  "DeleteTagsInput",
)(
  { TagKeys: TagKeyList, ResourceId: S.String, ResourceType: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBatchPredictionsInput extends S.Class<DescribeBatchPredictionsInput>(
  "DescribeBatchPredictionsInput",
)(
  {
    FilterVariable: S.optional(S.String),
    EQ: S.optional(S.String),
    GT: S.optional(S.String),
    LT: S.optional(S.String),
    GE: S.optional(S.String),
    LE: S.optional(S.String),
    NE: S.optional(S.String),
    Prefix: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDataSourcesInput extends S.Class<DescribeDataSourcesInput>(
  "DescribeDataSourcesInput",
)(
  {
    FilterVariable: S.optional(S.String),
    EQ: S.optional(S.String),
    GT: S.optional(S.String),
    LT: S.optional(S.String),
    GE: S.optional(S.String),
    LE: S.optional(S.String),
    NE: S.optional(S.String),
    Prefix: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEvaluationsInput extends S.Class<DescribeEvaluationsInput>(
  "DescribeEvaluationsInput",
)(
  {
    FilterVariable: S.optional(S.String),
    EQ: S.optional(S.String),
    GT: S.optional(S.String),
    LT: S.optional(S.String),
    GE: S.optional(S.String),
    LE: S.optional(S.String),
    NE: S.optional(S.String),
    Prefix: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeMLModelsInput extends S.Class<DescribeMLModelsInput>(
  "DescribeMLModelsInput",
)(
  {
    FilterVariable: S.optional(S.String),
    EQ: S.optional(S.String),
    GT: S.optional(S.String),
    LT: S.optional(S.String),
    GE: S.optional(S.String),
    LE: S.optional(S.String),
    NE: S.optional(S.String),
    Prefix: S.optional(S.String),
    SortOrder: S.optional(S.String),
    NextToken: S.optional(S.String),
    Limit: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTagsInput extends S.Class<DescribeTagsInput>(
  "DescribeTagsInput",
)(
  { ResourceId: S.String, ResourceType: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBatchPredictionInput extends S.Class<GetBatchPredictionInput>(
  "GetBatchPredictionInput",
)(
  { BatchPredictionId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDataSourceInput extends S.Class<GetDataSourceInput>(
  "GetDataSourceInput",
)(
  { DataSourceId: S.String, Verbose: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetEvaluationInput extends S.Class<GetEvaluationInput>(
  "GetEvaluationInput",
)(
  { EvaluationId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMLModelInput extends S.Class<GetMLModelInput>(
  "GetMLModelInput",
)(
  { MLModelId: S.String, Verbose: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateBatchPredictionInput extends S.Class<UpdateBatchPredictionInput>(
  "UpdateBatchPredictionInput",
)(
  { BatchPredictionId: S.String, BatchPredictionName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDataSourceInput extends S.Class<UpdateDataSourceInput>(
  "UpdateDataSourceInput",
)(
  { DataSourceId: S.String, DataSourceName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateEvaluationInput extends S.Class<UpdateEvaluationInput>(
  "UpdateEvaluationInput",
)(
  { EvaluationId: S.String, EvaluationName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateMLModelInput extends S.Class<UpdateMLModelInput>(
  "UpdateMLModelInput",
)(
  {
    MLModelId: S.String,
    MLModelName: S.optional(S.String),
    ScoreThreshold: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const EDPSecurityGroupIds = S.Array(S.String);
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class S3DataSpec extends S.Class<S3DataSpec>("S3DataSpec")({
  DataLocationS3: S.String,
  DataRearrangement: S.optional(S.String),
  DataSchema: S.optional(S.String),
  DataSchemaLocationS3: S.optional(S.String),
}) {}
export const TrainingParameters = S.Record({ key: S.String, value: S.String });
export const Record = S.Record({ key: S.String, value: S.String });
export class AddTagsInput extends S.Class<AddTagsInput>("AddTagsInput")(
  { Tags: TagList, ResourceId: S.String, ResourceType: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateBatchPredictionOutput extends S.Class<CreateBatchPredictionOutput>(
  "CreateBatchPredictionOutput",
)({ BatchPredictionId: S.optional(S.String) }, ns) {}
export class CreateDataSourceFromS3Input extends S.Class<CreateDataSourceFromS3Input>(
  "CreateDataSourceFromS3Input",
)(
  {
    DataSourceId: S.String,
    DataSourceName: S.optional(S.String),
    DataSpec: S3DataSpec,
    ComputeStatistics: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateEvaluationOutput extends S.Class<CreateEvaluationOutput>(
  "CreateEvaluationOutput",
)({ EvaluationId: S.optional(S.String) }, ns) {}
export class CreateMLModelInput extends S.Class<CreateMLModelInput>(
  "CreateMLModelInput",
)(
  {
    MLModelId: S.String,
    MLModelName: S.optional(S.String),
    MLModelType: S.String,
    Parameters: S.optional(TrainingParameters),
    TrainingDataSourceId: S.String,
    Recipe: S.optional(S.String),
    RecipeUri: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBatchPredictionOutput extends S.Class<DeleteBatchPredictionOutput>(
  "DeleteBatchPredictionOutput",
)({ BatchPredictionId: S.optional(S.String) }, ns) {}
export class DeleteDataSourceOutput extends S.Class<DeleteDataSourceOutput>(
  "DeleteDataSourceOutput",
)({ DataSourceId: S.optional(S.String) }, ns) {}
export class DeleteEvaluationOutput extends S.Class<DeleteEvaluationOutput>(
  "DeleteEvaluationOutput",
)({ EvaluationId: S.optional(S.String) }, ns) {}
export class DeleteMLModelOutput extends S.Class<DeleteMLModelOutput>(
  "DeleteMLModelOutput",
)({ MLModelId: S.optional(S.String) }, ns) {}
export class RealtimeEndpointInfo extends S.Class<RealtimeEndpointInfo>(
  "RealtimeEndpointInfo",
)({
  PeakRequestsPerSecond: S.optional(S.Number),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndpointUrl: S.optional(S.String),
  EndpointStatus: S.optional(S.String),
}) {}
export class DeleteRealtimeEndpointOutput extends S.Class<DeleteRealtimeEndpointOutput>(
  "DeleteRealtimeEndpointOutput",
)(
  {
    MLModelId: S.optional(S.String),
    RealtimeEndpointInfo: S.optional(RealtimeEndpointInfo),
  },
  ns,
) {}
export class DeleteTagsOutput extends S.Class<DeleteTagsOutput>(
  "DeleteTagsOutput",
)(
  { ResourceId: S.optional(S.String), ResourceType: S.optional(S.String) },
  ns,
) {}
export class DescribeTagsOutput extends S.Class<DescribeTagsOutput>(
  "DescribeTagsOutput",
)(
  {
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  ns,
) {}
export class GetBatchPredictionOutput extends S.Class<GetBatchPredictionOutput>(
  "GetBatchPredictionOutput",
)(
  {
    BatchPredictionId: S.optional(S.String),
    MLModelId: S.optional(S.String),
    BatchPredictionDataSourceId: S.optional(S.String),
    InputDataLocationS3: S.optional(S.String),
    CreatedByIamUser: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    OutputUri: S.optional(S.String),
    LogUri: S.optional(S.String),
    Message: S.optional(S.String),
    ComputeTime: S.optional(S.Number),
    FinishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TotalRecordCount: S.optional(S.Number),
    InvalidRecordCount: S.optional(S.Number),
  },
  ns,
) {}
export class GetMLModelOutput extends S.Class<GetMLModelOutput>(
  "GetMLModelOutput",
)(
  {
    MLModelId: S.optional(S.String),
    TrainingDataSourceId: S.optional(S.String),
    CreatedByIamUser: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    SizeInBytes: S.optional(S.Number),
    EndpointInfo: S.optional(RealtimeEndpointInfo),
    TrainingParameters: S.optional(TrainingParameters),
    InputDataLocationS3: S.optional(S.String),
    MLModelType: S.optional(S.String),
    ScoreThreshold: S.optional(S.Number),
    ScoreThresholdLastUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LogUri: S.optional(S.String),
    Message: S.optional(S.String),
    ComputeTime: S.optional(S.Number),
    FinishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Recipe: S.optional(S.String),
    Schema: S.optional(S.String),
  },
  ns,
) {}
export class PredictInput extends S.Class<PredictInput>("PredictInput")(
  { MLModelId: S.String, Record: Record, PredictEndpoint: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateBatchPredictionOutput extends S.Class<UpdateBatchPredictionOutput>(
  "UpdateBatchPredictionOutput",
)({ BatchPredictionId: S.optional(S.String) }, ns) {}
export class UpdateDataSourceOutput extends S.Class<UpdateDataSourceOutput>(
  "UpdateDataSourceOutput",
)({ DataSourceId: S.optional(S.String) }, ns) {}
export class UpdateEvaluationOutput extends S.Class<UpdateEvaluationOutput>(
  "UpdateEvaluationOutput",
)({ EvaluationId: S.optional(S.String) }, ns) {}
export class UpdateMLModelOutput extends S.Class<UpdateMLModelOutput>(
  "UpdateMLModelOutput",
)({ MLModelId: S.optional(S.String) }, ns) {}
export class RDSDatabase extends S.Class<RDSDatabase>("RDSDatabase")({
  InstanceIdentifier: S.String,
  DatabaseName: S.String,
}) {}
export class RDSDatabaseCredentials extends S.Class<RDSDatabaseCredentials>(
  "RDSDatabaseCredentials",
)({ Username: S.String, Password: S.String }) {}
export class RedshiftDatabase extends S.Class<RedshiftDatabase>(
  "RedshiftDatabase",
)({ DatabaseName: S.String, ClusterIdentifier: S.String }) {}
export class RedshiftDatabaseCredentials extends S.Class<RedshiftDatabaseCredentials>(
  "RedshiftDatabaseCredentials",
)({ Username: S.String, Password: S.String }) {}
export class RDSDataSpec extends S.Class<RDSDataSpec>("RDSDataSpec")({
  DatabaseInformation: RDSDatabase,
  SelectSqlQuery: S.String,
  DatabaseCredentials: RDSDatabaseCredentials,
  S3StagingLocation: S.String,
  DataRearrangement: S.optional(S.String),
  DataSchema: S.optional(S.String),
  DataSchemaUri: S.optional(S.String),
  ResourceRole: S.String,
  ServiceRole: S.String,
  SubnetId: S.String,
  SecurityGroupIds: EDPSecurityGroupIds,
}) {}
export class RedshiftDataSpec extends S.Class<RedshiftDataSpec>(
  "RedshiftDataSpec",
)({
  DatabaseInformation: RedshiftDatabase,
  SelectSqlQuery: S.String,
  DatabaseCredentials: RedshiftDatabaseCredentials,
  S3StagingLocation: S.String,
  DataRearrangement: S.optional(S.String),
  DataSchema: S.optional(S.String),
  DataSchemaUri: S.optional(S.String),
}) {}
export class BatchPrediction extends S.Class<BatchPrediction>(
  "BatchPrediction",
)({
  BatchPredictionId: S.optional(S.String),
  MLModelId: S.optional(S.String),
  BatchPredictionDataSourceId: S.optional(S.String),
  InputDataLocationS3: S.optional(S.String),
  CreatedByIamUser: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  OutputUri: S.optional(S.String),
  Message: S.optional(S.String),
  ComputeTime: S.optional(S.Number),
  FinishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TotalRecordCount: S.optional(S.Number),
  InvalidRecordCount: S.optional(S.Number),
}) {}
export const BatchPredictions = S.Array(BatchPrediction);
export class RedshiftMetadata extends S.Class<RedshiftMetadata>(
  "RedshiftMetadata",
)({
  RedshiftDatabase: S.optional(RedshiftDatabase),
  DatabaseUserName: S.optional(S.String),
  SelectSqlQuery: S.optional(S.String),
}) {}
export class RDSMetadata extends S.Class<RDSMetadata>("RDSMetadata")({
  Database: S.optional(RDSDatabase),
  DatabaseUserName: S.optional(S.String),
  SelectSqlQuery: S.optional(S.String),
  ResourceRole: S.optional(S.String),
  ServiceRole: S.optional(S.String),
  DataPipelineId: S.optional(S.String),
}) {}
export class DataSource extends S.Class<DataSource>("DataSource")({
  DataSourceId: S.optional(S.String),
  DataLocationS3: S.optional(S.String),
  DataRearrangement: S.optional(S.String),
  CreatedByIamUser: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DataSizeInBytes: S.optional(S.Number),
  NumberOfFiles: S.optional(S.Number),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
  RedshiftMetadata: S.optional(RedshiftMetadata),
  RDSMetadata: S.optional(RDSMetadata),
  RoleARN: S.optional(S.String),
  ComputeStatistics: S.optional(S.Boolean),
  ComputeTime: S.optional(S.Number),
  FinishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DataSources = S.Array(DataSource);
export const PerformanceMetricsProperties = S.Record({
  key: S.String,
  value: S.String,
});
export class PerformanceMetrics extends S.Class<PerformanceMetrics>(
  "PerformanceMetrics",
)({ Properties: S.optional(PerformanceMetricsProperties) }) {}
export class Evaluation extends S.Class<Evaluation>("Evaluation")({
  EvaluationId: S.optional(S.String),
  MLModelId: S.optional(S.String),
  EvaluationDataSourceId: S.optional(S.String),
  InputDataLocationS3: S.optional(S.String),
  CreatedByIamUser: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  PerformanceMetrics: S.optional(PerformanceMetrics),
  Message: S.optional(S.String),
  ComputeTime: S.optional(S.Number),
  FinishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const Evaluations = S.Array(Evaluation);
export class MLModel extends S.Class<MLModel>("MLModel")({
  MLModelId: S.optional(S.String),
  TrainingDataSourceId: S.optional(S.String),
  CreatedByIamUser: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Name: S.optional(S.String),
  Status: S.optional(S.String),
  SizeInBytes: S.optional(S.Number),
  EndpointInfo: S.optional(RealtimeEndpointInfo),
  TrainingParameters: S.optional(TrainingParameters),
  InputDataLocationS3: S.optional(S.String),
  Algorithm: S.optional(S.String),
  MLModelType: S.optional(S.String),
  ScoreThreshold: S.optional(S.Number),
  ScoreThresholdLastUpdatedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Message: S.optional(S.String),
  ComputeTime: S.optional(S.Number),
  FinishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const MLModels = S.Array(MLModel);
export class AddTagsOutput extends S.Class<AddTagsOutput>("AddTagsOutput")(
  { ResourceId: S.optional(S.String), ResourceType: S.optional(S.String) },
  ns,
) {}
export class CreateDataSourceFromRDSInput extends S.Class<CreateDataSourceFromRDSInput>(
  "CreateDataSourceFromRDSInput",
)(
  {
    DataSourceId: S.String,
    DataSourceName: S.optional(S.String),
    RDSData: RDSDataSpec,
    RoleARN: S.String,
    ComputeStatistics: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDataSourceFromRedshiftInput extends S.Class<CreateDataSourceFromRedshiftInput>(
  "CreateDataSourceFromRedshiftInput",
)(
  {
    DataSourceId: S.String,
    DataSourceName: S.optional(S.String),
    DataSpec: RedshiftDataSpec,
    RoleARN: S.String,
    ComputeStatistics: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDataSourceFromS3Output extends S.Class<CreateDataSourceFromS3Output>(
  "CreateDataSourceFromS3Output",
)({ DataSourceId: S.optional(S.String) }, ns) {}
export class CreateMLModelOutput extends S.Class<CreateMLModelOutput>(
  "CreateMLModelOutput",
)({ MLModelId: S.optional(S.String) }, ns) {}
export class CreateRealtimeEndpointOutput extends S.Class<CreateRealtimeEndpointOutput>(
  "CreateRealtimeEndpointOutput",
)(
  {
    MLModelId: S.optional(S.String),
    RealtimeEndpointInfo: S.optional(RealtimeEndpointInfo),
  },
  ns,
) {}
export class DescribeBatchPredictionsOutput extends S.Class<DescribeBatchPredictionsOutput>(
  "DescribeBatchPredictionsOutput",
)(
  { Results: S.optional(BatchPredictions), NextToken: S.optional(S.String) },
  ns,
) {}
export class DescribeDataSourcesOutput extends S.Class<DescribeDataSourcesOutput>(
  "DescribeDataSourcesOutput",
)({ Results: S.optional(DataSources), NextToken: S.optional(S.String) }, ns) {}
export class DescribeEvaluationsOutput extends S.Class<DescribeEvaluationsOutput>(
  "DescribeEvaluationsOutput",
)({ Results: S.optional(Evaluations), NextToken: S.optional(S.String) }, ns) {}
export class DescribeMLModelsOutput extends S.Class<DescribeMLModelsOutput>(
  "DescribeMLModelsOutput",
)({ Results: S.optional(MLModels), NextToken: S.optional(S.String) }, ns) {}
export class GetDataSourceOutput extends S.Class<GetDataSourceOutput>(
  "GetDataSourceOutput",
)(
  {
    DataSourceId: S.optional(S.String),
    DataLocationS3: S.optional(S.String),
    DataRearrangement: S.optional(S.String),
    CreatedByIamUser: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DataSizeInBytes: S.optional(S.Number),
    NumberOfFiles: S.optional(S.Number),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    LogUri: S.optional(S.String),
    Message: S.optional(S.String),
    RedshiftMetadata: S.optional(RedshiftMetadata),
    RDSMetadata: S.optional(RDSMetadata),
    RoleARN: S.optional(S.String),
    ComputeStatistics: S.optional(S.Boolean),
    ComputeTime: S.optional(S.Number),
    FinishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DataSourceSchema: S.optional(S.String),
  },
  ns,
) {}
export class CreateDataSourceFromRDSOutput extends S.Class<CreateDataSourceFromRDSOutput>(
  "CreateDataSourceFromRDSOutput",
)({ DataSourceId: S.optional(S.String) }, ns) {}
export class CreateDataSourceFromRedshiftOutput extends S.Class<CreateDataSourceFromRedshiftOutput>(
  "CreateDataSourceFromRedshiftOutput",
)({ DataSourceId: S.optional(S.String) }, ns) {}
export class GetEvaluationOutput extends S.Class<GetEvaluationOutput>(
  "GetEvaluationOutput",
)(
  {
    EvaluationId: S.optional(S.String),
    MLModelId: S.optional(S.String),
    EvaluationDataSourceId: S.optional(S.String),
    InputDataLocationS3: S.optional(S.String),
    CreatedByIamUser: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Name: S.optional(S.String),
    Status: S.optional(S.String),
    PerformanceMetrics: S.optional(PerformanceMetrics),
    LogUri: S.optional(S.String),
    Message: S.optional(S.String),
    ComputeTime: S.optional(S.Number),
    FinishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  ns,
) {}
export const ScoreValuePerLabelMap = S.Record({
  key: S.String,
  value: S.Number,
});
export const DetailsMap = S.Record({ key: S.String, value: S.String });
export class Prediction extends S.Class<Prediction>("Prediction")({
  predictedLabel: S.optional(S.String),
  predictedValue: S.optional(S.Number),
  predictedScores: S.optional(ScoreValuePerLabelMap),
  details: S.optional(DetailsMap),
}) {}
export class PredictOutput extends S.Class<PredictOutput>("PredictOutput")(
  { Prediction: S.optional(Prediction) },
  ns,
) {}

//# Errors
export class IdempotentParameterMismatchException extends S.TaggedError<IdempotentParameterMismatchException>()(
  "IdempotentParameterMismatchException",
  { message: S.optional(S.String), code: S.optional(S.Number) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String), code: S.optional(S.Number) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  { message: S.optional(S.String), code: S.optional(S.Number) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String), code: S.optional(S.Number) },
) {}
export class InvalidTagException extends S.TaggedError<InvalidTagException>()(
  "InvalidTagException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String), code: S.optional(S.Number) },
) {}
export class TagLimitExceededException extends S.TaggedError<TagLimitExceededException>()(
  "TagLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class PredictorNotMountedException extends S.TaggedError<PredictorNotMountedException>()(
  "PredictorNotMountedException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Returns a list of `BatchPrediction` operations that match the search criteria in the request.
 */
export const describeBatchPredictions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeBatchPredictionsInput,
    output: DescribeBatchPredictionsOutput,
    errors: [InternalServerException, InvalidInputException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Results",
      pageSize: "Limit",
    } as const,
  }));
/**
 * Returns a list of `DataSource` that match the search criteria in the request.
 */
export const describeDataSources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeDataSourcesInput,
    output: DescribeDataSourcesOutput,
    errors: [InternalServerException, InvalidInputException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Results",
      pageSize: "Limit",
    } as const,
  }));
/**
 * Returns a list of `DescribeEvaluations` that match the search criteria in the request.
 */
export const describeEvaluations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: DescribeEvaluationsInput,
    output: DescribeEvaluationsOutput,
    errors: [InternalServerException, InvalidInputException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Results",
      pageSize: "Limit",
    } as const,
  }));
/**
 * Returns a list of `MLModel` that match the search criteria in the request.
 */
export const describeMLModels = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: DescribeMLModelsInput,
    output: DescribeMLModelsOutput,
    errors: [InternalServerException, InvalidInputException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "Results",
      pageSize: "Limit",
    } as const,
  }),
);
/**
 * Creates a new `Evaluation` of an `MLModel`. An `MLModel` is evaluated on a set of observations associated to a `DataSource`. Like a `DataSource`
 * for an `MLModel`, the `DataSource` for an `Evaluation` contains values for the `Target Variable`. The `Evaluation` compares the predicted result for each observation to the actual outcome and provides a
 * summary so that you know how effective the `MLModel` functions on the test
 * data. Evaluation generates a relevant performance metric, such as BinaryAUC, RegressionRMSE or MulticlassAvgFScore based on the corresponding `MLModelType`: `BINARY`, `REGRESSION` or `MULTICLASS`.
 *
 * `CreateEvaluation` is an asynchronous operation. In response to `CreateEvaluation`, Amazon Machine Learning (Amazon ML) immediately
 * returns and sets the evaluation status to `PENDING`. After the `Evaluation` is created and ready for use,
 * Amazon ML sets the status to `COMPLETED`.
 *
 * You can use the `GetEvaluation` operation to check progress of the evaluation during the creation operation.
 */
export const createEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateEvaluationInput,
  output: CreateEvaluationOutput,
  errors: [
    IdempotentParameterMismatchException,
    InternalServerException,
    InvalidInputException,
  ],
}));
/**
 * Generates predictions for a group of observations. The observations to process exist in one or more data files referenced
 * by a `DataSource`. This operation creates a new `BatchPrediction`, and uses an `MLModel` and the data
 * files referenced by the `DataSource` as information sources.
 *
 * `CreateBatchPrediction` is an asynchronous operation. In response to `CreateBatchPrediction`,
 * Amazon Machine Learning (Amazon ML) immediately returns and sets the `BatchPrediction` status to `PENDING`.
 * After the `BatchPrediction` completes, Amazon ML sets the status to `COMPLETED`.
 *
 * You can poll for status updates by using the GetBatchPrediction operation and checking the `Status` parameter of the result. After the `COMPLETED` status appears,
 * the results are available in the location specified by the `OutputUri` parameter.
 */
export const createBatchPrediction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateBatchPredictionInput,
    output: CreateBatchPredictionOutput,
    errors: [
      IdempotentParameterMismatchException,
      InternalServerException,
      InvalidInputException,
    ],
  }),
);
/**
 * Creates a `DataSource` object. A `DataSource` references data that
 * can be used to perform `CreateMLModel`, `CreateEvaluation`, or
 * `CreateBatchPrediction` operations.
 *
 * `CreateDataSourceFromS3` is an asynchronous operation. In response to
 * `CreateDataSourceFromS3`, Amazon Machine Learning (Amazon ML) immediately
 * returns and sets the `DataSource` status to `PENDING`. After the
 * `DataSource` has been created and is ready for use, Amazon ML sets the
 * `Status` parameter to `COMPLETED`. `DataSource` in
 * the `COMPLETED` or `PENDING` state can be used to perform only
 * `CreateMLModel`, `CreateEvaluation` or
 * `CreateBatchPrediction` operations.
 *
 * If Amazon ML can't accept the input source, it sets the `Status` parameter to
 * `FAILED` and includes an error message in the `Message`
 * attribute of the `GetDataSource` operation response.
 *
 * The observation data used in a `DataSource` should be ready to use; that is,
 * it should have a consistent structure, and missing data values should be kept to a
 * minimum. The observation data must reside in one or more .csv files in an Amazon Simple
 * Storage Service (Amazon S3) location, along with a schema that describes the data items
 * by name and type. The same schema must be used for all of the data files referenced by
 * the `DataSource`.
 *
 * After the `DataSource` has been created, it's ready to use in evaluations and
 * batch predictions. If you plan to use the `DataSource` to train an
 * `MLModel`, the `DataSource` also needs a recipe. A recipe
 * describes how each input variable will be used in training an `MLModel`. Will
 * the variable be included or excluded from training? Will the variable be manipulated;
 * for example, will it be combined with another variable or will it be split apart into
 * word combinations? The recipe provides answers to these questions.
 */
export const createDataSourceFromS3 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDataSourceFromS3Input,
    output: CreateDataSourceFromS3Output,
    errors: [
      IdempotentParameterMismatchException,
      InternalServerException,
      InvalidInputException,
    ],
  }),
);
/**
 * Creates a new `MLModel` using the `DataSource` and the recipe as
 * information sources.
 *
 * An `MLModel` is nearly immutable. Users can update only the
 * `MLModelName` and the `ScoreThreshold` in an
 * `MLModel` without creating a new `MLModel`.
 *
 * `CreateMLModel` is an asynchronous operation. In response to
 * `CreateMLModel`, Amazon Machine Learning (Amazon ML) immediately returns
 * and sets the `MLModel` status to `PENDING`. After the
 * `MLModel` has been created and ready is for use, Amazon ML sets the
 * status to `COMPLETED`.
 *
 * You can use the `GetMLModel` operation to check the progress of the
 * `MLModel` during the creation operation.
 *
 * `CreateMLModel` requires a `DataSource` with computed statistics,
 * which can be created by setting `ComputeStatistics` to `true` in
 * `CreateDataSourceFromRDS`, `CreateDataSourceFromS3`, or
 * `CreateDataSourceFromRedshift` operations.
 */
export const createMLModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMLModelInput,
  output: CreateMLModelOutput,
  errors: [
    IdempotentParameterMismatchException,
    InternalServerException,
    InvalidInputException,
  ],
}));
/**
 * Creates a `DataSource` object from an Amazon Relational Database Service (Amazon RDS). A `DataSource` references data that can be used to perform `CreateMLModel`, `CreateEvaluation`, or `CreateBatchPrediction` operations.
 *
 * `CreateDataSourceFromRDS` is an asynchronous operation. In response to `CreateDataSourceFromRDS`,
 * Amazon Machine Learning (Amazon ML) immediately returns and sets the `DataSource` status to `PENDING`.
 * After the `DataSource` is created and ready for use, Amazon ML sets the `Status` parameter to `COMPLETED`.
 * `DataSource` in the `COMPLETED` or `PENDING` state can
 * be used only to perform `>CreateMLModel`>, `CreateEvaluation`, or `CreateBatchPrediction` operations.
 *
 * If Amazon ML cannot accept the input source, it sets the `Status` parameter to `FAILED` and includes an error message in the `Message` attribute of the `GetDataSource` operation response.
 */
export const createDataSourceFromRDS = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDataSourceFromRDSInput,
    output: CreateDataSourceFromRDSOutput,
    errors: [
      IdempotentParameterMismatchException,
      InternalServerException,
      InvalidInputException,
    ],
  }),
);
/**
 * Creates a `DataSource` from a database hosted on an Amazon Redshift cluster. A
 * `DataSource` references data that can be used to perform either `CreateMLModel`, `CreateEvaluation`, or `CreateBatchPrediction`
 * operations.
 *
 * `CreateDataSourceFromRedshift` is an asynchronous operation. In response to `CreateDataSourceFromRedshift`, Amazon Machine Learning (Amazon ML) immediately returns and sets the `DataSource` status to `PENDING`.
 * After the `DataSource` is created and ready for use, Amazon ML sets the `Status` parameter to `COMPLETED`.
 * `DataSource` in `COMPLETED` or `PENDING` states can be
 * used to perform only `CreateMLModel`, `CreateEvaluation`, or `CreateBatchPrediction` operations.
 *
 * If Amazon ML can't accept the input source, it sets the `Status` parameter to `FAILED` and includes an error message in the `Message`
 * attribute of the `GetDataSource` operation response.
 *
 * The observations should be contained in the database hosted on an Amazon Redshift cluster
 * and should be specified by a `SelectSqlQuery` query. Amazon ML executes an
 * `Unload` command in Amazon Redshift to transfer the result set of
 * the `SelectSqlQuery` query to `S3StagingLocation`.
 *
 * After the `DataSource` has been created, it's ready for use in evaluations and
 * batch predictions. If you plan to use the `DataSource` to train an
 * `MLModel`, the `DataSource` also requires a recipe. A recipe
 * describes how each input variable will be used in training an `MLModel`. Will
 * the variable be included or excluded from training? Will the variable be manipulated;
 * for example, will it be combined with another variable or will it be split apart into
 * word combinations? The recipe provides answers to these questions.
 *
 * You can't change an existing datasource, but you can copy and modify the settings from an
 * existing Amazon Redshift datasource to create a new datasource. To do so, call
 * `GetDataSource` for an existing datasource and copy the values to a
 * `CreateDataSource` call. Change the settings that you want to change and
 * make sure that all required fields have the appropriate values.
 */
export const createDataSourceFromRedshift =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateDataSourceFromRedshiftInput,
    output: CreateDataSourceFromRedshiftOutput,
    errors: [
      IdempotentParameterMismatchException,
      InternalServerException,
      InvalidInputException,
    ],
  }));
/**
 * Assigns the DELETED status to a `BatchPrediction`, rendering it unusable.
 *
 * After using the `DeleteBatchPrediction` operation, you can use the GetBatchPrediction
 * operation to verify that the status of the `BatchPrediction` changed to DELETED.
 *
 * **Caution:** The result of the `DeleteBatchPrediction` operation is irreversible.
 */
export const deleteBatchPrediction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteBatchPredictionInput,
    output: DeleteBatchPredictionOutput,
    errors: [
      InternalServerException,
      InvalidInputException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Deletes the specified tags associated with an ML object. After this operation is complete, you can't recover deleted tags.
 *
 * If you specify a tag that doesn't exist, Amazon ML ignores it.
 */
export const deleteTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTagsInput,
  output: DeleteTagsOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    InvalidTagException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns an `Evaluation` that includes metadata as well as the current status of the `Evaluation`.
 */
export const getEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEvaluationInput,
  output: GetEvaluationOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a `DataSource` that includes metadata and data file information, as well as the current status of the `DataSource`.
 *
 * `GetDataSource` provides results in normal or verbose format. The verbose format
 * adds the schema description and the list of files pointed to by the DataSource to the normal format.
 */
export const getDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataSourceInput,
  output: GetDataSourceOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Assigns the DELETED status to a `DataSource`, rendering it unusable.
 *
 * After using the `DeleteDataSource` operation, you can use the GetDataSource operation to verify that the status of the `DataSource` changed to DELETED.
 *
 * **Caution:** The results of the `DeleteDataSource` operation are irreversible.
 */
export const deleteDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataSourceInput,
  output: DeleteDataSourceOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Assigns the `DELETED` status to an `Evaluation`, rendering it unusable.
 *
 * After invoking the `DeleteEvaluation` operation, you can use the
 * `GetEvaluation` operation to verify that the status of the `Evaluation` changed to `DELETED`.
 *
 * **Caution:** The results of the `DeleteEvaluation` operation are irreversible.
 */
export const deleteEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteEvaluationInput,
  output: DeleteEvaluationOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Assigns the `DELETED` status to an `MLModel`, rendering it unusable.
 *
 * After using the `DeleteMLModel` operation, you can use the
 * `GetMLModel` operation to verify that the status of the `MLModel` changed to DELETED.
 *
 * **Caution:** The result of the `DeleteMLModel` operation is irreversible.
 */
export const deleteMLModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMLModelInput,
  output: DeleteMLModelOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes a real time endpoint of an `MLModel`.
 */
export const deleteRealtimeEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteRealtimeEndpointInput,
    output: DeleteRealtimeEndpointOutput,
    errors: [
      InternalServerException,
      InvalidInputException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Describes one or more of the tags for your Amazon ML object.
 */
export const describeTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTagsInput,
  output: DescribeTagsOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns a `BatchPrediction` that includes detailed metadata, status, and data file information for a
 * `Batch Prediction` request.
 */
export const getBatchPrediction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBatchPredictionInput,
  output: GetBatchPredictionOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns an `MLModel` that includes detailed metadata, data source information, and the current status of the `MLModel`.
 *
 * `GetMLModel` provides results in normal or verbose format.
 */
export const getMLModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMLModelInput,
  output: GetMLModelOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the `BatchPredictionName` of a `BatchPrediction`.
 *
 * You can use the `GetBatchPrediction` operation to view the contents of the updated data element.
 */
export const updateBatchPrediction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateBatchPredictionInput,
    output: UpdateBatchPredictionOutput,
    errors: [
      InternalServerException,
      InvalidInputException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Updates the `DataSourceName` of a `DataSource`.
 *
 * You can use the `GetDataSource` operation to view the contents of the updated data element.
 */
export const updateDataSource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataSourceInput,
  output: UpdateDataSourceOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the `EvaluationName` of an `Evaluation`.
 *
 * You can use the `GetEvaluation` operation to view the contents of the updated data element.
 */
export const updateEvaluation = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEvaluationInput,
  output: UpdateEvaluationOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates the `MLModelName` and the `ScoreThreshold` of an `MLModel`.
 *
 * You can use the `GetMLModel` operation to view the contents of the updated data element.
 */
export const updateMLModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMLModelInput,
  output: UpdateMLModelOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    ResourceNotFoundException,
  ],
}));
/**
 * Creates a real-time endpoint for the `MLModel`. The endpoint contains the URI of the `MLModel`; that is, the location to send real-time prediction requests for the specified `MLModel`.
 */
export const createRealtimeEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateRealtimeEndpointInput,
    output: CreateRealtimeEndpointOutput,
    errors: [
      InternalServerException,
      InvalidInputException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Adds one or more tags to an object, up to a limit of 10. Each tag consists of a key
 * and an optional value. If you add a tag using a key that is already associated with the ML object,
 * `AddTags` updates the tag's value.
 */
export const addTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsInput,
  output: AddTagsOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    InvalidTagException,
    ResourceNotFoundException,
    TagLimitExceededException,
  ],
}));
/**
 * Generates a prediction for the observation using the specified `ML Model`.
 *
 * **Note:** Not all response parameters will be populated. Whether a
 * response parameter is populated depends on the type of model requested.
 */
export const predict = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PredictInput,
  output: PredictOutput,
  errors: [
    InternalServerException,
    InvalidInputException,
    LimitExceededException,
    PredictorNotMountedException,
    ResourceNotFoundException,
  ],
}));
