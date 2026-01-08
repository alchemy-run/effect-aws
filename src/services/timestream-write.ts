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
  sdkId: "Timestream Write",
  serviceShapeName: "Timestream_20181101",
});
const auth = T.AwsAuthSigv4({ name: "timestream" });
const ver = T.ServiceVersion("2018-11-01");
const proto = T.AwsProtocolsAwsJson1_0();
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
            if ("aws" === _.getAttr(PartitionResult, "name")) {
              return e(`https://timestream-ingest-fips.${Region}.api.aws`);
            }
            if ("aws-us-gov" === _.getAttr(PartitionResult, "name")) {
              return e(`https://timestream-ingest.${Region}.api.aws`);
            }
            return e(
              `https://ingest.timestream-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            if (_.getAttr(PartitionResult, "name") === "aws-us-gov") {
              return e(`https://ingest.timestream.${Region}.amazonaws.com`);
            }
            return e(
              `https://ingest.timestream-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            if ("aws" === _.getAttr(PartitionResult, "name")) {
              return e(`https://timestream-ingest.${Region}.api.aws`);
            }
            if ("aws-us-gov" === _.getAttr(PartitionResult, "name")) {
              return e(`https://timestream-ingest.${Region}.api.aws`);
            }
            return e(
              `https://ingest.timestream.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://ingest.timestream.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ClientRequestToken = string | redacted.Redacted<string>;
export type ResourceCreateAPIName = string;
export type RecordVersion = number;
export type StringValue2048 = string;
export type ResourceName = string;
export type BatchLoadTaskId = string;
export type PageLimit = number;
export type PaginationLimit = number;
export type AmazonResourceName = string;
export type TagKey = string;
export type TagValue = string;
export type MemoryStoreRetentionPeriodInHours = number;
export type MagneticStoreRetentionPeriodInDays = number;
export type SchemaName = string;
export type StringValue256 = string;
export type ErrorMessage = string;
export type S3BucketName = string;
export type S3ObjectKey = string;
export type StringValue1 = string;
export type S3ObjectKeyPrefix = string;
export type SchemaValue = string;
export type RecordIndex = number;

//# Schemas
export interface DescribeEndpointsRequest {}
export const DescribeEndpointsRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEndpointsRequest",
}) as any as S.Schema<DescribeEndpointsRequest>;
export type BatchLoadStatus =
  | "CREATED"
  | "IN_PROGRESS"
  | "FAILED"
  | "SUCCEEDED"
  | "PROGRESS_STOPPED"
  | "PENDING_RESUME";
export const BatchLoadStatus = S.Literal(
  "CREATED",
  "IN_PROGRESS",
  "FAILED",
  "SUCCEEDED",
  "PROGRESS_STOPPED",
  "PENDING_RESUME",
);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type DimensionValueType = "VARCHAR";
export const DimensionValueType = S.Literal("VARCHAR");
export interface Dimension {
  Name: string;
  Value: string;
  DimensionValueType?: DimensionValueType;
}
export const Dimension = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Value: S.String,
    DimensionValueType: S.optional(DimensionValueType),
  }),
).annotations({ identifier: "Dimension" }) as any as S.Schema<Dimension>;
export type Dimensions = Dimension[];
export const Dimensions = S.Array(Dimension);
export type MeasureValueType =
  | "DOUBLE"
  | "BIGINT"
  | "VARCHAR"
  | "BOOLEAN"
  | "TIMESTAMP"
  | "MULTI";
export const MeasureValueType = S.Literal(
  "DOUBLE",
  "BIGINT",
  "VARCHAR",
  "BOOLEAN",
  "TIMESTAMP",
  "MULTI",
);
export type TimeUnit =
  | "MILLISECONDS"
  | "SECONDS"
  | "MICROSECONDS"
  | "NANOSECONDS";
export const TimeUnit = S.Literal(
  "MILLISECONDS",
  "SECONDS",
  "MICROSECONDS",
  "NANOSECONDS",
);
export interface MeasureValue {
  Name: string;
  Value: string;
  Type: MeasureValueType;
}
export const MeasureValue = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String, Type: MeasureValueType }),
).annotations({ identifier: "MeasureValue" }) as any as S.Schema<MeasureValue>;
export type MeasureValues = MeasureValue[];
export const MeasureValues = S.Array(MeasureValue);
export interface Record {
  Dimensions?: Dimension[];
  MeasureName?: string;
  MeasureValue?: string;
  MeasureValueType?: MeasureValueType;
  Time?: string;
  TimeUnit?: TimeUnit;
  Version?: number;
  MeasureValues?: MeasureValue[];
}
export const Record = S.suspend(() =>
  S.Struct({
    Dimensions: S.optional(Dimensions),
    MeasureName: S.optional(S.String),
    MeasureValue: S.optional(S.String),
    MeasureValueType: S.optional(MeasureValueType),
    Time: S.optional(S.String),
    TimeUnit: S.optional(TimeUnit),
    Version: S.optional(S.Number),
    MeasureValues: S.optional(MeasureValues),
  }),
).annotations({ identifier: "Record" }) as any as S.Schema<Record>;
export type Records = Record[];
export const Records = S.Array(Record);
export interface DeleteDatabaseRequest {
  DatabaseName: string;
}
export const DeleteDatabaseRequest = S.suspend(() =>
  S.Struct({ DatabaseName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDatabaseRequest",
}) as any as S.Schema<DeleteDatabaseRequest>;
export interface DeleteDatabaseResponse {}
export const DeleteDatabaseResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteDatabaseResponse" },
) as any as S.Schema<DeleteDatabaseResponse>;
export interface DeleteTableRequest {
  DatabaseName: string;
  TableName: string;
}
export const DeleteTableRequest = S.suspend(() =>
  S.Struct({ DatabaseName: S.String, TableName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteTableRequest",
}) as any as S.Schema<DeleteTableRequest>;
export interface DeleteTableResponse {}
export const DeleteTableResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteTableResponse",
}) as any as S.Schema<DeleteTableResponse>;
export interface DescribeBatchLoadTaskRequest {
  TaskId: string;
}
export const DescribeBatchLoadTaskRequest = S.suspend(() =>
  S.Struct({ TaskId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeBatchLoadTaskRequest",
}) as any as S.Schema<DescribeBatchLoadTaskRequest>;
export interface DescribeDatabaseRequest {
  DatabaseName: string;
}
export const DescribeDatabaseRequest = S.suspend(() =>
  S.Struct({ DatabaseName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeDatabaseRequest",
}) as any as S.Schema<DescribeDatabaseRequest>;
export interface DescribeTableRequest {
  DatabaseName: string;
  TableName: string;
}
export const DescribeTableRequest = S.suspend(() =>
  S.Struct({ DatabaseName: S.String, TableName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeTableRequest",
}) as any as S.Schema<DescribeTableRequest>;
export interface ListBatchLoadTasksRequest {
  NextToken?: string;
  MaxResults?: number;
  TaskStatus?: BatchLoadStatus;
}
export const ListBatchLoadTasksRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    TaskStatus: S.optional(BatchLoadStatus),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBatchLoadTasksRequest",
}) as any as S.Schema<ListBatchLoadTasksRequest>;
export interface ListDatabasesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListDatabasesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDatabasesRequest",
}) as any as S.Schema<ListDatabasesRequest>;
export interface ListTablesRequest {
  DatabaseName?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListTablesRequest = S.suspend(() =>
  S.Struct({
    DatabaseName: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTablesRequest",
}) as any as S.Schema<ListTablesRequest>;
export interface ListTagsForResourceRequest {
  ResourceARN: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ResumeBatchLoadTaskRequest {
  TaskId: string;
}
export const ResumeBatchLoadTaskRequest = S.suspend(() =>
  S.Struct({ TaskId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ResumeBatchLoadTaskRequest",
}) as any as S.Schema<ResumeBatchLoadTaskRequest>;
export interface ResumeBatchLoadTaskResponse {}
export const ResumeBatchLoadTaskResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ResumeBatchLoadTaskResponse",
}) as any as S.Schema<ResumeBatchLoadTaskResponse>;
export interface Tag {
  Key: string;
  Value: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceRequest {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
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
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateDatabaseRequest {
  DatabaseName: string;
  KmsKeyId: string;
}
export const UpdateDatabaseRequest = S.suspend(() =>
  S.Struct({ DatabaseName: S.String, KmsKeyId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDatabaseRequest",
}) as any as S.Schema<UpdateDatabaseRequest>;
export interface RetentionProperties {
  MemoryStoreRetentionPeriodInHours: number;
  MagneticStoreRetentionPeriodInDays: number;
}
export const RetentionProperties = S.suspend(() =>
  S.Struct({
    MemoryStoreRetentionPeriodInHours: S.Number,
    MagneticStoreRetentionPeriodInDays: S.Number,
  }),
).annotations({
  identifier: "RetentionProperties",
}) as any as S.Schema<RetentionProperties>;
export type S3EncryptionOption = "SSE_S3" | "SSE_KMS";
export const S3EncryptionOption = S.Literal("SSE_S3", "SSE_KMS");
export interface S3Configuration {
  BucketName?: string;
  ObjectKeyPrefix?: string;
  EncryptionOption?: S3EncryptionOption;
  KmsKeyId?: string;
}
export const S3Configuration = S.suspend(() =>
  S.Struct({
    BucketName: S.optional(S.String),
    ObjectKeyPrefix: S.optional(S.String),
    EncryptionOption: S.optional(S3EncryptionOption),
    KmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "S3Configuration",
}) as any as S.Schema<S3Configuration>;
export interface MagneticStoreRejectedDataLocation {
  S3Configuration?: S3Configuration;
}
export const MagneticStoreRejectedDataLocation = S.suspend(() =>
  S.Struct({ S3Configuration: S.optional(S3Configuration) }),
).annotations({
  identifier: "MagneticStoreRejectedDataLocation",
}) as any as S.Schema<MagneticStoreRejectedDataLocation>;
export interface MagneticStoreWriteProperties {
  EnableMagneticStoreWrites: boolean;
  MagneticStoreRejectedDataLocation?: MagneticStoreRejectedDataLocation;
}
export const MagneticStoreWriteProperties = S.suspend(() =>
  S.Struct({
    EnableMagneticStoreWrites: S.Boolean,
    MagneticStoreRejectedDataLocation: S.optional(
      MagneticStoreRejectedDataLocation,
    ),
  }),
).annotations({
  identifier: "MagneticStoreWriteProperties",
}) as any as S.Schema<MagneticStoreWriteProperties>;
export type PartitionKeyType = "DIMENSION" | "MEASURE";
export const PartitionKeyType = S.Literal("DIMENSION", "MEASURE");
export type PartitionKeyEnforcementLevel = "REQUIRED" | "OPTIONAL";
export const PartitionKeyEnforcementLevel = S.Literal("REQUIRED", "OPTIONAL");
export interface PartitionKey {
  Type: PartitionKeyType;
  Name?: string;
  EnforcementInRecord?: PartitionKeyEnforcementLevel;
}
export const PartitionKey = S.suspend(() =>
  S.Struct({
    Type: PartitionKeyType,
    Name: S.optional(S.String),
    EnforcementInRecord: S.optional(PartitionKeyEnforcementLevel),
  }),
).annotations({ identifier: "PartitionKey" }) as any as S.Schema<PartitionKey>;
export type PartitionKeyList = PartitionKey[];
export const PartitionKeyList = S.Array(PartitionKey);
export interface Schema {
  CompositePartitionKey?: PartitionKey[];
}
export const Schema = S.suspend(() =>
  S.Struct({ CompositePartitionKey: S.optional(PartitionKeyList) }),
).annotations({ identifier: "Schema" }) as any as S.Schema<Schema>;
export interface UpdateTableRequest {
  DatabaseName: string;
  TableName: string;
  RetentionProperties?: RetentionProperties;
  MagneticStoreWriteProperties?: MagneticStoreWriteProperties;
  Schema?: Schema;
}
export const UpdateTableRequest = S.suspend(() =>
  S.Struct({
    DatabaseName: S.String,
    TableName: S.String,
    RetentionProperties: S.optional(RetentionProperties),
    MagneticStoreWriteProperties: S.optional(MagneticStoreWriteProperties),
    Schema: S.optional(Schema),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateTableRequest",
}) as any as S.Schema<UpdateTableRequest>;
export type BatchLoadDataFormat = "CSV";
export const BatchLoadDataFormat = S.Literal("CSV");
export interface Endpoint {
  Address: string;
  CachePeriodInMinutes: number;
}
export const Endpoint = S.suspend(() =>
  S.Struct({ Address: S.String, CachePeriodInMinutes: S.Number }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export type Endpoints = Endpoint[];
export const Endpoints = S.Array(Endpoint);
export interface Database {
  Arn?: string;
  DatabaseName?: string;
  TableCount?: number;
  KmsKeyId?: string;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
}
export const Database = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    TableCount: S.optional(S.Number),
    KmsKeyId: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({ identifier: "Database" }) as any as S.Schema<Database>;
export type DatabaseList = Database[];
export const DatabaseList = S.Array(Database);
export type TableStatus = "ACTIVE" | "DELETING" | "RESTORING";
export const TableStatus = S.Literal("ACTIVE", "DELETING", "RESTORING");
export interface Table {
  Arn?: string;
  TableName?: string;
  DatabaseName?: string;
  TableStatus?: TableStatus;
  RetentionProperties?: RetentionProperties;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
  MagneticStoreWriteProperties?: MagneticStoreWriteProperties;
  Schema?: Schema;
}
export const Table = S.suspend(() =>
  S.Struct({
    Arn: S.optional(S.String),
    TableName: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    TableStatus: S.optional(TableStatus),
    RetentionProperties: S.optional(RetentionProperties),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    MagneticStoreWriteProperties: S.optional(MagneticStoreWriteProperties),
    Schema: S.optional(Schema),
  }),
).annotations({ identifier: "Table" }) as any as S.Schema<Table>;
export type TableList = Table[];
export const TableList = S.Array(Table);
export interface CreateDatabaseRequest {
  DatabaseName: string;
  KmsKeyId?: string;
  Tags?: Tag[];
}
export const CreateDatabaseRequest = S.suspend(() =>
  S.Struct({
    DatabaseName: S.String,
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDatabaseRequest",
}) as any as S.Schema<CreateDatabaseRequest>;
export interface DescribeEndpointsResponse {
  Endpoints: Endpoint[];
}
export const DescribeEndpointsResponse = S.suspend(() =>
  S.Struct({ Endpoints: Endpoints }),
).annotations({
  identifier: "DescribeEndpointsResponse",
}) as any as S.Schema<DescribeEndpointsResponse>;
export interface ListDatabasesResponse {
  Databases?: Database[];
  NextToken?: string;
}
export const ListDatabasesResponse = S.suspend(() =>
  S.Struct({
    Databases: S.optional(DatabaseList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatabasesResponse",
}) as any as S.Schema<ListDatabasesResponse>;
export interface ListTablesResponse {
  Tables?: Table[];
  NextToken?: string;
}
export const ListTablesResponse = S.suspend(() =>
  S.Struct({ Tables: S.optional(TableList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTablesResponse",
}) as any as S.Schema<ListTablesResponse>;
export interface ListTagsForResourceResponse {
  Tags?: Tag[];
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateDatabaseResponse {
  Database?: Database;
}
export const UpdateDatabaseResponse = S.suspend(() =>
  S.Struct({ Database: S.optional(Database) }),
).annotations({
  identifier: "UpdateDatabaseResponse",
}) as any as S.Schema<UpdateDatabaseResponse>;
export interface UpdateTableResponse {
  Table?: Table;
}
export const UpdateTableResponse = S.suspend(() =>
  S.Struct({ Table: S.optional(Table) }),
).annotations({
  identifier: "UpdateTableResponse",
}) as any as S.Schema<UpdateTableResponse>;
export interface DataModelS3Configuration {
  BucketName?: string;
  ObjectKey?: string;
}
export const DataModelS3Configuration = S.suspend(() =>
  S.Struct({
    BucketName: S.optional(S.String),
    ObjectKey: S.optional(S.String),
  }),
).annotations({
  identifier: "DataModelS3Configuration",
}) as any as S.Schema<DataModelS3Configuration>;
export interface DataSourceS3Configuration {
  BucketName: string;
  ObjectKeyPrefix?: string;
}
export const DataSourceS3Configuration = S.suspend(() =>
  S.Struct({ BucketName: S.String, ObjectKeyPrefix: S.optional(S.String) }),
).annotations({
  identifier: "DataSourceS3Configuration",
}) as any as S.Schema<DataSourceS3Configuration>;
export interface CsvConfiguration {
  ColumnSeparator?: string;
  EscapeChar?: string;
  QuoteChar?: string;
  NullValue?: string;
  TrimWhiteSpace?: boolean;
}
export const CsvConfiguration = S.suspend(() =>
  S.Struct({
    ColumnSeparator: S.optional(S.String),
    EscapeChar: S.optional(S.String),
    QuoteChar: S.optional(S.String),
    NullValue: S.optional(S.String),
    TrimWhiteSpace: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "CsvConfiguration",
}) as any as S.Schema<CsvConfiguration>;
export interface ReportS3Configuration {
  BucketName: string;
  ObjectKeyPrefix?: string;
  EncryptionOption?: S3EncryptionOption;
  KmsKeyId?: string;
}
export const ReportS3Configuration = S.suspend(() =>
  S.Struct({
    BucketName: S.String,
    ObjectKeyPrefix: S.optional(S.String),
    EncryptionOption: S.optional(S3EncryptionOption),
    KmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "ReportS3Configuration",
}) as any as S.Schema<ReportS3Configuration>;
export interface DataSourceConfiguration {
  DataSourceS3Configuration: DataSourceS3Configuration;
  CsvConfiguration?: CsvConfiguration;
  DataFormat: BatchLoadDataFormat;
}
export const DataSourceConfiguration = S.suspend(() =>
  S.Struct({
    DataSourceS3Configuration: DataSourceS3Configuration,
    CsvConfiguration: S.optional(CsvConfiguration),
    DataFormat: BatchLoadDataFormat,
  }),
).annotations({
  identifier: "DataSourceConfiguration",
}) as any as S.Schema<DataSourceConfiguration>;
export interface ReportConfiguration {
  ReportS3Configuration?: ReportS3Configuration;
}
export const ReportConfiguration = S.suspend(() =>
  S.Struct({ ReportS3Configuration: S.optional(ReportS3Configuration) }),
).annotations({
  identifier: "ReportConfiguration",
}) as any as S.Schema<ReportConfiguration>;
export interface BatchLoadTask {
  TaskId?: string;
  TaskStatus?: BatchLoadStatus;
  DatabaseName?: string;
  TableName?: string;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
  ResumableUntil?: Date;
}
export const BatchLoadTask = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    TaskStatus: S.optional(BatchLoadStatus),
    DatabaseName: S.optional(S.String),
    TableName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ResumableUntil: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "BatchLoadTask",
}) as any as S.Schema<BatchLoadTask>;
export type BatchLoadTaskList = BatchLoadTask[];
export const BatchLoadTaskList = S.Array(BatchLoadTask);
export interface DimensionMapping {
  SourceColumn?: string;
  DestinationColumn?: string;
}
export const DimensionMapping = S.suspend(() =>
  S.Struct({
    SourceColumn: S.optional(S.String),
    DestinationColumn: S.optional(S.String),
  }),
).annotations({
  identifier: "DimensionMapping",
}) as any as S.Schema<DimensionMapping>;
export type DimensionMappings = DimensionMapping[];
export const DimensionMappings = S.Array(DimensionMapping);
export type ScalarMeasureValueType =
  | "DOUBLE"
  | "BIGINT"
  | "BOOLEAN"
  | "VARCHAR"
  | "TIMESTAMP";
export const ScalarMeasureValueType = S.Literal(
  "DOUBLE",
  "BIGINT",
  "BOOLEAN",
  "VARCHAR",
  "TIMESTAMP",
);
export interface MultiMeasureAttributeMapping {
  SourceColumn: string;
  TargetMultiMeasureAttributeName?: string;
  MeasureValueType?: ScalarMeasureValueType;
}
export const MultiMeasureAttributeMapping = S.suspend(() =>
  S.Struct({
    SourceColumn: S.String,
    TargetMultiMeasureAttributeName: S.optional(S.String),
    MeasureValueType: S.optional(ScalarMeasureValueType),
  }),
).annotations({
  identifier: "MultiMeasureAttributeMapping",
}) as any as S.Schema<MultiMeasureAttributeMapping>;
export type MultiMeasureAttributeMappingList = MultiMeasureAttributeMapping[];
export const MultiMeasureAttributeMappingList = S.Array(
  MultiMeasureAttributeMapping,
);
export interface MixedMeasureMapping {
  MeasureName?: string;
  SourceColumn?: string;
  TargetMeasureName?: string;
  MeasureValueType: MeasureValueType;
  MultiMeasureAttributeMappings?: MultiMeasureAttributeMapping[];
}
export const MixedMeasureMapping = S.suspend(() =>
  S.Struct({
    MeasureName: S.optional(S.String),
    SourceColumn: S.optional(S.String),
    TargetMeasureName: S.optional(S.String),
    MeasureValueType: MeasureValueType,
    MultiMeasureAttributeMappings: S.optional(MultiMeasureAttributeMappingList),
  }),
).annotations({
  identifier: "MixedMeasureMapping",
}) as any as S.Schema<MixedMeasureMapping>;
export type MixedMeasureMappingList = MixedMeasureMapping[];
export const MixedMeasureMappingList = S.Array(MixedMeasureMapping);
export interface CreateDatabaseResponse {
  Database?: Database;
}
export const CreateDatabaseResponse = S.suspend(() =>
  S.Struct({ Database: S.optional(Database) }),
).annotations({
  identifier: "CreateDatabaseResponse",
}) as any as S.Schema<CreateDatabaseResponse>;
export interface DescribeDatabaseResponse {
  Database?: Database;
}
export const DescribeDatabaseResponse = S.suspend(() =>
  S.Struct({ Database: S.optional(Database) }),
).annotations({
  identifier: "DescribeDatabaseResponse",
}) as any as S.Schema<DescribeDatabaseResponse>;
export interface DescribeTableResponse {
  Table?: Table;
}
export const DescribeTableResponse = S.suspend(() =>
  S.Struct({ Table: S.optional(Table) }),
).annotations({
  identifier: "DescribeTableResponse",
}) as any as S.Schema<DescribeTableResponse>;
export interface ListBatchLoadTasksResponse {
  NextToken?: string;
  BatchLoadTasks?: BatchLoadTask[];
}
export const ListBatchLoadTasksResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    BatchLoadTasks: S.optional(BatchLoadTaskList),
  }),
).annotations({
  identifier: "ListBatchLoadTasksResponse",
}) as any as S.Schema<ListBatchLoadTasksResponse>;
export interface WriteRecordsRequest {
  DatabaseName: string;
  TableName: string;
  CommonAttributes?: Record;
  Records: Record[];
}
export const WriteRecordsRequest = S.suspend(() =>
  S.Struct({
    DatabaseName: S.String,
    TableName: S.String,
    CommonAttributes: S.optional(Record),
    Records: Records,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "WriteRecordsRequest",
}) as any as S.Schema<WriteRecordsRequest>;
export interface BatchLoadProgressReport {
  RecordsProcessed?: number;
  RecordsIngested?: number;
  ParseFailures?: number;
  RecordIngestionFailures?: number;
  FileFailures?: number;
  BytesMetered?: number;
}
export const BatchLoadProgressReport = S.suspend(() =>
  S.Struct({
    RecordsProcessed: S.optional(S.Number),
    RecordsIngested: S.optional(S.Number),
    ParseFailures: S.optional(S.Number),
    RecordIngestionFailures: S.optional(S.Number),
    FileFailures: S.optional(S.Number),
    BytesMetered: S.optional(S.Number),
  }),
).annotations({
  identifier: "BatchLoadProgressReport",
}) as any as S.Schema<BatchLoadProgressReport>;
export interface MultiMeasureMappings {
  TargetMultiMeasureName?: string;
  MultiMeasureAttributeMappings: MultiMeasureAttributeMapping[];
}
export const MultiMeasureMappings = S.suspend(() =>
  S.Struct({
    TargetMultiMeasureName: S.optional(S.String),
    MultiMeasureAttributeMappings: MultiMeasureAttributeMappingList,
  }),
).annotations({
  identifier: "MultiMeasureMappings",
}) as any as S.Schema<MultiMeasureMappings>;
export interface DataModel {
  TimeColumn?: string;
  TimeUnit?: TimeUnit;
  DimensionMappings: DimensionMapping[];
  MultiMeasureMappings?: MultiMeasureMappings;
  MixedMeasureMappings?: MixedMeasureMapping[];
  MeasureNameColumn?: string;
}
export const DataModel = S.suspend(() =>
  S.Struct({
    TimeColumn: S.optional(S.String),
    TimeUnit: S.optional(TimeUnit),
    DimensionMappings: DimensionMappings,
    MultiMeasureMappings: S.optional(MultiMeasureMappings),
    MixedMeasureMappings: S.optional(MixedMeasureMappingList),
    MeasureNameColumn: S.optional(S.String),
  }),
).annotations({ identifier: "DataModel" }) as any as S.Schema<DataModel>;
export interface DataModelConfiguration {
  DataModel?: DataModel;
  DataModelS3Configuration?: DataModelS3Configuration;
}
export const DataModelConfiguration = S.suspend(() =>
  S.Struct({
    DataModel: S.optional(DataModel),
    DataModelS3Configuration: S.optional(DataModelS3Configuration),
  }),
).annotations({
  identifier: "DataModelConfiguration",
}) as any as S.Schema<DataModelConfiguration>;
export interface BatchLoadTaskDescription {
  TaskId?: string;
  ErrorMessage?: string;
  DataSourceConfiguration?: DataSourceConfiguration;
  ProgressReport?: BatchLoadProgressReport;
  ReportConfiguration?: ReportConfiguration;
  DataModelConfiguration?: DataModelConfiguration;
  TargetDatabaseName?: string;
  TargetTableName?: string;
  TaskStatus?: BatchLoadStatus;
  RecordVersion?: number;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
  ResumableUntil?: Date;
}
export const BatchLoadTaskDescription = S.suspend(() =>
  S.Struct({
    TaskId: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    DataSourceConfiguration: S.optional(DataSourceConfiguration),
    ProgressReport: S.optional(BatchLoadProgressReport),
    ReportConfiguration: S.optional(ReportConfiguration),
    DataModelConfiguration: S.optional(DataModelConfiguration),
    TargetDatabaseName: S.optional(S.String),
    TargetTableName: S.optional(S.String),
    TaskStatus: S.optional(BatchLoadStatus),
    RecordVersion: S.optional(S.Number),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ResumableUntil: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "BatchLoadTaskDescription",
}) as any as S.Schema<BatchLoadTaskDescription>;
export interface CreateTableRequest {
  DatabaseName: string;
  TableName: string;
  RetentionProperties?: RetentionProperties;
  Tags?: Tag[];
  MagneticStoreWriteProperties?: MagneticStoreWriteProperties;
  Schema?: Schema;
}
export const CreateTableRequest = S.suspend(() =>
  S.Struct({
    DatabaseName: S.String,
    TableName: S.String,
    RetentionProperties: S.optional(RetentionProperties),
    Tags: S.optional(TagList),
    MagneticStoreWriteProperties: S.optional(MagneticStoreWriteProperties),
    Schema: S.optional(Schema),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateTableRequest",
}) as any as S.Schema<CreateTableRequest>;
export interface DescribeBatchLoadTaskResponse {
  BatchLoadTaskDescription: BatchLoadTaskDescription;
}
export const DescribeBatchLoadTaskResponse = S.suspend(() =>
  S.Struct({ BatchLoadTaskDescription: BatchLoadTaskDescription }),
).annotations({
  identifier: "DescribeBatchLoadTaskResponse",
}) as any as S.Schema<DescribeBatchLoadTaskResponse>;
export interface RecordsIngested {
  Total?: number;
  MemoryStore?: number;
  MagneticStore?: number;
}
export const RecordsIngested = S.suspend(() =>
  S.Struct({
    Total: S.optional(S.Number),
    MemoryStore: S.optional(S.Number),
    MagneticStore: S.optional(S.Number),
  }),
).annotations({
  identifier: "RecordsIngested",
}) as any as S.Schema<RecordsIngested>;
export interface CreateBatchLoadTaskRequest {
  ClientToken?: string | redacted.Redacted<string>;
  DataModelConfiguration?: DataModelConfiguration;
  DataSourceConfiguration: DataSourceConfiguration;
  ReportConfiguration: ReportConfiguration;
  TargetDatabaseName: string;
  TargetTableName: string;
  RecordVersion?: number;
}
export const CreateBatchLoadTaskRequest = S.suspend(() =>
  S.Struct({
    ClientToken: S.optional(SensitiveString).pipe(T.IdempotencyToken()),
    DataModelConfiguration: S.optional(DataModelConfiguration),
    DataSourceConfiguration: DataSourceConfiguration,
    ReportConfiguration: ReportConfiguration,
    TargetDatabaseName: S.String,
    TargetTableName: S.String,
    RecordVersion: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateBatchLoadTaskRequest",
}) as any as S.Schema<CreateBatchLoadTaskRequest>;
export interface CreateTableResponse {
  Table?: Table;
}
export const CreateTableResponse = S.suspend(() =>
  S.Struct({ Table: S.optional(Table) }),
).annotations({
  identifier: "CreateTableResponse",
}) as any as S.Schema<CreateTableResponse>;
export interface WriteRecordsResponse {
  RecordsIngested?: RecordsIngested;
}
export const WriteRecordsResponse = S.suspend(() =>
  S.Struct({ RecordsIngested: S.optional(RecordsIngested) }),
).annotations({
  identifier: "WriteRecordsResponse",
}) as any as S.Schema<WriteRecordsResponse>;
export interface CreateBatchLoadTaskResponse {
  TaskId: string;
}
export const CreateBatchLoadTaskResponse = S.suspend(() =>
  S.Struct({ TaskId: S.String }),
).annotations({
  identifier: "CreateBatchLoadTaskResponse",
}) as any as S.Schema<CreateBatchLoadTaskResponse>;
export interface RejectedRecord {
  RecordIndex?: number;
  Reason?: string;
  ExistingVersion?: number;
}
export const RejectedRecord = S.suspend(() =>
  S.Struct({
    RecordIndex: S.optional(S.Number),
    Reason: S.optional(S.String),
    ExistingVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "RejectedRecord",
}) as any as S.Schema<RejectedRecord>;
export type RejectedRecords = RejectedRecord[];
export const RejectedRecords = S.Array(RejectedRecord);

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.String },
).pipe(C.withAuthError) {}
export class InvalidEndpointException extends S.TaggedError<InvalidEndpointException>()(
  "InvalidEndpointException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.String },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.String },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.String },
).pipe(C.withBadRequestError) {}
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
export const describeBatchLoadTask: (
  input: DescribeBatchLoadTaskRequest,
) => effect.Effect<
  DescribeBatchLoadTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidEndpointException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeBatchLoadTaskRequest,
  output: DescribeBatchLoadTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidEndpointException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Provides a list of batch load tasks, along with the name, status, when the task is
 * resumable until, and other details. See code
 * sample for details.
 */
export const listBatchLoadTasks: {
  (
    input: ListBatchLoadTasksRequest,
  ): effect.Effect<
    ListBatchLoadTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidEndpointException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBatchLoadTasksRequest,
  ) => stream.Stream<
    ListBatchLoadTasksResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidEndpointException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBatchLoadTasksRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | InvalidEndpointException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Associates a set of tags with a Timestream resource. You can then activate
 * these user-defined tags so that they appear on the Billing and Cost Management console for
 * cost allocation tracking.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InvalidEndpointException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeEndpoints: (
  input: DescribeEndpointsRequest,
) => effect.Effect<
  DescribeEndpointsResponse,
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEndpointsRequest,
  output: DescribeEndpointsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Returns a list of your Timestream databases. Service quotas apply. See
 * code sample for
 * details.
 */
export const listDatabases: {
  (
    input: ListDatabasesRequest,
  ): effect.Effect<
    ListDatabasesResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidEndpointException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatabasesRequest,
  ) => stream.Stream<
    ListDatabasesResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidEndpointException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatabasesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | InvalidEndpointException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Provides a list of tables, along with the name, status, and retention properties of each
 * table. See code sample
 * for details.
 */
export const listTables: {
  (
    input: ListTablesRequest,
  ): effect.Effect<
    ListTablesResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidEndpointException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTablesRequest,
  ) => stream.Stream<
    ListTablesResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidEndpointException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTablesRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServerException
    | InvalidEndpointException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const updateTable: (
  input: UpdateTableRequest,
) => effect.Effect<
  UpdateTableResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidEndpointException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTable: (
  input: DeleteTableRequest,
) => effect.Effect<
  DeleteTableResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidEndpointException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const resumeBatchLoadTask: (
  input: ResumeBatchLoadTaskRequest,
) => effect.Effect<
  ResumeBatchLoadTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidEndpointException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InvalidEndpointException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDatabase: (
  input: DeleteDatabaseRequest,
) => effect.Effect<
  DeleteDatabaseResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidEndpointException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeDatabase: (
  input: DescribeDatabaseRequest,
) => effect.Effect<
  DescribeDatabaseResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidEndpointException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeTable: (
  input: DescribeTableRequest,
) => effect.Effect<
  DescribeTableResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidEndpointException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateDatabase: (
  input: UpdateDatabaseRequest,
) => effect.Effect<
  UpdateDatabaseResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidEndpointException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InvalidEndpointException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createDatabase: (
  input: CreateDatabaseRequest,
) => effect.Effect<
  CreateDatabaseResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidEndpointException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTable: (
  input: CreateTableRequest,
) => effect.Effect<
  CreateTableResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidEndpointException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createBatchLoadTask: (
  input: CreateBatchLoadTaskRequest,
) => effect.Effect<
  CreateBatchLoadTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | InvalidEndpointException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const writeRecords: (
  input: WriteRecordsRequest,
) => effect.Effect<
  WriteRecordsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidEndpointException
  | RejectedRecordsException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
