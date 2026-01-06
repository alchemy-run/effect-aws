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

//# Newtypes
export type Arn = string;
export type TagKey = string;
export type ClusterName = string;
export type SBClientToken = string;
export type ClusterIdentifier = string;
export type BootstrapId = string;
export type MaxResults = number;
export type ComputeNodeGroupName = string;
export type AmiId = string;
export type InstanceProfileArn = string;
export type ComputeNodeGroupIdentifier = string;
export type QueueName = string;
export type QueueIdentifier = string;
export type TagValue = string;
export type SubnetId = string;
export type SecurityGroupId = string;
export type SharedSecret = string | Redacted.Redacted<string>;

//# Schemas
export type TagKeys = string[];
export const TagKeys = S.Array(S.String);
export type StringList = string[];
export const StringList = S.Array(S.String);
export interface ListTagsForResourceRequest {
  resourceArn: string;
}
export const ListTagsForResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListTagsForResourceRequest",
}) as any as S.Schema<ListTagsForResourceRequest>;
export interface UntagResourceRequest {
  resourceArn: string;
  tagKeys: TagKeys;
}
export const UntagResourceRequest = S.suspend(() =>
  S.Struct({
    resourceArn: S.String.pipe(T.HttpLabel("resourceArn")),
    tagKeys: TagKeys,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UntagResourceRequest",
}) as any as S.Schema<UntagResourceRequest>;
export interface UntagResourceResponse {}
export const UntagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "UntagResourceResponse",
}) as any as S.Schema<UntagResourceResponse>;
export interface DeleteClusterRequest {
  clusterIdentifier: string;
  clientToken?: string;
}
export const DeleteClusterRequest = S.suspend(() =>
  S.Struct({
    clusterIdentifier: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteClusterRequest",
}) as any as S.Schema<DeleteClusterRequest>;
export interface DeleteClusterResponse {}
export const DeleteClusterResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteClusterResponse",
}) as any as S.Schema<DeleteClusterResponse>;
export interface GetClusterRequest {
  clusterIdentifier: string;
}
export const GetClusterRequest = S.suspend(() =>
  S.Struct({ clusterIdentifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetClusterRequest",
}) as any as S.Schema<GetClusterRequest>;
export interface RegisterComputeNodeGroupInstanceRequest {
  clusterIdentifier: string;
  bootstrapId: string;
}
export const RegisterComputeNodeGroupInstanceRequest = S.suspend(() =>
  S.Struct({ clusterIdentifier: S.String, bootstrapId: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "RegisterComputeNodeGroupInstanceRequest",
}) as any as S.Schema<RegisterComputeNodeGroupInstanceRequest>;
export interface ListClustersRequest {
  nextToken?: string;
  maxResults?: number;
}
export const ListClustersRequest = S.suspend(() =>
  S.Struct({
    nextToken: S.optional(S.String).pipe(T.HttpQuery("nextToken")),
    maxResults: S.optional(S.Number).pipe(T.HttpQuery("maxResults")),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListClustersRequest",
}) as any as S.Schema<ListClustersRequest>;
export interface DeleteComputeNodeGroupRequest {
  clusterIdentifier: string;
  computeNodeGroupIdentifier: string;
  clientToken?: string;
}
export const DeleteComputeNodeGroupRequest = S.suspend(() =>
  S.Struct({
    clusterIdentifier: S.String,
    computeNodeGroupIdentifier: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteComputeNodeGroupRequest",
}) as any as S.Schema<DeleteComputeNodeGroupRequest>;
export interface DeleteComputeNodeGroupResponse {}
export const DeleteComputeNodeGroupResponse = S.suspend(() =>
  S.Struct({}),
).annotations({
  identifier: "DeleteComputeNodeGroupResponse",
}) as any as S.Schema<DeleteComputeNodeGroupResponse>;
export interface GetComputeNodeGroupRequest {
  clusterIdentifier: string;
  computeNodeGroupIdentifier: string;
}
export const GetComputeNodeGroupRequest = S.suspend(() =>
  S.Struct({
    clusterIdentifier: S.String,
    computeNodeGroupIdentifier: S.String,
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetComputeNodeGroupRequest",
}) as any as S.Schema<GetComputeNodeGroupRequest>;
export interface ListComputeNodeGroupsRequest {
  clusterIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListComputeNodeGroupsRequest = S.suspend(() =>
  S.Struct({
    clusterIdentifier: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListComputeNodeGroupsRequest",
}) as any as S.Schema<ListComputeNodeGroupsRequest>;
export interface DeleteQueueRequest {
  clusterIdentifier: string;
  queueIdentifier: string;
  clientToken?: string;
}
export const DeleteQueueRequest = S.suspend(() =>
  S.Struct({
    clusterIdentifier: S.String,
    queueIdentifier: S.String,
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "DeleteQueueRequest",
}) as any as S.Schema<DeleteQueueRequest>;
export interface DeleteQueueResponse {}
export const DeleteQueueResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "DeleteQueueResponse",
}) as any as S.Schema<DeleteQueueResponse>;
export interface GetQueueRequest {
  clusterIdentifier: string;
  queueIdentifier: string;
}
export const GetQueueRequest = S.suspend(() =>
  S.Struct({ clusterIdentifier: S.String, queueIdentifier: S.String }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "GetQueueRequest",
}) as any as S.Schema<GetQueueRequest>;
export interface ListQueuesRequest {
  clusterIdentifier: string;
  nextToken?: string;
  maxResults?: number;
}
export const ListQueuesRequest = S.suspend(() =>
  S.Struct({
    clusterIdentifier: S.String,
    nextToken: S.optional(S.String),
    maxResults: S.optional(S.Number),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "ListQueuesRequest",
}) as any as S.Schema<ListQueuesRequest>;
export type SubnetIdList = string[];
export const SubnetIdList = S.Array(S.String);
export type SecurityGroupIdList = string[];
export const SecurityGroupIdList = S.Array(S.String);
export type RequestTagMap = { [key: string]: string };
export const RequestTagMap = S.Record({ key: S.String, value: S.String });
export interface SchedulerRequest {
  type: string;
  version: string;
}
export const SchedulerRequest = S.suspend(() =>
  S.Struct({ type: S.String, version: S.String }),
).annotations({
  identifier: "SchedulerRequest",
}) as any as S.Schema<SchedulerRequest>;
export interface NetworkingRequest {
  subnetIds?: SubnetIdList;
  securityGroupIds?: SecurityGroupIdList;
  networkType?: string;
}
export const NetworkingRequest = S.suspend(() =>
  S.Struct({
    subnetIds: S.optional(SubnetIdList),
    securityGroupIds: S.optional(SecurityGroupIdList),
    networkType: S.optional(S.String),
  }),
).annotations({
  identifier: "NetworkingRequest",
}) as any as S.Schema<NetworkingRequest>;
export interface CustomLaunchTemplate {
  id: string;
  version: string;
}
export const CustomLaunchTemplate = S.suspend(() =>
  S.Struct({ id: S.String, version: S.String }),
).annotations({
  identifier: "CustomLaunchTemplate",
}) as any as S.Schema<CustomLaunchTemplate>;
export interface ScalingConfigurationRequest {
  minInstanceCount: number;
  maxInstanceCount: number;
}
export const ScalingConfigurationRequest = S.suspend(() =>
  S.Struct({ minInstanceCount: S.Number, maxInstanceCount: S.Number }),
).annotations({
  identifier: "ScalingConfigurationRequest",
}) as any as S.Schema<ScalingConfigurationRequest>;
export interface InstanceConfig {
  instanceType?: string;
}
export const InstanceConfig = S.suspend(() =>
  S.Struct({ instanceType: S.optional(S.String) }),
).annotations({
  identifier: "InstanceConfig",
}) as any as S.Schema<InstanceConfig>;
export type InstanceList = InstanceConfig[];
export const InstanceList = S.Array(InstanceConfig);
export interface SpotOptions {
  allocationStrategy?: string;
}
export const SpotOptions = S.suspend(() =>
  S.Struct({ allocationStrategy: S.optional(S.String) }),
).annotations({ identifier: "SpotOptions" }) as any as S.Schema<SpotOptions>;
export interface SlurmCustomSetting {
  parameterName: string;
  parameterValue: string;
}
export const SlurmCustomSetting = S.suspend(() =>
  S.Struct({ parameterName: S.String, parameterValue: S.String }),
).annotations({
  identifier: "SlurmCustomSetting",
}) as any as S.Schema<SlurmCustomSetting>;
export type SlurmCustomSettings = SlurmCustomSetting[];
export const SlurmCustomSettings = S.Array(SlurmCustomSetting);
export interface ComputeNodeGroupSlurmConfigurationRequest {
  slurmCustomSettings?: SlurmCustomSettings;
}
export const ComputeNodeGroupSlurmConfigurationRequest = S.suspend(() =>
  S.Struct({ slurmCustomSettings: S.optional(SlurmCustomSettings) }),
).annotations({
  identifier: "ComputeNodeGroupSlurmConfigurationRequest",
}) as any as S.Schema<ComputeNodeGroupSlurmConfigurationRequest>;
export interface UpdateComputeNodeGroupSlurmConfigurationRequest {
  slurmCustomSettings?: SlurmCustomSettings;
}
export const UpdateComputeNodeGroupSlurmConfigurationRequest = S.suspend(() =>
  S.Struct({ slurmCustomSettings: S.optional(SlurmCustomSettings) }),
).annotations({
  identifier: "UpdateComputeNodeGroupSlurmConfigurationRequest",
}) as any as S.Schema<UpdateComputeNodeGroupSlurmConfigurationRequest>;
export interface ComputeNodeGroupConfiguration {
  computeNodeGroupId?: string;
}
export const ComputeNodeGroupConfiguration = S.suspend(() =>
  S.Struct({ computeNodeGroupId: S.optional(S.String) }),
).annotations({
  identifier: "ComputeNodeGroupConfiguration",
}) as any as S.Schema<ComputeNodeGroupConfiguration>;
export type ComputeNodeGroupConfigurationList = ComputeNodeGroupConfiguration[];
export const ComputeNodeGroupConfigurationList = S.Array(
  ComputeNodeGroupConfiguration,
);
export interface QueueSlurmConfigurationRequest {
  slurmCustomSettings?: SlurmCustomSettings;
}
export const QueueSlurmConfigurationRequest = S.suspend(() =>
  S.Struct({ slurmCustomSettings: S.optional(SlurmCustomSettings) }),
).annotations({
  identifier: "QueueSlurmConfigurationRequest",
}) as any as S.Schema<QueueSlurmConfigurationRequest>;
export interface UpdateQueueSlurmConfigurationRequest {
  slurmCustomSettings?: SlurmCustomSettings;
}
export const UpdateQueueSlurmConfigurationRequest = S.suspend(() =>
  S.Struct({ slurmCustomSettings: S.optional(SlurmCustomSettings) }),
).annotations({
  identifier: "UpdateQueueSlurmConfigurationRequest",
}) as any as S.Schema<UpdateQueueSlurmConfigurationRequest>;
export interface TagResourceRequest {
  resourceArn: string;
  tags: RequestTagMap;
}
export const TagResourceRequest = S.suspend(() =>
  S.Struct({ resourceArn: S.String, tags: RequestTagMap }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "TagResourceRequest",
}) as any as S.Schema<TagResourceRequest>;
export interface TagResourceResponse {}
export const TagResourceResponse = S.suspend(() => S.Struct({})).annotations({
  identifier: "TagResourceResponse",
}) as any as S.Schema<TagResourceResponse>;
export interface CreateComputeNodeGroupRequest {
  clusterIdentifier: string;
  computeNodeGroupName: string;
  amiId?: string;
  subnetIds: StringList;
  purchaseOption?: string;
  customLaunchTemplate: CustomLaunchTemplate;
  iamInstanceProfileArn: string;
  scalingConfiguration: ScalingConfigurationRequest;
  instanceConfigs: InstanceList;
  spotOptions?: SpotOptions;
  slurmConfiguration?: ComputeNodeGroupSlurmConfigurationRequest;
  clientToken?: string;
  tags?: RequestTagMap;
}
export const CreateComputeNodeGroupRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateComputeNodeGroupRequest",
}) as any as S.Schema<CreateComputeNodeGroupRequest>;
export interface UpdateComputeNodeGroupRequest {
  clusterIdentifier: string;
  computeNodeGroupIdentifier: string;
  amiId?: string;
  subnetIds?: StringList;
  customLaunchTemplate?: CustomLaunchTemplate;
  purchaseOption?: string;
  spotOptions?: SpotOptions;
  scalingConfiguration?: ScalingConfigurationRequest;
  iamInstanceProfileArn?: string;
  slurmConfiguration?: UpdateComputeNodeGroupSlurmConfigurationRequest;
  clientToken?: string;
}
export const UpdateComputeNodeGroupRequest = S.suspend(() =>
  S.Struct({
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
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateComputeNodeGroupRequest",
}) as any as S.Schema<UpdateComputeNodeGroupRequest>;
export interface CreateQueueRequest {
  clusterIdentifier: string;
  queueName: string;
  computeNodeGroupConfigurations?: ComputeNodeGroupConfigurationList;
  slurmConfiguration?: QueueSlurmConfigurationRequest;
  clientToken?: string;
  tags?: RequestTagMap;
}
export const CreateQueueRequest = S.suspend(() =>
  S.Struct({
    clusterIdentifier: S.String,
    queueName: S.String,
    computeNodeGroupConfigurations: S.optional(
      ComputeNodeGroupConfigurationList,
    ),
    slurmConfiguration: S.optional(QueueSlurmConfigurationRequest),
    clientToken: S.optional(S.String),
    tags: S.optional(RequestTagMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateQueueRequest",
}) as any as S.Schema<CreateQueueRequest>;
export interface UpdateQueueRequest {
  clusterIdentifier: string;
  queueIdentifier: string;
  computeNodeGroupConfigurations?: ComputeNodeGroupConfigurationList;
  slurmConfiguration?: UpdateQueueSlurmConfigurationRequest;
  clientToken?: string;
}
export const UpdateQueueRequest = S.suspend(() =>
  S.Struct({
    clusterIdentifier: S.String,
    queueIdentifier: S.String,
    computeNodeGroupConfigurations: S.optional(
      ComputeNodeGroupConfigurationList,
    ),
    slurmConfiguration: S.optional(UpdateQueueSlurmConfigurationRequest),
    clientToken: S.optional(S.String),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateQueueRequest",
}) as any as S.Schema<UpdateQueueRequest>;
export interface AccountingRequest {
  defaultPurgeTimeInDays?: number;
  mode: string;
}
export const AccountingRequest = S.suspend(() =>
  S.Struct({ defaultPurgeTimeInDays: S.optional(S.Number), mode: S.String }),
).annotations({
  identifier: "AccountingRequest",
}) as any as S.Schema<AccountingRequest>;
export interface SlurmRestRequest {
  mode: string;
}
export const SlurmRestRequest = S.suspend(() =>
  S.Struct({ mode: S.String }),
).annotations({
  identifier: "SlurmRestRequest",
}) as any as S.Schema<SlurmRestRequest>;
export interface UpdateAccountingRequest {
  defaultPurgeTimeInDays?: number;
  mode?: string;
}
export const UpdateAccountingRequest = S.suspend(() =>
  S.Struct({
    defaultPurgeTimeInDays: S.optional(S.Number),
    mode: S.optional(S.String),
  }),
).annotations({
  identifier: "UpdateAccountingRequest",
}) as any as S.Schema<UpdateAccountingRequest>;
export interface UpdateSlurmRestRequest {
  mode?: string;
}
export const UpdateSlurmRestRequest = S.suspend(() =>
  S.Struct({ mode: S.optional(S.String) }),
).annotations({
  identifier: "UpdateSlurmRestRequest",
}) as any as S.Schema<UpdateSlurmRestRequest>;
export type ResponseTagMap = { [key: string]: string };
export const ResponseTagMap = S.Record({ key: S.String, value: S.String });
export interface ClusterSlurmConfigurationRequest {
  scaleDownIdleTimeInSeconds?: number;
  slurmCustomSettings?: SlurmCustomSettings;
  accounting?: AccountingRequest;
  slurmRest?: SlurmRestRequest;
}
export const ClusterSlurmConfigurationRequest = S.suspend(() =>
  S.Struct({
    scaleDownIdleTimeInSeconds: S.optional(S.Number),
    slurmCustomSettings: S.optional(SlurmCustomSettings),
    accounting: S.optional(AccountingRequest),
    slurmRest: S.optional(SlurmRestRequest),
  }),
).annotations({
  identifier: "ClusterSlurmConfigurationRequest",
}) as any as S.Schema<ClusterSlurmConfigurationRequest>;
export interface UpdateClusterSlurmConfigurationRequest {
  scaleDownIdleTimeInSeconds?: number;
  slurmCustomSettings?: SlurmCustomSettings;
  accounting?: UpdateAccountingRequest;
  slurmRest?: UpdateSlurmRestRequest;
}
export const UpdateClusterSlurmConfigurationRequest = S.suspend(() =>
  S.Struct({
    scaleDownIdleTimeInSeconds: S.optional(S.Number),
    slurmCustomSettings: S.optional(SlurmCustomSettings),
    accounting: S.optional(UpdateAccountingRequest),
    slurmRest: S.optional(UpdateSlurmRestRequest),
  }),
).annotations({
  identifier: "UpdateClusterSlurmConfigurationRequest",
}) as any as S.Schema<UpdateClusterSlurmConfigurationRequest>;
export interface Endpoint {
  type: string;
  privateIpAddress: string;
  publicIpAddress?: string;
  ipv6Address?: string;
  port: string;
}
export const Endpoint = S.suspend(() =>
  S.Struct({
    type: S.String,
    privateIpAddress: S.String,
    publicIpAddress: S.optional(S.String),
    ipv6Address: S.optional(S.String),
    port: S.String,
  }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export type Endpoints = Endpoint[];
export const Endpoints = S.Array(Endpoint);
export interface ClusterSummary {
  name: string;
  id: string;
  arn: string;
  createdAt: Date;
  modifiedAt: Date;
  status: string;
}
export const ClusterSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    id: S.String,
    arn: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "ClusterSummary",
}) as any as S.Schema<ClusterSummary>;
export type ClusterList = ClusterSummary[];
export const ClusterList = S.Array(ClusterSummary);
export interface ComputeNodeGroupSummary {
  name: string;
  id: string;
  arn: string;
  clusterId: string;
  createdAt: Date;
  modifiedAt: Date;
  status: string;
}
export const ComputeNodeGroupSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    id: S.String,
    arn: S.String,
    clusterId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({
  identifier: "ComputeNodeGroupSummary",
}) as any as S.Schema<ComputeNodeGroupSummary>;
export type ComputeNodeGroupList = ComputeNodeGroupSummary[];
export const ComputeNodeGroupList = S.Array(ComputeNodeGroupSummary);
export interface QueueSummary {
  name: string;
  id: string;
  arn: string;
  clusterId: string;
  createdAt: Date;
  modifiedAt: Date;
  status: string;
}
export const QueueSummary = S.suspend(() =>
  S.Struct({
    name: S.String,
    id: S.String,
    arn: S.String,
    clusterId: S.String,
    createdAt: S.Date.pipe(T.TimestampFormat("date-time")),
    modifiedAt: S.Date.pipe(T.TimestampFormat("date-time")),
    status: S.String,
  }),
).annotations({ identifier: "QueueSummary" }) as any as S.Schema<QueueSummary>;
export type QueueList = QueueSummary[];
export const QueueList = S.Array(QueueSummary);
export interface ListTagsForResourceResponse {
  tags?: ResponseTagMap;
}
export const ListTagsForResourceResponse = S.suspend(() =>
  S.Struct({ tags: S.optional(ResponseTagMap) }),
).annotations({
  identifier: "ListTagsForResourceResponse",
}) as any as S.Schema<ListTagsForResourceResponse>;
export interface CreateClusterRequest {
  clusterName: string;
  scheduler: SchedulerRequest;
  size: string;
  networking: NetworkingRequest;
  slurmConfiguration?: ClusterSlurmConfigurationRequest;
  clientToken?: string;
  tags?: RequestTagMap;
}
export const CreateClusterRequest = S.suspend(() =>
  S.Struct({
    clusterName: S.String,
    scheduler: SchedulerRequest,
    size: S.String,
    networking: NetworkingRequest,
    slurmConfiguration: S.optional(ClusterSlurmConfigurationRequest),
    clientToken: S.optional(S.String),
    tags: S.optional(RequestTagMap),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "CreateClusterRequest",
}) as any as S.Schema<CreateClusterRequest>;
export interface UpdateClusterRequest {
  clusterIdentifier: string;
  clientToken?: string;
  slurmConfiguration?: UpdateClusterSlurmConfigurationRequest;
}
export const UpdateClusterRequest = S.suspend(() =>
  S.Struct({
    clusterIdentifier: S.String,
    clientToken: S.optional(S.String),
    slurmConfiguration: S.optional(UpdateClusterSlurmConfigurationRequest),
  }).pipe(
    T.all(T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
  ),
).annotations({
  identifier: "UpdateClusterRequest",
}) as any as S.Schema<UpdateClusterRequest>;
export interface RegisterComputeNodeGroupInstanceResponse {
  nodeID: string;
  sharedSecret: string | Redacted.Redacted<string>;
  endpoints: Endpoints;
}
export const RegisterComputeNodeGroupInstanceResponse = S.suspend(() =>
  S.Struct({
    nodeID: S.String,
    sharedSecret: SensitiveString,
    endpoints: Endpoints,
  }),
).annotations({
  identifier: "RegisterComputeNodeGroupInstanceResponse",
}) as any as S.Schema<RegisterComputeNodeGroupInstanceResponse>;
export interface ListClustersResponse {
  clusters: ClusterList;
  nextToken?: string;
}
export const ListClustersResponse = S.suspend(() =>
  S.Struct({ clusters: ClusterList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListClustersResponse",
}) as any as S.Schema<ListClustersResponse>;
export interface ScalingConfiguration {
  minInstanceCount: number;
  maxInstanceCount: number;
}
export const ScalingConfiguration = S.suspend(() =>
  S.Struct({ minInstanceCount: S.Number, maxInstanceCount: S.Number }),
).annotations({
  identifier: "ScalingConfiguration",
}) as any as S.Schema<ScalingConfiguration>;
export interface ComputeNodeGroupSlurmConfiguration {
  slurmCustomSettings?: SlurmCustomSettings;
}
export const ComputeNodeGroupSlurmConfiguration = S.suspend(() =>
  S.Struct({ slurmCustomSettings: S.optional(SlurmCustomSettings) }),
).annotations({
  identifier: "ComputeNodeGroupSlurmConfiguration",
}) as any as S.Schema<ComputeNodeGroupSlurmConfiguration>;
export interface ErrorInfo {
  code?: string;
  message?: string;
}
export const ErrorInfo = S.suspend(() =>
  S.Struct({ code: S.optional(S.String), message: S.optional(S.String) }),
).annotations({ identifier: "ErrorInfo" }) as any as S.Schema<ErrorInfo>;
export type ErrorInfoList = ErrorInfo[];
export const ErrorInfoList = S.Array(ErrorInfo);
export interface ComputeNodeGroup {
  name: string;
  id: string;
  arn: string;
  clusterId: string;
  createdAt: Date;
  modifiedAt: Date;
  status: string;
  amiId?: string;
  subnetIds: SubnetIdList;
  purchaseOption?: string;
  customLaunchTemplate: CustomLaunchTemplate;
  iamInstanceProfileArn: string;
  scalingConfiguration: ScalingConfiguration;
  instanceConfigs: InstanceList;
  spotOptions?: SpotOptions;
  slurmConfiguration?: ComputeNodeGroupSlurmConfiguration;
  errorInfo?: ErrorInfoList;
}
export const ComputeNodeGroup = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({
  identifier: "ComputeNodeGroup",
}) as any as S.Schema<ComputeNodeGroup>;
export interface CreateComputeNodeGroupResponse {
  computeNodeGroup?: ComputeNodeGroup;
}
export const CreateComputeNodeGroupResponse = S.suspend(() =>
  S.Struct({ computeNodeGroup: S.optional(ComputeNodeGroup) }),
).annotations({
  identifier: "CreateComputeNodeGroupResponse",
}) as any as S.Schema<CreateComputeNodeGroupResponse>;
export interface UpdateComputeNodeGroupResponse {
  computeNodeGroup?: ComputeNodeGroup;
}
export const UpdateComputeNodeGroupResponse = S.suspend(() =>
  S.Struct({ computeNodeGroup: S.optional(ComputeNodeGroup) }),
).annotations({
  identifier: "UpdateComputeNodeGroupResponse",
}) as any as S.Schema<UpdateComputeNodeGroupResponse>;
export interface ListComputeNodeGroupsResponse {
  computeNodeGroups: ComputeNodeGroupList;
  nextToken?: string;
}
export const ListComputeNodeGroupsResponse = S.suspend(() =>
  S.Struct({
    computeNodeGroups: ComputeNodeGroupList,
    nextToken: S.optional(S.String),
  }),
).annotations({
  identifier: "ListComputeNodeGroupsResponse",
}) as any as S.Schema<ListComputeNodeGroupsResponse>;
export interface QueueSlurmConfiguration {
  slurmCustomSettings?: SlurmCustomSettings;
}
export const QueueSlurmConfiguration = S.suspend(() =>
  S.Struct({ slurmCustomSettings: S.optional(SlurmCustomSettings) }),
).annotations({
  identifier: "QueueSlurmConfiguration",
}) as any as S.Schema<QueueSlurmConfiguration>;
export interface Queue {
  name: string;
  id: string;
  arn: string;
  clusterId: string;
  createdAt: Date;
  modifiedAt: Date;
  status: string;
  computeNodeGroupConfigurations: ComputeNodeGroupConfigurationList;
  slurmConfiguration?: QueueSlurmConfiguration;
  errorInfo?: ErrorInfoList;
}
export const Queue = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Queue" }) as any as S.Schema<Queue>;
export interface CreateQueueResponse {
  queue?: Queue;
}
export const CreateQueueResponse = S.suspend(() =>
  S.Struct({ queue: S.optional(Queue) }),
).annotations({
  identifier: "CreateQueueResponse",
}) as any as S.Schema<CreateQueueResponse>;
export interface UpdateQueueResponse {
  queue?: Queue;
}
export const UpdateQueueResponse = S.suspend(() =>
  S.Struct({ queue: S.optional(Queue) }),
).annotations({
  identifier: "UpdateQueueResponse",
}) as any as S.Schema<UpdateQueueResponse>;
export interface ListQueuesResponse {
  queues: QueueList;
  nextToken?: string;
}
export const ListQueuesResponse = S.suspend(() =>
  S.Struct({ queues: QueueList, nextToken: S.optional(S.String) }),
).annotations({
  identifier: "ListQueuesResponse",
}) as any as S.Schema<ListQueuesResponse>;
export interface Scheduler {
  type: string;
  version: string;
}
export const Scheduler = S.suspend(() =>
  S.Struct({ type: S.String, version: S.String }),
).annotations({ identifier: "Scheduler" }) as any as S.Schema<Scheduler>;
export interface Networking {
  subnetIds?: SubnetIdList;
  securityGroupIds?: SecurityGroupIdList;
  networkType?: string;
}
export const Networking = S.suspend(() =>
  S.Struct({
    subnetIds: S.optional(SubnetIdList),
    securityGroupIds: S.optional(SecurityGroupIdList),
    networkType: S.optional(S.String),
  }),
).annotations({ identifier: "Networking" }) as any as S.Schema<Networking>;
export interface SlurmAuthKey {
  secretArn: string;
  secretVersion: string;
}
export const SlurmAuthKey = S.suspend(() =>
  S.Struct({ secretArn: S.String, secretVersion: S.String }),
).annotations({ identifier: "SlurmAuthKey" }) as any as S.Schema<SlurmAuthKey>;
export interface Accounting {
  defaultPurgeTimeInDays?: number;
  mode: string;
}
export const Accounting = S.suspend(() =>
  S.Struct({ defaultPurgeTimeInDays: S.optional(S.Number), mode: S.String }),
).annotations({ identifier: "Accounting" }) as any as S.Schema<Accounting>;
export interface SlurmRest {
  mode: string;
}
export const SlurmRest = S.suspend(() =>
  S.Struct({ mode: S.String }),
).annotations({ identifier: "SlurmRest" }) as any as S.Schema<SlurmRest>;
export interface JwtKey {
  secretArn: string;
  secretVersion: string;
}
export const JwtKey = S.suspend(() =>
  S.Struct({ secretArn: S.String, secretVersion: S.String }),
).annotations({ identifier: "JwtKey" }) as any as S.Schema<JwtKey>;
export interface JwtAuth {
  jwtKey?: JwtKey;
}
export const JwtAuth = S.suspend(() =>
  S.Struct({ jwtKey: S.optional(JwtKey) }),
).annotations({ identifier: "JwtAuth" }) as any as S.Schema<JwtAuth>;
export interface ClusterSlurmConfiguration {
  scaleDownIdleTimeInSeconds?: number;
  slurmCustomSettings?: SlurmCustomSettings;
  authKey?: SlurmAuthKey;
  jwtAuth?: JwtAuth;
  accounting?: Accounting;
  slurmRest?: SlurmRest;
}
export const ClusterSlurmConfiguration = S.suspend(() =>
  S.Struct({
    scaleDownIdleTimeInSeconds: S.optional(S.Number),
    slurmCustomSettings: S.optional(SlurmCustomSettings),
    authKey: S.optional(SlurmAuthKey),
    jwtAuth: S.optional(JwtAuth),
    accounting: S.optional(Accounting),
    slurmRest: S.optional(SlurmRest),
  }),
).annotations({
  identifier: "ClusterSlurmConfiguration",
}) as any as S.Schema<ClusterSlurmConfiguration>;
export interface Cluster {
  name: string;
  id: string;
  arn: string;
  status: string;
  createdAt: Date;
  modifiedAt: Date;
  scheduler: Scheduler;
  size: string;
  slurmConfiguration?: ClusterSlurmConfiguration;
  networking: Networking;
  endpoints?: Endpoints;
  errorInfo?: ErrorInfoList;
}
export const Cluster = S.suspend(() =>
  S.Struct({
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
  }),
).annotations({ identifier: "Cluster" }) as any as S.Schema<Cluster>;
export interface CreateClusterResponse {
  cluster?: Cluster;
}
export const CreateClusterResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }),
).annotations({
  identifier: "CreateClusterResponse",
}) as any as S.Schema<CreateClusterResponse>;
export interface UpdateClusterResponse {
  cluster?: Cluster;
}
export const UpdateClusterResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }),
).annotations({
  identifier: "UpdateClusterResponse",
}) as any as S.Schema<UpdateClusterResponse>;
export interface GetComputeNodeGroupResponse {
  computeNodeGroup?: ComputeNodeGroup;
}
export const GetComputeNodeGroupResponse = S.suspend(() =>
  S.Struct({ computeNodeGroup: S.optional(ComputeNodeGroup) }),
).annotations({
  identifier: "GetComputeNodeGroupResponse",
}) as any as S.Schema<GetComputeNodeGroupResponse>;
export interface GetQueueResponse {
  queue?: Queue;
}
export const GetQueueResponse = S.suspend(() =>
  S.Struct({ queue: S.optional(Queue) }),
).annotations({
  identifier: "GetQueueResponse",
}) as any as S.Schema<GetQueueResponse>;
export interface GetClusterResponse {
  cluster?: Cluster;
}
export const GetClusterResponse = S.suspend(() =>
  S.Struct({ cluster: S.optional(Cluster) }),
).annotations({
  identifier: "GetClusterResponse",
}) as any as S.Schema<GetClusterResponse>;
export interface ValidationExceptionField {
  name: string;
  message: string;
}
export const ValidationExceptionField = S.suspend(() =>
  S.Struct({ name: S.String, message: S.String }),
).annotations({
  identifier: "ValidationExceptionField",
}) as any as S.Schema<ValidationExceptionField>;
export type ValidationExceptionFieldList = ValidationExceptionField[];
export const ValidationExceptionFieldList = S.Array(ValidationExceptionField);

//# Errors
export class ResourceNotFoundException extends S.TaggedError<ResourceNotFoundException>()(
  "ResourceNotFoundException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withBadRequestError) {}
export class AccessDeniedException extends S.TaggedError<AccessDeniedException>()(
  "AccessDeniedException",
  { message: S.String },
).pipe(C.withAuthError) {}
export class ConflictException extends S.TaggedError<ConflictException>()(
  "ConflictException",
  { message: S.String, resourceId: S.String, resourceType: S.String },
).pipe(C.withConflictError) {}
export class ServiceQuotaExceededException extends S.TaggedError<ServiceQuotaExceededException>()(
  "ServiceQuotaExceededException",
  {
    message: S.String,
    serviceCode: S.String,
    resourceId: S.optional(S.String),
    resourceType: S.optional(S.String),
    quotaCode: S.optional(S.String),
  },
).pipe(C.withQuotaError) {}
export class InternalServerException extends S.TaggedError<InternalServerException>()(
  "InternalServerException",
  { message: S.String },
  T.Retryable(),
).pipe(C.withServerError, C.withRetryableError) {}
export class ThrottlingException extends S.TaggedError<ThrottlingException>()(
  "ThrottlingException",
  {
    message: S.String,
    retryAfterSeconds: S.optional(S.Number).pipe(T.HttpHeader("Retry-After")),
  },
  T.Retryable(),
).pipe(C.withThrottlingError, C.withRetryableError) {}
export class ValidationException extends S.TaggedError<ValidationException>()(
  "ValidationException",
  {
    message: S.String,
    reason: S.String,
    fieldList: S.optional(ValidationExceptionFieldList),
  },
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Deletes tags from an PCS resource. To delete a tag, specify the tag key and the Amazon Resource Name (ARN) of the PCS resource.
 */
export const untagResource: (
  input: UntagResourceRequest,
) => Effect.Effect<
  UntagResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: UntagResourceRequest,
  output: UntagResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Returns a list of all tags on an PCS resource.
 */
export const listTagsForResource: (
  input: ListTagsForResourceRequest,
) => Effect.Effect<
  ListTagsForResourceResponse,
  ResourceNotFoundException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceRequest,
  output: ListTagsForResourceResponse,
  errors: [ResourceNotFoundException],
}));
/**
 * Adds or edits tags on an PCS resource. Each tag consists of a tag key and a tag value. The tag key and tag value are case-sensitive strings. The tag value can be an empty (null) string. To add a tag, specify a new tag key and a tag value. To edit a tag, specify an existing tag key and a new tag value.
 */
export const tagResource: (
  input: TagResourceRequest,
) => Effect.Effect<
  TagResourceResponse,
  ResourceNotFoundException | ServiceQuotaExceededException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TagResourceRequest,
  output: TagResourceResponse,
  errors: [ResourceNotFoundException, ServiceQuotaExceededException],
}));
/**
 * This API action isn't intended for you to use.
 *
 * PCS uses this API action to register the compute nodes it launches in your account.
 */
export const registerComputeNodeGroupInstance: (
  input: RegisterComputeNodeGroupInstanceRequest,
) => Effect.Effect<
  RegisterComputeNodeGroupInstanceResponse,
  AccessDeniedException | InternalServerException | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RegisterComputeNodeGroupInstanceRequest,
  output: RegisterComputeNodeGroupInstanceResponse,
  errors: [AccessDeniedException, InternalServerException],
}));
/**
 * Deletes a cluster and all its linked resources. You must delete all queues and compute node groups associated with the cluster before you can delete the cluster.
 */
export const deleteCluster: (
  input: DeleteClusterRequest,
) => Effect.Effect<
  DeleteClusterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getComputeNodeGroup: (
  input: GetComputeNodeGroupRequest,
) => Effect.Effect<
  GetComputeNodeGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getQueue: (
  input: GetQueueRequest,
) => Effect.Effect<
  GetQueueResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listClusters: {
  (
    input: ListClustersRequest,
  ): Effect.Effect<
    ListClustersResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListClustersRequest,
  ) => Stream.Stream<
    ListClustersResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListClustersRequest,
  ) => Stream.Stream<
    ClusterSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
}));
/**
 * Creates a managed set of compute nodes. You associate a compute node group with a cluster through 1 or more PCS queues or as part of the login fleet. A compute node group includes the definition of the compute properties and lifecycle management. PCS uses the information you provide to this API action to launch compute nodes in your account. You can only specify subnets in the same Amazon VPC as your cluster. You receive billing charges for the compute nodes that PCS launches in your account. You must already have a launch template before you call this API. For more information, see Launch an instance from a launch template in the *Amazon Elastic Compute Cloud User Guide for Linux Instances*.
 */
export const createComputeNodeGroup: (
  input: CreateComputeNodeGroupRequest,
) => Effect.Effect<
  CreateComputeNodeGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Updates a compute node group. You can update many of the fields related to your compute node group including the configurations for networking, compute nodes, and settings specific to your scheduler (such as Slurm).
 */
export const updateComputeNodeGroup: (
  input: UpdateComputeNodeGroupRequest,
) => Effect.Effect<
  UpdateComputeNodeGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Returns a list of all compute node groups associated with a cluster.
 */
export const listComputeNodeGroups: {
  (
    input: ListComputeNodeGroupsRequest,
  ): Effect.Effect<
    ListComputeNodeGroupsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListComputeNodeGroupsRequest,
  ) => Stream.Stream<
    ListComputeNodeGroupsResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListComputeNodeGroupsRequest,
  ) => Stream.Stream<
    ComputeNodeGroupSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const createQueue: (
  input: CreateQueueRequest,
) => Effect.Effect<
  CreateQueueResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateQueue: (
  input: UpdateQueueRequest,
) => Effect.Effect<
  UpdateQueueResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const listQueues: {
  (
    input: ListQueuesRequest,
  ): Effect.Effect<
    ListQueuesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: ListQueuesRequest,
  ) => Stream.Stream<
    ListQueuesResponse,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: ListQueuesRequest,
  ) => Stream.Stream<
    QueueSummary,
    | AccessDeniedException
    | ConflictException
    | InternalServerException
    | ResourceNotFoundException
    | ThrottlingException
    | ValidationException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
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
export const deleteComputeNodeGroup: (
  input: DeleteComputeNodeGroupRequest,
) => Effect.Effect<
  DeleteComputeNodeGroupResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
}));
/**
 * Deletes a job queue. If the compute node group associated with this queue isn't associated with any other queues, PCS terminates all the compute nodes for this queue.
 */
export const deleteQueue: (
  input: DeleteQueueRequest,
) => Effect.Effect<
  DeleteQueueResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCluster: (
  input: CreateClusterRequest,
) => Effect.Effect<
  CreateClusterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ServiceQuotaExceededException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const updateCluster: (
  input: UpdateClusterRequest,
) => Effect.Effect<
  UpdateClusterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const getCluster: (
  input: GetClusterRequest,
) => Effect.Effect<
  GetClusterResponse,
  | AccessDeniedException
  | ConflictException
  | InternalServerException
  | ResourceNotFoundException
  | ThrottlingException
  | ValidationException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
