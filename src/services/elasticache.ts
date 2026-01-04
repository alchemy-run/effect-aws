import * as S from "effect/Schema";
import * as API from "../api.ts";
import * as T from "../traits.ts";
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

//# Schemas
export const ReplicationGroupIdList = S.Array(S.String);
export const CacheClusterIdList = S.Array(S.String);
export const PreferredAvailabilityZoneList = S.Array(
  S.String.pipe(T.XmlName("PreferredAvailabilityZone")),
);
export const CacheSecurityGroupNameList = S.Array(
  S.String.pipe(T.XmlName("CacheSecurityGroupName")),
);
export const SecurityGroupIdsList = S.Array(
  S.String.pipe(T.XmlName("SecurityGroupId")),
);
export const SnapshotArnsList = S.Array(
  S.String.pipe(T.XmlName("SnapshotArn")),
);
export const PreferredOutpostArnList = S.Array(
  S.String.pipe(T.XmlName("PreferredOutpostArn")),
);
export const SubnetIdentifierList = S.Array(
  S.String.pipe(T.XmlName("SubnetIdentifier")),
);
export const AvailabilityZonesList = S.Array(
  S.String.pipe(T.XmlName("AvailabilityZone")),
);
export const UserGroupIdListInput = S.Array(S.String);
export const SubnetIdsList = S.Array(S.String.pipe(T.XmlName("SubnetId")));
export const PasswordListInput = S.Array(S.String);
export const UserIdListInput = S.Array(S.String);
export const GlobalNodeGroupIdList = S.Array(
  S.String.pipe(T.XmlName("GlobalNodeGroupId")),
);
export const RemoveReplicasList = S.Array(S.String);
export const ServiceUpdateStatusList = S.Array(S.String);
export const UpdateActionStatusList = S.Array(S.String);
export const CacheNodeIdsList = S.Array(
  S.String.pipe(T.XmlName("CacheNodeId")),
);
export const UserGroupIdList = S.Array(S.String);
export const NodeGroupsToRemoveList = S.Array(
  S.String.pipe(T.XmlName("NodeGroupToRemove")),
);
export const NodeGroupsToRetainList = S.Array(
  S.String.pipe(T.XmlName("NodeGroupToRetain")),
);
export const KeyList = S.Array(S.String);
export class AuthorizeCacheSecurityGroupIngressMessage extends S.Class<AuthorizeCacheSecurityGroupIngressMessage>(
  "AuthorizeCacheSecurityGroupIngressMessage",
)(
  {
    CacheSecurityGroupName: S.String,
    EC2SecurityGroupName: S.String,
    EC2SecurityGroupOwnerId: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchApplyUpdateActionMessage extends S.Class<BatchApplyUpdateActionMessage>(
  "BatchApplyUpdateActionMessage",
)(
  {
    ReplicationGroupIds: S.optional(ReplicationGroupIdList),
    CacheClusterIds: S.optional(CacheClusterIdList),
    ServiceUpdateName: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class BatchStopUpdateActionMessage extends S.Class<BatchStopUpdateActionMessage>(
  "BatchStopUpdateActionMessage",
)(
  {
    ReplicationGroupIds: S.optional(ReplicationGroupIdList),
    CacheClusterIds: S.optional(CacheClusterIdList),
    ServiceUpdateName: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CompleteMigrationMessage extends S.Class<CompleteMigrationMessage>(
  "CompleteMigrationMessage",
)(
  { ReplicationGroupId: S.String, Force: S.optional(S.Boolean) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class Tag extends S.Class<Tag>("Tag")({
  Key: S.optional(S.String),
  Value: S.optional(S.String),
}) {}
export const TagList = S.Array(Tag.pipe(T.XmlName("Tag")));
export class CopyServerlessCacheSnapshotRequest extends S.Class<CopyServerlessCacheSnapshotRequest>(
  "CopyServerlessCacheSnapshotRequest",
)(
  {
    SourceServerlessCacheSnapshotName: S.String,
    TargetServerlessCacheSnapshotName: S.String,
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CopySnapshotMessage extends S.Class<CopySnapshotMessage>(
  "CopySnapshotMessage",
)(
  {
    SourceSnapshotName: S.String,
    TargetSnapshotName: S.String,
    TargetBucket: S.optional(S.String),
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCacheParameterGroupMessage extends S.Class<CreateCacheParameterGroupMessage>(
  "CreateCacheParameterGroupMessage",
)(
  {
    CacheParameterGroupName: S.String,
    CacheParameterGroupFamily: S.String,
    Description: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCacheSecurityGroupMessage extends S.Class<CreateCacheSecurityGroupMessage>(
  "CreateCacheSecurityGroupMessage",
)(
  {
    CacheSecurityGroupName: S.String,
    Description: S.String,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCacheSubnetGroupMessage extends S.Class<CreateCacheSubnetGroupMessage>(
  "CreateCacheSubnetGroupMessage",
)(
  {
    CacheSubnetGroupName: S.String,
    CacheSubnetGroupDescription: S.String,
    SubnetIds: SubnetIdentifierList,
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGlobalReplicationGroupMessage extends S.Class<CreateGlobalReplicationGroupMessage>(
  "CreateGlobalReplicationGroupMessage",
)(
  {
    GlobalReplicationGroupIdSuffix: S.String,
    GlobalReplicationGroupDescription: S.optional(S.String),
    PrimaryReplicationGroupId: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateServerlessCacheSnapshotRequest extends S.Class<CreateServerlessCacheSnapshotRequest>(
  "CreateServerlessCacheSnapshotRequest",
)(
  {
    ServerlessCacheSnapshotName: S.String,
    ServerlessCacheName: S.String,
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateSnapshotMessage extends S.Class<CreateSnapshotMessage>(
  "CreateSnapshotMessage",
)(
  {
    ReplicationGroupId: S.optional(S.String),
    CacheClusterId: S.optional(S.String),
    SnapshotName: S.String,
    KmsKeyId: S.optional(S.String),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateUserGroupMessage extends S.Class<CreateUserGroupMessage>(
  "CreateUserGroupMessage",
)(
  {
    UserGroupId: S.String,
    Engine: S.String,
    UserIds: S.optional(UserIdListInput),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DecreaseNodeGroupsInGlobalReplicationGroupMessage extends S.Class<DecreaseNodeGroupsInGlobalReplicationGroupMessage>(
  "DecreaseNodeGroupsInGlobalReplicationGroupMessage",
)(
  {
    GlobalReplicationGroupId: S.String,
    NodeGroupCount: S.Number,
    GlobalNodeGroupsToRemove: S.optional(GlobalNodeGroupIdList),
    GlobalNodeGroupsToRetain: S.optional(GlobalNodeGroupIdList),
    ApplyImmediately: S.Boolean,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCacheClusterMessage extends S.Class<DeleteCacheClusterMessage>(
  "DeleteCacheClusterMessage",
)(
  { CacheClusterId: S.String, FinalSnapshotIdentifier: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCacheParameterGroupMessage extends S.Class<DeleteCacheParameterGroupMessage>(
  "DeleteCacheParameterGroupMessage",
)(
  { CacheParameterGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCacheParameterGroupResponse extends S.Class<DeleteCacheParameterGroupResponse>(
  "DeleteCacheParameterGroupResponse",
)({}, ns) {}
export class DeleteCacheSecurityGroupMessage extends S.Class<DeleteCacheSecurityGroupMessage>(
  "DeleteCacheSecurityGroupMessage",
)(
  { CacheSecurityGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCacheSecurityGroupResponse extends S.Class<DeleteCacheSecurityGroupResponse>(
  "DeleteCacheSecurityGroupResponse",
)({}, ns) {}
export class DeleteCacheSubnetGroupMessage extends S.Class<DeleteCacheSubnetGroupMessage>(
  "DeleteCacheSubnetGroupMessage",
)(
  { CacheSubnetGroupName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteCacheSubnetGroupResponse extends S.Class<DeleteCacheSubnetGroupResponse>(
  "DeleteCacheSubnetGroupResponse",
)({}, ns) {}
export class DeleteGlobalReplicationGroupMessage extends S.Class<DeleteGlobalReplicationGroupMessage>(
  "DeleteGlobalReplicationGroupMessage",
)(
  {
    GlobalReplicationGroupId: S.String,
    RetainPrimaryReplicationGroup: S.Boolean,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteReplicationGroupMessage extends S.Class<DeleteReplicationGroupMessage>(
  "DeleteReplicationGroupMessage",
)(
  {
    ReplicationGroupId: S.String,
    RetainPrimaryCluster: S.optional(S.Boolean),
    FinalSnapshotIdentifier: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServerlessCacheRequest extends S.Class<DeleteServerlessCacheRequest>(
  "DeleteServerlessCacheRequest",
)(
  { ServerlessCacheName: S.String, FinalSnapshotName: S.optional(S.String) },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteServerlessCacheSnapshotRequest extends S.Class<DeleteServerlessCacheSnapshotRequest>(
  "DeleteServerlessCacheSnapshotRequest",
)(
  { ServerlessCacheSnapshotName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteSnapshotMessage extends S.Class<DeleteSnapshotMessage>(
  "DeleteSnapshotMessage",
)(
  { SnapshotName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserMessage extends S.Class<DeleteUserMessage>(
  "DeleteUserMessage",
)(
  { UserId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteUserGroupMessage extends S.Class<DeleteUserGroupMessage>(
  "DeleteUserGroupMessage",
)(
  { UserGroupId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCacheClustersMessage extends S.Class<DescribeCacheClustersMessage>(
  "DescribeCacheClustersMessage",
)(
  {
    CacheClusterId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    ShowCacheNodeInfo: S.optional(S.Boolean),
    ShowCacheClustersNotInReplicationGroups: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCacheEngineVersionsMessage extends S.Class<DescribeCacheEngineVersionsMessage>(
  "DescribeCacheEngineVersionsMessage",
)(
  {
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    CacheParameterGroupFamily: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    DefaultOnly: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCacheParameterGroupsMessage extends S.Class<DescribeCacheParameterGroupsMessage>(
  "DescribeCacheParameterGroupsMessage",
)(
  {
    CacheParameterGroupName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCacheParametersMessage extends S.Class<DescribeCacheParametersMessage>(
  "DescribeCacheParametersMessage",
)(
  {
    CacheParameterGroupName: S.String,
    Source: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCacheSecurityGroupsMessage extends S.Class<DescribeCacheSecurityGroupsMessage>(
  "DescribeCacheSecurityGroupsMessage",
)(
  {
    CacheSecurityGroupName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeCacheSubnetGroupsMessage extends S.Class<DescribeCacheSubnetGroupsMessage>(
  "DescribeCacheSubnetGroupsMessage",
)(
  {
    CacheSubnetGroupName: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEngineDefaultParametersMessage extends S.Class<DescribeEngineDefaultParametersMessage>(
  "DescribeEngineDefaultParametersMessage",
)(
  {
    CacheParameterGroupFamily: S.String,
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeEventsMessage extends S.Class<DescribeEventsMessage>(
  "DescribeEventsMessage",
)(
  {
    SourceIdentifier: S.optional(S.String),
    SourceType: S.optional(S.String),
    StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
    Duration: S.optional(S.Number),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeGlobalReplicationGroupsMessage extends S.Class<DescribeGlobalReplicationGroupsMessage>(
  "DescribeGlobalReplicationGroupsMessage",
)(
  {
    GlobalReplicationGroupId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
    ShowMemberInfo: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReplicationGroupsMessage extends S.Class<DescribeReplicationGroupsMessage>(
  "DescribeReplicationGroupsMessage",
)(
  {
    ReplicationGroupId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReservedCacheNodesMessage extends S.Class<DescribeReservedCacheNodesMessage>(
  "DescribeReservedCacheNodesMessage",
)(
  {
    ReservedCacheNodeId: S.optional(S.String),
    ReservedCacheNodesOfferingId: S.optional(S.String),
    CacheNodeType: S.optional(S.String),
    Duration: S.optional(S.String),
    ProductDescription: S.optional(S.String),
    OfferingType: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeReservedCacheNodesOfferingsMessage extends S.Class<DescribeReservedCacheNodesOfferingsMessage>(
  "DescribeReservedCacheNodesOfferingsMessage",
)(
  {
    ReservedCacheNodesOfferingId: S.optional(S.String),
    CacheNodeType: S.optional(S.String),
    Duration: S.optional(S.String),
    ProductDescription: S.optional(S.String),
    OfferingType: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeServerlessCachesRequest extends S.Class<DescribeServerlessCachesRequest>(
  "DescribeServerlessCachesRequest",
)(
  {
    ServerlessCacheName: S.optional(S.String),
    MaxResults: S.optional(S.Number),
    NextToken: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeServerlessCacheSnapshotsRequest extends S.Class<DescribeServerlessCacheSnapshotsRequest>(
  "DescribeServerlessCacheSnapshotsRequest",
)(
  {
    ServerlessCacheName: S.optional(S.String),
    ServerlessCacheSnapshotName: S.optional(S.String),
    SnapshotType: S.optional(S.String),
    NextToken: S.optional(S.String),
    MaxResults: S.optional(S.Number),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeServiceUpdatesMessage extends S.Class<DescribeServiceUpdatesMessage>(
  "DescribeServiceUpdatesMessage",
)(
  {
    ServiceUpdateName: S.optional(S.String),
    ServiceUpdateStatus: S.optional(ServiceUpdateStatusList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeSnapshotsMessage extends S.Class<DescribeSnapshotsMessage>(
  "DescribeSnapshotsMessage",
)(
  {
    ReplicationGroupId: S.optional(S.String),
    CacheClusterId: S.optional(S.String),
    SnapshotName: S.optional(S.String),
    SnapshotSource: S.optional(S.String),
    Marker: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    ShowNodeGroupConfig: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeUserGroupsMessage extends S.Class<DescribeUserGroupsMessage>(
  "DescribeUserGroupsMessage",
)(
  {
    UserGroupId: S.optional(S.String),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateGlobalReplicationGroupMessage extends S.Class<DisassociateGlobalReplicationGroupMessage>(
  "DisassociateGlobalReplicationGroupMessage",
)(
  {
    GlobalReplicationGroupId: S.String,
    ReplicationGroupId: S.String,
    ReplicationGroupRegion: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ExportServerlessCacheSnapshotRequest extends S.Class<ExportServerlessCacheSnapshotRequest>(
  "ExportServerlessCacheSnapshotRequest",
)(
  { ServerlessCacheSnapshotName: S.String, S3BucketName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class FailoverGlobalReplicationGroupMessage extends S.Class<FailoverGlobalReplicationGroupMessage>(
  "FailoverGlobalReplicationGroupMessage",
)(
  {
    GlobalReplicationGroupId: S.String,
    PrimaryRegion: S.String,
    PrimaryReplicationGroupId: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ConfigureShard extends S.Class<ConfigureShard>("ConfigureShard")({
  NodeGroupId: S.String,
  NewReplicaCount: S.Number,
  PreferredAvailabilityZones: S.optional(PreferredAvailabilityZoneList),
  PreferredOutpostArns: S.optional(PreferredOutpostArnList),
}) {}
export const ReplicaConfigurationList = S.Array(
  ConfigureShard.pipe(T.XmlName("ConfigureShard")),
);
export class IncreaseReplicaCountMessage extends S.Class<IncreaseReplicaCountMessage>(
  "IncreaseReplicaCountMessage",
)(
  {
    ReplicationGroupId: S.String,
    NewReplicaCount: S.optional(S.Number),
    ReplicaConfiguration: S.optional(ReplicaConfigurationList),
    ApplyImmediately: S.Boolean,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListAllowedNodeTypeModificationsMessage extends S.Class<ListAllowedNodeTypeModificationsMessage>(
  "ListAllowedNodeTypeModificationsMessage",
)(
  {
    CacheClusterId: S.optional(S.String),
    ReplicationGroupId: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ListTagsForResourceMessage extends S.Class<ListTagsForResourceMessage>(
  "ListTagsForResourceMessage",
)(
  { ResourceName: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyCacheSubnetGroupMessage extends S.Class<ModifyCacheSubnetGroupMessage>(
  "ModifyCacheSubnetGroupMessage",
)(
  {
    CacheSubnetGroupName: S.String,
    CacheSubnetGroupDescription: S.optional(S.String),
    SubnetIds: S.optional(SubnetIdentifierList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyGlobalReplicationGroupMessage extends S.Class<ModifyGlobalReplicationGroupMessage>(
  "ModifyGlobalReplicationGroupMessage",
)(
  {
    GlobalReplicationGroupId: S.String,
    ApplyImmediately: S.Boolean,
    CacheNodeType: S.optional(S.String),
    Engine: S.optional(S.String),
    EngineVersion: S.optional(S.String),
    CacheParameterGroupName: S.optional(S.String),
    GlobalReplicationGroupDescription: S.optional(S.String),
    AutomaticFailoverEnabled: S.optional(S.Boolean),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CloudWatchLogsDestinationDetails extends S.Class<CloudWatchLogsDestinationDetails>(
  "CloudWatchLogsDestinationDetails",
)({ LogGroup: S.optional(S.String) }) {}
export class KinesisFirehoseDestinationDetails extends S.Class<KinesisFirehoseDestinationDetails>(
  "KinesisFirehoseDestinationDetails",
)({ DeliveryStream: S.optional(S.String) }) {}
export class DestinationDetails extends S.Class<DestinationDetails>(
  "DestinationDetails",
)({
  CloudWatchLogsDetails: S.optional(CloudWatchLogsDestinationDetails),
  KinesisFirehoseDetails: S.optional(KinesisFirehoseDestinationDetails),
}) {}
export class LogDeliveryConfigurationRequest extends S.Class<LogDeliveryConfigurationRequest>(
  "LogDeliveryConfigurationRequest",
)({
  LogType: S.optional(S.String),
  DestinationType: S.optional(S.String),
  DestinationDetails: S.optional(DestinationDetails),
  LogFormat: S.optional(S.String),
  Enabled: S.optional(S.Boolean),
}) {}
export const LogDeliveryConfigurationRequestList = S.Array(
  LogDeliveryConfigurationRequest.pipe(
    T.XmlName("LogDeliveryConfigurationRequest"),
  ),
);
export class ModifyReplicationGroupMessage extends S.Class<ModifyReplicationGroupMessage>(
  "ModifyReplicationGroupMessage",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DataStorage extends S.Class<DataStorage>("DataStorage")({
  Maximum: S.optional(S.Number),
  Minimum: S.optional(S.Number),
  Unit: S.String,
}) {}
export class ECPUPerSecond extends S.Class<ECPUPerSecond>("ECPUPerSecond")({
  Maximum: S.optional(S.Number),
  Minimum: S.optional(S.Number),
}) {}
export class CacheUsageLimits extends S.Class<CacheUsageLimits>(
  "CacheUsageLimits",
)({
  DataStorage: S.optional(DataStorage),
  ECPUPerSecond: S.optional(ECPUPerSecond),
}) {}
export class ModifyServerlessCacheRequest extends S.Class<ModifyServerlessCacheRequest>(
  "ModifyServerlessCacheRequest",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class AuthenticationMode extends S.Class<AuthenticationMode>(
  "AuthenticationMode",
)({ Type: S.optional(S.String), Passwords: S.optional(PasswordListInput) }) {}
export class ModifyUserMessage extends S.Class<ModifyUserMessage>(
  "ModifyUserMessage",
)(
  {
    UserId: S.String,
    AccessString: S.optional(S.String),
    AppendAccessString: S.optional(S.String),
    Passwords: S.optional(PasswordListInput),
    NoPasswordRequired: S.optional(S.Boolean),
    AuthenticationMode: S.optional(AuthenticationMode),
    Engine: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyUserGroupMessage extends S.Class<ModifyUserGroupMessage>(
  "ModifyUserGroupMessage",
)(
  {
    UserGroupId: S.String,
    UserIdsToAdd: S.optional(UserIdListInput),
    UserIdsToRemove: S.optional(UserIdListInput),
    Engine: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class PurchaseReservedCacheNodesOfferingMessage extends S.Class<PurchaseReservedCacheNodesOfferingMessage>(
  "PurchaseReservedCacheNodesOfferingMessage",
)(
  {
    ReservedCacheNodesOfferingId: S.String,
    ReservedCacheNodeId: S.optional(S.String),
    CacheNodeCount: S.optional(S.Number),
    Tags: S.optional(TagList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebalanceSlotsInGlobalReplicationGroupMessage extends S.Class<RebalanceSlotsInGlobalReplicationGroupMessage>(
  "RebalanceSlotsInGlobalReplicationGroupMessage",
)(
  { GlobalReplicationGroupId: S.String, ApplyImmediately: S.Boolean },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RebootCacheClusterMessage extends S.Class<RebootCacheClusterMessage>(
  "RebootCacheClusterMessage",
)(
  { CacheClusterId: S.String, CacheNodeIdsToReboot: CacheNodeIdsList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RemoveTagsFromResourceMessage extends S.Class<RemoveTagsFromResourceMessage>(
  "RemoveTagsFromResourceMessage",
)(
  { ResourceName: S.String, TagKeys: KeyList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ParameterNameValue extends S.Class<ParameterNameValue>(
  "ParameterNameValue",
)({
  ParameterName: S.optional(S.String),
  ParameterValue: S.optional(S.String),
}) {}
export const ParameterNameValueList = S.Array(
  ParameterNameValue.pipe(T.XmlName("ParameterNameValue")),
);
export class ResetCacheParameterGroupMessage extends S.Class<ResetCacheParameterGroupMessage>(
  "ResetCacheParameterGroupMessage",
)(
  {
    CacheParameterGroupName: S.String,
    ResetAllParameters: S.optional(S.Boolean),
    ParameterNameValues: S.optional(ParameterNameValueList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class RevokeCacheSecurityGroupIngressMessage extends S.Class<RevokeCacheSecurityGroupIngressMessage>(
  "RevokeCacheSecurityGroupIngressMessage",
)(
  {
    CacheSecurityGroupName: S.String,
    EC2SecurityGroupName: S.String,
    EC2SecurityGroupOwnerId: S.String,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TestFailoverMessage extends S.Class<TestFailoverMessage>(
  "TestFailoverMessage",
)(
  { ReplicationGroupId: S.String, NodeGroupId: S.String },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CustomerNodeEndpoint extends S.Class<CustomerNodeEndpoint>(
  "CustomerNodeEndpoint",
)({ Address: S.optional(S.String), Port: S.optional(S.Number) }) {}
export const CustomerNodeEndpointList = S.Array(CustomerNodeEndpoint);
export class TestMigrationMessage extends S.Class<TestMigrationMessage>(
  "TestMigrationMessage",
)(
  {
    ReplicationGroupId: S.String,
    CustomerNodeEndpointList: CustomerNodeEndpointList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export const OutpostArnsList = S.Array(S.String.pipe(T.XmlName("OutpostArn")));
export const FilterValueList = S.Array(S.String);
export class NodeGroupConfiguration extends S.Class<NodeGroupConfiguration>(
  "NodeGroupConfiguration",
)({
  NodeGroupId: S.optional(S.String),
  Slots: S.optional(S.String),
  ReplicaCount: S.optional(S.Number),
  PrimaryAvailabilityZone: S.optional(S.String),
  ReplicaAvailabilityZones: S.optional(AvailabilityZonesList),
  PrimaryOutpostArn: S.optional(S.String),
  ReplicaOutpostArns: S.optional(OutpostArnsList),
}) {}
export const NodeGroupConfigurationList = S.Array(
  NodeGroupConfiguration.pipe(T.XmlName("NodeGroupConfiguration")),
);
export const UserIdList = S.Array(S.String);
export const UGReplicationGroupIdList = S.Array(S.String);
export const UGServerlessCacheIdList = S.Array(S.String);
export class Endpoint extends S.Class<Endpoint>("Endpoint")({
  Address: S.optional(S.String),
  Port: S.optional(S.Number),
}) {}
export class PendingLogDeliveryConfiguration extends S.Class<PendingLogDeliveryConfiguration>(
  "PendingLogDeliveryConfiguration",
)({
  LogType: S.optional(S.String),
  DestinationType: S.optional(S.String),
  DestinationDetails: S.optional(DestinationDetails),
  LogFormat: S.optional(S.String),
}) {}
export const PendingLogDeliveryConfigurationList = S.Array(
  PendingLogDeliveryConfiguration,
);
export class ScaleConfig extends S.Class<ScaleConfig>("ScaleConfig")({
  ScalePercentage: S.optional(S.Number),
  ScaleIntervalMinutes: S.optional(S.Number),
}) {}
export class PendingModifiedValues extends S.Class<PendingModifiedValues>(
  "PendingModifiedValues",
)({
  NumCacheNodes: S.optional(S.Number),
  CacheNodeIdsToRemove: S.optional(CacheNodeIdsList),
  EngineVersion: S.optional(S.String),
  CacheNodeType: S.optional(S.String),
  AuthTokenStatus: S.optional(S.String),
  LogDeliveryConfigurations: S.optional(PendingLogDeliveryConfigurationList),
  TransitEncryptionEnabled: S.optional(S.Boolean),
  TransitEncryptionMode: S.optional(S.String),
  ScaleConfig: S.optional(ScaleConfig),
}) {}
export class NotificationConfiguration extends S.Class<NotificationConfiguration>(
  "NotificationConfiguration",
)({ TopicArn: S.optional(S.String), TopicStatus: S.optional(S.String) }) {}
export class CacheSecurityGroupMembership extends S.Class<CacheSecurityGroupMembership>(
  "CacheSecurityGroupMembership",
)({
  CacheSecurityGroupName: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const CacheSecurityGroupMembershipList = S.Array(
  CacheSecurityGroupMembership.pipe(T.XmlName("CacheSecurityGroup")),
);
export class CacheParameterGroupStatus extends S.Class<CacheParameterGroupStatus>(
  "CacheParameterGroupStatus",
)({
  CacheParameterGroupName: S.optional(S.String),
  ParameterApplyStatus: S.optional(S.String),
  CacheNodeIdsToReboot: S.optional(CacheNodeIdsList),
}) {}
export class CacheNode extends S.Class<CacheNode>("CacheNode")({
  CacheNodeId: S.optional(S.String),
  CacheNodeStatus: S.optional(S.String),
  CacheNodeCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  Endpoint: S.optional(Endpoint),
  ParameterGroupStatus: S.optional(S.String),
  SourceCacheNodeId: S.optional(S.String),
  CustomerAvailabilityZone: S.optional(S.String),
  CustomerOutpostArn: S.optional(S.String),
}) {}
export const CacheNodeList = S.Array(CacheNode.pipe(T.XmlName("CacheNode")));
export class SecurityGroupMembership extends S.Class<SecurityGroupMembership>(
  "SecurityGroupMembership",
)({ SecurityGroupId: S.optional(S.String), Status: S.optional(S.String) }) {}
export const SecurityGroupMembershipList = S.Array(SecurityGroupMembership);
export class LogDeliveryConfiguration extends S.Class<LogDeliveryConfiguration>(
  "LogDeliveryConfiguration",
)({
  LogType: S.optional(S.String),
  DestinationType: S.optional(S.String),
  DestinationDetails: S.optional(DestinationDetails),
  LogFormat: S.optional(S.String),
  Status: S.optional(S.String),
  Message: S.optional(S.String),
}) {}
export const LogDeliveryConfigurationList = S.Array(
  LogDeliveryConfiguration.pipe(T.XmlName("LogDeliveryConfiguration")),
);
export class CacheCluster extends S.Class<CacheCluster>("CacheCluster")({
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
}) {}
export const CacheClusterList = S.Array(
  CacheCluster.pipe(T.XmlName("CacheCluster")),
);
export class CacheParameterGroup extends S.Class<CacheParameterGroup>(
  "CacheParameterGroup",
)({
  CacheParameterGroupName: S.optional(S.String),
  CacheParameterGroupFamily: S.optional(S.String),
  Description: S.optional(S.String),
  IsGlobal: S.optional(S.Boolean),
  ARN: S.optional(S.String),
}) {}
export const CacheParameterGroupList = S.Array(
  CacheParameterGroup.pipe(T.XmlName("CacheParameterGroup")),
);
export class EC2SecurityGroup extends S.Class<EC2SecurityGroup>(
  "EC2SecurityGroup",
)({
  Status: S.optional(S.String),
  EC2SecurityGroupName: S.optional(S.String),
  EC2SecurityGroupOwnerId: S.optional(S.String),
}) {}
export const EC2SecurityGroupList = S.Array(
  EC2SecurityGroup.pipe(T.XmlName("EC2SecurityGroup")),
);
export class CacheSecurityGroup extends S.Class<CacheSecurityGroup>(
  "CacheSecurityGroup",
)({
  OwnerId: S.optional(S.String),
  CacheSecurityGroupName: S.optional(S.String),
  Description: S.optional(S.String),
  EC2SecurityGroups: S.optional(EC2SecurityGroupList),
  ARN: S.optional(S.String),
}) {}
export const CacheSecurityGroups = S.Array(
  CacheSecurityGroup.pipe(T.XmlName("CacheSecurityGroup")),
);
export class AvailabilityZone extends S.Class<AvailabilityZone>(
  "AvailabilityZone",
)({ Name: S.optional(S.String) }) {}
export class SubnetOutpost extends S.Class<SubnetOutpost>("SubnetOutpost")({
  SubnetOutpostArn: S.optional(S.String),
}) {}
export const NetworkTypeList = S.Array(S.String);
export class Subnet extends S.Class<Subnet>("Subnet")({
  SubnetIdentifier: S.optional(S.String),
  SubnetAvailabilityZone: S.optional(AvailabilityZone),
  SubnetOutpost: S.optional(SubnetOutpost),
  SupportedNetworkTypes: S.optional(NetworkTypeList),
}) {}
export const SubnetList = S.Array(Subnet.pipe(T.XmlName("Subnet")));
export class CacheSubnetGroup extends S.Class<CacheSubnetGroup>(
  "CacheSubnetGroup",
)({
  CacheSubnetGroupName: S.optional(S.String),
  CacheSubnetGroupDescription: S.optional(S.String),
  VpcId: S.optional(S.String),
  Subnets: S.optional(SubnetList),
  ARN: S.optional(S.String),
  SupportedNetworkTypes: S.optional(NetworkTypeList),
}) {}
export const CacheSubnetGroups = S.Array(
  CacheSubnetGroup.pipe(T.XmlName("CacheSubnetGroup")),
);
export class GlobalReplicationGroupMember extends S.Class<GlobalReplicationGroupMember>(
  "GlobalReplicationGroupMember",
)({
  ReplicationGroupId: S.optional(S.String),
  ReplicationGroupRegion: S.optional(S.String),
  Role: S.optional(S.String),
  AutomaticFailover: S.optional(S.String),
  Status: S.optional(S.String),
}) {}
export const GlobalReplicationGroupMemberList = S.Array(
  GlobalReplicationGroupMember.pipe(T.XmlName("GlobalReplicationGroupMember")),
);
export class GlobalNodeGroup extends S.Class<GlobalNodeGroup>(
  "GlobalNodeGroup",
)({ GlobalNodeGroupId: S.optional(S.String), Slots: S.optional(S.String) }) {}
export const GlobalNodeGroupList = S.Array(
  GlobalNodeGroup.pipe(T.XmlName("GlobalNodeGroup")),
);
export class GlobalReplicationGroup extends S.Class<GlobalReplicationGroup>(
  "GlobalReplicationGroup",
)({
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
}) {}
export const GlobalReplicationGroupList = S.Array(
  GlobalReplicationGroup.pipe(T.XmlName("GlobalReplicationGroup")),
);
export class GlobalReplicationGroupInfo extends S.Class<GlobalReplicationGroupInfo>(
  "GlobalReplicationGroupInfo",
)({
  GlobalReplicationGroupId: S.optional(S.String),
  GlobalReplicationGroupMemberRole: S.optional(S.String),
}) {}
export class SlotMigration extends S.Class<SlotMigration>("SlotMigration")({
  ProgressPercentage: S.optional(S.Number),
}) {}
export class ReshardingStatus extends S.Class<ReshardingStatus>(
  "ReshardingStatus",
)({ SlotMigration: S.optional(SlotMigration) }) {}
export class UserGroupsUpdateStatus extends S.Class<UserGroupsUpdateStatus>(
  "UserGroupsUpdateStatus",
)({
  UserGroupIdsToAdd: S.optional(UserGroupIdList),
  UserGroupIdsToRemove: S.optional(UserGroupIdList),
}) {}
export class ReplicationGroupPendingModifiedValues extends S.Class<ReplicationGroupPendingModifiedValues>(
  "ReplicationGroupPendingModifiedValues",
)({
  PrimaryClusterId: S.optional(S.String),
  AutomaticFailoverStatus: S.optional(S.String),
  Resharding: S.optional(ReshardingStatus),
  AuthTokenStatus: S.optional(S.String),
  UserGroups: S.optional(UserGroupsUpdateStatus),
  LogDeliveryConfigurations: S.optional(PendingLogDeliveryConfigurationList),
  TransitEncryptionEnabled: S.optional(S.Boolean),
  TransitEncryptionMode: S.optional(S.String),
  ClusterMode: S.optional(S.String),
}) {}
export const ClusterIdList = S.Array(S.String.pipe(T.XmlName("ClusterId")));
export class NodeGroupMember extends S.Class<NodeGroupMember>(
  "NodeGroupMember",
)({
  CacheClusterId: S.optional(S.String),
  CacheNodeId: S.optional(S.String),
  ReadEndpoint: S.optional(Endpoint),
  PreferredAvailabilityZone: S.optional(S.String),
  PreferredOutpostArn: S.optional(S.String),
  CurrentRole: S.optional(S.String),
}) {}
export const NodeGroupMemberList = S.Array(
  NodeGroupMember.pipe(T.XmlName("NodeGroupMember")),
);
export class NodeGroup extends S.Class<NodeGroup>("NodeGroup")({
  NodeGroupId: S.optional(S.String),
  Status: S.optional(S.String),
  PrimaryEndpoint: S.optional(Endpoint),
  ReaderEndpoint: S.optional(Endpoint),
  Slots: S.optional(S.String),
  NodeGroupMembers: S.optional(NodeGroupMemberList),
}) {}
export const NodeGroupList = S.Array(NodeGroup.pipe(T.XmlName("NodeGroup")));
export const ReplicationGroupOutpostArnList = S.Array(
  S.String.pipe(T.XmlName("ReplicationGroupOutpostArn")),
);
export class ReplicationGroup extends S.Class<ReplicationGroup>(
  "ReplicationGroup",
)({
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
}) {}
export const ReplicationGroupList = S.Array(
  ReplicationGroup.pipe(T.XmlName("ReplicationGroup")),
);
export class ServerlessCache extends S.Class<ServerlessCache>(
  "ServerlessCache",
)({
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
}) {}
export const ServerlessCacheList = S.Array(ServerlessCache);
export class ServerlessCacheConfiguration extends S.Class<ServerlessCacheConfiguration>(
  "ServerlessCacheConfiguration",
)({
  ServerlessCacheName: S.optional(S.String),
  Engine: S.optional(S.String),
  MajorEngineVersion: S.optional(S.String),
}) {}
export class ServerlessCacheSnapshot extends S.Class<ServerlessCacheSnapshot>(
  "ServerlessCacheSnapshot",
)({
  ServerlessCacheSnapshotName: S.optional(S.String),
  ARN: S.optional(S.String),
  KmsKeyId: S.optional(S.String),
  SnapshotType: S.optional(S.String),
  Status: S.optional(S.String),
  CreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  ExpiryTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  BytesUsedForCache: S.optional(S.String),
  ServerlessCacheConfiguration: S.optional(ServerlessCacheConfiguration),
}) {}
export const ServerlessCacheSnapshotList = S.Array(
  ServerlessCacheSnapshot.pipe(T.XmlName("ServerlessCacheSnapshot")),
);
export class NodeSnapshot extends S.Class<NodeSnapshot>("NodeSnapshot")({
  CacheClusterId: S.optional(S.String),
  NodeGroupId: S.optional(S.String),
  CacheNodeId: S.optional(S.String),
  NodeGroupConfiguration: S.optional(NodeGroupConfiguration),
  CacheSize: S.optional(S.String),
  CacheNodeCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  SnapshotCreateTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const NodeSnapshotList = S.Array(
  NodeSnapshot.pipe(T.XmlName("NodeSnapshot")),
);
export class Snapshot extends S.Class<Snapshot>("Snapshot")({
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
}) {}
export const SnapshotList = S.Array(Snapshot.pipe(T.XmlName("Snapshot")));
export class TimeRangeFilter extends S.Class<TimeRangeFilter>(
  "TimeRangeFilter",
)({
  StartTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  EndTime: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export class UserGroupPendingChanges extends S.Class<UserGroupPendingChanges>(
  "UserGroupPendingChanges",
)({
  UserIdsToRemove: S.optional(UserIdList),
  UserIdsToAdd: S.optional(UserIdList),
}) {}
export class UserGroup extends S.Class<UserGroup>("UserGroup")(
  {
    UserGroupId: S.optional(S.String),
    Status: S.optional(S.String),
    Engine: S.optional(S.String),
    UserIds: S.optional(UserIdList),
    MinimumEngineVersion: S.optional(S.String),
    PendingChanges: S.optional(UserGroupPendingChanges),
    ReplicationGroups: S.optional(UGReplicationGroupIdList),
    ServerlessCaches: S.optional(UGServerlessCacheIdList),
    ARN: S.optional(S.String),
  },
  ns,
) {}
export const UserGroupList = S.Array(UserGroup);
export class Filter extends S.Class<Filter>("Filter")({
  Name: S.String,
  Values: FilterValueList,
}) {}
export const FilterList = S.Array(Filter);
export class ReshardingConfiguration extends S.Class<ReshardingConfiguration>(
  "ReshardingConfiguration",
)({
  NodeGroupId: S.optional(S.String),
  PreferredAvailabilityZones: S.optional(AvailabilityZonesList),
}) {}
export const ReshardingConfigurationList = S.Array(
  ReshardingConfiguration.pipe(T.XmlName("ReshardingConfiguration")),
);
export class RegionalConfiguration extends S.Class<RegionalConfiguration>(
  "RegionalConfiguration",
)({
  ReplicationGroupId: S.String,
  ReplicationGroupRegion: S.String,
  ReshardingConfiguration: ReshardingConfigurationList,
}) {}
export const RegionalConfigurationList = S.Array(
  RegionalConfiguration.pipe(T.XmlName("RegionalConfiguration")),
);
export const NodeTypeList = S.Array(S.String);
export class AddTagsToResourceMessage extends S.Class<AddTagsToResourceMessage>(
  "AddTagsToResourceMessage",
)(
  { ResourceName: S.String, Tags: TagList },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateCacheSecurityGroupResult extends S.Class<CreateCacheSecurityGroupResult>(
  "CreateCacheSecurityGroupResult",
)({ CacheSecurityGroup: S.optional(CacheSecurityGroup) }, ns) {}
export class CreateReplicationGroupMessage extends S.Class<CreateReplicationGroupMessage>(
  "CreateReplicationGroupMessage",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateServerlessCacheSnapshotResponse extends S.Class<CreateServerlessCacheSnapshotResponse>(
  "CreateServerlessCacheSnapshotResponse",
)({ ServerlessCacheSnapshot: S.optional(ServerlessCacheSnapshot) }, ns) {}
export class CreateSnapshotResult extends S.Class<CreateSnapshotResult>(
  "CreateSnapshotResult",
)({ Snapshot: S.optional(Snapshot) }, ns) {}
export class CreateUserMessage extends S.Class<CreateUserMessage>(
  "CreateUserMessage",
)(
  {
    UserId: S.String,
    UserName: S.String,
    Engine: S.String,
    Passwords: S.optional(PasswordListInput),
    AccessString: S.String,
    NoPasswordRequired: S.optional(S.Boolean),
    Tags: S.optional(TagList),
    AuthenticationMode: S.optional(AuthenticationMode),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DecreaseNodeGroupsInGlobalReplicationGroupResult extends S.Class<DecreaseNodeGroupsInGlobalReplicationGroupResult>(
  "DecreaseNodeGroupsInGlobalReplicationGroupResult",
)({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }, ns) {}
export class DecreaseReplicaCountMessage extends S.Class<DecreaseReplicaCountMessage>(
  "DecreaseReplicaCountMessage",
)(
  {
    ReplicationGroupId: S.String,
    NewReplicaCount: S.optional(S.Number),
    ReplicaConfiguration: S.optional(ReplicaConfigurationList),
    ReplicasToRemove: S.optional(RemoveReplicasList),
    ApplyImmediately: S.Boolean,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DeleteGlobalReplicationGroupResult extends S.Class<DeleteGlobalReplicationGroupResult>(
  "DeleteGlobalReplicationGroupResult",
)({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }, ns) {}
export class DeleteReplicationGroupResult extends S.Class<DeleteReplicationGroupResult>(
  "DeleteReplicationGroupResult",
)({ ReplicationGroup: S.optional(ReplicationGroup) }, ns) {}
export class DeleteServerlessCacheSnapshotResponse extends S.Class<DeleteServerlessCacheSnapshotResponse>(
  "DeleteServerlessCacheSnapshotResponse",
)({ ServerlessCacheSnapshot: S.optional(ServerlessCacheSnapshot) }, ns) {}
export class DeleteSnapshotResult extends S.Class<DeleteSnapshotResult>(
  "DeleteSnapshotResult",
)({ Snapshot: S.optional(Snapshot) }, ns) {}
export class CacheClusterMessage extends S.Class<CacheClusterMessage>(
  "CacheClusterMessage",
)(
  { Marker: S.optional(S.String), CacheClusters: S.optional(CacheClusterList) },
  ns,
) {}
export class CacheParameterGroupsMessage extends S.Class<CacheParameterGroupsMessage>(
  "CacheParameterGroupsMessage",
)(
  {
    Marker: S.optional(S.String),
    CacheParameterGroups: S.optional(CacheParameterGroupList),
  },
  ns,
) {}
export class CacheSecurityGroupMessage extends S.Class<CacheSecurityGroupMessage>(
  "CacheSecurityGroupMessage",
)(
  {
    Marker: S.optional(S.String),
    CacheSecurityGroups: S.optional(CacheSecurityGroups),
  },
  ns,
) {}
export class CacheSubnetGroupMessage extends S.Class<CacheSubnetGroupMessage>(
  "CacheSubnetGroupMessage",
)(
  {
    Marker: S.optional(S.String),
    CacheSubnetGroups: S.optional(CacheSubnetGroups),
  },
  ns,
) {}
export class DescribeGlobalReplicationGroupsResult extends S.Class<DescribeGlobalReplicationGroupsResult>(
  "DescribeGlobalReplicationGroupsResult",
)(
  {
    Marker: S.optional(S.String),
    GlobalReplicationGroups: S.optional(GlobalReplicationGroupList),
  },
  ns,
) {}
export class ReplicationGroupMessage extends S.Class<ReplicationGroupMessage>(
  "ReplicationGroupMessage",
)(
  {
    Marker: S.optional(S.String),
    ReplicationGroups: S.optional(ReplicationGroupList),
  },
  ns,
) {}
export class DescribeServerlessCachesResponse extends S.Class<DescribeServerlessCachesResponse>(
  "DescribeServerlessCachesResponse",
)(
  {
    NextToken: S.optional(S.String),
    ServerlessCaches: S.optional(ServerlessCacheList),
  },
  ns,
) {}
export class DescribeServerlessCacheSnapshotsResponse extends S.Class<DescribeServerlessCacheSnapshotsResponse>(
  "DescribeServerlessCacheSnapshotsResponse",
)(
  {
    NextToken: S.optional(S.String),
    ServerlessCacheSnapshots: S.optional(ServerlessCacheSnapshotList),
  },
  ns,
) {}
export class DescribeSnapshotsListMessage extends S.Class<DescribeSnapshotsListMessage>(
  "DescribeSnapshotsListMessage",
)({ Marker: S.optional(S.String), Snapshots: S.optional(SnapshotList) }, ns) {}
export class DescribeUpdateActionsMessage extends S.Class<DescribeUpdateActionsMessage>(
  "DescribeUpdateActionsMessage",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DescribeUserGroupsResult extends S.Class<DescribeUserGroupsResult>(
  "DescribeUserGroupsResult",
)(
  { UserGroups: S.optional(UserGroupList), Marker: S.optional(S.String) },
  ns,
) {}
export class DescribeUsersMessage extends S.Class<DescribeUsersMessage>(
  "DescribeUsersMessage",
)(
  {
    Engine: S.optional(S.String),
    UserId: S.optional(S.String),
    Filters: S.optional(FilterList),
    MaxRecords: S.optional(S.Number),
    Marker: S.optional(S.String),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DisassociateGlobalReplicationGroupResult extends S.Class<DisassociateGlobalReplicationGroupResult>(
  "DisassociateGlobalReplicationGroupResult",
)({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }, ns) {}
export class ExportServerlessCacheSnapshotResponse extends S.Class<ExportServerlessCacheSnapshotResponse>(
  "ExportServerlessCacheSnapshotResponse",
)({ ServerlessCacheSnapshot: S.optional(ServerlessCacheSnapshot) }, ns) {}
export class FailoverGlobalReplicationGroupResult extends S.Class<FailoverGlobalReplicationGroupResult>(
  "FailoverGlobalReplicationGroupResult",
)({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }, ns) {}
export class IncreaseNodeGroupsInGlobalReplicationGroupMessage extends S.Class<IncreaseNodeGroupsInGlobalReplicationGroupMessage>(
  "IncreaseNodeGroupsInGlobalReplicationGroupMessage",
)(
  {
    GlobalReplicationGroupId: S.String,
    NodeGroupCount: S.Number,
    RegionalConfigurations: S.optional(RegionalConfigurationList),
    ApplyImmediately: S.Boolean,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class IncreaseReplicaCountResult extends S.Class<IncreaseReplicaCountResult>(
  "IncreaseReplicaCountResult",
)({ ReplicationGroup: S.optional(ReplicationGroup) }, ns) {}
export class AllowedNodeTypeModificationsMessage extends S.Class<AllowedNodeTypeModificationsMessage>(
  "AllowedNodeTypeModificationsMessage",
)(
  {
    ScaleUpModifications: S.optional(NodeTypeList),
    ScaleDownModifications: S.optional(NodeTypeList),
  },
  ns,
) {}
export class TagListMessage extends S.Class<TagListMessage>("TagListMessage")(
  { TagList: S.optional(TagList) },
  ns,
) {}
export class ModifyCacheClusterMessage extends S.Class<ModifyCacheClusterMessage>(
  "ModifyCacheClusterMessage",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyCacheParameterGroupMessage extends S.Class<ModifyCacheParameterGroupMessage>(
  "ModifyCacheParameterGroupMessage",
)(
  {
    CacheParameterGroupName: S.String,
    ParameterNameValues: ParameterNameValueList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyCacheSubnetGroupResult extends S.Class<ModifyCacheSubnetGroupResult>(
  "ModifyCacheSubnetGroupResult",
)({ CacheSubnetGroup: S.optional(CacheSubnetGroup) }, ns) {}
export class ModifyGlobalReplicationGroupResult extends S.Class<ModifyGlobalReplicationGroupResult>(
  "ModifyGlobalReplicationGroupResult",
)({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }, ns) {}
export class ModifyReplicationGroupResult extends S.Class<ModifyReplicationGroupResult>(
  "ModifyReplicationGroupResult",
)({ ReplicationGroup: S.optional(ReplicationGroup) }, ns) {}
export class ModifyReplicationGroupShardConfigurationMessage extends S.Class<ModifyReplicationGroupShardConfigurationMessage>(
  "ModifyReplicationGroupShardConfigurationMessage",
)(
  {
    ReplicationGroupId: S.String,
    NodeGroupCount: S.Number,
    ApplyImmediately: S.Boolean,
    ReshardingConfiguration: S.optional(ReshardingConfigurationList),
    NodeGroupsToRemove: S.optional(NodeGroupsToRemoveList),
    NodeGroupsToRetain: S.optional(NodeGroupsToRetainList),
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class ModifyServerlessCacheResponse extends S.Class<ModifyServerlessCacheResponse>(
  "ModifyServerlessCacheResponse",
)({ ServerlessCache: S.optional(ServerlessCache) }, ns) {}
export class RecurringCharge extends S.Class<RecurringCharge>(
  "RecurringCharge",
)({
  RecurringChargeAmount: S.optional(S.Number),
  RecurringChargeFrequency: S.optional(S.String),
}) {}
export const RecurringChargeList = S.Array(
  RecurringCharge.pipe(T.XmlName("RecurringCharge")),
);
export class ReservedCacheNode extends S.Class<ReservedCacheNode>(
  "ReservedCacheNode",
)({
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
}) {}
export class PurchaseReservedCacheNodesOfferingResult extends S.Class<PurchaseReservedCacheNodesOfferingResult>(
  "PurchaseReservedCacheNodesOfferingResult",
)({ ReservedCacheNode: S.optional(ReservedCacheNode) }, ns) {}
export class RebalanceSlotsInGlobalReplicationGroupResult extends S.Class<RebalanceSlotsInGlobalReplicationGroupResult>(
  "RebalanceSlotsInGlobalReplicationGroupResult",
)({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }, ns) {}
export class RebootCacheClusterResult extends S.Class<RebootCacheClusterResult>(
  "RebootCacheClusterResult",
)({ CacheCluster: S.optional(CacheCluster) }, ns) {}
export class CacheParameterGroupNameMessage extends S.Class<CacheParameterGroupNameMessage>(
  "CacheParameterGroupNameMessage",
)({ CacheParameterGroupName: S.optional(S.String) }, ns) {}
export class RevokeCacheSecurityGroupIngressResult extends S.Class<RevokeCacheSecurityGroupIngressResult>(
  "RevokeCacheSecurityGroupIngressResult",
)({ CacheSecurityGroup: S.optional(CacheSecurityGroup) }, ns) {}
export class StartMigrationMessage extends S.Class<StartMigrationMessage>(
  "StartMigrationMessage",
)(
  {
    ReplicationGroupId: S.String,
    CustomerNodeEndpointList: CustomerNodeEndpointList,
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class TestFailoverResult extends S.Class<TestFailoverResult>(
  "TestFailoverResult",
)({ ReplicationGroup: S.optional(ReplicationGroup) }, ns) {}
export class TestMigrationResponse extends S.Class<TestMigrationResponse>(
  "TestMigrationResponse",
)({ ReplicationGroup: S.optional(ReplicationGroup) }, ns) {}
export class ProcessedUpdateAction extends S.Class<ProcessedUpdateAction>(
  "ProcessedUpdateAction",
)({
  ReplicationGroupId: S.optional(S.String),
  CacheClusterId: S.optional(S.String),
  ServiceUpdateName: S.optional(S.String),
  UpdateActionStatus: S.optional(S.String),
}) {}
export const ProcessedUpdateActionList = S.Array(
  ProcessedUpdateAction.pipe(T.XmlName("ProcessedUpdateAction")),
);
export class UnprocessedUpdateAction extends S.Class<UnprocessedUpdateAction>(
  "UnprocessedUpdateAction",
)({
  ReplicationGroupId: S.optional(S.String),
  CacheClusterId: S.optional(S.String),
  ServiceUpdateName: S.optional(S.String),
  ErrorType: S.optional(S.String),
  ErrorMessage: S.optional(S.String),
}) {}
export const UnprocessedUpdateActionList = S.Array(
  UnprocessedUpdateAction.pipe(T.XmlName("UnprocessedUpdateAction")),
);
export class Authentication extends S.Class<Authentication>("Authentication")({
  Type: S.optional(S.String),
  PasswordCount: S.optional(S.Number),
}) {}
export class CacheEngineVersion extends S.Class<CacheEngineVersion>(
  "CacheEngineVersion",
)({
  Engine: S.optional(S.String),
  EngineVersion: S.optional(S.String),
  CacheParameterGroupFamily: S.optional(S.String),
  CacheEngineDescription: S.optional(S.String),
  CacheEngineVersionDescription: S.optional(S.String),
}) {}
export const CacheEngineVersionList = S.Array(
  CacheEngineVersion.pipe(T.XmlName("CacheEngineVersion")),
);
export class Parameter extends S.Class<Parameter>("Parameter")({
  ParameterName: S.optional(S.String),
  ParameterValue: S.optional(S.String),
  Description: S.optional(S.String),
  Source: S.optional(S.String),
  DataType: S.optional(S.String),
  AllowedValues: S.optional(S.String),
  IsModifiable: S.optional(S.Boolean),
  MinimumEngineVersion: S.optional(S.String),
  ChangeType: S.optional(S.String),
}) {}
export const ParametersList = S.Array(Parameter.pipe(T.XmlName("Parameter")));
export class CacheNodeTypeSpecificValue extends S.Class<CacheNodeTypeSpecificValue>(
  "CacheNodeTypeSpecificValue",
)({ CacheNodeType: S.optional(S.String), Value: S.optional(S.String) }) {}
export const CacheNodeTypeSpecificValueList = S.Array(
  CacheNodeTypeSpecificValue.pipe(T.XmlName("CacheNodeTypeSpecificValue")),
);
export class CacheNodeTypeSpecificParameter extends S.Class<CacheNodeTypeSpecificParameter>(
  "CacheNodeTypeSpecificParameter",
)({
  ParameterName: S.optional(S.String),
  Description: S.optional(S.String),
  Source: S.optional(S.String),
  DataType: S.optional(S.String),
  AllowedValues: S.optional(S.String),
  IsModifiable: S.optional(S.Boolean),
  MinimumEngineVersion: S.optional(S.String),
  CacheNodeTypeSpecificValues: S.optional(CacheNodeTypeSpecificValueList),
  ChangeType: S.optional(S.String),
}) {}
export const CacheNodeTypeSpecificParametersList = S.Array(
  CacheNodeTypeSpecificParameter.pipe(
    T.XmlName("CacheNodeTypeSpecificParameter"),
  ),
);
export class EngineDefaults extends S.Class<EngineDefaults>("EngineDefaults")({
  CacheParameterGroupFamily: S.optional(S.String),
  Marker: S.optional(S.String),
  Parameters: S.optional(ParametersList),
  CacheNodeTypeSpecificParameters: S.optional(
    CacheNodeTypeSpecificParametersList,
  ),
}) {}
export class Event extends S.Class<Event>("Event")({
  SourceIdentifier: S.optional(S.String),
  SourceType: S.optional(S.String),
  Message: S.optional(S.String),
  Date: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
}) {}
export const EventList = S.Array(Event.pipe(T.XmlName("Event")));
export class ReservedCacheNodesOffering extends S.Class<ReservedCacheNodesOffering>(
  "ReservedCacheNodesOffering",
)({
  ReservedCacheNodesOfferingId: S.optional(S.String),
  CacheNodeType: S.optional(S.String),
  Duration: S.optional(S.Number),
  FixedPrice: S.optional(S.Number),
  UsagePrice: S.optional(S.Number),
  ProductDescription: S.optional(S.String),
  OfferingType: S.optional(S.String),
  RecurringCharges: S.optional(RecurringChargeList),
}) {}
export const ReservedCacheNodesOfferingList = S.Array(
  ReservedCacheNodesOffering.pipe(T.XmlName("ReservedCacheNodesOffering")),
);
export class ServiceUpdate extends S.Class<ServiceUpdate>("ServiceUpdate")({
  ServiceUpdateName: S.optional(S.String),
  ServiceUpdateReleaseDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  ServiceUpdateEndDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
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
}) {}
export const ServiceUpdateList = S.Array(
  ServiceUpdate.pipe(T.XmlName("ServiceUpdate")),
);
export class User extends S.Class<User>("User")(
  {
    UserId: S.optional(S.String),
    UserName: S.optional(S.String),
    Status: S.optional(S.String),
    Engine: S.optional(S.String),
    MinimumEngineVersion: S.optional(S.String),
    AccessString: S.optional(S.String),
    UserGroupIds: S.optional(UserGroupIdList),
    Authentication: S.optional(Authentication),
    ARN: S.optional(S.String),
  },
  ns,
) {}
export const UserList = S.Array(User);
export class UpdateActionResultsMessage extends S.Class<UpdateActionResultsMessage>(
  "UpdateActionResultsMessage",
)(
  {
    ProcessedUpdateActions: S.optional(ProcessedUpdateActionList),
    UnprocessedUpdateActions: S.optional(UnprocessedUpdateActionList),
  },
  ns,
) {}
export class CreateCacheParameterGroupResult extends S.Class<CreateCacheParameterGroupResult>(
  "CreateCacheParameterGroupResult",
)({ CacheParameterGroup: S.optional(CacheParameterGroup) }, ns) {}
export class CreateReplicationGroupResult extends S.Class<CreateReplicationGroupResult>(
  "CreateReplicationGroupResult",
)({ ReplicationGroup: S.optional(ReplicationGroup) }, ns) {}
export class CreateServerlessCacheRequest extends S.Class<CreateServerlessCacheRequest>(
  "CreateServerlessCacheRequest",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class DecreaseReplicaCountResult extends S.Class<DecreaseReplicaCountResult>(
  "DecreaseReplicaCountResult",
)({ ReplicationGroup: S.optional(ReplicationGroup) }, ns) {}
export class DeleteServerlessCacheResponse extends S.Class<DeleteServerlessCacheResponse>(
  "DeleteServerlessCacheResponse",
)({ ServerlessCache: S.optional(ServerlessCache) }, ns) {}
export class CacheEngineVersionMessage extends S.Class<CacheEngineVersionMessage>(
  "CacheEngineVersionMessage",
)(
  {
    Marker: S.optional(S.String),
    CacheEngineVersions: S.optional(CacheEngineVersionList),
  },
  ns,
) {}
export class DescribeEngineDefaultParametersResult extends S.Class<DescribeEngineDefaultParametersResult>(
  "DescribeEngineDefaultParametersResult",
)({ EngineDefaults: S.optional(EngineDefaults) }, ns) {}
export class EventsMessage extends S.Class<EventsMessage>("EventsMessage")(
  { Marker: S.optional(S.String), Events: S.optional(EventList) },
  ns,
) {}
export class ReservedCacheNodesOfferingMessage extends S.Class<ReservedCacheNodesOfferingMessage>(
  "ReservedCacheNodesOfferingMessage",
)(
  {
    Marker: S.optional(S.String),
    ReservedCacheNodesOfferings: S.optional(ReservedCacheNodesOfferingList),
  },
  ns,
) {}
export class ServiceUpdatesMessage extends S.Class<ServiceUpdatesMessage>(
  "ServiceUpdatesMessage",
)(
  {
    Marker: S.optional(S.String),
    ServiceUpdates: S.optional(ServiceUpdateList),
  },
  ns,
) {}
export class DescribeUsersResult extends S.Class<DescribeUsersResult>(
  "DescribeUsersResult",
)({ Users: S.optional(UserList), Marker: S.optional(S.String) }, ns) {}
export class IncreaseNodeGroupsInGlobalReplicationGroupResult extends S.Class<IncreaseNodeGroupsInGlobalReplicationGroupResult>(
  "IncreaseNodeGroupsInGlobalReplicationGroupResult",
)({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }, ns) {}
export class ModifyCacheClusterResult extends S.Class<ModifyCacheClusterResult>(
  "ModifyCacheClusterResult",
)({ CacheCluster: S.optional(CacheCluster) }, ns) {}
export class ModifyReplicationGroupShardConfigurationResult extends S.Class<ModifyReplicationGroupShardConfigurationResult>(
  "ModifyReplicationGroupShardConfigurationResult",
)({ ReplicationGroup: S.optional(ReplicationGroup) }, ns) {}
export class StartMigrationResponse extends S.Class<StartMigrationResponse>(
  "StartMigrationResponse",
)({ ReplicationGroup: S.optional(ReplicationGroup) }, ns) {}
export const ReservedCacheNodeList = S.Array(
  ReservedCacheNode.pipe(T.XmlName("ReservedCacheNode")),
);
export class AuthorizeCacheSecurityGroupIngressResult extends S.Class<AuthorizeCacheSecurityGroupIngressResult>(
  "AuthorizeCacheSecurityGroupIngressResult",
)({ CacheSecurityGroup: S.optional(CacheSecurityGroup) }, ns) {}
export class CopyServerlessCacheSnapshotResponse extends S.Class<CopyServerlessCacheSnapshotResponse>(
  "CopyServerlessCacheSnapshotResponse",
)({ ServerlessCacheSnapshot: S.optional(ServerlessCacheSnapshot) }, ns) {}
export class CopySnapshotResult extends S.Class<CopySnapshotResult>(
  "CopySnapshotResult",
)({ Snapshot: S.optional(Snapshot) }, ns) {}
export class CreateCacheClusterMessage extends S.Class<CreateCacheClusterMessage>(
  "CreateCacheClusterMessage",
)(
  {
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
  },
  T.all(ns, T.Http({ method: "POST", uri: "/" }), svc, auth, proto, ver, rules),
) {}
export class CreateGlobalReplicationGroupResult extends S.Class<CreateGlobalReplicationGroupResult>(
  "CreateGlobalReplicationGroupResult",
)({ GlobalReplicationGroup: S.optional(GlobalReplicationGroup) }, ns) {}
export class CreateServerlessCacheResponse extends S.Class<CreateServerlessCacheResponse>(
  "CreateServerlessCacheResponse",
)({ ServerlessCache: S.optional(ServerlessCache) }, ns) {}
export class DeleteCacheClusterResult extends S.Class<DeleteCacheClusterResult>(
  "DeleteCacheClusterResult",
)({ CacheCluster: S.optional(CacheCluster) }, ns) {}
export class CacheParameterGroupDetails extends S.Class<CacheParameterGroupDetails>(
  "CacheParameterGroupDetails",
)(
  {
    Marker: S.optional(S.String),
    Parameters: S.optional(ParametersList),
    CacheNodeTypeSpecificParameters: S.optional(
      CacheNodeTypeSpecificParametersList,
    ),
  },
  ns,
) {}
export class ReservedCacheNodeMessage extends S.Class<ReservedCacheNodeMessage>(
  "ReservedCacheNodeMessage",
)(
  {
    Marker: S.optional(S.String),
    ReservedCacheNodes: S.optional(ReservedCacheNodeList),
  },
  ns,
) {}
export class CacheNodeUpdateStatus extends S.Class<CacheNodeUpdateStatus>(
  "CacheNodeUpdateStatus",
)({
  CacheNodeId: S.optional(S.String),
  NodeUpdateStatus: S.optional(S.String),
  NodeDeletionDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  NodeUpdateStartDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  NodeUpdateEndDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  NodeUpdateInitiatedBy: S.optional(S.String),
  NodeUpdateInitiatedDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  NodeUpdateStatusModifiedDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export const CacheNodeUpdateStatusList = S.Array(
  CacheNodeUpdateStatus.pipe(T.XmlName("CacheNodeUpdateStatus")),
);
export class NodeGroupMemberUpdateStatus extends S.Class<NodeGroupMemberUpdateStatus>(
  "NodeGroupMemberUpdateStatus",
)({
  CacheClusterId: S.optional(S.String),
  CacheNodeId: S.optional(S.String),
  NodeUpdateStatus: S.optional(S.String),
  NodeDeletionDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  NodeUpdateStartDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  NodeUpdateEndDate: S.optional(S.Date.pipe(T.TimestampFormat("date-time"))),
  NodeUpdateInitiatedBy: S.optional(S.String),
  NodeUpdateInitiatedDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
  NodeUpdateStatusModifiedDate: S.optional(
    S.Date.pipe(T.TimestampFormat("date-time")),
  ),
}) {}
export const NodeGroupMemberUpdateStatusList = S.Array(
  NodeGroupMemberUpdateStatus.pipe(T.XmlName("NodeGroupMemberUpdateStatus")),
);
export class CreateCacheClusterResult extends S.Class<CreateCacheClusterResult>(
  "CreateCacheClusterResult",
)({ CacheCluster: S.optional(CacheCluster) }, ns) {}
export class CreateCacheSubnetGroupResult extends S.Class<CreateCacheSubnetGroupResult>(
  "CreateCacheSubnetGroupResult",
)({ CacheSubnetGroup: S.optional(CacheSubnetGroup) }, ns) {}
export class NodeGroupUpdateStatus extends S.Class<NodeGroupUpdateStatus>(
  "NodeGroupUpdateStatus",
)({
  NodeGroupId: S.optional(S.String),
  NodeGroupMemberUpdateStatus: S.optional(NodeGroupMemberUpdateStatusList),
}) {}
export const NodeGroupUpdateStatusList = S.Array(
  NodeGroupUpdateStatus.pipe(T.XmlName("NodeGroupUpdateStatus")),
);
export class UpdateAction extends S.Class<UpdateAction>("UpdateAction")({
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
}) {}
export const UpdateActionList = S.Array(
  UpdateAction.pipe(T.XmlName("UpdateAction")),
);
export class CompleteMigrationResponse extends S.Class<CompleteMigrationResponse>(
  "CompleteMigrationResponse",
)({ ReplicationGroup: S.optional(ReplicationGroup) }, ns) {}
export class UpdateActionsMessage extends S.Class<UpdateActionsMessage>(
  "UpdateActionsMessage",
)(
  { Marker: S.optional(S.String), UpdateActions: S.optional(UpdateActionList) },
  ns,
) {}

//# Errors
export class InvalidParameterValueException extends S.TaggedError<InvalidParameterValueException>()(
  "InvalidParameterValueException",
  {},
  T.AwsQueryError({ code: "InvalidParameterValue", httpResponseCode: 400 }),
) {}
export class CacheClusterNotFoundFault extends S.TaggedError<CacheClusterNotFoundFault>()(
  "CacheClusterNotFoundFault",
  {},
  T.AwsQueryError({ code: "CacheClusterNotFound", httpResponseCode: 404 }),
) {}
export class CacheParameterGroupNotFoundFault extends S.TaggedError<CacheParameterGroupNotFoundFault>()(
  "CacheParameterGroupNotFoundFault",
  {},
  T.AwsQueryError({
    code: "CacheParameterGroupNotFound",
    httpResponseCode: 404,
  }),
) {}
export class CacheSecurityGroupNotFoundFault extends S.TaggedError<CacheSecurityGroupNotFoundFault>()(
  "CacheSecurityGroupNotFoundFault",
  {},
  T.AwsQueryError({
    code: "CacheSecurityGroupNotFound",
    httpResponseCode: 404,
  }),
) {}
export class InvalidParameterCombinationException extends S.TaggedError<InvalidParameterCombinationException>()(
  "InvalidParameterCombinationException",
  {},
  T.AwsQueryError({
    code: "InvalidParameterCombination",
    httpResponseCode: 400,
  }),
) {}
export class CacheSubnetGroupInUse extends S.TaggedError<CacheSubnetGroupInUse>()(
  "CacheSubnetGroupInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "CacheSubnetGroupInUse", httpResponseCode: 400 }),
) {}
export class CacheSubnetGroupNotFoundFault extends S.TaggedError<CacheSubnetGroupNotFoundFault>()(
  "CacheSubnetGroupNotFoundFault",
  {},
  T.AwsQueryError({
    code: "CacheSubnetGroupNotFoundFault",
    httpResponseCode: 400,
  }),
) {}
export class GlobalReplicationGroupNotFoundFault extends S.TaggedError<GlobalReplicationGroupNotFoundFault>()(
  "GlobalReplicationGroupNotFoundFault",
  {},
  T.AwsQueryError({
    code: "GlobalReplicationGroupNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class InvalidUserGroupStateFault extends S.TaggedError<InvalidUserGroupStateFault>()(
  "InvalidUserGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidUserGroupState", httpResponseCode: 400 }),
) {}
export class ServerlessCacheNotFoundFault extends S.TaggedError<ServerlessCacheNotFoundFault>()(
  "ServerlessCacheNotFoundFault",
  {},
  T.AwsQueryError({
    code: "ServerlessCacheNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class ServiceLinkedRoleNotFoundFault extends S.TaggedError<ServiceLinkedRoleNotFoundFault>()(
  "ServiceLinkedRoleNotFoundFault",
  {},
  T.AwsQueryError({
    code: "ServiceLinkedRoleNotFoundFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidGlobalReplicationGroupStateFault extends S.TaggedError<InvalidGlobalReplicationGroupStateFault>()(
  "InvalidGlobalReplicationGroupStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidGlobalReplicationGroupState",
    httpResponseCode: 400,
  }),
) {}
export class InvalidServerlessCacheSnapshotStateFault extends S.TaggedError<InvalidServerlessCacheSnapshotStateFault>()(
  "InvalidServerlessCacheSnapshotStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidServerlessCacheSnapshotStateFault",
    httpResponseCode: 400,
  }),
) {}
export class ServerlessCacheSnapshotNotFoundFault extends S.TaggedError<ServerlessCacheSnapshotNotFoundFault>()(
  "ServerlessCacheSnapshotNotFoundFault",
  {},
  T.AwsQueryError({
    code: "ServerlessCacheSnapshotNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class ReplicationGroupNotFoundFault extends S.TaggedError<ReplicationGroupNotFoundFault>()(
  "ReplicationGroupNotFoundFault",
  {},
  T.AwsQueryError({
    code: "ReplicationGroupNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class InvalidCacheParameterGroupStateFault extends S.TaggedError<InvalidCacheParameterGroupStateFault>()(
  "InvalidCacheParameterGroupStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidCacheParameterGroupState",
    httpResponseCode: 400,
  }),
) {}
export class DefaultUserRequired extends S.TaggedError<DefaultUserRequired>()(
  "DefaultUserRequired",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "DefaultUserRequired", httpResponseCode: 400 }),
) {}
export class DuplicateUserNameFault extends S.TaggedError<DuplicateUserNameFault>()(
  "DuplicateUserNameFault",
  {},
  T.AwsQueryError({ code: "DuplicateUserName", httpResponseCode: 400 }),
) {}
export class UserGroupNotFoundFault extends S.TaggedError<UserGroupNotFoundFault>()(
  "UserGroupNotFoundFault",
  {},
  T.AwsQueryError({ code: "UserGroupNotFound", httpResponseCode: 404 }),
) {}
export class InvalidCacheClusterStateFault extends S.TaggedError<InvalidCacheClusterStateFault>()(
  "InvalidCacheClusterStateFault",
  {},
  T.AwsQueryError({ code: "InvalidCacheClusterState", httpResponseCode: 400 }),
) {}
export class InvalidARNFault extends S.TaggedError<InvalidARNFault>()(
  "InvalidARNFault",
  {},
  T.AwsQueryError({ code: "InvalidARN", httpResponseCode: 400 }),
) {}
export class InvalidReplicationGroupStateFault extends S.TaggedError<InvalidReplicationGroupStateFault>()(
  "InvalidReplicationGroupStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidReplicationGroupState",
    httpResponseCode: 400,
  }),
) {}
export class InvalidServerlessCacheStateFault extends S.TaggedError<InvalidServerlessCacheStateFault>()(
  "InvalidServerlessCacheStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidServerlessCacheStateFault",
    httpResponseCode: 400,
  }),
) {}
export class ReservedCacheNodeNotFoundFault extends S.TaggedError<ReservedCacheNodeNotFoundFault>()(
  "ReservedCacheNodeNotFoundFault",
  {},
  T.AwsQueryError({ code: "ReservedCacheNodeNotFound", httpResponseCode: 404 }),
) {}
export class SnapshotNotFoundFault extends S.TaggedError<SnapshotNotFoundFault>()(
  "SnapshotNotFoundFault",
  {},
  T.AwsQueryError({ code: "SnapshotNotFoundFault", httpResponseCode: 404 }),
) {}
export class ServiceUpdateNotFoundFault extends S.TaggedError<ServiceUpdateNotFoundFault>()(
  "ServiceUpdateNotFoundFault",
  {},
  T.AwsQueryError({
    code: "ServiceUpdateNotFoundFault",
    httpResponseCode: 404,
  }),
) {}
export class CacheSecurityGroupAlreadyExistsFault extends S.TaggedError<CacheSecurityGroupAlreadyExistsFault>()(
  "CacheSecurityGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheSecurityGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class ClusterQuotaForCustomerExceededFault extends S.TaggedError<ClusterQuotaForCustomerExceededFault>()(
  "ClusterQuotaForCustomerExceededFault",
  {},
  T.AwsQueryError({
    code: "ClusterQuotaForCustomerExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InsufficientCacheClusterCapacityFault extends S.TaggedError<InsufficientCacheClusterCapacityFault>()(
  "InsufficientCacheClusterCapacityFault",
  {},
  T.AwsQueryError({
    code: "InsufficientCacheClusterCapacity",
    httpResponseCode: 400,
  }),
) {}
export class TagQuotaPerResourceExceeded extends S.TaggedError<TagQuotaPerResourceExceeded>()(
  "TagQuotaPerResourceExceeded",
  {},
  T.AwsQueryError({
    code: "TagQuotaPerResourceExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidVPCNetworkStateFault extends S.TaggedError<InvalidVPCNetworkStateFault>()(
  "InvalidVPCNetworkStateFault",
  {},
  T.AwsQueryError({
    code: "InvalidVPCNetworkStateFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidCacheSecurityGroupStateFault extends S.TaggedError<InvalidCacheSecurityGroupStateFault>()(
  "InvalidCacheSecurityGroupStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "InvalidCacheSecurityGroupState",
    httpResponseCode: 400,
  }),
) {}
export class SnapshotAlreadyExistsFault extends S.TaggedError<SnapshotAlreadyExistsFault>()(
  "SnapshotAlreadyExistsFault",
  {},
  T.AwsQueryError({
    code: "SnapshotAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidCredentialsException extends S.TaggedError<InvalidCredentialsException>()(
  "InvalidCredentialsException",
  {},
  T.AwsQueryError({
    code: "InvalidCredentialsException",
    httpResponseCode: 408,
  }),
) {}
export class ServerlessCacheSnapshotAlreadyExistsFault extends S.TaggedError<ServerlessCacheSnapshotAlreadyExistsFault>()(
  "ServerlessCacheSnapshotAlreadyExistsFault",
  {},
  T.AwsQueryError({
    code: "ServerlessCacheSnapshotAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidSnapshotStateFault extends S.TaggedError<InvalidSnapshotStateFault>()(
  "InvalidSnapshotStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSnapshotState", httpResponseCode: 400 }),
) {}
export class UserNotFoundFault extends S.TaggedError<UserNotFoundFault>()(
  "UserNotFoundFault",
  {},
  T.AwsQueryError({ code: "UserNotFound", httpResponseCode: 404 }),
) {}
export class CacheSubnetQuotaExceededFault extends S.TaggedError<CacheSubnetQuotaExceededFault>()(
  "CacheSubnetQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheSubnetQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class InvalidKMSKeyFault extends S.TaggedError<InvalidKMSKeyFault>()(
  "InvalidKMSKeyFault",
  {},
  T.AwsQueryError({ code: "InvalidKMSKeyFault", httpResponseCode: 400 }),
) {}
export class NodeQuotaForClusterExceededFault extends S.TaggedError<NodeQuotaForClusterExceededFault>()(
  "NodeQuotaForClusterExceededFault",
  {},
  T.AwsQueryError({
    code: "NodeQuotaForClusterExceeded",
    httpResponseCode: 400,
  }),
) {}
export class NodeGroupsPerReplicationGroupQuotaExceededFault extends S.TaggedError<NodeGroupsPerReplicationGroupQuotaExceededFault>()(
  "NodeGroupsPerReplicationGroupQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "NodeGroupsPerReplicationGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class NodeQuotaForCustomerExceededFault extends S.TaggedError<NodeQuotaForCustomerExceededFault>()(
  "NodeQuotaForCustomerExceededFault",
  {},
  T.AwsQueryError({
    code: "NodeQuotaForCustomerExceeded",
    httpResponseCode: 400,
  }),
) {}
export class InvalidUserStateFault extends S.TaggedError<InvalidUserStateFault>()(
  "InvalidUserStateFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidUserState", httpResponseCode: 400 }),
) {}
export class ReservedCacheNodeAlreadyExistsFault extends S.TaggedError<ReservedCacheNodeAlreadyExistsFault>()(
  "ReservedCacheNodeAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedCacheNodeAlreadyExists",
    httpResponseCode: 404,
  }),
) {}
export class AuthorizationNotFoundFault extends S.TaggedError<AuthorizationNotFoundFault>()(
  "AuthorizationNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "AuthorizationNotFound", httpResponseCode: 404 }),
) {}
export class ReplicationGroupAlreadyUnderMigrationFault extends S.TaggedError<ReplicationGroupAlreadyUnderMigrationFault>()(
  "ReplicationGroupAlreadyUnderMigrationFault",
  {},
  T.AwsQueryError({
    code: "ReplicationGroupAlreadyUnderMigrationFault",
    httpResponseCode: 400,
  }),
) {}
export class APICallRateForCustomerExceededFault extends S.TaggedError<APICallRateForCustomerExceededFault>()(
  "APICallRateForCustomerExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "APICallRateForCustomerExceeded",
    httpResponseCode: 400,
  }),
) {}
export class CacheParameterGroupAlreadyExistsFault extends S.TaggedError<CacheParameterGroupAlreadyExistsFault>()(
  "CacheParameterGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheParameterGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class CacheSecurityGroupQuotaExceededFault extends S.TaggedError<CacheSecurityGroupQuotaExceededFault>()(
  "CacheSecurityGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "QuotaExceeded.CacheSecurityGroup",
    httpResponseCode: 400,
  }),
) {}
export class ServerlessCacheSnapshotQuotaExceededFault extends S.TaggedError<ServerlessCacheSnapshotQuotaExceededFault>()(
  "ServerlessCacheSnapshotQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "ServerlessCacheSnapshotQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class SnapshotFeatureNotSupportedFault extends S.TaggedError<SnapshotFeatureNotSupportedFault>()(
  "SnapshotFeatureNotSupportedFault",
  {},
  T.AwsQueryError({
    code: "SnapshotFeatureNotSupportedFault",
    httpResponseCode: 400,
  }),
) {}
export class SnapshotQuotaExceededFault extends S.TaggedError<SnapshotQuotaExceededFault>()(
  "SnapshotQuotaExceededFault",
  {},
  T.AwsQueryError({
    code: "SnapshotQuotaExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class UserAlreadyExistsFault extends S.TaggedError<UserAlreadyExistsFault>()(
  "UserAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserAlreadyExists", httpResponseCode: 400 }),
) {}
export class UserGroupAlreadyExistsFault extends S.TaggedError<UserGroupAlreadyExistsFault>()(
  "UserGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserGroupAlreadyExists", httpResponseCode: 400 }),
) {}
export class DefaultUserAssociatedToUserGroupFault extends S.TaggedError<DefaultUserAssociatedToUserGroupFault>()(
  "DefaultUserAssociatedToUserGroupFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "DefaultUserAssociatedToUserGroup",
    httpResponseCode: 400,
  }),
) {}
export class ReservedCacheNodesOfferingNotFoundFault extends S.TaggedError<ReservedCacheNodesOfferingNotFoundFault>()(
  "ReservedCacheNodesOfferingNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedCacheNodesOfferingNotFound",
    httpResponseCode: 404,
  }),
) {}
export class NoOperationFault extends S.TaggedError<NoOperationFault>()(
  "NoOperationFault",
  {},
  T.AwsQueryError({ code: "NoOperationFault", httpResponseCode: 400 }),
) {}
export class InvalidSubnet extends S.TaggedError<InvalidSubnet>()(
  "InvalidSubnet",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "InvalidSubnet", httpResponseCode: 400 }),
) {}
export class ReservedCacheNodeQuotaExceededFault extends S.TaggedError<ReservedCacheNodeQuotaExceededFault>()(
  "ReservedCacheNodeQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReservedCacheNodeQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class TagNotFoundFault extends S.TaggedError<TagNotFoundFault>()(
  "TagNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "TagNotFound", httpResponseCode: 404 }),
) {}
export class NodeGroupNotFoundFault extends S.TaggedError<NodeGroupNotFoundFault>()(
  "NodeGroupNotFoundFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "NodeGroupNotFoundFault", httpResponseCode: 404 }),
) {}
export class AuthorizationAlreadyExistsFault extends S.TaggedError<AuthorizationAlreadyExistsFault>()(
  "AuthorizationAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "AuthorizationAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class CacheParameterGroupQuotaExceededFault extends S.TaggedError<CacheParameterGroupQuotaExceededFault>()(
  "CacheParameterGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheParameterGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}
export class GlobalReplicationGroupAlreadyExistsFault extends S.TaggedError<GlobalReplicationGroupAlreadyExistsFault>()(
  "GlobalReplicationGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "GlobalReplicationGroupAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class ReplicationGroupAlreadyExistsFault extends S.TaggedError<ReplicationGroupAlreadyExistsFault>()(
  "ReplicationGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReplicationGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class ServerlessCacheAlreadyExistsFault extends S.TaggedError<ServerlessCacheAlreadyExistsFault>()(
  "ServerlessCacheAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServerlessCacheAlreadyExistsFault",
    httpResponseCode: 400,
  }),
) {}
export class UserQuotaExceededFault extends S.TaggedError<UserQuotaExceededFault>()(
  "UserQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserQuotaExceeded", httpResponseCode: 400 }),
) {}
export class UserGroupQuotaExceededFault extends S.TaggedError<UserGroupQuotaExceededFault>()(
  "UserGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "UserGroupQuotaExceeded", httpResponseCode: 400 }),
) {}
export class SubnetInUse extends S.TaggedError<SubnetInUse>()(
  "SubnetInUse",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetInUse", httpResponseCode: 400 }),
) {}
export class TestFailoverNotAvailableFault extends S.TaggedError<TestFailoverNotAvailableFault>()(
  "TestFailoverNotAvailableFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "TestFailoverNotAvailableFault",
    httpResponseCode: 400,
  }),
) {}
export class CacheClusterAlreadyExistsFault extends S.TaggedError<CacheClusterAlreadyExistsFault>()(
  "CacheClusterAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "CacheClusterAlreadyExists", httpResponseCode: 400 }),
) {}
export class CacheSubnetGroupAlreadyExistsFault extends S.TaggedError<CacheSubnetGroupAlreadyExistsFault>()(
  "CacheSubnetGroupAlreadyExistsFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheSubnetGroupAlreadyExists",
    httpResponseCode: 400,
  }),
) {}
export class ServerlessCacheQuotaForCustomerExceededFault extends S.TaggedError<ServerlessCacheQuotaForCustomerExceededFault>()(
  "ServerlessCacheQuotaForCustomerExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ServerlessCacheQuotaForCustomerExceededFault",
    httpResponseCode: 400,
  }),
) {}
export class SubnetNotAllowedFault extends S.TaggedError<SubnetNotAllowedFault>()(
  "SubnetNotAllowedFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({ code: "SubnetNotAllowedFault", httpResponseCode: 400 }),
) {}
export class ReplicationGroupNotUnderMigrationFault extends S.TaggedError<ReplicationGroupNotUnderMigrationFault>()(
  "ReplicationGroupNotUnderMigrationFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "ReplicationGroupNotUnderMigrationFault",
    httpResponseCode: 400,
  }),
) {}
export class CacheSubnetGroupQuotaExceededFault extends S.TaggedError<CacheSubnetGroupQuotaExceededFault>()(
  "CacheSubnetGroupQuotaExceededFault",
  { message: S.optional(S.String) },
  T.AwsQueryError({
    code: "CacheSubnetGroupQuotaExceeded",
    httpResponseCode: 400,
  }),
) {}

//# Operations
/**
 * Deletes a cache subnet group.
 *
 * You cannot delete a default cache subnet group or one that is associated with any
 * clusters.
 */
export const deleteCacheSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCacheSubnetGroupMessage,
    output: DeleteCacheSubnetGroupResponse,
    errors: [CacheSubnetGroupInUse, CacheSubnetGroupNotFoundFault],
  }),
);
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
export const describeCacheClusters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCacheClustersMessage,
    output: CacheClusterMessage,
    errors: [
      CacheClusterNotFoundFault,
      InvalidParameterCombinationException,
      InvalidParameterValueException,
    ],
  }),
);
/**
 * Returns a list of cache parameter group descriptions. If a cache parameter group name
 * is specified, the list contains only the descriptions for that group.
 */
export const describeCacheParameterGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeCacheParameterGroupsMessage,
    output: CacheParameterGroupsMessage,
    errors: [
      CacheParameterGroupNotFoundFault,
      InvalidParameterCombinationException,
      InvalidParameterValueException,
    ],
  }));
/**
 * Returns a list of cache security group descriptions. If a cache security group name is
 * specified, the list contains only the description of that group. This applicable only
 * when you have ElastiCache in Classic setup
 */
export const describeCacheSecurityGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCacheSecurityGroupsMessage,
    output: CacheSecurityGroupMessage,
    errors: [
      CacheSecurityGroupNotFoundFault,
      InvalidParameterCombinationException,
      InvalidParameterValueException,
    ],
  }),
);
/**
 * Returns a list of cache subnet group descriptions. If a subnet group name is
 * specified, the list contains only the description of that group. This is applicable only
 * when you have ElastiCache in VPC setup. All ElastiCache clusters now launch in VPC by
 * default.
 */
export const describeCacheSubnetGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCacheSubnetGroupsMessage,
    output: CacheSubnetGroupMessage,
    errors: [CacheSubnetGroupNotFoundFault],
  }),
);
/**
 * Returns information about a particular global replication group. If no identifier is
 * specified, returns information about all Global datastores.
 */
export const describeGlobalReplicationGroups =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeGlobalReplicationGroupsMessage,
    output: DescribeGlobalReplicationGroupsResult,
    errors: [
      GlobalReplicationGroupNotFoundFault,
      InvalidParameterCombinationException,
      InvalidParameterValueException,
    ],
  }));
/**
 * Remove a secondary cluster from the Global datastore using the Global datastore name.
 * The secondary cluster will no longer receive updates from the primary cluster, but will
 * remain as a standalone cluster in that Amazon region.
 */
export const disassociateGlobalReplicationGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Provides the functionality to export the serverless cache snapshot data to Amazon S3. Available for Valkey and Redis OSS only.
 */
export const exportServerlessCacheSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Used to failover the primary region to a secondary region. The secondary region will
 * become primary, and all other clusters will become secondary.
 */
export const failoverGlobalReplicationGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Lists all available node types that you can scale with your cluster's replication
 * group's current node type.
 *
 * When you use the `ModifyCacheCluster` or
 * `ModifyReplicationGroup` operations to scale your cluster or replication
 * group, the value of the `CacheNodeType` parameter must be one of the node
 * types returned by this operation.
 */
export const listAllowedNodeTypeModifications =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Modifies the parameters of a cache parameter group. You can modify up to 20 parameters
 * in a single request by submitting a list parameter name and value pairs.
 */
export const modifyCacheParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyCacheParameterGroupMessage,
    output: CacheParameterGroupNameMessage,
    errors: [
      CacheParameterGroupNotFoundFault,
      InvalidCacheParameterGroupStateFault,
      InvalidGlobalReplicationGroupStateFault,
      InvalidParameterCombinationException,
      InvalidParameterValueException,
    ],
  }),
);
/**
 * Modifies the settings for a Global datastore.
 */
export const modifyGlobalReplicationGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const rebalanceSlotsInGlobalReplicationGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: RebalanceSlotsInGlobalReplicationGroupMessage,
    output: RebalanceSlotsInGlobalReplicationGroupResult,
    errors: [
      GlobalReplicationGroupNotFoundFault,
      InvalidGlobalReplicationGroupStateFault,
      InvalidParameterValueException,
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
export const rebootCacheCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: RebootCacheClusterMessage,
  output: RebootCacheClusterResult,
  errors: [CacheClusterNotFoundFault, InvalidCacheClusterStateFault],
}));
/**
 * Modifies the parameters of a cache parameter group to the engine or system default
 * value. You can reset specific parameters by submitting a list of parameter names. To
 * reset the entire cache parameter group, specify the `ResetAllParameters` and
 * `CacheParameterGroupName` parameters.
 */
export const resetCacheParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ResetCacheParameterGroupMessage,
    output: CacheParameterGroupNameMessage,
    errors: [
      CacheParameterGroupNotFoundFault,
      InvalidCacheParameterGroupStateFault,
      InvalidGlobalReplicationGroupStateFault,
      InvalidParameterCombinationException,
      InvalidParameterValueException,
    ],
  }),
);
/**
 * Apply the service update. For more information on service updates and applying them,
 * see Applying Service
 * Updates.
 */
export const batchApplyUpdateAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchApplyUpdateActionMessage,
    output: UpdateActionResultsMessage,
    errors: [InvalidParameterValueException, ServiceUpdateNotFoundFault],
  }),
);
/**
 * Stop the service update. For more information on service updates and stopping them,
 * see Stopping
 * Service Updates.
 */
export const batchStopUpdateAction = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: BatchStopUpdateActionMessage,
    output: UpdateActionResultsMessage,
    errors: [InvalidParameterValueException, ServiceUpdateNotFoundFault],
  }),
);
/**
 * Decreases the number of node groups in a Global datastore
 */
export const decreaseNodeGroupsInGlobalReplicationGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes the specified cache parameter group. You cannot delete a cache parameter group
 * if it is associated with any cache clusters. You cannot delete the default cache
 * parameter groups in your account.
 */
export const deleteCacheParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCacheParameterGroupMessage,
    output: DeleteCacheParameterGroupResponse,
    errors: [
      CacheParameterGroupNotFoundFault,
      InvalidCacheParameterGroupStateFault,
      InvalidParameterCombinationException,
      InvalidParameterValueException,
    ],
  }),
);
/**
 * Deletes a cache security group.
 *
 * You cannot delete a cache security group if it is associated with any
 * clusters.
 */
export const deleteCacheSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DeleteCacheSecurityGroupMessage,
    output: DeleteCacheSecurityGroupResponse,
    errors: [
      CacheSecurityGroupNotFoundFault,
      InvalidCacheSecurityGroupStateFault,
      InvalidParameterCombinationException,
      InvalidParameterValueException,
    ],
  }),
);
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
export const deleteGlobalReplicationGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DeleteGlobalReplicationGroupMessage,
    output: DeleteGlobalReplicationGroupResult,
    errors: [
      GlobalReplicationGroupNotFoundFault,
      InvalidGlobalReplicationGroupStateFault,
      InvalidParameterValueException,
    ],
  }));
/**
 * Deletes a specified existing serverless cache.
 *
 * `CreateServerlessCacheSnapshot` permission is required to create a final snapshot.
 * Without this permission, the API call will fail with an `Access Denied` exception.
 */
export const deleteServerlessCache = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Deletes an existing serverless cache snapshot. Available for Valkey, Redis OSS and Serverless Memcached only.
 */
export const deleteServerlessCacheSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Deletes an existing snapshot. When you receive a successful response from this
 * operation, ElastiCache immediately begins deleting the snapshot; you cannot cancel or
 * revert this operation.
 *
 * This operation is valid for Valkey or Redis OSS only.
 */
export const deleteSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * For Valkey engine version 7.2 onwards and Redis OSS 6.0 onwards: Deletes a user group. The user group must first
 * be disassociated from the replication group before it can be deleted. For more
 * information, see Using Role Based Access Control (RBAC).
 */
export const deleteUserGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns a list of the available cache engines and their versions.
 */
export const describeCacheEngineVersions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCacheEngineVersionsMessage,
    output: CacheEngineVersionMessage,
    errors: [],
  }),
);
/**
 * Returns the default engine and system parameter information for the specified cache
 * engine.
 */
export const describeEngineDefaultParameters =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeEngineDefaultParametersMessage,
    output: DescribeEngineDefaultParametersResult,
    errors: [
      InvalidParameterCombinationException,
      InvalidParameterValueException,
    ],
  }));
/**
 * Returns events related to clusters, cache security groups, and cache parameter groups.
 * You can obtain events specific to a particular cluster, cache security group, or cache
 * parameter group by providing the name as a parameter.
 *
 * By default, only the events occurring within the last hour are returned; however, you
 * can retrieve up to 14 days' worth of events if necessary.
 */
export const describeEvents = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeEventsMessage,
  output: EventsMessage,
  errors: [
    InvalidParameterCombinationException,
    InvalidParameterValueException,
  ],
}));
/**
 * Returns information about a particular replication group. If no identifier is
 * specified, `DescribeReplicationGroups` returns information about all
 * replication groups.
 *
 * This operation is valid for Valkey or Redis OSS only.
 */
export const describeReplicationGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeReplicationGroupsMessage,
    output: ReplicationGroupMessage,
    errors: [
      InvalidParameterCombinationException,
      InvalidParameterValueException,
      ReplicationGroupNotFoundFault,
    ],
  }),
);
/**
 * Returns information about a specific serverless cache.
 * If no identifier is specified, then the API returns information on all the serverless caches belonging to
 * this Amazon Web Services account.
 */
export const describeServerlessCaches = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeServerlessCachesRequest,
    output: DescribeServerlessCachesResponse,
    errors: [
      InvalidParameterCombinationException,
      InvalidParameterValueException,
      ServerlessCacheNotFoundFault,
    ],
  }),
);
/**
 * Returns information about serverless cache snapshots.
 * By default, this API lists all of the customer’s serverless cache snapshots.
 * It can also describe a single serverless cache snapshot, or the snapshots associated with
 * a particular serverless cache. Available for Valkey, Redis OSS and Serverless Memcached only.
 */
export const describeServerlessCacheSnapshots =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeServerlessCacheSnapshotsRequest,
    output: DescribeServerlessCacheSnapshotsResponse,
    errors: [
      InvalidParameterCombinationException,
      InvalidParameterValueException,
      ServerlessCacheNotFoundFault,
      ServerlessCacheSnapshotNotFoundFault,
    ],
  }));
/**
 * Returns details of the service updates
 */
export const describeServiceUpdates = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeServiceUpdatesMessage,
    output: ServiceUpdatesMessage,
    errors: [
      InvalidParameterCombinationException,
      InvalidParameterValueException,
      ServiceUpdateNotFoundFault,
    ],
  }),
);
/**
 * Returns information about cluster or replication group snapshots. By default,
 * `DescribeSnapshots` lists all of your snapshots; it can optionally
 * describe a single snapshot, or just the snapshots associated with a particular cache
 * cluster.
 *
 * This operation is valid for Valkey or Redis OSS only.
 */
export const describeSnapshots = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeSnapshotsMessage,
  output: DescribeSnapshotsListMessage,
  errors: [
    CacheClusterNotFoundFault,
    InvalidParameterCombinationException,
    InvalidParameterValueException,
    SnapshotNotFoundFault,
  ],
}));
/**
 * Returns a list of user groups.
 */
export const describeUserGroups = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUserGroupsMessage,
  output: DescribeUserGroupsResult,
  errors: [
    InvalidParameterCombinationException,
    ServiceLinkedRoleNotFoundFault,
    UserGroupNotFoundFault,
  ],
}));
/**
 * Returns a list of users.
 */
export const describeUsers = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: DescribeUsersMessage,
  output: DescribeUsersResult,
  errors: [
    InvalidParameterCombinationException,
    ServiceLinkedRoleNotFoundFault,
    UserNotFoundFault,
  ],
}));
/**
 * Increase the number of node groups in the Global datastore
 */
export const increaseNodeGroupsInGlobalReplicationGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: IncreaseNodeGroupsInGlobalReplicationGroupMessage,
    output: IncreaseNodeGroupsInGlobalReplicationGroupResult,
    errors: [
      GlobalReplicationGroupNotFoundFault,
      InvalidGlobalReplicationGroupStateFault,
      InvalidParameterValueException,
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
export const listTagsForResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Modifies a replication group's shards (node groups) by allowing you to add shards,
 * remove shards, or rebalance the keyspaces among existing shards.
 */
export const modifyReplicationGroupShardConfiguration =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * This API modifies the attributes of a serverless cache.
 */
export const modifyServerlessCache = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Changes user password(s) and/or access string.
 */
export const modifyUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Changes the list of users that belong to the user group.
 */
export const modifyUserGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Revokes ingress from a cache security group. Use this operation to disallow access
 * from an Amazon EC2 security group that had been previously authorized.
 */
export const revokeCacheSecurityGroupIngress =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Start the migration of data.
 */
export const startMigration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Async API to test connection between source and target replication group.
 */
export const testMigration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const addTagsToResource = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a new cache security group. Use a cache security group to control access to
 * one or more clusters.
 *
 * Cache security groups are only used when you are creating a cluster outside of an
 * Amazon Virtual Private Cloud (Amazon VPC). If you are creating a cluster inside of a
 * VPC, use a cache subnet group instead. For more information, see CreateCacheSubnetGroup.
 */
export const createCacheSecurityGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: CreateCacheSecurityGroupMessage,
    output: CreateCacheSecurityGroupResult,
    errors: [
      CacheSecurityGroupAlreadyExistsFault,
      CacheSecurityGroupQuotaExceededFault,
      InvalidParameterCombinationException,
      InvalidParameterValueException,
      TagQuotaPerResourceExceeded,
    ],
  }),
);
/**
 * This API creates a copy of an entire ServerlessCache at a specific moment in time. Available for Valkey, Redis OSS and Serverless Memcached only.
 */
export const createServerlessCacheSnapshot =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteCacheCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const deleteReplicationGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * For Valkey engine version 7.2 onwards and Redis OSS 6.0 onwards: Deletes a user. The user will be removed from
 * all user groups and in turn removed from all replication groups. For more information,
 * see Using Role Based Access Control (RBAC).
 */
export const deleteUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Returns the detailed parameter list for a particular cache parameter group.
 */
export const describeCacheParameters = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeCacheParametersMessage,
    output: CacheParameterGroupDetails,
    errors: [
      CacheParameterGroupNotFoundFault,
      InvalidParameterCombinationException,
      InvalidParameterValueException,
    ],
  }),
);
/**
 * Returns information about reserved cache nodes for this account, or about a specified
 * reserved cache node.
 */
export const describeReservedCacheNodes = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeReservedCacheNodesMessage,
    output: ReservedCacheNodeMessage,
    errors: [
      InvalidParameterCombinationException,
      InvalidParameterValueException,
      ReservedCacheNodeNotFoundFault,
    ],
  }),
);
/**
 * Lists available reserved cache node offerings.
 */
export const describeReservedCacheNodesOfferings =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
    input: DescribeReservedCacheNodesOfferingsMessage,
    output: ReservedCacheNodesOfferingMessage,
    errors: [
      InvalidParameterCombinationException,
      InvalidParameterValueException,
      ReservedCacheNodesOfferingNotFoundFault,
    ],
  }));
/**
 * Dynamically increases the number of replicas in a Valkey or Redis OSS (cluster mode disabled)
 * replication group or the number of replica nodes in one or more node groups (shards) of
 * a Valkey or Redis OSS (cluster mode enabled) replication group. This operation is performed with no
 * cluster down time.
 */
export const increaseReplicaCount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Modifies the settings for a cluster. You can use this operation to change one or more
 * cluster configuration parameters by specifying the parameters and the new values.
 */
export const modifyCacheCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const modifyReplicationGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Allows you to purchase a reserved cache node offering. Reserved nodes are not eligible
 * for cancellation and are non-refundable. For more information, see Managing Costs with Reserved Nodes.
 */
export const purchaseReservedCacheNodesOffering =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Removes the tags identified by the `TagKeys` list from the named resource.
 * A tag is a key-value pair where the key and value are case-sensitive. You can use tags
 * to categorize and track all your ElastiCache resources, with the exception of global
 * replication group. When you add or remove tags on replication groups, those actions will
 * be replicated to all nodes in the replication group. For more information, see Resource-level permissions.
 */
export const removeTagsFromResource = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Allows network ingress to a cache security group. Applications using ElastiCache must
 * be running on Amazon EC2, and Amazon EC2 security groups are used as the authorization
 * mechanism.
 *
 * You cannot authorize ingress from an Amazon EC2 security group in one region to an
 * ElastiCache cluster in another region.
 */
export const authorizeCacheSecurityGroupIngress =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a copy of an existing serverless cache’s snapshot. Available for Valkey, Redis OSS and Serverless Memcached only.
 */
export const copyServerlessCacheSnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const copySnapshot = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createCacheParameterGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const createGlobalReplicationGroup =
  /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
export const createReplicationGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * For Valkey engine version 7.2 onwards and Redis OSS 6.0 to 7.1: Creates a user. For more information, see
 * Using Role Based Access Control (RBAC).
 */
export const createUser = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * For Valkey engine version 7.2 onwards and Redis OSS 6.0 to 7.1: Creates a user group. For more
 * information, see Using Role Based Access Control (RBAC)
 */
export const createUserGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Dynamically decreases the number of replicas in a Valkey or Redis OSS (cluster mode disabled)
 * replication group or the number of replica nodes in one or more node groups (shards) of
 * a Valkey or Redis OSS (cluster mode enabled) replication group. This operation is performed with no
 * cluster down time.
 */
export const decreaseReplicaCount = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
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
export const testFailover = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a cluster. All nodes in the cluster run the same protocol-compliant cache
 * engine software, either Memcached, Valkey or Redis OSS.
 *
 * This operation is not supported for Valkey or Redis OSS (cluster mode enabled) clusters.
 */
export const createCacheCluster = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
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
 * Creates a serverless cache.
 */
export const createServerlessCache = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
/**
 * Returns details of the update actions
 */
export const describeUpdateActions = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: DescribeUpdateActionsMessage,
    output: UpdateActionsMessage,
    errors: [
      InvalidParameterCombinationException,
      InvalidParameterValueException,
    ],
  }),
);
/**
 * Modifies an existing cache subnet group.
 */
export const modifyCacheSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
    input: ModifyCacheSubnetGroupMessage,
    output: ModifyCacheSubnetGroupResult,
    errors: [
      CacheSubnetGroupNotFoundFault,
      CacheSubnetQuotaExceededFault,
      InvalidSubnet,
      SubnetInUse,
      SubnetNotAllowedFault,
    ],
  }),
);
/**
 * Complete the migration of data.
 */
export const completeMigration = /*@__PURE__*/ /*#__PURE__*/ API.make(() => ({
  input: CompleteMigrationMessage,
  output: CompleteMigrationResponse,
  errors: [
    InvalidReplicationGroupStateFault,
    ReplicationGroupNotFoundFault,
    ReplicationGroupNotUnderMigrationFault,
  ],
}));
/**
 * Creates a new cache subnet group.
 *
 * Use this parameter only when you are creating a cluster in an Amazon Virtual Private
 * Cloud (Amazon VPC).
 */
export const createCacheSubnetGroup = /*@__PURE__*/ /*#__PURE__*/ API.make(
  () => ({
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
  }),
);
