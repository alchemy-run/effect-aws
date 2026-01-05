import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "BCM Data Exports",
  serviceShapeName: "AWSBillingAndCostManagementDataExports",
});
const auth = T.AwsAuthSigv4({ name: "bcm-data-exports" });
const ver = T.ServiceVersion("2023-11-26");
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
                {
                  fn: "stringEquals",
                  argv: [
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "name"],
                    },
                    "aws",
                  ],
                },
              ],
              rules: [
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://bcm-data-exports-fips.{Region}.api.aws",
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
                  conditions: [],
                  endpoint: {
                    url: "https://bcm-data-exports.us-east-1.api.aws",
                    properties: {
                      authSchemes: [
                        {
                          name: "sigv4",
                          signingName: "bcm-data-exports",
                          signingRegion: "us-east-1",
                        },
                      ],
                    },
                    headers: {},
                  },
                  type: "endpoint",
                },
              ],
              type: "tree",
            },
            {
              conditions: [
                {
                  fn: "booleanEquals",
                  argv: [
                    true,
                    {
                      fn: "getAttr",
                      argv: [{ ref: "PartitionResult" }, "supportsDualStack"],
                    },
                  ],
                },
              ],
              rules: [
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          endpoint: {
                            url: "https://bcm-data-exports-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                  conditions: [],
                  endpoint: {
                    url: "https://bcm-data-exports.{Region}.{PartitionResult#dualStackDnsSuffix}",
                    properties: {},
                    headers: {},
                  },
                  type: "endpoint",
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
                        url: "https://bcm-data-exports-fips.{Region}.{PartitionResult#dnsSuffix}",
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
              conditions: [],
              endpoint: {
                url: "https://bcm-data-exports.{Region}.{PartitionResult#dnsSuffix}",
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
export const ResourceTagKeyList = S.Array(S.String);
export class DeleteExportRequest extends S.Class<DeleteExportRequest>(
  "DeleteExportRequest",
)(
  { ExportArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetExecutionRequest extends S.Class<GetExecutionRequest>(
  "GetExecutionRequest",
)(
  { ExportArn: S.String, ExecutionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetExportRequest extends S.Class<GetExportRequest>(
  "GetExportRequest",
)(
  { ExportArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListExecutionsRequest extends S.Class<ListExecutionsRequest>(
  "ListExecutionsRequest",
)(
  {
    ExportArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListExportsRequest extends S.Class<ListExportsRequest>(
  "ListExportsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTablesRequest extends S.Class<ListTablesRequest>(
  "ListTablesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  {
    ResourceArn: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResourceTag extends S.Class<ResourceTag>("ResourceTag")({
  Key: S.String,
  Value: S.String,
}) {}
export const ResourceTagList = S.Array(ResourceTag);
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, ResourceTags: ResourceTagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, ResourceTagKeys: ResourceTagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export const TableProperties = S.Record({ key: S.String, value: S.String });
export const TableConfigurations = S.Record({
  key: S.String,
  value: TableProperties,
});
export class DataQuery extends S.Class<DataQuery>("DataQuery")({
  QueryStatement: S.String,
  TableConfigurations: S.optional(TableConfigurations),
}) {}
export class S3OutputConfigurations extends S.Class<S3OutputConfigurations>(
  "S3OutputConfigurations",
)({
  OutputType: S.String,
  Format: S.String,
  Compression: S.String,
  Overwrite: S.String,
}) {}
export class S3Destination extends S.Class<S3Destination>("S3Destination")({
  S3Bucket: S.String,
  S3Prefix: S.String,
  S3Region: S.String,
  S3OutputConfigurations: S3OutputConfigurations,
}) {}
export class DestinationConfigurations extends S.Class<DestinationConfigurations>(
  "DestinationConfigurations",
)({ S3Destination: S3Destination }) {}
export class RefreshCadence extends S.Class<RefreshCadence>("RefreshCadence")({
  Frequency: S.String,
}) {}
export class Export extends S.Class<Export>("Export")({
  ExportArn: S.optional(S.String),
  Name: S.String,
  Description: S.optional(S.String),
  DataQuery: DataQuery,
  DestinationConfigurations: DestinationConfigurations,
  RefreshCadence: RefreshCadence,
}) {}
export class UpdateExportRequest extends S.Class<UpdateExportRequest>(
  "UpdateExportRequest",
)(
  { ExportArn: S.String, Export: Export },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteExportResponse extends S.Class<DeleteExportResponse>(
  "DeleteExportResponse",
)({ ExportArn: S.optional(S.String) }) {}
export class GetTableRequest extends S.Class<GetTableRequest>(
  "GetTableRequest",
)(
  { TableName: S.String, TableProperties: S.optional(TableProperties) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({
  ResourceTags: S.optional(ResourceTagList),
  NextToken: S.optional(S.String),
}) {}
export class UpdateExportResponse extends S.Class<UpdateExportResponse>(
  "UpdateExportResponse",
)({ ExportArn: S.optional(S.String) }) {}
export class ExecutionStatus extends S.Class<ExecutionStatus>(
  "ExecutionStatus",
)({
  StatusCode: S.optional(S.String),
  StatusReason: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  CompletedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ExportStatus extends S.Class<ExportStatus>("ExportStatus")({
  StatusCode: S.optional(S.String),
  StatusReason: S.optional(S.String),
  CreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  LastRefreshedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class ExecutionReference extends S.Class<ExecutionReference>(
  "ExecutionReference",
)({ ExecutionId: S.String, ExecutionStatus: ExecutionStatus }) {}
export const ExecutionReferenceList = S.Array(ExecutionReference);
export class ExportReference extends S.Class<ExportReference>(
  "ExportReference",
)({ ExportArn: S.String, ExportName: S.String, ExportStatus: ExportStatus }) {}
export const ExportReferenceList = S.Array(ExportReference);
export const GenericStringList = S.Array(S.String);
export class GetExecutionResponse extends S.Class<GetExecutionResponse>(
  "GetExecutionResponse",
)({
  ExecutionId: S.optional(S.String),
  Export: S.optional(Export),
  ExecutionStatus: S.optional(ExecutionStatus),
}) {}
export class GetExportResponse extends S.Class<GetExportResponse>(
  "GetExportResponse",
)({ Export: S.optional(Export), ExportStatus: S.optional(ExportStatus) }) {}
export class ListExecutionsResponse extends S.Class<ListExecutionsResponse>(
  "ListExecutionsResponse",
)({
  Executions: S.optional(ExecutionReferenceList),
  NextToken: S.optional(S.String),
}) {}
export class ListExportsResponse extends S.Class<ListExportsResponse>(
  "ListExportsResponse",
)({
  Exports: S.optional(ExportReferenceList),
  NextToken: S.optional(S.String),
}) {}
export class TablePropertyDescription extends S.Class<TablePropertyDescription>(
  "TablePropertyDescription",
)({
  Name: S.optional(S.String),
  ValidValues: S.optional(GenericStringList),
  DefaultValue: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const TablePropertyDescriptionList = S.Array(TablePropertyDescription);
export class Column extends S.Class<Column>("Column")({
  Name: S.optional(S.String),
  Type: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export const ColumnList = S.Array(Column);
export class Table extends S.Class<Table>("Table")({
  TableName: S.optional(S.String),
  Description: S.optional(S.String),
  TableProperties: S.optional(TablePropertyDescriptionList),
}) {}
export const TableList = S.Array(Table);
export class GetTableResponse extends S.Class<GetTableResponse>(
  "GetTableResponse",
)({
  TableName: S.optional(S.String),
  Description: S.optional(S.String),
  TableProperties: S.optional(TableProperties),
  Schema: S.optional(ColumnList),
}) {}
export class ListTablesResponse extends S.Class<ListTablesResponse>(
  "ListTablesResponse",
)({ Tables: S.optional(TableList), NextToken: S.optional(S.String) }) {}
export class CreateExportRequest extends S.Class<CreateExportRequest>(
  "CreateExportRequest",
)(
  { Export: Export, ResourceTags: S.optional(ResourceTagList) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ Name: S.String, Message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);
export class CreateExportResponse extends S.Class<CreateExportResponse>(
  "CreateExportResponse",
)({ ExportArn: S.optional(S.String) }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.String, ResourceId: S.String, ResourceType: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    Message: S.String,
    QuotaCode: S.optional(S.String),
    ServiceCode: S.optional(S.String),
  },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    Message: S.String,
    Reason: S.optional(S.String),
    Fields: S.optional(ValidationExceptionFieldList),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    Message: S.String,
    ResourceId: S.optional(S.String),
    ResourceType: S.optional(S.String),
    QuotaCode: S.String,
    ServiceCode: S.String,
  },
) {}

//# Operations
/**
 * Lists all data export definitions.
 */
export const listExports = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExportsRequest,
  output: ListExportsResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Lists all available tables in data exports.
 */
export const listTables = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTablesRequest,
  output: ListTablesResponse,
  errors: [InternalServerException, ThrottlingException, ValidationException],
}));
/**
 * Adds tags for an existing data export definition.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listExecutions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListExecutionsRequest,
  output: ListExecutionsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns the metadata for the specified table and table properties. This includes the list
 * of columns in the table schema, their data types, and column descriptions.
 */
export const getTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createExport = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateExportRequest,
  output: CreateExportResponse,
  errors: [
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
