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
const svc = T.AwsApiService({ sdkId: "Glue", serviceShapeName: "AWSGlue" });
const auth = T.AwsAuthSigv4({ name: "glue" });
const ver = T.ServiceVersion("2017-03-31");
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
              `https://glue-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://glue-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://glue.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://glue.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type CatalogIdString = string;
export type NameString = string;
export type TransactionIdString = string;
export type VersionString = string;
export type OrchestrationNameString = string;
export type HashString = string;
export type IdString = string;
export type IntegerValue = number;
export type SchemaDefinitionString = string;
export type Generic512CharString = string;
export type OrchestrationS3Location = string;
export type CatalogNameString = string;
export type CronExpression = string;
export type SampleSizePercentage = number;
export type Role = string;
export type DatabaseName = string;
export type DescriptionString = string;
export type TablePrefix = string;
export type CrawlerConfiguration = string;
export type CrawlerSecurityConfiguration = string;
export type DataQualityRulesetString = string;
export type RoleArn = string;
export type GlueVersionString = string;
export type IdentityCenterInstanceArn = string;
export type IdentityCenterScope = string;
export type String128 = string;
export type String512 = string;
export type IntegrationDescription = string;
export type String2048 = string;
export type UriString = string;
export type RoleString = string;
export type MaxRetries = number;
export type Timeout = number;
export type MaintenanceWindow = string;
export type SchemaRegistryNameString = string;
export type OrchestrationRoleArn = string;
export type WorkflowDescriptionString = string;
export type ValueString = string;
export type MessageString = string;
export type GlueResourceArn = string;
export type VersionsString = string;
export type EntityName = string;
export type NextToken = string;
export type ApiVersion = string;
export type IntegrationInteger = number;
export type PageSize = number;
export type Token = string;
export type CatalogGetterPageSize = number;
export type PythonScript = string;
export type FilterPredicate = string;
export type Limit = number;
export type EntityFieldName = string;
export type ApplicationArn = string;
export type JobName = string;
export type RunId = string;
export type OrchestrationPageSize200 = number;
export type UUIDv4 = string;
export type PaginationToken = string;
export type PredicateString = string;
export type BooleanNullable = boolean;
export type SchemaVersionIdString = string;
export type FilterString = string;
export type ArnString = string;
export type OrchestrationPageSize25 = number;
export type MaxResults = number;
export type String1024 = string;
export type MaxResultsNumber = number;
export type SchemaRegistryTokenString = string;
export type OrchestrationToken = string;
export type MaxListTableOptimizerRunsTokenResults = number;
export type ListTableOptimizerRunsToken = string;
export type PolicyJsonString = string;
export type QuerySchemaVersionMetadataMaxResults = number;
export type OrchestrationStatementCodeString = string;
export type BlueprintParameters = string;
export type OrchestrationIAMRoleArn = string;
export type ReplaceBoolean = boolean;
export type OrchestrationPolicyJsonString = string;
export type TagKey = string;
export type DescriptionStringRemovable = string;
export type CommitIdString = string;
export type AuthTokenString = string;
export type DatabaseNameString = string;
export type TableNameString = string;
export type TagValue = string;
export type Classification = string;
export type GrokPattern = string;
export type CustomPatterns = string;
export type RowTag = string;
export type JsonPath = string;
export type CsvColumnDelimiter = string;
export type CsvQuoteSymbol = string;
export type AccountId = string;
export type URI = string;
export type IntegrationString = string;
export type ContinuousSync = boolean;
export type MaxConcurrentRuns = number;
export type ScriptLocationString = string;
export type PythonVersionString = string;
export type RuntimeNameString = string;
export type ConnectionString = string;
export type NotifyDelayAfter = number;
export type NodeId = string;
export type CodeGenIdentifier = string;
export type CodeGenNodeType = string;
export type CodeGenArgName = string;
export type OrchestrationArgumentsValue = string;
export type NonNegativeInteger = number;
export type ViewTextString = string;
export type TableTypeString = string;
export type BatchSize = number;
export type BatchWindow = number;
export type ConnectionSchemaVersion = number;
export type OptionKey = string;
export type OptionValue = string;
export type TotalSegmentsInteger = number;
export type TableName = string;
export type SchemaPathString = string;
export type FieldType = string;
export type LatestSchemaVersionBoolean = boolean;
export type VersionLongNumber = number;
export type AuditContextString = string;
export type ColumnNameString = string;
export type NullableString = string;
export type ViewDialectVersionString = string;
export type MetadataKeyString = string;
export type MetadataValueString = string;
export type TypeString = string;
export type IsVersionValid = boolean;
export type SchemaValidationError = string;
export type IntegrationTimestamp = Date;
export type Description = string;
export type GenericBoundedDouble = number;
export type ExecutionTime = number;
export type LabelCount = number;
export type CreatedTimestamp = string;
export type UpdatedTimestamp = string;
export type SchemaCheckpointNumber = number;
export type SchemaDefinitionDiff = string;
export type TimestampValue = Date;
export type LocationString = string;
export type FormatString = string;
export type KeyString = string;
export type ParametersMapValue = string;
export type FederationIdentifier = string;
export type ResourceArnString = string;
export type PropertyKey = string;
export type PropertyValue = string;
export type SecretArn = string;
export type KmsKeyArn = string;
export type Path = string;
export type ConnectionName = string;
export type EventQueueArn = string;
export type CodeGenArgValue = string;
export type ColumnTypeString = string;
export type CommentString = string;
export type TableVersionId = number;
export type RefreshSeconds = number;
export type GlueConnectionNameString = string;
export type ContextKey = string;
export type ContextValue = string;
export type IAMRoleArn = string;
export type PreProcessingQueryString = string;
export type BlueprintParameterSpec = string;
export type ErrorString = string;
export type MillisecondsCount = number;
export type VersionId = number;
export type PropertyName = string;
export type ComputeEnvironmentName = string;
export type FieldLabel = string;
export type FieldDescription = string;
export type PositiveInteger = number;
export type NonNegativeDouble = number;
export type LongValueString = string;
export type DataQualityRuleResultDescription =
  | string
  | redacted.Redacted<string>;
export type DataQualityObservationDescription =
  | string
  | redacted.Redacted<string>;
export type JsonValue = string;
export type AttemptCount = number;
export type OrchestrationMessageString = string;
export type ByteCount = number;
export type DoubleValue = number;
export type IdleTimeout = number;
export type LongValue = number;
export type DisplayName = string;
export type Vendor = string;
export type UrlString = string;
export type StatisticNameString = string;
export type EntityLabel = string;
export type IsParentEntity = boolean;
export type EntityDescription = string;
export type Category = string;
export type TableOptimizerRunTimestamp = Date;
export type IntegerFlag = number;
export type ColumnValuesString = string;
export type DataLakePrincipalString = string;
export type TokenUrl = string;
export type Username = string;
export type Password = string | redacted.Redacted<string>;
export type CredentialKey = string;
export type CredentialValue = string;
export type NodeName = string;
export type EnclosedInStringProperty = string;
export type EnclosedInStringPropertyWithQuote = string;
export type SqlQuery = string;
export type BoxedBoolean = boolean;
export type BoxedNonNegativeInt = number;
export type NumberTargetPartitionsString = string;
export type Topk = number;
export type Prob = number;
export type NonNegativeInt = number;
export type ExtendedString = string;
export type BoxedPositiveInt = number;
export type BoxedDoubleFraction = number;
export type MaskValue = string;
export type GenericLimitedString = string;
export type DQDLString = string;
export type BoxedLong = number;
export type ConfigValueString = string;
export type NonNegativeLong = number;
export type Record = unknown;
export type IntegrationErrorMessage = string;
export type ScalaCode = string;
export type LogGroup = string;
export type LogStream = string;
export type MessagePrefix = string;
export type ErrorCodeString = string;
export type ErrorMessageString = string;
export type PropertyDescriptionString = string;
export type ComputeEnvironmentConfigurationDescriptionString = string;
export type UserManagedClientApplicationClientId = string;
export type AWSManagedClientApplicationReference = string;
export type TokenUrlParameterKey = string;
export type TokenUrlParameterValue = string;
export type AuthorizationCode = string | redacted.Redacted<string>;
export type RedirectUri = string;
export type UserManagedClientApplicationClientSecret =
  | string
  | redacted.Redacted<string>;
export type AccessToken = string | redacted.Redacted<string>;
export type RefreshToken = string | redacted.Redacted<string>;
export type JwtToken = string | redacted.Redacted<string>;
export type BoxedNonNegativeLong = number;
export type Iso8601DateTime = Date;
export type PollingTime = number;
export type PositiveLong = number;
export type RecipeVersion = string;
export type EncryptionKeyIdString = string;
export type CrawlId = string;
export type AllowedValueDescriptionString = string;
export type AllowedValueValueString = string;
export type RecordsCount = number;
export type MetricCounts = number;
export type DpuHours = number;
export type DpuCounts = number;
export type DpuDurationInHour = number;
export type GlueStudioColumnNameString = string;
export type Operation = string;
export type DatabrewCondition = string;
export type DatabrewConditionValue = string;
export type TargetColumn = string;
export type IcebergDocument = unknown;
export type IcebergTransformString = string;
export type EncryptedKeyMetadataString = string;
export type ParameterName = string;
export type ParameterValue = string;

//# Schemas
export interface DeleteGlueIdentityCenterConfigurationRequest {}
export const DeleteGlueIdentityCenterConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteGlueIdentityCenterConfigurationRequest",
}) as any as S.Schema<DeleteGlueIdentityCenterConfigurationRequest>;
export interface DeleteGlueIdentityCenterConfigurationResponse {}
export const DeleteGlueIdentityCenterConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteGlueIdentityCenterConfigurationResponse",
}) as any as S.Schema<DeleteGlueIdentityCenterConfigurationResponse>;
export interface GetGlueIdentityCenterConfigurationRequest {}
export const GetGlueIdentityCenterConfigurationRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetGlueIdentityCenterConfigurationRequest",
}) as any as S.Schema<GetGlueIdentityCenterConfigurationRequest>;
export type DeleteConnectionNameList = string[];
export const DeleteConnectionNameList = S.Array(S.String);
export type BatchDeleteTableNameList = string[];
export const BatchDeleteTableNameList = S.Array(S.String);
export type BatchDeleteTableVersionList = string[];
export const BatchDeleteTableVersionList = S.Array(S.String);
export type BatchGetBlueprintNames = string[];
export const BatchGetBlueprintNames = S.Array(S.String);
export type CrawlerNameList = string[];
export const CrawlerNameList = S.Array(S.String);
export type CustomEntityTypeNames = string[];
export const CustomEntityTypeNames = S.Array(S.String);
export type DataQualityResultIds = string[];
export const DataQualityResultIds = S.Array(S.String);
export type DevEndpointNames = string[];
export const DevEndpointNames = S.Array(S.String);
export type JobNameList = string[];
export const JobNameList = S.Array(S.String);
export type ValueStringList = string[];
export const ValueStringList = S.Array(S.String);
export interface PartitionValueList {
  Values: string[];
}
export const PartitionValueList = S.suspend(() =>
  S.Struct({ Values: ValueStringList }),
).annotations({
  identifier: "PartitionValueList",
}) as any as S.Schema<PartitionValueList>;
export type BatchGetPartitionValueList = PartitionValueList[];
export const BatchGetPartitionValueList = S.Array(PartitionValueList);
export type TriggerNameList = string[];
export const TriggerNameList = S.Array(S.String);
export type WorkflowNames = string[];
export const WorkflowNames = S.Array(S.String);
export type BatchStopJobRunJobRunIdList = string[];
export const BatchStopJobRunJobRunIdList = S.Array(S.String);
export type DataFormat = "AVRO" | "JSON" | "PROTOBUF" | (string & {});
export const DataFormat = S.String;
export type ColumnNameList = string[];
export const ColumnNameList = S.Array(S.String);
export type ClassifierNameList = string[];
export const ClassifierNameList = S.Array(S.String);
export type ContextWords = string[];
export const ContextWords = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
export type PublicKeysList = string[];
export const PublicKeysList = S.Array(S.String);
export type WorkerType =
  | "Standard"
  | "G.1X"
  | "G.2X"
  | "G.025X"
  | "G.4X"
  | "G.8X"
  | "Z.2X"
  | (string & {});
export const WorkerType = S.String;
export type IdentityCenterScopesList = string[];
export const IdentityCenterScopesList = S.Array(S.String);
export type JobMode = "SCRIPT" | "VISUAL" | "NOTEBOOK" | (string & {});
export const JobMode = S.String;
export type ExecutionClass = "FLEX" | "STANDARD" | (string & {});
export const ExecutionClass = S.String;
export type Compatibility =
  | "NONE"
  | "DISABLED"
  | "BACKWARD"
  | "BACKWARD_ALL"
  | "FORWARD"
  | "FORWARD_ALL"
  | "FULL"
  | "FULL_ALL"
  | (string & {});
export const Compatibility = S.String;
export type Language = "PYTHON" | "SCALA" | (string & {});
export const Language = S.String;
export type KeyList = string[];
export const KeyList = S.Array(S.String);
export interface PartitionIndex {
  Keys: string[];
  IndexName: string;
}
export const PartitionIndex = S.suspend(() =>
  S.Struct({ Keys: KeyList, IndexName: S.String }),
).annotations({
  identifier: "PartitionIndex",
}) as any as S.Schema<PartitionIndex>;
export type PartitionIndexList = PartitionIndex[];
export const PartitionIndexList = S.Array(PartitionIndex);
export type TableOptimizerType =
  | "compaction"
  | "retention"
  | "orphan_file_deletion"
  | (string & {});
export const TableOptimizerType = S.String;
export type TriggerType =
  | "SCHEDULED"
  | "CONDITIONAL"
  | "ON_DEMAND"
  | "EVENT"
  | (string & {});
export const TriggerType = S.String;
export type GetColumnNamesList = string[];
export const GetColumnNamesList = S.Array(S.String);
export type ComputeEnvironment = "SPARK" | "ATHENA" | "PYTHON" | (string & {});
export const ComputeEnvironment = S.String;
export type ResourceShareType = "FOREIGN" | "ALL" | "FEDERATED" | (string & {});
export const ResourceShareType = S.String;
export type DatabaseAttributes = "NAME" | "TARGET_DATABASE" | (string & {});
export const DatabaseAttributes = S.String;
export type DatabaseAttributesList = DatabaseAttributes[];
export const DatabaseAttributesList = S.Array(DatabaseAttributes);
export type SelectedFields = string[];
export const SelectedFields = S.Array(S.String);
export type OrchestrationStringList = string[];
export const OrchestrationStringList = S.Array(S.String);
export interface CatalogEntry {
  DatabaseName: string;
  TableName: string;
}
export const CatalogEntry = S.suspend(() =>
  S.Struct({ DatabaseName: S.String, TableName: S.String }),
).annotations({ identifier: "CatalogEntry" }) as any as S.Schema<CatalogEntry>;
export type CatalogEntries = CatalogEntry[];
export const CatalogEntries = S.Array(CatalogEntry);
export type SchemaDiffType = "SYNTAX_DIFF" | (string & {});
export const SchemaDiffType = S.String;
export type TableAttributes = "NAME" | "TABLE_TYPE" | (string & {});
export const TableAttributes = S.String;
export type TableAttributesList = TableAttributes[];
export const TableAttributesList = S.Array(TableAttributes);
export type PermissionType =
  | "COLUMN_PERMISSION"
  | "CELL_FILTER_PERMISSION"
  | "NESTED_PERMISSION"
  | "NESTED_CELL_PERMISSION"
  | (string & {});
export const PermissionType = S.String;
export type PermissionTypeList = PermissionType[];
export const PermissionTypeList = S.Array(PermissionType);
export type Permission =
  | "ALL"
  | "SELECT"
  | "ALTER"
  | "DROP"
  | "DELETE"
  | "INSERT"
  | "CREATE_DATABASE"
  | "CREATE_TABLE"
  | "DATA_LOCATION_ACCESS"
  | (string & {});
export const Permission = S.String;
export type PermissionList = Permission[];
export const PermissionList = S.Array(Permission);
export type FunctionType =
  | "REGULAR_FUNCTION"
  | "AGGREGATE_FUNCTION"
  | "STORED_PROCEDURE"
  | (string & {});
export const FunctionType = S.String;
export type InclusionAnnotationValue = "INCLUDE" | "EXCLUDE" | (string & {});
export const InclusionAnnotationValue = S.String;
export type ExistCondition =
  | "MUST_EXIST"
  | "NOT_EXIST"
  | "NONE"
  | (string & {});
export const ExistCondition = S.String;
export type EnableHybridValues = "TRUE" | "FALSE" | (string & {});
export const EnableHybridValues = S.String;
export interface MetadataKeyValuePair {
  MetadataKey?: string;
  MetadataValue?: string;
}
export const MetadataKeyValuePair = S.suspend(() =>
  S.Struct({
    MetadataKey: S.optional(S.String),
    MetadataValue: S.optional(S.String),
  }),
).annotations({
  identifier: "MetadataKeyValuePair",
}) as any as S.Schema<MetadataKeyValuePair>;
export type MetadataList = MetadataKeyValuePair[];
export const MetadataList = S.Array(MetadataKeyValuePair);
export type NodeIdList = string[];
export const NodeIdList = S.Array(S.String);
export type RulesetNames = string[];
export const RulesetNames = S.Array(S.String);
export type TagKeysList = string[];
export const TagKeysList = S.Array(S.String);
export type SourceControlProvider =
  | "GITHUB"
  | "GITLAB"
  | "BITBUCKET"
  | "AWS_CODE_COMMIT"
  | (string & {});
export const SourceControlProvider = S.String;
export type SourceControlAuthStrategy =
  | "PERSONAL_ACCESS_TOKEN"
  | "AWS_SECRETS_MANAGER"
  | (string & {});
export const SourceControlAuthStrategy = S.String;
export type BoundedPartitionValueList = string[];
export const BoundedPartitionValueList = S.Array(S.String);
export type ViewUpdateAction =
  | "ADD"
  | "REPLACE"
  | "ADD_OR_REPLACE"
  | "DROP"
  | (string & {});
export const ViewUpdateAction = S.String;
export interface BatchDeleteConnectionRequest {
  CatalogId?: string;
  ConnectionNameList: string[];
}
export const BatchDeleteConnectionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    ConnectionNameList: DeleteConnectionNameList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchDeleteConnectionRequest",
}) as any as S.Schema<BatchDeleteConnectionRequest>;
export interface BatchDeleteTableRequest {
  CatalogId?: string;
  DatabaseName: string;
  TablesToDelete: string[];
  TransactionId?: string;
}
export const BatchDeleteTableRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TablesToDelete: BatchDeleteTableNameList,
    TransactionId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchDeleteTableRequest",
}) as any as S.Schema<BatchDeleteTableRequest>;
export interface BatchDeleteTableVersionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  VersionIds: string[];
}
export const BatchDeleteTableVersionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    VersionIds: BatchDeleteTableVersionList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchDeleteTableVersionRequest",
}) as any as S.Schema<BatchDeleteTableVersionRequest>;
export interface BatchGetBlueprintsRequest {
  Names: string[];
  IncludeBlueprint?: boolean;
  IncludeParameterSpec?: boolean;
}
export const BatchGetBlueprintsRequest = S.suspend(() =>
  S.Struct({
    Names: BatchGetBlueprintNames,
    IncludeBlueprint: S.optional(S.Boolean),
    IncludeParameterSpec: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetBlueprintsRequest",
}) as any as S.Schema<BatchGetBlueprintsRequest>;
export interface BatchGetCrawlersRequest {
  CrawlerNames: string[];
}
export const BatchGetCrawlersRequest = S.suspend(() =>
  S.Struct({ CrawlerNames: CrawlerNameList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetCrawlersRequest",
}) as any as S.Schema<BatchGetCrawlersRequest>;
export interface BatchGetCustomEntityTypesRequest {
  Names: string[];
}
export const BatchGetCustomEntityTypesRequest = S.suspend(() =>
  S.Struct({ Names: CustomEntityTypeNames }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetCustomEntityTypesRequest",
}) as any as S.Schema<BatchGetCustomEntityTypesRequest>;
export interface BatchGetDataQualityResultRequest {
  ResultIds: string[];
}
export const BatchGetDataQualityResultRequest = S.suspend(() =>
  S.Struct({ ResultIds: DataQualityResultIds }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetDataQualityResultRequest",
}) as any as S.Schema<BatchGetDataQualityResultRequest>;
export interface BatchGetDevEndpointsRequest {
  DevEndpointNames: string[];
}
export const BatchGetDevEndpointsRequest = S.suspend(() =>
  S.Struct({ DevEndpointNames: DevEndpointNames }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetDevEndpointsRequest",
}) as any as S.Schema<BatchGetDevEndpointsRequest>;
export interface BatchGetJobsRequest {
  JobNames: string[];
}
export const BatchGetJobsRequest = S.suspend(() =>
  S.Struct({ JobNames: JobNameList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetJobsRequest",
}) as any as S.Schema<BatchGetJobsRequest>;
export interface BatchGetPartitionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  PartitionsToGet: PartitionValueList[];
}
export const BatchGetPartitionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionsToGet: BatchGetPartitionValueList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetPartitionRequest",
}) as any as S.Schema<BatchGetPartitionRequest>;
export interface BatchGetTriggersRequest {
  TriggerNames: string[];
}
export const BatchGetTriggersRequest = S.suspend(() =>
  S.Struct({ TriggerNames: TriggerNameList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetTriggersRequest",
}) as any as S.Schema<BatchGetTriggersRequest>;
export interface BatchGetWorkflowsRequest {
  Names: string[];
  IncludeGraph?: boolean;
}
export const BatchGetWorkflowsRequest = S.suspend(() =>
  S.Struct({ Names: WorkflowNames, IncludeGraph: S.optional(S.Boolean) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetWorkflowsRequest",
}) as any as S.Schema<BatchGetWorkflowsRequest>;
export interface BatchStopJobRunRequest {
  JobName: string;
  JobRunIds: string[];
}
export const BatchStopJobRunRequest = S.suspend(() =>
  S.Struct({ JobName: S.String, JobRunIds: BatchStopJobRunJobRunIdList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchStopJobRunRequest",
}) as any as S.Schema<BatchStopJobRunRequest>;
export interface CancelDataQualityRuleRecommendationRunRequest {
  RunId: string;
}
export const CancelDataQualityRuleRecommendationRunRequest = S.suspend(() =>
  S.Struct({ RunId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelDataQualityRuleRecommendationRunRequest",
}) as any as S.Schema<CancelDataQualityRuleRecommendationRunRequest>;
export interface CancelDataQualityRuleRecommendationRunResponse {}
export const CancelDataQualityRuleRecommendationRunResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelDataQualityRuleRecommendationRunResponse",
}) as any as S.Schema<CancelDataQualityRuleRecommendationRunResponse>;
export interface CancelDataQualityRulesetEvaluationRunRequest {
  RunId: string;
}
export const CancelDataQualityRulesetEvaluationRunRequest = S.suspend(() =>
  S.Struct({ RunId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelDataQualityRulesetEvaluationRunRequest",
}) as any as S.Schema<CancelDataQualityRulesetEvaluationRunRequest>;
export interface CancelDataQualityRulesetEvaluationRunResponse {}
export const CancelDataQualityRulesetEvaluationRunResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelDataQualityRulesetEvaluationRunResponse",
}) as any as S.Schema<CancelDataQualityRulesetEvaluationRunResponse>;
export interface CancelMLTaskRunRequest {
  TransformId: string;
  TaskRunId: string;
}
export const CancelMLTaskRunRequest = S.suspend(() =>
  S.Struct({ TransformId: S.String, TaskRunId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelMLTaskRunRequest",
}) as any as S.Schema<CancelMLTaskRunRequest>;
export interface CancelStatementRequest {
  SessionId: string;
  Id: number;
  RequestOrigin?: string;
}
export const CancelStatementRequest = S.suspend(() =>
  S.Struct({
    SessionId: S.String,
    Id: S.Number,
    RequestOrigin: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CancelStatementRequest",
}) as any as S.Schema<CancelStatementRequest>;
export interface CancelStatementResponse {}
export const CancelStatementResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CancelStatementResponse",
}) as any as S.Schema<CancelStatementResponse>;
export interface CheckSchemaVersionValidityInput {
  DataFormat: DataFormat;
  SchemaDefinition: string;
}
export const CheckSchemaVersionValidityInput = S.suspend(() =>
  S.Struct({ DataFormat: DataFormat, SchemaDefinition: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CheckSchemaVersionValidityInput",
}) as any as S.Schema<CheckSchemaVersionValidityInput>;
export type TagsMap = { [key: string]: string | undefined };
export const TagsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface CreateColumnStatisticsTaskSettingsRequest {
  DatabaseName: string;
  TableName: string;
  Role: string;
  Schedule?: string;
  ColumnNameList?: string[];
  SampleSize?: number;
  CatalogID?: string;
  SecurityConfiguration?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateColumnStatisticsTaskSettingsRequest = S.suspend(() =>
  S.Struct({
    DatabaseName: S.String,
    TableName: S.String,
    Role: S.String,
    Schedule: S.optional(S.String),
    ColumnNameList: S.optional(ColumnNameList),
    SampleSize: S.optional(S.Number),
    CatalogID: S.optional(S.String),
    SecurityConfiguration: S.optional(S.String),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateColumnStatisticsTaskSettingsRequest",
}) as any as S.Schema<CreateColumnStatisticsTaskSettingsRequest>;
export interface CreateColumnStatisticsTaskSettingsResponse {}
export const CreateColumnStatisticsTaskSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateColumnStatisticsTaskSettingsResponse",
}) as any as S.Schema<CreateColumnStatisticsTaskSettingsResponse>;
export interface CreateCustomEntityTypeRequest {
  Name: string;
  RegexString: string;
  ContextWords?: string[];
  Tags?: { [key: string]: string | undefined };
}
export const CreateCustomEntityTypeRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    RegexString: S.String,
    ContextWords: S.optional(ContextWords),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCustomEntityTypeRequest",
}) as any as S.Schema<CreateCustomEntityTypeRequest>;
export interface CreateGlueIdentityCenterConfigurationRequest {
  InstanceArn: string;
  Scopes?: string[];
  UserBackgroundSessionsEnabled?: boolean;
}
export const CreateGlueIdentityCenterConfigurationRequest = S.suspend(() =>
  S.Struct({
    InstanceArn: S.String,
    Scopes: S.optional(IdentityCenterScopesList),
    UserBackgroundSessionsEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateGlueIdentityCenterConfigurationRequest",
}) as any as S.Schema<CreateGlueIdentityCenterConfigurationRequest>;
export type ParametersMap = { [key: string]: string | undefined };
export const ParametersMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface Column {
  Name: string;
  Type?: string;
  Comment?: string;
  Parameters?: { [key: string]: string | undefined };
}
export const Column = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: S.optional(S.String),
    Comment: S.optional(S.String),
    Parameters: S.optional(ParametersMap),
  }),
).annotations({ identifier: "Column" }) as any as S.Schema<Column>;
export type ColumnList = Column[];
export const ColumnList = S.Array(Column);
export type LocationStringList = string[];
export const LocationStringList = S.Array(S.String);
export interface SerDeInfo {
  Name?: string;
  SerializationLibrary?: string;
  Parameters?: { [key: string]: string | undefined };
}
export const SerDeInfo = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    SerializationLibrary: S.optional(S.String),
    Parameters: S.optional(ParametersMap),
  }),
).annotations({ identifier: "SerDeInfo" }) as any as S.Schema<SerDeInfo>;
export type NameStringList = string[];
export const NameStringList = S.Array(S.String);
export interface Order {
  Column: string;
  SortOrder: number;
}
export const Order = S.suspend(() =>
  S.Struct({ Column: S.String, SortOrder: S.Number }),
).annotations({ identifier: "Order" }) as any as S.Schema<Order>;
export type OrderList = Order[];
export const OrderList = S.Array(Order);
export type ColumnValueStringList = string[];
export const ColumnValueStringList = S.Array(S.String);
export type LocationMap = { [key: string]: string | undefined };
export const LocationMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface SkewedInfo {
  SkewedColumnNames?: string[];
  SkewedColumnValues?: string[];
  SkewedColumnValueLocationMaps?: { [key: string]: string | undefined };
}
export const SkewedInfo = S.suspend(() =>
  S.Struct({
    SkewedColumnNames: S.optional(NameStringList),
    SkewedColumnValues: S.optional(ColumnValueStringList),
    SkewedColumnValueLocationMaps: S.optional(LocationMap),
  }),
).annotations({ identifier: "SkewedInfo" }) as any as S.Schema<SkewedInfo>;
export interface SchemaId {
  SchemaArn?: string;
  SchemaName?: string;
  RegistryName?: string;
}
export const SchemaId = S.suspend(() =>
  S.Struct({
    SchemaArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    RegistryName: S.optional(S.String),
  }),
).annotations({ identifier: "SchemaId" }) as any as S.Schema<SchemaId>;
export interface SchemaReference {
  SchemaId?: SchemaId;
  SchemaVersionId?: string;
  SchemaVersionNumber?: number;
}
export const SchemaReference = S.suspend(() =>
  S.Struct({
    SchemaId: S.optional(SchemaId),
    SchemaVersionId: S.optional(S.String),
    SchemaVersionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "SchemaReference",
}) as any as S.Schema<SchemaReference>;
export interface StorageDescriptor {
  Columns?: Column[];
  Location?: string;
  AdditionalLocations?: string[];
  InputFormat?: string;
  OutputFormat?: string;
  Compressed?: boolean;
  NumberOfBuckets?: number;
  SerdeInfo?: SerDeInfo;
  BucketColumns?: string[];
  SortColumns?: Order[];
  Parameters?: { [key: string]: string | undefined };
  SkewedInfo?: SkewedInfo;
  StoredAsSubDirectories?: boolean;
  SchemaReference?: SchemaReference;
}
export const StorageDescriptor = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "StorageDescriptor",
}) as any as S.Schema<StorageDescriptor>;
export interface PartitionInput {
  Values?: string[];
  LastAccessTime?: Date;
  StorageDescriptor?: StorageDescriptor;
  Parameters?: { [key: string]: string | undefined };
  LastAnalyzedTime?: Date;
}
export const PartitionInput = S.suspend(() =>
  S.Struct({
    Values: S.optional(ValueStringList),
    LastAccessTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StorageDescriptor: S.optional(StorageDescriptor),
    Parameters: S.optional(ParametersMap),
    LastAnalyzedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "PartitionInput",
}) as any as S.Schema<PartitionInput>;
export interface CreatePartitionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  PartitionInput: PartitionInput;
}
export const CreatePartitionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionInput: PartitionInput,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePartitionRequest",
}) as any as S.Schema<CreatePartitionRequest>;
export interface CreatePartitionResponse {}
export const CreatePartitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreatePartitionResponse",
}) as any as S.Schema<CreatePartitionResponse>;
export interface CreateRegistryInput {
  RegistryName: string;
  Description?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateRegistryInput = S.suspend(() =>
  S.Struct({
    RegistryName: S.String,
    Description: S.optional(S.String),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateRegistryInput",
}) as any as S.Schema<CreateRegistryInput>;
export interface DeleteBlueprintRequest {
  Name: string;
}
export const DeleteBlueprintRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteBlueprintRequest",
}) as any as S.Schema<DeleteBlueprintRequest>;
export interface DeleteCatalogRequest {
  CatalogId: string;
}
export const DeleteCatalogRequest = S.suspend(() =>
  S.Struct({ CatalogId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCatalogRequest",
}) as any as S.Schema<DeleteCatalogRequest>;
export interface DeleteCatalogResponse {}
export const DeleteCatalogResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteCatalogResponse",
}) as any as S.Schema<DeleteCatalogResponse>;
export interface DeleteClassifierRequest {
  Name: string;
}
export const DeleteClassifierRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteClassifierRequest",
}) as any as S.Schema<DeleteClassifierRequest>;
export interface DeleteClassifierResponse {}
export const DeleteClassifierResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteClassifierResponse",
}) as any as S.Schema<DeleteClassifierResponse>;
export interface DeleteColumnStatisticsForPartitionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  PartitionValues: string[];
  ColumnName: string;
}
export const DeleteColumnStatisticsForPartitionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValues: ValueStringList,
    ColumnName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteColumnStatisticsForPartitionRequest",
}) as any as S.Schema<DeleteColumnStatisticsForPartitionRequest>;
export interface DeleteColumnStatisticsForPartitionResponse {}
export const DeleteColumnStatisticsForPartitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteColumnStatisticsForPartitionResponse",
}) as any as S.Schema<DeleteColumnStatisticsForPartitionResponse>;
export interface DeleteColumnStatisticsForTableRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  ColumnName: string;
}
export const DeleteColumnStatisticsForTableRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    ColumnName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteColumnStatisticsForTableRequest",
}) as any as S.Schema<DeleteColumnStatisticsForTableRequest>;
export interface DeleteColumnStatisticsForTableResponse {}
export const DeleteColumnStatisticsForTableResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteColumnStatisticsForTableResponse",
}) as any as S.Schema<DeleteColumnStatisticsForTableResponse>;
export interface DeleteColumnStatisticsTaskSettingsRequest {
  DatabaseName: string;
  TableName: string;
}
export const DeleteColumnStatisticsTaskSettingsRequest = S.suspend(() =>
  S.Struct({ DatabaseName: S.String, TableName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteColumnStatisticsTaskSettingsRequest",
}) as any as S.Schema<DeleteColumnStatisticsTaskSettingsRequest>;
export interface DeleteColumnStatisticsTaskSettingsResponse {}
export const DeleteColumnStatisticsTaskSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteColumnStatisticsTaskSettingsResponse",
}) as any as S.Schema<DeleteColumnStatisticsTaskSettingsResponse>;
export interface DeleteConnectionRequest {
  CatalogId?: string;
  ConnectionName: string;
}
export const DeleteConnectionRequest = S.suspend(() =>
  S.Struct({ CatalogId: S.optional(S.String), ConnectionName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteConnectionRequest",
}) as any as S.Schema<DeleteConnectionRequest>;
export interface DeleteConnectionResponse {}
export const DeleteConnectionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteConnectionResponse",
}) as any as S.Schema<DeleteConnectionResponse>;
export interface DeleteCrawlerRequest {
  Name: string;
}
export const DeleteCrawlerRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCrawlerRequest",
}) as any as S.Schema<DeleteCrawlerRequest>;
export interface DeleteCrawlerResponse {}
export const DeleteCrawlerResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteCrawlerResponse",
}) as any as S.Schema<DeleteCrawlerResponse>;
export interface DeleteCustomEntityTypeRequest {
  Name: string;
}
export const DeleteCustomEntityTypeRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteCustomEntityTypeRequest",
}) as any as S.Schema<DeleteCustomEntityTypeRequest>;
export interface DeleteDatabaseRequest {
  CatalogId?: string;
  Name: string;
}
export const DeleteDatabaseRequest = S.suspend(() =>
  S.Struct({ CatalogId: S.optional(S.String), Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDatabaseRequest",
}) as any as S.Schema<DeleteDatabaseRequest>;
export interface DeleteDatabaseResponse {}
export const DeleteDatabaseResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "DeleteDatabaseResponse" },
) as any as S.Schema<DeleteDatabaseResponse>;
export interface DeleteDataQualityRulesetRequest {
  Name: string;
}
export const DeleteDataQualityRulesetRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDataQualityRulesetRequest",
}) as any as S.Schema<DeleteDataQualityRulesetRequest>;
export interface DeleteDataQualityRulesetResponse {}
export const DeleteDataQualityRulesetResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDataQualityRulesetResponse",
}) as any as S.Schema<DeleteDataQualityRulesetResponse>;
export interface DeleteDevEndpointRequest {
  EndpointName: string;
}
export const DeleteDevEndpointRequest = S.suspend(() =>
  S.Struct({ EndpointName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteDevEndpointRequest",
}) as any as S.Schema<DeleteDevEndpointRequest>;
export interface DeleteDevEndpointResponse {}
export const DeleteDevEndpointResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteDevEndpointResponse",
}) as any as S.Schema<DeleteDevEndpointResponse>;
export interface DeleteIntegrationRequest {
  IntegrationIdentifier: string;
}
export const DeleteIntegrationRequest = S.suspend(() =>
  S.Struct({ IntegrationIdentifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteIntegrationRequest",
}) as any as S.Schema<DeleteIntegrationRequest>;
export interface DeleteIntegrationResourcePropertyRequest {
  ResourceArn: string;
}
export const DeleteIntegrationResourcePropertyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteIntegrationResourcePropertyRequest",
}) as any as S.Schema<DeleteIntegrationResourcePropertyRequest>;
export interface DeleteIntegrationResourcePropertyResponse {}
export const DeleteIntegrationResourcePropertyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIntegrationResourcePropertyResponse",
}) as any as S.Schema<DeleteIntegrationResourcePropertyResponse>;
export interface DeleteIntegrationTablePropertiesRequest {
  ResourceArn: string;
  TableName: string;
}
export const DeleteIntegrationTablePropertiesRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TableName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteIntegrationTablePropertiesRequest",
}) as any as S.Schema<DeleteIntegrationTablePropertiesRequest>;
export interface DeleteIntegrationTablePropertiesResponse {}
export const DeleteIntegrationTablePropertiesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteIntegrationTablePropertiesResponse",
}) as any as S.Schema<DeleteIntegrationTablePropertiesResponse>;
export interface DeleteJobRequest {
  JobName: string;
}
export const DeleteJobRequest = S.suspend(() =>
  S.Struct({ JobName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteJobRequest",
}) as any as S.Schema<DeleteJobRequest>;
export interface DeleteMLTransformRequest {
  TransformId: string;
}
export const DeleteMLTransformRequest = S.suspend(() =>
  S.Struct({ TransformId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteMLTransformRequest",
}) as any as S.Schema<DeleteMLTransformRequest>;
export interface DeletePartitionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  PartitionValues: string[];
}
export const DeletePartitionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValues: ValueStringList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePartitionRequest",
}) as any as S.Schema<DeletePartitionRequest>;
export interface DeletePartitionResponse {}
export const DeletePartitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePartitionResponse",
}) as any as S.Schema<DeletePartitionResponse>;
export interface DeletePartitionIndexRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  IndexName: string;
}
export const DeletePartitionIndexRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    IndexName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeletePartitionIndexRequest",
}) as any as S.Schema<DeletePartitionIndexRequest>;
export interface DeletePartitionIndexResponse {}
export const DeletePartitionIndexResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeletePartitionIndexResponse",
}) as any as S.Schema<DeletePartitionIndexResponse>;
export interface RegistryId {
  RegistryName?: string;
  RegistryArn?: string;
}
export const RegistryId = S.suspend(() =>
  S.Struct({
    RegistryName: S.optional(S.String),
    RegistryArn: S.optional(S.String),
  }),
).annotations({ identifier: "RegistryId" }) as any as S.Schema<RegistryId>;
export interface DeleteRegistryInput {
  RegistryId: RegistryId;
}
export const DeleteRegistryInput = S.suspend(() =>
  S.Struct({ RegistryId: RegistryId }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRegistryInput",
}) as any as S.Schema<DeleteRegistryInput>;
export interface DeleteResourcePolicyRequest {
  PolicyHashCondition?: string;
  ResourceArn?: string;
}
export const DeleteResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyHashCondition: S.optional(S.String),
    ResourceArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteResourcePolicyRequest",
}) as any as S.Schema<DeleteResourcePolicyRequest>;
export interface DeleteResourcePolicyResponse {}
export const DeleteResourcePolicyResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteResourcePolicyResponse",
}) as any as S.Schema<DeleteResourcePolicyResponse>;
export interface DeleteSchemaVersionsInput {
  SchemaId: SchemaId;
  Versions: string;
}
export const DeleteSchemaVersionsInput = S.suspend(() =>
  S.Struct({ SchemaId: SchemaId, Versions: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSchemaVersionsInput",
}) as any as S.Schema<DeleteSchemaVersionsInput>;
export interface DeleteSecurityConfigurationRequest {
  Name: string;
}
export const DeleteSecurityConfigurationRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSecurityConfigurationRequest",
}) as any as S.Schema<DeleteSecurityConfigurationRequest>;
export interface DeleteSecurityConfigurationResponse {}
export const DeleteSecurityConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSecurityConfigurationResponse",
}) as any as S.Schema<DeleteSecurityConfigurationResponse>;
export interface DeleteSessionRequest {
  Id: string;
  RequestOrigin?: string;
}
export const DeleteSessionRequest = S.suspend(() =>
  S.Struct({ Id: S.String, RequestOrigin: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSessionRequest",
}) as any as S.Schema<DeleteSessionRequest>;
export interface DeleteTableRequest {
  CatalogId?: string;
  DatabaseName: string;
  Name: string;
  TransactionId?: string;
}
export const DeleteTableRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    Name: S.String,
    TransactionId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteTableRequest",
}) as any as S.Schema<DeleteTableRequest>;
export interface DeleteTableResponse {}
export const DeleteTableResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteTableResponse",
}) as any as S.Schema<DeleteTableResponse>;
export interface DeleteTableOptimizerRequest {
  CatalogId: string;
  DatabaseName: string;
  TableName: string;
  Type: TableOptimizerType;
}
export const DeleteTableOptimizerRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Type: TableOptimizerType,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteTableOptimizerRequest",
}) as any as S.Schema<DeleteTableOptimizerRequest>;
export interface DeleteTableOptimizerResponse {}
export const DeleteTableOptimizerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTableOptimizerResponse",
}) as any as S.Schema<DeleteTableOptimizerResponse>;
export interface DeleteTableVersionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  VersionId: string;
}
export const DeleteTableVersionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    VersionId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteTableVersionRequest",
}) as any as S.Schema<DeleteTableVersionRequest>;
export interface DeleteTableVersionResponse {}
export const DeleteTableVersionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteTableVersionResponse",
}) as any as S.Schema<DeleteTableVersionResponse>;
export interface DeleteTriggerRequest {
  Name: string;
}
export const DeleteTriggerRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteTriggerRequest",
}) as any as S.Schema<DeleteTriggerRequest>;
export interface DeleteUsageProfileRequest {
  Name: string;
}
export const DeleteUsageProfileRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteUsageProfileRequest",
}) as any as S.Schema<DeleteUsageProfileRequest>;
export interface DeleteUsageProfileResponse {}
export const DeleteUsageProfileResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteUsageProfileResponse",
}) as any as S.Schema<DeleteUsageProfileResponse>;
export interface DeleteUserDefinedFunctionRequest {
  CatalogId?: string;
  DatabaseName: string;
  FunctionName: string;
}
export const DeleteUserDefinedFunctionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    FunctionName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteUserDefinedFunctionRequest",
}) as any as S.Schema<DeleteUserDefinedFunctionRequest>;
export interface DeleteUserDefinedFunctionResponse {}
export const DeleteUserDefinedFunctionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteUserDefinedFunctionResponse",
}) as any as S.Schema<DeleteUserDefinedFunctionResponse>;
export interface DeleteWorkflowRequest {
  Name: string;
}
export const DeleteWorkflowRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteWorkflowRequest",
}) as any as S.Schema<DeleteWorkflowRequest>;
export interface DescribeConnectionTypeRequest {
  ConnectionType: string;
}
export const DescribeConnectionTypeRequest = S.suspend(() =>
  S.Struct({ ConnectionType: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeConnectionTypeRequest",
}) as any as S.Schema<DescribeConnectionTypeRequest>;
export interface DescribeEntityRequest {
  ConnectionName: string;
  CatalogId?: string;
  EntityName: string;
  NextToken?: string;
  DataStoreApiVersion?: string;
}
export const DescribeEntityRequest = S.suspend(() =>
  S.Struct({
    ConnectionName: S.String,
    CatalogId: S.optional(S.String),
    EntityName: S.String,
    NextToken: S.optional(S.String),
    DataStoreApiVersion: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeEntityRequest",
}) as any as S.Schema<DescribeEntityRequest>;
export interface DescribeInboundIntegrationsRequest {
  IntegrationArn?: string;
  Marker?: string;
  MaxRecords?: number;
  TargetArn?: string;
}
export const DescribeInboundIntegrationsRequest = S.suspend(() =>
  S.Struct({
    IntegrationArn: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    TargetArn: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeInboundIntegrationsRequest",
}) as any as S.Schema<DescribeInboundIntegrationsRequest>;
export interface GetBlueprintRequest {
  Name: string;
  IncludeBlueprint?: boolean;
  IncludeParameterSpec?: boolean;
}
export const GetBlueprintRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    IncludeBlueprint: S.optional(S.Boolean),
    IncludeParameterSpec: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetBlueprintRequest",
}) as any as S.Schema<GetBlueprintRequest>;
export interface GetBlueprintRunRequest {
  BlueprintName: string;
  RunId: string;
}
export const GetBlueprintRunRequest = S.suspend(() =>
  S.Struct({ BlueprintName: S.String, RunId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetBlueprintRunRequest",
}) as any as S.Schema<GetBlueprintRunRequest>;
export interface GetBlueprintRunsRequest {
  BlueprintName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const GetBlueprintRunsRequest = S.suspend(() =>
  S.Struct({
    BlueprintName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetBlueprintRunsRequest",
}) as any as S.Schema<GetBlueprintRunsRequest>;
export interface GetCatalogRequest {
  CatalogId: string;
}
export const GetCatalogRequest = S.suspend(() =>
  S.Struct({ CatalogId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCatalogRequest",
}) as any as S.Schema<GetCatalogRequest>;
export interface GetCatalogImportStatusRequest {
  CatalogId?: string;
}
export const GetCatalogImportStatusRequest = S.suspend(() =>
  S.Struct({ CatalogId: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCatalogImportStatusRequest",
}) as any as S.Schema<GetCatalogImportStatusRequest>;
export interface GetCatalogsRequest {
  ParentCatalogId?: string;
  NextToken?: string;
  MaxResults?: number;
  Recursive?: boolean;
  IncludeRoot?: boolean;
}
export const GetCatalogsRequest = S.suspend(() =>
  S.Struct({
    ParentCatalogId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Recursive: S.optional(S.Boolean),
    IncludeRoot: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCatalogsRequest",
}) as any as S.Schema<GetCatalogsRequest>;
export interface GetClassifierRequest {
  Name: string;
}
export const GetClassifierRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetClassifierRequest",
}) as any as S.Schema<GetClassifierRequest>;
export interface GetClassifiersRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const GetClassifiersRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetClassifiersRequest",
}) as any as S.Schema<GetClassifiersRequest>;
export interface GetColumnStatisticsForPartitionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  PartitionValues: string[];
  ColumnNames: string[];
}
export const GetColumnStatisticsForPartitionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValues: ValueStringList,
    ColumnNames: GetColumnNamesList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetColumnStatisticsForPartitionRequest",
}) as any as S.Schema<GetColumnStatisticsForPartitionRequest>;
export interface GetColumnStatisticsForTableRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  ColumnNames: string[];
}
export const GetColumnStatisticsForTableRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    ColumnNames: GetColumnNamesList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetColumnStatisticsForTableRequest",
}) as any as S.Schema<GetColumnStatisticsForTableRequest>;
export interface GetColumnStatisticsTaskRunRequest {
  ColumnStatisticsTaskRunId: string;
}
export const GetColumnStatisticsTaskRunRequest = S.suspend(() =>
  S.Struct({ ColumnStatisticsTaskRunId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetColumnStatisticsTaskRunRequest",
}) as any as S.Schema<GetColumnStatisticsTaskRunRequest>;
export interface GetColumnStatisticsTaskRunsRequest {
  DatabaseName: string;
  TableName: string;
  MaxResults?: number;
  NextToken?: string;
}
export const GetColumnStatisticsTaskRunsRequest = S.suspend(() =>
  S.Struct({
    DatabaseName: S.String,
    TableName: S.String,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetColumnStatisticsTaskRunsRequest",
}) as any as S.Schema<GetColumnStatisticsTaskRunsRequest>;
export interface GetColumnStatisticsTaskSettingsRequest {
  DatabaseName: string;
  TableName: string;
}
export const GetColumnStatisticsTaskSettingsRequest = S.suspend(() =>
  S.Struct({ DatabaseName: S.String, TableName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetColumnStatisticsTaskSettingsRequest",
}) as any as S.Schema<GetColumnStatisticsTaskSettingsRequest>;
export interface GetConnectionRequest {
  CatalogId?: string;
  Name: string;
  HidePassword?: boolean;
  ApplyOverrideForComputeEnvironment?: ComputeEnvironment;
}
export const GetConnectionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    Name: S.String,
    HidePassword: S.optional(S.Boolean),
    ApplyOverrideForComputeEnvironment: S.optional(ComputeEnvironment),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetConnectionRequest",
}) as any as S.Schema<GetConnectionRequest>;
export interface GetCrawlerRequest {
  Name: string;
}
export const GetCrawlerRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCrawlerRequest",
}) as any as S.Schema<GetCrawlerRequest>;
export interface GetCrawlerMetricsRequest {
  CrawlerNameList?: string[];
  MaxResults?: number;
  NextToken?: string;
}
export const GetCrawlerMetricsRequest = S.suspend(() =>
  S.Struct({
    CrawlerNameList: S.optional(CrawlerNameList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCrawlerMetricsRequest",
}) as any as S.Schema<GetCrawlerMetricsRequest>;
export interface GetCrawlersRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const GetCrawlersRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCrawlersRequest",
}) as any as S.Schema<GetCrawlersRequest>;
export interface GetCustomEntityTypeRequest {
  Name: string;
}
export const GetCustomEntityTypeRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetCustomEntityTypeRequest",
}) as any as S.Schema<GetCustomEntityTypeRequest>;
export interface GetDatabaseRequest {
  CatalogId?: string;
  Name: string;
}
export const GetDatabaseRequest = S.suspend(() =>
  S.Struct({ CatalogId: S.optional(S.String), Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDatabaseRequest",
}) as any as S.Schema<GetDatabaseRequest>;
export interface GetDatabasesRequest {
  CatalogId?: string;
  NextToken?: string;
  MaxResults?: number;
  ResourceShareType?: ResourceShareType;
  AttributesToGet?: DatabaseAttributes[];
}
export const GetDatabasesRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    ResourceShareType: S.optional(ResourceShareType),
    AttributesToGet: S.optional(DatabaseAttributesList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDatabasesRequest",
}) as any as S.Schema<GetDatabasesRequest>;
export interface GetDataCatalogEncryptionSettingsRequest {
  CatalogId?: string;
}
export const GetDataCatalogEncryptionSettingsRequest = S.suspend(() =>
  S.Struct({ CatalogId: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDataCatalogEncryptionSettingsRequest",
}) as any as S.Schema<GetDataCatalogEncryptionSettingsRequest>;
export interface GetDataflowGraphRequest {
  PythonScript?: string;
}
export const GetDataflowGraphRequest = S.suspend(() =>
  S.Struct({ PythonScript: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDataflowGraphRequest",
}) as any as S.Schema<GetDataflowGraphRequest>;
export interface GetDataQualityModelRequest {
  StatisticId?: string;
  ProfileId: string;
}
export const GetDataQualityModelRequest = S.suspend(() =>
  S.Struct({ StatisticId: S.optional(S.String), ProfileId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDataQualityModelRequest",
}) as any as S.Schema<GetDataQualityModelRequest>;
export interface GetDataQualityModelResultRequest {
  StatisticId: string;
  ProfileId: string;
}
export const GetDataQualityModelResultRequest = S.suspend(() =>
  S.Struct({ StatisticId: S.String, ProfileId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDataQualityModelResultRequest",
}) as any as S.Schema<GetDataQualityModelResultRequest>;
export interface GetDataQualityResultRequest {
  ResultId: string;
}
export const GetDataQualityResultRequest = S.suspend(() =>
  S.Struct({ ResultId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDataQualityResultRequest",
}) as any as S.Schema<GetDataQualityResultRequest>;
export interface GetDataQualityRuleRecommendationRunRequest {
  RunId: string;
}
export const GetDataQualityRuleRecommendationRunRequest = S.suspend(() =>
  S.Struct({ RunId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDataQualityRuleRecommendationRunRequest",
}) as any as S.Schema<GetDataQualityRuleRecommendationRunRequest>;
export interface GetDataQualityRulesetRequest {
  Name: string;
}
export const GetDataQualityRulesetRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDataQualityRulesetRequest",
}) as any as S.Schema<GetDataQualityRulesetRequest>;
export interface GetDataQualityRulesetEvaluationRunRequest {
  RunId: string;
}
export const GetDataQualityRulesetEvaluationRunRequest = S.suspend(() =>
  S.Struct({ RunId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDataQualityRulesetEvaluationRunRequest",
}) as any as S.Schema<GetDataQualityRulesetEvaluationRunRequest>;
export interface GetDevEndpointRequest {
  EndpointName: string;
}
export const GetDevEndpointRequest = S.suspend(() =>
  S.Struct({ EndpointName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDevEndpointRequest",
}) as any as S.Schema<GetDevEndpointRequest>;
export interface GetDevEndpointsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const GetDevEndpointsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetDevEndpointsRequest",
}) as any as S.Schema<GetDevEndpointsRequest>;
export interface GetGlueIdentityCenterConfigurationResponse {
  ApplicationArn?: string;
  InstanceArn?: string;
  Scopes?: string[];
  UserBackgroundSessionsEnabled?: boolean;
}
export const GetGlueIdentityCenterConfigurationResponse = S.suspend(() =>
  S.Struct({
    ApplicationArn: S.optional(S.String),
    InstanceArn: S.optional(S.String),
    Scopes: S.optional(OrchestrationStringList),
    UserBackgroundSessionsEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetGlueIdentityCenterConfigurationResponse",
}) as any as S.Schema<GetGlueIdentityCenterConfigurationResponse>;
export interface GetIntegrationResourcePropertyRequest {
  ResourceArn: string;
}
export const GetIntegrationResourcePropertyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetIntegrationResourcePropertyRequest",
}) as any as S.Schema<GetIntegrationResourcePropertyRequest>;
export interface GetIntegrationTablePropertiesRequest {
  ResourceArn: string;
  TableName: string;
}
export const GetIntegrationTablePropertiesRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TableName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetIntegrationTablePropertiesRequest",
}) as any as S.Schema<GetIntegrationTablePropertiesRequest>;
export interface GetJobRequest {
  JobName: string;
}
export const GetJobRequest = S.suspend(() =>
  S.Struct({ JobName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetJobRequest",
}) as any as S.Schema<GetJobRequest>;
export interface GetJobBookmarkRequest {
  JobName: string;
  RunId?: string;
}
export const GetJobBookmarkRequest = S.suspend(() =>
  S.Struct({ JobName: S.String, RunId: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetJobBookmarkRequest",
}) as any as S.Schema<GetJobBookmarkRequest>;
export interface GetJobRunRequest {
  JobName: string;
  RunId: string;
  PredecessorsIncluded?: boolean;
}
export const GetJobRunRequest = S.suspend(() =>
  S.Struct({
    JobName: S.String,
    RunId: S.String,
    PredecessorsIncluded: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetJobRunRequest",
}) as any as S.Schema<GetJobRunRequest>;
export interface GetJobRunsRequest {
  JobName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const GetJobRunsRequest = S.suspend(() =>
  S.Struct({
    JobName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetJobRunsRequest",
}) as any as S.Schema<GetJobRunsRequest>;
export interface GetJobsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const GetJobsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetJobsRequest",
}) as any as S.Schema<GetJobsRequest>;
export interface GetMaterializedViewRefreshTaskRunRequest {
  CatalogId: string;
  MaterializedViewRefreshTaskRunId: string;
}
export const GetMaterializedViewRefreshTaskRunRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.String,
    MaterializedViewRefreshTaskRunId: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetMaterializedViewRefreshTaskRunRequest",
}) as any as S.Schema<GetMaterializedViewRefreshTaskRunRequest>;
export interface GetMLTaskRunRequest {
  TransformId: string;
  TaskRunId: string;
}
export const GetMLTaskRunRequest = S.suspend(() =>
  S.Struct({ TransformId: S.String, TaskRunId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetMLTaskRunRequest",
}) as any as S.Schema<GetMLTaskRunRequest>;
export interface GetMLTransformRequest {
  TransformId: string;
}
export const GetMLTransformRequest = S.suspend(() =>
  S.Struct({ TransformId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetMLTransformRequest",
}) as any as S.Schema<GetMLTransformRequest>;
export interface GetPartitionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  PartitionValues: string[];
}
export const GetPartitionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValues: ValueStringList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPartitionRequest",
}) as any as S.Schema<GetPartitionRequest>;
export interface GetPartitionIndexesRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  NextToken?: string;
}
export const GetPartitionIndexesRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPartitionIndexesRequest",
}) as any as S.Schema<GetPartitionIndexesRequest>;
export interface GetRegistryInput {
  RegistryId: RegistryId;
}
export const GetRegistryInput = S.suspend(() =>
  S.Struct({ RegistryId: RegistryId }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRegistryInput",
}) as any as S.Schema<GetRegistryInput>;
export interface GetResourcePoliciesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const GetResourcePoliciesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourcePoliciesRequest",
}) as any as S.Schema<GetResourcePoliciesRequest>;
export interface GetResourcePolicyRequest {
  ResourceArn?: string;
}
export const GetResourcePolicyRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetResourcePolicyRequest",
}) as any as S.Schema<GetResourcePolicyRequest>;
export interface GetSchemaInput {
  SchemaId: SchemaId;
}
export const GetSchemaInput = S.suspend(() =>
  S.Struct({ SchemaId: SchemaId }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSchemaInput",
}) as any as S.Schema<GetSchemaInput>;
export interface GetSchemaByDefinitionInput {
  SchemaId: SchemaId;
  SchemaDefinition: string;
}
export const GetSchemaByDefinitionInput = S.suspend(() =>
  S.Struct({ SchemaId: SchemaId, SchemaDefinition: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSchemaByDefinitionInput",
}) as any as S.Schema<GetSchemaByDefinitionInput>;
export interface SchemaVersionNumber {
  LatestVersion?: boolean;
  VersionNumber?: number;
}
export const SchemaVersionNumber = S.suspend(() =>
  S.Struct({
    LatestVersion: S.optional(S.Boolean),
    VersionNumber: S.optional(S.Number),
  }),
).annotations({
  identifier: "SchemaVersionNumber",
}) as any as S.Schema<SchemaVersionNumber>;
export interface GetSchemaVersionsDiffInput {
  SchemaId: SchemaId;
  FirstSchemaVersionNumber: SchemaVersionNumber;
  SecondSchemaVersionNumber: SchemaVersionNumber;
  SchemaDiffType: SchemaDiffType;
}
export const GetSchemaVersionsDiffInput = S.suspend(() =>
  S.Struct({
    SchemaId: SchemaId,
    FirstSchemaVersionNumber: SchemaVersionNumber,
    SecondSchemaVersionNumber: SchemaVersionNumber,
    SchemaDiffType: SchemaDiffType,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSchemaVersionsDiffInput",
}) as any as S.Schema<GetSchemaVersionsDiffInput>;
export interface GetSecurityConfigurationRequest {
  Name: string;
}
export const GetSecurityConfigurationRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSecurityConfigurationRequest",
}) as any as S.Schema<GetSecurityConfigurationRequest>;
export interface GetSecurityConfigurationsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const GetSecurityConfigurationsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSecurityConfigurationsRequest",
}) as any as S.Schema<GetSecurityConfigurationsRequest>;
export interface GetSessionRequest {
  Id: string;
  RequestOrigin?: string;
}
export const GetSessionRequest = S.suspend(() =>
  S.Struct({ Id: S.String, RequestOrigin: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSessionRequest",
}) as any as S.Schema<GetSessionRequest>;
export interface GetStatementRequest {
  SessionId: string;
  Id: number;
  RequestOrigin?: string;
}
export const GetStatementRequest = S.suspend(() =>
  S.Struct({
    SessionId: S.String,
    Id: S.Number,
    RequestOrigin: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetStatementRequest",
}) as any as S.Schema<GetStatementRequest>;
export interface GetTableOptimizerRequest {
  CatalogId: string;
  DatabaseName: string;
  TableName: string;
  Type: TableOptimizerType;
}
export const GetTableOptimizerRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Type: TableOptimizerType,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTableOptimizerRequest",
}) as any as S.Schema<GetTableOptimizerRequest>;
export type AuditColumnNamesList = string[];
export const AuditColumnNamesList = S.Array(S.String);
export interface AuditContext {
  AdditionalAuditContext?: string;
  RequestedColumns?: string[];
  AllColumnsRequested?: boolean;
}
export const AuditContext = S.suspend(() =>
  S.Struct({
    AdditionalAuditContext: S.optional(S.String),
    RequestedColumns: S.optional(AuditColumnNamesList),
    AllColumnsRequested: S.optional(S.Boolean),
  }),
).annotations({ identifier: "AuditContext" }) as any as S.Schema<AuditContext>;
export interface GetTablesRequest {
  CatalogId?: string;
  DatabaseName: string;
  Expression?: string;
  NextToken?: string;
  MaxResults?: number;
  TransactionId?: string;
  QueryAsOfTime?: Date;
  AuditContext?: AuditContext;
  IncludeStatusDetails?: boolean;
  AttributesToGet?: TableAttributes[];
}
export const GetTablesRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTablesRequest",
}) as any as S.Schema<GetTablesRequest>;
export interface GetTableVersionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  VersionId?: string;
}
export const GetTableVersionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    VersionId: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTableVersionRequest",
}) as any as S.Schema<GetTableVersionRequest>;
export interface GetTableVersionsRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  NextToken?: string;
  MaxResults?: number;
}
export const GetTableVersionsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTableVersionsRequest",
}) as any as S.Schema<GetTableVersionsRequest>;
export interface GetTagsRequest {
  ResourceArn: string;
}
export const GetTagsRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTagsRequest",
}) as any as S.Schema<GetTagsRequest>;
export interface GetTriggerRequest {
  Name: string;
}
export const GetTriggerRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTriggerRequest",
}) as any as S.Schema<GetTriggerRequest>;
export interface GetTriggersRequest {
  NextToken?: string;
  DependentJobName?: string;
  MaxResults?: number;
}
export const GetTriggersRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    DependentJobName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTriggersRequest",
}) as any as S.Schema<GetTriggersRequest>;
export interface Segment {
  SegmentNumber: number;
  TotalSegments: number;
}
export const Segment = S.suspend(() =>
  S.Struct({ SegmentNumber: S.Number, TotalSegments: S.Number }),
).annotations({ identifier: "Segment" }) as any as S.Schema<Segment>;
export type AdditionalContextMap = { [key: string]: string | undefined };
export const AdditionalContextMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface QuerySessionContext {
  QueryId?: string;
  QueryStartTime?: Date;
  ClusterId?: string;
  QueryAuthorizationId?: string;
  AdditionalContext?: { [key: string]: string | undefined };
}
export const QuerySessionContext = S.suspend(() =>
  S.Struct({
    QueryId: S.optional(S.String),
    QueryStartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ClusterId: S.optional(S.String),
    QueryAuthorizationId: S.optional(S.String),
    AdditionalContext: S.optional(AdditionalContextMap),
  }),
).annotations({
  identifier: "QuerySessionContext",
}) as any as S.Schema<QuerySessionContext>;
export interface GetUnfilteredPartitionsMetadataRequest {
  Region?: string;
  CatalogId: string;
  DatabaseName: string;
  TableName: string;
  Expression?: string;
  AuditContext?: AuditContext;
  SupportedPermissionTypes: PermissionType[];
  NextToken?: string;
  Segment?: Segment;
  MaxResults?: number;
  QuerySessionContext?: QuerySessionContext;
}
export const GetUnfilteredPartitionsMetadataRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetUnfilteredPartitionsMetadataRequest",
}) as any as S.Schema<GetUnfilteredPartitionsMetadataRequest>;
export interface GetUsageProfileRequest {
  Name: string;
}
export const GetUsageProfileRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetUsageProfileRequest",
}) as any as S.Schema<GetUsageProfileRequest>;
export interface GetUserDefinedFunctionRequest {
  CatalogId?: string;
  DatabaseName: string;
  FunctionName: string;
}
export const GetUserDefinedFunctionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    FunctionName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetUserDefinedFunctionRequest",
}) as any as S.Schema<GetUserDefinedFunctionRequest>;
export interface GetUserDefinedFunctionsRequest {
  CatalogId?: string;
  DatabaseName?: string;
  Pattern: string;
  FunctionType?: FunctionType;
  NextToken?: string;
  MaxResults?: number;
}
export const GetUserDefinedFunctionsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    Pattern: S.String,
    FunctionType: S.optional(FunctionType),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetUserDefinedFunctionsRequest",
}) as any as S.Schema<GetUserDefinedFunctionsRequest>;
export interface GetWorkflowRequest {
  Name: string;
  IncludeGraph?: boolean;
}
export const GetWorkflowRequest = S.suspend(() =>
  S.Struct({ Name: S.String, IncludeGraph: S.optional(S.Boolean) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetWorkflowRequest",
}) as any as S.Schema<GetWorkflowRequest>;
export interface GetWorkflowRunRequest {
  Name: string;
  RunId: string;
  IncludeGraph?: boolean;
}
export const GetWorkflowRunRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    RunId: S.String,
    IncludeGraph: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetWorkflowRunRequest",
}) as any as S.Schema<GetWorkflowRunRequest>;
export interface GetWorkflowRunPropertiesRequest {
  Name: string;
  RunId: string;
}
export const GetWorkflowRunPropertiesRequest = S.suspend(() =>
  S.Struct({ Name: S.String, RunId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetWorkflowRunPropertiesRequest",
}) as any as S.Schema<GetWorkflowRunPropertiesRequest>;
export interface GetWorkflowRunsRequest {
  Name: string;
  IncludeGraph?: boolean;
  NextToken?: string;
  MaxResults?: number;
}
export const GetWorkflowRunsRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    IncludeGraph: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetWorkflowRunsRequest",
}) as any as S.Schema<GetWorkflowRunsRequest>;
export interface ImportCatalogToGlueRequest {
  CatalogId?: string;
}
export const ImportCatalogToGlueRequest = S.suspend(() =>
  S.Struct({ CatalogId: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ImportCatalogToGlueRequest",
}) as any as S.Schema<ImportCatalogToGlueRequest>;
export interface ImportCatalogToGlueResponse {}
export const ImportCatalogToGlueResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "ImportCatalogToGlueResponse",
}) as any as S.Schema<ImportCatalogToGlueResponse>;
export interface ListBlueprintsRequest {
  NextToken?: string;
  MaxResults?: number;
  Tags?: { [key: string]: string | undefined };
}
export const ListBlueprintsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListBlueprintsRequest",
}) as any as S.Schema<ListBlueprintsRequest>;
export interface ListColumnStatisticsTaskRunsRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListColumnStatisticsTaskRunsRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListColumnStatisticsTaskRunsRequest",
}) as any as S.Schema<ListColumnStatisticsTaskRunsRequest>;
export interface ListConnectionTypesRequest {
  MaxResults?: number;
  NextToken?: string;
}
export const ListConnectionTypesRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListConnectionTypesRequest",
}) as any as S.Schema<ListConnectionTypesRequest>;
export interface ListCrawlersRequest {
  MaxResults?: number;
  NextToken?: string;
  Tags?: { [key: string]: string | undefined };
}
export const ListCrawlersRequest = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCrawlersRequest",
}) as any as S.Schema<ListCrawlersRequest>;
export interface ListCustomEntityTypesRequest {
  NextToken?: string;
  MaxResults?: number;
  Tags?: { [key: string]: string | undefined };
}
export const ListCustomEntityTypesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCustomEntityTypesRequest",
}) as any as S.Schema<ListCustomEntityTypesRequest>;
export interface TimestampFilter {
  RecordedBefore?: Date;
  RecordedAfter?: Date;
}
export const TimestampFilter = S.suspend(() =>
  S.Struct({
    RecordedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RecordedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "TimestampFilter",
}) as any as S.Schema<TimestampFilter>;
export interface ListDataQualityStatisticsRequest {
  StatisticId?: string;
  ProfileId?: string;
  TimestampFilter?: TimestampFilter;
  MaxResults?: number;
  NextToken?: string;
}
export const ListDataQualityStatisticsRequest = S.suspend(() =>
  S.Struct({
    StatisticId: S.optional(S.String),
    ProfileId: S.optional(S.String),
    TimestampFilter: S.optional(TimestampFilter),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDataQualityStatisticsRequest",
}) as any as S.Schema<ListDataQualityStatisticsRequest>;
export interface ListDevEndpointsRequest {
  NextToken?: string;
  MaxResults?: number;
  Tags?: { [key: string]: string | undefined };
}
export const ListDevEndpointsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDevEndpointsRequest",
}) as any as S.Schema<ListDevEndpointsRequest>;
export interface ListEntitiesRequest {
  ConnectionName?: string;
  CatalogId?: string;
  ParentEntityName?: string;
  NextToken?: string;
  DataStoreApiVersion?: string;
}
export const ListEntitiesRequest = S.suspend(() =>
  S.Struct({
    ConnectionName: S.optional(S.String),
    CatalogId: S.optional(S.String),
    ParentEntityName: S.optional(S.String),
    NextToken: S.optional(S.String),
    DataStoreApiVersion: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListEntitiesRequest",
}) as any as S.Schema<ListEntitiesRequest>;
export interface ListJobsRequest {
  NextToken?: string;
  MaxResults?: number;
  Tags?: { [key: string]: string | undefined };
}
export const ListJobsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListJobsRequest",
}) as any as S.Schema<ListJobsRequest>;
export interface ListMaterializedViewRefreshTaskRunsRequest {
  CatalogId: string;
  DatabaseName?: string;
  TableName?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const ListMaterializedViewRefreshTaskRunsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.String,
    DatabaseName: S.optional(S.String),
    TableName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMaterializedViewRefreshTaskRunsRequest",
}) as any as S.Schema<ListMaterializedViewRefreshTaskRunsRequest>;
export type TransformType = "FIND_MATCHES" | (string & {});
export const TransformType = S.String;
export type TransformStatusType =
  | "NOT_READY"
  | "READY"
  | "DELETING"
  | (string & {});
export const TransformStatusType = S.String;
export interface SchemaColumn {
  Name?: string;
  DataType?: string;
}
export const SchemaColumn = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), DataType: S.optional(S.String) }),
).annotations({ identifier: "SchemaColumn" }) as any as S.Schema<SchemaColumn>;
export type TransformSchema = SchemaColumn[];
export const TransformSchema = S.Array(SchemaColumn);
export interface TransformFilterCriteria {
  Name?: string;
  TransformType?: TransformType;
  Status?: TransformStatusType;
  GlueVersion?: string;
  CreatedBefore?: Date;
  CreatedAfter?: Date;
  LastModifiedBefore?: Date;
  LastModifiedAfter?: Date;
  Schema?: SchemaColumn[];
}
export const TransformFilterCriteria = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    TransformType: S.optional(TransformType),
    Status: S.optional(TransformStatusType),
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
  }),
).annotations({
  identifier: "TransformFilterCriteria",
}) as any as S.Schema<TransformFilterCriteria>;
export type TransformSortColumnType =
  | "NAME"
  | "TRANSFORM_TYPE"
  | "STATUS"
  | "CREATED"
  | "LAST_MODIFIED"
  | (string & {});
export const TransformSortColumnType = S.String;
export type SortDirectionType = "DESCENDING" | "ASCENDING" | (string & {});
export const SortDirectionType = S.String;
export interface TransformSortCriteria {
  Column: TransformSortColumnType;
  SortDirection: SortDirectionType;
}
export const TransformSortCriteria = S.suspend(() =>
  S.Struct({
    Column: TransformSortColumnType,
    SortDirection: SortDirectionType,
  }),
).annotations({
  identifier: "TransformSortCriteria",
}) as any as S.Schema<TransformSortCriteria>;
export interface ListMLTransformsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filter?: TransformFilterCriteria;
  Sort?: TransformSortCriteria;
  Tags?: { [key: string]: string | undefined };
}
export const ListMLTransformsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filter: S.optional(TransformFilterCriteria),
    Sort: S.optional(TransformSortCriteria),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListMLTransformsRequest",
}) as any as S.Schema<ListMLTransformsRequest>;
export interface ListRegistriesInput {
  MaxResults?: number;
  NextToken?: string;
}
export const ListRegistriesInput = S.suspend(() =>
  S.Struct({
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListRegistriesInput",
}) as any as S.Schema<ListRegistriesInput>;
export interface ListSchemasInput {
  RegistryId?: RegistryId;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSchemasInput = S.suspend(() =>
  S.Struct({
    RegistryId: S.optional(RegistryId),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSchemasInput",
}) as any as S.Schema<ListSchemasInput>;
export interface ListSchemaVersionsInput {
  SchemaId: SchemaId;
  MaxResults?: number;
  NextToken?: string;
}
export const ListSchemaVersionsInput = S.suspend(() =>
  S.Struct({
    SchemaId: SchemaId,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSchemaVersionsInput",
}) as any as S.Schema<ListSchemaVersionsInput>;
export interface ListSessionsRequest {
  NextToken?: string;
  MaxResults?: number;
  Tags?: { [key: string]: string | undefined };
  RequestOrigin?: string;
}
export const ListSessionsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Tags: S.optional(TagsMap),
    RequestOrigin: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListSessionsRequest",
}) as any as S.Schema<ListSessionsRequest>;
export interface ListStatementsRequest {
  SessionId: string;
  RequestOrigin?: string;
  NextToken?: string;
}
export const ListStatementsRequest = S.suspend(() =>
  S.Struct({
    SessionId: S.String,
    RequestOrigin: S.optional(S.String),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListStatementsRequest",
}) as any as S.Schema<ListStatementsRequest>;
export interface ListTableOptimizerRunsRequest {
  CatalogId: string;
  DatabaseName: string;
  TableName: string;
  Type: TableOptimizerType;
  MaxResults?: number;
  NextToken?: string;
}
export const ListTableOptimizerRunsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Type: TableOptimizerType,
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTableOptimizerRunsRequest",
}) as any as S.Schema<ListTableOptimizerRunsRequest>;
export interface ListTriggersRequest {
  NextToken?: string;
  DependentJobName?: string;
  MaxResults?: number;
  Tags?: { [key: string]: string | undefined };
}
export const ListTriggersRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    DependentJobName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTriggersRequest",
}) as any as S.Schema<ListTriggersRequest>;
export interface ListUsageProfilesRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListUsageProfilesRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListUsageProfilesRequest",
}) as any as S.Schema<ListUsageProfilesRequest>;
export interface ListWorkflowsRequest {
  NextToken?: string;
  MaxResults?: number;
}
export const ListWorkflowsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListWorkflowsRequest",
}) as any as S.Schema<ListWorkflowsRequest>;
export type IntegrationSourcePropertiesMap = {
  [key: string]: string | undefined;
};
export const IntegrationSourcePropertiesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface IntegrationConfig {
  RefreshInterval?: string;
  SourceProperties?: { [key: string]: string | undefined };
  ContinuousSync?: boolean;
}
export const IntegrationConfig = S.suspend(() =>
  S.Struct({
    RefreshInterval: S.optional(S.String),
    SourceProperties: S.optional(IntegrationSourcePropertiesMap),
    ContinuousSync: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "IntegrationConfig",
}) as any as S.Schema<IntegrationConfig>;
export interface ModifyIntegrationRequest {
  IntegrationIdentifier: string;
  Description?: string;
  DataFilter?: string;
  IntegrationConfig?: IntegrationConfig;
  IntegrationName?: string;
}
export const ModifyIntegrationRequest = S.suspend(() =>
  S.Struct({
    IntegrationIdentifier: S.String,
    Description: S.optional(S.String),
    DataFilter: S.optional(S.String),
    IntegrationConfig: S.optional(IntegrationConfig),
    IntegrationName: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ModifyIntegrationRequest",
}) as any as S.Schema<ModifyIntegrationRequest>;
export interface PutDataQualityProfileAnnotationRequest {
  ProfileId: string;
  InclusionAnnotation: InclusionAnnotationValue;
}
export const PutDataQualityProfileAnnotationRequest = S.suspend(() =>
  S.Struct({
    ProfileId: S.String,
    InclusionAnnotation: InclusionAnnotationValue,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutDataQualityProfileAnnotationRequest",
}) as any as S.Schema<PutDataQualityProfileAnnotationRequest>;
export interface PutDataQualityProfileAnnotationResponse {}
export const PutDataQualityProfileAnnotationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutDataQualityProfileAnnotationResponse",
}) as any as S.Schema<PutDataQualityProfileAnnotationResponse>;
export interface PutResourcePolicyRequest {
  PolicyInJson: string;
  ResourceArn?: string;
  PolicyHashCondition?: string;
  PolicyExistsCondition?: ExistCondition;
  EnableHybrid?: EnableHybridValues;
}
export const PutResourcePolicyRequest = S.suspend(() =>
  S.Struct({
    PolicyInJson: S.String,
    ResourceArn: S.optional(S.String),
    PolicyHashCondition: S.optional(S.String),
    PolicyExistsCondition: S.optional(ExistCondition),
    EnableHybrid: S.optional(EnableHybridValues),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutResourcePolicyRequest",
}) as any as S.Schema<PutResourcePolicyRequest>;
export type WorkflowRunProperties = { [key: string]: string | undefined };
export const WorkflowRunProperties = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface PutWorkflowRunPropertiesRequest {
  Name: string;
  RunId: string;
  RunProperties: { [key: string]: string | undefined };
}
export const PutWorkflowRunPropertiesRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    RunId: S.String,
    RunProperties: WorkflowRunProperties,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutWorkflowRunPropertiesRequest",
}) as any as S.Schema<PutWorkflowRunPropertiesRequest>;
export interface PutWorkflowRunPropertiesResponse {}
export const PutWorkflowRunPropertiesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutWorkflowRunPropertiesResponse",
}) as any as S.Schema<PutWorkflowRunPropertiesResponse>;
export interface QuerySchemaVersionMetadataInput {
  SchemaId?: SchemaId;
  SchemaVersionNumber?: SchemaVersionNumber;
  SchemaVersionId?: string;
  MetadataList?: MetadataKeyValuePair[];
  MaxResults?: number;
  NextToken?: string;
}
export const QuerySchemaVersionMetadataInput = S.suspend(() =>
  S.Struct({
    SchemaId: S.optional(SchemaId),
    SchemaVersionNumber: S.optional(SchemaVersionNumber),
    SchemaVersionId: S.optional(S.String),
    MetadataList: S.optional(MetadataList),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "QuerySchemaVersionMetadataInput",
}) as any as S.Schema<QuerySchemaVersionMetadataInput>;
export interface RegisterSchemaVersionInput {
  SchemaId: SchemaId;
  SchemaDefinition: string;
}
export const RegisterSchemaVersionInput = S.suspend(() =>
  S.Struct({ SchemaId: SchemaId, SchemaDefinition: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RegisterSchemaVersionInput",
}) as any as S.Schema<RegisterSchemaVersionInput>;
export interface RemoveSchemaVersionMetadataInput {
  SchemaId?: SchemaId;
  SchemaVersionNumber?: SchemaVersionNumber;
  SchemaVersionId?: string;
  MetadataKeyValue: MetadataKeyValuePair;
}
export const RemoveSchemaVersionMetadataInput = S.suspend(() =>
  S.Struct({
    SchemaId: S.optional(SchemaId),
    SchemaVersionNumber: S.optional(SchemaVersionNumber),
    SchemaVersionId: S.optional(S.String),
    MetadataKeyValue: MetadataKeyValuePair,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RemoveSchemaVersionMetadataInput",
}) as any as S.Schema<RemoveSchemaVersionMetadataInput>;
export interface ResetJobBookmarkRequest {
  JobName: string;
  RunId?: string;
}
export const ResetJobBookmarkRequest = S.suspend(() =>
  S.Struct({ JobName: S.String, RunId: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ResetJobBookmarkRequest",
}) as any as S.Schema<ResetJobBookmarkRequest>;
export interface ResumeWorkflowRunRequest {
  Name: string;
  RunId: string;
  NodeIds: string[];
}
export const ResumeWorkflowRunRequest = S.suspend(() =>
  S.Struct({ Name: S.String, RunId: S.String, NodeIds: NodeIdList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ResumeWorkflowRunRequest",
}) as any as S.Schema<ResumeWorkflowRunRequest>;
export interface RunStatementRequest {
  SessionId: string;
  Code: string;
  RequestOrigin?: string;
}
export const RunStatementRequest = S.suspend(() =>
  S.Struct({
    SessionId: S.String,
    Code: S.String,
    RequestOrigin: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RunStatementRequest",
}) as any as S.Schema<RunStatementRequest>;
export interface StartBlueprintRunRequest {
  BlueprintName: string;
  Parameters?: string;
  RoleArn: string;
}
export const StartBlueprintRunRequest = S.suspend(() =>
  S.Struct({
    BlueprintName: S.String,
    Parameters: S.optional(S.String),
    RoleArn: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartBlueprintRunRequest",
}) as any as S.Schema<StartBlueprintRunRequest>;
export interface StartColumnStatisticsTaskRunRequest {
  DatabaseName: string;
  TableName: string;
  ColumnNameList?: string[];
  Role: string;
  SampleSize?: number;
  CatalogID?: string;
  SecurityConfiguration?: string;
}
export const StartColumnStatisticsTaskRunRequest = S.suspend(() =>
  S.Struct({
    DatabaseName: S.String,
    TableName: S.String,
    ColumnNameList: S.optional(ColumnNameList),
    Role: S.String,
    SampleSize: S.optional(S.Number),
    CatalogID: S.optional(S.String),
    SecurityConfiguration: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartColumnStatisticsTaskRunRequest",
}) as any as S.Schema<StartColumnStatisticsTaskRunRequest>;
export interface StartColumnStatisticsTaskRunScheduleRequest {
  DatabaseName: string;
  TableName: string;
}
export const StartColumnStatisticsTaskRunScheduleRequest = S.suspend(() =>
  S.Struct({ DatabaseName: S.String, TableName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartColumnStatisticsTaskRunScheduleRequest",
}) as any as S.Schema<StartColumnStatisticsTaskRunScheduleRequest>;
export interface StartColumnStatisticsTaskRunScheduleResponse {}
export const StartColumnStatisticsTaskRunScheduleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartColumnStatisticsTaskRunScheduleResponse",
}) as any as S.Schema<StartColumnStatisticsTaskRunScheduleResponse>;
export interface StartCrawlerRequest {
  Name: string;
}
export const StartCrawlerRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartCrawlerRequest",
}) as any as S.Schema<StartCrawlerRequest>;
export interface StartCrawlerResponse {}
export const StartCrawlerResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StartCrawlerResponse",
}) as any as S.Schema<StartCrawlerResponse>;
export interface StartCrawlerScheduleRequest {
  CrawlerName: string;
}
export const StartCrawlerScheduleRequest = S.suspend(() =>
  S.Struct({ CrawlerName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartCrawlerScheduleRequest",
}) as any as S.Schema<StartCrawlerScheduleRequest>;
export interface StartCrawlerScheduleResponse {}
export const StartCrawlerScheduleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartCrawlerScheduleResponse",
}) as any as S.Schema<StartCrawlerScheduleResponse>;
export interface StartExportLabelsTaskRunRequest {
  TransformId: string;
  OutputS3Path: string;
}
export const StartExportLabelsTaskRunRequest = S.suspend(() =>
  S.Struct({ TransformId: S.String, OutputS3Path: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartExportLabelsTaskRunRequest",
}) as any as S.Schema<StartExportLabelsTaskRunRequest>;
export interface StartImportLabelsTaskRunRequest {
  TransformId: string;
  InputS3Path: string;
  ReplaceAllLabels?: boolean;
}
export const StartImportLabelsTaskRunRequest = S.suspend(() =>
  S.Struct({
    TransformId: S.String,
    InputS3Path: S.String,
    ReplaceAllLabels: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartImportLabelsTaskRunRequest",
}) as any as S.Schema<StartImportLabelsTaskRunRequest>;
export type GenericMap = { [key: string]: string | undefined };
export const GenericMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface NotificationProperty {
  NotifyDelayAfter?: number;
}
export const NotificationProperty = S.suspend(() =>
  S.Struct({ NotifyDelayAfter: S.optional(S.Number) }),
).annotations({
  identifier: "NotificationProperty",
}) as any as S.Schema<NotificationProperty>;
export interface StartJobRunRequest {
  JobName: string;
  JobRunQueuingEnabled?: boolean;
  JobRunId?: string;
  Arguments?: { [key: string]: string | undefined };
  AllocatedCapacity?: number;
  Timeout?: number;
  MaxCapacity?: number;
  SecurityConfiguration?: string;
  NotificationProperty?: NotificationProperty;
  WorkerType?: WorkerType;
  NumberOfWorkers?: number;
  ExecutionClass?: ExecutionClass;
  ExecutionRoleSessionPolicy?: string;
}
export const StartJobRunRequest = S.suspend(() =>
  S.Struct({
    JobName: S.String,
    JobRunQueuingEnabled: S.optional(S.Boolean),
    JobRunId: S.optional(S.String),
    Arguments: S.optional(GenericMap),
    AllocatedCapacity: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
    SecurityConfiguration: S.optional(S.String),
    NotificationProperty: S.optional(NotificationProperty),
    WorkerType: S.optional(WorkerType),
    NumberOfWorkers: S.optional(S.Number),
    ExecutionClass: S.optional(ExecutionClass),
    ExecutionRoleSessionPolicy: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartJobRunRequest",
}) as any as S.Schema<StartJobRunRequest>;
export interface StartMaterializedViewRefreshTaskRunRequest {
  CatalogId: string;
  DatabaseName: string;
  TableName: string;
  FullRefresh?: boolean;
}
export const StartMaterializedViewRefreshTaskRunRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    FullRefresh: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartMaterializedViewRefreshTaskRunRequest",
}) as any as S.Schema<StartMaterializedViewRefreshTaskRunRequest>;
export interface StartMLEvaluationTaskRunRequest {
  TransformId: string;
}
export const StartMLEvaluationTaskRunRequest = S.suspend(() =>
  S.Struct({ TransformId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartMLEvaluationTaskRunRequest",
}) as any as S.Schema<StartMLEvaluationTaskRunRequest>;
export interface StartMLLabelingSetGenerationTaskRunRequest {
  TransformId: string;
  OutputS3Path: string;
}
export const StartMLLabelingSetGenerationTaskRunRequest = S.suspend(() =>
  S.Struct({ TransformId: S.String, OutputS3Path: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartMLLabelingSetGenerationTaskRunRequest",
}) as any as S.Schema<StartMLLabelingSetGenerationTaskRunRequest>;
export interface StartTriggerRequest {
  Name: string;
}
export const StartTriggerRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartTriggerRequest",
}) as any as S.Schema<StartTriggerRequest>;
export interface StartWorkflowRunRequest {
  Name: string;
  RunProperties?: { [key: string]: string | undefined };
}
export const StartWorkflowRunRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    RunProperties: S.optional(WorkflowRunProperties),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartWorkflowRunRequest",
}) as any as S.Schema<StartWorkflowRunRequest>;
export interface StopColumnStatisticsTaskRunRequest {
  DatabaseName: string;
  TableName: string;
}
export const StopColumnStatisticsTaskRunRequest = S.suspend(() =>
  S.Struct({ DatabaseName: S.String, TableName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopColumnStatisticsTaskRunRequest",
}) as any as S.Schema<StopColumnStatisticsTaskRunRequest>;
export interface StopColumnStatisticsTaskRunResponse {}
export const StopColumnStatisticsTaskRunResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopColumnStatisticsTaskRunResponse",
}) as any as S.Schema<StopColumnStatisticsTaskRunResponse>;
export interface StopColumnStatisticsTaskRunScheduleRequest {
  DatabaseName: string;
  TableName: string;
}
export const StopColumnStatisticsTaskRunScheduleRequest = S.suspend(() =>
  S.Struct({ DatabaseName: S.String, TableName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopColumnStatisticsTaskRunScheduleRequest",
}) as any as S.Schema<StopColumnStatisticsTaskRunScheduleRequest>;
export interface StopColumnStatisticsTaskRunScheduleResponse {}
export const StopColumnStatisticsTaskRunScheduleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopColumnStatisticsTaskRunScheduleResponse",
}) as any as S.Schema<StopColumnStatisticsTaskRunScheduleResponse>;
export interface StopCrawlerRequest {
  Name: string;
}
export const StopCrawlerRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopCrawlerRequest",
}) as any as S.Schema<StopCrawlerRequest>;
export interface StopCrawlerResponse {}
export const StopCrawlerResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "StopCrawlerResponse",
}) as any as S.Schema<StopCrawlerResponse>;
export interface StopCrawlerScheduleRequest {
  CrawlerName: string;
}
export const StopCrawlerScheduleRequest = S.suspend(() =>
  S.Struct({ CrawlerName: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopCrawlerScheduleRequest",
}) as any as S.Schema<StopCrawlerScheduleRequest>;
export interface StopCrawlerScheduleResponse {}
export const StopCrawlerScheduleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopCrawlerScheduleResponse",
}) as any as S.Schema<StopCrawlerScheduleResponse>;
export interface StopMaterializedViewRefreshTaskRunRequest {
  CatalogId: string;
  DatabaseName: string;
  TableName: string;
}
export const StopMaterializedViewRefreshTaskRunRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopMaterializedViewRefreshTaskRunRequest",
}) as any as S.Schema<StopMaterializedViewRefreshTaskRunRequest>;
export interface StopMaterializedViewRefreshTaskRunResponse {}
export const StopMaterializedViewRefreshTaskRunResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopMaterializedViewRefreshTaskRunResponse",
}) as any as S.Schema<StopMaterializedViewRefreshTaskRunResponse>;
export interface StopSessionRequest {
  Id: string;
  RequestOrigin?: string;
}
export const StopSessionRequest = S.suspend(() =>
  S.Struct({ Id: S.String, RequestOrigin: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopSessionRequest",
}) as any as S.Schema<StopSessionRequest>;
export interface StopTriggerRequest {
  Name: string;
}
export const StopTriggerRequest = S.suspend(() =>
  S.Struct({ Name: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopTriggerRequest",
}) as any as S.Schema<StopTriggerRequest>;
export interface StopWorkflowRunRequest {
  Name: string;
  RunId: string;
}
export const StopWorkflowRunRequest = S.suspend(() =>
  S.Struct({ Name: S.String, RunId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StopWorkflowRunRequest",
}) as any as S.Schema<StopWorkflowRunRequest>;
export interface StopWorkflowRunResponse {}
export const StopWorkflowRunResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopWorkflowRunResponse",
}) as any as S.Schema<StopWorkflowRunResponse>;
export interface TagResourceRequest {
  ResourceArn: string;
  TagsToAdd: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagsToAdd: TagsMap }).pipe(
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
  TagsToRemove: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({ ResourceArn: S.String, TagsToRemove: TagKeysList }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface UpdateBlueprintRequest {
  Name: string;
  Description?: string;
  BlueprintLocation: string;
}
export const UpdateBlueprintRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    BlueprintLocation: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateBlueprintRequest",
}) as any as S.Schema<UpdateBlueprintRequest>;
export interface FederatedCatalog {
  Identifier?: string;
  ConnectionName?: string;
  ConnectionType?: string;
}
export const FederatedCatalog = S.suspend(() =>
  S.Struct({
    Identifier: S.optional(S.String),
    ConnectionName: S.optional(S.String),
    ConnectionType: S.optional(S.String),
  }),
).annotations({
  identifier: "FederatedCatalog",
}) as any as S.Schema<FederatedCatalog>;
export interface TargetRedshiftCatalog {
  CatalogArn: string;
}
export const TargetRedshiftCatalog = S.suspend(() =>
  S.Struct({ CatalogArn: S.String }),
).annotations({
  identifier: "TargetRedshiftCatalog",
}) as any as S.Schema<TargetRedshiftCatalog>;
export interface DataLakeAccessProperties {
  DataLakeAccess?: boolean;
  DataTransferRole?: string;
  KmsKey?: string;
  CatalogType?: string;
}
export const DataLakeAccessProperties = S.suspend(() =>
  S.Struct({
    DataLakeAccess: S.optional(S.Boolean),
    DataTransferRole: S.optional(S.String),
    KmsKey: S.optional(S.String),
    CatalogType: S.optional(S.String),
  }),
).annotations({
  identifier: "DataLakeAccessProperties",
}) as any as S.Schema<DataLakeAccessProperties>;
export interface IcebergOptimizationProperties {
  RoleArn?: string;
  Compaction?: { [key: string]: string | undefined };
  Retention?: { [key: string]: string | undefined };
  OrphanFileDeletion?: { [key: string]: string | undefined };
}
export const IcebergOptimizationProperties = S.suspend(() =>
  S.Struct({
    RoleArn: S.optional(S.String),
    Compaction: S.optional(ParametersMap),
    Retention: S.optional(ParametersMap),
    OrphanFileDeletion: S.optional(ParametersMap),
  }),
).annotations({
  identifier: "IcebergOptimizationProperties",
}) as any as S.Schema<IcebergOptimizationProperties>;
export interface CatalogProperties {
  DataLakeAccessProperties?: DataLakeAccessProperties;
  IcebergOptimizationProperties?: IcebergOptimizationProperties;
  CustomProperties?: { [key: string]: string | undefined };
}
export const CatalogProperties = S.suspend(() =>
  S.Struct({
    DataLakeAccessProperties: S.optional(DataLakeAccessProperties),
    IcebergOptimizationProperties: S.optional(IcebergOptimizationProperties),
    CustomProperties: S.optional(ParametersMap),
  }),
).annotations({
  identifier: "CatalogProperties",
}) as any as S.Schema<CatalogProperties>;
export interface DataLakePrincipal {
  DataLakePrincipalIdentifier?: string;
}
export const DataLakePrincipal = S.suspend(() =>
  S.Struct({ DataLakePrincipalIdentifier: S.optional(S.String) }),
).annotations({
  identifier: "DataLakePrincipal",
}) as any as S.Schema<DataLakePrincipal>;
export interface PrincipalPermissions {
  Principal?: DataLakePrincipal;
  Permissions?: Permission[];
}
export const PrincipalPermissions = S.suspend(() =>
  S.Struct({
    Principal: S.optional(DataLakePrincipal),
    Permissions: S.optional(PermissionList),
  }),
).annotations({
  identifier: "PrincipalPermissions",
}) as any as S.Schema<PrincipalPermissions>;
export type PrincipalPermissionsList = PrincipalPermissions[];
export const PrincipalPermissionsList = S.Array(PrincipalPermissions);
export type AllowFullTableExternalDataAccessEnum =
  | "True"
  | "False"
  | (string & {});
export const AllowFullTableExternalDataAccessEnum = S.String;
export interface CatalogInput {
  Description?: string;
  FederatedCatalog?: FederatedCatalog;
  Parameters?: { [key: string]: string | undefined };
  TargetRedshiftCatalog?: TargetRedshiftCatalog;
  CatalogProperties?: CatalogProperties;
  CreateTableDefaultPermissions?: PrincipalPermissions[];
  CreateDatabaseDefaultPermissions?: PrincipalPermissions[];
  AllowFullTableExternalDataAccess?: AllowFullTableExternalDataAccessEnum;
}
export const CatalogInput = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    FederatedCatalog: S.optional(FederatedCatalog),
    Parameters: S.optional(ParametersMap),
    TargetRedshiftCatalog: S.optional(TargetRedshiftCatalog),
    CatalogProperties: S.optional(CatalogProperties),
    CreateTableDefaultPermissions: S.optional(PrincipalPermissionsList),
    CreateDatabaseDefaultPermissions: S.optional(PrincipalPermissionsList),
    AllowFullTableExternalDataAccess: S.optional(
      AllowFullTableExternalDataAccessEnum,
    ),
  }),
).annotations({ identifier: "CatalogInput" }) as any as S.Schema<CatalogInput>;
export interface UpdateCatalogRequest {
  CatalogId: string;
  CatalogInput: CatalogInput;
}
export const UpdateCatalogRequest = S.suspend(() =>
  S.Struct({ CatalogId: S.String, CatalogInput: CatalogInput }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCatalogRequest",
}) as any as S.Schema<UpdateCatalogRequest>;
export interface UpdateCatalogResponse {}
export const UpdateCatalogResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateCatalogResponse",
}) as any as S.Schema<UpdateCatalogResponse>;
export type ColumnStatisticsType =
  | "BOOLEAN"
  | "DATE"
  | "DECIMAL"
  | "DOUBLE"
  | "LONG"
  | "STRING"
  | "BINARY"
  | (string & {});
export const ColumnStatisticsType = S.String;
export interface BooleanColumnStatisticsData {
  NumberOfTrues: number;
  NumberOfFalses: number;
  NumberOfNulls: number;
}
export const BooleanColumnStatisticsData = S.suspend(() =>
  S.Struct({
    NumberOfTrues: S.Number,
    NumberOfFalses: S.Number,
    NumberOfNulls: S.Number,
  }),
).annotations({
  identifier: "BooleanColumnStatisticsData",
}) as any as S.Schema<BooleanColumnStatisticsData>;
export interface DateColumnStatisticsData {
  MinimumValue?: Date;
  MaximumValue?: Date;
  NumberOfNulls: number;
  NumberOfDistinctValues: number;
}
export const DateColumnStatisticsData = S.suspend(() =>
  S.Struct({
    MinimumValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    MaximumValue: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    NumberOfNulls: S.Number,
    NumberOfDistinctValues: S.Number,
  }),
).annotations({
  identifier: "DateColumnStatisticsData",
}) as any as S.Schema<DateColumnStatisticsData>;
export interface DecimalNumber {
  UnscaledValue: Uint8Array;
  Scale: number;
}
export const DecimalNumber = S.suspend(() =>
  S.Struct({ UnscaledValue: T.Blob, Scale: S.Number }),
).annotations({
  identifier: "DecimalNumber",
}) as any as S.Schema<DecimalNumber>;
export interface DecimalColumnStatisticsData {
  MinimumValue?: DecimalNumber;
  MaximumValue?: DecimalNumber;
  NumberOfNulls: number;
  NumberOfDistinctValues: number;
}
export const DecimalColumnStatisticsData = S.suspend(() =>
  S.Struct({
    MinimumValue: S.optional(DecimalNumber),
    MaximumValue: S.optional(DecimalNumber),
    NumberOfNulls: S.Number,
    NumberOfDistinctValues: S.Number,
  }),
).annotations({
  identifier: "DecimalColumnStatisticsData",
}) as any as S.Schema<DecimalColumnStatisticsData>;
export interface DoubleColumnStatisticsData {
  MinimumValue?: number;
  MaximumValue?: number;
  NumberOfNulls: number;
  NumberOfDistinctValues: number;
}
export const DoubleColumnStatisticsData = S.suspend(() =>
  S.Struct({
    MinimumValue: S.optional(S.Number),
    MaximumValue: S.optional(S.Number),
    NumberOfNulls: S.Number,
    NumberOfDistinctValues: S.Number,
  }),
).annotations({
  identifier: "DoubleColumnStatisticsData",
}) as any as S.Schema<DoubleColumnStatisticsData>;
export interface LongColumnStatisticsData {
  MinimumValue?: number;
  MaximumValue?: number;
  NumberOfNulls: number;
  NumberOfDistinctValues: number;
}
export const LongColumnStatisticsData = S.suspend(() =>
  S.Struct({
    MinimumValue: S.optional(S.Number),
    MaximumValue: S.optional(S.Number),
    NumberOfNulls: S.Number,
    NumberOfDistinctValues: S.Number,
  }),
).annotations({
  identifier: "LongColumnStatisticsData",
}) as any as S.Schema<LongColumnStatisticsData>;
export interface StringColumnStatisticsData {
  MaximumLength: number;
  AverageLength: number;
  NumberOfNulls: number;
  NumberOfDistinctValues: number;
}
export const StringColumnStatisticsData = S.suspend(() =>
  S.Struct({
    MaximumLength: S.Number,
    AverageLength: S.Number,
    NumberOfNulls: S.Number,
    NumberOfDistinctValues: S.Number,
  }),
).annotations({
  identifier: "StringColumnStatisticsData",
}) as any as S.Schema<StringColumnStatisticsData>;
export interface BinaryColumnStatisticsData {
  MaximumLength: number;
  AverageLength: number;
  NumberOfNulls: number;
}
export const BinaryColumnStatisticsData = S.suspend(() =>
  S.Struct({
    MaximumLength: S.Number,
    AverageLength: S.Number,
    NumberOfNulls: S.Number,
  }),
).annotations({
  identifier: "BinaryColumnStatisticsData",
}) as any as S.Schema<BinaryColumnStatisticsData>;
export interface ColumnStatisticsData {
  Type: ColumnStatisticsType;
  BooleanColumnStatisticsData?: BooleanColumnStatisticsData;
  DateColumnStatisticsData?: DateColumnStatisticsData;
  DecimalColumnStatisticsData?: DecimalColumnStatisticsData;
  DoubleColumnStatisticsData?: DoubleColumnStatisticsData;
  LongColumnStatisticsData?: LongColumnStatisticsData;
  StringColumnStatisticsData?: StringColumnStatisticsData;
  BinaryColumnStatisticsData?: BinaryColumnStatisticsData;
}
export const ColumnStatisticsData = S.suspend(() =>
  S.Struct({
    Type: ColumnStatisticsType,
    BooleanColumnStatisticsData: S.optional(BooleanColumnStatisticsData),
    DateColumnStatisticsData: S.optional(DateColumnStatisticsData),
    DecimalColumnStatisticsData: S.optional(DecimalColumnStatisticsData),
    DoubleColumnStatisticsData: S.optional(DoubleColumnStatisticsData),
    LongColumnStatisticsData: S.optional(LongColumnStatisticsData),
    StringColumnStatisticsData: S.optional(StringColumnStatisticsData),
    BinaryColumnStatisticsData: S.optional(BinaryColumnStatisticsData),
  }),
).annotations({
  identifier: "ColumnStatisticsData",
}) as any as S.Schema<ColumnStatisticsData>;
export interface ColumnStatistics {
  ColumnName: string;
  ColumnType: string;
  AnalyzedTime: Date;
  StatisticsData: ColumnStatisticsData;
}
export const ColumnStatistics = S.suspend(() =>
  S.Struct({
    ColumnName: S.String,
    ColumnType: S.String,
    AnalyzedTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    StatisticsData: ColumnStatisticsData,
  }),
).annotations({
  identifier: "ColumnStatistics",
}) as any as S.Schema<ColumnStatistics>;
export type UpdateColumnStatisticsList = ColumnStatistics[];
export const UpdateColumnStatisticsList = S.Array(ColumnStatistics);
export interface UpdateColumnStatisticsForTableRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  ColumnStatisticsList: ColumnStatistics[];
}
export const UpdateColumnStatisticsForTableRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    ColumnStatisticsList: UpdateColumnStatisticsList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateColumnStatisticsForTableRequest",
}) as any as S.Schema<UpdateColumnStatisticsForTableRequest>;
export interface UpdateColumnStatisticsTaskSettingsRequest {
  DatabaseName: string;
  TableName: string;
  Role?: string;
  Schedule?: string;
  ColumnNameList?: string[];
  SampleSize?: number;
  CatalogID?: string;
  SecurityConfiguration?: string;
}
export const UpdateColumnStatisticsTaskSettingsRequest = S.suspend(() =>
  S.Struct({
    DatabaseName: S.String,
    TableName: S.String,
    Role: S.optional(S.String),
    Schedule: S.optional(S.String),
    ColumnNameList: S.optional(ColumnNameList),
    SampleSize: S.optional(S.Number),
    CatalogID: S.optional(S.String),
    SecurityConfiguration: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateColumnStatisticsTaskSettingsRequest",
}) as any as S.Schema<UpdateColumnStatisticsTaskSettingsRequest>;
export interface UpdateColumnStatisticsTaskSettingsResponse {}
export const UpdateColumnStatisticsTaskSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateColumnStatisticsTaskSettingsResponse",
}) as any as S.Schema<UpdateColumnStatisticsTaskSettingsResponse>;
export type ConnectionType =
  | "JDBC"
  | "SFTP"
  | "MONGODB"
  | "KAFKA"
  | "NETWORK"
  | "MARKETPLACE"
  | "CUSTOM"
  | "SALESFORCE"
  | "VIEW_VALIDATION_REDSHIFT"
  | "VIEW_VALIDATION_ATHENA"
  | "GOOGLEADS"
  | "GOOGLESHEETS"
  | "GOOGLEANALYTICS4"
  | "SERVICENOW"
  | "MARKETO"
  | "SAPODATA"
  | "ZENDESK"
  | "JIRACLOUD"
  | "NETSUITEERP"
  | "HUBSPOT"
  | "FACEBOOKADS"
  | "INSTAGRAMADS"
  | "ZOHOCRM"
  | "SALESFORCEPARDOT"
  | "SALESFORCEMARKETINGCLOUD"
  | "ADOBEANALYTICS"
  | "SLACK"
  | "LINKEDIN"
  | "MIXPANEL"
  | "ASANA"
  | "STRIPE"
  | "SMARTSHEET"
  | "DATADOG"
  | "WOOCOMMERCE"
  | "INTERCOM"
  | "SNAPCHATADS"
  | "PAYPAL"
  | "QUICKBOOKS"
  | "FACEBOOKPAGEINSIGHTS"
  | "FRESHDESK"
  | "TWILIO"
  | "DOCUSIGNMONITOR"
  | "FRESHSALES"
  | "ZOOM"
  | "GOOGLESEARCHCONSOLE"
  | "SALESFORCECOMMERCECLOUD"
  | "SAPCONCUR"
  | "DYNATRACE"
  | "MICROSOFTDYNAMIC365FINANCEANDOPS"
  | "MICROSOFTTEAMS"
  | "BLACKBAUDRAISEREDGENXT"
  | "MAILCHIMP"
  | "GITLAB"
  | "PENDO"
  | "PRODUCTBOARD"
  | "CIRCLECI"
  | "PIPEDIVE"
  | "SENDGRID"
  | "AZURECOSMOS"
  | "AZURESQL"
  | "BIGQUERY"
  | "BLACKBAUD"
  | "CLOUDERAHIVE"
  | "CLOUDERAIMPALA"
  | "CLOUDWATCH"
  | "CLOUDWATCHMETRICS"
  | "CMDB"
  | "DATALAKEGEN2"
  | "DB2"
  | "DB2AS400"
  | "DOCUMENTDB"
  | "DOMO"
  | "DYNAMODB"
  | "GOOGLECLOUDSTORAGE"
  | "HBASE"
  | "KUSTOMER"
  | "MICROSOFTDYNAMICS365CRM"
  | "MONDAY"
  | "MYSQL"
  | "OKTA"
  | "OPENSEARCH"
  | "ORACLE"
  | "PIPEDRIVE"
  | "POSTGRESQL"
  | "SAPHANA"
  | "SQLSERVER"
  | "SYNAPSE"
  | "TERADATA"
  | "TERADATANOS"
  | "TIMESTREAM"
  | "TPCDS"
  | "VERTICA"
  | (string & {});
export const ConnectionType = S.String;
export type MatchCriteria = string[];
export const MatchCriteria = S.Array(S.String);
export type ConnectionPropertyKey =
  | "HOST"
  | "PORT"
  | "USERNAME"
  | "PASSWORD"
  | "ENCRYPTED_PASSWORD"
  | "JDBC_DRIVER_JAR_URI"
  | "JDBC_DRIVER_CLASS_NAME"
  | "JDBC_ENGINE"
  | "JDBC_ENGINE_VERSION"
  | "CONFIG_FILES"
  | "INSTANCE_ID"
  | "JDBC_CONNECTION_URL"
  | "JDBC_ENFORCE_SSL"
  | "CUSTOM_JDBC_CERT"
  | "SKIP_CUSTOM_JDBC_CERT_VALIDATION"
  | "CUSTOM_JDBC_CERT_STRING"
  | "CONNECTION_URL"
  | "KAFKA_BOOTSTRAP_SERVERS"
  | "KAFKA_SSL_ENABLED"
  | "KAFKA_CUSTOM_CERT"
  | "KAFKA_SKIP_CUSTOM_CERT_VALIDATION"
  | "KAFKA_CLIENT_KEYSTORE"
  | "KAFKA_CLIENT_KEYSTORE_PASSWORD"
  | "KAFKA_CLIENT_KEY_PASSWORD"
  | "ENCRYPTED_KAFKA_CLIENT_KEYSTORE_PASSWORD"
  | "ENCRYPTED_KAFKA_CLIENT_KEY_PASSWORD"
  | "KAFKA_SASL_MECHANISM"
  | "KAFKA_SASL_PLAIN_USERNAME"
  | "KAFKA_SASL_PLAIN_PASSWORD"
  | "ENCRYPTED_KAFKA_SASL_PLAIN_PASSWORD"
  | "KAFKA_SASL_SCRAM_USERNAME"
  | "KAFKA_SASL_SCRAM_PASSWORD"
  | "KAFKA_SASL_SCRAM_SECRETS_ARN"
  | "ENCRYPTED_KAFKA_SASL_SCRAM_PASSWORD"
  | "KAFKA_SASL_GSSAPI_KEYTAB"
  | "KAFKA_SASL_GSSAPI_KRB5_CONF"
  | "KAFKA_SASL_GSSAPI_SERVICE"
  | "KAFKA_SASL_GSSAPI_PRINCIPAL"
  | "SECRET_ID"
  | "CONNECTOR_URL"
  | "CONNECTOR_TYPE"
  | "CONNECTOR_CLASS_NAME"
  | "ENDPOINT"
  | "ENDPOINT_TYPE"
  | "ROLE_ARN"
  | "REGION"
  | "WORKGROUP_NAME"
  | "CLUSTER_IDENTIFIER"
  | "DATABASE"
  | (string & {});
export const ConnectionPropertyKey = S.String;
export type ConnectionProperties = { [key in ConnectionPropertyKey]?: string };
export const ConnectionProperties = S.partial(
  S.Record({ key: ConnectionPropertyKey, value: S.UndefinedOr(S.String) }),
);
export type PropertyMap = { [key: string]: string | undefined };
export const PropertyMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export interface PhysicalConnectionRequirements {
  SubnetId?: string;
  SecurityGroupIdList?: string[];
  AvailabilityZone?: string;
}
export const PhysicalConnectionRequirements = S.suspend(() =>
  S.Struct({
    SubnetId: S.optional(S.String),
    SecurityGroupIdList: S.optional(SecurityGroupIdList),
    AvailabilityZone: S.optional(S.String),
  }),
).annotations({
  identifier: "PhysicalConnectionRequirements",
}) as any as S.Schema<PhysicalConnectionRequirements>;
export type AuthenticationType =
  | "BASIC"
  | "OAUTH2"
  | "CUSTOM"
  | "IAM"
  | (string & {});
export const AuthenticationType = S.String;
export type OAuth2GrantType =
  | "AUTHORIZATION_CODE"
  | "CLIENT_CREDENTIALS"
  | "JWT_BEARER"
  | (string & {});
export const OAuth2GrantType = S.String;
export interface OAuth2ClientApplication {
  UserManagedClientApplicationClientId?: string;
  AWSManagedClientApplicationReference?: string;
}
export const OAuth2ClientApplication = S.suspend(() =>
  S.Struct({
    UserManagedClientApplicationClientId: S.optional(S.String),
    AWSManagedClientApplicationReference: S.optional(S.String),
  }),
).annotations({
  identifier: "OAuth2ClientApplication",
}) as any as S.Schema<OAuth2ClientApplication>;
export type TokenUrlParametersMap = { [key: string]: string | undefined };
export const TokenUrlParametersMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface AuthorizationCodeProperties {
  AuthorizationCode?: string | redacted.Redacted<string>;
  RedirectUri?: string;
}
export const AuthorizationCodeProperties = S.suspend(() =>
  S.Struct({
    AuthorizationCode: S.optional(SensitiveString),
    RedirectUri: S.optional(S.String),
  }),
).annotations({
  identifier: "AuthorizationCodeProperties",
}) as any as S.Schema<AuthorizationCodeProperties>;
export interface OAuth2Credentials {
  UserManagedClientApplicationClientSecret?: string | redacted.Redacted<string>;
  AccessToken?: string | redacted.Redacted<string>;
  RefreshToken?: string | redacted.Redacted<string>;
  JwtToken?: string | redacted.Redacted<string>;
}
export const OAuth2Credentials = S.suspend(() =>
  S.Struct({
    UserManagedClientApplicationClientSecret: S.optional(SensitiveString),
    AccessToken: S.optional(SensitiveString),
    RefreshToken: S.optional(SensitiveString),
    JwtToken: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "OAuth2Credentials",
}) as any as S.Schema<OAuth2Credentials>;
export interface OAuth2PropertiesInput {
  OAuth2GrantType?: OAuth2GrantType;
  OAuth2ClientApplication?: OAuth2ClientApplication;
  TokenUrl?: string;
  TokenUrlParametersMap?: { [key: string]: string | undefined };
  AuthorizationCodeProperties?: AuthorizationCodeProperties;
  OAuth2Credentials?: OAuth2Credentials;
}
export const OAuth2PropertiesInput = S.suspend(() =>
  S.Struct({
    OAuth2GrantType: S.optional(OAuth2GrantType),
    OAuth2ClientApplication: S.optional(OAuth2ClientApplication),
    TokenUrl: S.optional(S.String),
    TokenUrlParametersMap: S.optional(TokenUrlParametersMap),
    AuthorizationCodeProperties: S.optional(AuthorizationCodeProperties),
    OAuth2Credentials: S.optional(OAuth2Credentials),
  }),
).annotations({
  identifier: "OAuth2PropertiesInput",
}) as any as S.Schema<OAuth2PropertiesInput>;
export interface BasicAuthenticationCredentials {
  Username?: string;
  Password?: string | redacted.Redacted<string>;
}
export const BasicAuthenticationCredentials = S.suspend(() =>
  S.Struct({
    Username: S.optional(S.String),
    Password: S.optional(SensitiveString),
  }),
).annotations({
  identifier: "BasicAuthenticationCredentials",
}) as any as S.Schema<BasicAuthenticationCredentials>;
export type CredentialMap = { [key: string]: string | undefined };
export const CredentialMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface AuthenticationConfigurationInput {
  AuthenticationType?: AuthenticationType;
  OAuth2Properties?: OAuth2PropertiesInput;
  SecretArn?: string;
  KmsKeyArn?: string;
  BasicAuthenticationCredentials?: BasicAuthenticationCredentials;
  CustomAuthenticationCredentials?: { [key: string]: string | undefined };
}
export const AuthenticationConfigurationInput = S.suspend(() =>
  S.Struct({
    AuthenticationType: S.optional(AuthenticationType),
    OAuth2Properties: S.optional(OAuth2PropertiesInput),
    SecretArn: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
    BasicAuthenticationCredentials: S.optional(BasicAuthenticationCredentials),
    CustomAuthenticationCredentials: S.optional(CredentialMap),
  }),
).annotations({
  identifier: "AuthenticationConfigurationInput",
}) as any as S.Schema<AuthenticationConfigurationInput>;
export type ComputeEnvironmentList = ComputeEnvironment[];
export const ComputeEnvironmentList = S.Array(ComputeEnvironment);
export interface ConnectionInput {
  Name: string;
  Description?: string;
  ConnectionType: ConnectionType;
  MatchCriteria?: string[];
  ConnectionProperties: { [key: string]: string | undefined };
  SparkProperties?: { [key: string]: string | undefined };
  AthenaProperties?: { [key: string]: string | undefined };
  PythonProperties?: { [key: string]: string | undefined };
  PhysicalConnectionRequirements?: PhysicalConnectionRequirements;
  AuthenticationConfiguration?: AuthenticationConfigurationInput;
  ValidateCredentials?: boolean;
  ValidateForComputeEnvironments?: ComputeEnvironment[];
}
export const ConnectionInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    ConnectionType: ConnectionType,
    MatchCriteria: S.optional(MatchCriteria),
    ConnectionProperties: ConnectionProperties,
    SparkProperties: S.optional(PropertyMap),
    AthenaProperties: S.optional(PropertyMap),
    PythonProperties: S.optional(PropertyMap),
    PhysicalConnectionRequirements: S.optional(PhysicalConnectionRequirements),
    AuthenticationConfiguration: S.optional(AuthenticationConfigurationInput),
    ValidateCredentials: S.optional(S.Boolean),
    ValidateForComputeEnvironments: S.optional(ComputeEnvironmentList),
  }),
).annotations({
  identifier: "ConnectionInput",
}) as any as S.Schema<ConnectionInput>;
export interface UpdateConnectionRequest {
  CatalogId?: string;
  Name: string;
  ConnectionInput: ConnectionInput;
}
export const UpdateConnectionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    Name: S.String,
    ConnectionInput: ConnectionInput,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateConnectionRequest",
}) as any as S.Schema<UpdateConnectionRequest>;
export interface UpdateConnectionResponse {}
export const UpdateConnectionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateConnectionResponse",
}) as any as S.Schema<UpdateConnectionResponse>;
export type PathList = string[];
export const PathList = S.Array(S.String);
export interface S3Target {
  Path?: string;
  Exclusions?: string[];
  ConnectionName?: string;
  SampleSize?: number;
  EventQueueArn?: string;
  DlqEventQueueArn?: string;
}
export const S3Target = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    Exclusions: S.optional(PathList),
    ConnectionName: S.optional(S.String),
    SampleSize: S.optional(S.Number),
    EventQueueArn: S.optional(S.String),
    DlqEventQueueArn: S.optional(S.String),
  }),
).annotations({ identifier: "S3Target" }) as any as S.Schema<S3Target>;
export type S3TargetList = S3Target[];
export const S3TargetList = S.Array(S3Target);
export type JdbcMetadataEntry = "COMMENTS" | "RAWTYPES" | (string & {});
export const JdbcMetadataEntry = S.String;
export type EnableAdditionalMetadata = JdbcMetadataEntry[];
export const EnableAdditionalMetadata = S.Array(JdbcMetadataEntry);
export interface JdbcTarget {
  ConnectionName?: string;
  Path?: string;
  Exclusions?: string[];
  EnableAdditionalMetadata?: JdbcMetadataEntry[];
}
export const JdbcTarget = S.suspend(() =>
  S.Struct({
    ConnectionName: S.optional(S.String),
    Path: S.optional(S.String),
    Exclusions: S.optional(PathList),
    EnableAdditionalMetadata: S.optional(EnableAdditionalMetadata),
  }),
).annotations({ identifier: "JdbcTarget" }) as any as S.Schema<JdbcTarget>;
export type JdbcTargetList = JdbcTarget[];
export const JdbcTargetList = S.Array(JdbcTarget);
export interface MongoDBTarget {
  ConnectionName?: string;
  Path?: string;
  ScanAll?: boolean;
}
export const MongoDBTarget = S.suspend(() =>
  S.Struct({
    ConnectionName: S.optional(S.String),
    Path: S.optional(S.String),
    ScanAll: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "MongoDBTarget",
}) as any as S.Schema<MongoDBTarget>;
export type MongoDBTargetList = MongoDBTarget[];
export const MongoDBTargetList = S.Array(MongoDBTarget);
export interface DynamoDBTarget {
  Path?: string;
  scanAll?: boolean;
  scanRate?: number;
}
export const DynamoDBTarget = S.suspend(() =>
  S.Struct({
    Path: S.optional(S.String),
    scanAll: S.optional(S.Boolean),
    scanRate: S.optional(S.Number),
  }),
).annotations({
  identifier: "DynamoDBTarget",
}) as any as S.Schema<DynamoDBTarget>;
export type DynamoDBTargetList = DynamoDBTarget[];
export const DynamoDBTargetList = S.Array(DynamoDBTarget);
export type CatalogTablesList = string[];
export const CatalogTablesList = S.Array(S.String);
export interface CatalogTarget {
  DatabaseName: string;
  Tables: string[];
  ConnectionName?: string;
  EventQueueArn?: string;
  DlqEventQueueArn?: string;
}
export const CatalogTarget = S.suspend(() =>
  S.Struct({
    DatabaseName: S.String,
    Tables: CatalogTablesList,
    ConnectionName: S.optional(S.String),
    EventQueueArn: S.optional(S.String),
    DlqEventQueueArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CatalogTarget",
}) as any as S.Schema<CatalogTarget>;
export type CatalogTargetList = CatalogTarget[];
export const CatalogTargetList = S.Array(CatalogTarget);
export interface DeltaTarget {
  DeltaTables?: string[];
  ConnectionName?: string;
  WriteManifest?: boolean;
  CreateNativeDeltaTable?: boolean;
}
export const DeltaTarget = S.suspend(() =>
  S.Struct({
    DeltaTables: S.optional(PathList),
    ConnectionName: S.optional(S.String),
    WriteManifest: S.optional(S.Boolean),
    CreateNativeDeltaTable: S.optional(S.Boolean),
  }),
).annotations({ identifier: "DeltaTarget" }) as any as S.Schema<DeltaTarget>;
export type DeltaTargetList = DeltaTarget[];
export const DeltaTargetList = S.Array(DeltaTarget);
export interface IcebergTarget {
  Paths?: string[];
  ConnectionName?: string;
  Exclusions?: string[];
  MaximumTraversalDepth?: number;
}
export const IcebergTarget = S.suspend(() =>
  S.Struct({
    Paths: S.optional(PathList),
    ConnectionName: S.optional(S.String),
    Exclusions: S.optional(PathList),
    MaximumTraversalDepth: S.optional(S.Number),
  }),
).annotations({
  identifier: "IcebergTarget",
}) as any as S.Schema<IcebergTarget>;
export type IcebergTargetList = IcebergTarget[];
export const IcebergTargetList = S.Array(IcebergTarget);
export interface HudiTarget {
  Paths?: string[];
  ConnectionName?: string;
  Exclusions?: string[];
  MaximumTraversalDepth?: number;
}
export const HudiTarget = S.suspend(() =>
  S.Struct({
    Paths: S.optional(PathList),
    ConnectionName: S.optional(S.String),
    Exclusions: S.optional(PathList),
    MaximumTraversalDepth: S.optional(S.Number),
  }),
).annotations({ identifier: "HudiTarget" }) as any as S.Schema<HudiTarget>;
export type HudiTargetList = HudiTarget[];
export const HudiTargetList = S.Array(HudiTarget);
export interface CrawlerTargets {
  S3Targets?: S3Target[];
  JdbcTargets?: JdbcTarget[];
  MongoDBTargets?: MongoDBTarget[];
  DynamoDBTargets?: DynamoDBTarget[];
  CatalogTargets?: CatalogTarget[];
  DeltaTargets?: DeltaTarget[];
  IcebergTargets?: IcebergTarget[];
  HudiTargets?: HudiTarget[];
}
export const CrawlerTargets = S.suspend(() =>
  S.Struct({
    S3Targets: S.optional(S3TargetList),
    JdbcTargets: S.optional(JdbcTargetList),
    MongoDBTargets: S.optional(MongoDBTargetList),
    DynamoDBTargets: S.optional(DynamoDBTargetList),
    CatalogTargets: S.optional(CatalogTargetList),
    DeltaTargets: S.optional(DeltaTargetList),
    IcebergTargets: S.optional(IcebergTargetList),
    HudiTargets: S.optional(HudiTargetList),
  }),
).annotations({
  identifier: "CrawlerTargets",
}) as any as S.Schema<CrawlerTargets>;
export type UpdateBehavior = "LOG" | "UPDATE_IN_DATABASE" | (string & {});
export const UpdateBehavior = S.String;
export type DeleteBehavior =
  | "LOG"
  | "DELETE_FROM_DATABASE"
  | "DEPRECATE_IN_DATABASE"
  | (string & {});
export const DeleteBehavior = S.String;
export interface SchemaChangePolicy {
  UpdateBehavior?: UpdateBehavior;
  DeleteBehavior?: DeleteBehavior;
}
export const SchemaChangePolicy = S.suspend(() =>
  S.Struct({
    UpdateBehavior: S.optional(UpdateBehavior),
    DeleteBehavior: S.optional(DeleteBehavior),
  }),
).annotations({
  identifier: "SchemaChangePolicy",
}) as any as S.Schema<SchemaChangePolicy>;
export type RecrawlBehavior =
  | "CRAWL_EVERYTHING"
  | "CRAWL_NEW_FOLDERS_ONLY"
  | "CRAWL_EVENT_MODE"
  | (string & {});
export const RecrawlBehavior = S.String;
export interface RecrawlPolicy {
  RecrawlBehavior?: RecrawlBehavior;
}
export const RecrawlPolicy = S.suspend(() =>
  S.Struct({ RecrawlBehavior: S.optional(RecrawlBehavior) }),
).annotations({
  identifier: "RecrawlPolicy",
}) as any as S.Schema<RecrawlPolicy>;
export type CrawlerLineageSettings = "ENABLE" | "DISABLE" | (string & {});
export const CrawlerLineageSettings = S.String;
export interface LineageConfiguration {
  CrawlerLineageSettings?: CrawlerLineageSettings;
}
export const LineageConfiguration = S.suspend(() =>
  S.Struct({ CrawlerLineageSettings: S.optional(CrawlerLineageSettings) }),
).annotations({
  identifier: "LineageConfiguration",
}) as any as S.Schema<LineageConfiguration>;
export interface LakeFormationConfiguration {
  UseLakeFormationCredentials?: boolean;
  AccountId?: string;
}
export const LakeFormationConfiguration = S.suspend(() =>
  S.Struct({
    UseLakeFormationCredentials: S.optional(S.Boolean),
    AccountId: S.optional(S.String),
  }),
).annotations({
  identifier: "LakeFormationConfiguration",
}) as any as S.Schema<LakeFormationConfiguration>;
export interface UpdateCrawlerRequest {
  Name: string;
  Role?: string;
  DatabaseName?: string;
  Description?: string;
  Targets?: CrawlerTargets;
  Schedule?: string;
  Classifiers?: string[];
  TablePrefix?: string;
  SchemaChangePolicy?: SchemaChangePolicy;
  RecrawlPolicy?: RecrawlPolicy;
  LineageConfiguration?: LineageConfiguration;
  LakeFormationConfiguration?: LakeFormationConfiguration;
  Configuration?: string;
  CrawlerSecurityConfiguration?: string;
}
export const UpdateCrawlerRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCrawlerRequest",
}) as any as S.Schema<UpdateCrawlerRequest>;
export interface UpdateCrawlerResponse {}
export const UpdateCrawlerResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateCrawlerResponse",
}) as any as S.Schema<UpdateCrawlerResponse>;
export interface UpdateCrawlerScheduleRequest {
  CrawlerName: string;
  Schedule?: string;
}
export const UpdateCrawlerScheduleRequest = S.suspend(() =>
  S.Struct({ CrawlerName: S.String, Schedule: S.optional(S.String) }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateCrawlerScheduleRequest",
}) as any as S.Schema<UpdateCrawlerScheduleRequest>;
export interface UpdateCrawlerScheduleResponse {}
export const UpdateCrawlerScheduleResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateCrawlerScheduleResponse",
}) as any as S.Schema<UpdateCrawlerScheduleResponse>;
export interface DatabaseIdentifier {
  CatalogId?: string;
  DatabaseName?: string;
  Region?: string;
}
export const DatabaseIdentifier = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    Region: S.optional(S.String),
  }),
).annotations({
  identifier: "DatabaseIdentifier",
}) as any as S.Schema<DatabaseIdentifier>;
export interface FederatedDatabase {
  Identifier?: string;
  ConnectionName?: string;
  ConnectionType?: string;
}
export const FederatedDatabase = S.suspend(() =>
  S.Struct({
    Identifier: S.optional(S.String),
    ConnectionName: S.optional(S.String),
    ConnectionType: S.optional(S.String),
  }),
).annotations({
  identifier: "FederatedDatabase",
}) as any as S.Schema<FederatedDatabase>;
export interface DatabaseInput {
  Name: string;
  Description?: string;
  LocationUri?: string;
  Parameters?: { [key: string]: string | undefined };
  CreateTableDefaultPermissions?: PrincipalPermissions[];
  TargetDatabase?: DatabaseIdentifier;
  FederatedDatabase?: FederatedDatabase;
}
export const DatabaseInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    LocationUri: S.optional(S.String),
    Parameters: S.optional(ParametersMap),
    CreateTableDefaultPermissions: S.optional(PrincipalPermissionsList),
    TargetDatabase: S.optional(DatabaseIdentifier),
    FederatedDatabase: S.optional(FederatedDatabase),
  }),
).annotations({
  identifier: "DatabaseInput",
}) as any as S.Schema<DatabaseInput>;
export interface UpdateDatabaseRequest {
  CatalogId?: string;
  Name: string;
  DatabaseInput: DatabaseInput;
}
export const UpdateDatabaseRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    Name: S.String,
    DatabaseInput: DatabaseInput,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDatabaseRequest",
}) as any as S.Schema<UpdateDatabaseRequest>;
export interface UpdateDatabaseResponse {}
export const UpdateDatabaseResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "UpdateDatabaseResponse" },
) as any as S.Schema<UpdateDatabaseResponse>;
export interface UpdateDataQualityRulesetRequest {
  Name: string;
  Description?: string;
  Ruleset?: string;
}
export const UpdateDataQualityRulesetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Ruleset: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDataQualityRulesetRequest",
}) as any as S.Schema<UpdateDataQualityRulesetRequest>;
export interface UpdateGlueIdentityCenterConfigurationRequest {
  Scopes?: string[];
  UserBackgroundSessionsEnabled?: boolean;
}
export const UpdateGlueIdentityCenterConfigurationRequest = S.suspend(() =>
  S.Struct({
    Scopes: S.optional(IdentityCenterScopesList),
    UserBackgroundSessionsEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateGlueIdentityCenterConfigurationRequest",
}) as any as S.Schema<UpdateGlueIdentityCenterConfigurationRequest>;
export interface UpdateGlueIdentityCenterConfigurationResponse {}
export const UpdateGlueIdentityCenterConfigurationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateGlueIdentityCenterConfigurationResponse",
}) as any as S.Schema<UpdateGlueIdentityCenterConfigurationResponse>;
export interface SourceProcessingProperties {
  RoleArn?: string;
}
export const SourceProcessingProperties = S.suspend(() =>
  S.Struct({ RoleArn: S.optional(S.String) }),
).annotations({
  identifier: "SourceProcessingProperties",
}) as any as S.Schema<SourceProcessingProperties>;
export interface TargetProcessingProperties {
  RoleArn?: string;
  KmsArn?: string;
  ConnectionName?: string;
  EventBusArn?: string;
}
export const TargetProcessingProperties = S.suspend(() =>
  S.Struct({
    RoleArn: S.optional(S.String),
    KmsArn: S.optional(S.String),
    ConnectionName: S.optional(S.String),
    EventBusArn: S.optional(S.String),
  }),
).annotations({
  identifier: "TargetProcessingProperties",
}) as any as S.Schema<TargetProcessingProperties>;
export interface UpdateIntegrationResourcePropertyRequest {
  ResourceArn: string;
  SourceProcessingProperties?: SourceProcessingProperties;
  TargetProcessingProperties?: TargetProcessingProperties;
}
export const UpdateIntegrationResourcePropertyRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    SourceProcessingProperties: S.optional(SourceProcessingProperties),
    TargetProcessingProperties: S.optional(TargetProcessingProperties),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateIntegrationResourcePropertyRequest",
}) as any as S.Schema<UpdateIntegrationResourcePropertyRequest>;
export type SourceTableFieldsList = string[];
export const SourceTableFieldsList = S.Array(S.String);
export type PrimaryKeyList = string[];
export const PrimaryKeyList = S.Array(S.String);
export interface SourceTableConfig {
  Fields?: string[];
  FilterPredicate?: string;
  PrimaryKey?: string[];
  RecordUpdateField?: string;
}
export const SourceTableConfig = S.suspend(() =>
  S.Struct({
    Fields: S.optional(SourceTableFieldsList),
    FilterPredicate: S.optional(S.String),
    PrimaryKey: S.optional(PrimaryKeyList),
    RecordUpdateField: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceTableConfig",
}) as any as S.Schema<SourceTableConfig>;
export type UnnestSpec = "TOPLEVEL" | "FULL" | "NOUNNEST" | (string & {});
export const UnnestSpec = S.String;
export interface IntegrationPartition {
  FieldName?: string;
  FunctionSpec?: string;
  ConversionSpec?: string;
}
export const IntegrationPartition = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(S.String),
    FunctionSpec: S.optional(S.String),
    ConversionSpec: S.optional(S.String),
  }),
).annotations({
  identifier: "IntegrationPartition",
}) as any as S.Schema<IntegrationPartition>;
export type IntegrationPartitionSpecList = IntegrationPartition[];
export const IntegrationPartitionSpecList = S.Array(IntegrationPartition);
export interface TargetTableConfig {
  UnnestSpec?: UnnestSpec;
  PartitionSpec?: IntegrationPartition[];
  TargetTableName?: string;
}
export const TargetTableConfig = S.suspend(() =>
  S.Struct({
    UnnestSpec: S.optional(UnnestSpec),
    PartitionSpec: S.optional(IntegrationPartitionSpecList),
    TargetTableName: S.optional(S.String),
  }),
).annotations({
  identifier: "TargetTableConfig",
}) as any as S.Schema<TargetTableConfig>;
export interface UpdateIntegrationTablePropertiesRequest {
  ResourceArn: string;
  TableName: string;
  SourceTableConfig?: SourceTableConfig;
  TargetTableConfig?: TargetTableConfig;
}
export const UpdateIntegrationTablePropertiesRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    TableName: S.String,
    SourceTableConfig: S.optional(SourceTableConfig),
    TargetTableConfig: S.optional(TargetTableConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateIntegrationTablePropertiesRequest",
}) as any as S.Schema<UpdateIntegrationTablePropertiesRequest>;
export interface UpdateIntegrationTablePropertiesResponse {}
export const UpdateIntegrationTablePropertiesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateIntegrationTablePropertiesResponse",
}) as any as S.Schema<UpdateIntegrationTablePropertiesResponse>;
export interface UpdateJobFromSourceControlRequest {
  JobName?: string;
  Provider?: SourceControlProvider;
  RepositoryName?: string;
  RepositoryOwner?: string;
  BranchName?: string;
  Folder?: string;
  CommitId?: string;
  AuthStrategy?: SourceControlAuthStrategy;
  AuthToken?: string;
}
export const UpdateJobFromSourceControlRequest = S.suspend(() =>
  S.Struct({
    JobName: S.optional(S.String),
    Provider: S.optional(SourceControlProvider),
    RepositoryName: S.optional(S.String),
    RepositoryOwner: S.optional(S.String),
    BranchName: S.optional(S.String),
    Folder: S.optional(S.String),
    CommitId: S.optional(S.String),
    AuthStrategy: S.optional(SourceControlAuthStrategy),
    AuthToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateJobFromSourceControlRequest",
}) as any as S.Schema<UpdateJobFromSourceControlRequest>;
export interface FindMatchesParameters {
  PrimaryKeyColumnName?: string;
  PrecisionRecallTradeoff?: number;
  AccuracyCostTradeoff?: number;
  EnforceProvidedLabels?: boolean;
}
export const FindMatchesParameters = S.suspend(() =>
  S.Struct({
    PrimaryKeyColumnName: S.optional(S.String),
    PrecisionRecallTradeoff: S.optional(S.Number),
    AccuracyCostTradeoff: S.optional(S.Number),
    EnforceProvidedLabels: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "FindMatchesParameters",
}) as any as S.Schema<FindMatchesParameters>;
export interface TransformParameters {
  TransformType: TransformType;
  FindMatchesParameters?: FindMatchesParameters;
}
export const TransformParameters = S.suspend(() =>
  S.Struct({
    TransformType: TransformType,
    FindMatchesParameters: S.optional(FindMatchesParameters),
  }),
).annotations({
  identifier: "TransformParameters",
}) as any as S.Schema<TransformParameters>;
export interface UpdateMLTransformRequest {
  TransformId: string;
  Name?: string;
  Description?: string;
  Parameters?: TransformParameters;
  Role?: string;
  GlueVersion?: string;
  MaxCapacity?: number;
  WorkerType?: WorkerType;
  NumberOfWorkers?: number;
  Timeout?: number;
  MaxRetries?: number;
}
export const UpdateMLTransformRequest = S.suspend(() =>
  S.Struct({
    TransformId: S.String,
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Parameters: S.optional(TransformParameters),
    Role: S.optional(S.String),
    GlueVersion: S.optional(S.String),
    MaxCapacity: S.optional(S.Number),
    WorkerType: S.optional(WorkerType),
    NumberOfWorkers: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateMLTransformRequest",
}) as any as S.Schema<UpdateMLTransformRequest>;
export interface UpdatePartitionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  PartitionValueList: string[];
  PartitionInput: PartitionInput;
}
export const UpdatePartitionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValueList: BoundedPartitionValueList,
    PartitionInput: PartitionInput,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdatePartitionRequest",
}) as any as S.Schema<UpdatePartitionRequest>;
export interface UpdatePartitionResponse {}
export const UpdatePartitionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdatePartitionResponse",
}) as any as S.Schema<UpdatePartitionResponse>;
export interface UpdateRegistryInput {
  RegistryId: RegistryId;
  Description: string;
}
export const UpdateRegistryInput = S.suspend(() =>
  S.Struct({ RegistryId: RegistryId, Description: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateRegistryInput",
}) as any as S.Schema<UpdateRegistryInput>;
export interface UpdateSchemaInput {
  SchemaId: SchemaId;
  SchemaVersionNumber?: SchemaVersionNumber;
  Compatibility?: Compatibility;
  Description?: string;
}
export const UpdateSchemaInput = S.suspend(() =>
  S.Struct({
    SchemaId: SchemaId,
    SchemaVersionNumber: S.optional(SchemaVersionNumber),
    Compatibility: S.optional(Compatibility),
    Description: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSchemaInput",
}) as any as S.Schema<UpdateSchemaInput>;
export interface UpdateSourceControlFromJobRequest {
  JobName?: string;
  Provider?: SourceControlProvider;
  RepositoryName?: string;
  RepositoryOwner?: string;
  BranchName?: string;
  Folder?: string;
  CommitId?: string;
  AuthStrategy?: SourceControlAuthStrategy;
  AuthToken?: string;
}
export const UpdateSourceControlFromJobRequest = S.suspend(() =>
  S.Struct({
    JobName: S.optional(S.String),
    Provider: S.optional(SourceControlProvider),
    RepositoryName: S.optional(S.String),
    RepositoryOwner: S.optional(S.String),
    BranchName: S.optional(S.String),
    Folder: S.optional(S.String),
    CommitId: S.optional(S.String),
    AuthStrategy: S.optional(SourceControlAuthStrategy),
    AuthToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateSourceControlFromJobRequest",
}) as any as S.Schema<UpdateSourceControlFromJobRequest>;
export type TableOptimizerVpcConfiguration = { glueConnectionName: string };
export const TableOptimizerVpcConfiguration = S.Union(
  S.Struct({ glueConnectionName: S.String }),
);
export type CompactionStrategy = "binpack" | "sort" | "z-order" | (string & {});
export const CompactionStrategy = S.String;
export interface IcebergCompactionConfiguration {
  strategy?: CompactionStrategy;
  minInputFiles?: number;
  deleteFileThreshold?: number;
}
export const IcebergCompactionConfiguration = S.suspend(() =>
  S.Struct({
    strategy: S.optional(CompactionStrategy),
    minInputFiles: S.optional(S.Number),
    deleteFileThreshold: S.optional(S.Number),
  }),
).annotations({
  identifier: "IcebergCompactionConfiguration",
}) as any as S.Schema<IcebergCompactionConfiguration>;
export interface CompactionConfiguration {
  icebergConfiguration?: IcebergCompactionConfiguration;
}
export const CompactionConfiguration = S.suspend(() =>
  S.Struct({
    icebergConfiguration: S.optional(IcebergCompactionConfiguration),
  }),
).annotations({
  identifier: "CompactionConfiguration",
}) as any as S.Schema<CompactionConfiguration>;
export interface IcebergRetentionConfiguration {
  snapshotRetentionPeriodInDays?: number;
  numberOfSnapshotsToRetain?: number;
  cleanExpiredFiles?: boolean;
  runRateInHours?: number;
}
export const IcebergRetentionConfiguration = S.suspend(() =>
  S.Struct({
    snapshotRetentionPeriodInDays: S.optional(S.Number),
    numberOfSnapshotsToRetain: S.optional(S.Number),
    cleanExpiredFiles: S.optional(S.Boolean),
    runRateInHours: S.optional(S.Number),
  }),
).annotations({
  identifier: "IcebergRetentionConfiguration",
}) as any as S.Schema<IcebergRetentionConfiguration>;
export interface RetentionConfiguration {
  icebergConfiguration?: IcebergRetentionConfiguration;
}
export const RetentionConfiguration = S.suspend(() =>
  S.Struct({ icebergConfiguration: S.optional(IcebergRetentionConfiguration) }),
).annotations({
  identifier: "RetentionConfiguration",
}) as any as S.Schema<RetentionConfiguration>;
export interface IcebergOrphanFileDeletionConfiguration {
  orphanFileRetentionPeriodInDays?: number;
  location?: string;
  runRateInHours?: number;
}
export const IcebergOrphanFileDeletionConfiguration = S.suspend(() =>
  S.Struct({
    orphanFileRetentionPeriodInDays: S.optional(S.Number),
    location: S.optional(S.String),
    runRateInHours: S.optional(S.Number),
  }),
).annotations({
  identifier: "IcebergOrphanFileDeletionConfiguration",
}) as any as S.Schema<IcebergOrphanFileDeletionConfiguration>;
export interface OrphanFileDeletionConfiguration {
  icebergConfiguration?: IcebergOrphanFileDeletionConfiguration;
}
export const OrphanFileDeletionConfiguration = S.suspend(() =>
  S.Struct({
    icebergConfiguration: S.optional(IcebergOrphanFileDeletionConfiguration),
  }),
).annotations({
  identifier: "OrphanFileDeletionConfiguration",
}) as any as S.Schema<OrphanFileDeletionConfiguration>;
export interface TableOptimizerConfiguration {
  roleArn?: string;
  enabled?: boolean;
  vpcConfiguration?: TableOptimizerVpcConfiguration;
  compactionConfiguration?: CompactionConfiguration;
  retentionConfiguration?: RetentionConfiguration;
  orphanFileDeletionConfiguration?: OrphanFileDeletionConfiguration;
}
export const TableOptimizerConfiguration = S.suspend(() =>
  S.Struct({
    roleArn: S.optional(S.String),
    enabled: S.optional(S.Boolean),
    vpcConfiguration: S.optional(TableOptimizerVpcConfiguration),
    compactionConfiguration: S.optional(CompactionConfiguration),
    retentionConfiguration: S.optional(RetentionConfiguration),
    orphanFileDeletionConfiguration: S.optional(
      OrphanFileDeletionConfiguration,
    ),
  }),
).annotations({
  identifier: "TableOptimizerConfiguration",
}) as any as S.Schema<TableOptimizerConfiguration>;
export interface UpdateTableOptimizerRequest {
  CatalogId: string;
  DatabaseName: string;
  TableName: string;
  Type: TableOptimizerType;
  TableOptimizerConfiguration: TableOptimizerConfiguration;
}
export const UpdateTableOptimizerRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Type: TableOptimizerType,
    TableOptimizerConfiguration: TableOptimizerConfiguration,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateTableOptimizerRequest",
}) as any as S.Schema<UpdateTableOptimizerRequest>;
export interface UpdateTableOptimizerResponse {}
export const UpdateTableOptimizerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateTableOptimizerResponse",
}) as any as S.Schema<UpdateTableOptimizerResponse>;
export type AllowedValuesStringList = string[];
export const AllowedValuesStringList = S.Array(S.String);
export interface ConfigurationObject {
  DefaultValue?: string;
  AllowedValues?: string[];
  MinValue?: string;
  MaxValue?: string;
}
export const ConfigurationObject = S.suspend(() =>
  S.Struct({
    DefaultValue: S.optional(S.String),
    AllowedValues: S.optional(AllowedValuesStringList),
    MinValue: S.optional(S.String),
    MaxValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ConfigurationObject",
}) as any as S.Schema<ConfigurationObject>;
export type ConfigurationMap = {
  [key: string]: ConfigurationObject | undefined;
};
export const ConfigurationMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(ConfigurationObject),
});
export interface ProfileConfiguration {
  SessionConfiguration?: { [key: string]: ConfigurationObject | undefined };
  JobConfiguration?: { [key: string]: ConfigurationObject | undefined };
}
export const ProfileConfiguration = S.suspend(() =>
  S.Struct({
    SessionConfiguration: S.optional(ConfigurationMap),
    JobConfiguration: S.optional(ConfigurationMap),
  }),
).annotations({
  identifier: "ProfileConfiguration",
}) as any as S.Schema<ProfileConfiguration>;
export interface UpdateUsageProfileRequest {
  Name: string;
  Description?: string;
  Configuration: ProfileConfiguration;
}
export const UpdateUsageProfileRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Configuration: ProfileConfiguration,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateUsageProfileRequest",
}) as any as S.Schema<UpdateUsageProfileRequest>;
export type PrincipalType = "USER" | "ROLE" | "GROUP" | (string & {});
export const PrincipalType = S.String;
export type ResourceType = "JAR" | "FILE" | "ARCHIVE" | (string & {});
export const ResourceType = S.String;
export interface ResourceUri {
  ResourceType?: ResourceType;
  Uri?: string;
}
export const ResourceUri = S.suspend(() =>
  S.Struct({
    ResourceType: S.optional(ResourceType),
    Uri: S.optional(S.String),
  }),
).annotations({ identifier: "ResourceUri" }) as any as S.Schema<ResourceUri>;
export type ResourceUriList = ResourceUri[];
export const ResourceUriList = S.Array(ResourceUri);
export interface UserDefinedFunctionInput {
  FunctionName?: string;
  ClassName?: string;
  OwnerName?: string;
  FunctionType?: FunctionType;
  OwnerType?: PrincipalType;
  ResourceUris?: ResourceUri[];
}
export const UserDefinedFunctionInput = S.suspend(() =>
  S.Struct({
    FunctionName: S.optional(S.String),
    ClassName: S.optional(S.String),
    OwnerName: S.optional(S.String),
    FunctionType: S.optional(FunctionType),
    OwnerType: S.optional(PrincipalType),
    ResourceUris: S.optional(ResourceUriList),
  }),
).annotations({
  identifier: "UserDefinedFunctionInput",
}) as any as S.Schema<UserDefinedFunctionInput>;
export interface UpdateUserDefinedFunctionRequest {
  CatalogId?: string;
  DatabaseName: string;
  FunctionName: string;
  FunctionInput: UserDefinedFunctionInput;
}
export const UpdateUserDefinedFunctionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    FunctionName: S.String,
    FunctionInput: UserDefinedFunctionInput,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateUserDefinedFunctionRequest",
}) as any as S.Schema<UpdateUserDefinedFunctionRequest>;
export interface UpdateUserDefinedFunctionResponse {}
export const UpdateUserDefinedFunctionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateUserDefinedFunctionResponse",
}) as any as S.Schema<UpdateUserDefinedFunctionResponse>;
export interface UpdateWorkflowRequest {
  Name: string;
  Description?: string;
  DefaultRunProperties?: { [key: string]: string | undefined };
  MaxConcurrentRuns?: number;
}
export const UpdateWorkflowRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    DefaultRunProperties: S.optional(WorkflowRunProperties),
    MaxConcurrentRuns: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateWorkflowRequest",
}) as any as S.Schema<UpdateWorkflowRequest>;
export type CsvHeaderOption = "UNKNOWN" | "PRESENT" | "ABSENT" | (string & {});
export const CsvHeaderOption = S.String;
export type CsvHeader = string[];
export const CsvHeader = S.Array(S.String);
export type CustomDatatypes = string[];
export const CustomDatatypes = S.Array(S.String);
export type CsvSerdeOption =
  | "OpenCSVSerDe"
  | "LazySimpleSerDe"
  | "None"
  | (string & {});
export const CsvSerdeOption = S.String;
export type ConnectionStringList = string[];
export const ConnectionStringList = S.Array(S.String);
export type Logical = "AND" | "ANY" | (string & {});
export const Logical = S.String;
export type IntegrationFilterValues = string[];
export const IntegrationFilterValues = S.Array(S.String);
export type TaskType =
  | "EVALUATION"
  | "LABELING_SET_GENERATION"
  | "IMPORT_LABELS"
  | "EXPORT_LABELS"
  | "FIND_MATCHES"
  | (string & {});
export const TaskType = S.String;
export type TaskStatusType =
  | "STARTING"
  | "RUNNING"
  | "STOPPING"
  | "STOPPED"
  | "SUCCEEDED"
  | "FAILED"
  | "TIMEOUT"
  | (string & {});
export const TaskStatusType = S.String;
export type TaskRunSortColumnType =
  | "TASK_RUN_TYPE"
  | "STATUS"
  | "STARTED"
  | (string & {});
export const TaskRunSortColumnType = S.String;
export type ViewDialect = "REDSHIFT" | "ATHENA" | "SPARK" | (string & {});
export const ViewDialect = S.String;
export type FieldName =
  | "CRAWL_ID"
  | "STATE"
  | "START_TIME"
  | "END_TIME"
  | "DPU_HOUR"
  | (string & {});
export const FieldName = S.String;
export type FilterOperator =
  | "GT"
  | "GE"
  | "LT"
  | "LE"
  | "EQ"
  | "NE"
  | (string & {});
export const FilterOperator = S.String;
export type IntegrationResourcePropertyFilterValues = string[];
export const IntegrationResourcePropertyFilterValues = S.Array(S.String);
export type Comparator =
  | "EQUALS"
  | "GREATER_THAN"
  | "LESS_THAN"
  | "GREATER_THAN_EQUALS"
  | "LESS_THAN_EQUALS"
  | (string & {});
export const Comparator = S.String;
export type Sort = "ASC" | "DESC" | (string & {});
export const Sort = S.String;
export type DQCompositeRuleEvaluationMethod = "COLUMN" | "ROW" | (string & {});
export const DQCompositeRuleEvaluationMethod = S.String;
export type BatchDeletePartitionValueList = PartitionValueList[];
export const BatchDeletePartitionValueList = S.Array(PartitionValueList);
export type BlueprintNames = string[];
export const BlueprintNames = S.Array(S.String);
export interface BatchGetTableOptimizerEntry {
  catalogId?: string;
  databaseName?: string;
  tableName?: string;
  type?: TableOptimizerType;
}
export const BatchGetTableOptimizerEntry = S.suspend(() =>
  S.Struct({
    catalogId: S.optional(S.String),
    databaseName: S.optional(S.String),
    tableName: S.optional(S.String),
    type: S.optional(TableOptimizerType),
  }),
).annotations({
  identifier: "BatchGetTableOptimizerEntry",
}) as any as S.Schema<BatchGetTableOptimizerEntry>;
export type BatchGetTableOptimizerEntries = BatchGetTableOptimizerEntry[];
export const BatchGetTableOptimizerEntries = S.Array(
  BatchGetTableOptimizerEntry,
);
export interface DatapointInclusionAnnotation {
  ProfileId?: string;
  StatisticId?: string;
  InclusionAnnotation?: InclusionAnnotationValue;
}
export const DatapointInclusionAnnotation = S.suspend(() =>
  S.Struct({
    ProfileId: S.optional(S.String),
    StatisticId: S.optional(S.String),
    InclusionAnnotation: S.optional(InclusionAnnotationValue),
  }),
).annotations({
  identifier: "DatapointInclusionAnnotation",
}) as any as S.Schema<DatapointInclusionAnnotation>;
export type InclusionAnnotationList = DatapointInclusionAnnotation[];
export const InclusionAnnotationList = S.Array(DatapointInclusionAnnotation);
export interface BatchUpdatePartitionRequestEntry {
  PartitionValueList: string[];
  PartitionInput: PartitionInput;
}
export const BatchUpdatePartitionRequestEntry = S.suspend(() =>
  S.Struct({
    PartitionValueList: BoundedPartitionValueList,
    PartitionInput: PartitionInput,
  }),
).annotations({
  identifier: "BatchUpdatePartitionRequestEntry",
}) as any as S.Schema<BatchUpdatePartitionRequestEntry>;
export type BatchUpdatePartitionRequestEntryList =
  BatchUpdatePartitionRequestEntry[];
export const BatchUpdatePartitionRequestEntryList = S.Array(
  BatchUpdatePartitionRequestEntry,
);
export interface CreateGrokClassifierRequest {
  Classification: string;
  Name: string;
  GrokPattern: string;
  CustomPatterns?: string;
}
export const CreateGrokClassifierRequest = S.suspend(() =>
  S.Struct({
    Classification: S.String,
    Name: S.String,
    GrokPattern: S.String,
    CustomPatterns: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateGrokClassifierRequest",
}) as any as S.Schema<CreateGrokClassifierRequest>;
export interface CreateXMLClassifierRequest {
  Classification: string;
  Name: string;
  RowTag?: string;
}
export const CreateXMLClassifierRequest = S.suspend(() =>
  S.Struct({
    Classification: S.String,
    Name: S.String,
    RowTag: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateXMLClassifierRequest",
}) as any as S.Schema<CreateXMLClassifierRequest>;
export interface CreateJsonClassifierRequest {
  Name: string;
  JsonPath: string;
}
export const CreateJsonClassifierRequest = S.suspend(() =>
  S.Struct({ Name: S.String, JsonPath: S.String }),
).annotations({
  identifier: "CreateJsonClassifierRequest",
}) as any as S.Schema<CreateJsonClassifierRequest>;
export interface CreateCsvClassifierRequest {
  Name: string;
  Delimiter?: string;
  QuoteSymbol?: string;
  ContainsHeader?: CsvHeaderOption;
  Header?: string[];
  DisableValueTrimming?: boolean;
  AllowSingleColumn?: boolean;
  CustomDatatypeConfigured?: boolean;
  CustomDatatypes?: string[];
  Serde?: CsvSerdeOption;
}
export const CreateCsvClassifierRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Delimiter: S.optional(S.String),
    QuoteSymbol: S.optional(S.String),
    ContainsHeader: S.optional(CsvHeaderOption),
    Header: S.optional(CsvHeader),
    DisableValueTrimming: S.optional(S.Boolean),
    AllowSingleColumn: S.optional(S.Boolean),
    CustomDatatypeConfigured: S.optional(S.Boolean),
    CustomDatatypes: S.optional(CustomDatatypes),
    Serde: S.optional(CsvSerdeOption),
  }),
).annotations({
  identifier: "CreateCsvClassifierRequest",
}) as any as S.Schema<CreateCsvClassifierRequest>;
export interface DataQualityTargetTable {
  TableName: string;
  DatabaseName: string;
  CatalogId?: string;
}
export const DataQualityTargetTable = S.suspend(() =>
  S.Struct({
    TableName: S.String,
    DatabaseName: S.String,
    CatalogId: S.optional(S.String),
  }),
).annotations({
  identifier: "DataQualityTargetTable",
}) as any as S.Schema<DataQualityTargetTable>;
export type MapValue = { [key: string]: string | undefined };
export const MapValue = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type IntegrationAdditionalEncryptionContextMap = {
  [key: string]: string | undefined;
};
export const IntegrationAdditionalEncryptionContextMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface Tag {
  key?: string;
  value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type IntegrationTagsList = Tag[];
export const IntegrationTagsList = S.Array(Tag);
export interface ExecutionProperty {
  MaxConcurrentRuns?: number;
}
export const ExecutionProperty = S.suspend(() =>
  S.Struct({ MaxConcurrentRuns: S.optional(S.Number) }),
).annotations({
  identifier: "ExecutionProperty",
}) as any as S.Schema<ExecutionProperty>;
export interface JobCommand {
  Name?: string;
  ScriptLocation?: string;
  PythonVersion?: string;
  Runtime?: string;
}
export const JobCommand = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    ScriptLocation: S.optional(S.String),
    PythonVersion: S.optional(S.String),
    Runtime: S.optional(S.String),
  }),
).annotations({ identifier: "JobCommand" }) as any as S.Schema<JobCommand>;
export interface ConnectionsList {
  Connections?: string[];
}
export const ConnectionsList = S.suspend(() =>
  S.Struct({ Connections: S.optional(ConnectionStringList) }),
).annotations({
  identifier: "ConnectionsList",
}) as any as S.Schema<ConnectionsList>;
export interface SourceControlDetails {
  Provider?: SourceControlProvider;
  Repository?: string;
  Owner?: string;
  Branch?: string;
  Folder?: string;
  LastCommitId?: string;
  AuthStrategy?: SourceControlAuthStrategy;
  AuthToken?: string;
}
export const SourceControlDetails = S.suspend(() =>
  S.Struct({
    Provider: S.optional(SourceControlProvider),
    Repository: S.optional(S.String),
    Owner: S.optional(S.String),
    Branch: S.optional(S.String),
    Folder: S.optional(S.String),
    LastCommitId: S.optional(S.String),
    AuthStrategy: S.optional(SourceControlAuthStrategy),
    AuthToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceControlDetails",
}) as any as S.Schema<SourceControlDetails>;
export interface CodeGenEdge {
  Source: string;
  Target: string;
  TargetParameter?: string;
}
export const CodeGenEdge = S.suspend(() =>
  S.Struct({
    Source: S.String,
    Target: S.String,
    TargetParameter: S.optional(S.String),
  }),
).annotations({ identifier: "CodeGenEdge" }) as any as S.Schema<CodeGenEdge>;
export type DagEdges = CodeGenEdge[];
export const DagEdges = S.Array(CodeGenEdge);
export interface SessionCommand {
  Name?: string;
  PythonVersion?: string;
}
export const SessionCommand = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String), PythonVersion: S.optional(S.String) }),
).annotations({
  identifier: "SessionCommand",
}) as any as S.Schema<SessionCommand>;
export type OrchestrationArgumentsMap = { [key: string]: string | undefined };
export const OrchestrationArgumentsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface Action {
  JobName?: string;
  Arguments?: { [key: string]: string | undefined };
  Timeout?: number;
  SecurityConfiguration?: string;
  NotificationProperty?: NotificationProperty;
  CrawlerName?: string;
}
export const Action = S.suspend(() =>
  S.Struct({
    JobName: S.optional(S.String),
    Arguments: S.optional(GenericMap),
    Timeout: S.optional(S.Number),
    SecurityConfiguration: S.optional(S.String),
    NotificationProperty: S.optional(NotificationProperty),
    CrawlerName: S.optional(S.String),
  }),
).annotations({ identifier: "Action" }) as any as S.Schema<Action>;
export type ActionList = Action[];
export const ActionList = S.Array(Action);
export interface EventBatchingCondition {
  BatchSize: number;
  BatchWindow?: number;
}
export const EventBatchingCondition = S.suspend(() =>
  S.Struct({ BatchSize: S.Number, BatchWindow: S.optional(S.Number) }),
).annotations({
  identifier: "EventBatchingCondition",
}) as any as S.Schema<EventBatchingCondition>;
export type IntegrationStatus =
  | "CREATING"
  | "ACTIVE"
  | "MODIFYING"
  | "FAILED"
  | "DELETING"
  | "SYNCING"
  | "NEEDS_ATTENTION"
  | (string & {});
export const IntegrationStatus = S.String;
export type RegistryStatus = "AVAILABLE" | "DELETING" | (string & {});
export const RegistryStatus = S.String;
export interface IntegrationFilter {
  Name?: string;
  Values?: string[];
}
export const IntegrationFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Values: S.optional(IntegrationFilterValues),
  }),
).annotations({
  identifier: "IntegrationFilter",
}) as any as S.Schema<IntegrationFilter>;
export type IntegrationFilterList = IntegrationFilter[];
export const IntegrationFilterList = S.Array(IntegrationFilter);
export type BlueprintRunState =
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "ROLLING_BACK"
  | (string & {});
export const BlueprintRunState = S.String;
export interface BlueprintRun {
  BlueprintName?: string;
  RunId?: string;
  WorkflowName?: string;
  State?: BlueprintRunState;
  StartedOn?: Date;
  CompletedOn?: Date;
  ErrorMessage?: string;
  RollbackErrorMessage?: string;
  Parameters?: string;
  RoleArn?: string;
}
export const BlueprintRun = S.suspend(() =>
  S.Struct({
    BlueprintName: S.optional(S.String),
    RunId: S.optional(S.String),
    WorkflowName: S.optional(S.String),
    State: S.optional(BlueprintRunState),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ErrorMessage: S.optional(S.String),
    RollbackErrorMessage: S.optional(S.String),
    Parameters: S.optional(S.String),
    RoleArn: S.optional(S.String),
  }),
).annotations({ identifier: "BlueprintRun" }) as any as S.Schema<BlueprintRun>;
export type BlueprintRuns = BlueprintRun[];
export const BlueprintRuns = S.Array(BlueprintRun);
export interface DataLakeAccessPropertiesOutput {
  DataLakeAccess?: boolean;
  DataTransferRole?: string;
  KmsKey?: string;
  ManagedWorkgroupName?: string;
  ManagedWorkgroupStatus?: string;
  RedshiftDatabaseName?: string;
  StatusMessage?: string;
  CatalogType?: string;
}
export const DataLakeAccessPropertiesOutput = S.suspend(() =>
  S.Struct({
    DataLakeAccess: S.optional(S.Boolean),
    DataTransferRole: S.optional(S.String),
    KmsKey: S.optional(S.String),
    ManagedWorkgroupName: S.optional(S.String),
    ManagedWorkgroupStatus: S.optional(S.String),
    RedshiftDatabaseName: S.optional(S.String),
    StatusMessage: S.optional(S.String),
    CatalogType: S.optional(S.String),
  }),
).annotations({
  identifier: "DataLakeAccessPropertiesOutput",
}) as any as S.Schema<DataLakeAccessPropertiesOutput>;
export interface IcebergOptimizationPropertiesOutput {
  RoleArn?: string;
  Compaction?: { [key: string]: string | undefined };
  Retention?: { [key: string]: string | undefined };
  OrphanFileDeletion?: { [key: string]: string | undefined };
  LastUpdatedTime?: Date;
}
export const IcebergOptimizationPropertiesOutput = S.suspend(() =>
  S.Struct({
    RoleArn: S.optional(S.String),
    Compaction: S.optional(ParametersMap),
    Retention: S.optional(ParametersMap),
    OrphanFileDeletion: S.optional(ParametersMap),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "IcebergOptimizationPropertiesOutput",
}) as any as S.Schema<IcebergOptimizationPropertiesOutput>;
export interface CatalogPropertiesOutput {
  DataLakeAccessProperties?: DataLakeAccessPropertiesOutput;
  IcebergOptimizationProperties?: IcebergOptimizationPropertiesOutput;
  CustomProperties?: { [key: string]: string | undefined };
}
export const CatalogPropertiesOutput = S.suspend(() =>
  S.Struct({
    DataLakeAccessProperties: S.optional(DataLakeAccessPropertiesOutput),
    IcebergOptimizationProperties: S.optional(
      IcebergOptimizationPropertiesOutput,
    ),
    CustomProperties: S.optional(ParametersMap),
  }),
).annotations({
  identifier: "CatalogPropertiesOutput",
}) as any as S.Schema<CatalogPropertiesOutput>;
export interface Catalog {
  CatalogId?: string;
  Name: string;
  ResourceArn?: string;
  Description?: string;
  Parameters?: { [key: string]: string | undefined };
  CreateTime?: Date;
  UpdateTime?: Date;
  TargetRedshiftCatalog?: TargetRedshiftCatalog;
  FederatedCatalog?: FederatedCatalog;
  CatalogProperties?: CatalogPropertiesOutput;
  CreateTableDefaultPermissions?: PrincipalPermissions[];
  CreateDatabaseDefaultPermissions?: PrincipalPermissions[];
  AllowFullTableExternalDataAccess?: AllowFullTableExternalDataAccessEnum;
}
export const Catalog = S.suspend(() =>
  S.Struct({
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
    AllowFullTableExternalDataAccess: S.optional(
      AllowFullTableExternalDataAccessEnum,
    ),
  }),
).annotations({ identifier: "Catalog" }) as any as S.Schema<Catalog>;
export type CatalogList = Catalog[];
export const CatalogList = S.Array(Catalog);
export interface GrokClassifier {
  Name: string;
  Classification: string;
  CreationTime?: Date;
  LastUpdated?: Date;
  Version?: number;
  GrokPattern: string;
  CustomPatterns?: string;
}
export const GrokClassifier = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Classification: S.String,
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Version: S.optional(S.Number),
    GrokPattern: S.String,
    CustomPatterns: S.optional(S.String),
  }),
).annotations({
  identifier: "GrokClassifier",
}) as any as S.Schema<GrokClassifier>;
export interface XMLClassifier {
  Name: string;
  Classification: string;
  CreationTime?: Date;
  LastUpdated?: Date;
  Version?: number;
  RowTag?: string;
}
export const XMLClassifier = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Classification: S.String,
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Version: S.optional(S.Number),
    RowTag: S.optional(S.String),
  }),
).annotations({
  identifier: "XMLClassifier",
}) as any as S.Schema<XMLClassifier>;
export interface JsonClassifier {
  Name: string;
  CreationTime?: Date;
  LastUpdated?: Date;
  Version?: number;
  JsonPath: string;
}
export const JsonClassifier = S.suspend(() =>
  S.Struct({
    Name: S.String,
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Version: S.optional(S.Number),
    JsonPath: S.String,
  }),
).annotations({
  identifier: "JsonClassifier",
}) as any as S.Schema<JsonClassifier>;
export interface CsvClassifier {
  Name: string;
  CreationTime?: Date;
  LastUpdated?: Date;
  Version?: number;
  Delimiter?: string;
  QuoteSymbol?: string;
  ContainsHeader?: CsvHeaderOption;
  Header?: string[];
  DisableValueTrimming?: boolean;
  AllowSingleColumn?: boolean;
  CustomDatatypeConfigured?: boolean;
  CustomDatatypes?: string[];
  Serde?: CsvSerdeOption;
}
export const CsvClassifier = S.suspend(() =>
  S.Struct({
    Name: S.String,
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Version: S.optional(S.Number),
    Delimiter: S.optional(S.String),
    QuoteSymbol: S.optional(S.String),
    ContainsHeader: S.optional(CsvHeaderOption),
    Header: S.optional(CsvHeader),
    DisableValueTrimming: S.optional(S.Boolean),
    AllowSingleColumn: S.optional(S.Boolean),
    CustomDatatypeConfigured: S.optional(S.Boolean),
    CustomDatatypes: S.optional(CustomDatatypes),
    Serde: S.optional(CsvSerdeOption),
  }),
).annotations({
  identifier: "CsvClassifier",
}) as any as S.Schema<CsvClassifier>;
export interface Classifier {
  GrokClassifier?: GrokClassifier;
  XMLClassifier?: XMLClassifier;
  JsonClassifier?: JsonClassifier;
  CsvClassifier?: CsvClassifier;
}
export const Classifier = S.suspend(() =>
  S.Struct({
    GrokClassifier: S.optional(GrokClassifier),
    XMLClassifier: S.optional(XMLClassifier),
    JsonClassifier: S.optional(JsonClassifier),
    CsvClassifier: S.optional(CsvClassifier),
  }),
).annotations({ identifier: "Classifier" }) as any as S.Schema<Classifier>;
export type ClassifierList = Classifier[];
export const ClassifierList = S.Array(Classifier);
export type ColumnStatisticsList = ColumnStatistics[];
export const ColumnStatisticsList = S.Array(ColumnStatistics);
export type ComputationType = "FULL" | "INCREMENTAL" | (string & {});
export const ComputationType = S.String;
export type ColumnStatisticsState =
  | "STARTING"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "STOPPED"
  | (string & {});
export const ColumnStatisticsState = S.String;
export interface ColumnStatisticsTaskRun {
  CustomerId?: string;
  ColumnStatisticsTaskRunId?: string;
  DatabaseName?: string;
  TableName?: string;
  ColumnNameList?: string[];
  CatalogID?: string;
  Role?: string;
  SampleSize?: number;
  SecurityConfiguration?: string;
  NumberOfWorkers?: number;
  WorkerType?: string;
  ComputationType?: ComputationType;
  Status?: ColumnStatisticsState;
  CreationTime?: Date;
  LastUpdated?: Date;
  StartTime?: Date;
  EndTime?: Date;
  ErrorMessage?: string;
  DPUSeconds?: number;
}
export const ColumnStatisticsTaskRun = S.suspend(() =>
  S.Struct({
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
    ComputationType: S.optional(ComputationType),
    Status: S.optional(ColumnStatisticsState),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ErrorMessage: S.optional(S.String),
    DPUSeconds: S.optional(S.Number),
  }),
).annotations({
  identifier: "ColumnStatisticsTaskRun",
}) as any as S.Schema<ColumnStatisticsTaskRun>;
export type ColumnStatisticsTaskRunsList = ColumnStatisticsTaskRun[];
export const ColumnStatisticsTaskRunsList = S.Array(ColumnStatisticsTaskRun);
export interface GetConnectionsFilter {
  MatchCriteria?: string[];
  ConnectionType?: ConnectionType;
  ConnectionSchemaVersion?: number;
}
export const GetConnectionsFilter = S.suspend(() =>
  S.Struct({
    MatchCriteria: S.optional(MatchCriteria),
    ConnectionType: S.optional(ConnectionType),
    ConnectionSchemaVersion: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetConnectionsFilter",
}) as any as S.Schema<GetConnectionsFilter>;
export interface Database {
  Name: string;
  Description?: string;
  LocationUri?: string;
  Parameters?: { [key: string]: string | undefined };
  CreateTime?: Date;
  CreateTableDefaultPermissions?: PrincipalPermissions[];
  TargetDatabase?: DatabaseIdentifier;
  CatalogId?: string;
  FederatedDatabase?: FederatedDatabase;
}
export const Database = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    LocationUri: S.optional(S.String),
    Parameters: S.optional(ParametersMap),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CreateTableDefaultPermissions: S.optional(PrincipalPermissionsList),
    TargetDatabase: S.optional(DatabaseIdentifier),
    CatalogId: S.optional(S.String),
    FederatedDatabase: S.optional(FederatedDatabase),
  }),
).annotations({ identifier: "Database" }) as any as S.Schema<Database>;
export type DatabaseList = Database[];
export const DatabaseList = S.Array(Database);
export type DataQualityModelStatus =
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | (string & {});
export const DataQualityModelStatus = S.String;
export type DataQualityResultIdList = string[];
export const DataQualityResultIdList = S.Array(S.String);
export type ConnectionOptions = { [key: string]: string | undefined };
export const ConnectionOptions = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type JobRunState =
  | "STARTING"
  | "RUNNING"
  | "STOPPING"
  | "STOPPED"
  | "SUCCEEDED"
  | "FAILED"
  | "TIMEOUT"
  | "ERROR"
  | "WAITING"
  | "EXPIRED"
  | (string & {});
export const JobRunState = S.String;
export interface Predecessor {
  JobName?: string;
  RunId?: string;
}
export const Predecessor = S.suspend(() =>
  S.Struct({ JobName: S.optional(S.String), RunId: S.optional(S.String) }),
).annotations({ identifier: "Predecessor" }) as any as S.Schema<Predecessor>;
export type PredecessorList = Predecessor[];
export const PredecessorList = S.Array(Predecessor);
export interface JobRun {
  Id?: string;
  Attempt?: number;
  PreviousRunId?: string;
  TriggerName?: string;
  JobName?: string;
  JobMode?: JobMode;
  JobRunQueuingEnabled?: boolean;
  StartedOn?: Date;
  LastModifiedOn?: Date;
  CompletedOn?: Date;
  JobRunState?: JobRunState;
  Arguments?: { [key: string]: string | undefined };
  ErrorMessage?: string;
  PredecessorRuns?: Predecessor[];
  AllocatedCapacity?: number;
  ExecutionTime?: number;
  Timeout?: number;
  MaxCapacity?: number;
  WorkerType?: WorkerType;
  NumberOfWorkers?: number;
  SecurityConfiguration?: string;
  LogGroupName?: string;
  NotificationProperty?: NotificationProperty;
  GlueVersion?: string;
  DPUSeconds?: number;
  ExecutionClass?: ExecutionClass;
  MaintenanceWindow?: string;
  ProfileName?: string;
  StateDetail?: string;
  ExecutionRoleSessionPolicy?: string;
}
export const JobRun = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    Attempt: S.optional(S.Number),
    PreviousRunId: S.optional(S.String),
    TriggerName: S.optional(S.String),
    JobName: S.optional(S.String),
    JobMode: S.optional(JobMode),
    JobRunQueuingEnabled: S.optional(S.Boolean),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    JobRunState: S.optional(JobRunState),
    Arguments: S.optional(GenericMap),
    ErrorMessage: S.optional(S.String),
    PredecessorRuns: S.optional(PredecessorList),
    AllocatedCapacity: S.optional(S.Number),
    ExecutionTime: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    MaxCapacity: S.optional(S.Number),
    WorkerType: S.optional(WorkerType),
    NumberOfWorkers: S.optional(S.Number),
    SecurityConfiguration: S.optional(S.String),
    LogGroupName: S.optional(S.String),
    NotificationProperty: S.optional(NotificationProperty),
    GlueVersion: S.optional(S.String),
    DPUSeconds: S.optional(S.Number),
    ExecutionClass: S.optional(ExecutionClass),
    MaintenanceWindow: S.optional(S.String),
    ProfileName: S.optional(S.String),
    StateDetail: S.optional(S.String),
    ExecutionRoleSessionPolicy: S.optional(S.String),
  }),
).annotations({ identifier: "JobRun" }) as any as S.Schema<JobRun>;
export type JobRunList = JobRun[];
export const JobRunList = S.Array(JobRun);
export interface CodeGenNodeArg {
  Name: string;
  Value: string;
  Param?: boolean;
}
export const CodeGenNodeArg = S.suspend(() =>
  S.Struct({ Name: S.String, Value: S.String, Param: S.optional(S.Boolean) }),
).annotations({
  identifier: "CodeGenNodeArg",
}) as any as S.Schema<CodeGenNodeArg>;
export type CodeGenNodeArgs = CodeGenNodeArg[];
export const CodeGenNodeArgs = S.Array(CodeGenNodeArg);
export interface Location {
  Jdbc?: CodeGenNodeArg[];
  S3?: CodeGenNodeArg[];
  DynamoDB?: CodeGenNodeArg[];
}
export const Location = S.suspend(() =>
  S.Struct({
    Jdbc: S.optional(CodeGenNodeArgs),
    S3: S.optional(CodeGenNodeArgs),
    DynamoDB: S.optional(CodeGenNodeArgs),
  }),
).annotations({ identifier: "Location" }) as any as S.Schema<Location>;
export interface TaskRunFilterCriteria {
  TaskRunType?: TaskType;
  Status?: TaskStatusType;
  StartedBefore?: Date;
  StartedAfter?: Date;
}
export const TaskRunFilterCriteria = S.suspend(() =>
  S.Struct({
    TaskRunType: S.optional(TaskType),
    Status: S.optional(TaskStatusType),
    StartedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "TaskRunFilterCriteria",
}) as any as S.Schema<TaskRunFilterCriteria>;
export interface TaskRunSortCriteria {
  Column: TaskRunSortColumnType;
  SortDirection: SortDirectionType;
}
export const TaskRunSortCriteria = S.suspend(() =>
  S.Struct({ Column: TaskRunSortColumnType, SortDirection: SortDirectionType }),
).annotations({
  identifier: "TaskRunSortCriteria",
}) as any as S.Schema<TaskRunSortCriteria>;
export interface MappingEntry {
  SourceTable?: string;
  SourcePath?: string;
  SourceType?: string;
  TargetTable?: string;
  TargetPath?: string;
  TargetType?: string;
}
export const MappingEntry = S.suspend(() =>
  S.Struct({
    SourceTable: S.optional(S.String),
    SourcePath: S.optional(S.String),
    SourceType: S.optional(S.String),
    TargetTable: S.optional(S.String),
    TargetPath: S.optional(S.String),
    TargetType: S.optional(S.String),
  }),
).annotations({ identifier: "MappingEntry" }) as any as S.Schema<MappingEntry>;
export type MappingList = MappingEntry[];
export const MappingList = S.Array(MappingEntry);
export type AdditionalPlanOptionsMap = { [key: string]: string | undefined };
export const AdditionalPlanOptionsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type SchemaStatus = "AVAILABLE" | "PENDING" | "DELETING" | (string & {});
export const SchemaStatus = S.String;
export type SchemaVersionStatus =
  | "AVAILABLE"
  | "PENDING"
  | "FAILURE"
  | "DELETING"
  | (string & {});
export const SchemaVersionStatus = S.String;
export type S3EncryptionMode =
  | "DISABLED"
  | "SSE-KMS"
  | "SSE-S3"
  | (string & {});
export const S3EncryptionMode = S.String;
export interface S3Encryption {
  S3EncryptionMode?: S3EncryptionMode;
  KmsKeyArn?: string;
}
export const S3Encryption = S.suspend(() =>
  S.Struct({
    S3EncryptionMode: S.optional(S3EncryptionMode),
    KmsKeyArn: S.optional(S.String),
  }),
).annotations({ identifier: "S3Encryption" }) as any as S.Schema<S3Encryption>;
export type S3EncryptionList = S3Encryption[];
export const S3EncryptionList = S.Array(S3Encryption);
export type CloudWatchEncryptionMode = "DISABLED" | "SSE-KMS" | (string & {});
export const CloudWatchEncryptionMode = S.String;
export interface CloudWatchEncryption {
  CloudWatchEncryptionMode?: CloudWatchEncryptionMode;
  KmsKeyArn?: string;
}
export const CloudWatchEncryption = S.suspend(() =>
  S.Struct({
    CloudWatchEncryptionMode: S.optional(CloudWatchEncryptionMode),
    KmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "CloudWatchEncryption",
}) as any as S.Schema<CloudWatchEncryption>;
export type JobBookmarksEncryptionMode = "DISABLED" | "CSE-KMS" | (string & {});
export const JobBookmarksEncryptionMode = S.String;
export interface JobBookmarksEncryption {
  JobBookmarksEncryptionMode?: JobBookmarksEncryptionMode;
  KmsKeyArn?: string;
}
export const JobBookmarksEncryption = S.suspend(() =>
  S.Struct({
    JobBookmarksEncryptionMode: S.optional(JobBookmarksEncryptionMode),
    KmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "JobBookmarksEncryption",
}) as any as S.Schema<JobBookmarksEncryption>;
export type DataQualityEncryptionMode = "DISABLED" | "SSE-KMS" | (string & {});
export const DataQualityEncryptionMode = S.String;
export interface DataQualityEncryption {
  DataQualityEncryptionMode?: DataQualityEncryptionMode;
  KmsKeyArn?: string;
}
export const DataQualityEncryption = S.suspend(() =>
  S.Struct({
    DataQualityEncryptionMode: S.optional(DataQualityEncryptionMode),
    KmsKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DataQualityEncryption",
}) as any as S.Schema<DataQualityEncryption>;
export interface EncryptionConfiguration {
  S3Encryption?: S3Encryption[];
  CloudWatchEncryption?: CloudWatchEncryption;
  JobBookmarksEncryption?: JobBookmarksEncryption;
  DataQualityEncryption?: DataQualityEncryption;
}
export const EncryptionConfiguration = S.suspend(() =>
  S.Struct({
    S3Encryption: S.optional(S3EncryptionList),
    CloudWatchEncryption: S.optional(CloudWatchEncryption),
    JobBookmarksEncryption: S.optional(JobBookmarksEncryption),
    DataQualityEncryption: S.optional(DataQualityEncryption),
  }),
).annotations({
  identifier: "EncryptionConfiguration",
}) as any as S.Schema<EncryptionConfiguration>;
export interface SecurityConfiguration {
  Name?: string;
  CreatedTimeStamp?: Date;
  EncryptionConfiguration?: EncryptionConfiguration;
}
export const SecurityConfiguration = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CreatedTimeStamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    EncryptionConfiguration: S.optional(EncryptionConfiguration),
  }),
).annotations({
  identifier: "SecurityConfiguration",
}) as any as S.Schema<SecurityConfiguration>;
export type SecurityConfigurationList = SecurityConfiguration[];
export const SecurityConfigurationList = S.Array(SecurityConfiguration);
export interface TableIdentifier {
  CatalogId?: string;
  DatabaseName?: string;
  Name?: string;
  Region?: string;
}
export const TableIdentifier = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    Name: S.optional(S.String),
    Region: S.optional(S.String),
  }),
).annotations({
  identifier: "TableIdentifier",
}) as any as S.Schema<TableIdentifier>;
export interface FederatedTable {
  Identifier?: string;
  DatabaseIdentifier?: string;
  ConnectionName?: string;
  ConnectionType?: string;
}
export const FederatedTable = S.suspend(() =>
  S.Struct({
    Identifier: S.optional(S.String),
    DatabaseIdentifier: S.optional(S.String),
    ConnectionName: S.optional(S.String),
    ConnectionType: S.optional(S.String),
  }),
).annotations({
  identifier: "FederatedTable",
}) as any as S.Schema<FederatedTable>;
export type LastRefreshType = "FULL" | "INCREMENTAL" | (string & {});
export const LastRefreshType = S.String;
export type ViewSubObjectsList = string[];
export const ViewSubObjectsList = S.Array(S.String);
export type ViewSubObjectVersionIdsList = number[];
export const ViewSubObjectVersionIdsList = S.Array(S.Number);
export interface ViewRepresentation {
  Dialect?: ViewDialect;
  DialectVersion?: string;
  ViewOriginalText?: string;
  ViewExpandedText?: string;
  ValidationConnection?: string;
  IsStale?: boolean;
}
export const ViewRepresentation = S.suspend(() =>
  S.Struct({
    Dialect: S.optional(ViewDialect),
    DialectVersion: S.optional(S.String),
    ViewOriginalText: S.optional(S.String),
    ViewExpandedText: S.optional(S.String),
    ValidationConnection: S.optional(S.String),
    IsStale: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ViewRepresentation",
}) as any as S.Schema<ViewRepresentation>;
export type ViewRepresentationList = ViewRepresentation[];
export const ViewRepresentationList = S.Array(ViewRepresentation);
export interface ViewDefinition {
  IsProtected?: boolean;
  Definer?: string;
  ViewVersionId?: number;
  ViewVersionToken?: string;
  RefreshSeconds?: number;
  LastRefreshType?: LastRefreshType;
  SubObjects?: string[];
  SubObjectVersionIds?: number[];
  Representations?: ViewRepresentation[];
}
export const ViewDefinition = S.suspend(() =>
  S.Struct({
    IsProtected: S.optional(S.Boolean),
    Definer: S.optional(S.String),
    ViewVersionId: S.optional(S.Number),
    ViewVersionToken: S.optional(S.String),
    RefreshSeconds: S.optional(S.Number),
    LastRefreshType: S.optional(LastRefreshType),
    SubObjects: S.optional(ViewSubObjectsList),
    SubObjectVersionIds: S.optional(ViewSubObjectVersionIdsList),
    Representations: S.optional(ViewRepresentationList),
  }),
).annotations({
  identifier: "ViewDefinition",
}) as any as S.Schema<ViewDefinition>;
export interface Table {
  Name: string;
  DatabaseName?: string;
  Description?: string;
  Owner?: string;
  CreateTime?: Date;
  UpdateTime?: Date;
  LastAccessTime?: Date;
  LastAnalyzedTime?: Date;
  Retention?: number;
  StorageDescriptor?: StorageDescriptor;
  PartitionKeys?: Column[];
  ViewOriginalText?: string;
  ViewExpandedText?: string;
  TableType?: string;
  Parameters?: { [key: string]: string | undefined };
  CreatedBy?: string;
  IsRegisteredWithLakeFormation?: boolean;
  TargetTable?: TableIdentifier;
  CatalogId?: string;
  VersionId?: string;
  FederatedTable?: FederatedTable;
  ViewDefinition?: ViewDefinition;
  IsMultiDialectView?: boolean;
  IsMaterializedView?: boolean;
  Status?: TableStatus;
}
export const Table = S.suspend(() =>
  S.Struct({
    Name: S.String,
    DatabaseName: S.optional(S.String),
    Description: S.optional(S.String),
    Owner: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastAccessTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastAnalyzedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
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
    Status: S.optional(
      S.suspend((): S.Schema<TableStatus, any> => TableStatus).annotations({
        identifier: "TableStatus",
      }),
    ),
  }),
).annotations({ identifier: "Table" }) as any as S.Schema<Table>;
export interface TableVersion {
  Table?: Table;
  VersionId?: string;
}
export const TableVersion = S.suspend(() =>
  S.Struct({ Table: S.optional(Table), VersionId: S.optional(S.String) }),
).annotations({ identifier: "TableVersion" }) as any as S.Schema<TableVersion>;
export type GetTableVersionsList = TableVersion[];
export const GetTableVersionsList = S.Array(TableVersion);
export interface SupportedDialect {
  Dialect?: ViewDialect;
  DialectVersion?: string;
}
export const SupportedDialect = S.suspend(() =>
  S.Struct({
    Dialect: S.optional(ViewDialect),
    DialectVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "SupportedDialect",
}) as any as S.Schema<SupportedDialect>;
export interface UserDefinedFunction {
  FunctionName?: string;
  DatabaseName?: string;
  ClassName?: string;
  OwnerName?: string;
  FunctionType?: FunctionType;
  OwnerType?: PrincipalType;
  CreateTime?: Date;
  ResourceUris?: ResourceUri[];
  CatalogId?: string;
}
export const UserDefinedFunction = S.suspend(() =>
  S.Struct({
    FunctionName: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    ClassName: S.optional(S.String),
    OwnerName: S.optional(S.String),
    FunctionType: S.optional(FunctionType),
    OwnerType: S.optional(PrincipalType),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ResourceUris: S.optional(ResourceUriList),
    CatalogId: S.optional(S.String),
  }),
).annotations({
  identifier: "UserDefinedFunction",
}) as any as S.Schema<UserDefinedFunction>;
export type UserDefinedFunctionList = UserDefinedFunction[];
export const UserDefinedFunctionList = S.Array(UserDefinedFunction);
export type WorkflowRunStatus =
  | "RUNNING"
  | "COMPLETED"
  | "STOPPING"
  | "STOPPED"
  | "ERROR"
  | (string & {});
export const WorkflowRunStatus = S.String;
export interface WorkflowRunStatistics {
  TotalActions?: number;
  TimeoutActions?: number;
  FailedActions?: number;
  StoppedActions?: number;
  SucceededActions?: number;
  RunningActions?: number;
  ErroredActions?: number;
  WaitingActions?: number;
}
export const WorkflowRunStatistics = S.suspend(() =>
  S.Struct({
    TotalActions: S.optional(S.Number),
    TimeoutActions: S.optional(S.Number),
    FailedActions: S.optional(S.Number),
    StoppedActions: S.optional(S.Number),
    SucceededActions: S.optional(S.Number),
    RunningActions: S.optional(S.Number),
    ErroredActions: S.optional(S.Number),
    WaitingActions: S.optional(S.Number),
  }),
).annotations({
  identifier: "WorkflowRunStatistics",
}) as any as S.Schema<WorkflowRunStatistics>;
export type NodeType = "CRAWLER" | "JOB" | "TRIGGER" | (string & {});
export const NodeType = S.String;
export type TriggerState =
  | "CREATING"
  | "CREATED"
  | "ACTIVATING"
  | "ACTIVATED"
  | "DEACTIVATING"
  | "DEACTIVATED"
  | "DELETING"
  | "UPDATING"
  | (string & {});
export const TriggerState = S.String;
export type LogicalOperator = "EQUALS" | (string & {});
export const LogicalOperator = S.String;
export type CrawlState =
  | "RUNNING"
  | "CANCELLING"
  | "CANCELLED"
  | "SUCCEEDED"
  | "FAILED"
  | "ERROR"
  | (string & {});
export const CrawlState = S.String;
export interface Condition {
  LogicalOperator?: LogicalOperator;
  JobName?: string;
  State?: JobRunState;
  CrawlerName?: string;
  CrawlState?: CrawlState;
}
export const Condition = S.suspend(() =>
  S.Struct({
    LogicalOperator: S.optional(LogicalOperator),
    JobName: S.optional(S.String),
    State: S.optional(JobRunState),
    CrawlerName: S.optional(S.String),
    CrawlState: S.optional(CrawlState),
  }),
).annotations({ identifier: "Condition" }) as any as S.Schema<Condition>;
export type ConditionList = Condition[];
export const ConditionList = S.Array(Condition);
export interface Predicate {
  Logical?: Logical;
  Conditions?: Condition[];
}
export const Predicate = S.suspend(() =>
  S.Struct({
    Logical: S.optional(Logical),
    Conditions: S.optional(ConditionList),
  }),
).annotations({ identifier: "Predicate" }) as any as S.Schema<Predicate>;
export interface Trigger {
  Name?: string;
  WorkflowName?: string;
  Id?: string;
  Type?: TriggerType;
  State?: TriggerState;
  Description?: string;
  Schedule?: string;
  Actions?: Action[];
  Predicate?: Predicate;
  EventBatchingCondition?: EventBatchingCondition;
}
export const Trigger = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    WorkflowName: S.optional(S.String),
    Id: S.optional(S.String),
    Type: S.optional(TriggerType),
    State: S.optional(TriggerState),
    Description: S.optional(S.String),
    Schedule: S.optional(S.String),
    Actions: S.optional(ActionList),
    Predicate: S.optional(Predicate),
    EventBatchingCondition: S.optional(EventBatchingCondition),
  }),
).annotations({ identifier: "Trigger" }) as any as S.Schema<Trigger>;
export interface TriggerNodeDetails {
  Trigger?: Trigger;
}
export const TriggerNodeDetails = S.suspend(() =>
  S.Struct({ Trigger: S.optional(Trigger) }),
).annotations({
  identifier: "TriggerNodeDetails",
}) as any as S.Schema<TriggerNodeDetails>;
export interface JobNodeDetails {
  JobRuns?: JobRun[];
}
export const JobNodeDetails = S.suspend(() =>
  S.Struct({ JobRuns: S.optional(JobRunList) }),
).annotations({
  identifier: "JobNodeDetails",
}) as any as S.Schema<JobNodeDetails>;
export interface Crawl {
  State?: CrawlState;
  StartedOn?: Date;
  CompletedOn?: Date;
  ErrorMessage?: string;
  LogGroup?: string;
  LogStream?: string;
}
export const Crawl = S.suspend(() =>
  S.Struct({
    State: S.optional(CrawlState),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ErrorMessage: S.optional(S.String),
    LogGroup: S.optional(S.String),
    LogStream: S.optional(S.String),
  }),
).annotations({ identifier: "Crawl" }) as any as S.Schema<Crawl>;
export type CrawlList = Crawl[];
export const CrawlList = S.Array(Crawl);
export interface CrawlerNodeDetails {
  Crawls?: Crawl[];
}
export const CrawlerNodeDetails = S.suspend(() =>
  S.Struct({ Crawls: S.optional(CrawlList) }),
).annotations({
  identifier: "CrawlerNodeDetails",
}) as any as S.Schema<CrawlerNodeDetails>;
export interface Node {
  Type?: NodeType;
  Name?: string;
  UniqueId?: string;
  TriggerDetails?: TriggerNodeDetails;
  JobDetails?: JobNodeDetails;
  CrawlerDetails?: CrawlerNodeDetails;
}
export const Node = S.suspend(() =>
  S.Struct({
    Type: S.optional(NodeType),
    Name: S.optional(S.String),
    UniqueId: S.optional(S.String),
    TriggerDetails: S.optional(TriggerNodeDetails),
    JobDetails: S.optional(JobNodeDetails),
    CrawlerDetails: S.optional(CrawlerNodeDetails),
  }),
).annotations({ identifier: "Node" }) as any as S.Schema<Node>;
export type NodeList = Node[];
export const NodeList = S.Array(Node);
export interface Edge {
  SourceId?: string;
  DestinationId?: string;
}
export const Edge = S.suspend(() =>
  S.Struct({
    SourceId: S.optional(S.String),
    DestinationId: S.optional(S.String),
  }),
).annotations({ identifier: "Edge" }) as any as S.Schema<Edge>;
export type EdgeList = Edge[];
export const EdgeList = S.Array(Edge);
export interface WorkflowGraph {
  Nodes?: Node[];
  Edges?: Edge[];
}
export const WorkflowGraph = S.suspend(() =>
  S.Struct({ Nodes: S.optional(NodeList), Edges: S.optional(EdgeList) }),
).annotations({
  identifier: "WorkflowGraph",
}) as any as S.Schema<WorkflowGraph>;
export interface StartingEventBatchCondition {
  BatchSize?: number;
  BatchWindow?: number;
}
export const StartingEventBatchCondition = S.suspend(() =>
  S.Struct({
    BatchSize: S.optional(S.Number),
    BatchWindow: S.optional(S.Number),
  }),
).annotations({
  identifier: "StartingEventBatchCondition",
}) as any as S.Schema<StartingEventBatchCondition>;
export interface WorkflowRun {
  Name?: string;
  WorkflowRunId?: string;
  PreviousRunId?: string;
  WorkflowRunProperties?: { [key: string]: string | undefined };
  StartedOn?: Date;
  CompletedOn?: Date;
  Status?: WorkflowRunStatus;
  ErrorMessage?: string;
  Statistics?: WorkflowRunStatistics;
  Graph?: WorkflowGraph;
  StartingEventBatchCondition?: StartingEventBatchCondition;
}
export const WorkflowRun = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    WorkflowRunId: S.optional(S.String),
    PreviousRunId: S.optional(S.String),
    WorkflowRunProperties: S.optional(WorkflowRunProperties),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(WorkflowRunStatus),
    ErrorMessage: S.optional(S.String),
    Statistics: S.optional(WorkflowRunStatistics),
    Graph: S.optional(WorkflowGraph),
    StartingEventBatchCondition: S.optional(StartingEventBatchCondition),
  }),
).annotations({ identifier: "WorkflowRun" }) as any as S.Schema<WorkflowRun>;
export type WorkflowRuns = WorkflowRun[];
export const WorkflowRuns = S.Array(WorkflowRun);
export type ColumnStatisticsTaskRunIdList = string[];
export const ColumnStatisticsTaskRunIdList = S.Array(S.String);
export interface CrawlsFilter {
  FieldName?: FieldName;
  FilterOperator?: FilterOperator;
  FieldValue?: string;
}
export const CrawlsFilter = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(FieldName),
    FilterOperator: S.optional(FilterOperator),
    FieldValue: S.optional(S.String),
  }),
).annotations({ identifier: "CrawlsFilter" }) as any as S.Schema<CrawlsFilter>;
export type CrawlsFilterList = CrawlsFilter[];
export const CrawlsFilterList = S.Array(CrawlsFilter);
export type GlueTableAdditionalOptions = { [key: string]: string | undefined };
export const GlueTableAdditionalOptions = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface GlueTable {
  DatabaseName: string;
  TableName: string;
  CatalogId?: string;
  ConnectionName?: string;
  AdditionalOptions?: { [key: string]: string | undefined };
}
export const GlueTable = S.suspend(() =>
  S.Struct({
    DatabaseName: S.String,
    TableName: S.String,
    CatalogId: S.optional(S.String),
    ConnectionName: S.optional(S.String),
    AdditionalOptions: S.optional(GlueTableAdditionalOptions),
  }),
).annotations({ identifier: "GlueTable" }) as any as S.Schema<GlueTable>;
export interface DataQualityGlueTable {
  DatabaseName: string;
  TableName: string;
  CatalogId?: string;
  ConnectionName?: string;
  AdditionalOptions?: { [key: string]: string | undefined };
  PreProcessingQuery?: string;
}
export const DataQualityGlueTable = S.suspend(() =>
  S.Struct({
    DatabaseName: S.String,
    TableName: S.String,
    CatalogId: S.optional(S.String),
    ConnectionName: S.optional(S.String),
    AdditionalOptions: S.optional(GlueTableAdditionalOptions),
    PreProcessingQuery: S.optional(S.String),
  }),
).annotations({
  identifier: "DataQualityGlueTable",
}) as any as S.Schema<DataQualityGlueTable>;
export interface DataSource {
  GlueTable?: GlueTable;
  DataQualityGlueTable?: DataQualityGlueTable;
}
export const DataSource = S.suspend(() =>
  S.Struct({
    GlueTable: S.optional(GlueTable),
    DataQualityGlueTable: S.optional(DataQualityGlueTable),
  }),
).annotations({ identifier: "DataSource" }) as any as S.Schema<DataSource>;
export interface DataQualityResultFilterCriteria {
  DataSource?: DataSource;
  JobName?: string;
  JobRunId?: string;
  StartedAfter?: Date;
  StartedBefore?: Date;
}
export const DataQualityResultFilterCriteria = S.suspend(() =>
  S.Struct({
    DataSource: S.optional(DataSource),
    JobName: S.optional(S.String),
    JobRunId: S.optional(S.String),
    StartedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DataQualityResultFilterCriteria",
}) as any as S.Schema<DataQualityResultFilterCriteria>;
export interface DataQualityRuleRecommendationRunFilter {
  DataSource: DataSource;
  StartedBefore?: Date;
  StartedAfter?: Date;
}
export const DataQualityRuleRecommendationRunFilter = S.suspend(() =>
  S.Struct({
    DataSource: DataSource,
    StartedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DataQualityRuleRecommendationRunFilter",
}) as any as S.Schema<DataQualityRuleRecommendationRunFilter>;
export interface DataQualityRulesetEvaluationRunFilter {
  DataSource: DataSource;
  StartedBefore?: Date;
  StartedAfter?: Date;
}
export const DataQualityRulesetEvaluationRunFilter = S.suspend(() =>
  S.Struct({
    DataSource: DataSource,
    StartedBefore: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartedAfter: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DataQualityRulesetEvaluationRunFilter",
}) as any as S.Schema<DataQualityRulesetEvaluationRunFilter>;
export interface DataQualityRulesetFilterCriteria {
  Name?: string;
  Description?: string;
  CreatedBefore?: Date;
  CreatedAfter?: Date;
  LastModifiedBefore?: Date;
  LastModifiedAfter?: Date;
  TargetTable?: DataQualityTargetTable;
}
export const DataQualityRulesetFilterCriteria = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DataQualityRulesetFilterCriteria",
}) as any as S.Schema<DataQualityRulesetFilterCriteria>;
export type DevEndpointNameList = string[];
export const DevEndpointNameList = S.Array(S.String);
export interface IntegrationResourcePropertyFilter {
  Name?: string;
  Values?: string[];
}
export const IntegrationResourcePropertyFilter = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Values: S.optional(IntegrationResourcePropertyFilterValues),
  }),
).annotations({
  identifier: "IntegrationResourcePropertyFilter",
}) as any as S.Schema<IntegrationResourcePropertyFilter>;
export type IntegrationResourcePropertyFilterList =
  IntegrationResourcePropertyFilter[];
export const IntegrationResourcePropertyFilterList = S.Array(
  IntegrationResourcePropertyFilter,
);
export type MaterializedViewRefreshState =
  | "STARTING"
  | "RUNNING"
  | "SUCCEEDED"
  | "FAILED"
  | "STOPPED"
  | (string & {});
export const MaterializedViewRefreshState = S.String;
export type MaterializedViewRefreshType =
  | "FULL"
  | "INCREMENTAL"
  | (string & {});
export const MaterializedViewRefreshType = S.String;
export interface MaterializedViewRefreshTaskRun {
  CustomerId?: string;
  MaterializedViewRefreshTaskRunId?: string;
  DatabaseName?: string;
  TableName?: string;
  CatalogId?: string;
  Role?: string;
  Status?: MaterializedViewRefreshState;
  CreationTime?: Date;
  LastUpdated?: Date;
  StartTime?: Date;
  EndTime?: Date;
  ErrorMessage?: string;
  DPUSeconds?: number;
  RefreshType?: MaterializedViewRefreshType;
  ProcessedBytes?: number;
}
export const MaterializedViewRefreshTaskRun = S.suspend(() =>
  S.Struct({
    CustomerId: S.optional(S.String),
    MaterializedViewRefreshTaskRunId: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    TableName: S.optional(S.String),
    CatalogId: S.optional(S.String),
    Role: S.optional(S.String),
    Status: S.optional(MaterializedViewRefreshState),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ErrorMessage: S.optional(S.String),
    DPUSeconds: S.optional(S.Number),
    RefreshType: S.optional(MaterializedViewRefreshType),
    ProcessedBytes: S.optional(S.Number),
  }),
).annotations({
  identifier: "MaterializedViewRefreshTaskRun",
}) as any as S.Schema<MaterializedViewRefreshTaskRun>;
export type MaterializedViewRefreshTaskRunsList =
  MaterializedViewRefreshTaskRun[];
export const MaterializedViewRefreshTaskRunsList = S.Array(
  MaterializedViewRefreshTaskRun,
);
export type TransformIdList = string[];
export const TransformIdList = S.Array(S.String);
export type SessionIdList = string[];
export const SessionIdList = S.Array(S.String);
export type SessionStatus =
  | "PROVISIONING"
  | "READY"
  | "FAILED"
  | "TIMEOUT"
  | "STOPPING"
  | "STOPPED"
  | (string & {});
export const SessionStatus = S.String;
export interface Session {
  Id?: string;
  CreatedOn?: Date;
  Status?: SessionStatus;
  ErrorMessage?: string;
  Description?: string;
  Role?: string;
  Command?: SessionCommand;
  DefaultArguments?: { [key: string]: string | undefined };
  Connections?: ConnectionsList;
  Progress?: number;
  MaxCapacity?: number;
  SecurityConfiguration?: string;
  GlueVersion?: string;
  NumberOfWorkers?: number;
  WorkerType?: WorkerType;
  CompletedOn?: Date;
  ExecutionTime?: number;
  DPUSeconds?: number;
  IdleTimeout?: number;
  ProfileName?: string;
}
export const Session = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.String),
    CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Status: S.optional(SessionStatus),
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
    WorkerType: S.optional(WorkerType),
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExecutionTime: S.optional(S.Number),
    DPUSeconds: S.optional(S.Number),
    IdleTimeout: S.optional(S.Number),
    ProfileName: S.optional(S.String),
  }),
).annotations({ identifier: "Session" }) as any as S.Schema<Session>;
export type SessionList = Session[];
export const SessionList = S.Array(Session);
export type StatementState =
  | "WAITING"
  | "RUNNING"
  | "AVAILABLE"
  | "CANCELLING"
  | "CANCELLED"
  | "ERROR"
  | (string & {});
export const StatementState = S.String;
export interface StatementOutputData {
  TextPlain?: string;
}
export const StatementOutputData = S.suspend(() =>
  S.Struct({ TextPlain: S.optional(S.String) }),
).annotations({
  identifier: "StatementOutputData",
}) as any as S.Schema<StatementOutputData>;
export interface StatementOutput {
  Data?: StatementOutputData;
  ExecutionCount?: number;
  Status?: StatementState;
  ErrorName?: string;
  ErrorValue?: string;
  Traceback?: string[];
}
export const StatementOutput = S.suspend(() =>
  S.Struct({
    Data: S.optional(StatementOutputData),
    ExecutionCount: S.optional(S.Number),
    Status: S.optional(StatementState),
    ErrorName: S.optional(S.String),
    ErrorValue: S.optional(S.String),
    Traceback: S.optional(OrchestrationStringList),
  }),
).annotations({
  identifier: "StatementOutput",
}) as any as S.Schema<StatementOutput>;
export interface Statement {
  Id?: number;
  Code?: string;
  State?: StatementState;
  Output?: StatementOutput;
  Progress?: number;
  StartedOn?: number;
  CompletedOn?: number;
}
export const Statement = S.suspend(() =>
  S.Struct({
    Id: S.optional(S.Number),
    Code: S.optional(S.String),
    State: S.optional(StatementState),
    Output: S.optional(StatementOutput),
    Progress: S.optional(S.Number),
    StartedOn: S.optional(S.Number),
    CompletedOn: S.optional(S.Number),
  }),
).annotations({ identifier: "Statement" }) as any as S.Schema<Statement>;
export type StatementList = Statement[];
export const StatementList = S.Array(Statement);
export interface PropertyPredicate {
  Key?: string;
  Value?: string;
  Comparator?: Comparator;
}
export const PropertyPredicate = S.suspend(() =>
  S.Struct({
    Key: S.optional(S.String),
    Value: S.optional(S.String),
    Comparator: S.optional(Comparator),
  }),
).annotations({
  identifier: "PropertyPredicate",
}) as any as S.Schema<PropertyPredicate>;
export type SearchPropertyPredicates = PropertyPredicate[];
export const SearchPropertyPredicates = S.Array(PropertyPredicate);
export interface SortCriterion {
  FieldName?: string;
  Sort?: Sort;
}
export const SortCriterion = S.suspend(() =>
  S.Struct({ FieldName: S.optional(S.String), Sort: S.optional(Sort) }),
).annotations({
  identifier: "SortCriterion",
}) as any as S.Schema<SortCriterion>;
export type SortCriteria = SortCriterion[];
export const SortCriteria = S.Array(SortCriterion);
export interface DataQualityEvaluationRunAdditionalRunOptions {
  CloudWatchMetricsEnabled?: boolean;
  ResultsS3Prefix?: string;
  CompositeRuleEvaluationMethod?: DQCompositeRuleEvaluationMethod;
}
export const DataQualityEvaluationRunAdditionalRunOptions = S.suspend(() =>
  S.Struct({
    CloudWatchMetricsEnabled: S.optional(S.Boolean),
    ResultsS3Prefix: S.optional(S.String),
    CompositeRuleEvaluationMethod: S.optional(DQCompositeRuleEvaluationMethod),
  }),
).annotations({
  identifier: "DataQualityEvaluationRunAdditionalRunOptions",
}) as any as S.Schema<DataQualityEvaluationRunAdditionalRunOptions>;
export type DataSourceMap = { [key: string]: DataSource | undefined };
export const DataSourceMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(DataSource),
});
export interface TestConnectionInput {
  ConnectionType: ConnectionType;
  ConnectionProperties: { [key: string]: string | undefined };
  AuthenticationConfiguration?: AuthenticationConfigurationInput;
}
export const TestConnectionInput = S.suspend(() =>
  S.Struct({
    ConnectionType: ConnectionType,
    ConnectionProperties: ConnectionProperties,
    AuthenticationConfiguration: S.optional(AuthenticationConfigurationInput),
  }),
).annotations({
  identifier: "TestConnectionInput",
}) as any as S.Schema<TestConnectionInput>;
export interface UpdateGrokClassifierRequest {
  Name: string;
  Classification?: string;
  GrokPattern?: string;
  CustomPatterns?: string;
}
export const UpdateGrokClassifierRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Classification: S.optional(S.String),
    GrokPattern: S.optional(S.String),
    CustomPatterns: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateGrokClassifierRequest",
}) as any as S.Schema<UpdateGrokClassifierRequest>;
export interface UpdateXMLClassifierRequest {
  Name: string;
  Classification?: string;
  RowTag?: string;
}
export const UpdateXMLClassifierRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Classification: S.optional(S.String),
    RowTag: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateXMLClassifierRequest",
}) as any as S.Schema<UpdateXMLClassifierRequest>;
export interface UpdateJsonClassifierRequest {
  Name: string;
  JsonPath?: string;
}
export const UpdateJsonClassifierRequest = S.suspend(() =>
  S.Struct({ Name: S.String, JsonPath: S.optional(S.String) }),
).annotations({
  identifier: "UpdateJsonClassifierRequest",
}) as any as S.Schema<UpdateJsonClassifierRequest>;
export interface UpdateCsvClassifierRequest {
  Name: string;
  Delimiter?: string;
  QuoteSymbol?: string;
  ContainsHeader?: CsvHeaderOption;
  Header?: string[];
  DisableValueTrimming?: boolean;
  AllowSingleColumn?: boolean;
  CustomDatatypeConfigured?: boolean;
  CustomDatatypes?: string[];
  Serde?: CsvSerdeOption;
}
export const UpdateCsvClassifierRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Delimiter: S.optional(S.String),
    QuoteSymbol: S.optional(S.String),
    ContainsHeader: S.optional(CsvHeaderOption),
    Header: S.optional(CsvHeader),
    DisableValueTrimming: S.optional(S.Boolean),
    AllowSingleColumn: S.optional(S.Boolean),
    CustomDatatypeConfigured: S.optional(S.Boolean),
    CustomDatatypes: S.optional(CustomDatatypes),
    Serde: S.optional(CsvSerdeOption),
  }),
).annotations({
  identifier: "UpdateCsvClassifierRequest",
}) as any as S.Schema<UpdateCsvClassifierRequest>;
export interface DevEndpointCustomLibraries {
  ExtraPythonLibsS3Path?: string;
  ExtraJarsS3Path?: string;
}
export const DevEndpointCustomLibraries = S.suspend(() =>
  S.Struct({
    ExtraPythonLibsS3Path: S.optional(S.String),
    ExtraJarsS3Path: S.optional(S.String),
  }),
).annotations({
  identifier: "DevEndpointCustomLibraries",
}) as any as S.Schema<DevEndpointCustomLibraries>;
export interface GlueStudioSchemaColumn {
  Name: string;
  Type?: string;
  GlueStudioType?: string;
}
export const GlueStudioSchemaColumn = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: S.optional(S.String),
    GlueStudioType: S.optional(S.String),
  }),
).annotations({
  identifier: "GlueStudioSchemaColumn",
}) as any as S.Schema<GlueStudioSchemaColumn>;
export type GlueStudioSchemaColumnList = GlueStudioSchemaColumn[];
export const GlueStudioSchemaColumnList = S.Array(GlueStudioSchemaColumn);
export interface GlueSchema {
  Columns?: GlueStudioSchemaColumn[];
}
export const GlueSchema = S.suspend(() =>
  S.Struct({ Columns: S.optional(GlueStudioSchemaColumnList) }),
).annotations({ identifier: "GlueSchema" }) as any as S.Schema<GlueSchema>;
export type GlueSchemas = GlueSchema[];
export const GlueSchemas = S.Array(GlueSchema);
export interface AthenaConnectorSource {
  Name: string;
  ConnectionName: string;
  ConnectorName: string;
  ConnectionType: string;
  ConnectionTable?: string;
  SchemaName: string;
  OutputSchemas?: GlueSchema[];
}
export const AthenaConnectorSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ConnectionName: S.String,
    ConnectorName: S.String,
    ConnectionType: S.String,
    ConnectionTable: S.optional(S.String),
    SchemaName: S.String,
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "AthenaConnectorSource",
}) as any as S.Schema<AthenaConnectorSource>;
export type EnclosedInStringProperties = string[];
export const EnclosedInStringProperties = S.Array(S.String);
export type JDBCDataType =
  | "ARRAY"
  | "BIGINT"
  | "BINARY"
  | "BIT"
  | "BLOB"
  | "BOOLEAN"
  | "CHAR"
  | "CLOB"
  | "DATALINK"
  | "DATE"
  | "DECIMAL"
  | "DISTINCT"
  | "DOUBLE"
  | "FLOAT"
  | "INTEGER"
  | "JAVA_OBJECT"
  | "LONGNVARCHAR"
  | "LONGVARBINARY"
  | "LONGVARCHAR"
  | "NCHAR"
  | "NCLOB"
  | "NULL"
  | "NUMERIC"
  | "NVARCHAR"
  | "OTHER"
  | "REAL"
  | "REF"
  | "REF_CURSOR"
  | "ROWID"
  | "SMALLINT"
  | "SQLXML"
  | "STRUCT"
  | "TIME"
  | "TIME_WITH_TIMEZONE"
  | "TIMESTAMP"
  | "TIMESTAMP_WITH_TIMEZONE"
  | "TINYINT"
  | "VARBINARY"
  | "VARCHAR"
  | (string & {});
export const JDBCDataType = S.String;
export type GlueRecordType =
  | "DATE"
  | "STRING"
  | "TIMESTAMP"
  | "INT"
  | "FLOAT"
  | "LONG"
  | "BIGDECIMAL"
  | "BYTE"
  | "SHORT"
  | "DOUBLE"
  | (string & {});
export const GlueRecordType = S.String;
export type JDBCDataTypeMapping = { [key in JDBCDataType]?: GlueRecordType };
export const JDBCDataTypeMapping = S.partial(
  S.Record({ key: JDBCDataType, value: S.UndefinedOr(GlueRecordType) }),
);
export interface JDBCConnectorOptions {
  FilterPredicate?: string;
  PartitionColumn?: string;
  LowerBound?: number;
  UpperBound?: number;
  NumPartitions?: number;
  JobBookmarkKeys?: string[];
  JobBookmarkKeysSortOrder?: string;
  DataTypeMapping?: { [key: string]: GlueRecordType | undefined };
}
export const JDBCConnectorOptions = S.suspend(() =>
  S.Struct({
    FilterPredicate: S.optional(S.String),
    PartitionColumn: S.optional(S.String),
    LowerBound: S.optional(S.Number),
    UpperBound: S.optional(S.Number),
    NumPartitions: S.optional(S.Number),
    JobBookmarkKeys: S.optional(EnclosedInStringProperties),
    JobBookmarkKeysSortOrder: S.optional(S.String),
    DataTypeMapping: S.optional(JDBCDataTypeMapping),
  }),
).annotations({
  identifier: "JDBCConnectorOptions",
}) as any as S.Schema<JDBCConnectorOptions>;
export interface JDBCConnectorSource {
  Name: string;
  ConnectionName: string;
  ConnectorName: string;
  ConnectionType: string;
  AdditionalOptions?: JDBCConnectorOptions;
  ConnectionTable?: string;
  Query?: string;
  OutputSchemas?: GlueSchema[];
}
export const JDBCConnectorSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ConnectionName: S.String,
    ConnectorName: S.String,
    ConnectionType: S.String,
    AdditionalOptions: S.optional(JDBCConnectorOptions),
    ConnectionTable: S.optional(S.String),
    Query: S.optional(S.String),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "JDBCConnectorSource",
}) as any as S.Schema<JDBCConnectorSource>;
export type AdditionalOptions = { [key: string]: string | undefined };
export const AdditionalOptions = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface SparkConnectorSource {
  Name: string;
  ConnectionName: string;
  ConnectorName: string;
  ConnectionType: string;
  AdditionalOptions?: { [key: string]: string | undefined };
  OutputSchemas?: GlueSchema[];
}
export const SparkConnectorSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ConnectionName: S.String,
    ConnectorName: S.String,
    ConnectionType: S.String,
    AdditionalOptions: S.optional(AdditionalOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "SparkConnectorSource",
}) as any as S.Schema<SparkConnectorSource>;
export interface CatalogSource {
  Name: string;
  Database: string;
  Table: string;
  PartitionPredicate?: string;
  OutputSchemas?: GlueSchema[];
}
export const CatalogSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Database: S.String,
    Table: S.String,
    PartitionPredicate: S.optional(S.String),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "CatalogSource",
}) as any as S.Schema<CatalogSource>;
export interface RedshiftSource {
  Name: string;
  Database: string;
  Table: string;
  RedshiftTmpDir?: string;
  TmpDirIAMRole?: string;
}
export const RedshiftSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Database: S.String,
    Table: S.String,
    RedshiftTmpDir: S.optional(S.String),
    TmpDirIAMRole: S.optional(S.String),
  }),
).annotations({
  identifier: "RedshiftSource",
}) as any as S.Schema<RedshiftSource>;
export interface S3SourceAdditionalOptions {
  BoundedSize?: number;
  BoundedFiles?: number;
}
export const S3SourceAdditionalOptions = S.suspend(() =>
  S.Struct({
    BoundedSize: S.optional(S.Number),
    BoundedFiles: S.optional(S.Number),
  }),
).annotations({
  identifier: "S3SourceAdditionalOptions",
}) as any as S.Schema<S3SourceAdditionalOptions>;
export interface S3CatalogSource {
  Name: string;
  Database: string;
  Table: string;
  PartitionPredicate?: string;
  AdditionalOptions?: S3SourceAdditionalOptions;
}
export const S3CatalogSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Database: S.String,
    Table: S.String,
    PartitionPredicate: S.optional(S.String),
    AdditionalOptions: S.optional(S3SourceAdditionalOptions),
  }),
).annotations({
  identifier: "S3CatalogSource",
}) as any as S.Schema<S3CatalogSource>;
export type CompressionType = "gzip" | "bzip2" | (string & {});
export const CompressionType = S.String;
export interface S3DirectSourceAdditionalOptions {
  BoundedSize?: number;
  BoundedFiles?: number;
  EnableSamplePath?: boolean;
  SamplePath?: string;
}
export const S3DirectSourceAdditionalOptions = S.suspend(() =>
  S.Struct({
    BoundedSize: S.optional(S.Number),
    BoundedFiles: S.optional(S.Number),
    EnableSamplePath: S.optional(S.Boolean),
    SamplePath: S.optional(S.String),
  }),
).annotations({
  identifier: "S3DirectSourceAdditionalOptions",
}) as any as S.Schema<S3DirectSourceAdditionalOptions>;
export type Separator =
  | "comma"
  | "ctrla"
  | "pipe"
  | "semicolon"
  | "tab"
  | (string & {});
export const Separator = S.String;
export type QuoteChar =
  | "quote"
  | "quillemet"
  | "single_quote"
  | "disabled"
  | (string & {});
export const QuoteChar = S.String;
export interface S3CsvSource {
  Name: string;
  Paths: string[];
  CompressionType?: CompressionType;
  Exclusions?: string[];
  GroupSize?: string;
  GroupFiles?: string;
  Recurse?: boolean;
  MaxBand?: number;
  MaxFilesInBand?: number;
  AdditionalOptions?: S3DirectSourceAdditionalOptions;
  Separator: Separator;
  Escaper?: string;
  QuoteChar: QuoteChar;
  Multiline?: boolean;
  WithHeader?: boolean;
  WriteHeader?: boolean;
  SkipFirst?: boolean;
  OptimizePerformance?: boolean;
  OutputSchemas?: GlueSchema[];
}
export const S3CsvSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Paths: EnclosedInStringProperties,
    CompressionType: S.optional(CompressionType),
    Exclusions: S.optional(EnclosedInStringProperties),
    GroupSize: S.optional(S.String),
    GroupFiles: S.optional(S.String),
    Recurse: S.optional(S.Boolean),
    MaxBand: S.optional(S.Number),
    MaxFilesInBand: S.optional(S.Number),
    AdditionalOptions: S.optional(S3DirectSourceAdditionalOptions),
    Separator: Separator,
    Escaper: S.optional(S.String),
    QuoteChar: QuoteChar,
    Multiline: S.optional(S.Boolean),
    WithHeader: S.optional(S.Boolean),
    WriteHeader: S.optional(S.Boolean),
    SkipFirst: S.optional(S.Boolean),
    OptimizePerformance: S.optional(S.Boolean),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({ identifier: "S3CsvSource" }) as any as S.Schema<S3CsvSource>;
export interface S3JsonSource {
  Name: string;
  Paths: string[];
  CompressionType?: CompressionType;
  Exclusions?: string[];
  GroupSize?: string;
  GroupFiles?: string;
  Recurse?: boolean;
  MaxBand?: number;
  MaxFilesInBand?: number;
  AdditionalOptions?: S3DirectSourceAdditionalOptions;
  JsonPath?: string;
  Multiline?: boolean;
  OutputSchemas?: GlueSchema[];
}
export const S3JsonSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Paths: EnclosedInStringProperties,
    CompressionType: S.optional(CompressionType),
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
  }),
).annotations({ identifier: "S3JsonSource" }) as any as S.Schema<S3JsonSource>;
export type ParquetCompressionType =
  | "snappy"
  | "lzo"
  | "gzip"
  | "brotli"
  | "lz4"
  | "uncompressed"
  | "none"
  | (string & {});
export const ParquetCompressionType = S.String;
export interface S3ParquetSource {
  Name: string;
  Paths: string[];
  CompressionType?: ParquetCompressionType;
  Exclusions?: string[];
  GroupSize?: string;
  GroupFiles?: string;
  Recurse?: boolean;
  MaxBand?: number;
  MaxFilesInBand?: number;
  AdditionalOptions?: S3DirectSourceAdditionalOptions;
  OutputSchemas?: GlueSchema[];
}
export const S3ParquetSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Paths: EnclosedInStringProperties,
    CompressionType: S.optional(ParquetCompressionType),
    Exclusions: S.optional(EnclosedInStringProperties),
    GroupSize: S.optional(S.String),
    GroupFiles: S.optional(S.String),
    Recurse: S.optional(S.Boolean),
    MaxBand: S.optional(S.Number),
    MaxFilesInBand: S.optional(S.Number),
    AdditionalOptions: S.optional(S3DirectSourceAdditionalOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "S3ParquetSource",
}) as any as S.Schema<S3ParquetSource>;
export interface RelationalCatalogSource {
  Name: string;
  Database: string;
  Table: string;
}
export const RelationalCatalogSource = S.suspend(() =>
  S.Struct({ Name: S.String, Database: S.String, Table: S.String }),
).annotations({
  identifier: "RelationalCatalogSource",
}) as any as S.Schema<RelationalCatalogSource>;
export interface DDBELTCatalogAdditionalOptions {
  DynamodbExport?: string;
  DynamodbUnnestDDBJson?: boolean;
}
export const DDBELTCatalogAdditionalOptions = S.suspend(() =>
  S.Struct({
    DynamodbExport: S.optional(S.String),
    DynamodbUnnestDDBJson: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DDBELTCatalogAdditionalOptions",
}) as any as S.Schema<DDBELTCatalogAdditionalOptions>;
export interface DynamoDBCatalogSource {
  Name: string;
  Database: string;
  Table: string;
  PitrEnabled?: boolean;
  AdditionalOptions?: DDBELTCatalogAdditionalOptions;
}
export const DynamoDBCatalogSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Database: S.String,
    Table: S.String,
    PitrEnabled: S.optional(S.Boolean),
    AdditionalOptions: S.optional(DDBELTCatalogAdditionalOptions),
  }),
).annotations({
  identifier: "DynamoDBCatalogSource",
}) as any as S.Schema<DynamoDBCatalogSource>;
export type OneInput = string[];
export const OneInput = S.Array(S.String);
export interface JDBCConnectorTarget {
  Name: string;
  Inputs: string[];
  ConnectionName: string;
  ConnectionTable: string;
  ConnectorName: string;
  ConnectionType: string;
  AdditionalOptions?: { [key: string]: string | undefined };
  OutputSchemas?: GlueSchema[];
}
export const JDBCConnectorTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    ConnectionName: S.String,
    ConnectionTable: S.String,
    ConnectorName: S.String,
    ConnectionType: S.String,
    AdditionalOptions: S.optional(AdditionalOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "JDBCConnectorTarget",
}) as any as S.Schema<JDBCConnectorTarget>;
export interface SparkConnectorTarget {
  Name: string;
  Inputs: string[];
  ConnectionName: string;
  ConnectorName: string;
  ConnectionType: string;
  AdditionalOptions?: { [key: string]: string | undefined };
  OutputSchemas?: GlueSchema[];
}
export const SparkConnectorTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    ConnectionName: S.String,
    ConnectorName: S.String,
    ConnectionType: S.String,
    AdditionalOptions: S.optional(AdditionalOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "SparkConnectorTarget",
}) as any as S.Schema<SparkConnectorTarget>;
export type GlueStudioPathList = string[][];
export const GlueStudioPathList = S.Array(EnclosedInStringProperties);
export interface BasicCatalogTarget {
  Name: string;
  Inputs: string[];
  PartitionKeys?: string[][];
  Database: string;
  Table: string;
}
export const BasicCatalogTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    PartitionKeys: S.optional(GlueStudioPathList),
    Database: S.String,
    Table: S.String,
  }),
).annotations({
  identifier: "BasicCatalogTarget",
}) as any as S.Schema<BasicCatalogTarget>;
export type EnclosedInStringPropertiesMinOne = string[];
export const EnclosedInStringPropertiesMinOne = S.Array(S.String);
export interface UpsertRedshiftTargetOptions {
  TableLocation?: string;
  ConnectionName?: string;
  UpsertKeys?: string[];
}
export const UpsertRedshiftTargetOptions = S.suspend(() =>
  S.Struct({
    TableLocation: S.optional(S.String),
    ConnectionName: S.optional(S.String),
    UpsertKeys: S.optional(EnclosedInStringPropertiesMinOne),
  }),
).annotations({
  identifier: "UpsertRedshiftTargetOptions",
}) as any as S.Schema<UpsertRedshiftTargetOptions>;
export interface RedshiftTarget {
  Name: string;
  Inputs: string[];
  Database: string;
  Table: string;
  RedshiftTmpDir?: string;
  TmpDirIAMRole?: string;
  UpsertRedshiftOptions?: UpsertRedshiftTargetOptions;
}
export const RedshiftTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    Database: S.String,
    Table: S.String,
    RedshiftTmpDir: S.optional(S.String),
    TmpDirIAMRole: S.optional(S.String),
    UpsertRedshiftOptions: S.optional(UpsertRedshiftTargetOptions),
  }),
).annotations({
  identifier: "RedshiftTarget",
}) as any as S.Schema<RedshiftTarget>;
export type UpdateCatalogBehavior =
  | "UPDATE_IN_DATABASE"
  | "LOG"
  | (string & {});
export const UpdateCatalogBehavior = S.String;
export interface CatalogSchemaChangePolicy {
  EnableUpdateCatalog?: boolean;
  UpdateBehavior?: UpdateCatalogBehavior;
}
export const CatalogSchemaChangePolicy = S.suspend(() =>
  S.Struct({
    EnableUpdateCatalog: S.optional(S.Boolean),
    UpdateBehavior: S.optional(UpdateCatalogBehavior),
  }),
).annotations({
  identifier: "CatalogSchemaChangePolicy",
}) as any as S.Schema<CatalogSchemaChangePolicy>;
export interface AutoDataQuality {
  IsEnabled?: boolean;
  EvaluationContext?: string;
}
export const AutoDataQuality = S.suspend(() =>
  S.Struct({
    IsEnabled: S.optional(S.Boolean),
    EvaluationContext: S.optional(S.String),
  }),
).annotations({
  identifier: "AutoDataQuality",
}) as any as S.Schema<AutoDataQuality>;
export interface S3CatalogTarget {
  Name: string;
  Inputs: string[];
  PartitionKeys?: string[][];
  Table: string;
  Database: string;
  SchemaChangePolicy?: CatalogSchemaChangePolicy;
  AutoDataQuality?: AutoDataQuality;
}
export const S3CatalogTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    PartitionKeys: S.optional(GlueStudioPathList),
    Table: S.String,
    Database: S.String,
    SchemaChangePolicy: S.optional(CatalogSchemaChangePolicy),
    AutoDataQuality: S.optional(AutoDataQuality),
  }),
).annotations({
  identifier: "S3CatalogTarget",
}) as any as S.Schema<S3CatalogTarget>;
export interface DirectSchemaChangePolicy {
  EnableUpdateCatalog?: boolean;
  UpdateBehavior?: UpdateCatalogBehavior;
  Table?: string;
  Database?: string;
}
export const DirectSchemaChangePolicy = S.suspend(() =>
  S.Struct({
    EnableUpdateCatalog: S.optional(S.Boolean),
    UpdateBehavior: S.optional(UpdateCatalogBehavior),
    Table: S.optional(S.String),
    Database: S.optional(S.String),
  }),
).annotations({
  identifier: "DirectSchemaChangePolicy",
}) as any as S.Schema<DirectSchemaChangePolicy>;
export interface S3GlueParquetTarget {
  Name: string;
  Inputs: string[];
  PartitionKeys?: string[][];
  Path: string;
  Compression?: ParquetCompressionType;
  NumberTargetPartitions?: string;
  SchemaChangePolicy?: DirectSchemaChangePolicy;
  AutoDataQuality?: AutoDataQuality;
}
export const S3GlueParquetTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    PartitionKeys: S.optional(GlueStudioPathList),
    Path: S.String,
    Compression: S.optional(ParquetCompressionType),
    NumberTargetPartitions: S.optional(S.String),
    SchemaChangePolicy: S.optional(DirectSchemaChangePolicy),
    AutoDataQuality: S.optional(AutoDataQuality),
  }),
).annotations({
  identifier: "S3GlueParquetTarget",
}) as any as S.Schema<S3GlueParquetTarget>;
export type TargetFormat =
  | "json"
  | "csv"
  | "avro"
  | "orc"
  | "parquet"
  | "hudi"
  | "delta"
  | "iceberg"
  | "hyper"
  | "xml"
  | (string & {});
export const TargetFormat = S.String;
export interface S3DirectTarget {
  Name: string;
  Inputs: string[];
  PartitionKeys?: string[][];
  Path: string;
  Compression?: string;
  NumberTargetPartitions?: string;
  Format: TargetFormat;
  SchemaChangePolicy?: DirectSchemaChangePolicy;
  AutoDataQuality?: AutoDataQuality;
  OutputSchemas?: GlueSchema[];
}
export const S3DirectTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    PartitionKeys: S.optional(GlueStudioPathList),
    Path: S.String,
    Compression: S.optional(S.String),
    NumberTargetPartitions: S.optional(S.String),
    Format: TargetFormat,
    SchemaChangePolicy: S.optional(DirectSchemaChangePolicy),
    AutoDataQuality: S.optional(AutoDataQuality),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "S3DirectTarget",
}) as any as S.Schema<S3DirectTarget>;
export type Mappings = Mapping[];
export const Mappings = S.Array(
  S.suspend((): S.Schema<Mapping, any> => Mapping).annotations({
    identifier: "Mapping",
  }),
) as any as S.Schema<Mappings>;
export interface ApplyMapping {
  Name: string;
  Inputs: string[];
  Mapping: Mapping[];
}
export const ApplyMapping = S.suspend(() =>
  S.Struct({ Name: S.String, Inputs: OneInput, Mapping: Mappings }),
).annotations({ identifier: "ApplyMapping" }) as any as S.Schema<ApplyMapping>;
export interface SelectFields {
  Name: string;
  Inputs: string[];
  Paths: string[][];
}
export const SelectFields = S.suspend(() =>
  S.Struct({ Name: S.String, Inputs: OneInput, Paths: GlueStudioPathList }),
).annotations({ identifier: "SelectFields" }) as any as S.Schema<SelectFields>;
export interface DropFields {
  Name: string;
  Inputs: string[];
  Paths: string[][];
}
export const DropFields = S.suspend(() =>
  S.Struct({ Name: S.String, Inputs: OneInput, Paths: GlueStudioPathList }),
).annotations({ identifier: "DropFields" }) as any as S.Schema<DropFields>;
export interface RenameField {
  Name: string;
  Inputs: string[];
  SourcePath: string[];
  TargetPath: string[];
}
export const RenameField = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    SourcePath: EnclosedInStringProperties,
    TargetPath: EnclosedInStringProperties,
  }),
).annotations({ identifier: "RenameField" }) as any as S.Schema<RenameField>;
export interface Spigot {
  Name: string;
  Inputs: string[];
  Path: string;
  Topk?: number;
  Prob?: number;
}
export const Spigot = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    Path: S.String,
    Topk: S.optional(S.Number),
    Prob: S.optional(S.Number),
  }),
).annotations({ identifier: "Spigot" }) as any as S.Schema<Spigot>;
export type TwoInputs = string[];
export const TwoInputs = S.Array(S.String);
export type JoinType =
  | "equijoin"
  | "left"
  | "right"
  | "outer"
  | "leftsemi"
  | "leftanti"
  | (string & {});
export const JoinType = S.String;
export interface JoinColumn {
  From: string;
  Keys: string[][];
}
export const JoinColumn = S.suspend(() =>
  S.Struct({ From: S.String, Keys: GlueStudioPathList }),
).annotations({ identifier: "JoinColumn" }) as any as S.Schema<JoinColumn>;
export type JoinColumns = JoinColumn[];
export const JoinColumns = S.Array(JoinColumn);
export interface Join {
  Name: string;
  Inputs: string[];
  JoinType: JoinType;
  Columns: JoinColumn[];
}
export const Join = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: TwoInputs,
    JoinType: JoinType,
    Columns: JoinColumns,
  }),
).annotations({ identifier: "Join" }) as any as S.Schema<Join>;
export interface SplitFields {
  Name: string;
  Inputs: string[];
  Paths: string[][];
}
export const SplitFields = S.suspend(() =>
  S.Struct({ Name: S.String, Inputs: OneInput, Paths: GlueStudioPathList }),
).annotations({ identifier: "SplitFields" }) as any as S.Schema<SplitFields>;
export interface SelectFromCollection {
  Name: string;
  Inputs: string[];
  Index: number;
}
export const SelectFromCollection = S.suspend(() =>
  S.Struct({ Name: S.String, Inputs: OneInput, Index: S.Number }),
).annotations({
  identifier: "SelectFromCollection",
}) as any as S.Schema<SelectFromCollection>;
export interface FillMissingValues {
  Name: string;
  Inputs: string[];
  ImputedPath: string;
  FilledPath?: string;
}
export const FillMissingValues = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    ImputedPath: S.String,
    FilledPath: S.optional(S.String),
  }),
).annotations({
  identifier: "FillMissingValues",
}) as any as S.Schema<FillMissingValues>;
export type FilterLogicalOperator = "AND" | "OR" | (string & {});
export const FilterLogicalOperator = S.String;
export type FilterOperation =
  | "EQ"
  | "LT"
  | "GT"
  | "LTE"
  | "GTE"
  | "REGEX"
  | "ISNULL"
  | (string & {});
export const FilterOperation = S.String;
export type FilterValueType = "COLUMNEXTRACTED" | "CONSTANT" | (string & {});
export const FilterValueType = S.String;
export interface FilterValue {
  Type: FilterValueType;
  Value: string[];
}
export const FilterValue = S.suspend(() =>
  S.Struct({ Type: FilterValueType, Value: EnclosedInStringProperties }),
).annotations({ identifier: "FilterValue" }) as any as S.Schema<FilterValue>;
export type FilterValues = FilterValue[];
export const FilterValues = S.Array(FilterValue);
export interface FilterExpression {
  Operation: FilterOperation;
  Negated?: boolean;
  Values: FilterValue[];
}
export const FilterExpression = S.suspend(() =>
  S.Struct({
    Operation: FilterOperation,
    Negated: S.optional(S.Boolean),
    Values: FilterValues,
  }),
).annotations({
  identifier: "FilterExpression",
}) as any as S.Schema<FilterExpression>;
export type FilterExpressions = FilterExpression[];
export const FilterExpressions = S.Array(FilterExpression);
export interface Filter {
  Name: string;
  Inputs: string[];
  LogicalOperator: FilterLogicalOperator;
  Filters: FilterExpression[];
}
export const Filter = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    LogicalOperator: FilterLogicalOperator,
    Filters: FilterExpressions,
  }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type ManyInputs = string[];
export const ManyInputs = S.Array(S.String);
export interface CustomCode {
  Name: string;
  Inputs: string[];
  Code: string;
  ClassName: string;
  OutputSchemas?: GlueSchema[];
}
export const CustomCode = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: ManyInputs,
    Code: S.String,
    ClassName: S.String,
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({ identifier: "CustomCode" }) as any as S.Schema<CustomCode>;
export interface SqlAlias {
  From: string;
  Alias: string;
}
export const SqlAlias = S.suspend(() =>
  S.Struct({ From: S.String, Alias: S.String }),
).annotations({ identifier: "SqlAlias" }) as any as S.Schema<SqlAlias>;
export type SqlAliases = SqlAlias[];
export const SqlAliases = S.Array(SqlAlias);
export interface SparkSQL {
  Name: string;
  Inputs: string[];
  SqlQuery: string;
  SqlAliases: SqlAlias[];
  OutputSchemas?: GlueSchema[];
}
export const SparkSQL = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: ManyInputs,
    SqlQuery: S.String,
    SqlAliases: SqlAliases,
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({ identifier: "SparkSQL" }) as any as S.Schema<SparkSQL>;
export type StartingPosition =
  | "latest"
  | "trim_horizon"
  | "earliest"
  | "timestamp"
  | (string & {});
export const StartingPosition = S.String;
export interface KinesisStreamingSourceOptions {
  EndpointUrl?: string;
  StreamName?: string;
  Classification?: string;
  Delimiter?: string;
  StartingPosition?: StartingPosition;
  MaxFetchTimeInMs?: number;
  MaxFetchRecordsPerShard?: number;
  MaxRecordPerRead?: number;
  AddIdleTimeBetweenReads?: boolean;
  IdleTimeBetweenReadsInMs?: number;
  DescribeShardInterval?: number;
  NumRetries?: number;
  RetryIntervalMs?: number;
  MaxRetryIntervalMs?: number;
  AvoidEmptyBatches?: boolean;
  StreamArn?: string;
  RoleArn?: string;
  RoleSessionName?: string;
  AddRecordTimestamp?: string;
  EmitConsumerLagMetrics?: string;
  StartingTimestamp?: Date;
  FanoutConsumerARN?: string;
}
export const KinesisStreamingSourceOptions = S.suspend(() =>
  S.Struct({
    EndpointUrl: S.optional(S.String),
    StreamName: S.optional(S.String),
    Classification: S.optional(S.String),
    Delimiter: S.optional(S.String),
    StartingPosition: S.optional(StartingPosition),
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
  }),
).annotations({
  identifier: "KinesisStreamingSourceOptions",
}) as any as S.Schema<KinesisStreamingSourceOptions>;
export interface StreamingDataPreviewOptions {
  PollingTime?: number;
  RecordPollingLimit?: number;
}
export const StreamingDataPreviewOptions = S.suspend(() =>
  S.Struct({
    PollingTime: S.optional(S.Number),
    RecordPollingLimit: S.optional(S.Number),
  }),
).annotations({
  identifier: "StreamingDataPreviewOptions",
}) as any as S.Schema<StreamingDataPreviewOptions>;
export interface DirectKinesisSource {
  Name: string;
  WindowSize?: number;
  DetectSchema?: boolean;
  StreamingOptions?: KinesisStreamingSourceOptions;
  DataPreviewOptions?: StreamingDataPreviewOptions;
}
export const DirectKinesisSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    WindowSize: S.optional(S.Number),
    DetectSchema: S.optional(S.Boolean),
    StreamingOptions: S.optional(KinesisStreamingSourceOptions),
    DataPreviewOptions: S.optional(StreamingDataPreviewOptions),
  }),
).annotations({
  identifier: "DirectKinesisSource",
}) as any as S.Schema<DirectKinesisSource>;
export interface KafkaStreamingSourceOptions {
  BootstrapServers?: string;
  SecurityProtocol?: string;
  ConnectionName?: string;
  TopicName?: string;
  Assign?: string;
  SubscribePattern?: string;
  Classification?: string;
  Delimiter?: string;
  StartingOffsets?: string;
  EndingOffsets?: string;
  PollTimeoutMs?: number;
  NumRetries?: number;
  RetryIntervalMs?: number;
  MaxOffsetsPerTrigger?: number;
  MinPartitions?: number;
  IncludeHeaders?: boolean;
  AddRecordTimestamp?: string;
  EmitConsumerLagMetrics?: string;
  StartingTimestamp?: Date;
}
export const KafkaStreamingSourceOptions = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "KafkaStreamingSourceOptions",
}) as any as S.Schema<KafkaStreamingSourceOptions>;
export interface DirectKafkaSource {
  Name: string;
  StreamingOptions?: KafkaStreamingSourceOptions;
  WindowSize?: number;
  DetectSchema?: boolean;
  DataPreviewOptions?: StreamingDataPreviewOptions;
}
export const DirectKafkaSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    StreamingOptions: S.optional(KafkaStreamingSourceOptions),
    WindowSize: S.optional(S.Number),
    DetectSchema: S.optional(S.Boolean),
    DataPreviewOptions: S.optional(StreamingDataPreviewOptions),
  }),
).annotations({
  identifier: "DirectKafkaSource",
}) as any as S.Schema<DirectKafkaSource>;
export interface CatalogKinesisSource {
  Name: string;
  WindowSize?: number;
  DetectSchema?: boolean;
  Table: string;
  Database: string;
  StreamingOptions?: KinesisStreamingSourceOptions;
  DataPreviewOptions?: StreamingDataPreviewOptions;
}
export const CatalogKinesisSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    WindowSize: S.optional(S.Number),
    DetectSchema: S.optional(S.Boolean),
    Table: S.String,
    Database: S.String,
    StreamingOptions: S.optional(KinesisStreamingSourceOptions),
    DataPreviewOptions: S.optional(StreamingDataPreviewOptions),
  }),
).annotations({
  identifier: "CatalogKinesisSource",
}) as any as S.Schema<CatalogKinesisSource>;
export interface CatalogKafkaSource {
  Name: string;
  WindowSize?: number;
  DetectSchema?: boolean;
  Table: string;
  Database: string;
  StreamingOptions?: KafkaStreamingSourceOptions;
  DataPreviewOptions?: StreamingDataPreviewOptions;
}
export const CatalogKafkaSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    WindowSize: S.optional(S.Number),
    DetectSchema: S.optional(S.Boolean),
    Table: S.String,
    Database: S.String,
    StreamingOptions: S.optional(KafkaStreamingSourceOptions),
    DataPreviewOptions: S.optional(StreamingDataPreviewOptions),
  }),
).annotations({
  identifier: "CatalogKafkaSource",
}) as any as S.Schema<CatalogKafkaSource>;
export interface NullCheckBoxList {
  IsEmpty?: boolean;
  IsNullString?: boolean;
  IsNegOne?: boolean;
}
export const NullCheckBoxList = S.suspend(() =>
  S.Struct({
    IsEmpty: S.optional(S.Boolean),
    IsNullString: S.optional(S.Boolean),
    IsNegOne: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "NullCheckBoxList",
}) as any as S.Schema<NullCheckBoxList>;
export interface Datatype {
  Id: string;
  Label: string;
}
export const Datatype = S.suspend(() =>
  S.Struct({ Id: S.String, Label: S.String }),
).annotations({ identifier: "Datatype" }) as any as S.Schema<Datatype>;
export interface NullValueField {
  Value: string;
  Datatype: Datatype;
}
export const NullValueField = S.suspend(() =>
  S.Struct({ Value: S.String, Datatype: Datatype }),
).annotations({
  identifier: "NullValueField",
}) as any as S.Schema<NullValueField>;
export type NullValueFields = NullValueField[];
export const NullValueFields = S.Array(NullValueField);
export interface DropNullFields {
  Name: string;
  Inputs: string[];
  NullCheckBoxList?: NullCheckBoxList;
  NullTextList?: NullValueField[];
}
export const DropNullFields = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    NullCheckBoxList: S.optional(NullCheckBoxList),
    NullTextList: S.optional(NullValueFields),
  }),
).annotations({
  identifier: "DropNullFields",
}) as any as S.Schema<DropNullFields>;
export interface Merge {
  Name: string;
  Inputs: string[];
  Source: string;
  PrimaryKeys: string[][];
}
export const Merge = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: TwoInputs,
    Source: S.String,
    PrimaryKeys: GlueStudioPathList,
  }),
).annotations({ identifier: "Merge" }) as any as S.Schema<Merge>;
export type UnionType = "ALL" | "DISTINCT" | (string & {});
export const UnionType = S.String;
export interface Union {
  Name: string;
  Inputs: string[];
  UnionType: UnionType;
}
export const Union = S.suspend(() =>
  S.Struct({ Name: S.String, Inputs: TwoInputs, UnionType: UnionType }),
).annotations({ identifier: "Union" }) as any as S.Schema<Union>;
export type PiiType =
  | "RowAudit"
  | "RowHashing"
  | "RowMasking"
  | "RowPartialMasking"
  | "ColumnAudit"
  | "ColumnHashing"
  | "ColumnMasking"
  | (string & {});
export const PiiType = S.String;
export interface PIIDetection {
  Name: string;
  Inputs: string[];
  PiiType: PiiType;
  EntityTypesToDetect: string[];
  OutputColumnName?: string;
  SampleFraction?: number;
  ThresholdFraction?: number;
  MaskValue?: string;
  RedactText?: string;
  RedactChar?: string;
  MatchPattern?: string;
  NumLeftCharsToExclude?: number;
  NumRightCharsToExclude?: number;
  DetectionParameters?: string;
  DetectionSensitivity?: string;
}
export const PIIDetection = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    PiiType: PiiType,
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
  }),
).annotations({ identifier: "PIIDetection" }) as any as S.Schema<PIIDetection>;
export type AggFunction =
  | "avg"
  | "countDistinct"
  | "count"
  | "first"
  | "last"
  | "kurtosis"
  | "max"
  | "min"
  | "skewness"
  | "stddev_samp"
  | "stddev_pop"
  | "sum"
  | "sumDistinct"
  | "var_samp"
  | "var_pop"
  | (string & {});
export const AggFunction = S.String;
export interface AggregateOperation {
  Column: string[];
  AggFunc: AggFunction;
}
export const AggregateOperation = S.suspend(() =>
  S.Struct({ Column: EnclosedInStringProperties, AggFunc: AggFunction }),
).annotations({
  identifier: "AggregateOperation",
}) as any as S.Schema<AggregateOperation>;
export type AggregateOperations = AggregateOperation[];
export const AggregateOperations = S.Array(AggregateOperation);
export interface Aggregate {
  Name: string;
  Inputs: string[];
  Groups: string[][];
  Aggs: AggregateOperation[];
}
export const Aggregate = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    Groups: GlueStudioPathList,
    Aggs: AggregateOperations,
  }),
).annotations({ identifier: "Aggregate" }) as any as S.Schema<Aggregate>;
export type LimitedStringList = string[];
export const LimitedStringList = S.Array(S.String);
export type LimitedPathList = string[][];
export const LimitedPathList = S.Array(LimitedStringList);
export interface DropDuplicates {
  Name: string;
  Inputs: string[];
  Columns?: string[][];
}
export const DropDuplicates = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    Columns: S.optional(LimitedPathList),
  }),
).annotations({
  identifier: "DropDuplicates",
}) as any as S.Schema<DropDuplicates>;
export interface GovernedCatalogTarget {
  Name: string;
  Inputs: string[];
  PartitionKeys?: string[][];
  Table: string;
  Database: string;
  SchemaChangePolicy?: CatalogSchemaChangePolicy;
}
export const GovernedCatalogTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    PartitionKeys: S.optional(GlueStudioPathList),
    Table: S.String,
    Database: S.String,
    SchemaChangePolicy: S.optional(CatalogSchemaChangePolicy),
  }),
).annotations({
  identifier: "GovernedCatalogTarget",
}) as any as S.Schema<GovernedCatalogTarget>;
export interface GovernedCatalogSource {
  Name: string;
  Database: string;
  Table: string;
  PartitionPredicate?: string;
  AdditionalOptions?: S3SourceAdditionalOptions;
}
export const GovernedCatalogSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Database: S.String,
    Table: S.String,
    PartitionPredicate: S.optional(S.String),
    AdditionalOptions: S.optional(S3SourceAdditionalOptions),
  }),
).annotations({
  identifier: "GovernedCatalogSource",
}) as any as S.Schema<GovernedCatalogSource>;
export interface MicrosoftSQLServerCatalogSource {
  Name: string;
  Database: string;
  Table: string;
}
export const MicrosoftSQLServerCatalogSource = S.suspend(() =>
  S.Struct({ Name: S.String, Database: S.String, Table: S.String }),
).annotations({
  identifier: "MicrosoftSQLServerCatalogSource",
}) as any as S.Schema<MicrosoftSQLServerCatalogSource>;
export interface MySQLCatalogSource {
  Name: string;
  Database: string;
  Table: string;
}
export const MySQLCatalogSource = S.suspend(() =>
  S.Struct({ Name: S.String, Database: S.String, Table: S.String }),
).annotations({
  identifier: "MySQLCatalogSource",
}) as any as S.Schema<MySQLCatalogSource>;
export interface OracleSQLCatalogSource {
  Name: string;
  Database: string;
  Table: string;
}
export const OracleSQLCatalogSource = S.suspend(() =>
  S.Struct({ Name: S.String, Database: S.String, Table: S.String }),
).annotations({
  identifier: "OracleSQLCatalogSource",
}) as any as S.Schema<OracleSQLCatalogSource>;
export interface PostgreSQLCatalogSource {
  Name: string;
  Database: string;
  Table: string;
}
export const PostgreSQLCatalogSource = S.suspend(() =>
  S.Struct({ Name: S.String, Database: S.String, Table: S.String }),
).annotations({
  identifier: "PostgreSQLCatalogSource",
}) as any as S.Schema<PostgreSQLCatalogSource>;
export interface MicrosoftSQLServerCatalogTarget {
  Name: string;
  Inputs: string[];
  Database: string;
  Table: string;
}
export const MicrosoftSQLServerCatalogTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    Database: S.String,
    Table: S.String,
  }),
).annotations({
  identifier: "MicrosoftSQLServerCatalogTarget",
}) as any as S.Schema<MicrosoftSQLServerCatalogTarget>;
export interface MySQLCatalogTarget {
  Name: string;
  Inputs: string[];
  Database: string;
  Table: string;
}
export const MySQLCatalogTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    Database: S.String,
    Table: S.String,
  }),
).annotations({
  identifier: "MySQLCatalogTarget",
}) as any as S.Schema<MySQLCatalogTarget>;
export interface OracleSQLCatalogTarget {
  Name: string;
  Inputs: string[];
  Database: string;
  Table: string;
}
export const OracleSQLCatalogTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    Database: S.String,
    Table: S.String,
  }),
).annotations({
  identifier: "OracleSQLCatalogTarget",
}) as any as S.Schema<OracleSQLCatalogTarget>;
export interface PostgreSQLCatalogTarget {
  Name: string;
  Inputs: string[];
  Database: string;
  Table: string;
}
export const PostgreSQLCatalogTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    Database: S.String,
    Table: S.String,
  }),
).annotations({
  identifier: "PostgreSQLCatalogTarget",
}) as any as S.Schema<PostgreSQLCatalogTarget>;
export interface GroupFilters {
  GroupName: string;
  Filters: FilterExpression[];
  LogicalOperator: FilterLogicalOperator;
}
export const GroupFilters = S.suspend(() =>
  S.Struct({
    GroupName: S.String,
    Filters: FilterExpressions,
    LogicalOperator: FilterLogicalOperator,
  }),
).annotations({ identifier: "GroupFilters" }) as any as S.Schema<GroupFilters>;
export type GroupFiltersList = GroupFilters[];
export const GroupFiltersList = S.Array(GroupFilters);
export interface Route {
  Name: string;
  Inputs: string[];
  GroupFiltersList: GroupFilters[];
}
export const Route = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    GroupFiltersList: GroupFiltersList,
  }),
).annotations({ identifier: "Route" }) as any as S.Schema<Route>;
export type ParamType =
  | "str"
  | "int"
  | "float"
  | "complex"
  | "bool"
  | "list"
  | "null"
  | (string & {});
export const ParamType = S.String;
export interface TransformConfigParameter {
  Name: string;
  Type: ParamType;
  ValidationRule?: string;
  ValidationMessage?: string;
  Value?: string[];
  ListType?: ParamType;
  IsOptional?: boolean;
}
export const TransformConfigParameter = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Type: ParamType,
    ValidationRule: S.optional(S.String),
    ValidationMessage: S.optional(S.String),
    Value: S.optional(EnclosedInStringProperties),
    ListType: S.optional(ParamType),
    IsOptional: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "TransformConfigParameter",
}) as any as S.Schema<TransformConfigParameter>;
export type TransformConfigParameterList = TransformConfigParameter[];
export const TransformConfigParameterList = S.Array(TransformConfigParameter);
export interface DynamicTransform {
  Name: string;
  TransformName: string;
  Inputs: string[];
  Parameters?: TransformConfigParameter[];
  FunctionName: string;
  Path: string;
  Version?: string;
  OutputSchemas?: GlueSchema[];
}
export const DynamicTransform = S.suspend(() =>
  S.Struct({
    Name: S.String,
    TransformName: S.String,
    Inputs: OneInput,
    Parameters: S.optional(TransformConfigParameterList),
    FunctionName: S.String,
    Path: S.String,
    Version: S.optional(S.String),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "DynamicTransform",
}) as any as S.Schema<DynamicTransform>;
export type DQTransformOutput =
  | "PrimaryInput"
  | "EvaluationResults"
  | (string & {});
export const DQTransformOutput = S.String;
export interface DQResultsPublishingOptions {
  EvaluationContext?: string;
  ResultsS3Prefix?: string;
  CloudWatchMetricsEnabled?: boolean;
  ResultsPublishingEnabled?: boolean;
}
export const DQResultsPublishingOptions = S.suspend(() =>
  S.Struct({
    EvaluationContext: S.optional(S.String),
    ResultsS3Prefix: S.optional(S.String),
    CloudWatchMetricsEnabled: S.optional(S.Boolean),
    ResultsPublishingEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "DQResultsPublishingOptions",
}) as any as S.Schema<DQResultsPublishingOptions>;
export type DQStopJobOnFailureTiming =
  | "Immediate"
  | "AfterDataLoad"
  | (string & {});
export const DQStopJobOnFailureTiming = S.String;
export interface DQStopJobOnFailureOptions {
  StopJobOnFailureTiming?: DQStopJobOnFailureTiming;
}
export const DQStopJobOnFailureOptions = S.suspend(() =>
  S.Struct({ StopJobOnFailureTiming: S.optional(DQStopJobOnFailureTiming) }),
).annotations({
  identifier: "DQStopJobOnFailureOptions",
}) as any as S.Schema<DQStopJobOnFailureOptions>;
export interface EvaluateDataQuality {
  Name: string;
  Inputs: string[];
  Ruleset: string;
  Output?: DQTransformOutput;
  PublishingOptions?: DQResultsPublishingOptions;
  StopJobOnFailureOptions?: DQStopJobOnFailureOptions;
}
export const EvaluateDataQuality = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    Ruleset: S.String,
    Output: S.optional(DQTransformOutput),
    PublishingOptions: S.optional(DQResultsPublishingOptions),
    StopJobOnFailureOptions: S.optional(DQStopJobOnFailureOptions),
  }),
).annotations({
  identifier: "EvaluateDataQuality",
}) as any as S.Schema<EvaluateDataQuality>;
export interface S3CatalogHudiSource {
  Name: string;
  Database: string;
  Table: string;
  AdditionalHudiOptions?: { [key: string]: string | undefined };
  OutputSchemas?: GlueSchema[];
}
export const S3CatalogHudiSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Database: S.String,
    Table: S.String,
    AdditionalHudiOptions: S.optional(AdditionalOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "S3CatalogHudiSource",
}) as any as S.Schema<S3CatalogHudiSource>;
export interface CatalogHudiSource {
  Name: string;
  Database: string;
  Table: string;
  AdditionalHudiOptions?: { [key: string]: string | undefined };
  OutputSchemas?: GlueSchema[];
}
export const CatalogHudiSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Database: S.String,
    Table: S.String,
    AdditionalHudiOptions: S.optional(AdditionalOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "CatalogHudiSource",
}) as any as S.Schema<CatalogHudiSource>;
export interface S3HudiSource {
  Name: string;
  Paths: string[];
  AdditionalHudiOptions?: { [key: string]: string | undefined };
  AdditionalOptions?: S3DirectSourceAdditionalOptions;
  OutputSchemas?: GlueSchema[];
}
export const S3HudiSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Paths: EnclosedInStringProperties,
    AdditionalHudiOptions: S.optional(AdditionalOptions),
    AdditionalOptions: S.optional(S3DirectSourceAdditionalOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({ identifier: "S3HudiSource" }) as any as S.Schema<S3HudiSource>;
export interface S3HudiCatalogTarget {
  Name: string;
  Inputs: string[];
  PartitionKeys?: string[][];
  Table: string;
  Database: string;
  AdditionalOptions: { [key: string]: string | undefined };
  SchemaChangePolicy?: CatalogSchemaChangePolicy;
  AutoDataQuality?: AutoDataQuality;
  OutputSchemas?: GlueSchema[];
}
export const S3HudiCatalogTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    PartitionKeys: S.optional(GlueStudioPathList),
    Table: S.String,
    Database: S.String,
    AdditionalOptions: AdditionalOptions,
    SchemaChangePolicy: S.optional(CatalogSchemaChangePolicy),
    AutoDataQuality: S.optional(AutoDataQuality),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "S3HudiCatalogTarget",
}) as any as S.Schema<S3HudiCatalogTarget>;
export type HudiTargetCompressionType =
  | "gzip"
  | "lzo"
  | "uncompressed"
  | "snappy"
  | (string & {});
export const HudiTargetCompressionType = S.String;
export interface S3HudiDirectTarget {
  Name: string;
  Inputs: string[];
  Path: string;
  Compression: HudiTargetCompressionType;
  NumberTargetPartitions?: string;
  PartitionKeys?: string[][];
  Format: TargetFormat;
  AdditionalOptions: { [key: string]: string | undefined };
  SchemaChangePolicy?: DirectSchemaChangePolicy;
  AutoDataQuality?: AutoDataQuality;
}
export const S3HudiDirectTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    Path: S.String,
    Compression: HudiTargetCompressionType,
    NumberTargetPartitions: S.optional(S.String),
    PartitionKeys: S.optional(GlueStudioPathList),
    Format: TargetFormat,
    AdditionalOptions: AdditionalOptions,
    SchemaChangePolicy: S.optional(DirectSchemaChangePolicy),
    AutoDataQuality: S.optional(AutoDataQuality),
  }),
).annotations({
  identifier: "S3HudiDirectTarget",
}) as any as S.Schema<S3HudiDirectTarget>;
export type JDBCConnectionType =
  | "sqlserver"
  | "mysql"
  | "oracle"
  | "postgresql"
  | "redshift"
  | (string & {});
export const JDBCConnectionType = S.String;
export interface DirectJDBCSource {
  Name: string;
  Database: string;
  Table: string;
  ConnectionName: string;
  ConnectionType: JDBCConnectionType;
  RedshiftTmpDir?: string;
  OutputSchemas?: GlueSchema[];
}
export const DirectJDBCSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Database: S.String,
    Table: S.String,
    ConnectionName: S.String,
    ConnectionType: JDBCConnectionType,
    RedshiftTmpDir: S.optional(S.String),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "DirectJDBCSource",
}) as any as S.Schema<DirectJDBCSource>;
export interface S3CatalogDeltaSource {
  Name: string;
  Database: string;
  Table: string;
  AdditionalDeltaOptions?: { [key: string]: string | undefined };
  OutputSchemas?: GlueSchema[];
}
export const S3CatalogDeltaSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Database: S.String,
    Table: S.String,
    AdditionalDeltaOptions: S.optional(AdditionalOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "S3CatalogDeltaSource",
}) as any as S.Schema<S3CatalogDeltaSource>;
export interface CatalogDeltaSource {
  Name: string;
  Database: string;
  Table: string;
  AdditionalDeltaOptions?: { [key: string]: string | undefined };
  OutputSchemas?: GlueSchema[];
}
export const CatalogDeltaSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Database: S.String,
    Table: S.String,
    AdditionalDeltaOptions: S.optional(AdditionalOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "CatalogDeltaSource",
}) as any as S.Schema<CatalogDeltaSource>;
export interface S3DeltaSource {
  Name: string;
  Paths: string[];
  AdditionalDeltaOptions?: { [key: string]: string | undefined };
  AdditionalOptions?: S3DirectSourceAdditionalOptions;
  OutputSchemas?: GlueSchema[];
}
export const S3DeltaSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Paths: EnclosedInStringProperties,
    AdditionalDeltaOptions: S.optional(AdditionalOptions),
    AdditionalOptions: S.optional(S3DirectSourceAdditionalOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "S3DeltaSource",
}) as any as S.Schema<S3DeltaSource>;
export interface S3DeltaCatalogTarget {
  Name: string;
  Inputs: string[];
  PartitionKeys?: string[][];
  Table: string;
  Database: string;
  AdditionalOptions?: { [key: string]: string | undefined };
  SchemaChangePolicy?: CatalogSchemaChangePolicy;
  AutoDataQuality?: AutoDataQuality;
  OutputSchemas?: GlueSchema[];
}
export const S3DeltaCatalogTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    PartitionKeys: S.optional(GlueStudioPathList),
    Table: S.String,
    Database: S.String,
    AdditionalOptions: S.optional(AdditionalOptions),
    SchemaChangePolicy: S.optional(CatalogSchemaChangePolicy),
    AutoDataQuality: S.optional(AutoDataQuality),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "S3DeltaCatalogTarget",
}) as any as S.Schema<S3DeltaCatalogTarget>;
export type DeltaTargetCompressionType =
  | "uncompressed"
  | "snappy"
  | (string & {});
export const DeltaTargetCompressionType = S.String;
export interface S3DeltaDirectTarget {
  Name: string;
  Inputs: string[];
  PartitionKeys?: string[][];
  Path: string;
  Compression: DeltaTargetCompressionType;
  NumberTargetPartitions?: string;
  Format: TargetFormat;
  AdditionalOptions?: { [key: string]: string | undefined };
  SchemaChangePolicy?: DirectSchemaChangePolicy;
  AutoDataQuality?: AutoDataQuality;
}
export const S3DeltaDirectTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    PartitionKeys: S.optional(GlueStudioPathList),
    Path: S.String,
    Compression: DeltaTargetCompressionType,
    NumberTargetPartitions: S.optional(S.String),
    Format: TargetFormat,
    AdditionalOptions: S.optional(AdditionalOptions),
    SchemaChangePolicy: S.optional(DirectSchemaChangePolicy),
    AutoDataQuality: S.optional(AutoDataQuality),
  }),
).annotations({
  identifier: "S3DeltaDirectTarget",
}) as any as S.Schema<S3DeltaDirectTarget>;
export interface Option {
  Value?: string;
  Label?: string;
  Description?: string;
}
export const Option = S.suspend(() =>
  S.Struct({
    Value: S.optional(S.String),
    Label: S.optional(S.String),
    Description: S.optional(S.String),
  }),
).annotations({ identifier: "Option" }) as any as S.Schema<Option>;
export interface AmazonRedshiftAdvancedOption {
  Key?: string;
  Value?: string;
}
export const AmazonRedshiftAdvancedOption = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({
  identifier: "AmazonRedshiftAdvancedOption",
}) as any as S.Schema<AmazonRedshiftAdvancedOption>;
export type AmazonRedshiftAdvancedOptions = AmazonRedshiftAdvancedOption[];
export const AmazonRedshiftAdvancedOptions = S.Array(
  AmazonRedshiftAdvancedOption,
);
export type OptionList = Option[];
export const OptionList = S.Array(Option);
export interface AmazonRedshiftNodeData {
  AccessType?: string;
  SourceType?: string;
  Connection?: Option;
  Schema?: Option;
  Table?: Option;
  CatalogDatabase?: Option;
  CatalogTable?: Option;
  CatalogRedshiftSchema?: string;
  CatalogRedshiftTable?: string;
  TempDir?: string;
  IamRole?: Option;
  AdvancedOptions?: AmazonRedshiftAdvancedOption[];
  SampleQuery?: string;
  PreAction?: string;
  PostAction?: string;
  Action?: string;
  TablePrefix?: string;
  Upsert?: boolean;
  MergeAction?: string;
  MergeWhenMatched?: string;
  MergeWhenNotMatched?: string;
  MergeClause?: string;
  CrawlerConnection?: string;
  TableSchema?: Option[];
  StagingTable?: string;
  SelectedColumns?: Option[];
}
export const AmazonRedshiftNodeData = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "AmazonRedshiftNodeData",
}) as any as S.Schema<AmazonRedshiftNodeData>;
export interface AmazonRedshiftSource {
  Name?: string;
  Data?: AmazonRedshiftNodeData;
}
export const AmazonRedshiftSource = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Data: S.optional(AmazonRedshiftNodeData),
  }),
).annotations({
  identifier: "AmazonRedshiftSource",
}) as any as S.Schema<AmazonRedshiftSource>;
export interface AmazonRedshiftTarget {
  Name?: string;
  Data?: AmazonRedshiftNodeData;
  Inputs?: string[];
}
export const AmazonRedshiftTarget = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Data: S.optional(AmazonRedshiftNodeData),
    Inputs: S.optional(OneInput),
  }),
).annotations({
  identifier: "AmazonRedshiftTarget",
}) as any as S.Schema<AmazonRedshiftTarget>;
export type DQDLAliases = { [key: string]: string | undefined };
export const DQDLAliases = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type AdditionalOptionKeys =
  | "performanceTuning.caching"
  | "observations.scope"
  | "compositeRuleEvaluation.method"
  | (string & {});
export const AdditionalOptionKeys = S.String;
export type DQAdditionalOptions = { [key in AdditionalOptionKeys]?: string };
export const DQAdditionalOptions = S.partial(
  S.Record({ key: AdditionalOptionKeys, value: S.UndefinedOr(S.String) }),
);
export interface EvaluateDataQualityMultiFrame {
  Name: string;
  Inputs: string[];
  AdditionalDataSources?: { [key: string]: string | undefined };
  Ruleset: string;
  PublishingOptions?: DQResultsPublishingOptions;
  AdditionalOptions?: { [key: string]: string | undefined };
  StopJobOnFailureOptions?: DQStopJobOnFailureOptions;
}
export const EvaluateDataQualityMultiFrame = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: ManyInputs,
    AdditionalDataSources: S.optional(DQDLAliases),
    Ruleset: S.String,
    PublishingOptions: S.optional(DQResultsPublishingOptions),
    AdditionalOptions: S.optional(DQAdditionalOptions),
    StopJobOnFailureOptions: S.optional(DQStopJobOnFailureOptions),
  }),
).annotations({
  identifier: "EvaluateDataQualityMultiFrame",
}) as any as S.Schema<EvaluateDataQualityMultiFrame>;
export interface RecipeReference {
  RecipeArn: string;
  RecipeVersion: string;
}
export const RecipeReference = S.suspend(() =>
  S.Struct({ RecipeArn: S.String, RecipeVersion: S.String }),
).annotations({
  identifier: "RecipeReference",
}) as any as S.Schema<RecipeReference>;
export type ParameterMap = { [key: string]: string | undefined };
export const ParameterMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface RecipeAction {
  Operation: string;
  Parameters?: { [key: string]: string | undefined };
}
export const RecipeAction = S.suspend(() =>
  S.Struct({ Operation: S.String, Parameters: S.optional(ParameterMap) }),
).annotations({ identifier: "RecipeAction" }) as any as S.Schema<RecipeAction>;
export interface ConditionExpression {
  Condition: string;
  Value?: string;
  TargetColumn: string;
}
export const ConditionExpression = S.suspend(() =>
  S.Struct({
    Condition: S.String,
    Value: S.optional(S.String),
    TargetColumn: S.String,
  }),
).annotations({
  identifier: "ConditionExpression",
}) as any as S.Schema<ConditionExpression>;
export type ConditionExpressionList = ConditionExpression[];
export const ConditionExpressionList = S.Array(ConditionExpression);
export interface RecipeStep {
  Action: RecipeAction;
  ConditionExpressions?: ConditionExpression[];
}
export const RecipeStep = S.suspend(() =>
  S.Struct({
    Action: RecipeAction,
    ConditionExpressions: S.optional(ConditionExpressionList),
  }),
).annotations({ identifier: "RecipeStep" }) as any as S.Schema<RecipeStep>;
export type RecipeSteps = RecipeStep[];
export const RecipeSteps = S.Array(RecipeStep);
export interface Recipe {
  Name: string;
  Inputs: string[];
  RecipeReference?: RecipeReference;
  RecipeSteps?: RecipeStep[];
}
export const Recipe = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    RecipeReference: S.optional(RecipeReference),
    RecipeSteps: S.optional(RecipeSteps),
  }),
).annotations({ identifier: "Recipe" }) as any as S.Schema<Recipe>;
export interface SnowflakeNodeData {
  SourceType?: string;
  Connection?: Option;
  Schema?: string;
  Table?: string;
  Database?: string;
  TempDir?: string;
  IamRole?: Option;
  AdditionalOptions?: { [key: string]: string | undefined };
  SampleQuery?: string;
  PreAction?: string;
  PostAction?: string;
  Action?: string;
  Upsert?: boolean;
  MergeAction?: string;
  MergeWhenMatched?: string;
  MergeWhenNotMatched?: string;
  MergeClause?: string;
  StagingTable?: string;
  SelectedColumns?: Option[];
  AutoPushdown?: boolean;
  TableSchema?: Option[];
}
export const SnowflakeNodeData = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "SnowflakeNodeData",
}) as any as S.Schema<SnowflakeNodeData>;
export interface SnowflakeSource {
  Name: string;
  Data: SnowflakeNodeData;
  OutputSchemas?: GlueSchema[];
}
export const SnowflakeSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Data: SnowflakeNodeData,
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "SnowflakeSource",
}) as any as S.Schema<SnowflakeSource>;
export interface SnowflakeTarget {
  Name: string;
  Data: SnowflakeNodeData;
  Inputs?: string[];
}
export const SnowflakeTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Data: SnowflakeNodeData,
    Inputs: S.optional(OneInput),
  }),
).annotations({
  identifier: "SnowflakeTarget",
}) as any as S.Schema<SnowflakeTarget>;
export type ConnectorOptions = { [key: string]: string | undefined };
export const ConnectorOptions = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface ConnectorDataSource {
  Name: string;
  ConnectionType: string;
  Data: { [key: string]: string | undefined };
  OutputSchemas?: GlueSchema[];
}
export const ConnectorDataSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ConnectionType: S.String,
    Data: ConnectorOptions,
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "ConnectorDataSource",
}) as any as S.Schema<ConnectorDataSource>;
export interface ConnectorDataTarget {
  Name: string;
  ConnectionType: string;
  Data: { [key: string]: string | undefined };
  Inputs?: string[];
}
export const ConnectorDataTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ConnectionType: S.String,
    Data: ConnectorOptions,
    Inputs: S.optional(OneInput),
  }),
).annotations({
  identifier: "ConnectorDataTarget",
}) as any as S.Schema<ConnectorDataTarget>;
export interface S3CatalogIcebergSource {
  Name: string;
  Database: string;
  Table: string;
  AdditionalIcebergOptions?: { [key: string]: string | undefined };
  OutputSchemas?: GlueSchema[];
}
export const S3CatalogIcebergSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Database: S.String,
    Table: S.String,
    AdditionalIcebergOptions: S.optional(AdditionalOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "S3CatalogIcebergSource",
}) as any as S.Schema<S3CatalogIcebergSource>;
export interface CatalogIcebergSource {
  Name: string;
  Database: string;
  Table: string;
  AdditionalIcebergOptions?: { [key: string]: string | undefined };
  OutputSchemas?: GlueSchema[];
}
export const CatalogIcebergSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Database: S.String,
    Table: S.String,
    AdditionalIcebergOptions: S.optional(AdditionalOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "CatalogIcebergSource",
}) as any as S.Schema<CatalogIcebergSource>;
export interface S3IcebergCatalogTarget {
  Name: string;
  Inputs: string[];
  PartitionKeys?: string[][];
  Table: string;
  Database: string;
  AdditionalOptions?: { [key: string]: string | undefined };
  SchemaChangePolicy?: CatalogSchemaChangePolicy;
  AutoDataQuality?: AutoDataQuality;
}
export const S3IcebergCatalogTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    PartitionKeys: S.optional(GlueStudioPathList),
    Table: S.String,
    Database: S.String,
    AdditionalOptions: S.optional(AdditionalOptions),
    SchemaChangePolicy: S.optional(CatalogSchemaChangePolicy),
    AutoDataQuality: S.optional(AutoDataQuality),
  }),
).annotations({
  identifier: "S3IcebergCatalogTarget",
}) as any as S.Schema<S3IcebergCatalogTarget>;
export type IcebergTargetCompressionType =
  | "gzip"
  | "lzo"
  | "uncompressed"
  | "snappy"
  | (string & {});
export const IcebergTargetCompressionType = S.String;
export interface S3IcebergDirectTarget {
  Name: string;
  Inputs: string[];
  PartitionKeys?: string[][];
  Path: string;
  Format: TargetFormat;
  AdditionalOptions?: { [key: string]: string | undefined };
  SchemaChangePolicy?: DirectSchemaChangePolicy;
  AutoDataQuality?: AutoDataQuality;
  Compression: IcebergTargetCompressionType;
  NumberTargetPartitions?: string;
  OutputSchemas?: GlueSchema[];
}
export const S3IcebergDirectTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    PartitionKeys: S.optional(GlueStudioPathList),
    Path: S.String,
    Format: TargetFormat,
    AdditionalOptions: S.optional(AdditionalOptions),
    SchemaChangePolicy: S.optional(DirectSchemaChangePolicy),
    AutoDataQuality: S.optional(AutoDataQuality),
    Compression: IcebergTargetCompressionType,
    NumberTargetPartitions: S.optional(S.String),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "S3IcebergDirectTarget",
}) as any as S.Schema<S3IcebergDirectTarget>;
export interface S3ExcelSource {
  Name: string;
  Paths: string[];
  CompressionType?: ParquetCompressionType;
  Exclusions?: string[];
  GroupSize?: string;
  GroupFiles?: string;
  Recurse?: boolean;
  MaxBand?: number;
  MaxFilesInBand?: number;
  AdditionalOptions?: S3DirectSourceAdditionalOptions;
  NumberRows?: number;
  SkipFooter?: number;
  OutputSchemas?: GlueSchema[];
}
export const S3ExcelSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Paths: EnclosedInStringProperties,
    CompressionType: S.optional(ParquetCompressionType),
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
  }),
).annotations({
  identifier: "S3ExcelSource",
}) as any as S.Schema<S3ExcelSource>;
export type HyperTargetCompressionType = "uncompressed" | (string & {});
export const HyperTargetCompressionType = S.String;
export interface S3HyperDirectTarget {
  Name: string;
  Inputs: string[];
  Format?: TargetFormat;
  PartitionKeys?: string[][];
  Path: string;
  Compression?: HyperTargetCompressionType;
  SchemaChangePolicy?: DirectSchemaChangePolicy;
  AutoDataQuality?: AutoDataQuality;
  OutputSchemas?: GlueSchema[];
}
export const S3HyperDirectTarget = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Inputs: OneInput,
    Format: S.optional(TargetFormat),
    PartitionKeys: S.optional(GlueStudioPathList),
    Path: S.String,
    Compression: S.optional(HyperTargetCompressionType),
    SchemaChangePolicy: S.optional(DirectSchemaChangePolicy),
    AutoDataQuality: S.optional(AutoDataQuality),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "S3HyperDirectTarget",
}) as any as S.Schema<S3HyperDirectTarget>;
export type DdbExportType = "ddb" | "s3" | (string & {});
export const DdbExportType = S.String;
export interface DDBELTConnectionOptions {
  DynamodbExport?: DdbExportType;
  DynamodbUnnestDDBJson?: boolean;
  DynamodbTableArn: string;
  DynamodbS3Bucket?: string;
  DynamodbS3Prefix?: string;
  DynamodbS3BucketOwner?: string;
  DynamodbStsRoleArn?: string;
}
export const DDBELTConnectionOptions = S.suspend(() =>
  S.Struct({
    DynamodbExport: S.optional(DdbExportType),
    DynamodbUnnestDDBJson: S.optional(S.Boolean),
    DynamodbTableArn: S.String,
    DynamodbS3Bucket: S.optional(S.String),
    DynamodbS3Prefix: S.optional(S.String),
    DynamodbS3BucketOwner: S.optional(S.String),
    DynamodbStsRoleArn: S.optional(S.String),
  }),
).annotations({
  identifier: "DDBELTConnectionOptions",
}) as any as S.Schema<DDBELTConnectionOptions>;
export interface DynamoDBELTConnectorSource {
  Name: string;
  ConnectionOptions?: DDBELTConnectionOptions;
  OutputSchemas?: GlueSchema[];
}
export const DynamoDBELTConnectorSource = S.suspend(() =>
  S.Struct({
    Name: S.String,
    ConnectionOptions: S.optional(DDBELTConnectionOptions),
    OutputSchemas: S.optional(GlueSchemas),
  }),
).annotations({
  identifier: "DynamoDBELTConnectorSource",
}) as any as S.Schema<DynamoDBELTConnectorSource>;
export interface CodeGenConfigurationNode {
  AthenaConnectorSource?: AthenaConnectorSource;
  JDBCConnectorSource?: JDBCConnectorSource;
  SparkConnectorSource?: SparkConnectorSource;
  CatalogSource?: CatalogSource;
  RedshiftSource?: RedshiftSource;
  S3CatalogSource?: S3CatalogSource;
  S3CsvSource?: S3CsvSource;
  S3JsonSource?: S3JsonSource;
  S3ParquetSource?: S3ParquetSource;
  RelationalCatalogSource?: RelationalCatalogSource;
  DynamoDBCatalogSource?: DynamoDBCatalogSource;
  JDBCConnectorTarget?: JDBCConnectorTarget;
  SparkConnectorTarget?: SparkConnectorTarget;
  CatalogTarget?: BasicCatalogTarget;
  RedshiftTarget?: RedshiftTarget;
  S3CatalogTarget?: S3CatalogTarget;
  S3GlueParquetTarget?: S3GlueParquetTarget;
  S3DirectTarget?: S3DirectTarget;
  ApplyMapping?: ApplyMapping;
  SelectFields?: SelectFields;
  DropFields?: DropFields;
  RenameField?: RenameField;
  Spigot?: Spigot;
  Join?: Join;
  SplitFields?: SplitFields;
  SelectFromCollection?: SelectFromCollection;
  FillMissingValues?: FillMissingValues;
  Filter?: Filter;
  CustomCode?: CustomCode;
  SparkSQL?: SparkSQL;
  DirectKinesisSource?: DirectKinesisSource;
  DirectKafkaSource?: DirectKafkaSource;
  CatalogKinesisSource?: CatalogKinesisSource;
  CatalogKafkaSource?: CatalogKafkaSource;
  DropNullFields?: DropNullFields;
  Merge?: Merge;
  Union?: Union;
  PIIDetection?: PIIDetection;
  Aggregate?: Aggregate;
  DropDuplicates?: DropDuplicates;
  GovernedCatalogTarget?: GovernedCatalogTarget;
  GovernedCatalogSource?: GovernedCatalogSource;
  MicrosoftSQLServerCatalogSource?: MicrosoftSQLServerCatalogSource;
  MySQLCatalogSource?: MySQLCatalogSource;
  OracleSQLCatalogSource?: OracleSQLCatalogSource;
  PostgreSQLCatalogSource?: PostgreSQLCatalogSource;
  MicrosoftSQLServerCatalogTarget?: MicrosoftSQLServerCatalogTarget;
  MySQLCatalogTarget?: MySQLCatalogTarget;
  OracleSQLCatalogTarget?: OracleSQLCatalogTarget;
  PostgreSQLCatalogTarget?: PostgreSQLCatalogTarget;
  Route?: Route;
  DynamicTransform?: DynamicTransform;
  EvaluateDataQuality?: EvaluateDataQuality;
  S3CatalogHudiSource?: S3CatalogHudiSource;
  CatalogHudiSource?: CatalogHudiSource;
  S3HudiSource?: S3HudiSource;
  S3HudiCatalogTarget?: S3HudiCatalogTarget;
  S3HudiDirectTarget?: S3HudiDirectTarget;
  DirectJDBCSource?: DirectJDBCSource;
  S3CatalogDeltaSource?: S3CatalogDeltaSource;
  CatalogDeltaSource?: CatalogDeltaSource;
  S3DeltaSource?: S3DeltaSource;
  S3DeltaCatalogTarget?: S3DeltaCatalogTarget;
  S3DeltaDirectTarget?: S3DeltaDirectTarget;
  AmazonRedshiftSource?: AmazonRedshiftSource;
  AmazonRedshiftTarget?: AmazonRedshiftTarget;
  EvaluateDataQualityMultiFrame?: EvaluateDataQualityMultiFrame;
  Recipe?: Recipe;
  SnowflakeSource?: SnowflakeSource;
  SnowflakeTarget?: SnowflakeTarget;
  ConnectorDataSource?: ConnectorDataSource;
  ConnectorDataTarget?: ConnectorDataTarget;
  S3CatalogIcebergSource?: S3CatalogIcebergSource;
  CatalogIcebergSource?: CatalogIcebergSource;
  S3IcebergCatalogTarget?: S3IcebergCatalogTarget;
  S3IcebergDirectTarget?: S3IcebergDirectTarget;
  S3ExcelSource?: S3ExcelSource;
  S3HyperDirectTarget?: S3HyperDirectTarget;
  DynamoDBELTConnectorSource?: DynamoDBELTConnectorSource;
}
export const CodeGenConfigurationNode = S.suspend(() =>
  S.Struct({
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
    MicrosoftSQLServerCatalogSource: S.optional(
      MicrosoftSQLServerCatalogSource,
    ),
    MySQLCatalogSource: S.optional(MySQLCatalogSource),
    OracleSQLCatalogSource: S.optional(OracleSQLCatalogSource),
    PostgreSQLCatalogSource: S.optional(PostgreSQLCatalogSource),
    MicrosoftSQLServerCatalogTarget: S.optional(
      MicrosoftSQLServerCatalogTarget,
    ),
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
  }),
).annotations({
  identifier: "CodeGenConfigurationNode",
}) as any as S.Schema<CodeGenConfigurationNode>;
export type CodeGenConfigurationNodes = {
  [key: string]: CodeGenConfigurationNode | undefined;
};
export const CodeGenConfigurationNodes = S.Record({
  key: S.String,
  value: S.UndefinedOr(CodeGenConfigurationNode),
});
export interface JobUpdate {
  JobMode?: JobMode;
  JobRunQueuingEnabled?: boolean;
  Description?: string;
  LogUri?: string;
  Role?: string;
  ExecutionProperty?: ExecutionProperty;
  Command?: JobCommand;
  DefaultArguments?: { [key: string]: string | undefined };
  NonOverridableArguments?: { [key: string]: string | undefined };
  Connections?: ConnectionsList;
  MaxRetries?: number;
  AllocatedCapacity?: number;
  Timeout?: number;
  MaxCapacity?: number;
  WorkerType?: WorkerType;
  NumberOfWorkers?: number;
  SecurityConfiguration?: string;
  NotificationProperty?: NotificationProperty;
  GlueVersion?: string;
  CodeGenConfigurationNodes?: {
    [key: string]: CodeGenConfigurationNode | undefined;
  };
  ExecutionClass?: ExecutionClass;
  SourceControlDetails?: SourceControlDetails;
  MaintenanceWindow?: string;
}
export const JobUpdate = S.suspend(() =>
  S.Struct({
    JobMode: S.optional(JobMode),
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
    WorkerType: S.optional(WorkerType),
    NumberOfWorkers: S.optional(S.Number),
    SecurityConfiguration: S.optional(S.String),
    NotificationProperty: S.optional(NotificationProperty),
    GlueVersion: S.optional(S.String),
    CodeGenConfigurationNodes: S.optional(CodeGenConfigurationNodes),
    ExecutionClass: S.optional(ExecutionClass),
    SourceControlDetails: S.optional(SourceControlDetails),
    MaintenanceWindow: S.optional(S.String),
  }),
).annotations({ identifier: "JobUpdate" }) as any as S.Schema<JobUpdate>;
export interface TriggerUpdate {
  Name?: string;
  Description?: string;
  Schedule?: string;
  Actions?: Action[];
  Predicate?: Predicate;
  EventBatchingCondition?: EventBatchingCondition;
}
export const TriggerUpdate = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Schedule: S.optional(S.String),
    Actions: S.optional(ActionList),
    Predicate: S.optional(Predicate),
    EventBatchingCondition: S.optional(EventBatchingCondition),
  }),
).annotations({
  identifier: "TriggerUpdate",
}) as any as S.Schema<TriggerUpdate>;
export type MLUserDataEncryptionModeString =
  | "DISABLED"
  | "SSE-KMS"
  | (string & {});
export const MLUserDataEncryptionModeString = S.String;
export type MetadataOperation = "CREATE" | (string & {});
export const MetadataOperation = S.String;
export type CatalogEncryptionMode =
  | "DISABLED"
  | "SSE-KMS"
  | "SSE-KMS-WITH-SERVICE-ROLE"
  | (string & {});
export const CatalogEncryptionMode = S.String;
export interface BatchDeletePartitionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  PartitionsToDelete: PartitionValueList[];
}
export const BatchDeletePartitionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionsToDelete: BatchDeletePartitionValueList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchDeletePartitionRequest",
}) as any as S.Schema<BatchDeletePartitionRequest>;
export interface BatchGetTableOptimizerRequest {
  Entries: BatchGetTableOptimizerEntry[];
}
export const BatchGetTableOptimizerRequest = S.suspend(() =>
  S.Struct({ Entries: BatchGetTableOptimizerEntries }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchGetTableOptimizerRequest",
}) as any as S.Schema<BatchGetTableOptimizerRequest>;
export interface BatchPutDataQualityStatisticAnnotationRequest {
  InclusionAnnotations: DatapointInclusionAnnotation[];
  ClientToken?: string;
}
export const BatchPutDataQualityStatisticAnnotationRequest = S.suspend(() =>
  S.Struct({
    InclusionAnnotations: InclusionAnnotationList,
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchPutDataQualityStatisticAnnotationRequest",
}) as any as S.Schema<BatchPutDataQualityStatisticAnnotationRequest>;
export interface BatchUpdatePartitionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  Entries: BatchUpdatePartitionRequestEntry[];
}
export const BatchUpdatePartitionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    Entries: BatchUpdatePartitionRequestEntryList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchUpdatePartitionRequest",
}) as any as S.Schema<BatchUpdatePartitionRequest>;
export interface CancelMLTaskRunResponse {
  TransformId?: string;
  TaskRunId?: string;
  Status?: TaskStatusType;
}
export const CancelMLTaskRunResponse = S.suspend(() =>
  S.Struct({
    TransformId: S.optional(S.String),
    TaskRunId: S.optional(S.String),
    Status: S.optional(TaskStatusType),
  }),
).annotations({
  identifier: "CancelMLTaskRunResponse",
}) as any as S.Schema<CancelMLTaskRunResponse>;
export interface CheckSchemaVersionValidityResponse {
  Valid?: boolean;
  Error?: string;
}
export const CheckSchemaVersionValidityResponse = S.suspend(() =>
  S.Struct({ Valid: S.optional(S.Boolean), Error: S.optional(S.String) }),
).annotations({
  identifier: "CheckSchemaVersionValidityResponse",
}) as any as S.Schema<CheckSchemaVersionValidityResponse>;
export interface CreateBlueprintRequest {
  Name: string;
  Description?: string;
  BlueprintLocation: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateBlueprintRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    BlueprintLocation: S.String,
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateBlueprintRequest",
}) as any as S.Schema<CreateBlueprintRequest>;
export interface CreateClassifierRequest {
  GrokClassifier?: CreateGrokClassifierRequest;
  XMLClassifier?: CreateXMLClassifierRequest;
  JsonClassifier?: CreateJsonClassifierRequest;
  CsvClassifier?: CreateCsvClassifierRequest;
}
export const CreateClassifierRequest = S.suspend(() =>
  S.Struct({
    GrokClassifier: S.optional(CreateGrokClassifierRequest),
    XMLClassifier: S.optional(CreateXMLClassifierRequest),
    JsonClassifier: S.optional(CreateJsonClassifierRequest),
    CsvClassifier: S.optional(CreateCsvClassifierRequest),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateClassifierRequest",
}) as any as S.Schema<CreateClassifierRequest>;
export interface CreateClassifierResponse {}
export const CreateClassifierResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateClassifierResponse",
}) as any as S.Schema<CreateClassifierResponse>;
export interface CreateCustomEntityTypeResponse {
  Name?: string;
}
export const CreateCustomEntityTypeResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "CreateCustomEntityTypeResponse",
}) as any as S.Schema<CreateCustomEntityTypeResponse>;
export interface CreateDataQualityRulesetRequest {
  Name: string;
  Description?: string;
  Ruleset: string;
  Tags?: { [key: string]: string | undefined };
  TargetTable?: DataQualityTargetTable;
  DataQualitySecurityConfiguration?: string;
  ClientToken?: string;
}
export const CreateDataQualityRulesetRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Ruleset: S.String,
    Tags: S.optional(TagsMap),
    TargetTable: S.optional(DataQualityTargetTable),
    DataQualitySecurityConfiguration: S.optional(S.String),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDataQualityRulesetRequest",
}) as any as S.Schema<CreateDataQualityRulesetRequest>;
export interface CreateDevEndpointRequest {
  EndpointName: string;
  RoleArn: string;
  SecurityGroupIds?: string[];
  SubnetId?: string;
  PublicKey?: string;
  PublicKeys?: string[];
  NumberOfNodes?: number;
  WorkerType?: WorkerType;
  GlueVersion?: string;
  NumberOfWorkers?: number;
  ExtraPythonLibsS3Path?: string;
  ExtraJarsS3Path?: string;
  SecurityConfiguration?: string;
  Tags?: { [key: string]: string | undefined };
  Arguments?: { [key: string]: string | undefined };
}
export const CreateDevEndpointRequest = S.suspend(() =>
  S.Struct({
    EndpointName: S.String,
    RoleArn: S.String,
    SecurityGroupIds: S.optional(StringList),
    SubnetId: S.optional(S.String),
    PublicKey: S.optional(S.String),
    PublicKeys: S.optional(PublicKeysList),
    NumberOfNodes: S.optional(S.Number),
    WorkerType: S.optional(WorkerType),
    GlueVersion: S.optional(S.String),
    NumberOfWorkers: S.optional(S.Number),
    ExtraPythonLibsS3Path: S.optional(S.String),
    ExtraJarsS3Path: S.optional(S.String),
    SecurityConfiguration: S.optional(S.String),
    Tags: S.optional(TagsMap),
    Arguments: S.optional(MapValue),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDevEndpointRequest",
}) as any as S.Schema<CreateDevEndpointRequest>;
export interface CreateGlueIdentityCenterConfigurationResponse {
  ApplicationArn?: string;
}
export const CreateGlueIdentityCenterConfigurationResponse = S.suspend(() =>
  S.Struct({ ApplicationArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateGlueIdentityCenterConfigurationResponse",
}) as any as S.Schema<CreateGlueIdentityCenterConfigurationResponse>;
export interface CreateIntegrationResourcePropertyRequest {
  ResourceArn: string;
  SourceProcessingProperties?: SourceProcessingProperties;
  TargetProcessingProperties?: TargetProcessingProperties;
  Tags?: Tag[];
}
export const CreateIntegrationResourcePropertyRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    SourceProcessingProperties: S.optional(SourceProcessingProperties),
    TargetProcessingProperties: S.optional(TargetProcessingProperties),
    Tags: S.optional(IntegrationTagsList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateIntegrationResourcePropertyRequest",
}) as any as S.Schema<CreateIntegrationResourcePropertyRequest>;
export interface CreatePartitionIndexRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  PartitionIndex: PartitionIndex;
}
export const CreatePartitionIndexRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionIndex: PartitionIndex,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreatePartitionIndexRequest",
}) as any as S.Schema<CreatePartitionIndexRequest>;
export interface CreatePartitionIndexResponse {}
export const CreatePartitionIndexResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreatePartitionIndexResponse",
}) as any as S.Schema<CreatePartitionIndexResponse>;
export interface CreateRegistryResponse {
  RegistryArn?: string;
  RegistryName?: string;
  Description?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateRegistryResponse = S.suspend(() =>
  S.Struct({
    RegistryArn: S.optional(S.String),
    RegistryName: S.optional(S.String),
    Description: S.optional(S.String),
    Tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "CreateRegistryResponse",
}) as any as S.Schema<CreateRegistryResponse>;
export interface CreateSchemaInput {
  RegistryId?: RegistryId;
  SchemaName: string;
  DataFormat: DataFormat;
  Compatibility?: Compatibility;
  Description?: string;
  Tags?: { [key: string]: string | undefined };
  SchemaDefinition?: string;
}
export const CreateSchemaInput = S.suspend(() =>
  S.Struct({
    RegistryId: S.optional(RegistryId),
    SchemaName: S.String,
    DataFormat: DataFormat,
    Compatibility: S.optional(Compatibility),
    Description: S.optional(S.String),
    Tags: S.optional(TagsMap),
    SchemaDefinition: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSchemaInput",
}) as any as S.Schema<CreateSchemaInput>;
export interface CreateSessionRequest {
  Id: string;
  Description?: string;
  Role: string;
  Command: SessionCommand;
  Timeout?: number;
  IdleTimeout?: number;
  DefaultArguments?: { [key: string]: string | undefined };
  Connections?: ConnectionsList;
  MaxCapacity?: number;
  NumberOfWorkers?: number;
  WorkerType?: WorkerType;
  SecurityConfiguration?: string;
  GlueVersion?: string;
  Tags?: { [key: string]: string | undefined };
  RequestOrigin?: string;
}
export const CreateSessionRequest = S.suspend(() =>
  S.Struct({
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
    WorkerType: S.optional(WorkerType),
    SecurityConfiguration: S.optional(S.String),
    GlueVersion: S.optional(S.String),
    Tags: S.optional(TagsMap),
    RequestOrigin: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSessionRequest",
}) as any as S.Schema<CreateSessionRequest>;
export interface CreateWorkflowRequest {
  Name: string;
  Description?: string;
  DefaultRunProperties?: { [key: string]: string | undefined };
  Tags?: { [key: string]: string | undefined };
  MaxConcurrentRuns?: number;
}
export const CreateWorkflowRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    DefaultRunProperties: S.optional(WorkflowRunProperties),
    Tags: S.optional(TagsMap),
    MaxConcurrentRuns: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateWorkflowRequest",
}) as any as S.Schema<CreateWorkflowRequest>;
export interface DeleteBlueprintResponse {
  Name?: string;
}
export const DeleteBlueprintResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "DeleteBlueprintResponse",
}) as any as S.Schema<DeleteBlueprintResponse>;
export interface DeleteCustomEntityTypeResponse {
  Name?: string;
}
export const DeleteCustomEntityTypeResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "DeleteCustomEntityTypeResponse",
}) as any as S.Schema<DeleteCustomEntityTypeResponse>;
export interface DeleteJobResponse {
  JobName?: string;
}
export const DeleteJobResponse = S.suspend(() =>
  S.Struct({ JobName: S.optional(S.String) }),
).annotations({
  identifier: "DeleteJobResponse",
}) as any as S.Schema<DeleteJobResponse>;
export interface DeleteMLTransformResponse {
  TransformId?: string;
}
export const DeleteMLTransformResponse = S.suspend(() =>
  S.Struct({ TransformId: S.optional(S.String) }),
).annotations({
  identifier: "DeleteMLTransformResponse",
}) as any as S.Schema<DeleteMLTransformResponse>;
export interface DeleteRegistryResponse {
  RegistryName?: string;
  RegistryArn?: string;
  Status?: RegistryStatus;
}
export const DeleteRegistryResponse = S.suspend(() =>
  S.Struct({
    RegistryName: S.optional(S.String),
    RegistryArn: S.optional(S.String),
    Status: S.optional(RegistryStatus),
  }),
).annotations({
  identifier: "DeleteRegistryResponse",
}) as any as S.Schema<DeleteRegistryResponse>;
export interface DeleteSchemaInput {
  SchemaId: SchemaId;
}
export const DeleteSchemaInput = S.suspend(() =>
  S.Struct({ SchemaId: SchemaId }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteSchemaInput",
}) as any as S.Schema<DeleteSchemaInput>;
export interface DeleteSessionResponse {
  Id?: string;
}
export const DeleteSessionResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "DeleteSessionResponse",
}) as any as S.Schema<DeleteSessionResponse>;
export interface DeleteTriggerResponse {
  Name?: string;
}
export const DeleteTriggerResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "DeleteTriggerResponse",
}) as any as S.Schema<DeleteTriggerResponse>;
export interface DeleteWorkflowResponse {
  Name?: string;
}
export const DeleteWorkflowResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "DeleteWorkflowResponse",
}) as any as S.Schema<DeleteWorkflowResponse>;
export interface DescribeIntegrationsRequest {
  IntegrationIdentifier?: string;
  Marker?: string;
  MaxRecords?: number;
  Filters?: IntegrationFilter[];
}
export const DescribeIntegrationsRequest = S.suspend(() =>
  S.Struct({
    IntegrationIdentifier: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Filters: S.optional(IntegrationFilterList),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeIntegrationsRequest",
}) as any as S.Schema<DescribeIntegrationsRequest>;
export type BlueprintStatus =
  | "CREATING"
  | "ACTIVE"
  | "UPDATING"
  | "FAILED"
  | (string & {});
export const BlueprintStatus = S.String;
export interface LastActiveDefinition {
  Description?: string;
  LastModifiedOn?: Date;
  ParameterSpec?: string;
  BlueprintLocation?: string;
  BlueprintServiceLocation?: string;
}
export const LastActiveDefinition = S.suspend(() =>
  S.Struct({
    Description: S.optional(S.String),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ParameterSpec: S.optional(S.String),
    BlueprintLocation: S.optional(S.String),
    BlueprintServiceLocation: S.optional(S.String),
  }),
).annotations({
  identifier: "LastActiveDefinition",
}) as any as S.Schema<LastActiveDefinition>;
export interface Blueprint {
  Name?: string;
  Description?: string;
  CreatedOn?: Date;
  LastModifiedOn?: Date;
  ParameterSpec?: string;
  BlueprintLocation?: string;
  BlueprintServiceLocation?: string;
  Status?: BlueprintStatus;
  ErrorMessage?: string;
  LastActiveDefinition?: LastActiveDefinition;
}
export const Blueprint = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ParameterSpec: S.optional(S.String),
    BlueprintLocation: S.optional(S.String),
    BlueprintServiceLocation: S.optional(S.String),
    Status: S.optional(BlueprintStatus),
    ErrorMessage: S.optional(S.String),
    LastActiveDefinition: S.optional(LastActiveDefinition),
  }),
).annotations({ identifier: "Blueprint" }) as any as S.Schema<Blueprint>;
export interface GetBlueprintResponse {
  Blueprint?: Blueprint;
}
export const GetBlueprintResponse = S.suspend(() =>
  S.Struct({ Blueprint: S.optional(Blueprint) }),
).annotations({
  identifier: "GetBlueprintResponse",
}) as any as S.Schema<GetBlueprintResponse>;
export interface GetBlueprintRunsResponse {
  BlueprintRuns?: BlueprintRun[];
  NextToken?: string;
}
export const GetBlueprintRunsResponse = S.suspend(() =>
  S.Struct({
    BlueprintRuns: S.optional(BlueprintRuns),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetBlueprintRunsResponse",
}) as any as S.Schema<GetBlueprintRunsResponse>;
export interface GetCatalogsResponse {
  CatalogList: Catalog[];
  NextToken?: string;
}
export const GetCatalogsResponse = S.suspend(() =>
  S.Struct({ CatalogList: CatalogList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "GetCatalogsResponse",
}) as any as S.Schema<GetCatalogsResponse>;
export interface GetClassifiersResponse {
  Classifiers?: Classifier[];
  NextToken?: string;
}
export const GetClassifiersResponse = S.suspend(() =>
  S.Struct({
    Classifiers: S.optional(ClassifierList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetClassifiersResponse",
}) as any as S.Schema<GetClassifiersResponse>;
export interface ErrorDetail {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const ErrorDetail = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ErrorDetail" }) as any as S.Schema<ErrorDetail>;
export interface ColumnError {
  ColumnName?: string;
  Error?: ErrorDetail;
}
export const ColumnError = S.suspend(() =>
  S.Struct({
    ColumnName: S.optional(S.String),
    Error: S.optional(ErrorDetail),
  }),
).annotations({ identifier: "ColumnError" }) as any as S.Schema<ColumnError>;
export type ColumnErrors = ColumnError[];
export const ColumnErrors = S.Array(ColumnError);
export interface GetColumnStatisticsForTableResponse {
  ColumnStatisticsList?: ColumnStatistics[];
  Errors?: ColumnError[];
}
export const GetColumnStatisticsForTableResponse = S.suspend(() =>
  S.Struct({
    ColumnStatisticsList: S.optional(ColumnStatisticsList),
    Errors: S.optional(ColumnErrors),
  }),
).annotations({
  identifier: "GetColumnStatisticsForTableResponse",
}) as any as S.Schema<GetColumnStatisticsForTableResponse>;
export interface GetColumnStatisticsTaskRunsResponse {
  ColumnStatisticsTaskRuns?: ColumnStatisticsTaskRun[];
  NextToken?: string;
}
export const GetColumnStatisticsTaskRunsResponse = S.suspend(() =>
  S.Struct({
    ColumnStatisticsTaskRuns: S.optional(ColumnStatisticsTaskRunsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetColumnStatisticsTaskRunsResponse",
}) as any as S.Schema<GetColumnStatisticsTaskRunsResponse>;
export interface GetConnectionsRequest {
  CatalogId?: string;
  Filter?: GetConnectionsFilter;
  HidePassword?: boolean;
  NextToken?: string;
  MaxResults?: number;
}
export const GetConnectionsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    Filter: S.optional(GetConnectionsFilter),
    HidePassword: S.optional(S.Boolean),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetConnectionsRequest",
}) as any as S.Schema<GetConnectionsRequest>;
export type CrawlerState = "READY" | "RUNNING" | "STOPPING" | (string & {});
export const CrawlerState = S.String;
export type ScheduleState =
  | "SCHEDULED"
  | "NOT_SCHEDULED"
  | "TRANSITIONING"
  | (string & {});
export const ScheduleState = S.String;
export interface Schedule {
  ScheduleExpression?: string;
  State?: ScheduleState;
}
export const Schedule = S.suspend(() =>
  S.Struct({
    ScheduleExpression: S.optional(S.String),
    State: S.optional(ScheduleState),
  }),
).annotations({ identifier: "Schedule" }) as any as S.Schema<Schedule>;
export type LastCrawlStatus =
  | "SUCCEEDED"
  | "CANCELLED"
  | "FAILED"
  | (string & {});
export const LastCrawlStatus = S.String;
export interface LastCrawlInfo {
  Status?: LastCrawlStatus;
  ErrorMessage?: string;
  LogGroup?: string;
  LogStream?: string;
  MessagePrefix?: string;
  StartTime?: Date;
}
export const LastCrawlInfo = S.suspend(() =>
  S.Struct({
    Status: S.optional(LastCrawlStatus),
    ErrorMessage: S.optional(S.String),
    LogGroup: S.optional(S.String),
    LogStream: S.optional(S.String),
    MessagePrefix: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "LastCrawlInfo",
}) as any as S.Schema<LastCrawlInfo>;
export interface Crawler {
  Name?: string;
  Role?: string;
  Targets?: CrawlerTargets;
  DatabaseName?: string;
  Description?: string;
  Classifiers?: string[];
  RecrawlPolicy?: RecrawlPolicy;
  SchemaChangePolicy?: SchemaChangePolicy;
  LineageConfiguration?: LineageConfiguration;
  State?: CrawlerState;
  TablePrefix?: string;
  Schedule?: Schedule;
  CrawlElapsedTime?: number;
  CreationTime?: Date;
  LastUpdated?: Date;
  LastCrawl?: LastCrawlInfo;
  Version?: number;
  Configuration?: string;
  CrawlerSecurityConfiguration?: string;
  LakeFormationConfiguration?: LakeFormationConfiguration;
}
export const Crawler = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Role: S.optional(S.String),
    Targets: S.optional(CrawlerTargets),
    DatabaseName: S.optional(S.String),
    Description: S.optional(S.String),
    Classifiers: S.optional(ClassifierNameList),
    RecrawlPolicy: S.optional(RecrawlPolicy),
    SchemaChangePolicy: S.optional(SchemaChangePolicy),
    LineageConfiguration: S.optional(LineageConfiguration),
    State: S.optional(CrawlerState),
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
  }),
).annotations({ identifier: "Crawler" }) as any as S.Schema<Crawler>;
export interface GetCrawlerResponse {
  Crawler?: Crawler;
}
export const GetCrawlerResponse = S.suspend(() =>
  S.Struct({ Crawler: S.optional(Crawler) }),
).annotations({
  identifier: "GetCrawlerResponse",
}) as any as S.Schema<GetCrawlerResponse>;
export type CrawlerList = Crawler[];
export const CrawlerList = S.Array(Crawler);
export interface GetCrawlersResponse {
  Crawlers?: Crawler[];
  NextToken?: string;
}
export const GetCrawlersResponse = S.suspend(() =>
  S.Struct({
    Crawlers: S.optional(CrawlerList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCrawlersResponse",
}) as any as S.Schema<GetCrawlersResponse>;
export interface GetCustomEntityTypeResponse {
  Name?: string;
  RegexString?: string;
  ContextWords?: string[];
}
export const GetCustomEntityTypeResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    RegexString: S.optional(S.String),
    ContextWords: S.optional(ContextWords),
  }),
).annotations({
  identifier: "GetCustomEntityTypeResponse",
}) as any as S.Schema<GetCustomEntityTypeResponse>;
export interface GetDatabasesResponse {
  DatabaseList: Database[];
  NextToken?: string;
}
export const GetDatabasesResponse = S.suspend(() =>
  S.Struct({ DatabaseList: DatabaseList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "GetDatabasesResponse",
}) as any as S.Schema<GetDatabasesResponse>;
export interface EncryptionAtRest {
  CatalogEncryptionMode: CatalogEncryptionMode;
  SseAwsKmsKeyId?: string;
  CatalogEncryptionServiceRole?: string;
}
export const EncryptionAtRest = S.suspend(() =>
  S.Struct({
    CatalogEncryptionMode: CatalogEncryptionMode,
    SseAwsKmsKeyId: S.optional(S.String),
    CatalogEncryptionServiceRole: S.optional(S.String),
  }),
).annotations({
  identifier: "EncryptionAtRest",
}) as any as S.Schema<EncryptionAtRest>;
export interface ConnectionPasswordEncryption {
  ReturnConnectionPasswordEncrypted: boolean;
  AwsKmsKeyId?: string;
}
export const ConnectionPasswordEncryption = S.suspend(() =>
  S.Struct({
    ReturnConnectionPasswordEncrypted: S.Boolean,
    AwsKmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectionPasswordEncryption",
}) as any as S.Schema<ConnectionPasswordEncryption>;
export interface DataCatalogEncryptionSettings {
  EncryptionAtRest?: EncryptionAtRest;
  ConnectionPasswordEncryption?: ConnectionPasswordEncryption;
}
export const DataCatalogEncryptionSettings = S.suspend(() =>
  S.Struct({
    EncryptionAtRest: S.optional(EncryptionAtRest),
    ConnectionPasswordEncryption: S.optional(ConnectionPasswordEncryption),
  }),
).annotations({
  identifier: "DataCatalogEncryptionSettings",
}) as any as S.Schema<DataCatalogEncryptionSettings>;
export interface GetDataCatalogEncryptionSettingsResponse {
  DataCatalogEncryptionSettings?: DataCatalogEncryptionSettings;
}
export const GetDataCatalogEncryptionSettingsResponse = S.suspend(() =>
  S.Struct({
    DataCatalogEncryptionSettings: S.optional(DataCatalogEncryptionSettings),
  }),
).annotations({
  identifier: "GetDataCatalogEncryptionSettingsResponse",
}) as any as S.Schema<GetDataCatalogEncryptionSettingsResponse>;
export interface CodeGenNode {
  Id: string;
  NodeType: string;
  Args: CodeGenNodeArg[];
  LineNumber?: number;
}
export const CodeGenNode = S.suspend(() =>
  S.Struct({
    Id: S.String,
    NodeType: S.String,
    Args: CodeGenNodeArgs,
    LineNumber: S.optional(S.Number),
  }),
).annotations({ identifier: "CodeGenNode" }) as any as S.Schema<CodeGenNode>;
export type DagNodes = CodeGenNode[];
export const DagNodes = S.Array(CodeGenNode);
export interface GetDataflowGraphResponse {
  DagNodes?: CodeGenNode[];
  DagEdges?: CodeGenEdge[];
}
export const GetDataflowGraphResponse = S.suspend(() =>
  S.Struct({ DagNodes: S.optional(DagNodes), DagEdges: S.optional(DagEdges) }),
).annotations({
  identifier: "GetDataflowGraphResponse",
}) as any as S.Schema<GetDataflowGraphResponse>;
export interface GetDataQualityModelResponse {
  Status?: DataQualityModelStatus;
  StartedOn?: Date;
  CompletedOn?: Date;
  FailureReason?: string;
}
export const GetDataQualityModelResponse = S.suspend(() =>
  S.Struct({
    Status: S.optional(DataQualityModelStatus),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDataQualityModelResponse",
}) as any as S.Schema<GetDataQualityModelResponse>;
export interface GetDataQualityRuleRecommendationRunResponse {
  RunId?: string;
  DataSource?: DataSource;
  Role?: string;
  NumberOfWorkers?: number;
  Timeout?: number;
  Status?: TaskStatusType;
  ErrorString?: string;
  StartedOn?: Date;
  LastModifiedOn?: Date;
  CompletedOn?: Date;
  ExecutionTime?: number;
  RecommendedRuleset?: string;
  CreatedRulesetName?: string;
  DataQualitySecurityConfiguration?: string;
}
export const GetDataQualityRuleRecommendationRunResponse = S.suspend(() =>
  S.Struct({
    RunId: S.optional(S.String),
    DataSource: S.optional(DataSource),
    Role: S.optional(S.String),
    NumberOfWorkers: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    Status: S.optional(TaskStatusType),
    ErrorString: S.optional(S.String),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExecutionTime: S.optional(S.Number),
    RecommendedRuleset: S.optional(S.String),
    CreatedRulesetName: S.optional(S.String),
    DataQualitySecurityConfiguration: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDataQualityRuleRecommendationRunResponse",
}) as any as S.Schema<GetDataQualityRuleRecommendationRunResponse>;
export interface GetDataQualityRulesetResponse {
  Name?: string;
  Description?: string;
  Ruleset?: string;
  TargetTable?: DataQualityTargetTable;
  CreatedOn?: Date;
  LastModifiedOn?: Date;
  RecommendationRunId?: string;
  DataQualitySecurityConfiguration?: string;
}
export const GetDataQualityRulesetResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Ruleset: S.optional(S.String),
    TargetTable: S.optional(DataQualityTargetTable),
    CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    RecommendationRunId: S.optional(S.String),
    DataQualitySecurityConfiguration: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDataQualityRulesetResponse",
}) as any as S.Schema<GetDataQualityRulesetResponse>;
export interface GetDataQualityRulesetEvaluationRunResponse {
  RunId?: string;
  DataSource?: DataSource;
  Role?: string;
  NumberOfWorkers?: number;
  Timeout?: number;
  AdditionalRunOptions?: DataQualityEvaluationRunAdditionalRunOptions;
  Status?: TaskStatusType;
  ErrorString?: string;
  StartedOn?: Date;
  LastModifiedOn?: Date;
  CompletedOn?: Date;
  ExecutionTime?: number;
  RulesetNames?: string[];
  ResultIds?: string[];
  AdditionalDataSources?: { [key: string]: DataSource | undefined };
}
export const GetDataQualityRulesetEvaluationRunResponse = S.suspend(() =>
  S.Struct({
    RunId: S.optional(S.String),
    DataSource: S.optional(DataSource),
    Role: S.optional(S.String),
    NumberOfWorkers: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    AdditionalRunOptions: S.optional(
      DataQualityEvaluationRunAdditionalRunOptions,
    ),
    Status: S.optional(TaskStatusType),
    ErrorString: S.optional(S.String),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExecutionTime: S.optional(S.Number),
    RulesetNames: S.optional(RulesetNames),
    ResultIds: S.optional(DataQualityResultIdList),
    AdditionalDataSources: S.optional(DataSourceMap),
  }),
).annotations({
  identifier: "GetDataQualityRulesetEvaluationRunResponse",
}) as any as S.Schema<GetDataQualityRulesetEvaluationRunResponse>;
export interface DevEndpoint {
  EndpointName?: string;
  RoleArn?: string;
  SecurityGroupIds?: string[];
  SubnetId?: string;
  YarnEndpointAddress?: string;
  PrivateAddress?: string;
  ZeppelinRemoteSparkInterpreterPort?: number;
  PublicAddress?: string;
  Status?: string;
  WorkerType?: WorkerType;
  GlueVersion?: string;
  NumberOfWorkers?: number;
  NumberOfNodes?: number;
  AvailabilityZone?: string;
  VpcId?: string;
  ExtraPythonLibsS3Path?: string;
  ExtraJarsS3Path?: string;
  FailureReason?: string;
  LastUpdateStatus?: string;
  CreatedTimestamp?: Date;
  LastModifiedTimestamp?: Date;
  PublicKey?: string;
  PublicKeys?: string[];
  SecurityConfiguration?: string;
  Arguments?: { [key: string]: string | undefined };
}
export const DevEndpoint = S.suspend(() =>
  S.Struct({
    EndpointName: S.optional(S.String),
    RoleArn: S.optional(S.String),
    SecurityGroupIds: S.optional(StringList),
    SubnetId: S.optional(S.String),
    YarnEndpointAddress: S.optional(S.String),
    PrivateAddress: S.optional(S.String),
    ZeppelinRemoteSparkInterpreterPort: S.optional(S.Number),
    PublicAddress: S.optional(S.String),
    Status: S.optional(S.String),
    WorkerType: S.optional(WorkerType),
    GlueVersion: S.optional(S.String),
    NumberOfWorkers: S.optional(S.Number),
    NumberOfNodes: S.optional(S.Number),
    AvailabilityZone: S.optional(S.String),
    VpcId: S.optional(S.String),
    ExtraPythonLibsS3Path: S.optional(S.String),
    ExtraJarsS3Path: S.optional(S.String),
    FailureReason: S.optional(S.String),
    LastUpdateStatus: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastModifiedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    PublicKey: S.optional(S.String),
    PublicKeys: S.optional(PublicKeysList),
    SecurityConfiguration: S.optional(S.String),
    Arguments: S.optional(MapValue),
  }),
).annotations({ identifier: "DevEndpoint" }) as any as S.Schema<DevEndpoint>;
export interface GetDevEndpointResponse {
  DevEndpoint?: DevEndpoint;
}
export const GetDevEndpointResponse = S.suspend(() =>
  S.Struct({ DevEndpoint: S.optional(DevEndpoint) }),
).annotations({
  identifier: "GetDevEndpointResponse",
}) as any as S.Schema<GetDevEndpointResponse>;
export type DevEndpointList = DevEndpoint[];
export const DevEndpointList = S.Array(DevEndpoint);
export interface GetDevEndpointsResponse {
  DevEndpoints?: DevEndpoint[];
  NextToken?: string;
}
export const GetDevEndpointsResponse = S.suspend(() =>
  S.Struct({
    DevEndpoints: S.optional(DevEndpointList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetDevEndpointsResponse",
}) as any as S.Schema<GetDevEndpointsResponse>;
export interface GetEntityRecordsRequest {
  ConnectionName?: string;
  CatalogId?: string;
  EntityName: string;
  NextToken?: string;
  DataStoreApiVersion?: string;
  ConnectionOptions?: { [key: string]: string | undefined };
  FilterPredicate?: string;
  Limit: number;
  OrderBy?: string;
  SelectedFields?: string[];
}
export const GetEntityRecordsRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEntityRecordsRequest",
}) as any as S.Schema<GetEntityRecordsRequest>;
export interface GetIntegrationResourcePropertyResponse {
  ResourceArn?: string;
  ResourcePropertyArn?: string;
  SourceProcessingProperties?: SourceProcessingProperties;
  TargetProcessingProperties?: TargetProcessingProperties;
}
export const GetIntegrationResourcePropertyResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    ResourcePropertyArn: S.optional(S.String),
    SourceProcessingProperties: S.optional(SourceProcessingProperties),
    TargetProcessingProperties: S.optional(TargetProcessingProperties),
  }),
).annotations({
  identifier: "GetIntegrationResourcePropertyResponse",
}) as any as S.Schema<GetIntegrationResourcePropertyResponse>;
export interface GetIntegrationTablePropertiesResponse {
  ResourceArn?: string;
  TableName?: string;
  SourceTableConfig?: SourceTableConfig;
  TargetTableConfig?: TargetTableConfig;
}
export const GetIntegrationTablePropertiesResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    TableName: S.optional(S.String),
    SourceTableConfig: S.optional(SourceTableConfig),
    TargetTableConfig: S.optional(TargetTableConfig),
  }),
).annotations({
  identifier: "GetIntegrationTablePropertiesResponse",
}) as any as S.Schema<GetIntegrationTablePropertiesResponse>;
export interface Job {
  Name?: string;
  JobMode?: JobMode;
  JobRunQueuingEnabled?: boolean;
  Description?: string;
  LogUri?: string;
  Role?: string;
  CreatedOn?: Date;
  LastModifiedOn?: Date;
  ExecutionProperty?: ExecutionProperty;
  Command?: JobCommand;
  DefaultArguments?: { [key: string]: string | undefined };
  NonOverridableArguments?: { [key: string]: string | undefined };
  Connections?: ConnectionsList;
  MaxRetries?: number;
  AllocatedCapacity?: number;
  Timeout?: number;
  MaxCapacity?: number;
  WorkerType?: WorkerType;
  NumberOfWorkers?: number;
  SecurityConfiguration?: string;
  NotificationProperty?: NotificationProperty;
  GlueVersion?: string;
  CodeGenConfigurationNodes?: {
    [key: string]: CodeGenConfigurationNode | undefined;
  };
  ExecutionClass?: ExecutionClass;
  SourceControlDetails?: SourceControlDetails;
  MaintenanceWindow?: string;
  ProfileName?: string;
}
export const Job = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    JobMode: S.optional(JobMode),
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
    WorkerType: S.optional(WorkerType),
    NumberOfWorkers: S.optional(S.Number),
    SecurityConfiguration: S.optional(S.String),
    NotificationProperty: S.optional(NotificationProperty),
    GlueVersion: S.optional(S.String),
    CodeGenConfigurationNodes: S.optional(CodeGenConfigurationNodes),
    ExecutionClass: S.optional(ExecutionClass),
    SourceControlDetails: S.optional(SourceControlDetails),
    MaintenanceWindow: S.optional(S.String),
    ProfileName: S.optional(S.String),
  }),
).annotations({ identifier: "Job" }) as any as S.Schema<Job>;
export interface GetJobResponse {
  Job?: Job;
}
export const GetJobResponse = S.suspend(() =>
  S.Struct({ Job: S.optional(Job) }),
).annotations({
  identifier: "GetJobResponse",
}) as any as S.Schema<GetJobResponse>;
export interface GetJobRunsResponse {
  JobRuns?: JobRun[];
  NextToken?: string;
}
export const GetJobRunsResponse = S.suspend(() =>
  S.Struct({
    JobRuns: S.optional(JobRunList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetJobRunsResponse",
}) as any as S.Schema<GetJobRunsResponse>;
export type JobList = Job[];
export const JobList = S.Array(Job);
export interface GetJobsResponse {
  Jobs?: Job[];
  NextToken?: string;
}
export const GetJobsResponse = S.suspend(() =>
  S.Struct({ Jobs: S.optional(JobList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "GetJobsResponse",
}) as any as S.Schema<GetJobsResponse>;
export interface GetMappingRequest {
  Source: CatalogEntry;
  Sinks?: CatalogEntry[];
  Location?: Location;
}
export const GetMappingRequest = S.suspend(() =>
  S.Struct({
    Source: CatalogEntry,
    Sinks: S.optional(CatalogEntries),
    Location: S.optional(Location),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetMappingRequest",
}) as any as S.Schema<GetMappingRequest>;
export interface GetMLTaskRunsRequest {
  TransformId: string;
  NextToken?: string;
  MaxResults?: number;
  Filter?: TaskRunFilterCriteria;
  Sort?: TaskRunSortCriteria;
}
export const GetMLTaskRunsRequest = S.suspend(() =>
  S.Struct({
    TransformId: S.String,
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filter: S.optional(TaskRunFilterCriteria),
    Sort: S.optional(TaskRunSortCriteria),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetMLTaskRunsRequest",
}) as any as S.Schema<GetMLTaskRunsRequest>;
export interface Partition {
  Values?: string[];
  DatabaseName?: string;
  TableName?: string;
  CreationTime?: Date;
  LastAccessTime?: Date;
  StorageDescriptor?: StorageDescriptor;
  Parameters?: { [key: string]: string | undefined };
  LastAnalyzedTime?: Date;
  CatalogId?: string;
}
export const Partition = S.suspend(() =>
  S.Struct({
    Values: S.optional(ValueStringList),
    DatabaseName: S.optional(S.String),
    TableName: S.optional(S.String),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastAccessTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    StorageDescriptor: S.optional(StorageDescriptor),
    Parameters: S.optional(ParametersMap),
    LastAnalyzedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    CatalogId: S.optional(S.String),
  }),
).annotations({ identifier: "Partition" }) as any as S.Schema<Partition>;
export interface GetPartitionResponse {
  Partition?: Partition;
}
export const GetPartitionResponse = S.suspend(() =>
  S.Struct({ Partition: S.optional(Partition) }),
).annotations({
  identifier: "GetPartitionResponse",
}) as any as S.Schema<GetPartitionResponse>;
export interface GetPartitionsRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  Expression?: string;
  NextToken?: string;
  Segment?: Segment;
  MaxResults?: number;
  ExcludeColumnSchema?: boolean;
  TransactionId?: string;
  QueryAsOfTime?: Date;
}
export const GetPartitionsRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPartitionsRequest",
}) as any as S.Schema<GetPartitionsRequest>;
export interface GetPlanRequest {
  Mapping: MappingEntry[];
  Source: CatalogEntry;
  Sinks?: CatalogEntry[];
  Location?: Location;
  Language?: Language;
  AdditionalPlanOptionsMap?: { [key: string]: string | undefined };
}
export const GetPlanRequest = S.suspend(() =>
  S.Struct({
    Mapping: MappingList,
    Source: CatalogEntry,
    Sinks: S.optional(CatalogEntries),
    Location: S.optional(Location),
    Language: S.optional(Language),
    AdditionalPlanOptionsMap: S.optional(AdditionalPlanOptionsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetPlanRequest",
}) as any as S.Schema<GetPlanRequest>;
export interface GetRegistryResponse {
  RegistryName?: string;
  RegistryArn?: string;
  Description?: string;
  Status?: RegistryStatus;
  CreatedTime?: string;
  UpdatedTime?: string;
}
export const GetRegistryResponse = S.suspend(() =>
  S.Struct({
    RegistryName: S.optional(S.String),
    RegistryArn: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(RegistryStatus),
    CreatedTime: S.optional(S.String),
    UpdatedTime: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRegistryResponse",
}) as any as S.Schema<GetRegistryResponse>;
export interface GetResourcePolicyResponse {
  PolicyInJson?: string;
  PolicyHash?: string;
  CreateTime?: Date;
  UpdateTime?: Date;
}
export const GetResourcePolicyResponse = S.suspend(() =>
  S.Struct({
    PolicyInJson: S.optional(S.String),
    PolicyHash: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetResourcePolicyResponse",
}) as any as S.Schema<GetResourcePolicyResponse>;
export interface GetSchemaResponse {
  RegistryName?: string;
  RegistryArn?: string;
  SchemaName?: string;
  SchemaArn?: string;
  Description?: string;
  DataFormat?: DataFormat;
  Compatibility?: Compatibility;
  SchemaCheckpoint?: number;
  LatestSchemaVersion?: number;
  NextSchemaVersion?: number;
  SchemaStatus?: SchemaStatus;
  CreatedTime?: string;
  UpdatedTime?: string;
}
export const GetSchemaResponse = S.suspend(() =>
  S.Struct({
    RegistryName: S.optional(S.String),
    RegistryArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    SchemaArn: S.optional(S.String),
    Description: S.optional(S.String),
    DataFormat: S.optional(DataFormat),
    Compatibility: S.optional(Compatibility),
    SchemaCheckpoint: S.optional(S.Number),
    LatestSchemaVersion: S.optional(S.Number),
    NextSchemaVersion: S.optional(S.Number),
    SchemaStatus: S.optional(SchemaStatus),
    CreatedTime: S.optional(S.String),
    UpdatedTime: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSchemaResponse",
}) as any as S.Schema<GetSchemaResponse>;
export interface GetSchemaByDefinitionResponse {
  SchemaVersionId?: string;
  SchemaArn?: string;
  DataFormat?: DataFormat;
  Status?: SchemaVersionStatus;
  CreatedTime?: string;
}
export const GetSchemaByDefinitionResponse = S.suspend(() =>
  S.Struct({
    SchemaVersionId: S.optional(S.String),
    SchemaArn: S.optional(S.String),
    DataFormat: S.optional(DataFormat),
    Status: S.optional(SchemaVersionStatus),
    CreatedTime: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSchemaByDefinitionResponse",
}) as any as S.Schema<GetSchemaByDefinitionResponse>;
export interface GetSchemaVersionInput {
  SchemaId?: SchemaId;
  SchemaVersionId?: string;
  SchemaVersionNumber?: SchemaVersionNumber;
}
export const GetSchemaVersionInput = S.suspend(() =>
  S.Struct({
    SchemaId: S.optional(SchemaId),
    SchemaVersionId: S.optional(S.String),
    SchemaVersionNumber: S.optional(SchemaVersionNumber),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetSchemaVersionInput",
}) as any as S.Schema<GetSchemaVersionInput>;
export interface GetSchemaVersionsDiffResponse {
  Diff?: string;
}
export const GetSchemaVersionsDiffResponse = S.suspend(() =>
  S.Struct({ Diff: S.optional(S.String) }),
).annotations({
  identifier: "GetSchemaVersionsDiffResponse",
}) as any as S.Schema<GetSchemaVersionsDiffResponse>;
export interface GetSecurityConfigurationsResponse {
  SecurityConfigurations?: SecurityConfiguration[];
  NextToken?: string;
}
export const GetSecurityConfigurationsResponse = S.suspend(() =>
  S.Struct({
    SecurityConfigurations: S.optional(SecurityConfigurationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSecurityConfigurationsResponse",
}) as any as S.Schema<GetSecurityConfigurationsResponse>;
export interface GetTableRequest {
  CatalogId?: string;
  DatabaseName: string;
  Name: string;
  TransactionId?: string;
  QueryAsOfTime?: Date;
  AuditContext?: AuditContext;
  IncludeStatusDetails?: boolean;
}
export const GetTableRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    Name: S.String,
    TransactionId: S.optional(S.String),
    QueryAsOfTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    AuditContext: S.optional(AuditContext),
    IncludeStatusDetails: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetTableRequest",
}) as any as S.Schema<GetTableRequest>;
export interface GetTableVersionsResponse {
  TableVersions?: TableVersion[];
  NextToken?: string;
}
export const GetTableVersionsResponse = S.suspend(() =>
  S.Struct({
    TableVersions: S.optional(GetTableVersionsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTableVersionsResponse",
}) as any as S.Schema<GetTableVersionsResponse>;
export interface GetTagsResponse {
  Tags?: { [key: string]: string | undefined };
}
export const GetTagsResponse = S.suspend(() =>
  S.Struct({ Tags: S.optional(TagsMap) }),
).annotations({
  identifier: "GetTagsResponse",
}) as any as S.Schema<GetTagsResponse>;
export interface GetTriggerResponse {
  Trigger?: Trigger;
}
export const GetTriggerResponse = S.suspend(() =>
  S.Struct({ Trigger: S.optional(Trigger) }),
).annotations({
  identifier: "GetTriggerResponse",
}) as any as S.Schema<GetTriggerResponse>;
export type TriggerList = Trigger[];
export const TriggerList = S.Array(Trigger);
export interface GetTriggersResponse {
  Triggers?: Trigger[];
  NextToken?: string;
}
export const GetTriggersResponse = S.suspend(() =>
  S.Struct({
    Triggers: S.optional(TriggerList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTriggersResponse",
}) as any as S.Schema<GetTriggersResponse>;
export interface GetUnfilteredTableMetadataRequest {
  Region?: string;
  CatalogId: string;
  DatabaseName: string;
  Name: string;
  AuditContext?: AuditContext;
  SupportedPermissionTypes: PermissionType[];
  ParentResourceArn?: string;
  RootResourceArn?: string;
  SupportedDialect?: SupportedDialect;
  Permissions?: Permission[];
  QuerySessionContext?: QuerySessionContext;
}
export const GetUnfilteredTableMetadataRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetUnfilteredTableMetadataRequest",
}) as any as S.Schema<GetUnfilteredTableMetadataRequest>;
export interface GetUsageProfileResponse {
  Name?: string;
  Description?: string;
  Configuration?: ProfileConfiguration;
  CreatedOn?: Date;
  LastModifiedOn?: Date;
}
export const GetUsageProfileResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Configuration: S.optional(ProfileConfiguration),
    CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "GetUsageProfileResponse",
}) as any as S.Schema<GetUsageProfileResponse>;
export interface GetUserDefinedFunctionsResponse {
  UserDefinedFunctions?: UserDefinedFunction[];
  NextToken?: string;
}
export const GetUserDefinedFunctionsResponse = S.suspend(() =>
  S.Struct({
    UserDefinedFunctions: S.optional(UserDefinedFunctionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetUserDefinedFunctionsResponse",
}) as any as S.Schema<GetUserDefinedFunctionsResponse>;
export interface BlueprintDetails {
  BlueprintName?: string;
  RunId?: string;
}
export const BlueprintDetails = S.suspend(() =>
  S.Struct({
    BlueprintName: S.optional(S.String),
    RunId: S.optional(S.String),
  }),
).annotations({
  identifier: "BlueprintDetails",
}) as any as S.Schema<BlueprintDetails>;
export interface Workflow {
  Name?: string;
  Description?: string;
  DefaultRunProperties?: { [key: string]: string | undefined };
  CreatedOn?: Date;
  LastModifiedOn?: Date;
  LastRun?: WorkflowRun;
  Graph?: WorkflowGraph;
  MaxConcurrentRuns?: number;
  BlueprintDetails?: BlueprintDetails;
}
export const Workflow = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    DefaultRunProperties: S.optional(WorkflowRunProperties),
    CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastRun: S.optional(WorkflowRun),
    Graph: S.optional(WorkflowGraph),
    MaxConcurrentRuns: S.optional(S.Number),
    BlueprintDetails: S.optional(BlueprintDetails),
  }),
).annotations({ identifier: "Workflow" }) as any as S.Schema<Workflow>;
export interface GetWorkflowResponse {
  Workflow?: Workflow;
}
export const GetWorkflowResponse = S.suspend(() =>
  S.Struct({ Workflow: S.optional(Workflow) }),
).annotations({
  identifier: "GetWorkflowResponse",
}) as any as S.Schema<GetWorkflowResponse>;
export interface GetWorkflowRunPropertiesResponse {
  RunProperties?: { [key: string]: string | undefined };
}
export const GetWorkflowRunPropertiesResponse = S.suspend(() =>
  S.Struct({ RunProperties: S.optional(WorkflowRunProperties) }),
).annotations({
  identifier: "GetWorkflowRunPropertiesResponse",
}) as any as S.Schema<GetWorkflowRunPropertiesResponse>;
export interface GetWorkflowRunsResponse {
  Runs?: WorkflowRun[];
  NextToken?: string;
}
export const GetWorkflowRunsResponse = S.suspend(() =>
  S.Struct({ Runs: S.optional(WorkflowRuns), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "GetWorkflowRunsResponse",
}) as any as S.Schema<GetWorkflowRunsResponse>;
export interface ListBlueprintsResponse {
  Blueprints?: string[];
  NextToken?: string;
}
export const ListBlueprintsResponse = S.suspend(() =>
  S.Struct({
    Blueprints: S.optional(BlueprintNames),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListBlueprintsResponse",
}) as any as S.Schema<ListBlueprintsResponse>;
export interface ListColumnStatisticsTaskRunsResponse {
  ColumnStatisticsTaskRunIds?: string[];
  NextToken?: string;
}
export const ListColumnStatisticsTaskRunsResponse = S.suspend(() =>
  S.Struct({
    ColumnStatisticsTaskRunIds: S.optional(ColumnStatisticsTaskRunIdList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListColumnStatisticsTaskRunsResponse",
}) as any as S.Schema<ListColumnStatisticsTaskRunsResponse>;
export interface ListCrawlersResponse {
  CrawlerNames?: string[];
  NextToken?: string;
}
export const ListCrawlersResponse = S.suspend(() =>
  S.Struct({
    CrawlerNames: S.optional(CrawlerNameList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCrawlersResponse",
}) as any as S.Schema<ListCrawlersResponse>;
export interface ListCrawlsRequest {
  CrawlerName: string;
  MaxResults?: number;
  Filters?: CrawlsFilter[];
  NextToken?: string;
}
export const ListCrawlsRequest = S.suspend(() =>
  S.Struct({
    CrawlerName: S.String,
    MaxResults: S.optional(S.Number),
    Filters: S.optional(CrawlsFilterList),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListCrawlsRequest",
}) as any as S.Schema<ListCrawlsRequest>;
export interface CustomEntityType {
  Name: string;
  RegexString: string;
  ContextWords?: string[];
}
export const CustomEntityType = S.suspend(() =>
  S.Struct({
    Name: S.String,
    RegexString: S.String,
    ContextWords: S.optional(ContextWords),
  }),
).annotations({
  identifier: "CustomEntityType",
}) as any as S.Schema<CustomEntityType>;
export type CustomEntityTypes = CustomEntityType[];
export const CustomEntityTypes = S.Array(CustomEntityType);
export interface ListCustomEntityTypesResponse {
  CustomEntityTypes?: CustomEntityType[];
  NextToken?: string;
}
export const ListCustomEntityTypesResponse = S.suspend(() =>
  S.Struct({
    CustomEntityTypes: S.optional(CustomEntityTypes),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCustomEntityTypesResponse",
}) as any as S.Schema<ListCustomEntityTypesResponse>;
export interface ListDataQualityResultsRequest {
  Filter?: DataQualityResultFilterCriteria;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDataQualityResultsRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(DataQualityResultFilterCriteria),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDataQualityResultsRequest",
}) as any as S.Schema<ListDataQualityResultsRequest>;
export interface ListDataQualityRuleRecommendationRunsRequest {
  Filter?: DataQualityRuleRecommendationRunFilter;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDataQualityRuleRecommendationRunsRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(DataQualityRuleRecommendationRunFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDataQualityRuleRecommendationRunsRequest",
}) as any as S.Schema<ListDataQualityRuleRecommendationRunsRequest>;
export interface ListDataQualityRulesetEvaluationRunsRequest {
  Filter?: DataQualityRulesetEvaluationRunFilter;
  NextToken?: string;
  MaxResults?: number;
}
export const ListDataQualityRulesetEvaluationRunsRequest = S.suspend(() =>
  S.Struct({
    Filter: S.optional(DataQualityRulesetEvaluationRunFilter),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDataQualityRulesetEvaluationRunsRequest",
}) as any as S.Schema<ListDataQualityRulesetEvaluationRunsRequest>;
export interface ListDataQualityRulesetsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filter?: DataQualityRulesetFilterCriteria;
  Tags?: { [key: string]: string | undefined };
}
export const ListDataQualityRulesetsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filter: S.optional(DataQualityRulesetFilterCriteria),
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDataQualityRulesetsRequest",
}) as any as S.Schema<ListDataQualityRulesetsRequest>;
export interface ListDataQualityStatisticAnnotationsRequest {
  StatisticId?: string;
  ProfileId?: string;
  TimestampFilter?: TimestampFilter;
  MaxResults?: number;
  NextToken?: string;
}
export const ListDataQualityStatisticAnnotationsRequest = S.suspend(() =>
  S.Struct({
    StatisticId: S.optional(S.String),
    ProfileId: S.optional(S.String),
    TimestampFilter: S.optional(TimestampFilter),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListDataQualityStatisticAnnotationsRequest",
}) as any as S.Schema<ListDataQualityStatisticAnnotationsRequest>;
export interface ListDevEndpointsResponse {
  DevEndpointNames?: string[];
  NextToken?: string;
}
export const ListDevEndpointsResponse = S.suspend(() =>
  S.Struct({
    DevEndpointNames: S.optional(DevEndpointNameList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDevEndpointsResponse",
}) as any as S.Schema<ListDevEndpointsResponse>;
export interface ListIntegrationResourcePropertiesRequest {
  Marker?: string;
  Filters?: IntegrationResourcePropertyFilter[];
  MaxRecords?: number;
}
export const ListIntegrationResourcePropertiesRequest = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    Filters: S.optional(IntegrationResourcePropertyFilterList),
    MaxRecords: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListIntegrationResourcePropertiesRequest",
}) as any as S.Schema<ListIntegrationResourcePropertiesRequest>;
export interface ListJobsResponse {
  JobNames?: string[];
  NextToken?: string;
}
export const ListJobsResponse = S.suspend(() =>
  S.Struct({
    JobNames: S.optional(JobNameList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListJobsResponse",
}) as any as S.Schema<ListJobsResponse>;
export interface ListMaterializedViewRefreshTaskRunsResponse {
  MaterializedViewRefreshTaskRuns?: MaterializedViewRefreshTaskRun[];
  NextToken?: string;
}
export const ListMaterializedViewRefreshTaskRunsResponse = S.suspend(() =>
  S.Struct({
    MaterializedViewRefreshTaskRuns: S.optional(
      MaterializedViewRefreshTaskRunsList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListMaterializedViewRefreshTaskRunsResponse",
}) as any as S.Schema<ListMaterializedViewRefreshTaskRunsResponse>;
export interface ListMLTransformsResponse {
  TransformIds: string[];
  NextToken?: string;
}
export const ListMLTransformsResponse = S.suspend(() =>
  S.Struct({ TransformIds: TransformIdList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListMLTransformsResponse",
}) as any as S.Schema<ListMLTransformsResponse>;
export interface ListSessionsResponse {
  Ids?: string[];
  Sessions?: Session[];
  NextToken?: string;
}
export const ListSessionsResponse = S.suspend(() =>
  S.Struct({
    Ids: S.optional(SessionIdList),
    Sessions: S.optional(SessionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSessionsResponse",
}) as any as S.Schema<ListSessionsResponse>;
export interface ListStatementsResponse {
  Statements?: Statement[];
  NextToken?: string;
}
export const ListStatementsResponse = S.suspend(() =>
  S.Struct({
    Statements: S.optional(StatementList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListStatementsResponse",
}) as any as S.Schema<ListStatementsResponse>;
export interface ListTriggersResponse {
  TriggerNames?: string[];
  NextToken?: string;
}
export const ListTriggersResponse = S.suspend(() =>
  S.Struct({
    TriggerNames: S.optional(TriggerNameList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTriggersResponse",
}) as any as S.Schema<ListTriggersResponse>;
export interface ListWorkflowsResponse {
  Workflows?: string[];
  NextToken?: string;
}
export const ListWorkflowsResponse = S.suspend(() =>
  S.Struct({
    Workflows: S.optional(WorkflowNames),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListWorkflowsResponse",
}) as any as S.Schema<ListWorkflowsResponse>;
export interface IntegrationError {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const IntegrationError = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "IntegrationError",
}) as any as S.Schema<IntegrationError>;
export type IntegrationErrorList = IntegrationError[];
export const IntegrationErrorList = S.Array(IntegrationError);
export interface ModifyIntegrationResponse {
  SourceArn: string;
  TargetArn: string;
  IntegrationName: string;
  Description?: string;
  IntegrationArn: string;
  KmsKeyId?: string;
  AdditionalEncryptionContext?: { [key: string]: string | undefined };
  Tags?: Tag[];
  Status: IntegrationStatus;
  CreateTime: Date;
  Errors?: IntegrationError[];
  DataFilter?: string;
  IntegrationConfig?: IntegrationConfig;
}
export const ModifyIntegrationResponse = S.suspend(() =>
  S.Struct({
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
    Status: IntegrationStatus,
    CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Errors: S.optional(IntegrationErrorList),
    DataFilter: S.optional(S.String),
    IntegrationConfig: S.optional(IntegrationConfig),
  }),
).annotations({
  identifier: "ModifyIntegrationResponse",
}) as any as S.Schema<ModifyIntegrationResponse>;
export interface PutResourcePolicyResponse {
  PolicyHash?: string;
}
export const PutResourcePolicyResponse = S.suspend(() =>
  S.Struct({ PolicyHash: S.optional(S.String) }),
).annotations({
  identifier: "PutResourcePolicyResponse",
}) as any as S.Schema<PutResourcePolicyResponse>;
export interface PutSchemaVersionMetadataInput {
  SchemaId?: SchemaId;
  SchemaVersionNumber?: SchemaVersionNumber;
  SchemaVersionId?: string;
  MetadataKeyValue: MetadataKeyValuePair;
}
export const PutSchemaVersionMetadataInput = S.suspend(() =>
  S.Struct({
    SchemaId: S.optional(SchemaId),
    SchemaVersionNumber: S.optional(SchemaVersionNumber),
    SchemaVersionId: S.optional(S.String),
    MetadataKeyValue: MetadataKeyValuePair,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutSchemaVersionMetadataInput",
}) as any as S.Schema<PutSchemaVersionMetadataInput>;
export interface RegisterSchemaVersionResponse {
  SchemaVersionId?: string;
  VersionNumber?: number;
  Status?: SchemaVersionStatus;
}
export const RegisterSchemaVersionResponse = S.suspend(() =>
  S.Struct({
    SchemaVersionId: S.optional(S.String),
    VersionNumber: S.optional(S.Number),
    Status: S.optional(SchemaVersionStatus),
  }),
).annotations({
  identifier: "RegisterSchemaVersionResponse",
}) as any as S.Schema<RegisterSchemaVersionResponse>;
export interface RemoveSchemaVersionMetadataResponse {
  SchemaArn?: string;
  SchemaName?: string;
  RegistryName?: string;
  LatestVersion?: boolean;
  VersionNumber?: number;
  SchemaVersionId?: string;
  MetadataKey?: string;
  MetadataValue?: string;
}
export const RemoveSchemaVersionMetadataResponse = S.suspend(() =>
  S.Struct({
    SchemaArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    RegistryName: S.optional(S.String),
    LatestVersion: S.optional(S.Boolean),
    VersionNumber: S.optional(S.Number),
    SchemaVersionId: S.optional(S.String),
    MetadataKey: S.optional(S.String),
    MetadataValue: S.optional(S.String),
  }),
).annotations({
  identifier: "RemoveSchemaVersionMetadataResponse",
}) as any as S.Schema<RemoveSchemaVersionMetadataResponse>;
export interface JobBookmarkEntry {
  JobName?: string;
  Version?: number;
  Run?: number;
  Attempt?: number;
  PreviousRunId?: string;
  RunId?: string;
  JobBookmark?: string;
}
export const JobBookmarkEntry = S.suspend(() =>
  S.Struct({
    JobName: S.optional(S.String),
    Version: S.optional(S.Number),
    Run: S.optional(S.Number),
    Attempt: S.optional(S.Number),
    PreviousRunId: S.optional(S.String),
    RunId: S.optional(S.String),
    JobBookmark: S.optional(S.String),
  }),
).annotations({
  identifier: "JobBookmarkEntry",
}) as any as S.Schema<JobBookmarkEntry>;
export interface ResetJobBookmarkResponse {
  JobBookmarkEntry?: JobBookmarkEntry;
}
export const ResetJobBookmarkResponse = S.suspend(() =>
  S.Struct({ JobBookmarkEntry: S.optional(JobBookmarkEntry) }),
).annotations({
  identifier: "ResetJobBookmarkResponse",
}) as any as S.Schema<ResetJobBookmarkResponse>;
export interface ResumeWorkflowRunResponse {
  RunId?: string;
  NodeIds?: string[];
}
export const ResumeWorkflowRunResponse = S.suspend(() =>
  S.Struct({ RunId: S.optional(S.String), NodeIds: S.optional(NodeIdList) }),
).annotations({
  identifier: "ResumeWorkflowRunResponse",
}) as any as S.Schema<ResumeWorkflowRunResponse>;
export interface RunStatementResponse {
  Id?: number;
}
export const RunStatementResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.Number) }),
).annotations({
  identifier: "RunStatementResponse",
}) as any as S.Schema<RunStatementResponse>;
export interface SearchTablesRequest {
  CatalogId?: string;
  NextToken?: string;
  Filters?: PropertyPredicate[];
  SearchText?: string;
  SortCriteria?: SortCriterion[];
  MaxResults?: number;
  ResourceShareType?: ResourceShareType;
  IncludeStatusDetails?: boolean;
}
export const SearchTablesRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    NextToken: S.optional(S.String),
    Filters: S.optional(SearchPropertyPredicates),
    SearchText: S.optional(S.String),
    SortCriteria: S.optional(SortCriteria),
    MaxResults: S.optional(S.Number),
    ResourceShareType: S.optional(ResourceShareType),
    IncludeStatusDetails: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "SearchTablesRequest",
}) as any as S.Schema<SearchTablesRequest>;
export interface StartBlueprintRunResponse {
  RunId?: string;
}
export const StartBlueprintRunResponse = S.suspend(() =>
  S.Struct({ RunId: S.optional(S.String) }),
).annotations({
  identifier: "StartBlueprintRunResponse",
}) as any as S.Schema<StartBlueprintRunResponse>;
export interface StartColumnStatisticsTaskRunResponse {
  ColumnStatisticsTaskRunId?: string;
}
export const StartColumnStatisticsTaskRunResponse = S.suspend(() =>
  S.Struct({ ColumnStatisticsTaskRunId: S.optional(S.String) }),
).annotations({
  identifier: "StartColumnStatisticsTaskRunResponse",
}) as any as S.Schema<StartColumnStatisticsTaskRunResponse>;
export interface StartDataQualityRulesetEvaluationRunRequest {
  DataSource: DataSource;
  Role: string;
  NumberOfWorkers?: number;
  Timeout?: number;
  ClientToken?: string;
  AdditionalRunOptions?: DataQualityEvaluationRunAdditionalRunOptions;
  RulesetNames: string[];
  AdditionalDataSources?: { [key: string]: DataSource | undefined };
}
export const StartDataQualityRulesetEvaluationRunRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartDataQualityRulesetEvaluationRunRequest",
}) as any as S.Schema<StartDataQualityRulesetEvaluationRunRequest>;
export interface StartExportLabelsTaskRunResponse {
  TaskRunId?: string;
}
export const StartExportLabelsTaskRunResponse = S.suspend(() =>
  S.Struct({ TaskRunId: S.optional(S.String) }),
).annotations({
  identifier: "StartExportLabelsTaskRunResponse",
}) as any as S.Schema<StartExportLabelsTaskRunResponse>;
export interface StartImportLabelsTaskRunResponse {
  TaskRunId?: string;
}
export const StartImportLabelsTaskRunResponse = S.suspend(() =>
  S.Struct({ TaskRunId: S.optional(S.String) }),
).annotations({
  identifier: "StartImportLabelsTaskRunResponse",
}) as any as S.Schema<StartImportLabelsTaskRunResponse>;
export interface StartJobRunResponse {
  JobRunId?: string;
}
export const StartJobRunResponse = S.suspend(() =>
  S.Struct({ JobRunId: S.optional(S.String) }),
).annotations({
  identifier: "StartJobRunResponse",
}) as any as S.Schema<StartJobRunResponse>;
export interface StartMaterializedViewRefreshTaskRunResponse {
  MaterializedViewRefreshTaskRunId?: string;
}
export const StartMaterializedViewRefreshTaskRunResponse = S.suspend(() =>
  S.Struct({ MaterializedViewRefreshTaskRunId: S.optional(S.String) }),
).annotations({
  identifier: "StartMaterializedViewRefreshTaskRunResponse",
}) as any as S.Schema<StartMaterializedViewRefreshTaskRunResponse>;
export interface StartMLEvaluationTaskRunResponse {
  TaskRunId?: string;
}
export const StartMLEvaluationTaskRunResponse = S.suspend(() =>
  S.Struct({ TaskRunId: S.optional(S.String) }),
).annotations({
  identifier: "StartMLEvaluationTaskRunResponse",
}) as any as S.Schema<StartMLEvaluationTaskRunResponse>;
export interface StartMLLabelingSetGenerationTaskRunResponse {
  TaskRunId?: string;
}
export const StartMLLabelingSetGenerationTaskRunResponse = S.suspend(() =>
  S.Struct({ TaskRunId: S.optional(S.String) }),
).annotations({
  identifier: "StartMLLabelingSetGenerationTaskRunResponse",
}) as any as S.Schema<StartMLLabelingSetGenerationTaskRunResponse>;
export interface StartTriggerResponse {
  Name?: string;
}
export const StartTriggerResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "StartTriggerResponse",
}) as any as S.Schema<StartTriggerResponse>;
export interface StartWorkflowRunResponse {
  RunId?: string;
}
export const StartWorkflowRunResponse = S.suspend(() =>
  S.Struct({ RunId: S.optional(S.String) }),
).annotations({
  identifier: "StartWorkflowRunResponse",
}) as any as S.Schema<StartWorkflowRunResponse>;
export interface StopSessionResponse {
  Id?: string;
}
export const StopSessionResponse = S.suspend(() =>
  S.Struct({ Id: S.optional(S.String) }),
).annotations({
  identifier: "StopSessionResponse",
}) as any as S.Schema<StopSessionResponse>;
export interface StopTriggerResponse {
  Name?: string;
}
export const StopTriggerResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "StopTriggerResponse",
}) as any as S.Schema<StopTriggerResponse>;
export interface TestConnectionRequest {
  ConnectionName?: string;
  CatalogId?: string;
  TestConnectionInput?: TestConnectionInput;
}
export const TestConnectionRequest = S.suspend(() =>
  S.Struct({
    ConnectionName: S.optional(S.String),
    CatalogId: S.optional(S.String),
    TestConnectionInput: S.optional(TestConnectionInput),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TestConnectionRequest",
}) as any as S.Schema<TestConnectionRequest>;
export interface TestConnectionResponse {}
export const TestConnectionResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "TestConnectionResponse" },
) as any as S.Schema<TestConnectionResponse>;
export interface UpdateBlueprintResponse {
  Name?: string;
}
export const UpdateBlueprintResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "UpdateBlueprintResponse",
}) as any as S.Schema<UpdateBlueprintResponse>;
export interface UpdateClassifierRequest {
  GrokClassifier?: UpdateGrokClassifierRequest;
  XMLClassifier?: UpdateXMLClassifierRequest;
  JsonClassifier?: UpdateJsonClassifierRequest;
  CsvClassifier?: UpdateCsvClassifierRequest;
}
export const UpdateClassifierRequest = S.suspend(() =>
  S.Struct({
    GrokClassifier: S.optional(UpdateGrokClassifierRequest),
    XMLClassifier: S.optional(UpdateXMLClassifierRequest),
    JsonClassifier: S.optional(UpdateJsonClassifierRequest),
    CsvClassifier: S.optional(UpdateCsvClassifierRequest),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateClassifierRequest",
}) as any as S.Schema<UpdateClassifierRequest>;
export interface UpdateClassifierResponse {}
export const UpdateClassifierResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateClassifierResponse",
}) as any as S.Schema<UpdateClassifierResponse>;
export interface UpdateDataQualityRulesetResponse {
  Name?: string;
  Description?: string;
  Ruleset?: string;
}
export const UpdateDataQualityRulesetResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Ruleset: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateDataQualityRulesetResponse",
}) as any as S.Schema<UpdateDataQualityRulesetResponse>;
export interface UpdateDevEndpointRequest {
  EndpointName: string;
  PublicKey?: string;
  AddPublicKeys?: string[];
  DeletePublicKeys?: string[];
  CustomLibraries?: DevEndpointCustomLibraries;
  UpdateEtlLibraries?: boolean;
  DeleteArguments?: string[];
  AddArguments?: { [key: string]: string | undefined };
}
export const UpdateDevEndpointRequest = S.suspend(() =>
  S.Struct({
    EndpointName: S.String,
    PublicKey: S.optional(S.String),
    AddPublicKeys: S.optional(PublicKeysList),
    DeletePublicKeys: S.optional(PublicKeysList),
    CustomLibraries: S.optional(DevEndpointCustomLibraries),
    UpdateEtlLibraries: S.optional(S.Boolean),
    DeleteArguments: S.optional(StringList),
    AddArguments: S.optional(MapValue),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateDevEndpointRequest",
}) as any as S.Schema<UpdateDevEndpointRequest>;
export interface UpdateDevEndpointResponse {}
export const UpdateDevEndpointResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateDevEndpointResponse",
}) as any as S.Schema<UpdateDevEndpointResponse>;
export interface UpdateIntegrationResourcePropertyResponse {
  ResourceArn?: string;
  ResourcePropertyArn?: string;
  SourceProcessingProperties?: SourceProcessingProperties;
  TargetProcessingProperties?: TargetProcessingProperties;
}
export const UpdateIntegrationResourcePropertyResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.optional(S.String),
    ResourcePropertyArn: S.optional(S.String),
    SourceProcessingProperties: S.optional(SourceProcessingProperties),
    TargetProcessingProperties: S.optional(TargetProcessingProperties),
  }),
).annotations({
  identifier: "UpdateIntegrationResourcePropertyResponse",
}) as any as S.Schema<UpdateIntegrationResourcePropertyResponse>;
export interface UpdateJobRequest {
  JobName: string;
  JobUpdate: JobUpdate;
}
export const UpdateJobRequest = S.suspend(() =>
  S.Struct({ JobName: S.String, JobUpdate: JobUpdate }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateJobRequest",
}) as any as S.Schema<UpdateJobRequest>;
export interface UpdateJobFromSourceControlResponse {
  JobName?: string;
}
export const UpdateJobFromSourceControlResponse = S.suspend(() =>
  S.Struct({ JobName: S.optional(S.String) }),
).annotations({
  identifier: "UpdateJobFromSourceControlResponse",
}) as any as S.Schema<UpdateJobFromSourceControlResponse>;
export interface UpdateMLTransformResponse {
  TransformId?: string;
}
export const UpdateMLTransformResponse = S.suspend(() =>
  S.Struct({ TransformId: S.optional(S.String) }),
).annotations({
  identifier: "UpdateMLTransformResponse",
}) as any as S.Schema<UpdateMLTransformResponse>;
export interface UpdateRegistryResponse {
  RegistryName?: string;
  RegistryArn?: string;
}
export const UpdateRegistryResponse = S.suspend(() =>
  S.Struct({
    RegistryName: S.optional(S.String),
    RegistryArn: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateRegistryResponse",
}) as any as S.Schema<UpdateRegistryResponse>;
export interface UpdateSchemaResponse {
  SchemaArn?: string;
  SchemaName?: string;
  RegistryName?: string;
}
export const UpdateSchemaResponse = S.suspend(() =>
  S.Struct({
    SchemaArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    RegistryName: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateSchemaResponse",
}) as any as S.Schema<UpdateSchemaResponse>;
export interface UpdateSourceControlFromJobResponse {
  JobName?: string;
}
export const UpdateSourceControlFromJobResponse = S.suspend(() =>
  S.Struct({ JobName: S.optional(S.String) }),
).annotations({
  identifier: "UpdateSourceControlFromJobResponse",
}) as any as S.Schema<UpdateSourceControlFromJobResponse>;
export interface UpdateTriggerRequest {
  Name: string;
  TriggerUpdate: TriggerUpdate;
}
export const UpdateTriggerRequest = S.suspend(() =>
  S.Struct({ Name: S.String, TriggerUpdate: TriggerUpdate }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateTriggerRequest",
}) as any as S.Schema<UpdateTriggerRequest>;
export interface UpdateUsageProfileResponse {
  Name?: string;
}
export const UpdateUsageProfileResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "UpdateUsageProfileResponse",
}) as any as S.Schema<UpdateUsageProfileResponse>;
export interface UpdateWorkflowResponse {
  Name?: string;
}
export const UpdateWorkflowResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "UpdateWorkflowResponse",
}) as any as S.Schema<UpdateWorkflowResponse>;
export interface MLUserDataEncryption {
  MlUserDataEncryptionMode: MLUserDataEncryptionModeString;
  KmsKeyId?: string;
}
export const MLUserDataEncryption = S.suspend(() =>
  S.Struct({
    MlUserDataEncryptionMode: MLUserDataEncryptionModeString,
    KmsKeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "MLUserDataEncryption",
}) as any as S.Schema<MLUserDataEncryption>;
export type AuthenticationTypes = AuthenticationType[];
export const AuthenticationTypes = S.Array(AuthenticationType);
export type DataOperation = "READ" | "WRITE" | (string & {});
export const DataOperation = S.String;
export type DataOperations = DataOperation[];
export const DataOperations = S.Array(DataOperation);
export type ComputeEnvironments = ComputeEnvironment[];
export const ComputeEnvironments = S.Array(ComputeEnvironment);
export type FieldDataType =
  | "INT"
  | "SMALLINT"
  | "BIGINT"
  | "FLOAT"
  | "LONG"
  | "DATE"
  | "BOOLEAN"
  | "MAP"
  | "ARRAY"
  | "STRING"
  | "TIMESTAMP"
  | "DECIMAL"
  | "BYTE"
  | "SHORT"
  | "DOUBLE"
  | "STRUCT"
  | (string & {});
export const FieldDataType = S.String;
export type ListOfString = string[];
export const ListOfString = S.Array(S.String);
export type FieldFilterOperator =
  | "LESS_THAN"
  | "GREATER_THAN"
  | "BETWEEN"
  | "EQUAL_TO"
  | "NOT_EQUAL_TO"
  | "GREATER_THAN_OR_EQUAL_TO"
  | "LESS_THAN_OR_EQUAL_TO"
  | "CONTAINS"
  | "ORDER_BY"
  | (string & {});
export const FieldFilterOperator = S.String;
export type FieldFilterOperatorsList = FieldFilterOperator[];
export const FieldFilterOperatorsList = S.Array(FieldFilterOperator);
export type ScheduleType = "CRON" | "AUTO" | (string & {});
export const ScheduleType = S.String;
export type SettingSource = "CATALOG" | "TABLE" | (string & {});
export const SettingSource = S.String;
export type ConnectionStatus =
  | "READY"
  | "IN_PROGRESS"
  | "FAILED"
  | (string & {});
export const ConnectionStatus = S.String;
export type DataQualityRuleResultStatus =
  | "PASS"
  | "FAIL"
  | "ERROR"
  | (string & {});
export const DataQualityRuleResultStatus = S.String;
export type PartitionIndexStatus =
  | "CREATING"
  | "ACTIVE"
  | "DELETING"
  | "FAILED"
  | (string & {});
export const PartitionIndexStatus = S.String;
export type ConfigurationSource = "catalog" | "table" | (string & {});
export const ConfigurationSource = S.String;
export type StatisticEvaluationLevel =
  | "Dataset"
  | "Column"
  | "Multicolumn"
  | (string & {});
export const StatisticEvaluationLevel = S.String;
export type ReferenceDatasetsList = string[];
export const ReferenceDatasetsList = S.Array(S.String);
export type TableOptimizerEventType =
  | "starting"
  | "completed"
  | "failed"
  | "in_progress"
  | (string & {});
export const TableOptimizerEventType = S.String;
export interface TableError {
  TableName?: string;
  ErrorDetail?: ErrorDetail;
}
export const TableError = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    ErrorDetail: S.optional(ErrorDetail),
  }),
).annotations({ identifier: "TableError" }) as any as S.Schema<TableError>;
export type TableErrors = TableError[];
export const TableErrors = S.Array(TableError);
export interface TableVersionError {
  TableName?: string;
  VersionId?: string;
  ErrorDetail?: ErrorDetail;
}
export const TableVersionError = S.suspend(() =>
  S.Struct({
    TableName: S.optional(S.String),
    VersionId: S.optional(S.String),
    ErrorDetail: S.optional(ErrorDetail),
  }),
).annotations({
  identifier: "TableVersionError",
}) as any as S.Schema<TableVersionError>;
export type TableVersionErrors = TableVersionError[];
export const TableVersionErrors = S.Array(TableVersionError);
export type EvaluatedMetricsMap = { [key: string]: number | undefined };
export const EvaluatedMetricsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.Number),
});
export type RuleMetricsMap = { [key: string]: number | undefined };
export const RuleMetricsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.Number),
});
export type Labels = { [key: string]: string | undefined };
export const Labels = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface DataQualityRuleResult {
  Name?: string;
  Description?: string | redacted.Redacted<string>;
  EvaluationMessage?: string | redacted.Redacted<string>;
  Result?: DataQualityRuleResultStatus;
  EvaluatedMetrics?: { [key: string]: number | undefined };
  EvaluatedRule?: string | redacted.Redacted<string>;
  RuleMetrics?: { [key: string]: number | undefined };
  Labels?: { [key: string]: string | undefined };
}
export const DataQualityRuleResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    EvaluationMessage: S.optional(SensitiveString),
    Result: S.optional(DataQualityRuleResultStatus),
    EvaluatedMetrics: S.optional(EvaluatedMetricsMap),
    EvaluatedRule: S.optional(SensitiveString),
    RuleMetrics: S.optional(RuleMetricsMap),
    Labels: S.optional(Labels),
  }),
).annotations({
  identifier: "DataQualityRuleResult",
}) as any as S.Schema<DataQualityRuleResult>;
export type DataQualityRuleResults = DataQualityRuleResult[];
export const DataQualityRuleResults = S.Array(DataQualityRuleResult);
export interface DataQualityAnalyzerResult {
  Name?: string;
  Description?: string | redacted.Redacted<string>;
  EvaluationMessage?: string | redacted.Redacted<string>;
  EvaluatedMetrics?: { [key: string]: number | undefined };
}
export const DataQualityAnalyzerResult = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(SensitiveString),
    EvaluationMessage: S.optional(SensitiveString),
    EvaluatedMetrics: S.optional(EvaluatedMetricsMap),
  }),
).annotations({
  identifier: "DataQualityAnalyzerResult",
}) as any as S.Schema<DataQualityAnalyzerResult>;
export type DataQualityAnalyzerResults = DataQualityAnalyzerResult[];
export const DataQualityAnalyzerResults = S.Array(DataQualityAnalyzerResult);
export interface DataQualityMetricValues {
  ActualValue?: number;
  ExpectedValue?: number;
  LowerLimit?: number;
  UpperLimit?: number;
}
export const DataQualityMetricValues = S.suspend(() =>
  S.Struct({
    ActualValue: S.optional(S.Number),
    ExpectedValue: S.optional(S.Number),
    LowerLimit: S.optional(S.Number),
    UpperLimit: S.optional(S.Number),
  }),
).annotations({
  identifier: "DataQualityMetricValues",
}) as any as S.Schema<DataQualityMetricValues>;
export type NewRules = string[];
export const NewRules = S.Array(S.String);
export interface MetricBasedObservation {
  MetricName?: string;
  StatisticId?: string;
  MetricValues?: DataQualityMetricValues;
  NewRules?: string[];
}
export const MetricBasedObservation = S.suspend(() =>
  S.Struct({
    MetricName: S.optional(S.String),
    StatisticId: S.optional(S.String),
    MetricValues: S.optional(DataQualityMetricValues),
    NewRules: S.optional(NewRules),
  }),
).annotations({
  identifier: "MetricBasedObservation",
}) as any as S.Schema<MetricBasedObservation>;
export interface DataQualityObservation {
  Description?: string | redacted.Redacted<string>;
  MetricBasedObservation?: MetricBasedObservation;
}
export const DataQualityObservation = S.suspend(() =>
  S.Struct({
    Description: S.optional(SensitiveString),
    MetricBasedObservation: S.optional(MetricBasedObservation),
  }),
).annotations({
  identifier: "DataQualityObservation",
}) as any as S.Schema<DataQualityObservation>;
export type DataQualityObservations = DataQualityObservation[];
export const DataQualityObservations = S.Array(DataQualityObservation);
export interface DataQualityAggregatedMetrics {
  TotalRowsProcessed?: number;
  TotalRowsPassed?: number;
  TotalRowsFailed?: number;
  TotalRulesProcessed?: number;
  TotalRulesPassed?: number;
  TotalRulesFailed?: number;
}
export const DataQualityAggregatedMetrics = S.suspend(() =>
  S.Struct({
    TotalRowsProcessed: S.optional(S.Number),
    TotalRowsPassed: S.optional(S.Number),
    TotalRowsFailed: S.optional(S.Number),
    TotalRulesProcessed: S.optional(S.Number),
    TotalRulesPassed: S.optional(S.Number),
    TotalRulesFailed: S.optional(S.Number),
  }),
).annotations({
  identifier: "DataQualityAggregatedMetrics",
}) as any as S.Schema<DataQualityAggregatedMetrics>;
export interface DataQualityResult {
  ResultId?: string;
  ProfileId?: string;
  Score?: number;
  DataSource?: DataSource;
  RulesetName?: string;
  EvaluationContext?: string;
  StartedOn?: Date;
  CompletedOn?: Date;
  JobName?: string;
  JobRunId?: string;
  RulesetEvaluationRunId?: string;
  RuleResults?: DataQualityRuleResult[];
  AnalyzerResults?: DataQualityAnalyzerResult[];
  Observations?: DataQualityObservation[];
  AggregatedMetrics?: DataQualityAggregatedMetrics;
}
export const DataQualityResult = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DataQualityResult",
}) as any as S.Schema<DataQualityResult>;
export type DataQualityResultsList = DataQualityResult[];
export const DataQualityResultsList = S.Array(DataQualityResult);
export type PartitionList = Partition[];
export const PartitionList = S.Array(Partition);
export interface BatchStopJobRunSuccessfulSubmission {
  JobName?: string;
  JobRunId?: string;
}
export const BatchStopJobRunSuccessfulSubmission = S.suspend(() =>
  S.Struct({ JobName: S.optional(S.String), JobRunId: S.optional(S.String) }),
).annotations({
  identifier: "BatchStopJobRunSuccessfulSubmission",
}) as any as S.Schema<BatchStopJobRunSuccessfulSubmission>;
export type BatchStopJobRunSuccessfulSubmissionList =
  BatchStopJobRunSuccessfulSubmission[];
export const BatchStopJobRunSuccessfulSubmissionList = S.Array(
  BatchStopJobRunSuccessfulSubmission,
);
export interface BatchStopJobRunError {
  JobName?: string;
  JobRunId?: string;
  ErrorDetail?: ErrorDetail;
}
export const BatchStopJobRunError = S.suspend(() =>
  S.Struct({
    JobName: S.optional(S.String),
    JobRunId: S.optional(S.String),
    ErrorDetail: S.optional(ErrorDetail),
  }),
).annotations({
  identifier: "BatchStopJobRunError",
}) as any as S.Schema<BatchStopJobRunError>;
export type BatchStopJobRunErrorList = BatchStopJobRunError[];
export const BatchStopJobRunErrorList = S.Array(BatchStopJobRunError);
export type GlueTables = GlueTable[];
export const GlueTables = S.Array(GlueTable);
export interface TransformEncryption {
  MlUserDataEncryption?: MLUserDataEncryption;
  TaskRunSecurityConfigurationName?: string;
}
export const TransformEncryption = S.suspend(() =>
  S.Struct({
    MlUserDataEncryption: S.optional(MLUserDataEncryption),
    TaskRunSecurityConfigurationName: S.optional(S.String),
  }),
).annotations({
  identifier: "TransformEncryption",
}) as any as S.Schema<TransformEncryption>;
export type FederationSourceErrorCode =
  | "AccessDeniedException"
  | "EntityNotFoundException"
  | "InvalidCredentialsException"
  | "InvalidInputException"
  | "InvalidResponseException"
  | "OperationTimeoutException"
  | "OperationNotSupportedException"
  | "InternalServiceException"
  | "PartialFailureException"
  | "ThrottlingException"
  | (string & {});
export const FederationSourceErrorCode = S.String;
export interface Capabilities {
  SupportedAuthenticationTypes: AuthenticationType[];
  SupportedDataOperations: DataOperation[];
  SupportedComputeEnvironments: ComputeEnvironment[];
}
export const Capabilities = S.suspend(() =>
  S.Struct({
    SupportedAuthenticationTypes: AuthenticationTypes,
    SupportedDataOperations: DataOperations,
    SupportedComputeEnvironments: ComputeEnvironments,
  }),
).annotations({ identifier: "Capabilities" }) as any as S.Schema<Capabilities>;
export type PropertyType =
  | "USER_INPUT"
  | "SECRET"
  | "READ_ONLY"
  | "UNUSED"
  | "SECRET_OR_USER_INPUT"
  | (string & {});
export const PropertyType = S.String;
export type PropertyTypes = PropertyType[];
export const PropertyTypes = S.Array(PropertyType);
export interface AllowedValue {
  Description?: string;
  Value: string;
}
export const AllowedValue = S.suspend(() =>
  S.Struct({ Description: S.optional(S.String), Value: S.String }),
).annotations({ identifier: "AllowedValue" }) as any as S.Schema<AllowedValue>;
export type AllowedValues = AllowedValue[];
export const AllowedValues = S.Array(AllowedValue);
export interface Property {
  Name: string;
  Description: string;
  Required: boolean;
  DefaultValue?: string;
  PropertyTypes: PropertyType[];
  AllowedValues?: AllowedValue[];
  DataOperationScopes?: DataOperation[];
}
export const Property = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.String,
    Required: S.Boolean,
    DefaultValue: S.optional(S.String),
    PropertyTypes: PropertyTypes,
    AllowedValues: S.optional(AllowedValues),
    DataOperationScopes: S.optional(DataOperations),
  }),
).annotations({ identifier: "Property" }) as any as S.Schema<Property>;
export type PropertiesMap = { [key: string]: Property | undefined };
export const PropertiesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(Property),
});
export interface AuthConfiguration {
  AuthenticationType: Property;
  SecretArn?: Property;
  OAuth2Properties?: { [key: string]: Property | undefined };
  BasicAuthenticationProperties?: { [key: string]: Property | undefined };
  CustomAuthenticationProperties?: { [key: string]: Property | undefined };
}
export const AuthConfiguration = S.suspend(() =>
  S.Struct({
    AuthenticationType: Property,
    SecretArn: S.optional(Property),
    OAuth2Properties: S.optional(PropertiesMap),
    BasicAuthenticationProperties: S.optional(PropertiesMap),
    CustomAuthenticationProperties: S.optional(PropertiesMap),
  }),
).annotations({
  identifier: "AuthConfiguration",
}) as any as S.Schema<AuthConfiguration>;
export interface InboundIntegration {
  SourceArn: string;
  TargetArn: string;
  IntegrationArn: string;
  Status: IntegrationStatus;
  CreateTime: Date;
  IntegrationConfig?: IntegrationConfig;
  Errors?: IntegrationError[];
}
export const InboundIntegration = S.suspend(() =>
  S.Struct({
    SourceArn: S.String,
    TargetArn: S.String,
    IntegrationArn: S.String,
    Status: IntegrationStatus,
    CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    IntegrationConfig: S.optional(IntegrationConfig),
    Errors: S.optional(IntegrationErrorList),
  }),
).annotations({
  identifier: "InboundIntegration",
}) as any as S.Schema<InboundIntegration>;
export type InboundIntegrationsList = InboundIntegration[];
export const InboundIntegrationsList = S.Array(InboundIntegration);
export interface CatalogImportStatus {
  ImportCompleted?: boolean;
  ImportTime?: Date;
  ImportedBy?: string;
}
export const CatalogImportStatus = S.suspend(() =>
  S.Struct({
    ImportCompleted: S.optional(S.Boolean),
    ImportTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ImportedBy: S.optional(S.String),
  }),
).annotations({
  identifier: "CatalogImportStatus",
}) as any as S.Schema<CatalogImportStatus>;
export interface OAuth2Properties {
  OAuth2GrantType?: OAuth2GrantType;
  OAuth2ClientApplication?: OAuth2ClientApplication;
  TokenUrl?: string;
  TokenUrlParametersMap?: { [key: string]: string | undefined };
}
export const OAuth2Properties = S.suspend(() =>
  S.Struct({
    OAuth2GrantType: S.optional(OAuth2GrantType),
    OAuth2ClientApplication: S.optional(OAuth2ClientApplication),
    TokenUrl: S.optional(S.String),
    TokenUrlParametersMap: S.optional(TokenUrlParametersMap),
  }),
).annotations({
  identifier: "OAuth2Properties",
}) as any as S.Schema<OAuth2Properties>;
export interface AuthenticationConfiguration {
  AuthenticationType?: AuthenticationType;
  SecretArn?: string;
  KmsKeyArn?: string;
  OAuth2Properties?: OAuth2Properties;
}
export const AuthenticationConfiguration = S.suspend(() =>
  S.Struct({
    AuthenticationType: S.optional(AuthenticationType),
    SecretArn: S.optional(S.String),
    KmsKeyArn: S.optional(S.String),
    OAuth2Properties: S.optional(OAuth2Properties),
  }),
).annotations({
  identifier: "AuthenticationConfiguration",
}) as any as S.Schema<AuthenticationConfiguration>;
export interface Connection {
  Name?: string;
  Description?: string;
  ConnectionType?: ConnectionType;
  MatchCriteria?: string[];
  ConnectionProperties?: { [key: string]: string | undefined };
  SparkProperties?: { [key: string]: string | undefined };
  AthenaProperties?: { [key: string]: string | undefined };
  PythonProperties?: { [key: string]: string | undefined };
  PhysicalConnectionRequirements?: PhysicalConnectionRequirements;
  CreationTime?: Date;
  LastUpdatedTime?: Date;
  LastUpdatedBy?: string;
  Status?: ConnectionStatus;
  StatusReason?: string;
  LastConnectionValidationTime?: Date;
  AuthenticationConfiguration?: AuthenticationConfiguration;
  ConnectionSchemaVersion?: number;
  CompatibleComputeEnvironments?: ComputeEnvironment[];
}
export const Connection = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    ConnectionType: S.optional(ConnectionType),
    MatchCriteria: S.optional(MatchCriteria),
    ConnectionProperties: S.optional(ConnectionProperties),
    SparkProperties: S.optional(PropertyMap),
    AthenaProperties: S.optional(PropertyMap),
    PythonProperties: S.optional(PropertyMap),
    PhysicalConnectionRequirements: S.optional(PhysicalConnectionRequirements),
    CreationTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastUpdatedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    LastUpdatedBy: S.optional(S.String),
    Status: S.optional(ConnectionStatus),
    StatusReason: S.optional(S.String),
    LastConnectionValidationTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    AuthenticationConfiguration: S.optional(AuthenticationConfiguration),
    ConnectionSchemaVersion: S.optional(S.Number),
    CompatibleComputeEnvironments: S.optional(ComputeEnvironmentList),
  }),
).annotations({ identifier: "Connection" }) as any as S.Schema<Connection>;
export type ConnectionList = Connection[];
export const ConnectionList = S.Array(Connection);
export interface CrawlerMetrics {
  CrawlerName?: string;
  TimeLeftSeconds?: number;
  StillEstimating?: boolean;
  LastRuntimeSeconds?: number;
  MedianRuntimeSeconds?: number;
  TablesCreated?: number;
  TablesUpdated?: number;
  TablesDeleted?: number;
}
export const CrawlerMetrics = S.suspend(() =>
  S.Struct({
    CrawlerName: S.optional(S.String),
    TimeLeftSeconds: S.optional(S.Number),
    StillEstimating: S.optional(S.Boolean),
    LastRuntimeSeconds: S.optional(S.Number),
    MedianRuntimeSeconds: S.optional(S.Number),
    TablesCreated: S.optional(S.Number),
    TablesUpdated: S.optional(S.Number),
    TablesDeleted: S.optional(S.Number),
  }),
).annotations({
  identifier: "CrawlerMetrics",
}) as any as S.Schema<CrawlerMetrics>;
export type CrawlerMetricsList = CrawlerMetrics[];
export const CrawlerMetricsList = S.Array(CrawlerMetrics);
export interface StatisticModelResult {
  LowerBound?: number;
  UpperBound?: number;
  PredictedValue?: number;
  ActualValue?: number;
  Date?: Date;
  InclusionAnnotation?: InclusionAnnotationValue;
}
export const StatisticModelResult = S.suspend(() =>
  S.Struct({
    LowerBound: S.optional(S.Number),
    UpperBound: S.optional(S.Number),
    PredictedValue: S.optional(S.Number),
    ActualValue: S.optional(S.Number),
    Date: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    InclusionAnnotation: S.optional(InclusionAnnotationValue),
  }),
).annotations({
  identifier: "StatisticModelResult",
}) as any as S.Schema<StatisticModelResult>;
export type StatisticModelResults = StatisticModelResult[];
export const StatisticModelResults = S.Array(StatisticModelResult);
export type Records = any[];
export const Records = S.Array(S.Any);
export interface GluePolicy {
  PolicyInJson?: string;
  PolicyHash?: string;
  CreateTime?: Date;
  UpdateTime?: Date;
}
export const GluePolicy = S.suspend(() =>
  S.Struct({
    PolicyInJson: S.optional(S.String),
    PolicyHash: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({ identifier: "GluePolicy" }) as any as S.Schema<GluePolicy>;
export type GetResourcePoliciesResponseList = GluePolicy[];
export const GetResourcePoliciesResponseList = S.Array(GluePolicy);
export interface RunMetrics {
  NumberOfBytesCompacted?: string;
  NumberOfFilesCompacted?: string;
  NumberOfDpus?: string;
  JobDurationInHour?: string;
}
export const RunMetrics = S.suspend(() =>
  S.Struct({
    NumberOfBytesCompacted: S.optional(S.String),
    NumberOfFilesCompacted: S.optional(S.String),
    NumberOfDpus: S.optional(S.String),
    JobDurationInHour: S.optional(S.String),
  }),
).annotations({ identifier: "RunMetrics" }) as any as S.Schema<RunMetrics>;
export interface IcebergCompactionMetrics {
  NumberOfBytesCompacted?: number;
  NumberOfFilesCompacted?: number;
  DpuHours?: number;
  NumberOfDpus?: number;
  JobDurationInHour?: number;
}
export const IcebergCompactionMetrics = S.suspend(() =>
  S.Struct({
    NumberOfBytesCompacted: S.optional(S.Number),
    NumberOfFilesCompacted: S.optional(S.Number),
    DpuHours: S.optional(S.Number),
    NumberOfDpus: S.optional(S.Number),
    JobDurationInHour: S.optional(S.Number),
  }),
).annotations({
  identifier: "IcebergCompactionMetrics",
}) as any as S.Schema<IcebergCompactionMetrics>;
export interface CompactionMetrics {
  IcebergMetrics?: IcebergCompactionMetrics;
}
export const CompactionMetrics = S.suspend(() =>
  S.Struct({ IcebergMetrics: S.optional(IcebergCompactionMetrics) }),
).annotations({
  identifier: "CompactionMetrics",
}) as any as S.Schema<CompactionMetrics>;
export interface IcebergRetentionMetrics {
  NumberOfDataFilesDeleted?: number;
  NumberOfManifestFilesDeleted?: number;
  NumberOfManifestListsDeleted?: number;
  DpuHours?: number;
  NumberOfDpus?: number;
  JobDurationInHour?: number;
}
export const IcebergRetentionMetrics = S.suspend(() =>
  S.Struct({
    NumberOfDataFilesDeleted: S.optional(S.Number),
    NumberOfManifestFilesDeleted: S.optional(S.Number),
    NumberOfManifestListsDeleted: S.optional(S.Number),
    DpuHours: S.optional(S.Number),
    NumberOfDpus: S.optional(S.Number),
    JobDurationInHour: S.optional(S.Number),
  }),
).annotations({
  identifier: "IcebergRetentionMetrics",
}) as any as S.Schema<IcebergRetentionMetrics>;
export interface RetentionMetrics {
  IcebergMetrics?: IcebergRetentionMetrics;
}
export const RetentionMetrics = S.suspend(() =>
  S.Struct({ IcebergMetrics: S.optional(IcebergRetentionMetrics) }),
).annotations({
  identifier: "RetentionMetrics",
}) as any as S.Schema<RetentionMetrics>;
export interface IcebergOrphanFileDeletionMetrics {
  NumberOfOrphanFilesDeleted?: number;
  DpuHours?: number;
  NumberOfDpus?: number;
  JobDurationInHour?: number;
}
export const IcebergOrphanFileDeletionMetrics = S.suspend(() =>
  S.Struct({
    NumberOfOrphanFilesDeleted: S.optional(S.Number),
    DpuHours: S.optional(S.Number),
    NumberOfDpus: S.optional(S.Number),
    JobDurationInHour: S.optional(S.Number),
  }),
).annotations({
  identifier: "IcebergOrphanFileDeletionMetrics",
}) as any as S.Schema<IcebergOrphanFileDeletionMetrics>;
export interface OrphanFileDeletionMetrics {
  IcebergMetrics?: IcebergOrphanFileDeletionMetrics;
}
export const OrphanFileDeletionMetrics = S.suspend(() =>
  S.Struct({ IcebergMetrics: S.optional(IcebergOrphanFileDeletionMetrics) }),
).annotations({
  identifier: "OrphanFileDeletionMetrics",
}) as any as S.Schema<OrphanFileDeletionMetrics>;
export interface TableOptimizerRun {
  eventType?: TableOptimizerEventType;
  startTimestamp?: Date;
  endTimestamp?: Date;
  metrics?: RunMetrics;
  error?: string;
  compactionMetrics?: CompactionMetrics;
  compactionStrategy?: CompactionStrategy;
  retentionMetrics?: RetentionMetrics;
  orphanFileDeletionMetrics?: OrphanFileDeletionMetrics;
}
export const TableOptimizerRun = S.suspend(() =>
  S.Struct({
    eventType: S.optional(TableOptimizerEventType),
    startTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endTimestamp: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    metrics: S.optional(RunMetrics),
    error: S.optional(S.String),
    compactionMetrics: S.optional(CompactionMetrics),
    compactionStrategy: S.optional(CompactionStrategy),
    retentionMetrics: S.optional(RetentionMetrics),
    orphanFileDeletionMetrics: S.optional(OrphanFileDeletionMetrics),
  }),
).annotations({
  identifier: "TableOptimizerRun",
}) as any as S.Schema<TableOptimizerRun>;
export interface TableOptimizer {
  type?: TableOptimizerType;
  configuration?: TableOptimizerConfiguration;
  lastRun?: TableOptimizerRun;
  configurationSource?: ConfigurationSource;
}
export const TableOptimizer = S.suspend(() =>
  S.Struct({
    type: S.optional(TableOptimizerType),
    configuration: S.optional(TableOptimizerConfiguration),
    lastRun: S.optional(TableOptimizerRun),
    configurationSource: S.optional(ConfigurationSource),
  }),
).annotations({
  identifier: "TableOptimizer",
}) as any as S.Schema<TableOptimizer>;
export interface UnfilteredPartition {
  Partition?: Partition;
  AuthorizedColumns?: string[];
  IsRegisteredWithLakeFormation?: boolean;
}
export const UnfilteredPartition = S.suspend(() =>
  S.Struct({
    Partition: S.optional(Partition),
    AuthorizedColumns: S.optional(NameStringList),
    IsRegisteredWithLakeFormation: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "UnfilteredPartition",
}) as any as S.Schema<UnfilteredPartition>;
export type UnfilteredPartitionList = UnfilteredPartition[];
export const UnfilteredPartitionList = S.Array(UnfilteredPartition);
export type CustomProperties = { [key: string]: string | undefined };
export const CustomProperties = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface Entity {
  EntityName?: string;
  Label?: string;
  IsParentEntity?: boolean;
  Description?: string;
  Category?: string;
  CustomProperties?: { [key: string]: string | undefined };
}
export const Entity = S.suspend(() =>
  S.Struct({
    EntityName: S.optional(S.String),
    Label: S.optional(S.String),
    IsParentEntity: S.optional(S.Boolean),
    Description: S.optional(S.String),
    Category: S.optional(S.String),
    CustomProperties: S.optional(CustomProperties),
  }),
).annotations({ identifier: "Entity" }) as any as S.Schema<Entity>;
export type EntityList = Entity[];
export const EntityList = S.Array(Entity);
export interface RegistryListItem {
  RegistryName?: string;
  RegistryArn?: string;
  Description?: string;
  Status?: RegistryStatus;
  CreatedTime?: string;
  UpdatedTime?: string;
}
export const RegistryListItem = S.suspend(() =>
  S.Struct({
    RegistryName: S.optional(S.String),
    RegistryArn: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(RegistryStatus),
    CreatedTime: S.optional(S.String),
    UpdatedTime: S.optional(S.String),
  }),
).annotations({
  identifier: "RegistryListItem",
}) as any as S.Schema<RegistryListItem>;
export type RegistryListDefinition = RegistryListItem[];
export const RegistryListDefinition = S.Array(RegistryListItem);
export interface SchemaListItem {
  RegistryName?: string;
  SchemaName?: string;
  SchemaArn?: string;
  Description?: string;
  SchemaStatus?: SchemaStatus;
  CreatedTime?: string;
  UpdatedTime?: string;
}
export const SchemaListItem = S.suspend(() =>
  S.Struct({
    RegistryName: S.optional(S.String),
    SchemaName: S.optional(S.String),
    SchemaArn: S.optional(S.String),
    Description: S.optional(S.String),
    SchemaStatus: S.optional(SchemaStatus),
    CreatedTime: S.optional(S.String),
    UpdatedTime: S.optional(S.String),
  }),
).annotations({
  identifier: "SchemaListItem",
}) as any as S.Schema<SchemaListItem>;
export type SchemaListDefinition = SchemaListItem[];
export const SchemaListDefinition = S.Array(SchemaListItem);
export interface SchemaVersionListItem {
  SchemaArn?: string;
  SchemaVersionId?: string;
  VersionNumber?: number;
  Status?: SchemaVersionStatus;
  CreatedTime?: string;
}
export const SchemaVersionListItem = S.suspend(() =>
  S.Struct({
    SchemaArn: S.optional(S.String),
    SchemaVersionId: S.optional(S.String),
    VersionNumber: S.optional(S.Number),
    Status: S.optional(SchemaVersionStatus),
    CreatedTime: S.optional(S.String),
  }),
).annotations({
  identifier: "SchemaVersionListItem",
}) as any as S.Schema<SchemaVersionListItem>;
export type SchemaVersionList = SchemaVersionListItem[];
export const SchemaVersionList = S.Array(SchemaVersionListItem);
export interface UsageProfileDefinition {
  Name?: string;
  Description?: string;
  CreatedOn?: Date;
  LastModifiedOn?: Date;
}
export const UsageProfileDefinition = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "UsageProfileDefinition",
}) as any as S.Schema<UsageProfileDefinition>;
export type UsageProfileDefinitionList = UsageProfileDefinition[];
export const UsageProfileDefinitionList = S.Array(UsageProfileDefinition);
export interface ColumnStatisticsError {
  ColumnStatistics?: ColumnStatistics;
  Error?: ErrorDetail;
}
export const ColumnStatisticsError = S.suspend(() =>
  S.Struct({
    ColumnStatistics: S.optional(ColumnStatistics),
    Error: S.optional(ErrorDetail),
  }),
).annotations({
  identifier: "ColumnStatisticsError",
}) as any as S.Schema<ColumnStatisticsError>;
export type ColumnStatisticsErrors = ColumnStatisticsError[];
export const ColumnStatisticsErrors = S.Array(ColumnStatisticsError);
export interface ViewRepresentationInput {
  Dialect?: ViewDialect;
  DialectVersion?: string;
  ViewOriginalText?: string;
  ValidationConnection?: string;
  ViewExpandedText?: string;
}
export const ViewRepresentationInput = S.suspend(() =>
  S.Struct({
    Dialect: S.optional(ViewDialect),
    DialectVersion: S.optional(S.String),
    ViewOriginalText: S.optional(S.String),
    ValidationConnection: S.optional(S.String),
    ViewExpandedText: S.optional(S.String),
  }),
).annotations({
  identifier: "ViewRepresentationInput",
}) as any as S.Schema<ViewRepresentationInput>;
export type ViewRepresentationInputList = ViewRepresentationInput[];
export const ViewRepresentationInputList = S.Array(ViewRepresentationInput);
export type ExecutionStatus = "FAILED" | "STARTED" | (string & {});
export const ExecutionStatus = S.String;
export type BackfillErrorCode =
  | "ENCRYPTED_PARTITION_ERROR"
  | "INTERNAL_ERROR"
  | "INVALID_PARTITION_TYPE_DATA_ERROR"
  | "MISSING_PARTITION_VALUE_ERROR"
  | "UNSUPPORTED_PARTITION_CHARACTER_ERROR"
  | (string & {});
export const BackfillErrorCode = S.String;
export type BackfillErroredPartitionsList = PartitionValueList[];
export const BackfillErroredPartitionsList = S.Array(PartitionValueList);
export type ResourceAction = "UPDATE" | "CREATE" | (string & {});
export const ResourceAction = S.String;
export type ResourceState =
  | "QUEUED"
  | "IN_PROGRESS"
  | "SUCCESS"
  | "STOPPED"
  | "FAILED"
  | (string & {});
export const ResourceState = S.String;
export interface BatchDeleteTableResponse {
  Errors?: TableError[];
}
export const BatchDeleteTableResponse = S.suspend(() =>
  S.Struct({ Errors: S.optional(TableErrors) }),
).annotations({
  identifier: "BatchDeleteTableResponse",
}) as any as S.Schema<BatchDeleteTableResponse>;
export interface BatchDeleteTableVersionResponse {
  Errors?: TableVersionError[];
}
export const BatchDeleteTableVersionResponse = S.suspend(() =>
  S.Struct({ Errors: S.optional(TableVersionErrors) }),
).annotations({
  identifier: "BatchDeleteTableVersionResponse",
}) as any as S.Schema<BatchDeleteTableVersionResponse>;
export interface BatchGetCustomEntityTypesResponse {
  CustomEntityTypes?: CustomEntityType[];
  CustomEntityTypesNotFound?: string[];
}
export const BatchGetCustomEntityTypesResponse = S.suspend(() =>
  S.Struct({
    CustomEntityTypes: S.optional(CustomEntityTypes),
    CustomEntityTypesNotFound: S.optional(CustomEntityTypeNames),
  }),
).annotations({
  identifier: "BatchGetCustomEntityTypesResponse",
}) as any as S.Schema<BatchGetCustomEntityTypesResponse>;
export interface BatchGetDataQualityResultResponse {
  Results: DataQualityResult[];
  ResultsNotFound?: string[];
}
export const BatchGetDataQualityResultResponse = S.suspend(() =>
  S.Struct({
    Results: DataQualityResultsList,
    ResultsNotFound: S.optional(DataQualityResultIds),
  }),
).annotations({
  identifier: "BatchGetDataQualityResultResponse",
}) as any as S.Schema<BatchGetDataQualityResultResponse>;
export interface BatchGetDevEndpointsResponse {
  DevEndpoints?: DevEndpoint[];
  DevEndpointsNotFound?: string[];
}
export const BatchGetDevEndpointsResponse = S.suspend(() =>
  S.Struct({
    DevEndpoints: S.optional(DevEndpointList),
    DevEndpointsNotFound: S.optional(DevEndpointNames),
  }),
).annotations({
  identifier: "BatchGetDevEndpointsResponse",
}) as any as S.Schema<BatchGetDevEndpointsResponse>;
export interface BatchGetJobsResponse {
  Jobs?: Job[];
  JobsNotFound?: string[];
}
export const BatchGetJobsResponse = S.suspend(() =>
  S.Struct({
    Jobs: S.optional(JobList),
    JobsNotFound: S.optional(JobNameList),
  }),
).annotations({
  identifier: "BatchGetJobsResponse",
}) as any as S.Schema<BatchGetJobsResponse>;
export interface BatchGetPartitionResponse {
  Partitions?: Partition[];
  UnprocessedKeys?: PartitionValueList[];
}
export const BatchGetPartitionResponse = S.suspend(() =>
  S.Struct({
    Partitions: S.optional(PartitionList),
    UnprocessedKeys: S.optional(BatchGetPartitionValueList),
  }),
).annotations({
  identifier: "BatchGetPartitionResponse",
}) as any as S.Schema<BatchGetPartitionResponse>;
export interface BatchGetTriggersResponse {
  Triggers?: Trigger[];
  TriggersNotFound?: string[];
}
export const BatchGetTriggersResponse = S.suspend(() =>
  S.Struct({
    Triggers: S.optional(TriggerList),
    TriggersNotFound: S.optional(TriggerNameList),
  }),
).annotations({
  identifier: "BatchGetTriggersResponse",
}) as any as S.Schema<BatchGetTriggersResponse>;
export interface BatchStopJobRunResponse {
  SuccessfulSubmissions?: BatchStopJobRunSuccessfulSubmission[];
  Errors?: BatchStopJobRunError[];
}
export const BatchStopJobRunResponse = S.suspend(() =>
  S.Struct({
    SuccessfulSubmissions: S.optional(BatchStopJobRunSuccessfulSubmissionList),
    Errors: S.optional(BatchStopJobRunErrorList),
  }),
).annotations({
  identifier: "BatchStopJobRunResponse",
}) as any as S.Schema<BatchStopJobRunResponse>;
export interface CreateBlueprintResponse {
  Name?: string;
}
export const CreateBlueprintResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "CreateBlueprintResponse",
}) as any as S.Schema<CreateBlueprintResponse>;
export interface CreateCrawlerRequest {
  Name: string;
  Role: string;
  DatabaseName?: string;
  Description?: string;
  Targets: CrawlerTargets;
  Schedule?: string;
  Classifiers?: string[];
  TablePrefix?: string;
  SchemaChangePolicy?: SchemaChangePolicy;
  RecrawlPolicy?: RecrawlPolicy;
  LineageConfiguration?: LineageConfiguration;
  LakeFormationConfiguration?: LakeFormationConfiguration;
  Configuration?: string;
  CrawlerSecurityConfiguration?: string;
  Tags?: { [key: string]: string | undefined };
}
export const CreateCrawlerRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCrawlerRequest",
}) as any as S.Schema<CreateCrawlerRequest>;
export interface CreateCrawlerResponse {}
export const CreateCrawlerResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateCrawlerResponse",
}) as any as S.Schema<CreateCrawlerResponse>;
export interface CreateDatabaseRequest {
  CatalogId?: string;
  DatabaseInput: DatabaseInput;
  Tags?: { [key: string]: string | undefined };
}
export const CreateDatabaseRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseInput: DatabaseInput,
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateDatabaseRequest",
}) as any as S.Schema<CreateDatabaseRequest>;
export interface CreateDatabaseResponse {}
export const CreateDatabaseResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "CreateDatabaseResponse" },
) as any as S.Schema<CreateDatabaseResponse>;
export interface CreateDataQualityRulesetResponse {
  Name?: string;
}
export const CreateDataQualityRulesetResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "CreateDataQualityRulesetResponse",
}) as any as S.Schema<CreateDataQualityRulesetResponse>;
export interface CreateDevEndpointResponse {
  EndpointName?: string;
  Status?: string;
  SecurityGroupIds?: string[];
  SubnetId?: string;
  RoleArn?: string;
  YarnEndpointAddress?: string;
  ZeppelinRemoteSparkInterpreterPort?: number;
  NumberOfNodes?: number;
  WorkerType?: WorkerType;
  GlueVersion?: string;
  NumberOfWorkers?: number;
  AvailabilityZone?: string;
  VpcId?: string;
  ExtraPythonLibsS3Path?: string;
  ExtraJarsS3Path?: string;
  FailureReason?: string;
  SecurityConfiguration?: string;
  CreatedTimestamp?: Date;
  Arguments?: { [key: string]: string | undefined };
}
export const CreateDevEndpointResponse = S.suspend(() =>
  S.Struct({
    EndpointName: S.optional(S.String),
    Status: S.optional(S.String),
    SecurityGroupIds: S.optional(StringList),
    SubnetId: S.optional(S.String),
    RoleArn: S.optional(S.String),
    YarnEndpointAddress: S.optional(S.String),
    ZeppelinRemoteSparkInterpreterPort: S.optional(S.Number),
    NumberOfNodes: S.optional(S.Number),
    WorkerType: S.optional(WorkerType),
    GlueVersion: S.optional(S.String),
    NumberOfWorkers: S.optional(S.Number),
    AvailabilityZone: S.optional(S.String),
    VpcId: S.optional(S.String),
    ExtraPythonLibsS3Path: S.optional(S.String),
    ExtraJarsS3Path: S.optional(S.String),
    FailureReason: S.optional(S.String),
    SecurityConfiguration: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Arguments: S.optional(MapValue),
  }),
).annotations({
  identifier: "CreateDevEndpointResponse",
}) as any as S.Schema<CreateDevEndpointResponse>;
export interface CreateIntegrationRequest {
  IntegrationName: string;
  SourceArn: string;
  TargetArn: string;
  Description?: string;
  DataFilter?: string;
  KmsKeyId?: string;
  AdditionalEncryptionContext?: { [key: string]: string | undefined };
  Tags?: Tag[];
  IntegrationConfig?: IntegrationConfig;
}
export const CreateIntegrationRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateIntegrationRequest",
}) as any as S.Schema<CreateIntegrationRequest>;
export interface CreateIntegrationResourcePropertyResponse {
  ResourceArn: string;
  ResourcePropertyArn?: string;
  SourceProcessingProperties?: SourceProcessingProperties;
  TargetProcessingProperties?: TargetProcessingProperties;
}
export const CreateIntegrationResourcePropertyResponse = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    ResourcePropertyArn: S.optional(S.String),
    SourceProcessingProperties: S.optional(SourceProcessingProperties),
    TargetProcessingProperties: S.optional(TargetProcessingProperties),
  }),
).annotations({
  identifier: "CreateIntegrationResourcePropertyResponse",
}) as any as S.Schema<CreateIntegrationResourcePropertyResponse>;
export interface CreateIntegrationTablePropertiesRequest {
  ResourceArn: string;
  TableName: string;
  SourceTableConfig?: SourceTableConfig;
  TargetTableConfig?: TargetTableConfig;
}
export const CreateIntegrationTablePropertiesRequest = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    TableName: S.String,
    SourceTableConfig: S.optional(SourceTableConfig),
    TargetTableConfig: S.optional(TargetTableConfig),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateIntegrationTablePropertiesRequest",
}) as any as S.Schema<CreateIntegrationTablePropertiesRequest>;
export interface CreateIntegrationTablePropertiesResponse {}
export const CreateIntegrationTablePropertiesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateIntegrationTablePropertiesResponse",
}) as any as S.Schema<CreateIntegrationTablePropertiesResponse>;
export interface CreateMLTransformRequest {
  Name: string;
  Description?: string;
  InputRecordTables: GlueTable[];
  Parameters: TransformParameters;
  Role: string;
  GlueVersion?: string;
  MaxCapacity?: number;
  WorkerType?: WorkerType;
  NumberOfWorkers?: number;
  Timeout?: number;
  MaxRetries?: number;
  Tags?: { [key: string]: string | undefined };
  TransformEncryption?: TransformEncryption;
}
export const CreateMLTransformRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    InputRecordTables: GlueTables,
    Parameters: TransformParameters,
    Role: S.String,
    GlueVersion: S.optional(S.String),
    MaxCapacity: S.optional(S.Number),
    WorkerType: S.optional(WorkerType),
    NumberOfWorkers: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    Tags: S.optional(TagsMap),
    TransformEncryption: S.optional(TransformEncryption),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateMLTransformRequest",
}) as any as S.Schema<CreateMLTransformRequest>;
export interface CreateSchemaResponse {
  RegistryName?: string;
  RegistryArn?: string;
  SchemaName?: string;
  SchemaArn?: string;
  Description?: string;
  DataFormat?: DataFormat;
  Compatibility?: Compatibility;
  SchemaCheckpoint?: number;
  LatestSchemaVersion?: number;
  NextSchemaVersion?: number;
  SchemaStatus?: SchemaStatus;
  Tags?: { [key: string]: string | undefined };
  SchemaVersionId?: string;
  SchemaVersionStatus?: SchemaVersionStatus;
}
export const CreateSchemaResponse = S.suspend(() =>
  S.Struct({
    RegistryName: S.optional(S.String),
    RegistryArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    SchemaArn: S.optional(S.String),
    Description: S.optional(S.String),
    DataFormat: S.optional(DataFormat),
    Compatibility: S.optional(Compatibility),
    SchemaCheckpoint: S.optional(S.Number),
    LatestSchemaVersion: S.optional(S.Number),
    NextSchemaVersion: S.optional(S.Number),
    SchemaStatus: S.optional(SchemaStatus),
    Tags: S.optional(TagsMap),
    SchemaVersionId: S.optional(S.String),
    SchemaVersionStatus: S.optional(SchemaVersionStatus),
  }),
).annotations({
  identifier: "CreateSchemaResponse",
}) as any as S.Schema<CreateSchemaResponse>;
export interface CreateScriptRequest {
  DagNodes?: CodeGenNode[];
  DagEdges?: CodeGenEdge[];
  Language?: Language;
}
export const CreateScriptRequest = S.suspend(() =>
  S.Struct({
    DagNodes: S.optional(DagNodes),
    DagEdges: S.optional(DagEdges),
    Language: S.optional(Language),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateScriptRequest",
}) as any as S.Schema<CreateScriptRequest>;
export interface CreateSecurityConfigurationRequest {
  Name: string;
  EncryptionConfiguration: EncryptionConfiguration;
}
export const CreateSecurityConfigurationRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    EncryptionConfiguration: EncryptionConfiguration,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateSecurityConfigurationRequest",
}) as any as S.Schema<CreateSecurityConfigurationRequest>;
export interface CreateSessionResponse {
  Session?: Session;
}
export const CreateSessionResponse = S.suspend(() =>
  S.Struct({ Session: S.optional(Session) }),
).annotations({
  identifier: "CreateSessionResponse",
}) as any as S.Schema<CreateSessionResponse>;
export type IntegerList = number[];
export const IntegerList = S.Array(S.Number);
export type IcebergStructTypeEnum = "struct" | (string & {});
export const IcebergStructTypeEnum = S.String;
export interface CreateTriggerRequest {
  Name: string;
  WorkflowName?: string;
  Type: TriggerType;
  Schedule?: string;
  Predicate?: Predicate;
  Actions: Action[];
  Description?: string;
  StartOnCreation?: boolean;
  Tags?: { [key: string]: string | undefined };
  EventBatchingCondition?: EventBatchingCondition;
}
export const CreateTriggerRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    WorkflowName: S.optional(S.String),
    Type: TriggerType,
    Schedule: S.optional(S.String),
    Predicate: S.optional(Predicate),
    Actions: ActionList,
    Description: S.optional(S.String),
    StartOnCreation: S.optional(S.Boolean),
    Tags: S.optional(TagsMap),
    EventBatchingCondition: S.optional(EventBatchingCondition),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateTriggerRequest",
}) as any as S.Schema<CreateTriggerRequest>;
export interface CreateUserDefinedFunctionRequest {
  CatalogId?: string;
  DatabaseName: string;
  FunctionInput: UserDefinedFunctionInput;
}
export const CreateUserDefinedFunctionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    FunctionInput: UserDefinedFunctionInput,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateUserDefinedFunctionRequest",
}) as any as S.Schema<CreateUserDefinedFunctionRequest>;
export interface CreateUserDefinedFunctionResponse {}
export const CreateUserDefinedFunctionResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateUserDefinedFunctionResponse",
}) as any as S.Schema<CreateUserDefinedFunctionResponse>;
export interface CreateWorkflowResponse {
  Name?: string;
}
export const CreateWorkflowResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "CreateWorkflowResponse",
}) as any as S.Schema<CreateWorkflowResponse>;
export interface DeleteIntegrationResponse {
  SourceArn: string;
  TargetArn: string;
  IntegrationName: string;
  Description?: string;
  IntegrationArn: string;
  KmsKeyId?: string;
  AdditionalEncryptionContext?: { [key: string]: string | undefined };
  Tags?: Tag[];
  Status: IntegrationStatus;
  CreateTime: Date;
  Errors?: IntegrationError[];
  DataFilter?: string;
}
export const DeleteIntegrationResponse = S.suspend(() =>
  S.Struct({
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
    Status: IntegrationStatus,
    CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Errors: S.optional(IntegrationErrorList),
    DataFilter: S.optional(S.String),
  }),
).annotations({
  identifier: "DeleteIntegrationResponse",
}) as any as S.Schema<DeleteIntegrationResponse>;
export interface DeleteSchemaResponse {
  SchemaArn?: string;
  SchemaName?: string;
  Status?: SchemaStatus;
}
export const DeleteSchemaResponse = S.suspend(() =>
  S.Struct({
    SchemaArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    Status: S.optional(SchemaStatus),
  }),
).annotations({
  identifier: "DeleteSchemaResponse",
}) as any as S.Schema<DeleteSchemaResponse>;
export interface DescribeInboundIntegrationsResponse {
  InboundIntegrations?: InboundIntegration[];
  Marker?: string;
}
export const DescribeInboundIntegrationsResponse = S.suspend(() =>
  S.Struct({
    InboundIntegrations: S.optional(InboundIntegrationsList),
    Marker: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeInboundIntegrationsResponse",
}) as any as S.Schema<DescribeInboundIntegrationsResponse>;
export interface GetBlueprintRunResponse {
  BlueprintRun?: BlueprintRun;
}
export const GetBlueprintRunResponse = S.suspend(() =>
  S.Struct({ BlueprintRun: S.optional(BlueprintRun) }),
).annotations({
  identifier: "GetBlueprintRunResponse",
}) as any as S.Schema<GetBlueprintRunResponse>;
export interface GetCatalogImportStatusResponse {
  ImportStatus?: CatalogImportStatus;
}
export const GetCatalogImportStatusResponse = S.suspend(() =>
  S.Struct({ ImportStatus: S.optional(CatalogImportStatus) }),
).annotations({
  identifier: "GetCatalogImportStatusResponse",
}) as any as S.Schema<GetCatalogImportStatusResponse>;
export interface GetColumnStatisticsForPartitionResponse {
  ColumnStatisticsList?: ColumnStatistics[];
  Errors?: ColumnError[];
}
export const GetColumnStatisticsForPartitionResponse = S.suspend(() =>
  S.Struct({
    ColumnStatisticsList: S.optional(ColumnStatisticsList),
    Errors: S.optional(ColumnErrors),
  }),
).annotations({
  identifier: "GetColumnStatisticsForPartitionResponse",
}) as any as S.Schema<GetColumnStatisticsForPartitionResponse>;
export interface GetColumnStatisticsTaskRunResponse {
  ColumnStatisticsTaskRun?: ColumnStatisticsTaskRun;
}
export const GetColumnStatisticsTaskRunResponse = S.suspend(() =>
  S.Struct({ ColumnStatisticsTaskRun: S.optional(ColumnStatisticsTaskRun) }),
).annotations({
  identifier: "GetColumnStatisticsTaskRunResponse",
}) as any as S.Schema<GetColumnStatisticsTaskRunResponse>;
export interface GetConnectionsResponse {
  ConnectionList?: Connection[];
  NextToken?: string;
}
export const GetConnectionsResponse = S.suspend(() =>
  S.Struct({
    ConnectionList: S.optional(ConnectionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetConnectionsResponse",
}) as any as S.Schema<GetConnectionsResponse>;
export interface GetCrawlerMetricsResponse {
  CrawlerMetricsList?: CrawlerMetrics[];
  NextToken?: string;
}
export const GetCrawlerMetricsResponse = S.suspend(() =>
  S.Struct({
    CrawlerMetricsList: S.optional(CrawlerMetricsList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetCrawlerMetricsResponse",
}) as any as S.Schema<GetCrawlerMetricsResponse>;
export interface GetDatabaseResponse {
  Database?: Database;
}
export const GetDatabaseResponse = S.suspend(() =>
  S.Struct({ Database: S.optional(Database) }),
).annotations({
  identifier: "GetDatabaseResponse",
}) as any as S.Schema<GetDatabaseResponse>;
export interface GetDataQualityModelResultResponse {
  CompletedOn?: Date;
  Model?: StatisticModelResult[];
}
export const GetDataQualityModelResultResponse = S.suspend(() =>
  S.Struct({
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Model: S.optional(StatisticModelResults),
  }),
).annotations({
  identifier: "GetDataQualityModelResultResponse",
}) as any as S.Schema<GetDataQualityModelResultResponse>;
export interface GetEntityRecordsResponse {
  Records?: any[];
  NextToken?: string;
}
export const GetEntityRecordsResponse = S.suspend(() =>
  S.Struct({ Records: S.optional(Records), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "GetEntityRecordsResponse",
}) as any as S.Schema<GetEntityRecordsResponse>;
export interface GetJobBookmarkResponse {
  JobBookmarkEntry?: JobBookmarkEntry;
}
export const GetJobBookmarkResponse = S.suspend(() =>
  S.Struct({ JobBookmarkEntry: S.optional(JobBookmarkEntry) }),
).annotations({
  identifier: "GetJobBookmarkResponse",
}) as any as S.Schema<GetJobBookmarkResponse>;
export interface GetMappingResponse {
  Mapping: MappingEntry[];
}
export const GetMappingResponse = S.suspend(() =>
  S.Struct({ Mapping: MappingList }),
).annotations({
  identifier: "GetMappingResponse",
}) as any as S.Schema<GetMappingResponse>;
export interface GetMaterializedViewRefreshTaskRunResponse {
  MaterializedViewRefreshTaskRun?: MaterializedViewRefreshTaskRun;
}
export const GetMaterializedViewRefreshTaskRunResponse = S.suspend(() =>
  S.Struct({
    MaterializedViewRefreshTaskRun: S.optional(MaterializedViewRefreshTaskRun),
  }),
).annotations({
  identifier: "GetMaterializedViewRefreshTaskRunResponse",
}) as any as S.Schema<GetMaterializedViewRefreshTaskRunResponse>;
export interface GetMLTransformsRequest {
  NextToken?: string;
  MaxResults?: number;
  Filter?: TransformFilterCriteria;
  Sort?: TransformSortCriteria;
}
export const GetMLTransformsRequest = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    Filter: S.optional(TransformFilterCriteria),
    Sort: S.optional(TransformSortCriteria),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetMLTransformsRequest",
}) as any as S.Schema<GetMLTransformsRequest>;
export interface GetPartitionsResponse {
  Partitions?: Partition[];
  NextToken?: string;
}
export const GetPartitionsResponse = S.suspend(() =>
  S.Struct({
    Partitions: S.optional(PartitionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPartitionsResponse",
}) as any as S.Schema<GetPartitionsResponse>;
export interface GetPlanResponse {
  PythonScript?: string;
  ScalaCode?: string;
}
export const GetPlanResponse = S.suspend(() =>
  S.Struct({
    PythonScript: S.optional(S.String),
    ScalaCode: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPlanResponse",
}) as any as S.Schema<GetPlanResponse>;
export interface GetResourcePoliciesResponse {
  GetResourcePoliciesResponseList?: GluePolicy[];
  NextToken?: string;
}
export const GetResourcePoliciesResponse = S.suspend(() =>
  S.Struct({
    GetResourcePoliciesResponseList: S.optional(
      GetResourcePoliciesResponseList,
    ),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetResourcePoliciesResponse",
}) as any as S.Schema<GetResourcePoliciesResponse>;
export interface GetSchemaVersionResponse {
  SchemaVersionId?: string;
  SchemaDefinition?: string;
  DataFormat?: DataFormat;
  SchemaArn?: string;
  VersionNumber?: number;
  Status?: SchemaVersionStatus;
  CreatedTime?: string;
}
export const GetSchemaVersionResponse = S.suspend(() =>
  S.Struct({
    SchemaVersionId: S.optional(S.String),
    SchemaDefinition: S.optional(S.String),
    DataFormat: S.optional(DataFormat),
    SchemaArn: S.optional(S.String),
    VersionNumber: S.optional(S.Number),
    Status: S.optional(SchemaVersionStatus),
    CreatedTime: S.optional(S.String),
  }),
).annotations({
  identifier: "GetSchemaVersionResponse",
}) as any as S.Schema<GetSchemaVersionResponse>;
export interface GetSecurityConfigurationResponse {
  SecurityConfiguration?: SecurityConfiguration;
}
export const GetSecurityConfigurationResponse = S.suspend(() =>
  S.Struct({ SecurityConfiguration: S.optional(SecurityConfiguration) }),
).annotations({
  identifier: "GetSecurityConfigurationResponse",
}) as any as S.Schema<GetSecurityConfigurationResponse>;
export interface GetSessionResponse {
  Session?: Session;
}
export const GetSessionResponse = S.suspend(() =>
  S.Struct({ Session: S.optional(Session) }),
).annotations({
  identifier: "GetSessionResponse",
}) as any as S.Schema<GetSessionResponse>;
export interface GetTableResponse {
  Table?: Table;
}
export const GetTableResponse = S.suspend(() =>
  S.Struct({ Table: S.optional(Table) }),
).annotations({
  identifier: "GetTableResponse",
}) as any as S.Schema<GetTableResponse>;
export interface GetTableOptimizerResponse {
  CatalogId?: string;
  DatabaseName?: string;
  TableName?: string;
  TableOptimizer?: TableOptimizer;
}
export const GetTableOptimizerResponse = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    TableName: S.optional(S.String),
    TableOptimizer: S.optional(TableOptimizer),
  }),
).annotations({
  identifier: "GetTableOptimizerResponse",
}) as any as S.Schema<GetTableOptimizerResponse>;
export interface GetTableVersionResponse {
  TableVersion?: TableVersion;
}
export const GetTableVersionResponse = S.suspend(() =>
  S.Struct({ TableVersion: S.optional(TableVersion) }),
).annotations({
  identifier: "GetTableVersionResponse",
}) as any as S.Schema<GetTableVersionResponse>;
export interface GetUnfilteredPartitionMetadataRequest {
  Region?: string;
  CatalogId: string;
  DatabaseName: string;
  TableName: string;
  PartitionValues: string[];
  AuditContext?: AuditContext;
  SupportedPermissionTypes: PermissionType[];
  QuerySessionContext?: QuerySessionContext;
}
export const GetUnfilteredPartitionMetadataRequest = S.suspend(() =>
  S.Struct({
    Region: S.optional(S.String),
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValues: ValueStringList,
    AuditContext: S.optional(AuditContext),
    SupportedPermissionTypes: PermissionTypeList,
    QuerySessionContext: S.optional(QuerySessionContext),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetUnfilteredPartitionMetadataRequest",
}) as any as S.Schema<GetUnfilteredPartitionMetadataRequest>;
export interface GetUnfilteredPartitionsMetadataResponse {
  UnfilteredPartitions?: UnfilteredPartition[];
  NextToken?: string;
}
export const GetUnfilteredPartitionsMetadataResponse = S.suspend(() =>
  S.Struct({
    UnfilteredPartitions: S.optional(UnfilteredPartitionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetUnfilteredPartitionsMetadataResponse",
}) as any as S.Schema<GetUnfilteredPartitionsMetadataResponse>;
export interface GetUserDefinedFunctionResponse {
  UserDefinedFunction?: UserDefinedFunction;
}
export const GetUserDefinedFunctionResponse = S.suspend(() =>
  S.Struct({ UserDefinedFunction: S.optional(UserDefinedFunction) }),
).annotations({
  identifier: "GetUserDefinedFunctionResponse",
}) as any as S.Schema<GetUserDefinedFunctionResponse>;
export interface ListEntitiesResponse {
  Entities?: Entity[];
  NextToken?: string;
}
export const ListEntitiesResponse = S.suspend(() =>
  S.Struct({
    Entities: S.optional(EntityList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListEntitiesResponse",
}) as any as S.Schema<ListEntitiesResponse>;
export interface ListRegistriesResponse {
  Registries?: RegistryListItem[];
  NextToken?: string;
}
export const ListRegistriesResponse = S.suspend(() =>
  S.Struct({
    Registries: S.optional(RegistryListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListRegistriesResponse",
}) as any as S.Schema<ListRegistriesResponse>;
export interface ListSchemasResponse {
  Schemas?: SchemaListItem[];
  NextToken?: string;
}
export const ListSchemasResponse = S.suspend(() =>
  S.Struct({
    Schemas: S.optional(SchemaListDefinition),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSchemasResponse",
}) as any as S.Schema<ListSchemasResponse>;
export interface ListSchemaVersionsResponse {
  Schemas?: SchemaVersionListItem[];
  NextToken?: string;
}
export const ListSchemaVersionsResponse = S.suspend(() =>
  S.Struct({
    Schemas: S.optional(SchemaVersionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListSchemaVersionsResponse",
}) as any as S.Schema<ListSchemaVersionsResponse>;
export interface ListUsageProfilesResponse {
  Profiles?: UsageProfileDefinition[];
  NextToken?: string;
}
export const ListUsageProfilesResponse = S.suspend(() =>
  S.Struct({
    Profiles: S.optional(UsageProfileDefinitionList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListUsageProfilesResponse",
}) as any as S.Schema<ListUsageProfilesResponse>;
export interface PutDataCatalogEncryptionSettingsRequest {
  CatalogId?: string;
  DataCatalogEncryptionSettings: DataCatalogEncryptionSettings;
}
export const PutDataCatalogEncryptionSettingsRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DataCatalogEncryptionSettings: DataCatalogEncryptionSettings,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutDataCatalogEncryptionSettingsRequest",
}) as any as S.Schema<PutDataCatalogEncryptionSettingsRequest>;
export interface PutDataCatalogEncryptionSettingsResponse {}
export const PutDataCatalogEncryptionSettingsResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutDataCatalogEncryptionSettingsResponse",
}) as any as S.Schema<PutDataCatalogEncryptionSettingsResponse>;
export interface PutSchemaVersionMetadataResponse {
  SchemaArn?: string;
  SchemaName?: string;
  RegistryName?: string;
  LatestVersion?: boolean;
  VersionNumber?: number;
  SchemaVersionId?: string;
  MetadataKey?: string;
  MetadataValue?: string;
}
export const PutSchemaVersionMetadataResponse = S.suspend(() =>
  S.Struct({
    SchemaArn: S.optional(S.String),
    SchemaName: S.optional(S.String),
    RegistryName: S.optional(S.String),
    LatestVersion: S.optional(S.Boolean),
    VersionNumber: S.optional(S.Number),
    SchemaVersionId: S.optional(S.String),
    MetadataKey: S.optional(S.String),
    MetadataValue: S.optional(S.String),
  }),
).annotations({
  identifier: "PutSchemaVersionMetadataResponse",
}) as any as S.Schema<PutSchemaVersionMetadataResponse>;
export type TableList = Table[];
export const TableList = S.Array(
  S.suspend((): S.Schema<Table, any> => Table).annotations({
    identifier: "Table",
  }),
);
export interface SearchTablesResponse {
  NextToken?: string;
  TableList?: Table[];
}
export const SearchTablesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    TableList: S.optional(TableList),
  }),
).annotations({
  identifier: "SearchTablesResponse",
}) as any as S.Schema<SearchTablesResponse>;
export interface StartDataQualityRuleRecommendationRunRequest {
  DataSource: DataSource;
  Role: string;
  NumberOfWorkers?: number;
  Timeout?: number;
  CreatedRulesetName?: string;
  DataQualitySecurityConfiguration?: string;
  ClientToken?: string;
}
export const StartDataQualityRuleRecommendationRunRequest = S.suspend(() =>
  S.Struct({
    DataSource: DataSource,
    Role: S.String,
    NumberOfWorkers: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    CreatedRulesetName: S.optional(S.String),
    DataQualitySecurityConfiguration: S.optional(S.String),
    ClientToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "StartDataQualityRuleRecommendationRunRequest",
}) as any as S.Schema<StartDataQualityRuleRecommendationRunRequest>;
export interface StartDataQualityRulesetEvaluationRunResponse {
  RunId?: string;
}
export const StartDataQualityRulesetEvaluationRunResponse = S.suspend(() =>
  S.Struct({ RunId: S.optional(S.String) }),
).annotations({
  identifier: "StartDataQualityRulesetEvaluationRunResponse",
}) as any as S.Schema<StartDataQualityRulesetEvaluationRunResponse>;
export interface UpdateColumnStatisticsForTableResponse {
  Errors?: ColumnStatisticsError[];
}
export const UpdateColumnStatisticsForTableResponse = S.suspend(() =>
  S.Struct({ Errors: S.optional(ColumnStatisticsErrors) }),
).annotations({
  identifier: "UpdateColumnStatisticsForTableResponse",
}) as any as S.Schema<UpdateColumnStatisticsForTableResponse>;
export interface UpdateJobResponse {
  JobName?: string;
}
export const UpdateJobResponse = S.suspend(() =>
  S.Struct({ JobName: S.optional(S.String) }),
).annotations({
  identifier: "UpdateJobResponse",
}) as any as S.Schema<UpdateJobResponse>;
export type IcebergUpdateAction =
  | "add-schema"
  | "set-current-schema"
  | "add-spec"
  | "set-default-spec"
  | "add-sort-order"
  | "set-default-sort-order"
  | "set-location"
  | "set-properties"
  | "remove-properties"
  | "add-encryption-key"
  | "remove-encryption-key"
  | (string & {});
export const IcebergUpdateAction = S.String;
export interface UpdateTriggerResponse {
  Trigger?: Trigger;
}
export const UpdateTriggerResponse = S.suspend(() =>
  S.Struct({ Trigger: S.optional(Trigger) }),
).annotations({
  identifier: "UpdateTriggerResponse",
}) as any as S.Schema<UpdateTriggerResponse>;
export interface ViewDefinitionInput {
  IsProtected?: boolean;
  Definer?: string;
  Representations?: ViewRepresentationInput[];
  ViewVersionId?: number;
  ViewVersionToken?: string;
  RefreshSeconds?: number;
  LastRefreshType?: LastRefreshType;
  SubObjects?: string[];
  SubObjectVersionIds?: number[];
}
export const ViewDefinitionInput = S.suspend(() =>
  S.Struct({
    IsProtected: S.optional(S.Boolean),
    Definer: S.optional(S.String),
    Representations: S.optional(ViewRepresentationInputList),
    ViewVersionId: S.optional(S.Number),
    ViewVersionToken: S.optional(S.String),
    RefreshSeconds: S.optional(S.Number),
    LastRefreshType: S.optional(LastRefreshType),
    SubObjects: S.optional(ViewSubObjectsList),
    SubObjectVersionIds: S.optional(ViewSubObjectVersionIdsList),
  }),
).annotations({
  identifier: "ViewDefinitionInput",
}) as any as S.Schema<ViewDefinitionInput>;
export interface ErrorDetails {
  ErrorCode?: string;
  ErrorMessage?: string;
}
export const ErrorDetails = S.suspend(() =>
  S.Struct({
    ErrorCode: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({ identifier: "ErrorDetails" }) as any as S.Schema<ErrorDetails>;
export interface ExecutionAttempt {
  Status?: ExecutionStatus;
  ColumnStatisticsTaskRunId?: string;
  ExecutionTimestamp?: Date;
  ErrorMessage?: string;
}
export const ExecutionAttempt = S.suspend(() =>
  S.Struct({
    Status: S.optional(ExecutionStatus),
    ColumnStatisticsTaskRunId: S.optional(S.String),
    ExecutionTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "ExecutionAttempt",
}) as any as S.Schema<ExecutionAttempt>;
export interface ImportLabelsTaskRunProperties {
  InputS3Path?: string;
  Replace?: boolean;
}
export const ImportLabelsTaskRunProperties = S.suspend(() =>
  S.Struct({
    InputS3Path: S.optional(S.String),
    Replace: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ImportLabelsTaskRunProperties",
}) as any as S.Schema<ImportLabelsTaskRunProperties>;
export interface ExportLabelsTaskRunProperties {
  OutputS3Path?: string;
}
export const ExportLabelsTaskRunProperties = S.suspend(() =>
  S.Struct({ OutputS3Path: S.optional(S.String) }),
).annotations({
  identifier: "ExportLabelsTaskRunProperties",
}) as any as S.Schema<ExportLabelsTaskRunProperties>;
export interface LabelingSetGenerationTaskRunProperties {
  OutputS3Path?: string;
}
export const LabelingSetGenerationTaskRunProperties = S.suspend(() =>
  S.Struct({ OutputS3Path: S.optional(S.String) }),
).annotations({
  identifier: "LabelingSetGenerationTaskRunProperties",
}) as any as S.Schema<LabelingSetGenerationTaskRunProperties>;
export interface FindMatchesTaskRunProperties {
  JobId?: string;
  JobName?: string;
  JobRunId?: string;
}
export const FindMatchesTaskRunProperties = S.suspend(() =>
  S.Struct({
    JobId: S.optional(S.String),
    JobName: S.optional(S.String),
    JobRunId: S.optional(S.String),
  }),
).annotations({
  identifier: "FindMatchesTaskRunProperties",
}) as any as S.Schema<FindMatchesTaskRunProperties>;
export interface KeySchemaElement {
  Name: string;
  Type: string;
}
export const KeySchemaElement = S.suspend(() =>
  S.Struct({ Name: S.String, Type: S.String }),
).annotations({
  identifier: "KeySchemaElement",
}) as any as S.Schema<KeySchemaElement>;
export type KeySchemaElementList = KeySchemaElement[];
export const KeySchemaElementList = S.Array(KeySchemaElement);
export interface BackfillError {
  Code?: BackfillErrorCode;
  Partitions?: PartitionValueList[];
}
export const BackfillError = S.suspend(() =>
  S.Struct({
    Code: S.optional(BackfillErrorCode),
    Partitions: S.optional(BackfillErroredPartitionsList),
  }),
).annotations({
  identifier: "BackfillError",
}) as any as S.Schema<BackfillError>;
export type BackfillErrors = BackfillError[];
export const BackfillErrors = S.Array(BackfillError);
export interface ConnectionTypeVariant {
  ConnectionTypeVariantName?: string;
  DisplayName?: string;
  Description?: string;
  LogoUrl?: string;
}
export const ConnectionTypeVariant = S.suspend(() =>
  S.Struct({
    ConnectionTypeVariantName: S.optional(S.String),
    DisplayName: S.optional(S.String),
    Description: S.optional(S.String),
    LogoUrl: S.optional(S.String),
  }),
).annotations({
  identifier: "ConnectionTypeVariant",
}) as any as S.Schema<ConnectionTypeVariant>;
export type ConnectionTypeVariantList = ConnectionTypeVariant[];
export const ConnectionTypeVariantList = S.Array(ConnectionTypeVariant);
export type CrawlerHistoryState =
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"
  | "STOPPED"
  | (string & {});
export const CrawlerHistoryState = S.String;
export interface RunIdentifier {
  RunId?: string;
  JobRunId?: string;
}
export const RunIdentifier = S.suspend(() =>
  S.Struct({ RunId: S.optional(S.String), JobRunId: S.optional(S.String) }),
).annotations({
  identifier: "RunIdentifier",
}) as any as S.Schema<RunIdentifier>;
export type StatisticPropertiesMap = { [key: string]: string | undefined };
export const StatisticPropertiesMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface TimestampedInclusionAnnotation {
  Value?: InclusionAnnotationValue;
  LastModifiedOn?: Date;
}
export const TimestampedInclusionAnnotation = S.suspend(() =>
  S.Struct({
    Value: S.optional(InclusionAnnotationValue),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "TimestampedInclusionAnnotation",
}) as any as S.Schema<TimestampedInclusionAnnotation>;
export interface Mapping {
  ToKey?: string;
  FromPath?: string[];
  FromType?: string;
  ToType?: string;
  Dropped?: boolean;
  Children?: Mapping[];
}
export const Mapping = S.suspend(() =>
  S.Struct({
    ToKey: S.optional(S.String),
    FromPath: S.optional(EnclosedInStringProperties),
    FromType: S.optional(S.String),
    ToType: S.optional(S.String),
    Dropped: S.optional(S.Boolean),
    Children: S.optional(
      S.suspend(() => Mappings).annotations({ identifier: "Mappings" }),
    ),
  }),
).annotations({ identifier: "Mapping" }) as any as S.Schema<Mapping>;
export type StringToStringMap = { [key: string]: string | undefined };
export const StringToStringMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export type ErrorByName = { [key: string]: ErrorDetail | undefined };
export const ErrorByName = S.Record({
  key: S.String,
  value: S.UndefinedOr(ErrorDetail),
});
export interface PartitionError {
  PartitionValues?: string[];
  ErrorDetail?: ErrorDetail;
}
export const PartitionError = S.suspend(() =>
  S.Struct({
    PartitionValues: S.optional(ValueStringList),
    ErrorDetail: S.optional(ErrorDetail),
  }),
).annotations({
  identifier: "PartitionError",
}) as any as S.Schema<PartitionError>;
export type PartitionErrors = PartitionError[];
export const PartitionErrors = S.Array(PartitionError);
export type Blueprints = Blueprint[];
export const Blueprints = S.Array(Blueprint);
export interface BatchTableOptimizer {
  catalogId?: string;
  databaseName?: string;
  tableName?: string;
  tableOptimizer?: TableOptimizer;
}
export const BatchTableOptimizer = S.suspend(() =>
  S.Struct({
    catalogId: S.optional(S.String),
    databaseName: S.optional(S.String),
    tableName: S.optional(S.String),
    tableOptimizer: S.optional(TableOptimizer),
  }),
).annotations({
  identifier: "BatchTableOptimizer",
}) as any as S.Schema<BatchTableOptimizer>;
export type BatchTableOptimizers = BatchTableOptimizer[];
export const BatchTableOptimizers = S.Array(BatchTableOptimizer);
export interface BatchGetTableOptimizerError {
  error?: ErrorDetail;
  catalogId?: string;
  databaseName?: string;
  tableName?: string;
  type?: TableOptimizerType;
}
export const BatchGetTableOptimizerError = S.suspend(() =>
  S.Struct({
    error: S.optional(ErrorDetail),
    catalogId: S.optional(S.String),
    databaseName: S.optional(S.String),
    tableName: S.optional(S.String),
    type: S.optional(TableOptimizerType),
  }),
).annotations({
  identifier: "BatchGetTableOptimizerError",
}) as any as S.Schema<BatchGetTableOptimizerError>;
export type BatchGetTableOptimizerErrors = BatchGetTableOptimizerError[];
export const BatchGetTableOptimizerErrors = S.Array(
  BatchGetTableOptimizerError,
);
export interface AnnotationError {
  ProfileId?: string;
  StatisticId?: string;
  FailureReason?: string;
}
export const AnnotationError = S.suspend(() =>
  S.Struct({
    ProfileId: S.optional(S.String),
    StatisticId: S.optional(S.String),
    FailureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "AnnotationError",
}) as any as S.Schema<AnnotationError>;
export type AnnotationErrorList = AnnotationError[];
export const AnnotationErrorList = S.Array(AnnotationError);
export interface BatchUpdatePartitionFailureEntry {
  PartitionValueList?: string[];
  ErrorDetail?: ErrorDetail;
}
export const BatchUpdatePartitionFailureEntry = S.suspend(() =>
  S.Struct({
    PartitionValueList: S.optional(BoundedPartitionValueList),
    ErrorDetail: S.optional(ErrorDetail),
  }),
).annotations({
  identifier: "BatchUpdatePartitionFailureEntry",
}) as any as S.Schema<BatchUpdatePartitionFailureEntry>;
export type BatchUpdatePartitionFailureList =
  BatchUpdatePartitionFailureEntry[];
export const BatchUpdatePartitionFailureList = S.Array(
  BatchUpdatePartitionFailureEntry,
);
export interface TableInput {
  Name: string;
  Description?: string;
  Owner?: string;
  LastAccessTime?: Date;
  LastAnalyzedTime?: Date;
  Retention?: number;
  StorageDescriptor?: StorageDescriptor;
  PartitionKeys?: Column[];
  ViewOriginalText?: string;
  ViewExpandedText?: string;
  TableType?: string;
  Parameters?: { [key: string]: string | undefined };
  TargetTable?: TableIdentifier;
  ViewDefinition?: ViewDefinitionInput;
}
export const TableInput = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Owner: S.optional(S.String),
    LastAccessTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastAnalyzedTime: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    Retention: S.optional(S.Number),
    StorageDescriptor: S.optional(StorageDescriptor),
    PartitionKeys: S.optional(ColumnList),
    ViewOriginalText: S.optional(S.String),
    ViewExpandedText: S.optional(S.String),
    TableType: S.optional(S.String),
    Parameters: S.optional(ParametersMap),
    TargetTable: S.optional(TableIdentifier),
    ViewDefinition: S.optional(ViewDefinitionInput),
  }),
).annotations({ identifier: "TableInput" }) as any as S.Schema<TableInput>;
export type IcebergSortDirection = "asc" | "desc" | (string & {});
export const IcebergSortDirection = S.String;
export type IcebergNullOrder = "nulls-first" | "nulls-last" | (string & {});
export const IcebergNullOrder = S.String;
export interface SchemaVersionErrorItem {
  VersionNumber?: number;
  ErrorDetails?: ErrorDetails;
}
export const SchemaVersionErrorItem = S.suspend(() =>
  S.Struct({
    VersionNumber: S.optional(S.Number),
    ErrorDetails: S.optional(ErrorDetails),
  }),
).annotations({
  identifier: "SchemaVersionErrorItem",
}) as any as S.Schema<SchemaVersionErrorItem>;
export type SchemaVersionErrorList = SchemaVersionErrorItem[];
export const SchemaVersionErrorList = S.Array(SchemaVersionErrorItem);
export interface Field {
  FieldName?: string;
  Label?: string;
  Description?: string;
  FieldType?: FieldDataType;
  IsPrimaryKey?: boolean;
  IsNullable?: boolean;
  IsRetrievable?: boolean;
  IsFilterable?: boolean;
  IsPartitionable?: boolean;
  IsCreateable?: boolean;
  IsUpdateable?: boolean;
  IsUpsertable?: boolean;
  IsDefaultOnCreate?: boolean;
  SupportedValues?: string[];
  SupportedFilterOperators?: FieldFilterOperator[];
  ParentField?: string;
  NativeDataType?: string;
  CustomProperties?: { [key: string]: string | undefined };
}
export const Field = S.suspend(() =>
  S.Struct({
    FieldName: S.optional(S.String),
    Label: S.optional(S.String),
    Description: S.optional(S.String),
    FieldType: S.optional(FieldDataType),
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
  }),
).annotations({ identifier: "Field" }) as any as S.Schema<Field>;
export type FieldsList = Field[];
export const FieldsList = S.Array(Field);
export interface Integration {
  SourceArn: string;
  TargetArn: string;
  Description?: string;
  IntegrationName: string;
  IntegrationArn: string;
  KmsKeyId?: string;
  AdditionalEncryptionContext?: { [key: string]: string | undefined };
  Tags?: Tag[];
  Status: IntegrationStatus;
  CreateTime: Date;
  IntegrationConfig?: IntegrationConfig;
  Errors?: IntegrationError[];
  DataFilter?: string;
}
export const Integration = S.suspend(() =>
  S.Struct({
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
    Status: IntegrationStatus,
    CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    IntegrationConfig: S.optional(IntegrationConfig),
    Errors: S.optional(IntegrationErrorList),
    DataFilter: S.optional(S.String),
  }),
).annotations({ identifier: "Integration" }) as any as S.Schema<Integration>;
export type IntegrationsList = Integration[];
export const IntegrationsList = S.Array(Integration);
export interface ColumnStatisticsTaskSettings {
  DatabaseName?: string;
  TableName?: string;
  Schedule?: Schedule;
  ColumnNameList?: string[];
  CatalogID?: string;
  Role?: string;
  SampleSize?: number;
  SecurityConfiguration?: string;
  ScheduleType?: ScheduleType;
  SettingSource?: SettingSource;
  LastExecutionAttempt?: ExecutionAttempt;
}
export const ColumnStatisticsTaskSettings = S.suspend(() =>
  S.Struct({
    DatabaseName: S.optional(S.String),
    TableName: S.optional(S.String),
    Schedule: S.optional(Schedule),
    ColumnNameList: S.optional(ColumnNameList),
    CatalogID: S.optional(S.String),
    Role: S.optional(S.String),
    SampleSize: S.optional(S.Number),
    SecurityConfiguration: S.optional(S.String),
    ScheduleType: S.optional(ScheduleType),
    SettingSource: S.optional(SettingSource),
    LastExecutionAttempt: S.optional(ExecutionAttempt),
  }),
).annotations({
  identifier: "ColumnStatisticsTaskSettings",
}) as any as S.Schema<ColumnStatisticsTaskSettings>;
export interface TaskRunProperties {
  TaskType?: TaskType;
  ImportLabelsTaskRunProperties?: ImportLabelsTaskRunProperties;
  ExportLabelsTaskRunProperties?: ExportLabelsTaskRunProperties;
  LabelingSetGenerationTaskRunProperties?: LabelingSetGenerationTaskRunProperties;
  FindMatchesTaskRunProperties?: FindMatchesTaskRunProperties;
}
export const TaskRunProperties = S.suspend(() =>
  S.Struct({
    TaskType: S.optional(TaskType),
    ImportLabelsTaskRunProperties: S.optional(ImportLabelsTaskRunProperties),
    ExportLabelsTaskRunProperties: S.optional(ExportLabelsTaskRunProperties),
    LabelingSetGenerationTaskRunProperties: S.optional(
      LabelingSetGenerationTaskRunProperties,
    ),
    FindMatchesTaskRunProperties: S.optional(FindMatchesTaskRunProperties),
  }),
).annotations({
  identifier: "TaskRunProperties",
}) as any as S.Schema<TaskRunProperties>;
export interface TaskRun {
  TransformId?: string;
  TaskRunId?: string;
  Status?: TaskStatusType;
  LogGroupName?: string;
  Properties?: TaskRunProperties;
  ErrorString?: string;
  StartedOn?: Date;
  LastModifiedOn?: Date;
  CompletedOn?: Date;
  ExecutionTime?: number;
}
export const TaskRun = S.suspend(() =>
  S.Struct({
    TransformId: S.optional(S.String),
    TaskRunId: S.optional(S.String),
    Status: S.optional(TaskStatusType),
    LogGroupName: S.optional(S.String),
    Properties: S.optional(TaskRunProperties),
    ErrorString: S.optional(S.String),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExecutionTime: S.optional(S.Number),
  }),
).annotations({ identifier: "TaskRun" }) as any as S.Schema<TaskRun>;
export type TaskRunList = TaskRun[];
export const TaskRunList = S.Array(TaskRun);
export interface PartitionIndexDescriptor {
  IndexName: string;
  Keys: KeySchemaElement[];
  IndexStatus: PartitionIndexStatus;
  BackfillErrors?: BackfillError[];
}
export const PartitionIndexDescriptor = S.suspend(() =>
  S.Struct({
    IndexName: S.String,
    Keys: KeySchemaElementList,
    IndexStatus: PartitionIndexStatus,
    BackfillErrors: S.optional(BackfillErrors),
  }),
).annotations({
  identifier: "PartitionIndexDescriptor",
}) as any as S.Schema<PartitionIndexDescriptor>;
export type PartitionIndexDescriptorList = PartitionIndexDescriptor[];
export const PartitionIndexDescriptorList = S.Array(PartitionIndexDescriptor);
export interface ColumnRowFilter {
  ColumnName?: string;
  RowFilterExpression?: string;
}
export const ColumnRowFilter = S.suspend(() =>
  S.Struct({
    ColumnName: S.optional(S.String),
    RowFilterExpression: S.optional(S.String),
  }),
).annotations({
  identifier: "ColumnRowFilter",
}) as any as S.Schema<ColumnRowFilter>;
export type ColumnRowFilterList = ColumnRowFilter[];
export const ColumnRowFilterList = S.Array(ColumnRowFilter);
export interface ConnectionTypeBrief {
  ConnectionType?: ConnectionType;
  DisplayName?: string;
  Vendor?: string;
  Description?: string;
  Categories?: string[];
  Capabilities?: Capabilities;
  LogoUrl?: string;
  ConnectionTypeVariants?: ConnectionTypeVariant[];
}
export const ConnectionTypeBrief = S.suspend(() =>
  S.Struct({
    ConnectionType: S.optional(ConnectionType),
    DisplayName: S.optional(S.String),
    Vendor: S.optional(S.String),
    Description: S.optional(S.String),
    Categories: S.optional(ListOfString),
    Capabilities: S.optional(Capabilities),
    LogoUrl: S.optional(S.String),
    ConnectionTypeVariants: S.optional(ConnectionTypeVariantList),
  }),
).annotations({
  identifier: "ConnectionTypeBrief",
}) as any as S.Schema<ConnectionTypeBrief>;
export type ConnectionTypeList = ConnectionTypeBrief[];
export const ConnectionTypeList = S.Array(ConnectionTypeBrief);
export interface CrawlerHistory {
  CrawlId?: string;
  State?: CrawlerHistoryState;
  StartTime?: Date;
  EndTime?: Date;
  Summary?: string;
  ErrorMessage?: string;
  LogGroup?: string;
  LogStream?: string;
  MessagePrefix?: string;
  DPUHour?: number;
}
export const CrawlerHistory = S.suspend(() =>
  S.Struct({
    CrawlId: S.optional(S.String),
    State: S.optional(CrawlerHistoryState),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Summary: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
    LogGroup: S.optional(S.String),
    LogStream: S.optional(S.String),
    MessagePrefix: S.optional(S.String),
    DPUHour: S.optional(S.Number),
  }),
).annotations({
  identifier: "CrawlerHistory",
}) as any as S.Schema<CrawlerHistory>;
export type CrawlerHistoryList = CrawlerHistory[];
export const CrawlerHistoryList = S.Array(CrawlerHistory);
export interface DataQualityResultDescription {
  ResultId?: string;
  DataSource?: DataSource;
  JobName?: string;
  JobRunId?: string;
  StartedOn?: Date;
}
export const DataQualityResultDescription = S.suspend(() =>
  S.Struct({
    ResultId: S.optional(S.String),
    DataSource: S.optional(DataSource),
    JobName: S.optional(S.String),
    JobRunId: S.optional(S.String),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DataQualityResultDescription",
}) as any as S.Schema<DataQualityResultDescription>;
export type DataQualityResultDescriptionList = DataQualityResultDescription[];
export const DataQualityResultDescriptionList = S.Array(
  DataQualityResultDescription,
);
export interface DataQualityRuleRecommendationRunDescription {
  RunId?: string;
  Status?: TaskStatusType;
  StartedOn?: Date;
  DataSource?: DataSource;
}
export const DataQualityRuleRecommendationRunDescription = S.suspend(() =>
  S.Struct({
    RunId: S.optional(S.String),
    Status: S.optional(TaskStatusType),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DataSource: S.optional(DataSource),
  }),
).annotations({
  identifier: "DataQualityRuleRecommendationRunDescription",
}) as any as S.Schema<DataQualityRuleRecommendationRunDescription>;
export type DataQualityRuleRecommendationRunList =
  DataQualityRuleRecommendationRunDescription[];
export const DataQualityRuleRecommendationRunList = S.Array(
  DataQualityRuleRecommendationRunDescription,
);
export interface DataQualityRulesetEvaluationRunDescription {
  RunId?: string;
  Status?: TaskStatusType;
  StartedOn?: Date;
  DataSource?: DataSource;
}
export const DataQualityRulesetEvaluationRunDescription = S.suspend(() =>
  S.Struct({
    RunId: S.optional(S.String),
    Status: S.optional(TaskStatusType),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    DataSource: S.optional(DataSource),
  }),
).annotations({
  identifier: "DataQualityRulesetEvaluationRunDescription",
}) as any as S.Schema<DataQualityRulesetEvaluationRunDescription>;
export type DataQualityRulesetEvaluationRunList =
  DataQualityRulesetEvaluationRunDescription[];
export const DataQualityRulesetEvaluationRunList = S.Array(
  DataQualityRulesetEvaluationRunDescription,
);
export interface DataQualityRulesetListDetails {
  Name?: string;
  Description?: string;
  CreatedOn?: Date;
  LastModifiedOn?: Date;
  TargetTable?: DataQualityTargetTable;
  RecommendationRunId?: string;
  RuleCount?: number;
}
export const DataQualityRulesetListDetails = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    CreatedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    TargetTable: S.optional(DataQualityTargetTable),
    RecommendationRunId: S.optional(S.String),
    RuleCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "DataQualityRulesetListDetails",
}) as any as S.Schema<DataQualityRulesetListDetails>;
export type DataQualityRulesetList = DataQualityRulesetListDetails[];
export const DataQualityRulesetList = S.Array(DataQualityRulesetListDetails);
export interface StatisticAnnotation {
  ProfileId?: string;
  StatisticId?: string;
  StatisticRecordedOn?: Date;
  InclusionAnnotation?: TimestampedInclusionAnnotation;
}
export const StatisticAnnotation = S.suspend(() =>
  S.Struct({
    ProfileId: S.optional(S.String),
    StatisticId: S.optional(S.String),
    StatisticRecordedOn: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    InclusionAnnotation: S.optional(TimestampedInclusionAnnotation),
  }),
).annotations({
  identifier: "StatisticAnnotation",
}) as any as S.Schema<StatisticAnnotation>;
export type AnnotationList = StatisticAnnotation[];
export const AnnotationList = S.Array(StatisticAnnotation);
export interface StatisticSummary {
  StatisticId?: string;
  ProfileId?: string;
  RunIdentifier?: RunIdentifier;
  StatisticName?: string;
  DoubleValue?: number;
  EvaluationLevel?: StatisticEvaluationLevel;
  ColumnsReferenced?: string[];
  ReferencedDatasets?: string[];
  StatisticProperties?: { [key: string]: string | undefined };
  RecordedOn?: Date;
  InclusionAnnotation?: TimestampedInclusionAnnotation;
}
export const StatisticSummary = S.suspend(() =>
  S.Struct({
    StatisticId: S.optional(S.String),
    ProfileId: S.optional(S.String),
    RunIdentifier: S.optional(RunIdentifier),
    StatisticName: S.optional(S.String),
    DoubleValue: S.optional(S.Number),
    EvaluationLevel: S.optional(StatisticEvaluationLevel),
    ColumnsReferenced: S.optional(ColumnNameList),
    ReferencedDatasets: S.optional(ReferenceDatasetsList),
    StatisticProperties: S.optional(StatisticPropertiesMap),
    RecordedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    InclusionAnnotation: S.optional(TimestampedInclusionAnnotation),
  }),
).annotations({
  identifier: "StatisticSummary",
}) as any as S.Schema<StatisticSummary>;
export type StatisticSummaryList = StatisticSummary[];
export const StatisticSummaryList = S.Array(StatisticSummary);
export interface IntegrationResourceProperty {
  ResourceArn: string;
  ResourcePropertyArn?: string;
  SourceProcessingProperties?: SourceProcessingProperties;
  TargetProcessingProperties?: TargetProcessingProperties;
}
export const IntegrationResourceProperty = S.suspend(() =>
  S.Struct({
    ResourceArn: S.String,
    ResourcePropertyArn: S.optional(S.String),
    SourceProcessingProperties: S.optional(SourceProcessingProperties),
    TargetProcessingProperties: S.optional(TargetProcessingProperties),
  }),
).annotations({
  identifier: "IntegrationResourceProperty",
}) as any as S.Schema<IntegrationResourceProperty>;
export type IntegrationResourcePropertyList = IntegrationResourceProperty[];
export const IntegrationResourcePropertyList = S.Array(
  IntegrationResourceProperty,
);
export type PropertyNameOverrides = { [key: string]: string | undefined };
export const PropertyNameOverrides = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface ConfusionMatrix {
  NumTruePositives?: number;
  NumFalsePositives?: number;
  NumTrueNegatives?: number;
  NumFalseNegatives?: number;
}
export const ConfusionMatrix = S.suspend(() =>
  S.Struct({
    NumTruePositives: S.optional(S.Number),
    NumFalsePositives: S.optional(S.Number),
    NumTrueNegatives: S.optional(S.Number),
    NumFalseNegatives: S.optional(S.Number),
  }),
).annotations({
  identifier: "ConfusionMatrix",
}) as any as S.Schema<ConfusionMatrix>;
export interface ColumnImportance {
  ColumnName?: string;
  Importance?: number;
}
export const ColumnImportance = S.suspend(() =>
  S.Struct({
    ColumnName: S.optional(S.String),
    Importance: S.optional(S.Number),
  }),
).annotations({
  identifier: "ColumnImportance",
}) as any as S.Schema<ColumnImportance>;
export type ColumnImportanceList = ColumnImportance[];
export const ColumnImportanceList = S.Array(ColumnImportance);
export interface OtherMetadataValueListItem {
  MetadataValue?: string;
  CreatedTime?: string;
}
export const OtherMetadataValueListItem = S.suspend(() =>
  S.Struct({
    MetadataValue: S.optional(S.String),
    CreatedTime: S.optional(S.String),
  }),
).annotations({
  identifier: "OtherMetadataValueListItem",
}) as any as S.Schema<OtherMetadataValueListItem>;
export type OtherMetadataValueList = OtherMetadataValueListItem[];
export const OtherMetadataValueList = S.Array(OtherMetadataValueListItem);
export interface BatchDeleteConnectionResponse {
  Succeeded?: string[];
  Errors?: { [key: string]: ErrorDetail | undefined };
}
export const BatchDeleteConnectionResponse = S.suspend(() =>
  S.Struct({
    Succeeded: S.optional(NameStringList),
    Errors: S.optional(ErrorByName),
  }),
).annotations({
  identifier: "BatchDeleteConnectionResponse",
}) as any as S.Schema<BatchDeleteConnectionResponse>;
export interface BatchDeletePartitionResponse {
  Errors?: PartitionError[];
}
export const BatchDeletePartitionResponse = S.suspend(() =>
  S.Struct({ Errors: S.optional(PartitionErrors) }),
).annotations({
  identifier: "BatchDeletePartitionResponse",
}) as any as S.Schema<BatchDeletePartitionResponse>;
export interface BatchGetBlueprintsResponse {
  Blueprints?: Blueprint[];
  MissingBlueprints?: string[];
}
export const BatchGetBlueprintsResponse = S.suspend(() =>
  S.Struct({
    Blueprints: S.optional(Blueprints),
    MissingBlueprints: S.optional(BlueprintNames),
  }),
).annotations({
  identifier: "BatchGetBlueprintsResponse",
}) as any as S.Schema<BatchGetBlueprintsResponse>;
export interface BatchGetCrawlersResponse {
  Crawlers?: Crawler[];
  CrawlersNotFound?: string[];
}
export const BatchGetCrawlersResponse = S.suspend(() =>
  S.Struct({
    Crawlers: S.optional(CrawlerList),
    CrawlersNotFound: S.optional(CrawlerNameList),
  }),
).annotations({
  identifier: "BatchGetCrawlersResponse",
}) as any as S.Schema<BatchGetCrawlersResponse>;
export interface BatchGetTableOptimizerResponse {
  TableOptimizers?: BatchTableOptimizer[];
  Failures?: BatchGetTableOptimizerError[];
}
export const BatchGetTableOptimizerResponse = S.suspend(() =>
  S.Struct({
    TableOptimizers: S.optional(BatchTableOptimizers),
    Failures: S.optional(BatchGetTableOptimizerErrors),
  }),
).annotations({
  identifier: "BatchGetTableOptimizerResponse",
}) as any as S.Schema<BatchGetTableOptimizerResponse>;
export interface BatchPutDataQualityStatisticAnnotationResponse {
  FailedInclusionAnnotations?: AnnotationError[];
}
export const BatchPutDataQualityStatisticAnnotationResponse = S.suspend(() =>
  S.Struct({ FailedInclusionAnnotations: S.optional(AnnotationErrorList) }),
).annotations({
  identifier: "BatchPutDataQualityStatisticAnnotationResponse",
}) as any as S.Schema<BatchPutDataQualityStatisticAnnotationResponse>;
export interface BatchUpdatePartitionResponse {
  Errors?: BatchUpdatePartitionFailureEntry[];
}
export const BatchUpdatePartitionResponse = S.suspend(() =>
  S.Struct({ Errors: S.optional(BatchUpdatePartitionFailureList) }),
).annotations({
  identifier: "BatchUpdatePartitionResponse",
}) as any as S.Schema<BatchUpdatePartitionResponse>;
export interface CreateCatalogRequest {
  Name: string;
  CatalogInput: CatalogInput;
  Tags?: { [key: string]: string | undefined };
}
export const CreateCatalogRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    CatalogInput: CatalogInput,
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateCatalogRequest",
}) as any as S.Schema<CreateCatalogRequest>;
export interface CreateCatalogResponse {}
export const CreateCatalogResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateCatalogResponse",
}) as any as S.Schema<CreateCatalogResponse>;
export interface CreateIntegrationResponse {
  SourceArn: string;
  TargetArn: string;
  IntegrationName: string;
  Description?: string;
  IntegrationArn: string;
  KmsKeyId?: string;
  AdditionalEncryptionContext?: { [key: string]: string | undefined };
  Tags?: Tag[];
  Status: IntegrationStatus;
  CreateTime: Date;
  Errors?: IntegrationError[];
  DataFilter?: string;
  IntegrationConfig?: IntegrationConfig;
}
export const CreateIntegrationResponse = S.suspend(() =>
  S.Struct({
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
    Status: IntegrationStatus,
    CreateTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    Errors: S.optional(IntegrationErrorList),
    DataFilter: S.optional(S.String),
    IntegrationConfig: S.optional(IntegrationConfig),
  }),
).annotations({
  identifier: "CreateIntegrationResponse",
}) as any as S.Schema<CreateIntegrationResponse>;
export interface CreateMLTransformResponse {
  TransformId?: string;
}
export const CreateMLTransformResponse = S.suspend(() =>
  S.Struct({ TransformId: S.optional(S.String) }),
).annotations({
  identifier: "CreateMLTransformResponse",
}) as any as S.Schema<CreateMLTransformResponse>;
export interface CreateScriptResponse {
  PythonScript?: string;
  ScalaCode?: string;
}
export const CreateScriptResponse = S.suspend(() =>
  S.Struct({
    PythonScript: S.optional(S.String),
    ScalaCode: S.optional(S.String),
  }),
).annotations({
  identifier: "CreateScriptResponse",
}) as any as S.Schema<CreateScriptResponse>;
export interface CreateSecurityConfigurationResponse {
  Name?: string;
  CreatedTimestamp?: Date;
}
export const CreateSecurityConfigurationResponse = S.suspend(() =>
  S.Struct({
    Name: S.optional(S.String),
    CreatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "CreateSecurityConfigurationResponse",
}) as any as S.Schema<CreateSecurityConfigurationResponse>;
export interface IcebergStructField {
  Id: number;
  Name: string;
  Type: any;
  Required: boolean;
  Doc?: string;
  InitialDefault?: any;
  WriteDefault?: any;
}
export const IcebergStructField = S.suspend(() =>
  S.Struct({
    Id: S.Number,
    Name: S.String,
    Type: S.Any,
    Required: S.Boolean,
    Doc: S.optional(S.String),
    InitialDefault: S.optional(S.Any),
    WriteDefault: S.optional(S.Any),
  }),
).annotations({
  identifier: "IcebergStructField",
}) as any as S.Schema<IcebergStructField>;
export type IcebergStructFieldList = IcebergStructField[];
export const IcebergStructFieldList = S.Array(IcebergStructField);
export interface IcebergPartitionField {
  SourceId: number;
  Transform: string;
  Name: string;
  FieldId?: number;
}
export const IcebergPartitionField = S.suspend(() =>
  S.Struct({
    SourceId: S.Number,
    Transform: S.String,
    Name: S.String,
    FieldId: S.optional(S.Number),
  }),
).annotations({
  identifier: "IcebergPartitionField",
}) as any as S.Schema<IcebergPartitionField>;
export type IcebergPartitionSpecFieldList = IcebergPartitionField[];
export const IcebergPartitionSpecFieldList = S.Array(IcebergPartitionField);
export interface IcebergSortField {
  SourceId: number;
  Transform: string;
  Direction: IcebergSortDirection;
  NullOrder: IcebergNullOrder;
}
export const IcebergSortField = S.suspend(() =>
  S.Struct({
    SourceId: S.Number,
    Transform: S.String,
    Direction: IcebergSortDirection,
    NullOrder: IcebergNullOrder,
  }),
).annotations({
  identifier: "IcebergSortField",
}) as any as S.Schema<IcebergSortField>;
export type IcebergSortOrderFieldList = IcebergSortField[];
export const IcebergSortOrderFieldList = S.Array(IcebergSortField);
export interface CreateTableOptimizerRequest {
  CatalogId: string;
  DatabaseName: string;
  TableName: string;
  Type: TableOptimizerType;
  TableOptimizerConfiguration: TableOptimizerConfiguration;
}
export const CreateTableOptimizerRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.String,
    DatabaseName: S.String,
    TableName: S.String,
    Type: TableOptimizerType,
    TableOptimizerConfiguration: TableOptimizerConfiguration,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateTableOptimizerRequest",
}) as any as S.Schema<CreateTableOptimizerRequest>;
export interface CreateTableOptimizerResponse {}
export const CreateTableOptimizerResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "CreateTableOptimizerResponse",
}) as any as S.Schema<CreateTableOptimizerResponse>;
export interface CreateTriggerResponse {
  Name?: string;
}
export const CreateTriggerResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "CreateTriggerResponse",
}) as any as S.Schema<CreateTriggerResponse>;
export interface CreateUsageProfileRequest {
  Name: string;
  Description?: string;
  Configuration: ProfileConfiguration;
  Tags?: { [key: string]: string | undefined };
}
export const CreateUsageProfileRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.optional(S.String),
    Configuration: ProfileConfiguration,
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateUsageProfileRequest",
}) as any as S.Schema<CreateUsageProfileRequest>;
export interface DeleteSchemaVersionsResponse {
  SchemaVersionErrors?: SchemaVersionErrorItem[];
}
export const DeleteSchemaVersionsResponse = S.suspend(() =>
  S.Struct({ SchemaVersionErrors: S.optional(SchemaVersionErrorList) }),
).annotations({
  identifier: "DeleteSchemaVersionsResponse",
}) as any as S.Schema<DeleteSchemaVersionsResponse>;
export interface DescribeEntityResponse {
  Fields?: Field[];
  NextToken?: string;
}
export const DescribeEntityResponse = S.suspend(() =>
  S.Struct({ Fields: S.optional(FieldsList), NextToken: S.optional(S.String) }),
).annotations({
  identifier: "DescribeEntityResponse",
}) as any as S.Schema<DescribeEntityResponse>;
export interface DescribeIntegrationsResponse {
  Integrations?: Integration[];
  Marker?: string;
}
export const DescribeIntegrationsResponse = S.suspend(() =>
  S.Struct({
    Integrations: S.optional(IntegrationsList),
    Marker: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeIntegrationsResponse",
}) as any as S.Schema<DescribeIntegrationsResponse>;
export interface GetClassifierResponse {
  Classifier?: Classifier;
}
export const GetClassifierResponse = S.suspend(() =>
  S.Struct({ Classifier: S.optional(Classifier) }),
).annotations({
  identifier: "GetClassifierResponse",
}) as any as S.Schema<GetClassifierResponse>;
export interface GetColumnStatisticsTaskSettingsResponse {
  ColumnStatisticsTaskSettings?: ColumnStatisticsTaskSettings;
}
export const GetColumnStatisticsTaskSettingsResponse = S.suspend(() =>
  S.Struct({
    ColumnStatisticsTaskSettings: S.optional(ColumnStatisticsTaskSettings),
  }),
).annotations({
  identifier: "GetColumnStatisticsTaskSettingsResponse",
}) as any as S.Schema<GetColumnStatisticsTaskSettingsResponse>;
export interface GetJobRunResponse {
  JobRun?: JobRun;
}
export const GetJobRunResponse = S.suspend(() =>
  S.Struct({ JobRun: S.optional(JobRun) }),
).annotations({
  identifier: "GetJobRunResponse",
}) as any as S.Schema<GetJobRunResponse>;
export interface GetMLTaskRunResponse {
  TransformId?: string;
  TaskRunId?: string;
  Status?: TaskStatusType;
  LogGroupName?: string;
  Properties?: TaskRunProperties;
  ErrorString?: string;
  StartedOn?: Date;
  LastModifiedOn?: Date;
  CompletedOn?: Date;
  ExecutionTime?: number;
}
export const GetMLTaskRunResponse = S.suspend(() =>
  S.Struct({
    TransformId: S.optional(S.String),
    TaskRunId: S.optional(S.String),
    Status: S.optional(TaskStatusType),
    LogGroupName: S.optional(S.String),
    Properties: S.optional(TaskRunProperties),
    ErrorString: S.optional(S.String),
    StartedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    LastModifiedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    CompletedOn: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    ExecutionTime: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetMLTaskRunResponse",
}) as any as S.Schema<GetMLTaskRunResponse>;
export interface GetMLTaskRunsResponse {
  TaskRuns?: TaskRun[];
  NextToken?: string;
}
export const GetMLTaskRunsResponse = S.suspend(() =>
  S.Struct({
    TaskRuns: S.optional(TaskRunList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetMLTaskRunsResponse",
}) as any as S.Schema<GetMLTaskRunsResponse>;
export interface GetPartitionIndexesResponse {
  PartitionIndexDescriptorList?: PartitionIndexDescriptor[];
  NextToken?: string;
}
export const GetPartitionIndexesResponse = S.suspend(() =>
  S.Struct({
    PartitionIndexDescriptorList: S.optional(PartitionIndexDescriptorList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPartitionIndexesResponse",
}) as any as S.Schema<GetPartitionIndexesResponse>;
export interface GetUnfilteredPartitionMetadataResponse {
  Partition?: Partition;
  AuthorizedColumns?: string[];
  IsRegisteredWithLakeFormation?: boolean;
}
export const GetUnfilteredPartitionMetadataResponse = S.suspend(() =>
  S.Struct({
    Partition: S.optional(Partition),
    AuthorizedColumns: S.optional(NameStringList),
    IsRegisteredWithLakeFormation: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "GetUnfilteredPartitionMetadataResponse",
}) as any as S.Schema<GetUnfilteredPartitionMetadataResponse>;
export interface GetUnfilteredTableMetadataResponse {
  Table?: Table;
  AuthorizedColumns?: string[];
  IsRegisteredWithLakeFormation?: boolean;
  CellFilters?: ColumnRowFilter[];
  QueryAuthorizationId?: string;
  IsMultiDialectView?: boolean;
  IsMaterializedView?: boolean;
  ResourceArn?: string;
  IsProtected?: boolean;
  Permissions?: Permission[];
  RowFilter?: string;
}
export const GetUnfilteredTableMetadataResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetUnfilteredTableMetadataResponse",
}) as any as S.Schema<GetUnfilteredTableMetadataResponse>;
export interface GetWorkflowRunResponse {
  Run?: WorkflowRun;
}
export const GetWorkflowRunResponse = S.suspend(() =>
  S.Struct({ Run: S.optional(WorkflowRun) }),
).annotations({
  identifier: "GetWorkflowRunResponse",
}) as any as S.Schema<GetWorkflowRunResponse>;
export interface ListConnectionTypesResponse {
  ConnectionTypes?: ConnectionTypeBrief[];
  NextToken?: string;
}
export const ListConnectionTypesResponse = S.suspend(() =>
  S.Struct({
    ConnectionTypes: S.optional(ConnectionTypeList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListConnectionTypesResponse",
}) as any as S.Schema<ListConnectionTypesResponse>;
export interface ListCrawlsResponse {
  Crawls?: CrawlerHistory[];
  NextToken?: string;
}
export const ListCrawlsResponse = S.suspend(() =>
  S.Struct({
    Crawls: S.optional(CrawlerHistoryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCrawlsResponse",
}) as any as S.Schema<ListCrawlsResponse>;
export interface ListDataQualityResultsResponse {
  Results: DataQualityResultDescription[];
  NextToken?: string;
}
export const ListDataQualityResultsResponse = S.suspend(() =>
  S.Struct({
    Results: DataQualityResultDescriptionList,
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataQualityResultsResponse",
}) as any as S.Schema<ListDataQualityResultsResponse>;
export interface ListDataQualityRuleRecommendationRunsResponse {
  Runs?: DataQualityRuleRecommendationRunDescription[];
  NextToken?: string;
}
export const ListDataQualityRuleRecommendationRunsResponse = S.suspend(() =>
  S.Struct({
    Runs: S.optional(DataQualityRuleRecommendationRunList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataQualityRuleRecommendationRunsResponse",
}) as any as S.Schema<ListDataQualityRuleRecommendationRunsResponse>;
export interface ListDataQualityRulesetEvaluationRunsResponse {
  Runs?: DataQualityRulesetEvaluationRunDescription[];
  NextToken?: string;
}
export const ListDataQualityRulesetEvaluationRunsResponse = S.suspend(() =>
  S.Struct({
    Runs: S.optional(DataQualityRulesetEvaluationRunList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataQualityRulesetEvaluationRunsResponse",
}) as any as S.Schema<ListDataQualityRulesetEvaluationRunsResponse>;
export interface ListDataQualityRulesetsResponse {
  Rulesets?: DataQualityRulesetListDetails[];
  NextToken?: string;
}
export const ListDataQualityRulesetsResponse = S.suspend(() =>
  S.Struct({
    Rulesets: S.optional(DataQualityRulesetList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataQualityRulesetsResponse",
}) as any as S.Schema<ListDataQualityRulesetsResponse>;
export interface ListDataQualityStatisticAnnotationsResponse {
  Annotations?: StatisticAnnotation[];
  NextToken?: string;
}
export const ListDataQualityStatisticAnnotationsResponse = S.suspend(() =>
  S.Struct({
    Annotations: S.optional(AnnotationList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataQualityStatisticAnnotationsResponse",
}) as any as S.Schema<ListDataQualityStatisticAnnotationsResponse>;
export interface ListDataQualityStatisticsResponse {
  Statistics?: StatisticSummary[];
  NextToken?: string;
}
export const ListDataQualityStatisticsResponse = S.suspend(() =>
  S.Struct({
    Statistics: S.optional(StatisticSummaryList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDataQualityStatisticsResponse",
}) as any as S.Schema<ListDataQualityStatisticsResponse>;
export interface ListIntegrationResourcePropertiesResponse {
  IntegrationResourcePropertyList?: IntegrationResourceProperty[];
  Marker?: string;
}
export const ListIntegrationResourcePropertiesResponse = S.suspend(() =>
  S.Struct({
    IntegrationResourcePropertyList: S.optional(
      IntegrationResourcePropertyList,
    ),
    Marker: S.optional(S.String),
  }),
).annotations({
  identifier: "ListIntegrationResourcePropertiesResponse",
}) as any as S.Schema<ListIntegrationResourcePropertiesResponse>;
export interface StartDataQualityRuleRecommendationRunResponse {
  RunId?: string;
}
export const StartDataQualityRuleRecommendationRunResponse = S.suspend(() =>
  S.Struct({ RunId: S.optional(S.String) }),
).annotations({
  identifier: "StartDataQualityRuleRecommendationRunResponse",
}) as any as S.Schema<StartDataQualityRuleRecommendationRunResponse>;
export interface IcebergEncryptedKey {
  KeyId: string;
  EncryptedKeyMetadata: string;
  EncryptedById?: string;
  Properties?: { [key: string]: string | undefined };
}
export const IcebergEncryptedKey = S.suspend(() =>
  S.Struct({
    KeyId: S.String,
    EncryptedKeyMetadata: S.String,
    EncryptedById: S.optional(S.String),
    Properties: S.optional(StringToStringMap),
  }),
).annotations({
  identifier: "IcebergEncryptedKey",
}) as any as S.Schema<IcebergEncryptedKey>;
export interface ComputeEnvironmentConfiguration {
  Name: string;
  Description: string;
  ComputeEnvironment: ComputeEnvironment;
  SupportedAuthenticationTypes: AuthenticationType[];
  ConnectionOptions: { [key: string]: Property | undefined };
  ConnectionPropertyNameOverrides: { [key: string]: string | undefined };
  ConnectionOptionNameOverrides: { [key: string]: string | undefined };
  ConnectionPropertiesRequiredOverrides: string[];
  PhysicalConnectionPropertiesRequired?: boolean;
}
export const ComputeEnvironmentConfiguration = S.suspend(() =>
  S.Struct({
    Name: S.String,
    Description: S.String,
    ComputeEnvironment: ComputeEnvironment,
    SupportedAuthenticationTypes: AuthenticationTypes,
    ConnectionOptions: PropertiesMap,
    ConnectionPropertyNameOverrides: PropertyNameOverrides,
    ConnectionOptionNameOverrides: PropertyNameOverrides,
    ConnectionPropertiesRequiredOverrides: ListOfString,
    PhysicalConnectionPropertiesRequired: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ComputeEnvironmentConfiguration",
}) as any as S.Schema<ComputeEnvironmentConfiguration>;
export interface FindMatchesMetrics {
  AreaUnderPRCurve?: number;
  Precision?: number;
  Recall?: number;
  F1?: number;
  ConfusionMatrix?: ConfusionMatrix;
  ColumnImportances?: ColumnImportance[];
}
export const FindMatchesMetrics = S.suspend(() =>
  S.Struct({
    AreaUnderPRCurve: S.optional(S.Number),
    Precision: S.optional(S.Number),
    Recall: S.optional(S.Number),
    F1: S.optional(S.Number),
    ConfusionMatrix: S.optional(ConfusionMatrix),
    ColumnImportances: S.optional(ColumnImportanceList),
  }),
).annotations({
  identifier: "FindMatchesMetrics",
}) as any as S.Schema<FindMatchesMetrics>;
export interface MetadataInfo {
  MetadataValue?: string;
  CreatedTime?: string;
  OtherMetadataValueList?: OtherMetadataValueListItem[];
}
export const MetadataInfo = S.suspend(() =>
  S.Struct({
    MetadataValue: S.optional(S.String),
    CreatedTime: S.optional(S.String),
    OtherMetadataValueList: S.optional(OtherMetadataValueList),
  }),
).annotations({ identifier: "MetadataInfo" }) as any as S.Schema<MetadataInfo>;
export interface IcebergSchema {
  SchemaId?: number;
  IdentifierFieldIds?: number[];
  Type?: IcebergStructTypeEnum;
  Fields: IcebergStructField[];
}
export const IcebergSchema = S.suspend(() =>
  S.Struct({
    SchemaId: S.optional(S.Number),
    IdentifierFieldIds: S.optional(IntegerList),
    Type: S.optional(IcebergStructTypeEnum),
    Fields: IcebergStructFieldList,
  }),
).annotations({
  identifier: "IcebergSchema",
}) as any as S.Schema<IcebergSchema>;
export interface IcebergPartitionSpec {
  Fields: IcebergPartitionField[];
  SpecId?: number;
}
export const IcebergPartitionSpec = S.suspend(() =>
  S.Struct({
    Fields: IcebergPartitionSpecFieldList,
    SpecId: S.optional(S.Number),
  }),
).annotations({
  identifier: "IcebergPartitionSpec",
}) as any as S.Schema<IcebergPartitionSpec>;
export interface IcebergSortOrder {
  OrderId: number;
  Fields: IcebergSortField[];
}
export const IcebergSortOrder = S.suspend(() =>
  S.Struct({ OrderId: S.Number, Fields: IcebergSortOrderFieldList }),
).annotations({
  identifier: "IcebergSortOrder",
}) as any as S.Schema<IcebergSortOrder>;
export interface ViewValidation {
  Dialect?: ViewDialect;
  DialectVersion?: string;
  ViewValidationText?: string;
  UpdateTime?: Date;
  State?: ResourceState;
  Error?: ErrorDetail;
}
export const ViewValidation = S.suspend(() =>
  S.Struct({
    Dialect: S.optional(ViewDialect),
    DialectVersion: S.optional(S.String),
    ViewValidationText: S.optional(S.String),
    UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    State: S.optional(ResourceState),
    Error: S.optional(ErrorDetail),
  }),
).annotations({
  identifier: "ViewValidation",
}) as any as S.Schema<ViewValidation>;
export type ViewValidationList = ViewValidation[];
export const ViewValidationList = S.Array(ViewValidation);
export interface IcebergTableUpdate {
  Schema: IcebergSchema;
  PartitionSpec?: IcebergPartitionSpec;
  SortOrder?: IcebergSortOrder;
  Location: string;
  Properties?: { [key: string]: string | undefined };
  Action?: IcebergUpdateAction;
  EncryptionKey?: IcebergEncryptedKey;
  KeyId?: string;
}
export const IcebergTableUpdate = S.suspend(() =>
  S.Struct({
    Schema: IcebergSchema,
    PartitionSpec: S.optional(IcebergPartitionSpec),
    SortOrder: S.optional(IcebergSortOrder),
    Location: S.String,
    Properties: S.optional(StringToStringMap),
    Action: S.optional(IcebergUpdateAction),
    EncryptionKey: S.optional(IcebergEncryptedKey),
    KeyId: S.optional(S.String),
  }),
).annotations({
  identifier: "IcebergTableUpdate",
}) as any as S.Schema<IcebergTableUpdate>;
export type IcebergTableUpdateList = IcebergTableUpdate[];
export const IcebergTableUpdateList = S.Array(IcebergTableUpdate);
export type PartitionInputList = PartitionInput[];
export const PartitionInputList = S.Array(PartitionInput);
export type ComputeEnvironmentConfigurationMap = {
  [key: string]: ComputeEnvironmentConfiguration | undefined;
};
export const ComputeEnvironmentConfigurationMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(ComputeEnvironmentConfiguration),
});
export interface EvaluationMetrics {
  TransformType: TransformType;
  FindMatchesMetrics?: FindMatchesMetrics;
}
export const EvaluationMetrics = S.suspend(() =>
  S.Struct({
    TransformType: TransformType,
    FindMatchesMetrics: S.optional(FindMatchesMetrics),
  }),
).annotations({
  identifier: "EvaluationMetrics",
}) as any as S.Schema<EvaluationMetrics>;
export interface MLTransform {
  TransformId?: string;
  Name?: string;
  Description?: string;
  Status?: TransformStatusType;
  CreatedOn?: Date;
  LastModifiedOn?: Date;
  InputRecordTables?: GlueTable[];
  Parameters?: TransformParameters;
  EvaluationMetrics?: EvaluationMetrics;
  LabelCount?: number;
  Schema?: SchemaColumn[];
  Role?: string;
  GlueVersion?: string;
  MaxCapacity?: number;
  WorkerType?: WorkerType;
  NumberOfWorkers?: number;
  Timeout?: number;
  MaxRetries?: number;
  TransformEncryption?: TransformEncryption;
}
export const MLTransform = S.suspend(() =>
  S.Struct({
    TransformId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(TransformStatusType),
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
    WorkerType: S.optional(WorkerType),
    NumberOfWorkers: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    TransformEncryption: S.optional(TransformEncryption),
  }),
).annotations({ identifier: "MLTransform" }) as any as S.Schema<MLTransform>;
export type TransformList = MLTransform[];
export const TransformList = S.Array(MLTransform);
export type TableOptimizerRuns = TableOptimizerRun[];
export const TableOptimizerRuns = S.Array(TableOptimizerRun);
export type MetadataInfoMap = { [key: string]: MetadataInfo | undefined };
export const MetadataInfoMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(MetadataInfo),
});
export interface CreateIcebergTableInput {
  Location: string;
  Schema: IcebergSchema;
  PartitionSpec?: IcebergPartitionSpec;
  WriteOrder?: IcebergSortOrder;
  Properties?: { [key: string]: string | undefined };
}
export const CreateIcebergTableInput = S.suspend(() =>
  S.Struct({
    Location: S.String,
    Schema: IcebergSchema,
    PartitionSpec: S.optional(IcebergPartitionSpec),
    WriteOrder: S.optional(IcebergSortOrder),
    Properties: S.optional(StringToStringMap),
  }),
).annotations({
  identifier: "CreateIcebergTableInput",
}) as any as S.Schema<CreateIcebergTableInput>;
export interface StatusDetails {
  RequestedChange?: Table;
  ViewValidations?: ViewValidation[];
}
export const StatusDetails = S.suspend(() =>
  S.Struct({
    RequestedChange: S.optional(
      S.suspend((): S.Schema<Table, any> => Table).annotations({
        identifier: "Table",
      }),
    ),
    ViewValidations: S.optional(ViewValidationList),
  }),
).annotations({
  identifier: "StatusDetails",
}) as any as S.Schema<StatusDetails>;
export interface UpdateIcebergTableInput {
  Updates: IcebergTableUpdate[];
}
export const UpdateIcebergTableInput = S.suspend(() =>
  S.Struct({ Updates: IcebergTableUpdateList }),
).annotations({
  identifier: "UpdateIcebergTableInput",
}) as any as S.Schema<UpdateIcebergTableInput>;
export interface BatchCreatePartitionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  PartitionInputList: PartitionInput[];
}
export const BatchCreatePartitionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionInputList: PartitionInputList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "BatchCreatePartitionRequest",
}) as any as S.Schema<BatchCreatePartitionRequest>;
export interface CreateConnectionRequest {
  CatalogId?: string;
  ConnectionInput: ConnectionInput;
  Tags?: { [key: string]: string | undefined };
}
export const CreateConnectionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    ConnectionInput: ConnectionInput,
    Tags: S.optional(TagsMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateConnectionRequest",
}) as any as S.Schema<CreateConnectionRequest>;
export interface CreateUsageProfileResponse {
  Name?: string;
}
export const CreateUsageProfileResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "CreateUsageProfileResponse",
}) as any as S.Schema<CreateUsageProfileResponse>;
export interface DescribeConnectionTypeResponse {
  ConnectionType?: string;
  Description?: string;
  Capabilities?: Capabilities;
  ConnectionProperties?: { [key: string]: Property | undefined };
  ConnectionOptions?: { [key: string]: Property | undefined };
  AuthenticationConfiguration?: AuthConfiguration;
  ComputeEnvironmentConfigurations?: {
    [key: string]: ComputeEnvironmentConfiguration | undefined;
  };
  PhysicalConnectionRequirements?: { [key: string]: Property | undefined };
  AthenaConnectionProperties?: { [key: string]: Property | undefined };
  PythonConnectionProperties?: { [key: string]: Property | undefined };
  SparkConnectionProperties?: { [key: string]: Property | undefined };
}
export const DescribeConnectionTypeResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "DescribeConnectionTypeResponse",
}) as any as S.Schema<DescribeConnectionTypeResponse>;
export interface GetCatalogResponse {
  Catalog?: Catalog;
}
export const GetCatalogResponse = S.suspend(() =>
  S.Struct({ Catalog: S.optional(Catalog) }),
).annotations({
  identifier: "GetCatalogResponse",
}) as any as S.Schema<GetCatalogResponse>;
export interface GetConnectionResponse {
  Connection?: Connection;
}
export const GetConnectionResponse = S.suspend(() =>
  S.Struct({ Connection: S.optional(Connection) }),
).annotations({
  identifier: "GetConnectionResponse",
}) as any as S.Schema<GetConnectionResponse>;
export interface GetDataQualityResultResponse {
  ResultId?: string;
  ProfileId?: string;
  Score?: number;
  DataSource?: DataSource;
  RulesetName?: string;
  EvaluationContext?: string;
  StartedOn?: Date;
  CompletedOn?: Date;
  JobName?: string;
  JobRunId?: string;
  RulesetEvaluationRunId?: string;
  RuleResults?: DataQualityRuleResult[];
  AnalyzerResults?: DataQualityAnalyzerResult[];
  Observations?: DataQualityObservation[];
  AggregatedMetrics?: DataQualityAggregatedMetrics;
}
export const GetDataQualityResultResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetDataQualityResultResponse",
}) as any as S.Schema<GetDataQualityResultResponse>;
export interface GetMLTransformResponse {
  TransformId?: string;
  Name?: string;
  Description?: string;
  Status?: TransformStatusType;
  CreatedOn?: Date;
  LastModifiedOn?: Date;
  InputRecordTables?: GlueTable[];
  Parameters?: TransformParameters;
  EvaluationMetrics?: EvaluationMetrics;
  LabelCount?: number;
  Schema?: SchemaColumn[];
  Role?: string;
  GlueVersion?: string;
  MaxCapacity?: number;
  WorkerType?: WorkerType;
  NumberOfWorkers?: number;
  Timeout?: number;
  MaxRetries?: number;
  TransformEncryption?: TransformEncryption;
}
export const GetMLTransformResponse = S.suspend(() =>
  S.Struct({
    TransformId: S.optional(S.String),
    Name: S.optional(S.String),
    Description: S.optional(S.String),
    Status: S.optional(TransformStatusType),
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
    WorkerType: S.optional(WorkerType),
    NumberOfWorkers: S.optional(S.Number),
    Timeout: S.optional(S.Number),
    MaxRetries: S.optional(S.Number),
    TransformEncryption: S.optional(TransformEncryption),
  }),
).annotations({
  identifier: "GetMLTransformResponse",
}) as any as S.Schema<GetMLTransformResponse>;
export interface GetMLTransformsResponse {
  Transforms: MLTransform[];
  NextToken?: string;
}
export const GetMLTransformsResponse = S.suspend(() =>
  S.Struct({ Transforms: TransformList, NextToken: S.optional(S.String) }),
).annotations({
  identifier: "GetMLTransformsResponse",
}) as any as S.Schema<GetMLTransformsResponse>;
export interface GetStatementResponse {
  Statement?: Statement;
}
export const GetStatementResponse = S.suspend(() =>
  S.Struct({ Statement: S.optional(Statement) }),
).annotations({
  identifier: "GetStatementResponse",
}) as any as S.Schema<GetStatementResponse>;
export interface ListTableOptimizerRunsResponse {
  CatalogId?: string;
  DatabaseName?: string;
  TableName?: string;
  NextToken?: string;
  TableOptimizerRuns?: TableOptimizerRun[];
}
export const ListTableOptimizerRunsResponse = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.optional(S.String),
    TableName: S.optional(S.String),
    NextToken: S.optional(S.String),
    TableOptimizerRuns: S.optional(TableOptimizerRuns),
  }),
).annotations({
  identifier: "ListTableOptimizerRunsResponse",
}) as any as S.Schema<ListTableOptimizerRunsResponse>;
export interface QuerySchemaVersionMetadataResponse {
  MetadataInfoMap?: { [key: string]: MetadataInfo | undefined };
  SchemaVersionId?: string;
  NextToken?: string;
}
export const QuerySchemaVersionMetadataResponse = S.suspend(() =>
  S.Struct({
    MetadataInfoMap: S.optional(MetadataInfoMap),
    SchemaVersionId: S.optional(S.String),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "QuerySchemaVersionMetadataResponse",
}) as any as S.Schema<QuerySchemaVersionMetadataResponse>;
export interface UpdateColumnStatisticsForPartitionRequest {
  CatalogId?: string;
  DatabaseName: string;
  TableName: string;
  PartitionValues: string[];
  ColumnStatisticsList: ColumnStatistics[];
}
export const UpdateColumnStatisticsForPartitionRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    TableName: S.String,
    PartitionValues: ValueStringList,
    ColumnStatisticsList: UpdateColumnStatisticsList,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateColumnStatisticsForPartitionRequest",
}) as any as S.Schema<UpdateColumnStatisticsForPartitionRequest>;
export interface IcebergInput {
  MetadataOperation: MetadataOperation;
  Version?: string;
  CreateIcebergTableInput?: CreateIcebergTableInput;
}
export const IcebergInput = S.suspend(() =>
  S.Struct({
    MetadataOperation: MetadataOperation,
    Version: S.optional(S.String),
    CreateIcebergTableInput: S.optional(CreateIcebergTableInput),
  }),
).annotations({ identifier: "IcebergInput" }) as any as S.Schema<IcebergInput>;
export interface TableStatus {
  RequestedBy?: string;
  UpdatedBy?: string;
  RequestTime?: Date;
  UpdateTime?: Date;
  Action?: ResourceAction;
  State?: ResourceState;
  Error?: ErrorDetail;
  Details?: StatusDetails;
}
export const TableStatus = S.suspend(() =>
  S.Struct({
    RequestedBy: S.optional(S.String),
    UpdatedBy: S.optional(S.String),
    RequestTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    UpdateTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    Action: S.optional(ResourceAction),
    State: S.optional(ResourceState),
    Error: S.optional(ErrorDetail),
    Details: S.optional(
      S.suspend((): S.Schema<StatusDetails, any> => StatusDetails).annotations({
        identifier: "StatusDetails",
      }),
    ),
  }),
).annotations({ identifier: "TableStatus" }) as any as S.Schema<TableStatus>;
export interface UpdateIcebergInput {
  UpdateIcebergTableInput: UpdateIcebergTableInput;
}
export const UpdateIcebergInput = S.suspend(() =>
  S.Struct({ UpdateIcebergTableInput: UpdateIcebergTableInput }),
).annotations({
  identifier: "UpdateIcebergInput",
}) as any as S.Schema<UpdateIcebergInput>;
export interface OpenTableFormatInput {
  IcebergInput?: IcebergInput;
}
export const OpenTableFormatInput = S.suspend(() =>
  S.Struct({ IcebergInput: S.optional(IcebergInput) }),
).annotations({
  identifier: "OpenTableFormatInput",
}) as any as S.Schema<OpenTableFormatInput>;
export interface UpdateOpenTableFormatInput {
  UpdateIcebergInput?: UpdateIcebergInput;
}
export const UpdateOpenTableFormatInput = S.suspend(() =>
  S.Struct({ UpdateIcebergInput: S.optional(UpdateIcebergInput) }),
).annotations({
  identifier: "UpdateOpenTableFormatInput",
}) as any as S.Schema<UpdateOpenTableFormatInput>;
export interface BatchCreatePartitionResponse {
  Errors?: PartitionError[];
}
export const BatchCreatePartitionResponse = S.suspend(() =>
  S.Struct({ Errors: S.optional(PartitionErrors) }),
).annotations({
  identifier: "BatchCreatePartitionResponse",
}) as any as S.Schema<BatchCreatePartitionResponse>;
export interface CreateConnectionResponse {
  CreateConnectionStatus?: ConnectionStatus;
}
export const CreateConnectionResponse = S.suspend(() =>
  S.Struct({ CreateConnectionStatus: S.optional(ConnectionStatus) }),
).annotations({
  identifier: "CreateConnectionResponse",
}) as any as S.Schema<CreateConnectionResponse>;
export interface CreateTableRequest {
  CatalogId?: string;
  DatabaseName: string;
  Name?: string;
  TableInput?: TableInput;
  PartitionIndexes?: PartitionIndex[];
  TransactionId?: string;
  OpenTableFormatInput?: OpenTableFormatInput;
}
export const CreateTableRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    Name: S.optional(S.String),
    TableInput: S.optional(TableInput),
    PartitionIndexes: S.optional(PartitionIndexList),
    TransactionId: S.optional(S.String),
    OpenTableFormatInput: S.optional(OpenTableFormatInput),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateTableRequest",
}) as any as S.Schema<CreateTableRequest>;
export interface CreateTableResponse {}
export const CreateTableResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "CreateTableResponse",
}) as any as S.Schema<CreateTableResponse>;
export interface GetTablesResponse {
  TableList?: Table[];
  NextToken?: string;
}
export const GetTablesResponse = S.suspend(() =>
  S.Struct({
    TableList: S.optional(TableList),
    NextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetTablesResponse",
}) as any as S.Schema<GetTablesResponse>;
export interface UpdateColumnStatisticsForPartitionResponse {
  Errors?: ColumnStatisticsError[];
}
export const UpdateColumnStatisticsForPartitionResponse = S.suspend(() =>
  S.Struct({ Errors: S.optional(ColumnStatisticsErrors) }),
).annotations({
  identifier: "UpdateColumnStatisticsForPartitionResponse",
}) as any as S.Schema<UpdateColumnStatisticsForPartitionResponse>;
export interface UpdateTableRequest {
  CatalogId?: string;
  DatabaseName: string;
  Name?: string;
  TableInput?: TableInput;
  SkipArchive?: boolean;
  TransactionId?: string;
  VersionId?: string;
  ViewUpdateAction?: ViewUpdateAction;
  Force?: boolean;
  UpdateOpenTableFormatInput?: UpdateOpenTableFormatInput;
}
export const UpdateTableRequest = S.suspend(() =>
  S.Struct({
    CatalogId: S.optional(S.String),
    DatabaseName: S.String,
    Name: S.optional(S.String),
    TableInput: S.optional(TableInput),
    SkipArchive: S.optional(S.Boolean),
    TransactionId: S.optional(S.String),
    VersionId: S.optional(S.String),
    ViewUpdateAction: S.optional(ViewUpdateAction),
    Force: S.optional(S.Boolean),
    UpdateOpenTableFormatInput: S.optional(UpdateOpenTableFormatInput),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateTableRequest",
}) as any as S.Schema<UpdateTableRequest>;
export interface UpdateTableResponse {}
export const UpdateTableResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UpdateTableResponse",
}) as any as S.Schema<UpdateTableResponse>;
export type Workflows = Workflow[];
export const Workflows = S.Array(Workflow);
export interface BatchGetWorkflowsResponse {
  Workflows?: Workflow[];
  MissingWorkflows?: string[];
}
export const BatchGetWorkflowsResponse = S.suspend(() =>
  S.Struct({
    Workflows: S.optional(Workflows),
    MissingWorkflows: S.optional(WorkflowNames),
  }),
).annotations({
  identifier: "BatchGetWorkflowsResponse",
}) as any as S.Schema<BatchGetWorkflowsResponse>;
export interface CreateJobRequest {
  Name: string;
  JobMode?: JobMode;
  JobRunQueuingEnabled?: boolean;
  Description?: string;
  LogUri?: string;
  Role: string;
  ExecutionProperty?: ExecutionProperty;
  Command: JobCommand;
  DefaultArguments?: { [key: string]: string | undefined };
  NonOverridableArguments?: { [key: string]: string | undefined };
  Connections?: ConnectionsList;
  MaxRetries?: number;
  AllocatedCapacity?: number;
  Timeout?: number;
  MaxCapacity?: number;
  SecurityConfiguration?: string;
  Tags?: { [key: string]: string | undefined };
  NotificationProperty?: NotificationProperty;
  GlueVersion?: string;
  NumberOfWorkers?: number;
  WorkerType?: WorkerType;
  CodeGenConfigurationNodes?: {
    [key: string]: CodeGenConfigurationNode | undefined;
  };
  ExecutionClass?: ExecutionClass;
  SourceControlDetails?: SourceControlDetails;
  MaintenanceWindow?: string;
}
export const CreateJobRequest = S.suspend(() =>
  S.Struct({
    Name: S.String,
    JobMode: S.optional(JobMode),
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
    WorkerType: S.optional(WorkerType),
    CodeGenConfigurationNodes: S.optional(CodeGenConfigurationNodes),
    ExecutionClass: S.optional(ExecutionClass),
    SourceControlDetails: S.optional(SourceControlDetails),
    MaintenanceWindow: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateJobRequest",
}) as any as S.Schema<CreateJobRequest>;
export interface CreateJobResponse {
  Name?: string;
}
export const CreateJobResponse = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "CreateJobResponse",
}) as any as S.Schema<CreateJobResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { Message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class EntityNotFoundException extends S.TaggedError<EntityNotFoundException>()(
  "EntityNotFoundException",
  {
    Message: S.optional(S.String),
    FromFederationSource: S.optional(S.Boolean),
  },
) {}
export class AlreadyExistsException extends S.TaggedError<AlreadyExistsException>()(
  "AlreadyExistsException",
  { Message: S.optional(S.String) },
).pipe(C.withAlreadyExistsError) {}
export class CrawlerRunningException extends S.TaggedError<CrawlerRunningException>()(
  "CrawlerRunningException",
  { Message: S.optional(S.String) },
) {}
export class ConcurrentModificationException extends S.TaggedError<ConcurrentModificationException>()(
  "ConcurrentModificationException",
  { Message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { Message: S.optional(S.String) },
) {}
export class ConditionCheckFailureException extends S.TaggedError<ConditionCheckFailureException>()(
  "ConditionCheckFailureException",
  { Message: S.optional(S.String) },
) {}
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { Message: S.optional(S.String) },
) {}
export class ColumnStatisticsTaskNotRunningException extends S.TaggedError<ColumnStatisticsTaskNotRunningException>()(
  "ColumnStatisticsTaskNotRunningException",
  { Message: S.optional(S.String) },
) {}
export class CrawlerNotRunningException extends S.TaggedError<CrawlerNotRunningException>()(
  "CrawlerNotRunningException",
  { Message: S.optional(S.String) },
) {}
export class InvalidInputException extends S.TaggedError<InvalidInputException>()(
  "InvalidInputException",
  {
    Message: S.optional(S.String),
    FromFederationSource: S.optional(S.Boolean),
  },
) {}
export class GlueEncryptionException extends S.TaggedError<GlueEncryptionException>()(
  "GlueEncryptionException",
  { Message: S.optional(S.String) },
) {}
export class OperationTimeoutException extends S.TaggedError<OperationTimeoutException>()(
  "OperationTimeoutException",
  { Message: S.optional(S.String) },
) {}
export class FederationSourceException extends S.TaggedError<FederationSourceException>()(
  "FederationSourceException",
  {
    FederationSourceErrorCode: S.optional(FederationSourceErrorCode),
    Message: S.optional(S.String),
  },
) {}
export class IllegalSessionStateException extends S.TaggedError<IllegalSessionStateException>()(
  "IllegalSessionStateException",
  { Message: S.optional(S.String) },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { Message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class IntegrationConflictOperationFault extends S.TaggedError<IntegrationConflictOperationFault>()(
  "IntegrationConflictOperationFault",
  { Message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ConcurrentRunsExceededException extends S.TaggedError<ConcurrentRunsExceededException>()(
  "ConcurrentRunsExceededException",
  { Message: S.optional(S.String) },
) {}
export class IllegalBlueprintStateException extends S.TaggedError<IllegalBlueprintStateException>()(
  "IllegalBlueprintStateException",
  { Message: S.optional(S.String) },
) {}
export class ColumnStatisticsTaskRunningException extends S.TaggedError<ColumnStatisticsTaskRunningException>()(
  "ColumnStatisticsTaskRunningException",
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
export class MaterializedViewRefreshTaskNotRunningException extends S.TaggedError<MaterializedViewRefreshTaskNotRunningException>()(
  "MaterializedViewRefreshTaskNotRunningException",
  { Message: S.optional(S.String) },
) {}
export class IdempotentParameterMismatchException extends S.TaggedError<IdempotentParameterMismatchException>()(
  "IdempotentParameterMismatchException",
  { Message: S.optional(S.String) },
) {}
export class OperationNotSupportedException extends S.TaggedError<OperationNotSupportedException>()(
  "OperationNotSupportedException",
  { Message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { Message: S.optional(S.String) },
) {}
export class NoScheduleException extends S.TaggedError<NoScheduleException>()(
  "NoScheduleException",
  { Message: S.optional(S.String) },
) {}
export class IllegalWorkflowStateException extends S.TaggedError<IllegalWorkflowStateException>()(
  "IllegalWorkflowStateException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNumberLimitExceededException extends S.TaggedError<ResourceNumberLimitExceededException>()(
  "ResourceNumberLimitExceededException",
  { Message: S.optional(S.String) },
) {}
export class MaterializedViewRefreshTaskRunningException extends S.TaggedError<MaterializedViewRefreshTaskRunningException>()(
  "MaterializedViewRefreshTaskRunningException",
  { Message: S.optional(S.String) },
) {}
export class FederatedResourceAlreadyExistsException extends S.TaggedError<FederatedResourceAlreadyExistsException>()(
  "FederatedResourceAlreadyExistsException",
  {
    Message: S.optional(S.String),
    AssociatedGlueResource: S.optional(S.String),
  },
).pipe(C.withAlreadyExistsError) {}
export class SchedulerTransitioningException extends S.TaggedError<SchedulerTransitioningException>()(
  "SchedulerTransitioningException",
  { Message: S.optional(S.String) },
) {}
export class FederationSourceRetryableException extends S.TaggedError<FederationSourceRetryableException>()(
  "FederationSourceRetryableException",
  { Message: S.optional(S.String) },
) {}
export class IntegrationNotFoundFault extends S.TaggedError<IntegrationNotFoundFault>()(
  "IntegrationNotFoundFault",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MaterializedViewRefreshTaskStoppingException extends S.TaggedError<MaterializedViewRefreshTaskStoppingException>()(
  "MaterializedViewRefreshTaskStoppingException",
  { Message: S.optional(S.String) },
) {}
export class SchedulerRunningException extends S.TaggedError<SchedulerRunningException>()(
  "SchedulerRunningException",
  { Message: S.optional(S.String) },
) {}
export class ResourceNotReadyException extends S.TaggedError<ResourceNotReadyException>()(
  "ResourceNotReadyException",
  { Message: S.optional(S.String) },
) {}
export class VersionMismatchException extends S.TaggedError<VersionMismatchException>()(
  "VersionMismatchException",
  { Message: S.optional(S.String) },
) {}
export class SchedulerNotRunningException extends S.TaggedError<SchedulerNotRunningException>()(
  "SchedulerNotRunningException",
  { Message: S.optional(S.String) },
) {}
export class MLTransformNotReadyException extends S.TaggedError<MLTransformNotReadyException>()(
  "MLTransformNotReadyException",
  { Message: S.optional(S.String) },
) {}
export class IntegrationQuotaExceededFault extends S.TaggedError<IntegrationQuotaExceededFault>()(
  "IntegrationQuotaExceededFault",
  { Message: S.optional(S.String) },
).pipe(C.withQuotaError) {}
export class TargetResourceNotFound extends S.TaggedError<TargetResourceNotFound>()(
  "TargetResourceNotFound",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class PermissionTypeMismatchException extends S.TaggedError<PermissionTypeMismatchException>()(
  "PermissionTypeMismatchException",
  { Message: S.optional(S.String) },
) {}
export class InvalidStateException extends S.TaggedError<InvalidStateException>()(
  "InvalidStateException",
  { Message: S.optional(S.String) },
) {}
export class InvalidIntegrationStateFault extends S.TaggedError<InvalidIntegrationStateFault>()(
  "InvalidIntegrationStateFault",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class KMSKeyNotAccessibleFault extends S.TaggedError<KMSKeyNotAccessibleFault>()(
  "KMSKeyNotAccessibleFault",
  { Message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Updates an existing registry which is used to hold a collection of schemas. The updated properties relate to the registry, and do not modify any of the schemas within the registry.
 */
export const updateRegistry: (
  input: UpdateRegistryInput,
) => effect.Effect<
  UpdateRegistryResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSchema: (
  input: UpdateSchemaInput,
) => effect.Effect<
  UpdateSchemaResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Annotate all datapoints for a Profile.
 */
export const putDataQualityProfileAnnotation: (
  input: PutDataQualityProfileAnnotationRequest,
) => effect.Effect<
  PutDataQualityProfileAnnotationResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDataQualityProfileAnnotationRequest,
  output: PutDataQualityProfileAnnotationResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Validates the supplied schema. This call has no side effects, it simply validates using the supplied schema using `DataFormat` as the format. Since it does not take a schema set name, no compatibility checks are performed.
 */
export const checkSchemaVersionValidity: (
  input: CheckSchemaVersionValidityInput,
) => effect.Effect<
  CheckSchemaVersionValidityResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CheckSchemaVersionValidityInput,
  output: CheckSchemaVersionValidityResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Delete the entire registry including schema and all of its versions. To get the status of the delete operation, you can call the `GetRegistry` API after the asynchronous call. Deleting a registry will deactivate all online operations for the registry such as the `UpdateRegistry`, `CreateSchema`, `UpdateSchema`, and `RegisterSchemaVersion` APIs.
 */
export const deleteRegistry: (
  input: DeleteRegistryInput,
) => effect.Effect<
  DeleteRegistryResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Describes the specified registry in detail.
 */
export const getRegistry: (
  input: GetRegistryInput,
) => effect.Effect<
  GetRegistryResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Describes the specified schema in detail.
 */
export const getSchema: (
  input: GetSchemaInput,
) => effect.Effect<
  GetSchemaResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSchemaByDefinition: (
  input: GetSchemaByDefinitionInput,
) => effect.Effect<
  GetSchemaByDefinitionResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaByDefinitionInput,
  output: GetSchemaByDefinitionResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Fetches the schema version difference in the specified difference type between two stored schema versions in the Schema Registry.
 *
 * This API allows you to compare two schema versions between two schema definitions under the same schema.
 */
export const getSchemaVersionsDiff: (
  input: GetSchemaVersionsDiffInput,
) => effect.Effect<
  GetSchemaVersionsDiffResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSchemaVersionsDiffInput,
  output: GetSchemaVersionsDiffResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * Removes a key value pair from the schema version metadata for the specified schema version ID.
 */
export const removeSchemaVersionMetadata: (
  input: RemoveSchemaVersionMetadataInput,
) => effect.Effect<
  RemoveSchemaVersionMetadataResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveSchemaVersionMetadataInput,
  output: RemoveSchemaVersionMetadataResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InvalidInputException,
  ],
}));
/**
 * Deletes the entire schema set, including the schema set and all of its versions. To get the status of the delete operation, you can call `GetSchema` API after the asynchronous call. Deleting a registry will deactivate all online operations for the schema, such as the `GetSchemaByDefinition`, and `RegisterSchemaVersion` APIs.
 */
export const deleteSchema: (
  input: DeleteSchemaInput,
) => effect.Effect<
  DeleteSchemaResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the session.
 */
export const deleteSession: (
  input: DeleteSessionRequest,
) => effect.Effect<
  DeleteSessionResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | IllegalSessionStateException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the details of a blueprint run.
 */
export const getBlueprintRun: (
  input: GetBlueprintRunRequest,
) => effect.Effect<
  GetBlueprintRunResponse,
  | EntityNotFoundException
  | InternalServiceException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCatalogImportStatus: (
  input: GetCatalogImportStatusRequest,
) => effect.Effect<
  GetCatalogImportStatusResponse,
  InternalServiceException | OperationTimeoutException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCatalogImportStatusRequest,
  output: GetCatalogImportStatusResponse,
  errors: [InternalServiceException, OperationTimeoutException],
}));
/**
 * Retrieves partition statistics of columns.
 *
 * The Identity and Access Management (IAM) permission required for this operation is `GetPartition`.
 */
export const getColumnStatisticsForPartition: (
  input: GetColumnStatisticsForPartitionRequest,
) => effect.Effect<
  GetColumnStatisticsForPartitionResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getColumnStatisticsTaskRun: (
  input: GetColumnStatisticsTaskRunRequest,
) => effect.Effect<
  GetColumnStatisticsTaskRunResponse,
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetColumnStatisticsTaskRunRequest,
  output: GetColumnStatisticsTaskRunResponse,
  errors: [
    EntityNotFoundException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves a list of connection definitions from the Data Catalog.
 */
export const getConnections: {
  (
    input: GetConnectionsRequest,
  ): effect.Effect<
    GetConnectionsResponse,
    | EntityNotFoundException
    | GlueEncryptionException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetConnectionsRequest,
  ) => stream.Stream<
    GetConnectionsResponse,
    | EntityNotFoundException
    | GlueEncryptionException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetConnectionsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | GlueEncryptionException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetConnectionsRequest,
  output: GetConnectionsResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves metrics about specified crawlers.
 */
export const getCrawlerMetrics: {
  (
    input: GetCrawlerMetricsRequest,
  ): effect.Effect<
    GetCrawlerMetricsResponse,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCrawlerMetricsRequest,
  ) => stream.Stream<
    GetCrawlerMetricsResponse,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCrawlerMetricsRequest,
  ) => stream.Stream<
    unknown,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetCrawlerMetricsRequest,
  output: GetCrawlerMetricsResponse,
  errors: [OperationTimeoutException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve a statistic's predictions for a given Profile ID.
 */
export const getDataQualityModelResult: (
  input: GetDataQualityModelResultRequest,
) => effect.Effect<
  GetDataQualityModelResultResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataQualityModelResultRequest,
  output: GetDataQualityModelResultResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Creates mappings.
 */
export const getMapping: (
  input: GetMappingRequest,
) => effect.Effect<
  GetMappingResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Get the associated metadata/information for a task run, given a task run ID.
 */
export const getMaterializedViewRefreshTaskRun: (
  input: GetMaterializedViewRefreshTaskRunRequest,
) => effect.Effect<
  GetMaterializedViewRefreshTaskRunResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetMaterializedViewRefreshTaskRunRequest,
  output: GetMaterializedViewRefreshTaskRunResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Gets code to perform a specified mapping.
 */
export const getPlan: (
  input: GetPlanRequest,
) => effect.Effect<
  GetPlanResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getResourcePolicies: {
  (
    input: GetResourcePoliciesRequest,
  ): effect.Effect<
    GetResourcePoliciesResponse,
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetResourcePoliciesRequest,
  ) => stream.Stream<
    GetResourcePoliciesResponse,
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetResourcePoliciesRequest,
  ) => stream.Stream<
    GluePolicy,
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetResourcePoliciesRequest,
  output: GetResourcePoliciesResponse,
  errors: [
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "GetResourcePoliciesResponseList",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Get the specified schema by its unique ID assigned when a version of the schema is created or registered. Schema versions in Deleted status will not be included in the results.
 */
export const getSchemaVersion: (
  input: GetSchemaVersionInput,
) => effect.Effect<
  GetSchemaVersionResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getSecurityConfiguration: (
  input: GetSecurityConfigurationRequest,
) => effect.Effect<
  GetSecurityConfigurationResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetSecurityConfigurationRequest,
  output: GetSecurityConfigurationResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the session.
 */
export const getSession: (
  input: GetSessionRequest,
) => effect.Effect<
  GetSessionResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves a specified version of a table.
 */
export const getTableVersion: (
  input: GetTableVersionRequest,
) => effect.Effect<
  GetTableVersionResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getUserDefinedFunction: (
  input: GetUserDefinedFunctionRequest,
) => effect.Effect<
  GetUserDefinedFunctionResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetUserDefinedFunctionRequest,
  output: GetUserDefinedFunctionResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Returns a list of registries that you have created, with minimal registry information. Registries in the `Deleting` status will not be included in the results. Empty results will be returned if there are no registries available.
 */
export const listRegistries: {
  (
    input: ListRegistriesInput,
  ): effect.Effect<
    ListRegistriesResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListRegistriesInput,
  ) => stream.Stream<
    ListRegistriesResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListRegistriesInput,
  ) => stream.Stream<
    RegistryListItem,
    | AccessDeniedException
    | InternalServiceException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListRegistriesInput,
  output: ListRegistriesResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidInputException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Registries",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of schemas with minimal details. Schemas in Deleting status will not be included in the results. Empty results will be returned if there are no schemas available.
 *
 * When the `RegistryId` is not provided, all the schemas across registries will be part of the API response.
 */
export const listSchemas: {
  (
    input: ListSchemasInput,
  ): effect.Effect<
    ListSchemasResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchemasInput,
  ) => stream.Stream<
    ListSchemasResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchemasInput,
  ) => stream.Stream<
    SchemaListItem,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSchemasInput,
  output: ListSchemasResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Schemas",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of schema versions that you have created, with minimal information. Schema versions in Deleted status will not be included in the results. Empty results will be returned if there are no schema versions available.
 */
export const listSchemaVersions: {
  (
    input: ListSchemaVersionsInput,
  ): effect.Effect<
    ListSchemaVersionsResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSchemaVersionsInput,
  ) => stream.Stream<
    ListSchemaVersionsResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSchemaVersionsInput,
  ) => stream.Stream<
    SchemaVersionListItem,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSchemaVersionsInput,
  output: ListSchemaVersionsResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Schemas",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Sets the security configuration for a specified catalog. After the configuration has been
 * set, the specified encryption is applied to every catalog write thereafter.
 */
export const putDataCatalogEncryptionSettings: (
  input: PutDataCatalogEncryptionSettingsRequest,
) => effect.Effect<
  PutDataCatalogEncryptionSettingsResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutDataCatalogEncryptionSettingsRequest,
  output: PutDataCatalogEncryptionSettingsResponse,
  errors: [
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
export const searchTables: {
  (
    input: SearchTablesRequest,
  ): effect.Effect<
    SearchTablesResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchTablesRequest,
  ) => stream.Stream<
    SearchTablesResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchTablesRequest,
  ) => stream.Stream<
    unknown,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchTablesRequest,
  output: SearchTablesResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Once you have a ruleset definition (either recommended or your own), you call this operation to evaluate the ruleset against a data source (Glue table). The evaluation computes results which you can retrieve with the `GetDataQualityResult` API.
 */
export const startDataQualityRulesetEvaluationRun: (
  input: StartDataQualityRulesetEvaluationRunRequest,
) => effect.Effect<
  StartDataQualityRulesetEvaluationRunResponse,
  | ConflictException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Stops a task run for the specified table.
 */
export const stopColumnStatisticsTaskRun: (
  input: StopColumnStatisticsTaskRunRequest,
) => effect.Effect<
  StopColumnStatisticsTaskRunResponse,
  | ColumnStatisticsTaskNotRunningException
  | ColumnStatisticsTaskStoppingException
  | EntityNotFoundException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopColumnStatisticsTaskRunRequest,
  output: StopColumnStatisticsTaskRunResponse,
  errors: [
    ColumnStatisticsTaskNotRunningException,
    ColumnStatisticsTaskStoppingException,
    EntityNotFoundException,
    OperationTimeoutException,
  ],
}));
/**
 * If the specified crawler is running, stops the crawl.
 */
export const stopCrawler: (
  input: StopCrawlerRequest,
) => effect.Effect<
  StopCrawlerResponse,
  | CrawlerNotRunningException
  | CrawlerStoppingException
  | EntityNotFoundException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateColumnStatisticsForTable: (
  input: UpdateColumnStatisticsForTableRequest,
) => effect.Effect<
  UpdateColumnStatisticsForTableResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateJob: (
  input: UpdateJobRequest,
) => effect.Effect<
  UpdateJobResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTrigger: (
  input: UpdateTriggerRequest,
) => effect.Effect<
  UpdateTriggerResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Update an Glue usage profile.
 */
export const updateUsageProfile: (
  input: UpdateUsageProfileRequest,
) => effect.Effect<
  UpdateUsageProfileResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationNotSupportedException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an optimizer and all associated metadata for a table. The optimization will no longer be performed on the table.
 */
export const deleteTableOptimizer: (
  input: DeleteTableOptimizerRequest,
) => effect.Effect<
  DeleteTableOptimizerResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTableOptimizerRequest,
  output: DeleteTableOptimizerResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    ThrottlingException,
  ],
}));
/**
 * Stops the execution of the specified workflow run.
 */
export const stopWorkflowRun: (
  input: StopWorkflowRunRequest,
) => effect.Effect<
  StopWorkflowRunResponse,
  | EntityNotFoundException
  | IllegalWorkflowStateException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a specified partition index from an existing table.
 */
export const deletePartitionIndex: (
  input: DeletePartitionIndexRequest,
) => effect.Effect<
  DeletePartitionIndexResponse,
  | ConflictException
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves table statistics of columns.
 *
 * The Identity and Access Management (IAM) permission required for this operation is `GetTable`.
 */
export const getColumnStatisticsForTable: (
  input: GetColumnStatisticsForTableRequest,
) => effect.Effect<
  GetColumnStatisticsForTableResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetColumnStatisticsForTableRequest,
  output: GetColumnStatisticsForTableResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves a list of strings that identify available versions of
 * a specified table.
 */
export const getTableVersions: {
  (
    input: GetTableVersionsRequest,
  ): effect.Effect<
    GetTableVersionsResponse,
    | EntityNotFoundException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetTableVersionsRequest,
  ) => stream.Stream<
    GetTableVersionsResponse,
    | EntityNotFoundException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetTableVersionsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetTableVersionsRequest,
  output: GetTableVersionsResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves multiple function definitions from the Data Catalog.
 */
export const getUserDefinedFunctions: {
  (
    input: GetUserDefinedFunctionsRequest,
  ): effect.Effect<
    GetUserDefinedFunctionsResponse,
    | EntityNotFoundException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetUserDefinedFunctionsRequest,
  ) => stream.Stream<
    GetUserDefinedFunctionsResponse,
    | EntityNotFoundException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetUserDefinedFunctionsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetUserDefinedFunctionsRequest,
  output: GetUserDefinedFunctionsResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Delete the partition column statistics of a column.
 *
 * The Identity and Access Management (IAM) permission required for this operation is `DeletePartition`.
 */
export const deleteColumnStatisticsForPartition: (
  input: DeleteColumnStatisticsForPartitionRequest,
) => effect.Effect<
  DeleteColumnStatisticsForPartitionResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves table statistics of columns.
 *
 * The Identity and Access Management (IAM) permission required for this operation is `DeleteTable`.
 */
export const deleteColumnStatisticsForTable: (
  input: DeleteColumnStatisticsForTableRequest,
) => effect.Effect<
  DeleteColumnStatisticsForTableResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates a connection definition in the Data Catalog.
 */
export const updateConnection: (
  input: UpdateConnectionRequest,
) => effect.Effect<
  UpdateConnectionResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates a partition.
 */
export const updatePartition: (
  input: UpdatePartitionRequest,
) => effect.Effect<
  UpdatePartitionResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an existing function definition in the Data Catalog.
 */
export const updateUserDefinedFunction: (
  input: UpdateUserDefinedFunctionRequest,
) => effect.Effect<
  UpdateUserDefinedFunctionResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateUserDefinedFunctionRequest,
  output: UpdateUserDefinedFunctionResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Lists all classifier objects in the Data Catalog.
 */
export const getClassifiers: {
  (
    input: GetClassifiersRequest,
  ): effect.Effect<
    GetClassifiersResponse,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetClassifiersRequest,
  ) => stream.Stream<
    GetClassifiersResponse,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetClassifiersRequest,
  ) => stream.Stream<
    unknown,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetClassifiersRequest,
  output: GetClassifiersResponse,
  errors: [OperationTimeoutException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves information about all runs associated with the specified table.
 */
export const getColumnStatisticsTaskRuns: {
  (
    input: GetColumnStatisticsTaskRunsRequest,
  ): effect.Effect<
    GetColumnStatisticsTaskRunsResponse,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetColumnStatisticsTaskRunsRequest,
  ) => stream.Stream<
    GetColumnStatisticsTaskRunsResponse,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetColumnStatisticsTaskRunsRequest,
  ) => stream.Stream<
    unknown,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetColumnStatisticsTaskRunsRequest,
  output: GetColumnStatisticsTaskRunsResponse,
  errors: [OperationTimeoutException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves metadata for a specified crawler.
 */
export const getCrawler: (
  input: GetCrawlerRequest,
) => effect.Effect<
  GetCrawlerResponse,
  EntityNotFoundException | OperationTimeoutException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetCrawlerRequest,
  output: GetCrawlerResponse,
  errors: [EntityNotFoundException, OperationTimeoutException],
}));
/**
 * Retrieves metadata for all crawlers defined in the customer
 * account.
 */
export const getCrawlers: {
  (
    input: GetCrawlersRequest,
  ): effect.Effect<
    GetCrawlersResponse,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetCrawlersRequest,
  ) => stream.Stream<
    GetCrawlersResponse,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetCrawlersRequest,
  ) => stream.Stream<
    unknown,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetCrawlersRequest,
  output: GetCrawlersResponse,
  errors: [OperationTimeoutException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all task runs for a particular account.
 */
export const listColumnStatisticsTaskRuns: {
  (
    input: ListColumnStatisticsTaskRunsRequest,
  ): effect.Effect<
    ListColumnStatisticsTaskRunsResponse,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListColumnStatisticsTaskRunsRequest,
  ) => stream.Stream<
    ListColumnStatisticsTaskRunsResponse,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListColumnStatisticsTaskRunsRequest,
  ) => stream.Stream<
    unknown,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListColumnStatisticsTaskRunsRequest,
  output: ListColumnStatisticsTaskRunsResponse,
  errors: [OperationTimeoutException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
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
export const listCrawlers: {
  (
    input: ListCrawlersRequest,
  ): effect.Effect<
    ListCrawlersResponse,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCrawlersRequest,
  ) => stream.Stream<
    ListCrawlersResponse,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCrawlersRequest,
  ) => stream.Stream<
    unknown,
    OperationTimeoutException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCrawlersRequest,
  output: ListCrawlersResponse,
  errors: [OperationTimeoutException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Stops a specified trigger.
 */
export const stopTrigger: (
  input: StopTriggerRequest,
) => effect.Effect<
  StopTriggerResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an existing machine learning transform. Call this operation to tune the algorithm parameters to achieve better results.
 *
 * After calling this operation, you can call the `StartMLEvaluationTaskRun`
 * operation to assess how well your new parameters achieved your goals (such as improving the
 * quality of your machine learning transform, or making it more cost-effective).
 */
export const updateMLTransform: (
  input: UpdateMLTransformRequest,
) => effect.Effect<
  UpdateMLTransformResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an existing workflow.
 */
export const updateWorkflow: (
  input: UpdateWorkflowRequest,
) => effect.Effect<
  UpdateWorkflowResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Cancels a run where a ruleset is being evaluated against a data source.
 */
export const cancelDataQualityRulesetEvaluationRun: (
  input: CancelDataQualityRulesetEvaluationRunRequest,
) => effect.Effect<
  CancelDataQualityRulesetEvaluationRunResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes a classifier from the Data Catalog.
 */
export const deleteClassifier: (
  input: DeleteClassifierRequest,
) => effect.Effect<
  DeleteClassifierResponse,
  EntityNotFoundException | OperationTimeoutException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClassifierRequest,
  output: DeleteClassifierResponse,
  errors: [EntityNotFoundException, OperationTimeoutException],
}));
/**
 * Deletes settings for a column statistics task.
 */
export const deleteColumnStatisticsTaskSettings: (
  input: DeleteColumnStatisticsTaskSettingsRequest,
) => effect.Effect<
  DeleteColumnStatisticsTaskSettingsResponse,
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteConnection: (
  input: DeleteConnectionRequest,
) => effect.Effect<
  DeleteConnectionResponse,
  EntityNotFoundException | OperationTimeoutException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteConnectionRequest,
  output: DeleteConnectionResponse,
  errors: [EntityNotFoundException, OperationTimeoutException],
}));
/**
 * Deletes a data quality ruleset.
 */
export const deleteDataQualityRuleset: (
  input: DeleteDataQualityRulesetRequest,
) => effect.Effect<
  DeleteDataQualityRulesetResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteDataQualityRulesetRequest,
  output: DeleteDataQualityRulesetResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes a specified development endpoint.
 */
export const deleteDevEndpoint: (
  input: DeleteDevEndpointRequest,
) => effect.Effect<
  DeleteDevEndpointResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a specified partition.
 */
export const deletePartition: (
  input: DeletePartitionRequest,
) => effect.Effect<
  DeletePartitionResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSecurityConfiguration: (
  input: DeleteSecurityConfigurationRequest,
) => effect.Effect<
  DeleteSecurityConfigurationResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSecurityConfigurationRequest,
  output: DeleteSecurityConfigurationResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes a specified version of a table.
 */
export const deleteTableVersion: (
  input: DeleteTableVersionRequest,
) => effect.Effect<
  DeleteTableVersionResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteUserDefinedFunction: (
  input: DeleteUserDefinedFunctionRequest,
) => effect.Effect<
  DeleteUserDefinedFunctionResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserDefinedFunctionRequest,
  output: DeleteUserDefinedFunctionResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Starts a column statistics task run schedule.
 */
export const startColumnStatisticsTaskRunSchedule: (
  input: StartColumnStatisticsTaskRunScheduleRequest,
) => effect.Effect<
  StartColumnStatisticsTaskRunScheduleResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Stops a column statistics task run schedule.
 */
export const stopColumnStatisticsTaskRunSchedule: (
  input: StopColumnStatisticsTaskRunScheduleRequest,
) => effect.Effect<
  StopColumnStatisticsTaskRunScheduleResponse,
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a classifier in the user's account. This can be a `GrokClassifier`, an
 * `XMLClassifier`, a `JsonClassifier`, or a `CsvClassifier`,
 * depending on which field of the request is present.
 */
export const createClassifier: (
  input: CreateClassifierRequest,
) => effect.Effect<
  CreateClassifierResponse,
  | AlreadyExistsException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createGlueIdentityCenterConfiguration: (
  input: CreateGlueIdentityCenterConfigurationRequest,
) => effect.Effect<
  CreateGlueIdentityCenterConfigurationResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | ConcurrentModificationException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Starts a crawl using the specified crawler, regardless
 * of what is scheduled. If the crawler is already running, returns a
 * CrawlerRunningException.
 */
export const startCrawler: (
  input: StartCrawlerRequest,
) => effect.Effect<
  StartCrawlerResponse,
  | CrawlerRunningException
  | EntityNotFoundException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCrawlerRequest,
  output: StartCrawlerResponse,
  errors: [
    CrawlerRunningException,
    EntityNotFoundException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes the existing Glue Identity Center configuration, removing the integration between Glue and
 * Amazon Web Services IAM Identity Center.
 */
export const deleteGlueIdentityCenterConfiguration: (
  input: DeleteGlueIdentityCenterConfigurationRequest,
) => effect.Effect<
  DeleteGlueIdentityCenterConfigurationResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the current Glue Identity Center configuration details, including the associated Identity Center instance and
 * application information.
 */
export const getGlueIdentityCenterConfiguration: (
  input: GetGlueIdentityCenterConfigurationRequest,
) => effect.Effect<
  GetGlueIdentityCenterConfigurationResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the existing Glue Identity Center configuration, allowing modification of scopes and permissions for the integration.
 */
export const updateGlueIdentityCenterConfiguration: (
  input: UpdateGlueIdentityCenterConfigurationRequest,
) => effect.Effect<
  UpdateGlueIdentityCenterConfigurationResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Imports an existing Amazon Athena Data Catalog to Glue.
 */
export const importCatalogToGlue: (
  input: ImportCatalogToGlueRequest,
) => effect.Effect<
  ImportCatalogToGlueResponse,
  InternalServiceException | OperationTimeoutException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ImportCatalogToGlueRequest,
  output: ImportCatalogToGlueResponse,
  errors: [InternalServiceException, OperationTimeoutException],
}));
/**
 * Cancels the specified recommendation run that was being used to generate rules.
 */
export const cancelDataQualityRuleRecommendationRun: (
  input: CancelDataQualityRuleRecommendationRunRequest,
) => effect.Effect<
  CancelDataQualityRuleRecommendationRunResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Cancels (stops) a task run. Machine learning task runs are asynchronous tasks that Glue runs on your behalf as part of various machine learning workflows. You can cancel a
 * machine learning task run at any time by calling `CancelMLTaskRun` with a task
 * run's parent transform's `TransformID` and the task run's `TaskRunId`.
 */
export const cancelMLTaskRun: (
  input: CancelMLTaskRunRequest,
) => effect.Effect<
  CancelMLTaskRunResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an existing blueprint.
 */
export const deleteBlueprint: (
  input: DeleteBlueprintRequest,
) => effect.Effect<
  DeleteBlueprintResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteBlueprintRequest,
  output: DeleteBlueprintResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes a custom pattern by specifying its name.
 */
export const deleteCustomEntityType: (
  input: DeleteCustomEntityTypeRequest,
) => effect.Effect<
  DeleteCustomEntityTypeResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCustomEntityTypeRequest,
  output: DeleteCustomEntityTypeResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes a specified job definition. If the job definition
 * is not found, no exception is thrown.
 */
export const deleteJob: (
  input: DeleteJobRequest,
) => effect.Effect<
  DeleteJobResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteMLTransform: (
  input: DeleteMLTransformRequest,
) => effect.Effect<
  DeleteMLTransformResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a specified policy.
 */
export const deleteResourcePolicy: (
  input: DeleteResourcePolicyRequest,
) => effect.Effect<
  DeleteResourcePolicyResponse,
  | ConditionCheckFailureException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteResourcePolicyRequest,
  output: DeleteResourcePolicyResponse,
  errors: [
    ConditionCheckFailureException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes a specified trigger. If the trigger is not found, no
 * exception is thrown.
 */
export const deleteTrigger: (
  input: DeleteTriggerRequest,
) => effect.Effect<
  DeleteTriggerResponse,
  | ConcurrentModificationException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a workflow.
 */
export const deleteWorkflow: (
  input: DeleteWorkflowRequest,
) => effect.Effect<
  DeleteWorkflowResponse,
  | ConcurrentModificationException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBlueprint: (
  input: GetBlueprintRequest,
) => effect.Effect<
  GetBlueprintResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getBlueprintRuns: {
  (
    input: GetBlueprintRunsRequest,
  ): effect.Effect<
    GetBlueprintRunsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetBlueprintRunsRequest,
  ) => stream.Stream<
    GetBlueprintRunsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetBlueprintRunsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetBlueprintRunsRequest,
  output: GetBlueprintRunsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the details of a custom pattern by specifying its name.
 */
export const getCustomEntityType: (
  input: GetCustomEntityTypeRequest,
) => effect.Effect<
  GetCustomEntityTypeResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the security configuration for a specified catalog.
 */
export const getDataCatalogEncryptionSettings: (
  input: GetDataCatalogEncryptionSettingsRequest,
) => effect.Effect<
  GetDataCatalogEncryptionSettingsResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataflowGraph: (
  input: GetDataflowGraphRequest,
) => effect.Effect<
  GetDataflowGraphResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataQualityModel: (
  input: GetDataQualityModelRequest,
) => effect.Effect<
  GetDataQualityModelResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataQualityRuleRecommendationRun: (
  input: GetDataQualityRuleRecommendationRunRequest,
) => effect.Effect<
  GetDataQualityRuleRecommendationRunResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataQualityRuleset: (
  input: GetDataQualityRulesetRequest,
) => effect.Effect<
  GetDataQualityRulesetResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataQualityRulesetRequest,
  output: GetDataQualityRulesetResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves a specific run where a ruleset is evaluated against a data source.
 */
export const getDataQualityRulesetEvaluationRun: (
  input: GetDataQualityRulesetEvaluationRunRequest,
) => effect.Effect<
  GetDataQualityRulesetEvaluationRunResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDevEndpoint: (
  input: GetDevEndpointRequest,
) => effect.Effect<
  GetDevEndpointResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDevEndpoints: {
  (
    input: GetDevEndpointsRequest,
  ): effect.Effect<
    GetDevEndpointsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetDevEndpointsRequest,
  ) => stream.Stream<
    GetDevEndpointsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetDevEndpointsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetDevEndpointsRequest,
  output: GetDevEndpointsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves an existing job definition.
 */
export const getJob: (
  input: GetJobRequest,
) => effect.Effect<
  GetJobResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getJobRuns: {
  (
    input: GetJobRunsRequest,
  ): effect.Effect<
    GetJobRunsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetJobRunsRequest,
  ) => stream.Stream<
    GetJobRunsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetJobRunsRequest,
  ) => stream.Stream<
    JobRun,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetJobRunsRequest,
  output: GetJobRunsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "JobRuns",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves all current job definitions.
 */
export const getJobs: {
  (
    input: GetJobsRequest,
  ): effect.Effect<
    GetJobsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetJobsRequest,
  ) => stream.Stream<
    GetJobsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetJobsRequest,
  ) => stream.Stream<
    Job,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetJobsRequest,
  output: GetJobsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Jobs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a specified resource policy.
 */
export const getResourcePolicy: (
  input: GetResourcePolicyRequest,
) => effect.Effect<
  GetResourcePolicyResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves a list of all security configurations.
 */
export const getSecurityConfigurations: {
  (
    input: GetSecurityConfigurationsRequest,
  ): effect.Effect<
    GetSecurityConfigurationsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetSecurityConfigurationsRequest,
  ) => stream.Stream<
    GetSecurityConfigurationsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetSecurityConfigurationsRequest,
  ) => stream.Stream<
    SecurityConfiguration,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetSecurityConfigurationsRequest,
  output: GetSecurityConfigurationsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "SecurityConfigurations",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a list of tags associated with a resource.
 */
export const getTags: (
  input: GetTagsRequest,
) => effect.Effect<
  GetTagsResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTrigger: (
  input: GetTriggerRequest,
) => effect.Effect<
  GetTriggerResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTriggers: {
  (
    input: GetTriggersRequest,
  ): effect.Effect<
    GetTriggersResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetTriggersRequest,
  ) => stream.Stream<
    GetTriggersResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetTriggersRequest,
  ) => stream.Stream<
    Trigger,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetTriggersRequest,
  output: GetTriggersResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Triggers",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves resource metadata for a workflow.
 */
export const getWorkflow: (
  input: GetWorkflowRequest,
) => effect.Effect<
  GetWorkflowResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getWorkflowRunProperties: (
  input: GetWorkflowRunPropertiesRequest,
) => effect.Effect<
  GetWorkflowRunPropertiesResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetWorkflowRunPropertiesRequest,
  output: GetWorkflowRunPropertiesResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves metadata for all runs of a given workflow.
 */
export const getWorkflowRuns: {
  (
    input: GetWorkflowRunsRequest,
  ): effect.Effect<
    GetWorkflowRunsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetWorkflowRunsRequest,
  ) => stream.Stream<
    GetWorkflowRunsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetWorkflowRunsRequest,
  ) => stream.Stream<
    WorkflowRun,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetWorkflowRunsRequest,
  output: GetWorkflowRunsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Runs",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the blueprint names in an account.
 */
export const listBlueprints: {
  (
    input: ListBlueprintsRequest,
  ): effect.Effect<
    ListBlueprintsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListBlueprintsRequest,
  ) => stream.Stream<
    ListBlueprintsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListBlueprintsRequest,
  ) => stream.Stream<
    OrchestrationNameString,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListBlueprintsRequest,
  output: ListBlueprintsResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Blueprints",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the custom patterns that have been created.
 */
export const listCustomEntityTypes: {
  (
    input: ListCustomEntityTypesRequest,
  ): effect.Effect<
    ListCustomEntityTypesResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCustomEntityTypesRequest,
  ) => stream.Stream<
    ListCustomEntityTypesResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCustomEntityTypesRequest,
  ) => stream.Stream<
    unknown,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCustomEntityTypesRequest,
  output: ListCustomEntityTypesResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the names of all `DevEndpoint` resources in this Amazon Web Services account, or the
 * resources with the specified tag. This operation allows you to see which resources are
 * available in your account, and their names.
 *
 * This operation takes the optional `Tags` field, which you can use as a filter on
 * the response so that tagged resources can be retrieved as a group. If you choose to use tags
 * filtering, only resources with the tag are retrieved.
 */
export const listDevEndpoints: {
  (
    input: ListDevEndpointsRequest,
  ): effect.Effect<
    ListDevEndpointsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDevEndpointsRequest,
  ) => stream.Stream<
    ListDevEndpointsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDevEndpointsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDevEndpointsRequest,
  output: ListDevEndpointsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the names of all job resources in this Amazon Web Services account, or the resources with the specified tag. This operation allows you to see which resources are available in your account, and their names.
 *
 * This operation takes the optional `Tags` field, which you can use as a filter on
 * the response so that tagged resources can be retrieved as a group. If you choose to use tags
 * filtering, only resources with the tag are retrieved.
 */
export const listJobs: {
  (
    input: ListJobsRequest,
  ): effect.Effect<
    ListJobsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobsRequest,
  ) => stream.Stream<
    ListJobsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobsRequest,
  ) => stream.Stream<
    NameString,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobsRequest,
  output: ListJobsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "JobNames",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * List all task runs for a particular account.
 */
export const listMaterializedViewRefreshTaskRuns: {
  (
    input: ListMaterializedViewRefreshTaskRunsRequest,
  ): effect.Effect<
    ListMaterializedViewRefreshTaskRunsResponse,
    | AccessDeniedException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMaterializedViewRefreshTaskRunsRequest,
  ) => stream.Stream<
    ListMaterializedViewRefreshTaskRunsResponse,
    | AccessDeniedException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMaterializedViewRefreshTaskRunsRequest,
  ) => stream.Stream<
    MaterializedViewRefreshTaskRun,
    | AccessDeniedException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMaterializedViewRefreshTaskRunsRequest,
  output: ListMaterializedViewRefreshTaskRunsResponse,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "MaterializedViewRefreshTaskRuns",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves a sortable, filterable list of existing Glue machine learning transforms in this Amazon Web Services account,
 * or the resources with the specified tag. This operation takes the optional `Tags` field, which you can use as
 * a filter of the responses so that tagged resources can be retrieved as a group. If you choose to use tag
 * filtering, only resources with the tags are retrieved.
 */
export const listMLTransforms: {
  (
    input: ListMLTransformsRequest,
  ): effect.Effect<
    ListMLTransformsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListMLTransformsRequest,
  ) => stream.Stream<
    ListMLTransformsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListMLTransformsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListMLTransformsRequest,
  output: ListMLTransformsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve a list of sessions.
 */
export const listSessions: {
  (
    input: ListSessionsRequest,
  ): effect.Effect<
    ListSessionsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListSessionsRequest,
  ) => stream.Stream<
    ListSessionsResponse,
    | AccessDeniedException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListSessionsRequest,
  ) => stream.Stream<
    unknown,
    | AccessDeniedException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListSessionsRequest,
  output: ListSessionsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the names of all trigger resources in this Amazon Web Services account, or the resources with the specified tag. This operation allows you to see which resources are available in your account, and their names.
 *
 * This operation takes the optional `Tags` field, which you can use as a filter on
 * the response so that tagged resources can be retrieved as a group. If you choose to use tags
 * filtering, only resources with the tag are retrieved.
 */
export const listTriggers: {
  (
    input: ListTriggersRequest,
  ): effect.Effect<
    ListTriggersResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTriggersRequest,
  ) => stream.Stream<
    ListTriggersResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTriggersRequest,
  ) => stream.Stream<
    NameString,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTriggersRequest,
  output: ListTriggersResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TriggerNames",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists names of workflows created in the account.
 */
export const listWorkflows: {
  (
    input: ListWorkflowsRequest,
  ): effect.Effect<
    ListWorkflowsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListWorkflowsRequest,
  ) => stream.Stream<
    ListWorkflowsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListWorkflowsRequest,
  ) => stream.Stream<
    NameString,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListWorkflowsRequest,
  output: ListWorkflowsResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Workflows",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Sets the Data Catalog resource policy for access control.
 */
export const putResourcePolicy: (
  input: PutResourcePolicyRequest,
) => effect.Effect<
  PutResourcePolicyResponse,
  | ConditionCheckFailureException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const resetJobBookmark: (
  input: ResetJobBookmarkRequest,
) => effect.Effect<
  ResetJobBookmarkResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startExportLabelsTaskRun: (
  input: StartExportLabelsTaskRunRequest,
) => effect.Effect<
  StartExportLabelsTaskRunResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartExportLabelsTaskRunRequest,
  output: StartExportLabelsTaskRunResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Deletes a specified batch of versions of a table.
 */
export const batchDeleteTableVersion: (
  input: BatchDeleteTableVersionRequest,
) => effect.Effect<
  BatchDeleteTableVersionResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteTableVersionRequest,
  output: BatchDeleteTableVersionResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves the details for the custom patterns specified by a list of names.
 */
export const batchGetCustomEntityTypes: (
  input: BatchGetCustomEntityTypesRequest,
) => effect.Effect<
  BatchGetCustomEntityTypesResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetCustomEntityTypesRequest,
  output: BatchGetCustomEntityTypesResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves a list of data quality results for the specified result IDs.
 */
export const batchGetDataQualityResult: (
  input: BatchGetDataQualityResultRequest,
) => effect.Effect<
  BatchGetDataQualityResultResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetDataQualityResultRequest,
  output: BatchGetDataQualityResultResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Returns a list of resource metadata for a given list of development endpoint names. After
 * calling the `ListDevEndpoints` operation, you can call this operation to access the
 * data to which you have been granted permissions. This operation supports all IAM permissions,
 * including permission conditions that uses tags.
 */
export const batchGetDevEndpoints: (
  input: BatchGetDevEndpointsRequest,
) => effect.Effect<
  BatchGetDevEndpointsResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetDevEndpointsRequest,
  output: BatchGetDevEndpointsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Returns a list of resource metadata for a given list of job names. After calling the `ListJobs` operation, you can call this operation to access the data to which you have been granted permissions. This operation supports all IAM permissions, including permission conditions that uses tags.
 */
export const batchGetJobs: (
  input: BatchGetJobsRequest,
) => effect.Effect<
  BatchGetJobsResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetTriggers: (
  input: BatchGetTriggersRequest,
) => effect.Effect<
  BatchGetTriggersResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchStopJobRun: (
  input: BatchStopJobRunRequest,
) => effect.Effect<
  BatchStopJobRunResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchStopJobRunRequest,
  output: BatchStopJobRunResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Creates a new registry which may be used to hold a collection of schemas.
 */
export const createRegistry: (
  input: CreateRegistryInput,
) => effect.Effect<
  CreateRegistryResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | ConcurrentModificationException
  | InternalServiceException
  | InvalidInputException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Tests a connection to a service to validate the service credentials that you provide.
 *
 * You can either provide an existing connection name or a `TestConnectionInput` for testing a non-existing connection input. Providing both at the same time will cause an error.
 *
 * If the action is successful, the service sends back an HTTP 200 response.
 */
export const testConnection: (
  input: TestConnectionRequest,
) => effect.Effect<
  TestConnectionResponse,
  | AccessDeniedException
  | ConflictException
  | EntityNotFoundException
  | FederationSourceException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an existing catalog's properties in the Glue Data Catalog.
 */
export const updateCatalog: (
  input: UpdateCatalogRequest,
) => effect.Effect<
  UpdateCatalogResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | FederationSourceException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes the specified catalog from the Glue Data Catalog.
 *
 * After completing this operation, you no longer have access to the databases, tables (and all table versions and partitions that might belong to the tables) and the user-defined functions in the deleted catalog. Glue deletes these "orphaned" resources asynchronously in a timely manner, at the discretion of the service.
 *
 * To ensure the immediate deletion of all related resources before calling the `DeleteCatalog` operation, use `DeleteTableVersion` (or `BatchDeleteTableVersion`), `DeletePartition` (or `BatchDeletePartition`), `DeleteTable` (or `BatchDeleteTable`), `DeleteUserDefinedFunction` and `DeleteDatabase` to delete any resources that belong to the catalog.
 */
export const deleteCatalog: (
  input: DeleteCatalogRequest,
) => effect.Effect<
  DeleteCatalogResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | FederationSourceException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists statements for the session.
 */
export const listStatements: (
  input: ListStatementsRequest,
) => effect.Effect<
  ListStatementsResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | IllegalSessionStateException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Stops the session.
 */
export const stopSession: (
  input: StopSessionRequest,
) => effect.Effect<
  StopSessionResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | IllegalSessionStateException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Cancels the statement.
 */
export const cancelStatement: (
  input: CancelStatementRequest,
) => effect.Effect<
  CancelStatementResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | IllegalSessionStateException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Starts a job run using a job definition.
 */
export const startJobRun: (
  input: StartJobRunRequest,
) => effect.Effect<
  StartJobRunResponse,
  | ConcurrentRunsExceededException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startMLLabelingSetGenerationTaskRun: (
  input: StartMLLabelingSetGenerationTaskRunRequest,
) => effect.Effect<
  StartMLLabelingSetGenerationTaskRunResponse,
  | ConcurrentRunsExceededException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startTrigger: (
  input: StartTriggerRequest,
) => effect.Effect<
  StartTriggerResponse,
  | ConcurrentRunsExceededException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startWorkflowRun: (
  input: StartWorkflowRunRequest,
) => effect.Effect<
  StartWorkflowRunResponse,
  | ConcurrentRunsExceededException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates a registered blueprint.
 */
export const updateBlueprint: (
  input: UpdateBlueprintRequest,
) => effect.Effect<
  UpdateBlueprintResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | IllegalBlueprintStateException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates settings for a column statistics task.
 */
export const createColumnStatisticsTaskSettings: (
  input: CreateColumnStatisticsTaskSettingsRequest,
) => effect.Effect<
  CreateColumnStatisticsTaskSettingsResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | ColumnStatisticsTaskRunningException
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Starts a materialized view refresh task run, for a specified table and columns.
 */
export const startMaterializedViewRefreshTaskRun: (
  input: StartMaterializedViewRefreshTaskRunRequest,
) => effect.Effect<
  StartMaterializedViewRefreshTaskRunResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InvalidInputException
  | MaterializedViewRefreshTaskRunningException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMaterializedViewRefreshTaskRunRequest,
  output: StartMaterializedViewRefreshTaskRunResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InvalidInputException,
    MaterializedViewRefreshTaskRunningException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates a custom pattern that is used to detect sensitive data across the columns and rows of your structured data.
 *
 * Each custom pattern you create specifies a regular expression and an optional list of context words. If no context words are passed only a regular expression is checked.
 */
export const createCustomEntityType: (
  input: CreateCustomEntityTypeRequest,
) => effect.Effect<
  CreateCustomEntityTypeResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | IdempotentParameterMismatchException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes the Glue specified usage profile.
 */
export const deleteUsageProfile: (
  input: DeleteUsageProfileRequest,
) => effect.Effect<
  DeleteUsageProfileResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationNotSupportedException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves information about the specified Glue usage profile.
 */
export const getUsageProfile: (
  input: GetUsageProfileRequest,
) => effect.Effect<
  GetUsageProfileResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationNotSupportedException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * List all the Glue usage profiles.
 */
export const listUsageProfiles: {
  (
    input: ListUsageProfilesRequest,
  ): effect.Effect<
    ListUsageProfilesResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationNotSupportedException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListUsageProfilesRequest,
  ) => stream.Stream<
    ListUsageProfilesResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationNotSupportedException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListUsageProfilesRequest,
  ) => stream.Stream<
    UsageProfileDefinition,
    | InternalServiceException
    | InvalidInputException
    | OperationNotSupportedException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListUsageProfilesRequest,
  output: ListUsageProfilesResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationNotSupportedException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Profiles",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns the configuration of all optimizers associated with a specified table.
 */
export const getTableOptimizer: (
  input: GetTableOptimizerRequest,
) => effect.Effect<
  GetTableOptimizerResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Restarts selected nodes of a previous partially completed workflow run and resumes the workflow run. The selected nodes and all nodes that are downstream from the selected nodes are run.
 */
export const resumeWorkflowRun: (
  input: ResumeWorkflowRunRequest,
) => effect.Effect<
  ResumeWorkflowRunResponse,
  | ConcurrentRunsExceededException
  | EntityNotFoundException
  | IllegalWorkflowStateException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Adds a new version to the existing schema. Returns an error if new version of schema does not meet the compatibility requirements of the schema set. This API will not create a new schema set and will return a 404 error if the schema set is not already present in the Schema Registry.
 *
 * If this is the first schema definition to be registered in the Schema Registry, this API will store the schema version and return immediately. Otherwise, this call has the potential to run longer than other operations due to compatibility modes. You can call the `GetSchemaVersion` API with the `SchemaVersionId` to check compatibility modes.
 *
 * If the same schema definition is already stored in Schema Registry as a version, the schema ID of the existing schema is returned to the caller.
 */
export const registerSchemaVersion: (
  input: RegisterSchemaVersionInput,
) => effect.Effect<
  RegisterSchemaVersionResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new schema set and registers the schema definition. Returns an error if the schema set already exists without actually registering the version.
 *
 * When the schema set is created, a version checkpoint will be set to the first version. Compatibility mode "DISABLED" restricts any additional schema versions from being added after the first schema version. For all other compatibility modes, validation of compatibility settings will be applied only from the second version onwards when the `RegisterSchemaVersion` API is used.
 *
 * When this API is called without a `RegistryId`, this will create an entry for a "default-registry" in the registry database tables, if it is not already present.
 */
export const createSchema: (
  input: CreateSchemaInput,
) => effect.Effect<
  CreateSchemaResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Puts the metadata key value pair for a specified schema version ID. A maximum of 10 key value pairs will be allowed per schema version. They can be added over one or more calls.
 */
export const putSchemaVersionMetadata: (
  input: PutSchemaVersionMetadataInput,
) => effect.Effect<
  PutSchemaVersionMetadataResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | EntityNotFoundException
  | InvalidInputException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutSchemaVersionMetadataInput,
  output: PutSchemaVersionMetadataResponse,
  errors: [
    AccessDeniedException,
    AlreadyExistsException,
    EntityNotFoundException,
    InvalidInputException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Starts a new run of the specified blueprint.
 */
export const startBlueprintRun: (
  input: StartBlueprintRunRequest,
) => effect.Effect<
  StartBlueprintRunResponse,
  | EntityNotFoundException
  | IllegalBlueprintStateException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Starts a column statistics task run, for a specified table and columns.
 */
export const startColumnStatisticsTaskRun: (
  input: StartColumnStatisticsTaskRunRequest,
) => effect.Effect<
  StartColumnStatisticsTaskRunResponse,
  | AccessDeniedException
  | ColumnStatisticsTaskRunningException
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the specified data quality ruleset.
 */
export const updateDataQualityRuleset: (
  input: UpdateDataQualityRulesetRequest,
) => effect.Effect<
  UpdateDataQualityRulesetResponse,
  | AlreadyExistsException
  | EntityNotFoundException
  | IdempotentParameterMismatchException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a specified partition index in an existing table.
 */
export const createPartitionIndex: (
  input: CreatePartitionIndexRequest,
) => effect.Effect<
  CreatePartitionIndexResponse,
  | AlreadyExistsException
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Puts the specified workflow run properties for the given workflow run. If a property already exists for the specified run, then it overrides the value otherwise adds the property to existing properties.
 */
export const putWorkflowRunProperties: (
  input: PutWorkflowRunPropertiesRequest,
) => effect.Effect<
  PutWorkflowRunPropertiesResponse,
  | AlreadyExistsException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
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
export const startImportLabelsTaskRun: (
  input: StartImportLabelsTaskRunRequest,
) => effect.Effect<
  StartImportLabelsTaskRunResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportLabelsTaskRunRequest,
  output: StartImportLabelsTaskRunResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Registers a blueprint with Glue.
 */
export const createBlueprint: (
  input: CreateBlueprintRequest,
) => effect.Effect<
  CreateBlueprintResponse,
  | AlreadyExistsException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new crawler with specified targets, role, configuration, and optional schedule.
 * At least one crawl target must be specified, in the `s3Targets` field, the
 * `jdbcTargets` field, or the `DynamoDBTargets` field.
 */
export const createCrawler: (
  input: CreateCrawlerRequest,
) => effect.Effect<
  CreateCrawlerResponse,
  | AlreadyExistsException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a data quality ruleset with DQDL rules applied to a specified Glue table.
 *
 * You create the ruleset using the Data Quality Definition Language (DQDL). For more information, see the Glue developer guide.
 */
export const createDataQualityRuleset: (
  input: CreateDataQualityRulesetRequest,
) => effect.Effect<
  CreateDataQualityRulesetResponse,
  | AlreadyExistsException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateDataQualityRulesetRequest,
  output: CreateDataQualityRulesetResponse,
  errors: [
    AlreadyExistsException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates a new partition.
 */
export const createPartition: (
  input: CreatePartitionRequest,
) => effect.Effect<
  CreatePartitionResponse,
  | AlreadyExistsException
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new function definition in the Data Catalog.
 */
export const createUserDefinedFunction: (
  input: CreateUserDefinedFunctionRequest,
) => effect.Effect<
  CreateUserDefinedFunctionResponse,
  | AlreadyExistsException
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new workflow.
 */
export const createWorkflow: (
  input: CreateWorkflowRequest,
) => effect.Effect<
  CreateWorkflowResponse,
  | AlreadyExistsException
  | ConcurrentModificationException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes a list of connection definitions from the Data Catalog.
 */
export const batchDeleteConnection: (
  input: BatchDeleteConnectionRequest,
) => effect.Effect<
  BatchDeleteConnectionResponse,
  InternalServiceException | OperationTimeoutException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeleteConnectionRequest,
  output: BatchDeleteConnectionResponse,
  errors: [InternalServiceException, OperationTimeoutException],
}));
/**
 * Deletes one or more partitions in a batch operation.
 */
export const batchDeletePartition: (
  input: BatchDeletePartitionRequest,
) => effect.Effect<
  BatchDeletePartitionResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchDeletePartitionRequest,
  output: BatchDeletePartitionResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Retrieves information about a list of blueprints.
 */
export const batchGetBlueprints: (
  input: BatchGetBlueprintsRequest,
) => effect.Effect<
  BatchGetBlueprintsResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetCrawlers: (
  input: BatchGetCrawlersRequest,
) => effect.Effect<
  BatchGetCrawlersResponse,
  InvalidInputException | OperationTimeoutException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetCrawlersRequest,
  output: BatchGetCrawlersResponse,
  errors: [InvalidInputException, OperationTimeoutException],
}));
/**
 * Returns the configuration for the specified table optimizers.
 */
export const batchGetTableOptimizer: (
  input: BatchGetTableOptimizerRequest,
) => effect.Effect<
  BatchGetTableOptimizerResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchGetTableOptimizerRequest,
  output: BatchGetTableOptimizerResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    ThrottlingException,
  ],
}));
/**
 * Annotate datapoints over time for a specific data quality statistic.
 * The API requires both profileID and statisticID as part of the InclusionAnnotation input.
 * The API only works for a single statisticId across multiple profiles.
 */
export const batchPutDataQualityStatisticAnnotation: (
  input: BatchPutDataQualityStatisticAnnotationRequest,
) => effect.Effect<
  BatchPutDataQualityStatisticAnnotationResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchUpdatePartition: (
  input: BatchUpdatePartitionRequest,
) => effect.Effect<
  BatchUpdatePartitionResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchUpdatePartitionRequest,
  output: BatchUpdatePartitionResponse,
  errors: [
    EntityNotFoundException,
    GlueEncryptionException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
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
export const createMLTransform: (
  input: CreateMLTransformRequest,
) => effect.Effect<
  CreateMLTransformResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | IdempotentParameterMismatchException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createScript: (
  input: CreateScriptRequest,
) => effect.Effect<
  CreateScriptResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSecurityConfiguration: (
  input: CreateSecurityConfigurationRequest,
) => effect.Effect<
  CreateSecurityConfigurationResponse,
  | AlreadyExistsException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSecurityConfigurationRequest,
  output: CreateSecurityConfigurationResponse,
  errors: [
    AlreadyExistsException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
    ResourceNumberLimitExceededException,
  ],
}));
/**
 * Creates a new trigger.
 *
 * Job arguments may be logged. Do not pass plaintext secrets as arguments. Retrieve secrets from a Glue Connection, Amazon Web Services Secrets Manager or other secret management mechanism if you intend to keep them within the Job.
 */
export const createTrigger: (
  input: CreateTriggerRequest,
) => effect.Effect<
  CreateTriggerResponse,
  | AlreadyExistsException
  | ConcurrentModificationException
  | EntityNotFoundException
  | IdempotentParameterMismatchException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes a specified crawler from the Glue Data Catalog, unless the crawler state is
 * `RUNNING`.
 */
export const deleteCrawler: (
  input: DeleteCrawlerRequest,
) => effect.Effect<
  DeleteCrawlerResponse,
  | CrawlerRunningException
  | EntityNotFoundException
  | OperationTimeoutException
  | SchedulerTransitioningException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteDatabase: (
  input: DeleteDatabaseRequest,
) => effect.Effect<
  DeleteDatabaseResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Remove versions from the specified schema. A version number or range may be supplied. If the compatibility mode forbids deleting of a version that is necessary, such as BACKWARDS_FULL, an error is returned. Calling the `GetSchemaVersions` API after this call will list the status of the deleted versions.
 *
 * When the range of version numbers contain check pointed version, the API will return a 409 conflict and will not proceed with the deletion. You have to remove the checkpoint first using the `DeleteSchemaCheckpoint` API before using this API.
 *
 * You cannot use the `DeleteSchemaVersions` API to delete the first schema version in the schema set. The first schema version can only be deleted by the `DeleteSchema` API. This operation will also delete the attached `SchemaVersionMetadata` under the schema versions. Hard deletes will be enforced on the database.
 *
 * If the compatibility mode forbids deleting of a version that is necessary, such as BACKWARDS_FULL, an error is returned.
 */
export const deleteSchemaVersions: (
  input: DeleteSchemaVersionsInput,
) => effect.Effect<
  DeleteSchemaVersionsResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSchemaVersionsInput,
  output: DeleteSchemaVersionsResponse,
  errors: [
    AccessDeniedException,
    ConcurrentModificationException,
    EntityNotFoundException,
    InvalidInputException,
  ],
}));
/**
 * Retrieve a classifier by name.
 */
export const getClassifier: (
  input: GetClassifierRequest,
) => effect.Effect<
  GetClassifierResponse,
  EntityNotFoundException | OperationTimeoutException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClassifierRequest,
  output: GetClassifierResponse,
  errors: [EntityNotFoundException, OperationTimeoutException],
}));
/**
 * Gets settings for a column statistics task.
 */
export const getColumnStatisticsTaskSettings: (
  input: GetColumnStatisticsTaskSettingsRequest,
) => effect.Effect<
  GetColumnStatisticsTaskSettingsResponse,
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetColumnStatisticsTaskSettingsRequest,
  output: GetColumnStatisticsTaskSettingsResponse,
  errors: [
    EntityNotFoundException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * This API is used to query preview data from a given connection type or from a native Amazon S3 based Glue Data Catalog.
 *
 * Returns records as an array of JSON blobs. Each record is formatted using Jackson JsonNode based on the field type defined by the `DescribeEntity` API.
 *
 * Spark connectors generate schemas according to the same data type mapping as in the `DescribeEntity` API. Spark connectors convert data to the appropriate data types matching the schema when returning rows.
 */
export const getEntityRecords: (
  input: GetEntityRecordsRequest,
) => effect.Effect<
  GetEntityRecordsResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | FederationSourceException
  | GlueEncryptionException
  | InvalidInputException
  | OperationTimeoutException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * This API is used for fetching the `ResourceProperty` of the Glue connection (for the source) or Glue database ARN (for the target)
 */
export const getIntegrationResourceProperty: (
  input: GetIntegrationResourcePropertyRequest,
) => effect.Effect<
  GetIntegrationResourcePropertyResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the metadata for a given job run. Job run history is accessible for 365 days for your workflow and job run.
 */
export const getJobRun: (
  input: GetJobRunRequest,
) => effect.Effect<
  GetJobRunResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMLTaskRun: (
  input: GetMLTaskRunRequest,
) => effect.Effect<
  GetMLTaskRunResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMLTaskRuns: {
  (
    input: GetMLTaskRunsRequest,
  ): effect.Effect<
    GetMLTaskRunsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetMLTaskRunsRequest,
  ) => stream.Stream<
    GetMLTaskRunsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetMLTaskRunsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetMLTaskRunsRequest,
  output: GetMLTaskRunsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the partition indexes associated with a table.
 */
export const getPartitionIndexes: {
  (
    input: GetPartitionIndexesRequest,
  ): effect.Effect<
    GetPartitionIndexesResponse,
    | ConflictException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetPartitionIndexesRequest,
  ) => stream.Stream<
    GetPartitionIndexesResponse,
    | ConflictException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetPartitionIndexesRequest,
  ) => stream.Stream<
    PartitionIndexDescriptor,
    | ConflictException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetPartitionIndexesRequest,
  output: GetPartitionIndexesResponse,
  errors: [
    ConflictException,
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "PartitionIndexDescriptorList",
  } as const,
}));
/**
 * Retrieves the metadata for a given workflow run. Job run history is accessible for 90 days for your workflow and job run.
 */
export const getWorkflowRun: (
  input: GetWorkflowRunRequest,
) => effect.Effect<
  GetWorkflowRunResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listConnectionTypes: {
  (
    input: ListConnectionTypesRequest,
  ): effect.Effect<
    ListConnectionTypesResponse,
    AccessDeniedException | InternalServiceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListConnectionTypesRequest,
  ) => stream.Stream<
    ListConnectionTypesResponse,
    AccessDeniedException | InternalServiceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListConnectionTypesRequest,
  ) => stream.Stream<
    ConnectionTypeBrief,
    AccessDeniedException | InternalServiceException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListConnectionTypesRequest,
  output: ListConnectionTypesResponse,
  errors: [AccessDeniedException, InternalServiceException],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ConnectionTypes",
    pageSize: "MaxResults",
  } as const,
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
export const listCrawls: (
  input: ListCrawlsRequest,
) => effect.Effect<
  ListCrawlsResponse,
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDataQualityResults: {
  (
    input: ListDataQualityResultsRequest,
  ): effect.Effect<
    ListDataQualityResultsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataQualityResultsRequest,
  ) => stream.Stream<
    ListDataQualityResultsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataQualityResultsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataQualityResultsRequest,
  output: ListDataQualityResultsResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists the recommendation runs meeting the filter criteria.
 */
export const listDataQualityRuleRecommendationRuns: {
  (
    input: ListDataQualityRuleRecommendationRunsRequest,
  ): effect.Effect<
    ListDataQualityRuleRecommendationRunsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataQualityRuleRecommendationRunsRequest,
  ) => stream.Stream<
    ListDataQualityRuleRecommendationRunsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataQualityRuleRecommendationRunsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataQualityRuleRecommendationRunsRequest,
  output: ListDataQualityRuleRecommendationRunsResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Lists all the runs meeting the filter criteria, where a ruleset is evaluated against a data source.
 */
export const listDataQualityRulesetEvaluationRuns: {
  (
    input: ListDataQualityRulesetEvaluationRunsRequest,
  ): effect.Effect<
    ListDataQualityRulesetEvaluationRunsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataQualityRulesetEvaluationRunsRequest,
  ) => stream.Stream<
    ListDataQualityRulesetEvaluationRunsResponse,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataQualityRulesetEvaluationRunsRequest,
  ) => stream.Stream<
    unknown,
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataQualityRulesetEvaluationRunsRequest,
  output: ListDataQualityRulesetEvaluationRunsResponse,
  errors: [
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a paginated list of rulesets for the specified list of Glue tables.
 */
export const listDataQualityRulesets: {
  (
    input: ListDataQualityRulesetsRequest,
  ): effect.Effect<
    ListDataQualityRulesetsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDataQualityRulesetsRequest,
  ) => stream.Stream<
    ListDataQualityRulesetsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDataQualityRulesetsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListDataQualityRulesetsRequest,
  output: ListDataQualityRulesetsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieve annotations for a data quality statistic.
 */
export const listDataQualityStatisticAnnotations: (
  input: ListDataQualityStatisticAnnotationsRequest,
) => effect.Effect<
  ListDataQualityStatisticAnnotationsResponse,
  InternalServiceException | InvalidInputException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataQualityStatisticAnnotationsRequest,
  output: ListDataQualityStatisticAnnotationsResponse,
  errors: [InternalServiceException, InvalidInputException],
}));
/**
 * Retrieves a list of data quality statistics.
 */
export const listDataQualityStatistics: (
  input: ListDataQualityStatisticsRequest,
) => effect.Effect<
  ListDataQualityStatisticsResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListDataQualityStatisticsRequest,
  output: ListDataQualityStatisticsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
  ],
}));
/**
 * List integration resource properties for a single customer. It supports the filters, maxRecords and markers.
 */
export const listIntegrationResourceProperties: (
  input: ListIntegrationResourcePropertiesRequest,
) => effect.Effect<
  ListIntegrationResourcePropertiesResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Starts a recommendation run that is used to generate rules when you don't know what rules to write. Glue Data Quality analyzes the data and comes up with recommendations for a potential ruleset. You can then triage the ruleset and modify the generated ruleset to your liking.
 *
 * Recommendation runs are automatically deleted after 90 days.
 */
export const startDataQualityRuleRecommendationRun: (
  input: StartDataQualityRuleRecommendationRunRequest,
) => effect.Effect<
  StartDataQualityRuleRecommendationRunResponse,
  | ConflictException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Stops a materialized view refresh task run, for a specified table and columns.
 */
export const stopMaterializedViewRefreshTaskRun: (
  input: StopMaterializedViewRefreshTaskRunRequest,
) => effect.Effect<
  StopMaterializedViewRefreshTaskRunResponse,
  | AccessDeniedException
  | InvalidInputException
  | MaterializedViewRefreshTaskNotRunningException
  | MaterializedViewRefreshTaskStoppingException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopMaterializedViewRefreshTaskRunRequest,
  output: StopMaterializedViewRefreshTaskRunResponse,
  errors: [
    AccessDeniedException,
    InvalidInputException,
    MaterializedViewRefreshTaskNotRunningException,
    MaterializedViewRefreshTaskStoppingException,
    OperationTimeoutException,
  ],
}));
/**
 * Changes the schedule state of the specified crawler to
 * `SCHEDULED`, unless the crawler is already running or the
 * schedule state is already `SCHEDULED`.
 */
export const startCrawlerSchedule: (
  input: StartCrawlerScheduleRequest,
) => effect.Effect<
  StartCrawlerScheduleResponse,
  | EntityNotFoundException
  | NoScheduleException
  | OperationTimeoutException
  | SchedulerRunningException
  | SchedulerTransitioningException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartCrawlerScheduleRequest,
  output: StartCrawlerScheduleResponse,
  errors: [
    EntityNotFoundException,
    NoScheduleException,
    OperationTimeoutException,
    SchedulerRunningException,
    SchedulerTransitioningException,
  ],
}));
/**
 * Creates a new catalog in the Glue Data Catalog.
 */
export const createCatalog: (
  input: CreateCatalogRequest,
) => effect.Effect<
  CreateCatalogResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | ConcurrentModificationException
  | EntityNotFoundException
  | FederatedResourceAlreadyExistsException
  | FederationSourceException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchDeleteTable: (
  input: BatchDeleteTableRequest,
) => effect.Effect<
  BatchDeleteTableResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNotReadyException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Modifies an existing classifier (a `GrokClassifier`,
 * an `XMLClassifier`, a `JsonClassifier`, or a `CsvClassifier`, depending on
 * which field is present).
 */
export const updateClassifier: (
  input: UpdateClassifierRequest,
) => effect.Effect<
  UpdateClassifierResponse,
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | VersionMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Sets the schedule state of the specified crawler to
 * `NOT_SCHEDULED`, but does not stop the crawler if it is
 * already running.
 */
export const stopCrawlerSchedule: (
  input: StopCrawlerScheduleRequest,
) => effect.Effect<
  StopCrawlerScheduleResponse,
  | EntityNotFoundException
  | OperationTimeoutException
  | SchedulerNotRunningException
  | SchedulerTransitioningException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the schedule of a crawler using a `cron` expression.
 */
export const updateCrawlerSchedule: (
  input: UpdateCrawlerScheduleRequest,
) => effect.Effect<
  UpdateCrawlerScheduleResponse,
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | SchedulerTransitioningException
  | VersionMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateCrawlerScheduleRequest,
  output: UpdateCrawlerScheduleResponse,
  errors: [
    EntityNotFoundException,
    InvalidInputException,
    OperationTimeoutException,
    SchedulerTransitioningException,
    VersionMismatchException,
  ],
}));
/**
 * Retrieves the definition of a specified database.
 */
export const getDatabase: (
  input: GetDatabaseRequest,
) => effect.Effect<
  GetDatabaseResponse,
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the `Table` definition in a Data Catalog for
 * a specified table.
 */
export const getTable: (
  input: GetTableRequest,
) => effect.Effect<
  GetTableResponse,
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNotReadyException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves all catalogs defined in a catalog in the Glue Data Catalog. For a Redshift-federated catalog use case, this operation returns the list of catalogs mapped to Redshift databases in the Redshift namespace catalog.
 */
export const getCatalogs: (
  input: GetCatalogsRequest,
) => effect.Effect<
  GetCatalogsResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves all databases defined in a given Data Catalog.
 */
export const getDatabases: {
  (
    input: GetDatabasesRequest,
  ): effect.Effect<
    GetDatabasesResponse,
    | EntityNotFoundException
    | FederationSourceException
    | FederationSourceRetryableException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetDatabasesRequest,
  ) => stream.Stream<
    GetDatabasesResponse,
    | EntityNotFoundException
    | FederationSourceException
    | FederationSourceRetryableException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetDatabasesRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | FederationSourceException
    | FederationSourceRetryableException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves information about a specified partition.
 */
export const getPartition: (
  input: GetPartitionRequest,
) => effect.Effect<
  GetPartitionResponse,
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates an existing database definition in a Data Catalog.
 */
export const updateDatabase: (
  input: UpdateDatabaseRequest,
) => effect.Effect<
  UpdateDatabaseResponse,
  | AlreadyExistsException
  | ConcurrentModificationException
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteTable: (
  input: DeleteTableRequest,
) => effect.Effect<
  DeleteTableResponse,
  | ConcurrentModificationException
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNotReadyException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new database in a Data Catalog.
 */
export const createDatabase: (
  input: CreateDatabaseRequest,
) => effect.Effect<
  CreateDatabaseResponse,
  | AlreadyExistsException
  | ConcurrentModificationException
  | FederatedResourceAlreadyExistsException
  | FederationSourceException
  | FederationSourceRetryableException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getJobBookmark: (
  input: GetJobBookmarkRequest,
) => effect.Effect<
  GetJobBookmarkResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns the available entities supported by the connection type.
 */
export const listEntities: {
  (
    input: ListEntitiesRequest,
  ): effect.Effect<
    ListEntitiesResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | FederationSourceException
    | GlueEncryptionException
    | InvalidInputException
    | OperationTimeoutException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListEntitiesRequest,
  ) => stream.Stream<
    ListEntitiesResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | FederationSourceException
    | GlueEncryptionException
    | InvalidInputException
    | OperationTimeoutException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListEntitiesRequest,
  ) => stream.Stream<
    Entity,
    | AccessDeniedException
    | EntityNotFoundException
    | FederationSourceException
    | GlueEncryptionException
    | InvalidInputException
    | OperationTimeoutException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Entities",
  } as const,
}));
/**
 * Updates a specified development endpoint.
 */
export const updateDevEndpoint: (
  input: UpdateDevEndpointRequest,
) => effect.Effect<
  UpdateDevEndpointResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Synchronizes a job from the source control repository. This operation takes the job artifacts that are located in the remote repository and updates the Glue internal stores with these artifacts.
 *
 * This API supports optional parameters which take in the repository information.
 */
export const updateJobFromSourceControl: (
  input: UpdateJobFromSourceControlRequest,
) => effect.Effect<
  UpdateJobFromSourceControlResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Synchronizes a job to the source control repository. This operation takes the job artifacts from the Glue internal stores and makes a commit to the remote repository that is configured on the job.
 *
 * This API supports optional parameters which take in the repository information.
 */
export const updateSourceControlFromJob: (
  input: UpdateSourceControlFromJobRequest,
) => effect.Effect<
  UpdateSourceControlFromJobResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Executes the statement.
 */
export const runStatement: (
  input: RunStatementRequest,
) => effect.Effect<
  RunStatementResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | IllegalSessionStateException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new development endpoint.
 */
export const createDevEndpoint: (
  input: CreateDevEndpointRequest,
) => effect.Effect<
  CreateDevEndpointResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | IdempotentParameterMismatchException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new session.
 */
export const createSession: (
  input: CreateSessionRequest,
) => effect.Effect<
  CreateSessionResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | IdempotentParameterMismatchException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the configuration for an existing table optimizer.
 */
export const updateTableOptimizer: (
  input: UpdateTableOptimizerRequest,
) => effect.Effect<
  UpdateTableOptimizerResponse,
  | AccessDeniedException
  | ConcurrentModificationException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a new table optimizer for a specific function.
 */
export const createTableOptimizer: (
  input: CreateTableOptimizerRequest,
) => effect.Effect<
  CreateTableOptimizerResponse,
  | AccessDeniedException
  | AlreadyExistsException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Provides details regarding the entity used with the connection type, with a description of the data model for each field in the selected entity.
 *
 * The response includes all the fields which make up the entity.
 */
export const describeEntity: {
  (
    input: DescribeEntityRequest,
  ): effect.Effect<
    DescribeEntityResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | FederationSourceException
    | GlueEncryptionException
    | InvalidInputException
    | OperationTimeoutException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEntityRequest,
  ) => stream.Stream<
    DescribeEntityResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | FederationSourceException
    | GlueEncryptionException
    | InvalidInputException
    | OperationTimeoutException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEntityRequest,
  ) => stream.Stream<
    Field,
    | AccessDeniedException
    | EntityNotFoundException
    | FederationSourceException
    | GlueEncryptionException
    | InvalidInputException
    | OperationTimeoutException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "Fields",
  } as const,
}));
/**
 * The API is used to retrieve a list of integrations.
 */
export const describeIntegrations: (
  input: DescribeIntegrationsRequest,
) => effect.Effect<
  DescribeIntegrationsResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | IntegrationNotFoundFault
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * This API is used to retrieve optional override properties for the tables that need to be replicated. These properties can include properties for filtering and partition for source and target tables.
 */
export const getIntegrationTableProperties: (
  input: GetIntegrationTablePropertiesRequest,
) => effect.Effect<
  GetIntegrationTablePropertiesResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * This API can be used for updating the `ResourceProperty` of the Glue connection (for the source) or Glue database ARN (for the target). These properties can include the role to access the connection or database. Since the same resource can be used across multiple integrations, updating resource properties will impact all the integrations using it.
 */
export const updateIntegrationResourceProperty: (
  input: UpdateIntegrationResourcePropertyRequest,
) => effect.Effect<
  UpdateIntegrationResourcePropertyResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * This API is used for deleting the `ResourceProperty` of the Glue connection (for the source) or Glue database ARN (for the target).
 */
export const deleteIntegrationResourceProperty: (
  input: DeleteIntegrationResourcePropertyRequest,
) => effect.Effect<
  DeleteIntegrationResourcePropertyResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteIntegrationTableProperties: (
  input: DeleteIntegrationTablePropertiesRequest,
) => effect.Effect<
  DeleteIntegrationTablePropertiesResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * This API is used to provide optional override properties for the tables that need to be replicated. These properties can include properties for filtering and partitioning for the source and target tables. To set both source and target properties the same API need to be invoked with the Glue connection ARN as `ResourceArn` with `SourceTableConfig`, and the Glue database ARN as `ResourceArn` with `TargetTableConfig` respectively.
 *
 * The override will be reflected across all the integrations using same `ResourceArn` and source table.
 */
export const updateIntegrationTableProperties: (
  input: UpdateIntegrationTablePropertiesRequest,
) => effect.Effect<
  UpdateIntegrationTablePropertiesResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * This API can be used for setting up the `ResourceProperty` of the Glue connection (for the source) or Glue database ARN (for the target). These properties can include the role to access the connection or database. To set both source and target properties the same API needs to be invoked with the Glue connection ARN as `ResourceArn` with `SourceProcessingProperties` and the Glue database ARN as `ResourceArn` with `TargetProcessingProperties` respectively.
 */
export const createIntegrationResourceProperty: (
  input: CreateIntegrationResourcePropertyRequest,
) => effect.Effect<
  CreateIntegrationResourcePropertyResponse,
  | AccessDeniedException
  | ConflictException
  | EntityNotFoundException
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createIntegrationTableProperties: (
  input: CreateIntegrationTablePropertiesRequest,
) => effect.Effect<
  CreateIntegrationTablePropertiesResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Starts a task to estimate the quality of the transform.
 *
 * When you provide label sets as examples of truth, Glue machine learning uses some of
 * those examples to learn from them. The rest of the labels are used as a test to estimate
 * quality.
 *
 * Returns a unique identifier for the run. You can call `GetMLTaskRun` to get more
 * information about the stats of the `EvaluationTaskRun`.
 */
export const startMLEvaluationTaskRun: (
  input: StartMLEvaluationTaskRunRequest,
) => effect.Effect<
  StartMLEvaluationTaskRunResponse,
  | ConcurrentRunsExceededException
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | MLTransformNotReadyException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates settings for a column statistics task.
 */
export const updateColumnStatisticsTaskSettings: (
  input: UpdateColumnStatisticsTaskSettingsRequest,
) => effect.Effect<
  UpdateColumnStatisticsTaskSettingsResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | VersionMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates a crawler. If a crawler is
 * running, you must stop it using `StopCrawler` before updating
 * it.
 */
export const updateCrawler: (
  input: UpdateCrawlerRequest,
) => effect.Effect<
  UpdateCrawlerResponse,
  | CrawlerRunningException
  | EntityNotFoundException
  | InvalidInputException
  | OperationTimeoutException
  | VersionMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates an Glue usage profile.
 */
export const createUsageProfile: (
  input: CreateUsageProfileRequest,
) => effect.Effect<
  CreateUsageProfileResponse,
  | AlreadyExistsException
  | InternalServiceException
  | InvalidInputException
  | OperationNotSupportedException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeConnectionType: (
  input: DescribeConnectionTypeRequest,
) => effect.Effect<
  DescribeConnectionTypeResponse,
  | AccessDeniedException
  | InternalServiceException
  | InvalidInputException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeConnectionTypeRequest,
  output: DescribeConnectionTypeResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    InvalidInputException,
    ValidationException,
  ],
}));
/**
 * Returns a list of inbound integrations for the specified integration.
 */
export const describeInboundIntegrations: (
  input: DescribeInboundIntegrationsRequest,
) => effect.Effect<
  DescribeInboundIntegrationsResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | IntegrationNotFoundFault
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | OperationNotSupportedException
  | TargetResourceNotFound
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * The name of the Catalog to retrieve. This should be all lowercase.
 */
export const getCatalog: (
  input: GetCatalogRequest,
) => effect.Effect<
  GetCatalogResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getConnection: (
  input: GetConnectionRequest,
) => effect.Effect<
  GetConnectionResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDataQualityResult: (
  input: GetDataQualityResultRequest,
) => effect.Effect<
  GetDataQualityResultResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDataQualityResultRequest,
  output: GetDataQualityResultResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
}));
/**
 * Gets an Glue machine learning transform artifact and all its corresponding metadata.
 * Machine learning transforms are a special type of transform that use machine learning to learn
 * the details of the transformation to be performed by learning from examples provided by
 * humans. These transformations are then saved by Glue. You can retrieve their metadata by
 * calling `GetMLTransform`.
 */
export const getMLTransform: (
  input: GetMLTransformRequest,
) => effect.Effect<
  GetMLTransformResponse,
  | EntityNotFoundException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getMLTransforms: {
  (
    input: GetMLTransformsRequest,
  ): effect.Effect<
    GetMLTransformsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetMLTransformsRequest,
  ) => stream.Stream<
    GetMLTransformsResponse,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetMLTransformsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetMLTransformsRequest,
  output: GetMLTransformsResponse,
  errors: [
    EntityNotFoundException,
    InternalServiceException,
    InvalidInputException,
    OperationTimeoutException,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves the statement.
 */
export const getStatement: (
  input: GetStatementRequest,
) => effect.Effect<
  GetStatementResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | IllegalSessionStateException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves partition metadata from the Data Catalog that contains unfiltered
 * metadata.
 *
 * For IAM authorization, the public IAM action associated with this API is `glue:GetPartition`.
 */
export const getUnfilteredPartitionMetadata: (
  input: GetUnfilteredPartitionMetadataRequest,
) => effect.Effect<
  GetUnfilteredPartitionMetadataResponse,
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | PermissionTypeMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists the history of previous optimizer runs for a specific table.
 */
export const listTableOptimizerRuns: {
  (
    input: ListTableOptimizerRunsRequest,
  ): effect.Effect<
    ListTableOptimizerRunsResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTableOptimizerRunsRequest,
  ) => stream.Stream<
    ListTableOptimizerRunsResponse,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTableOptimizerRunsRequest,
  ) => stream.Stream<
    TableOptimizerRun,
    | AccessDeniedException
    | EntityNotFoundException
    | InternalServiceException
    | InvalidInputException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "TableOptimizerRuns",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Queries for the schema version metadata information.
 */
export const querySchemaVersionMetadata: (
  input: QuerySchemaVersionMetadataInput,
) => effect.Effect<
  QuerySchemaVersionMetadataResponse,
  | AccessDeniedException
  | EntityNotFoundException
  | InvalidInputException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: QuerySchemaVersionMetadataInput,
  output: QuerySchemaVersionMetadataResponse,
  errors: [
    AccessDeniedException,
    EntityNotFoundException,
    InvalidInputException,
  ],
}));
/**
 * Retrieves information about the partitions in a table.
 */
export const getPartitions: {
  (
    input: GetPartitionsRequest,
  ): effect.Effect<
    GetPartitionsResponse,
    | EntityNotFoundException
    | FederationSourceException
    | FederationSourceRetryableException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | InvalidStateException
    | OperationTimeoutException
    | ResourceNotReadyException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetPartitionsRequest,
  ) => stream.Stream<
    GetPartitionsResponse,
    | EntityNotFoundException
    | FederationSourceException
    | FederationSourceRetryableException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | InvalidStateException
    | OperationTimeoutException
    | ResourceNotReadyException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetPartitionsRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | FederationSourceException
    | FederationSourceRetryableException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | InvalidStateException
    | OperationTimeoutException
    | ResourceNotReadyException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Modifies a Zero-ETL integration in the caller's account.
 */
export const modifyIntegration: (
  input: ModifyIntegrationRequest,
) => effect.Effect<
  ModifyIntegrationResponse,
  | AccessDeniedException
  | ConflictException
  | EntityNotFoundException
  | IntegrationConflictOperationFault
  | IntegrationNotFoundFault
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | InvalidIntegrationStateFault
  | InvalidStateException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Allows a third-party analytical engine to retrieve unfiltered table metadata from the Data Catalog.
 *
 * For IAM authorization, the public IAM action associated with this API is `glue:GetTable`.
 */
export const getUnfilteredTableMetadata: (
  input: GetUnfilteredTableMetadataRequest,
) => effect.Effect<
  GetUnfilteredTableMetadataResponse,
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | PermissionTypeMismatchException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Retrieves partition metadata from the Data Catalog that contains unfiltered
 * metadata.
 *
 * For IAM authorization, the public IAM action associated with this API is `glue:GetPartitions`.
 */
export const getUnfilteredPartitionsMetadata: {
  (
    input: GetUnfilteredPartitionsMetadataRequest,
  ): effect.Effect<
    GetUnfilteredPartitionsMetadataResponse,
    | EntityNotFoundException
    | FederationSourceException
    | FederationSourceRetryableException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | PermissionTypeMismatchException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetUnfilteredPartitionsMetadataRequest,
  ) => stream.Stream<
    GetUnfilteredPartitionsMetadataResponse,
    | EntityNotFoundException
    | FederationSourceException
    | FederationSourceRetryableException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | PermissionTypeMismatchException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetUnfilteredPartitionsMetadataRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | FederationSourceException
    | FederationSourceRetryableException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | PermissionTypeMismatchException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Retrieves partitions in a batch request.
 */
export const batchGetPartition: (
  input: BatchGetPartitionRequest,
) => effect.Effect<
  BatchGetPartitionResponse,
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | InvalidStateException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the specified Zero-ETL integration.
 */
export const deleteIntegration: (
  input: DeleteIntegrationRequest,
) => effect.Effect<
  DeleteIntegrationResponse,
  | AccessDeniedException
  | ConflictException
  | EntityNotFoundException
  | IntegrationConflictOperationFault
  | IntegrationNotFoundFault
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | InvalidIntegrationStateFault
  | InvalidStateException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates one or more partitions in a batch operation.
 */
export const batchCreatePartition: (
  input: BatchCreatePartitionRequest,
) => effect.Effect<
  BatchCreatePartitionResponse,
  | AlreadyExistsException
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Creates a connection definition in the Data Catalog.
 *
 * Connections used for creating federated resources require the IAM `glue:PassConnection` permission.
 */
export const createConnection: (
  input: CreateConnectionRequest,
) => effect.Effect<
  CreateConnectionResponse,
  | AlreadyExistsException
  | GlueEncryptionException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createIntegration: (
  input: CreateIntegrationRequest,
) => effect.Effect<
  CreateIntegrationResponse,
  | AccessDeniedException
  | ConflictException
  | EntityNotFoundException
  | IntegrationConflictOperationFault
  | IntegrationQuotaExceededFault
  | InternalServerException
  | InternalServiceException
  | InvalidInputException
  | KMSKeyNotAccessibleFault
  | ResourceNotFoundException
  | ResourceNumberLimitExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTable: (
  input: CreateTableRequest,
) => effect.Effect<
  CreateTableResponse,
  | AlreadyExistsException
  | ConcurrentModificationException
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNotReadyException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getTables: {
  (
    input: GetTablesRequest,
  ): effect.Effect<
    GetTablesResponse,
    | EntityNotFoundException
    | FederationSourceException
    | FederationSourceRetryableException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetTablesRequest,
  ) => stream.Stream<
    GetTablesResponse,
    | EntityNotFoundException
    | FederationSourceException
    | FederationSourceRetryableException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetTablesRequest,
  ) => stream.Stream<
    unknown,
    | EntityNotFoundException
    | FederationSourceException
    | FederationSourceRetryableException
    | GlueEncryptionException
    | InternalServiceException
    | InvalidInputException
    | OperationTimeoutException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Creates or updates partition statistics of columns.
 *
 * The Identity and Access Management (IAM) permission required for this operation is `UpdatePartition`.
 */
export const updateColumnStatisticsForPartition: (
  input: UpdateColumnStatisticsForPartitionRequest,
) => effect.Effect<
  UpdateColumnStatisticsForPartitionResponse,
  | EntityNotFoundException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateTable: (
  input: UpdateTableRequest,
) => effect.Effect<
  UpdateTableResponse,
  | AlreadyExistsException
  | ConcurrentModificationException
  | EntityNotFoundException
  | FederationSourceException
  | FederationSourceRetryableException
  | GlueEncryptionException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNotReadyException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const batchGetWorkflows: (
  input: BatchGetWorkflowsRequest,
) => effect.Effect<
  BatchGetWorkflowsResponse,
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createJob: (
  input: CreateJobRequest,
) => effect.Effect<
  CreateJobResponse,
  | AlreadyExistsException
  | ConcurrentModificationException
  | IdempotentParameterMismatchException
  | InternalServiceException
  | InvalidInputException
  | OperationTimeoutException
  | ResourceNumberLimitExceededException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
