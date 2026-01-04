import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
const ns = T.XmlNamespace("http://ecs.amazonaws.com/doc/2014-11-13/");
const svc = T.AwsApiService({
  sdkId: "ECS",
  serviceShapeName: "AmazonEC2ContainerServiceV20141113",
});
const auth = T.AwsAuthSigv4({ name: "ecs" });
const ver = T.ServiceVersion("2014-11-13");
const proto = T.AwsProtocolsAwsJson1_1();
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
                        url: "https://ecs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                        url: "https://ecs-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://ecs.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://ecs.{Region}.{PartitionResult#dnsSuffix}",
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
export const StringList = S.Array(S.String);
export const CapacityProviderFieldList = S.Array(S.String);
export const ClusterFieldList = S.Array(S.String);
export const ContainerInstanceFieldList = S.Array(S.String);
export const ExpressGatewayServiceIncludeList = S.Array(S.String);
export const ServiceFieldList = S.Array(S.String);
export const TaskDefinitionFieldList = S.Array(S.String);
export const TaskFieldList = S.Array(S.String);
export const TaskSetFieldList = S.Array(S.String);
export const ServiceDeploymentStatusList = S.Array(S.String);
export const CompatibilityList = S.Array(S.String);
export const TagKeys = S.Array(S.String);
export class DeleteAccountSettingRequest extends S.Class<DeleteAccountSettingRequest>(
  "DeleteAccountSettingRequest",
)(
  { name: S.String, principalArn: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCapacityProviderRequest extends S.Class<DeleteCapacityProviderRequest>(
  "DeleteCapacityProviderRequest",
)(
  { capacityProvider: S.String, cluster: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterRequest extends S.Class<DeleteClusterRequest>(
  "DeleteClusterRequest",
)(
  { cluster: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteExpressGatewayServiceRequest extends S.Class<DeleteExpressGatewayServiceRequest>(
  "DeleteExpressGatewayServiceRequest",
)(
  { serviceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServiceRequest extends S.Class<DeleteServiceRequest>(
  "DeleteServiceRequest",
)(
  {
    cluster: S.optional(S.String),
    service: S.String,
    force: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTaskDefinitionsRequest extends S.Class<DeleteTaskDefinitionsRequest>(
  "DeleteTaskDefinitionsRequest",
)(
  { taskDefinitions: StringList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteTaskSetRequest extends S.Class<DeleteTaskSetRequest>(
  "DeleteTaskSetRequest",
)(
  {
    cluster: S.String,
    service: S.String,
    taskSet: S.String,
    force: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterContainerInstanceRequest extends S.Class<DeregisterContainerInstanceRequest>(
  "DeregisterContainerInstanceRequest",
)(
  {
    cluster: S.optional(S.String),
    containerInstance: S.String,
    force: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeregisterTaskDefinitionRequest extends S.Class<DeregisterTaskDefinitionRequest>(
  "DeregisterTaskDefinitionRequest",
)(
  { taskDefinition: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCapacityProvidersRequest extends S.Class<DescribeCapacityProvidersRequest>(
  "DescribeCapacityProvidersRequest",
)(
  {
    capacityProviders: S.optional(StringList),
    cluster: S.optional(S.String),
    include: S.optional(CapacityProviderFieldList),
    maxResults: S.optional(S.Number),
    nextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeClustersRequest extends S.Class<DescribeClustersRequest>(
  "DescribeClustersRequest",
)(
  { clusters: S.optional(StringList), include: S.optional(ClusterFieldList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeContainerInstancesRequest extends S.Class<DescribeContainerInstancesRequest>(
  "DescribeContainerInstancesRequest",
)(
  {
    cluster: S.optional(S.String),
    containerInstances: StringList,
    include: S.optional(ContainerInstanceFieldList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeExpressGatewayServiceRequest extends S.Class<DescribeExpressGatewayServiceRequest>(
  "DescribeExpressGatewayServiceRequest",
)(
  {
    serviceArn: S.String,
    include: S.optional(ExpressGatewayServiceIncludeList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeServiceDeploymentsRequest extends S.Class<DescribeServiceDeploymentsRequest>(
  "DescribeServiceDeploymentsRequest",
)(
  { serviceDeploymentArns: StringList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeServiceRevisionsRequest extends S.Class<DescribeServiceRevisionsRequest>(
  "DescribeServiceRevisionsRequest",
)(
  { serviceRevisionArns: StringList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeServicesRequest extends S.Class<DescribeServicesRequest>(
  "DescribeServicesRequest",
)(
  {
    cluster: S.optional(S.String),
    services: StringList,
    include: S.optional(ServiceFieldList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTaskDefinitionRequest extends S.Class<DescribeTaskDefinitionRequest>(
  "DescribeTaskDefinitionRequest",
)(
  { taskDefinition: S.String, include: S.optional(TaskDefinitionFieldList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTasksRequest extends S.Class<DescribeTasksRequest>(
  "DescribeTasksRequest",
)(
  {
    cluster: S.optional(S.String),
    tasks: StringList,
    include: S.optional(TaskFieldList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeTaskSetsRequest extends S.Class<DescribeTaskSetsRequest>(
  "DescribeTaskSetsRequest",
)(
  {
    cluster: S.String,
    service: S.String,
    taskSets: S.optional(StringList),
    include: S.optional(TaskSetFieldList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DiscoverPollEndpointRequest extends S.Class<DiscoverPollEndpointRequest>(
  "DiscoverPollEndpointRequest",
)(
  { containerInstance: S.optional(S.String), cluster: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExecuteCommandRequest extends S.Class<ExecuteCommandRequest>(
  "ExecuteCommandRequest",
)(
  {
    cluster: S.optional(S.String),
    container: S.optional(S.String),
    command: S.String,
    interactive: S.Boolean,
    task: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class GetTaskProtectionRequest extends S.Class<GetTaskProtectionRequest>(
  "GetTaskProtectionRequest",
)(
  { cluster: S.String, tasks: S.optional(StringList) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAccountSettingsRequest extends S.Class<ListAccountSettingsRequest>(
  "ListAccountSettingsRequest",
)(
  {
    name: S.optional(S.String),
    value: S.optional(S.String),
    principalArn: S.optional(S.String),
    effectiveSettings: S.optional(S.Boolean),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAttributesRequest extends S.Class<ListAttributesRequest>(
  "ListAttributesRequest",
)(
  {
    cluster: S.optional(S.String),
    targetType: S.String,
    attributeName: S.optional(S.String),
    attributeValue: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListClustersRequest extends S.Class<ListClustersRequest>(
  "ListClustersRequest",
)(
  { nextToken: S.optional(S.String), maxResults: S.optional(S.Number) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListContainerInstancesRequest extends S.Class<ListContainerInstancesRequest>(
  "ListContainerInstancesRequest",
)(
  {
    cluster: S.optional(S.String),
    filter: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    status: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServicesRequest extends S.Class<ListServicesRequest>(
  "ListServicesRequest",
)(
  {
    cluster: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    launchType: S.optional(S.String),
    schedulingStrategy: S.optional(S.String),
    resourceManagementType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServicesByNamespaceRequest extends S.Class<ListServicesByNamespaceRequest>(
  "ListServicesByNamespaceRequest",
)(
  {
    namespace: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTaskDefinitionFamiliesRequest extends S.Class<ListTaskDefinitionFamiliesRequest>(
  "ListTaskDefinitionFamiliesRequest",
)(
  {
    familyPrefix: S.optional(S.String),
    status: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTaskDefinitionsRequest extends S.Class<ListTaskDefinitionsRequest>(
  "ListTaskDefinitionsRequest",
)(
  {
    familyPrefix: S.optional(S.String),
    status: S.optional(S.String),
    sort: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTasksRequest extends S.Class<ListTasksRequest>(
  "ListTasksRequest",
)(
  {
    cluster: S.optional(S.String),
    containerInstance: S.optional(S.String),
    family: S.optional(S.String),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
    startedBy: S.optional(S.String),
    serviceName: S.optional(S.String),
    desiredStatus: S.optional(S.String),
    launchType: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutAccountSettingRequest extends S.Class<PutAccountSettingRequest>(
  "PutAccountSettingRequest",
)(
  { name: S.String, value: S.String, principalArn: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PutAccountSettingDefaultRequest extends S.Class<PutAccountSettingDefaultRequest>(
  "PutAccountSettingDefaultRequest",
)(
  { name: S.String, value: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Attribute extends S.Class<Attribute>("Attribute")({
  name: S.String,
  value: S.optional(S.String),
  targetType: S.optional(S.String),
  targetId: S.optional(S.String),
}) {}
export const Attributes = S.Array(Attribute);
export class PutAttributesRequest extends S.Class<PutAttributesRequest>(
  "PutAttributesRequest",
)(
  { cluster: S.optional(S.String), attributes: Attributes },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CapacityProviderStrategyItem extends S.Class<CapacityProviderStrategyItem>(
  "CapacityProviderStrategyItem",
)({
  capacityProvider: S.String,
  weight: S.optional(S.Number),
  base: S.optional(S.Number),
}) {}
export const CapacityProviderStrategy = S.Array(CapacityProviderStrategyItem);
export class PutClusterCapacityProvidersRequest extends S.Class<PutClusterCapacityProvidersRequest>(
  "PutClusterCapacityProvidersRequest",
)(
  {
    cluster: S.String,
    capacityProviders: StringList,
    defaultCapacityProviderStrategy: CapacityProviderStrategy,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AwsVpcConfiguration extends S.Class<AwsVpcConfiguration>(
  "AwsVpcConfiguration",
)({
  subnets: StringList,
  securityGroups: S.optional(StringList),
  assignPublicIp: S.optional(S.String),
}) {}
export class NetworkConfiguration extends S.Class<NetworkConfiguration>(
  "NetworkConfiguration",
)({ awsvpcConfiguration: S.optional(AwsVpcConfiguration) }) {}
export class KeyValuePair extends S.Class<KeyValuePair>("KeyValuePair")({
  name: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const EnvironmentVariables = S.Array(KeyValuePair);
export class EnvironmentFile extends S.Class<EnvironmentFile>(
  "EnvironmentFile",
)({ value: S.String, type: S.String }) {}
export const EnvironmentFiles = S.Array(EnvironmentFile);
export class ResourceRequirement extends S.Class<ResourceRequirement>(
  "ResourceRequirement",
)({ value: S.String, type: S.String }) {}
export const ResourceRequirements = S.Array(ResourceRequirement);
export class ContainerOverride extends S.Class<ContainerOverride>(
  "ContainerOverride",
)({
  name: S.optional(S.String),
  command: S.optional(StringList),
  environment: S.optional(EnvironmentVariables),
  environmentFiles: S.optional(EnvironmentFiles),
  cpu: S.optional(S.Number),
  memory: S.optional(S.Number),
  memoryReservation: S.optional(S.Number),
  resourceRequirements: S.optional(ResourceRequirements),
}) {}
export const ContainerOverrides = S.Array(ContainerOverride);
export class InferenceAcceleratorOverride extends S.Class<InferenceAcceleratorOverride>(
  "InferenceAcceleratorOverride",
)({ deviceName: S.optional(S.String), deviceType: S.optional(S.String) }) {}
export const InferenceAcceleratorOverrides = S.Array(
  InferenceAcceleratorOverride,
);
export class EphemeralStorage extends S.Class<EphemeralStorage>(
  "EphemeralStorage",
)({ sizeInGiB: S.Number }) {}
export class TaskOverride extends S.Class<TaskOverride>("TaskOverride")({
  containerOverrides: S.optional(ContainerOverrides),
  cpu: S.optional(S.String),
  inferenceAcceleratorOverrides: S.optional(InferenceAcceleratorOverrides),
  executionRoleArn: S.optional(S.String),
  memory: S.optional(S.String),
  taskRoleArn: S.optional(S.String),
  ephemeralStorage: S.optional(EphemeralStorage),
}) {}
export class Tag extends S.Class<Tag>("Tag")({
  key: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const Tags = S.Array(Tag);
export class EBSTagSpecification extends S.Class<EBSTagSpecification>(
  "EBSTagSpecification",
)({
  resourceType: S.String,
  tags: S.optional(Tags),
  propagateTags: S.optional(S.String),
}) {}
export const EBSTagSpecifications = S.Array(EBSTagSpecification);
export class TaskManagedEBSVolumeTerminationPolicy extends S.Class<TaskManagedEBSVolumeTerminationPolicy>(
  "TaskManagedEBSVolumeTerminationPolicy",
)({ deleteOnTermination: S.Boolean }) {}
export class TaskManagedEBSVolumeConfiguration extends S.Class<TaskManagedEBSVolumeConfiguration>(
  "TaskManagedEBSVolumeConfiguration",
)({
  encrypted: S.optional(S.Boolean),
  kmsKeyId: S.optional(S.String),
  volumeType: S.optional(S.String),
  sizeInGiB: S.optional(S.Number),
  snapshotId: S.optional(S.String),
  volumeInitializationRate: S.optional(S.Number),
  iops: S.optional(S.Number),
  throughput: S.optional(S.Number),
  tagSpecifications: S.optional(EBSTagSpecifications),
  roleArn: S.String,
  terminationPolicy: S.optional(TaskManagedEBSVolumeTerminationPolicy),
  filesystemType: S.optional(S.String),
}) {}
export class TaskVolumeConfiguration extends S.Class<TaskVolumeConfiguration>(
  "TaskVolumeConfiguration",
)({
  name: S.String,
  managedEBSVolume: S.optional(TaskManagedEBSVolumeConfiguration),
}) {}
export const TaskVolumeConfigurations = S.Array(TaskVolumeConfiguration);
export class StartTaskRequest extends S.Class<StartTaskRequest>(
  "StartTaskRequest",
)(
  {
    cluster: S.optional(S.String),
    containerInstances: StringList,
    enableECSManagedTags: S.optional(S.Boolean),
    enableExecuteCommand: S.optional(S.Boolean),
    group: S.optional(S.String),
    networkConfiguration: S.optional(NetworkConfiguration),
    overrides: S.optional(TaskOverride),
    propagateTags: S.optional(S.String),
    referenceId: S.optional(S.String),
    startedBy: S.optional(S.String),
    tags: S.optional(Tags),
    taskDefinition: S.String,
    volumeConfigurations: S.optional(TaskVolumeConfigurations),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopServiceDeploymentRequest extends S.Class<StopServiceDeploymentRequest>(
  "StopServiceDeploymentRequest",
)(
  { serviceDeploymentArn: S.String, stopType: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class StopTaskRequest extends S.Class<StopTaskRequest>(
  "StopTaskRequest",
)(
  {
    cluster: S.optional(S.String),
    task: S.String,
    reason: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: Tags },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}, ns) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String, tagKeys: TagKeys },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}, ns) {}
export class ClusterSetting extends S.Class<ClusterSetting>("ClusterSetting")({
  name: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const ClusterSettings = S.Array(ClusterSetting);
export class ExecuteCommandLogConfiguration extends S.Class<ExecuteCommandLogConfiguration>(
  "ExecuteCommandLogConfiguration",
)({
  cloudWatchLogGroupName: S.optional(S.String),
  cloudWatchEncryptionEnabled: S.optional(S.Boolean),
  s3BucketName: S.optional(S.String),
  s3EncryptionEnabled: S.optional(S.Boolean),
  s3KeyPrefix: S.optional(S.String),
}) {}
export class ExecuteCommandConfiguration extends S.Class<ExecuteCommandConfiguration>(
  "ExecuteCommandConfiguration",
)({
  kmsKeyId: S.optional(S.String),
  logging: S.optional(S.String),
  logConfiguration: S.optional(ExecuteCommandLogConfiguration),
}) {}
export class ManagedStorageConfiguration extends S.Class<ManagedStorageConfiguration>(
  "ManagedStorageConfiguration",
)({
  kmsKeyId: S.optional(S.String),
  fargateEphemeralStorageKmsKeyId: S.optional(S.String),
}) {}
export class ClusterConfiguration extends S.Class<ClusterConfiguration>(
  "ClusterConfiguration",
)({
  executeCommandConfiguration: S.optional(ExecuteCommandConfiguration),
  managedStorageConfiguration: S.optional(ManagedStorageConfiguration),
}) {}
export class ClusterServiceConnectDefaultsRequest extends S.Class<ClusterServiceConnectDefaultsRequest>(
  "ClusterServiceConnectDefaultsRequest",
)({ namespace: S.String }) {}
export class UpdateClusterRequest extends S.Class<UpdateClusterRequest>(
  "UpdateClusterRequest",
)(
  {
    cluster: S.String,
    settings: S.optional(ClusterSettings),
    configuration: S.optional(ClusterConfiguration),
    serviceConnectDefaults: S.optional(ClusterServiceConnectDefaultsRequest),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateClusterSettingsRequest extends S.Class<UpdateClusterSettingsRequest>(
  "UpdateClusterSettingsRequest",
)(
  { cluster: S.String, settings: ClusterSettings },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateContainerAgentRequest extends S.Class<UpdateContainerAgentRequest>(
  "UpdateContainerAgentRequest",
)(
  { cluster: S.optional(S.String), containerInstance: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateContainerInstancesStateRequest extends S.Class<UpdateContainerInstancesStateRequest>(
  "UpdateContainerInstancesStateRequest",
)(
  {
    cluster: S.optional(S.String),
    containerInstances: StringList,
    status: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExpressGatewayServiceAwsLogsConfiguration extends S.Class<ExpressGatewayServiceAwsLogsConfiguration>(
  "ExpressGatewayServiceAwsLogsConfiguration",
)({ logGroup: S.String, logStreamPrefix: S.String }) {}
export class ExpressGatewayRepositoryCredentials extends S.Class<ExpressGatewayRepositoryCredentials>(
  "ExpressGatewayRepositoryCredentials",
)({ credentialsParameter: S.optional(S.String) }) {}
export class Secret extends S.Class<Secret>("Secret")({
  name: S.String,
  valueFrom: S.String,
}) {}
export const SecretList = S.Array(Secret);
export class ExpressGatewayContainer extends S.Class<ExpressGatewayContainer>(
  "ExpressGatewayContainer",
)({
  image: S.String,
  containerPort: S.optional(S.Number),
  awsLogsConfiguration: S.optional(ExpressGatewayServiceAwsLogsConfiguration),
  repositoryCredentials: S.optional(ExpressGatewayRepositoryCredentials),
  command: S.optional(StringList),
  environment: S.optional(EnvironmentVariables),
  secrets: S.optional(SecretList),
}) {}
export class ExpressGatewayServiceNetworkConfiguration extends S.Class<ExpressGatewayServiceNetworkConfiguration>(
  "ExpressGatewayServiceNetworkConfiguration",
)({
  securityGroups: S.optional(StringList),
  subnets: S.optional(StringList),
}) {}
export class ExpressGatewayScalingTarget extends S.Class<ExpressGatewayScalingTarget>(
  "ExpressGatewayScalingTarget",
)({
  minTaskCount: S.optional(S.Number),
  maxTaskCount: S.optional(S.Number),
  autoScalingMetric: S.optional(S.String),
  autoScalingTargetValue: S.optional(S.Number),
}) {}
export class UpdateExpressGatewayServiceRequest extends S.Class<UpdateExpressGatewayServiceRequest>(
  "UpdateExpressGatewayServiceRequest",
)(
  {
    serviceArn: S.String,
    executionRoleArn: S.optional(S.String),
    healthCheckPath: S.optional(S.String),
    primaryContainer: S.optional(ExpressGatewayContainer),
    taskRoleArn: S.optional(S.String),
    networkConfiguration: S.optional(ExpressGatewayServiceNetworkConfiguration),
    cpu: S.optional(S.String),
    memory: S.optional(S.String),
    scalingTarget: S.optional(ExpressGatewayScalingTarget),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeploymentCircuitBreaker extends S.Class<DeploymentCircuitBreaker>(
  "DeploymentCircuitBreaker",
)({ enable: S.Boolean, rollback: S.Boolean }) {}
export class DeploymentAlarms extends S.Class<DeploymentAlarms>(
  "DeploymentAlarms",
)({ alarmNames: StringList, rollback: S.Boolean, enable: S.Boolean }) {}
export const DeploymentLifecycleHookStageList = S.Array(S.String);
export class DeploymentLifecycleHook extends S.Class<DeploymentLifecycleHook>(
  "DeploymentLifecycleHook",
)({
  hookTargetArn: S.optional(S.String),
  roleArn: S.optional(S.String),
  lifecycleStages: S.optional(DeploymentLifecycleHookStageList),
  hookDetails: S.optional(S.Any),
}) {}
export const DeploymentLifecycleHookList = S.Array(DeploymentLifecycleHook);
export class LinearConfiguration extends S.Class<LinearConfiguration>(
  "LinearConfiguration",
)({
  stepPercent: S.optional(S.Number),
  stepBakeTimeInMinutes: S.optional(S.Number),
}) {}
export class CanaryConfiguration extends S.Class<CanaryConfiguration>(
  "CanaryConfiguration",
)({
  canaryPercent: S.optional(S.Number),
  canaryBakeTimeInMinutes: S.optional(S.Number),
}) {}
export class DeploymentConfiguration extends S.Class<DeploymentConfiguration>(
  "DeploymentConfiguration",
)({
  deploymentCircuitBreaker: S.optional(DeploymentCircuitBreaker),
  maximumPercent: S.optional(S.Number),
  minimumHealthyPercent: S.optional(S.Number),
  alarms: S.optional(DeploymentAlarms),
  strategy: S.optional(S.String),
  bakeTimeInMinutes: S.optional(S.Number),
  lifecycleHooks: S.optional(DeploymentLifecycleHookList),
  linearConfiguration: S.optional(LinearConfiguration),
  canaryConfiguration: S.optional(CanaryConfiguration),
}) {}
export class PlacementConstraint extends S.Class<PlacementConstraint>(
  "PlacementConstraint",
)({ type: S.optional(S.String), expression: S.optional(S.String) }) {}
export const PlacementConstraints = S.Array(PlacementConstraint);
export class PlacementStrategy extends S.Class<PlacementStrategy>(
  "PlacementStrategy",
)({ type: S.optional(S.String), field: S.optional(S.String) }) {}
export const PlacementStrategies = S.Array(PlacementStrategy);
export class DeploymentController extends S.Class<DeploymentController>(
  "DeploymentController",
)({ type: S.String }) {}
export class AdvancedConfiguration extends S.Class<AdvancedConfiguration>(
  "AdvancedConfiguration",
)({
  alternateTargetGroupArn: S.optional(S.String),
  productionListenerRule: S.optional(S.String),
  testListenerRule: S.optional(S.String),
  roleArn: S.optional(S.String),
}) {}
export class LoadBalancer extends S.Class<LoadBalancer>("LoadBalancer")({
  targetGroupArn: S.optional(S.String),
  loadBalancerName: S.optional(S.String),
  containerName: S.optional(S.String),
  containerPort: S.optional(S.Number),
  advancedConfiguration: S.optional(AdvancedConfiguration),
}) {}
export const LoadBalancers = S.Array(LoadBalancer);
export class ServiceRegistry extends S.Class<ServiceRegistry>(
  "ServiceRegistry",
)({
  registryArn: S.optional(S.String),
  port: S.optional(S.Number),
  containerName: S.optional(S.String),
  containerPort: S.optional(S.Number),
}) {}
export const ServiceRegistries = S.Array(ServiceRegistry);
export class ServiceConnectTestTrafficHeaderMatchRules extends S.Class<ServiceConnectTestTrafficHeaderMatchRules>(
  "ServiceConnectTestTrafficHeaderMatchRules",
)({ exact: S.String }) {}
export class ServiceConnectTestTrafficHeaderRules extends S.Class<ServiceConnectTestTrafficHeaderRules>(
  "ServiceConnectTestTrafficHeaderRules",
)({
  name: S.String,
  value: S.optional(ServiceConnectTestTrafficHeaderMatchRules),
}) {}
export class ServiceConnectTestTrafficRules extends S.Class<ServiceConnectTestTrafficRules>(
  "ServiceConnectTestTrafficRules",
)({ header: ServiceConnectTestTrafficHeaderRules }) {}
export class ServiceConnectClientAlias extends S.Class<ServiceConnectClientAlias>(
  "ServiceConnectClientAlias",
)({
  port: S.Number,
  dnsName: S.optional(S.String),
  testTrafficRules: S.optional(ServiceConnectTestTrafficRules),
}) {}
export const ServiceConnectClientAliasList = S.Array(ServiceConnectClientAlias);
export class TimeoutConfiguration extends S.Class<TimeoutConfiguration>(
  "TimeoutConfiguration",
)({
  idleTimeoutSeconds: S.optional(S.Number),
  perRequestTimeoutSeconds: S.optional(S.Number),
}) {}
export class ServiceConnectTlsCertificateAuthority extends S.Class<ServiceConnectTlsCertificateAuthority>(
  "ServiceConnectTlsCertificateAuthority",
)({ awsPcaAuthorityArn: S.optional(S.String) }) {}
export class ServiceConnectTlsConfiguration extends S.Class<ServiceConnectTlsConfiguration>(
  "ServiceConnectTlsConfiguration",
)({
  issuerCertificateAuthority: ServiceConnectTlsCertificateAuthority,
  kmsKey: S.optional(S.String),
  roleArn: S.optional(S.String),
}) {}
export class ServiceConnectService extends S.Class<ServiceConnectService>(
  "ServiceConnectService",
)({
  portName: S.String,
  discoveryName: S.optional(S.String),
  clientAliases: S.optional(ServiceConnectClientAliasList),
  ingressPortOverride: S.optional(S.Number),
  timeout: S.optional(TimeoutConfiguration),
  tls: S.optional(ServiceConnectTlsConfiguration),
}) {}
export const ServiceConnectServiceList = S.Array(ServiceConnectService);
export const LogConfigurationOptionsMap = S.Record({
  key: S.String,
  value: S.String,
});
export class LogConfiguration extends S.Class<LogConfiguration>(
  "LogConfiguration",
)({
  logDriver: S.String,
  options: S.optional(LogConfigurationOptionsMap),
  secretOptions: S.optional(SecretList),
}) {}
export class ServiceConnectAccessLogConfiguration extends S.Class<ServiceConnectAccessLogConfiguration>(
  "ServiceConnectAccessLogConfiguration",
)({ format: S.String, includeQueryParameters: S.optional(S.String) }) {}
export class ServiceConnectConfiguration extends S.Class<ServiceConnectConfiguration>(
  "ServiceConnectConfiguration",
)({
  enabled: S.Boolean,
  namespace: S.optional(S.String),
  services: S.optional(ServiceConnectServiceList),
  logConfiguration: S.optional(LogConfiguration),
  accessLogConfiguration: S.optional(ServiceConnectAccessLogConfiguration),
}) {}
export class ServiceManagedEBSVolumeConfiguration extends S.Class<ServiceManagedEBSVolumeConfiguration>(
  "ServiceManagedEBSVolumeConfiguration",
)({
  encrypted: S.optional(S.Boolean),
  kmsKeyId: S.optional(S.String),
  volumeType: S.optional(S.String),
  sizeInGiB: S.optional(S.Number),
  snapshotId: S.optional(S.String),
  volumeInitializationRate: S.optional(S.Number),
  iops: S.optional(S.Number),
  throughput: S.optional(S.Number),
  tagSpecifications: S.optional(EBSTagSpecifications),
  roleArn: S.String,
  filesystemType: S.optional(S.String),
}) {}
export class ServiceVolumeConfiguration extends S.Class<ServiceVolumeConfiguration>(
  "ServiceVolumeConfiguration",
)({
  name: S.String,
  managedEBSVolume: S.optional(ServiceManagedEBSVolumeConfiguration),
}) {}
export const ServiceVolumeConfigurations = S.Array(ServiceVolumeConfiguration);
export class VpcLatticeConfiguration extends S.Class<VpcLatticeConfiguration>(
  "VpcLatticeConfiguration",
)({ roleArn: S.String, targetGroupArn: S.String, portName: S.String }) {}
export const VpcLatticeConfigurations = S.Array(VpcLatticeConfiguration);
export class UpdateServiceRequest extends S.Class<UpdateServiceRequest>(
  "UpdateServiceRequest",
)(
  {
    cluster: S.optional(S.String),
    service: S.String,
    desiredCount: S.optional(S.Number),
    taskDefinition: S.optional(S.String),
    capacityProviderStrategy: S.optional(CapacityProviderStrategy),
    deploymentConfiguration: S.optional(DeploymentConfiguration),
    availabilityZoneRebalancing: S.optional(S.String),
    networkConfiguration: S.optional(NetworkConfiguration),
    placementConstraints: S.optional(PlacementConstraints),
    placementStrategy: S.optional(PlacementStrategies),
    platformVersion: S.optional(S.String),
    forceNewDeployment: S.optional(S.Boolean),
    healthCheckGracePeriodSeconds: S.optional(S.Number),
    deploymentController: S.optional(DeploymentController),
    enableExecuteCommand: S.optional(S.Boolean),
    enableECSManagedTags: S.optional(S.Boolean),
    loadBalancers: S.optional(LoadBalancers),
    propagateTags: S.optional(S.String),
    serviceRegistries: S.optional(ServiceRegistries),
    serviceConnectConfiguration: S.optional(ServiceConnectConfiguration),
    volumeConfigurations: S.optional(ServiceVolumeConfigurations),
    vpcLatticeConfigurations: S.optional(VpcLatticeConfigurations),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateServicePrimaryTaskSetRequest extends S.Class<UpdateServicePrimaryTaskSetRequest>(
  "UpdateServicePrimaryTaskSetRequest",
)(
  { cluster: S.String, service: S.String, primaryTaskSet: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateTaskProtectionRequest extends S.Class<UpdateTaskProtectionRequest>(
  "UpdateTaskProtectionRequest",
)(
  {
    cluster: S.String,
    tasks: StringList,
    protectionEnabled: S.Boolean,
    expiresInMinutes: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Scale extends S.Class<Scale>("Scale")({
  value: S.optional(S.Number),
  unit: S.optional(S.String),
}) {}
export class UpdateTaskSetRequest extends S.Class<UpdateTaskSetRequest>(
  "UpdateTaskSetRequest",
)(
  { cluster: S.String, service: S.String, taskSet: S.String, scale: Scale },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const ProxyConfigurationProperties = S.Array(KeyValuePair);
export class ManagedScaling extends S.Class<ManagedScaling>("ManagedScaling")({
  status: S.optional(S.String),
  targetCapacity: S.optional(S.Number),
  minimumScalingStepSize: S.optional(S.Number),
  maximumScalingStepSize: S.optional(S.Number),
  instanceWarmupPeriod: S.optional(S.Number),
}) {}
export class AutoScalingGroupProvider extends S.Class<AutoScalingGroupProvider>(
  "AutoScalingGroupProvider",
)({
  autoScalingGroupArn: S.String,
  managedScaling: S.optional(ManagedScaling),
  managedTerminationProtection: S.optional(S.String),
  managedDraining: S.optional(S.String),
}) {}
export class ManagedInstancesNetworkConfiguration extends S.Class<ManagedInstancesNetworkConfiguration>(
  "ManagedInstancesNetworkConfiguration",
)({
  subnets: S.optional(StringList),
  securityGroups: S.optional(StringList),
}) {}
export class ManagedInstancesStorageConfiguration extends S.Class<ManagedInstancesStorageConfiguration>(
  "ManagedInstancesStorageConfiguration",
)({ storageSizeGiB: S.optional(S.Number) }) {}
export class VCpuCountRangeRequest extends S.Class<VCpuCountRangeRequest>(
  "VCpuCountRangeRequest",
)({ min: S.Number, max: S.optional(S.Number) }) {}
export class MemoryMiBRequest extends S.Class<MemoryMiBRequest>(
  "MemoryMiBRequest",
)({ min: S.Number, max: S.optional(S.Number) }) {}
export const CpuManufacturerSet = S.Array(S.String.pipe(T.XmlName("item")));
export class MemoryGiBPerVCpuRequest extends S.Class<MemoryGiBPerVCpuRequest>(
  "MemoryGiBPerVCpuRequest",
)({ min: S.optional(S.Number), max: S.optional(S.Number) }) {}
export const ExcludedInstanceTypeSet = S.Array(
  S.String.pipe(T.XmlName("item")),
);
export const InstanceGenerationSet = S.Array(S.String.pipe(T.XmlName("item")));
export class NetworkInterfaceCountRequest extends S.Class<NetworkInterfaceCountRequest>(
  "NetworkInterfaceCountRequest",
)({ min: S.optional(S.Number), max: S.optional(S.Number) }) {}
export const LocalStorageTypeSet = S.Array(S.String.pipe(T.XmlName("item")));
export class TotalLocalStorageGBRequest extends S.Class<TotalLocalStorageGBRequest>(
  "TotalLocalStorageGBRequest",
)({ min: S.optional(S.Number), max: S.optional(S.Number) }) {}
export class BaselineEbsBandwidthMbpsRequest extends S.Class<BaselineEbsBandwidthMbpsRequest>(
  "BaselineEbsBandwidthMbpsRequest",
)({ min: S.optional(S.Number), max: S.optional(S.Number) }) {}
export const AcceleratorTypeSet = S.Array(S.String.pipe(T.XmlName("item")));
export class AcceleratorCountRequest extends S.Class<AcceleratorCountRequest>(
  "AcceleratorCountRequest",
)({ min: S.optional(S.Number), max: S.optional(S.Number) }) {}
export const AcceleratorManufacturerSet = S.Array(
  S.String.pipe(T.XmlName("item")),
);
export const AcceleratorNameSet = S.Array(S.String.pipe(T.XmlName("item")));
export class AcceleratorTotalMemoryMiBRequest extends S.Class<AcceleratorTotalMemoryMiBRequest>(
  "AcceleratorTotalMemoryMiBRequest",
)({ min: S.optional(S.Number), max: S.optional(S.Number) }) {}
export class NetworkBandwidthGbpsRequest extends S.Class<NetworkBandwidthGbpsRequest>(
  "NetworkBandwidthGbpsRequest",
)({ min: S.optional(S.Number), max: S.optional(S.Number) }) {}
export const AllowedInstanceTypeSet = S.Array(S.String.pipe(T.XmlName("item")));
export class InstanceRequirementsRequest extends S.Class<InstanceRequirementsRequest>(
  "InstanceRequirementsRequest",
)({
  vCpuCount: VCpuCountRangeRequest,
  memoryMiB: MemoryMiBRequest,
  cpuManufacturers: S.optional(CpuManufacturerSet).pipe(
    T.XmlName("CpuManufacturer"),
  ),
  memoryGiBPerVCpu: S.optional(MemoryGiBPerVCpuRequest),
  excludedInstanceTypes: S.optional(ExcludedInstanceTypeSet).pipe(
    T.XmlName("ExcludedInstanceType"),
  ),
  instanceGenerations: S.optional(InstanceGenerationSet).pipe(
    T.XmlName("InstanceGeneration"),
  ),
  spotMaxPricePercentageOverLowestPrice: S.optional(S.Number),
  onDemandMaxPricePercentageOverLowestPrice: S.optional(S.Number),
  bareMetal: S.optional(S.String),
  burstablePerformance: S.optional(S.String),
  requireHibernateSupport: S.optional(S.Boolean),
  networkInterfaceCount: S.optional(NetworkInterfaceCountRequest),
  localStorage: S.optional(S.String),
  localStorageTypes: S.optional(LocalStorageTypeSet).pipe(
    T.XmlName("LocalStorageType"),
  ),
  totalLocalStorageGB: S.optional(TotalLocalStorageGBRequest),
  baselineEbsBandwidthMbps: S.optional(BaselineEbsBandwidthMbpsRequest),
  acceleratorTypes: S.optional(AcceleratorTypeSet).pipe(
    T.XmlName("AcceleratorType"),
  ),
  acceleratorCount: S.optional(AcceleratorCountRequest),
  acceleratorManufacturers: S.optional(AcceleratorManufacturerSet).pipe(
    T.XmlName("AcceleratorManufacturer"),
  ),
  acceleratorNames: S.optional(AcceleratorNameSet).pipe(
    T.XmlName("AcceleratorName"),
  ),
  acceleratorTotalMemoryMiB: S.optional(AcceleratorTotalMemoryMiBRequest),
  networkBandwidthGbps: S.optional(NetworkBandwidthGbpsRequest),
  allowedInstanceTypes: S.optional(AllowedInstanceTypeSet).pipe(
    T.XmlName("AllowedInstanceType"),
  ),
  maxSpotPriceAsPercentageOfOptimalOnDemandPrice: S.optional(S.Number),
}) {}
export class InstanceLaunchTemplate extends S.Class<InstanceLaunchTemplate>(
  "InstanceLaunchTemplate",
)({
  ec2InstanceProfileArn: S.String,
  networkConfiguration: ManagedInstancesNetworkConfiguration,
  storageConfiguration: S.optional(ManagedInstancesStorageConfiguration),
  monitoring: S.optional(S.String),
  capacityOptionType: S.optional(S.String),
  instanceRequirements: S.optional(InstanceRequirementsRequest),
}) {}
export class InfrastructureOptimization extends S.Class<InfrastructureOptimization>(
  "InfrastructureOptimization",
)({ scaleInAfter: S.optional(S.Number) }) {}
export class ManagedInstancesProvider extends S.Class<ManagedInstancesProvider>(
  "ManagedInstancesProvider",
)({
  infrastructureRoleArn: S.optional(S.String),
  instanceLaunchTemplate: S.optional(InstanceLaunchTemplate),
  propagateTags: S.optional(S.String),
  infrastructureOptimization: S.optional(InfrastructureOptimization),
}) {}
export class CapacityProvider extends S.Class<CapacityProvider>(
  "CapacityProvider",
)({
  capacityProviderArn: S.optional(S.String),
  name: S.optional(S.String),
  cluster: S.optional(S.String),
  status: S.optional(S.String),
  autoScalingGroupProvider: S.optional(AutoScalingGroupProvider),
  managedInstancesProvider: S.optional(ManagedInstancesProvider),
  updateStatus: S.optional(S.String),
  updateStatusReason: S.optional(S.String),
  tags: S.optional(Tags),
  type: S.optional(S.String),
}) {}
export const CapacityProviders = S.Array(CapacityProvider);
export const Statistics = S.Array(KeyValuePair);
export const AttachmentDetails = S.Array(KeyValuePair);
export class Attachment extends S.Class<Attachment>("Attachment")({
  id: S.optional(S.String),
  type: S.optional(S.String),
  status: S.optional(S.String),
  details: S.optional(AttachmentDetails),
}) {}
export const Attachments = S.Array(Attachment);
export class ClusterServiceConnectDefaults extends S.Class<ClusterServiceConnectDefaults>(
  "ClusterServiceConnectDefaults",
)({ namespace: S.optional(S.String) }) {}
export class Cluster extends S.Class<Cluster>("Cluster")({
  clusterArn: S.optional(S.String),
  clusterName: S.optional(S.String),
  configuration: S.optional(ClusterConfiguration),
  status: S.optional(S.String),
  registeredContainerInstancesCount: S.optional(S.Number),
  runningTasksCount: S.optional(S.Number),
  pendingTasksCount: S.optional(S.Number),
  activeServicesCount: S.optional(S.Number),
  statistics: S.optional(Statistics),
  tags: S.optional(Tags),
  settings: S.optional(ClusterSettings),
  capacityProviders: S.optional(StringList),
  defaultCapacityProviderStrategy: S.optional(CapacityProviderStrategy),
  attachments: S.optional(Attachments),
  attachmentsStatus: S.optional(S.String),
  serviceConnectDefaults: S.optional(ClusterServiceConnectDefaults),
}) {}
export const Clusters = S.Array(Cluster);
export class VersionInfo extends S.Class<VersionInfo>("VersionInfo")({
  agentVersion: S.optional(S.String),
  agentHash: S.optional(S.String),
  dockerVersion: S.optional(S.String),
}) {}
export class Resource extends S.Class<Resource>("Resource")({
  name: S.optional(S.String),
  type: S.optional(S.String),
  doubleValue: S.optional(S.Number),
  longValue: S.optional(S.Number),
  integerValue: S.optional(S.Number),
  stringSetValue: S.optional(StringList),
}) {}
export const Resources = S.Array(Resource);
export class InstanceHealthCheckResult extends S.Class<InstanceHealthCheckResult>(
  "InstanceHealthCheckResult",
)({
  type: S.optional(S.String),
  status: S.optional(S.String),
  lastUpdated: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  lastStatusChange: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const InstanceHealthCheckResultList = S.Array(InstanceHealthCheckResult);
export class ContainerInstanceHealthStatus extends S.Class<ContainerInstanceHealthStatus>(
  "ContainerInstanceHealthStatus",
)({
  overallStatus: S.optional(S.String),
  details: S.optional(InstanceHealthCheckResultList),
}) {}
export class ContainerInstance extends S.Class<ContainerInstance>(
  "ContainerInstance",
)({
  containerInstanceArn: S.optional(S.String),
  ec2InstanceId: S.optional(S.String),
  capacityProviderName: S.optional(S.String),
  version: S.optional(S.Number),
  versionInfo: S.optional(VersionInfo),
  remainingResources: S.optional(Resources),
  registeredResources: S.optional(Resources),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  agentConnected: S.optional(S.Boolean),
  runningTasksCount: S.optional(S.Number),
  pendingTasksCount: S.optional(S.Number),
  agentUpdateStatus: S.optional(S.String),
  attributes: S.optional(Attributes),
  registeredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  attachments: S.optional(Attachments),
  tags: S.optional(Tags),
  healthStatus: S.optional(ContainerInstanceHealthStatus),
}) {}
export const ContainerInstances = S.Array(ContainerInstance);
export class DeploymentEphemeralStorage extends S.Class<DeploymentEphemeralStorage>(
  "DeploymentEphemeralStorage",
)({ kmsKeyId: S.optional(S.String) }) {}
export class TaskSet extends S.Class<TaskSet>("TaskSet")({
  id: S.optional(S.String),
  taskSetArn: S.optional(S.String),
  serviceArn: S.optional(S.String),
  clusterArn: S.optional(S.String),
  startedBy: S.optional(S.String),
  externalId: S.optional(S.String),
  status: S.optional(S.String),
  taskDefinition: S.optional(S.String),
  computedDesiredCount: S.optional(S.Number),
  pendingCount: S.optional(S.Number),
  runningCount: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  launchType: S.optional(S.String),
  capacityProviderStrategy: S.optional(CapacityProviderStrategy),
  platformVersion: S.optional(S.String),
  platformFamily: S.optional(S.String),
  networkConfiguration: S.optional(NetworkConfiguration),
  loadBalancers: S.optional(LoadBalancers),
  serviceRegistries: S.optional(ServiceRegistries),
  scale: S.optional(Scale),
  stabilityStatus: S.optional(S.String),
  stabilityStatusAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  tags: S.optional(Tags),
  fargateEphemeralStorage: S.optional(DeploymentEphemeralStorage),
}) {}
export const TaskSets = S.Array(TaskSet);
export class ServiceConnectServiceResource extends S.Class<ServiceConnectServiceResource>(
  "ServiceConnectServiceResource",
)({
  discoveryName: S.optional(S.String),
  discoveryArn: S.optional(S.String),
}) {}
export const ServiceConnectServiceResourceList = S.Array(
  ServiceConnectServiceResource,
);
export class Deployment extends S.Class<Deployment>("Deployment")({
  id: S.optional(S.String),
  status: S.optional(S.String),
  taskDefinition: S.optional(S.String),
  desiredCount: S.optional(S.Number),
  pendingCount: S.optional(S.Number),
  runningCount: S.optional(S.Number),
  failedTasks: S.optional(S.Number),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  capacityProviderStrategy: S.optional(CapacityProviderStrategy),
  launchType: S.optional(S.String),
  platformVersion: S.optional(S.String),
  platformFamily: S.optional(S.String),
  networkConfiguration: S.optional(NetworkConfiguration),
  rolloutState: S.optional(S.String),
  rolloutStateReason: S.optional(S.String),
  serviceConnectConfiguration: S.optional(ServiceConnectConfiguration),
  serviceConnectResources: S.optional(ServiceConnectServiceResourceList),
  volumeConfigurations: S.optional(ServiceVolumeConfigurations),
  fargateEphemeralStorage: S.optional(DeploymentEphemeralStorage),
  vpcLatticeConfigurations: S.optional(VpcLatticeConfigurations),
}) {}
export const Deployments = S.Array(Deployment);
export class ServiceEvent extends S.Class<ServiceEvent>("ServiceEvent")({
  id: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  message: S.optional(S.String),
}) {}
export const ServiceEvents = S.Array(ServiceEvent);
export class ServiceCurrentRevisionSummary extends S.Class<ServiceCurrentRevisionSummary>(
  "ServiceCurrentRevisionSummary",
)({
  arn: S.optional(S.String),
  requestedTaskCount: S.optional(S.Number),
  runningTaskCount: S.optional(S.Number),
  pendingTaskCount: S.optional(S.Number),
}) {}
export const ServiceCurrentRevisionSummaryList = S.Array(
  ServiceCurrentRevisionSummary,
);
export class Service extends S.Class<Service>("Service")({
  serviceArn: S.optional(S.String),
  serviceName: S.optional(S.String),
  clusterArn: S.optional(S.String),
  loadBalancers: S.optional(LoadBalancers),
  serviceRegistries: S.optional(ServiceRegistries),
  status: S.optional(S.String),
  desiredCount: S.optional(S.Number),
  runningCount: S.optional(S.Number),
  pendingCount: S.optional(S.Number),
  launchType: S.optional(S.String),
  capacityProviderStrategy: S.optional(CapacityProviderStrategy),
  platformVersion: S.optional(S.String),
  platformFamily: S.optional(S.String),
  taskDefinition: S.optional(S.String),
  deploymentConfiguration: S.optional(DeploymentConfiguration),
  taskSets: S.optional(TaskSets),
  deployments: S.optional(Deployments),
  roleArn: S.optional(S.String),
  events: S.optional(ServiceEvents),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  currentServiceDeployment: S.optional(S.String),
  currentServiceRevisions: S.optional(ServiceCurrentRevisionSummaryList),
  placementConstraints: S.optional(PlacementConstraints),
  placementStrategy: S.optional(PlacementStrategies),
  networkConfiguration: S.optional(NetworkConfiguration),
  healthCheckGracePeriodSeconds: S.optional(S.Number),
  schedulingStrategy: S.optional(S.String),
  deploymentController: S.optional(DeploymentController),
  tags: S.optional(Tags),
  createdBy: S.optional(S.String),
  enableECSManagedTags: S.optional(S.Boolean),
  propagateTags: S.optional(S.String),
  enableExecuteCommand: S.optional(S.Boolean),
  availabilityZoneRebalancing: S.optional(S.String),
  resourceManagementType: S.optional(S.String),
}) {}
export const Services = S.Array(Service);
export class Setting extends S.Class<Setting>("Setting")({
  name: S.optional(S.String),
  value: S.optional(S.String),
  principalArn: S.optional(S.String),
  type: S.optional(S.String),
}) {}
export const Settings = S.Array(Setting);
export class CreatedAt extends S.Class<CreatedAt>("CreatedAt")({
  before: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  after: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class PlatformDevice extends S.Class<PlatformDevice>("PlatformDevice")({
  id: S.String,
  type: S.String,
}) {}
export const PlatformDevices = S.Array(PlatformDevice);
export class TaskDefinitionPlacementConstraint extends S.Class<TaskDefinitionPlacementConstraint>(
  "TaskDefinitionPlacementConstraint",
)({ type: S.optional(S.String), expression: S.optional(S.String) }) {}
export const TaskDefinitionPlacementConstraints = S.Array(
  TaskDefinitionPlacementConstraint,
);
export class ProxyConfiguration extends S.Class<ProxyConfiguration>(
  "ProxyConfiguration",
)({
  type: S.optional(S.String),
  containerName: S.String,
  properties: S.optional(ProxyConfigurationProperties),
}) {}
export class InferenceAccelerator extends S.Class<InferenceAccelerator>(
  "InferenceAccelerator",
)({ deviceName: S.String, deviceType: S.String }) {}
export const InferenceAccelerators = S.Array(InferenceAccelerator);
export class RuntimePlatform extends S.Class<RuntimePlatform>(
  "RuntimePlatform",
)({
  cpuArchitecture: S.optional(S.String),
  operatingSystemFamily: S.optional(S.String),
}) {}
export class AttachmentStateChange extends S.Class<AttachmentStateChange>(
  "AttachmentStateChange",
)({ attachmentArn: S.String, status: S.String }) {}
export const AttachmentStateChanges = S.Array(AttachmentStateChange);
export class NetworkBinding extends S.Class<NetworkBinding>("NetworkBinding")({
  bindIP: S.optional(S.String),
  containerPort: S.optional(S.Number),
  hostPort: S.optional(S.Number),
  protocol: S.optional(S.String),
  containerPortRange: S.optional(S.String),
  hostPortRange: S.optional(S.String),
}) {}
export const NetworkBindings = S.Array(NetworkBinding);
export class ContainerStateChange extends S.Class<ContainerStateChange>(
  "ContainerStateChange",
)({
  containerName: S.optional(S.String),
  imageDigest: S.optional(S.String),
  runtimeId: S.optional(S.String),
  exitCode: S.optional(S.Number),
  networkBindings: S.optional(NetworkBindings),
  reason: S.optional(S.String),
  status: S.optional(S.String),
}) {}
export const ContainerStateChanges = S.Array(ContainerStateChange);
export class ManagedAgentStateChange extends S.Class<ManagedAgentStateChange>(
  "ManagedAgentStateChange",
)({
  containerName: S.String,
  managedAgentName: S.String,
  status: S.String,
  reason: S.optional(S.String),
}) {}
export const ManagedAgentStateChanges = S.Array(ManagedAgentStateChange);
export class AutoScalingGroupProviderUpdate extends S.Class<AutoScalingGroupProviderUpdate>(
  "AutoScalingGroupProviderUpdate",
)({
  managedScaling: S.optional(ManagedScaling),
  managedTerminationProtection: S.optional(S.String),
  managedDraining: S.optional(S.String),
}) {}
export const IntegerList = S.Array(S.Number);
export class CreateTaskSetRequest extends S.Class<CreateTaskSetRequest>(
  "CreateTaskSetRequest",
)(
  {
    service: S.String,
    cluster: S.String,
    externalId: S.optional(S.String),
    taskDefinition: S.String,
    networkConfiguration: S.optional(NetworkConfiguration),
    loadBalancers: S.optional(LoadBalancers),
    serviceRegistries: S.optional(ServiceRegistries),
    launchType: S.optional(S.String),
    capacityProviderStrategy: S.optional(CapacityProviderStrategy),
    platformVersion: S.optional(S.String),
    scale: S.optional(Scale),
    clientToken: S.optional(S.String),
    tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteAttributesRequest extends S.Class<DeleteAttributesRequest>(
  "DeleteAttributesRequest",
)(
  { cluster: S.optional(S.String), attributes: Attributes },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RepositoryCredentials extends S.Class<RepositoryCredentials>(
  "RepositoryCredentials",
)({ credentialsParameter: S.String }) {}
export class PortMapping extends S.Class<PortMapping>("PortMapping")({
  containerPort: S.optional(S.Number),
  hostPort: S.optional(S.Number),
  protocol: S.optional(S.String),
  name: S.optional(S.String),
  appProtocol: S.optional(S.String),
  containerPortRange: S.optional(S.String),
}) {}
export const PortMappingList = S.Array(PortMapping);
export class ContainerRestartPolicy extends S.Class<ContainerRestartPolicy>(
  "ContainerRestartPolicy",
)({
  enabled: S.Boolean,
  ignoredExitCodes: S.optional(IntegerList),
  restartAttemptPeriod: S.optional(S.Number),
}) {}
export class MountPoint extends S.Class<MountPoint>("MountPoint")({
  sourceVolume: S.optional(S.String),
  containerPath: S.optional(S.String),
  readOnly: S.optional(S.Boolean),
}) {}
export const MountPointList = S.Array(MountPoint);
export class VolumeFrom extends S.Class<VolumeFrom>("VolumeFrom")({
  sourceContainer: S.optional(S.String),
  readOnly: S.optional(S.Boolean),
}) {}
export const VolumeFromList = S.Array(VolumeFrom);
export class KernelCapabilities extends S.Class<KernelCapabilities>(
  "KernelCapabilities",
)({ add: S.optional(StringList), drop: S.optional(StringList) }) {}
export const DeviceCgroupPermissions = S.Array(S.String);
export class Device extends S.Class<Device>("Device")({
  hostPath: S.String,
  containerPath: S.optional(S.String),
  permissions: S.optional(DeviceCgroupPermissions),
}) {}
export const DevicesList = S.Array(Device);
export class Tmpfs extends S.Class<Tmpfs>("Tmpfs")({
  containerPath: S.String,
  size: S.Number,
  mountOptions: S.optional(StringList),
}) {}
export const TmpfsList = S.Array(Tmpfs);
export class LinuxParameters extends S.Class<LinuxParameters>(
  "LinuxParameters",
)({
  capabilities: S.optional(KernelCapabilities),
  devices: S.optional(DevicesList),
  initProcessEnabled: S.optional(S.Boolean),
  sharedMemorySize: S.optional(S.Number),
  tmpfs: S.optional(TmpfsList),
  maxSwap: S.optional(S.Number),
  swappiness: S.optional(S.Number),
}) {}
export class ContainerDependency extends S.Class<ContainerDependency>(
  "ContainerDependency",
)({ containerName: S.String, condition: S.String }) {}
export const ContainerDependencies = S.Array(ContainerDependency);
export class HostEntry extends S.Class<HostEntry>("HostEntry")({
  hostname: S.String,
  ipAddress: S.String,
}) {}
export const HostEntryList = S.Array(HostEntry);
export const DockerLabelsMap = S.Record({ key: S.String, value: S.String });
export class Ulimit extends S.Class<Ulimit>("Ulimit")({
  name: S.String,
  softLimit: S.Number,
  hardLimit: S.Number,
}) {}
export const UlimitList = S.Array(Ulimit);
export class HealthCheck extends S.Class<HealthCheck>("HealthCheck")({
  command: StringList,
  interval: S.optional(S.Number),
  timeout: S.optional(S.Number),
  retries: S.optional(S.Number),
  startPeriod: S.optional(S.Number),
}) {}
export class SystemControl extends S.Class<SystemControl>("SystemControl")({
  namespace: S.optional(S.String),
  value: S.optional(S.String),
}) {}
export const SystemControls = S.Array(SystemControl);
export const FirelensConfigurationOptionsMap = S.Record({
  key: S.String,
  value: S.String,
});
export class FirelensConfiguration extends S.Class<FirelensConfiguration>(
  "FirelensConfiguration",
)({ type: S.String, options: S.optional(FirelensConfigurationOptionsMap) }) {}
export class ContainerDefinition extends S.Class<ContainerDefinition>(
  "ContainerDefinition",
)({
  name: S.optional(S.String),
  image: S.optional(S.String),
  repositoryCredentials: S.optional(RepositoryCredentials),
  cpu: S.optional(S.Number),
  memory: S.optional(S.Number),
  memoryReservation: S.optional(S.Number),
  links: S.optional(StringList),
  portMappings: S.optional(PortMappingList),
  essential: S.optional(S.Boolean),
  restartPolicy: S.optional(ContainerRestartPolicy),
  entryPoint: S.optional(StringList),
  command: S.optional(StringList),
  environment: S.optional(EnvironmentVariables),
  environmentFiles: S.optional(EnvironmentFiles),
  mountPoints: S.optional(MountPointList),
  volumesFrom: S.optional(VolumeFromList),
  linuxParameters: S.optional(LinuxParameters),
  secrets: S.optional(SecretList),
  dependsOn: S.optional(ContainerDependencies),
  startTimeout: S.optional(S.Number),
  stopTimeout: S.optional(S.Number),
  versionConsistency: S.optional(S.String),
  hostname: S.optional(S.String),
  user: S.optional(S.String),
  workingDirectory: S.optional(S.String),
  disableNetworking: S.optional(S.Boolean),
  privileged: S.optional(S.Boolean),
  readonlyRootFilesystem: S.optional(S.Boolean),
  dnsServers: S.optional(StringList),
  dnsSearchDomains: S.optional(StringList),
  extraHosts: S.optional(HostEntryList),
  dockerSecurityOptions: S.optional(StringList),
  interactive: S.optional(S.Boolean),
  pseudoTerminal: S.optional(S.Boolean),
  dockerLabels: S.optional(DockerLabelsMap),
  ulimits: S.optional(UlimitList),
  logConfiguration: S.optional(LogConfiguration),
  healthCheck: S.optional(HealthCheck),
  systemControls: S.optional(SystemControls),
  resourceRequirements: S.optional(ResourceRequirements),
  firelensConfiguration: S.optional(FirelensConfiguration),
  credentialSpecs: S.optional(StringList),
}) {}
export const ContainerDefinitions = S.Array(ContainerDefinition);
export class HostVolumeProperties extends S.Class<HostVolumeProperties>(
  "HostVolumeProperties",
)({ sourcePath: S.optional(S.String) }) {}
export const StringMap = S.Record({ key: S.String, value: S.String });
export class DockerVolumeConfiguration extends S.Class<DockerVolumeConfiguration>(
  "DockerVolumeConfiguration",
)({
  scope: S.optional(S.String),
  autoprovision: S.optional(S.Boolean),
  driver: S.optional(S.String),
  driverOpts: S.optional(StringMap),
  labels: S.optional(StringMap),
}) {}
export class EFSAuthorizationConfig extends S.Class<EFSAuthorizationConfig>(
  "EFSAuthorizationConfig",
)({ accessPointId: S.optional(S.String), iam: S.optional(S.String) }) {}
export class EFSVolumeConfiguration extends S.Class<EFSVolumeConfiguration>(
  "EFSVolumeConfiguration",
)({
  fileSystemId: S.String,
  rootDirectory: S.optional(S.String),
  transitEncryption: S.optional(S.String),
  transitEncryptionPort: S.optional(S.Number),
  authorizationConfig: S.optional(EFSAuthorizationConfig),
}) {}
export class FSxWindowsFileServerAuthorizationConfig extends S.Class<FSxWindowsFileServerAuthorizationConfig>(
  "FSxWindowsFileServerAuthorizationConfig",
)({ credentialsParameter: S.String, domain: S.String }) {}
export class FSxWindowsFileServerVolumeConfiguration extends S.Class<FSxWindowsFileServerVolumeConfiguration>(
  "FSxWindowsFileServerVolumeConfiguration",
)({
  fileSystemId: S.String,
  rootDirectory: S.String,
  authorizationConfig: FSxWindowsFileServerAuthorizationConfig,
}) {}
export class Volume extends S.Class<Volume>("Volume")({
  name: S.optional(S.String),
  host: S.optional(HostVolumeProperties),
  dockerVolumeConfiguration: S.optional(DockerVolumeConfiguration),
  efsVolumeConfiguration: S.optional(EFSVolumeConfiguration),
  fsxWindowsFileServerVolumeConfiguration: S.optional(
    FSxWindowsFileServerVolumeConfiguration,
  ),
  configuredAtLaunch: S.optional(S.Boolean),
}) {}
export const VolumeList = S.Array(Volume);
export const RequiresAttributes = S.Array(Attribute);
export class TaskDefinition extends S.Class<TaskDefinition>("TaskDefinition")({
  taskDefinitionArn: S.optional(S.String),
  containerDefinitions: S.optional(ContainerDefinitions),
  family: S.optional(S.String),
  taskRoleArn: S.optional(S.String),
  executionRoleArn: S.optional(S.String),
  networkMode: S.optional(S.String),
  revision: S.optional(S.Number),
  volumes: S.optional(VolumeList),
  status: S.optional(S.String),
  requiresAttributes: S.optional(RequiresAttributes),
  placementConstraints: S.optional(TaskDefinitionPlacementConstraints),
  compatibilities: S.optional(CompatibilityList),
  runtimePlatform: S.optional(RuntimePlatform),
  requiresCompatibilities: S.optional(CompatibilityList),
  cpu: S.optional(S.String),
  memory: S.optional(S.String),
  inferenceAccelerators: S.optional(InferenceAccelerators),
  pidMode: S.optional(S.String),
  ipcMode: S.optional(S.String),
  proxyConfiguration: S.optional(ProxyConfiguration),
  registeredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  deregisteredAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  registeredBy: S.optional(S.String),
  ephemeralStorage: S.optional(EphemeralStorage),
  enableFaultInjection: S.optional(S.Boolean),
}) {}
export class DeregisterTaskDefinitionResponse extends S.Class<DeregisterTaskDefinitionResponse>(
  "DeregisterTaskDefinitionResponse",
)({ taskDefinition: S.optional(TaskDefinition) }, ns) {}
export class Failure extends S.Class<Failure>("Failure")({
  arn: S.optional(S.String),
  reason: S.optional(S.String),
  detail: S.optional(S.String),
}) {}
export const Failures = S.Array(Failure);
export class DescribeCapacityProvidersResponse extends S.Class<DescribeCapacityProvidersResponse>(
  "DescribeCapacityProvidersResponse",
)(
  {
    capacityProviders: S.optional(CapacityProviders),
    failures: S.optional(Failures),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class DescribeClustersResponse extends S.Class<DescribeClustersResponse>(
  "DescribeClustersResponse",
)({ clusters: S.optional(Clusters), failures: S.optional(Failures) }, ns) {}
export class DescribeContainerInstancesResponse extends S.Class<DescribeContainerInstancesResponse>(
  "DescribeContainerInstancesResponse",
)(
  {
    containerInstances: S.optional(ContainerInstances),
    failures: S.optional(Failures),
  },
  ns,
) {}
export class ExpressGatewayServiceStatus extends S.Class<ExpressGatewayServiceStatus>(
  "ExpressGatewayServiceStatus",
)({ statusCode: S.optional(S.String), statusReason: S.optional(S.String) }) {}
export class IngressPathSummary extends S.Class<IngressPathSummary>(
  "IngressPathSummary",
)({ accessType: S.String, endpoint: S.String }) {}
export const IngressPathSummaries = S.Array(IngressPathSummary);
export class ExpressGatewayServiceConfiguration extends S.Class<ExpressGatewayServiceConfiguration>(
  "ExpressGatewayServiceConfiguration",
)({
  serviceRevisionArn: S.optional(S.String),
  executionRoleArn: S.optional(S.String),
  taskRoleArn: S.optional(S.String),
  cpu: S.optional(S.String),
  memory: S.optional(S.String),
  networkConfiguration: S.optional(ExpressGatewayServiceNetworkConfiguration),
  healthCheckPath: S.optional(S.String),
  primaryContainer: S.optional(ExpressGatewayContainer),
  scalingTarget: S.optional(ExpressGatewayScalingTarget),
  ingressPaths: S.optional(IngressPathSummaries),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ExpressGatewayServiceConfigurations = S.Array(
  ExpressGatewayServiceConfiguration,
);
export class ECSExpressGatewayService extends S.Class<ECSExpressGatewayService>(
  "ECSExpressGatewayService",
)({
  cluster: S.optional(S.String),
  serviceName: S.optional(S.String),
  serviceArn: S.optional(S.String),
  infrastructureRoleArn: S.optional(S.String),
  status: S.optional(ExpressGatewayServiceStatus),
  currentDeployment: S.optional(S.String),
  activeConfigurations: S.optional(ExpressGatewayServiceConfigurations),
  tags: S.optional(Tags),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class DescribeExpressGatewayServiceResponse extends S.Class<DescribeExpressGatewayServiceResponse>(
  "DescribeExpressGatewayServiceResponse",
)({ service: S.optional(ECSExpressGatewayService) }, ns) {}
export class DescribeServicesResponse extends S.Class<DescribeServicesResponse>(
  "DescribeServicesResponse",
)({ services: S.optional(Services), failures: S.optional(Failures) }, ns) {}
export class DescribeTaskDefinitionResponse extends S.Class<DescribeTaskDefinitionResponse>(
  "DescribeTaskDefinitionResponse",
)({ taskDefinition: S.optional(TaskDefinition), tags: S.optional(Tags) }, ns) {}
export class DescribeTaskSetsResponse extends S.Class<DescribeTaskSetsResponse>(
  "DescribeTaskSetsResponse",
)({ taskSets: S.optional(TaskSets), failures: S.optional(Failures) }, ns) {}
export class DiscoverPollEndpointResponse extends S.Class<DiscoverPollEndpointResponse>(
  "DiscoverPollEndpointResponse",
)(
  {
    endpoint: S.optional(S.String),
    telemetryEndpoint: S.optional(S.String),
    serviceConnectEndpoint: S.optional(S.String),
  },
  ns,
) {}
export class ListAccountSettingsResponse extends S.Class<ListAccountSettingsResponse>(
  "ListAccountSettingsResponse",
)({ settings: S.optional(Settings), nextToken: S.optional(S.String) }, ns) {}
export class ListAttributesResponse extends S.Class<ListAttributesResponse>(
  "ListAttributesResponse",
)(
  { attributes: S.optional(Attributes), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListClustersResponse extends S.Class<ListClustersResponse>(
  "ListClustersResponse",
)(
  { clusterArns: S.optional(StringList), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListContainerInstancesResponse extends S.Class<ListContainerInstancesResponse>(
  "ListContainerInstancesResponse",
)(
  {
    containerInstanceArns: S.optional(StringList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListServiceDeploymentsRequest extends S.Class<ListServiceDeploymentsRequest>(
  "ListServiceDeploymentsRequest",
)(
  {
    service: S.String,
    cluster: S.optional(S.String),
    status: S.optional(ServiceDeploymentStatusList),
    createdAt: S.optional(CreatedAt),
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListServicesResponse extends S.Class<ListServicesResponse>(
  "ListServicesResponse",
)(
  { serviceArns: S.optional(StringList), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListServicesByNamespaceResponse extends S.Class<ListServicesByNamespaceResponse>(
  "ListServicesByNamespaceResponse",
)(
  { serviceArns: S.optional(StringList), nextToken: S.optional(S.String) },
  ns,
) {}
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(Tags) }, ns) {}
export class ListTaskDefinitionFamiliesResponse extends S.Class<ListTaskDefinitionFamiliesResponse>(
  "ListTaskDefinitionFamiliesResponse",
)({ families: S.optional(StringList), nextToken: S.optional(S.String) }, ns) {}
export class ListTaskDefinitionsResponse extends S.Class<ListTaskDefinitionsResponse>(
  "ListTaskDefinitionsResponse",
)(
  {
    taskDefinitionArns: S.optional(StringList),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class ListTasksResponse extends S.Class<ListTasksResponse>(
  "ListTasksResponse",
)({ taskArns: S.optional(StringList), nextToken: S.optional(S.String) }, ns) {}
export class PutAccountSettingResponse extends S.Class<PutAccountSettingResponse>(
  "PutAccountSettingResponse",
)({ setting: S.optional(Setting) }, ns) {}
export class PutAccountSettingDefaultResponse extends S.Class<PutAccountSettingDefaultResponse>(
  "PutAccountSettingDefaultResponse",
)({ setting: S.optional(Setting) }, ns) {}
export class PutAttributesResponse extends S.Class<PutAttributesResponse>(
  "PutAttributesResponse",
)({ attributes: S.optional(Attributes) }, ns) {}
export class PutClusterCapacityProvidersResponse extends S.Class<PutClusterCapacityProvidersResponse>(
  "PutClusterCapacityProvidersResponse",
)({ cluster: S.optional(Cluster) }, ns) {}
export class RegisterContainerInstanceRequest extends S.Class<RegisterContainerInstanceRequest>(
  "RegisterContainerInstanceRequest",
)(
  {
    cluster: S.optional(S.String),
    instanceIdentityDocument: S.optional(S.String),
    instanceIdentityDocumentSignature: S.optional(S.String),
    totalResources: S.optional(Resources),
    versionInfo: S.optional(VersionInfo),
    containerInstanceArn: S.optional(S.String),
    attributes: S.optional(Attributes),
    platformDevices: S.optional(PlatformDevices),
    tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class NetworkInterface extends S.Class<NetworkInterface>(
  "NetworkInterface",
)({
  attachmentId: S.optional(S.String),
  privateIpv4Address: S.optional(S.String),
  ipv6Address: S.optional(S.String),
}) {}
export const NetworkInterfaces = S.Array(NetworkInterface);
export class ManagedAgent extends S.Class<ManagedAgent>("ManagedAgent")({
  lastStartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  name: S.optional(S.String),
  reason: S.optional(S.String),
  lastStatus: S.optional(S.String),
}) {}
export const ManagedAgents = S.Array(ManagedAgent);
export const GpuIds = S.Array(S.String);
export class Container extends S.Class<Container>("Container")({
  containerArn: S.optional(S.String),
  taskArn: S.optional(S.String),
  name: S.optional(S.String),
  image: S.optional(S.String),
  imageDigest: S.optional(S.String),
  runtimeId: S.optional(S.String),
  lastStatus: S.optional(S.String),
  exitCode: S.optional(S.Number),
  reason: S.optional(S.String),
  networkBindings: S.optional(NetworkBindings),
  networkInterfaces: S.optional(NetworkInterfaces),
  healthStatus: S.optional(S.String),
  managedAgents: S.optional(ManagedAgents),
  cpu: S.optional(S.String),
  memory: S.optional(S.String),
  memoryReservation: S.optional(S.String),
  gpuIds: S.optional(GpuIds),
}) {}
export const Containers = S.Array(Container);
export class TaskEphemeralStorage extends S.Class<TaskEphemeralStorage>(
  "TaskEphemeralStorage",
)({ sizeInGiB: S.optional(S.Number), kmsKeyId: S.optional(S.String) }) {}
export class Task extends S.Class<Task>("Task")({
  attachments: S.optional(Attachments),
  attributes: S.optional(Attributes),
  availabilityZone: S.optional(S.String),
  capacityProviderName: S.optional(S.String),
  clusterArn: S.optional(S.String),
  connectivity: S.optional(S.String),
  connectivityAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  containerInstanceArn: S.optional(S.String),
  containers: S.optional(Containers),
  cpu: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  desiredStatus: S.optional(S.String),
  enableExecuteCommand: S.optional(S.Boolean),
  executionStoppedAt: S.optional(
    S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  ),
  group: S.optional(S.String),
  healthStatus: S.optional(S.String),
  inferenceAccelerators: S.optional(InferenceAccelerators),
  lastStatus: S.optional(S.String),
  launchType: S.optional(S.String),
  memory: S.optional(S.String),
  overrides: S.optional(TaskOverride),
  platformVersion: S.optional(S.String),
  platformFamily: S.optional(S.String),
  pullStartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  pullStoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startedBy: S.optional(S.String),
  stopCode: S.optional(S.String),
  stoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  stoppedReason: S.optional(S.String),
  stoppingAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  tags: S.optional(Tags),
  taskArn: S.optional(S.String),
  taskDefinitionArn: S.optional(S.String),
  version: S.optional(S.Number),
  ephemeralStorage: S.optional(EphemeralStorage),
  fargateEphemeralStorage: S.optional(TaskEphemeralStorage),
}) {}
export const Tasks = S.Array(Task);
export class StartTaskResponse extends S.Class<StartTaskResponse>(
  "StartTaskResponse",
)({ tasks: S.optional(Tasks), failures: S.optional(Failures) }, ns) {}
export class StopServiceDeploymentResponse extends S.Class<StopServiceDeploymentResponse>(
  "StopServiceDeploymentResponse",
)({ serviceDeploymentArn: S.optional(S.String) }, ns) {}
export class StopTaskResponse extends S.Class<StopTaskResponse>(
  "StopTaskResponse",
)({ task: S.optional(Task) }, ns) {}
export class SubmitAttachmentStateChangesRequest extends S.Class<SubmitAttachmentStateChangesRequest>(
  "SubmitAttachmentStateChangesRequest",
)(
  { cluster: S.optional(S.String), attachments: AttachmentStateChanges },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SubmitContainerStateChangeRequest extends S.Class<SubmitContainerStateChangeRequest>(
  "SubmitContainerStateChangeRequest",
)(
  {
    cluster: S.optional(S.String),
    task: S.optional(S.String),
    containerName: S.optional(S.String),
    runtimeId: S.optional(S.String),
    status: S.optional(S.String),
    exitCode: S.optional(S.Number),
    reason: S.optional(S.String),
    networkBindings: S.optional(NetworkBindings),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class SubmitTaskStateChangeRequest extends S.Class<SubmitTaskStateChangeRequest>(
  "SubmitTaskStateChangeRequest",
)(
  {
    cluster: S.optional(S.String),
    task: S.optional(S.String),
    status: S.optional(S.String),
    reason: S.optional(S.String),
    containers: S.optional(ContainerStateChanges),
    attachments: S.optional(AttachmentStateChanges),
    managedAgents: S.optional(ManagedAgentStateChanges),
    pullStartedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    pullStoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
    executionStoppedAt: S.optional(
      S.Date.pipe(T.TimestampFormat("epoch-seconds")),
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateClusterResponse extends S.Class<UpdateClusterResponse>(
  "UpdateClusterResponse",
)({ cluster: S.optional(Cluster) }, ns) {}
export class UpdateClusterSettingsResponse extends S.Class<UpdateClusterSettingsResponse>(
  "UpdateClusterSettingsResponse",
)({ cluster: S.optional(Cluster) }, ns) {}
export class UpdateContainerAgentResponse extends S.Class<UpdateContainerAgentResponse>(
  "UpdateContainerAgentResponse",
)({ containerInstance: S.optional(ContainerInstance) }, ns) {}
export class UpdateContainerInstancesStateResponse extends S.Class<UpdateContainerInstancesStateResponse>(
  "UpdateContainerInstancesStateResponse",
)(
  {
    containerInstances: S.optional(ContainerInstances),
    failures: S.optional(Failures),
  },
  ns,
) {}
export class UpdateServiceResponse extends S.Class<UpdateServiceResponse>(
  "UpdateServiceResponse",
)({ service: S.optional(Service) }, ns) {}
export class UpdateServicePrimaryTaskSetResponse extends S.Class<UpdateServicePrimaryTaskSetResponse>(
  "UpdateServicePrimaryTaskSetResponse",
)({ taskSet: S.optional(TaskSet) }, ns) {}
export class ProtectedTask extends S.Class<ProtectedTask>("ProtectedTask")({
  taskArn: S.optional(S.String),
  protectionEnabled: S.optional(S.Boolean),
  expirationDate: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export const ProtectedTasks = S.Array(ProtectedTask);
export class UpdateTaskProtectionResponse extends S.Class<UpdateTaskProtectionResponse>(
  "UpdateTaskProtectionResponse",
)(
  {
    protectedTasks: S.optional(ProtectedTasks),
    failures: S.optional(Failures),
  },
  ns,
) {}
export class UpdateTaskSetResponse extends S.Class<UpdateTaskSetResponse>(
  "UpdateTaskSetResponse",
)({ taskSet: S.optional(TaskSet) }, ns) {}
export class InstanceLaunchTemplateUpdate extends S.Class<InstanceLaunchTemplateUpdate>(
  "InstanceLaunchTemplateUpdate",
)({
  ec2InstanceProfileArn: S.optional(S.String),
  networkConfiguration: S.optional(ManagedInstancesNetworkConfiguration),
  storageConfiguration: S.optional(ManagedInstancesStorageConfiguration),
  monitoring: S.optional(S.String),
  instanceRequirements: S.optional(InstanceRequirementsRequest),
}) {}
export const TaskDefinitionList = S.Array(TaskDefinition);
export class Session extends S.Class<Session>("Session")({
  sessionId: S.optional(S.String),
  streamUrl: S.optional(S.String),
  tokenValue: S.optional(S.String),
}) {}
export const ResourceIds = S.Array(S.String);
export class UpdateManagedInstancesProviderConfiguration extends S.Class<UpdateManagedInstancesProviderConfiguration>(
  "UpdateManagedInstancesProviderConfiguration",
)({
  infrastructureRoleArn: S.String,
  instanceLaunchTemplate: InstanceLaunchTemplateUpdate,
  propagateTags: S.optional(S.String),
  infrastructureOptimization: S.optional(InfrastructureOptimization),
}) {}
export class UpdatedExpressGatewayService extends S.Class<UpdatedExpressGatewayService>(
  "UpdatedExpressGatewayService",
)({
  serviceArn: S.optional(S.String),
  cluster: S.optional(S.String),
  serviceName: S.optional(S.String),
  status: S.optional(ExpressGatewayServiceStatus),
  targetConfiguration: S.optional(ExpressGatewayServiceConfiguration),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
}) {}
export class CreateExpressGatewayServiceRequest extends S.Class<CreateExpressGatewayServiceRequest>(
  "CreateExpressGatewayServiceRequest",
)(
  {
    executionRoleArn: S.String,
    infrastructureRoleArn: S.String,
    serviceName: S.optional(S.String),
    cluster: S.optional(S.String),
    healthCheckPath: S.optional(S.String),
    primaryContainer: ExpressGatewayContainer,
    taskRoleArn: S.optional(S.String),
    networkConfiguration: S.optional(ExpressGatewayServiceNetworkConfiguration),
    cpu: S.optional(S.String),
    memory: S.optional(S.String),
    scalingTarget: S.optional(ExpressGatewayScalingTarget),
    tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateTaskSetResponse extends S.Class<CreateTaskSetResponse>(
  "CreateTaskSetResponse",
)({ taskSet: S.optional(TaskSet) }, ns) {}
export class DeleteAccountSettingResponse extends S.Class<DeleteAccountSettingResponse>(
  "DeleteAccountSettingResponse",
)({ setting: S.optional(Setting) }, ns) {}
export class DeleteAttributesResponse extends S.Class<DeleteAttributesResponse>(
  "DeleteAttributesResponse",
)({ attributes: S.optional(Attributes) }, ns) {}
export class DeleteTaskDefinitionsResponse extends S.Class<DeleteTaskDefinitionsResponse>(
  "DeleteTaskDefinitionsResponse",
)(
  {
    taskDefinitions: S.optional(TaskDefinitionList),
    failures: S.optional(Failures),
  },
  ns,
) {}
export class ExecuteCommandResponse extends S.Class<ExecuteCommandResponse>(
  "ExecuteCommandResponse",
)(
  {
    clusterArn: S.optional(S.String),
    containerArn: S.optional(S.String),
    containerName: S.optional(S.String),
    interactive: S.optional(S.Boolean),
    session: S.optional(Session),
    taskArn: S.optional(S.String),
  },
  ns,
) {}
export class GetTaskProtectionResponse extends S.Class<GetTaskProtectionResponse>(
  "GetTaskProtectionResponse",
)(
  {
    protectedTasks: S.optional(ProtectedTasks),
    failures: S.optional(Failures),
  },
  ns,
) {}
export class RegisterContainerInstanceResponse extends S.Class<RegisterContainerInstanceResponse>(
  "RegisterContainerInstanceResponse",
)({ containerInstance: S.optional(ContainerInstance) }, ns) {}
export class SubmitAttachmentStateChangesResponse extends S.Class<SubmitAttachmentStateChangesResponse>(
  "SubmitAttachmentStateChangesResponse",
)({ acknowledgment: S.optional(S.String) }, ns) {}
export class SubmitContainerStateChangeResponse extends S.Class<SubmitContainerStateChangeResponse>(
  "SubmitContainerStateChangeResponse",
)({ acknowledgment: S.optional(S.String) }, ns) {}
export class SubmitTaskStateChangeResponse extends S.Class<SubmitTaskStateChangeResponse>(
  "SubmitTaskStateChangeResponse",
)({ acknowledgment: S.optional(S.String) }, ns) {}
export class UpdateCapacityProviderRequest extends S.Class<UpdateCapacityProviderRequest>(
  "UpdateCapacityProviderRequest",
)(
  {
    name: S.String,
    cluster: S.optional(S.String),
    autoScalingGroupProvider: S.optional(AutoScalingGroupProviderUpdate),
    managedInstancesProvider: S.optional(
      UpdateManagedInstancesProviderConfiguration,
    ),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateExpressGatewayServiceResponse extends S.Class<UpdateExpressGatewayServiceResponse>(
  "UpdateExpressGatewayServiceResponse",
)({ service: S.optional(UpdatedExpressGatewayService) }, ns) {}
export class ServiceRevisionSummary extends S.Class<ServiceRevisionSummary>(
  "ServiceRevisionSummary",
)({
  arn: S.optional(S.String),
  requestedTaskCount: S.optional(S.Number),
  runningTaskCount: S.optional(S.Number),
  pendingTaskCount: S.optional(S.Number),
  requestedTestTrafficWeight: S.optional(S.Number),
  requestedProductionTrafficWeight: S.optional(S.Number),
}) {}
export const ServiceRevisionsSummaryList = S.Array(ServiceRevisionSummary);
export class Rollback extends S.Class<Rollback>("Rollback")({
  reason: S.optional(S.String),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  serviceRevisionArn: S.optional(S.String),
}) {}
export class ServiceDeploymentCircuitBreaker extends S.Class<ServiceDeploymentCircuitBreaker>(
  "ServiceDeploymentCircuitBreaker",
)({
  status: S.optional(S.String),
  failureCount: S.optional(S.Number),
  threshold: S.optional(S.Number),
}) {}
export class ServiceDeploymentAlarms extends S.Class<ServiceDeploymentAlarms>(
  "ServiceDeploymentAlarms",
)({
  status: S.optional(S.String),
  alarmNames: S.optional(StringList),
  triggeredAlarmNames: S.optional(StringList),
}) {}
export class ContainerImage extends S.Class<ContainerImage>("ContainerImage")({
  containerName: S.optional(S.String),
  imageDigest: S.optional(S.String),
  image: S.optional(S.String),
}) {}
export const ContainerImages = S.Array(ContainerImage);
export class ServiceDeployment extends S.Class<ServiceDeployment>(
  "ServiceDeployment",
)({
  serviceDeploymentArn: S.optional(S.String),
  serviceArn: S.optional(S.String),
  clusterArn: S.optional(S.String),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  finishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  stoppedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  updatedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  sourceServiceRevisions: S.optional(ServiceRevisionsSummaryList),
  targetServiceRevision: S.optional(ServiceRevisionSummary),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
  lifecycleStage: S.optional(S.String),
  deploymentConfiguration: S.optional(DeploymentConfiguration),
  rollback: S.optional(Rollback),
  deploymentCircuitBreaker: S.optional(ServiceDeploymentCircuitBreaker),
  alarms: S.optional(ServiceDeploymentAlarms),
}) {}
export const ServiceDeployments = S.Array(ServiceDeployment);
export class ServiceDeploymentBrief extends S.Class<ServiceDeploymentBrief>(
  "ServiceDeploymentBrief",
)({
  serviceDeploymentArn: S.optional(S.String),
  serviceArn: S.optional(S.String),
  clusterArn: S.optional(S.String),
  startedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  finishedAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  targetServiceRevisionArn: S.optional(S.String),
  status: S.optional(S.String),
  statusReason: S.optional(S.String),
}) {}
export const ServiceDeploymentsBrief = S.Array(ServiceDeploymentBrief);
export class ServiceRevisionLoadBalancer extends S.Class<ServiceRevisionLoadBalancer>(
  "ServiceRevisionLoadBalancer",
)({
  targetGroupArn: S.optional(S.String),
  productionListenerRule: S.optional(S.String),
}) {}
export const ServiceRevisionLoadBalancers = S.Array(
  ServiceRevisionLoadBalancer,
);
export class ManagedMetricAlarm extends S.Class<ManagedMetricAlarm>(
  "ManagedMetricAlarm",
)({
  arn: S.optional(S.String),
  status: S.String,
  statusReason: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ManagedMetricAlarms = S.Array(ManagedMetricAlarm);
export class ManagedSecurityGroup extends S.Class<ManagedSecurityGroup>(
  "ManagedSecurityGroup",
)({
  arn: S.optional(S.String),
  status: S.String,
  statusReason: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export const ManagedSecurityGroups = S.Array(ManagedSecurityGroup);
export class ManagedLogGroup extends S.Class<ManagedLogGroup>(
  "ManagedLogGroup",
)({
  arn: S.optional(S.String),
  status: S.String,
  statusReason: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  logGroupName: S.String,
}) {}
export const ManagedLogGroups = S.Array(ManagedLogGroup);
export class CreateClusterRequest extends S.Class<CreateClusterRequest>(
  "CreateClusterRequest",
)(
  {
    clusterName: S.optional(S.String),
    tags: S.optional(Tags),
    settings: S.optional(ClusterSettings),
    configuration: S.optional(ClusterConfiguration),
    capacityProviders: S.optional(StringList),
    defaultCapacityProviderStrategy: S.optional(CapacityProviderStrategy),
    serviceConnectDefaults: S.optional(ClusterServiceConnectDefaultsRequest),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateExpressGatewayServiceResponse extends S.Class<CreateExpressGatewayServiceResponse>(
  "CreateExpressGatewayServiceResponse",
)({ service: S.optional(ECSExpressGatewayService) }, ns) {}
export class DeleteCapacityProviderResponse extends S.Class<DeleteCapacityProviderResponse>(
  "DeleteCapacityProviderResponse",
)({ capacityProvider: S.optional(CapacityProvider) }, ns) {}
export class DeleteClusterResponse extends S.Class<DeleteClusterResponse>(
  "DeleteClusterResponse",
)({ cluster: S.optional(Cluster) }, ns) {}
export class DeleteTaskSetResponse extends S.Class<DeleteTaskSetResponse>(
  "DeleteTaskSetResponse",
)({ taskSet: S.optional(TaskSet) }, ns) {}
export class DescribeServiceDeploymentsResponse extends S.Class<DescribeServiceDeploymentsResponse>(
  "DescribeServiceDeploymentsResponse",
)(
  {
    serviceDeployments: S.optional(ServiceDeployments),
    failures: S.optional(Failures),
  },
  ns,
) {}
export class ListServiceDeploymentsResponse extends S.Class<ListServiceDeploymentsResponse>(
  "ListServiceDeploymentsResponse",
)(
  {
    serviceDeployments: S.optional(ServiceDeploymentsBrief),
    nextToken: S.optional(S.String),
  },
  ns,
) {}
export class RegisterTaskDefinitionRequest extends S.Class<RegisterTaskDefinitionRequest>(
  "RegisterTaskDefinitionRequest",
)(
  {
    family: S.String,
    taskRoleArn: S.optional(S.String),
    executionRoleArn: S.optional(S.String),
    networkMode: S.optional(S.String),
    containerDefinitions: ContainerDefinitions,
    volumes: S.optional(VolumeList),
    placementConstraints: S.optional(TaskDefinitionPlacementConstraints),
    requiresCompatibilities: S.optional(CompatibilityList),
    cpu: S.optional(S.String),
    memory: S.optional(S.String),
    tags: S.optional(Tags),
    pidMode: S.optional(S.String),
    ipcMode: S.optional(S.String),
    proxyConfiguration: S.optional(ProxyConfiguration),
    inferenceAccelerators: S.optional(InferenceAccelerators),
    ephemeralStorage: S.optional(EphemeralStorage),
    runtimePlatform: S.optional(RuntimePlatform),
    enableFaultInjection: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RunTaskRequest extends S.Class<RunTaskRequest>("RunTaskRequest")(
  {
    capacityProviderStrategy: S.optional(CapacityProviderStrategy),
    cluster: S.optional(S.String),
    count: S.optional(S.Number),
    enableECSManagedTags: S.optional(S.Boolean),
    enableExecuteCommand: S.optional(S.Boolean),
    group: S.optional(S.String),
    launchType: S.optional(S.String),
    networkConfiguration: S.optional(NetworkConfiguration),
    overrides: S.optional(TaskOverride),
    placementConstraints: S.optional(PlacementConstraints),
    placementStrategy: S.optional(PlacementStrategies),
    platformVersion: S.optional(S.String),
    propagateTags: S.optional(S.String),
    referenceId: S.optional(S.String),
    startedBy: S.optional(S.String),
    tags: S.optional(Tags),
    taskDefinition: S.String,
    clientToken: S.optional(S.String),
    volumeConfigurations: S.optional(TaskVolumeConfigurations),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateCapacityProviderResponse extends S.Class<UpdateCapacityProviderResponse>(
  "UpdateCapacityProviderResponse",
)({ capacityProvider: S.optional(CapacityProvider) }, ns) {}
export class ResolvedConfiguration extends S.Class<ResolvedConfiguration>(
  "ResolvedConfiguration",
)({ loadBalancers: S.optional(ServiceRevisionLoadBalancers) }) {}
export class ManagedLoadBalancer extends S.Class<ManagedLoadBalancer>(
  "ManagedLoadBalancer",
)({
  arn: S.optional(S.String),
  status: S.String,
  statusReason: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  scheme: S.String,
  subnetIds: S.optional(StringList),
  securityGroupIds: S.optional(StringList),
}) {}
export class ManagedCertificate extends S.Class<ManagedCertificate>(
  "ManagedCertificate",
)({
  arn: S.optional(S.String),
  status: S.String,
  statusReason: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  domainName: S.String,
}) {}
export class ManagedListener extends S.Class<ManagedListener>(
  "ManagedListener",
)({
  arn: S.optional(S.String),
  status: S.String,
  statusReason: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ManagedListenerRule extends S.Class<ManagedListenerRule>(
  "ManagedListenerRule",
)({
  arn: S.optional(S.String),
  status: S.String,
  statusReason: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
}) {}
export class ManagedTargetGroup extends S.Class<ManagedTargetGroup>(
  "ManagedTargetGroup",
)({
  arn: S.optional(S.String),
  status: S.String,
  statusReason: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  healthCheckPath: S.String,
  healthCheckPort: S.Number,
  port: S.Number,
}) {}
export const ManagedTargetGroups = S.Array(ManagedTargetGroup);
export class ManagedScalableTarget extends S.Class<ManagedScalableTarget>(
  "ManagedScalableTarget",
)({
  arn: S.optional(S.String),
  status: S.String,
  statusReason: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  minCapacity: S.Number,
  maxCapacity: S.Number,
}) {}
export class ManagedApplicationAutoScalingPolicy extends S.Class<ManagedApplicationAutoScalingPolicy>(
  "ManagedApplicationAutoScalingPolicy",
)({
  arn: S.optional(S.String),
  status: S.String,
  statusReason: S.optional(S.String),
  updatedAt: S.Date.pipe(T.TimestampFormat("epoch-seconds")),
  policyType: S.String,
  targetValue: S.Number,
  metric: S.String,
}) {}
export const ManagedApplicationAutoScalingPolicies = S.Array(
  ManagedApplicationAutoScalingPolicy,
);
export class CreateManagedInstancesProviderConfiguration extends S.Class<CreateManagedInstancesProviderConfiguration>(
  "CreateManagedInstancesProviderConfiguration",
)({
  infrastructureRoleArn: S.String,
  instanceLaunchTemplate: InstanceLaunchTemplate,
  propagateTags: S.optional(S.String),
  infrastructureOptimization: S.optional(InfrastructureOptimization),
}) {}
export class ManagedIngressPath extends S.Class<ManagedIngressPath>(
  "ManagedIngressPath",
)({
  accessType: S.String,
  endpoint: S.String,
  loadBalancer: S.optional(ManagedLoadBalancer),
  loadBalancerSecurityGroups: S.optional(ManagedSecurityGroups),
  certificate: S.optional(ManagedCertificate),
  listener: S.optional(ManagedListener),
  rule: S.optional(ManagedListenerRule),
  targetGroups: S.optional(ManagedTargetGroups),
}) {}
export const ManagedIngressPaths = S.Array(ManagedIngressPath);
export class ManagedAutoScaling extends S.Class<ManagedAutoScaling>(
  "ManagedAutoScaling",
)({
  scalableTarget: S.optional(ManagedScalableTarget),
  applicationAutoScalingPolicies: S.optional(
    ManagedApplicationAutoScalingPolicies,
  ),
}) {}
export class CreateCapacityProviderRequest extends S.Class<CreateCapacityProviderRequest>(
  "CreateCapacityProviderRequest",
)(
  {
    name: S.String,
    cluster: S.optional(S.String),
    autoScalingGroupProvider: S.optional(AutoScalingGroupProvider),
    managedInstancesProvider: S.optional(
      CreateManagedInstancesProviderConfiguration,
    ),
    tags: S.optional(Tags),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateClusterResponse extends S.Class<CreateClusterResponse>(
  "CreateClusterResponse",
)({ cluster: S.optional(Cluster) }, ns) {}
export class DeleteExpressGatewayServiceResponse extends S.Class<DeleteExpressGatewayServiceResponse>(
  "DeleteExpressGatewayServiceResponse",
)({ service: S.optional(ECSExpressGatewayService) }, ns) {}
export class DeleteServiceResponse extends S.Class<DeleteServiceResponse>(
  "DeleteServiceResponse",
)({ service: S.optional(Service) }, ns) {}
export class DeregisterContainerInstanceResponse extends S.Class<DeregisterContainerInstanceResponse>(
  "DeregisterContainerInstanceResponse",
)({ containerInstance: S.optional(ContainerInstance) }, ns) {}
export class DescribeTasksResponse extends S.Class<DescribeTasksResponse>(
  "DescribeTasksResponse",
)({ tasks: S.optional(Tasks), failures: S.optional(Failures) }, ns) {}
export class RegisterTaskDefinitionResponse extends S.Class<RegisterTaskDefinitionResponse>(
  "RegisterTaskDefinitionResponse",
)({ taskDefinition: S.optional(TaskDefinition), tags: S.optional(Tags) }, ns) {}
export class RunTaskResponse extends S.Class<RunTaskResponse>(
  "RunTaskResponse",
)({ tasks: S.optional(Tasks), failures: S.optional(Failures) }, ns) {}
export class ECSManagedResources extends S.Class<ECSManagedResources>(
  "ECSManagedResources",
)({
  ingressPaths: S.optional(ManagedIngressPaths),
  autoScaling: S.optional(ManagedAutoScaling),
  metricAlarms: S.optional(ManagedMetricAlarms),
  serviceSecurityGroups: S.optional(ManagedSecurityGroups),
  logGroups: S.optional(ManagedLogGroups),
}) {}
export class ServiceRevision extends S.Class<ServiceRevision>(
  "ServiceRevision",
)({
  serviceRevisionArn: S.optional(S.String),
  serviceArn: S.optional(S.String),
  clusterArn: S.optional(S.String),
  taskDefinition: S.optional(S.String),
  capacityProviderStrategy: S.optional(CapacityProviderStrategy),
  launchType: S.optional(S.String),
  platformVersion: S.optional(S.String),
  platformFamily: S.optional(S.String),
  loadBalancers: S.optional(LoadBalancers),
  serviceRegistries: S.optional(ServiceRegistries),
  networkConfiguration: S.optional(NetworkConfiguration),
  containerImages: S.optional(ContainerImages),
  guardDutyEnabled: S.optional(S.Boolean),
  serviceConnectConfiguration: S.optional(ServiceConnectConfiguration),
  volumeConfigurations: S.optional(ServiceVolumeConfigurations),
  fargateEphemeralStorage: S.optional(DeploymentEphemeralStorage),
  createdAt: S.optional(S.Date.pipe(T.TimestampFormat("epoch-seconds"))),
  vpcLatticeConfigurations: S.optional(VpcLatticeConfigurations),
  resolvedConfiguration: S.optional(ResolvedConfiguration),
  ecsManagedResources: S.optional(ECSManagedResources),
}) {}
export const ServiceRevisions = S.Array(ServiceRevision);
export class CreateCapacityProviderResponse extends S.Class<CreateCapacityProviderResponse>(
  "CreateCapacityProviderResponse",
)({ capacityProvider: S.optional(CapacityProvider) }, ns) {}
export class DescribeServiceRevisionsResponse extends S.Class<DescribeServiceRevisionsResponse>(
  "DescribeServiceRevisionsResponse",
)(
  {
    serviceRevisions: S.optional(ServiceRevisions),
    failures: S.optional(Failures),
  },
  ns,
) {}
export class CreateServiceRequest extends S.Class<CreateServiceRequest>(
  "CreateServiceRequest",
)(
  {
    cluster: S.optional(S.String),
    serviceName: S.String,
    taskDefinition: S.optional(S.String),
    availabilityZoneRebalancing: S.optional(S.String),
    loadBalancers: S.optional(LoadBalancers),
    serviceRegistries: S.optional(ServiceRegistries),
    desiredCount: S.optional(S.Number),
    clientToken: S.optional(S.String),
    launchType: S.optional(S.String),
    capacityProviderStrategy: S.optional(CapacityProviderStrategy),
    platformVersion: S.optional(S.String),
    role: S.optional(S.String),
    deploymentConfiguration: S.optional(DeploymentConfiguration),
    placementConstraints: S.optional(PlacementConstraints),
    placementStrategy: S.optional(PlacementStrategies),
    networkConfiguration: S.optional(NetworkConfiguration),
    healthCheckGracePeriodSeconds: S.optional(S.Number),
    schedulingStrategy: S.optional(S.String),
    deploymentController: S.optional(DeploymentController),
    tags: S.optional(Tags),
    enableECSManagedTags: S.optional(S.Boolean),
    propagateTags: S.optional(S.String),
    enableExecuteCommand: S.optional(S.Boolean),
    serviceConnectConfiguration: S.optional(ServiceConnectConfiguration),
    volumeConfigurations: S.optional(ServiceVolumeConfigurations),
    vpcLatticeConfigurations: S.optional(VpcLatticeConfigurations),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateServiceResponse extends S.Class<CreateServiceResponse>(
  "CreateServiceResponse",
)({ service: S.optional(Service) }, ns) {}

//# Errors
export class ClientException extends S.TaggedError<ClientException>()(
  "ClientException",
  {},
) {}
export class ClusterNotFoundException extends S.TaggedError<ClusterNotFoundException>()(
  "ClusterNotFoundException",
  {},
) {}
export class InvalidParameterException extends S.TaggedError<InvalidParameterException>()(
  "InvalidParameterException",
  {},
) {}
export class ServerException extends S.TaggedError<ServerException>()(
  "ServerException",
  {},
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  {},
) {}
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  {},
) {}
export class NamespaceNotFoundException extends S.TaggedError<NamespaceNotFoundException>()(
  "NamespaceNotFoundException",
  {},
) {}
export class ServiceNotActiveException extends S.TaggedError<ServiceNotActiveException>()(
  "ServiceNotActiveException",
  {},
) {}
export class ServiceNotFoundException extends S.TaggedError<ServiceNotFoundException>()(
  "ServiceNotFoundException",
  {},
) {}
export class UnsupportedFeatureException extends S.TaggedError<UnsupportedFeatureException>()(
  "UnsupportedFeatureException",
  {},
) {}
export class TaskSetNotFoundException extends S.TaggedError<TaskSetNotFoundException>()(
  "TaskSetNotFoundException",
  {},
) {}
export class PlatformTaskDefinitionIncompatibilityException extends S.TaggedError<PlatformTaskDefinitionIncompatibilityException>()(
  "PlatformTaskDefinitionIncompatibilityException",
  {},
) {}
export class AttributeLimitExceededException extends S.TaggedError<AttributeLimitExceededException>()(
  "AttributeLimitExceededException",
  { message: S.optional(S.String) },
) {}
export class TargetNotFoundException extends S.TaggedError<TargetNotFoundException>()(
  "TargetNotFoundException",
  {},
) {}
export class ResourceInUseException extends S.TaggedError<ResourceInUseException>()(
  "ResourceInUseException",
  { message: S.optional(S.String) },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { resourceIds: S.optional(ResourceIds), message: S.optional(S.String) },
) {}
export class MissingVersionException extends S.TaggedError<MissingVersionException>()(
  "MissingVersionException",
  { message: S.optional(S.String) },
) {}
export class PlatformUnknownException extends S.TaggedError<PlatformUnknownException>()(
  "PlatformUnknownException",
  {},
) {}
export class TargetNotConnectedException extends S.TaggedError<TargetNotConnectedException>()(
  "TargetNotConnectedException",
  { message: S.optional(S.String) },
) {}
export class UpdateInProgressException extends S.TaggedError<UpdateInProgressException>()(
  "UpdateInProgressException",
  { message: S.optional(S.String) },
) {}
export class ServiceDeploymentNotFoundException extends S.TaggedError<ServiceDeploymentNotFoundException>()(
  "ServiceDeploymentNotFoundException",
  { message: S.optional(S.String) },
) {}
export class NoUpdateAvailableException extends S.TaggedError<NoUpdateAvailableException>()(
  "NoUpdateAvailableException",
  { message: S.optional(S.String) },
) {}
export class ClusterContainsCapacityProviderException extends S.TaggedError<ClusterContainsCapacityProviderException>()(
  "ClusterContainsCapacityProviderException",
  { message: S.optional(S.String) },
) {}
export class ClusterContainsContainerInstancesException extends S.TaggedError<ClusterContainsContainerInstancesException>()(
  "ClusterContainsContainerInstancesException",
  { message: S.optional(S.String) },
) {}
export class BlockedException extends S.TaggedError<BlockedException>()(
  "BlockedException",
  { message: S.optional(S.String) },
) {}
export class LimitExceededException extends S.TaggedError<LimitExceededException>()(
  "LimitExceededException",
  { message: S.optional(S.String) },
) {}
export class ClusterContainsServicesException extends S.TaggedError<ClusterContainsServicesException>()(
  "ClusterContainsServicesException",
  { message: S.optional(S.String) },
) {}
export class ClusterContainsTasksException extends S.TaggedError<ClusterContainsTasksException>()(
  "ClusterContainsTasksException",
  { message: S.optional(S.String) },
) {}

//# Operations
/**
 * Describes one or more of your clusters.
 *
 * For CLI
 * examples, see describe-clusters.rst on GitHub.
 */
export const describeClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeClustersRequest,
  output: DescribeClustersResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * Describes one or more container instances. Returns metadata about each container
 * instance requested.
 */
export const describeContainerInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeContainerInstancesRequest,
    output: DescribeContainerInstancesResponse,
    errors: [
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
    ],
  }),
);
/**
 * Describes the specified services running in your cluster.
 */
export const describeServices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeServicesRequest,
  output: DescribeServicesResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Describes a task definition. You can specify a `family` and
 * `revision` to find information about a specific task definition, or you
 * can simply specify the family to find the latest `ACTIVE` revision in that
 * family.
 *
 * You can only describe `INACTIVE` task definitions while an active task
 * or service references them.
 */
export const describeTaskDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeTaskDefinitionRequest,
    output: DescribeTaskDefinitionResponse,
    errors: [ClientException, InvalidParameterException, ServerException],
  }),
);
/**
 * This action is only used by the Amazon ECS agent, and it is not intended for use
 * outside of the agent.
 *
 * Returns an endpoint for the Amazon ECS agent to poll for updates.
 */
export const discoverPollEndpoint = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DiscoverPollEndpointRequest,
    output: DiscoverPollEndpointResponse,
    errors: [ClientException, ServerException],
  }),
);
/**
 * Lists the account settings for a specified principal.
 */
export const listAccountSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAccountSettingsRequest,
  output: ListAccountSettingsResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * Lists the attributes for Amazon ECS resources within a specified target type and
 * cluster. When you specify a target type and cluster, `ListAttributes` returns
 * a list of attribute objects, one for each attribute on each resource. You can filter the
 * list of results to a single attribute name to only return results that have that name.
 * You can also filter the results by attribute name and value. You can do this, for
 * example, to see which container instances in a cluster are running a Linux AMI
 * (`ecs.os-type=linux`).
 */
export const listAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAttributesRequest,
  output: ListAttributesResponse,
  errors: [ClusterNotFoundException, InvalidParameterException],
}));
/**
 * Returns a list of existing clusters.
 */
export const listClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListClustersRequest,
  output: ListClustersResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * Returns a list of container instances in a specified cluster. You can filter the
 * results of a `ListContainerInstances` operation with cluster query language
 * statements inside the `filter` parameter. For more information, see Cluster Query Language in the Amazon Elastic
 * Container Service Developer Guide.
 */
export const listContainerInstances = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListContainerInstancesRequest,
    output: ListContainerInstancesResponse,
    errors: [
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
    ],
  }),
);
/**
 * Returns a list of services. You can filter the results by cluster, launch type, and
 * scheduling strategy.
 */
export const listServices = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListServicesRequest,
  output: ListServicesResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * List the tags for an Amazon ECS resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Returns a list of task definition families that are registered to your account. This
 * list includes task definition families that no longer have any `ACTIVE` task
 * definition revisions.
 *
 * You can filter out task definition families that don't contain any `ACTIVE`
 * task definition revisions by setting the `status` parameter to
 * `ACTIVE`. You can also filter the results with the
 * `familyPrefix` parameter.
 */
export const listTaskDefinitionFamilies = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListTaskDefinitionFamiliesRequest,
    output: ListTaskDefinitionFamiliesResponse,
    errors: [ClientException, InvalidParameterException, ServerException],
  }),
);
/**
 * Returns a list of task definitions that are registered to your account. You can filter
 * the results by family name with the `familyPrefix` parameter or by status
 * with the `status` parameter.
 */
export const listTaskDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTaskDefinitionsRequest,
  output: ListTaskDefinitionsResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * Modifies an account setting. Account settings are set on a per-Region basis.
 *
 * If you change the root user account setting, the default settings are reset for users
 * and roles that do not have specified individual account settings. For more information,
 * see Account
 * Settings in the Amazon Elastic Container Service Developer
 * Guide.
 */
export const putAccountSetting = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAccountSettingRequest,
  output: PutAccountSettingResponse,
  errors: [ClientException, InvalidParameterException, ServerException],
}));
/**
 * Modifies an account setting for all users on an account for whom no individual account
 * setting has been specified. Account settings are set on a per-Region basis.
 */
export const putAccountSettingDefault = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutAccountSettingDefaultRequest,
    output: PutAccountSettingDefaultResponse,
    errors: [ClientException, InvalidParameterException, ServerException],
  }),
);
/**
 * Stops a running task. Any tags associated with the task will be deleted.
 *
 * When you call `StopTask` on a task, the equivalent of docker
 * stop is issued to the containers running in the task. This results in a
 * stop signal value and a default 30-second timeout, after which the
 * `SIGKILL` value is sent and the containers are forcibly stopped. This
 * signal can be defined in your container image with the `STOPSIGNAL` instruction
 * and will default to `SIGTERM`. If the container handles the `SIGTERM`
 * value gracefully and exits within 30 seconds from receiving it, no `SIGKILL` value
 * is sent.
 *
 * For Windows containers, POSIX signals do not work and runtime stops the container by
 * sending a `CTRL_SHUTDOWN_EVENT`. For more information, see Unable to react to graceful shutdown
 * of (Windows) container #25982 on GitHub.
 *
 * The default 30-second timeout can be configured on the Amazon ECS container agent
 * with the `ECS_CONTAINER_STOP_TIMEOUT` variable. For more information, see
 * Amazon ECS Container Agent Configuration in the
 * *Amazon Elastic Container Service Developer Guide*.
 */
export const stopTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StopTaskRequest,
  output: StopTaskResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Deletes specified tags from a resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Updates the cluster.
 */
export const updateCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterRequest,
  output: UpdateClusterResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    NamespaceNotFoundException,
    ServerException,
  ],
}));
/**
 * Modifies the settings to use for a cluster.
 */
export const updateClusterSettings = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateClusterSettingsRequest,
    output: UpdateClusterSettingsResponse,
    errors: [
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
    ],
  }),
);
/**
 * Modifies the status of an Amazon ECS container instance.
 *
 * Once a container instance has reached an `ACTIVE` state, you can change the
 * status of a container instance to `DRAINING` to manually remove an instance
 * from a cluster, for example to perform system updates, update the Docker daemon, or
 * scale down the cluster size.
 *
 * A container instance can't be changed to `DRAINING` until it has
 * reached an `ACTIVE` status. If the instance is in any other status, an
 * error will be received.
 *
 * When you set a container instance to `DRAINING`, Amazon ECS prevents new
 * tasks from being scheduled for placement on the container instance and replacement
 * service tasks are started on other container instances in the cluster if the resources
 * are available. Service tasks on the container instance that are in the
 * `PENDING` state are stopped immediately.
 *
 * Service tasks on the container instance that are in the `RUNNING` state are
 * stopped and replaced according to the service's deployment configuration parameters,
 * `minimumHealthyPercent` and `maximumPercent`. You can change
 * the deployment configuration of your service using UpdateService.
 *
 * - If `minimumHealthyPercent` is below 100%, the scheduler can ignore
 * `desiredCount` temporarily during task replacement. For example,
 * `desiredCount` is four tasks, a minimum of 50% allows the
 * scheduler to stop two existing tasks before starting two new tasks. If the
 * minimum is 100%, the service scheduler can't remove existing tasks until the
 * replacement tasks are considered healthy. Tasks for services that do not use a
 * load balancer are considered healthy if they're in the `RUNNING`
 * state. Tasks for services that use a load balancer are considered healthy if
 * they're in the `RUNNING` state and are reported as healthy by the
 * load balancer.
 *
 * - The `maximumPercent` parameter represents an upper limit on the
 * number of running tasks during task replacement. You can use this to define the
 * replacement batch size. For example, if `desiredCount` is four tasks,
 * a maximum of 200% starts four new tasks before stopping the four tasks to be
 * drained, provided that the cluster resources required to do this are available.
 * If the maximum is 100%, then replacement tasks can't start until the draining
 * tasks have stopped.
 *
 * Any `PENDING` or `RUNNING` tasks that do not belong to a service
 * aren't affected. You must wait for them to finish or stop them manually.
 *
 * A container instance has completed draining when it has no more `RUNNING`
 * tasks. You can verify this using ListTasks.
 *
 * When a container instance has been drained, you can set a container instance to
 * `ACTIVE` status and once it has reached that status the Amazon ECS
 * scheduler can begin scheduling tasks on the instance again.
 */
export const updateContainerInstancesState =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: UpdateContainerInstancesStateRequest,
    output: UpdateContainerInstancesStateResponse,
    errors: [
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
    ],
  }));
/**
 * Updates the protection status of a task. You can set `protectionEnabled` to
 * `true` to protect your task from termination during scale-in events from
 * Service
 * Autoscaling or deployments.
 *
 * Task-protection, by default, expires after 2 hours at which point Amazon ECS clears
 * the `protectionEnabled` property making the task eligible for termination by
 * a subsequent scale-in event.
 *
 * You can specify a custom expiration period for task protection from 1 minute to up to
 * 2,880 minutes (48 hours). To specify the custom expiration period, set the
 * `expiresInMinutes` property. The `expiresInMinutes` property
 * is always reset when you invoke this operation for a task that already has
 * `protectionEnabled` set to `true`. You can keep extending the
 * protection expiration period of a task by invoking this operation repeatedly.
 *
 * To learn more about Amazon ECS task protection, see Task scale-in
 * protection in the
 * Amazon Elastic Container Service
 * Developer Guide
 * .
 *
 * This operation is only supported for tasks belonging to an Amazon ECS service.
 * Invoking this operation for a standalone task will result in an
 * `TASK_NOT_VALID` failure. For more information, see API failure
 * reasons.
 *
 * If you prefer to set task protection from within the container, we recommend using
 * the Task scale-in protection endpoint.
 */
export const updateTaskProtection = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateTaskProtectionRequest,
    output: UpdateTaskProtectionResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ResourceNotFoundException,
      ServerException,
      UnsupportedFeatureException,
    ],
  }),
);
/**
 * Modifies a task set. This is used when a service uses the `EXTERNAL`
 * deployment controller type. For more information, see Amazon ECS Deployment
 * Types in the Amazon Elastic Container Service Developer
 * Guide.
 */
export const updateTaskSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateTaskSetRequest,
  output: UpdateTaskSetResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    TaskSetNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Disables an account setting for a specified user, role, or the root user for an
 * account.
 */
export const deleteAccountSetting = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteAccountSettingRequest,
    output: DeleteAccountSettingResponse,
    errors: [ClientException, InvalidParameterException, ServerException],
  }),
);
/**
 * Deletes one or more task definitions.
 *
 * You must deregister a task definition revision before you delete it. For more
 * information, see DeregisterTaskDefinition.
 *
 * When you delete a task definition revision, it is immediately transitions from the
 * `INACTIVE` to `DELETE_IN_PROGRESS`. Existing tasks and
 * services that reference a `DELETE_IN_PROGRESS` task definition revision
 * continue to run without disruption. Existing services that reference a
 * `DELETE_IN_PROGRESS` task definition revision can still scale up or down
 * by modifying the service's desired count.
 *
 * You can't use a `DELETE_IN_PROGRESS` task definition revision to run new
 * tasks or create new services. You also can't update an existing service to reference a
 * `DELETE_IN_PROGRESS` task definition revision.
 *
 * A task definition revision will stay in `DELETE_IN_PROGRESS` status until
 * all the associated tasks and services have been terminated.
 *
 * When you delete all `INACTIVE` task definition revisions, the task
 * definition name is not displayed in the console and not returned in the API. If a task
 * definition revisions are in the `DELETE_IN_PROGRESS` state, the task
 * definition name is displayed in the console and returned in the API. The task definition
 * name is retained by Amazon ECS and the revision is incremented the next time you create
 * a task definition with that name.
 */
export const deleteTaskDefinitions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteTaskDefinitionsRequest,
    output: DeleteTaskDefinitionsResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      InvalidParameterException,
      ServerException,
    ],
  }),
);
/**
 * Deregisters the specified task definition by family and revision. Upon deregistration,
 * the task definition is marked as `INACTIVE`. Existing tasks and services that
 * reference an `INACTIVE` task definition continue to run without disruption.
 * Existing services that reference an `INACTIVE` task definition can still
 * scale up or down by modifying the service's desired count. If you want to delete a task
 * definition revision, you must first deregister the task definition revision.
 *
 * You can't use an `INACTIVE` task definition to run new tasks or create new
 * services, and you can't update an existing service to reference an `INACTIVE`
 * task definition. However, there may be up to a 10-minute window following deregistration
 * where these restrictions have not yet taken effect.
 *
 * At this time, `INACTIVE` task definitions remain discoverable in your
 * account indefinitely. However, this behavior is subject to change in the future. We
 * don't recommend that you rely on `INACTIVE` task definitions persisting
 * beyond the lifecycle of any associated tasks and services.
 *
 * You must deregister a task definition revision before you delete it. For more
 * information, see DeleteTaskDefinitions.
 */
export const deregisterTaskDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterTaskDefinitionRequest,
    output: DeregisterTaskDefinitionResponse,
    errors: [ClientException, InvalidParameterException, ServerException],
  }),
);
/**
 * Describes one or more of your capacity providers.
 */
export const describeCapacityProviders = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCapacityProvidersRequest,
    output: DescribeCapacityProvidersResponse,
    errors: [
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
      UnsupportedFeatureException,
    ],
  }),
);
/**
 * Retrieves detailed information about an Express service, including current status,
 * configuration, managed infrastructure, and service revisions.
 *
 * Returns comprehensive service details, active service revisions, ingress paths with
 * endpoints, and managed Amazon Web Services resource status including load balancers and auto-scaling
 * policies.
 *
 * Use the `include` parameter to retrieve additional information such as
 * resource tags.
 */
export const describeExpressGatewayService =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeExpressGatewayServiceRequest,
    output: DescribeExpressGatewayServiceResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ResourceNotFoundException,
      ServerException,
      UnsupportedFeatureException,
    ],
  }));
/**
 * Describes the task sets in the specified cluster and service. This is used when a
 * service uses the `EXTERNAL` deployment controller type. For more information,
 * see Amazon ECS Deployment
 * Types in the Amazon Elastic Container Service Developer
 * Guide.
 */
export const describeTaskSets = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTaskSetsRequest,
  output: DescribeTaskSetsResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Retrieves the protection status of tasks in an Amazon ECS service.
 */
export const getTaskProtection = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetTaskProtectionRequest,
  output: GetTaskProtectionResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * This operation lists all of the services that are associated with a Cloud Map namespace.
 * This list might include services in different clusters. In contrast,
 * `ListServices` can only list services in one cluster at a time. If you
 * need to filter the list of services in a single cluster by various parameters, use
 * `ListServices`. For more information, see Service Connect
 * in the *Amazon Elastic Container Service Developer Guide*.
 */
export const listServicesByNamespace = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListServicesByNamespaceRequest,
    output: ListServicesByNamespaceResponse,
    errors: [
      ClientException,
      InvalidParameterException,
      NamespaceNotFoundException,
      ServerException,
    ],
  }),
);
/**
 * Returns a list of tasks. You can filter the results by cluster, task definition
 * family, container instance, launch type, what IAM principal started the task, or by the
 * desired status of the task.
 *
 * Recently stopped tasks might appear in the returned results.
 */
export const listTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTasksRequest,
  output: ListTasksResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotFoundException,
  ],
}));
/**
 * Create or update an attribute on an Amazon ECS resource. If the attribute doesn't
 * exist, it's created. If the attribute exists, its value is replaced with the specified
 * value. To delete an attribute, use DeleteAttributes. For more information, see Attributes in the Amazon Elastic Container
 * Service Developer Guide.
 */
export const putAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PutAttributesRequest,
  output: PutAttributesResponse,
  errors: [
    AttributeLimitExceededException,
    ClusterNotFoundException,
    InvalidParameterException,
    TargetNotFoundException,
  ],
}));
/**
 * This action is only used by the Amazon ECS agent, and it is not intended for use
 * outside of the agent.
 *
 * Registers an EC2 instance into the specified cluster. This instance becomes available
 * to place containers on.
 */
export const registerContainerInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterContainerInstanceRequest,
    output: RegisterContainerInstanceResponse,
    errors: [ClientException, InvalidParameterException, ServerException],
  }),
);
/**
 * Starts a new task from the specified task definition on the specified container
 * instance or instances.
 *
 * On March 21, 2024, a change was made to resolve the task definition revision
 * before authorization. When a task definition revision is not specified,
 * authorization will occur using the latest revision of a task definition.
 *
 * Amazon Elastic Inference (EI) is no longer available to customers.
 *
 * Alternatively, you can use`RunTask` to place tasks for you. For more
 * information, see Scheduling Tasks in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * You can attach Amazon EBS volumes to Amazon ECS tasks by configuring the volume when
 * creating or updating a service. For more information, see Amazon EBS volumes in the Amazon Elastic
 * Container Service Developer Guide.
 */
export const startTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartTaskRequest,
  output: StartTaskResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * This action is only used by the Amazon ECS agent, and it is not intended for use
 * outside of the agent.
 *
 * Sent to acknowledge that an attachment changed states.
 */
export const submitAttachmentStateChanges =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: SubmitAttachmentStateChangesRequest,
    output: SubmitAttachmentStateChangesResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      InvalidParameterException,
      ServerException,
    ],
  }));
/**
 * This action is only used by the Amazon ECS agent, and it is not intended for use
 * outside of the agent.
 *
 * Sent to acknowledge that a container changed states.
 */
export const submitContainerStateChange = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SubmitContainerStateChangeRequest,
    output: SubmitContainerStateChangeResponse,
    errors: [AccessDeniedException, ClientException, ServerException],
  }),
);
/**
 * This action is only used by the Amazon ECS agent, and it is not intended for use
 * outside of the agent.
 *
 * Sent to acknowledge that a task changed states.
 */
export const submitTaskStateChange = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: SubmitTaskStateChangeRequest,
    output: SubmitTaskStateChangeResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      InvalidParameterException,
      ServerException,
    ],
  }),
);
/**
 * Associates the specified tags to a resource with the specified
 * `resourceArn`. If existing tags on a resource aren't specified in the
 * request parameters, they aren't changed. When a resource is deleted, the tags that are
 * associated with that resource are deleted as well.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ResourceNotFoundException,
    ServerException,
  ],
}));
/**
 * Updates an existing Express service configuration. Modifies container settings, resource
 * allocation, auto-scaling configuration, and other service parameters without recreating the
 * service.
 *
 * Amazon ECS creates a new service revision with updated configuration and performs a rolling
 * deployment to replace existing tasks. The service remains available during updates,
 * ensuring zero-downtime deployments.
 *
 * Some parameters like the infrastructure role cannot be modified after service creation
 * and require creating a new service.
 */
export const updateExpressGatewayService = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateExpressGatewayServiceRequest,
    output: UpdateExpressGatewayServiceResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
      ServiceNotActiveException,
      ServiceNotFoundException,
      UnsupportedFeatureException,
    ],
  }),
);
/**
 * Modifies the parameters of a service.
 *
 * On March 21, 2024, a change was made to resolve the task definition revision
 * before authorization. When a task definition revision is not specified,
 * authorization will occur using the latest revision of a task definition.
 *
 * For services using the rolling update (`ECS`) you can update the desired
 * count, deployment configuration, network configuration, load balancers, service
 * registries, enable ECS managed tags option, propagate tags option, task placement
 * constraints and strategies, and task definition. When you update any of these
 * parameters, Amazon ECS starts new tasks with the new configuration.
 *
 * You can attach Amazon EBS volumes to Amazon ECS tasks by configuring the volume when
 * starting or running a task, or when creating or updating a service. For more
 * information, see Amazon EBS volumes in the Amazon Elastic
 * Container Service Developer Guide. You can update your volume
 * configurations and trigger a new deployment. `volumeConfigurations` is only
 * supported for REPLICA service and not DAEMON service. If you leave
 * `volumeConfigurations`
 * `null`, it doesn't trigger a new deployment. For more information on volumes,
 * see Amazon EBS volumes in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * For services using the blue/green (`CODE_DEPLOY`) deployment controller,
 * only the desired count, deployment configuration, health check grace period, task
 * placement constraints and strategies, enable ECS managed tags option, and propagate tags
 * can be updated using this API. If the network configuration, platform version, task
 * definition, or load balancer need to be updated, create a new CodeDeploy deployment. For
 * more information, see CreateDeployment in the CodeDeploy API
 * Reference.
 *
 * For services using an external deployment controller, you can update only the desired
 * count, task placement constraints and strategies, health check grace period, enable ECS
 * managed tags option, and propagate tags option, using this API. If the launch type, load
 * balancer, network configuration, platform version, or task definition need to be
 * updated, create a new task set For more information, see CreateTaskSet.
 *
 * You can add to or subtract from the number of instantiations of a task definition in a
 * service by specifying the cluster that the service is running in and a new
 * `desiredCount` parameter.
 *
 * You can attach Amazon EBS volumes to Amazon ECS tasks by configuring the volume when
 * starting or running a task, or when creating or updating a service. For more
 * information, see Amazon EBS volumes in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * If you have updated the container image of your application, you can create a new task
 * definition with that image and deploy it to your service. The service scheduler uses the
 * minimum healthy percent and maximum percent parameters (in the service's deployment
 * configuration) to determine the deployment strategy.
 *
 * If your updated Docker image uses the same tag as what is in the existing task
 * definition for your service (for example, `my_image:latest`), you don't
 * need to create a new revision of your task definition. You can update the service
 * using the `forceNewDeployment` option. The new tasks launched by the
 * deployment pull the current image/tag combination from your repository when they
 * start.
 *
 * You can also update the deployment configuration of a service. When a deployment is
 * triggered by updating the task definition of a service, the service scheduler uses the
 * deployment configuration parameters, `minimumHealthyPercent` and
 * `maximumPercent`, to determine the deployment strategy.
 *
 * - If `minimumHealthyPercent` is below 100%, the scheduler can ignore
 * `desiredCount` temporarily during a deployment. For example, if
 * `desiredCount` is four tasks, a minimum of 50% allows the
 * scheduler to stop two existing tasks before starting two new tasks. Tasks for
 * services that don't use a load balancer are considered healthy if they're in the
 * `RUNNING` state. Tasks for services that use a load balancer are
 * considered healthy if they're in the `RUNNING` state and are reported
 * as healthy by the load balancer.
 *
 * - The `maximumPercent` parameter represents an upper limit on the
 * number of running tasks during a deployment. You can use it to define the
 * deployment batch size. For example, if `desiredCount` is four tasks,
 * a maximum of 200% starts four new tasks before stopping the four older tasks
 * (provided that the cluster resources required to do this are available).
 *
 * When UpdateService
 * stops a task during a deployment, the equivalent of `docker stop` is issued
 * to the containers running in the task. This results in a `SIGTERM` and a
 * 30-second timeout. After this, `SIGKILL` is sent and the containers are
 * forcibly stopped. If the container handles the `SIGTERM` gracefully and exits
 * within 30 seconds from receiving it, no `SIGKILL` is sent.
 *
 * When the service scheduler launches new tasks, it determines task placement in your
 * cluster with the following logic.
 *
 * - Determine which of the container instances in your cluster can support your
 * service's task definition. For example, they have the required CPU, memory,
 * ports, and container instance attributes.
 *
 * - By default, the service scheduler attempts to balance tasks across
 * Availability Zones in this manner even though you can choose a different
 * placement strategy.
 *
 * - Sort the valid container instances by the fewest number of running
 * tasks for this service in the same Availability Zone as the instance.
 * For example, if zone A has one running service task and zones B and C
 * each have zero, valid container instances in either zone B or C are
 * considered optimal for placement.
 *
 * - Place the new service task on a valid container instance in an optimal
 * Availability Zone (based on the previous steps), favoring container
 * instances with the fewest number of running tasks for this
 * service.
 *
 * When the service scheduler stops running tasks, it attempts to maintain balance across
 * the Availability Zones in your cluster using the following logic:
 *
 * - Sort the container instances by the largest number of running tasks for this
 * service in the same Availability Zone as the instance. For example, if zone A
 * has one running service task and zones B and C each have two, container
 * instances in either zone B or C are considered optimal for termination.
 *
 * - Stop the task on a container instance in an optimal Availability Zone (based
 * on the previous steps), favoring container instances with the largest number of
 * running tasks for this service.
 */
export const updateService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateServiceRequest,
  output: UpdateServiceResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    NamespaceNotFoundException,
    PlatformTaskDefinitionIncompatibilityException,
    PlatformUnknownException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Modifies which task set in a service is the primary task set. Any parameters that are
 * updated on the primary task set in a service will transition to the service. This is
 * used when a service uses the `EXTERNAL` deployment controller type. For more
 * information, see Amazon ECS Deployment
 * Types in the Amazon Elastic Container Service Developer
 * Guide.
 */
export const updateServicePrimaryTaskSet = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateServicePrimaryTaskSetRequest,
    output: UpdateServicePrimaryTaskSetResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
      ServiceNotActiveException,
      ServiceNotFoundException,
      TaskSetNotFoundException,
      UnsupportedFeatureException,
    ],
  }),
);
/**
 * Creates an Express service that simplifies deploying containerized web applications on
 * Amazon ECS with managed Amazon Web Services infrastructure. This operation provisions and configures
 * Application Load Balancers, target groups, security groups, and auto-scaling policies
 * automatically.
 *
 * Specify a primary container configuration with your application image and basic
 * settings. Amazon ECS creates the necessary Amazon Web Services resources for traffic distribution, health
 * monitoring, network access control, and capacity management.
 *
 * Provide an execution role for task operations and an infrastructure role for managing
 * Amazon Web Services resources on your behalf.
 */
export const createExpressGatewayService = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateExpressGatewayServiceRequest,
    output: CreateExpressGatewayServiceResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      PlatformTaskDefinitionIncompatibilityException,
      PlatformUnknownException,
      ServerException,
      UnsupportedFeatureException,
    ],
  }),
);
/**
 * Create a task set in the specified cluster and service. This is used when a service
 * uses the `EXTERNAL` deployment controller type. For more information, see
 * Amazon ECS deployment
 * types in the Amazon Elastic Container Service Developer
 * Guide.
 *
 * On March 21, 2024, a change was made to resolve the task definition revision
 * before authorization. When a task definition revision is not specified,
 * authorization will occur using the latest revision of a task definition.
 *
 * For information about the maximum number of task sets and other quotas, see Amazon ECS service quotas in the Amazon Elastic Container Service
 * Developer Guide.
 */
export const createTaskSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateTaskSetRequest,
  output: CreateTaskSetResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    NamespaceNotFoundException,
    PlatformTaskDefinitionIncompatibilityException,
    PlatformUnknownException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Deletes one or more custom attributes from an Amazon ECS resource.
 */
export const deleteAttributes = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteAttributesRequest,
  output: DeleteAttributesResponse,
  errors: [
    ClusterNotFoundException,
    InvalidParameterException,
    TargetNotFoundException,
  ],
}));
/**
 * Deletes the specified capacity provider.
 *
 * The `FARGATE` and `FARGATE_SPOT` capacity providers are
 * reserved and can't be deleted. You can disassociate them from a cluster using either
 * PutClusterCapacityProviders or by deleting the cluster.
 *
 * Prior to a capacity provider being deleted, the capacity provider must be removed from
 * the capacity provider strategy from all services. The UpdateService API
 * can be used to remove a capacity provider from a service's capacity provider strategy.
 * When updating a service, the `forceNewDeployment` option can be used to
 * ensure that any tasks using the Amazon EC2 instance capacity provided by the capacity
 * provider are transitioned to use the capacity from the remaining capacity providers.
 * Only capacity providers that aren't associated with a cluster can be deleted. To remove
 * a capacity provider from a cluster, you can either use PutClusterCapacityProviders or delete the cluster.
 */
export const deleteCapacityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCapacityProviderRequest,
    output: DeleteCapacityProviderResponse,
    errors: [
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
      UnsupportedFeatureException,
    ],
  }),
);
/**
 * Deletes a specified task set within a service. This is used when a service uses the
 * `EXTERNAL` deployment controller type. For more information, see Amazon ECS deployment types in the Amazon Elastic Container
 * Service Developer Guide.
 */
export const deleteTaskSet = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteTaskSetRequest,
  output: DeleteTaskSetResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotActiveException,
    ServiceNotFoundException,
    TaskSetNotFoundException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Describes one or more of your service deployments.
 *
 * A service deployment happens when you release a software update for the service. For
 * more information, see View service history
 * using Amazon ECS service deployments.
 */
export const describeServiceDeployments = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeServiceDeploymentsRequest,
    output: DescribeServiceDeploymentsResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
      ServiceNotFoundException,
      UnsupportedFeatureException,
    ],
  }),
);
/**
 * Runs a command remotely on a container within a task.
 *
 * If you use a condition key in your IAM policy to refine the conditions for the policy
 * statement, for example limit the actions to a specific cluster, you receive an
 * `AccessDeniedException` when there is a mismatch between the condition
 * key value and the corresponding parameter value.
 *
 * For information about required permissions and considerations, see Using
 * Amazon ECS Exec for debugging in the Amazon ECS Developer
 * Guide.
 */
export const executeCommand = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExecuteCommandRequest,
  output: ExecuteCommandResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    TargetNotConnectedException,
  ],
}));
/**
 * This operation lists all the service deployments that meet the specified filter
 * criteria.
 *
 * A service deployment happens when you release a software update for the service. You
 * route traffic from the running service revisions to the new service revison and control
 * the number of running tasks.
 *
 * This API returns the values that you use for the request parameters in DescribeServiceRevisions.
 */
export const listServiceDeployments = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ListServiceDeploymentsRequest,
    output: ListServiceDeploymentsResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      InvalidParameterException,
      ServerException,
      ServiceNotFoundException,
      UnsupportedFeatureException,
    ],
  }),
);
/**
 * Modifies the available capacity providers and the default capacity provider strategy
 * for a cluster.
 *
 * You must specify both the available capacity providers and a default capacity provider
 * strategy for the cluster. If the specified cluster has existing capacity providers
 * associated with it, you must specify all existing capacity providers in addition to any
 * new ones you want to add. Any existing capacity providers that are associated with a
 * cluster that are omitted from a PutClusterCapacityProviders API call will be disassociated with the
 * cluster. You can only disassociate an existing capacity provider from a cluster if it's
 * not being used by any existing tasks.
 *
 * When creating a service or running a task on a cluster, if no capacity provider or
 * launch type is specified, then the cluster's default capacity provider strategy is used.
 * We recommend that you define a default capacity provider strategy for your cluster.
 * However, you must specify an empty array (`[]`) to bypass defining a default
 * strategy.
 *
 * Amazon ECS Managed Instances doesn't support this, because when you create a capacity
 * provider with Amazon ECS Managed Instances, it becomes available only within the
 * specified cluster.
 */
export const putClusterCapacityProviders = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: PutClusterCapacityProvidersRequest,
    output: PutClusterCapacityProvidersResponse,
    errors: [
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ResourceInUseException,
      ServerException,
      UpdateInProgressException,
    ],
  }),
);
/**
 * Stops an ongoing service deployment.
 *
 * The following stop types are avaiable:
 *
 * - ROLLBACK - This option rolls back the service deployment to the previous
 * service revision.
 *
 * You can use this option even if you didn't configure the service deployment
 * for the rollback option.
 *
 * For more information, see Stopping Amazon
 * ECS service deployments in the Amazon Elastic Container Service
 * Developer Guide.
 */
export const stopServiceDeployment = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: StopServiceDeploymentRequest,
    output: StopServiceDeploymentResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      ConflictException,
      InvalidParameterException,
      ServerException,
      ServiceDeploymentNotFoundException,
      UnsupportedFeatureException,
    ],
  }),
);
/**
 * Modifies the parameters for a capacity provider.
 *
 * These changes only apply to new Amazon ECS Managed Instances, or EC2 instances, not
 * existing ones.
 */
export const updateCapacityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateCapacityProviderRequest,
    output: UpdateCapacityProviderResponse,
    errors: [
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
      UnsupportedFeatureException,
    ],
  }),
);
/**
 * Updates the Amazon ECS container agent on a specified container instance. Updating the
 * Amazon ECS container agent doesn't interrupt running tasks or services on the container
 * instance. The process for updating the agent differs depending on whether your container
 * instance was launched with the Amazon ECS-optimized AMI or another operating
 * system.
 *
 * The `UpdateContainerAgent` API isn't supported for container instances
 * using the Amazon ECS-optimized Amazon Linux 2 (arm64) AMI. To update the container
 * agent, you can update the `ecs-init` package. This updates the agent. For
 * more information, see Updating the
 * Amazon ECS container agent in the Amazon Elastic Container
 * Service Developer Guide.
 *
 * Agent updates with the `UpdateContainerAgent` API operation do not
 * apply to Windows container instances. We recommend that you launch new container
 * instances to update the agent version in your Windows clusters.
 *
 * The `UpdateContainerAgent` API requires an Amazon ECS-optimized AMI or
 * Amazon Linux AMI with the `ecs-init` service installed and running. For help
 * updating the Amazon ECS container agent on other operating systems, see Manually updating the Amazon ECS container agent in the Amazon
 * Elastic Container Service Developer Guide.
 */
export const updateContainerAgent = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateContainerAgentRequest,
    output: UpdateContainerAgentResponse,
    errors: [
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      MissingVersionException,
      NoUpdateAvailableException,
      ServerException,
      UpdateInProgressException,
    ],
  }),
);
/**
 * Creates a new Amazon ECS cluster. By default, your account receives a
 * `default` cluster when you launch your first container instance. However,
 * you can create your own cluster with a unique name.
 *
 * When you call the CreateCluster
 * API operation, Amazon ECS attempts to create the Amazon ECS service-linked role for
 * your account. This is so that it can manage required resources in other Amazon Web
 * Services services on your behalf. However, if the user that makes the
 * call doesn't have permissions to create the service-linked role, it isn't created.
 * For more information, see Using
 * service-linked roles for Amazon ECS in the Amazon Elastic
 * Container Service Developer Guide.
 */
export const createCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResponse,
  errors: [
    ClientException,
    InvalidParameterException,
    NamespaceNotFoundException,
    ServerException,
  ],
}));
/**
 * Deletes an Express service and removes all associated Amazon Web Services resources. This operation
 * stops service tasks, removes the Application Load Balancer, target groups, security groups,
 * auto-scaling policies, and other managed infrastructure components.
 *
 * The service enters a `DRAINING` state where existing tasks complete current
 * requests without starting new tasks. After all tasks stop, the service and infrastructure
 * are permanently removed.
 *
 * This operation cannot be reversed. Back up important data and verify the service is no
 * longer needed before deletion.
 */
export const deleteExpressGatewayService = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteExpressGatewayServiceRequest,
    output: DeleteExpressGatewayServiceResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
      ServiceNotActiveException,
      ServiceNotFoundException,
      UnsupportedFeatureException,
    ],
  }),
);
/**
 * Deletes a specified service within a cluster. You can delete a service if you have no
 * running tasks in it and the desired task count is zero. If the service is actively
 * maintaining tasks, you can't delete it, and you must update the service to a desired
 * task count of zero. For more information, see UpdateService.
 *
 * When you delete a service, if there are still running tasks that require cleanup,
 * the service status moves from `ACTIVE` to `DRAINING`, and the
 * service is no longer visible in the console or in the ListServices
 * API operation. After all tasks have transitioned to either `STOPPING` or
 * `STOPPED` status, the service status moves from `DRAINING`
 * to `INACTIVE`. Services in the `DRAINING` or
 * `INACTIVE` status can still be viewed with the DescribeServices API operation. However, in the future,
 * `INACTIVE` services may be cleaned up and purged from Amazon ECS
 * record keeping, and DescribeServices calls on those services return a
 * `ServiceNotFoundException` error.
 *
 * If you attempt to create a new service with the same name as an existing service
 * in either `ACTIVE` or `DRAINING` status, you receive an
 * error.
 */
export const deleteService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServiceRequest,
  output: DeleteServiceResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    ServiceNotFoundException,
  ],
}));
/**
 * Deregisters an Amazon ECS container instance from the specified cluster. This instance
 * is no longer available to run tasks.
 *
 * If you intend to use the container instance for some other purpose after
 * deregistration, we recommend that you stop all of the tasks running on the container
 * instance before deregistration. That prevents any orphaned tasks from consuming
 * resources.
 *
 * Deregistering a container instance removes the instance from a cluster, but it doesn't
 * terminate the EC2 instance. If you are finished using the instance, be sure to terminate
 * it in the Amazon EC2 console to stop billing.
 *
 * If you terminate a running container instance, Amazon ECS automatically
 * deregisters the instance from your cluster (stopped container instances or instances
 * with disconnected agents aren't automatically deregistered when terminated).
 */
export const deregisterContainerInstance = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeregisterContainerInstanceRequest,
    output: DeregisterContainerInstanceResponse,
    errors: [
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
    ],
  }),
);
/**
 * Describes a specified task or tasks.
 *
 * Currently, stopped tasks appear in the returned results for at least one hour.
 *
 * If you have tasks with tags, and then delete the cluster, the tagged tasks are
 * returned in the response. If you create a new cluster with the same name as the deleted
 * cluster, the tagged tasks are not included in the response.
 */
export const describeTasks = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeTasksRequest,
  output: DescribeTasksResponse,
  errors: [
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
  ],
}));
/**
 * Registers a new task definition from the supplied `family` and
 * `containerDefinitions`. Optionally, you can add data volumes to your
 * containers with the `volumes` parameter. For more information about task
 * definition parameters and defaults, see Amazon ECS Task
 * Definitions in the Amazon Elastic Container Service Developer
 * Guide.
 *
 * You can specify a role for your task with the `taskRoleArn` parameter. When
 * you specify a role for a task, its containers can then use the latest versions of the
 * CLI or SDKs
 * to make API requests to the Amazon Web Services services that are specified in the policy
 * that's associated with the role. For more information, see IAM Roles for
 * Tasks in the Amazon Elastic Container Service Developer
 * Guide.
 *
 * You can specify a Docker networking mode for the containers in your task definition
 * with the `networkMode` parameter. If you specify the `awsvpc`
 * network mode, the task is allocated an elastic network interface, and you must specify a
 * NetworkConfiguration when you create a service or run a task with the task
 * definition. For more information, see Task Networking
 * in the *Amazon Elastic Container Service Developer Guide*.
 */
export const registerTaskDefinition = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: RegisterTaskDefinitionRequest,
    output: RegisterTaskDefinitionResponse,
    errors: [ClientException, InvalidParameterException, ServerException],
  }),
);
/**
 * Describes one or more service revisions.
 *
 * A service revision is a version of the service that includes the values for the Amazon
 * ECS resources (for example, task definition) and the environment resources (for example,
 * load balancers, subnets, and security groups). For more information, see Amazon ECS service revisions.
 *
 * You can't describe a service revision that was created before October 25, 2024.
 */
export const describeServiceRevisions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeServiceRevisionsRequest,
    output: DescribeServiceRevisionsResponse,
    errors: [
      AccessDeniedException,
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      ServerException,
      ServiceNotFoundException,
      UnsupportedFeatureException,
    ],
  }),
);
/**
 * Starts a new task using the specified task definition.
 *
 * On March 21, 2024, a change was made to resolve the task definition revision
 * before authorization. When a task definition revision is not specified,
 * authorization will occur using the latest revision of a task definition.
 *
 * Amazon Elastic Inference (EI) is no longer available to customers.
 *
 * You can allow Amazon ECS to place tasks for you, or you can customize how Amazon ECS
 * places tasks using placement constraints and placement strategies. For more information,
 * see Scheduling Tasks in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * Alternatively, you can use `StartTask` to use your own scheduler or place
 * tasks manually on specific container instances.
 *
 * You can attach Amazon EBS volumes to Amazon ECS tasks by configuring the volume when
 * creating or updating a service. For more information, see Amazon EBS volumes in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * The Amazon ECS API follows an eventual consistency model. This is because of the
 * distributed nature of the system supporting the API. This means that the result of an
 * API command you run that affects your Amazon ECS resources might not be immediately
 * visible to all subsequent commands you run. Keep this in mind when you carry out an API
 * command that immediately follows a previous API command.
 *
 * To manage eventual consistency, you can do the following:
 *
 * - Confirm the state of the resource before you run a command to modify it. Run
 * the DescribeTasks command using an exponential backoff algorithm to ensure that
 * you allow enough time for the previous command to propagate through the system.
 * To do this, run the DescribeTasks command repeatedly, starting with a couple of
 * seconds of wait time and increasing gradually up to five minutes of wait
 * time.
 *
 * - Add wait time between subsequent commands, even if the DescribeTasks command
 * returns an accurate response. Apply an exponential backoff algorithm starting
 * with a couple of seconds of wait time, and increase gradually up to about five
 * minutes of wait time.
 *
 * If you get a `ConflictException` error, the `RunTask` request
 * could not be processed due to conflicts. The provided `clientToken` is
 * already in use with a different `RunTask` request. The
 * `resourceIds` are the existing task ARNs which are already associated
 * with the `clientToken`.
 *
 * To fix this issue:
 *
 * - Run `RunTask` with a unique `clientToken`.
 *
 * - Run `RunTask` with the `clientToken` and the original
 * set of parameters
 *
 * If you get a `ClientException`error, the `RunTask` could not be
 * processed because you use managed scaling and there is a capacity error because the
 * quota of tasks in the `PROVISIONING` per cluster has been reached. For
 * information about the service quotas, see Amazon ECS service
 * quotas.
 */
export const runTask = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RunTaskRequest,
  output: RunTaskResponse,
  errors: [
    AccessDeniedException,
    BlockedException,
    ClientException,
    ClusterNotFoundException,
    ConflictException,
    InvalidParameterException,
    PlatformTaskDefinitionIncompatibilityException,
    PlatformUnknownException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Creates a capacity provider. Capacity providers are associated with a cluster and are
 * used in capacity provider strategies to facilitate cluster auto scaling. You can create
 * capacity providers for Amazon ECS Managed Instances and EC2 instances. Fargate has the
 * predefined `FARGATE` and `FARGATE_SPOT` capacity providers.
 */
export const createCapacityProvider = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCapacityProviderRequest,
    output: CreateCapacityProviderResponse,
    errors: [
      ClientException,
      ClusterNotFoundException,
      InvalidParameterException,
      LimitExceededException,
      ServerException,
      UnsupportedFeatureException,
      UpdateInProgressException,
    ],
  }),
);
/**
 * Runs and maintains your desired number of tasks from a specified task definition. If
 * the number of tasks running in a service drops below the `desiredCount`,
 * Amazon ECS runs another copy of the task in the specified cluster. To update an existing
 * service, use UpdateService.
 *
 * On March 21, 2024, a change was made to resolve the task definition revision
 * before authorization. When a task definition revision is not specified,
 * authorization will occur using the latest revision of a task definition.
 *
 * Amazon Elastic Inference (EI) is no longer available to customers.
 *
 * In addition to maintaining the desired count of tasks in your service, you can
 * optionally run your service behind one or more load balancers. The load balancers
 * distribute traffic across the tasks that are associated with the service. For more
 * information, see Service load balancing in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * You can attach Amazon EBS volumes to Amazon ECS tasks by configuring the volume when
 * creating or updating a service. `volumeConfigurations` is only supported for
 * REPLICA service and not DAEMON service. For more information, see Amazon EBS volumes in the Amazon Elastic
 * Container Service Developer Guide.
 *
 * Tasks for services that don't use a load balancer are considered healthy if they're in
 * the `RUNNING` state. Tasks for services that use a load balancer are
 * considered healthy if they're in the `RUNNING` state and are reported as
 * healthy by the load balancer.
 *
 * There are two service scheduler strategies available:
 *
 * - `REPLICA` - The replica scheduling strategy places and maintains
 * your desired number of tasks across your cluster. By default, the service
 * scheduler spreads tasks across Availability Zones. You can use task placement
 * strategies and constraints to customize task placement decisions. For more
 * information, see Service scheduler concepts in the
 * Amazon Elastic Container Service Developer
 * Guide.
 *
 * - `DAEMON` - The daemon scheduling strategy deploys exactly one task
 * on each active container instance that meets all of the task placement
 * constraints that you specify in your cluster. The service scheduler also
 * evaluates the task placement constraints for running tasks. It also stops tasks
 * that don't meet the placement constraints. When using this strategy, you don't
 * need to specify a desired number of tasks, a task placement strategy, or use
 * Service Auto Scaling policies. For more information, see Amazon ECS services in the Amazon Elastic Container
 * Service Developer Guide.
 *
 * The deployment controller is the mechanism that determines how tasks are deployed for
 * your service. The valid options are:
 *
 * - ECS
 *
 * When you create a service which uses the `ECS` deployment
 * controller, you can choose between the following deployment strategies (which
 * you can set in the “`strategy`” field in
 * “`deploymentConfiguration`”): :
 *
 * - `ROLLING`: When you create a service which uses the
 * *rolling update* (`ROLLING`)
 * deployment strategy, the Amazon ECS service scheduler replaces the
 * currently running tasks with new tasks. The number of tasks that Amazon
 * ECS adds or removes from the service during a rolling update is
 * controlled by the service deployment configuration. For more
 * information, see Deploy Amazon ECS services by replacing
 * tasks in the Amazon Elastic Container Service
 * Developer Guide.
 *
 * Rolling update deployments are best suited for the following
 * scenarios:
 *
 * - Gradual service updates: You need to update your service
 * incrementally without taking the entire service offline at
 * once.
 *
 * - Limited resource requirements: You want to avoid the
 * additional resource costs of running two complete environments
 * simultaneously (as required by blue/green deployments).
 *
 * - Acceptable deployment time: Your application can tolerate a
 * longer deployment process, as rolling updates replace tasks one
 * by one.
 *
 * - No need for instant roll back: Your service can tolerate a
 * rollback process that takes minutes rather than seconds.
 *
 * - Simple deployment process: You prefer a straightforward
 * deployment approach without the complexity of managing multiple
 * environments, target groups, and listeners.
 *
 * - No load balancer requirement: Your service doesn't use or
 * require a load balancer, Application Load Balancer, Network Load
 * Balancer, or Service Connect (which are required for blue/green
 * deployments).
 *
 * - Stateful applications: Your application maintains state that
 * makes it difficult to run two parallel environments.
 *
 * - Cost sensitivity: You want to minimize deployment costs by not
 * running duplicate environments during deployment.
 *
 * Rolling updates are the default deployment strategy for services and
 * provide a balance between deployment safety and resource efficiency for
 * many common application scenarios.
 *
 * - `BLUE_GREEN`: A *blue/green* deployment
 * strategy (`BLUE_GREEN`) is a release methodology that reduces
 * downtime and risk by running two identical production environments
 * called blue and green. With Amazon ECS blue/green deployments, you can
 * validate new service revisions before directing production traffic to
 * them. This approach provides a safer way to deploy changes with the
 * ability to quickly roll back if needed. For more information, see Amazon ECS blue/green deployments in
 * the Amazon Elastic Container Service Developer
 * Guide.
 *
 * Amazon ECS blue/green deployments are best suited for the following
 * scenarios:
 *
 * - Service validation: When you need to validate new service
 * revisions before directing production traffic to them
 *
 * - Zero downtime: When your service requires zero-downtime
 * deployments
 *
 * - Instant roll back: When you need the ability to quickly roll
 * back if issues are detected
 *
 * - Load balancer requirement: When your service uses Application
 * Load Balancer, Network Load Balancer, or Service Connect
 *
 * - `LINEAR`: A *linear* deployment strategy
 * (`LINEAR`) gradually shifts traffic from the current
 * production environment to a new environment in equal percentage
 * increments. With Amazon ECS linear deployments, you can control the pace
 * of traffic shifting and validate new service revisions with increasing
 * amounts of production traffic.
 *
 * Linear deployments are best suited for the following scenarios:
 *
 * - Gradual validation: When you want to gradually validate your
 * new service version with increasing traffic
 *
 * - Performance monitoring: When you need time to monitor metrics
 * and performance during the deployment
 *
 * - Risk minimization: When you want to minimize risk by exposing
 * the new version to production traffic incrementally
 *
 * - Load balancer requirement: When your service uses Application
 * Load Balancer or Service Connect
 *
 * - `CANARY`: A *canary* deployment strategy
 * (`CANARY`) shifts a small percentage of traffic to the
 * new service revision first, then shifts the remaining traffic all at
 * once after a specified time period. This allows you to test the new
 * version with a subset of users before full deployment.
 *
 * Canary deployments are best suited for the following scenarios:
 *
 * - Feature testing: When you want to test new features with a
 * small subset of users before full rollout
 *
 * - Production validation: When you need to validate performance
 * and functionality with real production traffic
 *
 * - Blast radius control: When you want to minimize blast radius
 * if issues are discovered in the new version
 *
 * - Load balancer requirement: When your service uses Application
 * Load Balancer or Service Connect
 *
 * - External
 *
 * Use a third-party deployment controller.
 *
 * - Blue/green deployment (powered by CodeDeploy)
 *
 * CodeDeploy installs an updated version of the application as a new
 * replacement task set and reroutes production traffic from the original
 * application task set to the replacement task set. The original task set is
 * terminated after a successful deployment. Use this deployment controller to
 * verify a new deployment of a service before sending production traffic to
 * it.
 *
 * When creating a service that uses the `EXTERNAL` deployment controller, you
 * can specify only parameters that aren't controlled at the task set level. The only
 * required parameter is the service name. You control your services using the CreateTaskSet. For more information, see Amazon ECS deployment types in the Amazon Elastic Container
 * Service Developer Guide.
 *
 * When the service scheduler launches new tasks, it determines task placement. For
 * information about task placement and task placement strategies, see Amazon ECS task placement in the Amazon Elastic Container Service
 * Developer Guide
 */
export const createService = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServiceRequest,
  output: CreateServiceResponse,
  errors: [
    AccessDeniedException,
    ClientException,
    ClusterNotFoundException,
    InvalidParameterException,
    NamespaceNotFoundException,
    PlatformTaskDefinitionIncompatibilityException,
    PlatformUnknownException,
    ServerException,
    UnsupportedFeatureException,
  ],
}));
/**
 * Deletes the specified cluster. The cluster transitions to the `INACTIVE`
 * state. Clusters with an `INACTIVE` status might remain discoverable in your
 * account for a period of time. However, this behavior is subject to change in the future.
 * We don't recommend that you rely on `INACTIVE` clusters persisting.
 *
 * You must deregister all container instances from this cluster before you may delete
 * it. You can list the container instances in a cluster with ListContainerInstances and deregister them with DeregisterContainerInstance.
 */
export const deleteCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [
    ClientException,
    ClusterContainsCapacityProviderException,
    ClusterContainsContainerInstancesException,
    ClusterContainsServicesException,
    ClusterContainsTasksException,
    ClusterNotFoundException,
    InvalidParameterException,
    ServerException,
    UpdateInProgressException,
  ],
}));
