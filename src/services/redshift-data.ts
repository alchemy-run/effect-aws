import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "Redshift Data",
  serviceShapeName: "RedshiftData",
});
const auth = T.AwsAuthSigv4({ name: "redshift-data" });
const ver = T.ServiceVersion("2019-12-20");
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
                        url: "https://redshift-data-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://redshift-data-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://redshift-data.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://redshift-data.{Region}.{PartitionResult#dnsSuffix}",
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
export const SqlList = S.Array(S.String);
export class BatchExecuteStatementInput extends S.Class<BatchExecuteStatementInput>(
  "BatchExecuteStatementInput",
)(
  {
    Sqls: SqlList,
    ClusterIdentifier: S.optional(S.String),
    SecretArn: S.optional(S.String),
    DbUser: S.optional(S.String),
    Database: S.optional(S.String),
    WithEvent: S.optional(S.Boolean),
    StatementName: S.optional(S.String),
    WorkgroupName: S.optional(S.String),
    ClientToken: S.optional(S.String),
    ResultFormat: S.optional(S.String),
    SessionKeepAliveSeconds: S.optional(S.Number),
    SessionId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelStatementRequest extends S.Class<CancelStatementRequest>(
  "CancelStatementRequest",
)(
  { Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeStatementRequest extends S.Class<DescribeStatementRequest>(
  "DescribeStatementRequest",
)(
  { Id: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTableRequest extends S.Class<DescribeTableRequest>(
  "DescribeTableRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetStatementResultRequest extends S.Class<GetStatementResultRequest>(
  "GetStatementResultRequest",
)(
  { Id: S.String, NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetStatementResultV2Request extends S.Class<GetStatementResultV2Request>(
  "GetStatementResultV2Request",
)(
  { Id: S.String, NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDatabasesRequest extends S.Class<ListDatabasesRequest>(
  "ListDatabasesRequest",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    Database: S.String,
    SecretArn: S.optional(S.String),
    DbUser: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkgroupName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSchemasRequest extends S.Class<ListSchemasRequest>(
  "ListSchemasRequest",
)(
  {
    ClusterIdentifier: S.optional(S.String),
    SecretArn: S.optional(S.String),
    DbUser: S.optional(S.String),
    Database: S.String,
    ConnectedDatabase: S.optional(S.String),
    SchemaPattern: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkgroupName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStatementsRequest extends S.Class<ListStatementsRequest>(
  "ListStatementsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    StatementName: S.optional(S.String),
    Status: S.optional(S.String),
    RoleLevel: S.optional(S.Boolean),
    Database: S.optional(S.String),
    ClusterIdentifier: S.optional(S.String),
    WorkgroupName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTablesRequest extends S.Class<ListTablesRequest>(
  "ListTablesRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const DbGroupList = S.Array(S.String);
export class SqlParameter extends S.Class<SqlParameter>("SqlParameter")({
  name: S.String,
  value: S.String,
}) {}
export const SqlParametersList = S.Array(SqlParameter);
export class ColumnMetadata extends S.Class<ColumnMetadata>("ColumnMetadata")({
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
}) {}
export const ColumnMetadataList = S.Array(ColumnMetadata);
export const DatabaseList = S.Array(S.String);
export const SchemaList = S.Array(S.String);
export class BatchExecuteStatementOutput extends S.Class<BatchExecuteStatementOutput>(
  "BatchExecuteStatementOutput",
)({
  Id: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ClusterIdentifier: S.optional(S.String),
  DbUser: S.optional(S.String),
  DbGroups: S.optional(DbGroupList),
  Database: S.optional(S.String),
  SecretArn: S.optional(S.String),
  WorkgroupName: S.optional(S.String),
  SessionId: S.optional(S.String),
}) {}
export class CancelStatementResponse extends S.Class<CancelStatementResponse>(
  "CancelStatementResponse",
)({ Status: S.optional(S.Boolean) }) {}
export class ExecuteStatementInput extends S.Class<ExecuteStatementInput>(
  "ExecuteStatementInput",
)(
  {
    Sql: S.String,
    ClusterIdentifier: S.optional(S.String),
    SecretArn: S.optional(S.String),
    DbUser: S.optional(S.String),
    Database: S.optional(S.String),
    WithEvent: S.optional(S.Boolean),
    StatementName: S.optional(S.String),
    Parameters: S.optional(SqlParametersList),
    WorkgroupName: S.optional(S.String),
    ClientToken: S.optional(S.String),
    ResultFormat: S.optional(S.String),
    SessionKeepAliveSeconds: S.optional(S.Number),
    SessionId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDatabasesResponse extends S.Class<ListDatabasesResponse>(
  "ListDatabasesResponse",
)({ Databases: S.optional(DatabaseList), NextToken: S.optional(S.String) }) {}
export class ListSchemasResponse extends S.Class<ListSchemasResponse>(
  "ListSchemasResponse",
)({ Schemas: S.optional(SchemaList), NextToken: S.optional(S.String) }) {}
export const StatementStringList = S.Array(S.String);
export class SubStatementData extends S.Class<SubStatementData>(
  "SubStatementData",
)({
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
}) {}
export const SubStatementList = S.Array(SubStatementData);
export const ColumnList = S.Array(ColumnMetadata);
export const Field = S.Union(
  S.Struct({ isNull: S.Boolean }),
  S.Struct({ booleanValue: S.Boolean }),
  S.Struct({ longValue: S.Number }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ stringValue: S.String }),
  S.Struct({ blobValue: T.Blob }),
);
export const FieldList = S.Array(Field);
export const SqlRecords = S.Array(FieldList);
export const QueryRecords = S.Union(S.Struct({ CSVRecords: S.String }));
export const FormattedSqlRecords = S.Array(QueryRecords);
export class StatementData extends S.Class<StatementData>("StatementData")({
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
}) {}
export const StatementList = S.Array(StatementData);
export class TableMember extends S.Class<TableMember>("TableMember")({
  name: S.optional(S.String),
  type: S.optional(S.String),
  schema: S.optional(S.String),
}) {}
export const TableList = S.Array(TableMember);
export class DescribeStatementResponse extends S.Class<DescribeStatementResponse>(
  "DescribeStatementResponse",
)({
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
}) {}
export class DescribeTableResponse extends S.Class<DescribeTableResponse>(
  "DescribeTableResponse",
)({
  TableName: S.optional(S.String),
  ColumnList: S.optional(ColumnList),
  NextToken: S.optional(S.String),
}) {}
export class ExecuteStatementOutput extends S.Class<ExecuteStatementOutput>(
  "ExecuteStatementOutput",
)({
  Id: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ClusterIdentifier: S.optional(S.String),
  DbUser: S.optional(S.String),
  DbGroups: S.optional(DbGroupList),
  Database: S.optional(S.String),
  SecretArn: S.optional(S.String),
  WorkgroupName: S.optional(S.String),
  SessionId: S.optional(S.String),
}) {}
export class GetStatementResultResponse extends S.Class<GetStatementResultResponse>(
  "GetStatementResultResponse",
)({
  Records: SqlRecords,
  ColumnMetadata: S.optional(ColumnMetadataList),
  TotalNumRows: S.optional(S.Number),
  NextToken: S.optional(S.String),
}) {}
export class GetStatementResultV2Response extends S.Class<GetStatementResultV2Response>(
  "GetStatementResultV2Response",
)({
  Records: FormattedSqlRecords,
  ColumnMetadata: S.optional(ColumnMetadataList),
  TotalNumRows: S.optional(S.Number),
  ResultFormat: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export class ListStatementsResponse extends S.Class<ListStatementsResponse>(
  "ListStatementsResponse",
)({ Statements: StatementList, NextToken: S.optional(S.String) }) {}
export class ListTablesResponse extends S.Class<ListTablesResponse>(
  "ListTablesResponse",
)({ Tables: S.optional(TableList), NextToken: S.optional(S.String) }) {}

//# Errors
export class DatabaseConnectionException extends S.TaggedError<DatabaseConnectionException>()(
  "DatabaseConnectionException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class ActiveSessionsExceededException extends S.TaggedError<ActiveSessionsExceededException>()(
  "ActiveSessionsExceededException",
  { Message: S.optional(S.String) },
) {}
export class QueryTimeoutException extends S.TaggedError<QueryTimeoutException>()(
  "QueryTimeoutException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class ActiveStatementsExceededException extends S.TaggedError<ActiveStatementsExceededException>()(
  "ActiveStatementsExceededException",
  {},
) {}
export class ExecuteStatementException extends S.TaggedError<ExecuteStatementException>()(
  "ExecuteStatementException",
  { Message: S.String, StatementId: S.String },
) {}
export class BatchExecuteStatementException extends S.TaggedError<BatchExecuteStatementException>()(
  "BatchExecuteStatementException",
  { Message: S.String, StatementId: S.String },
) {}

//# Operations
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
export const describeTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTableRequest,
  output: DescribeTableResponse,
  errors: [
    DatabaseConnectionException,
    InternalServerException,
    QueryTimeoutException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Fetches the temporarily cached result of an SQL statement in JSON format. The `ExecuteStatement` or `BatchExecuteStatement` operation that ran the SQL statement must have specified `ResultFormat` as `JSON` , or let the format default to JSON. A token is returned to page through the statement results.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const getStatementResult = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStatementResultRequest,
  output: GetStatementResultResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Fetches the temporarily cached result of an SQL statement in CSV format. The `ExecuteStatement` or `BatchExecuteStatement` operation that ran the SQL statement must have specified `ResultFormat` as `CSV`. A token is returned to page through the statement results.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const getStatementResultV2 = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetStatementResultV2Request,
    output: GetStatementResultV2Response,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
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
export const listDatabases = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDatabasesRequest,
  output: ListDatabasesResponse,
  errors: [
    DatabaseConnectionException,
    InternalServerException,
    QueryTimeoutException,
    ResourceNotFoundException,
    ValidationException,
  ],
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
export const listSchemas = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSchemasRequest,
  output: ListSchemasResponse,
  errors: [
    DatabaseConnectionException,
    InternalServerException,
    QueryTimeoutException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * List of SQL statements. By default, only finished statements are shown. A token is returned to page through the statement list.
 *
 * When you use identity-enhanced role sessions to list statements, you must provide either the `cluster-identifier` or `workgroup-name` parameter. This ensures that the IdC user can only access the Amazon Redshift IdC applications they are assigned. For more information, see Trusted identity propagation overview.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const listStatements = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStatementsRequest,
  output: ListStatementsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
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
export const listTables = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTablesRequest,
  output: ListTablesResponse,
  errors: [
    DatabaseConnectionException,
    InternalServerException,
    QueryTimeoutException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Cancels a running query. To be canceled, a query must be running.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const cancelStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Describes the details about a specific instance when a query was run by the Amazon Redshift Data API. The information includes when the query started, when it finished, the query status, the number of rows returned, and the SQL statement.
 *
 * For more information about the Amazon Redshift Data API and CLI usage examples, see Using the Amazon Redshift Data API in the *Amazon Redshift Management Guide*.
 */
export const describeStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeStatementRequest,
  output: DescribeStatementResponse,
  errors: [
    InternalServerException,
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
export const executeStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchExecuteStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
