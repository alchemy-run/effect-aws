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
  sdkId: "MigrationHubStrategy",
  serviceShapeName: "AWSMigrationHubStrategyRecommendation",
});
const auth = T.AwsAuthSigv4({ name: "migrationhub-strategy" });
const ver = T.ServiceVersion("2020-02-19");
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
              `https://migrationhub-strategy-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://migrationhub-strategy-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://migrationhub-strategy.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://migrationhub-strategy.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ApplicationComponentId = string;
export type AsyncTaskId = string;
export type ApplicationMode = string;
export type RecommendationTaskId = string;
export type ServerId = string;
export type NextToken = string;
export type MaxResult = number;
export type SortOrder = string;
export type ApplicationComponentCriteria = string;
export type ServerCriteria = string;
export type AssessmentDataSourceType = string;
export type ImportS3Bucket = string;
export type DataSourceType = string;
export type OutputFormat = string;
export type InclusionStatus = string;
export type SecretsManagerKey = string | redacted.Redacted<string>;
export type AppType = string;
export type DatabaseManagementPreference = string;
export type AntipatternReportStatus = string;
export type StatusMessage = string;
export type GroupName = string;
export type Condition = string;
export type Strategy = string;
export type TransformationToolName = string;
export type TargetDestination = string;
export type VersionControl = string;
export type SourceVersion = string;
export type Location = string;
export type ProjectName = string;
export type ImportFileTaskStatus = string;
export type ImportS3Key = string;
export type ErrorMessage = string;
export type BusinessGoalsInteger = number;
export type Severity = string;
export type ServerOsType = string;
export type S3Bucket = string;
export type S3Key = string;
export type SrcCodeOrDbAnalysisStatus = string;
export type RunTimeAssessmentStatus = string;
export type ResourceId = string;
export type ResourceName = string;
export type ResourceSubType = string;
export type RuntimeAnalysisStatus = string;
export type StrategyRecommendation = string;
export type AssessmentStatus = string;
export type AssessmentStatusMessage = string;
export type RecommendationReportStatus = string;
export type RecommendationReportStatusMessage = string;
export type RecommendationReportTimeStamp = Date;
export type CollectorHealth = string;
export type AwsManagedTargetDestination = string;
export type SelfManageTargetDestination = string;
export type NoPreferenceTargetDestination = string;
export type HeterogeneousTargetDatabaseEngine = string;
export type HomogeneousTargetDatabaseEngine = string;
export type TargetDatabaseEngine = string;
export type AppUnitErrorCategory = string;
export type AnalysisType = string;
export type ServerErrorCategory = string;
export type TranformationToolDescription = string;
export type TranformationToolInstallationLink = string;
export type OSType = string;
export type OSVersion = string;
export type InterfaceName = string;
export type IPAddress = string;
export type MacAddress = string;
export type NetMask = string;
export type AuthType = string;
export type VersionControlType = string;
export type PipelineType = string;
export type BinaryAnalyzerName = string;
export type RunTimeAnalyzerName = string;
export type SourceCodeAnalyzerName = string;

//# Schemas
export interface GetLatestAssessmentIdRequest {}
export const GetLatestAssessmentIdRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/get-latest-assessment-id" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetLatestAssessmentIdRequest",
}) as any as S.Schema<GetLatestAssessmentIdRequest>;
export interface GetPortfolioPreferencesRequest {}
export const GetPortfolioPreferencesRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/get-portfolio-preferences" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPortfolioPreferencesRequest",
}) as any as S.Schema<GetPortfolioPreferencesRequest>;
export interface GetPortfolioSummaryRequest {}
export const GetPortfolioSummaryRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/get-portfolio-summary" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetPortfolioSummaryRequest",
}) as any as S.Schema<GetPortfolioSummaryRequest>;
export interface GetApplicationComponentDetailsRequest {
  applicationComponentId: string;
}
export const GetApplicationComponentDetailsRequest = S.suspend(() =>
  S.Struct({
    applicationComponentId: S.String.pipe(
      T.HttpLabel("applicationComponentId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetApplicationComponentDetailsRequest",
}) as any as S.Schema<GetApplicationComponentDetailsRequest>;
export interface GetApplicationComponentStrategiesRequest {
  applicationComponentId: string;
}
export const GetApplicationComponentStrategiesRequest = S.suspend(() =>
  S.Struct({
    applicationComponentId: S.String.pipe(
      T.HttpLabel("applicationComponentId"),
    ),
  }).pipe(
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
  ),
).annotations({
  identifier: "GetApplicationComponentStrategiesRequest",
}) as any as S.Schema<GetApplicationComponentStrategiesRequest>;
export interface GetAssessmentRequest {
  id: string;
}
export const GetAssessmentRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/get-assessment/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetAssessmentRequest",
}) as any as S.Schema<GetAssessmentRequest>;
export interface GetImportFileTaskRequest {
  id: string;
}
export const GetImportFileTaskRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/get-import-file-task/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetImportFileTaskRequest",
}) as any as S.Schema<GetImportFileTaskRequest>;
export interface GetLatestAssessmentIdResponse {
  id?: string;
}
export const GetLatestAssessmentIdResponse = S.suspend(() =>
  S.Struct({ id: S.optional(S.String) }),
).annotations({
  identifier: "GetLatestAssessmentIdResponse",
}) as any as S.Schema<GetLatestAssessmentIdResponse>;
export interface GetRecommendationReportDetailsRequest {
  id: string;
}
export const GetRecommendationReportDetailsRequest = S.suspend(() =>
  S.Struct({ id: S.String.pipe(T.HttpLabel("id")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/get-recommendation-report-details/{id}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetRecommendationReportDetailsRequest",
}) as any as S.Schema<GetRecommendationReportDetailsRequest>;
export interface GetServerDetailsRequest {
  serverId: string;
  nextToken?: string;
  maxResults?: number;
}
export const GetServerDetailsRequest = S.suspend(() =>
  S.Struct({
    serverId: S.String.pipe(T.HttpLabel("serverId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/get-server-details/{serverId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServerDetailsRequest",
}) as any as S.Schema<GetServerDetailsRequest>;
export interface GetServerStrategiesRequest {
  serverId: string;
}
export const GetServerStrategiesRequest = S.suspend(() =>
  S.Struct({ serverId: S.String.pipe(T.HttpLabel("serverId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/get-server-strategies/{serverId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetServerStrategiesRequest",
}) as any as S.Schema<GetServerStrategiesRequest>;
export interface ListAnalyzableServersRequest {
  sort?: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListAnalyzableServersRequest = S.suspend(() =>
  S.Struct({
    sort: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-analyzable-servers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAnalyzableServersRequest",
}) as any as S.Schema<ListAnalyzableServersRequest>;
export interface ListCollectorsRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListCollectorsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/list-collectors" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListCollectorsRequest",
}) as any as S.Schema<ListCollectorsRequest>;
export interface ListImportFileTaskRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListImportFileTaskRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/list-import-file-task" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListImportFileTaskRequest",
}) as any as S.Schema<ListImportFileTaskRequest>;
export interface Group {
  name?: string;
  value?: string;
}
export const Group = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "Group" }) as any as S.Schema<Group>;
export type GroupIds = Group[];
export const GroupIds = S.Array(Group);
export interface ListServersRequest {
  serverCriteria?: string;
  filterValue?: string;
  sort?: string;
  groupIdFilter?: Group[];
  nextToken?: string;
  maxResults?: number;
}
export const ListServersRequest = S.suspend(() =>
  S.Struct({
    serverCriteria: S.optional(S.String),
    filterValue: S.optional(S.String),
    sort: S.optional(S.String),
    groupIdFilter: S.optional(GroupIds),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-servers" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListServersRequest",
}) as any as S.Schema<ListServersRequest>;
export interface BusinessGoals {
  speedOfMigration?: number;
  reduceOperationalOverheadWithManagedServices?: number;
  modernizeInfrastructureWithCloudNativeTechnologies?: number;
  licenseCostReduction?: number;
}
export const BusinessGoals = S.suspend(() =>
  S.Struct({
    speedOfMigration: S.optional(S.Number),
    reduceOperationalOverheadWithManagedServices: S.optional(S.Number),
    modernizeInfrastructureWithCloudNativeTechnologies: S.optional(S.Number),
    licenseCostReduction: S.optional(S.Number),
  }),
).annotations({
  identifier: "BusinessGoals",
}) as any as S.Schema<BusinessGoals>;
export interface PrioritizeBusinessGoals {
  businessGoals?: BusinessGoals;
}
export const PrioritizeBusinessGoals = S.suspend(() =>
  S.Struct({ businessGoals: S.optional(BusinessGoals) }),
).annotations({
  identifier: "PrioritizeBusinessGoals",
}) as any as S.Schema<PrioritizeBusinessGoals>;
export type AwsManagedTargetDestinations = string[];
export const AwsManagedTargetDestinations = S.Array(S.String);
export interface AwsManagedResources {
  targetDestination: string[];
}
export const AwsManagedResources = S.suspend(() =>
  S.Struct({ targetDestination: AwsManagedTargetDestinations }),
).annotations({
  identifier: "AwsManagedResources",
}) as any as S.Schema<AwsManagedResources>;
export type SelfManageTargetDestinations = string[];
export const SelfManageTargetDestinations = S.Array(S.String);
export interface SelfManageResources {
  targetDestination: string[];
}
export const SelfManageResources = S.suspend(() =>
  S.Struct({ targetDestination: SelfManageTargetDestinations }),
).annotations({
  identifier: "SelfManageResources",
}) as any as S.Schema<SelfManageResources>;
export type NoPreferenceTargetDestinations = string[];
export const NoPreferenceTargetDestinations = S.Array(S.String);
export interface NoManagementPreference {
  targetDestination: string[];
}
export const NoManagementPreference = S.suspend(() =>
  S.Struct({ targetDestination: NoPreferenceTargetDestinations }),
).annotations({
  identifier: "NoManagementPreference",
}) as any as S.Schema<NoManagementPreference>;
export type ManagementPreference =
  | {
      awsManagedResources: AwsManagedResources;
      selfManageResources?: never;
      noPreference?: never;
    }
  | {
      awsManagedResources?: never;
      selfManageResources: SelfManageResources;
      noPreference?: never;
    }
  | {
      awsManagedResources?: never;
      selfManageResources?: never;
      noPreference: NoManagementPreference;
    };
export const ManagementPreference = S.Union(
  S.Struct({ awsManagedResources: AwsManagedResources }),
  S.Struct({ selfManageResources: SelfManageResources }),
  S.Struct({ noPreference: NoManagementPreference }),
);
export interface ApplicationPreferences {
  managementPreference?: ManagementPreference;
}
export const ApplicationPreferences = S.suspend(() =>
  S.Struct({ managementPreference: S.optional(ManagementPreference) }),
).annotations({
  identifier: "ApplicationPreferences",
}) as any as S.Schema<ApplicationPreferences>;
export type HeterogeneousTargetDatabaseEngines = string[];
export const HeterogeneousTargetDatabaseEngines = S.Array(S.String);
export interface Heterogeneous {
  targetDatabaseEngine: string[];
}
export const Heterogeneous = S.suspend(() =>
  S.Struct({ targetDatabaseEngine: HeterogeneousTargetDatabaseEngines }),
).annotations({
  identifier: "Heterogeneous",
}) as any as S.Schema<Heterogeneous>;
export type HomogeneousTargetDatabaseEngines = string[];
export const HomogeneousTargetDatabaseEngines = S.Array(S.String);
export interface Homogeneous {
  targetDatabaseEngine?: string[];
}
export const Homogeneous = S.suspend(() =>
  S.Struct({
    targetDatabaseEngine: S.optional(HomogeneousTargetDatabaseEngines),
  }),
).annotations({ identifier: "Homogeneous" }) as any as S.Schema<Homogeneous>;
export type TargetDatabaseEngines = string[];
export const TargetDatabaseEngines = S.Array(S.String);
export interface NoDatabaseMigrationPreference {
  targetDatabaseEngine: string[];
}
export const NoDatabaseMigrationPreference = S.suspend(() =>
  S.Struct({ targetDatabaseEngine: TargetDatabaseEngines }),
).annotations({
  identifier: "NoDatabaseMigrationPreference",
}) as any as S.Schema<NoDatabaseMigrationPreference>;
export type DatabaseMigrationPreference =
  | { heterogeneous: Heterogeneous; homogeneous?: never; noPreference?: never }
  | { heterogeneous?: never; homogeneous: Homogeneous; noPreference?: never }
  | {
      heterogeneous?: never;
      homogeneous?: never;
      noPreference: NoDatabaseMigrationPreference;
    };
export const DatabaseMigrationPreference = S.Union(
  S.Struct({ heterogeneous: Heterogeneous }),
  S.Struct({ homogeneous: Homogeneous }),
  S.Struct({ noPreference: NoDatabaseMigrationPreference }),
);
export interface DatabasePreferences {
  databaseManagementPreference?: string;
  databaseMigrationPreference?: DatabaseMigrationPreference;
}
export const DatabasePreferences = S.suspend(() =>
  S.Struct({
    databaseManagementPreference: S.optional(S.String),
    databaseMigrationPreference: S.optional(DatabaseMigrationPreference),
  }),
).annotations({
  identifier: "DatabasePreferences",
}) as any as S.Schema<DatabasePreferences>;
export interface PutPortfolioPreferencesRequest {
  prioritizeBusinessGoals?: PrioritizeBusinessGoals;
  applicationPreferences?: ApplicationPreferences;
  databasePreferences?: DatabasePreferences;
  applicationMode?: string;
}
export const PutPortfolioPreferencesRequest = S.suspend(() =>
  S.Struct({
    prioritizeBusinessGoals: S.optional(PrioritizeBusinessGoals),
    applicationPreferences: S.optional(ApplicationPreferences),
    databasePreferences: S.optional(DatabasePreferences),
    applicationMode: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/put-portfolio-preferences" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PutPortfolioPreferencesRequest",
}) as any as S.Schema<PutPortfolioPreferencesRequest>;
export interface PutPortfolioPreferencesResponse {}
export const PutPortfolioPreferencesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutPortfolioPreferencesResponse",
}) as any as S.Schema<PutPortfolioPreferencesResponse>;
export interface StartImportFileTaskRequest {
  name: string;
  S3Bucket: string;
  s3key: string;
  dataSourceType?: string;
  groupId?: Group[];
  s3bucketForReportData?: string;
}
export const StartImportFileTaskRequest = S.suspend(() =>
  S.Struct({
    name: S.String,
    S3Bucket: S.String,
    s3key: S.String,
    dataSourceType: S.optional(S.String),
    groupId: S.optional(GroupIds),
    s3bucketForReportData: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/start-import-file-task" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartImportFileTaskRequest",
}) as any as S.Schema<StartImportFileTaskRequest>;
export interface StartRecommendationReportGenerationRequest {
  outputFormat?: string;
  groupIdFilter?: Group[];
}
export const StartRecommendationReportGenerationRequest = S.suspend(() =>
  S.Struct({
    outputFormat: S.optional(S.String),
    groupIdFilter: S.optional(GroupIds),
  }).pipe(
    T.all(
      T.Http({
        method: "POST",
        uri: "/start-recommendation-report-generation",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartRecommendationReportGenerationRequest",
}) as any as S.Schema<StartRecommendationReportGenerationRequest>;
export interface StopAssessmentRequest {
  assessmentId: string;
}
export const StopAssessmentRequest = S.suspend(() =>
  S.Struct({ assessmentId: S.String }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/stop-assessment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopAssessmentRequest",
}) as any as S.Schema<StopAssessmentRequest>;
export interface StopAssessmentResponse {}
export const StopAssessmentResponse = S.suspend(() => S.Struct({})).annotations(
  { identifier: "StopAssessmentResponse" },
) as any as S.Schema<StopAssessmentResponse>;
export interface StrategyOption {
  strategy?: string;
  toolName?: string;
  targetDestination?: string;
  isPreferred?: boolean;
}
export const StrategyOption = S.suspend(() =>
  S.Struct({
    strategy: S.optional(S.String),
    toolName: S.optional(S.String),
    targetDestination: S.optional(S.String),
    isPreferred: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "StrategyOption",
}) as any as S.Schema<StrategyOption>;
export interface UpdateServerConfigRequest {
  serverId: string;
  strategyOption?: StrategyOption;
}
export const UpdateServerConfigRequest = S.suspend(() =>
  S.Struct({
    serverId: S.String,
    strategyOption: S.optional(StrategyOption),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-server-config/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateServerConfigRequest",
}) as any as S.Schema<UpdateServerConfigRequest>;
export interface UpdateServerConfigResponse {}
export const UpdateServerConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateServerConfigResponse",
}) as any as S.Schema<UpdateServerConfigResponse>;
export type AssessmentTargetValues = string[];
export const AssessmentTargetValues = S.Array(S.String);
export type AssociatedServerIDs = string[];
export const AssociatedServerIDs = S.Array(S.String);
export interface TransformationTool {
  name?: string;
  description?: string;
  tranformationToolInstallationLink?: string;
}
export const TransformationTool = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    description: S.optional(S.String),
    tranformationToolInstallationLink: S.optional(S.String),
  }),
).annotations({
  identifier: "TransformationTool",
}) as any as S.Schema<TransformationTool>;
export interface RecommendationSet {
  transformationTool?: TransformationTool;
  targetDestination?: string;
  strategy?: string;
}
export const RecommendationSet = S.suspend(() =>
  S.Struct({
    transformationTool: S.optional(TransformationTool),
    targetDestination: S.optional(S.String),
    strategy: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommendationSet",
}) as any as S.Schema<RecommendationSet>;
export interface AntipatternSeveritySummary {
  severity?: string;
  count?: number;
}
export const AntipatternSeveritySummary = S.suspend(() =>
  S.Struct({ severity: S.optional(S.String), count: S.optional(S.Number) }),
).annotations({
  identifier: "AntipatternSeveritySummary",
}) as any as S.Schema<AntipatternSeveritySummary>;
export type ListAntipatternSeveritySummary = AntipatternSeveritySummary[];
export const ListAntipatternSeveritySummary = S.Array(
  AntipatternSeveritySummary,
);
export interface OSInfo {
  type?: string;
  version?: string;
}
export const OSInfo = S.suspend(() =>
  S.Struct({ type: S.optional(S.String), version: S.optional(S.String) }),
).annotations({ identifier: "OSInfo" }) as any as S.Schema<OSInfo>;
export interface NetworkInfo {
  interfaceName: string;
  ipAddress: string;
  macAddress: string;
  netMask: string;
}
export const NetworkInfo = S.suspend(() =>
  S.Struct({
    interfaceName: S.String,
    ipAddress: S.String,
    macAddress: S.String,
    netMask: S.String,
  }),
).annotations({ identifier: "NetworkInfo" }) as any as S.Schema<NetworkInfo>;
export type NetworkInfoList = NetworkInfo[];
export const NetworkInfoList = S.Array(NetworkInfo);
export interface SystemInfo {
  osInfo?: OSInfo;
  fileSystemType?: string;
  networkInfoList?: NetworkInfo[];
  cpuArchitecture?: string;
}
export const SystemInfo = S.suspend(() =>
  S.Struct({
    osInfo: S.optional(OSInfo),
    fileSystemType: S.optional(S.String),
    networkInfoList: S.optional(NetworkInfoList),
    cpuArchitecture: S.optional(S.String),
  }),
).annotations({ identifier: "SystemInfo" }) as any as S.Schema<SystemInfo>;
export interface StrategySummary {
  strategy?: string;
  count?: number;
}
export const StrategySummary = S.suspend(() =>
  S.Struct({ strategy: S.optional(S.String), count: S.optional(S.Number) }),
).annotations({
  identifier: "StrategySummary",
}) as any as S.Schema<StrategySummary>;
export type ListStrategySummary = StrategySummary[];
export const ListStrategySummary = S.Array(StrategySummary);
export interface S3Object {
  s3Bucket?: string;
  s3key?: string;
}
export const S3Object = S.suspend(() =>
  S.Struct({ s3Bucket: S.optional(S.String), s3key: S.optional(S.String) }),
).annotations({ identifier: "S3Object" }) as any as S.Schema<S3Object>;
export interface ServerError {
  serverErrorCategory?: string;
}
export const ServerError = S.suspend(() =>
  S.Struct({ serverErrorCategory: S.optional(S.String) }),
).annotations({ identifier: "ServerError" }) as any as S.Schema<ServerError>;
export interface ServerDetail {
  id?: string;
  name?: string;
  recommendationSet?: RecommendationSet;
  dataCollectionStatus?: string;
  statusMessage?: string;
  listAntipatternSeveritySummary?: AntipatternSeveritySummary[];
  systemInfo?: SystemInfo;
  applicationComponentStrategySummary?: StrategySummary[];
  antipatternReportS3Object?: S3Object;
  antipatternReportStatus?: string;
  antipatternReportStatusMessage?: string;
  serverType?: string;
  lastAnalyzedTimestamp?: Date;
  serverError?: ServerError;
}
export const ServerDetail = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "ServerDetail" }) as any as S.Schema<ServerDetail>;
export type ServerDetails = ServerDetail[];
export const ServerDetails = S.Array(ServerDetail);
export interface AssessmentTarget {
  condition: string;
  name: string;
  values: string[];
}
export const AssessmentTarget = S.suspend(() =>
  S.Struct({
    condition: S.String,
    name: S.String,
    values: AssessmentTargetValues,
  }),
).annotations({
  identifier: "AssessmentTarget",
}) as any as S.Schema<AssessmentTarget>;
export type AssessmentTargets = AssessmentTarget[];
export const AssessmentTargets = S.Array(AssessmentTarget);
export interface SourceCode {
  versionControl?: string;
  sourceVersion?: string;
  location?: string;
  projectName?: string;
}
export const SourceCode = S.suspend(() =>
  S.Struct({
    versionControl: S.optional(S.String),
    sourceVersion: S.optional(S.String),
    location: S.optional(S.String),
    projectName: S.optional(S.String),
  }),
).annotations({ identifier: "SourceCode" }) as any as S.Schema<SourceCode>;
export type SourceCodeList = SourceCode[];
export const SourceCodeList = S.Array(SourceCode);
export interface GetImportFileTaskResponse {
  id?: string;
  status?: string;
  startTime?: Date;
  inputS3Bucket?: string;
  inputS3Key?: string;
  statusReportS3Bucket?: string;
  statusReportS3Key?: string;
  completionTime?: Date;
  numberOfRecordsSuccess?: number;
  numberOfRecordsFailed?: number;
  importName?: string;
}
export const GetImportFileTaskResponse = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "GetImportFileTaskResponse",
}) as any as S.Schema<GetImportFileTaskResponse>;
export interface ListApplicationComponentsRequest {
  applicationComponentCriteria?: string;
  filterValue?: string;
  sort?: string;
  groupIdFilter?: Group[];
  nextToken?: string;
  maxResults?: number;
}
export const ListApplicationComponentsRequest = S.suspend(() =>
  S.Struct({
    applicationComponentCriteria: S.optional(S.String),
    filterValue: S.optional(S.String),
    sort: S.optional(S.String),
    groupIdFilter: S.optional(GroupIds),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/list-applicationcomponents" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationComponentsRequest",
}) as any as S.Schema<ListApplicationComponentsRequest>;
export interface ListServersResponse {
  serverInfos?: ServerDetail[];
  nextToken?: string;
}
export const ListServersResponse = S.suspend(() =>
  S.Struct({
    serverInfos: S.optional(ServerDetails),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListServersResponse",
}) as any as S.Schema<ListServersResponse>;
export interface StartAssessmentRequest {
  s3bucketForAnalysisData?: string;
  s3bucketForReportData?: string;
  assessmentTargets?: AssessmentTarget[];
  assessmentDataSourceType?: string;
}
export const StartAssessmentRequest = S.suspend(() =>
  S.Struct({
    s3bucketForAnalysisData: S.optional(S.String),
    s3bucketForReportData: S.optional(S.String),
    assessmentTargets: S.optional(AssessmentTargets),
    assessmentDataSourceType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/start-assessment" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartAssessmentRequest",
}) as any as S.Schema<StartAssessmentRequest>;
export interface StartImportFileTaskResponse {
  id?: string;
}
export const StartImportFileTaskResponse = S.suspend(() =>
  S.Struct({ id: S.optional(S.String) }),
).annotations({
  identifier: "StartImportFileTaskResponse",
}) as any as S.Schema<StartImportFileTaskResponse>;
export interface StartRecommendationReportGenerationResponse {
  id?: string;
}
export const StartRecommendationReportGenerationResponse = S.suspend(() =>
  S.Struct({ id: S.optional(S.String) }),
).annotations({
  identifier: "StartRecommendationReportGenerationResponse",
}) as any as S.Schema<StartRecommendationReportGenerationResponse>;
export interface UpdateApplicationComponentConfigRequest {
  applicationComponentId: string;
  inclusionStatus?: string;
  strategyOption?: StrategyOption;
  sourceCodeList?: SourceCode[];
  secretsManagerKey?: string | redacted.Redacted<string>;
  configureOnly?: boolean;
  appType?: string;
}
export const UpdateApplicationComponentConfigRequest = S.suspend(() =>
  S.Struct({
    applicationComponentId: S.String,
    inclusionStatus: S.optional(S.String),
    strategyOption: S.optional(StrategyOption),
    sourceCodeList: S.optional(SourceCodeList),
    secretsManagerKey: S.optional(SensitiveString),
    configureOnly: S.optional(S.Boolean),
    appType: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/update-applicationcomponent-config/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationComponentConfigRequest",
}) as any as S.Schema<UpdateApplicationComponentConfigRequest>;
export interface UpdateApplicationComponentConfigResponse {}
export const UpdateApplicationComponentConfigResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateApplicationComponentConfigResponse",
}) as any as S.Schema<UpdateApplicationComponentConfigResponse>;
export interface ApplicationComponentSummary {
  appType?: string;
  count?: number;
}
export const ApplicationComponentSummary = S.suspend(() =>
  S.Struct({ appType: S.optional(S.String), count: S.optional(S.Number) }),
).annotations({
  identifier: "ApplicationComponentSummary",
}) as any as S.Schema<ApplicationComponentSummary>;
export type ListApplicationComponentSummary = ApplicationComponentSummary[];
export const ListApplicationComponentSummary = S.Array(
  ApplicationComponentSummary,
);
export interface ServerSummary {
  ServerOsType?: string;
  count?: number;
}
export const ServerSummary = S.suspend(() =>
  S.Struct({ ServerOsType: S.optional(S.String), count: S.optional(S.Number) }),
).annotations({
  identifier: "ServerSummary",
}) as any as S.Schema<ServerSummary>;
export type ListServerSummary = ServerSummary[];
export const ListServerSummary = S.Array(ServerSummary);
export interface ApplicationComponentStatusSummary {
  srcCodeOrDbAnalysisStatus?: string;
  count?: number;
}
export const ApplicationComponentStatusSummary = S.suspend(() =>
  S.Struct({
    srcCodeOrDbAnalysisStatus: S.optional(S.String),
    count: S.optional(S.Number),
  }),
).annotations({
  identifier: "ApplicationComponentStatusSummary",
}) as any as S.Schema<ApplicationComponentStatusSummary>;
export type ListApplicationComponentStatusSummary =
  ApplicationComponentStatusSummary[];
export const ListApplicationComponentStatusSummary = S.Array(
  ApplicationComponentStatusSummary,
);
export interface ServerStatusSummary {
  runTimeAssessmentStatus?: string;
  count?: number;
}
export const ServerStatusSummary = S.suspend(() =>
  S.Struct({
    runTimeAssessmentStatus: S.optional(S.String),
    count: S.optional(S.Number),
  }),
).annotations({
  identifier: "ServerStatusSummary",
}) as any as S.Schema<ServerStatusSummary>;
export type ListServerStatusSummary = ServerStatusSummary[];
export const ListServerStatusSummary = S.Array(ServerStatusSummary);
export type S3Keys = string[];
export const S3Keys = S.Array(S.String);
export interface AssociatedApplication {
  name?: string;
  id?: string;
}
export const AssociatedApplication = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), id: S.optional(S.String) }),
).annotations({
  identifier: "AssociatedApplication",
}) as any as S.Schema<AssociatedApplication>;
export type AssociatedApplications = AssociatedApplication[];
export const AssociatedApplications = S.Array(AssociatedApplication);
export interface ApplicationComponentStrategy {
  recommendation?: RecommendationSet;
  status?: string;
  isPreferred?: boolean;
}
export const ApplicationComponentStrategy = S.suspend(() =>
  S.Struct({
    recommendation: S.optional(RecommendationSet),
    status: S.optional(S.String),
    isPreferred: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ApplicationComponentStrategy",
}) as any as S.Schema<ApplicationComponentStrategy>;
export type ApplicationComponentStrategies = ApplicationComponentStrategy[];
export const ApplicationComponentStrategies = S.Array(
  ApplicationComponentStrategy,
);
export interface DataCollectionDetails {
  status?: string;
  servers?: number;
  failed?: number;
  success?: number;
  inProgress?: number;
  startTime?: Date;
  completionTime?: Date;
  statusMessage?: string;
}
export const DataCollectionDetails = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    servers: S.optional(S.Number),
    failed: S.optional(S.Number),
    success: S.optional(S.Number),
    inProgress: S.optional(S.Number),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    completionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    statusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "DataCollectionDetails",
}) as any as S.Schema<DataCollectionDetails>;
export interface AssessmentSummary {
  listServerStrategySummary?: StrategySummary[];
  listApplicationComponentStrategySummary?: StrategySummary[];
  listAntipatternSeveritySummary?: AntipatternSeveritySummary[];
  listApplicationComponentSummary?: ApplicationComponentSummary[];
  listServerSummary?: ServerSummary[];
  antipatternReportS3Object?: S3Object;
  antipatternReportStatus?: string;
  antipatternReportStatusMessage?: string;
  lastAnalyzedTimestamp?: Date;
  listApplicationComponentStatusSummary?: ApplicationComponentStatusSummary[];
  listServerStatusSummary?: ServerStatusSummary[];
}
export const AssessmentSummary = S.suspend(() =>
  S.Struct({
    listServerStrategySummary: S.optional(ListStrategySummary),
    listApplicationComponentStrategySummary: S.optional(ListStrategySummary),
    listAntipatternSeveritySummary: S.optional(ListAntipatternSeveritySummary),
    listApplicationComponentSummary: S.optional(
      ListApplicationComponentSummary,
    ),
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
  }),
).annotations({
  identifier: "AssessmentSummary",
}) as any as S.Schema<AssessmentSummary>;
export interface RecommendationReportDetails {
  status?: string;
  statusMessage?: string;
  startTime?: Date;
  completionTime?: Date;
  s3Bucket?: string;
  s3Keys?: string[];
}
export const RecommendationReportDetails = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    statusMessage: S.optional(S.String),
    startTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    completionTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    s3Bucket: S.optional(S.String),
    s3Keys: S.optional(S3Keys),
  }),
).annotations({
  identifier: "RecommendationReportDetails",
}) as any as S.Schema<RecommendationReportDetails>;
export interface ServerStrategy {
  recommendation?: RecommendationSet;
  status?: string;
  numberOfApplicationComponents?: number;
  isPreferred?: boolean;
}
export const ServerStrategy = S.suspend(() =>
  S.Struct({
    recommendation: S.optional(RecommendationSet),
    status: S.optional(S.String),
    numberOfApplicationComponents: S.optional(S.Number),
    isPreferred: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "ServerStrategy",
}) as any as S.Schema<ServerStrategy>;
export type ServerStrategies = ServerStrategy[];
export const ServerStrategies = S.Array(ServerStrategy);
export interface AnalyzableServerSummary {
  hostname?: string;
  ipAddress?: string;
  source?: string;
  vmId?: string;
}
export const AnalyzableServerSummary = S.suspend(() =>
  S.Struct({
    hostname: S.optional(S.String),
    ipAddress: S.optional(S.String),
    source: S.optional(S.String),
    vmId: S.optional(S.String),
  }),
).annotations({
  identifier: "AnalyzableServerSummary",
}) as any as S.Schema<AnalyzableServerSummary>;
export type AnalyzableServerSummaryList = AnalyzableServerSummary[];
export const AnalyzableServerSummaryList = S.Array(AnalyzableServerSummary);
export interface DatabaseConfigDetail {
  secretName?: string;
}
export const DatabaseConfigDetail = S.suspend(() =>
  S.Struct({ secretName: S.optional(S.String) }),
).annotations({
  identifier: "DatabaseConfigDetail",
}) as any as S.Schema<DatabaseConfigDetail>;
export interface SourceCodeRepository {
  repository?: string;
  branch?: string;
  versionControlType?: string;
  projectName?: string;
}
export const SourceCodeRepository = S.suspend(() =>
  S.Struct({
    repository: S.optional(S.String),
    branch: S.optional(S.String),
    versionControlType: S.optional(S.String),
    projectName: S.optional(S.String),
  }),
).annotations({
  identifier: "SourceCodeRepository",
}) as any as S.Schema<SourceCodeRepository>;
export type SourceCodeRepositories = SourceCodeRepository[];
export const SourceCodeRepositories = S.Array(SourceCodeRepository);
export interface AppUnitError {
  appUnitErrorCategory?: string;
}
export const AppUnitError = S.suspend(() =>
  S.Struct({ appUnitErrorCategory: S.optional(S.String) }),
).annotations({ identifier: "AppUnitError" }) as any as S.Schema<AppUnitError>;
export type AnalysisStatusUnion =
  | { runtimeAnalysisStatus: string; srcCodeOrDbAnalysisStatus?: never }
  | { runtimeAnalysisStatus?: never; srcCodeOrDbAnalysisStatus: string };
export const AnalysisStatusUnion = S.Union(
  S.Struct({ runtimeAnalysisStatus: S.String }),
  S.Struct({ srcCodeOrDbAnalysisStatus: S.String }),
);
export type AnalyzerNameUnion =
  | {
      binaryAnalyzerName: string;
      runTimeAnalyzerName?: never;
      sourceCodeAnalyzerName?: never;
    }
  | {
      binaryAnalyzerName?: never;
      runTimeAnalyzerName: string;
      sourceCodeAnalyzerName?: never;
    }
  | {
      binaryAnalyzerName?: never;
      runTimeAnalyzerName?: never;
      sourceCodeAnalyzerName: string;
    };
export const AnalyzerNameUnion = S.Union(
  S.Struct({ binaryAnalyzerName: S.String }),
  S.Struct({ runTimeAnalyzerName: S.String }),
  S.Struct({ sourceCodeAnalyzerName: S.String }),
);
export interface AntipatternReportResult {
  analyzerName?: AnalyzerNameUnion;
  antiPatternReportS3Object?: S3Object;
  antipatternReportStatus?: string;
  antipatternReportStatusMessage?: string;
}
export const AntipatternReportResult = S.suspend(() =>
  S.Struct({
    analyzerName: S.optional(AnalyzerNameUnion),
    antiPatternReportS3Object: S.optional(S3Object),
    antipatternReportStatus: S.optional(S.String),
    antipatternReportStatusMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "AntipatternReportResult",
}) as any as S.Schema<AntipatternReportResult>;
export type AntipatternReportResultList = AntipatternReportResult[];
export const AntipatternReportResultList = S.Array(AntipatternReportResult);
export interface Result {
  analysisType?: string;
  analysisStatus?: AnalysisStatusUnion;
  statusMessage?: string;
  antipatternReportResultList?: AntipatternReportResult[];
}
export const Result = S.suspend(() =>
  S.Struct({
    analysisType: S.optional(S.String),
    analysisStatus: S.optional(AnalysisStatusUnion),
    statusMessage: S.optional(S.String),
    antipatternReportResultList: S.optional(AntipatternReportResultList),
  }),
).annotations({ identifier: "Result" }) as any as S.Schema<Result>;
export type ResultList = Result[];
export const ResultList = S.Array(Result);
export interface ApplicationComponentDetail {
  id?: string;
  name?: string;
  recommendationSet?: RecommendationSet;
  analysisStatus?: string;
  statusMessage?: string;
  listAntipatternSeveritySummary?: AntipatternSeveritySummary[];
  databaseConfigDetail?: DatabaseConfigDetail;
  sourceCodeRepositories?: SourceCodeRepository[];
  appType?: string;
  resourceSubType?: string;
  inclusionStatus?: string;
  antipatternReportS3Object?: S3Object;
  antipatternReportStatus?: string;
  antipatternReportStatusMessage?: string;
  osVersion?: string;
  osDriver?: string;
  lastAnalyzedTimestamp?: Date;
  associatedServerId?: string;
  moreServerAssociationExists?: boolean;
  runtimeStatus?: string;
  runtimeStatusMessage?: string;
  appUnitError?: AppUnitError;
  resultList?: Result[];
}
export const ApplicationComponentDetail = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ApplicationComponentDetail",
}) as any as S.Schema<ApplicationComponentDetail>;
export type ApplicationComponentDetails = ApplicationComponentDetail[];
export const ApplicationComponentDetails = S.Array(ApplicationComponentDetail);
export interface ImportFileTaskInformation {
  id?: string;
  status?: string;
  startTime?: Date;
  inputS3Bucket?: string;
  inputS3Key?: string;
  statusReportS3Bucket?: string;
  statusReportS3Key?: string;
  completionTime?: Date;
  numberOfRecordsSuccess?: number;
  numberOfRecordsFailed?: number;
  importName?: string;
}
export const ImportFileTaskInformation = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ImportFileTaskInformation",
}) as any as S.Schema<ImportFileTaskInformation>;
export type ListImportFileTaskInformation = ImportFileTaskInformation[];
export const ListImportFileTaskInformation = S.Array(ImportFileTaskInformation);
export interface GetApplicationComponentStrategiesResponse {
  applicationComponentStrategies?: ApplicationComponentStrategy[];
}
export const GetApplicationComponentStrategiesResponse = S.suspend(() =>
  S.Struct({
    applicationComponentStrategies: S.optional(ApplicationComponentStrategies),
  }),
).annotations({
  identifier: "GetApplicationComponentStrategiesResponse",
}) as any as S.Schema<GetApplicationComponentStrategiesResponse>;
export interface GetAssessmentResponse {
  id?: string;
  dataCollectionDetails?: DataCollectionDetails;
  assessmentTargets?: AssessmentTarget[];
}
export const GetAssessmentResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    dataCollectionDetails: S.optional(DataCollectionDetails),
    assessmentTargets: S.optional(AssessmentTargets),
  }),
).annotations({
  identifier: "GetAssessmentResponse",
}) as any as S.Schema<GetAssessmentResponse>;
export interface GetPortfolioSummaryResponse {
  assessmentSummary?: AssessmentSummary;
}
export const GetPortfolioSummaryResponse = S.suspend(() =>
  S.Struct({ assessmentSummary: S.optional(AssessmentSummary) }),
).annotations({
  identifier: "GetPortfolioSummaryResponse",
}) as any as S.Schema<GetPortfolioSummaryResponse>;
export interface GetRecommendationReportDetailsResponse {
  id?: string;
  recommendationReportDetails?: RecommendationReportDetails;
}
export const GetRecommendationReportDetailsResponse = S.suspend(() =>
  S.Struct({
    id: S.optional(S.String),
    recommendationReportDetails: S.optional(RecommendationReportDetails),
  }),
).annotations({
  identifier: "GetRecommendationReportDetailsResponse",
}) as any as S.Schema<GetRecommendationReportDetailsResponse>;
export interface GetServerStrategiesResponse {
  serverStrategies?: ServerStrategy[];
}
export const GetServerStrategiesResponse = S.suspend(() =>
  S.Struct({ serverStrategies: S.optional(ServerStrategies) }),
).annotations({
  identifier: "GetServerStrategiesResponse",
}) as any as S.Schema<GetServerStrategiesResponse>;
export interface ListAnalyzableServersResponse {
  analyzableServers?: AnalyzableServerSummary[];
  nextToken?: string;
}
export const ListAnalyzableServersResponse = S.suspend(() =>
  S.Struct({
    analyzableServers: S.optional(AnalyzableServerSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListAnalyzableServersResponse",
}) as any as S.Schema<ListAnalyzableServersResponse>;
export interface ListApplicationComponentsResponse {
  applicationComponentInfos?: ApplicationComponentDetail[];
  nextToken?: string;
}
export const ListApplicationComponentsResponse = S.suspend(() =>
  S.Struct({
    applicationComponentInfos: S.optional(ApplicationComponentDetails),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListApplicationComponentsResponse",
}) as any as S.Schema<ListApplicationComponentsResponse>;
export interface ListImportFileTaskResponse {
  taskInfos?: ImportFileTaskInformation[];
  nextToken?: string;
}
export const ListImportFileTaskResponse = S.suspend(() =>
  S.Struct({
    taskInfos: S.optional(ListImportFileTaskInformation),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListImportFileTaskResponse",
}) as any as S.Schema<ListImportFileTaskResponse>;
export interface StartAssessmentResponse {
  assessmentId?: string;
}
export const StartAssessmentResponse = S.suspend(() =>
  S.Struct({ assessmentId: S.optional(S.String) }),
).annotations({
  identifier: "StartAssessmentResponse",
}) as any as S.Schema<StartAssessmentResponse>;
export interface VcenterBasedRemoteInfo {
  vcenterConfigurationTimeStamp?: string;
  osType?: string;
}
export const VcenterBasedRemoteInfo = S.suspend(() =>
  S.Struct({
    vcenterConfigurationTimeStamp: S.optional(S.String),
    osType: S.optional(S.String),
  }),
).annotations({
  identifier: "VcenterBasedRemoteInfo",
}) as any as S.Schema<VcenterBasedRemoteInfo>;
export type VcenterBasedRemoteInfoList = VcenterBasedRemoteInfo[];
export const VcenterBasedRemoteInfoList = S.Array(VcenterBasedRemoteInfo);
export interface IPAddressBasedRemoteInfo {
  ipAddressConfigurationTimeStamp?: string;
  authType?: string;
  osType?: string;
}
export const IPAddressBasedRemoteInfo = S.suspend(() =>
  S.Struct({
    ipAddressConfigurationTimeStamp: S.optional(S.String),
    authType: S.optional(S.String),
    osType: S.optional(S.String),
  }),
).annotations({
  identifier: "IPAddressBasedRemoteInfo",
}) as any as S.Schema<IPAddressBasedRemoteInfo>;
export type IPAddressBasedRemoteInfoList = IPAddressBasedRemoteInfo[];
export const IPAddressBasedRemoteInfoList = S.Array(IPAddressBasedRemoteInfo);
export interface VersionControlInfo {
  versionControlType?: string;
  versionControlConfigurationTimeStamp?: string;
}
export const VersionControlInfo = S.suspend(() =>
  S.Struct({
    versionControlType: S.optional(S.String),
    versionControlConfigurationTimeStamp: S.optional(S.String),
  }),
).annotations({
  identifier: "VersionControlInfo",
}) as any as S.Schema<VersionControlInfo>;
export type VersionControlInfoList = VersionControlInfo[];
export const VersionControlInfoList = S.Array(VersionControlInfo);
export interface PipelineInfo {
  pipelineType?: string;
  pipelineConfigurationTimeStamp?: string;
}
export const PipelineInfo = S.suspend(() =>
  S.Struct({
    pipelineType: S.optional(S.String),
    pipelineConfigurationTimeStamp: S.optional(S.String),
  }),
).annotations({ identifier: "PipelineInfo" }) as any as S.Schema<PipelineInfo>;
export type PipelineInfoList = PipelineInfo[];
export const PipelineInfoList = S.Array(PipelineInfo);
export interface RemoteSourceCodeAnalysisServerInfo {
  remoteSourceCodeAnalysisServerConfigurationTimestamp?: string;
}
export const RemoteSourceCodeAnalysisServerInfo = S.suspend(() =>
  S.Struct({
    remoteSourceCodeAnalysisServerConfigurationTimestamp: S.optional(S.String),
  }),
).annotations({
  identifier: "RemoteSourceCodeAnalysisServerInfo",
}) as any as S.Schema<RemoteSourceCodeAnalysisServerInfo>;
export interface GetPortfolioPreferencesResponse {
  prioritizeBusinessGoals?: PrioritizeBusinessGoals;
  applicationPreferences?: ApplicationPreferences;
  databasePreferences?: DatabasePreferences;
  applicationMode?: string;
}
export const GetPortfolioPreferencesResponse = S.suspend(() =>
  S.Struct({
    prioritizeBusinessGoals: S.optional(PrioritizeBusinessGoals),
    applicationPreferences: S.optional(ApplicationPreferences),
    databasePreferences: S.optional(DatabasePreferences),
    applicationMode: S.optional(S.String),
  }),
).annotations({
  identifier: "GetPortfolioPreferencesResponse",
}) as any as S.Schema<GetPortfolioPreferencesResponse>;
export interface ConfigurationSummary {
  vcenterBasedRemoteInfoList?: VcenterBasedRemoteInfo[];
  ipAddressBasedRemoteInfoList?: IPAddressBasedRemoteInfo[];
  versionControlInfoList?: VersionControlInfo[];
  pipelineInfoList?: PipelineInfo[];
  remoteSourceCodeAnalysisServerInfo?: RemoteSourceCodeAnalysisServerInfo;
}
export const ConfigurationSummary = S.suspend(() =>
  S.Struct({
    vcenterBasedRemoteInfoList: S.optional(VcenterBasedRemoteInfoList),
    ipAddressBasedRemoteInfoList: S.optional(IPAddressBasedRemoteInfoList),
    versionControlInfoList: S.optional(VersionControlInfoList),
    pipelineInfoList: S.optional(PipelineInfoList),
    remoteSourceCodeAnalysisServerInfo: S.optional(
      RemoteSourceCodeAnalysisServerInfo,
    ),
  }),
).annotations({
  identifier: "ConfigurationSummary",
}) as any as S.Schema<ConfigurationSummary>;
export interface Collector {
  collectorId?: string;
  ipAddress?: string;
  hostName?: string;
  collectorHealth?: string;
  collectorVersion?: string;
  registeredTimeStamp?: string;
  lastActivityTimeStamp?: string;
  configurationSummary?: ConfigurationSummary;
}
export const Collector = S.suspend(() =>
  S.Struct({
    collectorId: S.optional(S.String),
    ipAddress: S.optional(S.String),
    hostName: S.optional(S.String),
    collectorHealth: S.optional(S.String),
    collectorVersion: S.optional(S.String),
    registeredTimeStamp: S.optional(S.String),
    lastActivityTimeStamp: S.optional(S.String),
    configurationSummary: S.optional(ConfigurationSummary),
  }),
).annotations({ identifier: "Collector" }) as any as S.Schema<Collector>;
export type Collectors = Collector[];
export const Collectors = S.Array(Collector);
export interface GetServerDetailsResponse {
  nextToken?: string;
  serverDetail?: ServerDetail;
  associatedApplications?: AssociatedApplication[];
}
export const GetServerDetailsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    serverDetail: S.optional(ServerDetail),
    associatedApplications: S.optional(AssociatedApplications),
  }),
).annotations({
  identifier: "GetServerDetailsResponse",
}) as any as S.Schema<GetServerDetailsResponse>;
export interface ListCollectorsResponse {
  Collectors?: Collector[];
  nextToken?: string;
}
export const ListCollectorsResponse = S.suspend(() =>
  S.Struct({
    Collectors: S.optional(Collectors),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListCollectorsResponse",
}) as any as S.Schema<ListCollectorsResponse>;
export interface GetApplicationComponentDetailsResponse {
  applicationComponentDetail?: ApplicationComponentDetail;
  associatedApplications?: AssociatedApplication[];
  moreApplicationResource?: boolean;
  associatedServerIds?: string[];
}
export const GetApplicationComponentDetailsResponse = S.suspend(() =>
  S.Struct({
    applicationComponentDetail: S.optional(ApplicationComponentDetail),
    associatedApplications: S.optional(AssociatedApplications),
    moreApplicationResource: S.optional(S.Boolean),
    associatedServerIds: S.optional(AssociatedServerIDs),
  }),
).annotations({
  identifier: "GetApplicationComponentDetailsResponse",
}) as any as S.Schema<GetApplicationComponentDetailsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class DependencyException extends S.TaggedError<DependencyException>()(
  "DependencyException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceLinkedRoleLockClientException extends S.TaggedError<ServiceLinkedRoleLockClientException>()(
  "ServiceLinkedRoleLockClientException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Retrieves a list of all the recommended strategies and tools for an application component
 * running on a server.
 */
export const getApplicationComponentStrategies: (
  input: GetApplicationComponentStrategiesRequest,
) => effect.Effect<
  GetApplicationComponentStrategiesResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getAssessment: (
  input: GetAssessmentRequest,
) => effect.Effect<
  GetAssessmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves overall summary including the number of servers to rehost and the overall
 * number of anti-patterns.
 */
export const getPortfolioSummary: (
  input: GetPortfolioSummaryRequest,
) => effect.Effect<
  GetPortfolioSummaryResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPortfolioSummaryRequest,
  output: GetPortfolioSummaryResponse,
  errors: [AccessDeniedException, InternalServerException, ThrottlingException],
}));
/**
 * Starts the assessment of an on-premises environment.
 */
export const startAssessment: (
  input: StartAssessmentRequest,
) => effect.Effect<
  StartAssessmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieve the latest ID of a specific assessment task.
 */
export const getLatestAssessmentId: (
  input: GetLatestAssessmentIdRequest,
) => effect.Effect<
  GetLatestAssessmentIdResponse,
  | AccessDeniedException
  | DependencyException
  | InternalServerException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLatestAssessmentIdRequest,
  output: GetLatestAssessmentIdResponse,
  errors: [
    AccessDeniedException,
    DependencyException,
    InternalServerException,
    ValidationException,
  ],
}));
/**
 * Retrieves your migration and modernization preferences.
 */
export const getPortfolioPreferences: (
  input: GetPortfolioPreferencesRequest,
) => effect.Effect<
  GetPortfolioPreferencesResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetPortfolioPreferencesRequest,
  output: GetPortfolioPreferencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
/**
 * Retrieves a list of all the application components (processes).
 */
export const listApplicationComponents: {
  (
    input: ListApplicationComponentsRequest,
  ): effect.Effect<
    ListApplicationComponentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceLinkedRoleLockClientException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationComponentsRequest,
  ) => stream.Stream<
    ListApplicationComponentsResponse,
    | AccessDeniedException
    | InternalServerException
    | ServiceLinkedRoleLockClientException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationComponentsRequest,
  ) => stream.Stream<
    ApplicationComponentDetail,
    | AccessDeniedException
    | InternalServerException
    | ServiceLinkedRoleLockClientException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationComponentsRequest,
  output: ListApplicationComponentsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ServiceLinkedRoleLockClientException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "applicationComponentInfos",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Stops the assessment of an on-premises environment.
 */
export const stopAssessment: (
  input: StopAssessmentRequest,
) => effect.Effect<
  StopAssessmentResponse,
  | AccessDeniedException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Saves the specified migration and modernization preferences.
 */
export const putPortfolioPreferences: (
  input: PutPortfolioPreferencesRequest,
) => effect.Effect<
  PutPortfolioPreferencesResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutPortfolioPreferencesRequest,
  output: PutPortfolioPreferencesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Starts a file import.
 */
export const startImportFileTask: (
  input: StartImportFileTaskRequest,
) => effect.Effect<
  StartImportFileTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves the details about a specific import task.
 */
export const getImportFileTask: (
  input: GetImportFileTaskRequest,
) => effect.Effect<
  GetImportFileTaskResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the configuration of an application component.
 */
export const updateApplicationComponentConfig: (
  input: UpdateApplicationComponentConfigRequest,
) => effect.Effect<
  UpdateApplicationComponentConfigResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves detailed information about the specified recommendation report.
 */
export const getRecommendationReportDetails: (
  input: GetRecommendationReportDetailsRequest,
) => effect.Effect<
  GetRecommendationReportDetailsResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getServerStrategies: (
  input: GetServerStrategiesRequest,
) => effect.Effect<
  GetServerStrategiesResponse,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a list of all the servers.
 */
export const listServers: {
  (
    input: ListServersRequest,
  ): effect.Effect<
    ListServersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListServersRequest,
  ) => stream.Stream<
    ListServersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListServersRequest,
  ) => stream.Stream<
    ServerDetail,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListServersRequest,
  output: ListServersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "serverInfos",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of all the servers fetched from customer vCenter using Strategy Recommendation Collector.
 */
export const listAnalyzableServers: {
  (
    input: ListAnalyzableServersRequest,
  ): effect.Effect<
    ListAnalyzableServersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListAnalyzableServersRequest,
  ) => stream.Stream<
    ListAnalyzableServersResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListAnalyzableServersRequest,
  ) => stream.Stream<
    AnalyzableServerSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListAnalyzableServersRequest,
  output: ListAnalyzableServersResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "analyzableServers",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of all the imports performed.
 */
export const listImportFileTask: {
  (
    input: ListImportFileTaskRequest,
  ): effect.Effect<
    ListImportFileTaskResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListImportFileTaskRequest,
  ) => stream.Stream<
    ListImportFileTaskResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListImportFileTaskRequest,
  ) => stream.Stream<
    ImportFileTaskInformation,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListImportFileTaskRequest,
  output: ListImportFileTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "taskInfos",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Starts generating a recommendation report.
 */
export const startRecommendationReportGeneration: (
  input: StartRecommendationReportGenerationRequest,
) => effect.Effect<
  StartRecommendationReportGenerationResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Updates the configuration of the specified server.
 */
export const updateServerConfig: (
  input: UpdateServerConfigRequest,
) => effect.Effect<
  UpdateServerConfigResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Retrieves detailed information about a specified server.
 */
export const getServerDetails: {
  (
    input: GetServerDetailsRequest,
  ): effect.Effect<
    GetServerDetailsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetServerDetailsRequest,
  ) => stream.Stream<
    GetServerDetailsResponse,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetServerDetailsRequest,
  ) => stream.Stream<
    AssociatedApplication,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetServerDetailsRequest,
  output: GetServerDetailsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "associatedApplications",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves a list of all the installed collectors.
 */
export const listCollectors: {
  (
    input: ListCollectorsRequest,
  ): effect.Effect<
    ListCollectorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListCollectorsRequest,
  ) => stream.Stream<
    ListCollectorsResponse,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListCollectorsRequest,
  ) => stream.Stream<
    Collector,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListCollectorsRequest,
  output: ListCollectorsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "Collectors",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves details about an application component.
 */
export const getApplicationComponentDetails: (
  input: GetApplicationComponentDetailsRequest,
) => effect.Effect<
  GetApplicationComponentDetailsResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationComponentDetailsRequest,
  output: GetApplicationComponentDetailsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
  ],
}));
