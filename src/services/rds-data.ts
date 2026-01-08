import { HttpClient } from "@effect/platform";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";
import * as S from "effect/Schema";
import * as Stream from "effect/Stream";
import * as API from "../client/api.ts";
import * as T from "../traits.ts";
import * as C from "../category.ts";
import type { Credentials } from "../credentials.ts";
import type { CommonErrors } from "../errors.ts";
import type { Region } from "../region.ts";
import { SensitiveString, SensitiveBlob } from "../sensitive.ts";
const svc = T.AwsApiService({
  sdkId: "RDS Data",
  serviceShapeName: "RdsDataService",
});
const auth = T.AwsAuthSigv4({ name: "rds-data" });
const ver = T.ServiceVersion("2018-08-01");
const proto = T.AwsProtocolsRestJson1();
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
              `https://rds-data-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://rds-data-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://rds-data.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://rds-data.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type SqlStatement = string;
export type DbName = string;
export type Id = string;
export type RecordsFormatType = string;
export type ParameterName = string;
export type TypeHint = string;
export type DecimalReturnType = string;
export type LongReturnType = string;
export type TransactionStatus = string;
export type BoxedLong = number;
export type BoxedDouble = number;
export type RecordsUpdated = number;
export type ErrorMessage = string;
export type FormattedSqlRecords = string;
export type Integer = number;
export type Long = number;
export type BoxedInteger = number;
export type BoxedFloat = number;

//# Schemas
export interface BeginTransactionRequest {
  resourceArn: string;
  secretArn: string;
  database?: string;
  schema?: string;
}
export const BeginTransactionRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    secretArn: S.String,
    database: S.optional(S.String),
    schema: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BeginTransaction" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BeginTransactionRequest",
}) as any as S.Schema<BeginTransactionRequest>;
export interface CommitTransactionRequest {
  resourceArn: string;
  secretArn: string;
  transactionId: string;
}
export const CommitTransactionRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    secretArn: S.String,
    transactionId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/CommitTransaction" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CommitTransactionRequest",
}) as any as S.Schema<CommitTransactionRequest>;
export interface ExecuteSqlRequest {
  dbClusterOrInstanceArn: string;
  awsSecretStoreArn: string;
  sqlStatements: string;
  database?: string;
  schema?: string;
}
export const ExecuteSqlRequest = S.suspend(() =>
  S.Struct({
    dbClusterOrInstanceArn: S.String,
    awsSecretStoreArn: S.String,
    sqlStatements: S.String,
    database: S.optional(S.String),
    schema: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/ExecuteSql" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExecuteSqlRequest",
}) as any as S.Schema<ExecuteSqlRequest>;
export interface RollbackTransactionRequest {
  resourceArn: string;
  secretArn: string;
  transactionId: string;
}
export const RollbackTransactionRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    secretArn: S.String,
    transactionId: S.String,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/RollbackTransaction" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RollbackTransactionRequest",
}) as any as S.Schema<RollbackTransactionRequest>;
export interface ResultSetOptions {
  decimalReturnType?: string;
  longReturnType?: string;
}
export const ResultSetOptions = S.suspend(() =>
  S.Struct({
    decimalReturnType: S.optional(S.String),
    longReturnType: S.optional(S.String),
  }),
).annotations({
  identifier: "ResultSetOptions",
}) as any as S.Schema<ResultSetOptions>;
export interface BeginTransactionResponse {
  transactionId?: string;
}
export const BeginTransactionResponse = S.suspend(() =>
  S.Struct({ transactionId: S.optional(S.String) }),
).annotations({
  identifier: "BeginTransactionResponse",
}) as any as S.Schema<BeginTransactionResponse>;
export interface CommitTransactionResponse {
  transactionStatus?: string;
}
export const CommitTransactionResponse = S.suspend(() =>
  S.Struct({ transactionStatus: S.optional(S.String) }),
).annotations({
  identifier: "CommitTransactionResponse",
}) as any as S.Schema<CommitTransactionResponse>;
export type BooleanArray = boolean[];
export const BooleanArray = S.Array(S.Boolean);
export type LongArray = number[];
export const LongArray = S.Array(S.Number);
export type DoubleArray = number[];
export const DoubleArray = S.Array(S.Number);
export type StringArray = string[];
export const StringArray = S.Array(S.String);
export type ArrayValue =
  | { booleanValues: BooleanArray }
  | { longValues: LongArray }
  | { doubleValues: DoubleArray }
  | { stringValues: StringArray }
  | { arrayValues: ArrayOfArray };
export const ArrayValue = S.Union(
  S.Struct({ booleanValues: BooleanArray }),
  S.Struct({ longValues: LongArray }),
  S.Struct({ doubleValues: DoubleArray }),
  S.Struct({ stringValues: StringArray }),
  S.Struct({
    arrayValues: S.suspend(() => ArrayOfArray).annotations({
      identifier: "ArrayOfArray",
    }),
  }),
) as any as S.Schema<ArrayValue>;
export type Field =
  | { isNull: boolean }
  | { booleanValue: boolean }
  | { longValue: number }
  | { doubleValue: number }
  | { stringValue: string }
  | { blobValue: Uint8Array }
  | { arrayValue: ArrayValue };
export const Field = S.Union(
  S.Struct({ isNull: S.Boolean }),
  S.Struct({ booleanValue: S.Boolean }),
  S.Struct({ longValue: S.Number }),
  S.Struct({ doubleValue: S.Number }),
  S.Struct({ stringValue: S.String }),
  S.Struct({ blobValue: T.Blob }),
  S.Struct({ arrayValue: ArrayValue }),
);
export interface SqlParameter {
  name?: string;
  value?: (typeof Field)["Type"];
  typeHint?: string;
}
export const SqlParameter = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    value: S.optional(Field),
    typeHint: S.optional(S.String),
  }),
).annotations({ identifier: "SqlParameter" }) as any as S.Schema<SqlParameter>;
export type SqlParametersList = SqlParameter[];
export const SqlParametersList = S.Array(SqlParameter);
export interface ExecuteStatementRequest {
  resourceArn: string;
  secretArn: string;
  sql: string;
  database?: string;
  schema?: string;
  parameters?: SqlParametersList;
  transactionId?: string;
  includeResultMetadata?: boolean;
  continueAfterTimeout?: boolean;
  resultSetOptions?: ResultSetOptions;
  formatRecordsAs?: string;
}
export const ExecuteStatementRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/Execute" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExecuteStatementRequest",
}) as any as S.Schema<ExecuteStatementRequest>;
export interface RollbackTransactionResponse {
  transactionStatus?: string;
}
export const RollbackTransactionResponse = S.suspend(() =>
  S.Struct({ transactionStatus: S.optional(S.String) }),
).annotations({
  identifier: "RollbackTransactionResponse",
}) as any as S.Schema<RollbackTransactionResponse>;
export type ArrayOfArray = ArrayValue[];
export const ArrayOfArray = S.Array(
  S.suspend(() => ArrayValue).annotations({ identifier: "ArrayValue" }),
) as any as S.Schema<ArrayOfArray>;
export type FieldList = (typeof Field)["Type"][];
export const FieldList = S.Array(Field);
export type SqlRecords = FieldList[];
export const SqlRecords = S.Array(FieldList);
export type SqlParameterSets = SqlParametersList[];
export const SqlParameterSets = S.Array(SqlParametersList);
export interface ColumnMetadata {
  name?: string;
  type?: number;
  typeName?: string;
  label?: string;
  schemaName?: string;
  tableName?: string;
  isAutoIncrement?: boolean;
  isSigned?: boolean;
  isCurrency?: boolean;
  isCaseSensitive?: boolean;
  nullable?: number;
  precision?: number;
  scale?: number;
  arrayBaseColumnType?: number;
}
export const ColumnMetadata = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ColumnMetadata",
}) as any as S.Schema<ColumnMetadata>;
export type Metadata = ColumnMetadata[];
export const Metadata = S.Array(ColumnMetadata);
export interface ResultSetMetadata {
  columnCount?: number;
  columnMetadata?: Metadata;
}
export const ResultSetMetadata = S.suspend(() =>
  S.Struct({
    columnCount: S.optional(S.Number),
    columnMetadata: S.optional(Metadata),
  }),
).annotations({
  identifier: "ResultSetMetadata",
}) as any as S.Schema<ResultSetMetadata>;
export interface BatchExecuteStatementRequest {
  resourceArn: string;
  secretArn: string;
  sql: string;
  database?: string;
  schema?: string;
  parameterSets?: SqlParameterSets;
  transactionId?: string;
}
export const BatchExecuteStatementRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String,
    secretArn: S.String,
    sql: S.String,
    database: S.optional(S.String),
    schema: S.optional(S.String),
    parameterSets: S.optional(SqlParameterSets),
    transactionId: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/BatchExecute" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchExecuteStatementRequest",
}) as any as S.Schema<BatchExecuteStatementRequest>;
export type ArrayValueList = Value[];
export const ArrayValueList = S.Array(
  S.suspend(() => Value).annotations({ identifier: "Value" }),
) as any as S.Schema<ArrayValueList>;
export interface ExecuteStatementResponse {
  records?: SqlRecords;
  columnMetadata?: Metadata;
  numberOfRecordsUpdated?: number;
  generatedFields?: FieldList;
  formattedRecords?: string;
}
export const ExecuteStatementResponse = S.suspend(() =>
  S.Struct({
    records: S.optional(SqlRecords),
    columnMetadata: S.optional(Metadata),
    numberOfRecordsUpdated: S.optional(S.Number),
    generatedFields: S.optional(FieldList),
    formattedRecords: S.optional(S.String),
  }),
).annotations({
  identifier: "ExecuteStatementResponse",
}) as any as S.Schema<ExecuteStatementResponse>;
export interface StructValue {
  attributes?: ArrayValueList;
}
export const StructValue = S.suspend(() =>
  S.Struct({
    attributes: S.optional(
      S.suspend(() => ArrayValueList).annotations({
        identifier: "ArrayValueList",
      }),
    ),
  }),
).annotations({ identifier: "StructValue" }) as any as S.Schema<StructValue>;
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
  S.Struct({
    arrayValues: S.suspend(() => ArrayValueList).annotations({
      identifier: "ArrayValueList",
    }),
  }),
  S.Struct({
    structValue: S.suspend(
      (): S.Schema<StructValue, any> => StructValue,
    ).annotations({ identifier: "StructValue" }),
  }),
) as any as S.Schema<Value>;
export type Row = Value[];
export const Row = S.Array(
  S.suspend(() => Value).annotations({ identifier: "Value" }),
);
export interface UpdateResult {
  generatedFields?: FieldList;
}
export const UpdateResult = S.suspend(() =>
  S.Struct({ generatedFields: S.optional(FieldList) }),
).annotations({ identifier: "UpdateResult" }) as any as S.Schema<UpdateResult>;
export type UpdateResults = UpdateResult[];
export const UpdateResults = S.Array(UpdateResult);
export interface Record {
  values?: Row;
}
export const Record = S.suspend(() =>
  S.Struct({ values: S.optional(Row) }),
).annotations({ identifier: "Record" }) as any as S.Schema<Record>;
export type Records = Record[];
export const Records = S.Array(Record);
export interface BatchExecuteStatementResponse {
  updateResults?: UpdateResults;
}
export const BatchExecuteStatementResponse = S.suspend(() =>
  S.Struct({ updateResults: S.optional(UpdateResults) }),
).annotations({
  identifier: "BatchExecuteStatementResponse",
}) as any as S.Schema<BatchExecuteStatementResponse>;
export interface ResultFrame {
  resultSetMetadata?: ResultSetMetadata;
  records?: Records;
}
export const ResultFrame = S.suspend(() =>
  S.Struct({
    resultSetMetadata: S.optional(ResultSetMetadata),
    records: S.optional(Records),
  }),
).annotations({ identifier: "ResultFrame" }) as any as S.Schema<ResultFrame>;
export interface SqlStatementResult {
  resultFrame?: ResultFrame;
  numberOfRecordsUpdated?: number;
}
export const SqlStatementResult = S.suspend(() =>
  S.Struct({
    resultFrame: S.optional(ResultFrame),
    numberOfRecordsUpdated: S.optional(S.Number),
  }),
).annotations({
  identifier: "SqlStatementResult",
}) as any as S.Schema<SqlStatementResult>;
export type SqlStatementResults = SqlStatementResult[];
export const SqlStatementResults = S.Array(SqlStatementResult);
export interface ExecuteSqlResponse {
  sqlStatementResults?: SqlStatementResults;
}
export const ExecuteSqlResponse = S.suspend(() =>
  S.Struct({ sqlStatementResults: S.optional(SqlStatementResults) }),
).annotations({
  identifier: "ExecuteSqlResponse",
}) as any as S.Schema<ExecuteSqlResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class BadRequestException extends S.TaggedError<BadRequestException>()(
  "BadRequestException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DatabaseErrorException extends S.TaggedError<DatabaseErrorException>()(
  "DatabaseErrorException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DatabaseNotFoundException extends S.TaggedError<DatabaseNotFoundException>()(
  "DatabaseNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class DatabaseUnavailableException extends S.TaggedError<DatabaseUnavailableException>()(
  "DatabaseUnavailableException",
  {},
).pipe(C.withTimeoutError) {}
export class DatabaseResumingException extends S.TaggedError<DatabaseResumingException>()(
  "DatabaseResumingException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ForbiddenException extends S.TaggedError<ForbiddenException>()(
  "ForbiddenException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerErrorException extends S.TaggedError<InternalServerErrorException>()(
  "InternalServerErrorException",
  {},
).pipe(C.withServerError) {}
export class ServiceUnavailableError extends S.TaggedError<ServiceUnavailableError>()(
  "ServiceUnavailableError",
  {},
).pipe(C.withServerError) {}
export class HttpEndpointNotEnabledException extends S.TaggedError<HttpEndpointNotEnabledException>()(
  "HttpEndpointNotEnabledException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidResourceStateException extends S.TaggedError<InvalidResourceStateException>()(
  "InvalidResourceStateException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class InvalidSecretException extends S.TaggedError<InvalidSecretException>()(
  "InvalidSecretException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class NotFoundException extends S.TaggedError<NotFoundException>()(
  "NotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class SecretsErrorException extends S.TaggedError<SecretsErrorException>()(
  "SecretsErrorException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class StatementTimeoutException extends S.TaggedError<StatementTimeoutException>()(
  "StatementTimeoutException",
  { message: S.optional(S.String), dbConnectionId: S.optional(S.Number) },
).pipe(C.withBadRequestError) {}
export class TransactionNotFoundException extends S.TaggedError<TransactionNotFoundException>()(
  "TransactionNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class UnsupportedResultException extends S.TaggedError<UnsupportedResultException>()(
  "UnsupportedResultException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Runs one or more SQL statements.
 *
 * This operation isn't supported for Aurora Serverless v2 and provisioned DB clusters.
 * For Aurora Serverless v1 DB clusters, the operation is deprecated.
 * Use the `BatchExecuteStatement` or `ExecuteStatement` operation.
 */
export const executeSql: (
  input: ExecuteSqlRequest,
) => Effect.Effect<
  ExecuteSqlResponse,
  | AccessDeniedException
  | BadRequestException
  | ForbiddenException
  | InternalServerErrorException
  | ServiceUnavailableError
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Performs a rollback of a transaction. Rolling back a transaction cancels its changes.
 */
export const rollbackTransaction: (
  input: RollbackTransactionRequest,
) => Effect.Effect<
  RollbackTransactionResponse,
  | AccessDeniedException
  | BadRequestException
  | DatabaseErrorException
  | DatabaseNotFoundException
  | DatabaseUnavailableException
  | ForbiddenException
  | HttpEndpointNotEnabledException
  | InternalServerErrorException
  | InvalidResourceStateException
  | InvalidSecretException
  | NotFoundException
  | SecretsErrorException
  | ServiceUnavailableError
  | StatementTimeoutException
  | TransactionNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchExecuteStatement: (
  input: BatchExecuteStatementRequest,
) => Effect.Effect<
  BatchExecuteStatementResponse,
  | AccessDeniedException
  | BadRequestException
  | DatabaseErrorException
  | DatabaseNotFoundException
  | DatabaseResumingException
  | DatabaseUnavailableException
  | ForbiddenException
  | HttpEndpointNotEnabledException
  | InternalServerErrorException
  | InvalidResourceStateException
  | InvalidSecretException
  | SecretsErrorException
  | ServiceUnavailableError
  | StatementTimeoutException
  | TransactionNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const beginTransaction: (
  input: BeginTransactionRequest,
) => Effect.Effect<
  BeginTransactionResponse,
  | AccessDeniedException
  | BadRequestException
  | DatabaseErrorException
  | DatabaseNotFoundException
  | DatabaseResumingException
  | DatabaseUnavailableException
  | ForbiddenException
  | HttpEndpointNotEnabledException
  | InternalServerErrorException
  | InvalidResourceStateException
  | InvalidSecretException
  | SecretsErrorException
  | ServiceUnavailableError
  | StatementTimeoutException
  | TransactionNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const commitTransaction: (
  input: CommitTransactionRequest,
) => Effect.Effect<
  CommitTransactionResponse,
  | AccessDeniedException
  | BadRequestException
  | DatabaseErrorException
  | DatabaseNotFoundException
  | DatabaseUnavailableException
  | ForbiddenException
  | HttpEndpointNotEnabledException
  | InternalServerErrorException
  | InvalidResourceStateException
  | InvalidSecretException
  | NotFoundException
  | SecretsErrorException
  | ServiceUnavailableError
  | StatementTimeoutException
  | TransactionNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Runs a SQL statement against a database.
 *
 * If a call isn't part of a transaction because it doesn't include the
 * `transactionID` parameter, changes that result from the call are
 * committed automatically.
 *
 * If the binary response data from the database is more than 1 MB, the call is terminated.
 */
export const executeStatement: (
  input: ExecuteStatementRequest,
) => Effect.Effect<
  ExecuteStatementResponse,
  | AccessDeniedException
  | BadRequestException
  | DatabaseErrorException
  | DatabaseNotFoundException
  | DatabaseResumingException
  | DatabaseUnavailableException
  | ForbiddenException
  | HttpEndpointNotEnabledException
  | InternalServerErrorException
  | InvalidResourceStateException
  | InvalidSecretException
  | SecretsErrorException
  | ServiceUnavailableError
  | StatementTimeoutException
  | TransactionNotFoundException
  | UnsupportedResultException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
