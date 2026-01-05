import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Timestream Write",
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
                        url: "https://timestream-ingest-fips.{Region}.api.aws",
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
                        url: "https://timestream-ingest.{Region}.api.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://ingest.timestream-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://ingest.timestream.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://ingest.timestream-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://timestream-ingest.{Region}.api.aws",
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
                        url: "https://timestream-ingest.{Region}.api.aws",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://ingest.timestream.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://ingest.timestream.{Region}.{PartitionResult#dnsSuffix}",
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
export class DescribeEndpointsRequest extends S.Class<DescribeEndpointsRequest>(
  "DescribeEndpointsRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagKeyList = S.Array(S.String);
export class Dimension extends S.Class<Dimension>("Dimension")({
  Name: S.String,
  Value: S.String,
  DimensionValueType: S.optional(S.String),
}) {}
export const Dimensions = S.Array(Dimension);
export class MeasureValue extends S.Class<MeasureValue>("MeasureValue")({
  Name: S.String,
  Value: S.String,
  Type: S.String,
}) {}
export const MeasureValues = S.Array(MeasureValue);
export class Record extends S.Class<Record>("Record")({
  Dimensions: S.optional(Dimensions),
  MeasureName: S.optional(S.String),
  MeasureValue: S.optional(S.String),
  MeasureValueType: S.optional(S.String),
  Time: S.optional(S.String),
  TimeUnit: S.optional(S.String),
  Version: S.optional(S.Number),
  MeasureValues: S.optional(MeasureValues),
}) {}
export const Records = S.Array(Record);
export class DeleteDatabaseRequest extends S.Class<DeleteDatabaseRequest>(
  "DeleteDatabaseRequest",
)(
  { DatabaseName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDatabaseResponse extends S.Class<DeleteDatabaseResponse>(
  "DeleteDatabaseResponse",
)({}) {}
export class DeleteTableRequest extends S.Class<DeleteTableRequest>(
  "DeleteTableRequest",
)(
  { DatabaseName: S.String, TableName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTableResponse extends S.Class<DeleteTableResponse>(
  "DeleteTableResponse",
)({}) {}
export class DescribeBatchLoadTaskRequest extends S.Class<DescribeBatchLoadTaskRequest>(
  "DescribeBatchLoadTaskRequest",
)(
  { TaskId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeDatabaseRequest extends S.Class<DescribeDatabaseRequest>(
  "DescribeDatabaseRequest",
)(
  { DatabaseName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTableRequest extends S.Class<DescribeTableRequest>(
  "DescribeTableRequest",
)(
  { DatabaseName: S.String, TableName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListBatchLoadTasksRequest extends S.Class<ListBatchLoadTasksRequest>(
  "ListBatchLoadTasksRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    TaskStatus: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDatabasesRequest extends S.Class<ListDatabasesRequest>(
  "ListDatabasesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTablesRequest extends S.Class<ListTablesRequest>(
  "ListTablesRequest",
)(
  {
    DatabaseName: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResumeBatchLoadTaskRequest extends S.Class<ResumeBatchLoadTaskRequest>(
  "ResumeBatchLoadTaskRequest",
)(
  { TaskId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResumeBatchLoadTaskResponse extends S.Class<ResumeBatchLoadTaskResponse>(
  "ResumeBatchLoadTaskResponse",
)({}) {}
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
export class UpdateDatabaseRequest extends S.Class<UpdateDatabaseRequest>(
  "UpdateDatabaseRequest",
)(
  { DatabaseName: S.String, KmsKeyId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RetentionProperties extends S.Class<RetentionProperties>(
  "RetentionProperties",
)({
  MemoryStoreRetentionPeriodInHours: S.Number,
  MagneticStoreRetentionPeriodInDays: S.Number,
}) {}
export class S3Configuration extends S.Class<S3Configuration>(
  "S3Configuration",
)({
  BucketName: S.optional(S.String),
  ObjectKeyPrefix: S.optional(S.String),
  EncryptionOption: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
}) {}
export class MagneticStoreRejectedDataLocation extends S.Class<MagneticStoreRejectedDataLocation>(
  "MagneticStoreRejectedDataLocation",
)({ S3Configuration: S.optional(S3Configuration) }) {}
export class MagneticStoreWriteProperties extends S.Class<MagneticStoreWriteProperties>(
  "MagneticStoreWriteProperties",
)({
  EnableMagneticStoreWrites: S.Boolean,
  MagneticStoreRejectedDataLocation: S.optional(
    MagneticStoreRejectedDataLocation,
  ),
}) {}
export class PartitionKey extends S.Class<PartitionKey>("PartitionKey")({
  Type: S.String,
  Name: S.optional(S.String),
  EnforcementInRecord: S.optional(S.String),
}) {}
export const PartitionKeyList = S.Array(PartitionKey);
export class Schema extends S.Class<Schema>("Schema")({
  CompositePartitionKey: S.optional(PartitionKeyList),
}) {}
export class UpdateTableRequest extends S.Class<UpdateTableRequest>(
  "UpdateTableRequest",
)(
  {
    DatabaseName: S.String,
    TableName: S.String,
    RetentionProperties: S.optional(RetentionProperties),
    MagneticStoreWriteProperties: S.optional(MagneticStoreWriteProperties),
    Schema: S.optional(Schema),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  Address: S.String,
  CachePeriodInMinutes: S.Number,
}) {}
export const Endpoints = S.Array(Endpoint);
export class Database extends S.Class<Database>("Database")({
  Arn: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  TableCount: S.optional(S.Number),
  KmsKeyId: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DatabaseList = S.Array(Database);
export class Table extends S.Class<Table>("Table")({
  Arn: S.optional(S.String),
  TableName: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  TableStatus: S.optional(S.String),
  RetentionProperties: S.optional(RetentionProperties),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MagneticStoreWriteProperties: S.optional(MagneticStoreWriteProperties),
  Schema: S.optional(Schema),
}) {}
export const TableList = S.Array(Table);
export class CreateDatabaseRequest extends S.Class<CreateDatabaseRequest>(
  "CreateDatabaseRequest",
)(
  {
    DatabaseName: S.String,
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEndpointsResponse extends S.Class<DescribeEndpointsResponse>(
  "DescribeEndpointsResponse",
)({ Endpoints: Endpoints }) {}
export class ListDatabasesResponse extends S.Class<ListDatabasesResponse>(
  "ListDatabasesResponse",
)({ Databases: S.optional(DatabaseList), NextToken: S.optional(S.String) }) {}
export class ListTablesResponse extends S.Class<ListTablesResponse>(
  "ListTablesResponse",
)({ Tables: S.optional(TableList), NextToken: S.optional(S.String) }) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ Tags: S.optional(TagList) }) {}
export class UpdateDatabaseResponse extends S.Class<UpdateDatabaseResponse>(
  "UpdateDatabaseResponse",
)({ Database: S.optional(Database) }) {}
export class UpdateTableResponse extends S.Class<UpdateTableResponse>(
  "UpdateTableResponse",
)({ Table: S.optional(Table) }) {}
export class DataModelS3Configuration extends S.Class<DataModelS3Configuration>(
  "DataModelS3Configuration",
)({ BucketName: S.optional(S.String), ObjectKey: S.optional(S.String) }) {}
export class DataSourceS3Configuration extends S.Class<DataSourceS3Configuration>(
  "DataSourceS3Configuration",
)({ BucketName: S.String, ObjectKeyPrefix: S.optional(S.String) }) {}
export class CsvConfiguration extends S.Class<CsvConfiguration>(
  "CsvConfiguration",
)({
  ColumnSeparator: S.optional(S.String),
  EscapeChar: S.optional(S.String),
  QuoteChar: S.optional(S.String),
  NullValue: S.optional(S.String),
  TrimWhiteSpace: S.optional(S.Boolean),
}) {}
export class ReportS3Configuration extends S.Class<ReportS3Configuration>(
  "ReportS3Configuration",
)({
  BucketName: S.String,
  ObjectKeyPrefix: S.optional(S.String),
  EncryptionOption: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
}) {}
export class DataSourceConfiguration extends S.Class<DataSourceConfiguration>(
  "DataSourceConfiguration",
)({
  DataSourceS3Configuration: DataSourceS3Configuration,
  CsvConfiguration: S.optional(CsvConfiguration),
  DataFormat: S.String,
}) {}
export class ReportConfiguration extends S.Class<ReportConfiguration>(
  "ReportConfiguration",
)({ ReportS3Configuration: S.optional(ReportS3Configuration) }) {}
export class BatchLoadTask extends S.Class<BatchLoadTask>("BatchLoadTask")({
  TaskId: S.optional(S.String),
  TaskStatus: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  TableName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResumableUntil: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const BatchLoadTaskList = S.Array(BatchLoadTask);
export class DimensionMapping extends S.Class<DimensionMapping>(
  "DimensionMapping",
)({
  SourceColumn: S.optional(S.String),
  DestinationColumn: S.optional(S.String),
}) {}
export const DimensionMappings = S.Array(DimensionMapping);
export class MultiMeasureAttributeMapping extends S.Class<MultiMeasureAttributeMapping>(
  "MultiMeasureAttributeMapping",
)({
  SourceColumn: S.String,
  TargetMultiMeasureAttributeName: S.optional(S.String),
  MeasureValueType: S.optional(S.String),
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
export class CreateDatabaseResponse extends S.Class<CreateDatabaseResponse>(
  "CreateDatabaseResponse",
)({ Database: S.optional(Database) }) {}
export class DescribeDatabaseResponse extends S.Class<DescribeDatabaseResponse>(
  "DescribeDatabaseResponse",
)({ Database: S.optional(Database) }) {}
export class DescribeTableResponse extends S.Class<DescribeTableResponse>(
  "DescribeTableResponse",
)({ Table: S.optional(Table) }) {}
export class ListBatchLoadTasksResponse extends S.Class<ListBatchLoadTasksResponse>(
  "ListBatchLoadTasksResponse",
)({
  NextToken: S.optional(S.String),
  BatchLoadTasks: S.optional(BatchLoadTaskList),
}) {}
export class WriteRecordsRequest extends S.Class<WriteRecordsRequest>(
  "WriteRecordsRequest",
)(
  {
    DatabaseName: S.String,
    TableName: S.String,
    CommonAttributes: S.optional(Record),
    Records: Records,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchLoadProgressReport extends S.Class<BatchLoadProgressReport>(
  "BatchLoadProgressReport",
)({
  RecordsProcessed: S.optional(S.Number),
  RecordsIngested: S.optional(S.Number),
  ParseFailures: S.optional(S.Number),
  RecordIngestionFailures: S.optional(S.Number),
  FileFailures: S.optional(S.Number),
  BytesMetered: S.optional(S.Number),
}) {}
export class MultiMeasureMappings extends S.Class<MultiMeasureMappings>(
  "MultiMeasureMappings",
)({
  TargetMultiMeasureName: S.optional(S.String),
  MultiMeasureAttributeMappings: MultiMeasureAttributeMappingList,
}) {}
export class DataModel extends S.Class<DataModel>("DataModel")({
  TimeColumn: S.optional(S.String),
  TimeUnit: S.optional(S.String),
  DimensionMappings: DimensionMappings,
  MultiMeasureMappings: S.optional(MultiMeasureMappings),
  MixedMeasureMappings: S.optional(MixedMeasureMappingList),
  MeasureNameColumn: S.optional(S.String),
}) {}
export class DataModelConfiguration extends S.Class<DataModelConfiguration>(
  "DataModelConfiguration",
)({
  DataModel: S.optional(DataModel),
  DataModelS3Configuration: S.optional(DataModelS3Configuration),
}) {}
export class BatchLoadTaskDescription extends S.Class<BatchLoadTaskDescription>(
  "BatchLoadTaskDescription",
)({
  TaskId: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  DataSourceConfiguration: S.optional(DataSourceConfiguration),
  ProgressReport: S.optional(BatchLoadProgressReport),
  ReportConfiguration: S.optional(ReportConfiguration),
  DataModelConfiguration: S.optional(DataModelConfiguration),
  TargetDatabaseName: S.optional(S.String),
  TargetTableName: S.optional(S.String),
  TaskStatus: S.optional(S.String),
  RecordVersion: S.optional(S.Number),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResumableUntil: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateTableRequest extends S.Class<CreateTableRequest>(
  "CreateTableRequest",
)(
  {
    DatabaseName: S.String,
    TableName: S.String,
    RetentionProperties: S.optional(RetentionProperties),
    Tags: S.optional(TagList),
    MagneticStoreWriteProperties: S.optional(MagneticStoreWriteProperties),
    Schema: S.optional(Schema),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeBatchLoadTaskResponse extends S.Class<DescribeBatchLoadTaskResponse>(
  "DescribeBatchLoadTaskResponse",
)({ BatchLoadTaskDescription: BatchLoadTaskDescription }) {}
export class RecordsIngested extends S.Class<RecordsIngested>(
  "RecordsIngested",
)({
  Total: S.optional(S.Number),
  MemoryStore: S.optional(S.Number),
  MagneticStore: S.optional(S.Number),
}) {}
export class CreateBatchLoadTaskRequest extends S.Class<CreateBatchLoadTaskRequest>(
  "CreateBatchLoadTaskRequest",
)(
  {
    ClientToken: S.optional(S.String),
    DataModelConfiguration: S.optional(DataModelConfiguration),
    DataSourceConfiguration: DataSourceConfiguration,
    ReportConfiguration: ReportConfiguration,
    TargetDatabaseName: S.String,
    TargetTableName: S.String,
    RecordVersion: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTableResponse extends S.Class<CreateTableResponse>(
  "CreateTableResponse",
)({ Table: S.optional(Table) }) {}
export class WriteRecordsResponse extends S.Class<WriteRecordsResponse>(
  "WriteRecordsResponse",
)({ RecordsIngested: S.optional(RecordsIngested) }) {}
export class CreateBatchLoadTaskResponse extends S.Class<CreateBatchLoadTaskResponse>(
  "CreateBatchLoadTaskResponse",
)({ TaskId: S.String }) {}
export class RejectedRecord extends S.Class<RejectedRecord>("RejectedRecord")({
  RecordIndex: S.optional(S.Number),
  Reason: S.optional(S.String),
  ExistingVersion: S.optional(S.Number),
}) {}
export const RejectedRecords = S.Array(RejectedRecord);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
) {}
export class InvalidEndpointException extends S.TaggedError<InvalidEndpointException>()(
  "InvalidEndpointException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
) {}
export class RejectedRecordsException extends S.TaggedError<RejectedRecordsException>()(
  "RejectedRecordsException",
  {
    Message: S.optional(S.String),
    RejectedRecords: S.optional(RejectedRecords),
  },
) {}

//# Operations
/**
 * Returns information about the batch load task, including configurations, mappings,
 * progress, and other details. Service quotas apply. See
 * code
 * sample for details.
 */
export const describeBatchLoadTask = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeBatchLoadTaskRequest,
    output: DescribeBatchLoadTaskResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      InvalidEndpointException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Provides a list of batch load tasks, along with the name, status, when the task is
 * resumable until, and other details. See code
 * sample for details.
 */
export const listBatchLoadTasks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListBatchLoadTasksRequest,
    output: ListBatchLoadTasksResponse,
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
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Associates a set of tags with a Timestream resource. You can then activate
 * these user-defined tags so that they appear on the Billing and Cost Management console for
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
 * Returns a list of available endpoints to make Timestream API calls against.
 * This API operation is available through both the Write and Query APIs.
 *
 * Because the Timestream SDKs are designed to transparently work with the
 * service’s architecture, including the management and mapping of the service endpoints,
 * *we don't recommend that you use this API operation unless*:
 *
 * - You are using VPC endpoints (Amazon Web Services PrivateLink) with Timestream
 *
 * - Your application uses a programming language that does not yet have SDK
 * support
 *
 * - You require better control over the client-side implementation
 *
 * For detailed information on how and when to use and implement DescribeEndpoints, see
 * The
 * Endpoint Discovery Pattern.
 */
export const describeEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEndpointsRequest,
  output: DescribeEndpointsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Returns a list of your Timestream databases. Service quotas apply. See
 * code sample for
 * details.
 */
export const listDatabases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDatabasesRequest,
    output: ListDatabasesResponse,
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
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Provides a list of tables, along with the name, status, and retention properties of each
 * table. See code sample
 * for details.
 */
export const listTables = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTablesRequest,
  output: ListTablesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidEndpointException,
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
 * Modifies the retention duration of the memory store and magnetic store for your Timestream table. Note that the change in retention duration takes effect immediately.
 * For example, if the retention period of the memory store was initially set to 2 hours and
 * then changed to 24 hours, the memory store will be capable of holding 24 hours of data, but
 * will be populated with 24 hours of data 22 hours after this change was made. Timestream does not retrieve data from the magnetic store to populate the memory store.
 *
 * See code
 * sample for details.
 */
export const updateTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTableRequest,
  output: UpdateTableResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidEndpointException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a given Timestream table. This is an irreversible operation. After a
 * Timestream database table is deleted, the time-series data stored in the table
 * cannot be recovered.
 *
 * Due to the nature of distributed retries, the operation can return either success or
 * a ResourceNotFoundException. Clients should consider them equivalent.
 *
 * See code
 * sample for details.
 */
export const deleteTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTableRequest,
  output: DeleteTableResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidEndpointException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 *
 */
export const resumeBatchLoadTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResumeBatchLoadTaskRequest,
  output: ResumeBatchLoadTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidEndpointException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists all tags on a Timestream resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InvalidEndpointException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes a given Timestream database. This is an irreversible
 * operation. After a database is deleted, the time-series data from its tables cannot be
 * recovered.
 *
 * All tables in the database must be deleted first, or a ValidationException error will
 * be thrown.
 *
 * Due to the nature of distributed retries, the operation can return either success or
 * a ResourceNotFoundException. Clients should consider them equivalent.
 *
 * See code sample
 * for details.
 */
export const deleteDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatabaseRequest,
  output: DeleteDatabaseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidEndpointException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the database, including the database name, time that the
 * database was created, and the total number of tables found within the database. Service
 * quotas apply. See code sample
 * for details.
 */
export const describeDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDatabaseRequest,
  output: DescribeDatabaseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidEndpointException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns information about the table, including the table name, database name, retention
 * duration of the memory store and the magnetic store. Service quotas apply. See
 * code
 * sample for details.
 */
export const describeTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTableRequest,
  output: DescribeTableResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidEndpointException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Modifies the KMS key for an existing database. While updating the
 * database, you must specify the database name and the identifier of the new KMS key to be used (`KmsKeyId`). If there are any concurrent
 * `UpdateDatabase` requests, first writer wins.
 *
 * See code sample
 * for details.
 */
export const updateDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatabaseRequest,
  output: UpdateDatabaseResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidEndpointException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Removes the association of tags from a Timestream resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InvalidEndpointException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new Timestream database. If the KMS key is not
 * specified, the database will be encrypted with a Timestream managed KMS key located in your account. For more information, see Amazon Web Services managed keys. Service quotas apply. For
 * details, see code sample.
 */
export const createDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatabaseRequest,
  output: CreateDatabaseResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidEndpointException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Adds a new table to an existing database in your account. In an Amazon Web Services account, table names must be at least unique within each Region if they are in the same
 * database. You might have identical table names in the same Region if the tables are in
 * separate databases. While creating the table, you must specify the table name, database
 * name, and the retention properties. Service quotas apply. See
 * code
 * sample for details.
 */
export const createTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTableRequest,
  output: CreateTableResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidEndpointException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a new Timestream batch load task. A batch load task processes data from
 * a CSV source in an S3 location and writes to a Timestream table. A mapping from
 * source to target is defined in a batch load task. Errors and events are written to a report
 * at an S3 location. For the report, if the KMS key is not specified, the
 * report will be encrypted with an S3 managed key when `SSE_S3` is the option.
 * Otherwise an error is thrown. For more information, see Amazon Web Services managed
 * keys. Service quotas apply. For
 * details, see code
 * sample.
 */
export const createBatchLoadTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBatchLoadTaskRequest,
  output: CreateBatchLoadTaskResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    InvalidEndpointException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Enables you to write your time-series data into Timestream. You can specify a
 * single data point or a batch of data points to be inserted into the system. Timestream offers you a flexible schema that auto detects the column names and data
 * types for your Timestream tables based on the dimension names and data types of
 * the data points you specify when invoking writes into the database.
 *
 * Timestream supports eventual consistency read semantics. This means that when
 * you query data immediately after writing a batch of data into Timestream, the
 * query results might not reflect the results of a recently completed write operation. The
 * results may also include some stale data. If you repeat the query request after a short
 * time, the results should return the latest data. Service quotas apply.
 *
 * See code sample for
 * details.
 *
 * **Upserts**
 *
 * You can use the `Version` parameter in a `WriteRecords` request to
 * update data points. Timestream tracks a version number with each record.
 * `Version` defaults to `1` when it's not specified for the record
 * in the request. Timestream updates an existing record’s measure value along with
 * its `Version` when it receives a write request with a higher
 * `Version` number for that record. When it receives an update request where
 * the measure value is the same as that of the existing record, Timestream still
 * updates `Version`, if it is greater than the existing value of
 * `Version`. You can update a data point as many times as desired, as long as
 * the value of `Version` continuously increases.
 *
 * For example, suppose you write a new record without indicating `Version` in
 * the request. Timestream stores this record, and set `Version` to
 * `1`. Now, suppose you try to update this record with a
 * `WriteRecords` request of the same record with a different measure value but,
 * like before, do not provide `Version`. In this case, Timestream will
 * reject this update with a `RejectedRecordsException` since the updated record’s
 * version is not greater than the existing value of Version.
 *
 * However, if you were to resend the update request with `Version` set to
 * `2`, Timestream would then succeed in updating the record’s value,
 * and the `Version` would be set to `2`. Next, suppose you sent a
 * `WriteRecords` request with this same record and an identical measure value,
 * but with `Version` set to `3`. In this case, Timestream
 * would only update `Version` to `3`. Any further updates would need to
 * send a version number greater than `3`, or the update requests would receive a
 * `RejectedRecordsException`.
 */
export const writeRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: WriteRecordsRequest,
  output: WriteRecordsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidEndpointException,
    RejectedRecordsException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
