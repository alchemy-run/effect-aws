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
const ns = T.XmlNamespace("http://elasticache.amazonaws.com/doc/2015-02-02/");
const svc = T.AwsApiService({
  sdkId: "ElastiCache",
  serviceShapeName: "AmazonElastiCacheV9",
});
const auth = T.AwsAuthSigv4({ name: "elasticache" });
const ver = T.ServiceVersion("2015-02-02");
const proto = T.AwsProtocolsAwsQuery();
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
                        url: "https://elasticache-fips.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                      conditions: [
                        {
                          fn: "stringEquals",
                          argv: [
                            {
                              fn: "getAttr",
                              argv: [{ ref: "PartitionResult" }, "name"],
                            },
                            "aws-us-gov",
                          ],
                        },
                      ],
                      endpoint: {
                        url: "https://elasticache.{Region}.amazonaws.com",
                        properties: {},
                        headers: {},
                      },
                      type: "endpoint",
                    },
                    {
                      conditions: [],
                      endpoint: {
                        url: "https://elasticache-fips.{Region}.{PartitionResult#dnsSuffix}",
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
                        url: "https://elasticache.{Region}.{PartitionResult#dualStackDnsSuffix}",
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
                url: "https://elasticache.{Region}.{PartitionResult#dnsSuffix}",
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
export type IntegerOptional = number;
export type UserGroupId = string;
export type UserId = string;
export type UserName = string;
export type EngineType = string;
export type AccessString = string;
export type Integer = number;
export type AllowedNodeGroupId = string;
export type FilterName = string;
export type FilterValue = string;
export type AwsQueryErrorMessage = string;
export type ExceptionMessage = string;
export type Double = number;

//# Schemas
export type ReplicationGroupIdList = string[];
export const ReplicationGroupIdList = S.Array(S.String);
export type CacheClusterIdList = string[];
export const CacheClusterIdList = S.Array(S.String);
export type PreferredAvailabilityZoneList = string[];
export const PreferredAvailabilityZoneList = S.Array(
  S.String.pipe(T.XmlName("PreferredAvailabilityZone")),
);
export type CacheSecurityGroupNameList = string[];
export const CacheSecurityGroupNameList = S.Array(
  S.String.pipe(T.XmlName("CacheSecurityGroupName")),
);
export type SecurityGroupIdsList = string[];
export const SecurityGroupIdsList = S.Array(
  S.String.pipe(T.XmlName("SecurityGroupId")),
);
export type SnapshotArnsList = string[];
export const SnapshotArnsList = S.Array(
  S.String.pipe(T.XmlName("SnapshotArn")),
);
export type PreferredOutpostArnList = string[];
export const PreferredOutpostArnList = S.Array(
  S.String.pipe(T.XmlName("PreferredOutpostArn")),
);
export type SubnetIdentifierList = string[];
export const SubnetIdentifierList = S.Array(
  S.String.pipe(T.XmlName("SubnetIdentifier")),
);
export type AvailabilityZonesList = string[];
export const AvailabilityZonesList = S.Array(
  S.String.pipe(T.XmlName("AvailabilityZone")),
);
export type UserGroupIdListInput = string[];
export const UserGroupIdListInput = S.Array(S.String);
export type SubnetIdsList = string[];
export const SubnetIdsList = S.Array(S.String.pipe(T.XmlName("SubnetId")));
export type PasswordListInput = string[];
export const PasswordListInput = S.Array(S.String);
export type UserIdListInput = string[];
export const UserIdListInput = S.Array(S.String);
export type GlobalNodeGroupIdList = string[];
export const GlobalNodeGroupIdList = S.Array(
  S.String.pipe(T.XmlName("GlobalNodeGroupId")),
);
export type RemoveReplicasList = string[];
export const RemoveReplicasList = S.Array(S.String);
export type ServiceUpdateStatusList = string[];
export const ServiceUpdateStatusList = S.Array(S.String);
export type UpdateActionStatusList = string[];
export const UpdateActionStatusList = S.Array(S.String);
export type CacheNodeIdsList = string[];
export const CacheNodeIdsList = S.Array(
  S.String.pipe(T.XmlName("CacheNodeId")),
);
export type UserGroupIdList = string[];
export const UserGroupIdList = S.Array(S.String);
export type NodeGroupsToRemoveList = string[];
export const NodeGroupsToRemoveList = S.Array(
  S.String.pipe(T.XmlName("NodeGroupToRemove")),
);
export type NodeGroupsToRetainList = string[];
export const NodeGroupsToRetainList = S.Array(
  S.String.pipe(T.XmlName("NodeGroupToRetain")),
);
export type KeyList = string[];
export const KeyList = S.Array(S.String);
export interface AuthorizeCacheSecurityGroupIngressMessage {
  CacheSecurityGroupName: string;
  EC2SecurityGroupName: string;
  EC2SecurityGroupOwnerId: string;
}
export const AuthorizeCacheSecurityGroupIngressMessage = S.suspend(() =>
  S.Struct({
    CacheSecurityGroupName: S.String,
    EC2SecurityGroupName: S.String,
    EC2SecurityGroupOwnerId: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AuthorizeCacheSecurityGroupIngressMessage",
}) as any as S.Schema<AuthorizeCacheSecurityGroupIngressMessage>;
export interface BatchApplyUpdateActionMessage {
  ReplicationGroupIds?: ReplicationGroupIdList;
  CacheClusterIds?: CacheClusterIdList;
  ServiceUpdateName: string;
}
export const BatchApplyUpdateActionMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupIds: S.optional(ReplicationGroupIdList),
    CacheClusterIds: S.optional(CacheClusterIdList),
    ServiceUpdateName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchApplyUpdateActionMessage",
}) as any as S.Schema<BatchApplyUpdateActionMessage>;
export interface BatchStopUpdateActionMessage {
  ReplicationGroupIds?: ReplicationGroupIdList;
  CacheClusterIds?: CacheClusterIdList;
  ServiceUpdateName: string;
}
export const BatchStopUpdateActionMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupIds: S.optional(ReplicationGroupIdList),
    CacheClusterIds: S.optional(CacheClusterIdList),
    ServiceUpdateName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "BatchStopUpdateActionMessage",
}) as any as S.Schema<BatchStopUpdateActionMessage>;
export interface CompleteMigrationMessage {
  ReplicationGroupId: string;
  Force?: boolean;
}
export const CompleteMigrationMessage = S.suspend(() =>
  S.Struct({ ReplicationGroupId: S.String, Force: S.optional(S.Boolean) }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CompleteMigrationMessage",
}) as any as S.Schema<CompleteMigrationMessage>;
export interface Tag {
  Key?: string;
  Value?: string;
}
export const Tag = S.suspend(() =>
  S.Struct({ Key: S.optional(S.String), Value: S.optional(S.String) }),
).annotations({ identifier: "Tag" }) as any as S.Schema<Tag>;
export type TagList = Tag[];
export const TagList = S.Array(
  Tag.pipe(T.XmlName("Tag")).annotations({ identifier: "Tag" }),
);
export interface CopyServerlessCacheSnapshotRequest {
  SourceServerlessCacheSnapshotName: string;
  TargetServerlessCacheSnapshotName: string;
  KmsKeyId?: string;
  Tags?: TagList;
}
export const CopyServerlessCacheSnapshotRequest = S.suspend(() =>
  S.Struct({
    SourceServerlessCacheSnapshotName: S.String,
    TargetServerlessCacheSnapshotName: S.String,
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CopyServerlessCacheSnapshotRequest",
}) as any as S.Schema<CopyServerlessCacheSnapshotRequest>;
export interface CopySnapshotMessage {
  SourceSnapshotName: string;
  TargetSnapshotName: string;
  TargetBucket?: string;
  KmsKeyId?: string;
  Tags?: TagList;
}
export const CopySnapshotMessage = S.suspend(() =>
  S.Struct({
    SourceSnapshotName: S.String,
    TargetSnapshotName: S.String,
    TargetBucket: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CopySnapshotMessage",
}) as any as S.Schema<CopySnapshotMessage>;
export interface CreateCacheParameterGroupMessage {
  CacheParameterGroupName: string;
  CacheParameterGroupFamily: string;
  Description: string;
  Tags?: TagList;
}
export const CreateCacheParameterGroupMessage = S.suspend(() =>
  S.Struct({
    CacheParameterGroupName: S.String,
    CacheParameterGroupFamily: S.String,
    Description: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCacheParameterGroupMessage",
}) as any as S.Schema<CreateCacheParameterGroupMessage>;
export interface CreateCacheSecurityGroupMessage {
  CacheSecurityGroupName: string;
  Description: string;
  Tags?: TagList;
}
export const CreateCacheSecurityGroupMessage = S.suspend(() =>
  S.Struct({
    CacheSecurityGroupName: S.String,
    Description: S.String,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCacheSecurityGroupMessage",
}) as any as S.Schema<CreateCacheSecurityGroupMessage>;
export interface CreateCacheSubnetGroupMessage {
  CacheSubnetGroupName: string;
  CacheSubnetGroupDescription: string;
  SubnetIds: SubnetIdentifierList;
  Tags?: TagList;
}
export const CreateCacheSubnetGroupMessage = S.suspend(() =>
  S.Struct({
    CacheSubnetGroupName: S.String,
    CacheSubnetGroupDescription: S.String,
    SubnetIds: SubnetIdentifierList,
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCacheSubnetGroupMessage",
}) as any as S.Schema<CreateCacheSubnetGroupMessage>;
export interface CreateGlobalReplicationGroupMessage {
  GlobalReplicationGroupIdSuffix: string;
  GlobalReplicationGroupDescription?: string;
  PrimaryReplicationGroupId: string;
}
export const CreateGlobalReplicationGroupMessage = S.suspend(() =>
  S.Struct({
    GlobalReplicationGroupIdSuffix: S.String,
    GlobalReplicationGroupDescription: S.optional(S.String),
    PrimaryReplicationGroupId: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateGlobalReplicationGroupMessage",
}) as any as S.Schema<CreateGlobalReplicationGroupMessage>;
export interface CreateServerlessCacheSnapshotRequest {
  ServerlessCacheSnapshotName: string;
  ServerlessCacheName: string;
  KmsKeyId?: string;
  Tags?: TagList;
}
export const CreateServerlessCacheSnapshotRequest = S.suspend(() =>
  S.Struct({
    ServerlessCacheSnapshotName: S.String,
    ServerlessCacheName: S.String,
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateServerlessCacheSnapshotRequest",
}) as any as S.Schema<CreateServerlessCacheSnapshotRequest>;
export interface CreateSnapshotMessage {
  ReplicationGroupId?: string;
  CacheClusterId?: string;
  SnapshotName: string;
  KmsKeyId?: string;
  Tags?: TagList;
}
export const CreateSnapshotMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.optional(S.String),
    CacheClusterId: S.optional(S.String),
    SnapshotName: S.String,
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateSnapshotMessage",
}) as any as S.Schema<CreateSnapshotMessage>;
export interface CreateUserGroupMessage {
  UserGroupId: string;
  Engine: string;
  UserIds?: UserIdListInput;
  Tags?: TagList;
}
export const CreateUserGroupMessage = S.suspend(() =>
  S.Struct({
    UserGroupId: S.String,
    Engine: S.String,
    UserIds: S.optional(UserIdListInput),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUserGroupMessage",
}) as any as S.Schema<CreateUserGroupMessage>;
export interface DecreaseNodeGroupsInGlobalReplicationGroupMessage {
  GlobalReplicationGroupId: string;
  NodeGroupCount: number;
  GlobalNodeGroupsToRemove?: GlobalNodeGroupIdList;
  GlobalNodeGroupsToRetain?: GlobalNodeGroupIdList;
  ApplyImmediately: boolean;
}
export const DecreaseNodeGroupsInGlobalReplicationGroupMessage = S.suspend(() =>
  S.Struct({
    GlobalReplicationGroupId: S.String,
    NodeGroupCount: S.Number,
    GlobalNodeGroupsToRemove: S.optional(GlobalNodeGroupIdList),
    GlobalNodeGroupsToRetain: S.optional(GlobalNodeGroupIdList),
    ApplyImmediately: S.Boolean,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DecreaseNodeGroupsInGlobalReplicationGroupMessage",
}) as any as S.Schema<DecreaseNodeGroupsInGlobalReplicationGroupMessage>;
export interface DeleteCacheClusterMessage {
  CacheClusterId: string;
  FinalSnapshotIdentifier?: string;
}
export const DeleteCacheClusterMessage = S.suspend(() =>
  S.Struct({
    CacheClusterId: S.String,
    FinalSnapshotIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCacheClusterMessage",
}) as any as S.Schema<DeleteCacheClusterMessage>;
export interface DeleteCacheParameterGroupMessage {
  CacheParameterGroupName: string;
}
export const DeleteCacheParameterGroupMessage = S.suspend(() =>
  S.Struct({ CacheParameterGroupName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCacheParameterGroupMessage",
}) as any as S.Schema<DeleteCacheParameterGroupMessage>;
export interface DeleteCacheParameterGroupResponse {}
export const DeleteCacheParameterGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCacheParameterGroupResponse",
}) as any as S.Schema<DeleteCacheParameterGroupResponse>;
export interface DeleteCacheSecurityGroupMessage {
  CacheSecurityGroupName: string;
}
export const DeleteCacheSecurityGroupMessage = S.suspend(() =>
  S.Struct({ CacheSecurityGroupName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCacheSecurityGroupMessage",
}) as any as S.Schema<DeleteCacheSecurityGroupMessage>;
export interface DeleteCacheSecurityGroupResponse {}
export const DeleteCacheSecurityGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCacheSecurityGroupResponse",
}) as any as S.Schema<DeleteCacheSecurityGroupResponse>;
export interface DeleteCacheSubnetGroupMessage {
  CacheSubnetGroupName: string;
}
export const DeleteCacheSubnetGroupMessage = S.suspend(() =>
  S.Struct({ CacheSubnetGroupName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteCacheSubnetGroupMessage",
}) as any as S.Schema<DeleteCacheSubnetGroupMessage>;
export interface DeleteCacheSubnetGroupResponse {}
export const DeleteCacheSubnetGroupResponse = S.suspend(() =>
  S.Struct({}).pipe(ns),
).annotations({
  identifier: "DeleteCacheSubnetGroupResponse",
}) as any as S.Schema<DeleteCacheSubnetGroupResponse>;
export interface DeleteGlobalReplicationGroupMessage {
  GlobalReplicationGroupId: string;
  RetainPrimaryReplicationGroup: boolean;
}
export const DeleteGlobalReplicationGroupMessage = S.suspend(() =>
  S.Struct({
    GlobalReplicationGroupId: S.String,
    RetainPrimaryReplicationGroup: S.Boolean,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteGlobalReplicationGroupMessage",
}) as any as S.Schema<DeleteGlobalReplicationGroupMessage>;
export interface DeleteReplicationGroupMessage {
  ReplicationGroupId: string;
  RetainPrimaryCluster?: boolean;
  FinalSnapshotIdentifier?: string;
}
export const DeleteReplicationGroupMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.String,
    RetainPrimaryCluster: S.optional(S.Boolean),
    FinalSnapshotIdentifier: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteReplicationGroupMessage",
}) as any as S.Schema<DeleteReplicationGroupMessage>;
export interface DeleteServerlessCacheRequest {
  ServerlessCacheName: string;
  FinalSnapshotName?: string;
}
export const DeleteServerlessCacheRequest = S.suspend(() =>
  S.Struct({
    ServerlessCacheName: S.String,
    FinalSnapshotName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteServerlessCacheRequest",
}) as any as S.Schema<DeleteServerlessCacheRequest>;
export interface DeleteServerlessCacheSnapshotRequest {
  ServerlessCacheSnapshotName: string;
}
export const DeleteServerlessCacheSnapshotRequest = S.suspend(() =>
  S.Struct({ ServerlessCacheSnapshotName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteServerlessCacheSnapshotRequest",
}) as any as S.Schema<DeleteServerlessCacheSnapshotRequest>;
export interface DeleteSnapshotMessage {
  SnapshotName: string;
}
export const DeleteSnapshotMessage = S.suspend(() =>
  S.Struct({ SnapshotName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteSnapshotMessage",
}) as any as S.Schema<DeleteSnapshotMessage>;
export interface DeleteUserMessage {
  UserId: string;
}
export const DeleteUserMessage = S.suspend(() =>
  S.Struct({ UserId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteUserMessage",
}) as any as S.Schema<DeleteUserMessage>;
export interface DeleteUserGroupMessage {
  UserGroupId: string;
}
export const DeleteUserGroupMessage = S.suspend(() =>
  S.Struct({ UserGroupId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DeleteUserGroupMessage",
}) as any as S.Schema<DeleteUserGroupMessage>;
export interface DescribeCacheClustersMessage {
  CacheClusterId?: string;
  MaxRecords?: number;
  Marker?: string;
  ShowCacheNodeInfo?: boolean;
  ShowCacheClustersNotInReplicationGroups?: boolean;
}
export const DescribeCacheClustersMessage = S.suspend(() =>
  S.Struct({
    CacheClusterId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    ShowCacheNodeInfo: S.optional(S.Boolean),
    ShowCacheClustersNotInReplicationGroups: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCacheClustersMessage",
}) as any as S.Schema<DescribeCacheClustersMessage>;
export interface DescribeCacheEngineVersionsMessage {
  Engine?: string;
  EngineVersion?: string;
  CacheParameterGroupFamily?: string;
  MaxRecords?: number;
  Marker?: string;
  DefaultOnly?: boolean;
}
export const DescribeCacheEngineVersionsMessage = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    CacheParameterGroupFamily: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    DefaultOnly: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCacheEngineVersionsMessage",
}) as any as S.Schema<DescribeCacheEngineVersionsMessage>;
export interface DescribeCacheParameterGroupsMessage {
  CacheParameterGroupName?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeCacheParameterGroupsMessage = S.suspend(() =>
  S.Struct({
    CacheParameterGroupName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCacheParameterGroupsMessage",
}) as any as S.Schema<DescribeCacheParameterGroupsMessage>;
export interface DescribeCacheParametersMessage {
  CacheParameterGroupName: string;
  Source?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeCacheParametersMessage = S.suspend(() =>
  S.Struct({
    CacheParameterGroupName: S.String,
    Source: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCacheParametersMessage",
}) as any as S.Schema<DescribeCacheParametersMessage>;
export interface DescribeCacheSecurityGroupsMessage {
  CacheSecurityGroupName?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeCacheSecurityGroupsMessage = S.suspend(() =>
  S.Struct({
    CacheSecurityGroupName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCacheSecurityGroupsMessage",
}) as any as S.Schema<DescribeCacheSecurityGroupsMessage>;
export interface DescribeCacheSubnetGroupsMessage {
  CacheSubnetGroupName?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeCacheSubnetGroupsMessage = S.suspend(() =>
  S.Struct({
    CacheSubnetGroupName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeCacheSubnetGroupsMessage",
}) as any as S.Schema<DescribeCacheSubnetGroupsMessage>;
export interface DescribeEngineDefaultParametersMessage {
  CacheParameterGroupFamily: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeEngineDefaultParametersMessage = S.suspend(() =>
  S.Struct({
    CacheParameterGroupFamily: S.String,
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEngineDefaultParametersMessage",
}) as any as S.Schema<DescribeEngineDefaultParametersMessage>;
export interface DescribeEventsMessage {
  SourceIdentifier?: string;
  SourceType?: string;
  StartTime?: Date;
  EndTime?: Date;
  Duration?: number;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeEventsMessage = S.suspend(() =>
  S.Struct({
    SourceIdentifier: S.optional(S.String),
    SourceType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Duration: S.optional(S.Number),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeEventsMessage",
}) as any as S.Schema<DescribeEventsMessage>;
export interface DescribeGlobalReplicationGroupsMessage {
  GlobalReplicationGroupId?: string;
  MaxRecords?: number;
  Marker?: string;
  ShowMemberInfo?: boolean;
}
export const DescribeGlobalReplicationGroupsMessage = S.suspend(() =>
  S.Struct({
    GlobalReplicationGroupId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    ShowMemberInfo: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeGlobalReplicationGroupsMessage",
}) as any as S.Schema<DescribeGlobalReplicationGroupsMessage>;
export interface DescribeReplicationGroupsMessage {
  ReplicationGroupId?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeReplicationGroupsMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReplicationGroupsMessage",
}) as any as S.Schema<DescribeReplicationGroupsMessage>;
export interface DescribeReservedCacheNodesMessage {
  ReservedCacheNodeId?: string;
  ReservedCacheNodesOfferingId?: string;
  CacheNodeType?: string;
  Duration?: string;
  ProductDescription?: string;
  OfferingType?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeReservedCacheNodesMessage = S.suspend(() =>
  S.Struct({
    ReservedCacheNodeId: S.optional(S.String),
    ReservedCacheNodesOfferingId: S.optional(S.String),
    CacheNodeType: S.optional(S.String),
    Duration: S.optional(S.String),
    ProductDescription: S.optional(S.String),
    OfferingType: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReservedCacheNodesMessage",
}) as any as S.Schema<DescribeReservedCacheNodesMessage>;
export interface DescribeReservedCacheNodesOfferingsMessage {
  ReservedCacheNodesOfferingId?: string;
  CacheNodeType?: string;
  Duration?: string;
  ProductDescription?: string;
  OfferingType?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeReservedCacheNodesOfferingsMessage = S.suspend(() =>
  S.Struct({
    ReservedCacheNodesOfferingId: S.optional(S.String),
    CacheNodeType: S.optional(S.String),
    Duration: S.optional(S.String),
    ProductDescription: S.optional(S.String),
    OfferingType: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeReservedCacheNodesOfferingsMessage",
}) as any as S.Schema<DescribeReservedCacheNodesOfferingsMessage>;
export interface DescribeServerlessCachesRequest {
  ServerlessCacheName?: string;
  MaxResults?: number;
  NextToken?: string;
}
export const DescribeServerlessCachesRequest = S.suspend(() =>
  S.Struct({
    ServerlessCacheName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeServerlessCachesRequest",
}) as any as S.Schema<DescribeServerlessCachesRequest>;
export interface DescribeServerlessCacheSnapshotsRequest {
  ServerlessCacheName?: string;
  ServerlessCacheSnapshotName?: string;
  SnapshotType?: string;
  NextToken?: string;
  MaxResults?: number;
}
export const DescribeServerlessCacheSnapshotsRequest = S.suspend(() =>
  S.Struct({
    ServerlessCacheName: S.optional(S.String),
    ServerlessCacheSnapshotName: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeServerlessCacheSnapshotsRequest",
}) as any as S.Schema<DescribeServerlessCacheSnapshotsRequest>;
export interface DescribeServiceUpdatesMessage {
  ServiceUpdateName?: string;
  ServiceUpdateStatus?: ServiceUpdateStatusList;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeServiceUpdatesMessage = S.suspend(() =>
  S.Struct({
    ServiceUpdateName: S.optional(S.String),
    ServiceUpdateStatus: S.optional(ServiceUpdateStatusList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeServiceUpdatesMessage",
}) as any as S.Schema<DescribeServiceUpdatesMessage>;
export interface DescribeSnapshotsMessage {
  ReplicationGroupId?: string;
  CacheClusterId?: string;
  SnapshotName?: string;
  SnapshotSource?: string;
  Marker?: string;
  MaxRecords?: number;
  ShowNodeGroupConfig?: boolean;
}
export const DescribeSnapshotsMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.optional(S.String),
    CacheClusterId: S.optional(S.String),
    SnapshotName: S.optional(S.String),
    SnapshotSource: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    ShowNodeGroupConfig: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeSnapshotsMessage",
}) as any as S.Schema<DescribeSnapshotsMessage>;
export interface DescribeUserGroupsMessage {
  UserGroupId?: string;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeUserGroupsMessage = S.suspend(() =>
  S.Struct({
    UserGroupId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeUserGroupsMessage",
}) as any as S.Schema<DescribeUserGroupsMessage>;
export interface DisassociateGlobalReplicationGroupMessage {
  GlobalReplicationGroupId: string;
  ReplicationGroupId: string;
  ReplicationGroupRegion: string;
}
export const DisassociateGlobalReplicationGroupMessage = S.suspend(() =>
  S.Struct({
    GlobalReplicationGroupId: S.String,
    ReplicationGroupId: S.String,
    ReplicationGroupRegion: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DisassociateGlobalReplicationGroupMessage",
}) as any as S.Schema<DisassociateGlobalReplicationGroupMessage>;
export interface ExportServerlessCacheSnapshotRequest {
  ServerlessCacheSnapshotName: string;
  S3BucketName: string;
}
export const ExportServerlessCacheSnapshotRequest = S.suspend(() =>
  S.Struct({
    ServerlessCacheSnapshotName: S.String,
    S3BucketName: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ExportServerlessCacheSnapshotRequest",
}) as any as S.Schema<ExportServerlessCacheSnapshotRequest>;
export interface FailoverGlobalReplicationGroupMessage {
  GlobalReplicationGroupId: string;
  PrimaryRegion: string;
  PrimaryReplicationGroupId: string;
}
export const FailoverGlobalReplicationGroupMessage = S.suspend(() =>
  S.Struct({
    GlobalReplicationGroupId: S.String,
    PrimaryRegion: S.String,
    PrimaryReplicationGroupId: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "FailoverGlobalReplicationGroupMessage",
}) as any as S.Schema<FailoverGlobalReplicationGroupMessage>;
export interface ConfigureShard {
  NodeGroupId: string;
  NewReplicaCount: number;
  PreferredAvailabilityZones?: PreferredAvailabilityZoneList;
  PreferredOutpostArns?: PreferredOutpostArnList;
}
export const ConfigureShard = S.suspend(() =>
  S.Struct({
    NodeGroupId: S.String,
    NewReplicaCount: S.Number,
    PreferredAvailabilityZones: S.optional(PreferredAvailabilityZoneList),
    PreferredOutpostArns: S.optional(PreferredOutpostArnList),
  }),
).annotations({
  identifier: "ConfigureShard",
}) as any as S.Schema<ConfigureShard>;
export type ReplicaConfigurationList = ConfigureShard[];
export const ReplicaConfigurationList = S.Array(
  ConfigureShard.pipe(T.XmlName("ConfigureShard")).annotations({
    identifier: "ConfigureShard",
  }),
);
export interface IncreaseReplicaCountMessage {
  ReplicationGroupId: string;
  NewReplicaCount?: number;
  ReplicaConfiguration?: ReplicaConfigurationList;
  ApplyImmediately: boolean;
}
export const IncreaseReplicaCountMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.String,
    NewReplicaCount: S.optional(S.Number),
    ReplicaConfiguration: S.optional(ReplicaConfigurationList),
    ApplyImmediately: S.Boolean,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "IncreaseReplicaCountMessage",
}) as any as S.Schema<IncreaseReplicaCountMessage>;
export interface ListAllowedNodeTypeModificationsMessage {
  CacheClusterId?: string;
  ReplicationGroupId?: string;
}
export const ListAllowedNodeTypeModificationsMessage = S.suspend(() =>
  S.Struct({
    CacheClusterId: S.optional(S.String),
    ReplicationGroupId: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListAllowedNodeTypeModificationsMessage",
}) as any as S.Schema<ListAllowedNodeTypeModificationsMessage>;
export interface ListTagsForResourceMessage {
  ResourceName: string;
}
export const ListTagsForResourceMessage = S.suspend(() =>
  S.Struct({ ResourceName: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ListTagsForResourceMessage",
}) as any as S.Schema<ListTagsForResourceMessage>;
export interface ModifyCacheSubnetGroupMessage {
  CacheSubnetGroupName: string;
  CacheSubnetGroupDescription?: string;
  SubnetIds?: SubnetIdentifierList;
}
export const ModifyCacheSubnetGroupMessage = S.suspend(() =>
  S.Struct({
    CacheSubnetGroupName: S.String,
    CacheSubnetGroupDescription: S.optional(S.String),
    SubnetIds: S.optional(SubnetIdentifierList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyCacheSubnetGroupMessage",
}) as any as S.Schema<ModifyCacheSubnetGroupMessage>;
export interface ModifyGlobalReplicationGroupMessage {
  GlobalReplicationGroupId: string;
  ApplyImmediately: boolean;
  CacheNodeType?: string;
  Engine?: string;
  EngineVersion?: string;
  CacheParameterGroupName?: string;
  GlobalReplicationGroupDescription?: string;
  AutomaticFailoverEnabled?: boolean;
}
export const ModifyGlobalReplicationGroupMessage = S.suspend(() =>
  S.Struct({
    GlobalReplicationGroupId: S.String,
    ApplyImmediately: S.Boolean,
    CacheNodeType: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    CacheParameterGroupName: S.optional(S.String),
    GlobalReplicationGroupDescription: S.optional(S.String),
    AutomaticFailoverEnabled: S.optional(S.Boolean),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyGlobalReplicationGroupMessage",
}) as any as S.Schema<ModifyGlobalReplicationGroupMessage>;
export interface CloudWatchLogsDestinationDetails {
  LogGroup?: string;
}
export const CloudWatchLogsDestinationDetails = S.suspend(() =>
  S.Struct({ LogGroup: S.optional(S.String) }),
).annotations({
  identifier: "CloudWatchLogsDestinationDetails",
}) as any as S.Schema<CloudWatchLogsDestinationDetails>;
export interface KinesisFirehoseDestinationDetails {
  DeliveryStream?: string;
}
export const KinesisFirehoseDestinationDetails = S.suspend(() =>
  S.Struct({ DeliveryStream: S.optional(S.String) }),
).annotations({
  identifier: "KinesisFirehoseDestinationDetails",
}) as any as S.Schema<KinesisFirehoseDestinationDetails>;
export interface DestinationDetails {
  CloudWatchLogsDetails?: CloudWatchLogsDestinationDetails;
  KinesisFirehoseDetails?: KinesisFirehoseDestinationDetails;
}
export const DestinationDetails = S.suspend(() =>
  S.Struct({
    CloudWatchLogsDetails: S.optional(CloudWatchLogsDestinationDetails),
    KinesisFirehoseDetails: S.optional(KinesisFirehoseDestinationDetails),
  }),
).annotations({
  identifier: "DestinationDetails",
}) as any as S.Schema<DestinationDetails>;
export interface LogDeliveryConfigurationRequest {
  LogType?: string;
  DestinationType?: string;
  DestinationDetails?: DestinationDetails;
  LogFormat?: string;
  Enabled?: boolean;
}
export const LogDeliveryConfigurationRequest = S.suspend(() =>
  S.Struct({
    LogType: S.optional(S.String),
    DestinationType: S.optional(S.String),
    DestinationDetails: S.optional(DestinationDetails),
    LogFormat: S.optional(S.String),
    Enabled: S.optional(S.Boolean),
  }),
).annotations({
  identifier: "LogDeliveryConfigurationRequest",
}) as any as S.Schema<LogDeliveryConfigurationRequest>;
export type LogDeliveryConfigurationRequestList =
  LogDeliveryConfigurationRequest[];
export const LogDeliveryConfigurationRequestList = S.Array(
  LogDeliveryConfigurationRequest.pipe(
    T.XmlName("LogDeliveryConfigurationRequest"),
  ).annotations({ identifier: "LogDeliveryConfigurationRequest" }),
);
export interface ModifyReplicationGroupMessage {
  ReplicationGroupId: string;
  ReplicationGroupDescription?: string;
  PrimaryClusterId?: string;
  SnapshottingClusterId?: string;
  AutomaticFailoverEnabled?: boolean;
  MultiAZEnabled?: boolean;
  NodeGroupId?: string;
  CacheSecurityGroupNames?: CacheSecurityGroupNameList;
  SecurityGroupIds?: SecurityGroupIdsList;
  PreferredMaintenanceWindow?: string;
  NotificationTopicArn?: string;
  CacheParameterGroupName?: string;
  NotificationTopicStatus?: string;
  ApplyImmediately?: boolean;
  Engine?: string;
  EngineVersion?: string;
  AutoMinorVersionUpgrade?: boolean;
  SnapshotRetentionLimit?: number;
  SnapshotWindow?: string;
  CacheNodeType?: string;
  AuthToken?: string;
  AuthTokenUpdateStrategy?: string;
  UserGroupIdsToAdd?: UserGroupIdList;
  UserGroupIdsToRemove?: UserGroupIdList;
  RemoveUserGroups?: boolean;
  LogDeliveryConfigurations?: LogDeliveryConfigurationRequestList;
  IpDiscovery?: string;
  TransitEncryptionEnabled?: boolean;
  TransitEncryptionMode?: string;
  ClusterMode?: string;
}
export const ModifyReplicationGroupMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.String,
    ReplicationGroupDescription: S.optional(S.String),
    PrimaryClusterId: S.optional(S.String),
    SnapshottingClusterId: S.optional(S.String),
    AutomaticFailoverEnabled: S.optional(S.Boolean),
    MultiAZEnabled: S.optional(S.Boolean),
    NodeGroupId: S.optional(S.String),
    CacheSecurityGroupNames: S.optional(CacheSecurityGroupNameList),
    SecurityGroupIds: S.optional(SecurityGroupIdsList),
    PreferredMaintenanceWindow: S.optional(S.String),
    NotificationTopicArn: S.optional(S.String),
    CacheParameterGroupName: S.optional(S.String),
    NotificationTopicStatus: S.optional(S.String),
    ApplyImmediately: S.optional(S.Boolean),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    SnapshotRetentionLimit: S.optional(S.Number),
    SnapshotWindow: S.optional(S.String),
    CacheNodeType: S.optional(S.String),
    AuthToken: S.optional(S.String),
    AuthTokenUpdateStrategy: S.optional(S.String),
    UserGroupIdsToAdd: S.optional(UserGroupIdList),
    UserGroupIdsToRemove: S.optional(UserGroupIdList),
    RemoveUserGroups: S.optional(S.Boolean),
    LogDeliveryConfigurations: S.optional(LogDeliveryConfigurationRequestList),
    IpDiscovery: S.optional(S.String),
    TransitEncryptionEnabled: S.optional(S.Boolean),
    TransitEncryptionMode: S.optional(S.String),
    ClusterMode: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyReplicationGroupMessage",
}) as any as S.Schema<ModifyReplicationGroupMessage>;
export interface DataStorage {
  Maximum?: number;
  Minimum?: number;
  Unit: string;
}
export const DataStorage = S.suspend(() =>
  S.Struct({
    Maximum: S.optional(S.Number),
    Minimum: S.optional(S.Number),
    Unit: S.String,
  }),
).annotations({ identifier: "DataStorage" }) as any as S.Schema<DataStorage>;
export interface ECPUPerSecond {
  Maximum?: number;
  Minimum?: number;
}
export const ECPUPerSecond = S.suspend(() =>
  S.Struct({ Maximum: S.optional(S.Number), Minimum: S.optional(S.Number) }),
).annotations({
  identifier: "ECPUPerSecond",
}) as any as S.Schema<ECPUPerSecond>;
export interface CacheUsageLimits {
  DataStorage?: DataStorage;
  ECPUPerSecond?: ECPUPerSecond;
}
export const CacheUsageLimits = S.suspend(() =>
  S.Struct({
    DataStorage: S.optional(DataStorage),
    ECPUPerSecond: S.optional(ECPUPerSecond),
  }),
).annotations({
  identifier: "CacheUsageLimits",
}) as any as S.Schema<CacheUsageLimits>;
export interface ModifyServerlessCacheRequest {
  ServerlessCacheName: string;
  Description?: string;
  CacheUsageLimits?: CacheUsageLimits;
  RemoveUserGroup?: boolean;
  UserGroupId?: string;
  SecurityGroupIds?: SecurityGroupIdsList;
  SnapshotRetentionLimit?: number;
  DailySnapshotTime?: string;
  Engine?: string;
  MajorEngineVersion?: string;
}
export const ModifyServerlessCacheRequest = S.suspend(() =>
  S.Struct({
    ServerlessCacheName: S.String,
    Description: S.optional(S.String),
    CacheUsageLimits: S.optional(CacheUsageLimits),
    RemoveUserGroup: S.optional(S.Boolean),
    UserGroupId: S.optional(S.String),
    SecurityGroupIds: S.optional(SecurityGroupIdsList),
    SnapshotRetentionLimit: S.optional(S.Number),
    DailySnapshotTime: S.optional(S.String),
    Engine: S.optional(S.String),
    MajorEngineVersion: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyServerlessCacheRequest",
}) as any as S.Schema<ModifyServerlessCacheRequest>;
export interface AuthenticationMode {
  Type?: string;
  Passwords?: PasswordListInput;
}
export const AuthenticationMode = S.suspend(() =>
  S.Struct({
    Type: S.optional(S.String),
    Passwords: S.optional(PasswordListInput),
  }),
).annotations({
  identifier: "AuthenticationMode",
}) as any as S.Schema<AuthenticationMode>;
export interface ModifyUserMessage {
  UserId: string;
  AccessString?: string;
  AppendAccessString?: string;
  Passwords?: PasswordListInput;
  NoPasswordRequired?: boolean;
  AuthenticationMode?: AuthenticationMode;
  Engine?: string;
}
export const ModifyUserMessage = S.suspend(() =>
  S.Struct({
    UserId: S.String,
    AccessString: S.optional(S.String),
    AppendAccessString: S.optional(S.String),
    Passwords: S.optional(PasswordListInput),
    NoPasswordRequired: S.optional(S.Boolean),
    AuthenticationMode: S.optional(AuthenticationMode),
    Engine: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyUserMessage",
}) as any as S.Schema<ModifyUserMessage>;
export interface ModifyUserGroupMessage {
  UserGroupId: string;
  UserIdsToAdd?: UserIdListInput;
  UserIdsToRemove?: UserIdListInput;
  Engine?: string;
}
export const ModifyUserGroupMessage = S.suspend(() =>
  S.Struct({
    UserGroupId: S.String,
    UserIdsToAdd: S.optional(UserIdListInput),
    UserIdsToRemove: S.optional(UserIdListInput),
    Engine: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyUserGroupMessage",
}) as any as S.Schema<ModifyUserGroupMessage>;
export interface PurchaseReservedCacheNodesOfferingMessage {
  ReservedCacheNodesOfferingId: string;
  ReservedCacheNodeId?: string;
  CacheNodeCount?: number;
  Tags?: TagList;
}
export const PurchaseReservedCacheNodesOfferingMessage = S.suspend(() =>
  S.Struct({
    ReservedCacheNodesOfferingId: S.String,
    ReservedCacheNodeId: S.optional(S.String),
    CacheNodeCount: S.optional(S.Number),
    Tags: S.optional(TagList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "PurchaseReservedCacheNodesOfferingMessage",
}) as any as S.Schema<PurchaseReservedCacheNodesOfferingMessage>;
export interface RebalanceSlotsInGlobalReplicationGroupMessage {
  GlobalReplicationGroupId: string;
  ApplyImmediately: boolean;
}
export const RebalanceSlotsInGlobalReplicationGroupMessage = S.suspend(() =>
  S.Struct({
    GlobalReplicationGroupId: S.String,
    ApplyImmediately: S.Boolean,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RebalanceSlotsInGlobalReplicationGroupMessage",
}) as any as S.Schema<RebalanceSlotsInGlobalReplicationGroupMessage>;
export interface RebootCacheClusterMessage {
  CacheClusterId: string;
  CacheNodeIdsToReboot: CacheNodeIdsList;
}
export const RebootCacheClusterMessage = S.suspend(() =>
  S.Struct({
    CacheClusterId: S.String,
    CacheNodeIdsToReboot: CacheNodeIdsList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RebootCacheClusterMessage",
}) as any as S.Schema<RebootCacheClusterMessage>;
export interface RemoveTagsFromResourceMessage {
  ResourceName: string;
  TagKeys: KeyList;
}
export const RemoveTagsFromResourceMessage = S.suspend(() =>
  S.Struct({ ResourceName: S.String, TagKeys: KeyList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RemoveTagsFromResourceMessage",
}) as any as S.Schema<RemoveTagsFromResourceMessage>;
export interface ParameterNameValue {
  ParameterName?: string;
  ParameterValue?: string;
}
export const ParameterNameValue = S.suspend(() =>
  S.Struct({
    ParameterName: S.optional(S.String),
    ParameterValue: S.optional(S.String),
  }),
).annotations({
  identifier: "ParameterNameValue",
}) as any as S.Schema<ParameterNameValue>;
export type ParameterNameValueList = ParameterNameValue[];
export const ParameterNameValueList = S.Array(
  ParameterNameValue.pipe(T.XmlName("ParameterNameValue")).annotations({
    identifier: "ParameterNameValue",
  }),
);
export interface ResetCacheParameterGroupMessage {
  CacheParameterGroupName: string;
  ResetAllParameters?: boolean;
  ParameterNameValues?: ParameterNameValueList;
}
export const ResetCacheParameterGroupMessage = S.suspend(() =>
  S.Struct({
    CacheParameterGroupName: S.String,
    ResetAllParameters: S.optional(S.Boolean),
    ParameterNameValues: S.optional(ParameterNameValueList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ResetCacheParameterGroupMessage",
}) as any as S.Schema<ResetCacheParameterGroupMessage>;
export interface RevokeCacheSecurityGroupIngressMessage {
  CacheSecurityGroupName: string;
  EC2SecurityGroupName: string;
  EC2SecurityGroupOwnerId: string;
}
export const RevokeCacheSecurityGroupIngressMessage = S.suspend(() =>
  S.Struct({
    CacheSecurityGroupName: S.String,
    EC2SecurityGroupName: S.String,
    EC2SecurityGroupOwnerId: S.String,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "RevokeCacheSecurityGroupIngressMessage",
}) as any as S.Schema<RevokeCacheSecurityGroupIngressMessage>;
export interface TestFailoverMessage {
  ReplicationGroupId: string;
  NodeGroupId: string;
}
export const TestFailoverMessage = S.suspend(() =>
  S.Struct({ ReplicationGroupId: S.String, NodeGroupId: S.String }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestFailoverMessage",
}) as any as S.Schema<TestFailoverMessage>;
export interface CustomerNodeEndpoint {
  Address?: string;
  Port?: number;
}
export const CustomerNodeEndpoint = S.suspend(() =>
  S.Struct({ Address: S.optional(S.String), Port: S.optional(S.Number) }),
).annotations({
  identifier: "CustomerNodeEndpoint",
}) as any as S.Schema<CustomerNodeEndpoint>;
export type CustomerNodeEndpointList = CustomerNodeEndpoint[];
export const CustomerNodeEndpointList = S.Array(CustomerNodeEndpoint);
export interface TestMigrationMessage {
  ReplicationGroupId: string;
  CustomerNodeEndpointList: CustomerNodeEndpointList;
}
export const TestMigrationMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.String,
    CustomerNodeEndpointList: CustomerNodeEndpointList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "TestMigrationMessage",
}) as any as S.Schema<TestMigrationMessage>;
export type OutpostArnsList = string[];
export const OutpostArnsList = S.Array(S.String.pipe(T.XmlName("OutpostArn")));
export type FilterValueList = string[];
export const FilterValueList = S.Array(S.String);
export interface NodeGroupConfiguration {
  NodeGroupId?: string;
  Slots?: string;
  ReplicaCount?: number;
  PrimaryAvailabilityZone?: string;
  ReplicaAvailabilityZones?: AvailabilityZonesList;
  PrimaryOutpostArn?: string;
  ReplicaOutpostArns?: OutpostArnsList;
}
export const NodeGroupConfiguration = S.suspend(() =>
  S.Struct({
    NodeGroupId: S.optional(S.String),
    Slots: S.optional(S.String),
    ReplicaCount: S.optional(S.Number),
    PrimaryAvailabilityZone: S.optional(S.String),
    ReplicaAvailabilityZones: S.optional(AvailabilityZonesList),
    PrimaryOutpostArn: S.optional(S.String),
    ReplicaOutpostArns: S.optional(OutpostArnsList),
  }),
).annotations({
  identifier: "NodeGroupConfiguration",
}) as any as S.Schema<NodeGroupConfiguration>;
export type NodeGroupConfigurationList = NodeGroupConfiguration[];
export const NodeGroupConfigurationList = S.Array(
  NodeGroupConfiguration.pipe(T.XmlName("NodeGroupConfiguration")).annotations({
    identifier: "NodeGroupConfiguration",
  }),
);
export type UserIdList = string[];
export const UserIdList = S.Array(S.String);
export type UGReplicationGroupIdList = string[];
export const UGReplicationGroupIdList = S.Array(S.String);
export type UGServerlessCacheIdList = string[];
export const UGServerlessCacheIdList = S.Array(S.String);
export interface Endpoint {
  Address?: string;
  Port?: number;
}
export const Endpoint = S.suspend(() =>
  S.Struct({ Address: S.optional(S.String), Port: S.optional(S.Number) }),
).annotations({ identifier: "Endpoint" }) as any as S.Schema<Endpoint>;
export interface PendingLogDeliveryConfiguration {
  LogType?: string;
  DestinationType?: string;
  DestinationDetails?: DestinationDetails;
  LogFormat?: string;
}
export const PendingLogDeliveryConfiguration = S.suspend(() =>
  S.Struct({
    LogType: S.optional(S.String),
    DestinationType: S.optional(S.String),
    DestinationDetails: S.optional(DestinationDetails),
    LogFormat: S.optional(S.String),
  }),
).annotations({
  identifier: "PendingLogDeliveryConfiguration",
}) as any as S.Schema<PendingLogDeliveryConfiguration>;
export type PendingLogDeliveryConfigurationList =
  PendingLogDeliveryConfiguration[];
export const PendingLogDeliveryConfigurationList = S.Array(
  PendingLogDeliveryConfiguration,
);
export interface ScaleConfig {
  ScalePercentage?: number;
  ScaleIntervalMinutes?: number;
}
export const ScaleConfig = S.suspend(() =>
  S.Struct({
    ScalePercentage: S.optional(S.Number),
    ScaleIntervalMinutes: S.optional(S.Number),
  }),
).annotations({ identifier: "ScaleConfig" }) as any as S.Schema<ScaleConfig>;
export interface PendingModifiedValues {
  NumCacheNodes?: number;
  CacheNodeIdsToRemove?: CacheNodeIdsList;
  EngineVersion?: string;
  CacheNodeType?: string;
  AuthTokenStatus?: string;
  LogDeliveryConfigurations?: PendingLogDeliveryConfigurationList;
  TransitEncryptionEnabled?: boolean;
  TransitEncryptionMode?: string;
  ScaleConfig?: ScaleConfig;
}
export const PendingModifiedValues = S.suspend(() =>
  S.Struct({
    NumCacheNodes: S.optional(S.Number),
    CacheNodeIdsToRemove: S.optional(CacheNodeIdsList),
    EngineVersion: S.optional(S.String),
    CacheNodeType: S.optional(S.String),
    AuthTokenStatus: S.optional(S.String),
    LogDeliveryConfigurations: S.optional(PendingLogDeliveryConfigurationList),
    TransitEncryptionEnabled: S.optional(S.Boolean),
    TransitEncryptionMode: S.optional(S.String),
    ScaleConfig: S.optional(ScaleConfig),
  }),
).annotations({
  identifier: "PendingModifiedValues",
}) as any as S.Schema<PendingModifiedValues>;
export interface NotificationConfiguration {
  TopicArn?: string;
  TopicStatus?: string;
}
export const NotificationConfiguration = S.suspend(() =>
  S.Struct({
    TopicArn: S.optional(S.String),
    TopicStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "NotificationConfiguration",
}) as any as S.Schema<NotificationConfiguration>;
export interface CacheSecurityGroupMembership {
  CacheSecurityGroupName?: string;
  Status?: string;
}
export const CacheSecurityGroupMembership = S.suspend(() =>
  S.Struct({
    CacheSecurityGroupName: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "CacheSecurityGroupMembership",
}) as any as S.Schema<CacheSecurityGroupMembership>;
export type CacheSecurityGroupMembershipList = CacheSecurityGroupMembership[];
export const CacheSecurityGroupMembershipList = S.Array(
  CacheSecurityGroupMembership.pipe(
    T.XmlName("CacheSecurityGroup"),
  ).annotations({ identifier: "CacheSecurityGroupMembership" }),
);
export interface CacheParameterGroupStatus {
  CacheParameterGroupName?: string;
  ParameterApplyStatus?: string;
  CacheNodeIdsToReboot?: CacheNodeIdsList;
}
export const CacheParameterGroupStatus = S.suspend(() =>
  S.Struct({
    CacheParameterGroupName: S.optional(S.String),
    ParameterApplyStatus: S.optional(S.String),
    CacheNodeIdsToReboot: S.optional(CacheNodeIdsList),
  }),
).annotations({
  identifier: "CacheParameterGroupStatus",
}) as any as S.Schema<CacheParameterGroupStatus>;
export interface CacheNode {
  CacheNodeId?: string;
  CacheNodeStatus?: string;
  CacheNodeCreateTime?: Date;
  Endpoint?: Endpoint;
  ParameterGroupStatus?: string;
  SourceCacheNodeId?: string;
  CustomerAvailabilityZone?: string;
  CustomerOutpostArn?: string;
}
export const CacheNode = S.suspend(() =>
  S.Struct({
    CacheNodeId: S.optional(S.String),
    CacheNodeStatus: S.optional(S.String),
    CacheNodeCreateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    Endpoint: S.optional(Endpoint),
    ParameterGroupStatus: S.optional(S.String),
    SourceCacheNodeId: S.optional(S.String),
    CustomerAvailabilityZone: S.optional(S.String),
    CustomerOutpostArn: S.optional(S.String),
  }),
).annotations({ identifier: "CacheNode" }) as any as S.Schema<CacheNode>;
export type CacheNodeList = CacheNode[];
export const CacheNodeList = S.Array(
  CacheNode.pipe(T.XmlName("CacheNode")).annotations({
    identifier: "CacheNode",
  }),
);
export interface SecurityGroupMembership {
  SecurityGroupId?: string;
  Status?: string;
}
export const SecurityGroupMembership = S.suspend(() =>
  S.Struct({
    SecurityGroupId: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "SecurityGroupMembership",
}) as any as S.Schema<SecurityGroupMembership>;
export type SecurityGroupMembershipList = SecurityGroupMembership[];
export const SecurityGroupMembershipList = S.Array(SecurityGroupMembership);
export interface LogDeliveryConfiguration {
  LogType?: string;
  DestinationType?: string;
  DestinationDetails?: DestinationDetails;
  LogFormat?: string;
  Status?: string;
  Message?: string;
}
export const LogDeliveryConfiguration = S.suspend(() =>
  S.Struct({
    LogType: S.optional(S.String),
    DestinationType: S.optional(S.String),
    DestinationDetails: S.optional(DestinationDetails),
    LogFormat: S.optional(S.String),
    Status: S.optional(S.String),
    Message: S.optional(S.String),
  }),
).annotations({
  identifier: "LogDeliveryConfiguration",
}) as any as S.Schema<LogDeliveryConfiguration>;
export type LogDeliveryConfigurationList = LogDeliveryConfiguration[];
export const LogDeliveryConfigurationList = S.Array(
  LogDeliveryConfiguration.pipe(
    T.XmlName("LogDeliveryConfiguration"),
  ).annotations({ identifier: "LogDeliveryConfiguration" }),
);
export interface CacheCluster {
  CacheClusterId?: string;
  ConfigurationEndpoint?: Endpoint;
  ClientDownloadLandingPage?: string;
  CacheNodeType?: string;
  Engine?: string;
  EngineVersion?: string;
  CacheClusterStatus?: string;
  NumCacheNodes?: number;
  PreferredAvailabilityZone?: string;
  PreferredOutpostArn?: string;
  CacheClusterCreateTime?: Date;
  PreferredMaintenanceWindow?: string;
  PendingModifiedValues?: PendingModifiedValues;
  NotificationConfiguration?: NotificationConfiguration;
  CacheSecurityGroups?: CacheSecurityGroupMembershipList;
  CacheParameterGroup?: CacheParameterGroupStatus;
  CacheSubnetGroupName?: string;
  CacheNodes?: CacheNodeList;
  AutoMinorVersionUpgrade?: boolean;
  SecurityGroups?: SecurityGroupMembershipList;
  ReplicationGroupId?: string;
  SnapshotRetentionLimit?: number;
  SnapshotWindow?: string;
  AuthTokenEnabled?: boolean;
  AuthTokenLastModifiedDate?: Date;
  TransitEncryptionEnabled?: boolean;
  AtRestEncryptionEnabled?: boolean;
  ARN?: string;
  ReplicationGroupLogDeliveryEnabled?: boolean;
  LogDeliveryConfigurations?: LogDeliveryConfigurationList;
  NetworkType?: string;
  IpDiscovery?: string;
  TransitEncryptionMode?: string;
}
export const CacheCluster = S.suspend(() =>
  S.Struct({
    CacheClusterId: S.optional(S.String),
    ConfigurationEndpoint: S.optional(Endpoint),
    ClientDownloadLandingPage: S.optional(S.String),
    CacheNodeType: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    CacheClusterStatus: S.optional(S.String),
    NumCacheNodes: S.optional(S.Number),
    PreferredAvailabilityZone: S.optional(S.String),
    PreferredOutpostArn: S.optional(S.String),
    CacheClusterCreateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    PreferredMaintenanceWindow: S.optional(S.String),
    PendingModifiedValues: S.optional(PendingModifiedValues),
    NotificationConfiguration: S.optional(NotificationConfiguration),
    CacheSecurityGroups: S.optional(CacheSecurityGroupMembershipList),
    CacheParameterGroup: S.optional(CacheParameterGroupStatus),
    CacheSubnetGroupName: S.optional(S.String),
    CacheNodes: S.optional(CacheNodeList),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    SecurityGroups: S.optional(SecurityGroupMembershipList),
    ReplicationGroupId: S.optional(S.String),
    SnapshotRetentionLimit: S.optional(S.Number),
    SnapshotWindow: S.optional(S.String),
    AuthTokenEnabled: S.optional(S.Boolean),
    AuthTokenLastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    TransitEncryptionEnabled: S.optional(S.Boolean),
    AtRestEncryptionEnabled: S.optional(S.Boolean),
    ARN: S.optional(S.String),
    ReplicationGroupLogDeliveryEnabled: S.optional(S.Boolean),
    LogDeliveryConfigurations: S.optional(LogDeliveryConfigurationList),
    NetworkType: S.optional(S.String),
    IpDiscovery: S.optional(S.String),
    TransitEncryptionMode: S.optional(S.String),
  }),
).annotations({ identifier: "CacheCluster" }) as any as S.Schema<CacheCluster>;
export type CacheClusterList = CacheCluster[];
export const CacheClusterList = S.Array(
  CacheCluster.pipe(T.XmlName("CacheCluster")).annotations({
    identifier: "CacheCluster",
  }),
);
export interface CacheParameterGroup {
  CacheParameterGroupName?: string;
  CacheParameterGroupFamily?: string;
  Description?: string;
  IsGlobal?: boolean;
  ARN?: string;
}
export const CacheParameterGroup = S.suspend(() =>
  S.Struct({
    CacheParameterGroupName: S.optional(S.String),
    CacheParameterGroupFamily: S.optional(S.String),
    Description: S.optional(S.String),
    IsGlobal: S.optional(S.Boolean),
    ARN: S.optional(S.String),
  }),
).annotations({
  identifier: "CacheParameterGroup",
}) as any as S.Schema<CacheParameterGroup>;
export type CacheParameterGroupList = CacheParameterGroup[];
export const CacheParameterGroupList = S.Array(
  CacheParameterGroup.pipe(T.XmlName("CacheParameterGroup")).annotations({
    identifier: "CacheParameterGroup",
  }),
);
export interface EC2SecurityGroup {
  Status?: string;
  EC2SecurityGroupName?: string;
  EC2SecurityGroupOwnerId?: string;
}
export const EC2SecurityGroup = S.suspend(() =>
  S.Struct({
    Status: S.optional(S.String),
    EC2SecurityGroupName: S.optional(S.String),
    EC2SecurityGroupOwnerId: S.optional(S.String),
  }),
).annotations({
  identifier: "EC2SecurityGroup",
}) as any as S.Schema<EC2SecurityGroup>;
export type EC2SecurityGroupList = EC2SecurityGroup[];
export const EC2SecurityGroupList = S.Array(
  EC2SecurityGroup.pipe(T.XmlName("EC2SecurityGroup")).annotations({
    identifier: "EC2SecurityGroup",
  }),
);
export interface CacheSecurityGroup {
  OwnerId?: string;
  CacheSecurityGroupName?: string;
  Description?: string;
  EC2SecurityGroups?: EC2SecurityGroupList;
  ARN?: string;
}
export const CacheSecurityGroup = S.suspend(() =>
  S.Struct({
    OwnerId: S.optional(S.String),
    CacheSecurityGroupName: S.optional(S.String),
    Description: S.optional(S.String),
    EC2SecurityGroups: S.optional(EC2SecurityGroupList),
    ARN: S.optional(S.String),
  }),
).annotations({
  identifier: "CacheSecurityGroup",
}) as any as S.Schema<CacheSecurityGroup>;
export type CacheSecurityGroups = CacheSecurityGroup[];
export const CacheSecurityGroups = S.Array(
  CacheSecurityGroup.pipe(T.XmlName("CacheSecurityGroup")).annotations({
    identifier: "CacheSecurityGroup",
  }),
);
export interface AvailabilityZone {
  Name?: string;
}
export const AvailabilityZone = S.suspend(() =>
  S.Struct({ Name: S.optional(S.String) }),
).annotations({
  identifier: "AvailabilityZone",
}) as any as S.Schema<AvailabilityZone>;
export interface SubnetOutpost {
  SubnetOutpostArn?: string;
}
export const SubnetOutpost = S.suspend(() =>
  S.Struct({ SubnetOutpostArn: S.optional(S.String) }),
).annotations({
  identifier: "SubnetOutpost",
}) as any as S.Schema<SubnetOutpost>;
export type NetworkTypeList = string[];
export const NetworkTypeList = S.Array(S.String);
export interface Subnet {
  SubnetIdentifier?: string;
  SubnetAvailabilityZone?: AvailabilityZone;
  SubnetOutpost?: SubnetOutpost;
  SupportedNetworkTypes?: NetworkTypeList;
}
export const Subnet = S.suspend(() =>
  S.Struct({
    SubnetIdentifier: S.optional(S.String),
    SubnetAvailabilityZone: S.optional(AvailabilityZone),
    SubnetOutpost: S.optional(SubnetOutpost),
    SupportedNetworkTypes: S.optional(NetworkTypeList),
  }),
).annotations({ identifier: "Subnet" }) as any as S.Schema<Subnet>;
export type SubnetList = Subnet[];
export const SubnetList = S.Array(
  Subnet.pipe(T.XmlName("Subnet")).annotations({ identifier: "Subnet" }),
);
export interface CacheSubnetGroup {
  CacheSubnetGroupName?: string;
  CacheSubnetGroupDescription?: string;
  VpcId?: string;
  Subnets?: SubnetList;
  ARN?: string;
  SupportedNetworkTypes?: NetworkTypeList;
}
export const CacheSubnetGroup = S.suspend(() =>
  S.Struct({
    CacheSubnetGroupName: S.optional(S.String),
    CacheSubnetGroupDescription: S.optional(S.String),
    VpcId: S.optional(S.String),
    Subnets: S.optional(SubnetList),
    ARN: S.optional(S.String),
    SupportedNetworkTypes: S.optional(NetworkTypeList),
  }),
).annotations({
  identifier: "CacheSubnetGroup",
}) as any as S.Schema<CacheSubnetGroup>;
export type CacheSubnetGroups = CacheSubnetGroup[];
export const CacheSubnetGroups = S.Array(
  CacheSubnetGroup.pipe(T.XmlName("CacheSubnetGroup")).annotations({
    identifier: "CacheSubnetGroup",
  }),
);
export interface GlobalReplicationGroupMember {
  ReplicationGroupId?: string;
  ReplicationGroupRegion?: string;
  Role?: string;
  AutomaticFailover?: string;
  Status?: string;
}
export const GlobalReplicationGroupMember = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.optional(S.String),
    ReplicationGroupRegion: S.optional(S.String),
    Role: S.optional(S.String),
    AutomaticFailover: S.optional(S.String),
    Status: S.optional(S.String),
  }),
).annotations({
  identifier: "GlobalReplicationGroupMember",
}) as any as S.Schema<GlobalReplicationGroupMember>;
export type GlobalReplicationGroupMemberList = GlobalReplicationGroupMember[];
export const GlobalReplicationGroupMemberList = S.Array(
  GlobalReplicationGroupMember.pipe(
    T.XmlName("GlobalReplicationGroupMember"),
  ).annotations({ identifier: "GlobalReplicationGroupMember" }),
);
export interface GlobalNodeGroup {
  GlobalNodeGroupId?: string;
  Slots?: string;
}
export const GlobalNodeGroup = S.suspend(() =>
  S.Struct({
    GlobalNodeGroupId: S.optional(S.String),
    Slots: S.optional(S.String),
  }),
).annotations({
  identifier: "GlobalNodeGroup",
}) as any as S.Schema<GlobalNodeGroup>;
export type GlobalNodeGroupList = GlobalNodeGroup[];
export const GlobalNodeGroupList = S.Array(
  GlobalNodeGroup.pipe(T.XmlName("GlobalNodeGroup")).annotations({
    identifier: "GlobalNodeGroup",
  }),
);
export interface GlobalReplicationGroup {
  GlobalReplicationGroupId?: string;
  GlobalReplicationGroupDescription?: string;
  Status?: string;
  CacheNodeType?: string;
  Engine?: string;
  EngineVersion?: string;
  Members?: GlobalReplicationGroupMemberList;
  ClusterEnabled?: boolean;
  GlobalNodeGroups?: GlobalNodeGroupList;
  AuthTokenEnabled?: boolean;
  TransitEncryptionEnabled?: boolean;
  AtRestEncryptionEnabled?: boolean;
  ARN?: string;
}
export const GlobalReplicationGroup = S.suspend(() =>
  S.Struct({
    GlobalReplicationGroupId: S.optional(S.String),
    GlobalReplicationGroupDescription: S.optional(S.String),
    Status: S.optional(S.String),
    CacheNodeType: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    Members: S.optional(GlobalReplicationGroupMemberList),
    ClusterEnabled: S.optional(S.Boolean),
    GlobalNodeGroups: S.optional(GlobalNodeGroupList),
    AuthTokenEnabled: S.optional(S.Boolean),
    TransitEncryptionEnabled: S.optional(S.Boolean),
    AtRestEncryptionEnabled: S.optional(S.Boolean),
    ARN: S.optional(S.String),
  }),
).annotations({
  identifier: "GlobalReplicationGroup",
}) as any as S.Schema<GlobalReplicationGroup>;
export type GlobalReplicationGroupList = GlobalReplicationGroup[];
export const GlobalReplicationGroupList = S.Array(
  GlobalReplicationGroup.pipe(T.XmlName("GlobalReplicationGroup")).annotations({
    identifier: "GlobalReplicationGroup",
  }),
);
export interface GlobalReplicationGroupInfo {
  GlobalReplicationGroupId?: string;
  GlobalReplicationGroupMemberRole?: string;
}
export const GlobalReplicationGroupInfo = S.suspend(() =>
  S.Struct({
    GlobalReplicationGroupId: S.optional(S.String),
    GlobalReplicationGroupMemberRole: S.optional(S.String),
  }),
).annotations({
  identifier: "GlobalReplicationGroupInfo",
}) as any as S.Schema<GlobalReplicationGroupInfo>;
export interface SlotMigration {
  ProgressPercentage?: number;
}
export const SlotMigration = S.suspend(() =>
  S.Struct({ ProgressPercentage: S.optional(S.Number) }),
).annotations({
  identifier: "SlotMigration",
}) as any as S.Schema<SlotMigration>;
export interface ReshardingStatus {
  SlotMigration?: SlotMigration;
}
export const ReshardingStatus = S.suspend(() =>
  S.Struct({ SlotMigration: S.optional(SlotMigration) }),
).annotations({
  identifier: "ReshardingStatus",
}) as any as S.Schema<ReshardingStatus>;
export interface UserGroupsUpdateStatus {
  UserGroupIdsToAdd?: UserGroupIdList;
  UserGroupIdsToRemove?: UserGroupIdList;
}
export const UserGroupsUpdateStatus = S.suspend(() =>
  S.Struct({
    UserGroupIdsToAdd: S.optional(UserGroupIdList),
    UserGroupIdsToRemove: S.optional(UserGroupIdList),
  }),
).annotations({
  identifier: "UserGroupsUpdateStatus",
}) as any as S.Schema<UserGroupsUpdateStatus>;
export interface ReplicationGroupPendingModifiedValues {
  PrimaryClusterId?: string;
  AutomaticFailoverStatus?: string;
  Resharding?: ReshardingStatus;
  AuthTokenStatus?: string;
  UserGroups?: UserGroupsUpdateStatus;
  LogDeliveryConfigurations?: PendingLogDeliveryConfigurationList;
  TransitEncryptionEnabled?: boolean;
  TransitEncryptionMode?: string;
  ClusterMode?: string;
}
export const ReplicationGroupPendingModifiedValues = S.suspend(() =>
  S.Struct({
    PrimaryClusterId: S.optional(S.String),
    AutomaticFailoverStatus: S.optional(S.String),
    Resharding: S.optional(ReshardingStatus),
    AuthTokenStatus: S.optional(S.String),
    UserGroups: S.optional(UserGroupsUpdateStatus),
    LogDeliveryConfigurations: S.optional(PendingLogDeliveryConfigurationList),
    TransitEncryptionEnabled: S.optional(S.Boolean),
    TransitEncryptionMode: S.optional(S.String),
    ClusterMode: S.optional(S.String),
  }),
).annotations({
  identifier: "ReplicationGroupPendingModifiedValues",
}) as any as S.Schema<ReplicationGroupPendingModifiedValues>;
export type ClusterIdList = string[];
export const ClusterIdList = S.Array(S.String.pipe(T.XmlName("ClusterId")));
export interface NodeGroupMember {
  CacheClusterId?: string;
  CacheNodeId?: string;
  ReadEndpoint?: Endpoint;
  PreferredAvailabilityZone?: string;
  PreferredOutpostArn?: string;
  CurrentRole?: string;
}
export const NodeGroupMember = S.suspend(() =>
  S.Struct({
    CacheClusterId: S.optional(S.String),
    CacheNodeId: S.optional(S.String),
    ReadEndpoint: S.optional(Endpoint),
    PreferredAvailabilityZone: S.optional(S.String),
    PreferredOutpostArn: S.optional(S.String),
    CurrentRole: S.optional(S.String),
  }),
).annotations({
  identifier: "NodeGroupMember",
}) as any as S.Schema<NodeGroupMember>;
export type NodeGroupMemberList = NodeGroupMember[];
export const NodeGroupMemberList = S.Array(
  NodeGroupMember.pipe(T.XmlName("NodeGroupMember")).annotations({
    identifier: "NodeGroupMember",
  }),
);
export interface NodeGroup {
  NodeGroupId?: string;
  Status?: string;
  PrimaryEndpoint?: Endpoint;
  ReaderEndpoint?: Endpoint;
  Slots?: string;
  NodeGroupMembers?: NodeGroupMemberList;
}
export const NodeGroup = S.suspend(() =>
  S.Struct({
    NodeGroupId: S.optional(S.String),
    Status: S.optional(S.String),
    PrimaryEndpoint: S.optional(Endpoint),
    ReaderEndpoint: S.optional(Endpoint),
    Slots: S.optional(S.String),
    NodeGroupMembers: S.optional(NodeGroupMemberList),
  }),
).annotations({ identifier: "NodeGroup" }) as any as S.Schema<NodeGroup>;
export type NodeGroupList = NodeGroup[];
export const NodeGroupList = S.Array(
  NodeGroup.pipe(T.XmlName("NodeGroup")).annotations({
    identifier: "NodeGroup",
  }),
);
export type ReplicationGroupOutpostArnList = string[];
export const ReplicationGroupOutpostArnList = S.Array(
  S.String.pipe(T.XmlName("ReplicationGroupOutpostArn")),
);
export interface ReplicationGroup {
  ReplicationGroupId?: string;
  Description?: string;
  GlobalReplicationGroupInfo?: GlobalReplicationGroupInfo;
  Status?: string;
  PendingModifiedValues?: ReplicationGroupPendingModifiedValues;
  MemberClusters?: ClusterIdList;
  NodeGroups?: NodeGroupList;
  SnapshottingClusterId?: string;
  AutomaticFailover?: string;
  MultiAZ?: string;
  ConfigurationEndpoint?: Endpoint;
  SnapshotRetentionLimit?: number;
  SnapshotWindow?: string;
  ClusterEnabled?: boolean;
  CacheNodeType?: string;
  AuthTokenEnabled?: boolean;
  AuthTokenLastModifiedDate?: Date;
  TransitEncryptionEnabled?: boolean;
  AtRestEncryptionEnabled?: boolean;
  MemberClustersOutpostArns?: ReplicationGroupOutpostArnList;
  KmsKeyId?: string;
  ARN?: string;
  UserGroupIds?: UserGroupIdList;
  LogDeliveryConfigurations?: LogDeliveryConfigurationList;
  ReplicationGroupCreateTime?: Date;
  DataTiering?: string;
  AutoMinorVersionUpgrade?: boolean;
  NetworkType?: string;
  IpDiscovery?: string;
  TransitEncryptionMode?: string;
  ClusterMode?: string;
  Engine?: string;
}
export const ReplicationGroup = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.optional(S.String),
    Description: S.optional(S.String),
    GlobalReplicationGroupInfo: S.optional(GlobalReplicationGroupInfo),
    Status: S.optional(S.String),
    PendingModifiedValues: S.optional(ReplicationGroupPendingModifiedValues),
    MemberClusters: S.optional(ClusterIdList),
    NodeGroups: S.optional(NodeGroupList),
    SnapshottingClusterId: S.optional(S.String),
    AutomaticFailover: S.optional(S.String),
    MultiAZ: S.optional(S.String),
    ConfigurationEndpoint: S.optional(Endpoint),
    SnapshotRetentionLimit: S.optional(S.Number),
    SnapshotWindow: S.optional(S.String),
    ClusterEnabled: S.optional(S.Boolean),
    CacheNodeType: S.optional(S.String),
    AuthTokenEnabled: S.optional(S.Boolean),
    AuthTokenLastModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    TransitEncryptionEnabled: S.optional(S.Boolean),
    AtRestEncryptionEnabled: S.optional(S.Boolean),
    MemberClustersOutpostArns: S.optional(ReplicationGroupOutpostArnList),
    KmsKeyId: S.optional(S.String),
    ARN: S.optional(S.String),
    UserGroupIds: S.optional(UserGroupIdList),
    LogDeliveryConfigurations: S.optional(LogDeliveryConfigurationList),
    ReplicationGroupCreateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    DataTiering: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    IpDiscovery: S.optional(S.String),
    TransitEncryptionMode: S.optional(S.String),
    ClusterMode: S.optional(S.String),
    Engine: S.optional(S.String),
  }),
).annotations({
  identifier: "ReplicationGroup",
}) as any as S.Schema<ReplicationGroup>;
export type ReplicationGroupList = ReplicationGroup[];
export const ReplicationGroupList = S.Array(
  ReplicationGroup.pipe(T.XmlName("ReplicationGroup")).annotations({
    identifier: "ReplicationGroup",
  }),
);
export interface ServerlessCache {
  ServerlessCacheName?: string;
  Description?: string;
  CreateTime?: Date;
  Status?: string;
  Engine?: string;
  MajorEngineVersion?: string;
  FullEngineVersion?: string;
  CacheUsageLimits?: CacheUsageLimits;
  KmsKeyId?: string;
  SecurityGroupIds?: SecurityGroupIdsList;
  Endpoint?: Endpoint;
  ReaderEndpoint?: Endpoint;
  ARN?: string;
  UserGroupId?: string;
  SubnetIds?: SubnetIdsList;
  SnapshotRetentionLimit?: number;
  DailySnapshotTime?: string;
}
export const ServerlessCache = S.suspend(() =>
  S.Struct({
    ServerlessCacheName: S.optional(S.String),
    Description: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Status: S.optional(S.String),
    Engine: S.optional(S.String),
    MajorEngineVersion: S.optional(S.String),
    FullEngineVersion: S.optional(S.String),
    CacheUsageLimits: S.optional(CacheUsageLimits),
    KmsKeyId: S.optional(S.String),
    SecurityGroupIds: S.optional(SecurityGroupIdsList),
    Endpoint: S.optional(Endpoint),
    ReaderEndpoint: S.optional(Endpoint),
    ARN: S.optional(S.String),
    UserGroupId: S.optional(S.String),
    SubnetIds: S.optional(SubnetIdsList),
    SnapshotRetentionLimit: S.optional(S.Number),
    DailySnapshotTime: S.optional(S.String),
  }),
).annotations({
  identifier: "ServerlessCache",
}) as any as S.Schema<ServerlessCache>;
export type ServerlessCacheList = ServerlessCache[];
export const ServerlessCacheList = S.Array(ServerlessCache);
export interface ServerlessCacheConfiguration {
  ServerlessCacheName?: string;
  Engine?: string;
  MajorEngineVersion?: string;
}
export const ServerlessCacheConfiguration = S.suspend(() =>
  S.Struct({
    ServerlessCacheName: S.optional(S.String),
    Engine: S.optional(S.String),
    MajorEngineVersion: S.optional(S.String),
  }),
).annotations({
  identifier: "ServerlessCacheConfiguration",
}) as any as S.Schema<ServerlessCacheConfiguration>;
export interface ServerlessCacheSnapshot {
  ServerlessCacheSnapshotName?: string;
  ARN?: string;
  KmsKeyId?: string;
  SnapshotType?: string;
  Status?: string;
  CreateTime?: Date;
  ExpiryTime?: Date;
  BytesUsedForCache?: string;
  ServerlessCacheConfiguration?: ServerlessCacheConfiguration;
}
export const ServerlessCacheSnapshot = S.suspend(() =>
  S.Struct({
    ServerlessCacheSnapshotName: S.optional(S.String),
    ARN: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    Status: S.optional(S.String),
    CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    ExpiryTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    BytesUsedForCache: S.optional(S.String),
    ServerlessCacheConfiguration: S.optional(ServerlessCacheConfiguration),
  }),
).annotations({
  identifier: "ServerlessCacheSnapshot",
}) as any as S.Schema<ServerlessCacheSnapshot>;
export type ServerlessCacheSnapshotList = ServerlessCacheSnapshot[];
export const ServerlessCacheSnapshotList = S.Array(
  ServerlessCacheSnapshot.pipe(
    T.XmlName("ServerlessCacheSnapshot"),
  ).annotations({ identifier: "ServerlessCacheSnapshot" }),
);
export interface NodeSnapshot {
  CacheClusterId?: string;
  NodeGroupId?: string;
  CacheNodeId?: string;
  NodeGroupConfiguration?: NodeGroupConfiguration;
  CacheSize?: string;
  CacheNodeCreateTime?: Date;
  SnapshotCreateTime?: Date;
}
export const NodeSnapshot = S.suspend(() =>
  S.Struct({
    CacheClusterId: S.optional(S.String),
    NodeGroupId: S.optional(S.String),
    CacheNodeId: S.optional(S.String),
    NodeGroupConfiguration: S.optional(NodeGroupConfiguration),
    CacheSize: S.optional(S.String),
    CacheNodeCreateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    SnapshotCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "NodeSnapshot" }) as any as S.Schema<NodeSnapshot>;
export type NodeSnapshotList = NodeSnapshot[];
export const NodeSnapshotList = S.Array(
  NodeSnapshot.pipe(T.XmlName("NodeSnapshot")).annotations({
    identifier: "NodeSnapshot",
  }),
);
export interface Snapshot {
  SnapshotName?: string;
  ReplicationGroupId?: string;
  ReplicationGroupDescription?: string;
  CacheClusterId?: string;
  SnapshotStatus?: string;
  SnapshotSource?: string;
  CacheNodeType?: string;
  Engine?: string;
  EngineVersion?: string;
  NumCacheNodes?: number;
  PreferredAvailabilityZone?: string;
  PreferredOutpostArn?: string;
  CacheClusterCreateTime?: Date;
  PreferredMaintenanceWindow?: string;
  TopicArn?: string;
  Port?: number;
  CacheParameterGroupName?: string;
  CacheSubnetGroupName?: string;
  VpcId?: string;
  AutoMinorVersionUpgrade?: boolean;
  SnapshotRetentionLimit?: number;
  SnapshotWindow?: string;
  NumNodeGroups?: number;
  AutomaticFailover?: string;
  NodeSnapshots?: NodeSnapshotList;
  KmsKeyId?: string;
  ARN?: string;
  DataTiering?: string;
}
export const Snapshot = S.suspend(() =>
  S.Struct({
    SnapshotName: S.optional(S.String),
    ReplicationGroupId: S.optional(S.String),
    ReplicationGroupDescription: S.optional(S.String),
    CacheClusterId: S.optional(S.String),
    SnapshotStatus: S.optional(S.String),
    SnapshotSource: S.optional(S.String),
    CacheNodeType: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    NumCacheNodes: S.optional(S.Number),
    PreferredAvailabilityZone: S.optional(S.String),
    PreferredOutpostArn: S.optional(S.String),
    CacheClusterCreateTime: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    PreferredMaintenanceWindow: S.optional(S.String),
    TopicArn: S.optional(S.String),
    Port: S.optional(S.Number),
    CacheParameterGroupName: S.optional(S.String),
    CacheSubnetGroupName: S.optional(S.String),
    VpcId: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    SnapshotRetentionLimit: S.optional(S.Number),
    SnapshotWindow: S.optional(S.String),
    NumNodeGroups: S.optional(S.Number),
    AutomaticFailover: S.optional(S.String),
    NodeSnapshots: S.optional(NodeSnapshotList),
    KmsKeyId: S.optional(S.String),
    ARN: S.optional(S.String),
    DataTiering: S.optional(S.String),
  }),
).annotations({ identifier: "Snapshot" }) as any as S.Schema<Snapshot>;
export type SnapshotList = Snapshot[];
export const SnapshotList = S.Array(
  Snapshot.pipe(T.XmlName("Snapshot")).annotations({ identifier: "Snapshot" }),
);
export interface TimeRangeFilter {
  StartTime?: Date;
  EndTime?: Date;
}
export const TimeRangeFilter = S.suspend(() =>
  S.Struct({
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({
  identifier: "TimeRangeFilter",
}) as any as S.Schema<TimeRangeFilter>;
export interface UserGroupPendingChanges {
  UserIdsToRemove?: UserIdList;
  UserIdsToAdd?: UserIdList;
}
export const UserGroupPendingChanges = S.suspend(() =>
  S.Struct({
    UserIdsToRemove: S.optional(UserIdList),
    UserIdsToAdd: S.optional(UserIdList),
  }),
).annotations({
  identifier: "UserGroupPendingChanges",
}) as any as S.Schema<UserGroupPendingChanges>;
export interface UserGroup {
  UserGroupId?: string;
  Status?: string;
  Engine?: string;
  UserIds?: UserIdList;
  MinimumEngineVersion?: string;
  PendingChanges?: UserGroupPendingChanges;
  ReplicationGroups?: UGReplicationGroupIdList;
  ServerlessCaches?: UGServerlessCacheIdList;
  ARN?: string;
}
export const UserGroup = S.suspend(() =>
  S.Struct({
    UserGroupId: S.optional(S.String),
    Status: S.optional(S.String),
    Engine: S.optional(S.String),
    UserIds: S.optional(UserIdList),
    MinimumEngineVersion: S.optional(S.String),
    PendingChanges: S.optional(UserGroupPendingChanges),
    ReplicationGroups: S.optional(UGReplicationGroupIdList),
    ServerlessCaches: S.optional(UGServerlessCacheIdList),
    ARN: S.optional(S.String),
  }).pipe(ns),
).annotations({ identifier: "UserGroup" }) as any as S.Schema<UserGroup>;
export type UserGroupList = UserGroup[];
export const UserGroupList = S.Array(UserGroup);
export interface Filter {
  Name: string;
  Values: FilterValueList;
}
export const Filter = S.suspend(() =>
  S.Struct({ Name: S.String, Values: FilterValueList }),
).annotations({ identifier: "Filter" }) as any as S.Schema<Filter>;
export type FilterList = Filter[];
export const FilterList = S.Array(Filter);
export interface ReshardingConfiguration {
  NodeGroupId?: string;
  PreferredAvailabilityZones?: AvailabilityZonesList;
}
export const ReshardingConfiguration = S.suspend(() =>
  S.Struct({
    NodeGroupId: S.optional(S.String),
    PreferredAvailabilityZones: S.optional(AvailabilityZonesList),
  }),
).annotations({
  identifier: "ReshardingConfiguration",
}) as any as S.Schema<ReshardingConfiguration>;
export type ReshardingConfigurationList = ReshardingConfiguration[];
export const ReshardingConfigurationList = S.Array(
  ReshardingConfiguration.pipe(
    T.XmlName("ReshardingConfiguration"),
  ).annotations({ identifier: "ReshardingConfiguration" }),
);
export interface RegionalConfiguration {
  ReplicationGroupId: string;
  ReplicationGroupRegion: string;
  ReshardingConfiguration: ReshardingConfigurationList;
}
export const RegionalConfiguration = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.String,
    ReplicationGroupRegion: S.String,
    ReshardingConfiguration: ReshardingConfigurationList,
  }),
).annotations({
  identifier: "RegionalConfiguration",
}) as any as S.Schema<RegionalConfiguration>;
export type RegionalConfigurationList = RegionalConfiguration[];
export const RegionalConfigurationList = S.Array(
  RegionalConfiguration.pipe(T.XmlName("RegionalConfiguration")).annotations({
    identifier: "RegionalConfiguration",
  }),
);
export type NodeTypeList = string[];
export const NodeTypeList = S.Array(S.String);
export interface AddTagsToResourceMessage {
  ResourceName: string;
  Tags: TagList;
}
export const AddTagsToResourceMessage = S.suspend(() =>
  S.Struct({ ResourceName: S.String, Tags: TagList }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "AddTagsToResourceMessage",
}) as any as S.Schema<AddTagsToResourceMessage>;
export interface CreateCacheSecurityGroupResult {
  CacheSecurityGroup?: CacheSecurityGroup;
}
export const CreateCacheSecurityGroupResult = S.suspend(() =>
  S.Struct({ CacheSecurityGroup: S.optional(CacheSecurityGroup) }).pipe(ns),
).annotations({
  identifier: "CreateCacheSecurityGroupResult",
}) as any as S.Schema<CreateCacheSecurityGroupResult>;
export interface CreateReplicationGroupMessage {
  ReplicationGroupId: string;
  ReplicationGroupDescription: string;
  GlobalReplicationGroupId?: string;
  PrimaryClusterId?: string;
  AutomaticFailoverEnabled?: boolean;
  MultiAZEnabled?: boolean;
  NumCacheClusters?: number;
  PreferredCacheClusterAZs?: AvailabilityZonesList;
  NumNodeGroups?: number;
  ReplicasPerNodeGroup?: number;
  NodeGroupConfiguration?: NodeGroupConfigurationList;
  CacheNodeType?: string;
  Engine?: string;
  EngineVersion?: string;
  CacheParameterGroupName?: string;
  CacheSubnetGroupName?: string;
  CacheSecurityGroupNames?: CacheSecurityGroupNameList;
  SecurityGroupIds?: SecurityGroupIdsList;
  Tags?: TagList;
  SnapshotArns?: SnapshotArnsList;
  SnapshotName?: string;
  PreferredMaintenanceWindow?: string;
  Port?: number;
  NotificationTopicArn?: string;
  AutoMinorVersionUpgrade?: boolean;
  SnapshotRetentionLimit?: number;
  SnapshotWindow?: string;
  AuthToken?: string;
  TransitEncryptionEnabled?: boolean;
  AtRestEncryptionEnabled?: boolean;
  KmsKeyId?: string;
  UserGroupIds?: UserGroupIdListInput;
  LogDeliveryConfigurations?: LogDeliveryConfigurationRequestList;
  DataTieringEnabled?: boolean;
  NetworkType?: string;
  IpDiscovery?: string;
  TransitEncryptionMode?: string;
  ClusterMode?: string;
  ServerlessCacheSnapshotName?: string;
}
export const CreateReplicationGroupMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.String,
    ReplicationGroupDescription: S.String,
    GlobalReplicationGroupId: S.optional(S.String),
    PrimaryClusterId: S.optional(S.String),
    AutomaticFailoverEnabled: S.optional(S.Boolean),
    MultiAZEnabled: S.optional(S.Boolean),
    NumCacheClusters: S.optional(S.Number),
    PreferredCacheClusterAZs: S.optional(AvailabilityZonesList),
    NumNodeGroups: S.optional(S.Number),
    ReplicasPerNodeGroup: S.optional(S.Number),
    NodeGroupConfiguration: S.optional(NodeGroupConfigurationList),
    CacheNodeType: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    CacheParameterGroupName: S.optional(S.String),
    CacheSubnetGroupName: S.optional(S.String),
    CacheSecurityGroupNames: S.optional(CacheSecurityGroupNameList),
    SecurityGroupIds: S.optional(SecurityGroupIdsList),
    Tags: S.optional(TagList),
    SnapshotArns: S.optional(SnapshotArnsList),
    SnapshotName: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    Port: S.optional(S.Number),
    NotificationTopicArn: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    SnapshotRetentionLimit: S.optional(S.Number),
    SnapshotWindow: S.optional(S.String),
    AuthToken: S.optional(S.String),
    TransitEncryptionEnabled: S.optional(S.Boolean),
    AtRestEncryptionEnabled: S.optional(S.Boolean),
    KmsKeyId: S.optional(S.String),
    UserGroupIds: S.optional(UserGroupIdListInput),
    LogDeliveryConfigurations: S.optional(LogDeliveryConfigurationRequestList),
    DataTieringEnabled: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    IpDiscovery: S.optional(S.String),
    TransitEncryptionMode: S.optional(S.String),
    ClusterMode: S.optional(S.String),
    ServerlessCacheSnapshotName: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateReplicationGroupMessage",
}) as any as S.Schema<CreateReplicationGroupMessage>;
export interface CreateServerlessCacheSnapshotResponse {
  ServerlessCacheSnapshot?: ServerlessCacheSnapshot;
}
export const CreateServerlessCacheSnapshotResponse = S.suspend(() =>
  S.Struct({
    ServerlessCacheSnapshot: S.optional(ServerlessCacheSnapshot),
  }).pipe(ns),
).annotations({
  identifier: "CreateServerlessCacheSnapshotResponse",
}) as any as S.Schema<CreateServerlessCacheSnapshotResponse>;
export interface CreateSnapshotResult {
  Snapshot?: Snapshot;
}
export const CreateSnapshotResult = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }).pipe(ns),
).annotations({
  identifier: "CreateSnapshotResult",
}) as any as S.Schema<CreateSnapshotResult>;
export interface CreateUserMessage {
  UserId: string;
  UserName: string;
  Engine: string;
  Passwords?: PasswordListInput;
  AccessString: string;
  NoPasswordRequired?: boolean;
  Tags?: TagList;
  AuthenticationMode?: AuthenticationMode;
}
export const CreateUserMessage = S.suspend(() =>
  S.Struct({
    UserId: S.String,
    UserName: S.String,
    Engine: S.String,
    Passwords: S.optional(PasswordListInput),
    AccessString: S.String,
    NoPasswordRequired: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    AuthenticationMode: S.optional(AuthenticationMode),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateUserMessage",
}) as any as S.Schema<CreateUserMessage>;
export interface DecreaseNodeGroupsInGlobalReplicationGroupResult {
  GlobalReplicationGroup?: GlobalReplicationGroup;
}
export const DecreaseNodeGroupsInGlobalReplicationGroupResult = S.suspend(() =>
  S.Struct({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DecreaseNodeGroupsInGlobalReplicationGroupResult",
}) as any as S.Schema<DecreaseNodeGroupsInGlobalReplicationGroupResult>;
export interface DecreaseReplicaCountMessage {
  ReplicationGroupId: string;
  NewReplicaCount?: number;
  ReplicaConfiguration?: ReplicaConfigurationList;
  ReplicasToRemove?: RemoveReplicasList;
  ApplyImmediately: boolean;
}
export const DecreaseReplicaCountMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.String,
    NewReplicaCount: S.optional(S.Number),
    ReplicaConfiguration: S.optional(ReplicaConfigurationList),
    ReplicasToRemove: S.optional(RemoveReplicasList),
    ApplyImmediately: S.Boolean,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DecreaseReplicaCountMessage",
}) as any as S.Schema<DecreaseReplicaCountMessage>;
export interface DeleteGlobalReplicationGroupResult {
  GlobalReplicationGroup?: GlobalReplicationGroup;
}
export const DeleteGlobalReplicationGroupResult = S.suspend(() =>
  S.Struct({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DeleteGlobalReplicationGroupResult",
}) as any as S.Schema<DeleteGlobalReplicationGroupResult>;
export interface DeleteReplicationGroupResult {
  ReplicationGroup?: ReplicationGroup;
}
export const DeleteReplicationGroupResult = S.suspend(() =>
  S.Struct({ ReplicationGroup: S.optional(ReplicationGroup) }).pipe(ns),
).annotations({
  identifier: "DeleteReplicationGroupResult",
}) as any as S.Schema<DeleteReplicationGroupResult>;
export interface DeleteServerlessCacheSnapshotResponse {
  ServerlessCacheSnapshot?: ServerlessCacheSnapshot;
}
export const DeleteServerlessCacheSnapshotResponse = S.suspend(() =>
  S.Struct({
    ServerlessCacheSnapshot: S.optional(ServerlessCacheSnapshot),
  }).pipe(ns),
).annotations({
  identifier: "DeleteServerlessCacheSnapshotResponse",
}) as any as S.Schema<DeleteServerlessCacheSnapshotResponse>;
export interface DeleteSnapshotResult {
  Snapshot?: Snapshot;
}
export const DeleteSnapshotResult = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }).pipe(ns),
).annotations({
  identifier: "DeleteSnapshotResult",
}) as any as S.Schema<DeleteSnapshotResult>;
export interface CacheClusterMessage {
  Marker?: string;
  CacheClusters?: CacheClusterList;
}
export const CacheClusterMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    CacheClusters: S.optional(CacheClusterList),
  }).pipe(ns),
).annotations({
  identifier: "CacheClusterMessage",
}) as any as S.Schema<CacheClusterMessage>;
export interface CacheParameterGroupsMessage {
  Marker?: string;
  CacheParameterGroups?: CacheParameterGroupList;
}
export const CacheParameterGroupsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    CacheParameterGroups: S.optional(CacheParameterGroupList),
  }).pipe(ns),
).annotations({
  identifier: "CacheParameterGroupsMessage",
}) as any as S.Schema<CacheParameterGroupsMessage>;
export interface CacheSecurityGroupMessage {
  Marker?: string;
  CacheSecurityGroups?: CacheSecurityGroups;
}
export const CacheSecurityGroupMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    CacheSecurityGroups: S.optional(CacheSecurityGroups),
  }).pipe(ns),
).annotations({
  identifier: "CacheSecurityGroupMessage",
}) as any as S.Schema<CacheSecurityGroupMessage>;
export interface CacheSubnetGroupMessage {
  Marker?: string;
  CacheSubnetGroups?: CacheSubnetGroups;
}
export const CacheSubnetGroupMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    CacheSubnetGroups: S.optional(CacheSubnetGroups),
  }).pipe(ns),
).annotations({
  identifier: "CacheSubnetGroupMessage",
}) as any as S.Schema<CacheSubnetGroupMessage>;
export interface DescribeGlobalReplicationGroupsResult {
  Marker?: string;
  GlobalReplicationGroups?: GlobalReplicationGroupList;
}
export const DescribeGlobalReplicationGroupsResult = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    GlobalReplicationGroups: S.optional(GlobalReplicationGroupList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeGlobalReplicationGroupsResult",
}) as any as S.Schema<DescribeGlobalReplicationGroupsResult>;
export interface ReplicationGroupMessage {
  Marker?: string;
  ReplicationGroups?: ReplicationGroupList;
}
export const ReplicationGroupMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ReplicationGroups: S.optional(ReplicationGroupList),
  }).pipe(ns),
).annotations({
  identifier: "ReplicationGroupMessage",
}) as any as S.Schema<ReplicationGroupMessage>;
export interface DescribeServerlessCachesResponse {
  NextToken?: string;
  ServerlessCaches?: ServerlessCacheList;
}
export const DescribeServerlessCachesResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ServerlessCaches: S.optional(ServerlessCacheList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeServerlessCachesResponse",
}) as any as S.Schema<DescribeServerlessCachesResponse>;
export interface DescribeServerlessCacheSnapshotsResponse {
  NextToken?: string;
  ServerlessCacheSnapshots?: ServerlessCacheSnapshotList;
}
export const DescribeServerlessCacheSnapshotsResponse = S.suspend(() =>
  S.Struct({
    NextToken: S.optional(S.String),
    ServerlessCacheSnapshots: S.optional(ServerlessCacheSnapshotList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeServerlessCacheSnapshotsResponse",
}) as any as S.Schema<DescribeServerlessCacheSnapshotsResponse>;
export interface DescribeSnapshotsListMessage {
  Marker?: string;
  Snapshots?: SnapshotList;
}
export const DescribeSnapshotsListMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    Snapshots: S.optional(SnapshotList),
  }).pipe(ns),
).annotations({
  identifier: "DescribeSnapshotsListMessage",
}) as any as S.Schema<DescribeSnapshotsListMessage>;
export interface DescribeUpdateActionsMessage {
  ServiceUpdateName?: string;
  ReplicationGroupIds?: ReplicationGroupIdList;
  CacheClusterIds?: CacheClusterIdList;
  Engine?: string;
  ServiceUpdateStatus?: ServiceUpdateStatusList;
  ServiceUpdateTimeRange?: TimeRangeFilter;
  UpdateActionStatus?: UpdateActionStatusList;
  ShowNodeLevelUpdateStatus?: boolean;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeUpdateActionsMessage = S.suspend(() =>
  S.Struct({
    ServiceUpdateName: S.optional(S.String),
    ReplicationGroupIds: S.optional(ReplicationGroupIdList),
    CacheClusterIds: S.optional(CacheClusterIdList),
    Engine: S.optional(S.String),
    ServiceUpdateStatus: S.optional(ServiceUpdateStatusList),
    ServiceUpdateTimeRange: S.optional(TimeRangeFilter),
    UpdateActionStatus: S.optional(UpdateActionStatusList),
    ShowNodeLevelUpdateStatus: S.optional(S.Boolean),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeUpdateActionsMessage",
}) as any as S.Schema<DescribeUpdateActionsMessage>;
export interface DescribeUserGroupsResult {
  UserGroups?: UserGroupList;
  Marker?: string;
}
export const DescribeUserGroupsResult = S.suspend(() =>
  S.Struct({
    UserGroups: S.optional(UserGroupList),
    Marker: S.optional(S.String),
  }).pipe(ns),
).annotations({
  identifier: "DescribeUserGroupsResult",
}) as any as S.Schema<DescribeUserGroupsResult>;
export interface DescribeUsersMessage {
  Engine?: string;
  UserId?: string;
  Filters?: FilterList;
  MaxRecords?: number;
  Marker?: string;
}
export const DescribeUsersMessage = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    UserId: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "DescribeUsersMessage",
}) as any as S.Schema<DescribeUsersMessage>;
export interface DisassociateGlobalReplicationGroupResult {
  GlobalReplicationGroup?: GlobalReplicationGroup;
}
export const DisassociateGlobalReplicationGroupResult = S.suspend(() =>
  S.Struct({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DisassociateGlobalReplicationGroupResult",
}) as any as S.Schema<DisassociateGlobalReplicationGroupResult>;
export interface ExportServerlessCacheSnapshotResponse {
  ServerlessCacheSnapshot?: ServerlessCacheSnapshot;
}
export const ExportServerlessCacheSnapshotResponse = S.suspend(() =>
  S.Struct({
    ServerlessCacheSnapshot: S.optional(ServerlessCacheSnapshot),
  }).pipe(ns),
).annotations({
  identifier: "ExportServerlessCacheSnapshotResponse",
}) as any as S.Schema<ExportServerlessCacheSnapshotResponse>;
export interface FailoverGlobalReplicationGroupResult {
  GlobalReplicationGroup?: GlobalReplicationGroup;
}
export const FailoverGlobalReplicationGroupResult = S.suspend(() =>
  S.Struct({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }).pipe(
    ns,
  ),
).annotations({
  identifier: "FailoverGlobalReplicationGroupResult",
}) as any as S.Schema<FailoverGlobalReplicationGroupResult>;
export interface IncreaseNodeGroupsInGlobalReplicationGroupMessage {
  GlobalReplicationGroupId: string;
  NodeGroupCount: number;
  RegionalConfigurations?: RegionalConfigurationList;
  ApplyImmediately: boolean;
}
export const IncreaseNodeGroupsInGlobalReplicationGroupMessage = S.suspend(() =>
  S.Struct({
    GlobalReplicationGroupId: S.String,
    NodeGroupCount: S.Number,
    RegionalConfigurations: S.optional(RegionalConfigurationList),
    ApplyImmediately: S.Boolean,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "IncreaseNodeGroupsInGlobalReplicationGroupMessage",
}) as any as S.Schema<IncreaseNodeGroupsInGlobalReplicationGroupMessage>;
export interface IncreaseReplicaCountResult {
  ReplicationGroup?: ReplicationGroup;
}
export const IncreaseReplicaCountResult = S.suspend(() =>
  S.Struct({ ReplicationGroup: S.optional(ReplicationGroup) }).pipe(ns),
).annotations({
  identifier: "IncreaseReplicaCountResult",
}) as any as S.Schema<IncreaseReplicaCountResult>;
export interface AllowedNodeTypeModificationsMessage {
  ScaleUpModifications?: NodeTypeList;
  ScaleDownModifications?: NodeTypeList;
}
export const AllowedNodeTypeModificationsMessage = S.suspend(() =>
  S.Struct({
    ScaleUpModifications: S.optional(NodeTypeList),
    ScaleDownModifications: S.optional(NodeTypeList),
  }).pipe(ns),
).annotations({
  identifier: "AllowedNodeTypeModificationsMessage",
}) as any as S.Schema<AllowedNodeTypeModificationsMessage>;
export interface TagListMessage {
  TagList?: TagList;
}
export const TagListMessage = S.suspend(() =>
  S.Struct({ TagList: S.optional(TagList) }).pipe(ns),
).annotations({
  identifier: "TagListMessage",
}) as any as S.Schema<TagListMessage>;
export interface ModifyCacheClusterMessage {
  CacheClusterId: string;
  NumCacheNodes?: number;
  CacheNodeIdsToRemove?: CacheNodeIdsList;
  AZMode?: string;
  NewAvailabilityZones?: PreferredAvailabilityZoneList;
  CacheSecurityGroupNames?: CacheSecurityGroupNameList;
  SecurityGroupIds?: SecurityGroupIdsList;
  PreferredMaintenanceWindow?: string;
  NotificationTopicArn?: string;
  CacheParameterGroupName?: string;
  NotificationTopicStatus?: string;
  ApplyImmediately?: boolean;
  Engine?: string;
  EngineVersion?: string;
  AutoMinorVersionUpgrade?: boolean;
  SnapshotRetentionLimit?: number;
  SnapshotWindow?: string;
  CacheNodeType?: string;
  AuthToken?: string;
  AuthTokenUpdateStrategy?: string;
  LogDeliveryConfigurations?: LogDeliveryConfigurationRequestList;
  IpDiscovery?: string;
  ScaleConfig?: ScaleConfig;
}
export const ModifyCacheClusterMessage = S.suspend(() =>
  S.Struct({
    CacheClusterId: S.String,
    NumCacheNodes: S.optional(S.Number),
    CacheNodeIdsToRemove: S.optional(CacheNodeIdsList),
    AZMode: S.optional(S.String),
    NewAvailabilityZones: S.optional(PreferredAvailabilityZoneList),
    CacheSecurityGroupNames: S.optional(CacheSecurityGroupNameList),
    SecurityGroupIds: S.optional(SecurityGroupIdsList),
    PreferredMaintenanceWindow: S.optional(S.String),
    NotificationTopicArn: S.optional(S.String),
    CacheParameterGroupName: S.optional(S.String),
    NotificationTopicStatus: S.optional(S.String),
    ApplyImmediately: S.optional(S.Boolean),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    SnapshotRetentionLimit: S.optional(S.Number),
    SnapshotWindow: S.optional(S.String),
    CacheNodeType: S.optional(S.String),
    AuthToken: S.optional(S.String),
    AuthTokenUpdateStrategy: S.optional(S.String),
    LogDeliveryConfigurations: S.optional(LogDeliveryConfigurationRequestList),
    IpDiscovery: S.optional(S.String),
    ScaleConfig: S.optional(ScaleConfig),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyCacheClusterMessage",
}) as any as S.Schema<ModifyCacheClusterMessage>;
export interface ModifyCacheParameterGroupMessage {
  CacheParameterGroupName: string;
  ParameterNameValues: ParameterNameValueList;
}
export const ModifyCacheParameterGroupMessage = S.suspend(() =>
  S.Struct({
    CacheParameterGroupName: S.String,
    ParameterNameValues: ParameterNameValueList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyCacheParameterGroupMessage",
}) as any as S.Schema<ModifyCacheParameterGroupMessage>;
export interface ModifyCacheSubnetGroupResult {
  CacheSubnetGroup?: CacheSubnetGroup;
}
export const ModifyCacheSubnetGroupResult = S.suspend(() =>
  S.Struct({ CacheSubnetGroup: S.optional(CacheSubnetGroup) }).pipe(ns),
).annotations({
  identifier: "ModifyCacheSubnetGroupResult",
}) as any as S.Schema<ModifyCacheSubnetGroupResult>;
export interface ModifyGlobalReplicationGroupResult {
  GlobalReplicationGroup?: GlobalReplicationGroup;
}
export const ModifyGlobalReplicationGroupResult = S.suspend(() =>
  S.Struct({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }).pipe(
    ns,
  ),
).annotations({
  identifier: "ModifyGlobalReplicationGroupResult",
}) as any as S.Schema<ModifyGlobalReplicationGroupResult>;
export interface ModifyReplicationGroupResult {
  ReplicationGroup?: ReplicationGroup;
}
export const ModifyReplicationGroupResult = S.suspend(() =>
  S.Struct({ ReplicationGroup: S.optional(ReplicationGroup) }).pipe(ns),
).annotations({
  identifier: "ModifyReplicationGroupResult",
}) as any as S.Schema<ModifyReplicationGroupResult>;
export interface ModifyReplicationGroupShardConfigurationMessage {
  ReplicationGroupId: string;
  NodeGroupCount: number;
  ApplyImmediately: boolean;
  ReshardingConfiguration?: ReshardingConfigurationList;
  NodeGroupsToRemove?: NodeGroupsToRemoveList;
  NodeGroupsToRetain?: NodeGroupsToRetainList;
}
export const ModifyReplicationGroupShardConfigurationMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.String,
    NodeGroupCount: S.Number,
    ApplyImmediately: S.Boolean,
    ReshardingConfiguration: S.optional(ReshardingConfigurationList),
    NodeGroupsToRemove: S.optional(NodeGroupsToRemoveList),
    NodeGroupsToRetain: S.optional(NodeGroupsToRetainList),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "ModifyReplicationGroupShardConfigurationMessage",
}) as any as S.Schema<ModifyReplicationGroupShardConfigurationMessage>;
export interface ModifyServerlessCacheResponse {
  ServerlessCache?: ServerlessCache;
}
export const ModifyServerlessCacheResponse = S.suspend(() =>
  S.Struct({ ServerlessCache: S.optional(ServerlessCache) }).pipe(ns),
).annotations({
  identifier: "ModifyServerlessCacheResponse",
}) as any as S.Schema<ModifyServerlessCacheResponse>;
export interface RecurringCharge {
  RecurringChargeAmount?: number;
  RecurringChargeFrequency?: string;
}
export const RecurringCharge = S.suspend(() =>
  S.Struct({
    RecurringChargeAmount: S.optional(S.Number),
    RecurringChargeFrequency: S.optional(S.String),
  }),
).annotations({
  identifier: "RecurringCharge",
}) as any as S.Schema<RecurringCharge>;
export type RecurringChargeList = RecurringCharge[];
export const RecurringChargeList = S.Array(
  RecurringCharge.pipe(T.XmlName("RecurringCharge")).annotations({
    identifier: "RecurringCharge",
  }),
);
export interface ReservedCacheNode {
  ReservedCacheNodeId?: string;
  ReservedCacheNodesOfferingId?: string;
  CacheNodeType?: string;
  StartTime?: Date;
  Duration?: number;
  FixedPrice?: number;
  UsagePrice?: number;
  CacheNodeCount?: number;
  ProductDescription?: string;
  OfferingType?: string;
  State?: string;
  RecurringCharges?: RecurringChargeList;
  ReservationARN?: string;
}
export const ReservedCacheNode = S.suspend(() =>
  S.Struct({
    ReservedCacheNodeId: S.optional(S.String),
    ReservedCacheNodesOfferingId: S.optional(S.String),
    CacheNodeType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Duration: S.optional(S.Number),
    FixedPrice: S.optional(S.Number),
    UsagePrice: S.optional(S.Number),
    CacheNodeCount: S.optional(S.Number),
    ProductDescription: S.optional(S.String),
    OfferingType: S.optional(S.String),
    State: S.optional(S.String),
    RecurringCharges: S.optional(RecurringChargeList),
    ReservationARN: S.optional(S.String),
  }),
).annotations({
  identifier: "ReservedCacheNode",
}) as any as S.Schema<ReservedCacheNode>;
export interface PurchaseReservedCacheNodesOfferingResult {
  ReservedCacheNode?: ReservedCacheNode;
}
export const PurchaseReservedCacheNodesOfferingResult = S.suspend(() =>
  S.Struct({ ReservedCacheNode: S.optional(ReservedCacheNode) }).pipe(ns),
).annotations({
  identifier: "PurchaseReservedCacheNodesOfferingResult",
}) as any as S.Schema<PurchaseReservedCacheNodesOfferingResult>;
export interface RebalanceSlotsInGlobalReplicationGroupResult {
  GlobalReplicationGroup?: GlobalReplicationGroup;
}
export const RebalanceSlotsInGlobalReplicationGroupResult = S.suspend(() =>
  S.Struct({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }).pipe(
    ns,
  ),
).annotations({
  identifier: "RebalanceSlotsInGlobalReplicationGroupResult",
}) as any as S.Schema<RebalanceSlotsInGlobalReplicationGroupResult>;
export interface RebootCacheClusterResult {
  CacheCluster?: CacheCluster;
}
export const RebootCacheClusterResult = S.suspend(() =>
  S.Struct({ CacheCluster: S.optional(CacheCluster) }).pipe(ns),
).annotations({
  identifier: "RebootCacheClusterResult",
}) as any as S.Schema<RebootCacheClusterResult>;
export interface CacheParameterGroupNameMessage {
  CacheParameterGroupName?: string;
}
export const CacheParameterGroupNameMessage = S.suspend(() =>
  S.Struct({ CacheParameterGroupName: S.optional(S.String) }).pipe(ns),
).annotations({
  identifier: "CacheParameterGroupNameMessage",
}) as any as S.Schema<CacheParameterGroupNameMessage>;
export interface RevokeCacheSecurityGroupIngressResult {
  CacheSecurityGroup?: CacheSecurityGroup;
}
export const RevokeCacheSecurityGroupIngressResult = S.suspend(() =>
  S.Struct({ CacheSecurityGroup: S.optional(CacheSecurityGroup) }).pipe(ns),
).annotations({
  identifier: "RevokeCacheSecurityGroupIngressResult",
}) as any as S.Schema<RevokeCacheSecurityGroupIngressResult>;
export interface StartMigrationMessage {
  ReplicationGroupId: string;
  CustomerNodeEndpointList: CustomerNodeEndpointList;
}
export const StartMigrationMessage = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.String,
    CustomerNodeEndpointList: CustomerNodeEndpointList,
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "StartMigrationMessage",
}) as any as S.Schema<StartMigrationMessage>;
export interface TestFailoverResult {
  ReplicationGroup?: ReplicationGroup;
}
export const TestFailoverResult = S.suspend(() =>
  S.Struct({ ReplicationGroup: S.optional(ReplicationGroup) }).pipe(ns),
).annotations({
  identifier: "TestFailoverResult",
}) as any as S.Schema<TestFailoverResult>;
export interface TestMigrationResponse {
  ReplicationGroup?: ReplicationGroup;
}
export const TestMigrationResponse = S.suspend(() =>
  S.Struct({ ReplicationGroup: S.optional(ReplicationGroup) }).pipe(ns),
).annotations({
  identifier: "TestMigrationResponse",
}) as any as S.Schema<TestMigrationResponse>;
export interface ProcessedUpdateAction {
  ReplicationGroupId?: string;
  CacheClusterId?: string;
  ServiceUpdateName?: string;
  UpdateActionStatus?: string;
}
export const ProcessedUpdateAction = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.optional(S.String),
    CacheClusterId: S.optional(S.String),
    ServiceUpdateName: S.optional(S.String),
    UpdateActionStatus: S.optional(S.String),
  }),
).annotations({
  identifier: "ProcessedUpdateAction",
}) as any as S.Schema<ProcessedUpdateAction>;
export type ProcessedUpdateActionList = ProcessedUpdateAction[];
export const ProcessedUpdateActionList = S.Array(
  ProcessedUpdateAction.pipe(T.XmlName("ProcessedUpdateAction")).annotations({
    identifier: "ProcessedUpdateAction",
  }),
);
export interface UnprocessedUpdateAction {
  ReplicationGroupId?: string;
  CacheClusterId?: string;
  ServiceUpdateName?: string;
  ErrorType?: string;
  ErrorMessage?: string;
}
export const UnprocessedUpdateAction = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.optional(S.String),
    CacheClusterId: S.optional(S.String),
    ServiceUpdateName: S.optional(S.String),
    ErrorType: S.optional(S.String),
    ErrorMessage: S.optional(S.String),
  }),
).annotations({
  identifier: "UnprocessedUpdateAction",
}) as any as S.Schema<UnprocessedUpdateAction>;
export type UnprocessedUpdateActionList = UnprocessedUpdateAction[];
export const UnprocessedUpdateActionList = S.Array(
  UnprocessedUpdateAction.pipe(
    T.XmlName("UnprocessedUpdateAction"),
  ).annotations({ identifier: "UnprocessedUpdateAction" }),
);
export interface Authentication {
  Type?: string;
  PasswordCount?: number;
}
export const Authentication = S.suspend(() =>
  S.Struct({ Type: S.optional(S.String), PasswordCount: S.optional(S.Number) }),
).annotations({
  identifier: "Authentication",
}) as any as S.Schema<Authentication>;
export interface CacheEngineVersion {
  Engine?: string;
  EngineVersion?: string;
  CacheParameterGroupFamily?: string;
  CacheEngineDescription?: string;
  CacheEngineVersionDescription?: string;
}
export const CacheEngineVersion = S.suspend(() =>
  S.Struct({
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    CacheParameterGroupFamily: S.optional(S.String),
    CacheEngineDescription: S.optional(S.String),
    CacheEngineVersionDescription: S.optional(S.String),
  }),
).annotations({
  identifier: "CacheEngineVersion",
}) as any as S.Schema<CacheEngineVersion>;
export type CacheEngineVersionList = CacheEngineVersion[];
export const CacheEngineVersionList = S.Array(
  CacheEngineVersion.pipe(T.XmlName("CacheEngineVersion")).annotations({
    identifier: "CacheEngineVersion",
  }),
);
export interface Parameter {
  ParameterName?: string;
  ParameterValue?: string;
  Description?: string;
  Source?: string;
  DataType?: string;
  AllowedValues?: string;
  IsModifiable?: boolean;
  MinimumEngineVersion?: string;
  ChangeType?: string;
}
export const Parameter = S.suspend(() =>
  S.Struct({
    ParameterName: S.optional(S.String),
    ParameterValue: S.optional(S.String),
    Description: S.optional(S.String),
    Source: S.optional(S.String),
    DataType: S.optional(S.String),
    AllowedValues: S.optional(S.String),
    IsModifiable: S.optional(S.Boolean),
    MinimumEngineVersion: S.optional(S.String),
    ChangeType: S.optional(S.String),
  }),
).annotations({ identifier: "Parameter" }) as any as S.Schema<Parameter>;
export type ParametersList = Parameter[];
export const ParametersList = S.Array(
  Parameter.pipe(T.XmlName("Parameter")).annotations({
    identifier: "Parameter",
  }),
);
export interface CacheNodeTypeSpecificValue {
  CacheNodeType?: string;
  Value?: string;
}
export const CacheNodeTypeSpecificValue = S.suspend(() =>
  S.Struct({
    CacheNodeType: S.optional(S.String),
    Value: S.optional(S.String),
  }),
).annotations({
  identifier: "CacheNodeTypeSpecificValue",
}) as any as S.Schema<CacheNodeTypeSpecificValue>;
export type CacheNodeTypeSpecificValueList = CacheNodeTypeSpecificValue[];
export const CacheNodeTypeSpecificValueList = S.Array(
  CacheNodeTypeSpecificValue.pipe(
    T.XmlName("CacheNodeTypeSpecificValue"),
  ).annotations({ identifier: "CacheNodeTypeSpecificValue" }),
);
export interface CacheNodeTypeSpecificParameter {
  ParameterName?: string;
  Description?: string;
  Source?: string;
  DataType?: string;
  AllowedValues?: string;
  IsModifiable?: boolean;
  MinimumEngineVersion?: string;
  CacheNodeTypeSpecificValues?: CacheNodeTypeSpecificValueList;
  ChangeType?: string;
}
export const CacheNodeTypeSpecificParameter = S.suspend(() =>
  S.Struct({
    ParameterName: S.optional(S.String),
    Description: S.optional(S.String),
    Source: S.optional(S.String),
    DataType: S.optional(S.String),
    AllowedValues: S.optional(S.String),
    IsModifiable: S.optional(S.Boolean),
    MinimumEngineVersion: S.optional(S.String),
    CacheNodeTypeSpecificValues: S.optional(CacheNodeTypeSpecificValueList),
    ChangeType: S.optional(S.String),
  }),
).annotations({
  identifier: "CacheNodeTypeSpecificParameter",
}) as any as S.Schema<CacheNodeTypeSpecificParameter>;
export type CacheNodeTypeSpecificParametersList =
  CacheNodeTypeSpecificParameter[];
export const CacheNodeTypeSpecificParametersList = S.Array(
  CacheNodeTypeSpecificParameter.pipe(
    T.XmlName("CacheNodeTypeSpecificParameter"),
  ).annotations({ identifier: "CacheNodeTypeSpecificParameter" }),
);
export interface EngineDefaults {
  CacheParameterGroupFamily?: string;
  Marker?: string;
  Parameters?: ParametersList;
  CacheNodeTypeSpecificParameters?: CacheNodeTypeSpecificParametersList;
}
export const EngineDefaults = S.suspend(() =>
  S.Struct({
    CacheParameterGroupFamily: S.optional(S.String),
    Marker: S.optional(S.String),
    Parameters: S.optional(ParametersList),
    CacheNodeTypeSpecificParameters: S.optional(
      CacheNodeTypeSpecificParametersList,
    ),
  }),
).annotations({
  identifier: "EngineDefaults",
}) as any as S.Schema<EngineDefaults>;
export interface Event {
  SourceIdentifier?: string;
  SourceType?: string;
  Message?: string;
  Date?: Date;
}
export const Event = S.suspend(() =>
  S.Struct({
    SourceIdentifier: S.optional(S.String),
    SourceType: S.optional(S.String),
    Message: S.optional(S.String),
    Date: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  }),
).annotations({ identifier: "Event" }) as any as S.Schema<Event>;
export type EventList = Event[];
export const EventList = S.Array(
  Event.pipe(T.XmlName("Event")).annotations({ identifier: "Event" }),
);
export interface ReservedCacheNodesOffering {
  ReservedCacheNodesOfferingId?: string;
  CacheNodeType?: string;
  Duration?: number;
  FixedPrice?: number;
  UsagePrice?: number;
  ProductDescription?: string;
  OfferingType?: string;
  RecurringCharges?: RecurringChargeList;
}
export const ReservedCacheNodesOffering = S.suspend(() =>
  S.Struct({
    ReservedCacheNodesOfferingId: S.optional(S.String),
    CacheNodeType: S.optional(S.String),
    Duration: S.optional(S.Number),
    FixedPrice: S.optional(S.Number),
    UsagePrice: S.optional(S.Number),
    ProductDescription: S.optional(S.String),
    OfferingType: S.optional(S.String),
    RecurringCharges: S.optional(RecurringChargeList),
  }),
).annotations({
  identifier: "ReservedCacheNodesOffering",
}) as any as S.Schema<ReservedCacheNodesOffering>;
export type ReservedCacheNodesOfferingList = ReservedCacheNodesOffering[];
export const ReservedCacheNodesOfferingList = S.Array(
  ReservedCacheNodesOffering.pipe(
    T.XmlName("ReservedCacheNodesOffering"),
  ).annotations({ identifier: "ReservedCacheNodesOffering" }),
);
export interface ServiceUpdate {
  ServiceUpdateName?: string;
  ServiceUpdateReleaseDate?: Date;
  ServiceUpdateEndDate?: Date;
  ServiceUpdateSeverity?: string;
  ServiceUpdateRecommendedApplyByDate?: Date;
  ServiceUpdateStatus?: string;
  ServiceUpdateDescription?: string;
  ServiceUpdateType?: string;
  Engine?: string;
  EngineVersion?: string;
  AutoUpdateAfterRecommendedApplyByDate?: boolean;
  EstimatedUpdateTime?: string;
}
export const ServiceUpdate = S.suspend(() =>
  S.Struct({
    ServiceUpdateName: S.optional(S.String),
    ServiceUpdateReleaseDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ServiceUpdateEndDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ServiceUpdateSeverity: S.optional(S.String),
    ServiceUpdateRecommendedApplyByDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ServiceUpdateStatus: S.optional(S.String),
    ServiceUpdateDescription: S.optional(S.String),
    ServiceUpdateType: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    AutoUpdateAfterRecommendedApplyByDate: S.optional(S.Boolean),
    EstimatedUpdateTime: S.optional(S.String),
  }),
).annotations({
  identifier: "ServiceUpdate",
}) as any as S.Schema<ServiceUpdate>;
export type ServiceUpdateList = ServiceUpdate[];
export const ServiceUpdateList = S.Array(
  ServiceUpdate.pipe(T.XmlName("ServiceUpdate")).annotations({
    identifier: "ServiceUpdate",
  }),
);
export interface User {
  UserId?: string;
  UserName?: string;
  Status?: string;
  Engine?: string;
  MinimumEngineVersion?: string;
  AccessString?: string;
  UserGroupIds?: UserGroupIdList;
  Authentication?: Authentication;
  ARN?: string;
}
export const User = S.suspend(() =>
  S.Struct({
    UserId: S.optional(S.String),
    UserName: S.optional(S.String),
    Status: S.optional(S.String),
    Engine: S.optional(S.String),
    MinimumEngineVersion: S.optional(S.String),
    AccessString: S.optional(S.String),
    UserGroupIds: S.optional(UserGroupIdList),
    Authentication: S.optional(Authentication),
    ARN: S.optional(S.String),
  }).pipe(ns),
).annotations({ identifier: "User" }) as any as S.Schema<User>;
export type UserList = User[];
export const UserList = S.Array(User);
export interface UpdateActionResultsMessage {
  ProcessedUpdateActions?: ProcessedUpdateActionList;
  UnprocessedUpdateActions?: UnprocessedUpdateActionList;
}
export const UpdateActionResultsMessage = S.suspend(() =>
  S.Struct({
    ProcessedUpdateActions: S.optional(ProcessedUpdateActionList),
    UnprocessedUpdateActions: S.optional(UnprocessedUpdateActionList),
  }).pipe(ns),
).annotations({
  identifier: "UpdateActionResultsMessage",
}) as any as S.Schema<UpdateActionResultsMessage>;
export interface CreateCacheParameterGroupResult {
  CacheParameterGroup?: CacheParameterGroup;
}
export const CreateCacheParameterGroupResult = S.suspend(() =>
  S.Struct({ CacheParameterGroup: S.optional(CacheParameterGroup) }).pipe(ns),
).annotations({
  identifier: "CreateCacheParameterGroupResult",
}) as any as S.Schema<CreateCacheParameterGroupResult>;
export interface CreateReplicationGroupResult {
  ReplicationGroup?: ReplicationGroup;
}
export const CreateReplicationGroupResult = S.suspend(() =>
  S.Struct({ ReplicationGroup: S.optional(ReplicationGroup) }).pipe(ns),
).annotations({
  identifier: "CreateReplicationGroupResult",
}) as any as S.Schema<CreateReplicationGroupResult>;
export interface CreateServerlessCacheRequest {
  ServerlessCacheName: string;
  Description?: string;
  Engine: string;
  MajorEngineVersion?: string;
  CacheUsageLimits?: CacheUsageLimits;
  KmsKeyId?: string;
  SecurityGroupIds?: SecurityGroupIdsList;
  SnapshotArnsToRestore?: SnapshotArnsList;
  Tags?: TagList;
  UserGroupId?: string;
  SubnetIds?: SubnetIdsList;
  SnapshotRetentionLimit?: number;
  DailySnapshotTime?: string;
}
export const CreateServerlessCacheRequest = S.suspend(() =>
  S.Struct({
    ServerlessCacheName: S.String,
    Description: S.optional(S.String),
    Engine: S.String,
    MajorEngineVersion: S.optional(S.String),
    CacheUsageLimits: S.optional(CacheUsageLimits),
    KmsKeyId: S.optional(S.String),
    SecurityGroupIds: S.optional(SecurityGroupIdsList),
    SnapshotArnsToRestore: S.optional(SnapshotArnsList),
    Tags: S.optional(TagList),
    UserGroupId: S.optional(S.String),
    SubnetIds: S.optional(SubnetIdsList),
    SnapshotRetentionLimit: S.optional(S.Number),
    DailySnapshotTime: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateServerlessCacheRequest",
}) as any as S.Schema<CreateServerlessCacheRequest>;
export interface DecreaseReplicaCountResult {
  ReplicationGroup?: ReplicationGroup;
}
export const DecreaseReplicaCountResult = S.suspend(() =>
  S.Struct({ ReplicationGroup: S.optional(ReplicationGroup) }).pipe(ns),
).annotations({
  identifier: "DecreaseReplicaCountResult",
}) as any as S.Schema<DecreaseReplicaCountResult>;
export interface DeleteServerlessCacheResponse {
  ServerlessCache?: ServerlessCache;
}
export const DeleteServerlessCacheResponse = S.suspend(() =>
  S.Struct({ ServerlessCache: S.optional(ServerlessCache) }).pipe(ns),
).annotations({
  identifier: "DeleteServerlessCacheResponse",
}) as any as S.Schema<DeleteServerlessCacheResponse>;
export interface CacheEngineVersionMessage {
  Marker?: string;
  CacheEngineVersions?: CacheEngineVersionList;
}
export const CacheEngineVersionMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    CacheEngineVersions: S.optional(CacheEngineVersionList),
  }).pipe(ns),
).annotations({
  identifier: "CacheEngineVersionMessage",
}) as any as S.Schema<CacheEngineVersionMessage>;
export interface DescribeEngineDefaultParametersResult {
  EngineDefaults?: EngineDefaults;
}
export const DescribeEngineDefaultParametersResult = S.suspend(() =>
  S.Struct({ EngineDefaults: S.optional(EngineDefaults) }).pipe(ns),
).annotations({
  identifier: "DescribeEngineDefaultParametersResult",
}) as any as S.Schema<DescribeEngineDefaultParametersResult>;
export interface EventsMessage {
  Marker?: string;
  Events?: EventList;
}
export const EventsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    Events: S.optional(EventList),
  }).pipe(ns),
).annotations({
  identifier: "EventsMessage",
}) as any as S.Schema<EventsMessage>;
export interface ReservedCacheNodesOfferingMessage {
  Marker?: string;
  ReservedCacheNodesOfferings?: ReservedCacheNodesOfferingList;
}
export const ReservedCacheNodesOfferingMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ReservedCacheNodesOfferings: S.optional(ReservedCacheNodesOfferingList),
  }).pipe(ns),
).annotations({
  identifier: "ReservedCacheNodesOfferingMessage",
}) as any as S.Schema<ReservedCacheNodesOfferingMessage>;
export interface ServiceUpdatesMessage {
  Marker?: string;
  ServiceUpdates?: ServiceUpdateList;
}
export const ServiceUpdatesMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ServiceUpdates: S.optional(ServiceUpdateList),
  }).pipe(ns),
).annotations({
  identifier: "ServiceUpdatesMessage",
}) as any as S.Schema<ServiceUpdatesMessage>;
export interface DescribeUsersResult {
  Users?: UserList;
  Marker?: string;
}
export const DescribeUsersResult = S.suspend(() =>
  S.Struct({ Users: S.optional(UserList), Marker: S.optional(S.String) }).pipe(
    ns,
  ),
).annotations({
  identifier: "DescribeUsersResult",
}) as any as S.Schema<DescribeUsersResult>;
export interface IncreaseNodeGroupsInGlobalReplicationGroupResult {
  GlobalReplicationGroup?: GlobalReplicationGroup;
}
export const IncreaseNodeGroupsInGlobalReplicationGroupResult = S.suspend(() =>
  S.Struct({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }).pipe(
    ns,
  ),
).annotations({
  identifier: "IncreaseNodeGroupsInGlobalReplicationGroupResult",
}) as any as S.Schema<IncreaseNodeGroupsInGlobalReplicationGroupResult>;
export interface ModifyCacheClusterResult {
  CacheCluster?: CacheCluster;
}
export const ModifyCacheClusterResult = S.suspend(() =>
  S.Struct({ CacheCluster: S.optional(CacheCluster) }).pipe(ns),
).annotations({
  identifier: "ModifyCacheClusterResult",
}) as any as S.Schema<ModifyCacheClusterResult>;
export interface ModifyReplicationGroupShardConfigurationResult {
  ReplicationGroup?: ReplicationGroup;
}
export const ModifyReplicationGroupShardConfigurationResult = S.suspend(() =>
  S.Struct({ ReplicationGroup: S.optional(ReplicationGroup) }).pipe(ns),
).annotations({
  identifier: "ModifyReplicationGroupShardConfigurationResult",
}) as any as S.Schema<ModifyReplicationGroupShardConfigurationResult>;
export interface StartMigrationResponse {
  ReplicationGroup?: ReplicationGroup;
}
export const StartMigrationResponse = S.suspend(() =>
  S.Struct({ ReplicationGroup: S.optional(ReplicationGroup) }).pipe(ns),
).annotations({
  identifier: "StartMigrationResponse",
}) as any as S.Schema<StartMigrationResponse>;
export type ReservedCacheNodeList = ReservedCacheNode[];
export const ReservedCacheNodeList = S.Array(
  ReservedCacheNode.pipe(T.XmlName("ReservedCacheNode")).annotations({
    identifier: "ReservedCacheNode",
  }),
);
export interface AuthorizeCacheSecurityGroupIngressResult {
  CacheSecurityGroup?: CacheSecurityGroup;
}
export const AuthorizeCacheSecurityGroupIngressResult = S.suspend(() =>
  S.Struct({ CacheSecurityGroup: S.optional(CacheSecurityGroup) }).pipe(ns),
).annotations({
  identifier: "AuthorizeCacheSecurityGroupIngressResult",
}) as any as S.Schema<AuthorizeCacheSecurityGroupIngressResult>;
export interface CopyServerlessCacheSnapshotResponse {
  ServerlessCacheSnapshot?: ServerlessCacheSnapshot;
}
export const CopyServerlessCacheSnapshotResponse = S.suspend(() =>
  S.Struct({
    ServerlessCacheSnapshot: S.optional(ServerlessCacheSnapshot),
  }).pipe(ns),
).annotations({
  identifier: "CopyServerlessCacheSnapshotResponse",
}) as any as S.Schema<CopyServerlessCacheSnapshotResponse>;
export interface CopySnapshotResult {
  Snapshot?: Snapshot;
}
export const CopySnapshotResult = S.suspend(() =>
  S.Struct({ Snapshot: S.optional(Snapshot) }).pipe(ns),
).annotations({
  identifier: "CopySnapshotResult",
}) as any as S.Schema<CopySnapshotResult>;
export interface CreateCacheClusterMessage {
  CacheClusterId: string;
  ReplicationGroupId?: string;
  AZMode?: string;
  PreferredAvailabilityZone?: string;
  PreferredAvailabilityZones?: PreferredAvailabilityZoneList;
  NumCacheNodes?: number;
  CacheNodeType?: string;
  Engine?: string;
  EngineVersion?: string;
  CacheParameterGroupName?: string;
  CacheSubnetGroupName?: string;
  CacheSecurityGroupNames?: CacheSecurityGroupNameList;
  SecurityGroupIds?: SecurityGroupIdsList;
  Tags?: TagList;
  SnapshotArns?: SnapshotArnsList;
  SnapshotName?: string;
  PreferredMaintenanceWindow?: string;
  Port?: number;
  NotificationTopicArn?: string;
  AutoMinorVersionUpgrade?: boolean;
  SnapshotRetentionLimit?: number;
  SnapshotWindow?: string;
  AuthToken?: string;
  OutpostMode?: string;
  PreferredOutpostArn?: string;
  PreferredOutpostArns?: PreferredOutpostArnList;
  LogDeliveryConfigurations?: LogDeliveryConfigurationRequestList;
  TransitEncryptionEnabled?: boolean;
  NetworkType?: string;
  IpDiscovery?: string;
}
export const CreateCacheClusterMessage = S.suspend(() =>
  S.Struct({
    CacheClusterId: S.String,
    ReplicationGroupId: S.optional(S.String),
    AZMode: S.optional(S.String),
    PreferredAvailabilityZone: S.optional(S.String),
    PreferredAvailabilityZones: S.optional(PreferredAvailabilityZoneList),
    NumCacheNodes: S.optional(S.Number),
    CacheNodeType: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    CacheParameterGroupName: S.optional(S.String),
    CacheSubnetGroupName: S.optional(S.String),
    CacheSecurityGroupNames: S.optional(CacheSecurityGroupNameList),
    SecurityGroupIds: S.optional(SecurityGroupIdsList),
    Tags: S.optional(TagList),
    SnapshotArns: S.optional(SnapshotArnsList),
    SnapshotName: S.optional(S.String),
    PreferredMaintenanceWindow: S.optional(S.String),
    Port: S.optional(S.Number),
    NotificationTopicArn: S.optional(S.String),
    AutoMinorVersionUpgrade: S.optional(S.Boolean),
    SnapshotRetentionLimit: S.optional(S.Number),
    SnapshotWindow: S.optional(S.String),
    AuthToken: S.optional(S.String),
    OutpostMode: S.optional(S.String),
    PreferredOutpostArn: S.optional(S.String),
    PreferredOutpostArns: S.optional(PreferredOutpostArnList),
    LogDeliveryConfigurations: S.optional(LogDeliveryConfigurationRequestList),
    TransitEncryptionEnabled: S.optional(S.Boolean),
    NetworkType: S.optional(S.String),
    IpDiscovery: S.optional(S.String),
  }).pipe(
    T.all(
      ns,
      T.Http({ method: "POST", uri: "/" }),
      svc,
      auth,
      proto,
      ver,
      rules,
    ),
  ),
).annotations({
  identifier: "CreateCacheClusterMessage",
}) as any as S.Schema<CreateCacheClusterMessage>;
export interface CreateGlobalReplicationGroupResult {
  GlobalReplicationGroup?: GlobalReplicationGroup;
}
export const CreateGlobalReplicationGroupResult = S.suspend(() =>
  S.Struct({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }).pipe(
    ns,
  ),
).annotations({
  identifier: "CreateGlobalReplicationGroupResult",
}) as any as S.Schema<CreateGlobalReplicationGroupResult>;
export interface CreateServerlessCacheResponse {
  ServerlessCache?: ServerlessCache;
}
export const CreateServerlessCacheResponse = S.suspend(() =>
  S.Struct({ ServerlessCache: S.optional(ServerlessCache) }).pipe(ns),
).annotations({
  identifier: "CreateServerlessCacheResponse",
}) as any as S.Schema<CreateServerlessCacheResponse>;
export interface DeleteCacheClusterResult {
  CacheCluster?: CacheCluster;
}
export const DeleteCacheClusterResult = S.suspend(() =>
  S.Struct({ CacheCluster: S.optional(CacheCluster) }).pipe(ns),
).annotations({
  identifier: "DeleteCacheClusterResult",
}) as any as S.Schema<DeleteCacheClusterResult>;
export interface CacheParameterGroupDetails {
  Marker?: string;
  Parameters?: ParametersList;
  CacheNodeTypeSpecificParameters?: CacheNodeTypeSpecificParametersList;
}
export const CacheParameterGroupDetails = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    Parameters: S.optional(ParametersList),
    CacheNodeTypeSpecificParameters: S.optional(
      CacheNodeTypeSpecificParametersList,
    ),
  }).pipe(ns),
).annotations({
  identifier: "CacheParameterGroupDetails",
}) as any as S.Schema<CacheParameterGroupDetails>;
export interface ReservedCacheNodeMessage {
  Marker?: string;
  ReservedCacheNodes?: ReservedCacheNodeList;
}
export const ReservedCacheNodeMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    ReservedCacheNodes: S.optional(ReservedCacheNodeList),
  }).pipe(ns),
).annotations({
  identifier: "ReservedCacheNodeMessage",
}) as any as S.Schema<ReservedCacheNodeMessage>;
export interface CacheNodeUpdateStatus {
  CacheNodeId?: string;
  NodeUpdateStatus?: string;
  NodeDeletionDate?: Date;
  NodeUpdateStartDate?: Date;
  NodeUpdateEndDate?: Date;
  NodeUpdateInitiatedBy?: string;
  NodeUpdateInitiatedDate?: Date;
  NodeUpdateStatusModifiedDate?: Date;
}
export const CacheNodeUpdateStatus = S.suspend(() =>
  S.Struct({
    CacheNodeId: S.optional(S.String),
    NodeUpdateStatus: S.optional(S.String),
    NodeDeletionDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NodeUpdateStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    NodeUpdateEndDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NodeUpdateInitiatedBy: S.optional(S.String),
    NodeUpdateInitiatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    NodeUpdateStatusModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "CacheNodeUpdateStatus",
}) as any as S.Schema<CacheNodeUpdateStatus>;
export type CacheNodeUpdateStatusList = CacheNodeUpdateStatus[];
export const CacheNodeUpdateStatusList = S.Array(
  CacheNodeUpdateStatus.pipe(T.XmlName("CacheNodeUpdateStatus")).annotations({
    identifier: "CacheNodeUpdateStatus",
  }),
);
export interface NodeGroupMemberUpdateStatus {
  CacheClusterId?: string;
  CacheNodeId?: string;
  NodeUpdateStatus?: string;
  NodeDeletionDate?: Date;
  NodeUpdateStartDate?: Date;
  NodeUpdateEndDate?: Date;
  NodeUpdateInitiatedBy?: string;
  NodeUpdateInitiatedDate?: Date;
  NodeUpdateStatusModifiedDate?: Date;
}
export const NodeGroupMemberUpdateStatus = S.suspend(() =>
  S.Struct({
    CacheClusterId: S.optional(S.String),
    CacheNodeId: S.optional(S.String),
    NodeUpdateStatus: S.optional(S.String),
    NodeDeletionDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NodeUpdateStartDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    NodeUpdateEndDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    NodeUpdateInitiatedBy: S.optional(S.String),
    NodeUpdateInitiatedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    NodeUpdateStatusModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
  }),
).annotations({
  identifier: "NodeGroupMemberUpdateStatus",
}) as any as S.Schema<NodeGroupMemberUpdateStatus>;
export type NodeGroupMemberUpdateStatusList = NodeGroupMemberUpdateStatus[];
export const NodeGroupMemberUpdateStatusList = S.Array(
  NodeGroupMemberUpdateStatus.pipe(
    T.XmlName("NodeGroupMemberUpdateStatus"),
  ).annotations({ identifier: "NodeGroupMemberUpdateStatus" }),
);
export interface CreateCacheClusterResult {
  CacheCluster?: CacheCluster;
}
export const CreateCacheClusterResult = S.suspend(() =>
  S.Struct({ CacheCluster: S.optional(CacheCluster) }).pipe(ns),
).annotations({
  identifier: "CreateCacheClusterResult",
}) as any as S.Schema<CreateCacheClusterResult>;
export interface CreateCacheSubnetGroupResult {
  CacheSubnetGroup?: CacheSubnetGroup;
}
export const CreateCacheSubnetGroupResult = S.suspend(() =>
  S.Struct({ CacheSubnetGroup: S.optional(CacheSubnetGroup) }).pipe(ns),
).annotations({
  identifier: "CreateCacheSubnetGroupResult",
}) as any as S.Schema<CreateCacheSubnetGroupResult>;
export interface NodeGroupUpdateStatus {
  NodeGroupId?: string;
  NodeGroupMemberUpdateStatus?: NodeGroupMemberUpdateStatusList;
}
export const NodeGroupUpdateStatus = S.suspend(() =>
  S.Struct({
    NodeGroupId: S.optional(S.String),
    NodeGroupMemberUpdateStatus: S.optional(NodeGroupMemberUpdateStatusList),
  }),
).annotations({
  identifier: "NodeGroupUpdateStatus",
}) as any as S.Schema<NodeGroupUpdateStatus>;
export type NodeGroupUpdateStatusList = NodeGroupUpdateStatus[];
export const NodeGroupUpdateStatusList = S.Array(
  NodeGroupUpdateStatus.pipe(T.XmlName("NodeGroupUpdateStatus")).annotations({
    identifier: "NodeGroupUpdateStatus",
  }),
);
export interface UpdateAction {
  ReplicationGroupId?: string;
  CacheClusterId?: string;
  ServiceUpdateName?: string;
  ServiceUpdateReleaseDate?: Date;
  ServiceUpdateSeverity?: string;
  ServiceUpdateStatus?: string;
  ServiceUpdateRecommendedApplyByDate?: Date;
  ServiceUpdateType?: string;
  UpdateActionAvailableDate?: Date;
  UpdateActionStatus?: string;
  NodesUpdated?: string;
  UpdateActionStatusModifiedDate?: Date;
  SlaMet?: string;
  NodeGroupUpdateStatus?: NodeGroupUpdateStatusList;
  CacheNodeUpdateStatus?: CacheNodeUpdateStatusList;
  EstimatedUpdateTime?: string;
  Engine?: string;
}
export const UpdateAction = S.suspend(() =>
  S.Struct({
    ReplicationGroupId: S.optional(S.String),
    CacheClusterId: S.optional(S.String),
    ServiceUpdateName: S.optional(S.String),
    ServiceUpdateReleaseDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ServiceUpdateSeverity: S.optional(S.String),
    ServiceUpdateStatus: S.optional(S.String),
    ServiceUpdateRecommendedApplyByDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    ServiceUpdateType: S.optional(S.String),
    UpdateActionAvailableDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    UpdateActionStatus: S.optional(S.String),
    NodesUpdated: S.optional(S.String),
    UpdateActionStatusModifiedDate: S.optional(
      S.Date.pipe(T.TimestampFormat("date-time")),
    ),
    SlaMet: S.optional(S.String),
    NodeGroupUpdateStatus: S.optional(NodeGroupUpdateStatusList),
    CacheNodeUpdateStatus: S.optional(CacheNodeUpdateStatusList),
    EstimatedUpdateTime: S.optional(S.String),
    Engine: S.optional(S.String),
  }),
).annotations({ identifier: "UpdateAction" }) as any as S.Schema<UpdateAction>;
export type UpdateActionList = UpdateAction[];
export const UpdateActionList = S.Array(
  UpdateAction.pipe(T.XmlName("UpdateAction")).annotations({
    identifier: "UpdateAction",
  }),
);
export interface CompleteMigrationResponse {
  ReplicationGroup?: ReplicationGroup;
}
export const CompleteMigrationResponse = S.suspend(() =>
  S.Struct({ ReplicationGroup: S.optional(ReplicationGroup) }).pipe(ns),
).annotations({
  identifier: "CompleteMigrationResponse",
}) as any as S.Schema<CompleteMigrationResponse>;
export interface UpdateActionsMessage {
  Marker?: string;
  UpdateActions?: UpdateActionList;
}
export const UpdateActionsMessage = S.suspend(() =>
  S.Struct({
    Marker: S.optional(S.String),
    UpdateActions: S.optional(UpdateActionList),
  }).pipe(ns),
).annotations({
  identifier: "UpdateActionsMessage",
}) as any as S.Schema<UpdateActionsMessage>;

//# Errors
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidParameterValue", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CacheParameterGroupNotFoundFault extends S.TaggedError<CacheParameterGroupNotFoundFault>()(
  "CacheParameterGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheParameterGroupNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class CacheSecurityGroupNotFoundFault extends S.TaggedError<CacheSecurityGroupNotFoundFault>()(
  "CacheSecurityGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheSecurityGroupNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class CacheSubnetGroupInUse extends S.TaggedError<CacheSubnetGroupInUse>()(
  "CacheSubnetGroupInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "CacheSubnetGroupInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidParameterCombinationException extends S.TaggedError<InvalidParameterCombinationException>()(
  "InvalidParameterCombinationException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidParameterCombination",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DefaultUserRequired extends S.TaggedError<DefaultUserRequired>()(
  "DefaultUserRequired",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DefaultUserRequired", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CacheClusterNotFoundFault extends S.TaggedError<CacheClusterNotFoundFault>()(
  "CacheClusterNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "CacheClusterNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class ServiceUpdateNotFoundFault extends S.TaggedError<ServiceUpdateNotFoundFault>()(
  "ServiceUpdateNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServiceUpdateNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class CacheSecurityGroupAlreadyExistsFault extends S.TaggedError<CacheSecurityGroupAlreadyExistsFault>()(
  "CacheSecurityGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheSecurityGroupAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class DuplicateUserNameFault extends S.TaggedError<DuplicateUserNameFault>()(
  "DuplicateUserNameFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DuplicateUserName", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class GlobalReplicationGroupNotFoundFault extends S.TaggedError<GlobalReplicationGroupNotFoundFault>()(
  "GlobalReplicationGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalReplicationGroupNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidCacheParameterGroupStateFault extends S.TaggedError<InvalidCacheParameterGroupStateFault>()(
  "InvalidCacheParameterGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCacheParameterGroupState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidCacheSecurityGroupStateFault extends S.TaggedError<InvalidCacheSecurityGroupStateFault>()(
  "InvalidCacheSecurityGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCacheSecurityGroupState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CacheSubnetGroupNotFoundFault extends S.TaggedError<CacheSubnetGroupNotFoundFault>()(
  "CacheSubnetGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheSubnetGroupNotFoundFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidServerlessCacheSnapshotStateFault extends S.TaggedError<InvalidServerlessCacheSnapshotStateFault>()(
  "InvalidServerlessCacheSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidServerlessCacheSnapshotStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ClusterQuotaForCustomerExceededFault extends S.TaggedError<ClusterQuotaForCustomerExceededFault>()(
  "ClusterQuotaForCustomerExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ClusterQuotaForCustomerExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidCredentialsException extends S.TaggedError<InvalidCredentialsException>()(
  "InvalidCredentialsException",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCredentialsException",
    httpResponseCode: 408,
  }),
).pipe(C.withTimeoutError) {}
export class InvalidUserStateFault extends S.TaggedError<InvalidUserStateFault>()(
  "InvalidUserStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidUserState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ReservedCacheNodeAlreadyExistsFault extends S.TaggedError<ReservedCacheNodeAlreadyExistsFault>()(
  "ReservedCacheNodeAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedCacheNodeAlreadyExists",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class AuthorizationNotFoundFault extends S.TaggedError<AuthorizationNotFoundFault>()(
  "AuthorizationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AuthorizationNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class APICallRateForCustomerExceededFault extends S.TaggedError<APICallRateForCustomerExceededFault>()(
  "APICallRateForCustomerExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "APICallRateForCustomerExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidReplicationGroupStateFault extends S.TaggedError<InvalidReplicationGroupStateFault>()(
  "InvalidReplicationGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidReplicationGroupState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidUserGroupStateFault extends S.TaggedError<InvalidUserGroupStateFault>()(
  "InvalidUserGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidUserGroupState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class InvalidServerlessCacheStateFault extends S.TaggedError<InvalidServerlessCacheStateFault>()(
  "InvalidServerlessCacheStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidServerlessCacheStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidSnapshotStateFault extends S.TaggedError<InvalidSnapshotStateFault>()(
  "InvalidSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSnapshotState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ReplicationGroupNotFoundFault extends S.TaggedError<ReplicationGroupNotFoundFault>()(
  "ReplicationGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReplicationGroupNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class ServerlessCacheNotFoundFault extends S.TaggedError<ServerlessCacheNotFoundFault>()(
  "ServerlessCacheNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServerlessCacheNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class ServiceLinkedRoleNotFoundFault extends S.TaggedError<ServiceLinkedRoleNotFoundFault>()(
  "ServiceLinkedRoleNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServiceLinkedRoleNotFoundFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidCacheClusterStateFault extends S.TaggedError<InvalidCacheClusterStateFault>()(
  "InvalidCacheClusterStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidCacheClusterState", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SnapshotNotFoundFault extends S.TaggedError<SnapshotNotFoundFault>()(
  "SnapshotNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SnapshotNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InsufficientCacheClusterCapacityFault extends S.TaggedError<InsufficientCacheClusterCapacityFault>()(
  "InsufficientCacheClusterCapacityFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InsufficientCacheClusterCapacity",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CacheParameterGroupAlreadyExistsFault extends S.TaggedError<CacheParameterGroupAlreadyExistsFault>()(
  "CacheParameterGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheParameterGroupAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CacheSecurityGroupQuotaExceededFault extends S.TaggedError<CacheSecurityGroupQuotaExceededFault>()(
  "CacheSecurityGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "QuotaExceeded.CacheSecurityGroup",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidGlobalReplicationGroupStateFault extends S.TaggedError<InvalidGlobalReplicationGroupStateFault>()(
  "InvalidGlobalReplicationGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidGlobalReplicationGroupState",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ServerlessCacheSnapshotNotFoundFault extends S.TaggedError<ServerlessCacheSnapshotNotFoundFault>()(
  "ServerlessCacheSnapshotNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServerlessCacheSnapshotNotFoundFault",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class DefaultUserAssociatedToUserGroupFault extends S.TaggedError<DefaultUserAssociatedToUserGroupFault>()(
  "DefaultUserAssociatedToUserGroupFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DefaultUserAssociatedToUserGroup",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ReservedCacheNodesOfferingNotFoundFault extends S.TaggedError<ReservedCacheNodesOfferingNotFoundFault>()(
  "ReservedCacheNodesOfferingNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedCacheNodesOfferingNotFound",
    httpResponseCode: 404,
  }),
).pipe(C.withBadRequestError) {}
export class ReservedCacheNodeQuotaExceededFault extends S.TaggedError<ReservedCacheNodeQuotaExceededFault>()(
  "ReservedCacheNodeQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedCacheNodeQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ReplicationGroupAlreadyUnderMigrationFault extends S.TaggedError<ReplicationGroupAlreadyUnderMigrationFault>()(
  "ReplicationGroupAlreadyUnderMigrationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReplicationGroupAlreadyUnderMigrationFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CacheSubnetQuotaExceededFault extends S.TaggedError<CacheSubnetQuotaExceededFault>()(
  "CacheSubnetQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheSubnetQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidARNFault extends S.TaggedError<InvalidARNFault>()(
  "InvalidARNFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidARN", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class UserGroupNotFoundFault extends S.TaggedError<UserGroupNotFoundFault>()(
  "UserGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserGroupNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class SnapshotAlreadyExistsFault extends S.TaggedError<SnapshotAlreadyExistsFault>()(
  "SnapshotAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class InvalidKMSKeyFault extends S.TaggedError<InvalidKMSKeyFault>()(
  "InvalidKMSKeyFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidKMSKeyFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ServerlessCacheSnapshotAlreadyExistsFault extends S.TaggedError<ServerlessCacheSnapshotAlreadyExistsFault>()(
  "ServerlessCacheSnapshotAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServerlessCacheSnapshotAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TagQuotaPerResourceExceeded extends S.TaggedError<TagQuotaPerResourceExceeded>()(
  "TagQuotaPerResourceExceeded",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TagQuotaPerResourceExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class UserNotFoundFault extends S.TaggedError<UserNotFoundFault>()(
  "UserNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidVPCNetworkStateFault extends S.TaggedError<InvalidVPCNetworkStateFault>()(
  "InvalidVPCNetworkStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidVPCNetworkStateFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class AuthorizationAlreadyExistsFault extends S.TaggedError<AuthorizationAlreadyExistsFault>()(
  "AuthorizationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AuthorizationAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CacheParameterGroupQuotaExceededFault extends S.TaggedError<CacheParameterGroupQuotaExceededFault>()(
  "CacheParameterGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheParameterGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class GlobalReplicationGroupAlreadyExistsFault extends S.TaggedError<GlobalReplicationGroupAlreadyExistsFault>()(
  "GlobalReplicationGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalReplicationGroupAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ServerlessCacheAlreadyExistsFault extends S.TaggedError<ServerlessCacheAlreadyExistsFault>()(
  "ServerlessCacheAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServerlessCacheAlreadyExistsFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ReservedCacheNodeNotFoundFault extends S.TaggedError<ReservedCacheNodeNotFoundFault>()(
  "ReservedCacheNodeNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "ReservedCacheNodeNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class InvalidSubnet extends S.TaggedError<InvalidSubnet>()(
  "InvalidSubnet",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SnapshotFeatureNotSupportedFault extends S.TaggedError<SnapshotFeatureNotSupportedFault>()(
  "SnapshotFeatureNotSupportedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotFeatureNotSupportedFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class UserAlreadyExistsFault extends S.TaggedError<UserAlreadyExistsFault>()(
  "UserAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class SnapshotQuotaExceededFault extends S.TaggedError<SnapshotQuotaExceededFault>()(
  "SnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "SnapshotQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class NodeQuotaForClusterExceededFault extends S.TaggedError<NodeQuotaForClusterExceededFault>()(
  "NodeQuotaForClusterExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NodeQuotaForClusterExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class NodeGroupNotFoundFault extends S.TaggedError<NodeGroupNotFoundFault>()(
  "NodeGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NodeGroupNotFoundFault", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class NodeGroupsPerReplicationGroupQuotaExceededFault extends S.TaggedError<NodeGroupsPerReplicationGroupQuotaExceededFault>()(
  "NodeGroupsPerReplicationGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NodeGroupsPerReplicationGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ServerlessCacheSnapshotQuotaExceededFault extends S.TaggedError<ServerlessCacheSnapshotQuotaExceededFault>()(
  "ServerlessCacheSnapshotQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServerlessCacheSnapshotQuotaExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class UserGroupAlreadyExistsFault extends S.TaggedError<UserGroupAlreadyExistsFault>()(
  "UserGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserGroupAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CacheClusterAlreadyExistsFault extends S.TaggedError<CacheClusterAlreadyExistsFault>()(
  "CacheClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "CacheClusterAlreadyExists", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class CacheSubnetGroupAlreadyExistsFault extends S.TaggedError<CacheSubnetGroupAlreadyExistsFault>()(
  "CacheSubnetGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheSubnetGroupAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class ServerlessCacheQuotaForCustomerExceededFault extends S.TaggedError<ServerlessCacheQuotaForCustomerExceededFault>()(
  "ServerlessCacheQuotaForCustomerExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServerlessCacheQuotaForCustomerExceededFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubnetInUse extends S.TaggedError<SubnetInUse>()(
  "SubnetInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetInUse", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class TagNotFoundFault extends S.TaggedError<TagNotFoundFault>()(
  "TagNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagNotFound", httpResponseCode: 404 }),
).pipe(C.withBadRequestError) {}
export class UserQuotaExceededFault extends S.TaggedError<UserQuotaExceededFault>()(
  "UserQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class NodeQuotaForCustomerExceededFault extends S.TaggedError<NodeQuotaForCustomerExceededFault>()(
  "NodeQuotaForCustomerExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "NodeQuotaForCustomerExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class TestFailoverNotAvailableFault extends S.TaggedError<TestFailoverNotAvailableFault>()(
  "TestFailoverNotAvailableFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TestFailoverNotAvailableFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class UserGroupQuotaExceededFault extends S.TaggedError<UserGroupQuotaExceededFault>()(
  "UserGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserGroupQuotaExceeded", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ReplicationGroupNotUnderMigrationFault extends S.TaggedError<ReplicationGroupNotUnderMigrationFault>()(
  "ReplicationGroupNotUnderMigrationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReplicationGroupNotUnderMigrationFault",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class CacheSubnetGroupQuotaExceededFault extends S.TaggedError<CacheSubnetGroupQuotaExceededFault>()(
  "CacheSubnetGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheSubnetGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}
export class SubnetNotAllowedFault extends S.TaggedError<SubnetNotAllowedFault>()(
  "SubnetNotAllowedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetNotAllowedFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class NoOperationFault extends S.TaggedError<NoOperationFault>()(
  "NoOperationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NoOperationFault", httpResponseCode: 400 }),
).pipe(C.withBadRequestError) {}
export class ReplicationGroupAlreadyExistsFault extends S.TaggedError<ReplicationGroupAlreadyExistsFault>()(
  "ReplicationGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReplicationGroupAlreadyExists",
    httpResponseCode: 400,
  }),
).pipe(C.withBadRequestError) {}

//# Operations
/**
 * Returns a list of cache parameter group descriptions. If a cache parameter group name
 * is specified, the list contains only the descriptions for that group.
 */
export const describeCacheParameterGroups: {
  (
    input: DescribeCacheParameterGroupsMessage,
  ): Effect.Effect<
    CacheParameterGroupsMessage,
    | CacheParameterGroupNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCacheParameterGroupsMessage,
  ) => Stream.Stream<
    CacheParameterGroupsMessage,
    | CacheParameterGroupNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCacheParameterGroupsMessage,
  ) => Stream.Stream<
    CacheParameterGroup,
    | CacheParameterGroupNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeCacheParameterGroupsMessage,
  output: CacheParameterGroupsMessage,
  errors: [
    CacheParameterGroupNotFoundFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "CacheParameterGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns a list of cache security group descriptions. If a cache security group name is
 * specified, the list contains only the description of that group. This applicable only
 * when you have ElastiCache in Classic setup
 */
export const describeCacheSecurityGroups: {
  (
    input: DescribeCacheSecurityGroupsMessage,
  ): Effect.Effect<
    CacheSecurityGroupMessage,
    | CacheSecurityGroupNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCacheSecurityGroupsMessage,
  ) => Stream.Stream<
    CacheSecurityGroupMessage,
    | CacheSecurityGroupNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCacheSecurityGroupsMessage,
  ) => Stream.Stream<
    CacheSecurityGroup,
    | CacheSecurityGroupNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeCacheSecurityGroupsMessage,
  output: CacheSecurityGroupMessage,
  errors: [
    CacheSecurityGroupNotFoundFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "CacheSecurityGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns information about all provisioned clusters if no cluster identifier is
 * specified, or about a specific cache cluster if a cluster identifier is supplied.
 *
 * By default, abbreviated information about the clusters is returned. You can use the
 * optional *ShowCacheNodeInfo* flag to retrieve detailed information
 * about the cache nodes associated with the clusters. These details include the DNS
 * address and port for the cache node endpoint.
 *
 * If the cluster is in the *creating* state, only cluster-level
 * information is displayed until all of the nodes are successfully provisioned.
 *
 * If the cluster is in the *deleting* state, only cluster-level
 * information is displayed.
 *
 * If cache nodes are currently being added to the cluster, node endpoint information and
 * creation time for the additional nodes are not displayed until they are completely
 * provisioned. When the cluster state is *available*, the cluster is
 * ready for use.
 *
 * If cache nodes are currently being removed from the cluster, no endpoint information
 * for the removed nodes is displayed.
 */
export const describeCacheClusters: {
  (
    input: DescribeCacheClustersMessage,
  ): Effect.Effect<
    CacheClusterMessage,
    | CacheClusterNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCacheClustersMessage,
  ) => Stream.Stream<
    CacheClusterMessage,
    | CacheClusterNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCacheClustersMessage,
  ) => Stream.Stream<
    CacheCluster,
    | CacheClusterNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeCacheClustersMessage,
  output: CacheClusterMessage,
  errors: [
    CacheClusterNotFoundFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "CacheClusters",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Stop the service update. For more information on service updates and stopping them,
 * see Stopping
 * Service Updates.
 */
export const batchStopUpdateAction: (
  input: BatchStopUpdateActionMessage,
) => Effect.Effect<
  UpdateActionResultsMessage,
  InvalidParameterValueException | ServiceUpdateNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchStopUpdateActionMessage,
  output: UpdateActionResultsMessage,
  errors: [InvalidParameterValueException, ServiceUpdateNotFoundFault],
}));
/**
 * Deletes the specified cache parameter group. You cannot delete a cache parameter group
 * if it is associated with any cache clusters. You cannot delete the default cache
 * parameter groups in your account.
 */
export const deleteCacheParameterGroup: (
  input: DeleteCacheParameterGroupMessage,
) => Effect.Effect<
  DeleteCacheParameterGroupResponse,
  | CacheParameterGroupNotFoundFault
  | InvalidCacheParameterGroupStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCacheParameterGroupMessage,
  output: DeleteCacheParameterGroupResponse,
  errors: [
    CacheParameterGroupNotFoundFault,
    InvalidCacheParameterGroupStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
}));
/**
 * Deletes a cache security group.
 *
 * You cannot delete a cache security group if it is associated with any
 * clusters.
 */
export const deleteCacheSecurityGroup: (
  input: DeleteCacheSecurityGroupMessage,
) => Effect.Effect<
  DeleteCacheSecurityGroupResponse,
  | CacheSecurityGroupNotFoundFault
  | InvalidCacheSecurityGroupStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCacheSecurityGroupMessage,
  output: DeleteCacheSecurityGroupResponse,
  errors: [
    CacheSecurityGroupNotFoundFault,
    InvalidCacheSecurityGroupStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
}));
/**
 * Deletes a cache subnet group.
 *
 * You cannot delete a default cache subnet group or one that is associated with any
 * clusters.
 */
export const deleteCacheSubnetGroup: (
  input: DeleteCacheSubnetGroupMessage,
) => Effect.Effect<
  DeleteCacheSubnetGroupResponse,
  CacheSubnetGroupInUse | CacheSubnetGroupNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCacheSubnetGroupMessage,
  output: DeleteCacheSubnetGroupResponse,
  errors: [CacheSubnetGroupInUse, CacheSubnetGroupNotFoundFault],
}));
/**
 * Returns a list of the available cache engines and their versions.
 */
export const describeCacheEngineVersions: {
  (
    input: DescribeCacheEngineVersionsMessage,
  ): Effect.Effect<
    CacheEngineVersionMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCacheEngineVersionsMessage,
  ) => Stream.Stream<
    CacheEngineVersionMessage,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCacheEngineVersionsMessage,
  ) => Stream.Stream<
    CacheEngineVersion,
    CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeCacheEngineVersionsMessage,
  output: CacheEngineVersionMessage,
  errors: [],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "CacheEngineVersions",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns the default engine and system parameter information for the specified cache
 * engine.
 */
export const describeEngineDefaultParameters: {
  (
    input: DescribeEngineDefaultParametersMessage,
  ): Effect.Effect<
    DescribeEngineDefaultParametersResult,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEngineDefaultParametersMessage,
  ) => Stream.Stream<
    DescribeEngineDefaultParametersResult,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEngineDefaultParametersMessage,
  ) => Stream.Stream<
    unknown,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEngineDefaultParametersMessage,
  output: DescribeEngineDefaultParametersResult,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "EngineDefaults.Marker",
    items: "EngineDefaults.Parameters",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns events related to clusters, cache security groups, and cache parameter groups.
 * You can obtain events specific to a particular cluster, cache security group, or cache
 * parameter group by providing the name as a parameter.
 *
 * By default, only the events occurring within the last hour are returned; however, you
 * can retrieve up to 14 days' worth of events if necessary.
 */
export const describeEvents: {
  (
    input: DescribeEventsMessage,
  ): Effect.Effect<
    EventsMessage,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeEventsMessage,
  ) => Stream.Stream<
    EventsMessage,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeEventsMessage,
  ) => Stream.Stream<
    Event,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeEventsMessage,
  output: EventsMessage,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Events",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns details of the service updates
 */
export const describeServiceUpdates: {
  (
    input: DescribeServiceUpdatesMessage,
  ): Effect.Effect<
    ServiceUpdatesMessage,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceUpdateNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeServiceUpdatesMessage,
  ) => Stream.Stream<
    ServiceUpdatesMessage,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceUpdateNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeServiceUpdatesMessage,
  ) => Stream.Stream<
    ServiceUpdate,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServiceUpdateNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeServiceUpdatesMessage,
  output: ServiceUpdatesMessage,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceUpdateNotFoundFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ServiceUpdates",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Revokes ingress from a cache security group. Use this operation to disallow access
 * from an Amazon EC2 security group that had been previously authorized.
 */
export const revokeCacheSecurityGroupIngress: (
  input: RevokeCacheSecurityGroupIngressMessage,
) => Effect.Effect<
  RevokeCacheSecurityGroupIngressResult,
  | AuthorizationNotFoundFault
  | CacheSecurityGroupNotFoundFault
  | InvalidCacheSecurityGroupStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RevokeCacheSecurityGroupIngressMessage,
  output: RevokeCacheSecurityGroupIngressResult,
  errors: [
    AuthorizationNotFoundFault,
    CacheSecurityGroupNotFoundFault,
    InvalidCacheSecurityGroupStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
}));
/**
 * Apply the service update. For more information on service updates and applying them,
 * see Applying Service
 * Updates.
 */
export const batchApplyUpdateAction: (
  input: BatchApplyUpdateActionMessage,
) => Effect.Effect<
  UpdateActionResultsMessage,
  InvalidParameterValueException | ServiceUpdateNotFoundFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: BatchApplyUpdateActionMessage,
  output: UpdateActionResultsMessage,
  errors: [InvalidParameterValueException, ServiceUpdateNotFoundFault],
}));
/**
 * Returns information about a particular global replication group. If no identifier is
 * specified, returns information about all Global datastores.
 */
export const describeGlobalReplicationGroups: {
  (
    input: DescribeGlobalReplicationGroupsMessage,
  ): Effect.Effect<
    DescribeGlobalReplicationGroupsResult,
    | GlobalReplicationGroupNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeGlobalReplicationGroupsMessage,
  ) => Stream.Stream<
    DescribeGlobalReplicationGroupsResult,
    | GlobalReplicationGroupNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeGlobalReplicationGroupsMessage,
  ) => Stream.Stream<
    GlobalReplicationGroup,
    | GlobalReplicationGroupNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeGlobalReplicationGroupsMessage,
  output: DescribeGlobalReplicationGroupsResult,
  errors: [
    GlobalReplicationGroupNotFoundFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "GlobalReplicationGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns a list of cache subnet group descriptions. If a subnet group name is
 * specified, the list contains only the description of that group. This is applicable only
 * when you have ElastiCache in VPC setup. All ElastiCache clusters now launch in VPC by
 * default.
 */
export const describeCacheSubnetGroups: {
  (
    input: DescribeCacheSubnetGroupsMessage,
  ): Effect.Effect<
    CacheSubnetGroupMessage,
    CacheSubnetGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCacheSubnetGroupsMessage,
  ) => Stream.Stream<
    CacheSubnetGroupMessage,
    CacheSubnetGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCacheSubnetGroupsMessage,
  ) => Stream.Stream<
    CacheSubnetGroup,
    CacheSubnetGroupNotFoundFault | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeCacheSubnetGroupsMessage,
  output: CacheSubnetGroupMessage,
  errors: [CacheSubnetGroupNotFoundFault],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "CacheSubnetGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns information about a particular replication group. If no identifier is
 * specified, `DescribeReplicationGroups` returns information about all
 * replication groups.
 *
 * This operation is valid for Valkey or Redis OSS only.
 */
export const describeReplicationGroups: {
  (
    input: DescribeReplicationGroupsMessage,
  ): Effect.Effect<
    ReplicationGroupMessage,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReplicationGroupNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReplicationGroupsMessage,
  ) => Stream.Stream<
    ReplicationGroupMessage,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReplicationGroupNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReplicationGroupsMessage,
  ) => Stream.Stream<
    ReplicationGroup,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReplicationGroupNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReplicationGroupsMessage,
  output: ReplicationGroupMessage,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ReplicationGroupNotFoundFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ReplicationGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Returns information about a specific serverless cache.
 * If no identifier is specified, then the API returns information on all the serverless caches belonging to
 * this Amazon Web Services account.
 */
export const describeServerlessCaches: {
  (
    input: DescribeServerlessCachesRequest,
  ): Effect.Effect<
    DescribeServerlessCachesResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServerlessCacheNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeServerlessCachesRequest,
  ) => Stream.Stream<
    DescribeServerlessCachesResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServerlessCacheNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeServerlessCachesRequest,
  ) => Stream.Stream<
    ServerlessCache,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServerlessCacheNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeServerlessCachesRequest,
  output: DescribeServerlessCachesResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServerlessCacheNotFoundFault,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ServerlessCaches",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns information about cluster or replication group snapshots. By default,
 * `DescribeSnapshots` lists all of your snapshots; it can optionally
 * describe a single snapshot, or just the snapshots associated with a particular cache
 * cluster.
 *
 * This operation is valid for Valkey or Redis OSS only.
 */
export const describeSnapshots: {
  (
    input: DescribeSnapshotsMessage,
  ): Effect.Effect<
    DescribeSnapshotsListMessage,
    | CacheClusterNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | SnapshotNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeSnapshotsMessage,
  ) => Stream.Stream<
    DescribeSnapshotsListMessage,
    | CacheClusterNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | SnapshotNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeSnapshotsMessage,
  ) => Stream.Stream<
    Snapshot,
    | CacheClusterNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | SnapshotNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeSnapshotsMessage,
  output: DescribeSnapshotsListMessage,
  errors: [
    CacheClusterNotFoundFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    SnapshotNotFoundFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Snapshots",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Lists all available node types that you can scale with your cluster's replication
 * group's current node type.
 *
 * When you use the `ModifyCacheCluster` or
 * `ModifyReplicationGroup` operations to scale your cluster or replication
 * group, the value of the `CacheNodeType` parameter must be one of the node
 * types returned by this operation.
 */
export const listAllowedNodeTypeModifications: (
  input: ListAllowedNodeTypeModificationsMessage,
) => Effect.Effect<
  AllowedNodeTypeModificationsMessage,
  | CacheClusterNotFoundFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ReplicationGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListAllowedNodeTypeModificationsMessage,
  output: AllowedNodeTypeModificationsMessage,
  errors: [
    CacheClusterNotFoundFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ReplicationGroupNotFoundFault,
  ],
}));
/**
 * Reboots some, or all, of the cache nodes within a provisioned cluster. This operation
 * applies any modified cache parameter groups to the cluster. The reboot operation takes
 * place as soon as possible, and results in a momentary outage to the cluster. During the
 * reboot, the cluster status is set to REBOOTING.
 *
 * The reboot causes the contents of the cache (for each cache node being rebooted) to be
 * lost.
 *
 * When the reboot is complete, a cluster event is created.
 *
 * Rebooting a cluster is currently supported on Memcached, Valkey and Redis OSS (cluster mode
 * disabled) clusters. Rebooting is not supported on Valkey or Redis OSS (cluster mode enabled)
 * clusters.
 *
 * If you make changes to parameters that require a Valkey or Redis OSS (cluster mode enabled) cluster
 * reboot for the changes to be applied, see Rebooting a Cluster for an alternate process.
 */
export const rebootCacheCluster: (
  input: RebootCacheClusterMessage,
) => Effect.Effect<
  RebootCacheClusterResult,
  CacheClusterNotFoundFault | InvalidCacheClusterStateFault | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootCacheClusterMessage,
  output: RebootCacheClusterResult,
  errors: [CacheClusterNotFoundFault, InvalidCacheClusterStateFault],
}));
/**
 * Deletes an existing snapshot. When you receive a successful response from this
 * operation, ElastiCache immediately begins deleting the snapshot; you cannot cancel or
 * revert this operation.
 *
 * This operation is valid for Valkey or Redis OSS only.
 */
export const deleteSnapshot: (
  input: DeleteSnapshotMessage,
) => Effect.Effect<
  DeleteSnapshotResult,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidSnapshotStateFault
  | SnapshotNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteSnapshotMessage,
  output: DeleteSnapshotResult,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidSnapshotStateFault,
    SnapshotNotFoundFault,
  ],
}));
/**
 * Decreases the number of node groups in a Global datastore
 */
export const decreaseNodeGroupsInGlobalReplicationGroup: (
  input: DecreaseNodeGroupsInGlobalReplicationGroupMessage,
) => Effect.Effect<
  DecreaseNodeGroupsInGlobalReplicationGroupResult,
  | GlobalReplicationGroupNotFoundFault
  | InvalidGlobalReplicationGroupStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DecreaseNodeGroupsInGlobalReplicationGroupMessage,
  output: DecreaseNodeGroupsInGlobalReplicationGroupResult,
  errors: [
    GlobalReplicationGroupNotFoundFault,
    InvalidGlobalReplicationGroupStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
}));
/**
 * Deletes an existing serverless cache snapshot. Available for Valkey, Redis OSS and Serverless Memcached only.
 */
export const deleteServerlessCacheSnapshot: (
  input: DeleteServerlessCacheSnapshotRequest,
) => Effect.Effect<
  DeleteServerlessCacheSnapshotResponse,
  | InvalidParameterValueException
  | InvalidServerlessCacheSnapshotStateFault
  | ServerlessCacheSnapshotNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServerlessCacheSnapshotRequest,
  output: DeleteServerlessCacheSnapshotResponse,
  errors: [
    InvalidParameterValueException,
    InvalidServerlessCacheSnapshotStateFault,
    ServerlessCacheSnapshotNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Returns the detailed parameter list for a particular cache parameter group.
 */
export const describeCacheParameters: {
  (
    input: DescribeCacheParametersMessage,
  ): Effect.Effect<
    CacheParameterGroupDetails,
    | CacheParameterGroupNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeCacheParametersMessage,
  ) => Stream.Stream<
    CacheParameterGroupDetails,
    | CacheParameterGroupNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeCacheParametersMessage,
  ) => Stream.Stream<
    Parameter,
    | CacheParameterGroupNotFoundFault
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeCacheParametersMessage,
  output: CacheParameterGroupDetails,
  errors: [
    CacheParameterGroupNotFoundFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Parameters",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Lists available reserved cache node offerings.
 */
export const describeReservedCacheNodesOfferings: {
  (
    input: DescribeReservedCacheNodesOfferingsMessage,
  ): Effect.Effect<
    ReservedCacheNodesOfferingMessage,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReservedCacheNodesOfferingNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedCacheNodesOfferingsMessage,
  ) => Stream.Stream<
    ReservedCacheNodesOfferingMessage,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReservedCacheNodesOfferingNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedCacheNodesOfferingsMessage,
  ) => Stream.Stream<
    ReservedCacheNodesOffering,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReservedCacheNodesOfferingNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReservedCacheNodesOfferingsMessage,
  output: ReservedCacheNodesOfferingMessage,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ReservedCacheNodesOfferingNotFoundFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ReservedCacheNodesOfferings",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Async API to test connection between source and target replication group.
 */
export const testMigration: (
  input: TestMigrationMessage,
) => Effect.Effect<
  TestMigrationResponse,
  | InvalidParameterValueException
  | InvalidReplicationGroupStateFault
  | ReplicationGroupAlreadyUnderMigrationFault
  | ReplicationGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestMigrationMessage,
  output: TestMigrationResponse,
  errors: [
    InvalidParameterValueException,
    InvalidReplicationGroupStateFault,
    ReplicationGroupAlreadyUnderMigrationFault,
    ReplicationGroupNotFoundFault,
  ],
}));
/**
 * Increase the number of node groups in the Global datastore
 */
export const increaseNodeGroupsInGlobalReplicationGroup: (
  input: IncreaseNodeGroupsInGlobalReplicationGroupMessage,
) => Effect.Effect<
  IncreaseNodeGroupsInGlobalReplicationGroupResult,
  | GlobalReplicationGroupNotFoundFault
  | InvalidGlobalReplicationGroupStateFault
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IncreaseNodeGroupsInGlobalReplicationGroupMessage,
  output: IncreaseNodeGroupsInGlobalReplicationGroupResult,
  errors: [
    GlobalReplicationGroupNotFoundFault,
    InvalidGlobalReplicationGroupStateFault,
    InvalidParameterValueException,
  ],
}));
/**
 * Deleting a Global datastore is a two-step process:
 *
 * - First, you must DisassociateGlobalReplicationGroup to remove
 * the secondary clusters in the Global datastore.
 *
 * - Once the Global datastore contains only the primary cluster, you can use the
 * `DeleteGlobalReplicationGroup` API to delete the Global datastore
 * while retainining the primary cluster using
 * `RetainPrimaryReplicationGroup=true`.
 *
 * Since the Global Datastore has only a primary cluster, you can delete the Global
 * Datastore while retaining the primary by setting
 * `RetainPrimaryReplicationGroup=true`. The primary cluster is never
 * deleted when deleting a Global Datastore. It can only be deleted when it no longer is
 * associated with any Global Datastore.
 *
 * When you receive a successful response from this operation, Amazon ElastiCache
 * immediately begins deleting the selected resources; you cannot cancel or revert this
 * operation.
 */
export const deleteGlobalReplicationGroup: (
  input: DeleteGlobalReplicationGroupMessage,
) => Effect.Effect<
  DeleteGlobalReplicationGroupResult,
  | GlobalReplicationGroupNotFoundFault
  | InvalidGlobalReplicationGroupStateFault
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteGlobalReplicationGroupMessage,
  output: DeleteGlobalReplicationGroupResult,
  errors: [
    GlobalReplicationGroupNotFoundFault,
    InvalidGlobalReplicationGroupStateFault,
    InvalidParameterValueException,
  ],
}));
/**
 * Remove a secondary cluster from the Global datastore using the Global datastore name.
 * The secondary cluster will no longer receive updates from the primary cluster, but will
 * remain as a standalone cluster in that Amazon region.
 */
export const disassociateGlobalReplicationGroup: (
  input: DisassociateGlobalReplicationGroupMessage,
) => Effect.Effect<
  DisassociateGlobalReplicationGroupResult,
  | GlobalReplicationGroupNotFoundFault
  | InvalidGlobalReplicationGroupStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DisassociateGlobalReplicationGroupMessage,
  output: DisassociateGlobalReplicationGroupResult,
  errors: [
    GlobalReplicationGroupNotFoundFault,
    InvalidGlobalReplicationGroupStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
}));
/**
 * Used to failover the primary region to a secondary region. The secondary region will
 * become primary, and all other clusters will become secondary.
 */
export const failoverGlobalReplicationGroup: (
  input: FailoverGlobalReplicationGroupMessage,
) => Effect.Effect<
  FailoverGlobalReplicationGroupResult,
  | GlobalReplicationGroupNotFoundFault
  | InvalidGlobalReplicationGroupStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: FailoverGlobalReplicationGroupMessage,
  output: FailoverGlobalReplicationGroupResult,
  errors: [
    GlobalReplicationGroupNotFoundFault,
    InvalidGlobalReplicationGroupStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
}));
/**
 * Modifies the settings for a Global datastore.
 */
export const modifyGlobalReplicationGroup: (
  input: ModifyGlobalReplicationGroupMessage,
) => Effect.Effect<
  ModifyGlobalReplicationGroupResult,
  | GlobalReplicationGroupNotFoundFault
  | InvalidGlobalReplicationGroupStateFault
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyGlobalReplicationGroupMessage,
  output: ModifyGlobalReplicationGroupResult,
  errors: [
    GlobalReplicationGroupNotFoundFault,
    InvalidGlobalReplicationGroupStateFault,
    InvalidParameterValueException,
  ],
}));
/**
 * Redistribute slots to ensure uniform distribution across existing shards in the
 * cluster.
 */
export const rebalanceSlotsInGlobalReplicationGroup: (
  input: RebalanceSlotsInGlobalReplicationGroupMessage,
) => Effect.Effect<
  RebalanceSlotsInGlobalReplicationGroupResult,
  | GlobalReplicationGroupNotFoundFault
  | InvalidGlobalReplicationGroupStateFault
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebalanceSlotsInGlobalReplicationGroupMessage,
  output: RebalanceSlotsInGlobalReplicationGroupResult,
  errors: [
    GlobalReplicationGroupNotFoundFault,
    InvalidGlobalReplicationGroupStateFault,
    InvalidParameterValueException,
  ],
}));
/**
 * Modifies the parameters of a cache parameter group. You can modify up to 20 parameters
 * in a single request by submitting a list parameter name and value pairs.
 */
export const modifyCacheParameterGroup: (
  input: ModifyCacheParameterGroupMessage,
) => Effect.Effect<
  CacheParameterGroupNameMessage,
  | CacheParameterGroupNotFoundFault
  | InvalidCacheParameterGroupStateFault
  | InvalidGlobalReplicationGroupStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyCacheParameterGroupMessage,
  output: CacheParameterGroupNameMessage,
  errors: [
    CacheParameterGroupNotFoundFault,
    InvalidCacheParameterGroupStateFault,
    InvalidGlobalReplicationGroupStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
}));
/**
 * Modifies the parameters of a cache parameter group to the engine or system default
 * value. You can reset specific parameters by submitting a list of parameter names. To
 * reset the entire cache parameter group, specify the `ResetAllParameters` and
 * `CacheParameterGroupName` parameters.
 */
export const resetCacheParameterGroup: (
  input: ResetCacheParameterGroupMessage,
) => Effect.Effect<
  CacheParameterGroupNameMessage,
  | CacheParameterGroupNotFoundFault
  | InvalidCacheParameterGroupStateFault
  | InvalidGlobalReplicationGroupStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ResetCacheParameterGroupMessage,
  output: CacheParameterGroupNameMessage,
  errors: [
    CacheParameterGroupNotFoundFault,
    InvalidCacheParameterGroupStateFault,
    InvalidGlobalReplicationGroupStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
}));
/**
 * Provides the functionality to export the serverless cache snapshot data to Amazon S3. Available for Valkey and Redis OSS only.
 */
export const exportServerlessCacheSnapshot: (
  input: ExportServerlessCacheSnapshotRequest,
) => Effect.Effect<
  ExportServerlessCacheSnapshotResponse,
  | InvalidParameterValueException
  | InvalidServerlessCacheSnapshotStateFault
  | ServerlessCacheSnapshotNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ExportServerlessCacheSnapshotRequest,
  output: ExportServerlessCacheSnapshotResponse,
  errors: [
    InvalidParameterValueException,
    InvalidServerlessCacheSnapshotStateFault,
    ServerlessCacheSnapshotNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Returns information about serverless cache snapshots.
 * By default, this API lists all of the customer’s serverless cache snapshots.
 * It can also describe a single serverless cache snapshot, or the snapshots associated with
 * a particular serverless cache. Available for Valkey, Redis OSS and Serverless Memcached only.
 */
export const describeServerlessCacheSnapshots: {
  (
    input: DescribeServerlessCacheSnapshotsRequest,
  ): Effect.Effect<
    DescribeServerlessCacheSnapshotsResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServerlessCacheNotFoundFault
    | ServerlessCacheSnapshotNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeServerlessCacheSnapshotsRequest,
  ) => Stream.Stream<
    DescribeServerlessCacheSnapshotsResponse,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServerlessCacheNotFoundFault
    | ServerlessCacheSnapshotNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeServerlessCacheSnapshotsRequest,
  ) => Stream.Stream<
    ServerlessCacheSnapshot,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ServerlessCacheNotFoundFault
    | ServerlessCacheSnapshotNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeServerlessCacheSnapshotsRequest,
  output: DescribeServerlessCacheSnapshotsResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServerlessCacheNotFoundFault,
    ServerlessCacheSnapshotNotFoundFault,
  ],
  pagination: {
    inputToken: "NextToken",
    outputToken: "NextToken",
    items: "ServerlessCacheSnapshots",
    pageSize: "MaxResults",
  } as const,
}));
/**
 * Returns a list of user groups.
 */
export const describeUserGroups: {
  (
    input: DescribeUserGroupsMessage,
  ): Effect.Effect<
    DescribeUserGroupsResult,
    | InvalidParameterCombinationException
    | ServiceLinkedRoleNotFoundFault
    | UserGroupNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeUserGroupsMessage,
  ) => Stream.Stream<
    DescribeUserGroupsResult,
    | InvalidParameterCombinationException
    | ServiceLinkedRoleNotFoundFault
    | UserGroupNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeUserGroupsMessage,
  ) => Stream.Stream<
    UserGroup,
    | InvalidParameterCombinationException
    | ServiceLinkedRoleNotFoundFault
    | UserGroupNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeUserGroupsMessage,
  output: DescribeUserGroupsResult,
  errors: [
    InvalidParameterCombinationException,
    ServiceLinkedRoleNotFoundFault,
    UserGroupNotFoundFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "UserGroups",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Start the migration of data.
 */
export const startMigration: (
  input: StartMigrationMessage,
) => Effect.Effect<
  StartMigrationResponse,
  | InvalidParameterValueException
  | InvalidReplicationGroupStateFault
  | ReplicationGroupAlreadyUnderMigrationFault
  | ReplicationGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: StartMigrationMessage,
  output: StartMigrationResponse,
  errors: [
    InvalidParameterValueException,
    InvalidReplicationGroupStateFault,
    ReplicationGroupAlreadyUnderMigrationFault,
    ReplicationGroupNotFoundFault,
  ],
}));
/**
 * Deletes a specified existing serverless cache.
 *
 * `CreateServerlessCacheSnapshot` permission is required to create a final snapshot.
 * Without this permission, the API call will fail with an `Access Denied` exception.
 */
export const deleteServerlessCache: (
  input: DeleteServerlessCacheRequest,
) => Effect.Effect<
  DeleteServerlessCacheResponse,
  | InvalidCredentialsException
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidServerlessCacheStateFault
  | ServerlessCacheNotFoundFault
  | ServerlessCacheSnapshotAlreadyExistsFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteServerlessCacheRequest,
  output: DeleteServerlessCacheResponse,
  errors: [
    InvalidCredentialsException,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidServerlessCacheStateFault,
    ServerlessCacheNotFoundFault,
    ServerlessCacheSnapshotAlreadyExistsFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Returns a list of users.
 */
export const describeUsers: {
  (
    input: DescribeUsersMessage,
  ): Effect.Effect<
    DescribeUsersResult,
    | InvalidParameterCombinationException
    | ServiceLinkedRoleNotFoundFault
    | UserNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeUsersMessage,
  ) => Stream.Stream<
    DescribeUsersResult,
    | InvalidParameterCombinationException
    | ServiceLinkedRoleNotFoundFault
    | UserNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeUsersMessage,
  ) => Stream.Stream<
    User,
    | InvalidParameterCombinationException
    | ServiceLinkedRoleNotFoundFault
    | UserNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeUsersMessage,
  output: DescribeUsersResult,
  errors: [
    InvalidParameterCombinationException,
    ServiceLinkedRoleNotFoundFault,
    UserNotFoundFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "Users",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * This API modifies the attributes of a serverless cache.
 */
export const modifyServerlessCache: (
  input: ModifyServerlessCacheRequest,
) => Effect.Effect<
  ModifyServerlessCacheResponse,
  | InvalidCredentialsException
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidServerlessCacheStateFault
  | InvalidUserGroupStateFault
  | ServerlessCacheNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | UserGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyServerlessCacheRequest,
  output: ModifyServerlessCacheResponse,
  errors: [
    InvalidCredentialsException,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidServerlessCacheStateFault,
    InvalidUserGroupStateFault,
    ServerlessCacheNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
    UserGroupNotFoundFault,
  ],
}));
/**
 * For Valkey engine version 7.2 onwards and Redis OSS 6.0 onwards: Deletes a user group. The user group must first
 * be disassociated from the replication group before it can be deleted. For more
 * information, see Using Role Based Access Control (RBAC).
 */
export const deleteUserGroup: (
  input: DeleteUserGroupMessage,
) => Effect.Effect<
  UserGroup,
  | InvalidParameterValueException
  | InvalidUserGroupStateFault
  | ServiceLinkedRoleNotFoundFault
  | UserGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserGroupMessage,
  output: UserGroup,
  errors: [
    InvalidParameterValueException,
    InvalidUserGroupStateFault,
    ServiceLinkedRoleNotFoundFault,
    UserGroupNotFoundFault,
  ],
}));
/**
 * Changes the list of users that belong to the user group.
 */
export const modifyUserGroup: (
  input: ModifyUserGroupMessage,
) => Effect.Effect<
  UserGroup,
  | DefaultUserRequired
  | DuplicateUserNameFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidUserGroupStateFault
  | ServiceLinkedRoleNotFoundFault
  | UserGroupNotFoundFault
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyUserGroupMessage,
  output: UserGroup,
  errors: [
    DefaultUserRequired,
    DuplicateUserNameFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidUserGroupStateFault,
    ServiceLinkedRoleNotFoundFault,
    UserGroupNotFoundFault,
    UserNotFoundFault,
  ],
}));
/**
 * Creates a new cache security group. Use a cache security group to control access to
 * one or more clusters.
 *
 * Cache security groups are only used when you are creating a cluster outside of an
 * Amazon Virtual Private Cloud (Amazon VPC). If you are creating a cluster inside of a
 * VPC, use a cache subnet group instead. For more information, see CreateCacheSubnetGroup.
 */
export const createCacheSecurityGroup: (
  input: CreateCacheSecurityGroupMessage,
) => Effect.Effect<
  CreateCacheSecurityGroupResult,
  | CacheSecurityGroupAlreadyExistsFault
  | CacheSecurityGroupQuotaExceededFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCacheSecurityGroupMessage,
  output: CreateCacheSecurityGroupResult,
  errors: [
    CacheSecurityGroupAlreadyExistsFault,
    CacheSecurityGroupQuotaExceededFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Allows you to purchase a reserved cache node offering. Reserved nodes are not eligible
 * for cancellation and are non-refundable. For more information, see Managing Costs with Reserved Nodes.
 */
export const purchaseReservedCacheNodesOffering: (
  input: PurchaseReservedCacheNodesOfferingMessage,
) => Effect.Effect<
  PurchaseReservedCacheNodesOfferingResult,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ReservedCacheNodeAlreadyExistsFault
  | ReservedCacheNodeQuotaExceededFault
  | ReservedCacheNodesOfferingNotFoundFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: PurchaseReservedCacheNodesOfferingMessage,
  output: PurchaseReservedCacheNodesOfferingResult,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ReservedCacheNodeAlreadyExistsFault,
    ReservedCacheNodeQuotaExceededFault,
    ReservedCacheNodesOfferingNotFoundFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Changes user password(s) and/or access string.
 */
export const modifyUser: (
  input: ModifyUserMessage,
) => Effect.Effect<
  User,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidUserStateFault
  | ServiceLinkedRoleNotFoundFault
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyUserMessage,
  output: User,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidUserStateFault,
    ServiceLinkedRoleNotFoundFault,
    UserNotFoundFault,
  ],
}));
/**
 * For Valkey engine version 7.2 onwards and Redis OSS 6.0 onwards: Deletes a user. The user will be removed from
 * all user groups and in turn removed from all replication groups. For more information,
 * see Using Role Based Access Control (RBAC).
 */
export const deleteUser: (
  input: DeleteUserMessage,
) => Effect.Effect<
  User,
  | DefaultUserAssociatedToUserGroupFault
  | InvalidParameterValueException
  | InvalidUserStateFault
  | ServiceLinkedRoleNotFoundFault
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteUserMessage,
  output: User,
  errors: [
    DefaultUserAssociatedToUserGroupFault,
    InvalidParameterValueException,
    InvalidUserStateFault,
    ServiceLinkedRoleNotFoundFault,
    UserNotFoundFault,
  ],
}));
/**
 * Allows network ingress to a cache security group. Applications using ElastiCache must
 * be running on Amazon EC2, and Amazon EC2 security groups are used as the authorization
 * mechanism.
 *
 * You cannot authorize ingress from an Amazon EC2 security group in one region to an
 * ElastiCache cluster in another region.
 */
export const authorizeCacheSecurityGroupIngress: (
  input: AuthorizeCacheSecurityGroupIngressMessage,
) => Effect.Effect<
  AuthorizeCacheSecurityGroupIngressResult,
  | AuthorizationAlreadyExistsFault
  | CacheSecurityGroupNotFoundFault
  | InvalidCacheSecurityGroupStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AuthorizeCacheSecurityGroupIngressMessage,
  output: AuthorizeCacheSecurityGroupIngressResult,
  errors: [
    AuthorizationAlreadyExistsFault,
    CacheSecurityGroupNotFoundFault,
    InvalidCacheSecurityGroupStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
}));
/**
 * Creates a new Amazon ElastiCache cache parameter group. An ElastiCache cache parameter
 * group is a collection of parameters and their values that are applied to all of the
 * nodes in any cluster or replication group using the CacheParameterGroup.
 *
 * A newly created CacheParameterGroup is an exact duplicate of the default parameter
 * group for the CacheParameterGroupFamily. To customize the newly created
 * CacheParameterGroup you can change the values of specific parameters. For more
 * information, see:
 *
 * - ModifyCacheParameterGroup in the ElastiCache API Reference.
 *
 * - Parameters and
 * Parameter Groups in the ElastiCache User Guide.
 */
export const createCacheParameterGroup: (
  input: CreateCacheParameterGroupMessage,
) => Effect.Effect<
  CreateCacheParameterGroupResult,
  | CacheParameterGroupAlreadyExistsFault
  | CacheParameterGroupQuotaExceededFault
  | InvalidCacheParameterGroupStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCacheParameterGroupMessage,
  output: CreateCacheParameterGroupResult,
  errors: [
    CacheParameterGroupAlreadyExistsFault,
    CacheParameterGroupQuotaExceededFault,
    InvalidCacheParameterGroupStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Global Datastore offers fully managed, fast, reliable and secure
 * cross-region replication. Using Global Datastore with Valkey or Redis OSS, you can create cross-region
 * read replica clusters for ElastiCache to enable low-latency reads and disaster
 * recovery across regions. For more information, see Replication
 * Across Regions Using Global Datastore.
 *
 * - The **GlobalReplicationGroupIdSuffix** is the
 * name of the Global datastore.
 *
 * - The **PrimaryReplicationGroupId** represents the
 * name of the primary cluster that accepts writes and will replicate updates to
 * the secondary cluster.
 */
export const createGlobalReplicationGroup: (
  input: CreateGlobalReplicationGroupMessage,
) => Effect.Effect<
  CreateGlobalReplicationGroupResult,
  | GlobalReplicationGroupAlreadyExistsFault
  | InvalidParameterValueException
  | InvalidReplicationGroupStateFault
  | ReplicationGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateGlobalReplicationGroupMessage,
  output: CreateGlobalReplicationGroupResult,
  errors: [
    GlobalReplicationGroupAlreadyExistsFault,
    InvalidParameterValueException,
    InvalidReplicationGroupStateFault,
    ReplicationGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
/**
 * Returns information about reserved cache nodes for this account, or about a specified
 * reserved cache node.
 */
export const describeReservedCacheNodes: {
  (
    input: DescribeReservedCacheNodesMessage,
  ): Effect.Effect<
    ReservedCacheNodeMessage,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReservedCacheNodeNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeReservedCacheNodesMessage,
  ) => Stream.Stream<
    ReservedCacheNodeMessage,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReservedCacheNodeNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeReservedCacheNodesMessage,
  ) => Stream.Stream<
    ReservedCacheNode,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | ReservedCacheNodeNotFoundFault
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeReservedCacheNodesMessage,
  output: ReservedCacheNodeMessage,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ReservedCacheNodeNotFoundFault,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "ReservedCacheNodes",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * A tag is a key-value pair where the key and value are case-sensitive. You can use tags
 * to categorize and track all your ElastiCache resources, with the exception of global
 * replication group. When you add or remove tags on replication groups, those actions will
 * be replicated to all nodes in the replication group. For more information, see Resource-level permissions.
 *
 * For example, you can use cost-allocation tags to your ElastiCache resources, Amazon
 * generates a cost allocation report as a comma-separated value (CSV) file with your usage
 * and costs aggregated by your tags. You can apply tags that represent business categories
 * (such as cost centers, application names, or owners) to organize your costs across
 * multiple services.
 *
 * For more information, see Using Cost Allocation Tags in
 * Amazon ElastiCache in the ElastiCache User
 * Guide.
 */
export const addTagsToResource: (
  input: AddTagsToResourceMessage,
) => Effect.Effect<
  TagListMessage,
  | CacheClusterNotFoundFault
  | CacheParameterGroupNotFoundFault
  | CacheSecurityGroupNotFoundFault
  | CacheSubnetGroupNotFoundFault
  | InvalidARNFault
  | InvalidReplicationGroupStateFault
  | InvalidServerlessCacheSnapshotStateFault
  | InvalidServerlessCacheStateFault
  | ReplicationGroupNotFoundFault
  | ReservedCacheNodeNotFoundFault
  | ServerlessCacheNotFoundFault
  | ServerlessCacheSnapshotNotFoundFault
  | SnapshotNotFoundFault
  | TagQuotaPerResourceExceeded
  | UserGroupNotFoundFault
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: AddTagsToResourceMessage,
  output: TagListMessage,
  errors: [
    CacheClusterNotFoundFault,
    CacheParameterGroupNotFoundFault,
    CacheSecurityGroupNotFoundFault,
    CacheSubnetGroupNotFoundFault,
    InvalidARNFault,
    InvalidReplicationGroupStateFault,
    InvalidServerlessCacheSnapshotStateFault,
    InvalidServerlessCacheStateFault,
    ReplicationGroupNotFoundFault,
    ReservedCacheNodeNotFoundFault,
    ServerlessCacheNotFoundFault,
    ServerlessCacheSnapshotNotFoundFault,
    SnapshotNotFoundFault,
    TagQuotaPerResourceExceeded,
    UserGroupNotFoundFault,
    UserNotFoundFault,
  ],
}));
/**
 * Lists all tags currently on a named resource.
 *
 * A tag is a key-value pair where the key and value are case-sensitive. You can use
 * tags to categorize and track all your ElastiCache resources, with the exception of
 * global replication group. When you add or remove tags on replication groups, those
 * actions will be replicated to all nodes in the replication group. For more information,
 * see Resource-level permissions.
 *
 * If the cluster is not in the *available* state,
 * `ListTagsForResource` returns an error.
 */
export const listTagsForResource: (
  input: ListTagsForResourceMessage,
) => Effect.Effect<
  TagListMessage,
  | CacheClusterNotFoundFault
  | CacheParameterGroupNotFoundFault
  | CacheSecurityGroupNotFoundFault
  | CacheSubnetGroupNotFoundFault
  | InvalidARNFault
  | InvalidReplicationGroupStateFault
  | InvalidServerlessCacheSnapshotStateFault
  | InvalidServerlessCacheStateFault
  | ReplicationGroupNotFoundFault
  | ReservedCacheNodeNotFoundFault
  | ServerlessCacheNotFoundFault
  | ServerlessCacheSnapshotNotFoundFault
  | SnapshotNotFoundFault
  | UserGroupNotFoundFault
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ListTagsForResourceMessage,
  output: TagListMessage,
  errors: [
    CacheClusterNotFoundFault,
    CacheParameterGroupNotFoundFault,
    CacheSecurityGroupNotFoundFault,
    CacheSubnetGroupNotFoundFault,
    InvalidARNFault,
    InvalidReplicationGroupStateFault,
    InvalidServerlessCacheSnapshotStateFault,
    InvalidServerlessCacheStateFault,
    ReplicationGroupNotFoundFault,
    ReservedCacheNodeNotFoundFault,
    ServerlessCacheNotFoundFault,
    ServerlessCacheSnapshotNotFoundFault,
    SnapshotNotFoundFault,
    UserGroupNotFoundFault,
    UserNotFoundFault,
  ],
}));
/**
 * Makes a copy of an existing snapshot.
 *
 * This operation is valid for Valkey or Redis OSS only.
 *
 * Users or groups that have permissions to use the `CopySnapshot`
 * operation can create their own Amazon S3 buckets and copy snapshots to it. To
 * control access to your snapshots, use an IAM policy to control who has the ability
 * to use the `CopySnapshot` operation. For more information about using IAM
 * to control the use of ElastiCache operations, see Exporting
 * Snapshots and Authentication & Access
 * Control.
 *
 * You could receive the following error messages.
 *
 * **Error Messages**
 *
 * - **Error Message:** The S3 bucket %s is outside of
 * the region.
 *
 * **Solution:** Create an Amazon S3 bucket in the
 * same region as your snapshot. For more information, see Step 1: Create an Amazon S3 Bucket in the ElastiCache User
 * Guide.
 *
 * - **Error Message:** The S3 bucket %s does not
 * exist.
 *
 * **Solution:** Create an Amazon S3 bucket in the
 * same region as your snapshot. For more information, see Step 1: Create an Amazon S3 Bucket in the ElastiCache User
 * Guide.
 *
 * - **Error Message:** The S3 bucket %s is not owned
 * by the authenticated user.
 *
 * **Solution:** Create an Amazon S3 bucket in the
 * same region as your snapshot. For more information, see Step 1: Create an Amazon S3 Bucket in the ElastiCache User
 * Guide.
 *
 * - **Error Message:** The authenticated user does
 * not have sufficient permissions to perform the desired activity.
 *
 * **Solution:** Contact your system administrator
 * to get the needed permissions.
 *
 * - **Error Message:** The S3 bucket %s already
 * contains an object with key %s.
 *
 * **Solution:** Give the
 * `TargetSnapshotName` a new and unique value. If exporting a
 * snapshot, you could alternatively create a new Amazon S3 bucket and use this
 * same value for `TargetSnapshotName`.
 *
 * - **Error Message: ** ElastiCache has not been
 * granted READ permissions %s on the S3 Bucket.
 *
 * **Solution:** Add List and Read permissions on
 * the bucket. For more information, see Step 2: Grant ElastiCache Access to Your Amazon S3 Bucket in the
 * ElastiCache User Guide.
 *
 * - **Error Message: ** ElastiCache has not been
 * granted WRITE permissions %s on the S3 Bucket.
 *
 * **Solution:** Add Upload/Delete permissions on
 * the bucket. For more information, see Step 2: Grant ElastiCache Access to Your Amazon S3 Bucket in the
 * ElastiCache User Guide.
 *
 * - **Error Message: ** ElastiCache has not been
 * granted READ_ACP permissions %s on the S3 Bucket.
 *
 * **Solution:** Add View Permissions on the bucket.
 * For more information, see Step 2: Grant ElastiCache Access to Your Amazon S3 Bucket in the
 * ElastiCache User Guide.
 */
export const copySnapshot: (
  input: CopySnapshotMessage,
) => Effect.Effect<
  CopySnapshotResult,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidSnapshotStateFault
  | SnapshotAlreadyExistsFault
  | SnapshotNotFoundFault
  | SnapshotQuotaExceededFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopySnapshotMessage,
  output: CopySnapshotResult,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidSnapshotStateFault,
    SnapshotAlreadyExistsFault,
    SnapshotNotFoundFault,
    SnapshotQuotaExceededFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Deletes an existing replication group. By default, this operation deletes the entire
 * replication group, including the primary/primaries and all of the read replicas. If the
 * replication group has only one primary, you can optionally delete only the read
 * replicas, while retaining the primary by setting
 * `RetainPrimaryCluster=true`.
 *
 * When you receive a successful response from this operation, Amazon ElastiCache
 * immediately begins deleting the selected resources; you cannot cancel or revert this
 * operation.
 *
 * - `CreateSnapshot` permission is required to create a final snapshot.
 * Without this permission, the API call will fail with an `Access Denied` exception.
 *
 * - This operation is valid for Redis OSS only.
 */
export const deleteReplicationGroup: (
  input: DeleteReplicationGroupMessage,
) => Effect.Effect<
  DeleteReplicationGroupResult,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidReplicationGroupStateFault
  | ReplicationGroupNotFoundFault
  | SnapshotAlreadyExistsFault
  | SnapshotFeatureNotSupportedFault
  | SnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteReplicationGroupMessage,
  output: DeleteReplicationGroupResult,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidReplicationGroupStateFault,
    ReplicationGroupNotFoundFault,
    SnapshotAlreadyExistsFault,
    SnapshotFeatureNotSupportedFault,
    SnapshotQuotaExceededFault,
  ],
}));
/**
 * Deletes a previously provisioned cluster. `DeleteCacheCluster` deletes all
 * associated cache nodes, node endpoints and the cluster itself. When you receive a
 * successful response from this operation, Amazon ElastiCache immediately begins deleting
 * the cluster; you cannot cancel or revert this operation.
 *
 * This operation is not valid for:
 *
 * - Valkey or Redis OSS (cluster mode enabled) clusters
 *
 * - Valkey or Redis OSS (cluster mode disabled) clusters
 *
 * - A cluster that is the last read replica of a replication group
 *
 * - A cluster that is the primary node of a replication group
 *
 * - A node group (shard) that has Multi-AZ mode enabled
 *
 * - A cluster from a Valkey or Redis OSS (cluster mode enabled) replication group
 *
 * - A cluster that is not in the `available` state
 */
export const deleteCacheCluster: (
  input: DeleteCacheClusterMessage,
) => Effect.Effect<
  DeleteCacheClusterResult,
  | CacheClusterNotFoundFault
  | InvalidCacheClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | SnapshotAlreadyExistsFault
  | SnapshotFeatureNotSupportedFault
  | SnapshotQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DeleteCacheClusterMessage,
  output: DeleteCacheClusterResult,
  errors: [
    CacheClusterNotFoundFault,
    InvalidCacheClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    SnapshotAlreadyExistsFault,
    SnapshotFeatureNotSupportedFault,
    SnapshotQuotaExceededFault,
  ],
}));
/**
 * This API creates a copy of an entire ServerlessCache at a specific moment in time. Available for Valkey, Redis OSS and Serverless Memcached only.
 */
export const createServerlessCacheSnapshot: (
  input: CreateServerlessCacheSnapshotRequest,
) => Effect.Effect<
  CreateServerlessCacheSnapshotResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidServerlessCacheStateFault
  | ServerlessCacheNotFoundFault
  | ServerlessCacheSnapshotAlreadyExistsFault
  | ServerlessCacheSnapshotQuotaExceededFault
  | ServiceLinkedRoleNotFoundFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServerlessCacheSnapshotRequest,
  output: CreateServerlessCacheSnapshotResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidServerlessCacheStateFault,
    ServerlessCacheNotFoundFault,
    ServerlessCacheSnapshotAlreadyExistsFault,
    ServerlessCacheSnapshotQuotaExceededFault,
    ServiceLinkedRoleNotFoundFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Creates a copy of an entire cluster or replication group at a specific moment in
 * time.
 *
 * This operation is valid for Valkey or Redis OSS only.
 */
export const createSnapshot: (
  input: CreateSnapshotMessage,
) => Effect.Effect<
  CreateSnapshotResult,
  | CacheClusterNotFoundFault
  | InvalidCacheClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidReplicationGroupStateFault
  | ReplicationGroupNotFoundFault
  | SnapshotAlreadyExistsFault
  | SnapshotFeatureNotSupportedFault
  | SnapshotQuotaExceededFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateSnapshotMessage,
  output: CreateSnapshotResult,
  errors: [
    CacheClusterNotFoundFault,
    InvalidCacheClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidReplicationGroupStateFault,
    ReplicationGroupNotFoundFault,
    SnapshotAlreadyExistsFault,
    SnapshotFeatureNotSupportedFault,
    SnapshotQuotaExceededFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Creates a copy of an existing serverless cache’s snapshot. Available for Valkey, Redis OSS and Serverless Memcached only.
 */
export const copyServerlessCacheSnapshot: (
  input: CopyServerlessCacheSnapshotRequest,
) => Effect.Effect<
  CopyServerlessCacheSnapshotResponse,
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidServerlessCacheSnapshotStateFault
  | ServerlessCacheSnapshotAlreadyExistsFault
  | ServerlessCacheSnapshotNotFoundFault
  | ServerlessCacheSnapshotQuotaExceededFault
  | ServiceLinkedRoleNotFoundFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CopyServerlessCacheSnapshotRequest,
  output: CopyServerlessCacheSnapshotResponse,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidServerlessCacheSnapshotStateFault,
    ServerlessCacheSnapshotAlreadyExistsFault,
    ServerlessCacheSnapshotNotFoundFault,
    ServerlessCacheSnapshotQuotaExceededFault,
    ServiceLinkedRoleNotFoundFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Creates a serverless cache.
 */
export const createServerlessCache: (
  input: CreateServerlessCacheRequest,
) => Effect.Effect<
  CreateServerlessCacheResponse,
  | InvalidCredentialsException
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidServerlessCacheStateFault
  | InvalidUserGroupStateFault
  | ServerlessCacheAlreadyExistsFault
  | ServerlessCacheNotFoundFault
  | ServerlessCacheQuotaForCustomerExceededFault
  | ServiceLinkedRoleNotFoundFault
  | TagQuotaPerResourceExceeded
  | UserGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateServerlessCacheRequest,
  output: CreateServerlessCacheResponse,
  errors: [
    InvalidCredentialsException,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidServerlessCacheStateFault,
    InvalidUserGroupStateFault,
    ServerlessCacheAlreadyExistsFault,
    ServerlessCacheNotFoundFault,
    ServerlessCacheQuotaForCustomerExceededFault,
    ServiceLinkedRoleNotFoundFault,
    TagQuotaPerResourceExceeded,
    UserGroupNotFoundFault,
  ],
}));
/**
 * Returns details of the update actions
 */
export const describeUpdateActions: {
  (
    input: DescribeUpdateActionsMessage,
  ): Effect.Effect<
    UpdateActionsMessage,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  pages: (
    input: DescribeUpdateActionsMessage,
  ) => Stream.Stream<
    UpdateActionsMessage,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
  items: (
    input: DescribeUpdateActionsMessage,
  ) => Stream.Stream<
    UpdateAction,
    | InvalidParameterCombinationException
    | InvalidParameterValueException
    | CommonErrors,
    Credentials | Region | HttpClient.HttpClient
  >;
} = /*@__PURE__*/ /*#__PURE__*/ API.makePaginated(() => ({
  input: DescribeUpdateActionsMessage,
  output: UpdateActionsMessage,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
  pagination: {
    inputToken: "Marker",
    outputToken: "Marker",
    items: "UpdateActions",
    pageSize: "MaxRecords",
  } as const,
}));
/**
 * Removes the tags identified by the `TagKeys` list from the named resource.
 * A tag is a key-value pair where the key and value are case-sensitive. You can use tags
 * to categorize and track all your ElastiCache resources, with the exception of global
 * replication group. When you add or remove tags on replication groups, those actions will
 * be replicated to all nodes in the replication group. For more information, see Resource-level permissions.
 */
export const removeTagsFromResource: (
  input: RemoveTagsFromResourceMessage,
) => Effect.Effect<
  TagListMessage,
  | CacheClusterNotFoundFault
  | CacheParameterGroupNotFoundFault
  | CacheSecurityGroupNotFoundFault
  | CacheSubnetGroupNotFoundFault
  | InvalidARNFault
  | InvalidReplicationGroupStateFault
  | InvalidServerlessCacheSnapshotStateFault
  | InvalidServerlessCacheStateFault
  | ReplicationGroupNotFoundFault
  | ReservedCacheNodeNotFoundFault
  | ServerlessCacheNotFoundFault
  | ServerlessCacheSnapshotNotFoundFault
  | SnapshotNotFoundFault
  | TagNotFoundFault
  | UserGroupNotFoundFault
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RemoveTagsFromResourceMessage,
  output: TagListMessage,
  errors: [
    CacheClusterNotFoundFault,
    CacheParameterGroupNotFoundFault,
    CacheSecurityGroupNotFoundFault,
    CacheSubnetGroupNotFoundFault,
    InvalidARNFault,
    InvalidReplicationGroupStateFault,
    InvalidServerlessCacheSnapshotStateFault,
    InvalidServerlessCacheStateFault,
    ReplicationGroupNotFoundFault,
    ReservedCacheNodeNotFoundFault,
    ServerlessCacheNotFoundFault,
    ServerlessCacheSnapshotNotFoundFault,
    SnapshotNotFoundFault,
    TagNotFoundFault,
    UserGroupNotFoundFault,
    UserNotFoundFault,
  ],
}));
/**
 * For Valkey engine version 7.2 onwards and Redis OSS 6.0 to 7.1: Creates a user. For more information, see
 * Using Role Based Access Control (RBAC).
 */
export const createUser: (
  input: CreateUserMessage,
) => Effect.Effect<
  User,
  | DuplicateUserNameFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | ServiceLinkedRoleNotFoundFault
  | TagQuotaPerResourceExceeded
  | UserAlreadyExistsFault
  | UserQuotaExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserMessage,
  output: User,
  errors: [
    DuplicateUserNameFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
    TagQuotaPerResourceExceeded,
    UserAlreadyExistsFault,
    UserQuotaExceededFault,
  ],
}));
/**
 * Modifies the settings for a cluster. You can use this operation to change one or more
 * cluster configuration parameters by specifying the parameters and the new values.
 */
export const modifyCacheCluster: (
  input: ModifyCacheClusterMessage,
) => Effect.Effect<
  ModifyCacheClusterResult,
  | CacheClusterNotFoundFault
  | CacheParameterGroupNotFoundFault
  | CacheSecurityGroupNotFoundFault
  | InsufficientCacheClusterCapacityFault
  | InvalidCacheClusterStateFault
  | InvalidCacheSecurityGroupStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidVPCNetworkStateFault
  | NodeQuotaForClusterExceededFault
  | NodeQuotaForCustomerExceededFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyCacheClusterMessage,
  output: ModifyCacheClusterResult,
  errors: [
    CacheClusterNotFoundFault,
    CacheParameterGroupNotFoundFault,
    CacheSecurityGroupNotFoundFault,
    InsufficientCacheClusterCapacityFault,
    InvalidCacheClusterStateFault,
    InvalidCacheSecurityGroupStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidVPCNetworkStateFault,
    NodeQuotaForClusterExceededFault,
    NodeQuotaForCustomerExceededFault,
  ],
}));
/**
 * Represents the input of a `TestFailover` operation which tests automatic
 * failover on a specified node group (called shard in the console) in a replication group
 * (called cluster in the console).
 *
 * This API is designed for testing the behavior of your application in case of
 * ElastiCache failover. It is not designed to be an operational tool for initiating a
 * failover to overcome a problem you may have with the cluster. Moreover, in certain
 * conditions such as large-scale operational events, Amazon may block this API.
 *
 * **Note the following**
 *
 * - A customer can use this operation to test automatic failover on up to 15 shards
 * (called node groups in the ElastiCache API and Amazon CLI) in any rolling
 * 24-hour period.
 *
 * - If calling this operation on shards in different clusters (called replication
 * groups in the API and CLI), the calls can be made concurrently.
 *
 * - If calling this operation multiple times on different shards in the same Valkey or Redis OSS (cluster mode enabled) replication group, the first node replacement must
 * complete before a subsequent call can be made.
 *
 * - To determine whether the node replacement is complete you can check Events
 * using the Amazon ElastiCache console, the Amazon CLI, or the ElastiCache API.
 * Look for the following automatic failover related events, listed here in order
 * of occurrance:
 *
 * - Replication group message: Test Failover API called for node
 * group
 *
 * - Cache cluster message: Failover from primary node
 * to replica node
 * completed
 *
 * - Replication group message: Failover from primary node
 * to replica node
 * completed
 *
 * - Cache cluster message: Recovering cache nodes
 *
 * - Cache cluster message: Finished recovery for cache nodes
 *
 * For more information see:
 *
 * - Viewing
 * ElastiCache Events in the ElastiCache User
 * Guide
 *
 * - DescribeEvents in the ElastiCache API Reference
 *
 * Also see, Testing
 * Multi-AZ in the *ElastiCache User Guide*.
 */
export const testFailover: (
  input: TestFailoverMessage,
) => Effect.Effect<
  TestFailoverResult,
  | APICallRateForCustomerExceededFault
  | InvalidCacheClusterStateFault
  | InvalidKMSKeyFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidReplicationGroupStateFault
  | NodeGroupNotFoundFault
  | ReplicationGroupNotFoundFault
  | TestFailoverNotAvailableFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: TestFailoverMessage,
  output: TestFailoverResult,
  errors: [
    APICallRateForCustomerExceededFault,
    InvalidCacheClusterStateFault,
    InvalidKMSKeyFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidReplicationGroupStateFault,
    NodeGroupNotFoundFault,
    ReplicationGroupNotFoundFault,
    TestFailoverNotAvailableFault,
  ],
}));
/**
 * For Valkey engine version 7.2 onwards and Redis OSS 6.0 to 7.1: Creates a user group. For more
 * information, see Using Role Based Access Control (RBAC)
 */
export const createUserGroup: (
  input: CreateUserGroupMessage,
) => Effect.Effect<
  UserGroup,
  | DefaultUserRequired
  | DuplicateUserNameFault
  | InvalidParameterValueException
  | ServiceLinkedRoleNotFoundFault
  | TagQuotaPerResourceExceeded
  | UserGroupAlreadyExistsFault
  | UserGroupQuotaExceededFault
  | UserNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateUserGroupMessage,
  output: UserGroup,
  errors: [
    DefaultUserRequired,
    DuplicateUserNameFault,
    InvalidParameterValueException,
    ServiceLinkedRoleNotFoundFault,
    TagQuotaPerResourceExceeded,
    UserGroupAlreadyExistsFault,
    UserGroupQuotaExceededFault,
    UserNotFoundFault,
  ],
}));
/**
 * Modifies the settings for a replication group. This is limited to Valkey and Redis OSS 7 and above.
 *
 * - Scaling for Valkey or Redis OSS (cluster mode enabled) in
 * the ElastiCache User Guide
 *
 * - ModifyReplicationGroupShardConfiguration in the ElastiCache API
 * Reference
 *
 * This operation is valid for Valkey or Redis OSS only.
 */
export const modifyReplicationGroup: (
  input: ModifyReplicationGroupMessage,
) => Effect.Effect<
  ModifyReplicationGroupResult,
  | CacheClusterNotFoundFault
  | CacheParameterGroupNotFoundFault
  | CacheSecurityGroupNotFoundFault
  | InsufficientCacheClusterCapacityFault
  | InvalidCacheClusterStateFault
  | InvalidCacheSecurityGroupStateFault
  | InvalidKMSKeyFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidReplicationGroupStateFault
  | InvalidUserGroupStateFault
  | InvalidVPCNetworkStateFault
  | NodeQuotaForClusterExceededFault
  | NodeQuotaForCustomerExceededFault
  | ReplicationGroupNotFoundFault
  | UserGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyReplicationGroupMessage,
  output: ModifyReplicationGroupResult,
  errors: [
    CacheClusterNotFoundFault,
    CacheParameterGroupNotFoundFault,
    CacheSecurityGroupNotFoundFault,
    InsufficientCacheClusterCapacityFault,
    InvalidCacheClusterStateFault,
    InvalidCacheSecurityGroupStateFault,
    InvalidKMSKeyFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidReplicationGroupStateFault,
    InvalidUserGroupStateFault,
    InvalidVPCNetworkStateFault,
    NodeQuotaForClusterExceededFault,
    NodeQuotaForCustomerExceededFault,
    ReplicationGroupNotFoundFault,
    UserGroupNotFoundFault,
  ],
}));
/**
 * Modifies a replication group's shards (node groups) by allowing you to add shards,
 * remove shards, or rebalance the keyspaces among existing shards.
 */
export const modifyReplicationGroupShardConfiguration: (
  input: ModifyReplicationGroupShardConfigurationMessage,
) => Effect.Effect<
  ModifyReplicationGroupShardConfigurationResult,
  | InsufficientCacheClusterCapacityFault
  | InvalidCacheClusterStateFault
  | InvalidKMSKeyFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidReplicationGroupStateFault
  | InvalidVPCNetworkStateFault
  | NodeGroupsPerReplicationGroupQuotaExceededFault
  | NodeQuotaForCustomerExceededFault
  | ReplicationGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyReplicationGroupShardConfigurationMessage,
  output: ModifyReplicationGroupShardConfigurationResult,
  errors: [
    InsufficientCacheClusterCapacityFault,
    InvalidCacheClusterStateFault,
    InvalidKMSKeyFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidReplicationGroupStateFault,
    InvalidVPCNetworkStateFault,
    NodeGroupsPerReplicationGroupQuotaExceededFault,
    NodeQuotaForCustomerExceededFault,
    ReplicationGroupNotFoundFault,
  ],
}));
/**
 * Creates a cluster. All nodes in the cluster run the same protocol-compliant cache
 * engine software, either Memcached, Valkey or Redis OSS.
 *
 * This operation is not supported for Valkey or Redis OSS (cluster mode enabled) clusters.
 */
export const createCacheCluster: (
  input: CreateCacheClusterMessage,
) => Effect.Effect<
  CreateCacheClusterResult,
  | CacheClusterAlreadyExistsFault
  | CacheParameterGroupNotFoundFault
  | CacheSecurityGroupNotFoundFault
  | CacheSubnetGroupNotFoundFault
  | ClusterQuotaForCustomerExceededFault
  | InsufficientCacheClusterCapacityFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidReplicationGroupStateFault
  | InvalidVPCNetworkStateFault
  | NodeQuotaForClusterExceededFault
  | NodeQuotaForCustomerExceededFault
  | ReplicationGroupNotFoundFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCacheClusterMessage,
  output: CreateCacheClusterResult,
  errors: [
    CacheClusterAlreadyExistsFault,
    CacheParameterGroupNotFoundFault,
    CacheSecurityGroupNotFoundFault,
    CacheSubnetGroupNotFoundFault,
    ClusterQuotaForCustomerExceededFault,
    InsufficientCacheClusterCapacityFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidReplicationGroupStateFault,
    InvalidVPCNetworkStateFault,
    NodeQuotaForClusterExceededFault,
    NodeQuotaForCustomerExceededFault,
    ReplicationGroupNotFoundFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Complete the migration of data.
 */
export const completeMigration: (
  input: CompleteMigrationMessage,
) => Effect.Effect<
  CompleteMigrationResponse,
  | InvalidReplicationGroupStateFault
  | ReplicationGroupNotFoundFault
  | ReplicationGroupNotUnderMigrationFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CompleteMigrationMessage,
  output: CompleteMigrationResponse,
  errors: [
    InvalidReplicationGroupStateFault,
    ReplicationGroupNotFoundFault,
    ReplicationGroupNotUnderMigrationFault,
  ],
}));
/**
 * Modifies an existing cache subnet group.
 */
export const modifyCacheSubnetGroup: (
  input: ModifyCacheSubnetGroupMessage,
) => Effect.Effect<
  ModifyCacheSubnetGroupResult,
  | CacheSubnetGroupNotFoundFault
  | CacheSubnetQuotaExceededFault
  | InvalidSubnet
  | SubnetInUse
  | SubnetNotAllowedFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: ModifyCacheSubnetGroupMessage,
  output: ModifyCacheSubnetGroupResult,
  errors: [
    CacheSubnetGroupNotFoundFault,
    CacheSubnetQuotaExceededFault,
    InvalidSubnet,
    SubnetInUse,
    SubnetNotAllowedFault,
  ],
}));
/**
 * Creates a new cache subnet group.
 *
 * Use this parameter only when you are creating a cluster in an Amazon Virtual Private
 * Cloud (Amazon VPC).
 */
export const createCacheSubnetGroup: (
  input: CreateCacheSubnetGroupMessage,
) => Effect.Effect<
  CreateCacheSubnetGroupResult,
  | CacheSubnetGroupAlreadyExistsFault
  | CacheSubnetGroupQuotaExceededFault
  | CacheSubnetQuotaExceededFault
  | InvalidSubnet
  | SubnetNotAllowedFault
  | TagQuotaPerResourceExceeded
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateCacheSubnetGroupMessage,
  output: CreateCacheSubnetGroupResult,
  errors: [
    CacheSubnetGroupAlreadyExistsFault,
    CacheSubnetGroupQuotaExceededFault,
    CacheSubnetQuotaExceededFault,
    InvalidSubnet,
    SubnetNotAllowedFault,
    TagQuotaPerResourceExceeded,
  ],
}));
/**
 * Dynamically increases the number of replicas in a Valkey or Redis OSS (cluster mode disabled)
 * replication group or the number of replica nodes in one or more node groups (shards) of
 * a Valkey or Redis OSS (cluster mode enabled) replication group. This operation is performed with no
 * cluster down time.
 */
export const increaseReplicaCount: (
  input: IncreaseReplicaCountMessage,
) => Effect.Effect<
  IncreaseReplicaCountResult,
  | ClusterQuotaForCustomerExceededFault
  | InsufficientCacheClusterCapacityFault
  | InvalidCacheClusterStateFault
  | InvalidKMSKeyFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidReplicationGroupStateFault
  | InvalidVPCNetworkStateFault
  | NodeGroupsPerReplicationGroupQuotaExceededFault
  | NodeQuotaForCustomerExceededFault
  | NoOperationFault
  | ReplicationGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: IncreaseReplicaCountMessage,
  output: IncreaseReplicaCountResult,
  errors: [
    ClusterQuotaForCustomerExceededFault,
    InsufficientCacheClusterCapacityFault,
    InvalidCacheClusterStateFault,
    InvalidKMSKeyFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidReplicationGroupStateFault,
    InvalidVPCNetworkStateFault,
    NodeGroupsPerReplicationGroupQuotaExceededFault,
    NodeQuotaForCustomerExceededFault,
    NoOperationFault,
    ReplicationGroupNotFoundFault,
  ],
}));
/**
 * Creates a Valkey or Redis OSS (cluster mode disabled) or a Valkey or Redis OSS (cluster mode enabled) replication
 * group.
 *
 * This API can be used to create a standalone regional replication group or a secondary
 * replication group associated with a Global datastore.
 *
 * A Valkey or Redis OSS (cluster mode disabled) replication group is a collection of nodes, where
 * one of the nodes is a read/write primary and the others are read-only replicas.
 * Writes to the primary are asynchronously propagated to the replicas.
 *
 * A Valkey or Redis OSS cluster-mode enabled cluster is comprised of from 1 to 90 shards (API/CLI:
 * node groups). Each shard has a primary node and up to 5 read-only replica nodes. The
 * configuration can range from 90 shards and 0 replicas to 15 shards and 5 replicas, which
 * is the maximum number or replicas allowed.
 *
 * The node or shard limit can be increased to a maximum of 500 per cluster if the Valkey or Redis OSS
 * engine version is 5.0.6 or higher. For example, you can choose to configure a 500 node
 * cluster that ranges between 83 shards (one primary and 5 replicas per shard) and 500
 * shards (single primary and no replicas). Make sure there are enough available IP
 * addresses to accommodate the increase. Common pitfalls include the subnets in the subnet
 * group have too small a CIDR range or the subnets are shared and heavily used by other
 * clusters. For more information, see Creating a Subnet
 * Group. For versions below 5.0.6, the limit is 250 per cluster.
 *
 * To request a limit increase, see Amazon Service Limits and
 * choose the limit type Nodes per cluster per instance
 * type.
 *
 * When a Valkey or Redis OSS (cluster mode disabled) replication group has been successfully created,
 * you can add one or more read replicas to it, up to a total of 5 read replicas. If you
 * need to increase or decrease the number of node groups (console: shards), you can use scaling.
 * For more information, see Scaling self-designed clusters in the ElastiCache User
 * Guide.
 *
 * This operation is valid for Valkey and Redis OSS only.
 */
export const createReplicationGroup: (
  input: CreateReplicationGroupMessage,
) => Effect.Effect<
  CreateReplicationGroupResult,
  | CacheClusterNotFoundFault
  | CacheParameterGroupNotFoundFault
  | CacheSecurityGroupNotFoundFault
  | CacheSubnetGroupNotFoundFault
  | ClusterQuotaForCustomerExceededFault
  | GlobalReplicationGroupNotFoundFault
  | InsufficientCacheClusterCapacityFault
  | InvalidCacheClusterStateFault
  | InvalidGlobalReplicationGroupStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidUserGroupStateFault
  | InvalidVPCNetworkStateFault
  | NodeGroupsPerReplicationGroupQuotaExceededFault
  | NodeQuotaForClusterExceededFault
  | NodeQuotaForCustomerExceededFault
  | ReplicationGroupAlreadyExistsFault
  | TagQuotaPerResourceExceeded
  | UserGroupNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CreateReplicationGroupMessage,
  output: CreateReplicationGroupResult,
  errors: [
    CacheClusterNotFoundFault,
    CacheParameterGroupNotFoundFault,
    CacheSecurityGroupNotFoundFault,
    CacheSubnetGroupNotFoundFault,
    ClusterQuotaForCustomerExceededFault,
    GlobalReplicationGroupNotFoundFault,
    InsufficientCacheClusterCapacityFault,
    InvalidCacheClusterStateFault,
    InvalidGlobalReplicationGroupStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidUserGroupStateFault,
    InvalidVPCNetworkStateFault,
    NodeGroupsPerReplicationGroupQuotaExceededFault,
    NodeQuotaForClusterExceededFault,
    NodeQuotaForCustomerExceededFault,
    ReplicationGroupAlreadyExistsFault,
    TagQuotaPerResourceExceeded,
    UserGroupNotFoundFault,
  ],
}));
/**
 * Dynamically decreases the number of replicas in a Valkey or Redis OSS (cluster mode disabled)
 * replication group or the number of replica nodes in one or more node groups (shards) of
 * a Valkey or Redis OSS (cluster mode enabled) replication group. This operation is performed with no
 * cluster down time.
 */
export const decreaseReplicaCount: (
  input: DecreaseReplicaCountMessage,
) => Effect.Effect<
  DecreaseReplicaCountResult,
  | ClusterQuotaForCustomerExceededFault
  | InsufficientCacheClusterCapacityFault
  | InvalidCacheClusterStateFault
  | InvalidParameterCombinationException
  | InvalidParameterValueException
  | InvalidReplicationGroupStateFault
  | InvalidVPCNetworkStateFault
  | NodeGroupsPerReplicationGroupQuotaExceededFault
  | NodeQuotaForCustomerExceededFault
  | NoOperationFault
  | ReplicationGroupNotFoundFault
  | ServiceLinkedRoleNotFoundFault
  | CommonErrors,
  Credentials | Region | HttpClient.HttpClient
> = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DecreaseReplicaCountMessage,
  output: DecreaseReplicaCountResult,
  errors: [
    ClusterQuotaForCustomerExceededFault,
    InsufficientCacheClusterCapacityFault,
    InvalidCacheClusterStateFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    InvalidReplicationGroupStateFault,
    InvalidVPCNetworkStateFault,
    NodeGroupsPerReplicationGroupQuotaExceededFault,
    NodeQuotaForCustomerExceededFault,
    NoOperationFault,
    ReplicationGroupNotFoundFault,
    ServiceLinkedRoleNotFoundFault,
  ],
}));
