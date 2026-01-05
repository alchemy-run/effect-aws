import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({ sdkId: "Braket", serviceShapeName: "Braket" });
const auth = T.AwsAuthSigv4({ name: "braket" });
const ver = T.ServiceVersion("2019-09-01");
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
                        url: "https://braket-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://braket-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://braket.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://braket.{Region}.{PartitionResult#dnsSuffix}",
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
export const TagKeys = S.Array(S.String);
export const HybridJobAdditionalAttributeNamesList = S.Array(S.String);
export const QuantumTaskAdditionalAttributeNamesList = S.Array(S.String);
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
    tagKeys: TagKeys.pipe(T.HttpQuery("tagKeys")),
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
export class GetDeviceRequest extends S.Class<GetDeviceRequest>(
  "GetDeviceRequest",
)(
  { deviceArn: S.String.pipe(T.HttpLabel("deviceArn")) },
  T.all(
    T.Http({ method: "GET", uri: "/device/{deviceArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetJobRequest extends S.Class<GetJobRequest>("GetJobRequest")(
  {
    jobArn: S.String.pipe(T.HttpLabel("jobArn")),
    additionalAttributeNames: S.optional(
      HybridJobAdditionalAttributeNamesList,
    ).pipe(T.HttpQuery("additionalAttributeNames")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/job/{jobArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelJobRequest extends S.Class<CancelJobRequest>(
  "CancelJobRequest",
)(
  { jobArn: S.String.pipe(T.HttpLabel("jobArn")) },
  T.all(
    T.Http({ method: "PUT", uri: "/job/{jobArn}/cancel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class GetQuantumTaskRequest extends S.Class<GetQuantumTaskRequest>(
  "GetQuantumTaskRequest",
)(
  {
    quantumTaskArn: S.String.pipe(T.HttpLabel("quantumTaskArn")),
    additionalAttributeNames: S.optional(
      QuantumTaskAdditionalAttributeNamesList,
    ).pipe(T.HttpQuery("additionalAttributeNames")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/quantum-task/{quantumTaskArn}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelQuantumTaskRequest extends S.Class<CancelQuantumTaskRequest>(
  "CancelQuantumTaskRequest",
)(
  {
    quantumTaskArn: S.String.pipe(T.HttpLabel("quantumTaskArn")),
    clientToken: S.String,
  },
  T.all(
    T.Http({ method: "PUT", uri: "/quantum-task/{quantumTaskArn}/cancel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class TimePeriod extends S.Class<TimePeriod>("TimePeriod")({
  startAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  endAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class UpdateSpendingLimitRequest extends S.Class<UpdateSpendingLimitRequest>(
  "UpdateSpendingLimitRequest",
)(
  {
    spendingLimitArn: S.String.pipe(T.HttpLabel("spendingLimitArn")),
    clientToken: S.String,
    spendingLimit: S.optional(S.String),
    timePeriod: S.optional(TimePeriod),
  },
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
) {}
export class UpdateSpendingLimitResponse extends S.Class<UpdateSpendingLimitResponse>(
  "UpdateSpendingLimitResponse",
)({}) {}
export class DeleteSpendingLimitRequest extends S.Class<DeleteSpendingLimitRequest>(
  "DeleteSpendingLimitRequest",
)(
  { spendingLimitArn: S.String.pipe(T.HttpLabel("spendingLimitArn")) },
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
) {}
export class DeleteSpendingLimitResponse extends S.Class<DeleteSpendingLimitResponse>(
  "DeleteSpendingLimitResponse",
)({}) {}
export const String256List = S.Array(S.String);
export const TagsMap = S.Record({ key: S.String, value: S.String });
export class SearchDevicesFilter extends S.Class<SearchDevicesFilter>(
  "SearchDevicesFilter",
)({ name: S.String, values: String256List }) {}
export const SearchDevicesFilterList = S.Array(SearchDevicesFilter);
export class JobOutputDataConfig extends S.Class<JobOutputDataConfig>(
  "JobOutputDataConfig",
)({ kmsKeyId: S.optional(S.String), s3Path: S.String }) {}
export class JobCheckpointConfig extends S.Class<JobCheckpointConfig>(
  "JobCheckpointConfig",
)({ localPath: S.optional(S.String), s3Uri: S.String }) {}
export class JobStoppingCondition extends S.Class<JobStoppingCondition>(
  "JobStoppingCondition",
)({ maxRuntimeInSeconds: S.optional(S.Number) }) {}
export class InstanceConfig extends S.Class<InstanceConfig>("InstanceConfig")({
  instanceType: S.String,
  volumeSizeInGb: S.Number,
  instanceCount: S.optional(S.Number),
}) {}
export const HyperParameters = S.Record({ key: S.String, value: S.String });
export class DeviceConfig extends S.Class<DeviceConfig>("DeviceConfig")({
  device: S.String,
}) {}
export class Association extends S.Class<Association>("Association")({
  arn: S.String,
  type: S.String,
}) {}
export const Associations = S.Array(Association);
export class SearchJobsFilter extends S.Class<SearchJobsFilter>(
  "SearchJobsFilter",
)({ name: S.String, values: String256List, operator: S.String }) {}
export const SearchJobsFilterList = S.Array(SearchJobsFilter);
export const ExperimentalCapabilities = S.Union(
  S.Struct({ enabled: S.String }),
);
export class SearchQuantumTasksFilter extends S.Class<SearchQuantumTasksFilter>(
  "SearchQuantumTasksFilter",
)({ name: S.String, values: String256List, operator: S.String }) {}
export const SearchQuantumTasksFilterList = S.Array(SearchQuantumTasksFilter);
export class SearchSpendingLimitsFilter extends S.Class<SearchSpendingLimitsFilter>(
  "SearchSpendingLimitsFilter",
)({ name: S.String, values: String256List, operator: S.String }) {}
export const SearchSpendingLimitsFilterList = S.Array(
  SearchSpendingLimitsFilter,
);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(TagsMap) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tags: TagsMap },
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
export class SearchDevicesRequest extends S.Class<SearchDevicesRequest>(
  "SearchDevicesRequest",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: SearchDevicesFilterList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/devices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelJobResponse extends S.Class<CancelJobResponse>(
  "CancelJobResponse",
)({ jobArn: S.String, cancellationStatus: S.String }) {}
export class SearchJobsRequest extends S.Class<SearchJobsRequest>(
  "SearchJobsRequest",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: SearchJobsFilterList,
  },
  T.all(T.Http({ method: "POST", uri: "/jobs" }), svc, auth, proto, ver, rules),
) {}
export class CreateQuantumTaskRequest extends S.Class<CreateQuantumTaskRequest>(
  "CreateQuantumTaskRequest",
)(
  {
    clientToken: S.String,
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
  },
  T.all(
    T.Http({ method: "POST", uri: "/quantum-task" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CancelQuantumTaskResponse extends S.Class<CancelQuantumTaskResponse>(
  "CancelQuantumTaskResponse",
)({ quantumTaskArn: S.String, cancellationStatus: S.String }) {}
export class SearchQuantumTasksRequest extends S.Class<SearchQuantumTasksRequest>(
  "SearchQuantumTasksRequest",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: SearchQuantumTasksFilterList,
  },
  T.all(
    T.Http({ method: "POST", uri: "/quantum-tasks" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class CreateSpendingLimitRequest extends S.Class<CreateSpendingLimitRequest>(
  "CreateSpendingLimitRequest",
)(
  {
    clientToken: S.String,
    deviceArn: S.String,
    spendingLimit: S.String,
    timePeriod: S.optional(TimePeriod),
    tags: S.optional(TagsMap),
  },
  T.all(
    T.Http({ method: "POST", uri: "/spending-limit" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class SearchSpendingLimitsRequest extends S.Class<SearchSpendingLimitsRequest>(
  "SearchSpendingLimitsRequest",
)(
  {
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    filters: S.optional(SearchSpendingLimitsFilterList),
  },
  T.all(
    T.Http({ method: "POST", uri: "/spending-limits" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ScriptModeConfig extends S.Class<ScriptModeConfig>(
  "ScriptModeConfig",
)({
  entryPoint: S.String,
  s3Uri: S.String,
  compressionType: S.optional(S.String),
}) {}
export class ContainerImage extends S.Class<ContainerImage>("ContainerImage")({
  uri: S.String,
}) {}
export class DeviceQueueInfo extends S.Class<DeviceQueueInfo>(
  "DeviceQueueInfo",
)({
  queue: S.String,
  queueSize: S.String,
  queuePriority: S.optional(S.String),
}) {}
export const DeviceQueueInfoList = S.Array(DeviceQueueInfo);
export class AlgorithmSpecification extends S.Class<AlgorithmSpecification>(
  "AlgorithmSpecification",
)({
  scriptModeConfig: S.optional(ScriptModeConfig),
  containerImage: S.optional(ContainerImage),
}) {}
export class JobEventDetails extends S.Class<JobEventDetails>(
  "JobEventDetails",
)({
  eventType: S.optional(S.String),
  timeOfEvent: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  message: S.optional(S.String),
}) {}
export const JobEvents = S.Array(JobEventDetails);
export class HybridJobQueueInfo extends S.Class<HybridJobQueueInfo>(
  "HybridJobQueueInfo",
)({ queue: S.String, position: S.String, message: S.optional(S.String) }) {}
export class QuantumTaskQueueInfo extends S.Class<QuantumTaskQueueInfo>(
  "QuantumTaskQueueInfo",
)({
  queue: S.String,
  position: S.String,
  queuePriority: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export class ActionMetadata extends S.Class<ActionMetadata>("ActionMetadata")({
  actionType: S.String,
  programCount: S.optional(S.Number),
  executableCount: S.optional(S.Number),
}) {}
export class S3DataSource extends S.Class<S3DataSource>("S3DataSource")({
  s3Uri: S.String,
}) {}
export class GetDeviceResponse extends S.Class<GetDeviceResponse>(
  "GetDeviceResponse",
)({
  deviceArn: S.String,
  deviceName: S.String,
  providerName: S.String,
  deviceType: S.String,
  deviceStatus: S.String,
  deviceCapabilities: S.String,
  deviceQueueInfo: S.optional(DeviceQueueInfoList),
}) {}
export class DataSource extends S.Class<DataSource>("DataSource")({
  s3DataSource: S3DataSource,
}) {}
export class InputFileConfig extends S.Class<InputFileConfig>(
  "InputFileConfig",
)({
  channelName: S.String,
  contentType: S.optional(S.String),
  dataSource: DataSource,
}) {}
export const InputConfigList = S.Array(InputFileConfig);
export class GetJobResponse extends S.Class<GetJobResponse>("GetJobResponse")({
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
}) {}
export class CreateQuantumTaskResponse extends S.Class<CreateQuantumTaskResponse>(
  "CreateQuantumTaskResponse",
)({ quantumTaskArn: S.String }) {}
export class GetQuantumTaskResponse extends S.Class<GetQuantumTaskResponse>(
  "GetQuantumTaskResponse",
)({
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
}) {}
export class CreateSpendingLimitResponse extends S.Class<CreateSpendingLimitResponse>(
  "CreateSpendingLimitResponse",
)({ spendingLimitArn: S.String }) {}
export class DeviceSummary extends S.Class<DeviceSummary>("DeviceSummary")({
  deviceArn: S.String,
  deviceName: S.String,
  providerName: S.String,
  deviceType: S.String,
  deviceStatus: S.String,
}) {}
export const DeviceSummaryList = S.Array(DeviceSummary);
export class JobSummary extends S.Class<JobSummary>("JobSummary")({
  status: S.String,
  jobArn: S.String,
  jobName: S.String,
  device: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tags: S.optional(TagsMap),
}) {}
export const JobSummaryList = S.Array(JobSummary);
export class QuantumTaskSummary extends S.Class<QuantumTaskSummary>(
  "QuantumTaskSummary",
)({
  quantumTaskArn: S.String,
  status: S.String,
  deviceArn: S.String,
  shots: S.Number,
  outputS3Bucket: S.String,
  outputS3Directory: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  endedAt: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  tags: S.optional(TagsMap),
}) {}
export const QuantumTaskSummaryList = S.Array(QuantumTaskSummary);
export class SpendingLimitSummary extends S.Class<SpendingLimitSummary>(
  "SpendingLimitSummary",
)({
  spendingLimitArn: S.String,
  deviceArn: S.String,
  timePeriod: TimePeriod,
  spendingLimit: S.String,
  queuedSpend: S.String,
  totalSpend: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  updatedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  tags: S.optional(TagsMap),
}) {}
export const SpendingLimitSummaryList = S.Array(SpendingLimitSummary);
export class SearchDevicesResponse extends S.Class<SearchDevicesResponse>(
  "SearchDevicesResponse",
)({ devices: DeviceSummaryList, nextToken: S.optional(S.String) }) {}
export class CreateJobRequest extends S.Class<CreateJobRequest>(
  "CreateJobRequest",
)(
  {
    clientToken: S.String,
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
  },
  T.all(T.Http({ method: "POST", uri: "/job" }), svc, auth, proto, ver, rules),
) {}
export class SearchJobsResponse extends S.Class<SearchJobsResponse>(
  "SearchJobsResponse",
)({ jobs: JobSummaryList, nextToken: S.optional(S.String) }) {}
export class SearchQuantumTasksResponse extends S.Class<SearchQuantumTasksResponse>(
  "SearchQuantumTasksResponse",
)({ quantumTasks: QuantumTaskSummaryList, nextToken: S.optional(S.String) }) {}
export class SearchSpendingLimitsResponse extends S.Class<SearchSpendingLimitsResponse>(
  "SearchSpendingLimitsResponse",
)({
  spendingLimits: SpendingLimitSummaryList,
  nextToken: S.optional(S.String),
}) {}
export const ProgramValidationFailuresList = S.Array(S.String);
export class ProgramSetValidationFailure extends S.Class<ProgramSetValidationFailure>(
  "ProgramSetValidationFailure",
)({
  programIndex: S.Number,
  inputsIndex: S.optional(S.Number),
  errors: S.optional(ProgramValidationFailuresList),
}) {}
export const ProgramSetValidationFailuresList = S.Array(
  ProgramSetValidationFailure,
);
export class CreateJobResponse extends S.Class<CreateJobResponse>(
  "CreateJobResponse",
)({ jobArn: S.String }) {}

//# Errors
export class InternalServiceException extends S.TaggedError<InternalServiceException>()(
  "InternalServiceException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.optional(S.String) },
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.optional(S.String) },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.optional(S.String) },
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class DeviceOfflineException extends S.TaggedError<DeviceOfflineException>()(
  "DeviceOfflineException",
  { message: S.optional(S.String) },
) {}
export class DeviceRetiredException extends S.TaggedError<DeviceRetiredException>()(
  "DeviceRetiredException",
  { message: S.optional(S.String) },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.optional(S.String),
    reason: S.optional(S.String),
    programSetValidationFailures: S.optional(ProgramSetValidationFailuresList),
  },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Remove tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchDevices = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Searches for Amazon Braket hybrid jobs that match the specified filter values.
 */
export const searchJobs = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const searchQuantumTasks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
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
  }),
);
/**
 * Creates a spending limit for a specified quantum device. Spending limits help you control costs by setting maximum amounts that can be spent on quantum computing tasks within a specified time period. Simulators do not support spending limits.
 */
export const createSpendingLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const searchSpendingLimits =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const getJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQuantumTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateSpendingLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteSpendingLimit = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const cancelQuantumTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createQuantumTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createJob = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
