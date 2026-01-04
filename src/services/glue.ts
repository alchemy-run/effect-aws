import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({ sdkId: "Glue", serviceShapeName: "AWSGlue" });
const auth = T.AwsAuthSigv4({ name: "glue" });
const ver = T.ServiceVersion("2017-03-31");
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
                        url: "https://glue-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://glue-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://glue.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://glue.{Region}.{PartitionResult#dnsSuffix}",
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
export class DeleteGlueIdentityCenterConfigurationRequest extends S.Class<DeleteGlueIdentityCenterConfigurationRequest>(
  "DeleteGlueIdentityCenterConfigurationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGlueIdentityCenterConfigurationResponse extends S.Class<DeleteGlueIdentityCenterConfigurationResponse>(
  "DeleteGlueIdentityCenterConfigurationResponse",
)({}) {}
export class GetGlueIdentityCenterConfigurationRequest extends S.Class<GetGlueIdentityCenterConfigurationRequest>(
  "GetGlueIdentityCenterConfigurationRequest",
)(
  {},
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const DeleteConnectionNameList = S.Array(S.String);
export const BatchDeleteTableNameList = S.Array(S.String);
export const BatchDeleteTableVersionList = S.Array(S.String);
export const BatchGetBlueprintNames = S.Array(S.String);
export const CrawlerNameList = S.Array(S.String);
export const CustomEntityTypeNames = S.Array(S.String);
export const DataQualityResultIds = S.Array(S.String);
export const DevEndpointNames = S.Array(S.String);
export const JobNameList = S.Array(S.String);
export const ValueStringList = S.Array(S.String);
export class PartitionValueList extends S.Class<PartitionValueList>(
  "PartitionValueList",
)({ Values: ValueStringList }) {}
export const BatchGetPartitionValueList = S.Array(PartitionValueList);
export const TriggerNameList = S.Array(S.String);
export const WorkflowNames = S.Array(S.String);
export const BatchStopJobRunJobRunIdList = S.Array(S.String);
export const ColumnNameList = S.Array(S.String);
export const ClassifierNameList = S.Array(S.String);
export const ContextWords = S.Array(S.String);
export const StringList = S.Array(S.String);
export const PublicKeysList = S.Array(S.String);
export const IdentityCenterScopesList = S.Array(S.String);
export const KeyList = S.Array(S.String);
export class PartitionIndex extends S.Class<PartitionIndex>("PartitionIndex")({
  Keys: KeyList,
  IndexName: S.String,
}) {}
export const PartitionIndexList = S.Array(PartitionIndex);
export const GetColumnNamesList = S.Array(S.String);
export const DatabaseAttributesList = S.Array(S.String);
export const SelectedFields = S.Array(S.String);
export const OrchestrationStringList = S.Array(S.String);
export class CatalogEntry extends S.Class<CatalogEntry>("CatalogEntry")({
  DatabaseName: S.String,
  TableName: S.String,
}) {}
export const CatalogEntries = S.Array(CatalogEntry);
export const TableAttributesList = S.Array(S.String);
export const PermissionTypeList = S.Array(S.String);
export const PermissionList = S.Array(S.String);
export class MetadataKeyValuePair extends S.Class<MetadataKeyValuePair>(
  "MetadataKeyValuePair",
)({ MetadataKey: S.optional(S.String), MetadataValue: S.optional(S.String) }) {}
export const MetadataList = S.Array(MetadataKeyValuePair);
export const NodeIdList = S.Array(S.String);
export const RulesetNames = S.Array(S.String);
export const TagKeysList = S.Array(S.String);
export const BoundedPartitionValueList = S.Array(S.String);
export class BatchDeleteConnectionRequest extends S.Class<BatchDeleteConnectionRequest>(
  "BatchDeleteConnectionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    ConnectionNameList: DeleteConnectionNameList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDeleteTableRequest extends S.Class<BatchDeleteTableRequest>(
  "BatchDeleteTableRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TablesToDelete: BatchDeleteTableNameList,
    TransactionId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchDeleteTableVersionRequest extends S.Class<BatchDeleteTableVersionRequest>(
  "BatchDeleteTableVersionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    VersionIds: BatchDeleteTableVersionList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetBlueprintsRequest extends S.Class<BatchGetBlueprintsRequest>(
  "BatchGetBlueprintsRequest",
)(
  {
    Names: BatchGetBlueprintNames,
    IncludeBlueprint: S.optional(S.Boolean),
    IncludeParameterSpec: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetCrawlersRequest extends S.Class<BatchGetCrawlersRequest>(
  "BatchGetCrawlersRequest",
)(
  { CrawlerNames: CrawlerNameList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetCustomEntityTypesRequest extends S.Class<BatchGetCustomEntityTypesRequest>(
  "BatchGetCustomEntityTypesRequest",
)(
  { Names: CustomEntityTypeNames },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetDataQualityResultRequest extends S.Class<BatchGetDataQualityResultRequest>(
  "BatchGetDataQualityResultRequest",
)(
  { ResultIds: DataQualityResultIds },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetDevEndpointsRequest extends S.Class<BatchGetDevEndpointsRequest>(
  "BatchGetDevEndpointsRequest",
)(
  { DevEndpointNames: DevEndpointNames },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetJobsRequest extends S.Class<BatchGetJobsRequest>(
  "BatchGetJobsRequest",
)(
  { JobNames: JobNameList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetPartitionRequest extends S.Class<BatchGetPartitionRequest>(
  "BatchGetPartitionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionsToGet: BatchGetPartitionValueList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetTriggersRequest extends S.Class<BatchGetTriggersRequest>(
  "BatchGetTriggersRequest",
)(
  { TriggerNames: TriggerNameList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetWorkflowsRequest extends S.Class<BatchGetWorkflowsRequest>(
  "BatchGetWorkflowsRequest",
)(
  { Names: WorkflowNames, IncludeGraph: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchStopJobRunRequest extends S.Class<BatchStopJobRunRequest>(
  "BatchStopJobRunRequest",
)(
  { JobName: S.String, JobRunIds: BatchStopJobRunJobRunIdList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelDataQualityRuleRecommendationRunRequest extends S.Class<CancelDataQualityRuleRecommendationRunRequest>(
  "CancelDataQualityRuleRecommendationRunRequest",
)(
  { RunId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelDataQualityRuleRecommendationRunResponse extends S.Class<CancelDataQualityRuleRecommendationRunResponse>(
  "CancelDataQualityRuleRecommendationRunResponse",
)({}) {}
export class CancelDataQualityRulesetEvaluationRunRequest extends S.Class<CancelDataQualityRulesetEvaluationRunRequest>(
  "CancelDataQualityRulesetEvaluationRunRequest",
)(
  { RunId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelDataQualityRulesetEvaluationRunResponse extends S.Class<CancelDataQualityRulesetEvaluationRunResponse>(
  "CancelDataQualityRulesetEvaluationRunResponse",
)({}) {}
export class CancelMLTaskRunRequest extends S.Class<CancelMLTaskRunRequest>(
  "CancelMLTaskRunRequest",
)(
  { TransformId: S.String, TaskRunId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelStatementRequest extends S.Class<CancelStatementRequest>(
  "CancelStatementRequest",
)(
  { SessionId: S.String, Id: S.Number, RequestOrigin: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelStatementResponse extends S.Class<CancelStatementResponse>(
  "CancelStatementResponse",
)({}) {}
export class CheckSchemaVersionValidityInput extends S.Class<CheckSchemaVersionValidityInput>(
  "CheckSchemaVersionValidityInput",
)(
  { DataFormat: S.String, SchemaDefinition: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class CreateColumnStatisticsTaskSettingsRequest extends S.Class<CreateColumnStatisticsTaskSettingsRequest>(
  "CreateColumnStatisticsTaskSettingsRequest",
)(
  {
    DatabaseName: S.String,
    TableName: S.String,
    Role: S.String,
    Schedule: S.optional(S.String),
    ColumnNameList: S.optional(ColumnNameList),
    SampleSize: S.optional(S.Number),
    CatalogID: S.optional(S.String),
    SecurityConfiguration: S.optional(S.String),
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateColumnStatisticsTaskSettingsResponse extends S.Class<CreateColumnStatisticsTaskSettingsResponse>(
  "CreateColumnStatisticsTaskSettingsResponse",
)({}) {}
export class CreateCustomEntityTypeRequest extends S.Class<CreateCustomEntityTypeRequest>(
  "CreateCustomEntityTypeRequest",
)(
  {
    Name: S.String,
    RegexString: S.String,
    ContextWords: S.optional(ContextWords),
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGlueIdentityCenterConfigurationRequest extends S.Class<CreateGlueIdentityCenterConfigurationRequest>(
  "CreateGlueIdentityCenterConfigurationRequest",
)(
  {
    InstanceArn: S.String,
    Scopes: S.optional(IdentityCenterScopesList),
    UserBackgroundSessionsEnabled: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ParametersMap = S.Record({ key: S.String, value: S.String });
export class Column extends S.Class<Column>("Column")({
  Name: S.String,
  Type: S.optional(S.String),
  Comment: S.optional(S.String),
  Parameters: S.optional(ParametersMap),
}) {}
export const ColumnList = S.Array(Column);
export const LocationStringList = S.Array(S.String);
export class SerDeInfo extends S.Class<SerDeInfo>("SerDeInfo")({
  Name: S.optional(S.String),
  SerializationLibrary: S.optional(S.String),
  Parameters: S.optional(ParametersMap),
}) {}
export const NameStringList = S.Array(S.String);
export class Order extends S.Class<Order>("Order")({
  Column: S.String,
  SortOrder: S.Number,
}) {}
export const OrderList = S.Array(Order);
export const ColumnValueStringList = S.Array(S.String);
export const LocationMap = S.Record({ key: S.String, value: S.String });
export class SkewedInfo extends S.Class<SkewedInfo>("SkewedInfo")({
  SkewedColumnNames: S.optional(NameStringList),
  SkewedColumnValues: S.optional(ColumnValueStringList),
  SkewedColumnValueLocationMaps: S.optional(LocationMap),
}) {}
export class SchemaId extends S.Class<SchemaId>("SchemaId")({
  SchemaArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  RegistryName: S.optional(S.String),
}) {}
export class SchemaReference extends S.Class<SchemaReference>(
  "SchemaReference",
)({
  SchemaId: S.optional(SchemaId),
  SchemaVersionId: S.optional(S.String),
  SchemaVersionNumber: S.optional(S.Number),
}) {}
export class StorageDescriptor extends S.Class<StorageDescriptor>(
  "StorageDescriptor",
)({
  Columns: S.optional(ColumnList),
  Location: S.optional(S.String),
  AdditionalLocations: S.optional(LocationStringList),
  InputFormat: S.optional(S.String),
  OutputFormat: S.optional(S.String),
  Compressed: S.optional(S.Boolean),
  NumberOfBuckets: S.optional(S.Number),
  SerdeInfo: S.optional(SerDeInfo),
  BucketColumns: S.optional(NameStringList),
  SortColumns: S.optional(OrderList),
  Parameters: S.optional(ParametersMap),
  SkewedInfo: S.optional(SkewedInfo),
  StoredAsSubDirectories: S.optional(S.Boolean),
  SchemaReference: S.optional(SchemaReference),
}) {}
export class PartitionInput extends S.Class<PartitionInput>("PartitionInput")({
  Values: S.optional(ValueStringList),
  LastAccessTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StorageDescriptor: S.optional(StorageDescriptor),
  Parameters: S.optional(ParametersMap),
  LastAnalyzedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreatePartitionRequest extends S.Class<CreatePartitionRequest>(
  "CreatePartitionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionInput: PartitionInput,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePartitionResponse extends S.Class<CreatePartitionResponse>(
  "CreatePartitionResponse",
)({}) {}
export class CreateRegistryInput extends S.Class<CreateRegistryInput>(
  "CreateRegistryInput",
)(
  {
    RegistryName: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBlueprintRequest extends S.Class<DeleteBlueprintRequest>(
  "DeleteBlueprintRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCatalogRequest extends S.Class<DeleteCatalogRequest>(
  "DeleteCatalogRequest",
)(
  { CatalogId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCatalogResponse extends S.Class<DeleteCatalogResponse>(
  "DeleteCatalogResponse",
)({}) {}
export class DeleteClassifierRequest extends S.Class<DeleteClassifierRequest>(
  "DeleteClassifierRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClassifierResponse extends S.Class<DeleteClassifierResponse>(
  "DeleteClassifierResponse",
)({}) {}
export class DeleteColumnStatisticsForPartitionRequest extends S.Class<DeleteColumnStatisticsForPartitionRequest>(
  "DeleteColumnStatisticsForPartitionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValues: ValueStringList,
    ColumnName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteColumnStatisticsForPartitionResponse extends S.Class<DeleteColumnStatisticsForPartitionResponse>(
  "DeleteColumnStatisticsForPartitionResponse",
)({}) {}
export class DeleteColumnStatisticsForTableRequest extends S.Class<DeleteColumnStatisticsForTableRequest>(
  "DeleteColumnStatisticsForTableRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    ColumnName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteColumnStatisticsForTableResponse extends S.Class<DeleteColumnStatisticsForTableResponse>(
  "DeleteColumnStatisticsForTableResponse",
)({}) {}
export class DeleteColumnStatisticsTaskSettingsRequest extends S.Class<DeleteColumnStatisticsTaskSettingsRequest>(
  "DeleteColumnStatisticsTaskSettingsRequest",
)(
  { DatabaseName: S.String, TableName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteColumnStatisticsTaskSettingsResponse extends S.Class<DeleteColumnStatisticsTaskSettingsResponse>(
  "DeleteColumnStatisticsTaskSettingsResponse",
)({}) {}
export class DeleteConnectionRequest extends S.Class<DeleteConnectionRequest>(
  "DeleteConnectionRequest",
)(
  { CatalogId: S.optional(S.String), ConnectionName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteConnectionResponse extends S.Class<DeleteConnectionResponse>(
  "DeleteConnectionResponse",
)({}) {}
export class DeleteCrawlerRequest extends S.Class<DeleteCrawlerRequest>(
  "DeleteCrawlerRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCrawlerResponse extends S.Class<DeleteCrawlerResponse>(
  "DeleteCrawlerResponse",
)({}) {}
export class DeleteCustomEntityTypeRequest extends S.Class<DeleteCustomEntityTypeRequest>(
  "DeleteCustomEntityTypeRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDatabaseRequest extends S.Class<DeleteDatabaseRequest>(
  "DeleteDatabaseRequest",
)(
  { CatalogId: S.optional(S.String), Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDatabaseResponse extends S.Class<DeleteDatabaseResponse>(
  "DeleteDatabaseResponse",
)({}) {}
export class DeleteDataQualityRulesetRequest extends S.Class<DeleteDataQualityRulesetRequest>(
  "DeleteDataQualityRulesetRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDataQualityRulesetResponse extends S.Class<DeleteDataQualityRulesetResponse>(
  "DeleteDataQualityRulesetResponse",
)({}) {}
export class DeleteDevEndpointRequest extends S.Class<DeleteDevEndpointRequest>(
  "DeleteDevEndpointRequest",
)(
  { EndpointName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteDevEndpointResponse extends S.Class<DeleteDevEndpointResponse>(
  "DeleteDevEndpointResponse",
)({}) {}
export class DeleteIntegrationRequest extends S.Class<DeleteIntegrationRequest>(
  "DeleteIntegrationRequest",
)(
  { IntegrationIdentifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIntegrationResourcePropertyRequest extends S.Class<DeleteIntegrationResourcePropertyRequest>(
  "DeleteIntegrationResourcePropertyRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIntegrationResourcePropertyResponse extends S.Class<DeleteIntegrationResourcePropertyResponse>(
  "DeleteIntegrationResourcePropertyResponse",
)({}) {}
export class DeleteIntegrationTablePropertiesRequest extends S.Class<DeleteIntegrationTablePropertiesRequest>(
  "DeleteIntegrationTablePropertiesRequest",
)(
  { ResourceArn: S.String, TableName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteIntegrationTablePropertiesResponse extends S.Class<DeleteIntegrationTablePropertiesResponse>(
  "DeleteIntegrationTablePropertiesResponse",
)({}) {}
export class DeleteJobRequest extends S.Class<DeleteJobRequest>(
  "DeleteJobRequest",
)(
  { JobName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteMLTransformRequest extends S.Class<DeleteMLTransformRequest>(
  "DeleteMLTransformRequest",
)(
  { TransformId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePartitionRequest extends S.Class<DeletePartitionRequest>(
  "DeletePartitionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValues: ValueStringList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePartitionResponse extends S.Class<DeletePartitionResponse>(
  "DeletePartitionResponse",
)({}) {}
export class DeletePartitionIndexRequest extends S.Class<DeletePartitionIndexRequest>(
  "DeletePartitionIndexRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    IndexName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeletePartitionIndexResponse extends S.Class<DeletePartitionIndexResponse>(
  "DeletePartitionIndexResponse",
)({}) {}
export class RegistryId extends S.Class<RegistryId>("RegistryId")({
  RegistryName: S.optional(S.String),
  RegistryArn: S.optional(S.String),
}) {}
export class DeleteRegistryInput extends S.Class<DeleteRegistryInput>(
  "DeleteRegistryInput",
)(
  { RegistryId: RegistryId },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyRequest extends S.Class<DeleteResourcePolicyRequest>(
  "DeleteResourcePolicyRequest",
)(
  {
    PolicyHashCondition: S.optional(S.String),
    ResourceArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteResourcePolicyResponse extends S.Class<DeleteResourcePolicyResponse>(
  "DeleteResourcePolicyResponse",
)({}) {}
export class DeleteSchemaVersionsInput extends S.Class<DeleteSchemaVersionsInput>(
  "DeleteSchemaVersionsInput",
)(
  { SchemaId: SchemaId, Versions: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSecurityConfigurationRequest extends S.Class<DeleteSecurityConfigurationRequest>(
  "DeleteSecurityConfigurationRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSecurityConfigurationResponse extends S.Class<DeleteSecurityConfigurationResponse>(
  "DeleteSecurityConfigurationResponse",
)({}) {}
export class DeleteSessionRequest extends S.Class<DeleteSessionRequest>(
  "DeleteSessionRequest",
)(
  { Id: S.String, RequestOrigin: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTableRequest extends S.Class<DeleteTableRequest>(
  "DeleteTableRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    Name: S.String,
    TransactionId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTableResponse extends S.Class<DeleteTableResponse>(
  "DeleteTableResponse",
)({}) {}
export class DeleteTableOptimizerRequest extends S.Class<DeleteTableOptimizerRequest>(
  "DeleteTableOptimizerRequest",
)(
  {
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Type: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTableOptimizerResponse extends S.Class<DeleteTableOptimizerResponse>(
  "DeleteTableOptimizerResponse",
)({}) {}
export class DeleteTableVersionRequest extends S.Class<DeleteTableVersionRequest>(
  "DeleteTableVersionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    VersionId: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTableVersionResponse extends S.Class<DeleteTableVersionResponse>(
  "DeleteTableVersionResponse",
)({}) {}
export class DeleteTriggerRequest extends S.Class<DeleteTriggerRequest>(
  "DeleteTriggerRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUsageProfileRequest extends S.Class<DeleteUsageProfileRequest>(
  "DeleteUsageProfileRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUsageProfileResponse extends S.Class<DeleteUsageProfileResponse>(
  "DeleteUsageProfileResponse",
)({}) {}
export class DeleteUserDefinedFunctionRequest extends S.Class<DeleteUserDefinedFunctionRequest>(
  "DeleteUserDefinedFunctionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    FunctionName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserDefinedFunctionResponse extends S.Class<DeleteUserDefinedFunctionResponse>(
  "DeleteUserDefinedFunctionResponse",
)({}) {}
export class DeleteWorkflowRequest extends S.Class<DeleteWorkflowRequest>(
  "DeleteWorkflowRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeConnectionTypeRequest extends S.Class<DescribeConnectionTypeRequest>(
  "DescribeConnectionTypeRequest",
)(
  { ConnectionType: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEntityRequest extends S.Class<DescribeEntityRequest>(
  "DescribeEntityRequest",
)(
  {
    ConnectionName: S.String,
    CatalogId: S.optional(S.String),
    EntityName: S.String,
    NextToken: S.optional(S.String),
    DataStoreApiVersion: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeInboundIntegrationsRequest extends S.Class<DescribeInboundIntegrationsRequest>(
  "DescribeInboundIntegrationsRequest",
)(
  {
    IntegrationArn: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    TargetArn: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBlueprintRequest extends S.Class<GetBlueprintRequest>(
  "GetBlueprintRequest",
)(
  {
    Name: S.String,
    IncludeBlueprint: S.optional(S.Boolean),
    IncludeParameterSpec: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBlueprintRunRequest extends S.Class<GetBlueprintRunRequest>(
  "GetBlueprintRunRequest",
)(
  { BlueprintName: S.String, RunId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetBlueprintRunsRequest extends S.Class<GetBlueprintRunsRequest>(
  "GetBlueprintRunsRequest",
)(
  {
    BlueprintName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCatalogRequest extends S.Class<GetCatalogRequest>(
  "GetCatalogRequest",
)(
  { CatalogId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCatalogImportStatusRequest extends S.Class<GetCatalogImportStatusRequest>(
  "GetCatalogImportStatusRequest",
)(
  { CatalogId: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCatalogsRequest extends S.Class<GetCatalogsRequest>(
  "GetCatalogsRequest",
)(
  {
    ParentCatalogId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Recursive: S.optional(S.Boolean),
    IncludeRoot: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetClassifierRequest extends S.Class<GetClassifierRequest>(
  "GetClassifierRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetClassifiersRequest extends S.Class<GetClassifiersRequest>(
  "GetClassifiersRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetColumnStatisticsForPartitionRequest extends S.Class<GetColumnStatisticsForPartitionRequest>(
  "GetColumnStatisticsForPartitionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValues: ValueStringList,
    ColumnNames: GetColumnNamesList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetColumnStatisticsForTableRequest extends S.Class<GetColumnStatisticsForTableRequest>(
  "GetColumnStatisticsForTableRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    ColumnNames: GetColumnNamesList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetColumnStatisticsTaskRunRequest extends S.Class<GetColumnStatisticsTaskRunRequest>(
  "GetColumnStatisticsTaskRunRequest",
)(
  { ColumnStatisticsTaskRunId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetColumnStatisticsTaskRunsRequest extends S.Class<GetColumnStatisticsTaskRunsRequest>(
  "GetColumnStatisticsTaskRunsRequest",
)(
  {
    DatabaseName: S.String,
    TableName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetColumnStatisticsTaskSettingsRequest extends S.Class<GetColumnStatisticsTaskSettingsRequest>(
  "GetColumnStatisticsTaskSettingsRequest",
)(
  { DatabaseName: S.String, TableName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetConnectionRequest extends S.Class<GetConnectionRequest>(
  "GetConnectionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    Name: S.String,
    HidePassword: S.optional(S.Boolean),
    ApplyOverrideForComputeEnvironment: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCrawlerRequest extends S.Class<GetCrawlerRequest>(
  "GetCrawlerRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCrawlerMetricsRequest extends S.Class<GetCrawlerMetricsRequest>(
  "GetCrawlerMetricsRequest",
)(
  {
    CrawlerNameList: S.optional(CrawlerNameList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCrawlersRequest extends S.Class<GetCrawlersRequest>(
  "GetCrawlersRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetCustomEntityTypeRequest extends S.Class<GetCustomEntityTypeRequest>(
  "GetCustomEntityTypeRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDatabaseRequest extends S.Class<GetDatabaseRequest>(
  "GetDatabaseRequest",
)(
  { CatalogId: S.optional(S.String), Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDatabasesRequest extends S.Class<GetDatabasesRequest>(
  "GetDatabasesRequest",
)(
  {
    CatalogId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResourceShareType: S.optional(S.String),
    AttributesToGet: S.optional(DatabaseAttributesList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDataCatalogEncryptionSettingsRequest extends S.Class<GetDataCatalogEncryptionSettingsRequest>(
  "GetDataCatalogEncryptionSettingsRequest",
)(
  { CatalogId: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDataflowGraphRequest extends S.Class<GetDataflowGraphRequest>(
  "GetDataflowGraphRequest",
)(
  { PythonScript: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDataQualityModelRequest extends S.Class<GetDataQualityModelRequest>(
  "GetDataQualityModelRequest",
)(
  { StatisticId: S.optional(S.String), ProfileId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDataQualityModelResultRequest extends S.Class<GetDataQualityModelResultRequest>(
  "GetDataQualityModelResultRequest",
)(
  { StatisticId: S.String, ProfileId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDataQualityResultRequest extends S.Class<GetDataQualityResultRequest>(
  "GetDataQualityResultRequest",
)(
  { ResultId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDataQualityRuleRecommendationRunRequest extends S.Class<GetDataQualityRuleRecommendationRunRequest>(
  "GetDataQualityRuleRecommendationRunRequest",
)(
  { RunId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDataQualityRulesetRequest extends S.Class<GetDataQualityRulesetRequest>(
  "GetDataQualityRulesetRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDataQualityRulesetEvaluationRunRequest extends S.Class<GetDataQualityRulesetEvaluationRunRequest>(
  "GetDataQualityRulesetEvaluationRunRequest",
)(
  { RunId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDevEndpointRequest extends S.Class<GetDevEndpointRequest>(
  "GetDevEndpointRequest",
)(
  { EndpointName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetDevEndpointsRequest extends S.Class<GetDevEndpointsRequest>(
  "GetDevEndpointsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetGlueIdentityCenterConfigurationResponse extends S.Class<GetGlueIdentityCenterConfigurationResponse>(
  "GetGlueIdentityCenterConfigurationResponse",
)({
  ApplicationArn: S.optional(S.String),
  InstanceArn: S.optional(S.String),
  Scopes: S.optional(OrchestrationStringList),
  UserBackgroundSessionsEnabled: S.optional(S.Boolean),
}) {}
export class GetIntegrationResourcePropertyRequest extends S.Class<GetIntegrationResourcePropertyRequest>(
  "GetIntegrationResourcePropertyRequest",
)(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIntegrationTablePropertiesRequest extends S.Class<GetIntegrationTablePropertiesRequest>(
  "GetIntegrationTablePropertiesRequest",
)(
  { ResourceArn: S.String, TableName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetJobRequest extends S.Class<GetJobRequest>("GetJobRequest")(
  { JobName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetJobBookmarkRequest extends S.Class<GetJobBookmarkRequest>(
  "GetJobBookmarkRequest",
)(
  { JobName: S.String, RunId: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetJobRunRequest extends S.Class<GetJobRunRequest>(
  "GetJobRunRequest",
)(
  {
    JobName: S.String,
    RunId: S.String,
    PredecessorsIncluded: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetJobRunsRequest extends S.Class<GetJobRunsRequest>(
  "GetJobRunsRequest",
)(
  {
    JobName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetJobsRequest extends S.Class<GetJobsRequest>("GetJobsRequest")(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMLTaskRunRequest extends S.Class<GetMLTaskRunRequest>(
  "GetMLTaskRunRequest",
)(
  { TransformId: S.String, TaskRunId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMLTransformRequest extends S.Class<GetMLTransformRequest>(
  "GetMLTransformRequest",
)(
  { TransformId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPartitionRequest extends S.Class<GetPartitionRequest>(
  "GetPartitionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValues: ValueStringList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPartitionIndexesRequest extends S.Class<GetPartitionIndexesRequest>(
  "GetPartitionIndexesRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRegistryInput extends S.Class<GetRegistryInput>(
  "GetRegistryInput",
)(
  { RegistryId: RegistryId },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePoliciesRequest extends S.Class<GetResourcePoliciesRequest>(
  "GetResourcePoliciesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetResourcePolicyRequest extends S.Class<GetResourcePolicyRequest>(
  "GetResourcePolicyRequest",
)(
  { ResourceArn: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSchemaInput extends S.Class<GetSchemaInput>("GetSchemaInput")(
  { SchemaId: SchemaId },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSchemaByDefinitionInput extends S.Class<GetSchemaByDefinitionInput>(
  "GetSchemaByDefinitionInput",
)(
  { SchemaId: SchemaId, SchemaDefinition: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SchemaVersionNumber extends S.Class<SchemaVersionNumber>(
  "SchemaVersionNumber",
)({
  LatestVersion: S.optional(S.Boolean),
  VersionNumber: S.optional(S.Number),
}) {}
export class GetSchemaVersionsDiffInput extends S.Class<GetSchemaVersionsDiffInput>(
  "GetSchemaVersionsDiffInput",
)(
  {
    SchemaId: SchemaId,
    FirstSchemaVersionNumber: SchemaVersionNumber,
    SecondSchemaVersionNumber: SchemaVersionNumber,
    SchemaDiffType: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSecurityConfigurationRequest extends S.Class<GetSecurityConfigurationRequest>(
  "GetSecurityConfigurationRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSecurityConfigurationsRequest extends S.Class<GetSecurityConfigurationsRequest>(
  "GetSecurityConfigurationsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSessionRequest extends S.Class<GetSessionRequest>(
  "GetSessionRequest",
)(
  { Id: S.String, RequestOrigin: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetStatementRequest extends S.Class<GetStatementRequest>(
  "GetStatementRequest",
)(
  { SessionId: S.String, Id: S.Number, RequestOrigin: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTableOptimizerRequest extends S.Class<GetTableOptimizerRequest>(
  "GetTableOptimizerRequest",
)(
  {
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Type: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const AuditColumnNamesList = S.Array(S.String);
export class AuditContext extends S.Class<AuditContext>("AuditContext")({
  AdditionalAuditContext: S.optional(S.String),
  RequestedColumns: S.optional(AuditColumnNamesList),
  AllColumnsRequested: S.optional(S.Boolean),
}) {}
export class GetTablesRequest extends S.Class<GetTablesRequest>(
  "GetTablesRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    Expression: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    TransactionId: S.optional(S.String),
    QueryAsOfTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AuditContext: S.optional(AuditContext),
    IncludeStatusDetails: S.optional(S.Boolean),
    AttributesToGet: S.optional(TableAttributesList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTableVersionRequest extends S.Class<GetTableVersionRequest>(
  "GetTableVersionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    VersionId: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTableVersionsRequest extends S.Class<GetTableVersionsRequest>(
  "GetTableVersionsRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTagsRequest extends S.Class<GetTagsRequest>("GetTagsRequest")(
  { ResourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTriggerRequest extends S.Class<GetTriggerRequest>(
  "GetTriggerRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTriggersRequest extends S.Class<GetTriggersRequest>(
  "GetTriggersRequest",
)(
  {
    NextToken: S.optional(S.String),
    DependentJobName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Segment extends S.Class<Segment>("Segment")({
  SegmentNumber: S.Number,
  TotalSegments: S.Number,
}) {}
export const AdditionalContextMap = S.Record({
  key: S.String,
  value: S.String,
});
export class QuerySessionContext extends S.Class<QuerySessionContext>(
  "QuerySessionContext",
)({
  QueryId: S.optional(S.String),
  QueryStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ClusterId: S.optional(S.String),
  QueryAuthorizationId: S.optional(S.String),
  AdditionalContext: S.optional(AdditionalContextMap),
}) {}
export class GetUnfilteredPartitionsMetadataRequest extends S.Class<GetUnfilteredPartitionsMetadataRequest>(
  "GetUnfilteredPartitionsMetadataRequest",
)(
  {
    Region: S.optional(S.String),
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Expression: S.optional(S.String),
    AuditContext: S.optional(AuditContext),
    SupportedPermissionTypes: PermissionTypeList,
    NextToken: S.optional(S.String),
    Segment: S.optional(Segment),
    MaxResults: S.optional(S.Number),
    QuerySessionContext: S.optional(QuerySessionContext),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUsageProfileRequest extends S.Class<GetUsageProfileRequest>(
  "GetUsageProfileRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUserDefinedFunctionRequest extends S.Class<GetUserDefinedFunctionRequest>(
  "GetUserDefinedFunctionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    FunctionName: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUserDefinedFunctionsRequest extends S.Class<GetUserDefinedFunctionsRequest>(
  "GetUserDefinedFunctionsRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    Pattern: S.String,
    FunctionType: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetWorkflowRequest extends S.Class<GetWorkflowRequest>(
  "GetWorkflowRequest",
)(
  { Name: S.String, IncludeGraph: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetWorkflowRunRequest extends S.Class<GetWorkflowRunRequest>(
  "GetWorkflowRunRequest",
)(
  { Name: S.String, RunId: S.String, IncludeGraph: S.optional(S.Boolean) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetWorkflowRunPropertiesRequest extends S.Class<GetWorkflowRunPropertiesRequest>(
  "GetWorkflowRunPropertiesRequest",
)(
  { Name: S.String, RunId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetWorkflowRunsRequest extends S.Class<GetWorkflowRunsRequest>(
  "GetWorkflowRunsRequest",
)(
  {
    Name: S.String,
    IncludeGraph: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportCatalogToGlueRequest extends S.Class<ImportCatalogToGlueRequest>(
  "ImportCatalogToGlueRequest",
)(
  { CatalogId: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ImportCatalogToGlueResponse extends S.Class<ImportCatalogToGlueResponse>(
  "ImportCatalogToGlueResponse",
)({}) {}
export class ListBlueprintsRequest extends S.Class<ListBlueprintsRequest>(
  "ListBlueprintsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListColumnStatisticsTaskRunsRequest extends S.Class<ListColumnStatisticsTaskRunsRequest>(
  "ListColumnStatisticsTaskRunsRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListConnectionTypesRequest extends S.Class<ListConnectionTypesRequest>(
  "ListConnectionTypesRequest",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCrawlersRequest extends S.Class<ListCrawlersRequest>(
  "ListCrawlersRequest",
)(
  {
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListCustomEntityTypesRequest extends S.Class<ListCustomEntityTypesRequest>(
  "ListCustomEntityTypesRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TimestampFilter extends S.Class<TimestampFilter>(
  "TimestampFilter",
)({
  RecordedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RecordedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class ListDataQualityStatisticsRequest extends S.Class<ListDataQualityStatisticsRequest>(
  "ListDataQualityStatisticsRequest",
)(
  {
    StatisticId: S.optional(S.String),
    ProfileId: S.optional(S.String),
    TimestampFilter: S.optional(TimestampFilter),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDevEndpointsRequest extends S.Class<ListDevEndpointsRequest>(
  "ListDevEndpointsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListEntitiesRequest extends S.Class<ListEntitiesRequest>(
  "ListEntitiesRequest",
)(
  {
    ConnectionName: S.optional(S.String),
    CatalogId: S.optional(S.String),
    ParentEntityName: S.optional(S.String),
    NextToken: S.optional(S.String),
    DataStoreApiVersion: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListJobsRequest extends S.Class<ListJobsRequest>(
  "ListJobsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SchemaColumn extends S.Class<SchemaColumn>("SchemaColumn")({
  Name: S.optional(S.String),
  DataType: S.optional(S.String),
}) {}
export const TransformSchema = S.Array(SchemaColumn);
export class TransformFilterCriteria extends S.Class<TransformFilterCriteria>(
  "TransformFilterCriteria",
)({
  Name: S.optional(S.String),
  TransformType: S.optional(S.String),
  Status: S.optional(S.String),
  GlueVersion: S.optional(S.String),
  CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBefore: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastModifiedAfter: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  Schema: S.optional(TransformSchema),
}) {}
export class TransformSortCriteria extends S.Class<TransformSortCriteria>(
  "TransformSortCriteria",
)({ Column: S.String, SortDirection: S.String }) {}
export class ListMLTransformsRequest extends S.Class<ListMLTransformsRequest>(
  "ListMLTransformsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filter: S.optional(TransformFilterCriteria),
    Sort: S.optional(TransformSortCriteria),
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListRegistriesInput extends S.Class<ListRegistriesInput>(
  "ListRegistriesInput",
)(
  { MaxResults: S.optional(S.Number), NextToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSchemasInput extends S.Class<ListSchemasInput>(
  "ListSchemasInput",
)(
  {
    RegistryId: S.optional(RegistryId),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSchemaVersionsInput extends S.Class<ListSchemaVersionsInput>(
  "ListSchemaVersionsInput",
)(
  {
    SchemaId: SchemaId,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListSessionsRequest extends S.Class<ListSessionsRequest>(
  "ListSessionsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Tags: S.optional(TagsMap),
    RequestOrigin: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListStatementsRequest extends S.Class<ListStatementsRequest>(
  "ListStatementsRequest",
)(
  {
    SessionId: S.String,
    RequestOrigin: S.optional(S.String),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTableOptimizerRunsRequest extends S.Class<ListTableOptimizerRunsRequest>(
  "ListTableOptimizerRunsRequest",
)(
  {
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Type: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTriggersRequest extends S.Class<ListTriggersRequest>(
  "ListTriggersRequest",
)(
  {
    NextToken: S.optional(S.String),
    DependentJobName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListUsageProfilesRequest extends S.Class<ListUsageProfilesRequest>(
  "ListUsageProfilesRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListWorkflowsRequest extends S.Class<ListWorkflowsRequest>(
  "ListWorkflowsRequest",
)(
  { NextToken: S.optional(S.String), MaxResults: S.optional(S.Number) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const IntegrationSourcePropertiesMap = S.Record({
  key: S.String,
  value: S.String,
});
export class IntegrationConfig extends S.Class<IntegrationConfig>(
  "IntegrationConfig",
)({
  RefreshInterval: S.optional(S.String),
  SourceProperties: S.optional(IntegrationSourcePropertiesMap),
  ContinuousSync: S.optional(S.Boolean),
}) {}
export class ModifyIntegrationRequest extends S.Class<ModifyIntegrationRequest>(
  "ModifyIntegrationRequest",
)(
  {
    IntegrationIdentifier: S.String,
    Description: S.optional(S.String),
    DataFilter: S.optional(S.String),
    IntegrationConfig: S.optional(IntegrationConfig),
    IntegrationName: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDataQualityProfileAnnotationRequest extends S.Class<PutDataQualityProfileAnnotationRequest>(
  "PutDataQualityProfileAnnotationRequest",
)(
  { ProfileId: S.String, InclusionAnnotation: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDataQualityProfileAnnotationResponse extends S.Class<PutDataQualityProfileAnnotationResponse>(
  "PutDataQualityProfileAnnotationResponse",
)({}) {}
export class PutResourcePolicyRequest extends S.Class<PutResourcePolicyRequest>(
  "PutResourcePolicyRequest",
)(
  {
    PolicyInJson: S.String,
    ResourceArn: S.optional(S.String),
    PolicyHashCondition: S.optional(S.String),
    PolicyExistsCondition: S.optional(S.String),
    EnableHybrid: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const WorkflowRunProperties = S.Record({
  key: S.String,
  value: S.String,
});
export class PutWorkflowRunPropertiesRequest extends S.Class<PutWorkflowRunPropertiesRequest>(
  "PutWorkflowRunPropertiesRequest",
)(
  { Name: S.String, RunId: S.String, RunProperties: WorkflowRunProperties },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutWorkflowRunPropertiesResponse extends S.Class<PutWorkflowRunPropertiesResponse>(
  "PutWorkflowRunPropertiesResponse",
)({}) {}
export class QuerySchemaVersionMetadataInput extends S.Class<QuerySchemaVersionMetadataInput>(
  "QuerySchemaVersionMetadataInput",
)(
  {
    SchemaId: S.optional(SchemaId),
    SchemaVersionNumber: S.optional(SchemaVersionNumber),
    SchemaVersionId: S.optional(S.String),
    MetadataList: S.optional(MetadataList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterSchemaVersionInput extends S.Class<RegisterSchemaVersionInput>(
  "RegisterSchemaVersionInput",
)(
  { SchemaId: SchemaId, SchemaDefinition: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveSchemaVersionMetadataInput extends S.Class<RemoveSchemaVersionMetadataInput>(
  "RemoveSchemaVersionMetadataInput",
)(
  {
    SchemaId: S.optional(SchemaId),
    SchemaVersionNumber: S.optional(SchemaVersionNumber),
    SchemaVersionId: S.optional(S.String),
    MetadataKeyValue: MetadataKeyValuePair,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResetJobBookmarkRequest extends S.Class<ResetJobBookmarkRequest>(
  "ResetJobBookmarkRequest",
)(
  { JobName: S.String, RunId: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResumeWorkflowRunRequest extends S.Class<ResumeWorkflowRunRequest>(
  "ResumeWorkflowRunRequest",
)(
  { Name: S.String, RunId: S.String, NodeIds: NodeIdList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RunStatementRequest extends S.Class<RunStatementRequest>(
  "RunStatementRequest",
)(
  { SessionId: S.String, Code: S.String, RequestOrigin: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartBlueprintRunRequest extends S.Class<StartBlueprintRunRequest>(
  "StartBlueprintRunRequest",
)(
  {
    BlueprintName: S.String,
    Parameters: S.optional(S.String),
    RoleArn: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartColumnStatisticsTaskRunRequest extends S.Class<StartColumnStatisticsTaskRunRequest>(
  "StartColumnStatisticsTaskRunRequest",
)(
  {
    DatabaseName: S.String,
    TableName: S.String,
    ColumnNameList: S.optional(ColumnNameList),
    Role: S.String,
    SampleSize: S.optional(S.Number),
    CatalogID: S.optional(S.String),
    SecurityConfiguration: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartColumnStatisticsTaskRunScheduleRequest extends S.Class<StartColumnStatisticsTaskRunScheduleRequest>(
  "StartColumnStatisticsTaskRunScheduleRequest",
)(
  { DatabaseName: S.String, TableName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartColumnStatisticsTaskRunScheduleResponse extends S.Class<StartColumnStatisticsTaskRunScheduleResponse>(
  "StartColumnStatisticsTaskRunScheduleResponse",
)({}) {}
export class StartCrawlerRequest extends S.Class<StartCrawlerRequest>(
  "StartCrawlerRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartCrawlerResponse extends S.Class<StartCrawlerResponse>(
  "StartCrawlerResponse",
)({}) {}
export class StartCrawlerScheduleRequest extends S.Class<StartCrawlerScheduleRequest>(
  "StartCrawlerScheduleRequest",
)(
  { CrawlerName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartCrawlerScheduleResponse extends S.Class<StartCrawlerScheduleResponse>(
  "StartCrawlerScheduleResponse",
)({}) {}
export class StartExportLabelsTaskRunRequest extends S.Class<StartExportLabelsTaskRunRequest>(
  "StartExportLabelsTaskRunRequest",
)(
  { TransformId: S.String, OutputS3Path: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartImportLabelsTaskRunRequest extends S.Class<StartImportLabelsTaskRunRequest>(
  "StartImportLabelsTaskRunRequest",
)(
  {
    TransformId: S.String,
    InputS3Path: S.String,
    ReplaceAllLabels: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const GenericMap = S.Record({ key: S.String, value: S.String });
export class NotificationProperty extends S.Class<NotificationProperty>(
  "NotificationProperty",
)({ NotifyDelayAfter: S.optional(S.Number) }) {}
export class StartJobRunRequest extends S.Class<StartJobRunRequest>(
  "StartJobRunRequest",
)(
  {
    JobName: S.String,
    JobRunQueuingEnabled: S.optional(S.Boolean),
    JobRunId: S.optional(S.String),
    Arguments: S.optional(GenericMap),
    AllocatedCapacity: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
    SecurityConfiguration: S.optional(S.String),
    NotificationProperty: S.optional(NotificationProperty),
    WorkerType: S.optional(S.String),
    NumberOfWorkers: S.optional(S.Number),
    ExecutionClass: S.optional(S.String),
    ExecutionRoleSessionPolicy: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMLEvaluationTaskRunRequest extends S.Class<StartMLEvaluationTaskRunRequest>(
  "StartMLEvaluationTaskRunRequest",
)(
  { TransformId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartMLLabelingSetGenerationTaskRunRequest extends S.Class<StartMLLabelingSetGenerationTaskRunRequest>(
  "StartMLLabelingSetGenerationTaskRunRequest",
)(
  { TransformId: S.String, OutputS3Path: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartTriggerRequest extends S.Class<StartTriggerRequest>(
  "StartTriggerRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartWorkflowRunRequest extends S.Class<StartWorkflowRunRequest>(
  "StartWorkflowRunRequest",
)(
  { Name: S.String, RunProperties: S.optional(WorkflowRunProperties) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopColumnStatisticsTaskRunRequest extends S.Class<StopColumnStatisticsTaskRunRequest>(
  "StopColumnStatisticsTaskRunRequest",
)(
  { DatabaseName: S.String, TableName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopColumnStatisticsTaskRunResponse extends S.Class<StopColumnStatisticsTaskRunResponse>(
  "StopColumnStatisticsTaskRunResponse",
)({}) {}
export class StopColumnStatisticsTaskRunScheduleRequest extends S.Class<StopColumnStatisticsTaskRunScheduleRequest>(
  "StopColumnStatisticsTaskRunScheduleRequest",
)(
  { DatabaseName: S.String, TableName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopColumnStatisticsTaskRunScheduleResponse extends S.Class<StopColumnStatisticsTaskRunScheduleResponse>(
  "StopColumnStatisticsTaskRunScheduleResponse",
)({}) {}
export class StopCrawlerRequest extends S.Class<StopCrawlerRequest>(
  "StopCrawlerRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopCrawlerResponse extends S.Class<StopCrawlerResponse>(
  "StopCrawlerResponse",
)({}) {}
export class StopCrawlerScheduleRequest extends S.Class<StopCrawlerScheduleRequest>(
  "StopCrawlerScheduleRequest",
)(
  { CrawlerName: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopCrawlerScheduleResponse extends S.Class<StopCrawlerScheduleResponse>(
  "StopCrawlerScheduleResponse",
)({}) {}
export class StopSessionRequest extends S.Class<StopSessionRequest>(
  "StopSessionRequest",
)(
  { Id: S.String, RequestOrigin: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTriggerRequest extends S.Class<StopTriggerRequest>(
  "StopTriggerRequest",
)(
  { Name: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopWorkflowRunRequest extends S.Class<StopWorkflowRunRequest>(
  "StopWorkflowRunRequest",
)(
  { Name: S.String, RunId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopWorkflowRunResponse extends S.Class<StopWorkflowRunResponse>(
  "StopWorkflowRunResponse",
)({}) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { ResourceArn: S.String, TagsToAdd: TagsMap },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { ResourceArn: S.String, TagsToRemove: TagKeysList },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class UpdateBlueprintRequest extends S.Class<UpdateBlueprintRequest>(
  "UpdateBlueprintRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    BlueprintLocation: S.String,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FederatedCatalog extends S.Class<FederatedCatalog>(
  "FederatedCatalog",
)({
  Identifier: S.optional(S.String),
  ConnectionName: S.optional(S.String),
  ConnectionType: S.optional(S.String),
}) {}
export class TargetRedshiftCatalog extends S.Class<TargetRedshiftCatalog>(
  "TargetRedshiftCatalog",
)({ CatalogArn: S.String }) {}
export class DataLakeAccessProperties extends S.Class<DataLakeAccessProperties>(
  "DataLakeAccessProperties",
)({
  DataLakeAccess: S.optional(S.Boolean),
  DataTransferRole: S.optional(S.String),
  KmsKey: S.optional(S.String),
  CatalogType: S.optional(S.String),
}) {}
export class IcebergOptimizationProperties extends S.Class<IcebergOptimizationProperties>(
  "IcebergOptimizationProperties",
)({
  RoleArn: S.optional(S.String),
  Compaction: S.optional(ParametersMap),
  Retention: S.optional(ParametersMap),
  OrphanFileDeletion: S.optional(ParametersMap),
}) {}
export class CatalogProperties extends S.Class<CatalogProperties>(
  "CatalogProperties",
)({
  DataLakeAccessProperties: S.optional(DataLakeAccessProperties),
  IcebergOptimizationProperties: S.optional(IcebergOptimizationProperties),
  CustomProperties: S.optional(ParametersMap),
}) {}
export class DataLakePrincipal extends S.Class<DataLakePrincipal>(
  "DataLakePrincipal",
)({ DataLakePrincipalIdentifier: S.optional(S.String) }) {}
export class PrincipalPermissions extends S.Class<PrincipalPermissions>(
  "PrincipalPermissions",
)({
  Principal: S.optional(DataLakePrincipal),
  Permissions: S.optional(PermissionList),
}) {}
export const PrincipalPermissionsList = S.Array(PrincipalPermissions);
export class CatalogInput extends S.Class<CatalogInput>("CatalogInput")({
  Description: S.optional(S.String),
  FederatedCatalog: S.optional(FederatedCatalog),
  Parameters: S.optional(ParametersMap),
  TargetRedshiftCatalog: S.optional(TargetRedshiftCatalog),
  CatalogProperties: S.optional(CatalogProperties),
  CreateTableDefaultPermissions: S.optional(PrincipalPermissionsList),
  CreateDatabaseDefaultPermissions: S.optional(PrincipalPermissionsList),
  AllowFullTableExternalDataAccess: S.optional(S.String),
}) {}
export class UpdateCatalogRequest extends S.Class<UpdateCatalogRequest>(
  "UpdateCatalogRequest",
)(
  { CatalogId: S.String, CatalogInput: CatalogInput },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCatalogResponse extends S.Class<UpdateCatalogResponse>(
  "UpdateCatalogResponse",
)({}) {}
export class BooleanColumnStatisticsData extends S.Class<BooleanColumnStatisticsData>(
  "BooleanColumnStatisticsData",
)({
  NumberOfTrues: S.Number,
  NumberOfFalses: S.Number,
  NumberOfNulls: S.Number,
}) {}
export class DateColumnStatisticsData extends S.Class<DateColumnStatisticsData>(
  "DateColumnStatisticsData",
)({
  MinimumValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  MaximumValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  NumberOfNulls: S.Number,
  NumberOfDistinctValues: S.Number,
}) {}
export class DecimalNumber extends S.Class<DecimalNumber>("DecimalNumber")({
  UnscaledValue: T.Blob,
  Scale: S.Number,
}) {}
export class DecimalColumnStatisticsData extends S.Class<DecimalColumnStatisticsData>(
  "DecimalColumnStatisticsData",
)({
  MinimumValue: S.optional(DecimalNumber),
  MaximumValue: S.optional(DecimalNumber),
  NumberOfNulls: S.Number,
  NumberOfDistinctValues: S.Number,
}) {}
export class DoubleColumnStatisticsData extends S.Class<DoubleColumnStatisticsData>(
  "DoubleColumnStatisticsData",
)({
  MinimumValue: S.optional(S.Number),
  MaximumValue: S.optional(S.Number),
  NumberOfNulls: S.Number,
  NumberOfDistinctValues: S.Number,
}) {}
export class LongColumnStatisticsData extends S.Class<LongColumnStatisticsData>(
  "LongColumnStatisticsData",
)({
  MinimumValue: S.optional(S.Number),
  MaximumValue: S.optional(S.Number),
  NumberOfNulls: S.Number,
  NumberOfDistinctValues: S.Number,
}) {}
export class StringColumnStatisticsData extends S.Class<StringColumnStatisticsData>(
  "StringColumnStatisticsData",
)({
  MaximumLength: S.Number,
  AverageLength: S.Number,
  NumberOfNulls: S.Number,
  NumberOfDistinctValues: S.Number,
}) {}
export class BinaryColumnStatisticsData extends S.Class<BinaryColumnStatisticsData>(
  "BinaryColumnStatisticsData",
)({
  MaximumLength: S.Number,
  AverageLength: S.Number,
  NumberOfNulls: S.Number,
}) {}
export class ColumnStatisticsData extends S.Class<ColumnStatisticsData>(
  "ColumnStatisticsData",
)({
  Type: S.String,
  BooleanColumnStatisticsData: S.optional(BooleanColumnStatisticsData),
  DateColumnStatisticsData: S.optional(DateColumnStatisticsData),
  DecimalColumnStatisticsData: S.optional(DecimalColumnStatisticsData),
  DoubleColumnStatisticsData: S.optional(DoubleColumnStatisticsData),
  LongColumnStatisticsData: S.optional(LongColumnStatisticsData),
  StringColumnStatisticsData: S.optional(StringColumnStatisticsData),
  BinaryColumnStatisticsData: S.optional(BinaryColumnStatisticsData),
}) {}
export class ColumnStatistics extends S.Class<ColumnStatistics>(
  "ColumnStatistics",
)({
  ColumnName: S.String,
  ColumnType: S.String,
  AnalyzedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  StatisticsData: ColumnStatisticsData,
}) {}
export const UpdateColumnStatisticsList = S.Array(ColumnStatistics);
export class UpdateColumnStatisticsForTableRequest extends S.Class<UpdateColumnStatisticsForTableRequest>(
  "UpdateColumnStatisticsForTableRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    ColumnStatisticsList: UpdateColumnStatisticsList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateColumnStatisticsTaskSettingsRequest extends S.Class<UpdateColumnStatisticsTaskSettingsRequest>(
  "UpdateColumnStatisticsTaskSettingsRequest",
)(
  {
    DatabaseName: S.String,
    TableName: S.String,
    Role: S.optional(S.String),
    Schedule: S.optional(S.String),
    ColumnNameList: S.optional(ColumnNameList),
    SampleSize: S.optional(S.Number),
    CatalogID: S.optional(S.String),
    SecurityConfiguration: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateColumnStatisticsTaskSettingsResponse extends S.Class<UpdateColumnStatisticsTaskSettingsResponse>(
  "UpdateColumnStatisticsTaskSettingsResponse",
)({}) {}
export const MatchCriteria = S.Array(S.String);
export const ConnectionProperties = S.Record({
  key: S.String,
  value: S.String,
});
export const PropertyMap = S.Record({ key: S.String, value: S.String });
export const SecurityGroupIdList = S.Array(S.String);
export class PhysicalConnectionRequirements extends S.Class<PhysicalConnectionRequirements>(
  "PhysicalConnectionRequirements",
)({
  SubnetId: S.optional(S.String),
  SecurityGroupIdList: S.optional(SecurityGroupIdList),
  AvailabilityZone: S.optional(S.String),
}) {}
export class OAuth2ClientApplication extends S.Class<OAuth2ClientApplication>(
  "OAuth2ClientApplication",
)({
  UserManagedClientApplicationClientId: S.optional(S.String),
  AWSManagedClientApplicationReference: S.optional(S.String),
}) {}
export const TokenUrlParametersMap = S.Record({
  key: S.String,
  value: S.String,
});
export class AuthorizationCodeProperties extends S.Class<AuthorizationCodeProperties>(
  "AuthorizationCodeProperties",
)({
  AuthorizationCode: S.optional(S.String),
  RedirectUri: S.optional(S.String),
}) {}
export class OAuth2Credentials extends S.Class<OAuth2Credentials>(
  "OAuth2Credentials",
)({
  UserManagedClientApplicationClientSecret: S.optional(S.String),
  AccessToken: S.optional(S.String),
  RefreshToken: S.optional(S.String),
  JwtToken: S.optional(S.String),
}) {}
export class OAuth2PropertiesInput extends S.Class<OAuth2PropertiesInput>(
  "OAuth2PropertiesInput",
)({
  OAuth2GrantType: S.optional(S.String),
  OAuth2ClientApplication: S.optional(OAuth2ClientApplication),
  TokenUrl: S.optional(S.String),
  TokenUrlParametersMap: S.optional(TokenUrlParametersMap),
  AuthorizationCodeProperties: S.optional(AuthorizationCodeProperties),
  OAuth2Credentials: S.optional(OAuth2Credentials),
}) {}
export class BasicAuthenticationCredentials extends S.Class<BasicAuthenticationCredentials>(
  "BasicAuthenticationCredentials",
)({ Username: S.optional(S.String), Password: S.optional(S.String) }) {}
export const CredentialMap = S.Record({ key: S.String, value: S.String });
export class AuthenticationConfigurationInput extends S.Class<AuthenticationConfigurationInput>(
  "AuthenticationConfigurationInput",
)({
  AuthenticationType: S.optional(S.String),
  OAuth2Properties: S.optional(OAuth2PropertiesInput),
  SecretArn: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
  BasicAuthenticationCredentials: S.optional(BasicAuthenticationCredentials),
  CustomAuthenticationCredentials: S.optional(CredentialMap),
}) {}
export const ComputeEnvironmentList = S.Array(S.String);
export class ConnectionInput extends S.Class<ConnectionInput>(
  "ConnectionInput",
)({
  Name: S.String,
  Description: S.optional(S.String),
  ConnectionType: S.String,
  MatchCriteria: S.optional(MatchCriteria),
  ConnectionProperties: ConnectionProperties,
  SparkProperties: S.optional(PropertyMap),
  AthenaProperties: S.optional(PropertyMap),
  PythonProperties: S.optional(PropertyMap),
  PhysicalConnectionRequirements: S.optional(PhysicalConnectionRequirements),
  AuthenticationConfiguration: S.optional(AuthenticationConfigurationInput),
  ValidateCredentials: S.optional(S.Boolean),
  ValidateForComputeEnvironments: S.optional(ComputeEnvironmentList),
}) {}
export class UpdateConnectionRequest extends S.Class<UpdateConnectionRequest>(
  "UpdateConnectionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    Name: S.String,
    ConnectionInput: ConnectionInput,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateConnectionResponse extends S.Class<UpdateConnectionResponse>(
  "UpdateConnectionResponse",
)({}) {}
export const PathList = S.Array(S.String);
export class S3Target extends S.Class<S3Target>("S3Target")({
  Path: S.optional(S.String),
  Exclusions: S.optional(PathList),
  ConnectionName: S.optional(S.String),
  SampleSize: S.optional(S.Number),
  EventQueueArn: S.optional(S.String),
  DlqEventQueueArn: S.optional(S.String),
}) {}
export const S3TargetList = S.Array(S3Target);
export const EnableAdditionalMetadata = S.Array(S.String);
export class JdbcTarget extends S.Class<JdbcTarget>("JdbcTarget")({
  ConnectionName: S.optional(S.String),
  Path: S.optional(S.String),
  Exclusions: S.optional(PathList),
  EnableAdditionalMetadata: S.optional(EnableAdditionalMetadata),
}) {}
export const JdbcTargetList = S.Array(JdbcTarget);
export class MongoDBTarget extends S.Class<MongoDBTarget>("MongoDBTarget")({
  ConnectionName: S.optional(S.String),
  Path: S.optional(S.String),
  ScanAll: S.optional(S.Boolean),
}) {}
export const MongoDBTargetList = S.Array(MongoDBTarget);
export class DynamoDBTarget extends S.Class<DynamoDBTarget>("DynamoDBTarget")({
  Path: S.optional(S.String),
  scanAll: S.optional(S.Boolean),
  scanRate: S.optional(S.Number),
}) {}
export const DynamoDBTargetList = S.Array(DynamoDBTarget);
export const CatalogTablesList = S.Array(S.String);
export class CatalogTarget extends S.Class<CatalogTarget>("CatalogTarget")({
  DatabaseName: S.String,
  Tables: CatalogTablesList,
  ConnectionName: S.optional(S.String),
  EventQueueArn: S.optional(S.String),
  DlqEventQueueArn: S.optional(S.String),
}) {}
export const CatalogTargetList = S.Array(CatalogTarget);
export class DeltaTarget extends S.Class<DeltaTarget>("DeltaTarget")({
  DeltaTables: S.optional(PathList),
  ConnectionName: S.optional(S.String),
  WriteManifest: S.optional(S.Boolean),
  CreateNativeDeltaTable: S.optional(S.Boolean),
}) {}
export const DeltaTargetList = S.Array(DeltaTarget);
export class IcebergTarget extends S.Class<IcebergTarget>("IcebergTarget")({
  Paths: S.optional(PathList),
  ConnectionName: S.optional(S.String),
  Exclusions: S.optional(PathList),
  MaximumTraversalDepth: S.optional(S.Number),
}) {}
export const IcebergTargetList = S.Array(IcebergTarget);
export class HudiTarget extends S.Class<HudiTarget>("HudiTarget")({
  Paths: S.optional(PathList),
  ConnectionName: S.optional(S.String),
  Exclusions: S.optional(PathList),
  MaximumTraversalDepth: S.optional(S.Number),
}) {}
export const HudiTargetList = S.Array(HudiTarget);
export class CrawlerTargets extends S.Class<CrawlerTargets>("CrawlerTargets")({
  S3Targets: S.optional(S3TargetList),
  JdbcTargets: S.optional(JdbcTargetList),
  MongoDBTargets: S.optional(MongoDBTargetList),
  DynamoDBTargets: S.optional(DynamoDBTargetList),
  CatalogTargets: S.optional(CatalogTargetList),
  DeltaTargets: S.optional(DeltaTargetList),
  IcebergTargets: S.optional(IcebergTargetList),
  HudiTargets: S.optional(HudiTargetList),
}) {}
export class SchemaChangePolicy extends S.Class<SchemaChangePolicy>(
  "SchemaChangePolicy",
)({
  UpdateBehavior: S.optional(S.String),
  DeleteBehavior: S.optional(S.String),
}) {}
export class RecrawlPolicy extends S.Class<RecrawlPolicy>("RecrawlPolicy")({
  RecrawlBehavior: S.optional(S.String),
}) {}
export class LineageConfiguration extends S.Class<LineageConfiguration>(
  "LineageConfiguration",
)({ CrawlerLineageSettings: S.optional(S.String) }) {}
export class LakeFormationConfiguration extends S.Class<LakeFormationConfiguration>(
  "LakeFormationConfiguration",
)({
  UseLakeFormationCredentials: S.optional(S.Boolean),
  AccountId: S.optional(S.String),
}) {}
export class UpdateCrawlerRequest extends S.Class<UpdateCrawlerRequest>(
  "UpdateCrawlerRequest",
)(
  {
    Name: S.String,
    Role: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    Description: S.optional(S.String),
    Targets: S.optional(CrawlerTargets),
    Schedule: S.optional(S.String),
    Classifiers: S.optional(ClassifierNameList),
    TablePrefix: S.optional(S.String),
    SchemaChangePolicy: S.optional(SchemaChangePolicy),
    RecrawlPolicy: S.optional(RecrawlPolicy),
    LineageConfiguration: S.optional(LineageConfiguration),
    LakeFormationConfiguration: S.optional(LakeFormationConfiguration),
    Configuration: S.optional(S.String),
    CrawlerSecurityConfiguration: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCrawlerResponse extends S.Class<UpdateCrawlerResponse>(
  "UpdateCrawlerResponse",
)({}) {}
export class UpdateCrawlerScheduleRequest extends S.Class<UpdateCrawlerScheduleRequest>(
  "UpdateCrawlerScheduleRequest",
)(
  { CrawlerName: S.String, Schedule: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCrawlerScheduleResponse extends S.Class<UpdateCrawlerScheduleResponse>(
  "UpdateCrawlerScheduleResponse",
)({}) {}
export class DatabaseIdentifier extends S.Class<DatabaseIdentifier>(
  "DatabaseIdentifier",
)({
  CatalogId: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  Region: S.optional(S.String),
}) {}
export class FederatedDatabase extends S.Class<FederatedDatabase>(
  "FederatedDatabase",
)({
  Identifier: S.optional(S.String),
  ConnectionName: S.optional(S.String),
  ConnectionType: S.optional(S.String),
}) {}
export class DatabaseInput extends S.Class<DatabaseInput>("DatabaseInput")({
  Name: S.String,
  Description: S.optional(S.String),
  LocationUri: S.optional(S.String),
  Parameters: S.optional(ParametersMap),
  CreateTableDefaultPermissions: S.optional(PrincipalPermissionsList),
  TargetDatabase: S.optional(DatabaseIdentifier),
  FederatedDatabase: S.optional(FederatedDatabase),
}) {}
export class UpdateDatabaseRequest extends S.Class<UpdateDatabaseRequest>(
  "UpdateDatabaseRequest",
)(
  {
    CatalogId: S.optional(S.String),
    Name: S.String,
    DatabaseInput: DatabaseInput,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDatabaseResponse extends S.Class<UpdateDatabaseResponse>(
  "UpdateDatabaseResponse",
)({}) {}
export class UpdateDataQualityRulesetRequest extends S.Class<UpdateDataQualityRulesetRequest>(
  "UpdateDataQualityRulesetRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    Ruleset: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateGlueIdentityCenterConfigurationRequest extends S.Class<UpdateGlueIdentityCenterConfigurationRequest>(
  "UpdateGlueIdentityCenterConfigurationRequest",
)(
  {
    Scopes: S.optional(IdentityCenterScopesList),
    UserBackgroundSessionsEnabled: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateGlueIdentityCenterConfigurationResponse extends S.Class<UpdateGlueIdentityCenterConfigurationResponse>(
  "UpdateGlueIdentityCenterConfigurationResponse",
)({}) {}
export class SourceProcessingProperties extends S.Class<SourceProcessingProperties>(
  "SourceProcessingProperties",
)({ RoleArn: S.optional(S.String) }) {}
export class TargetProcessingProperties extends S.Class<TargetProcessingProperties>(
  "TargetProcessingProperties",
)({
  RoleArn: S.optional(S.String),
  KmsArn: S.optional(S.String),
  ConnectionName: S.optional(S.String),
  EventBusArn: S.optional(S.String),
}) {}
export class UpdateIntegrationResourcePropertyRequest extends S.Class<UpdateIntegrationResourcePropertyRequest>(
  "UpdateIntegrationResourcePropertyRequest",
)(
  {
    ResourceArn: S.String,
    SourceProcessingProperties: S.optional(SourceProcessingProperties),
    TargetProcessingProperties: S.optional(TargetProcessingProperties),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const SourceTableFieldsList = S.Array(S.String);
export const PrimaryKeyList = S.Array(S.String);
export class SourceTableConfig extends S.Class<SourceTableConfig>(
  "SourceTableConfig",
)({
  Fields: S.optional(SourceTableFieldsList),
  FilterPredicate: S.optional(S.String),
  PrimaryKey: S.optional(PrimaryKeyList),
  RecordUpdateField: S.optional(S.String),
}) {}
export class IntegrationPartition extends S.Class<IntegrationPartition>(
  "IntegrationPartition",
)({
  FieldName: S.optional(S.String),
  FunctionSpec: S.optional(S.String),
  ConversionSpec: S.optional(S.String),
}) {}
export const IntegrationPartitionSpecList = S.Array(IntegrationPartition);
export class TargetTableConfig extends S.Class<TargetTableConfig>(
  "TargetTableConfig",
)({
  UnnestSpec: S.optional(S.String),
  PartitionSpec: S.optional(IntegrationPartitionSpecList),
  TargetTableName: S.optional(S.String),
}) {}
export class UpdateIntegrationTablePropertiesRequest extends S.Class<UpdateIntegrationTablePropertiesRequest>(
  "UpdateIntegrationTablePropertiesRequest",
)(
  {
    ResourceArn: S.String,
    TableName: S.String,
    SourceTableConfig: S.optional(SourceTableConfig),
    TargetTableConfig: S.optional(TargetTableConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateIntegrationTablePropertiesResponse extends S.Class<UpdateIntegrationTablePropertiesResponse>(
  "UpdateIntegrationTablePropertiesResponse",
)({}) {}
export class UpdateJobFromSourceControlRequest extends S.Class<UpdateJobFromSourceControlRequest>(
  "UpdateJobFromSourceControlRequest",
)(
  {
    JobName: S.optional(S.String),
    Provider: S.optional(S.String),
    RepositoryName: S.optional(S.String),
    RepositoryOwner: S.optional(S.String),
    BranchName: S.optional(S.String),
    Folder: S.optional(S.String),
    CommitId: S.optional(S.String),
    AuthStrategy: S.optional(S.String),
    AuthToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FindMatchesParameters extends S.Class<FindMatchesParameters>(
  "FindMatchesParameters",
)({
  PrimaryKeyColumnName: S.optional(S.String),
  PrecisionRecallTradeoff: S.optional(S.Number),
  AccuracyCostTradeoff: S.optional(S.Number),
  EnforceProvidedLabels: S.optional(S.Boolean),
}) {}
export class TransformParameters extends S.Class<TransformParameters>(
  "TransformParameters",
)({
  TransformType: S.String,
  FindMatchesParameters: S.optional(FindMatchesParameters),
}) {}
export class UpdateMLTransformRequest extends S.Class<UpdateMLTransformRequest>(
  "UpdateMLTransformRequest",
)(
  {
    TransformId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Parameters: S.optional(TransformParameters),
    Role: S.optional(S.String),
    GlueVersion: S.optional(S.String),
    MaxCapacity: S.optional(S.Number),
    WorkerType: S.optional(S.String),
    NumberOfWorkers: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePartitionRequest extends S.Class<UpdatePartitionRequest>(
  "UpdatePartitionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValueList: BoundedPartitionValueList,
    PartitionInput: PartitionInput,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdatePartitionResponse extends S.Class<UpdatePartitionResponse>(
  "UpdatePartitionResponse",
)({}) {}
export class UpdateRegistryInput extends S.Class<UpdateRegistryInput>(
  "UpdateRegistryInput",
)(
  { RegistryId: RegistryId, Description: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSchemaInput extends S.Class<UpdateSchemaInput>(
  "UpdateSchemaInput",
)(
  {
    SchemaId: SchemaId,
    SchemaVersionNumber: S.optional(SchemaVersionNumber),
    Compatibility: S.optional(S.String),
    Description: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateSourceControlFromJobRequest extends S.Class<UpdateSourceControlFromJobRequest>(
  "UpdateSourceControlFromJobRequest",
)(
  {
    JobName: S.optional(S.String),
    Provider: S.optional(S.String),
    RepositoryName: S.optional(S.String),
    RepositoryOwner: S.optional(S.String),
    BranchName: S.optional(S.String),
    Folder: S.optional(S.String),
    CommitId: S.optional(S.String),
    AuthStrategy: S.optional(S.String),
    AuthToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const TableOptimizerVpcConfiguration = S.Union(
  S.Struct({ glueConnectionName: S.String }),
);
export class IcebergCompactionConfiguration extends S.Class<IcebergCompactionConfiguration>(
  "IcebergCompactionConfiguration",
)({
  strategy: S.optional(S.String),
  minInputFiles: S.optional(S.Number),
  deleteFileThreshold: S.optional(S.Number),
}) {}
export class CompactionConfiguration extends S.Class<CompactionConfiguration>(
  "CompactionConfiguration",
)({ icebergConfiguration: S.optional(IcebergCompactionConfiguration) }) {}
export class IcebergRetentionConfiguration extends S.Class<IcebergRetentionConfiguration>(
  "IcebergRetentionConfiguration",
)({
  snapshotRetentionPeriodInDays: S.optional(S.Number),
  numberOfSnapshotsToRetain: S.optional(S.Number),
  cleanExpiredFiles: S.optional(S.Boolean),
  runRateInHours: S.optional(S.Number),
}) {}
export class RetentionConfiguration extends S.Class<RetentionConfiguration>(
  "RetentionConfiguration",
)({ icebergConfiguration: S.optional(IcebergRetentionConfiguration) }) {}
export class IcebergOrphanFileDeletionConfiguration extends S.Class<IcebergOrphanFileDeletionConfiguration>(
  "IcebergOrphanFileDeletionConfiguration",
)({
  orphanFileRetentionPeriodInDays: S.optional(S.Number),
  location: S.optional(S.String),
  runRateInHours: S.optional(S.Number),
}) {}
export class OrphanFileDeletionConfiguration extends S.Class<OrphanFileDeletionConfiguration>(
  "OrphanFileDeletionConfiguration",
)({
  icebergConfiguration: S.optional(IcebergOrphanFileDeletionConfiguration),
}) {}
export class TableOptimizerConfiguration extends S.Class<TableOptimizerConfiguration>(
  "TableOptimizerConfiguration",
)({
  roleArn: S.optional(S.String),
  enabled: S.optional(S.Boolean),
  vpcConfiguration: S.optional(TableOptimizerVpcConfiguration),
  compactionConfiguration: S.optional(CompactionConfiguration),
  retentionConfiguration: S.optional(RetentionConfiguration),
  orphanFileDeletionConfiguration: S.optional(OrphanFileDeletionConfiguration),
}) {}
export class UpdateTableOptimizerRequest extends S.Class<UpdateTableOptimizerRequest>(
  "UpdateTableOptimizerRequest",
)(
  {
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Type: S.String,
    TableOptimizerConfiguration: TableOptimizerConfiguration,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTableOptimizerResponse extends S.Class<UpdateTableOptimizerResponse>(
  "UpdateTableOptimizerResponse",
)({}) {}
export const AllowedValuesStringList = S.Array(S.String);
export class ConfigurationObject extends S.Class<ConfigurationObject>(
  "ConfigurationObject",
)({
  DefaultValue: S.optional(S.String),
  AllowedValues: S.optional(AllowedValuesStringList),
  MinValue: S.optional(S.String),
  MaxValue: S.optional(S.String),
}) {}
export const ConfigurationMap = S.Record({
  key: S.String,
  value: ConfigurationObject,
});
export class ProfileConfiguration extends S.Class<ProfileConfiguration>(
  "ProfileConfiguration",
)({
  SessionConfiguration: S.optional(ConfigurationMap),
  JobConfiguration: S.optional(ConfigurationMap),
}) {}
export class UpdateUsageProfileRequest extends S.Class<UpdateUsageProfileRequest>(
  "UpdateUsageProfileRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    Configuration: ProfileConfiguration,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ResourceUri extends S.Class<ResourceUri>("ResourceUri")({
  ResourceType: S.optional(S.String),
  Uri: S.optional(S.String),
}) {}
export const ResourceUriList = S.Array(ResourceUri);
export class UserDefinedFunctionInput extends S.Class<UserDefinedFunctionInput>(
  "UserDefinedFunctionInput",
)({
  FunctionName: S.optional(S.String),
  ClassName: S.optional(S.String),
  OwnerName: S.optional(S.String),
  FunctionType: S.optional(S.String),
  OwnerType: S.optional(S.String),
  ResourceUris: S.optional(ResourceUriList),
}) {}
export class UpdateUserDefinedFunctionRequest extends S.Class<UpdateUserDefinedFunctionRequest>(
  "UpdateUserDefinedFunctionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    FunctionName: S.String,
    FunctionInput: UserDefinedFunctionInput,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateUserDefinedFunctionResponse extends S.Class<UpdateUserDefinedFunctionResponse>(
  "UpdateUserDefinedFunctionResponse",
)({}) {}
export class UpdateWorkflowRequest extends S.Class<UpdateWorkflowRequest>(
  "UpdateWorkflowRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    DefaultRunProperties: S.optional(WorkflowRunProperties),
    MaxConcurrentRuns: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const CsvHeader = S.Array(S.String);
export const CustomDatatypes = S.Array(S.String);
export const ConnectionStringList = S.Array(S.String);
export const IntegrationFilterValues = S.Array(S.String);
export const IntegrationResourcePropertyFilterValues = S.Array(S.String);
export const BatchDeletePartitionValueList = S.Array(PartitionValueList);
export const BlueprintNames = S.Array(S.String);
export class BatchGetTableOptimizerEntry extends S.Class<BatchGetTableOptimizerEntry>(
  "BatchGetTableOptimizerEntry",
)({
  catalogId: S.optional(S.String),
  databaseName: S.optional(S.String),
  tableName: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const BatchGetTableOptimizerEntries = S.Array(
  BatchGetTableOptimizerEntry,
);
export class DatapointInclusionAnnotation extends S.Class<DatapointInclusionAnnotation>(
  "DatapointInclusionAnnotation",
)({
  ProfileId: S.optional(S.String),
  StatisticId: S.optional(S.String),
  InclusionAnnotation: S.optional(S.String),
}) {}
export const InclusionAnnotationList = S.Array(DatapointInclusionAnnotation);
export class BatchUpdatePartitionRequestEntry extends S.Class<BatchUpdatePartitionRequestEntry>(
  "BatchUpdatePartitionRequestEntry",
)({
  PartitionValueList: BoundedPartitionValueList,
  PartitionInput: PartitionInput,
}) {}
export const BatchUpdatePartitionRequestEntryList = S.Array(
  BatchUpdatePartitionRequestEntry,
);
export class CreateGrokClassifierRequest extends S.Class<CreateGrokClassifierRequest>(
  "CreateGrokClassifierRequest",
)({
  Classification: S.String,
  Name: S.String,
  GrokPattern: S.String,
  CustomPatterns: S.optional(S.String),
}) {}
export class CreateXMLClassifierRequest extends S.Class<CreateXMLClassifierRequest>(
  "CreateXMLClassifierRequest",
)({ Classification: S.String, Name: S.String, RowTag: S.optional(S.String) }) {}
export class CreateJsonClassifierRequest extends S.Class<CreateJsonClassifierRequest>(
  "CreateJsonClassifierRequest",
)({ Name: S.String, JsonPath: S.String }) {}
export class CreateCsvClassifierRequest extends S.Class<CreateCsvClassifierRequest>(
  "CreateCsvClassifierRequest",
)({
  Name: S.String,
  Delimiter: S.optional(S.String),
  QuoteSymbol: S.optional(S.String),
  ContainsHeader: S.optional(S.String),
  Header: S.optional(CsvHeader),
  DisableValueTrimming: S.optional(S.Boolean),
  AllowSingleColumn: S.optional(S.Boolean),
  CustomDatatypeConfigured: S.optional(S.Boolean),
  CustomDatatypes: S.optional(CustomDatatypes),
  Serde: S.optional(S.String),
}) {}
export class DataQualityTargetTable extends S.Class<DataQualityTargetTable>(
  "DataQualityTargetTable",
)({
  TableName: S.String,
  DatabaseName: S.String,
  CatalogId: S.optional(S.String),
}) {}
export const MapValue = S.Record({ key: S.String, value: S.String });
export const IntegrationAdditionalEncryptionContextMap = S.Record({
  key: S.String,
  value: S.String,
});
export class Tag extends S.Class<Tag>("Tag")({
  key: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const IntegrationTagsList = S.Array(Tag);
export class ExecutionProperty extends S.Class<ExecutionProperty>(
  "ExecutionProperty",
)({ MaxConcurrentRuns: S.optional(S.Number) }) {}
export class JobCommand extends S.Class<JobCommand>("JobCommand")({
  Name: S.optional(S.String),
  ScriptLocation: S.optional(S.String),
  PythonVersion: S.optional(S.String),
  Runtime: S.optional(S.String),
}) {}
export class ConnectionsList extends S.Class<ConnectionsList>(
  "ConnectionsList",
)({ Connections: S.optional(ConnectionStringList) }) {}
export class SourceControlDetails extends S.Class<SourceControlDetails>(
  "SourceControlDetails",
)({
  Provider: S.optional(S.String),
  Repository: S.optional(S.String),
  Owner: S.optional(S.String),
  Branch: S.optional(S.String),
  Folder: S.optional(S.String),
  LastCommitId: S.optional(S.String),
  AuthStrategy: S.optional(S.String),
  AuthToken: S.optional(S.String),
}) {}
export class CodeGenEdge extends S.Class<CodeGenEdge>("CodeGenEdge")({
  Source: S.String,
  Target: S.String,
  TargetParameter: S.optional(S.String),
}) {}
export const DagEdges = S.Array(CodeGenEdge);
export class SessionCommand extends S.Class<SessionCommand>("SessionCommand")({
  Name: S.optional(S.String),
  PythonVersion: S.optional(S.String),
}) {}
export const OrchestrationArgumentsMap = S.Record({
  key: S.String,
  value: S.String,
});
export class Action extends S.Class<Action>("Action")({
  JobName: S.optional(S.String),
  Arguments: S.optional(GenericMap),
  Timeout: S.optional(S.Number),
  SecurityConfiguration: S.optional(S.String),
  NotificationProperty: S.optional(NotificationProperty),
  CrawlerName: S.optional(S.String),
}) {}
export const ActionList = S.Array(Action);
export class EventBatchingCondition extends S.Class<EventBatchingCondition>(
  "EventBatchingCondition",
)({ BatchSize: S.Number, BatchWindow: S.optional(S.Number) }) {}
export class IntegrationFilter extends S.Class<IntegrationFilter>(
  "IntegrationFilter",
)({
  Name: S.optional(S.String),
  Values: S.optional(IntegrationFilterValues),
}) {}
export const IntegrationFilterList = S.Array(IntegrationFilter);
export class BlueprintRun extends S.Class<BlueprintRun>("BlueprintRun")({
  BlueprintName: S.optional(S.String),
  RunId: S.optional(S.String),
  WorkflowName: S.optional(S.String),
  State: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ErrorMessage: S.optional(S.String),
  RollbackErrorMessage: S.optional(S.String),
  Parameters: S.optional(S.String),
  RoleArn: S.optional(S.String),
}) {}
export const BlueprintRuns = S.Array(BlueprintRun);
export class DataLakeAccessPropertiesOutput extends S.Class<DataLakeAccessPropertiesOutput>(
  "DataLakeAccessPropertiesOutput",
)({
  DataLakeAccess: S.optional(S.Boolean),
  DataTransferRole: S.optional(S.String),
  KmsKey: S.optional(S.String),
  ManagedWorkgroupName: S.optional(S.String),
  ManagedWorkgroupStatus: S.optional(S.String),
  RedshiftDatabaseName: S.optional(S.String),
  StatusMessage: S.optional(S.String),
  CatalogType: S.optional(S.String),
}) {}
export class IcebergOptimizationPropertiesOutput extends S.Class<IcebergOptimizationPropertiesOutput>(
  "IcebergOptimizationPropertiesOutput",
)({
  RoleArn: S.optional(S.String),
  Compaction: S.optional(ParametersMap),
  Retention: S.optional(ParametersMap),
  OrphanFileDeletion: S.optional(ParametersMap),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CatalogPropertiesOutput extends S.Class<CatalogPropertiesOutput>(
  "CatalogPropertiesOutput",
)({
  DataLakeAccessProperties: S.optional(DataLakeAccessPropertiesOutput),
  IcebergOptimizationProperties: S.optional(
    IcebergOptimizationPropertiesOutput,
  ),
  CustomProperties: S.optional(ParametersMap),
}) {}
export class Catalog extends S.Class<Catalog>("Catalog")({
  CatalogId: S.optional(S.String),
  Name: S.String,
  ResourceArn: S.optional(S.String),
  Description: S.optional(S.String),
  Parameters: S.optional(ParametersMap),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TargetRedshiftCatalog: S.optional(TargetRedshiftCatalog),
  FederatedCatalog: S.optional(FederatedCatalog),
  CatalogProperties: S.optional(CatalogPropertiesOutput),
  CreateTableDefaultPermissions: S.optional(PrincipalPermissionsList),
  CreateDatabaseDefaultPermissions: S.optional(PrincipalPermissionsList),
  AllowFullTableExternalDataAccess: S.optional(S.String),
}) {}
export const CatalogList = S.Array(Catalog);
export class GrokClassifier extends S.Class<GrokClassifier>("GrokClassifier")({
  Name: S.String,
  Classification: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Version: S.optional(S.Number),
  GrokPattern: S.String,
  CustomPatterns: S.optional(S.String),
}) {}
export class XMLClassifier extends S.Class<XMLClassifier>("XMLClassifier")({
  Name: S.String,
  Classification: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Version: S.optional(S.Number),
  RowTag: S.optional(S.String),
}) {}
export class JsonClassifier extends S.Class<JsonClassifier>("JsonClassifier")({
  Name: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Version: S.optional(S.Number),
  JsonPath: S.String,
}) {}
export class CsvClassifier extends S.Class<CsvClassifier>("CsvClassifier")({
  Name: S.String,
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Version: S.optional(S.Number),
  Delimiter: S.optional(S.String),
  QuoteSymbol: S.optional(S.String),
  ContainsHeader: S.optional(S.String),
  Header: S.optional(CsvHeader),
  DisableValueTrimming: S.optional(S.Boolean),
  AllowSingleColumn: S.optional(S.Boolean),
  CustomDatatypeConfigured: S.optional(S.Boolean),
  CustomDatatypes: S.optional(CustomDatatypes),
  Serde: S.optional(S.String),
}) {}
export class Classifier extends S.Class<Classifier>("Classifier")({
  GrokClassifier: S.optional(GrokClassifier),
  XMLClassifier: S.optional(XMLClassifier),
  JsonClassifier: S.optional(JsonClassifier),
  CsvClassifier: S.optional(CsvClassifier),
}) {}
export const ClassifierList = S.Array(Classifier);
export const ColumnStatisticsList = S.Array(ColumnStatistics);
export class ColumnStatisticsTaskRun extends S.Class<ColumnStatisticsTaskRun>(
  "ColumnStatisticsTaskRun",
)({
  CustomerId: S.optional(S.String),
  ColumnStatisticsTaskRunId: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  TableName: S.optional(S.String),
  ColumnNameList: S.optional(ColumnNameList),
  CatalogID: S.optional(S.String),
  Role: S.optional(S.String),
  SampleSize: S.optional(S.Number),
  SecurityConfiguration: S.optional(S.String),
  NumberOfWorkers: S.optional(S.Number),
  WorkerType: S.optional(S.String),
  ComputationType: S.optional(S.String),
  Status: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ErrorMessage: S.optional(S.String),
  DPUSeconds: S.optional(S.Number),
}) {}
export const ColumnStatisticsTaskRunsList = S.Array(ColumnStatisticsTaskRun);
export class GetConnectionsFilter extends S.Class<GetConnectionsFilter>(
  "GetConnectionsFilter",
)({
  MatchCriteria: S.optional(MatchCriteria),
  ConnectionType: S.optional(S.String),
  ConnectionSchemaVersion: S.optional(S.Number),
}) {}
export class Database extends S.Class<Database>("Database")({
  Name: S.String,
  Description: S.optional(S.String),
  LocationUri: S.optional(S.String),
  Parameters: S.optional(ParametersMap),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreateTableDefaultPermissions: S.optional(PrincipalPermissionsList),
  TargetDatabase: S.optional(DatabaseIdentifier),
  CatalogId: S.optional(S.String),
  FederatedDatabase: S.optional(FederatedDatabase),
}) {}
export const DatabaseList = S.Array(Database);
export const DataQualityResultIdList = S.Array(S.String);
export const ConnectionOptions = S.Record({ key: S.String, value: S.String });
export class Predecessor extends S.Class<Predecessor>("Predecessor")({
  JobName: S.optional(S.String),
  RunId: S.optional(S.String),
}) {}
export const PredecessorList = S.Array(Predecessor);
export class JobRun extends S.Class<JobRun>("JobRun")({
  Id: S.optional(S.String),
  Attempt: S.optional(S.Number),
  PreviousRunId: S.optional(S.String),
  TriggerName: S.optional(S.String),
  JobName: S.optional(S.String),
  JobMode: S.optional(S.String),
  JobRunQueuingEnabled: S.optional(S.Boolean),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  JobRunState: S.optional(S.String),
  Arguments: S.optional(GenericMap),
  ErrorMessage: S.optional(S.String),
  PredecessorRuns: S.optional(PredecessorList),
  AllocatedCapacity: S.optional(S.Number),
  ExecutionTime: S.optional(S.Number),
  Timeout: S.optional(S.Number),
  MaxCapacity: S.optional(S.Number),
  WorkerType: S.optional(S.String),
  NumberOfWorkers: S.optional(S.Number),
  SecurityConfiguration: S.optional(S.String),
  LogGroupName: S.optional(S.String),
  NotificationProperty: S.optional(NotificationProperty),
  GlueVersion: S.optional(S.String),
  DPUSeconds: S.optional(S.Number),
  ExecutionClass: S.optional(S.String),
  MaintenanceWindow: S.optional(S.String),
  ProfileName: S.optional(S.String),
  StateDetail: S.optional(S.String),
  ExecutionRoleSessionPolicy: S.optional(S.String),
}) {}
export const JobRunList = S.Array(JobRun);
export class CodeGenNodeArg extends S.Class<CodeGenNodeArg>("CodeGenNodeArg")({
  Name: S.String,
  Value: S.String,
  Param: S.optional(S.Boolean),
}) {}
export const CodeGenNodeArgs = S.Array(CodeGenNodeArg);
export class Location extends S.Class<Location>("Location")({
  Jdbc: S.optional(CodeGenNodeArgs),
  S3: S.optional(CodeGenNodeArgs),
  DynamoDB: S.optional(CodeGenNodeArgs),
}) {}
export class TaskRunFilterCriteria extends S.Class<TaskRunFilterCriteria>(
  "TaskRunFilterCriteria",
)({
  TaskRunType: S.optional(S.String),
  Status: S.optional(S.String),
  StartedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class TaskRunSortCriteria extends S.Class<TaskRunSortCriteria>(
  "TaskRunSortCriteria",
)({ Column: S.String, SortDirection: S.String }) {}
export class MappingEntry extends S.Class<MappingEntry>("MappingEntry")({
  SourceTable: S.optional(S.String),
  SourcePath: S.optional(S.String),
  SourceType: S.optional(S.String),
  TargetTable: S.optional(S.String),
  TargetPath: S.optional(S.String),
  TargetType: S.optional(S.String),
}) {}
export const MappingList = S.Array(MappingEntry);
export const AdditionalPlanOptionsMap = S.Record({
  key: S.String,
  value: S.String,
});
export class S3Encryption extends S.Class<S3Encryption>("S3Encryption")({
  S3EncryptionMode: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
}) {}
export const S3EncryptionList = S.Array(S3Encryption);
export class CloudWatchEncryption extends S.Class<CloudWatchEncryption>(
  "CloudWatchEncryption",
)({
  CloudWatchEncryptionMode: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
}) {}
export class JobBookmarksEncryption extends S.Class<JobBookmarksEncryption>(
  "JobBookmarksEncryption",
)({
  JobBookmarksEncryptionMode: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
}) {}
export class DataQualityEncryption extends S.Class<DataQualityEncryption>(
  "DataQualityEncryption",
)({
  DataQualityEncryptionMode: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
}) {}
export class EncryptionConfiguration extends S.Class<EncryptionConfiguration>(
  "EncryptionConfiguration",
)({
  S3Encryption: S.optional(S3EncryptionList),
  CloudWatchEncryption: S.optional(CloudWatchEncryption),
  JobBookmarksEncryption: S.optional(JobBookmarksEncryption),
  DataQualityEncryption: S.optional(DataQualityEncryption),
}) {}
export class SecurityConfiguration extends S.Class<SecurityConfiguration>(
  "SecurityConfiguration",
)({
  Name: S.optional(S.String),
  CreatedTimeStamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EncryptionConfiguration: S.optional(EncryptionConfiguration),
}) {}
export const SecurityConfigurationList = S.Array(SecurityConfiguration);
export class TableIdentifier extends S.Class<TableIdentifier>(
  "TableIdentifier",
)({
  CatalogId: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  Name: S.optional(S.String),
  Region: S.optional(S.String),
}) {}
export class FederatedTable extends S.Class<FederatedTable>("FederatedTable")({
  Identifier: S.optional(S.String),
  DatabaseIdentifier: S.optional(S.String),
  ConnectionName: S.optional(S.String),
  ConnectionType: S.optional(S.String),
}) {}
export const ViewSubObjectsList = S.Array(S.String);
export const ViewSubObjectVersionIdsList = S.Array(S.Number);
export class ViewRepresentation extends S.Class<ViewRepresentation>(
  "ViewRepresentation",
)({
  Dialect: S.optional(S.String),
  DialectVersion: S.optional(S.String),
  ViewOriginalText: S.optional(S.String),
  ViewExpandedText: S.optional(S.String),
  ValidationConnection: S.optional(S.String),
  IsStale: S.optional(S.Boolean),
}) {}
export const ViewRepresentationList = S.Array(ViewRepresentation);
export class ViewDefinition extends S.Class<ViewDefinition>("ViewDefinition")({
  IsProtected: S.optional(S.Boolean),
  Definer: S.optional(S.String),
  ViewVersionId: S.optional(S.Number),
  ViewVersionToken: S.optional(S.String),
  RefreshSeconds: S.optional(S.Number),
  LastRefreshType: S.optional(S.String),
  SubObjects: S.optional(ViewSubObjectsList),
  SubObjectVersionIds: S.optional(ViewSubObjectVersionIdsList),
  Representations: S.optional(ViewRepresentationList),
}) {}
export class Table extends S.Class<Table>("Table")({
  Name: S.String,
  DatabaseName: S.optional(S.String),
  Description: S.optional(S.String),
  Owner: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastAccessTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastAnalyzedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Retention: S.optional(S.Number),
  StorageDescriptor: S.optional(StorageDescriptor),
  PartitionKeys: S.optional(ColumnList),
  ViewOriginalText: S.optional(S.String),
  ViewExpandedText: S.optional(S.String),
  TableType: S.optional(S.String),
  Parameters: S.optional(ParametersMap),
  CreatedBy: S.optional(S.String),
  IsRegisteredWithLakeFormation: S.optional(S.Boolean),
  TargetTable: S.optional(TableIdentifier),
  CatalogId: S.optional(S.String),
  VersionId: S.optional(S.String),
  FederatedTable: S.optional(FederatedTable),
  ViewDefinition: S.optional(ViewDefinition),
  IsMultiDialectView: S.optional(S.Boolean),
  IsMaterializedView: S.optional(S.Boolean),
  Status: S.optional(S.suspend((): S.Schema<TableStatus, any> => TableStatus)),
}) {}
export class TableVersion extends S.Class<TableVersion>("TableVersion")({
  Table: S.optional(Table),
  VersionId: S.optional(S.String),
}) {}
export const GetTableVersionsList = S.Array(TableVersion);
export class SupportedDialect extends S.Class<SupportedDialect>(
  "SupportedDialect",
)({ Dialect: S.optional(S.String), DialectVersion: S.optional(S.String) }) {}
export class UserDefinedFunction extends S.Class<UserDefinedFunction>(
  "UserDefinedFunction",
)({
  FunctionName: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  ClassName: S.optional(S.String),
  OwnerName: S.optional(S.String),
  FunctionType: S.optional(S.String),
  OwnerType: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ResourceUris: S.optional(ResourceUriList),
  CatalogId: S.optional(S.String),
}) {}
export const UserDefinedFunctionList = S.Array(UserDefinedFunction);
export class WorkflowRunStatistics extends S.Class<WorkflowRunStatistics>(
  "WorkflowRunStatistics",
)({
  TotalActions: S.optional(S.Number),
  TimeoutActions: S.optional(S.Number),
  FailedActions: S.optional(S.Number),
  StoppedActions: S.optional(S.Number),
  SucceededActions: S.optional(S.Number),
  RunningActions: S.optional(S.Number),
  ErroredActions: S.optional(S.Number),
  WaitingActions: S.optional(S.Number),
}) {}
export class Condition extends S.Class<Condition>("Condition")({
  LogicalOperator: S.optional(S.String),
  JobName: S.optional(S.String),
  State: S.optional(S.String),
  CrawlerName: S.optional(S.String),
  CrawlState: S.optional(S.String),
}) {}
export const ConditionList = S.Array(Condition);
export class Predicate extends S.Class<Predicate>("Predicate")({
  Logical: S.optional(S.String),
  Conditions: S.optional(ConditionList),
}) {}
export class Trigger extends S.Class<Trigger>("Trigger")({
  Name: S.optional(S.String),
  WorkflowName: S.optional(S.String),
  Id: S.optional(S.String),
  Type: S.optional(S.String),
  State: S.optional(S.String),
  Description: S.optional(S.String),
  Schedule: S.optional(S.String),
  Actions: S.optional(ActionList),
  Predicate: S.optional(Predicate),
  EventBatchingCondition: S.optional(EventBatchingCondition),
}) {}
export class TriggerNodeDetails extends S.Class<TriggerNodeDetails>(
  "TriggerNodeDetails",
)({ Trigger: S.optional(Trigger) }) {}
export class JobNodeDetails extends S.Class<JobNodeDetails>("JobNodeDetails")({
  JobRuns: S.optional(JobRunList),
}) {}
export class Crawl extends S.Class<Crawl>("Crawl")({
  State: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ErrorMessage: S.optional(S.String),
  LogGroup: S.optional(S.String),
  LogStream: S.optional(S.String),
}) {}
export const CrawlList = S.Array(Crawl);
export class CrawlerNodeDetails extends S.Class<CrawlerNodeDetails>(
  "CrawlerNodeDetails",
)({ Crawls: S.optional(CrawlList) }) {}
export class Node extends S.Class<Node>("Node")({
  Type: S.optional(S.String),
  Name: S.optional(S.String),
  UniqueId: S.optional(S.String),
  TriggerDetails: S.optional(TriggerNodeDetails),
  JobDetails: S.optional(JobNodeDetails),
  CrawlerDetails: S.optional(CrawlerNodeDetails),
}) {}
export const NodeList = S.Array(Node);
export class Edge extends S.Class<Edge>("Edge")({
  SourceId: S.optional(S.String),
  DestinationId: S.optional(S.String),
}) {}
export const EdgeList = S.Array(Edge);
export class WorkflowGraph extends S.Class<WorkflowGraph>("WorkflowGraph")({
  Nodes: S.optional(NodeList),
  Edges: S.optional(EdgeList),
}) {}
export class StartingEventBatchCondition extends S.Class<StartingEventBatchCondition>(
  "StartingEventBatchCondition",
)({ BatchSize: S.optional(S.Number), BatchWindow: S.optional(S.Number) }) {}
export class WorkflowRun extends S.Class<WorkflowRun>("WorkflowRun")({
  Name: S.optional(S.String),
  WorkflowRunId: S.optional(S.String),
  PreviousRunId: S.optional(S.String),
  WorkflowRunProperties: S.optional(WorkflowRunProperties),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  Statistics: S.optional(WorkflowRunStatistics),
  Graph: S.optional(WorkflowGraph),
  StartingEventBatchCondition: S.optional(StartingEventBatchCondition),
}) {}
export const WorkflowRuns = S.Array(WorkflowRun);
export const ColumnStatisticsTaskRunIdList = S.Array(S.String);
export class CrawlsFilter extends S.Class<CrawlsFilter>("CrawlsFilter")({
  FieldName: S.optional(S.String),
  FilterOperator: S.optional(S.String),
  FieldValue: S.optional(S.String),
}) {}
export const CrawlsFilterList = S.Array(CrawlsFilter);
export const GlueTableAdditionalOptions = S.Record({
  key: S.String,
  value: S.String,
});
export class GlueTable extends S.Class<GlueTable>("GlueTable")({
  DatabaseName: S.String,
  TableName: S.String,
  CatalogId: S.optional(S.String),
  ConnectionName: S.optional(S.String),
  AdditionalOptions: S.optional(GlueTableAdditionalOptions),
}) {}
export class DataQualityGlueTable extends S.Class<DataQualityGlueTable>(
  "DataQualityGlueTable",
)({
  DatabaseName: S.String,
  TableName: S.String,
  CatalogId: S.optional(S.String),
  ConnectionName: S.optional(S.String),
  AdditionalOptions: S.optional(GlueTableAdditionalOptions),
  PreProcessingQuery: S.optional(S.String),
}) {}
export class DataSource extends S.Class<DataSource>("DataSource")({
  GlueTable: S.optional(GlueTable),
  DataQualityGlueTable: S.optional(DataQualityGlueTable),
}) {}
export class DataQualityResultFilterCriteria extends S.Class<DataQualityResultFilterCriteria>(
  "DataQualityResultFilterCriteria",
)({
  DataSource: S.optional(DataSource),
  JobName: S.optional(S.String),
  JobRunId: S.optional(S.String),
  StartedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DataQualityRuleRecommendationRunFilter extends S.Class<DataQualityRuleRecommendationRunFilter>(
  "DataQualityRuleRecommendationRunFilter",
)({
  DataSource: DataSource,
  StartedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DataQualityRulesetEvaluationRunFilter extends S.Class<DataQualityRulesetEvaluationRunFilter>(
  "DataQualityRulesetEvaluationRunFilter",
)({
  DataSource: DataSource,
  StartedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StartedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DataQualityRulesetFilterCriteria extends S.Class<DataQualityRulesetFilterCriteria>(
  "DataQualityRulesetFilterCriteria",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CreatedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedBefore: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  LastModifiedAfter: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  TargetTable: S.optional(DataQualityTargetTable),
}) {}
export const DevEndpointNameList = S.Array(S.String);
export class IntegrationResourcePropertyFilter extends S.Class<IntegrationResourcePropertyFilter>(
  "IntegrationResourcePropertyFilter",
)({
  Name: S.optional(S.String),
  Values: S.optional(IntegrationResourcePropertyFilterValues),
}) {}
export const IntegrationResourcePropertyFilterList = S.Array(
  IntegrationResourcePropertyFilter,
);
export const TransformIdList = S.Array(S.String);
export const SessionIdList = S.Array(S.String);
export class Session extends S.Class<Session>("Session")({
  Id: S.optional(S.String),
  CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Status: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  Description: S.optional(S.String),
  Role: S.optional(S.String),
  Command: S.optional(SessionCommand),
  DefaultArguments: S.optional(OrchestrationArgumentsMap),
  Connections: S.optional(ConnectionsList),
  Progress: S.optional(S.Number),
  MaxCapacity: S.optional(S.Number),
  SecurityConfiguration: S.optional(S.String),
  GlueVersion: S.optional(S.String),
  NumberOfWorkers: S.optional(S.Number),
  WorkerType: S.optional(S.String),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExecutionTime: S.optional(S.Number),
  DPUSeconds: S.optional(S.Number),
  IdleTimeout: S.optional(S.Number),
  ProfileName: S.optional(S.String),
}) {}
export const SessionList = S.Array(Session);
export class StatementOutputData extends S.Class<StatementOutputData>(
  "StatementOutputData",
)({ TextPlain: S.optional(S.String) }) {}
export class StatementOutput extends S.Class<StatementOutput>(
  "StatementOutput",
)({
  Data: S.optional(StatementOutputData),
  ExecutionCount: S.optional(S.Number),
  Status: S.optional(S.String),
  ErrorName: S.optional(S.String),
  ErrorValue: S.optional(S.String),
  Traceback: S.optional(OrchestrationStringList),
}) {}
export class Statement extends S.Class<Statement>("Statement")({
  Id: S.optional(S.Number),
  Code: S.optional(S.String),
  State: S.optional(S.String),
  Output: S.optional(StatementOutput),
  Progress: S.optional(S.Number),
  StartedOn: S.optional(S.Number),
  CompletedOn: S.optional(S.Number),
}) {}
export const StatementList = S.Array(Statement);
export class PropertyPredicate extends S.Class<PropertyPredicate>(
  "PropertyPredicate",
)({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
  Comparator: S.optional(S.String),
}) {}
export const SearchPropertyPredicates = S.Array(PropertyPredicate);
export class SortCriterion extends S.Class<SortCriterion>("SortCriterion")({
  FieldName: S.optional(S.String),
  Sort: S.optional(S.String),
}) {}
export const SortCriteria = S.Array(SortCriterion);
export class DataQualityEvaluationRunAdditionalRunOptions extends S.Class<DataQualityEvaluationRunAdditionalRunOptions>(
  "DataQualityEvaluationRunAdditionalRunOptions",
)({
  CloudWatchMetricsEnabled: S.optional(S.Boolean),
  ResultsS3Prefix: S.optional(S.String),
  CompositeRuleEvaluationMethod: S.optional(S.String),
}) {}
export const DataSourceMap = S.Record({ key: S.String, value: DataSource });
export class TestConnectionInput extends S.Class<TestConnectionInput>(
  "TestConnectionInput",
)({
  ConnectionType: S.String,
  ConnectionProperties: ConnectionProperties,
  AuthenticationConfiguration: S.optional(AuthenticationConfigurationInput),
}) {}
export class UpdateGrokClassifierRequest extends S.Class<UpdateGrokClassifierRequest>(
  "UpdateGrokClassifierRequest",
)({
  Name: S.String,
  Classification: S.optional(S.String),
  GrokPattern: S.optional(S.String),
  CustomPatterns: S.optional(S.String),
}) {}
export class UpdateXMLClassifierRequest extends S.Class<UpdateXMLClassifierRequest>(
  "UpdateXMLClassifierRequest",
)({
  Name: S.String,
  Classification: S.optional(S.String),
  RowTag: S.optional(S.String),
}) {}
export class UpdateJsonClassifierRequest extends S.Class<UpdateJsonClassifierRequest>(
  "UpdateJsonClassifierRequest",
)({ Name: S.String, JsonPath: S.optional(S.String) }) {}
export class UpdateCsvClassifierRequest extends S.Class<UpdateCsvClassifierRequest>(
  "UpdateCsvClassifierRequest",
)({
  Name: S.String,
  Delimiter: S.optional(S.String),
  QuoteSymbol: S.optional(S.String),
  ContainsHeader: S.optional(S.String),
  Header: S.optional(CsvHeader),
  DisableValueTrimming: S.optional(S.Boolean),
  AllowSingleColumn: S.optional(S.Boolean),
  CustomDatatypeConfigured: S.optional(S.Boolean),
  CustomDatatypes: S.optional(CustomDatatypes),
  Serde: S.optional(S.String),
}) {}
export class DevEndpointCustomLibraries extends S.Class<DevEndpointCustomLibraries>(
  "DevEndpointCustomLibraries",
)({
  ExtraPythonLibsS3Path: S.optional(S.String),
  ExtraJarsS3Path: S.optional(S.String),
}) {}
export class GlueStudioSchemaColumn extends S.Class<GlueStudioSchemaColumn>(
  "GlueStudioSchemaColumn",
)({
  Name: S.String,
  Type: S.optional(S.String),
  GlueStudioType: S.optional(S.String),
}) {}
export const GlueStudioSchemaColumnList = S.Array(GlueStudioSchemaColumn);
export class GlueSchema extends S.Class<GlueSchema>("GlueSchema")({
  Columns: S.optional(GlueStudioSchemaColumnList),
}) {}
export const GlueSchemas = S.Array(GlueSchema);
export class AthenaConnectorSource extends S.Class<AthenaConnectorSource>(
  "AthenaConnectorSource",
)({
  Name: S.String,
  ConnectionName: S.String,
  ConnectorName: S.String,
  ConnectionType: S.String,
  ConnectionTable: S.optional(S.String),
  SchemaName: S.String,
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export const EnclosedInStringProperties = S.Array(S.String);
export const JDBCDataTypeMapping = S.Record({ key: S.String, value: S.String });
export class JDBCConnectorOptions extends S.Class<JDBCConnectorOptions>(
  "JDBCConnectorOptions",
)({
  FilterPredicate: S.optional(S.String),
  PartitionColumn: S.optional(S.String),
  LowerBound: S.optional(S.Number),
  UpperBound: S.optional(S.Number),
  NumPartitions: S.optional(S.Number),
  JobBookmarkKeys: S.optional(EnclosedInStringProperties),
  JobBookmarkKeysSortOrder: S.optional(S.String),
  DataTypeMapping: S.optional(JDBCDataTypeMapping),
}) {}
export class JDBCConnectorSource extends S.Class<JDBCConnectorSource>(
  "JDBCConnectorSource",
)({
  Name: S.String,
  ConnectionName: S.String,
  ConnectorName: S.String,
  ConnectionType: S.String,
  AdditionalOptions: S.optional(JDBCConnectorOptions),
  ConnectionTable: S.optional(S.String),
  Query: S.optional(S.String),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export const AdditionalOptions = S.Record({ key: S.String, value: S.String });
export class SparkConnectorSource extends S.Class<SparkConnectorSource>(
  "SparkConnectorSource",
)({
  Name: S.String,
  ConnectionName: S.String,
  ConnectorName: S.String,
  ConnectionType: S.String,
  AdditionalOptions: S.optional(AdditionalOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class CatalogSource extends S.Class<CatalogSource>("CatalogSource")({
  Name: S.String,
  Database: S.String,
  Table: S.String,
  PartitionPredicate: S.optional(S.String),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class RedshiftSource extends S.Class<RedshiftSource>("RedshiftSource")({
  Name: S.String,
  Database: S.String,
  Table: S.String,
  RedshiftTmpDir: S.optional(S.String),
  TmpDirIAMRole: S.optional(S.String),
}) {}
export class S3SourceAdditionalOptions extends S.Class<S3SourceAdditionalOptions>(
  "S3SourceAdditionalOptions",
)({ BoundedSize: S.optional(S.Number), BoundedFiles: S.optional(S.Number) }) {}
export class S3CatalogSource extends S.Class<S3CatalogSource>(
  "S3CatalogSource",
)({
  Name: S.String,
  Database: S.String,
  Table: S.String,
  PartitionPredicate: S.optional(S.String),
  AdditionalOptions: S.optional(S3SourceAdditionalOptions),
}) {}
export class S3DirectSourceAdditionalOptions extends S.Class<S3DirectSourceAdditionalOptions>(
  "S3DirectSourceAdditionalOptions",
)({
  BoundedSize: S.optional(S.Number),
  BoundedFiles: S.optional(S.Number),
  EnableSamplePath: S.optional(S.Boolean),
  SamplePath: S.optional(S.String),
}) {}
export class S3CsvSource extends S.Class<S3CsvSource>("S3CsvSource")({
  Name: S.String,
  Paths: EnclosedInStringProperties,
  CompressionType: S.optional(S.String),
  Exclusions: S.optional(EnclosedInStringProperties),
  GroupSize: S.optional(S.String),
  GroupFiles: S.optional(S.String),
  Recurse: S.optional(S.Boolean),
  MaxBand: S.optional(S.Number),
  MaxFilesInBand: S.optional(S.Number),
  AdditionalOptions: S.optional(S3DirectSourceAdditionalOptions),
  Separator: S.String,
  Escaper: S.optional(S.String),
  QuoteChar: S.String,
  Multiline: S.optional(S.Boolean),
  WithHeader: S.optional(S.Boolean),
  WriteHeader: S.optional(S.Boolean),
  SkipFirst: S.optional(S.Boolean),
  OptimizePerformance: S.optional(S.Boolean),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class S3JsonSource extends S.Class<S3JsonSource>("S3JsonSource")({
  Name: S.String,
  Paths: EnclosedInStringProperties,
  CompressionType: S.optional(S.String),
  Exclusions: S.optional(EnclosedInStringProperties),
  GroupSize: S.optional(S.String),
  GroupFiles: S.optional(S.String),
  Recurse: S.optional(S.Boolean),
  MaxBand: S.optional(S.Number),
  MaxFilesInBand: S.optional(S.Number),
  AdditionalOptions: S.optional(S3DirectSourceAdditionalOptions),
  JsonPath: S.optional(S.String),
  Multiline: S.optional(S.Boolean),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class S3ParquetSource extends S.Class<S3ParquetSource>(
  "S3ParquetSource",
)({
  Name: S.String,
  Paths: EnclosedInStringProperties,
  CompressionType: S.optional(S.String),
  Exclusions: S.optional(EnclosedInStringProperties),
  GroupSize: S.optional(S.String),
  GroupFiles: S.optional(S.String),
  Recurse: S.optional(S.Boolean),
  MaxBand: S.optional(S.Number),
  MaxFilesInBand: S.optional(S.Number),
  AdditionalOptions: S.optional(S3DirectSourceAdditionalOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class RelationalCatalogSource extends S.Class<RelationalCatalogSource>(
  "RelationalCatalogSource",
)({ Name: S.String, Database: S.String, Table: S.String }) {}
export class DDBELTCatalogAdditionalOptions extends S.Class<DDBELTCatalogAdditionalOptions>(
  "DDBELTCatalogAdditionalOptions",
)({
  DynamodbExport: S.optional(S.String),
  DynamodbUnnestDDBJson: S.optional(S.Boolean),
}) {}
export class DynamoDBCatalogSource extends S.Class<DynamoDBCatalogSource>(
  "DynamoDBCatalogSource",
)({
  Name: S.String,
  Database: S.String,
  Table: S.String,
  PitrEnabled: S.optional(S.Boolean),
  AdditionalOptions: S.optional(DDBELTCatalogAdditionalOptions),
}) {}
export const OneInput = S.Array(S.String);
export class JDBCConnectorTarget extends S.Class<JDBCConnectorTarget>(
  "JDBCConnectorTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  ConnectionName: S.String,
  ConnectionTable: S.String,
  ConnectorName: S.String,
  ConnectionType: S.String,
  AdditionalOptions: S.optional(AdditionalOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class SparkConnectorTarget extends S.Class<SparkConnectorTarget>(
  "SparkConnectorTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  ConnectionName: S.String,
  ConnectorName: S.String,
  ConnectionType: S.String,
  AdditionalOptions: S.optional(AdditionalOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export const GlueStudioPathList = S.Array(EnclosedInStringProperties);
export class BasicCatalogTarget extends S.Class<BasicCatalogTarget>(
  "BasicCatalogTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  PartitionKeys: S.optional(GlueStudioPathList),
  Database: S.String,
  Table: S.String,
}) {}
export const EnclosedInStringPropertiesMinOne = S.Array(S.String);
export class UpsertRedshiftTargetOptions extends S.Class<UpsertRedshiftTargetOptions>(
  "UpsertRedshiftTargetOptions",
)({
  TableLocation: S.optional(S.String),
  ConnectionName: S.optional(S.String),
  UpsertKeys: S.optional(EnclosedInStringPropertiesMinOne),
}) {}
export class RedshiftTarget extends S.Class<RedshiftTarget>("RedshiftTarget")({
  Name: S.String,
  Inputs: OneInput,
  Database: S.String,
  Table: S.String,
  RedshiftTmpDir: S.optional(S.String),
  TmpDirIAMRole: S.optional(S.String),
  UpsertRedshiftOptions: S.optional(UpsertRedshiftTargetOptions),
}) {}
export class CatalogSchemaChangePolicy extends S.Class<CatalogSchemaChangePolicy>(
  "CatalogSchemaChangePolicy",
)({
  EnableUpdateCatalog: S.optional(S.Boolean),
  UpdateBehavior: S.optional(S.String),
}) {}
export class AutoDataQuality extends S.Class<AutoDataQuality>(
  "AutoDataQuality",
)({
  IsEnabled: S.optional(S.Boolean),
  EvaluationContext: S.optional(S.String),
}) {}
export class S3CatalogTarget extends S.Class<S3CatalogTarget>(
  "S3CatalogTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  PartitionKeys: S.optional(GlueStudioPathList),
  Table: S.String,
  Database: S.String,
  SchemaChangePolicy: S.optional(CatalogSchemaChangePolicy),
  AutoDataQuality: S.optional(AutoDataQuality),
}) {}
export class DirectSchemaChangePolicy extends S.Class<DirectSchemaChangePolicy>(
  "DirectSchemaChangePolicy",
)({
  EnableUpdateCatalog: S.optional(S.Boolean),
  UpdateBehavior: S.optional(S.String),
  Table: S.optional(S.String),
  Database: S.optional(S.String),
}) {}
export class S3GlueParquetTarget extends S.Class<S3GlueParquetTarget>(
  "S3GlueParquetTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  PartitionKeys: S.optional(GlueStudioPathList),
  Path: S.String,
  Compression: S.optional(S.String),
  NumberTargetPartitions: S.optional(S.String),
  SchemaChangePolicy: S.optional(DirectSchemaChangePolicy),
  AutoDataQuality: S.optional(AutoDataQuality),
}) {}
export class S3DirectTarget extends S.Class<S3DirectTarget>("S3DirectTarget")({
  Name: S.String,
  Inputs: OneInput,
  PartitionKeys: S.optional(GlueStudioPathList),
  Path: S.String,
  Compression: S.optional(S.String),
  NumberTargetPartitions: S.optional(S.String),
  Format: S.String,
  SchemaChangePolicy: S.optional(DirectSchemaChangePolicy),
  AutoDataQuality: S.optional(AutoDataQuality),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export type Mappings = Mapping[];
export const Mappings = S.Array(
  S.suspend((): S.Schema<Mapping, any> => Mapping),
) as any as S.Schema<Mappings>;
export class ApplyMapping extends S.Class<ApplyMapping>("ApplyMapping")({
  Name: S.String,
  Inputs: OneInput,
  Mapping: Mappings,
}) {}
export class SelectFields extends S.Class<SelectFields>("SelectFields")({
  Name: S.String,
  Inputs: OneInput,
  Paths: GlueStudioPathList,
}) {}
export class DropFields extends S.Class<DropFields>("DropFields")({
  Name: S.String,
  Inputs: OneInput,
  Paths: GlueStudioPathList,
}) {}
export class RenameField extends S.Class<RenameField>("RenameField")({
  Name: S.String,
  Inputs: OneInput,
  SourcePath: EnclosedInStringProperties,
  TargetPath: EnclosedInStringProperties,
}) {}
export class Spigot extends S.Class<Spigot>("Spigot")({
  Name: S.String,
  Inputs: OneInput,
  Path: S.String,
  Topk: S.optional(S.Number),
  Prob: S.optional(S.Number),
}) {}
export const TwoInputs = S.Array(S.String);
export class JoinColumn extends S.Class<JoinColumn>("JoinColumn")({
  From: S.String,
  Keys: GlueStudioPathList,
}) {}
export const JoinColumns = S.Array(JoinColumn);
export class Join extends S.Class<Join>("Join")({
  Name: S.String,
  Inputs: TwoInputs,
  JoinType: S.String,
  Columns: JoinColumns,
}) {}
export class SplitFields extends S.Class<SplitFields>("SplitFields")({
  Name: S.String,
  Inputs: OneInput,
  Paths: GlueStudioPathList,
}) {}
export class SelectFromCollection extends S.Class<SelectFromCollection>(
  "SelectFromCollection",
)({ Name: S.String, Inputs: OneInput, Index: S.Number }) {}
export class FillMissingValues extends S.Class<FillMissingValues>(
  "FillMissingValues",
)({
  Name: S.String,
  Inputs: OneInput,
  ImputedPath: S.String,
  FilledPath: S.optional(S.String),
}) {}
export class FilterValue extends S.Class<FilterValue>("FilterValue")({
  Type: S.String,
  Value: EnclosedInStringProperties,
}) {}
export const FilterValues = S.Array(FilterValue);
export class FilterExpression extends S.Class<FilterExpression>(
  "FilterExpression",
)({
  Operation: S.String,
  Negated: S.optional(S.Boolean),
  Values: FilterValues,
}) {}
export const FilterExpressions = S.Array(FilterExpression);
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.String,
  Inputs: OneInput,
  LogicalOperator: S.String,
  Filters: FilterExpressions,
}) {}
export const ManyInputs = S.Array(S.String);
export class CustomCode extends S.Class<CustomCode>("CustomCode")({
  Name: S.String,
  Inputs: ManyInputs,
  Code: S.String,
  ClassName: S.String,
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class SqlAlias extends S.Class<SqlAlias>("SqlAlias")({
  From: S.String,
  Alias: S.String,
}) {}
export const SqlAliases = S.Array(SqlAlias);
export class SparkSQL extends S.Class<SparkSQL>("SparkSQL")({
  Name: S.String,
  Inputs: ManyInputs,
  SqlQuery: S.String,
  SqlAliases: SqlAliases,
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class KinesisStreamingSourceOptions extends S.Class<KinesisStreamingSourceOptions>(
  "KinesisStreamingSourceOptions",
)({
  EndpointUrl: S.optional(S.String),
  StreamName: S.optional(S.String),
  Classification: S.optional(S.String),
  Delimiter: S.optional(S.String),
  StartingPosition: S.optional(S.String),
  MaxFetchTimeInMs: S.optional(S.Number),
  MaxFetchRecordsPerShard: S.optional(S.Number),
  MaxRecordPerRead: S.optional(S.Number),
  AddIdleTimeBetweenReads: S.optional(S.Boolean),
  IdleTimeBetweenReadsInMs: S.optional(S.Number),
  DescribeShardInterval: S.optional(S.Number),
  NumRetries: S.optional(S.Number),
  RetryIntervalMs: S.optional(S.Number),
  MaxRetryIntervalMs: S.optional(S.Number),
  AvoidEmptyBatches: S.optional(S.Boolean),
  StreamArn: S.optional(S.String),
  RoleArn: S.optional(S.String),
  RoleSessionName: S.optional(S.String),
  AddRecordTimestamp: S.optional(S.String),
  EmitConsumerLagMetrics: S.optional(S.String),
  StartingTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  FanoutConsumerARN: S.optional(S.String),
}) {}
export class StreamingDataPreviewOptions extends S.Class<StreamingDataPreviewOptions>(
  "StreamingDataPreviewOptions",
)({
  PollingTime: S.optional(S.Number),
  RecordPollingLimit: S.optional(S.Number),
}) {}
export class DirectKinesisSource extends S.Class<DirectKinesisSource>(
  "DirectKinesisSource",
)({
  Name: S.String,
  WindowSize: S.optional(S.Number),
  DetectSchema: S.optional(S.Boolean),
  StreamingOptions: S.optional(KinesisStreamingSourceOptions),
  DataPreviewOptions: S.optional(StreamingDataPreviewOptions),
}) {}
export class KafkaStreamingSourceOptions extends S.Class<KafkaStreamingSourceOptions>(
  "KafkaStreamingSourceOptions",
)({
  BootstrapServers: S.optional(S.String),
  SecurityProtocol: S.optional(S.String),
  ConnectionName: S.optional(S.String),
  TopicName: S.optional(S.String),
  Assign: S.optional(S.String),
  SubscribePattern: S.optional(S.String),
  Classification: S.optional(S.String),
  Delimiter: S.optional(S.String),
  StartingOffsets: S.optional(S.String),
  EndingOffsets: S.optional(S.String),
  PollTimeoutMs: S.optional(S.Number),
  NumRetries: S.optional(S.Number),
  RetryIntervalMs: S.optional(S.Number),
  MaxOffsetsPerTrigger: S.optional(S.Number),
  MinPartitions: S.optional(S.Number),
  IncludeHeaders: S.optional(S.Boolean),
  AddRecordTimestamp: S.optional(S.String),
  EmitConsumerLagMetrics: S.optional(S.String),
  StartingTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class DirectKafkaSource extends S.Class<DirectKafkaSource>(
  "DirectKafkaSource",
)({
  Name: S.String,
  StreamingOptions: S.optional(KafkaStreamingSourceOptions),
  WindowSize: S.optional(S.Number),
  DetectSchema: S.optional(S.Boolean),
  DataPreviewOptions: S.optional(StreamingDataPreviewOptions),
}) {}
export class CatalogKinesisSource extends S.Class<CatalogKinesisSource>(
  "CatalogKinesisSource",
)({
  Name: S.String,
  WindowSize: S.optional(S.Number),
  DetectSchema: S.optional(S.Boolean),
  Table: S.String,
  Database: S.String,
  StreamingOptions: S.optional(KinesisStreamingSourceOptions),
  DataPreviewOptions: S.optional(StreamingDataPreviewOptions),
}) {}
export class CatalogKafkaSource extends S.Class<CatalogKafkaSource>(
  "CatalogKafkaSource",
)({
  Name: S.String,
  WindowSize: S.optional(S.Number),
  DetectSchema: S.optional(S.Boolean),
  Table: S.String,
  Database: S.String,
  StreamingOptions: S.optional(KafkaStreamingSourceOptions),
  DataPreviewOptions: S.optional(StreamingDataPreviewOptions),
}) {}
export class NullCheckBoxList extends S.Class<NullCheckBoxList>(
  "NullCheckBoxList",
)({
  IsEmpty: S.optional(S.Boolean),
  IsNullString: S.optional(S.Boolean),
  IsNegOne: S.optional(S.Boolean),
}) {}
export class Datatype extends S.Class<Datatype>("Datatype")({
  Id: S.String,
  Label: S.String,
}) {}
export class NullValueField extends S.Class<NullValueField>("NullValueField")({
  Value: S.String,
  Datatype: Datatype,
}) {}
export const NullValueFields = S.Array(NullValueField);
export class DropNullFields extends S.Class<DropNullFields>("DropNullFields")({
  Name: S.String,
  Inputs: OneInput,
  NullCheckBoxList: S.optional(NullCheckBoxList),
  NullTextList: S.optional(NullValueFields),
}) {}
export class Merge extends S.Class<Merge>("Merge")({
  Name: S.String,
  Inputs: TwoInputs,
  Source: S.String,
  PrimaryKeys: GlueStudioPathList,
}) {}
export class Union extends S.Class<Union>("Union")({
  Name: S.String,
  Inputs: TwoInputs,
  UnionType: S.String,
}) {}
export class PIIDetection extends S.Class<PIIDetection>("PIIDetection")({
  Name: S.String,
  Inputs: OneInput,
  PiiType: S.String,
  EntityTypesToDetect: EnclosedInStringProperties,
  OutputColumnName: S.optional(S.String),
  SampleFraction: S.optional(S.Number),
  ThresholdFraction: S.optional(S.Number),
  MaskValue: S.optional(S.String),
  RedactText: S.optional(S.String),
  RedactChar: S.optional(S.String),
  MatchPattern: S.optional(S.String),
  NumLeftCharsToExclude: S.optional(S.Number),
  NumRightCharsToExclude: S.optional(S.Number),
  DetectionParameters: S.optional(S.String),
  DetectionSensitivity: S.optional(S.String),
}) {}
export class AggregateOperation extends S.Class<AggregateOperation>(
  "AggregateOperation",
)({ Column: EnclosedInStringProperties, AggFunc: S.String }) {}
export const AggregateOperations = S.Array(AggregateOperation);
export class Aggregate extends S.Class<Aggregate>("Aggregate")({
  Name: S.String,
  Inputs: OneInput,
  Groups: GlueStudioPathList,
  Aggs: AggregateOperations,
}) {}
export const LimitedStringList = S.Array(S.String);
export const LimitedPathList = S.Array(LimitedStringList);
export class DropDuplicates extends S.Class<DropDuplicates>("DropDuplicates")({
  Name: S.String,
  Inputs: OneInput,
  Columns: S.optional(LimitedPathList),
}) {}
export class GovernedCatalogTarget extends S.Class<GovernedCatalogTarget>(
  "GovernedCatalogTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  PartitionKeys: S.optional(GlueStudioPathList),
  Table: S.String,
  Database: S.String,
  SchemaChangePolicy: S.optional(CatalogSchemaChangePolicy),
}) {}
export class GovernedCatalogSource extends S.Class<GovernedCatalogSource>(
  "GovernedCatalogSource",
)({
  Name: S.String,
  Database: S.String,
  Table: S.String,
  PartitionPredicate: S.optional(S.String),
  AdditionalOptions: S.optional(S3SourceAdditionalOptions),
}) {}
export class MicrosoftSQLServerCatalogSource extends S.Class<MicrosoftSQLServerCatalogSource>(
  "MicrosoftSQLServerCatalogSource",
)({ Name: S.String, Database: S.String, Table: S.String }) {}
export class MySQLCatalogSource extends S.Class<MySQLCatalogSource>(
  "MySQLCatalogSource",
)({ Name: S.String, Database: S.String, Table: S.String }) {}
export class OracleSQLCatalogSource extends S.Class<OracleSQLCatalogSource>(
  "OracleSQLCatalogSource",
)({ Name: S.String, Database: S.String, Table: S.String }) {}
export class PostgreSQLCatalogSource extends S.Class<PostgreSQLCatalogSource>(
  "PostgreSQLCatalogSource",
)({ Name: S.String, Database: S.String, Table: S.String }) {}
export class MicrosoftSQLServerCatalogTarget extends S.Class<MicrosoftSQLServerCatalogTarget>(
  "MicrosoftSQLServerCatalogTarget",
)({ Name: S.String, Inputs: OneInput, Database: S.String, Table: S.String }) {}
export class MySQLCatalogTarget extends S.Class<MySQLCatalogTarget>(
  "MySQLCatalogTarget",
)({ Name: S.String, Inputs: OneInput, Database: S.String, Table: S.String }) {}
export class OracleSQLCatalogTarget extends S.Class<OracleSQLCatalogTarget>(
  "OracleSQLCatalogTarget",
)({ Name: S.String, Inputs: OneInput, Database: S.String, Table: S.String }) {}
export class PostgreSQLCatalogTarget extends S.Class<PostgreSQLCatalogTarget>(
  "PostgreSQLCatalogTarget",
)({ Name: S.String, Inputs: OneInput, Database: S.String, Table: S.String }) {}
export class GroupFilters extends S.Class<GroupFilters>("GroupFilters")({
  GroupName: S.String,
  Filters: FilterExpressions,
  LogicalOperator: S.String,
}) {}
export const GroupFiltersList = S.Array(GroupFilters);
export class Route extends S.Class<Route>("Route")({
  Name: S.String,
  Inputs: OneInput,
  GroupFiltersList: GroupFiltersList,
}) {}
export class TransformConfigParameter extends S.Class<TransformConfigParameter>(
  "TransformConfigParameter",
)({
  Name: S.String,
  Type: S.String,
  ValidationRule: S.optional(S.String),
  ValidationMessage: S.optional(S.String),
  Value: S.optional(EnclosedInStringProperties),
  ListType: S.optional(S.String),
  IsOptional: S.optional(S.Boolean),
}) {}
export const TransformConfigParameterList = S.Array(TransformConfigParameter);
export class DynamicTransform extends S.Class<DynamicTransform>(
  "DynamicTransform",
)({
  Name: S.String,
  TransformName: S.String,
  Inputs: OneInput,
  Parameters: S.optional(TransformConfigParameterList),
  FunctionName: S.String,
  Path: S.String,
  Version: S.optional(S.String),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class DQResultsPublishingOptions extends S.Class<DQResultsPublishingOptions>(
  "DQResultsPublishingOptions",
)({
  EvaluationContext: S.optional(S.String),
  ResultsS3Prefix: S.optional(S.String),
  CloudWatchMetricsEnabled: S.optional(S.Boolean),
  ResultsPublishingEnabled: S.optional(S.Boolean),
}) {}
export class DQStopJobOnFailureOptions extends S.Class<DQStopJobOnFailureOptions>(
  "DQStopJobOnFailureOptions",
)({ StopJobOnFailureTiming: S.optional(S.String) }) {}
export class EvaluateDataQuality extends S.Class<EvaluateDataQuality>(
  "EvaluateDataQuality",
)({
  Name: S.String,
  Inputs: OneInput,
  Ruleset: S.String,
  Output: S.optional(S.String),
  PublishingOptions: S.optional(DQResultsPublishingOptions),
  StopJobOnFailureOptions: S.optional(DQStopJobOnFailureOptions),
}) {}
export class S3CatalogHudiSource extends S.Class<S3CatalogHudiSource>(
  "S3CatalogHudiSource",
)({
  Name: S.String,
  Database: S.String,
  Table: S.String,
  AdditionalHudiOptions: S.optional(AdditionalOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class CatalogHudiSource extends S.Class<CatalogHudiSource>(
  "CatalogHudiSource",
)({
  Name: S.String,
  Database: S.String,
  Table: S.String,
  AdditionalHudiOptions: S.optional(AdditionalOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class S3HudiSource extends S.Class<S3HudiSource>("S3HudiSource")({
  Name: S.String,
  Paths: EnclosedInStringProperties,
  AdditionalHudiOptions: S.optional(AdditionalOptions),
  AdditionalOptions: S.optional(S3DirectSourceAdditionalOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class S3HudiCatalogTarget extends S.Class<S3HudiCatalogTarget>(
  "S3HudiCatalogTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  PartitionKeys: S.optional(GlueStudioPathList),
  Table: S.String,
  Database: S.String,
  AdditionalOptions: AdditionalOptions,
  SchemaChangePolicy: S.optional(CatalogSchemaChangePolicy),
  AutoDataQuality: S.optional(AutoDataQuality),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class S3HudiDirectTarget extends S.Class<S3HudiDirectTarget>(
  "S3HudiDirectTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  Path: S.String,
  Compression: S.String,
  NumberTargetPartitions: S.optional(S.String),
  PartitionKeys: S.optional(GlueStudioPathList),
  Format: S.String,
  AdditionalOptions: AdditionalOptions,
  SchemaChangePolicy: S.optional(DirectSchemaChangePolicy),
  AutoDataQuality: S.optional(AutoDataQuality),
}) {}
export class DirectJDBCSource extends S.Class<DirectJDBCSource>(
  "DirectJDBCSource",
)({
  Name: S.String,
  Database: S.String,
  Table: S.String,
  ConnectionName: S.String,
  ConnectionType: S.String,
  RedshiftTmpDir: S.optional(S.String),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class S3CatalogDeltaSource extends S.Class<S3CatalogDeltaSource>(
  "S3CatalogDeltaSource",
)({
  Name: S.String,
  Database: S.String,
  Table: S.String,
  AdditionalDeltaOptions: S.optional(AdditionalOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class CatalogDeltaSource extends S.Class<CatalogDeltaSource>(
  "CatalogDeltaSource",
)({
  Name: S.String,
  Database: S.String,
  Table: S.String,
  AdditionalDeltaOptions: S.optional(AdditionalOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class S3DeltaSource extends S.Class<S3DeltaSource>("S3DeltaSource")({
  Name: S.String,
  Paths: EnclosedInStringProperties,
  AdditionalDeltaOptions: S.optional(AdditionalOptions),
  AdditionalOptions: S.optional(S3DirectSourceAdditionalOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class S3DeltaCatalogTarget extends S.Class<S3DeltaCatalogTarget>(
  "S3DeltaCatalogTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  PartitionKeys: S.optional(GlueStudioPathList),
  Table: S.String,
  Database: S.String,
  AdditionalOptions: S.optional(AdditionalOptions),
  SchemaChangePolicy: S.optional(CatalogSchemaChangePolicy),
  AutoDataQuality: S.optional(AutoDataQuality),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class S3DeltaDirectTarget extends S.Class<S3DeltaDirectTarget>(
  "S3DeltaDirectTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  PartitionKeys: S.optional(GlueStudioPathList),
  Path: S.String,
  Compression: S.String,
  NumberTargetPartitions: S.optional(S.String),
  Format: S.String,
  AdditionalOptions: S.optional(AdditionalOptions),
  SchemaChangePolicy: S.optional(DirectSchemaChangePolicy),
  AutoDataQuality: S.optional(AutoDataQuality),
}) {}
export class Option extends S.Class<Option>("Option")({
  Value: S.optional(S.String),
  Label: S.optional(S.String),
  Description: S.optional(S.String),
}) {}
export class AmazonRedshiftAdvancedOption extends S.Class<AmazonRedshiftAdvancedOption>(
  "AmazonRedshiftAdvancedOption",
)({ Key: S.optional(S.String), Value: S.optional(S.String) }) {}
export const AmazonRedshiftAdvancedOptions = S.Array(
  AmazonRedshiftAdvancedOption,
);
export const OptionList = S.Array(Option);
export class AmazonRedshiftNodeData extends S.Class<AmazonRedshiftNodeData>(
  "AmazonRedshiftNodeData",
)({
  AccessType: S.optional(S.String),
  SourceType: S.optional(S.String),
  Connection: S.optional(Option),
  Schema: S.optional(Option),
  Table: S.optional(Option),
  CatalogDatabase: S.optional(Option),
  CatalogTable: S.optional(Option),
  CatalogRedshiftSchema: S.optional(S.String),
  CatalogRedshiftTable: S.optional(S.String),
  TempDir: S.optional(S.String),
  IamRole: S.optional(Option),
  AdvancedOptions: S.optional(AmazonRedshiftAdvancedOptions),
  SampleQuery: S.optional(S.String),
  PreAction: S.optional(S.String),
  PostAction: S.optional(S.String),
  Action: S.optional(S.String),
  TablePrefix: S.optional(S.String),
  Upsert: S.optional(S.Boolean),
  MergeAction: S.optional(S.String),
  MergeWhenMatched: S.optional(S.String),
  MergeWhenNotMatched: S.optional(S.String),
  MergeClause: S.optional(S.String),
  CrawlerConnection: S.optional(S.String),
  TableSchema: S.optional(OptionList),
  StagingTable: S.optional(S.String),
  SelectedColumns: S.optional(OptionList),
}) {}
export class AmazonRedshiftSource extends S.Class<AmazonRedshiftSource>(
  "AmazonRedshiftSource",
)({ Name: S.optional(S.String), Data: S.optional(AmazonRedshiftNodeData) }) {}
export class AmazonRedshiftTarget extends S.Class<AmazonRedshiftTarget>(
  "AmazonRedshiftTarget",
)({
  Name: S.optional(S.String),
  Data: S.optional(AmazonRedshiftNodeData),
  Inputs: S.optional(OneInput),
}) {}
export const DQDLAliases = S.Record({ key: S.String, value: S.String });
export const DQAdditionalOptions = S.Record({ key: S.String, value: S.String });
export class EvaluateDataQualityMultiFrame extends S.Class<EvaluateDataQualityMultiFrame>(
  "EvaluateDataQualityMultiFrame",
)({
  Name: S.String,
  Inputs: ManyInputs,
  AdditionalDataSources: S.optional(DQDLAliases),
  Ruleset: S.String,
  PublishingOptions: S.optional(DQResultsPublishingOptions),
  AdditionalOptions: S.optional(DQAdditionalOptions),
  StopJobOnFailureOptions: S.optional(DQStopJobOnFailureOptions),
}) {}
export class RecipeReference extends S.Class<RecipeReference>(
  "RecipeReference",
)({ RecipeArn: S.String, RecipeVersion: S.String }) {}
export const ParameterMap = S.Record({ key: S.String, value: S.String });
export class RecipeAction extends S.Class<RecipeAction>("RecipeAction")({
  Operation: S.String,
  Parameters: S.optional(ParameterMap),
}) {}
export class ConditionExpression extends S.Class<ConditionExpression>(
  "ConditionExpression",
)({
  Condition: S.String,
  Value: S.optional(S.String),
  TargetColumn: S.String,
}) {}
export const ConditionExpressionList = S.Array(ConditionExpression);
export class RecipeStep extends S.Class<RecipeStep>("RecipeStep")({
  Action: RecipeAction,
  ConditionExpressions: S.optional(ConditionExpressionList),
}) {}
export const RecipeSteps = S.Array(RecipeStep);
export class Recipe extends S.Class<Recipe>("Recipe")({
  Name: S.String,
  Inputs: OneInput,
  RecipeReference: S.optional(RecipeReference),
  RecipeSteps: S.optional(RecipeSteps),
}) {}
export class SnowflakeNodeData extends S.Class<SnowflakeNodeData>(
  "SnowflakeNodeData",
)({
  SourceType: S.optional(S.String),
  Connection: S.optional(Option),
  Schema: S.optional(S.String),
  Table: S.optional(S.String),
  Database: S.optional(S.String),
  TempDir: S.optional(S.String),
  IamRole: S.optional(Option),
  AdditionalOptions: S.optional(AdditionalOptions),
  SampleQuery: S.optional(S.String),
  PreAction: S.optional(S.String),
  PostAction: S.optional(S.String),
  Action: S.optional(S.String),
  Upsert: S.optional(S.Boolean),
  MergeAction: S.optional(S.String),
  MergeWhenMatched: S.optional(S.String),
  MergeWhenNotMatched: S.optional(S.String),
  MergeClause: S.optional(S.String),
  StagingTable: S.optional(S.String),
  SelectedColumns: S.optional(OptionList),
  AutoPushdown: S.optional(S.Boolean),
  TableSchema: S.optional(OptionList),
}) {}
export class SnowflakeSource extends S.Class<SnowflakeSource>(
  "SnowflakeSource",
)({
  Name: S.String,
  Data: SnowflakeNodeData,
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class SnowflakeTarget extends S.Class<SnowflakeTarget>(
  "SnowflakeTarget",
)({ Name: S.String, Data: SnowflakeNodeData, Inputs: S.optional(OneInput) }) {}
export const ConnectorOptions = S.Record({ key: S.String, value: S.String });
export class ConnectorDataSource extends S.Class<ConnectorDataSource>(
  "ConnectorDataSource",
)({
  Name: S.String,
  ConnectionType: S.String,
  Data: ConnectorOptions,
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class ConnectorDataTarget extends S.Class<ConnectorDataTarget>(
  "ConnectorDataTarget",
)({
  Name: S.String,
  ConnectionType: S.String,
  Data: ConnectorOptions,
  Inputs: S.optional(OneInput),
}) {}
export class S3CatalogIcebergSource extends S.Class<S3CatalogIcebergSource>(
  "S3CatalogIcebergSource",
)({
  Name: S.String,
  Database: S.String,
  Table: S.String,
  AdditionalIcebergOptions: S.optional(AdditionalOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class CatalogIcebergSource extends S.Class<CatalogIcebergSource>(
  "CatalogIcebergSource",
)({
  Name: S.String,
  Database: S.String,
  Table: S.String,
  AdditionalIcebergOptions: S.optional(AdditionalOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class S3IcebergCatalogTarget extends S.Class<S3IcebergCatalogTarget>(
  "S3IcebergCatalogTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  PartitionKeys: S.optional(GlueStudioPathList),
  Table: S.String,
  Database: S.String,
  AdditionalOptions: S.optional(AdditionalOptions),
  SchemaChangePolicy: S.optional(CatalogSchemaChangePolicy),
  AutoDataQuality: S.optional(AutoDataQuality),
}) {}
export class S3IcebergDirectTarget extends S.Class<S3IcebergDirectTarget>(
  "S3IcebergDirectTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  PartitionKeys: S.optional(GlueStudioPathList),
  Path: S.String,
  Format: S.String,
  AdditionalOptions: S.optional(AdditionalOptions),
  SchemaChangePolicy: S.optional(DirectSchemaChangePolicy),
  AutoDataQuality: S.optional(AutoDataQuality),
  Compression: S.String,
  NumberTargetPartitions: S.optional(S.String),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class S3ExcelSource extends S.Class<S3ExcelSource>("S3ExcelSource")({
  Name: S.String,
  Paths: EnclosedInStringProperties,
  CompressionType: S.optional(S.String),
  Exclusions: S.optional(EnclosedInStringProperties),
  GroupSize: S.optional(S.String),
  GroupFiles: S.optional(S.String),
  Recurse: S.optional(S.Boolean),
  MaxBand: S.optional(S.Number),
  MaxFilesInBand: S.optional(S.Number),
  AdditionalOptions: S.optional(S3DirectSourceAdditionalOptions),
  NumberRows: S.optional(S.Number),
  SkipFooter: S.optional(S.Number),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class S3HyperDirectTarget extends S.Class<S3HyperDirectTarget>(
  "S3HyperDirectTarget",
)({
  Name: S.String,
  Inputs: OneInput,
  Format: S.optional(S.String),
  PartitionKeys: S.optional(GlueStudioPathList),
  Path: S.String,
  Compression: S.optional(S.String),
  SchemaChangePolicy: S.optional(DirectSchemaChangePolicy),
  AutoDataQuality: S.optional(AutoDataQuality),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class DDBELTConnectionOptions extends S.Class<DDBELTConnectionOptions>(
  "DDBELTConnectionOptions",
)({
  DynamodbExport: S.optional(S.String),
  DynamodbUnnestDDBJson: S.optional(S.Boolean),
  DynamodbTableArn: S.String,
  DynamodbS3Bucket: S.optional(S.String),
  DynamodbS3Prefix: S.optional(S.String),
  DynamodbS3BucketOwner: S.optional(S.String),
  DynamodbStsRoleArn: S.optional(S.String),
}) {}
export class DynamoDBELTConnectorSource extends S.Class<DynamoDBELTConnectorSource>(
  "DynamoDBELTConnectorSource",
)({
  Name: S.String,
  ConnectionOptions: S.optional(DDBELTConnectionOptions),
  OutputSchemas: S.optional(GlueSchemas),
}) {}
export class CodeGenConfigurationNode extends S.Class<CodeGenConfigurationNode>(
  "CodeGenConfigurationNode",
)({
  AthenaConnectorSource: S.optional(AthenaConnectorSource),
  JDBCConnectorSource: S.optional(JDBCConnectorSource),
  SparkConnectorSource: S.optional(SparkConnectorSource),
  CatalogSource: S.optional(CatalogSource),
  RedshiftSource: S.optional(RedshiftSource),
  S3CatalogSource: S.optional(S3CatalogSource),
  S3CsvSource: S.optional(S3CsvSource),
  S3JsonSource: S.optional(S3JsonSource),
  S3ParquetSource: S.optional(S3ParquetSource),
  RelationalCatalogSource: S.optional(RelationalCatalogSource),
  DynamoDBCatalogSource: S.optional(DynamoDBCatalogSource),
  JDBCConnectorTarget: S.optional(JDBCConnectorTarget),
  SparkConnectorTarget: S.optional(SparkConnectorTarget),
  CatalogTarget: S.optional(BasicCatalogTarget),
  RedshiftTarget: S.optional(RedshiftTarget),
  S3CatalogTarget: S.optional(S3CatalogTarget),
  S3GlueParquetTarget: S.optional(S3GlueParquetTarget),
  S3DirectTarget: S.optional(S3DirectTarget),
  ApplyMapping: S.optional(ApplyMapping),
  SelectFields: S.optional(SelectFields),
  DropFields: S.optional(DropFields),
  RenameField: S.optional(RenameField),
  Spigot: S.optional(Spigot),
  Join: S.optional(Join),
  SplitFields: S.optional(SplitFields),
  SelectFromCollection: S.optional(SelectFromCollection),
  FillMissingValues: S.optional(FillMissingValues),
  Filter: S.optional(Filter),
  CustomCode: S.optional(CustomCode),
  SparkSQL: S.optional(SparkSQL),
  DirectKinesisSource: S.optional(DirectKinesisSource),
  DirectKafkaSource: S.optional(DirectKafkaSource),
  CatalogKinesisSource: S.optional(CatalogKinesisSource),
  CatalogKafkaSource: S.optional(CatalogKafkaSource),
  DropNullFields: S.optional(DropNullFields),
  Merge: S.optional(Merge),
  Union: S.optional(Union),
  PIIDetection: S.optional(PIIDetection),
  Aggregate: S.optional(Aggregate),
  DropDuplicates: S.optional(DropDuplicates),
  GovernedCatalogTarget: S.optional(GovernedCatalogTarget),
  GovernedCatalogSource: S.optional(GovernedCatalogSource),
  MicrosoftSQLServerCatalogSource: S.optional(MicrosoftSQLServerCatalogSource),
  MySQLCatalogSource: S.optional(MySQLCatalogSource),
  OracleSQLCatalogSource: S.optional(OracleSQLCatalogSource),
  PostgreSQLCatalogSource: S.optional(PostgreSQLCatalogSource),
  MicrosoftSQLServerCatalogTarget: S.optional(MicrosoftSQLServerCatalogTarget),
  MySQLCatalogTarget: S.optional(MySQLCatalogTarget),
  OracleSQLCatalogTarget: S.optional(OracleSQLCatalogTarget),
  PostgreSQLCatalogTarget: S.optional(PostgreSQLCatalogTarget),
  Route: S.optional(Route),
  DynamicTransform: S.optional(DynamicTransform),
  EvaluateDataQuality: S.optional(EvaluateDataQuality),
  S3CatalogHudiSource: S.optional(S3CatalogHudiSource),
  CatalogHudiSource: S.optional(CatalogHudiSource),
  S3HudiSource: S.optional(S3HudiSource),
  S3HudiCatalogTarget: S.optional(S3HudiCatalogTarget),
  S3HudiDirectTarget: S.optional(S3HudiDirectTarget),
  DirectJDBCSource: S.optional(DirectJDBCSource),
  S3CatalogDeltaSource: S.optional(S3CatalogDeltaSource),
  CatalogDeltaSource: S.optional(CatalogDeltaSource),
  S3DeltaSource: S.optional(S3DeltaSource),
  S3DeltaCatalogTarget: S.optional(S3DeltaCatalogTarget),
  S3DeltaDirectTarget: S.optional(S3DeltaDirectTarget),
  AmazonRedshiftSource: S.optional(AmazonRedshiftSource),
  AmazonRedshiftTarget: S.optional(AmazonRedshiftTarget),
  EvaluateDataQualityMultiFrame: S.optional(EvaluateDataQualityMultiFrame),
  Recipe: S.optional(Recipe),
  SnowflakeSource: S.optional(SnowflakeSource),
  SnowflakeTarget: S.optional(SnowflakeTarget),
  ConnectorDataSource: S.optional(ConnectorDataSource),
  ConnectorDataTarget: S.optional(ConnectorDataTarget),
  S3CatalogIcebergSource: S.optional(S3CatalogIcebergSource),
  CatalogIcebergSource: S.optional(CatalogIcebergSource),
  S3IcebergCatalogTarget: S.optional(S3IcebergCatalogTarget),
  S3IcebergDirectTarget: S.optional(S3IcebergDirectTarget),
  S3ExcelSource: S.optional(S3ExcelSource),
  S3HyperDirectTarget: S.optional(S3HyperDirectTarget),
  DynamoDBELTConnectorSource: S.optional(DynamoDBELTConnectorSource),
}) {}
export const CodeGenConfigurationNodes = S.Record({
  key: S.String,
  value: CodeGenConfigurationNode,
});
export class JobUpdate extends S.Class<JobUpdate>("JobUpdate")({
  JobMode: S.optional(S.String),
  JobRunQueuingEnabled: S.optional(S.Boolean),
  Description: S.optional(S.String),
  LogUri: S.optional(S.String),
  Role: S.optional(S.String),
  ExecutionProperty: S.optional(ExecutionProperty),
  Command: S.optional(JobCommand),
  DefaultArguments: S.optional(GenericMap),
  NonOverridableArguments: S.optional(GenericMap),
  Connections: S.optional(ConnectionsList),
  MaxRetries: S.optional(S.Number),
  AllocatedCapacity: S.optional(S.Number),
  Timeout: S.optional(S.Number),
  MaxCapacity: S.optional(S.Number),
  WorkerType: S.optional(S.String),
  NumberOfWorkers: S.optional(S.Number),
  SecurityConfiguration: S.optional(S.String),
  NotificationProperty: S.optional(NotificationProperty),
  GlueVersion: S.optional(S.String),
  CodeGenConfigurationNodes: S.optional(CodeGenConfigurationNodes),
  ExecutionClass: S.optional(S.String),
  SourceControlDetails: S.optional(SourceControlDetails),
  MaintenanceWindow: S.optional(S.String),
}) {}
export class TriggerUpdate extends S.Class<TriggerUpdate>("TriggerUpdate")({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Schedule: S.optional(S.String),
  Actions: S.optional(ActionList),
  Predicate: S.optional(Predicate),
  EventBatchingCondition: S.optional(EventBatchingCondition),
}) {}
export class BatchDeletePartitionRequest extends S.Class<BatchDeletePartitionRequest>(
  "BatchDeletePartitionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionsToDelete: BatchDeletePartitionValueList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchGetTableOptimizerRequest extends S.Class<BatchGetTableOptimizerRequest>(
  "BatchGetTableOptimizerRequest",
)(
  { Entries: BatchGetTableOptimizerEntries },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchPutDataQualityStatisticAnnotationRequest extends S.Class<BatchPutDataQualityStatisticAnnotationRequest>(
  "BatchPutDataQualityStatisticAnnotationRequest",
)(
  {
    InclusionAnnotations: InclusionAnnotationList,
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchUpdatePartitionRequest extends S.Class<BatchUpdatePartitionRequest>(
  "BatchUpdatePartitionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    Entries: BatchUpdatePartitionRequestEntryList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CancelMLTaskRunResponse extends S.Class<CancelMLTaskRunResponse>(
  "CancelMLTaskRunResponse",
)({
  TransformId: S.optional(S.String),
  TaskRunId: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class CheckSchemaVersionValidityResponse extends S.Class<CheckSchemaVersionValidityResponse>(
  "CheckSchemaVersionValidityResponse",
)({ Valid: S.optional(S.Boolean), Error: S.optional(S.String) }) {}
export class CreateBlueprintRequest extends S.Class<CreateBlueprintRequest>(
  "CreateBlueprintRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    BlueprintLocation: S.String,
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateClassifierRequest extends S.Class<CreateClassifierRequest>(
  "CreateClassifierRequest",
)(
  {
    GrokClassifier: S.optional(CreateGrokClassifierRequest),
    XMLClassifier: S.optional(CreateXMLClassifierRequest),
    JsonClassifier: S.optional(CreateJsonClassifierRequest),
    CsvClassifier: S.optional(CreateCsvClassifierRequest),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateClassifierResponse extends S.Class<CreateClassifierResponse>(
  "CreateClassifierResponse",
)({}) {}
export class CreateCustomEntityTypeResponse extends S.Class<CreateCustomEntityTypeResponse>(
  "CreateCustomEntityTypeResponse",
)({ Name: S.optional(S.String) }) {}
export class CreateDataQualityRulesetRequest extends S.Class<CreateDataQualityRulesetRequest>(
  "CreateDataQualityRulesetRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    Ruleset: S.String,
    Tags: S.optional(TagsMap),
    TargetTable: S.optional(DataQualityTargetTable),
    DataQualitySecurityConfiguration: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDevEndpointRequest extends S.Class<CreateDevEndpointRequest>(
  "CreateDevEndpointRequest",
)(
  {
    EndpointName: S.String,
    RoleArn: S.String,
    SecurityGroupIds: S.optional(StringList),
    SubnetId: S.optional(S.String),
    PublicKey: S.optional(S.String),
    PublicKeys: S.optional(PublicKeysList),
    NumberOfNodes: S.optional(S.Number),
    WorkerType: S.optional(S.String),
    GlueVersion: S.optional(S.String),
    NumberOfWorkers: S.optional(S.Number),
    ExtraPythonLibsS3Path: S.optional(S.String),
    ExtraJarsS3Path: S.optional(S.String),
    SecurityConfiguration: S.optional(S.String),
    Tags: S.optional(TagsMap),
    Arguments: S.optional(MapValue),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGlueIdentityCenterConfigurationResponse extends S.Class<CreateGlueIdentityCenterConfigurationResponse>(
  "CreateGlueIdentityCenterConfigurationResponse",
)({ ApplicationArn: S.optional(S.String) }) {}
export class CreateIntegrationResourcePropertyRequest extends S.Class<CreateIntegrationResourcePropertyRequest>(
  "CreateIntegrationResourcePropertyRequest",
)(
  {
    ResourceArn: S.String,
    SourceProcessingProperties: S.optional(SourceProcessingProperties),
    TargetProcessingProperties: S.optional(TargetProcessingProperties),
    Tags: S.optional(IntegrationTagsList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePartitionIndexRequest extends S.Class<CreatePartitionIndexRequest>(
  "CreatePartitionIndexRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionIndex: PartitionIndex,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreatePartitionIndexResponse extends S.Class<CreatePartitionIndexResponse>(
  "CreatePartitionIndexResponse",
)({}) {}
export class CreateRegistryResponse extends S.Class<CreateRegistryResponse>(
  "CreateRegistryResponse",
)({
  RegistryArn: S.optional(S.String),
  RegistryName: S.optional(S.String),
  Description: S.optional(S.String),
  Tags: S.optional(TagsMap),
}) {}
export class CreateSchemaInput extends S.Class<CreateSchemaInput>(
  "CreateSchemaInput",
)(
  {
    RegistryId: S.optional(RegistryId),
    SchemaName: S.String,
    DataFormat: S.String,
    Compatibility: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagsMap),
    SchemaDefinition: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSessionRequest extends S.Class<CreateSessionRequest>(
  "CreateSessionRequest",
)(
  {
    Id: S.String,
    Description: S.optional(S.String),
    Role: S.String,
    Command: SessionCommand,
    Timeout: S.optional(S.Number),
    IdleTimeout: S.optional(S.Number),
    DefaultArguments: S.optional(OrchestrationArgumentsMap),
    Connections: S.optional(ConnectionsList),
    MaxCapacity: S.optional(S.Number),
    NumberOfWorkers: S.optional(S.Number),
    WorkerType: S.optional(S.String),
    SecurityConfiguration: S.optional(S.String),
    GlueVersion: S.optional(S.String),
    Tags: S.optional(TagsMap),
    RequestOrigin: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateWorkflowRequest extends S.Class<CreateWorkflowRequest>(
  "CreateWorkflowRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    DefaultRunProperties: S.optional(WorkflowRunProperties),
    Tags: S.optional(TagsMap),
    MaxConcurrentRuns: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteBlueprintResponse extends S.Class<DeleteBlueprintResponse>(
  "DeleteBlueprintResponse",
)({ Name: S.optional(S.String) }) {}
export class DeleteCustomEntityTypeResponse extends S.Class<DeleteCustomEntityTypeResponse>(
  "DeleteCustomEntityTypeResponse",
)({ Name: S.optional(S.String) }) {}
export class DeleteJobResponse extends S.Class<DeleteJobResponse>(
  "DeleteJobResponse",
)({ JobName: S.optional(S.String) }) {}
export class DeleteMLTransformResponse extends S.Class<DeleteMLTransformResponse>(
  "DeleteMLTransformResponse",
)({ TransformId: S.optional(S.String) }) {}
export class DeleteRegistryResponse extends S.Class<DeleteRegistryResponse>(
  "DeleteRegistryResponse",
)({
  RegistryName: S.optional(S.String),
  RegistryArn: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class DeleteSchemaInput extends S.Class<DeleteSchemaInput>(
  "DeleteSchemaInput",
)(
  { SchemaId: SchemaId },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSessionResponse extends S.Class<DeleteSessionResponse>(
  "DeleteSessionResponse",
)({ Id: S.optional(S.String) }) {}
export class DeleteTriggerResponse extends S.Class<DeleteTriggerResponse>(
  "DeleteTriggerResponse",
)({ Name: S.optional(S.String) }) {}
export class DeleteWorkflowResponse extends S.Class<DeleteWorkflowResponse>(
  "DeleteWorkflowResponse",
)({ Name: S.optional(S.String) }) {}
export class DescribeIntegrationsRequest extends S.Class<DescribeIntegrationsRequest>(
  "DescribeIntegrationsRequest",
)(
  {
    IntegrationIdentifier: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Filters: S.optional(IntegrationFilterList),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class LastActiveDefinition extends S.Class<LastActiveDefinition>(
  "LastActiveDefinition",
)({
  Description: S.optional(S.String),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ParameterSpec: S.optional(S.String),
  BlueprintLocation: S.optional(S.String),
  BlueprintServiceLocation: S.optional(S.String),
}) {}
export class Blueprint extends S.Class<Blueprint>("Blueprint")({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ParameterSpec: S.optional(S.String),
  BlueprintLocation: S.optional(S.String),
  BlueprintServiceLocation: S.optional(S.String),
  Status: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  LastActiveDefinition: S.optional(LastActiveDefinition),
}) {}
export class GetBlueprintResponse extends S.Class<GetBlueprintResponse>(
  "GetBlueprintResponse",
)({ Blueprint: S.optional(Blueprint) }) {}
export class GetBlueprintRunsResponse extends S.Class<GetBlueprintRunsResponse>(
  "GetBlueprintRunsResponse",
)({
  BlueprintRuns: S.optional(BlueprintRuns),
  NextToken: S.optional(S.String),
}) {}
export class GetCatalogsResponse extends S.Class<GetCatalogsResponse>(
  "GetCatalogsResponse",
)({ CatalogList: CatalogList, NextToken: S.optional(S.String) }) {}
export class GetClassifiersResponse extends S.Class<GetClassifiersResponse>(
  "GetClassifiersResponse",
)({
  Classifiers: S.optional(ClassifierList),
  NextToken: S.optional(S.String),
}) {}
export class ErrorDetail extends S.Class<ErrorDetail>("ErrorDetail")({
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export class ColumnError extends S.Class<ColumnError>("ColumnError")({
  ColumnName: S.optional(S.String),
  Error: S.optional(ErrorDetail),
}) {}
export const ColumnErrors = S.Array(ColumnError);
export class GetColumnStatisticsForTableResponse extends S.Class<GetColumnStatisticsForTableResponse>(
  "GetColumnStatisticsForTableResponse",
)({
  ColumnStatisticsList: S.optional(ColumnStatisticsList),
  Errors: S.optional(ColumnErrors),
}) {}
export class GetColumnStatisticsTaskRunsResponse extends S.Class<GetColumnStatisticsTaskRunsResponse>(
  "GetColumnStatisticsTaskRunsResponse",
)({
  ColumnStatisticsTaskRuns: S.optional(ColumnStatisticsTaskRunsList),
  NextToken: S.optional(S.String),
}) {}
export class GetConnectionsRequest extends S.Class<GetConnectionsRequest>(
  "GetConnectionsRequest",
)(
  {
    CatalogId: S.optional(S.String),
    Filter: S.optional(GetConnectionsFilter),
    HidePassword: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Schedule extends S.Class<Schedule>("Schedule")({
  ScheduleExpression: S.optional(S.String),
  State: S.optional(S.String),
}) {}
export class LastCrawlInfo extends S.Class<LastCrawlInfo>("LastCrawlInfo")({
  Status: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  LogGroup: S.optional(S.String),
  LogStream: S.optional(S.String),
  MessagePrefix: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class Crawler extends S.Class<Crawler>("Crawler")({
  Name: S.optional(S.String),
  Role: S.optional(S.String),
  Targets: S.optional(CrawlerTargets),
  DatabaseName: S.optional(S.String),
  Description: S.optional(S.String),
  Classifiers: S.optional(ClassifierNameList),
  RecrawlPolicy: S.optional(RecrawlPolicy),
  SchemaChangePolicy: S.optional(SchemaChangePolicy),
  LineageConfiguration: S.optional(LineageConfiguration),
  State: S.optional(S.String),
  TablePrefix: S.optional(S.String),
  Schedule: S.optional(Schedule),
  CrawlElapsedTime: S.optional(S.Number),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastCrawl: S.optional(LastCrawlInfo),
  Version: S.optional(S.Number),
  Configuration: S.optional(S.String),
  CrawlerSecurityConfiguration: S.optional(S.String),
  LakeFormationConfiguration: S.optional(LakeFormationConfiguration),
}) {}
export class GetCrawlerResponse extends S.Class<GetCrawlerResponse>(
  "GetCrawlerResponse",
)({ Crawler: S.optional(Crawler) }) {}
export const CrawlerList = S.Array(Crawler);
export class GetCrawlersResponse extends S.Class<GetCrawlersResponse>(
  "GetCrawlersResponse",
)({ Crawlers: S.optional(CrawlerList), NextToken: S.optional(S.String) }) {}
export class GetCustomEntityTypeResponse extends S.Class<GetCustomEntityTypeResponse>(
  "GetCustomEntityTypeResponse",
)({
  Name: S.optional(S.String),
  RegexString: S.optional(S.String),
  ContextWords: S.optional(ContextWords),
}) {}
export class GetDatabasesResponse extends S.Class<GetDatabasesResponse>(
  "GetDatabasesResponse",
)({ DatabaseList: DatabaseList, NextToken: S.optional(S.String) }) {}
export class EncryptionAtRest extends S.Class<EncryptionAtRest>(
  "EncryptionAtRest",
)({
  CatalogEncryptionMode: S.String,
  SseAwsKmsKeyId: S.optional(S.String),
  CatalogEncryptionServiceRole: S.optional(S.String),
}) {}
export class ConnectionPasswordEncryption extends S.Class<ConnectionPasswordEncryption>(
  "ConnectionPasswordEncryption",
)({
  ReturnConnectionPasswordEncrypted: S.Boolean,
  AwsKmsKeyId: S.optional(S.String),
}) {}
export class DataCatalogEncryptionSettings extends S.Class<DataCatalogEncryptionSettings>(
  "DataCatalogEncryptionSettings",
)({
  EncryptionAtRest: S.optional(EncryptionAtRest),
  ConnectionPasswordEncryption: S.optional(ConnectionPasswordEncryption),
}) {}
export class GetDataCatalogEncryptionSettingsResponse extends S.Class<GetDataCatalogEncryptionSettingsResponse>(
  "GetDataCatalogEncryptionSettingsResponse",
)({
  DataCatalogEncryptionSettings: S.optional(DataCatalogEncryptionSettings),
}) {}
export class CodeGenNode extends S.Class<CodeGenNode>("CodeGenNode")({
  Id: S.String,
  NodeType: S.String,
  Args: CodeGenNodeArgs,
  LineNumber: S.optional(S.Number),
}) {}
export const DagNodes = S.Array(CodeGenNode);
export class GetDataflowGraphResponse extends S.Class<GetDataflowGraphResponse>(
  "GetDataflowGraphResponse",
)({ DagNodes: S.optional(DagNodes), DagEdges: S.optional(DagEdges) }) {}
export class GetDataQualityModelResponse extends S.Class<GetDataQualityModelResponse>(
  "GetDataQualityModelResponse",
)({
  Status: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  FailureReason: S.optional(S.String),
}) {}
export class GetDataQualityRuleRecommendationRunResponse extends S.Class<GetDataQualityRuleRecommendationRunResponse>(
  "GetDataQualityRuleRecommendationRunResponse",
)({
  RunId: S.optional(S.String),
  DataSource: S.optional(DataSource),
  Role: S.optional(S.String),
  NumberOfWorkers: S.optional(S.Number),
  Timeout: S.optional(S.Number),
  Status: S.optional(S.String),
  ErrorString: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExecutionTime: S.optional(S.Number),
  RecommendedRuleset: S.optional(S.String),
  CreatedRulesetName: S.optional(S.String),
  DataQualitySecurityConfiguration: S.optional(S.String),
}) {}
export class GetDataQualityRulesetResponse extends S.Class<GetDataQualityRulesetResponse>(
  "GetDataQualityRulesetResponse",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Ruleset: S.optional(S.String),
  TargetTable: S.optional(DataQualityTargetTable),
  CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  RecommendationRunId: S.optional(S.String),
  DataQualitySecurityConfiguration: S.optional(S.String),
}) {}
export class GetDataQualityRulesetEvaluationRunResponse extends S.Class<GetDataQualityRulesetEvaluationRunResponse>(
  "GetDataQualityRulesetEvaluationRunResponse",
)({
  RunId: S.optional(S.String),
  DataSource: S.optional(DataSource),
  Role: S.optional(S.String),
  NumberOfWorkers: S.optional(S.Number),
  Timeout: S.optional(S.Number),
  AdditionalRunOptions: S.optional(
    DataQualityEvaluationRunAdditionalRunOptions,
  ),
  Status: S.optional(S.String),
  ErrorString: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExecutionTime: S.optional(S.Number),
  RulesetNames: S.optional(RulesetNames),
  ResultIds: S.optional(DataQualityResultIdList),
  AdditionalDataSources: S.optional(DataSourceMap),
}) {}
export class DevEndpoint extends S.Class<DevEndpoint>("DevEndpoint")({
  EndpointName: S.optional(S.String),
  RoleArn: S.optional(S.String),
  SecurityGroupIds: S.optional(StringList),
  SubnetId: S.optional(S.String),
  YarnEndpointAddress: S.optional(S.String),
  PrivateAddress: S.optional(S.String),
  ZeppelinRemoteSparkInterpreterPort: S.optional(S.Number),
  PublicAddress: S.optional(S.String),
  Status: S.optional(S.String),
  WorkerType: S.optional(S.String),
  GlueVersion: S.optional(S.String),
  NumberOfWorkers: S.optional(S.Number),
  NumberOfNodes: S.optional(S.Number),
  AvailabilityZone: S.optional(S.String),
  VpcId: S.optional(S.String),
  ExtraPythonLibsS3Path: S.optional(S.String),
  ExtraJarsS3Path: S.optional(S.String),
  FailureReason: S.optional(S.String),
  LastUpdateStatus: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  PublicKey: S.optional(S.String),
  PublicKeys: S.optional(PublicKeysList),
  SecurityConfiguration: S.optional(S.String),
  Arguments: S.optional(MapValue),
}) {}
export class GetDevEndpointResponse extends S.Class<GetDevEndpointResponse>(
  "GetDevEndpointResponse",
)({ DevEndpoint: S.optional(DevEndpoint) }) {}
export const DevEndpointList = S.Array(DevEndpoint);
export class GetDevEndpointsResponse extends S.Class<GetDevEndpointsResponse>(
  "GetDevEndpointsResponse",
)({
  DevEndpoints: S.optional(DevEndpointList),
  NextToken: S.optional(S.String),
}) {}
export class GetEntityRecordsRequest extends S.Class<GetEntityRecordsRequest>(
  "GetEntityRecordsRequest",
)(
  {
    ConnectionName: S.optional(S.String),
    CatalogId: S.optional(S.String),
    EntityName: S.String,
    NextToken: S.optional(S.String),
    DataStoreApiVersion: S.optional(S.String),
    ConnectionOptions: S.optional(ConnectionOptions),
    FilterPredicate: S.optional(S.String),
    Limit: S.Number,
    OrderBy: S.optional(S.String),
    SelectedFields: S.optional(SelectedFields),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetIntegrationResourcePropertyResponse extends S.Class<GetIntegrationResourcePropertyResponse>(
  "GetIntegrationResourcePropertyResponse",
)({
  ResourceArn: S.optional(S.String),
  ResourcePropertyArn: S.optional(S.String),
  SourceProcessingProperties: S.optional(SourceProcessingProperties),
  TargetProcessingProperties: S.optional(TargetProcessingProperties),
}) {}
export class GetIntegrationTablePropertiesResponse extends S.Class<GetIntegrationTablePropertiesResponse>(
  "GetIntegrationTablePropertiesResponse",
)({
  ResourceArn: S.optional(S.String),
  TableName: S.optional(S.String),
  SourceTableConfig: S.optional(SourceTableConfig),
  TargetTableConfig: S.optional(TargetTableConfig),
}) {}
export class Job extends S.Class<Job>("Job")({
  Name: S.optional(S.String),
  JobMode: S.optional(S.String),
  JobRunQueuingEnabled: S.optional(S.Boolean),
  Description: S.optional(S.String),
  LogUri: S.optional(S.String),
  Role: S.optional(S.String),
  CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExecutionProperty: S.optional(ExecutionProperty),
  Command: S.optional(JobCommand),
  DefaultArguments: S.optional(GenericMap),
  NonOverridableArguments: S.optional(GenericMap),
  Connections: S.optional(ConnectionsList),
  MaxRetries: S.optional(S.Number),
  AllocatedCapacity: S.optional(S.Number),
  Timeout: S.optional(S.Number),
  MaxCapacity: S.optional(S.Number),
  WorkerType: S.optional(S.String),
  NumberOfWorkers: S.optional(S.Number),
  SecurityConfiguration: S.optional(S.String),
  NotificationProperty: S.optional(NotificationProperty),
  GlueVersion: S.optional(S.String),
  CodeGenConfigurationNodes: S.optional(CodeGenConfigurationNodes),
  ExecutionClass: S.optional(S.String),
  SourceControlDetails: S.optional(SourceControlDetails),
  MaintenanceWindow: S.optional(S.String),
  ProfileName: S.optional(S.String),
}) {}
export class GetJobResponse extends S.Class<GetJobResponse>("GetJobResponse")({
  Job: S.optional(Job),
}) {}
export class GetJobRunsResponse extends S.Class<GetJobRunsResponse>(
  "GetJobRunsResponse",
)({ JobRuns: S.optional(JobRunList), NextToken: S.optional(S.String) }) {}
export const JobList = S.Array(Job);
export class GetJobsResponse extends S.Class<GetJobsResponse>(
  "GetJobsResponse",
)({ Jobs: S.optional(JobList), NextToken: S.optional(S.String) }) {}
export class GetMappingRequest extends S.Class<GetMappingRequest>(
  "GetMappingRequest",
)(
  {
    Source: CatalogEntry,
    Sinks: S.optional(CatalogEntries),
    Location: S.optional(Location),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetMLTaskRunsRequest extends S.Class<GetMLTaskRunsRequest>(
  "GetMLTaskRunsRequest",
)(
  {
    TransformId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filter: S.optional(TaskRunFilterCriteria),
    Sort: S.optional(TaskRunSortCriteria),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Partition extends S.Class<Partition>("Partition")({
  Values: S.optional(ValueStringList),
  DatabaseName: S.optional(S.String),
  TableName: S.optional(S.String),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastAccessTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  StorageDescriptor: S.optional(StorageDescriptor),
  Parameters: S.optional(ParametersMap),
  LastAnalyzedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CatalogId: S.optional(S.String),
}) {}
export class GetPartitionResponse extends S.Class<GetPartitionResponse>(
  "GetPartitionResponse",
)({ Partition: S.optional(Partition) }) {}
export class GetPartitionsRequest extends S.Class<GetPartitionsRequest>(
  "GetPartitionsRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    Expression: S.optional(S.String),
    NextToken: S.optional(S.String),
    Segment: S.optional(Segment),
    MaxResults: S.optional(S.Number),
    ExcludeColumnSchema: S.optional(S.Boolean),
    TransactionId: S.optional(S.String),
    QueryAsOfTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPlanRequest extends S.Class<GetPlanRequest>("GetPlanRequest")(
  {
    Mapping: MappingList,
    Source: CatalogEntry,
    Sinks: S.optional(CatalogEntries),
    Location: S.optional(Location),
    Language: S.optional(S.String),
    AdditionalPlanOptionsMap: S.optional(AdditionalPlanOptionsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetRegistryResponse extends S.Class<GetRegistryResponse>(
  "GetRegistryResponse",
)({
  RegistryName: S.optional(S.String),
  RegistryArn: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedTime: S.optional(S.String),
  UpdatedTime: S.optional(S.String),
}) {}
export class GetResourcePolicyResponse extends S.Class<GetResourcePolicyResponse>(
  "GetResourcePolicyResponse",
)({
  PolicyInJson: S.optional(S.String),
  PolicyHash: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetSchemaResponse extends S.Class<GetSchemaResponse>(
  "GetSchemaResponse",
)({
  RegistryName: S.optional(S.String),
  RegistryArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  SchemaArn: S.optional(S.String),
  Description: S.optional(S.String),
  DataFormat: S.optional(S.String),
  Compatibility: S.optional(S.String),
  SchemaCheckpoint: S.optional(S.Number),
  LatestSchemaVersion: S.optional(S.Number),
  NextSchemaVersion: S.optional(S.Number),
  SchemaStatus: S.optional(S.String),
  CreatedTime: S.optional(S.String),
  UpdatedTime: S.optional(S.String),
}) {}
export class GetSchemaByDefinitionResponse extends S.Class<GetSchemaByDefinitionResponse>(
  "GetSchemaByDefinitionResponse",
)({
  SchemaVersionId: S.optional(S.String),
  SchemaArn: S.optional(S.String),
  DataFormat: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedTime: S.optional(S.String),
}) {}
export class GetSchemaVersionInput extends S.Class<GetSchemaVersionInput>(
  "GetSchemaVersionInput",
)(
  {
    SchemaId: S.optional(SchemaId),
    SchemaVersionId: S.optional(S.String),
    SchemaVersionNumber: S.optional(SchemaVersionNumber),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetSchemaVersionsDiffResponse extends S.Class<GetSchemaVersionsDiffResponse>(
  "GetSchemaVersionsDiffResponse",
)({ Diff: S.optional(S.String) }) {}
export class GetSecurityConfigurationsResponse extends S.Class<GetSecurityConfigurationsResponse>(
  "GetSecurityConfigurationsResponse",
)({
  SecurityConfigurations: S.optional(SecurityConfigurationList),
  NextToken: S.optional(S.String),
}) {}
export class GetTableRequest extends S.Class<GetTableRequest>(
  "GetTableRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    Name: S.String,
    TransactionId: S.optional(S.String),
    QueryAsOfTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AuditContext: S.optional(AuditContext),
    IncludeStatusDetails: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTableVersionsResponse extends S.Class<GetTableVersionsResponse>(
  "GetTableVersionsResponse",
)({
  TableVersions: S.optional(GetTableVersionsList),
  NextToken: S.optional(S.String),
}) {}
export class GetTagsResponse extends S.Class<GetTagsResponse>(
  "GetTagsResponse",
)({ Tags: S.optional(TagsMap) }) {}
export class GetTriggerResponse extends S.Class<GetTriggerResponse>(
  "GetTriggerResponse",
)({ Trigger: S.optional(Trigger) }) {}
export const TriggerList = S.Array(Trigger);
export class GetTriggersResponse extends S.Class<GetTriggersResponse>(
  "GetTriggersResponse",
)({ Triggers: S.optional(TriggerList), NextToken: S.optional(S.String) }) {}
export class GetUnfilteredTableMetadataRequest extends S.Class<GetUnfilteredTableMetadataRequest>(
  "GetUnfilteredTableMetadataRequest",
)(
  {
    Region: S.optional(S.String),
    CatalogId: S.String,
    DatabaseName: S.String,
    Name: S.String,
    AuditContext: S.optional(AuditContext),
    SupportedPermissionTypes: PermissionTypeList,
    ParentResourceArn: S.optional(S.String),
    RootResourceArn: S.optional(S.String),
    SupportedDialect: S.optional(SupportedDialect),
    Permissions: S.optional(PermissionList),
    QuerySessionContext: S.optional(QuerySessionContext),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUsageProfileResponse extends S.Class<GetUsageProfileResponse>(
  "GetUsageProfileResponse",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Configuration: S.optional(ProfileConfiguration),
  CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class GetUserDefinedFunctionsResponse extends S.Class<GetUserDefinedFunctionsResponse>(
  "GetUserDefinedFunctionsResponse",
)({
  UserDefinedFunctions: S.optional(UserDefinedFunctionList),
  NextToken: S.optional(S.String),
}) {}
export class BlueprintDetails extends S.Class<BlueprintDetails>(
  "BlueprintDetails",
)({ BlueprintName: S.optional(S.String), RunId: S.optional(S.String) }) {}
export class Workflow extends S.Class<Workflow>("Workflow")({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  DefaultRunProperties: S.optional(WorkflowRunProperties),
  CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastRun: S.optional(WorkflowRun),
  Graph: S.optional(WorkflowGraph),
  MaxConcurrentRuns: S.optional(S.Number),
  BlueprintDetails: S.optional(BlueprintDetails),
}) {}
export class GetWorkflowResponse extends S.Class<GetWorkflowResponse>(
  "GetWorkflowResponse",
)({ Workflow: S.optional(Workflow) }) {}
export class GetWorkflowRunPropertiesResponse extends S.Class<GetWorkflowRunPropertiesResponse>(
  "GetWorkflowRunPropertiesResponse",
)({ RunProperties: S.optional(WorkflowRunProperties) }) {}
export class GetWorkflowRunsResponse extends S.Class<GetWorkflowRunsResponse>(
  "GetWorkflowRunsResponse",
)({ Runs: S.optional(WorkflowRuns), NextToken: S.optional(S.String) }) {}
export class ListBlueprintsResponse extends S.Class<ListBlueprintsResponse>(
  "ListBlueprintsResponse",
)({
  Blueprints: S.optional(BlueprintNames),
  NextToken: S.optional(S.String),
}) {}
export class ListColumnStatisticsTaskRunsResponse extends S.Class<ListColumnStatisticsTaskRunsResponse>(
  "ListColumnStatisticsTaskRunsResponse",
)({
  ColumnStatisticsTaskRunIds: S.optional(ColumnStatisticsTaskRunIdList),
  NextToken: S.optional(S.String),
}) {}
export class ListCrawlersResponse extends S.Class<ListCrawlersResponse>(
  "ListCrawlersResponse",
)({
  CrawlerNames: S.optional(CrawlerNameList),
  NextToken: S.optional(S.String),
}) {}
export class ListCrawlsRequest extends S.Class<ListCrawlsRequest>(
  "ListCrawlsRequest",
)(
  {
    CrawlerName: S.String,
    MaxResults: S.optional(S.Number),
    Filters: S.optional(CrawlsFilterList),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CustomEntityType extends S.Class<CustomEntityType>(
  "CustomEntityType",
)({
  Name: S.String,
  RegexString: S.String,
  ContextWords: S.optional(ContextWords),
}) {}
export const CustomEntityTypes = S.Array(CustomEntityType);
export class ListCustomEntityTypesResponse extends S.Class<ListCustomEntityTypesResponse>(
  "ListCustomEntityTypesResponse",
)({
  CustomEntityTypes: S.optional(CustomEntityTypes),
  NextToken: S.optional(S.String),
}) {}
export class ListDataQualityResultsRequest extends S.Class<ListDataQualityResultsRequest>(
  "ListDataQualityResultsRequest",
)(
  {
    Filter: S.optional(DataQualityResultFilterCriteria),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDataQualityRuleRecommendationRunsRequest extends S.Class<ListDataQualityRuleRecommendationRunsRequest>(
  "ListDataQualityRuleRecommendationRunsRequest",
)(
  {
    Filter: S.optional(DataQualityRuleRecommendationRunFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDataQualityRulesetEvaluationRunsRequest extends S.Class<ListDataQualityRulesetEvaluationRunsRequest>(
  "ListDataQualityRulesetEvaluationRunsRequest",
)(
  {
    Filter: S.optional(DataQualityRulesetEvaluationRunFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDataQualityRulesetsRequest extends S.Class<ListDataQualityRulesetsRequest>(
  "ListDataQualityRulesetsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filter: S.optional(DataQualityRulesetFilterCriteria),
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDataQualityStatisticAnnotationsRequest extends S.Class<ListDataQualityStatisticAnnotationsRequest>(
  "ListDataQualityStatisticAnnotationsRequest",
)(
  {
    StatisticId: S.optional(S.String),
    ProfileId: S.optional(S.String),
    TimestampFilter: S.optional(TimestampFilter),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListDevEndpointsResponse extends S.Class<ListDevEndpointsResponse>(
  "ListDevEndpointsResponse",
)({
  DevEndpointNames: S.optional(DevEndpointNameList),
  NextToken: S.optional(S.String),
}) {}
export class ListIntegrationResourcePropertiesRequest extends S.Class<ListIntegrationResourcePropertiesRequest>(
  "ListIntegrationResourcePropertiesRequest",
)(
  {
    Marker: S.optional(S.String),
    Filters: S.optional(IntegrationResourcePropertyFilterList),
    MaxRecords: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListJobsResponse extends S.Class<ListJobsResponse>(
  "ListJobsResponse",
)({ JobNames: S.optional(JobNameList), NextToken: S.optional(S.String) }) {}
export class ListMLTransformsResponse extends S.Class<ListMLTransformsResponse>(
  "ListMLTransformsResponse",
)({ TransformIds: TransformIdList, NextToken: S.optional(S.String) }) {}
export class ListSessionsResponse extends S.Class<ListSessionsResponse>(
  "ListSessionsResponse",
)({
  Ids: S.optional(SessionIdList),
  Sessions: S.optional(SessionList),
  NextToken: S.optional(S.String),
}) {}
export class ListStatementsResponse extends S.Class<ListStatementsResponse>(
  "ListStatementsResponse",
)({ Statements: S.optional(StatementList), NextToken: S.optional(S.String) }) {}
export class ListTriggersResponse extends S.Class<ListTriggersResponse>(
  "ListTriggersResponse",
)({
  TriggerNames: S.optional(TriggerNameList),
  NextToken: S.optional(S.String),
}) {}
export class ListWorkflowsResponse extends S.Class<ListWorkflowsResponse>(
  "ListWorkflowsResponse",
)({ Workflows: S.optional(WorkflowNames), NextToken: S.optional(S.String) }) {}
export class IntegrationError extends S.Class<IntegrationError>(
  "IntegrationError",
)({ ErrorCode: S.optional(S.String), ErrorMessage: S.optional(S.String) }) {}
export const IntegrationErrorList = S.Array(IntegrationError);
export class ModifyIntegrationResponse extends S.Class<ModifyIntegrationResponse>(
  "ModifyIntegrationResponse",
)({
  SourceArn: S.String,
  TargetArn: S.String,
  IntegrationName: S.String,
  Description: S.optional(S.String),
  IntegrationArn: S.String,
  KmsKeyId: S.optional(S.String),
  AdditionalEncryptionContext: S.optional(
    IntegrationAdditionalEncryptionContextMap,
  ),
  Tags: S.optional(IntegrationTagsList),
  Status: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Errors: S.optional(IntegrationErrorList),
  DataFilter: S.optional(S.String),
  IntegrationConfig: S.optional(IntegrationConfig),
}) {}
export class PutResourcePolicyResponse extends S.Class<PutResourcePolicyResponse>(
  "PutResourcePolicyResponse",
)({ PolicyHash: S.optional(S.String) }) {}
export class PutSchemaVersionMetadataInput extends S.Class<PutSchemaVersionMetadataInput>(
  "PutSchemaVersionMetadataInput",
)(
  {
    SchemaId: S.optional(SchemaId),
    SchemaVersionNumber: S.optional(SchemaVersionNumber),
    SchemaVersionId: S.optional(S.String),
    MetadataKeyValue: MetadataKeyValuePair,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterSchemaVersionResponse extends S.Class<RegisterSchemaVersionResponse>(
  "RegisterSchemaVersionResponse",
)({
  SchemaVersionId: S.optional(S.String),
  VersionNumber: S.optional(S.Number),
  Status: S.optional(S.String),
}) {}
export class RemoveSchemaVersionMetadataResponse extends S.Class<RemoveSchemaVersionMetadataResponse>(
  "RemoveSchemaVersionMetadataResponse",
)({
  SchemaArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  RegistryName: S.optional(S.String),
  LatestVersion: S.optional(S.Boolean),
  VersionNumber: S.optional(S.Number),
  SchemaVersionId: S.optional(S.String),
  MetadataKey: S.optional(S.String),
  MetadataValue: S.optional(S.String),
}) {}
export class JobBookmarkEntry extends S.Class<JobBookmarkEntry>(
  "JobBookmarkEntry",
)({
  JobName: S.optional(S.String),
  Version: S.optional(S.Number),
  Run: S.optional(S.Number),
  Attempt: S.optional(S.Number),
  PreviousRunId: S.optional(S.String),
  RunId: S.optional(S.String),
  JobBookmark: S.optional(S.String),
}) {}
export class ResetJobBookmarkResponse extends S.Class<ResetJobBookmarkResponse>(
  "ResetJobBookmarkResponse",
)({ JobBookmarkEntry: S.optional(JobBookmarkEntry) }) {}
export class ResumeWorkflowRunResponse extends S.Class<ResumeWorkflowRunResponse>(
  "ResumeWorkflowRunResponse",
)({ RunId: S.optional(S.String), NodeIds: S.optional(NodeIdList) }) {}
export class RunStatementResponse extends S.Class<RunStatementResponse>(
  "RunStatementResponse",
)({ Id: S.optional(S.Number) }) {}
export class SearchTablesRequest extends S.Class<SearchTablesRequest>(
  "SearchTablesRequest",
)(
  {
    CatalogId: S.optional(S.String),
    NextToken: S.optional(S.String),
    Filters: S.optional(SearchPropertyPredicates),
    SearchText: S.optional(S.String),
    SortCriteria: S.optional(SortCriteria),
    MaxResults: S.optional(S.Number),
    ResourceShareType: S.optional(S.String),
    IncludeStatusDetails: S.optional(S.Boolean),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartBlueprintRunResponse extends S.Class<StartBlueprintRunResponse>(
  "StartBlueprintRunResponse",
)({ RunId: S.optional(S.String) }) {}
export class StartColumnStatisticsTaskRunResponse extends S.Class<StartColumnStatisticsTaskRunResponse>(
  "StartColumnStatisticsTaskRunResponse",
)({ ColumnStatisticsTaskRunId: S.optional(S.String) }) {}
export class StartDataQualityRulesetEvaluationRunRequest extends S.Class<StartDataQualityRulesetEvaluationRunRequest>(
  "StartDataQualityRulesetEvaluationRunRequest",
)(
  {
    DataSource: DataSource,
    Role: S.String,
    NumberOfWorkers: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    ClientToken: S.optional(S.String),
    AdditionalRunOptions: S.optional(
      DataQualityEvaluationRunAdditionalRunOptions,
    ),
    RulesetNames: RulesetNames,
    AdditionalDataSources: S.optional(DataSourceMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartExportLabelsTaskRunResponse extends S.Class<StartExportLabelsTaskRunResponse>(
  "StartExportLabelsTaskRunResponse",
)({ TaskRunId: S.optional(S.String) }) {}
export class StartImportLabelsTaskRunResponse extends S.Class<StartImportLabelsTaskRunResponse>(
  "StartImportLabelsTaskRunResponse",
)({ TaskRunId: S.optional(S.String) }) {}
export class StartJobRunResponse extends S.Class<StartJobRunResponse>(
  "StartJobRunResponse",
)({ JobRunId: S.optional(S.String) }) {}
export class StartMLEvaluationTaskRunResponse extends S.Class<StartMLEvaluationTaskRunResponse>(
  "StartMLEvaluationTaskRunResponse",
)({ TaskRunId: S.optional(S.String) }) {}
export class StartMLLabelingSetGenerationTaskRunResponse extends S.Class<StartMLLabelingSetGenerationTaskRunResponse>(
  "StartMLLabelingSetGenerationTaskRunResponse",
)({ TaskRunId: S.optional(S.String) }) {}
export class StartTriggerResponse extends S.Class<StartTriggerResponse>(
  "StartTriggerResponse",
)({ Name: S.optional(S.String) }) {}
export class StartWorkflowRunResponse extends S.Class<StartWorkflowRunResponse>(
  "StartWorkflowRunResponse",
)({ RunId: S.optional(S.String) }) {}
export class StopSessionResponse extends S.Class<StopSessionResponse>(
  "StopSessionResponse",
)({ Id: S.optional(S.String) }) {}
export class StopTriggerResponse extends S.Class<StopTriggerResponse>(
  "StopTriggerResponse",
)({ Name: S.optional(S.String) }) {}
export class TestConnectionRequest extends S.Class<TestConnectionRequest>(
  "TestConnectionRequest",
)(
  {
    ConnectionName: S.optional(S.String),
    CatalogId: S.optional(S.String),
    TestConnectionInput: S.optional(TestConnectionInput),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TestConnectionResponse extends S.Class<TestConnectionResponse>(
  "TestConnectionResponse",
)({}) {}
export class UpdateBlueprintResponse extends S.Class<UpdateBlueprintResponse>(
  "UpdateBlueprintResponse",
)({ Name: S.optional(S.String) }) {}
export class UpdateClassifierRequest extends S.Class<UpdateClassifierRequest>(
  "UpdateClassifierRequest",
)(
  {
    GrokClassifier: S.optional(UpdateGrokClassifierRequest),
    XMLClassifier: S.optional(UpdateXMLClassifierRequest),
    JsonClassifier: S.optional(UpdateJsonClassifierRequest),
    CsvClassifier: S.optional(UpdateCsvClassifierRequest),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateClassifierResponse extends S.Class<UpdateClassifierResponse>(
  "UpdateClassifierResponse",
)({}) {}
export class UpdateDataQualityRulesetResponse extends S.Class<UpdateDataQualityRulesetResponse>(
  "UpdateDataQualityRulesetResponse",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Ruleset: S.optional(S.String),
}) {}
export class UpdateDevEndpointRequest extends S.Class<UpdateDevEndpointRequest>(
  "UpdateDevEndpointRequest",
)(
  {
    EndpointName: S.String,
    PublicKey: S.optional(S.String),
    AddPublicKeys: S.optional(PublicKeysList),
    DeletePublicKeys: S.optional(PublicKeysList),
    CustomLibraries: S.optional(DevEndpointCustomLibraries),
    UpdateEtlLibraries: S.optional(S.Boolean),
    DeleteArguments: S.optional(StringList),
    AddArguments: S.optional(MapValue),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateDevEndpointResponse extends S.Class<UpdateDevEndpointResponse>(
  "UpdateDevEndpointResponse",
)({}) {}
export class UpdateIntegrationResourcePropertyResponse extends S.Class<UpdateIntegrationResourcePropertyResponse>(
  "UpdateIntegrationResourcePropertyResponse",
)({
  ResourceArn: S.optional(S.String),
  ResourcePropertyArn: S.optional(S.String),
  SourceProcessingProperties: S.optional(SourceProcessingProperties),
  TargetProcessingProperties: S.optional(TargetProcessingProperties),
}) {}
export class UpdateJobRequest extends S.Class<UpdateJobRequest>(
  "UpdateJobRequest",
)(
  { JobName: S.String, JobUpdate: JobUpdate },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateJobFromSourceControlResponse extends S.Class<UpdateJobFromSourceControlResponse>(
  "UpdateJobFromSourceControlResponse",
)({ JobName: S.optional(S.String) }) {}
export class UpdateMLTransformResponse extends S.Class<UpdateMLTransformResponse>(
  "UpdateMLTransformResponse",
)({ TransformId: S.optional(S.String) }) {}
export class UpdateRegistryResponse extends S.Class<UpdateRegistryResponse>(
  "UpdateRegistryResponse",
)({ RegistryName: S.optional(S.String), RegistryArn: S.optional(S.String) }) {}
export class UpdateSchemaResponse extends S.Class<UpdateSchemaResponse>(
  "UpdateSchemaResponse",
)({
  SchemaArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  RegistryName: S.optional(S.String),
}) {}
export class UpdateSourceControlFromJobResponse extends S.Class<UpdateSourceControlFromJobResponse>(
  "UpdateSourceControlFromJobResponse",
)({ JobName: S.optional(S.String) }) {}
export class UpdateTriggerRequest extends S.Class<UpdateTriggerRequest>(
  "UpdateTriggerRequest",
)(
  { Name: S.String, TriggerUpdate: TriggerUpdate },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateUsageProfileResponse extends S.Class<UpdateUsageProfileResponse>(
  "UpdateUsageProfileResponse",
)({ Name: S.optional(S.String) }) {}
export class UpdateWorkflowResponse extends S.Class<UpdateWorkflowResponse>(
  "UpdateWorkflowResponse",
)({ Name: S.optional(S.String) }) {}
export class MLUserDataEncryption extends S.Class<MLUserDataEncryption>(
  "MLUserDataEncryption",
)({ MlUserDataEncryptionMode: S.String, KmsKeyId: S.optional(S.String) }) {}
export const AuthenticationTypes = S.Array(S.String);
export const DataOperations = S.Array(S.String);
export const ComputeEnvironments = S.Array(S.String);
export const ListOfString = S.Array(S.String);
export const FieldFilterOperatorsList = S.Array(S.String);
export const ReferenceDatasetsList = S.Array(S.String);
export class TableError extends S.Class<TableError>("TableError")({
  TableName: S.optional(S.String),
  ErrorDetail: S.optional(ErrorDetail),
}) {}
export const TableErrors = S.Array(TableError);
export class TableVersionError extends S.Class<TableVersionError>(
  "TableVersionError",
)({
  TableName: S.optional(S.String),
  VersionId: S.optional(S.String),
  ErrorDetail: S.optional(ErrorDetail),
}) {}
export const TableVersionErrors = S.Array(TableVersionError);
export const EvaluatedMetricsMap = S.Record({ key: S.String, value: S.Number });
export const RuleMetricsMap = S.Record({ key: S.String, value: S.Number });
export const Labels = S.Record({ key: S.String, value: S.String });
export class DataQualityRuleResult extends S.Class<DataQualityRuleResult>(
  "DataQualityRuleResult",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  EvaluationMessage: S.optional(S.String),
  Result: S.optional(S.String),
  EvaluatedMetrics: S.optional(EvaluatedMetricsMap),
  EvaluatedRule: S.optional(S.String),
  RuleMetrics: S.optional(RuleMetricsMap),
  Labels: S.optional(Labels),
}) {}
export const DataQualityRuleResults = S.Array(DataQualityRuleResult);
export class DataQualityAnalyzerResult extends S.Class<DataQualityAnalyzerResult>(
  "DataQualityAnalyzerResult",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  EvaluationMessage: S.optional(S.String),
  EvaluatedMetrics: S.optional(EvaluatedMetricsMap),
}) {}
export const DataQualityAnalyzerResults = S.Array(DataQualityAnalyzerResult);
export class DataQualityMetricValues extends S.Class<DataQualityMetricValues>(
  "DataQualityMetricValues",
)({
  ActualValue: S.optional(S.Number),
  ExpectedValue: S.optional(S.Number),
  LowerLimit: S.optional(S.Number),
  UpperLimit: S.optional(S.Number),
}) {}
export const NewRules = S.Array(S.String);
export class MetricBasedObservation extends S.Class<MetricBasedObservation>(
  "MetricBasedObservation",
)({
  MetricName: S.optional(S.String),
  StatisticId: S.optional(S.String),
  MetricValues: S.optional(DataQualityMetricValues),
  NewRules: S.optional(NewRules),
}) {}
export class DataQualityObservation extends S.Class<DataQualityObservation>(
  "DataQualityObservation",
)({
  Description: S.optional(S.String),
  MetricBasedObservation: S.optional(MetricBasedObservation),
}) {}
export const DataQualityObservations = S.Array(DataQualityObservation);
export class DataQualityAggregatedMetrics extends S.Class<DataQualityAggregatedMetrics>(
  "DataQualityAggregatedMetrics",
)({
  TotalRowsProcessed: S.optional(S.Number),
  TotalRowsPassed: S.optional(S.Number),
  TotalRowsFailed: S.optional(S.Number),
  TotalRulesProcessed: S.optional(S.Number),
  TotalRulesPassed: S.optional(S.Number),
  TotalRulesFailed: S.optional(S.Number),
}) {}
export class DataQualityResult extends S.Class<DataQualityResult>(
  "DataQualityResult",
)({
  ResultId: S.optional(S.String),
  ProfileId: S.optional(S.String),
  Score: S.optional(S.Number),
  DataSource: S.optional(DataSource),
  RulesetName: S.optional(S.String),
  EvaluationContext: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  JobName: S.optional(S.String),
  JobRunId: S.optional(S.String),
  RulesetEvaluationRunId: S.optional(S.String),
  RuleResults: S.optional(DataQualityRuleResults),
  AnalyzerResults: S.optional(DataQualityAnalyzerResults),
  Observations: S.optional(DataQualityObservations),
  AggregatedMetrics: S.optional(DataQualityAggregatedMetrics),
}) {}
export const DataQualityResultsList = S.Array(DataQualityResult);
export const PartitionList = S.Array(Partition);
export class BatchStopJobRunSuccessfulSubmission extends S.Class<BatchStopJobRunSuccessfulSubmission>(
  "BatchStopJobRunSuccessfulSubmission",
)({ JobName: S.optional(S.String), JobRunId: S.optional(S.String) }) {}
export const BatchStopJobRunSuccessfulSubmissionList = S.Array(
  BatchStopJobRunSuccessfulSubmission,
);
export class BatchStopJobRunError extends S.Class<BatchStopJobRunError>(
  "BatchStopJobRunError",
)({
  JobName: S.optional(S.String),
  JobRunId: S.optional(S.String),
  ErrorDetail: S.optional(ErrorDetail),
}) {}
export const BatchStopJobRunErrorList = S.Array(BatchStopJobRunError);
export const GlueTables = S.Array(GlueTable);
export class TransformEncryption extends S.Class<TransformEncryption>(
  "TransformEncryption",
)({
  MlUserDataEncryption: S.optional(MLUserDataEncryption),
  TaskRunSecurityConfigurationName: S.optional(S.String),
}) {}
export class Capabilities extends S.Class<Capabilities>("Capabilities")({
  SupportedAuthenticationTypes: AuthenticationTypes,
  SupportedDataOperations: DataOperations,
  SupportedComputeEnvironments: ComputeEnvironments,
}) {}
export const PropertyTypes = S.Array(S.String);
export class AllowedValue extends S.Class<AllowedValue>("AllowedValue")({
  Description: S.optional(S.String),
  Value: S.String,
}) {}
export const AllowedValues = S.Array(AllowedValue);
export class Property extends S.Class<Property>("Property")({
  Name: S.String,
  Description: S.String,
  Required: S.Boolean,
  DefaultValue: S.optional(S.String),
  PropertyTypes: PropertyTypes,
  AllowedValues: S.optional(AllowedValues),
  DataOperationScopes: S.optional(DataOperations),
}) {}
export const PropertiesMap = S.Record({ key: S.String, value: Property });
export class AuthConfiguration extends S.Class<AuthConfiguration>(
  "AuthConfiguration",
)({
  AuthenticationType: Property,
  SecretArn: S.optional(Property),
  OAuth2Properties: S.optional(PropertiesMap),
  BasicAuthenticationProperties: S.optional(PropertiesMap),
  CustomAuthenticationProperties: S.optional(PropertiesMap),
}) {}
export class InboundIntegration extends S.Class<InboundIntegration>(
  "InboundIntegration",
)({
  SourceArn: S.String,
  TargetArn: S.String,
  IntegrationArn: S.String,
  Status: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  IntegrationConfig: S.optional(IntegrationConfig),
  Errors: S.optional(IntegrationErrorList),
}) {}
export const InboundIntegrationsList = S.Array(InboundIntegration);
export class CatalogImportStatus extends S.Class<CatalogImportStatus>(
  "CatalogImportStatus",
)({
  ImportCompleted: S.optional(S.Boolean),
  ImportTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ImportedBy: S.optional(S.String),
}) {}
export class OAuth2Properties extends S.Class<OAuth2Properties>(
  "OAuth2Properties",
)({
  OAuth2GrantType: S.optional(S.String),
  OAuth2ClientApplication: S.optional(OAuth2ClientApplication),
  TokenUrl: S.optional(S.String),
  TokenUrlParametersMap: S.optional(TokenUrlParametersMap),
}) {}
export class AuthenticationConfiguration extends S.Class<AuthenticationConfiguration>(
  "AuthenticationConfiguration",
)({
  AuthenticationType: S.optional(S.String),
  SecretArn: S.optional(S.String),
  KmsKeyArn: S.optional(S.String),
  OAuth2Properties: S.optional(OAuth2Properties),
}) {}
export class Connection extends S.Class<Connection>("Connection")({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  ConnectionType: S.optional(S.String),
  MatchCriteria: S.optional(MatchCriteria),
  ConnectionProperties: S.optional(ConnectionProperties),
  SparkProperties: S.optional(PropertyMap),
  AthenaProperties: S.optional(PropertyMap),
  PythonProperties: S.optional(PropertyMap),
  PhysicalConnectionRequirements: S.optional(PhysicalConnectionRequirements),
  CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastUpdatedBy: S.optional(S.String),
  Status: S.optional(S.String),
  StatusReason: S.optional(S.String),
  LastConnectionValidationTime: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  AuthenticationConfiguration: S.optional(AuthenticationConfiguration),
  ConnectionSchemaVersion: S.optional(S.Number),
  CompatibleComputeEnvironments: S.optional(ComputeEnvironmentList),
}) {}
export const ConnectionList = S.Array(Connection);
export class CrawlerMetrics extends S.Class<CrawlerMetrics>("CrawlerMetrics")({
  CrawlerName: S.optional(S.String),
  TimeLeftSeconds: S.optional(S.Number),
  StillEstimating: S.optional(S.Boolean),
  LastRuntimeSeconds: S.optional(S.Number),
  MedianRuntimeSeconds: S.optional(S.Number),
  TablesCreated: S.optional(S.Number),
  TablesUpdated: S.optional(S.Number),
  TablesDeleted: S.optional(S.Number),
}) {}
export const CrawlerMetricsList = S.Array(CrawlerMetrics);
export class StatisticModelResult extends S.Class<StatisticModelResult>(
  "StatisticModelResult",
)({
  LowerBound: S.optional(S.Number),
  UpperBound: S.optional(S.Number),
  PredictedValue: S.optional(S.Number),
  ActualValue: S.optional(S.Number),
  Date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InclusionAnnotation: S.optional(S.String),
}) {}
export const StatisticModelResults = S.Array(StatisticModelResult);
export const Records = S.Array(S.Any);
export class GluePolicy extends S.Class<GluePolicy>("GluePolicy")({
  PolicyInJson: S.optional(S.String),
  PolicyHash: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const GetResourcePoliciesResponseList = S.Array(GluePolicy);
export class RunMetrics extends S.Class<RunMetrics>("RunMetrics")({
  NumberOfBytesCompacted: S.optional(S.String),
  NumberOfFilesCompacted: S.optional(S.String),
  NumberOfDpus: S.optional(S.String),
  JobDurationInHour: S.optional(S.String),
}) {}
export class IcebergCompactionMetrics extends S.Class<IcebergCompactionMetrics>(
  "IcebergCompactionMetrics",
)({
  NumberOfBytesCompacted: S.optional(S.Number),
  NumberOfFilesCompacted: S.optional(S.Number),
  DpuHours: S.optional(S.Number),
  NumberOfDpus: S.optional(S.Number),
  JobDurationInHour: S.optional(S.Number),
}) {}
export class CompactionMetrics extends S.Class<CompactionMetrics>(
  "CompactionMetrics",
)({ IcebergMetrics: S.optional(IcebergCompactionMetrics) }) {}
export class IcebergRetentionMetrics extends S.Class<IcebergRetentionMetrics>(
  "IcebergRetentionMetrics",
)({
  NumberOfDataFilesDeleted: S.optional(S.Number),
  NumberOfManifestFilesDeleted: S.optional(S.Number),
  NumberOfManifestListsDeleted: S.optional(S.Number),
  DpuHours: S.optional(S.Number),
  NumberOfDpus: S.optional(S.Number),
  JobDurationInHour: S.optional(S.Number),
}) {}
export class RetentionMetrics extends S.Class<RetentionMetrics>(
  "RetentionMetrics",
)({ IcebergMetrics: S.optional(IcebergRetentionMetrics) }) {}
export class IcebergOrphanFileDeletionMetrics extends S.Class<IcebergOrphanFileDeletionMetrics>(
  "IcebergOrphanFileDeletionMetrics",
)({
  NumberOfOrphanFilesDeleted: S.optional(S.Number),
  DpuHours: S.optional(S.Number),
  NumberOfDpus: S.optional(S.Number),
  JobDurationInHour: S.optional(S.Number),
}) {}
export class OrphanFileDeletionMetrics extends S.Class<OrphanFileDeletionMetrics>(
  "OrphanFileDeletionMetrics",
)({ IcebergMetrics: S.optional(IcebergOrphanFileDeletionMetrics) }) {}
export class TableOptimizerRun extends S.Class<TableOptimizerRun>(
  "TableOptimizerRun",
)({
  eventType: S.optional(S.String),
  startTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  metrics: S.optional(RunMetrics),
  error: S.optional(S.String),
  compactionMetrics: S.optional(CompactionMetrics),
  compactionStrategy: S.optional(S.String),
  retentionMetrics: S.optional(RetentionMetrics),
  orphanFileDeletionMetrics: S.optional(OrphanFileDeletionMetrics),
}) {}
export class TableOptimizer extends S.Class<TableOptimizer>("TableOptimizer")({
  type: S.optional(S.String),
  configuration: S.optional(TableOptimizerConfiguration),
  lastRun: S.optional(TableOptimizerRun),
  configurationSource: S.optional(S.String),
}) {}
export class UnfilteredPartition extends S.Class<UnfilteredPartition>(
  "UnfilteredPartition",
)({
  Partition: S.optional(Partition),
  AuthorizedColumns: S.optional(NameStringList),
  IsRegisteredWithLakeFormation: S.optional(S.Boolean),
}) {}
export const UnfilteredPartitionList = S.Array(UnfilteredPartition);
export const CustomProperties = S.Record({ key: S.String, value: S.String });
export class Entity extends S.Class<Entity>("Entity")({
  EntityName: S.optional(S.String),
  Label: S.optional(S.String),
  IsParentEntity: S.optional(S.Boolean),
  Description: S.optional(S.String),
  Category: S.optional(S.String),
  CustomProperties: S.optional(CustomProperties),
}) {}
export const EntityList = S.Array(Entity);
export class RegistryListItem extends S.Class<RegistryListItem>(
  "RegistryListItem",
)({
  RegistryName: S.optional(S.String),
  RegistryArn: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedTime: S.optional(S.String),
  UpdatedTime: S.optional(S.String),
}) {}
export const RegistryListDefinition = S.Array(RegistryListItem);
export class SchemaListItem extends S.Class<SchemaListItem>("SchemaListItem")({
  RegistryName: S.optional(S.String),
  SchemaName: S.optional(S.String),
  SchemaArn: S.optional(S.String),
  Description: S.optional(S.String),
  SchemaStatus: S.optional(S.String),
  CreatedTime: S.optional(S.String),
  UpdatedTime: S.optional(S.String),
}) {}
export const SchemaListDefinition = S.Array(SchemaListItem);
export class SchemaVersionListItem extends S.Class<SchemaVersionListItem>(
  "SchemaVersionListItem",
)({
  SchemaArn: S.optional(S.String),
  SchemaVersionId: S.optional(S.String),
  VersionNumber: S.optional(S.Number),
  Status: S.optional(S.String),
  CreatedTime: S.optional(S.String),
}) {}
export const SchemaVersionList = S.Array(SchemaVersionListItem);
export class UsageProfileDefinition extends S.Class<UsageProfileDefinition>(
  "UsageProfileDefinition",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const UsageProfileDefinitionList = S.Array(UsageProfileDefinition);
export class ColumnStatisticsError extends S.Class<ColumnStatisticsError>(
  "ColumnStatisticsError",
)({
  ColumnStatistics: S.optional(ColumnStatistics),
  Error: S.optional(ErrorDetail),
}) {}
export const ColumnStatisticsErrors = S.Array(ColumnStatisticsError);
export class ViewRepresentationInput extends S.Class<ViewRepresentationInput>(
  "ViewRepresentationInput",
)({
  Dialect: S.optional(S.String),
  DialectVersion: S.optional(S.String),
  ViewOriginalText: S.optional(S.String),
  ValidationConnection: S.optional(S.String),
  ViewExpandedText: S.optional(S.String),
}) {}
export const ViewRepresentationInputList = S.Array(ViewRepresentationInput);
export const BackfillErroredPartitionsList = S.Array(PartitionValueList);
export class BatchDeleteTableResponse extends S.Class<BatchDeleteTableResponse>(
  "BatchDeleteTableResponse",
)({ Errors: S.optional(TableErrors) }) {}
export class BatchDeleteTableVersionResponse extends S.Class<BatchDeleteTableVersionResponse>(
  "BatchDeleteTableVersionResponse",
)({ Errors: S.optional(TableVersionErrors) }) {}
export class BatchGetCustomEntityTypesResponse extends S.Class<BatchGetCustomEntityTypesResponse>(
  "BatchGetCustomEntityTypesResponse",
)({
  CustomEntityTypes: S.optional(CustomEntityTypes),
  CustomEntityTypesNotFound: S.optional(CustomEntityTypeNames),
}) {}
export class BatchGetDataQualityResultResponse extends S.Class<BatchGetDataQualityResultResponse>(
  "BatchGetDataQualityResultResponse",
)({
  Results: DataQualityResultsList,
  ResultsNotFound: S.optional(DataQualityResultIds),
}) {}
export class BatchGetDevEndpointsResponse extends S.Class<BatchGetDevEndpointsResponse>(
  "BatchGetDevEndpointsResponse",
)({
  DevEndpoints: S.optional(DevEndpointList),
  DevEndpointsNotFound: S.optional(DevEndpointNames),
}) {}
export class BatchGetJobsResponse extends S.Class<BatchGetJobsResponse>(
  "BatchGetJobsResponse",
)({ Jobs: S.optional(JobList), JobsNotFound: S.optional(JobNameList) }) {}
export class BatchGetPartitionResponse extends S.Class<BatchGetPartitionResponse>(
  "BatchGetPartitionResponse",
)({
  Partitions: S.optional(PartitionList),
  UnprocessedKeys: S.optional(BatchGetPartitionValueList),
}) {}
export class BatchGetTriggersResponse extends S.Class<BatchGetTriggersResponse>(
  "BatchGetTriggersResponse",
)({
  Triggers: S.optional(TriggerList),
  TriggersNotFound: S.optional(TriggerNameList),
}) {}
export class BatchStopJobRunResponse extends S.Class<BatchStopJobRunResponse>(
  "BatchStopJobRunResponse",
)({
  SuccessfulSubmissions: S.optional(BatchStopJobRunSuccessfulSubmissionList),
  Errors: S.optional(BatchStopJobRunErrorList),
}) {}
export class CreateBlueprintResponse extends S.Class<CreateBlueprintResponse>(
  "CreateBlueprintResponse",
)({ Name: S.optional(S.String) }) {}
export class CreateCrawlerRequest extends S.Class<CreateCrawlerRequest>(
  "CreateCrawlerRequest",
)(
  {
    Name: S.String,
    Role: S.String,
    DatabaseName: S.optional(S.String),
    Description: S.optional(S.String),
    Targets: CrawlerTargets,
    Schedule: S.optional(S.String),
    Classifiers: S.optional(ClassifierNameList),
    TablePrefix: S.optional(S.String),
    SchemaChangePolicy: S.optional(SchemaChangePolicy),
    RecrawlPolicy: S.optional(RecrawlPolicy),
    LineageConfiguration: S.optional(LineageConfiguration),
    LakeFormationConfiguration: S.optional(LakeFormationConfiguration),
    Configuration: S.optional(S.String),
    CrawlerSecurityConfiguration: S.optional(S.String),
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCrawlerResponse extends S.Class<CreateCrawlerResponse>(
  "CreateCrawlerResponse",
)({}) {}
export class CreateDatabaseRequest extends S.Class<CreateDatabaseRequest>(
  "CreateDatabaseRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseInput: DatabaseInput,
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateDatabaseResponse extends S.Class<CreateDatabaseResponse>(
  "CreateDatabaseResponse",
)({}) {}
export class CreateDataQualityRulesetResponse extends S.Class<CreateDataQualityRulesetResponse>(
  "CreateDataQualityRulesetResponse",
)({ Name: S.optional(S.String) }) {}
export class CreateDevEndpointResponse extends S.Class<CreateDevEndpointResponse>(
  "CreateDevEndpointResponse",
)({
  EndpointName: S.optional(S.String),
  Status: S.optional(S.String),
  SecurityGroupIds: S.optional(StringList),
  SubnetId: S.optional(S.String),
  RoleArn: S.optional(S.String),
  YarnEndpointAddress: S.optional(S.String),
  ZeppelinRemoteSparkInterpreterPort: S.optional(S.Number),
  NumberOfNodes: S.optional(S.Number),
  WorkerType: S.optional(S.String),
  GlueVersion: S.optional(S.String),
  NumberOfWorkers: S.optional(S.Number),
  AvailabilityZone: S.optional(S.String),
  VpcId: S.optional(S.String),
  ExtraPythonLibsS3Path: S.optional(S.String),
  ExtraJarsS3Path: S.optional(S.String),
  FailureReason: S.optional(S.String),
  SecurityConfiguration: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Arguments: S.optional(MapValue),
}) {}
export class CreateIntegrationRequest extends S.Class<CreateIntegrationRequest>(
  "CreateIntegrationRequest",
)(
  {
    IntegrationName: S.String,
    SourceArn: S.String,
    TargetArn: S.String,
    Description: S.optional(S.String),
    DataFilter: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    AdditionalEncryptionContext: S.optional(
      IntegrationAdditionalEncryptionContextMap,
    ),
    Tags: S.optional(IntegrationTagsList),
    IntegrationConfig: S.optional(IntegrationConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateIntegrationResourcePropertyResponse extends S.Class<CreateIntegrationResourcePropertyResponse>(
  "CreateIntegrationResourcePropertyResponse",
)({
  ResourceArn: S.String,
  ResourcePropertyArn: S.optional(S.String),
  SourceProcessingProperties: S.optional(SourceProcessingProperties),
  TargetProcessingProperties: S.optional(TargetProcessingProperties),
}) {}
export class CreateIntegrationTablePropertiesRequest extends S.Class<CreateIntegrationTablePropertiesRequest>(
  "CreateIntegrationTablePropertiesRequest",
)(
  {
    ResourceArn: S.String,
    TableName: S.String,
    SourceTableConfig: S.optional(SourceTableConfig),
    TargetTableConfig: S.optional(TargetTableConfig),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateIntegrationTablePropertiesResponse extends S.Class<CreateIntegrationTablePropertiesResponse>(
  "CreateIntegrationTablePropertiesResponse",
)({}) {}
export class CreateMLTransformRequest extends S.Class<CreateMLTransformRequest>(
  "CreateMLTransformRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    InputRecordTables: GlueTables,
    Parameters: TransformParameters,
    Role: S.String,
    GlueVersion: S.optional(S.String),
    MaxCapacity: S.optional(S.Number),
    WorkerType: S.optional(S.String),
    NumberOfWorkers: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    Tags: S.optional(TagsMap),
    TransformEncryption: S.optional(TransformEncryption),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSchemaResponse extends S.Class<CreateSchemaResponse>(
  "CreateSchemaResponse",
)({
  RegistryName: S.optional(S.String),
  RegistryArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  SchemaArn: S.optional(S.String),
  Description: S.optional(S.String),
  DataFormat: S.optional(S.String),
  Compatibility: S.optional(S.String),
  SchemaCheckpoint: S.optional(S.Number),
  LatestSchemaVersion: S.optional(S.Number),
  NextSchemaVersion: S.optional(S.Number),
  SchemaStatus: S.optional(S.String),
  Tags: S.optional(TagsMap),
  SchemaVersionId: S.optional(S.String),
  SchemaVersionStatus: S.optional(S.String),
}) {}
export class CreateScriptRequest extends S.Class<CreateScriptRequest>(
  "CreateScriptRequest",
)(
  {
    DagNodes: S.optional(DagNodes),
    DagEdges: S.optional(DagEdges),
    Language: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSecurityConfigurationRequest extends S.Class<CreateSecurityConfigurationRequest>(
  "CreateSecurityConfigurationRequest",
)(
  { Name: S.String, EncryptionConfiguration: EncryptionConfiguration },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSessionResponse extends S.Class<CreateSessionResponse>(
  "CreateSessionResponse",
)({ Session: S.optional(Session) }) {}
export const IntegerList = S.Array(S.Number);
export class CreateTriggerRequest extends S.Class<CreateTriggerRequest>(
  "CreateTriggerRequest",
)(
  {
    Name: S.String,
    WorkflowName: S.optional(S.String),
    Type: S.String,
    Schedule: S.optional(S.String),
    Predicate: S.optional(Predicate),
    Actions: ActionList,
    Description: S.optional(S.String),
    StartOnCreation: S.optional(S.Boolean),
    Tags: S.optional(TagsMap),
    EventBatchingCondition: S.optional(EventBatchingCondition),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateUserDefinedFunctionRequest extends S.Class<CreateUserDefinedFunctionRequest>(
  "CreateUserDefinedFunctionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    FunctionInput: UserDefinedFunctionInput,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateUserDefinedFunctionResponse extends S.Class<CreateUserDefinedFunctionResponse>(
  "CreateUserDefinedFunctionResponse",
)({}) {}
export class CreateWorkflowResponse extends S.Class<CreateWorkflowResponse>(
  "CreateWorkflowResponse",
)({ Name: S.optional(S.String) }) {}
export class DeleteIntegrationResponse extends S.Class<DeleteIntegrationResponse>(
  "DeleteIntegrationResponse",
)({
  SourceArn: S.String,
  TargetArn: S.String,
  IntegrationName: S.String,
  Description: S.optional(S.String),
  IntegrationArn: S.String,
  KmsKeyId: S.optional(S.String),
  AdditionalEncryptionContext: S.optional(
    IntegrationAdditionalEncryptionContextMap,
  ),
  Tags: S.optional(IntegrationTagsList),
  Status: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Errors: S.optional(IntegrationErrorList),
  DataFilter: S.optional(S.String),
}) {}
export class DeleteSchemaResponse extends S.Class<DeleteSchemaResponse>(
  "DeleteSchemaResponse",
)({
  SchemaArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export class DescribeInboundIntegrationsResponse extends S.Class<DescribeInboundIntegrationsResponse>(
  "DescribeInboundIntegrationsResponse",
)({
  InboundIntegrations: S.optional(InboundIntegrationsList),
  Marker: S.optional(S.String),
}) {}
export class GetBlueprintRunResponse extends S.Class<GetBlueprintRunResponse>(
  "GetBlueprintRunResponse",
)({ BlueprintRun: S.optional(BlueprintRun) }) {}
export class GetCatalogImportStatusResponse extends S.Class<GetCatalogImportStatusResponse>(
  "GetCatalogImportStatusResponse",
)({ ImportStatus: S.optional(CatalogImportStatus) }) {}
export class GetColumnStatisticsForPartitionResponse extends S.Class<GetColumnStatisticsForPartitionResponse>(
  "GetColumnStatisticsForPartitionResponse",
)({
  ColumnStatisticsList: S.optional(ColumnStatisticsList),
  Errors: S.optional(ColumnErrors),
}) {}
export class GetColumnStatisticsTaskRunResponse extends S.Class<GetColumnStatisticsTaskRunResponse>(
  "GetColumnStatisticsTaskRunResponse",
)({ ColumnStatisticsTaskRun: S.optional(ColumnStatisticsTaskRun) }) {}
export class GetConnectionsResponse extends S.Class<GetConnectionsResponse>(
  "GetConnectionsResponse",
)({
  ConnectionList: S.optional(ConnectionList),
  NextToken: S.optional(S.String),
}) {}
export class GetCrawlerMetricsResponse extends S.Class<GetCrawlerMetricsResponse>(
  "GetCrawlerMetricsResponse",
)({
  CrawlerMetricsList: S.optional(CrawlerMetricsList),
  NextToken: S.optional(S.String),
}) {}
export class GetDatabaseResponse extends S.Class<GetDatabaseResponse>(
  "GetDatabaseResponse",
)({ Database: S.optional(Database) }) {}
export class GetDataQualityModelResultResponse extends S.Class<GetDataQualityModelResultResponse>(
  "GetDataQualityModelResultResponse",
)({
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Model: S.optional(StatisticModelResults),
}) {}
export class GetEntityRecordsResponse extends S.Class<GetEntityRecordsResponse>(
  "GetEntityRecordsResponse",
)({ Records: S.optional(Records), NextToken: S.optional(S.String) }) {}
export class GetJobBookmarkResponse extends S.Class<GetJobBookmarkResponse>(
  "GetJobBookmarkResponse",
)({ JobBookmarkEntry: S.optional(JobBookmarkEntry) }) {}
export class GetMappingResponse extends S.Class<GetMappingResponse>(
  "GetMappingResponse",
)({ Mapping: MappingList }) {}
export class GetMLTransformsRequest extends S.Class<GetMLTransformsRequest>(
  "GetMLTransformsRequest",
)(
  {
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filter: S.optional(TransformFilterCriteria),
    Sort: S.optional(TransformSortCriteria),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetPartitionsResponse extends S.Class<GetPartitionsResponse>(
  "GetPartitionsResponse",
)({ Partitions: S.optional(PartitionList), NextToken: S.optional(S.String) }) {}
export class GetPlanResponse extends S.Class<GetPlanResponse>(
  "GetPlanResponse",
)({ PythonScript: S.optional(S.String), ScalaCode: S.optional(S.String) }) {}
export class GetResourcePoliciesResponse extends S.Class<GetResourcePoliciesResponse>(
  "GetResourcePoliciesResponse",
)({
  GetResourcePoliciesResponseList: S.optional(GetResourcePoliciesResponseList),
  NextToken: S.optional(S.String),
}) {}
export class GetSchemaVersionResponse extends S.Class<GetSchemaVersionResponse>(
  "GetSchemaVersionResponse",
)({
  SchemaVersionId: S.optional(S.String),
  SchemaDefinition: S.optional(S.String),
  DataFormat: S.optional(S.String),
  SchemaArn: S.optional(S.String),
  VersionNumber: S.optional(S.Number),
  Status: S.optional(S.String),
  CreatedTime: S.optional(S.String),
}) {}
export class GetSecurityConfigurationResponse extends S.Class<GetSecurityConfigurationResponse>(
  "GetSecurityConfigurationResponse",
)({ SecurityConfiguration: S.optional(SecurityConfiguration) }) {}
export class GetSessionResponse extends S.Class<GetSessionResponse>(
  "GetSessionResponse",
)({ Session: S.optional(Session) }) {}
export class GetTableResponse extends S.Class<GetTableResponse>(
  "GetTableResponse",
)({ Table: S.optional(Table) }) {}
export class GetTableOptimizerResponse extends S.Class<GetTableOptimizerResponse>(
  "GetTableOptimizerResponse",
)({
  CatalogId: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  TableName: S.optional(S.String),
  TableOptimizer: S.optional(TableOptimizer),
}) {}
export class GetTableVersionResponse extends S.Class<GetTableVersionResponse>(
  "GetTableVersionResponse",
)({ TableVersion: S.optional(TableVersion) }) {}
export class GetUnfilteredPartitionMetadataRequest extends S.Class<GetUnfilteredPartitionMetadataRequest>(
  "GetUnfilteredPartitionMetadataRequest",
)(
  {
    Region: S.optional(S.String),
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValues: ValueStringList,
    AuditContext: S.optional(AuditContext),
    SupportedPermissionTypes: PermissionTypeList,
    QuerySessionContext: S.optional(QuerySessionContext),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetUnfilteredPartitionsMetadataResponse extends S.Class<GetUnfilteredPartitionsMetadataResponse>(
  "GetUnfilteredPartitionsMetadataResponse",
)({
  UnfilteredPartitions: S.optional(UnfilteredPartitionList),
  NextToken: S.optional(S.String),
}) {}
export class GetUserDefinedFunctionResponse extends S.Class<GetUserDefinedFunctionResponse>(
  "GetUserDefinedFunctionResponse",
)({ UserDefinedFunction: S.optional(UserDefinedFunction) }) {}
export class ListEntitiesResponse extends S.Class<ListEntitiesResponse>(
  "ListEntitiesResponse",
)({ Entities: S.optional(EntityList), NextToken: S.optional(S.String) }) {}
export class ListRegistriesResponse extends S.Class<ListRegistriesResponse>(
  "ListRegistriesResponse",
)({
  Registries: S.optional(RegistryListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ListSchemasResponse extends S.Class<ListSchemasResponse>(
  "ListSchemasResponse",
)({
  Schemas: S.optional(SchemaListDefinition),
  NextToken: S.optional(S.String),
}) {}
export class ListSchemaVersionsResponse extends S.Class<ListSchemaVersionsResponse>(
  "ListSchemaVersionsResponse",
)({
  Schemas: S.optional(SchemaVersionList),
  NextToken: S.optional(S.String),
}) {}
export class ListUsageProfilesResponse extends S.Class<ListUsageProfilesResponse>(
  "ListUsageProfilesResponse",
)({
  Profiles: S.optional(UsageProfileDefinitionList),
  NextToken: S.optional(S.String),
}) {}
export class PutDataCatalogEncryptionSettingsRequest extends S.Class<PutDataCatalogEncryptionSettingsRequest>(
  "PutDataCatalogEncryptionSettingsRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DataCatalogEncryptionSettings: DataCatalogEncryptionSettings,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutDataCatalogEncryptionSettingsResponse extends S.Class<PutDataCatalogEncryptionSettingsResponse>(
  "PutDataCatalogEncryptionSettingsResponse",
)({}) {}
export class PutSchemaVersionMetadataResponse extends S.Class<PutSchemaVersionMetadataResponse>(
  "PutSchemaVersionMetadataResponse",
)({
  SchemaArn: S.optional(S.String),
  SchemaName: S.optional(S.String),
  RegistryName: S.optional(S.String),
  LatestVersion: S.optional(S.Boolean),
  VersionNumber: S.optional(S.Number),
  SchemaVersionId: S.optional(S.String),
  MetadataKey: S.optional(S.String),
  MetadataValue: S.optional(S.String),
}) {}
export const TableList = S.Array(S.suspend((): S.Schema<Table, any> => Table));
export class SearchTablesResponse extends S.Class<SearchTablesResponse>(
  "SearchTablesResponse",
)({ NextToken: S.optional(S.String), TableList: S.optional(TableList) }) {}
export class StartDataQualityRuleRecommendationRunRequest extends S.Class<StartDataQualityRuleRecommendationRunRequest>(
  "StartDataQualityRuleRecommendationRunRequest",
)(
  {
    DataSource: DataSource,
    Role: S.String,
    NumberOfWorkers: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    CreatedRulesetName: S.optional(S.String),
    DataQualitySecurityConfiguration: S.optional(S.String),
    ClientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StartDataQualityRulesetEvaluationRunResponse extends S.Class<StartDataQualityRulesetEvaluationRunResponse>(
  "StartDataQualityRulesetEvaluationRunResponse",
)({ RunId: S.optional(S.String) }) {}
export class UpdateColumnStatisticsForTableResponse extends S.Class<UpdateColumnStatisticsForTableResponse>(
  "UpdateColumnStatisticsForTableResponse",
)({ Errors: S.optional(ColumnStatisticsErrors) }) {}
export class UpdateJobResponse extends S.Class<UpdateJobResponse>(
  "UpdateJobResponse",
)({ JobName: S.optional(S.String) }) {}
export class UpdateTriggerResponse extends S.Class<UpdateTriggerResponse>(
  "UpdateTriggerResponse",
)({ Trigger: S.optional(Trigger) }) {}
export class ViewDefinitionInput extends S.Class<ViewDefinitionInput>(
  "ViewDefinitionInput",
)({
  IsProtected: S.optional(S.Boolean),
  Definer: S.optional(S.String),
  Representations: S.optional(ViewRepresentationInputList),
  ViewVersionId: S.optional(S.Number),
  ViewVersionToken: S.optional(S.String),
  RefreshSeconds: S.optional(S.Number),
  LastRefreshType: S.optional(S.String),
  SubObjects: S.optional(ViewSubObjectsList),
  SubObjectVersionIds: S.optional(ViewSubObjectVersionIdsList),
}) {}
export class ErrorDetails extends S.Class<ErrorDetails>("ErrorDetails")({
  ErrorCode: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export class ExecutionAttempt extends S.Class<ExecutionAttempt>(
  "ExecutionAttempt",
)({
  Status: S.optional(S.String),
  ColumnStatisticsTaskRunId: S.optional(S.String),
  ExecutionTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  ErrorMessage: S.optional(S.String),
}) {}
export class ImportLabelsTaskRunProperties extends S.Class<ImportLabelsTaskRunProperties>(
  "ImportLabelsTaskRunProperties",
)({ InputS3Path: S.optional(S.String), Replace: S.optional(S.Boolean) }) {}
export class ExportLabelsTaskRunProperties extends S.Class<ExportLabelsTaskRunProperties>(
  "ExportLabelsTaskRunProperties",
)({ OutputS3Path: S.optional(S.String) }) {}
export class LabelingSetGenerationTaskRunProperties extends S.Class<LabelingSetGenerationTaskRunProperties>(
  "LabelingSetGenerationTaskRunProperties",
)({ OutputS3Path: S.optional(S.String) }) {}
export class FindMatchesTaskRunProperties extends S.Class<FindMatchesTaskRunProperties>(
  "FindMatchesTaskRunProperties",
)({
  JobId: S.optional(S.String),
  JobName: S.optional(S.String),
  JobRunId: S.optional(S.String),
}) {}
export class KeySchemaElement extends S.Class<KeySchemaElement>(
  "KeySchemaElement",
)({ Name: S.String, Type: S.String }) {}
export const KeySchemaElementList = S.Array(KeySchemaElement);
export class BackfillError extends S.Class<BackfillError>("BackfillError")({
  Code: S.optional(S.String),
  Partitions: S.optional(BackfillErroredPartitionsList),
}) {}
export const BackfillErrors = S.Array(BackfillError);
export class ConnectionTypeVariant extends S.Class<ConnectionTypeVariant>(
  "ConnectionTypeVariant",
)({
  ConnectionTypeVariantName: S.optional(S.String),
  DisplayName: S.optional(S.String),
  Description: S.optional(S.String),
  LogoUrl: S.optional(S.String),
}) {}
export const ConnectionTypeVariantList = S.Array(ConnectionTypeVariant);
export class RunIdentifier extends S.Class<RunIdentifier>("RunIdentifier")({
  RunId: S.optional(S.String),
  JobRunId: S.optional(S.String),
}) {}
export const StatisticPropertiesMap = S.Record({
  key: S.String,
  value: S.String,
});
export class TimestampedInclusionAnnotation extends S.Class<TimestampedInclusionAnnotation>(
  "TimestampedInclusionAnnotation",
)({
  Value: S.optional(S.String),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class Mapping extends S.Class<Mapping>("Mapping")({
  ToKey: S.optional(S.String),
  FromPath: S.optional(EnclosedInStringProperties),
  FromType: S.optional(S.String),
  ToType: S.optional(S.String),
  Dropped: S.optional(S.Boolean),
  Children: S.optional(S.suspend(() => Mappings)),
}) {}
export const StringToStringMap = S.Record({ key: S.String, value: S.String });
export const ErrorByName = S.Record({ key: S.String, value: ErrorDetail });
export class PartitionError extends S.Class<PartitionError>("PartitionError")({
  PartitionValues: S.optional(ValueStringList),
  ErrorDetail: S.optional(ErrorDetail),
}) {}
export const PartitionErrors = S.Array(PartitionError);
export const Blueprints = S.Array(Blueprint);
export class BatchTableOptimizer extends S.Class<BatchTableOptimizer>(
  "BatchTableOptimizer",
)({
  catalogId: S.optional(S.String),
  databaseName: S.optional(S.String),
  tableName: S.optional(S.String),
  tableOptimizer: S.optional(TableOptimizer),
}) {}
export const BatchTableOptimizers = S.Array(BatchTableOptimizer);
export class BatchGetTableOptimizerError extends S.Class<BatchGetTableOptimizerError>(
  "BatchGetTableOptimizerError",
)({
  error: S.optional(ErrorDetail),
  catalogId: S.optional(S.String),
  databaseName: S.optional(S.String),
  tableName: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const BatchGetTableOptimizerErrors = S.Array(
  BatchGetTableOptimizerError,
);
export class AnnotationError extends S.Class<AnnotationError>(
  "AnnotationError",
)({
  ProfileId: S.optional(S.String),
  StatisticId: S.optional(S.String),
  FailureReason: S.optional(S.String),
}) {}
export const AnnotationErrorList = S.Array(AnnotationError);
export class BatchUpdatePartitionFailureEntry extends S.Class<BatchUpdatePartitionFailureEntry>(
  "BatchUpdatePartitionFailureEntry",
)({
  PartitionValueList: S.optional(BoundedPartitionValueList),
  ErrorDetail: S.optional(ErrorDetail),
}) {}
export const BatchUpdatePartitionFailureList = S.Array(
  BatchUpdatePartitionFailureEntry,
);
export class TableInput extends S.Class<TableInput>("TableInput")({
  Name: S.String,
  Description: S.optional(S.String),
  Owner: S.optional(S.String),
  LastAccessTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastAnalyzedTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Retention: S.optional(S.Number),
  StorageDescriptor: S.optional(StorageDescriptor),
  PartitionKeys: S.optional(ColumnList),
  ViewOriginalText: S.optional(S.String),
  ViewExpandedText: S.optional(S.String),
  TableType: S.optional(S.String),
  Parameters: S.optional(ParametersMap),
  TargetTable: S.optional(TableIdentifier),
  ViewDefinition: S.optional(ViewDefinitionInput),
}) {}
export class SchemaVersionErrorItem extends S.Class<SchemaVersionErrorItem>(
  "SchemaVersionErrorItem",
)({
  VersionNumber: S.optional(S.Number),
  ErrorDetails: S.optional(ErrorDetails),
}) {}
export const SchemaVersionErrorList = S.Array(SchemaVersionErrorItem);
export class Field extends S.Class<Field>("Field")({
  FieldName: S.optional(S.String),
  Label: S.optional(S.String),
  Description: S.optional(S.String),
  FieldType: S.optional(S.String),
  IsPrimaryKey: S.optional(S.Boolean),
  IsNullable: S.optional(S.Boolean),
  IsRetrievable: S.optional(S.Boolean),
  IsFilterable: S.optional(S.Boolean),
  IsPartitionable: S.optional(S.Boolean),
  IsCreateable: S.optional(S.Boolean),
  IsUpdateable: S.optional(S.Boolean),
  IsUpsertable: S.optional(S.Boolean),
  IsDefaultOnCreate: S.optional(S.Boolean),
  SupportedValues: S.optional(ListOfString),
  SupportedFilterOperators: S.optional(FieldFilterOperatorsList),
  ParentField: S.optional(S.String),
  NativeDataType: S.optional(S.String),
  CustomProperties: S.optional(CustomProperties),
}) {}
export const FieldsList = S.Array(Field);
export class Integration extends S.Class<Integration>("Integration")({
  SourceArn: S.String,
  TargetArn: S.String,
  Description: S.optional(S.String),
  IntegrationName: S.String,
  IntegrationArn: S.String,
  KmsKeyId: S.optional(S.String),
  AdditionalEncryptionContext: S.optional(
    IntegrationAdditionalEncryptionContextMap,
  ),
  Tags: S.optional(IntegrationTagsList),
  Status: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  IntegrationConfig: S.optional(IntegrationConfig),
  Errors: S.optional(IntegrationErrorList),
  DataFilter: S.optional(S.String),
}) {}
export const IntegrationsList = S.Array(Integration);
export class ColumnStatisticsTaskSettings extends S.Class<ColumnStatisticsTaskSettings>(
  "ColumnStatisticsTaskSettings",
)({
  DatabaseName: S.optional(S.String),
  TableName: S.optional(S.String),
  Schedule: S.optional(Schedule),
  ColumnNameList: S.optional(ColumnNameList),
  CatalogID: S.optional(S.String),
  Role: S.optional(S.String),
  SampleSize: S.optional(S.Number),
  SecurityConfiguration: S.optional(S.String),
  ScheduleType: S.optional(S.String),
  SettingSource: S.optional(S.String),
  LastExecutionAttempt: S.optional(ExecutionAttempt),
}) {}
export class TaskRunProperties extends S.Class<TaskRunProperties>(
  "TaskRunProperties",
)({
  TaskType: S.optional(S.String),
  ImportLabelsTaskRunProperties: S.optional(ImportLabelsTaskRunProperties),
  ExportLabelsTaskRunProperties: S.optional(ExportLabelsTaskRunProperties),
  LabelingSetGenerationTaskRunProperties: S.optional(
    LabelingSetGenerationTaskRunProperties,
  ),
  FindMatchesTaskRunProperties: S.optional(FindMatchesTaskRunProperties),
}) {}
export class TaskRun extends S.Class<TaskRun>("TaskRun")({
  TransformId: S.optional(S.String),
  TaskRunId: S.optional(S.String),
  Status: S.optional(S.String),
  LogGroupName: S.optional(S.String),
  Properties: S.optional(TaskRunProperties),
  ErrorString: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExecutionTime: S.optional(S.Number),
}) {}
export const TaskRunList = S.Array(TaskRun);
export class PartitionIndexDescriptor extends S.Class<PartitionIndexDescriptor>(
  "PartitionIndexDescriptor",
)({
  IndexName: S.String,
  Keys: KeySchemaElementList,
  IndexStatus: S.String,
  BackfillErrors: S.optional(BackfillErrors),
}) {}
export const PartitionIndexDescriptorList = S.Array(PartitionIndexDescriptor);
export class ColumnRowFilter extends S.Class<ColumnRowFilter>(
  "ColumnRowFilter",
)({
  ColumnName: S.optional(S.String),
  RowFilterExpression: S.optional(S.String),
}) {}
export const ColumnRowFilterList = S.Array(ColumnRowFilter);
export class ConnectionTypeBrief extends S.Class<ConnectionTypeBrief>(
  "ConnectionTypeBrief",
)({
  ConnectionType: S.optional(S.String),
  DisplayName: S.optional(S.String),
  Vendor: S.optional(S.String),
  Description: S.optional(S.String),
  Categories: S.optional(ListOfString),
  Capabilities: S.optional(Capabilities),
  LogoUrl: S.optional(S.String),
  ConnectionTypeVariants: S.optional(ConnectionTypeVariantList),
}) {}
export const ConnectionTypeList = S.Array(ConnectionTypeBrief);
export class CrawlerHistory extends S.Class<CrawlerHistory>("CrawlerHistory")({
  CrawlId: S.optional(S.String),
  State: S.optional(S.String),
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Summary: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
  LogGroup: S.optional(S.String),
  LogStream: S.optional(S.String),
  MessagePrefix: S.optional(S.String),
  DPUHour: S.optional(S.Number),
}) {}
export const CrawlerHistoryList = S.Array(CrawlerHistory);
export class DataQualityResultDescription extends S.Class<DataQualityResultDescription>(
  "DataQualityResultDescription",
)({
  ResultId: S.optional(S.String),
  DataSource: S.optional(DataSource),
  JobName: S.optional(S.String),
  JobRunId: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const DataQualityResultDescriptionList = S.Array(
  DataQualityResultDescription,
);
export class DataQualityRuleRecommendationRunDescription extends S.Class<DataQualityRuleRecommendationRunDescription>(
  "DataQualityRuleRecommendationRunDescription",
)({
  RunId: S.optional(S.String),
  Status: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DataSource: S.optional(DataSource),
}) {}
export const DataQualityRuleRecommendationRunList = S.Array(
  DataQualityRuleRecommendationRunDescription,
);
export class DataQualityRulesetEvaluationRunDescription extends S.Class<DataQualityRulesetEvaluationRunDescription>(
  "DataQualityRulesetEvaluationRunDescription",
)({
  RunId: S.optional(S.String),
  Status: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  DataSource: S.optional(DataSource),
}) {}
export const DataQualityRulesetEvaluationRunList = S.Array(
  DataQualityRulesetEvaluationRunDescription,
);
export class DataQualityRulesetListDetails extends S.Class<DataQualityRulesetListDetails>(
  "DataQualityRulesetListDetails",
)({
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  TargetTable: S.optional(DataQualityTargetTable),
  RecommendationRunId: S.optional(S.String),
  RuleCount: S.optional(S.Number),
}) {}
export const DataQualityRulesetList = S.Array(DataQualityRulesetListDetails);
export class StatisticAnnotation extends S.Class<StatisticAnnotation>(
  "StatisticAnnotation",
)({
  ProfileId: S.optional(S.String),
  StatisticId: S.optional(S.String),
  StatisticRecordedOn: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  InclusionAnnotation: S.optional(TimestampedInclusionAnnotation),
}) {}
export const AnnotationList = S.Array(StatisticAnnotation);
export class StatisticSummary extends S.Class<StatisticSummary>(
  "StatisticSummary",
)({
  StatisticId: S.optional(S.String),
  ProfileId: S.optional(S.String),
  RunIdentifier: S.optional(RunIdentifier),
  StatisticName: S.optional(S.String),
  DoubleValue: S.optional(S.Number),
  EvaluationLevel: S.optional(S.String),
  ColumnsReferenced: S.optional(ColumnNameList),
  ReferencedDatasets: S.optional(ReferenceDatasetsList),
  StatisticProperties: S.optional(StatisticPropertiesMap),
  RecordedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InclusionAnnotation: S.optional(TimestampedInclusionAnnotation),
}) {}
export const StatisticSummaryList = S.Array(StatisticSummary);
export class IntegrationResourceProperty extends S.Class<IntegrationResourceProperty>(
  "IntegrationResourceProperty",
)({
  ResourceArn: S.String,
  ResourcePropertyArn: S.optional(S.String),
  SourceProcessingProperties: S.optional(SourceProcessingProperties),
  TargetProcessingProperties: S.optional(TargetProcessingProperties),
}) {}
export const IntegrationResourcePropertyList = S.Array(
  IntegrationResourceProperty,
);
export const PropertyNameOverrides = S.Record({
  key: S.String,
  value: S.String,
});
export class ConfusionMatrix extends S.Class<ConfusionMatrix>(
  "ConfusionMatrix",
)({
  NumTruePositives: S.optional(S.Number),
  NumFalsePositives: S.optional(S.Number),
  NumTrueNegatives: S.optional(S.Number),
  NumFalseNegatives: S.optional(S.Number),
}) {}
export class ColumnImportance extends S.Class<ColumnImportance>(
  "ColumnImportance",
)({ ColumnName: S.optional(S.String), Importance: S.optional(S.Number) }) {}
export const ColumnImportanceList = S.Array(ColumnImportance);
export class OtherMetadataValueListItem extends S.Class<OtherMetadataValueListItem>(
  "OtherMetadataValueListItem",
)({ MetadataValue: S.optional(S.String), CreatedTime: S.optional(S.String) }) {}
export const OtherMetadataValueList = S.Array(OtherMetadataValueListItem);
export class BatchDeleteConnectionResponse extends S.Class<BatchDeleteConnectionResponse>(
  "BatchDeleteConnectionResponse",
)({ Succeeded: S.optional(NameStringList), Errors: S.optional(ErrorByName) }) {}
export class BatchDeletePartitionResponse extends S.Class<BatchDeletePartitionResponse>(
  "BatchDeletePartitionResponse",
)({ Errors: S.optional(PartitionErrors) }) {}
export class BatchGetBlueprintsResponse extends S.Class<BatchGetBlueprintsResponse>(
  "BatchGetBlueprintsResponse",
)({
  Blueprints: S.optional(Blueprints),
  MissingBlueprints: S.optional(BlueprintNames),
}) {}
export class BatchGetCrawlersResponse extends S.Class<BatchGetCrawlersResponse>(
  "BatchGetCrawlersResponse",
)({
  Crawlers: S.optional(CrawlerList),
  CrawlersNotFound: S.optional(CrawlerNameList),
}) {}
export class BatchGetTableOptimizerResponse extends S.Class<BatchGetTableOptimizerResponse>(
  "BatchGetTableOptimizerResponse",
)({
  TableOptimizers: S.optional(BatchTableOptimizers),
  Failures: S.optional(BatchGetTableOptimizerErrors),
}) {}
export class BatchPutDataQualityStatisticAnnotationResponse extends S.Class<BatchPutDataQualityStatisticAnnotationResponse>(
  "BatchPutDataQualityStatisticAnnotationResponse",
)({ FailedInclusionAnnotations: S.optional(AnnotationErrorList) }) {}
export class BatchUpdatePartitionResponse extends S.Class<BatchUpdatePartitionResponse>(
  "BatchUpdatePartitionResponse",
)({ Errors: S.optional(BatchUpdatePartitionFailureList) }) {}
export class CreateCatalogRequest extends S.Class<CreateCatalogRequest>(
  "CreateCatalogRequest",
)(
  { Name: S.String, CatalogInput: CatalogInput, Tags: S.optional(TagsMap) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCatalogResponse extends S.Class<CreateCatalogResponse>(
  "CreateCatalogResponse",
)({}) {}
export class CreateIntegrationResponse extends S.Class<CreateIntegrationResponse>(
  "CreateIntegrationResponse",
)({
  SourceArn: S.String,
  TargetArn: S.String,
  IntegrationName: S.String,
  Description: S.optional(S.String),
  IntegrationArn: S.String,
  KmsKeyId: S.optional(S.String),
  AdditionalEncryptionContext: S.optional(
    IntegrationAdditionalEncryptionContextMap,
  ),
  Tags: S.optional(IntegrationTagsList),
  Status: S.String,
  CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  Errors: S.optional(IntegrationErrorList),
  DataFilter: S.optional(S.String),
  IntegrationConfig: S.optional(IntegrationConfig),
}) {}
export class CreateMLTransformResponse extends S.Class<CreateMLTransformResponse>(
  "CreateMLTransformResponse",
)({ TransformId: S.optional(S.String) }) {}
export class CreateScriptResponse extends S.Class<CreateScriptResponse>(
  "CreateScriptResponse",
)({ PythonScript: S.optional(S.String), ScalaCode: S.optional(S.String) }) {}
export class CreateSecurityConfigurationResponse extends S.Class<CreateSecurityConfigurationResponse>(
  "CreateSecurityConfigurationResponse",
)({
  Name: S.optional(S.String),
  CreatedTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class IcebergStructField extends S.Class<IcebergStructField>(
  "IcebergStructField",
)({
  Id: S.Number,
  Name: S.String,
  Type: S.Any,
  Required: S.Boolean,
  Doc: S.optional(S.String),
  InitialDefault: S.optional(S.Any),
  WriteDefault: S.optional(S.Any),
}) {}
export const IcebergStructFieldList = S.Array(IcebergStructField);
export class IcebergPartitionField extends S.Class<IcebergPartitionField>(
  "IcebergPartitionField",
)({
  SourceId: S.Number,
  Transform: S.String,
  Name: S.String,
  FieldId: S.optional(S.Number),
}) {}
export const IcebergPartitionSpecFieldList = S.Array(IcebergPartitionField);
export class IcebergSortField extends S.Class<IcebergSortField>(
  "IcebergSortField",
)({
  SourceId: S.Number,
  Transform: S.String,
  Direction: S.String,
  NullOrder: S.String,
}) {}
export const IcebergSortOrderFieldList = S.Array(IcebergSortField);
export class CreateTableOptimizerRequest extends S.Class<CreateTableOptimizerRequest>(
  "CreateTableOptimizerRequest",
)(
  {
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Type: S.String,
    TableOptimizerConfiguration: TableOptimizerConfiguration,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTableOptimizerResponse extends S.Class<CreateTableOptimizerResponse>(
  "CreateTableOptimizerResponse",
)({}) {}
export class CreateTriggerResponse extends S.Class<CreateTriggerResponse>(
  "CreateTriggerResponse",
)({ Name: S.optional(S.String) }) {}
export class CreateUsageProfileRequest extends S.Class<CreateUsageProfileRequest>(
  "CreateUsageProfileRequest",
)(
  {
    Name: S.String,
    Description: S.optional(S.String),
    Configuration: ProfileConfiguration,
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSchemaVersionsResponse extends S.Class<DeleteSchemaVersionsResponse>(
  "DeleteSchemaVersionsResponse",
)({ SchemaVersionErrors: S.optional(SchemaVersionErrorList) }) {}
export class DescribeEntityResponse extends S.Class<DescribeEntityResponse>(
  "DescribeEntityResponse",
)({ Fields: S.optional(FieldsList), NextToken: S.optional(S.String) }) {}
export class DescribeIntegrationsResponse extends S.Class<DescribeIntegrationsResponse>(
  "DescribeIntegrationsResponse",
)({
  Integrations: S.optional(IntegrationsList),
  Marker: S.optional(S.String),
}) {}
export class GetClassifierResponse extends S.Class<GetClassifierResponse>(
  "GetClassifierResponse",
)({ Classifier: S.optional(Classifier) }) {}
export class GetColumnStatisticsTaskSettingsResponse extends S.Class<GetColumnStatisticsTaskSettingsResponse>(
  "GetColumnStatisticsTaskSettingsResponse",
)({ ColumnStatisticsTaskSettings: S.optional(ColumnStatisticsTaskSettings) }) {}
export class GetJobRunResponse extends S.Class<GetJobRunResponse>(
  "GetJobRunResponse",
)({ JobRun: S.optional(JobRun) }) {}
export class GetMLTaskRunResponse extends S.Class<GetMLTaskRunResponse>(
  "GetMLTaskRunResponse",
)({
  TransformId: S.optional(S.String),
  TaskRunId: S.optional(S.String),
  Status: S.optional(S.String),
  LogGroupName: S.optional(S.String),
  Properties: S.optional(TaskRunProperties),
  ErrorString: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  ExecutionTime: S.optional(S.Number),
}) {}
export class GetMLTaskRunsResponse extends S.Class<GetMLTaskRunsResponse>(
  "GetMLTaskRunsResponse",
)({ TaskRuns: S.optional(TaskRunList), NextToken: S.optional(S.String) }) {}
export class GetPartitionIndexesResponse extends S.Class<GetPartitionIndexesResponse>(
  "GetPartitionIndexesResponse",
)({
  PartitionIndexDescriptorList: S.optional(PartitionIndexDescriptorList),
  NextToken: S.optional(S.String),
}) {}
export class GetUnfilteredPartitionMetadataResponse extends S.Class<GetUnfilteredPartitionMetadataResponse>(
  "GetUnfilteredPartitionMetadataResponse",
)({
  Partition: S.optional(Partition),
  AuthorizedColumns: S.optional(NameStringList),
  IsRegisteredWithLakeFormation: S.optional(S.Boolean),
}) {}
export class GetUnfilteredTableMetadataResponse extends S.Class<GetUnfilteredTableMetadataResponse>(
  "GetUnfilteredTableMetadataResponse",
)({
  Table: S.optional(Table),
  AuthorizedColumns: S.optional(NameStringList),
  IsRegisteredWithLakeFormation: S.optional(S.Boolean),
  CellFilters: S.optional(ColumnRowFilterList),
  QueryAuthorizationId: S.optional(S.String),
  IsMultiDialectView: S.optional(S.Boolean),
  IsMaterializedView: S.optional(S.Boolean),
  ResourceArn: S.optional(S.String),
  IsProtected: S.optional(S.Boolean),
  Permissions: S.optional(PermissionList),
  RowFilter: S.optional(S.String),
}) {}
export class GetWorkflowRunResponse extends S.Class<GetWorkflowRunResponse>(
  "GetWorkflowRunResponse",
)({ Run: S.optional(WorkflowRun) }) {}
export class ListConnectionTypesResponse extends S.Class<ListConnectionTypesResponse>(
  "ListConnectionTypesResponse",
)({
  ConnectionTypes: S.optional(ConnectionTypeList),
  NextToken: S.optional(S.String),
}) {}
export class ListCrawlsResponse extends S.Class<ListCrawlsResponse>(
  "ListCrawlsResponse",
)({
  Crawls: S.optional(CrawlerHistoryList),
  NextToken: S.optional(S.String),
}) {}
export class ListDataQualityResultsResponse extends S.Class<ListDataQualityResultsResponse>(
  "ListDataQualityResultsResponse",
)({
  Results: DataQualityResultDescriptionList,
  NextToken: S.optional(S.String),
}) {}
export class ListDataQualityRuleRecommendationRunsResponse extends S.Class<ListDataQualityRuleRecommendationRunsResponse>(
  "ListDataQualityRuleRecommendationRunsResponse",
)({
  Runs: S.optional(DataQualityRuleRecommendationRunList),
  NextToken: S.optional(S.String),
}) {}
export class ListDataQualityRulesetEvaluationRunsResponse extends S.Class<ListDataQualityRulesetEvaluationRunsResponse>(
  "ListDataQualityRulesetEvaluationRunsResponse",
)({
  Runs: S.optional(DataQualityRulesetEvaluationRunList),
  NextToken: S.optional(S.String),
}) {}
export class ListDataQualityRulesetsResponse extends S.Class<ListDataQualityRulesetsResponse>(
  "ListDataQualityRulesetsResponse",
)({
  Rulesets: S.optional(DataQualityRulesetList),
  NextToken: S.optional(S.String),
}) {}
export class ListDataQualityStatisticAnnotationsResponse extends S.Class<ListDataQualityStatisticAnnotationsResponse>(
  "ListDataQualityStatisticAnnotationsResponse",
)({
  Annotations: S.optional(AnnotationList),
  NextToken: S.optional(S.String),
}) {}
export class ListDataQualityStatisticsResponse extends S.Class<ListDataQualityStatisticsResponse>(
  "ListDataQualityStatisticsResponse",
)({
  Statistics: S.optional(StatisticSummaryList),
  NextToken: S.optional(S.String),
}) {}
export class ListIntegrationResourcePropertiesResponse extends S.Class<ListIntegrationResourcePropertiesResponse>(
  "ListIntegrationResourcePropertiesResponse",
)({
  IntegrationResourcePropertyList: S.optional(IntegrationResourcePropertyList),
  Marker: S.optional(S.String),
}) {}
export class StartDataQualityRuleRecommendationRunResponse extends S.Class<StartDataQualityRuleRecommendationRunResponse>(
  "StartDataQualityRuleRecommendationRunResponse",
)({ RunId: S.optional(S.String) }) {}
export class IcebergEncryptedKey extends S.Class<IcebergEncryptedKey>(
  "IcebergEncryptedKey",
)({
  KeyId: S.String,
  EncryptedKeyMetadata: S.String,
  EncryptedById: S.optional(S.String),
  Properties: S.optional(StringToStringMap),
}) {}
export class ComputeEnvironmentConfiguration extends S.Class<ComputeEnvironmentConfiguration>(
  "ComputeEnvironmentConfiguration",
)({
  Name: S.String,
  Description: S.String,
  ComputeEnvironment: S.String,
  SupportedAuthenticationTypes: AuthenticationTypes,
  ConnectionOptions: PropertiesMap,
  ConnectionPropertyNameOverrides: PropertyNameOverrides,
  ConnectionOptionNameOverrides: PropertyNameOverrides,
  ConnectionPropertiesRequiredOverrides: ListOfString,
  PhysicalConnectionPropertiesRequired: S.optional(S.Boolean),
}) {}
export class FindMatchesMetrics extends S.Class<FindMatchesMetrics>(
  "FindMatchesMetrics",
)({
  AreaUnderPRCurve: S.optional(S.Number),
  Precision: S.optional(S.Number),
  Recall: S.optional(S.Number),
  F1: S.optional(S.Number),
  ConfusionMatrix: S.optional(ConfusionMatrix),
  ColumnImportances: S.optional(ColumnImportanceList),
}) {}
export class MetadataInfo extends S.Class<MetadataInfo>("MetadataInfo")({
  MetadataValue: S.optional(S.String),
  CreatedTime: S.optional(S.String),
  OtherMetadataValueList: S.optional(OtherMetadataValueList),
}) {}
export class IcebergSchema extends S.Class<IcebergSchema>("IcebergSchema")({
  SchemaId: S.optional(S.Number),
  IdentifierFieldIds: S.optional(IntegerList),
  Type: S.optional(S.String),
  Fields: IcebergStructFieldList,
}) {}
export class IcebergPartitionSpec extends S.Class<IcebergPartitionSpec>(
  "IcebergPartitionSpec",
)({ Fields: IcebergPartitionSpecFieldList, SpecId: S.optional(S.Number) }) {}
export class IcebergSortOrder extends S.Class<IcebergSortOrder>(
  "IcebergSortOrder",
)({ OrderId: S.Number, Fields: IcebergSortOrderFieldList }) {}
export class ViewValidation extends S.Class<ViewValidation>("ViewValidation")({
  Dialect: S.optional(S.String),
  DialectVersion: S.optional(S.String),
  ViewValidationText: S.optional(S.String),
  UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  State: S.optional(S.String),
  Error: S.optional(ErrorDetail),
}) {}
export const ViewValidationList = S.Array(ViewValidation);
export class IcebergTableUpdate extends S.Class<IcebergTableUpdate>(
  "IcebergTableUpdate",
)({
  Schema: IcebergSchema,
  PartitionSpec: S.optional(IcebergPartitionSpec),
  SortOrder: S.optional(IcebergSortOrder),
  Location: S.String,
  Properties: S.optional(StringToStringMap),
  Action: S.optional(S.String),
  EncryptionKey: S.optional(IcebergEncryptedKey),
  KeyId: S.optional(S.String),
}) {}
export const IcebergTableUpdateList = S.Array(IcebergTableUpdate);
export const PartitionInputList = S.Array(PartitionInput);
export const ComputeEnvironmentConfigurationMap = S.Record({
  key: S.String,
  value: ComputeEnvironmentConfiguration,
});
export class EvaluationMetrics extends S.Class<EvaluationMetrics>(
  "EvaluationMetrics",
)({
  TransformType: S.String,
  FindMatchesMetrics: S.optional(FindMatchesMetrics),
}) {}
export class MLTransform extends S.Class<MLTransform>("MLTransform")({
  TransformId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InputRecordTables: S.optional(GlueTables),
  Parameters: S.optional(TransformParameters),
  EvaluationMetrics: S.optional(EvaluationMetrics),
  LabelCount: S.optional(S.Number),
  Schema: S.optional(TransformSchema),
  Role: S.optional(S.String),
  GlueVersion: S.optional(S.String),
  MaxCapacity: S.optional(S.Number),
  WorkerType: S.optional(S.String),
  NumberOfWorkers: S.optional(S.Number),
  Timeout: S.optional(S.Number),
  MaxRetries: S.optional(S.Number),
  TransformEncryption: S.optional(TransformEncryption),
}) {}
export const TransformList = S.Array(MLTransform);
export const TableOptimizerRuns = S.Array(TableOptimizerRun);
export const MetadataInfoMap = S.Record({ key: S.String, value: MetadataInfo });
export class CreateIcebergTableInput extends S.Class<CreateIcebergTableInput>(
  "CreateIcebergTableInput",
)({
  Location: S.String,
  Schema: IcebergSchema,
  PartitionSpec: S.optional(IcebergPartitionSpec),
  WriteOrder: S.optional(IcebergSortOrder),
  Properties: S.optional(StringToStringMap),
}) {}
export class StatusDetails extends S.Class<StatusDetails>("StatusDetails")({
  RequestedChange: S.optional(S.suspend((): S.Schema<Table, any> => Table)),
  ViewValidations: S.optional(ViewValidationList),
}) {}
export class UpdateIcebergTableInput extends S.Class<UpdateIcebergTableInput>(
  "UpdateIcebergTableInput",
)({ Updates: IcebergTableUpdateList }) {}
export class BatchCreatePartitionRequest extends S.Class<BatchCreatePartitionRequest>(
  "BatchCreatePartitionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionInputList: PartitionInputList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateConnectionRequest extends S.Class<CreateConnectionRequest>(
  "CreateConnectionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    ConnectionInput: ConnectionInput,
    Tags: S.optional(TagsMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateUsageProfileResponse extends S.Class<CreateUsageProfileResponse>(
  "CreateUsageProfileResponse",
)({ Name: S.optional(S.String) }) {}
export class DescribeConnectionTypeResponse extends S.Class<DescribeConnectionTypeResponse>(
  "DescribeConnectionTypeResponse",
)({
  ConnectionType: S.optional(S.String),
  Description: S.optional(S.String),
  Capabilities: S.optional(Capabilities),
  ConnectionProperties: S.optional(PropertiesMap),
  ConnectionOptions: S.optional(PropertiesMap),
  AuthenticationConfiguration: S.optional(AuthConfiguration),
  ComputeEnvironmentConfigurations: S.optional(
    ComputeEnvironmentConfigurationMap,
  ),
  PhysicalConnectionRequirements: S.optional(PropertiesMap),
  AthenaConnectionProperties: S.optional(PropertiesMap),
  PythonConnectionProperties: S.optional(PropertiesMap),
  SparkConnectionProperties: S.optional(PropertiesMap),
}) {}
export class GetCatalogResponse extends S.Class<GetCatalogResponse>(
  "GetCatalogResponse",
)({ Catalog: S.optional(Catalog) }) {}
export class GetConnectionResponse extends S.Class<GetConnectionResponse>(
  "GetConnectionResponse",
)({ Connection: S.optional(Connection) }) {}
export class GetDataQualityResultResponse extends S.Class<GetDataQualityResultResponse>(
  "GetDataQualityResultResponse",
)({
  ResultId: S.optional(S.String),
  ProfileId: S.optional(S.String),
  Score: S.optional(S.Number),
  DataSource: S.optional(DataSource),
  RulesetName: S.optional(S.String),
  EvaluationContext: S.optional(S.String),
  StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  JobName: S.optional(S.String),
  JobRunId: S.optional(S.String),
  RulesetEvaluationRunId: S.optional(S.String),
  RuleResults: S.optional(DataQualityRuleResults),
  AnalyzerResults: S.optional(DataQualityAnalyzerResults),
  Observations: S.optional(DataQualityObservations),
  AggregatedMetrics: S.optional(DataQualityAggregatedMetrics),
}) {}
export class GetMLTransformResponse extends S.Class<GetMLTransformResponse>(
  "GetMLTransformResponse",
)({
  TransformId: S.optional(S.String),
  Name: S.optional(S.String),
  Description: S.optional(S.String),
  Status: S.optional(S.String),
  CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  InputRecordTables: S.optional(GlueTables),
  Parameters: S.optional(TransformParameters),
  EvaluationMetrics: S.optional(EvaluationMetrics),
  LabelCount: S.optional(S.Number),
  Schema: S.optional(TransformSchema),
  Role: S.optional(S.String),
  GlueVersion: S.optional(S.String),
  MaxCapacity: S.optional(S.Number),
  WorkerType: S.optional(S.String),
  NumberOfWorkers: S.optional(S.Number),
  Timeout: S.optional(S.Number),
  MaxRetries: S.optional(S.Number),
  TransformEncryption: S.optional(TransformEncryption),
}) {}
export class GetMLTransformsResponse extends S.Class<GetMLTransformsResponse>(
  "GetMLTransformsResponse",
)({ Transforms: TransformList, NextToken: S.optional(S.String) }) {}
export class GetStatementResponse extends S.Class<GetStatementResponse>(
  "GetStatementResponse",
)({ Statement: S.optional(Statement) }) {}
export class ListTableOptimizerRunsResponse extends S.Class<ListTableOptimizerRunsResponse>(
  "ListTableOptimizerRunsResponse",
)({
  CatalogId: S.optional(S.String),
  DatabaseName: S.optional(S.String),
  TableName: S.optional(S.String),
  NextToken: S.optional(S.String),
  TableOptimizerRuns: S.optional(TableOptimizerRuns),
}) {}
export class QuerySchemaVersionMetadataResponse extends S.Class<QuerySchemaVersionMetadataResponse>(
  "QuerySchemaVersionMetadataResponse",
)({
  MetadataInfoMap: S.optional(MetadataInfoMap),
  SchemaVersionId: S.optional(S.String),
  NextToken: S.optional(S.String),
}) {}
export class UpdateColumnStatisticsForPartitionRequest extends S.Class<UpdateColumnStatisticsForPartitionRequest>(
  "UpdateColumnStatisticsForPartitionRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValues: ValueStringList,
    ColumnStatisticsList: UpdateColumnStatisticsList,
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IcebergInput extends S.Class<IcebergInput>("IcebergInput")({
  MetadataOperation: S.String,
  Version: S.optional(S.String),
  CreateIcebergTableInput: S.optional(CreateIcebergTableInput),
}) {}
export class TableStatus extends S.Class<TableStatus>("TableStatus")({
  RequestedBy: S.optional(S.String),
  UpdatedBy: S.optional(S.String),
  RequestTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  Action: S.optional(S.String),
  State: S.optional(S.String),
  Error: S.optional(ErrorDetail),
  Details: S.optional(
    S.suspend((): S.Schema<StatusDetails, any> => StatusDetails),
  ),
}) {}
export class UpdateIcebergInput extends S.Class<UpdateIcebergInput>(
  "UpdateIcebergInput",
)({ UpdateIcebergTableInput: UpdateIcebergTableInput }) {}
export class OpenTableFormatInput extends S.Class<OpenTableFormatInput>(
  "OpenTableFormatInput",
)({ IcebergInput: S.optional(IcebergInput) }) {}
export class UpdateOpenTableFormatInput extends S.Class<UpdateOpenTableFormatInput>(
  "UpdateOpenTableFormatInput",
)({ UpdateIcebergInput: S.optional(UpdateIcebergInput) }) {}
export class BatchCreatePartitionResponse extends S.Class<BatchCreatePartitionResponse>(
  "BatchCreatePartitionResponse",
)({ Errors: S.optional(PartitionErrors) }) {}
export class CreateConnectionResponse extends S.Class<CreateConnectionResponse>(
  "CreateConnectionResponse",
)({ CreateConnectionStatus: S.optional(S.String) }) {}
export class CreateTableRequest extends S.Class<CreateTableRequest>(
  "CreateTableRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    Name: S.optional(S.String),
    TableInput: S.optional(TableInput),
    PartitionIndexes: S.optional(PartitionIndexList),
    TransactionId: S.optional(S.String),
    OpenTableFormatInput: S.optional(OpenTableFormatInput),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTableResponse extends S.Class<CreateTableResponse>(
  "CreateTableResponse",
)({}) {}
export class GetTablesResponse extends S.Class<GetTablesResponse>(
  "GetTablesResponse",
)({ TableList: S.optional(TableList), NextToken: S.optional(S.String) }) {}
export class UpdateColumnStatisticsForPartitionResponse extends S.Class<UpdateColumnStatisticsForPartitionResponse>(
  "UpdateColumnStatisticsForPartitionResponse",
)({ Errors: S.optional(ColumnStatisticsErrors) }) {}
export class UpdateTableRequest extends S.Class<UpdateTableRequest>(
  "UpdateTableRequest",
)(
  {
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    Name: S.optional(S.String),
    TableInput: S.optional(TableInput),
    SkipArchive: S.optional(S.Boolean),
    TransactionId: S.optional(S.String),
    VersionId: S.optional(S.String),
    ViewUpdateAction: S.optional(S.String),
    Force: S.optional(S.Boolean),
    UpdateOpenTableFormatInput: S.optional(UpdateOpenTableFormatInput),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTableResponse extends S.Class<UpdateTableResponse>(
  "UpdateTableResponse",
)({}) {}
export const Workflows = S.Array(Workflow);
export class BatchGetWorkflowsResponse extends S.Class<BatchGetWorkflowsResponse>(
  "BatchGetWorkflowsResponse",
)({
  Workflows: S.optional(Workflows),
  MissingWorkflows: S.optional(WorkflowNames),
}) {}
export class CreateJobRequest extends S.Class<CreateJobRequest>(
  "CreateJobRequest",
)(
  {
    Name: S.String,
    JobMode: S.optional(S.String),
    JobRunQueuingEnabled: S.optional(S.Boolean),
    Description: S.optional(S.String),
    LogUri: S.optional(S.String),
    Role: S.String,
    ExecutionProperty: S.optional(ExecutionProperty),
    Command: JobCommand,
    DefaultArguments: S.optional(GenericMap),
    NonOverridableArguments: S.optional(GenericMap),
    Connections: S.optional(ConnectionsList),
    MaxRetries: S.optional(S.Number),
    AllocatedCapacity: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
    SecurityConfiguration: S.optional(S.String),
    Tags: S.optional(TagsMap),
    NotificationProperty: S.optional(NotificationProperty),
    GlueVersion: S.optional(S.String),
    NumberOfWorkers: S.optional(S.Number),
    WorkerType: S.optional(S.String),
    CodeGenConfigurationNodes: S.optional(CodeGenConfigurationNodes),
    ExecutionClass: S.optional(S.String),
    SourceControlDetails: S.optional(SourceControlDetails),
    MaintenanceWindow: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateJobResponse extends S.Class<CreateJobResponse>(
  "CreateJobResponse",
)({ Name: S.optional(S.String) }) {}

//# Errors
export class EntityNotFoundException extends S.TaggedError<EntityNotFoundException>()(
  "EntityNotFoundException",
  {},
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  {},
) {}
export class GlueEncryptionException extends S.TaggedError<GlueEncryptionException>()(
  "GlueEncryptionException",
  {},
) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  {},
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  {},
) {}
export class OperationTimeoutException extends S.TaggedError<OperationTimeoutException>()(
  "OperationTimeoutException",
  {},
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  {},
) {}
export class FederationSourceException extends S.TaggedError<FederationSourceException>()(
  "FederationSourceException",
  {},
) {}
export class CrawlerRunningException extends S.TaggedError<CrawlerRunningException>()(
  "CrawlerRunningException",
  {},
) {}
export class VersionMismatchException extends S.TaggedError<VersionMismatchException>()(
  "VersionMismatchException",
  {},
) {}
export class FederationSourceRetryableException extends S.TaggedError<FederationSourceRetryableException>()(
  "FederationSourceRetryableException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {},
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class IllegalSessionStateException extends S.TaggedError<IllegalSessionStateException>()(
  "IllegalSessionStateException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNumberLimitExceededException extends S.TaggedError<ResourceNumberLimitExceededException>()(
  "ResourceNumberLimitExceededException",
  {},
) {}
export class SchedulerTransitioningException extends S.TaggedError<SchedulerTransitioningException>()(
  "SchedulerTransitioningException",
  {},
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class ConditionCheckFailureException extends S.TaggedError<ConditionCheckFailureException>()(
  "ConditionCheckFailureException",
  { Message: S.optional(S.String) },
) {}
export class OperationNotSupportedException extends S.TaggedError<OperationNotSupportedException>()(
  "OperationNotSupportedException",
  { Message: S.optional(S.String) },
) {}
export class ColumnStatisticsTaskRunningException extends S.TaggedError<ColumnStatisticsTaskRunningException>()(
  "ColumnStatisticsTaskRunningException",
  {},
) {}
export class NoScheduleException extends S.TaggedError<NoScheduleException>()(
  "NoScheduleException",
  { Message: S.optional(S.String) },
) {}
export class ConcurrentRunsExceededException extends S.TaggedError<ConcurrentRunsExceededException>()(
  "ConcurrentRunsExceededException",
  {},
) {}
export class ColumnStatisticsTaskNotRunningException extends S.TaggedError<ColumnStatisticsTaskNotRunningException>()(
  "ColumnStatisticsTaskNotRunningException",
  { Message: S.optional(S.String) },
) {}
export class CrawlerNotRunningException extends S.TaggedError<CrawlerNotRunningException>()(
  "CrawlerNotRunningException",
  { Message: S.optional(S.String) },
) {}
export class SchedulerNotRunningException extends S.TaggedError<SchedulerNotRunningException>()(
  "SchedulerNotRunningException",
  { Message: S.optional(S.String) },
) {}
export class IllegalWorkflowStateException extends S.TaggedError<IllegalWorkflowStateException>()(
  "IllegalWorkflowStateException",
  { Message: S.optional(S.String) },
) {}
export class IllegalBlueprintStateException extends S.TaggedError<IllegalBlueprintStateException>()(
  "IllegalBlueprintStateException",
  {},
) {}
export class IdempotentParameterMismatchException extends S.TaggedError<IdempotentParameterMismatchException>()(
  "IdempotentParameterMismatchException",
  {},
) {}
export class ResourceNotReadyException extends S.TaggedError<ResourceNotReadyException>()(
  "ResourceNotReadyException",
  {},
) {}
export class IntegrationConflictOperationFault extends S.TaggedError<IntegrationConflictOperationFault>()(
  "IntegrationConflictOperationFault",
  {},
) {}
export class IntegrationNotFoundFault extends S.TaggedError<IntegrationNotFoundFault>()(
  "IntegrationNotFoundFault",
  {},
) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  {},
) {}
export class SchedulerRunningException extends S.TaggedError<SchedulerRunningException>()(
  "SchedulerRunningException",
  { Message: S.optional(S.String) },
) {}
export class MLTransformNotReadyException extends S.TaggedError<MLTransformNotReadyException>()(
  "MLTransformNotReadyException",
  { Message: S.optional(S.String) },
) {}
export class ColumnStatisticsTaskStoppingException extends S.TaggedError<ColumnStatisticsTaskStoppingException>()(
  "ColumnStatisticsTaskStoppingException",
  { Message: S.optional(S.String) },
) {}
export class CrawlerStoppingException extends S.TaggedError<CrawlerStoppingException>()(
  "CrawlerStoppingException",
  { Message: S.optional(S.String) },
) {}
export class FederatedResourceAlreadyExistsException extends S.TaggedError<FederatedResourceAlreadyExistsException>()(
  "FederatedResourceAlreadyExistsException",
  {},
) {}
export class InvalidIntegrationStateFault extends S.TaggedError<InvalidIntegrationStateFault>()(
  "InvalidIntegrationStateFault",
  {},
) {}
export class TargetResourceNotFound extends S.TaggedError<TargetResourceNotFound>()(
  "TargetResourceNotFound",
  { Message: S.optional(S.String) },
) {}
export class PermissionTypeMismatchException extends S.TaggedError<PermissionTypeMismatchException>()(
  "PermissionTypeMismatchException",
  {},
) {}
export class IntegrationQuotaExceededFault extends S.TaggedError<IntegrationQuotaExceededFault>()(
  "IntegrationQuotaExceededFault",
  { Message: S.optional(S.String) },
) {}
export class KMSKeyNotAccessibleFault extends S.TaggedError<KMSKeyNotAccessibleFault>()(
  "KMSKeyNotAccessibleFault",
  { Message: S.optional(S.String) },
) {}

//# Operations
/**
 * Retrieves table statistics of columns.
 *
 * The Identity and Access Management (IAM) permission required for this operation is `DeleteTable`.
 */
export const deleteColumnStatisticsForTable =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteColumnStatisticsForTableRequest,
    output: DeleteColumnStatisticsForTableResponse,
    errors: [
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Deletes settings for a column statistics task.
 */
export const deleteColumnStatisticsTaskSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteColumnStatisticsTaskSettingsRequest,
    output: DeleteColumnStatisticsTaskSettingsResponse,
    errors: [
      EntityNotFoundException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Deletes a connection from the Data Catalog.
 */
export const deleteConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRequest,
  output: DeleteConnectionResponse,
  errors: [EntityNotFoundException, OperationTimeoutException],
}));
/**
 * Deletes a data quality ruleset.
 */
export const deleteDataQualityRuleset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteDataQualityRulesetRequest,
    output: DeleteDataQualityRulesetResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Deletes a specified development endpoint.
 */
export const deleteDevEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDevEndpointRequest,
  output: DeleteDevEndpointResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes the existing Glue Identity Center configuration, removing the integration between Glue and
 * Amazon Web Services IAM Identity Center.
 */
export const deleteGlueIdentityCenterConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteGlueIdentityCenterConfigurationRequest,
    output: DeleteGlueIdentityCenterConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConcurrentModificationException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Deletes a specified partition.
 */
export const deletePartition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeletePartitionRequest,
  output: DeletePartitionResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes a specified security configuration.
 */
export const deleteSecurityConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSecurityConfigurationRequest,
    output: DeleteSecurityConfigurationResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Deletes a specified version of a table.
 */
export const deleteTableVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTableVersionRequest,
  output: DeleteTableVersionResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes an existing function definition from the Data Catalog.
 */
export const deleteUserDefinedFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteUserDefinedFunctionRequest,
    output: DeleteUserDefinedFunctionResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieves the current Glue Identity Center configuration details, including the associated Identity Center instance and
 * application information.
 */
export const getGlueIdentityCenterConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetGlueIdentityCenterConfigurationRequest,
    output: GetGlueIdentityCenterConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConcurrentModificationException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Imports an existing Amazon Athena Data Catalog to Glue.
 */
export const importCatalogToGlue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportCatalogToGlueRequest,
  output: ImportCatalogToGlueResponse,
  errors: [InternalServiceException, OperationTimeoutException],
}));
/**
 * Annotate all datapoints for a Profile.
 */
export const putDataQualityProfileAnnotation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutDataQualityProfileAnnotationRequest,
    output: PutDataQualityProfileAnnotationResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
    ],
  }));
/**
 * Starts a column statistics task run schedule.
 */
export const startColumnStatisticsTaskRunSchedule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartColumnStatisticsTaskRunScheduleRequest,
    output: StartColumnStatisticsTaskRunScheduleResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Starts a crawl using the specified crawler, regardless
 * of what is scheduled. If the crawler is already running, returns a
 * CrawlerRunningException.
 */
export const startCrawler = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCrawlerRequest,
  output: StartCrawlerResponse,
  errors: [
    CrawlerRunningException,
    EntityNotFoundException,
    OperationTimeoutException,
  ],
}));
/**
 * Stops a column statistics task run schedule.
 */
export const stopColumnStatisticsTaskRunSchedule =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StopColumnStatisticsTaskRunScheduleRequest,
    output: StopColumnStatisticsTaskRunScheduleResponse,
    errors: [
      EntityNotFoundException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Adds tags to a resource. A tag is a label you can assign to an Amazon Web Services resource.
 * In Glue, you can tag only certain resources. For information about what
 * resources you can tag, see Amazon Web Services Tags in Glue.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Removes tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Updates an existing catalog's properties in the Glue Data Catalog.
 */
export const updateCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCatalogRequest,
  output: UpdateCatalogResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    FederationSourceException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Updates a connection definition in the Data Catalog.
 */
export const updateConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateConnectionRequest,
  output: UpdateConnectionResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Updates a crawler. If a crawler is
 * running, you must stop it using `StopCrawler` before updating
 * it.
 */
export const updateCrawler = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCrawlerRequest,
  output: UpdateCrawlerResponse,
  errors: [
    CrawlerRunningException,
    EntityNotFoundException,
    InvalidInputException,
    OperationTimeoutException,
    VersionMismatchException,
  ],
}));
/**
 * Updates an existing database definition in a Data Catalog.
 */
export const updateDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDatabaseRequest,
  output: UpdateDatabaseResponse,
  errors: [
    AlreadyExistsException,
    ConcurrentModificationException,
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Updates the existing Glue Identity Center configuration, allowing modification of scopes and permissions for the integration.
 */
export const updateGlueIdentityCenterConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateGlueIdentityCenterConfigurationRequest,
    output: UpdateGlueIdentityCenterConfigurationResponse,
    errors: [
      AccessDeniedException,
      ConcurrentModificationException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Updates a partition.
 */
export const updatePartition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdatePartitionRequest,
  output: UpdatePartitionResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Updates the configuration for an existing table optimizer.
 */
export const updateTableOptimizer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTableOptimizerRequest,
    output: UpdateTableOptimizerResponse,
    errors: [
      AccessDeniedException,
      ConcurrentModificationException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates an existing function definition in the Data Catalog.
 */
export const updateUserDefinedFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateUserDefinedFunctionRequest,
    output: UpdateUserDefinedFunctionResponse,
    errors: [
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Cancels the specified recommendation run that was being used to generate rules.
 */
export const cancelDataQualityRuleRecommendationRun =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CancelDataQualityRuleRecommendationRunRequest,
    output: CancelDataQualityRuleRecommendationRunResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Cancels a run where a ruleset is being evaluated against a data source.
 */
export const cancelDataQualityRulesetEvaluationRun =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CancelDataQualityRulesetEvaluationRunRequest,
    output: CancelDataQualityRulesetEvaluationRunResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Cancels (stops) a task run. Machine learning task runs are asynchronous tasks that Glue runs on your behalf as part of various machine learning workflows. You can cancel a
 * machine learning task run at any time by calling `CancelMLTaskRun` with a task
 * run's parent transform's `TransformID` and the task run's `TaskRunId`.
 */
export const cancelMLTaskRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelMLTaskRunRequest,
  output: CancelMLTaskRunResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Cancels the statement.
 */
export const cancelStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelStatementRequest,
  output: CancelStatementResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    IllegalSessionStateException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Validates the supplied schema. This call has no side effects, it simply validates using the supplied schema using `DataFormat` as the format. Since it does not take a schema set name, no compatibility checks are performed.
 */
export const checkSchemaVersionValidity = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CheckSchemaVersionValidityInput,
    output: CheckSchemaVersionValidityResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidInputException,
    ],
  }),
);
/**
 * Creates a classifier in the user's account. This can be a `GrokClassifier`, an
 * `XMLClassifier`, a `JsonClassifier`, or a `CsvClassifier`,
 * depending on which field of the request is present.
 */
export const createClassifier = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClassifierRequest,
  output: CreateClassifierResponse,
  errors: [
    AlreadyExistsException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Creates a new Glue Identity Center configuration to enable integration between Glue and Amazon Web Services IAM
 * Identity Center for authentication and authorization.
 */
export const createGlueIdentityCenterConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateGlueIdentityCenterConfigurationRequest,
    output: CreateGlueIdentityCenterConfigurationResponse,
    errors: [
      AccessDeniedException,
      AlreadyExistsException,
      ConcurrentModificationException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Creates a new partition.
 */
export const createPartition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreatePartitionRequest,
  output: CreatePartitionResponse,
  errors: [
    AlreadyExistsException,
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates a specified partition index in an existing table.
 */
export const createPartitionIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreatePartitionIndexRequest,
    output: CreatePartitionIndexResponse,
    errors: [
      AlreadyExistsException,
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      ResourceNumberLimitExceededException,
    ],
  }),
);
/**
 * Creates a new registry which may be used to hold a collection of schemas.
 */
export const createRegistry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateRegistryInput,
  output: CreateRegistryResponse,
  errors: [
    AccessDeniedException,
    AlreadyExistsException,
    ConcurrentModificationException,
    InternalServiceException,
    InvalidInputException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Deletes an existing blueprint.
 */
export const deleteBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBlueprintRequest,
  output: DeleteBlueprintResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Removes the specified catalog from the Glue Data Catalog.
 *
 * After completing this operation, you no longer have access to the databases, tables (and all table versions and partitions that might belong to the tables) and the user-defined functions in the deleted catalog. Glue deletes these "orphaned" resources asynchronously in a timely manner, at the discretion of the service.
 *
 * To ensure the immediate deletion of all related resources before calling the `DeleteCatalog` operation, use `DeleteTableVersion` (or `BatchDeleteTableVersion`), `DeletePartition` (or `BatchDeletePartition`), `DeleteTable` (or `BatchDeleteTable`), `DeleteUserDefinedFunction` and `DeleteDatabase` to delete any resources that belong to the catalog.
 */
export const deleteCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCatalogRequest,
  output: DeleteCatalogResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    FederationSourceException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Removes a classifier from the Data Catalog.
 */
export const deleteClassifier = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClassifierRequest,
  output: DeleteClassifierResponse,
  errors: [EntityNotFoundException, OperationTimeoutException],
}));
/**
 * Delete the partition column statistics of a column.
 *
 * The Identity and Access Management (IAM) permission required for this operation is `DeletePartition`.
 */
export const deleteColumnStatisticsForPartition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteColumnStatisticsForPartitionRequest,
    output: DeleteColumnStatisticsForPartitionResponse,
    errors: [
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Removes a specified crawler from the Glue Data Catalog, unless the crawler state is
 * `RUNNING`.
 */
export const deleteCrawler = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCrawlerRequest,
  output: DeleteCrawlerResponse,
  errors: [
    CrawlerRunningException,
    EntityNotFoundException,
    OperationTimeoutException,
    SchedulerTransitioningException,
  ],
}));
/**
 * Deletes a custom pattern by specifying its name.
 */
export const deleteCustomEntityType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCustomEntityTypeRequest,
    output: DeleteCustomEntityTypeResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Removes a specified database from a Data Catalog.
 *
 * After completing this operation, you no longer have access to the tables (and all table
 * versions and partitions that might belong to the tables) and the user-defined functions in
 * the deleted database. Glue deletes these "orphaned" resources asynchronously in a timely
 * manner, at the discretion of the service.
 *
 * To ensure the immediate deletion of all related resources, before calling
 * `DeleteDatabase`, use `DeleteTableVersion` or
 * `BatchDeleteTableVersion`, `DeletePartition` or
 * `BatchDeletePartition`, `DeleteUserDefinedFunction`, and
 * `DeleteTable` or `BatchDeleteTable`, to delete any resources that
 * belong to the database.
 */
export const deleteDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDatabaseRequest,
  output: DeleteDatabaseResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * This API is used for deleting the `ResourceProperty` of the Glue connection (for the source) or Glue database ARN (for the target).
 */
export const deleteIntegrationResourceProperty =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteIntegrationResourcePropertyRequest,
    output: DeleteIntegrationResourcePropertyResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServerException,
      InternalServiceException,
      InvalidInputException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes the table properties that have been created for the tables that need to be replicated.
 */
export const deleteIntegrationTableProperties =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteIntegrationTablePropertiesRequest,
    output: DeleteIntegrationTablePropertiesResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServerException,
      InternalServiceException,
      InvalidInputException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Deletes a specified job definition. If the job definition
 * is not found, no exception is thrown.
 */
export const deleteJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteJobRequest,
  output: DeleteJobResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes an Glue machine learning transform. Machine learning transforms are a special
 * type of transform that use machine learning to learn the details of the transformation to be
 * performed by learning from examples provided by humans. These transformations are then saved
 * by Glue. If you no longer need a transform, you can delete it by calling
 * `DeleteMLTransforms`. However, any Glue jobs that still reference the deleted
 * transform will no longer succeed.
 */
export const deleteMLTransform = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteMLTransformRequest,
  output: DeleteMLTransformResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes a specified partition index from an existing table.
 */
export const deletePartitionIndex = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeletePartitionIndexRequest,
    output: DeletePartitionIndexResponse,
    errors: [
      ConflictException,
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Delete the entire registry including schema and all of its versions. To get the status of the delete operation, you can call the `GetRegistry` API after the asynchronous call. Deleting a registry will deactivate all online operations for the registry such as the `UpdateRegistry`, `CreateSchema`, `UpdateSchema`, and `RegisterSchemaVersion` APIs.
 */
export const deleteRegistry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRegistryInput,
  output: DeleteRegistryResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InvalidInputException,
  ],
}));
/**
 * Deletes a specified policy.
 */
export const deleteResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteResourcePolicyRequest,
    output: DeleteResourcePolicyResponse,
    errors: [
      ConditionCheckFailureException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Deletes the session.
 */
export const deleteSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSessionRequest,
  output: DeleteSessionResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    IllegalSessionStateException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes an optimizer and all associated metadata for a table. The optimization will no longer be performed on the table.
 */
export const deleteTableOptimizer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTableOptimizerRequest,
    output: DeleteTableOptimizerResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      ThrottlingException,
    ],
  }),
);
/**
 * Deletes a specified trigger. If the trigger is not found, no
 * exception is thrown.
 */
export const deleteTrigger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTriggerRequest,
  output: DeleteTriggerResponse,
  errors: [
    ConcurrentModificationException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes the Glue specified usage profile.
 */
export const deleteUsageProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUsageProfileRequest,
  output: DeleteUsageProfileResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationNotSupportedException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes a workflow.
 */
export const deleteWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteWorkflowRequest,
  output: DeleteWorkflowResponse,
  errors: [
    ConcurrentModificationException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the details of a blueprint.
 */
export const getBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBlueprintRequest,
  output: GetBlueprintResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the details of blueprint runs for a specified blueprint.
 */
export const getBlueprintRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBlueprintRunsRequest,
  output: GetBlueprintRunsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves all catalogs defined in a catalog in the Glue Data Catalog. For a Redshift-federated catalog use case, this operation returns the list of catalogs mapped to Redshift databases in the Redshift namespace catalog.
 */
export const getCatalogs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCatalogsRequest,
  output: GetCatalogsResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Lists all classifier objects in the Data Catalog.
 */
export const getClassifiers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClassifiersRequest,
  output: GetClassifiersResponse,
  errors: [OperationTimeoutException],
}));
/**
 * Retrieves table statistics of columns.
 *
 * The Identity and Access Management (IAM) permission required for this operation is `GetTable`.
 */
export const getColumnStatisticsForTable = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetColumnStatisticsForTableRequest,
    output: GetColumnStatisticsForTableResponse,
    errors: [
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieves information about all runs associated with the specified table.
 */
export const getColumnStatisticsTaskRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetColumnStatisticsTaskRunsRequest,
    output: GetColumnStatisticsTaskRunsResponse,
    errors: [OperationTimeoutException],
  }),
);
/**
 * Retrieves metadata for a specified crawler.
 */
export const getCrawler = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCrawlerRequest,
  output: GetCrawlerResponse,
  errors: [EntityNotFoundException, OperationTimeoutException],
}));
/**
 * Retrieves metadata for all crawlers defined in the customer
 * account.
 */
export const getCrawlers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCrawlersRequest,
  output: GetCrawlersResponse,
  errors: [OperationTimeoutException],
}));
/**
 * Retrieves the details of a custom pattern by specifying its name.
 */
export const getCustomEntityType = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCustomEntityTypeRequest,
  output: GetCustomEntityTypeResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves all databases defined in a given Data Catalog.
 */
export const getDatabases = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDatabasesRequest,
  output: GetDatabasesResponse,
  errors: [
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the security configuration for a specified catalog.
 */
export const getDataCatalogEncryptionSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDataCatalogEncryptionSettingsRequest,
    output: GetDataCatalogEncryptionSettingsResponse,
    errors: [
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Transforms a Python script into a directed acyclic graph (DAG).
 */
export const getDataflowGraph = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataflowGraphRequest,
  output: GetDataflowGraphResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieve the training status of the model along with more information (CompletedOn, StartedOn, FailureReason).
 */
export const getDataQualityModel = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataQualityModelRequest,
  output: GetDataQualityModelResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Gets the specified recommendation run that was used to generate rules.
 */
export const getDataQualityRuleRecommendationRun =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDataQualityRuleRecommendationRunRequest,
    output: GetDataQualityRuleRecommendationRunResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Returns an existing ruleset by identifier or name.
 */
export const getDataQualityRuleset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataQualityRulesetRequest,
    output: GetDataQualityRulesetResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieves a specific run where a ruleset is evaluated against a data source.
 */
export const getDataQualityRulesetEvaluationRun =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetDataQualityRulesetEvaluationRunRequest,
    output: GetDataQualityRulesetEvaluationRunResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Retrieves information about a specified development endpoint.
 *
 * When you create a development endpoint in a virtual private cloud (VPC), Glue returns only
 * a private IP address, and the public IP address field is not populated. When you create a
 * non-VPC development endpoint, Glue returns only a public IP address.
 */
export const getDevEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDevEndpointRequest,
  output: GetDevEndpointResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves all the development endpoints in this Amazon Web Services account.
 *
 * When you create a development endpoint in a virtual private cloud (VPC), Glue returns only a private IP address
 * and the public IP address field is not populated. When you create a non-VPC development
 * endpoint, Glue returns only a public IP address.
 */
export const getDevEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDevEndpointsRequest,
  output: GetDevEndpointsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * This API is used for fetching the `ResourceProperty` of the Glue connection (for the source) or Glue database ARN (for the target)
 */
export const getIntegrationResourceProperty =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetIntegrationResourcePropertyRequest,
    output: GetIntegrationResourcePropertyResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServerException,
      InternalServiceException,
      InvalidInputException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * This API is used to retrieve optional override properties for the tables that need to be replicated. These properties can include properties for filtering and partition for source and target tables.
 */
export const getIntegrationTableProperties =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetIntegrationTablePropertiesRequest,
    output: GetIntegrationTablePropertiesResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServerException,
      InternalServiceException,
      InvalidInputException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Retrieves an existing job definition.
 */
export const getJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRequest,
  output: GetJobResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves metadata for all runs of a given job definition.
 *
 * `GetJobRuns` returns the job runs in chronological order, with the newest jobs returned first.
 */
export const getJobRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRunsRequest,
  output: GetJobRunsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves all current job definitions.
 */
export const getJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobsRequest,
  output: GetJobsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves information about a specified partition.
 */
export const getPartition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPartitionRequest,
  output: GetPartitionResponse,
  errors: [
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Describes the specified registry in detail.
 */
export const getRegistry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRegistryInput,
  output: GetRegistryResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Retrieves a specified resource policy.
 */
export const getResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePolicyRequest,
  output: GetResourcePolicyResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Describes the specified schema in detail.
 */
export const getSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaInput,
  output: GetSchemaResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Retrieves a schema by the `SchemaDefinition`. The schema definition is sent to the Schema Registry, canonicalized, and hashed. If the hash is matched within the scope of the `SchemaName` or ARN (or the default registry, if none is supplied), that schema’s metadata is returned. Otherwise, a 404 or NotFound error is returned. Schema versions in `Deleted` statuses will not be included in the results.
 */
export const getSchemaByDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSchemaByDefinitionInput,
    output: GetSchemaByDefinitionResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
    ],
  }),
);
/**
 * Fetches the schema version difference in the specified difference type between two stored schema versions in the Schema Registry.
 *
 * This API allows you to compare two schema versions between two schema definitions under the same schema.
 */
export const getSchemaVersionsDiff = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSchemaVersionsDiffInput,
    output: GetSchemaVersionsDiffResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
    ],
  }),
);
/**
 * Retrieves a list of all security configurations.
 */
export const getSecurityConfigurations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSecurityConfigurationsRequest,
    output: GetSecurityConfigurationsResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieves a list of strings that identify available versions of
 * a specified table.
 */
export const getTableVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTableVersionsRequest,
  output: GetTableVersionsResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves a list of tags associated with a resource.
 */
export const getTags = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTagsRequest,
  output: GetTagsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the definition of a trigger.
 */
export const getTrigger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTriggerRequest,
  output: GetTriggerResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Gets all the triggers associated with a job.
 */
export const getTriggers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTriggersRequest,
  output: GetTriggersResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves information about the specified Glue usage profile.
 */
export const getUsageProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUsageProfileRequest,
  output: GetUsageProfileResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationNotSupportedException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves multiple function definitions from the Data Catalog.
 */
export const getUserDefinedFunctions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetUserDefinedFunctionsRequest,
    output: GetUserDefinedFunctionsResponse,
    errors: [
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieves resource metadata for a workflow.
 */
export const getWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRequest,
  output: GetWorkflowResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the workflow run properties which were set during the run.
 */
export const getWorkflowRunProperties = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetWorkflowRunPropertiesRequest,
    output: GetWorkflowRunPropertiesResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieves metadata for all runs of a given workflow.
 */
export const getWorkflowRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRunsRequest,
  output: GetWorkflowRunsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Lists all the blueprint names in an account.
 */
export const listBlueprints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListBlueprintsRequest,
  output: ListBlueprintsResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * List all task runs for a particular account.
 */
export const listColumnStatisticsTaskRuns =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListColumnStatisticsTaskRunsRequest,
    output: ListColumnStatisticsTaskRunsResponse,
    errors: [OperationTimeoutException],
  }));
/**
 * Retrieves the names of all crawler resources in this Amazon Web Services account, or the
 * resources with the specified tag. This operation allows you to see which
 * resources are available in your account, and their names.
 *
 * This operation takes the optional `Tags` field, which you can use as a filter on
 * the response so that tagged resources can be retrieved as a group. If you choose to use tags
 * filtering, only resources with the tag are retrieved.
 */
export const listCrawlers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCrawlersRequest,
  output: ListCrawlersResponse,
  errors: [OperationTimeoutException],
}));
/**
 * Lists all the custom patterns that have been created.
 */
export const listCustomEntityTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListCustomEntityTypesRequest,
    output: ListCustomEntityTypesResponse,
    errors: [
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieves the names of all `DevEndpoint` resources in this Amazon Web Services account, or the
 * resources with the specified tag. This operation allows you to see which resources are
 * available in your account, and their names.
 *
 * This operation takes the optional `Tags` field, which you can use as a filter on
 * the response so that tagged resources can be retrieved as a group. If you choose to use tags
 * filtering, only resources with the tag are retrieved.
 */
export const listDevEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDevEndpointsRequest,
  output: ListDevEndpointsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the names of all job resources in this Amazon Web Services account, or the resources with the specified tag. This operation allows you to see which resources are available in your account, and their names.
 *
 * This operation takes the optional `Tags` field, which you can use as a filter on
 * the response so that tagged resources can be retrieved as a group. If you choose to use tags
 * filtering, only resources with the tag are retrieved.
 */
export const listJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListJobsRequest,
  output: ListJobsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves a sortable, filterable list of existing Glue machine learning transforms in this Amazon Web Services account,
 * or the resources with the specified tag. This operation takes the optional `Tags` field, which you can use as
 * a filter of the responses so that tagged resources can be retrieved as a group. If you choose to use tag
 * filtering, only resources with the tags are retrieved.
 */
export const listMLTransforms = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListMLTransformsRequest,
  output: ListMLTransformsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieve a list of sessions.
 */
export const listSessions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSessionsRequest,
  output: ListSessionsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Lists statements for the session.
 */
export const listStatements = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListStatementsRequest,
  output: ListStatementsResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    IllegalSessionStateException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the names of all trigger resources in this Amazon Web Services account, or the resources with the specified tag. This operation allows you to see which resources are available in your account, and their names.
 *
 * This operation takes the optional `Tags` field, which you can use as a filter on
 * the response so that tagged resources can be retrieved as a group. If you choose to use tags
 * filtering, only resources with the tag are retrieved.
 */
export const listTriggers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTriggersRequest,
  output: ListTriggersResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Lists names of workflows created in the account.
 */
export const listWorkflows = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListWorkflowsRequest,
  output: ListWorkflowsResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Sets the Data Catalog resource policy for access control.
 */
export const putResourcePolicy = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutResourcePolicyRequest,
  output: PutResourcePolicyResponse,
  errors: [
    ConditionCheckFailureException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Puts the specified workflow run properties for the given workflow run. If a property already exists for the specified run, then it overrides the value otherwise adds the property to existing properties.
 */
export const putWorkflowRunProperties = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutWorkflowRunPropertiesRequest,
    output: PutWorkflowRunPropertiesResponse,
    errors: [
      AlreadyExistsException,
      ConcurrentModificationException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      ResourceNumberLimitExceededException,
    ],
  }),
);
/**
 * Adds a new version to the existing schema. Returns an error if new version of schema does not meet the compatibility requirements of the schema set. This API will not create a new schema set and will return a 404 error if the schema set is not already present in the Schema Registry.
 *
 * If this is the first schema definition to be registered in the Schema Registry, this API will store the schema version and return immediately. Otherwise, this call has the potential to run longer than other operations due to compatibility modes. You can call the `GetSchemaVersion` API with the `SchemaVersionId` to check compatibility modes.
 *
 * If the same schema definition is already stored in Schema Registry as a version, the schema ID of the existing schema is returned to the caller.
 */
export const registerSchemaVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterSchemaVersionInput,
    output: RegisterSchemaVersionResponse,
    errors: [
      AccessDeniedException,
      ConcurrentModificationException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      ResourceNumberLimitExceededException,
    ],
  }),
);
/**
 * Removes a key value pair from the schema version metadata for the specified schema version ID.
 */
export const removeSchemaVersionMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RemoveSchemaVersionMetadataInput,
    output: RemoveSchemaVersionMetadataResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InvalidInputException,
    ],
  }),
);
/**
 * Resets a bookmark entry.
 *
 * For more information about enabling and using job bookmarks, see:
 *
 * - Tracking processed data using job bookmarks
 *
 * - Job parameters used by Glue
 *
 * - Job structure
 */
export const resetJobBookmark = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetJobBookmarkRequest,
  output: ResetJobBookmarkResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Executes the statement.
 */
export const runStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RunStatementRequest,
  output: RunStatementResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    IllegalSessionStateException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
    ValidationException,
  ],
}));
/**
 * Starts a column statistics task run, for a specified table and columns.
 */
export const startColumnStatisticsTaskRun =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartColumnStatisticsTaskRunRequest,
    output: StartColumnStatisticsTaskRunResponse,
    errors: [
      AccessDeniedException,
      ColumnStatisticsTaskRunningException,
      EntityNotFoundException,
      InvalidInputException,
      OperationTimeoutException,
      ResourceNumberLimitExceededException,
    ],
  }));
/**
 * Begins an asynchronous task to export all labeled data for a particular transform. This
 * task is the only label-related API call that is not part of the typical active learning
 * workflow. You typically use `StartExportLabelsTaskRun` when you want to work with
 * all of your existing labels at the same time, such as when you want to remove or change labels
 * that were previously submitted as truth. This API operation accepts the
 * `TransformId` whose labels you want to export and an Amazon Simple Storage
 * Service (Amazon S3) path to export the labels to. The operation returns a
 * `TaskRunId`. You can check on the status of your task run by calling the
 * `GetMLTaskRun` API.
 */
export const startExportLabelsTaskRun = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartExportLabelsTaskRunRequest,
    output: StartExportLabelsTaskRunResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Enables you to provide additional labels (examples of truth) to be used to teach the
 * machine learning transform and improve its quality. This API operation is generally used as
 * part of the active learning workflow that starts with the
 * `StartMLLabelingSetGenerationTaskRun` call and that ultimately results in
 * improving the quality of your machine learning transform.
 *
 * After the `StartMLLabelingSetGenerationTaskRun` finishes, Glue machine learning
 * will have generated a series of questions for humans to answer. (Answering these questions is
 * often called 'labeling' in the machine learning workflows). In the case of the
 * `FindMatches` transform, these questions are of the form, “What is the correct
 * way to group these rows together into groups composed entirely of matching records?” After the
 * labeling process is finished, users upload their answers/labels with a call to
 * `StartImportLabelsTaskRun`. After `StartImportLabelsTaskRun` finishes,
 * all future runs of the machine learning transform use the new and improved labels and perform
 * a higher-quality transformation.
 *
 * By default, `StartMLLabelingSetGenerationTaskRun` continually learns from and
 * combines all labels that you upload unless you set `Replace` to true. If you set
 * `Replace` to true, `StartImportLabelsTaskRun` deletes and forgets all
 * previously uploaded labels and learns only from the exact set that you upload. Replacing
 * labels can be helpful if you realize that you previously uploaded incorrect labels, and you
 * believe that they are having a negative effect on your transform quality.
 *
 * You can check on the status of your task run by calling the `GetMLTaskRun`
 * operation.
 */
export const startImportLabelsTaskRun = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartImportLabelsTaskRunRequest,
    output: StartImportLabelsTaskRunResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      ResourceNumberLimitExceededException,
    ],
  }),
);
/**
 * Starts a job run using a job definition.
 */
export const startJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartJobRunRequest,
  output: StartJobRunResponse,
  errors: [
    ConcurrentRunsExceededException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Starts the active learning workflow for your machine learning transform to improve the
 * transform's quality by generating label sets and adding labels.
 *
 * When the `StartMLLabelingSetGenerationTaskRun` finishes, Glue will have
 * generated a "labeling set" or a set of questions for humans to answer.
 *
 * In the case of the `FindMatches` transform, these questions are of the form,
 * “What is the correct way to group these rows together into groups composed entirely of
 * matching records?”
 *
 * After the labeling process is finished, you can upload your labels with a call to
 * `StartImportLabelsTaskRun`. After `StartImportLabelsTaskRun` finishes,
 * all future runs of the machine learning transform will use the new and improved labels and
 * perform a higher-quality transformation.
 *
 * Note: The role used to write the generated labeling set to the `OutputS3Path` is the role
 * associated with the Machine Learning Transform, specified in the `CreateMLTransform` API.
 */
export const startMLLabelingSetGenerationTaskRun =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartMLLabelingSetGenerationTaskRunRequest,
    output: StartMLLabelingSetGenerationTaskRunResponse,
    errors: [
      ConcurrentRunsExceededException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Starts an existing trigger. See Triggering
 * Jobs for information about how different types of trigger are
 * started.
 */
export const startTrigger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTriggerRequest,
  output: StartTriggerResponse,
  errors: [
    ConcurrentRunsExceededException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Starts a new run of the specified workflow.
 */
export const startWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartWorkflowRunRequest,
  output: StartWorkflowRunResponse,
  errors: [
    ConcurrentRunsExceededException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Sets the schedule state of the specified crawler to
 * `NOT_SCHEDULED`, but does not stop the crawler if it is
 * already running.
 */
export const stopCrawlerSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopCrawlerScheduleRequest,
  output: StopCrawlerScheduleResponse,
  errors: [
    EntityNotFoundException,
    OperationTimeoutException,
    SchedulerNotRunningException,
    SchedulerTransitioningException,
  ],
}));
/**
 * Stops the session.
 */
export const stopSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopSessionRequest,
  output: StopSessionResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    IllegalSessionStateException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Stops a specified trigger.
 */
export const stopTrigger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopTriggerRequest,
  output: StopTriggerResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Stops the execution of the specified workflow run.
 */
export const stopWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopWorkflowRunRequest,
  output: StopWorkflowRunResponse,
  errors: [
    EntityNotFoundException,
    IllegalWorkflowStateException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Tests a connection to a service to validate the service credentials that you provide.
 *
 * You can either provide an existing connection name or a `TestConnectionInput` for testing a non-existing connection input. Providing both at the same time will cause an error.
 *
 * If the action is successful, the service sends back an HTTP 200 response.
 */
export const testConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestConnectionRequest,
  output: TestConnectionResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    EntityNotFoundException,
    FederationSourceException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Updates a registered blueprint.
 */
export const updateBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateBlueprintRequest,
  output: UpdateBlueprintResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    IllegalBlueprintStateException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Modifies an existing classifier (a `GrokClassifier`,
 * an `XMLClassifier`, a `JsonClassifier`, or a `CsvClassifier`, depending on
 * which field is present).
 */
export const updateClassifier = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClassifierRequest,
  output: UpdateClassifierResponse,
  errors: [
    EntityNotFoundException,
    InvalidInputException,
    OperationTimeoutException,
    VersionMismatchException,
  ],
}));
/**
 * Updates settings for a column statistics task.
 */
export const updateColumnStatisticsTaskSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateColumnStatisticsTaskSettingsRequest,
    output: UpdateColumnStatisticsTaskSettingsResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InvalidInputException,
      OperationTimeoutException,
      VersionMismatchException,
    ],
  }));
/**
 * Updates the schedule of a crawler using a `cron` expression.
 */
export const updateCrawlerSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCrawlerScheduleRequest,
    output: UpdateCrawlerScheduleResponse,
    errors: [
      EntityNotFoundException,
      InvalidInputException,
      OperationTimeoutException,
      SchedulerTransitioningException,
      VersionMismatchException,
    ],
  }),
);
/**
 * Updates the specified data quality ruleset.
 */
export const updateDataQualityRuleset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateDataQualityRulesetRequest,
    output: UpdateDataQualityRulesetResponse,
    errors: [
      AlreadyExistsException,
      EntityNotFoundException,
      IdempotentParameterMismatchException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      ResourceNumberLimitExceededException,
    ],
  }),
);
/**
 * Updates a specified development endpoint.
 */
export const updateDevEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateDevEndpointRequest,
  output: UpdateDevEndpointResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ValidationException,
  ],
}));
/**
 * This API can be used for updating the `ResourceProperty` of the Glue connection (for the source) or Glue database ARN (for the target). These properties can include the role to access the connection or database. Since the same resource can be used across multiple integrations, updating resource properties will impact all the integrations using it.
 */
export const updateIntegrationResourceProperty =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateIntegrationResourcePropertyRequest,
    output: UpdateIntegrationResourcePropertyResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServerException,
      InternalServiceException,
      InvalidInputException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * This API is used to provide optional override properties for the tables that need to be replicated. These properties can include properties for filtering and partitioning for the source and target tables. To set both source and target properties the same API need to be invoked with the Glue connection ARN as `ResourceArn` with `SourceTableConfig`, and the Glue database ARN as `ResourceArn` with `TargetTableConfig` respectively.
 *
 * The override will be reflected across all the integrations using same `ResourceArn` and source table.
 */
export const updateIntegrationTableProperties =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateIntegrationTablePropertiesRequest,
    output: UpdateIntegrationTablePropertiesResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServerException,
      InternalServiceException,
      InvalidInputException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Synchronizes a job from the source control repository. This operation takes the job artifacts that are located in the remote repository and updates the Glue internal stores with these artifacts.
 *
 * This API supports optional parameters which take in the repository information.
 */
export const updateJobFromSourceControl = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateJobFromSourceControlRequest,
    output: UpdateJobFromSourceControlResponse,
    errors: [
      AccessDeniedException,
      AlreadyExistsException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      ValidationException,
    ],
  }),
);
/**
 * Updates an existing machine learning transform. Call this operation to tune the algorithm parameters to achieve better results.
 *
 * After calling this operation, you can call the `StartMLEvaluationTaskRun`
 * operation to assess how well your new parameters achieved your goals (such as improving the
 * quality of your machine learning transform, or making it more cost-effective).
 */
export const updateMLTransform = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateMLTransformRequest,
  output: UpdateMLTransformResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Updates an existing registry which is used to hold a collection of schemas. The updated properties relate to the registry, and do not modify any of the schemas within the registry.
 */
export const updateRegistry = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateRegistryInput,
  output: UpdateRegistryResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Updates the description, compatibility setting, or version checkpoint for a schema set.
 *
 * For updating the compatibility setting, the call will not validate compatibility for the entire set of schema versions with the new compatibility setting. If the value for `Compatibility` is provided, the `VersionNumber` (a checkpoint) is also required. The API will validate the checkpoint version number for consistency.
 *
 * If the value for the `VersionNumber` (checkpoint) is provided, `Compatibility` is optional and this can be used to set/reset a checkpoint for the schema.
 *
 * This update will happen only if the schema is in the AVAILABLE state.
 */
export const updateSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSchemaInput,
  output: UpdateSchemaResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Synchronizes a job to the source control repository. This operation takes the job artifacts from the Glue internal stores and makes a commit to the remote repository that is configured on the job.
 *
 * This API supports optional parameters which take in the repository information.
 */
export const updateSourceControlFromJob = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateSourceControlFromJobRequest,
    output: UpdateSourceControlFromJobResponse,
    errors: [
      AccessDeniedException,
      AlreadyExistsException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      ValidationException,
    ],
  }),
);
/**
 * Update an Glue usage profile.
 */
export const updateUsageProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUsageProfileRequest,
  output: UpdateUsageProfileResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationNotSupportedException,
    OperationTimeoutException,
  ],
}));
/**
 * Updates an existing workflow.
 */
export const updateWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateWorkflowRequest,
  output: UpdateWorkflowResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes multiple tables at once.
 *
 * After completing this operation, you no longer have access to the table versions and
 * partitions that belong to the deleted table. Glue deletes these "orphaned" resources
 * asynchronously in a timely manner, at the discretion of the service.
 *
 * To ensure the immediate deletion of all related resources, before calling
 * `BatchDeleteTable`, use `DeleteTableVersion` or
 * `BatchDeleteTableVersion`, and `DeletePartition` or
 * `BatchDeletePartition`, to delete any resources that belong to the
 * table.
 */
export const batchDeleteTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteTableRequest,
  output: BatchDeleteTableResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNotReadyException,
  ],
}));
/**
 * Deletes a specified batch of versions of a table.
 */
export const batchDeleteTableVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteTableVersionRequest,
    output: BatchDeleteTableVersionResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieves the details for the custom patterns specified by a list of names.
 */
export const batchGetCustomEntityTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetCustomEntityTypesRequest,
    output: BatchGetCustomEntityTypesResponse,
    errors: [
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieves a list of data quality results for the specified result IDs.
 */
export const batchGetDataQualityResult = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetDataQualityResultRequest,
    output: BatchGetDataQualityResultResponse,
    errors: [
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Returns a list of resource metadata for a given list of development endpoint names. After
 * calling the `ListDevEndpoints` operation, you can call this operation to access the
 * data to which you have been granted permissions. This operation supports all IAM permissions,
 * including permission conditions that uses tags.
 */
export const batchGetDevEndpoints = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetDevEndpointsRequest,
    output: BatchGetDevEndpointsResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Returns a list of resource metadata for a given list of job names. After calling the `ListJobs` operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
 */
export const batchGetJobs = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetJobsRequest,
  output: BatchGetJobsResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Returns a list of resource metadata for a given list of trigger names. After calling the `ListTriggers` operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
 */
export const batchGetTriggers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetTriggersRequest,
  output: BatchGetTriggersResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Stops one or more job runs for a specified job definition.
 */
export const batchStopJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchStopJobRunRequest,
  output: BatchStopJobRunResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Registers a blueprint with Glue.
 */
export const createBlueprint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateBlueprintRequest,
  output: CreateBlueprintResponse,
  errors: [
    AlreadyExistsException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates settings for a column statistics task.
 */
export const createColumnStatisticsTaskSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateColumnStatisticsTaskSettingsRequest,
    output: CreateColumnStatisticsTaskSettingsResponse,
    errors: [
      AccessDeniedException,
      AlreadyExistsException,
      ColumnStatisticsTaskRunningException,
      EntityNotFoundException,
      InvalidInputException,
      OperationTimeoutException,
      ResourceNumberLimitExceededException,
    ],
  }));
/**
 * Creates a new crawler with specified targets, role, configuration, and optional schedule.
 * At least one crawl target must be specified, in the `s3Targets` field, the
 * `jdbcTargets` field, or the `DynamoDBTargets` field.
 */
export const createCrawler = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCrawlerRequest,
  output: CreateCrawlerResponse,
  errors: [
    AlreadyExistsException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates a custom pattern that is used to detect sensitive data across the columns and rows of your structured data.
 *
 * Each custom pattern you create specifies a regular expression and an optional list of context words. If no context words are passed only a regular expression is checked.
 */
export const createCustomEntityType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCustomEntityTypeRequest,
    output: CreateCustomEntityTypeResponse,
    errors: [
      AccessDeniedException,
      AlreadyExistsException,
      IdempotentParameterMismatchException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      ResourceNumberLimitExceededException,
    ],
  }),
);
/**
 * Creates a data quality ruleset with DQDL rules applied to a specified Glue table.
 *
 * You create the ruleset using the Data Quality Definition Language (DQDL). For more information, see the Glue developer guide.
 */
export const createDataQualityRuleset = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateDataQualityRulesetRequest,
    output: CreateDataQualityRulesetResponse,
    errors: [
      AlreadyExistsException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      ResourceNumberLimitExceededException,
    ],
  }),
);
/**
 * Creates a new development endpoint.
 */
export const createDevEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDevEndpointRequest,
  output: CreateDevEndpointResponse,
  errors: [
    AccessDeniedException,
    AlreadyExistsException,
    IdempotentParameterMismatchException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
    ValidationException,
  ],
}));
/**
 * This API can be used for setting up the `ResourceProperty` of the Glue connection (for the source) or Glue database ARN (for the target). These properties can include the role to access the connection or database. To set both source and target properties the same API needs to be invoked with the Glue connection ARN as `ResourceArn` with `SourceProcessingProperties` and the Glue database ARN as `ResourceArn` with `TargetProcessingProperties` respectively.
 */
export const createIntegrationResourceProperty =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateIntegrationResourcePropertyRequest,
    output: CreateIntegrationResourcePropertyResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      EntityNotFoundException,
      InternalServerException,
      InternalServiceException,
      InvalidInputException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * This API is used to provide optional override properties for the the tables that need to be replicated. These properties can include properties for filtering and partitioning for the source and target tables. To set both source and target properties the same API need to be invoked with the Glue connection ARN as `ResourceArn` with `SourceTableConfig`, and the Glue database ARN as `ResourceArn` with `TargetTableConfig` respectively.
 */
export const createIntegrationTableProperties =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: CreateIntegrationTablePropertiesRequest,
    output: CreateIntegrationTablePropertiesResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServerException,
      InternalServiceException,
      InvalidInputException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Creates a new schema set and registers the schema definition. Returns an error if the schema set already exists without actually registering the version.
 *
 * When the schema set is created, a version checkpoint will be set to the first version. Compatibility mode "DISABLED" restricts any additional schema versions from being added after the first schema version. For all other compatibility modes, validation of compatibility settings will be applied only from the second version onwards when the `RegisterSchemaVersion` API is used.
 *
 * When this API is called without a `RegistryId`, this will create an entry for a "default-registry" in the registry database tables, if it is not already present.
 */
export const createSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSchemaInput,
  output: CreateSchemaResponse,
  errors: [
    AccessDeniedException,
    AlreadyExistsException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates a new session.
 */
export const createSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSessionRequest,
  output: CreateSessionResponse,
  errors: [
    AccessDeniedException,
    AlreadyExistsException,
    IdempotentParameterMismatchException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new function definition in the Data Catalog.
 */
export const createUserDefinedFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateUserDefinedFunctionRequest,
    output: CreateUserDefinedFunctionResponse,
    errors: [
      AlreadyExistsException,
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      ResourceNumberLimitExceededException,
    ],
  }),
);
/**
 * Creates a new workflow.
 */
export const createWorkflow = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateWorkflowRequest,
  output: CreateWorkflowResponse,
  errors: [
    AlreadyExistsException,
    ConcurrentModificationException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Deletes the entire schema set, including the schema set and all of its versions. To get the status of the delete operation, you can call `GetSchema` API after the asynchronous call. Deleting a registry will deactivate all online operations for the schema, such as the `GetSchemaByDefinition`, and `RegisterSchemaVersion` APIs.
 */
export const deleteSchema = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSchemaInput,
  output: DeleteSchemaResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InvalidInputException,
  ],
}));
/**
 * Removes a table definition from the Data Catalog.
 *
 * After completing this operation, you no longer have access to the table versions and
 * partitions that belong to the deleted table. Glue deletes these "orphaned" resources
 * asynchronously in a timely manner, at the discretion of the service.
 *
 * To ensure the immediate deletion of all related resources, before calling
 * `DeleteTable`, use `DeleteTableVersion` or
 * `BatchDeleteTableVersion`, and `DeletePartition` or
 * `BatchDeletePartition`, to delete any resources that belong to the
 * table.
 */
export const deleteTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTableRequest,
  output: DeleteTableResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNotReadyException,
  ],
}));
/**
 * Retrieves the details of a blueprint run.
 */
export const getBlueprintRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetBlueprintRunRequest,
  output: GetBlueprintRunResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the status of a migration operation.
 */
export const getCatalogImportStatus = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetCatalogImportStatusRequest,
    output: GetCatalogImportStatusResponse,
    errors: [InternalServiceException, OperationTimeoutException],
  }),
);
/**
 * Retrieves partition statistics of columns.
 *
 * The Identity and Access Management (IAM) permission required for this operation is `GetPartition`.
 */
export const getColumnStatisticsForPartition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetColumnStatisticsForPartitionRequest,
    output: GetColumnStatisticsForPartitionResponse,
    errors: [
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Get the associated metadata/information for a task run, given a task run ID.
 */
export const getColumnStatisticsTaskRun = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetColumnStatisticsTaskRunRequest,
    output: GetColumnStatisticsTaskRunResponse,
    errors: [
      EntityNotFoundException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieves a list of connection definitions from the Data Catalog.
 */
export const getConnections = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionsRequest,
  output: GetConnectionsResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves metrics about specified crawlers.
 */
export const getCrawlerMetrics = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCrawlerMetricsRequest,
  output: GetCrawlerMetricsResponse,
  errors: [OperationTimeoutException],
}));
/**
 * Retrieves the definition of a specified database.
 */
export const getDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDatabaseRequest,
  output: GetDatabaseResponse,
  errors: [
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieve a statistic's predictions for a given Profile ID.
 */
export const getDataQualityModelResult = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataQualityModelResultRequest,
    output: GetDataQualityModelResultResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * This API is used to query preview data from a given connection type or from a native Amazon S3 based Glue Data Catalog.
 *
 * Returns records as an array of JSON blobs. Each record is formatted using Jackson JsonNode based on the field type defined by the `DescribeEntity` API.
 *
 * Spark connectors generate schemas according to the same data type mapping as in the `DescribeEntity` API. Spark connectors convert data to the appropriate data types matching the schema when returning rows.
 */
export const getEntityRecords = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEntityRecordsRequest,
  output: GetEntityRecordsResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    FederationSourceException,
    GlueEncryptionException,
    InvalidInputException,
    OperationTimeoutException,
    ValidationException,
  ],
}));
/**
 * Returns information on a job bookmark entry.
 *
 * For more information about enabling and using job bookmarks, see:
 *
 * - Tracking processed data using job bookmarks
 *
 * - Job parameters used by Glue
 *
 * - Job structure
 */
export const getJobBookmark = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobBookmarkRequest,
  output: GetJobBookmarkResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ValidationException,
  ],
}));
/**
 * Creates mappings.
 */
export const getMapping = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMappingRequest,
  output: GetMappingResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves information about the partitions in a table.
 */
export const getPartitions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPartitionsRequest,
  output: GetPartitionsResponse,
  errors: [
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    InvalidStateException,
    OperationTimeoutException,
    ResourceNotReadyException,
  ],
}));
/**
 * Gets code to perform a specified mapping.
 */
export const getPlan = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPlanRequest,
  output: GetPlanResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the resource policies set on individual resources by Resource Access Manager
 * during cross-account permission grants. Also retrieves the Data Catalog resource
 * policy.
 *
 * If you enabled metadata encryption in Data Catalog settings, and you do not have
 * permission on the KMS key, the operation can't return the Data Catalog resource
 * policy.
 */
export const getResourcePolicies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetResourcePoliciesRequest,
  output: GetResourcePoliciesResponse,
  errors: [
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Get the specified schema by its unique ID assigned when a version of the schema is created or registered. Schema versions in Deleted status will not be included in the results.
 */
export const getSchemaVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaVersionInput,
  output: GetSchemaVersionResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Retrieves a specified security configuration.
 */
export const getSecurityConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetSecurityConfigurationRequest,
    output: GetSecurityConfigurationResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieves the session.
 */
export const getSession = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSessionRequest,
  output: GetSessionResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the `Table` definition in a Data Catalog for
 * a specified table.
 */
export const getTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTableRequest,
  output: GetTableResponse,
  errors: [
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNotReadyException,
  ],
}));
/**
 * Returns the configuration of all optimizers associated with a specified table.
 */
export const getTableOptimizer = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTableOptimizerRequest,
  output: GetTableOptimizerResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a specified version of a table.
 */
export const getTableVersion = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTableVersionRequest,
  output: GetTableVersionResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves a specified function definition from the Data Catalog.
 */
export const getUserDefinedFunction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetUserDefinedFunctionRequest,
    output: GetUserDefinedFunctionResponse,
    errors: [
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Returns the available entities supported by the connection type.
 */
export const listEntities = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListEntitiesRequest,
  output: ListEntitiesResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    FederationSourceException,
    GlueEncryptionException,
    InvalidInputException,
    OperationTimeoutException,
    ValidationException,
  ],
}));
/**
 * Returns a list of registries that you have created, with minimal registry information. Registries in the `Deleting` status will not be included in the results. Empty results will be returned if there are no registries available.
 */
export const listRegistries = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListRegistriesInput,
  output: ListRegistriesResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Returns a list of schemas with minimal details. Schemas in Deleting status will not be included in the results. Empty results will be returned if there are no schemas available.
 *
 * When the `RegistryId` is not provided, all the schemas across registries will be part of the API response.
 */
export const listSchemas = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSchemasInput,
  output: ListSchemasResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Returns a list of schema versions that you have created, with minimal information. Schema versions in Deleted status will not be included in the results. Empty results will be returned if there are no schema versions available.
 */
export const listSchemaVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListSchemaVersionsInput,
  output: ListSchemaVersionsResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * List all the Glue usage profiles.
 */
export const listUsageProfiles = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListUsageProfilesRequest,
  output: ListUsageProfilesResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationNotSupportedException,
    OperationTimeoutException,
  ],
}));
/**
 * Sets the security configuration for a specified catalog. After the configuration has been
 * set, the specified encryption is applied to every catalog write thereafter.
 */
export const putDataCatalogEncryptionSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: PutDataCatalogEncryptionSettingsRequest,
    output: PutDataCatalogEncryptionSettingsResponse,
    errors: [
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Puts the metadata key value pair for a specified schema version ID. A maximum of 10 key value pairs will be allowed per schema version. They can be added over one or more calls.
 */
export const putSchemaVersionMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutSchemaVersionMetadataInput,
    output: PutSchemaVersionMetadataResponse,
    errors: [
      AccessDeniedException,
      AlreadyExistsException,
      EntityNotFoundException,
      InvalidInputException,
      ResourceNumberLimitExceededException,
    ],
  }),
);
/**
 * Restarts selected nodes of a previous partially completed workflow run and resumes the workflow run. The selected nodes and all nodes that are downstream from the selected nodes are run.
 */
export const resumeWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResumeWorkflowRunRequest,
  output: ResumeWorkflowRunResponse,
  errors: [
    ConcurrentRunsExceededException,
    EntityNotFoundException,
    IllegalWorkflowStateException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Searches a set of tables based on properties in the table metadata as well as on the parent database. You can search against text or filter conditions.
 *
 * You can only get tables that you have access to based on the security policies defined in Lake Formation. You need at least a read-only access to the table for it to be returned. If you do not have access to all the columns in the table, these columns will not be searched against when returning the list of tables back to you. If you have access to the columns but not the data in the columns, those columns and the associated metadata for those columns will be included in the search.
 */
export const searchTables = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: SearchTablesRequest,
  output: SearchTablesResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Starts a new run of the specified blueprint.
 */
export const startBlueprintRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartBlueprintRunRequest,
  output: StartBlueprintRunResponse,
  errors: [
    EntityNotFoundException,
    IllegalBlueprintStateException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Changes the schedule state of the specified crawler to
 * `SCHEDULED`, unless the crawler is already running or the
 * schedule state is already `SCHEDULED`.
 */
export const startCrawlerSchedule = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartCrawlerScheduleRequest,
    output: StartCrawlerScheduleResponse,
    errors: [
      EntityNotFoundException,
      NoScheduleException,
      OperationTimeoutException,
      SchedulerRunningException,
      SchedulerTransitioningException,
    ],
  }),
);
/**
 * Once you have a ruleset definition (either recommended or your own), you call this operation to evaluate the ruleset against a data source (Glue table). The evaluation computes results which you can retrieve with the `GetDataQualityResult` API.
 */
export const startDataQualityRulesetEvaluationRun =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartDataQualityRulesetEvaluationRunRequest,
    output: StartDataQualityRulesetEvaluationRunResponse,
    errors: [
      ConflictException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Starts a task to estimate the quality of the transform.
 *
 * When you provide label sets as examples of truth, Glue machine learning uses some of
 * those examples to learn from them. The rest of the labels are used as a test to estimate
 * quality.
 *
 * Returns a unique identifier for the run. You can call `GetMLTaskRun` to get more
 * information about the stats of the `EvaluationTaskRun`.
 */
export const startMLEvaluationTaskRun = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StartMLEvaluationTaskRunRequest,
    output: StartMLEvaluationTaskRunResponse,
    errors: [
      ConcurrentRunsExceededException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      MLTransformNotReadyException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Stops a task run for the specified table.
 */
export const stopColumnStatisticsTaskRun = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopColumnStatisticsTaskRunRequest,
    output: StopColumnStatisticsTaskRunResponse,
    errors: [
      ColumnStatisticsTaskNotRunningException,
      ColumnStatisticsTaskStoppingException,
      EntityNotFoundException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * If the specified crawler is running, stops the crawl.
 */
export const stopCrawler = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopCrawlerRequest,
  output: StopCrawlerResponse,
  errors: [
    CrawlerNotRunningException,
    CrawlerStoppingException,
    EntityNotFoundException,
    OperationTimeoutException,
  ],
}));
/**
 * Creates or updates table statistics of columns.
 *
 * The Identity and Access Management (IAM) permission required for this operation is `UpdateTable`.
 */
export const updateColumnStatisticsForTable =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateColumnStatisticsForTableRequest,
    output: UpdateColumnStatisticsForTableResponse,
    errors: [
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Updates an existing job definition. The previous job definition is completely overwritten by this information.
 */
export const updateJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateJobRequest,
  output: UpdateJobResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Updates a trigger definition.
 *
 * Job arguments may be logged. Do not pass plaintext secrets as arguments. Retrieve secrets from a Glue Connection, Amazon Web Services Secrets Manager or other secret management mechanism if you intend to keep them within the Job.
 */
export const updateTrigger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTriggerRequest,
  output: UpdateTriggerResponse,
  errors: [
    ConcurrentModificationException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes a list of connection definitions from the Data Catalog.
 */
export const batchDeleteConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeleteConnectionRequest,
    output: BatchDeleteConnectionResponse,
    errors: [InternalServiceException, OperationTimeoutException],
  }),
);
/**
 * Deletes one or more partitions in a batch operation.
 */
export const batchDeletePartition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchDeletePartitionRequest,
    output: BatchDeletePartitionResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieves information about a list of blueprints.
 */
export const batchGetBlueprints = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetBlueprintsRequest,
  output: BatchGetBlueprintsResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Returns a list of resource metadata for a given list of crawler names. After calling the `ListCrawlers` operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
 */
export const batchGetCrawlers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetCrawlersRequest,
  output: BatchGetCrawlersResponse,
  errors: [InvalidInputException, OperationTimeoutException],
}));
/**
 * Retrieves partitions in a batch request.
 */
export const batchGetPartition = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetPartitionRequest,
  output: BatchGetPartitionResponse,
  errors: [
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    InvalidStateException,
    OperationTimeoutException,
  ],
}));
/**
 * Returns the configuration for the specified table optimizers.
 */
export const batchGetTableOptimizer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchGetTableOptimizerRequest,
    output: BatchGetTableOptimizerResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      ThrottlingException,
    ],
  }),
);
/**
 * Annotate datapoints over time for a specific data quality statistic.
 * The API requires both profileID and statisticID as part of the InclusionAnnotation input.
 * The API only works for a single statisticId across multiple profiles.
 */
export const batchPutDataQualityStatisticAnnotation =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: BatchPutDataQualityStatisticAnnotationRequest,
    output: BatchPutDataQualityStatisticAnnotationResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      ResourceNumberLimitExceededException,
    ],
  }));
/**
 * Updates one or more partitions in a batch operation.
 */
export const batchUpdatePartition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchUpdatePartitionRequest,
    output: BatchUpdatePartitionResponse,
    errors: [
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Creates a new catalog in the Glue Data Catalog.
 */
export const createCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCatalogRequest,
  output: CreateCatalogResponse,
  errors: [
    AccessDeniedException,
    AlreadyExistsException,
    ConcurrentModificationException,
    EntityNotFoundException,
    FederatedResourceAlreadyExistsException,
    FederationSourceException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates a new database in a Data Catalog.
 */
export const createDatabase = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDatabaseRequest,
  output: CreateDatabaseResponse,
  errors: [
    AlreadyExistsException,
    ConcurrentModificationException,
    FederatedResourceAlreadyExistsException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates an Glue machine learning transform. This operation creates the transform and
 * all the necessary parameters to train it.
 *
 * Call this operation as the first step in the process of using a machine learning transform
 * (such as the `FindMatches` transform) for deduplicating data. You can provide an
 * optional `Description`, in addition to the parameters that you want to use for your
 * algorithm.
 *
 * You must also specify certain parameters for the tasks that Glue runs on your
 * behalf as part of learning from your data and creating a high-quality machine learning
 * transform. These parameters include `Role`, and optionally,
 * `AllocatedCapacity`, `Timeout`, and `MaxRetries`. For more
 * information, see Jobs.
 */
export const createMLTransform = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateMLTransformRequest,
  output: CreateMLTransformResponse,
  errors: [
    AccessDeniedException,
    AlreadyExistsException,
    IdempotentParameterMismatchException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Transforms a directed acyclic graph (DAG) into code.
 */
export const createScript = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateScriptRequest,
  output: CreateScriptResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Creates a new security configuration. A security configuration is a set of security properties that can be used by Glue. You can use a security configuration to encrypt data at rest. For information about using security configurations in Glue, see Encrypting Data Written by Crawlers, Jobs, and Development Endpoints.
 */
export const createSecurityConfiguration = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateSecurityConfigurationRequest,
    output: CreateSecurityConfigurationResponse,
    errors: [
      AlreadyExistsException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      ResourceNumberLimitExceededException,
    ],
  }),
);
/**
 * Creates a new table optimizer for a specific function.
 */
export const createTableOptimizer = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateTableOptimizerRequest,
    output: CreateTableOptimizerResponse,
    errors: [
      AccessDeniedException,
      AlreadyExistsException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Creates a new trigger.
 *
 * Job arguments may be logged. Do not pass plaintext secrets as arguments. Retrieve secrets from a Glue Connection, Amazon Web Services Secrets Manager or other secret management mechanism if you intend to keep them within the Job.
 */
export const createTrigger = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTriggerRequest,
  output: CreateTriggerResponse,
  errors: [
    AlreadyExistsException,
    ConcurrentModificationException,
    EntityNotFoundException,
    IdempotentParameterMismatchException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Deletes the specified Zero-ETL integration.
 */
export const deleteIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteIntegrationRequest,
  output: DeleteIntegrationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    EntityNotFoundException,
    IntegrationConflictOperationFault,
    IntegrationNotFoundFault,
    InternalServerException,
    InternalServiceException,
    InvalidInputException,
    InvalidIntegrationStateFault,
    InvalidStateException,
    ValidationException,
  ],
}));
/**
 * Remove versions from the specified schema. A version number or range may be supplied. If the compatibility mode forbids deleting of a version that is necessary, such as BACKWARDS_FULL, an error is returned. Calling the `GetSchemaVersions` API after this call will list the status of the deleted versions.
 *
 * When the range of version numbers contain check pointed version, the API will return a 409 conflict and will not proceed with the deletion. You have to remove the checkpoint first using the `DeleteSchemaCheckpoint` API before using this API.
 *
 * You cannot use the `DeleteSchemaVersions` API to delete the first schema version in the schema set. The first schema version can only be deleted by the `DeleteSchema` API. This operation will also delete the attached `SchemaVersionMetadata` under the schema versions. Hard deletes will be enforced on the database.
 *
 * If the compatibility mode forbids deleting of a version that is necessary, such as BACKWARDS_FULL, an error is returned.
 */
export const deleteSchemaVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteSchemaVersionsInput,
    output: DeleteSchemaVersionsResponse,
    errors: [
      AccessDeniedException,
      ConcurrentModificationException,
      EntityNotFoundException,
      InvalidInputException,
    ],
  }),
);
/**
 * Provides details regarding the entity used with the connection type, with a description of the data model for each field in the selected entity.
 *
 * The response includes all the fields which make up the entity.
 */
export const describeEntity = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEntityRequest,
  output: DescribeEntityResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    FederationSourceException,
    GlueEncryptionException,
    InvalidInputException,
    OperationTimeoutException,
    ValidationException,
  ],
}));
/**
 * Returns a list of inbound integrations for the specified integration.
 */
export const describeInboundIntegrations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeInboundIntegrationsRequest,
    output: DescribeInboundIntegrationsResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      IntegrationNotFoundFault,
      InternalServerException,
      InternalServiceException,
      InvalidInputException,
      OperationNotSupportedException,
      TargetResourceNotFound,
      ValidationException,
    ],
  }),
);
/**
 * The API is used to retrieve a list of integrations.
 */
export const describeIntegrations = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeIntegrationsRequest,
    output: DescribeIntegrationsResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      IntegrationNotFoundFault,
      InternalServerException,
      InternalServiceException,
      InvalidInputException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieve a classifier by name.
 */
export const getClassifier = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClassifierRequest,
  output: GetClassifierResponse,
  errors: [EntityNotFoundException, OperationTimeoutException],
}));
/**
 * Gets settings for a column statistics task.
 */
export const getColumnStatisticsTaskSettings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetColumnStatisticsTaskSettingsRequest,
    output: GetColumnStatisticsTaskSettingsResponse,
    errors: [
      EntityNotFoundException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Retrieves the metadata for a given job run. Job run history is accessible for 365 days for your workflow and job run.
 */
export const getJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRunRequest,
  output: GetJobRunResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Gets details for a specific task run on a machine learning transform. Machine learning
 * task runs are asynchronous tasks that Glue runs on your behalf as part of various machine
 * learning workflows. You can check the stats of any task run by calling
 * `GetMLTaskRun` with the `TaskRunID` and its parent transform's
 * `TransformID`.
 */
export const getMLTaskRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMLTaskRunRequest,
  output: GetMLTaskRunResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Gets a list of runs for a machine learning transform. Machine learning task runs are
 * asynchronous tasks that Glue runs on your behalf as part of various machine learning
 * workflows. You can get a sortable, filterable list of machine learning task runs by calling
 * `GetMLTaskRuns` with their parent transform's `TransformID` and other
 * optional parameters as documented in this section.
 *
 * This operation returns a list of historic runs and must be paginated.
 */
export const getMLTaskRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMLTaskRunsRequest,
  output: GetMLTaskRunsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the partition indexes associated with a table.
 */
export const getPartitionIndexes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPartitionIndexesRequest,
  output: GetPartitionIndexesResponse,
  errors: [
    ConflictException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves partition metadata from the Data Catalog that contains unfiltered
 * metadata.
 *
 * For IAM authorization, the public IAM action associated with this API is `glue:GetPartition`.
 */
export const getUnfilteredPartitionMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetUnfilteredPartitionMetadataRequest,
    output: GetUnfilteredPartitionMetadataResponse,
    errors: [
      EntityNotFoundException,
      FederationSourceException,
      FederationSourceRetryableException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      PermissionTypeMismatchException,
    ],
  }));
/**
 * Retrieves partition metadata from the Data Catalog that contains unfiltered
 * metadata.
 *
 * For IAM authorization, the public IAM action associated with this API is `glue:GetPartitions`.
 */
export const getUnfilteredPartitionsMetadata =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetUnfilteredPartitionsMetadataRequest,
    output: GetUnfilteredPartitionsMetadataResponse,
    errors: [
      EntityNotFoundException,
      FederationSourceException,
      FederationSourceRetryableException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      PermissionTypeMismatchException,
    ],
  }));
/**
 * Allows a third-party analytical engine to retrieve unfiltered table metadata from the Data Catalog.
 *
 * For IAM authorization, the public IAM action associated with this API is `glue:GetTable`.
 */
export const getUnfilteredTableMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetUnfilteredTableMetadataRequest,
    output: GetUnfilteredTableMetadataResponse,
    errors: [
      EntityNotFoundException,
      FederationSourceException,
      FederationSourceRetryableException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      PermissionTypeMismatchException,
    ],
  }),
);
/**
 * Retrieves the metadata for a given workflow run. Job run history is accessible for 90 days for your workflow and job run.
 */
export const getWorkflowRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRunRequest,
  output: GetWorkflowRunResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * The `ListConnectionTypes` API provides a discovery mechanism to learn available connection types in Glue. The response contains a list of connection types with high-level details of what is supported for each connection type. The connection types listed are the set of supported options for the `ConnectionType` value in the `CreateConnection` API.
 */
export const listConnectionTypes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListConnectionTypesRequest,
  output: ListConnectionTypesResponse,
  errors: [AccessDeniedException, InternalServiceException],
}));
/**
 * Returns all the crawls of a specified crawler. Returns only the crawls that have occurred since the launch date of the crawler history feature, and only retains up to 12 months of crawls. Older crawls will not be returned.
 *
 * You may use this API to:
 *
 * - Retrive all the crawls of a specified crawler.
 *
 * - Retrieve all the crawls of a specified crawler within a limited count.
 *
 * - Retrieve all the crawls of a specified crawler in a specific time range.
 *
 * - Retrieve all the crawls of a specified crawler with a particular state, crawl ID, or DPU hour value.
 */
export const listCrawls = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCrawlsRequest,
  output: ListCrawlsResponse,
  errors: [
    EntityNotFoundException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Returns all data quality execution results for your account.
 */
export const listDataQualityResults = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDataQualityResultsRequest,
    output: ListDataQualityResultsResponse,
    errors: [
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Lists the recommendation runs meeting the filter criteria.
 */
export const listDataQualityRuleRecommendationRuns =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDataQualityRuleRecommendationRunsRequest,
    output: ListDataQualityRuleRecommendationRunsResponse,
    errors: [
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Lists all the runs meeting the filter criteria, where a ruleset is evaluated against a data source.
 */
export const listDataQualityRulesetEvaluationRuns =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDataQualityRulesetEvaluationRunsRequest,
    output: ListDataQualityRulesetEvaluationRunsResponse,
    errors: [
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Returns a paginated list of rulesets for the specified list of Glue tables.
 */
export const listDataQualityRulesets = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDataQualityRulesetsRequest,
    output: ListDataQualityRulesetsResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Retrieve annotations for a data quality statistic.
 */
export const listDataQualityStatisticAnnotations =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListDataQualityStatisticAnnotationsRequest,
    output: ListDataQualityStatisticAnnotationsResponse,
    errors: [InternalServiceException, InvalidInputException],
  }));
/**
 * Retrieves a list of data quality statistics.
 */
export const listDataQualityStatistics = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListDataQualityStatisticsRequest,
    output: ListDataQualityStatisticsResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
    ],
  }),
);
/**
 * List integration resource properties for a single customer. It supports the filters, maxRecords and markers.
 */
export const listIntegrationResourceProperties =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: ListIntegrationResourcePropertiesRequest,
    output: ListIntegrationResourcePropertiesResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServerException,
      InternalServiceException,
      InvalidInputException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }));
/**
 * Modifies a Zero-ETL integration in the caller's account.
 */
export const modifyIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyIntegrationRequest,
  output: ModifyIntegrationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    EntityNotFoundException,
    IntegrationConflictOperationFault,
    IntegrationNotFoundFault,
    InternalServerException,
    InternalServiceException,
    InvalidInputException,
    InvalidIntegrationStateFault,
    InvalidStateException,
    ValidationException,
  ],
}));
/**
 * Starts a recommendation run that is used to generate rules when you don't know what rules to write. Glue Data Quality analyzes the data and comes up with recommendations for a potential ruleset. You can then triage the ruleset and modify the generated ruleset to your liking.
 *
 * Recommendation runs are automatically deleted after 90 days.
 */
export const startDataQualityRuleRecommendationRun =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartDataQualityRuleRecommendationRunRequest,
    output: StartDataQualityRuleRecommendationRunResponse,
    errors: [
      ConflictException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Creates an Glue usage profile.
 */
export const createUsageProfile = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUsageProfileRequest,
  output: CreateUsageProfileResponse,
  errors: [
    AlreadyExistsException,
    InternalServiceException,
    InvalidInputException,
    OperationNotSupportedException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * The `DescribeConnectionType` API provides full details of the supported options for a given connection type in Glue.
 */
export const describeConnectionType = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeConnectionTypeRequest,
    output: DescribeConnectionTypeResponse,
    errors: [
      AccessDeniedException,
      InternalServiceException,
      InvalidInputException,
      ValidationException,
    ],
  }),
);
/**
 * The name of the Catalog to retrieve. This should be all lowercase.
 */
export const getCatalog = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCatalogRequest,
  output: GetCatalogResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves a connection definition from the Data Catalog.
 */
export const getConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetConnectionRequest,
  output: GetConnectionResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the result of a data quality rule evaluation.
 */
export const getDataQualityResult = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDataQualityResultRequest,
    output: GetDataQualityResultResponse,
    errors: [
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }),
);
/**
 * Gets an Glue machine learning transform artifact and all its corresponding metadata.
 * Machine learning transforms are a special type of transform that use machine learning to learn
 * the details of the transformation to be performed by learning from examples provided by
 * humans. These transformations are then saved by Glue. You can retrieve their metadata by
 * calling `GetMLTransform`.
 */
export const getMLTransform = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMLTransformRequest,
  output: GetMLTransformResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Gets a sortable, filterable list of existing Glue machine learning transforms. Machine
 * learning transforms are a special type of transform that use machine learning to learn the
 * details of the transformation to be performed by learning from examples provided by humans.
 * These transformations are then saved by Glue, and you can retrieve their metadata by
 * calling `GetMLTransforms`.
 */
export const getMLTransforms = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMLTransformsRequest,
  output: GetMLTransformsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the statement.
 */
export const getStatement = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetStatementRequest,
  output: GetStatementResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    IllegalSessionStateException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Lists the history of previous optimizer runs for a specific table.
 */
export const listTableOptimizerRuns = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTableOptimizerRunsRequest,
    output: ListTableOptimizerRunsResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InternalServiceException,
      InvalidInputException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Queries for the schema version metadata information.
 */
export const querySchemaVersionMetadata = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: QuerySchemaVersionMetadataInput,
    output: QuerySchemaVersionMetadataResponse,
    errors: [
      AccessDeniedException,
      EntityNotFoundException,
      InvalidInputException,
    ],
  }),
);
/**
 * Creates one or more partitions in a batch operation.
 */
export const batchCreatePartition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchCreatePartitionRequest,
    output: BatchCreatePartitionResponse,
    errors: [
      AlreadyExistsException,
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
      ResourceNumberLimitExceededException,
    ],
  }),
);
/**
 * Creates a connection definition in the Data Catalog.
 *
 * Connections used for creating federated resources require the IAM `glue:PassConnection` permission.
 */
export const createConnection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateConnectionRequest,
  output: CreateConnectionResponse,
  errors: [
    AlreadyExistsException,
    GlueEncryptionException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates a Zero-ETL integration in the caller's account between two resources with Amazon Resource Names (ARNs): the `SourceArn` and `TargetArn`.
 */
export const createIntegration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateIntegrationRequest,
  output: CreateIntegrationResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    EntityNotFoundException,
    IntegrationConflictOperationFault,
    IntegrationQuotaExceededFault,
    InternalServerException,
    InternalServiceException,
    InvalidInputException,
    KMSKeyNotAccessibleFault,
    ResourceNotFoundException,
    ResourceNumberLimitExceededException,
    ValidationException,
  ],
}));
/**
 * Creates a new table definition in the Data Catalog.
 */
export const createTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTableRequest,
  output: CreateTableResponse,
  errors: [
    AlreadyExistsException,
    ConcurrentModificationException,
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNotReadyException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Retrieves the definitions of some or all of the tables in a given
 * `Database`.
 */
export const getTables = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTablesRequest,
  output: GetTablesResponse,
  errors: [
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Creates or updates partition statistics of columns.
 *
 * The Identity and Access Management (IAM) permission required for this operation is `UpdatePartition`.
 */
export const updateColumnStatisticsForPartition =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateColumnStatisticsForPartitionRequest,
    output: UpdateColumnStatisticsForPartitionResponse,
    errors: [
      EntityNotFoundException,
      GlueEncryptionException,
      InternalServiceException,
      InvalidInputException,
      OperationTimeoutException,
    ],
  }));
/**
 * Updates a metadata table in the Data Catalog.
 */
export const updateTable = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTableRequest,
  output: UpdateTableResponse,
  errors: [
    AlreadyExistsException,
    ConcurrentModificationException,
    EntityNotFoundException,
    FederationSourceException,
    FederationSourceRetryableException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNotReadyException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Returns a list of resource metadata for a given list of workflow names. After calling the `ListWorkflows` operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
 */
export const batchGetWorkflows = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetWorkflowsRequest,
  output: BatchGetWorkflowsResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Creates a new job definition.
 */
export const createJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobRequest,
  output: CreateJobResponse,
  errors: [
    AlreadyExistsException,
    ConcurrentModificationException,
    IdempotentParameterMismatchException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
