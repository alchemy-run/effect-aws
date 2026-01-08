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
  sdkId: "EMR Serverless",
  serviceShapeName: "AwsToledoWebService",
});
const auth = T.AwsAuthSigv4({ name: "emr-serverless" });
const ver = T.ServiceVersion("2021-07-13");
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
              `https://emr-serverless-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://emr-serverless-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://emr-serverless.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://emr-serverless.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type ResourceArn = string;
export type TagKey = string;
export type ApplicationName = string;
export type ReleaseLabel = string;
export type EngineType = string;
export type ClientToken = string;
export type Architecture = string;
export type ApplicationId = string;
export type NextToken = string;
export type ApplicationState = string;
export type IAMRoleArn = string;
export type Duration = number;
export type String256 = string;
export type JobRunMode = string;
export type JobRunId = string;
export type AttemptNumber = number;
export type ShutdownGracePeriodInSeconds = number;
export type JobRunState = string;
export type TagValue = string;
export type WorkerTypeString = string;
export type CpuSize = string;
export type MemorySize = string;
export type DiskSize = string;
export type SubnetString = string;
export type SecurityGroupString = string;
export type ImageUri = string;
export type String1024 = string;
export type IdentityCenterInstanceArn = string;
export type PolicyDocument = string;
export type Arn = string;
export type Url = string;
export type WorkerCounts = number;
export type ConfigurationPropertyKey = string;
export type ConfigurationPropertyValue = string;
export type UriString = string;
export type EncryptionKeyArn = string;
export type LogGroupName = string;
export type LogStreamNamePrefix = string;
export type PrometheusUrlString = string;
export type EntryPointPath = string | Redacted.Redacted<string>;
export type EntryPointArgument = string | Redacted.Redacted<string>;
export type SparkSubmitParameters = string | Redacted.Redacted<string>;
export type Query = string | Redacted.Redacted<string>;
export type InitScriptPath = string | Redacted.Redacted<string>;
export type HiveCliParameters = string | Redacted.Redacted<string>;
export type ApplicationArn = string;
export type JobArn = string;
export type RequestIdentityUserArn = string;
export type JobRunType = string;
export type DiskType = string;
export type LogTypeString = string;
export type ImageDigest = string;
export type IdentityCenterApplicationArn = string;

//# Schemas
export type TagKeyList = string[];
export const TagKeyList = S.Array(S.String);
export type ApplicationStateSet = string[];
export const ApplicationStateSet = S.Array(S.String);
export type JobRunStateSet = string[];
export const JobRunStateSet = S.Array(S.String);
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeyList;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface GetApplicationRequest {
  applicationId: string;
}
export const GetApplicationRequest = S.suspend(() =>
  S.Struct({ applicationId: S.String.pipe(T.HttpLabel("applicationId")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications/{applicationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetApplicationRequest",
}) as any as S.Schema<GetApplicationRequest>;
export interface WorkerResourceConfig {
  cpu: string;
  memory: string;
  disk?: string;
  diskType?: string;
}
export const WorkerResourceConfig = S.suspend(() =>
  S.Struct({
    cpu: S.String,
    memory: S.String,
    disk: S.optional(S.String),
    diskType: S.optional(S.String),
  }),
).annotations({
  identifier: "WorkerResourceConfig",
}) as any as S.Schema<WorkerResourceConfig>;
export interface InitialCapacityConfig {
  workerCount: number;
  workerConfiguration?: WorkerResourceConfig;
}
export const InitialCapacityConfig = S.suspend(() =>
  S.Struct({
    workerCount: S.Number,
    workerConfiguration: S.optional(WorkerResourceConfig),
  }),
).annotations({
  identifier: "InitialCapacityConfig",
}) as any as S.Schema<InitialCapacityConfig>;
export type InitialCapacityConfigMap = { [key: string]: InitialCapacityConfig };
export const InitialCapacityConfigMap = S.Record({
  key: S.String,
  value: InitialCapacityConfig,
});
export interface MaximumAllowedResources {
  cpu: string;
  memory: string;
  disk?: string;
}
export const MaximumAllowedResources = S.suspend(() =>
  S.Struct({ cpu: S.String, memory: S.String, disk: S.optional(S.String) }),
).annotations({
  identifier: "MaximumAllowedResources",
}) as any as S.Schema<MaximumAllowedResources>;
export interface AutoStartConfig {
  enabled?: boolean;
}
export const AutoStartConfig = S.suspend(() =>
  S.Struct({ enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "AutoStartConfig",
}) as any as S.Schema<AutoStartConfig>;
export interface AutoStopConfig {
  enabled?: boolean;
  idleTimeoutMinutes?: number;
}
export const AutoStopConfig = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    idleTimeoutMinutes: S.optional(S.Number),
  }),
).annotations({
  identifier: "AutoStopConfig",
}) as any as S.Schema<AutoStopConfig>;
export type SubnetIds = string[];
export const SubnetIds = S.Array(S.String);
export type SecurityGroupIds = string[];
export const SecurityGroupIds = S.Array(S.String);
export interface NetworkConfiguration {
  subnetIds?: SubnetIds;
  securityGroupIds?: SecurityGroupIds;
}
export const NetworkConfiguration = S.suspend(() =>
  S.Struct({
    subnetIds: S.optional(SubnetIds),
    securityGroupIds: S.optional(SecurityGroupIds),
  }),
).annotations({
  identifier: "NetworkConfiguration",
}) as any as S.Schema<NetworkConfiguration>;
export interface ImageConfigurationInput {
  imageUri?: string;
}
export const ImageConfigurationInput = S.suspend(() =>
  S.Struct({ imageUri: S.optional(S.String) }),
).annotations({
  identifier: "ImageConfigurationInput",
}) as any as S.Schema<ImageConfigurationInput>;
export interface WorkerTypeSpecificationInput {
  imageConfiguration?: ImageConfigurationInput;
}
export const WorkerTypeSpecificationInput = S.suspend(() =>
  S.Struct({ imageConfiguration: S.optional(ImageConfigurationInput) }),
).annotations({
  identifier: "WorkerTypeSpecificationInput",
}) as any as S.Schema<WorkerTypeSpecificationInput>;
export type WorkerTypeSpecificationInputMap = {
  [key: string]: WorkerTypeSpecificationInput;
};
export const WorkerTypeSpecificationInputMap = S.Record({
  key: S.String,
  value: WorkerTypeSpecificationInput,
});
export interface InteractiveConfiguration {
  studioEnabled?: boolean;
  livyEndpointEnabled?: boolean;
}
export const InteractiveConfiguration = S.suspend(() =>
  S.Struct({
    studioEnabled: S.optional(S.Boolean),
    livyEndpointEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "InteractiveConfiguration",
}) as any as S.Schema<InteractiveConfiguration>;
export type ConfigurationList = Configuration[];
export const ConfigurationList = S.Array(
  S.suspend((): S.Schema<Configuration, any> => Configuration).annotations({
    identifier: "Configuration",
  }),
) as any as S.Schema<ConfigurationList>;
export interface S3MonitoringConfiguration {
  logUri?: string;
  encryptionKeyArn?: string;
}
export const S3MonitoringConfiguration = S.suspend(() =>
  S.Struct({
    logUri: S.optional(S.String),
    encryptionKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "S3MonitoringConfiguration",
}) as any as S.Schema<S3MonitoringConfiguration>;
export interface ManagedPersistenceMonitoringConfiguration {
  enabled?: boolean;
  encryptionKeyArn?: string;
}
export const ManagedPersistenceMonitoringConfiguration = S.suspend(() =>
  S.Struct({
    enabled: S.optional(S.Boolean),
    encryptionKeyArn: S.optional(S.String),
  }),
).annotations({
  identifier: "ManagedPersistenceMonitoringConfiguration",
}) as any as S.Schema<ManagedPersistenceMonitoringConfiguration>;
export type LogTypeList = string[];
export const LogTypeList = S.Array(S.String);
export type LogTypeMap = { [key: string]: LogTypeList };
export const LogTypeMap = S.Record({ key: S.String, value: LogTypeList });
export interface CloudWatchLoggingConfiguration {
  enabled: boolean;
  logGroupName?: string;
  logStreamNamePrefix?: string;
  encryptionKeyArn?: string;
  logTypes?: LogTypeMap;
}
export const CloudWatchLoggingConfiguration = S.suspend(() =>
  S.Struct({
    enabled: S.Boolean,
    logGroupName: S.optional(S.String),
    logStreamNamePrefix: S.optional(S.String),
    encryptionKeyArn: S.optional(S.String),
    logTypes: S.optional(LogTypeMap),
  }),
).annotations({
  identifier: "CloudWatchLoggingConfiguration",
}) as any as S.Schema<CloudWatchLoggingConfiguration>;
export interface PrometheusMonitoringConfiguration {
  remoteWriteUrl?: string;
}
export const PrometheusMonitoringConfiguration = S.suspend(() =>
  S.Struct({ remoteWriteUrl: S.optional(S.String) }),
).annotations({
  identifier: "PrometheusMonitoringConfiguration",
}) as any as S.Schema<PrometheusMonitoringConfiguration>;
export interface MonitoringConfiguration {
  s3MonitoringConfiguration?: S3MonitoringConfiguration;
  managedPersistenceMonitoringConfiguration?: ManagedPersistenceMonitoringConfiguration;
  cloudWatchLoggingConfiguration?: CloudWatchLoggingConfiguration;
  prometheusMonitoringConfiguration?: PrometheusMonitoringConfiguration;
}
export const MonitoringConfiguration = S.suspend(() =>
  S.Struct({
    s3MonitoringConfiguration: S.optional(S3MonitoringConfiguration),
    managedPersistenceMonitoringConfiguration: S.optional(
      ManagedPersistenceMonitoringConfiguration,
    ),
    cloudWatchLoggingConfiguration: S.optional(CloudWatchLoggingConfiguration),
    prometheusMonitoringConfiguration: S.optional(
      PrometheusMonitoringConfiguration,
    ),
  }),
).annotations({
  identifier: "MonitoringConfiguration",
}) as any as S.Schema<MonitoringConfiguration>;
export interface SchedulerConfiguration {
  queueTimeoutMinutes?: number;
  maxConcurrentRuns?: number;
}
export const SchedulerConfiguration = S.suspend(() =>
  S.Struct({
    queueTimeoutMinutes: S.optional(S.Number),
    maxConcurrentRuns: S.optional(S.Number),
  }),
).annotations({
  identifier: "SchedulerConfiguration",
}) as any as S.Schema<SchedulerConfiguration>;
export interface IdentityCenterConfigurationInput {
  identityCenterInstanceArn?: string;
  userBackgroundSessionsEnabled?: boolean;
}
export const IdentityCenterConfigurationInput = S.suspend(() =>
  S.Struct({
    identityCenterInstanceArn: S.optional(S.String),
    userBackgroundSessionsEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "IdentityCenterConfigurationInput",
}) as any as S.Schema<IdentityCenterConfigurationInput>;
export interface JobLevelCostAllocationConfiguration {
  enabled?: boolean;
}
export const JobLevelCostAllocationConfiguration = S.suspend(() =>
  S.Struct({ enabled: S.optional(S.Boolean) }),
).annotations({
  identifier: "JobLevelCostAllocationConfiguration",
}) as any as S.Schema<JobLevelCostAllocationConfiguration>;
export interface UpdateApplicationRequest {
  applicationId: string;
  clientToken: string;
  initialCapacity?: InitialCapacityConfigMap;
  maximumCapacity?: MaximumAllowedResources;
  autoStartConfiguration?: AutoStartConfig;
  autoStopConfiguration?: AutoStopConfig;
  networkConfiguration?: NetworkConfiguration;
  architecture?: string;
  imageConfiguration?: ImageConfigurationInput;
  workerTypeSpecifications?: WorkerTypeSpecificationInputMap;
  interactiveConfiguration?: InteractiveConfiguration;
  releaseLabel?: string;
  runtimeConfiguration?: ConfigurationList;
  monitoringConfiguration?: MonitoringConfiguration;
  schedulerConfiguration?: SchedulerConfiguration;
  identityCenterConfiguration?: IdentityCenterConfigurationInput;
  jobLevelCostAllocationConfiguration?: JobLevelCostAllocationConfiguration;
}
export const UpdateApplicationRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    clientToken: S.String,
    initialCapacity: S.optional(InitialCapacityConfigMap),
    maximumCapacity: S.optional(MaximumAllowedResources),
    autoStartConfiguration: S.optional(AutoStartConfig),
    autoStopConfiguration: S.optional(AutoStopConfig),
    networkConfiguration: S.optional(NetworkConfiguration),
    architecture: S.optional(S.String),
    imageConfiguration: S.optional(ImageConfigurationInput),
    workerTypeSpecifications: S.optional(WorkerTypeSpecificationInputMap),
    interactiveConfiguration: S.optional(InteractiveConfiguration),
    releaseLabel: S.optional(S.String),
    runtimeConfiguration: S.optional(ConfigurationList),
    monitoringConfiguration: S.optional(MonitoringConfiguration),
    schedulerConfiguration: S.optional(SchedulerConfiguration),
    identityCenterConfiguration: S.optional(IdentityCenterConfigurationInput),
    jobLevelCostAllocationConfiguration: S.optional(
      JobLevelCostAllocationConfiguration,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "PATCH", uri: "/applications/{applicationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateApplicationRequest",
}) as any as S.Schema<UpdateApplicationRequest>;
export interface DeleteApplicationRequest {
  applicationId: string;
}
export const DeleteApplicationRequest = S.suspend(() =>
  S.Struct({ applicationId: S.String.pipe(T.HttpLabel("applicationId")) }).pipe(
    T.all(
      T.Http({ method: "DELETE", uri: "/applications/{applicationId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteApplicationRequest",
}) as any as S.Schema<DeleteApplicationRequest>;
export interface DeleteApplicationResponse {}
export const DeleteApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteApplicationResponse",
}) as any as S.Schema<DeleteApplicationResponse>;
export interface ListApplicationsRequest {
  nextToken?: string;
  maxResults?: number;
  states?: ApplicationStateSet;
}
export const ListApplicationsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    states: S.optional(ApplicationStateSet).pipe(T.HttpQuery("states")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListApplicationsRequest",
}) as any as S.Schema<ListApplicationsRequest>;
export interface StartApplicationRequest {
  applicationId: string;
}
export const StartApplicationRequest = S.suspend(() =>
  S.Struct({ applicationId: S.String.pipe(T.HttpLabel("applicationId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications/{applicationId}/start" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartApplicationRequest",
}) as any as S.Schema<StartApplicationRequest>;
export interface StartApplicationResponse {}
export const StartApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StartApplicationResponse",
}) as any as S.Schema<StartApplicationResponse>;
export interface StopApplicationRequest {
  applicationId: string;
}
export const StopApplicationRequest = S.suspend(() =>
  S.Struct({ applicationId: S.String.pipe(T.HttpLabel("applicationId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications/{applicationId}/stop" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StopApplicationRequest",
}) as any as S.Schema<StopApplicationRequest>;
export interface StopApplicationResponse {}
export const StopApplicationResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "StopApplicationResponse",
}) as any as S.Schema<StopApplicationResponse>;
export interface GetJobRunRequest {
  applicationId: string;
  jobRunId: string;
  attempt?: number;
}
export const GetJobRunRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    jobRunId: S.String.pipe(T.HttpLabel("jobRunId")),
    attempt: S.optional(S.Number).pipe(T.HttpQuery("attempt")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/jobruns/{jobRunId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetJobRunRequest",
}) as any as S.Schema<GetJobRunRequest>;
export interface CancelJobRunRequest {
  applicationId: string;
  jobRunId: string;
  shutdownGracePeriodInSeconds?: number;
}
export const CancelJobRunRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    jobRunId: S.String.pipe(T.HttpLabel("jobRunId")),
    shutdownGracePeriodInSeconds: S.optional(S.Number).pipe(
      T.HttpQuery("shutdownGracePeriodInSeconds"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/applications/{applicationId}/jobruns/{jobRunId}",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelJobRunRequest",
}) as any as S.Schema<CancelJobRunRequest>;
export interface ListJobRunsRequest {
  applicationId: string;
  nextToken?: string;
  maxResults?: number;
  createdAtAfter?: Date;
  createdAtBefore?: Date;
  states?: JobRunStateSet;
  mode?: string;
}
export const ListJobRunsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    createdAtAfter: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("createdAtAfter")),
    createdAtBefore: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ).pipe(T.HttpQuery("createdAtBefore")),
    states: S.optional(JobRunStateSet).pipe(T.HttpQuery("states")),
    mode: S.optional(S.String).pipe(T.HttpQuery("mode")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/applications/{applicationId}/jobruns" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobRunsRequest",
}) as any as S.Schema<ListJobRunsRequest>;
export interface GetDashboardForJobRunRequest {
  applicationId: string;
  jobRunId: string;
  attempt?: number;
  accessSystemProfileLogs?: boolean;
}
export const GetDashboardForJobRunRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    jobRunId: S.String.pipe(T.HttpLabel("jobRunId")),
    attempt: S.optional(S.Number).pipe(T.HttpQuery("attempt")),
    accessSystemProfileLogs: S.optional(S.Boolean).pipe(
      T.HttpQuery("accessSystemProfileLogs"),
    ),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/jobruns/{jobRunId}/dashboard",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDashboardForJobRunRequest",
}) as any as S.Schema<GetDashboardForJobRunRequest>;
export interface ListJobRunAttemptsRequest {
  applicationId: string;
  jobRunId: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListJobRunAttemptsRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    jobRunId: S.String.pipe(T.HttpLabel("jobRunId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(
      T.Http({
        method: "GET",
        uri: "/applications/{applicationId}/jobruns/{jobRunId}/attempts",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListJobRunAttemptsRequest",
}) as any as S.Schema<ListJobRunAttemptsRequest>;
export type PolicyArnList = string[];
export const PolicyArnList = S.Array(S.String);
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export interface JobRunExecutionIamPolicy {
  policy?: string;
  policyArns?: PolicyArnList;
}
export const JobRunExecutionIamPolicy = S.suspend(() =>
  S.Struct({
    policy: S.optional(S.String),
    policyArns: S.optional(PolicyArnList),
  }),
).annotations({
  identifier: "JobRunExecutionIamPolicy",
}) as any as S.Schema<JobRunExecutionIamPolicy>;
export interface ConfigurationOverrides {
  applicationConfiguration?: ConfigurationList;
  monitoringConfiguration?: MonitoringConfiguration;
}
export const ConfigurationOverrides = S.suspend(() =>
  S.Struct({
    applicationConfiguration: S.optional(ConfigurationList),
    monitoringConfiguration: S.optional(MonitoringConfiguration),
  }),
).annotations({
  identifier: "ConfigurationOverrides",
}) as any as S.Schema<ConfigurationOverrides>;
export interface RetryPolicy {
  maxAttempts?: number;
  maxFailedAttemptsPerHour?: number;
}
export const RetryPolicy = S.suspend(() =>
  S.Struct({
    maxAttempts: S.optional(S.Number),
    maxFailedAttemptsPerHour: S.optional(S.Number),
  }),
).annotations({ identifier: "RetryPolicy" }) as any as S.Schema<RetryPolicy>;
export type EntryPointArguments = string | Redacted.Redacted<string>[];
export const EntryPointArguments = S.Array(SensitiveString);
export interface ListTagsForResourceResponse {
  tags?: TagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: TagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagMap,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface ImageConfiguration {
  imageUri: string;
  resolvedImageDigest?: string;
}
export const ImageConfiguration = S.suspend(() =>
  S.Struct({ imageUri: S.String, resolvedImageDigest: S.optional(S.String) }),
).annotations({
  identifier: "ImageConfiguration",
}) as any as S.Schema<ImageConfiguration>;
export interface WorkerTypeSpecification {
  imageConfiguration?: ImageConfiguration;
}
export const WorkerTypeSpecification = S.suspend(() =>
  S.Struct({ imageConfiguration: S.optional(ImageConfiguration) }),
).annotations({
  identifier: "WorkerTypeSpecification",
}) as any as S.Schema<WorkerTypeSpecification>;
export type WorkerTypeSpecificationMap = {
  [key: string]: WorkerTypeSpecification;
};
export const WorkerTypeSpecificationMap = S.Record({
  key: S.String,
  value: WorkerTypeSpecification,
});
export interface IdentityCenterConfiguration {
  identityCenterInstanceArn?: string;
  identityCenterApplicationArn?: string;
  userBackgroundSessionsEnabled?: boolean;
}
export const IdentityCenterConfiguration = S.suspend(() =>
  S.Struct({
    identityCenterInstanceArn: S.optional(S.String),
    identityCenterApplicationArn: S.optional(S.String),
    userBackgroundSessionsEnabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "IdentityCenterConfiguration",
}) as any as S.Schema<IdentityCenterConfiguration>;
export interface Application {
  applicationId: string;
  name?: string;
  arn: string;
  releaseLabel: string;
  type: string;
  state: string;
  stateDetails?: string;
  initialCapacity?: InitialCapacityConfigMap;
  maximumCapacity?: MaximumAllowedResources;
  createdAt: Date;
  updatedAt: Date;
  tags?: TagMap;
  autoStartConfiguration?: AutoStartConfig;
  autoStopConfiguration?: AutoStopConfig;
  networkConfiguration?: NetworkConfiguration;
  architecture?: string;
  imageConfiguration?: ImageConfiguration;
  workerTypeSpecifications?: WorkerTypeSpecificationMap;
  runtimeConfiguration?: ConfigurationList;
  monitoringConfiguration?: MonitoringConfiguration;
  interactiveConfiguration?: InteractiveConfiguration;
  schedulerConfiguration?: SchedulerConfiguration;
  identityCenterConfiguration?: IdentityCenterConfiguration;
  jobLevelCostAllocationConfiguration?: JobLevelCostAllocationConfiguration;
}
export const Application = S.suspend(() =>
  S.Struct({
    applicationId: S.String,
    name: S.optional(S.String),
    arn: S.String,
    releaseLabel: S.String,
    type: S.String,
    state: S.String,
    stateDetails: S.optional(S.String),
    initialCapacity: S.optional(InitialCapacityConfigMap),
    maximumCapacity: S.optional(MaximumAllowedResources),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    tags: S.optional(TagMap),
    autoStartConfiguration: S.optional(AutoStartConfig),
    autoStopConfiguration: S.optional(AutoStopConfig),
    networkConfiguration: S.optional(NetworkConfiguration),
    architecture: S.optional(S.String),
    imageConfiguration: S.optional(ImageConfiguration),
    workerTypeSpecifications: S.optional(WorkerTypeSpecificationMap),
    runtimeConfiguration: S.optional(ConfigurationList),
    monitoringConfiguration: S.optional(MonitoringConfiguration),
    interactiveConfiguration: S.optional(InteractiveConfiguration),
    schedulerConfiguration: S.optional(SchedulerConfiguration),
    identityCenterConfiguration: S.optional(IdentityCenterConfiguration),
    jobLevelCostAllocationConfiguration: S.optional(
      JobLevelCostAllocationConfiguration,
    ),
  }),
).annotations({ identifier: "Application" }) as any as S.Schema<Application>;
export interface UpdateApplicationResponse {
  application: Application;
}
export const UpdateApplicationResponse = S.suspend(() =>
  S.Struct({ application: Application }),
).annotations({
  identifier: "UpdateApplicationResponse",
}) as any as S.Schema<UpdateApplicationResponse>;
export interface CancelJobRunResponse {
  applicationId: string;
  jobRunId: string;
}
export const CancelJobRunResponse = S.suspend(() =>
  S.Struct({ applicationId: S.String, jobRunId: S.String }),
).annotations({
  identifier: "CancelJobRunResponse",
}) as any as S.Schema<CancelJobRunResponse>;
export interface GetDashboardForJobRunResponse {
  url?: string;
}
export const GetDashboardForJobRunResponse = S.suspend(() =>
  S.Struct({ url: S.optional(S.String) }),
).annotations({
  identifier: "GetDashboardForJobRunResponse",
}) as any as S.Schema<GetDashboardForJobRunResponse>;
export type SensitivePropertiesMap = { [key: string]: string };
export const SensitivePropertiesMap = S.Record({
  key: S.String,
  value: S.String,
});
export interface SparkSubmit {
  entryPoint: string | Redacted.Redacted<string>;
  entryPointArguments?: EntryPointArguments;
  sparkSubmitParameters?: string | Redacted.Redacted<string>;
}
export const SparkSubmit = S.suspend(() =>
  S.Struct({
    entryPoint: SensitiveString,
    entryPointArguments: S.optional(EntryPointArguments),
    sparkSubmitParameters: S.optional(SensitiveString),
  }),
).annotations({ identifier: "SparkSubmit" }) as any as S.Schema<SparkSubmit>;
export interface Hive {
  query: string | Redacted.Redacted<string>;
  initQueryFile?: string | Redacted.Redacted<string>;
  parameters?: string | Redacted.Redacted<string>;
}
export const Hive = S.suspend(() =>
  S.Struct({
    query: SensitiveString,
    initQueryFile: S.optional(SensitiveString),
    parameters: S.optional(SensitiveString),
  }),
).annotations({ identifier: "Hive" }) as any as S.Schema<Hive>;
export interface Configuration {
  classification: string;
  properties?: SensitivePropertiesMap;
  configurations?: ConfigurationList;
}
export const Configuration = S.suspend(() =>
  S.Struct({
    classification: S.String,
    properties: S.optional(SensitivePropertiesMap),
    configurations: S.optional(
      S.suspend(() => ConfigurationList).annotations({
        identifier: "ConfigurationList",
      }),
    ),
  }),
).annotations({
  identifier: "Configuration",
}) as any as S.Schema<Configuration>;
export interface ApplicationSummary {
  id: string;
  name?: string;
  arn: string;
  releaseLabel: string;
  type: string;
  state: string;
  stateDetails?: string;
  createdAt: Date;
  updatedAt: Date;
  architecture?: string;
}
export const ApplicationSummary = S.suspend(() =>
  S.Struct({
    id: S.String,
    name: S.optional(S.String),
    arn: S.String,
    releaseLabel: S.String,
    type: S.String,
    state: S.String,
    stateDetails: S.optional(S.String),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    architecture: S.optional(S.String),
  }),
).annotations({
  identifier: "ApplicationSummary",
}) as any as S.Schema<ApplicationSummary>;
export type ApplicationList = ApplicationSummary[];
export const ApplicationList = S.Array(ApplicationSummary);
export type JobDriver = { sparkSubmit: SparkSubmit } | { hive: Hive };
export const JobDriver = S.Union(
  S.Struct({ sparkSubmit: SparkSubmit }),
  S.Struct({ hive: Hive }),
);
export interface JobRunSummary {
  applicationId: string;
  id: string;
  name?: string;
  mode?: string;
  arn: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  executionRole: string;
  state: string;
  stateDetails: string;
  releaseLabel: string;
  type?: string;
  attempt?: number;
  attemptCreatedAt?: Date;
  attemptUpdatedAt?: Date;
}
export const JobRunSummary = S.suspend(() =>
  S.Struct({
    applicationId: S.String,
    id: S.String,
    name: S.optional(S.String),
    mode: S.optional(S.String),
    arn: S.String,
    createdBy: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    executionRole: S.String,
    state: S.String,
    stateDetails: S.String,
    releaseLabel: S.String,
    type: S.optional(S.String),
    attempt: S.optional(S.Number),
    attemptCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    attemptUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  }),
).annotations({
  identifier: "JobRunSummary",
}) as any as S.Schema<JobRunSummary>;
export type JobRuns = JobRunSummary[];
export const JobRuns = S.Array(JobRunSummary);
export interface JobRunAttemptSummary {
  applicationId: string;
  id: string;
  name?: string;
  mode?: string;
  arn: string;
  createdBy: string;
  jobCreatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  executionRole: string;
  state: string;
  stateDetails: string;
  releaseLabel: string;
  type?: string;
  attempt?: number;
}
export const JobRunAttemptSummary = S.suspend(() =>
  S.Struct({
    applicationId: S.String,
    id: S.String,
    name: S.optional(S.String),
    mode: S.optional(S.String),
    arn: S.String,
    createdBy: S.String,
    jobCreatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    executionRole: S.String,
    state: S.String,
    stateDetails: S.String,
    releaseLabel: S.String,
    type: S.optional(S.String),
    attempt: S.optional(S.Number),
  }),
).annotations({
  identifier: "JobRunAttemptSummary",
}) as any as S.Schema<JobRunAttemptSummary>;
export type JobRunAttempts = JobRunAttemptSummary[];
export const JobRunAttempts = S.Array(JobRunAttemptSummary);
export interface ListApplicationsResponse {
  applications: ApplicationList;
  nextToken?: string;
}
export const ListApplicationsResponse = S.suspend(() =>
  S.Struct({ applications: ApplicationList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListApplicationsResponse",
}) as any as S.Schema<ListApplicationsResponse>;
export interface StartJobRunRequest {
  applicationId: string;
  clientToken: string;
  executionRoleArn: string;
  executionIamPolicy?: JobRunExecutionIamPolicy;
  jobDriver?: (typeof JobDriver)["Type"];
  configurationOverrides?: ConfigurationOverrides;
  tags?: TagMap;
  executionTimeoutMinutes?: number;
  name?: string;
  mode?: string;
  retryPolicy?: RetryPolicy;
}
export const StartJobRunRequest = S.suspend(() =>
  S.Struct({
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    clientToken: S.String,
    executionRoleArn: S.String,
    executionIamPolicy: S.optional(JobRunExecutionIamPolicy),
    jobDriver: S.optional(JobDriver),
    configurationOverrides: S.optional(ConfigurationOverrides),
    tags: S.optional(TagMap),
    executionTimeoutMinutes: S.optional(S.Number),
    name: S.optional(S.String),
    mode: S.optional(S.String),
    retryPolicy: S.optional(RetryPolicy),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications/{applicationId}/jobruns" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartJobRunRequest",
}) as any as S.Schema<StartJobRunRequest>;
export interface ListJobRunsResponse {
  jobRuns: JobRuns;
  nextToken?: string;
}
export const ListJobRunsResponse = S.suspend(() =>
  S.Struct({ jobRuns: JobRuns, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListJobRunsResponse",
}) as any as S.Schema<ListJobRunsResponse>;
export interface ListJobRunAttemptsResponse {
  jobRunAttempts: JobRunAttempts;
  nextToken?: string;
}
export const ListJobRunAttemptsResponse = S.suspend(() =>
  S.Struct({ jobRunAttempts: JobRunAttempts, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListJobRunAttemptsResponse",
}) as any as S.Schema<ListJobRunAttemptsResponse>;
export interface TotalResourceUtilization {
  vCPUHour?: number;
  memoryGBHour?: number;
  storageGBHour?: number;
}
export const TotalResourceUtilization = S.suspend(() =>
  S.Struct({
    vCPUHour: S.optional(S.Number),
    memoryGBHour: S.optional(S.Number),
    storageGBHour: S.optional(S.Number),
  }),
).annotations({
  identifier: "TotalResourceUtilization",
}) as any as S.Schema<TotalResourceUtilization>;
export interface ResourceUtilization {
  vCPUHour?: number;
  memoryGBHour?: number;
  storageGBHour?: number;
}
export const ResourceUtilization = S.suspend(() =>
  S.Struct({
    vCPUHour: S.optional(S.Number),
    memoryGBHour: S.optional(S.Number),
    storageGBHour: S.optional(S.Number),
  }),
).annotations({
  identifier: "ResourceUtilization",
}) as any as S.Schema<ResourceUtilization>;
export interface JobRun {
  applicationId: string;
  jobRunId: string;
  name?: string;
  arn: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  executionRole: string;
  executionIamPolicy?: JobRunExecutionIamPolicy;
  state: string;
  stateDetails: string;
  releaseLabel: string;
  configurationOverrides?: ConfigurationOverrides;
  jobDriver: (typeof JobDriver)["Type"];
  tags?: TagMap;
  totalResourceUtilization?: TotalResourceUtilization;
  networkConfiguration?: NetworkConfiguration;
  totalExecutionDurationSeconds?: number;
  executionTimeoutMinutes?: number;
  billedResourceUtilization?: ResourceUtilization;
  mode?: string;
  retryPolicy?: RetryPolicy;
  attempt?: number;
  attemptCreatedAt?: Date;
  attemptUpdatedAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  queuedDurationMilliseconds?: number;
}
export const JobRun = S.suspend(() =>
  S.Struct({
    applicationId: S.String,
    jobRunId: S.String,
    name: S.optional(S.String),
    arn: S.String,
    createdBy: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    executionRole: S.String,
    executionIamPolicy: S.optional(JobRunExecutionIamPolicy),
    state: S.String,
    stateDetails: S.String,
    releaseLabel: S.String,
    configurationOverrides: S.optional(ConfigurationOverrides),
    jobDriver: JobDriver,
    tags: S.optional(TagMap),
    totalResourceUtilization: S.optional(TotalResourceUtilization),
    networkConfiguration: S.optional(NetworkConfiguration),
    totalExecutionDurationSeconds: S.optional(S.Number),
    executionTimeoutMinutes: S.optional(S.Number),
    billedResourceUtilization: S.optional(ResourceUtilization),
    mode: S.optional(S.String),
    retryPolicy: S.optional(RetryPolicy),
    attempt: S.optional(S.Number),
    attemptCreatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    attemptUpdatedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    queuedDurationMilliseconds: S.optional(S.Number),
  }),
).annotations({ identifier: "JobRun" }) as any as S.Schema<JobRun>;
export interface CreateApplicationRequest {
  name?: string;
  releaseLabel: string;
  type: string;
  clientToken: string;
  initialCapacity?: InitialCapacityConfigMap;
  maximumCapacity?: MaximumAllowedResources;
  tags?: TagMap;
  autoStartConfiguration?: AutoStartConfig;
  autoStopConfiguration?: AutoStopConfig;
  networkConfiguration?: NetworkConfiguration;
  architecture?: string;
  imageConfiguration?: ImageConfigurationInput;
  workerTypeSpecifications?: WorkerTypeSpecificationInputMap;
  runtimeConfiguration?: ConfigurationList;
  monitoringConfiguration?: MonitoringConfiguration;
  interactiveConfiguration?: InteractiveConfiguration;
  schedulerConfiguration?: SchedulerConfiguration;
  identityCenterConfiguration?: IdentityCenterConfigurationInput;
  jobLevelCostAllocationConfiguration?: JobLevelCostAllocationConfiguration;
}
export const CreateApplicationRequest = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    releaseLabel: S.String,
    type: S.String,
    clientToken: S.String,
    initialCapacity: S.optional(InitialCapacityConfigMap),
    maximumCapacity: S.optional(MaximumAllowedResources),
    tags: S.optional(TagMap),
    autoStartConfiguration: S.optional(AutoStartConfig),
    autoStopConfiguration: S.optional(AutoStopConfig),
    networkConfiguration: S.optional(NetworkConfiguration),
    architecture: S.optional(S.String),
    imageConfiguration: S.optional(ImageConfigurationInput),
    workerTypeSpecifications: S.optional(WorkerTypeSpecificationInputMap),
    runtimeConfiguration: S.optional(ConfigurationList),
    monitoringConfiguration: S.optional(MonitoringConfiguration),
    interactiveConfiguration: S.optional(InteractiveConfiguration),
    schedulerConfiguration: S.optional(SchedulerConfiguration),
    identityCenterConfiguration: S.optional(IdentityCenterConfigurationInput),
    jobLevelCostAllocationConfiguration: S.optional(
      JobLevelCostAllocationConfiguration,
    ),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/applications" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateApplicationRequest",
}) as any as S.Schema<CreateApplicationRequest>;
export interface StartJobRunResponse {
  applicationId: string;
  jobRunId: string;
  arn: string;
}
export const StartJobRunResponse = S.suspend(() =>
  S.Struct({ applicationId: S.String, jobRunId: S.String, arn: S.String }),
).annotations({
  identifier: "StartJobRunResponse",
}) as any as S.Schema<StartJobRunResponse>;
export interface GetJobRunResponse {
  jobRun: JobRun;
}
export const GetJobRunResponse = S.suspend(() =>
  S.Struct({ jobRun: JobRun }),
).annotations({
  identifier: "GetJobRunResponse",
}) as any as S.Schema<GetJobRunResponse>;
export interface CreateApplicationResponse {
  applicationId: string;
  name?: string;
  arn: string;
}
export const CreateApplicationResponse = S.suspend(() =>
  S.Struct({
    applicationId: S.String,
    name: S.optional(S.String),
    arn: S.String,
  }),
).annotations({
  identifier: "CreateApplicationResponse",
}) as any as S.Schema<CreateApplicationResponse>;
export interface GetApplicationResponse {
  application: Application;
}
export const GetApplicationResponse = S.suspend(() =>
  S.Struct({ application: Application }),
).annotations({
  identifier: "GetApplicationResponse",
}) as any as S.Schema<GetApplicationResponse>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(C.withServerError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
).pipe(C.withConflictError) {}

//# Operations
/**
 * Removes tags from resources.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Displays detailed information about a job run.
 */
export const getJobRun: (
  input: GetJobRunRequest,
) => Effect.Effect<
  GetJobRunResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRunRequest,
  output: GetJobRunResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Starts a specified application and initializes initial capacity if configured.
 */
export const startApplication: (
  input: StartApplicationRequest,
) => Effect.Effect<
  StartApplicationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartApplicationRequest,
  output: StartApplicationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ValidationException,
  ],
}));
/**
 * Lists applications based on a set of parameters.
 */
export const listApplications: {
  (
    input: ListApplicationsRequest,
  ): Effect.Effect<
    ListApplicationsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListApplicationsRequest,
  ) => Stream.Stream<
    ListApplicationsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListApplicationsRequest,
  ) => Stream.Stream<
    ApplicationSummary,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListApplicationsRequest,
  output: ListApplicationsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "applications",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists job runs based on a set of parameters.
 */
export const listJobRuns: {
  (
    input: ListJobRunsRequest,
  ): Effect.Effect<
    ListJobRunsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobRunsRequest,
  ) => Stream.Stream<
    ListJobRunsResponse,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobRunsRequest,
  ) => Stream.Stream<
    JobRunSummary,
    InternalServerException | ValidationException | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobRunsRequest,
  output: ListJobRunsResponse,
  errors: [InternalServerException, ValidationException],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobRuns",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Lists all attempt of a job run.
 */
export const listJobRunAttempts: {
  (
    input: ListJobRunAttemptsRequest,
  ): Effect.Effect<
    ListJobRunAttemptsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListJobRunAttemptsRequest,
  ) => Stream.Stream<
    ListJobRunAttemptsResponse,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListJobRunAttemptsRequest,
  ) => Stream.Stream<
    JobRunAttemptSummary,
    | InternalServerException
    | ResourceNotFoundException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListJobRunAttemptsRequest,
  output: ListJobRunAttemptsResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobRunAttempts",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Updates a specified application. An application has to be in a stopped or created state in order to be updated.
 */
export const updateApplication: (
  input: UpdateApplicationRequest,
) => Effect.Effect<
  UpdateApplicationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateApplicationRequest,
  output: UpdateApplicationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Cancels a job run.
 */
export const cancelJobRun: (
  input: CancelJobRunRequest,
) => Effect.Effect<
  CancelJobRunResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobRunRequest,
  output: CancelJobRunResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates and returns a URL that you can use to access the application UIs for a job run.
 *
 * For jobs in a running state, the application UI is a live user interface such as the Spark or Tez web UI. For completed jobs, the application UI is a persistent application user interface such as the Spark History Server or persistent Tez UI.
 *
 * The URL is valid for one hour after you generate it. To access the application UI after that hour elapses, you must invoke the API again to generate a new URL.
 */
export const getDashboardForJobRun: (
  input: GetDashboardForJobRunRequest,
) => Effect.Effect<
  GetDashboardForJobRunResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDashboardForJobRunRequest,
  output: GetDashboardForJobRunResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Deletes an application. An application has to be in a stopped or created state in order to be deleted.
 */
export const deleteApplication: (
  input: DeleteApplicationRequest,
) => Effect.Effect<
  DeleteApplicationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteApplicationRequest,
  output: DeleteApplicationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Stops a specified application and releases initial capacity if configured. All scheduled and running jobs must be completed or cancelled before stopping an application.
 */
export const stopApplication: (
  input: StopApplicationRequest,
) => Effect.Effect<
  StopApplicationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopApplicationRequest,
  output: StopApplicationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Lists the tags assigned to the resources.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Assigns tags to resources. A tag is a label that you assign to an Amazon Web Services resource. Each tag consists of a key and an optional value, both of which you define. Tags enable you to categorize your Amazon Web Services resources by attributes such as purpose, owner, or environment. When you have many resources of the same type, you can quickly identify a specific resource based on the tags you've assigned to it.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Displays detailed information about a specified application.
 */
export const getApplication: (
  input: GetApplicationRequest,
) => Effect.Effect<
  GetApplicationResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetApplicationRequest,
  output: GetApplicationResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Starts a job run.
 */
export const startJobRun: (
  input: StartJobRunRequest,
) => Effect.Effect<
  StartJobRunResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartJobRunRequest,
  output: StartJobRunResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Creates an application.
 */
export const createApplication: (
  input: CreateApplicationRequest,
) => Effect.Effect<
  CreateApplicationResponse,
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
