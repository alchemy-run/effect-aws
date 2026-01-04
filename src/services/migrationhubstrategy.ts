import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const svc = T.AwsApiService({
  sdkId: "MigrationHubStrategy",
  serviceShapeName: "AWSMigrationHubStrategyRecommendation",
});
const auth = T.AwsAuthSigv4({ name: "migrationhub-strategy" });
const ver = T.ServiceVersion("2020-02-19");
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
                        url: "https://migrationhub-strategy-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://migrationhub-strategy-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://migrationhub-strategy.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://migrationhub-strategy.{Region}.{PartitionResult#dnsSuffix}",
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
export class GetLatestAssessmentIdRequest extends S.Class<GetLatestAssessmentIdRequest>(
  "GetLatestAssessmentIdRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/get-latest-assessment-id" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPortfolioPreferencesRequest extends S.Class<GetPortfolioPreferencesRequest>(
  "GetPortfolioPreferencesRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/get-portfolio-preferences" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetPortfolioSummaryRequest extends S.Class<GetPortfolioSummaryRequest>(
  "GetPortfolioSummaryRequest",
)(
  {},
  T.all(
    T.Http({ method: "GET", uri: "/get-portfolio-summary" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApplicationComponentDetailsRequest extends S.Class<GetApplicationComponentDetailsRequest>(
  "GetApplicationComponentDetailsRequest",
)(
  { applicationComponentId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/get-applicationcomponent-details/{applicationComponentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetApplicationComponentStrategiesRequest extends S.Class<GetApplicationComponentStrategiesRequest>(
  "GetApplicationComponentStrategiesRequest",
)(
  { applicationComponentId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({
      method: "GET",
      uri: "/get-applicationcomponent-strategies/{applicationComponentId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetAssessmentRequest extends S.Class<GetAssessmentRequest>(
  "GetAssessmentRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/get-assessment/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetImportFileTaskRequest extends S.Class<GetImportFileTaskRequest>(
  "GetImportFileTaskRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/get-import-file-task/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetLatestAssessmentIdResponse extends S.Class<GetLatestAssessmentIdResponse>(
  "GetLatestAssessmentIdResponse",
)({ id: S.optional(S.String) }) {}
export class GetRecommendationReportDetailsRequest extends S.Class<GetRecommendationReportDetailsRequest>(
  "GetRecommendationReportDetailsRequest",
)(
  { id: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/get-recommendation-report-details/{id}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServerDetailsRequest extends S.Class<GetServerDetailsRequest>(
  "GetServerDetailsRequest",
)(
  {
    serverId: S.String.pipe(T.HttpLabel()),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/get-server-details/{serverId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetServerStrategiesRequest extends S.Class<GetServerStrategiesRequest>(
  "GetServerStrategiesRequest",
)(
  { serverId: S.String.pipe(T.HttpLabel()) },
  T.all(
    T.Http({ method: "GET", uri: "/get-server-strategies/{serverId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListAnalyzableServersRequest extends S.Class<ListAnalyzableServersRequest>(
  "ListAnalyzableServersRequest",
)(
  {
    sort: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-analyzable-servers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListCollectorsRequest extends S.Class<ListCollectorsRequest>(
  "ListCollectorsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/list-collectors" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListImportFileTaskRequest extends S.Class<ListImportFileTaskRequest>(
  "ListImportFileTaskRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/list-import-file-task" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Group extends S.Class<Group>("Group")({
  name: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const GroupIds = S.Array(Group);
export class ListServersRequest extends S.Class<ListServersRequest>(
  "ListServersRequest",
)(
  {
    serverCriteria: S.optional(S.String),
    filterValue: S.optional(S.String),
    sort: S.optional(S.String),
    groupIdFilter: S.optional(GroupIds),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-servers" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class BusinessGoals extends S.Class<BusinessGoals>("BusinessGoals")({
  speedOfMigration: S.optional(S.Number),
  reduceOperationalOverheadWithManagedServices: S.optional(S.Number),
  modernizeInfrastructureWithCloudNativeTechnologies: S.optional(S.Number),
  licenseCostReduction: S.optional(S.Number),
}) {}
export class PrioritizeBusinessGoals extends S.Class<PrioritizeBusinessGoals>(
  "PrioritizeBusinessGoals",
)({ businessGoals: S.optional(BusinessGoals) }) {}
export const AwsManagedTargetDestinations = S.Array(S.String);
export class AwsManagedResources extends S.Class<AwsManagedResources>(
  "AwsManagedResources",
)({ targetDestination: AwsManagedTargetDestinations }) {}
export const SelfManageTargetDestinations = S.Array(S.String);
export class SelfManageResources extends S.Class<SelfManageResources>(
  "SelfManageResources",
)({ targetDestination: SelfManageTargetDestinations }) {}
export const NoPreferenceTargetDestinations = S.Array(S.String);
export class NoManagementPreference extends S.Class<NoManagementPreference>(
  "NoManagementPreference",
)({ targetDestination: NoPreferenceTargetDestinations }) {}
export const ManagementPreference = S.Union(
  S.Struct({ awsManagedResources: AwsManagedResources }),
  S.Struct({ selfManageResources: SelfManageResources }),
  S.Struct({ noPreference: NoManagementPreference }),
);
export class ApplicationPreferences extends S.Class<ApplicationPreferences>(
  "ApplicationPreferences",
)({ managementPreference: S.optional(ManagementPreference) }) {}
export const HeterogeneousTargetDatabaseEngines = S.Array(S.String);
export class Heterogeneous extends S.Class<Heterogeneous>("Heterogeneous")({
  targetDatabaseEngine: HeterogeneousTargetDatabaseEngines,
}) {}
export const HomogeneousTargetDatabaseEngines = S.Array(S.String);
export class Homogeneous extends S.Class<Homogeneous>("Homogeneous")({
  targetDatabaseEngine: S.optional(HomogeneousTargetDatabaseEngines),
}) {}
export const TargetDatabaseEngines = S.Array(S.String);
export class NoDatabaseMigrationPreference extends S.Class<NoDatabaseMigrationPreference>(
  "NoDatabaseMigrationPreference",
)({ targetDatabaseEngine: TargetDatabaseEngines }) {}
export const DatabaseMigrationPreference = S.Union(
  S.Struct({ heterogeneous: Heterogeneous }),
  S.Struct({ homogeneous: Homogeneous }),
  S.Struct({ noPreference: NoDatabaseMigrationPreference }),
);
export class DatabasePreferences extends S.Class<DatabasePreferences>(
  "DatabasePreferences",
)({
  databaseManagementPreference: S.optional(S.String),
  databaseMigrationPreference: S.optional(DatabaseMigrationPreference),
}) {}
export class PutPortfolioPreferencesRequest extends S.Class<PutPortfolioPreferencesRequest>(
  "PutPortfolioPreferencesRequest",
)(
  {
    prioritizeBusinessGoals: S.optional(PrioritizeBusinessGoals),
    applicationPreferences: S.optional(ApplicationPreferences),
    databasePreferences: S.optional(DatabasePreferences),
    applicationMode: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/put-portfolio-preferences" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class PutPortfolioPreferencesResponse extends S.Class<PutPortfolioPreferencesResponse>(
  "PutPortfolioPreferencesResponse",
)({}) {}
export class StartImportFileTaskRequest extends S.Class<StartImportFileTaskRequest>(
  "StartImportFileTaskRequest",
)(
  {
    name: S.String,
    S3Bucket: S.String,
    s3key: S.String,
    dataSourceType: S.optional(S.String),
    groupId: S.optional(GroupIds),
    s3bucketForReportData: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/start-import-file-task" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartRecommendationReportGenerationRequest extends S.Class<StartRecommendationReportGenerationRequest>(
  "StartRecommendationReportGenerationRequest",
)(
  { outputFormat: S.optional(S.String), groupIdFilter: S.optional(GroupIds) },
  T.all(
    T.Http({ method: "POST", uri: "/start-recommendation-report-generation" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopAssessmentRequest extends S.Class<StopAssessmentRequest>(
  "StopAssessmentRequest",
)(
  { assessmentId: S.String },
  T.all(
    T.Http({ method: "POST", uri: "/stop-assessment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopAssessmentResponse extends S.Class<StopAssessmentResponse>(
  "StopAssessmentResponse",
)({}) {}
export class StrategyOption extends S.Class<StrategyOption>("StrategyOption")({
  strategy: S.optional(S.String),
  toolName: S.optional(S.String),
  targetDestination: S.optional(S.String),
  isPreferred: S.optional(S.Boolean),
}) {}
export class UpdateServerConfigRequest extends S.Class<UpdateServerConfigRequest>(
  "UpdateServerConfigRequest",
)(
  { serverId: S.String, strategyOption: S.optional(StrategyOption) },
  T.all(
    T.Http({ method: "POST", uri: "/update-server-config/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateServerConfigResponse extends S.Class<UpdateServerConfigResponse>(
  "UpdateServerConfigResponse",
)({}) {}
export const AssessmentTargetValues = S.Array(S.String);
export const AssociatedServerIDs = S.Array(S.String);
export class TransformationTool extends S.Class<TransformationTool>(
  "TransformationTool",
)({
  name: S.optional(S.String),
  description: S.optional(S.String),
  tranformationToolInstallationLink: S.optional(S.String),
}) {}
export class RecommendationSet extends S.Class<RecommendationSet>(
  "RecommendationSet",
)({
  transformationTool: S.optional(TransformationTool),
  targetDestination: S.optional(S.String),
  strategy: S.optional(S.String),
}) {}
export class AntipatternSeveritySummary extends S.Class<AntipatternSeveritySummary>(
  "AntipatternSeveritySummary",
)({ severity: S.optional(S.String), count: S.optional(S.Number) }) {}
export const ListAntipatternSeveritySummary = S.Array(
  AntipatternSeveritySummary,
);
export class OSInfo extends S.Class<OSInfo>("OSInfo")({
  type: S.optional(S.String),
  version: S.optional(S.String),
}) {}
export class NetworkInfo extends S.Class<NetworkInfo>("NetworkInfo")({
  interfaceName: S.String,
  ipAddress: S.String,
  macAddress: S.String,
  netMask: S.String,
}) {}
export const NetworkInfoList = S.Array(NetworkInfo);
export class SystemInfo extends S.Class<SystemInfo>("SystemInfo")({
  osInfo: S.optional(OSInfo),
  fileSystemType: S.optional(S.String),
  networkInfoList: S.optional(NetworkInfoList),
  cpuArchitecture: S.optional(S.String),
}) {}
export class StrategySummary extends S.Class<StrategySummary>(
  "StrategySummary",
)({ strategy: S.optional(S.String), count: S.optional(S.Number) }) {}
export const ListStrategySummary = S.Array(StrategySummary);
export class S3Object extends S.Class<S3Object>("S3Object")({
  s3Bucket: S.optional(S.String),
  s3key: S.optional(S.String),
}) {}
export class ServerError extends S.Class<ServerError>("ServerError")({
  serverErrorCategory: S.optional(S.String),
}) {}
export class ServerDetail extends S.Class<ServerDetail>("ServerDetail")({
  id: S.optional(S.String),
  name: S.optional(S.String),
  recommendationSet: S.optional(RecommendationSet),
  dataCollectionStatus: S.optional(S.String),
  statusMessage: S.optional(S.String),
  listAntipatternSeveritySummary: S.optional(ListAntipatternSeveritySummary),
  systemInfo: S.optional(SystemInfo),
  applicationComponentStrategySummary: S.optional(ListStrategySummary),
  antipatternReportS3Object: S.optional(S3Object),
  antipatternReportStatus: S.optional(S.String),
  antipatternReportStatusMessage: S.optional(S.String),
  serverType: S.optional(S.String),
  lastAnalyzedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  serverError: S.optional(ServerError),
}) {}
export const ServerDetails = S.Array(ServerDetail);
export class AssessmentTarget extends S.Class<AssessmentTarget>(
  "AssessmentTarget",
)({ condition: S.String, name: S.String, values: AssessmentTargetValues }) {}
export const AssessmentTargets = S.Array(AssessmentTarget);
export class SourceCode extends S.Class<SourceCode>("SourceCode")({
  versionControl: S.optional(S.String),
  sourceVersion: S.optional(S.String),
  location: S.optional(S.String),
  projectName: S.optional(S.String),
}) {}
export const SourceCodeList = S.Array(SourceCode);
export class GetImportFileTaskResponse extends S.Class<GetImportFileTaskResponse>(
  "GetImportFileTaskResponse",
)({
  id: S.optional(S.String),
  status: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  inputS3Bucket: S.optional(S.String),
  inputS3Key: S.optional(S.String),
  statusReportS3Bucket: S.optional(S.String),
  statusReportS3Key: S.optional(S.String),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  numberOfRecordsSuccess: S.optional(S.Number),
  numberOfRecordsFailed: S.optional(S.Number),
  importName: S.optional(S.String),
}) {}
export class ListApplicationComponentsRequest extends S.Class<ListApplicationComponentsRequest>(
  "ListApplicationComponentsRequest",
)(
  {
    applicationComponentCriteria: S.optional(S.String),
    filterValue: S.optional(S.String),
    sort: S.optional(S.String),
    groupIdFilter: S.optional(GroupIds),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(
    T.Http({ method: "POST", uri: "/list-applicationcomponents" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListServersResponse extends S.Class<ListServersResponse>(
  "ListServersResponse",
)({
  serverInfos: S.optional(ServerDetails),
  nextToken: S.optional(S.String),
}) {}
export class StartAssessmentRequest extends S.Class<StartAssessmentRequest>(
  "StartAssessmentRequest",
)(
  {
    s3bucketForAnalysisData: S.optional(S.String),
    s3bucketForReportData: S.optional(S.String),
    assessmentTargets: S.optional(AssessmentTargets),
    assessmentDataSourceType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/start-assessment" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartImportFileTaskResponse extends S.Class<StartImportFileTaskResponse>(
  "StartImportFileTaskResponse",
)({ id: S.optional(S.String) }) {}
export class StartRecommendationReportGenerationResponse extends S.Class<StartRecommendationReportGenerationResponse>(
  "StartRecommendationReportGenerationResponse",
)({ id: S.optional(S.String) }) {}
export class UpdateApplicationComponentConfigRequest extends S.Class<UpdateApplicationComponentConfigRequest>(
  "UpdateApplicationComponentConfigRequest",
)(
  {
    applicationComponentId: S.String,
    inclusionStatus: S.optional(S.String),
    strategyOption: S.optional(StrategyOption),
    sourceCodeList: S.optional(SourceCodeList),
    secretsManagerKey: S.optional(S.String),
    configureOnly: S.optional(S.Boolean),
    appType: S.optional(S.String),
  },
  T.all(
    T.Http({ method: "POST", uri: "/update-applicationcomponent-config/" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UpdateApplicationComponentConfigResponse extends S.Class<UpdateApplicationComponentConfigResponse>(
  "UpdateApplicationComponentConfigResponse",
)({}) {}
export class ApplicationComponentSummary extends S.Class<ApplicationComponentSummary>(
  "ApplicationComponentSummary",
)({ appType: S.optional(S.String), count: S.optional(S.Number) }) {}
export const ListApplicationComponentSummary = S.Array(
  ApplicationComponentSummary,
);
export class ServerSummary extends S.Class<ServerSummary>("ServerSummary")({
  ServerOsType: S.optional(S.String),
  count: S.optional(S.Number),
}) {}
export const ListServerSummary = S.Array(ServerSummary);
export class ApplicationComponentStatusSummary extends S.Class<ApplicationComponentStatusSummary>(
  "ApplicationComponentStatusSummary",
)({
  srcCodeOrDbAnalysisStatus: S.optional(S.String),
  count: S.optional(S.Number),
}) {}
export const ListApplicationComponentStatusSummary = S.Array(
  ApplicationComponentStatusSummary,
);
export class ServerStatusSummary extends S.Class<ServerStatusSummary>(
  "ServerStatusSummary",
)({
  runTimeAssessmentStatus: S.optional(S.String),
  count: S.optional(S.Number),
}) {}
export const ListServerStatusSummary = S.Array(ServerStatusSummary);
export const S3Keys = S.Array(S.String);
export class AssociatedApplication extends S.Class<AssociatedApplication>(
  "AssociatedApplication",
)({ name: S.optional(S.String), id: S.optional(S.String) }) {}
export const AssociatedApplications = S.Array(AssociatedApplication);
export class ApplicationComponentStrategy extends S.Class<ApplicationComponentStrategy>(
  "ApplicationComponentStrategy",
)({
  recommendation: S.optional(RecommendationSet),
  status: S.optional(S.String),
  isPreferred: S.optional(S.Boolean),
}) {}
export const ApplicationComponentStrategies = S.Array(
  ApplicationComponentStrategy,
);
export class DataCollectionDetails extends S.Class<DataCollectionDetails>(
  "DataCollectionDetails",
)({
  status: S.optional(S.String),
  servers: S.optional(S.Number),
  failed: S.optional(S.Number),
  success: S.optional(S.Number),
  inProgress: S.optional(S.Number),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  statusMessage: S.optional(S.String),
}) {}
export class AssessmentSummary extends S.Class<AssessmentSummary>(
  "AssessmentSummary",
)({
  listServerStrategySummary: S.optional(ListStrategySummary),
  listApplicationComponentStrategySummary: S.optional(ListStrategySummary),
  listAntipatternSeveritySummary: S.optional(ListAntipatternSeveritySummary),
  listApplicationComponentSummary: S.optional(ListApplicationComponentSummary),
  listServerSummary: S.optional(ListServerSummary),
  antipatternReportS3Object: S.optional(S3Object),
  antipatternReportStatus: S.optional(S.String),
  antipatternReportStatusMessage: S.optional(S.String),
  lastAnalyzedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  listApplicationComponentStatusSummary: S.optional(
    ListApplicationComponentStatusSummary,
  ),
  listServerStatusSummary: S.optional(ListServerStatusSummary),
}) {}
export class RecommendationReportDetails extends S.Class<RecommendationReportDetails>(
  "RecommendationReportDetails",
)({
  status: S.optional(S.String),
  statusMessage: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  s3Bucket: S.optional(S.String),
  s3Keys: S.optional(S3Keys),
}) {}
export class ServerStrategy extends S.Class<ServerStrategy>("ServerStrategy")({
  recommendation: S.optional(RecommendationSet),
  status: S.optional(S.String),
  numberOfApplicationComponents: S.optional(S.Number),
  isPreferred: S.optional(S.Boolean),
}) {}
export const ServerStrategies = S.Array(ServerStrategy);
export class AnalyzableServerSummary extends S.Class<AnalyzableServerSummary>(
  "AnalyzableServerSummary",
)({
  hostname: S.optional(S.String),
  ipAddress: S.optional(S.String),
  source: S.optional(S.String),
  vmId: S.optional(S.String),
}) {}
export const AnalyzableServerSummaryList = S.Array(AnalyzableServerSummary);
export class DatabaseConfigDetail extends S.Class<DatabaseConfigDetail>(
  "DatabaseConfigDetail",
)({ secretName: S.optional(S.String) }) {}
export class SourceCodeRepository extends S.Class<SourceCodeRepository>(
  "SourceCodeRepository",
)({
  repository: S.optional(S.String),
  branch: S.optional(S.String),
  versionControlType: S.optional(S.String),
  projectName: S.optional(S.String),
}) {}
export const SourceCodeRepositories = S.Array(SourceCodeRepository);
export class AppUnitError extends S.Class<AppUnitError>("AppUnitError")({
  appUnitErrorCategory: S.optional(S.String),
}) {}
export const AnalysisStatusUnion = S.Union(
  S.Struct({ runtimeAnalysisStatus: S.String }),
  S.Struct({ srcCodeOrDbAnalysisStatus: S.String }),
);
export const AnalyzerNameUnion = S.Union(
  S.Struct({ binaryAnalyzerName: S.String }),
  S.Struct({ runTimeAnalyzerName: S.String }),
  S.Struct({ sourceCodeAnalyzerName: S.String }),
);
export class AntipatternReportResult extends S.Class<AntipatternReportResult>(
  "AntipatternReportResult",
)({
  analyzerName: S.optional(AnalyzerNameUnion),
  antiPatternReportS3Object: S.optional(S3Object),
  antipatternReportStatus: S.optional(S.String),
  antipatternReportStatusMessage: S.optional(S.String),
}) {}
export const AntipatternReportResultList = S.Array(AntipatternReportResult);
export class Result extends S.Class<Result>("Result")({
  analysisType: S.optional(S.String),
  analysisStatus: S.optional(AnalysisStatusUnion),
  statusMessage: S.optional(S.String),
  antipatternReportResultList: S.optional(AntipatternReportResultList),
}) {}
export const ResultList = S.Array(Result);
export class ApplicationComponentDetail extends S.Class<ApplicationComponentDetail>(
  "ApplicationComponentDetail",
)({
  id: S.optional(S.String),
  name: S.optional(S.String),
  recommendationSet: S.optional(RecommendationSet),
  analysisStatus: S.optional(S.String),
  statusMessage: S.optional(S.String),
  listAntipatternSeveritySummary: S.optional(ListAntipatternSeveritySummary),
  databaseConfigDetail: S.optional(DatabaseConfigDetail),
  sourceCodeRepositories: S.optional(SourceCodeRepositories),
  appType: S.optional(S.String),
  resourceSubType: S.optional(S.String),
  inclusionStatus: S.optional(S.String),
  antipatternReportS3Object: S.optional(S3Object),
  antipatternReportStatus: S.optional(S.String),
  antipatternReportStatusMessage: S.optional(S.String),
  osVersion: S.optional(S.String),
  osDriver: S.optional(S.String),
  lastAnalyzedTimestamp: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  associatedServerId: S.optional(S.String),
  moreServerAssociationExists: S.optional(S.Boolean),
  runtimeStatus: S.optional(S.String),
  runtimeStatusMessage: S.optional(S.String),
  appUnitError: S.optional(AppUnitError),
  resultList: S.optional(ResultList),
}) {}
export const ApplicationComponentDetails = S.Array(ApplicationComponentDetail);
export class ImportFileTaskInformation extends S.Class<ImportFileTaskInformation>(
  "ImportFileTaskInformation",
)({
  id: S.optional(S.String),
  status: S.optional(S.String),
  startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  inputS3Bucket: S.optional(S.String),
  inputS3Key: S.optional(S.String),
  statusReportS3Bucket: S.optional(S.String),
  statusReportS3Key: S.optional(S.String),
  completionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  numberOfRecordsSuccess: S.optional(S.Number),
  numberOfRecordsFailed: S.optional(S.Number),
  importName: S.optional(S.String),
}) {}
export const ListImportFileTaskInformation = S.Array(ImportFileTaskInformation);
export class GetApplicationComponentStrategiesResponse extends S.Class<GetApplicationComponentStrategiesResponse>(
  "GetApplicationComponentStrategiesResponse",
)({
  applicationComponentStrategies: S.optional(ApplicationComponentStrategies),
}) {}
export class GetAssessmentResponse extends S.Class<GetAssessmentResponse>(
  "GetAssessmentResponse",
)({
  id: S.optional(S.String),
  dataCollectionDetails: S.optional(DataCollectionDetails),
  assessmentTargets: S.optional(AssessmentTargets),
}) {}
export class GetPortfolioSummaryResponse extends S.Class<GetPortfolioSummaryResponse>(
  "GetPortfolioSummaryResponse",
)({ assessmentSummary: S.optional(AssessmentSummary) }) {}
export class GetRecommendationReportDetailsResponse extends S.Class<GetRecommendationReportDetailsResponse>(
  "GetRecommendationReportDetailsResponse",
)({
  id: S.optional(S.String),
  recommendationReportDetails: S.optional(RecommendationReportDetails),
}) {}
export class GetServerStrategiesResponse extends S.Class<GetServerStrategiesResponse>(
  "GetServerStrategiesResponse",
)({ serverStrategies: S.optional(ServerStrategies) }) {}
export class ListAnalyzableServersResponse extends S.Class<ListAnalyzableServersResponse>(
  "ListAnalyzableServersResponse",
)({
  analyzableServers: S.optional(AnalyzableServerSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListApplicationComponentsResponse extends S.Class<ListApplicationComponentsResponse>(
  "ListApplicationComponentsResponse",
)({
  applicationComponentInfos: S.optional(ApplicationComponentDetails),
  nextToken: S.optional(S.String),
}) {}
export class ListImportFileTaskResponse extends S.Class<ListImportFileTaskResponse>(
  "ListImportFileTaskResponse",
)({
  taskInfos: S.optional(ListImportFileTaskInformation),
  nextToken: S.optional(S.String),
}) {}
export class StartAssessmentResponse extends S.Class<StartAssessmentResponse>(
  "StartAssessmentResponse",
)({ assessmentId: S.optional(S.String) }) {}
export class VcenterBasedRemoteInfo extends S.Class<VcenterBasedRemoteInfo>(
  "VcenterBasedRemoteInfo",
)({
  vcenterConfigurationTimeStamp: S.optional(S.String),
  osType: S.optional(S.String),
}) {}
export const VcenterBasedRemoteInfoList = S.Array(VcenterBasedRemoteInfo);
export class IPAddressBasedRemoteInfo extends S.Class<IPAddressBasedRemoteInfo>(
  "IPAddressBasedRemoteInfo",
)({
  ipAddressConfigurationTimeStamp: S.optional(S.String),
  authType: S.optional(S.String),
  osType: S.optional(S.String),
}) {}
export const IPAddressBasedRemoteInfoList = S.Array(IPAddressBasedRemoteInfo);
export class VersionControlInfo extends S.Class<VersionControlInfo>(
  "VersionControlInfo",
)({
  versionControlType: S.optional(S.String),
  versionControlConfigurationTimeStamp: S.optional(S.String),
}) {}
export const VersionControlInfoList = S.Array(VersionControlInfo);
export class PipelineInfo extends S.Class<PipelineInfo>("PipelineInfo")({
  pipelineType: S.optional(S.String),
  pipelineConfigurationTimeStamp: S.optional(S.String),
}) {}
export const PipelineInfoList = S.Array(PipelineInfo);
export class RemoteSourceCodeAnalysisServerInfo extends S.Class<RemoteSourceCodeAnalysisServerInfo>(
  "RemoteSourceCodeAnalysisServerInfo",
)({
  remoteSourceCodeAnalysisServerConfigurationTimestamp: S.optional(S.String),
}) {}
export class GetPortfolioPreferencesResponse extends S.Class<GetPortfolioPreferencesResponse>(
  "GetPortfolioPreferencesResponse",
)({
  prioritizeBusinessGoals: S.optional(PrioritizeBusinessGoals),
  applicationPreferences: S.optional(ApplicationPreferences),
  databasePreferences: S.optional(DatabasePreferences),
  applicationMode: S.optional(S.String),
}) {}
export class ConfigurationSummary extends S.Class<ConfigurationSummary>(
  "ConfigurationSummary",
)({
  vcenterBasedRemoteInfoList: S.optional(VcenterBasedRemoteInfoList),
  ipAddressBasedRemoteInfoList: S.optional(IPAddressBasedRemoteInfoList),
  versionControlInfoList: S.optional(VersionControlInfoList),
  pipelineInfoList: S.optional(PipelineInfoList),
  remoteSourceCodeAnalysisServerInfo: S.optional(
    RemoteSourceCodeAnalysisServerInfo,
  ),
}) {}
export class Collector extends S.Class<Collector>("Collector")({
  collectorId: S.optional(S.String),
  ipAddress: S.optional(S.String),
  hostName: S.optional(S.String),
  collectorHealth: S.optional(S.String),
  collectorVersion: S.optional(S.String),
  registeredTimeStamp: S.optional(S.String),
  lastActivityTimeStamp: S.optional(S.String),
  configurationSummary: S.optional(ConfigurationSummary),
}) {}
export const Collectors = S.Array(Collector);
export class GetServerDetailsResponse extends S.Class<GetServerDetailsResponse>(
  "GetServerDetailsResponse",
)({
  nextToken: S.optional(S.String),
  serverDetail: S.optional(ServerDetail),
  associatedApplications: S.optional(AssociatedApplications),
}) {}
export class ListCollectorsResponse extends S.Class<ListCollectorsResponse>(
  "ListCollectorsResponse",
)({ Collectors: S.optional(Collectors), nextToken: S.optional(S.String) }) {}
export class GetApplicationComponentDetailsResponse extends S.Class<GetApplicationComponentDetailsResponse>(
  "GetApplicationComponentDetailsResponse",
)({
  applicationComponentDetail: S.optional(ApplicationComponentDetail),
  associatedApplications: S.optional(AssociatedApplications),
  moreApplicationResource: S.optional(S.Boolean),
  associatedServerIds: S.optional(AssociatedServerIDs),
}) {}

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
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
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {},
) {}
export class DependencyException extends S.TaggedError<DependencyException>()(
  "DependencyException",
  { message: S.optional(S.String) },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {},
) {}
export class ServiceLinkedRoleLockClientException extends S.TaggedError<ServiceLinkedRoleLockClientException>()(
  "ServiceLinkedRoleLockClientException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Saves the specified migration and modernization preferences.
 */
export const putPortfolioPreferences = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutPortfolioPreferencesRequest,
    output: PutPortfolioPreferencesResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Starts generating a recommendation report.
 */
export const startRecommendationReportGeneration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: StartRecommendationReportGenerationRequest,
    output: StartRecommendationReportGenerationResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Stops the assessment of an on-premises environment.
 */
export const stopAssessment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopAssessmentRequest,
  output: StopAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the configuration of an application component.
 */
export const updateApplicationComponentConfig =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateApplicationComponentConfigRequest,
    output: UpdateApplicationComponentConfigResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Updates the configuration of the specified server.
 */
export const updateServerConfig = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServerConfigRequest,
  output: UpdateServerConfigResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of all the recommended strategies and tools for an application component
 * running on a server.
 */
export const getApplicationComponentStrategies =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetApplicationComponentStrategiesRequest,
    output: GetApplicationComponentStrategiesResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
/**
 * Retrieves the status of an on-going assessment.
 */
export const getAssessment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAssessmentRequest,
  output: GetAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves the details about a specific import task.
 */
export const getImportFileTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetImportFileTaskRequest,
  output: GetImportFileTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieve the latest ID of a specific assessment task.
 */
export const getLatestAssessmentId = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetLatestAssessmentIdRequest,
    output: GetLatestAssessmentIdResponse,
    errors: [
      AccessDeniedException,
      DependencyException,
      InternalServerException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves overall summary including the number of servers to rehost and the overall
 * number of anti-patterns.
 */
export const getPortfolioSummary = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPortfolioSummaryRequest,
  output: GetPortfolioSummaryResponse,
  errors: [AccessDeniedException, InternalServerException, ThrottlingException],
}));
/**
 * Retrieves detailed information about the specified recommendation report.
 */
export const getRecommendationReportDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetRecommendationReportDetailsRequest,
    output: GetRecommendationReportDetailsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }));
/**
 * Retrieves recommended strategies and tools for the specified server.
 */
export const getServerStrategies = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServerStrategiesRequest,
  output: GetServerStrategiesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of all the servers fetched from customer vCenter using Strategy Recommendation Collector.
 */
export const listAnalyzableServers = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListAnalyzableServersRequest,
    output: ListAnalyzableServersResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves a list of all the imports performed.
 */
export const listImportFileTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListImportFileTaskRequest,
  output: ListImportFileTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all the servers.
 */
export const listServers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServersRequest,
  output: ListServersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts the assessment of an on-premises environment.
 */
export const startAssessment = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartAssessmentRequest,
  output: StartAssessmentResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
  ],
}));
/**
 * Starts a file import.
 */
export const startImportFileTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartImportFileTaskRequest,
  output: StartImportFileTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves your migration and modernization preferences.
 */
export const getPortfolioPreferences = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetPortfolioPreferencesRequest,
    output: GetPortfolioPreferencesResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }),
);
/**
 * Retrieves a list of all the application components (processes).
 */
export const listApplicationComponents = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListApplicationComponentsRequest,
    output: ListApplicationComponentsResponse,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ServiceLinkedRoleLockClientException,
      ValidationException,
    ],
  }),
);
/**
 * Retrieves detailed information about a specified server.
 */
export const getServerDetails = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetServerDetailsRequest,
  output: GetServerDetailsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves a list of all the installed collectors.
 */
export const listCollectors = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListCollectorsRequest,
  output: ListCollectorsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves details about an application component.
 */
export const getApplicationComponentDetails =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: GetApplicationComponentDetailsRequest,
    output: GetApplicationComponentDetailsResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
    ],
  }));
