import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "EMR Serverless",
  serviceShapeName: "AwsToledoWebService",
});
const auth = T.AwsAuthSigv4({ name: "emr-serverless" });
const ver = T.ServiceVersion("2021-07-13");
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
                        url: "https://emr-serverless-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://emr-serverless-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://emr-serverless.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://emr-serverless.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeyList = S.Array(S.String);
export const ApplicationStateSet = S.Array(S.String);
export const JobRunStateSet = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  {
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeyList.pipe(T.HttpQuery("tagKeys")),
  },
  T.all(
    T.Http({ method: "DELETE", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class GetApplicationRequest extends S.Class<GetApplicationRequest>(
  "GetApplicationRequest",
)(
  { applicationId: S.String.pipe(T.HttpLabel("applicationId")) },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{applicationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class WorkerResourceConfig extends S.Class<WorkerResourceConfig>(
  "WorkerResourceConfig",
)({
  cpu: S.String,
  memory: S.String,
  disk: S.optional(S.String),
  diskType: S.optional(S.String),
}) {}
export class InitialCapacityConfig extends S.Class<InitialCapacityConfig>(
  "InitialCapacityConfig",
)({
  workerCount: S.Number,
  workerConfiguration: S.optional(WorkerResourceConfig),
}) {}
export const InitialCapacityConfigMap = S.Record({
  key: S.String,
  value: InitialCapacityConfig,
});
export class MaximumAllowedResources extends S.Class<MaximumAllowedResources>(
  "MaximumAllowedResources",
)({ cpu: S.String, memory: S.String, disk: S.optional(S.String) }) {}
export class AutoStartConfig extends S.Class<AutoStartConfig>(
  "AutoStartConfig",
)({ enabled: S.optional(S.Boolean) }) {}
export class AutoStopConfig extends S.Class<AutoStopConfig>("AutoStopConfig")({
  enabled: S.optional(S.Boolean),
  idleTimeoutMinutes: S.optional(S.Number),
}) {}
export const SubnetIds = S.Array(S.String);
export const SecurityGroupIds = S.Array(S.String);
export class NetworkConfiguration extends S.Class<NetworkConfiguration>(
  "NetworkConfiguration",
)({
  subnetIds: S.optional(SubnetIds),
  securityGroupIds: S.optional(SecurityGroupIds),
}) {}
export class ImageConfigurationInput extends S.Class<ImageConfigurationInput>(
  "ImageConfigurationInput",
)({ imageUri: S.optional(S.String) }) {}
export class WorkerTypeSpecificationInput extends S.Class<WorkerTypeSpecificationInput>(
  "WorkerTypeSpecificationInput",
)({ imageConfiguration: S.optional(ImageConfigurationInput) }) {}
export const WorkerTypeSpecificationInputMap = S.Record({
  key: S.String,
  value: WorkerTypeSpecificationInput,
});
export class InteractiveConfiguration extends S.Class<InteractiveConfiguration>(
  "InteractiveConfiguration",
)({
  studioEnabled: S.optional(S.Boolean),
  livyEndpointEnabled: S.optional(S.Boolean),
}) {}
export type ConfigurationList = Configuration[];
export const ConfigurationList = S.Array(
  S.suspend((): S.Schema<Configuration, any> => Configuration),
) as any as S.Schema<ConfigurationList>;
export class S3MonitoringConfiguration extends S.Class<S3MonitoringConfiguration>(
  "S3MonitoringConfiguration",
)({ logUri: S.optional(S.String), encryptionKeyArn: S.optional(S.String) }) {}
export class ManagedPersistenceMonitoringConfiguration extends S.Class<ManagedPersistenceMonitoringConfiguration>(
  "ManagedPersistenceMonitoringConfiguration",
)({ enabled: S.optional(S.Boolean), encryptionKeyArn: S.optional(S.String) }) {}
export const LogTypeList = S.Array(S.String);
export const LogTypeMap = S.Record({ key: S.String, value: LogTypeList });
export class CloudWatchLoggingConfiguration extends S.Class<CloudWatchLoggingConfiguration>(
  "CloudWatchLoggingConfiguration",
)({
  enabled: S.Boolean,
  logGroupName: S.optional(S.String),
  logStreamNamePrefix: S.optional(S.String),
  encryptionKeyArn: S.optional(S.String),
  logTypes: S.optional(LogTypeMap),
}) {}
export class PrometheusMonitoringConfiguration extends S.Class<PrometheusMonitoringConfiguration>(
  "PrometheusMonitoringConfiguration",
)({ remoteWriteUrl: S.optional(S.String) }) {}
export class MonitoringConfiguration extends S.Class<MonitoringConfiguration>(
  "MonitoringConfiguration",
)({
  s3MonitoringConfiguration: S.optional(S3MonitoringConfiguration),
  managedPersistenceMonitoringConfiguration: S.optional(
    ManagedPersistenceMonitoringConfiguration,
  ),
  cloudWatchLoggingConfiguration: S.optional(CloudWatchLoggingConfiguration),
  prometheusMonitoringConfiguration: S.optional(
    PrometheusMonitoringConfiguration,
  ),
}) {}
export class SchedulerConfiguration extends S.Class<SchedulerConfiguration>(
  "SchedulerConfiguration",
)({
  queueTimeoutMinutes: S.optional(S.Number),
  maxConcurrentRuns: S.optional(S.Number),
}) {}
export class IdentityCenterConfigurationInput extends S.Class<IdentityCenterConfigurationInput>(
  "IdentityCenterConfigurationInput",
)({
  identityCenterInstanceArn: S.optional(S.String),
  userBackgroundSessionsEnabled: S.optional(S.Boolean),
}) {}
export class JobLevelCostAllocationConfiguration extends S.Class<JobLevelCostAllocationConfiguration>(
  "JobLevelCostAllocationConfiguration",
)({ enabled: S.optional(S.Boolean) }) {}
export class UpdateApplicationRequest extends S.Class<UpdateApplicationRequest>(
  "UpdateApplicationRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "PATCH", uri: "/applications/{applicationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationRequest extends S.Class<DeleteApplicationRequest>(
  "DeleteApplicationRequest",
)(
  { applicationId: S.String.pipe(T.HttpLabel("applicationId")) },
  T.all(
    T.Http({ method: "DELETE", uri: "/applications/{applicationId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DeleteApplicationResponse extends S.Class<DeleteApplicationResponse>(
  "DeleteApplicationResponse",
)({}) {}
export class ListApplicationsRequest extends S.Class<ListApplicationsRequest>(
  "ListApplicationsRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    states: S.optional(ApplicationStateSet).pipe(T.HttpQuery("states")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartApplicationRequest extends S.Class<StartApplicationRequest>(
  "StartApplicationRequest",
)(
  { applicationId: S.String.pipe(T.HttpLabel("applicationId")) },
  T.all(
    T.Http({ method: "POST", uri: "/applications/{applicationId}/start" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartApplicationResponse extends S.Class<StartApplicationResponse>(
  "StartApplicationResponse",
)({}) {}
export class StopApplicationRequest extends S.Class<StopApplicationRequest>(
  "StopApplicationRequest",
)(
  { applicationId: S.String.pipe(T.HttpLabel("applicationId")) },
  T.all(
    T.Http({ method: "POST", uri: "/applications/{applicationId}/stop" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StopApplicationResponse extends S.Class<StopApplicationResponse>(
  "StopApplicationResponse",
)({}) {}
export class GetJobRunRequest extends S.Class<GetJobRunRequest>(
  "GetJobRunRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    jobRunId: S.String.pipe(T.HttpLabel("jobRunId")),
    attempt: S.optional(S.Number).pipe(T.HttpQuery("attempt")),
  },
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
) {}
export class CancelJobRunRequest extends S.Class<CancelJobRunRequest>(
  "CancelJobRunRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    jobRunId: S.String.pipe(T.HttpLabel("jobRunId")),
    shutdownGracePeriodInSeconds: S.optional(S.Number).pipe(
      T.HttpQuery("shutdownGracePeriodInSeconds"),
    ),
  },
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
) {}
export class ListJobRunsRequest extends S.Class<ListJobRunsRequest>(
  "ListJobRunsRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "GET", uri: "/applications/{applicationId}/jobruns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetDashboardForJobRunRequest extends S.Class<GetDashboardForJobRunRequest>(
  "GetDashboardForJobRunRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    jobRunId: S.String.pipe(T.HttpLabel("jobRunId")),
    attempt: S.optional(S.Number).pipe(T.HttpQuery("attempt")),
    accessSystemProfileLogs: S.optional(S.Boolean).pipe(
      T.HttpQuery("accessSystemProfileLogs"),
    ),
  },
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
) {}
export class ListJobRunAttemptsRequest extends S.Class<ListJobRunAttemptsRequest>(
  "ListJobRunAttemptsRequest",
)(
  {
    applicationId: S.String.pipe(T.HttpLabel("applicationId")),
    jobRunId: S.String.pipe(T.HttpLabel("jobRunId")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
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
) {}
export const PolicyArnList = S.Array(S.String);
export const TagMap = S.Record({ key: S.String, value: S.String });
export class JobRunExecutionIamPolicy extends S.Class<JobRunExecutionIamPolicy>(
  "JobRunExecutionIamPolicy",
)({ policy: S.optional(S.String), policyArns: S.optional(PolicyArnList) }) {}
export class ConfigurationOverrides extends S.Class<ConfigurationOverrides>(
  "ConfigurationOverrides",
)({
  applicationConfiguration: S.optional(ConfigurationList),
  monitoringConfiguration: S.optional(MonitoringConfiguration),
}) {}
export class RetryPolicy extends S.Class<RetryPolicy>("RetryPolicy")({
  maxAttempts: S.optional(S.Number),
  maxFailedAttemptsPerHour: S.optional(S.Number),
}) {}
export const EntryPointArguments = S.Array(S.String);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagMap },
  T.all(
    T.Http({ method: "POST", uri: "/tags/{resourceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class ImageConfiguration extends S.Class<ImageConfiguration>(
  "ImageConfiguration",
)({ imageUri: S.String, resolvedImageDigest: S.optional(S.String) }) {}
export class WorkerTypeSpecification extends S.Class<WorkerTypeSpecification>(
  "WorkerTypeSpecification",
)({ imageConfiguration: S.optional(ImageConfiguration) }) {}
export const WorkerTypeSpecificationMap = S.Record({
  key: S.String,
  value: WorkerTypeSpecification,
});
export class IdentityCenterConfiguration extends S.Class<IdentityCenterConfiguration>(
  "IdentityCenterConfiguration",
)({
  identityCenterInstanceArn: S.optional(S.String),
  identityCenterApplicationArn: S.optional(S.String),
  userBackgroundSessionsEnabled: S.optional(S.Boolean),
}) {}
export class Application extends S.Class<Application>("Application")({
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
}) {}
export class UpdateApplicationResponse extends S.Class<UpdateApplicationResponse>(
  "UpdateApplicationResponse",
)({ application: Application }) {}
export class CancelJobRunResponse extends S.Class<CancelJobRunResponse>(
  "CancelJobRunResponse",
)({ applicationId: S.String, jobRunId: S.String }) {}
export class GetDashboardForJobRunResponse extends S.Class<GetDashboardForJobRunResponse>(
  "GetDashboardForJobRunResponse",
)({ url: S.optional(S.String) }) {}
export const SensitivePropertiesMap = S.Record({
  key: S.String,
  value: S.String,
});
export class SparkSubmit extends S.Class<SparkSubmit>("SparkSubmit")({
  entryPoint: S.String,
  entryPointArguments: S.optional(EntryPointArguments),
  sparkSubmitParameters: S.optional(S.String),
}) {}
export class Hive extends S.Class<Hive>("Hive")({
  query: S.String,
  initQueryFile: S.optional(S.String),
  parameters: S.optional(S.String),
}) {}
export class Configuration extends S.Class<Configuration>("Configuration")({
  classification: S.String,
  properties: S.optional(SensitivePropertiesMap),
  configurations: S.optional(S.suspend(() => ConfigurationList)),
}) {}
export class ApplicationSummary extends S.Class<ApplicationSummary>(
  "ApplicationSummary",
)({
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
}) {}
export const ApplicationList = S.Array(ApplicationSummary);
export const JobDriver = S.Union(
  S.Struct({ sparkSubmit: SparkSubmit }),
  S.Struct({ hive: Hive }),
);
export class JobRunSummary extends S.Class<JobRunSummary>("JobRunSummary")({
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
  attemptCreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  attemptUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const JobRuns = S.Array(JobRunSummary);
export class JobRunAttemptSummary extends S.Class<JobRunAttemptSummary>(
  "JobRunAttemptSummary",
)({
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
}) {}
export const JobRunAttempts = S.Array(JobRunAttemptSummary);
export class ListApplicationsResponse extends S.Class<ListApplicationsResponse>(
  "ListApplicationsResponse",
)({ applications: ApplicationList, nextToken: S.optional(S.String) }) {}
export class StartJobRunRequest extends S.Class<StartJobRunRequest>(
  "StartJobRunRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/applications/{applicationId}/jobruns" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListJobRunsResponse extends S.Class<ListJobRunsResponse>(
  "ListJobRunsResponse",
)({ jobRuns: JobRuns, nextToken: S.optional(S.String) }) {}
export class ListJobRunAttemptsResponse extends S.Class<ListJobRunAttemptsResponse>(
  "ListJobRunAttemptsResponse",
)({ jobRunAttempts: JobRunAttempts, nextToken: S.optional(S.String) }) {}
export class TotalResourceUtilization extends S.Class<TotalResourceUtilization>(
  "TotalResourceUtilization",
)({
  vCPUHour: S.optional(S.Number),
  memoryGBHour: S.optional(S.Number),
  storageGBHour: S.optional(S.Number),
}) {}
export class ResourceUtilization extends S.Class<ResourceUtilization>(
  "ResourceUtilization",
)({
  vCPUHour: S.optional(S.Number),
  memoryGBHour: S.optional(S.Number),
  storageGBHour: S.optional(S.Number),
}) {}
export class JobRun extends S.Class<JobRun>("JobRun")({
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
  attemptCreatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  attemptUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  queuedDurationMilliseconds: S.optional(S.Number),
}) {}
export class CreateApplicationRequest extends S.Class<CreateApplicationRequest>(
  "CreateApplicationRequest",
)(
  {
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/applications" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class StartJobRunResponse extends S.Class<StartJobRunResponse>(
  "StartJobRunResponse",
)({ applicationId: S.String, jobRunId: S.String, arn: S.String }) {}
export class GetJobRunResponse extends S.Class<GetJobRunResponse>(
  "GetJobRunResponse",
)({ jobRun: JobRun }) {}
export class CreateApplicationResponse extends S.Class<CreateApplicationResponse>(
  "CreateApplicationResponse",
)({ applicationId: S.String, name: S.optional(S.String), arn: S.String }) {}
export class GetApplicationResponse extends S.Class<GetApplicationResponse>(
  "GetApplicationResponse",
)({ application: Application }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String },
) {}

//# Operations
/**
 * Removes tags from resources.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listApplications = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListApplicationsRequest,
    output: ListApplicationsResponse,
    errors: [InternalServerException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "applications",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists job runs based on a set of parameters.
 */
export const listJobRuns = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListJobRunsRequest,
    output: ListJobRunsResponse,
    errors: [InternalServerException, ValidationException],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "jobRuns",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Lists all attempt of a job run.
 */
export const listJobRunAttempts = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Updates a specified application. An application has to be in a stopped or created state in order to be updated.
 */
export const updateApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDashboardForJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: GetDashboardForJobRunRequest,
    output: GetDashboardForJobRunResponse,
    errors: [
      InternalServerException,
      ResourceNotFoundException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes an application. An application has to be in a stopped or created state in order to be deleted.
 */
export const deleteApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const stopApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const startJobRun = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createApplication = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateApplicationRequest,
  output: CreateApplicationResponse,
  errors: [
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
