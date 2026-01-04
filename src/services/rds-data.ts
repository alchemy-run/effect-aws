import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "RDS Data",
  serviceShapeName: "RdsDataService",
});
const auth = T.AwsAuthSigv4({ name: "rds-data" });
const ver = T.ServiceVersion("2018-08-01");
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
                        url: "https://rds-data-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://rds-data-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://rds-data.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://rds-data.{Region}.{PartitionResult#dnsSuffix}",
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
export class BeginTransactionRequest extends S.Class<BeginTransactionRequest>(
  "BeginTransactionRequest",
)(
  {
    resourceArn: S.String,
    secretArn: S.String,
    database: S.optional(S.String),
    schema: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/BeginTransaction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CommitTransactionRequest extends S.Class<CommitTransactionRequest>(
  "CommitTransactionRequest",
)(
  { resourceArn: S.String, secretArn: S.String, transactionId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/CommitTransaction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ExecuteSqlRequest extends S.Class<ExecuteSqlRequest>(
  "ExecuteSqlRequest",
)(
  {
    dbClusterOrInstanceArn: S.String,
    awsSecretStoreArn: S.String,
    sqlStatements: S.String,
    database: S.optional(S.String),
    schema: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/ExecuteSql" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RollbackTransactionRequest extends S.Class<RollbackTransactionRequest>(
  "RollbackTransactionRequest",
)(
  { resourceArn: S.String, secretArn: S.String, transactionId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/RollbackTransaction" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ResultSetOptions extends S.Class<ResultSetOptions>(
  "ResultSetOptions",
)({
  decimalReturnType: S.optional(S.String),
  longReturnType: S.optional(S.String),
}) {}
export class BeginTransactionResponse extends S.Class<BeginTransactionResponse>(
  "BeginTransactionResponse",
)({ transactionId: S.optional(S.String) }) {}
export class CommitTransactionResponse extends S.Class<CommitTransactionResponse>(
  "CommitTransactionResponse",
)({ transactionStatus: S.optional(S.String) }) {}
export const BooleanArray = S.Array(S.Boolean);
export const LongArray = S.Array(S.Number);
export const DoubleArray = S.Array(S.Number);
export const StringArray = S.Array(S.String);
export type ArrayValue =
  | { booleanValues: (typeof BooleanArray)["Type"] }
  | { longValues: (typeof LongArray)["Type"] }
  | { doubleValues: (typeof DoubleArray)["Type"] }
  | { stringValues: (typeof StringArray)["Type"] }
  | { arrayValues: ArrayOfArray };
export const ArrayValue = S.Union(
  S.Struct({ booleanValues: BooleanArray }),
  S.Struct({ longValues: LongArray }),
  S.Struct({ doubleValues: DoubleArray }),
  S.Struct({ stringValues: StringArray }),
  S.Struct({ arrayValues: S.suspend(() => ArrayOfArray) }),
) as any as S.Schema<ArrayValue>;
export const Field = S.Union(
  S.Struct({ isNull: S.Boolean }),
  S.Struct({ booleanValue: S.Boolean }),
  S.Struct({ longValue: S.Number }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ stringValue: S.String }),
  S.Struct({ blobValue: T.Blob }),
  S.Struct({ arrayValue: ArrayValue }),
);
export class SqlParameter extends S.Class<SqlParameter>("SqlParameter")({
  name: S.optional(S.String),
  value: S.optional(Field),
  typeHint: S.optional(S.String),
}) {}
export const SqlParametersList = S.Array(SqlParameter);
export class ExecuteStatementRequest extends S.Class<ExecuteStatementRequest>(
  "ExecuteStatementRequest",
)(
  {
    resourceArn: S.String,
    secretArn: S.String,
    sql: S.String,
    database: S.optional(S.String),
    schema: S.optional(S.String),
    parameters: S.optional(SqlParametersList),
    transactionId: S.optional(S.String),
    includeResultMetadata: S.optional(S.Boolean),
    continueAfterTimeout: S.optional(S.Boolean),
    resultSetOptions: S.optional(ResultSetOptions),
    formatRecordsAs: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/Execute" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class RollbackTransactionResponse extends S.Class<RollbackTransactionResponse>(
  "RollbackTransactionResponse",
)({ transactionStatus: S.optional(S.String) }) {}
export type ArrayOfArray = ArrayValue[];
export const ArrayOfArray = S.Array(
  S.suspend(() => ArrayValue),
) as any as S.Schema<ArrayOfArray>;
export const FieldList = S.Array(Field);
export const SqlRecords = S.Array(FieldList);
export const SqlParameterSets = S.Array(SqlParametersList);
export class ColumnMetadata extends S.Class<ColumnMetadata>("ColumnMetadata")({
  name: S.optional(S.String),
  type: S.optional(S.Number),
  typeName: S.optional(S.String),
  label: S.optional(S.String),
  schemaName: S.optional(S.String),
  tableName: S.optional(S.String),
  isAutoIncrement: S.optional(S.Boolean),
  isSigned: S.optional(S.Boolean),
  isCurrency: S.optional(S.Boolean),
  isCaseSensitive: S.optional(S.Boolean),
  nullable: S.optional(S.Number),
  precision: S.optional(S.Number),
  scale: S.optional(S.Number),
  arrayBaseColumnType: S.optional(S.Number),
}) {}
export const Metadata = S.Array(ColumnMetadata);
export class ResultSetMetadata extends S.Class<ResultSetMetadata>(
  "ResultSetMetadata",
)({
  columnCount: S.optional(S.Number),
  columnMetadata: S.optional(Metadata),
}) {}
export class BatchExecuteStatementRequest extends S.Class<BatchExecuteStatementRequest>(
  "BatchExecuteStatementRequest",
)(
  {
    resourceArn: S.String,
    secretArn: S.String,
    sql: S.String,
    database: S.optional(S.String),
    schema: S.optional(S.String),
    parameterSets: S.optional(SqlParameterSets),
    transactionId: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/BatchExecute" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export type ArrayValueList = Value[];
export const ArrayValueList = S.Array(
  S.suspend(() => Value),
) as any as S.Schema<ArrayValueList>;
export class ExecuteStatementResponse extends S.Class<ExecuteStatementResponse>(
  "ExecuteStatementResponse",
)({
  records: S.optional(SqlRecords),
  columnMetadata: S.optional(Metadata),
  numberOfRecordsUpdated: S.optional(S.Number),
  generatedFields: S.optional(FieldList),
  formattedRecords: S.optional(S.String),
}) {}
export class StructValue extends S.Class<StructValue>("StructValue")({
  attributes: S.optional(S.suspend(() => ArrayValueList)),
}) {}
export type Value =
  | { isNull: boolean }
  | { bitValue: boolean }
  | { bigIntValue: number }
  | { intValue: number }
  | { doubleValue: number }
  | { realValue: number }
  | { stringValue: string }
  | { blobValue: Uint8Array }
  | { arrayValues: ArrayValueList }
  | { structValue: StructValue };
export const Value = S.Union(
  S.Struct({ isNull: S.Boolean }),
  S.Struct({ bitValue: S.Boolean }),
  S.Struct({ bigIntValue: S.Number }),
  S.Struct({ intValue: S.Number }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ realValue: S.Number }),
  S.Struct({ stringValue: S.String }),
  S.Struct({ blobValue: T.Blob }),
  S.Struct({ arrayValues: S.suspend(() => ArrayValueList) }),
  S.Struct({
    structValue: S.suspend((): S.Schema<StructValue, any> => StructValue),
  }),
) as any as S.Schema<Value>;
export const Row = S.Array(S.suspend(() => Value));
export class UpdateResult extends S.Class<UpdateResult>("UpdateResult")({
  generatedFields: S.optional(FieldList),
}) {}
export const UpdateResults = S.Array(UpdateResult);
export class Record extends S.Class<Record>("Record")({
  values: S.optional(Row),
}) {}
export const Records = S.Array(Record);
export class BatchExecuteStatementResponse extends S.Class<BatchExecuteStatementResponse>(
  "BatchExecuteStatementResponse",
)({ updateResults: S.optional(UpdateResults) }) {}
export class ResultFrame extends S.Class<ResultFrame>("ResultFrame")({
  resultSetMetadata: S.optional(ResultSetMetadata),
  records: S.optional(Records),
}) {}
export class SqlStatementResult extends S.Class<SqlStatementResult>(
  "SqlStatementResult",
)({
  resultFrame: S.optional(ResultFrame),
  numberOfRecordsUpdated: S.optional(S.Number),
}) {}
export const SqlStatementResults = S.Array(SqlStatementResult);
export class ExecuteSqlResponse extends S.Class<ExecuteSqlResponse>(
  "ExecuteSqlResponse",
)({ sqlStatementResults: S.optional(SqlStatementResults) }) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  {},
) {}
export class DatabaseErrorException extends S.TaggedError<DatabaseErrorException>()(
  "DatabaseErrorException",
  {},
) {}
export class DatabaseNotFoundException extends S.TaggedError<DatabaseNotFoundException>()(
  "DatabaseNotFoundException",
  {},
) {}
export class DatabaseUnavailableException extends S.TaggedError<DatabaseUnavailableException>()(
  "DatabaseUnavailableException",
  {},
) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  {},
) {}
export class HttpEndpointNotEnabledException extends S.TaggedError<HttpEndpointNotEnabledException>()(
  "HttpEndpointNotEnabledException",
  {},
) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {},
) {}
export class DatabaseResumingException extends S.TaggedError<DatabaseResumingException>()(
  "DatabaseResumingException",
  {},
) {}
export class InvalidResourceStateException extends S.TaggedError<InvalidResourceStateException>()(
  "InvalidResourceStateException",
  {},
) {}
export class InvalidSecretException extends S.TaggedError<InvalidSecretException>()(
  "InvalidSecretException",
  {},
) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  {},
) {}
export class SecretsErrorException extends S.TaggedError<SecretsErrorException>()(
  "SecretsErrorException",
  {},
) {}
export class ServiceUnavailableError extends S.TaggedError<ServiceUnavailableError>()(
  "ServiceUnavailableError",
  {},
) {}
export class StatementTimeoutException extends S.TaggedError<StatementTimeoutException>()(
  "StatementTimeoutException",
  {},
) {}
export class TransactionNotFoundException extends S.TaggedError<TransactionNotFoundException>()(
  "TransactionNotFoundException",
  {},
) {}
export class UnsupportedResultException extends S.TaggedError<UnsupportedResultException>()(
  "UnsupportedResultException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Performs a rollback of a transaction. Rolling back a transaction cancels its changes.
 */
export const rollbackTransaction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RollbackTransactionRequest,
  output: RollbackTransactionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    DatabaseErrorException,
    DatabaseNotFoundException,
    DatabaseUnavailableException,
    ForbiddenException,
    HttpEndpointNotEnabledException,
    InternalServerErrorException,
    InvalidResourceStateException,
    InvalidSecretException,
    NotFoundException,
    SecretsErrorException,
    ServiceUnavailableError,
    StatementTimeoutException,
    TransactionNotFoundException,
  ],
}));
/**
 * Runs a batch SQL statement over an array of data.
 *
 * You can run bulk update and insert operations for multiple records using a DML
 * statement with different parameter sets. Bulk operations can provide a significant
 * performance improvement over individual insert and update operations.
 *
 * If a call isn't part of a transaction because it doesn't include the `transactionID` parameter,
 * changes that result from the call are committed automatically.
 *
 * There isn't a fixed upper limit on the number of parameter sets. However, the maximum size of the HTTP request
 * submitted through the Data API is 4 MiB. If the request exceeds this limit, the Data API returns an error and doesn't
 * process the request. This 4-MiB limit includes the size of the HTTP headers and the JSON notation in the request. Thus, the
 * number of parameter sets that you can include depends on a combination of factors, such as the size of the SQL statement and
 * the size of each parameter set.
 *
 * The response size limit is 1 MiB. If the call returns more than 1 MiB of response data, the call is terminated.
 */
export const batchExecuteStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchExecuteStatementRequest,
    output: BatchExecuteStatementResponse,
    errors: [
      AccessDeniedException,
      BadRequestException,
      DatabaseErrorException,
      DatabaseNotFoundException,
      DatabaseResumingException,
      DatabaseUnavailableException,
      ForbiddenException,
      HttpEndpointNotEnabledException,
      InternalServerErrorException,
      InvalidResourceStateException,
      InvalidSecretException,
      SecretsErrorException,
      ServiceUnavailableError,
      StatementTimeoutException,
      TransactionNotFoundException,
    ],
  }),
);
/**
 * Starts a SQL transaction.
 *
 * A transaction can run for a maximum of 24 hours. A transaction is terminated and rolled back automatically after 24
 * hours.
 *
 * A transaction times out if no calls use its transaction ID in three minutes. If a transaction times out before it's
 * committed, it's rolled back automatically.
 *
 * For Aurora MySQL, DDL statements inside a transaction cause an implicit commit. We recommend that you run each MySQL DDL statement in a separate
 * `ExecuteStatement` call with `continueAfterTimeout` enabled.
 */
export const beginTransaction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BeginTransactionRequest,
  output: BeginTransactionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    DatabaseErrorException,
    DatabaseNotFoundException,
    DatabaseResumingException,
    DatabaseUnavailableException,
    ForbiddenException,
    HttpEndpointNotEnabledException,
    InternalServerErrorException,
    InvalidResourceStateException,
    InvalidSecretException,
    SecretsErrorException,
    ServiceUnavailableError,
    StatementTimeoutException,
    TransactionNotFoundException,
  ],
}));
/**
 * Ends a SQL transaction started with the `BeginTransaction` operation and
 * commits the changes.
 */
export const commitTransaction = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CommitTransactionRequest,
  output: CommitTransactionResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    DatabaseErrorException,
    DatabaseNotFoundException,
    DatabaseUnavailableException,
    ForbiddenException,
    HttpEndpointNotEnabledException,
    InternalServerErrorException,
    InvalidResourceStateException,
    InvalidSecretException,
    NotFoundException,
    SecretsErrorException,
    ServiceUnavailableError,
    StatementTimeoutException,
    TransactionNotFoundException,
  ],
}));
/**
 * Runs one or more SQL statements.
 *
 * This operation isn't supported for Aurora Serverless v2 and provisioned DB clusters.
 * For Aurora Serverless v1 DB clusters, the operation is deprecated.
 * Use the `BatchExecuteStatement` or `ExecuteStatement` operation.
 */
export const executeSql = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteSqlRequest,
  output: ExecuteSqlResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    ForbiddenException,
    InternalServerErrorException,
    ServiceUnavailableError,
  ],
}));
/**
 * Runs a SQL statement against a database.
 *
 * If a call isn't part of a transaction because it doesn't include the
 * `transactionID` parameter, changes that result from the call are
 * committed automatically.
 *
 * If the binary response data from the database is more than 1 MB, the call is terminated.
 */
export const executeStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteStatementRequest,
  output: ExecuteStatementResponse,
  errors: [
    AccessDeniedException,
    BadRequestException,
    DatabaseErrorException,
    DatabaseNotFoundException,
    DatabaseResumingException,
    DatabaseUnavailableException,
    ForbiddenException,
    HttpEndpointNotEnabledException,
    InternalServerErrorException,
    InvalidResourceStateException,
    InvalidSecretException,
    SecretsErrorException,
    ServiceUnavailableError,
    StatementTimeoutException,
    TransactionNotFoundException,
    UnsupportedResultException,
  ],
}));
