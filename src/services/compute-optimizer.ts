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
  sdkId: "Compute Optimizer",
  serviceShapeName: "ComputeOptimizerService",
});
const auth = T.AwsAuthSigv4({ name: "compute-optimizer" });
const ver = T.ServiceVersion("2019-11-01");
const proto = T.AwsProtocolsAwsJson1_0();
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
              `https://compute-optimizer-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://compute-optimizer-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://compute-optimizer.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://compute-optimizer.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type JobId = string;
export type NextToken = string;
export type MaxResults = number;
export type AccountId = string;
export type AutoScalingGroupArn = string;
export type VolumeArn = string;
export type InstanceArn = string;
export type Period = number;
export type ServiceArn = string;
export type ResourceArn = string;
export type StatusReason = string;
export type NumberOfMemberAccountsOptedIn = number;
export type IdleMaxResults = number;
export type FunctionArn = string;
export type ScopeValue = string;
export type FilterValue = string;
export type DestinationBucket = string;
export type DestinationKeyPrefix = string;
export type PreferredResourceValue = string;
export type ErrorMessage = string;
export type DestinationKey = string;
export type MetadataKey = string;
export type AutoScalingGroupName = string;
export type LookBackPeriodInDays = number;
export type Identifier = string;
export type Code = string;
export type Message = string;
export type InstanceName = string;
export type CurrentInstanceType = string;
export type RecommendedInstanceType = string;
export type Rank = number;
export type CpuSize = number;
export type MemorySize = number;
export type FunctionVersion = string;
export type NumberOfInvocations = number;
export type RecommendedDBInstanceClass = string;
export type Engine = string;
export type EngineVersion = string;
export type PromotionTier = number;
export type CurrentDBInstanceClass = string;
export type DBClusterIdentifier = string;
export type MetricValue = number;
export type DesiredCapacity = number;
export type MinSize = number;
export type MaxSize = number;
export type NullableInstanceType = string;
export type NullableEstimatedInstanceHourReductionPercentage = number;
export type MixedInstanceType = string;
export type PerformanceRisk = number;
export type VolumeType = string;
export type VolumeSize = number;
export type VolumeBaselineIOPS = number;
export type VolumeBurstIOPS = number;
export type VolumeBaselineThroughput = number;
export type VolumeBurstThroughput = number;
export type TagKey = string;
export type TagValue = string;
export type InstanceType = string;
export type RecommendationSourceArn = string;
export type ExternalMetricStatusReason = string;
export type NullableMemory = number;
export type NullableCpu = number;
export type TaskDefinitionArn = string;
export type NumberOfCores = number;
export type OperatingSystem = string;
export type LicenseVersion = string;
export type StorageType = string;
export type AllocatedStorage = number;
export type NullableIOPS = number;
export type NullableMaxAllocatedStorage = number;
export type NullableStorageThroughput = number;
export type DBInstanceClass = string;
export type SummaryValue = number;
export type SavingsOpportunityPercentage = number;
export type High = number;
export type Medium = number;
export type Low = number;
export type VeryLow = number;
export type FailureReason = string;
export type ResourceId = string;
export type IdleFindingDescription = string;
export type GpuCount = number;
export type GpuMemorySizeInMiB = number;
export type ContainerName = string;
export type LowerBoundValue = number;
export type UpperBoundValue = number;
export type MetricProviderArn = string;
export type Value = number;
export type NullableMemoryReservation = number;

//# Schemas
export interface GetEnrollmentStatusRequest {}
export const GetEnrollmentStatusRequest = S.suspend(() =>
  S.Struct({}).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEnrollmentStatusRequest",
}) as any as S.Schema<GetEnrollmentStatusRequest>;
export type RecommendationPreferenceNames = string[];
export const RecommendationPreferenceNames = S.Array(S.String);
export type JobIds = string[];
export const JobIds = S.Array(S.String);
export type AccountIds = string[];
export const AccountIds = S.Array(S.String);
export type ExportableAutoScalingGroupFields = string[];
export const ExportableAutoScalingGroupFields = S.Array(S.String);
export type ExportableVolumeFields = string[];
export const ExportableVolumeFields = S.Array(S.String);
export type ExportableInstanceFields = string[];
export const ExportableInstanceFields = S.Array(S.String);
export type ExportableECSServiceFields = string[];
export const ExportableECSServiceFields = S.Array(S.String);
export type ExportableIdleFields = string[];
export const ExportableIdleFields = S.Array(S.String);
export type ExportableLambdaFunctionFields = string[];
export const ExportableLambdaFunctionFields = S.Array(S.String);
export type ExportableLicenseFields = string[];
export const ExportableLicenseFields = S.Array(S.String);
export type ExportableRDSDBFields = string[];
export const ExportableRDSDBFields = S.Array(S.String);
export type AutoScalingGroupArns = string[];
export const AutoScalingGroupArns = S.Array(S.String);
export type VolumeArns = string[];
export const VolumeArns = S.Array(S.String);
export type InstanceArns = string[];
export const InstanceArns = S.Array(S.String);
export type ServiceArns = string[];
export const ServiceArns = S.Array(S.String);
export type ResourceArns = string[];
export const ResourceArns = S.Array(S.String);
export type FunctionArns = string[];
export const FunctionArns = S.Array(S.String);
export type FilterValues = string[];
export const FilterValues = S.Array(S.String);
export interface Filter {
  name?: string;
  values?: FilterValues;
}
export const Filter = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), values: S.optional(FilterValues) }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type Filters = Filter[];
export const Filters = S.Array(Filter);
export interface S3DestinationConfig {
  bucket?: string;
  keyPrefix?: string;
}
export const S3DestinationConfig = S.suspend(() =>
  S.Struct({ bucket: S.optional(S.String), keyPrefix: S.optional(S.String) }),
).annotations({
  identifier: "S3DestinationConfig",
}) as any as S.Schema<S3DestinationConfig>;
export type CpuVendorArchitectures = string[];
export const CpuVendorArchitectures = S.Array(S.String);
export interface RecommendationPreferences {
  cpuVendorArchitectures?: CpuVendorArchitectures;
}
export const RecommendationPreferences = S.suspend(() =>
  S.Struct({ cpuVendorArchitectures: S.optional(CpuVendorArchitectures) }),
).annotations({
  identifier: "RecommendationPreferences",
}) as any as S.Schema<RecommendationPreferences>;
export interface ExportEC2InstanceRecommendationsRequest {
  accountIds?: AccountIds;
  filters?: Filters;
  fieldsToExport?: ExportableInstanceFields;
  s3DestinationConfig: S3DestinationConfig;
  fileFormat?: string;
  includeMemberAccounts?: boolean;
  recommendationPreferences?: RecommendationPreferences;
}
export const ExportEC2InstanceRecommendationsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIds),
    filters: S.optional(Filters),
    fieldsToExport: S.optional(ExportableInstanceFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
    recommendationPreferences: S.optional(RecommendationPreferences),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExportEC2InstanceRecommendationsRequest",
}) as any as S.Schema<ExportEC2InstanceRecommendationsRequest>;
export interface GetAutoScalingGroupRecommendationsRequest {
  accountIds?: AccountIds;
  autoScalingGroupArns?: AutoScalingGroupArns;
  nextToken?: string;
  maxResults?: number;
  filters?: Filters;
  recommendationPreferences?: RecommendationPreferences;
}
export const GetAutoScalingGroupRecommendationsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIds),
    autoScalingGroupArns: S.optional(AutoScalingGroupArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(Filters),
    recommendationPreferences: S.optional(RecommendationPreferences),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetAutoScalingGroupRecommendationsRequest",
}) as any as S.Schema<GetAutoScalingGroupRecommendationsRequest>;
export interface EBSFilter {
  name?: string;
  values?: FilterValues;
}
export const EBSFilter = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), values: S.optional(FilterValues) }),
).annotations({ identifier: "EBSFilter" }) as any as S.Schema<EBSFilter>;
export type EBSFilters = EBSFilter[];
export const EBSFilters = S.Array(EBSFilter);
export interface GetEBSVolumeRecommendationsRequest {
  volumeArns?: VolumeArns;
  nextToken?: string;
  maxResults?: number;
  filters?: EBSFilters;
  accountIds?: AccountIds;
}
export const GetEBSVolumeRecommendationsRequest = S.suspend(() =>
  S.Struct({
    volumeArns: S.optional(VolumeArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(EBSFilters),
    accountIds: S.optional(AccountIds),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEBSVolumeRecommendationsRequest",
}) as any as S.Schema<GetEBSVolumeRecommendationsRequest>;
export interface GetEC2InstanceRecommendationsRequest {
  instanceArns?: InstanceArns;
  nextToken?: string;
  maxResults?: number;
  filters?: Filters;
  accountIds?: AccountIds;
  recommendationPreferences?: RecommendationPreferences;
}
export const GetEC2InstanceRecommendationsRequest = S.suspend(() =>
  S.Struct({
    instanceArns: S.optional(InstanceArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(Filters),
    accountIds: S.optional(AccountIds),
    recommendationPreferences: S.optional(RecommendationPreferences),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEC2InstanceRecommendationsRequest",
}) as any as S.Schema<GetEC2InstanceRecommendationsRequest>;
export interface GetEC2RecommendationProjectedMetricsRequest {
  instanceArn: string;
  stat: string;
  period: number;
  startTime: Date;
  endTime: Date;
  recommendationPreferences?: RecommendationPreferences;
}
export const GetEC2RecommendationProjectedMetricsRequest = S.suspend(() =>
  S.Struct({
    instanceArn: S.String,
    stat: S.String,
    period: S.Number,
    startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    recommendationPreferences: S.optional(RecommendationPreferences),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEC2RecommendationProjectedMetricsRequest",
}) as any as S.Schema<GetEC2RecommendationProjectedMetricsRequest>;
export interface GetECSServiceRecommendationProjectedMetricsRequest {
  serviceArn: string;
  stat: string;
  period: number;
  startTime: Date;
  endTime: Date;
}
export const GetECSServiceRecommendationProjectedMetricsRequest = S.suspend(
  () =>
    S.Struct({
      serviceArn: S.String,
      stat: S.String,
      period: S.Number,
      startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
      endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "GetECSServiceRecommendationProjectedMetricsRequest",
}) as any as S.Schema<GetECSServiceRecommendationProjectedMetricsRequest>;
export interface ECSServiceRecommendationFilter {
  name?: string;
  values?: FilterValues;
}
export const ECSServiceRecommendationFilter = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), values: S.optional(FilterValues) }),
).annotations({
  identifier: "ECSServiceRecommendationFilter",
}) as any as S.Schema<ECSServiceRecommendationFilter>;
export type ECSServiceRecommendationFilters = ECSServiceRecommendationFilter[];
export const ECSServiceRecommendationFilters = S.Array(
  ECSServiceRecommendationFilter,
);
export interface GetECSServiceRecommendationsRequest {
  serviceArns?: ServiceArns;
  nextToken?: string;
  maxResults?: number;
  filters?: ECSServiceRecommendationFilters;
  accountIds?: AccountIds;
}
export const GetECSServiceRecommendationsRequest = S.suspend(() =>
  S.Struct({
    serviceArns: S.optional(ServiceArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(ECSServiceRecommendationFilters),
    accountIds: S.optional(AccountIds),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetECSServiceRecommendationsRequest",
}) as any as S.Schema<GetECSServiceRecommendationsRequest>;
export interface GetEffectiveRecommendationPreferencesRequest {
  resourceArn: string;
}
export const GetEffectiveRecommendationPreferencesRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEffectiveRecommendationPreferencesRequest",
}) as any as S.Schema<GetEffectiveRecommendationPreferencesRequest>;
export interface GetEnrollmentStatusResponse {
  status?: string;
  statusReason?: string;
  memberAccountsEnrolled?: boolean;
  lastUpdatedTimestamp?: Date;
  numberOfMemberAccountsOptedIn?: number;
}
export const GetEnrollmentStatusResponse = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    statusReason: S.optional(S.String),
    memberAccountsEnrolled: S.optional(S.Boolean),
    lastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    numberOfMemberAccountsOptedIn: S.optional(S.Number),
  }),
).annotations({
  identifier: "GetEnrollmentStatusResponse",
}) as any as S.Schema<GetEnrollmentStatusResponse>;
export interface LambdaFunctionRecommendationFilter {
  name?: string;
  values?: FilterValues;
}
export const LambdaFunctionRecommendationFilter = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), values: S.optional(FilterValues) }),
).annotations({
  identifier: "LambdaFunctionRecommendationFilter",
}) as any as S.Schema<LambdaFunctionRecommendationFilter>;
export type LambdaFunctionRecommendationFilters =
  LambdaFunctionRecommendationFilter[];
export const LambdaFunctionRecommendationFilters = S.Array(
  LambdaFunctionRecommendationFilter,
);
export interface GetLambdaFunctionRecommendationsRequest {
  functionArns?: FunctionArns;
  accountIds?: AccountIds;
  filters?: LambdaFunctionRecommendationFilters;
  nextToken?: string;
  maxResults?: number;
}
export const GetLambdaFunctionRecommendationsRequest = S.suspend(() =>
  S.Struct({
    functionArns: S.optional(FunctionArns),
    accountIds: S.optional(AccountIds),
    filters: S.optional(LambdaFunctionRecommendationFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetLambdaFunctionRecommendationsRequest",
}) as any as S.Schema<GetLambdaFunctionRecommendationsRequest>;
export interface LicenseRecommendationFilter {
  name?: string;
  values?: FilterValues;
}
export const LicenseRecommendationFilter = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), values: S.optional(FilterValues) }),
).annotations({
  identifier: "LicenseRecommendationFilter",
}) as any as S.Schema<LicenseRecommendationFilter>;
export type LicenseRecommendationFilters = LicenseRecommendationFilter[];
export const LicenseRecommendationFilters = S.Array(
  LicenseRecommendationFilter,
);
export interface GetLicenseRecommendationsRequest {
  resourceArns?: ResourceArns;
  nextToken?: string;
  maxResults?: number;
  filters?: LicenseRecommendationFilters;
  accountIds?: AccountIds;
}
export const GetLicenseRecommendationsRequest = S.suspend(() =>
  S.Struct({
    resourceArns: S.optional(ResourceArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(LicenseRecommendationFilters),
    accountIds: S.optional(AccountIds),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetLicenseRecommendationsRequest",
}) as any as S.Schema<GetLicenseRecommendationsRequest>;
export interface GetRDSDatabaseRecommendationProjectedMetricsRequest {
  resourceArn: string;
  stat: string;
  period: number;
  startTime: Date;
  endTime: Date;
  recommendationPreferences?: RecommendationPreferences;
}
export const GetRDSDatabaseRecommendationProjectedMetricsRequest = S.suspend(
  () =>
    S.Struct({
      resourceArn: S.String,
      stat: S.String,
      period: S.Number,
      startTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
      endTime: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
      recommendationPreferences: S.optional(RecommendationPreferences),
    }).pipe(
      T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
    ),
).annotations({
  identifier: "GetRDSDatabaseRecommendationProjectedMetricsRequest",
}) as any as S.Schema<GetRDSDatabaseRecommendationProjectedMetricsRequest>;
export interface RDSDBRecommendationFilter {
  name?: string;
  values?: FilterValues;
}
export const RDSDBRecommendationFilter = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), values: S.optional(FilterValues) }),
).annotations({
  identifier: "RDSDBRecommendationFilter",
}) as any as S.Schema<RDSDBRecommendationFilter>;
export type RDSDBRecommendationFilters = RDSDBRecommendationFilter[];
export const RDSDBRecommendationFilters = S.Array(RDSDBRecommendationFilter);
export interface GetRDSDatabaseRecommendationsRequest {
  resourceArns?: ResourceArns;
  nextToken?: string;
  maxResults?: number;
  filters?: RDSDBRecommendationFilters;
  accountIds?: AccountIds;
  recommendationPreferences?: RecommendationPreferences;
}
export const GetRDSDatabaseRecommendationsRequest = S.suspend(() =>
  S.Struct({
    resourceArns: S.optional(ResourceArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(RDSDBRecommendationFilters),
    accountIds: S.optional(AccountIds),
    recommendationPreferences: S.optional(RecommendationPreferences),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRDSDatabaseRecommendationsRequest",
}) as any as S.Schema<GetRDSDatabaseRecommendationsRequest>;
export interface Scope {
  name?: string;
  value?: string;
}
export const Scope = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "Scope" }) as any as S.Schema<Scope>;
export interface GetRecommendationPreferencesRequest {
  resourceType: string;
  scope?: Scope;
  nextToken?: string;
  maxResults?: number;
}
export const GetRecommendationPreferencesRequest = S.suspend(() =>
  S.Struct({
    resourceType: S.String,
    scope: S.optional(Scope),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRecommendationPreferencesRequest",
}) as any as S.Schema<GetRecommendationPreferencesRequest>;
export interface GetRecommendationSummariesRequest {
  accountIds?: AccountIds;
  nextToken?: string;
  maxResults?: number;
}
export const GetRecommendationSummariesRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIds),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetRecommendationSummariesRequest",
}) as any as S.Schema<GetRecommendationSummariesRequest>;
export interface UpdateEnrollmentStatusRequest {
  status: string;
  includeMemberAccounts?: boolean;
}
export const UpdateEnrollmentStatusRequest = S.suspend(() =>
  S.Struct({
    status: S.String,
    includeMemberAccounts: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateEnrollmentStatusRequest",
}) as any as S.Schema<UpdateEnrollmentStatusRequest>;
export type PreferredResourceValues = string[];
export const PreferredResourceValues = S.Array(S.String);
export interface JobFilter {
  name?: string;
  values?: FilterValues;
}
export const JobFilter = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), values: S.optional(FilterValues) }),
).annotations({ identifier: "JobFilter" }) as any as S.Schema<JobFilter>;
export type JobFilters = JobFilter[];
export const JobFilters = S.Array(JobFilter);
export interface IdleRecommendationFilter {
  name?: string;
  values?: FilterValues;
}
export const IdleRecommendationFilter = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), values: S.optional(FilterValues) }),
).annotations({
  identifier: "IdleRecommendationFilter",
}) as any as S.Schema<IdleRecommendationFilter>;
export type IdleRecommendationFilters = IdleRecommendationFilter[];
export const IdleRecommendationFilters = S.Array(IdleRecommendationFilter);
export interface EnrollmentFilter {
  name?: string;
  values?: FilterValues;
}
export const EnrollmentFilter = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), values: S.optional(FilterValues) }),
).annotations({
  identifier: "EnrollmentFilter",
}) as any as S.Schema<EnrollmentFilter>;
export type EnrollmentFilters = EnrollmentFilter[];
export const EnrollmentFilters = S.Array(EnrollmentFilter);
export interface OrderBy {
  dimension?: string;
  order?: string;
}
export const OrderBy = S.suspend(() =>
  S.Struct({ dimension: S.optional(S.String), order: S.optional(S.String) }),
).annotations({ identifier: "OrderBy" }) as any as S.Schema<OrderBy>;
export interface ExternalMetricsPreference {
  source?: string;
}
export const ExternalMetricsPreference = S.suspend(() =>
  S.Struct({ source: S.optional(S.String) }),
).annotations({
  identifier: "ExternalMetricsPreference",
}) as any as S.Schema<ExternalMetricsPreference>;
export interface PreferredResource {
  name?: string;
  includeList?: PreferredResourceValues;
  excludeList?: PreferredResourceValues;
}
export const PreferredResource = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    includeList: S.optional(PreferredResourceValues),
    excludeList: S.optional(PreferredResourceValues),
  }),
).annotations({
  identifier: "PreferredResource",
}) as any as S.Schema<PreferredResource>;
export type PreferredResources = PreferredResource[];
export const PreferredResources = S.Array(PreferredResource);
export interface DeleteRecommendationPreferencesRequest {
  resourceType: string;
  scope?: Scope;
  recommendationPreferenceNames: RecommendationPreferenceNames;
}
export const DeleteRecommendationPreferencesRequest = S.suspend(() =>
  S.Struct({
    resourceType: S.String,
    scope: S.optional(Scope),
    recommendationPreferenceNames: RecommendationPreferenceNames,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteRecommendationPreferencesRequest",
}) as any as S.Schema<DeleteRecommendationPreferencesRequest>;
export interface DeleteRecommendationPreferencesResponse {}
export const DeleteRecommendationPreferencesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteRecommendationPreferencesResponse",
}) as any as S.Schema<DeleteRecommendationPreferencesResponse>;
export interface DescribeRecommendationExportJobsRequest {
  jobIds?: JobIds;
  filters?: JobFilters;
  nextToken?: string;
  maxResults?: number;
}
export const DescribeRecommendationExportJobsRequest = S.suspend(() =>
  S.Struct({
    jobIds: S.optional(JobIds),
    filters: S.optional(JobFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DescribeRecommendationExportJobsRequest",
}) as any as S.Schema<DescribeRecommendationExportJobsRequest>;
export interface ExportAutoScalingGroupRecommendationsRequest {
  accountIds?: AccountIds;
  filters?: Filters;
  fieldsToExport?: ExportableAutoScalingGroupFields;
  s3DestinationConfig: S3DestinationConfig;
  fileFormat?: string;
  includeMemberAccounts?: boolean;
  recommendationPreferences?: RecommendationPreferences;
}
export const ExportAutoScalingGroupRecommendationsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIds),
    filters: S.optional(Filters),
    fieldsToExport: S.optional(ExportableAutoScalingGroupFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
    recommendationPreferences: S.optional(RecommendationPreferences),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExportAutoScalingGroupRecommendationsRequest",
}) as any as S.Schema<ExportAutoScalingGroupRecommendationsRequest>;
export interface ExportEBSVolumeRecommendationsRequest {
  accountIds?: AccountIds;
  filters?: EBSFilters;
  fieldsToExport?: ExportableVolumeFields;
  s3DestinationConfig: S3DestinationConfig;
  fileFormat?: string;
  includeMemberAccounts?: boolean;
}
export const ExportEBSVolumeRecommendationsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIds),
    filters: S.optional(EBSFilters),
    fieldsToExport: S.optional(ExportableVolumeFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExportEBSVolumeRecommendationsRequest",
}) as any as S.Schema<ExportEBSVolumeRecommendationsRequest>;
export interface ExportECSServiceRecommendationsRequest {
  accountIds?: AccountIds;
  filters?: ECSServiceRecommendationFilters;
  fieldsToExport?: ExportableECSServiceFields;
  s3DestinationConfig: S3DestinationConfig;
  fileFormat?: string;
  includeMemberAccounts?: boolean;
}
export const ExportECSServiceRecommendationsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIds),
    filters: S.optional(ECSServiceRecommendationFilters),
    fieldsToExport: S.optional(ExportableECSServiceFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExportECSServiceRecommendationsRequest",
}) as any as S.Schema<ExportECSServiceRecommendationsRequest>;
export interface ExportIdleRecommendationsRequest {
  accountIds?: AccountIds;
  filters?: IdleRecommendationFilters;
  fieldsToExport?: ExportableIdleFields;
  s3DestinationConfig: S3DestinationConfig;
  fileFormat?: string;
  includeMemberAccounts?: boolean;
}
export const ExportIdleRecommendationsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIds),
    filters: S.optional(IdleRecommendationFilters),
    fieldsToExport: S.optional(ExportableIdleFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExportIdleRecommendationsRequest",
}) as any as S.Schema<ExportIdleRecommendationsRequest>;
export interface ExportLambdaFunctionRecommendationsRequest {
  accountIds?: AccountIds;
  filters?: LambdaFunctionRecommendationFilters;
  fieldsToExport?: ExportableLambdaFunctionFields;
  s3DestinationConfig: S3DestinationConfig;
  fileFormat?: string;
  includeMemberAccounts?: boolean;
}
export const ExportLambdaFunctionRecommendationsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIds),
    filters: S.optional(LambdaFunctionRecommendationFilters),
    fieldsToExport: S.optional(ExportableLambdaFunctionFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExportLambdaFunctionRecommendationsRequest",
}) as any as S.Schema<ExportLambdaFunctionRecommendationsRequest>;
export interface ExportLicenseRecommendationsRequest {
  accountIds?: AccountIds;
  filters?: LicenseRecommendationFilters;
  fieldsToExport?: ExportableLicenseFields;
  s3DestinationConfig: S3DestinationConfig;
  fileFormat?: string;
  includeMemberAccounts?: boolean;
}
export const ExportLicenseRecommendationsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIds),
    filters: S.optional(LicenseRecommendationFilters),
    fieldsToExport: S.optional(ExportableLicenseFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExportLicenseRecommendationsRequest",
}) as any as S.Schema<ExportLicenseRecommendationsRequest>;
export interface ExportRDSDatabaseRecommendationsRequest {
  accountIds?: AccountIds;
  filters?: RDSDBRecommendationFilters;
  fieldsToExport?: ExportableRDSDBFields;
  s3DestinationConfig: S3DestinationConfig;
  fileFormat?: string;
  includeMemberAccounts?: boolean;
  recommendationPreferences?: RecommendationPreferences;
}
export const ExportRDSDatabaseRecommendationsRequest = S.suspend(() =>
  S.Struct({
    accountIds: S.optional(AccountIds),
    filters: S.optional(RDSDBRecommendationFilters),
    fieldsToExport: S.optional(ExportableRDSDBFields),
    s3DestinationConfig: S3DestinationConfig,
    fileFormat: S.optional(S.String),
    includeMemberAccounts: S.optional(S.Boolean),
    recommendationPreferences: S.optional(RecommendationPreferences),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ExportRDSDatabaseRecommendationsRequest",
}) as any as S.Schema<ExportRDSDatabaseRecommendationsRequest>;
export interface GetEnrollmentStatusesForOrganizationRequest {
  filters?: EnrollmentFilters;
  nextToken?: string;
  maxResults?: number;
}
export const GetEnrollmentStatusesForOrganizationRequest = S.suspend(() =>
  S.Struct({
    filters: S.optional(EnrollmentFilters),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetEnrollmentStatusesForOrganizationRequest",
}) as any as S.Schema<GetEnrollmentStatusesForOrganizationRequest>;
export interface GetIdleRecommendationsRequest {
  resourceArns?: ResourceArns;
  nextToken?: string;
  maxResults?: number;
  filters?: IdleRecommendationFilters;
  accountIds?: AccountIds;
  orderBy?: OrderBy;
}
export const GetIdleRecommendationsRequest = S.suspend(() =>
  S.Struct({
    resourceArns: S.optional(ResourceArns),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(IdleRecommendationFilters),
    accountIds: S.optional(AccountIds),
    orderBy: S.optional(OrderBy),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetIdleRecommendationsRequest",
}) as any as S.Schema<GetIdleRecommendationsRequest>;
export interface UpdateEnrollmentStatusResponse {
  status?: string;
  statusReason?: string;
}
export const UpdateEnrollmentStatusResponse = S.suspend(() =>
  S.Struct({
    status: S.optional(S.String),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateEnrollmentStatusResponse",
}) as any as S.Schema<UpdateEnrollmentStatusResponse>;
export type InferredWorkloadTypes = string[];
export const InferredWorkloadTypes = S.Array(S.String);
export type InstanceRecommendationFindingReasonCodes = string[];
export const InstanceRecommendationFindingReasonCodes = S.Array(S.String);
export type ECSServiceRecommendationFindingReasonCodes = string[];
export const ECSServiceRecommendationFindingReasonCodes = S.Array(S.String);
export type LambdaFunctionRecommendationFindingReasonCodes = string[];
export const LambdaFunctionRecommendationFindingReasonCodes = S.Array(S.String);
export type LicenseFindingReasonCodes = string[];
export const LicenseFindingReasonCodes = S.Array(S.String);
export type RDSInstanceFindingReasonCodes = string[];
export const RDSInstanceFindingReasonCodes = S.Array(S.String);
export type RDSStorageFindingReasonCodes = string[];
export const RDSStorageFindingReasonCodes = S.Array(S.String);
export interface CustomizableMetricParameters {
  threshold?: string;
  headroom?: string;
}
export const CustomizableMetricParameters = S.suspend(() =>
  S.Struct({ threshold: S.optional(S.String), headroom: S.optional(S.String) }),
).annotations({
  identifier: "CustomizableMetricParameters",
}) as any as S.Schema<CustomizableMetricParameters>;
export interface S3Destination {
  bucket?: string;
  key?: string;
  metadataKey?: string;
}
export const S3Destination = S.suspend(() =>
  S.Struct({
    bucket: S.optional(S.String),
    key: S.optional(S.String),
    metadataKey: S.optional(S.String),
  }),
).annotations({
  identifier: "S3Destination",
}) as any as S.Schema<S3Destination>;
export interface GetRecommendationError {
  identifier?: string;
  code?: string;
  message?: string;
}
export const GetRecommendationError = S.suspend(() =>
  S.Struct({
    identifier: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "GetRecommendationError",
}) as any as S.Schema<GetRecommendationError>;
export type GetRecommendationErrors = GetRecommendationError[];
export const GetRecommendationErrors = S.Array(GetRecommendationError);
export interface EffectivePreferredResource {
  name?: string;
  includeList?: PreferredResourceValues;
  effectiveIncludeList?: PreferredResourceValues;
  excludeList?: PreferredResourceValues;
}
export const EffectivePreferredResource = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    includeList: S.optional(PreferredResourceValues),
    effectiveIncludeList: S.optional(PreferredResourceValues),
    excludeList: S.optional(PreferredResourceValues),
  }),
).annotations({
  identifier: "EffectivePreferredResource",
}) as any as S.Schema<EffectivePreferredResource>;
export type EffectivePreferredResources = EffectivePreferredResource[];
export const EffectivePreferredResources = S.Array(EffectivePreferredResource);
export interface UtilizationPreference {
  metricName?: string;
  metricParameters?: CustomizableMetricParameters;
}
export const UtilizationPreference = S.suspend(() =>
  S.Struct({
    metricName: S.optional(S.String),
    metricParameters: S.optional(CustomizableMetricParameters),
  }),
).annotations({
  identifier: "UtilizationPreference",
}) as any as S.Schema<UtilizationPreference>;
export type UtilizationPreferences = UtilizationPreference[];
export const UtilizationPreferences = S.Array(UtilizationPreference);
export interface RecommendationPreferencesDetail {
  scope?: Scope;
  resourceType?: string;
  enhancedInfrastructureMetrics?: string;
  inferredWorkloadTypes?: string;
  externalMetricsPreference?: ExternalMetricsPreference;
  lookBackPeriod?: string;
  utilizationPreferences?: UtilizationPreferences;
  preferredResources?: EffectivePreferredResources;
  savingsEstimationMode?: string;
}
export const RecommendationPreferencesDetail = S.suspend(() =>
  S.Struct({
    scope: S.optional(Scope),
    resourceType: S.optional(S.String),
    enhancedInfrastructureMetrics: S.optional(S.String),
    inferredWorkloadTypes: S.optional(S.String),
    externalMetricsPreference: S.optional(ExternalMetricsPreference),
    lookBackPeriod: S.optional(S.String),
    utilizationPreferences: S.optional(UtilizationPreferences),
    preferredResources: S.optional(EffectivePreferredResources),
    savingsEstimationMode: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommendationPreferencesDetail",
}) as any as S.Schema<RecommendationPreferencesDetail>;
export type RecommendationPreferencesDetails =
  RecommendationPreferencesDetail[];
export const RecommendationPreferencesDetails = S.Array(
  RecommendationPreferencesDetail,
);
export type MixedInstanceTypes = string[];
export const MixedInstanceTypes = S.Array(S.String);
export interface UtilizationMetric {
  name?: string;
  statistic?: string;
  value?: number;
}
export const UtilizationMetric = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    statistic: S.optional(S.String),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "UtilizationMetric",
}) as any as S.Schema<UtilizationMetric>;
export type ProjectedUtilizationMetrics = UtilizationMetric[];
export const ProjectedUtilizationMetrics = S.Array(UtilizationMetric);
export type PlatformDifferences = string[];
export const PlatformDifferences = S.Array(S.String);
export type Timestamps = Date[];
export const Timestamps = S.Array(
  S.Date.pipe(T.TimestampFormat("epoch-seconds")),
);
export type MetricValues = number[];
export const MetricValues = S.Array(S.Number);
export interface RDSDBUtilizationMetric {
  name?: string;
  statistic?: string;
  value?: number;
}
export const RDSDBUtilizationMetric = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    statistic: S.optional(S.String),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "RDSDBUtilizationMetric",
}) as any as S.Schema<RDSDBUtilizationMetric>;
export type RDSDBProjectedUtilizationMetrics = RDSDBUtilizationMetric[];
export const RDSDBProjectedUtilizationMetrics = S.Array(RDSDBUtilizationMetric);
export interface ExportAutoScalingGroupRecommendationsResponse {
  jobId?: string;
  s3Destination?: S3Destination;
}
export const ExportAutoScalingGroupRecommendationsResponse = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    s3Destination: S.optional(S3Destination),
  }),
).annotations({
  identifier: "ExportAutoScalingGroupRecommendationsResponse",
}) as any as S.Schema<ExportAutoScalingGroupRecommendationsResponse>;
export interface ExportEBSVolumeRecommendationsResponse {
  jobId?: string;
  s3Destination?: S3Destination;
}
export const ExportEBSVolumeRecommendationsResponse = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    s3Destination: S.optional(S3Destination),
  }),
).annotations({
  identifier: "ExportEBSVolumeRecommendationsResponse",
}) as any as S.Schema<ExportEBSVolumeRecommendationsResponse>;
export interface ExportEC2InstanceRecommendationsResponse {
  jobId?: string;
  s3Destination?: S3Destination;
}
export const ExportEC2InstanceRecommendationsResponse = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    s3Destination: S.optional(S3Destination),
  }),
).annotations({
  identifier: "ExportEC2InstanceRecommendationsResponse",
}) as any as S.Schema<ExportEC2InstanceRecommendationsResponse>;
export interface ExportECSServiceRecommendationsResponse {
  jobId?: string;
  s3Destination?: S3Destination;
}
export const ExportECSServiceRecommendationsResponse = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    s3Destination: S.optional(S3Destination),
  }),
).annotations({
  identifier: "ExportECSServiceRecommendationsResponse",
}) as any as S.Schema<ExportECSServiceRecommendationsResponse>;
export interface ExportIdleRecommendationsResponse {
  jobId?: string;
  s3Destination?: S3Destination;
}
export const ExportIdleRecommendationsResponse = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    s3Destination: S.optional(S3Destination),
  }),
).annotations({
  identifier: "ExportIdleRecommendationsResponse",
}) as any as S.Schema<ExportIdleRecommendationsResponse>;
export interface ExportLambdaFunctionRecommendationsResponse {
  jobId?: string;
  s3Destination?: S3Destination;
}
export const ExportLambdaFunctionRecommendationsResponse = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    s3Destination: S.optional(S3Destination),
  }),
).annotations({
  identifier: "ExportLambdaFunctionRecommendationsResponse",
}) as any as S.Schema<ExportLambdaFunctionRecommendationsResponse>;
export interface ExportLicenseRecommendationsResponse {
  jobId?: string;
  s3Destination?: S3Destination;
}
export const ExportLicenseRecommendationsResponse = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    s3Destination: S.optional(S3Destination),
  }),
).annotations({
  identifier: "ExportLicenseRecommendationsResponse",
}) as any as S.Schema<ExportLicenseRecommendationsResponse>;
export interface ExportRDSDatabaseRecommendationsResponse {
  jobId?: string;
  s3Destination?: S3Destination;
}
export const ExportRDSDatabaseRecommendationsResponse = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    s3Destination: S.optional(S3Destination),
  }),
).annotations({
  identifier: "ExportRDSDatabaseRecommendationsResponse",
}) as any as S.Schema<ExportRDSDatabaseRecommendationsResponse>;
export interface GetEffectiveRecommendationPreferencesResponse {
  enhancedInfrastructureMetrics?: string;
  externalMetricsPreference?: ExternalMetricsPreference;
  lookBackPeriod?: string;
  utilizationPreferences?: UtilizationPreferences;
  preferredResources?: EffectivePreferredResources;
}
export const GetEffectiveRecommendationPreferencesResponse = S.suspend(() =>
  S.Struct({
    enhancedInfrastructureMetrics: S.optional(S.String),
    externalMetricsPreference: S.optional(ExternalMetricsPreference),
    lookBackPeriod: S.optional(S.String),
    utilizationPreferences: S.optional(UtilizationPreferences),
    preferredResources: S.optional(EffectivePreferredResources),
  }),
).annotations({
  identifier: "GetEffectiveRecommendationPreferencesResponse",
}) as any as S.Schema<GetEffectiveRecommendationPreferencesResponse>;
export interface GetRecommendationPreferencesResponse {
  nextToken?: string;
  recommendationPreferencesDetails?: RecommendationPreferencesDetails;
}
export const GetRecommendationPreferencesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    recommendationPreferencesDetails: S.optional(
      RecommendationPreferencesDetails,
    ),
  }),
).annotations({
  identifier: "GetRecommendationPreferencesResponse",
}) as any as S.Schema<GetRecommendationPreferencesResponse>;
export interface PutRecommendationPreferencesRequest {
  resourceType: string;
  scope?: Scope;
  enhancedInfrastructureMetrics?: string;
  inferredWorkloadTypes?: string;
  externalMetricsPreference?: ExternalMetricsPreference;
  lookBackPeriod?: string;
  utilizationPreferences?: UtilizationPreferences;
  preferredResources?: PreferredResources;
  savingsEstimationMode?: string;
}
export const PutRecommendationPreferencesRequest = S.suspend(() =>
  S.Struct({
    resourceType: S.String,
    scope: S.optional(Scope),
    enhancedInfrastructureMetrics: S.optional(S.String),
    inferredWorkloadTypes: S.optional(S.String),
    externalMetricsPreference: S.optional(ExternalMetricsPreference),
    lookBackPeriod: S.optional(S.String),
    utilizationPreferences: S.optional(UtilizationPreferences),
    preferredResources: S.optional(PreferredResources),
    savingsEstimationMode: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "PutRecommendationPreferencesRequest",
}) as any as S.Schema<PutRecommendationPreferencesRequest>;
export interface PutRecommendationPreferencesResponse {}
export const PutRecommendationPreferencesResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "PutRecommendationPreferencesResponse",
}) as any as S.Schema<PutRecommendationPreferencesResponse>;
export type UtilizationMetrics = UtilizationMetric[];
export const UtilizationMetrics = S.Array(UtilizationMetric);
export interface AutoScalingGroupConfiguration {
  desiredCapacity?: number;
  minSize?: number;
  maxSize?: number;
  instanceType?: string;
  allocationStrategy?: string;
  estimatedInstanceHourReductionPercentage?: number;
  type?: string;
  mixedInstanceTypes?: MixedInstanceTypes;
}
export const AutoScalingGroupConfiguration = S.suspend(() =>
  S.Struct({
    desiredCapacity: S.optional(S.Number),
    minSize: S.optional(S.Number),
    maxSize: S.optional(S.Number),
    instanceType: S.optional(S.String),
    allocationStrategy: S.optional(S.String),
    estimatedInstanceHourReductionPercentage: S.optional(S.Number),
    type: S.optional(S.String),
    mixedInstanceTypes: S.optional(MixedInstanceTypes),
  }),
).annotations({
  identifier: "AutoScalingGroupConfiguration",
}) as any as S.Schema<AutoScalingGroupConfiguration>;
export interface VolumeConfiguration {
  volumeType?: string;
  volumeSize?: number;
  volumeBaselineIOPS?: number;
  volumeBurstIOPS?: number;
  volumeBaselineThroughput?: number;
  volumeBurstThroughput?: number;
  rootVolume?: boolean;
}
export const VolumeConfiguration = S.suspend(() =>
  S.Struct({
    volumeType: S.optional(S.String),
    volumeSize: S.optional(S.Number),
    volumeBaselineIOPS: S.optional(S.Number),
    volumeBurstIOPS: S.optional(S.Number),
    volumeBaselineThroughput: S.optional(S.Number),
    volumeBurstThroughput: S.optional(S.Number),
    rootVolume: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "VolumeConfiguration",
}) as any as S.Schema<VolumeConfiguration>;
export interface EBSUtilizationMetric {
  name?: string;
  statistic?: string;
  value?: number;
}
export const EBSUtilizationMetric = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    statistic: S.optional(S.String),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "EBSUtilizationMetric",
}) as any as S.Schema<EBSUtilizationMetric>;
export type EBSUtilizationMetrics = EBSUtilizationMetric[];
export const EBSUtilizationMetrics = S.Array(EBSUtilizationMetric);
export interface Tag {
  key?: string;
  value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ key: S.optional(S.String), value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type Tags = Tag[];
export const Tags = S.Array(Tag);
export interface RecommendationSource {
  recommendationSourceArn?: string;
  recommendationSourceType?: string;
}
export const RecommendationSource = S.suspend(() =>
  S.Struct({
    recommendationSourceArn: S.optional(S.String),
    recommendationSourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommendationSource",
}) as any as S.Schema<RecommendationSource>;
export type RecommendationSources = RecommendationSource[];
export const RecommendationSources = S.Array(RecommendationSource);
export interface ExternalMetricStatus {
  statusCode?: string;
  statusReason?: string;
}
export const ExternalMetricStatus = S.suspend(() =>
  S.Struct({
    statusCode: S.optional(S.String),
    statusReason: S.optional(S.String),
  }),
).annotations({
  identifier: "ExternalMetricStatus",
}) as any as S.Schema<ExternalMetricStatus>;
export interface ProjectedMetric {
  name?: string;
  timestamps?: Timestamps;
  values?: MetricValues;
}
export const ProjectedMetric = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    timestamps: S.optional(Timestamps),
    values: S.optional(MetricValues),
  }),
).annotations({
  identifier: "ProjectedMetric",
}) as any as S.Schema<ProjectedMetric>;
export type ProjectedMetrics = ProjectedMetric[];
export const ProjectedMetrics = S.Array(ProjectedMetric);
export interface ECSServiceProjectedMetric {
  name?: string;
  timestamps?: Timestamps;
  upperBoundValues?: MetricValues;
  lowerBoundValues?: MetricValues;
}
export const ECSServiceProjectedMetric = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    timestamps: S.optional(Timestamps),
    upperBoundValues: S.optional(MetricValues),
    lowerBoundValues: S.optional(MetricValues),
  }),
).annotations({
  identifier: "ECSServiceProjectedMetric",
}) as any as S.Schema<ECSServiceProjectedMetric>;
export type ECSServiceProjectedMetrics = ECSServiceProjectedMetric[];
export const ECSServiceProjectedMetrics = S.Array(ECSServiceProjectedMetric);
export interface ECSServiceUtilizationMetric {
  name?: string;
  statistic?: string;
  value?: number;
}
export const ECSServiceUtilizationMetric = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    statistic: S.optional(S.String),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "ECSServiceUtilizationMetric",
}) as any as S.Schema<ECSServiceUtilizationMetric>;
export type ECSServiceUtilizationMetrics = ECSServiceUtilizationMetric[];
export const ECSServiceUtilizationMetrics = S.Array(
  ECSServiceUtilizationMetric,
);
export interface LambdaFunctionUtilizationMetric {
  name?: string;
  statistic?: string;
  value?: number;
}
export const LambdaFunctionUtilizationMetric = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    statistic: S.optional(S.String),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "LambdaFunctionUtilizationMetric",
}) as any as S.Schema<LambdaFunctionUtilizationMetric>;
export type LambdaFunctionUtilizationMetrics =
  LambdaFunctionUtilizationMetric[];
export const LambdaFunctionUtilizationMetrics = S.Array(
  LambdaFunctionUtilizationMetric,
);
export interface EstimatedMonthlySavings {
  currency?: string;
  value?: number;
}
export const EstimatedMonthlySavings = S.suspend(() =>
  S.Struct({ currency: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({
  identifier: "EstimatedMonthlySavings",
}) as any as S.Schema<EstimatedMonthlySavings>;
export interface SavingsOpportunity {
  savingsOpportunityPercentage?: number;
  estimatedMonthlySavings?: EstimatedMonthlySavings;
}
export const SavingsOpportunity = S.suspend(() =>
  S.Struct({
    savingsOpportunityPercentage: S.optional(S.Number),
    estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
  }),
).annotations({
  identifier: "SavingsOpportunity",
}) as any as S.Schema<SavingsOpportunity>;
export interface LicenseRecommendationOption {
  rank?: number;
  operatingSystem?: string;
  licenseEdition?: string;
  licenseModel?: string;
  savingsOpportunity?: SavingsOpportunity;
}
export const LicenseRecommendationOption = S.suspend(() =>
  S.Struct({
    rank: S.optional(S.Number),
    operatingSystem: S.optional(S.String),
    licenseEdition: S.optional(S.String),
    licenseModel: S.optional(S.String),
    savingsOpportunity: S.optional(SavingsOpportunity),
  }),
).annotations({
  identifier: "LicenseRecommendationOption",
}) as any as S.Schema<LicenseRecommendationOption>;
export type LicenseRecommendationOptions = LicenseRecommendationOption[];
export const LicenseRecommendationOptions = S.Array(
  LicenseRecommendationOption,
);
export interface RDSDatabaseProjectedMetric {
  name?: string;
  timestamps?: Timestamps;
  values?: MetricValues;
}
export const RDSDatabaseProjectedMetric = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    timestamps: S.optional(Timestamps),
    values: S.optional(MetricValues),
  }),
).annotations({
  identifier: "RDSDatabaseProjectedMetric",
}) as any as S.Schema<RDSDatabaseProjectedMetric>;
export type RDSDatabaseProjectedMetrics = RDSDatabaseProjectedMetric[];
export const RDSDatabaseProjectedMetrics = S.Array(RDSDatabaseProjectedMetric);
export interface DBStorageConfiguration {
  storageType?: string;
  allocatedStorage?: number;
  iops?: number;
  maxAllocatedStorage?: number;
  storageThroughput?: number;
}
export const DBStorageConfiguration = S.suspend(() =>
  S.Struct({
    storageType: S.optional(S.String),
    allocatedStorage: S.optional(S.Number),
    iops: S.optional(S.Number),
    maxAllocatedStorage: S.optional(S.Number),
    storageThroughput: S.optional(S.Number),
  }),
).annotations({
  identifier: "DBStorageConfiguration",
}) as any as S.Schema<DBStorageConfiguration>;
export type RDSDBUtilizationMetrics = RDSDBUtilizationMetric[];
export const RDSDBUtilizationMetrics = S.Array(RDSDBUtilizationMetric);
export interface IdleSummary {
  name?: string;
  value?: number;
}
export const IdleSummary = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({ identifier: "IdleSummary" }) as any as S.Schema<IdleSummary>;
export type IdleSummaries = IdleSummary[];
export const IdleSummaries = S.Array(IdleSummary);
export interface CurrentPerformanceRiskRatings {
  high?: number;
  medium?: number;
  low?: number;
  veryLow?: number;
}
export const CurrentPerformanceRiskRatings = S.suspend(() =>
  S.Struct({
    high: S.optional(S.Number),
    medium: S.optional(S.Number),
    low: S.optional(S.Number),
    veryLow: S.optional(S.Number),
  }),
).annotations({
  identifier: "CurrentPerformanceRiskRatings",
}) as any as S.Schema<CurrentPerformanceRiskRatings>;
export interface InferredWorkloadSaving {
  inferredWorkloadTypes?: InferredWorkloadTypes;
  estimatedMonthlySavings?: EstimatedMonthlySavings;
}
export const InferredWorkloadSaving = S.suspend(() =>
  S.Struct({
    inferredWorkloadTypes: S.optional(InferredWorkloadTypes),
    estimatedMonthlySavings: S.optional(EstimatedMonthlySavings),
  }),
).annotations({
  identifier: "InferredWorkloadSaving",
}) as any as S.Schema<InferredWorkloadSaving>;
export type InferredWorkloadSavings = InferredWorkloadSaving[];
export const InferredWorkloadSavings = S.Array(InferredWorkloadSaving);
export interface RecommendedOptionProjectedMetric {
  recommendedInstanceType?: string;
  rank?: number;
  projectedMetrics?: ProjectedMetrics;
}
export const RecommendedOptionProjectedMetric = S.suspend(() =>
  S.Struct({
    recommendedInstanceType: S.optional(S.String),
    rank: S.optional(S.Number),
    projectedMetrics: S.optional(ProjectedMetrics),
  }),
).annotations({
  identifier: "RecommendedOptionProjectedMetric",
}) as any as S.Schema<RecommendedOptionProjectedMetric>;
export type RecommendedOptionProjectedMetrics =
  RecommendedOptionProjectedMetric[];
export const RecommendedOptionProjectedMetrics = S.Array(
  RecommendedOptionProjectedMetric,
);
export interface ECSServiceRecommendedOptionProjectedMetric {
  recommendedCpuUnits?: number;
  recommendedMemorySize?: number;
  projectedMetrics?: ECSServiceProjectedMetrics;
}
export const ECSServiceRecommendedOptionProjectedMetric = S.suspend(() =>
  S.Struct({
    recommendedCpuUnits: S.optional(S.Number),
    recommendedMemorySize: S.optional(S.Number),
    projectedMetrics: S.optional(ECSServiceProjectedMetrics),
  }),
).annotations({
  identifier: "ECSServiceRecommendedOptionProjectedMetric",
}) as any as S.Schema<ECSServiceRecommendedOptionProjectedMetric>;
export type ECSServiceRecommendedOptionProjectedMetrics =
  ECSServiceRecommendedOptionProjectedMetric[];
export const ECSServiceRecommendedOptionProjectedMetrics = S.Array(
  ECSServiceRecommendedOptionProjectedMetric,
);
export interface AccountEnrollmentStatus {
  accountId?: string;
  status?: string;
  statusReason?: string;
  lastUpdatedTimestamp?: Date;
}
export const AccountEnrollmentStatus = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    status: S.optional(S.String),
    statusReason: S.optional(S.String),
    lastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "AccountEnrollmentStatus",
}) as any as S.Schema<AccountEnrollmentStatus>;
export type AccountEnrollmentStatuses = AccountEnrollmentStatus[];
export const AccountEnrollmentStatuses = S.Array(AccountEnrollmentStatus);
export interface IdleRecommendationError {
  identifier?: string;
  code?: string;
  message?: string;
  resourceType?: string;
}
export const IdleRecommendationError = S.suspend(() =>
  S.Struct({
    identifier: S.optional(S.String),
    code: S.optional(S.String),
    message: S.optional(S.String),
    resourceType: S.optional(S.String),
  }),
).annotations({
  identifier: "IdleRecommendationError",
}) as any as S.Schema<IdleRecommendationError>;
export type IdleRecommendationErrors = IdleRecommendationError[];
export const IdleRecommendationErrors = S.Array(IdleRecommendationError);
export interface RDSDatabaseRecommendedOptionProjectedMetric {
  recommendedDBInstanceClass?: string;
  rank?: number;
  projectedMetrics?: RDSDatabaseProjectedMetrics;
}
export const RDSDatabaseRecommendedOptionProjectedMetric = S.suspend(() =>
  S.Struct({
    recommendedDBInstanceClass: S.optional(S.String),
    rank: S.optional(S.Number),
    projectedMetrics: S.optional(RDSDatabaseProjectedMetrics),
  }),
).annotations({
  identifier: "RDSDatabaseRecommendedOptionProjectedMetric",
}) as any as S.Schema<RDSDatabaseRecommendedOptionProjectedMetric>;
export type RDSDatabaseRecommendedOptionProjectedMetrics =
  RDSDatabaseRecommendedOptionProjectedMetric[];
export const RDSDatabaseRecommendedOptionProjectedMetrics = S.Array(
  RDSDatabaseRecommendedOptionProjectedMetric,
);
export interface Gpu {
  gpuCount?: number;
  gpuMemorySizeInMiB?: number;
}
export const Gpu = S.suspend(() =>
  S.Struct({
    gpuCount: S.optional(S.Number),
    gpuMemorySizeInMiB: S.optional(S.Number),
  }),
).annotations({ identifier: "Gpu" }) as any as S.Schema<Gpu>;
export type Gpus = Gpu[];
export const Gpus = S.Array(Gpu);
export interface InstanceSavingsEstimationMode {
  source?: string;
}
export const InstanceSavingsEstimationMode = S.suspend(() =>
  S.Struct({ source: S.optional(S.String) }),
).annotations({
  identifier: "InstanceSavingsEstimationMode",
}) as any as S.Schema<InstanceSavingsEstimationMode>;
export interface EBSSavingsEstimationMode {
  source?: string;
}
export const EBSSavingsEstimationMode = S.suspend(() =>
  S.Struct({ source: S.optional(S.String) }),
).annotations({
  identifier: "EBSSavingsEstimationMode",
}) as any as S.Schema<EBSSavingsEstimationMode>;
export interface ECSServiceProjectedUtilizationMetric {
  name?: string;
  statistic?: string;
  lowerBoundValue?: number;
  upperBoundValue?: number;
}
export const ECSServiceProjectedUtilizationMetric = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    statistic: S.optional(S.String),
    lowerBoundValue: S.optional(S.Number),
    upperBoundValue: S.optional(S.Number),
  }),
).annotations({
  identifier: "ECSServiceProjectedUtilizationMetric",
}) as any as S.Schema<ECSServiceProjectedUtilizationMetric>;
export type ECSServiceProjectedUtilizationMetrics =
  ECSServiceProjectedUtilizationMetric[];
export const ECSServiceProjectedUtilizationMetrics = S.Array(
  ECSServiceProjectedUtilizationMetric,
);
export interface MemorySizeConfiguration {
  memory?: number;
  memoryReservation?: number;
}
export const MemorySizeConfiguration = S.suspend(() =>
  S.Struct({
    memory: S.optional(S.Number),
    memoryReservation: S.optional(S.Number),
  }),
).annotations({
  identifier: "MemorySizeConfiguration",
}) as any as S.Schema<MemorySizeConfiguration>;
export interface ContainerRecommendation {
  containerName?: string;
  memorySizeConfiguration?: MemorySizeConfiguration;
  cpu?: number;
}
export const ContainerRecommendation = S.suspend(() =>
  S.Struct({
    containerName: S.optional(S.String),
    memorySizeConfiguration: S.optional(MemorySizeConfiguration),
    cpu: S.optional(S.Number),
  }),
).annotations({
  identifier: "ContainerRecommendation",
}) as any as S.Schema<ContainerRecommendation>;
export type ContainerRecommendations = ContainerRecommendation[];
export const ContainerRecommendations = S.Array(ContainerRecommendation);
export interface ECSSavingsEstimationMode {
  source?: string;
}
export const ECSSavingsEstimationMode = S.suspend(() =>
  S.Struct({ source: S.optional(S.String) }),
).annotations({
  identifier: "ECSSavingsEstimationMode",
}) as any as S.Schema<ECSSavingsEstimationMode>;
export interface LambdaFunctionMemoryProjectedMetric {
  name?: string;
  statistic?: string;
  value?: number;
}
export const LambdaFunctionMemoryProjectedMetric = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    statistic: S.optional(S.String),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "LambdaFunctionMemoryProjectedMetric",
}) as any as S.Schema<LambdaFunctionMemoryProjectedMetric>;
export type LambdaFunctionMemoryProjectedMetrics =
  LambdaFunctionMemoryProjectedMetric[];
export const LambdaFunctionMemoryProjectedMetrics = S.Array(
  LambdaFunctionMemoryProjectedMetric,
);
export interface LambdaSavingsEstimationMode {
  source?: string;
}
export const LambdaSavingsEstimationMode = S.suspend(() =>
  S.Struct({ source: S.optional(S.String) }),
).annotations({
  identifier: "LambdaSavingsEstimationMode",
}) as any as S.Schema<LambdaSavingsEstimationMode>;
export interface MetricSource {
  provider?: string;
  providerArn?: string;
}
export const MetricSource = S.suspend(() =>
  S.Struct({
    provider: S.optional(S.String),
    providerArn: S.optional(S.String),
  }),
).annotations({ identifier: "MetricSource" }) as any as S.Schema<MetricSource>;
export type MetricsSource = MetricSource[];
export const MetricsSource = S.Array(MetricSource);
export interface RDSSavingsEstimationMode {
  source?: string;
}
export const RDSSavingsEstimationMode = S.suspend(() =>
  S.Struct({ source: S.optional(S.String) }),
).annotations({
  identifier: "RDSSavingsEstimationMode",
}) as any as S.Schema<RDSSavingsEstimationMode>;
export interface ReasonCodeSummary {
  name?: string;
  value?: number;
}
export const ReasonCodeSummary = S.suspend(() =>
  S.Struct({ name: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({
  identifier: "ReasonCodeSummary",
}) as any as S.Schema<ReasonCodeSummary>;
export type ReasonCodeSummaries = ReasonCodeSummary[];
export const ReasonCodeSummaries = S.Array(ReasonCodeSummary);
export interface GetEC2RecommendationProjectedMetricsResponse {
  recommendedOptionProjectedMetrics?: RecommendedOptionProjectedMetrics;
}
export const GetEC2RecommendationProjectedMetricsResponse = S.suspend(() =>
  S.Struct({
    recommendedOptionProjectedMetrics: S.optional(
      RecommendedOptionProjectedMetrics,
    ),
  }),
).annotations({
  identifier: "GetEC2RecommendationProjectedMetricsResponse",
}) as any as S.Schema<GetEC2RecommendationProjectedMetricsResponse>;
export interface GetECSServiceRecommendationProjectedMetricsResponse {
  recommendedOptionProjectedMetrics?: ECSServiceRecommendedOptionProjectedMetrics;
}
export const GetECSServiceRecommendationProjectedMetricsResponse = S.suspend(
  () =>
    S.Struct({
      recommendedOptionProjectedMetrics: S.optional(
        ECSServiceRecommendedOptionProjectedMetrics,
      ),
    }),
).annotations({
  identifier: "GetECSServiceRecommendationProjectedMetricsResponse",
}) as any as S.Schema<GetECSServiceRecommendationProjectedMetricsResponse>;
export interface GetEnrollmentStatusesForOrganizationResponse {
  accountEnrollmentStatuses?: AccountEnrollmentStatuses;
  nextToken?: string;
}
export const GetEnrollmentStatusesForOrganizationResponse = S.suspend(() =>
  S.Struct({
    accountEnrollmentStatuses: S.optional(AccountEnrollmentStatuses),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "GetEnrollmentStatusesForOrganizationResponse",
}) as any as S.Schema<GetEnrollmentStatusesForOrganizationResponse>;
export interface GetRDSDatabaseRecommendationProjectedMetricsResponse {
  recommendedOptionProjectedMetrics?: RDSDatabaseRecommendedOptionProjectedMetrics;
}
export const GetRDSDatabaseRecommendationProjectedMetricsResponse = S.suspend(
  () =>
    S.Struct({
      recommendedOptionProjectedMetrics: S.optional(
        RDSDatabaseRecommendedOptionProjectedMetrics,
      ),
    }),
).annotations({
  identifier: "GetRDSDatabaseRecommendationProjectedMetricsResponse",
}) as any as S.Schema<GetRDSDatabaseRecommendationProjectedMetricsResponse>;
export interface ExportDestination {
  s3?: S3Destination;
}
export const ExportDestination = S.suspend(() =>
  S.Struct({ s3: S.optional(S3Destination) }),
).annotations({
  identifier: "ExportDestination",
}) as any as S.Schema<ExportDestination>;
export interface GpuInfo {
  gpus?: Gpus;
}
export const GpuInfo = S.suspend(() =>
  S.Struct({ gpus: S.optional(Gpus) }),
).annotations({ identifier: "GpuInfo" }) as any as S.Schema<GpuInfo>;
export interface EffectiveRecommendationPreferences {
  cpuVendorArchitectures?: CpuVendorArchitectures;
  enhancedInfrastructureMetrics?: string;
  inferredWorkloadTypes?: string;
  externalMetricsPreference?: ExternalMetricsPreference;
  lookBackPeriod?: string;
  utilizationPreferences?: UtilizationPreferences;
  preferredResources?: EffectivePreferredResources;
  savingsEstimationMode?: InstanceSavingsEstimationMode;
}
export const EffectiveRecommendationPreferences = S.suspend(() =>
  S.Struct({
    cpuVendorArchitectures: S.optional(CpuVendorArchitectures),
    enhancedInfrastructureMetrics: S.optional(S.String),
    inferredWorkloadTypes: S.optional(S.String),
    externalMetricsPreference: S.optional(ExternalMetricsPreference),
    lookBackPeriod: S.optional(S.String),
    utilizationPreferences: S.optional(UtilizationPreferences),
    preferredResources: S.optional(EffectivePreferredResources),
    savingsEstimationMode: S.optional(InstanceSavingsEstimationMode),
  }),
).annotations({
  identifier: "EffectiveRecommendationPreferences",
}) as any as S.Schema<EffectiveRecommendationPreferences>;
export interface EBSEffectiveRecommendationPreferences {
  savingsEstimationMode?: EBSSavingsEstimationMode;
}
export const EBSEffectiveRecommendationPreferences = S.suspend(() =>
  S.Struct({ savingsEstimationMode: S.optional(EBSSavingsEstimationMode) }),
).annotations({
  identifier: "EBSEffectiveRecommendationPreferences",
}) as any as S.Schema<EBSEffectiveRecommendationPreferences>;
export interface ECSEffectiveRecommendationPreferences {
  savingsEstimationMode?: ECSSavingsEstimationMode;
}
export const ECSEffectiveRecommendationPreferences = S.suspend(() =>
  S.Struct({ savingsEstimationMode: S.optional(ECSSavingsEstimationMode) }),
).annotations({
  identifier: "ECSEffectiveRecommendationPreferences",
}) as any as S.Schema<ECSEffectiveRecommendationPreferences>;
export interface IdleEstimatedMonthlySavings {
  currency?: string;
  value?: number;
}
export const IdleEstimatedMonthlySavings = S.suspend(() =>
  S.Struct({ currency: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({
  identifier: "IdleEstimatedMonthlySavings",
}) as any as S.Schema<IdleEstimatedMonthlySavings>;
export interface IdleSavingsOpportunityAfterDiscounts {
  savingsOpportunityPercentage?: number;
  estimatedMonthlySavings?: IdleEstimatedMonthlySavings;
}
export const IdleSavingsOpportunityAfterDiscounts = S.suspend(() =>
  S.Struct({
    savingsOpportunityPercentage: S.optional(S.Number),
    estimatedMonthlySavings: S.optional(IdleEstimatedMonthlySavings),
  }),
).annotations({
  identifier: "IdleSavingsOpportunityAfterDiscounts",
}) as any as S.Schema<IdleSavingsOpportunityAfterDiscounts>;
export interface IdleUtilizationMetric {
  name?: string;
  statistic?: string;
  value?: number;
}
export const IdleUtilizationMetric = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    statistic: S.optional(S.String),
    value: S.optional(S.Number),
  }),
).annotations({
  identifier: "IdleUtilizationMetric",
}) as any as S.Schema<IdleUtilizationMetric>;
export type IdleUtilizationMetrics = IdleUtilizationMetric[];
export const IdleUtilizationMetrics = S.Array(IdleUtilizationMetric);
export interface LambdaEffectiveRecommendationPreferences {
  savingsEstimationMode?: LambdaSavingsEstimationMode;
}
export const LambdaEffectiveRecommendationPreferences = S.suspend(() =>
  S.Struct({ savingsEstimationMode: S.optional(LambdaSavingsEstimationMode) }),
).annotations({
  identifier: "LambdaEffectiveRecommendationPreferences",
}) as any as S.Schema<LambdaEffectiveRecommendationPreferences>;
export interface LicenseConfiguration {
  numberOfCores?: number;
  instanceType?: string;
  operatingSystem?: string;
  licenseEdition?: string;
  licenseName?: string;
  licenseModel?: string;
  licenseVersion?: string;
  metricsSource?: MetricsSource;
}
export const LicenseConfiguration = S.suspend(() =>
  S.Struct({
    numberOfCores: S.optional(S.Number),
    instanceType: S.optional(S.String),
    operatingSystem: S.optional(S.String),
    licenseEdition: S.optional(S.String),
    licenseName: S.optional(S.String),
    licenseModel: S.optional(S.String),
    licenseVersion: S.optional(S.String),
    metricsSource: S.optional(MetricsSource),
  }),
).annotations({
  identifier: "LicenseConfiguration",
}) as any as S.Schema<LicenseConfiguration>;
export interface RDSEffectiveRecommendationPreferences {
  cpuVendorArchitectures?: CpuVendorArchitectures;
  enhancedInfrastructureMetrics?: string;
  lookBackPeriod?: string;
  savingsEstimationMode?: RDSSavingsEstimationMode;
}
export const RDSEffectiveRecommendationPreferences = S.suspend(() =>
  S.Struct({
    cpuVendorArchitectures: S.optional(CpuVendorArchitectures),
    enhancedInfrastructureMetrics: S.optional(S.String),
    lookBackPeriod: S.optional(S.String),
    savingsEstimationMode: S.optional(RDSSavingsEstimationMode),
  }),
).annotations({
  identifier: "RDSEffectiveRecommendationPreferences",
}) as any as S.Schema<RDSEffectiveRecommendationPreferences>;
export interface Summary {
  name?: string;
  value?: number;
  reasonCodeSummaries?: ReasonCodeSummaries;
}
export const Summary = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    value: S.optional(S.Number),
    reasonCodeSummaries: S.optional(ReasonCodeSummaries),
  }),
).annotations({ identifier: "Summary" }) as any as S.Schema<Summary>;
export type Summaries = Summary[];
export const Summaries = S.Array(Summary);
export interface AutoScalingGroupEstimatedMonthlySavings {
  currency?: string;
  value?: number;
}
export const AutoScalingGroupEstimatedMonthlySavings = S.suspend(() =>
  S.Struct({ currency: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({
  identifier: "AutoScalingGroupEstimatedMonthlySavings",
}) as any as S.Schema<AutoScalingGroupEstimatedMonthlySavings>;
export interface EBSEstimatedMonthlySavings {
  currency?: string;
  value?: number;
}
export const EBSEstimatedMonthlySavings = S.suspend(() =>
  S.Struct({ currency: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({
  identifier: "EBSEstimatedMonthlySavings",
}) as any as S.Schema<EBSEstimatedMonthlySavings>;
export interface InstanceEstimatedMonthlySavings {
  currency?: string;
  value?: number;
}
export const InstanceEstimatedMonthlySavings = S.suspend(() =>
  S.Struct({ currency: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({
  identifier: "InstanceEstimatedMonthlySavings",
}) as any as S.Schema<InstanceEstimatedMonthlySavings>;
export interface ECSEstimatedMonthlySavings {
  currency?: string;
  value?: number;
}
export const ECSEstimatedMonthlySavings = S.suspend(() =>
  S.Struct({ currency: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({
  identifier: "ECSEstimatedMonthlySavings",
}) as any as S.Schema<ECSEstimatedMonthlySavings>;
export interface LambdaEstimatedMonthlySavings {
  currency?: string;
  value?: number;
}
export const LambdaEstimatedMonthlySavings = S.suspend(() =>
  S.Struct({ currency: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({
  identifier: "LambdaEstimatedMonthlySavings",
}) as any as S.Schema<LambdaEstimatedMonthlySavings>;
export interface RDSInstanceEstimatedMonthlySavings {
  currency?: string;
  value?: number;
}
export const RDSInstanceEstimatedMonthlySavings = S.suspend(() =>
  S.Struct({ currency: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({
  identifier: "RDSInstanceEstimatedMonthlySavings",
}) as any as S.Schema<RDSInstanceEstimatedMonthlySavings>;
export interface RDSStorageEstimatedMonthlySavings {
  currency?: string;
  value?: number;
}
export const RDSStorageEstimatedMonthlySavings = S.suspend(() =>
  S.Struct({ currency: S.optional(S.String), value: S.optional(S.Number) }),
).annotations({
  identifier: "RDSStorageEstimatedMonthlySavings",
}) as any as S.Schema<RDSStorageEstimatedMonthlySavings>;
export interface RecommendationExportJob {
  jobId?: string;
  destination?: ExportDestination;
  resourceType?: string;
  status?: string;
  creationTimestamp?: Date;
  lastUpdatedTimestamp?: Date;
  failureReason?: string;
}
export const RecommendationExportJob = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String),
    destination: S.optional(ExportDestination),
    resourceType: S.optional(S.String),
    status: S.optional(S.String),
    creationTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    lastUpdatedTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    failureReason: S.optional(S.String),
  }),
).annotations({
  identifier: "RecommendationExportJob",
}) as any as S.Schema<RecommendationExportJob>;
export type RecommendationExportJobs = RecommendationExportJob[];
export const RecommendationExportJobs = S.Array(RecommendationExportJob);
export interface LicenseRecommendation {
  resourceArn?: string;
  accountId?: string;
  currentLicenseConfiguration?: LicenseConfiguration;
  lookbackPeriodInDays?: number;
  lastRefreshTimestamp?: Date;
  finding?: string;
  findingReasonCodes?: LicenseFindingReasonCodes;
  licenseRecommendationOptions?: LicenseRecommendationOptions;
  tags?: Tags;
}
export const LicenseRecommendation = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    accountId: S.optional(S.String),
    currentLicenseConfiguration: S.optional(LicenseConfiguration),
    lookbackPeriodInDays: S.optional(S.Number),
    lastRefreshTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    finding: S.optional(S.String),
    findingReasonCodes: S.optional(LicenseFindingReasonCodes),
    licenseRecommendationOptions: S.optional(LicenseRecommendationOptions),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "LicenseRecommendation",
}) as any as S.Schema<LicenseRecommendation>;
export type LicenseRecommendations = LicenseRecommendation[];
export const LicenseRecommendations = S.Array(LicenseRecommendation);
export interface RecommendationSummary {
  summaries?: Summaries;
  idleSummaries?: IdleSummaries;
  recommendationResourceType?: string;
  accountId?: string;
  savingsOpportunity?: SavingsOpportunity;
  idleSavingsOpportunity?: SavingsOpportunity;
  aggregatedSavingsOpportunity?: SavingsOpportunity;
  currentPerformanceRiskRatings?: CurrentPerformanceRiskRatings;
  inferredWorkloadSavings?: InferredWorkloadSavings;
}
export const RecommendationSummary = S.suspend(() =>
  S.Struct({
    summaries: S.optional(Summaries),
    idleSummaries: S.optional(IdleSummaries),
    recommendationResourceType: S.optional(S.String),
    accountId: S.optional(S.String),
    savingsOpportunity: S.optional(SavingsOpportunity),
    idleSavingsOpportunity: S.optional(SavingsOpportunity),
    aggregatedSavingsOpportunity: S.optional(SavingsOpportunity),
    currentPerformanceRiskRatings: S.optional(CurrentPerformanceRiskRatings),
    inferredWorkloadSavings: S.optional(InferredWorkloadSavings),
  }),
).annotations({
  identifier: "RecommendationSummary",
}) as any as S.Schema<RecommendationSummary>;
export type RecommendationSummaries = RecommendationSummary[];
export const RecommendationSummaries = S.Array(RecommendationSummary);
export interface AutoScalingGroupSavingsOpportunityAfterDiscounts {
  savingsOpportunityPercentage?: number;
  estimatedMonthlySavings?: AutoScalingGroupEstimatedMonthlySavings;
}
export const AutoScalingGroupSavingsOpportunityAfterDiscounts = S.suspend(() =>
  S.Struct({
    savingsOpportunityPercentage: S.optional(S.Number),
    estimatedMonthlySavings: S.optional(
      AutoScalingGroupEstimatedMonthlySavings,
    ),
  }),
).annotations({
  identifier: "AutoScalingGroupSavingsOpportunityAfterDiscounts",
}) as any as S.Schema<AutoScalingGroupSavingsOpportunityAfterDiscounts>;
export interface EBSSavingsOpportunityAfterDiscounts {
  savingsOpportunityPercentage?: number;
  estimatedMonthlySavings?: EBSEstimatedMonthlySavings;
}
export const EBSSavingsOpportunityAfterDiscounts = S.suspend(() =>
  S.Struct({
    savingsOpportunityPercentage: S.optional(S.Number),
    estimatedMonthlySavings: S.optional(EBSEstimatedMonthlySavings),
  }),
).annotations({
  identifier: "EBSSavingsOpportunityAfterDiscounts",
}) as any as S.Schema<EBSSavingsOpportunityAfterDiscounts>;
export interface InstanceSavingsOpportunityAfterDiscounts {
  savingsOpportunityPercentage?: number;
  estimatedMonthlySavings?: InstanceEstimatedMonthlySavings;
}
export const InstanceSavingsOpportunityAfterDiscounts = S.suspend(() =>
  S.Struct({
    savingsOpportunityPercentage: S.optional(S.Number),
    estimatedMonthlySavings: S.optional(InstanceEstimatedMonthlySavings),
  }),
).annotations({
  identifier: "InstanceSavingsOpportunityAfterDiscounts",
}) as any as S.Schema<InstanceSavingsOpportunityAfterDiscounts>;
export interface ContainerConfiguration {
  containerName?: string;
  memorySizeConfiguration?: MemorySizeConfiguration;
  cpu?: number;
}
export const ContainerConfiguration = S.suspend(() =>
  S.Struct({
    containerName: S.optional(S.String),
    memorySizeConfiguration: S.optional(MemorySizeConfiguration),
    cpu: S.optional(S.Number),
  }),
).annotations({
  identifier: "ContainerConfiguration",
}) as any as S.Schema<ContainerConfiguration>;
export type ContainerConfigurations = ContainerConfiguration[];
export const ContainerConfigurations = S.Array(ContainerConfiguration);
export interface ECSSavingsOpportunityAfterDiscounts {
  savingsOpportunityPercentage?: number;
  estimatedMonthlySavings?: ECSEstimatedMonthlySavings;
}
export const ECSSavingsOpportunityAfterDiscounts = S.suspend(() =>
  S.Struct({
    savingsOpportunityPercentage: S.optional(S.Number),
    estimatedMonthlySavings: S.optional(ECSEstimatedMonthlySavings),
  }),
).annotations({
  identifier: "ECSSavingsOpportunityAfterDiscounts",
}) as any as S.Schema<ECSSavingsOpportunityAfterDiscounts>;
export interface LambdaSavingsOpportunityAfterDiscounts {
  savingsOpportunityPercentage?: number;
  estimatedMonthlySavings?: LambdaEstimatedMonthlySavings;
}
export const LambdaSavingsOpportunityAfterDiscounts = S.suspend(() =>
  S.Struct({
    savingsOpportunityPercentage: S.optional(S.Number),
    estimatedMonthlySavings: S.optional(LambdaEstimatedMonthlySavings),
  }),
).annotations({
  identifier: "LambdaSavingsOpportunityAfterDiscounts",
}) as any as S.Schema<LambdaSavingsOpportunityAfterDiscounts>;
export interface RDSInstanceSavingsOpportunityAfterDiscounts {
  savingsOpportunityPercentage?: number;
  estimatedMonthlySavings?: RDSInstanceEstimatedMonthlySavings;
}
export const RDSInstanceSavingsOpportunityAfterDiscounts = S.suspend(() =>
  S.Struct({
    savingsOpportunityPercentage: S.optional(S.Number),
    estimatedMonthlySavings: S.optional(RDSInstanceEstimatedMonthlySavings),
  }),
).annotations({
  identifier: "RDSInstanceSavingsOpportunityAfterDiscounts",
}) as any as S.Schema<RDSInstanceSavingsOpportunityAfterDiscounts>;
export interface RDSStorageSavingsOpportunityAfterDiscounts {
  savingsOpportunityPercentage?: number;
  estimatedMonthlySavings?: RDSStorageEstimatedMonthlySavings;
}
export const RDSStorageSavingsOpportunityAfterDiscounts = S.suspend(() =>
  S.Struct({
    savingsOpportunityPercentage: S.optional(S.Number),
    estimatedMonthlySavings: S.optional(RDSStorageEstimatedMonthlySavings),
  }),
).annotations({
  identifier: "RDSStorageSavingsOpportunityAfterDiscounts",
}) as any as S.Schema<RDSStorageSavingsOpportunityAfterDiscounts>;
export interface DescribeRecommendationExportJobsResponse {
  recommendationExportJobs?: RecommendationExportJobs;
  nextToken?: string;
}
export const DescribeRecommendationExportJobsResponse = S.suspend(() =>
  S.Struct({
    recommendationExportJobs: S.optional(RecommendationExportJobs),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "DescribeRecommendationExportJobsResponse",
}) as any as S.Schema<DescribeRecommendationExportJobsResponse>;
export interface GetLicenseRecommendationsResponse {
  nextToken?: string;
  licenseRecommendations?: LicenseRecommendations;
  errors?: GetRecommendationErrors;
}
export const GetLicenseRecommendationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    licenseRecommendations: S.optional(LicenseRecommendations),
    errors: S.optional(GetRecommendationErrors),
  }),
).annotations({
  identifier: "GetLicenseRecommendationsResponse",
}) as any as S.Schema<GetLicenseRecommendationsResponse>;
export interface GetRecommendationSummariesResponse {
  nextToken?: string;
  recommendationSummaries?: RecommendationSummaries;
}
export const GetRecommendationSummariesResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    recommendationSummaries: S.optional(RecommendationSummaries),
  }),
).annotations({
  identifier: "GetRecommendationSummariesResponse",
}) as any as S.Schema<GetRecommendationSummariesResponse>;
export interface AutoScalingGroupRecommendationOption {
  configuration?: AutoScalingGroupConfiguration;
  instanceGpuInfo?: GpuInfo;
  projectedUtilizationMetrics?: ProjectedUtilizationMetrics;
  performanceRisk?: number;
  rank?: number;
  savingsOpportunity?: SavingsOpportunity;
  savingsOpportunityAfterDiscounts?: AutoScalingGroupSavingsOpportunityAfterDiscounts;
  migrationEffort?: string;
}
export const AutoScalingGroupRecommendationOption = S.suspend(() =>
  S.Struct({
    configuration: S.optional(AutoScalingGroupConfiguration),
    instanceGpuInfo: S.optional(GpuInfo),
    projectedUtilizationMetrics: S.optional(ProjectedUtilizationMetrics),
    performanceRisk: S.optional(S.Number),
    rank: S.optional(S.Number),
    savingsOpportunity: S.optional(SavingsOpportunity),
    savingsOpportunityAfterDiscounts: S.optional(
      AutoScalingGroupSavingsOpportunityAfterDiscounts,
    ),
    migrationEffort: S.optional(S.String),
  }),
).annotations({
  identifier: "AutoScalingGroupRecommendationOption",
}) as any as S.Schema<AutoScalingGroupRecommendationOption>;
export type AutoScalingGroupRecommendationOptions =
  AutoScalingGroupRecommendationOption[];
export const AutoScalingGroupRecommendationOptions = S.Array(
  AutoScalingGroupRecommendationOption,
);
export interface VolumeRecommendationOption {
  configuration?: VolumeConfiguration;
  performanceRisk?: number;
  rank?: number;
  savingsOpportunity?: SavingsOpportunity;
  savingsOpportunityAfterDiscounts?: EBSSavingsOpportunityAfterDiscounts;
}
export const VolumeRecommendationOption = S.suspend(() =>
  S.Struct({
    configuration: S.optional(VolumeConfiguration),
    performanceRisk: S.optional(S.Number),
    rank: S.optional(S.Number),
    savingsOpportunity: S.optional(SavingsOpportunity),
    savingsOpportunityAfterDiscounts: S.optional(
      EBSSavingsOpportunityAfterDiscounts,
    ),
  }),
).annotations({
  identifier: "VolumeRecommendationOption",
}) as any as S.Schema<VolumeRecommendationOption>;
export type VolumeRecommendationOptions = VolumeRecommendationOption[];
export const VolumeRecommendationOptions = S.Array(VolumeRecommendationOption);
export interface InstanceRecommendationOption {
  instanceType?: string;
  instanceGpuInfo?: GpuInfo;
  projectedUtilizationMetrics?: ProjectedUtilizationMetrics;
  platformDifferences?: PlatformDifferences;
  performanceRisk?: number;
  rank?: number;
  savingsOpportunity?: SavingsOpportunity;
  savingsOpportunityAfterDiscounts?: InstanceSavingsOpportunityAfterDiscounts;
  migrationEffort?: string;
}
export const InstanceRecommendationOption = S.suspend(() =>
  S.Struct({
    instanceType: S.optional(S.String),
    instanceGpuInfo: S.optional(GpuInfo),
    projectedUtilizationMetrics: S.optional(ProjectedUtilizationMetrics),
    platformDifferences: S.optional(PlatformDifferences),
    performanceRisk: S.optional(S.Number),
    rank: S.optional(S.Number),
    savingsOpportunity: S.optional(SavingsOpportunity),
    savingsOpportunityAfterDiscounts: S.optional(
      InstanceSavingsOpportunityAfterDiscounts,
    ),
    migrationEffort: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceRecommendationOption",
}) as any as S.Schema<InstanceRecommendationOption>;
export type RecommendationOptions = InstanceRecommendationOption[];
export const RecommendationOptions = S.Array(InstanceRecommendationOption);
export interface ServiceConfiguration {
  memory?: number;
  cpu?: number;
  containerConfigurations?: ContainerConfigurations;
  autoScalingConfiguration?: string;
  taskDefinitionArn?: string;
}
export const ServiceConfiguration = S.suspend(() =>
  S.Struct({
    memory: S.optional(S.Number),
    cpu: S.optional(S.Number),
    containerConfigurations: S.optional(ContainerConfigurations),
    autoScalingConfiguration: S.optional(S.String),
    taskDefinitionArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceConfiguration",
}) as any as S.Schema<ServiceConfiguration>;
export interface ECSServiceRecommendationOption {
  memory?: number;
  cpu?: number;
  savingsOpportunity?: SavingsOpportunity;
  savingsOpportunityAfterDiscounts?: ECSSavingsOpportunityAfterDiscounts;
  projectedUtilizationMetrics?: ECSServiceProjectedUtilizationMetrics;
  containerRecommendations?: ContainerRecommendations;
}
export const ECSServiceRecommendationOption = S.suspend(() =>
  S.Struct({
    memory: S.optional(S.Number),
    cpu: S.optional(S.Number),
    savingsOpportunity: S.optional(SavingsOpportunity),
    savingsOpportunityAfterDiscounts: S.optional(
      ECSSavingsOpportunityAfterDiscounts,
    ),
    projectedUtilizationMetrics: S.optional(
      ECSServiceProjectedUtilizationMetrics,
    ),
    containerRecommendations: S.optional(ContainerRecommendations),
  }),
).annotations({
  identifier: "ECSServiceRecommendationOption",
}) as any as S.Schema<ECSServiceRecommendationOption>;
export type ECSServiceRecommendationOptions = ECSServiceRecommendationOption[];
export const ECSServiceRecommendationOptions = S.Array(
  ECSServiceRecommendationOption,
);
export interface IdleSavingsOpportunity {
  savingsOpportunityPercentage?: number;
  estimatedMonthlySavings?: IdleEstimatedMonthlySavings;
}
export const IdleSavingsOpportunity = S.suspend(() =>
  S.Struct({
    savingsOpportunityPercentage: S.optional(S.Number),
    estimatedMonthlySavings: S.optional(IdleEstimatedMonthlySavings),
  }),
).annotations({
  identifier: "IdleSavingsOpportunity",
}) as any as S.Schema<IdleSavingsOpportunity>;
export interface LambdaFunctionMemoryRecommendationOption {
  rank?: number;
  memorySize?: number;
  projectedUtilizationMetrics?: LambdaFunctionMemoryProjectedMetrics;
  savingsOpportunity?: SavingsOpportunity;
  savingsOpportunityAfterDiscounts?: LambdaSavingsOpportunityAfterDiscounts;
}
export const LambdaFunctionMemoryRecommendationOption = S.suspend(() =>
  S.Struct({
    rank: S.optional(S.Number),
    memorySize: S.optional(S.Number),
    projectedUtilizationMetrics: S.optional(
      LambdaFunctionMemoryProjectedMetrics,
    ),
    savingsOpportunity: S.optional(SavingsOpportunity),
    savingsOpportunityAfterDiscounts: S.optional(
      LambdaSavingsOpportunityAfterDiscounts,
    ),
  }),
).annotations({
  identifier: "LambdaFunctionMemoryRecommendationOption",
}) as any as S.Schema<LambdaFunctionMemoryRecommendationOption>;
export type LambdaFunctionMemoryRecommendationOptions =
  LambdaFunctionMemoryRecommendationOption[];
export const LambdaFunctionMemoryRecommendationOptions = S.Array(
  LambdaFunctionMemoryRecommendationOption,
);
export interface RDSDBInstanceRecommendationOption {
  dbInstanceClass?: string;
  projectedUtilizationMetrics?: RDSDBProjectedUtilizationMetrics;
  performanceRisk?: number;
  rank?: number;
  savingsOpportunity?: SavingsOpportunity;
  savingsOpportunityAfterDiscounts?: RDSInstanceSavingsOpportunityAfterDiscounts;
}
export const RDSDBInstanceRecommendationOption = S.suspend(() =>
  S.Struct({
    dbInstanceClass: S.optional(S.String),
    projectedUtilizationMetrics: S.optional(RDSDBProjectedUtilizationMetrics),
    performanceRisk: S.optional(S.Number),
    rank: S.optional(S.Number),
    savingsOpportunity: S.optional(SavingsOpportunity),
    savingsOpportunityAfterDiscounts: S.optional(
      RDSInstanceSavingsOpportunityAfterDiscounts,
    ),
  }),
).annotations({
  identifier: "RDSDBInstanceRecommendationOption",
}) as any as S.Schema<RDSDBInstanceRecommendationOption>;
export type RDSDBInstanceRecommendationOptions =
  RDSDBInstanceRecommendationOption[];
export const RDSDBInstanceRecommendationOptions = S.Array(
  RDSDBInstanceRecommendationOption,
);
export interface RDSDBStorageRecommendationOption {
  storageConfiguration?: DBStorageConfiguration;
  rank?: number;
  savingsOpportunity?: SavingsOpportunity;
  savingsOpportunityAfterDiscounts?: RDSStorageSavingsOpportunityAfterDiscounts;
  estimatedMonthlyVolumeIOPsCostVariation?: string;
}
export const RDSDBStorageRecommendationOption = S.suspend(() =>
  S.Struct({
    storageConfiguration: S.optional(DBStorageConfiguration),
    rank: S.optional(S.Number),
    savingsOpportunity: S.optional(SavingsOpportunity),
    savingsOpportunityAfterDiscounts: S.optional(
      RDSStorageSavingsOpportunityAfterDiscounts,
    ),
    estimatedMonthlyVolumeIOPsCostVariation: S.optional(S.String),
  }),
).annotations({
  identifier: "RDSDBStorageRecommendationOption",
}) as any as S.Schema<RDSDBStorageRecommendationOption>;
export type RDSDBStorageRecommendationOptions =
  RDSDBStorageRecommendationOption[];
export const RDSDBStorageRecommendationOptions = S.Array(
  RDSDBStorageRecommendationOption,
);
export interface AutoScalingGroupRecommendation {
  accountId?: string;
  autoScalingGroupArn?: string;
  autoScalingGroupName?: string;
  finding?: string;
  utilizationMetrics?: UtilizationMetrics;
  lookBackPeriodInDays?: number;
  currentConfiguration?: AutoScalingGroupConfiguration;
  currentInstanceGpuInfo?: GpuInfo;
  recommendationOptions?: AutoScalingGroupRecommendationOptions;
  lastRefreshTimestamp?: Date;
  currentPerformanceRisk?: string;
  effectiveRecommendationPreferences?: EffectiveRecommendationPreferences;
  inferredWorkloadTypes?: InferredWorkloadTypes;
}
export const AutoScalingGroupRecommendation = S.suspend(() =>
  S.Struct({
    accountId: S.optional(S.String),
    autoScalingGroupArn: S.optional(S.String),
    autoScalingGroupName: S.optional(S.String),
    finding: S.optional(S.String),
    utilizationMetrics: S.optional(UtilizationMetrics),
    lookBackPeriodInDays: S.optional(S.Number),
    currentConfiguration: S.optional(AutoScalingGroupConfiguration),
    currentInstanceGpuInfo: S.optional(GpuInfo),
    recommendationOptions: S.optional(AutoScalingGroupRecommendationOptions),
    lastRefreshTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    currentPerformanceRisk: S.optional(S.String),
    effectiveRecommendationPreferences: S.optional(
      EffectiveRecommendationPreferences,
    ),
    inferredWorkloadTypes: S.optional(InferredWorkloadTypes),
  }),
).annotations({
  identifier: "AutoScalingGroupRecommendation",
}) as any as S.Schema<AutoScalingGroupRecommendation>;
export type AutoScalingGroupRecommendations = AutoScalingGroupRecommendation[];
export const AutoScalingGroupRecommendations = S.Array(
  AutoScalingGroupRecommendation,
);
export interface VolumeRecommendation {
  volumeArn?: string;
  accountId?: string;
  currentConfiguration?: VolumeConfiguration;
  finding?: string;
  utilizationMetrics?: EBSUtilizationMetrics;
  lookBackPeriodInDays?: number;
  volumeRecommendationOptions?: VolumeRecommendationOptions;
  lastRefreshTimestamp?: Date;
  currentPerformanceRisk?: string;
  effectiveRecommendationPreferences?: EBSEffectiveRecommendationPreferences;
  tags?: Tags;
}
export const VolumeRecommendation = S.suspend(() =>
  S.Struct({
    volumeArn: S.optional(S.String),
    accountId: S.optional(S.String),
    currentConfiguration: S.optional(VolumeConfiguration),
    finding: S.optional(S.String),
    utilizationMetrics: S.optional(EBSUtilizationMetrics),
    lookBackPeriodInDays: S.optional(S.Number),
    volumeRecommendationOptions: S.optional(VolumeRecommendationOptions),
    lastRefreshTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    currentPerformanceRisk: S.optional(S.String),
    effectiveRecommendationPreferences: S.optional(
      EBSEffectiveRecommendationPreferences,
    ),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "VolumeRecommendation",
}) as any as S.Schema<VolumeRecommendation>;
export type VolumeRecommendations = VolumeRecommendation[];
export const VolumeRecommendations = S.Array(VolumeRecommendation);
export interface InstanceRecommendation {
  instanceArn?: string;
  accountId?: string;
  instanceName?: string;
  currentInstanceType?: string;
  finding?: string;
  findingReasonCodes?: InstanceRecommendationFindingReasonCodes;
  utilizationMetrics?: UtilizationMetrics;
  lookBackPeriodInDays?: number;
  recommendationOptions?: RecommendationOptions;
  recommendationSources?: RecommendationSources;
  lastRefreshTimestamp?: Date;
  currentPerformanceRisk?: string;
  effectiveRecommendationPreferences?: EffectiveRecommendationPreferences;
  inferredWorkloadTypes?: InferredWorkloadTypes;
  instanceState?: string;
  tags?: Tags;
  externalMetricStatus?: ExternalMetricStatus;
  currentInstanceGpuInfo?: GpuInfo;
  idle?: string;
}
export const InstanceRecommendation = S.suspend(() =>
  S.Struct({
    instanceArn: S.optional(S.String),
    accountId: S.optional(S.String),
    instanceName: S.optional(S.String),
    currentInstanceType: S.optional(S.String),
    finding: S.optional(S.String),
    findingReasonCodes: S.optional(InstanceRecommendationFindingReasonCodes),
    utilizationMetrics: S.optional(UtilizationMetrics),
    lookBackPeriodInDays: S.optional(S.Number),
    recommendationOptions: S.optional(RecommendationOptions),
    recommendationSources: S.optional(RecommendationSources),
    lastRefreshTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    currentPerformanceRisk: S.optional(S.String),
    effectiveRecommendationPreferences: S.optional(
      EffectiveRecommendationPreferences,
    ),
    inferredWorkloadTypes: S.optional(InferredWorkloadTypes),
    instanceState: S.optional(S.String),
    tags: S.optional(Tags),
    externalMetricStatus: S.optional(ExternalMetricStatus),
    currentInstanceGpuInfo: S.optional(GpuInfo),
    idle: S.optional(S.String),
  }),
).annotations({
  identifier: "InstanceRecommendation",
}) as any as S.Schema<InstanceRecommendation>;
export type InstanceRecommendations = InstanceRecommendation[];
export const InstanceRecommendations = S.Array(InstanceRecommendation);
export interface ECSServiceRecommendation {
  serviceArn?: string;
  accountId?: string;
  currentServiceConfiguration?: ServiceConfiguration;
  utilizationMetrics?: ECSServiceUtilizationMetrics;
  lookbackPeriodInDays?: number;
  launchType?: string;
  lastRefreshTimestamp?: Date;
  finding?: string;
  findingReasonCodes?: ECSServiceRecommendationFindingReasonCodes;
  serviceRecommendationOptions?: ECSServiceRecommendationOptions;
  currentPerformanceRisk?: string;
  effectiveRecommendationPreferences?: ECSEffectiveRecommendationPreferences;
  tags?: Tags;
}
export const ECSServiceRecommendation = S.suspend(() =>
  S.Struct({
    serviceArn: S.optional(S.String),
    accountId: S.optional(S.String),
    currentServiceConfiguration: S.optional(ServiceConfiguration),
    utilizationMetrics: S.optional(ECSServiceUtilizationMetrics),
    lookbackPeriodInDays: S.optional(S.Number),
    launchType: S.optional(S.String),
    lastRefreshTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    finding: S.optional(S.String),
    findingReasonCodes: S.optional(ECSServiceRecommendationFindingReasonCodes),
    serviceRecommendationOptions: S.optional(ECSServiceRecommendationOptions),
    currentPerformanceRisk: S.optional(S.String),
    effectiveRecommendationPreferences: S.optional(
      ECSEffectiveRecommendationPreferences,
    ),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "ECSServiceRecommendation",
}) as any as S.Schema<ECSServiceRecommendation>;
export type ECSServiceRecommendations = ECSServiceRecommendation[];
export const ECSServiceRecommendations = S.Array(ECSServiceRecommendation);
export interface IdleRecommendation {
  resourceArn?: string;
  resourceId?: string;
  resourceType?: string;
  accountId?: string;
  finding?: string;
  findingDescription?: string;
  savingsOpportunity?: IdleSavingsOpportunity;
  savingsOpportunityAfterDiscounts?: IdleSavingsOpportunityAfterDiscounts;
  utilizationMetrics?: IdleUtilizationMetrics;
  lookBackPeriodInDays?: number;
  lastRefreshTimestamp?: Date;
  tags?: Tags;
}
export const IdleRecommendation = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    accountId: S.optional(S.String),
    finding: S.optional(S.String),
    findingDescription: S.optional(S.String),
    savingsOpportunity: S.optional(IdleSavingsOpportunity),
    savingsOpportunityAfterDiscounts: S.optional(
      IdleSavingsOpportunityAfterDiscounts,
    ),
    utilizationMetrics: S.optional(IdleUtilizationMetrics),
    lookBackPeriodInDays: S.optional(S.Number),
    lastRefreshTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "IdleRecommendation",
}) as any as S.Schema<IdleRecommendation>;
export type IdleRecommendations = IdleRecommendation[];
export const IdleRecommendations = S.Array(IdleRecommendation);
export interface LambdaFunctionRecommendation {
  functionArn?: string;
  functionVersion?: string;
  accountId?: string;
  currentMemorySize?: number;
  numberOfInvocations?: number;
  utilizationMetrics?: LambdaFunctionUtilizationMetrics;
  lookbackPeriodInDays?: number;
  lastRefreshTimestamp?: Date;
  finding?: string;
  findingReasonCodes?: LambdaFunctionRecommendationFindingReasonCodes;
  memorySizeRecommendationOptions?: LambdaFunctionMemoryRecommendationOptions;
  currentPerformanceRisk?: string;
  effectiveRecommendationPreferences?: LambdaEffectiveRecommendationPreferences;
  tags?: Tags;
}
export const LambdaFunctionRecommendation = S.suspend(() =>
  S.Struct({
    functionArn: S.optional(S.String),
    functionVersion: S.optional(S.String),
    accountId: S.optional(S.String),
    currentMemorySize: S.optional(S.Number),
    numberOfInvocations: S.optional(S.Number),
    utilizationMetrics: S.optional(LambdaFunctionUtilizationMetrics),
    lookbackPeriodInDays: S.optional(S.Number),
    lastRefreshTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    finding: S.optional(S.String),
    findingReasonCodes: S.optional(
      LambdaFunctionRecommendationFindingReasonCodes,
    ),
    memorySizeRecommendationOptions: S.optional(
      LambdaFunctionMemoryRecommendationOptions,
    ),
    currentPerformanceRisk: S.optional(S.String),
    effectiveRecommendationPreferences: S.optional(
      LambdaEffectiveRecommendationPreferences,
    ),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "LambdaFunctionRecommendation",
}) as any as S.Schema<LambdaFunctionRecommendation>;
export type LambdaFunctionRecommendations = LambdaFunctionRecommendation[];
export const LambdaFunctionRecommendations = S.Array(
  LambdaFunctionRecommendation,
);
export interface RDSDBRecommendation {
  resourceArn?: string;
  accountId?: string;
  engine?: string;
  engineVersion?: string;
  promotionTier?: number;
  currentDBInstanceClass?: string;
  currentStorageConfiguration?: DBStorageConfiguration;
  dbClusterIdentifier?: string;
  idle?: string;
  instanceFinding?: string;
  storageFinding?: string;
  instanceFindingReasonCodes?: RDSInstanceFindingReasonCodes;
  currentInstancePerformanceRisk?: string;
  currentStorageEstimatedMonthlyVolumeIOPsCostVariation?: string;
  storageFindingReasonCodes?: RDSStorageFindingReasonCodes;
  instanceRecommendationOptions?: RDSDBInstanceRecommendationOptions;
  storageRecommendationOptions?: RDSDBStorageRecommendationOptions;
  utilizationMetrics?: RDSDBUtilizationMetrics;
  effectiveRecommendationPreferences?: RDSEffectiveRecommendationPreferences;
  lookbackPeriodInDays?: number;
  lastRefreshTimestamp?: Date;
  tags?: Tags;
}
export const RDSDBRecommendation = S.suspend(() =>
  S.Struct({
    resourceArn: S.optional(S.String),
    accountId: S.optional(S.String),
    engine: S.optional(S.String),
    engineVersion: S.optional(S.String),
    promotionTier: S.optional(S.Number),
    currentDBInstanceClass: S.optional(S.String),
    currentStorageConfiguration: S.optional(DBStorageConfiguration),
    dbClusterIdentifier: S.optional(S.String),
    idle: S.optional(S.String),
    instanceFinding: S.optional(S.String),
    storageFinding: S.optional(S.String),
    instanceFindingReasonCodes: S.optional(RDSInstanceFindingReasonCodes),
    currentInstancePerformanceRisk: S.optional(S.String),
    currentStorageEstimatedMonthlyVolumeIOPsCostVariation: S.optional(S.String),
    storageFindingReasonCodes: S.optional(RDSStorageFindingReasonCodes),
    instanceRecommendationOptions: S.optional(
      RDSDBInstanceRecommendationOptions,
    ),
    storageRecommendationOptions: S.optional(RDSDBStorageRecommendationOptions),
    utilizationMetrics: S.optional(RDSDBUtilizationMetrics),
    effectiveRecommendationPreferences: S.optional(
      RDSEffectiveRecommendationPreferences,
    ),
    lookbackPeriodInDays: S.optional(S.Number),
    lastRefreshTimestamp: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    tags: S.optional(Tags),
  }),
).annotations({
  identifier: "RDSDBRecommendation",
}) as any as S.Schema<RDSDBRecommendation>;
export type RDSDBRecommendations = RDSDBRecommendation[];
export const RDSDBRecommendations = S.Array(RDSDBRecommendation);
export interface GetAutoScalingGroupRecommendationsResponse {
  nextToken?: string;
  autoScalingGroupRecommendations?: AutoScalingGroupRecommendations;
  errors?: GetRecommendationErrors;
}
export const GetAutoScalingGroupRecommendationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    autoScalingGroupRecommendations: S.optional(
      AutoScalingGroupRecommendations,
    ),
    errors: S.optional(GetRecommendationErrors),
  }),
).annotations({
  identifier: "GetAutoScalingGroupRecommendationsResponse",
}) as any as S.Schema<GetAutoScalingGroupRecommendationsResponse>;
export interface GetEBSVolumeRecommendationsResponse {
  nextToken?: string;
  volumeRecommendations?: VolumeRecommendations;
  errors?: GetRecommendationErrors;
}
export const GetEBSVolumeRecommendationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    volumeRecommendations: S.optional(VolumeRecommendations),
    errors: S.optional(GetRecommendationErrors),
  }),
).annotations({
  identifier: "GetEBSVolumeRecommendationsResponse",
}) as any as S.Schema<GetEBSVolumeRecommendationsResponse>;
export interface GetEC2InstanceRecommendationsResponse {
  nextToken?: string;
  instanceRecommendations?: InstanceRecommendations;
  errors?: GetRecommendationErrors;
}
export const GetEC2InstanceRecommendationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    instanceRecommendations: S.optional(InstanceRecommendations),
    errors: S.optional(GetRecommendationErrors),
  }),
).annotations({
  identifier: "GetEC2InstanceRecommendationsResponse",
}) as any as S.Schema<GetEC2InstanceRecommendationsResponse>;
export interface GetECSServiceRecommendationsResponse {
  nextToken?: string;
  ecsServiceRecommendations?: ECSServiceRecommendations;
  errors?: GetRecommendationErrors;
}
export const GetECSServiceRecommendationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    ecsServiceRecommendations: S.optional(ECSServiceRecommendations),
    errors: S.optional(GetRecommendationErrors),
  }),
).annotations({
  identifier: "GetECSServiceRecommendationsResponse",
}) as any as S.Schema<GetECSServiceRecommendationsResponse>;
export interface GetIdleRecommendationsResponse {
  nextToken?: string;
  idleRecommendations?: IdleRecommendations;
  errors?: IdleRecommendationErrors;
}
export const GetIdleRecommendationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    idleRecommendations: S.optional(IdleRecommendations),
    errors: S.optional(IdleRecommendationErrors),
  }),
).annotations({
  identifier: "GetIdleRecommendationsResponse",
}) as any as S.Schema<GetIdleRecommendationsResponse>;
export interface GetLambdaFunctionRecommendationsResponse {
  nextToken?: string;
  lambdaFunctionRecommendations?: LambdaFunctionRecommendations;
}
export const GetLambdaFunctionRecommendationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    lambdaFunctionRecommendations: S.optional(LambdaFunctionRecommendations),
  }),
).annotations({
  identifier: "GetLambdaFunctionRecommendationsResponse",
}) as any as S.Schema<GetLambdaFunctionRecommendationsResponse>;
export interface GetRDSDatabaseRecommendationsResponse {
  nextToken?: string;
  rdsDBRecommendations?: RDSDBRecommendations;
  errors?: GetRecommendationErrors;
}
export const GetRDSDatabaseRecommendationsResponse = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    rdsDBRecommendations: S.optional(RDSDBRecommendations),
    errors: S.optional(GetRecommendationErrors),
  }),
).annotations({
  identifier: "GetRDSDatabaseRecommendationsResponse",
}) as any as S.Schema<GetRDSDatabaseRecommendationsResponse>;

//# Errors
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class MissingAuthenticationToken extends S.TaggedError<MissingAuthenticationToken>()(
  "MissingAuthenticationToken",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ServiceUnavailableException extends S.TaggedError<ServiceUnavailableException>()(
  "ServiceUnavailableException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class OptInRequiredException extends S.TaggedError<OptInRequiredException>()(
  "OptInRequiredException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
).pipe(C.withThrottlingError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns the enrollment (opt in) status of an account to the Compute Optimizer
 * service.
 *
 * If the account is the management account of an organization, this action also confirms
 * the enrollment status of member accounts of the organization. Use the GetEnrollmentStatusesForOrganization action to get detailed information
 * about the enrollment status of member accounts of an organization.
 */
export const getEnrollmentStatus: (
  input: GetEnrollmentStatusRequest,
) => Effect.Effect<
  GetEnrollmentStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEnrollmentStatusRequest,
  output: GetEnrollmentStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns license recommendations for Amazon EC2 instances that run on a specific license.
 *
 * Compute Optimizer generates recommendations for licenses that meet a specific set of requirements. For more
 * information, see the Supported resources and
 * requirements in the Compute Optimizer User
 * Guide.
 */
export const getLicenseRecommendations: (
  input: GetLicenseRecommendationsRequest,
) => Effect.Effect<
  GetLicenseRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetLicenseRecommendationsRequest,
  output: GetLicenseRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns the Compute Optimizer enrollment (opt-in) status of organization member
 * accounts, if your account is an organization management account.
 *
 * To get the enrollment status of standalone accounts, use the GetEnrollmentStatus action.
 */
export const getEnrollmentStatusesForOrganization: {
  (
    input: GetEnrollmentStatusesForOrganizationRequest,
  ): Effect.Effect<
    GetEnrollmentStatusesForOrganizationResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | MissingAuthenticationToken
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetEnrollmentStatusesForOrganizationRequest,
  ) => Stream.Stream<
    GetEnrollmentStatusesForOrganizationResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | MissingAuthenticationToken
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetEnrollmentStatusesForOrganizationRequest,
  ) => Stream.Stream<
    AccountEnrollmentStatus,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | MissingAuthenticationToken
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetEnrollmentStatusesForOrganizationRequest,
  output: GetEnrollmentStatusesForOrganizationResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "accountEnrollmentStatuses",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates the enrollment (opt in and opt out) status of an account to the Compute Optimizer service.
 *
 * If the account is a management account of an organization, this action can also be
 * used to enroll member accounts of the organization.
 *
 * You must have the appropriate permissions to opt in to Compute Optimizer, to view its
 * recommendations, and to opt out. For more information, see Controlling access with Amazon Web Services Identity and Access Management in the *Compute Optimizer User Guide*.
 *
 * When you opt in, Compute Optimizer automatically creates a service-linked role in your
 * account to access its data. For more information, see Using
 * Service-Linked Roles for Compute Optimizer in the *Compute Optimizer User Guide*.
 */
export const updateEnrollmentStatus: (
  input: UpdateEnrollmentStatusRequest,
) => Effect.Effect<
  UpdateEnrollmentStatusResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateEnrollmentStatusRequest,
  output: UpdateEnrollmentStatusResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns the optimization findings for an account.
 *
 * It returns the number of:
 *
 * - Amazon EC2 instances in an account that are
 * `Underprovisioned`, `Overprovisioned`, or
 * `Optimized`.
 *
 * - EC2Amazon EC2 Auto Scaling groups in an account that are `NotOptimized`, or
 * `Optimized`.
 *
 * - Amazon EBS volumes in an account that are `NotOptimized`,
 * or `Optimized`.
 *
 * - Lambda functions in an account that are `NotOptimized`,
 * or `Optimized`.
 *
 * - Amazon ECS services in an account that are `Underprovisioned`,
 * `Overprovisioned`, or `Optimized`.
 *
 * - Commercial software licenses in an account that are `InsufficientMetrics`,
 * `NotOptimized` or `Optimized`.
 *
 * - Amazon Aurora and Amazon RDS databases in an account that are `Underprovisioned`,
 * `Overprovisioned`, `Optimized`, or `NotOptimized`.
 */
export const getRecommendationSummaries: {
  (
    input: GetRecommendationSummariesRequest,
  ): Effect.Effect<
    GetRecommendationSummariesResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | MissingAuthenticationToken
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetRecommendationSummariesRequest,
  ) => Stream.Stream<
    GetRecommendationSummariesResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | MissingAuthenticationToken
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetRecommendationSummariesRequest,
  ) => Stream.Stream<
    RecommendationSummary,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | MissingAuthenticationToken
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetRecommendationSummariesRequest,
  output: GetRecommendationSummariesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "recommendationSummaries",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Exports optimization recommendations for Amazon EC2 Auto Scaling groups.
 *
 * Recommendations are exported in a comma-separated values (.csv) file, and its metadata
 * in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one Amazon EC2 Auto Scaling group export job in progress per Amazon Web Services Region.
 */
export const exportAutoScalingGroupRecommendations: (
  input: ExportAutoScalingGroupRecommendationsRequest,
) => Effect.Effect<
  ExportAutoScalingGroupRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | LimitExceededException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportAutoScalingGroupRecommendationsRequest,
  output: ExportAutoScalingGroupRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Exports optimization recommendations for Amazon EBS volumes.
 *
 * Recommendations are exported in a comma-separated values (.csv) file, and its metadata
 * in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one Amazon EBS volume export job in progress per Amazon Web Services Region.
 */
export const exportEBSVolumeRecommendations: (
  input: ExportEBSVolumeRecommendationsRequest,
) => Effect.Effect<
  ExportEBSVolumeRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | LimitExceededException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportEBSVolumeRecommendationsRequest,
  output: ExportEBSVolumeRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Exports optimization recommendations for Amazon EC2 instances.
 *
 * Recommendations are exported in a comma-separated values (.csv) file, and its metadata
 * in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one Amazon EC2 instance export job in progress per Amazon Web Services Region.
 */
export const exportEC2InstanceRecommendations: (
  input: ExportEC2InstanceRecommendationsRequest,
) => Effect.Effect<
  ExportEC2InstanceRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | LimitExceededException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportEC2InstanceRecommendationsRequest,
  output: ExportEC2InstanceRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Exports optimization recommendations for Amazon ECS services on Fargate.
 *
 * Recommendations are exported in a CSV file, and its metadata
 * in a JSON file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can only have one Amazon ECS service export job in progress per Amazon Web Services Region.
 */
export const exportECSServiceRecommendations: (
  input: ExportECSServiceRecommendationsRequest,
) => Effect.Effect<
  ExportECSServiceRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | LimitExceededException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportECSServiceRecommendationsRequest,
  output: ExportECSServiceRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Export optimization recommendations for your idle resources.
 *
 * Recommendations are exported in a comma-separated values (CSV) file, and its metadata
 * in a JavaScript Object Notation (JSON) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one idle resource export job in progress per Amazon Web Services Region.
 */
export const exportIdleRecommendations: (
  input: ExportIdleRecommendationsRequest,
) => Effect.Effect<
  ExportIdleRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | LimitExceededException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportIdleRecommendationsRequest,
  output: ExportIdleRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Exports optimization recommendations for Lambda functions.
 *
 * Recommendations are exported in a comma-separated values (.csv) file, and its metadata
 * in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one Lambda function export job in progress per Amazon Web Services Region.
 */
export const exportLambdaFunctionRecommendations: (
  input: ExportLambdaFunctionRecommendationsRequest,
) => Effect.Effect<
  ExportLambdaFunctionRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | LimitExceededException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportLambdaFunctionRecommendationsRequest,
  output: ExportLambdaFunctionRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Export optimization recommendations for your licenses.
 *
 * Recommendations are exported in a comma-separated values (CSV) file, and its metadata
 * in a JavaScript Object Notation (JSON) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one license export job in progress per Amazon Web Services Region.
 */
export const exportLicenseRecommendations: (
  input: ExportLicenseRecommendationsRequest,
) => Effect.Effect<
  ExportLicenseRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | LimitExceededException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportLicenseRecommendationsRequest,
  output: ExportLicenseRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Export optimization recommendations for your Amazon Aurora and Amazon Relational Database Service (Amazon RDS) databases.
 *
 * Recommendations are exported in a comma-separated values (CSV) file, and its metadata
 * in a JavaScript Object Notation (JSON) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting
 * Recommendations in the Compute Optimizer User
 * Guide.
 *
 * You can have only one Amazon Aurora or RDS export job in progress per Amazon Web Services Region.
 */
export const exportRDSDatabaseRecommendations: (
  input: ExportRDSDatabaseRecommendationsRequest,
) => Effect.Effect<
  ExportRDSDatabaseRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | LimitExceededException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportRDSDatabaseRecommendationsRequest,
  output: ExportRDSDatabaseRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns Lambda function recommendations.
 *
 * Compute Optimizer generates recommendations for functions that meet a specific set
 * of requirements. For more information, see the Supported resources and
 * requirements in the Compute Optimizer User
 * Guide.
 */
export const getLambdaFunctionRecommendations: {
  (
    input: GetLambdaFunctionRecommendationsRequest,
  ): Effect.Effect<
    GetLambdaFunctionRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | LimitExceededException
    | MissingAuthenticationToken
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetLambdaFunctionRecommendationsRequest,
  ) => Stream.Stream<
    GetLambdaFunctionRecommendationsResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | LimitExceededException
    | MissingAuthenticationToken
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetLambdaFunctionRecommendationsRequest,
  ) => Stream.Stream<
    LambdaFunctionRecommendation,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | LimitExceededException
    | MissingAuthenticationToken
    | OptInRequiredException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetLambdaFunctionRecommendationsRequest,
  output: GetLambdaFunctionRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    LimitExceededException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "lambdaFunctionRecommendations",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns Amazon Aurora and RDS database recommendations.
 *
 * Compute Optimizer generates recommendations for Amazon Aurora and RDS databases that
 * meet a specific set of requirements. For more
 * information, see the Supported resources and
 * requirements in the Compute Optimizer User
 * Guide.
 */
export const getRDSDatabaseRecommendations: (
  input: GetRDSDatabaseRecommendationsRequest,
) => Effect.Effect<
  GetRDSDatabaseRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRDSDatabaseRecommendationsRequest,
  output: GetRDSDatabaseRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns the projected metrics of Aurora and RDS database recommendations.
 */
export const getRDSDatabaseRecommendationProjectedMetrics: (
  input: GetRDSDatabaseRecommendationProjectedMetricsRequest,
) => Effect.Effect<
  GetRDSDatabaseRecommendationProjectedMetricsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetRDSDatabaseRecommendationProjectedMetricsRequest,
  output: GetRDSDatabaseRecommendationProjectedMetricsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns existing recommendation preferences, such as enhanced infrastructure
 * metrics.
 *
 * Use the `scope` parameter to specify which preferences to return. You can
 * specify to return preferences for an organization, a specific account ID, or a specific
 * EC2 instance or Amazon EC2 Auto Scaling group Amazon Resource Name (ARN).
 *
 * For more information, see Activating
 * enhanced infrastructure metrics in the Compute Optimizer User
 * Guide.
 */
export const getRecommendationPreferences: {
  (
    input: GetRecommendationPreferencesRequest,
  ): Effect.Effect<
    GetRecommendationPreferencesResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | MissingAuthenticationToken
    | OptInRequiredException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: GetRecommendationPreferencesRequest,
  ) => Stream.Stream<
    GetRecommendationPreferencesResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | MissingAuthenticationToken
    | OptInRequiredException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: GetRecommendationPreferencesRequest,
  ) => Stream.Stream<
    RecommendationPreferencesDetail,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | MissingAuthenticationToken
    | OptInRequiredException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: GetRecommendationPreferencesRequest,
  output: GetRecommendationPreferencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "recommendationPreferencesDetails",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a new recommendation preference or updates an existing recommendation
 * preference, such as enhanced infrastructure metrics.
 *
 * For more information, see Activating
 * enhanced infrastructure metrics in the Compute Optimizer User
 * Guide.
 */
export const putRecommendationPreferences: (
  input: PutRecommendationPreferencesRequest,
) => Effect.Effect<
  PutRecommendationPreferencesResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutRecommendationPreferencesRequest,
  output: PutRecommendationPreferencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Deletes a recommendation preference, such as enhanced infrastructure metrics.
 *
 * For more information, see Activating
 * enhanced infrastructure metrics in the Compute Optimizer User
 * Guide.
 */
export const deleteRecommendationPreferences: (
  input: DeleteRecommendationPreferencesRequest,
) => Effect.Effect<
  DeleteRecommendationPreferencesResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteRecommendationPreferencesRequest,
  output: DeleteRecommendationPreferencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns the recommendation preferences that are in effect for a given resource, such
 * as enhanced infrastructure metrics. Considers all applicable preferences that you might
 * have set at the resource, account, and organization level.
 *
 * When you create a recommendation preference, you can set its status to
 * `Active` or `Inactive`. Use this action to view the
 * recommendation preferences that are in effect, or `Active`.
 */
export const getEffectiveRecommendationPreferences: (
  input: GetEffectiveRecommendationPreferencesRequest,
) => Effect.Effect<
  GetEffectiveRecommendationPreferencesResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEffectiveRecommendationPreferencesRequest,
  output: GetEffectiveRecommendationPreferencesResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns the projected utilization metrics of Amazon EC2 instance
 * recommendations.
 *
 * The `Cpu` and `Memory` metrics are the only projected
 * utilization metrics returned when you run this action. Additionally, the
 * `Memory` metric is returned only for resources that have the unified
 * CloudWatch agent installed on them. For more information, see Enabling Memory Utilization with the CloudWatch Agent.
 */
export const getEC2RecommendationProjectedMetrics: (
  input: GetEC2RecommendationProjectedMetricsRequest,
) => Effect.Effect<
  GetEC2RecommendationProjectedMetricsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEC2RecommendationProjectedMetricsRequest,
  output: GetEC2RecommendationProjectedMetricsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns the projected metrics of Amazon ECS service recommendations.
 */
export const getECSServiceRecommendationProjectedMetrics: (
  input: GetECSServiceRecommendationProjectedMetricsRequest,
) => Effect.Effect<
  GetECSServiceRecommendationProjectedMetricsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetECSServiceRecommendationProjectedMetricsRequest,
  output: GetECSServiceRecommendationProjectedMetricsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Describes recommendation export jobs created in the last seven days.
 *
 * Use the ExportAutoScalingGroupRecommendations or ExportEC2InstanceRecommendations actions to request an export of your
 * recommendations. Then use the DescribeRecommendationExportJobs action
 * to view your export jobs.
 */
export const describeRecommendationExportJobs: {
  (
    input: DescribeRecommendationExportJobsRequest,
  ): Effect.Effect<
    DescribeRecommendationExportJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | MissingAuthenticationToken
    | OptInRequiredException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeRecommendationExportJobsRequest,
  ) => Stream.Stream<
    DescribeRecommendationExportJobsResponse,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | MissingAuthenticationToken
    | OptInRequiredException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeRecommendationExportJobsRequest,
  ) => Stream.Stream<
    RecommendationExportJob,
    | AccessDeniedException
    | InternalServerException
    | InvalidParameterValueException
    | MissingAuthenticationToken
    | OptInRequiredException
    | ResourceNotFoundException
    | ServiceUnavailableException
    | ThrottlingException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeRecommendationExportJobsRequest,
  output: DescribeRecommendationExportJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "recommendationExportJobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns Amazon EC2 Auto Scaling group recommendations.
 *
 * Compute Optimizer generates recommendations for Amazon EC2 Auto Scaling groups that
 * meet a specific set of requirements. For more information, see the Supported
 * resources and requirements in the Compute Optimizer User
 * Guide.
 */
export const getAutoScalingGroupRecommendations: (
  input: GetAutoScalingGroupRecommendationsRequest,
) => Effect.Effect<
  GetAutoScalingGroupRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetAutoScalingGroupRecommendationsRequest,
  output: GetAutoScalingGroupRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns Amazon Elastic Block Store (Amazon EBS) volume recommendations.
 *
 * Compute Optimizer generates recommendations for Amazon EBS volumes that
 * meet a specific set of requirements. For more information, see the Supported
 * resources and requirements in the Compute Optimizer User
 * Guide.
 */
export const getEBSVolumeRecommendations: (
  input: GetEBSVolumeRecommendationsRequest,
) => Effect.Effect<
  GetEBSVolumeRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEBSVolumeRecommendationsRequest,
  output: GetEBSVolumeRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns Amazon EC2 instance recommendations.
 *
 * Compute Optimizer generates recommendations for Amazon Elastic Compute Cloud (Amazon EC2) instances that meet a specific set of requirements. For more
 * information, see the Supported resources and
 * requirements in the Compute Optimizer User
 * Guide.
 */
export const getEC2InstanceRecommendations: (
  input: GetEC2InstanceRecommendationsRequest,
) => Effect.Effect<
  GetEC2InstanceRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetEC2InstanceRecommendationsRequest,
  output: GetEC2InstanceRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns Amazon ECS service recommendations.
 *
 * Compute Optimizer generates recommendations for Amazon ECS services on
 * Fargate that meet a specific set of requirements. For more
 * information, see the Supported resources and
 * requirements in the Compute Optimizer User
 * Guide.
 */
export const getECSServiceRecommendations: (
  input: GetECSServiceRecommendationsRequest,
) => Effect.Effect<
  GetECSServiceRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetECSServiceRecommendationsRequest,
  output: GetECSServiceRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
/**
 * Returns idle resource recommendations. Compute Optimizer generates recommendations for
 * idle resources that meet a specific set of requirements. For more information, see
 * Resource requirements in the
 * *Compute Optimizer User Guide*
 */
export const getIdleRecommendations: (
  input: GetIdleRecommendationsRequest,
) => Effect.Effect<
  GetIdleRecommendationsResponse,
  | AccessDeniedException
  | InternalServerException
  | InvalidParameterValueException
  | MissingAuthenticationToken
  | OptInRequiredException
  | ResourceNotFoundException
  | ServiceUnavailableException
  | ThrottlingException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetIdleRecommendationsRequest,
  output: GetIdleRecommendationsResponse,
  errors: [
    AccessDeniedException,
    InternalServerException,
    InvalidParameterValueException,
    MissingAuthenticationToken,
    OptInRequiredException,
    ResourceNotFoundException,
    ServiceUnavailableException,
    ThrottlingException,
  ],
}));
