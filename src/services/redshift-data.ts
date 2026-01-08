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
  sdkId: "Redshift Data",
  serviceShapeName: "RedshiftData",
});
const auth = T.AwsAuthSigv4({ name: "redshift-data" });
const ver = T.ServiceVersion("2019-12-20");
const proto = T.AwsProtocolsAwsJson1_1();
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
              `https://redshift-data-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://redshift-data-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://redshift-data.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://redshift-data.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type StatementString = string;
export type ClusterIdentifierString = string;
export type SecretArn = string;
export type StatementNameString = string;
export type WorkgroupNameString = string;
export type ClientToken = string;
export type ResultFormatString = string;
export type SessionAliveSeconds = number;
export type UUID = string;
export type PageSize = number;
export type ListStatementsLimit = number;
export type StatusString = string;
export type ParameterName = string;
export type ParameterValue = string;
export type StatementStatusString = string;
export type BoxedBoolean = boolean;
export type BoxedLong = number;
export type BoxedDouble = number;

//# Schemas
export type SqlList = string[];
export const SqlList = S.Array(S.String);
export interface BatchExecuteStatementInput {
  Sqls: string[];
  ClusterIdentifier?: string;
  SecretArn?: string;
  DbUser?: string;
  Database?: string;
  WithEvent?: boolean;
  StatementName?: string;
  WorkgroupName?: string;
  ClientToken?: string;
  ResultFormat?: string;
  SessionKeepAliveSeconds?: number;
  SessionId?: string;
}
export const BatchExecuteStatementInput = S.suspend(() =>
  S.Struct({
    Sqls: SqlList,
    ClusterIdentifier: S.optional(S.String),
    SecretArn: S.optional(S.String),
    DbUser: S.optional(S.String),
    Database: S.optional(S.String),
    WithEvent: S.optional(S.Boolean),
    StatementName: S.optional(S.String),
    WorkgroupName: S.optional(S.String),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ResultFormat: S.optional(S.String),
    SessionKeepAliveSeconds: S.optional(S.Number),
    SessionId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchExecuteStatementInput",
}) as any as S.Schema<BatchExecuteStatementInput>;
export interface CancelStatementRequest {
  Id: string;
}
export const CancelStatementRequest = S.suspend(() =>
  S.Struct({ Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelStatementRequest",
}) as any as S.Schema<CancelStatementRequest>;
export interface DescribeStatementRequest {
  Id: string;
}
export const DescribeStatementRequest = S.suspend(() =>
  S.Struct({ Id: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeStatementRequest",
}) as any as S.Schema<DescribeStatementRequest>;
export interface DescribeTableRequest {
  ClusterIdentifier?: string;
  SecretArn?: string;
  DbUser?: string;
  Database: string;
  ConnectedDatabase?: string;
  Schema?: string;
  Table?: string;
  NextToken?: string;
  MaxResults?: number;
  WorkgroupName?: string;
}
export const DescribeTableRequest = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    SecretArn: S.optional(S.String),
    DbUser: S.optional(S.String),
    Database: S.String,
    ConnectedDatabase: S.optional(S.String),
    Schema: S.optional(S.String),
    Table: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkgroupName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeTableRequest",
}) as any as S.Schema<DescribeTableRequest>;
export interface GetStatementResultRequest {
  Id: string;
  NextToken?: string;
}
export const GetStatementResultRequest = S.suspend(() =>
  S.Struct({ Id: S.String, NextToken: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetStatementResultRequest",
}) as any as S.Schema<GetStatementResultRequest>;
export interface GetStatementResultV2Request {
  Id: string;
  NextToken?: string;
}
export const GetStatementResultV2Request = S.suspend(() =>
  S.Struct({ Id: S.String, NextToken: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetStatementResultV2Request",
}) as any as S.Schema<GetStatementResultV2Request>;
export interface ListDatabasesRequest {
  ClusterIdentifier?: string;
  Database: string;
  SecretArn?: string;
  DbUser?: string;
  NextToken?: string;
  MaxResults?: number;
  WorkgroupName?: string;
}
export const ListDatabasesRequest = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    Database: S.String,
    SecretArn: S.optional(S.String),
    DbUser: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkgroupName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDatabasesRequest",
}) as any as S.Schema<ListDatabasesRequest>;
export interface ListSchemasRequest {
  ClusterIdentifier?: string;
  SecretArn?: string;
  DbUser?: string;
  Database: string;
  ConnectedDatabase?: string;
  SchemaPattern?: string;
  NextToken?: string;
  MaxResults?: number;
  WorkgroupName?: string;
}
export const ListSchemasRequest = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    SecretArn: S.optional(S.String),
    DbUser: S.optional(S.String),
    Database: S.String,
    ConnectedDatabase: S.optional(S.String),
    SchemaPattern: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkgroupName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSchemasRequest",
}) as any as S.Schema<ListSchemasRequest>;
export interface ListStatementsRequest {
  NextToken?: string;
  MaxResults?: number;
  StatementName?: string;
  Status?: string;
  RoleLevel?: boolean;
  Database?: string;
  ClusterIdentifier?: string;
  WorkgroupName?: string;
}
export const ListStatementsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StatementName: S.optional(S.String),
    Status: S.optional(S.String),
    RoleLevel: S.optional(S.Boolean),
    Database: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    WorkgroupName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListStatementsRequest",
}) as any as S.Schema<ListStatementsRequest>;
export interface ListTablesRequest {
  ClusterIdentifier?: string;
  SecretArn?: string;
  DbUser?: string;
  Database: string;
  ConnectedDatabase?: string;
  SchemaPattern?: string;
  TablePattern?: string;
  NextToken?: string;
  MaxResults?: number;
  WorkgroupName?: string;
}
export const ListTablesRequest = S.suspend(() =>
  S.Struct({
    ClusterIdentifier: S.optional(S.String),
    SecretArn: S.optional(S.String),
    DbUser: S.optional(S.String),
    Database: S.String,
    ConnectedDatabase: S.optional(S.String),
    SchemaPattern: S.optional(S.String),
    TablePattern: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkgroupName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTablesRequest",
}) as any as S.Schema<ListTablesRequest>;
export type DbGroupList = string[];
export const DbGroupList = S.Array(S.String);
export interface SqlParameter {
  name: string;
  value: string;
}
export const SqlParameter = S.suspend(() =>
  S.Struct({ name: S.String, value: S.String }),
).annotations({ identifier: "SqlParameter" }) as any as S.Schema<SqlParameter>;
export type SqlParametersList = SqlParameter[];
export const SqlParametersList = S.Array(SqlParameter);
export interface ColumnMetadata {
  isCaseSensitive?: boolean;
  isCurrency?: boolean;
  isSigned?: boolean;
  label?: string;
  name?: string;
  nullable?: number;
  precision?: number;
  scale?: number;
  schemaName?: string;
  tableName?: string;
  typeName?: string;
  length?: number;
  columnDefault?: string;
}
export const ColumnMetadata = S.suspend(() =>
  S.Struct({
    isCaseSensitive: S.optional(S.Boolean),
    isCurrency: S.optional(S.Boolean),
    isSigned: S.optional(S.Boolean),
    label: S.optional(S.String),
    name: S.optional(S.String),
    nullable: S.optional(S.Number),
    precision: S.optional(S.Number),
    scale: S.optional(S.Number),
    schemaName: S.optional(S.String),
    tableName: S.optional(S.String),
    typeName: S.optional(S.String),
    length: S.optional(S.Number),
    columnDefault: S.optional(S.String),
  }),
).annotations({
  identifier: "ColumnMetadata",
}) as any as S.Schema<ColumnMetadata>;
export type ColumnMetadataList = ColumnMetadata[];
export const ColumnMetadataList = S.Array(ColumnMetadata);
export type DatabaseList = string[];
export const DatabaseList = S.Array(S.String);
export type SchemaList = string[];
export const SchemaList = S.Array(S.String);
export interface BatchExecuteStatementOutput {
  Id?: string;
  CreatedAt?: Date;
  ClusterIdentifier?: string;
  DbUser?: string;
  DbGroups?: string[];
  Database?: string;
  SecretArn?: string;
  WorkgroupName?: string;
  SessionId?: string;
}
export const BatchExecuteStatementOutput = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ClusterIdentifier: S.optional(S.String),
    DbUser: S.optional(S.String),
    DbGroups: S.optional(DbGroupList),
    Database: S.optional(S.String),
    SecretArn: S.optional(S.String),
    WorkgroupName: S.optional(S.String),
    SessionId: S.optional(S.String),
  }),
).annotations({
  identifier: "BatchExecuteStatementOutput",
}) as any as S.Schema<BatchExecuteStatementOutput>;
export interface CancelStatementResponse {
  Status?: boolean;
}
export const CancelStatementResponse = S.suspend(() =>
  S.Struct({ Status: S.optional(S.Boolean) }),
).annotations({
  identifier: "CancelStatementResponse",
}) as any as S.Schema<CancelStatementResponse>;
export interface ExecuteStatementInput {
  Sql: string;
  ClusterIdentifier?: string;
  SecretArn?: string;
  DbUser?: string;
  Database?: string;
  WithEvent?: boolean;
  StatementName?: string;
  Parameters?: SqlParameter[];
  WorkgroupName?: string;
  ClientToken?: string;
  ResultFormat?: string;
  SessionKeepAliveSeconds?: number;
  SessionId?: string;
}
export const ExecuteStatementInput = S.suspend(() =>
  S.Struct({
    Sql: S.String,
    ClusterIdentifier: S.optional(S.String),
    SecretArn: S.optional(S.String),
    DbUser: S.optional(S.String),
    Database: S.optional(S.String),
    WithEvent: S.optional(S.Boolean),
    StatementName: S.optional(S.String),
    Parameters: S.optional(SqlParametersList),
    WorkgroupName: S.optional(S.String),
    ClientToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    ResultFormat: S.optional(S.String),
    SessionKeepAliveSeconds: S.optional(S.Number),
    SessionId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExecuteStatementInput",
}) as any as S.Schema<ExecuteStatementInput>;
export interface ListDatabasesResponse {
  Databases?: string[];
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
export interface ListSchemasResponse {
  Schemas?: string[];
  NextToken?: string;
}
export const ListSchemasResponse = S.suspend(() =>
  S.Struct({
    Schemas: S.optional(SchemaList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSchemasResponse",
}) as any as S.Schema<ListSchemasResponse>;
export type StatementStringList = string[];
export const StatementStringList = S.Array(S.String);
export interface SubStatementData {
  Id: string;
  Duration?: number;
  Error?: string;
  Status?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  QueryString?: string;
  ResultRows?: number;
  ResultSize?: number;
  RedshiftQueryId?: number;
  HasResultSet?: boolean;
}
export const SubStatementData = S.suspend(() =>
  S.Struct({
    Id: S.String,
    Duration: S.optional(S.Number),
    Error: S.optional(S.String),
    Status: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    QueryString: S.optional(S.String),
    ResultRows: S.optional(S.Number),
    ResultSize: S.optional(S.Number),
    RedshiftQueryId: S.optional(S.Number),
    HasResultSet: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "SubStatementData",
}) as any as S.Schema<SubStatementData>;
export type SubStatementList = SubStatementData[];
export const SubStatementList = S.Array(SubStatementData);
export type ColumnList = ColumnMetadata[];
export const ColumnList = S.Array(ColumnMetadata);
export type Field =
  | { isNull: boolean }
  | { booleanValue: boolean }
  | { longValue: number }
  | { doubleValue: number }
  | { stringValue: string }
  | { blobValue: Uint8Array };
export const Field = S.Union(
  S.Struct({ isNull: S.Boolean }),
  S.Struct({ booleanValue: S.Boolean }),
  S.Struct({ longValue: S.Number }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ stringValue: S.String }),
  S.Struct({ blobValue: T.Blob }),
);
export type FieldList = Field[];
export const FieldList = S.Array(Field);
export type SqlRecords = Field[][];
export const SqlRecords = S.Array(FieldList);
export type QueryRecords = { CSVRecords: string };
export const QueryRecords = S.Union(S.Struct({ CSVRecords: S.String }));
export type FormattedSqlRecords = QueryRecords[];
export const FormattedSqlRecords = S.Array(QueryRecords);
export interface StatementData {
  Id: string;
  QueryString?: string;
  QueryStrings?: string[];
  SecretArn?: string;
  Status?: string;
  StatementName?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  QueryParameters?: SqlParameter[];
  IsBatchStatement?: boolean;
  ResultFormat?: string;
  SessionId?: string;
}
export const StatementData = S.suspend(() =>
  S.Struct({
    Id: S.String,
    QueryString: S.optional(S.String),
    QueryStrings: S.optional(StatementStringList),
    SecretArn: S.optional(S.String),
    Status: S.optional(S.String),
    StatementName: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    QueryParameters: S.optional(SqlParametersList),
    IsBatchStatement: S.optional(S.Boolean),
    ResultFormat: S.optional(S.String),
    SessionId: S.optional(S.String),
  }),
).annotations({
  identifier: "StatementData",
}) as any as S.Schema<StatementData>;
export type StatementList = StatementData[];
export const StatementList = S.Array(StatementData);
export interface TableMember {
  name?: string;
  type?: string;
  schema?: string;
}
export const TableMember = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    type: S.optional(S.String),
    schema: S.optional(S.String),
  }),
).annotations({ identifier: "TableMember" }) as any as S.Schema<TableMember>;
export type TableList = TableMember[];
export const TableList = S.Array(TableMember);
export interface DescribeStatementResponse {
  Id: string;
  SecretArn?: string;
  DbUser?: string;
  Database?: string;
  ClusterIdentifier?: string;
  Duration?: number;
  Error?: string;
  Status?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
  RedshiftPid?: number;
  HasResultSet?: boolean;
  QueryString?: string;
  ResultRows?: number;
  ResultSize?: number;
  RedshiftQueryId?: number;
  QueryParameters?: SqlParameter[];
  SubStatements?: SubStatementData[];
  WorkgroupName?: string;
  ResultFormat?: string;
  SessionId?: string;
}
export const DescribeStatementResponse = S.suspend(() =>
  S.Struct({
    Id: S.String,
    SecretArn: S.optional(S.String),
    DbUser: S.optional(S.String),
    Database: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    Duration: S.optional(S.Number),
    Error: S.optional(S.String),
    Status: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RedshiftPid: S.optional(S.Number),
    HasResultSet: S.optional(S.Boolean),
    QueryString: S.optional(S.String),
    ResultRows: S.optional(S.Number),
    ResultSize: S.optional(S.Number),
    RedshiftQueryId: S.optional(S.Number),
    QueryParameters: S.optional(SqlParametersList),
    SubStatements: S.optional(SubStatementList),
    WorkgroupName: S.optional(S.String),
    ResultFormat: S.optional(S.String),
    SessionId: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeStatementResponse",
}) as any as S.Schema<DescribeStatementResponse>;
export interface DescribeTableResponse {
  TableName?: string;
  ColumnList?: ColumnMetadata[];
  NextToken?: string;
}
export const DescribeTableResponse = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    ColumnList: S.optional(ColumnList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeTableResponse",
}) as any as S.Schema<DescribeTableResponse>;
export interface ExecuteStatementOutput {
  Id?: string;
  CreatedAt?: Date;
  ClusterIdentifier?: string;
  DbUser?: string;
  DbGroups?: string[];
  Database?: string;
  SecretArn?: string;
  WorkgroupName?: string;
  SessionId?: string;
}
export const ExecuteStatementOutput = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ClusterIdentifier: S.optional(S.String),
    DbUser: S.optional(S.String),
    DbGroups: S.optional(DbGroupList),
    Database: S.optional(S.String),
    SecretArn: S.optional(S.String),
    WorkgroupName: S.optional(S.String),
    SessionId: S.optional(S.String),
  }),
).annotations({
  identifier: "ExecuteStatementOutput",
}) as any as S.Schema<ExecuteStatementOutput>;
export interface GetStatementResultResponse {
  Records: Field[][];
  ColumnMetadata?: ColumnMetadata[];
  TotalNumRows?: number;
  NextToken?: string;
}
export const GetStatementResultResponse = S.suspend(() =>
  S.Struct({
    Records: SqlRecords,
    ColumnMetadata: S.optional(ColumnMetadataList),
    TotalNumRows: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetStatementResultResponse",
}) as any as S.Schema<GetStatementResultResponse>;
export interface GetStatementResultV2Response {
  Records: QueryRecords[];
  ColumnMetadata?: ColumnMetadata[];
  TotalNumRows?: number;
  ResultFormat?: string;
  NextToken?: string;
}
export const GetStatementResultV2Response = S.suspend(() =>
  S.Struct({
    Records: FormattedSqlRecords,
    ColumnMetadata: S.optional(ColumnMetadataList),
    TotalNumRows: S.optional(S.Number),
    ResultFormat: S.optional(S.String),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetStatementResultV2Response",
}) as any as S.Schema<GetStatementResultV2Response>;
export interface ListStatementsResponse {
  Statements: StatementData[];
  NextToken?: string;
}
export const ListStatementsResponse = S.suspend(() =>
  S.Struct({ Statements: StatementList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListStatementsResponse",
}) as any as S.Schema<ListStatementsResponse>;
export interface ListTablesResponse {
  Tables?: TableMember[];
  NextToken?: string;
}
export const ListTablesResponse = S.suspend(() =>
  S.Struct({ Tables: S.optional(TableList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTablesResponse",
}) as any as S.Schema<ListTablesResponse>;

//# Errors
export class ActiveSessionsExceededException extends S.TaggedError<ActiveSessionsExceededException>()(
  "ActiveSessionsExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DatabaseConnectionException extends S.TaggedError<DatabaseConnectionException>()(
  "DatabaseConnectionException",
  { Message: S.String },
).pipe(C.withServerError) {}
export class ActiveStatementsExceededException extends S.TaggedError<ActiveStatementsExceededException>()(
  "ActiveStatementsExceededException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(C.withServerError) {}
export class BatchExecuteStatementException extends S.TaggedError<BatchExecuteStatementException>()(
  "BatchExecuteStatementException",
  { Message: S.String, StatementId: S.String },
).pipe(C.withServerError) {}
export class QueryTimeoutException extends S.TaggedError<QueryTimeoutException>()(
  "QueryTimeoutException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ExecuteStatementException extends S.TaggedError<ExecuteStatementException>()(
  "ExecuteStatementException",
  { Message: S.String, StatementId: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Describes the details about a specific instance when a query was run by the Amazon Redshift Data API. The information includes when the query started, when it finished, the query status, the number of rows returned, and the SQL statement.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const describeStatement: (
  input: DescribeStatementRequest,
) => effect.Effect<
  DescribeStatementResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStatementRequest,
  output: DescribeStatementResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Describes the detailed information about a table from metadata in the cluster. The information includes its columns. A token is returned to page through the column list. Depending on the authorization method, use one of the following combinations of request parameters:
 *
 * - Secrets Manager - when connecting to a cluster, provide the `secret-arn` of a secret stored in Secrets Manager which has `username` and `password`. The specified secret contains credentials to connect to the `database` you specify. When you are connecting to a cluster, you also supply the database name, If you provide a cluster identifier (`dbClusterIdentifier`), it must match the cluster identifier stored in the secret. When you are connecting to a serverless workgroup, you also supply the database name.
 *
 * - Temporary credentials - when connecting to your data warehouse, choose one of the following options:
 *
 * - When connecting to a serverless workgroup, specify the workgroup name and database name. The database user name is derived from the IAM identity. For example, `arn:iam::123456789012:user:foo` has the database user name `IAM:foo`. Also, permission to call the `redshift-serverless:GetCredentials` operation is required.
 *
 * - When connecting to a cluster as an IAM identity, specify the cluster identifier and the database name. The database user name is derived from the IAM identity. For example, `arn:iam::123456789012:user:foo` has the database user name `IAM:foo`. Also, permission to call the `redshift:GetClusterCredentialsWithIAM` operation is required.
 *
 * - When connecting to a cluster as a database user, specify the cluster identifier, the database name, and the database user name. Also, permission to call the `redshift:GetClusterCredentials` operation is required.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const describeTable: {
  (
    input: DescribeTableRequest,
  ): effect.Effect<
    DescribeTableResponse,
    | DatabaseConnectionException
    | InternalServerException
    | QueryTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeTableRequest,
  ) => stream.Stream<
    DescribeTableResponse,
    | DatabaseConnectionException
    | InternalServerException
    | QueryTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeTableRequest,
  ) => stream.Stream<
    ColumnMetadata,
    | DatabaseConnectionException
    | InternalServerException
    | QueryTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeTableRequest,
  output: DescribeTableResponse,
  errors: [
    DatabaseConnectionException,
    InternalServerException,
    QueryTimeoutException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ColumnList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the tables in a database. If neither `SchemaPattern` nor `TablePattern` are specified, then all tables in the database are returned. A token is returned to page through the table list. Depending on the authorization method, use one of the following combinations of request parameters:
 *
 * - Secrets Manager - when connecting to a cluster, provide the `secret-arn` of a secret stored in Secrets Manager which has `username` and `password`. The specified secret contains credentials to connect to the `database` you specify. When you are connecting to a cluster, you also supply the database name, If you provide a cluster identifier (`dbClusterIdentifier`), it must match the cluster identifier stored in the secret. When you are connecting to a serverless workgroup, you also supply the database name.
 *
 * - Temporary credentials - when connecting to your data warehouse, choose one of the following options:
 *
 * - When connecting to a serverless workgroup, specify the workgroup name and database name. The database user name is derived from the IAM identity. For example, `arn:iam::123456789012:user:foo` has the database user name `IAM:foo`. Also, permission to call the `redshift-serverless:GetCredentials` operation is required.
 *
 * - When connecting to a cluster as an IAM identity, specify the cluster identifier and the database name. The database user name is derived from the IAM identity. For example, `arn:iam::123456789012:user:foo` has the database user name `IAM:foo`. Also, permission to call the `redshift:GetClusterCredentialsWithIAM` operation is required.
 *
 * - When connecting to a cluster as a database user, specify the cluster identifier, the database name, and the database user name. Also, permission to call the `redshift:GetClusterCredentials` operation is required.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const listTables: {
  (
    input: ListTablesRequest,
  ): effect.Effect<
    ListTablesResponse,
    | DatabaseConnectionException
    | InternalServerException
    | QueryTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTablesRequest,
  ) => stream.Stream<
    ListTablesResponse,
    | DatabaseConnectionException
    | InternalServerException
    | QueryTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTablesRequest,
  ) => stream.Stream<
    TableMember,
    | DatabaseConnectionException
    | InternalServerException
    | QueryTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTablesRequest,
  output: ListTablesResponse,
  errors: [
    DatabaseConnectionException,
    InternalServerException,
    QueryTimeoutException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tables",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List the databases in a cluster. A token is returned to page through the database list. Depending on the authorization method, use one of the following combinations of request parameters:
 *
 * - Secrets Manager - when connecting to a cluster, provide the `secret-arn` of a secret stored in Secrets Manager which has `username` and `password`. The specified secret contains credentials to connect to the `database` you specify. When you are connecting to a cluster, you also supply the database name, If you provide a cluster identifier (`dbClusterIdentifier`), it must match the cluster identifier stored in the secret. When you are connecting to a serverless workgroup, you also supply the database name.
 *
 * - Temporary credentials - when connecting to your data warehouse, choose one of the following options:
 *
 * - When connecting to a serverless workgroup, specify the workgroup name and database name. The database user name is derived from the IAM identity. For example, `arn:iam::123456789012:user:foo` has the database user name `IAM:foo`. Also, permission to call the `redshift-serverless:GetCredentials` operation is required.
 *
 * - When connecting to a cluster as an IAM identity, specify the cluster identifier and the database name. The database user name is derived from the IAM identity. For example, `arn:iam::123456789012:user:foo` has the database user name `IAM:foo`. Also, permission to call the `redshift:GetClusterCredentialsWithIAM` operation is required.
 *
 * - When connecting to a cluster as a database user, specify the cluster identifier, the database name, and the database user name. Also, permission to call the `redshift:GetClusterCredentials` operation is required.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const listDatabases: {
  (
    input: ListDatabasesRequest,
  ): effect.Effect<
    ListDatabasesResponse,
    | DatabaseConnectionException
    | InternalServerException
    | QueryTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatabasesRequest,
  ) => stream.Stream<
    ListDatabasesResponse,
    | DatabaseConnectionException
    | InternalServerException
    | QueryTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatabasesRequest,
  ) => stream.Stream<
    string,
    | DatabaseConnectionException
    | InternalServerException
    | QueryTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatabasesRequest,
  output: ListDatabasesResponse,
  errors: [
    DatabaseConnectionException,
    InternalServerException,
    QueryTimeoutException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Databases",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the schemas in a database. A token is returned to page through the schema list. Depending on the authorization method, use one of the following combinations of request parameters:
 *
 * - Secrets Manager - when connecting to a cluster, provide the `secret-arn` of a secret stored in Secrets Manager which has `username` and `password`. The specified secret contains credentials to connect to the `database` you specify. When you are connecting to a cluster, you also supply the database name, If you provide a cluster identifier (`dbClusterIdentifier`), it must match the cluster identifier stored in the secret. When you are connecting to a serverless workgroup, you also supply the database name.
 *
 * - Temporary credentials - when connecting to your data warehouse, choose one of the following options:
 *
 * - When connecting to a serverless workgroup, specify the workgroup name and database name. The database user name is derived from the IAM identity. For example, `arn:iam::123456789012:user:foo` has the database user name `IAM:foo`. Also, permission to call the `redshift-serverless:GetCredentials` operation is required.
 *
 * - When connecting to a cluster as an IAM identity, specify the cluster identifier and the database name. The database user name is derived from the IAM identity. For example, `arn:iam::123456789012:user:foo` has the database user name `IAM:foo`. Also, permission to call the `redshift:GetClusterCredentialsWithIAM` operation is required.
 *
 * - When connecting to a cluster as a database user, specify the cluster identifier, the database name, and the database user name. Also, permission to call the `redshift:GetClusterCredentials` operation is required.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const listSchemas: {
  (
    input: ListSchemasRequest,
  ): effect.Effect<
    ListSchemasResponse,
    | DatabaseConnectionException
    | InternalServerException
    | QueryTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchemasRequest,
  ) => stream.Stream<
    ListSchemasResponse,
    | DatabaseConnectionException
    | InternalServerException
    | QueryTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchemasRequest,
  ) => stream.Stream<
    string,
    | DatabaseConnectionException
    | InternalServerException
    | QueryTimeoutException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSchemasRequest,
  output: ListSchemasResponse,
  errors: [
    DatabaseConnectionException,
    InternalServerException,
    QueryTimeoutException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Schemas",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Fetches the temporarily cached result of an SQL statement in JSON format. The `ExecuteStatement` or `BatchExecuteStatement` operation that ran the SQL statement must have specified `ResultFormat` as `JSON` , or let the format default to JSON. A token is returned to page through the statement results.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const getStatementResult: {
  (
    input: GetStatementResultRequest,
  ): effect.Effect<
    GetStatementResultResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetStatementResultRequest,
  ) => stream.Stream<
    GetStatementResultResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetStatementResultRequest,
  ) => stream.Stream<
    Field[],
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetStatementResultRequest,
  output: GetStatementResultResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Records",
  } as const,
}));
/**
 * Fetches the temporarily cached result of an SQL statement in CSV format. The `ExecuteStatement` or `BatchExecuteStatement` operation that ran the SQL statement must have specified `ResultFormat` as `CSV`. A token is returned to page through the statement results.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const getStatementResultV2: {
  (
    input: GetStatementResultV2Request,
  ): effect.Effect<
    GetStatementResultV2Response,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetStatementResultV2Request,
  ) => stream.Stream<
    GetStatementResultV2Response,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetStatementResultV2Request,
  ) => stream.Stream<
    QueryRecords,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetStatementResultV2Request,
  output: GetStatementResultV2Response,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Records",
  } as const,
}));
/**
 * List of SQL statements. By default, only finished statements are shown. A token is returned to page through the statement list.
 *
 * When you use identity-enhanced role sessions to list statements, you must provide either the `cluster-identifier` or `workgroup-name` parameter. This ensures that the IdC user can only access the Amazon Redshift IdC applications they are assigned. For more information, see Trusted identity propagation overview.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const listStatements: {
  (
    input: ListStatementsRequest,
  ): effect.Effect<
    ListStatementsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListStatementsRequest,
  ) => stream.Stream<
    ListStatementsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListStatementsRequest,
  ) => stream.Stream<
    StatementData,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListStatementsRequest,
  output: ListStatementsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Statements",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Runs one or more SQL statements, which can be data manipulation language (DML) or data definition language (DDL). Depending on the authorization method, use one of the following combinations of request parameters:
 *
 * - Secrets Manager - when connecting to a cluster, provide the `secret-arn` of a secret stored in Secrets Manager which has `username` and `password`. The specified secret contains credentials to connect to the `database` you specify. When you are connecting to a cluster, you also supply the database name, If you provide a cluster identifier (`dbClusterIdentifier`), it must match the cluster identifier stored in the secret. When you are connecting to a serverless workgroup, you also supply the database name.
 *
 * - Temporary credentials - when connecting to your data warehouse, choose one of the following options:
 *
 * - When connecting to a serverless workgroup, specify the workgroup name and database name. The database user name is derived from the IAM identity. For example, `arn:iam::123456789012:user:foo` has the database user name `IAM:foo`. Also, permission to call the `redshift-serverless:GetCredentials` operation is required.
 *
 * - When connecting to a cluster as an IAM identity, specify the cluster identifier and the database name. The database user name is derived from the IAM identity. For example, `arn:iam::123456789012:user:foo` has the database user name `IAM:foo`. Also, permission to call the `redshift:GetClusterCredentialsWithIAM` operation is required.
 *
 * - When connecting to a cluster as a database user, specify the cluster identifier, the database name, and the database user name. Also, permission to call the `redshift:GetClusterCredentials` operation is required.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const batchExecuteStatement: (
  input: BatchExecuteStatementInput,
) => effect.Effect<
  BatchExecuteStatementOutput,
  | ActiveSessionsExceededException
  | ActiveStatementsExceededException
  | BatchExecuteStatementException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchExecuteStatementInput,
  output: BatchExecuteStatementOutput,
  errors: [
    ActiveSessionsExceededException,
    ActiveStatementsExceededException,
    BatchExecuteStatementException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Cancels a running query. To be canceled, a query must be running.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const cancelStatement: (
  input: CancelStatementRequest,
) => effect.Effect<
  CancelStatementResponse,
  | DatabaseConnectionException
  | InternalServerException
  | QueryTimeoutException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelStatementRequest,
  output: CancelStatementResponse,
  errors: [
    DatabaseConnectionException,
    InternalServerException,
    QueryTimeoutException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Runs an SQL statement, which can be data manipulation language (DML) or data definition language (DDL). This statement must be a single SQL statement. Depending on the authorization method, use one of the following combinations of request parameters:
 *
 * - Secrets Manager - when connecting to a cluster, provide the `secret-arn` of a secret stored in Secrets Manager which has `username` and `password`. The specified secret contains credentials to connect to the `database` you specify. When you are connecting to a cluster, you also supply the database name, If you provide a cluster identifier (`dbClusterIdentifier`), it must match the cluster identifier stored in the secret. When you are connecting to a serverless workgroup, you also supply the database name.
 *
 * - Temporary credentials - when connecting to your data warehouse, choose one of the following options:
 *
 * - When connecting to a serverless workgroup, specify the workgroup name and database name. The database user name is derived from the IAM identity. For example, `arn:iam::123456789012:user:foo` has the database user name `IAM:foo`. Also, permission to call the `redshift-serverless:GetCredentials` operation is required.
 *
 * - When connecting to a cluster as an IAM identity, specify the cluster identifier and the database name. The database user name is derived from the IAM identity. For example, `arn:iam::123456789012:user:foo` has the database user name `IAM:foo`. Also, permission to call the `redshift:GetClusterCredentialsWithIAM` operation is required.
 *
 * - When connecting to a cluster as a database user, specify the cluster identifier, the database name, and the database user name. Also, permission to call the `redshift:GetClusterCredentials` operation is required.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const executeStatement: (
  input: ExecuteStatementInput,
) => effect.Effect<
  ExecuteStatementOutput,
  | ActiveSessionsExceededException
  | ActiveStatementsExceededException
  | ExecuteStatementException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteStatementInput,
  output: ExecuteStatementOutput,
  errors: [
    ActiveSessionsExceededException,
    ActiveStatementsExceededException,
    ExecuteStatementException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
