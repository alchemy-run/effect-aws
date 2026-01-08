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
  sdkId: "BCM Data Exports",
  serviceShapeName: "AWSBillingAndCostManagementDataExports",
});
const auth = T.AwsAuthSigv4({ name: "bcm-data-exports" });
const ver = T.ServiceVersion("2023-11-26");
const proto = T.AwsProtocolsAwsJson1_1();
const rules = T.EndpointResolver((p, _) => {
  const { Region, UseFIPS = false, Endpoint } = p;
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
    return e(Endpoint);
  }
  if (Region != null) {
    {
      const PartitionResult = _.partition(Region);
      if (PartitionResult != null && PartitionResult !== false) {
        if (_.getAttr(PartitionResult, "name") === "aws") {
          if (UseFIPS === true) {
            if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
              return e(`https://bcm-data-exports-fips.${Region}.api.aws`);
            }
            return err(
              "FIPS is enabled but this partition does not support FIPS",
            );
          }
          return e(
            "https://bcm-data-exports.us-east-1.api.aws",
            {
              authSchemes: [
                {
                  name: "sigv4",
                  signingName: "bcm-data-exports",
                  signingRegion: "us-east-1",
                },
              ],
            },
            {},
          );
        }
        if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
          if (UseFIPS === true) {
            if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
              return e(
                `https://bcm-data-exports-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
              );
            }
            return err(
              "FIPS is enabled but this partition does not support FIPS",
            );
          }
          return e(
            `https://bcm-data-exports.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://bcm-data-exports-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        return e(
          `https://bcm-data-exports.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type Arn = string;
export type GenericString = string;
export type TableName = string;
export type MaxResults = number;
export type NextPageToken = string;
export type ResourceTagKey = string;
export type ExportName = string;
export type ResourceTagValue = string;
export type TableProperty = string;
export type QueryStatement = string;

//# Schemas
export type ResourceTagKeyList = string[];
export const ResourceTagKeyList = S.Array(S.String);
export interface DeleteExportRequest {
  ExportArn: string;
}
export const DeleteExportRequest = S.suspend(() =>
  S.Struct({ ExportArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteExportRequest",
}) as any as S.Schema<DeleteExportRequest>;
export interface GetExecutionRequest {
  ExportArn: string;
  ExecutionId: string;
}
export const GetExecutionRequest = S.suspend(() =>
  S.Struct({ ExportArn: S.String, ExecutionId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetExecutionRequest",
}) as any as S.Schema<GetExecutionRequest>;
export interface GetExportRequest {
  ExportArn: string;
}
export const GetExportRequest = S.suspend(() =>
  S.Struct({ ExportArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetExportRequest",
}) as any as S.Schema<GetExportRequest>;
export interface ListExecutionsRequest {
  ExportArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListExecutionsRequest = S.suspend(() =>
  S.Struct({
    ExportArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListExecutionsRequest",
}) as any as S.Schema<ListExecutionsRequest>;
export interface ListExportsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListExportsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListExportsRequest",
}) as any as S.Schema<ListExportsRequest>;
export interface ListTablesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListTablesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTablesRequest",
}) as any as S.Schema<ListTablesRequest>;
export interface ListTagsForResourceRequest {
  ResourceArn: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface ResourceTag {
  Key: string;
  Value: string;
}
export const ResourceTag = S.suspend(() =>
  S.Struct({ Key: S.String, Value: S.String }),
).annotations({ identifier: "ResourceTag" }) as any as S.Schema<ResourceTag>;
export type ResourceTagList = ResourceTag[];
export const ResourceTagList = S.Array(ResourceTag);
export interface TagResourceRequest {
  ResourceArn: string;
  ResourceTags: ResourceTagList;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, ResourceTags: ResourceTagList }).pipe(
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
  ResourceArn: string;
  ResourceTagKeys: ResourceTagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, ResourceTagKeys: ResourceTagKeyList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export type TableProperties = { [key: string]: string };
export const TableProperties = S.Record({ key: S.String, value: S.String });
export type TableConfigurations = { [key: string]: TableProperties };
export const TableConfigurations = S.Record({
  key: S.String,
  value: TableProperties,
});
export interface DataQuery {
  QueryStatement: string;
  TableConfigurations?: TableConfigurations;
}
export const DataQuery = S.suspend(() =>
  S.Struct({
    QueryStatement: S.String,
    TableConfigurations: S.optional(TableConfigurations),
  }),
).annotations({ identifier: "DataQuery" }) as any as S.Schema<DataQuery>;
export interface S3OutputConfigurations {
  OutputType: string;
  Format: string;
  Compression: string;
  Overwrite: string;
}
export const S3OutputConfigurations = S.suspend(() =>
  S.Struct({
    OutputType: S.String,
    Format: S.String,
    Compression: S.String,
    Overwrite: S.String,
  }),
).annotations({
  identifier: "S3OutputConfigurations",
}) as any as S.Schema<S3OutputConfigurations>;
export interface S3Destination {
  S3Bucket: string;
  S3Prefix: string;
  S3Region: string;
  S3OutputConfigurations: S3OutputConfigurations;
}
export const S3Destination = S.suspend(() =>
  S.Struct({
    S3Bucket: S.String,
    S3Prefix: S.String,
    S3Region: S.String,
    S3OutputConfigurations: S3OutputConfigurations,
  }),
).annotations({
  identifier: "S3Destination",
}) as any as S.Schema<S3Destination>;
export interface DestinationConfigurations {
  S3Destination: S3Destination;
}
export const DestinationConfigurations = S.suspend(() =>
  S.Struct({ S3Destination: S3Destination }),
).annotations({
  identifier: "DestinationConfigurations",
}) as any as S.Schema<DestinationConfigurations>;
export interface RefreshCadence {
  Frequency: string;
}
export const RefreshCadence = S.suspend(() =>
  S.Struct({ Frequency: S.String }),
).annotations({
  identifier: "RefreshCadence",
}) as any as S.Schema<RefreshCadence>;
export interface Export {
  ExportArn?: string;
  Name: string;
  Description?: string;
  DataQuery: DataQuery;
  DestinationConfigurations: DestinationConfigurations;
  RefreshCadence: RefreshCadence;
}
export const Export = S.suspend(() =>
  S.Struct({
    ExportArn: S.optional(S.String),
    Name: S.String,
    Description: S.optional(S.String),
    DataQuery: DataQuery,
    DestinationConfigurations: DestinationConfigurations,
    RefreshCadence: RefreshCadence,
  }),
).annotations({ identifier: "Export" }) as any as S.Schema<Export>;
export interface UpdateExportRequest {
  ExportArn: string;
  Export: Export;
}
export const UpdateExportRequest = S.suspend(() =>
  S.Struct({ ExportArn: S.String, Export: Export }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateExportRequest",
}) as any as S.Schema<UpdateExportRequest>;
export interface DeleteExportResponse {
  ExportArn?: string;
}
export const DeleteExportResponse = S.suspend(() =>
  S.Struct({ ExportArn: S.optional(S.String) }),
).annotations({
  identifier: "DeleteExportResponse",
}) as any as S.Schema<DeleteExportResponse>;
export interface GetTableRequest {
  TableName: string;
  TableProperties?: TableProperties;
}
export const GetTableRequest = S.suspend(() =>
  S.Struct({
    TableName: S.String,
    TableProperties: S.optional(TableProperties),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTableRequest",
}) as any as S.Schema<GetTableRequest>;
export interface ListTagsForResourceResponse {
  ResourceTags?: ResourceTagList;
  NextToken?: string;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({
    ResourceTags: S.optional(ResourceTagList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface UpdateExportResponse {
  ExportArn?: string;
}
export const UpdateExportResponse = S.suspend(() =>
  S.Struct({ ExportArn: S.optional(S.String) }),
).annotations({
  identifier: "UpdateExportResponse",
}) as any as S.Schema<UpdateExportResponse>;
export interface ExecutionStatus {
  StatusCode?: string;
  StatusReason?: string;
  CreatedAt?: Date;
  CompletedAt?: Date;
  LastUpdatedAt?: Date;
}
export const ExecutionStatus = S.suspend(() =>
  S.Struct({
    StatusCode: S.optional(S.String),
    StatusReason: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    CompletedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "ExecutionStatus",
}) as any as S.Schema<ExecutionStatus>;
export interface ExportStatus {
  StatusCode?: string;
  StatusReason?: string;
  CreatedAt?: Date;
  LastUpdatedAt?: Date;
  LastRefreshedAt?: Date;
}
export const ExportStatus = S.suspend(() =>
  S.Struct({
    StatusCode: S.optional(S.String),
    StatusReason: S.optional(S.String),
    CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    LastRefreshedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "ExportStatus" }) as any as S.Schema<ExportStatus>;
export interface ExecutionReference {
  ExecutionId: string;
  ExecutionStatus: ExecutionStatus;
}
export const ExecutionReference = S.suspend(() =>
  S.Struct({ ExecutionId: S.String, ExecutionStatus: ExecutionStatus }),
).annotations({
  identifier: "ExecutionReference",
}) as any as S.Schema<ExecutionReference>;
export type ExecutionReferenceList = ExecutionReference[];
export const ExecutionReferenceList = S.Array(ExecutionReference);
export interface ExportReference {
  ExportArn: string;
  ExportName: string;
  ExportStatus: ExportStatus;
}
export const ExportReference = S.suspend(() =>
  S.Struct({
    ExportArn: S.String,
    ExportName: S.String,
    ExportStatus: ExportStatus,
  }),
).annotations({
  identifier: "ExportReference",
}) as any as S.Schema<ExportReference>;
export type ExportReferenceList = ExportReference[];
export const ExportReferenceList = S.Array(ExportReference);
export type GenericStringList = string[];
export const GenericStringList = S.Array(S.String);
export interface GetExecutionResponse {
  ExecutionId?: string;
  Export?: Export;
  ExecutionStatus?: ExecutionStatus;
}
export const GetExecutionResponse = S.suspend(() =>
  S.Struct({
    ExecutionId: S.optional(S.String),
    Export: S.optional(Export),
    ExecutionStatus: S.optional(ExecutionStatus),
  }),
).annotations({
  identifier: "GetExecutionResponse",
}) as any as S.Schema<GetExecutionResponse>;
export interface GetExportResponse {
  Export?: Export;
  ExportStatus?: ExportStatus;
}
export const GetExportResponse = S.suspend(() =>
  S.Struct({
    Export: S.optional(Export),
    ExportStatus: S.optional(ExportStatus),
  }),
).annotations({
  identifier: "GetExportResponse",
}) as any as S.Schema<GetExportResponse>;
export interface ListExecutionsResponse {
  Executions?: ExecutionReferenceList;
  NextToken?: string;
}
export const ListExecutionsResponse = S.suspend(() =>
  S.Struct({
    Executions: S.optional(ExecutionReferenceList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExecutionsResponse",
}) as any as S.Schema<ListExecutionsResponse>;
export interface ListExportsResponse {
  Exports?: ExportReferenceList;
  NextToken?: string;
}
export const ListExportsResponse = S.suspend(() =>
  S.Struct({
    Exports: S.optional(ExportReferenceList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExportsResponse",
}) as any as S.Schema<ListExportsResponse>;
export interface TablePropertyDescription {
  Name?: string;
  ValidValues?: GenericStringList;
  DefaultValue?: string;
  Description?: string;
}
export const TablePropertyDescription = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    ValidValues: S.optional(GenericStringList),
    DefaultValue: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({
  identifier: "TablePropertyDescription",
}) as any as S.Schema<TablePropertyDescription>;
export type TablePropertyDescriptionList = TablePropertyDescription[];
export const TablePropertyDescriptionList = S.Array(TablePropertyDescription);
export interface Column {
  Name?: string;
  Type?: string;
  Description?: string;
}
export const Column = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Type: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "Column" }) as any as S.Schema<Column>;
export type ColumnList = Column[];
export const ColumnList = S.Array(Column);
export interface Table {
  TableName?: string;
  Description?: string;
  TableProperties?: TablePropertyDescriptionList;
}
export const Table = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    Description: S.optional(S.String),
    TableProperties: S.optional(TablePropertyDescriptionList),
  }),
).annotations({ identifier: "Table" }) as any as S.Schema<Table>;
export type TableList = Table[];
export const TableList = S.Array(Table);
export interface GetTableResponse {
  TableName?: string;
  Description?: string;
  TableProperties?: TableProperties;
  Schema?: ColumnList;
}
export const GetTableResponse = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    Description: S.optional(S.String),
    TableProperties: S.optional(TableProperties),
    Schema: S.optional(ColumnList),
  }),
).annotations({
  identifier: "GetTableResponse",
}) as any as S.Schema<GetTableResponse>;
export interface ListTablesResponse {
  Tables?: TableList;
  NextToken?: string;
}
export const ListTablesResponse = S.suspend(() =>
  S.Struct({ Tables: S.optional(TableList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListTablesResponse",
}) as any as S.Schema<ListTablesResponse>;
export interface CreateExportRequest {
  Export: Export;
  ResourceTags?: ResourceTagList;
}
export const CreateExportRequest = S.suspend(() =>
  S.Struct({ Export: Export, ResourceTags: S.optional(ResourceTagList) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateExportRequest",
}) as any as S.Schema<CreateExportRequest>;
export interface ValidationExceptionField {
  Name: string;
  Message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ Name: S.String, Message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export interface CreateExportResponse {
  ExportArn?: string;
}
export const CreateExportResponse = S.suspend(() =>
  S.Struct({ ExportArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateExportResponse",
}) as any as S.Schema<CreateExportResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
  },
).pipe(C.withThrottlingError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.optional(S.String),
    Fields: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    QuotaCode: S.String,
    ServiceCode: S.String,
  },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Lists all data export definitions.
 */
export const listExports: {
  (
    input: ListExportsRequest,
  ): Effect.Effect<
    ListExportsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExportsRequest,
  ) => Stream.Stream<
    ListExportsResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExportsRequest,
  ) => Stream.Stream<
    ExportReference,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExportsRequest,
  output: ListExportsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Exports",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all available tables in data exports.
 */
export const listTables: {
  (
    input: ListTablesRequest,
  ): Effect.Effect<
    ListTablesResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTablesRequest,
  ) => Stream.Stream<
    ListTablesResponse,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTablesRequest,
  ) => Stream.Stream<
    Table,
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTablesRequest,
  output: ListTablesResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Tables",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Adds tags for an existing data export definition.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing data export by overwriting all export parameters. All export
 * parameters must be provided in the UpdateExport request.
 */
export const updateExport: (
  input: UpdateExportRequest,
) => Effect.Effect<
  UpdateExportResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateExportRequest,
  output: UpdateExportResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes tags associated with an existing data export definition.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing data export.
 */
export const deleteExport: (
  input: DeleteExportRequest,
) => Effect.Effect<
  DeleteExportResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteExportRequest,
  output: DeleteExportResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * List tags associated with an existing data export.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Exports data based on the source data update.
 */
export const getExecution: (
  input: GetExecutionRequest,
) => Effect.Effect<
  GetExecutionResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExecutionRequest,
  output: GetExecutionResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Views the definition of an existing data export.
 */
export const getExport: (
  input: GetExportRequest,
) => Effect.Effect<
  GetExportResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetExportRequest,
  output: GetExportResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Lists the historical executions for the export.
 */
export const listExecutions: {
  (
    input: ListExecutionsRequest,
  ): Effect.Effect<
    ListExecutionsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExecutionsRequest,
  ) => Stream.Stream<
    ListExecutionsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExecutionsRequest,
  ) => Stream.Stream<
    ExecutionReference,
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListExecutionsRequest,
  output: ListExecutionsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Executions",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the metadata for the specified table and table properties. This includes the list
 * of columns in the table schema, their data types, and column descriptions.
 */
export const getTable: (
  input: GetTableRequest,
) => Effect.Effect<
  GetTableResponse,
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTableRequest,
  output: GetTableResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Creates a data export and specifies the data query, the delivery preference, and any
 * optional resource tags.
 *
 * A `DataQuery` consists of both a `QueryStatement` and
 * `TableConfigurations`.
 *
 * The `QueryStatement` is an SQL statement. Data Exports only supports a limited
 * subset of the SQL syntax. For more information on the SQL syntax that is supported, see Data query. To
 * view the available tables and columns, see the Data Exports table
 * dictionary.
 *
 * The `TableConfigurations` is a collection of specified
 * `TableProperties` for the table being queried in the `QueryStatement`.
 * TableProperties are additional configurations you can provide to change the data and schema of
 * a table. Each table can have different TableProperties. However, tables are not required to
 * have any TableProperties. Each table property has a default value that it assumes if not
 * specified. For more information on table configurations, see Data query. To
 * view the table properties available for each table, see the Data Exports table
 * dictionary or use the `ListTables` API to get a response of all tables
 * and their available properties.
 */
export const createExport: (
  input: CreateExportRequest,
) => Effect.Effect<
  CreateExportResponse,
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExportRequest,
  output: CreateExportResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
