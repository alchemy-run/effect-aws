import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "Snow Device Management",
  serviceShapeName: "SnowDeviceManagement",
});
const auth = T.AwsAuthSigv4({ name: "snow-device-management" });
const ver = T.ServiceVersion("2021-08-04");
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
                        url: "https://snow-device-management-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://snow-device-management-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://snow-device-management.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://snow-device-management.{Region}.{PartitionResult#dnsSuffix}",
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
export const InstanceIdsList = S.Array(S.String);
export const TargetList = S.Array(S.String);
export class ListTagsForResourceInput extends S.Class<ListTagsForResourceInput>(
  "ListTagsForResourceInput",
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
export class UntagResourceInput extends S.Class<UntagResourceInput>(
  "UntagResourceInput",
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
export class DescribeDeviceInput extends S.Class<DescribeDeviceInput>(
  "DescribeDeviceInput",
)(
  { managedDeviceId: S.String.pipe(T.HttpLabel("managedDeviceId")) },
  T.all(
    T.Http({
      method: "POST",
      uri: "/managed-device/{managedDeviceId}/describe",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDevicesInput extends S.Class<ListDevicesInput>(
  "ListDevicesInput",
)(
  {
    jobId: S.optional(S.String).pipe(T.HttpQuery("jobId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/managed-devices" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeDeviceEc2Input extends S.Class<DescribeDeviceEc2Input>(
  "DescribeDeviceEc2Input",
)(
  {
    managedDeviceId: S.String.pipe(T.HttpLabel("managedDeviceId")),
    instanceIds: InstanceIdsList,
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/managed-device/{managedDeviceId}/resources/ec2/describe",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListDeviceResourcesInput extends S.Class<ListDeviceResourcesInput>(
  "ListDeviceResourcesInput",
)(
  {
    managedDeviceId: S.String.pipe(T.HttpLabel("managedDeviceId")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({
      method: "GET",
      uri: "/managed-device/{managedDeviceId}/resources",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeTaskInput extends S.Class<DescribeTaskInput>(
  "DescribeTaskInput",
)(
  { taskId: S.String.pipe(T.HttpLabel("taskId")) },
  T.all(
    T.Http({ method: "POST", uri: "/task/{taskId}" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListTasksInput extends S.Class<ListTasksInput>("ListTasksInput")(
  {
    state: S.optional(S.String).pipe(T.HttpQuery("state")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(T.Http({ method: "GET", uri: "/tasks" }), svc, auth, proto, ver, rules),
) {}
export class CancelTaskInput extends S.Class<CancelTaskInput>(
  "CancelTaskInput",
)(
  { taskId: S.String.pipe(T.HttpLabel("taskId")) },
  T.all(
    T.Http({ method: "POST", uri: "/task/{taskId}/cancel" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class DescribeExecutionInput extends S.Class<DescribeExecutionInput>(
  "DescribeExecutionInput",
)(
  {
    taskId: S.String.pipe(T.HttpLabel("taskId")),
    managedDeviceId: S.String.pipe(T.HttpLabel("managedDeviceId")),
  },
  T.all(
    T.Http({
      method: "POST",
      uri: "/task/{taskId}/execution/{managedDeviceId}",
    }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class ListExecutionsInput extends S.Class<ListExecutionsInput>(
  "ListExecutionsInput",
)(
  {
    taskId: S.String.pipe(T.HttpQuery("taskId")),
    state: S.optional(S.String).pipe(T.HttpQuery("state")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  },
  T.all(
    T.Http({ method: "GET", uri: "/executions" }),
    svc,
    auth,
    proto,
    ver,
    rules,
  ),
) {}
export class Unlock extends S.Class<Unlock>("Unlock")({}) {}
export class Reboot extends S.Class<Reboot>("Reboot")({}) {}
export const TagMap = S.Record({ key: S.String, value: S.String });
export const Command = S.Union(
  S.Struct({ unlock: Unlock }),
  S.Struct({ reboot: Reboot }),
);
export class ListTagsForResourceOutput extends S.Class<ListTagsForResourceOutput>(
  "ListTagsForResourceOutput",
)({ tags: S.optional(TagMap) }) {}
export class TagResourceInput extends S.Class<TagResourceInput>(
  "TagResourceInput",
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
export class CreateTaskInput extends S.Class<CreateTaskInput>(
  "CreateTaskInput",
)(
  {
    targets: TargetList,
    command: Command,
    description: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/task" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTaskOutput extends S.Class<DescribeTaskOutput>(
  "DescribeTaskOutput",
)({
  taskId: S.optional(S.String),
  taskArn: S.optional(S.String),
  targets: S.optional(TargetList),
  state: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  description: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export class CancelTaskOutput extends S.Class<CancelTaskOutput>(
  "CancelTaskOutput",
)({ taskId: S.optional(S.String) }) {}
export class DescribeExecutionOutput extends S.Class<DescribeExecutionOutput>(
  "DescribeExecutionOutput",
)({
  taskId: S.optional(S.String),
  executionId: S.optional(S.String),
  managedDeviceId: S.optional(S.String),
  state: S.optional(S.String),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class PhysicalNetworkInterface extends S.Class<PhysicalNetworkInterface>(
  "PhysicalNetworkInterface",
)({
  physicalNetworkInterfaceId: S.optional(S.String),
  physicalConnectorType: S.optional(S.String),
  ipAddressAssignment: S.optional(S.String),
  ipAddress: S.optional(S.String),
  netmask: S.optional(S.String),
  defaultGateway: S.optional(S.String),
  macAddress: S.optional(S.String),
}) {}
export const PhysicalNetworkInterfaceList = S.Array(PhysicalNetworkInterface);
export class Capacity extends S.Class<Capacity>("Capacity")({
  name: S.optional(S.String),
  unit: S.optional(S.String),
  total: S.optional(S.Number),
  used: S.optional(S.Number),
  available: S.optional(S.Number),
}) {}
export const CapacityList = S.Array(Capacity);
export class SoftwareInformation extends S.Class<SoftwareInformation>(
  "SoftwareInformation",
)({
  installedVersion: S.optional(S.String),
  installingVersion: S.optional(S.String),
  installState: S.optional(S.String),
}) {}
export class DeviceSummary extends S.Class<DeviceSummary>("DeviceSummary")({
  managedDeviceId: S.optional(S.String),
  managedDeviceArn: S.optional(S.String),
  associatedWithJob: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export const DeviceSummaryList = S.Array(DeviceSummary);
export class ResourceSummary extends S.Class<ResourceSummary>(
  "ResourceSummary",
)({
  resourceType: S.String,
  arn: S.optional(S.String),
  id: S.optional(S.String),
}) {}
export const ResourceSummaryList = S.Array(ResourceSummary);
export class TaskSummary extends S.Class<TaskSummary>("TaskSummary")({
  taskId: S.String,
  taskArn: S.optional(S.String),
  state: S.optional(S.String),
  tags: S.optional(TagMap),
}) {}
export const TaskSummaryList = S.Array(TaskSummary);
export class ExecutionSummary extends S.Class<ExecutionSummary>(
  "ExecutionSummary",
)({
  taskId: S.optional(S.String),
  executionId: S.optional(S.String),
  managedDeviceId: S.optional(S.String),
  state: S.optional(S.String),
}) {}
export const ExecutionSummaryList = S.Array(ExecutionSummary);
export class DescribeDeviceOutput extends S.Class<DescribeDeviceOutput>(
  "DescribeDeviceOutput",
)({
  lastReachedOutAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(TagMap),
  managedDeviceId: S.optional(S.String),
  managedDeviceArn: S.optional(S.String),
  deviceType: S.optional(S.String),
  associatedWithJob: S.optional(S.String),
  deviceState: S.optional(S.String),
  physicalNetworkInterfaces: S.optional(PhysicalNetworkInterfaceList),
  deviceCapacities: S.optional(CapacityList),
  software: S.optional(SoftwareInformation),
}) {}
export class ListDevicesOutput extends S.Class<ListDevicesOutput>(
  "ListDevicesOutput",
)({
  devices: S.optional(DeviceSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class ListDeviceResourcesOutput extends S.Class<ListDeviceResourcesOutput>(
  "ListDeviceResourcesOutput",
)({
  resources: S.optional(ResourceSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class CreateTaskOutput extends S.Class<CreateTaskOutput>(
  "CreateTaskOutput",
)({ taskId: S.optional(S.String), taskArn: S.optional(S.String) }) {}
export class ListTasksOutput extends S.Class<ListTasksOutput>(
  "ListTasksOutput",
)({ tasks: S.optional(TaskSummaryList), nextToken: S.optional(S.String) }) {}
export class ListExecutionsOutput extends S.Class<ListExecutionsOutput>(
  "ListExecutionsOutput",
)({
  executions: S.optional(ExecutionSummaryList),
  nextToken: S.optional(S.String),
}) {}
export class InstanceState extends S.Class<InstanceState>("InstanceState")({
  code: S.optional(S.Number),
  name: S.optional(S.String),
}) {}
export class SecurityGroupIdentifier extends S.Class<SecurityGroupIdentifier>(
  "SecurityGroupIdentifier",
)({ groupId: S.optional(S.String), groupName: S.optional(S.String) }) {}
export const SecurityGroupIdentifierList = S.Array(SecurityGroupIdentifier);
export class CpuOptions extends S.Class<CpuOptions>("CpuOptions")({
  coreCount: S.optional(S.Number),
  threadsPerCore: S.optional(S.Number),
}) {}
export class EbsInstanceBlockDevice extends S.Class<EbsInstanceBlockDevice>(
  "EbsInstanceBlockDevice",
)({
  attachTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  deleteOnTermination: S.optional(S.Boolean),
  status: S.optional(S.String),
  volumeId: S.optional(S.String),
}) {}
export class InstanceBlockDeviceMapping extends S.Class<InstanceBlockDeviceMapping>(
  "InstanceBlockDeviceMapping",
)({
  deviceName: S.optional(S.String),
  ebs: S.optional(EbsInstanceBlockDevice),
}) {}
export const InstanceBlockDeviceMappingList = S.Array(
  InstanceBlockDeviceMapping,
);
export class Instance extends S.Class<Instance>("Instance")({
  imageId: S.optional(S.String),
  amiLaunchIndex: S.optional(S.Number),
  instanceId: S.optional(S.String),
  state: S.optional(InstanceState),
  instanceType: S.optional(S.String),
  privateIpAddress: S.optional(S.String),
  publicIpAddress: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  blockDeviceMappings: S.optional(InstanceBlockDeviceMappingList),
  securityGroups: S.optional(SecurityGroupIdentifierList),
  cpuOptions: S.optional(CpuOptions),
  rootDeviceName: S.optional(S.String),
}) {}
export class InstanceSummary extends S.Class<InstanceSummary>(
  "InstanceSummary",
)({
  instance: S.optional(Instance),
  lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const InstanceSummaryList = S.Array(InstanceSummary);
export class DescribeDeviceEc2Output extends S.Class<DescribeDeviceEc2Output>(
  "DescribeDeviceEc2Output",
)({ instances: S.optional(InstanceSummaryList) }) {}

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable({ throttling: true }),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
) {}

//# Operations
/**
 * Removes a tag from a device or task.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceInput,
  output: UntagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Checks the metadata for a given task on a device.
 */
export const describeTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTaskInput,
  output: DescribeTaskOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of tags for a managed device or task.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceInput,
  output: ListTagsForResourceOutput,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Adds or replaces tags on a device or task.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceInput,
  output: TagResourceResponse,
  errors: [
    InternalServerException,
    ResourceNotFoundException,
    ValidationException,
  ],
}));
/**
 * Instructs one or more devices to start a task, such as unlocking or rebooting.
 */
export const createTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTaskInput,
  output: CreateTaskOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of tasks that can be filtered by state.
 */
export const listTasks = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListTasksInput,
  output: ListTasksOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "tasks",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Returns the status of tasks for one or more target devices.
 */
export const listExecutions = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListExecutionsInput,
    output: ListExecutionsOutput,
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
      items: "executions",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Sends a cancel request for a specified task. You can cancel a task only if it's still in a
 * `QUEUED` state. Tasks that are already running can't be cancelled.
 *
 * A task might still run if it's processed from the queue before the
 * `CancelTask` operation changes the task's state.
 */
export const cancelTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CancelTaskInput,
  output: CancelTaskOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Checks the status of a remote task running on one or more target devices.
 */
export const describeExecution = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeExecutionInput,
  output: DescribeExecutionOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Checks device-specific information, such as the device type, software version, IP
 * addresses, and lock status.
 */
export const describeDevice = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDeviceInput,
  output: DescribeDeviceOutput,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all devices on your Amazon Web Services account that have Amazon Web Services Snow Device Management
 * enabled in the Amazon Web Services Region where the command is run.
 */
export const listDevices = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListDevicesInput,
    output: ListDevicesOutput,
    errors: [
      AccessDeniedException,
      InternalServerException,
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
 * Returns a list of the Amazon Web Services resources available for a device. Currently, Amazon EC2 instances are the only supported resource type.
 */
export const listDeviceResources =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListDeviceResourcesInput,
    output: ListDeviceResourcesOutput,
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
      items: "resources",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Checks the current state of the Amazon EC2 instances. The output is similar to
 * `describeDevice`, but the results are sourced from the device cache in the
 * Amazon Web Services Cloud and include a subset of the available fields.
 */
export const describeDeviceEc2Instances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeDeviceEc2Input,
    output: DescribeDeviceEc2Output,
    errors: [
      AccessDeniedException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
