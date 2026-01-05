import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
import { ERROR_CATEGORIES, withCategory } from "../error-category.ts";
const svc = T.AwsApiService({
  sdkId: "PCS",
  serviceShapeName: "AWSParallelComputingService",
});
const auth = T.AwsAuthSigv4({ name: "pcs" });
const ver = T.ServiceVersion("2023-02-10");
const proto = T.AwsProtocolsAwsJson1_0();
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
          conditions: [],
          rules: [
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
              endpoint: {
                url: { ref: "Endpoint" },
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
      rules: [
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
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                                "supportsFIPS",
                              ],
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://pcs-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                              argv: [
                                { ref: "PartitionResult" },
                                "supportsFIPS",
                              ],
                            },
                            true,
                          ],
                        },
                      ],
                      rules: [
                        {
                          conditions: [],
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://pcs-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                      error:
                        "FIPS is enabled but this partition does not support FIPS",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [
                    {
                      fn: "booleanEquals",
                      argv: [{ ref: "UseDualStack" }, true],
                    },
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
                          rules: [
                            {
                              conditions: [],
                              endpoint: {
                                url: "https://pcs.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      error:
                        "DualStack is enabled but this partition does not support DualStack",
                      type: "error",
                    },
                  ],
                  type: "tree",
                },
                {
                  conditions: [],
                  rules: [
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://pcs.{Region}.{PartitionResult#dnsSuffix}",
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
          ],
          type: "tree",
        },
        {
          conditions: [],
          error: "Invalid Configuration: Missing Region",
          type: "error",
        },
      ],
      type: "tree",
    },
  ],
});

//# Schemas
export const TagKeys = S.Array(S.String);
export const StringList = S.Array(S.String);
export class ListTagsForResourceRequest extends S.Class<ListTagsForResourceRequest>(
  "ListTagsForResourceRequest",
)(
  { resourceArn: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceRequest extends S.Class<UntagResourceRequest>(
  "UntagResourceRequest",
)(
  { resourceArn: S.String.pipe(T.HttpLabel("resourceArn")), tagKeys: TagKeys },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UntagResourceResponse extends S.Class<UntagResourceResponse>(
  "UntagResourceResponse",
)({}) {}
export class DeleteClusterRequest extends S.Class<DeleteClusterRequest>(
  "DeleteClusterRequest",
)(
  { clusterIdentifier: S.String, clientToken: S.optional(S.String) },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteClusterResponse extends S.Class<DeleteClusterResponse>(
  "DeleteClusterResponse",
)({}) {}
export class GetClusterRequest extends S.Class<GetClusterRequest>(
  "GetClusterRequest",
)(
  { clusterIdentifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterComputeNodeGroupInstanceRequest extends S.Class<RegisterComputeNodeGroupInstanceRequest>(
  "RegisterComputeNodeGroupInstanceRequest",
)(
  { clusterIdentifier: S.String, bootstrapId: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListClustersRequest extends S.Class<ListClustersRequest>(
  "ListClustersRequest",
)(
  {
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteComputeNodeGroupRequest extends S.Class<DeleteComputeNodeGroupRequest>(
  "DeleteComputeNodeGroupRequest",
)(
  {
    clusterIdentifier: S.String,
    computeNodeGroupIdentifier: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteComputeNodeGroupResponse extends S.Class<DeleteComputeNodeGroupResponse>(
  "DeleteComputeNodeGroupResponse",
)({}) {}
export class GetComputeNodeGroupRequest extends S.Class<GetComputeNodeGroupRequest>(
  "GetComputeNodeGroupRequest",
)(
  { clusterIdentifier: S.String, computeNodeGroupIdentifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListComputeNodeGroupsRequest extends S.Class<ListComputeNodeGroupsRequest>(
  "ListComputeNodeGroupsRequest",
)(
  {
    clusterIdentifier: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteQueueRequest extends S.Class<DeleteQueueRequest>(
  "DeleteQueueRequest",
)(
  {
    clusterIdentifier: S.String,
    queueIdentifier: S.String,
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteQueueResponse extends S.Class<DeleteQueueResponse>(
  "DeleteQueueResponse",
)({}) {}
export class GetQueueRequest extends S.Class<GetQueueRequest>(
  "GetQueueRequest",
)(
  { clusterIdentifier: S.String, queueIdentifier: S.String },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListQueuesRequest extends S.Class<ListQueuesRequest>(
  "ListQueuesRequest",
)(
  {
    clusterIdentifier: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const SubnetIdList = S.Array(S.String);
export const SecurityGroupIdList = S.Array(S.String);
export const RequestTagMap = S.Record({ key: S.String, value: S.String });
export class SchedulerRequest extends S.Class<SchedulerRequest>(
  "SchedulerRequest",
)({ type: S.String, version: S.String }) {}
export class NetworkingRequest extends S.Class<NetworkingRequest>(
  "NetworkingRequest",
)({
  subnetIds: S.optional(SubnetIdList),
  securityGroupIds: S.optional(SecurityGroupIdList),
  networkType: S.optional(S.String),
}) {}
export class CustomLaunchTemplate extends S.Class<CustomLaunchTemplate>(
  "CustomLaunchTemplate",
)({ id: S.String, version: S.String }) {}
export class ScalingConfigurationRequest extends S.Class<ScalingConfigurationRequest>(
  "ScalingConfigurationRequest",
)({ minInstanceCount: S.Number, maxInstanceCount: S.Number }) {}
export class InstanceConfig extends S.Class<InstanceConfig>("InstanceConfig")({
  instanceType: S.optional(S.String),
}) {}
export const InstanceList = S.Array(InstanceConfig);
export class SpotOptions extends S.Class<SpotOptions>("SpotOptions")({
  allocationStrategy: S.optional(S.String),
}) {}
export class SlurmCustomSetting extends S.Class<SlurmCustomSetting>(
  "SlurmCustomSetting",
)({ parameterName: S.String, parameterValue: S.String }) {}
export const SlurmCustomSettings = S.Array(SlurmCustomSetting);
export class ComputeNodeGroupSlurmConfigurationRequest extends S.Class<ComputeNodeGroupSlurmConfigurationRequest>(
  "ComputeNodeGroupSlurmConfigurationRequest",
)({ slurmCustomSettings: S.optional(SlurmCustomSettings) }) {}
export class UpdateComputeNodeGroupSlurmConfigurationRequest extends S.Class<UpdateComputeNodeGroupSlurmConfigurationRequest>(
  "UpdateComputeNodeGroupSlurmConfigurationRequest",
)({ slurmCustomSettings: S.optional(SlurmCustomSettings) }) {}
export class ComputeNodeGroupConfiguration extends S.Class<ComputeNodeGroupConfiguration>(
  "ComputeNodeGroupConfiguration",
)({ computeNodeGroupId: S.optional(S.String) }) {}
export const ComputeNodeGroupConfigurationList = S.Array(
  ComputeNodeGroupConfiguration,
);
export class QueueSlurmConfigurationRequest extends S.Class<QueueSlurmConfigurationRequest>(
  "QueueSlurmConfigurationRequest",
)({ slurmCustomSettings: S.optional(SlurmCustomSettings) }) {}
export class UpdateQueueSlurmConfigurationRequest extends S.Class<UpdateQueueSlurmConfigurationRequest>(
  "UpdateQueueSlurmConfigurationRequest",
)({ slurmCustomSettings: S.optional(SlurmCustomSettings) }) {}
export class TagResourceRequest extends S.Class<TagResourceRequest>(
  "TagResourceRequest",
)(
  { resourceArn: S.String, tags: RequestTagMap },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TagResourceResponse extends S.Class<TagResourceResponse>(
  "TagResourceResponse",
)({}) {}
export class CreateComputeNodeGroupRequest extends S.Class<CreateComputeNodeGroupRequest>(
  "CreateComputeNodeGroupRequest",
)(
  {
    clusterIdentifier: S.String,
    computeNodeGroupName: S.String,
    amiId: S.optional(S.String),
    subnetIds: StringList,
    purchaseOption: S.optional(S.String),
    customLaunchTemplate: CustomLaunchTemplate,
    iamInstanceProfileArn: S.String,
    scalingConfiguration: ScalingConfigurationRequest,
    instanceConfigs: InstanceList,
    spotOptions: S.optional(SpotOptions),
    slurmConfiguration: S.optional(ComputeNodeGroupSlurmConfigurationRequest),
    clientToken: S.optional(S.String),
    tags: S.optional(RequestTagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateComputeNodeGroupRequest extends S.Class<UpdateComputeNodeGroupRequest>(
  "UpdateComputeNodeGroupRequest",
)(
  {
    clusterIdentifier: S.String,
    computeNodeGroupIdentifier: S.String,
    amiId: S.optional(S.String),
    subnetIds: S.optional(StringList),
    customLaunchTemplate: S.optional(CustomLaunchTemplate),
    purchaseOption: S.optional(S.String),
    spotOptions: S.optional(SpotOptions),
    scalingConfiguration: S.optional(ScalingConfigurationRequest),
    iamInstanceProfileArn: S.optional(S.String),
    slurmConfiguration: S.optional(
      UpdateComputeNodeGroupSlurmConfigurationRequest,
    ),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateQueueRequest extends S.Class<CreateQueueRequest>(
  "CreateQueueRequest",
)(
  {
    clusterIdentifier: S.String,
    queueName: S.String,
    computeNodeGroupConfigurations: S.optional(
      ComputeNodeGroupConfigurationList,
    ),
    slurmConfiguration: S.optional(QueueSlurmConfigurationRequest),
    clientToken: S.optional(S.String),
    tags: S.optional(RequestTagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateQueueRequest extends S.Class<UpdateQueueRequest>(
  "UpdateQueueRequest",
)(
  {
    clusterIdentifier: S.String,
    queueIdentifier: S.String,
    computeNodeGroupConfigurations: S.optional(
      ComputeNodeGroupConfigurationList,
    ),
    slurmConfiguration: S.optional(UpdateQueueSlurmConfigurationRequest),
    clientToken: S.optional(S.String),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AccountingRequest extends S.Class<AccountingRequest>(
  "AccountingRequest",
)({ defaultPurgeTimeInDays: S.optional(S.Number), mode: S.String }) {}
export class SlurmRestRequest extends S.Class<SlurmRestRequest>(
  "SlurmRestRequest",
)({ mode: S.String }) {}
export class UpdateAccountingRequest extends S.Class<UpdateAccountingRequest>(
  "UpdateAccountingRequest",
)({
  defaultPurgeTimeInDays: S.optional(S.Number),
  mode: S.optional(S.String),
}) {}
export class UpdateSlurmRestRequest extends S.Class<UpdateSlurmRestRequest>(
  "UpdateSlurmRestRequest",
)({ mode: S.optional(S.String) }) {}
export const ResponseTagMap = S.Record({ key: S.String, value: S.String });
export class ClusterSlurmConfigurationRequest extends S.Class<ClusterSlurmConfigurationRequest>(
  "ClusterSlurmConfigurationRequest",
)({
  scaleDownIdleTimeInSeconds: S.optional(S.Number),
  slurmCustomSettings: S.optional(SlurmCustomSettings),
  accounting: S.optional(AccountingRequest),
  slurmRest: S.optional(SlurmRestRequest),
}) {}
export class UpdateClusterSlurmConfigurationRequest extends S.Class<UpdateClusterSlurmConfigurationRequest>(
  "UpdateClusterSlurmConfigurationRequest",
)({
  scaleDownIdleTimeInSeconds: S.optional(S.Number),
  slurmCustomSettings: S.optional(SlurmCustomSettings),
  accounting: S.optional(UpdateAccountingRequest),
  slurmRest: S.optional(UpdateSlurmRestRequest),
}) {}
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  type: S.String,
  privateIpAddress: S.String,
  publicIpAddress: S.optional(S.String),
  ipv6Address: S.optional(S.String),
  port: S.String,
}) {}
export const Endpoints = S.Array(Endpoint);
export class ClusterSummary extends S.Class<ClusterSummary>("ClusterSummary")({
  name: S.String,
  id: S.String,
  arn: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export const ClusterList = S.Array(ClusterSummary);
export class ComputeNodeGroupSummary extends S.Class<ComputeNodeGroupSummary>(
  "ComputeNodeGroupSummary",
)({
  name: S.String,
  id: S.String,
  arn: S.String,
  clusterId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export const ComputeNodeGroupList = S.Array(ComputeNodeGroupSummary);
export class QueueSummary extends S.Class<QueueSummary>("QueueSummary")({
  name: S.String,
  id: S.String,
  arn: S.String,
  clusterId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
}) {}
export const QueueList = S.Array(QueueSummary);
export class ListTagsForResourceResponse extends S.Class<ListTagsForResourceResponse>(
  "ListTagsForResourceResponse",
)({ tags: S.optional(ResponseTagMap) }) {}
export class CreateClusterRequest extends S.Class<CreateClusterRequest>(
  "CreateClusterRequest",
)(
  {
    clusterName: S.String,
    scheduler: SchedulerRequest,
    size: S.String,
    networking: NetworkingRequest,
    slurmConfiguration: S.optional(ClusterSlurmConfigurationRequest),
    clientToken: S.optional(S.String),
    tags: S.optional(RequestTagMap),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class UpdateClusterRequest extends S.Class<UpdateClusterRequest>(
  "UpdateClusterRequest",
)(
  {
    clusterIdentifier: S.String,
    clientToken: S.optional(S.String),
    slurmConfiguration: S.optional(UpdateClusterSlurmConfigurationRequest),
  },
  T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RegisterComputeNodeGroupInstanceResponse extends S.Class<RegisterComputeNodeGroupInstanceResponse>(
  "RegisterComputeNodeGroupInstanceResponse",
)({ nodeID: S.String, sharedSecret: S.String, endpoints: Endpoints }) {}
export class ListClustersResponse extends S.Class<ListClustersResponse>(
  "ListClustersResponse",
)({ clusters: ClusterList, nextToken: S.optional(S.String) }) {}
export class ScalingConfiguration extends S.Class<ScalingConfiguration>(
  "ScalingConfiguration",
)({ minInstanceCount: S.Number, maxInstanceCount: S.Number }) {}
export class ComputeNodeGroupSlurmConfiguration extends S.Class<ComputeNodeGroupSlurmConfiguration>(
  "ComputeNodeGroupSlurmConfiguration",
)({ slurmCustomSettings: S.optional(SlurmCustomSettings) }) {}
export class ErrorInfo extends S.Class<ErrorInfo>("ErrorInfo")({
  code: S.optional(S.String),
  message: S.optional(S.String),
}) {}
export const ErrorInfoList = S.Array(ErrorInfo);
export class ComputeNodeGroup extends S.Class<ComputeNodeGroup>(
  "ComputeNodeGroup",
)({
  name: S.String,
  id: S.String,
  arn: S.String,
  clusterId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  amiId: S.optional(S.String),
  subnetIds: SubnetIdList,
  purchaseOption: S.optional(S.String),
  customLaunchTemplate: CustomLaunchTemplate,
  iamInstanceProfileArn: S.String,
  scalingConfiguration: ScalingConfiguration,
  instanceConfigs: InstanceList,
  spotOptions: S.optional(SpotOptions),
  slurmConfiguration: S.optional(ComputeNodeGroupSlurmConfiguration),
  errorInfo: S.optional(ErrorInfoList),
}) {}
export class CreateComputeNodeGroupResponse extends S.Class<CreateComputeNodeGroupResponse>(
  "CreateComputeNodeGroupResponse",
)({ computeNodeGroup: S.optional(ComputeNodeGroup) }) {}
export class UpdateComputeNodeGroupResponse extends S.Class<UpdateComputeNodeGroupResponse>(
  "UpdateComputeNodeGroupResponse",
)({ computeNodeGroup: S.optional(ComputeNodeGroup) }) {}
export class ListComputeNodeGroupsResponse extends S.Class<ListComputeNodeGroupsResponse>(
  "ListComputeNodeGroupsResponse",
)({
  computeNodeGroups: ComputeNodeGroupList,
  nextToken: S.optional(S.String),
}) {}
export class QueueSlurmConfiguration extends S.Class<QueueSlurmConfiguration>(
  "QueueSlurmConfiguration",
)({ slurmCustomSettings: S.optional(SlurmCustomSettings) }) {}
export class Queue extends S.Class<Queue>("Queue")({
  name: S.String,
  id: S.String,
  arn: S.String,
  clusterId: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  status: S.String,
  computeNodeGroupConfigurations: ComputeNodeGroupConfigurationList,
  slurmConfiguration: S.optional(QueueSlurmConfiguration),
  errorInfo: S.optional(ErrorInfoList),
}) {}
export class CreateQueueResponse extends S.Class<CreateQueueResponse>(
  "CreateQueueResponse",
)({ queue: S.optional(Queue) }) {}
export class UpdateQueueResponse extends S.Class<UpdateQueueResponse>(
  "UpdateQueueResponse",
)({ queue: S.optional(Queue) }) {}
export class ListQueuesResponse extends S.Class<ListQueuesResponse>(
  "ListQueuesResponse",
)({ queues: QueueList, nextToken: S.optional(S.String) }) {}
export class Scheduler extends S.Class<Scheduler>("Scheduler")({
  type: S.String,
  version: S.String,
}) {}
export class Networking extends S.Class<Networking>("Networking")({
  subnetIds: S.optional(SubnetIdList),
  securityGroupIds: S.optional(SecurityGroupIdList),
  networkType: S.optional(S.String),
}) {}
export class SlurmAuthKey extends S.Class<SlurmAuthKey>("SlurmAuthKey")({
  secretArn: S.String,
  secretVersion: S.String,
}) {}
export class Accounting extends S.Class<Accounting>("Accounting")({
  defaultPurgeTimeInDays: S.optional(S.Number),
  mode: S.String,
}) {}
export class SlurmRest extends S.Class<SlurmRest>("SlurmRest")({
  mode: S.String,
}) {}
export class JwtKey extends S.Class<JwtKey>("JwtKey")({
  secretArn: S.String,
  secretVersion: S.String,
}) {}
export class JwtAuth extends S.Class<JwtAuth>("JwtAuth")({
  jwtKey: S.optional(JwtKey),
}) {}
export class ClusterSlurmConfiguration extends S.Class<ClusterSlurmConfiguration>(
  "ClusterSlurmConfiguration",
)({
  scaleDownIdleTimeInSeconds: S.optional(S.Number),
  slurmCustomSettings: S.optional(SlurmCustomSettings),
  authKey: S.optional(SlurmAuthKey),
  jwtAuth: S.optional(JwtAuth),
  accounting: S.optional(Accounting),
  slurmRest: S.optional(SlurmRest),
}) {}
export class Cluster extends S.Class<Cluster>("Cluster")({
  name: S.String,
  id: S.String,
  arn: S.String,
  status: S.String,
  createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
  modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
  scheduler: Scheduler,
  size: S.String,
  slurmConfiguration: S.optional(ClusterSlurmConfiguration),
  networking: Networking,
  endpoints: S.optional(Endpoints),
  errorInfo: S.optional(ErrorInfoList),
}) {}
export class CreateClusterResponse extends S.Class<CreateClusterResponse>(
  "CreateClusterResponse",
)({ cluster: S.optional(Cluster) }) {}
export class UpdateClusterResponse extends S.Class<UpdateClusterResponse>(
  "UpdateClusterResponse",
)({ cluster: S.optional(Cluster) }) {}
export class GetComputeNodeGroupResponse extends S.Class<GetComputeNodeGroupResponse>(
  "GetComputeNodeGroupResponse",
)({ computeNodeGroup: S.optional(ComputeNodeGroup) }) {}
export class GetQueueResponse extends S.Class<GetQueueResponse>(
  "GetQueueResponse",
)({ queue: S.optional(Queue) }) {}
export class GetClusterResponse extends S.Class<GetClusterResponse>(
  "GetClusterResponse",
)({ cluster: S.optional(Cluster) }) {}
export class ValidationExceptionField extends S.Class<ValidationExceptionField>(
  "ValidationExceptionField",
)({ name: S.String, message: S.String }) {}
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    serviceCode: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.SERVER_ERROR)) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(withCategory(ERROR_CATEGORIES.THROTTLING_ERROR)) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
) {}

//# Operations
/**
 * Deletes tags from an PCS resource. To delete a tag, specify the tag key and the Amazon Resource Name (ARN) of the PCS resource.
 */
export const untagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Returns a list of all tags on an PCS resource.
 */
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Adds or edits tags on an PCS resource. Each tag consists of a tag key and a tag value. The tag key and tag value are case-sensitive strings. The tag value can be an empty (null) string. To add a tag, specify a new tag key and a tag value. To edit a tag, specify an existing tag key and a new tag value.
 */
export const tagResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ServiceQuotaExceededException],
}));
/**
 * This API action isn't intended for you to use.
 *
 * PCS uses this API action to register the compute nodes it launches in your account.
 */
export const registerComputeNodeGroupInstance =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RegisterComputeNodeGroupInstanceRequest,
    output: RegisterComputeNodeGroupInstanceResponse,
    errors: [AccessDeniedException, InternalServerException],
  }));
/**
 * Deletes a cluster and all its linked resources. You must delete all queues and compute node groups associated with the cluster before you can delete the cluster.
 */
export const deleteCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteClusterRequest,
  output: DeleteClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns detailed information about a compute node group. This API action provides networking information, EC2 instance type, compute node group status, and scheduler (such as Slurm) configuration.
 */
export const getComputeNodeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetComputeNodeGroupRequest,
  output: GetComputeNodeGroupResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns detailed information about a queue. The information includes the compute node groups that the queue uses to schedule jobs.
 */
export const getQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetQueueRequest,
  output: GetQueueResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of running clusters in your account.
 */
export const listClusters = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(
  () => ({
    input: ListClustersRequest,
    output: ListClustersResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "clusters",
      pageSize: "maxResults",
    } as const,
  }),
);
/**
 * Creates a managed set of compute nodes. You associate a compute node group with a cluster through 1 or more PCS queues or as part of the login fleet. A compute node group includes the definition of the compute properties and lifecycle management. PCS uses the information you provide to this API action to launch compute nodes in your account. You can only specify subnets in the same Amazon VPC as your cluster. You receive billing charges for the compute nodes that PCS launches in your account. You must already have a launch template before you call this API. For more information, see Launch an instance from a launch template in the *Amazon Elastic Compute Cloud User Guide for Linux Instances*.
 */
export const createComputeNodeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateComputeNodeGroupRequest,
    output: CreateComputeNodeGroupResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Updates a compute node group. You can update many of the fields related to your compute node group including the configurations for networking, compute nodes, and settings specific to your scheduler (such as Slurm).
 */
export const updateComputeNodeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: UpdateComputeNodeGroupRequest,
    output: UpdateComputeNodeGroupResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ServiceQuotaExceededException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Returns a list of all compute node groups associated with a cluster.
 */
export const listComputeNodeGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
    input: ListComputeNodeGroupsRequest,
    output: ListComputeNodeGroupsResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
    pagination: {
      inputToken: "nextToken",
      outputToken: "nextToken",
      items: "computeNodeGroups",
      pageSize: "maxResults",
    } as const,
  }));
/**
 * Creates a job queue. You must associate 1 or more compute node groups with the queue. You can associate 1 compute node group with multiple queues.
 */
export const createQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateQueueRequest,
  output: CreateQueueResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates the compute node group configuration of a queue. Use this API to change the compute node groups that the queue can send jobs to.
 */
export const updateQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateQueueRequest,
  output: UpdateQueueResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns a list of all queues associated with a cluster.
 */
export const listQueues = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: ListQueuesRequest,
  output: ListQueuesResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
  pagination: {
    inputToken: "nextToken",
    outputToken: "nextToken",
    items: "queues",
    pageSize: "maxResults",
  } as const,
}));
/**
 * Deletes a compute node group. You must delete all queues associated with the compute node group first.
 */
export const deleteComputeNodeGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteComputeNodeGroupRequest,
    output: DeleteComputeNodeGroupResponse,
    errors: [
      AccessDeniedException,
      ConflictException,
      InternalServerException,
      ResourceNotFoundException,
      ThrottlingException,
      ValidationException,
    ],
  }),
);
/**
 * Deletes a job queue. If the compute node group associated with this queue isn't associated with any other queues, PCS terminates all the compute nodes for this queue.
 */
export const deleteQueue = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteQueueRequest,
  output: DeleteQueueResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Creates a cluster in your account. PCS creates the cluster controller in a service-owned account. The cluster controller communicates with the cluster resources in your account. The subnets and security groups for the cluster must already exist before you use this API action.
 *
 * It takes time for PCS to create the cluster. The cluster is in a `Creating` state until it is ready to use. There can only be 1 cluster in a `Creating` state per Amazon Web Services Region per Amazon Web Services account. `CreateCluster` fails with a `ServiceQuotaExceededException` if there is already a cluster in a `Creating` state.
 */
export const createCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateClusterRequest,
  output: CreateClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ServiceQuotaExceededException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Updates a cluster configuration. You can modify Slurm scheduler settings, accounting configuration, and security groups for an existing cluster.
 *
 * You can only update clusters that are in `ACTIVE`, `UPDATE_FAILED`, or `SUSPENDED` state. All associated resources (queues and compute node groups) must be in `ACTIVE` state before you can update the cluster.
 */
export const updateCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UpdateClusterRequest,
  output: UpdateClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
/**
 * Returns detailed information about a running cluster in your account. This API action provides networking information, endpoint information for communication with the scheduler, and provisioning status.
 */
export const getCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: GetClusterRequest,
  output: GetClusterResponse,
  errors: [
    AccessDeniedException,
    ConflictException,
    InternalServerException,
    ResourceNotFoundException,
    ThrottlingException,
    ValidationException,
  ],
}));
