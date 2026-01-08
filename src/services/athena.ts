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
  sdkId: "Athena",
  serviceShapeName: "AmazonAthena",
});
const auth = T.AwsAuthSigv4({ name: "athena" });
const ver = T.ServiceVersion("2017-05-18");
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
              `https://athena-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://athena-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://athena.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://athena.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type NamedQueryId = string;
export type StatementName = string;
export type WorkGroupName = string;
export type QueryExecutionId = string;
export type CapacityReservationName = string;
export type TargetDpusInteger = number;
export type CatalogNameString = string;
export type DescriptionString = string;
export type NameString = string;
export type DatabaseString = string;
export type QueryString = string;
export type IdempotencyToken = string;
export type NotebookName = string;
export type ClientRequestToken = string;
export type SessionId = string;
export type WorkGroupDescriptionString = string;
export type NotebookId = string;
export type BoxedBoolean = boolean;
export type CalculationExecutionId = string;
export type Token = string;
export type MaxQueryResults = number;
export type AmazonResourceName = string;
export type Payload = string;
export type S3Uri = string;
export type MaxApplicationDPUSizesCount = number;
export type MaxCalculationsCount = number;
export type SessionManagerToken = string;
export type MaxCapacityReservationsCount = number;
export type MaxDatabasesCount = number;
export type MaxDataCatalogsCount = number;
export type MaxEngineVersionsCount = number;
export type MaxListExecutorsCount = number;
export type MaxNamedQueriesCount = number;
export type MaxNotebooksCount = number;
export type MaxSessionsCount = number;
export type MaxPreparedStatementsCount = number;
export type MaxQueryExecutionsCount = number;
export type ExpressionString = string;
export type MaxTableMetadataCount = number;
export type MaxTagsCount = number;
export type MaxWorkGroupsCount = number;
export type CodeBlock = string;
export type ExecutionParameter = string;
export type RoleArn = string;
export type SessionIdleTimeoutInMinutes = number;
export type TagKey = string;
export type NamedQueryDescriptionString = string;
export type TagValue = string;
export type KeyString = string;
export type ParametersMapValue = string;
export type BytesScannedCutoffValue = number;
export type ResultOutputLocation = string;
export type AwsAccountId = string;
export type CoordinatorDpuSize = number;
export type MaxConcurrentDpus = number;
export type DefaultExecutorDpuSize = number;
export type ErrorMessage = string;
export type AuthToken = string;
export type KmsKey = string;
export type IdentityCenterInstanceArn = string;
export type Age = number;
export type LogGroupName = string;
export type LogStreamNamePrefix = string;
export type S3OutputLocation = string;
export type ErrorCode = string;
export type CalculationResultType = string;
export type AllocatedDpusInteger = number;
export type TableTypeString = string;
export type IdentityCenterApplicationArn = string;
export type ExecutorId = string;
export type LogTypeKey = string;
export type LogTypeValue = string;
export type DpuCount = number;
export type TypeString = string;
export type CommentString = string;
export type ErrorCategory = number;
export type ErrorType = number;
export type datumString = string;

//# Schemas
export type NamedQueryIdList = string[];
export const NamedQueryIdList = S.Array(S.String);
export type PreparedStatementNameList = string[];
export const PreparedStatementNameList = S.Array(S.String);
export type QueryExecutionIdList = string[];
export const QueryExecutionIdList = S.Array(S.String);
export type DataCatalogType = "LAMBDA" | "GLUE" | "HIVE" | "FEDERATED";
export const DataCatalogType = S.Literal("LAMBDA", "GLUE", "HIVE", "FEDERATED");
export type QueryResultType = "DATA_MANIFEST" | "DATA_ROWS";
export const QueryResultType = S.Literal("DATA_MANIFEST", "DATA_ROWS");
export type NotebookType = "IPYNB";
export const NotebookType = S.Literal("IPYNB");
export type CalculationExecutionState =
  | "CREATING"
  | "CREATED"
  | "QUEUED"
  | "RUNNING"
  | "CANCELING"
  | "CANCELED"
  | "COMPLETED"
  | "FAILED";
export const CalculationExecutionState = S.Literal(
  "CREATING",
  "CREATED",
  "QUEUED",
  "RUNNING",
  "CANCELING",
  "CANCELED",
  "COMPLETED",
  "FAILED",
);
export type ExecutorState =
  | "CREATING"
  | "CREATED"
  | "REGISTERED"
  | "TERMINATING"
  | "TERMINATED"
  | "FAILED";
export const ExecutorState = S.Literal(
  "CREATING",
  "CREATED",
  "REGISTERED",
  "TERMINATING",
  "TERMINATED",
  "FAILED",
);
export type SessionState =
  | "CREATING"
  | "CREATED"
  | "IDLE"
  | "BUSY"
  | "TERMINATING"
  | "TERMINATED"
  | "DEGRADED"
  | "FAILED";
export const SessionState = S.Literal(
  "CREATING",
  "CREATED",
  "IDLE",
  "BUSY",
  "TERMINATING",
  "TERMINATED",
  "DEGRADED",
  "FAILED",
);
export type ExecutionParameters = string[];
export const ExecutionParameters = S.Array(S.String);
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type WorkGroupState = "ENABLED" | "DISABLED";
export const WorkGroupState = S.Literal("ENABLED", "DISABLED");
export interface BatchGetNamedQueryInput {
  NamedQueryIds: string[];
}
export const BatchGetNamedQueryInput = S.suspend(() =>
  S.Struct({ NamedQueryIds: NamedQueryIdList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetNamedQueryInput",
}) as any as S.Schema<BatchGetNamedQueryInput>;
export interface BatchGetPreparedStatementInput {
  PreparedStatementNames: string[];
  WorkGroup: string;
}
export const BatchGetPreparedStatementInput = S.suspend(() =>
  S.Struct({
    PreparedStatementNames: PreparedStatementNameList,
    WorkGroup: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetPreparedStatementInput",
}) as any as S.Schema<BatchGetPreparedStatementInput>;
export interface BatchGetQueryExecutionInput {
  QueryExecutionIds: string[];
}
export const BatchGetQueryExecutionInput = S.suspend(() =>
  S.Struct({ QueryExecutionIds: QueryExecutionIdList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetQueryExecutionInput",
}) as any as S.Schema<BatchGetQueryExecutionInput>;
export interface CancelCapacityReservationInput {
  Name: string;
}
export const CancelCapacityReservationInput = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelCapacityReservationInput",
}) as any as S.Schema<CancelCapacityReservationInput>;
export interface CancelCapacityReservationOutput {}
export const CancelCapacityReservationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelCapacityReservationOutput",
}) as any as S.Schema<CancelCapacityReservationOutput>;
export interface CreateNamedQueryInput {
  Name: string;
  Description?: string;
  Database: string;
  QueryString: string;
  ClientRequestToken?: string;
  WorkGroup?: string;
}
export const CreateNamedQueryInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Database: S.String,
    QueryString: S.String,
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    WorkGroup: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateNamedQueryInput",
}) as any as S.Schema<CreateNamedQueryInput>;
export interface CreateNotebookInput {
  WorkGroup: string;
  Name: string;
  ClientRequestToken?: string;
}
export const CreateNotebookInput = S.suspend(() =>
  S.Struct({
    WorkGroup: S.String,
    Name: S.String,
    ClientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateNotebookInput",
}) as any as S.Schema<CreateNotebookInput>;
export interface CreatePreparedStatementInput {
  StatementName: string;
  WorkGroup: string;
  QueryStatement: string;
  Description?: string;
}
export const CreatePreparedStatementInput = S.suspend(() =>
  S.Struct({
    StatementName: S.String,
    WorkGroup: S.String,
    QueryStatement: S.String,
    Description: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePreparedStatementInput",
}) as any as S.Schema<CreatePreparedStatementInput>;
export interface CreatePreparedStatementOutput {}
export const CreatePreparedStatementOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreatePreparedStatementOutput",
}) as any as S.Schema<CreatePreparedStatementOutput>;
export interface CreatePresignedNotebookUrlRequest {
  SessionId: string;
}
export const CreatePresignedNotebookUrlRequest = S.suspend(() =>
  S.Struct({ SessionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePresignedNotebookUrlRequest",
}) as any as S.Schema<CreatePresignedNotebookUrlRequest>;
export interface DeleteCapacityReservationInput {
  Name: string;
}
export const DeleteCapacityReservationInput = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCapacityReservationInput",
}) as any as S.Schema<DeleteCapacityReservationInput>;
export interface DeleteCapacityReservationOutput {}
export const DeleteCapacityReservationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteCapacityReservationOutput",
}) as any as S.Schema<DeleteCapacityReservationOutput>;
export interface DeleteDataCatalogInput {
  Name: string;
  DeleteCatalogOnly?: boolean;
}
export const DeleteDataCatalogInput = S.suspend(() =>
  S.Struct({ Name: S.String, DeleteCatalogOnly: S.optional(S.Boolean) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDataCatalogInput",
}) as any as S.Schema<DeleteDataCatalogInput>;
export interface DeleteNamedQueryInput {
  NamedQueryId: string;
}
export const DeleteNamedQueryInput = S.suspend(() =>
  S.Struct({ NamedQueryId: S.String.pipe(T.IdempotencyToken()) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteNamedQueryInput",
}) as any as S.Schema<DeleteNamedQueryInput>;
export interface DeleteNamedQueryOutput {}
export const DeleteNamedQueryOutput = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteNamedQueryOutput" },
) as any as S.Schema<DeleteNamedQueryOutput>;
export interface DeleteNotebookInput {
  NotebookId: string;
}
export const DeleteNotebookInput = S.suspend(() =>
  S.Struct({ NotebookId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteNotebookInput",
}) as any as S.Schema<DeleteNotebookInput>;
export interface DeleteNotebookOutput {}
export const DeleteNotebookOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteNotebookOutput",
}) as any as S.Schema<DeleteNotebookOutput>;
export interface DeletePreparedStatementInput {
  StatementName: string;
  WorkGroup: string;
}
export const DeletePreparedStatementInput = S.suspend(() =>
  S.Struct({ StatementName: S.String, WorkGroup: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePreparedStatementInput",
}) as any as S.Schema<DeletePreparedStatementInput>;
export interface DeletePreparedStatementOutput {}
export const DeletePreparedStatementOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePreparedStatementOutput",
}) as any as S.Schema<DeletePreparedStatementOutput>;
export interface DeleteWorkGroupInput {
  WorkGroup: string;
  RecursiveDeleteOption?: boolean;
}
export const DeleteWorkGroupInput = S.suspend(() =>
  S.Struct({
    WorkGroup: S.String,
    RecursiveDeleteOption: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteWorkGroupInput",
}) as any as S.Schema<DeleteWorkGroupInput>;
export interface DeleteWorkGroupOutput {}
export const DeleteWorkGroupOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteWorkGroupOutput",
}) as any as S.Schema<DeleteWorkGroupOutput>;
export interface ExportNotebookInput {
  NotebookId: string;
}
export const ExportNotebookInput = S.suspend(() =>
  S.Struct({ NotebookId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExportNotebookInput",
}) as any as S.Schema<ExportNotebookInput>;
export interface GetCalculationExecutionRequest {
  CalculationExecutionId: string;
}
export const GetCalculationExecutionRequest = S.suspend(() =>
  S.Struct({ CalculationExecutionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCalculationExecutionRequest",
}) as any as S.Schema<GetCalculationExecutionRequest>;
export interface GetCalculationExecutionCodeRequest {
  CalculationExecutionId: string;
}
export const GetCalculationExecutionCodeRequest = S.suspend(() =>
  S.Struct({ CalculationExecutionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCalculationExecutionCodeRequest",
}) as any as S.Schema<GetCalculationExecutionCodeRequest>;
export interface GetCalculationExecutionStatusRequest {
  CalculationExecutionId: string;
}
export const GetCalculationExecutionStatusRequest = S.suspend(() =>
  S.Struct({ CalculationExecutionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCalculationExecutionStatusRequest",
}) as any as S.Schema<GetCalculationExecutionStatusRequest>;
export interface GetCapacityAssignmentConfigurationInput {
  CapacityReservationName: string;
}
export const GetCapacityAssignmentConfigurationInput = S.suspend(() =>
  S.Struct({ CapacityReservationName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCapacityAssignmentConfigurationInput",
}) as any as S.Schema<GetCapacityAssignmentConfigurationInput>;
export interface GetCapacityReservationInput {
  Name: string;
}
export const GetCapacityReservationInput = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCapacityReservationInput",
}) as any as S.Schema<GetCapacityReservationInput>;
export interface GetDatabaseInput {
  CatalogName: string;
  DatabaseName: string;
  WorkGroup?: string;
}
export const GetDatabaseInput = S.suspend(() =>
  S.Struct({
    CatalogName: S.String,
    DatabaseName: S.String,
    WorkGroup: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDatabaseInput",
}) as any as S.Schema<GetDatabaseInput>;
export interface GetDataCatalogInput {
  Name: string;
  WorkGroup?: string;
}
export const GetDataCatalogInput = S.suspend(() =>
  S.Struct({ Name: S.String, WorkGroup: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDataCatalogInput",
}) as any as S.Schema<GetDataCatalogInput>;
export interface GetNamedQueryInput {
  NamedQueryId: string;
}
export const GetNamedQueryInput = S.suspend(() =>
  S.Struct({ NamedQueryId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetNamedQueryInput",
}) as any as S.Schema<GetNamedQueryInput>;
export interface GetNotebookMetadataInput {
  NotebookId: string;
}
export const GetNotebookMetadataInput = S.suspend(() =>
  S.Struct({ NotebookId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetNotebookMetadataInput",
}) as any as S.Schema<GetNotebookMetadataInput>;
export interface GetPreparedStatementInput {
  StatementName: string;
  WorkGroup: string;
}
export const GetPreparedStatementInput = S.suspend(() =>
  S.Struct({ StatementName: S.String, WorkGroup: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPreparedStatementInput",
}) as any as S.Schema<GetPreparedStatementInput>;
export interface GetQueryExecutionInput {
  QueryExecutionId: string;
}
export const GetQueryExecutionInput = S.suspend(() =>
  S.Struct({ QueryExecutionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetQueryExecutionInput",
}) as any as S.Schema<GetQueryExecutionInput>;
export interface GetQueryResultsInput {
  QueryExecutionId: string;
  NextToken?: string;
  MaxResults?: number;
  QueryResultType?: QueryResultType;
}
export const GetQueryResultsInput = S.suspend(() =>
  S.Struct({
    QueryExecutionId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    QueryResultType: S.optional(QueryResultType),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetQueryResultsInput",
}) as any as S.Schema<GetQueryResultsInput>;
export interface GetQueryRuntimeStatisticsInput {
  QueryExecutionId: string;
}
export const GetQueryRuntimeStatisticsInput = S.suspend(() =>
  S.Struct({ QueryExecutionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetQueryRuntimeStatisticsInput",
}) as any as S.Schema<GetQueryRuntimeStatisticsInput>;
export interface GetResourceDashboardRequest {
  ResourceARN: string;
}
export const GetResourceDashboardRequest = S.suspend(() =>
  S.Struct({ ResourceARN: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourceDashboardRequest",
}) as any as S.Schema<GetResourceDashboardRequest>;
export interface GetSessionRequest {
  SessionId: string;
}
export const GetSessionRequest = S.suspend(() =>
  S.Struct({ SessionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSessionRequest",
}) as any as S.Schema<GetSessionRequest>;
export interface GetSessionEndpointRequest {
  SessionId: string;
}
export const GetSessionEndpointRequest = S.suspend(() =>
  S.Struct({ SessionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSessionEndpointRequest",
}) as any as S.Schema<GetSessionEndpointRequest>;
export interface GetSessionStatusRequest {
  SessionId: string;
}
export const GetSessionStatusRequest = S.suspend(() =>
  S.Struct({ SessionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSessionStatusRequest",
}) as any as S.Schema<GetSessionStatusRequest>;
export interface GetTableMetadataInput {
  CatalogName: string;
  DatabaseName: string;
  TableName: string;
  WorkGroup?: string;
}
export const GetTableMetadataInput = S.suspend(() =>
  S.Struct({
    CatalogName: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    WorkGroup: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTableMetadataInput",
}) as any as S.Schema<GetTableMetadataInput>;
export interface GetWorkGroupInput {
  WorkGroup: string;
}
export const GetWorkGroupInput = S.suspend(() =>
  S.Struct({ WorkGroup: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetWorkGroupInput",
}) as any as S.Schema<GetWorkGroupInput>;
export interface ImportNotebookInput {
  WorkGroup: string;
  Name: string;
  Payload?: string;
  Type: NotebookType;
  NotebookS3LocationUri?: string;
  ClientRequestToken?: string;
}
export const ImportNotebookInput = S.suspend(() =>
  S.Struct({
    WorkGroup: S.String,
    Name: S.String,
    Payload: S.optional(S.String),
    Type: NotebookType,
    NotebookS3LocationUri: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportNotebookInput",
}) as any as S.Schema<ImportNotebookInput>;
export interface ListApplicationDPUSizesInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListApplicationDPUSizesInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListApplicationDPUSizesInput",
}) as any as S.Schema<ListApplicationDPUSizesInput>;
export interface ListCalculationExecutionsRequest {
  SessionId: string;
  StateFilter?: CalculationExecutionState;
  MaxResults?: number;
  NextToken?: string;
}
export const ListCalculationExecutionsRequest = S.suspend(() =>
  S.Struct({
    SessionId: S.String,
    StateFilter: S.optional(CalculationExecutionState),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCalculationExecutionsRequest",
}) as any as S.Schema<ListCalculationExecutionsRequest>;
export interface ListCapacityReservationsInput {
  NextToken?: string;
  MaxResults?: number;
}
export const ListCapacityReservationsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCapacityReservationsInput",
}) as any as S.Schema<ListCapacityReservationsInput>;
export interface ListDatabasesInput {
  CatalogName: string;
  NextToken?: string;
  MaxResults?: number;
  WorkGroup?: string;
}
export const ListDatabasesInput = S.suspend(() =>
  S.Struct({
    CatalogName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkGroup: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDatabasesInput",
}) as any as S.Schema<ListDatabasesInput>;
export interface ListDataCatalogsInput {
  NextToken?: string;
  MaxResults?: number;
  WorkGroup?: string;
}
export const ListDataCatalogsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkGroup: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDataCatalogsInput",
}) as any as S.Schema<ListDataCatalogsInput>;
export interface ListEngineVersionsInput {
  NextToken?: string;
  MaxResults?: number;
}
export const ListEngineVersionsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEngineVersionsInput",
}) as any as S.Schema<ListEngineVersionsInput>;
export interface ListExecutorsRequest {
  SessionId: string;
  ExecutorStateFilter?: ExecutorState;
  MaxResults?: number;
  NextToken?: string;
}
export const ListExecutorsRequest = S.suspend(() =>
  S.Struct({
    SessionId: S.String,
    ExecutorStateFilter: S.optional(ExecutorState),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListExecutorsRequest",
}) as any as S.Schema<ListExecutorsRequest>;
export interface ListNamedQueriesInput {
  NextToken?: string;
  MaxResults?: number;
  WorkGroup?: string;
}
export const ListNamedQueriesInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkGroup: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListNamedQueriesInput",
}) as any as S.Schema<ListNamedQueriesInput>;
export interface ListNotebookSessionsRequest {
  NotebookId: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListNotebookSessionsRequest = S.suspend(() =>
  S.Struct({
    NotebookId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListNotebookSessionsRequest",
}) as any as S.Schema<ListNotebookSessionsRequest>;
export interface ListPreparedStatementsInput {
  WorkGroup: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListPreparedStatementsInput = S.suspend(() =>
  S.Struct({
    WorkGroup: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListPreparedStatementsInput",
}) as any as S.Schema<ListPreparedStatementsInput>;
export interface ListQueryExecutionsInput {
  NextToken?: string;
  MaxResults?: number;
  WorkGroup?: string;
}
export const ListQueryExecutionsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkGroup: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListQueryExecutionsInput",
}) as any as S.Schema<ListQueryExecutionsInput>;
export interface ListSessionsRequest {
  WorkGroup: string;
  StateFilter?: SessionState;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSessionsRequest = S.suspend(() =>
  S.Struct({
    WorkGroup: S.String,
    StateFilter: S.optional(SessionState),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSessionsRequest",
}) as any as S.Schema<ListSessionsRequest>;
export interface ListTableMetadataInput {
  CatalogName: string;
  DatabaseName: string;
  Expression?: string;
  NextToken?: string;
  MaxResults?: number;
  WorkGroup?: string;
}
export const ListTableMetadataInput = S.suspend(() =>
  S.Struct({
    CatalogName: S.String,
    DatabaseName: S.String,
    Expression: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkGroup: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTableMetadataInput",
}) as any as S.Schema<ListTableMetadataInput>;
export interface ListTagsForResourceInput {
  ResourceARN: string;
  NextToken?: string;
  MaxResults?: number;
}
export const ListTagsForResourceInput = S.suspend(() =>
  S.Struct({
    ResourceARN: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface ListWorkGroupsInput {
  NextToken?: string;
  MaxResults?: number;
}
export const ListWorkGroupsInput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListWorkGroupsInput",
}) as any as S.Schema<ListWorkGroupsInput>;
export interface StopCalculationExecutionRequest {
  CalculationExecutionId: string;
}
export const StopCalculationExecutionRequest = S.suspend(() =>
  S.Struct({ CalculationExecutionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopCalculationExecutionRequest",
}) as any as S.Schema<StopCalculationExecutionRequest>;
export interface StopQueryExecutionInput {
  QueryExecutionId: string;
}
export const StopQueryExecutionInput = S.suspend(() =>
  S.Struct({ QueryExecutionId: S.String.pipe(T.IdempotencyToken()) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopQueryExecutionInput",
}) as any as S.Schema<StopQueryExecutionInput>;
export interface StopQueryExecutionOutput {}
export const StopQueryExecutionOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopQueryExecutionOutput",
}) as any as S.Schema<StopQueryExecutionOutput>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(Tag);
export interface TagResourceInput {
  ResourceARN: string;
  Tags: Tag[];
}
export const TagResourceInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, Tags: TagList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceOutput {}
export const TagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceOutput",
}) as any as S.Schema<TagResourceOutput>;
export interface TerminateSessionRequest {
  SessionId: string;
}
export const TerminateSessionRequest = S.suspend(() =>
  S.Struct({ SessionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TerminateSessionRequest",
}) as any as S.Schema<TerminateSessionRequest>;
export interface UntagResourceInput {
  ResourceARN: string;
  TagKeys: string[];
}
export const UntagResourceInput = S.suspend(() =>
  S.Struct({ ResourceARN: S.String, TagKeys: TagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceOutput {}
export const UntagResourceOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceOutput",
}) as any as S.Schema<UntagResourceOutput>;
export interface UpdateCapacityReservationInput {
  TargetDpus: number;
  Name: string;
}
export const UpdateCapacityReservationInput = S.suspend(() =>
  S.Struct({ TargetDpus: S.Number, Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCapacityReservationInput",
}) as any as S.Schema<UpdateCapacityReservationInput>;
export interface UpdateCapacityReservationOutput {}
export const UpdateCapacityReservationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCapacityReservationOutput",
}) as any as S.Schema<UpdateCapacityReservationOutput>;
export type ParametersMap = { [key: string]: string };
export const ParametersMap = S.Record({ key: S.String, value: S.String });
export interface UpdateDataCatalogInput {
  Name: string;
  Type: DataCatalogType;
  Description?: string;
  Parameters?: { [key: string]: string };
}
export const UpdateDataCatalogInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: DataCatalogType,
    Description: S.optional(S.String),
    Parameters: S.optional(ParametersMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDataCatalogInput",
}) as any as S.Schema<UpdateDataCatalogInput>;
export interface UpdateDataCatalogOutput {}
export const UpdateDataCatalogOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDataCatalogOutput",
}) as any as S.Schema<UpdateDataCatalogOutput>;
export interface UpdateNamedQueryInput {
  NamedQueryId: string;
  Name: string;
  Description?: string;
  QueryString: string;
}
export const UpdateNamedQueryInput = S.suspend(() =>
  S.Struct({
    NamedQueryId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    QueryString: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateNamedQueryInput",
}) as any as S.Schema<UpdateNamedQueryInput>;
export interface UpdateNamedQueryOutput {}
export const UpdateNamedQueryOutput = S.suspend(() => S.Struct({})).annotations(
  { identifier: "UpdateNamedQueryOutput" },
) as any as S.Schema<UpdateNamedQueryOutput>;
export interface UpdateNotebookInput {
  NotebookId: string;
  Payload: string;
  Type: NotebookType;
  SessionId?: string;
  ClientRequestToken?: string;
}
export const UpdateNotebookInput = S.suspend(() =>
  S.Struct({
    NotebookId: S.String,
    Payload: S.String,
    Type: NotebookType,
    SessionId: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateNotebookInput",
}) as any as S.Schema<UpdateNotebookInput>;
export interface UpdateNotebookOutput {}
export const UpdateNotebookOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateNotebookOutput",
}) as any as S.Schema<UpdateNotebookOutput>;
export interface UpdateNotebookMetadataInput {
  NotebookId: string;
  ClientRequestToken?: string;
  Name: string;
}
export const UpdateNotebookMetadataInput = S.suspend(() =>
  S.Struct({
    NotebookId: S.String,
    ClientRequestToken: S.optional(S.String),
    Name: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateNotebookMetadataInput",
}) as any as S.Schema<UpdateNotebookMetadataInput>;
export interface UpdateNotebookMetadataOutput {}
export const UpdateNotebookMetadataOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateNotebookMetadataOutput",
}) as any as S.Schema<UpdateNotebookMetadataOutput>;
export interface UpdatePreparedStatementInput {
  StatementName: string;
  WorkGroup: string;
  QueryStatement: string;
  Description?: string;
}
export const UpdatePreparedStatementInput = S.suspend(() =>
  S.Struct({
    StatementName: S.String,
    WorkGroup: S.String,
    QueryStatement: S.String,
    Description: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePreparedStatementInput",
}) as any as S.Schema<UpdatePreparedStatementInput>;
export interface UpdatePreparedStatementOutput {}
export const UpdatePreparedStatementOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdatePreparedStatementOutput",
}) as any as S.Schema<UpdatePreparedStatementOutput>;
export type WorkGroupNamesList = string[];
export const WorkGroupNamesList = S.Array(S.String);
export type CapacityReservationStatus =
  | "PENDING"
  | "ACTIVE"
  | "CANCELLING"
  | "CANCELLED"
  | "FAILED"
  | "UPDATE_PENDING";
export const CapacityReservationStatus = S.Literal(
  "PENDING",
  "ACTIVE",
  "CANCELLING",
  "CANCELLED",
  "FAILED",
  "UPDATE_PENDING",
);
export type CapacityAllocationStatus = "PENDING" | "SUCCEEDED" | "FAILED";
export const CapacityAllocationStatus = S.Literal(
  "PENDING",
  "SUCCEEDED",
  "FAILED",
);
export interface CapacityAllocation {
  Status: CapacityAllocationStatus;
  StatusMessage?: string;
  RequestTime: Date;
  RequestCompletionTime?: Date;
}
export const CapacityAllocation = S.suspend(() =>
  S.Struct({
    Status: CapacityAllocationStatus,
    StatusMessage: S.optional(S.String),
    RequestTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    RequestCompletionTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CapacityAllocation",
}) as any as S.Schema<CapacityAllocation>;
export interface CapacityReservation {
  Name: string;
  Status: CapacityReservationStatus;
  TargetDpus: number;
  AllocatedDpus: number;
  LastAllocation?: CapacityAllocation;
  LastSuccessfulAllocationTime?: Date;
  CreationTime: Date;
}
export const CapacityReservation = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Status: CapacityReservationStatus,
    TargetDpus: S.Number,
    AllocatedDpus: S.Number,
    LastAllocation: S.optional(CapacityAllocation),
    LastSuccessfulAllocationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "CapacityReservation",
}) as any as S.Schema<CapacityReservation>;
export type CapacityReservationsList = CapacityReservation[];
export const CapacityReservationsList = S.Array(CapacityReservation);
export interface Database {
  Name: string;
  Description?: string;
  Parameters?: { [key: string]: string };
}
export const Database = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Parameters: S.optional(ParametersMap),
  }),
).annotations({ identifier: "Database" }) as any as S.Schema<Database>;
export type DatabaseList = Database[];
export const DatabaseList = S.Array(Database);
export interface EngineVersion {
  SelectedEngineVersion?: string;
  EffectiveEngineVersion?: string;
}
export const EngineVersion = S.suspend(() =>
  S.Struct({
    SelectedEngineVersion: S.optional(S.String),
    EffectiveEngineVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "EngineVersion",
}) as any as S.Schema<EngineVersion>;
export type EngineVersionsList = EngineVersion[];
export const EngineVersionsList = S.Array(EngineVersion);
export interface FilterDefinition {
  Name?: string;
}
export const FilterDefinition = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "FilterDefinition",
}) as any as S.Schema<FilterDefinition>;
export interface Column {
  Name: string;
  Type?: string;
  Comment?: string;
}
export const Column = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: S.optional(S.String),
    Comment: S.optional(S.String),
  }),
).annotations({ identifier: "Column" }) as any as S.Schema<Column>;
export type ColumnList = Column[];
export const ColumnList = S.Array(Column);
export interface TableMetadata {
  Name: string;
  CreateTime?: Date;
  LastAccessTime?: Date;
  TableType?: string;
  Columns?: Column[];
  PartitionKeys?: Column[];
  Parameters?: { [key: string]: string };
}
export const TableMetadata = S.suspend(() =>
  S.Struct({
    Name: S.String,
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastAccessTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TableType: S.optional(S.String),
    Columns: S.optional(ColumnList),
    PartitionKeys: S.optional(ColumnList),
    Parameters: S.optional(ParametersMap),
  }),
).annotations({
  identifier: "TableMetadata",
}) as any as S.Schema<TableMetadata>;
export type TableMetadataList = TableMetadata[];
export const TableMetadataList = S.Array(TableMetadata);
export interface CapacityAssignment {
  WorkGroupNames?: string[];
}
export const CapacityAssignment = S.suspend(() =>
  S.Struct({ WorkGroupNames: S.optional(WorkGroupNamesList) }),
).annotations({
  identifier: "CapacityAssignment",
}) as any as S.Schema<CapacityAssignment>;
export type CapacityAssignmentsList = CapacityAssignment[];
export const CapacityAssignmentsList = S.Array(CapacityAssignment);
export interface CalculationConfiguration {
  CodeBlock?: string;
}
export const CalculationConfiguration = S.suspend(() =>
  S.Struct({ CodeBlock: S.optional(S.String) }),
).annotations({
  identifier: "CalculationConfiguration",
}) as any as S.Schema<CalculationConfiguration>;
export interface QueryExecutionContext {
  Database?: string;
  Catalog?: string;
}
export const QueryExecutionContext = S.suspend(() =>
  S.Struct({ Database: S.optional(S.String), Catalog: S.optional(S.String) }),
).annotations({
  identifier: "QueryExecutionContext",
}) as any as S.Schema<QueryExecutionContext>;
export type AuthenticationType = "DIRECTORY_IDENTITY";
export const AuthenticationType = S.Literal("DIRECTORY_IDENTITY");
export type EncryptionOption = "SSE_S3" | "SSE_KMS" | "CSE_KMS";
export const EncryptionOption = S.Literal("SSE_S3", "SSE_KMS", "CSE_KMS");
export type S3AclOption = "BUCKET_OWNER_FULL_CONTROL";
export const S3AclOption = S.Literal("BUCKET_OWNER_FULL_CONTROL");
export interface CreateCapacityReservationInput {
  TargetDpus: number;
  Name: string;
  Tags?: Tag[];
}
export const CreateCapacityReservationInput = S.suspend(() =>
  S.Struct({
    TargetDpus: S.Number,
    Name: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCapacityReservationInput",
}) as any as S.Schema<CreateCapacityReservationInput>;
export interface CreateCapacityReservationOutput {}
export const CreateCapacityReservationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateCapacityReservationOutput",
}) as any as S.Schema<CreateCapacityReservationOutput>;
export interface CreateDataCatalogInput {
  Name: string;
  Type: DataCatalogType;
  Description?: string;
  Parameters?: { [key: string]: string };
  Tags?: Tag[];
}
export const CreateDataCatalogInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: DataCatalogType,
    Description: S.optional(S.String),
    Parameters: S.optional(ParametersMap),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDataCatalogInput",
}) as any as S.Schema<CreateDataCatalogInput>;
export interface CreateNamedQueryOutput {
  NamedQueryId?: string;
}
export const CreateNamedQueryOutput = S.suspend(() =>
  S.Struct({ NamedQueryId: S.optional(S.String) }),
).annotations({
  identifier: "CreateNamedQueryOutput",
}) as any as S.Schema<CreateNamedQueryOutput>;
export interface CreateNotebookOutput {
  NotebookId?: string;
}
export const CreateNotebookOutput = S.suspend(() =>
  S.Struct({ NotebookId: S.optional(S.String) }),
).annotations({
  identifier: "CreateNotebookOutput",
}) as any as S.Schema<CreateNotebookOutput>;
export interface CreatePresignedNotebookUrlResponse {
  NotebookUrl: string;
  AuthToken: string;
  AuthTokenExpirationTime: number;
}
export const CreatePresignedNotebookUrlResponse = S.suspend(() =>
  S.Struct({
    NotebookUrl: S.String,
    AuthToken: S.String,
    AuthTokenExpirationTime: S.Number,
  }),
).annotations({
  identifier: "CreatePresignedNotebookUrlResponse",
}) as any as S.Schema<CreatePresignedNotebookUrlResponse>;
export interface GetCalculationExecutionCodeResponse {
  CodeBlock?: string;
}
export const GetCalculationExecutionCodeResponse = S.suspend(() =>
  S.Struct({ CodeBlock: S.optional(S.String) }),
).annotations({
  identifier: "GetCalculationExecutionCodeResponse",
}) as any as S.Schema<GetCalculationExecutionCodeResponse>;
export interface CalculationStatus {
  SubmissionDateTime?: Date;
  CompletionDateTime?: Date;
  State?: CalculationExecutionState;
  StateChangeReason?: string;
}
export const CalculationStatus = S.suspend(() =>
  S.Struct({
    SubmissionDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CompletionDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    State: S.optional(CalculationExecutionState),
    StateChangeReason: S.optional(S.String),
  }),
).annotations({
  identifier: "CalculationStatus",
}) as any as S.Schema<CalculationStatus>;
export interface CalculationStatistics {
  DpuExecutionInMillis?: number;
  Progress?: string;
}
export const CalculationStatistics = S.suspend(() =>
  S.Struct({
    DpuExecutionInMillis: S.optional(S.Number),
    Progress: S.optional(S.String),
  }),
).annotations({
  identifier: "CalculationStatistics",
}) as any as S.Schema<CalculationStatistics>;
export interface GetCalculationExecutionStatusResponse {
  Status?: CalculationStatus;
  Statistics?: CalculationStatistics;
}
export const GetCalculationExecutionStatusResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(CalculationStatus),
    Statistics: S.optional(CalculationStatistics),
  }),
).annotations({
  identifier: "GetCalculationExecutionStatusResponse",
}) as any as S.Schema<GetCalculationExecutionStatusResponse>;
export type DataCatalogStatus =
  | "CREATE_IN_PROGRESS"
  | "CREATE_COMPLETE"
  | "CREATE_FAILED"
  | "CREATE_FAILED_CLEANUP_IN_PROGRESS"
  | "CREATE_FAILED_CLEANUP_COMPLETE"
  | "CREATE_FAILED_CLEANUP_FAILED"
  | "DELETE_IN_PROGRESS"
  | "DELETE_COMPLETE"
  | "DELETE_FAILED";
export const DataCatalogStatus = S.Literal(
  "CREATE_IN_PROGRESS",
  "CREATE_COMPLETE",
  "CREATE_FAILED",
  "CREATE_FAILED_CLEANUP_IN_PROGRESS",
  "CREATE_FAILED_CLEANUP_COMPLETE",
  "CREATE_FAILED_CLEANUP_FAILED",
  "DELETE_IN_PROGRESS",
  "DELETE_COMPLETE",
  "DELETE_FAILED",
);
export type ConnectionType =
  | "DYNAMODB"
  | "MYSQL"
  | "POSTGRESQL"
  | "REDSHIFT"
  | "ORACLE"
  | "SYNAPSE"
  | "SQLSERVER"
  | "DB2"
  | "OPENSEARCH"
  | "BIGQUERY"
  | "GOOGLECLOUDSTORAGE"
  | "HBASE"
  | "DOCUMENTDB"
  | "CMDB"
  | "TPCDS"
  | "TIMESTREAM"
  | "SAPHANA"
  | "SNOWFLAKE"
  | "DATALAKEGEN2"
  | "DB2AS400";
export const ConnectionType = S.Literal(
  "DYNAMODB",
  "MYSQL",
  "POSTGRESQL",
  "REDSHIFT",
  "ORACLE",
  "SYNAPSE",
  "SQLSERVER",
  "DB2",
  "OPENSEARCH",
  "BIGQUERY",
  "GOOGLECLOUDSTORAGE",
  "HBASE",
  "DOCUMENTDB",
  "CMDB",
  "TPCDS",
  "TIMESTREAM",
  "SAPHANA",
  "SNOWFLAKE",
  "DATALAKEGEN2",
  "DB2AS400",
);
export interface DataCatalog {
  Name: string;
  Description?: string;
  Type: DataCatalogType;
  Parameters?: { [key: string]: string };
  Status?: DataCatalogStatus;
  ConnectionType?: ConnectionType;
  Error?: string;
}
export const DataCatalog = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Type: DataCatalogType,
    Parameters: S.optional(ParametersMap),
    Status: S.optional(DataCatalogStatus),
    ConnectionType: S.optional(ConnectionType),
    Error: S.optional(S.String),
  }),
).annotations({ identifier: "DataCatalog" }) as any as S.Schema<DataCatalog>;
export interface GetDataCatalogOutput {
  DataCatalog?: DataCatalog;
}
export const GetDataCatalogOutput = S.suspend(() =>
  S.Struct({ DataCatalog: S.optional(DataCatalog) }),
).annotations({
  identifier: "GetDataCatalogOutput",
}) as any as S.Schema<GetDataCatalogOutput>;
export interface NamedQuery {
  Name: string;
  Description?: string;
  Database: string;
  QueryString: string;
  NamedQueryId?: string;
  WorkGroup?: string;
}
export const NamedQuery = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Database: S.String,
    QueryString: S.String,
    NamedQueryId: S.optional(S.String),
    WorkGroup: S.optional(S.String),
  }),
).annotations({ identifier: "NamedQuery" }) as any as S.Schema<NamedQuery>;
export interface GetNamedQueryOutput {
  NamedQuery?: NamedQuery;
}
export const GetNamedQueryOutput = S.suspend(() =>
  S.Struct({ NamedQuery: S.optional(NamedQuery) }),
).annotations({
  identifier: "GetNamedQueryOutput",
}) as any as S.Schema<GetNamedQueryOutput>;
export interface NotebookMetadata {
  NotebookId?: string;
  Name?: string;
  WorkGroup?: string;
  CreationTime?: Date;
  Type?: NotebookType;
  LastModifiedTime?: Date;
}
export const NotebookMetadata = S.suspend(() =>
  S.Struct({
    NotebookId: S.optional(S.String),
    Name: S.optional(S.String),
    WorkGroup: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Type: S.optional(NotebookType),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "NotebookMetadata",
}) as any as S.Schema<NotebookMetadata>;
export interface GetNotebookMetadataOutput {
  NotebookMetadata?: NotebookMetadata;
}
export const GetNotebookMetadataOutput = S.suspend(() =>
  S.Struct({ NotebookMetadata: S.optional(NotebookMetadata) }),
).annotations({
  identifier: "GetNotebookMetadataOutput",
}) as any as S.Schema<GetNotebookMetadataOutput>;
export interface PreparedStatement {
  StatementName?: string;
  QueryStatement?: string;
  WorkGroupName?: string;
  Description?: string;
  LastModifiedTime?: Date;
}
export const PreparedStatement = S.suspend(() =>
  S.Struct({
    StatementName: S.optional(S.String),
    QueryStatement: S.optional(S.String),
    WorkGroupName: S.optional(S.String),
    Description: S.optional(S.String),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PreparedStatement",
}) as any as S.Schema<PreparedStatement>;
export interface GetPreparedStatementOutput {
  PreparedStatement?: PreparedStatement;
}
export const GetPreparedStatementOutput = S.suspend(() =>
  S.Struct({ PreparedStatement: S.optional(PreparedStatement) }),
).annotations({
  identifier: "GetPreparedStatementOutput",
}) as any as S.Schema<GetPreparedStatementOutput>;
export type StatementType = "DDL" | "DML" | "UTILITY";
export const StatementType = S.Literal("DDL", "DML", "UTILITY");
export interface ManagedQueryResultsEncryptionConfiguration {
  KmsKey: string;
}
export const ManagedQueryResultsEncryptionConfiguration = S.suspend(() =>
  S.Struct({ KmsKey: S.String }),
).annotations({
  identifier: "ManagedQueryResultsEncryptionConfiguration",
}) as any as S.Schema<ManagedQueryResultsEncryptionConfiguration>;
export interface ManagedQueryResultsConfiguration {
  Enabled: boolean;
  EncryptionConfiguration?: ManagedQueryResultsEncryptionConfiguration;
}
export const ManagedQueryResultsConfiguration = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    EncryptionConfiguration: S.optional(
      ManagedQueryResultsEncryptionConfiguration,
    ),
  }),
).annotations({
  identifier: "ManagedQueryResultsConfiguration",
}) as any as S.Schema<ManagedQueryResultsConfiguration>;
export interface EncryptionConfiguration {
  EncryptionOption: EncryptionOption;
  KmsKey?: string;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({
    EncryptionOption: EncryptionOption,
    KmsKey: S.optional(S.String),
  }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export interface AclConfiguration {
  S3AclOption: S3AclOption;
}
export const AclConfiguration = S.suspend(() =>
  S.Struct({ S3AclOption: S3AclOption }),
).annotations({
  identifier: "AclConfiguration",
}) as any as S.Schema<AclConfiguration>;
export interface ResultConfiguration {
  OutputLocation?: string;
  EncryptionConfiguration?: EncryptionConfiguration;
  ExpectedBucketOwner?: string;
  AclConfiguration?: AclConfiguration;
}
export const ResultConfiguration = S.suspend(() =>
  S.Struct({
    OutputLocation: S.optional(S.String),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    ExpectedBucketOwner: S.optional(S.String),
    AclConfiguration: S.optional(AclConfiguration),
  }),
).annotations({
  identifier: "ResultConfiguration",
}) as any as S.Schema<ResultConfiguration>;
export interface ResultReuseByAgeConfiguration {
  Enabled: boolean;
  MaxAgeInMinutes?: number;
}
export const ResultReuseByAgeConfiguration = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean, MaxAgeInMinutes: S.optional(S.Number) }),
).annotations({
  identifier: "ResultReuseByAgeConfiguration",
}) as any as S.Schema<ResultReuseByAgeConfiguration>;
export interface ResultReuseConfiguration {
  ResultReuseByAgeConfiguration?: ResultReuseByAgeConfiguration;
}
export const ResultReuseConfiguration = S.suspend(() =>
  S.Struct({
    ResultReuseByAgeConfiguration: S.optional(ResultReuseByAgeConfiguration),
  }),
).annotations({
  identifier: "ResultReuseConfiguration",
}) as any as S.Schema<ResultReuseConfiguration>;
export type QueryExecutionState =
  | "QUEUED"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED";
export const QueryExecutionState = S.Literal(
  "QUEUED",
  "RUNNING",
  "SUCCEEDED",
  "FAILED",
  "CANCELLED",
);
export interface AthenaError {
  ErrorCategory?: number;
  ErrorType?: number;
  Retryable?: boolean;
  ErrorMessage?: string;
}
export const AthenaError = S.suspend(() =>
  S.Struct({
    ErrorCategory: S.optional(S.Number),
    ErrorType: S.optional(S.Number),
    Retryable: S.optional(S.Boolean),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "AthenaError" }) as any as S.Schema<AthenaError>;
export interface QueryExecutionStatus {
  State?: QueryExecutionState;
  StateChangeReason?: string;
  SubmissionDateTime?: Date;
  CompletionDateTime?: Date;
  AthenaError?: AthenaError;
}
export const QueryExecutionStatus = S.suspend(() =>
  S.Struct({
    State: S.optional(QueryExecutionState),
    StateChangeReason: S.optional(S.String),
    SubmissionDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CompletionDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AthenaError: S.optional(AthenaError),
  }),
).annotations({
  identifier: "QueryExecutionStatus",
}) as any as S.Schema<QueryExecutionStatus>;
export interface ResultReuseInformation {
  ReusedPreviousResult: boolean;
}
export const ResultReuseInformation = S.suspend(() =>
  S.Struct({ ReusedPreviousResult: S.Boolean }),
).annotations({
  identifier: "ResultReuseInformation",
}) as any as S.Schema<ResultReuseInformation>;
export interface QueryExecutionStatistics {
  EngineExecutionTimeInMillis?: number;
  DataScannedInBytes?: number;
  DataManifestLocation?: string;
  TotalExecutionTimeInMillis?: number;
  QueryQueueTimeInMillis?: number;
  ServicePreProcessingTimeInMillis?: number;
  QueryPlanningTimeInMillis?: number;
  ServiceProcessingTimeInMillis?: number;
  ResultReuseInformation?: ResultReuseInformation;
  DpuCount?: number;
}
export const QueryExecutionStatistics = S.suspend(() =>
  S.Struct({
    EngineExecutionTimeInMillis: S.optional(S.Number),
    DataScannedInBytes: S.optional(S.Number),
    DataManifestLocation: S.optional(S.String),
    TotalExecutionTimeInMillis: S.optional(S.Number),
    QueryQueueTimeInMillis: S.optional(S.Number),
    ServicePreProcessingTimeInMillis: S.optional(S.Number),
    QueryPlanningTimeInMillis: S.optional(S.Number),
    ServiceProcessingTimeInMillis: S.optional(S.Number),
    ResultReuseInformation: S.optional(ResultReuseInformation),
    DpuCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "QueryExecutionStatistics",
}) as any as S.Schema<QueryExecutionStatistics>;
export interface QueryResultsS3AccessGrantsConfiguration {
  EnableS3AccessGrants: boolean;
  CreateUserLevelPrefix?: boolean;
  AuthenticationType: AuthenticationType;
}
export const QueryResultsS3AccessGrantsConfiguration = S.suspend(() =>
  S.Struct({
    EnableS3AccessGrants: S.Boolean,
    CreateUserLevelPrefix: S.optional(S.Boolean),
    AuthenticationType: AuthenticationType,
  }),
).annotations({
  identifier: "QueryResultsS3AccessGrantsConfiguration",
}) as any as S.Schema<QueryResultsS3AccessGrantsConfiguration>;
export interface QueryExecution {
  QueryExecutionId?: string;
  Query?: string;
  StatementType?: StatementType;
  ManagedQueryResultsConfiguration?: ManagedQueryResultsConfiguration;
  ResultConfiguration?: ResultConfiguration;
  ResultReuseConfiguration?: ResultReuseConfiguration;
  QueryExecutionContext?: QueryExecutionContext;
  Status?: QueryExecutionStatus;
  Statistics?: QueryExecutionStatistics;
  WorkGroup?: string;
  EngineVersion?: EngineVersion;
  ExecutionParameters?: string[];
  SubstatementType?: string;
  QueryResultsS3AccessGrantsConfiguration?: QueryResultsS3AccessGrantsConfiguration;
}
export const QueryExecution = S.suspend(() =>
  S.Struct({
    QueryExecutionId: S.optional(S.String),
    Query: S.optional(S.String),
    StatementType: S.optional(StatementType),
    ManagedQueryResultsConfiguration: S.optional(
      ManagedQueryResultsConfiguration,
    ),
    ResultConfiguration: S.optional(ResultConfiguration),
    ResultReuseConfiguration: S.optional(ResultReuseConfiguration),
    QueryExecutionContext: S.optional(QueryExecutionContext),
    Status: S.optional(QueryExecutionStatus),
    Statistics: S.optional(QueryExecutionStatistics),
    WorkGroup: S.optional(S.String),
    EngineVersion: S.optional(EngineVersion),
    ExecutionParameters: S.optional(ExecutionParameters),
    SubstatementType: S.optional(S.String),
    QueryResultsS3AccessGrantsConfiguration: S.optional(
      QueryResultsS3AccessGrantsConfiguration,
    ),
  }),
).annotations({
  identifier: "QueryExecution",
}) as any as S.Schema<QueryExecution>;
export interface GetQueryExecutionOutput {
  QueryExecution?: QueryExecution;
}
export const GetQueryExecutionOutput = S.suspend(() =>
  S.Struct({ QueryExecution: S.optional(QueryExecution) }),
).annotations({
  identifier: "GetQueryExecutionOutput",
}) as any as S.Schema<GetQueryExecutionOutput>;
export interface GetResourceDashboardResponse {
  Url: string;
}
export const GetResourceDashboardResponse = S.suspend(() =>
  S.Struct({ Url: S.String }),
).annotations({
  identifier: "GetResourceDashboardResponse",
}) as any as S.Schema<GetResourceDashboardResponse>;
export interface GetSessionEndpointResponse {
  EndpointUrl: string;
  AuthToken: string;
  AuthTokenExpirationTime: Date;
}
export const GetSessionEndpointResponse = S.suspend(() =>
  S.Struct({
    EndpointUrl: S.String,
    AuthToken: S.String,
    AuthTokenExpirationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({
  identifier: "GetSessionEndpointResponse",
}) as any as S.Schema<GetSessionEndpointResponse>;
export interface SessionStatus {
  StartDateTime?: Date;
  LastModifiedDateTime?: Date;
  EndDateTime?: Date;
  IdleSinceDateTime?: Date;
  State?: SessionState;
  StateChangeReason?: string;
}
export const SessionStatus = S.suspend(() =>
  S.Struct({
    StartDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    IdleSinceDateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    State: S.optional(SessionState),
    StateChangeReason: S.optional(S.String),
  }),
).annotations({
  identifier: "SessionStatus",
}) as any as S.Schema<SessionStatus>;
export interface GetSessionStatusResponse {
  SessionId?: string;
  Status?: SessionStatus;
}
export const GetSessionStatusResponse = S.suspend(() =>
  S.Struct({
    SessionId: S.optional(S.String),
    Status: S.optional(SessionStatus),
  }),
).annotations({
  identifier: "GetSessionStatusResponse",
}) as any as S.Schema<GetSessionStatusResponse>;
export interface ImportNotebookOutput {
  NotebookId?: string;
}
export const ImportNotebookOutput = S.suspend(() =>
  S.Struct({ NotebookId: S.optional(S.String) }),
).annotations({
  identifier: "ImportNotebookOutput",
}) as any as S.Schema<ImportNotebookOutput>;
export interface ListCapacityReservationsOutput {
  NextToken?: string;
  CapacityReservations: CapacityReservation[];
}
export const ListCapacityReservationsOutput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    CapacityReservations: CapacityReservationsList,
  }),
).annotations({
  identifier: "ListCapacityReservationsOutput",
}) as any as S.Schema<ListCapacityReservationsOutput>;
export interface ListDatabasesOutput {
  DatabaseList?: Database[];
  NextToken?: string;
}
export const ListDatabasesOutput = S.suspend(() =>
  S.Struct({
    DatabaseList: S.optional(DatabaseList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDatabasesOutput",
}) as any as S.Schema<ListDatabasesOutput>;
export interface ListEngineVersionsOutput {
  EngineVersions?: EngineVersion[];
  NextToken?: string;
}
export const ListEngineVersionsOutput = S.suspend(() =>
  S.Struct({
    EngineVersions: S.optional(EngineVersionsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEngineVersionsOutput",
}) as any as S.Schema<ListEngineVersionsOutput>;
export interface ListNamedQueriesOutput {
  NamedQueryIds?: string[];
  NextToken?: string;
}
export const ListNamedQueriesOutput = S.suspend(() =>
  S.Struct({
    NamedQueryIds: S.optional(NamedQueryIdList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNamedQueriesOutput",
}) as any as S.Schema<ListNamedQueriesOutput>;
export interface ListNotebookMetadataInput {
  Filters?: FilterDefinition;
  NextToken?: string;
  MaxResults?: number;
  WorkGroup: string;
}
export const ListNotebookMetadataInput = S.suspend(() =>
  S.Struct({
    Filters: S.optional(FilterDefinition),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkGroup: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListNotebookMetadataInput",
}) as any as S.Schema<ListNotebookMetadataInput>;
export interface ListQueryExecutionsOutput {
  QueryExecutionIds?: string[];
  NextToken?: string;
}
export const ListQueryExecutionsOutput = S.suspend(() =>
  S.Struct({
    QueryExecutionIds: S.optional(QueryExecutionIdList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListQueryExecutionsOutput",
}) as any as S.Schema<ListQueryExecutionsOutput>;
export interface ListTableMetadataOutput {
  TableMetadataList?: TableMetadata[];
  NextToken?: string;
}
export const ListTableMetadataOutput = S.suspend(() =>
  S.Struct({
    TableMetadataList: S.optional(TableMetadataList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTableMetadataOutput",
}) as any as S.Schema<ListTableMetadataOutput>;
export interface ListTagsForResourceOutput {
  Tags?: Tag[];
  NextToken?: string;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface PutCapacityAssignmentConfigurationInput {
  CapacityReservationName: string;
  CapacityAssignments: CapacityAssignment[];
}
export const PutCapacityAssignmentConfigurationInput = S.suspend(() =>
  S.Struct({
    CapacityReservationName: S.String,
    CapacityAssignments: CapacityAssignmentsList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutCapacityAssignmentConfigurationInput",
}) as any as S.Schema<PutCapacityAssignmentConfigurationInput>;
export interface PutCapacityAssignmentConfigurationOutput {}
export const PutCapacityAssignmentConfigurationOutput = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutCapacityAssignmentConfigurationOutput",
}) as any as S.Schema<PutCapacityAssignmentConfigurationOutput>;
export interface StartCalculationExecutionRequest {
  SessionId: string;
  Description?: string;
  CalculationConfiguration?: CalculationConfiguration;
  CodeBlock?: string;
  ClientRequestToken?: string;
}
export const StartCalculationExecutionRequest = S.suspend(() =>
  S.Struct({
    SessionId: S.String,
    Description: S.optional(S.String),
    CalculationConfiguration: S.optional(CalculationConfiguration),
    CodeBlock: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartCalculationExecutionRequest",
}) as any as S.Schema<StartCalculationExecutionRequest>;
export interface StopCalculationExecutionResponse {
  State?: CalculationExecutionState;
}
export const StopCalculationExecutionResponse = S.suspend(() =>
  S.Struct({ State: S.optional(CalculationExecutionState) }),
).annotations({
  identifier: "StopCalculationExecutionResponse",
}) as any as S.Schema<StopCalculationExecutionResponse>;
export interface TerminateSessionResponse {
  State?: SessionState;
}
export const TerminateSessionResponse = S.suspend(() =>
  S.Struct({ State: S.optional(SessionState) }),
).annotations({
  identifier: "TerminateSessionResponse",
}) as any as S.Schema<TerminateSessionResponse>;
export interface CustomerContentEncryptionConfiguration {
  KmsKey: string;
}
export const CustomerContentEncryptionConfiguration = S.suspend(() =>
  S.Struct({ KmsKey: S.String }),
).annotations({
  identifier: "CustomerContentEncryptionConfiguration",
}) as any as S.Schema<CustomerContentEncryptionConfiguration>;
export interface IdentityCenterConfiguration {
  EnableIdentityCenter?: boolean;
  IdentityCenterInstanceArn?: string;
}
export const IdentityCenterConfiguration = S.suspend(() =>
  S.Struct({
    EnableIdentityCenter: S.optional(S.Boolean),
    IdentityCenterInstanceArn: S.optional(S.String),
  }),
).annotations({
  identifier: "IdentityCenterConfiguration",
}) as any as S.Schema<IdentityCenterConfiguration>;
export type SupportedDPUSizeList = number[];
export const SupportedDPUSizeList = S.Array(S.Number);
export type ExecutorType = "COORDINATOR" | "GATEWAY" | "WORKER";
export const ExecutorType = S.Literal("COORDINATOR", "GATEWAY", "WORKER");
export interface Classification {
  Name?: string;
  Properties?: { [key: string]: string };
}
export const Classification = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Properties: S.optional(ParametersMap),
  }),
).annotations({
  identifier: "Classification",
}) as any as S.Schema<Classification>;
export type ClassificationList = Classification[];
export const ClassificationList = S.Array(Classification);
export interface ManagedLoggingConfiguration {
  Enabled: boolean;
  KmsKey?: string;
}
export const ManagedLoggingConfiguration = S.suspend(() =>
  S.Struct({ Enabled: S.Boolean, KmsKey: S.optional(S.String) }),
).annotations({
  identifier: "ManagedLoggingConfiguration",
}) as any as S.Schema<ManagedLoggingConfiguration>;
export interface S3LoggingConfiguration {
  Enabled: boolean;
  KmsKey?: string;
  LogLocation?: string;
}
export const S3LoggingConfiguration = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    KmsKey: S.optional(S.String),
    LogLocation: S.optional(S.String),
  }),
).annotations({
  identifier: "S3LoggingConfiguration",
}) as any as S.Schema<S3LoggingConfiguration>;
export interface ResultConfigurationUpdates {
  OutputLocation?: string;
  RemoveOutputLocation?: boolean;
  EncryptionConfiguration?: EncryptionConfiguration;
  RemoveEncryptionConfiguration?: boolean;
  ExpectedBucketOwner?: string;
  RemoveExpectedBucketOwner?: boolean;
  AclConfiguration?: AclConfiguration;
  RemoveAclConfiguration?: boolean;
}
export const ResultConfigurationUpdates = S.suspend(() =>
  S.Struct({
    OutputLocation: S.optional(S.String),
    RemoveOutputLocation: S.optional(S.Boolean),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
    RemoveEncryptionConfiguration: S.optional(S.Boolean),
    ExpectedBucketOwner: S.optional(S.String),
    RemoveExpectedBucketOwner: S.optional(S.Boolean),
    AclConfiguration: S.optional(AclConfiguration),
    RemoveAclConfiguration: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ResultConfigurationUpdates",
}) as any as S.Schema<ResultConfigurationUpdates>;
export interface ManagedQueryResultsConfigurationUpdates {
  Enabled?: boolean;
  EncryptionConfiguration?: ManagedQueryResultsEncryptionConfiguration;
  RemoveEncryptionConfiguration?: boolean;
}
export const ManagedQueryResultsConfigurationUpdates = S.suspend(() =>
  S.Struct({
    Enabled: S.optional(S.Boolean),
    EncryptionConfiguration: S.optional(
      ManagedQueryResultsEncryptionConfiguration,
    ),
    RemoveEncryptionConfiguration: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ManagedQueryResultsConfigurationUpdates",
}) as any as S.Schema<ManagedQueryResultsConfigurationUpdates>;
export type LogTypeValuesList = string[];
export const LogTypeValuesList = S.Array(S.String);
export type NamedQueryList = NamedQuery[];
export const NamedQueryList = S.Array(NamedQuery);
export interface UnprocessedNamedQueryId {
  NamedQueryId?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const UnprocessedNamedQueryId = S.suspend(() =>
  S.Struct({
    NamedQueryId: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "UnprocessedNamedQueryId",
}) as any as S.Schema<UnprocessedNamedQueryId>;
export type UnprocessedNamedQueryIdList = UnprocessedNamedQueryId[];
export const UnprocessedNamedQueryIdList = S.Array(UnprocessedNamedQueryId);
export type PreparedStatementDetailsList = PreparedStatement[];
export const PreparedStatementDetailsList = S.Array(PreparedStatement);
export interface UnprocessedPreparedStatementName {
  StatementName?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const UnprocessedPreparedStatementName = S.suspend(() =>
  S.Struct({
    StatementName: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "UnprocessedPreparedStatementName",
}) as any as S.Schema<UnprocessedPreparedStatementName>;
export type UnprocessedPreparedStatementNameList =
  UnprocessedPreparedStatementName[];
export const UnprocessedPreparedStatementNameList = S.Array(
  UnprocessedPreparedStatementName,
);
export interface UnprocessedQueryExecutionId {
  QueryExecutionId?: string;
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const UnprocessedQueryExecutionId = S.suspend(() =>
  S.Struct({
    QueryExecutionId: S.optional(S.String),
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "UnprocessedQueryExecutionId",
}) as any as S.Schema<UnprocessedQueryExecutionId>;
export type UnprocessedQueryExecutionIdList = UnprocessedQueryExecutionId[];
export const UnprocessedQueryExecutionIdList = S.Array(
  UnprocessedQueryExecutionId,
);
export interface CalculationResult {
  StdOutS3Uri?: string;
  StdErrorS3Uri?: string;
  ResultS3Uri?: string;
  ResultType?: string;
}
export const CalculationResult = S.suspend(() =>
  S.Struct({
    StdOutS3Uri: S.optional(S.String),
    StdErrorS3Uri: S.optional(S.String),
    ResultS3Uri: S.optional(S.String),
    ResultType: S.optional(S.String),
  }),
).annotations({
  identifier: "CalculationResult",
}) as any as S.Schema<CalculationResult>;
export interface CapacityAssignmentConfiguration {
  CapacityReservationName?: string;
  CapacityAssignments?: CapacityAssignment[];
}
export const CapacityAssignmentConfiguration = S.suspend(() =>
  S.Struct({
    CapacityReservationName: S.optional(S.String),
    CapacityAssignments: S.optional(CapacityAssignmentsList),
  }),
).annotations({
  identifier: "CapacityAssignmentConfiguration",
}) as any as S.Schema<CapacityAssignmentConfiguration>;
export interface SessionConfiguration {
  ExecutionRole?: string;
  WorkingDirectory?: string;
  IdleTimeoutSeconds?: number;
  SessionIdleTimeoutInMinutes?: number;
  EncryptionConfiguration?: EncryptionConfiguration;
}
export const SessionConfiguration = S.suspend(() =>
  S.Struct({
    ExecutionRole: S.optional(S.String),
    WorkingDirectory: S.optional(S.String),
    IdleTimeoutSeconds: S.optional(S.Number),
    SessionIdleTimeoutInMinutes: S.optional(S.Number),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
  }),
).annotations({
  identifier: "SessionConfiguration",
}) as any as S.Schema<SessionConfiguration>;
export interface SessionStatistics {
  DpuExecutionInMillis?: number;
}
export const SessionStatistics = S.suspend(() =>
  S.Struct({ DpuExecutionInMillis: S.optional(S.Number) }),
).annotations({
  identifier: "SessionStatistics",
}) as any as S.Schema<SessionStatistics>;
export type LogTypesMap = { [key: string]: string[] };
export const LogTypesMap = S.Record({
  key: S.String,
  value: LogTypeValuesList,
});
export interface CloudWatchLoggingConfiguration {
  Enabled: boolean;
  LogGroup?: string;
  LogStreamNamePrefix?: string;
  LogTypes?: { [key: string]: string[] };
}
export const CloudWatchLoggingConfiguration = S.suspend(() =>
  S.Struct({
    Enabled: S.Boolean,
    LogGroup: S.optional(S.String),
    LogStreamNamePrefix: S.optional(S.String),
    LogTypes: S.optional(LogTypesMap),
  }),
).annotations({
  identifier: "CloudWatchLoggingConfiguration",
}) as any as S.Schema<CloudWatchLoggingConfiguration>;
export interface MonitoringConfiguration {
  CloudWatchLoggingConfiguration?: CloudWatchLoggingConfiguration;
  ManagedLoggingConfiguration?: ManagedLoggingConfiguration;
  S3LoggingConfiguration?: S3LoggingConfiguration;
}
export const MonitoringConfiguration = S.suspend(() =>
  S.Struct({
    CloudWatchLoggingConfiguration: S.optional(CloudWatchLoggingConfiguration),
    ManagedLoggingConfiguration: S.optional(ManagedLoggingConfiguration),
    S3LoggingConfiguration: S.optional(S3LoggingConfiguration),
  }),
).annotations({
  identifier: "MonitoringConfiguration",
}) as any as S.Schema<MonitoringConfiguration>;
export interface EngineConfiguration {
  CoordinatorDpuSize?: number;
  MaxConcurrentDpus?: number;
  DefaultExecutorDpuSize?: number;
  AdditionalConfigs?: { [key: string]: string };
  SparkProperties?: { [key: string]: string };
  Classifications?: Classification[];
}
export const EngineConfiguration = S.suspend(() =>
  S.Struct({
    CoordinatorDpuSize: S.optional(S.Number),
    MaxConcurrentDpus: S.optional(S.Number),
    DefaultExecutorDpuSize: S.optional(S.Number),
    AdditionalConfigs: S.optional(ParametersMap),
    SparkProperties: S.optional(ParametersMap),
    Classifications: S.optional(ClassificationList),
  }),
).annotations({
  identifier: "EngineConfiguration",
}) as any as S.Schema<EngineConfiguration>;
export interface WorkGroupConfiguration {
  ResultConfiguration?: ResultConfiguration;
  ManagedQueryResultsConfiguration?: ManagedQueryResultsConfiguration;
  EnforceWorkGroupConfiguration?: boolean;
  PublishCloudWatchMetricsEnabled?: boolean;
  BytesScannedCutoffPerQuery?: number;
  RequesterPaysEnabled?: boolean;
  EngineVersion?: EngineVersion;
  AdditionalConfiguration?: string;
  ExecutionRole?: string;
  MonitoringConfiguration?: MonitoringConfiguration;
  EngineConfiguration?: EngineConfiguration;
  CustomerContentEncryptionConfiguration?: CustomerContentEncryptionConfiguration;
  EnableMinimumEncryptionConfiguration?: boolean;
  IdentityCenterConfiguration?: IdentityCenterConfiguration;
  QueryResultsS3AccessGrantsConfiguration?: QueryResultsS3AccessGrantsConfiguration;
}
export const WorkGroupConfiguration = S.suspend(() =>
  S.Struct({
    ResultConfiguration: S.optional(ResultConfiguration),
    ManagedQueryResultsConfiguration: S.optional(
      ManagedQueryResultsConfiguration,
    ),
    EnforceWorkGroupConfiguration: S.optional(S.Boolean),
    PublishCloudWatchMetricsEnabled: S.optional(S.Boolean),
    BytesScannedCutoffPerQuery: S.optional(S.Number),
    RequesterPaysEnabled: S.optional(S.Boolean),
    EngineVersion: S.optional(EngineVersion),
    AdditionalConfiguration: S.optional(S.String),
    ExecutionRole: S.optional(S.String),
    MonitoringConfiguration: S.optional(MonitoringConfiguration),
    EngineConfiguration: S.optional(EngineConfiguration),
    CustomerContentEncryptionConfiguration: S.optional(
      CustomerContentEncryptionConfiguration,
    ),
    EnableMinimumEncryptionConfiguration: S.optional(S.Boolean),
    IdentityCenterConfiguration: S.optional(IdentityCenterConfiguration),
    QueryResultsS3AccessGrantsConfiguration: S.optional(
      QueryResultsS3AccessGrantsConfiguration,
    ),
  }),
).annotations({
  identifier: "WorkGroupConfiguration",
}) as any as S.Schema<WorkGroupConfiguration>;
export interface WorkGroup {
  Name: string;
  State?: WorkGroupState;
  Configuration?: WorkGroupConfiguration;
  Description?: string;
  CreationTime?: Date;
  IdentityCenterApplicationArn?: string;
}
export const WorkGroup = S.suspend(() =>
  S.Struct({
    Name: S.String,
    State: S.optional(WorkGroupState),
    Configuration: S.optional(WorkGroupConfiguration),
    Description: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    IdentityCenterApplicationArn: S.optional(S.String),
  }),
).annotations({ identifier: "WorkGroup" }) as any as S.Schema<WorkGroup>;
export interface ApplicationDPUSizes {
  ApplicationRuntimeId?: string;
  SupportedDPUSizes?: number[];
}
export const ApplicationDPUSizes = S.suspend(() =>
  S.Struct({
    ApplicationRuntimeId: S.optional(S.String),
    SupportedDPUSizes: S.optional(SupportedDPUSizeList),
  }),
).annotations({
  identifier: "ApplicationDPUSizes",
}) as any as S.Schema<ApplicationDPUSizes>;
export type ApplicationDPUSizesList = ApplicationDPUSizes[];
export const ApplicationDPUSizesList = S.Array(ApplicationDPUSizes);
export interface CalculationSummary {
  CalculationExecutionId?: string;
  Description?: string;
  Status?: CalculationStatus;
}
export const CalculationSummary = S.suspend(() =>
  S.Struct({
    CalculationExecutionId: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(CalculationStatus),
  }),
).annotations({
  identifier: "CalculationSummary",
}) as any as S.Schema<CalculationSummary>;
export type CalculationsList = CalculationSummary[];
export const CalculationsList = S.Array(CalculationSummary);
export interface DataCatalogSummary {
  CatalogName?: string;
  Type?: DataCatalogType;
  Status?: DataCatalogStatus;
  ConnectionType?: ConnectionType;
  Error?: string;
}
export const DataCatalogSummary = S.suspend(() =>
  S.Struct({
    CatalogName: S.optional(S.String),
    Type: S.optional(DataCatalogType),
    Status: S.optional(DataCatalogStatus),
    ConnectionType: S.optional(ConnectionType),
    Error: S.optional(S.String),
  }),
).annotations({
  identifier: "DataCatalogSummary",
}) as any as S.Schema<DataCatalogSummary>;
export type DataCatalogSummaryList = DataCatalogSummary[];
export const DataCatalogSummaryList = S.Array(DataCatalogSummary);
export interface ExecutorsSummary {
  ExecutorId: string;
  ExecutorType?: ExecutorType;
  StartDateTime?: number;
  TerminationDateTime?: number;
  ExecutorState?: ExecutorState;
  ExecutorSize?: number;
}
export const ExecutorsSummary = S.suspend(() =>
  S.Struct({
    ExecutorId: S.String,
    ExecutorType: S.optional(ExecutorType),
    StartDateTime: S.optional(S.Number),
    TerminationDateTime: S.optional(S.Number),
    ExecutorState: S.optional(ExecutorState),
    ExecutorSize: S.optional(S.Number),
  }),
).annotations({
  identifier: "ExecutorsSummary",
}) as any as S.Schema<ExecutorsSummary>;
export type ExecutorsSummaryList = ExecutorsSummary[];
export const ExecutorsSummaryList = S.Array(ExecutorsSummary);
export type NotebookMetadataArray = NotebookMetadata[];
export const NotebookMetadataArray = S.Array(NotebookMetadata);
export interface NotebookSessionSummary {
  SessionId?: string;
  CreationTime?: Date;
}
export const NotebookSessionSummary = S.suspend(() =>
  S.Struct({
    SessionId: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "NotebookSessionSummary",
}) as any as S.Schema<NotebookSessionSummary>;
export type NotebookSessionsList = NotebookSessionSummary[];
export const NotebookSessionsList = S.Array(NotebookSessionSummary);
export interface PreparedStatementSummary {
  StatementName?: string;
  LastModifiedTime?: Date;
}
export const PreparedStatementSummary = S.suspend(() =>
  S.Struct({
    StatementName: S.optional(S.String),
    LastModifiedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PreparedStatementSummary",
}) as any as S.Schema<PreparedStatementSummary>;
export type PreparedStatementsList = PreparedStatementSummary[];
export const PreparedStatementsList = S.Array(PreparedStatementSummary);
export interface SessionSummary {
  SessionId?: string;
  Description?: string;
  EngineVersion?: EngineVersion;
  NotebookVersion?: string;
  Status?: SessionStatus;
}
export const SessionSummary = S.suspend(() =>
  S.Struct({
    SessionId: S.optional(S.String),
    Description: S.optional(S.String),
    EngineVersion: S.optional(EngineVersion),
    NotebookVersion: S.optional(S.String),
    Status: S.optional(SessionStatus),
  }),
).annotations({
  identifier: "SessionSummary",
}) as any as S.Schema<SessionSummary>;
export type SessionsList = SessionSummary[];
export const SessionsList = S.Array(SessionSummary);
export interface WorkGroupSummary {
  Name?: string;
  State?: WorkGroupState;
  Description?: string;
  CreationTime?: Date;
  EngineVersion?: EngineVersion;
  IdentityCenterApplicationArn?: string;
}
export const WorkGroupSummary = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    State: S.optional(WorkGroupState),
    Description: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EngineVersion: S.optional(EngineVersion),
    IdentityCenterApplicationArn: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkGroupSummary",
}) as any as S.Schema<WorkGroupSummary>;
export type WorkGroupsList = WorkGroupSummary[];
export const WorkGroupsList = S.Array(WorkGroupSummary);
export interface WorkGroupConfigurationUpdates {
  EnforceWorkGroupConfiguration?: boolean;
  ResultConfigurationUpdates?: ResultConfigurationUpdates;
  ManagedQueryResultsConfigurationUpdates?: ManagedQueryResultsConfigurationUpdates;
  PublishCloudWatchMetricsEnabled?: boolean;
  BytesScannedCutoffPerQuery?: number;
  RemoveBytesScannedCutoffPerQuery?: boolean;
  RequesterPaysEnabled?: boolean;
  EngineVersion?: EngineVersion;
  RemoveCustomerContentEncryptionConfiguration?: boolean;
  AdditionalConfiguration?: string;
  ExecutionRole?: string;
  CustomerContentEncryptionConfiguration?: CustomerContentEncryptionConfiguration;
  EnableMinimumEncryptionConfiguration?: boolean;
  QueryResultsS3AccessGrantsConfiguration?: QueryResultsS3AccessGrantsConfiguration;
  MonitoringConfiguration?: MonitoringConfiguration;
  EngineConfiguration?: EngineConfiguration;
}
export const WorkGroupConfigurationUpdates = S.suspend(() =>
  S.Struct({
    EnforceWorkGroupConfiguration: S.optional(S.Boolean),
    ResultConfigurationUpdates: S.optional(ResultConfigurationUpdates),
    ManagedQueryResultsConfigurationUpdates: S.optional(
      ManagedQueryResultsConfigurationUpdates,
    ),
    PublishCloudWatchMetricsEnabled: S.optional(S.Boolean),
    BytesScannedCutoffPerQuery: S.optional(S.Number),
    RemoveBytesScannedCutoffPerQuery: S.optional(S.Boolean),
    RequesterPaysEnabled: S.optional(S.Boolean),
    EngineVersion: S.optional(EngineVersion),
    RemoveCustomerContentEncryptionConfiguration: S.optional(S.Boolean),
    AdditionalConfiguration: S.optional(S.String),
    ExecutionRole: S.optional(S.String),
    CustomerContentEncryptionConfiguration: S.optional(
      CustomerContentEncryptionConfiguration,
    ),
    EnableMinimumEncryptionConfiguration: S.optional(S.Boolean),
    QueryResultsS3AccessGrantsConfiguration: S.optional(
      QueryResultsS3AccessGrantsConfiguration,
    ),
    MonitoringConfiguration: S.optional(MonitoringConfiguration),
    EngineConfiguration: S.optional(EngineConfiguration),
  }),
).annotations({
  identifier: "WorkGroupConfigurationUpdates",
}) as any as S.Schema<WorkGroupConfigurationUpdates>;
export type QueryStages = QueryStage[];
export const QueryStages = S.Array(
  S.suspend((): S.Schema<QueryStage, any> => QueryStage).annotations({
    identifier: "QueryStage",
  }),
) as any as S.Schema<QueryStages>;
export interface BatchGetNamedQueryOutput {
  NamedQueries?: NamedQuery[];
  UnprocessedNamedQueryIds?: UnprocessedNamedQueryId[];
}
export const BatchGetNamedQueryOutput = S.suspend(() =>
  S.Struct({
    NamedQueries: S.optional(NamedQueryList),
    UnprocessedNamedQueryIds: S.optional(UnprocessedNamedQueryIdList),
  }),
).annotations({
  identifier: "BatchGetNamedQueryOutput",
}) as any as S.Schema<BatchGetNamedQueryOutput>;
export interface BatchGetPreparedStatementOutput {
  PreparedStatements?: PreparedStatement[];
  UnprocessedPreparedStatementNames?: UnprocessedPreparedStatementName[];
}
export const BatchGetPreparedStatementOutput = S.suspend(() =>
  S.Struct({
    PreparedStatements: S.optional(PreparedStatementDetailsList),
    UnprocessedPreparedStatementNames: S.optional(
      UnprocessedPreparedStatementNameList,
    ),
  }),
).annotations({
  identifier: "BatchGetPreparedStatementOutput",
}) as any as S.Schema<BatchGetPreparedStatementOutput>;
export interface CreateDataCatalogOutput {
  DataCatalog?: DataCatalog;
}
export const CreateDataCatalogOutput = S.suspend(() =>
  S.Struct({ DataCatalog: S.optional(DataCatalog) }),
).annotations({
  identifier: "CreateDataCatalogOutput",
}) as any as S.Schema<CreateDataCatalogOutput>;
export interface DeleteDataCatalogOutput {
  DataCatalog?: DataCatalog;
}
export const DeleteDataCatalogOutput = S.suspend(() =>
  S.Struct({ DataCatalog: S.optional(DataCatalog) }),
).annotations({
  identifier: "DeleteDataCatalogOutput",
}) as any as S.Schema<DeleteDataCatalogOutput>;
export interface ExportNotebookOutput {
  NotebookMetadata?: NotebookMetadata;
  Payload?: string;
}
export const ExportNotebookOutput = S.suspend(() =>
  S.Struct({
    NotebookMetadata: S.optional(NotebookMetadata),
    Payload: S.optional(S.String),
  }),
).annotations({
  identifier: "ExportNotebookOutput",
}) as any as S.Schema<ExportNotebookOutput>;
export interface GetCalculationExecutionResponse {
  CalculationExecutionId?: string;
  SessionId?: string;
  Description?: string;
  WorkingDirectory?: string;
  Status?: CalculationStatus;
  Statistics?: CalculationStatistics;
  Result?: CalculationResult;
}
export const GetCalculationExecutionResponse = S.suspend(() =>
  S.Struct({
    CalculationExecutionId: S.optional(S.String),
    SessionId: S.optional(S.String),
    Description: S.optional(S.String),
    WorkingDirectory: S.optional(S.String),
    Status: S.optional(CalculationStatus),
    Statistics: S.optional(CalculationStatistics),
    Result: S.optional(CalculationResult),
  }),
).annotations({
  identifier: "GetCalculationExecutionResponse",
}) as any as S.Schema<GetCalculationExecutionResponse>;
export interface GetCapacityAssignmentConfigurationOutput {
  CapacityAssignmentConfiguration: CapacityAssignmentConfiguration;
}
export const GetCapacityAssignmentConfigurationOutput = S.suspend(() =>
  S.Struct({
    CapacityAssignmentConfiguration: CapacityAssignmentConfiguration,
  }),
).annotations({
  identifier: "GetCapacityAssignmentConfigurationOutput",
}) as any as S.Schema<GetCapacityAssignmentConfigurationOutput>;
export interface GetDatabaseOutput {
  Database?: Database;
}
export const GetDatabaseOutput = S.suspend(() =>
  S.Struct({ Database: S.optional(Database) }),
).annotations({
  identifier: "GetDatabaseOutput",
}) as any as S.Schema<GetDatabaseOutput>;
export interface GetSessionResponse {
  SessionId?: string;
  Description?: string;
  WorkGroup?: string;
  EngineVersion?: string;
  EngineConfiguration?: EngineConfiguration;
  NotebookVersion?: string;
  MonitoringConfiguration?: MonitoringConfiguration;
  SessionConfiguration?: SessionConfiguration;
  Status?: SessionStatus;
  Statistics?: SessionStatistics;
}
export const GetSessionResponse = S.suspend(() =>
  S.Struct({
    SessionId: S.optional(S.String),
    Description: S.optional(S.String),
    WorkGroup: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    EngineConfiguration: S.optional(EngineConfiguration),
    NotebookVersion: S.optional(S.String),
    MonitoringConfiguration: S.optional(MonitoringConfiguration),
    SessionConfiguration: S.optional(SessionConfiguration),
    Status: S.optional(SessionStatus),
    Statistics: S.optional(SessionStatistics),
  }),
).annotations({
  identifier: "GetSessionResponse",
}) as any as S.Schema<GetSessionResponse>;
export interface GetWorkGroupOutput {
  WorkGroup?: WorkGroup;
}
export const GetWorkGroupOutput = S.suspend(() =>
  S.Struct({ WorkGroup: S.optional(WorkGroup) }),
).annotations({
  identifier: "GetWorkGroupOutput",
}) as any as S.Schema<GetWorkGroupOutput>;
export interface ListApplicationDPUSizesOutput {
  ApplicationDPUSizes?: ApplicationDPUSizes[];
  NextToken?: string;
}
export const ListApplicationDPUSizesOutput = S.suspend(() =>
  S.Struct({
    ApplicationDPUSizes: S.optional(ApplicationDPUSizesList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationDPUSizesOutput",
}) as any as S.Schema<ListApplicationDPUSizesOutput>;
export interface ListCalculationExecutionsResponse {
  NextToken?: string;
  Calculations?: CalculationSummary[];
}
export const ListCalculationExecutionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Calculations: S.optional(CalculationsList),
  }),
).annotations({
  identifier: "ListCalculationExecutionsResponse",
}) as any as S.Schema<ListCalculationExecutionsResponse>;
export interface ListDataCatalogsOutput {
  DataCatalogsSummary?: DataCatalogSummary[];
  NextToken?: string;
}
export const ListDataCatalogsOutput = S.suspend(() =>
  S.Struct({
    DataCatalogsSummary: S.optional(DataCatalogSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataCatalogsOutput",
}) as any as S.Schema<ListDataCatalogsOutput>;
export interface ListExecutorsResponse {
  SessionId: string;
  NextToken?: string;
  ExecutorsSummary?: ExecutorsSummary[];
}
export const ListExecutorsResponse = S.suspend(() =>
  S.Struct({
    SessionId: S.String,
    NextToken: S.optional(S.String),
    ExecutorsSummary: S.optional(ExecutorsSummaryList),
  }),
).annotations({
  identifier: "ListExecutorsResponse",
}) as any as S.Schema<ListExecutorsResponse>;
export interface ListNotebookMetadataOutput {
  NextToken?: string;
  NotebookMetadataList?: NotebookMetadata[];
}
export const ListNotebookMetadataOutput = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    NotebookMetadataList: S.optional(NotebookMetadataArray),
  }),
).annotations({
  identifier: "ListNotebookMetadataOutput",
}) as any as S.Schema<ListNotebookMetadataOutput>;
export interface ListNotebookSessionsResponse {
  NotebookSessionsList: NotebookSessionSummary[];
  NextToken?: string;
}
export const ListNotebookSessionsResponse = S.suspend(() =>
  S.Struct({
    NotebookSessionsList: NotebookSessionsList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListNotebookSessionsResponse",
}) as any as S.Schema<ListNotebookSessionsResponse>;
export interface ListPreparedStatementsOutput {
  PreparedStatements?: PreparedStatementSummary[];
  NextToken?: string;
}
export const ListPreparedStatementsOutput = S.suspend(() =>
  S.Struct({
    PreparedStatements: S.optional(PreparedStatementsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListPreparedStatementsOutput",
}) as any as S.Schema<ListPreparedStatementsOutput>;
export interface ListSessionsResponse {
  NextToken?: string;
  Sessions?: SessionSummary[];
}
export const ListSessionsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    Sessions: S.optional(SessionsList),
  }),
).annotations({
  identifier: "ListSessionsResponse",
}) as any as S.Schema<ListSessionsResponse>;
export interface ListWorkGroupsOutput {
  WorkGroups?: WorkGroupSummary[];
  NextToken?: string;
}
export const ListWorkGroupsOutput = S.suspend(() =>
  S.Struct({
    WorkGroups: S.optional(WorkGroupsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkGroupsOutput",
}) as any as S.Schema<ListWorkGroupsOutput>;
export interface StartCalculationExecutionResponse {
  CalculationExecutionId?: string;
  State?: CalculationExecutionState;
}
export const StartCalculationExecutionResponse = S.suspend(() =>
  S.Struct({
    CalculationExecutionId: S.optional(S.String),
    State: S.optional(CalculationExecutionState),
  }),
).annotations({
  identifier: "StartCalculationExecutionResponse",
}) as any as S.Schema<StartCalculationExecutionResponse>;
export interface StartQueryExecutionInput {
  QueryString: string;
  ClientRequestToken?: string;
  QueryExecutionContext?: QueryExecutionContext;
  ResultConfiguration?: ResultConfiguration;
  WorkGroup?: string;
  ExecutionParameters?: string[];
  ResultReuseConfiguration?: ResultReuseConfiguration;
  EngineConfiguration?: EngineConfiguration;
}
export const StartQueryExecutionInput = S.suspend(() =>
  S.Struct({
    QueryString: S.String,
    ClientRequestToken: S.optional(S.String).pipe(T.IdempotencyToken()),
    QueryExecutionContext: S.optional(QueryExecutionContext),
    ResultConfiguration: S.optional(ResultConfiguration),
    WorkGroup: S.optional(S.String),
    ExecutionParameters: S.optional(ExecutionParameters),
    ResultReuseConfiguration: S.optional(ResultReuseConfiguration),
    EngineConfiguration: S.optional(EngineConfiguration),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartQueryExecutionInput",
}) as any as S.Schema<StartQueryExecutionInput>;
export interface UpdateWorkGroupInput {
  WorkGroup: string;
  Description?: string;
  ConfigurationUpdates?: WorkGroupConfigurationUpdates;
  State?: WorkGroupState;
}
export const UpdateWorkGroupInput = S.suspend(() =>
  S.Struct({
    WorkGroup: S.String,
    Description: S.optional(S.String),
    ConfigurationUpdates: S.optional(WorkGroupConfigurationUpdates),
    State: S.optional(WorkGroupState),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateWorkGroupInput",
}) as any as S.Schema<UpdateWorkGroupInput>;
export interface UpdateWorkGroupOutput {}
export const UpdateWorkGroupOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateWorkGroupOutput",
}) as any as S.Schema<UpdateWorkGroupOutput>;
export interface QueryRuntimeStatisticsTimeline {
  QueryQueueTimeInMillis?: number;
  ServicePreProcessingTimeInMillis?: number;
  QueryPlanningTimeInMillis?: number;
  EngineExecutionTimeInMillis?: number;
  ServiceProcessingTimeInMillis?: number;
  TotalExecutionTimeInMillis?: number;
}
export const QueryRuntimeStatisticsTimeline = S.suspend(() =>
  S.Struct({
    QueryQueueTimeInMillis: S.optional(S.Number),
    ServicePreProcessingTimeInMillis: S.optional(S.Number),
    QueryPlanningTimeInMillis: S.optional(S.Number),
    EngineExecutionTimeInMillis: S.optional(S.Number),
    ServiceProcessingTimeInMillis: S.optional(S.Number),
    TotalExecutionTimeInMillis: S.optional(S.Number),
  }),
).annotations({
  identifier: "QueryRuntimeStatisticsTimeline",
}) as any as S.Schema<QueryRuntimeStatisticsTimeline>;
export interface QueryRuntimeStatisticsRows {
  InputRows?: number;
  InputBytes?: number;
  OutputBytes?: number;
  OutputRows?: number;
}
export const QueryRuntimeStatisticsRows = S.suspend(() =>
  S.Struct({
    InputRows: S.optional(S.Number),
    InputBytes: S.optional(S.Number),
    OutputBytes: S.optional(S.Number),
    OutputRows: S.optional(S.Number),
  }),
).annotations({
  identifier: "QueryRuntimeStatisticsRows",
}) as any as S.Schema<QueryRuntimeStatisticsRows>;
export type ColumnNullable = "NOT_NULL" | "NULLABLE" | "UNKNOWN";
export const ColumnNullable = S.Literal("NOT_NULL", "NULLABLE", "UNKNOWN");
export type QueryStagePlanNodes = QueryStagePlanNode[];
export const QueryStagePlanNodes = S.Array(
  S.suspend(
    (): S.Schema<QueryStagePlanNode, any> => QueryStagePlanNode,
  ).annotations({ identifier: "QueryStagePlanNode" }),
) as any as S.Schema<QueryStagePlanNodes>;
export type StringList = string[];
export const StringList = S.Array(S.String);
export type ThrottleReason = "CONCURRENT_QUERY_LIMIT_EXCEEDED";
export const ThrottleReason = S.Literal("CONCURRENT_QUERY_LIMIT_EXCEEDED");
export interface Datum {
  VarCharValue?: string;
}
export const Datum = S.suspend(() =>
  S.Struct({ VarCharValue: S.optional(S.String) }),
).annotations({ identifier: "Datum" }) as any as S.Schema<Datum>;
export type datumList = Datum[];
export const datumList = S.Array(Datum);
export interface ColumnInfo {
  CatalogName?: string;
  SchemaName?: string;
  TableName?: string;
  Name: string;
  Label?: string;
  Type: string;
  Precision?: number;
  Scale?: number;
  Nullable?: ColumnNullable;
  CaseSensitive?: boolean;
}
export const ColumnInfo = S.suspend(() =>
  S.Struct({
    CatalogName: S.optional(S.String),
    SchemaName: S.optional(S.String),
    TableName: S.optional(S.String),
    Name: S.String,
    Label: S.optional(S.String),
    Type: S.String,
    Precision: S.optional(S.Number),
    Scale: S.optional(S.Number),
    Nullable: S.optional(ColumnNullable),
    CaseSensitive: S.optional(S.Boolean),
  }),
).annotations({ identifier: "ColumnInfo" }) as any as S.Schema<ColumnInfo>;
export type ColumnInfoList = ColumnInfo[];
export const ColumnInfoList = S.Array(ColumnInfo);
export interface QueryStagePlanNode {
  Name?: string;
  Identifier?: string;
  Children?: QueryStagePlanNode[];
  RemoteSources?: string[];
}
export const QueryStagePlanNode = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Identifier: S.optional(S.String),
    Children: S.optional(
      S.suspend(() => QueryStagePlanNodes).annotations({
        identifier: "QueryStagePlanNodes",
      }),
    ),
    RemoteSources: S.optional(StringList),
  }),
).annotations({
  identifier: "QueryStagePlanNode",
}) as any as S.Schema<QueryStagePlanNode>;
export interface CreateWorkGroupInput {
  Name: string;
  Configuration?: WorkGroupConfiguration;
  Description?: string;
  Tags?: Tag[];
}
export const CreateWorkGroupInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Configuration: S.optional(WorkGroupConfiguration),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateWorkGroupInput",
}) as any as S.Schema<CreateWorkGroupInput>;
export interface CreateWorkGroupOutput {}
export const CreateWorkGroupOutput = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateWorkGroupOutput",
}) as any as S.Schema<CreateWorkGroupOutput>;
export interface GetCapacityReservationOutput {
  CapacityReservation: CapacityReservation;
}
export const GetCapacityReservationOutput = S.suspend(() =>
  S.Struct({ CapacityReservation: CapacityReservation }),
).annotations({
  identifier: "GetCapacityReservationOutput",
}) as any as S.Schema<GetCapacityReservationOutput>;
export interface GetTableMetadataOutput {
  TableMetadata?: TableMetadata;
}
export const GetTableMetadataOutput = S.suspend(() =>
  S.Struct({ TableMetadata: S.optional(TableMetadata) }),
).annotations({
  identifier: "GetTableMetadataOutput",
}) as any as S.Schema<GetTableMetadataOutput>;
export interface StartQueryExecutionOutput {
  QueryExecutionId?: string;
}
export const StartQueryExecutionOutput = S.suspend(() =>
  S.Struct({ QueryExecutionId: S.optional(S.String) }),
).annotations({
  identifier: "StartQueryExecutionOutput",
}) as any as S.Schema<StartQueryExecutionOutput>;
export interface StartSessionRequest {
  Description?: string;
  WorkGroup: string;
  EngineConfiguration: EngineConfiguration;
  ExecutionRole?: string;
  MonitoringConfiguration?: MonitoringConfiguration;
  NotebookVersion?: string;
  SessionIdleTimeoutInMinutes?: number;
  ClientRequestToken?: string;
  Tags?: Tag[];
  CopyWorkGroupTags?: boolean;
}
export const StartSessionRequest = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    WorkGroup: S.String,
    EngineConfiguration: EngineConfiguration,
    ExecutionRole: S.optional(S.String),
    MonitoringConfiguration: S.optional(MonitoringConfiguration),
    NotebookVersion: S.optional(S.String),
    SessionIdleTimeoutInMinutes: S.optional(S.Number),
    ClientRequestToken: S.optional(S.String),
    Tags: S.optional(TagList),
    CopyWorkGroupTags: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartSessionRequest",
}) as any as S.Schema<StartSessionRequest>;
export interface Row {
  Data?: Datum[];
}
export const Row = S.suspend(() =>
  S.Struct({ Data: S.optional(datumList) }),
).annotations({ identifier: "Row" }) as any as S.Schema<Row>;
export type RowList = Row[];
export const RowList = S.Array(Row);
export interface ResultSetMetadata {
  ColumnInfo?: ColumnInfo[];
}
export const ResultSetMetadata = S.suspend(() =>
  S.Struct({ ColumnInfo: S.optional(ColumnInfoList) }),
).annotations({
  identifier: "ResultSetMetadata",
}) as any as S.Schema<ResultSetMetadata>;
export interface QueryStage {
  StageId?: number;
  State?: string;
  OutputBytes?: number;
  OutputRows?: number;
  InputBytes?: number;
  InputRows?: number;
  ExecutionTime?: number;
  QueryStagePlan?: QueryStagePlanNode;
  SubStages?: QueryStage[];
}
export const QueryStage = S.suspend(() =>
  S.Struct({
    StageId: S.optional(S.Number),
    State: S.optional(S.String),
    OutputBytes: S.optional(S.Number),
    OutputRows: S.optional(S.Number),
    InputBytes: S.optional(S.Number),
    InputRows: S.optional(S.Number),
    ExecutionTime: S.optional(S.Number),
    QueryStagePlan: S.optional(
      S.suspend(
        (): S.Schema<QueryStagePlanNode, any> => QueryStagePlanNode,
      ).annotations({ identifier: "QueryStagePlanNode" }),
    ),
    SubStages: S.optional(
      S.suspend(() => QueryStages).annotations({ identifier: "QueryStages" }),
    ),
  }),
).annotations({ identifier: "QueryStage" }) as any as S.Schema<QueryStage>;
export type QueryExecutionList = QueryExecution[];
export const QueryExecutionList = S.Array(QueryExecution);
export interface ResultSet {
  Rows?: Row[];
  ResultSetMetadata?: ResultSetMetadata;
}
export const ResultSet = S.suspend(() =>
  S.Struct({
    Rows: S.optional(RowList),
    ResultSetMetadata: S.optional(ResultSetMetadata),
  }),
).annotations({ identifier: "ResultSet" }) as any as S.Schema<ResultSet>;
export interface QueryRuntimeStatistics {
  Timeline?: QueryRuntimeStatisticsTimeline;
  Rows?: QueryRuntimeStatisticsRows;
  OutputStage?: QueryStage;
}
export const QueryRuntimeStatistics = S.suspend(() =>
  S.Struct({
    Timeline: S.optional(QueryRuntimeStatisticsTimeline),
    Rows: S.optional(QueryRuntimeStatisticsRows),
    OutputStage: S.optional(QueryStage),
  }),
).annotations({
  identifier: "QueryRuntimeStatistics",
}) as any as S.Schema<QueryRuntimeStatistics>;
export interface BatchGetQueryExecutionOutput {
  QueryExecutions?: QueryExecution[];
  UnprocessedQueryExecutionIds?: UnprocessedQueryExecutionId[];
}
export const BatchGetQueryExecutionOutput = S.suspend(() =>
  S.Struct({
    QueryExecutions: S.optional(QueryExecutionList),
    UnprocessedQueryExecutionIds: S.optional(UnprocessedQueryExecutionIdList),
  }),
).annotations({
  identifier: "BatchGetQueryExecutionOutput",
}) as any as S.Schema<BatchGetQueryExecutionOutput>;
export interface GetQueryResultsOutput {
  UpdateCount?: number;
  ResultSet?: ResultSet;
  NextToken?: string;
}
export const GetQueryResultsOutput = S.suspend(() =>
  S.Struct({
    UpdateCount: S.optional(S.Number),
    ResultSet: S.optional(ResultSet),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetQueryResultsOutput",
}) as any as S.Schema<GetQueryResultsOutput>;
export interface GetQueryRuntimeStatisticsOutput {
  QueryRuntimeStatistics?: QueryRuntimeStatistics;
}
export const GetQueryRuntimeStatisticsOutput = S.suspend(() =>
  S.Struct({ QueryRuntimeStatistics: S.optional(QueryRuntimeStatistics) }),
).annotations({
  identifier: "GetQueryRuntimeStatisticsOutput",
}) as any as S.Schema<GetQueryRuntimeStatisticsOutput>;
export interface StartSessionResponse {
  SessionId?: string;
  State?: SessionState;
}
export const StartSessionResponse = S.suspend(() =>
  S.Struct({
    SessionId: S.optional(S.String),
    State: S.optional(SessionState),
  }),
).annotations({
  identifier: "StartSessionResponse",
}) as any as S.Schema<StartSessionResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
) {}
export class InvalidRequestException extends S.TaggedError<InvalidRequestException>()(
  "InvalidRequestException",
  { AthenaErrorCode: S.optional(S.String), Message: S.optional(S.String) },
) {}
export class TooManyRequestsException extends S.TaggedError<TooManyRequestsException>()(
  "TooManyRequestsException",
  { Message: S.optional(S.String), Reason: S.optional(ThrottleReason) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String), ResourceName: S.optional(S.String) },
) {}
export class MetadataException extends S.TaggedError<MetadataException>()(
  "MetadataException",
  { Message: S.optional(S.String) },
) {}
export class SessionAlreadyExistsException extends S.TaggedError<SessionAlreadyExistsException>()(
  "SessionAlreadyExistsException",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Cancels the capacity reservation with the specified name. Cancelled reservations
 * remain in your account and will be deleted 45 days after cancellation. During the 45
 * days, you cannot re-purpose or reuse a reservation that has been cancelled, but you can
 * refer to its tags and view it for historical reference.
 */
export const cancelCapacityReservation: (
  input: CancelCapacityReservationInput,
) => effect.Effect<
  CancelCapacityReservationOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelCapacityReservationInput,
  output: CancelCapacityReservationOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Creates (registers) a data catalog with the specified name and properties. Catalogs
 * created are visible to all users of the same Amazon Web Services account.
 *
 * For a `FEDERATED` catalog, this API operation creates the following
 * resources.
 *
 * - CFN Stack Name with a maximum length of 128 characters and prefix
 * `athenafederatedcatalog-CATALOG_NAME_SANITIZED` with length 23
 * characters.
 *
 * - Lambda Function Name with a maximum length of 64 characters and prefix
 * `athenafederatedcatalog_CATALOG_NAME_SANITIZED` with length 23
 * characters.
 *
 * - Glue Connection Name with a maximum length of 255 characters and a prefix
 * `athenafederatedcatalog_CATALOG_NAME_SANITIZED` with length 23
 * characters.
 */
export const createDataCatalog: (
  input: CreateDataCatalogInput,
) => effect.Effect<
  CreateDataCatalogOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataCatalogInput,
  output: CreateDataCatalogOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Deletes a data catalog.
 */
export const deleteDataCatalog: (
  input: DeleteDataCatalogInput,
) => effect.Effect<
  DeleteDataCatalogOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataCatalogInput,
  output: DeleteDataCatalogOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Gets the capacity assignment configuration for a capacity reservation, if one
 * exists.
 */
export const getCapacityAssignmentConfiguration: (
  input: GetCapacityAssignmentConfigurationInput,
) => effect.Effect<
  GetCapacityAssignmentConfigurationOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCapacityAssignmentConfigurationInput,
  output: GetCapacityAssignmentConfigurationOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns information about the workgroup with the specified name.
 */
export const getWorkGroup: (
  input: GetWorkGroupInput,
) => effect.Effect<
  GetWorkGroupOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkGroupInput,
  output: GetWorkGroupOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Lists the data catalogs in the current Amazon Web Services account.
 *
 * In the Athena console, data catalogs are listed as "data sources" on
 * the **Data sources** page under the **Data source name** column.
 */
export const listDataCatalogs: {
  (
    input: ListDataCatalogsInput,
  ): effect.Effect<
    ListDataCatalogsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataCatalogsInput,
  ) => stream.Stream<
    ListDataCatalogsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataCatalogsInput,
  ) => stream.Stream<
    DataCatalogSummary,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataCatalogsInput,
  output: ListDataCatalogsOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DataCatalogsSummary",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the prepared statements in the specified workgroup.
 */
export const listPreparedStatements: {
  (
    input: ListPreparedStatementsInput,
  ): effect.Effect<
    ListPreparedStatementsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListPreparedStatementsInput,
  ) => stream.Stream<
    ListPreparedStatementsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListPreparedStatementsInput,
  ) => stream.Stream<
    unknown,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListPreparedStatementsInput,
  output: ListPreparedStatementsOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists available workgroups for the account.
 */
export const listWorkGroups: {
  (
    input: ListWorkGroupsInput,
  ): effect.Effect<
    ListWorkGroupsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkGroupsInput,
  ) => stream.Stream<
    ListWorkGroupsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkGroupsInput,
  ) => stream.Stream<
    unknown,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkGroupsInput,
  output: ListWorkGroupsOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Updates the workgroup with the specified name. The workgroup's name cannot be changed.
 * Only `ConfigurationUpdates` can be specified.
 */
export const updateWorkGroup: (
  input: UpdateWorkGroupInput,
) => effect.Effect<
  UpdateWorkGroupOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkGroupInput,
  output: UpdateWorkGroupOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Creates a capacity reservation with the specified name and number of requested data
 * processing units.
 */
export const createCapacityReservation: (
  input: CreateCapacityReservationInput,
) => effect.Effect<
  CreateCapacityReservationOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCapacityReservationInput,
  output: CreateCapacityReservationOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Creates a named query in the specified workgroup. Requires that you have access to the
 * workgroup.
 */
export const createNamedQuery: (
  input: CreateNamedQueryInput,
) => effect.Effect<
  CreateNamedQueryOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNamedQueryInput,
  output: CreateNamedQueryOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns the specified data catalog.
 */
export const getDataCatalog: (
  input: GetDataCatalogInput,
) => effect.Effect<
  GetDataCatalogOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataCatalogInput,
  output: GetDataCatalogOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns information about a single query. Requires that you have access to the
 * workgroup in which the query was saved.
 */
export const getNamedQuery: (
  input: GetNamedQueryInput,
) => effect.Effect<
  GetNamedQueryOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNamedQueryInput,
  output: GetNamedQueryOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns information about a single execution of a query if you have access to the
 * workgroup in which the query ran. Each time a query executes, information about the
 * query execution is saved with a unique ID.
 */
export const getQueryExecution: (
  input: GetQueryExecutionInput,
) => effect.Effect<
  GetQueryExecutionOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueryExecutionInput,
  output: GetQueryExecutionOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Lists the capacity reservations for the current account.
 */
export const listCapacityReservations: {
  (
    input: ListCapacityReservationsInput,
  ): effect.Effect<
    ListCapacityReservationsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCapacityReservationsInput,
  ) => stream.Stream<
    ListCapacityReservationsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCapacityReservationsInput,
  ) => stream.Stream<
    unknown,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCapacityReservationsInput,
  output: ListCapacityReservationsOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of engine versions that are available to choose from, including the
 * Auto option.
 */
export const listEngineVersions: {
  (
    input: ListEngineVersionsInput,
  ): effect.Effect<
    ListEngineVersionsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEngineVersionsInput,
  ) => stream.Stream<
    ListEngineVersionsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEngineVersionsInput,
  ) => stream.Stream<
    unknown,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListEngineVersionsInput,
  output: ListEngineVersionsOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides a list of available query IDs only for queries saved in the specified
 * workgroup. Requires that you have access to the specified workgroup. If a workgroup is
 * not specified, lists the saved queries for the primary workgroup.
 */
export const listNamedQueries: {
  (
    input: ListNamedQueriesInput,
  ): effect.Effect<
    ListNamedQueriesOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListNamedQueriesInput,
  ) => stream.Stream<
    ListNamedQueriesOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListNamedQueriesInput,
  ) => stream.Stream<
    unknown,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListNamedQueriesInput,
  output: ListNamedQueriesOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Provides a list of available query execution IDs for the queries in the specified
 * workgroup. Athena keeps a query history for 45 days. If a workgroup is not
 * specified, returns a list of query execution IDs for the primary workgroup. Requires you
 * to have access to the workgroup in which the queries ran.
 */
export const listQueryExecutions: {
  (
    input: ListQueryExecutionsInput,
  ): effect.Effect<
    ListQueryExecutionsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQueryExecutionsInput,
  ) => stream.Stream<
    ListQueryExecutionsOutput,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQueryExecutionsInput,
  ) => stream.Stream<
    unknown,
    InternalServerException | InvalidRequestException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQueryExecutionsInput,
  output: ListQueryExecutionsOutput,
  errors: [InternalServerException, InvalidRequestException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Puts a new capacity assignment configuration for a specified capacity reservation. If
 * a capacity assignment configuration already exists for the capacity reservation,
 * replaces the existing capacity assignment configuration.
 */
export const putCapacityAssignmentConfiguration: (
  input: PutCapacityAssignmentConfigurationInput,
) => effect.Effect<
  PutCapacityAssignmentConfigurationOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutCapacityAssignmentConfigurationInput,
  output: PutCapacityAssignmentConfigurationOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Creates a prepared statement for use with SQL queries in Athena.
 */
export const createPreparedStatement: (
  input: CreatePreparedStatementInput,
) => effect.Effect<
  CreatePreparedStatementOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePreparedStatementInput,
  output: CreatePreparedStatementOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Deletes a cancelled capacity reservation. A reservation must be cancelled before it
 * can be deleted. A deleted reservation is immediately removed from your account and can
 * no longer be referenced, including by its ARN. A deleted reservation cannot be called by
 * `GetCapacityReservation`, and deleted reservations do not appear in the
 * output of `ListCapacityReservations`.
 */
export const deleteCapacityReservation: (
  input: DeleteCapacityReservationInput,
) => effect.Effect<
  DeleteCapacityReservationOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCapacityReservationInput,
  output: DeleteCapacityReservationOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Deletes the named query if you have access to the workgroup in which the query was
 * saved.
 */
export const deleteNamedQuery: (
  input: DeleteNamedQueryInput,
) => effect.Effect<
  DeleteNamedQueryOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNamedQueryInput,
  output: DeleteNamedQueryOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Deletes the workgroup with the specified name. The primary workgroup cannot be
 * deleted.
 */
export const deleteWorkGroup: (
  input: DeleteWorkGroupInput,
) => effect.Effect<
  DeleteWorkGroupOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkGroupInput,
  output: DeleteWorkGroupOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Stops a query execution. Requires you to have access to the workgroup in which the
 * query ran.
 */
export const stopQueryExecution: (
  input: StopQueryExecutionInput,
) => effect.Effect<
  StopQueryExecutionOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopQueryExecutionInput,
  output: StopQueryExecutionOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Updates the number of requested data processing units for the capacity reservation
 * with the specified name.
 */
export const updateCapacityReservation: (
  input: UpdateCapacityReservationInput,
) => effect.Effect<
  UpdateCapacityReservationOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCapacityReservationInput,
  output: UpdateCapacityReservationOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Updates the data catalog that has the specified name.
 */
export const updateDataCatalog: (
  input: UpdateDataCatalogInput,
) => effect.Effect<
  UpdateDataCatalogOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataCatalogInput,
  output: UpdateDataCatalogOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Updates a NamedQuery object. The database or workgroup cannot be
 * updated.
 */
export const updateNamedQuery: (
  input: UpdateNamedQueryInput,
) => effect.Effect<
  UpdateNamedQueryOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNamedQueryInput,
  output: UpdateNamedQueryOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns the details of a single named query or a list of up to 50 queries, which you
 * provide as an array of query ID strings. Requires you to have access to the workgroup in
 * which the queries were saved. Use ListNamedQueriesInput to get the
 * list of named query IDs in the specified workgroup. If information could not be
 * retrieved for a submitted query ID, information about the query ID submitted is listed
 * under UnprocessedNamedQueryId. Named queries differ from executed
 * queries. Use BatchGetQueryExecutionInput to get details about each
 * unique query execution, and ListQueryExecutionsInput to get a list of
 * query execution IDs.
 */
export const batchGetNamedQuery: (
  input: BatchGetNamedQueryInput,
) => effect.Effect<
  BatchGetNamedQueryOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetNamedQueryInput,
  output: BatchGetNamedQueryOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns the details of a single prepared statement or a list of up to 256 prepared
 * statements for the array of prepared statement names that you provide. Requires you to
 * have access to the workgroup to which the prepared statements belong. If a prepared
 * statement cannot be retrieved for the name specified, the statement is listed in
 * `UnprocessedPreparedStatementNames`.
 */
export const batchGetPreparedStatement: (
  input: BatchGetPreparedStatementInput,
) => effect.Effect<
  BatchGetPreparedStatementOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetPreparedStatementInput,
  output: BatchGetPreparedStatementOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Creates a workgroup with the specified name. A workgroup can be an Apache Spark
 * enabled workgroup or an Athena SQL workgroup.
 */
export const createWorkGroup: (
  input: CreateWorkGroupInput,
) => effect.Effect<
  CreateWorkGroupOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkGroupInput,
  output: CreateWorkGroupOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Exports the specified notebook and its metadata.
 */
export const exportNotebook: (
  input: ExportNotebookInput,
) => effect.Effect<
  ExportNotebookOutput,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportNotebookInput,
  output: ExportNotebookOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Describes a previously submitted calculation execution.
 */
export const getCalculationExecution: (
  input: GetCalculationExecutionRequest,
) => effect.Effect<
  GetCalculationExecutionResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCalculationExecutionRequest,
  output: GetCalculationExecutionResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Returns information about the capacity reservation with the specified name.
 */
export const getCapacityReservation: (
  input: GetCapacityReservationInput,
) => effect.Effect<
  GetCapacityReservationOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCapacityReservationInput,
  output: GetCapacityReservationOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns a database object for the specified database and data catalog.
 */
export const getDatabase: (
  input: GetDatabaseInput,
) => effect.Effect<
  GetDatabaseOutput,
  | InternalServerException
  | InvalidRequestException
  | MetadataException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDatabaseInput,
  output: GetDatabaseOutput,
  errors: [InternalServerException, InvalidRequestException, MetadataException],
}));
/**
 * Returns table metadata for the specified catalog, database, and table.
 */
export const getTableMetadata: (
  input: GetTableMetadataInput,
) => effect.Effect<
  GetTableMetadataOutput,
  | InternalServerException
  | InvalidRequestException
  | MetadataException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTableMetadataInput,
  output: GetTableMetadataOutput,
  errors: [InternalServerException, InvalidRequestException, MetadataException],
}));
/**
 * Runs the SQL query statements contained in the `Query`. Requires you to
 * have access to the workgroup in which the query ran. Running queries against an external
 * catalog requires GetDataCatalog permission to the catalog. For code
 * samples using the Amazon Web Services SDK for Java, see Examples and
 * Code Samples in the Amazon Athena User
 * Guide.
 */
export const startQueryExecution: (
  input: StartQueryExecutionInput,
) => effect.Effect<
  StartQueryExecutionOutput,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartQueryExecutionInput,
  output: StartQueryExecutionOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Returns the supported DPU sizes for the supported application runtimes (for example,
 * `Athena notebook version 1`).
 */
export const listApplicationDPUSizes: {
  (
    input: ListApplicationDPUSizesInput,
  ): effect.Effect<
    ListApplicationDPUSizesOutput,
    | InternalServerException
    | InvalidRequestException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationDPUSizesInput,
  ) => stream.Stream<
    ListApplicationDPUSizesOutput,
    | InternalServerException
    | InvalidRequestException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationDPUSizesInput,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | InvalidRequestException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationDPUSizesInput,
  output: ListApplicationDPUSizesOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Displays the notebook files for the specified workgroup in paginated format.
 */
export const listNotebookMetadata: (
  input: ListNotebookMetadataInput,
) => effect.Effect<
  ListNotebookMetadataOutput,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNotebookMetadataInput,
  output: ListNotebookMetadataOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Creates an empty `ipynb` file in the specified Apache Spark enabled
 * workgroup. Throws an error if a file in the workgroup with the same name already
 * exists.
 */
export const createNotebook: (
  input: CreateNotebookInput,
) => effect.Effect<
  CreateNotebookOutput,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNotebookInput,
  output: CreateNotebookOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Retrieves notebook metadata for the specified notebook ID.
 */
export const getNotebookMetadata: (
  input: GetNotebookMetadataInput,
) => effect.Effect<
  GetNotebookMetadataOutput,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNotebookMetadataInput,
  output: GetNotebookMetadataOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Imports a single `ipynb` file to a Spark enabled workgroup. To import the
 * notebook, the request must specify a value for either `Payload` or
 * `NoteBookS3LocationUri`. If neither is specified or both are specified,
 * an `InvalidRequestException` occurs. The maximum file size that can be
 * imported is 10 megabytes. If an `ipynb` file with the same name already
 * exists in the workgroup, throws an error.
 */
export const importNotebook: (
  input: ImportNotebookInput,
) => effect.Effect<
  ImportNotebookOutput,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportNotebookInput,
  output: ImportNotebookOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Deletes the specified notebook.
 */
export const deleteNotebook: (
  input: DeleteNotebookInput,
) => effect.Effect<
  DeleteNotebookOutput,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNotebookInput,
  output: DeleteNotebookOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the contents of a Spark notebook.
 */
export const updateNotebook: (
  input: UpdateNotebookInput,
) => effect.Effect<
  UpdateNotebookOutput,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNotebookInput,
  output: UpdateNotebookOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Updates the metadata for a notebook.
 */
export const updateNotebookMetadata: (
  input: UpdateNotebookMetadataInput,
) => effect.Effect<
  UpdateNotebookMetadataOutput,
  | InternalServerException
  | InvalidRequestException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateNotebookMetadataInput,
  output: UpdateNotebookMetadataOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
  ],
}));
/**
 * Gets the full details of a previously created session, including the session status
 * and configuration.
 */
export const getSession: (
  input: GetSessionRequest,
) => effect.Effect<
  GetSessionResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionRequest,
  output: GetSessionResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the calculations that have been submitted to a session in descending order.
 * Newer calculations are listed first; older calculations are listed later.
 */
export const listCalculationExecutions: {
  (
    input: ListCalculationExecutionsRequest,
  ): effect.Effect<
    ListCalculationExecutionsResponse,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCalculationExecutionsRequest,
  ) => stream.Stream<
    ListCalculationExecutionsResponse,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCalculationExecutionsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCalculationExecutionsRequest,
  output: ListCalculationExecutionsResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists, in descending order, the executors that joined a session. Newer executors are
 * listed first; older executors are listed later. The result can be optionally filtered by
 * state.
 */
export const listExecutors: {
  (
    input: ListExecutorsRequest,
  ): effect.Effect<
    ListExecutorsResponse,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExecutorsRequest,
  ) => stream.Stream<
    ListExecutorsResponse,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExecutorsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExecutorsRequest,
  output: ListExecutorsResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists, in descending order, the sessions that have been created in a notebook that are
 * in an active state like `CREATING`, `CREATED`, `IDLE`
 * or `BUSY`. Newer sessions are listed first; older sessions are listed
 * later.
 */
export const listNotebookSessions: (
  input: ListNotebookSessionsRequest,
) => effect.Effect<
  ListNotebookSessionsResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListNotebookSessionsRequest,
  output: ListNotebookSessionsResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the sessions in a workgroup that are in an active state like
 * `CREATING`, `CREATED`, `IDLE`, or
 * `BUSY`. Newer sessions are listed first; older sessions are listed
 * later.
 */
export const listSessions: {
  (
    input: ListSessionsRequest,
  ): effect.Effect<
    ListSessionsResponse,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionsRequest,
  ) => stream.Stream<
    ListSessionsResponse,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSessionsRequest,
  output: ListSessionsResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Submits calculations for execution within a session. You can supply the code to run as
 * an inline code block within the request.
 *
 * The request syntax requires the StartCalculationExecutionRequest$CodeBlock parameter or the CalculationConfiguration$CodeBlock parameter, but not both. Because
 * CalculationConfiguration$CodeBlock is deprecated, use the
 * StartCalculationExecutionRequest$CodeBlock parameter
 * instead.
 */
export const startCalculationExecution: (
  input: StartCalculationExecutionRequest,
) => effect.Effect<
  StartCalculationExecutionResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCalculationExecutionRequest,
  output: StartCalculationExecutionResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets an authentication token and the URL at which the notebook can be accessed. During
 * programmatic access, `CreatePresignedNotebookUrl` must be called every 10
 * minutes to refresh the authentication token. For information about granting programmatic
 * access, see Grant
 * programmatic access.
 */
export const createPresignedNotebookUrl: (
  input: CreatePresignedNotebookUrlRequest,
) => effect.Effect<
  CreatePresignedNotebookUrlResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePresignedNotebookUrlRequest,
  output: CreatePresignedNotebookUrlResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves the unencrypted code that was executed for the calculation.
 */
export const getCalculationExecutionCode: (
  input: GetCalculationExecutionCodeRequest,
) => effect.Effect<
  GetCalculationExecutionCodeResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCalculationExecutionCodeRequest,
  output: GetCalculationExecutionCodeResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets the status of a current calculation.
 */
export const getCalculationExecutionStatus: (
  input: GetCalculationExecutionStatusRequest,
) => effect.Effect<
  GetCalculationExecutionStatusResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCalculationExecutionStatusRequest,
  output: GetCalculationExecutionStatusResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Retrieves the prepared statement with the specified name from the specified
 * workgroup.
 */
export const getPreparedStatement: (
  input: GetPreparedStatementInput,
) => effect.Effect<
  GetPreparedStatementOutput,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPreparedStatementInput,
  output: GetPreparedStatementOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets the Live UI/Persistence UI for a session.
 */
export const getResourceDashboard: (
  input: GetResourceDashboardRequest,
) => effect.Effect<
  GetResourceDashboardResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourceDashboardRequest,
  output: GetResourceDashboardResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets a connection endpoint and authentication token for a given session Id.
 */
export const getSessionEndpoint: (
  input: GetSessionEndpointRequest,
) => effect.Effect<
  GetSessionEndpointResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionEndpointRequest,
  output: GetSessionEndpointResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Gets the current status of a session.
 */
export const getSessionStatus: (
  input: GetSessionStatusRequest,
) => effect.Effect<
  GetSessionStatusResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionStatusRequest,
  output: GetSessionStatusResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the tags associated with an Athena resource.
 */
export const listTagsForResource: {
  (
    input: ListTagsForResourceInput,
  ): effect.Effect<
    ListTagsForResourceOutput,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTagsForResourceInput,
  ) => stream.Stream<
    ListTagsForResourceOutput,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTagsForResourceInput,
  ) => stream.Stream<
    Tag,
    | InternalServerException
    | InvalidRequestException
    | ResourceNotFoundException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tags",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Requests the cancellation of a calculation. A `StopCalculationExecution`
 * call on a calculation that is already in a terminal state (for example,
 * `STOPPED`, `FAILED`, or `COMPLETED`) succeeds but
 * has no effect.
 *
 * Cancelling a calculation is done on a best effort basis. If a calculation cannot
 * be cancelled, you can be charged for its completion. If you are concerned about
 * being charged for a calculation that cannot be cancelled, consider terminating the
 * session in which the calculation is running.
 */
export const stopCalculationExecution: (
  input: StopCalculationExecutionRequest,
) => effect.Effect<
  StopCalculationExecutionResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopCalculationExecutionRequest,
  output: StopCalculationExecutionResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Terminates an active session. A `TerminateSession` call on a session that
 * is already inactive (for example, in a `FAILED`, `TERMINATED` or
 * `TERMINATING` state) succeeds but has no effect. Calculations running in
 * the session when `TerminateSession` is called are forcefully stopped, but may
 * display as `FAILED` instead of `STOPPED`.
 */
export const terminateSession: (
  input: TerminateSessionRequest,
) => effect.Effect<
  TerminateSessionResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TerminateSessionRequest,
  output: TerminateSessionResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Deletes the prepared statement with the specified name from the specified
 * workgroup.
 */
export const deletePreparedStatement: (
  input: DeletePreparedStatementInput,
) => effect.Effect<
  DeletePreparedStatementOutput,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePreparedStatementInput,
  output: DeletePreparedStatementOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Adds one or more tags to an Athena resource. A tag is a label that you
 * assign to a resource. Each tag consists of a key and an optional value, both of which
 * you define. For example, you can use tags to categorize Athena workgroups,
 * data catalogs, or capacity reservations by purpose, owner, or environment. Use a
 * consistent set of tag keys to make it easier to search and filter the resources in your
 * account. For best practices, see Tagging
 * Best Practices. Tag keys can be from 1 to 128 UTF-8 Unicode characters, and
 * tag values can be from 0 to 256 UTF-8 Unicode characters. Tags can use letters and
 * numbers representable in UTF-8, and the following characters: + - = . _ : / @. Tag keys
 * and values are case-sensitive. Tag keys must be unique per resource. If you specify more
 * than one tag, separate them by commas.
 */
export const tagResource: (
  input: TagResourceInput,
) => effect.Effect<
  TagResourceOutput,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Removes one or more tags from an Athena resource.
 */
export const untagResource: (
  input: UntagResourceInput,
) => effect.Effect<
  UntagResourceOutput,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Updates a prepared statement.
 */
export const updatePreparedStatement: (
  input: UpdatePreparedStatementInput,
) => effect.Effect<
  UpdatePreparedStatementOutput,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePreparedStatementInput,
  output: UpdatePreparedStatementOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
  ],
}));
/**
 * Lists the databases in the specified data catalog.
 */
export const listDatabases: {
  (
    input: ListDatabasesInput,
  ): effect.Effect<
    ListDatabasesOutput,
    | InternalServerException
    | InvalidRequestException
    | MetadataException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDatabasesInput,
  ) => stream.Stream<
    ListDatabasesOutput,
    | InternalServerException
    | InvalidRequestException
    | MetadataException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDatabasesInput,
  ) => stream.Stream<
    Database,
    | InternalServerException
    | InvalidRequestException
    | MetadataException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDatabasesInput,
  output: ListDatabasesOutput,
  errors: [InternalServerException, InvalidRequestException, MetadataException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "DatabaseList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the metadata for the tables in the specified data catalog database.
 */
export const listTableMetadata: {
  (
    input: ListTableMetadataInput,
  ): effect.Effect<
    ListTableMetadataOutput,
    | InternalServerException
    | InvalidRequestException
    | MetadataException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTableMetadataInput,
  ) => stream.Stream<
    ListTableMetadataOutput,
    | InternalServerException
    | InvalidRequestException
    | MetadataException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTableMetadataInput,
  ) => stream.Stream<
    TableMetadata,
    | InternalServerException
    | InvalidRequestException
    | MetadataException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTableMetadataInput,
  output: ListTableMetadataOutput,
  errors: [InternalServerException, InvalidRequestException, MetadataException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TableMetadataList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the details of a single query execution or a list of up to 50 query
 * executions, which you provide as an array of query execution ID strings. Requires you to
 * have access to the workgroup in which the queries ran. To get a list of query execution
 * IDs, use ListQueryExecutionsInput$WorkGroup. Query executions differ
 * from named (saved) queries. Use BatchGetNamedQueryInput to get details
 * about named queries.
 */
export const batchGetQueryExecution: (
  input: BatchGetQueryExecutionInput,
) => effect.Effect<
  BatchGetQueryExecutionOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetQueryExecutionInput,
  output: BatchGetQueryExecutionOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Streams the results of a single query execution specified by
 * `QueryExecutionId` from the Athena query results location in
 * Amazon S3. For more information, see Working with query results, recent queries, and
 * output files in the *Amazon Athena User Guide*.
 * This request does not execute the query but returns results. Use StartQueryExecution to run a query.
 *
 * To stream query results successfully, the IAM principal with permission to call
 * `GetQueryResults` also must have permissions to the Amazon S3
 * `GetObject` action for the Athena query results location.
 *
 * IAM principals with permission to the Amazon S3
 * `GetObject` action for the query results location are able to retrieve
 * query results from Amazon S3 even if permission to the
 * `GetQueryResults` action is denied. To restrict user or role access,
 * ensure that Amazon S3 permissions to the Athena query location
 * are denied.
 */
export const getQueryResults: {
  (
    input: GetQueryResultsInput,
  ): effect.Effect<
    GetQueryResultsOutput,
    | InternalServerException
    | InvalidRequestException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetQueryResultsInput,
  ) => stream.Stream<
    GetQueryResultsOutput,
    | InternalServerException
    | InvalidRequestException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetQueryResultsInput,
  ) => stream.Stream<
    unknown,
    | InternalServerException
    | InvalidRequestException
    | TooManyRequestsException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetQueryResultsInput,
  output: GetQueryResultsOutput,
  errors: [
    InternalServerException,
    InvalidRequestException,
    TooManyRequestsException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns query execution runtime statistics related to a single execution of a query if
 * you have access to the workgroup in which the query ran. Statistics from the
 * `Timeline` section of the response object are available as soon as QueryExecutionStatus$State is in a SUCCEEDED or FAILED state. The
 * remaining non-timeline statistics in the response (like stage-level input and output row
 * count and data size) are updated asynchronously and may not be available immediately
 * after a query completes or, in some cases, may not be returned. The non-timeline
 * statistics are also not included when a query has row-level filters defined in Lake Formation.
 */
export const getQueryRuntimeStatistics: (
  input: GetQueryRuntimeStatisticsInput,
) => effect.Effect<
  GetQueryRuntimeStatisticsOutput,
  InternalServerException | InvalidRequestException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueryRuntimeStatisticsInput,
  output: GetQueryRuntimeStatisticsOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Creates a session for running calculations within a workgroup. The session is ready
 * when it reaches an `IDLE` state.
 */
export const startSession: (
  input: StartSessionRequest,
) => effect.Effect<
  StartSessionResponse,
  | InternalServerException
  | InvalidRequestException
  | ResourceNotFoundException
  | SessionAlreadyExistsException
  | TooManyRequestsException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartSessionRequest,
  output: StartSessionResponse,
  errors: [
    InternalServerException,
    InvalidRequestException,
    ResourceNotFoundException,
    SessionAlreadyExistsException,
    TooManyRequestsException,
  ],
}));
