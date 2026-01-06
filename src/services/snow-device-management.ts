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

//# Newtypes
export type ManagedDeviceId = string;
export type JobId = string;
export type MaxResults = number;
export type NextToken = string;
export type TaskDescriptionString = string;
export type IdempotencyToken = string;
export type TaskId = string;
export type TaskState = string;
export type ExecutionState = string;
export type UnlockState = string;
export type ExecutionId = string;
export type PhysicalConnectorType = string;
export type IpAddressAssignment = string;
export type InstanceStateName = string;
export type AttachmentStatus = string;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type InstanceIdsList = string[];
export const InstanceIdsList = S.Array(S.String);
export type TargetList = string[];
export const TargetList = S.Array(S.String);
export interface ListTagsForResourceInput {
  resourceArn: string;
}
export const ListTagsForResourceInput = S.suspend(() =>
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
  identifier: "ListTagsForResourceInput",
}) as any as S.Schema<ListTagsForResourceInput>;
export interface UntagResourceInput {
  resourceArn: string;
  tagKeys: TagKeys;
}
export const UntagResourceInput = S.suspend(() =>
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
  identifier: "UntagResourceInput",
}) as any as S.Schema<UntagResourceInput>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface DescribeDeviceInput {
  managedDeviceId: string;
}
export const DescribeDeviceInput = S.suspend(() =>
  S.Struct({
    managedDeviceId: S.String.pipe(T.HttpLabel("managedDeviceId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeDeviceInput",
}) as any as S.Schema<DescribeDeviceInput>;
export interface ListDevicesInput {
  jobId?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListDevicesInput = S.suspend(() =>
  S.Struct({
    jobId: S.optional(S.String).pipe(T.HttpQuery("jobId")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/managed-devices" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListDevicesInput",
}) as any as S.Schema<ListDevicesInput>;
export interface DescribeDeviceEc2Input {
  managedDeviceId: string;
  instanceIds: InstanceIdsList;
}
export const DescribeDeviceEc2Input = S.suspend(() =>
  S.Struct({
    managedDeviceId: S.String.pipe(T.HttpLabel("managedDeviceId")),
    instanceIds: InstanceIdsList,
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeDeviceEc2Input",
}) as any as S.Schema<DescribeDeviceEc2Input>;
export interface ListDeviceResourcesInput {
  managedDeviceId: string;
  type?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListDeviceResourcesInput = S.suspend(() =>
  S.Struct({
    managedDeviceId: S.String.pipe(T.HttpLabel("managedDeviceId")),
    type: S.optional(S.String).pipe(T.HttpQuery("type")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
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
  ),
).annotations({
  identifier: "ListDeviceResourcesInput",
}) as any as S.Schema<ListDeviceResourcesInput>;
export interface DescribeTaskInput {
  taskId: string;
}
export const DescribeTaskInput = S.suspend(() =>
  S.Struct({ taskId: S.String.pipe(T.HttpLabel("taskId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/task/{taskId}" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeTaskInput",
}) as any as S.Schema<DescribeTaskInput>;
export interface ListTasksInput {
  state?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListTasksInput = S.suspend(() =>
  S.Struct({
    state: S.optional(S.String).pipe(T.HttpQuery("state")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/tasks" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTasksInput",
}) as any as S.Schema<ListTasksInput>;
export interface CancelTaskInput {
  taskId: string;
}
export const CancelTaskInput = S.suspend(() =>
  S.Struct({ taskId: S.String.pipe(T.HttpLabel("taskId")) }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/task/{taskId}/cancel" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CancelTaskInput",
}) as any as S.Schema<CancelTaskInput>;
export interface DescribeExecutionInput {
  taskId: string;
  managedDeviceId: string;
}
export const DescribeExecutionInput = S.suspend(() =>
  S.Struct({
    taskId: S.String.pipe(T.HttpLabel("taskId")),
    managedDeviceId: S.String.pipe(T.HttpLabel("managedDeviceId")),
  }).pipe(
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
  ),
).annotations({
  identifier: "DescribeExecutionInput",
}) as any as S.Schema<DescribeExecutionInput>;
export interface ListExecutionsInput {
  taskId: string;
  state?: string;
  maxResults?: number;
  nextToken?: string;
}
export const ListExecutionsInput = S.suspend(() =>
  S.Struct({
    taskId: S.String.pipe(T.HttpQuery("taskId")),
    state: S.optional(S.String).pipe(T.HttpQuery("state")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
  }).pipe(
    T.all(
      T.Http({ method: "GET", uri: "/executions" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListExecutionsInput",
}) as any as S.Schema<ListExecutionsInput>;
export interface Unlock {}
export const Unlock = S.suspend(() => S.Struct({})).annotations({
  identifier: "Unlock",
}) as any as S.Schema<Unlock>;
export interface Reboot {}
export const Reboot = S.suspend(() => S.Struct({})).annotations({
  identifier: "Reboot",
}) as any as S.Schema<Reboot>;
export type TagMap = { [key: string]: string };
export const TagMap = S.Record({ key: S.String, value: S.String });
export type Command = { unlock: Unlock } | { reboot: Reboot };
export const Command = S.Union(
  S.Struct({ unlock: Unlock }),
  S.Struct({ reboot: Reboot }),
);
export interface ListTagsForResourceOutput {
  tags?: TagMap;
}
export const ListTagsForResourceOutput = S.suspend(() =>
  S.Struct({ tags: S.optional(TagMap) }),
).annotations({
  identifier: "ListTagsForResourceOutput",
}) as any as S.Schema<ListTagsForResourceOutput>;
export interface TagResourceInput {
  resourceArn: string;
  tags: TagMap;
}
export const TagResourceInput = S.suspend(() =>
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
  identifier: "TagResourceInput",
}) as any as S.Schema<TagResourceInput>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface CreateTaskInput {
  targets: TargetList;
  command: (typeof Command)["Type"];
  description?: string;
  tags?: TagMap;
  clientToken?: string;
}
export const CreateTaskInput = S.suspend(() =>
  S.Struct({
    targets: TargetList,
    command: Command,
    description: S.optional(S.String),
    tags: S.optional(TagMap),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(
      T.Http({ method: "POST", uri: "/task" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateTaskInput",
}) as any as S.Schema<CreateTaskInput>;
export interface DescribeTaskOutput {
  taskId?: string;
  taskArn?: string;
  targets?: TargetList;
  state?: string;
  createdAt?: Date;
  lastUpdatedAt?: Date;
  completedAt?: Date;
  description?: string;
  tags?: TagMap;
}
export const DescribeTaskOutput = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    taskArn: S.optional(S.String),
    targets: S.optional(TargetList),
    state: S.optional(S.String),
    createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    completedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    description: S.optional(S.String),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "DescribeTaskOutput",
}) as any as S.Schema<DescribeTaskOutput>;
export interface CancelTaskOutput {
  taskId?: string;
}
export const CancelTaskOutput = S.suspend(() =>
  S.Struct({ taskId: S.optional(S.String) }),
).annotations({
  identifier: "CancelTaskOutput",
}) as any as S.Schema<CancelTaskOutput>;
export interface DescribeExecutionOutput {
  taskId?: string;
  executionId?: string;
  managedDeviceId?: string;
  state?: string;
  startedAt?: Date;
  lastUpdatedAt?: Date;
}
export const DescribeExecutionOutput = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    executionId: S.optional(S.String),
    managedDeviceId: S.optional(S.String),
    state: S.optional(S.String),
    startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "DescribeExecutionOutput",
}) as any as S.Schema<DescribeExecutionOutput>;
export interface PhysicalNetworkInterface {
  physicalNetworkInterfaceId?: string;
  physicalConnectorType?: string;
  ipAddressAssignment?: string;
  ipAddress?: string;
  netmask?: string;
  defaultGateway?: string;
  macAddress?: string;
}
export const PhysicalNetworkInterface = S.suspend(() =>
  S.Struct({
    physicalNetworkInterfaceId: S.optional(S.String),
    physicalConnectorType: S.optional(S.String),
    ipAddressAssignment: S.optional(S.String),
    ipAddress: S.optional(S.String),
    netmask: S.optional(S.String),
    defaultGateway: S.optional(S.String),
    macAddress: S.optional(S.String),
  }),
).annotations({
  identifier: "PhysicalNetworkInterface",
}) as any as S.Schema<PhysicalNetworkInterface>;
export type PhysicalNetworkInterfaceList = PhysicalNetworkInterface[];
export const PhysicalNetworkInterfaceList = S.Array(PhysicalNetworkInterface);
export interface Capacity {
  name?: string;
  unit?: string;
  total?: number;
  used?: number;
  available?: number;
}
export const Capacity = S.suspend(() =>
  S.Struct({
    name: S.optional(S.String),
    unit: S.optional(S.String),
    total: S.optional(S.Number),
    used: S.optional(S.Number),
    available: S.optional(S.Number),
  }),
).annotations({ identifier: "Capacity" }) as any as S.Schema<Capacity>;
export type CapacityList = Capacity[];
export const CapacityList = S.Array(Capacity);
export interface SoftwareInformation {
  installedVersion?: string;
  installingVersion?: string;
  installState?: string;
}
export const SoftwareInformation = S.suspend(() =>
  S.Struct({
    installedVersion: S.optional(S.String),
    installingVersion: S.optional(S.String),
    installState: S.optional(S.String),
  }),
).annotations({
  identifier: "SoftwareInformation",
}) as any as S.Schema<SoftwareInformation>;
export interface DeviceSummary {
  managedDeviceId?: string;
  managedDeviceArn?: string;
  associatedWithJob?: string;
  tags?: TagMap;
}
export const DeviceSummary = S.suspend(() =>
  S.Struct({
    managedDeviceId: S.optional(S.String),
    managedDeviceArn: S.optional(S.String),
    associatedWithJob: S.optional(S.String),
    tags: S.optional(TagMap),
  }),
).annotations({
  identifier: "DeviceSummary",
}) as any as S.Schema<DeviceSummary>;
export type DeviceSummaryList = DeviceSummary[];
export const DeviceSummaryList = S.Array(DeviceSummary);
export interface ResourceSummary {
  resourceType: string;
  arn?: string;
  id?: string;
}
export const ResourceSummary = S.suspend(() =>
  S.Struct({
    resourceType: S.String,
    arn: S.optional(S.String),
    id: S.optional(S.String),
  }),
).annotations({
  identifier: "ResourceSummary",
}) as any as S.Schema<ResourceSummary>;
export type ResourceSummaryList = ResourceSummary[];
export const ResourceSummaryList = S.Array(ResourceSummary);
export interface TaskSummary {
  taskId: string;
  taskArn?: string;
  state?: string;
  tags?: TagMap;
}
export const TaskSummary = S.suspend(() =>
  S.Struct({
    taskId: S.String,
    taskArn: S.optional(S.String),
    state: S.optional(S.String),
    tags: S.optional(TagMap),
  }),
).annotations({ identifier: "TaskSummary" }) as any as S.Schema<TaskSummary>;
export type TaskSummaryList = TaskSummary[];
export const TaskSummaryList = S.Array(TaskSummary);
export interface ExecutionSummary {
  taskId?: string;
  executionId?: string;
  managedDeviceId?: string;
  state?: string;
}
export const ExecutionSummary = S.suspend(() =>
  S.Struct({
    taskId: S.optional(S.String),
    executionId: S.optional(S.String),
    managedDeviceId: S.optional(S.String),
    state: S.optional(S.String),
  }),
).annotations({
  identifier: "ExecutionSummary",
}) as any as S.Schema<ExecutionSummary>;
export type ExecutionSummaryList = ExecutionSummary[];
export const ExecutionSummaryList = S.Array(ExecutionSummary);
export interface DescribeDeviceOutput {
  lastReachedOutAt?: Date;
  lastUpdatedAt?: Date;
  tags?: TagMap;
  managedDeviceId?: string;
  managedDeviceArn?: string;
  deviceType?: string;
  associatedWithJob?: string;
  deviceState?: string;
  physicalNetworkInterfaces?: PhysicalNetworkInterfaceList;
  deviceCapacities?: CapacityList;
  software?: SoftwareInformation;
}
export const DescribeDeviceOutput = S.suspend(() =>
  S.Struct({
    lastReachedOutAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
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
  }),
).annotations({
  identifier: "DescribeDeviceOutput",
}) as any as S.Schema<DescribeDeviceOutput>;
export interface ListDevicesOutput {
  devices?: DeviceSummaryList;
  nextToken?: string;
}
export const ListDevicesOutput = S.suspend(() =>
  S.Struct({
    devices: S.optional(DeviceSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDevicesOutput",
}) as any as S.Schema<ListDevicesOutput>;
export interface ListDeviceResourcesOutput {
  resources?: ResourceSummaryList;
  nextToken?: string;
}
export const ListDeviceResourcesOutput = S.suspend(() =>
  S.Struct({
    resources: S.optional(ResourceSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListDeviceResourcesOutput",
}) as any as S.Schema<ListDeviceResourcesOutput>;
export interface CreateTaskOutput {
  taskId?: string;
  taskArn?: string;
}
export const CreateTaskOutput = S.suspend(() =>
  S.Struct({ taskId: S.optional(S.String), taskArn: S.optional(S.String) }),
).annotations({
  identifier: "CreateTaskOutput",
}) as any as S.Schema<CreateTaskOutput>;
export interface ListTasksOutput {
  tasks?: TaskSummaryList;
  nextToken?: string;
}
export const ListTasksOutput = S.suspend(() =>
  S.Struct({
    tasks: S.optional(TaskSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListTasksOutput",
}) as any as S.Schema<ListTasksOutput>;
export interface ListExecutionsOutput {
  executions?: ExecutionSummaryList;
  nextToken?: string;
}
export const ListExecutionsOutput = S.suspend(() =>
  S.Struct({
    executions: S.optional(ExecutionSummaryList),
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListExecutionsOutput",
}) as any as S.Schema<ListExecutionsOutput>;
export interface InstanceState {
  code?: number;
  name?: string;
}
export const InstanceState = S.suspend(() =>
  S.Struct({ code: S.optional(S.Number), name: S.optional(S.String) }),
).annotations({
  identifier: "InstanceState",
}) as any as S.Schema<InstanceState>;
export interface SecurityGroupIdentifier {
  groupId?: string;
  groupName?: string;
}
export const SecurityGroupIdentifier = S.suspend(() =>
  S.Struct({ groupId: S.optional(S.String), groupName: S.optional(S.String) }),
).annotations({
  identifier: "SecurityGroupIdentifier",
}) as any as S.Schema<SecurityGroupIdentifier>;
export type SecurityGroupIdentifierList = SecurityGroupIdentifier[];
export const SecurityGroupIdentifierList = S.Array(SecurityGroupIdentifier);
export interface CpuOptions {
  coreCount?: number;
  threadsPerCore?: number;
}
export const CpuOptions = S.suspend(() =>
  S.Struct({
    coreCount: S.optional(S.Number),
    threadsPerCore: S.optional(S.Number),
  }),
).annotations({ identifier: "CpuOptions" }) as any as S.Schema<CpuOptions>;
export interface EbsInstanceBlockDevice {
  attachTime?: Date;
  deleteOnTermination?: boolean;
  status?: string;
  volumeId?: string;
}
export const EbsInstanceBlockDevice = S.suspend(() =>
  S.Struct({
    attachTime: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    deleteOnTermination: S.optional(S.Boolean),
    status: S.optional(S.String),
    volumeId: S.optional(S.String),
  }),
).annotations({
  identifier: "EbsInstanceBlockDevice",
}) as any as S.Schema<EbsInstanceBlockDevice>;
export interface InstanceBlockDeviceMapping {
  deviceName?: string;
  ebs?: EbsInstanceBlockDevice;
}
export const InstanceBlockDeviceMapping = S.suspend(() =>
  S.Struct({
    deviceName: S.optional(S.String),
    ebs: S.optional(EbsInstanceBlockDevice),
  }),
).annotations({
  identifier: "InstanceBlockDeviceMapping",
}) as any as S.Schema<InstanceBlockDeviceMapping>;
export type InstanceBlockDeviceMappingList = InstanceBlockDeviceMapping[];
export const InstanceBlockDeviceMappingList = S.Array(
  InstanceBlockDeviceMapping,
);
export interface Instance {
  imageId?: string;
  amiLaunchIndex?: number;
  instanceId?: string;
  state?: InstanceState;
  instanceType?: string;
  privateIpAddress?: string;
  publicIpAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
  blockDeviceMappings?: InstanceBlockDeviceMappingList;
  securityGroups?: SecurityGroupIdentifierList;
  cpuOptions?: CpuOptions;
  rootDeviceName?: string;
}
export const Instance = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Instance" }) as any as S.Schema<Instance>;
export interface InstanceSummary {
  instance?: Instance;
  lastUpdatedAt?: Date;
}
export const InstanceSummary = S.suspend(() =>
  S.Struct({
    instance: S.optional(Instance),
    lastUpdatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  }),
).annotations({
  identifier: "InstanceSummary",
}) as any as S.Schema<InstanceSummary>;
export type InstanceSummaryList = InstanceSummary[];
export const InstanceSummaryList = S.Array(InstanceSummary);
export interface DescribeDeviceEc2Output {
  instances?: InstanceSummaryList;
}
export const DescribeDeviceEc2Output = S.suspend(() =>
  S.Struct({ instances: S.optional(InstanceSummaryList) }),
).annotations({
  identifier: "DescribeDeviceEc2Output",
}) as any as S.Schema<DescribeDeviceEc2Output>;

//# Errors
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  { message: S.String },
).pipe(C.withBadRequestError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  { message: S.String },
  T.Retryable({ throttling: true }),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  { message: S.String },
).pipe(C.withQuotaError) {}

//# Operations
/**
 * Removes a tag from a device or task.
 */
export const untagResource: (
  input: UntagResourceInput,
) => Effect.Effect<
  UntagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeTask: (
  input: DescribeTaskInput,
) => Effect.Effect<
  DescribeTaskOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTagsForResource: (
  input: ListTagsForResourceInput,
) => Effect.Effect<
  ListTagsForResourceOutput,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const tagResource: (
  input: TagResourceInput,
) => Effect.Effect<
  TagResourceResponse,
  | InternalServerException
  | ResourceNotFoundException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createTask: (
  input: CreateTaskInput,
) => Effect.Effect<
  CreateTaskOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listTasks: {
  (
    input: ListTasksInput,
  ): Effect.Effect<
    ListTasksOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListTasksInput,
  ) => Stream.Stream<
    ListTasksOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListTasksInput,
  ) => Stream.Stream<
    TaskSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const listExecutions: {
  (
    input: ListExecutionsInput,
  ): Effect.Effect<
    ListExecutionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListExecutionsInput,
  ) => Stream.Stream<
    ListExecutionsOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListExecutionsInput,
  ) => Stream.Stream<
    ExecutionSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Sends a cancel request for a specified task. You can cancel a task only if it's still in a
 * `QUEUED` state. Tasks that are already running can't be cancelled.
 *
 * A task might still run if it's processed from the queue before the
 * `CancelTask` operation changes the task's state.
 */
export const cancelTask: (
  input: CancelTaskInput,
) => Effect.Effect<
  CancelTaskOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeExecution: (
  input: DescribeExecutionInput,
) => Effect.Effect<
  DescribeExecutionOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const describeDevice: (
  input: DescribeDeviceInput,
) => Effect.Effect<
  DescribeDeviceOutput,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listDevices: {
  (
    input: ListDevicesInput,
  ): Effect.Effect<
    ListDevicesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDevicesInput,
  ) => Stream.Stream<
    ListDevicesOutput,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDevicesInput,
  ) => Stream.Stream<
    DeviceSummary,
    | AccessDeniedException
    | InternalServerException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Returns a list of the Amazon Web Services resources available for a device. Currently, Amazon EC2 instances are the only supported resource type.
 */
export const listDeviceResources: {
  (
    input: ListDeviceResourcesInput,
  ): Effect.Effect<
    ListDeviceResourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListDeviceResourcesInput,
  ) => Stream.Stream<
    ListDeviceResourcesOutput,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListDeviceResourcesInput,
  ) => Stream.Stream<
    ResourceSummary,
    | AccessDeniedException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const describeDeviceEc2Instances: (
  input: DescribeDeviceEc2Input,
) => Effect.Effect<
  DescribeDeviceEc2Output,
  | AccessDeniedException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeDeviceEc2Input,
  output: DescribeDeviceEc2Output,
  errors: [
    AccessDeniedException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
