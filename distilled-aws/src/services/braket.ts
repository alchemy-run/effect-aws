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
const svc = T.AwsApiService({ sdkId: "Braket", serviceShapeName: "Braket" });
const auth = T.AwsAuthSigv4({ name: "braket" });
const ver = T.ServiceVersion("2019-09-01");
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
              `https://braket-fips.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "FIPS and DualStack are enabled, but this partition does not support one or both",
          );
        }
        if (UseFIPS === true) {
          if (_.getAttr(PartitionResult, "supportsFIPS") === true) {
            return e(
              `https://braket-fips.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
            );
          }
          return err(
            "FIPS is enabled but this partition does not support FIPS",
          );
        }
        if (UseDualStack === true) {
          if (true === _.getAttr(PartitionResult, "supportsDualStack")) {
            return e(
              `https://braket.${Region}.${_.getAttr(PartitionResult, "dualStackDnsSuffix")}`,
            );
          }
          return err(
            "DualStack is enabled but this partition does not support DualStack",
          );
        }
        return e(
          `https://braket.${Region}.${_.getAttr(PartitionResult, "dnsSuffix")}`,
        );
      }
    }
  }
  return err("Invalid Configuration: Missing Region");
});

//# Newtypes
export type DeviceArn = string;
export type String64 = string;
export type RoleArn = string;
export type JobArn = string;
export type HybridJobAdditionalAttributeName = string;
export type JsonValue = string;
export type JobToken = string;
export type QuantumTaskArn = string;
export type QuantumTaskAdditionalAttributeName = string;
export type SpendingLimitArn = string;
export type String256 = string;
export type String2048 = string;
export type S3Path = string;
export type String4096 = string;
export type InstanceType = string;
export type BraketResourceArn = string;
export type AssociationType = string;
export type SearchJobsFilterOperator = string;
export type ExperimentalCapabilitiesEnablementType = string;
export type SearchQuantumTasksFilterOperator = string;
export type SearchSpendingLimitsFilterOperator = string;
export type DeviceType = string;
export type DeviceStatus = string;
export type JobPrimaryStatus = string;
export type String1024 = string;
export type CancellationStatus = string;
export type QuantumTaskStatus = string;
export type CompressionType = string;
export type Uri = string;
export type QueueName = string;
export type QueuePriority = string;
export type JobEventType = string;
export type ValidationExceptionReason = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type HybridJobAdditionalAttributeNamesList = string[];
export const HybridJobAdditionalAttributeNamesList = S.Array(S.String);
export type QuantumTaskAdditionalAttributeNamesList = string[];
export const QuantumTaskAdditionalAttributeNamesList = S.Array(S.String);
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
  tagKeys: string[];
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export interface GetDeviceRequest {
  deviceArn: string;
}
export const GetDeviceRequest = S.suspend(() =>
  S.Struct({ deviceArn: S.String.pipe(T.HttpLabel("deviceArn")) }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/device/{deviceArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetDeviceRequest",
}) as any as S.Schema<GetDeviceRequest>;
export interface GetJobRequest {
  jobArn: string;
  additionalAttributeNames?: string[];
}
export const GetJobRequest = S.suspend(() =>
  S.Struct({
    jobArn: S.String.pipe(T.HttpLabel("jobArn")),
    additionalAttributeNames: S.optional(
      HybridJobAdditionalAttributeNamesList,
    ).pipe(T.HttpQuery("additionalAttributeNames")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/job/{jobArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetJobRequest",
}) as any as S.Schema<GetJobRequest>;
export interface CancelJobRequest {
  jobArn: string;
}
export const CancelJobRequest = S.suspend(() =>
  S.Struct({ jobArn: S.String.pipe(T.HttpLabel("jobArn")) }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/job/{jobArn}/cancel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelJobRequest",
}) as any as S.Schema<CancelJobRequest>;
export interface GetQuantumTaskRequest {
  quantumTaskArn: string;
  additionalAttributeNames?: string[];
}
export const GetQuantumTaskRequest = S.suspend(() =>
  S.Struct({
    quantumTaskArn: S.String.pipe(T.HttpLabel("quantumTaskArn")),
    additionalAttributeNames: S.optional(
      QuantumTaskAdditionalAttributeNamesList,
    ).pipe(T.HttpQuery("additionalAttributeNames")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/quantum-task/{quantumTaskArn}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "GetQuantumTaskRequest",
}) as any as S.Schema<GetQuantumTaskRequest>;
export interface CancelQuantumTaskRequest {
  quantumTaskArn: string;
  clientToken: string;
}
export const CancelQuantumTaskRequest = S.suspend(() =>
  S.Struct({
    quantumTaskArn: S.String.pipe(T.HttpLabel("quantumTaskArn")),
    clientToken: S.String.pipe(T.IdempotencyToken()),
  }).pipe(
    T.all(
      T.Http({ method: "PUT", uri: "/quantum-task/{quantumTaskArn}/cancel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelQuantumTaskRequest",
}) as any as S.Schema<CancelQuantumTaskRequest>;
export interface TimePeriod {
  startAt: Date;
  endAt: Date;
}
export const TimePeriod = S.suspend(() =>
  S.Struct({
    startAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    endAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  }),
).annotations({ identifier: "TimePeriod" }) as any as S.Schema<TimePeriod>;
export interface UpdateSpendingLimitRequest {
  spendingLimitArn: string;
  clientToken: string;
  spendingLimit?: string;
  timePeriod?: TimePeriod;
}
export const UpdateSpendingLimitRequest = S.suspend(() =>
  S.Struct({
    spendingLimitArn: S.String.pipe(T.HttpLabel("spendingLimitArn")),
    clientToken: S.String.pipe(T.IdempotencyToken()),
    spendingLimit: S.optional(S.String),
    timePeriod: S.optional(TimePeriod),
  }).pipe(
    T.all(
      T.Http({
        method: "PATCH",
        uri: "/spending-limit/{spendingLimitArn}/update",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "UpdateSpendingLimitRequest",
}) as any as S.Schema<UpdateSpendingLimitRequest>;
export interface UpdateSpendingLimitResponse {}
export const UpdateSpendingLimitResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "UpdateSpendingLimitResponse",
}) as any as S.Schema<UpdateSpendingLimitResponse>;
export interface DeleteSpendingLimitRequest {
  spendingLimitArn: string;
}
export const DeleteSpendingLimitRequest = S.suspend(() =>
  S.Struct({
    spendingLimitArn: S.String.pipe(T.HttpLabel("spendingLimitArn")),
  }).pipe(
    T.all(
      T.Http({
        method: "DELETE",
        uri: "/spending-limit/{spendingLimitArn}/delete",
      }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSpendingLimitRequest",
}) as any as S.Schema<DeleteSpendingLimitRequest>;
export interface DeleteSpendingLimitResponse {}
export const DeleteSpendingLimitResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteSpendingLimitResponse",
}) as any as S.Schema<DeleteSpendingLimitResponse>;
export type String256List = string[];
export const String256List = S.Array(S.String);
export type TagsMap = { [key: string]: string | undefined };
export const TagsMap = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface SearchDevicesFilter {
  name: string;
  values: string[];
}
export const SearchDevicesFilter = S.suspend(() =>
  S.Struct({ name: S.String, values: String256List }),
).annotations({
  identifier: "SearchDevicesFilter",
}) as any as S.Schema<SearchDevicesFilter>;
export type SearchDevicesFilterList = SearchDevicesFilter[];
export const SearchDevicesFilterList = S.Array(SearchDevicesFilter);
export interface JobOutputDataConfig {
  kmsKeyId?: string;
  s3Path: string;
}
export const JobOutputDataConfig = S.suspend(() =>
  S.Struct({ kmsKeyId: S.optional(S.String), s3Path: S.String }),
).annotations({
  identifier: "JobOutputDataConfig",
}) as any as S.Schema<JobOutputDataConfig>;
export interface JobCheckpointConfig {
  localPath?: string;
  s3Uri: string;
}
export const JobCheckpointConfig = S.suspend(() =>
  S.Struct({ localPath: S.optional(S.String), s3Uri: S.String }),
).annotations({
  identifier: "JobCheckpointConfig",
}) as any as S.Schema<JobCheckpointConfig>;
export interface JobStoppingCondition {
  maxRuntimeInSeconds?: number;
}
export const JobStoppingCondition = S.suspend(() =>
  S.Struct({ maxRuntimeInSeconds: S.optional(S.Number) }),
).annotations({
  identifier: "JobStoppingCondition",
}) as any as S.Schema<JobStoppingCondition>;
export interface InstanceConfig {
  instanceType: string;
  volumeSizeInGb: number;
  instanceCount?: number;
}
export const InstanceConfig = S.suspend(() =>
  S.Struct({
    instanceType: S.String,
    volumeSizeInGb: S.Number,
    instanceCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "InstanceConfig",
}) as any as S.Schema<InstanceConfig>;
export type HyperParameters = { [key: string]: string | undefined };
export const HyperParameters = S.Record({
  key: S.String,
  value: S.UndefinedOr(S.String),
});
export interface DeviceConfig {
  device: string;
}
export const DeviceConfig = S.suspend(() =>
  S.Struct({ device: S.String }),
).annotations({ identifier: "DeviceConfig" }) as any as S.Schema<DeviceConfig>;
export interface Association {
  arn: string;
  type: string;
}
export const Association = S.suspend(() =>
  S.Struct({ arn: S.String, type: S.String }),
).annotations({ identifier: "Association" }) as any as S.Schema<Association>;
export type Associations = Association[];
export const Associations = S.Array(Association);
export interface SearchJobsFilter {
  name: string;
  values: string[];
  operator: string;
}
export const SearchJobsFilter = S.suspend(() =>
  S.Struct({ name: S.String, values: String256List, operator: S.String }),
).annotations({
  identifier: "SearchJobsFilter",
}) as any as S.Schema<SearchJobsFilter>;
export type SearchJobsFilterList = SearchJobsFilter[];
export const SearchJobsFilterList = S.Array(SearchJobsFilter);
export type ExperimentalCapabilities = { enabled: string };
export const ExperimentalCapabilities = S.Union(
  S.Struct({ enabled: S.String }),
);
export interface SearchQuantumTasksFilter {
  name: string;
  values: string[];
  operator: string;
}
export const SearchQuantumTasksFilter = S.suspend(() =>
  S.Struct({ name: S.String, values: String256List, operator: S.String }),
).annotations({
  identifier: "SearchQuantumTasksFilter",
}) as any as S.Schema<SearchQuantumTasksFilter>;
export type SearchQuantumTasksFilterList = SearchQuantumTasksFilter[];
export const SearchQuantumTasksFilterList = S.Array(SearchQuantumTasksFilter);
export interface SearchSpendingLimitsFilter {
  name: string;
  values: string[];
  operator: string;
}
export const SearchSpendingLimitsFilter = S.suspend(() =>
  S.Struct({ name: S.String, values: String256List, operator: S.String }),
).annotations({
  identifier: "SearchSpendingLimitsFilter",
}) as any as S.Schema<SearchSpendingLimitsFilter>;
export type SearchSpendingLimitsFilterList = SearchSpendingLimitsFilter[];
export const SearchSpendingLimitsFilterList = S.Array(
  SearchSpendingLimitsFilter,
);
export interface ListTagsForResourceResponse {
  tags?: { [key: string]: string | undefined };
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(TagsMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: { [key: string]: string | undefined };
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tags: TagsMap,
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
export interface SearchDevicesRequest {
  nextToken?: string;
  maxResults?: number;
  filters: SearchDevicesFilter[];
}
export const SearchDevicesRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: SearchDevicesFilterList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/devices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchDevicesRequest",
}) as any as S.Schema<SearchDevicesRequest>;
export interface CancelJobResponse {
  jobArn: string;
  cancellationStatus: string;
}
export const CancelJobResponse = S.suspend(() =>
  S.Struct({ jobArn: S.String, cancellationStatus: S.String }),
).annotations({
  identifier: "CancelJobResponse",
}) as any as S.Schema<CancelJobResponse>;
export interface SearchJobsRequest {
  nextToken?: string;
  maxResults?: number;
  filters: SearchJobsFilter[];
}
export const SearchJobsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: SearchJobsFilterList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/jobs" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchJobsRequest",
}) as any as S.Schema<SearchJobsRequest>;
export interface CreateQuantumTaskRequest {
  clientToken: string;
  deviceArn: string;
  deviceParameters?: string;
  shots: number;
  outputS3Bucket: string;
  outputS3KeyPrefix: string;
  action: string;
  tags?: { [key: string]: string | undefined };
  jobToken?: string;
  associations?: Association[];
  experimentalCapabilities?: ExperimentalCapabilities;
}
export const CreateQuantumTaskRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String.pipe(T.IdempotencyToken()),
    deviceArn: S.String,
    deviceParameters: S.optional(S.String),
    shots: S.Number,
    outputS3Bucket: S.String,
    outputS3KeyPrefix: S.String,
    action: S.String,
    tags: S.optional(TagsMap),
    jobToken: S.optional(S.String),
    associations: S.optional(Associations),
    experimentalCapabilities: S.optional(ExperimentalCapabilities),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/quantum-task" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateQuantumTaskRequest",
}) as any as S.Schema<CreateQuantumTaskRequest>;
export interface CancelQuantumTaskResponse {
  quantumTaskArn: string;
  cancellationStatus: string;
}
export const CancelQuantumTaskResponse = S.suspend(() =>
  S.Struct({ quantumTaskArn: S.String, cancellationStatus: S.String }),
).annotations({
  identifier: "CancelQuantumTaskResponse",
}) as any as S.Schema<CancelQuantumTaskResponse>;
export interface SearchQuantumTasksRequest {
  nextToken?: string;
  maxResults?: number;
  filters: SearchQuantumTasksFilter[];
}
export const SearchQuantumTasksRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: SearchQuantumTasksFilterList,
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/quantum-tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchQuantumTasksRequest",
}) as any as S.Schema<SearchQuantumTasksRequest>;
export interface CreateSpendingLimitRequest {
  clientToken: string;
  deviceArn: string;
  spendingLimit: string;
  timePeriod?: TimePeriod;
  tags?: { [key: string]: string | undefined };
}
export const CreateSpendingLimitRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String.pipe(T.IdempotencyToken()),
    deviceArn: S.String,
    spendingLimit: S.String,
    timePeriod: S.optional(TimePeriod),
    tags: S.optional(TagsMap),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/spending-limit" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSpendingLimitRequest",
}) as any as S.Schema<CreateSpendingLimitRequest>;
export interface SearchSpendingLimitsRequest {
  nextToken?: string;
  maxResults?: number;
  filters?: SearchSpendingLimitsFilter[];
}
export const SearchSpendingLimitsRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(SearchSpendingLimitsFilterList),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/spending-limits" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "SearchSpendingLimitsRequest",
}) as any as S.Schema<SearchSpendingLimitsRequest>;
export interface ScriptModeConfig {
  entryPoint: string;
  s3Uri: string;
  compressionType?: string;
}
export const ScriptModeConfig = S.suspend(() =>
  S.Struct({
    entryPoint: S.String,
    s3Uri: S.String,
    compressionType: S.optional(S.String),
  }),
).annotations({
  identifier: "ScriptModeConfig",
}) as any as S.Schema<ScriptModeConfig>;
export interface ContainerImage {
  uri: string;
}
export const ContainerImage = S.suspend(() =>
  S.Struct({ uri: S.String }),
).annotations({
  identifier: "ContainerImage",
}) as any as S.Schema<ContainerImage>;
export interface DeviceQueueInfo {
  queue: string;
  queueSize: string;
  queuePriority?: string;
}
export const DeviceQueueInfo = S.suspend(() =>
  S.Struct({
    queue: S.String,
    queueSize: S.String,
    queuePriority: S.optional(S.String),
  }),
).annotations({
  identifier: "DeviceQueueInfo",
}) as any as S.Schema<DeviceQueueInfo>;
export type DeviceQueueInfoList = DeviceQueueInfo[];
export const DeviceQueueInfoList = S.Array(DeviceQueueInfo);
export interface AlgorithmSpecification {
  scriptModeConfig?: ScriptModeConfig;
  containerImage?: ContainerImage;
}
export const AlgorithmSpecification = S.suspend(() =>
  S.Struct({
    scriptModeConfig: S.optional(ScriptModeConfig),
    containerImage: S.optional(ContainerImage),
  }),
).annotations({
  identifier: "AlgorithmSpecification",
}) as any as S.Schema<AlgorithmSpecification>;
export interface JobEventDetails {
  eventType?: string;
  timeOfEvent?: Date;
  message?: string;
}
export const JobEventDetails = S.suspend(() =>
  S.Struct({
    eventType: S.optional(S.String),
    timeOfEvent: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "JobEventDetails",
}) as any as S.Schema<JobEventDetails>;
export type JobEvents = JobEventDetails[];
export const JobEvents = S.Array(JobEventDetails);
export interface HybridJobQueueInfo {
  queue: string;
  position: string;
  message?: string;
}
export const HybridJobQueueInfo = S.suspend(() =>
  S.Struct({
    queue: S.String,
    position: S.String,
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "HybridJobQueueInfo",
}) as any as S.Schema<HybridJobQueueInfo>;
export interface QuantumTaskQueueInfo {
  queue: string;
  position: string;
  queuePriority?: string;
  message?: string;
}
export const QuantumTaskQueueInfo = S.suspend(() =>
  S.Struct({
    queue: S.String,
    position: S.String,
    queuePriority: S.optional(S.String),
    message: S.optional(S.String),
  }),
).annotations({
  identifier: "QuantumTaskQueueInfo",
}) as any as S.Schema<QuantumTaskQueueInfo>;
export interface ActionMetadata {
  actionType: string;
  programCount?: number;
  executableCount?: number;
}
export const ActionMetadata = S.suspend(() =>
  S.Struct({
    actionType: S.String,
    programCount: S.optional(S.Number),
    executableCount: S.optional(S.Number),
  }),
).annotations({
  identifier: "ActionMetadata",
}) as any as S.Schema<ActionMetadata>;
export interface S3DataSource {
  s3Uri: string;
}
export const S3DataSource = S.suspend(() =>
  S.Struct({ s3Uri: S.String }),
).annotations({ identifier: "S3DataSource" }) as any as S.Schema<S3DataSource>;
export interface GetDeviceResponse {
  deviceArn: string;
  deviceName: string;
  providerName: string;
  deviceType: string;
  deviceStatus: string;
  deviceCapabilities: string;
  deviceQueueInfo?: DeviceQueueInfo[];
}
export const GetDeviceResponse = S.suspend(() =>
  S.Struct({
    deviceArn: S.String,
    deviceName: S.String,
    providerName: S.String,
    deviceType: S.String,
    deviceStatus: S.String,
    deviceCapabilities: S.String,
    deviceQueueInfo: S.optional(DeviceQueueInfoList),
  }),
).annotations({
  identifier: "GetDeviceResponse",
}) as any as S.Schema<GetDeviceResponse>;
export interface DataSource {
  s3DataSource: S3DataSource;
}
export const DataSource = S.suspend(() =>
  S.Struct({ s3DataSource: S3DataSource }),
).annotations({ identifier: "DataSource" }) as any as S.Schema<DataSource>;
export interface InputFileConfig {
  channelName: string;
  contentType?: string;
  dataSource: DataSource;
}
export const InputFileConfig = S.suspend(() =>
  S.Struct({
    channelName: S.String,
    contentType: S.optional(S.String),
    dataSource: DataSource,
  }),
).annotations({
  identifier: "InputFileConfig",
}) as any as S.Schema<InputFileConfig>;
export type InputConfigList = InputFileConfig[];
export const InputConfigList = S.Array(InputFileConfig);
export interface GetJobResponse {
  status: string;
  jobArn: string;
  roleArn: string;
  failureReason?: string;
  jobName: string;
  hyperParameters?: { [key: string]: string | undefined };
  inputDataConfig?: InputFileConfig[];
  outputDataConfig: JobOutputDataConfig;
  stoppingCondition?: JobStoppingCondition;
  checkpointConfig?: JobCheckpointConfig;
  algorithmSpecification: AlgorithmSpecification;
  instanceConfig: InstanceConfig;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  billableDuration?: number;
  deviceConfig?: DeviceConfig;
  events?: JobEventDetails[];
  tags?: { [key: string]: string | undefined };
  queueInfo?: HybridJobQueueInfo;
  associations?: Association[];
}
export const GetJobResponse = S.suspend(() =>
  S.Struct({
    status: S.String,
    jobArn: S.String,
    roleArn: S.String,
    failureReason: S.optional(S.String),
    jobName: S.String,
    hyperParameters: S.optional(HyperParameters),
    inputDataConfig: S.optional(InputConfigList),
    outputDataConfig: JobOutputDataConfig,
    stoppingCondition: S.optional(JobStoppingCondition),
    checkpointConfig: S.optional(JobCheckpointConfig),
    algorithmSpecification: AlgorithmSpecification,
    instanceConfig: InstanceConfig,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    billableDuration: S.optional(S.Number),
    deviceConfig: S.optional(DeviceConfig),
    events: S.optional(JobEvents),
    tags: S.optional(TagsMap),
    queueInfo: S.optional(HybridJobQueueInfo),
    associations: S.optional(Associations),
  }),
).annotations({
  identifier: "GetJobResponse",
}) as any as S.Schema<GetJobResponse>;
export interface CreateQuantumTaskResponse {
  quantumTaskArn: string;
}
export const CreateQuantumTaskResponse = S.suspend(() =>
  S.Struct({ quantumTaskArn: S.String }),
).annotations({
  identifier: "CreateQuantumTaskResponse",
}) as any as S.Schema<CreateQuantumTaskResponse>;
export interface GetQuantumTaskResponse {
  quantumTaskArn: string;
  status: string;
  failureReason?: string;
  deviceArn: string;
  deviceParameters: string;
  shots: number;
  outputS3Bucket: string;
  outputS3Directory: string;
  createdAt: Date;
  endedAt?: Date;
  tags?: { [key: string]: string | undefined };
  jobArn?: string;
  queueInfo?: QuantumTaskQueueInfo;
  associations?: Association[];
  numSuccessfulShots?: number;
  actionMetadata?: ActionMetadata;
  experimentalCapabilities?: ExperimentalCapabilities;
}
export const GetQuantumTaskResponse = S.suspend(() =>
  S.Struct({
    quantumTaskArn: S.String,
    status: S.String,
    failureReason: S.optional(S.String),
    deviceArn: S.String,
    deviceParameters: S.String,
    shots: S.Number,
    outputS3Bucket: S.String,
    outputS3Directory: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    tags: S.optional(TagsMap),
    jobArn: S.optional(S.String),
    queueInfo: S.optional(QuantumTaskQueueInfo),
    associations: S.optional(Associations),
    numSuccessfulShots: S.optional(S.Number),
    actionMetadata: S.optional(ActionMetadata),
    experimentalCapabilities: S.optional(ExperimentalCapabilities),
  }),
).annotations({
  identifier: "GetQuantumTaskResponse",
}) as any as S.Schema<GetQuantumTaskResponse>;
export interface CreateSpendingLimitResponse {
  spendingLimitArn: string;
}
export const CreateSpendingLimitResponse = S.suspend(() =>
  S.Struct({ spendingLimitArn: S.String }),
).annotations({
  identifier: "CreateSpendingLimitResponse",
}) as any as S.Schema<CreateSpendingLimitResponse>;
export interface DeviceSummary {
  deviceArn: string;
  deviceName: string;
  providerName: string;
  deviceType: string;
  deviceStatus: string;
}
export const DeviceSummary = S.suspend(() =>
  S.Struct({
    deviceArn: S.String,
    deviceName: S.String,
    providerName: S.String,
    deviceType: S.String,
    deviceStatus: S.String,
  }),
).annotations({
  identifier: "DeviceSummary",
}) as any as S.Schema<DeviceSummary>;
export type DeviceSummaryList = DeviceSummary[];
export const DeviceSummaryList = S.Array(DeviceSummary);
export interface JobSummary {
  status: string;
  jobArn: string;
  jobName: string;
  device: string;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  tags?: { [key: string]: string | undefined };
}
export const JobSummary = S.suspend(() =>
  S.Struct({
    status: S.String,
    jobArn: S.String,
    jobName: S.String,
    device: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    tags: S.optional(TagsMap),
  }),
).annotations({ identifier: "JobSummary" }) as any as S.Schema<JobSummary>;
export type JobSummaryList = JobSummary[];
export const JobSummaryList = S.Array(JobSummary);
export interface QuantumTaskSummary {
  quantumTaskArn: string;
  status: string;
  deviceArn: string;
  shots: number;
  outputS3Bucket: string;
  outputS3Directory: string;
  createdAt: Date;
  endedAt?: Date;
  tags?: { [key: string]: string | undefined };
}
export const QuantumTaskSummary = S.suspend(() =>
  S.Struct({
    quantumTaskArn: S.String,
    status: S.String,
    deviceArn: S.String,
    shots: S.Number,
    outputS3Bucket: S.String,
    outputS3Directory: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "QuantumTaskSummary",
}) as any as S.Schema<QuantumTaskSummary>;
export type QuantumTaskSummaryList = QuantumTaskSummary[];
export const QuantumTaskSummaryList = S.Array(QuantumTaskSummary);
export interface SpendingLimitSummary {
  spendingLimitArn: string;
  deviceArn: string;
  timePeriod: TimePeriod;
  spendingLimit: string;
  queuedSpend: string;
  totalSpend: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: { [key: string]: string | undefined };
}
export const SpendingLimitSummary = S.suspend(() =>
  S.Struct({
    spendingLimitArn: S.String,
    deviceArn: S.String,
    timePeriod: TimePeriod,
    spendingLimit: S.String,
    queuedSpend: S.String,
    totalSpend: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    tags: S.optional(TagsMap),
  }),
).annotations({
  identifier: "SpendingLimitSummary",
}) as any as S.Schema<SpendingLimitSummary>;
export type SpendingLimitSummaryList = SpendingLimitSummary[];
export const SpendingLimitSummaryList = S.Array(SpendingLimitSummary);
export interface SearchDevicesResponse {
  devices: DeviceSummary[];
  nextToken?: string;
}
export const SearchDevicesResponse = S.suspend(() =>
  S.Struct({ devices: DeviceSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "SearchDevicesResponse",
}) as any as S.Schema<SearchDevicesResponse>;
export interface CreateJobRequest {
  clientToken: string;
  algorithmSpecification: AlgorithmSpecification;
  inputDataConfig?: InputFileConfig[];
  outputDataConfig: JobOutputDataConfig;
  checkpointConfig?: JobCheckpointConfig;
  jobName: string;
  roleArn: string;
  stoppingCondition?: JobStoppingCondition;
  instanceConfig: InstanceConfig;
  hyperParameters?: { [key: string]: string | undefined };
  deviceConfig: DeviceConfig;
  tags?: { [key: string]: string | undefined };
  associations?: Association[];
}
export const CreateJobRequest = S.suspend(() =>
  S.Struct({
    clientToken: S.String.pipe(T.IdempotencyToken()),
    algorithmSpecification: AlgorithmSpecification,
    inputDataConfig: S.optional(InputConfigList),
    outputDataConfig: JobOutputDataConfig,
    checkpointConfig: S.optional(JobCheckpointConfig),
    jobName: S.String,
    roleArn: S.String,
    stoppingCondition: S.optional(JobStoppingCondition),
    instanceConfig: InstanceConfig,
    hyperParameters: S.optional(HyperParameters),
    deviceConfig: DeviceConfig,
    tags: S.optional(TagsMap),
    associations: S.optional(Associations),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/job" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateJobRequest",
}) as any as S.Schema<CreateJobRequest>;
export interface SearchJobsResponse {
  jobs: JobSummary[];
  nextToken?: string;
}
export const SearchJobsResponse = S.suspend(() =>
  S.Struct({ jobs: JobSummaryList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "SearchJobsResponse",
}) as any as S.Schema<SearchJobsResponse>;
export interface SearchQuantumTasksResponse {
  quantumTasks: QuantumTaskSummary[];
  nextToken?: string;
}
export const SearchQuantumTasksResponse = S.suspend(() =>
  S.Struct({
    quantumTasks: QuantumTaskSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchQuantumTasksResponse",
}) as any as S.Schema<SearchQuantumTasksResponse>;
export interface SearchSpendingLimitsResponse {
  spendingLimits: SpendingLimitSummary[];
  nextToken?: string;
}
export const SearchSpendingLimitsResponse = S.suspend(() =>
  S.Struct({
    spendingLimits: SpendingLimitSummaryList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "SearchSpendingLimitsResponse",
}) as any as S.Schema<SearchSpendingLimitsResponse>;
export type ProgramValidationFailuresList = string[];
export const ProgramValidationFailuresList = S.Array(S.String);
export interface ProgramSetValidationFailure {
  programIndex: number;
  inputsIndex?: number;
  errors?: string[];
}
export const ProgramSetValidationFailure = S.suspend(() =>
  S.Struct({
    programIndex: S.Number,
    inputsIndex: S.optional(S.Number),
    errors: S.optional(ProgramValidationFailuresList),
  }),
).annotations({
  identifier: "ProgramSetValidationFailure",
}) as any as S.Schema<ProgramSetValidationFailure>;
export type ProgramSetValidationFailuresList = ProgramSetValidationFailure[];
export const ProgramSetValidationFailuresList = S.Array(
  ProgramSetValidationFailure,
);
export interface CreateJobResponse {
  jobArn: string;
}
export const CreateJobResponse = S.suspend(() =>
  S.Struct({ jobArn: S.String }),
).annotations({
  identifier: "CreateJobResponse",
}) as any as S.Schema<CreateJobResponse>;

//# Errors
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { message: S.optional(S.String) },
).pipe(C.withServerError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
).pipe(C.withAuthError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
).pipe(C.withConflictError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(C.withThrottlingError) {}
export class DeviceOfflineException extends S.TaggedError<DeviceOfflineException>()(
  "DeviceOfflineException",
  { message: S.optional(S.String) },
) {}
export class DeviceRetiredException extends S.TaggedError<DeviceRetiredException>()(
  "DeviceRetiredException",
  { message: S.optional(S.String) },
).pipe(C.withBadRequestError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    reason: S.optional(S.String),
    programSetValidationFailures: S.optional(ProgramSetValidationFailuresList),
  },
).pipe(C.withBadRequestError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Remove tags from a resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => effect.Effect<
  UntagResourceResponse,
  | InternalServiceException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    InternalServiceException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Shows the tags associated with this resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => effect.Effect<
  ListTagsForResourceResponse,
  | InternalServiceException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    InternalServiceException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Add a tag to the specified resource.
 */
export const tagResource: (
  input: TagResourceRequest,
) => effect.Effect<
  TagResourceResponse,
  | InternalServiceException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    InternalServiceException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Retrieves the devices available in Amazon Braket.
 *
 * For backwards compatibility with older versions of BraketSchemas, OpenQASM information is omitted from GetDevice API calls. To get this information the user-agent needs to present a recent version of the BraketSchemas (1.8.0 or later). The Braket SDK automatically reports this for you. If you do not see OpenQASM results in the GetDevice response when using a Braket SDK, you may need to set AWS_EXECUTION_ENV environment variable to configure user-agent. See the code examples provided below for how to do this for the AWS CLI, Boto3, and the Go, Java, and JavaScript/TypeScript SDKs.
 */
export const getDevice: (
  input: GetDeviceRequest,
) => effect.Effect<
  GetDeviceResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetDeviceRequest,
  output: GetDeviceResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Searches for devices using the specified filters.
 */
export const searchDevices: {
  (
    input: SearchDevicesRequest,
  ): effect.Effect<
    SearchDevicesResponse,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchDevicesRequest,
  ) => stream.Stream<
    SearchDevicesResponse,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchDevicesRequest,
  ) => stream.Stream<
    DeviceSummary,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchDevicesRequest,
  output: SearchDevicesResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "devices",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Searches for Amazon Braket hybrid jobs that match the specified filter values.
 */
export const searchJobs: {
  (
    input: SearchJobsRequest,
  ): effect.Effect<
    SearchJobsResponse,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchJobsRequest,
  ) => stream.Stream<
    SearchJobsResponse,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchJobsRequest,
  ) => stream.Stream<
    JobSummary,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchJobsRequest,
  output: SearchJobsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "jobs",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Searches for tasks that match the specified filter values.
 */
export const searchQuantumTasks: {
  (
    input: SearchQuantumTasksRequest,
  ): effect.Effect<
    SearchQuantumTasksResponse,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchQuantumTasksRequest,
  ) => stream.Stream<
    SearchQuantumTasksResponse,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchQuantumTasksRequest,
  ) => stream.Stream<
    QuantumTaskSummary,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchQuantumTasksRequest,
  output: SearchQuantumTasksResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "quantumTasks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Creates a spending limit for a specified quantum device. Spending limits help you control costs by setting maximum amounts that can be spent on quantum computing tasks within a specified time period. Simulators do not support spending limits.
 */
export const createSpendingLimit: (
  input: CreateSpendingLimitRequest,
) => effect.Effect<
  CreateSpendingLimitResponse,
  | AccessDeniedException
  | DeviceRetiredException
  | InternalServiceException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSpendingLimitRequest,
  output: CreateSpendingLimitResponse,
  errors: [
    AccessDeniedException,
    DeviceRetiredException,
    InternalServiceException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Searches and lists spending limits based on specified filters. This operation supports pagination and allows filtering by various criteria to find specific spending limits. We recommend using pagination to ensure that the operation returns quickly and successfully.
 */
export const searchSpendingLimits: {
  (
    input: SearchSpendingLimitsRequest,
  ): effect.Effect<
    SearchSpendingLimitsResponse,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: SearchSpendingLimitsRequest,
  ) => stream.Stream<
    SearchSpendingLimitsResponse,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: SearchSpendingLimitsRequest,
  ) => stream.Stream<
    SpendingLimitSummary,
    | AccessDeniedException
    | InternalServiceException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: SearchSpendingLimitsRequest,
  output: SearchSpendingLimitsResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "spendingLimits",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Retrieves the specified Amazon Braket hybrid job.
 */
export const getJob: (
  input: GetJobRequest,
) => effect.Effect<
  GetJobResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetJobRequest,
  output: GetJobResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Retrieves the specified quantum task.
 */
export const getQuantumTask: (
  input: GetQuantumTaskRequest,
) => effect.Effect<
  GetQuantumTaskResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQuantumTaskRequest,
  output: GetQuantumTaskResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates an existing spending limit. You can modify the spending amount or time period. Changes take effect immediately.
 */
export const updateSpendingLimit: (
  input: UpdateSpendingLimitRequest,
) => effect.Effect<
  UpdateSpendingLimitResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateSpendingLimitRequest,
  output: UpdateSpendingLimitResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Deletes an existing spending limit. This operation permanently removes the spending limit and cannot be undone. After deletion, the associated device becomes unrestricted for spending.
 */
export const deleteSpendingLimit: (
  input: DeleteSpendingLimitRequest,
) => effect.Effect<
  DeleteSpendingLimitResponse,
  | AccessDeniedException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSpendingLimitRequest,
  output: DeleteSpendingLimitResponse,
  errors: [
    AccessDeniedException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels an Amazon Braket hybrid job.
 */
export const cancelJob: (
  input: CancelJobRequest,
) => effect.Effect<
  CancelJobResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelJobRequest,
  output: CancelJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Cancels the specified task.
 */
export const cancelQuantumTask: (
  input: CancelQuantumTaskRequest,
) => effect.Effect<
  CancelQuantumTaskResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServiceException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelQuantumTaskRequest,
  output: CancelQuantumTaskResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServiceException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a quantum task.
 */
export const createQuantumTask: (
  input: CreateQuantumTaskRequest,
) => effect.Effect<
  CreateQuantumTaskResponse,
  | AccessDeniedException
  | DeviceOfflineException
  | DeviceRetiredException
  | InternalServiceException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQuantumTaskRequest,
  output: CreateQuantumTaskResponse,
  errors: [
    AccessDeniedException,
    DeviceOfflineException,
    DeviceRetiredException,
    InternalServiceException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates an Amazon Braket hybrid job.
 */
export const createJob: (
  input: CreateJobRequest,
) => effect.Effect<
  CreateJobResponse,
  | AccessDeniedException
  | ConflictException
  | DeviceOfflineException
  | DeviceRetiredException
  | InternalServiceException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateJobRequest,
  output: CreateJobResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    DeviceOfflineException,
    DeviceRetiredException,
    InternalServiceException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
