import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Athena",
  serviceShapeName: "AmazonAthena",
});
const auth = T.AwsAuthSigv4({ name: "athena" });
const ver = T.ServiceVersion("2017-05-18");
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
                        url: "https://athena-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://athena-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://athena.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://athena.{Region}.{PartitionResult#dnsSuffix}",
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
export const NamedQueryIdList = S.Array(S.String);
export const PreparedStatementNameList = S.Array(S.String);
export const QueryExecutionIdList = S.Array(S.String);
export const ExecutionParameters = S.Array(S.String);
export const TagKeyList = S.Array(S.String);
export class BatchGetNamedQueryInput extends S.Class<BatchGetNamedQueryInput>(
  "BatchGetNamedQueryInput",
)(
  { NamedQueryIds: NamedQueryIdList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetPreparedStatementInput extends S.Class<BatchGetPreparedStatementInput>(
  "BatchGetPreparedStatementInput",
)(
  { PreparedStatementNames: PreparedStatementNameList, WorkGroup: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetQueryExecutionInput extends S.Class<BatchGetQueryExecutionInput>(
  "BatchGetQueryExecutionInput",
)(
  { QueryExecutionIds: QueryExecutionIdList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelCapacityReservationInput extends S.Class<CancelCapacityReservationInput>(
  "CancelCapacityReservationInput",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelCapacityReservationOutput extends S.Class<CancelCapacityReservationOutput>(
  "CancelCapacityReservationOutput",
)({}) {}
export class CreateNamedQueryInput extends S.Class<CreateNamedQueryInput>(
  "CreateNamedQueryInput",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    Database: S.String,
    QueryString: S.String,
    ClientRequestToken: S.optional(S.String),
    WorkGroup: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateNotebookInput extends S.Class<CreateNotebookInput>(
  "CreateNotebookInput",
)(
  {
    WorkGroup: S.String,
    Name: S.String,
    ClientRequestToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePreparedStatementInput extends S.Class<CreatePreparedStatementInput>(
  "CreatePreparedStatementInput",
)(
  {
    StatementName: S.String,
    WorkGroup: S.String,
    QueryStatement: S.String,
    Description: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePreparedStatementOutput extends S.Class<CreatePreparedStatementOutput>(
  "CreatePreparedStatementOutput",
)({}) {}
export class CreatePresignedNotebookUrlRequest extends S.Class<CreatePresignedNotebookUrlRequest>(
  "CreatePresignedNotebookUrlRequest",
)(
  { SessionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCapacityReservationInput extends S.Class<DeleteCapacityReservationInput>(
  "DeleteCapacityReservationInput",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCapacityReservationOutput extends S.Class<DeleteCapacityReservationOutput>(
  "DeleteCapacityReservationOutput",
)({}) {}
export class DeleteDataCatalogInput extends S.Class<DeleteDataCatalogInput>(
  "DeleteDataCatalogInput",
)(
  { Name: S.String, DeleteCatalogOnly: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNamedQueryInput extends S.Class<DeleteNamedQueryInput>(
  "DeleteNamedQueryInput",
)(
  { NamedQueryId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNamedQueryOutput extends S.Class<DeleteNamedQueryOutput>(
  "DeleteNamedQueryOutput",
)({}) {}
export class DeleteNotebookInput extends S.Class<DeleteNotebookInput>(
  "DeleteNotebookInput",
)(
  { NotebookId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteNotebookOutput extends S.Class<DeleteNotebookOutput>(
  "DeleteNotebookOutput",
)({}) {}
export class DeletePreparedStatementInput extends S.Class<DeletePreparedStatementInput>(
  "DeletePreparedStatementInput",
)(
  { StatementName: S.String, WorkGroup: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePreparedStatementOutput extends S.Class<DeletePreparedStatementOutput>(
  "DeletePreparedStatementOutput",
)({}) {}
export class DeleteWorkGroupInput extends S.Class<DeleteWorkGroupInput>(
  "DeleteWorkGroupInput",
)(
  { WorkGroup: S.String, RecursiveDeleteOption: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteWorkGroupOutput extends S.Class<DeleteWorkGroupOutput>(
  "DeleteWorkGroupOutput",
)({}) {}
export class ExportNotebookInput extends S.Class<ExportNotebookInput>(
  "ExportNotebookInput",
)(
  { NotebookId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCalculationExecutionRequest extends S.Class<GetCalculationExecutionRequest>(
  "GetCalculationExecutionRequest",
)(
  { CalculationExecutionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCalculationExecutionCodeRequest extends S.Class<GetCalculationExecutionCodeRequest>(
  "GetCalculationExecutionCodeRequest",
)(
  { CalculationExecutionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCalculationExecutionStatusRequest extends S.Class<GetCalculationExecutionStatusRequest>(
  "GetCalculationExecutionStatusRequest",
)(
  { CalculationExecutionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCapacityAssignmentConfigurationInput extends S.Class<GetCapacityAssignmentConfigurationInput>(
  "GetCapacityAssignmentConfigurationInput",
)(
  { CapacityReservationName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCapacityReservationInput extends S.Class<GetCapacityReservationInput>(
  "GetCapacityReservationInput",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDatabaseInput extends S.Class<GetDatabaseInput>(
  "GetDatabaseInput",
)(
  {
    CatalogName: S.String,
    DatabaseName: S.String,
    WorkGroup: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDataCatalogInput extends S.Class<GetDataCatalogInput>(
  "GetDataCatalogInput",
)(
  { Name: S.String, WorkGroup: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetNamedQueryInput extends S.Class<GetNamedQueryInput>(
  "GetNamedQueryInput",
)(
  { NamedQueryId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetNotebookMetadataInput extends S.Class<GetNotebookMetadataInput>(
  "GetNotebookMetadataInput",
)(
  { NotebookId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPreparedStatementInput extends S.Class<GetPreparedStatementInput>(
  "GetPreparedStatementInput",
)(
  { StatementName: S.String, WorkGroup: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetQueryExecutionInput extends S.Class<GetQueryExecutionInput>(
  "GetQueryExecutionInput",
)(
  { QueryExecutionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetQueryResultsInput extends S.Class<GetQueryResultsInput>(
  "GetQueryResultsInput",
)(
  {
    QueryExecutionId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    QueryResultType: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetQueryRuntimeStatisticsInput extends S.Class<GetQueryRuntimeStatisticsInput>(
  "GetQueryRuntimeStatisticsInput",
)(
  { QueryExecutionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourceDashboardRequest extends S.Class<GetResourceDashboardRequest>(
  "GetResourceDashboardRequest",
)(
  { ResourceARN: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSessionRequest extends S.Class<GetSessionRequest>(
  "GetSessionRequest",
)(
  { SessionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSessionEndpointRequest extends S.Class<GetSessionEndpointRequest>(
  "GetSessionEndpointRequest",
)(
  { SessionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSessionStatusRequest extends S.Class<GetSessionStatusRequest>(
  "GetSessionStatusRequest",
)(
  { SessionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTableMetadataInput extends S.Class<GetTableMetadataInput>(
  "GetTableMetadataInput",
)(
  {
    CatalogName: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    WorkGroup: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetWorkGroupInput extends S.Class<GetWorkGroupInput>(
  "GetWorkGroupInput",
)(
  { WorkGroup: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportNotebookInput extends S.Class<ImportNotebookInput>(
  "ImportNotebookInput",
)(
  {
    WorkGroup: S.String,
    Name: S.String,
    Payload: S.optional(S.String),
    Type: S.String,
    NotebookS3LocationUri: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListApplicationDPUSizesInput extends S.Class<ListApplicationDPUSizesInput>(
  "ListApplicationDPUSizesInput",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCalculationExecutionsRequest extends S.Class<ListCalculationExecutionsRequest>(
  "ListCalculationExecutionsRequest",
)(
  {
    SessionId: S.String,
    StateFilter: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCapacityReservationsInput extends S.Class<ListCapacityReservationsInput>(
  "ListCapacityReservationsInput",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDatabasesInput extends S.Class<ListDatabasesInput>(
  "ListDatabasesInput",
)(
  {
    CatalogName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkGroup: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDataCatalogsInput extends S.Class<ListDataCatalogsInput>(
  "ListDataCatalogsInput",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkGroup: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEngineVersionsInput extends S.Class<ListEngineVersionsInput>(
  "ListEngineVersionsInput",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListExecutorsRequest extends S.Class<ListExecutorsRequest>(
  "ListExecutorsRequest",
)(
  {
    SessionId: S.String,
    ExecutorStateFilter: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListNamedQueriesInput extends S.Class<ListNamedQueriesInput>(
  "ListNamedQueriesInput",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkGroup: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListNotebookSessionsRequest extends S.Class<ListNotebookSessionsRequest>(
  "ListNotebookSessionsRequest",
)(
  {
    NotebookId: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListPreparedStatementsInput extends S.Class<ListPreparedStatementsInput>(
  "ListPreparedStatementsInput",
)(
  {
    WorkGroup: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListQueryExecutionsInput extends S.Class<ListQueryExecutionsInput>(
  "ListQueryExecutionsInput",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkGroup: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSessionsRequest extends S.Class<ListSessionsRequest>(
  "ListSessionsRequest",
)(
  {
    WorkGroup: S.String,
    StateFilter: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTableMetadataInput extends S.Class<ListTableMetadataInput>(
  "ListTableMetadataInput",
)(
  {
    CatalogName: S.String,
    DatabaseName: S.String,
    Expression: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkGroup: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
)(
  {
    ResourceARN: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWorkGroupsInput extends S.Class<ListWorkGroupsInput>(
  "ListWorkGroupsInput",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopCalculationExecutionRequest extends S.Class<StopCalculationExecutionRequest>(
  "StopCalculationExecutionRequest",
)(
  { CalculationExecutionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopQueryExecutionInput extends S.Class<StopQueryExecutionInput>(
  "StopQueryExecutionInput",
)(
  { QueryExecutionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopQueryExecutionOutput extends S.Class<StopQueryExecutionOutput>(
  "StopQueryExecutionOutput",
)({}) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag);
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
)(
  { ResourceARN: S.String, Tags: TagList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceOutput extends S.Class<TagResourceOutput>(
  "TagResourceOutput",
)({}) {}
export class TerminateSessionRequest extends S.Class<TerminateSessionRequest>(
  "TerminateSessionRequest",
)(
  { SessionId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
)(
  { ResourceARN: S.String, TagKeys: TagKeyList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceOutput extends S.Class<UntagResourceOutput>(
  "UntagResourceOutput",
)({}) {}
export class UpdateCapacityReservationInput extends S.Class<UpdateCapacityReservationInput>(
  "UpdateCapacityReservationInput",
)(
  { TargetDpus: S.Number, Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCapacityReservationOutput extends S.Class<UpdateCapacityReservationOutput>(
  "UpdateCapacityReservationOutput",
)({}) {}
export const ParametersMap = S.Record({ key: S.String, value: S.String });
export class UpdateDataCatalogInput extends S.Class<UpdateDataCatalogInput>(
  "UpdateDataCatalogInput",
)(
  {
    Name: S.String,
    Type: S.String,
    Description: S.optional(S.String),
    Parameters: S.optional(ParametersMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDataCatalogOutput extends S.Class<UpdateDataCatalogOutput>(
  "UpdateDataCatalogOutput",
)({}) {}
export class UpdateNamedQueryInput extends S.Class<UpdateNamedQueryInput>(
  "UpdateNamedQueryInput",
)(
  {
    NamedQueryId: S.String,
    Name: S.String,
    Description: S.optional(S.String),
    QueryString: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateNamedQueryOutput extends S.Class<UpdateNamedQueryOutput>(
  "UpdateNamedQueryOutput",
)({}) {}
export class UpdateNotebookInput extends S.Class<UpdateNotebookInput>(
  "UpdateNotebookInput",
)(
  {
    NotebookId: S.String,
    Payload: S.String,
    Type: S.String,
    SessionId: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateNotebookOutput extends S.Class<UpdateNotebookOutput>(
  "UpdateNotebookOutput",
)({}) {}
export class UpdateNotebookMetadataInput extends S.Class<UpdateNotebookMetadataInput>(
  "UpdateNotebookMetadataInput",
)(
  {
    NotebookId: S.String,
    ClientRequestToken: S.optional(S.String),
    Name: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateNotebookMetadataOutput extends S.Class<UpdateNotebookMetadataOutput>(
  "UpdateNotebookMetadataOutput",
)({}) {}
export class UpdatePreparedStatementInput extends S.Class<UpdatePreparedStatementInput>(
  "UpdatePreparedStatementInput",
)(
  {
    StatementName: S.String,
    WorkGroup: S.String,
    QueryStatement: S.String,
    Description: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePreparedStatementOutput extends S.Class<UpdatePreparedStatementOutput>(
  "UpdatePreparedStatementOutput",
)({}) {}
export const WorkGroupNamesList = S.Array(S.String);
export class CapacityAllocation extends S.Class<CapacityAllocation>(
  "CapacityAllocation",
)({
  Status: S.String,
  StatusMessage: S.optional(S.String),
  RequestTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  RequestCompletionTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
}) {}
export class CapacityReservation extends S.Class<CapacityReservation>(
  "CapacityReservation",
)({
  Name: S.String,
  Status: S.String,
  TargetDpus: S.Number,
  AllocatedDpus: S.Number,
  LastAllocation: S.optional(CapacityAllocation),
  LastSuccessfulAllocationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CreationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const CapacityReservationsList = S.Array(CapacityReservation);
export class Database extends S.Class<Database>("Database")({
  Name: S.String,
  Description: S.optional(S.String),
  Parameters: S.optional(ParametersMap),
}) {}
export const DatabaseList = S.Array(Database);
export class EngineVersion extends S.Class<EngineVersion>("EngineVersion")({
  SelectedEngineVersion: S.optional(S.String),
  EffectiveEngineVersion: S.optional(S.String),
}) {}
export const EngineVersionsList = S.Array(EngineVersion);
export class FilterDefinition extends S.Class<FilterDefinition>(
  "FilterDefinition",
)({ Name: S.optional(S.String) }) {}
export class Column extends S.Class<Column>("Column")({
  Name: S.String,
  Type: S.optional(S.String),
  Comment: S.optional(S.String),
}) {}
export const ColumnList = S.Array(Column);
export class TableMetadata extends S.Class<TableMetadata>("TableMetadata")({
  Name: S.String,
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastAccessTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TableType: S.optional(S.String),
  Columns: S.optional(ColumnList),
  PartitionKeys: S.optional(ColumnList),
  Parameters: S.optional(ParametersMap),
}) {}
export const TableMetadataList = S.Array(TableMetadata);
export class CapacityAssignment extends S.Class<CapacityAssignment>(
  "CapacityAssignment",
)({ WorkGroupNames: S.optional(WorkGroupNamesList) }) {}
export const CapacityAssignmentsList = S.Array(CapacityAssignment);
export class CalculationConfiguration extends S.Class<CalculationConfiguration>(
  "CalculationConfiguration",
)({ CodeBlock: S.optional(S.String) }) {}
export class QueryExecutionContext extends S.Class<QueryExecutionContext>(
  "QueryExecutionContext",
)({ Database: S.optional(S.String), Catalog: S.optional(S.String) }) {}
export class CreateCapacityReservationInput extends S.Class<CreateCapacityReservationInput>(
  "CreateCapacityReservationInput",
)(
  { TargetDpus: S.Number, Name: S.String, Tags: S.optional(TagList) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCapacityReservationOutput extends S.Class<CreateCapacityReservationOutput>(
  "CreateCapacityReservationOutput",
)({}) {}
export class CreateDataCatalogInput extends S.Class<CreateDataCatalogInput>(
  "CreateDataCatalogInput",
)(
  {
    Name: S.String,
    Type: S.String,
    Description: S.optional(S.String),
    Parameters: S.optional(ParametersMap),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateNamedQueryOutput extends S.Class<CreateNamedQueryOutput>(
  "CreateNamedQueryOutput",
)({ NamedQueryId: S.optional(S.String) }) {}
export class CreateNotebookOutput extends S.Class<CreateNotebookOutput>(
  "CreateNotebookOutput",
)({ NotebookId: S.optional(S.String) }) {}
export class CreatePresignedNotebookUrlResponse extends S.Class<CreatePresignedNotebookUrlResponse>(
  "CreatePresignedNotebookUrlResponse",
)({
  NotebookUrl: S.String,
  AuthToken: S.String,
  AuthTokenExpirationTime: S.Number,
}) {}
export class GetCalculationExecutionCodeResponse extends S.Class<GetCalculationExecutionCodeResponse>(
  "GetCalculationExecutionCodeResponse",
)({ CodeBlock: S.optional(S.String) }) {}
export class CalculationStatus extends S.Class<CalculationStatus>(
  "CalculationStatus",
)({
  SubmissionDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CompletionDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  State: S.optional(S.String),
  StateChangeReason: S.optional(S.String),
}) {}
export class CalculationStatistics extends S.Class<CalculationStatistics>(
  "CalculationStatistics",
)({
  DpuExecutionInMillis: S.optional(S.Number),
  Progress: S.optional(S.String),
}) {}
export class GetCalculationExecutionStatusResponse extends S.Class<GetCalculationExecutionStatusResponse>(
  "GetCalculationExecutionStatusResponse",
)({
  Status: S.optional(CalculationStatus),
  Statistics: S.optional(CalculationStatistics),
}) {}
export class DataCatalog extends S.Class<DataCatalog>("DataCatalog")({
  Name: S.String,
  Description: S.optional(S.String),
  Type: S.String,
  Parameters: S.optional(ParametersMap),
  Status: S.optional(S.String),
  ConnectionType: S.optional(S.String),
  Error: S.optional(S.String),
}) {}
export class GetDataCatalogOutput extends S.Class<GetDataCatalogOutput>(
  "GetDataCatalogOutput",
)({ DataCatalog: S.optional(DataCatalog) }) {}
export class NamedQuery extends S.Class<NamedQuery>("NamedQuery")({
  Name: S.String,
  Description: S.optional(S.String),
  Database: S.String,
  QueryString: S.String,
  NamedQueryId: S.optional(S.String),
  WorkGroup: S.optional(S.String),
}) {}
export class GetNamedQueryOutput extends S.Class<GetNamedQueryOutput>(
  "GetNamedQueryOutput",
)({ NamedQuery: S.optional(NamedQuery) }) {}
export class NotebookMetadata extends S.Class<NotebookMetadata>(
  "NotebookMetadata",
)({
  NotebookId: S.optional(S.String),
  Name: S.optional(S.String),
  WorkGroup: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Type: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetNotebookMetadataOutput extends S.Class<GetNotebookMetadataOutput>(
  "GetNotebookMetadataOutput",
)({ NotebookMetadata: S.optional(NotebookMetadata) }) {}
export class PreparedStatement extends S.Class<PreparedStatement>(
  "PreparedStatement",
)({
  StatementName: S.optional(S.String),
  QueryStatement: S.optional(S.String),
  WorkGroupName: S.optional(S.String),
  Description: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetPreparedStatementOutput extends S.Class<GetPreparedStatementOutput>(
  "GetPreparedStatementOutput",
)({ PreparedStatement: S.optional(PreparedStatement) }) {}
export class ManagedQueryResultsEncryptionConfiguration extends S.Class<ManagedQueryResultsEncryptionConfiguration>(
  "ManagedQueryResultsEncryptionConfiguration",
)({ KmsKey: S.String }) {}
export class ManagedQueryResultsConfiguration extends S.Class<ManagedQueryResultsConfiguration>(
  "ManagedQueryResultsConfiguration",
)({
  Enabled: S.Boolean,
  EncryptionConfiguration: S.optional(
    ManagedQueryResultsEncryptionConfiguration,
  ),
}) {}
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({ EncryptionOption: S.String, KmsKey: S.optional(S.String) }) {}
export class AclConfiguration extends S.Class<AclConfiguration>(
  "AclConfiguration",
)({ S3AclOption: S.String }) {}
export class ResultConfiguration extends S.Class<ResultConfiguration>(
  "ResultConfiguration",
)({
  OutputLocation: S.optional(S.String),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
  ExpectedBucketOwner: S.optional(S.String),
  AclConfiguration: S.optional(AclConfiguration),
}) {}
export class ResultReuseByAgeConfiguration extends S.Class<ResultReuseByAgeConfiguration>(
  "ResultReuseByAgeConfiguration",
)({ Enabled: S.Boolean, MaxAgeInMinutes: S.optional(S.Number) }) {}
export class ResultReuseConfiguration extends S.Class<ResultReuseConfiguration>(
  "ResultReuseConfiguration",
)({
  ResultReuseByAgeConfiguration: S.optional(ResultReuseByAgeConfiguration),
}) {}
export class AthenaError extends S.Class<AthenaError>("AthenaError")({
  ErrorCategory: S.optional(S.Number),
  ErrorType: S.optional(S.Number),
  Retryable: S.optional(S.Boolean),
  ErrorMessage: S.optional(S.String),
}) {}
export class QueryExecutionStatus extends S.Class<QueryExecutionStatus>(
  "QueryExecutionStatus",
)({
  State: S.optional(S.String),
  StateChangeReason: S.optional(S.String),
  SubmissionDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  CompletionDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AthenaError: S.optional(AthenaError),
}) {}
export class ResultReuseInformation extends S.Class<ResultReuseInformation>(
  "ResultReuseInformation",
)({ ReusedPreviousResult: S.Boolean }) {}
export class QueryExecutionStatistics extends S.Class<QueryExecutionStatistics>(
  "QueryExecutionStatistics",
)({
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
}) {}
export class QueryResultsS3AccessGrantsConfiguration extends S.Class<QueryResultsS3AccessGrantsConfiguration>(
  "QueryResultsS3AccessGrantsConfiguration",
)({
  EnableS3AccessGrants: S.Boolean,
  CreateUserLevelPrefix: S.optional(S.Boolean),
  AuthenticationType: S.String,
}) {}
export class QueryExecution extends S.Class<QueryExecution>("QueryExecution")({
  QueryExecutionId: S.optional(S.String),
  Query: S.optional(S.String),
  StatementType: S.optional(S.String),
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
}) {}
export class GetQueryExecutionOutput extends S.Class<GetQueryExecutionOutput>(
  "GetQueryExecutionOutput",
)({ QueryExecution: S.optional(QueryExecution) }) {}
export class GetResourceDashboardResponse extends S.Class<GetResourceDashboardResponse>(
  "GetResourceDashboardResponse",
)({ Url: S.String }) {}
export class GetSessionEndpointResponse extends S.Class<GetSessionEndpointResponse>(
  "GetSessionEndpointResponse",
)({
  EndpointUrl: S.String,
  AuthToken: S.String,
  AuthTokenExpirationTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class SessionStatus extends S.Class<SessionStatus>("SessionStatus")({
  StartDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  EndDateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IdleSinceDateTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  State: S.optional(S.String),
  StateChangeReason: S.optional(S.String),
}) {}
export class GetSessionStatusResponse extends S.Class<GetSessionStatusResponse>(
  "GetSessionStatusResponse",
)({ SessionId: S.optional(S.String), Status: S.optional(SessionStatus) }) {}
export class ImportNotebookOutput extends S.Class<ImportNotebookOutput>(
  "ImportNotebookOutput",
)({ NotebookId: S.optional(S.String) }) {}
export class ListCapacityReservationsOutput extends S.Class<ListCapacityReservationsOutput>(
  "ListCapacityReservationsOutput",
)({
  NextToken: S.optional(S.String),
  CapacityReservations: CapacityReservationsList,
}) {}
export class ListDatabasesOutput extends S.Class<ListDatabasesOutput>(
  "ListDatabasesOutput",
)({
  DatabaseList: S.optional(DatabaseList),
  NextToken: S.optional(S.String),
}) {}
export class ListEngineVersionsOutput extends S.Class<ListEngineVersionsOutput>(
  "ListEngineVersionsOutput",
)({
  EngineVersions: S.optional(EngineVersionsList),
  NextToken: S.optional(S.String),
}) {}
export class ListNamedQueriesOutput extends S.Class<ListNamedQueriesOutput>(
  "ListNamedQueriesOutput",
)({
  NamedQueryIds: S.optional(NamedQueryIdList),
  NextToken: S.optional(S.String),
}) {}
export class ListNotebookMetadataInput extends S.Class<ListNotebookMetadataInput>(
  "ListNotebookMetadataInput",
)(
  {
    Filters: S.optional(FilterDefinition),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    WorkGroup: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListQueryExecutionsOutput extends S.Class<ListQueryExecutionsOutput>(
  "ListQueryExecutionsOutput",
)({
  QueryExecutionIds: S.optional(QueryExecutionIdList),
  NextToken: S.optional(S.String),
}) {}
export class ListTableMetadataOutput extends S.Class<ListTableMetadataOutput>(
  "ListTableMetadataOutput",
)({
  TableMetadataList: S.optional(TableMetadataList),
  NextToken: S.optional(S.String),
}) {}
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ Tags: S.optional(TagList), NextToken: S.optional(S.String) }) {}
export class PutCapacityAssignmentConfigurationInput extends S.Class<PutCapacityAssignmentConfigurationInput>(
  "PutCapacityAssignmentConfigurationInput",
)(
  {
    CapacityReservationName: S.String,
    CapacityAssignments: CapacityAssignmentsList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutCapacityAssignmentConfigurationOutput extends S.Class<PutCapacityAssignmentConfigurationOutput>(
  "PutCapacityAssignmentConfigurationOutput",
)({}) {}
export class StartCalculationExecutionRequest extends S.Class<StartCalculationExecutionRequest>(
  "StartCalculationExecutionRequest",
)(
  {
    SessionId: S.String,
    Description: S.optional(S.String),
    CalculationConfiguration: S.optional(CalculationConfiguration),
    CodeBlock: S.optional(S.String),
    ClientRequestToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopCalculationExecutionResponse extends S.Class<StopCalculationExecutionResponse>(
  "StopCalculationExecutionResponse",
)({ State: S.optional(S.String) }) {}
export class TerminateSessionResponse extends S.Class<TerminateSessionResponse>(
  "TerminateSessionResponse",
)({ State: S.optional(S.String) }) {}
export class CustomerContentEncryptionConfiguration extends S.Class<CustomerContentEncryptionConfiguration>(
  "CustomerContentEncryptionConfiguration",
)({ KmsKey: S.String }) {}
export class IdentityCenterConfiguration extends S.Class<IdentityCenterConfiguration>(
  "IdentityCenterConfiguration",
)({
  EnableIdentityCenter: S.optional(S.Boolean),
  IdentityCenterInstanceArn: S.optional(S.String),
}) {}
export const SupportedDPUSizeList = S.Array(S.Number);
export class Classification extends S.Class<Classification>("Classification")({
  Name: S.optional(S.String),
  Properties: S.optional(ParametersMap),
}) {}
export const ClassificationList = S.Array(Classification);
export class ManagedLoggingConfiguration extends S.Class<ManagedLoggingConfiguration>(
  "ManagedLoggingConfiguration",
)({ Enabled: S.Boolean, KmsKey: S.optional(S.String) }) {}
export class S3LoggingConfiguration extends S.Class<S3LoggingConfiguration>(
  "S3LoggingConfiguration",
)({
  Enabled: S.Boolean,
  KmsKey: S.optional(S.String),
  LogLocation: S.optional(S.String),
}) {}
export class ResultConfigurationUpdates extends S.Class<ResultConfigurationUpdates>(
  "ResultConfigurationUpdates",
)({
  OutputLocation: S.optional(S.String),
  RemoveOutputLocation: S.optional(S.Boolean),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
  RemoveEncryptionConfiguration: S.optional(S.Boolean),
  ExpectedBucketOwner: S.optional(S.String),
  RemoveExpectedBucketOwner: S.optional(S.Boolean),
  AclConfiguration: S.optional(AclConfiguration),
  RemoveAclConfiguration: S.optional(S.Boolean),
}) {}
export class ManagedQueryResultsConfigurationUpdates extends S.Class<ManagedQueryResultsConfigurationUpdates>(
  "ManagedQueryResultsConfigurationUpdates",
)({
  Enabled: S.optional(S.Boolean),
  EncryptionConfiguration: S.optional(
    ManagedQueryResultsEncryptionConfiguration,
  ),
  RemoveEncryptionConfiguration: S.optional(S.Boolean),
}) {}
export const LogTypeValuesList = S.Array(S.String);
export const NamedQueryList = S.Array(NamedQuery);
export class UnprocessedNamedQueryId extends S.Class<UnprocessedNamedQueryId>(
  "UnprocessedNamedQueryId",
)({
  NamedQueryId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const UnprocessedNamedQueryIdList = S.Array(UnprocessedNamedQueryId);
export const PreparedStatementDetailsList = S.Array(PreparedStatement);
export class UnprocessedPreparedStatementName extends S.Class<UnprocessedPreparedStatementName>(
  "UnprocessedPreparedStatementName",
)({
  StatementName: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const UnprocessedPreparedStatementNameList = S.Array(
  UnprocessedPreparedStatementName,
);
export class UnprocessedQueryExecutionId extends S.Class<UnprocessedQueryExecutionId>(
  "UnprocessedQueryExecutionId",
)({
  QueryExecutionId: S.optional(S.String),
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const UnprocessedQueryExecutionIdList = S.Array(
  UnprocessedQueryExecutionId,
);
export class CalculationResult extends S.Class<CalculationResult>(
  "CalculationResult",
)({
  StdOutS3Uri: S.optional(S.String),
  StdErrorS3Uri: S.optional(S.String),
  ResultS3Uri: S.optional(S.String),
  ResultType: S.optional(S.String),
}) {}
export class CapacityAssignmentConfiguration extends S.Class<CapacityAssignmentConfiguration>(
  "CapacityAssignmentConfiguration",
)({
  CapacityReservationName: S.optional(S.String),
  CapacityAssignments: S.optional(CapacityAssignmentsList),
}) {}
export class SessionConfiguration extends S.Class<SessionConfiguration>(
  "SessionConfiguration",
)({
  ExecutionRole: S.optional(S.String),
  WorkingDirectory: S.optional(S.String),
  IdleTimeoutSeconds: S.optional(S.Number),
  SessionIdleTimeoutInMinutes: S.optional(S.Number),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
}) {}
export class SessionStatistics extends S.Class<SessionStatistics>(
  "SessionStatistics",
)({ DpuExecutionInMillis: S.optional(S.Number) }) {}
export const LogTypesMap = S.Record({
  key: S.String,
  value: LogTypeValuesList,
});
export class CloudWatchLoggingConfiguration extends S.Class<CloudWatchLoggingConfiguration>(
  "CloudWatchLoggingConfiguration",
)({
  Enabled: S.Boolean,
  LogGroup: S.optional(S.String),
  LogStreamNamePrefix: S.optional(S.String),
  LogTypes: S.optional(LogTypesMap),
}) {}
export class MonitoringConfiguration extends S.Class<MonitoringConfiguration>(
  "MonitoringConfiguration",
)({
  CloudWatchLoggingConfiguration: S.optional(CloudWatchLoggingConfiguration),
  ManagedLoggingConfiguration: S.optional(ManagedLoggingConfiguration),
  S3LoggingConfiguration: S.optional(S3LoggingConfiguration),
}) {}
export class EngineConfiguration extends S.Class<EngineConfiguration>(
  "EngineConfiguration",
)({
  CoordinatorDpuSize: S.optional(S.Number),
  MaxConcurrentDpus: S.optional(S.Number),
  DefaultExecutorDpuSize: S.optional(S.Number),
  AdditionalConfigs: S.optional(ParametersMap),
  SparkProperties: S.optional(ParametersMap),
  Classifications: S.optional(ClassificationList),
}) {}
export class WorkGroupConfiguration extends S.Class<WorkGroupConfiguration>(
  "WorkGroupConfiguration",
)({
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
}) {}
export class WorkGroup extends S.Class<WorkGroup>("WorkGroup")({
  Name: S.String,
  State: S.optional(S.String),
  Configuration: S.optional(WorkGroupConfiguration),
  Description: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  IdentityCenterApplicationArn: S.optional(S.String),
}) {}
export class ApplicationDPUSizes extends S.Class<ApplicationDPUSizes>(
  "ApplicationDPUSizes",
)({
  ApplicationRuntimeId: S.optional(S.String),
  SupportedDPUSizes: S.optional(SupportedDPUSizeList),
}) {}
export const ApplicationDPUSizesList = S.Array(ApplicationDPUSizes);
export class CalculationSummary extends S.Class<CalculationSummary>(
  "CalculationSummary",
)({
  CalculationExecutionId: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(CalculationStatus),
}) {}
export const CalculationsList = S.Array(CalculationSummary);
export class DataCatalogSummary extends S.Class<DataCatalogSummary>(
  "DataCatalogSummary",
)({
  CatalogName: S.optional(S.String),
  Type: S.optional(S.String),
  Status: S.optional(S.String),
  ConnectionType: S.optional(S.String),
  Error: S.optional(S.String),
}) {}
export const DataCatalogSummaryList = S.Array(DataCatalogSummary);
export class ExecutorsSummary extends S.Class<ExecutorsSummary>(
  "ExecutorsSummary",
)({
  ExecutorId: S.String,
  ExecutorType: S.optional(S.String),
  StartDateTime: S.optional(S.Number),
  TerminationDateTime: S.optional(S.Number),
  ExecutorState: S.optional(S.String),
  ExecutorSize: S.optional(S.Number),
}) {}
export const ExecutorsSummaryList = S.Array(ExecutorsSummary);
export const NotebookMetadataArray = S.Array(NotebookMetadata);
export class NotebookSessionSummary extends S.Class<NotebookSessionSummary>(
  "NotebookSessionSummary",
)({
  SessionId: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const NotebookSessionsList = S.Array(NotebookSessionSummary);
export class PreparedStatementSummary extends S.Class<PreparedStatementSummary>(
  "PreparedStatementSummary",
)({
  StatementName: S.optional(S.String),
  LastModifiedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const PreparedStatementsList = S.Array(PreparedStatementSummary);
export class SessionSummary extends S.Class<SessionSummary>("SessionSummary")({
  SessionId: S.optional(S.String),
  Description: S.optional(S.String),
  EngineVersion: S.optional(EngineVersion),
  NotebookVersion: S.optional(S.String),
  Status: S.optional(SessionStatus),
}) {}
export const SessionsList = S.Array(SessionSummary);
export class WorkGroupSummary extends S.Class<WorkGroupSummary>(
  "WorkGroupSummary",
)({
  Name: S.optional(S.String),
  State: S.optional(S.String),
  Description: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EngineVersion: S.optional(EngineVersion),
  IdentityCenterApplicationArn: S.optional(S.String),
}) {}
export const WorkGroupsList = S.Array(WorkGroupSummary);
export class WorkGroupConfigurationUpdates extends S.Class<WorkGroupConfigurationUpdates>(
  "WorkGroupConfigurationUpdates",
)({
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
}) {}
export type QueryStages = QueryStage[];
export const QueryStages = S.Array(
  S.suspend((): S.Schema<QueryStage, any> => QueryStage),
) as any as S.Schema<QueryStages>;
export class BatchGetNamedQueryOutput extends S.Class<BatchGetNamedQueryOutput>(
  "BatchGetNamedQueryOutput",
)({
  NamedQueries: S.optional(NamedQueryList),
  UnprocessedNamedQueryIds: S.optional(UnprocessedNamedQueryIdList),
}) {}
export class BatchGetPreparedStatementOutput extends S.Class<BatchGetPreparedStatementOutput>(
  "BatchGetPreparedStatementOutput",
)({
  PreparedStatements: S.optional(PreparedStatementDetailsList),
  UnprocessedPreparedStatementNames: S.optional(
    UnprocessedPreparedStatementNameList,
  ),
}) {}
export class CreateDataCatalogOutput extends S.Class<CreateDataCatalogOutput>(
  "CreateDataCatalogOutput",
)({ DataCatalog: S.optional(DataCatalog) }) {}
export class DeleteDataCatalogOutput extends S.Class<DeleteDataCatalogOutput>(
  "DeleteDataCatalogOutput",
)({ DataCatalog: S.optional(DataCatalog) }) {}
export class ExportNotebookOutput extends S.Class<ExportNotebookOutput>(
  "ExportNotebookOutput",
)({
  NotebookMetadata: S.optional(NotebookMetadata),
  Payload: S.optional(S.String),
}) {}
export class GetCalculationExecutionResponse extends S.Class<GetCalculationExecutionResponse>(
  "GetCalculationExecutionResponse",
)({
  CalculationExecutionId: S.optional(S.String),
  SessionId: S.optional(S.String),
  Description: S.optional(S.String),
  WorkingDirectory: S.optional(S.String),
  Status: S.optional(CalculationStatus),
  Statistics: S.optional(CalculationStatistics),
  Result: S.optional(CalculationResult),
}) {}
export class GetCapacityAssignmentConfigurationOutput extends S.Class<GetCapacityAssignmentConfigurationOutput>(
  "GetCapacityAssignmentConfigurationOutput",
)({ CapacityAssignmentConfiguration: CapacityAssignmentConfiguration }) {}
export class GetDatabaseOutput extends S.Class<GetDatabaseOutput>(
  "GetDatabaseOutput",
)({ Database: S.optional(Database) }) {}
export class GetSessionResponse extends S.Class<GetSessionResponse>(
  "GetSessionResponse",
)({
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
}) {}
export class GetWorkGroupOutput extends S.Class<GetWorkGroupOutput>(
  "GetWorkGroupOutput",
)({ WorkGroup: S.optional(WorkGroup) }) {}
export class ListApplicationDPUSizesOutput extends S.Class<ListApplicationDPUSizesOutput>(
  "ListApplicationDPUSizesOutput",
)({
  ApplicationDPUSizes: S.optional(ApplicationDPUSizesList),
  NextToken: S.optional(S.String),
}) {}
export class ListCalculationExecutionsResponse extends S.Class<ListCalculationExecutionsResponse>(
  "ListCalculationExecutionsResponse",
)({
  NextToken: S.optional(S.String),
  Calculations: S.optional(CalculationsList),
}) {}
export class ListDataCatalogsOutput extends S.Class<ListDataCatalogsOutput>(
  "ListDataCatalogsOutput",
)({
  DataCatalogsSummary: S.optional(DataCatalogSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListExecutorsResponse extends S.Class<ListExecutorsResponse>(
  "ListExecutorsResponse",
)({
  SessionId: S.String,
  NextToken: S.optional(S.String),
  ExecutorsSummary: S.optional(ExecutorsSummaryList),
}) {}
export class ListNotebookMetadataOutput extends S.Class<ListNotebookMetadataOutput>(
  "ListNotebookMetadataOutput",
)({
  NextToken: S.optional(S.String),
  NotebookMetadataList: S.optional(NotebookMetadataArray),
}) {}
export class ListNotebookSessionsResponse extends S.Class<ListNotebookSessionsResponse>(
  "ListNotebookSessionsResponse",
)({
  NotebookSessionsList: NotebookSessionsList,
  NextToken: S.optional(S.String),
}) {}
export class ListPreparedStatementsOutput extends S.Class<ListPreparedStatementsOutput>(
  "ListPreparedStatementsOutput",
)({
  PreparedStatements: S.optional(PreparedStatementsList),
  NextToken: S.optional(S.String),
}) {}
export class ListSessionsResponse extends S.Class<ListSessionsResponse>(
  "ListSessionsResponse",
)({ NextToken: S.optional(S.String), Sessions: S.optional(SessionsList) }) {}
export class ListWorkGroupsOutput extends S.Class<ListWorkGroupsOutput>(
  "ListWorkGroupsOutput",
)({
  WorkGroups: S.optional(WorkGroupsList),
  NextToken: S.optional(S.String),
}) {}
export class StartCalculationExecutionResponse extends S.Class<StartCalculationExecutionResponse>(
  "StartCalculationExecutionResponse",
)({
  CalculationExecutionId: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export class StartQueryExecutionInput extends S.Class<StartQueryExecutionInput>(
  "StartQueryExecutionInput",
)(
  {
    QueryString: S.String,
    ClientRequestToken: S.optional(S.String),
    QueryExecutionContext: S.optional(QueryExecutionContext),
    ResultConfiguration: S.optional(ResultConfiguration),
    WorkGroup: S.optional(S.String),
    ExecutionParameters: S.optional(ExecutionParameters),
    ResultReuseConfiguration: S.optional(ResultReuseConfiguration),
    EngineConfiguration: S.optional(EngineConfiguration),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateWorkGroupInput extends S.Class<UpdateWorkGroupInput>(
  "UpdateWorkGroupInput",
)(
  {
    WorkGroup: S.String,
    Description: S.optional(S.String),
    ConfigurationUpdates: S.optional(WorkGroupConfigurationUpdates),
    State: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateWorkGroupOutput extends S.Class<UpdateWorkGroupOutput>(
  "UpdateWorkGroupOutput",
)({}) {}
export class QueryRuntimeStatisticsTimeline extends S.Class<QueryRuntimeStatisticsTimeline>(
  "QueryRuntimeStatisticsTimeline",
)({
  QueryQueueTimeInMillis: S.optional(S.Number),
  ServicePreProcessingTimeInMillis: S.optional(S.Number),
  QueryPlanningTimeInMillis: S.optional(S.Number),
  EngineExecutionTimeInMillis: S.optional(S.Number),
  ServiceProcessingTimeInMillis: S.optional(S.Number),
  TotalExecutionTimeInMillis: S.optional(S.Number),
}) {}
export class QueryRuntimeStatisticsRows extends S.Class<QueryRuntimeStatisticsRows>(
  "QueryRuntimeStatisticsRows",
)({
  InputRows: S.optional(S.Number),
  InputBytes: S.optional(S.Number),
  OutputBytes: S.optional(S.Number),
  OutputRows: S.optional(S.Number),
}) {}
export type QueryStagePlanNodes = QueryStagePlanNode[];
export const QueryStagePlanNodes = S.Array(
  S.suspend((): S.Schema<QueryStagePlanNode, any> => QueryStagePlanNode),
) as any as S.Schema<QueryStagePlanNodes>;
export const StringList = S.Array(S.String);
export class Datum extends S.Class<Datum>("Datum")({
  VarCharValue: S.optional(S.String),
}) {}
export const datumList = S.Array(Datum);
export class ColumnInfo extends S.Class<ColumnInfo>("ColumnInfo")({
  CatalogName: S.optional(S.String),
  SchemaName: S.optional(S.String),
  TableName: S.optional(S.String),
  Name: S.String,
  Label: S.optional(S.String),
  Type: S.String,
  Precision: S.optional(S.Number),
  Scale: S.optional(S.Number),
  Nullable: S.optional(S.String),
  CaseSensitive: S.optional(S.Boolean),
}) {}
export const ColumnInfoList = S.Array(ColumnInfo);
export class QueryStagePlanNode extends S.Class<QueryStagePlanNode>(
  "QueryStagePlanNode",
)({
  Name: S.optional(S.String),
  Identifier: S.optional(S.String),
  Children: S.optional(S.suspend(() => QueryStagePlanNodes)),
  RemoteSources: S.optional(StringList),
}) {}
export class CreateWorkGroupInput extends S.Class<CreateWorkGroupInput>(
  "CreateWorkGroupInput",
)(
  {
    Name: S.String,
    Configuration: S.optional(WorkGroupConfiguration),
    Description: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateWorkGroupOutput extends S.Class<CreateWorkGroupOutput>(
  "CreateWorkGroupOutput",
)({}) {}
export class GetCapacityReservationOutput extends S.Class<GetCapacityReservationOutput>(
  "GetCapacityReservationOutput",
)({ CapacityReservation: CapacityReservation }) {}
export class GetTableMetadataOutput extends S.Class<GetTableMetadataOutput>(
  "GetTableMetadataOutput",
)({ TableMetadata: S.optional(TableMetadata) }) {}
export class StartQueryExecutionOutput extends S.Class<StartQueryExecutionOutput>(
  "StartQueryExecutionOutput",
)({ QueryExecutionId: S.optional(S.String) }) {}
export class StartSessionRequest extends S.Class<StartSessionRequest>(
  "StartSessionRequest",
)(
  {
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
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Row extends S.Class<Row>("Row")({ Data: S.optional(datumList) }) {}
export const RowList = S.Array(Row);
export class ResultSetMetadata extends S.Class<ResultSetMetadata>(
  "ResultSetMetadata",
)({ ColumnInfo: S.optional(ColumnInfoList) }) {}
export class QueryStage extends S.Class<QueryStage>("QueryStage")({
  StageId: S.optional(S.Number),
  State: S.optional(S.String),
  OutputBytes: S.optional(S.Number),
  OutputRows: S.optional(S.Number),
  InputBytes: S.optional(S.Number),
  InputRows: S.optional(S.Number),
  ExecutionTime: S.optional(S.Number),
  QueryStagePlan: S.optional(
    S.suspend((): S.Schema<QueryStagePlanNode, any> => QueryStagePlanNode),
  ),
  SubStages: S.optional(S.suspend(() => QueryStages)),
}) {}
export const QueryExecutionList = S.Array(QueryExecution);
export class ResultSet extends S.Class<ResultSet>("ResultSet")({
  Rows: S.optional(RowList),
  ResultSetMetadata: S.optional(ResultSetMetadata),
}) {}
export class QueryRuntimeStatistics extends S.Class<QueryRuntimeStatistics>(
  "QueryRuntimeStatistics",
)({
  Timeline: S.optional(QueryRuntimeStatisticsTimeline),
  Rows: S.optional(QueryRuntimeStatisticsRows),
  OutputStage: S.optional(QueryStage),
}) {}
export class BatchGetQueryExecutionOutput extends S.Class<BatchGetQueryExecutionOutput>(
  "BatchGetQueryExecutionOutput",
)({
  QueryExecutions: S.optional(QueryExecutionList),
  UnprocessedQueryExecutionIds: S.optional(UnprocessedQueryExecutionIdList),
}) {}
export class GetQueryResultsOutput extends S.Class<GetQueryResultsOutput>(
  "GetQueryResultsOutput",
)({
  UpdateCount: S.optional(S.Number),
  ResultSet: S.optional(ResultSet),
  NextToken: S.optional(S.String),
}) {}
export class GetQueryRuntimeStatisticsOutput extends S.Class<GetQueryRuntimeStatisticsOutput>(
  "GetQueryRuntimeStatisticsOutput",
)({ QueryRuntimeStatistics: S.optional(QueryRuntimeStatistics) }) {}
export class StartSessionResponse extends S.Class<StartSessionResponse>(
  "StartSessionResponse",
)({ SessionId: S.optional(S.String), State: S.optional(S.String) }) {}

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
  { Message: S.optional(S.String), Reason: S.optional(S.String) },
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
export const cancelCapacityReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CancelCapacityReservationInput,
    output: CancelCapacityReservationOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
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
export const createDataCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataCatalogInput,
  output: CreateDataCatalogOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Deletes a data catalog.
 */
export const deleteDataCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataCatalogInput,
  output: DeleteDataCatalogOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Gets the capacity assignment configuration for a capacity reservation, if one
 * exists.
 */
export const getCapacityAssignmentConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetCapacityAssignmentConfigurationInput,
    output: GetCapacityAssignmentConfigurationOutput,
    errors: [InternalServerException, InvalidRequestException],
  }));
/**
 * Returns information about the workgroup with the specified name.
 */
export const getWorkGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDataCatalogs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDataCatalogsInput,
    output: ListDataCatalogsOutput,
    errors: [InternalServerException, InvalidRequestException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "DataCatalogsSummary",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the prepared statements in the specified workgroup.
 */
export const listPreparedStatements =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listWorkGroups = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListWorkGroupsInput,
    output: ListWorkGroupsOutput,
    errors: [InternalServerException, InvalidRequestException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Updates the workgroup with the specified name. The workgroup's name cannot be changed.
 * Only `ConfigurationUpdates` can be specified.
 */
export const updateWorkGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkGroupInput,
  output: UpdateWorkGroupOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Creates a capacity reservation with the specified name and number of requested data
 * processing units.
 */
export const createCapacityReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCapacityReservationInput,
    output: CreateCapacityReservationOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Creates a named query in the specified workgroup. Requires that you have access to the
 * workgroup.
 */
export const createNamedQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateNamedQueryInput,
  output: CreateNamedQueryOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns the specified data catalog.
 */
export const getDataCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataCatalogInput,
  output: GetDataCatalogOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns information about a single query. Requires that you have access to the
 * workgroup in which the query was saved.
 */
export const getNamedQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetNamedQueryInput,
  output: GetNamedQueryOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Returns information about a single execution of a query if you have access to the
 * workgroup in which the query ran. Each time a query executes, information about the
 * query execution is saved with a unique ID.
 */
export const getQueryExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueryExecutionInput,
  output: GetQueryExecutionOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Lists the capacity reservations for the current account.
 */
export const listCapacityReservations =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listEngineVersions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListEngineVersionsInput,
    output: ListEngineVersionsOutput,
    errors: [InternalServerException, InvalidRequestException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Provides a list of available query IDs only for queries saved in the specified
 * workgroup. Requires that you have access to the specified workgroup. If a workgroup is
 * not specified, lists the saved queries for the primary workgroup.
 */
export const listNamedQueries = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListNamedQueriesInput,
    output: ListNamedQueriesOutput,
    errors: [InternalServerException, InvalidRequestException],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Provides a list of available query execution IDs for the queries in the specified
 * workgroup. Athena keeps a query history for 45 days. If a workgroup is not
 * specified, returns a list of query execution IDs for the primary workgroup. Requires you
 * to have access to the workgroup in which the queries ran.
 */
export const listQueryExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const putCapacityAssignmentConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutCapacityAssignmentConfigurationInput,
    output: PutCapacityAssignmentConfigurationOutput,
    errors: [InternalServerException, InvalidRequestException],
  }));
/**
 * Creates a prepared statement for use with SQL queries in Athena.
 */
export const createPreparedStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePreparedStatementInput,
    output: CreatePreparedStatementOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Deletes a cancelled capacity reservation. A reservation must be cancelled before it
 * can be deleted. A deleted reservation is immediately removed from your account and can
 * no longer be referenced, including by its ARN. A deleted reservation cannot be called by
 * `GetCapacityReservation`, and deleted reservations do not appear in the
 * output of `ListCapacityReservations`.
 */
export const deleteCapacityReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCapacityReservationInput,
    output: DeleteCapacityReservationOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Deletes the named query if you have access to the workgroup in which the query was
 * saved.
 */
export const deleteNamedQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteNamedQueryInput,
  output: DeleteNamedQueryOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Deletes the workgroup with the specified name. The primary workgroup cannot be
 * deleted.
 */
export const deleteWorkGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkGroupInput,
  output: DeleteWorkGroupOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Stops a query execution. Requires you to have access to the workgroup in which the
 * query ran.
 */
export const stopQueryExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopQueryExecutionInput,
  output: StopQueryExecutionOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Updates the number of requested data processing units for the capacity reservation
 * with the specified name.
 */
export const updateCapacityReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCapacityReservationInput,
    output: UpdateCapacityReservationOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Updates the data catalog that has the specified name.
 */
export const updateDataCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDataCatalogInput,
  output: UpdateDataCatalogOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Updates a NamedQuery object. The database or workgroup cannot be
 * updated.
 */
export const updateNamedQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetNamedQuery = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetPreparedStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetPreparedStatementInput,
    output: BatchGetPreparedStatementOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Creates a workgroup with the specified name. A workgroup can be an Apache Spark
 * enabled workgroup or an Athena SQL workgroup.
 */
export const createWorkGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkGroupInput,
  output: CreateWorkGroupOutput,
  errors: [InternalServerException, InvalidRequestException],
}));
/**
 * Exports the specified notebook and its metadata.
 */
export const exportNotebook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCalculationExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCalculationExecutionRequest,
    output: GetCalculationExecutionResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Returns information about the capacity reservation with the specified name.
 */
export const getCapacityReservation = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCapacityReservationInput,
    output: GetCapacityReservationOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Returns a database object for the specified database and data catalog.
 */
export const getDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDatabaseInput,
  output: GetDatabaseOutput,
  errors: [InternalServerException, InvalidRequestException, MetadataException],
}));
/**
 * Returns table metadata for the specified catalog, database, and table.
 */
export const getTableMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startQueryExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listApplicationDPUSizes =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listNotebookMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListNotebookMetadataInput,
    output: ListNotebookMetadataOutput,
    errors: [
      InternalServerException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Creates an empty `ipynb` file in the specified Apache Spark enabled
 * workgroup. Throws an error if a file in the workgroup with the same name already
 * exists.
 */
export const createNotebook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getNotebookMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const importNotebook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteNotebook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateNotebook = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateNotebookMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateNotebookMetadataInput,
    output: UpdateNotebookMetadataOutput,
    errors: [
      InternalServerException,
      InvalidRequestException,
      TooManyRequestsException,
    ],
  }),
);
/**
 * Gets the full details of a previously created session, including the session status
 * and configuration.
 */
export const getSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listCalculationExecutions =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listExecutors = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Lists, in descending order, the sessions that have been created in a notebook that are
 * in an active state like `CREATING`, `CREATED`, `IDLE`
 * or `BUSY`. Newer sessions are listed first; older sessions are listed
 * later.
 */
export const listNotebookSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListNotebookSessionsRequest,
    output: ListNotebookSessionsResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Lists the sessions in a workgroup that are in an active state like
 * `CREATING`, `CREATED`, `IDLE`, or
 * `BUSY`. Newer sessions are listed first; older sessions are listed
 * later.
 */
export const listSessions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Submits calculations for execution within a session. You can supply the code to run as
 * an inline code block within the request.
 *
 * The request syntax requires the StartCalculationExecutionRequest$CodeBlock parameter or the CalculationConfiguration$CodeBlock parameter, but not both. Because
 * CalculationConfiguration$CodeBlock is deprecated, use the
 * StartCalculationExecutionRequest$CodeBlock parameter
 * instead.
 */
export const startCalculationExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartCalculationExecutionRequest,
    output: StartCalculationExecutionResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Gets an authentication token and the URL at which the notebook can be accessed. During
 * programmatic access, `CreatePresignedNotebookUrl` must be called every 10
 * minutes to refresh the authentication token. For information about granting programmatic
 * access, see Grant
 * programmatic access.
 */
export const createPresignedNotebookUrl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePresignedNotebookUrlRequest,
    output: CreatePresignedNotebookUrlResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Retrieves the unencrypted code that was executed for the calculation.
 */
export const getCalculationExecutionCode = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCalculationExecutionCodeRequest,
    output: GetCalculationExecutionCodeResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Gets the status of a current calculation.
 */
export const getCalculationExecutionStatus =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getPreparedStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPreparedStatementInput,
    output: GetPreparedStatementOutput,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Gets the Live UI/Persistence UI for a session.
 */
export const getResourceDashboard = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetResourceDashboardRequest,
    output: GetResourceDashboardResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Gets a connection endpoint and authentication token for a given session Id.
 */
export const getSessionEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSessionStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const stopCalculationExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopCalculationExecutionRequest,
    output: StopCalculationExecutionResponse,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Terminates an active session. A `TerminateSession` call on a session that
 * is already inactive (for example, in a `FAILED`, `TERMINATED` or
 * `TERMINATING` state) succeeds but has no effect. Calculations running in
 * the session when `TerminateSession` is called are forcefully stopped, but may
 * display as `FAILED` instead of `STOPPED`.
 */
export const terminateSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deletePreparedStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePreparedStatementInput,
    output: DeletePreparedStatementOutput,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updatePreparedStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdatePreparedStatementInput,
    output: UpdatePreparedStatementOutput,
    errors: [
      InternalServerException,
      InvalidRequestException,
      ResourceNotFoundException,
    ],
  }),
);
/**
 * Lists the databases in the specified data catalog.
 */
export const listDatabases = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDatabasesInput,
    output: ListDatabasesOutput,
    errors: [
      InternalServerException,
      InvalidRequestException,
      MetadataException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "DatabaseList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Lists the metadata for the tables in the specified data catalog database.
 */
export const listTableMetadata = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListTableMetadataInput,
    output: ListTableMetadataOutput,
    errors: [
      InternalServerException,
      InvalidRequestException,
      MetadataException,
    ],
    pagination: {
      inputToken: "NextToken",
      outputToken: "NextToken",
      items: "TableMetadataList",
      pageSize: "MaxResults",
    } as const,
  }),
);
/**
 * Returns the details of a single query execution or a list of up to 50 query
 * executions, which you provide as an array of query execution ID strings. Requires you to
 * have access to the workgroup in which the queries ran. To get a list of query execution
 * IDs, use ListQueryExecutionsInput$WorkGroup. Query executions differ
 * from named (saved) queries. Use BatchGetNamedQueryInput to get details
 * about named queries.
 */
export const batchGetQueryExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetQueryExecutionInput,
    output: BatchGetQueryExecutionOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
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
export const getQueryResults = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Returns query execution runtime statistics related to a single execution of a query if
 * you have access to the workgroup in which the query ran. Statistics from the
 * `Timeline` section of the response object are available as soon as QueryExecutionStatus$State is in a SUCCEEDED or FAILED state. The
 * remaining non-timeline statistics in the response (like stage-level input and output row
 * count and data size) are updated asynchronously and may not be available immediately
 * after a query completes or, in some cases, may not be returned. The non-timeline
 * statistics are also not included when a query has row-level filters defined in Lake Formation.
 */
export const getQueryRuntimeStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetQueryRuntimeStatisticsInput,
    output: GetQueryRuntimeStatisticsOutput,
    errors: [InternalServerException, InvalidRequestException],
  }),
);
/**
 * Creates a session for running calculations within a workgroup. The session is ready
 * when it reaches an `IDLE` state.
 */
export const startSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
